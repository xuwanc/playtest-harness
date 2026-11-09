(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const ba=["sword-shield","dual-swords","greatsword","staff","bow"],Mg=["wander","follow","keep-distance","attack","idle"],Pp=["spar","wander","follow","keep-distance","attack","idle"],Cp={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},tc=1e-6;function No(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>tc?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>tc?Math.atan2(t.moveX,t.moveZ):n.character.facing}function _g(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>tc){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>tc)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const je=1e-6,xa=Math.PI/180,Qd=-1e9;function Lp(){return{type:"none",lastAt:Qd,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Po(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function au(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function th(n,t,e){var l,d;const i=e.duration>0?e.duration:vc(n,e.type);if(t.kind==="player"){const u=n.playerHurt;if(au(u,e.type,i,e.dirX,e.dirZ),u.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>je){const h=e.knockback*n.config.hits.knockbackDecay;u.knockX=e.dirX*h,u.knockZ=e.dirZ*h}Po(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(au(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>je){const u=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*u,a.hurt.knockZ=e.dirZ*u}n.hitCount+=1,Po(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((l=n.config.hits.hitstopByWeapon)==null?void 0:l[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const u=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[u])}o*=Math.max(0,e.holdMul??1);const c=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;c>0&&n.combat.hitstop<c&&(n.combat.hitstop=c,n.combat.warpPhase=1,n.combat.warp=(d=n.config.hits.hitstopWarp)!=null&&d.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,Po(n,"hitstop",c,a.position))}function jo(n,t,e){th(n,{kind:"dummy",index:t},e)}function bg(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function vc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function ec(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function Dp(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function kp(n){var v,g;const t=n.combat,e=n.character.position,i={active:!1,x:e.x,z:e.z,facing:t.attackFacing,fx:Math.sin(t.attackFacing),fz:Math.cos(t.attackFacing),reach:0,cosArc:1,sweepActive:!1,sweepLo:0,sweepHi:0,slamRadius:0,slamX:e.x,slamZ:e.z};if(t.phase!=="active"||t.weapon==="bow")return i;const a=n.config.hits,s=n.config.combat.weapons[t.weapon],o=s==null?void 0:s.hitWindow,r=o?Math.min(1,Math.max(0,o.start)):0,c=o?Math.min(1,Math.max(r,o.end)):1,l=t.timings.active,d=l>je?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(d<r-je||d>c+je)return i;i.active=!0,i.reach=a.reach[t.weapon]??0,i.cosArc=Math.cos(Math.min(90,Math.max(0,a.arcDeg))*xa);const u=s==null?void 0:s.hitSweep,h=((v=u==null?void 0:u.byCombo)==null?void 0:v[String(t.comboIndex)])??((g=u==null?void 0:u.byCombo)==null?void 0:g["1"]),f=(u==null?void 0:u.tolDeg)??10;if(h){if(typeof h.stabU=="number"){if(d<h.stabU)return i.active=!1,i}else if(h.pts&&h.pts.length>=2){const p=ec(h.pts,0),b=ec(h.pts,d);i.sweepActive=!0,i.sweepLo=Math.min(p,b)-f,i.sweepHi=Math.max(p,b)+f}}const m=s==null?void 0:s.groundSlam;return m&&d>=m.slamU-je&&t.slamAttackId===t.attackId&&(i.slamRadius=Math.max(0,m.radius),i.slamX=e.x+i.fx*Math.min(i.slamRadius*.25,.5),i.slamZ=e.z+i.fz*Math.min(i.slamRadius*.25,.5)),i}function Sg(n,t,e,i){if(!n.active)return!1;const a=t-n.x,s=e-n.z,o=Math.sqrt(a*a+s*s);if(o>n.reach+i||o>je&&(a*n.fx+s*n.fz)/o<n.cosArc)return!1;if(n.sweepActive){const r=Dp(Math.atan2(a,s)/xa-n.facing/xa);if(r<n.sweepLo||r>n.sweepHi)return!1}return!0}function wg(n,t,e,i){if(n.slamRadius<=0)return!1;const a=t-n.slamX,s=e-n.slamZ;return a*a+s*s<=(n.slamRadius+i)*(n.slamRadius+i)}function Eg(n){var w,E;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,c=t.timings.active,l=c>je?Math.min(1,Math.max(0,t.phaseTimer/c)):1;if(l<o-je||l>r+je)return;const d=e.reach[t.weapon]??0,u=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*xa),h=Math.sin(t.attackFacing),f=Math.cos(t.attackFacing),m=n.config.dummies.radius,v=n.config.targeting.idealRange,g=a==null?void 0:a.hitSweep,p=((w=g==null?void 0:g.byCombo)==null?void 0:w[String(t.comboIndex)])??((E=g==null?void 0:g.byCombo)==null?void 0:E["1"]),b=(g==null?void 0:g.tolDeg)??10;let x=0,y=0,S=!1;if(p){if(typeof p.stabU=="number"){if(l<p.stabU)return}else if(p.pts&&p.pts.length>=2){const A=ec(p.pts,0),_=ec(p.pts,l);x=Math.min(A,_)-b,y=Math.max(A,_)+b,S=!0}}for(const A of n.dummies){if(t.hitIds.indexOf(A.id)>=0)continue;const _=A.position.x-i.x,M=A.position.z-i.z,P=Math.hypot(_,M);if(P>d+m)continue;const I=P>je?_/P:h,L=P>je?M/P:f;if(P>je&&(_*h+M*f)/P<u)continue;if(S){const G=Dp(Math.atan2(_,M)/xa-t.attackFacing/xa);if(G<x||G>y)continue}let F="light";t.weapon==="greatsword"?F="knock":t.comboIndex>=3&&(F="heavy");const C=e.knockback[t.weapon]??0;let T=P;C>0&&(T=Math.max(P+C,v));const B=Math.max(0,T-P);jo(n,n.dummies.indexOf(A),{type:F,duration:vc(n,F),dirX:I,dirZ:L,knockback:B}),t.hitIds.push(A.id)}}function Tg(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>je?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-je)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,c=Math.sin(t.attackFacing),l=Math.cos(t.attackFacing),d=n.config.dummies.radius,u=Math.max(0,i.radius),h=i.onlyUnhit!==!1,f=i.type??(t.weapon==="greatsword"?"knock":"heavy"),m=i.knockback??o.knockback[t.weapon]??0,v=n.config.targeting.idealRange,g=i.holdMul??1.6;for(let p=0;p<n.dummies.length;p++){const b=n.dummies[p];if(h&&t.hitIds.indexOf(b.id)>=0)continue;const x=b.position.x-r.x,y=b.position.z-r.z,S=Math.hypot(x,y);if(S>u+d)continue;const w=S>je?x/S:c,E=S>je?y/S:l,A=m>0?Math.max(S+m,v):S,_=Math.max(0,A-S);jo(n,p,{type:f,duration:vc(n,f),dirX:w,dirZ:E,knockback:_,holdMul:g}),t.hitIds.push(b.id)}Po(n,"ground-slam",u,{x:r.x+c*Math.min(u*.25,.5),y:r.y,z:r.z+l*Math.min(u*.25,.5)})}function Ag(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,c=i.fromZ,l=o.x,d=o.z,u=l-r,h=d-c,f=u*u+h*h,m=Math.sin(i.facing),v=Math.cos(i.facing),g=Math.cos(su(s.arcDeg,0,180)*xa),p=n.config.dummies.radius;for(let b=0;b<n.dummies.length;b++){const x=n.dummies[b];if(i.hitIds.indexOf(x.id)>=0)continue;const y=f>je?su(((x.position.x-r)*u+(x.position.z-c)*h)/f,0,1):0,S=r+u*y,w=c+h*y,E=Math.hypot(x.position.x-S,x.position.z-w);let A=!1;if(s.shape==="circle")A=E<=s.radius+p;else if(s.shape==="capsule")A=E<=Math.max(s.radius,s.width)+p;else{const F=x.position.x-l,C=x.position.z-d,T=Math.hypot(F,C),B=T>je?(F*m+C*v)/T>=g:!0;A=T<=s.radius+p&&B||E<=s.width+p}if(!A)continue;const _=x.position.x-r,M=x.position.z-c,P=Math.hypot(_,M);if(P>je&&(_*m+M*v)/P<Math.cos(Math.max(s.arcDeg,90)*xa))continue;const I=P>je?_/P:m,L=P>je?M/P:v;th(n,{kind:"dummy",index:b},{type:s.type,duration:s.duration,dirX:I,dirZ:L,knockback:s.knockback}),i.hitIds.push(x.id),Po(n,"link-hit",x.id,x.position)}}function Rg(n){const t=n.config.hits,e=n.config.dummies.fighters,i=n.character.position;for(const a of n.events){if(a.type!=="dummy-hit")continue;const s=n.dummies[a.value-1];if(!s)continue;const o=s.weapon?t.reach[s.weapon]??t.dummyReach:t.dummyReach,r=i.x-s.position.x,c=i.z-s.position.z,l=Math.hypot(r,c);if(l>o)continue;const d=l>je?r/l:0,u=l>je?c/l:1,f=(s.weapon?Math.max(t.knockback[s.weapon]??0,t.dummyKnockback):t.dummyKnockback)*(s.weapon?(e==null?void 0:e.knockbackScale)??1:1),v=s.weapon==="greatsword"&&s.attackComboLeft<=0?"knock":"light";th(n,{kind:"player"},{type:v,duration:vc(n,v),dirX:d,dirZ:u,knockback:f,sourceId:s.id})}}function Pg(n,t){n.modules.hits&&(n.combat.phase==="active"&&(Eg(n),Tg(n)),Ag(n,t),Rg(n))}function su(n,t,e){return n<t?t:n>e?e:n}const Ip=Math.PI/180,eh=1e-6;function Cg(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function nc(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function zp(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>eh?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Fp(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,eh)&&s<=Math.max(0,e.inputDeadZone)&&!o}function Lg(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Dg(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Fp(n,t,e))return!1;const i=zp(n,t,e.lookRange);if(i===null)return!1;const a=Xe(i-n.character.bodyYaw);return Math.abs(a)>Up(n,e)}function Up(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Ip}function kg(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!Fp(n,e,a)){nc(n);return}const s=zp(n,e,a.lookRange);if(s===null){nc(n);return}const o=n.character,r=Xe(s-o.bodyYaw),c=Math.abs(r),l=Up(n,a),d=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>eh;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const u=Math.min(c,Math.max(0,a.settleDeg)*Ip);i.targetYaw=Xe(o.bodyYaw+i.dir*(c-u)),i.progress=0}if(i.phase==="active"){const u=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/u);const h=Xe(i.targetYaw-i.fromYaw);o.bodyYaw=Xe(i.fromYaw+h*Lg(i.progress)),d||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const va=1e-6;function Xe(n){return Math.atan2(Math.sin(n),Math.cos(n))}function ar(n,t,e,i){const a=Xe(t-n);return n+a*(1-Math.exp(-Math.max(e,va)*i))}function sr(n,t,e,i,a){const o=Xe(t-n)*(1-Math.exp(-Math.max(e,va)*a)),r=Math.max(i,0)*a;return r<=va?n:n+Ls(o,-r,r)}function ou(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,va)*a)),o=Math.max(i,0)*a;return o<=va?n+s:n+Ls(s,-o,o)}function Ls(n,t,e){return n<t?t:n>e?e:n}function ru(n,t,e,i){const a=Xe(t-n),s=Math.abs(a);return s<=i||s<=e?t:Xe(n+Math.sign(a)*Math.max(e,0))}function Ig(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,c=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",l=o&&!c,d=Math.hypot(e.moveX,e.moveZ),u=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>va,h=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=No(n,e);else if(l)i.facing=sr(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(u)i.facing=No(n,e);else if(h)i.facing=n.targeting.targetYaw;else if(d>Math.max(a.facingDeadZone,va)){const M=Math.atan2(e.moveX,e.moveZ),P=a.facingTurnRate*Math.PI/180*t,I=a.facingSnapDeg*Math.PI/180;if(d>=.35)i.facing=ru(i.facing,M,P,I);else if(d>=a.facingMinMagnitude&&Math.abs(Xe(M-i.facing))>a.facingDeadbandDeg*Math.PI/180){const F=ar(i.facing,M,a.facingSmoothRate,t);i.facing=ru(i.facing,F,P,0)}}const f=i.velocity;Math.hypot(f.x,f.z)>.15&&(i.moveYaw=Math.atan2(f.x,f.z));const m=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Dg(n,e)||(l?i.bodyYaw=sr(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=ar(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=l?n.gaze.mainYaw:i.facing:u?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Xe(p-i.bodyYaw))>M&&(p=i.moveYaw)}const b=o||u||g,x=a.maxHeadTurnDeg*Math.PI/180;let y;if(b){const M=l?n.config.gaze.headTurnRate:a.headTurnRate;y=l?sr(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):ar(i.headYaw,p,M,t)}else{const M=Xe(i.headYaw-i.bodyYaw),P=Xe(p-i.bodyYaw),I=Math.abs(P)<Math.abs(M)-1e-9,L=I?n.config.gaze.headReturnRate:a.headTurnRate,F=I?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,C=Number.isFinite(F)?sr(M,P,L,F,t):ar(M,P,L,t);y=i.bodyYaw+C}const S=Xe(y-i.bodyYaw);S>x?y=i.bodyYaw+x:S<-x&&(y=i.bodyYaw-x),i.headYaw=y;const w=n.config.gaze;let E=0;if(l)E=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const P=i.position.y+n.config.characterHeight*Ls(w.eyeHeightRatio,0,1),I=M.position.y+n.config.dummies.height*Ls(w.aimHeightRatio,0,1),L=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);E=Math.atan2(I-P,Math.max(va,L))}}const A=Math.max(0,w.maxHeadPitchDeg)*Math.PI/180;E=Ls(E,-A,A);const _=b?w.headPitchRate:Math.min(w.headPitchRate,w.headReturnRate);i.headPitch=ou(i.headPitch,E,_,Math.max(0,w.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=ou(i.bodyPitch,i.headPitch*Ls(w.bodyPitchScale,0,1),w.bodyPitchRate,Math.max(0,w.maxHeadPitchDeg)*Math.PI/180,t)}const Np=1e-6,yc=Math.PI/180;function Mc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function zg(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*yc,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const c=n.dummies[r],l=c.position.x-i.x,d=c.position.z-i.z,u=Math.hypot(l,d);u<.001||u>s||Math.abs(Xe(Math.atan2(l,d)-t))>a||o.push({i:r,d:u})}return o.sort((r,c)=>r.d-c.d||r.i-c.i),o.map(r=>r.i)}function Fg(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Ug(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*yc,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),c=zg(n,e.channelYaw,t);for(let l=0;l<a;l++){const d=(l-(a-1)*.5)*s,u=e.channelYaw+d,h=(l-(a-1)*.5)*o,f=Math.sin(u),m=Math.cos(u);e.pending.push({delay:l*Math.max(0,t.spawnDelay),x:i.x+f*.5+Math.cos(u)*h,y:i.y+1,z:i.z+m*.5-Math.sin(u)*h,yaw:u,speed:t.speed*(1+(Fg(e.waveIndex,l)*2-1)*r),targetIndex:c.length>0?c[l%c.length]:-1,wave:e.waveIndex})}Mc(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Ng(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*yc,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,Mc(n,"projectile-fire",i.volleyId,o)}i.pending=a}function cu(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,Mc(n,"channel-end",0,n.character.position))}function Og(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",c=n.playerLink,l=s==="skill2"?e.skill2Pressed:e.attackHeld,d=a&&l&&!r&&c.phase==="idle"&&!c.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!d&&(o.needsRelease=!1),o.channeling){if(!d){cu(n,i);return}}else{if(!(d&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),Mc(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=No(n,e),o.fireTimer-=t;let u=0;for(;o.fireTimer<=0&&u++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Np),Ug(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){cu(n,i);break}}function Bg(n,t,e){const i=Math.max(0,e.homingConeDeg)*yc,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Np;for(let c=0;c<n.dummies.length;c++){const l=n.dummies[c],d=l.position.x-t.x,u=l.position.z-t.z,h=Math.hypot(d,u);h<.001||h>r||Math.abs(Xe(Math.atan2(d,u)-s))>i||(o=c,r=h)}return o}function Hg(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=Bg(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const l=n.dummies[r.targetIndex];if(!l)r.targetIndex=-1;else{const d=Math.atan2(l.position.x-r.x,l.position.z-r.z),u=Math.atan2(r.dirX,r.dirZ),h=Xe(d-u),f=r.turnRate*t,m=Math.max(-f,Math.min(f,h)),v=u+m;r.dirX=Math.sin(v),r.dirZ=Math.cos(v)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let c=!1;if(s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],u=d.position.x-r.x,h=d.position.z-r.z,f=r.radius+a;if(!(u*u+h*h>f*f)){jo(n,l,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),c=!0;break}}c||o.push(r)}i.projectiles=o}const Gg={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;Og(n,t,e,s,a,i.cfg.slot),Ng(n,t,s),Hg(n,t,s)}},Yc=1e-6;function Op(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Xg(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),Op(n,"ring-place",i.id,e)}function Vg(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let c=0;for(;r.pulseTimer<=0&&c++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Yc),s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],u=d.position.x-r.x,h=d.position.z-r.z,f=r.radius+a;if(u*u+h*h>f*f)continue;const m=Math.hypot(u,h),v=m>Yc?u/m:0,g=m>Yc?h/m:1;jo(n,l,{type:"heavy",duration:e.stun,dirX:v,dirZ:g,knockback:e.knockback})}Op(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const Wg={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&Xg(n,s),Vg(n,t,s)}},Yg={channelVolley:Gg,groundRing:Wg};function $g(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function Zg(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=Yg[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function jg(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Bp(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function qg(n,t,e){Zg(n,t,e)}function $c(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const lu=1e-6;function du(n,t,e){return n<t?t:n>e?e:n}function Hp(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Gp(n){const t=n.camera,e=Hp();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Kg(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const l of n.dummies){const d=l.position.x-i.x,u=l.position.z-i.z,h=Math.hypot(d,u);if(h>e.radius)continue;const f=du((e.radius-h)/Math.max(lu,e.radius-e.nearDistance),0,1);let m=f*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(m+=e.attackBoost*f),a+=m,s+=l.position.x*m,o+=l.position.z*m,r+=1}const c=a<=0?0:du(a/(a+Math.max(lu,e.saturation)),0,1);if(t.threat=c,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=s/a,d=o/a;t.centroidX=l,t.centroidZ=d;let u=(l-i.x)*e.framingBias*c,h=(d-i.z)*e.framingBias*c;const f=Math.hypot(u,h);f>e.maxOffset&&(u=u/f*e.maxOffset,h=h/f*e.maxOffset),t.offsetX=u,t.offsetZ=h}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Jg(n){const t=[];if(n.slabs&&n.slabs.length>0)for(const e of n.slabs)t.push({id:`ground-${e.plotId}`,kind:"ground",minX:e.minX,maxX:e.maxX,minY:e.top-e.thickness,maxY:e.top,minZ:e.minZ,maxZ:e.maxZ});else{const e=n.ground.size;t.push(ds("ground","ground",0,0,e,e,-n.ground.thickness,0))}for(const e of n.steps)t.push(ds(e.id,"step",e.x,e.z,e.width,e.depth,0,e.height));for(const e of n.doorways){const i=e.openingWidth/2,a=e.wallThickness;t.push(ds(`${e.id}-left`,"wall",e.x-i-e.wallSpan/2,e.z,e.wallSpan,a,0,e.wallHeight)),t.push(ds(`${e.id}-right`,"wall",e.x+i+e.wallSpan/2,e.z,e.wallSpan,a,0,e.wallHeight)),t.push(ds(`${e.id}-lintel`,"lintel",e.x,e.z,e.openingWidth,a,e.openingHeight,e.wallHeight))}for(const e of n.obstacles)t.push(ds(e.id,"obstacle",e.x,e.z,e.width,e.depth,0,e.height));return t}function ds(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const nh={cellSize:.5,cellMeters:5,columns:6,maxRows:32,spawnDz:0,labelInset:.9,defaultRadius:2,defaultShape:"circle",defaultColor:"#7fd8c0",defaultSpan:[2,2],slabThickness:.4,boundInset:.5};function Ue(n){return Math.round(n*1e6)/1e6}function hu(n,t){const e=n??t.defaultSpan;return[Math.max(1,Math.round(e[0])),Math.max(1,Math.round(e[1]))]}function Qg(n,t=nh){var ht,yt,Lt,q;const e={duplicates:[],unplaced:[]},i=t.cellMeters,a=new Set,s=[];for(const k of n)if(!(!k||typeof k.id!="string"||k.id.length===0)){if(a.has(k.id)){e.duplicates.push(k.id);continue}a.add(k.id),s.push(k)}const o=[...s].sort((k,Z)=>k.id<Z.id?-1:k.id>Z.id?1:0),r=new Map,c=(k,Z,j)=>{if(k<0||Z<0||k+j[0]>t.columns||Z+j[1]>t.maxRows)return!1;for(let pt=0;pt<j[0];pt++)for(let dt=0;dt<j[1];dt++)if(r.has(`${k+pt},${Z+dt}`))return!1;return!0},l=(k,Z,j,pt)=>{for(let dt=0;dt<pt[0];dt++)for(let _t=0;_t<pt[1];_t++)r.set(`${Z+dt},${j+_t}`,k)},d=[];for(const k of o){if(k.pin!=="origin")continue;const Z=hu(k.span,t);c(0,0,Z)&&(l(k.id,0,0,Z),d.push({def:k,c:0,r:0,span:Z,pin:!0,slot:0}))}const u=t.columns*t.maxRows;for(const k of o){if(d.some(_t=>_t.def.id===k.id))continue;const Z=hu(k.span,t);let j=-1;for(let _t=0;_t<u;_t++){const Yt=_t%t.columns,J=Math.floor(_t/t.columns);if(c(Yt,J,Z)){j=_t;break}}if(j<0){e.unplaced.push(k.id);continue}const pt=j%t.columns,dt=Math.floor(j/t.columns);l(k.id,pt,dt,Z),d.push({def:k,c:pt,r:dt,span:Z,pin:!1,slot:j})}const h=d.map(k=>({...k,minX0:k.c*i,maxX0:(k.c+k.span[0])*i,minZ0:k.r*i,maxZ0:(k.r+k.span[1])*i}));if(h.length===0)return{plots:[],stations:[],grassPlots:[],destructibles:[],slabs:[],bounds:{minX:0,maxX:0,minZ:0,maxZ:0},steps:[],doorways:[],obstacles:[],dummySpawns:[],diagnostics:e};const f=Math.min(...h.map(k=>k.minX0)),m=Math.max(...h.map(k=>k.maxX0)),v=Math.min(...h.map(k=>k.minZ0)),g=Math.max(...h.map(k=>k.maxZ0)),p=h.find(k=>k.pin),b=p?(p.minX0+p.maxX0)/2:(f+m)/2,x=p?(p.minZ0+p.maxZ0)/2:(v+g)/2,y=-b,S=-x;let E=o.reduce((k,Z)=>typeof Z.index=="number"?Math.max(k,Z.index):k,0);const A=new Map;for(const k of h)A.set(k.def.id,typeof k.def.index=="number"?k.def.index:++E);const _=new Set,M=(k,Z)=>{if(!_.has(Z))return _.add(Z),Z;let j=`${k}/${Z}`,pt=2;for(;_.has(j);)j=`${k}/${Z}#${pt++}`;return _.add(j),j},P=[],I=[],L=[],F=[],C=[],T=[];for(const k of h){const Z=k.def,j=Z.id,pt=A.get(j)??0,dt=Ue((k.minX0+k.maxX0)/2+y),_t=Ue((k.minZ0+k.maxZ0)/2+S),Yt={plotId:j,cell:{c:k.c,r:k.r},span:k.span,minX:Ue(k.minX0+y),maxX:Ue(k.maxX0+y),minZ:Ue(k.minZ0+S),maxZ:Ue(k.maxZ0+S),top:0,thickness:t.slabThickness};I.push(Yt);const J=Z.radius??t.defaultRadius,W=Z.shape??t.defaultShape,O=Z.color??t.defaultColor,Pt={dx:((ht=Z.spawn)==null?void 0:ht.dx)??0,dz:((yt=Z.spawn)==null?void 0:yt.dz)??t.spawnDz},ot=-(k.span[1]*i)/2+t.labelInset,at={dx:((Lt=Z.label)==null?void 0:Lt.dx)??0,dz:((q=Z.label)==null?void 0:q.dz)??ot},Tt={id:j,index:pt,name:Z.name,hint:Z.hint,shape:W,x:dt,z:_t,radius:J,spawnX:Ue(dt+Pt.dx),spawnZ:Ue(_t+Pt.dz),labelX:Ue(dt+at.dx),labelZ:Ue(_t+at.dz),color:O},mt=[];if(Z.grass){const D=Z.grass,R=D.absolute?0:Math.round(dt/t.cellSize),Q=D.absolute?0:Math.round(_t/t.cellSize),ut={minCellX:D.minCellX+R,maxCellX:D.maxCellX+R,minCellZ:D.minCellZ+Q,maxCellZ:D.maxCellZ+Q};D.density!==void 0&&(ut.density=D.density),D.clearMarginCells!==void 0&&(ut.clearMarginCells=D.clearMarginCells),mt.push(ut)}const zt=[];if(Z.destructibles)for(const D of Z.destructibles)zt.push({id:M(j,D.id),kind:D.kind,x:Ue(dt+D.dx),y:D.y??0,z:Ue(_t+D.dz),height:D.height,radius:D.radius,tiltDeg:D.tiltDeg,pitchGain:D.pitchGain,maxTiltDeg:D.maxTiltDeg,fallSec:D.fallSec,bands:D.bands?[...D.bands]:void 0,color:D.color,cutColor:D.cutColor});for(const D of Z.steps??[])L.push({id:M(j,D.id),x:Ue(dt+D.dx),z:Ue(_t+D.dz),width:D.width,depth:D.depth,height:D.height});for(const D of Z.doorways??[])F.push({id:M(j,D.id),x:Ue(dt+D.dx),z:Ue(_t+D.dz),openingWidth:D.openingWidth,openingHeight:D.openingHeight,wallThickness:D.wallThickness,wallSpan:D.wallSpan,wallHeight:D.wallHeight});for(const D of Z.obstacles??[])C.push({id:M(j,D.id),x:Ue(dt+D.dx),z:Ue(_t+D.dz),width:D.width,depth:D.depth,height:D.height});for(const D of Z.dummies??[]){const R={plotId:j,x:Ue(dt+D.dx),z:Ue(_t+D.dz)};D.mode!==void 0&&(R.mode=D.mode),D.fighter&&(R.fighter=!0),D.weapon!==void 0&&(R.weapon=D.weapon),T.push(R)}P.push({id:j,index:pt,name:Z.name,hint:Z.hint,owner:Z.owner??"",centerX:dt,centerZ:_t,placement:k.pin?"pinned":"auto",slot:k.pin?-1:k.slot,cell:{c:k.c,r:k.r},span:k.span,slab:Yt,shape:W,radius:J,color:O,station:Tt,grassPlots:mt,destructibles:zt,testSpawn:Z.testSpawn})}const B=Math.max(...h.map(k=>k.c+k.span[0])),G=Math.max(...h.map(k=>k.r+k.span[1]));for(let k=0;k<G;k++){let Z=0;for(;Z<B;){if(r.has(`${Z},${k}`)){Z++;continue}const j=Z;for(;Z<B&&!r.has(`${Z},${k}`);)Z++;I.push({plotId:"",cell:{c:j,r:k},span:[Z-j,1],minX:Ue(j*i+y),maxX:Ue(Z*i+y),minZ:Ue(k*i+S),maxZ:Ue((k+1)*i+S),top:0,thickness:t.slabThickness})}}P.sort((k,Z)=>k.index-Z.index),I.sort((k,Z)=>{const j=A.get(k.plotId)??Number.MAX_SAFE_INTEGER,pt=A.get(Z.plotId)??Number.MAX_SAFE_INTEGER;return j-pt||k.cell.r-Z.cell.r||k.cell.c-Z.cell.c});const $=[...P].sort((k,Z)=>k.id<Z.id?-1:k.id>Z.id?1:0),it={minX:Ue(Math.min(...I.map(k=>k.minX))+t.boundInset),maxX:Ue(Math.max(...I.map(k=>k.maxX))-t.boundInset),minZ:Ue(Math.min(...I.map(k=>k.minZ))+t.boundInset),maxZ:Ue(Math.max(...I.map(k=>k.maxZ))-t.boundInset)};return{plots:P,stations:P.map(k=>k.station),grassPlots:P.flatMap(k=>k.grassPlots),destructibles:$.flatMap(k=>k.destructibles),slabs:I,bounds:it,steps:L,doorways:F,obstacles:C,dummySpawns:T,diagnostics:e}}function tx(n,t,e,i=nh){t.stations=e.stations,t.slabs=e.slabs,t.steps=e.steps,t.doorways=e.doorways,t.obstacles=e.obstacles,t.destructibles=e.destructibles,t.grass&&(t.grass.plots=e.grassPlots),t.ground={size:Math.max(e.bounds.maxX-e.bounds.minX,e.bounds.maxZ-e.bounds.minZ),thickness:i.slabThickness},n.worldBounds={...e.bounds};const a=t.grid.cellSize;t.grid={cellSize:a,minX:Math.floor(e.bounds.minX/a)*a,maxX:Math.ceil(e.bounds.maxX/a)*a,minZ:Math.floor(e.bounds.minZ/a)*a,maxZ:Math.ceil(e.bounds.maxZ/a)*a};const s=e.dummySpawns.filter(c=>!c.fighter),o=e.dummySpawns.filter(c=>c.fighter),r=n.dummies.initialModes;if(n.dummies.count=s.length,n.dummies.spawn=s.map(c=>({x:c.x,z:c.z})),n.dummies.initialModes=s.map((c,l)=>c.mode??r[l]??"idle"),n.dummies.fighters){const c=n.dummies.fighters,l=c.weapons;if(c.spawn=o.map(d=>({x:d.x,z:d.z})),c.weapons=o.map((d,u)=>d.weapon??l[u%l.length]),c.initialModes){const d=c.initialModes;c.initialModes=o.map((u,h)=>d[h%d.length])}}}const ta=1e-6;function ic(n,t,e){return n<t?t:n>e?e:n}function Oo(n,t,e,i,a,s,o){const r=a*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+s+ta||l.maxY<i-o-ta||t+r<l.minX||t-r>l.maxX||e+r<l.minZ||e-r>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Xp(n,t,e,i,a=0,s=.05){let o=Number.NEGATIVE_INFINITY;for(const r of n)r.maxY>i+s||t<r.minX||t>r.maxX||e<r.minZ||e>r.maxZ||r.maxY>o&&(o=r.maxY);return o===Number.NEGATIVE_INFINITY?a:o}function ih(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const c of n){if(c.maxY<=t.y+a+ta||c.minY>=o-ta)continue;const l=ic(t.x,c.minX,c.maxX),d=ic(t.z,c.minZ,c.maxZ),u=t.x-l,h=t.z-d,f=u*u+h*h;if(!(f>=e*e))if(s=!0,f>ta*ta){const m=Math.sqrt(f),v=(e-m)/m;t.x+=u*v,t.z+=h*v}else{const m=t.x-c.minX,v=c.maxX-t.x,g=t.z-c.minZ,p=c.maxZ-t.z,b=Math.min(m,v,g,p);b===m?t.x=c.minX-e:b===v?t.x=c.maxX+e:b===g?t.z=c.minZ-e:t.z=c.maxZ+e}}return s}function ah(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+ta||o.minY>=s-ta)continue;const r=ic(t.x,o.minX,o.maxX),c=ic(t.z,o.minZ,o.maxZ),l=t.x-r,d=t.z-c;if(l*l+d*d<e*e-ta)return!0}return!1}const ma=1e-6,Gs=Math.PI/180;function sh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Xl(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Vp(n){n.arrows.length=0}function ex(n,t,e,i,a,s,o,r,c,l,d){const u=i-n,h=s-e,f=u*u+h*h;let m=0;f>ma&&(m=((o-n)*u+(r-e)*h)/f,m=Math.max(0,Math.min(1,m)));const v=n+u*m,g=e+h*m,p=v-o,b=g-r;if(p*p+b*b>d*d)return-1;const x=t+(a-t)*m;return x<c-.1||x>c+l?-1:m}function nx(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=ma)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*Gs,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let c=-1,l=i+ma;for(const d of n.dummies){if(!n.modules.dummies)break;const u=d.position.x-a.x,h=d.position.z-a.z,f=Math.hypot(u,h);if(!(f<.001||f>i)){if(d.id===r)return d.id;Math.abs(sh(Math.atan2(u,h)-t))>s||f<l&&(c=d.id,l=f)}}return c}function ix(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*Gs;return t+zs(sh(s-t),-o,o)}function ax(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*Gs),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*Gs),a<=0)return r;const c=n.dummies.find(v=>v.id===a);if(!c)return r;const l=Math.hypot(c.position.x-t,c.position.z-i);if(l<.4)return r;const d=l/Math.max(ma,s),u=c.position.y+n.config.dummies.height*zs(o.aimHeightRatio,0,1),h=Math.max(0,o.gravity),f=(u-e+.5*h*d*d)/d,m=zs(f,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function sx(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=nx(n,e),c=ix(n,e,r),l=Math.sin(c),d=Math.cos(c),u=o.x+Math.sin(e)*.55,h=o.z+Math.cos(e)*.55,f=o.y+.95,m=ax(n,u,f,h,r,s),v={id:++n.arrowSeq,x:u,y:f,z:h,vx:l*m.horizontal,vy:m.vy,vz:d*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*Gs};return n.arrows.push(v),Xl(n,"arrow-shot",a,v),v}function zs(n,t,e){return n<t?t:n>e?e:n}function ox(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),c=[];for(const l of e){if(l.stuck){if(l.rest-=t,l.rest<=0)continue;if(l.stuckDummy>=0){const y=n.dummies[l.stuckDummy];if(y){const S=Math.cos(y.bodyYaw),w=Math.sin(y.bodyYaw);l.x=y.position.x+l.offX*S+l.offZ*w,l.y=y.position.y+l.offY,l.z=y.position.z-l.offX*w+l.offZ*S,l.yaw=y.bodyYaw+l.localYaw}}c.push(l);continue}if(l.life-=t,l.life<=0)continue;const d=l.x,u=l.y,h=l.z;if(l.homing>0&&(l.homing=Math.max(0,l.homing-t),l.targetId>0&&l.turnRate>0)){const y=n.dummies.find(S=>S.id===l.targetId);if(!y)l.targetId=0;else{const S=Math.hypot(l.vx,l.vz);if(S>ma){const w=Math.atan2(y.position.x-l.x,y.position.z-l.z),E=Math.atan2(l.vx,l.vz),A=l.turnRate*t,_=E+zs(sh(w-E),-A,A);l.vx=Math.sin(_)*S,l.vz=Math.cos(_)*S;const M=Math.hypot(y.position.x-l.x,y.position.z-l.z);if(M>.3){const P=M/S,L=(y.position.y+s*zs(i.aimHeightRatio,0,1)-l.y+.5*r*P*P)/P,F=Math.max(0,i.verticalTurnRate)*t;l.vy+=zs(L-l.vy,-F,F)}}}}l.yaw=Math.atan2(l.vx,l.vz),l.pitch=-Math.atan2(l.vy,Math.hypot(l.vx,l.vz)),l.vy-=r*t;const f=d+l.vx*t,m=u+l.vy*t,v=h+l.vz*t;let g=-1,p=2;if(o)for(let y=0;y<n.dummies.length;y++){const S=n.dummies[y],w=ex(d,u,h,f,m,v,S.position.x,S.position.z,S.position.y,s,a+i.radius);w>=0&&w<p&&(p=w,g=y)}if(g>=0){const y=n.dummies[g];l.x=d+(f-d)*p,l.y=u+(m-u)*p,l.z=h+(v-h)*p,l.stuck=!0,l.stuckDummy=g;const S=Math.cos(y.bodyYaw),w=Math.sin(y.bodyYaw),E=l.x-y.position.x,A=l.z-y.position.z;l.offX=E*S-A*w,l.offZ=E*w+A*S,l.offY=l.y-y.position.y;const _=Math.atan2(l.vx,l.vz);l.localYaw=_-y.bodyYaw,l.yaw=_,l.pitch=Math.atan2(-l.vy,Math.hypot(l.vx,l.vz)),l.rest=Math.max(.2,i.stickSec),l.hit=!0;const M=Math.hypot(l.vx,l.vz);jo(n,g,{type:"light",duration:.22,dirX:M>ma?l.vx/M:0,dirZ:M>ma?l.vz/M:1,knockback:.14}),Xl(n,"arrow-land",y.id,l),c.push(l);continue}const b=Oo(n.boxes,f,v,m+.4,.04,0,6),x=Number.isFinite(b)?b:0;if(m<=x+.02&&l.vy<0){l.x=f,l.y=x+Math.max(0,i.groundStickLift),l.z=v,l.stuck=!0,l.stuckDummy=-1,l.yaw=Math.atan2(l.vx,l.vz);const y=Math.atan2(-l.vy,Math.max(ma,Math.hypot(l.vx,l.vz)));l.pitch=Math.max(y,Math.max(0,i.stickMinPitchDeg)*Gs),l.rest=Math.max(.2,i.stickSec),Xl(n,"arrow-land",-1,l),c.push(l);continue}l.x=f,l.y=m,l.z=v,c.push(l)}n.arrows=c}const Vl=1e-6,rx=Math.PI/180;function Wl(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function oh(n,t,e){return n<t?t:n>e?e:n}function _c(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Yl(n){const t=n.id,e=n.windowId;Object.assign(n,_c()),n.id=t,n.windowId=e}function cx(n){Yl(n)}function Wp(n){Yl(n.playerLink);for(const t of n.dummies)Yl(t.link)}function lx(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function $l(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function ac(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,_c()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function dx(n,t){const e=n.config.links.search,i=n.character.position,a=oh(e.maxAngleDeg,0,180)*rx;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,d=c.position.z-i.z,u=Math.hypot(l,d);if(u<Vl||u>e.range)continue;const h=Math.atan2(l,d);Math.abs(Xe(h-t))>a||u<r&&(r=u,s=c.id,o=h)}return{id:s,yaw:o,dist:s>0?r:0}}function hx(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=No(n,t),c=dx(n,r),l=c.id>0?c.yaw:r,d=c.id>0?oh(c.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=l,s.targetId=c.id,s.targetDist=c.dist,s.travel=d,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Wl(n,"link-start",s.id)}function ux(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){ac(n);return}if(e.weapon!==n.combat.weapon){ac(n);return}e.timer+=t;const a=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const c=a(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Wl(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Wl(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?oh(r/o,0,1):1,e.phase==="active"&&i.active>Vl){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Vl,i.active-e.timer),d=c/l;n.impulse.x=Math.sin(e.facing)*d,n.impulse.z=Math.cos(e.facing)*d}}function fx(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&ac(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&$l(n,"sprint"),a.prevSprinting=r,ux(n,t);const c=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&hx(n,e,c,o.weapon)}const Xr={windup:0,active:1,recovery:2},uu=1e-9;function Yp(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function px(n){return n==="windup"||n==="active"||n==="recovery"}function mx(n,t){return Xr[n]+Yp(t)}function gx(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!px(s.at))continue;const o=Yp(s.u??0),r=Xr[s.at]+o;r>i+uu&&r<=e+uu&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>Xr[s.at]+s.u-(Xr[o.at]+o.u)),a}const Bo=1e-6;function ga(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function xx(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function $p(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function bc(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=$p()}function Zp(n){return{weapon:ba[Math.max(0,n-1)]??ba[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:$p()}}function vx(n,t){return No(n,t)}function yx(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function jp(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=vx(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,ga(n,"attack-start",i)}function qp(n){return Math.max(0,n.config.combat.settle)}function Zl(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];jp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:qp(n),lunge:yx(n,i.lunge[e-1]??0)},e)}function fu(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,jp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:qp(n),lunge:i.lunge},0),sx(n,e,n.combat.attackFacing),ga(n,"charge-release",e)}function Mx(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),c=a+(1-a)*r;if(e.warp=c,e.warpDebt+=t*(1-c),o>=1){e.warpPhase=3,e.warpTimer=0;const l=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,l)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function _x(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=Mx(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const d=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<d)break;if(i.phaseTimer-=d,i.phase==="windup")i.phase="active",ga(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,ga(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&Zl(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const d=i.timings.recovery;if(d>Bo&&i.phaseTimer>=d*n.config.combat.cancelWindow){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&Zl(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}const c=a.windup+a.active+a.recovery;let l=0;i.phase==="windup"?l=i.phaseTimer:i.phase==="active"?l=a.windup+i.phaseTimer:i.phase==="recovery"?l=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(l=c),i.phase!=="idle"&&(i.attackProgress=c>0?Math.min(1,l/c):1),bx(n)}function bx(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>Bo?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:mx(t.phase,a);if(s<=t.notifyCursor+Bo)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of gx(o,t.notifyCursor,s))xx(n,r.name,r.value);t.notifyCursor=s}function Sx(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=ba.length){const c=ba[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,bc(n),ac(n),ga(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,ga(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),_x(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!c&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const d=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Zl(n,e,d)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,ga(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,Bo)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const c=i.charge;i.charge=0,fu(n,e,c)}}else if(i.charging){i.charging=!1;const c=i.charge;i.charge=0,c>=a.bow.minChargeToFire?fu(n,e,c):ga(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>Bo)){const c=i.timings.active,l=Math.max(0,i.timings.lunge),d=Math.max(.2,a.lungeCurve),u=g=>l*(1-Math.pow(1-Math.min(1,Math.max(0,g/c)),d+1)),h=t*i.warp,f=Math.min(c,Math.max(0,i.phaseTimer)),m=Math.min(c,Math.max(0,i.phaseTimer-h));let v=Math.max(0,u(f)-u(m))/Math.max(h,1e-4);v=Math.min(v,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*v,n.impulse.z=Math.cos(i.attackFacing)*v}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const pn=1e-6,jl=Math.PI*2,wx=7,Ex=18,Kp=1.3,Jp=.4,Tx=.9,pu=.9;function mu(n,t,e,i){const a=Math.max(e,.1),s=((n+t*2.37)%a+a)%a,o=Math.min(Math.max(i,0),1)*a;if(o<=pn||s>=o)return 0;const r=Math.min(Math.max(a*.12,.15),o*.5),c=Math.min(1,Math.min(s/r,(o-s)/r));return c*c*(3-2*c)}function Ax(n,t){const e=Math.hypot(n,t);return e<=1?{x:n,z:t}:{x:n/e,z:t/e}}function Rx(n){return Math.atan2(Math.sin(n),Math.cos(n))}function gu(n,t,e,i){return n+Rx(t-n)*(1-Math.exp(-Math.max(e,pn)*i))}function sc(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Px(n){var i;const t=[];for(let a=0;a<n.count;a++){const s=n.spawn[a]??{x:0,z:0},o=n.initialModes[a]??"idle";t.push(ql(a+1,o,s.x,s.z,null))}const e=n.fighters;if(e)for(let a=0;a<e.weapons.length;a++){const s=e.spawn[a]??{x:0,z:0},o=((i=e.initialModes)==null?void 0:i[a])??"spar",r=e.attackInterval*(.25+.22*a);t.push(ql(t.length+1,o,s.x,s.z,e.weapons[a],r))}return t}function ql(n,t,e,i,a,s=0){return{id:n,mode:t,initialMode:t,homeX:e,homeZ:i,position:{x:e,y:0,z:i},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:e,targetZ:i,wanderTimer:0,attackCooldown:s,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,attackComboIndex:0,attackComboLeft:0,comboGap:0,hurt:Lp(),link:_c(),weapon:a,combat:a?{...Zp(ba.indexOf(a)+1),weapon:a}:null}}function Cx(n,t=!1){const e=t?Pp:Mg,i=e.indexOf(n);return e[(i+1)%e.length]}function Qp(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0,i.attackComboIndex=0,i.attackComboLeft=0,i.comboGap=0;const o=i.hurt;if(o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,cx(i.link),i.combat){const r=i.combat;r.phase="idle",r.comboIndex=0,r.phaseTimer=0,r.attackProgress=0,r.attackFacing=0,r.charging=!1,r.charge=0,r.hitstop=0,r.warp=1,r.warpPhase=0,r.warpDebt=0,r.warpTimer=0,r.hitIds.length=0,r.timings={windup:0,active:0,recovery:0,settle:0,lunge:0}}}n.dummyAttackCount=0}function Lx(n,t,e){const i=$c(n)*jl,a=Math.sqrt($c(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+$c(n)*.8)}function rh(n,t,e){if(t.weapon){const i=n.config.combat.weapons[t.weapon];if(i)return{windup:i.windup,active:i.active,recovery:i.recovery}}return{windup:e.attackWindup,active:e.attackActive,recovery:e.attackRecovery}}function Kl(n,t,e){var s;if(!t.weapon)return e.attackRange;const i=n.config.hits.reach[t.weapon]??e.attackRange,a=((s=e.fighters)==null?void 0:s.attackRangeScale)??.9;return Math.max(.4,i*a)}function Jl(n,t){return n.weapon&&t.fighters?t.fighters.attackInterval:t.attackInterval}function Dx(n,t){return n.weapon&&t.fighters?Math.max(t.leashRadius,t.fighters.leashRadius):t.leashRadius}function kx(n,t,e){const i=rh(e,n,t);return n.attackPhase==="windup"?i.windup:n.attackPhase==="active"?i.active:n.attackPhase==="recovery"?i.recovery:0}function Ix(n,t,e){var s;if(!t.weapon)return 1;const i=((s=e.fighters)==null?void 0:s.comboCount)??0;if(i>0)return Math.max(1,Math.round(i));const a=n.config.combat.weapons[t.weapon];return Math.max(1,Math.round((a==null?void 0:a.comboCount)??1))}function zx(n,t){var i;const e=((i=t.fighters)==null?void 0:i.comboGap)??0;return e>0?e:Math.max(0,n.config.combat.settle)}function Fx(n){return n.attackPhase!=="idle"||n.attackComboLeft>0}function Ux(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0,xu(n,t,i);return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const c=Math.max(kx(t,i,n),pn);if(t.attackPhaseTimer<c)break;t.attackPhaseTimer-=c,t.attackPhase==="windup"?(t.attackPhase="active",sc(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0,t.attackComboLeft>0?t.comboGap=zx(n,i):(t.attackComboIndex=0,t.weapon&&t.attackCooldown<=0&&(t.attackCooldown=Jl(t,i)*Jp)))}const s=rh(n,t,i),o=s.windup+s.active+s.recovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=s.windup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=s.windup+s.active+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||o<=0?0:Math.min(1,r/o),xu(n,t,i)}function xu(n,t,e){const i=t.combat;if(!i)return;const a=rh(n,t,e),s=t.attackPhase==="idle"&&t.attackComboLeft>0&&t.comboGap>0;i.weapon=t.weapon??i.weapon,i.phase=s?"settle":t.attackPhase,i.comboIndex=t.attackComboIndex,i.phaseTimer=t.attackPhaseTimer,i.attackProgress=s?1:t.attackProgress,i.attackFacing=t.facing,i.timings={windup:a.windup,active:a.active,recovery:a.recovery,settle:0,lunge:0},i.hitstop=0,i.warp=1,i.warpPhase=0,i.charging=!1,i.charge=0}function Nx(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>pn?a/o:0,c=o>pn?s/o:0;let l=0,d=0;if(t.mode==="wander"){const h=t.targetX-t.position.x,f=t.targetZ-t.position.z,m=Math.hypot(h,f);(t.wanderTimer<=0||m<.3)&&Lx(n,t,e);const v=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(v,g);p>pn&&(l=v/p,d=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(l=r,d=c);else if(t.mode==="keep-distance"){const h=o-e.keepDistance,f=Math.max(e.keepDeadZone,.2),m=Math.max(-1,Math.min(1,h/f))*pu,v=mu(n.time,t.id,e.strafePeriod,e.strafeDuty)*e.keepStrafe;l=r*m-c*v,d=c*m+r*v}else if(t.mode==="attack")o>Kl(n,t,e)&&t.attackPhase==="idle"&&(l=r,d=c);else if(t.mode==="spar"){const h=Kl(n,t,e),f=h*1.7;if(Fx(t))o>h*Kp?(l=r,d=c):o<h*.55&&(l=-r*.6,d=-c*.6);else if(t.attackPhase==="idle"&&t.attackCooldown<=0&&o>h)l=r,d=c;else{const v=Math.max(-1,Math.min(1,(o-f)/.5))*pu,g=mu(n.time,t.id,e.strafePeriod,e.strafeDuty)*Tx;l=r*v-c*g,d=c*v+r*g}}({x:l,z:d}=Ax(l,d));let u=t.facing;if(t.mode==="wander"?Math.hypot(l,d)>pn&&(u=Math.atan2(l,d)):o>pn&&(u=Math.atan2(r,c)),e.leashRadius>pn&&t.mode!=="wander"&&t.mode!=="idle"){const h=Dx(t,e),f=t.position.x-t.homeX,m=t.position.z-t.homeZ,v=Math.hypot(f,m);if(v>h){const g=Math.min(1,(v-h)/Math.max(h*.5,.5)),p=-f/v,b=-m/v;l=l*(1-g)+p*g,d=d*(1-g)+b*g;const x=Math.hypot(l,d);x>pn&&(l/=x,d/=x)}}return{x:l,z:d,facing:u}}function Ox(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.comboGap=Math.max(0,e.comboGap-t),e.hurt.timer>0&&(e.attackComboLeft=0,e.comboGap=0),(e.mode==="attack"||e.mode==="spar")&&e.attackPhase==="idle"&&e.hurt.timer<=0){const b=n.character.position,x=Math.hypot(b.x-e.position.x,b.z-e.position.z),y=Kl(n,e,i);if(e.attackComboLeft>0)e.comboGap<=0&&(x<=y*Kp+pn?(e.attackComboIndex+=1,e.attackComboLeft-=1,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,n.dummyAttackCount+=1,sc(n,"dummy-attack",e)):(e.attackComboLeft=0,e.attackComboIndex=0,e.attackCooldown=Math.max(e.attackCooldown,Jl(e,i)*Jp)));else if(e.attackCooldown<=0&&x<=y+pn){const S=Ix(n,e,i);e.attackComboIndex=1,e.attackComboLeft=Math.max(0,S-1),e.comboGap=0,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=Jl(e,i),n.dummyAttackCount+=1,sc(n,"dummy-attack",e)}}Ux(n,e,t,i);const a=Nx(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-pn||a.x<0&&e.position.x<=s.minX+pn)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-pn||a.z<0&&e.position.z<=s.minZ+pn)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,pn)*t),r=e.weapon&&i.fighters?i.fighters.moveSpeed:i.moveSpeed;e.velocity.x+=(a.x*r-e.velocity.x)*o,e.velocity.z+=(a.z*r-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=gu(e.bodyYaw,e.facing,wx,t),e.headYaw=gu(e.headYaw,e.facing,Ex,t);const c=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const d=n.config.stepHeight;if(ih(n.boxes,e.position,i.radius,i.height,d))if(ah(n.boxes,e.position,i.radius,i.height,d))e.position.x=c,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const b=e.position.x-c,x=e.position.z-l;Math.abs(b)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const h=n.config.worldBounds;e.position.x<h.minX?(e.position.x=h.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>h.maxX&&(e.position.x=h.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<h.minZ?(e.position.z=h.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>h.maxZ&&(e.position.z=h.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const f=Oo(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,d,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+d+pn&&(e.position.y=f);const m=Math.hypot(e.position.x-c,e.position.z-l);e.distance+=m;const v=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,v/Math.max(n.config.moveSpeed,pn)),p=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),pn);e.stride=p,e.gaitPhase=(e.gaitPhase+m/p*jl)%jl}function Bx(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=Cx(a.mode,!!a.weapon),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,a.attackComboIndex=0,a.attackComboLeft=0,a.comboGap=0,a.combat&&(a.combat.phase="idle",a.combat.attackProgress=0,a.combat.comboIndex=0),sc(n,"dummy-mode",a)}for(const a of n.dummies)Ox(n,t,a,i)}const Hx=["idle","attack","keep-distance"],Gx=["sword-shield","dual-swords","greatsword"];function Ql(n,t){const e=n.dummies.length,i=n.dummies.filter(a=>a.spawnedByPlot?t!==void 0&&a.spawnedByPlot!==t:!0);n.dummies=i;for(let a=0;a<n.dummies.length;a++)n.dummies[a].id=a+1;return e-n.dummies.length}function Xx(n,t){var h,f;const e=t.testSpawn??{},i=Math.max(0,Math.floor(e.dummies??0)),a=Math.max(0,Math.floor(e.fighters??0));Ql(n,t.id);const s=i+a;if(s===0)return 0;const o=Math.max(.4,e.ringRadius??1.6),r=e.startDeg??-90,c=e.modes??Hx,l=e.weapons??((h=n.config.dummies.fighters)==null?void 0:h.weapons)??Gx,d=((f=n.config.dummies.fighters)==null?void 0:f.attackInterval)??3.4,u=[];for(let m=0;m<s;m++){const v=(r+360*m/s)*Math.PI/180,g=t.centerX+Math.cos(v)*o,p=t.centerZ+Math.sin(v)*o,b=m>=i,x=m-i,y=b?"spar":c[m%c.length],S=b?l[x%l.length]:null,w=b?d*(.25+.22*x):0,E=ql(n.dummies.length+u.length+1,y,g,p,S,w);E.spawnedByPlot=t.id,u.push(E)}return n.dummies.push(...u),u.length}function Vx(n){let t=0;for(const e of n.dummies)e.spawnedByPlot&&t++;return t}const td=1e-6;function Zc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Wx(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function tm(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function vu(n,t,e){return n<t?t:n>e?e:n}function Yx(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,d=s.x,u=s.z;for(;l<c-td;){const h=Math.min(c,l+r),f=s.x+t*h,m=s.z+e*h,v=vu(f,o.minX,o.maxX),g=vu(m,o.minZ,o.maxZ),p={x:v,y:s.y,z:g};if(ah(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(d=v,u=g,l=h,v!==f||g!==m))break}return{x:d,z:u}}function $x(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,$l(n,"roll")),i.cooldown>0){const c=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),c>0&&i.cooldown===0&&Zc(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&bc(n));const c=_g(n,e),l=c.x,d=c.z,u=n.combat.weapon==="staff";if(i.kind=u?"blink":"roll",i.dirX=l,i.dirZ=d,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=u?a.blinkCooldown:a.rollCooldown,u){const h=Yx(n,l,d);n.character.position.x=h.x,n.character.position.z=h.z,i.toX=h.x,i.toZ=h.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),$l(n,"blink"),Zc(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(td,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+l*a.rollDistance,i.toZ=i.fromZ+d*a.rollDistance,Zc(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const c=Math.max(td,i.timer),l=n.character.position.x,d=n.character.position.z;n.impulse.x=(i.toX-l)/c,n.impulse.z=(i.toZ-d)/c}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const vi=1e-6,yu=Math.PI*2;function Mu(n,t){return Math.sqrt(n*n+t*t)}function or(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Zx(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,bc(n)}function jx(n,t,e){const i=n.character,a=n.config,s=Oo(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,bc(n),Wp(n),tm(n),Bp(n),Vp(n),nc(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Qd,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function qx(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,c=Number.isFinite(e.moveZ)?e.moveZ:0;const l=Mu(r,c);l>1&&(r/=l,c/=l);const d=i.worldBounds;(r>0&&s.x>=d.maxX-vi||r<0&&s.x<=d.minX+vi)&&(r=0),(c>0&&s.z>=d.maxZ-vi||c<0&&s.z<=d.minZ+vi)&&(c=0);const u=n.combat.phase!=="idle",h=n.playerLink.phase!=="idle",f=n.dash.phase==="active",m=u||f||h;a.sprinting=!m&&e.sprintHeld&&l>vi;const v=i.combat.weapons[n.combat.weapon];let g=v?v.moveMultiplier:1;f||h?g=0:u?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const L=m?i.skillDecel:l>vi?i.acceleration:i.friction,F=1-Math.exp(-L*t);o.x+=(r*p-o.x)*F,o.z+=(c*p-o.z)*F}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,or(n,"jumped",i.jumpSpeed)),n.events.some(L=>L.type==="blink"&&L.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,y=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,ih(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(ah(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=y,o.x=0,o.z=0;else{const L=s.x-x,F=s.z-y;Math.abs(L)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(F)<Math.abs(o.z*t)*.5&&(o.z=0)}or(n,"blocked",1)}s.x<d.minX?(s.x=d.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>d.maxX&&(s.x=d.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<d.minZ?(s.z=d.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>d.maxZ&&(s.z=d.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const w=Oo(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&w>s.y+vi&&w-s.y<=i.stepHeight+vi&&(s.y=w,o.y=0,or(n,"stepUp",w));const E=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const A=Oo(n.boxes,s.x,s.z,E,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);A>Number.NEGATIVE_INFINITY&&s.y<=A&&o.y<=0?(s.y=A,o.y=0,a.grounded||or(n,"landed",A),a.grounded=!0):a.grounded=!1;const _=Mu(s.x-x,s.z-y);a.distance+=_;const M=_/Math.max(t,vi),P=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,vi)),I=Math.max(i.strideLength*(1+P*i.strideSpeedGain),vi);a.stride=I,a.gaitPhase=(a.gaitPhase+_/I*yu)%yu}const ed=1e-6,_u=2.399963229728653;function Xa(n,t,e){return n<t?t:n>e?e:n}function bu(n,t,e,i,a,s,o,r,c){const l=t.x-n.x,d=t.z-n.z,u=Math.hypot(l,d),h=e+i;if(u>=h)return;let f,m,v;u<ed?(f=r,m=c,v=h):(f=l/u,m=d/u,v=h-u);const g=v+o;n.x-=f*g*a,n.z-=m*g*a,t.x+=f*g*s,t.z+=m*g*s}function Kx(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let d=0;d<o;d++){for(let u=0;u<e.length;u++)for(let h=u+1;h<e.length;h++){const f=(u*3+h)*_u;bu(e[u].position,e[h].position,s,s,.5,.5,r,Math.cos(f),Math.sin(f))}for(let u=0;u<e.length;u++){const h=(u+1)*_u;bu(i,e[u].position,a,s,0,1,r,Math.cos(h),Math.sin(h))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const d of e)ih(n.boxes,d.position,s,n.config.dummies.height,c),d.position.x=Xa(d.position.x,l.minX,l.maxX),d.position.z=Xa(d.position.z,l.minZ,l.maxZ)}function Jx(n,t,e,i,a,s,o,r){const c=Math.hypot(e,i),l=Math.max(0,r.contactBand),d=Xa(r.minScale,0,1);if(c<ed||l<=0||d>=1)return 1;const u=a+o,h=Xa(r.approachDot,0,.99);let f=0;for(const m of s){const v=m.position.x-n,g=m.position.z-t,p=Math.hypot(v,g);if(p>=u+l)continue;if(p<ed){f=1;continue}const b=(e*v+i*g)/(c*p);if(b<=h)continue;const x=Xa(1-(p-u)/l,0,1),y=Xa((b-h)/(1-h),0,1);f=Math.max(f,x*y)}return 1-(1-d)*Xa(f,0,1)}function Qx(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Jx(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const jc=1e-6,tv=Math.PI/180;function ev(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function nv(n,t,e){return n<t?t:n>e?e:n}function iv(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>jc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>jc&&(o=Math.atan2(e.moveX,e.moveZ));const c=nv(i.maxAngleDeg,0,180)*tv;let l=Number.POSITIVE_INFINITY,d=0,u=0,h=0;for(const f of n.dummies){const m=f.position.x-s.x,v=f.position.z-s.z,g=Math.hypot(m,v);if(g<jc||g>i.range)continue;const p=Math.atan2(m,v),b=Math.abs(Xe(p-o));if(b>c)continue;const x=g-i.frontBias*Math.cos(b);x<l&&(l=x,d=f.id,u=p,h=g)}a.targetId=d,a.targetYaw=u,a.targetDist=h,a.hasTarget=d>0}const ki=1e-6;function Ds(n,t,e){return n<t?t:n>e?e:n}function Su(n){return Math.atan2(Math.sin(n),Math.cos(n))}function av(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(L,F)=>{const C=L.position.x-s.x,T=L.position.z-s.z,B=Math.hypot(C,T);if(B<ki||B>F)return 0;const G=Ds((F-B)/Math.max(ki,F-i.nearDistance),0,1);let $=G*(i.modeWeight[L.mode]??.5);return L.attackPhase==="active"&&($+=i.attackBoost*G),$},r=[];let c=0,l=!1,d=!1,u=!1;for(const L of n.dummies){const F=o(L,i.threatRange),C=L.position.x-s.x,T=L.position.z-s.z,B=Math.hypot(C,T);F>0&&(r.push({id:L.id,x:L.position.x,z:L.position.z,dx:C,dz:T,yaw:Math.atan2(C,T),w:F}),c+=F,B<=i.approachDist&&(i.modeWeight[L.mode]??.5)>=i.hostileModeWeight&&(u=!0)),B>ki&&B<=i.recoveryDist&&(l=!0),(L.attackPhase==="windup"||L.attackPhase==="active")&&B<=i.threatRange&&(d=!0)}const h=c<=0?0:Ds(c/(c+Math.max(ki,i.saturation)),0,1),f=r.length>0,m=a.active,v=f&&(e.aimActive&&h>=i.enterThreshold||i.reactToAttack&&d&&h>=i.enterThreshold||i.reactToApproach&&u),g=i.hurtHoldSec>ki&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(l||g);if(a.active=v||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((L,F)=>F.w-L.w);const b=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],y=Math.atan2(x.dx,x.dz),S=i.behindAngleDeg*Math.PI/180,w=n.character.bodyYaw;let E=0,A=0,_=0;for(const L of b){const F=Math.abs(Su(L.yaw-y))/Math.PI;let C=L.w/(1+Math.max(i.spreadFalloff,0)*F*F);L!==x&&i.behindFalloff<1&&Math.abs(Su(L.yaw-w))>S&&(C*=Math.max(i.behindFalloff,0)),E+=L.x*C,A+=L.z*C,_+=C}a.mainId=x.id,a.mainYaw=y;const M=n.dummies.find(L=>L.id===x.id),P=(M?M.position.y:0)+n.config.dummies.height*Ds(i.aimHeightRatio,0,1),I=s.y+n.config.characterHeight*Ds(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(P-I,Math.max(ki,Math.hypot(x.dx,x.dz))),a.centroidYaw=_>ki?Math.atan2(E/_-s.x,A/_-s.z):y,a.threatCount=r.length,a.threat=h}function sv(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function ov(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<ki||a>e.threatRange)return 0;const s=Math.max(ki,e.threatRange-e.nearDistance),o=Ds((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const c=Math.max(ki,e.modeWeight.attack??1.5);return Ds(r/c,0,1)}const ja=1e-6,Xs=Math.PI*2,Ho={enabled:!1,dirDeg:0,speed:0,amplitude:0,wavelength:4,secondWave:{wavelength:2,amplitude:0,speedScale:1},gust:{periodSec:8,depth:0},jitter:0,shadeAmount:0};function em(n){var t;return((t=n==null?void 0:n.grass)==null?void 0:t.wind)??Ho}function Sc(n){return{time:0,gust:1-Math.min(1,Math.max(0,n.gust.depth))}}function rv(n,t,e){if(!t.enabled)return;n.time+=Math.max(0,e);const i=Math.max(.1,t.gust.periodSec),a=Math.min(1,Math.max(0,t.gust.depth));n.gust=1-a+a*(.5+.5*Math.sin(Xs*n.time/i-Math.PI/2))}function cv(n,t,e,i){const a=n.dirDeg*Math.PI/180,s=t*Math.cos(a)+e*Math.sin(a),o=Xs/Math.max(.1,n.wavelength),r=Xs/Math.max(.1,n.secondWave.wavelength);return[o*s+i,r*s+i*1.7]}function nm(n){const t=n.dirDeg*Math.PI/180,e=Xs/Math.max(.1,n.wavelength),i=Xs/Math.max(.1,n.secondWave.wavelength);return{dirX:Math.cos(t),dirZ:Math.sin(t),omega1:e*n.speed,omega2:i*n.speed*n.secondWave.speedScale,amp1:n.amplitude,amp2:n.secondWave.amplitude,shadeAmount:n.shadeAmount}}const lv=.18,wu=.4,dv=.6;function hv(n,t,e){if(n<0)return 0;if(n===0)return 1;if(t<=0)return 0;const i=Math.min(1,Math.max(0,1-n/t)),a=Math.min(1,Math.max(0,e))*lv,s=Math.min(1,Math.max(0,(i-a)/(1-a)));return s*s*(3-2*s)}function uv(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function im(n,t){return n+","+t}function fv(n,t,e){return{spec:e??{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:0,bladesPerPatch:[0,0],avoidMargin:0,seed:0},cellSize:t.cellSize>0?t.cellSize:.5,bucketCells:(n==null?void 0:n.bucketCells)??4,blades:[],patches:[],buckets:{},cutCount:0,lastCutAt:0,wind:Sc((n==null?void 0:n.wind)??Ho)}}function pv(n,t,e,i){const a=t.grass,s=n.grass;if(!a||!s||!s.enabled)return fv(s,i,a);const o=i.cellSize>0?i.cellSize:.5,r=uv(a.seed),c=Math.max(1,Math.floor(s.footprintCells)),l=Math.max(1,s.bucketCells)*o,d=Math.max(o,s.minHeightCells*o),u=Math.max(d,s.maxHeightCells*o),[h,f]=a.bladesPerPatch,m=Math.max(0,Math.floor(h)),v=Math.max(m,Math.floor(f)),g=e.filter(A=>A.kind!=="ground").map(A=>({minX:A.minX-a.avoidMargin,maxX:A.maxX+a.avoidMargin,minZ:A.minZ-a.avoidMargin,maxZ:A.maxZ+a.avoidMargin})),p=[],b=[],x={},y=a.plots??[],S=(A,_)=>{const M=A+c/2,P=_+c/2;for(let I=0;I<y.length;I++){const L=y[I],F=Math.max(0,L.clearMarginCells??0);if(M>=L.minCellX-F&&M<=L.maxCellX+F&&P>=L.minCellZ-F&&P<=L.maxCellZ+F)return!0}return!1},w=(A,_,M)=>{const P=p.length;for(let I=0;I<M;I++){const L=(A+r()*c)*o,F=(_+r()*c)*o;let C=!1;for(let Lt=0;Lt<g.length;Lt++){const q=g[Lt];if(L>=q.minX&&L<=q.maxX&&F>=q.minZ&&F<=q.maxZ){C=!0;break}}if(C)continue;const T=Xp(e,L,F,3,0,.05),B=d+(u-d)*r(),G=(B-d)/Math.max(ja,u-d),$=Math.min(1,Math.max(0,r()*.68+G*.32)),it=p.length;p.push({id:it,x:L,y:T,z:F,yaw:r()*Xs,height:B,width:o*.26,tone:$,lean:(r()-.5)*.24,bend:0,bendX:0,bendZ:0,targetBend:0,recover:0,cut:0,cutAt:0});const ht=im(Math.floor(L/l),Math.floor(F/l)),yt=x[ht];yt?yt.push(it):x[ht]=[it]}p.length>P&&b.push({id:b.length,cellX:A,cellZ:_,bladeFrom:P,bladeTo:p.length})},E=()=>m+Math.floor(r()*(v-m+1));for(let A=a.minCellZ;A+c<=a.maxCellZ;A+=c)for(let _=a.minCellX;_+c<=a.maxCellX;_+=c){const M=r();S(_,A)||M>a.density||w(_,A,E())}for(let A=0;A<y.length;A++){const _=y[A],M=Math.min(1,Math.max(0,_.density??1));for(let P=_.minCellZ;P+c<=_.maxCellZ;P+=c)for(let I=_.minCellX;I+c<=_.maxCellX;I+=c)r()>M||w(I,P,E())}return{spec:a,cellSize:o,bucketCells:s.bucketCells,blades:p,patches:b,buckets:x,cutCount:0,lastCutAt:0,wind:Sc(s.wind??Ho)}}function am(n,t,e,i){const a=Math.max(1,n.bucketCells)*n.cellSize,s=Math.floor((t-i)/a),o=Math.floor((t+i)/a),r=Math.floor((e-i)/a),c=Math.floor((e+i)/a),l=[];for(let d=s;d<=o;d++)for(let u=r;u<=c;u++){const h=n.buckets[im(d,u)];if(h)for(let f=0;f<h.length;f++)l.push(h[f])}return l}function mv(n){const t=n.grass,e=n.config.grass;if(!t||!e||!e.enabled||!n.modules.grass)return 0;const i=kp(n);if(!i.active&&i.slamRadius<=0)return 0;const a=.02,s=Math.max(i.reach,i.slamRadius)+1;let o=0;const r=am(t,i.x,i.z,s);for(let c=0;c<r.length;c++){const l=t.blades[r[c]];if(l.cut!==0||!Sg(i,l.x,l.z,a)&&!wg(i,l.x,l.z,a))continue;l.cut=e.regrow?Math.max(ja,e.regrowSec):-1,l.cutAt=n.time;const d=l.x-i.x,u=l.z-i.z,h=Math.sqrt(d*d+u*u);l.bendX=h>ja?d/h:i.fx,l.bendZ=h>ja?u/h:i.fz,l.bend=Math.min(e.maxBendRad,.55),l.targetBend=0,o+=1}return o>0&&(t.cutCount+=o,t.lastCutAt=n.time,n.events.push({type:"grass-cut",tick:n.tick,x:i.x,y:n.character.position.y,z:i.z,value:o})),o}function gv(n,t){const e=n.grass,i=n.config.grass;if(!e||e.blades.length===0||!i||!i.enabled||!n.modules.grass)return;const a=em(n.config);e.wind||(e.wind=Sc(a)),rv(e.wind,a,t);const s=e.blades,o=s.length,r=new Array(o).fill(0),c=Math.max(0,i.bendRadius)+n.config.characterRadius;for(let m=0;m<o;m++)s[m].targetBend=0;const l=n.character.position.x,d=n.character.position.z,u=(m,v)=>{const g=am(e,m,v,c);for(let p=0;p<g.length;p++){const b=g[p],x=s[b];if(x.cut!==0)continue;const y=x.x-m,S=x.z-v,w=Math.sqrt(y*y+S*S);if(w>c)continue;const E=1-w/c,A=i.maxBendRad*E*E;if(A>x.targetBend){x.targetBend=A;const _=w>ja?1/w:0;x.bendX=w>ja?y*_:0,x.bendZ=w>ja?S*_:1,x.recover=0}r[b]=1}};if(u(l,d),n.modules.dummies)for(let m=0;m<n.dummies.length;m++)u(n.dummies[m].position.x,n.dummies[m].position.z);const h=1-Math.exp(-Math.max(0,i.bendRate)*t),f=1-Math.exp(-Math.max(0,i.recoverRate)*t);for(let m=0;m<o;m++){const v=s[m];v.bend+=(v.targetBend-v.bend)*(v.targetBend>v.bend?h:f),v.bend<1e-4&&(v.bend=0),!r[m]&&v.bend===0&&(v.recover+=t),v.cut>0&&(v.cut-=t,v.cut<=0&&(v.cut=0))}mv(n)}function xv(n){const t=n.grass;if(!t)return;for(let i=0;i<t.blades.length;i++){const a=t.blades[i];a.bend=0,a.targetBend=0,a.bendX=0,a.bendZ=0,a.recover=0,a.cut=0,a.cutAt=0}t.cutCount=0,t.lastCutAt=0;const e=Sc(em(n.config));t.wind.time=e.time,t.wind.gust=e.gust}const fa=1e-6,Eu=Math.PI/180,vv=1.47;function Ba(n,t,e){return n<t?t:n>e?e:n}function yv(n,t,e,i,a,s,o,r){const c=Math.max(fa,e),l=Ba(r.minU??.08,0,1),d=Ba(r.maxU??.92,0,1);let u=Ba((n-t)/c,l,d);const h=r.bands;if(h&&h.length>0){let L=h[0],F=Math.abs(L-u);for(let C=1;C<h.length;C++){const T=Math.abs(h[C]-u);T<F&&(L=h[C],F=T)}u=Ba(L,l,d)}const f=Math.sqrt(a*a+s*s+o*o),m=f>fa?a/f:0,v=f>fa?s/f:0,g=f>fa?o/f:1,p=Math.sqrt(m*m+g*g),b=p>fa?m/p:0,x=p>fa?g/p:1,y=r.pitchGain??.85,S=Ba(r.maxTiltDeg??62,0,89)*Eu,w=Math.max(0,-v);let E=Math.min(S,Ba(r.tiltDeg,0,89)*Eu+w*y);const A=u*c,_=Math.min(A,c-A),M=Math.atan(Math.max(0,_*.9)/Math.max(fa,i));E=Math.min(E,M);const P=Math.tan(E),I=1/Math.sqrt(1+P*P);return{u,theta:E,nx:b*P*I,ny:I,nz:x*P*I,ax:x,ay:0,az:-b}}function Mv(n,t,e,i,a,s,o){const r=e*i,c=1/Math.max(fa,s),l=Math.max(1,Math.floor(t)),d=[];for(let u=0;u<l;u++){const h=u/l*Math.PI*2,f=Math.cos(h)*n,m=Math.sin(h)*n;d.push(Ba(r-(a*f+o*m)*c,0,i))}return d}function _v(n){return!n||n.length===0?[]:n.map(t=>({id:t.id,kind:t.kind,x:t.x,y:t.y,z:t.z,height:t.height,radius:t.radius,tiltDeg:t.tiltDeg??18,pitchGain:t.pitchGain??.85,maxTiltDeg:t.maxTiltDeg??62,fallSec:t.fallSec??.9,bands:t.bands?[...t.bands]:[],color:t.color??"#8a6b4a",cutColor:t.cutColor??"#e8c9a0",broken:0,cutU:1,theta:0,nx:0,ny:1,nz:0,ax:0,ay:0,az:-1,fall:0,brokenAt:0}))}function sm(n,t,e,i,a,s,o){const r=yv(i,t.y,t.height,t.radius,a,s,o,{tiltDeg:t.tiltDeg,bands:t.bands,pitchGain:t.pitchGain,maxTiltDeg:t.maxTiltDeg});t.broken=1,t.cutU=r.u,t.theta=r.theta,t.nx=r.nx,t.ny=r.ny,t.nz=r.nz,t.ax=r.ax,t.ay=r.ay,t.az=r.az,t.fall=0,t.brokenAt=n.time,n.events.push({type:"break",tick:n.tick,x:t.x,y:t.y+r.u*t.height,z:t.z,value:e})}function bv(n,t,e,i,a,s){const o=n.destructibles;if(!o)return!1;for(let r=0;r<o.length;r++){const c=o[r];if(!(c.id!==t||c.broken!==0))return sm(n,c,r,e,i,a,s),!0}return!1}function Sv(n,t,e){const i=n.destructibles;if(!i||i.length===0||!n.modules.destructibles)return;const a=e.breakHits??[],s=a.length>0?kp(n):null;if(!!s&&(s.active||s.slamRadius>0)&&s)for(let r=0;r<a.length;r++){const c=a[r];let l=-1;for(let u=0;u<i.length;u++)if(i[u].id===c.id){l=u;break}if(l<0)continue;const d=i[l];d.broken===0&&sm(n,d,l,c.y,c.dx,c.dy,c.dz)}for(let r=0;r<i.length;r++){const c=i[r];if(c.broken===0)continue;const l=1-Math.exp(-t*3/Math.max(.1,c.fallSec));c.fall+=(vv-c.fall)*l}}function om(n){const t=n.destructibles;if(t)for(let e=0;e<t.length;e++){const i=t[e];i.broken=0,i.cutU=1,i.theta=0,i.nx=0,i.ny=1,i.nz=0,i.ax=0,i.ay=0,i.az=-1,i.fall=0,i.brokenAt=0}}function wv(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function Ev(n,t){const e=Jg(t);return{tick:0,time:0,rngState:2654435769,config:n,boxes:e,gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Zp(1),playerLink:_c(),arrows:[],arrowSeq:0,abilities:jg(),skills:$g(n),impulse:{x:0,z:0},targeting:ev(),turnInPlace:Cg(),playerHurt:Lp(),hitCount:0,dash:{...Wx(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Hp(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:wv(),dummies:Px(n.dummies),dummyAttackCount:0,grass:pv(n,t,e,t.grid),destructibles:_v(t.destructibles),events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0,grass:!0,destructibles:!0}}}function Tv(n){Zx(n),Qp(n),Wp(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Qd,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Bp(n),Vp(n),tm(n),Gp(n),nc(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,xv(n),om(n),n.events.length=0}function Tu(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){Tv(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?iv(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),fx(n,t,e),n.modules.combat&&Sx(n,t,e),n.modules.dash&&$x(n,t,e),n.modules.movement&&qx(n,t,e),n.modules.gaze&&av(n,t,e),n.modules.orientation&&Ig(n,t,e),kg(n,t,e),n.modules.dummies&&Bx(n,t,e),bg(n,t),lx(n,t),n.modules.abilities&&qg(n,t,e),n.modules.combat&&ox(n,t),n.modules.dummies&&(Pg(n,t),n.modules.separation&&(Kx(n),Qx(n))),gv(n,t),Sv(n,t,e),n.modules.camera?Kg(n):Gp(n),n}const rm=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],Au=1e-9;function Av(n,t,e){return n<t?t:n>e?e:n}function cm(n){return Av(Number.isFinite(n)?n:0,0,1)}function lm(n,t){const e=cm(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function Rv(){const n={};for(const t of rm)n[t]=0;return n}function Pv(n,t){const e=Rv(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=cm(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+Au;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],c=r.t-o.t,l=c>Au?(a-o.t)/c:0,d=lm(o.ease??"linear",l);for(const u of rm){const h=o.pose[u]??r.pose[u]??0,f=r.pose[u]??o.pose[u]??0;e[u]=h+(f-h)*d}return e}function Cv(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=lm(i,t/a);return e.turns*Math.PI*2*s}function Pa(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function Lv(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=r&&l<c;){const d=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Tu(n,r,d),o&&o(),t-=r,l++}return l>=c&&(t=0),l},singleStep(e){Tu(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function Vi(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function Ne(n,t,e){return n+(t-n)*e}function Dv(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function Ru(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:Dv(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function kv(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function Iv(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:Ne(n.ch.x,t.ch.x,i),y:Ne(n.ch.y,t.ch.y,i),z:Ne(n.ch.z,t.ch.z,i)},facing:Vi(n.ch.facing,t.ch.facing,i),moveYaw:Vi(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:Vi(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:Vi(n.ch.headYaw,t.ch.headYaw,i),headPitch:Ne(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:Ne(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:Vi(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:Ne(n.ch.stride,t.ch.stride,i),velocity:{x:Ne(n.ch.vx,t.ch.vx,i),y:Ne(n.ch.vy,t.ch.vy,i),z:Ne(n.ch.vz,t.ch.vz,i)}},s={attackProgress:Ne(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:Ne(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:Ne(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,Ne(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:Ne(n.hurt.timer,t.hurt.timer,i),knockX:Ne(n.hurt.knockX,t.hurt.knockX,i),knockZ:Ne(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((c,l)=>{const d=n.dm[l];return d?{position:{x:Ne(d.x,c.x,i),y:Ne(d.y,c.y,i),z:Ne(d.z,c.z,i)},facing:Vi(d.facing,c.facing,i),bodyYaw:Vi(d.bodyYaw,c.bodyYaw,i),headYaw:Vi(d.headYaw,c.headYaw,i),gaitPhase:Vi(d.gaitPhase,c.gaitPhase,i),stride:Ne(d.stride,c.stride,i),attackProgress:Ne(d.attackProgress,c.attackProgress,i),velocity:{x:Ne(d.vx,c.vx,i),y:Ne(d.vy,c.vy,i),z:Ne(d.vz,c.vz,i)}}:null});return{time:Ne(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:Ne(n.dash.timer,t.dash.timer,i)},turn:{progress:Ne(n.turn.progress,t.turn.progress,i)},link:{progress:Ne(n.link.progress,t.link.progress,i)},dummies:r}}function zv(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const dm={slopPx:12,longPressMs:450,doubleTapMs:280};function Fv(n,t,e=dm.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function Ca(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function Uv(n=dm){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,c){if(t.has(s))return null;for(const l of t.values())if(l.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:c,dragging:!1,longFired:!1}),Ca(a,"press",0,0,0,1)},move(a,s,o,r){const c=i(a);if(!c)return null;c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY;return!c.dragging&&Math.hypot(l,d)>=n.slopPx?(c.dragging=!0,Ca(c.button,"drag",l,d,r-c.startedAt,1)):null},end(a,s,o,r){const c=i(a);if(!c)return null;t.delete(a),c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY,u=r-c.startedAt,h=Math.hypot(l,d);if(c.dragging||c.longFired||h>=n.slopPx)return Ca(c.button,"release",l,d,u,1);const f=e.get(c.button);return f!==void 0&&r-f.at<=n.doubleTapMs&&Math.hypot(s-f.x,o-f.y)<=n.slopPx*2?(e.delete(c.button),Ca(c.button,"doubleTap",l,d,u,2)):(e.set(c.button,{at:r,x:s,y:o}),Ca(c.button,"tap",l,d,u,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),Ca(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,Ca(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const qc=.001,Nv=18;function nd(n,t,e){return n<t?t:n>e?e:n}function id(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Ov(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function Bv(n,t,e,i,a=Nv){const s=Ov(t);if(!s)return{state:id(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,d=c;if(!Number.isFinite(o)||o<qc)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<qc?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<qc)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const u=o/n.lastDist,h=Math.max(0,Number.isFinite(e)?e:1),f=Number.isFinite(u)&&u>0?Math.pow(u,h):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:nd(Number.isFinite(f)?f:1,l,d),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Pu(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?nd(r,a,s):nd(n,a,s)}function Hv(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function Gv(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Kc=["jump","sprint","reset","attack","skill2"],Xv=8,Vv=16,Jc=10,Cu=14,Lu=140,Wv=18,Yv=16,$v=400,Zv=1.0001;function Vr(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function jv(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Vr(e)}function qv(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,c=0,l=0,d=0,u=0,h=0,f=-1,m=0,v=null,g=-1,p=0,b=0,x=0,y=0,S=!1,w=0,E=1,A=0,_=null,M=0,P=0,I=!1,L=null,F=null,C=0,T=0,B=0,G=0,$=!1,it=!0,ht=-1;const yt=Uv({slopPx:Cu,longPressMs:450,doubleTapMs:350});let Lt=[],q=null;const k=new Set;function Z(V){V&&Lt.push(V)}const j=new Map;let pt=id(),dt=!1,_t=1;function Yt(){const V=Array.from(j.values()),K=a(),gt=Bv(pt,V,K.pinchGain,K.maxStepRatio,Wv);if(pt=gt.state,dt=gt.pinching,gt.scale!==1&&(_t*=gt.scale),gt.started||gt.armedNow)_=null,I=!0,L=null;else if(gt.ended&&o===null&&V.length===1){const Nt=V[0];o=Nt.id,r=Nt.x,c=Nt.y,l=0,d=0,u=Nt.x,h=Nt.y,S=!1,w=0,E=1,A=0,performance.now(),_=null,I=!0,L=null}}const J={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},W={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let O=0,Pt=0;const ot={},at=new Set,Tt=[];function mt(){for(const V of Kc)ot[V]!==void 0&&(ot[V]=void 0),Q(V);yt.reset(),k.clear(),j.clear(),pt=id(),dt=!1,o=null,l=0,d=0,u=0,h=0,S=!1,w=0,E=1,A=0,p=0,b=0,x=0,y=0,v=null,g=-1,_=null,I=!1,L=null,F=null,ht=-1,B=0,G=0,$=!1,it=!0}const zt=()=>{document.hidden&&mt()},D=V=>{if(V.clientX===0&&V.clientY===0){m++;return}if(Vr(V.target)||jv(V.clientX,V.clientY)){k.add(V.pointerId);return}if(k.delete(V.pointerId),j.set(V.pointerId,{id:V.pointerId,x:V.clientX,y:V.clientY}),o===null&&!dt){v=null,g=-1,o=V.pointerId,r=V.clientX,c=V.clientY,l=0,d=0,u=V.clientX,h=V.clientY,performance.now();const K=Number.isFinite(V.screenX)&&Number.isFinite(V.screenY)&&(V.screenX!==0||V.screenY!==0);S=K,w=0,E=1,A=0,p=K?V.screenX:0,b=K?V.screenY:0,x=p,y=b,_=V.pointerId,M=V.clientX,P=V.clientY,I=!1}Yt()},R=V=>{if(V.pointerId===F&&(V.pointerType==="mouse"&&V.buttons===0||V.clientX===0&&V.clientY===0&&(C!==0||T!==0)||(it?(B=V.clientX-C,G=V.clientY-T):(C=V.clientX,T=V.clientY,it=!0,B=0,G=0))),Z(yt.move(V.pointerId,V.clientX,V.clientY,performance.now())),!k.has(V.pointerId)&&j.has(V.pointerId)&&(j.set(V.pointerId,{id:V.pointerId,x:V.clientX,y:V.clientY}),Yt()),k.has(V.pointerId)||V.pointerId!==o)return;const K=performance.now();if(v===V.pointerId&&K-g<150){m++;return}const gt=V.clientX,Nt=V.clientY;if(gt===0&&Nt===0&&(r!==0||c!==0)){m++;return}const It=gt-u,N=Nt-h,At=Number.isFinite(V.screenX)&&Number.isFinite(V.screenY),X=At?V.screenX:0,lt=At?V.screenY:0,Ct=At&&(X!==0||lt!==0),Dt=X-x,Kt=lt-y;if(S&&Ct){const Pe=Math.hypot(Dt,Kt),Fe=Math.hypot(It,N);if(Pe>3){if(w=0,A<30&&Fe>6&&Dt*It+Kt*N>.7*Pe*Fe){const mn=Pe/Fe;mn>.2&&mn<5&&(E+=(mn-E)*.3,A++)}}else Fe>12&&(w++,w>=2&&(S=!1))}const oe=Math.hypot(It,N);if(!S){const Pe=f<0?Number.POSITIVE_INFINITY:K-f,Fe=Ct?Math.hypot(Dt,Kt):1/0;oe>28&&(Pe<200||Fe<oe*.4)&&(r+=It,c+=N,m++)}u=gt,h=Nt,x=X,y=lt,V.pointerId===_&&Math.hypot(V.clientX-M,V.clientY-P)>Xv&&(I=!0);let de,Qt;S&&Ct?(de=(X-p)/E,Qt=(lt-b)/E):(de=gt-r,Qt=Nt-c);const we=Math.hypot(de,Qt),ze=s();we>ze&&(de*=ze/we,Qt*=ze/we);const Je=Math.hypot(l,d),Mn=Math.hypot(de,Qt);if(Je>10&&Mn>10){const Pe=Math.abs(Math.atan2(l*Qt-d*de,l*de+d*Qt)),Fe=Math.max(Je,Mn)*Pe,mn=Math.max(Math.hypot(It,N),Math.hypot(Dt,Kt)/Math.max(.2,E));if(Pe>.6&&mn<Math.max(6,Fe*.5)){m++;return}}l=de,d=Qt};function Q(V){if(!J[V])return;J[V]=!1,V==="attack"&&(W.attackReleased=!0);const K=document.getElementById(`btn-${V}`);K==null||K.classList.remove("is-down")}function ut(){o!==null&&(v=o,g=performance.now(),o=null,l=0,d=0,u=0,h=0,S=!1,w=0,E=1,A=0,p=0,b=0,x=0,y=0)}const ft=V=>{const K=j.delete(V.pointerId),gt=k.delete(V.pointerId);K&&Yt(),V.pointerId===F&&(F=null,$?ht=performance.now():(B=0,G=0,ht=-1)),Z(yt.end(V.pointerId,V.clientX,V.clientY,performance.now()));for(const Ot of Kc)ot[Ot]===V.pointerId&&(ot[Ot]=void 0,Q(Ot));const Nt=!K&&!gt&&j.size<=1&&o!==null;(V.pointerId===o||j.size===0||Nt)&&ut(),!gt&&V.pointerId===_&&(!I&&!Vr(V.target)&&(L={x:V.clientX,y:V.clientY}),_=null)};for(const V of Kc){const K=document.getElementById(`btn-${V}`);if(!K)continue;const gt=V==="attack"||V==="skill2",Nt=N=>{if(N.preventDefault(),ot[V]===void 0){ot[V]=N.pointerId,J[V]=!0,V==="jump"&&(W.jump=!0),V==="reset"&&(W.reset=!0),V==="sprint"&&(W.sprintPressed=!0),V==="attack"&&(W.attackPressed=!0),V==="skill2"&&(W.skill2=!0),K.classList.add("is-down"),Z(yt.begin(V,N.pointerId,N.clientX,N.clientY,performance.now()));try{K.setPointerCapture(N.pointerId)}catch{}gt&&(F=N.pointerId,C=N.clientX,T=N.clientY,it=!(N.clientX===0&&N.clientY===0),B=0,G=0,$=!1,ht=-1)}},Ot=N=>{ot[V]===N.pointerId&&(ot[V]=void 0,Q(V),Z(yt.end(N.pointerId,N.clientX,N.clientY,performance.now())))},It=N=>{ot[V]===N.pointerId&&(ot[V]=void 0,Q(V),Z(yt.cancel(N.pointerId,performance.now())))};K.addEventListener("pointerdown",Nt),K.addEventListener("pointerup",Ot),K.addEventListener("pointercancel",It),Tt.push(()=>{K.removeEventListener("pointerdown",Nt),K.removeEventListener("pointerup",Ot),K.removeEventListener("pointercancel",It)})}const st=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const V of st){const K=gt=>{gt.preventDefault(),O=Number(V.dataset.weapon)||0};V.addEventListener("pointerdown",K),Tt.push(()=>V.removeEventListener("pointerdown",K))}const kt=V=>{const K=V.key.toLowerCase();if((K===" "||K.startsWith("arrow"))&&V.preventDefault(),at.has(K))return;at.add(K),K===" "&&(W.jump=!0),K==="r"&&(W.reset=!0),K==="shift"&&(W.sprintPressed=!0),K==="j"&&(W.attackPressed=!0),K==="k"&&(W.skill2=!0),K>="1"&&K<="5"&&(O=Number(K)),K>="6"&&K<="9"&&(Pt=Number(K)-5);const gt=Math.max(Zv,a().keyStep||1.12);(K==="="||K==="+")&&(_t*=gt),(K==="-"||K==="_")&&(_t/=gt)},Et=V=>{const K=V.key.toLowerCase();at.has(K)&&(at.delete(K),K==="j"&&(W.attackReleased=!0))},wt=V=>{if(Vr(V.target))return;V.preventDefault();const K=V.deltaMode===1?V.deltaY*Yv:V.deltaMode===2?V.deltaY*$v:V.deltaY;_t*=Hv(K,a().wheelStep)},Xt=V=>{V.preventDefault()},xt=()=>{f=performance.now()};window.addEventListener("resize",xt),window.addEventListener("orientationchange",xt);const Ut=typeof window<"u"?window.visualViewport:null;return Ut&&(Ut.addEventListener("resize",xt),Ut.addEventListener("scroll",xt)),window.addEventListener("pointerdown",D),window.addEventListener("pointermove",R),window.addEventListener("pointerup",ft),window.addEventListener("pointercancel",ft),window.addEventListener("blur",mt),document.addEventListener("visibilitychange",zt),window.addEventListener("keydown",kt),window.addEventListener("keyup",Et),window.addEventListener("wheel",wt,{passive:!1}),window.addEventListener("gesturestart",Xt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:c,x:u,y:h,dx:u-r,dy:h-c,radius:s(),badMoves:m,screenOk:S,originSX:p,originSY:b,screenX:x,screenY:y,scale:E}},peekAim(){const V=performance.now(),K=Math.hypot(B,G),gt=F!==null||ht>=0&&V-ht<Lu;if(!(gt&&$&&K>=Jc))return{active:!1,holding:gt,x:0,z:0,dx:B,dy:G};const Ot=i(),It=B/K,N=G/K,At=Ot.rightX*It+Ot.forwardX*-N,X=Ot.rightZ*It+Ot.forwardZ*-N,lt=Math.hypot(At,X)||1;return{active:!0,holding:gt,x:At/lt,z:X/lt,dx:B,dy:G}},sample(){var Xn;const V=s();let K=o!==null?Math.max(-1,Math.min(1,l/V)):0,gt=o!==null?Math.max(-1,Math.min(1,d/V)):0,Nt=0,Ot=0;(at.has("a")||at.has("arrowleft"))&&(Nt-=1),(at.has("d")||at.has("arrowright"))&&(Nt+=1),(at.has("w")||at.has("arrowup"))&&(Ot-=1),(at.has("s")||at.has("arrowdown"))&&(Ot+=1),K+=Nt,gt+=Ot;let It=Math.hypot(K,gt);It>1&&(K/=It,gt/=It,It=1);const N=K,At=gt;It<e&&(K=0,gt=0);const X=i();let lt=X.rightX*K+X.forwardX*-gt,Ct=X.rightZ*K+X.forwardZ*-gt;const Dt=Math.hypot(lt,Ct);Dt>1&&(lt/=Dt,Ct/=Dt);const Kt=performance.now();Z(yt.poll(Kt));const oe=Math.hypot(B,G);F!==null&&(oe>=Vv?$=!0:oe<Jc&&($=!1));const de=F!==null||ht>=0&&Kt-ht<Lu,Qt=de&&$&&oe>=Jc;let we=0,ze=0;if(Qt){const sn=B/oe,An=G/oe,_n=X.rightX*sn+X.forwardX*-An,$n=X.rightZ*sn+X.forwardZ*-An,Zn=Math.hypot(_n,$n)||1;we=_n/Zn,ze=$n/Zn}!de&&F===null&&(B=0,G=0,ht=-1,$=!1);const Je=L;L=null;const Mn=_t;_t=1;const Pe={moveX:lt,moveZ:Ct,jumpPressed:W.jump,sprintHeld:J.sprint||at.has("shift"),sprintPressed:W.sprintPressed,resetPressed:W.reset,attackPressed:W.attackPressed,attackHeld:J.attack||at.has("j"),attackReleased:W.attackReleased,skill2Pressed:W.skill2,weaponSlot:O,dummyClickId:Pt,aimX:we,aimZ:ze,aimActive:Qt};W.jump=!1,W.reset=!1,W.sprintPressed=!1,W.attackPressed=!1,W.attackReleased=!1,W.skill2=!1,O=0,Pt=0;const Fe=Lt.map(sn=>Fv(sn,X,Cu));Lt=[],Fe.length>0&&(q=Fe[Fe.length-1]);const mn=o!==null?"pointer":at.size>0?"keyboard":"idle";return{intents:Pe,stickX:K,stickY:gt,stickRawX:N,stickRawY:At,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:c,stickPxX:u,stickPxY:h,stickBad:m,stickScreenOk:S,stickOriginSX:p,stickOriginSY:b,stickScreenX:x,stickScreenY:y,stickScale:E,stickVpTop:((Xn=Gv())==null?void 0:Xn.top)??0,stickVpAge:f<0?-1:Math.round(performance.now()-f),aimDX:B,aimDY:G,source:mn,tap:Je,zoomScale:Mn,gestures:Fe,lastGesture:q}},dispose(){window.removeEventListener("pointerdown",D),window.removeEventListener("pointermove",R),window.removeEventListener("pointerup",ft),window.removeEventListener("pointercancel",ft),window.removeEventListener("blur",mt),document.removeEventListener("visibilitychange",zt),window.removeEventListener("keydown",kt),window.removeEventListener("keyup",Et),window.removeEventListener("wheel",wt),window.removeEventListener("resize",xt),window.removeEventListener("orientationchange",xt),Ut&&(Ut.removeEventListener("resize",xt),Ut.removeEventListener("scroll",xt)),window.removeEventListener("gesturestart",Xt),yt.reset();for(const V of Tt)V()}}}const oc=1,rc=2,cc=4,hm=8,lc=16,Co=32,um=64,fm=128,Kv=[[oc,"atk"],[rc,"dash"],[cc,"link"],[hm,"air"],[lc,"hurt"],[Co,"aim"],[um,"spr"],[fm,"chan"]];function hs(n){if(n===0)return"-";const t=Kv.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Jv=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Qv=0,ty=15,Qc=19,ey=21,ny=22,iy=23,ay=24,Li={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Vn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,yi=n=>Math.round(n*180/Math.PI*10)/10,tl=Math.PI*2;function uo(n){let t=n%tl;return t>Math.PI&&(t-=tl),t<-Math.PI&&(t+=tl),t}function sy(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=oc),n.dash.phase!=="idle"&&(e|=rc),n.playerLink.phase!=="idle"&&(e|=cc),n.character.grounded||(e|=hm),n.playerHurt.type!=="none"&&(e|=lc),t.intents.aimActive&&(e|=Co),n.character.sprinting&&(e|=um),n.abilities.channeling&&(e|=fm),e}function oy(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function ry(n){const t={sampleHz:n.sampleHz??Li.sampleHz,sampleCapacity:n.sampleCapacity??Li.sampleCapacity,eventCapacity:n.eventCapacity??Li.eventCapacity,anomalyCapacity:n.anomalyCapacity??Li.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??Li.dirJumpDeg,aimDropDeg:n.aimDropDeg??Li.aimDropDeg,freezeMs:n.freezeMs??Li.freezeMs,freezeSpeed:n.freezeSpeed??Li.freezeSpeed,stickLostMs:n.stickLostMs??Li.stickLostMs,spikeMs:n.spikeMs??Li.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,c=-1,l=-1e9,d=null,u=0,h=0,f="",m=-1,v=-1,g=-1,p=0,b=-1e9,x=-1,y={},S=null,w=0,E=0,A=0,_=0;function M(C,T){const B=1/t.sampleHz,G=C[Qv];G-l<B-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(C),l=G)}function P(C,T,B,G,$,it){const ht=y[C]??-1e9;if(T-ht<1.2)return;if(y[C]=T,C==="frameSpike"){let Lt=0;for(const q of s)q.kind==="frameSpike"&&Lt++;if(Lt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let yt=i.slice(-7);it&&(yt.length===0||yt[yt.length-1]!==it)&&(yt=[...yt.slice(-6),it]),s.push({kind:C,t:Vn(T),tick:B,ms:Math.round(G),detail:$,ctx:yt}),C==="dirJump"?o.dirJumps++:C==="aimDrop"?o.aimDrops++:C==="moveFreeze"?o.freezes++:C==="stickLost"?o.stickLosts++:C==="stickJump"?o.stickJumps++:C==="stickBad"?o.stickBads++:C==="stickDrift"&&o.stickDrifts++}function I(C,T,B,G){a.length>=t.eventCapacity&&a.shift(),a.push({t:Vn(B),tick:G,k:C,d:T})}function L(C){switch(C.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":b=C.tick;break}}function F(){const C=o,T=C.wallMs/1e3,B=C.gestures,G=yt=>Object.entries(B).filter(([Lt])=>Lt.endsWith(`.${yt}`)).reduce((Lt,[,q])=>Lt+q,0),$=[];if($.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),$.push(`运行 ${T.toFixed(1)}s / ${C.frames} 帧 · ${C.fps.toFixed(1)}fps · 最大 ${C.dtMax.toFixed(0)}ms · 尖峰 ${C.spikes} · 步 ${C.steps}`),$.push(`摇杆活跃 ${T>0?Math.round(C.stickActiveMs/1e3/T*100):0}% · 手势 按下 ${G("press")}（单击 ${G("tap")} / 双击 ${G("doubleTap")} / 拖拽 ${G("drag")} / 长按 ${G("longPress")} / 打断 ${G("cancel")} / 拖放 ${G("release")}）`),$.push(`攻击 ${C.attacks}(中${C.hits}) · 受击 ${C.hurts} · 派生 ${C.links}(中${C.linkHits}) · 翻滚 ${C.rolls} 闪现 ${C.blinks} · 跳 ${C.jumps} · 复位 ${C.resets}`),$.push(`法杖 引导${C.channels} 飞弹${C.bolts} 电环${C.rings} · 弓蓄力${C.bowCharges} · 当前武器 ${f||"-"}`),$.push(`异常 ${C.dirJumps+C.aimDrops+C.freezes+C.stickLosts+C.stickJumps+C.stickBads+C.stickDrifts}（dir ${C.dirJumps} / aim ${C.aimDrops} / freeze ${C.freezes} / stick ${C.stickLosts} / stickJump ${C.stickJumps} / 坏指针 ${C.stickBads} / 坐标漂移 ${C.stickDrifts}） · 掉帧尖峰 ${C.spikes}`+(C.inTurns>0?` · 输入转向 ${C.inTurns} 次（最大 ${C.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const yt of s.slice(-6)){$.push(`· ${yt.kind} @t${yt.t.toFixed(2)} tick${yt.tick} ${yt.ms>0?`${yt.ms}ms `:""}${yt.detail}`);const Lt=yt.ctx.map(k=>String(k[ty])).join(" "),q=yt.ctx.map(k=>k[Qc]===""||k[Qc]==null?".":String(k[Qc])).join(" ");if($.push(`  yaw ${Lt}`),$.push(`  in  ${q}`),yt.kind==="stickJump"||yt.kind==="stickBad"||yt.kind==="stickLost"){const k=yt.ctx.map(j=>`${j[ey]},${j[ny]}`).join(" "),Z=yt.ctx.map(j=>`${j[iy]},${j[ay]}`).join(" ");$.push(`  o   ${k}`),$.push(`  p   ${Z}`)}}if(a.length>0){$.push("最近事件：");for(const yt of a.slice(-12))$.push(`  ${yt.t.toFixed(2)} ${yt.k} ${yt.d}`.trimEnd())}const it=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",ht=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return $.push(`摇杆坐标源 ${it}${ht}`),$.push(`UA ${e.ua}`),$.join(`
`)}return{sample(C,T,B,G=0){o.frames++,T.stickHeld&&(T.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=G,o.wallMs+=B,B>o.dtMax&&(o.dtMax=B),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=C.time;const $=C.time;if(c<0&&(c=$),A=$,_=C.tick,!r)return;const it=C.character,ht=Math.hypot(T.stickX,T.stickY),yt=Math.hypot(it.velocity.x,it.velocity.z);f=C.combat.weapon;const Lt=sy(C,T),q=it.facing,Z=Math.hypot(T.intents.moveX,T.intents.moveZ)>.05?Math.atan2(T.intents.moveX,T.intents.moveZ):null;ht>.2&&(o.stickActiveMs+=B);const j=[Vn($),C.tick,Math.round(B*10)/10,Vn(T.stickX),Vn(T.stickY),Vn(T.stickRawX),Vn(T.stickRawY),T.stickHeld?1:0,T.source.slice(0,8),Vn(T.intents.moveX),Vn(T.intents.moveZ),Vn(it.position.x),Vn(it.position.z),Vn(it.velocity.x),Vn(it.velocity.z),yi(q),yi(it.bodyYaw),Lt,Vn(it.stride),Z===null?"":yi(Z),T.stickId===null?"":T.stickId,Math.round(T.stickOriginX),Math.round(T.stickOriginY),Math.round(T.stickPxX),Math.round(T.stickPxY),T.stickBad,Math.round(T.stickVpTop),Math.round(T.stickOriginSX),Math.round(T.stickOriginSY),Math.round(T.stickScreenX),Math.round(T.stickScreenY),T.stickScreenOk?1:0,Math.round(T.stickScale*100)/100];M(j);const pt=$*1e3<x;if(B>t.spikeMs&&!pt&&$-c>.6&&(o.spikes++,P("frameSpike",$,C.tick,B,`dt ${B.toFixed(0)}ms fl=${hs(Lt)}`,j)),d!==null&&!pt){const mt=Math.abs(yi(uo(q-d))),zt=Math.abs(yi(uo(it.moveYaw-u))),D=(h|Lt)&(oc|rc|cc|lc)|Lt&Co,R=Z===null?null:Math.abs(yi(uo(q-Z))),Q=Z===null||d===null?null:Math.abs(yi(uo(d-Z))),ut=R!==null&&Q!==null&&R<Q-.5,ft=(h&Co)!==0&&(Lt&Co)===0&&Z===null,st=R!==null&&(R<=12||ut);mt>t.aimDropDeg&&ft?P("aimDrop",$,C.tick,0,`${mt.toFixed(0)}° @aim→none stick(${T.stickX.toFixed(2)},${T.stickY.toFixed(2)}) aim(${T.aimDX.toFixed(0)},${T.aimDY.toFixed(0)}) fl=${hs(Lt)}`,j):mt>t.dirJumpDeg&&D===0&&!ft&&(st?(o.inTurns++,mt>o.inTurnMax&&(o.inTurnMax=mt)):P("dirJump",$,C.tick,0,`${mt.toFixed(0)}° res${R===null?" 无输入":`${R.toFixed(0)}°`} yaw ${yi(d)}→${yi(q)} in ${Z===null?".":yi(Z)}° mvΔ${zt.toFixed(0)}° aim(${T.aimDX.toFixed(0)},${T.aimDY.toFixed(0)}) fl=${hs(h)}→${hs(Lt)}`,j))}const dt=(Lt&(oc|rc|cc|lc))!==0,_t=C.tick-b<30;ht>.35&&yt<t.freezeSpeed&&!dt&&!_t?(m<0&&(m=$),$-m>=t.freezeMs/1e3&&$>=v&&(P("moveFreeze",$,C.tick,($-m)*1e3,`stick(${T.stickX.toFixed(2)},${T.stickY.toFixed(2)}) v${yt.toFixed(2)} ${T.source} fl=${hs(Lt)}`,j),v=$+1.5,m=-1)):m=-1,T.stickHeld?(ht>p&&(p=ht),p>.35&&ht<.06?(g<0&&(g=$),$-g>=t.stickLostMs/1e3&&(P("stickLost",$,C.tick,($-g)*1e3,`raw(${T.stickRawX.toFixed(2)},${T.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${hs(Lt)}`,j),g=-1,p=0)):g=-1):(p=0,g=-1);const Yt=T.stickScale>.2&&T.stickScale<5?T.stickScale:1,J=T.stickScreenOk,W=J?T.stickScreenX/Yt:T.stickPxX,O=J?T.stickScreenY/Yt:T.stickPxY,Pt=J?T.stickOriginSX/Yt:T.stickOriginX,ot=J?T.stickOriginSY/Yt:T.stickOriginY,at=W-Pt,Tt=O-ot;if(T.stickHeld&&T.stickId!==null){const mt=S;if(mt&&mt.held&&mt.id===T.stickId){const zt=Math.hypot(mt.dx,mt.dy),D=Math.hypot(at,Tt),R=Math.max(zt,D),Q=Math.hypot(W-mt.cx,O-mt.cy),ut=Math.abs(yi(uo(Math.atan2(Tt,at)-Math.atan2(mt.dy,mt.dx)))),ft=R*ut*Math.PI/180,st=Math.hypot(Pt-mt.ox,ot-mt.oy);if(R>18&&ut>35&&Q<Math.max(5,ft*.35)&&P("stickJump",$,C.tick,0,`Δ${ut.toFixed(0)}° 手指只动${Q.toFixed(0)}px(弧长应${ft.toFixed(0)}px) o(${Math.round(mt.ox)},${Math.round(mt.oy)})→(${Math.round(Pt)},${Math.round(ot)}) 原点位移${st.toFixed(0)}px p(${Math.round(W)},${Math.round(O)}) raw(${Math.round(at)},${Math.round(Tt)}) id${T.stickId} ${J?"src=屏幕":"src=client"}`,j),J&&mt.screenOk){const kt=Math.hypot(T.stickPxX-mt.x,T.stickPxY-mt.y),Et=Math.hypot((T.stickScreenX-mt.sx)/Yt,(T.stickScreenY-mt.sy)/Yt);w+=kt-Et,Math.abs(w)>20&&(P("stickDrift",$,C.tick,0,`client 相对屏幕漂移 ${w>0?"+":""}${w.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(T.stickPxX)},${Math.round(T.stickPxY)}) screen(${Math.round(T.stickScreenX)},${Math.round(T.stickScreenY)})`,j),w=0)}}S={id:T.stickId,ox:Pt,oy:ot,cx:W,cy:O,x:T.stickPxX,y:T.stickPxY,sx:T.stickScreenX,sy:T.stickScreenY,dx:at,dy:Tt,held:!0,screenOk:J}}else S=null,w=0;if(T.stickBad>E){const mt=T.stickBad-E;P("stickBad",$,C.tick,0,`拦截 ${mt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${T.stickBad}）o(${Math.round(T.stickOriginX)},${Math.round(T.stickOriginY)}) p(${Math.round(T.stickPxX)},${Math.round(T.stickPxY)}) id${T.stickId??"-"}`,j)}E=T.stickBad,d=q,u=it.moveYaw,h=Lt},event(C,T){const B=oy(C);L(C),r&&(C.type==="dash-ready"||C.type==="combo-reset"||C.type==="stepUp"||I(C.type,B,T,C.tick))},gesture(C){const T=`${C.button}.${C.kind}`;o.gestures[T]=(o.gestures[T]??0)+1,r&&(C.kind==="longPress"||C.kind==="doubleTap"||C.kind==="drag"||C.kind==="cancel")&&I(`g:${C.kind}`,`${C.button} ${C.heldMs.toFixed(0)}ms d${C.distance.toFixed(0)}px ${C.angleDeg.toFixed(0)}°`,A,_)},suspend(C){x=A*1e3+C,m=-1,g=-1},setEnabled(C){r=C,C||(d=null,S=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,y={},l=-1e9,d=null,h=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,w=0,S=null,E=0;for(const C of Object.keys(o.gestures))delete o.gestures[C]},status(){const C=o.simS,T=s.some(B=>C-B.t<8&&(B.kind==="dirJump"||B.kind==="aimDrop"||B.kind==="moveFreeze"||B.kind==="stickLost"||B.kind==="stickJump"||B.kind==="stickBad"||B.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:T,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Jv,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:F}}const cy="dash",ly=6,dy="冲刺标尺",hy="沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",uy=[2,4],fy="square",py=4.8,my="#bfe8ff",gy="v9s.15 历史固定工位",xy={dx:0,dz:4.6},vy={dx:-2.8,dz:9.2},yy={id:cy,index:ly,name:dy,hint:hy,span:uy,shape:fy,radius:py,color:my,owner:gy,spawn:xy,label:vy},My="gait",_y=7,by="侧后方步态",Sy="面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",wy=[2,2],Ey="circle",Ty=3.2,Ay="#6fc9a0",Ry="v9s.15 历史固定工位",Py={dx:0,dz:2.6},Cy={dx:0,dz:-2.5},Ly=[{dx:0,dz:0,mode:"follow"}],Dy={id:My,index:_y,name:by,hint:Sy,span:wy,shape:Ey,radius:Ty,color:Ay,owner:Ry,spawn:Py,label:Cy,dummies:Ly},ky="hub",Iy=1,zy="中央 8 向",Fy="推杆走 8 个方向 · 松手看停步收相 / 转身踏步",Uy="origin",Ny=[2,2],Oy="circle",By=3.6,Hy="#8fe7ff",Gy="v9s.15 历史固定工位",Xy={dx:0,dz:0},Vy={dx:0,dz:-3.1},Wy={minCellX:-4,maxCellX:4,minCellZ:0,maxCellZ:6,density:1,clearMarginCells:2},Yy=[{id:"crate-hub",dx:2.5,dz:-2.5,width:1.1,depth:1.1,height:.8}],$y=[{dx:-3.4,dz:3.2,fighter:!0,weapon:"sword-shield"},{dx:3.4,dz:3.2,fighter:!0,weapon:"dual-swords"},{dx:0,dz:4.2,fighter:!0,weapon:"greatsword"}],Zy={id:ky,index:Iy,name:zy,hint:Fy,pin:Uy,span:Ny,shape:Oy,radius:By,color:Hy,owner:Gy,spawn:Xy,label:Vy,grass:Wy,obstacles:Yy,dummies:$y},jy="meter",qy=5,Ky="进度弧",Jy="弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",Qy=[2,2],tM="circle",eM=3.2,nM="#b48cff",iM="v9s.15 历史固定工位",aM={dx:0,dz:2.8},sM={dx:0,dz:1.3},oM=[{id:"pillar-sw",dx:-4,dz:3.6,width:1.2,depth:1.2,height:2.2}],rM=[{dx:0,dz:-1.4,mode:"idle"}],cM={id:jy,index:qy,name:Ky,hint:Jy,span:Qy,shape:tM,radius:eM,color:nM,owner:iM,spawn:aM,label:sM,obstacles:oM,dummies:rM},lM="rings",dM=2,hM="环状态色阶",uM="同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",fM=[2,2],pM="circle",mM=3.4,gM="#ffc85a",xM="v9s.15 历史固定工位",vM={dx:0,dz:3},yM={dx:0,dz:-2.7},MM=[{dx:-1.6,dz:-.15,mode:"idle"},{dx:0,dz:-.15,mode:"keep-distance"},{dx:1.6,dz:-.15,mode:"attack"}],_M={id:lM,index:dM,name:hM,hint:uM,span:fM,shape:pM,radius:mM,color:gM,owner:xM,spawn:vM,label:yM,dummies:MM},bM="sparring-demo",SM="陪练试验场",wM="动态拼合示范地块 · 点「生成 4 人」就地摆出假人 + 持械陪练，用完点「清除」回基线",EM=[2,2],TM=2,AM="#7fd8c0",RM="v9s.43 动态拼合示范（auto 地块，不写世界坐标，由 assemblePlots 自动分配槽位）",PM={minCellX:-9,maxCellX:9,minCellZ:-9,maxCellZ:9,density:.72},CM={label:"生成 4 人",dummies:2,modes:["idle","keep-distance"],fighters:2,ringRadius:1.5,startDeg:-90},LM={id:bM,name:SM,hint:wM,span:EM,radius:TM,color:AM,owner:RM,grass:PM,testSpawn:CM},DM="terrain",kM=4,IM="地形 / 门洞",zM="宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",FM=[2,2],UM="square",NM=4.8,OM="#7fb8d8",BM="v9s.15 历史固定工位",HM={dx:0,dz:4.6},GM={dx:0,dz:-4.2},XM=[{id:"stair-1",dx:-2.3,dz:1.8,width:2.4,depth:.9,height:.2},{id:"stair-2",dx:-2.3,dz:.9,width:2.4,depth:.9,height:.4},{id:"stair-3",dx:-2.3,dz:0,width:2.4,depth:.9,height:.6},{id:"stair-4",dx:-2.3,dz:-.9,width:2.4,depth:.9,height:.8},{id:"plateau",dx:-2.3,dz:-2.2,width:2.4,depth:1.6,height:.8},{id:"block-060",dx:2.5,dz:1.4,width:1.4,depth:1.4,height:.6},{id:"block-090",dx:2.5,dz:-.5,width:1.4,depth:1.4,height:.9},{id:"block-120",dx:2.5,dz:-2.4,width:1.4,depth:1.4,height:1.2}],VM=[{id:"gate-wide",dx:-2.3,dz:3.1,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",dx:2.5,dz:3.1,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],WM={id:DM,index:kM,name:IM,hint:zM,span:FM,shape:UM,radius:NM,color:OM,owner:BM,spawn:HM,label:GM,steps:XM,doorways:VM},YM="windup",$M=3,ZM="起手预警",jM="走进 1.6m：脚下红弧填满 = 命中帧",qM=[2,2],KM="circle",JM=3.2,QM="#ff5a4a",t_="v9s.15 历史固定工位",e_={dx:0,dz:3},n_={dx:0,dz:-2.6},i_=[{dx:0,dz:-.2,mode:"attack"}],a_={id:YM,index:$M,name:ZM,hint:jM,span:qM,shape:KM,radius:JM,color:QM,owner:t_,spawn:e_,label:n_,dummies:i_},s_="x-destructibles",o_="可破坏物件 · 斜切断口",r_="站高台打=高处断，平地打=低处断；切口朝挥刀方向斜切 · 瓶罐只断预设带",c_=[2,2],l_=2,d_="#e8a05c",h_="可破坏物件（auto 地块，只写相对偏移；id 不带版本代号，由合并闸门统一领号；排在 sparring-demo 之后不抢槽位）",u_=[{id:"pole-a",kind:"pole",dx:-1.25,dz:-1,height:2.4,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-b",kind:"pole",dx:0,dz:-1,height:2.8,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-c",kind:"pole",dx:1.25,dz:-1,height:2,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"jar-a",kind:"jar",dx:-.7,dz:-1.8,height:.9,radius:.28,tiltDeg:14,bands:[.35,.62],color:"#6f8fb8",cutColor:"#d8e4f0"},{id:"jar-b",kind:"jar",dx:.7,dz:-1.8,height:.8,radius:.26,tiltDeg:14,bands:[.4,.68],color:"#b87f6f",cutColor:"#f0d8c8"}],f_={id:s_,name:o_,hint:r_,span:c_,radius:l_,color:d_,owner:h_,destructibles:u_},p_={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!1,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:0,spawn:[],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,strafePeriod:5.2,strafeDuty:.34,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4,fighters:{weapons:["sword-shield","dual-swords","greatsword"],spawn:[],initialModes:["spar","spar","spar"],moveSpeed:2.1,attackInterval:3.4,attackRangeScale:.9,knockbackScale:.6,leashRadius:7,comboCount:0,comboGap:0}},grass:{enabled:!0,footprintCells:2,minHeightCells:1,maxHeightCells:2,bendRadius:.85,maxBendRad:.95,bendRate:18,recoverRate:3.2,stumpRatio:.34,regrow:!0,regrowSec:6,bucketCells:4,wind:{enabled:!0,dirDeg:28,speed:1.35,amplitude:.19,wavelength:4.2,secondWave:{wavelength:1.7,amplitude:.055,speedScale:1.55},gust:{periodSec:7.5,depth:.35},jitter:.16,shadeAmount:.26}}},m_={ground:{size:32,thickness:.4},steps:[],doorways:[],obstacles:[],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},grass:{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:.72,bladesPerPatch:[3,6],avoidMargin:.45,seed:20261108}},g_={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}},spider:{name:"蜘蛛",rig:"spider",height:.7,radius:.42,moveSpeed:2.6},elder:{name:"驼背老人",height:1.28,radius:.24,moveSpeed:3.6,voxel:{headSize:.28,bodyWidth:.3,bodyHeight:.3,limbThickness:.095,legLength:.7,armLength:.56,style:{hunch:.32,kneeSink:.05,headScale:.8,balding:!0,hairColor:"#e9e9e9",beard:.46,beardColor:"#f4f4f4"}},colors:{body:"#6b7a8f",head:"#f0d3ae",limb:"#5a6878",shoe:"#2a2f38"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132,dirFlipSec:.16,hipYawTrackRateDeg:240,hipYawBackRateDeg:150},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e",fighterColors:[{body:"#c85a4a",limb:"#8d3a30",head:"#f0c9a0"},{body:"#c9a03c",limb:"#8a6b22",head:"#f0d6a0"},{body:"#7d6ec4",limb:"#4f4488",head:"#e6d2b0"}]},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95},grass:{enabled:!0,bladeWidth:.13,segmentHeight:.5,palette:["#3f7d4f","#569a5c","#6fb56a","#8ccb78","#a9dc86"],stumpColor:"#6b7a48",maxInstances:6e3,debris:{max:220,life:.85,color:"#a9dc86"}}},x_={core:p_,scene:m_,view:g_};function ch(n){return JSON.parse(JSON.stringify(n))}const lh=x_,v_=Object.assign({"../config/plots/dash.json":yy,"../config/plots/gait.json":Dy,"../config/plots/hub.json":Zy,"../config/plots/meter.json":cM,"../config/plots/rings.json":_M,"../config/plots/sparring-demo.json":LM,"../config/plots/terrain.json":WM,"../config/plots/windup.json":a_,"../config/plots/x-destructibles.json":f_}),y_=Object.values(v_).filter(n=>n&&typeof n.id=="string"&&n.id.length>0),pm=nh,Ji=Qg(y_,pm),Du=Ji.plots,mm=ch(lh.core),Wr=ch(lh.scene),En=ch(lh.view);tx(mm,Wr,Ji,pm);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Ui{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),Ui.nextNameID=Ui.nextNameID||0,this.$name.id=`lil-gui-name-${++Ui.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class M_ extends Ui{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function ad(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const __={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:ad,toHexString:ad},Go={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},b_={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Go.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Go.toHexString(a)}},S_={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Go.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Go.toHexString(a)}},w_=[__,Go,b_,S_];function E_(n){return w_.find(t=>t.match(n))}class T_ extends Ui{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=E_(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=ad(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class el extends Ui{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class A_ extends Ui{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let b=parseFloat(this.$input.value);isNaN(b)||(this._stepExplicit&&(b=this._snap(b)),this.setValue(this._clamp(b)))},i=b=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+b),this.$input.value=this.getValue())},a=b=>{b.key==="Enter"&&this.$input.blur(),b.code==="ArrowUp"&&(b.preventDefault(),i(this._step*this._arrowKeyMultiplier(b))),b.code==="ArrowDown"&&(b.preventDefault(),i(this._step*this._arrowKeyMultiplier(b)*-1))},s=b=>{this._inputFocused&&(b.preventDefault(),i(this._step*this._normalizeMouseWheel(b)))};let o=!1,r,c,l,d,u;const h=5,f=b=>{r=b.clientX,c=l=b.clientY,o=!0,d=this.getValue(),u=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",v)},m=b=>{if(o){const x=b.clientX-r,y=b.clientY-c;Math.abs(y)>h?(b.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>h&&v()}if(!o){const x=b.clientY-l;u-=x*this._step*this._arrowKeyMultiplier(b),d+u>this._max?u=this._max-d:d+u<this._min&&(u=this._min-d),this._snapClampSetValue(d+u)}l=b.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",v)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,b,x,y,S)=>(p-b)/(x-b)*(S-y)+y,e=p=>{const b=this.$slider.getBoundingClientRect();let x=t(p,b.left,b.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",h))},u=p=>{if(o){const b=p.touches[0].clientX-r,x=p.touches[0].clientY-c;Math.abs(b)>Math.abs(x)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h))}else p.preventDefault(),e(p.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h)},f=this._callOnFinishChange.bind(this),m=400;let v;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(f,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class R_ extends Ui{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class P_ extends Ui{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const C_=`.lil-gui {
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
}`;function L_(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let ku=!1;class dc{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!ku&&r&&(L_(C_),ku=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new R_(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new A_(this,t,e,i,a,s);case"boolean":return new M_(this,t,e);case"string":return new P_(this,t,e);case"function":return new el(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new T_(this,t,e,i)}addFolder(t){const e=new dc({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof el||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof el)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function D_(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new dc({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new dc({title:"实验台 · 调试面板"}),o=n.config,r=[],c=[],l=wt=>{const Xt=s.addFolder(wt);return c.push(Xt),Xt},d=(wt,Xt)=>{const xt=wt.addFolder(Xt);return r.push(xt),xt},u=l("模拟 / 显示");u.add(e,"timeScale",0,3,.05).name("时间缩放"),u.add(e,"paused").name("暂停"),u.add({step:i.singleStep},"step").name("单步 (1 tick)"),u.add({reset:i.reset},"reset").name("复位全部"),u.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),u.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),u.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),u.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const h=d(u,"模块开关");h.add(n.modules,"movement").name("movement"),h.add(n.modules,"combat").name("combat"),h.add(n.modules,"links").name("links"),h.add(n.modules,"orientation").name("orientation"),h.add(n.modules,"turnInPlace").name("turnInPlace"),h.add(n.modules,"targeting").name("targeting"),h.add(n.modules,"hits").name("hits"),h.add(n.modules,"separation").name("separation"),h.add(n.modules,"dash").name("dash"),h.add(n.modules,"camera").name("camera"),h.add(n.modules,"dummies").name("dummies"),h.add(n.modules,"abilities").name("abilities");const f=l("移动 / 输入"),m=d(f,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const v=d(f,"摇杆 / 输入");v.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),v.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=d(f,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const b=o.separation,x=d(f,"角色间分离 / 挤压阻力");x.add(b,"iterations",1,8,1).name("迭代次数"),x.add(b,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(b.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(b.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(b.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const y=l("动作 / 步态"),S=d(y,"程序化步态");S.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),S.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),S.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),S.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),S.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),S.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),S.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),S.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),S.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),S.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),S.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),S.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),S.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),S.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),S.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),S.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)"),S.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)"),S.add(t.gait,"dirFlipSec",0,.4,.01).name("换向融合时长 (s)"),S.add(t.gait,"hipYawTrackRateDeg",0,600,10).name("下盘目标转速上限 (°/s)"),S.add(t.gait,"hipYawBackRateDeg",0,600,10).name("└ 后退相位上限 (°/s)");const w=d(y,"停步 / 收相 / 惯性");w.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),w.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),w.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),w.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),w.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),w.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),w.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),w.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),w.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),w.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),w.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),w.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const E=d(y,"足部 IK"),A=t.ik;E.add(A,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),E.add(A,"weight",0,1,.01).name("钉地权重"),E.add(A,"attackScale",0,1,.01).name("攻击时权重倍率"),E.add(A,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const _=d(y,"惯性倾斜 / 盆骨"),M=t.lean;_.add(M,"accelGain",0,.1,.002).name("前后加速度增益"),_.add(M,"turnGain",0,.2,.005).name("绕圈侧倾增益"),_.add(M,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),_.add(M,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),_.add(M,"smoothing",1,30,1).name("倾斜平滑速率"),_.add(M,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),_.add(M,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),_.add(M,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),_.add(M,"crouchSmoothing",1,30,1).name("下沉平滑速率");const P=o.orientation,I=d(y,"朝向 / 接敌注视 / 原地转身");I.add(P,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),I.add(P,"headTurnRate",.5,40,.5).name("头部转向速率"),I.add(P,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),I.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),I.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),I.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const L=o.gaze;I.add(L,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),I.add(L,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),I.add(L,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),I.add(L,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),I.add(L,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),I.add(L,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),I.add(L,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),I.add(L,"headPitchRate",.5,20,.5).name("头部俯仰速率"),I.add(L,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),I.add(L,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),I.add(L,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const F=o.turnInPlace;I.add(F,"enabled").name("启用原地转身 (关=纯插值)"),I.add(F,"triggerDeg",20,180,5).name("触发夹角 (°)"),I.add(F,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),I.add(F,"settleDeg",0,60,1).name("转身保留余角 (°)"),I.add(F,"durationSec",.1,1.5,.02).name("转身时长 (s)"),I.add(F,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),I.add(F,"inputDeadZone",0,.5,.01).name("起步输入死区"),I.add(F,"armSec",0,.5,.01).name("触发防抖 (s)"),I.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("停步偏差消化窗口"),I.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),I.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),I.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),I.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),I.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const C=l("战斗 / 命中"),T=o.combat,B=d(C,"连击 / 武器时序"),G=B.add(n.combat,"weapon",ba).name("当前武器");B.add(T,"comboWindow",.1,2,.05).name("连击窗口 (s)"),B.add(T,"settle",0,.8,.01).name("段间停顿 (s)"),B.add(T,"attackMoveScale",0,1,.01).name("攻击时移动比例"),B.add(T,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),B.add(T,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),B.add(T,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),B.add(T,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),B.add(T,"cancelWindow",0,1,.01).name("取消窗口 (s)"),B.add(T,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),B.add(T,"autoCombo").name("按住自动连击"),B.add(T.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),B.add(T.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),B.add(T.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),B.add(T.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率"),B.add(T.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),B.add(T.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),B.add(T.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),B.add(T.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),B.add(T.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),B.add(T.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),B.add(T.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),B.add(T.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),B.add(T.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度");const $=o.abilities;B.add($.arcane,"perWave",1,8,1).name("每波飞弹数"),B.add($.arcane,"waves",1,12,1).name("每次引导波数"),B.add($.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),B.add($.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),B.add($.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),B.add($.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),B.add($.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),B.add($.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),B.add($.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),B.add($.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),B.add($.arcane,"speed",3,24,.5).name("飞弹速度"),B.add($.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),B.add($.ring,"radius",.5,5,.1).name("电环半径"),B.add($.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),B.add($.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const it=o.hits.hitstopWarp;if(it){const wt=d(C,"卡肉节奏（接触瓦片）");wt.add(it,"enabled").name("瓦片开（关=硬冻结）"),wt.add(it,"holdRate",0,.4,.01).name("保持期速率"),wt.add(it,"release",.005,.2,.005).name("释放时长 (s)"),wt.add(it,"payback",1,2.5,.05).name("偿还倍率"),wt.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),wt.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),wt.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const ht=o.hits,yt=d(C,"命中 / 受击 / 击退");yt.add(ht,"arcDeg",10,120,5).name("命中扇区半角 (°)"),yt.add(ht,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),yt.add(ht,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),yt.add(ht,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),yt.add(ht.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),yt.add(ht.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),yt.add(ht,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),yt.add(ht,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Lt={get enabled(){return!ht.noDamageToPlayer},set enabled(wt){ht.noDamageToPlayer=!wt}};yt.add(Lt,"enabled").name("玩家受击击退");const q=d(C,"受击分层"),k=t.hurt;q.add(k,"enabled").name("启用分层受击 (关=旧版对照)"),q.add(k,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),q.add(k,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),q.add(k,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),q.add(k,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),q.add(k,"upperShiftScale",0,1,.01).name("上身位移缩放"),q.add(k,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),q.add(k.hitHeight,"light",0,1,.01).name("轻击命中部位"),q.add(k.hitHeight,"heavy",0,1,.01).name("重击命中部位"),q.add(k.hitHeight,"knock",0,1,.01).name("击退命中部位"),q.add(k,"leanLight",0,1.5,.01).name("轻击力度"),q.add(k,"leanHeavy",0,1.5,.01).name("重击力度"),q.add(k,"leanKnock",0,1.5,.01).name("击退力度"),q.add(k,"flashStrength",0,2,.05).name("受击闪光强度");for(const{name:wt,p:Xt}of[{name:"打腹 (abdomen)",p:k.abdomen},{name:"打肩 (shoulder)",p:k.shoulder}]){const xt=d(q,wt);xt.add(Xt,"upperPitch",0,2,.01).name("上身前后倾斜"),xt.add(Xt,"upperRoll",0,2,.01).name("上身侧倾"),xt.add(Xt,"upperYaw",0,1.5,.01).name("肩部扭转"),xt.add(Xt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),xt.add(Xt,"shift",0,.8,.01).name("身体反应位移"),xt.add(Xt,"drop",0,.4,.01).name("整体下沉"),xt.add(Xt,"back",0,.4,.01).name("屁股向后"),xt.add(Xt,"knee",0,1.6,.01).name("屈膝"),xt.add(Xt,"hip",0,1,.01).name("髋前倾"),xt.add(Xt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)")}const Z=d(C,"派生招"),j=o.links;Z.add(j,"enabled").name("总开关 (false=旧连击)"),Z.add(j.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),Z.add(j.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),Z.add(j.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),Z.add(j,"sharedCooldown",0,3,.05).name("共享 CD (s)"),Z.add(j,"triggerWhileSprinting").name("长跑中可直接触发"),Z.add(j.search,"range",1,14,.1).name("索敌距离 (m)"),Z.add(j.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),Z.add(j.search,"stopDistance",0,3,.05).name("停住距离 (m)");const pt=j.moves["sword-shield"];pt&&(Z.add(pt,"enabled").name("剑盾盾击"),Z.add(pt,"distance",0,8,.1).name("冲锋极限 (m)"),Z.add(pt,"windup",0,.5,.01).name("前摇 (s)"),Z.add(pt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),Z.add(pt,"recovery",0,.8,.01).name("收势 (s)"),Z.add(pt.hit,"radius",0,4,.05).name("命中半径 (m)"),Z.add(pt.hit,"width",0,2,.05).name("扫掠半径 (m)"),Z.add(pt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),Z.add(pt.hit,"duration",0,1.5,.01).name("僵直 (s)"));const dt=o.targeting,_t=d(C,"目标辅助");_t.add(dt,"targetAssist").name("启用目标辅助"),_t.add(dt,"range",1,14,.5).name("锁定范围 (m)"),_t.add(dt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),_t.add(dt,"frontBias",0,4,.1).name("朝向加权"),_t.add(dt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),_t.add(dt,"maxLungeScale",1,3,.1).name("前冲最大放大");const Yt=l("表现 / 特效"),J=d(Yt,"挥击幅度 / 刀光"),W=t.animation.swing;J.add(W,"enabled").name("挥击身体幅度 开"),J.add(W,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),J.add(W,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),J.add(W,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),J.add(W,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),J.add(W,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),J.add(W,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),J.add(W,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),J.add(W.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const O=t.weaponTrail;J.add(O,"enabled").name("挥击刀光 开"),J.add(O,"life",.04,.4,.01).name("刀光残留 (s)"),J.add(O,"intensity",0,1.5,.05).name("刀光亮度"),J.add(O,"minStep",.005,.1,.005).name("采样最小位移 (m)"),J.add(t.hitstop,"enabled").name("命中卡肉 / 震屏");const Pt=d(Yt,"夸张化 / 四肢伸缩"),ot=t.animation.stretch;Pt.add(ot,"enabled").name("四肢伸缩 开"),Pt.add(ot,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),Pt.add(ot,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),Pt.add(ot,"impactSquash",0,.5,.01).name("命中挤压量"),Pt.add(ot,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),Pt.add(ot,"torsoGain",0,1,.05).name("躯干跟随比例"),Pt.add(ot,"volumeExp",0,1.5,.05).name("体积补偿指数");const at=d(Yt,"武器握持 / 腕部"),Tt=t.weaponWrist;at.add(Tt,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),at.add(Tt,"lag",0,.08,.002).name("臂速 → 腕滞后"),at.add(Tt,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),at.add(Tt,"rate",4,50,1).name("腕部跟随速率 (1/s)"),at.add(Tt,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),at.add(Tt,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const mt=t.weaponMount;at.add(mt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),at.add(mt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),at.add(mt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),at.add(mt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),at.add(mt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),at.add(mt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),at.add(mt,"swordPitchDeg",0,90,1).name("剑前倾角"),at.add(mt,"swordYawDeg",0,45,1).name("剑外张角"),at.add(mt,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),at.add(mt,"staffPitchDeg",0,60,1).name("法杖前倾角");const zt=l("假人 / 混战"),D=o.dummies,R=d(zt,"普通假人 AI");R.add(D,"moveSpeed",.5,8,.1).name("移动速度"),R.add(D,"wanderRadius",.5,8,.1).name("游走半径"),R.add(D,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),R.add(D,"followStopDistance",.3,5,.1).name("跟随停距"),R.add(D,"keepDistance",1,10,.1).name("保持距离"),R.add(D,"keepDeadZone",.1,2,.05).name("保持死区"),R.add(D,"attackRange",.5,5,.1).name("攻击距离"),R.add(D,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),R.add(D,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const Q=D.fighters;if(Q){const wt=d(zt,"持械陪练（剑盾 / 双刀 / 大剑）");wt.add(Q,"moveSpeed",.5,6,.1).name("移动速度"),wt.add(Q,"attackInterval",.5,8,.1).name("攻击间隔 (s)"),wt.add(Q,"attackRangeScale",.5,1.2,.02).name("起手距离 / 武器 reach"),wt.add(Q,"knockbackScale",0,2,.05).name("击退比例"),wt.add(Q,"leashRadius",0,14,.5).name("牵引半径 (m)"),wt.add(Q,"comboCount",0,3,1).name("连击段数 (0=随武器)"),wt.add(Q,"comboGap",0,.6,.01).name("段间缝隙 (s, 0=用全局)");const Xt=()=>n.dummies.find(Ut=>Ut.weapon!==null),xt={get mode(){var Ut;return((Ut=Xt())==null?void 0:Ut.mode)??"spar"},set mode(Ut){i.setFighterMode(Ut)}};wt.add(xt,"mode",Pp).name("陪练行为（全部）")}const ut=l("相机"),ft=d(ut,"基础");ft.add(t.camera,"pitchDeg",20,80,1).name("俯角"),ft.add(t.camera,"yawDeg",-180,180,1).name("方位角"),ft.add(t.camera,"distance",6,35,.5).name("距离"),ft.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),ft.add(t.camera,"fov",25,90,1).name("FOV");const st=o.camera,kt=d(ut,"智能构图");kt.add(st,"radius",2,18,.5).name("威胁评估半径 (m)"),kt.add(st,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),kt.add(st,"saturation",.5,8,.1).name("威胁归一化饱和"),kt.add(st,"pushIn",0,.5,.01).name("无威胁推进比例"),kt.add(st,"maxPullback",0,1,.02).name("最大拉远比例"),kt.add(st,"maxOffset",0,6,.1).name("最大构图平移 (m)"),kt.add(st,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),kt.add(st,"framingBias",0,1,.05).name("威胁质心平移系数"),kt.add(st,"attackBoost",0,2,.05).name("挥砍中额外加权"),kt.add(st.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),kt.add(st.modeWeight,"spar",0,3,.05).name("陪练模式威胁倍率"),kt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Et=d(ut,"缩放");return Et.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),Et.add(t.zoom,"max",1,4,.05).name("最大拉远上限"),Et.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),Et.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),Et.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),Et.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),Et.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),Et.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(wt=>wt.close()),c.forEach(wt=>wt.close()),s.close(),{gui:s,refreshWeapon:()=>G.updateDisplay()}}function k_(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function I_(n,t){return n.find(e=>e.id===t)??null}function Iu(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,c)=>r.index-c.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function z_({stations:n,plots:t=[],world:e,view:i,container:a,onResetZoom:s,onPlotTest:o,onClearTestUnits:r}){var A;const c=a??document.getElementById("lab-panel");let l=null,d=null;const u=new Map,h=document.createElement("div");h.id="lab-toast",h.setAttribute("aria-live","polite"),document.body.appendChild(h);let f=0;function m(_){h.textContent=`${_.index} · ${_.name} — ${_.hint}`,h.style.borderColor=_.color,h.classList.add("is-on"),window.clearTimeout(f),f=window.setTimeout(()=>h.classList.remove("is-on"),5e3)}function v(){return k_(n,e.character.position.x,e.character.position.z)}function g(){const _=v(),M=(_==null?void 0:_.id)??null;if(M===l)return;const P=l!==null;l=M;for(const[I,L]of u)L.classList.toggle("is-active",I===M);d&&(d.textContent=_?`${_.index} · ${_.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",d.style.color=_?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),_?m(_):P&&h.classList.remove("is-on")}function p(_){const M=typeof _=="number"?n.find(P=>P.index===_)??null:I_(n,_);return M?(jx(e,M.spawnX,M.spawnZ),e.camera.centroidX=M.spawnX,e.camera.centroidZ=M.spawnZ,i.snapCamera(M.spawnX,e.character.position.y,M.spawnZ),g(),!0):!1}function b(){Qp(e)}function x(_){return p(_.id),o?o(_):0}function y(){return r?r():0}function S(_){const M=typeof _=="number"?t.find(P=>P.index===_):t.find(P=>P.id===_);return M&&M.testSpawn?x(M):0}const w=t.filter(_=>_.testSpawn),E=_=>{var M,P;return(((M=_.testSpawn)==null?void 0:M.dummies)??0)+(((P=_.testSpawn)==null?void 0:P.fighters)??0)};if(c){c.textContent="";const _=document.createElement("div");_.className="lab-head",_.textContent="测试工位";const M=document.createElement("span");M.className="lab-tip",M.textContent="[ / ] 切换",_.appendChild(M),c.appendChild(_);for(const L of[...n].sort((F,C)=>F.index-C.index)){const F=document.createElement("button");F.type="button",F.className="lab-row",F.dataset.station=L.id,F.dataset.uiButton="",F.style.setProperty("--lab-color",L.color),F.setAttribute("aria-label",`传送到工位 ${L.index}：${L.name}`);const C=document.createElement("span");C.className="lab-idx",C.textContent=String(L.index);const T=document.createElement("span");T.className="lab-name",T.textContent=L.name,F.append(C,T),F.addEventListener("pointerdown",B=>{B.preventDefault(),B.stopPropagation(),p(L.id)}),c.appendChild(F),u.set(L.id,F)}if(d=document.createElement("div"),d.className="lab-hint",c.appendChild(d),w.length>0){const L=document.createElement("div");L.className="lab-head lab-subhead",L.textContent="地块测试";const F=document.createElement("span");F.className="lab-tip",F.textContent="就地生成",L.appendChild(F),c.appendChild(L);for(const C of w){const T=document.createElement("div");T.className="lab-row lab-test-row",T.dataset.plot=C.id;const B=document.createElement("span");B.className="lab-name",B.textContent=C.name;const G=document.createElement("button");G.type="button",G.className="lab-btn lab-test",G.dataset.uiButton="",G.dataset.plotTest=C.id,G.textContent=((A=C.testSpawn)==null?void 0:A.label)??`生成 ${E(C)} 人`,G.setAttribute("aria-label",`在${C.name}就地生成 ${E(C)} 个测试单位`),G.addEventListener("pointerdown",$=>{$.preventDefault(),$.stopPropagation(),x(C)}),T.append(B,G),c.appendChild(T)}}const P=document.createElement("div");P.className="lab-foot";const I=document.createElement("button");if(I.type="button",I.className="lab-btn",I.dataset.uiButton="",I.textContent="召回假人",I.setAttribute("aria-label","召回全部假人回到各自工位"),I.addEventListener("pointerdown",L=>{L.preventDefault(),L.stopPropagation(),b()}),P.appendChild(I),w.length>0){const L=document.createElement("button");L.type="button",L.className="lab-btn",L.dataset.uiButton="",L.dataset.clearTestUnits="",L.textContent="清除测试单位",L.setAttribute("aria-label","清除所有由地块测试按钮生成的假人与陪练"),L.addEventListener("pointerdown",F=>{F.preventDefault(),F.stopPropagation(),y()}),P.appendChild(L)}if(s){const L=document.createElement("button");L.type="button",L.className="lab-btn",L.dataset.uiButton="",L.textContent="镜头归位",L.setAttribute("aria-label","把镜头缩放恢复到默认"),L.addEventListener("pointerdown",F=>{F.preventDefault(),F.stopPropagation(),s()}),P.appendChild(L)}c.appendChild(P)}return window.addEventListener("keydown",_=>{var M,P;if(!(_.metaKey||_.ctrlKey||_.altKey))if(_.key==="["){const I=Iu(n,((M=v())==null?void 0:M.id)??l,-1);I&&p(I.id)}else if(_.key==="]"){const I=Iu(n,((P=v())==null?void 0:P.id)??l,1);I&&p(I.id)}else _.key==="\\"&&b()}),g(),{goto:p,current:v,tick:g,recall:b,spawnAt:S,clearSpawned:y,element:c}}const nl=Math.PI*2,Di={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},F_=45,U_=50;function N_(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function fo(n,t,e){const i=N_(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function O_(n,t){return Math.atan2(n,-t)*180/Math.PI}function zu(n,t){return Math.abs(((n-t)%360+540)%360-180)}function rr(n){return(n%360+360)%360}const B_={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function H_(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),c=a.velocity,l=Math.hypot(c.x,c.z),d=o>.001?fo(s.moveX,s.moveZ,e):null,u=l>.15?fo(c.x,c.z,e):null,h=fo(Math.sin(a.facing),Math.cos(a.facing),e),f=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?fo(s.aimX,s.aimZ,e):null,m=n.targeting,v=m.hasTarget?fo(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=d!==null&&u!==null?zu(d,u):null,p=d!==null?zu(d,h):null,b=g!==null&&g>F_&&o>=.35&&l>=.4;return{inDeg:d,inLen:Math.min(1,o),rawDeg:r>.02?O_(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:u,speed:l,faceDeg:h,lockDeg:v,lockId:m.targetId,lockDist:m.targetDist,aimDeg:f,gapMove:g,gapFace:p,warnMove:b}}function Fu(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>U_&&(n.inLen>=.35||n.speed>=.4)}const Uu="harness.dirDebug";function G_(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(Uu)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),s&&(s.textContent=c?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(c)))}l();function d(x){if(c=x,!t)try{window.localStorage.setItem(Uu,x?"1":"0")}catch{}l()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),d(!c)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&d(!c)});const u=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;a.width=Math.round(h*u),a.height=Math.round(h*u);let f=B_,m=0,v="",g=8;function p(x){if(!r)return;const y=h,S=h,w=y/2,E=S/2,A=Math.min(y,S)/2-13;r.setTransform(u,0,0,u,0,0),r.clearRect(0,0,y,S),r.beginPath(),r.arc(w,E,A,0,nl),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":Di.ring,r.stroke(),r.strokeStyle=Di.grid,r.beginPath(),r.moveTo(w-A,E),r.lineTo(w+A,E),r.moveTo(w,E-A),r.lineTo(w,E+A),r.stroke();for(let I=0;I<8;I++){const L=I*Math.PI/4,F=w+Math.sin(L)*(A-3),C=E-Math.cos(L)*(A-3),T=w+Math.sin(L)*A,B=E-Math.cos(L)*A;r.beginPath(),r.moveTo(F,C),r.lineTo(T,B),r.stroke()}const _=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;_>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=Di.dead,r.beginPath(),r.arc(w,E,A*_,0,nl),r.stroke(),r.restore());const M=(I,L,F,C,T=!1,B=1)=>{const G=I*Math.PI/180,$=Math.sin(G),it=-Math.cos(G),ht=A*Math.max(.14,Math.min(1,L)),yt=w+$*A*.14,Lt=E+it*A*.14,q=w+$*ht,k=E+it*ht;if(r.save(),r.globalAlpha=B,r.strokeStyle=F,r.fillStyle=F,r.lineWidth=C,r.lineCap="round",T&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(yt,Lt),r.lineTo(q,k),r.stroke(),!T&&ht>A*.3){const Z=-it,j=$,pt=5.2;r.beginPath(),r.moveTo(q+$*1.5,k+it*1.5),r.lineTo(q-$*pt+Z*pt*.72,k-it*pt+j*pt*.72),r.lineTo(q-$*pt-Z*pt*.72,k-it*pt-j*pt*.72),r.closePath(),r.fill()}r.restore()},P=(I,L)=>{const F=I*Math.PI/180,C=Math.sin(F),T=-Math.cos(F),B=-T,G=C,$=A+1.5,it=$+6.5;r.save(),r.fillStyle=L,r.strokeStyle=L,r.lineWidth=1,r.beginPath(),r.moveTo(w+C*it,E+T*it),r.lineTo(w+C*$+B*4,E+T*$+G*4),r.lineTo(w+C*$-B*4,E+T*$-G*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&M(x.lockDeg,1,Di.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&M(x.rawDeg,x.rawLen,Di.raw,1,!0,.9),x.aimDeg!==null&&M(x.aimDeg,1,Di.aim,1.6,!0,.95),M(x.faceDeg,1,Di.face,1.1,!0,.55),x.moveDeg!==null&&M(x.moveDeg,x.speed/Math.max(1,g),Di.move,5.5,!1,.8),x.inDeg!==null&&M(x.inDeg,x.inLen,Di.input,2.2),P(x.faceDeg,Di.face),r.beginPath(),r.arc(w,E,2.2,0,nl),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function b(x,y){const S=A=>A===null?"-":String(Math.round(rr(A)));o.in.textContent=`入 ${S(x.inDeg)}`,o.mv.textContent=`移 ${S(x.moveDeg)}`,o.fc.textContent=`面 ${S(x.faceDeg)}`;const w=A=>A===null?"-":`${Math.round(A)}°`,E=[`Δ入→移 ${w(x.gapMove)}`,`Δ入→面 ${w(x.gapFace)}`];x.speed>.05&&E.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&E.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&E.push("拖拽瞄准"),o.gap.textContent=E.join("  "),e.classList.toggle("is-warn",x.warnMove||Fu(x,y))}return{update(x,y,S){if(!c)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const w=H_(x,y,S,g);f=w;const E=x.combat.phase!=="idle";p(w);const A=performance.now(),_=`${w.inDeg}|${w.moveDeg}|${w.faceDeg}|${w.lockId}|${w.aimDeg}|${w.warnMove}|${w.speed.toFixed(1)}`;(A-m>90||_!==v)&&(m=A,v=_,b(w,E),e.dataset.in=w.inDeg===null?"":rr(w.inDeg).toFixed(1),e.dataset.mv=w.moveDeg===null?"":rr(w.moveDeg).toFixed(1),e.dataset.fc=rr(w.faceDeg).toFixed(1),e.dataset.warn=w.warnMove||Fu(w,E)?"1":"0")},setEnabled:d,toggle(){return d(!c),c},enabled:()=>c,last:()=>f}}const X_=6,V_=480,Nu=240,Ou=128,W_=18,Y_=.05,Bu=.16,$_=.02;function Hu(n,t,e){if(!e)return"air";if(t<Y_)return"both";const i=Math.sin(n);return i>Bu?"L":i<-Bu?"R":"both"}function Gu(n){const t=Math.PI*2;return(n%t+t)%t}function Xu(n,t){const e=Math.PI*2;let i=t-n;return i-=Math.round(i/e)*e,n+i}const Vu={L:"#fbbf24",R:"#a78bfa",both:"rgba(148, 163, 184, 0.85)",air:"#38bdf8"},Z_={L:"rgba(251, 191, 36, 0.13)",R:"rgba(167, 139, 250, 0.13)",both:"rgba(148, 163, 184, 0.09)",air:"rgba(56, 189, 248, 0.07)"},j_={L:"左踩",R:"右踩",both:"双踩",air:"腾空"};function q_(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1,phase:0,stance:"both",grounded:!0,moving:!1}}function K_(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function J_(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function Q_(n={}){const t=Math.max(1,n.windowS??X_),e=Math.max(60,n.capacity??V_),i=Math.max(1,n.speedCap??W_),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv / 相位</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="128"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),c=s.querySelector("#motiondbg-graph"),l=s.querySelector("#motiondbg-read"),d=s.querySelector("#motiondbg-window"),u=s.querySelector("#motiondbg-dir");d.textContent=`${t.toFixed(1)}s`;const h=c.getContext("2d"),f=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(Nu*f),c.height=Math.round(Ou*f);const m=G_({deadZone:n.deadZone,container:u,embedded:!0});let v=!1;function g(M){v=M,s.classList.toggle("is-off",!M),!a&&r&&(r.textContent=M?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(M)),r.setAttribute("aria-label",M?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",M=>{M.preventDefault(),M.stopPropagation(),g(!v)}),window.addEventListener("keydown",M=>{M.key.toLowerCase()==="v"&&!M.metaKey&&!M.ctrlKey&&g(!v)}));const p=[];let b=0,x=null,y=0,S=!1,w=-1,E={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1,phase:0,stance:"both"};function A(M){const P=M-t;let I=0;for(;I<p.length&&p[I].t<P;)I++;return p.slice(I)}function _(M,P){if(!h)return;const I=Nu,L=Ou;h.setTransform(f,0,0,f,0,0),h.clearRect(0,0,I,L),h.fillStyle="rgba(8, 12, 17, 0.55)",h.fillRect(0,0,I,L);const F=4,C=4,T=I-F-C,B=9,G=44,$=58,it=20,ht=84,yt=38,Lt=P-t,q=J=>F+Math.max(0,Math.min(1,(J-Lt)/t))*T;for(let J=0;J<M.length;J++){if(!M[J].busy)continue;const W=q(M[J].t),O=J+1<M.length?q(M[J+1].t):W+2;h.fillStyle="rgba(251, 146, 60, 0.13)",h.fillRect(W,B,Math.max(2,O-W),G)}h.strokeStyle="rgba(150, 190, 220, 0.14)",h.lineWidth=1,h.beginPath();for(const J of[B,B+G/2,B+G])h.moveTo(F,J),h.lineTo(I-C,J);h.moveTo(F,$+it/2),h.lineTo(I-C,$+it/2);for(const J of[ht,ht+yt/2,ht+yt])h.moveTo(F,J),h.lineTo(I-C,J);h.stroke();const Z=Math.max(1,...M.map(J=>J.speed),...M.map(J=>J.drive))*1.15,j=J=>B+G-J/Z*G;if(M.length>1){h.beginPath(),h.moveTo(q(M[0].t),j(M[0].speed));for(let J=1;J<M.length;J++)h.lineTo(q(M[J].t),j(M[J].speed));h.strokeStyle="#38bdf8",h.lineWidth=1.8,h.lineJoin="round",h.stroke(),h.lineTo(q(M[M.length-1].t),B+G),h.lineTo(q(M[0].t),B+G),h.closePath(),h.fillStyle="rgba(56, 189, 248, 0.14)",h.fill(),h.beginPath(),h.moveTo(q(M[0].t),j(M[0].drive));for(let J=1;J<M.length;J++)h.lineTo(q(M[J].t),j(M[J].drive));h.setLineDash([3,3]),h.strokeStyle="rgba(190, 205, 220, 0.6)",h.lineWidth=1.2,h.stroke(),h.setLineDash([])}let pt=.02;for(const J of M)pt=Math.max(pt,Math.abs(J.dv));pt*=1.1;const dt=$+it/2,_t=it/2;for(const J of M){const W=Math.min(_t,Math.abs(J.dv)/pt*_t);h.fillStyle=J.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",h.fillRect(q(J.t)-.7,J.dv>=0?dt-W:dt,1.4,Math.max(.5,W))}const Yt=J=>ht+yt/2-J*(yt/2-1);for(let J=0;J<M.length;J++){const W=M[J].stance;if(W==="air")continue;const O=q(M[J].t),Pt=J+1<M.length?q(M[J+1].t):O+2;h.fillStyle=Z_[W],h.fillRect(O,ht,Math.max(1,Pt-O),yt)}if(M.length>1){let J=q(M[0].t),W=Yt(Math.sin(M[0].phase));for(let Pt=1;Pt<M.length;Pt++){const ot=M[Pt-1],at=M[Pt],Tt=q(ot.t),mt=q(at.t),zt=Xu(ot.phase,at.phase),D=Math.max(1,Math.min(16,Math.round((mt-Tt)/2)));for(let R=1;R<=D;R++){const Q=R/D,ut=ot.phase+(zt-ot.phase)*Q,ft=Tt+(mt-Tt)*Q,st=Yt(Math.sin(ut)),kt=R===D?at.stance:Hu(ut,ot.moving?1:0,ot.grounded);h.beginPath(),h.moveTo(J,W),h.lineTo(ft,st),h.strokeStyle=Vu[kt],h.lineWidth=1.7,h.lineJoin="round",h.stroke(),J=ft,W=st}}const O=M[M.length-1];h.beginPath(),h.arc(q(O.t)-1.5,Yt(Math.sin(O.phase)),2.1,0,Math.PI*2),h.fillStyle=Vu[O.stance],h.fill()}h.font="9px ui-monospace, monospace",h.fillStyle="rgba(190, 214, 234, 0.55)",h.textAlign="left",h.fillText(Z.toFixed(1),F+2,B+8),h.fillText("v",F+2,B+G-2),h.fillText("Δv",F+2,$+9),h.fillStyle="rgba(251, 191, 36, 0.75)",h.fillText("L",F+2,ht+8),h.fillStyle="rgba(167, 139, 250, 0.75)",h.fillText("R",F+2,ht+yt-2),h.textAlign="right",h.fillStyle="rgba(190, 214, 234, 0.55)",h.fillText("0",I-C-2,B+G-2),h.textAlign="left"}return{dirDebug:m,update(M,P,I){var q;const L=performance.now()/1e3,F=w<0?1/60:Math.max(1e-4,Math.min(.25,L-w));w=L;const C=M.character,T={x:C.position.x,z:C.position.z},B=Math.hypot(C.velocity.x,C.velocity.z),{speed:G,raw:$}=x?K_(x,T,F,i):{speed:0,raw:0},it=q_(b,G,F,L);it.drive=B,it.raw=$,it.busy=J_(M);const ht=((q=n.phaseSource)==null?void 0:q.call(n))??C.gaitPhase;it.phase=ht,it.grounded=C.grounded,it.moving=S&&Math.abs(Xu(y,ht)-y)>$_,y=ht,S=!0,it.stance=Hu(ht,it.moving?1:0,C.grounded),x=T,b=G,p.push(it),p.length>e&&p.shift();const yt=A(L);let Lt=0;for(const k of yt)Lt=Math.max(Lt,k.speed);if(E={speed:G,drive:B,raw:$,dv:it.dv,accel:it.accel,peak:Lt,samples:yt.length,windowS:t,busy:it.busy,phase:Gu(ht),stance:it.stance},m.update(M,P,I),v){_(yt,L);const k=it.dv>=0?"+":"";l.textContent=`v ${G.toFixed(2)} · 驱 ${B.toFixed(2)} · 峰 ${Lt.toFixed(2)} · Δv ${k}${it.dv.toFixed(3)} · ${yt.length} 帧
φ ${Gu(ht).toFixed(2)} · ${j_[it.stance]}`}},setEnabled:g,toggle(){return g(!v),v},enabled:()=>v,last:()=>({...E}),samples:()=>A(performance.now()/1e3).map(M=>({...M}))}}const tb=["剑盾","双剑","大剑","法杖","弓"],eb={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击",spar:"陪练"};function nb(n){return{update(t,e,i,a,s,o,r=!1){const c=t.character,l=c.position,d=c.velocity,u=t.combat,h=t.events.length>0?t.events[t.events.length-1]:null,f=J=>J.toFixed(2),m=J=>(J*180/Math.PI).toFixed(0),v=tb[ba.indexOf(u.weapon)]??u.weapon,g=Math.round(u.charge*10),p="|".repeat(g)+".".repeat(10-g),b=t.dash,x=b.phase==="active"&&b.duration>0?(1-b.timer/b.duration)*100:0,y=b.phase==="active"?`${b.kind}@${x.toFixed(0)}%`:`${b.kind} cd${f(b.cooldown)}`,S=a.intents.aimActive?`(${f(a.intents.aimX)},${f(a.intents.aimZ)})`:"-",w=d.x*Math.sin(c.bodyYaw)+d.z*Math.cos(c.bodyYaw),E=d.x*Math.cos(c.bodyYaw)-d.z*Math.sin(c.bodyYaw),A=Math.abs(w)+Math.abs(E)+1e-6,_=Math.round(Math.abs(E)/A*100),M=`strafe ${_}%${w<-.05?" back":""}`,P=t.camera,I=`threat ${(P.threat*100).toFixed(0)}%  dist×${f(P.distanceScale)}  off (${f(P.offsetX)},${f(P.offsetZ)})  pitch +${f(P.pitchDelta)}°  n=${P.threatCount}`,L=o?f(o.attackBlend):"-",F=o==null?void 0:o.attackWeights,C=F?`gw ${f(F.gaitScale)}  lw ${f(F.attackLegWeight)}  spd ${f(F.driveSpeed)}`:"-",T=F?`${f(F.gaitScale)}/${f(F.attackLegWeight)}`:"-",B=o?`${o.landing.kind} ${f(o.landing.pulse)} t${f(o.landing.remaining)} vy${f(o.landing.impactVy)}`:"-",G=o?`${o.landing.kind}/${f(o.landing.pulse)}`:"-",$=(o==null?void 0:o.zoom)!==void 0?`zoom ×${f(o.zoom)}`:"-",it=o==null?void 0:o.hurt,ht=it?`hurt ${t.playerHurt.type}  部位h${f(it.hitHeight)}  脉冲p${f(it.pulse)}  上身${f(it.upperShift)}  重心${f(it.comShift)}  后坐${f(it.pelvisBack)}  屈膝${f(it.knee)}`:"-",yt=it?`${f(it.hitHeight)}/${f(it.pulse)}/${f(it.knee)}`:"-",Lt=o==null?void 0:o.ik,q=Lt?`${Lt.active?"on":"off"} w${f(Lt.weight)} e${f(Lt.maxError)}`:"-",k=t.playerLink,Z=`link ${k.kind||"-"}  ${k.phase}  prog ${f(k.progress)}  win ${f(k.linkWindow)}s  cd ${f(k.cooldown)}s  hits ${k.hitIds.length}  travel ${f(k.travelled)}/${f(k.travel)}m  id ${k.id}`,j=`${k.phase}/${k.kind||"-"}/w${f(k.linkWindow)}`,pt=a.lastGesture,dt=pt?`${pt.button} ${pt.kind} ${pt.heldMs.toFixed(0)}ms d${pt.distance.toFixed(0)}px ${pt.angleDeg.toFixed(0)}° taps${pt.taps}`:"-",_t=t.dummies.map(J=>`${J.id}:${eb[J.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${v} ${u.phase} · lk ${k.phase}${k.kind?`/${k.kind}`:""} w${f(k.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${f(l.x)},${f(l.y)},${f(l.z)})  vel (${f(d.x)},${f(d.y)},${f(d.z)})`,`face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  st${_}%  stick(${f(a.stickX)},${f(a.stickY)}) ${a.source}  str${f(c.stride)}`,`weapon ${v}  ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}  dash ${y}  ab ${L}  gw/lw ${T}  land ${G}  ik ${q}`,`aim ${S}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${yt}`,`dummies ${_t}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${f(P.distanceScale)}  ${$}  lk ${j}`,`event ${h?`${h.type} ${f(h.value)}`:"-"}  scale ${f(s.timeScale)}${s.paused?" [P]":""}  g ${dt}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${f(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${f(l.x)}, ${f(l.y)}, ${f(l.z)})`,`vel  (${f(d.x)}, ${f(d.y)}, ${f(d.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${m(c.facing)}deg   atkBlend ${L}   ${C}   land ${B}`,ht,`ik ${q}  clamped ${Lt?Lt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  (head-body ${m(c.headYaw-c.bodyYaw)})  ${M}`,`move (${f(a.intents.moveX)}, ${f(a.intents.moveZ)})  stick (${f(a.stickX)}, ${f(a.stickY)})  ${a.source}  aim ${S}`,`weapon ${v}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${b.kind}  phase ${b.phase}  prog ${x.toFixed(0)}%  cd ${f(b.cooldown)}s  id ${b.id}  from (${f(b.fromX)},${f(b.fromZ)}) → to (${f(b.toX)},${f(b.toZ)})`,Z,`camera ${I}  ${$}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${_t}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${f(t.impulse.x)}, ${f(t.impulse.z)})`,`event ${h?`${h.type} ${f(h.value)}`:"-"}   scale ${f(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${dt}`].join(`
`)}}}const cr=["lab","hud","motion","debug"],Wu={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Yu={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function ib(n){var c;const t=Object.fromEntries(cr.map(l=>[l,document.getElementById(Yu[l].toggle)])),e=Object.fromEntries(cr.map(l=>[l,document.getElementById(Yu[l].panel)]));let i={},a=null;function s(){var l,d,u;for(const h of cr){const f=a===h,m=t[h],v=e[h];m&&(m.setAttribute("aria-expanded",String(f)),m.textContent=`${Wu[h].short} ${f?"▾":"▸"}`,m.setAttribute("aria-label",`${f?"收起":"展开"}${Wu[h].full}`)),v&&v.classList.toggle("is-open",f)}n.classList.toggle("is-compact",a!=="hud"),(l=i.motion)==null||l.setEnabled(a==="motion"),a==="debug"?(d=i.debug)==null||d.open():(u=i.debug)==null||u.close()}function o(l){a=a===l?null:l,s()}function r(){a!==null&&(a=null,s())}for(const l of cr)(c=t[l])==null||c.addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),o(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(l){i=l,s()},toggle:o,closeAll:r,isOpen:l=>a===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const dh="170",ab=0,$u=1,sb=2,gm=1,xm=2,Ki=3,Sa=0,Yn=1,qe=2,ya=0,Fs=1,Qi=2,Zu=3,ju=4,ob=5,Va=100,rb=101,cb=102,lb=103,db=104,hb=200,ub=201,fb=202,pb=203,sd=204,od=205,mb=206,gb=207,xb=208,vb=209,yb=210,Mb=211,_b=212,bb=213,Sb=214,rd=0,cd=1,ld=2,Vs=3,dd=4,hd=5,ud=6,fd=7,hh=0,wb=1,Eb=2,Ma=0,Tb=1,Ab=2,Rb=3,Pb=4,Cb=5,Lb=6,Db=7,vm=300,Ws=301,Ys=302,pd=303,md=304,wc=306,gd=1e3,Ya=1001,xd=1002,oi=1003,kb=1004,lr=1005,zi=1006,il=1007,$a=1008,ia=1009,ym=1010,Mm=1011,Xo=1012,uh=1013,qa=1014,Fi=1015,qo=1016,fh=1017,ph=1018,$s=1020,_m=35902,bm=1021,Sm=1022,wi=1023,wm=1024,Em=1025,Us=1026,Zs=1027,mh=1028,gh=1029,Tm=1030,xh=1031,vh=1033,Yr=33776,$r=33777,Zr=33778,jr=33779,vd=35840,yd=35841,Md=35842,_d=35843,bd=36196,Sd=37492,wd=37496,Ed=37808,Td=37809,Ad=37810,Rd=37811,Pd=37812,Cd=37813,Ld=37814,Dd=37815,kd=37816,Id=37817,zd=37818,Fd=37819,Ud=37820,Nd=37821,qr=36492,Od=36494,Bd=36495,Am=36283,Hd=36284,Gd=36285,Xd=36286,Ib=3200,zb=3201,Rm=0,Fb=1,pa="",Hn="srgb",qs="srgb-linear",Ec="linear",Oe="srgb",us=7680,qu=519,Ub=512,Nb=513,Ob=514,Pm=515,Bb=516,Hb=517,Gb=518,Xb=519,Vd=35044,Lo=35048,Ku="300 es",ea=2e3,hc=2001;class Ks{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const Ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ju=1234567;const Ns=Math.PI/180,Vo=180/Math.PI;function Ni(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ln[n&255]+Ln[n>>8&255]+Ln[n>>16&255]+Ln[n>>24&255]+"-"+Ln[t&255]+Ln[t>>8&255]+"-"+Ln[t>>16&15|64]+Ln[t>>24&255]+"-"+Ln[e&63|128]+Ln[e>>8&255]+"-"+Ln[e>>16&255]+Ln[e>>24&255]+Ln[i&255]+Ln[i>>8&255]+Ln[i>>16&255]+Ln[i>>24&255]).toLowerCase()}function Rn(n,t,e){return Math.max(t,Math.min(e,n))}function yh(n,t){return(n%t+t)%t}function Vb(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function Wb(n,t,e){return n!==t?(e-n)/(t-n):0}function Do(n,t,e){return(1-e)*n+e*t}function Yb(n,t,e,i){return Do(n,t,1-Math.exp(-e*i))}function $b(n,t=1){return t-Math.abs(yh(n,t*2)-t)}function Zb(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function jb(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function qb(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Kb(n,t){return n+Math.random()*(t-n)}function Jb(n){return n*(.5-Math.random())}function Qb(n){n!==void 0&&(Ju=n);let t=Ju+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function t1(n){return n*Ns}function e1(n){return n*Vo}function n1(n){return(n&n-1)===0&&n!==0}function i1(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function a1(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function s1(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),c=o(e/2),l=s((t+i)/2),d=o((t+i)/2),u=s((t-i)/2),h=o((t-i)/2),f=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*d,c*u,c*h,r*l);break;case"YZY":n.set(c*h,r*d,c*u,r*l);break;case"ZXZ":n.set(c*u,c*h,r*d,r*l);break;case"XZX":n.set(r*d,c*m,c*f,r*l);break;case"YXY":n.set(c*f,r*d,c*m,r*l);break;case"ZYZ":n.set(c*m,c*f,r*d,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Si(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ie(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Qu={DEG2RAD:Ns,RAD2DEG:Vo,generateUUID:Ni,clamp:Rn,euclideanModulo:yh,mapLinear:Vb,inverseLerp:Wb,lerp:Do,damp:Yb,pingpong:$b,smoothstep:Zb,smootherstep:jb,randInt:qb,randFloat:Kb,randFloatSpread:Jb,seededRandom:Qb,degToRad:t1,radToDeg:e1,isPowerOfTwo:n1,ceilPowerOfTwo:i1,floorPowerOfTwo:a1,setQuaternionFromProperEuler:s1,normalize:Ie,denormalize:Si};class Wt{constructor(t=0,e=0){Wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Rn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class _e{constructor(t,e,i,a,s,o,r,c,l){_e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l)}set(t,e,i,a,s,o,r,c,l){const d=this.elements;return d[0]=t,d[1]=a,d[2]=r,d[3]=e,d[4]=s,d[5]=c,d[6]=i,d[7]=o,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],c=i[6],l=i[1],d=i[4],u=i[7],h=i[2],f=i[5],m=i[8],v=a[0],g=a[3],p=a[6],b=a[1],x=a[4],y=a[7],S=a[2],w=a[5],E=a[8];return s[0]=o*v+r*b+c*S,s[3]=o*g+r*x+c*w,s[6]=o*p+r*y+c*E,s[1]=l*v+d*b+u*S,s[4]=l*g+d*x+u*w,s[7]=l*p+d*y+u*E,s[2]=h*v+f*b+m*S,s[5]=h*g+f*x+m*w,s[8]=h*p+f*y+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8];return e*o*d-e*r*l-i*s*d+i*r*c+a*s*l-a*o*c}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],u=d*o-r*l,h=r*c-d*s,f=l*s-o*c,m=e*u+i*h+a*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=u*v,t[1]=(a*l-d*i)*v,t[2]=(r*i-a*o)*v,t[3]=h*v,t[4]=(d*e-a*c)*v,t[5]=(a*s-r*e)*v,t[6]=f*v,t[7]=(i*c-l*e)*v,t[8]=(o*e-i*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*r)+o+t,-a*l,a*c,-a*(-l*o+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(al.makeScale(t,e)),this}rotate(t){return this.premultiply(al.makeRotation(-t)),this}translate(t,e){return this.premultiply(al.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const al=new _e;function Cm(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function uc(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function o1(){const n=uc("canvas");return n.style.display="block",n}const tf={};function Eo(n){n in tf||(tf[n]=!0,console.warn(n))}function r1(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function c1(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function l1(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Ae={enabled:!0,workingColorSpace:qs,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Oe&&(n.r=na(n.r),n.g=na(n.g),n.b=na(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Oe&&(n.r=Os(n.r),n.g=Os(n.g),n.b=Os(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===pa?Ec:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function na(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Os(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const ef=[.64,.33,.3,.6,.15,.06],nf=[.2126,.7152,.0722],af=[.3127,.329],sf=new _e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),of=new _e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ae.define({[qs]:{primaries:ef,whitePoint:af,transfer:Ec,toXYZ:sf,fromXYZ:of,luminanceCoefficients:nf,workingColorSpaceConfig:{unpackColorSpace:Hn},outputColorSpaceConfig:{drawingBufferColorSpace:Hn}},[Hn]:{primaries:ef,whitePoint:af,transfer:Oe,toXYZ:sf,fromXYZ:of,luminanceCoefficients:nf,outputColorSpaceConfig:{drawingBufferColorSpace:Hn}}});let fs;class d1{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{fs===void 0&&(fs=uc("canvas")),fs.width=t.width,fs.height=t.height;const i=fs.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=fs}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=uc("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=na(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(na(e[i]/255)*255):e[i]=na(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let h1=0;class Lm{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:h1++}),this.uuid=Ni(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(sl(a[o].image)):s.push(sl(a[o]))}else s=sl(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function sl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?d1.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let u1=0;class In extends Ks{constructor(t=In.DEFAULT_IMAGE,e=In.DEFAULT_MAPPING,i=Ya,a=Ya,s=zi,o=$a,r=wi,c=ia,l=In.DEFAULT_ANISOTROPY,d=pa){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:u1++}),this.uuid=Ni(),this.name="",this.source=new Lm(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Wt(0,0),this.repeat=new Wt(1,1),this.center=new Wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new _e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==vm)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case gd:t.x=t.x-Math.floor(t.x);break;case Ya:t.x=t.x<0?0:1;break;case xd:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case gd:t.y=t.y-Math.floor(t.y);break;case Ya:t.y=t.y<0?0:1;break;case xd:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}In.DEFAULT_IMAGE=null;In.DEFAULT_MAPPING=vm;In.DEFAULT_ANISOTROPY=1;class rn{constructor(t=0,e=0,i=0,a=1){rn.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const c=t.elements,l=c[0],d=c[4],u=c[8],h=c[1],f=c[5],m=c[9],v=c[2],g=c[6],p=c[10];if(Math.abs(d-h)<.01&&Math.abs(u-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+v)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,y=(f+1)/2,S=(p+1)/2,w=(d+h)/4,E=(u+v)/4,A=(m+g)/4;return x>y&&x>S?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=w/i,s=E/i):y>S?y<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(y),i=w/a,s=A/a):S<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(S),i=E/s,a=A/s),this.set(i,a,s,e),this}let b=Math.sqrt((g-m)*(g-m)+(u-v)*(u-v)+(h-d)*(h-d));return Math.abs(b)<.001&&(b=1),this.x=(g-m)/b,this.y=(u-v)/b,this.z=(h-d)/b,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class f1 extends Ks{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new rn(0,0,t,e),this.scissorTest=!1,this.viewport=new rn(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:zi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new In(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Lm(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ka extends f1{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Dm extends In{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=oi,this.minFilter=oi,this.wrapR=Ya,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class p1 extends In{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=oi,this.minFilter=oi,this.wrapR=Ya,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class _a{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let c=i[a+0],l=i[a+1],d=i[a+2],u=i[a+3];const h=s[o+0],f=s[o+1],m=s[o+2],v=s[o+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u;return}if(r===1){t[e+0]=h,t[e+1]=f,t[e+2]=m,t[e+3]=v;return}if(u!==v||c!==h||l!==f||d!==m){let g=1-r;const p=c*h+l*f+d*m+u*v,b=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const S=Math.sqrt(x),w=Math.atan2(S,p*b);g=Math.sin(g*w)/S,r=Math.sin(r*w)/S}const y=r*b;if(c=c*g+h*y,l=l*g+f*y,d=d*g+m*y,u=u*g+v*y,g===1-r){const S=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=S,l*=S,d*=S,u*=S}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],c=i[a+1],l=i[a+2],d=i[a+3],u=s[o],h=s[o+1],f=s[o+2],m=s[o+3];return t[e]=r*m+d*u+c*f-l*h,t[e+1]=c*m+d*h+l*u-r*f,t[e+2]=l*m+d*f+r*h-c*u,t[e+3]=d*m-r*u-c*h-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,c=Math.sin,l=r(i/2),d=r(a/2),u=r(s/2),h=c(i/2),f=c(a/2),m=c(s/2);switch(o){case"XYZ":this._x=h*d*u+l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u-h*f*m;break;case"YXZ":this._x=h*d*u+l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u+h*f*m;break;case"ZXY":this._x=h*d*u-l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u-h*f*m;break;case"ZYX":this._x=h*d*u-l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u+h*f*m;break;case"YZX":this._x=h*d*u+l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u-h*f*m;break;case"XZY":this._x=h*d*u-l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u+h*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],c=e[9],l=e[2],d=e[6],u=e[10],h=i+r+u;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(d-c)*f,this._y=(s-l)*f,this._z=(o-a)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(d-c)/f,this._x=.25*f,this._y=(a+o)/f,this._z=(s+l)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(s-l)/f,this._x=(a+o)/f,this._y=.25*f,this._z=(c+d)/f}else{const f=2*Math.sqrt(1+u-i-r);this._w=(o-a)/f,this._x=(s+l)/f,this._y=(c+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Rn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,c=e._y,l=e._z,d=e._w;return this._x=i*d+o*r+a*l-s*c,this._y=a*d+o*c+s*r-i*l,this._z=s*d+o*l+i*c-a*r,this._w=o*d-i*r-a*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const c=1-r*r;if(c<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*a+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,r),u=Math.sin((1-e)*d)/l,h=Math.sin(e*d)/l;return this._w=o*u+this._w*h,this._x=i*u+this._x*h,this._y=a*u+this._y*h,this._z=s*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Y{constructor(t=0,e=0,i=0){Y.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(rf.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(rf.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,c=t.w,l=2*(o*a-r*i),d=2*(r*e-s*a),u=2*(s*i-o*e);return this.x=e+c*l+o*u-r*d,this.y=i+c*d+r*l-s*u,this.z=a+c*u+s*d-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,c=e.z;return this.x=a*c-s*r,this.y=s*o-i*c,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return ol.copy(this).projectOnVector(t),this.sub(ol)}reflect(t){return this.sub(ol.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Rn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ol=new Y,rf=new _a;class Qa{constructor(t=new Y(1/0,1/0,1/0),e=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Mi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Mi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Mi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,Mi):Mi.fromBufferAttribute(s,o),Mi.applyMatrix4(t.matrixWorld),this.expandByPoint(Mi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),dr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),dr.copy(i.boundingBox)),dr.applyMatrix4(t.matrixWorld),this.union(dr)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Mi),Mi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(po),hr.subVectors(this.max,po),ps.subVectors(t.a,po),ms.subVectors(t.b,po),gs.subVectors(t.c,po),ra.subVectors(ms,ps),ca.subVectors(gs,ms),La.subVectors(ps,gs);let e=[0,-ra.z,ra.y,0,-ca.z,ca.y,0,-La.z,La.y,ra.z,0,-ra.x,ca.z,0,-ca.x,La.z,0,-La.x,-ra.y,ra.x,0,-ca.y,ca.x,0,-La.y,La.x,0];return!rl(e,ps,ms,gs,hr)||(e=[1,0,0,0,1,0,0,0,1],!rl(e,ps,ms,gs,hr))?!1:(ur.crossVectors(ra,ca),e=[ur.x,ur.y,ur.z],rl(e,ps,ms,gs,hr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Wi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Wi=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],Mi=new Y,dr=new Qa,ps=new Y,ms=new Y,gs=new Y,ra=new Y,ca=new Y,La=new Y,po=new Y,hr=new Y,ur=new Y,Da=new Y;function rl(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){Da.fromArray(n,s);const r=a.x*Math.abs(Da.x)+a.y*Math.abs(Da.y)+a.z*Math.abs(Da.z),c=t.dot(Da),l=e.dot(Da),d=i.dot(Da);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>r)return!1}return!0}const m1=new Qa,mo=new Y,cl=new Y;class Js{constructor(t=new Y,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):m1.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;mo.subVectors(t,this.center);const e=mo.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(mo,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(cl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(mo.copy(t.center).add(cl)),this.expandByPoint(mo.copy(t.center).sub(cl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Yi=new Y,ll=new Y,fr=new Y,la=new Y,dl=new Y,pr=new Y,hl=new Y;class Mh{constructor(t=new Y,e=new Y(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Yi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Yi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Yi.copy(this.origin).addScaledVector(this.direction,e),Yi.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){ll.copy(t).add(e).multiplyScalar(.5),fr.copy(e).sub(t).normalize(),la.copy(this.origin).sub(ll);const s=t.distanceTo(e)*.5,o=-this.direction.dot(fr),r=la.dot(this.direction),c=-la.dot(fr),l=la.lengthSq(),d=Math.abs(1-o*o);let u,h,f,m;if(d>0)if(u=o*c-r,h=o*r-c,m=s*d,u>=0)if(h>=-m)if(h<=m){const v=1/d;u*=v,h*=v,f=u*(u+o*h+2*r)+h*(o*u+h+2*c)+l}else h=s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;else h=-s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;else h<=-m?(u=Math.max(0,-(-o*s+r)),h=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+h*(h+2*c)+l):h<=m?(u=0,h=Math.min(Math.max(-s,-c),s),f=h*(h+2*c)+l):(u=Math.max(0,-(o*s+r)),h=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+h*(h+2*c)+l);else h=o>0?-s:s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),a&&a.copy(ll).addScaledVector(fr,h),f}intersectSphere(t,e){Yi.subVectors(t.center,this.origin);const i=Yi.dot(this.direction),a=Yi.dot(Yi)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,c=i+o;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,a=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,a=(t.min.x-h.x)*l),d>=0?(s=(t.min.y-h.y)*d,o=(t.max.y-h.y)*d):(s=(t.max.y-h.y)*d,o=(t.min.y-h.y)*d),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),u>=0?(r=(t.min.z-h.z)*u,c=(t.max.z-h.z)*u):(r=(t.max.z-h.z)*u,c=(t.min.z-h.z)*u),i>c||r>a)||((r>i||i!==i)&&(i=r),(c<a||a!==a)&&(a=c),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Yi)!==null}intersectTriangle(t,e,i,a,s){dl.subVectors(e,t),pr.subVectors(i,t),hl.crossVectors(dl,pr);let o=this.direction.dot(hl),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;la.subVectors(this.origin,t);const c=r*this.direction.dot(pr.crossVectors(la,pr));if(c<0)return null;const l=r*this.direction.dot(dl.cross(la));if(l<0||c+l>o)return null;const d=-r*la.dot(hl);return d<0?null:this.at(d/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Le{constructor(t,e,i,a,s,o,r,c,l,d,u,h,f,m,v,g){Le.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l,d,u,h,f,m,v,g)}set(t,e,i,a,s,o,r,c,l,d,u,h,f,m,v,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=c,p[2]=l,p[6]=d,p[10]=u,p[14]=h,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Le().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/xs.setFromMatrixColumn(t,0).length(),s=1/xs.setFromMatrixColumn(t,1).length(),o=1/xs.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),c=Math.cos(a),l=Math.sin(a),d=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const h=o*d,f=o*u,m=r*d,v=r*u;e[0]=c*d,e[4]=-c*u,e[8]=l,e[1]=f+m*l,e[5]=h-v*l,e[9]=-r*c,e[2]=v-h*l,e[6]=m+f*l,e[10]=o*c}else if(t.order==="YXZ"){const h=c*d,f=c*u,m=l*d,v=l*u;e[0]=h+v*r,e[4]=m*r-f,e[8]=o*l,e[1]=o*u,e[5]=o*d,e[9]=-r,e[2]=f*r-m,e[6]=v+h*r,e[10]=o*c}else if(t.order==="ZXY"){const h=c*d,f=c*u,m=l*d,v=l*u;e[0]=h-v*r,e[4]=-o*u,e[8]=m+f*r,e[1]=f+m*r,e[5]=o*d,e[9]=v-h*r,e[2]=-o*l,e[6]=r,e[10]=o*c}else if(t.order==="ZYX"){const h=o*d,f=o*u,m=r*d,v=r*u;e[0]=c*d,e[4]=m*l-f,e[8]=h*l+v,e[1]=c*u,e[5]=v*l+h,e[9]=f*l-m,e[2]=-l,e[6]=r*c,e[10]=o*c}else if(t.order==="YZX"){const h=o*c,f=o*l,m=r*c,v=r*l;e[0]=c*d,e[4]=v-h*u,e[8]=m*u+f,e[1]=u,e[5]=o*d,e[9]=-r*d,e[2]=-l*d,e[6]=f*u+m,e[10]=h-v*u}else if(t.order==="XZY"){const h=o*c,f=o*l,m=r*c,v=r*l;e[0]=c*d,e[4]=-u,e[8]=l*d,e[1]=h*u+v,e[5]=o*d,e[9]=f*u-m,e[2]=m*u-f,e[6]=r*d,e[10]=v*u+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(g1,t,x1)}lookAt(t,e,i){const a=this.elements;return ni.subVectors(t,e),ni.lengthSq()===0&&(ni.z=1),ni.normalize(),da.crossVectors(i,ni),da.lengthSq()===0&&(Math.abs(i.z)===1?ni.x+=1e-4:ni.z+=1e-4,ni.normalize(),da.crossVectors(i,ni)),da.normalize(),mr.crossVectors(ni,da),a[0]=da.x,a[4]=mr.x,a[8]=ni.x,a[1]=da.y,a[5]=mr.y,a[9]=ni.y,a[2]=da.z,a[6]=mr.z,a[10]=ni.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],c=i[8],l=i[12],d=i[1],u=i[5],h=i[9],f=i[13],m=i[2],v=i[6],g=i[10],p=i[14],b=i[3],x=i[7],y=i[11],S=i[15],w=a[0],E=a[4],A=a[8],_=a[12],M=a[1],P=a[5],I=a[9],L=a[13],F=a[2],C=a[6],T=a[10],B=a[14],G=a[3],$=a[7],it=a[11],ht=a[15];return s[0]=o*w+r*M+c*F+l*G,s[4]=o*E+r*P+c*C+l*$,s[8]=o*A+r*I+c*T+l*it,s[12]=o*_+r*L+c*B+l*ht,s[1]=d*w+u*M+h*F+f*G,s[5]=d*E+u*P+h*C+f*$,s[9]=d*A+u*I+h*T+f*it,s[13]=d*_+u*L+h*B+f*ht,s[2]=m*w+v*M+g*F+p*G,s[6]=m*E+v*P+g*C+p*$,s[10]=m*A+v*I+g*T+p*it,s[14]=m*_+v*L+g*B+p*ht,s[3]=b*w+x*M+y*F+S*G,s[7]=b*E+x*P+y*C+S*$,s[11]=b*A+x*I+y*T+S*it,s[15]=b*_+x*L+y*B+S*ht,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],c=t[9],l=t[13],d=t[2],u=t[6],h=t[10],f=t[14],m=t[3],v=t[7],g=t[11],p=t[15];return m*(+s*c*u-a*l*u-s*r*h+i*l*h+a*r*f-i*c*f)+v*(+e*c*f-e*l*h+s*o*h-a*o*f+a*l*d-s*c*d)+g*(+e*l*u-e*r*f-s*o*u+i*o*f+s*r*d-i*l*d)+p*(-a*r*d-e*c*u+e*r*h+a*o*u-i*o*h+i*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],u=t[9],h=t[10],f=t[11],m=t[12],v=t[13],g=t[14],p=t[15],b=u*g*l-v*h*l+v*c*f-r*g*f-u*c*p+r*h*p,x=m*h*l-d*g*l-m*c*f+o*g*f+d*c*p-o*h*p,y=d*v*l-m*u*l+m*r*f-o*v*f-d*r*p+o*u*p,S=m*u*c-d*v*c-m*r*h+o*v*h+d*r*g-o*u*g,w=e*b+i*x+a*y+s*S;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/w;return t[0]=b*E,t[1]=(v*h*s-u*g*s-v*a*f+i*g*f+u*a*p-i*h*p)*E,t[2]=(r*g*s-v*c*s+v*a*l-i*g*l-r*a*p+i*c*p)*E,t[3]=(u*c*s-r*h*s-u*a*l+i*h*l+r*a*f-i*c*f)*E,t[4]=x*E,t[5]=(d*g*s-m*h*s+m*a*f-e*g*f-d*a*p+e*h*p)*E,t[6]=(m*c*s-o*g*s-m*a*l+e*g*l+o*a*p-e*c*p)*E,t[7]=(o*h*s-d*c*s+d*a*l-e*h*l-o*a*f+e*c*f)*E,t[8]=y*E,t[9]=(m*u*s-d*v*s-m*i*f+e*v*f+d*i*p-e*u*p)*E,t[10]=(o*v*s-m*r*s+m*i*l-e*v*l-o*i*p+e*r*p)*E,t[11]=(d*r*s-o*u*s-d*i*l+e*u*l+o*i*f-e*r*f)*E,t[12]=S*E,t[13]=(d*v*a-m*u*a+m*i*h-e*v*h-d*i*g+e*u*g)*E,t[14]=(m*r*a-o*v*a-m*i*c+e*v*c+o*i*g-e*r*g)*E,t[15]=(o*u*a-d*r*a+d*i*c-e*u*c-o*i*h+e*r*h)*E,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,c=t.z,l=s*o,d=s*r;return this.set(l*o+i,l*r-a*c,l*c+a*r,0,l*r+a*c,d*r+i,d*c-a*o,0,l*c-a*r,d*c+a*o,s*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,c=e._w,l=s+s,d=o+o,u=r+r,h=s*l,f=s*d,m=s*u,v=o*d,g=o*u,p=r*u,b=c*l,x=c*d,y=c*u,S=i.x,w=i.y,E=i.z;return a[0]=(1-(v+p))*S,a[1]=(f+y)*S,a[2]=(m-x)*S,a[3]=0,a[4]=(f-y)*w,a[5]=(1-(h+p))*w,a[6]=(g+b)*w,a[7]=0,a[8]=(m+x)*E,a[9]=(g-b)*E,a[10]=(1-(h+v))*E,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=xs.set(a[0],a[1],a[2]).length();const o=xs.set(a[4],a[5],a[6]).length(),r=xs.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],_i.copy(this);const l=1/s,d=1/o,u=1/r;return _i.elements[0]*=l,_i.elements[1]*=l,_i.elements[2]*=l,_i.elements[4]*=d,_i.elements[5]*=d,_i.elements[6]*=d,_i.elements[8]*=u,_i.elements[9]*=u,_i.elements[10]*=u,e.setFromRotationMatrix(_i),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=ea){const c=this.elements,l=2*s/(e-t),d=2*s/(i-a),u=(e+t)/(e-t),h=(i+a)/(i-a);let f,m;if(r===ea)f=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===hc)f=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=ea){const c=this.elements,l=1/(e-t),d=1/(i-a),u=1/(o-s),h=(e+t)*l,f=(i+a)*d;let m,v;if(r===ea)m=(o+s)*u,v=-2*u;else if(r===hc)m=s*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=v,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const xs=new Y,_i=new Le,g1=new Y(0,0,0),x1=new Y(1,1,1),da=new Y,mr=new Y,ni=new Y,cf=new Le,lf=new _a;class Oi{constructor(t=0,e=0,i=0,a=Oi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],c=a[1],l=a[5],d=a[9],u=a[2],h=a[6],f=a[10];switch(e){case"XYZ":this._y=Math.asin(Rn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Rn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Rn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Rn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Rn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-Rn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-d,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return cf.makeRotationFromQuaternion(t),this.setFromRotationMatrix(cf,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return lf.setFromEuler(this),this.setFromQuaternion(lf,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Oi.DEFAULT_ORDER="XYZ";class _h{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let v1=0;const df=new Y,vs=new _a,$i=new Le,gr=new Y,go=new Y,y1=new Y,M1=new _a,hf=new Y(1,0,0),uf=new Y(0,1,0),ff=new Y(0,0,1),pf={type:"added"},_1={type:"removed"},ys={type:"childadded",child:null},ul={type:"childremoved",child:null};class nn extends Ks{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:v1++}),this.uuid=Ni(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=nn.DEFAULT_UP.clone();const t=new Y,e=new Oi,i=new _a,a=new Y(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Le},normalMatrix:{value:new _e}}),this.matrix=new Le,this.matrixWorld=new Le,this.matrixAutoUpdate=nn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new _h,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return vs.setFromAxisAngle(t,e),this.quaternion.multiply(vs),this}rotateOnWorldAxis(t,e){return vs.setFromAxisAngle(t,e),this.quaternion.premultiply(vs),this}rotateX(t){return this.rotateOnAxis(hf,t)}rotateY(t){return this.rotateOnAxis(uf,t)}rotateZ(t){return this.rotateOnAxis(ff,t)}translateOnAxis(t,e){return df.copy(t).applyQuaternion(this.quaternion),this.position.add(df.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(hf,t)}translateY(t){return this.translateOnAxis(uf,t)}translateZ(t){return this.translateOnAxis(ff,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4($i.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?gr.copy(t):gr.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),go.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$i.lookAt(go,gr,this.up):$i.lookAt(gr,go,this.up),this.quaternion.setFromRotationMatrix($i),a&&($i.extractRotation(a.matrixWorld),vs.setFromRotationMatrix($i),this.quaternion.premultiply(vs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(pf),ys.child=t,this.dispatchEvent(ys),ys.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(_1),ul.child=t,this.dispatchEvent(ul),ul.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),$i.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),$i.multiply(t.parent.matrixWorld)),t.applyMatrix4($i),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(pf),ys.child=t,this.dispatchEvent(ys),ys.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(go,t,y1),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(go,M1,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(s(t.materials,this.material[c]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];a.animations.push(s(t.animations,c))}}if(e){const r=o(t.geometries),c=o(t.materials),l=o(t.textures),d=o(t.images),u=o(t.shapes),h=o(t.skeletons),f=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const c=[];for(const l in r){const d=r[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}nn.DEFAULT_UP=new Y(0,1,0);nn.DEFAULT_MATRIX_AUTO_UPDATE=!0;nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const bi=new Y,Zi=new Y,fl=new Y,ji=new Y,Ms=new Y,_s=new Y,mf=new Y,pl=new Y,ml=new Y,gl=new Y,xl=new rn,vl=new rn,yl=new rn;class si{constructor(t=new Y,e=new Y,i=new Y){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),bi.subVectors(t,e),a.cross(bi);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){bi.subVectors(a,e),Zi.subVectors(i,e),fl.subVectors(t,e);const o=bi.dot(bi),r=bi.dot(Zi),c=bi.dot(fl),l=Zi.dot(Zi),d=Zi.dot(fl),u=o*l-r*r;if(u===0)return s.set(0,0,0),null;const h=1/u,f=(l*c-r*d)*h,m=(o*d-r*c)*h;return s.set(1-f-m,m,f)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,ji)===null?!1:ji.x>=0&&ji.y>=0&&ji.x+ji.y<=1}static getInterpolation(t,e,i,a,s,o,r,c){return this.getBarycoord(t,e,i,a,ji)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,ji.x),c.addScaledVector(o,ji.y),c.addScaledVector(r,ji.z),c)}static getInterpolatedAttribute(t,e,i,a,s,o){return xl.setScalar(0),vl.setScalar(0),yl.setScalar(0),xl.fromBufferAttribute(t,e),vl.fromBufferAttribute(t,i),yl.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(xl,s.x),o.addScaledVector(vl,s.y),o.addScaledVector(yl,s.z),o}static isFrontFacing(t,e,i,a){return bi.subVectors(i,e),Zi.subVectors(t,e),bi.cross(Zi).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return bi.subVectors(this.c,this.b),Zi.subVectors(this.a,this.b),bi.cross(Zi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return si.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return si.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return si.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return si.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return si.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;Ms.subVectors(a,i),_s.subVectors(s,i),pl.subVectors(t,i);const c=Ms.dot(pl),l=_s.dot(pl);if(c<=0&&l<=0)return e.copy(i);ml.subVectors(t,a);const d=Ms.dot(ml),u=_s.dot(ml);if(d>=0&&u<=d)return e.copy(a);const h=c*u-d*l;if(h<=0&&c>=0&&d<=0)return o=c/(c-d),e.copy(i).addScaledVector(Ms,o);gl.subVectors(t,s);const f=Ms.dot(gl),m=_s.dot(gl);if(m>=0&&f<=m)return e.copy(s);const v=f*l-c*m;if(v<=0&&l>=0&&m<=0)return r=l/(l-m),e.copy(i).addScaledVector(_s,r);const g=d*m-f*u;if(g<=0&&u-d>=0&&f-m>=0)return mf.subVectors(s,a),r=(u-d)/(u-d+(f-m)),e.copy(a).addScaledVector(mf,r);const p=1/(g+v+h);return o=v*p,r=h*p,e.copy(i).addScaledVector(Ms,o).addScaledVector(_s,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const km={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ha={h:0,s:0,l:0},xr={h:0,s:0,l:0};function Ml(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ee{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Hn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Ae.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Ae.workingColorSpace){return this.r=t,this.g=e,this.b=i,Ae.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Ae.workingColorSpace){if(t=yh(t,1),e=Rn(e,0,1),i=Rn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=Ml(o,s,t+1/3),this.g=Ml(o,s,t),this.b=Ml(o,s,t-1/3)}return Ae.toWorkingColorSpace(this,a),this}setStyle(t,e=Hn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Hn){const i=km[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=na(t.r),this.g=na(t.g),this.b=na(t.b),this}copyLinearToSRGB(t){return this.r=Os(t.r),this.g=Os(t.g),this.b=Os(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Hn){return Ae.fromWorkingColorSpace(Dn.copy(this),t),Math.round(Rn(Dn.r*255,0,255))*65536+Math.round(Rn(Dn.g*255,0,255))*256+Math.round(Rn(Dn.b*255,0,255))}getHexString(t=Hn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Ae.workingColorSpace){Ae.fromWorkingColorSpace(Dn.copy(this),e);const i=Dn.r,a=Dn.g,s=Dn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let c,l;const d=(r+o)/2;if(r===o)c=0,l=0;else{const u=o-r;switch(l=d<=.5?u/(o+r):u/(2-o-r),o){case i:c=(a-s)/u+(a<s?6:0);break;case a:c=(s-i)/u+2;break;case s:c=(i-a)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=Ae.workingColorSpace){return Ae.fromWorkingColorSpace(Dn.copy(this),e),t.r=Dn.r,t.g=Dn.g,t.b=Dn.b,t}getStyle(t=Hn){Ae.fromWorkingColorSpace(Dn.copy(this),t);const e=Dn.r,i=Dn.g,a=Dn.b;return t!==Hn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(ha),this.setHSL(ha.h+t,ha.s+e,ha.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ha),t.getHSL(xr);const i=Do(ha.h,xr.h,e),a=Do(ha.s,xr.s,e),s=Do(ha.l,xr.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Dn=new ee;ee.NAMES=km;let b1=0;class ts extends Ks{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:b1++}),this.uuid=Ni(),this.name="",this.blending=Fs,this.side=Sa,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sd,this.blendDst=od,this.blendEquation=Va,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ee(0,0,0),this.blendAlpha=0,this.depthFunc=Vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=qu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=us,this.stencilZFail=us,this.stencilZPass=us,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Fs&&(i.blending=this.blending),this.side!==Sa&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==sd&&(i.blendSrc=this.blendSrc),this.blendDst!==od&&(i.blendDst=this.blendDst),this.blendEquation!==Va&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Vs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==qu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==us&&(i.stencilFail=this.stencilFail),this.stencilZFail!==us&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==us&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const c=s[r];delete c.metadata,o.push(c)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class xn extends ts{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Oi,this.combine=hh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const fn=new Y,vr=new Wt;class cn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Vd,this.updateRanges=[],this.gpuType=Fi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)vr.fromBufferAttribute(this,e),vr.applyMatrix3(t),this.setXY(e,vr.x,vr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)fn.fromBufferAttribute(this,e),fn.applyMatrix3(t),this.setXYZ(e,fn.x,fn.y,fn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)fn.fromBufferAttribute(this,e),fn.applyMatrix4(t),this.setXYZ(e,fn.x,fn.y,fn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)fn.fromBufferAttribute(this,e),fn.applyNormalMatrix(t),this.setXYZ(e,fn.x,fn.y,fn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)fn.fromBufferAttribute(this,e),fn.transformDirection(t),this.setXYZ(e,fn.x,fn.y,fn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Si(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ie(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Si(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Si(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Si(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Si(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array),a=Ie(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array),a=Ie(a,this.array),s=Ie(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Vd&&(t.usage=this.usage),t}}class Im extends cn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class zm extends cn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class De extends cn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let S1=0;const pi=new Le,_l=new nn,bs=new Y,ii=new Qa,xo=new Qa,Tn=new Y;class Ke extends Ks{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:S1++}),this.uuid=Ni(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Cm(t)?zm:Im)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new _e().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return pi.makeRotationFromQuaternion(t),this.applyMatrix4(pi),this}rotateX(t){return pi.makeRotationX(t),this.applyMatrix4(pi),this}rotateY(t){return pi.makeRotationY(t),this.applyMatrix4(pi),this}rotateZ(t){return pi.makeRotationZ(t),this.applyMatrix4(pi),this}translate(t,e,i){return pi.makeTranslation(t,e,i),this.applyMatrix4(pi),this}scale(t,e,i){return pi.makeScale(t,e,i),this.applyMatrix4(pi),this}lookAt(t){return _l.lookAt(t),_l.updateMatrix(),this.applyMatrix4(_l.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bs).negate(),this.translate(bs.x,bs.y,bs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new De(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qa);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];ii.setFromBufferAttribute(s),this.morphTargetsRelative?(Tn.addVectors(this.boundingBox.min,ii.min),this.boundingBox.expandByPoint(Tn),Tn.addVectors(this.boundingBox.max,ii.max),this.boundingBox.expandByPoint(Tn)):(this.boundingBox.expandByPoint(ii.min),this.boundingBox.expandByPoint(ii.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Js);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Y,1/0);return}if(t){const i=this.boundingSphere.center;if(ii.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];xo.setFromBufferAttribute(r),this.morphTargetsRelative?(Tn.addVectors(ii.min,xo.min),ii.expandByPoint(Tn),Tn.addVectors(ii.max,xo.max),ii.expandByPoint(Tn)):(ii.expandByPoint(xo.min),ii.expandByPoint(xo.max))}ii.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)Tn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(Tn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],c=this.morphTargetsRelative;for(let l=0,d=r.count;l<d;l++)Tn.fromBufferAttribute(r,l),c&&(bs.fromBufferAttribute(t,l),Tn.add(bs)),a=Math.max(a,i.distanceToSquared(Tn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new cn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],c=[];for(let A=0;A<i.count;A++)r[A]=new Y,c[A]=new Y;const l=new Y,d=new Y,u=new Y,h=new Wt,f=new Wt,m=new Wt,v=new Y,g=new Y;function p(A,_,M){l.fromBufferAttribute(i,A),d.fromBufferAttribute(i,_),u.fromBufferAttribute(i,M),h.fromBufferAttribute(s,A),f.fromBufferAttribute(s,_),m.fromBufferAttribute(s,M),d.sub(l),u.sub(l),f.sub(h),m.sub(h);const P=1/(f.x*m.y-m.x*f.y);isFinite(P)&&(v.copy(d).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(P),g.copy(u).multiplyScalar(f.x).addScaledVector(d,-m.x).multiplyScalar(P),r[A].add(v),r[_].add(v),r[M].add(v),c[A].add(g),c[_].add(g),c[M].add(g))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let A=0,_=b.length;A<_;++A){const M=b[A],P=M.start,I=M.count;for(let L=P,F=P+I;L<F;L+=3)p(t.getX(L+0),t.getX(L+1),t.getX(L+2))}const x=new Y,y=new Y,S=new Y,w=new Y;function E(A){S.fromBufferAttribute(a,A),w.copy(S);const _=r[A];x.copy(_),x.sub(S.multiplyScalar(S.dot(_))).normalize(),y.crossVectors(w,_);const P=y.dot(c[A])<0?-1:1;o.setXYZW(A,x.x,x.y,x.z,P)}for(let A=0,_=b.length;A<_;++A){const M=b[A],P=M.start,I=M.count;for(let L=P,F=P+I;L<F;L+=3)E(t.getX(L+0)),E(t.getX(L+1)),E(t.getX(L+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new cn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);const a=new Y,s=new Y,o=new Y,r=new Y,c=new Y,l=new Y,d=new Y,u=new Y;if(t)for(let h=0,f=t.count;h<f;h+=3){const m=t.getX(h+0),v=t.getX(h+1),g=t.getX(h+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),d.subVectors(o,s),u.subVectors(a,s),d.cross(u),r.fromBufferAttribute(i,m),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,g),r.add(d),c.add(d),l.add(d),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let h=0,f=e.count;h<f;h+=3)a.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),d.subVectors(o,s),u.subVectors(a,s),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Tn.fromBufferAttribute(t,e),Tn.normalize(),t.setXYZ(e,Tn.x,Tn.y,Tn.z)}toNonIndexed(){function t(r,c){const l=r.array,d=r.itemSize,u=r.normalized,h=new l.constructor(c.length*d);let f=0,m=0;for(let v=0,g=c.length;v<g;v++){r.isInterleavedBufferAttribute?f=c[v]*r.data.stride+r.offset:f=c[v]*d;for(let p=0;p<d;p++)h[m++]=l[f++]}return new cn(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ke,i=this.index.array,a=this.attributes;for(const r in a){const c=a[r],l=t(c,i);e.setAttribute(r,l)}const s=this.morphAttributes;for(const r in s){const c=[],l=s[r];for(let d=0,u=l.length;d<u;d++){const h=l[d],f=t(h,i);c.push(f)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,c=o.length;r<c;r++){const l=o[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const a={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,h=l.length;u<h;u++){const f=l[u];d.push(f.toJSON(t.data))}d.length>0&&(a[c]=d,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const l in a){const d=a[l];this.setAttribute(l,d.clone(e))}const s=t.morphAttributes;for(const l in s){const d=[],u=s[l];for(let h=0,f=u.length;h<f;h++)d.push(u[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,d=o.length;l<d;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const gf=new Le,ka=new Mh,yr=new Js,xf=new Y,Mr=new Y,_r=new Y,br=new Y,bl=new Y,Sr=new Y,vf=new Y,wr=new Y;class me extends nn{constructor(t=new Ke,e=new xn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){Sr.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const d=r[c],u=s[c];d!==0&&(bl.fromBufferAttribute(u,t),o?Sr.addScaledVector(bl,d):Sr.addScaledVector(bl.sub(e),d))}e.add(Sr)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),yr.copy(i.boundingSphere),yr.applyMatrix4(s),ka.copy(t.ray).recast(t.near),!(yr.containsPoint(ka.origin)===!1&&(ka.intersectSphere(yr,xf)===null||ka.origin.distanceToSquared(xf)>(t.far-t.near)**2))&&(gf.copy(s).invert(),ka.copy(t.ray).applyMatrix4(gf),!(i.boundingBox!==null&&ka.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ka)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,c=s.attributes.position,l=s.attributes.uv,d=s.attributes.uv1,u=s.attributes.normal,h=s.groups,f=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,v=h.length;m<v;m++){const g=h[m],p=o[g.materialIndex],b=Math.max(g.start,f.start),x=Math.min(r.count,Math.min(g.start+g.count,f.start+f.count));for(let y=b,S=x;y<S;y+=3){const w=r.getX(y),E=r.getX(y+1),A=r.getX(y+2);a=Er(this,p,t,i,l,d,u,w,E,A),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),v=Math.min(r.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const b=r.getX(g),x=r.getX(g+1),y=r.getX(g+2);a=Er(this,o,t,i,l,d,u,b,x,y),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,v=h.length;m<v;m++){const g=h[m],p=o[g.materialIndex],b=Math.max(g.start,f.start),x=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let y=b,S=x;y<S;y+=3){const w=y,E=y+1,A=y+2;a=Er(this,p,t,i,l,d,u,w,E,A),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const b=g,x=g+1,y=g+2;a=Er(this,o,t,i,l,d,u,b,x,y),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function w1(n,t,e,i,a,s,o,r){let c;if(t.side===Yn?c=i.intersectTriangle(o,s,a,!0,r):c=i.intersectTriangle(a,s,o,t.side===Sa,r),c===null)return null;wr.copy(r),wr.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(wr);return l<e.near||l>e.far?null:{distance:l,point:wr.clone(),object:n}}function Er(n,t,e,i,a,s,o,r,c,l){n.getVertexPosition(r,Mr),n.getVertexPosition(c,_r),n.getVertexPosition(l,br);const d=w1(n,t,e,i,Mr,_r,br,vf);if(d){const u=new Y;si.getBarycoord(vf,Mr,_r,br,u),a&&(d.uv=si.getInterpolatedAttribute(a,r,c,l,u,new Wt)),s&&(d.uv1=si.getInterpolatedAttribute(s,r,c,l,u,new Wt)),o&&(d.normal=si.getInterpolatedAttribute(o,r,c,l,u,new Y),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:r,b:c,c:l,normal:new Y,materialIndex:0};si.getNormal(Mr,_r,br,h.normal),d.face=h,d.barycoord=u}return d}class zn extends Ke{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],d=[],u=[];let h=0,f=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(c),this.setAttribute("position",new De(l,3)),this.setAttribute("normal",new De(d,3)),this.setAttribute("uv",new De(u,2));function m(v,g,p,b,x,y,S,w,E,A,_){const M=y/E,P=S/A,I=y/2,L=S/2,F=w/2,C=E+1,T=A+1;let B=0,G=0;const $=new Y;for(let it=0;it<T;it++){const ht=it*P-L;for(let yt=0;yt<C;yt++){const Lt=yt*M-I;$[v]=Lt*b,$[g]=ht*x,$[p]=F,l.push($.x,$.y,$.z),$[v]=0,$[g]=0,$[p]=w>0?1:-1,d.push($.x,$.y,$.z),u.push(yt/E),u.push(1-it/A),B+=1}}for(let it=0;it<A;it++)for(let ht=0;ht<E;ht++){const yt=h+ht+C*it,Lt=h+ht+C*(it+1),q=h+(ht+1)+C*(it+1),k=h+(ht+1)+C*it;c.push(yt,Lt,k),c.push(Lt,q,k),G+=6}r.addGroup(f,G,_),f+=G,h+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function js(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function Bn(n){const t={};for(let e=0;e<n.length;e++){const i=js(n[e]);for(const a in i)t[a]=i[a]}return t}function E1(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Fm(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Ae.workingColorSpace}const T1={clone:js,merge:Bn};var A1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,R1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class wa extends ts{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=A1,this.fragmentShader=R1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=js(t.uniforms),this.uniformsGroups=E1(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Um extends nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Le,this.projectionMatrix=new Le,this.projectionMatrixInverse=new Le,this.coordinateSystem=ea}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ua=new Y,yf=new Wt,Mf=new Wt;class mi extends Um{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Vo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ns*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Vo*2*Math.atan(Math.tan(Ns*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ua.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ua.x,ua.y).multiplyScalar(-t/ua.z),ua.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ua.x,ua.y).multiplyScalar(-t/ua.z)}getViewSize(t,e){return this.getViewBounds(t,yf,Mf),e.subVectors(Mf,yf)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ns*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*a/c,e-=o.offsetY*i/l,a*=o.width/c,i*=o.height/l}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ss=-90,ws=1;class P1 extends nn{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new mi(Ss,ws,t,e);a.layers=this.layers,this.add(a);const s=new mi(Ss,ws,t,e);s.layers=this.layers,this.add(s);const o=new mi(Ss,ws,t,e);o.layers=this.layers,this.add(o);const r=new mi(Ss,ws,t,e);r.layers=this.layers,this.add(r);const c=new mi(Ss,ws,t,e);c.layers=this.layers,this.add(c);const l=new mi(Ss,ws,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,c]=e;for(const l of e)this.remove(l);if(t===ea)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===hc)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,c,l,d]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,c),t.setRenderTarget(i,4,a),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,a),t.render(e,d),t.setRenderTarget(u,h,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Nm extends In{constructor(t,e,i,a,s,o,r,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:Ws,super(t,e,i,a,s,o,r,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class C1 extends Ka{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Nm(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:zi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new zn(5,5,5),s=new wa({name:"CubemapFromEquirect",uniforms:js(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Yn,blending:ya});s.uniforms.tEquirect.value=e;const o=new me(a,s),r=e.minFilter;return e.minFilter===$a&&(e.minFilter=zi),new P1(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const Sl=new Y,L1=new Y,D1=new _e;class Ha{constructor(t=new Y(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=Sl.subVectors(i,e).cross(L1.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Sl),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||D1.getNormalMatrix(t),a=this.coplanarPoint(Sl).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ia=new Js,Tr=new Y;class bh{constructor(t=new Ha,e=new Ha,i=new Ha,a=new Ha,s=new Ha,o=new Ha){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=ea){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],c=a[3],l=a[4],d=a[5],u=a[6],h=a[7],f=a[8],m=a[9],v=a[10],g=a[11],p=a[12],b=a[13],x=a[14],y=a[15];if(i[0].setComponents(c-s,h-l,g-f,y-p).normalize(),i[1].setComponents(c+s,h+l,g+f,y+p).normalize(),i[2].setComponents(c+o,h+d,g+m,y+b).normalize(),i[3].setComponents(c-o,h-d,g-m,y-b).normalize(),i[4].setComponents(c-r,h-u,g-v,y-x).normalize(),e===ea)i[5].setComponents(c+r,h+u,g+v,y+x).normalize();else if(e===hc)i[5].setComponents(r,u,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ia.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ia.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ia)}intersectsSprite(t){return Ia.center.set(0,0,0),Ia.radius=.7071067811865476,Ia.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ia)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(Tr.x=a.normal.x>0?t.max.x:t.min.x,Tr.y=a.normal.y>0?t.max.y:t.min.y,Tr.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(Tr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Om(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function k1(n){const t=new WeakMap;function e(r,c){const l=r.array,d=r.usage,u=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,d),r.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,c,l){const d=c.array,u=c.updateRanges;if(n.bindBuffer(l,r),u.length===0)n.bufferSubData(l,0,d);else{u.sort((f,m)=>f.start-m.start);let h=0;for(let f=1;f<u.length;f++){const m=u[h],v=u[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++h,u[h]=v)}u.length=h+1;for(let f=0,m=u.length;f<m;f++){const v=u[f];n.bufferSubData(l,v.start*d.BYTES_PER_ELEMENT,d,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function o(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const d=t.get(r);(!d||d.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:a,remove:s,update:o}}class Wn extends Ke{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),c=Math.floor(a),l=r+1,d=c+1,u=t/r,h=e/c,f=[],m=[],v=[],g=[];for(let p=0;p<d;p++){const b=p*h-o;for(let x=0;x<l;x++){const y=x*u-s;m.push(y,-b,0),v.push(0,0,1),g.push(x/r),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let b=0;b<r;b++){const x=b+l*p,y=b+l*(p+1),S=b+1+l*(p+1),w=b+1+l*p;f.push(x,y,w),f.push(y,S,w)}this.setIndex(f),this.setAttribute("position",new De(m,3)),this.setAttribute("normal",new De(v,3)),this.setAttribute("uv",new De(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wn(t.width,t.height,t.widthSegments,t.heightSegments)}}var I1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,z1=`#ifdef USE_ALPHAHASH
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
#endif`,F1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,U1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,N1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,O1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,B1=`#ifdef USE_AOMAP
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
#endif`,H1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,G1=`#ifdef USE_BATCHING
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
#endif`,X1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,V1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,W1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Y1=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,$1=`#ifdef USE_IRIDESCENCE
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
#endif`,Z1=`#ifdef USE_BUMPMAP
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
#endif`,j1=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,q1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,K1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,J1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Q1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,tS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,eS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,nS=`#if defined( USE_COLOR_ALPHA )
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
#endif`,iS=`#define PI 3.141592653589793
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
} // validated`,aS=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,sS=`vec3 transformedNormal = objectNormal;
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
#endif`,oS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,rS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,cS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,lS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,dS="gl_FragColor = linearToOutputTexel( gl_FragColor );",hS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,uS=`#ifdef USE_ENVMAP
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
#endif`,fS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,pS=`#ifdef USE_ENVMAP
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
#endif`,mS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,gS=`#ifdef USE_ENVMAP
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
#endif`,xS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,yS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,MS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_S=`#ifdef USE_GRADIENTMAP
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
}`,bS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,SS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ES=`uniform bool receiveShadow;
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
#endif`,TS=`#ifdef USE_ENVMAP
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
#endif`,AS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,RS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,PS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,CS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,LS=`PhysicalMaterial material;
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
#endif`,DS=`struct PhysicalMaterial {
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
}`,kS=`
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
#endif`,IS=`#if defined( RE_IndirectDiffuse )
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
#endif`,zS=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,FS=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,US=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,NS=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,OS=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,BS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,HS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,GS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,XS=`#if defined( USE_POINTS_UV )
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
#endif`,VS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,WS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,YS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,$S=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ZS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jS=`#ifdef USE_MORPHTARGETS
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
#endif`,qS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,KS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,JS=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,QS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ew=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,nw=`#ifdef USE_NORMALMAP
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
#endif`,iw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,aw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,sw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ow=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,rw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,cw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,lw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,dw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,hw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,uw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,fw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,pw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,mw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,gw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,vw=`float getShadowMask() {
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
}`,yw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Mw=`#ifdef USE_SKINNING
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
#endif`,_w=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,bw=`#ifdef USE_SKINNING
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
#endif`,Sw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ww=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ew=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Tw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Aw=`#ifdef USE_TRANSMISSION
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
#endif`,Rw=`#ifdef USE_TRANSMISSION
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
#endif`,Pw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Dw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const kw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Iw=`uniform sampler2D t2D;
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
}`,zw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Uw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ow=`#include <common>
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
}`,Bw=`#if DEPTH_PACKING == 3200
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
}`,Hw=`#define DISTANCE
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
}`,Gw=`#define DISTANCE
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
}`,Xw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Vw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ww=`uniform float scale;
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
}`,Yw=`uniform vec3 diffuse;
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
}`,$w=`#include <common>
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
}`,Zw=`uniform vec3 diffuse;
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
}`,jw=`#define LAMBERT
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
}`,qw=`#define LAMBERT
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
}`,Kw=`#define MATCAP
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
}`,Jw=`#define MATCAP
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
}`,Qw=`#define NORMAL
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
}`,tE=`#define NORMAL
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
}`,eE=`#define PHONG
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
}`,nE=`#define PHONG
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
}`,iE=`#define STANDARD
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
}`,aE=`#define STANDARD
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
}`,sE=`#define TOON
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
}`,oE=`#define TOON
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
}`,rE=`uniform float size;
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
}`,cE=`uniform vec3 diffuse;
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
}`,lE=`#include <common>
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
}`,dE=`uniform vec3 color;
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
}`,hE=`uniform float rotation;
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
}`,uE=`uniform vec3 diffuse;
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
}`,be={alphahash_fragment:I1,alphahash_pars_fragment:z1,alphamap_fragment:F1,alphamap_pars_fragment:U1,alphatest_fragment:N1,alphatest_pars_fragment:O1,aomap_fragment:B1,aomap_pars_fragment:H1,batching_pars_vertex:G1,batching_vertex:X1,begin_vertex:V1,beginnormal_vertex:W1,bsdfs:Y1,iridescence_fragment:$1,bumpmap_pars_fragment:Z1,clipping_planes_fragment:j1,clipping_planes_pars_fragment:q1,clipping_planes_pars_vertex:K1,clipping_planes_vertex:J1,color_fragment:Q1,color_pars_fragment:tS,color_pars_vertex:eS,color_vertex:nS,common:iS,cube_uv_reflection_fragment:aS,defaultnormal_vertex:sS,displacementmap_pars_vertex:oS,displacementmap_vertex:rS,emissivemap_fragment:cS,emissivemap_pars_fragment:lS,colorspace_fragment:dS,colorspace_pars_fragment:hS,envmap_fragment:uS,envmap_common_pars_fragment:fS,envmap_pars_fragment:pS,envmap_pars_vertex:mS,envmap_physical_pars_fragment:TS,envmap_vertex:gS,fog_vertex:xS,fog_pars_vertex:vS,fog_fragment:yS,fog_pars_fragment:MS,gradientmap_pars_fragment:_S,lightmap_pars_fragment:bS,lights_lambert_fragment:SS,lights_lambert_pars_fragment:wS,lights_pars_begin:ES,lights_toon_fragment:AS,lights_toon_pars_fragment:RS,lights_phong_fragment:PS,lights_phong_pars_fragment:CS,lights_physical_fragment:LS,lights_physical_pars_fragment:DS,lights_fragment_begin:kS,lights_fragment_maps:IS,lights_fragment_end:zS,logdepthbuf_fragment:FS,logdepthbuf_pars_fragment:US,logdepthbuf_pars_vertex:NS,logdepthbuf_vertex:OS,map_fragment:BS,map_pars_fragment:HS,map_particle_fragment:GS,map_particle_pars_fragment:XS,metalnessmap_fragment:VS,metalnessmap_pars_fragment:WS,morphinstance_vertex:YS,morphcolor_vertex:$S,morphnormal_vertex:ZS,morphtarget_pars_vertex:jS,morphtarget_vertex:qS,normal_fragment_begin:KS,normal_fragment_maps:JS,normal_pars_fragment:QS,normal_pars_vertex:tw,normal_vertex:ew,normalmap_pars_fragment:nw,clearcoat_normal_fragment_begin:iw,clearcoat_normal_fragment_maps:aw,clearcoat_pars_fragment:sw,iridescence_pars_fragment:ow,opaque_fragment:rw,packing:cw,premultiplied_alpha_fragment:lw,project_vertex:dw,dithering_fragment:hw,dithering_pars_fragment:uw,roughnessmap_fragment:fw,roughnessmap_pars_fragment:pw,shadowmap_pars_fragment:mw,shadowmap_pars_vertex:gw,shadowmap_vertex:xw,shadowmask_pars_fragment:vw,skinbase_vertex:yw,skinning_pars_vertex:Mw,skinning_vertex:_w,skinnormal_vertex:bw,specularmap_fragment:Sw,specularmap_pars_fragment:ww,tonemapping_fragment:Ew,tonemapping_pars_fragment:Tw,transmission_fragment:Aw,transmission_pars_fragment:Rw,uv_pars_fragment:Pw,uv_pars_vertex:Cw,uv_vertex:Lw,worldpos_vertex:Dw,background_vert:kw,background_frag:Iw,backgroundCube_vert:zw,backgroundCube_frag:Fw,cube_vert:Uw,cube_frag:Nw,depth_vert:Ow,depth_frag:Bw,distanceRGBA_vert:Hw,distanceRGBA_frag:Gw,equirect_vert:Xw,equirect_frag:Vw,linedashed_vert:Ww,linedashed_frag:Yw,meshbasic_vert:$w,meshbasic_frag:Zw,meshlambert_vert:jw,meshlambert_frag:qw,meshmatcap_vert:Kw,meshmatcap_frag:Jw,meshnormal_vert:Qw,meshnormal_frag:tE,meshphong_vert:eE,meshphong_frag:nE,meshphysical_vert:iE,meshphysical_frag:aE,meshtoon_vert:sE,meshtoon_frag:oE,points_vert:rE,points_frag:cE,shadow_vert:lE,shadow_frag:dE,sprite_vert:hE,sprite_frag:uE},Vt={common:{diffuse:{value:new ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new _e},alphaMap:{value:null},alphaMapTransform:{value:new _e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new _e}},envmap:{envMap:{value:null},envMapRotation:{value:new _e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new _e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new _e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new _e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new _e},normalScale:{value:new Wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new _e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new _e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new _e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new _e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new _e},alphaTest:{value:0},uvTransform:{value:new _e}},sprite:{diffuse:{value:new ee(16777215)},opacity:{value:1},center:{value:new Wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new _e},alphaMap:{value:null},alphaMapTransform:{value:new _e},alphaTest:{value:0}}},Ii={basic:{uniforms:Bn([Vt.common,Vt.specularmap,Vt.envmap,Vt.aomap,Vt.lightmap,Vt.fog]),vertexShader:be.meshbasic_vert,fragmentShader:be.meshbasic_frag},lambert:{uniforms:Bn([Vt.common,Vt.specularmap,Vt.envmap,Vt.aomap,Vt.lightmap,Vt.emissivemap,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.fog,Vt.lights,{emissive:{value:new ee(0)}}]),vertexShader:be.meshlambert_vert,fragmentShader:be.meshlambert_frag},phong:{uniforms:Bn([Vt.common,Vt.specularmap,Vt.envmap,Vt.aomap,Vt.lightmap,Vt.emissivemap,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.fog,Vt.lights,{emissive:{value:new ee(0)},specular:{value:new ee(1118481)},shininess:{value:30}}]),vertexShader:be.meshphong_vert,fragmentShader:be.meshphong_frag},standard:{uniforms:Bn([Vt.common,Vt.envmap,Vt.aomap,Vt.lightmap,Vt.emissivemap,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.roughnessmap,Vt.metalnessmap,Vt.fog,Vt.lights,{emissive:{value:new ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:be.meshphysical_vert,fragmentShader:be.meshphysical_frag},toon:{uniforms:Bn([Vt.common,Vt.aomap,Vt.lightmap,Vt.emissivemap,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.gradientmap,Vt.fog,Vt.lights,{emissive:{value:new ee(0)}}]),vertexShader:be.meshtoon_vert,fragmentShader:be.meshtoon_frag},matcap:{uniforms:Bn([Vt.common,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,Vt.fog,{matcap:{value:null}}]),vertexShader:be.meshmatcap_vert,fragmentShader:be.meshmatcap_frag},points:{uniforms:Bn([Vt.points,Vt.fog]),vertexShader:be.points_vert,fragmentShader:be.points_frag},dashed:{uniforms:Bn([Vt.common,Vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:be.linedashed_vert,fragmentShader:be.linedashed_frag},depth:{uniforms:Bn([Vt.common,Vt.displacementmap]),vertexShader:be.depth_vert,fragmentShader:be.depth_frag},normal:{uniforms:Bn([Vt.common,Vt.bumpmap,Vt.normalmap,Vt.displacementmap,{opacity:{value:1}}]),vertexShader:be.meshnormal_vert,fragmentShader:be.meshnormal_frag},sprite:{uniforms:Bn([Vt.sprite,Vt.fog]),vertexShader:be.sprite_vert,fragmentShader:be.sprite_frag},background:{uniforms:{uvTransform:{value:new _e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:be.background_vert,fragmentShader:be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new _e}},vertexShader:be.backgroundCube_vert,fragmentShader:be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:be.cube_vert,fragmentShader:be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:be.equirect_vert,fragmentShader:be.equirect_frag},distanceRGBA:{uniforms:Bn([Vt.common,Vt.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:be.distanceRGBA_vert,fragmentShader:be.distanceRGBA_frag},shadow:{uniforms:Bn([Vt.lights,Vt.fog,{color:{value:new ee(0)},opacity:{value:1}}]),vertexShader:be.shadow_vert,fragmentShader:be.shadow_frag}};Ii.physical={uniforms:Bn([Ii.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new _e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new _e},clearcoatNormalScale:{value:new Wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new _e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new _e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new _e},sheen:{value:0},sheenColor:{value:new ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new _e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new _e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new _e},transmissionSamplerSize:{value:new Wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new _e},attenuationDistance:{value:0},attenuationColor:{value:new ee(0)},specularColor:{value:new ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new _e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new _e},anisotropyVector:{value:new Wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new _e}}]),vertexShader:be.meshphysical_vert,fragmentShader:be.meshphysical_frag};const Ar={r:0,b:0,g:0},za=new Oi,fE=new Le;function pE(n,t,e,i,a,s,o){const r=new ee(0);let c=s===!0?0:1,l,d,u=null,h=0,f=null;function m(b){let x=b.isScene===!0?b.background:null;return x&&x.isTexture&&(x=(b.backgroundBlurriness>0?e:t).get(x)),x}function v(b){let x=!1;const y=m(b);y===null?p(r,c):y&&y.isColor&&(p(y,1),x=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(b,x){const y=m(x);y&&(y.isCubeTexture||y.mapping===wc)?(d===void 0&&(d=new me(new zn(1,1,1),new wa({name:"BackgroundCubeMaterial",uniforms:js(Ii.backgroundCube.uniforms),vertexShader:Ii.backgroundCube.vertexShader,fragmentShader:Ii.backgroundCube.fragmentShader,side:Yn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(S,w,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(d)),za.copy(x.backgroundRotation),za.x*=-1,za.y*=-1,za.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(za.y*=-1,za.z*=-1),d.material.uniforms.envMap.value=y,d.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(fE.makeRotationFromEuler(za)),d.material.toneMapped=Ae.getTransfer(y.colorSpace)!==Oe,(u!==y||h!==y.version||f!==n.toneMapping)&&(d.material.needsUpdate=!0,u=y,h=y.version,f=n.toneMapping),d.layers.enableAll(),b.unshift(d,d.geometry,d.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new me(new Wn(2,2),new wa({name:"BackgroundMaterial",uniforms:js(Ii.background.uniforms),vertexShader:Ii.background.vertexShader,fragmentShader:Ii.background.fragmentShader,side:Sa,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=Ae.getTransfer(y.colorSpace)!==Oe,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||h!==y.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,h=y.version,f=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,x){b.getRGB(Ar,Fm(n)),i.buffers.color.setClear(Ar.r,Ar.g,Ar.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(b,x=1){r.set(b),c=x,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,p(r,c)},render:v,addToRenderList:g}}function mE(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=h(null);let s=a,o=!1;function r(M,P,I,L,F){let C=!1;const T=u(L,I,P);s!==T&&(s=T,l(s.object)),C=f(M,L,I,F),C&&m(M,L,I,F),F!==null&&t.update(F,n.ELEMENT_ARRAY_BUFFER),(C||o)&&(o=!1,y(M,P,I,L),F!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function c(){return n.createVertexArray()}function l(M){return n.bindVertexArray(M)}function d(M){return n.deleteVertexArray(M)}function u(M,P,I){const L=I.wireframe===!0;let F=i[M.id];F===void 0&&(F={},i[M.id]=F);let C=F[P.id];C===void 0&&(C={},F[P.id]=C);let T=C[L];return T===void 0&&(T=h(c()),C[L]=T),T}function h(M){const P=[],I=[],L=[];for(let F=0;F<e;F++)P[F]=0,I[F]=0,L[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:I,attributeDivisors:L,object:M,attributes:{},index:null}}function f(M,P,I,L){const F=s.attributes,C=P.attributes;let T=0;const B=I.getAttributes();for(const G in B)if(B[G].location>=0){const it=F[G];let ht=C[G];if(ht===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(ht=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(ht=M.instanceColor)),it===void 0||it.attribute!==ht||ht&&it.data!==ht.data)return!0;T++}return s.attributesNum!==T||s.index!==L}function m(M,P,I,L){const F={},C=P.attributes;let T=0;const B=I.getAttributes();for(const G in B)if(B[G].location>=0){let it=C[G];it===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(it=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(it=M.instanceColor));const ht={};ht.attribute=it,it&&it.data&&(ht.data=it.data),F[G]=ht,T++}s.attributes=F,s.attributesNum=T,s.index=L}function v(){const M=s.newAttributes;for(let P=0,I=M.length;P<I;P++)M[P]=0}function g(M){p(M,0)}function p(M,P){const I=s.newAttributes,L=s.enabledAttributes,F=s.attributeDivisors;I[M]=1,L[M]===0&&(n.enableVertexAttribArray(M),L[M]=1),F[M]!==P&&(n.vertexAttribDivisor(M,P),F[M]=P)}function b(){const M=s.newAttributes,P=s.enabledAttributes;for(let I=0,L=P.length;I<L;I++)P[I]!==M[I]&&(n.disableVertexAttribArray(I),P[I]=0)}function x(M,P,I,L,F,C,T){T===!0?n.vertexAttribIPointer(M,P,I,F,C):n.vertexAttribPointer(M,P,I,L,F,C)}function y(M,P,I,L){v();const F=L.attributes,C=I.getAttributes(),T=P.defaultAttributeValues;for(const B in C){const G=C[B];if(G.location>=0){let $=F[B];if($===void 0&&(B==="instanceMatrix"&&M.instanceMatrix&&($=M.instanceMatrix),B==="instanceColor"&&M.instanceColor&&($=M.instanceColor)),$!==void 0){const it=$.normalized,ht=$.itemSize,yt=t.get($);if(yt===void 0)continue;const Lt=yt.buffer,q=yt.type,k=yt.bytesPerElement,Z=q===n.INT||q===n.UNSIGNED_INT||$.gpuType===uh;if($.isInterleavedBufferAttribute){const j=$.data,pt=j.stride,dt=$.offset;if(j.isInstancedInterleavedBuffer){for(let _t=0;_t<G.locationSize;_t++)p(G.location+_t,j.meshPerAttribute);M.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let _t=0;_t<G.locationSize;_t++)g(G.location+_t);n.bindBuffer(n.ARRAY_BUFFER,Lt);for(let _t=0;_t<G.locationSize;_t++)x(G.location+_t,ht/G.locationSize,q,it,pt*k,(dt+ht/G.locationSize*_t)*k,Z)}else{if($.isInstancedBufferAttribute){for(let j=0;j<G.locationSize;j++)p(G.location+j,$.meshPerAttribute);M.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let j=0;j<G.locationSize;j++)g(G.location+j);n.bindBuffer(n.ARRAY_BUFFER,Lt);for(let j=0;j<G.locationSize;j++)x(G.location+j,ht/G.locationSize,q,it,ht*k,ht/G.locationSize*j*k,Z)}}else if(T!==void 0){const it=T[B];if(it!==void 0)switch(it.length){case 2:n.vertexAttrib2fv(G.location,it);break;case 3:n.vertexAttrib3fv(G.location,it);break;case 4:n.vertexAttrib4fv(G.location,it);break;default:n.vertexAttrib1fv(G.location,it)}}}}b()}function S(){A();for(const M in i){const P=i[M];for(const I in P){const L=P[I];for(const F in L)d(L[F].object),delete L[F];delete P[I]}delete i[M]}}function w(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const I in P){const L=P[I];for(const F in L)d(L[F].object),delete L[F];delete P[I]}delete i[M.id]}function E(M){for(const P in i){const I=i[P];if(I[M.id]===void 0)continue;const L=I[M.id];for(const F in L)d(L[F].object),delete L[F];delete I[M.id]}}function A(){_(),o=!0,s!==a&&(s=a,l(s.object))}function _(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:A,resetDefaultState:_,dispose:S,releaseStatesOfGeometry:w,releaseStatesOfProgram:E,initAttributes:v,enableAttribute:g,disableUnusedAttributes:b}}function gE(n,t,e){let i;function a(l){i=l}function s(l,d){n.drawArrays(i,l,d),e.update(d,i,1)}function o(l,d,u){u!==0&&(n.drawArraysInstanced(i,l,d,u),e.update(d,i,u))}function r(l,d,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,d,0,u);let f=0;for(let m=0;m<u;m++)f+=d[m];e.update(f,i,1)}function c(l,d,u,h){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)o(l[m],d[m],h[m]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,d,0,h,0,u);let m=0;for(let v=0;v<u;v++)m+=d[v]*h[v];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function xE(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(E){return!(E!==wi&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(E){const A=E===qo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==ia&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Fi&&!A)}function c(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=e.logarithmicDepthBuffer===!0,h=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=m>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:h,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:b,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:S,maxSamples:w}}function vE(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new Ha,r=new _e,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const f=u.length!==0||h||i!==0||a;return a=h,i=u.length,f},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){e=d(u,h,0)},this.setState=function(u,h,f){const m=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!a||m===null||m.length===0||s&&!g)s?d(null):l();else{const b=s?0:i,x=b*4;let y=p.clippingState||null;c.value=y,y=d(m,h,x,f);for(let S=0;S!==x;++S)y[S]=e[S];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function d(u,h,f,m){const v=u!==null?u.length:0;let g=null;if(v!==0){if(g=c.value,m!==!0||g===null){const p=f+v*4,b=h.matrixWorldInverse;r.getNormalMatrix(b),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,y=f;x!==v;++x,y+=4)o.copy(u[x]).applyMatrix4(b,r),o.normal.toArray(g,y),g[y+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function yE(n){let t=new WeakMap;function e(o,r){return r===pd?o.mapping=Ws:r===md&&(o.mapping=Ys),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===pd||r===md)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new C1(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",a),e(l.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class Bm extends Um{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,c=a-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,r-=d*this.view.offsetY,c=r-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ks=4,_f=[.125,.215,.35,.446,.526,.582],Wa=20,wl=new Bm,bf=new ee;let El=null,Tl=0,Al=0,Rl=!1;const Ga=(1+Math.sqrt(5))/2,Es=1/Ga,Sf=[new Y(-Ga,Es,0),new Y(Ga,Es,0),new Y(-Es,0,Ga),new Y(Es,0,Ga),new Y(0,Ga,-Es),new Y(0,Ga,Es),new Y(-1,1,-1),new Y(1,1,-1),new Y(-1,1,1),new Y(1,1,1)];class wf{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){El=this._renderer.getRenderTarget(),Tl=this._renderer.getActiveCubeFace(),Al=this._renderer.getActiveMipmapLevel(),Rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Af(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Tf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(El,Tl,Al),this._renderer.xr.enabled=Rl,t.scissorTest=!1,Rr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ws||t.mapping===Ys?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),El=this._renderer.getRenderTarget(),Tl=this._renderer.getActiveCubeFace(),Al=this._renderer.getActiveMipmapLevel(),Rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:zi,minFilter:zi,generateMipmaps:!1,type:qo,format:wi,colorSpace:qs,depthBuffer:!1},a=Ef(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ef(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ME(s)),this._blurMaterial=_E(s,t,e)}return a}_compileMaterial(t){const e=new me(this._lodPlanes[0],t);this._renderer.compile(e,wl)}_sceneToCubeUV(t,e,i,a){const r=new mi(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor(bf),d.toneMapping=Ma,d.autoClear=!1;const f=new xn({name:"PMREM.Background",side:Yn,depthWrite:!1,depthTest:!1}),m=new me(new zn,f);let v=!1;const g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,v=!0):(f.color.copy(bf),v=!0);for(let p=0;p<6;p++){const b=p%3;b===0?(r.up.set(0,c[p],0),r.lookAt(l[p],0,0)):b===1?(r.up.set(0,0,c[p]),r.lookAt(0,l[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,l[p]));const x=this._cubeSize;Rr(a,b*x,p>2?x:0,x,x),d.setRenderTarget(a),v&&d.render(m,r),d.render(t,r)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=h,d.autoClear=u,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===Ws||t.mapping===Ys;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Af()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Tf());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new me(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const c=this._cubeSize;Rr(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,wl)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=Sf[(a-s-1)%Sf.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new me(this._lodPlanes[a],l),h=l.uniforms,f=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Wa-1),v=s/m,g=isFinite(s)?1+Math.floor(d*v):Wa;g>Wa&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Wa}`);const p=[];let b=0;for(let E=0;E<Wa;++E){const A=E/v,_=Math.exp(-A*A/2);p.push(_),E===0?b+=_:E<g&&(b+=2*_)}for(let E=0;E<p.length;E++)p[E]=p[E]/b;h.envMap.value=t.texture,h.samples.value=g,h.weights.value=p,h.latitudinal.value=o==="latitudinal",r&&(h.poleAxis.value=r);const{_lodMax:x}=this;h.dTheta.value=m,h.mipInt.value=x-i;const y=this._sizeLods[a],S=3*y*(a>x-ks?a-x+ks:0),w=4*(this._cubeSize-y);Rr(e,S,w,3*y,2*y),c.setRenderTarget(e),c.render(u,wl)}}function ME(n){const t=[],e=[],i=[];let a=n;const s=n-ks+1+_f.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let c=1/r;o>n-ks?c=_f[o-n+ks-1]:o===0&&(c=0),i.push(c);const l=1/(r-2),d=-l,u=1+l,h=[d,d,u,d,u,u,d,d,u,u,d,u],f=6,m=6,v=3,g=2,p=1,b=new Float32Array(v*m*f),x=new Float32Array(g*m*f),y=new Float32Array(p*m*f);for(let w=0;w<f;w++){const E=w%3*2/3-1,A=w>2?0:-1,_=[E,A,0,E+2/3,A,0,E+2/3,A+1,0,E,A,0,E+2/3,A+1,0,E,A+1,0];b.set(_,v*m*w),x.set(h,g*m*w);const M=[w,w,w,w,w,w];y.set(M,p*m*w)}const S=new Ke;S.setAttribute("position",new cn(b,v)),S.setAttribute("uv",new cn(x,g)),S.setAttribute("faceIndex",new cn(y,p)),t.push(S),a>ks&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Ef(n,t,e){const i=new Ka(n,t,e);return i.texture.mapping=wc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Rr(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function _E(n,t,e){const i=new Float32Array(Wa),a=new Y(0,1,0);return new wa({name:"SphericalGaussianBlur",defines:{n:Wa,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Sh(),fragmentShader:`

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
		`,blending:ya,depthTest:!1,depthWrite:!1})}function Tf(){return new wa({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sh(),fragmentShader:`

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
		`,blending:ya,depthTest:!1,depthWrite:!1})}function Af(){return new wa({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ya,depthTest:!1,depthWrite:!1})}function Sh(){return`

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
	`}function bE(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===pd||c===md,d=c===Ws||c===Ys;if(l||d){let u=t.get(r);const h=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==h)return e===null&&(e=new wf(n)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return l&&f&&f.height>0||d&&f&&a(f)?(e===null&&(e=new wf(n)),u=l?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",s),u.texture):null}}}return r}function a(r){let c=0;const l=6;for(let d=0;d<l;d++)r[d]!==void 0&&c++;return c===l}function s(r){const c=r.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function SE(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&Eo("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function wE(n,t,e,i){const a={},s=new WeakMap;function o(u){const h=u.target;h.index!==null&&t.remove(h.index);for(const m in h.attributes)t.remove(h.attributes[m]);for(const m in h.morphAttributes){const v=h.morphAttributes[m];for(let g=0,p=v.length;g<p;g++)t.remove(v[g])}h.removeEventListener("dispose",o),delete a[h.id];const f=s.get(h);f&&(t.remove(f),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function r(u,h){return a[h.id]===!0||(h.addEventListener("dispose",o),a[h.id]=!0,e.memory.geometries++),h}function c(u){const h=u.attributes;for(const m in h)t.update(h[m],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const m in f){const v=f[m];for(let g=0,p=v.length;g<p;g++)t.update(v[g],n.ARRAY_BUFFER)}}function l(u){const h=[],f=u.index,m=u.attributes.position;let v=0;if(f!==null){const b=f.array;v=f.version;for(let x=0,y=b.length;x<y;x+=3){const S=b[x+0],w=b[x+1],E=b[x+2];h.push(S,w,w,E,E,S)}}else if(m!==void 0){const b=m.array;v=m.version;for(let x=0,y=b.length/3-1;x<y;x+=3){const S=x+0,w=x+1,E=x+2;h.push(S,w,w,E,E,S)}}else return;const g=new(Cm(h)?zm:Im)(h,1);g.version=v;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function d(u){const h=s.get(u);if(h){const f=u.index;f!==null&&h.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:r,update:c,getWireframeAttribute:d}}function EE(n,t,e){let i;function a(h){i=h}let s,o;function r(h){s=h.type,o=h.bytesPerElement}function c(h,f){n.drawElements(i,f,s,h*o),e.update(f,i,1)}function l(h,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,h*o,m),e.update(f,i,m))}function d(h,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,h,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,i,1)}function u(h,f,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<h.length;p++)l(h[p]/o,f[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,s,h,0,v,0,m);let p=0;for(let b=0;b<m;b++)p+=f[b]*v[b];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function TE(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function AE(n,t,e){const i=new WeakMap,a=new rn;function s(o,r,c){const l=o.morphTargetInfluences,d=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=d!==void 0?d.length:0;let h=i.get(r);if(h===void 0||h.count!==u){let M=function(){A.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var f=M;h!==void 0&&h.texture.dispose();const m=r.morphAttributes.position!==void 0,v=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],b=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let y=0;m===!0&&(y=1),v===!0&&(y=2),g===!0&&(y=3);let S=r.attributes.position.count*y,w=1;S>t.maxTextureSize&&(w=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const E=new Float32Array(S*w*4*u),A=new Dm(E,S,w,u);A.type=Fi,A.needsUpdate=!0;const _=y*4;for(let P=0;P<u;P++){const I=p[P],L=b[P],F=x[P],C=S*w*4*P;for(let T=0;T<I.count;T++){const B=T*_;m===!0&&(a.fromBufferAttribute(I,T),E[C+B+0]=a.x,E[C+B+1]=a.y,E[C+B+2]=a.z,E[C+B+3]=0),v===!0&&(a.fromBufferAttribute(L,T),E[C+B+4]=a.x,E[C+B+5]=a.y,E[C+B+6]=a.z,E[C+B+7]=0),g===!0&&(a.fromBufferAttribute(F,T),E[C+B+8]=a.x,E[C+B+9]=a.y,E[C+B+10]=a.z,E[C+B+11]=F.itemSize===4?a.w:1)}}h={count:u,texture:A,size:new Wt(S,w)},i.set(r,h),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<l.length;g++)m+=l[g];const v=r.morphTargetsRelative?1:1-m;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function RE(n,t,e,i){let a=new WeakMap;function s(c){const l=i.render.frame,d=c.geometry,u=t.get(c,d);if(a.get(u)!==l&&(t.update(u),a.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),a.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;a.get(h)!==l&&(h.update(),a.set(h,l))}return u}function o(){a=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}class Hm extends In{constructor(t,e,i,a,s,o,r,c,l,d=Us){if(d!==Us&&d!==Zs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Us&&(i=qa),i===void 0&&d===Zs&&(i=$s),super(null,a,s,o,r,c,d,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:oi,this.minFilter=c!==void 0?c:oi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Gm=new In,Rf=new Hm(1,1),Xm=new Dm,Vm=new p1,Wm=new Nm,Pf=[],Cf=[],Lf=new Float32Array(16),Df=new Float32Array(9),kf=new Float32Array(4);function Qs(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Pf[a];if(s===void 0&&(s=new Float32Array(a),Pf[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function vn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function yn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Tc(n,t){let e=Cf[t];e===void 0&&(e=new Int32Array(t),Cf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function PE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function CE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(vn(e,t))return;n.uniform2fv(this.addr,t),yn(e,t)}}function LE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(vn(e,t))return;n.uniform3fv(this.addr,t),yn(e,t)}}function DE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(vn(e,t))return;n.uniform4fv(this.addr,t),yn(e,t)}}function kE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(vn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),yn(e,t)}else{if(vn(e,i))return;kf.set(i),n.uniformMatrix2fv(this.addr,!1,kf),yn(e,i)}}function IE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(vn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),yn(e,t)}else{if(vn(e,i))return;Df.set(i),n.uniformMatrix3fv(this.addr,!1,Df),yn(e,i)}}function zE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(vn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),yn(e,t)}else{if(vn(e,i))return;Lf.set(i),n.uniformMatrix4fv(this.addr,!1,Lf),yn(e,i)}}function FE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function UE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(vn(e,t))return;n.uniform2iv(this.addr,t),yn(e,t)}}function NE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(vn(e,t))return;n.uniform3iv(this.addr,t),yn(e,t)}}function OE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(vn(e,t))return;n.uniform4iv(this.addr,t),yn(e,t)}}function BE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function HE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(vn(e,t))return;n.uniform2uiv(this.addr,t),yn(e,t)}}function GE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(vn(e,t))return;n.uniform3uiv(this.addr,t),yn(e,t)}}function XE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(vn(e,t))return;n.uniform4uiv(this.addr,t),yn(e,t)}}function VE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Rf.compareFunction=Pm,s=Rf):s=Gm,e.setTexture2D(t||s,a)}function WE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||Vm,a)}function YE(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||Wm,a)}function $E(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Xm,a)}function ZE(n){switch(n){case 5126:return PE;case 35664:return CE;case 35665:return LE;case 35666:return DE;case 35674:return kE;case 35675:return IE;case 35676:return zE;case 5124:case 35670:return FE;case 35667:case 35671:return UE;case 35668:case 35672:return NE;case 35669:case 35673:return OE;case 5125:return BE;case 36294:return HE;case 36295:return GE;case 36296:return XE;case 35678:case 36198:case 36298:case 36306:case 35682:return VE;case 35679:case 36299:case 36307:return WE;case 35680:case 36300:case 36308:case 36293:return YE;case 36289:case 36303:case 36311:case 36292:return $E}}function jE(n,t){n.uniform1fv(this.addr,t)}function qE(n,t){const e=Qs(t,this.size,2);n.uniform2fv(this.addr,e)}function KE(n,t){const e=Qs(t,this.size,3);n.uniform3fv(this.addr,e)}function JE(n,t){const e=Qs(t,this.size,4);n.uniform4fv(this.addr,e)}function QE(n,t){const e=Qs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function tT(n,t){const e=Qs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function eT(n,t){const e=Qs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function nT(n,t){n.uniform1iv(this.addr,t)}function iT(n,t){n.uniform2iv(this.addr,t)}function aT(n,t){n.uniform3iv(this.addr,t)}function sT(n,t){n.uniform4iv(this.addr,t)}function oT(n,t){n.uniform1uiv(this.addr,t)}function rT(n,t){n.uniform2uiv(this.addr,t)}function cT(n,t){n.uniform3uiv(this.addr,t)}function lT(n,t){n.uniform4uiv(this.addr,t)}function dT(n,t,e){const i=this.cache,a=t.length,s=Tc(e,a);vn(i,s)||(n.uniform1iv(this.addr,s),yn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||Gm,s[o])}function hT(n,t,e){const i=this.cache,a=t.length,s=Tc(e,a);vn(i,s)||(n.uniform1iv(this.addr,s),yn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||Vm,s[o])}function uT(n,t,e){const i=this.cache,a=t.length,s=Tc(e,a);vn(i,s)||(n.uniform1iv(this.addr,s),yn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||Wm,s[o])}function fT(n,t,e){const i=this.cache,a=t.length,s=Tc(e,a);vn(i,s)||(n.uniform1iv(this.addr,s),yn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Xm,s[o])}function pT(n){switch(n){case 5126:return jE;case 35664:return qE;case 35665:return KE;case 35666:return JE;case 35674:return QE;case 35675:return tT;case 35676:return eT;case 5124:case 35670:return nT;case 35667:case 35671:return iT;case 35668:case 35672:return aT;case 35669:case 35673:return sT;case 5125:return oT;case 36294:return rT;case 36295:return cT;case 36296:return lT;case 35678:case 36198:case 36298:case 36306:case 35682:return dT;case 35679:case 36299:case 36307:return hT;case 35680:case 36300:case 36308:case 36293:return uT;case 36289:case 36303:case 36311:case 36292:return fT}}class mT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=ZE(e.type)}}class gT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=pT(e.type)}}class xT{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const Pl=/(\w+)(\])?(\[|\.)?/g;function If(n,t){n.seq.push(t),n.map[t.id]=t}function vT(n,t,e){const i=n.name,a=i.length;for(Pl.lastIndex=0;;){const s=Pl.exec(i),o=Pl.lastIndex;let r=s[1];const c=s[2]==="]",l=s[3];if(c&&(r=r|0),l===void 0||l==="["&&o+2===a){If(e,l===void 0?new mT(r,n,t):new gT(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new xT(r),If(e,u)),e=u}}}class Kr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);vT(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function zf(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const yT=37297;let MT=0;function _T(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Ff=new _e;function bT(n){Ae._getMatrix(Ff,Ae.workingColorSpace,n);const t=`mat3( ${Ff.elements.map(e=>e.toFixed(4))} )`;switch(Ae.getTransfer(n)){case Ec:return[t,"LinearTransferOETF"];case Oe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Uf(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+_T(n.getShaderSource(t),o)}else return a}function ST(n,t){const e=bT(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function wT(n,t){let e;switch(t){case Tb:e="Linear";break;case Ab:e="Reinhard";break;case Rb:e="Cineon";break;case Pb:e="ACESFilmic";break;case Lb:e="AgX";break;case Db:e="Neutral";break;case Cb:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Pr=new Y;function ET(){Ae.getLuminanceCoefficients(Pr);const n=Pr.x.toFixed(4),t=Pr.y.toFixed(4),e=Pr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function TT(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(To).join(`
`)}function AT(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function RT(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function To(n){return n!==""}function Nf(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Of(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const PT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wd(n){return n.replace(PT,LT)}const CT=new Map;function LT(n,t){let e=be[t];if(e===void 0){const i=CT.get(t);if(i!==void 0)e=be[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Wd(e)}const DT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bf(n){return n.replace(DT,kT)}function kT(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Hf(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function IT(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===gm?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===xm?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ki&&(t="SHADOWMAP_TYPE_VSM"),t}function zT(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ws:case Ys:t="ENVMAP_TYPE_CUBE";break;case wc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function FT(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ys:t="ENVMAP_MODE_REFRACTION";break}return t}function UT(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case hh:t="ENVMAP_BLENDING_MULTIPLY";break;case wb:t="ENVMAP_BLENDING_MIX";break;case Eb:t="ENVMAP_BLENDING_ADD";break}return t}function NT(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function OT(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const c=IT(e),l=zT(e),d=FT(e),u=UT(e),h=NT(e),f=TT(e),m=AT(s),v=a.createProgram();let g,p,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(To).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(To).join(`
`),p.length>0&&(p+=`
`)):(g=[Hf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(To).join(`
`),p=[Hf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ma?"#define TONE_MAPPING":"",e.toneMapping!==Ma?be.tonemapping_pars_fragment:"",e.toneMapping!==Ma?wT("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",be.colorspace_pars_fragment,ST("linearToOutputTexel",e.outputColorSpace),ET(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(To).join(`
`)),o=Wd(o),o=Nf(o,e),o=Of(o,e),r=Wd(r),r=Nf(r,e),r=Of(r,e),o=Bf(o),r=Bf(r),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Ku?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ku?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=b+g+o,y=b+p+r,S=zf(a,a.VERTEX_SHADER,x),w=zf(a,a.FRAGMENT_SHADER,y);a.attachShader(v,S),a.attachShader(v,w),e.index0AttributeName!==void 0?a.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(v,0,"position"),a.linkProgram(v);function E(P){if(n.debug.checkShaderErrors){const I=a.getProgramInfoLog(v).trim(),L=a.getShaderInfoLog(S).trim(),F=a.getShaderInfoLog(w).trim();let C=!0,T=!0;if(a.getProgramParameter(v,a.LINK_STATUS)===!1)if(C=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,v,S,w);else{const B=Uf(a,S,"vertex"),G=Uf(a,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(v,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+I+`
`+B+`
`+G)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(L===""||F==="")&&(T=!1);T&&(P.diagnostics={runnable:C,programLog:I,vertexShader:{log:L,prefix:g},fragmentShader:{log:F,prefix:p}})}a.deleteShader(S),a.deleteShader(w),A=new Kr(a,v),_=RT(a,v)}let A;this.getUniforms=function(){return A===void 0&&E(this),A};let _;this.getAttributes=function(){return _===void 0&&E(this),_};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=a.getProgramParameter(v,yT)),M},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=MT++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=S,this.fragmentShader=w,this}let BT=0;class HT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new GT(t),e.set(t,i)),i}}class GT{constructor(t){this.id=BT++,this.code=t,this.usedTimes=0}}function XT(n,t,e,i,a,s,o){const r=new _h,c=new HT,l=new Set,d=[],u=a.logarithmicDepthBuffer,h=a.vertexTextures;let f=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(_){return l.add(_),_===0?"uv":`uv${_}`}function g(_,M,P,I,L){const F=I.fog,C=L.geometry,T=_.isMeshStandardMaterial?I.environment:null,B=(_.isMeshStandardMaterial?e:t).get(_.envMap||T),G=B&&B.mapping===wc?B.image.height:null,$=m[_.type];_.precision!==null&&(f=a.getMaxPrecision(_.precision),f!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",f,"instead."));const it=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,ht=it!==void 0?it.length:0;let yt=0;C.morphAttributes.position!==void 0&&(yt=1),C.morphAttributes.normal!==void 0&&(yt=2),C.morphAttributes.color!==void 0&&(yt=3);let Lt,q,k,Z;if($){const Qt=Ii[$];Lt=Qt.vertexShader,q=Qt.fragmentShader}else Lt=_.vertexShader,q=_.fragmentShader,c.update(_),k=c.getVertexShaderID(_),Z=c.getFragmentShaderID(_);const j=n.getRenderTarget(),pt=n.state.buffers.depth.getReversed(),dt=L.isInstancedMesh===!0,_t=L.isBatchedMesh===!0,Yt=!!_.map,J=!!_.matcap,W=!!B,O=!!_.aoMap,Pt=!!_.lightMap,ot=!!_.bumpMap,at=!!_.normalMap,Tt=!!_.displacementMap,mt=!!_.emissiveMap,zt=!!_.metalnessMap,D=!!_.roughnessMap,R=_.anisotropy>0,Q=_.clearcoat>0,ut=_.dispersion>0,ft=_.iridescence>0,st=_.sheen>0,kt=_.transmission>0,Et=R&&!!_.anisotropyMap,wt=Q&&!!_.clearcoatMap,Xt=Q&&!!_.clearcoatNormalMap,xt=Q&&!!_.clearcoatRoughnessMap,Ut=ft&&!!_.iridescenceMap,V=ft&&!!_.iridescenceThicknessMap,K=st&&!!_.sheenColorMap,gt=st&&!!_.sheenRoughnessMap,Nt=!!_.specularMap,Ot=!!_.specularColorMap,It=!!_.specularIntensityMap,N=kt&&!!_.transmissionMap,At=kt&&!!_.thicknessMap,X=!!_.gradientMap,lt=!!_.alphaMap,Ct=_.alphaTest>0,Dt=!!_.alphaHash,Kt=!!_.extensions;let oe=Ma;_.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(oe=n.toneMapping);const de={shaderID:$,shaderType:_.type,shaderName:_.name,vertexShader:Lt,fragmentShader:q,defines:_.defines,customVertexShaderID:k,customFragmentShaderID:Z,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:f,batching:_t,batchingColor:_t&&L._colorsTexture!==null,instancing:dt,instancingColor:dt&&L.instanceColor!==null,instancingMorph:dt&&L.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:j===null?n.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:qs,alphaToCoverage:!!_.alphaToCoverage,map:Yt,matcap:J,envMap:W,envMapMode:W&&B.mapping,envMapCubeUVHeight:G,aoMap:O,lightMap:Pt,bumpMap:ot,normalMap:at,displacementMap:h&&Tt,emissiveMap:mt,normalMapObjectSpace:at&&_.normalMapType===Fb,normalMapTangentSpace:at&&_.normalMapType===Rm,metalnessMap:zt,roughnessMap:D,anisotropy:R,anisotropyMap:Et,clearcoat:Q,clearcoatMap:wt,clearcoatNormalMap:Xt,clearcoatRoughnessMap:xt,dispersion:ut,iridescence:ft,iridescenceMap:Ut,iridescenceThicknessMap:V,sheen:st,sheenColorMap:K,sheenRoughnessMap:gt,specularMap:Nt,specularColorMap:Ot,specularIntensityMap:It,transmission:kt,transmissionMap:N,thicknessMap:At,gradientMap:X,opaque:_.transparent===!1&&_.blending===Fs&&_.alphaToCoverage===!1,alphaMap:lt,alphaTest:Ct,alphaHash:Dt,combine:_.combine,mapUv:Yt&&v(_.map.channel),aoMapUv:O&&v(_.aoMap.channel),lightMapUv:Pt&&v(_.lightMap.channel),bumpMapUv:ot&&v(_.bumpMap.channel),normalMapUv:at&&v(_.normalMap.channel),displacementMapUv:Tt&&v(_.displacementMap.channel),emissiveMapUv:mt&&v(_.emissiveMap.channel),metalnessMapUv:zt&&v(_.metalnessMap.channel),roughnessMapUv:D&&v(_.roughnessMap.channel),anisotropyMapUv:Et&&v(_.anisotropyMap.channel),clearcoatMapUv:wt&&v(_.clearcoatMap.channel),clearcoatNormalMapUv:Xt&&v(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xt&&v(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Ut&&v(_.iridescenceMap.channel),iridescenceThicknessMapUv:V&&v(_.iridescenceThicknessMap.channel),sheenColorMapUv:K&&v(_.sheenColorMap.channel),sheenRoughnessMapUv:gt&&v(_.sheenRoughnessMap.channel),specularMapUv:Nt&&v(_.specularMap.channel),specularColorMapUv:Ot&&v(_.specularColorMap.channel),specularIntensityMapUv:It&&v(_.specularIntensityMap.channel),transmissionMapUv:N&&v(_.transmissionMap.channel),thicknessMapUv:At&&v(_.thicknessMap.channel),alphaMapUv:lt&&v(_.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(at||R),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!C.attributes.uv&&(Yt||lt),fog:!!F,useFog:_.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:pt,skinning:L.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:yt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:oe,decodeVideoTexture:Yt&&_.map.isVideoTexture===!0&&Ae.getTransfer(_.map.colorSpace)===Oe,decodeVideoTextureEmissive:mt&&_.emissiveMap.isVideoTexture===!0&&Ae.getTransfer(_.emissiveMap.colorSpace)===Oe,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===qe,flipSided:_.side===Yn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Kt&&_.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Kt&&_.extensions.multiDraw===!0||_t)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return de.vertexUv1s=l.has(1),de.vertexUv2s=l.has(2),de.vertexUv3s=l.has(3),l.clear(),de}function p(_){const M=[];if(_.shaderID?M.push(_.shaderID):(M.push(_.customVertexShaderID),M.push(_.customFragmentShaderID)),_.defines!==void 0)for(const P in _.defines)M.push(P),M.push(_.defines[P]);return _.isRawShaderMaterial===!1&&(b(M,_),x(M,_),M.push(n.outputColorSpace)),M.push(_.customProgramCacheKey),M.join()}function b(_,M){_.push(M.precision),_.push(M.outputColorSpace),_.push(M.envMapMode),_.push(M.envMapCubeUVHeight),_.push(M.mapUv),_.push(M.alphaMapUv),_.push(M.lightMapUv),_.push(M.aoMapUv),_.push(M.bumpMapUv),_.push(M.normalMapUv),_.push(M.displacementMapUv),_.push(M.emissiveMapUv),_.push(M.metalnessMapUv),_.push(M.roughnessMapUv),_.push(M.anisotropyMapUv),_.push(M.clearcoatMapUv),_.push(M.clearcoatNormalMapUv),_.push(M.clearcoatRoughnessMapUv),_.push(M.iridescenceMapUv),_.push(M.iridescenceThicknessMapUv),_.push(M.sheenColorMapUv),_.push(M.sheenRoughnessMapUv),_.push(M.specularMapUv),_.push(M.specularColorMapUv),_.push(M.specularIntensityMapUv),_.push(M.transmissionMapUv),_.push(M.thicknessMapUv),_.push(M.combine),_.push(M.fogExp2),_.push(M.sizeAttenuation),_.push(M.morphTargetsCount),_.push(M.morphAttributeCount),_.push(M.numDirLights),_.push(M.numPointLights),_.push(M.numSpotLights),_.push(M.numSpotLightMaps),_.push(M.numHemiLights),_.push(M.numRectAreaLights),_.push(M.numDirLightShadows),_.push(M.numPointLightShadows),_.push(M.numSpotLightShadows),_.push(M.numSpotLightShadowsWithMaps),_.push(M.numLightProbes),_.push(M.shadowMapType),_.push(M.toneMapping),_.push(M.numClippingPlanes),_.push(M.numClipIntersection),_.push(M.depthPacking)}function x(_,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),_.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),_.push(r.mask)}function y(_){const M=m[_.type];let P;if(M){const I=Ii[M];P=T1.clone(I.uniforms)}else P=_.uniforms;return P}function S(_,M){let P;for(let I=0,L=d.length;I<L;I++){const F=d[I];if(F.cacheKey===M){P=F,++P.usedTimes;break}}return P===void 0&&(P=new OT(n,M,_,s),d.push(P)),P}function w(_){if(--_.usedTimes===0){const M=d.indexOf(_);d[M]=d[d.length-1],d.pop(),_.destroy()}}function E(_){c.remove(_)}function A(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:y,acquireProgram:S,releaseProgram:w,releaseShaderCache:E,programs:d,dispose:A}}function VT(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,c){n.get(o)[r]=c}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function WT(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Gf(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Xf(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(u,h,f,m,v,g){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:h,material:f,groupOrder:m,renderOrder:u.renderOrder,z:v,group:g},n[t]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=v,p.group=g),t++,p}function r(u,h,f,m,v,g){const p=o(u,h,f,m,v,g);f.transmission>0?i.push(p):f.transparent===!0?a.push(p):e.push(p)}function c(u,h,f,m,v,g){const p=o(u,h,f,m,v,g);f.transmission>0?i.unshift(p):f.transparent===!0?a.unshift(p):e.unshift(p)}function l(u,h){e.length>1&&e.sort(u||WT),i.length>1&&i.sort(h||Gf),a.length>1&&a.sort(h||Gf)}function d(){for(let u=t,h=n.length;u<h;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:c,finish:d,sort:l}}function YT(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new Xf,n.set(i,[o])):a>=s.length?(o=new Xf,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function $T(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new Y,color:new ee};break;case"SpotLight":e={position:new Y,direction:new Y,color:new ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new Y,color:new ee,distance:0,decay:0};break;case"HemisphereLight":e={direction:new Y,skyColor:new ee,groundColor:new ee};break;case"RectAreaLight":e={color:new ee,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return n[t.id]=e,e}}}function ZT(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let jT=0;function qT(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function KT(n){const t=new $T,e=ZT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new Y);const a=new Y,s=new Le,o=new Le;function r(l){let d=0,u=0,h=0;for(let _=0;_<9;_++)i.probe[_].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,b=0,x=0,y=0,S=0,w=0,E=0;l.sort(qT);for(let _=0,M=l.length;_<M;_++){const P=l[_],I=P.color,L=P.intensity,F=P.distance,C=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=I.r*L,u+=I.g*L,h+=I.b*L;else if(P.isLightProbe){for(let T=0;T<9;T++)i.probe[T].addScaledVector(P.sh.coefficients[T],L);E++}else if(P.isDirectionalLight){const T=t.get(P);if(T.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const B=P.shadow,G=e.get(P);G.shadowIntensity=B.intensity,G.shadowBias=B.bias,G.shadowNormalBias=B.normalBias,G.shadowRadius=B.radius,G.shadowMapSize=B.mapSize,i.directionalShadow[f]=G,i.directionalShadowMap[f]=C,i.directionalShadowMatrix[f]=P.shadow.matrix,b++}i.directional[f]=T,f++}else if(P.isSpotLight){const T=t.get(P);T.position.setFromMatrixPosition(P.matrixWorld),T.color.copy(I).multiplyScalar(L),T.distance=F,T.coneCos=Math.cos(P.angle),T.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),T.decay=P.decay,i.spot[v]=T;const B=P.shadow;if(P.map&&(i.spotLightMap[S]=P.map,S++,B.updateMatrices(P),P.castShadow&&w++),i.spotLightMatrix[v]=B.matrix,P.castShadow){const G=e.get(P);G.shadowIntensity=B.intensity,G.shadowBias=B.bias,G.shadowNormalBias=B.normalBias,G.shadowRadius=B.radius,G.shadowMapSize=B.mapSize,i.spotShadow[v]=G,i.spotShadowMap[v]=C,y++}v++}else if(P.isRectAreaLight){const T=t.get(P);T.color.copy(I).multiplyScalar(L),T.halfWidth.set(P.width*.5,0,0),T.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=T,g++}else if(P.isPointLight){const T=t.get(P);if(T.color.copy(P.color).multiplyScalar(P.intensity),T.distance=P.distance,T.decay=P.decay,P.castShadow){const B=P.shadow,G=e.get(P);G.shadowIntensity=B.intensity,G.shadowBias=B.bias,G.shadowNormalBias=B.normalBias,G.shadowRadius=B.radius,G.shadowMapSize=B.mapSize,G.shadowCameraNear=B.camera.near,G.shadowCameraFar=B.camera.far,i.pointShadow[m]=G,i.pointShadowMap[m]=C,i.pointShadowMatrix[m]=P.shadow.matrix,x++}i.point[m]=T,m++}else if(P.isHemisphereLight){const T=t.get(P);T.skyColor.copy(P.color).multiplyScalar(L),T.groundColor.copy(P.groundColor).multiplyScalar(L),i.hemi[p]=T,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Vt.LTC_FLOAT_1,i.rectAreaLTC2=Vt.LTC_FLOAT_2):(i.rectAreaLTC1=Vt.LTC_HALF_1,i.rectAreaLTC2=Vt.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;const A=i.hash;(A.directionalLength!==f||A.pointLength!==m||A.spotLength!==v||A.rectAreaLength!==g||A.hemiLength!==p||A.numDirectionalShadows!==b||A.numPointShadows!==x||A.numSpotShadows!==y||A.numSpotMaps!==S||A.numLightProbes!==E)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=y+S-w,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=E,A.directionalLength=f,A.pointLength=m,A.spotLength=v,A.rectAreaLength=g,A.hemiLength=p,A.numDirectionalShadows=b,A.numPointShadows=x,A.numSpotShadows=y,A.numSpotMaps=S,A.numLightProbes=E,i.version=jT++)}function c(l,d){let u=0,h=0,f=0,m=0,v=0;const g=d.matrixWorldInverse;for(let p=0,b=l.length;p<b;p++){const x=l[p];if(x.isDirectionalLight){const y=i.directional[u];y.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(g),u++}else if(x.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(g),f++}else if(x.isRectAreaLight){const y=i.rectArea[m];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const y=i.point[h];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),h++}else if(x.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(g),v++}}}return{setup:r,setupView:c,state:i}}function Vf(n){const t=new KT(n),e=[],i=[];function a(d){l.camera=d,e.length=0,i.length=0}function s(d){e.push(d)}function o(d){i.push(d)}function r(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:l,setupLights:r,setupLightsView:c,pushLight:s,pushShadow:o}}function JT(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new Vf(n),t.set(a,[r])):s>=o.length?(r=new Vf(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class QT extends ts{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Ib,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class tA extends ts{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const eA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,nA=`uniform sampler2D shadow_pass;
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
}`;function iA(n,t,e){let i=new bh;const a=new Wt,s=new Wt,o=new rn,r=new QT({depthPacking:zb}),c=new tA,l={},d=e.maxTextureSize,u={[Sa]:Yn,[Yn]:Sa,[qe]:qe},h=new wa({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Wt},radius:{value:4}},vertexShader:eA,fragmentShader:nA}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const m=new Ke;m.setAttribute("position",new cn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new me(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gm;let p=this.type;this.render=function(w,E,A){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;const _=n.getRenderTarget(),M=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),I=n.state;I.setBlending(ya),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const L=p!==Ki&&this.type===Ki,F=p===Ki&&this.type!==Ki;for(let C=0,T=w.length;C<T;C++){const B=w[C],G=B.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;a.copy(G.mapSize);const $=G.getFrameExtents();if(a.multiply($),s.copy(G.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(s.x=Math.floor(d/$.x),a.x=s.x*$.x,G.mapSize.x=s.x),a.y>d&&(s.y=Math.floor(d/$.y),a.y=s.y*$.y,G.mapSize.y=s.y)),G.map===null||L===!0||F===!0){const ht=this.type!==Ki?{minFilter:oi,magFilter:oi}:{};G.map!==null&&G.map.dispose(),G.map=new Ka(a.x,a.y,ht),G.map.texture.name=B.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();const it=G.getViewportCount();for(let ht=0;ht<it;ht++){const yt=G.getViewport(ht);o.set(s.x*yt.x,s.y*yt.y,s.x*yt.z,s.y*yt.w),I.viewport(o),G.updateMatrices(B,ht),i=G.getFrustum(),y(E,A,G.camera,B,this.type)}G.isPointLightShadow!==!0&&this.type===Ki&&b(G,A),G.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(_,M,P)};function b(w,E){const A=t.update(v);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Ka(a.x,a.y)),h.uniforms.shadow_pass.value=w.map.texture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(E,null,A,h,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(E,null,A,f,v,null)}function x(w,E,A,_){let M=null;const P=A.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(P!==void 0)M=P;else if(M=A.isPointLight===!0?c:r,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const I=M.uuid,L=E.uuid;let F=l[I];F===void 0&&(F={},l[I]=F);let C=F[L];C===void 0&&(C=M.clone(),F[L]=C,E.addEventListener("dispose",S)),M=C}if(M.visible=E.visible,M.wireframe=E.wireframe,_===Ki?M.side=E.shadowSide!==null?E.shadowSide:E.side:M.side=E.shadowSide!==null?E.shadowSide:u[E.side],M.alphaMap=E.alphaMap,M.alphaTest=E.alphaTest,M.map=E.map,M.clipShadows=E.clipShadows,M.clippingPlanes=E.clippingPlanes,M.clipIntersection=E.clipIntersection,M.displacementMap=E.displacementMap,M.displacementScale=E.displacementScale,M.displacementBias=E.displacementBias,M.wireframeLinewidth=E.wireframeLinewidth,M.linewidth=E.linewidth,A.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const I=n.properties.get(M);I.light=A}return M}function y(w,E,A,_,M){if(w.visible===!1)return;if(w.layers.test(E.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===Ki)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,w.matrixWorld);const L=t.update(w),F=w.material;if(Array.isArray(F)){const C=L.groups;for(let T=0,B=C.length;T<B;T++){const G=C[T],$=F[G.materialIndex];if($&&$.visible){const it=x(w,$,_,M);w.onBeforeShadow(n,w,E,A,L,it,G),n.renderBufferDirect(A,null,L,it,w,G),w.onAfterShadow(n,w,E,A,L,it,G)}}}else if(F.visible){const C=x(w,F,_,M);w.onBeforeShadow(n,w,E,A,L,C,null),n.renderBufferDirect(A,null,L,C,w,null),w.onAfterShadow(n,w,E,A,L,C,null)}}const I=w.children;for(let L=0,F=I.length;L<F;L++)y(I[L],E,A,_,M)}function S(w){w.target.removeEventListener("dispose",S);for(const A in l){const _=l[A],M=w.target.uuid;M in _&&(_[M].dispose(),delete _[M])}}}const aA={[rd]:cd,[ld]:ud,[dd]:fd,[Vs]:hd,[cd]:rd,[ud]:ld,[fd]:dd,[hd]:Vs};function sA(n,t){function e(){let N=!1;const At=new rn;let X=null;const lt=new rn(0,0,0,0);return{setMask:function(Ct){X!==Ct&&!N&&(n.colorMask(Ct,Ct,Ct,Ct),X=Ct)},setLocked:function(Ct){N=Ct},setClear:function(Ct,Dt,Kt,oe,de){de===!0&&(Ct*=oe,Dt*=oe,Kt*=oe),At.set(Ct,Dt,Kt,oe),lt.equals(At)===!1&&(n.clearColor(Ct,Dt,Kt,oe),lt.copy(At))},reset:function(){N=!1,X=null,lt.set(-1,0,0,0)}}}function i(){let N=!1,At=!1,X=null,lt=null,Ct=null;return{setReversed:function(Dt){if(At!==Dt){const Kt=t.get("EXT_clip_control");At?Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.ZERO_TO_ONE_EXT):Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.NEGATIVE_ONE_TO_ONE_EXT);const oe=Ct;Ct=null,this.setClear(oe)}At=Dt},getReversed:function(){return At},setTest:function(Dt){Dt?j(n.DEPTH_TEST):pt(n.DEPTH_TEST)},setMask:function(Dt){X!==Dt&&!N&&(n.depthMask(Dt),X=Dt)},setFunc:function(Dt){if(At&&(Dt=aA[Dt]),lt!==Dt){switch(Dt){case rd:n.depthFunc(n.NEVER);break;case cd:n.depthFunc(n.ALWAYS);break;case ld:n.depthFunc(n.LESS);break;case Vs:n.depthFunc(n.LEQUAL);break;case dd:n.depthFunc(n.EQUAL);break;case hd:n.depthFunc(n.GEQUAL);break;case ud:n.depthFunc(n.GREATER);break;case fd:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}lt=Dt}},setLocked:function(Dt){N=Dt},setClear:function(Dt){Ct!==Dt&&(At&&(Dt=1-Dt),n.clearDepth(Dt),Ct=Dt)},reset:function(){N=!1,X=null,lt=null,Ct=null,At=!1}}}function a(){let N=!1,At=null,X=null,lt=null,Ct=null,Dt=null,Kt=null,oe=null,de=null;return{setTest:function(Qt){N||(Qt?j(n.STENCIL_TEST):pt(n.STENCIL_TEST))},setMask:function(Qt){At!==Qt&&!N&&(n.stencilMask(Qt),At=Qt)},setFunc:function(Qt,we,ze){(X!==Qt||lt!==we||Ct!==ze)&&(n.stencilFunc(Qt,we,ze),X=Qt,lt=we,Ct=ze)},setOp:function(Qt,we,ze){(Dt!==Qt||Kt!==we||oe!==ze)&&(n.stencilOp(Qt,we,ze),Dt=Qt,Kt=we,oe=ze)},setLocked:function(Qt){N=Qt},setClear:function(Qt){de!==Qt&&(n.clearStencil(Qt),de=Qt)},reset:function(){N=!1,At=null,X=null,lt=null,Ct=null,Dt=null,Kt=null,oe=null,de=null}}}const s=new e,o=new i,r=new a,c=new WeakMap,l=new WeakMap;let d={},u={},h=new WeakMap,f=[],m=null,v=!1,g=null,p=null,b=null,x=null,y=null,S=null,w=null,E=new ee(0,0,0),A=0,_=!1,M=null,P=null,I=null,L=null,F=null;const C=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let T=!1,B=0;const G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(G)[1]),T=B>=1):G.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),T=B>=2);let $=null,it={};const ht=n.getParameter(n.SCISSOR_BOX),yt=n.getParameter(n.VIEWPORT),Lt=new rn().fromArray(ht),q=new rn().fromArray(yt);function k(N,At,X,lt){const Ct=new Uint8Array(4),Dt=n.createTexture();n.bindTexture(N,Dt),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Kt=0;Kt<X;Kt++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(At,0,n.RGBA,1,1,lt,0,n.RGBA,n.UNSIGNED_BYTE,Ct):n.texImage2D(At+Kt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ct);return Dt}const Z={};Z[n.TEXTURE_2D]=k(n.TEXTURE_2D,n.TEXTURE_2D,1),Z[n.TEXTURE_CUBE_MAP]=k(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[n.TEXTURE_2D_ARRAY]=k(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Z[n.TEXTURE_3D]=k(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),j(n.DEPTH_TEST),o.setFunc(Vs),ot(!1),at($u),j(n.CULL_FACE),O(ya);function j(N){d[N]!==!0&&(n.enable(N),d[N]=!0)}function pt(N){d[N]!==!1&&(n.disable(N),d[N]=!1)}function dt(N,At){return u[N]!==At?(n.bindFramebuffer(N,At),u[N]=At,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=At),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=At),!0):!1}function _t(N,At){let X=f,lt=!1;if(N){X=h.get(At),X===void 0&&(X=[],h.set(At,X));const Ct=N.textures;if(X.length!==Ct.length||X[0]!==n.COLOR_ATTACHMENT0){for(let Dt=0,Kt=Ct.length;Dt<Kt;Dt++)X[Dt]=n.COLOR_ATTACHMENT0+Dt;X.length=Ct.length,lt=!0}}else X[0]!==n.BACK&&(X[0]=n.BACK,lt=!0);lt&&n.drawBuffers(X)}function Yt(N){return m!==N?(n.useProgram(N),m=N,!0):!1}const J={[Va]:n.FUNC_ADD,[rb]:n.FUNC_SUBTRACT,[cb]:n.FUNC_REVERSE_SUBTRACT};J[lb]=n.MIN,J[db]=n.MAX;const W={[hb]:n.ZERO,[ub]:n.ONE,[fb]:n.SRC_COLOR,[sd]:n.SRC_ALPHA,[yb]:n.SRC_ALPHA_SATURATE,[xb]:n.DST_COLOR,[mb]:n.DST_ALPHA,[pb]:n.ONE_MINUS_SRC_COLOR,[od]:n.ONE_MINUS_SRC_ALPHA,[vb]:n.ONE_MINUS_DST_COLOR,[gb]:n.ONE_MINUS_DST_ALPHA,[Mb]:n.CONSTANT_COLOR,[_b]:n.ONE_MINUS_CONSTANT_COLOR,[bb]:n.CONSTANT_ALPHA,[Sb]:n.ONE_MINUS_CONSTANT_ALPHA};function O(N,At,X,lt,Ct,Dt,Kt,oe,de,Qt){if(N===ya){v===!0&&(pt(n.BLEND),v=!1);return}if(v===!1&&(j(n.BLEND),v=!0),N!==ob){if(N!==g||Qt!==_){if((p!==Va||y!==Va)&&(n.blendEquation(n.FUNC_ADD),p=Va,y=Va),Qt)switch(N){case Fs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Qi:n.blendFunc(n.ONE,n.ONE);break;case Zu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ju:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Fs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Qi:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Zu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ju:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}b=null,x=null,S=null,w=null,E.set(0,0,0),A=0,g=N,_=Qt}return}Ct=Ct||At,Dt=Dt||X,Kt=Kt||lt,(At!==p||Ct!==y)&&(n.blendEquationSeparate(J[At],J[Ct]),p=At,y=Ct),(X!==b||lt!==x||Dt!==S||Kt!==w)&&(n.blendFuncSeparate(W[X],W[lt],W[Dt],W[Kt]),b=X,x=lt,S=Dt,w=Kt),(oe.equals(E)===!1||de!==A)&&(n.blendColor(oe.r,oe.g,oe.b,de),E.copy(oe),A=de),g=N,_=!1}function Pt(N,At){N.side===qe?pt(n.CULL_FACE):j(n.CULL_FACE);let X=N.side===Yn;At&&(X=!X),ot(X),N.blending===Fs&&N.transparent===!1?O(ya):O(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const lt=N.stencilWrite;r.setTest(lt),lt&&(r.setMask(N.stencilWriteMask),r.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),r.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),mt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?j(n.SAMPLE_ALPHA_TO_COVERAGE):pt(n.SAMPLE_ALPHA_TO_COVERAGE)}function ot(N){M!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),M=N)}function at(N){N!==ab?(j(n.CULL_FACE),N!==P&&(N===$u?n.cullFace(n.BACK):N===sb?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):pt(n.CULL_FACE),P=N}function Tt(N){N!==I&&(T&&n.lineWidth(N),I=N)}function mt(N,At,X){N?(j(n.POLYGON_OFFSET_FILL),(L!==At||F!==X)&&(n.polygonOffset(At,X),L=At,F=X)):pt(n.POLYGON_OFFSET_FILL)}function zt(N){N?j(n.SCISSOR_TEST):pt(n.SCISSOR_TEST)}function D(N){N===void 0&&(N=n.TEXTURE0+C-1),$!==N&&(n.activeTexture(N),$=N)}function R(N,At,X){X===void 0&&($===null?X=n.TEXTURE0+C-1:X=$);let lt=it[X];lt===void 0&&(lt={type:void 0,texture:void 0},it[X]=lt),(lt.type!==N||lt.texture!==At)&&($!==X&&(n.activeTexture(X),$=X),n.bindTexture(N,At||Z[N]),lt.type=N,lt.texture=At)}function Q(){const N=it[$];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function ut(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ft(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function st(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function kt(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Et(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function wt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Xt(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function xt(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ut(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function V(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function K(N){Lt.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),Lt.copy(N))}function gt(N){q.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),q.copy(N))}function Nt(N,At){let X=l.get(At);X===void 0&&(X=new WeakMap,l.set(At,X));let lt=X.get(N);lt===void 0&&(lt=n.getUniformBlockIndex(At,N.name),X.set(N,lt))}function Ot(N,At){const lt=l.get(At).get(N);c.get(At)!==lt&&(n.uniformBlockBinding(At,lt,N.__bindingPointIndex),c.set(At,lt))}function It(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},$=null,it={},u={},h=new WeakMap,f=[],m=null,v=!1,g=null,p=null,b=null,x=null,y=null,S=null,w=null,E=new ee(0,0,0),A=0,_=!1,M=null,P=null,I=null,L=null,F=null,Lt.set(0,0,n.canvas.width,n.canvas.height),q.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:j,disable:pt,bindFramebuffer:dt,drawBuffers:_t,useProgram:Yt,setBlending:O,setMaterial:Pt,setFlipSided:ot,setCullFace:at,setLineWidth:Tt,setPolygonOffset:mt,setScissorTest:zt,activeTexture:D,bindTexture:R,unbindTexture:Q,compressedTexImage2D:ut,compressedTexImage3D:ft,texImage2D:Ut,texImage3D:V,updateUBOMapping:Nt,uniformBlockBinding:Ot,texStorage2D:Xt,texStorage3D:xt,texSubImage2D:st,texSubImage3D:kt,compressedTexSubImage2D:Et,compressedTexSubImage3D:wt,scissor:K,viewport:gt,reset:It}}function Wf(n,t,e,i){const a=oA(i);switch(e){case bm:return n*t;case wm:return n*t;case Em:return n*t*2;case mh:return n*t/a.components*a.byteLength;case gh:return n*t/a.components*a.byteLength;case Tm:return n*t*2/a.components*a.byteLength;case xh:return n*t*2/a.components*a.byteLength;case Sm:return n*t*3/a.components*a.byteLength;case wi:return n*t*4/a.components*a.byteLength;case vh:return n*t*4/a.components*a.byteLength;case Yr:case $r:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Zr:case jr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case yd:case _d:return Math.max(n,16)*Math.max(t,8)/4;case vd:case Md:return Math.max(n,8)*Math.max(t,8)/2;case bd:case Sd:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case wd:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ed:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Td:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Ad:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Rd:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Pd:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Cd:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Ld:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Dd:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case kd:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Id:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case zd:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Fd:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Ud:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Nd:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case qr:case Od:case Bd:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Am:case Hd:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Gd:case Xd:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function oA(n){switch(n){case ia:case ym:return{byteLength:1,components:1};case Xo:case Mm:case qo:return{byteLength:2,components:1};case fh:case ph:return{byteLength:2,components:4};case qa:case uh:case Fi:return{byteLength:4,components:1};case _m:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function rA(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Wt,d=new WeakMap;let u;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(D,R){return f?new OffscreenCanvas(D,R):uc("canvas")}function v(D,R,Q){let ut=1;const ft=zt(D);if((ft.width>Q||ft.height>Q)&&(ut=Q/Math.max(ft.width,ft.height)),ut<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const st=Math.floor(ut*ft.width),kt=Math.floor(ut*ft.height);u===void 0&&(u=m(st,kt));const Et=R?m(st,kt):u;return Et.width=st,Et.height=kt,Et.getContext("2d").drawImage(D,0,0,st,kt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ft.width+"x"+ft.height+") to ("+st+"x"+kt+")."),Et}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ft.width+"x"+ft.height+")."),D;return D}function g(D){return D.generateMipmaps}function p(D){n.generateMipmap(D)}function b(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(D,R,Q,ut,ft=!1){if(D!==null){if(n[D]!==void 0)return n[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let st=R;if(R===n.RED&&(Q===n.FLOAT&&(st=n.R32F),Q===n.HALF_FLOAT&&(st=n.R16F),Q===n.UNSIGNED_BYTE&&(st=n.R8)),R===n.RED_INTEGER&&(Q===n.UNSIGNED_BYTE&&(st=n.R8UI),Q===n.UNSIGNED_SHORT&&(st=n.R16UI),Q===n.UNSIGNED_INT&&(st=n.R32UI),Q===n.BYTE&&(st=n.R8I),Q===n.SHORT&&(st=n.R16I),Q===n.INT&&(st=n.R32I)),R===n.RG&&(Q===n.FLOAT&&(st=n.RG32F),Q===n.HALF_FLOAT&&(st=n.RG16F),Q===n.UNSIGNED_BYTE&&(st=n.RG8)),R===n.RG_INTEGER&&(Q===n.UNSIGNED_BYTE&&(st=n.RG8UI),Q===n.UNSIGNED_SHORT&&(st=n.RG16UI),Q===n.UNSIGNED_INT&&(st=n.RG32UI),Q===n.BYTE&&(st=n.RG8I),Q===n.SHORT&&(st=n.RG16I),Q===n.INT&&(st=n.RG32I)),R===n.RGB_INTEGER&&(Q===n.UNSIGNED_BYTE&&(st=n.RGB8UI),Q===n.UNSIGNED_SHORT&&(st=n.RGB16UI),Q===n.UNSIGNED_INT&&(st=n.RGB32UI),Q===n.BYTE&&(st=n.RGB8I),Q===n.SHORT&&(st=n.RGB16I),Q===n.INT&&(st=n.RGB32I)),R===n.RGBA_INTEGER&&(Q===n.UNSIGNED_BYTE&&(st=n.RGBA8UI),Q===n.UNSIGNED_SHORT&&(st=n.RGBA16UI),Q===n.UNSIGNED_INT&&(st=n.RGBA32UI),Q===n.BYTE&&(st=n.RGBA8I),Q===n.SHORT&&(st=n.RGBA16I),Q===n.INT&&(st=n.RGBA32I)),R===n.RGB&&Q===n.UNSIGNED_INT_5_9_9_9_REV&&(st=n.RGB9_E5),R===n.RGBA){const kt=ft?Ec:Ae.getTransfer(ut);Q===n.FLOAT&&(st=n.RGBA32F),Q===n.HALF_FLOAT&&(st=n.RGBA16F),Q===n.UNSIGNED_BYTE&&(st=kt===Oe?n.SRGB8_ALPHA8:n.RGBA8),Q===n.UNSIGNED_SHORT_4_4_4_4&&(st=n.RGBA4),Q===n.UNSIGNED_SHORT_5_5_5_1&&(st=n.RGB5_A1)}return(st===n.R16F||st===n.R32F||st===n.RG16F||st===n.RG32F||st===n.RGBA16F||st===n.RGBA32F)&&t.get("EXT_color_buffer_float"),st}function y(D,R){let Q;return D?R===null||R===qa||R===$s?Q=n.DEPTH24_STENCIL8:R===Fi?Q=n.DEPTH32F_STENCIL8:R===Xo&&(Q=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===qa||R===$s?Q=n.DEPTH_COMPONENT24:R===Fi?Q=n.DEPTH_COMPONENT32F:R===Xo&&(Q=n.DEPTH_COMPONENT16),Q}function S(D,R){return g(D)===!0||D.isFramebufferTexture&&D.minFilter!==oi&&D.minFilter!==zi?Math.log2(Math.max(R.width,R.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?R.mipmaps.length:1}function w(D){const R=D.target;R.removeEventListener("dispose",w),A(R),R.isVideoTexture&&d.delete(R)}function E(D){const R=D.target;R.removeEventListener("dispose",E),M(R)}function A(D){const R=i.get(D);if(R.__webglInit===void 0)return;const Q=D.source,ut=h.get(Q);if(ut){const ft=ut[R.__cacheKey];ft.usedTimes--,ft.usedTimes===0&&_(D),Object.keys(ut).length===0&&h.delete(Q)}i.remove(D)}function _(D){const R=i.get(D);n.deleteTexture(R.__webglTexture);const Q=D.source,ut=h.get(Q);delete ut[R.__cacheKey],o.memory.textures--}function M(D){const R=i.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),i.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let ut=0;ut<6;ut++){if(Array.isArray(R.__webglFramebuffer[ut]))for(let ft=0;ft<R.__webglFramebuffer[ut].length;ft++)n.deleteFramebuffer(R.__webglFramebuffer[ut][ft]);else n.deleteFramebuffer(R.__webglFramebuffer[ut]);R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer[ut])}else{if(Array.isArray(R.__webglFramebuffer))for(let ut=0;ut<R.__webglFramebuffer.length;ut++)n.deleteFramebuffer(R.__webglFramebuffer[ut]);else n.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&n.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let ut=0;ut<R.__webglColorRenderbuffer.length;ut++)R.__webglColorRenderbuffer[ut]&&n.deleteRenderbuffer(R.__webglColorRenderbuffer[ut]);R.__webglDepthRenderbuffer&&n.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const Q=D.textures;for(let ut=0,ft=Q.length;ut<ft;ut++){const st=i.get(Q[ut]);st.__webglTexture&&(n.deleteTexture(st.__webglTexture),o.memory.textures--),i.remove(Q[ut])}i.remove(D)}let P=0;function I(){P=0}function L(){const D=P;return D>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+a.maxTextures),P+=1,D}function F(D){const R=[];return R.push(D.wrapS),R.push(D.wrapT),R.push(D.wrapR||0),R.push(D.magFilter),R.push(D.minFilter),R.push(D.anisotropy),R.push(D.internalFormat),R.push(D.format),R.push(D.type),R.push(D.generateMipmaps),R.push(D.premultiplyAlpha),R.push(D.flipY),R.push(D.unpackAlignment),R.push(D.colorSpace),R.join()}function C(D,R){const Q=i.get(D);if(D.isVideoTexture&&Tt(D),D.isRenderTargetTexture===!1&&D.version>0&&Q.__version!==D.version){const ut=D.image;if(ut===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ut.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(Q,D,R);return}}e.bindTexture(n.TEXTURE_2D,Q.__webglTexture,n.TEXTURE0+R)}function T(D,R){const Q=i.get(D);if(D.version>0&&Q.__version!==D.version){q(Q,D,R);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Q.__webglTexture,n.TEXTURE0+R)}function B(D,R){const Q=i.get(D);if(D.version>0&&Q.__version!==D.version){q(Q,D,R);return}e.bindTexture(n.TEXTURE_3D,Q.__webglTexture,n.TEXTURE0+R)}function G(D,R){const Q=i.get(D);if(D.version>0&&Q.__version!==D.version){k(Q,D,R);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture,n.TEXTURE0+R)}const $={[gd]:n.REPEAT,[Ya]:n.CLAMP_TO_EDGE,[xd]:n.MIRRORED_REPEAT},it={[oi]:n.NEAREST,[kb]:n.NEAREST_MIPMAP_NEAREST,[lr]:n.NEAREST_MIPMAP_LINEAR,[zi]:n.LINEAR,[il]:n.LINEAR_MIPMAP_NEAREST,[$a]:n.LINEAR_MIPMAP_LINEAR},ht={[Ub]:n.NEVER,[Xb]:n.ALWAYS,[Nb]:n.LESS,[Pm]:n.LEQUAL,[Ob]:n.EQUAL,[Gb]:n.GEQUAL,[Bb]:n.GREATER,[Hb]:n.NOTEQUAL};function yt(D,R){if(R.type===Fi&&t.has("OES_texture_float_linear")===!1&&(R.magFilter===zi||R.magFilter===il||R.magFilter===lr||R.magFilter===$a||R.minFilter===zi||R.minFilter===il||R.minFilter===lr||R.minFilter===$a)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,$[R.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,$[R.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,$[R.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,it[R.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,it[R.minFilter]),R.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,ht[R.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===oi||R.minFilter!==lr&&R.minFilter!==$a||R.type===Fi&&t.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||i.get(R).__currentAnisotropy){const Q=t.get("EXT_texture_filter_anisotropic");n.texParameterf(D,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,a.getMaxAnisotropy())),i.get(R).__currentAnisotropy=R.anisotropy}}}function Lt(D,R){let Q=!1;D.__webglInit===void 0&&(D.__webglInit=!0,R.addEventListener("dispose",w));const ut=R.source;let ft=h.get(ut);ft===void 0&&(ft={},h.set(ut,ft));const st=F(R);if(st!==D.__cacheKey){ft[st]===void 0&&(ft[st]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Q=!0),ft[st].usedTimes++;const kt=ft[D.__cacheKey];kt!==void 0&&(ft[D.__cacheKey].usedTimes--,kt.usedTimes===0&&_(R)),D.__cacheKey=st,D.__webglTexture=ft[st].texture}return Q}function q(D,R,Q){let ut=n.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(ut=n.TEXTURE_2D_ARRAY),R.isData3DTexture&&(ut=n.TEXTURE_3D);const ft=Lt(D,R),st=R.source;e.bindTexture(ut,D.__webglTexture,n.TEXTURE0+Q);const kt=i.get(st);if(st.version!==kt.__version||ft===!0){e.activeTexture(n.TEXTURE0+Q);const Et=Ae.getPrimaries(Ae.workingColorSpace),wt=R.colorSpace===pa?null:Ae.getPrimaries(R.colorSpace),Xt=R.colorSpace===pa||Et===wt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);let xt=v(R.image,!1,a.maxTextureSize);xt=mt(R,xt);const Ut=s.convert(R.format,R.colorSpace),V=s.convert(R.type);let K=x(R.internalFormat,Ut,V,R.colorSpace,R.isVideoTexture);yt(ut,R);let gt;const Nt=R.mipmaps,Ot=R.isVideoTexture!==!0,It=kt.__version===void 0||ft===!0,N=st.dataReady,At=S(R,xt);if(R.isDepthTexture)K=y(R.format===Zs,R.type),It&&(Ot?e.texStorage2D(n.TEXTURE_2D,1,K,xt.width,xt.height):e.texImage2D(n.TEXTURE_2D,0,K,xt.width,xt.height,0,Ut,V,null));else if(R.isDataTexture)if(Nt.length>0){Ot&&It&&e.texStorage2D(n.TEXTURE_2D,At,K,Nt[0].width,Nt[0].height);for(let X=0,lt=Nt.length;X<lt;X++)gt=Nt[X],Ot?N&&e.texSubImage2D(n.TEXTURE_2D,X,0,0,gt.width,gt.height,Ut,V,gt.data):e.texImage2D(n.TEXTURE_2D,X,K,gt.width,gt.height,0,Ut,V,gt.data);R.generateMipmaps=!1}else Ot?(It&&e.texStorage2D(n.TEXTURE_2D,At,K,xt.width,xt.height),N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,xt.width,xt.height,Ut,V,xt.data)):e.texImage2D(n.TEXTURE_2D,0,K,xt.width,xt.height,0,Ut,V,xt.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){Ot&&It&&e.texStorage3D(n.TEXTURE_2D_ARRAY,At,K,Nt[0].width,Nt[0].height,xt.depth);for(let X=0,lt=Nt.length;X<lt;X++)if(gt=Nt[X],R.format!==wi)if(Ut!==null)if(Ot){if(N)if(R.layerUpdates.size>0){const Ct=Wf(gt.width,gt.height,R.format,R.type);for(const Dt of R.layerUpdates){const Kt=gt.data.subarray(Dt*Ct/gt.data.BYTES_PER_ELEMENT,(Dt+1)*Ct/gt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,Dt,gt.width,gt.height,1,Ut,Kt)}R.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,0,gt.width,gt.height,xt.depth,Ut,gt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,X,K,gt.width,gt.height,xt.depth,0,gt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ot?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,0,gt.width,gt.height,xt.depth,Ut,V,gt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,X,K,gt.width,gt.height,xt.depth,0,Ut,V,gt.data)}else{Ot&&It&&e.texStorage2D(n.TEXTURE_2D,At,K,Nt[0].width,Nt[0].height);for(let X=0,lt=Nt.length;X<lt;X++)gt=Nt[X],R.format!==wi?Ut!==null?Ot?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,X,0,0,gt.width,gt.height,Ut,gt.data):e.compressedTexImage2D(n.TEXTURE_2D,X,K,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ot?N&&e.texSubImage2D(n.TEXTURE_2D,X,0,0,gt.width,gt.height,Ut,V,gt.data):e.texImage2D(n.TEXTURE_2D,X,K,gt.width,gt.height,0,Ut,V,gt.data)}else if(R.isDataArrayTexture)if(Ot){if(It&&e.texStorage3D(n.TEXTURE_2D_ARRAY,At,K,xt.width,xt.height,xt.depth),N)if(R.layerUpdates.size>0){const X=Wf(xt.width,xt.height,R.format,R.type);for(const lt of R.layerUpdates){const Ct=xt.data.subarray(lt*X/xt.data.BYTES_PER_ELEMENT,(lt+1)*X/xt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,lt,xt.width,xt.height,1,Ut,V,Ct)}R.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,xt.width,xt.height,xt.depth,Ut,V,xt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,K,xt.width,xt.height,xt.depth,0,Ut,V,xt.data);else if(R.isData3DTexture)Ot?(It&&e.texStorage3D(n.TEXTURE_3D,At,K,xt.width,xt.height,xt.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,xt.width,xt.height,xt.depth,Ut,V,xt.data)):e.texImage3D(n.TEXTURE_3D,0,K,xt.width,xt.height,xt.depth,0,Ut,V,xt.data);else if(R.isFramebufferTexture){if(It)if(Ot)e.texStorage2D(n.TEXTURE_2D,At,K,xt.width,xt.height);else{let X=xt.width,lt=xt.height;for(let Ct=0;Ct<At;Ct++)e.texImage2D(n.TEXTURE_2D,Ct,K,X,lt,0,Ut,V,null),X>>=1,lt>>=1}}else if(Nt.length>0){if(Ot&&It){const X=zt(Nt[0]);e.texStorage2D(n.TEXTURE_2D,At,K,X.width,X.height)}for(let X=0,lt=Nt.length;X<lt;X++)gt=Nt[X],Ot?N&&e.texSubImage2D(n.TEXTURE_2D,X,0,0,Ut,V,gt):e.texImage2D(n.TEXTURE_2D,X,K,Ut,V,gt);R.generateMipmaps=!1}else if(Ot){if(It){const X=zt(xt);e.texStorage2D(n.TEXTURE_2D,At,K,X.width,X.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Ut,V,xt)}else e.texImage2D(n.TEXTURE_2D,0,K,Ut,V,xt);g(R)&&p(ut),kt.__version=st.version,R.onUpdate&&R.onUpdate(R)}D.__version=R.version}function k(D,R,Q){if(R.image.length!==6)return;const ut=Lt(D,R),ft=R.source;e.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+Q);const st=i.get(ft);if(ft.version!==st.__version||ut===!0){e.activeTexture(n.TEXTURE0+Q);const kt=Ae.getPrimaries(Ae.workingColorSpace),Et=R.colorSpace===pa?null:Ae.getPrimaries(R.colorSpace),wt=R.colorSpace===pa||kt===Et?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);const Xt=R.isCompressedTexture||R.image[0].isCompressedTexture,xt=R.image[0]&&R.image[0].isDataTexture,Ut=[];for(let lt=0;lt<6;lt++)!Xt&&!xt?Ut[lt]=v(R.image[lt],!0,a.maxCubemapSize):Ut[lt]=xt?R.image[lt].image:R.image[lt],Ut[lt]=mt(R,Ut[lt]);const V=Ut[0],K=s.convert(R.format,R.colorSpace),gt=s.convert(R.type),Nt=x(R.internalFormat,K,gt,R.colorSpace),Ot=R.isVideoTexture!==!0,It=st.__version===void 0||ut===!0,N=ft.dataReady;let At=S(R,V);yt(n.TEXTURE_CUBE_MAP,R);let X;if(Xt){Ot&&It&&e.texStorage2D(n.TEXTURE_CUBE_MAP,At,Nt,V.width,V.height);for(let lt=0;lt<6;lt++){X=Ut[lt].mipmaps;for(let Ct=0;Ct<X.length;Ct++){const Dt=X[Ct];R.format!==wi?K!==null?Ot?N&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ct,0,0,Dt.width,Dt.height,K,Dt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ct,Nt,Dt.width,Dt.height,0,Dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ct,0,0,Dt.width,Dt.height,K,gt,Dt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ct,Nt,Dt.width,Dt.height,0,K,gt,Dt.data)}}}else{if(X=R.mipmaps,Ot&&It){X.length>0&&At++;const lt=zt(Ut[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,At,Nt,lt.width,lt.height)}for(let lt=0;lt<6;lt++)if(xt){Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,Ut[lt].width,Ut[lt].height,K,gt,Ut[lt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,Nt,Ut[lt].width,Ut[lt].height,0,K,gt,Ut[lt].data);for(let Ct=0;Ct<X.length;Ct++){const Kt=X[Ct].image[lt].image;Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ct+1,0,0,Kt.width,Kt.height,K,gt,Kt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ct+1,Nt,Kt.width,Kt.height,0,K,gt,Kt.data)}}else{Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,K,gt,Ut[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,Nt,K,gt,Ut[lt]);for(let Ct=0;Ct<X.length;Ct++){const Dt=X[Ct];Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ct+1,0,0,K,gt,Dt.image[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ct+1,Nt,K,gt,Dt.image[lt])}}}g(R)&&p(n.TEXTURE_CUBE_MAP),st.__version=ft.version,R.onUpdate&&R.onUpdate(R)}D.__version=R.version}function Z(D,R,Q,ut,ft,st){const kt=s.convert(Q.format,Q.colorSpace),Et=s.convert(Q.type),wt=x(Q.internalFormat,kt,Et,Q.colorSpace),Xt=i.get(R),xt=i.get(Q);if(xt.__renderTarget=R,!Xt.__hasExternalTextures){const Ut=Math.max(1,R.width>>st),V=Math.max(1,R.height>>st);ft===n.TEXTURE_3D||ft===n.TEXTURE_2D_ARRAY?e.texImage3D(ft,st,wt,Ut,V,R.depth,0,kt,Et,null):e.texImage2D(ft,st,wt,Ut,V,0,kt,Et,null)}e.bindFramebuffer(n.FRAMEBUFFER,D),at(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ut,ft,xt.__webglTexture,0,ot(R)):(ft===n.TEXTURE_2D||ft>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ft<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ut,ft,xt.__webglTexture,st),e.bindFramebuffer(n.FRAMEBUFFER,null)}function j(D,R,Q){if(n.bindRenderbuffer(n.RENDERBUFFER,D),R.depthBuffer){const ut=R.depthTexture,ft=ut&&ut.isDepthTexture?ut.type:null,st=y(R.stencilBuffer,ft),kt=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Et=ot(R);at(R)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Et,st,R.width,R.height):Q?n.renderbufferStorageMultisample(n.RENDERBUFFER,Et,st,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,st,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,kt,n.RENDERBUFFER,D)}else{const ut=R.textures;for(let ft=0;ft<ut.length;ft++){const st=ut[ft],kt=s.convert(st.format,st.colorSpace),Et=s.convert(st.type),wt=x(st.internalFormat,kt,Et,st.colorSpace),Xt=ot(R);Q&&at(R)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Xt,wt,R.width,R.height):at(R)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Xt,wt,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,wt,R.width,R.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function pt(D,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,D),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ut=i.get(R.depthTexture);ut.__renderTarget=R,(!ut.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),C(R.depthTexture,0);const ft=ut.__webglTexture,st=ot(R);if(R.depthTexture.format===Us)at(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ft,0,st):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ft,0);else if(R.depthTexture.format===Zs)at(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ft,0,st):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ft,0);else throw new Error("Unknown depthTexture format")}function dt(D){const R=i.get(D),Q=D.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==D.depthTexture){const ut=D.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),ut){const ft=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,ut.removeEventListener("dispose",ft)};ut.addEventListener("dispose",ft),R.__depthDisposeCallback=ft}R.__boundDepthTexture=ut}if(D.depthTexture&&!R.__autoAllocateDepthBuffer){if(Q)throw new Error("target.depthTexture not supported in Cube render targets");pt(R.__webglFramebuffer,D)}else if(Q){R.__webglDepthbuffer=[];for(let ut=0;ut<6;ut++)if(e.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer[ut]),R.__webglDepthbuffer[ut]===void 0)R.__webglDepthbuffer[ut]=n.createRenderbuffer(),j(R.__webglDepthbuffer[ut],D,!1);else{const ft=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=R.__webglDepthbuffer[ut];n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,ft,n.RENDERBUFFER,st)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=n.createRenderbuffer(),j(R.__webglDepthbuffer,D,!1);else{const ut=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ft=R.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ft),n.framebufferRenderbuffer(n.FRAMEBUFFER,ut,n.RENDERBUFFER,ft)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function _t(D,R,Q){const ut=i.get(D);R!==void 0&&Z(ut.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Q!==void 0&&dt(D)}function Yt(D){const R=D.texture,Q=i.get(D),ut=i.get(R);D.addEventListener("dispose",E);const ft=D.textures,st=D.isWebGLCubeRenderTarget===!0,kt=ft.length>1;if(kt||(ut.__webglTexture===void 0&&(ut.__webglTexture=n.createTexture()),ut.__version=R.version,o.memory.textures++),st){Q.__webglFramebuffer=[];for(let Et=0;Et<6;Et++)if(R.mipmaps&&R.mipmaps.length>0){Q.__webglFramebuffer[Et]=[];for(let wt=0;wt<R.mipmaps.length;wt++)Q.__webglFramebuffer[Et][wt]=n.createFramebuffer()}else Q.__webglFramebuffer[Et]=n.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){Q.__webglFramebuffer=[];for(let Et=0;Et<R.mipmaps.length;Et++)Q.__webglFramebuffer[Et]=n.createFramebuffer()}else Q.__webglFramebuffer=n.createFramebuffer();if(kt)for(let Et=0,wt=ft.length;Et<wt;Et++){const Xt=i.get(ft[Et]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=n.createTexture(),o.memory.textures++)}if(D.samples>0&&at(D)===!1){Q.__webglMultisampledFramebuffer=n.createFramebuffer(),Q.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Q.__webglMultisampledFramebuffer);for(let Et=0;Et<ft.length;Et++){const wt=ft[Et];Q.__webglColorRenderbuffer[Et]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Q.__webglColorRenderbuffer[Et]);const Xt=s.convert(wt.format,wt.colorSpace),xt=s.convert(wt.type),Ut=x(wt.internalFormat,Xt,xt,wt.colorSpace,D.isXRRenderTarget===!0),V=ot(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,V,Ut,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Et,n.RENDERBUFFER,Q.__webglColorRenderbuffer[Et])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(Q.__webglDepthRenderbuffer=n.createRenderbuffer(),j(Q.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(st){e.bindTexture(n.TEXTURE_CUBE_MAP,ut.__webglTexture),yt(n.TEXTURE_CUBE_MAP,R);for(let Et=0;Et<6;Et++)if(R.mipmaps&&R.mipmaps.length>0)for(let wt=0;wt<R.mipmaps.length;wt++)Z(Q.__webglFramebuffer[Et][wt],D,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Et,wt);else Z(Q.__webglFramebuffer[Et],D,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0);g(R)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(kt){for(let Et=0,wt=ft.length;Et<wt;Et++){const Xt=ft[Et],xt=i.get(Xt);e.bindTexture(n.TEXTURE_2D,xt.__webglTexture),yt(n.TEXTURE_2D,Xt),Z(Q.__webglFramebuffer,D,Xt,n.COLOR_ATTACHMENT0+Et,n.TEXTURE_2D,0),g(Xt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let Et=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Et=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Et,ut.__webglTexture),yt(Et,R),R.mipmaps&&R.mipmaps.length>0)for(let wt=0;wt<R.mipmaps.length;wt++)Z(Q.__webglFramebuffer[wt],D,R,n.COLOR_ATTACHMENT0,Et,wt);else Z(Q.__webglFramebuffer,D,R,n.COLOR_ATTACHMENT0,Et,0);g(R)&&p(Et),e.unbindTexture()}D.depthBuffer&&dt(D)}function J(D){const R=D.textures;for(let Q=0,ut=R.length;Q<ut;Q++){const ft=R[Q];if(g(ft)){const st=b(D),kt=i.get(ft).__webglTexture;e.bindTexture(st,kt),p(st),e.unbindTexture()}}}const W=[],O=[];function Pt(D){if(D.samples>0){if(at(D)===!1){const R=D.textures,Q=D.width,ut=D.height;let ft=n.COLOR_BUFFER_BIT;const st=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,kt=i.get(D),Et=R.length>1;if(Et)for(let wt=0;wt<R.length;wt++)e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,kt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglFramebuffer);for(let wt=0;wt<R.length;wt++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ft|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ft|=n.STENCIL_BUFFER_BIT)),Et){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,kt.__webglColorRenderbuffer[wt]);const Xt=i.get(R[wt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Xt,0)}n.blitFramebuffer(0,0,Q,ut,0,0,Q,ut,ft,n.NEAREST),c===!0&&(W.length=0,O.length=0,W.push(n.COLOR_ATTACHMENT0+wt),D.depthBuffer&&D.resolveDepthBuffer===!1&&(W.push(st),O.push(st),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,O)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,W))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Et)for(let wt=0;wt<R.length;wt++){e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.RENDERBUFFER,kt.__webglColorRenderbuffer[wt]);const Xt=i.get(R[wt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.TEXTURE_2D,Xt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const R=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[R])}}}function ot(D){return Math.min(a.maxSamples,D.samples)}function at(D){const R=i.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function Tt(D){const R=o.render.frame;d.get(D)!==R&&(d.set(D,R),D.update())}function mt(D,R){const Q=D.colorSpace,ut=D.format,ft=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||Q!==qs&&Q!==pa&&(Ae.getTransfer(Q)===Oe?(ut!==wi||ft!==ia)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Q)),R}function zt(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(l.width=D.naturalWidth||D.width,l.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(l.width=D.displayWidth,l.height=D.displayHeight):(l.width=D.width,l.height=D.height),l}this.allocateTextureUnit=L,this.resetTextureUnits=I,this.setTexture2D=C,this.setTexture2DArray=T,this.setTexture3D=B,this.setTextureCube=G,this.rebindTextures=_t,this.setupRenderTarget=Yt,this.updateRenderTargetMipmap=J,this.updateMultisampleRenderTarget=Pt,this.setupDepthRenderbuffer=dt,this.setupFrameBufferTexture=Z,this.useMultisampledRTT=at}function cA(n,t){function e(i,a=pa){let s;const o=Ae.getTransfer(a);if(i===ia)return n.UNSIGNED_BYTE;if(i===fh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ph)return n.UNSIGNED_SHORT_5_5_5_1;if(i===_m)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===ym)return n.BYTE;if(i===Mm)return n.SHORT;if(i===Xo)return n.UNSIGNED_SHORT;if(i===uh)return n.INT;if(i===qa)return n.UNSIGNED_INT;if(i===Fi)return n.FLOAT;if(i===qo)return n.HALF_FLOAT;if(i===bm)return n.ALPHA;if(i===Sm)return n.RGB;if(i===wi)return n.RGBA;if(i===wm)return n.LUMINANCE;if(i===Em)return n.LUMINANCE_ALPHA;if(i===Us)return n.DEPTH_COMPONENT;if(i===Zs)return n.DEPTH_STENCIL;if(i===mh)return n.RED;if(i===gh)return n.RED_INTEGER;if(i===Tm)return n.RG;if(i===xh)return n.RG_INTEGER;if(i===vh)return n.RGBA_INTEGER;if(i===Yr||i===$r||i===Zr||i===jr)if(o===Oe)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Yr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===$r)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Zr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===jr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Yr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===$r)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Zr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===jr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===vd||i===yd||i===Md||i===_d)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===vd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===yd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Md)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===_d)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===bd||i===Sd||i===wd)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===bd||i===Sd)return o===Oe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===wd)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ed||i===Td||i===Ad||i===Rd||i===Pd||i===Cd||i===Ld||i===Dd||i===kd||i===Id||i===zd||i===Fd||i===Ud||i===Nd)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ed)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Td)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ad)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Rd)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Pd)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Cd)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ld)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Dd)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===kd)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Id)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===zd)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Fd)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ud)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Nd)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===qr||i===Od||i===Bd)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===qr)return o===Oe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Od)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Bd)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Am||i===Hd||i===Gd||i===Xd)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===qr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Hd)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Gd)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Xd)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===$s?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class lA extends mi{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class xe extends nn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const dA={type:"move"};class Cl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),p=this._getHandJoint(l,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=d.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&h>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(dA)))}return r!==null&&(r.visible=a!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new xe;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const hA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,uA=`
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

}`;class fA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new In,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new wa({vertexShader:hA,fragmentShader:uA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new me(new Wn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class pA extends Ks{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",c=1,l=null,d=null,u=null,h=null,f=null,m=null;const v=new fA,g=e.getContextAttributes();let p=null,b=null;const x=[],y=[],S=new Wt;let w=null;const E=new mi;E.viewport=new rn;const A=new mi;A.viewport=new rn;const _=[E,A],M=new lA;let P=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let k=x[q];return k===void 0&&(k=new Cl,x[q]=k),k.getTargetRaySpace()},this.getControllerGrip=function(q){let k=x[q];return k===void 0&&(k=new Cl,x[q]=k),k.getGripSpace()},this.getHand=function(q){let k=x[q];return k===void 0&&(k=new Cl,x[q]=k),k.getHandSpace()};function L(q){const k=y.indexOf(q.inputSource);if(k===-1)return;const Z=x[k];Z!==void 0&&(Z.update(q.inputSource,q.frame,l||o),Z.dispatchEvent({type:q.type,data:q.inputSource}))}function F(){a.removeEventListener("select",L),a.removeEventListener("selectstart",L),a.removeEventListener("selectend",L),a.removeEventListener("squeeze",L),a.removeEventListener("squeezestart",L),a.removeEventListener("squeezeend",L),a.removeEventListener("end",F),a.removeEventListener("inputsourceschange",C);for(let q=0;q<x.length;q++){const k=y[q];k!==null&&(y[q]=null,x[q].disconnect(k))}P=null,I=null,v.reset(),t.setRenderTarget(p),f=null,h=null,u=null,a=null,b=null,Lt.stop(),i.isPresenting=!1,t.setPixelRatio(w),t.setSize(S.width,S.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){r=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(q){if(a=q,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",L),a.addEventListener("selectstart",L),a.addEventListener("selectend",L),a.addEventListener("squeeze",L),a.addEventListener("squeezestart",L),a.addEventListener("squeezeend",L),a.addEventListener("end",F),a.addEventListener("inputsourceschange",C),g.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(S),a.renderState.layers===void 0){const k={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(a,e,k),a.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new Ka(f.framebufferWidth,f.framebufferHeight,{format:wi,type:ia,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let k=null,Z=null,j=null;g.depth&&(j=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,k=g.stencil?Zs:Us,Z=g.stencil?$s:qa);const pt={colorFormat:e.RGBA8,depthFormat:j,scaleFactor:s};u=new XRWebGLBinding(a,e),h=u.createProjectionLayer(pt),a.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),b=new Ka(h.textureWidth,h.textureHeight,{format:wi,type:ia,depthTexture:new Hm(h.textureWidth,h.textureHeight,Z,void 0,void 0,void 0,void 0,void 0,void 0,k),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await a.requestReferenceSpace(r),Lt.setContext(a),Lt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function C(q){for(let k=0;k<q.removed.length;k++){const Z=q.removed[k],j=y.indexOf(Z);j>=0&&(y[j]=null,x[j].disconnect(Z))}for(let k=0;k<q.added.length;k++){const Z=q.added[k];let j=y.indexOf(Z);if(j===-1){for(let dt=0;dt<x.length;dt++)if(dt>=y.length){y.push(Z),j=dt;break}else if(y[dt]===null){y[dt]=Z,j=dt;break}if(j===-1)break}const pt=x[j];pt&&pt.connect(Z)}}const T=new Y,B=new Y;function G(q,k,Z){T.setFromMatrixPosition(k.matrixWorld),B.setFromMatrixPosition(Z.matrixWorld);const j=T.distanceTo(B),pt=k.projectionMatrix.elements,dt=Z.projectionMatrix.elements,_t=pt[14]/(pt[10]-1),Yt=pt[14]/(pt[10]+1),J=(pt[9]+1)/pt[5],W=(pt[9]-1)/pt[5],O=(pt[8]-1)/pt[0],Pt=(dt[8]+1)/dt[0],ot=_t*O,at=_t*Pt,Tt=j/(-O+Pt),mt=Tt*-O;if(k.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(mt),q.translateZ(Tt),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),pt[10]===-1)q.projectionMatrix.copy(k.projectionMatrix),q.projectionMatrixInverse.copy(k.projectionMatrixInverse);else{const zt=_t+Tt,D=Yt+Tt,R=ot-mt,Q=at+(j-mt),ut=J*Yt/D*zt,ft=W*Yt/D*zt;q.projectionMatrix.makePerspective(R,Q,ut,ft,zt,D),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function $(q,k){k===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(k.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(a===null)return;let k=q.near,Z=q.far;v.texture!==null&&(v.depthNear>0&&(k=v.depthNear),v.depthFar>0&&(Z=v.depthFar)),M.near=A.near=E.near=k,M.far=A.far=E.far=Z,(P!==M.near||I!==M.far)&&(a.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,I=M.far),E.layers.mask=q.layers.mask|2,A.layers.mask=q.layers.mask|4,M.layers.mask=E.layers.mask|A.layers.mask;const j=q.parent,pt=M.cameras;$(M,j);for(let dt=0;dt<pt.length;dt++)$(pt[dt],j);pt.length===2?G(M,E,A):M.projectionMatrix.copy(E.projectionMatrix),it(q,M,j)};function it(q,k,Z){Z===null?q.matrix.copy(k.matrixWorld):(q.matrix.copy(Z.matrixWorld),q.matrix.invert(),q.matrix.multiply(k.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(k.projectionMatrix),q.projectionMatrixInverse.copy(k.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Vo*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function(q){c=q,h!==null&&(h.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let ht=null;function yt(q,k){if(d=k.getViewerPose(l||o),m=k,d!==null){const Z=d.views;f!==null&&(t.setRenderTargetFramebuffer(b,f.framebuffer),t.setRenderTarget(b));let j=!1;Z.length!==M.cameras.length&&(M.cameras.length=0,j=!0);for(let dt=0;dt<Z.length;dt++){const _t=Z[dt];let Yt=null;if(f!==null)Yt=f.getViewport(_t);else{const W=u.getViewSubImage(h,_t);Yt=W.viewport,dt===0&&(t.setRenderTargetTextures(b,W.colorTexture,h.ignoreDepthValues?void 0:W.depthStencilTexture),t.setRenderTarget(b))}let J=_[dt];J===void 0&&(J=new mi,J.layers.enable(dt),J.viewport=new rn,_[dt]=J),J.matrix.fromArray(_t.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(_t.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(Yt.x,Yt.y,Yt.width,Yt.height),dt===0&&(M.matrix.copy(J.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),j===!0&&M.cameras.push(J)}const pt=a.enabledFeatures;if(pt&&pt.includes("depth-sensing")){const dt=u.getDepthInformation(Z[0]);dt&&dt.isValid&&dt.texture&&v.init(t,dt,a.renderState)}}for(let Z=0;Z<x.length;Z++){const j=y[Z],pt=x[Z];j!==null&&pt!==void 0&&pt.update(j,k,l||o)}ht&&ht(q,k),k.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:k}),m=null}const Lt=new Om;Lt.setAnimationLoop(yt),this.setAnimationLoop=function(q){ht=q},this.dispose=function(){}}}const Fa=new Oi,mA=new Le;function gA(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Fm(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,b,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),d(g,p)):p.isMeshStandardMaterial?(s(g,p),h(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),v(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?c(g,p,b,x):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Yn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Yn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const b=t.get(p),x=b.envMap,y=b.envMapRotation;x&&(g.envMap.value=x,Fa.copy(y),Fa.x*=-1,Fa.y*=-1,Fa.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Fa.y*=-1,Fa.z*=-1),g.envMapRotation.value.setFromMatrix4(mA.makeRotationFromEuler(Fa)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,b,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*b,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function d(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,b){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Yn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=b.texture,g.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const b=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(b.matrixWorld),g.nearDistance.value=b.shadow.camera.near,g.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function xA(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(b,x){const y=x.program;i.uniformBlockBinding(b,y)}function l(b,x){let y=a[b.id];y===void 0&&(m(b),y=d(b),a[b.id]=y,b.addEventListener("dispose",g));const S=x.program;i.updateUBOMapping(b,S);const w=t.render.frame;s[b.id]!==w&&(h(b),s[b.id]=w)}function d(b){const x=u();b.__bindingPointIndex=x;const y=n.createBuffer(),S=b.__size,w=b.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,S,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,y),y}function u(){for(let b=0;b<r;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(b){const x=a[b.id],y=b.uniforms,S=b.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let w=0,E=y.length;w<E;w++){const A=Array.isArray(y[w])?y[w]:[y[w]];for(let _=0,M=A.length;_<M;_++){const P=A[_];if(f(P,w,_,S)===!0){const I=P.__offset,L=Array.isArray(P.value)?P.value:[P.value];let F=0;for(let C=0;C<L.length;C++){const T=L[C],B=v(T);typeof T=="number"||typeof T=="boolean"?(P.__data[0]=T,n.bufferSubData(n.UNIFORM_BUFFER,I+F,P.__data)):T.isMatrix3?(P.__data[0]=T.elements[0],P.__data[1]=T.elements[1],P.__data[2]=T.elements[2],P.__data[3]=0,P.__data[4]=T.elements[3],P.__data[5]=T.elements[4],P.__data[6]=T.elements[5],P.__data[7]=0,P.__data[8]=T.elements[6],P.__data[9]=T.elements[7],P.__data[10]=T.elements[8],P.__data[11]=0):(T.toArray(P.__data,F),F+=B.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(b,x,y,S){const w=b.value,E=x+"_"+y;if(S[E]===void 0)return typeof w=="number"||typeof w=="boolean"?S[E]=w:S[E]=w.clone(),!0;{const A=S[E];if(typeof w=="number"||typeof w=="boolean"){if(A!==w)return S[E]=w,!0}else if(A.equals(w)===!1)return A.copy(w),!0}return!1}function m(b){const x=b.uniforms;let y=0;const S=16;for(let E=0,A=x.length;E<A;E++){const _=Array.isArray(x[E])?x[E]:[x[E]];for(let M=0,P=_.length;M<P;M++){const I=_[M],L=Array.isArray(I.value)?I.value:[I.value];for(let F=0,C=L.length;F<C;F++){const T=L[F],B=v(T),G=y%S,$=G%B.boundary,it=G+$;y+=$,it!==0&&S-it<B.storage&&(y+=S-it),I.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=y,y+=B.storage}}}const w=y%S;return w>0&&(y+=S-w),b.__size=y,b.__cache={},this}function v(b){const x={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(x.boundary=4,x.storage=4):b.isVector2?(x.boundary=8,x.storage=8):b.isVector3||b.isColor?(x.boundary=16,x.storage=12):b.isVector4?(x.boundary=16,x.storage=16):b.isMatrix3?(x.boundary=48,x.storage=48):b.isMatrix4?(x.boundary=64,x.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),x}function g(b){const x=b.target;x.removeEventListener("dispose",g);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const b in a)n.deleteBuffer(a[b]);o=[],a={},s={}}return{bind:c,update:l,dispose:p}}class vA{constructor(t={}){const{canvas:e=o1(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const b=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Hn,this.toneMapping=Ma,this.toneMappingExposure=1;const y=this;let S=!1,w=0,E=0,A=null,_=-1,M=null;const P=new rn,I=new rn;let L=null;const F=new ee(0);let C=0,T=e.width,B=e.height,G=1,$=null,it=null;const ht=new rn(0,0,T,B),yt=new rn(0,0,T,B);let Lt=!1;const q=new bh;let k=!1,Z=!1;const j=new Le,pt=new Le,dt=new Y,_t=new rn,Yt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let J=!1;function W(){return A===null?G:1}let O=i;function Pt(z,nt){return e.getContext(z,nt)}try{const z={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${dh}`),e.addEventListener("webglcontextlost",lt,!1),e.addEventListener("webglcontextrestored",Ct,!1),e.addEventListener("webglcontextcreationerror",Dt,!1),O===null){const nt="webgl2";if(O=Pt(nt,z),O===null)throw Pt(nt)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(z){throw console.error("THREE.WebGLRenderer: "+z.message),z}let ot,at,Tt,mt,zt,D,R,Q,ut,ft,st,kt,Et,wt,Xt,xt,Ut,V,K,gt,Nt,Ot,It,N;function At(){ot=new SE(O),ot.init(),Ot=new cA(O,ot),at=new xE(O,ot,t,Ot),Tt=new sA(O,ot),at.reverseDepthBuffer&&h&&Tt.buffers.depth.setReversed(!0),mt=new TE(O),zt=new VT,D=new rA(O,ot,Tt,zt,at,Ot,mt),R=new yE(y),Q=new bE(y),ut=new k1(O),It=new mE(O,ut),ft=new wE(O,ut,mt,It),st=new RE(O,ft,ut,mt),K=new AE(O,at,D),xt=new vE(zt),kt=new XT(y,R,Q,ot,at,It,xt),Et=new gA(y,zt),wt=new YT,Xt=new JT(ot),V=new pE(y,R,Q,Tt,st,f,c),Ut=new iA(y,st,at),N=new xA(O,mt,at,Tt),gt=new gE(O,ot,mt),Nt=new EE(O,ot,mt),mt.programs=kt.programs,y.capabilities=at,y.extensions=ot,y.properties=zt,y.renderLists=wt,y.shadowMap=Ut,y.state=Tt,y.info=mt}At();const X=new pA(y,O);this.xr=X,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const z=ot.get("WEBGL_lose_context");z&&z.loseContext()},this.forceContextRestore=function(){const z=ot.get("WEBGL_lose_context");z&&z.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(z){z!==void 0&&(G=z,this.setSize(T,B,!1))},this.getSize=function(z){return z.set(T,B)},this.setSize=function(z,nt,ct=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}T=z,B=nt,e.width=Math.floor(z*G),e.height=Math.floor(nt*G),ct===!0&&(e.style.width=z+"px",e.style.height=nt+"px"),this.setViewport(0,0,z,nt)},this.getDrawingBufferSize=function(z){return z.set(T*G,B*G).floor()},this.setDrawingBufferSize=function(z,nt,ct){T=z,B=nt,G=ct,e.width=Math.floor(z*ct),e.height=Math.floor(nt*ct),this.setViewport(0,0,z,nt)},this.getCurrentViewport=function(z){return z.copy(P)},this.getViewport=function(z){return z.copy(ht)},this.setViewport=function(z,nt,ct,rt){z.isVector4?ht.set(z.x,z.y,z.z,z.w):ht.set(z,nt,ct,rt),Tt.viewport(P.copy(ht).multiplyScalar(G).round())},this.getScissor=function(z){return z.copy(yt)},this.setScissor=function(z,nt,ct,rt){z.isVector4?yt.set(z.x,z.y,z.z,z.w):yt.set(z,nt,ct,rt),Tt.scissor(I.copy(yt).multiplyScalar(G).round())},this.getScissorTest=function(){return Lt},this.setScissorTest=function(z){Tt.setScissorTest(Lt=z)},this.setOpaqueSort=function(z){$=z},this.setTransparentSort=function(z){it=z},this.getClearColor=function(z){return z.copy(V.getClearColor())},this.setClearColor=function(){V.setClearColor.apply(V,arguments)},this.getClearAlpha=function(){return V.getClearAlpha()},this.setClearAlpha=function(){V.setClearAlpha.apply(V,arguments)},this.clear=function(z=!0,nt=!0,ct=!0){let rt=0;if(z){let tt=!1;if(A!==null){const Ft=A.texture.format;tt=Ft===vh||Ft===xh||Ft===gh}if(tt){const Ft=A.texture.type,Gt=Ft===ia||Ft===qa||Ft===Xo||Ft===$s||Ft===fh||Ft===ph,Zt=V.getClearColor(),qt=V.getClearAlpha(),se=Zt.r,ie=Zt.g,Jt=Zt.b;Gt?(m[0]=se,m[1]=ie,m[2]=Jt,m[3]=qt,O.clearBufferuiv(O.COLOR,0,m)):(v[0]=se,v[1]=ie,v[2]=Jt,v[3]=qt,O.clearBufferiv(O.COLOR,0,v))}else rt|=O.COLOR_BUFFER_BIT}nt&&(rt|=O.DEPTH_BUFFER_BIT),ct&&(rt|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(rt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",lt,!1),e.removeEventListener("webglcontextrestored",Ct,!1),e.removeEventListener("webglcontextcreationerror",Dt,!1),wt.dispose(),Xt.dispose(),zt.dispose(),R.dispose(),Q.dispose(),st.dispose(),It.dispose(),N.dispose(),kt.dispose(),X.dispose(),X.removeEventListener("sessionstart",Je),X.removeEventListener("sessionend",Mn),Pe.stop()};function lt(z){z.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function Ct(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const z=mt.autoReset,nt=Ut.enabled,ct=Ut.autoUpdate,rt=Ut.needsUpdate,tt=Ut.type;At(),mt.autoReset=z,Ut.enabled=nt,Ut.autoUpdate=ct,Ut.needsUpdate=rt,Ut.type=tt}function Dt(z){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",z.statusMessage)}function Kt(z){const nt=z.target;nt.removeEventListener("dispose",Kt),oe(nt)}function oe(z){de(z),zt.remove(z)}function de(z){const nt=zt.get(z).programs;nt!==void 0&&(nt.forEach(function(ct){kt.releaseProgram(ct)}),z.isShaderMaterial&&kt.releaseShaderCache(z))}this.renderBufferDirect=function(z,nt,ct,rt,tt,Ft){nt===null&&(nt=Yt);const Gt=tt.isMesh&&tt.matrixWorld.determinant()<0,Zt=ri(z,nt,ct,rt,tt);Tt.setMaterial(rt,Gt);let qt=ct.index,se=1;if(rt.wireframe===!0){if(qt=ft.getWireframeAttribute(ct),qt===void 0)return;se=2}const ie=ct.drawRange,Jt=ct.attributes.position;let ve=ie.start*se,re=(ie.start+ie.count)*se;Ft!==null&&(ve=Math.max(ve,Ft.start*se),re=Math.min(re,(Ft.start+Ft.count)*se)),qt!==null?(ve=Math.max(ve,0),re=Math.min(re,qt.count)):Jt!=null&&(ve=Math.max(ve,0),re=Math.min(re,Jt.count));const H=re-ve;if(H<0||H===1/0)return;It.setup(tt,rt,Zt,ct,qt);let Rt,St=gt;if(qt!==null&&(Rt=ut.get(qt),St=Nt,St.setIndex(Rt)),tt.isMesh)rt.wireframe===!0?(Tt.setLineWidth(rt.wireframeLinewidth*W()),St.setMode(O.LINES)):St.setMode(O.TRIANGLES);else if(tt.isLine){let bt=rt.linewidth;bt===void 0&&(bt=1),Tt.setLineWidth(bt*W()),tt.isLineSegments?St.setMode(O.LINES):tt.isLineLoop?St.setMode(O.LINE_LOOP):St.setMode(O.LINE_STRIP)}else tt.isPoints?St.setMode(O.POINTS):tt.isSprite&&St.setMode(O.TRIANGLES);if(tt.isBatchedMesh)if(tt._multiDrawInstances!==null)St.renderMultiDrawInstances(tt._multiDrawStarts,tt._multiDrawCounts,tt._multiDrawCount,tt._multiDrawInstances);else if(ot.get("WEBGL_multi_draw"))St.renderMultiDraw(tt._multiDrawStarts,tt._multiDrawCounts,tt._multiDrawCount);else{const bt=tt._multiDrawStarts,te=tt._multiDrawCounts,Bt=tt._multiDrawCount,le=qt?ut.get(qt).bytesPerElement:1,Re=zt.get(rt).currentProgram.getUniforms();for(let Se=0;Se<Bt;Se++)Re.setValue(O,"_gl_DrawID",Se),St.render(bt[Se]/le,te[Se])}else if(tt.isInstancedMesh)St.renderInstances(ve,H,tt.count);else if(ct.isInstancedBufferGeometry){const bt=ct._maxInstanceCount!==void 0?ct._maxInstanceCount:1/0,te=Math.min(ct.instanceCount,bt);St.renderInstances(ve,H,te)}else St.render(ve,H)};function Qt(z,nt,ct){z.transparent===!0&&z.side===qe&&z.forceSinglePass===!1?(z.side=Yn,z.needsUpdate=!0,_n(z,nt,ct),z.side=Sa,z.needsUpdate=!0,_n(z,nt,ct),z.side=qe):_n(z,nt,ct)}this.compile=function(z,nt,ct=null){ct===null&&(ct=z),p=Xt.get(ct),p.init(nt),x.push(p),ct.traverseVisible(function(tt){tt.isLight&&tt.layers.test(nt.layers)&&(p.pushLight(tt),tt.castShadow&&p.pushShadow(tt))}),z!==ct&&z.traverseVisible(function(tt){tt.isLight&&tt.layers.test(nt.layers)&&(p.pushLight(tt),tt.castShadow&&p.pushShadow(tt))}),p.setupLights();const rt=new Set;return z.traverse(function(tt){if(!(tt.isMesh||tt.isPoints||tt.isLine||tt.isSprite))return;const Ft=tt.material;if(Ft)if(Array.isArray(Ft))for(let Gt=0;Gt<Ft.length;Gt++){const Zt=Ft[Gt];Qt(Zt,ct,tt),rt.add(Zt)}else Qt(Ft,ct,tt),rt.add(Ft)}),x.pop(),p=null,rt},this.compileAsync=function(z,nt,ct=null){const rt=this.compile(z,nt,ct);return new Promise(tt=>{function Ft(){if(rt.forEach(function(Gt){zt.get(Gt).currentProgram.isReady()&&rt.delete(Gt)}),rt.size===0){tt(z);return}setTimeout(Ft,10)}ot.get("KHR_parallel_shader_compile")!==null?Ft():setTimeout(Ft,10)})};let we=null;function ze(z){we&&we(z)}function Je(){Pe.stop()}function Mn(){Pe.start()}const Pe=new Om;Pe.setAnimationLoop(ze),typeof self<"u"&&Pe.setContext(self),this.setAnimationLoop=function(z){we=z,X.setAnimationLoop(z),z===null?Pe.stop():Pe.start()},X.addEventListener("sessionstart",Je),X.addEventListener("sessionend",Mn),this.render=function(z,nt){if(nt!==void 0&&nt.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),nt.parent===null&&nt.matrixWorldAutoUpdate===!0&&nt.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(nt),nt=X.getCamera()),z.isScene===!0&&z.onBeforeRender(y,z,nt,A),p=Xt.get(z,x.length),p.init(nt),x.push(p),pt.multiplyMatrices(nt.projectionMatrix,nt.matrixWorldInverse),q.setFromProjectionMatrix(pt),Z=this.localClippingEnabled,k=xt.init(this.clippingPlanes,Z),g=wt.get(z,b.length),g.init(),b.push(g),X.enabled===!0&&X.isPresenting===!0){const Ft=y.xr.getDepthSensingMesh();Ft!==null&&Fe(Ft,nt,-1/0,y.sortObjects)}Fe(z,nt,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort($,it),J=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,J&&V.addToRenderList(g,z),this.info.render.frame++,k===!0&&xt.beginShadows();const ct=p.state.shadowsArray;Ut.render(ct,z,nt),k===!0&&xt.endShadows(),this.info.autoReset===!0&&this.info.reset();const rt=g.opaque,tt=g.transmissive;if(p.setupLights(),nt.isArrayCamera){const Ft=nt.cameras;if(tt.length>0)for(let Gt=0,Zt=Ft.length;Gt<Zt;Gt++){const qt=Ft[Gt];Xn(rt,tt,z,qt)}J&&V.render(z);for(let Gt=0,Zt=Ft.length;Gt<Zt;Gt++){const qt=Ft[Gt];mn(g,z,qt,qt.viewport)}}else tt.length>0&&Xn(rt,tt,z,nt),J&&V.render(z),mn(g,z,nt);A!==null&&(D.updateMultisampleRenderTarget(A),D.updateRenderTargetMipmap(A)),z.isScene===!0&&z.onAfterRender(y,z,nt),It.resetDefaultState(),_=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],k===!0&&xt.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?g=b[b.length-1]:g=null};function Fe(z,nt,ct,rt){if(z.visible===!1)return;if(z.layers.test(nt.layers)){if(z.isGroup)ct=z.renderOrder;else if(z.isLOD)z.autoUpdate===!0&&z.update(nt);else if(z.isLight)p.pushLight(z),z.castShadow&&p.pushShadow(z);else if(z.isSprite){if(!z.frustumCulled||q.intersectsSprite(z)){rt&&_t.setFromMatrixPosition(z.matrixWorld).applyMatrix4(pt);const Gt=st.update(z),Zt=z.material;Zt.visible&&g.push(z,Gt,Zt,ct,_t.z,null)}}else if((z.isMesh||z.isLine||z.isPoints)&&(!z.frustumCulled||q.intersectsObject(z))){const Gt=st.update(z),Zt=z.material;if(rt&&(z.boundingSphere!==void 0?(z.boundingSphere===null&&z.computeBoundingSphere(),_t.copy(z.boundingSphere.center)):(Gt.boundingSphere===null&&Gt.computeBoundingSphere(),_t.copy(Gt.boundingSphere.center)),_t.applyMatrix4(z.matrixWorld).applyMatrix4(pt)),Array.isArray(Zt)){const qt=Gt.groups;for(let se=0,ie=qt.length;se<ie;se++){const Jt=qt[se],ve=Zt[Jt.materialIndex];ve&&ve.visible&&g.push(z,Gt,ve,ct,_t.z,Jt)}}else Zt.visible&&g.push(z,Gt,Zt,ct,_t.z,null)}}const Ft=z.children;for(let Gt=0,Zt=Ft.length;Gt<Zt;Gt++)Fe(Ft[Gt],nt,ct,rt)}function mn(z,nt,ct,rt){const tt=z.opaque,Ft=z.transmissive,Gt=z.transparent;p.setupLightsView(ct),k===!0&&xt.setGlobalState(y.clippingPlanes,ct),rt&&Tt.viewport(P.copy(rt)),tt.length>0&&sn(tt,nt,ct),Ft.length>0&&sn(Ft,nt,ct),Gt.length>0&&sn(Gt,nt,ct),Tt.buffers.depth.setTest(!0),Tt.buffers.depth.setMask(!0),Tt.buffers.color.setMask(!0),Tt.setPolygonOffset(!1)}function Xn(z,nt,ct,rt){if((ct.isScene===!0?ct.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[rt.id]===void 0&&(p.state.transmissionRenderTarget[rt.id]=new Ka(1,1,{generateMipmaps:!0,type:ot.has("EXT_color_buffer_half_float")||ot.has("EXT_color_buffer_float")?qo:ia,minFilter:$a,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ae.workingColorSpace}));const Ft=p.state.transmissionRenderTarget[rt.id],Gt=rt.viewport||P;Ft.setSize(Gt.z,Gt.w);const Zt=y.getRenderTarget();y.setRenderTarget(Ft),y.getClearColor(F),C=y.getClearAlpha(),C<1&&y.setClearColor(16777215,.5),y.clear(),J&&V.render(ct);const qt=y.toneMapping;y.toneMapping=Ma;const se=rt.viewport;if(rt.viewport!==void 0&&(rt.viewport=void 0),p.setupLightsView(rt),k===!0&&xt.setGlobalState(y.clippingPlanes,rt),sn(z,ct,rt),D.updateMultisampleRenderTarget(Ft),D.updateRenderTargetMipmap(Ft),ot.has("WEBGL_multisampled_render_to_texture")===!1){let ie=!1;for(let Jt=0,ve=nt.length;Jt<ve;Jt++){const re=nt[Jt],H=re.object,Rt=re.geometry,St=re.material,bt=re.group;if(St.side===qe&&H.layers.test(rt.layers)){const te=St.side;St.side=Yn,St.needsUpdate=!0,An(H,ct,rt,Rt,St,bt),St.side=te,St.needsUpdate=!0,ie=!0}}ie===!0&&(D.updateMultisampleRenderTarget(Ft),D.updateRenderTargetMipmap(Ft))}y.setRenderTarget(Zt),y.setClearColor(F,C),se!==void 0&&(rt.viewport=se),y.toneMapping=qt}function sn(z,nt,ct){const rt=nt.isScene===!0?nt.overrideMaterial:null;for(let tt=0,Ft=z.length;tt<Ft;tt++){const Gt=z[tt],Zt=Gt.object,qt=Gt.geometry,se=rt===null?Gt.material:rt,ie=Gt.group;Zt.layers.test(ct.layers)&&An(Zt,nt,ct,qt,se,ie)}}function An(z,nt,ct,rt,tt,Ft){z.onBeforeRender(y,nt,ct,rt,tt,Ft),z.modelViewMatrix.multiplyMatrices(ct.matrixWorldInverse,z.matrixWorld),z.normalMatrix.getNormalMatrix(z.modelViewMatrix),tt.onBeforeRender(y,nt,ct,rt,z,Ft),tt.transparent===!0&&tt.side===qe&&tt.forceSinglePass===!1?(tt.side=Yn,tt.needsUpdate=!0,y.renderBufferDirect(ct,nt,rt,tt,z,Ft),tt.side=Sa,tt.needsUpdate=!0,y.renderBufferDirect(ct,nt,rt,tt,z,Ft),tt.side=qe):y.renderBufferDirect(ct,nt,rt,tt,z,Ft),z.onAfterRender(y,nt,ct,rt,tt,Ft)}function _n(z,nt,ct){nt.isScene!==!0&&(nt=Yt);const rt=zt.get(z),tt=p.state.lights,Ft=p.state.shadowsArray,Gt=tt.state.version,Zt=kt.getParameters(z,tt.state,Ft,nt,ct),qt=kt.getProgramCacheKey(Zt);let se=rt.programs;rt.environment=z.isMeshStandardMaterial?nt.environment:null,rt.fog=nt.fog,rt.envMap=(z.isMeshStandardMaterial?Q:R).get(z.envMap||rt.environment),rt.envMapRotation=rt.environment!==null&&z.envMap===null?nt.environmentRotation:z.envMapRotation,se===void 0&&(z.addEventListener("dispose",Kt),se=new Map,rt.programs=se);let ie=se.get(qt);if(ie!==void 0){if(rt.currentProgram===ie&&rt.lightsStateVersion===Gt)return Zn(z,Zt),ie}else Zt.uniforms=kt.getUniforms(z),z.onBeforeCompile(Zt,y),ie=kt.acquireProgram(Zt,qt),se.set(qt,ie),rt.uniforms=Zt.uniforms;const Jt=rt.uniforms;return(!z.isShaderMaterial&&!z.isRawShaderMaterial||z.clipping===!0)&&(Jt.clippingPlanes=xt.uniform),Zn(z,Zt),rt.needsLights=Pn(z),rt.lightsStateVersion=Gt,rt.needsLights&&(Jt.ambientLightColor.value=tt.state.ambient,Jt.lightProbe.value=tt.state.probe,Jt.directionalLights.value=tt.state.directional,Jt.directionalLightShadows.value=tt.state.directionalShadow,Jt.spotLights.value=tt.state.spot,Jt.spotLightShadows.value=tt.state.spotShadow,Jt.rectAreaLights.value=tt.state.rectArea,Jt.ltc_1.value=tt.state.rectAreaLTC1,Jt.ltc_2.value=tt.state.rectAreaLTC2,Jt.pointLights.value=tt.state.point,Jt.pointLightShadows.value=tt.state.pointShadow,Jt.hemisphereLights.value=tt.state.hemi,Jt.directionalShadowMap.value=tt.state.directionalShadowMap,Jt.directionalShadowMatrix.value=tt.state.directionalShadowMatrix,Jt.spotShadowMap.value=tt.state.spotShadowMap,Jt.spotLightMatrix.value=tt.state.spotLightMatrix,Jt.spotLightMap.value=tt.state.spotLightMap,Jt.pointShadowMap.value=tt.state.pointShadowMap,Jt.pointShadowMatrix.value=tt.state.pointShadowMatrix),rt.currentProgram=ie,rt.uniformsList=null,ie}function $n(z){if(z.uniformsList===null){const nt=z.currentProgram.getUniforms();z.uniformsList=Kr.seqWithValue(nt.seq,z.uniforms)}return z.uniformsList}function Zn(z,nt){const ct=zt.get(z);ct.outputColorSpace=nt.outputColorSpace,ct.batching=nt.batching,ct.batchingColor=nt.batchingColor,ct.instancing=nt.instancing,ct.instancingColor=nt.instancingColor,ct.instancingMorph=nt.instancingMorph,ct.skinning=nt.skinning,ct.morphTargets=nt.morphTargets,ct.morphNormals=nt.morphNormals,ct.morphColors=nt.morphColors,ct.morphTargetsCount=nt.morphTargetsCount,ct.numClippingPlanes=nt.numClippingPlanes,ct.numIntersection=nt.numClipIntersection,ct.vertexAlphas=nt.vertexAlphas,ct.vertexTangents=nt.vertexTangents,ct.toneMapping=nt.toneMapping}function ri(z,nt,ct,rt,tt){nt.isScene!==!0&&(nt=Yt),D.resetTextureUnits();const Ft=nt.fog,Gt=rt.isMeshStandardMaterial?nt.environment:null,Zt=A===null?y.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:qs,qt=(rt.isMeshStandardMaterial?Q:R).get(rt.envMap||Gt),se=rt.vertexColors===!0&&!!ct.attributes.color&&ct.attributes.color.itemSize===4,ie=!!ct.attributes.tangent&&(!!rt.normalMap||rt.anisotropy>0),Jt=!!ct.morphAttributes.position,ve=!!ct.morphAttributes.normal,re=!!ct.morphAttributes.color;let H=Ma;rt.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(H=y.toneMapping);const Rt=ct.morphAttributes.position||ct.morphAttributes.normal||ct.morphAttributes.color,St=Rt!==void 0?Rt.length:0,bt=zt.get(rt),te=p.state.lights;if(k===!0&&(Z===!0||z!==M)){const Ve=z===M&&rt.id===_;xt.setState(rt,z,Ve)}let Bt=!1;rt.version===bt.__version?(bt.needsLights&&bt.lightsStateVersion!==te.state.version||bt.outputColorSpace!==Zt||tt.isBatchedMesh&&bt.batching===!1||!tt.isBatchedMesh&&bt.batching===!0||tt.isBatchedMesh&&bt.batchingColor===!0&&tt.colorTexture===null||tt.isBatchedMesh&&bt.batchingColor===!1&&tt.colorTexture!==null||tt.isInstancedMesh&&bt.instancing===!1||!tt.isInstancedMesh&&bt.instancing===!0||tt.isSkinnedMesh&&bt.skinning===!1||!tt.isSkinnedMesh&&bt.skinning===!0||tt.isInstancedMesh&&bt.instancingColor===!0&&tt.instanceColor===null||tt.isInstancedMesh&&bt.instancingColor===!1&&tt.instanceColor!==null||tt.isInstancedMesh&&bt.instancingMorph===!0&&tt.morphTexture===null||tt.isInstancedMesh&&bt.instancingMorph===!1&&tt.morphTexture!==null||bt.envMap!==qt||rt.fog===!0&&bt.fog!==Ft||bt.numClippingPlanes!==void 0&&(bt.numClippingPlanes!==xt.numPlanes||bt.numIntersection!==xt.numIntersection)||bt.vertexAlphas!==se||bt.vertexTangents!==ie||bt.morphTargets!==Jt||bt.morphNormals!==ve||bt.morphColors!==re||bt.toneMapping!==H||bt.morphTargetsCount!==St)&&(Bt=!0):(Bt=!0,bt.__version=rt.version);let le=bt.currentProgram;Bt===!0&&(le=_n(rt,nt,tt));let Re=!1,Se=!1,Ce=!1;const ye=le.getUniforms(),ge=bt.uniforms;if(Tt.useProgram(le.program)&&(Re=!0,Se=!0,Ce=!0),rt.id!==_&&(_=rt.id,Se=!0),Re||M!==z){Tt.buffers.depth.getReversed()?(j.copy(z.projectionMatrix),c1(j),l1(j),ye.setValue(O,"projectionMatrix",j)):ye.setValue(O,"projectionMatrix",z.projectionMatrix),ye.setValue(O,"viewMatrix",z.matrixWorldInverse);const ln=ye.map.cameraPosition;ln!==void 0&&ln.setValue(O,dt.setFromMatrixPosition(z.matrixWorld)),at.logarithmicDepthBuffer&&ye.setValue(O,"logDepthBufFC",2/(Math.log(z.far+1)/Math.LN2)),(rt.isMeshPhongMaterial||rt.isMeshToonMaterial||rt.isMeshLambertMaterial||rt.isMeshBasicMaterial||rt.isMeshStandardMaterial||rt.isShaderMaterial)&&ye.setValue(O,"isOrthographic",z.isOrthographicCamera===!0),M!==z&&(M=z,Se=!0,Ce=!0)}if(tt.isSkinnedMesh){ye.setOptional(O,tt,"bindMatrix"),ye.setOptional(O,tt,"bindMatrixInverse");const Ve=tt.skeleton;Ve&&(Ve.boneTexture===null&&Ve.computeBoneTexture(),ye.setValue(O,"boneTexture",Ve.boneTexture,D))}tt.isBatchedMesh&&(ye.setOptional(O,tt,"batchingTexture"),ye.setValue(O,"batchingTexture",tt._matricesTexture,D),ye.setOptional(O,tt,"batchingIdTexture"),ye.setValue(O,"batchingIdTexture",tt._indirectTexture,D),ye.setOptional(O,tt,"batchingColorTexture"),tt._colorsTexture!==null&&ye.setValue(O,"batchingColorTexture",tt._colorsTexture,D));const Te=ct.morphAttributes;if((Te.position!==void 0||Te.normal!==void 0||Te.color!==void 0)&&K.update(tt,ct,le),(Se||bt.receiveShadow!==tt.receiveShadow)&&(bt.receiveShadow=tt.receiveShadow,ye.setValue(O,"receiveShadow",tt.receiveShadow)),rt.isMeshGouraudMaterial&&rt.envMap!==null&&(ge.envMap.value=qt,ge.flipEnvMap.value=qt.isCubeTexture&&qt.isRenderTargetTexture===!1?-1:1),rt.isMeshStandardMaterial&&rt.envMap===null&&nt.environment!==null&&(ge.envMapIntensity.value=nt.environmentIntensity),Se&&(ye.setValue(O,"toneMappingExposure",y.toneMappingExposure),bt.needsLights&&Ei(ge,Ce),Ft&&rt.fog===!0&&Et.refreshFogUniforms(ge,Ft),Et.refreshMaterialUniforms(ge,rt,G,B,p.state.transmissionRenderTarget[z.id]),Kr.upload(O,$n(bt),ge,D)),rt.isShaderMaterial&&rt.uniformsNeedUpdate===!0&&(Kr.upload(O,$n(bt),ge,D),rt.uniformsNeedUpdate=!1),rt.isSpriteMaterial&&ye.setValue(O,"center",tt.center),ye.setValue(O,"modelViewMatrix",tt.modelViewMatrix),ye.setValue(O,"normalMatrix",tt.normalMatrix),ye.setValue(O,"modelMatrix",tt.matrixWorld),rt.isShaderMaterial||rt.isRawShaderMaterial){const Ve=rt.uniformsGroups;for(let ln=0,bn=Ve.length;ln<bn;ln++){const ci=Ve[ln];N.update(ci,le),N.bind(ci,le)}}return le}function Ei(z,nt){z.ambientLightColor.needsUpdate=nt,z.lightProbe.needsUpdate=nt,z.directionalLights.needsUpdate=nt,z.directionalLightShadows.needsUpdate=nt,z.pointLights.needsUpdate=nt,z.pointLightShadows.needsUpdate=nt,z.spotLights.needsUpdate=nt,z.spotLightShadows.needsUpdate=nt,z.rectAreaLights.needsUpdate=nt,z.hemisphereLights.needsUpdate=nt}function Pn(z){return z.isMeshLambertMaterial||z.isMeshToonMaterial||z.isMeshPhongMaterial||z.isMeshStandardMaterial||z.isShadowMaterial||z.isShaderMaterial&&z.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(z,nt,ct){zt.get(z.texture).__webglTexture=nt,zt.get(z.depthTexture).__webglTexture=ct;const rt=zt.get(z);rt.__hasExternalTextures=!0,rt.__autoAllocateDepthBuffer=ct===void 0,rt.__autoAllocateDepthBuffer||ot.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),rt.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(z,nt){const ct=zt.get(z);ct.__webglFramebuffer=nt,ct.__useDefaultFramebuffer=nt===void 0},this.setRenderTarget=function(z,nt=0,ct=0){A=z,w=nt,E=ct;let rt=!0,tt=null,Ft=!1,Gt=!1;if(z){const qt=zt.get(z);if(qt.__useDefaultFramebuffer!==void 0)Tt.bindFramebuffer(O.FRAMEBUFFER,null),rt=!1;else if(qt.__webglFramebuffer===void 0)D.setupRenderTarget(z);else if(qt.__hasExternalTextures)D.rebindTextures(z,zt.get(z.texture).__webglTexture,zt.get(z.depthTexture).__webglTexture);else if(z.depthBuffer){const Jt=z.depthTexture;if(qt.__boundDepthTexture!==Jt){if(Jt!==null&&zt.has(Jt)&&(z.width!==Jt.image.width||z.height!==Jt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(z)}}const se=z.texture;(se.isData3DTexture||se.isDataArrayTexture||se.isCompressedArrayTexture)&&(Gt=!0);const ie=zt.get(z).__webglFramebuffer;z.isWebGLCubeRenderTarget?(Array.isArray(ie[nt])?tt=ie[nt][ct]:tt=ie[nt],Ft=!0):z.samples>0&&D.useMultisampledRTT(z)===!1?tt=zt.get(z).__webglMultisampledFramebuffer:Array.isArray(ie)?tt=ie[ct]:tt=ie,P.copy(z.viewport),I.copy(z.scissor),L=z.scissorTest}else P.copy(ht).multiplyScalar(G).floor(),I.copy(yt).multiplyScalar(G).floor(),L=Lt;if(Tt.bindFramebuffer(O.FRAMEBUFFER,tt)&&rt&&Tt.drawBuffers(z,tt),Tt.viewport(P),Tt.scissor(I),Tt.setScissorTest(L),Ft){const qt=zt.get(z.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+nt,qt.__webglTexture,ct)}else if(Gt){const qt=zt.get(z.texture),se=nt||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,qt.__webglTexture,ct||0,se)}_=-1},this.readRenderTargetPixels=function(z,nt,ct,rt,tt,Ft,Gt){if(!(z&&z.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Zt=zt.get(z).__webglFramebuffer;if(z.isWebGLCubeRenderTarget&&Gt!==void 0&&(Zt=Zt[Gt]),Zt){Tt.bindFramebuffer(O.FRAMEBUFFER,Zt);try{const qt=z.texture,se=qt.format,ie=qt.type;if(!at.textureFormatReadable(se)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!at.textureTypeReadable(ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}nt>=0&&nt<=z.width-rt&&ct>=0&&ct<=z.height-tt&&O.readPixels(nt,ct,rt,tt,Ot.convert(se),Ot.convert(ie),Ft)}finally{const qt=A!==null?zt.get(A).__webglFramebuffer:null;Tt.bindFramebuffer(O.FRAMEBUFFER,qt)}}},this.readRenderTargetPixelsAsync=async function(z,nt,ct,rt,tt,Ft,Gt){if(!(z&&z.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Zt=zt.get(z).__webglFramebuffer;if(z.isWebGLCubeRenderTarget&&Gt!==void 0&&(Zt=Zt[Gt]),Zt){const qt=z.texture,se=qt.format,ie=qt.type;if(!at.textureFormatReadable(se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!at.textureTypeReadable(ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(nt>=0&&nt<=z.width-rt&&ct>=0&&ct<=z.height-tt){Tt.bindFramebuffer(O.FRAMEBUFFER,Zt);const Jt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Jt),O.bufferData(O.PIXEL_PACK_BUFFER,Ft.byteLength,O.STREAM_READ),O.readPixels(nt,ct,rt,tt,Ot.convert(se),Ot.convert(ie),0);const ve=A!==null?zt.get(A).__webglFramebuffer:null;Tt.bindFramebuffer(O.FRAMEBUFFER,ve);const re=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await r1(O,re,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Jt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Ft),O.deleteBuffer(Jt),O.deleteSync(re),Ft}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(z,nt=null,ct=0){z.isTexture!==!0&&(Eo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),nt=arguments[0]||null,z=arguments[1]);const rt=Math.pow(2,-ct),tt=Math.floor(z.image.width*rt),Ft=Math.floor(z.image.height*rt),Gt=nt!==null?nt.x:0,Zt=nt!==null?nt.y:0;D.setTexture2D(z,0),O.copyTexSubImage2D(O.TEXTURE_2D,ct,0,0,Gt,Zt,tt,Ft),Tt.unbindTexture()},this.copyTextureToTexture=function(z,nt,ct=null,rt=null,tt=0){z.isTexture!==!0&&(Eo("WebGLRenderer: copyTextureToTexture function signature has changed."),rt=arguments[0]||null,z=arguments[1],nt=arguments[2],tt=arguments[3]||0,ct=null);let Ft,Gt,Zt,qt,se,ie,Jt,ve,re;const H=z.isCompressedTexture?z.mipmaps[tt]:z.image;ct!==null?(Ft=ct.max.x-ct.min.x,Gt=ct.max.y-ct.min.y,Zt=ct.isBox3?ct.max.z-ct.min.z:1,qt=ct.min.x,se=ct.min.y,ie=ct.isBox3?ct.min.z:0):(Ft=H.width,Gt=H.height,Zt=H.depth||1,qt=0,se=0,ie=0),rt!==null?(Jt=rt.x,ve=rt.y,re=rt.z):(Jt=0,ve=0,re=0);const Rt=Ot.convert(nt.format),St=Ot.convert(nt.type);let bt;nt.isData3DTexture?(D.setTexture3D(nt,0),bt=O.TEXTURE_3D):nt.isDataArrayTexture||nt.isCompressedArrayTexture?(D.setTexture2DArray(nt,0),bt=O.TEXTURE_2D_ARRAY):(D.setTexture2D(nt,0),bt=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,nt.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,nt.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,nt.unpackAlignment);const te=O.getParameter(O.UNPACK_ROW_LENGTH),Bt=O.getParameter(O.UNPACK_IMAGE_HEIGHT),le=O.getParameter(O.UNPACK_SKIP_PIXELS),Re=O.getParameter(O.UNPACK_SKIP_ROWS),Se=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,H.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,H.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,qt),O.pixelStorei(O.UNPACK_SKIP_ROWS,se),O.pixelStorei(O.UNPACK_SKIP_IMAGES,ie);const Ce=z.isDataArrayTexture||z.isData3DTexture,ye=nt.isDataArrayTexture||nt.isData3DTexture;if(z.isRenderTargetTexture||z.isDepthTexture){const ge=zt.get(z),Te=zt.get(nt),Ve=zt.get(ge.__renderTarget),ln=zt.get(Te.__renderTarget);Tt.bindFramebuffer(O.READ_FRAMEBUFFER,Ve.__webglFramebuffer),Tt.bindFramebuffer(O.DRAW_FRAMEBUFFER,ln.__webglFramebuffer);for(let bn=0;bn<Zt;bn++)Ce&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,zt.get(z).__webglTexture,tt,ie+bn),z.isDepthTexture?(ye&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,zt.get(nt).__webglTexture,tt,re+bn),O.blitFramebuffer(qt,se,Ft,Gt,Jt,ve,Ft,Gt,O.DEPTH_BUFFER_BIT,O.NEAREST)):ye?O.copyTexSubImage3D(bt,tt,Jt,ve,re+bn,qt,se,Ft,Gt):O.copyTexSubImage2D(bt,tt,Jt,ve,re+bn,qt,se,Ft,Gt);Tt.bindFramebuffer(O.READ_FRAMEBUFFER,null),Tt.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else ye?z.isDataTexture||z.isData3DTexture?O.texSubImage3D(bt,tt,Jt,ve,re,Ft,Gt,Zt,Rt,St,H.data):nt.isCompressedArrayTexture?O.compressedTexSubImage3D(bt,tt,Jt,ve,re,Ft,Gt,Zt,Rt,H.data):O.texSubImage3D(bt,tt,Jt,ve,re,Ft,Gt,Zt,Rt,St,H):z.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,tt,Jt,ve,Ft,Gt,Rt,St,H.data):z.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,tt,Jt,ve,H.width,H.height,Rt,H.data):O.texSubImage2D(O.TEXTURE_2D,tt,Jt,ve,Ft,Gt,Rt,St,H);O.pixelStorei(O.UNPACK_ROW_LENGTH,te),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Bt),O.pixelStorei(O.UNPACK_SKIP_PIXELS,le),O.pixelStorei(O.UNPACK_SKIP_ROWS,Re),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Se),tt===0&&nt.generateMipmaps&&O.generateMipmap(bt),Tt.unbindTexture()},this.copyTextureToTexture3D=function(z,nt,ct=null,rt=null,tt=0){return z.isTexture!==!0&&(Eo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ct=arguments[0]||null,rt=arguments[1]||null,z=arguments[2],nt=arguments[3],tt=arguments[4]||0),Eo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(z,nt,ct,rt,tt)},this.initRenderTarget=function(z){zt.get(z).__webglFramebuffer===void 0&&D.setupRenderTarget(z)},this.initTexture=function(z){z.isCubeTexture?D.setTextureCube(z,0):z.isData3DTexture?D.setTexture3D(z,0):z.isDataArrayTexture||z.isCompressedArrayTexture?D.setTexture2DArray(z,0):D.setTexture2D(z,0),Tt.unbindTexture()},this.resetState=function(){w=0,E=0,A=null,Tt.reset(),It.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ea}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Ae._getDrawingBufferColorSpace(t),e.unpackColorSpace=Ae._getUnpackColorSpace()}}class yA extends nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Oi,this.environmentIntensity=1,this.environmentRotation=new Oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class MA{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Vd,this.updateRanges=[],this.version=0,this.uuid=Ni()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ni()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ni()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Un=new Y;class fc{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.applyMatrix4(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.applyNormalMatrix(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.transformDirection(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Si(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ie(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Si(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Si(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Si(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Si(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array),a=Ie(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array),a=Ie(a,this.array),s=Ie(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new cn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new fc(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Yd extends ts{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ee(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Ts;const vo=new Y,As=new Y,Rs=new Y,Ps=new Wt,yo=new Wt,Ym=new Le,Cr=new Y,Mo=new Y,Lr=new Y,Yf=new Wt,Ll=new Wt,$f=new Wt;class Zf extends nn{constructor(t=new Yd){if(super(),this.isSprite=!0,this.type="Sprite",Ts===void 0){Ts=new Ke;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new MA(e,5);Ts.setIndex([0,1,2,0,2,3]),Ts.setAttribute("position",new fc(i,3,0,!1)),Ts.setAttribute("uv",new fc(i,2,3,!1))}this.geometry=Ts,this.material=t,this.center=new Wt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),As.setFromMatrixScale(this.matrixWorld),Ym.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Rs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&As.multiplyScalar(-Rs.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;Dr(Cr.set(-.5,-.5,0),Rs,o,As,a,s),Dr(Mo.set(.5,-.5,0),Rs,o,As,a,s),Dr(Lr.set(.5,.5,0),Rs,o,As,a,s),Yf.set(0,0),Ll.set(1,0),$f.set(1,1);let r=t.ray.intersectTriangle(Cr,Mo,Lr,!1,vo);if(r===null&&(Dr(Mo.set(-.5,.5,0),Rs,o,As,a,s),Ll.set(0,1),r=t.ray.intersectTriangle(Cr,Lr,Mo,!1,vo),r===null))return;const c=t.ray.origin.distanceTo(vo);c<t.near||c>t.far||e.push({distance:c,point:vo.clone(),uv:si.getInterpolation(vo,Cr,Mo,Lr,Yf,Ll,$f,new Wt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Dr(n,t,e,i,a,s){Ps.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(yo.x=s*Ps.x-a*Ps.y,yo.y=a*Ps.x+s*Ps.y):yo.copy(Ps),n.copy(t),n.x+=yo.x,n.y+=yo.y,n.applyMatrix4(Ym)}class _A extends In{constructor(t=null,e=1,i=1,a,s,o,r,c,l=oi,d=oi,u,h){super(null,o,r,c,l,d,a,s,u,h),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ko extends cn{constructor(t,e,i,a=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Cs=new Le,jf=new Le,kr=[],qf=new Qa,bA=new Le,_o=new me,bo=new Js;class Kf extends me{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ko(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,bA)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Qa),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Cs),qf.copy(t.boundingBox).applyMatrix4(Cs),this.boundingBox.union(qf)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Js),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Cs),bo.copy(t.boundingSphere).applyMatrix4(Cs),this.boundingSphere.union(bo)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,a=this.morphTexture.source.data.data,s=i.length+1,o=t*s+1;for(let r=0;r<i.length;r++)i[r]=a[o+r]}raycast(t,e){const i=this.matrixWorld,a=this.count;if(_o.geometry=this.geometry,_o.material=this.material,_o.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),bo.copy(this.boundingSphere),bo.applyMatrix4(i),t.ray.intersectsSphere(bo)!==!1))for(let s=0;s<a;s++){this.getMatrixAt(s,Cs),jf.multiplyMatrices(i,Cs),_o.matrixWorld=jf,_o.raycast(t,kr);for(let o=0,r=kr.length;o<r;o++){const c=kr[o];c.instanceId=s,c.object=this,e.push(c)}kr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new ko(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new _A(new Float32Array(a*this.count),a,this.count,mh,Fi));const s=this.morphTexture.source.data.data;let o=0;for(let l=0;l<i.length;l++)o+=i[l];const r=this.geometry.morphTargetsRelative?1:1-o,c=a*t;s[c]=r,s.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class $d extends ts{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const pc=new Y,mc=new Y,Jf=new Le,So=new Mh,Ir=new Js,Dl=new Y,Qf=new Y;class SA extends nn{constructor(t=new Ke,e=new $d){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)pc.fromBufferAttribute(e,a-1),mc.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=pc.distanceTo(mc);t.setAttribute("lineDistance",new De(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ir.copy(i.boundingSphere),Ir.applyMatrix4(a),Ir.radius+=s,t.ray.intersectsSphere(Ir)===!1)return;Jf.copy(a).invert(),So.copy(t.ray).applyMatrix4(Jf);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=l){const p=d.getX(v),b=d.getX(v+1),x=zr(this,t,So,c,p,b);x&&e.push(x)}if(this.isLineLoop){const v=d.getX(m-1),g=d.getX(f),p=zr(this,t,So,c,v,g);p&&e.push(p)}}else{const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=l){const p=zr(this,t,So,c,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=zr(this,t,So,c,m-1,f);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function zr(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(pc.fromBufferAttribute(o,a),mc.fromBufferAttribute(o,s),e.distanceSqToSegment(pc,mc,Dl,Qf)>i)return;Dl.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Dl);if(!(c<t.near||c>t.far))return{distance:c,point:Qf.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const tp=new Y,ep=new Y;class np extends SA{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)tp.fromBufferAttribute(e,a),ep.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+tp.distanceTo(ep);t.setAttribute("lineDistance",new De(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Zd extends In{constructor(t,e,i,a,s,o,r,c,l){super(t,e,i,a,s,o,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Bi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,c=s-1,l;for(;r<=c;)if(a=Math.floor(r+(c-r)/2),l=i[a]-o,l<0)r=a+1;else if(l>0)c=a-1;else{c=a;break}if(a=c,i[a]===o)return a/(s-1);const d=i[a],h=i[a+1]-d,f=(o-d)/h;return(a+f)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),c=e||(o.isVector2?new Wt:new Y);return c.copy(r).sub(o).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new Y,a=[],s=[],o=[],r=new Y,c=new Le;for(let f=0;f<=t;f++){const m=f/t;a[f]=this.getTangentAt(m,new Y)}s[0]=new Y,o[0]=new Y;let l=Number.MAX_VALUE;const d=Math.abs(a[0].x),u=Math.abs(a[0].y),h=Math.abs(a[0].z);d<=l&&(l=d,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),h<=l&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),r.crossVectors(a[f-1],a[f]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(Rn(a[f-1].dot(a[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(r,m))}o[f].crossVectors(a[f],s[f])}if(e===!0){let f=Math.acos(Rn(s[0].dot(s[t]),-1,1));f/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(a[m],f*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class wh extends Bi{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new Wt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=c-this.aX,f=l-this.aY;c=h*d-f*u+this.aX,l=h*u+f*d+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class wA extends wh{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Eh(){let n=0,t=0,e=0,i=0;function a(s,o,r,c){n=s,t=r,e=-3*s+3*o-2*r-c,i=2*s-2*o+r+c}return{initCatmullRom:function(s,o,r,c,l){a(o,r,l*(r-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,r,c,l,d,u){let h=(o-s)/l-(r-s)/(l+d)+(r-o)/d,f=(r-o)/d-(c-o)/(d+u)+(c-r)/u;h*=d,f*=d,a(o,r,h,f)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const Fr=new Y,kl=new Eh,Il=new Eh,zl=new Eh;class EA extends Bi{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new Y){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),c=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:c===0&&r===s-1&&(r=s-2,c=1);let l,d;this.closed||r>0?l=a[(r-1)%s]:(Fr.subVectors(a[0],a[1]).add(a[0]),l=Fr);const u=a[r%s],h=a[(r+1)%s];if(this.closed||r+2<s?d=a[(r+2)%s]:(Fr.subVectors(a[s-1],a[s-2]).add(a[s-1]),d=Fr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(h),f),g=Math.pow(h.distanceToSquared(d),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),kl.initNonuniformCatmullRom(l.x,u.x,h.x,d.x,m,v,g),Il.initNonuniformCatmullRom(l.y,u.y,h.y,d.y,m,v,g),zl.initNonuniformCatmullRom(l.z,u.z,h.z,d.z,m,v,g)}else this.curveType==="catmullrom"&&(kl.initCatmullRom(l.x,u.x,h.x,d.x,this.tension),Il.initCatmullRom(l.y,u.y,h.y,d.y,this.tension),zl.initCatmullRom(l.z,u.z,h.z,d.z,this.tension));return i.set(kl.calc(c),Il.calc(c),zl.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Y().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function ip(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,c=n*r;return(2*e-2*i+s+o)*c+(-3*e+3*i-2*s-o)*r+s*n+e}function TA(n,t){const e=1-n;return e*e*t}function AA(n,t){return 2*(1-n)*n*t}function RA(n,t){return n*n*t}function Io(n,t,e,i){return TA(n,t)+AA(n,e)+RA(n,i)}function PA(n,t){const e=1-n;return e*e*e*t}function CA(n,t){const e=1-n;return 3*e*e*n*t}function LA(n,t){return 3*(1-n)*n*n*t}function DA(n,t){return n*n*n*t}function zo(n,t,e,i,a){return PA(n,t)+CA(n,e)+LA(n,i)+DA(n,a)}class $m extends Bi{constructor(t=new Wt,e=new Wt,i=new Wt,a=new Wt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Wt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(zo(t,a.x,s.x,o.x,r.x),zo(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class kA extends Bi{constructor(t=new Y,e=new Y,i=new Y,a=new Y){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Y){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(zo(t,a.x,s.x,o.x,r.x),zo(t,a.y,s.y,o.y,r.y),zo(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Zm extends Bi{constructor(t=new Wt,e=new Wt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Wt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Wt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class IA extends Bi{constructor(t=new Y,e=new Y){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new Y){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Y){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class jm extends Bi{constructor(t=new Wt,e=new Wt,i=new Wt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Wt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Io(t,a.x,s.x,o.x),Io(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class zA extends Bi{constructor(t=new Y,e=new Y,i=new Y){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Y){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Io(t,a.x,s.x,o.x),Io(t,a.y,s.y,o.y),Io(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class qm extends Bi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Wt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,c=a[o===0?o:o-1],l=a[o],d=a[o>a.length-2?a.length-1:o+1],u=a[o>a.length-3?a.length-1:o+2];return i.set(ip(r,c.x,l.x,d.x,u.x),ip(r,c.y,l.y,d.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Wt().fromArray(a))}return this}}var ap=Object.freeze({__proto__:null,ArcCurve:wA,CatmullRomCurve3:EA,CubicBezierCurve:$m,CubicBezierCurve3:kA,EllipseCurve:wh,LineCurve:Zm,LineCurve3:IA,QuadraticBezierCurve:jm,QuadraticBezierCurve3:zA,SplineCurve:qm});class FA extends Bi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ap[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],c=r.getLength(),l=c===0?0:1-o/c;return r.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(r);for(let l=0;l<c.length;l++){const d=c[l];i&&i.equals(d)||(e.push(d),i=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new ap[a.type]().fromJSON(a))}return this}}class sp extends FA{constructor(t){super(),this.type="Path",this.currentPoint=new Wt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Zm(this.currentPoint.clone(),new Wt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new jm(this.currentPoint.clone(),new Wt(t,e),new Wt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new $m(this.currentPoint.clone(),new Wt(t,e),new Wt(i,a),new Wt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new qm(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+l,e+d,i,a,s,o,r,c),this}absellipse(t,e,i,a,s,o,r,c){const l=new wh(t,e,i,a,s,o,r,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Th extends Ke{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],c=[],l=new Y,d=new Wt;o.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let u=0,h=3;u<=e;u++,h+=3){const f=i+u/e*a;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),r.push(0,0,1),d.x=(o[h]/t+1)/2,d.y=(o[h+1]/t+1)/2,c.push(d.x,d.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new De(o,3)),this.setAttribute("normal",new De(r,3)),this.setAttribute("uv",new De(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Th(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Wo extends Ke{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:c};const l=this;a=Math.floor(a),s=Math.floor(s);const d=[],u=[],h=[],f=[];let m=0;const v=[],g=i/2;let p=0;b(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(d),this.setAttribute("position",new De(u,3)),this.setAttribute("normal",new De(h,3)),this.setAttribute("uv",new De(f,2));function b(){const y=new Y,S=new Y;let w=0;const E=(e-t)/i;for(let A=0;A<=s;A++){const _=[],M=A/s,P=M*(e-t)+t;for(let I=0;I<=a;I++){const L=I/a,F=L*c+r,C=Math.sin(F),T=Math.cos(F);S.x=P*C,S.y=-M*i+g,S.z=P*T,u.push(S.x,S.y,S.z),y.set(C,E,T).normalize(),h.push(y.x,y.y,y.z),f.push(L,1-M),_.push(m++)}v.push(_)}for(let A=0;A<a;A++)for(let _=0;_<s;_++){const M=v[_][A],P=v[_+1][A],I=v[_+1][A+1],L=v[_][A+1];(t>0||_!==0)&&(d.push(M,P,L),w+=3),(e>0||_!==s-1)&&(d.push(P,I,L),w+=3)}l.addGroup(p,w,0),p+=w}function x(y){const S=m,w=new Wt,E=new Y;let A=0;const _=y===!0?t:e,M=y===!0?1:-1;for(let I=1;I<=a;I++)u.push(0,g*M,0),h.push(0,M,0),f.push(.5,.5),m++;const P=m;for(let I=0;I<=a;I++){const F=I/a*c+r,C=Math.cos(F),T=Math.sin(F);E.x=_*T,E.y=g*M,E.z=_*C,u.push(E.x,E.y,E.z),h.push(0,M,0),w.x=C*.5+.5,w.y=T*.5*M+.5,f.push(w.x,w.y),m++}for(let I=0;I<a;I++){const L=S+I,F=P+I;y===!0?d.push(F,F+1,L):d.push(F+1,F,L),A+=3}l.addGroup(p,A,y===!0?1:2),p+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wo(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ah extends Wo{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new Ah(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Rh extends Ke{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),l(i),d(),this.setAttribute("position",new De(s,3)),this.setAttribute("normal",new De(s.slice(),3)),this.setAttribute("uv",new De(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(b){const x=new Y,y=new Y,S=new Y;for(let w=0;w<e.length;w+=3)f(e[w+0],x),f(e[w+1],y),f(e[w+2],S),c(x,y,S,b)}function c(b,x,y,S){const w=S+1,E=[];for(let A=0;A<=w;A++){E[A]=[];const _=b.clone().lerp(y,A/w),M=x.clone().lerp(y,A/w),P=w-A;for(let I=0;I<=P;I++)I===0&&A===w?E[A][I]=_:E[A][I]=_.clone().lerp(M,I/P)}for(let A=0;A<w;A++)for(let _=0;_<2*(w-A)-1;_++){const M=Math.floor(_/2);_%2===0?(h(E[A][M+1]),h(E[A+1][M]),h(E[A][M])):(h(E[A][M+1]),h(E[A+1][M+1]),h(E[A+1][M]))}}function l(b){const x=new Y;for(let y=0;y<s.length;y+=3)x.x=s[y+0],x.y=s[y+1],x.z=s[y+2],x.normalize().multiplyScalar(b),s[y+0]=x.x,s[y+1]=x.y,s[y+2]=x.z}function d(){const b=new Y;for(let x=0;x<s.length;x+=3){b.x=s[x+0],b.y=s[x+1],b.z=s[x+2];const y=g(b)/2/Math.PI+.5,S=p(b)/Math.PI+.5;o.push(y,1-S)}m(),u()}function u(){for(let b=0;b<o.length;b+=6){const x=o[b+0],y=o[b+2],S=o[b+4],w=Math.max(x,y,S),E=Math.min(x,y,S);w>.9&&E<.1&&(x<.2&&(o[b+0]+=1),y<.2&&(o[b+2]+=1),S<.2&&(o[b+4]+=1))}}function h(b){s.push(b.x,b.y,b.z)}function f(b,x){const y=b*3;x.x=t[y+0],x.y=t[y+1],x.z=t[y+2]}function m(){const b=new Y,x=new Y,y=new Y,S=new Y,w=new Wt,E=new Wt,A=new Wt;for(let _=0,M=0;_<s.length;_+=9,M+=6){b.set(s[_+0],s[_+1],s[_+2]),x.set(s[_+3],s[_+4],s[_+5]),y.set(s[_+6],s[_+7],s[_+8]),w.set(o[M+0],o[M+1]),E.set(o[M+2],o[M+3]),A.set(o[M+4],o[M+5]),S.copy(b).add(x).add(y).divideScalar(3);const P=g(S);v(w,M+0,b,P),v(E,M+2,x,P),v(A,M+4,y,P)}}function v(b,x,y,S){S<0&&b.x===1&&(o[x]=b.x-1),y.x===0&&y.z===0&&(o[x]=S/2/Math.PI+.5)}function g(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rh(t.vertices,t.indices,t.radius,t.details)}}const Ur=new Y,Nr=new Y,Fl=new Y,Or=new si;class UA extends Ke{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(Ns*e),o=t.getIndex(),r=t.getAttribute("position"),c=o?o.count:r.count,l=[0,0,0],d=["a","b","c"],u=new Array(3),h={},f=[];for(let m=0;m<c;m+=3){o?(l[0]=o.getX(m),l[1]=o.getX(m+1),l[2]=o.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);const{a:v,b:g,c:p}=Or;if(v.fromBufferAttribute(r,l[0]),g.fromBufferAttribute(r,l[1]),p.fromBufferAttribute(r,l[2]),Or.getNormal(Fl),u[0]=`${Math.round(v.x*a)},${Math.round(v.y*a)},${Math.round(v.z*a)}`,u[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,u[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let b=0;b<3;b++){const x=(b+1)%3,y=u[b],S=u[x],w=Or[d[b]],E=Or[d[x]],A=`${y}_${S}`,_=`${S}_${y}`;_ in h&&h[_]?(Fl.dot(h[_].normal)<=s&&(f.push(w.x,w.y,w.z),f.push(E.x,E.y,E.z)),h[_]=null):A in h||(h[A]={index0:l[b],index1:l[x],normal:Fl.clone()})}}for(const m in h)if(h[m]){const{index0:v,index1:g}=h[m];Ur.fromBufferAttribute(r,v),Nr.fromBufferAttribute(r,g),f.push(Ur.x,Ur.y,Ur.z),f.push(Nr.x,Nr.y,Nr.z)}this.setAttribute("position",new De(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Km extends sp{constructor(t){super(t),this.uuid=Ni(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new sp().fromJSON(a))}return this}}const NA={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=Jm(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,c,l,d,u,h,f;if(i&&(s=XA(n,t,s,e)),n.length>80*e){r=l=n[0],c=d=n[1];for(let m=e;m<a;m+=e)u=n[m],h=n[m+1],u<r&&(r=u),h<c&&(c=h),u>l&&(l=u),h>d&&(d=h);f=Math.max(l-r,d-c),f=f!==0?32767/f:0}return Yo(s,o,e,r,c,f,0),o}};function Jm(n,t,e,i,a){let s,o;if(a===t2(n,t,e,i)>0)for(s=t;s<e;s+=i)o=op(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=op(s,n[s],n[s+1],o);return o&&Ac(o,o.next)&&(Zo(o),o=o.next),o}function Ja(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Ac(e,e.next)||en(e.prev,e,e.next)===0)){if(Zo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Yo(n,t,e,i,a,s,o){if(!n)return;!o&&s&&ZA(n,i,a,s);let r=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,s?BA(n,i,a,s):OA(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),Zo(n),n=l.next,r=l.next;continue}if(n=l,n===r){o?o===1?(n=HA(Ja(n),t,e),Yo(n,t,e,i,a,s,2)):o===2&&GA(n,t,e,i,a,s):Yo(Ja(n),t,e,i,a,s,1);break}}}function OA(n){const t=n.prev,e=n,i=n.next;if(en(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,c=e.y,l=i.y,d=a<s?a<o?a:o:s<o?s:o,u=r<c?r<l?r:l:c<l?c:l,h=a>s?a>o?a:o:s>o?s:o,f=r>c?r>l?r:l:c>l?c:l;let m=i.next;for(;m!==t;){if(m.x>=d&&m.x<=h&&m.y>=u&&m.y<=f&&Is(a,r,s,c,o,l,m.x,m.y)&&en(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function BA(n,t,e,i){const a=n.prev,s=n,o=n.next;if(en(a,s,o)>=0)return!1;const r=a.x,c=s.x,l=o.x,d=a.y,u=s.y,h=o.y,f=r<c?r<l?r:l:c<l?c:l,m=d<u?d<h?d:h:u<h?u:h,v=r>c?r>l?r:l:c>l?c:l,g=d>u?d>h?d:h:u>h?u:h,p=jd(f,m,t,e,i),b=jd(v,g,t,e,i);let x=n.prevZ,y=n.nextZ;for(;x&&x.z>=p&&y&&y.z<=b;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&Is(r,d,c,u,l,h,x.x,x.y)&&en(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==a&&y!==o&&Is(r,d,c,u,l,h,y.x,y.y)&&en(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&Is(r,d,c,u,l,h,x.x,x.y)&&en(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=b;){if(y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==a&&y!==o&&Is(r,d,c,u,l,h,y.x,y.y)&&en(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function HA(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!Ac(a,s)&&Qm(a,i,i.next,s)&&$o(a,s)&&$o(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),Zo(i),Zo(i.next),i=n=s),i=i.next}while(i!==n);return Ja(i)}function GA(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&KA(o,r)){let c=t0(o,r);o=Ja(o,o.next),c=Ja(c,c.next),Yo(o,t,e,i,a,s,0),Yo(c,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function XA(n,t,e,i){const a=[];let s,o,r,c,l;for(s=0,o=t.length;s<o;s++)r=t[s]*i,c=s<o-1?t[s+1]*i:n.length,l=Jm(n,r,c,i,!1),l===l.next&&(l.steiner=!0),a.push(qA(l));for(a.sort(VA),s=0;s<a.length;s++)e=WA(a[s],e);return e}function VA(n,t){return n.x-t.x}function WA(n,t){const e=YA(n,t);if(!e)return t;const i=t0(e,n);return Ja(i,i.next),Ja(e,e.next)}function YA(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const h=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=s&&h>i&&(i=h,a=e.x<e.next.x?e:e.next,h===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,c=a.x,l=a.y;let d=1/0,u;e=a;do s>=e.x&&e.x>=c&&s!==e.x&&Is(o<l?s:i,o,c,l,o<l?i:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),$o(e,n)&&(u<d||u===d&&(e.x>a.x||e.x===a.x&&$A(a,e)))&&(a=e,d=u)),e=e.next;while(e!==r);return a}function $A(n,t){return en(n.prev,n,t.prev)<0&&en(t.next,n,n.next)<0}function ZA(n,t,e,i){let a=n;do a.z===0&&(a.z=jd(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,jA(a)}function jA(n){let t,e,i,a,s,o,r,c,l=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<l&&(r++,i=i.nextZ,!!i);t++);for(c=l;r>0||c>0&&i;)r!==0&&(c===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,c--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,l*=2}while(o>1);return n}function jd(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function qA(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Is(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function KA(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!JA(n,t)&&($o(n,t)&&$o(t,n)&&QA(n,t)&&(en(n.prev,n,t.prev)||en(n,t.prev,t))||Ac(n,t)&&en(n.prev,n,n.next)>0&&en(t.prev,t,t.next)>0)}function en(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Ac(n,t){return n.x===t.x&&n.y===t.y}function Qm(n,t,e,i){const a=Hr(en(n,t,e)),s=Hr(en(n,t,i)),o=Hr(en(e,i,n)),r=Hr(en(e,i,t));return!!(a!==s&&o!==r||a===0&&Br(n,e,t)||s===0&&Br(n,i,t)||o===0&&Br(e,n,i)||r===0&&Br(e,t,i))}function Br(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Hr(n){return n>0?1:n<0?-1:0}function JA(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Qm(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function $o(n,t){return en(n.prev,n,n.next)<0?en(n,t,n.next)>=0&&en(n,n.prev,t)>=0:en(n,t,n.prev)<0||en(n,n.next,t)<0}function QA(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function t0(n,t){const e=new qd(n.i,n.x,n.y),i=new qd(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function op(n,t,e,i){const a=new qd(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function Zo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function qd(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function t2(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class Fo{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return Fo.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];rp(t),cp(i,t);let o=t.length;e.forEach(rp);for(let c=0;c<e.length;c++)a.push(o),o+=e[c].length,cp(i,e[c]);const r=NA.triangulate(i,a);for(let c=0;c<r.length;c+=3)s.push(r.slice(c,c+3));return s}}function rp(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function cp(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Ph extends Rh{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ph(t.radius,t.detail)}}class Bs extends Ke{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],c=[],l=[],d=[];let u=t;const h=(e-t)/a,f=new Y,m=new Wt;for(let v=0;v<=a;v++){for(let g=0;g<=i;g++){const p=s+g/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,d.push(m.x,m.y)}u+=h}for(let v=0;v<a;v++){const g=v*(i+1);for(let p=0;p<i;p++){const b=p+g,x=b,y=b+i+1,S=b+i+2,w=b+1;r.push(x,y,w),r.push(y,S,w)}}this.setIndex(r),this.setAttribute("position",new De(c,3)),this.setAttribute("normal",new De(l,3)),this.setAttribute("uv",new De(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ch extends Ke{constructor(t=new Km([new Wt(0,.5),new Wt(-.5,-.5),new Wt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let d=0;d<t.length;d++)l(t[d]),this.addGroup(r,c,d),r+=c,c=0;this.setIndex(i),this.setAttribute("position",new De(a,3)),this.setAttribute("normal",new De(s,3)),this.setAttribute("uv",new De(o,2));function l(d){const u=a.length/3,h=d.extractPoints(e);let f=h.shape;const m=h.holes;Fo.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){const b=m[g];Fo.isClockWise(b)===!0&&(m[g]=b.reverse())}const v=Fo.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){const b=m[g];f=f.concat(b)}for(let g=0,p=f.length;g<p;g++){const b=f[g];a.push(b.x,b.y,0),s.push(0,0,1),o.push(b.x,b.y)}for(let g=0,p=v.length;g<p;g++){const b=v[g],x=b[0]+u,y=b[1]+u,S=b[2]+u;i.push(x,y,S),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return e2(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new Ch(i,t.curveSegments)}}function e2(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class Rc extends Ke{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],c=[],l=[],d=new Y,u=new Y,h=new Y;for(let f=0;f<=i;f++)for(let m=0;m<=a;m++){const v=m/a*s,g=f/i*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(v),u.y=(t+e*Math.cos(g))*Math.sin(v),u.z=e*Math.sin(g),r.push(u.x,u.y,u.z),d.x=t*Math.cos(v),d.y=t*Math.sin(v),h.subVectors(u,d).normalize(),c.push(h.x,h.y,h.z),l.push(m/a),l.push(f/i)}for(let f=1;f<=i;f++)for(let m=1;m<=a;m++){const v=(a+1)*f+m-1,g=(a+1)*(f-1)+m-1,p=(a+1)*(f-1)+m,b=(a+1)*f+m;o.push(v,g,b),o.push(g,p,b)}this.setIndex(o),this.setAttribute("position",new De(r,3)),this.setAttribute("normal",new De(c,3)),this.setAttribute("uv",new De(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rc(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class gi extends ts{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rm,this.normalScale=new Wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Oi,this.combine=hh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class e0 extends nn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ee(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class n2 extends e0{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ee(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ul=new Le,lp=new Y,dp=new Y;class i2{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Wt(512,512),this.map=null,this.mapPass=null,this.matrix=new Le,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new bh,this._frameExtents=new Wt(1,1),this._viewportCount=1,this._viewports=[new rn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;lp.setFromMatrixPosition(t.matrixWorld),e.position.copy(lp),dp.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(dp),e.updateMatrixWorld(),Ul.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ul),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ul)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class a2 extends i2{constructor(){super(new Bm(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class s2 extends e0{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.target=new nn,this.shadow=new a2}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const hp=new Le;class o2{constructor(t,e,i=0,a=1/0){this.ray=new Mh(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new _h,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return hp.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(hp),this}intersectObject(t,e=!0,i=[]){return Kd(t,this,i,e),i.sort(up),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)Kd(t[a],this,i,e);return i.sort(up),i}}function up(n,t){return n.distance-t.distance}function Kd(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)Kd(s[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:dh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=dh);const r2={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function c2(n,t,e,i){const a=new mi(n.fov,i,.1,200),s=new Y,o=new Y,r=new Y;let c=!1,l=n.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1,h=0,f=0,m=0,v=0,g=0,p=0;function b(){const x=(n.pitchDeg+d.pitchDelta)*Math.PI/180,y=n.yawDeg*Math.PI/180;r.set(Math.sin(y)*Math.cos(x),Math.sin(x),Math.cos(y)*Math.cos(x)).multiplyScalar(n.distance*d.distanceScale*d.zoom)}return b(),{camera:a,update(x,y,S,w,E=r2){const A=y+.6;if(!c)s.set(x,A,S),c=!0;else{const P=1-Math.exp(-Math.max(n.smoothing,.001)*w);s.x+=(x-s.x)*P,s.y+=(A-s.y)*P,s.z+=(S-s.z)*P}const _=1-Math.exp(-Math.max(t.smoothing,.001)*w);d.distanceScale+=(E.distanceScale-d.distanceScale)*_,d.offsetX+=(E.offsetX-d.offsetX)*_,d.offsetZ+=(E.offsetZ-d.offsetZ)*_,d.pitchDelta+=(E.pitchDelta-d.pitchDelta)*_;const M=1-Math.exp(-Math.max(e.smoothing,.001)*w);if(d.zoom+=(u-d.zoom)*M,b(),(a.fov!==l||a.fov!==n.fov)&&(a.fov=n.fov,l=n.fov,a.updateProjectionMatrix()),o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),a.position.copy(o).add(r),a.lookAt(o),h>.001){f+=w*52;const P=h*.055;a.position.x+=Math.sin(f*1.7)*P,a.position.y+=Math.sin(f*2.3+1.1)*P*.75,a.position.z+=Math.sin(f*1.3+2.4)*P*.5,h*=Math.exp(-9*w)}else h=0;g>.001?(a.position.x+=m*g,a.position.z+=v*g,g*=Math.exp(-13*w)):g=0,a.updateMatrixWorld()},snap(x,y,S){s.set(x,y+.6,S),c=!0,o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),b(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new Y().setFromMatrixColumn(a.matrixWorld,0),y=new Y().setFromMatrixColumn(a.matrixWorld,2).negate(),S=Math.hypot(x.x,x.z)||1,w=Math.hypot(y.x,y.z)||1;return{rightX:x.x/S,rightZ:x.z/S,forwardX:y.x/w,forwardZ:y.z/w}},addShake(x){!Number.isFinite(x)||x<=0||(h=Math.min(1,h+x))},shakeLevel(){return h},addKick(x,y,S){if(!Number.isFinite(x)||!Number.isFinite(y)||!(S>0))return;const w=Math.hypot(x,y);w<1e-4||(m=x/w*S,v=y/w*S,g=1,p++)},kickLevel(){return g},kickCount(){return p},setZoom(x){u=Number.isFinite(x)&&x>0?x:1},smart(){return{...d}}}}const Za=Math.PI*2,Gn=1e-6;function an(n,t,e){return n<t?t:n>e?e:n}function n0(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function l2(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function i0(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=l2(n);return i===1?a:e+(a-e)*i}function fp(n){return(1-Math.sin(n))/2}function Lh(n,t,e){const i=Math.PI/180,a=an(Number.isFinite(t)?t:100,0,180),s=an(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const c=an((o-n)/(o-r),0,1);return 1-c*c*(3-2*c)}function gc(n,t,e,i){const a=t>=0?1:-1,o=2/Math.max(Gn,i)*Math.max(0,e),r=an(n,-1,1),c=a-r;return Math.abs(c)<=o?a:r+Math.sign(c)*o}function pp(n){const t=an(Number.isFinite(n)?n:1,-1,1),e=Math.abs(t);return Math.sign(t)*e*e*(3-2*e)}function d2(n,t,e,i){if(!(e>0))return t;const a=e*Math.max(0,i),s=t-n;return Math.abs(s)<=a?t:n+Math.sign(s)*a}const mp=30*Math.PI/180,h2=100*Math.PI/180,u2=.06,f2=.22;function a0(n){return an((Math.abs(n)-mp)/(h2-mp),0,1)}function s0(n,t,e,i=u2,a=f2){const s=an(n,0,1),o=an(t,0,1),r=o>s?Math.max(Gn,i):Math.max(Gn,a),c=e/r*1,l=o-s;return Math.abs(l)<=c?o:s+Math.sign(l)*c}function o0(n,t,e,i,a){if(!(e>0))return t;const s=1-an(a,0,1);return s<=1e-9?n:d2(n,t,s*e,i)}function xc(n,t){if(!n.grounded||n.speed<Gn)return n0();const e=n.speed/Math.max(n.moveSpeed,Gn),i=Math.max(n.legLength,Gn),a=n.stride>Gn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),c=Math.abs(n.localRight),l=r+c+Gn,d=Lh(n.localForward/Math.max(n.speed,Gn),t.backStrafeStartDeg,t.backStrafeFullDeg),u=c/l*d,h=r/l+c/l*(1-d),f=pp(n.dirF??(n.localForward>=0?1:-1)),m=pp(n.dirR??(n.localRight>=0?1:-1)),v=a,g=F=>Math.asin(an(F,-o,o)/i);function p(F,C){const T=i0(F,t.plantLock),B=fp(F),G=f*h*v*T,$=-g(G),it=C*m>0?1:-1,ht=1+it*t.crossStep*.45,yt=m*it*t.crossStep*v*.4*B,Lt=m*u*v*t.sideWeight*ht*T+yt*u,q=g(Lt),k=t.kneeLift*B*s*(.55+.25*h+.1*u*(1+C*m));return{pitchX:$,rollZ:q,kneeX:k}}const b=(n.phase%Za+Za)%Za,x=p(b,-1),y=p((b+Math.PI)%Za,1),S=Math.cos(b),w=fp(b),E=-t.comSway*s*S*(.6*h+.8*u)-m*t.comSway*s*u*.45,A=t.comBob*w*s,_=m*t.hipLean*s*u*S*.6,M=m*t.hipLean*s*u*(.45+.25*S),P=t.armSwing*s*S*(h*f+.3*u),I=P,L=-P;return{legL:x,legR:y,pelvisX:E,pelvisY:A,pelvisRoll:_,sideLean:M,armL:I,armR:L,strafe:u,backward:f<0?h:0}}function r0(n){const t=(n%Za+Za)%Za,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function c0(n,t,e){const i=an(e.progress,0,1);if(i>=1||n.speed<Gn)return n0();const a=i*i*(3-2*i),s=1-a;return xc({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function l0(n,t,e,i){const a=an(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return an(o*a,-1,1)*(e*Math.PI/180)}function d0(n,t=0){const e=an(n,0,1);return e*e+(1-e*e)*an(t,0,1)}function h0(n,t,e){if(!(n>0)||!(t>0))return 0;const i=an(e,0,1);return t+(n-t)*i}function u0(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,c=an(i,0,1);return e*c+r*(1-c)}function f0(n,t,e,i,a){const s=Math.max(e,Gn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,c=t>Gn?(t-n)/t:0,l=c>.02,d=c<-.015,u=n<=o*.15,h=!d&&n<r&&(l||u);return{enter:n>Gn&&n<=o&&l,resume:!h}}function p0(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return an(n*an(t,0,2),-i,i)}function m0(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function g0(n,t,e){const i=an(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function p2(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=an(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,c=r?1:.35,l=r?.35:1,d=Math.max(0,e.turnStepPitch)*o,u=Math.max(0,e.turnStepKnee)*o,h=Math.max(0,e.turnStepPitch)*.35*o,f=r?1:-1;return{legL:{pitchX:-d*c,rollZ:f*h*c,kneeX:u*c},legR:{pitchX:-d*l,rollZ:-f*h*l,kneeX:u*l},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function x0(n,t,e,i,a){const s=an(n,0,1),o=an(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),c=r*r*(3-2*r),l=s<=o?c:1-c,d=Math.hypot(e,i),u=d>Gn?e/d:1,h=d>Gn?i/d:0,f=i0(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*l,trailPitch:Math.max(0,a.stopTrailPitch)*l,leadKnee:Math.max(0,a.stopStepKnee)*l,bodyShift:Math.max(0,a.stopBodyShift)*l,bodyDip:Math.max(0,a.stopBodyDip)*l,chestPitch:Math.max(0,a.stopChestPitch)*l,leadLeft:f,fwdN:u,rightN:h,env:l}}function kn(n){return n<0?0:n>1?1:n}const Jr=Math.PI*2;function m2(n){return((n+Math.PI)%Jr+Jr)%Jr-Math.PI}function g2(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function x2(n,t,e,i,a,s=n.phase){const o=kn(i);if(o<=0)return n;const r=kn(t),c=Math.max(1,Math.round(a.cycles)),l=Math.max(0,a.strideSpeed),d=e%2===0?1:-1,u=kn(a.forwardBias),h=Math.max(0,n.stride??0),f=Math.max(0,a.strideScale??0)*h,m=r*r*(3-2*r),v={speed:l,phase:s+Jr*c/2*m,localForward:l*u,localRight:l*(1-u)*d},g=m2(v.phase-n.phase),p=o*o*(3-2*o),b=n.speed>.05?h:0;return{speed:n.speed+(v.speed-n.speed)*o,phase:n.phase+g*p,localForward:n.localForward+(v.localForward-n.localForward)*o,localRight:n.localRight+(v.localRight-n.localRight)*o,stride:b+(f-b)*o*o}}function v2(n,t,e){const i=g2(),a=kn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,c=o>0,l=e.stepPitch*s,d=e.stepKnee*s,u=e.stepSide*s;return i.legL.pitchX=r?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=r?d:d*.4,i.legR.kneeX=c?d:d*.4,i.legL.rollZ=-u*o,i.legR.rollZ=u*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=u*.25*o,i}function v0(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function gp(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*v0(s,a)}function y2(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function M2(n,t,e){const i=kn(n);return{gaitScale:1-i*(1-kn(t)),attackLegWeight:kn(e)*i}}function _2(n,t,e){const i=kn(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function b2(n,t){const e=kn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function S2(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return kn(t.minScale+(1-t.minScale)*e)}function y0(){return M0()}function M0(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function w2(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function E2(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?kn(t.forceHitHeight):n.type==="light"?kn(t.hitHeight.light):n.type==="heavy"?kn(t.hitHeight.heavy):n.type==="knock"?kn(t.hitHeight.knock):0}function T2(n,t,e){const i=kn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function _0(n,t,e){const i=M0(),a=w2(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=kn(1-n.timer/n.duration),o=v0(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=E2(n,e);const r=Math.sin(t),c=Math.cos(t),l=Math.cos(t),d=-Math.sin(t),u=n.dirX*r+n.dirZ*c,h=n.dirX*l+n.dirZ*d;if(i.localFwd=u,i.localRight=h,!e.enabled){i.legacy=!0;const v=Math.sin(Math.PI*s);return i.upperPitch=a*v*u,i.upperRoll=-a*v*h*.7,i.drop=(a>.5?.09:.04)*v,i.flash=e.flashStrength*v,i.active=v>0,i}const f=a*o,m=T2(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=f*(m.upperPitch*u+m.fold),i.upperRoll=-f*m.upperRoll*h,i.upperYaw=f*m.upperYaw*h,i.upperShift=f*m.shift,i.upperShiftX=i.upperShift*h,i.upperShiftZ=i.upperShift*u,i.comShift=f*e.comShift,i.comX=i.comShift*h,i.comZ=i.comShift*u,i.pelvisBack=f*m.back,i.drop=f*m.drop,i.knee=f*m.knee,i.hip=f*m.hip,i.arm=f*m.arm,i.flash=e.flashStrength*o,i}function b0(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const Ua=1e-6;function Uo(n,t,e){return n<t?t:n>e?e:n}function S0(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=Ua||s<=Ua||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,c=Math.abs(a-s)+Ua,l=Math.hypot(n.x,n.y,n.z);if(l<=Ua)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(n.x,-n.y),u=Math.hypot(n.x,n.y),h=n.z,f=Math.hypot(h,u),m=Uo(f,c,r),v=f>r+Ua||f<c-Ua,g=Math.atan2(-h,Math.max(u,Ua)),p=Uo((a*a+m*m-s*s)/(2*a*m),-1,1),b=Uo((s*s+m*m-a*a)/(2*s*m),-1,1),x=Math.acos(p),y=Math.acos(b),S=i>=0?1:-1;return{rootPitch:g-S*x,rootRoll:d,jointPitch:S*(x+y),clamped:v,reach:l/r}}function w0(n,t,e,i){const a=Uo(e,0,1),s=Math.max(0,i),o=(r,c)=>{const l=Uo((c-r)*a,-s,s);return r+l};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function E0(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Dh={active:!1,weight:0,clamped:0,maxError:0};function T0(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...Dh};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=a.map(f=>f.tip.getWorldPosition(new Y));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),d=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let u=0;for(let f=0;f<a.length;f++){const m=a[f],v=i.worldToLocal(c[f].clone()),g={x:v.x-m.root.position.x,y:v.y-m.root.position.y,z:v.z-m.root.position.z},p=S0(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(u+=1);const b=w0({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,l,d);m.root.rotation.x=b.rootPitch,m.root.rotation.z=b.rootRoll,m.joint.rotation.x=b.jointPitch}t.updateWorldMatrix(!0,!0);let h=0;for(let f=0;f<a.length;f++){const m=a[f].tip.getWorldPosition(new Y);h=Math.max(h,m.distanceTo(c[f]))}return{active:!0,weight:l,clamped:u,maxError:h}}function Nn(n,t,e){return n<t?t:n>e?e:n}function A2(n,t,e,i,a,s,o,r,c,l){const d=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new xe,h=new xe;h.name="pelvis",h.position.y=n.legLength,u.add(h);const f=new xe;f.name="lower";const m=new xe;m.name="upper",h.add(f),h.add(m);const v=[],g=(K,gt,Nt,Ot)=>{const It=new gi({color:Ot}),N=new me(new zn(K,gt,Nt),It);return N.castShadow=!0,N.receiveShadow=!0,v.push(It),N},p=n.headSize,b=n.legLength,x=n.armLength,y=n.limbThickness,S=n.bodyHeight,w=n.bodyWidth,E=g(w,S,.28,e);E.position.y=S/2,m.add(E);const A=new xe;A.name="headPivot",A.rotation.order="YXZ",A.position.y=S,m.add(A);const _=g(p,p,p,e);_.position.y=p/2,A.add(_);for(const K of[-1,1]){const gt=g(.06,.07,.02,t.shoe);gt.position.set(K*.09,p/2+.03,p/2+.011),A.add(gt)}const M=(K,gt)=>{const Nt=gt?x:b,Ot=new xe;Ot.name=gt?K<0?"shoulderL":"shoulderR":K<0?"hipL":"hipR",gt||(Ot.rotation.order="ZYX"),Ot.position.set(K*(gt?w/2+y/2:w/2-y/2),gt?S-.04:0,0),(gt?m:f).add(Ot);const It=g(y,Nt/2,y,t.limb);It.position.y=-Nt/4,Ot.add(It);const N=new xe;N.name=gt?"elbow":"knee",N.position.y=-Nt/2,Ot.add(N);const At=g(y,Nt/2,y,t.limb);if(At.position.y=-Nt/4,N.add(At),!gt){const X=g(y*1.15,.07,y*1.7,t.shoe);X.position.set(0,-Nt/2+.035,.045),N.add(X);const lt=new nn;return lt.name="footTip",lt.position.y=-Nt/2,N.add(lt),{root:Ot,joint:N,tip:lt}}return{root:Ot,joint:N}},P=M(-1,!1),I=M(1,!1),L=M(-1,!0),F=M(1,!0),C=[P,I].map(K=>({root:K.root,joint:K.joint,tip:K.tip,upperLen:b/2,lowerLen:b/2,bend:1})),T=new xn({color:a.attackArcColor,transparent:!0,opacity:0,side:qe,depthWrite:!1}),B=new me(new Rc(.62,.042,6,20,Math.PI*1.1),T);B.position.set(0,.78-b,.56),m.add(B);const G=new ee(e),$=new ee(r.flashColor),it=new ee;let ht=null,yt=0,Lt=0,q=0,k=0,Z=0,j=0,pt=0,dt={...Dh},_t=-1,Yt=0,J=0,W=0,O=0,Pt=0,ot=0,at=0,Tt=1,mt=0,zt=0,D=0,R=0,Q=-1,ut=0,ft="none",st=0,kt=!1,Et=-1,wt=!1,Xt=0,xt=0,Ut=1,V=1;return{group:u,boneAtWorld(K,gt,Nt){const Ot=[{node:m,ax:0,ay:.05,az:0,bx:0,by:S,bz:0},{node:A,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:L.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:L.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:P.root,ax:0,ay:0,az:0,bx:0,by:-b/2,bz:0},{node:P.joint,ax:0,ay:0,az:0,bx:0,by:-b/2,bz:0},{node:I.root,ax:0,ay:0,az:0,bx:0,by:-b/2,bz:0},{node:I.joint,ax:0,ay:0,az:0,bx:0,by:-b/2,bz:0}],It=new Y,N=new Y,At=new Y(K,gt,Nt),X=new Y;let lt=null,Ct=Number.POSITIVE_INFINITY;for(const Dt of Ot){Dt.node.updateWorldMatrix(!0,!1),It.set(Dt.ax,Dt.ay,Dt.az),N.set(Dt.bx,Dt.by,Dt.bz),Dt.node.localToWorld(It),Dt.node.localToWorld(N);const Kt=N.x-It.x,oe=N.y-It.y,de=N.z-It.z,Qt=Kt*Kt+oe*oe+de*de;let we=Qt>1e-8?((At.x-It.x)*Kt+(At.y-It.y)*oe+(At.z-It.z)*de)/Qt:0;we=Math.max(0,Math.min(1,we));const ze=It.x+Kt*we,Je=It.y+oe*we,Mn=It.z+de*we,Pe=(At.x-ze)**2+(At.y-Je)**2+(At.z-Mn)**2;Pe<Ct&&(Ct=Pe,lt=Dt.node,X.set(ze,Je,Mn))}return lt?{node:lt,point:X.clone()}:null},update(K,gt,Nt){const Ot=Nt===void 0||Q<0?gt:Nn(Nt-Q,0,.1);Nt!==void 0&&(Q=Nt),u.position.set(K.position.x,K.position.y,K.position.z),u.rotation.y=K.bodyYaw,A.rotation.y=(K.headYaw-K.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,K.mode!==ht&&(ht=K.mode,yt=1),yt=Math.max(0,yt-gt*2.2);const It=K.hurt,N=_0(It,K.bodyYaw,r),At=N.flash;it.copy($).multiplyScalar(At);for(const ge of v)ge.emissive.copy(G).multiplyScalar(yt*.5),At>0&&ge.emissive.add(it);h.position.set(0,b,0),h.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),f.position.set(0,0,0),f.rotation.z=0;const X=Math.hypot(K.velocity.x,K.velocity.z),lt=Nn(o.knockGaitScale??0,0,1),Ct=K.hurt.knockX*lt,Dt=K.hurt.knockZ*lt,Kt=lt>0&&Math.hypot(K.hurt.knockX,K.hurt.knockZ)>.001,oe=K.velocity.x+Ct,de=K.velocity.z+Dt,Qt=Math.hypot(oe,de),we=Math.cos(K.bodyYaw),ze=-Math.sin(K.bodyYaw),Je=X>1e-6?Nn((K.velocity.x*we+K.velocity.z*ze)/X,-1,1):0,Mn=X>1e-6?Nn((K.velocity.x*Math.sin(K.bodyYaw)+K.velocity.z*Math.cos(K.bodyYaw))/X,-1,1):1,Pe=Lh(Mn,o.backStrafeStartDeg,o.backStrafeFullDeg);ft==="settled"&&wt&&Xt>xt*1.02+1e-4&&(ft="none");let Fe=1;ft==="blend"?(Fe=g0(kt?Et:st,o.stopYawBlendMode,kt),kt||(st=Math.min(1,st+gt/Math.max(.01,o.stopYawAfterSec)),(st>=1||o.stopYawBlendMode==="inStop"||wt)&&(ft="settled",Fe=0))):ft==="settled"&&(Fe=Nn(X/Math.max(1e-6,o.stopEnterRatio*s),0,1));const mn=l0(Je,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),Xn=Ot>1e-6?Xe(K.bodyYaw-D)/Ot:0;D=K.bodyYaw;const sn=(o.hipYawTrackRateDeg??0)*Math.PI/180,An=(o.hipYawBackRateDeg??0)*Math.PI/180,_n=Ot>1e-6?Ot:gt;R=sn>0?s0(R,a0(Xn),_n):0;const $n=d0(Pe,R),Zn=Nn(X/.5,0,1),ri=u0(Mn,Je,mn,$n)*Fe*Zn,Ei=o0(zt,ri,h0(sn,An,$n),_n,R);zt=Ei,mt+=(Ei-mt)*(1-Math.exp(-12*Math.max(0,_n))),f.rotation.y=mt;const Pn=K.bodyYaw+mt,z=Math.sin(Pn),nt=Math.cos(Pn),ct=Math.cos(Pn),rt=-Math.sin(Pn),tt=oe*z+de*nt,Ft=oe*ct+de*rt,Gt=Math.max(0,o.stopBlendSec||0),Zt=Gt>0&&!Kt,qt=f0(X,ut,s,o.stopEnterRatio,o.stopExitRatio);if(!Zt||qt.resume)_t=-1;else if(_t<0&&qt.enter){_t=0,Yt=K.gaitPhase,J=r0(K.gaitPhase),W=X,O=Math.max(K.stride,1e-6),Pt=tt,ot=Ft;const ge=1/Math.max(1e-6,X);at=K.velocity.x*ge,Tt=K.velocity.z*ge}const se=ut;ut=X;const ie=Zt&&_t>=0;ie&&(_t=Math.min(1,_t+gt/Gt)),ie&&ft!=="blend"&&(ft="blend",st=0),kt=ie&&_t<1,Et=_t,wt=qt.resume,Xt=X,xt=se;const Jt=Math.max(0,o.dirFlipSec??0);Jt>0?(Ut=gc(Ut,tt>=0?1:-1,gt,Jt),V=gc(V,Ft>=0?1:-1,gt,Jt)):(Ut=tt>=0?1:-1,V=Ft>=0?1:-1);const ve=ie?{phase:Yt,speed:W,moveSpeed:s,localForward:Pt,localRight:ot,dirF:Ut,dirR:V,legLength:n.legLength,stride:O,grounded:!0}:{phase:K.gaitPhase,speed:Qt,moveSpeed:s,localForward:tt,localRight:Ft,dirF:Ut,dirR:V,legLength:n.legLength,stride:K.stride,grounded:!0},re=ie?c0(ve,o,{progress:_t,phase0:Yt,phaseEnd:J}):xc(ve,o);let H=0,Rt=0,St=0,bt=0;if(ie){const ge=m0(K.bodyYaw,at,Tt),Te=x0(_t,Yt,ge.forward,ge.right,o);Te.leadLeft?(re.legL.pitchX-=Te.leadPitch,re.legL.kneeX+=Te.leadKnee,re.legR.pitchX+=Te.trailPitch):(re.legR.pitchX-=Te.leadPitch,re.legR.kneeX+=Te.leadKnee,re.legL.pitchX+=Te.trailPitch),Rt=Te.bodyShift*Te.fwdN,H=Te.bodyShift*Te.rightN,St=Te.bodyDip,bt=Te.chestPitch}P.root.rotation.x=re.legL.pitchX,I.root.rotation.x=re.legR.pitchX,P.root.rotation.z=re.legL.rollZ,I.root.rotation.z=re.legR.rollZ,P.joint.rotation.x=re.legL.kneeX,I.joint.rotation.x=re.legR.kneeX,L.root.rotation.x=re.armL,F.root.rotation.x=re.armR,L.joint.rotation.x=-.18,F.joint.rotation.x=-.18,h.position.x=re.pelvisX,h.position.y=b+re.pelvisY,h.position.z=0,h.rotation.z=re.pelvisRoll,m.rotation.z=re.sideLean*(N.intensity>0?.4:1);const te=E0(h,f),Bt=ie&&d.enabled?{...d,weight:1}:d,le=Bt.enabled&&Bt.weight>0?Nn(Bt.weight,0,1):0;if(h.position.x+=H,h.position.z+=Rt,h.position.y-=St,f.position.y+=St,le<=0&&(f.position.x-=H,f.position.z-=Rt),c){const ge=Math.max(.004166666666666667,Math.min(gt,.1)),Te=Math.sin(K.bodyYaw),Ve=Math.cos(K.bodyYaw),ln=Nn((K.velocity.x-Lt)/ge,-60,60),bn=Nn((K.velocity.z-q)/ge,-60,60),ci=ln*Te+bn*Ve,jn=Xe(K.bodyYaw-k)/ge,li=c.maxForwardDeg*Math.PI/180,Hi=c.maxSideDeg*Math.PI/180,Sn=1-Math.exp(-Math.max(0,c.smoothing)*ge);Z+=(Nn(ci*c.accelGain,-li,li)-Z)*Sn,j+=(Nn(-jn*X*c.turnGain,-Hi,Hi)-j)*Sn;const Gi=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;pt+=(Nn(X/Math.max(s,1e-6),0,1)-pt)*(1-Math.exp(-Math.max(0,Gi)*ge));const qn=b0({leanForward:Z,leanSide:j,speedRatio:pt},c);m.rotation.x+=Z+bt,m.rotation.z+=j,h.rotation.x+=qn.pelvisPitch,h.rotation.z+=qn.pelvisRoll,h.position.x+=qn.pelvisX,h.position.z+=qn.pelvisZ,h.position.y-=qn.crouch,f.position.y+=qn.crouch*(1-le)}Lt=K.velocity.x,q=K.velocity.z,k=K.bodyYaw,m.rotation.x+=N.upperPitch,m.rotation.z+=N.upperRoll,m.rotation.y+=N.upperYaw;const Re=Nn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Se=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Nn(N.upperShiftX*Re,-Se,Se),m.position.z+=Nn(N.upperShiftZ*Re,-Se,Se),h.position.x+=N.comX,h.position.z+=N.comZ-N.pelvisBack,h.position.y-=N.drop;const Ce=N.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(f.position.z+=N.pelvisBack*(1-Ce),f.position.y+=N.drop*(1-Ce),P.joint.rotation.x+=N.knee,I.joint.rotation.x+=N.knee,P.root.rotation.x-=N.hip,I.root.rotation.x-=N.hip,L.root.rotation.x+=N.arm,F.root.rotation.x+=N.arm*.8,K.attackPhase!=="idle"&&N.intensity===0){const ge=K.attackProgress,Te=ge<.34?-1:ge<.68?-1+(ge-.34)/.34*2:Math.max(0,1-(ge-.68)/.32),Ve=Math.max(0,-Te),ln=Math.max(0,Te);F.root.rotation.x=-1.7*Ve+1.25*ln,F.joint.rotation.x=-(.25+Ve*.45),m.rotation.y=-.28*Te,T.opacity=K.attackPhase==="active"?.85:0,K.attackPhase==="active"&&(B.rotation.z=-1.1+ge*3)}else T.opacity=0;const ye=p0(mt,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=ye,A.rotation.y=(K.headYaw-K.bodyYaw-ye+Math.PI*3)%(Math.PI*2)-Math.PI,dt=T0({root:u,pelvis:h,lower:f,limbs:C,base:te,cfg:Bt,grounded:!0,attacking:K.attackPhase!=="idle"})},ik(){return dt},dispose(){u.traverse(K=>{if(K instanceof me){K.geometry.dispose();const gt=K.material;Array.isArray(gt)?gt.forEach(Nt=>Nt.dispose()):gt.dispose()}})}}}const R2=9.81;function Ao(n,t,e){return n<t?t:n>e?e:n}function P2(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:R2,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,c=0,l=0,d=0;for(const _ of n){const M=Number.isFinite(_.mass)&&_.mass>0?_.mass:0;!Number.isFinite(_.x)||!Number.isFinite(_.y)||!Number.isFinite(_.z)||(r+=M,c+=_.x*M,l+=_.y*M,d+=_.z*M)}if(r<=1e-6)return o;c/=r,l/=r,d/=r;const u=Math.max(.02,(t.maxX-t.minX)/2),h=Math.max(.02,(t.maxZ-t.minZ)/2),f=(t.minX+t.maxX)/2,m=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:c,comY:l,comZ:d,centerX:f,centerZ:m,halfX:u,halfZ:h};const g=Ao((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,l)/s)*g*4,b=c+(Number.isFinite(e)?e:0)*p,x=d+(Number.isFinite(i)?i:0)*p,y=Math.abs(b-f)/u,S=Math.abs(x-m)/h,w=Ao(1-Math.max(y,S),0,1),E=Math.max(0,Math.abs(b-f)-u),A=Math.max(0,Math.abs(x-m)-h);return{comX:c,comY:l,comZ:d,xcomX:b,xcomZ:x,centerX:f,centerZ:m,halfX:u,halfZ:h,marginX:Ao(1-y,-1,1),marginZ:Ao(1-S,-1,1),score:w,leanDeg:Math.atan2(b-f,x-m)*180/Math.PI,side:y>.98?b>f?1:-1:0,overX:E,overZ:A,grounded:!0}}function C2(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function L2(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=Ao(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const Jd={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},D2=1e-6;function ai(n,t,e){return n<t?t:n>e?e:n}function Nl(n,t){const e=Math.max(.2,n);return ai(Math.pow(e,-t),.5,2)}function k2(n,t){if(!t.enabled)return{...Jd};const e=ai(n.swing,-1,1),i=ai(n.charge,0,1),a=ai(n.impact,0,1),s=ai(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),c=1+(Math.max(1,t.swingArm)-1)*r,l=Math.max(0,-e),d=ai(t.chargeArm,.6,1),u=1-(1-d)*l,h=1-(1-d)*i;let f=1;o>0?f=c:l>0?f=u:i>0&&(f=h);const m=1-ai(t.impactSquash,0,.6)*a;f*=m;const v=Math.max(1,t.runLeg),p=(n.grounded?1+(v-1)*s:1)*(1-ai(t.impactSquash,0,.6)*a*.6),b=ai(t.torsoGain,0,1),x=1+(f-1)*b;return f=ai(f,.6,1.6),{arm:f,leg:ai(p,.6,1.4),torso:ai(x,.7,1.4),girthArm:Nl(f,t.volumeExp),girthLeg:Nl(p,t.volumeExp),girthTorso:Nl(x,t.volumeExp)}}function I2(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function z2(n,t,e){const i=n*Math.exp(-Math.max(D2,e)*Math.max(0,t));return i<.001?0:ai(i,0,1)}const xp=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function Hs(n,t,e){return n<t?t:n>e?e:n}function Be(n,t,e){return n+(t-n)*e}function F2(n){return n?typeof n=="string"?{clip:n}:n:null}function U2(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function N2(n,t){const e=n%3*2,i=xp[e],a=xp[e+1];return{...U2(),bodyYaw:Be(i.yaw,a.yaw,t),bodyPitch:Be(i.pitch,a.pitch,t),bodyRoll:Be(i.roll,a.roll,t),pelvisX:Be(i.px,a.px,t),pelvisZ:Be(i.pz,a.pz,t),armPitch:Be(i.ap,a.ap,t),armYaw:Be(i.ay,a.ay,t),armRoll:Be(i.ar,a.ar,t),elbow:Be(i.el,a.el,t),bladePitch:Be(i.blade,a.blade,t)}}function O2(n,t,e,i,a=0){var _,M,P;const s=((_=i.combo)==null?void 0:_[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,c=F2(s[r]),l=c?((M=i.clips)==null?void 0:M[c.clip])??null:null,d=Hs(((P=i.weaponScale)==null?void 0:P[n])??1,0,2),u=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,h=c&&Number.isFinite(c.scale)?c.scale:d,f=h*u,m=Hs((e+1)/2,0,1),v=l&&l.keys.length>0?Pv(l,m):N2(r,m),g=((c==null?void 0:c.lead)??(l==null?void 0:l.lead)??"R")==="L"?"L":"R",p=(l==null?void 0:l.kind)??["right-left","left-right","overhead"][r]??"custom",b=n==="dual-swords",x=l&&Pa(l,"bladeTwistOff")?v.bladeTwistOff:b?v.bladeTwist:0,y=l&&Pa(l,"bladeYawOff")?v.bladeYawOff:-v.bladeYaw,S={yaw:v.bodyYaw*f,rootYaw:v.rootYaw*f,spinYaw:Cv(l,Hs(a,0,1)),pitch:v.bodyPitch*f,roll:v.bodyRoll*f,pelvisZ:v.pelvisZ*f,pelvisX:v.pelvisX*f,armR:null,armL:null,bladePitch:v.bladePitch,bladePitchOff:l&&Pa(l,"bladePitchOff")?v.bladePitchOff:null,bladeTwist:v.bladeTwist,bladeTwistOff:x,bladeYaw:v.bladeYaw,bladeYawOff:y,lead:g,kind:p,strike:m,blend:c&&Number.isFinite(c.blend)?c.blend:null},w={pitch:v.armPitch*h,yaw:v.armYaw*h,roll:v.armRoll*h,elbow:v.elbow*h},E=l?Pa(l,"armLPitch")||Pa(l,"armLYaw")||Pa(l,"armLRoll")||Pa(l,"elbowL"):!1,A=E?{pitch:v.armLPitch*h,yaw:v.armLYaw*h,roll:v.armLRoll*h,elbow:v.elbowL*h}:{pitch:w.pitch+(n==="greatsword"?.08:.1),yaw:w.yaw*.8,roll:n==="greatsword"?.4:-w.roll*.6,elbow:w.elbow};return g==="L"?(S.armL=w,S.armR=n==="greatsword"?null:A):(S.armR=w,(n==="greatsword"||n==="dual-swords"||E)&&(S.armL=A)),S}function B2(n,t,e){const i=Hs(e,0,1),a=(s,o)=>s?o?{pitch:Be(s.pitch,o.pitch,i),yaw:Be(s.yaw,o.yaw,i),roll:Be(s.roll,o.roll,i),elbow:Be(s.elbow,o.elbow,i)}:null:o;return{yaw:Be(n.yaw,t.yaw,i),rootYaw:Be(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Be(n.pitch,t.pitch,i),roll:Be(n.roll,t.roll,i),pelvisZ:Be(n.pelvisZ,t.pelvisZ,i),pelvisX:Be(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Be(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Be(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Be(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Be(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Be(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Be(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Be(n.strike,t.strike,i),blend:t.blend??null}}function H2(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function vp(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function G2(n,t){const e=(a,s)=>Math.abs(H2(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=vp(n.armR,t.armR),i+=vp(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function X2(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),c=Math.max(.1,e.segBlendRef??6),l=Hs(G2(n,t)/c,0,1);return o+(r-o)*l}function yp(n){const t=Hs(n,0,1);return t*t*(3-2*t)}const V2={omega:11,follow:.82,maxAngle:.85};function W2(){return{ang:[0,0,0],vel:[0,0,0],ready:!1}}function Y2(n,t,e,i){const a={...V2};if(!(t>0))return n.ang;if(!n.ready)return n.ang=[0,0,0],n.vel=[0,0,0],n.ready=!0,n.ang;const s=Math.min(4,Math.max(1,Math.ceil(t/(1/90)))),o=t/s,r=a.omega;for(let c=0;c<s;c++)for(let l=0;l<3;l++){const d=l===0?0:n.ang[l-1]*a.follow,u=r*r*(d-n.ang[l])-2*r*n.vel[l]+(l===0?e:0);n.vel[l]+=u*o,n.ang[l]+=n.vel[l]*o,n.ang[l]>a.maxAngle&&(n.ang[l]=a.maxAngle,n.vel[l]=0),n.ang[l]<-a.maxAngle&&(n.ang[l]=-a.maxAngle,n.vel[l]=0)}return n.ang}function Ge(n,t,e,i){const a=new me(new zn(n,t,e),new gi({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function Ze(){return new xe}function Qr(n,t,e){const i=Ze(),a=Ge(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Ge(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Ge(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Ge(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const c=Ge(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function $2(n){const t=Qr(.72,.15,n),e=Ge(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function Z2(n){const t=Ze(),e=Ge(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Ge(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function j2(n){const t=Ze(),e=Ge(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Ge(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new ee(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function q2(n){const t=Ze();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Ge(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Ge(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function K2(n){const t=Ze(),e=Ge(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Ge(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function pe(n,t,e){return n<t?t:n>e?e:n}const qi=1e-6;function A0(n,t,e,i,a,s,o,r,c,l,d,u,h){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},m=u??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},v=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=c.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=c.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},b=Ze(),x=Ze();x.name="pelvis",x.position.y=n.legLength,b.add(x);const y=Ze();y.name="lower";const S=Ze();S.name="upper",x.add(y),x.add(S);const w=n.headSize,E=n.style,A=E!=null&&E.headScale&&E.headScale>0?E.headScale:1,_=w*A,M=Math.max(0,(E==null?void 0:E.beard)??0),P=Math.max(0,(E==null?void 0:E.hunch)??0),I=Math.max(0,(E==null?void 0:E.kneeSink)??0),L=n.legLength,F=n.armLength,C=n.limbThickness,T=n.bodyHeight,B=n.bodyWidth,G=c.spine,$=!!(G!=null&&G.enabled),it=$?pe(G.chestPivot??.42,.15,.85)*T:0,ht=Ze();ht.name="chest",ht.position.y=it,S.add(ht);const yt=$?ht:S;let Lt,q=null,k=T,Z=0;$?(k=Math.max(.05,it),Z=Math.max(.05,T-it),Lt=Ge(B,k,.28,t.body),Lt.name="torsoLower",Lt.position.y=k/2,S.add(Lt),q=Ge(B+.008,Z,.288,t.body),q.name="torsoUpper",q.position.y=Z/2,ht.add(q)):(Lt=Ge(B,T,.28,t.body),Lt.name="torso",Lt.position.y=T/2,S.add(Lt));const j=Ze();j.name="headPivot",j.rotation.order="YXZ",j.position.y=Math.min(i.headPivotHeight,T)-it,yt.add(j);const pt=Ge(_,_,_,t.head);pt.position.y=_/2,j.add(pt);const dt=new gi({color:"#1b2733"});for(const U of[-1,1]){const et=new me(new zn(.06*A,.07*A,.02*A),dt);et.position.set(U*.09*A,(w/2+.03)*A,(w/2+.011)*A),j.add(et)}const _t=[];let Yt=null;if(E!=null&&E.balding){const U=E.hairColor??"#e8e8e8",et=new gi({color:U}),vt=(Mt,$t,jt,ae,Me,He)=>{const fe=new me(new zn(Mt,$t,jt),et);fe.position.set(ae,Me,He),j.add(fe)};for(const Mt of[-1,1])vt(_*.06,_*.62,_*.52,Mt*(_/2+.003),_*.5,-_*.02);vt(_*.7,_*.42,_*.09,0,_*.5,-(_/2+.004)),vt(_*.7,_*.06,_*.36,0,_*.965,-_*.14);for(const Mt of[-1,1])vt(_*.24,_*.035,_*.03,Mt*_*.2,_*.655,_/2+.006)}if(P>0){const U=Ge(_*.46,_*.3,_*.46,t.head);U.position.set(0,-_*.12,-_*.04),j.add(U)}if(M>0){const U=(E==null?void 0:E.beardColor)??"#f2f2f2",et=new gi({color:U}),vt=M/3;let Mt=j;for(let $t=0;$t<3;$t++){const jt=Ze();jt.name=`beard${$t}`,jt.position.set(0,$t===0?_*.02:-vt,$t===0?Math.max(_*.5,.135):0),Mt.add(jt);const ae=_*[.52,.44,.36][$t],Me=new me(new zn(ae,vt*1.06,_*(.2-$t*.04)),et);Me.position.y=-vt/2,jt.add(Me),_t.push(jt),Mt=jt}Yt=W2()}const J=U=>{const et=Ze();et.name=U<0?"hipL":"hipR",et.rotation.order="ZYX",et.position.set(U*(B/2-C/2),0,0),y.add(et);const vt=Ge(C,L/2,C,t.limb);vt.position.y=-L/4,et.add(vt);const Mt=Ze();Mt.name="knee",Mt.position.y=-L/2,et.add(Mt);const $t=Ge(C,L/2,C,t.limb);$t.position.y=-L/4,Mt.add($t);const jt=Ge(C*1.15,.07,C*1.7,t.shoe);jt.position.set(0,-L/2+.035,.045),Mt.add(jt);const ae=new nn;ae.name="footTip",ae.position.y=-L/2,Mt.add(ae);const Me=Ze();return{root:et,joint:Mt,hand:Me,wrist:Me,tip:ae,upperMesh:vt,lowerMesh:$t,segLen:L/2}},W=U=>{const et=Ze();et.name=U<0?"shoulderL":"shoulderR",et.rotation.order="YXZ",et.position.set(U*(B/2+C/2),T-.04-it,0),yt.add(et);const vt=Ge(C,F/2,C,t.limb);vt.position.y=-F/4,et.add(vt);const Mt=Ze();Mt.name="elbow",Mt.position.y=-F/2,et.add(Mt);const $t=Ge(C,F/2,C,t.limb);$t.position.y=-F/4,Mt.add($t);const jt=Ze();jt.name=U<0?"handL":"handR",jt.position.y=-F/2,Mt.add(jt);const ae=Ge(C*1.1,.09,C*1.1,t.head);ae.position.y=.045,jt.add(ae);const Me=Ze();return Me.name=U<0?"wristL":"wristR",jt.add(Me),{root:et,joint:Mt,hand:jt,wrist:Me,upperMesh:vt,lowerMesh:$t,segLen:F/2}},O=J(-1),Pt=J(1),ot=W(-1),at=W(1),Tt=[O,Pt].map(U=>({root:U.root,joint:U.joint,tip:U.tip,upperLen:L/2,lowerLen:L/2,bend:1})),mt=Ze(),zt=Ze();mt.name="mountR",zt.name="mountL";const D=Ze(),R=Ze();D.name="gripR",R.name="gripL",at.wrist.add(mt),ot.wrist.add(zt),mt.add(D),zt.add(R);const Q=j2(t),ut=q2(t),ft=K2(t),st={"sword-shield":{right:Qr(.42,.075,t),left:Z2(t)},"dual-swords":{right:Qr(.42,.075,t),left:Qr(.42,.075,t)},greatsword:{right:$2(t),left:Ge(.12,.2,.12,t.wood)},staff:{right:Q.g,left:Ze(),orb:Q.orb},bow:{right:ft,left:ut.g,arrow:ft,drawString:ut.drawString}};for(const U of Object.keys(st))D.add(st[U].right),R.add(st[U].left),st[U].right.visible=!1,st[U].left.visible=!1;function kt(U,et,vt){const Mt=new nn;Mt.name="bladeBase",Mt.position.y=et,U.add(Mt);const $t=new nn;$t.name="bladeTip",$t.position.y=vt,U.add($t)}kt(st["sword-shield"].right,.44,.55),kt(st["dual-swords"].right,.44,.55),kt(st["dual-swords"].left,.44,.55),kt(st.greatsword.right,.74,.88),kt(st.staff.right,.78,.92);let Et=null,wt=null,Xt=1,xt=0,Ut=0,V=null,K=0,gt=0,Nt=0,Ot=0,It=0,N=0,At=y0(),X={...Dh},lt=0,Ct=0,Dt=0,Kt=0,oe=0,de=-1,Qt=-1,we=0,ze=0,Je=0,Mn=0,Pe=0,Fe=0,mn=0,Xn=1,sn=0,An=0,_n=0,$n=0,Zn=!1,ri=0,Ei=-1,Pn=0,z=0,nt=0,ct=!1,rt=0,tt=0,Ft=0,Gt=0,Zt="none",qt=0,se=1,ie=!1,Jt=-1,ve=!1,re=0,H=0,Rt=0,St=0,bt={...Jd},te=0,Bt=0,le={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},Re=NaN,Se=0,Ce=0,ye=0,ge=NaN,Te=NaN,Ve=-1,ln=null,bn=null,ci=0,jn=1,li=.1,Hi=null,Sn={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},Gi=null,qn=null,es=null,ns=null,ce=null,Ht=null,he="R",Qe=0,We=0,wn=0,Kn=0,Ea=1,di=0,Ti=null,Ai=0,to=0,is=NaN,Ko=NaN,Jo={speed:0,phase:0},Ta=1,Aa=1,eo={lp:0,lr:0,rp:0,rr:0},L0=0,Pc=0,Cc=!0,Lc=0,no="none",as=0,ss=0,os=0,Qo=.3,zh=0;function D0(U){const et=Math.PI/180,vt=s;let Mt=0,$t=0,jt=0,ae=0;U==="sword-shield"?(Mt=vt.swordPitchDeg*et,jt=vt.shieldPitchDeg*et):U==="dual-swords"?(Mt=vt.swordPitchDeg*et,jt=vt.swordPitchDeg*et):U==="greatsword"?(Mt=vt.greatswordPitchDeg*et,jt=vt.greatswordPitchDeg*et):U==="staff"?Mt=vt.staffPitchDeg*et:jt=vt.bowPitchDeg*et,mt.rotation.set(Mt,0,$t),zt.rotation.set(jt,0,ae),mt.position.x=U==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function Fh(U){if(U!==Et){Et=U;for(const et of Object.keys(st))st[et].right.visible=et===U,st[et].left.visible=et===U;D0(U),ut.drawString.position.z=-.06,ft.position.z=0,Q.orb.scale.setScalar(1),S.rotation.y=0}}Fh("sword-shield");const Uh=[];b.traverse(U=>{U instanceof me&&U.material instanceof gi&&Uh.push(U.material)});const k0=new ee(r.flashColor);function I0(U,et){const vt=_0(U,et,r);At=vt,S.rotation.x+=vt.upperPitch,S.rotation.z+=vt.upperRoll,S.rotation.y+=vt.upperYaw;const Mt=pe(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),$t=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;S.position.x+=pe(vt.upperShiftX*Mt,-$t,$t),S.position.z+=pe(vt.upperShiftZ*Mt,-$t,$t),x.position.x+=vt.comX,x.position.z+=vt.comZ-vt.pelvisBack,x.position.y-=vt.drop;const jt=vt.legacy?0:pe(r.lowerScale,0,1);y.position.z+=vt.pelvisBack*(1-jt),y.position.y+=vt.drop*(1-jt),O.joint.rotation.x+=vt.knee,Pt.joint.rotation.x+=vt.knee,O.root.rotation.x-=vt.hip,Pt.root.rotation.x-=vt.hip,ot.root.rotation.x+=vt.arm,at.root.rotation.x+=vt.arm*.8;for(const ae of Uh)ae.emissive.copy(k0).multiplyScalar(vt.flash)}function tr(U){return U<.22?-1:U<.42?-1+(U-.22)/.2*2:U<.5?1:Math.max(0,1-(U-.5)/.5)}function z0(U){for(const et of[ot,at])et.upperMesh.scale.set(U.girthArm,U.arm,U.girthArm),et.upperMesh.position.y=-et.segLen/2*U.arm,et.joint.position.y=-et.segLen*U.arm,et.lowerMesh.scale.set(U.girthArm,U.arm,U.girthArm),et.lowerMesh.position.y=-et.segLen/2*U.arm,et.hand.position.y=-et.segLen*U.arm;for(const et of[O,Pt])et.upperMesh.scale.set(U.girthLeg,U.leg,U.girthLeg),et.upperMesh.position.y=-et.segLen/2*U.leg,et.joint.position.y=-et.segLen*U.leg,et.lowerMesh.scale.set(U.girthLeg,U.leg,U.girthLeg),et.lowerMesh.position.y=-et.segLen/2*U.leg,et.tip.position.y=-et.segLen*U.leg;Lt.scale.set(U.girthTorso,U.torso,U.girthTorso),Lt.position.y=k/2*U.torso,q&&(q.scale.set(U.girthTorso,U.torso,U.girthTorso),q.position.y=Z/2*U.torso,ht.position.y=k*U.torso)}function F0(U,et){const vt=s.twoHandGripY??-.16,Mt=Math.max(1,s.twoHandMaxStretch??1.25),$t=F*Mt*.99,jt=ot.root.position.x,ae=ot.root.position.y,Me=ot.root.position.z,He=ot.root.rotation.y,fe=Math.cos(He),dn=Math.sin(He),tn=Xi=>{const so=mt.localToWorld(new Y(0,Xi,0)),oo=($?ht:S).worldToLocal(so),ro=oo.x-jt,Cn=oo.y-ae,rs=oo.z-Me,cs={x:ro*fe-rs*dn,y:Cn,z:ro*dn+rs*fe};return{t:cs,dist:Math.hypot(cs.x,cs.y,cs.z)}};let Ye=vt,Ee=tn(Ye);if(!Number.isFinite(Ee.dist)||Ee.dist<=qi)return;for(let Xi=0;Xi<18&&Ee.dist>$t;Xi++)if(Ye*=.78,Ee=tn(Ye),!Number.isFinite(Ee.dist)||Ee.dist<=qi)return;Number.isFinite(Re)||(Re=Ye);const on=Math.max(0,s.twoHandSlideRate??9);Re+=(Ye-Re)*(1-Math.exp(-on*et));const hn=tn(Re),gn=hn.t,Jn=hn.dist,Qn=Jn/Math.max(qi,F),hi=pe(Qn,1,Mt),Ri=Math.max(1,s.twoHandGripStart??1.02),aa=Math.max(Ri+.001,Mt),sa=pe(s.twoHandMinGrip??1,0,1),ti=pe((Qn-Ri)/(aa-Ri),0,1),Pi=1-ti*ti*(3-2*ti)*(1-sa),ei=F/2*hi,ao=S0(gn,ei,ei,-1),oa=w0({rootPitch:ot.root.rotation.x,rootRoll:ot.root.rotation.z,jointPitch:ot.joint.rotation.x},ao,pe(U*Pi,0,1),Math.PI);ot.root.rotation.x=oa.rootPitch,ot.root.rotation.z=oa.rootRoll,ot.joint.rotation.x=Math.min(oa.jointPitch,-.06);const ui=1/Math.sqrt(hi);ot.upperMesh.scale.set(ui,hi,ui),ot.upperMesh.position.y=-ei/2,ot.joint.position.y=-ei,ot.lowerMesh.scale.set(ui,hi,ui),ot.lowerMesh.position.y=-ei/2,ot.hand.position.y=-ei,le={active:!0,dist:Jn,gy:Re,pitch:oa.rootPitch,joint:ot.joint.rotation.x,grip:Pi}}function U0(U,et){if(!m.enabled){Se=0,Ce=0,at.wrist.rotation.set(0,0,0),ge=at.root.rotation.x,Te=Gh();return}const vt=at.root.rotation.x,Mt=Gh();if(et!==Ve){Ve=et,ge=vt,Te=Mt,at.wrist.rotation.set(Se,0,Ce);return}if(!Number.isFinite(ge)||U<=1e-5){ge=vt,Te=Mt,at.wrist.rotation.set(Se,0,Ce);return}const $t=(vt-ge)/U,jt=Xe(Mt-Te)/U;ge=vt,Te=Mt;const ae=Math.max(0,m.maxAngle),Me=Math.max(0,m.maxTwist),He=.15+.85*pe(We,0,1),dn=-pe(ye,0,1.4)*Math.max(0,m.runDrag),tn=pe(-$t*m.lag*He+dn,-ae,ae),Ye=pe(jt*m.twistLag*He,-Me,Me),Ee=1-Math.exp(-Math.max(0,m.rate)*U);Se+=(tn-Se)*Ee,Ce+=(Ye-Ce)*Ee,at.wrist.rotation.set(Se,0,Ce)}function N0(U){const et=Math.PI/180;return U==="greatsword"?s.greatswordPitchDeg*et:U==="staff"?s.staffPitchDeg*et:U==="bow"?s.bowPitchDeg*et:s.swordPitchDeg*et}function Dc(U){const et=Math.PI/180;return U==="sword-shield"?s.shieldPitchDeg*et:U==="greatsword"?s.greatswordPitchDeg*et:U==="bow"?s.bowPitchDeg*et:s.swordPitchDeg*et}function O0(U){const et=Math.PI/180;return U==="sword-shield"||U==="dual-swords"?(s.swordCantDeg??0)*et:U==="greatsword"?(s.greatswordCantDeg??0)*et:0}function B0(U,et){const vt=U.weapon;if(vt==="staff"||vt==="bow")return;const Mt=he==="R",$t=Mt?at:ot,jt=Mt?mt:zt,ae=Mt?ot:at,Me=Mt?zt:mt,He=vt==="greatsword"&&Mt?N:0,fe=vt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,dn=Math.PI/180,tn=-fe*dn,Ye=fe*dn,Ee=(ti,Pi)=>{const ei=Math.max(0,Math.PI/2-Math.abs(Pi));return Math.sign(ti)*Math.min(Math.abs(ti),ei)},on=(Gi??N0(vt)+xt)+He,hn=et+$t.root.rotation.x+$t.joint.rotation.x;jt.rotation.set(Math.PI/2-on-hn,0,Ee(Mt?tn:Ye,on));const gn=qn??(vt==="sword-shield"?null:Dc(vt)+Ut),Jn=et+ae.root.rotation.x+ae.joint.rotation.x;vt==="sword-shield"?Me.rotation.x=gn===null?Dc(vt):Dc(vt)-gn-Jn:Me.rotation.set(Math.PI/2-(gn??0)-Jn,0,Ee(Mt?Ye:tn,gn??0));const Qn=O0(vt),hi=ce??0,Ri=Ht??0,aa=es??0,sa=ns??0;Mt?(D.rotation.z=-Qn+hi,D.rotation.y=aa,R.rotation.z=Qn+Ri,R.rotation.y=sa):(R.rotation.z=Qn+hi,R.rotation.y=aa,D.rotation.z=-Qn+Ri,D.rotation.y=sa)}function Nh(U){Gi=U.bladePitch,qn=U.bladePitchOff,es=U.bladeTwist,ns=U.bladeTwistOff,ce=U.bladeYaw,Ht=U.bladeYawOff,he=U.lead,Qe=U.rootYaw+U.spinYaw,b.rotation.y=Qe,S.rotation.y+=U.yaw,S.rotation.x+=U.pitch,S.rotation.z+=U.roll,x.position.z+=U.pelvisZ,x.position.x+=U.pelvisX,U.armR&&(at.root.rotation.x=U.armR.pitch,at.root.rotation.y=U.armR.yaw,at.root.rotation.z=U.armR.roll,at.joint.rotation.x=U.armR.elbow),U.armL&&(ot.root.rotation.x=U.armL.pitch,ot.root.rotation.y=U.armL.yaw,ot.root.rotation.z=U.armL.roll,ot.joint.rotation.x=U.armL.elbow)}function Oh(U,et){const vt=Hi??tr(U.attackProgress),Mt=O2(U.weapon,U.comboIndex,vt,p,U.attackProgress);if(U.comboIndex!==ci){bn=ln,jn=0,ci=U.comboIndex;const ae=U.timings.windup+U.timings.active+U.timings.recovery,Me=Math.max(p.segBlendMin??.03,ae*.22);li=X2(bn,Mt,p,Mt.blend??null,Me)}const $t=Math.max(.008,li);jn=Math.min(1,jn+et/$t);const jt=bn&&jn<1?B2(bn,Mt,yp(jn)):Mt;return ln=jt,jt}function H0(U,et){const vt=B/2+C/2,Mt=T-.04-it;if(!p.enabled){ot.root.position.set(-vt,Mt,0),at.root.position.set(vt,Mt,0),Sn={lx:-vt,ly:Mt,lz:0,rx:vt,ry:Mt,rz:0};return}const $t=Math.max(0,p.shoulderLift),jt=Math.max(0,p.shoulderPush),ae=U&&et==="greatsword"?Math.max(0,p.shoulderIn):0,Me=hn=>$t*pe((-hn-.5)/1.45,0,1),He=hn=>jt*pe((-hn-.2)/1.9,0,1),fe=-vt+ae,dn=Mt+Me(ot.root.rotation.x),tn=He(ot.root.rotation.x),Ye=vt-ae,Ee=Mt+Me(at.root.rotation.x),on=He(at.root.rotation.x);ot.root.position.set(fe,dn,tn),at.root.position.set(Ye,Ee,on),Sn={lx:fe,ly:dn,lz:tn,rx:Ye,ry:Ee,rz:on}}function G0(U,et,vt){if(U.phase==="idle"||U.charging){Pn=0,z=0,nt=0;return}const Mt=U.attackProgress,$t=tr(Mt),jt=Math.max(0,$t),ae=c.stride,Me=Number.isFinite(ae.stepReach)?ae.stepReach:.17,He=Number.isFinite(ae.stepSideReach)?ae.stepSideReach:.14,fe=Number.isFinite(ae.stepDipReach)?ae.stepDipReach:.05,dn=U.weapon==="greatsword"?pe(Number.isFinite(ae.heavyScale)?ae.heavyScale:1,0,1):1,tn=1-Math.exp(-12*Math.max(0,vt));Pn+=(Me*jt*dn-Pn)*tn,z+=(et*He*jt*dn-z)*tn,nt+=(fe*Math.sin(Math.PI*Mt)*dn-nt)*tn,x.position.z+=Pn,x.position.x+=z,x.position.y-=nt}let Bh=null;function X0(){Bh={upperX:S.rotation.x,upperY:S.rotation.y,upperZ:S.rotation.z,upperPX:S.position.x,upperPZ:S.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:ot.root.rotation.x,lry:ot.root.rotation.y,lrz:ot.root.rotation.z,lj:ot.joint.rotation.x,rrx:at.root.rotation.x,rry:at.root.rotation.y,rrz:at.root.rotation.z,rj:at.joint.rotation.x,rootY:b.rotation.y}}function V0(U){const et=Bh;if(!et)return;const vt=yp(pe(U,0,1));if(vt>=1)return;const Mt=($t,jt)=>$t+(jt-$t)*vt;S.rotation.x=Mt(et.upperX,S.rotation.x),S.rotation.y=Mt(et.upperY,S.rotation.y),S.rotation.z=Mt(et.upperZ,S.rotation.z),S.position.x=Mt(et.upperPX,S.position.x),S.position.z=Mt(et.upperPZ,S.position.z),x.position.x=Mt(et.pelvisX,x.position.x),x.position.y=Mt(et.pelvisY,x.position.y),x.position.z=Mt(et.pelvisZ,x.position.z),x.rotation.x=Mt(et.pelvisRX,x.rotation.x),x.rotation.z=Mt(et.pelvisRZ,x.rotation.z),ot.root.rotation.x=Mt(et.lrx,ot.root.rotation.x),ot.root.rotation.y=Mt(et.lry,ot.root.rotation.y),ot.root.rotation.z=Mt(et.lrz,ot.root.rotation.z),ot.joint.rotation.x=Mt(et.lj,ot.joint.rotation.x),at.root.rotation.x=Mt(et.rrx,at.root.rotation.x),at.root.rotation.y=Mt(et.rry,at.root.rotation.y),at.root.rotation.z=Mt(et.rrz,at.root.rotation.z),at.joint.rotation.x=Mt(et.rj,at.joint.rotation.x),b.rotation.y=et.rootY+Xe(b.rotation.y-et.rootY)*vt,Qe=b.rotation.y}let io=null,kc=0,Hh=0;function W0(){if(!$)return;const U=G,et=Math.max(0,U.waist??1),vt=Math.max(0,U.chest??0),Mt=et+vt,$t=Mt>1e-6?et/Mt:1,jt=Mt>1e-6?vt/Mt:0,ae=S.rotation.x,Me=S.rotation.y,He=S.rotation.z;S.rotation.set(ae*$t,Me*$t,He*$t),ht.rotation.set(ae*jt,Me*jt,He*jt);const fe=pe(U.neck??0,0,1);fe>0&&(j.rotation.x-=ae*fe),io={x:ae,y:Me,z:He}}function er(){return{yaw:S.rotation.y+($?ht.rotation.y:0),pitch:S.rotation.x+($?ht.rotation.x:0),lean:S.rotation.z+($?ht.rotation.z:0)}}function Gh(){return er().yaw}function Y0(U,et){if(!(h!=null&&h.enabled)){Ti=null,Ai=0;return}b.updateWorldMatrix(!0,!0);const vt=new Y,Mt=[],$t=(ui,Xi,so=0)=>{ui.getWorldPosition(vt),Mt.push({x:vt.x,y:vt.y+so,z:vt.z,mass:Xi})},jt=n.headSize;$t(j,.08,jt/2),$t(Lt,.14),$t(q??ht,.24),$t(x,.12),$t(ot.hand,.05),$t(at.hand,.05),$t(O.joint,.15),$t(Pt.joint,.15);const ae=Et?nr(st[Et].right):null;ae&&Mt.push({x:(ae.base.x+ae.tip.x)/2,y:(ae.base.y+ae.tip.y)/2,z:(ae.base.z+ae.tip.z)/2,mass:Et==="greatsword"?.09:.04});const Me=Math.max(.05,n.limbThickness*1.15/2+.015),He=Math.max(.06,n.limbThickness*1.7/2+.02);let fe=1/0,dn=-1/0,tn=1/0,Ye=-1/0,Ee=0;for(const ui of[O,Pt])ui.tip.getWorldPosition(vt),vt.y<=.13&&(Ee+=1),fe=Math.min(fe,vt.x-Me),dn=Math.max(dn,vt.x+Me),tn=Math.min(tn,vt.z-He),Ye=Math.max(Ye,vt.z+He);(!Number.isFinite(fe)||Ee===0)&&(fe=dn=tn=Ye=0);let on=0,hn=0;Number.isFinite(is)&&et>1e-5&&(on=pe((U.position.x-is)/et,-20,20),hn=pe((U.position.z-Ko)/et,-20,20)),is=U.position.x,Ko=U.position.z;const gn=P2(Mt,{minX:fe,maxX:dn,minZ:tn,maxZ:Ye},on,hn,h);if(Ti=gn,!h.autoCounter){Ai=0;return}const Jn=Math.cos(U.bodyYaw),Qn=-Math.sin(U.bodyYaw),hi=gn.xcomX-gn.centerX,Ri=gn.xcomZ-gn.centerZ,aa=hi*Jn+Ri*Qn,sa=on*Jn+hn*Qn,ti=gn.grounded?C2(aa,sa,h.predLead??0):0;Hh=ti;const Pi=Math.abs(ti)-.45*gn.halfX;to=Pi;let ei=0;Pi>.002&&gn.grounded&&(ei=-Math.sign(ti)*Math.min(Math.max(.005,h.maxShift??.045),(Pi+.002)*1.1666666666666667));const ao=Math.abs(ti)/Math.max(1e-4,gn.halfX),oa=Math.max(.1,L2(h.counterRate,ao,h.counterBoost??0));Ai+=(ei-Ai)*(1-Math.exp(-oa*et))}function $0(U,et){if(ut.drawString.position.z=-.06,ft.position.z=0,Q.orb.scale.setScalar(1),S.rotation.y=0,U.charging&&U.weapon==="bow"){const jt=U.charge;ot.root.rotation.x=-1.25,ot.joint.rotation.x=-.15,at.root.rotation.x=.35+jt*.3,at.joint.rotation.x=-1.15,ut.drawString.position.z=-.06-jt*.22,ft.position.z=-jt*.3,S.rotation.y=-.22;return}if(U.phase==="idle"&&wn<=.001){bn=null,ln=null,ci=0,jn=1,li=Math.max(.008,p.segBlend),Gi=null,qn=null,es=null,ns=null,ce=null,Ht=null,Re=NaN,U.weapon==="greatsword"&&(mt.position.x=-Math.max(0,s.twoHandInsetX??0));return}const vt=tr(U.attackProgress),Mt=Math.max(0,-vt),$t=Math.max(0,vt);if(U.weapon==="bow")ot.root.rotation.x=-1.2,ot.joint.rotation.x=-.15,at.root.rotation.x=.9-$t*.8,at.joint.rotation.x=-.3;else if(U.weapon==="greatsword")if(p.enabled)Nh(Oh(U,et));else{const jt=-1.6*Mt+1.25*$t,ae=pe(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);at.root.rotation.x=jt,at.joint.rotation.x=-(.25+Mt*.4),ot.root.rotation.x=jt+.06,ot.joint.rotation.x=-(.32+Mt*.4),ot.root.rotation.z=.42,at.root.rotation.z=0;const Me=-Math.sin(at.root.rotation.x);at.root.rotation.y=-.72*Math.tanh(Me*4),S.rotation.y=-.2*vt*ae}else if(p.enabled)Nh(Oh(U,et));else{const jt=U.comboIndex;if(jt===1)at.root.rotation.x=-1.7*Mt+1.1*$t,at.joint.rotation.x=-(.2+Mt*.5),ot.root.rotation.x=.1,S.rotation.y=-.18*vt;else if(jt===2)ot.root.rotation.x=-1.5*Mt+1*$t,ot.joint.rotation.x=-(.2+Mt*.5),at.root.rotation.x=.2,S.rotation.y=.45*-vt;else{const ae=-1.9*Mt+1.2*$t;ot.root.rotation.x=ae,at.root.rotation.x=ae,ot.joint.rotation.x=-(.15+Mt*.4),at.joint.rotation.x=-(.15+Mt*.4),S.rotation.y=-.3*vt}}if(U.weapon==="greatsword"){const jt=pe((-at.root.rotation.x-1.3)/1.2,0,1);mt.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-jt)}G0(U,ri%2===0?1:-1,et)}function Z0(U,et){U&&(at.root.rotation.x=-1.05,at.joint.rotation.x=-.35,ot.root.rotation.x=-.45,ot.joint.rotation.x=-.2,S.rotation.y=-.12,Q.orb.scale.setScalar(1.25+.12*Math.sin(et*2)))}function j0(U){if(!U||U.phase==="idle")return;const et=U.progress,vt=et<.3?-.35+et/.3*1.35:et<.7?1:Math.max(0,1-(et-.7)/.3),Mt=Math.PI/180;S.rotation.x+=v.leanDeg*Mt*vt,ot.root.rotation.x-=v.shieldPitchDeg*Mt*vt,ot.joint.rotation.x-=.22*vt,at.root.rotation.x-=.3*vt,x.position.z+=v.pelvisReach*Math.max(0,vt)}function nr(U){if(!U)return null;const et=U.getObjectByName("bladeBase"),vt=U.getObjectByName("bladeTip");if(!et||!vt)return null;U.updateWorldMatrix(!0,!1);const Mt=et.getWorldPosition(new Y),$t=vt.getWorldPosition(new Y),jt=new Y().setFromMatrixColumn(U.matrixWorld,0).normalize();return{base:{x:Mt.x,y:Mt.y,z:Mt.z},tip:{x:$t.x,y:$t.y,z:$t.z},normal:{x:jt.x,y:jt.y,z:jt.z}}}return{group:b,update(U,et,vt,Mt,$t=!1,jt,ae,Me){var nu;Fh(et.weapon);const He=jt===void 0||de<0?Mt:pe(jt-de,0,.1);jt!==void 0&&(de=jt),b.rotation.y=0,Qe=0,S.rotation.x=0,S.rotation.z=0,x.position.x=0,x.position.y=L,x.position.z=0,x.rotation.z=0,x.rotation.x=0,S.position.x=0,S.position.y=0,S.position.z=0,ht.rotation.set(0,0,0),y.position.x=0,y.position.y=0,y.position.z=0,y.rotation.z=0;const fe=Math.max(1/240,Math.min(Mt,.1));V=((nu=c.stance)==null?void 0:nu[et.weapon])??null,wt!==et.weapon&&(wt=et.weapon,Xt=V?0:1);const dn=Math.max(.01,(V==null?void 0:V.blend)??.22);Xt=Math.min(1,Xt+fe/dn);const tn=V?Xt:0;xt=((V==null?void 0:V.bladePitchDeg)??0)*Math.PI/180*tn,Ut=((V==null?void 0:V.bladePitchOffDeg)??0)*Math.PI/180*tn;const Ye=jt===void 0?L0+=Mt:jt;Pc=Ye;const Ee=c.landing;Ee.enabled?Cc&&!U.grounded?(no="jump",as=Ye,ss=Ee.anticipationDuration,os=Math.max(0,Ee.jumpAnticipation),Qo=.32):!Cc&&U.grounded&&(no="land",as=Ye,ss=Ee.duration,os=S2(Lc,Ee),Qo=Ee.compressRatio,zh=Lc):(no="none",os=0),Ye<as&&(no="none",os=0),Cc=U.grounded,Lc=U.velocity.y;const on=gp(Ye,as,ss,os,Qo),hn=et.phase!=="idle",gn=(Me==null?void 0:Me.phase)==="active";We=y2(We,hn,fe,c.attack.blendRate);const Jn=M2(We,c.attack.gaitWeight,c.attack.lowerBodyWeight);Kn=Jn.attackLegWeight,Ea=Jn.gaitScale;const Qn=Math.sin(U.bodyYaw),hi=Math.cos(U.bodyYaw),Ri=(U.velocity.x-K)/fe,aa=(U.velocity.z-gt)/fe,sa=pe(Ri,-60,60),ti=pe(aa,-60,60),Pi=sa*Qn+ti*hi,ei=Xe(U.bodyYaw-Nt)/fe,ao=He>1e-6?Xe(U.bodyYaw-Nt)/He:0,oa=Math.hypot(U.velocity.x,U.velocity.z),ui=o.maxForwardDeg*Math.PI/180,Xi=o.maxSideDeg*Math.PI/180,so=pe(Pi*o.accelGain,-ui,ui),oo=pe(-ei*oa*o.turnGain,-Xi,Xi),ro=1-Math.exp(-o.smoothing*fe);Ot+=(so-Ot)*ro,It+=(oo-It)*ro,K=U.velocity.x,gt=U.velocity.z,Nt=U.bodyYaw;const Cn=Math.hypot(U.velocity.x,U.velocity.z),rs=pe(a.knockGaitScale??0,0,1),cs=vt.knockX*rs,q0=vt.knockZ*rs,K0=rs>0&&Math.hypot(vt.knockX,vt.knockZ)>.001,Ic=U.velocity.x+cs,zc=U.velocity.z+q0,Xh=Math.hypot(Ic,zc);Gt=Xh;const J0=Math.cos(U.bodyYaw),Q0=-Math.sin(U.bodyYaw),tg=U.velocity.x*J0+U.velocity.z*Q0,Vh=Cn>qi?pe(tg/Cn,-1,1):0,Wh=Cn>qi?pe((U.velocity.x*Qn+U.velocity.z*hi)/Cn,-1,1):1,eg=Lh(Wh,a.backStrafeStartDeg,a.backStrafeFullDeg);Zt==="settled"&&ve&&re>H*1.02+1e-4&&(Zt="none");let co=1;Zt==="blend"?(co=g0(ie?Jt:qt,a.stopYawBlendMode,ie),ie||(qt=Math.min(1,qt+fe/Math.max(.01,a.stopYawAfterSec)),(qt>=1||a.stopYawBlendMode==="inStop"||ve)&&(Zt="settled",co=0))):Zt==="settled"&&(co=pe(Cn/Math.max(qi,a.stopEnterRatio*e),0,1)),se=co;const ng=l0(Vh,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),Yh=(a.hipYawTrackRateDeg??0)*Math.PI/180,ig=(a.hipYawBackRateDeg??0)*Math.PI/180,Fc=He>1e-6?He:Mt;oe=Yh>0?s0(oe,a0(ao),Fc):0;const $h=d0(eg,oe),ag=pe(Cn/.5,0,1),sg=u0(Wh,Vh,ng,$h)*co*ag,Zh=o0(Kt,sg,h0(Yh,ig,$h),Fc,oe);Kt=Zh,Ct+=(Zh-Ct)*(1-Math.exp(-i.hipYawSmoothing*Fc));const lo=U.bodyYaw+Ct;Dt=lo;const og=Math.sin(lo),rg=Math.cos(lo),cg=Math.cos(lo),lg=-Math.sin(lo),fi={speed:Xh,phase:U.gaitPhase,localForward:Ic*og+zc*rg,localRight:Ic*cg+zc*lg,stride:U.stride};if(hn&&et.attackId!==Ei){const ne=!ct;Ei=et.attackId,ri+=1,_n=ne&&(!Zn||fi.speed>.05)?fi.phase:$n,Zn=!0}ct=hn;const xi=We>0?x2(fi,et.attackProgress,ri,We,c.stride,_n):fi;Jo=xi,hn&&($n=xi.phase);const Uc=Math.max(0,a.dirFlipSec??0);Uc>0?(Ta=gc(Ta,xi.localForward>=0?1:-1,fe,Uc),Aa=gc(Aa,xi.localRight>=0?1:-1,fe,Uc)):(Ta=xi.localForward>=0?1:-1,Aa=xi.localRight>=0?1:-1);const jh=Math.max(0,a.stopBlendSec||0),qh=jh>0&&!hn&&!K0&&U.grounded,Nc=f0(Cn,sn,e,a.stopEnterRatio,a.stopExitRatio);if(!qh||Nc.resume)Qt=-1;else if(Qt<0&&Nc.enter){Qt=0,we=U.gaitPhase,ze=r0(U.gaitPhase),Je=Cn,Mn=Math.max(U.stride,qi),Pe=fi.localForward,Fe=fi.localRight;const ne=1/Math.max(qi,Cn);mn=U.velocity.x*ne,Xn=U.velocity.z*ne}const dg=sn;sn=Cn;const Ci=qh&&Qt>=0;Ci&&(Qt=Math.min(1,Qt+fe/jh)),Ci&&Zt!=="blend"&&(Zt="blend",qt=0),ie=Ci&&Qt<1,Jt=Qt,ve=Nc.resume,re=Cn,H=dg;const Kh=Ci?{phase:we,speed:Je,moveSpeed:e,localForward:Pe,localRight:Fe,dirF:Ta,dirR:Aa,legLength:n.legLength,stride:Mn,grounded:!0}:{phase:xi.phase,speed:xi.speed,moveSpeed:e,localForward:xi.localForward,localRight:xi.localRight,dirF:Ta,dirR:Aa,legLength:n.legLength,stride:xi.stride??0,grounded:U.grounded};let Oc=Ci?c0(Kh,a,{progress:Qt,phase0:we,phaseEnd:ze}):xc(Kh,a);const Ra=c.attack.moveTakeover;if(Ra&&!Ci){const ne=et.phase==="windup"?Ra.windup:et.phase==="recovery"?Ra.recovery:et.phase==="settle"?Ra.settle:0,ue=Math.max(.05,Ra.full-Ra.speed),un=pe((fi.speed-Ra.speed)/ue,0,1),Fn=pe(ne,0,1)*un,ir=Fn>di?10:6;di=pe(di+(Fn-di)*(1-Math.exp(-ir*fe)),0,1)}else Ci?di=0:di=pe(di*Math.exp(-8*fe),0,1);if(di>.001&&!Ci){const ne=xc({phase:fi.phase,speed:fi.speed,moveSpeed:e,localForward:fi.localForward,localRight:fi.localRight,dirF:Ta,dirR:Aa,legLength:n.legLength,stride:fi.stride??0,grounded:U.grounded},a);Oc=_2(Oc,ne,di)}const ke=b2(Oc,Jn.gaitScale);if(St=0,gn&&Me){const ne=p2(Me.progress,Me.dir,a),ue=Jn.gaitScale;ke.legL.pitchX+=ne.legL.pitchX*ue,ke.legL.rollZ+=ne.legL.rollZ*ue,ke.legL.kneeX+=ne.legL.kneeX*ue,ke.legR.pitchX+=ne.legR.pitchX*ue,ke.legR.rollZ+=ne.legR.rollZ*ue,ke.legR.kneeX+=ne.legR.kneeX*ue,ke.pelvisY+=ne.pelvisY*ue,St=ne.env}let Bc=0,Hc=0,Gc=0,Jh=0;if(Ci){const ne=m0(U.bodyYaw,mn,Xn),ue=x0(Qt,we,ne.forward,ne.right,a);ue.leadLeft?(ke.legL.pitchX-=ue.leadPitch,ke.legL.kneeX+=ue.leadKnee,ke.legR.pitchX+=ue.trailPitch):(ke.legR.pitchX-=ue.leadPitch,ke.legR.kneeX+=ue.leadKnee,ke.legL.pitchX+=ue.trailPitch),Hc=ue.bodyShift*ue.fwdN,Bc=ue.bodyShift*ue.rightN,Gc=ue.bodyDip,Jh=ue.chestPitch,rt=ue.leadPitch,tt=ue.bodyShift,Ft=ue.bodyDip}else rt=0,tt=0,Ft=0;if(eo={lp:ke.legL.pitchX,lr:ke.legL.rollZ,rp:ke.legR.pitchX,rr:ke.legR.rollZ},!U.grounded)O.root.rotation.x=-.55,Pt.root.rotation.x=-.25,O.joint.rotation.x=.75,Pt.joint.rotation.x=.55,ot.root.rotation.x=-.9,at.root.rotation.x=-.7,ot.joint.rotation.x=-.6,at.joint.rotation.x=-.6,O.root.rotation.z=0,Pt.root.rotation.z=0;else{O.root.rotation.x=ke.legL.pitchX,Pt.root.rotation.x=ke.legR.pitchX,O.root.rotation.z=ke.legL.rollZ,Pt.root.rotation.z=ke.legR.rollZ,O.joint.rotation.x=ke.legL.kneeX,Pt.joint.rotation.x=ke.legR.kneeX;const ne=V?Xt:0,ue=1+(((V==null?void 0:V.armSwing)??1)-1)*ne,un=V==null?void 0:V.armR,Fn=V==null?void 0:V.armL,ir=ke.armL*ue+((Fn==null?void 0:Fn.pitch)??0)*ne,iu=ke.armR*ue+((un==null?void 0:un.pitch)??0)*ne;ot.root.rotation.x=ir,at.root.rotation.x=iu,ot.joint.rotation.x=-(.18+ir*.2)+((Fn==null?void 0:Fn.elbow)??0)*ne,at.joint.rotation.x=-(.18+iu*.2)+((un==null?void 0:un.elbow)??0)*ne,ot.root.rotation.z=((Fn==null?void 0:Fn.roll)??0)*ne,at.root.rotation.z=((un==null?void 0:un.roll)??0)*ne,ot.root.rotation.y=((Fn==null?void 0:Fn.yaw)??0)*ne,at.root.rotation.y=((un==null?void 0:un.yaw)??0)*ne,x.position.x=ke.pelvisX,x.position.y=L+ke.pelvisY,x.position.z=0,x.rotation.z=ke.pelvisRoll}const hg=E0(x,y),ho=gn?{...f,weight:0}:Ci&&f.enabled?{...f,weight:1}:f,Xc=ho.enabled&&U.grounded&&ho.weight>0?pe(ho.weight,0,1)*(hn?pe(ho.attackScale,0,1):1):0;x.position.x+=Bc,x.position.z+=Hc,x.position.y-=Gc,y.position.y+=Gc,Xc<=0&&(y.position.x-=Bc,y.position.z-=Hc);const Vc=Cn/Math.max(e,qi);ye=Vc;const ug=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,fg=1-Math.exp(-Math.max(0,ug)*fe);lt+=(pe(Vc,0,1)-lt)*fg;const ls=b0({leanForward:Ot,leanSide:It,speedRatio:lt},o);x.rotation.x+=ls.pelvisPitch,x.rotation.z+=ls.pelvisRoll,x.position.x+=ls.pelvisX,x.position.z+=ls.pelvisZ,x.position.y-=ls.crouch,y.position.y+=ls.crouch*(1-pe(Xc,0,1)),I>0&&(x.position.y-=I,y.position.y+=I*(1-pe(Xc,0,1)));const Qh=et.phase!=="idle"||et.charging&&et.weapon==="bow",Wc=Qh?1:0,pg=Math.max(.001,Wc>wn?p.poseIn??.1:p.poseOut??.16);if(wn!==Wc){const ne=fe/pg;wn=pe(wn+(Wc>wn?ne:-ne),0,1)}if((wn>0||Qh)&&X0(),$0(et,fe),wn>0&&wn<1&&V0(wn),V){const ne=(1-wn)*Xt;S.rotation.y+=(V.torsoYaw??0)*ne,S.rotation.x+=(V.torsoPitch??0)*ne}Z0($t,U.gaitPhase),j0(ae);const mg=et.weapon==="greatsword",tu=Math.hypot(U.velocity.x,U.velocity.z),gg=mg&&et.phase==="idle"&&tu>.5?Math.min(1.15,tu/Math.max(e,.001)*.9):0;N+=(gg-N)*(1-Math.exp(-6*fe));const xg=S.rotation.x;et.weapon==="bow"&&(ut.g.rotation.x=-(ot.root.rotation.x+ot.joint.rotation.x),ft.rotation.x=-(at.root.rotation.x+at.joint.rotation.x));const vg=S.rotation.y;I0(vt,U.bodyYaw);const eu=vt.type==="none"?1:.4;if(S.rotation.x+=Ot*eu+Jh,S.rotation.z+=(It+ke.sideLean)*eu,on>0&&(O.root.rotation.x-=Ee.hipPitch*on,Pt.root.rotation.x-=Ee.hipPitch*on,O.joint.rotation.x+=Ee.kneeBend*on,Pt.joint.rotation.x+=Ee.kneeBend*on,x.position.y-=Ee.crouchDepth*on,y.position.y+=Ee.crouchDepth*(1-Ee.lowerScale)*on,S.rotation.x+=Ee.upperPitch*on,ot.root.rotation.x-=Ee.armTuck*on,at.root.rotation.x-=Ee.armTuck*on),Kn>0&&U.grounded){const ne=v2(et.attackProgress,ri,c.stride),ue=Kn;O.root.rotation.x+=ne.legL.pitchX*ue,Pt.root.rotation.x+=ne.legR.pitchX*ue,O.root.rotation.z+=ne.legL.rollZ*ue,Pt.root.rotation.z+=ne.legR.rollZ*ue,O.joint.rotation.x+=ne.legL.kneeX*ue,Pt.joint.rotation.x+=ne.legR.kneeX*ue,x.position.x+=ne.pelvisX*ue,x.position.y+=ne.pelvisY*ue,x.rotation.z+=ne.pelvisRoll*ue}if(H0(hn,et.weapon),h!=null&&h.enabled&&h.autoCounter&&Math.abs(Ai)>1e-4&&(x.position.x+=Ai),g.enabled){const ne=et.phase!=="idle"&&!et.charging,ue=ne?tr(et.attackProgress):0;ne&&Bt>.55&&ue<Bt-1e-4&&(te=1),Bt=ue,te=z2(te,fe,g.impactDecay);const un=k2({swing:ue,charge:et.charging?et.charge:0,impact:te,speedRatio:Vc,grounded:U.grounded},g);bt=I2(bt,un,fe,g.smoothing)}else bt={...Jd};z0(bt),y.rotation.y=Ct,An=p0(Ct,a.chestYawScale,a.chestYawMaxDeg),S.rotation.y+=An;const yg=vg;if(j.rotation.y=Xe(U.headYaw-U.bodyYaw-yg-An),j.rotation.x=-pe(U.headPitch??0,-.7,.7),S.rotation.x+=-pe(U.bodyPitch??0,-.4,.4),P>0&&(S.rotation.x+=P,j.rotation.x-=P*.55,j.position.z=P*.1),W0(),U0(Mt,et.comboIndex),B0(et,xg),et.weapon==="greatsword"&&!et.charging&&(et.phase!=="idle"||wn>0)){b.updateWorldMatrix(!0,!0);const ne=et.phase==="idle"?Math.max(wn,We):1;F0(pe(ne,0,1),fe)}if(X=T0({root:b,pelvis:x,lower:y,limbs:Tt,base:hg,cfg:ho,grounded:U.grounded,attacking:hn}),Y0(U,fe),Yt&&_t.length===3){const ne=(Cn-Rt)/Math.max(fe,1e-4),ue=Y2(Yt,fe,pe(ne*.3,-9,9));for(let un=0;un<3;un++)_t[un].rotation.x=ue[un]}if(Rt=Cn,$&&io){const ne=er();kc=Math.max(Math.abs(ne.pitch-io.x),Math.abs(ne.yaw-io.y),Math.abs(ne.lean-io.z))}else kc=0},lean(){return{forward:Ot,side:It}},landing(){const U=gp(Pc,as,ss,os,Qo),et=ss>0?Math.max(0,ss-Math.max(0,Pc-as)):0;return{pulse:U,remaining:et,kind:U>0?no:"none",impactVy:zh}},hurt(){return At},ik(){return X},stretch(){return{...bt,impact:te}},gripDebug(){return{...le}},weaponDebug(){return{wristPitch:Se,wristTwist:Ce}},setClipT(U){Hi=U===null||!Number.isFinite(U)?null:Math.max(0,Math.min(1,U))},stanceDebug(){const U=V==null?void 0:V.armR,et=V==null?void 0:V.armL,vt=V?Xt:0;return{weapon:Et??"sword-shield",weight:vt,armL:{pitch:((et==null?void 0:et.pitch)??0)*vt,yaw:((et==null?void 0:et.yaw)??0)*vt,roll:((et==null?void 0:et.roll)??0)*vt,elbow:((et==null?void 0:et.elbow)??0)*vt},armR:{pitch:((U==null?void 0:U.pitch)??0)*vt,yaw:((U==null?void 0:U.yaw)??0)*vt,roll:((U==null?void 0:U.roll)??0)*vt,elbow:((U==null?void 0:U.elbow)??0)*vt},torsoYaw:((V==null?void 0:V.torsoYaw)??0)*vt,torsoPitch:((V==null?void 0:V.torsoPitch)??0)*vt,bladePitchDeg:xt*180/Math.PI,bladePitchOffDeg:Ut*180/Math.PI,armSwing:(V==null?void 0:V.armSwing)??1}},swingDebug(){const U=ln;return{seg:ci,kind:(U==null?void 0:U.kind)??"right-left",lead:(U==null?void 0:U.lead)??"R",yaw:(U==null?void 0:U.yaw)??0,rootYaw:(U==null?void 0:U.rootYaw)??0,spinYaw:(U==null?void 0:U.spinYaw)??0,rootTurn:Qe,pitch:(U==null?void 0:U.pitch)??0,roll:(U==null?void 0:U.roll)??0,strike:(U==null?void 0:U.strike)??0,bladeTwist:(U==null?void 0:U.bladeTwist)??0,bladeTwistOff:(U==null?void 0:U.bladeTwistOff)??0,bladeYaw:(U==null?void 0:U.bladeYaw)??0,bladeYawOff:(U==null?void 0:U.bladeYawOff)??0,shoulderL:{x:Sn.lx,y:Sn.ly,z:Sn.lz},shoulderR:{x:Sn.rx,y:Sn.ry,z:Sn.rz}}},attackBlend(){return We},attackWeights(){return{gaitScale:Ea,attackLegWeight:Kn,driveSpeed:Jo.speed,stridePhase:Jo.phase,strideBase:_n,stepIndex:ri}},hipYaw(){return Ct},torsoTotal(){return er()},spineDebug(){if(!$)return null;const U=er();return{enabled:!0,waistYaw:S.rotation.y,chestYaw:ht.rotation.y,totalYaw:U.yaw,totalPitch:U.pitch,totalLean:U.lean,neckPitch:j.rotation.x,leak:kc}},balanceDebug(){return Ti?{...Ti,shift:Ai,latDeficit:to,lateralFf:Hh}:null},gaitDebug(){return{stopT:Qt,hipYaw:Ct,chestYaw:An,speed:sn,gaitSpeed:Gt,stopStep:rt,stopShift:tt,stopDip:Ft,stopYawFade:se,turnStep:St,legTakeover:di,legLPitch:eo.lp,legLRoll:eo.lr,legRPitch:eo.rp,legRRoll:eo.rr,phase:Jo.phase,dirF:Ta,dirR:Aa,hipYawTarget:Kt,spin:oe}},gaitYaw(){return Dt},arrowDirection(){ft.updateWorldMatrix(!0,!1);const U=ft.matrixWorld.elements,et=U[8],vt=U[9],Mt=U[10],$t=Math.hypot(et,vt,Mt)||1;return{x:et/$t,y:vt/$t,z:Mt/$t}},weaponBlade(){return Et?nr(st[Et].right):null},bladesWorld(){return Et?{right:nr(st[Et].right),left:nr(st[Et].left)}:{right:null,left:null}},dispose(){b.traverse(U=>{if(U instanceof me){U.geometry.dispose();const et=U.material;Array.isArray(et)?et.forEach(vt=>vt.dispose()):et.dispose()}})}}}function J2(n){const t=A0(n.voxel,n.colors,n.moveSpeed,n.orientation,n.gait,n.mount,n.lean,n.hurt,n.animation,n.ik,n.links,n.wrist,n.balance),e=new xe;e.add(t.group);const i={position:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:1,distance:0,coyoteTime:0,jumpBuffer:0},a=[];for(const s of["headPivot","chest","torsoUpper","torso","pelvis"]){const o=t.group.getObjectByName(s);o&&a.push(o)}return{group:e,update(s,o,r){i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.velocity.x=s.velocity.x,i.velocity.y=s.velocity.y,i.velocity.z=s.velocity.z,i.facing=s.facing,i.moveYaw=Math.atan2(i.velocity.x,i.velocity.z),i.bodyYaw=s.bodyYaw,i.headYaw=s.headYaw,i.gaitPhase=s.gaitPhase,i.stride=s.stride,i.distance=s.distance,i.grounded=!0,i.sprinting=!1,e.position.set(s.position.x,s.position.y,s.position.z),e.rotation.y=s.bodyYaw,s.combat&&t.update(i,s.combat,s.hurt,o,!1,r,s.link)},debug(){return t.gaitDebug()},boneAtWorld(s,o,r){if(a.length===0)return null;const c=new Y(s,o,r),l=new Y;let d=null,u=Number.POSITIVE_INFINITY;for(const h of a){h.updateWorldMatrix(!0,!1),h.getWorldPosition(l);const f=l.distanceToSquared(c);f<u&&(u=f,d=h)}return d?{node:d,point:c}:null},dispose(){t.dispose()}}}const Na=.012,Oa=.016;function Q2(n,t,e=[]){const i=t.lab,a=new xe;a.name="test-lab";const s=[],o=[],r=[],c=[];function l(S){return r.push(S),S}function d(S){return c.push(S),S}function u(S,w,E,A=Na){const _=l(new xn({color:w,transparent:!0,opacity:E,depthWrite:!1,side:qe,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),M=new me(S,_);return M.rotation.x=-Math.PI/2,M.position.y=A,M.renderOrder=2,M}function h(S,w){return d(new Bs(Math.max(S,.001),w,72))}function f(S,w,E,A=Oa){const M=document.createElement("canvas"),P=M.getContext("2d");if(!P)return new me;const I='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';P.font=I,M.width=Qu.ceilPowerOfTwo(Math.ceil(P.measureText(S).width)+32),M.height=Qu.ceilPowerOfTwo(96*1.4);const L=M.getContext("2d");if(!L)return new me;L.font=I,L.textAlign="center",L.textBaseline="middle",L.fillStyle=E,L.fillText(S,M.width/2,M.height/2);const F=new Zd(M);F.colorSpace=Hn,o.push(F);const C=M.width/M.height,T=d(new Wn(w*C,w)),B=l(new xn({map:F,transparent:!0,depthWrite:!1,side:qe,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),G=new me(T,B);return G.rotation.x=-Math.PI/2,G.position.y=A,G.renderOrder=3,G}function m(S,w,E,A,_,M){const P=E-w,I=d(new Wn(P,A)),L=u(I,_,M,Na);L.position.set(P/2+w,Na,0);const F=new xe;return F.add(L),F.rotation.y=S-Math.PI/2,F}function v(S,w,E,A,_){const M=new Km;M.moveTo(0,w*.5),M.lineTo(-E*.5,w*.5-E*.9),M.lineTo(-E*.18,w*.5-E*.9),M.lineTo(-E*.18,-w*.5),M.lineTo(E*.18,-w*.5),M.lineTo(E*.18,w*.5-E*.9),M.lineTo(E*.5,w*.5-E*.9),M.closePath();const P=d(new Ch(M)),I=u(P,A,_,Na+.002),L=new xe;return L.add(I),L.rotation.y=S+Math.PI,L}function g(S){var P;const w=new xe,E=f(`${S.index} · ${S.name}`,t.lab.labelTextHeight,"#eaf4ff"),_=((P=E.geometry.parameters)==null?void 0:P.width)??3;w.add(E);const M=u(d(new Wn(_*.98,.08)),S.color,.7,Oa);return M.position.set(0,Oa,t.lab.labelTextHeight*.66),w.add(M),w.position.set(S.labelX,0,S.labelZ),w}function p(S,w){const E=new xe,A=S.maxX-S.minX,_=S.maxZ-S.minZ,M=(S.minX+S.maxX)/2,P=(S.minZ+S.maxZ)/2,I=.09,L=.006,F=[[M,S.minZ+I/2,A,I],[M,S.maxZ-I/2,A,I],[S.minX+I/2,P,I,_],[S.maxX-I/2,P,I,_]];for(const[T,B,G,$]of F){const it=u(d(new Wn(G,$)),w,.38,L);it.position.set(T,L,B),E.add(it)}const C=.42;for(const[T,B]of[[S.minX+C/2,S.minZ+C/2],[S.maxX-C/2,S.minZ+C/2],[S.minX+C/2,S.maxZ-C/2],[S.maxX-C/2,S.maxZ-C/2]]){const G=u(d(new Wn(C,C)),w,.55,L);G.position.set(T,L,B),E.add(G)}return E}const b=new xe,x=new Map;for(const S of n??[])x.set(S.id,S.color);for(const S of e)S.plotId&&b.add(p(S,x.get(S.plotId)??"#7f8fa0"));for(const S of n??[]){const w=new xe;if(w.position.set(S.x,0,S.z),S.shape==="square"){const E=S.radius,A=u(d(new Wn(E*2,E*2)),S.color,i.padOpacity*.09);w.add(A);const _=.07,M=[[0,E,E*2+_,_],[0,-E,E*2+_,_],[-E,0,_,E*2+_],[E,0,_,E*2+_]];for(const[P,I,L,F]of M){const C=u(d(new Wn(L,F)),S.color,i.padOpacity);C.position.x=P,C.position.z=I,w.add(C)}}else w.add(u(d(new Th(S.radius,72)),S.color,i.padOpacity*.075)),w.add(u(h(S.radius-.075,S.radius),S.color,i.padOpacity));if(S.id==="hub"){for(let E=0;E<4;E++){const A=E*Math.PI/4,_=E%2===0;for(const M of[0,Math.PI])w.add(m(A+M,S.radius*.12,S.radius*.94,_?.09:.055,S.color,_?.5:.32))}w.add(u(h(.5,.56),S.color,.4))}else if(S.id==="dash"){const E=S.spawnZ-S.z,A=-S.radius+.5,_=E-A,M=u(d(new Wn(.06,_)),S.color,.36);M.position.set(0,Na,(E+A)/2),w.add(M);let P=0;for(let L=E;L>=A-.01;L-=1,P++){const F=P%5===0,C=u(d(new Wn(F?2.4:1.3,F?.1:.07)),S.color,F?.72:.42);C.position.set(0,Na,L),w.add(C);const T=f(String(P),.52,F?"#eaf4ff":"rgba(200,225,245,0.8)");T.position.set(1.6,Oa,L),w.add(T)}const I=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[L,F]of I){const C=E-L,T=u(d(new Wn(1.9,.09)),"#ffffff",.5);T.position.set(-1.5,Na,C),w.add(T);const B=f(F,.42,"rgba(220, 236, 250, 0.86)");B.position.set(-3,Oa,C),w.add(B)}}else if(S.id==="gait"){w.add(u(h(1.44,1.5),S.color,.5)),w.add(u(h(1.14,1.2),S.color,.22));const E=1.55,A=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[_,M,P]of A){const L=Math.sin(_),F=Math.cos(_),C=v(_,1.7,.34,P,.75);C.position.set(L*1.7*.5,0,E+F*1.7*.5),w.add(C);const T=f(M,.44,P);T.position.set(L*(1.7+.7),Oa,E+F*(1.7+.7)),w.add(T)}}if(b.add(w),i.showLabels){const E=g(S);s.push(E),b.add(E)}}a.add(b);const y=n==null?void 0:n.find(S=>S.id==="hub");if(y&&i.showLabels){const S=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[w,E,A]of S){const _=f(A,.4,"rgba(190, 224, 248, 0.8)");_.position.set(y.x+w*(y.radius+.7),Oa,y.z+E*(y.radius+.7)),a.add(_),s.push(_)}}return a.visible=i.enabled,{group:a,setVisible(S){a.visible=S},setLabelsVisible(S){for(const w of s)w.visible=S},dispose(){for(const S of c)S.dispose();for(const S of r)S.dispose();for(const S of o)S.dispose();a.clear()}}}const $e={grass:8,groundArea:12,ringHalo:20,ring:22,ringMeter:24,ringWarn:26,groundFx:30,trail:40,slash:44,projectileTrail:46,projectile:48,projectileGlow:50};function Ol(n,t){n.renderOrder=t,n.traverse(e=>{e.renderOrder=t})}function Bl(n,t,e){const i=Array.from({length:t.count},()=>{const a=new xn({color:t.color,transparent:!0,opacity:0,side:qe,depthWrite:!1,...t.blending?{blending:t.blending}:{}}),s=new me(t.geometry,a);return s.rotation.x=-Math.PI/2,s.renderOrder=t.renderOrder,s.visible=!1,n.add(s),{mesh:s,mat:a,life:0,base:1,delay:0}});return{entries:i,spawn(a,s,o,r,c){const l=i.find(d=>d.life<=0)??i[0];c!=null&&c.color&&l.mat.color.set(c.color),l.mesh.position.set(a,e(a,s,o)+t.yOffset,s),l.base=r,l.mesh.scale.setScalar(r*t.scaleFrom),l.mesh.visible=!0,l.mat.opacity=t.spawnOpacity,l.life=t.duration,l.delay=(c==null?void 0:c.delay)??0},update(a){for(const s of i){if(s.life<=0)continue;if(s.delay>0){s.delay-=a;continue}s.life-=a;const o=Math.max(0,s.life/Math.max(t.duration,1e-6));s.mesh.scale.setScalar(s.base*(t.scaleFrom+t.scaleSpan*(1-Math.pow(o,t.growPow)))),s.mat.opacity=t.peak*Math.pow(o,t.fadePow),s.life<=0&&(s.mesh.visible=!1)}},live(){return i.filter(a=>a.life>0)},dispose(){for(const a of i)a.mat.dispose()}}}function tR(n,t,e,i){const a=t.dash,s={count:6,geometry:new Bs(a.ringRadius-.06,a.ringRadius,28),color:"#ffffff",renderOrder:$e.groundFx,duration:a.fxDuration,peak:.9,fadePow:1,scaleFrom:.6,scaleSpan:1.2,growPow:1,yOffset:.04,spawnOpacity:.9},o=Bl(n,s,i),r=t.links,c={count:5,geometry:new Bs(r.ringRadius-.07,r.ringRadius,28),color:r.chargeColor,renderOrder:$e.groundFx,duration:r.fxDuration,peak:.85,fadePow:1,scaleFrom:.55,scaleSpan:1.1,growPow:1,yOffset:.05,spawnOpacity:.85},l=Bl(n,c,i),d=t.groundSlam,u={count:4,geometry:new Bs(.78,1,56),color:d.color,blending:Qi,renderOrder:$e.groundFx+1,duration:d.duration,peak:.85,fadePow:1.3,scaleFrom:.35,scaleSpan:.65,growPow:1.8,yOffset:.035,spawnOpacity:0},h=Bl(n,u,i);let f=e.dash.id,m="none",v=e.playerLink.id,g=e.playerLink.hitIds.length,p=e.combat.slamAttackId,b=0;return{update(x,y,S){var A;const w=x.character;if(x.dash.id!==f){f=x.dash.id;const _=x.dash;m=_.kind,_.kind==="blink"?(o.spawn(_.fromX,_.fromZ,w.position.y,.9,{color:a.blinkColor}),o.spawn(_.toX,_.toZ,w.position.y,1.35,{color:a.blinkColor})):o.spawn(_.fromX,_.fromZ,w.position.y,1.1,{color:a.rollColor})}if(o.update(y),x.combat.slamAttackId!==p&&(p=x.combat.slamAttackId,b+=1,d.enabled)){const _=(A=x.config.combat.weapons[x.combat.weapon])==null?void 0:A.groundSlam,M=Math.max(.6,(_==null?void 0:_.radius)??2.2);h.spawn(w.position.x,w.position.z,w.position.y,M,{delay:0}),h.spawn(w.position.x,w.position.z,w.position.y,M*d.outerScale,{delay:d.delay}),S(d.shake)}h.update(y);const E=x.playerLink;E.id!==v&&(v=E.id,g=E.hitIds.length,l.spawn(w.position.x,w.position.z,w.position.y,1)),E.hitIds.length>g?(g=E.hitIds.length,l.spawn(w.position.x,w.position.z,w.position.y,1.35)):E.hitIds.length<g&&(g=E.hitIds.length),l.update(y)},slamDebug(){return{spawns:b,lastId:p,live:h.live().map(x=>({life:x.life,scale:x.mesh.scale.x,opacity:x.mat.opacity,visible:x.mesh.visible}))}},groundOrder(){var x;return((x=h.entries[0])==null?void 0:x.mesh.renderOrder)??$e.groundFx+1},activeDash(){return o.live().length},dashKind(){return m},dispose(){o.dispose(),l.dispose(),h.dispose();for(const x of[s.geometry,c.geometry,u.geometry])x.dispose()}}}const kh=64,R0=[0,.24,.76,1],eR=[0,1,1,0],P0=[0,.12,.28,.5,.72,.88,1],nR=[0,.16,.5,1,.5,.16,0];function Mp(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function Ih(n,t,e,i,a=kh,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),c=s==="glow"?P0:R0,l=s==="glow"?nR:eR,d=c.length,u=a+1,h=new Float32Array(u*d*3),f=new Float32Array(u*d*4),m=[];for(let g=0;g<u;g++){const p=g/a,b=(p-.5)*e,x=Mp(p,i)*Mp(1-p,i),y=Math.sin(b),S=Math.cos(b);for(let w=0;w<d;w++){const E=o+(r-o)*c[w],A=g*d+w;h[A*3]=y*E,h[A*3+1]=0,h[A*3+2]=S*E;const _=x*l[w];f[A*4]=1,f[A*4+1]=1,f[A*4+2]=1,f[A*4+3]=_}}for(let g=0;g<a;g++)for(let p=0;p<d-1;p++){const b=g*d+p,x=b+d;m.push(b,x,b+1,b+1,x,x+1)}const v=new Ke;return v.setAttribute("position",new cn(h,3)),v.setAttribute("color",new cn(f,4)),v.setIndex(m),v.computeBoundingSphere(),v}function Hl(n){const t=new xn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:qe,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(c,l)=>{const d=Math.round(c*32)/32,u=Math.max(.05,Math.round(l*20)/20),h=`${Math.round(d*32)}|${Math.round(u*20)}`,f=e.get(h);if(f)return f;const m=Ih(n.radius,n.thickness*u,d,n.edgeFade,kh,n.profile??"band");if(e.set(h,m),e.size>64){for(const[v,g]of e)if(v!==h&&g!==i){g.dispose(),e.delete(v);break}}return m};i=a(n.arcRad,1);const s=new me(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(c,l,d,u,h,f=1){const m=Math.max(.05,f);(Math.abs(c-o)>.01||Math.abs(m-r)>.01)&&(i=a(c,m),s.geometry=i,o=c,r=m),t.opacity=l,t.color.copy(u),s.scale.set(d,1,d),s.rotation.y=h,s.visible=l>.002},arcRad(){return o},dispose(){for(const c of e.values())c.dispose();e.clear(),t.dispose()}}}function _p(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function iR(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),c=Math.min(1,Math.max(0,e)),l=a.selectedArcDeg*Math.PI/180,d=s+(l-s)*(.35+.65*r),u=4+4*r+6*c,h=.5+.5*Math.sin(i*u),f=Math.min(.95,o+(.2+.1*c)*r+.04*h),m=1+.02*r+.012*h*r;return{arcRad:d,opacity:f,scale:m,level:r}}function aR(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function sR(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let l=0;l<i;l++){const d=l/n*Math.PI*2,u=Math.sin(d),h=Math.cos(d);for(let f=0;f<a;f++){const m=f/e,v=t+(1-t)*m,g=l*a+f;s[g*3]=u*v,s[g*3+1]=0,s[g*3+2]=h*v;const p=Math.pow(1-m,1.8)*.9+(f===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let l=0;l<n;l++)for(let d=0;d<e;d++){const u=l*a+d,h=u+a;r.push(u,h,u+1,u+1,h,h+1)}const c=new Ke;return c.setAttribute("position",new cn(s,3)),c.setAttribute("color",new cn(o,4)),c.setIndex(r),c.computeBoundingSphere(),c}function bp(n){const t=n.segments??kh,e=n.profile??"band",a=((e==="glow"?P0.length:R0.length)-1)*6,s=Ih(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new xn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:qe,vertexColors:!0,toneMapped:!1}),r=new me(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let c=0;return{mesh:r,set(l,d,u,h,f=1){const m=Math.min(1,Math.max(0,l)),v=Math.round(m*t),g=m>.001?Math.max(1,v)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),c=v,o.opacity=d,o.color.copy(u),r.scale.set(f,1,f),r.rotation.y=h,r.visible=d>.002&&m>.001},ratio(){return t>0?c/t:0},filledSegments(){return c},dispose(){s.dispose(),o.dispose()}}}function Sp(n){const t=new xe,e=sR(48),i=new xn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:qe,vertexColors:!0,toneMapped:!1}),a=new me(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=Ih(1-s*.5,s,Math.PI*2,0,64,"band"),r=new xn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:qe,vertexColors:!0,toneMapped:!1}),c=new me(o,r);return c.renderOrder=(n.renderOrder??2)+1,t.add(c),t.position.y=n.y,{group:t,set(l,d,u,h,f,m){const v=Math.min(1,Math.max(0,f));t.position.set(l,u,d),a.scale.set(h,1,h),c.scale.set(h,1,h),i.opacity=v*.26,r.opacity=v*(.72+.18*Math.sin(m*7)),t.visible=v>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function wp(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function oR(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function rR(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function cR(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function lR(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function dR(n,t,e){return n?t:e}function C0(n){return{x:0,y:0,z:1}}function hR(n){return Math.asin(C0().y)}function uR(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const fR=.15,pR=-.032,mR=[.255,.175,.095,.025],Ep=[[.471,.376],[.53,.101],[.486,-.185],[.35,-.438]],gR=[{L1:.41,L2:.346},{L1:.432,L2:.367},{L1:.454,L2:.389},{L1:.497,L2:.432}],Gr=.09,xR=.42,Tp=.045,On={carapace:"#332c47",carapaceTop:"#453c60",carapaceEdge:"#4d4369",leg:"#5d4f82",tarsus:"#463a63",dark:"#1a1626",eyeMain:"#e0395a",eyeSub:"#d4823c"};function vR(n,t){const e=n.map(([f,m,v,g,p,b,x=0,y=0,S=0])=>{const w=new zn(f,m,v);return x!==0&&w.rotateX(x),y!==0&&w.rotateY(y),S!==0&&w.rotateZ(S),w.translate(g,p,b),w});let i=0,a=0;for(const f of e)i+=f.attributes.position.count,a+=f.index.count;const s=new Float32Array(i*3),o=new Float32Array(i*3),r=new Float32Array(i*3),c=i>65535?new Uint32Array(a):new Uint16Array(a),l=new ee;let d=0,u=0;e.forEach((f,m)=>{const v=f.attributes.position.count;s.set(f.attributes.position.array,d*3),o.set(f.attributes.normal.array,d*3),l.setStyle(t[m]);for(let p=0;p<v;p++)r[(d+p)*3]=l.r,r[(d+p)*3+1]=l.g,r[(d+p)*3+2]=l.b;const g=f.index.array;for(let p=0;p<g.length;p++)c[u+p]=g[p]+d;d+=v,u+=g.length,f.dispose()});const h=new Ke;return h.setAttribute("position",new cn(s,3)),h.setAttribute("normal",new cn(o,3)),h.setAttribute("color",new cn(r,3)),h.setIndex(new cn(c,1)),h.computeBoundingSphere(),h}function yR(n,t,e,i,a){const s=Math.hypot(n,e),o=-t,r=Math.atan2(n,e),c=(i+a)*.999,l=Math.abs(i-a)+.002,d=Math.hypot(s,o),u=d>c||d<l,h=Math.min(Math.max(d,l),c),f=(i*i+h*h-a*a)/(2*i*h),m=Math.acos(Math.min(1,Math.max(-1,f))),g=Math.atan2(s,o)+m,p=i*Math.sin(g),b=i*Math.cos(g),x=Math.atan2(s-p,o-b);return{yaw:r,femurPitch:-g,tibiaPitch:-(x-g),clamped:u,reach:d/(i+a)}}function MR(n,t={}){const e={height:t.height??.32,lift:t.lift??.13,duty:t.duty??.55,strideRatio:t.strideRatio??.62,bob:t.bob??.006,scale:t.scale??1,inertia:t.inertia??1},i=[],a=new gi({vertexColors:!0}),s=new xn({vertexColors:!0});i.push(a,s);const o=(k,Z,j=!1)=>{const pt=typeof Z=="string"?k.map(()=>Z):Z,dt=vR(k,pt);i.push(dt);const _t=new me(dt,j?s:a);return _t.castShadow=!j,_t.receiveShadow=!j,_t},r=new xe;r.name="spider-root",r.scale.setScalar(e.scale);const c=new xe;c.name="spider-body",c.position.y=e.height,r.add(c);const l=new xe;l.name="carapace",l.position.set(0,0,.15),c.add(l);const d=[[.3,.036,.3,0,-.03,0],[.292,.042,.292,0,.008,0],[.268,.038,.268,0,.046,0],[.228,.03,.228,0,.078,0],[.13,.105,.115,0,.03,-.175]],u=[On.carapace,On.carapaceTop,On.carapaceEdge,On.carapaceTop,"#231e33"];for(const k of[-1,1])d.push([.058,.084,.056,k*.044,-.046,.126,.28]),u.push(On.dark),d.push([.022,.042,.022,k*.044,-.098,.108,.95]),u.push("#0f0c18"),d.push([.038,.086,.038,k*.086,-.012,.108,.72,0,k*.14]),u.push(On.leg),d.push([.03,.07,.03,k*.108,-.074,.158,.06]),u.push(On.leg);l.add(o(d,u));const h=[],f=[],m=[[.034,.084,.11,.03,On.eyeMain],[.074,.076,.102,.021,On.eyeSub],[.04,.066,.108,.018,On.eyeSub],[.068,.058,.098,.016,On.eyeSub]];for(const[k,Z,j,pt,dt]of m)for(const _t of[-1,1])h.push([pt,pt,pt*.5,_t*k,Z,j]),f.push(dt);l.add(o(h,f,!0));const v=new xe;v.name="abdomen",v.position.set(0,.055,-.268),v.rotation.x=Tp,c.add(v);const g=[[.292,.044,.352,0,-.072,0],[.34,.05,.416,0,-.028,0],[.37,.054,.456,0,.023,0],[.372,.054,.454,0,.075,0],[.344,.048,.416,0,.124,0],[.284,.038,.338,0,.166,0],[.07,.038,.042,0,-.07,-.238]],p=["#3f3556","#453a5e","#4a3d63","#4d4067","#50426b","#53456f","#231e33"];v.add(o(g,p));const b=[];for(let k=0;k<8;k++){const Z=k<4?-1:1,j=k%4,{L1:pt,L2:dt}=gR[j],_t=new xe;_t.name=`hip-${k}`,_t.rotation.order="YXZ",_t.position.set(Z*fR,pR,mR[j]),c.add(_t),_t.add(o([[.088,.078,.1,0,.006,0]],On.leg));const Yt=new xe;Yt.rotation.order="YXZ",_t.add(Yt),Yt.add(o([[.064,pt*.46,.064,0,-pt*.23,0],[.052,pt*.42,.052,0,-pt*.68,0],[.042,pt*.14,.042,0,-pt*.95,0]],On.leg));const J=new xe;J.rotation.order="YXZ",J.position.y=-pt,Yt.add(J),J.add(o([[.072,.05,.072,0,.004,0],[.054,dt*.44,.054,0,-dt*.26,0],[.043,dt*.4,.043,0,-dt*.68,0],[.034,dt*.16,.034,0,-dt*.95,0]],On.leg));const W=new xe;W.position.y=-dt,J.add(W),W.add(o([[.044,.042,.044,0,0,0],[.03,Gr*.86,.03,0,-Gr*.5,0],[.044,.018,.044,0,-Gr,0]],On.tarsus));const O=(k<4?0:1)^k%2;b.push({index:k,side:Z,k:j,hip:_t,femur:Yt,tibia:J,tarsus:W,L1:pt,L2:dt,home:new Y(Z*Ep[j][0],0,Ep[j][1]),phaseOffset:O*.5,foot:new Y,from:new Y,to:new Y,swinging:!1,clamped:!1,reach:0})}let x=0,y=0;r.traverse(k=>{const Z=k;if(!Z.isMesh)return;x++;const j=Z.geometry;y+=(j.index?j.index.count:j.attributes.position.count)/3});const S=new Y,w=new Y,E=new Y;let A=0,_=0,M=0,P=0,I=!1,L=0,F=0,C=0,T=0,B=0,G=0;const $={pitch:{x:0,v:0},roll:{x:0,v:0},lean:{x:0,v:0},abdom:{x:0,v:0}},it=(k,Z,j,pt)=>{const dt=j*j*(Z-k.x)-2*j*k.v;return k.v+=dt*pt,k.x+=k.v*pt,k.x},ht=(k,Z)=>k<-Z?-Z:k>Z?Z:k;let yt={maxReach:0,clamped:0,phase:0,strideUsed:0,gaitSpeed:0,effSpeed:0,slide:0,dt:0,pitch:0,roll:0,leanZ:0,abdomen:0,meshes:x,triangles:y};const Lt=(k,Z,j,pt)=>(Z.set(k.home.x*pt,0,k.home.z*pt),r.localToWorld(Z),Z.y=j,Z);return{group:r,update:(k,Z,j,pt)=>{const dt=Math.min(Math.max(pt,0),.05);if(dt<=0)return;r.updateWorldMatrix(!0,!1),c.getWorldDirection(E),E.y=0,E.lengthSq()<1e-8&&E.set(0,0,1),E.normalize();const _t=E.z,Yt=-E.x,J=Math.atan2(E.x,E.z);let W=J-_;for(;W>Math.PI;)W-=Math.PI*2;for(;W<-Math.PI;)W+=Math.PI*2;_=J;const O=W/dt,Pt=Math.hypot(k.position.x-C,k.position.z-T);C=k.position.x,T=k.position.z;const ot=Pt>.8;if(ot){A=0;for(const X of b)X.swinging=!1}const at=ot?0:Pt/dt,Tt=Math.abs(O)*xR,mt=.66,zt=Math.max(.62,1/(1+Tt*1.1)),D=Math.min(k.stride*e.strideRatio,mt)*zt,R=at+Tt,ut=Math.min(6.4*dt,(1-e.duty)/1.5),ft=R*dt,st=Math.min(ft,ut*D);R>.02&&(A=(A+st/Math.max(D,.15))%1);const kt=ft-st,Et=(k.velocity.x-L)/dt,wt=(k.velocity.z-F)/dt;L=k.velocity.x,F=k.velocity.z;const Xt=1-Math.exp(-dt*18);B+=(Et*E.x+wt*E.z-B)*Xt,G+=(Et*_t+wt*Yt-G)*Xt;const xt=e.inertia,Ut=ht(-B*.016,.1)*xt,V=ht(G*.014-at*O*.02,.12)*xt,K=ht(-B*.01,.05)*xt,gt=ht(-B*.03,.16)*xt;it($.pitch,Ut,9,dt),it($.roll,V,8,dt),it($.lean,K,7,dt),it($.abdom,gt,5,dt);const Nt=k.position.y,Ot=k.grounded?0:1;M+=(Ot-M)*Math.min(1,dt*9);const It=1-.22*M;P+=dt*6.6*Math.min(1,R/1.4),c.position.y=e.height+Math.sin(P)*e.bob*Math.min(R,1.4)-M*.02,c.position.z=$.lean.x,c.rotation.x=$.pitch.x,c.rotation.z=$.roll.x,v.rotation.x=Tp+$.abdom.x,c.updateMatrixWorld(!0);let N=0,At=0;if(!I){I=!0,C=k.position.x,T=k.position.z;for(const X of b)Lt(X,X.foot,Nt,It),X.from.copy(X.foot),X.to.copy(X.foot),X.swinging=!1}for(const X of b){const lt=(A+X.phaseOffset)%1;if(lt<e.duty)X.swinging=!1,kt>0&&X.foot.addScaledVector(E,kt),R<.02?(Lt(X,S,Nt,It),X.foot.lerp(S,Math.min(1,dt*5))):M>.01&&(Lt(X,S,Nt,It),X.foot.lerp(S,Math.min(1,dt*6)));else{const Dt=(lt-e.duty)/(1-e.duty);X.swinging||(X.swinging=!0,X.from.copy(X.foot),Lt(X,X.to,Nt,It),X.to.addScaledVector(E,D*e.duty));const Kt=Dt*Dt*(3-2*Dt);X.foot.lerpVectors(X.from,X.to,Kt),X.foot.y=Nt+Math.sin(Math.PI*Dt)*e.lift}w.copy(X.foot),w.y+=Gr*.98,c.worldToLocal(w),w.sub(X.hip.position);const Ct=yR(w.x,w.y,w.z,X.L1,X.L2);X.hip.rotation.y=Ct.yaw,X.femur.rotation.x=Ct.femurPitch,X.tibia.rotation.x=Ct.tibiaPitch,X.tarsus.rotation.x=-(Ct.femurPitch+Ct.tibiaPitch)-.1,X.clamped=Ct.clamped,X.reach=Ct.reach,Ct.reach>N&&(N=Ct.reach),Ct.clamped&&At++}yt={maxReach:N,clamped:At,phase:A,strideUsed:D,gaitSpeed:st/Math.max(dt,1e-6),effSpeed:R,slide:kt/Math.max(dt,1e-6),dt,pitch:$.pitch.x,roll:$.roll.x,leanZ:$.lean.x,abdomen:$.abdom.x,meshes:x,triangles:y}},legs:()=>b.map(k=>({x:k.foot.x,y:k.foot.y,z:k.foot.z,swinging:k.swinging,reach:k.reach})),debug:()=>yt,dispose(){i.forEach(k=>k.dispose()),i.length=0,r.clear()}}}const _R=Math.PI/3;function Ap(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function bR(){let n=0,t=!1;return{update(e,i,a,s=_R){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=Ap(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=Ap(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function SR(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new Ke,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new cn(i,3),o=new cn(a,3);s.setUsage(Lo),o.setUsage(Lo),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const y=x*2,S=y+1,w=y+2,E=y+3;r.push(y,S,w,S,E,w)}e.setIndex(r),e.setDrawRange(0,0);const c=new xn({vertexColors:!0,transparent:!0,opacity:1,blending:Qi,depthWrite:!1,side:qe}),l=new me(e,c);l.frustumCulled=!1,l.renderOrder=6,l.visible=!1;const d=new ee(n.color);let u=[],h=null,f=0,m=0,v=!1,g=!1,p=0;function b(){const x=u.length;if(x<2||!n.enabled){l.visible=!1,e.setDrawRange(0,0);return}const y=Math.max(.001,n.life);for(let S=0;S<x;S++){const w=u[S],E=Math.max(0,1-w.age/y),A=E*E,_=Math.min(1,w.speed/Math.max(.001,n.minSpeed*2)),M=n.intensity*A*(.55+.45*_)*(1+p),P=.18+.82*E,I=S*6;i[I]=w.tx+(w.bx-w.tx)*P,i[I+1]=w.ty+(w.by-w.ty)*P,i[I+2]=w.tz+(w.bz-w.tz)*P,i[I+3]=w.tx,i[I+4]=w.ty,i[I+5]=w.tz;const L=d.r*M,F=d.g*M,C=d.b*M,T=L*.22,B=F*.22,G=C*.22;a[I]=T,a[I+1]=B,a[I+2]=G;const $=1+n.tipBoost;a[I+3]=Math.min(1,L*$),a[I+4]=Math.min(1,F*$),a[I+5]=Math.min(1,C*$)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),l.visible=!0}return{object:l,update(x,y,S){if(!n.enabled){l.visible=!1;return}const w=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*w),p<.001&&(p=0);for(const E of u)E.age+=w;for(;u.length>0&&u[0].age>n.life;)u.shift();if(y){const E=h?Math.hypot(y.tip.x-h.x,y.tip.y-h.y,y.tip.z-h.z)/Math.max(1e-4,w):0,A=u[u.length-1],_=A?Math.hypot(y.tip.x-A.tx,y.tip.y-A.ty,y.tip.z-A.tz):1/0;if(S&&_>=n.minStep)for(u.push({bx:y.base.x,by:y.base.y,bz:y.base.z,tx:y.tip.x,ty:y.tip.y,tz:y.tip.z,age:0,speed:E});u.length>t;)u.shift();h={x:y.tip.x,y:y.tip.y,z:y.tip.z},f=E,m=_,v=!0}else h=null,v=!1,f=0,m=0;g=S,b()},debug(){return{count:u.length,visible:l.visible,speed:f,moved:m,hasBlade:v,active:g,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){u=[],h=null,p=0,l.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),c.dispose()}}}const wR=`#include <common>
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
}`,ER=`vec4 mvPosition = vec4( transformed, 1.0 );
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
  float effL = ${wu.toFixed(2)} * aWindGeom.x + aWindGeom.y;
  float theta = atan(sway, max(effL, 1e-3));
  float tLow = theta * ${wu.toFixed(2)};
  float tUp  = theta * ${dv.toFixed(2)};

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
gl_Position = projectionMatrix * mvPosition;`,TR=`#include <common>
varying float vWindShade;`,AR=`#include <color_fragment>
diffuseColor.rgb *= vWindShade;`;function RR(n,t,e,i,a){const s=Math.min(e.blades.length,Math.floor(Math.max(0,i.maxInstances)/2)),o=s*2,r=new Float32Array(o*2),c=new Float32Array(o*3),l=new Float32Array(o*4),d=Math.max(.01,i.segmentHeight);for(let f=0;f<s;f++){const m=e.blades[f],v=Math.min(d,m.height),g=Math.max(0,m.height-v),[p,b]=cv(a,m.x,m.z,m.yaw*a.jitter),x=Math.min(1.4,Math.max(.6,m.height/(d*1.5)));for(let y=0;y<2;y++){const S=f*2+y;r[S*2]=p,r[S*2+1]=b,c[S*3]=m.x,c[S*3+1]=m.y,c[S*3+2]=m.z,l[S*4]=v,l[S*4+1]=g,l[S*4+2]=x,l[S*4+3]=y}}t.setAttribute("aWindPhase",new ko(r,2)),t.setAttribute("aWindRoot",new ko(c,3)),t.setAttribute("aWindGeom",new ko(l,4));const u=nm(a),h={uWindTime:{value:0},uWindDir:{value:new Wt(u.dirX,u.dirZ)},uWindOmega:{value:new Wt(u.omega1,u.omega2)},uWindAmp:{value:new Wt(u.amp1,u.amp2)},uWindGust:{value:1},uWindShade:{value:u.shadeAmount},uWindOn:{value:a.enabled?1:0}};return n.onBeforeCompile=f=>{Object.assign(f.uniforms,h),f.vertexShader=f.vertexShader.replace("#include <common>",wR).replace("#include <project_vertex>",ER),f.fragmentShader=f.fragmentShader.replace("#include <common>",TR).replace("#include <color_fragment>",AR)},n.customProgramCacheKey=()=>"grass-wind-pivot-v2",h}function PR(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function CR(n,t,e=Ho){const i=new xe;i.name="grass-layer";const s=n.blades.length,o=Math.max(0,Math.floor(t.maxInstances)),r=Math.min(s,Math.floor(o/2)),c=r*2,l=t.enabled&&c>0,u=(t.palette.length>0?t.palette:["#4a8f57"]).map(O=>new ee(O)),h=new ee(t.stumpColor),f=new ee(t.debris.color),m=new zn(1,1,1),v=new zn(1,1,1),g=new gi({color:16777215,transparent:!1}),p=RR(g,v,n,t,e),b=new gi({color:f,transparent:!1});let x=null,y=null,S=null;const w=[],E=PR(2654435769^r),A=new Float32Array(r),_=new Uint8Array(r),M=new Float32Array(r),P=new Uint8Array(r).fill(1),I=new Le,L=new _a,F=new _a,C=new _a,T=new Y,B=new Y,G=new Y,$=new Y,it=new ee,ht=new ee,yt=new Le().makeScale(0,0,0);let Lt=0,q=0,k=0,Z=0,j=1,pt=1;const dt=8;let _t={enabled:e.enabled,time:0,gust:1,mode:"pivot"};function Yt(O,Pt){if(u.length===1)return Pt.copy(u[0]);const ot=Math.max(0,Math.min(u.length-1,O*(u.length-1))),at=Math.min(u.length-2,Math.max(0,Math.floor(ot)));return Pt.copy(u[at]).lerp(u[at+1],Math.min(1,Math.max(0,ot-at)))}if(l){x=new Kf(v,g,c),x.instanceMatrix.setUsage(Lo),x.castShadow=!1,x.receiveShadow=!0,x.frustumCulled=!1,x.name="grass-blades",x.setColorAt(0,u[0]),y=x.instanceColor,y&&y.setUsage(Lo);for(let Pt=0;Pt<c;Pt++)x.setMatrixAt(Pt,yt);i.add(x);const O=Math.max(1,Math.floor(t.debris.max));S=new Kf(m,b,O),S.instanceMatrix.setUsage(Lo),S.castShadow=!1,S.receiveShadow=!1,S.frustumCulled=!1,S.name="grass-debris";for(let Pt=0;Pt<O;Pt++)S.setMatrixAt(Pt,yt);i.add(S)}i.visible=l;function J(O,Pt,ot,at,Tt,mt){if(!S)return;const zt=S.count;if(w.length>=zt)return;const D=t.debris.life,R=1.1+E()*1.5;w.push({x:O,y:Pt,z:ot,vx:at*R+(E()-.5)*1.2,vy:1.9+E()*1.8,vz:Tt*R+(E()-.5)*1.2,life:D,total:D,size:mt*(.55+E()*.45),spin:(E()-.5)*9})}function W(O){if(!S)return;const Pt=S.count,ot=12;for(let Tt=w.length-1;Tt>=0;Tt--){const mt=w[Tt];if(mt.life-=O,mt.life<=0){w.splice(Tt,1);continue}mt.vy-=ot*O,mt.x+=mt.vx*O,mt.y+=mt.vy*O,mt.z+=mt.vz*O,mt.y<.02&&(mt.y=.02,mt.vy=-mt.vy*.25,mt.vx*=.6,mt.vz*=.6)}const at=1e-4;for(let Tt=0;Tt<Pt;Tt++){const mt=w[Tt];if(!mt){S.setMatrixAt(Tt,yt);continue}const zt=Math.max(at,mt.life/mt.total);B.set(mt.x,mt.y,mt.z),T.set(.4+Tt*.13,1,.2).normalize(),L.setFromAxisAngle(T,mt.spin*(mt.total-mt.life)),G.set(mt.size*zt,mt.size*.7*zt,mt.size*zt),I.compose(B,L,G),S.setMatrixAt(Tt,I)}S.instanceMatrix.needsUpdate=!0}return{object:i,update(O,Pt){var gt,Nt,Ot;if(!l||!x)return;const ot=O.grass,at=((gt=O.config.grass)==null?void 0:gt.wind)??Ho,Tt=nm(at),mt=((Nt=ot.wind)==null?void 0:Nt.time)??0,zt=((Ot=ot.wind)==null?void 0:Ot.gust)??1;p.uWindTime.value=mt,p.uWindGust.value=zt,p.uWindDir.value.set(Tt.dirX,Tt.dirZ),p.uWindOmega.value.set(Tt.omega1,Tt.omega2),p.uWindAmp.value.set(Tt.amp1,Tt.amp2),p.uWindShade.value=Tt.shadeAmount,p.uWindOn.value=at.enabled?1:0,_t={enabled:at.enabled,time:mt,gust:zt,mode:"pivot"};const D=Math.min(r,ot.blades.length),R=Math.min(.05,Math.max(0,Pt)),Q=O.config.grass,ut=(Q==null?void 0:Q.regrowSec)??0,ft=Math.min(1,Math.max(.05,(Q==null?void 0:Q.stumpRatio)??.34)),st=t.segmentHeight,kt=Math.PI*2;x.instanceMatrix.clearUpdateRanges(),y&&y.clearUpdateRanges();let Et=0,wt=0,Xt=0,xt=0,Ut=0,V=0,K=0;for(let It=0;It<D;It++){const N=ot.blades[It],At=N.cut!==0?1:0,X=N.yaw/kt,lt=hv(N.cut,ut,X),Ct=Math.min(st,N.height),Dt=Ct*ft,Kt=Dt+(N.height-Dt)*lt;if(It<dt&&(V+=Kt/Math.max(1e-6,N.height),K+=1),lt>.001&&lt<1-.001&&(xt+=1,Ut+=lt),!(P[It]===1||Math.abs(N.bend-A[It])>1e-4||At!==_[It]||Math.abs(lt-M[It])>.001)){N.bend>.02&&(wt+=1),At&&(Xt+=1);continue}At&&!_[It]&&P[It]!==1&&(J(N.x,N.y+Ct*.75,N.z,N.bendX||1,N.bendZ||0,N.width*1.5),J(N.x,N.y+Ct+(N.height-Ct)*.5,N.z,N.bendX||1,N.bendZ||0,N.width*1.2)),T.set(Math.cos(N.yaw),0,-Math.sin(N.yaw)),C.setFromAxisAngle(T,N.lean),T.set(N.bendZ,0,-N.bendX),F.setFromAxisAngle(T,N.bend),L.copy(F).multiply(C),$.set(N.x,N.y,N.z);const de=Math.min(st,Kt),Qt=Math.max(0,Kt-st);B.set(0,de*.5,0).applyQuaternion(L).add($),G.set(N.width,de,N.width),I.compose(B,L,G),x.setMatrixAt(It*2,I),Qt<1e-4?x.setMatrixAt(It*2+1,yt):(B.set(0,de+Qt*.5,0).applyQuaternion(L).add($),G.set(N.width*.84,Qt,N.width*.84),I.compose(B,L,G),x.setMatrixAt(It*2+1,I)),Yt(N.tone,ht),lt>=1?it.copy(ht):it.copy(h).lerp(ht,lt),x.setColorAt(It*2,it),x.setColorAt(It*2+1,it),x.instanceMatrix.addUpdateRange(It*32,32),y&&y.addUpdateRange(It*6,6),A[It]=N.bend,_[It]=At,M[It]=lt,P[It]=0,Et+=1,N.bend>.02&&(wt+=1),At&&(Xt+=1)}Et>0&&(x.instanceMatrix.needsUpdate=!0,y&&(y.needsUpdate=!0)),W(R),Lt=Et,q=wt,k=Xt,Z=xt,j=xt>0?Ut/xt:1,pt=K>0?V/K:1},debug(){return{enabled:l,blades:s,patches:n.patches.length,instances:c,drawCalls:l?2:0,dirty:Lt,bent:q,cut:k,debris:w.length,growing:Z,avgGrowth:j,sampleHeight:pt,wind:{..._t}}},dispose(){m.dispose(),v.dispose(),g.dispose(),b.dispose(),i.clear()}}}const Gl=10,LR=.14,Ro=1e-6;function wo(n,t,e){return n<t?t:n>e?e:n}function Rp(n,t,e,i){const a=t.length,s=[],o=(d,u,h)=>{s.push(d[0],d[1],d[2],u[0],u[1],u[2],h[0],h[1],h[2])},r=(d,u)=>{const h=u/a*Math.PI*2;return[Math.cos(h)*n,d,Math.sin(h)*n]};for(let d=0;d<a;d++){const u=(d+1)%a,h=r(t[d],d),f=r(t[u],u),m=r(e[d],d),v=r(e[u],u);o(h,f,v),o(h,v,m)}const c=a*6;if(i!=="none"){const d=i==="b"?e:t;let u=0;for(let h=0;h<a;h++)u+=d[h];u/=a;for(let h=0;h<a;h++){const f=(h+1)%a;o([0,u,0],r(d[h],h),r(d[f],f))}}const l=new Ke;return l.setAttribute("position",new De(s,3)),l.addGroup(0,c,0),i!=="none"&&l.addGroup(c,a*3,1),l.computeVertexNormals(),l}function DR(n,t,e,i){const a={x:t.x-n.x,y:t.y-n.y,z:t.z-n.z},s={x:i.x-e.x,y:i.y-e.y,z:i.z-e.z},o={x:n.x-e.x,y:n.y-e.y,z:n.z-e.z},r=(v,g)=>v.x*g.x+v.y*g.y+v.z*g.z,c=r(a,a),l=r(s,s),d=r(s,o);let u=0,h=0;if(c<=Ro&&l<=Ro)u=0,h=0;else if(c<=Ro)u=0,h=wo(d/l,0,1);else{const v=r(a,o);if(l<=Ro)h=0,u=wo(-v/c,0,1);else{const g=r(a,s),p=c*l-g*g;u=p!==0?wo((g*d-v*l)/p,0,1):0,h=(g*u+d)/l,h<0?(h=0,u=wo(-v/c,0,1)):h>1&&(h=1,u=wo((g-v)/c,0,1))}}const f={x:n.x+a.x*u,y:n.y+a.y*u,z:n.z+a.z*u},m={x:e.x+s.x*h,y:e.y+s.y*h,z:e.z+s.z*h};return{dist:Math.hypot(f.x-m.x,f.y-m.y,f.z-m.z),cq:m}}function kR(n){const t=new xe;t.name="destructibles";const e=[];let i=null,a=null;for(const f of n){const m=new gi({color:new ee(f.color),side:qe}),v=new gi({color:new ee(f.cutColor),side:qe}),g=new me(new Ke,[m,v]),p=new me(new Ke,[m,v]);g.name=`lower-${f.id}`,p.name=`upper-${f.id}`;const b=new xe;b.add(p);const x=new xe;x.name=`piece-${f.id}`,x.position.set(f.x,f.y,f.z),x.add(g,b),t.add(x),e.push({id:f.id,root:x,lower:g,upperGroup:b,upper:p,bodyMat:m,capMat:v,key:""})}const s=(f,m)=>{const v=m.cutU*m.height,g=Mv(m.radius,Gl,m.cutU,m.height,m.nx,m.ny,m.nz),p=new Array(Gl).fill(0),b=new Array(Gl).fill(m.height),x=Rp(m.radius,p,g,"b"),y=Rp(m.radius,g.map(S=>S-v),b.map(S=>S-v),"a");f.lower.geometry.dispose(),f.upper.geometry.dispose(),f.lower.geometry=x,f.upper.geometry=y},o=new Y;function r(f){for(let m=0;m<e.length;m++){const v=e[m];let g;for(let b=0;b<f.length;b++)if(f[b].id===v.id){g=f[b];break}if(!g){v.upperGroup.visible=!1;continue}const p=`${g.broken}|${g.cutU}|${g.theta}|${g.nx}|${g.ny}|${g.nz}`;p!==v.key&&(s(v,g),v.key=p),v.bodyMat.color.set(g.color),v.capMat.color.set(g.cutColor),v.root.position.set(g.x,g.y,g.z),v.upperGroup.visible=g.broken!==0,v.upperGroup.position.set(0,g.cutU*g.height,0),o.set(g.ax,g.ay,g.az),v.upperGroup.quaternion.setFromAxisAngle(o,g.fall)}}function c(f,m){const v=[],g=(p,b)=>{if(!p){b==="right"?i=null:a=null;return}const x={x:(p.base.x+p.tip.x)/2,y:(p.base.y+p.tip.y)/2,z:(p.base.z+p.tip.z)/2},y=b==="right"?i:a;if(b==="right"?i=x:a=x,!y)return;let S=p.tip.x-p.base.x,w=p.tip.y-p.base.y,E=p.tip.z-p.base.z;const A=x.x-y.x,_=x.y-y.y,M=x.z-y.z;Math.hypot(A,_,M)>.002&&(S=A,w=_,E=M);const I=Math.hypot(S,w,E);I>Ro?(S/=I,w/=I,E/=I):(S=0,w=0,E=1);const L={x:0,y:0,z:0},F={x:0,y:0,z:0};for(let C=0;C<f.length;C++){const T=f[C];if(T.broken!==0)continue;L.x=T.x,L.y=T.y,L.z=T.z,F.x=T.x,F.y=T.y+T.height,F.z=T.z;const B=DR(p.base,p.tip,L,F);if(!(B.dist>T.radius+LR)){v.push({id:T.id,x:B.cq.x,y:B.cq.y,z:B.cq.z,dx:S,dy:w,dz:E});break}}};return g(m.right,"right"),g(m.left,"left"),v}function l(){let f=0;const m=[],v=[];let g=0;for(const p of e)p.lower.visible&&(f+=1),p.upperGroup.visible&&(f+=1),v.push({id:p.id,x:p.root.position.x,y:p.root.position.y,z:p.root.position.z});for(const p of d)p.broken!==0&&(g+=1,m.push({id:p.id,cutU:p.cutU,theta:p.theta,nx:p.nx,ny:p.ny,nz:p.nz,fall:p.fall}));return{count:e.length,broken:g,drawCalls:f,positions:v,cuts:m}}let d=n;const u=f=>{d=f,r(f)};function h(){for(const f of e)f.lower.geometry.dispose(),f.upper.geometry.dispose(),f.bodyMat.dispose(),f.capMat.dispose();t.clear()}return u(n),{object:t,update:u,computeHits:c,debug:l,dispose:h}}function IR(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function zR(n,t,e,i,a){var se,ie,Jt,ve,re;const s=Math.max(1,n.clientWidth),o=Math.max(1,n.clientHeight),r=new vA({antialias:!0});r.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),r.shadowMap.enabled=!0,r.shadowMap.type=xm,r.setSize(s,o,!1),n.appendChild(r.domElement);const c=new yA;c.background=new ee("#12161d"),c.add(new n2(11061486,2764600,1.15));const l=(t.gridMeta.minX+t.gridMeta.maxX)/2,d=(t.gridMeta.minZ+t.gridMeta.maxZ)/2,u=Math.max(t.gridMeta.maxX-t.gridMeta.minX,t.gridMeta.maxZ-t.gridMeta.minZ)/2+4,h=new s2(16773852,1.5);h.position.set(l+9,18,d+11),h.target.position.set(l,0,d),h.castShadow=!0,h.shadow.mapSize.set(2048,2048);const f=h.shadow.camera;f.left=-u,f.right=u,f.top=u,f.bottom=-u,f.near=1,f.far=90,c.add(h),c.add(h.target);const m=[],v=new xe;for(const H of t.boxes){const Rt=H.maxX-H.minX,St=H.maxY-H.minY,bt=H.maxZ-H.minZ;let te=IR(H.kind,e);H.kind==="step"&&(te=new ee(te).offsetHSL(0,0,H.maxY*.09).getStyle());const Bt=new gi({color:te,transparent:!1,opacity:1}),le=new me(new zn(Rt,St,bt),Bt);le.position.set((H.minX+H.maxX)/2,(H.minY+H.maxY)/2,(H.minZ+H.maxZ)/2),le.castShadow=H.kind!=="ground",le.receiveShadow=!0,le.add(new np(new UA(le.geometry),new $d({color:10467020,transparent:!0,opacity:.32}))),v.add(le),m.push(Bt)}c.add(v);const g=t.gridMeta,p=[],b=[],x=.002,y=1;for(let H=g.minX;H<=g.maxX+1e-6;H+=y)(Math.round(H/y)%5===0?b:p).push(H,x,g.minZ,H,x,g.maxZ);for(let H=g.minZ;H<=g.maxZ+1e-6;H+=y)(Math.round(H/y)%5===0?b:p).push(g.minX,x,H,g.maxX,x,H);const S=new xe,w=[[p,3358797,.5],[b,4873328,.85]];for(const[H,Rt,St]of w){const bt=new Ke;bt.setAttribute("position",new De(H,3)),S.add(new np(bt,new $d({color:Rt,transparent:!0,opacity:St})))}S.visible=e.showGrid,c.add(S);const E=Q2(i,e,a);c.add(E.group);const A=CR(t.grass,e.grass,t.config.grass.wind);Ol(A.object,$e.grass),c.add(A.object);const _=kR(t.destructibles);c.add(_.object);let M=[];const P=H=>(H==null?void 0:H.rig)==="spider"?(C=.2,e.camera.pitchDeg=27,MR(e.colors,{height:.35,scale:1.3})):(C=1,e.camera.pitchDeg=I,A0((H==null?void 0:H.voxel)??e.voxel,H!=null&&H.colors?{...e.colors,...H.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance)),I=e.camera.pitchDeg,L=typeof location<"u"?new URLSearchParams(location.search).get("hero"):null;let F=L&&((se=e.bodyTypes)!=null&&se[L])?L:"standard",C=1,T=P((ie=e.bodyTypes)==null?void 0:ie[F]);const B=SR(e.weaponTrail);Ol(B.object,$e.trail),c.add(B.object);const G=new xe,$=new xe;let it=.9;const ht=H=>(H==null?void 0:H.rig)==="spider"?.26:.9,yt=(H,Rt)=>{it=Rt,$.position.y=Rt,H.group.position.y=-Rt,$.add(H.group)};yt(T,ht((Jt=e.bodyTypes)==null?void 0:Jt[F])),G.add($),c.add(G);const Lt=t.config.moveSpeed,q=H=>{H&&(t.config.characterHeight=H.height,H.radius!==void 0&&(t.config.characterRadius=H.radius),t.config.moveSpeed=H.moveSpeed??Lt)};q((ve=e.bodyTypes)==null?void 0:ve[F]);const k=bR();let Z=0;const j=((re=t.config.dummies.fighters)==null?void 0:re.moveSpeed)??t.config.dummies.moveSpeed;function pt(H,Rt){const St=e.dummies.colors,bt=St[Rt%St.length]??"#cccccc";let te;if(H.weapon){const Bt=e.dummies.fighterColors,le=Bt&&Bt.length>0?Bt[(Rt-t.config.dummies.count)%Bt.length]:void 0;te=J2({voxel:e.voxel,colors:le?{...e.colors,...le}:e.colors,moveSpeed:j,orientation:e.orientation,gait:e.gait,mount:e.weaponMount,lean:e.lean,hurt:e.hurt,animation:e.animation,ik:e.ik,links:e.links,wrist:e.weaponWrist,balance:e.balance})}else{const Bt=A2(e.voxel,e.colors,bt,H.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);te={group:Bt.group,update:(le,Re)=>Bt.update(le,Re),boneAtWorld:(le,Re,Se)=>Bt.boneAtWorld(le,Re,Se),dispose:()=>Bt.dispose()}}return te.group.traverse(Bt=>{Bt.userData.dummyId=H.id}),c.add(te.group),te}const dt=t.dummies.map(pt),_t=dt.map(H=>H.group),Yt=new o2,J=e.groundRing,W=e.voxel.bodyWidth,O=_p(W,J.playerRadiusFactor),Pt=_p(W,J.dummyRadiusFactor),ot=W*J.thicknessFactor,at=J.arcDeg*Math.PI/180;let Tt=0;const mt=(H,Rt,St)=>Xp(t.boxes,H,Rt,St+.55,0),zt=Hl({radius:O,thickness:ot,arcRad:at,edgeFade:J.edgeFade,color:J.playerColor,opacity:J.playerOpacity,y:.028,renderOrder:$e.ring});zt.mesh.name="player-ground-ring",c.add(zt.mesh);function D(H){const Rt=Hl({radius:Pt,thickness:ot,arcRad:at,edgeFade:J.edgeFade,color:J.neutralColor,opacity:J.opacity,y:.022,renderOrder:$e.ring});return Rt.mesh.name=`dummy-ground-ring-${H.id}`,c.add(Rt.mesh),Rt}function R(H){const Rt=Hl({radius:Pt*J.haloRadiusFactor,thickness:ot*J.haloThicknessFactor,arcRad:at,edgeFade:J.edgeFade,color:J.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:$e.ringHalo});return Rt.mesh.name=`dummy-ground-halo-${H.id}`,c.add(Rt.mesh),Rt}function Q(H){const Rt=bp({radius:Pt*J.warnRadiusFactor,thickness:ot*J.warnThicknessFactor,arcRad:at,edgeFade:.02,color:J.warnColor,y:.031,renderOrder:$e.ringWarn});return Rt.mesh.name=`dummy-ground-warn-${H.id}`,c.add(Rt.mesh),Rt}const ut=t.dummies.map(D),ft=t.dummies.map(R),st=t.dummies.map(()=>0),kt=t.dummies.map(()=>0),Et=bp({radius:O*J.meterRadiusFactor,thickness:ot*J.meterThicknessFactor,arcRad:at,edgeFade:.06,color:J.meterColorCharge,y:.03,renderOrder:$e.ringMeter});Et.mesh.name="player-ground-meter",c.add(Et.mesh);const wt=t.dummies.map(Q),Xt=Sp({color:J.playerColor,y:.042,renderOrder:$e.groundArea});Xt.group.name="player-landing-preview",c.add(Xt.group);const xt=new ee,Ut=new ee(J.playerColor),V=new ee(J.neutralColor),K=new ee(J.lowThreatColor),gt=new ee(J.highThreatColor),Nt=new ee(J.meterColorCharge),Ot=new ee(J.meterColorChannel),It=new ee(J.meterColorCooldown),N=new ee(J.warnColor),At=new xe;c.add(At);const X=e.projectiles;function lt(){const Rt=document.createElement("canvas");Rt.width=64,Rt.height=64;const St=Rt.getContext("2d");if(St){const te=St.createRadialGradient(32,32,0,32,32,32);te.addColorStop(0,"rgba(255,255,255,1)"),te.addColorStop(.28,"rgba(255,255,255,0.72)"),te.addColorStop(.62,"rgba(255,255,255,0.22)"),te.addColorStop(1,"rgba(255,255,255,0)"),St.fillStyle=te,St.fillRect(0,0,64,64)}const bt=new Zd(Rt);return bt.colorSpace=Hn,bt}function Ct(){const St=document.createElement("canvas");St.width=2,St.height=64;const bt=St.getContext("2d");if(bt){const Bt=bt.createLinearGradient(0,0,0,64);Bt.addColorStop(0,"rgba(255,255,255,0)"),Bt.addColorStop(.55,"rgba(255,255,255,0.35)"),Bt.addColorStop(1,"rgba(255,255,255,0.95)"),bt.fillStyle=Bt,bt.fillRect(0,0,2,64)}const te=new Zd(St);return te.colorSpace=Hn,te}const Dt=lt(),Kt=Ct(),oe=new xn({color:12577023,transparent:!0,opacity:0,side:qe,depthWrite:!1}),de=new xn({color:14217983,transparent:!0,opacity:0,side:qe,depthWrite:!1,blending:Qi}),Qt=new xe;Qt.position.set(0,.95,.72),At.add(Qt);const we=new xe;we.rotation.x=hR(e.camera.pitchDeg),Qt.add(we);const ze=new Rc(.78,X.slashThickness,6,28,Math.PI*1.15),Je=new xe,Mn=new me(ze,oe),Pe=new me(ze,de);Pe.scale.setScalar(1.09),Ol(Je,$e.slash),Pe.renderOrder=$e.slash+1,Je.add(Mn,Pe),we.add(Je);const Fe=new zn(X.arrowWidth,X.arrowWidth,X.arrowLength),mn=new Ah(X.arrowHeadSize*.42,X.arrowHeadSize,4);mn.rotateX(Math.PI/2);const Xn=new zn(X.arrowWidth*2.6,X.arrowWidth*.4,.1),sn=new Wo(X.arrowWidth*.45,X.arrowWidth*1.3,X.trailLength,6,1,!0);sn.rotateX(-Math.PI/2),sn.translate(0,0,-X.trailLength/2);const An=Array.from({length:10},()=>{const H=new xe,Rt=new xn({color:X.arrowColor,transparent:!0}),St=new xn({color:X.arrowHeadColor,transparent:!0}),bt=new Yd({map:Dt,color:X.arrowColor,transparent:!0,opacity:.85,blending:Qi,depthWrite:!1}),te=new xn({color:X.arrowTrailColor,map:Kt,transparent:!0,opacity:0,blending:Qi,depthWrite:!1,side:qe}),Bt=new me(Fe,Rt),le=new me(mn,St);le.position.z=X.arrowLength/2+X.arrowHeadSize*.42;const Re=new me(Xn,St),Se=new me(Xn,St);Re.position.z=-X.arrowLength/2+.08,Se.position.z=Re.position.z,Se.rotation.z=Math.PI/2;const Ce=new Zf(bt);Ce.scale.setScalar(X.arrowGlowSize),Ce.renderOrder=$e.projectileGlow;const ye=new me(sn,te);return ye.renderOrder=$e.projectileTrail,Bt.renderOrder=$e.projectile,le.renderOrder=$e.projectile,Re.renderOrder=$e.projectile,Se.renderOrder=$e.projectile,H.add(Bt,le,Re,Se,Ce,ye),H.visible=!1,c.add(H),{group:H,shaftMat:Rt,tipMat:St,glowMat:bt,trailMat:te,glow:Ce,trail:ye,arrowId:0,bone:null}}),_n=new Ph(1,0),$n=new Y(X.boltShapeX,X.boltShapeY,X.boltShapeZ),Zn=new xn({color:X.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),ri=new Yd({map:Dt,color:X.boltGlowColor,transparent:!0,opacity:.45,blending:Qi,depthWrite:!1}),Ei=new xn({color:X.boltGlowColor,map:Kt,transparent:!0,opacity:X.trailOpacity,blending:Qi,depthWrite:!1,side:qe}),Pn=new Wo(.5,.03,X.boltTrailScale,6,1,!0);Pn.rotateX(-Math.PI/2),Pn.translate(0,0,-X.boltTrailScale/2);const z=Array.from({length:24},()=>{const H=new xe,Rt=new me(_n,Zn);Rt.scale.copy($n);const St=new Zf(ri);St.scale.setScalar(X.boltGlowScale),St.renderOrder=$e.projectileGlow;const bt=new me(Pn,Ei);return bt.renderOrder=$e.projectileTrail,Rt.renderOrder=$e.projectile,H.add(Rt,St,bt),H.visible=!1,c.add(H),{group:H,core:Rt}}),nt=Array.from({length:6},()=>{const H=Sp({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:$e.groundArea});return H.group.visible=!1,c.add(H.group),H}),ct=tR(c,e,t,mt),rt=c2(e.camera,e.smartCamera,e.zoom,s/o),tt=t.character.position;rt.update(tt.x,tt.y,tt.z,1,t.camera);function Ft(H){const Rt=H.dummies.length;for(;dt.length<Rt;){const bt=dt.length,te=H.dummies[bt],Bt=pt(te,bt);dt.push(Bt),_t.push(Bt.group),ut.push(D(te)),ft.push(R(te)),wt.push(Q(te)),st.push(0),kt.push(0)}let St=!1;for(;dt.length>Rt;){St=!0;const bt=dt.pop();c.remove(bt.group),bt.dispose(),_t.pop();const te=ut.pop();c.remove(te.mesh),te.dispose();const Bt=ft.pop();c.remove(Bt.mesh),Bt.dispose();const le=wt.pop();c.remove(le.mesh),le.dispose(),st.pop(),kt.pop()}if(St)for(let bt=0;bt<Rt;bt++){const te=H.dummies[bt].id;dt[bt].group.userData.dummyId!==te&&dt[bt].group.traverse(Bt=>{Bt.userData.dummyId=te})}}function Gt(H,Rt){if(_t.length===0)return 0;const St=r.domElement.getBoundingClientRect(),bt=new Wt((H-St.left)/St.width*2-1,-((Rt-St.top)/St.height)*2+1);Yt.setFromCamera(bt,rt.camera);const te=Yt.intersectObjects(_t,!0);for(const Bt of te){const le=Bt.object.userData.dummyId;if(le&&le>0)return le}return 0}function Zt(H,Rt,St){const bt=r.domElement.getBoundingClientRect(),te=new Y(H,Rt,St).project(rt.camera);return{x:bt.left+(te.x*.5+.5)*bt.width,y:bt.top+(-te.y*.5+.5)*bt.height}}let qt=!1;return{balanceDebug(){var H;return((H=T.balanceDebug)==null?void 0:H.call(T))??null},spineDebug(){var H;return((H=T.spineDebug)==null?void 0:H.call(T))??null},spiderDebug(){var H;return((H=T.debug)==null?void 0:H.call(T))??null},gaitDebug(){var H;return((H=T.gaitDebug)==null?void 0:H.call(T))??{stopT:0,hipYaw:0,chestYaw:0,speed:0,gaitSpeed:0,stopStep:0,stopShift:0,stopDip:0,stopYawFade:0,turnStep:0,legLPitch:0,legLRoll:0,legRPitch:0,legRRoll:0,legTakeover:0,phase:0,dirF:0,dirR:0,hipYawTarget:0,spin:0}},trailDebug(){return B.debug()},stretchDebug(){var Rt;const H=((Rt=T.stretch)==null?void 0:Rt.call(T))??{arm:1,leg:1,torso:1,impact:0};return{arm:H.arm,leg:H.leg,torso:H.torso,impact:H.impact}},swingDebug(){var H;return((H=T.swingDebug)==null?void 0:H.call(T))??{seg:0,kind:"none",lead:"R",yaw:0,pitch:0,roll:0,strike:0,rootYaw:0,spinYaw:0,rootTurn:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0,shoulderL:{x:0,y:0,z:0},shoulderR:{x:0,y:0,z:0}}},stanceDebug(){var H;return((H=T.stanceDebug)==null?void 0:H.call(T))??{weapon:t.combat.weapon,weight:0,armL:{pitch:0,yaw:0,roll:0,elbow:0},armR:{pitch:0,yaw:0,roll:0,elbow:0},torsoYaw:0,torsoPitch:0,bladePitchDeg:0,bladePitchOffDeg:0,armSwing:0}},bladeWorld(){var H;return((H=T.weaponBlade)==null?void 0:H.call(T))??null},bladesWorld(){var H;return((H=T.bladesWorld)==null?void 0:H.call(T))??{right:null,left:null}},slamDebug(){return ct.slamDebug()},yawDebug(){var H;return{target:Z,shown:k.value,tauMs:((H=e.renderInterp)==null?void 0:H.yawSmoothMs)??0}},grassDebug(){return A.debug()},breakHits(){return M},destructibleDebug(){return _.debug()},fxDebug(){var H,Rt;return{boxOpaque:m.every(St=>!St.transparent),boxCount:m.length,orders:{ring:zt.mesh.renderOrder,groundFx:ct.groundOrder(),trail:B.object.renderOrder,slash:Je.renderOrder,projectile:((Rt=(H=An[0])==null?void 0:H.group.children[0])==null?void 0:Rt.renderOrder)??-1}}},renderPose(){return{x:G.position.x,y:G.position.y,z:G.position.z,bodyYaw:G.rotation.y}},projectPoint(H,Rt,St){return Zt(H,Rt,St)},setClipT(H){var Rt;(Rt=T.setClipT)==null||Rt.call(T,H)},weaponDebug(){var H;return((H=T.weaponDebug)==null?void 0:H.call(T))??{wristPitch:0,wristTwist:0}},gripDebug(){var H;return((H=T.gripDebug)==null?void 0:H.call(T))??{active:!1,dist:0,gy:0,pitch:0,joint:0,grip:0}},render(H,Rt){var qn,es,ns;Ft(H);const St=H.character,bt=H.combat,te=e.hitstop.enabled&&H.combat.hitstop>0,Bt=Rt*Math.max(0,Math.min(4,bt.warp??1));if(te&&!qt){const ce=Math.max(0,H.combat.hitstop),Ht=Math.max(0,Math.min(1,ce/.1));rt.addShake(.34+Ht*.48);let he=null;for(let Qe=0;Qe<H.events.length;Qe++){const We=H.events[Qe];if(We.type==="hit"){he=We;break}}he&&rt.addKick(he.x-St.position.x,he.z-St.position.z,.03+Ht*.05)}qt=te;for(let ce=0;ce<H.events.length;ce++){const Ht=H.events[ce];if(Ht.type!=="notify")continue;const he=Number.isFinite(Ht.value)?Ht.value:0;if(Ht.name==="blade-air"){const Qe=Math.max(0,Math.min(1,he));B.pulse((bt.weapon==="greatsword"?.9:.55)*(.4+.6*Qe))}}G.position.set(St.position.x,St.position.y,St.position.z),Z=St.bodyYaw,G.rotation.y=k.update(Z,Rt,((qn=e.renderInterp)==null?void 0:qn.yawSmoothMs)??0);const le=H.dash.phase==="active"&&H.dash.kind==="roll",Re=le&&H.dash.duration>0?Math.min(1,1-H.dash.timer/H.dash.duration):0;if($.rotation.x=le?Re*Math.PI*2:0,$.position.y=it-(le?.2*Math.sin(Math.PI*Re):0),Bt>0&&T.update(St,bt,H.playerHurt,Bt,H.abilities.channeling,H.time,H.playerLink,H.turnInPlace),B.update(Bt,Bt>0?((es=T.weaponBlade)==null?void 0:es.call(T))??null:null,Bt>0&&(bt.phase==="active"||H.playerLink.phase==="active"||le&&H.dash.duration>0)),Bt>0)for(let ce=0;ce<dt.length;ce++)H.dummies[ce]&&dt[ce].update(H.dummies[ce],Bt,H.time);const Se=rt.camera.position,Ce=Math.atan2(Se.x-St.position.x,Se.z-St.position.z),ye=H.config.gaze.hurtHoldSec,ge=H.time-H.playerHurt.lastAt,Te=ye>0&&ge>=0&&ge<ye?1-ge/ye:0,Ve=iR(H.gaze.active,H.gaze.threat,Te,H.time,J);aR(xt,Ut,K,gt,Ve.level),Tt=dR(St.grounded,St.position.y,Tt),zt.mesh.position.set(St.position.x,Tt+.028,St.position.z),zt.update(Ve.arcRad,Ve.opacity,Ve.scale,xt,Ce);const ln=H.config.abilities.arcane,bn=Math.max(1,Math.floor(ln.waves)),ci=Math.max(1e-4,ln.waveInterval),jn=rR({charging:bt.charging,charge:bt.charge,channeling:H.abilities.channeling,fireTimer:H.abilities.fireTimer,fireInterval:ci,channelProgress:H.abilities.channeling?(H.abilities.waveIndex+(1-Math.min(1,Math.max(0,H.abilities.fireTimer/ci))))/bn:0,arcaneCooldown:H.abilities.cooldown,arcaneCooldownMax:ln.cooldown,dashCooldown:H.dash.cooldown,dashCooldownMax:H.dash.kind==="blink"?H.config.dash.blinkCooldown:H.config.dash.rollCooldown});Et.mesh.position.set(St.position.x,St.position.y+.03,St.position.z),Et.set(jn.ratio,jn.source==="none"?0:J.meterOpacity,jn.source==="charge"?Nt:jn.source==="channel"?Ot:It,Ce);const li=H.playerLink,Hi=li.weapon?H.config.links.moves[li.weapon]:void 0,Sn=cR(li.phase,St.position.x,St.position.z,li.facing,li.travel,(Hi==null?void 0:Hi.hit.radius)??.9);Xt.set(Sn.x,Sn.z,mt(Sn.x,Sn.z,St.position.y)+.042,Sn.radius,Sn.active?J.landingOpacity:0,H.time);for(let ce=0;ce<ut.length;ce++){const Ht=H.dummies[ce],he=ut[ce],Qe=ft[ce],We=wt[ce];if(!Ht){he.mesh.visible=!1,Qe.mesh.visible=!1,We.mesh.visible=!1;continue}const wn=H.targeting.hasTarget&&H.targeting.targetId===Ht.id;if(sv(H,Ht)){const Ko=ov(H,Ht);xt.copy(K).lerp(gt,Ko)}else xt.copy(V);const Kn=oR(Ht.attackPhase,Ht.attackPhaseTimer,H.config.dummies.attackWindup);Kn.active?(xt.lerp(N,.5*Kn.urgency),We.mesh.position.set(Ht.position.x,Ht.position.y+.031,Ht.position.z),We.set(Kn.ratio,J.warnOpacity*(.65+.35*Kn.urgency),N,Ce)):We.set(0,0,N,Ce);const Ea=wn?1:0,di=Ea>st[ce]?J.haloFadeInSec:J.haloFadeOutSec;st[ce]=wp(st[ce],Ea,Rt,di);const Ti=st[ce],Ai=1+.02*Ti*Math.sin(H.time*2.2+Ht.id),to=J.arcDeg+(J.selectedArcDeg-J.arcDeg)*Ti;he.mesh.position.set(Ht.position.x,Ht.position.y+.022,Ht.position.z),he.update(to*Math.PI/180,J.opacity+(J.selectedOpacity-J.opacity)*Ti,1+(J.selectedScale-1)*Ti*Ai,xt,Ce,1+(J.selectedThicknessScale-1)*Ti),kt[ce]=wp(kt[ce],Ea,Rt,Ea>kt[ce]?J.haloFadeInSec:J.haloFadeOutSec);const is=kt[ce];Qe.mesh.position.set(Ht.position.x,Ht.position.y+.019,Ht.position.z),Qe.update(to*Math.PI/180,J.haloOpacity*is*(.88+.12*Math.sin(H.time*2.2+Ht.id)),J.selectedScale*(.94+.06*is)*Ai,xt,Ce)}At.position.set(St.position.x,St.position.y,St.position.z),At.rotation.y=bt.phase!=="idle"?bt.attackFacing:St.bodyYaw,ct.update(H,Rt,ce=>rt.addShake(ce));const Gi=X.slashEnabled&&bt.phase==="active"&&bt.comboIndex>=3;oe.opacity=Gi?.7:0,de.opacity=Gi?X.slashGlowOpacity:0,Gi&&(Je.rotation.z=-1.2+bt.attackProgress*3.2,Je.scale.setScalar(.9+bt.comboIndex*.13));for(let ce=0;ce<z.length;ce++){const Ht=H.abilities.projectiles[ce],he=z[ce];he.group.visible=!!Ht,Ht&&(he.group.position.set(Ht.x,Ht.y,Ht.z),he.group.scale.setScalar(Ht.radius),he.group.rotation.set(0,Math.atan2(Ht.dirX,Ht.dirZ),0))}for(let ce=0;ce<nt.length;ce++){const Ht=H.abilities.rings[ce],he=nt[ce];if(!Ht){he.group.visible=!1;continue}const Qe=Math.max(0,Math.min(1,Ht.life/Math.max(Ht.duration,1e-6))),We=lR(Math.max(0,Ht.duration-Ht.life),J.areaExpandSec);he.set(Ht.x,Ht.z,mt(Ht.x,Ht.z,St.position.y)+.045,Ht.radius*We.scale,J.areaOpacity*(.35+.65*Qe)*We.alpha,H.time)}for(let ce=0;ce<An.length;ce++){const Ht=H.arrows[ce],he=An[ce];if(!Ht){he.group.visible=!1,he.bone&&(c.attach(he.group),he.bone=null),he.arrowId=0;continue}const Qe=Ht.stuck&&Ht.stuckDummy>=0;if(he.arrowId!==Ht.id){if(he.bone&&(c.attach(he.group),he.bone=null),he.arrowId=Ht.id,he.group.position.set(Ht.x,Ht.y,Ht.z),he.group.rotation.set(Ht.pitch,Ht.yaw,0,"YXZ"),Qe){const wn=dt[Ht.stuckDummy],Kn=wn?wn.boneAtWorld(Ht.x,Ht.y,Ht.z):null;Kn&&(Kn.node.attach(he.group),he.bone=Kn.node)}}else he.bone||(he.group.position.set(Ht.x,Ht.y,Ht.z),he.group.rotation.set(Ht.pitch,Ht.yaw,0,"YXZ"));he.group.visible=!0;const We=Ht.stuck?Math.min(1,Ht.rest/.6):1;he.shaftMat.opacity=We,he.tipMat.opacity=We,he.glowMat.opacity=(Ht.stuck?.28:.85)*We,he.trailMat.opacity=Ht.stuck?0:X.trailOpacity*We,he.trail.visible=!Ht.stuck}if(A.update(H,Rt),_.update(H.destructibles),bt.phase==="active"||H.playerLink.phase==="active"){const ce=_.computeHits(H.destructibles,((ns=T.bladesWorld)==null?void 0:ns.call(T))??{right:null,left:null});for(let Ht=0;Ht<ce.length;Ht++){let he=!1;for(let Qe=0;Qe<M.length;Qe++)if(M[Qe].id===ce[Ht].id){he=!0;break}he||M.push(ce[Ht])}}else M=[];rt.update(St.position.x,St.position.y,St.position.z,Rt,H.camera),r.render(c,rt.camera)},resize(){const H=Math.max(1,n.clientWidth),Rt=Math.max(1,n.clientHeight);r.setSize(H,Rt,!1),rt.resize(H/Rt)},getGroundBasis(){return rt.getGroundBasis()},setCollidersVisible(H){for(const Rt of m)Rt.opacity=H?.3:1,Rt.wireframe=H,Rt.transparent=H,Rt.depthWrite=!H,Rt.needsUpdate=!0},setGridVisible(H){S.visible=H},setLabVisible(H){E.setVisible(H)},setLabLabelsVisible(H){E.setLabelsVisible(H)},snapCamera(H,Rt,St){rt.snap(H,Rt,St)},setZoom(H){rt.setZoom(H*C)},setBodyType(H){var St;const Rt=(St=e.bodyTypes)==null?void 0:St[H];return!Rt||H===F||($.remove(T.group),T.dispose(),T=P(Rt),yt(T,ht(Rt)),B.reset(),F=H,q(Rt)),F},bodyTypes(){return{id:F,ids:Object.keys(e.bodyTypes??{})}},pickDummy:Gt,dummyRenderCount:()=>dt.length,projectToScreen:Zt,dummyRigDebug(H){const Rt=dt[H-1];return Rt!=null&&Rt.debug?Rt.debug():null},diagnostics(){var St,bt,te,Bt,le,Re,Se,Ce,ye;const H=C0(e.camera.pitchDeg),Rt=uR(H,At.rotation.y);return{lean:((St=T.lean)==null?void 0:St.call(T))??{forward:0,side:0},slashNormal:Rt,arrowForward:((bt=T.arrowDirection)==null?void 0:bt.call(T))??{x:0,y:0,z:1},gait:{hipYaw:((te=T.hipYaw)==null?void 0:te.call(T))??0,gaitYaw:((Bt=T.gaitYaw)==null?void 0:Bt.call(T))??0},attackBlend:((le=T.attackBlend)==null?void 0:le.call(T))??0,attackWeights:((Re=T.attackWeights)==null?void 0:Re.call(T))??{gaitScale:1,attackLegWeight:0,driveSpeed:0,stridePhase:0,strideBase:0,stepIndex:0},landing:((Se=T.landing)==null?void 0:Se.call(T))??{pulse:0,remaining:0,kind:"none",impactVy:0},hurt:((Ce=T.hurt)==null?void 0:Ce.call(T))??y0(),ik:((ye=T.ik)==null?void 0:ye.call(T))??{active:!1,weight:0,clamped:0,maxError:0},link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:$.rotation.x,activeRings:ct.activeDash(),lastKind:ct.dashKind()},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...rt.smart(),shake:rt.shakeLevel(),kick:rt.kickLevel(),kickCount:rt.kickCount()}}},dispose(){T.dispose(),E.dispose(),A.dispose(),_.dispose();for(const H of dt)H.dispose();zt.dispose();for(const H of ut)H.dispose();for(const H of ft)H.dispose();Et.dispose(),B.dispose();for(const H of wt)H.dispose();Xt.dispose(),ze.dispose(),oe.dispose(),de.dispose(),_n.dispose(),Zn.dispose(),ri.dispose(),Ei.dispose(),Pn.dispose();for(const H of nt)H.dispose();Fe.dispose(),mn.dispose(),Xn.dispose(),sn.dispose();for(const H of An)H.shaftMat.dispose(),H.tipMat.dispose(),H.glowMat.dispose(),H.trailMat.dispose();Dt.dispose(),Kt.dispose(),ct.dispose(),v.traverse(H=>{H instanceof me&&H.geometry.dispose()}),r.dispose(),r.domElement.remove()}}}async function FR(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function UR(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function NR(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=b=>e.querySelector(`#${b}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),d=i("diag-close"),u=i("diag-mask");let h=!1,f=!0,m=0;function v(){const b=n.status();a.textContent=b.enabled?`已记录 ${b.durationS.toFixed(1)}s · ${b.frames} 帧 · 事件 ${b.events} · 异常 ${b.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=b.enabled?"暂停记录":"继续记录"}function g(b){h=b,e.hidden=!b,b?v():s.hidden=!0}function p(b){o.textContent=b,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),g(!h)}),d.addEventListener("click",()=>g(!1)),u.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const b=n.summary();FR(b).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=b,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const b=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);UR(`harness-${b.meta.version}-${x}.json`,JSON.stringify(b)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),s.hidden=!0,v(),p("已清空")}),l.addEventListener("click",()=>{f=!f,n.setEnabled(f),v()}),{tick(){const b=n.status();t==null||t.classList.toggle("is-alert",b.alert),h&&v()},isOpen:()=>h,close:()=>g(!1)}}const OR={intents:{...Cp},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function BR(){var J;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Ev(mm,Wr),i=zR(n,e,En,Wr.stations,Wr.slabs),a=Lv(e),s=nb(t),o=ib(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.73 · 11-09 23:52 · 诊断");const c=W=>String(W).padStart(2,"0"),l=new Date,d=ry({meta:{version:"v0.9.73",buildTime:"11-09 23:52",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),u=NR(d,r),h=Q_({deadZone:()=>En.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0,phaseSource:()=>i.gaitDebug().phase});document.addEventListener("visibilitychange",()=>{document.hidden&&d.suspend(800)});const f={timeScale:1,paused:!1,showColliders:En.showColliders,showGrid:En.showGrid,showLab:En.lab.enabled,showLabLabels:En.lab.showLabels};let m=1,v=!1;const g=qv({maxRadiusPx:()=>En.joystick.maxRadiusPx,deadZone:En.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>En.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let b=e.combat.weapon;function x(W){if(W===b)return;b=W;const O=ba.indexOf(W)+1;for(const Pt of p)Pt.classList.toggle("is-active",Number(Pt.dataset.weapon)===O);E.refreshWeapon()}let y=OR,S=0;const w=()=>{m=1,i.setZoom(1)},E=D_(e,En,f,{singleStep:()=>a.singleStep(y.intents),reset:()=>{m=1,a.singleStep({...Cp,resetPressed:!0})},resetZoom:w,onToggleColliders:W=>i.setCollidersVisible(W),onToggleGrid:W=>i.setGridVisible(W),onToggleLab:W=>i.setLabVisible(W),onToggleLabLabels:W=>i.setLabLabelsVisible(W),setFighterMode:W=>{for(const O of e.dummies)O.weapon&&(O.mode=W,O.attackPhase="idle",O.attackPhaseTimer=0,O.attackProgress=0,O.attackCooldown=0,O.combat&&(O.combat.phase="idle",O.combat.attackProgress=0,O.combat.comboIndex=0))}}),A=z_({stations:Ji.stations,plots:Du,world:e,view:i,onResetZoom:w,onPlotTest:W=>{Ql(e);const O=Xx(e,W);return C(`已在「${W.name}」生成 ${O} 人 · 点「清除测试单位」回基线`),O},onClearTestUnits:()=>{const W=Ql(e);return C(W>0?`已清除 ${W} 个测试单位`:"当前没有测试单位"),W}});o.register({motion:h,debug:E.gui}),window.addEventListener("resize",()=>i.resize());const _=i.bodyTypes().ids,M=document.getElementById("body-toggle"),P=W=>{var O,Pt;return((Pt=(O=En.bodyTypes)==null?void 0:O[W])==null?void 0:Pt.name)??W},I=()=>{if(!M)return;const W=i.bodyTypes().id;M.textContent=`体型 ${P(W)}`,M.setAttribute("aria-label",`切换体型（当前：${P(W)}，快捷键 B）`)},L=document.createElement("div");L.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(L);let F=0;const C=W=>{L.textContent=W,L.style.opacity="1",window.clearTimeout(F),F=window.setTimeout(()=>{L.style.opacity="0"},1600)},T=()=>{if(_.length<2){C("只有一个体型预设");return}const W=i.bodyTypes().id,O=Math.max(0,_.indexOf(W)),Pt=i.setBodyType(_[(O+1)%_.length]);I(),C(`体型：${P(Pt)}（B / 顶部胶囊切换）`)};I(),M==null||M.addEventListener("click",T);const B=document.getElementById("wind-toggle"),G=()=>{var W;return(W=e.config.grass)==null?void 0:W.wind},$=()=>{var O;if(!B)return;const W=!!((O=G())!=null&&O.enabled);B.textContent=`风：${W?"开":"关"}`,B.classList.toggle("is-off",!W),B.setAttribute("aria-label",`${W?"关闭":"开启"}风吹麦浪（当前${W?"开启":"关闭"}，快捷键 G）`)},it=()=>{const W=G();if(!W){C("本场景未启用草块");return}W.enabled=!W.enabled,$(),C(`风吹麦浪：${W.enabled?"开":"关"}（G 切换）`)};$(),B==null||B.addEventListener("click",it),window.addEventListener("keydown",W=>{W.repeat||(W.code==="KeyB"?T():W.code==="KeyG"&&it())}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:En,debug:f,getUserZoom:()=>m,getGestures:()=>y.gestures,getLastGesture:()=>y.lastGesture,telemetry:d,telemetrySummary:()=>d.summary(),dirDebug:h.dirDebug,dirAngles:()=>h.dirDebug.last(),motionDebug:h,speedDebug:()=>h.last(),speedSamples:()=>h.samples(),gaitDebug:()=>i.gaitDebug(),spiderDebug:()=>i.spiderDebug(),dummyRigDebug:W=>i.dummyRigDebug(W),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:j,applied:pt,enabled:q,skip:dt}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),fxDebug:()=>i.fxDebug(),grassDebug:()=>i.grassDebug(),breakDebug:()=>({version:"v0.9.73",count:e.destructibles.length,broken:e.destructibles.filter(W=>W.broken!==0).length,cuts:e.destructibles.map(W=>({id:W.id,kind:W.kind,broken:W.broken,cutU:W.cutU,theta:W.theta,nx:W.nx,ny:W.ny,nz:W.nz,fall:W.fall,height:W.height})),rendered:i.destructibleDebug()}),breakTest:(W,O,Pt=1,ot=0,at=0)=>bv(e,W,O,Pt,ot,at),resetBreaks:()=>(om(e),e.destructibles.length),breakHits:()=>i.breakHits(),windDebug:()=>{var O;const W=i.grassDebug().wind;return{configured:!!((O=G())!=null&&O.enabled),rendered:W.enabled,time:W.time,gust:W.gust}},setWind:W=>{const O=G();return O?(O.enabled=!!W,$(),O.enabled):!1},setRenderInterp:W=>(q=!!W,q),renderHold:()=>v,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(W,O,Pt)=>i.projectPoint(W,O,Pt),setBodyType:W=>{const O=i.setBodyType(W);return I(),O},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var W;return Object.keys(((W=En.animation.swing)==null?void 0:W.clips)??{})},preview:W=>{const O=e.combat,Pt={...O};O.weapon=W.weapon,O.phase="active",O.comboIndex=Math.max(1,Math.min(3,Math.floor(W.comboIndex))),O.attackProgress=Math.max(0,Math.min(1,W.progress)),O.attackFacing=e.character.bodyYaw,i.setClipT(typeof W.t=="number"?W.t:null);const ot=Math.max(1,Math.min(30,Math.floor(W.warm??12)));v=!0;for(let at=0;at<ot;at++)i.render(e,1/60);return i.setClipT(null),Object.assign(O,Pt),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:W=>{e.character.bodyYaw=W},zoom:W=>{m=Pu(W,1,En.zoom.min,En.zoom.max),i.setZoom(m)},release:()=>{v=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),plotDebug:()=>({version:"v0.9.73",count:Ji.plots.length,diagnostics:Ji.diagnostics,testUnits:Vx(e),dummies:e.dummies.length,rendered:i.dummyRenderCount(),bounds:Ji.bounds,worldBounds:e.config.worldBounds,slabs:Ji.slabs.map(W=>({plotId:W.plotId,cell:W.cell,span:W.span,rect:[W.minX,W.maxX,W.minZ,W.maxZ],top:W.top})),plots:Ji.plots.map(W=>({id:W.id,index:W.index,placement:W.placement,slot:W.slot,cell:W.cell,span:W.span,centerX:W.centerX,centerZ:W.centerZ,spawnX:W.station.spawnX,spawnZ:W.station.spawnZ,slab:[W.slab.minX,W.slab.maxX,W.slab.minZ,W.slab.maxZ],hasTest:!!W.testSpawn}))}),spawnAt:W=>A.spawnAt(W),clearSpawned:()=>A.clearSpawned(),lab:{stations:Ji.stations,plots:Du,goto:W=>A.goto(W),current:()=>A.current(),recall:()=>A.recall(),spawnAt:W=>A.spawnAt(W),clearSpawned:()=>A.clearSpawned()}};let ht=performance.now(),yt=60,Lt=0,q=((J=En.renderInterp)==null?void 0:J.enabled)??!0,k=Ru(e),Z=null,j=1,pt=!1,dt="";function _t(W){const O=q&&!f.paused&&f.timeScale>0;if(pt=!1,dt="",!O)return dt="off",j=1,e;if(!Z)return dt="noprev",j=1,e;if(!kv(Z,k))return dt="key",j=1,e;const Pt=a.alpha;return j=Pt,Pt>=.999?(dt="alpha",e):(pt=!0,zv(e,Iv(Z,k,Pt)))}function Yt(W){const O=Math.min((W-ht)/1e3,.1);ht=W,O>0&&(yt=yt*.9+1/O*.1);const Pt=g.sample();Pt.intents.resetPressed&&(m=1),m=Pu(m,Pt.zoomScale,En.zoom.min,En.zoom.max),i.setZoom(m);let ot=Pt.intents.dummyClickId;if(Pt.tap){const mt=i.pickDummy(Pt.tap.x,Pt.tap.y);mt>0&&(ot=mt)}ot>0&&(S=ot),y={...Pt,intents:{...Pt.intents,dummyClickId:S,breakHits:i.breakHits()}};const at=a.frame(O,y.intents,f.timeScale,f.paused,()=>{const mt=e.events;for(let zt=0;zt<mt.length;zt++)d.event(mt[zt],e.time);Z=k,k=Ru(e)});at>0&&(S=0),d.sample(e,y,O*1e3,at);for(const mt of y.gestures)d.gesture(mt);W-Lt>250&&(Lt=W,u.tick()),x(e.combat.weapon),v||i.render(_t(),O),A.tick(),h.update(e,y,i.getGroundBasis());const Tt=i.diagnostics();s.update(e,yt,at,y,f,{attackBlend:Tt.attackBlend,attackWeights:Tt.attackWeights,landing:Tt.landing,hurt:Tt.hurt,ik:Tt.ik,zoom:Tt.camera.zoom},o.hudCompact()),requestAnimationFrame(Yt)}requestAnimationFrame(Yt)}BR();

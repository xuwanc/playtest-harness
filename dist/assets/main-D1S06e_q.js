(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const Ea=["sword-shield","dual-swords","greatsword","staff","bow"],Hg=["wander","follow","keep-distance","attack","idle"],Vp=["spar","wander","follow","keep-distance","attack","idle"],Wp={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},sc=1e-6;function Go(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>sc?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>sc?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Gg(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>sc){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>sc)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Ke=1e-6,Ma=Math.PI/180,rh=-1e9;function Yp(){return{type:"none",lastAt:rh,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function ko(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function yu(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function ch(n,t,e){var l,d;const i=e.duration>0?e.duration:Sc(n,e.type);if(t.kind==="player"){const u=n.playerHurt;if(yu(u,e.type,i,e.dirX,e.dirZ),u.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Ke){const h=e.knockback*n.config.hits.knockbackDecay;u.knockX=e.dirX*h,u.knockZ=e.dirZ*h}ko(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(yu(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Ke){const u=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*u,a.hurt.knockZ=e.dirZ*u}n.hitCount+=1,ko(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((l=n.config.hits.hitstopByWeapon)==null?void 0:l[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const u=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[u])}o*=Math.max(0,e.holdMul??1);const c=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;c>0&&n.combat.hitstop<c&&(n.combat.hitstop=c,n.combat.warpPhase=1,n.combat.warp=(d=n.config.hits.hitstopWarp)!=null&&d.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,ko(n,"hitstop",c,a.position))}function Qo(n,t,e){ch(n,{kind:"dummy",index:t},e)}function Xg(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function Sc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function oc(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function $p(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function Zp(n){var v,g;const t=n.combat,e=n.character.position,i={active:!1,x:e.x,z:e.z,facing:t.attackFacing,fx:Math.sin(t.attackFacing),fz:Math.cos(t.attackFacing),reach:0,cosArc:1,sweepActive:!1,sweepLo:0,sweepHi:0,slamRadius:0,slamX:e.x,slamZ:e.z};if(t.phase!=="active"||t.weapon==="bow")return i;const a=n.config.hits,s=n.config.combat.weapons[t.weapon],o=s==null?void 0:s.hitWindow,r=o?Math.min(1,Math.max(0,o.start)):0,c=o?Math.min(1,Math.max(r,o.end)):1,l=t.timings.active,d=l>Ke?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(d<r-Ke||d>c+Ke)return i;i.active=!0,i.reach=a.reach[t.weapon]??0,i.cosArc=Math.cos(Math.min(90,Math.max(0,a.arcDeg))*Ma);const u=s==null?void 0:s.hitSweep,h=((v=u==null?void 0:u.byCombo)==null?void 0:v[String(t.comboIndex)])??((g=u==null?void 0:u.byCombo)==null?void 0:g["1"]),f=(u==null?void 0:u.tolDeg)??10;if(h){if(typeof h.stabU=="number"){if(d<h.stabU)return i.active=!1,i}else if(h.pts&&h.pts.length>=2){const p=oc(h.pts,0),_=oc(h.pts,d);i.sweepActive=!0,i.sweepLo=Math.min(p,_)-f,i.sweepHi=Math.max(p,_)+f}}const m=s==null?void 0:s.groundSlam;return m&&d>=m.slamU-Ke&&t.slamAttackId===t.attackId&&(i.slamRadius=Math.max(0,m.radius),i.slamX=e.x+i.fx*Math.min(i.slamRadius*.25,.5),i.slamZ=e.z+i.fz*Math.min(i.slamRadius*.25,.5)),i}function Vg(n,t,e,i){if(!n.active)return!1;const a=t-n.x,s=e-n.z,o=Math.sqrt(a*a+s*s);if(o>n.reach+i||o>Ke&&(a*n.fx+s*n.fz)/o<n.cosArc)return!1;if(n.sweepActive){const r=$p(Math.atan2(a,s)/Ma-n.facing/Ma);if(r<n.sweepLo||r>n.sweepHi)return!1}return!0}function Wg(n,t,e,i){if(n.slamRadius<=0)return!1;const a=t-n.slamX,s=e-n.slamZ;return a*a+s*s<=(n.slamRadius+i)*(n.slamRadius+i)}function Yg(n){var w,E;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,c=t.timings.active,l=c>Ke?Math.min(1,Math.max(0,t.phaseTimer/c)):1;if(l<o-Ke||l>r+Ke)return;const d=e.reach[t.weapon]??0,u=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Ma),h=Math.sin(t.attackFacing),f=Math.cos(t.attackFacing),m=n.config.dummies.radius,v=n.config.targeting.idealRange,g=a==null?void 0:a.hitSweep,p=((w=g==null?void 0:g.byCombo)==null?void 0:w[String(t.comboIndex)])??((E=g==null?void 0:g.byCombo)==null?void 0:E["1"]),_=(g==null?void 0:g.tolDeg)??10;let x=0,y=0,S=!1;if(p){if(typeof p.stabU=="number"){if(l<p.stabU)return}else if(p.pts&&p.pts.length>=2){const R=oc(p.pts,0),b=oc(p.pts,l);x=Math.min(R,b)-_,y=Math.max(R,b)+_,S=!0}}for(const R of n.dummies){if(t.hitIds.indexOf(R.id)>=0)continue;const b=R.position.x-i.x,M=R.position.z-i.z,P=Math.hypot(b,M);if(P>d+m)continue;const I=P>Ke?b/P:h,D=P>Ke?M/P:f;if(P>Ke&&(b*h+M*f)/P<u)continue;if(S){const G=$p(Math.atan2(b,M)/Ma-t.attackFacing/Ma);if(G<x||G>y)continue}let U="light";t.weapon==="greatsword"?U="knock":t.comboIndex>=3&&(U="heavy");const C=e.knockback[t.weapon]??0;let T=P;C>0&&(T=Math.max(P+C,v));const O=Math.max(0,T-P);Qo(n,n.dummies.indexOf(R),{type:U,duration:Sc(n,U),dirX:I,dirZ:D,knockback:O}),t.hitIds.push(R.id)}}function $g(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>Ke?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-Ke)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,c=Math.sin(t.attackFacing),l=Math.cos(t.attackFacing),d=n.config.dummies.radius,u=Math.max(0,i.radius),h=i.onlyUnhit!==!1,f=i.type??(t.weapon==="greatsword"?"knock":"heavy"),m=i.knockback??o.knockback[t.weapon]??0,v=n.config.targeting.idealRange,g=i.holdMul??1.6;for(let p=0;p<n.dummies.length;p++){const _=n.dummies[p];if(h&&t.hitIds.indexOf(_.id)>=0)continue;const x=_.position.x-r.x,y=_.position.z-r.z,S=Math.hypot(x,y);if(S>u+d)continue;const w=S>Ke?x/S:c,E=S>Ke?y/S:l,R=m>0?Math.max(S+m,v):S,b=Math.max(0,R-S);Qo(n,p,{type:f,duration:Sc(n,f),dirX:w,dirZ:E,knockback:b,holdMul:g}),t.hitIds.push(_.id)}ko(n,"ground-slam",u,{x:r.x+c*Math.min(u*.25,.5),y:r.y,z:r.z+l*Math.min(u*.25,.5)})}function Zg(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,c=i.fromZ,l=o.x,d=o.z,u=l-r,h=d-c,f=u*u+h*h,m=Math.sin(i.facing),v=Math.cos(i.facing),g=Math.cos(Mu(s.arcDeg,0,180)*Ma),p=n.config.dummies.radius;for(let _=0;_<n.dummies.length;_++){const x=n.dummies[_];if(i.hitIds.indexOf(x.id)>=0)continue;const y=f>Ke?Mu(((x.position.x-r)*u+(x.position.z-c)*h)/f,0,1):0,S=r+u*y,w=c+h*y,E=Math.hypot(x.position.x-S,x.position.z-w);let R=!1;if(s.shape==="circle")R=E<=s.radius+p;else if(s.shape==="capsule")R=E<=Math.max(s.radius,s.width)+p;else{const U=x.position.x-l,C=x.position.z-d,T=Math.hypot(U,C),O=T>Ke?(U*m+C*v)/T>=g:!0;R=T<=s.radius+p&&O||E<=s.width+p}if(!R)continue;const b=x.position.x-r,M=x.position.z-c,P=Math.hypot(b,M);if(P>Ke&&(b*m+M*v)/P<Math.cos(Math.max(s.arcDeg,90)*Ma))continue;const I=P>Ke?b/P:m,D=P>Ke?M/P:v;ch(n,{kind:"dummy",index:_},{type:s.type,duration:s.duration,dirX:I,dirZ:D,knockback:s.knockback}),i.hitIds.push(x.id),ko(n,"link-hit",x.id,x.position)}}function jg(n){const t=n.config.hits,e=n.config.dummies.fighters,i=n.character.position;for(const a of n.events){if(a.type!=="dummy-hit")continue;const s=n.dummies[a.value-1];if(!s)continue;const o=s.weapon?t.reach[s.weapon]??t.dummyReach:t.dummyReach,r=i.x-s.position.x,c=i.z-s.position.z,l=Math.hypot(r,c);if(l>o)continue;const d=l>Ke?r/l:0,u=l>Ke?c/l:1,f=(s.weapon?Math.max(t.knockback[s.weapon]??0,t.dummyKnockback):t.dummyKnockback)*(s.weapon?(e==null?void 0:e.knockbackScale)??1:1),v=s.weapon==="greatsword"&&s.attackComboLeft<=0?"knock":"light";ch(n,{kind:"player"},{type:v,duration:Sc(n,v),dirX:d,dirZ:u,knockback:f,sourceId:s.id})}}function qg(n,t){n.modules.hits&&(n.combat.phase==="active"&&(Yg(n),$g(n)),Zg(n,t),jg(n))}function Mu(n,t,e){return n<t?t:n>e?e:n}const jp=Math.PI/180,lh=1e-6;function Kg(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function rc(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function qp(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>lh?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Kp(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,lh)&&s<=Math.max(0,e.inputDeadZone)&&!o}function Jg(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Qg(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Kp(n,t,e))return!1;const i=qp(n,t,e.lookRange);if(i===null)return!1;const a=Ye(i-n.character.bodyYaw);return Math.abs(a)>Jp(n,e)}function Jp(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*jp}function tx(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!Kp(n,e,a)){rc(n);return}const s=qp(n,e,a.lookRange);if(s===null){rc(n);return}const o=n.character,r=Ye(s-o.bodyYaw),c=Math.abs(r),l=Jp(n,a),d=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>lh;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const u=Math.min(c,Math.max(0,a.settleDeg)*jp);i.targetYaw=Ye(o.bodyYaw+i.dir*(c-u)),i.progress=0}if(i.phase==="active"){const u=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/u);const h=Ye(i.targetYaw-i.fromYaw);o.bodyYaw=Ye(i.fromYaw+h*Jg(i.progress)),d||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const _a=1e-6;function Ye(n){return Math.atan2(Math.sin(n),Math.cos(n))}function lr(n,t,e,i){const a=Ye(t-n);return n+a*(1-Math.exp(-Math.max(e,_a)*i))}function dr(n,t,e,i,a){const o=Ye(t-n)*(1-Math.exp(-Math.max(e,_a)*a)),r=Math.max(i,0)*a;return r<=_a?n:n+zs(o,-r,r)}function _u(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,_a)*a)),o=Math.max(i,0)*a;return o<=_a?n+s:n+zs(s,-o,o)}function zs(n,t,e){return n<t?t:n>e?e:n}function bu(n,t,e,i){const a=Ye(t-n),s=Math.abs(a);return s<=i||s<=e?t:Ye(n+Math.sign(a)*Math.max(e,0))}function ex(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,c=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",l=o&&!c,d=Math.hypot(e.moveX,e.moveZ),u=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>_a,h=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=Go(n,e);else if(l)i.facing=dr(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(u)i.facing=Go(n,e);else if(h)i.facing=n.targeting.targetYaw;else if(d>Math.max(a.facingDeadZone,_a)){const M=Math.atan2(e.moveX,e.moveZ),P=a.facingTurnRate*Math.PI/180*t,I=a.facingSnapDeg*Math.PI/180;if(d>=.35)i.facing=bu(i.facing,M,P,I);else if(d>=a.facingMinMagnitude&&Math.abs(Ye(M-i.facing))>a.facingDeadbandDeg*Math.PI/180){const U=lr(i.facing,M,a.facingSmoothRate,t);i.facing=bu(i.facing,U,P,0)}}const f=i.velocity;Math.hypot(f.x,f.z)>.15&&(i.moveYaw=Math.atan2(f.x,f.z));const m=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Qg(n,e)||(l?i.bodyYaw=dr(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=lr(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=l?n.gaze.mainYaw:i.facing:u?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Ye(p-i.bodyYaw))>M&&(p=i.moveYaw)}const _=o||u||g,x=a.maxHeadTurnDeg*Math.PI/180;let y;if(_){const M=l?n.config.gaze.headTurnRate:a.headTurnRate;y=l?dr(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):lr(i.headYaw,p,M,t)}else{const M=Ye(i.headYaw-i.bodyYaw),P=Ye(p-i.bodyYaw),I=Math.abs(P)<Math.abs(M)-1e-9,D=I?n.config.gaze.headReturnRate:a.headTurnRate,U=I?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,C=Number.isFinite(U)?dr(M,P,D,U,t):lr(M,P,D,t);y=i.bodyYaw+C}const S=Ye(y-i.bodyYaw);S>x?y=i.bodyYaw+x:S<-x&&(y=i.bodyYaw-x),i.headYaw=y;const w=n.config.gaze;let E=0;if(l)E=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const P=i.position.y+n.config.characterHeight*zs(w.eyeHeightRatio,0,1),I=M.position.y+n.config.dummies.height*zs(w.aimHeightRatio,0,1),D=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);E=Math.atan2(I-P,Math.max(_a,D))}}const R=Math.max(0,w.maxHeadPitchDeg)*Math.PI/180;E=zs(E,-R,R);const b=_?w.headPitchRate:Math.min(w.headPitchRate,w.headReturnRate);i.headPitch=_u(i.headPitch,E,b,Math.max(0,w.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=_u(i.bodyPitch,i.headPitch*zs(w.bodyPitchScale,0,1),w.bodyPitchRate,Math.max(0,w.maxHeadPitchDeg)*Math.PI/180,t)}const Qp=1e-6,wc=Math.PI/180;function Ec(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function nx(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*wc,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const c=n.dummies[r],l=c.position.x-i.x,d=c.position.z-i.z,u=Math.hypot(l,d);u<.001||u>s||Math.abs(Ye(Math.atan2(l,d)-t))>a||o.push({i:r,d:u})}return o.sort((r,c)=>r.d-c.d||r.i-c.i),o.map(r=>r.i)}function ix(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function ax(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*wc,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),c=nx(n,e.channelYaw,t);for(let l=0;l<a;l++){const d=(l-(a-1)*.5)*s,u=e.channelYaw+d,h=(l-(a-1)*.5)*o,f=Math.sin(u),m=Math.cos(u);e.pending.push({delay:l*Math.max(0,t.spawnDelay),x:i.x+f*.5+Math.cos(u)*h,y:i.y+1,z:i.z+m*.5-Math.sin(u)*h,yaw:u,speed:t.speed*(1+(ix(e.waveIndex,l)*2-1)*r),targetIndex:c.length>0?c[l%c.length]:-1,wave:e.waveIndex})}Ec(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function sx(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*wc,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,Ec(n,"projectile-fire",i.volleyId,o)}i.pending=a}function Su(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,Ec(n,"channel-end",0,n.character.position))}function ox(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",c=n.playerLink,l=s==="skill2"?e.skill2Pressed:e.attackHeld,d=a&&l&&!r&&c.phase==="idle"&&!c.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!d&&(o.needsRelease=!1),o.channeling){if(!d){Su(n,i);return}}else{if(!(d&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),Ec(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=Go(n,e),o.fireTimer-=t;let u=0;for(;o.fireTimer<=0&&u++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Qp),ax(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){Su(n,i);break}}function rx(n,t,e){const i=Math.max(0,e.homingConeDeg)*wc,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Qp;for(let c=0;c<n.dummies.length;c++){const l=n.dummies[c],d=l.position.x-t.x,u=l.position.z-t.z,h=Math.hypot(d,u);h<.001||h>r||Math.abs(Ye(Math.atan2(d,u)-s))>i||(o=c,r=h)}return o}function cx(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=rx(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const l=n.dummies[r.targetIndex];if(!l)r.targetIndex=-1;else{const d=Math.atan2(l.position.x-r.x,l.position.z-r.z),u=Math.atan2(r.dirX,r.dirZ),h=Ye(d-u),f=r.turnRate*t,m=Math.max(-f,Math.min(f,h)),v=u+m;r.dirX=Math.sin(v),r.dirZ=Math.cos(v)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let c=!1;if(s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],u=d.position.x-r.x,h=d.position.z-r.z,f=r.radius+a;if(!(u*u+h*h>f*f)){Qo(n,l,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),c=!0;break}}c||o.push(r)}i.projectiles=o}const lx={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;ox(n,t,e,s,a,i.cfg.slot),sx(n,t,s),cx(n,t,s)}},Qc=1e-6;function tm(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function dx(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),tm(n,"ring-place",i.id,e)}function hx(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let c=0;for(;r.pulseTimer<=0&&c++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Qc),s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],u=d.position.x-r.x,h=d.position.z-r.z,f=r.radius+a;if(u*u+h*h>f*f)continue;const m=Math.hypot(u,h),v=m>Qc?u/m:0,g=m>Qc?h/m:1;Qo(n,l,{type:"heavy",duration:e.stun,dirX:v,dirZ:g,knockback:e.knockback})}tm(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const ux={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&dx(n,s),hx(n,t,s)}},fx={channelVolley:lx,groundRing:ux};function px(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function mx(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=fx[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function gx(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function em(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function xx(n,t,e){mx(n,t,e)}function tl(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const wu=1e-6;function Eu(n,t,e){return n<t?t:n>e?e:n}function nm(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function im(n){const t=n.camera,e=nm();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function vx(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const l of n.dummies){const d=l.position.x-i.x,u=l.position.z-i.z,h=Math.hypot(d,u);if(h>e.radius)continue;const f=Eu((e.radius-h)/Math.max(wu,e.radius-e.nearDistance),0,1);let m=f*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(m+=e.attackBoost*f),a+=m,s+=l.position.x*m,o+=l.position.z*m,r+=1}const c=a<=0?0:Eu(a/(a+Math.max(wu,e.saturation)),0,1);if(t.threat=c,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=s/a,d=o/a;t.centroidX=l,t.centroidZ=d;let u=(l-i.x)*e.framingBias*c,h=(d-i.z)*e.framingBias*c;const f=Math.hypot(u,h);f>e.maxOffset&&(u=u/f*e.maxOffset,h=h/f*e.maxOffset),t.offsetX=u,t.offsetZ=h}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function yx(n){const t=[];if(n.slabs&&n.slabs.length>0)for(const e of n.slabs)t.push({id:`ground-${e.plotId}`,kind:"ground",minX:e.minX,maxX:e.maxX,minY:e.top-e.thickness,maxY:e.top,minZ:e.minZ,maxZ:e.maxZ});else{const e=n.ground.size;t.push(ps("ground","ground",0,0,e,e,-n.ground.thickness,0))}for(const e of n.steps)t.push(ps(e.id,"step",e.x,e.z,e.width,e.depth,0,e.height));for(const e of n.doorways){const i=e.openingWidth/2,a=e.wallThickness;t.push(ps(`${e.id}-left`,"wall",e.x-i-e.wallSpan/2,e.z,e.wallSpan,a,0,e.wallHeight)),t.push(ps(`${e.id}-right`,"wall",e.x+i+e.wallSpan/2,e.z,e.wallSpan,a,0,e.wallHeight)),t.push(ps(`${e.id}-lintel`,"lintel",e.x,e.z,e.openingWidth,a,e.openingHeight,e.wallHeight))}for(const e of n.obstacles)t.push(ps(e.id,"obstacle",e.x,e.z,e.width,e.depth,0,e.height));return t}function ps(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const dh={cellSize:.5,cellMeters:5,columns:6,maxRows:32,spawnDz:0,labelInset:.9,defaultRadius:2,defaultShape:"circle",defaultColor:"#7fd8c0",defaultSpan:[2,2],slabThickness:.4,boundInset:.5};function Ne(n){return Math.round(n*1e6)/1e6}function Tu(n,t){const e=n??t.defaultSpan;return[Math.max(1,Math.round(e[0])),Math.max(1,Math.round(e[1]))]}function Mx(n,t=dh){var mt,xt,Pt,q;const e={duplicates:[],unplaced:[]},i=t.cellMeters,a=new Set,s=[];for(const k of n)if(!(!k||typeof k.id!="string"||k.id.length===0)){if(a.has(k.id)){e.duplicates.push(k.id);continue}a.add(k.id),s.push(k)}const o=[...s].sort((k,Y)=>k.id<Y.id?-1:k.id>Y.id?1:0),r=new Map,c=(k,Y,tt)=>{if(k<0||Y<0||k+tt[0]>t.columns||Y+tt[1]>t.maxRows)return!1;for(let ut=0;ut<tt[0];ut++)for(let st=0;st<tt[1];st++)if(r.has(`${k+ut},${Y+st}`))return!1;return!0},l=(k,Y,tt,ut)=>{for(let st=0;st<ut[0];st++)for(let wt=0;wt<ut[1];wt++)r.set(`${Y+st},${tt+wt}`,k)},d=[];for(const k of o){if(k.pin!=="origin")continue;const Y=Tu(k.span,t);c(0,0,Y)&&(l(k.id,0,0,Y),d.push({def:k,c:0,r:0,span:Y,pin:!0,slot:0}))}const u=t.columns*t.maxRows;for(const k of o){if(d.some(wt=>wt.def.id===k.id))continue;const Y=Tu(k.span,t);let tt=-1;for(let wt=0;wt<u;wt++){const Zt=wt%t.columns,j=Math.floor(wt/t.columns);if(c(Zt,j,Y)){tt=wt;break}}if(tt<0){e.unplaced.push(k.id);continue}const ut=tt%t.columns,st=Math.floor(tt/t.columns);l(k.id,ut,st,Y),d.push({def:k,c:ut,r:st,span:Y,pin:!1,slot:tt})}const h=d.map(k=>({...k,minX0:k.c*i,maxX0:(k.c+k.span[0])*i,minZ0:k.r*i,maxZ0:(k.r+k.span[1])*i}));if(h.length===0)return{plots:[],stations:[],grassPlots:[],destructibles:[],slabs:[],bounds:{minX:0,maxX:0,minZ:0,maxZ:0},steps:[],doorways:[],obstacles:[],dummySpawns:[],diagnostics:e};const f=Math.min(...h.map(k=>k.minX0)),m=Math.max(...h.map(k=>k.maxX0)),v=Math.min(...h.map(k=>k.minZ0)),g=Math.max(...h.map(k=>k.maxZ0)),p=h.find(k=>k.pin),_=p?(p.minX0+p.maxX0)/2:(f+m)/2,x=p?(p.minZ0+p.maxZ0)/2:(v+g)/2,y=-_,S=-x;let E=o.reduce((k,Y)=>typeof Y.index=="number"?Math.max(k,Y.index):k,0);const R=new Map;for(const k of h)R.set(k.def.id,typeof k.def.index=="number"?k.def.index:++E);const b=new Set,M=(k,Y)=>{if(!b.has(Y))return b.add(Y),Y;let tt=`${k}/${Y}`,ut=2;for(;b.has(tt);)tt=`${k}/${Y}#${ut++}`;return b.add(tt),tt},P=[],I=[],D=[],U=[],C=[],T=[];for(const k of h){const Y=k.def,tt=Y.id,ut=R.get(tt)??0,st=Ne((k.minX0+k.maxX0)/2+y),wt=Ne((k.minZ0+k.maxZ0)/2+S),Zt={plotId:tt,cell:{c:k.c,r:k.r},span:k.span,minX:Ne(k.minX0+y),maxX:Ne(k.maxX0+y),minZ:Ne(k.minZ0+S),maxZ:Ne(k.maxZ0+S),top:0,thickness:t.slabThickness};I.push(Zt);const j=Y.radius??t.defaultRadius,V=Y.shape??t.defaultShape,B=Y.color??t.defaultColor,zt={dx:((mt=Y.spawn)==null?void 0:mt.dx)??0,dz:((xt=Y.spawn)==null?void 0:xt.dz)??t.spawnDz},kt=-(k.span[1]*i)/2+t.labelInset,yt={dx:((Pt=Y.label)==null?void 0:Pt.dx)??0,dz:((q=Y.label)==null?void 0:q.dz)??kt},_t={id:tt,index:ut,name:Y.name,hint:Y.hint,shape:V,x:st,z:wt,radius:j,spawnX:Ne(st+zt.dx),spawnZ:Ne(wt+zt.dz),labelX:Ne(st+yt.dx),labelZ:Ne(wt+yt.dz),color:B},K=[];if(Y.grass){const L=Y.grass,A=L.absolute?0:Math.round(st/t.cellSize),Q=L.absolute?0:Math.round(wt/t.cellSize),ht={minCellX:L.minCellX+A,maxCellX:L.maxCellX+A,minCellZ:L.minCellZ+Q,maxCellZ:L.maxCellZ+Q};L.density!==void 0&&(ht.density=L.density),L.clearMarginCells!==void 0&&(ht.clearMarginCells=L.clearMarginCells),K.push(ht)}const lt=[];if(Y.destructibles)for(const L of Y.destructibles)lt.push({id:M(tt,L.id),kind:L.kind,x:Ne(st+L.dx),y:L.y??0,z:Ne(wt+L.dz),height:L.height,radius:L.radius,tiltDeg:L.tiltDeg,pitchGain:L.pitchGain,maxTiltDeg:L.maxTiltDeg,fallSec:L.fallSec,bands:L.bands?[...L.bands]:void 0,color:L.color,cutColor:L.cutColor});for(const L of Y.steps??[])D.push({id:M(tt,L.id),x:Ne(st+L.dx),z:Ne(wt+L.dz),width:L.width,depth:L.depth,height:L.height});for(const L of Y.doorways??[])U.push({id:M(tt,L.id),x:Ne(st+L.dx),z:Ne(wt+L.dz),openingWidth:L.openingWidth,openingHeight:L.openingHeight,wallThickness:L.wallThickness,wallSpan:L.wallSpan,wallHeight:L.wallHeight});for(const L of Y.obstacles??[])C.push({id:M(tt,L.id),x:Ne(st+L.dx),z:Ne(wt+L.dz),width:L.width,depth:L.depth,height:L.height});for(const L of Y.dummies??[]){const A={plotId:tt,x:Ne(st+L.dx),z:Ne(wt+L.dz)};L.mode!==void 0&&(A.mode=L.mode),L.fighter&&(A.fighter=!0),L.weapon!==void 0&&(A.weapon=L.weapon),T.push(A)}P.push({id:tt,index:ut,name:Y.name,hint:Y.hint,owner:Y.owner??"",centerX:st,centerZ:wt,placement:k.pin?"pinned":"auto",slot:k.pin?-1:k.slot,cell:{c:k.c,r:k.r},span:k.span,slab:Zt,shape:V,radius:j,color:B,station:_t,grassPlots:K,destructibles:lt,testSpawn:Y.testSpawn})}const O=Math.max(...h.map(k=>k.c+k.span[0])),G=Math.max(...h.map(k=>k.r+k.span[1]));for(let k=0;k<G;k++){let Y=0;for(;Y<O;){if(r.has(`${Y},${k}`)){Y++;continue}const tt=Y;for(;Y<O&&!r.has(`${Y},${k}`);)Y++;I.push({plotId:"",cell:{c:tt,r:k},span:[Y-tt,1],minX:Ne(tt*i+y),maxX:Ne(Y*i+y),minZ:Ne(k*i+S),maxZ:Ne((k+1)*i+S),top:0,thickness:t.slabThickness})}}P.sort((k,Y)=>k.index-Y.index),I.sort((k,Y)=>{const tt=R.get(k.plotId)??Number.MAX_SAFE_INTEGER,ut=R.get(Y.plotId)??Number.MAX_SAFE_INTEGER;return tt-ut||k.cell.r-Y.cell.r||k.cell.c-Y.cell.c});const $=[...P].sort((k,Y)=>k.id<Y.id?-1:k.id>Y.id?1:0),at={minX:Ne(Math.min(...I.map(k=>k.minX))+t.boundInset),maxX:Ne(Math.max(...I.map(k=>k.maxX))-t.boundInset),minZ:Ne(Math.min(...I.map(k=>k.minZ))+t.boundInset),maxZ:Ne(Math.max(...I.map(k=>k.maxZ))-t.boundInset)};return{plots:P,stations:P.map(k=>k.station),grassPlots:P.flatMap(k=>k.grassPlots),destructibles:$.flatMap(k=>k.destructibles),slabs:I,bounds:at,steps:D,doorways:U,obstacles:C,dummySpawns:T,diagnostics:e}}function _x(n,t,e,i=dh){t.stations=e.stations,t.slabs=e.slabs,t.steps=e.steps,t.doorways=e.doorways,t.obstacles=e.obstacles,t.destructibles=e.destructibles,t.grass&&(t.grass.plots=e.grassPlots),t.ground={size:Math.max(e.bounds.maxX-e.bounds.minX,e.bounds.maxZ-e.bounds.minZ),thickness:i.slabThickness},n.worldBounds={...e.bounds};const a=t.grid.cellSize;t.grid={cellSize:a,minX:Math.floor(e.bounds.minX/a)*a,maxX:Math.ceil(e.bounds.maxX/a)*a,minZ:Math.floor(e.bounds.minZ/a)*a,maxZ:Math.ceil(e.bounds.maxZ/a)*a};const s=e.dummySpawns.filter(c=>!c.fighter),o=e.dummySpawns.filter(c=>c.fighter),r=n.dummies.initialModes;if(n.dummies.count=s.length,n.dummies.spawn=s.map(c=>({x:c.x,z:c.z})),n.dummies.initialModes=s.map((c,l)=>c.mode??r[l]??"idle"),n.dummies.fighters){const c=n.dummies.fighters,l=c.weapons;if(c.spawn=o.map(d=>({x:d.x,z:d.z})),c.weapons=o.map((d,u)=>d.weapon??l[u%l.length]),c.initialModes){const d=c.initialModes;c.initialModes=o.map((u,h)=>d[h%d.length])}}}const ea=1e-6;function cc(n,t,e){return n<t?t:n>e?e:n}function Xo(n,t,e,i,a,s,o){const r=a*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+s+ea||l.maxY<i-o-ea||t+r<l.minX||t-r>l.maxX||e+r<l.minZ||e-r>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function am(n,t,e,i,a=0,s=.05){let o=Number.NEGATIVE_INFINITY;for(const r of n)r.maxY>i+s||t<r.minX||t>r.maxX||e<r.minZ||e>r.maxZ||r.maxY>o&&(o=r.maxY);return o===Number.NEGATIVE_INFINITY?a:o}function hh(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const c of n){if(c.maxY<=t.y+a+ea||c.minY>=o-ea)continue;const l=cc(t.x,c.minX,c.maxX),d=cc(t.z,c.minZ,c.maxZ),u=t.x-l,h=t.z-d,f=u*u+h*h;if(!(f>=e*e))if(s=!0,f>ea*ea){const m=Math.sqrt(f),v=(e-m)/m;t.x+=u*v,t.z+=h*v}else{const m=t.x-c.minX,v=c.maxX-t.x,g=t.z-c.minZ,p=c.maxZ-t.z,_=Math.min(m,v,g,p);_===m?t.x=c.minX-e:_===v?t.x=c.maxX+e:_===g?t.z=c.minZ-e:t.z=c.maxZ+e}}return s}function uh(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+ea||o.minY>=s-ea)continue;const r=cc(t.x,o.minX,o.maxX),c=cc(t.z,o.minZ,o.maxZ),l=t.x-r,d=t.z-c;if(l*l+d*d<e*e-ea)return!0}return!1}const va=1e-6,Ys=Math.PI/180;function fh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Kl(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function sm(n){n.arrows.length=0}function bx(n,t,e,i,a,s,o,r,c,l,d){const u=i-n,h=s-e,f=u*u+h*h;let m=0;f>va&&(m=((o-n)*u+(r-e)*h)/f,m=Math.max(0,Math.min(1,m)));const v=n+u*m,g=e+h*m,p=v-o,_=g-r;if(p*p+_*_>d*d)return-1;const x=t+(a-t)*m;return x<c-.1||x>c+l?-1:m}function Sx(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=va)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*Ys,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let c=-1,l=i+va;for(const d of n.dummies){if(!n.modules.dummies)break;const u=d.position.x-a.x,h=d.position.z-a.z,f=Math.hypot(u,h);if(!(f<.001||f>i)){if(d.id===r)return d.id;Math.abs(fh(Math.atan2(u,h)-t))>s||f<l&&(c=d.id,l=f)}}return c}function wx(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*Ys;return t+Os(fh(s-t),-o,o)}function Ex(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*Ys),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*Ys),a<=0)return r;const c=n.dummies.find(v=>v.id===a);if(!c)return r;const l=Math.hypot(c.position.x-t,c.position.z-i);if(l<.4)return r;const d=l/Math.max(va,s),u=c.position.y+n.config.dummies.height*Os(o.aimHeightRatio,0,1),h=Math.max(0,o.gravity),f=(u-e+.5*h*d*d)/d,m=Os(f,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function Tx(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=Sx(n,e),c=wx(n,e,r),l=Math.sin(c),d=Math.cos(c),u=o.x+Math.sin(e)*.55,h=o.z+Math.cos(e)*.55,f=o.y+.95,m=Ex(n,u,f,h,r,s),v={id:++n.arrowSeq,x:u,y:f,z:h,vx:l*m.horizontal,vy:m.vy,vz:d*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*Ys};return n.arrows.push(v),Kl(n,"arrow-shot",a,v),v}function Os(n,t,e){return n<t?t:n>e?e:n}function Ax(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),c=[];for(const l of e){if(l.stuck){if(l.rest-=t,l.rest<=0)continue;if(l.stuckDummy>=0){const y=n.dummies[l.stuckDummy];if(y){const S=Math.cos(y.bodyYaw),w=Math.sin(y.bodyYaw);l.x=y.position.x+l.offX*S+l.offZ*w,l.y=y.position.y+l.offY,l.z=y.position.z-l.offX*w+l.offZ*S,l.yaw=y.bodyYaw+l.localYaw}}c.push(l);continue}if(l.life-=t,l.life<=0)continue;const d=l.x,u=l.y,h=l.z;if(l.homing>0&&(l.homing=Math.max(0,l.homing-t),l.targetId>0&&l.turnRate>0)){const y=n.dummies.find(S=>S.id===l.targetId);if(!y)l.targetId=0;else{const S=Math.hypot(l.vx,l.vz);if(S>va){const w=Math.atan2(y.position.x-l.x,y.position.z-l.z),E=Math.atan2(l.vx,l.vz),R=l.turnRate*t,b=E+Os(fh(w-E),-R,R);l.vx=Math.sin(b)*S,l.vz=Math.cos(b)*S;const M=Math.hypot(y.position.x-l.x,y.position.z-l.z);if(M>.3){const P=M/S,D=(y.position.y+s*Os(i.aimHeightRatio,0,1)-l.y+.5*r*P*P)/P,U=Math.max(0,i.verticalTurnRate)*t;l.vy+=Os(D-l.vy,-U,U)}}}}l.yaw=Math.atan2(l.vx,l.vz),l.pitch=-Math.atan2(l.vy,Math.hypot(l.vx,l.vz)),l.vy-=r*t;const f=d+l.vx*t,m=u+l.vy*t,v=h+l.vz*t;let g=-1,p=2;if(o)for(let y=0;y<n.dummies.length;y++){const S=n.dummies[y],w=bx(d,u,h,f,m,v,S.position.x,S.position.z,S.position.y,s,a+i.radius);w>=0&&w<p&&(p=w,g=y)}if(g>=0){const y=n.dummies[g];l.x=d+(f-d)*p,l.y=u+(m-u)*p,l.z=h+(v-h)*p,l.stuck=!0,l.stuckDummy=g;const S=Math.cos(y.bodyYaw),w=Math.sin(y.bodyYaw),E=l.x-y.position.x,R=l.z-y.position.z;l.offX=E*S-R*w,l.offZ=E*w+R*S,l.offY=l.y-y.position.y;const b=Math.atan2(l.vx,l.vz);l.localYaw=b-y.bodyYaw,l.yaw=b,l.pitch=Math.atan2(-l.vy,Math.hypot(l.vx,l.vz)),l.rest=Math.max(.2,i.stickSec),l.hit=!0;const M=Math.hypot(l.vx,l.vz);Qo(n,g,{type:"light",duration:.22,dirX:M>va?l.vx/M:0,dirZ:M>va?l.vz/M:1,knockback:.14}),Kl(n,"arrow-land",y.id,l),c.push(l);continue}const _=Xo(n.boxes,f,v,m+.4,.04,0,6),x=Number.isFinite(_)?_:0;if(m<=x+.02&&l.vy<0){l.x=f,l.y=x+Math.max(0,i.groundStickLift),l.z=v,l.stuck=!0,l.stuckDummy=-1,l.yaw=Math.atan2(l.vx,l.vz);const y=Math.atan2(-l.vy,Math.max(va,Math.hypot(l.vx,l.vz)));l.pitch=Math.max(y,Math.max(0,i.stickMinPitchDeg)*Ys),l.rest=Math.max(.2,i.stickSec),Kl(n,"arrow-land",-1,l),c.push(l);continue}l.x=f,l.y=m,l.z=v,c.push(l)}n.arrows=c}const Jl=1e-6,Rx=Math.PI/180;function Ql(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function ph(n,t,e){return n<t?t:n>e?e:n}function Tc(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function td(n){const t=n.id,e=n.windowId;Object.assign(n,Tc()),n.id=t,n.windowId=e}function Px(n){td(n)}function om(n){td(n.playerLink);for(const t of n.dummies)td(t.link)}function Cx(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function ed(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function lc(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Tc()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function Lx(n,t){const e=n.config.links.search,i=n.character.position,a=ph(e.maxAngleDeg,0,180)*Rx;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,d=c.position.z-i.z,u=Math.hypot(l,d);if(u<Jl||u>e.range)continue;const h=Math.atan2(l,d);Math.abs(Ye(h-t))>a||u<r&&(r=u,s=c.id,o=h)}return{id:s,yaw:o,dist:s>0?r:0}}function Dx(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=Go(n,t),c=Lx(n,r),l=c.id>0?c.yaw:r,d=c.id>0?ph(c.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=l,s.targetId=c.id,s.targetDist=c.dist,s.travel=d,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Ql(n,"link-start",s.id)}function kx(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){lc(n);return}if(e.weapon!==n.combat.weapon){lc(n);return}e.timer+=t;const a=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const c=a(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Ql(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Ql(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?ph(r/o,0,1):1,e.phase==="active"&&i.active>Jl){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Jl,i.active-e.timer),d=c/l;n.impulse.x=Math.sin(e.facing)*d,n.impulse.z=Math.cos(e.facing)*d}}function Ix(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&lc(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&ed(n,"sprint"),a.prevSprinting=r,kx(n,t);const c=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&Dx(n,e,c,o.weapon)}const Zr={windup:0,active:1,recovery:2},Au=1e-9;function rm(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function zx(n){return n==="windup"||n==="active"||n==="recovery"}function Fx(n,t){return Zr[n]+rm(t)}function Ux(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!zx(s.at))continue;const o=rm(s.u??0),r=Zr[s.at]+o;r>i+Au&&r<=e+Au&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>Zr[s.at]+s.u-(Zr[o.at]+o.u)),a}const Vo=1e-6;function ya(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Nx(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function cm(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Ac(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=cm()}function lm(n){return{weapon:Ea[Math.max(0,n-1)]??Ea[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:cm()}}function Ox(n,t){return Go(n,t)}function Bx(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function dm(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=Ox(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,ya(n,"attack-start",i)}function hm(n){return Math.max(0,n.config.combat.settle)}function nd(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];dm(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:hm(n),lunge:Bx(n,i.lunge[e-1]??0)},e)}function Ru(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,dm(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:hm(n),lunge:i.lunge},0),Tx(n,e,n.combat.attackFacing),ya(n,"charge-release",e)}function Hx(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),c=a+(1-a)*r;if(e.warp=c,e.warpDebt+=t*(1-c),o>=1){e.warpPhase=3,e.warpTimer=0;const l=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,l)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function Gx(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=Hx(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const d=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<d)break;if(i.phaseTimer-=d,i.phase==="windup")i.phase="active",ya(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,ya(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&nd(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const d=i.timings.recovery;if(d>Vo&&i.phaseTimer>=d*n.config.combat.cancelWindow){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&nd(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}const c=a.windup+a.active+a.recovery;let l=0;i.phase==="windup"?l=i.phaseTimer:i.phase==="active"?l=a.windup+i.phaseTimer:i.phase==="recovery"?l=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(l=c),i.phase!=="idle"&&(i.attackProgress=c>0?Math.min(1,l/c):1),Xx(n)}function Xx(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>Vo?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:Fx(t.phase,a);if(s<=t.notifyCursor+Vo)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of Ux(o,t.notifyCursor,s))Nx(n,r.name,r.value);t.notifyCursor=s}function Vx(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=Ea.length){const c=Ea[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,Ac(n),lc(n),ya(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,ya(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),Gx(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!c&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const d=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;nd(n,e,d)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,ya(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,Vo)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const c=i.charge;i.charge=0,Ru(n,e,c)}}else if(i.charging){i.charging=!1;const c=i.charge;i.charge=0,c>=a.bow.minChargeToFire?Ru(n,e,c):ya(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>Vo)){const c=i.timings.active,l=Math.max(0,i.timings.lunge),d=Math.max(.2,a.lungeCurve),u=g=>l*(1-Math.pow(1-Math.min(1,Math.max(0,g/c)),d+1)),h=t*i.warp,f=Math.min(c,Math.max(0,i.phaseTimer)),m=Math.min(c,Math.max(0,i.phaseTimer-h));let v=Math.max(0,u(f)-u(m))/Math.max(h,1e-4);v=Math.min(v,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*v,n.impulse.z=Math.cos(i.attackFacing)*v}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const pn=1e-6,id=Math.PI*2,Wx=7,Yx=18,um=1.3,fm=.4,$x=.9,Pu=.9;function Cu(n,t,e,i){const a=Math.max(e,.1),s=((n+t*2.37)%a+a)%a,o=Math.min(Math.max(i,0),1)*a;if(o<=pn||s>=o)return 0;const r=Math.min(Math.max(a*.12,.15),o*.5),c=Math.min(1,Math.min(s/r,(o-s)/r));return c*c*(3-2*c)}function Zx(n,t){const e=Math.hypot(n,t);return e<=1?{x:n,z:t}:{x:n/e,z:t/e}}function jx(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Lu(n,t,e,i){return n+jx(t-n)*(1-Math.exp(-Math.max(e,pn)*i))}function dc(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function qx(n){var i;const t=[];for(let a=0;a<n.count;a++){const s=n.spawn[a]??{x:0,z:0},o=n.initialModes[a]??"idle";t.push(ad(a+1,o,s.x,s.z,null))}const e=n.fighters;if(e)for(let a=0;a<e.weapons.length;a++){const s=e.spawn[a]??{x:0,z:0},o=((i=e.initialModes)==null?void 0:i[a])??"spar",r=e.attackInterval*(.25+.22*a);t.push(ad(t.length+1,o,s.x,s.z,e.weapons[a],r))}return t}function ad(n,t,e,i,a,s=0){return{id:n,mode:t,initialMode:t,homeX:e,homeZ:i,position:{x:e,y:0,z:i},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:e,targetZ:i,wanderTimer:0,attackCooldown:s,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,attackComboIndex:0,attackComboLeft:0,comboGap:0,hurt:Yp(),link:Tc(),weapon:a,combat:a?{...lm(Ea.indexOf(a)+1),weapon:a}:null}}function Kx(n,t=!1){const e=t?Vp:Hg,i=e.indexOf(n);return e[(i+1)%e.length]}function pm(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0,i.attackComboIndex=0,i.attackComboLeft=0,i.comboGap=0;const o=i.hurt;if(o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,Px(i.link),i.combat){const r=i.combat;r.phase="idle",r.comboIndex=0,r.phaseTimer=0,r.attackProgress=0,r.attackFacing=0,r.charging=!1,r.charge=0,r.hitstop=0,r.warp=1,r.warpPhase=0,r.warpDebt=0,r.warpTimer=0,r.hitIds.length=0,r.timings={windup:0,active:0,recovery:0,settle:0,lunge:0}}}n.dummyAttackCount=0}function Jx(n,t,e){const i=tl(n)*id,a=Math.sqrt(tl(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+tl(n)*.8)}function mh(n,t,e){if(t.weapon){const i=n.config.combat.weapons[t.weapon];if(i)return{windup:i.windup,active:i.active,recovery:i.recovery}}return{windup:e.attackWindup,active:e.attackActive,recovery:e.attackRecovery}}function sd(n,t,e){var s;if(!t.weapon)return e.attackRange;const i=n.config.hits.reach[t.weapon]??e.attackRange,a=((s=e.fighters)==null?void 0:s.attackRangeScale)??.9;return Math.max(.4,i*a)}function od(n,t){return n.weapon&&t.fighters?t.fighters.attackInterval:t.attackInterval}function Qx(n,t){return n.weapon&&t.fighters?Math.max(t.leashRadius,t.fighters.leashRadius):t.leashRadius}function tv(n,t,e){const i=mh(e,n,t);return n.attackPhase==="windup"?i.windup:n.attackPhase==="active"?i.active:n.attackPhase==="recovery"?i.recovery:0}function ev(n,t,e){var s;if(!t.weapon)return 1;const i=((s=e.fighters)==null?void 0:s.comboCount)??0;if(i>0)return Math.max(1,Math.round(i));const a=n.config.combat.weapons[t.weapon];return Math.max(1,Math.round((a==null?void 0:a.comboCount)??1))}function nv(n,t){var i;const e=((i=t.fighters)==null?void 0:i.comboGap)??0;return e>0?e:Math.max(0,n.config.combat.settle)}function iv(n){return n.attackPhase!=="idle"||n.attackComboLeft>0}function av(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0,Du(n,t,i);return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const c=Math.max(tv(t,i,n),pn);if(t.attackPhaseTimer<c)break;t.attackPhaseTimer-=c,t.attackPhase==="windup"?(t.attackPhase="active",dc(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0,t.attackComboLeft>0?t.comboGap=nv(n,i):(t.attackComboIndex=0,t.weapon&&t.attackCooldown<=0&&(t.attackCooldown=od(t,i)*fm)))}const s=mh(n,t,i),o=s.windup+s.active+s.recovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=s.windup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=s.windup+s.active+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||o<=0?0:Math.min(1,r/o),Du(n,t,i)}function Du(n,t,e){const i=t.combat;if(!i)return;const a=mh(n,t,e),s=t.attackPhase==="idle"&&t.attackComboLeft>0&&t.comboGap>0;i.weapon=t.weapon??i.weapon,i.phase=s?"settle":t.attackPhase,i.comboIndex=t.attackComboIndex,i.phaseTimer=t.attackPhaseTimer,i.attackProgress=s?1:t.attackProgress,i.attackFacing=t.facing,i.timings={windup:a.windup,active:a.active,recovery:a.recovery,settle:0,lunge:0},i.hitstop=0,i.warp=1,i.warpPhase=0,i.charging=!1,i.charge=0}function sv(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>pn?a/o:0,c=o>pn?s/o:0;let l=0,d=0;if(t.mode==="wander"){const h=t.targetX-t.position.x,f=t.targetZ-t.position.z,m=Math.hypot(h,f);(t.wanderTimer<=0||m<.3)&&Jx(n,t,e);const v=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(v,g);p>pn&&(l=v/p,d=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(l=r,d=c);else if(t.mode==="keep-distance"){const h=o-e.keepDistance,f=Math.max(e.keepDeadZone,.2),m=Math.max(-1,Math.min(1,h/f))*Pu,v=Cu(n.time,t.id,e.strafePeriod,e.strafeDuty)*e.keepStrafe;l=r*m-c*v,d=c*m+r*v}else if(t.mode==="attack")o>sd(n,t,e)&&t.attackPhase==="idle"&&(l=r,d=c);else if(t.mode==="spar"){const h=sd(n,t,e),f=h*1.7;if(iv(t))o>h*um?(l=r,d=c):o<h*.55&&(l=-r*.6,d=-c*.6);else if(t.attackPhase==="idle"&&t.attackCooldown<=0&&o>h)l=r,d=c;else{const v=Math.max(-1,Math.min(1,(o-f)/.5))*Pu,g=Cu(n.time,t.id,e.strafePeriod,e.strafeDuty)*$x;l=r*v-c*g,d=c*v+r*g}}({x:l,z:d}=Zx(l,d));let u=t.facing;if(t.mode==="wander"?Math.hypot(l,d)>pn&&(u=Math.atan2(l,d)):o>pn&&(u=Math.atan2(r,c)),e.leashRadius>pn&&t.mode!=="wander"&&t.mode!=="idle"){const h=Qx(t,e),f=t.position.x-t.homeX,m=t.position.z-t.homeZ,v=Math.hypot(f,m);if(v>h){const g=Math.min(1,(v-h)/Math.max(h*.5,.5)),p=-f/v,_=-m/v;l=l*(1-g)+p*g,d=d*(1-g)+_*g;const x=Math.hypot(l,d);x>pn&&(l/=x,d/=x)}}return{x:l,z:d,facing:u}}function ov(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.comboGap=Math.max(0,e.comboGap-t),e.hurt.timer>0&&(e.attackComboLeft=0,e.comboGap=0),(e.mode==="attack"||e.mode==="spar")&&e.attackPhase==="idle"&&e.hurt.timer<=0){const _=n.character.position,x=Math.hypot(_.x-e.position.x,_.z-e.position.z),y=sd(n,e,i);if(e.attackComboLeft>0)e.comboGap<=0&&(x<=y*um+pn?(e.attackComboIndex+=1,e.attackComboLeft-=1,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,n.dummyAttackCount+=1,dc(n,"dummy-attack",e)):(e.attackComboLeft=0,e.attackComboIndex=0,e.attackCooldown=Math.max(e.attackCooldown,od(e,i)*fm)));else if(e.attackCooldown<=0&&x<=y+pn){const S=ev(n,e,i);e.attackComboIndex=1,e.attackComboLeft=Math.max(0,S-1),e.comboGap=0,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=od(e,i),n.dummyAttackCount+=1,dc(n,"dummy-attack",e)}}av(n,e,t,i);const a=sv(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-pn||a.x<0&&e.position.x<=s.minX+pn)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-pn||a.z<0&&e.position.z<=s.minZ+pn)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,pn)*t),r=e.weapon&&i.fighters?i.fighters.moveSpeed:i.moveSpeed;e.velocity.x+=(a.x*r-e.velocity.x)*o,e.velocity.z+=(a.z*r-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=Lu(e.bodyYaw,e.facing,Wx,t),e.headYaw=Lu(e.headYaw,e.facing,Yx,t);const c=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const d=n.config.stepHeight;if(hh(n.boxes,e.position,i.radius,i.height,d))if(uh(n.boxes,e.position,i.radius,i.height,d))e.position.x=c,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const _=e.position.x-c,x=e.position.z-l;Math.abs(_)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const h=n.config.worldBounds;e.position.x<h.minX?(e.position.x=h.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>h.maxX&&(e.position.x=h.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<h.minZ?(e.position.z=h.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>h.maxZ&&(e.position.z=h.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const f=Xo(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,d,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+d+pn&&(e.position.y=f);const m=Math.hypot(e.position.x-c,e.position.z-l);e.distance+=m;const v=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,v/Math.max(n.config.moveSpeed,pn)),p=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),pn);e.stride=p,e.gaitPhase=(e.gaitPhase+m/p*id)%id}function rv(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=Kx(a.mode,!!a.weapon),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,a.attackComboIndex=0,a.attackComboLeft=0,a.comboGap=0,a.combat&&(a.combat.phase="idle",a.combat.attackProgress=0,a.combat.comboIndex=0),dc(n,"dummy-mode",a)}for(const a of n.dummies)ov(n,t,a,i)}const cv=["idle","attack","keep-distance"],lv=["sword-shield","dual-swords","greatsword"];function rd(n,t){const e=n.dummies.length,i=n.dummies.filter(a=>a.spawnedByPlot?t!==void 0&&a.spawnedByPlot!==t:!0);n.dummies=i;for(let a=0;a<n.dummies.length;a++)n.dummies[a].id=a+1;return e-n.dummies.length}function dv(n,t){var h,f;const e=t.testSpawn??{},i=Math.max(0,Math.floor(e.dummies??0)),a=Math.max(0,Math.floor(e.fighters??0));rd(n,t.id);const s=i+a;if(s===0)return 0;const o=Math.max(.4,e.ringRadius??1.6),r=e.startDeg??-90,c=e.modes??cv,l=e.weapons??((h=n.config.dummies.fighters)==null?void 0:h.weapons)??lv,d=((f=n.config.dummies.fighters)==null?void 0:f.attackInterval)??3.4,u=[];for(let m=0;m<s;m++){const v=(r+360*m/s)*Math.PI/180,g=t.centerX+Math.cos(v)*o,p=t.centerZ+Math.sin(v)*o,_=m>=i,x=m-i,y=_?"spar":c[m%c.length],S=_?l[x%l.length]:null,w=_?d*(.25+.22*x):0,E=ad(n.dummies.length+u.length+1,y,g,p,S,w);E.spawnedByPlot=t.id,u.push(E)}return n.dummies.push(...u),u.length}function hv(n){let t=0;for(const e of n.dummies)e.spawnedByPlot&&t++;return t}const cd=1e-6;function el(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function uv(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function mm(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function ku(n,t,e){return n<t?t:n>e?e:n}function fv(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,d=s.x,u=s.z;for(;l<c-cd;){const h=Math.min(c,l+r),f=s.x+t*h,m=s.z+e*h,v=ku(f,o.minX,o.maxX),g=ku(m,o.minZ,o.maxZ),p={x:v,y:s.y,z:g};if(uh(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(d=v,u=g,l=h,v!==f||g!==m))break}return{x:d,z:u}}function pv(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,ed(n,"roll")),i.cooldown>0){const c=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),c>0&&i.cooldown===0&&el(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&Ac(n));const c=Gg(n,e),l=c.x,d=c.z,u=n.combat.weapon==="staff";if(i.kind=u?"blink":"roll",i.dirX=l,i.dirZ=d,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=u?a.blinkCooldown:a.rollCooldown,u){const h=fv(n,l,d);n.character.position.x=h.x,n.character.position.z=h.z,i.toX=h.x,i.toZ=h.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),ed(n,"blink"),el(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(cd,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+l*a.rollDistance,i.toZ=i.fromZ+d*a.rollDistance,el(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const c=Math.max(cd,i.timer),l=n.character.position.x,d=n.character.position.z;n.impulse.x=(i.toX-l)/c,n.impulse.z=(i.toZ-d)/c}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const vi=1e-6,Iu=Math.PI*2;function zu(n,t){return Math.sqrt(n*n+t*t)}function hr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function mv(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,Ac(n)}function gv(n,t,e){const i=n.character,a=n.config,s=Xo(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,Ac(n),om(n),mm(n),em(n),sm(n),rc(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=rh,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function xv(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,c=Number.isFinite(e.moveZ)?e.moveZ:0;const l=zu(r,c);l>1&&(r/=l,c/=l);const d=i.worldBounds;(r>0&&s.x>=d.maxX-vi||r<0&&s.x<=d.minX+vi)&&(r=0),(c>0&&s.z>=d.maxZ-vi||c<0&&s.z<=d.minZ+vi)&&(c=0);const u=n.combat.phase!=="idle",h=n.playerLink.phase!=="idle",f=n.dash.phase==="active",m=u||f||h;a.sprinting=!m&&e.sprintHeld&&l>vi;const v=i.combat.weapons[n.combat.weapon];let g=v?v.moveMultiplier:1;f||h?g=0:u?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const D=m?i.skillDecel:l>vi?i.acceleration:i.friction,U=1-Math.exp(-D*t);o.x+=(r*p-o.x)*U,o.z+=(c*p-o.z)*U}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,hr(n,"jumped",i.jumpSpeed)),n.events.some(D=>D.type==="blink"&&D.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,y=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,hh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(uh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=y,o.x=0,o.z=0;else{const D=s.x-x,U=s.z-y;Math.abs(D)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(U)<Math.abs(o.z*t)*.5&&(o.z=0)}hr(n,"blocked",1)}s.x<d.minX?(s.x=d.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>d.maxX&&(s.x=d.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<d.minZ?(s.z=d.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>d.maxZ&&(s.z=d.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const w=Xo(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&w>s.y+vi&&w-s.y<=i.stepHeight+vi&&(s.y=w,o.y=0,hr(n,"stepUp",w));const E=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const R=Xo(n.boxes,s.x,s.z,E,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);R>Number.NEGATIVE_INFINITY&&s.y<=R&&o.y<=0?(s.y=R,o.y=0,a.grounded||hr(n,"landed",R),a.grounded=!0):a.grounded=!1;const b=zu(s.x-x,s.z-y);a.distance+=b;const M=b/Math.max(t,vi),P=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,vi)),I=Math.max(i.strideLength*(1+P*i.strideSpeedGain),vi);a.stride=I,a.gaitPhase=(a.gaitPhase+b/I*Iu)%Iu}const ld=1e-6,Fu=2.399963229728653;function Za(n,t,e){return n<t?t:n>e?e:n}function Uu(n,t,e,i,a,s,o,r,c){const l=t.x-n.x,d=t.z-n.z,u=Math.hypot(l,d),h=e+i;if(u>=h)return;let f,m,v;u<ld?(f=r,m=c,v=h):(f=l/u,m=d/u,v=h-u);const g=v+o;n.x-=f*g*a,n.z-=m*g*a,t.x+=f*g*s,t.z+=m*g*s}function vv(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let d=0;d<o;d++){for(let u=0;u<e.length;u++)for(let h=u+1;h<e.length;h++){const f=(u*3+h)*Fu;Uu(e[u].position,e[h].position,s,s,.5,.5,r,Math.cos(f),Math.sin(f))}for(let u=0;u<e.length;u++){const h=(u+1)*Fu;Uu(i,e[u].position,a,s,0,1,r,Math.cos(h),Math.sin(h))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const d of e)hh(n.boxes,d.position,s,n.config.dummies.height,c),d.position.x=Za(d.position.x,l.minX,l.maxX),d.position.z=Za(d.position.z,l.minZ,l.maxZ)}function yv(n,t,e,i,a,s,o,r){const c=Math.hypot(e,i),l=Math.max(0,r.contactBand),d=Za(r.minScale,0,1);if(c<ld||l<=0||d>=1)return 1;const u=a+o,h=Za(r.approachDot,0,.99);let f=0;for(const m of s){const v=m.position.x-n,g=m.position.z-t,p=Math.hypot(v,g);if(p>=u+l)continue;if(p<ld){f=1;continue}const _=(e*v+i*g)/(c*p);if(_<=h)continue;const x=Za(1-(p-u)/l,0,1),y=Za((_-h)/(1-h),0,1);f=Math.max(f,x*y)}return 1-(1-d)*Za(f,0,1)}function Mv(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=yv(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const nl=1e-6,_v=Math.PI/180;function bv(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Sv(n,t,e){return n<t?t:n>e?e:n}function wv(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>nl?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>nl&&(o=Math.atan2(e.moveX,e.moveZ));const c=Sv(i.maxAngleDeg,0,180)*_v;let l=Number.POSITIVE_INFINITY,d=0,u=0,h=0;for(const f of n.dummies){const m=f.position.x-s.x,v=f.position.z-s.z,g=Math.hypot(m,v);if(g<nl||g>i.range)continue;const p=Math.atan2(m,v),_=Math.abs(Ye(p-o));if(_>c)continue;const x=g-i.frontBias*Math.cos(_);x<l&&(l=x,d=f.id,u=p,h=g)}a.targetId=d,a.targetYaw=u,a.targetDist=h,a.hasTarget=d>0}const Ii=1e-6;function Fs(n,t,e){return n<t?t:n>e?e:n}function Nu(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ev(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(D,U)=>{const C=D.position.x-s.x,T=D.position.z-s.z,O=Math.hypot(C,T);if(O<Ii||O>U)return 0;const G=Fs((U-O)/Math.max(Ii,U-i.nearDistance),0,1);let $=G*(i.modeWeight[D.mode]??.5);return D.attackPhase==="active"&&($+=i.attackBoost*G),$},r=[];let c=0,l=!1,d=!1,u=!1;for(const D of n.dummies){const U=o(D,i.threatRange),C=D.position.x-s.x,T=D.position.z-s.z,O=Math.hypot(C,T);U>0&&(r.push({id:D.id,x:D.position.x,z:D.position.z,dx:C,dz:T,yaw:Math.atan2(C,T),w:U}),c+=U,O<=i.approachDist&&(i.modeWeight[D.mode]??.5)>=i.hostileModeWeight&&(u=!0)),O>Ii&&O<=i.recoveryDist&&(l=!0),(D.attackPhase==="windup"||D.attackPhase==="active")&&O<=i.threatRange&&(d=!0)}const h=c<=0?0:Fs(c/(c+Math.max(Ii,i.saturation)),0,1),f=r.length>0,m=a.active,v=f&&(e.aimActive&&h>=i.enterThreshold||i.reactToAttack&&d&&h>=i.enterThreshold||i.reactToApproach&&u),g=i.hurtHoldSec>Ii&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(l||g);if(a.active=v||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((D,U)=>U.w-D.w);const _=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],y=Math.atan2(x.dx,x.dz),S=i.behindAngleDeg*Math.PI/180,w=n.character.bodyYaw;let E=0,R=0,b=0;for(const D of _){const U=Math.abs(Nu(D.yaw-y))/Math.PI;let C=D.w/(1+Math.max(i.spreadFalloff,0)*U*U);D!==x&&i.behindFalloff<1&&Math.abs(Nu(D.yaw-w))>S&&(C*=Math.max(i.behindFalloff,0)),E+=D.x*C,R+=D.z*C,b+=C}a.mainId=x.id,a.mainYaw=y;const M=n.dummies.find(D=>D.id===x.id),P=(M?M.position.y:0)+n.config.dummies.height*Fs(i.aimHeightRatio,0,1),I=s.y+n.config.characterHeight*Fs(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(P-I,Math.max(Ii,Math.hypot(x.dx,x.dz))),a.centroidYaw=b>Ii?Math.atan2(E/b-s.x,R/b-s.z):y,a.threatCount=r.length,a.threat=h}function Tv(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function Av(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<Ii||a>e.threatRange)return 0;const s=Math.max(Ii,e.threatRange-e.nearDistance),o=Fs((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const c=Math.max(Ii,e.modeWeight.attack??1.5);return Fs(r/c,0,1)}const ts=1e-6,$s=Math.PI*2,Wo={enabled:!1,dirDeg:0,speed:0,amplitude:0,wavelength:4,secondWave:{wavelength:2,amplitude:0,speedScale:1},gust:{periodSec:8,depth:0},jitter:0,shadeAmount:0};function gm(n){var t;return((t=n==null?void 0:n.grass)==null?void 0:t.wind)??Wo}function Rc(n){return{time:0,gust:1-Math.min(1,Math.max(0,n.gust.depth))}}function Rv(n,t,e){if(!t.enabled)return;n.time+=Math.max(0,e);const i=Math.max(.1,t.gust.periodSec),a=Math.min(1,Math.max(0,t.gust.depth));n.gust=1-a+a*(.5+.5*Math.sin($s*n.time/i-Math.PI/2))}function Pv(n,t,e,i){const a=n.dirDeg*Math.PI/180,s=t*Math.cos(a)+e*Math.sin(a),o=$s/Math.max(.1,n.wavelength),r=$s/Math.max(.1,n.secondWave.wavelength);return[o*s+i,r*s+i*1.7]}function xm(n){const t=n.dirDeg*Math.PI/180,e=$s/Math.max(.1,n.wavelength),i=$s/Math.max(.1,n.secondWave.wavelength);return{dirX:Math.cos(t),dirZ:Math.sin(t),omega1:e*n.speed,omega2:i*n.speed*n.secondWave.speedScale,amp1:n.amplitude,amp2:n.secondWave.amplitude,shadeAmount:n.shadeAmount}}const Cv=.18,Ou=.4,Lv=.6;function Dv(n,t,e){if(n<0)return 0;if(n===0)return 1;if(t<=0)return 0;const i=Math.min(1,Math.max(0,1-n/t)),a=Math.min(1,Math.max(0,e))*Cv,s=Math.min(1,Math.max(0,(i-a)/(1-a)));return s*s*(3-2*s)}function kv(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function vm(n,t){return n+","+t}function Iv(n,t,e){return{spec:e??{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:0,bladesPerPatch:[0,0],avoidMargin:0,seed:0},cellSize:t.cellSize>0?t.cellSize:.5,bucketCells:(n==null?void 0:n.bucketCells)??4,blades:[],patches:[],buckets:{},cutCount:0,lastCutAt:0,wind:Rc((n==null?void 0:n.wind)??Wo)}}function zv(n,t,e,i){const a=t.grass,s=n.grass;if(!a||!s||!s.enabled)return Iv(s,i,a);const o=i.cellSize>0?i.cellSize:.5,r=kv(a.seed),c=Math.max(1,Math.floor(s.footprintCells)),l=Math.max(1,s.bucketCells)*o,d=Math.max(o,s.minHeightCells*o),u=Math.max(d,s.maxHeightCells*o),[h,f]=a.bladesPerPatch,m=Math.max(0,Math.floor(h)),v=Math.max(m,Math.floor(f)),g=e.filter(R=>R.kind!=="ground").map(R=>({minX:R.minX-a.avoidMargin,maxX:R.maxX+a.avoidMargin,minZ:R.minZ-a.avoidMargin,maxZ:R.maxZ+a.avoidMargin})),p=[],_=[],x={},y=a.plots??[],S=(R,b)=>{const M=R+c/2,P=b+c/2;for(let I=0;I<y.length;I++){const D=y[I],U=Math.max(0,D.clearMarginCells??0);if(M>=D.minCellX-U&&M<=D.maxCellX+U&&P>=D.minCellZ-U&&P<=D.maxCellZ+U)return!0}return!1},w=(R,b,M)=>{const P=p.length;for(let I=0;I<M;I++){const D=(R+r()*c)*o,U=(b+r()*c)*o;let C=!1;for(let Pt=0;Pt<g.length;Pt++){const q=g[Pt];if(D>=q.minX&&D<=q.maxX&&U>=q.minZ&&U<=q.maxZ){C=!0;break}}if(C)continue;const T=am(e,D,U,3,0,.05),O=d+(u-d)*r(),G=(O-d)/Math.max(ts,u-d),$=Math.min(1,Math.max(0,r()*.68+G*.32)),at=p.length;p.push({id:at,x:D,y:T,z:U,yaw:r()*$s,height:O,width:o*.26,tone:$,lean:(r()-.5)*.24,bend:0,bendX:0,bendZ:0,targetBend:0,recover:0,cut:0,cutAt:0});const mt=vm(Math.floor(D/l),Math.floor(U/l)),xt=x[mt];xt?xt.push(at):x[mt]=[at]}p.length>P&&_.push({id:_.length,cellX:R,cellZ:b,bladeFrom:P,bladeTo:p.length})},E=()=>m+Math.floor(r()*(v-m+1));for(let R=a.minCellZ;R+c<=a.maxCellZ;R+=c)for(let b=a.minCellX;b+c<=a.maxCellX;b+=c){const M=r();S(b,R)||M>a.density||w(b,R,E())}for(let R=0;R<y.length;R++){const b=y[R],M=Math.min(1,Math.max(0,b.density??1));for(let P=b.minCellZ;P+c<=b.maxCellZ;P+=c)for(let I=b.minCellX;I+c<=b.maxCellX;I+=c)r()>M||w(I,P,E())}return{spec:a,cellSize:o,bucketCells:s.bucketCells,blades:p,patches:_,buckets:x,cutCount:0,lastCutAt:0,wind:Rc(s.wind??Wo)}}function ym(n,t,e,i){const a=Math.max(1,n.bucketCells)*n.cellSize,s=Math.floor((t-i)/a),o=Math.floor((t+i)/a),r=Math.floor((e-i)/a),c=Math.floor((e+i)/a),l=[];for(let d=s;d<=o;d++)for(let u=r;u<=c;u++){const h=n.buckets[vm(d,u)];if(h)for(let f=0;f<h.length;f++)l.push(h[f])}return l}function Fv(n){const t=n.grass,e=n.config.grass;if(!t||!e||!e.enabled||!n.modules.grass)return 0;const i=Zp(n);if(!i.active&&i.slamRadius<=0)return 0;const a=.02,s=Math.max(i.reach,i.slamRadius)+1;let o=0;const r=ym(t,i.x,i.z,s);for(let c=0;c<r.length;c++){const l=t.blades[r[c]];if(l.cut!==0||!Vg(i,l.x,l.z,a)&&!Wg(i,l.x,l.z,a))continue;l.cut=e.regrow?Math.max(ts,e.regrowSec):-1,l.cutAt=n.time;const d=l.x-i.x,u=l.z-i.z,h=Math.sqrt(d*d+u*u);l.bendX=h>ts?d/h:i.fx,l.bendZ=h>ts?u/h:i.fz,l.bend=Math.min(e.maxBendRad,.55),l.targetBend=0,o+=1}return o>0&&(t.cutCount+=o,t.lastCutAt=n.time,n.events.push({type:"grass-cut",tick:n.tick,x:i.x,y:n.character.position.y,z:i.z,value:o})),o}function Uv(n,t){const e=n.grass,i=n.config.grass;if(!e||e.blades.length===0||!i||!i.enabled||!n.modules.grass)return;const a=gm(n.config);e.wind||(e.wind=Rc(a)),Rv(e.wind,a,t);const s=e.blades,o=s.length,r=new Array(o).fill(0),c=Math.max(0,i.bendRadius)+n.config.characterRadius;for(let m=0;m<o;m++)s[m].targetBend=0;const l=n.character.position.x,d=n.character.position.z,u=(m,v)=>{const g=ym(e,m,v,c);for(let p=0;p<g.length;p++){const _=g[p],x=s[_];if(x.cut!==0)continue;const y=x.x-m,S=x.z-v,w=Math.sqrt(y*y+S*S);if(w>c)continue;const E=1-w/c,R=i.maxBendRad*E*E;if(R>x.targetBend){x.targetBend=R;const b=w>ts?1/w:0;x.bendX=w>ts?y*b:0,x.bendZ=w>ts?S*b:1,x.recover=0}r[_]=1}};if(u(l,d),n.modules.dummies)for(let m=0;m<n.dummies.length;m++)u(n.dummies[m].position.x,n.dummies[m].position.z);const h=1-Math.exp(-Math.max(0,i.bendRate)*t),f=1-Math.exp(-Math.max(0,i.recoverRate)*t);for(let m=0;m<o;m++){const v=s[m];v.bend+=(v.targetBend-v.bend)*(v.targetBend>v.bend?h:f),v.bend<1e-4&&(v.bend=0),!r[m]&&v.bend===0&&(v.recover+=t),v.cut>0&&(v.cut-=t,v.cut<=0&&(v.cut=0))}Fv(n)}function Nv(n){const t=n.grass;if(!t)return;for(let i=0;i<t.blades.length;i++){const a=t.blades[i];a.bend=0,a.targetBend=0,a.bendX=0,a.bendZ=0,a.recover=0,a.cut=0,a.cutAt=0}t.cutCount=0,t.lastCutAt=0;const e=Rc(gm(n.config));t.wind.time=e.time,t.wind.gust=e.gust}const ga=1e-6,Bu=Math.PI/180,Ov=1.47;function Wa(n,t,e){return n<t?t:n>e?e:n}function Bv(n,t,e,i,a,s,o,r){const c=Math.max(ga,e),l=Wa(r.minU??.08,0,1),d=Wa(r.maxU??.92,0,1);let u=Wa((n-t)/c,l,d);const h=r.bands;if(h&&h.length>0){let D=h[0],U=Math.abs(D-u);for(let C=1;C<h.length;C++){const T=Math.abs(h[C]-u);T<U&&(D=h[C],U=T)}u=Wa(D,l,d)}const f=Math.sqrt(a*a+s*s+o*o),m=f>ga?a/f:0,v=f>ga?s/f:0,g=f>ga?o/f:1,p=Math.sqrt(m*m+g*g),_=p>ga?m/p:0,x=p>ga?g/p:1,y=r.pitchGain??.85,S=Wa(r.maxTiltDeg??62,0,89)*Bu,w=Math.max(0,-v);let E=Math.min(S,Wa(r.tiltDeg,0,89)*Bu+w*y);const R=u*c,b=Math.min(R,c-R),M=Math.atan(Math.max(0,b*.9)/Math.max(ga,i));E=Math.min(E,M);const P=Math.tan(E),I=1/Math.sqrt(1+P*P);return{u,theta:E,nx:_*P*I,ny:I,nz:x*P*I,ax:x,ay:0,az:-_}}function Hv(n,t,e,i,a,s,o){const r=e*i,c=1/Math.max(ga,s),l=Math.max(1,Math.floor(t)),d=[];for(let u=0;u<l;u++){const h=u/l*Math.PI*2,f=Math.cos(h)*n,m=Math.sin(h)*n;d.push(Wa(r-(a*f+o*m)*c,0,i))}return d}function Gv(n){return!n||n.length===0?[]:n.map(t=>({id:t.id,kind:t.kind,x:t.x,y:t.y,z:t.z,height:t.height,radius:t.radius,tiltDeg:t.tiltDeg??18,pitchGain:t.pitchGain??.85,maxTiltDeg:t.maxTiltDeg??62,fallSec:t.fallSec??.9,bands:t.bands?[...t.bands]:[],color:t.color??"#8a6b4a",cutColor:t.cutColor??"#e8c9a0",broken:0,cutU:1,theta:0,nx:0,ny:1,nz:0,ax:0,ay:0,az:-1,fall:0,brokenAt:0}))}function Mm(n,t,e,i,a,s,o){const r=Bv(i,t.y,t.height,t.radius,a,s,o,{tiltDeg:t.tiltDeg,bands:t.bands,pitchGain:t.pitchGain,maxTiltDeg:t.maxTiltDeg});t.broken=1,t.cutU=r.u,t.theta=r.theta,t.nx=r.nx,t.ny=r.ny,t.nz=r.nz,t.ax=r.ax,t.ay=r.ay,t.az=r.az,t.fall=0,t.brokenAt=n.time,n.events.push({type:"break",tick:n.tick,x:t.x,y:t.y+r.u*t.height,z:t.z,value:e})}function Xv(n,t,e,i,a,s){const o=n.destructibles;if(!o)return!1;for(let r=0;r<o.length;r++){const c=o[r];if(!(c.id!==t||c.broken!==0))return Mm(n,c,r,e,i,a,s),!0}return!1}function Vv(n,t,e){const i=n.destructibles;if(!i||i.length===0||!n.modules.destructibles)return;const a=e.breakHits??[],s=a.length>0?Zp(n):null;if(!!s&&(s.active||s.slamRadius>0)&&s)for(let r=0;r<a.length;r++){const c=a[r];let l=-1;for(let u=0;u<i.length;u++)if(i[u].id===c.id){l=u;break}if(l<0)continue;const d=i[l];d.broken===0&&Mm(n,d,l,c.y,c.dx,c.dy,c.dz)}for(let r=0;r<i.length;r++){const c=i[r];if(c.broken===0)continue;const l=1-Math.exp(-t*3/Math.max(.1,c.fallSec));c.fall+=(Ov-c.fall)*l}}function _m(n){const t=n.destructibles;if(t)for(let e=0;e<t.length;e++){const i=t[e];i.broken=0,i.cutU=1,i.theta=0,i.nx=0,i.ny=1,i.nz=0,i.ax=0,i.ay=0,i.az=-1,i.fall=0,i.brokenAt=0}}function Wv(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function Yv(n,t){const e=yx(t);return{tick:0,time:0,rngState:2654435769,config:n,boxes:e,gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:lm(1),playerLink:Tc(),arrows:[],arrowSeq:0,abilities:gx(),skills:px(n),impulse:{x:0,z:0},targeting:bv(),turnInPlace:Kg(),playerHurt:Yp(),hitCount:0,dash:{...uv(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...nm(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Wv(),dummies:qx(n.dummies),dummyAttackCount:0,grass:zv(n,t,e,t.grid),destructibles:Gv(t.destructibles),events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0,grass:!0,destructibles:!0}}}function $v(n){mv(n),pm(n),om(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=rh,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,em(n),sm(n),mm(n),im(n),rc(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,Nv(n),_m(n),n.events.length=0}function Hu(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){$v(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?wv(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),Ix(n,t,e),n.modules.combat&&Vx(n,t,e),n.modules.dash&&pv(n,t,e),n.modules.movement&&xv(n,t,e),n.modules.gaze&&Ev(n,t,e),n.modules.orientation&&ex(n,t,e),tx(n,t,e),n.modules.dummies&&rv(n,t,e),Xg(n,t),Cx(n,t),n.modules.abilities&&xx(n,t,e),n.modules.combat&&Ax(n,t),n.modules.dummies&&(qg(n,t),n.modules.separation&&(vv(n),Mv(n))),Uv(n,t),Vv(n,t,e),n.modules.camera?vx(n):im(n),n}const bm=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],Gu=1e-9;function Zv(n,t,e){return n<t?t:n>e?e:n}function Sm(n){return Zv(Number.isFinite(n)?n:0,0,1)}function wm(n,t){const e=Sm(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function jv(){const n={};for(const t of bm)n[t]=0;return n}function qv(n,t){const e=jv(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=Sm(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+Gu;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],c=r.t-o.t,l=c>Gu?(a-o.t)/c:0,d=wm(o.ease??"linear",l);for(const u of bm){const h=o.pose[u]??r.pose[u]??0,f=r.pose[u]??o.pose[u]??0;e[u]=h+(f-h)*d}return e}function Kv(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=wm(i,t/a);return e.turns*Math.PI*2*s}function Ia(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function Jv(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=r&&l<c;){const d=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Hu(n,r,d),o&&o(),t-=r,l++}return l>=c&&(t=0),l},singleStep(e){Hu(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function Wi(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function Oe(n,t,e){return n+(t-n)*e}function Qv(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function Xu(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:Qv(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function ty(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function ey(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:Oe(n.ch.x,t.ch.x,i),y:Oe(n.ch.y,t.ch.y,i),z:Oe(n.ch.z,t.ch.z,i)},facing:Wi(n.ch.facing,t.ch.facing,i),moveYaw:Wi(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:Wi(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:Wi(n.ch.headYaw,t.ch.headYaw,i),headPitch:Oe(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:Oe(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:Wi(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:Oe(n.ch.stride,t.ch.stride,i),velocity:{x:Oe(n.ch.vx,t.ch.vx,i),y:Oe(n.ch.vy,t.ch.vy,i),z:Oe(n.ch.vz,t.ch.vz,i)}},s={attackProgress:Oe(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:Oe(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:Oe(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,Oe(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:Oe(n.hurt.timer,t.hurt.timer,i),knockX:Oe(n.hurt.knockX,t.hurt.knockX,i),knockZ:Oe(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((c,l)=>{const d=n.dm[l];return d?{position:{x:Oe(d.x,c.x,i),y:Oe(d.y,c.y,i),z:Oe(d.z,c.z,i)},facing:Wi(d.facing,c.facing,i),bodyYaw:Wi(d.bodyYaw,c.bodyYaw,i),headYaw:Wi(d.headYaw,c.headYaw,i),gaitPhase:Wi(d.gaitPhase,c.gaitPhase,i),stride:Oe(d.stride,c.stride,i),attackProgress:Oe(d.attackProgress,c.attackProgress,i),velocity:{x:Oe(d.vx,c.vx,i),y:Oe(d.vy,c.vy,i),z:Oe(d.vz,c.vz,i)}}:null});return{time:Oe(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:Oe(n.dash.timer,t.dash.timer,i)},turn:{progress:Oe(n.turn.progress,t.turn.progress,i)},link:{progress:Oe(n.link.progress,t.link.progress,i)},dummies:r}}function ny(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const Em={slopPx:12,longPressMs:450,doubleTapMs:280};function iy(n,t,e=Em.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function za(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function ay(n=Em){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,c){if(t.has(s))return null;for(const l of t.values())if(l.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:c,dragging:!1,longFired:!1}),za(a,"press",0,0,0,1)},move(a,s,o,r){const c=i(a);if(!c)return null;c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY;return!c.dragging&&Math.hypot(l,d)>=n.slopPx?(c.dragging=!0,za(c.button,"drag",l,d,r-c.startedAt,1)):null},end(a,s,o,r){const c=i(a);if(!c)return null;t.delete(a),c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY,u=r-c.startedAt,h=Math.hypot(l,d);if(c.dragging||c.longFired||h>=n.slopPx)return za(c.button,"release",l,d,u,1);const f=e.get(c.button);return f!==void 0&&r-f.at<=n.doubleTapMs&&Math.hypot(s-f.x,o-f.y)<=n.slopPx*2?(e.delete(c.button),za(c.button,"doubleTap",l,d,u,2)):(e.set(c.button,{at:r,x:s,y:o}),za(c.button,"tap",l,d,u,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),za(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,za(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const il=.001,sy=18;function dd(n,t,e){return n<t?t:n>e?e:n}function hd(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function oy(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function ry(n,t,e,i,a=sy){const s=oy(t);if(!s)return{state:hd(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,d=c;if(!Number.isFinite(o)||o<il)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<il?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<il)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const u=o/n.lastDist,h=Math.max(0,Number.isFinite(e)?e:1),f=Number.isFinite(u)&&u>0?Math.pow(u,h):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:dd(Number.isFinite(f)?f:1,l,d),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Vu(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?dd(r,a,s):dd(n,a,s)}function cy(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function ly(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const al=["jump","sprint","reset","attack","skill2"],dy=8,hy=16,sl=10,Wu=14,Yu=140,uy=18,fy=16,py=400,my=1.0001;function jr(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function gy(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&jr(e)}function xy(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,c=0,l=0,d=0,u=0,h=0,f=-1,m=0,v=null,g=-1,p=0,_=0,x=0,y=0,S=!1,w=0,E=1,R=0,b=null,M=0,P=0,I=!1,D=null,U=null,C=0,T=0,O=0,G=0,$=!1,at=!0,mt=-1;const xt=ay({slopPx:Wu,longPressMs:450,doubleTapMs:350});let Pt=[],q=null;const k=new Set;function Y(Z){Z&&Pt.push(Z)}const tt=new Map;let ut=hd(),st=!1,wt=1;function Zt(){const Z=Array.from(tt.values()),J=a(),gt=ry(ut,Z,J.pinchGain,J.maxStepRatio,uy);if(ut=gt.state,st=gt.pinching,gt.scale!==1&&(wt*=gt.scale),gt.started||gt.armedNow)b=null,I=!0,D=null;else if(gt.ended&&o===null&&Z.length===1){const bt=Z[0];o=bt.id,r=bt.x,c=bt.y,l=0,d=0,u=bt.x,h=bt.y,S=!1,w=0,E=1,R=0,performance.now(),b=null,I=!0,D=null}}const j={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},V={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let B=0,zt=0;const kt={},yt=new Set,_t=[];function K(){for(const Z of al)kt[Z]!==void 0&&(kt[Z]=void 0),Q(Z);xt.reset(),k.clear(),tt.clear(),ut=hd(),st=!1,o=null,l=0,d=0,u=0,h=0,S=!1,w=0,E=1,R=0,p=0,_=0,x=0,y=0,v=null,g=-1,b=null,I=!1,D=null,U=null,mt=-1,O=0,G=0,$=!1,at=!0}const lt=()=>{document.hidden&&K()},L=Z=>{if(Z.clientX===0&&Z.clientY===0){m++;return}if(jr(Z.target)||gy(Z.clientX,Z.clientY)){k.add(Z.pointerId);return}if(k.delete(Z.pointerId),tt.set(Z.pointerId,{id:Z.pointerId,x:Z.clientX,y:Z.clientY}),o===null&&!st){v=null,g=-1,o=Z.pointerId,r=Z.clientX,c=Z.clientY,l=0,d=0,u=Z.clientX,h=Z.clientY,performance.now();const J=Number.isFinite(Z.screenX)&&Number.isFinite(Z.screenY)&&(Z.screenX!==0||Z.screenY!==0);S=J,w=0,E=1,R=0,p=J?Z.screenX:0,_=J?Z.screenY:0,x=p,y=_,b=Z.pointerId,M=Z.clientX,P=Z.clientY,I=!1}Zt()},A=Z=>{if(Z.pointerId===U&&(Z.pointerType==="mouse"&&Z.buttons===0||Z.clientX===0&&Z.clientY===0&&(C!==0||T!==0)||(at?(O=Z.clientX-C,G=Z.clientY-T):(C=Z.clientX,T=Z.clientY,at=!0,O=0,G=0))),Y(xt.move(Z.pointerId,Z.clientX,Z.clientY,performance.now())),!k.has(Z.pointerId)&&tt.has(Z.pointerId)&&(tt.set(Z.pointerId,{id:Z.pointerId,x:Z.clientX,y:Z.clientY}),Zt()),k.has(Z.pointerId)||Z.pointerId!==o)return;const J=performance.now();if(v===Z.pointerId&&J-g<150){m++;return}const gt=Z.clientX,bt=Z.clientY;if(gt===0&&bt===0&&(r!==0||c!==0)){m++;return}const Ft=gt-u,N=bt-h,Tt=Number.isFinite(Z.screenX)&&Number.isFinite(Z.screenY),X=Tt?Z.screenX:0,dt=Tt?Z.screenY:0,Dt=Tt&&(X!==0||dt!==0),Lt=X-x,qt=dt-y;if(S&&Dt){const Re=Math.hypot(Lt,qt),Ue=Math.hypot(Ft,N);if(Re>3){if(w=0,R<30&&Ue>6&&Lt*Ft+qt*N>.7*Re*Ue){const mn=Re/Ue;mn>.2&&mn<5&&(E+=(mn-E)*.3,R++)}}else Ue>12&&(w++,w>=2&&(S=!1))}const se=Math.hypot(Ft,N);if(!S){const Re=f<0?Number.POSITIVE_INFINITY:J-f,Ue=Dt?Math.hypot(Lt,qt):1/0;se>28&&(Re<200||Ue<se*.4)&&(r+=Ft,c+=N,m++)}u=gt,h=bt,x=X,y=dt,Z.pointerId===b&&Math.hypot(Z.clientX-M,Z.clientY-P)>dy&&(I=!0);let ue,ne;S&&Dt?(ue=(X-p)/E,ne=(dt-_)/E):(ue=gt-r,ne=bt-c);const Se=Math.hypot(ue,ne),ke=s();Se>ke&&(ue*=ke/Se,ne*=ke/Se);const Ae=Math.hypot(l,d),dn=Math.hypot(ue,ne);if(Ae>10&&dn>10){const Re=Math.abs(Math.atan2(l*ne-d*ue,l*ue+d*ne)),Ue=Math.max(Ae,dn)*Re,mn=Math.max(Math.hypot(Ft,N),Math.hypot(Lt,qt)/Math.max(.2,E));if(Re>.6&&mn<Math.max(6,Ue*.5)){m++;return}}l=ue,d=ne};function Q(Z){if(!j[Z])return;j[Z]=!1,Z==="attack"&&(V.attackReleased=!0);const J=document.getElementById(`btn-${Z}`);J==null||J.classList.remove("is-down")}function ht(){o!==null&&(v=o,g=performance.now(),o=null,l=0,d=0,u=0,h=0,S=!1,w=0,E=1,R=0,p=0,_=0,x=0,y=0)}const ft=Z=>{const J=tt.delete(Z.pointerId),gt=k.delete(Z.pointerId);J&&Zt(),Z.pointerId===U&&(U=null,$?mt=performance.now():(O=0,G=0,mt=-1)),Y(xt.end(Z.pointerId,Z.clientX,Z.clientY,performance.now()));for(const Ot of al)kt[Ot]===Z.pointerId&&(kt[Ot]=void 0,Q(Ot));const bt=!J&&!gt&&tt.size<=1&&o!==null;(Z.pointerId===o||tt.size===0||bt)&&ht(),!gt&&Z.pointerId===b&&(!I&&!jr(Z.target)&&(D={x:Z.clientX,y:Z.clientY}),b=null)};for(const Z of al){const J=document.getElementById(`btn-${Z}`);if(!J)continue;const gt=Z==="attack"||Z==="skill2",bt=N=>{if(N.preventDefault(),kt[Z]===void 0){kt[Z]=N.pointerId,j[Z]=!0,Z==="jump"&&(V.jump=!0),Z==="reset"&&(V.reset=!0),Z==="sprint"&&(V.sprintPressed=!0),Z==="attack"&&(V.attackPressed=!0),Z==="skill2"&&(V.skill2=!0),J.classList.add("is-down"),Y(xt.begin(Z,N.pointerId,N.clientX,N.clientY,performance.now()));try{J.setPointerCapture(N.pointerId)}catch{}gt&&(U=N.pointerId,C=N.clientX,T=N.clientY,at=!(N.clientX===0&&N.clientY===0),O=0,G=0,$=!1,mt=-1)}},Ot=N=>{kt[Z]===N.pointerId&&(kt[Z]=void 0,Q(Z),Y(xt.end(N.pointerId,N.clientX,N.clientY,performance.now())))},Ft=N=>{kt[Z]===N.pointerId&&(kt[Z]=void 0,Q(Z),Y(xt.cancel(N.pointerId,performance.now())))};J.addEventListener("pointerdown",bt),J.addEventListener("pointerup",Ot),J.addEventListener("pointercancel",Ft),_t.push(()=>{J.removeEventListener("pointerdown",bt),J.removeEventListener("pointerup",Ot),J.removeEventListener("pointercancel",Ft)})}const rt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const Z of rt){const J=gt=>{gt.preventDefault(),B=Number(Z.dataset.weapon)||0};Z.addEventListener("pointerdown",J),_t.push(()=>Z.removeEventListener("pointerdown",J))}const It=Z=>{const J=Z.key.toLowerCase();if((J===" "||J.startsWith("arrow"))&&Z.preventDefault(),yt.has(J))return;yt.add(J),J===" "&&(V.jump=!0),J==="r"&&(V.reset=!0),J==="shift"&&(V.sprintPressed=!0),J==="j"&&(V.attackPressed=!0),J==="k"&&(V.skill2=!0),J>="1"&&J<="5"&&(B=Number(J)),J>="6"&&J<="9"&&(zt=Number(J)-5);const gt=Math.max(my,a().keyStep||1.12);(J==="="||J==="+")&&(wt*=gt),(J==="-"||J==="_")&&(wt/=gt)},Ct=Z=>{const J=Z.key.toLowerCase();yt.has(J)&&(yt.delete(J),J==="j"&&(V.attackReleased=!0))},Mt=Z=>{if(jr(Z.target))return;Z.preventDefault();const J=Z.deltaMode===1?Z.deltaY*fy:Z.deltaMode===2?Z.deltaY*py:Z.deltaY;wt*=cy(J,a().wheelStep)},Xt=Z=>{Z.preventDefault()},pt=()=>{f=performance.now()};window.addEventListener("resize",pt),window.addEventListener("orientationchange",pt);const Nt=typeof window<"u"?window.visualViewport:null;return Nt&&(Nt.addEventListener("resize",pt),Nt.addEventListener("scroll",pt)),window.addEventListener("pointerdown",L),window.addEventListener("pointermove",A),window.addEventListener("pointerup",ft),window.addEventListener("pointercancel",ft),window.addEventListener("blur",K),document.addEventListener("visibilitychange",lt),window.addEventListener("keydown",It),window.addEventListener("keyup",Ct),window.addEventListener("wheel",Mt,{passive:!1}),window.addEventListener("gesturestart",Xt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:c,x:u,y:h,dx:u-r,dy:h-c,radius:s(),badMoves:m,screenOk:S,originSX:p,originSY:_,screenX:x,screenY:y,scale:E}},peekAim(){const Z=performance.now(),J=Math.hypot(O,G),gt=U!==null||mt>=0&&Z-mt<Yu;if(!(gt&&$&&J>=sl))return{active:!1,holding:gt,x:0,z:0,dx:O,dy:G};const Ot=i(),Ft=O/J,N=G/J,Tt=Ot.rightX*Ft+Ot.forwardX*-N,X=Ot.rightZ*Ft+Ot.forwardZ*-N,dt=Math.hypot(Tt,X)||1;return{active:!0,holding:gt,x:Tt/dt,z:X/dt,dx:O,dy:G}},sample(){var Xn;const Z=s();let J=o!==null?Math.max(-1,Math.min(1,l/Z)):0,gt=o!==null?Math.max(-1,Math.min(1,d/Z)):0,bt=0,Ot=0;(yt.has("a")||yt.has("arrowleft"))&&(bt-=1),(yt.has("d")||yt.has("arrowright"))&&(bt+=1),(yt.has("w")||yt.has("arrowup"))&&(Ot-=1),(yt.has("s")||yt.has("arrowdown"))&&(Ot+=1),J+=bt,gt+=Ot;let Ft=Math.hypot(J,gt);Ft>1&&(J/=Ft,gt/=Ft,Ft=1);const N=J,Tt=gt;Ft<e&&(J=0,gt=0);const X=i();let dt=X.rightX*J+X.forwardX*-gt,Dt=X.rightZ*J+X.forwardZ*-gt;const Lt=Math.hypot(dt,Dt);Lt>1&&(dt/=Lt,Dt/=Lt);const qt=performance.now();Y(xt.poll(qt));const se=Math.hypot(O,G);U!==null&&(se>=hy?$=!0:se<sl&&($=!1));const ue=U!==null||mt>=0&&qt-mt<Yu,ne=ue&&$&&se>=sl;let Se=0,ke=0;if(ne){const hn=O/se,kn=G/se,En=X.rightX*hn+X.forwardX*-kn,In=X.rightZ*hn+X.forwardZ*-kn,zn=Math.hypot(En,In)||1;Se=En/zn,ke=In/zn}!ue&&U===null&&(O=0,G=0,mt=-1,$=!1);const Ae=D;D=null;const dn=wt;wt=1;const Re={moveX:dt,moveZ:Dt,jumpPressed:V.jump,sprintHeld:j.sprint||yt.has("shift"),sprintPressed:V.sprintPressed,resetPressed:V.reset,attackPressed:V.attackPressed,attackHeld:j.attack||yt.has("j"),attackReleased:V.attackReleased,skill2Pressed:V.skill2,weaponSlot:B,dummyClickId:zt,aimX:Se,aimZ:ke,aimActive:ne};V.jump=!1,V.reset=!1,V.sprintPressed=!1,V.attackPressed=!1,V.attackReleased=!1,V.skill2=!1,B=0,zt=0;const Ue=Pt.map(hn=>iy(hn,X,Wu));Pt=[],Ue.length>0&&(q=Ue[Ue.length-1]);const mn=o!==null?"pointer":yt.size>0?"keyboard":"idle";return{intents:Re,stickX:J,stickY:gt,stickRawX:N,stickRawY:Tt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:c,stickPxX:u,stickPxY:h,stickBad:m,stickScreenOk:S,stickOriginSX:p,stickOriginSY:_,stickScreenX:x,stickScreenY:y,stickScale:E,stickVpTop:((Xn=ly())==null?void 0:Xn.top)??0,stickVpAge:f<0?-1:Math.round(performance.now()-f),aimDX:O,aimDY:G,source:mn,tap:Ae,zoomScale:dn,gestures:Ue,lastGesture:q}},dispose(){window.removeEventListener("pointerdown",L),window.removeEventListener("pointermove",A),window.removeEventListener("pointerup",ft),window.removeEventListener("pointercancel",ft),window.removeEventListener("blur",K),document.removeEventListener("visibilitychange",lt),window.removeEventListener("keydown",It),window.removeEventListener("keyup",Ct),window.removeEventListener("wheel",Mt),window.removeEventListener("resize",pt),window.removeEventListener("orientationchange",pt),Nt&&(Nt.removeEventListener("resize",pt),Nt.removeEventListener("scroll",pt)),window.removeEventListener("gesturestart",Xt),xt.reset();for(const Z of _t)Z()}}}const hc=1,uc=2,fc=4,Tm=8,pc=16,Io=32,Am=64,Rm=128,vy=[[hc,"atk"],[uc,"dash"],[fc,"link"],[Tm,"air"],[pc,"hurt"],[Io,"aim"],[Am,"spr"],[Rm,"chan"]];function ms(n){if(n===0)return"-";const t=vy.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const yy=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],My=0,_y=15,ol=19,by=21,Sy=22,wy=23,Ey=24,Di={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Zn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,yi=n=>Math.round(n*180/Math.PI*10)/10,rl=Math.PI*2;function go(n){let t=n%rl;return t>Math.PI&&(t-=rl),t<-Math.PI&&(t+=rl),t}function Ty(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=hc),n.dash.phase!=="idle"&&(e|=uc),n.playerLink.phase!=="idle"&&(e|=fc),n.character.grounded||(e|=Tm),n.playerHurt.type!=="none"&&(e|=pc),t.intents.aimActive&&(e|=Io),n.character.sprinting&&(e|=Am),n.abilities.channeling&&(e|=Rm),e}function Ay(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Ry(n){const t={sampleHz:n.sampleHz??Di.sampleHz,sampleCapacity:n.sampleCapacity??Di.sampleCapacity,eventCapacity:n.eventCapacity??Di.eventCapacity,anomalyCapacity:n.anomalyCapacity??Di.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??Di.dirJumpDeg,aimDropDeg:n.aimDropDeg??Di.aimDropDeg,freezeMs:n.freezeMs??Di.freezeMs,freezeSpeed:n.freezeSpeed??Di.freezeSpeed,stickLostMs:n.stickLostMs??Di.stickLostMs,spikeMs:n.spikeMs??Di.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,c=-1,l=-1e9,d=null,u=0,h=0,f="",m=-1,v=-1,g=-1,p=0,_=-1e9,x=-1,y={},S=null,w=0,E=0,R=0,b=0;function M(C,T){const O=1/t.sampleHz,G=C[My];G-l<O-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(C),l=G)}function P(C,T,O,G,$,at){const mt=y[C]??-1e9;if(T-mt<1.2)return;if(y[C]=T,C==="frameSpike"){let Pt=0;for(const q of s)q.kind==="frameSpike"&&Pt++;if(Pt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let xt=i.slice(-7);at&&(xt.length===0||xt[xt.length-1]!==at)&&(xt=[...xt.slice(-6),at]),s.push({kind:C,t:Zn(T),tick:O,ms:Math.round(G),detail:$,ctx:xt}),C==="dirJump"?o.dirJumps++:C==="aimDrop"?o.aimDrops++:C==="moveFreeze"?o.freezes++:C==="stickLost"?o.stickLosts++:C==="stickJump"?o.stickJumps++:C==="stickBad"?o.stickBads++:C==="stickDrift"&&o.stickDrifts++}function I(C,T,O,G){a.length>=t.eventCapacity&&a.shift(),a.push({t:Zn(O),tick:G,k:C,d:T})}function D(C){switch(C.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":_=C.tick;break}}function U(){const C=o,T=C.wallMs/1e3,O=C.gestures,G=xt=>Object.entries(O).filter(([Pt])=>Pt.endsWith(`.${xt}`)).reduce((Pt,[,q])=>Pt+q,0),$=[];if($.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),$.push(`运行 ${T.toFixed(1)}s / ${C.frames} 帧 · ${C.fps.toFixed(1)}fps · 最大 ${C.dtMax.toFixed(0)}ms · 尖峰 ${C.spikes} · 步 ${C.steps}`),$.push(`摇杆活跃 ${T>0?Math.round(C.stickActiveMs/1e3/T*100):0}% · 手势 按下 ${G("press")}（单击 ${G("tap")} / 双击 ${G("doubleTap")} / 拖拽 ${G("drag")} / 长按 ${G("longPress")} / 打断 ${G("cancel")} / 拖放 ${G("release")}）`),$.push(`攻击 ${C.attacks}(中${C.hits}) · 受击 ${C.hurts} · 派生 ${C.links}(中${C.linkHits}) · 翻滚 ${C.rolls} 闪现 ${C.blinks} · 跳 ${C.jumps} · 复位 ${C.resets}`),$.push(`法杖 引导${C.channels} 飞弹${C.bolts} 电环${C.rings} · 弓蓄力${C.bowCharges} · 当前武器 ${f||"-"}`),$.push(`异常 ${C.dirJumps+C.aimDrops+C.freezes+C.stickLosts+C.stickJumps+C.stickBads+C.stickDrifts}（dir ${C.dirJumps} / aim ${C.aimDrops} / freeze ${C.freezes} / stick ${C.stickLosts} / stickJump ${C.stickJumps} / 坏指针 ${C.stickBads} / 坐标漂移 ${C.stickDrifts}） · 掉帧尖峰 ${C.spikes}`+(C.inTurns>0?` · 输入转向 ${C.inTurns} 次（最大 ${C.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const xt of s.slice(-6)){$.push(`· ${xt.kind} @t${xt.t.toFixed(2)} tick${xt.tick} ${xt.ms>0?`${xt.ms}ms `:""}${xt.detail}`);const Pt=xt.ctx.map(k=>String(k[_y])).join(" "),q=xt.ctx.map(k=>k[ol]===""||k[ol]==null?".":String(k[ol])).join(" ");if($.push(`  yaw ${Pt}`),$.push(`  in  ${q}`),xt.kind==="stickJump"||xt.kind==="stickBad"||xt.kind==="stickLost"){const k=xt.ctx.map(tt=>`${tt[by]},${tt[Sy]}`).join(" "),Y=xt.ctx.map(tt=>`${tt[wy]},${tt[Ey]}`).join(" ");$.push(`  o   ${k}`),$.push(`  p   ${Y}`)}}if(a.length>0){$.push("最近事件：");for(const xt of a.slice(-12))$.push(`  ${xt.t.toFixed(2)} ${xt.k} ${xt.d}`.trimEnd())}const at=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",mt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return $.push(`摇杆坐标源 ${at}${mt}`),$.push(`UA ${e.ua}`),$.join(`
`)}return{sample(C,T,O,G=0){o.frames++,T.stickHeld&&(T.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=G,o.wallMs+=O,O>o.dtMax&&(o.dtMax=O),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=C.time;const $=C.time;if(c<0&&(c=$),R=$,b=C.tick,!r)return;const at=C.character,mt=Math.hypot(T.stickX,T.stickY),xt=Math.hypot(at.velocity.x,at.velocity.z);f=C.combat.weapon;const Pt=Ty(C,T),q=at.facing,Y=Math.hypot(T.intents.moveX,T.intents.moveZ)>.05?Math.atan2(T.intents.moveX,T.intents.moveZ):null;mt>.2&&(o.stickActiveMs+=O);const tt=[Zn($),C.tick,Math.round(O*10)/10,Zn(T.stickX),Zn(T.stickY),Zn(T.stickRawX),Zn(T.stickRawY),T.stickHeld?1:0,T.source.slice(0,8),Zn(T.intents.moveX),Zn(T.intents.moveZ),Zn(at.position.x),Zn(at.position.z),Zn(at.velocity.x),Zn(at.velocity.z),yi(q),yi(at.bodyYaw),Pt,Zn(at.stride),Y===null?"":yi(Y),T.stickId===null?"":T.stickId,Math.round(T.stickOriginX),Math.round(T.stickOriginY),Math.round(T.stickPxX),Math.round(T.stickPxY),T.stickBad,Math.round(T.stickVpTop),Math.round(T.stickOriginSX),Math.round(T.stickOriginSY),Math.round(T.stickScreenX),Math.round(T.stickScreenY),T.stickScreenOk?1:0,Math.round(T.stickScale*100)/100];M(tt);const ut=$*1e3<x;if(O>t.spikeMs&&!ut&&$-c>.6&&(o.spikes++,P("frameSpike",$,C.tick,O,`dt ${O.toFixed(0)}ms fl=${ms(Pt)}`,tt)),d!==null&&!ut){const K=Math.abs(yi(go(q-d))),lt=Math.abs(yi(go(at.moveYaw-u))),L=(h|Pt)&(hc|uc|fc|pc)|Pt&Io,A=Y===null?null:Math.abs(yi(go(q-Y))),Q=Y===null||d===null?null:Math.abs(yi(go(d-Y))),ht=A!==null&&Q!==null&&A<Q-.5,ft=(h&Io)!==0&&(Pt&Io)===0&&Y===null,rt=A!==null&&(A<=12||ht);K>t.aimDropDeg&&ft?P("aimDrop",$,C.tick,0,`${K.toFixed(0)}° @aim→none stick(${T.stickX.toFixed(2)},${T.stickY.toFixed(2)}) aim(${T.aimDX.toFixed(0)},${T.aimDY.toFixed(0)}) fl=${ms(Pt)}`,tt):K>t.dirJumpDeg&&L===0&&!ft&&(rt?(o.inTurns++,K>o.inTurnMax&&(o.inTurnMax=K)):P("dirJump",$,C.tick,0,`${K.toFixed(0)}° res${A===null?" 无输入":`${A.toFixed(0)}°`} yaw ${yi(d)}→${yi(q)} in ${Y===null?".":yi(Y)}° mvΔ${lt.toFixed(0)}° aim(${T.aimDX.toFixed(0)},${T.aimDY.toFixed(0)}) fl=${ms(h)}→${ms(Pt)}`,tt))}const st=(Pt&(hc|uc|fc|pc))!==0,wt=C.tick-_<30;mt>.35&&xt<t.freezeSpeed&&!st&&!wt?(m<0&&(m=$),$-m>=t.freezeMs/1e3&&$>=v&&(P("moveFreeze",$,C.tick,($-m)*1e3,`stick(${T.stickX.toFixed(2)},${T.stickY.toFixed(2)}) v${xt.toFixed(2)} ${T.source} fl=${ms(Pt)}`,tt),v=$+1.5,m=-1)):m=-1,T.stickHeld?(mt>p&&(p=mt),p>.35&&mt<.06?(g<0&&(g=$),$-g>=t.stickLostMs/1e3&&(P("stickLost",$,C.tick,($-g)*1e3,`raw(${T.stickRawX.toFixed(2)},${T.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${ms(Pt)}`,tt),g=-1,p=0)):g=-1):(p=0,g=-1);const Zt=T.stickScale>.2&&T.stickScale<5?T.stickScale:1,j=T.stickScreenOk,V=j?T.stickScreenX/Zt:T.stickPxX,B=j?T.stickScreenY/Zt:T.stickPxY,zt=j?T.stickOriginSX/Zt:T.stickOriginX,kt=j?T.stickOriginSY/Zt:T.stickOriginY,yt=V-zt,_t=B-kt;if(T.stickHeld&&T.stickId!==null){const K=S;if(K&&K.held&&K.id===T.stickId){const lt=Math.hypot(K.dx,K.dy),L=Math.hypot(yt,_t),A=Math.max(lt,L),Q=Math.hypot(V-K.cx,B-K.cy),ht=Math.abs(yi(go(Math.atan2(_t,yt)-Math.atan2(K.dy,K.dx)))),ft=A*ht*Math.PI/180,rt=Math.hypot(zt-K.ox,kt-K.oy);if(A>18&&ht>35&&Q<Math.max(5,ft*.35)&&P("stickJump",$,C.tick,0,`Δ${ht.toFixed(0)}° 手指只动${Q.toFixed(0)}px(弧长应${ft.toFixed(0)}px) o(${Math.round(K.ox)},${Math.round(K.oy)})→(${Math.round(zt)},${Math.round(kt)}) 原点位移${rt.toFixed(0)}px p(${Math.round(V)},${Math.round(B)}) raw(${Math.round(yt)},${Math.round(_t)}) id${T.stickId} ${j?"src=屏幕":"src=client"}`,tt),j&&K.screenOk){const It=Math.hypot(T.stickPxX-K.x,T.stickPxY-K.y),Ct=Math.hypot((T.stickScreenX-K.sx)/Zt,(T.stickScreenY-K.sy)/Zt);w+=It-Ct,Math.abs(w)>20&&(P("stickDrift",$,C.tick,0,`client 相对屏幕漂移 ${w>0?"+":""}${w.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(T.stickPxX)},${Math.round(T.stickPxY)}) screen(${Math.round(T.stickScreenX)},${Math.round(T.stickScreenY)})`,tt),w=0)}}S={id:T.stickId,ox:zt,oy:kt,cx:V,cy:B,x:T.stickPxX,y:T.stickPxY,sx:T.stickScreenX,sy:T.stickScreenY,dx:yt,dy:_t,held:!0,screenOk:j}}else S=null,w=0;if(T.stickBad>E){const K=T.stickBad-E;P("stickBad",$,C.tick,0,`拦截 ${K} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${T.stickBad}）o(${Math.round(T.stickOriginX)},${Math.round(T.stickOriginY)}) p(${Math.round(T.stickPxX)},${Math.round(T.stickPxY)}) id${T.stickId??"-"}`,tt)}E=T.stickBad,d=q,u=at.moveYaw,h=Pt},event(C,T){const O=Ay(C);D(C),r&&(C.type==="dash-ready"||C.type==="combo-reset"||C.type==="stepUp"||I(C.type,O,T,C.tick))},gesture(C){const T=`${C.button}.${C.kind}`;o.gestures[T]=(o.gestures[T]??0)+1,r&&(C.kind==="longPress"||C.kind==="doubleTap"||C.kind==="drag"||C.kind==="cancel")&&I(`g:${C.kind}`,`${C.button} ${C.heldMs.toFixed(0)}ms d${C.distance.toFixed(0)}px ${C.angleDeg.toFixed(0)}°`,R,b)},suspend(C){x=R*1e3+C,m=-1,g=-1},setEnabled(C){r=C,C||(d=null,S=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,y={},l=-1e9,d=null,h=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,w=0,S=null,E=0;for(const C of Object.keys(o.gestures))delete o.gestures[C]},status(){const C=o.simS,T=s.some(O=>C-O.t<8&&(O.kind==="dirJump"||O.kind==="aimDrop"||O.kind==="moveFreeze"||O.kind==="stickLost"||O.kind==="stickJump"||O.kind==="stickBad"||O.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:T,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:yy,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:U}}const Py="dash",Cy=6,Ly="冲刺标尺",Dy="沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",ky=[2,4],Iy="square",zy=4.8,Fy="#bfe8ff",Uy="v9s.15 历史固定工位",Ny={dx:0,dz:4.6},Oy={dx:-2.8,dz:9.2},By={id:Py,index:Cy,name:Ly,hint:Dy,span:ky,shape:Iy,radius:zy,color:Fy,owner:Uy,spawn:Ny,label:Oy},Hy="gait",Gy=7,Xy="侧后方步态",Vy="面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",Wy=[2,2],Yy="circle",$y=3.2,Zy="#6fc9a0",jy="v9s.15 历史固定工位",qy={dx:0,dz:2.6},Ky={dx:0,dz:-2.5},Jy=[{dx:0,dz:0,mode:"follow"}],Qy={id:Hy,index:Gy,name:Xy,hint:Vy,span:Wy,shape:Yy,radius:$y,color:Zy,owner:jy,spawn:qy,label:Ky,dummies:Jy},tM="hub",eM=1,nM="中央 8 向",iM="推杆走 8 个方向 · 松手看停步收相 / 转身踏步",aM="origin",sM=[2,2],oM="circle",rM=3.6,cM="#8fe7ff",lM="v9s.15 历史固定工位",dM={dx:0,dz:0},hM={dx:0,dz:-3.1},uM={minCellX:-4,maxCellX:4,minCellZ:0,maxCellZ:6,density:1,clearMarginCells:2},fM=[{id:"crate-hub",dx:2.5,dz:-2.5,width:1.1,depth:1.1,height:.8}],pM=[{dx:-3.4,dz:3.2,fighter:!0,weapon:"sword-shield"},{dx:3.4,dz:3.2,fighter:!0,weapon:"dual-swords"},{dx:0,dz:4.2,fighter:!0,weapon:"greatsword"}],mM={id:tM,index:eM,name:nM,hint:iM,pin:aM,span:sM,shape:oM,radius:rM,color:cM,owner:lM,spawn:dM,label:hM,grass:uM,obstacles:fM,dummies:pM},gM="meter",xM=5,vM="进度弧",yM="弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",MM=[2,2],_M="circle",bM=3.2,SM="#b48cff",wM="v9s.15 历史固定工位",EM={dx:0,dz:2.8},TM={dx:0,dz:1.3},AM=[{id:"pillar-sw",dx:-4,dz:3.6,width:1.2,depth:1.2,height:2.2}],RM=[{dx:0,dz:-1.4,mode:"idle"}],PM={id:gM,index:xM,name:vM,hint:yM,span:MM,shape:_M,radius:bM,color:SM,owner:wM,spawn:EM,label:TM,obstacles:AM,dummies:RM},CM="rings",LM=2,DM="环状态色阶",kM="同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",IM=[2,2],zM="circle",FM=3.4,UM="#ffc85a",NM="v9s.15 历史固定工位",OM={dx:0,dz:3},BM={dx:0,dz:-2.7},HM=[{dx:-1.6,dz:-.15,mode:"idle"},{dx:0,dz:-.15,mode:"keep-distance"},{dx:1.6,dz:-.15,mode:"attack"}],GM={id:CM,index:LM,name:DM,hint:kM,span:IM,shape:zM,radius:FM,color:UM,owner:NM,spawn:OM,label:BM,dummies:HM},XM="sparring-demo",VM="陪练试验场",WM="动态拼合示范地块 · 点「生成 4 人」就地摆出假人 + 持械陪练，用完点「清除」回基线",YM=[2,2],$M=2,ZM="#7fd8c0",jM="v9s.43 动态拼合示范（auto 地块，不写世界坐标，由 assemblePlots 自动分配槽位）",qM={minCellX:-9,maxCellX:9,minCellZ:-9,maxCellZ:9,density:.72},KM={label:"生成 4 人",dummies:2,modes:["idle","keep-distance"],fighters:2,ringRadius:1.5,startDeg:-90},JM={id:XM,name:VM,hint:WM,span:YM,radius:$M,color:ZM,owner:jM,grass:qM,testSpawn:KM},QM="terrain",t_=4,e_="地形 / 门洞",n_="宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",i_=[2,2],a_="square",s_=4.8,o_="#7fb8d8",r_="v9s.15 历史固定工位",c_={dx:0,dz:4.6},l_={dx:0,dz:-4.2},d_=[{id:"stair-1",dx:-2.3,dz:1.8,width:2.4,depth:.9,height:.2},{id:"stair-2",dx:-2.3,dz:.9,width:2.4,depth:.9,height:.4},{id:"stair-3",dx:-2.3,dz:0,width:2.4,depth:.9,height:.6},{id:"stair-4",dx:-2.3,dz:-.9,width:2.4,depth:.9,height:.8},{id:"plateau",dx:-2.3,dz:-2.2,width:2.4,depth:1.6,height:.8},{id:"block-060",dx:2.5,dz:1.4,width:1.4,depth:1.4,height:.6},{id:"block-090",dx:2.5,dz:-.5,width:1.4,depth:1.4,height:.9},{id:"block-120",dx:2.5,dz:-2.4,width:1.4,depth:1.4,height:1.2}],h_=[{id:"gate-wide",dx:-2.3,dz:3.1,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",dx:2.5,dz:3.1,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],u_={id:QM,index:t_,name:e_,hint:n_,span:i_,shape:a_,radius:s_,color:o_,owner:r_,spawn:c_,label:l_,steps:d_,doorways:h_},f_="windup",p_=3,m_="起手预警",g_="走进 1.6m：脚下红弧填满 = 命中帧",x_=[2,2],v_="circle",y_=3.2,M_="#ff5a4a",__="v9s.15 历史固定工位",b_={dx:0,dz:3},S_={dx:0,dz:-2.6},w_=[{dx:0,dz:-.2,mode:"attack"}],E_={id:f_,index:p_,name:m_,hint:g_,span:x_,shape:v_,radius:y_,color:M_,owner:__,spawn:b_,label:S_,dummies:w_},T_="x-destructibles",A_="可破坏物件 · 斜切断口",R_="站高台打=高处断，平地打=低处断；切口朝挥刀方向斜切 · 瓶罐只断预设带",P_=[2,2],C_=2,L_="#e8a05c",D_="可破坏物件（auto 地块，只写相对偏移；id 不带版本代号，由合并闸门统一领号；排在 sparring-demo 之后不抢槽位）",k_=[{id:"pole-a",kind:"pole",dx:-1.25,dz:-1,height:2.4,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-b",kind:"pole",dx:0,dz:-1,height:2.8,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-c",kind:"pole",dx:1.25,dz:-1,height:2,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"jar-a",kind:"jar",dx:-.7,dz:-1.8,height:.9,radius:.28,tiltDeg:14,bands:[.35,.62],color:"#6f8fb8",cutColor:"#d8e4f0"},{id:"jar-b",kind:"jar",dx:.7,dz:-1.8,height:.8,radius:.26,tiltDeg:14,bands:[.4,.68],color:"#b87f6f",cutColor:"#f0d8c8"}],I_={id:T_,name:A_,hint:R_,span:P_,radius:C_,color:L_,owner:D_,destructibles:k_},z_={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!1,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:0,spawn:[],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,strafePeriod:5.2,strafeDuty:.34,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4,fighters:{weapons:["sword-shield","dual-swords","greatsword"],spawn:[],initialModes:["spar","spar","spar"],moveSpeed:2.1,attackInterval:3.4,attackRangeScale:.9,knockbackScale:.6,leashRadius:7,comboCount:0,comboGap:0}},grass:{enabled:!0,footprintCells:2,minHeightCells:1,maxHeightCells:2,bendRadius:.85,maxBendRad:.95,bendRate:18,recoverRate:3.2,stumpRatio:.34,regrow:!0,regrowSec:6,bucketCells:4,wind:{enabled:!0,dirDeg:28,speed:1.35,amplitude:.19,wavelength:4.2,secondWave:{wavelength:1.7,amplitude:.055,speedScale:1.55},gust:{periodSec:7.5,depth:.35},jitter:.16,shadeAmount:.26}}},F_={ground:{size:32,thickness:.4},steps:[],doorways:[],obstacles:[],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},grass:{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:.72,bladesPerPatch:[3,6],avoidMargin:.45,seed:20261108}},U_={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}},spider:{name:"蜘蛛",rig:"spider",height:.7,radius:.42,moveSpeed:2.6},elder:{name:"驼背老人",height:1.46,radius:.26,moveSpeed:3.6,voxel:{headSize:.38,bodyWidth:.44,bodyHeight:.34,limbThickness:.125,legLength:.74,armLength:.68,style:{hunch:.32,kneeSink:.05,headScale:.82,balding:!0,hairColor:"#f7f7f7",beard:.46,beardColor:"#fbfbfb",spaulder:!0,breath:!0}},colors:{body:"#6b7a8f",head:"#f0d3ae",limb:"#5a6878",shoe:"#2a2f38"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132,dirFlipSec:.16,hipYawTrackRateDeg:240,hipYawBackRateDeg:150},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e",fighterColors:[{body:"#c85a4a",limb:"#8d3a30",head:"#f0c9a0"},{body:"#c9a03c",limb:"#8a6b22",head:"#f0d6a0"},{body:"#7d6ec4",limb:"#4f4488",head:"#e6d2b0"}]},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95},grass:{enabled:!0,bladeWidth:.13,segmentHeight:.5,palette:["#3f7d4f","#569a5c","#6fb56a","#8ccb78","#a9dc86"],stumpColor:"#6b7a48",maxInstances:6e3,debris:{max:220,life:.85,color:"#a9dc86"}}},N_={core:z_,scene:F_,view:U_};function gh(n){return JSON.parse(JSON.stringify(n))}const xh=N_,O_=Object.assign({"../config/plots/dash.json":By,"../config/plots/gait.json":Qy,"../config/plots/hub.json":mM,"../config/plots/meter.json":PM,"../config/plots/rings.json":GM,"../config/plots/sparring-demo.json":JM,"../config/plots/terrain.json":u_,"../config/plots/windup.json":E_,"../config/plots/x-destructibles.json":I_}),B_=Object.values(O_).filter(n=>n&&typeof n.id=="string"&&n.id.length>0),Pm=dh,Qi=Mx(B_,Pm),$u=Qi.plots,Cm=gh(xh.core),qr=gh(xh.scene),Sn=gh(xh.view);_x(Cm,qr,Qi,Pm);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Ni{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),Ni.nextNameID=Ni.nextNameID||0,this.$name.id=`lil-gui-name-${++Ni.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class H_ extends Ni{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function ud(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const G_={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:ud,toHexString:ud},Yo={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},X_={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Yo.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Yo.toHexString(a)}},V_={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Yo.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Yo.toHexString(a)}},W_=[G_,Yo,X_,V_];function Y_(n){return W_.find(t=>t.match(n))}class $_ extends Ni{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Y_(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=ud(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class cl extends Ni{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Z_ extends Ni{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let _=parseFloat(this.$input.value);isNaN(_)||(this._stepExplicit&&(_=this._snap(_)),this.setValue(this._clamp(_)))},i=_=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+_),this.$input.value=this.getValue())},a=_=>{_.key==="Enter"&&this.$input.blur(),_.code==="ArrowUp"&&(_.preventDefault(),i(this._step*this._arrowKeyMultiplier(_))),_.code==="ArrowDown"&&(_.preventDefault(),i(this._step*this._arrowKeyMultiplier(_)*-1))},s=_=>{this._inputFocused&&(_.preventDefault(),i(this._step*this._normalizeMouseWheel(_)))};let o=!1,r,c,l,d,u;const h=5,f=_=>{r=_.clientX,c=l=_.clientY,o=!0,d=this.getValue(),u=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",v)},m=_=>{if(o){const x=_.clientX-r,y=_.clientY-c;Math.abs(y)>h?(_.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>h&&v()}if(!o){const x=_.clientY-l;u-=x*this._step*this._arrowKeyMultiplier(_),d+u>this._max?u=this._max-d:d+u<this._min&&(u=this._min-d),this._snapClampSetValue(d+u)}l=_.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",v)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,_,x,y,S)=>(p-_)/(x-_)*(S-y)+y,e=p=>{const _=this.$slider.getBoundingClientRect();let x=t(p,_.left,_.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",h))},u=p=>{if(o){const _=p.touches[0].clientX-r,x=p.touches[0].clientY-c;Math.abs(_)>Math.abs(x)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h))}else p.preventDefault(),e(p.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h)},f=this._callOnFinishChange.bind(this),m=400;let v;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(f,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class j_ extends Ni{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class q_ extends Ni{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const K_=`.lil-gui {
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
}`;function J_(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Zu=!1;class mc{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!Zu&&r&&(J_(K_),Zu=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new j_(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new Z_(this,t,e,i,a,s);case"boolean":return new H_(this,t,e);case"string":return new q_(this,t,e);case"function":return new cl(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new $_(this,t,e,i)}addFolder(t){const e=new mc({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof cl||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof cl)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Q_(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new mc({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new mc({title:"实验台 · 调试面板"}),o=n.config,r=[],c=[],l=Mt=>{const Xt=s.addFolder(Mt);return c.push(Xt),Xt},d=(Mt,Xt)=>{const pt=Mt.addFolder(Xt);return r.push(pt),pt},u=l("模拟 / 显示");u.add(e,"timeScale",0,3,.05).name("时间缩放"),u.add(e,"paused").name("暂停"),u.add({step:i.singleStep},"step").name("单步 (1 tick)"),u.add({reset:i.reset},"reset").name("复位全部"),u.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),u.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),u.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),u.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const h=d(u,"模块开关");h.add(n.modules,"movement").name("movement"),h.add(n.modules,"combat").name("combat"),h.add(n.modules,"links").name("links"),h.add(n.modules,"orientation").name("orientation"),h.add(n.modules,"turnInPlace").name("turnInPlace"),h.add(n.modules,"targeting").name("targeting"),h.add(n.modules,"hits").name("hits"),h.add(n.modules,"separation").name("separation"),h.add(n.modules,"dash").name("dash"),h.add(n.modules,"camera").name("camera"),h.add(n.modules,"dummies").name("dummies"),h.add(n.modules,"abilities").name("abilities");const f=l("移动 / 输入"),m=d(f,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const v=d(f,"摇杆 / 输入");v.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),v.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=d(f,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const _=o.separation,x=d(f,"角色间分离 / 挤压阻力");x.add(_,"iterations",1,8,1).name("迭代次数"),x.add(_,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(_.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(_.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(_.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const y=l("动作 / 步态"),S=d(y,"程序化步态");S.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),S.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),S.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),S.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),S.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),S.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),S.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),S.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),S.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),S.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),S.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),S.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),S.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),S.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),S.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),S.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)"),S.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)"),S.add(t.gait,"dirFlipSec",0,.4,.01).name("换向融合时长 (s)"),S.add(t.gait,"hipYawTrackRateDeg",0,600,10).name("下盘目标转速上限 (°/s)"),S.add(t.gait,"hipYawBackRateDeg",0,600,10).name("└ 后退相位上限 (°/s)");const w=d(y,"停步 / 收相 / 惯性");w.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),w.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),w.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),w.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),w.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),w.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),w.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),w.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),w.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),w.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),w.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),w.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const E=d(y,"足部 IK"),R=t.ik;E.add(R,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),E.add(R,"weight",0,1,.01).name("钉地权重"),E.add(R,"attackScale",0,1,.01).name("攻击时权重倍率"),E.add(R,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const b=d(y,"惯性倾斜 / 盆骨"),M=t.lean;b.add(M,"accelGain",0,.1,.002).name("前后加速度增益"),b.add(M,"turnGain",0,.2,.005).name("绕圈侧倾增益"),b.add(M,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),b.add(M,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),b.add(M,"smoothing",1,30,1).name("倾斜平滑速率"),b.add(M,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),b.add(M,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),b.add(M,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),b.add(M,"crouchSmoothing",1,30,1).name("下沉平滑速率");const P=o.orientation,I=d(y,"朝向 / 接敌注视 / 原地转身");I.add(P,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),I.add(P,"headTurnRate",.5,40,.5).name("头部转向速率"),I.add(P,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),I.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),I.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),I.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const D=o.gaze;I.add(D,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),I.add(D,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),I.add(D,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),I.add(D,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),I.add(D,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),I.add(D,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),I.add(D,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),I.add(D,"headPitchRate",.5,20,.5).name("头部俯仰速率"),I.add(D,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),I.add(D,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),I.add(D,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const U=o.turnInPlace;I.add(U,"enabled").name("启用原地转身 (关=纯插值)"),I.add(U,"triggerDeg",20,180,5).name("触发夹角 (°)"),I.add(U,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),I.add(U,"settleDeg",0,60,1).name("转身保留余角 (°)"),I.add(U,"durationSec",.1,1.5,.02).name("转身时长 (s)"),I.add(U,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),I.add(U,"inputDeadZone",0,.5,.01).name("起步输入死区"),I.add(U,"armSec",0,.5,.01).name("触发防抖 (s)"),I.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("停步偏差消化窗口"),I.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),I.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),I.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),I.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),I.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const C=l("战斗 / 命中"),T=o.combat,O=d(C,"连击 / 武器时序"),G=O.add(n.combat,"weapon",Ea).name("当前武器");O.add(T,"comboWindow",.1,2,.05).name("连击窗口 (s)"),O.add(T,"settle",0,.8,.01).name("段间停顿 (s)"),O.add(T,"attackMoveScale",0,1,.01).name("攻击时移动比例"),O.add(T,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),O.add(T,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),O.add(T,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),O.add(T,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),O.add(T,"cancelWindow",0,1,.01).name("取消窗口 (s)"),O.add(T,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),O.add(T,"autoCombo").name("按住自动连击"),O.add(T.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),O.add(T.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),O.add(T.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),O.add(T.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率"),O.add(T.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),O.add(T.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),O.add(T.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),O.add(T.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),O.add(T.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),O.add(T.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),O.add(T.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),O.add(T.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),O.add(T.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度");const $=o.abilities;O.add($.arcane,"perWave",1,8,1).name("每波飞弹数"),O.add($.arcane,"waves",1,12,1).name("每次引导波数"),O.add($.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),O.add($.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),O.add($.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),O.add($.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),O.add($.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),O.add($.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),O.add($.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),O.add($.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),O.add($.arcane,"speed",3,24,.5).name("飞弹速度"),O.add($.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),O.add($.ring,"radius",.5,5,.1).name("电环半径"),O.add($.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),O.add($.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const at=o.hits.hitstopWarp;if(at){const Mt=d(C,"卡肉节奏（接触瓦片）");Mt.add(at,"enabled").name("瓦片开（关=硬冻结）"),Mt.add(at,"holdRate",0,.4,.01).name("保持期速率"),Mt.add(at,"release",.005,.2,.005).name("释放时长 (s)"),Mt.add(at,"payback",1,2.5,.05).name("偿还倍率"),Mt.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),Mt.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),Mt.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const mt=o.hits,xt=d(C,"命中 / 受击 / 击退");xt.add(mt,"arcDeg",10,120,5).name("命中扇区半角 (°)"),xt.add(mt,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),xt.add(mt,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),xt.add(mt,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),xt.add(mt.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),xt.add(mt.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),xt.add(mt,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),xt.add(mt,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Pt={get enabled(){return!mt.noDamageToPlayer},set enabled(Mt){mt.noDamageToPlayer=!Mt}};xt.add(Pt,"enabled").name("玩家受击击退");const q=d(C,"受击分层"),k=t.hurt;q.add(k,"enabled").name("启用分层受击 (关=旧版对照)"),q.add(k,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),q.add(k,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),q.add(k,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),q.add(k,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),q.add(k,"upperShiftScale",0,1,.01).name("上身位移缩放"),q.add(k,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),q.add(k.hitHeight,"light",0,1,.01).name("轻击命中部位"),q.add(k.hitHeight,"heavy",0,1,.01).name("重击命中部位"),q.add(k.hitHeight,"knock",0,1,.01).name("击退命中部位"),q.add(k,"leanLight",0,1.5,.01).name("轻击力度"),q.add(k,"leanHeavy",0,1.5,.01).name("重击力度"),q.add(k,"leanKnock",0,1.5,.01).name("击退力度"),q.add(k,"flashStrength",0,2,.05).name("受击闪光强度");for(const{name:Mt,p:Xt}of[{name:"打腹 (abdomen)",p:k.abdomen},{name:"打肩 (shoulder)",p:k.shoulder}]){const pt=d(q,Mt);pt.add(Xt,"upperPitch",0,2,.01).name("上身前后倾斜"),pt.add(Xt,"upperRoll",0,2,.01).name("上身侧倾"),pt.add(Xt,"upperYaw",0,1.5,.01).name("肩部扭转"),pt.add(Xt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),pt.add(Xt,"shift",0,.8,.01).name("身体反应位移"),pt.add(Xt,"drop",0,.4,.01).name("整体下沉"),pt.add(Xt,"back",0,.4,.01).name("屁股向后"),pt.add(Xt,"knee",0,1.6,.01).name("屈膝"),pt.add(Xt,"hip",0,1,.01).name("髋前倾"),pt.add(Xt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)")}const Y=d(C,"派生招"),tt=o.links;Y.add(tt,"enabled").name("总开关 (false=旧连击)"),Y.add(tt.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),Y.add(tt.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),Y.add(tt.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),Y.add(tt,"sharedCooldown",0,3,.05).name("共享 CD (s)"),Y.add(tt,"triggerWhileSprinting").name("长跑中可直接触发"),Y.add(tt.search,"range",1,14,.1).name("索敌距离 (m)"),Y.add(tt.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),Y.add(tt.search,"stopDistance",0,3,.05).name("停住距离 (m)");const ut=tt.moves["sword-shield"];ut&&(Y.add(ut,"enabled").name("剑盾盾击"),Y.add(ut,"distance",0,8,.1).name("冲锋极限 (m)"),Y.add(ut,"windup",0,.5,.01).name("前摇 (s)"),Y.add(ut,"active",0,.8,.01).name("冲锋 / 命中 (s)"),Y.add(ut,"recovery",0,.8,.01).name("收势 (s)"),Y.add(ut.hit,"radius",0,4,.05).name("命中半径 (m)"),Y.add(ut.hit,"width",0,2,.05).name("扫掠半径 (m)"),Y.add(ut.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),Y.add(ut.hit,"duration",0,1.5,.01).name("僵直 (s)"));const st=o.targeting,wt=d(C,"目标辅助");wt.add(st,"targetAssist").name("启用目标辅助"),wt.add(st,"range",1,14,.5).name("锁定范围 (m)"),wt.add(st,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),wt.add(st,"frontBias",0,4,.1).name("朝向加权"),wt.add(st,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),wt.add(st,"maxLungeScale",1,3,.1).name("前冲最大放大");const Zt=l("表现 / 特效"),j=d(Zt,"挥击幅度 / 刀光"),V=t.animation.swing;j.add(V,"enabled").name("挥击身体幅度 开"),j.add(V,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),j.add(V,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),j.add(V,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),j.add(V,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),j.add(V,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),j.add(V,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),j.add(V,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),j.add(V.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const B=t.weaponTrail;j.add(B,"enabled").name("挥击刀光 开"),j.add(B,"life",.04,.4,.01).name("刀光残留 (s)"),j.add(B,"intensity",0,1.5,.05).name("刀光亮度"),j.add(B,"minStep",.005,.1,.005).name("采样最小位移 (m)"),j.add(t.hitstop,"enabled").name("命中卡肉 / 震屏");const zt=d(Zt,"夸张化 / 四肢伸缩"),kt=t.animation.stretch;zt.add(kt,"enabled").name("四肢伸缩 开"),zt.add(kt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),zt.add(kt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),zt.add(kt,"impactSquash",0,.5,.01).name("命中挤压量"),zt.add(kt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),zt.add(kt,"torsoGain",0,1,.05).name("躯干跟随比例"),zt.add(kt,"volumeExp",0,1.5,.05).name("体积补偿指数");const yt=d(Zt,"武器握持 / 腕部"),_t=t.weaponWrist;yt.add(_t,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),yt.add(_t,"lag",0,.08,.002).name("臂速 → 腕滞后"),yt.add(_t,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),yt.add(_t,"rate",4,50,1).name("腕部跟随速率 (1/s)"),yt.add(_t,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),yt.add(_t,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const K=t.weaponMount;yt.add(K,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),yt.add(K,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),yt.add(K,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),yt.add(K,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),yt.add(K,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),yt.add(K,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),yt.add(K,"swordPitchDeg",0,90,1).name("剑前倾角"),yt.add(K,"swordYawDeg",0,45,1).name("剑外张角"),yt.add(K,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),yt.add(K,"staffPitchDeg",0,60,1).name("法杖前倾角");const lt=l("假人 / 混战"),L=o.dummies,A=d(lt,"普通假人 AI");A.add(L,"moveSpeed",.5,8,.1).name("移动速度"),A.add(L,"wanderRadius",.5,8,.1).name("游走半径"),A.add(L,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),A.add(L,"followStopDistance",.3,5,.1).name("跟随停距"),A.add(L,"keepDistance",1,10,.1).name("保持距离"),A.add(L,"keepDeadZone",.1,2,.05).name("保持死区"),A.add(L,"attackRange",.5,5,.1).name("攻击距离"),A.add(L,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),A.add(L,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const Q=L.fighters;if(Q){const Mt=d(lt,"持械陪练（剑盾 / 双刀 / 大剑）");Mt.add(Q,"moveSpeed",.5,6,.1).name("移动速度"),Mt.add(Q,"attackInterval",.5,8,.1).name("攻击间隔 (s)"),Mt.add(Q,"attackRangeScale",.5,1.2,.02).name("起手距离 / 武器 reach"),Mt.add(Q,"knockbackScale",0,2,.05).name("击退比例"),Mt.add(Q,"leashRadius",0,14,.5).name("牵引半径 (m)"),Mt.add(Q,"comboCount",0,3,1).name("连击段数 (0=随武器)"),Mt.add(Q,"comboGap",0,.6,.01).name("段间缝隙 (s, 0=用全局)");const Xt=()=>n.dummies.find(Nt=>Nt.weapon!==null),pt={get mode(){var Nt;return((Nt=Xt())==null?void 0:Nt.mode)??"spar"},set mode(Nt){i.setFighterMode(Nt)}};Mt.add(pt,"mode",Vp).name("陪练行为（全部）")}const ht=l("相机"),ft=d(ht,"基础");ft.add(t.camera,"pitchDeg",20,80,1).name("俯角"),ft.add(t.camera,"yawDeg",-180,180,1).name("方位角"),ft.add(t.camera,"distance",6,35,.5).name("距离"),ft.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),ft.add(t.camera,"fov",25,90,1).name("FOV");const rt=o.camera,It=d(ht,"智能构图");It.add(rt,"radius",2,18,.5).name("威胁评估半径 (m)"),It.add(rt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),It.add(rt,"saturation",.5,8,.1).name("威胁归一化饱和"),It.add(rt,"pushIn",0,.5,.01).name("无威胁推进比例"),It.add(rt,"maxPullback",0,1,.02).name("最大拉远比例"),It.add(rt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),It.add(rt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),It.add(rt,"framingBias",0,1,.05).name("威胁质心平移系数"),It.add(rt,"attackBoost",0,2,.05).name("挥砍中额外加权"),It.add(rt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),It.add(rt.modeWeight,"spar",0,3,.05).name("陪练模式威胁倍率"),It.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Ct=d(ht,"缩放");return Ct.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),Ct.add(t.zoom,"max",1,4,.05).name("最大拉远上限"),Ct.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),Ct.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),Ct.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),Ct.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),Ct.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),Ct.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(Mt=>Mt.close()),c.forEach(Mt=>Mt.close()),s.close(),{gui:s,refreshWeapon:()=>G.updateDisplay()}}function tb(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function eb(n,t){return n.find(e=>e.id===t)??null}function ju(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,c)=>r.index-c.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function nb({stations:n,plots:t=[],world:e,view:i,container:a,onResetZoom:s,onPlotTest:o,onClearTestUnits:r}){var R;const c=a??document.getElementById("lab-panel");let l=null,d=null;const u=new Map,h=document.createElement("div");h.id="lab-toast",h.setAttribute("aria-live","polite"),document.body.appendChild(h);let f=0;function m(b){h.textContent=`${b.index} · ${b.name} — ${b.hint}`,h.style.borderColor=b.color,h.classList.add("is-on"),window.clearTimeout(f),f=window.setTimeout(()=>h.classList.remove("is-on"),5e3)}function v(){return tb(n,e.character.position.x,e.character.position.z)}function g(){const b=v(),M=(b==null?void 0:b.id)??null;if(M===l)return;const P=l!==null;l=M;for(const[I,D]of u)D.classList.toggle("is-active",I===M);d&&(d.textContent=b?`${b.index} · ${b.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",d.style.color=b?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),b?m(b):P&&h.classList.remove("is-on")}function p(b){const M=typeof b=="number"?n.find(P=>P.index===b)??null:eb(n,b);return M?(gv(e,M.spawnX,M.spawnZ),e.camera.centroidX=M.spawnX,e.camera.centroidZ=M.spawnZ,i.snapCamera(M.spawnX,e.character.position.y,M.spawnZ),g(),!0):!1}function _(){pm(e)}function x(b){return p(b.id),o?o(b):0}function y(){return r?r():0}function S(b){const M=typeof b=="number"?t.find(P=>P.index===b):t.find(P=>P.id===b);return M&&M.testSpawn?x(M):0}const w=t.filter(b=>b.testSpawn),E=b=>{var M,P;return(((M=b.testSpawn)==null?void 0:M.dummies)??0)+(((P=b.testSpawn)==null?void 0:P.fighters)??0)};if(c){c.textContent="";const b=document.createElement("div");b.className="lab-head",b.textContent="测试工位";const M=document.createElement("span");M.className="lab-tip",M.textContent="[ / ] 切换",b.appendChild(M),c.appendChild(b);for(const D of[...n].sort((U,C)=>U.index-C.index)){const U=document.createElement("button");U.type="button",U.className="lab-row",U.dataset.station=D.id,U.dataset.uiButton="",U.style.setProperty("--lab-color",D.color),U.setAttribute("aria-label",`传送到工位 ${D.index}：${D.name}`);const C=document.createElement("span");C.className="lab-idx",C.textContent=String(D.index);const T=document.createElement("span");T.className="lab-name",T.textContent=D.name,U.append(C,T),U.addEventListener("pointerdown",O=>{O.preventDefault(),O.stopPropagation(),p(D.id)}),c.appendChild(U),u.set(D.id,U)}if(d=document.createElement("div"),d.className="lab-hint",c.appendChild(d),w.length>0){const D=document.createElement("div");D.className="lab-head lab-subhead",D.textContent="地块测试";const U=document.createElement("span");U.className="lab-tip",U.textContent="就地生成",D.appendChild(U),c.appendChild(D);for(const C of w){const T=document.createElement("div");T.className="lab-row lab-test-row",T.dataset.plot=C.id;const O=document.createElement("span");O.className="lab-name",O.textContent=C.name;const G=document.createElement("button");G.type="button",G.className="lab-btn lab-test",G.dataset.uiButton="",G.dataset.plotTest=C.id,G.textContent=((R=C.testSpawn)==null?void 0:R.label)??`生成 ${E(C)} 人`,G.setAttribute("aria-label",`在${C.name}就地生成 ${E(C)} 个测试单位`),G.addEventListener("pointerdown",$=>{$.preventDefault(),$.stopPropagation(),x(C)}),T.append(O,G),c.appendChild(T)}}const P=document.createElement("div");P.className="lab-foot";const I=document.createElement("button");if(I.type="button",I.className="lab-btn",I.dataset.uiButton="",I.textContent="召回假人",I.setAttribute("aria-label","召回全部假人回到各自工位"),I.addEventListener("pointerdown",D=>{D.preventDefault(),D.stopPropagation(),_()}),P.appendChild(I),w.length>0){const D=document.createElement("button");D.type="button",D.className="lab-btn",D.dataset.uiButton="",D.dataset.clearTestUnits="",D.textContent="清除测试单位",D.setAttribute("aria-label","清除所有由地块测试按钮生成的假人与陪练"),D.addEventListener("pointerdown",U=>{U.preventDefault(),U.stopPropagation(),y()}),P.appendChild(D)}if(s){const D=document.createElement("button");D.type="button",D.className="lab-btn",D.dataset.uiButton="",D.textContent="镜头归位",D.setAttribute("aria-label","把镜头缩放恢复到默认"),D.addEventListener("pointerdown",U=>{U.preventDefault(),U.stopPropagation(),s()}),P.appendChild(D)}c.appendChild(P)}return window.addEventListener("keydown",b=>{var M,P;if(!(b.metaKey||b.ctrlKey||b.altKey))if(b.key==="["){const I=ju(n,((M=v())==null?void 0:M.id)??l,-1);I&&p(I.id)}else if(b.key==="]"){const I=ju(n,((P=v())==null?void 0:P.id)??l,1);I&&p(I.id)}else b.key==="\\"&&_()}),g(),{goto:p,current:v,tick:g,recall:_,spawnAt:S,clearSpawned:y,element:c}}const ll=Math.PI*2,ki={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},ib=45,ab=50;function sb(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function xo(n,t,e){const i=sb(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function ob(n,t){return Math.atan2(n,-t)*180/Math.PI}function qu(n,t){return Math.abs(((n-t)%360+540)%360-180)}function ur(n){return(n%360+360)%360}const rb={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function cb(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),c=a.velocity,l=Math.hypot(c.x,c.z),d=o>.001?xo(s.moveX,s.moveZ,e):null,u=l>.15?xo(c.x,c.z,e):null,h=xo(Math.sin(a.facing),Math.cos(a.facing),e),f=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?xo(s.aimX,s.aimZ,e):null,m=n.targeting,v=m.hasTarget?xo(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=d!==null&&u!==null?qu(d,u):null,p=d!==null?qu(d,h):null,_=g!==null&&g>ib&&o>=.35&&l>=.4;return{inDeg:d,inLen:Math.min(1,o),rawDeg:r>.02?ob(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:u,speed:l,faceDeg:h,lockDeg:v,lockId:m.targetId,lockDist:m.targetDist,aimDeg:f,gapMove:g,gapFace:p,warnMove:_}}function Ku(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>ab&&(n.inLen>=.35||n.speed>=.4)}const Ju="harness.dirDebug";function lb(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(Ju)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),s&&(s.textContent=c?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(c)))}l();function d(x){if(c=x,!t)try{window.localStorage.setItem(Ju,x?"1":"0")}catch{}l()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),d(!c)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&d(!c)});const u=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;a.width=Math.round(h*u),a.height=Math.round(h*u);let f=rb,m=0,v="",g=8;function p(x){if(!r)return;const y=h,S=h,w=y/2,E=S/2,R=Math.min(y,S)/2-13;r.setTransform(u,0,0,u,0,0),r.clearRect(0,0,y,S),r.beginPath(),r.arc(w,E,R,0,ll),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":ki.ring,r.stroke(),r.strokeStyle=ki.grid,r.beginPath(),r.moveTo(w-R,E),r.lineTo(w+R,E),r.moveTo(w,E-R),r.lineTo(w,E+R),r.stroke();for(let I=0;I<8;I++){const D=I*Math.PI/4,U=w+Math.sin(D)*(R-3),C=E-Math.cos(D)*(R-3),T=w+Math.sin(D)*R,O=E-Math.cos(D)*R;r.beginPath(),r.moveTo(U,C),r.lineTo(T,O),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=ki.dead,r.beginPath(),r.arc(w,E,R*b,0,ll),r.stroke(),r.restore());const M=(I,D,U,C,T=!1,O=1)=>{const G=I*Math.PI/180,$=Math.sin(G),at=-Math.cos(G),mt=R*Math.max(.14,Math.min(1,D)),xt=w+$*R*.14,Pt=E+at*R*.14,q=w+$*mt,k=E+at*mt;if(r.save(),r.globalAlpha=O,r.strokeStyle=U,r.fillStyle=U,r.lineWidth=C,r.lineCap="round",T&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(xt,Pt),r.lineTo(q,k),r.stroke(),!T&&mt>R*.3){const Y=-at,tt=$,ut=5.2;r.beginPath(),r.moveTo(q+$*1.5,k+at*1.5),r.lineTo(q-$*ut+Y*ut*.72,k-at*ut+tt*ut*.72),r.lineTo(q-$*ut-Y*ut*.72,k-at*ut-tt*ut*.72),r.closePath(),r.fill()}r.restore()},P=(I,D)=>{const U=I*Math.PI/180,C=Math.sin(U),T=-Math.cos(U),O=-T,G=C,$=R+1.5,at=$+6.5;r.save(),r.fillStyle=D,r.strokeStyle=D,r.lineWidth=1,r.beginPath(),r.moveTo(w+C*at,E+T*at),r.lineTo(w+C*$+O*4,E+T*$+G*4),r.lineTo(w+C*$-O*4,E+T*$-G*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&M(x.lockDeg,1,ki.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&M(x.rawDeg,x.rawLen,ki.raw,1,!0,.9),x.aimDeg!==null&&M(x.aimDeg,1,ki.aim,1.6,!0,.95),M(x.faceDeg,1,ki.face,1.1,!0,.55),x.moveDeg!==null&&M(x.moveDeg,x.speed/Math.max(1,g),ki.move,5.5,!1,.8),x.inDeg!==null&&M(x.inDeg,x.inLen,ki.input,2.2),P(x.faceDeg,ki.face),r.beginPath(),r.arc(w,E,2.2,0,ll),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function _(x,y){const S=R=>R===null?"-":String(Math.round(ur(R)));o.in.textContent=`入 ${S(x.inDeg)}`,o.mv.textContent=`移 ${S(x.moveDeg)}`,o.fc.textContent=`面 ${S(x.faceDeg)}`;const w=R=>R===null?"-":`${Math.round(R)}°`,E=[`Δ入→移 ${w(x.gapMove)}`,`Δ入→面 ${w(x.gapFace)}`];x.speed>.05&&E.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&E.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&E.push("拖拽瞄准"),o.gap.textContent=E.join("  "),e.classList.toggle("is-warn",x.warnMove||Ku(x,y))}return{update(x,y,S){if(!c)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const w=cb(x,y,S,g);f=w;const E=x.combat.phase!=="idle";p(w);const R=performance.now(),b=`${w.inDeg}|${w.moveDeg}|${w.faceDeg}|${w.lockId}|${w.aimDeg}|${w.warnMove}|${w.speed.toFixed(1)}`;(R-m>90||b!==v)&&(m=R,v=b,_(w,E),e.dataset.in=w.inDeg===null?"":ur(w.inDeg).toFixed(1),e.dataset.mv=w.moveDeg===null?"":ur(w.moveDeg).toFixed(1),e.dataset.fc=ur(w.faceDeg).toFixed(1),e.dataset.warn=w.warnMove||Ku(w,E)?"1":"0")},setEnabled:d,toggle(){return d(!c),c},enabled:()=>c,last:()=>f}}const db=6,hb=480,Qu=240,tf=128,ub=18,fb=.05,ef=.16,pb=.02;function nf(n,t,e){if(!e)return"air";if(t<fb)return"both";const i=Math.sin(n);return i>ef?"L":i<-ef?"R":"both"}function af(n){const t=Math.PI*2;return(n%t+t)%t}function sf(n,t){const e=Math.PI*2;let i=t-n;return i-=Math.round(i/e)*e,n+i}const of={L:"#fbbf24",R:"#a78bfa",both:"rgba(148, 163, 184, 0.85)",air:"#38bdf8"},mb={L:"rgba(251, 191, 36, 0.13)",R:"rgba(167, 139, 250, 0.13)",both:"rgba(148, 163, 184, 0.09)",air:"rgba(56, 189, 248, 0.07)"},gb={L:"左踩",R:"右踩",both:"双踩",air:"腾空"};function xb(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1,phase:0,stance:"both",grounded:!0,moving:!1}}function vb(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function yb(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function Mb(n={}){const t=Math.max(1,n.windowS??db),e=Math.max(60,n.capacity??hb),i=Math.max(1,n.speedCap??ub),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv / 相位</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="128"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),c=s.querySelector("#motiondbg-graph"),l=s.querySelector("#motiondbg-read"),d=s.querySelector("#motiondbg-window"),u=s.querySelector("#motiondbg-dir");d.textContent=`${t.toFixed(1)}s`;const h=c.getContext("2d"),f=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(Qu*f),c.height=Math.round(tf*f);const m=lb({deadZone:n.deadZone,container:u,embedded:!0});let v=!1;function g(M){v=M,s.classList.toggle("is-off",!M),!a&&r&&(r.textContent=M?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(M)),r.setAttribute("aria-label",M?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",M=>{M.preventDefault(),M.stopPropagation(),g(!v)}),window.addEventListener("keydown",M=>{M.key.toLowerCase()==="v"&&!M.metaKey&&!M.ctrlKey&&g(!v)}));const p=[];let _=0,x=null,y=0,S=!1,w=-1,E={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1,phase:0,stance:"both"};function R(M){const P=M-t;let I=0;for(;I<p.length&&p[I].t<P;)I++;return p.slice(I)}function b(M,P){if(!h)return;const I=Qu,D=tf;h.setTransform(f,0,0,f,0,0),h.clearRect(0,0,I,D),h.fillStyle="rgba(8, 12, 17, 0.55)",h.fillRect(0,0,I,D);const U=4,C=4,T=I-U-C,O=9,G=44,$=58,at=20,mt=84,xt=38,Pt=P-t,q=j=>U+Math.max(0,Math.min(1,(j-Pt)/t))*T;for(let j=0;j<M.length;j++){if(!M[j].busy)continue;const V=q(M[j].t),B=j+1<M.length?q(M[j+1].t):V+2;h.fillStyle="rgba(251, 146, 60, 0.13)",h.fillRect(V,O,Math.max(2,B-V),G)}h.strokeStyle="rgba(150, 190, 220, 0.14)",h.lineWidth=1,h.beginPath();for(const j of[O,O+G/2,O+G])h.moveTo(U,j),h.lineTo(I-C,j);h.moveTo(U,$+at/2),h.lineTo(I-C,$+at/2);for(const j of[mt,mt+xt/2,mt+xt])h.moveTo(U,j),h.lineTo(I-C,j);h.stroke();const Y=Math.max(1,...M.map(j=>j.speed),...M.map(j=>j.drive))*1.15,tt=j=>O+G-j/Y*G;if(M.length>1){h.beginPath(),h.moveTo(q(M[0].t),tt(M[0].speed));for(let j=1;j<M.length;j++)h.lineTo(q(M[j].t),tt(M[j].speed));h.strokeStyle="#38bdf8",h.lineWidth=1.8,h.lineJoin="round",h.stroke(),h.lineTo(q(M[M.length-1].t),O+G),h.lineTo(q(M[0].t),O+G),h.closePath(),h.fillStyle="rgba(56, 189, 248, 0.14)",h.fill(),h.beginPath(),h.moveTo(q(M[0].t),tt(M[0].drive));for(let j=1;j<M.length;j++)h.lineTo(q(M[j].t),tt(M[j].drive));h.setLineDash([3,3]),h.strokeStyle="rgba(190, 205, 220, 0.6)",h.lineWidth=1.2,h.stroke(),h.setLineDash([])}let ut=.02;for(const j of M)ut=Math.max(ut,Math.abs(j.dv));ut*=1.1;const st=$+at/2,wt=at/2;for(const j of M){const V=Math.min(wt,Math.abs(j.dv)/ut*wt);h.fillStyle=j.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",h.fillRect(q(j.t)-.7,j.dv>=0?st-V:st,1.4,Math.max(.5,V))}const Zt=j=>mt+xt/2-j*(xt/2-1);for(let j=0;j<M.length;j++){const V=M[j].stance;if(V==="air")continue;const B=q(M[j].t),zt=j+1<M.length?q(M[j+1].t):B+2;h.fillStyle=mb[V],h.fillRect(B,mt,Math.max(1,zt-B),xt)}if(M.length>1){let j=q(M[0].t),V=Zt(Math.sin(M[0].phase));for(let zt=1;zt<M.length;zt++){const kt=M[zt-1],yt=M[zt],_t=q(kt.t),K=q(yt.t),lt=sf(kt.phase,yt.phase),L=Math.max(1,Math.min(16,Math.round((K-_t)/2)));for(let A=1;A<=L;A++){const Q=A/L,ht=kt.phase+(lt-kt.phase)*Q,ft=_t+(K-_t)*Q,rt=Zt(Math.sin(ht)),It=A===L?yt.stance:nf(ht,kt.moving?1:0,kt.grounded);h.beginPath(),h.moveTo(j,V),h.lineTo(ft,rt),h.strokeStyle=of[It],h.lineWidth=1.7,h.lineJoin="round",h.stroke(),j=ft,V=rt}}const B=M[M.length-1];h.beginPath(),h.arc(q(B.t)-1.5,Zt(Math.sin(B.phase)),2.1,0,Math.PI*2),h.fillStyle=of[B.stance],h.fill()}h.font="9px ui-monospace, monospace",h.fillStyle="rgba(190, 214, 234, 0.55)",h.textAlign="left",h.fillText(Y.toFixed(1),U+2,O+8),h.fillText("v",U+2,O+G-2),h.fillText("Δv",U+2,$+9),h.fillStyle="rgba(251, 191, 36, 0.75)",h.fillText("L",U+2,mt+8),h.fillStyle="rgba(167, 139, 250, 0.75)",h.fillText("R",U+2,mt+xt-2),h.textAlign="right",h.fillStyle="rgba(190, 214, 234, 0.55)",h.fillText("0",I-C-2,O+G-2),h.textAlign="left"}return{dirDebug:m,update(M,P,I){var q;const D=performance.now()/1e3,U=w<0?1/60:Math.max(1e-4,Math.min(.25,D-w));w=D;const C=M.character,T={x:C.position.x,z:C.position.z},O=Math.hypot(C.velocity.x,C.velocity.z),{speed:G,raw:$}=x?vb(x,T,U,i):{speed:0,raw:0},at=xb(_,G,U,D);at.drive=O,at.raw=$,at.busy=yb(M);const mt=((q=n.phaseSource)==null?void 0:q.call(n))??C.gaitPhase;at.phase=mt,at.grounded=C.grounded,at.moving=S&&Math.abs(sf(y,mt)-y)>pb,y=mt,S=!0,at.stance=nf(mt,at.moving?1:0,C.grounded),x=T,_=G,p.push(at),p.length>e&&p.shift();const xt=R(D);let Pt=0;for(const k of xt)Pt=Math.max(Pt,k.speed);if(E={speed:G,drive:O,raw:$,dv:at.dv,accel:at.accel,peak:Pt,samples:xt.length,windowS:t,busy:at.busy,phase:af(mt),stance:at.stance},m.update(M,P,I),v){b(xt,D);const k=at.dv>=0?"+":"";l.textContent=`v ${G.toFixed(2)} · 驱 ${O.toFixed(2)} · 峰 ${Pt.toFixed(2)} · Δv ${k}${at.dv.toFixed(3)} · ${xt.length} 帧
φ ${af(mt).toFixed(2)} · ${gb[at.stance]}`}},setEnabled:g,toggle(){return g(!v),v},enabled:()=>v,last:()=>({...E}),samples:()=>R(performance.now()/1e3).map(M=>({...M}))}}const _b=["剑盾","双剑","大剑","法杖","弓"],bb={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击",spar:"陪练"};function Sb(n){return{update(t,e,i,a,s,o,r=!1){const c=t.character,l=c.position,d=c.velocity,u=t.combat,h=t.events.length>0?t.events[t.events.length-1]:null,f=j=>j.toFixed(2),m=j=>(j*180/Math.PI).toFixed(0),v=_b[Ea.indexOf(u.weapon)]??u.weapon,g=Math.round(u.charge*10),p="|".repeat(g)+".".repeat(10-g),_=t.dash,x=_.phase==="active"&&_.duration>0?(1-_.timer/_.duration)*100:0,y=_.phase==="active"?`${_.kind}@${x.toFixed(0)}%`:`${_.kind} cd${f(_.cooldown)}`,S=a.intents.aimActive?`(${f(a.intents.aimX)},${f(a.intents.aimZ)})`:"-",w=d.x*Math.sin(c.bodyYaw)+d.z*Math.cos(c.bodyYaw),E=d.x*Math.cos(c.bodyYaw)-d.z*Math.sin(c.bodyYaw),R=Math.abs(w)+Math.abs(E)+1e-6,b=Math.round(Math.abs(E)/R*100),M=`strafe ${b}%${w<-.05?" back":""}`,P=t.camera,I=`threat ${(P.threat*100).toFixed(0)}%  dist×${f(P.distanceScale)}  off (${f(P.offsetX)},${f(P.offsetZ)})  pitch +${f(P.pitchDelta)}°  n=${P.threatCount}`,D=o?f(o.attackBlend):"-",U=o==null?void 0:o.attackWeights,C=U?`gw ${f(U.gaitScale)}  lw ${f(U.attackLegWeight)}  spd ${f(U.driveSpeed)}`:"-",T=U?`${f(U.gaitScale)}/${f(U.attackLegWeight)}`:"-",O=o?`${o.landing.kind} ${f(o.landing.pulse)} t${f(o.landing.remaining)} vy${f(o.landing.impactVy)}`:"-",G=o?`${o.landing.kind}/${f(o.landing.pulse)}`:"-",$=(o==null?void 0:o.zoom)!==void 0?`zoom ×${f(o.zoom)}`:"-",at=o==null?void 0:o.hurt,mt=at?`hurt ${t.playerHurt.type}  部位h${f(at.hitHeight)}  脉冲p${f(at.pulse)}  上身${f(at.upperShift)}  重心${f(at.comShift)}  后坐${f(at.pelvisBack)}  屈膝${f(at.knee)}`:"-",xt=at?`${f(at.hitHeight)}/${f(at.pulse)}/${f(at.knee)}`:"-",Pt=o==null?void 0:o.ik,q=Pt?`${Pt.active?"on":"off"} w${f(Pt.weight)} e${f(Pt.maxError)}`:"-",k=t.playerLink,Y=`link ${k.kind||"-"}  ${k.phase}  prog ${f(k.progress)}  win ${f(k.linkWindow)}s  cd ${f(k.cooldown)}s  hits ${k.hitIds.length}  travel ${f(k.travelled)}/${f(k.travel)}m  id ${k.id}`,tt=`${k.phase}/${k.kind||"-"}/w${f(k.linkWindow)}`,ut=a.lastGesture,st=ut?`${ut.button} ${ut.kind} ${ut.heldMs.toFixed(0)}ms d${ut.distance.toFixed(0)}px ${ut.angleDeg.toFixed(0)}° taps${ut.taps}`:"-",wt=t.dummies.map(j=>`${j.id}:${bb[j.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${v} ${u.phase} · lk ${k.phase}${k.kind?`/${k.kind}`:""} w${f(k.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${f(l.x)},${f(l.y)},${f(l.z)})  vel (${f(d.x)},${f(d.y)},${f(d.z)})`,`face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  st${b}%  stick(${f(a.stickX)},${f(a.stickY)}) ${a.source}  str${f(c.stride)}`,`weapon ${v}  ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}  dash ${y}  ab ${D}  gw/lw ${T}  land ${G}  ik ${q}`,`aim ${S}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${xt}`,`dummies ${wt}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${f(P.distanceScale)}  ${$}  lk ${tt}`,`event ${h?`${h.type} ${f(h.value)}`:"-"}  scale ${f(s.timeScale)}${s.paused?" [P]":""}  g ${st}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${f(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${f(l.x)}, ${f(l.y)}, ${f(l.z)})`,`vel  (${f(d.x)}, ${f(d.y)}, ${f(d.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${m(c.facing)}deg   atkBlend ${D}   ${C}   land ${O}`,mt,`ik ${q}  clamped ${Pt?Pt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  (head-body ${m(c.headYaw-c.bodyYaw)})  ${M}`,`move (${f(a.intents.moveX)}, ${f(a.intents.moveZ)})  stick (${f(a.stickX)}, ${f(a.stickY)})  ${a.source}  aim ${S}`,`weapon ${v}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${_.kind}  phase ${_.phase}  prog ${x.toFixed(0)}%  cd ${f(_.cooldown)}s  id ${_.id}  from (${f(_.fromX)},${f(_.fromZ)}) → to (${f(_.toX)},${f(_.toZ)})`,Y,`camera ${I}  ${$}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${wt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${f(t.impulse.x)}, ${f(t.impulse.z)})`,`event ${h?`${h.type} ${f(h.value)}`:"-"}   scale ${f(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${st}`].join(`
`)}}}const fr=["lab","hud","motion","debug"],rf={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},cf={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function wb(n){var c;const t=Object.fromEntries(fr.map(l=>[l,document.getElementById(cf[l].toggle)])),e=Object.fromEntries(fr.map(l=>[l,document.getElementById(cf[l].panel)]));let i={},a=null;function s(){var l,d,u;for(const h of fr){const f=a===h,m=t[h],v=e[h];m&&(m.setAttribute("aria-expanded",String(f)),m.textContent=`${rf[h].short} ${f?"▾":"▸"}`,m.setAttribute("aria-label",`${f?"收起":"展开"}${rf[h].full}`)),v&&v.classList.toggle("is-open",f)}n.classList.toggle("is-compact",a!=="hud"),(l=i.motion)==null||l.setEnabled(a==="motion"),a==="debug"?(d=i.debug)==null||d.open():(u=i.debug)==null||u.close()}function o(l){a=a===l?null:l,s()}function r(){a!==null&&(a=null,s())}for(const l of fr)(c=t[l])==null||c.addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),o(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(l){i=l,s()},toggle:o,closeAll:r,isOpen:l=>a===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const vh="170",Eb=0,lf=1,Tb=2,Lm=1,Dm=2,Ji=3,Ta=0,qn=1,Je=2,ba=0,Bs=1,ta=2,df=3,hf=4,Ab=5,ja=100,Rb=101,Pb=102,Cb=103,Lb=104,Db=200,kb=201,Ib=202,zb=203,fd=204,pd=205,Fb=206,Ub=207,Nb=208,Ob=209,Bb=210,Hb=211,Gb=212,Xb=213,Vb=214,md=0,gd=1,xd=2,Zs=3,vd=4,yd=5,Md=6,_d=7,yh=0,Wb=1,Yb=2,Sa=0,$b=1,Zb=2,jb=3,qb=4,Kb=5,Jb=6,Qb=7,km=300,js=301,qs=302,bd=303,Sd=304,Pc=306,wd=1e3,Ka=1001,Ed=1002,oi=1003,t1=1004,pr=1005,Fi=1006,dl=1007,Ja=1008,aa=1009,Im=1010,zm=1011,$o=1012,Mh=1013,es=1014,Ui=1015,tr=1016,_h=1017,bh=1018,Ks=1020,Fm=35902,Um=1021,Nm=1022,wi=1023,Om=1024,Bm=1025,Hs=1026,Js=1027,Sh=1028,wh=1029,Hm=1030,Eh=1031,Th=1033,Kr=33776,Jr=33777,Qr=33778,tc=33779,Td=35840,Ad=35841,Rd=35842,Pd=35843,Cd=36196,Ld=37492,Dd=37496,kd=37808,Id=37809,zd=37810,Fd=37811,Ud=37812,Nd=37813,Od=37814,Bd=37815,Hd=37816,Gd=37817,Xd=37818,Vd=37819,Wd=37820,Yd=37821,ec=36492,$d=36494,Zd=36495,Gm=36283,jd=36284,qd=36285,Kd=36286,e1=3200,n1=3201,Xm=0,i1=1,xa="",Hn="srgb",to="srgb-linear",Cc="linear",Be="srgb",gs=7680,uf=519,a1=512,s1=513,o1=514,Vm=515,r1=516,c1=517,l1=518,d1=519,Jd=35044,zo=35048,ff="300 es",na=2e3,gc=2001;class eo{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const Pn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let pf=1234567;const Gs=Math.PI/180,Zo=180/Math.PI;function Oi(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Pn[n&255]+Pn[n>>8&255]+Pn[n>>16&255]+Pn[n>>24&255]+"-"+Pn[t&255]+Pn[t>>8&255]+"-"+Pn[t>>16&15|64]+Pn[t>>24&255]+"-"+Pn[e&63|128]+Pn[e>>8&255]+"-"+Pn[e>>16&255]+Pn[e>>24&255]+Pn[i&255]+Pn[i>>8&255]+Pn[i>>16&255]+Pn[i>>24&255]).toLowerCase()}function Tn(n,t,e){return Math.max(t,Math.min(e,n))}function Ah(n,t){return(n%t+t)%t}function h1(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function u1(n,t,e){return n!==t?(e-n)/(t-n):0}function Fo(n,t,e){return(1-e)*n+e*t}function f1(n,t,e,i){return Fo(n,t,1-Math.exp(-e*i))}function p1(n,t=1){return t-Math.abs(Ah(n,t*2)-t)}function m1(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function g1(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function x1(n,t){return n+Math.floor(Math.random()*(t-n+1))}function v1(n,t){return n+Math.random()*(t-n)}function y1(n){return n*(.5-Math.random())}function M1(n){n!==void 0&&(pf=n);let t=pf+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function _1(n){return n*Gs}function b1(n){return n*Zo}function S1(n){return(n&n-1)===0&&n!==0}function w1(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function E1(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function T1(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),c=o(e/2),l=s((t+i)/2),d=o((t+i)/2),u=s((t-i)/2),h=o((t-i)/2),f=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*d,c*u,c*h,r*l);break;case"YZY":n.set(c*h,r*d,c*u,r*l);break;case"ZXZ":n.set(c*u,c*h,r*d,r*l);break;case"XZX":n.set(r*d,c*m,c*f,r*l);break;case"YXY":n.set(c*f,r*d,c*m,r*l);break;case"ZYZ":n.set(c*m,c*f,r*d,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Si(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Fe(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const mf={DEG2RAD:Gs,RAD2DEG:Zo,generateUUID:Oi,clamp:Tn,euclideanModulo:Ah,mapLinear:h1,inverseLerp:u1,lerp:Fo,damp:f1,pingpong:p1,smoothstep:m1,smootherstep:g1,randInt:x1,randFloat:v1,randFloatSpread:y1,seededRandom:M1,degToRad:_1,radToDeg:b1,isPowerOfTwo:S1,ceilPowerOfTwo:w1,floorPowerOfTwo:E1,setQuaternionFromProperEuler:T1,normalize:Fe,denormalize:Si};class $t{constructor(t=0,e=0){$t.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Tn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Me{constructor(t,e,i,a,s,o,r,c,l){Me.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l)}set(t,e,i,a,s,o,r,c,l){const d=this.elements;return d[0]=t,d[1]=a,d[2]=r,d[3]=e,d[4]=s,d[5]=c,d[6]=i,d[7]=o,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],c=i[6],l=i[1],d=i[4],u=i[7],h=i[2],f=i[5],m=i[8],v=a[0],g=a[3],p=a[6],_=a[1],x=a[4],y=a[7],S=a[2],w=a[5],E=a[8];return s[0]=o*v+r*_+c*S,s[3]=o*g+r*x+c*w,s[6]=o*p+r*y+c*E,s[1]=l*v+d*_+u*S,s[4]=l*g+d*x+u*w,s[7]=l*p+d*y+u*E,s[2]=h*v+f*_+m*S,s[5]=h*g+f*x+m*w,s[8]=h*p+f*y+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8];return e*o*d-e*r*l-i*s*d+i*r*c+a*s*l-a*o*c}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],u=d*o-r*l,h=r*c-d*s,f=l*s-o*c,m=e*u+i*h+a*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=u*v,t[1]=(a*l-d*i)*v,t[2]=(r*i-a*o)*v,t[3]=h*v,t[4]=(d*e-a*c)*v,t[5]=(a*s-r*e)*v,t[6]=f*v,t[7]=(i*c-l*e)*v,t[8]=(o*e-i*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*r)+o+t,-a*l,a*c,-a*(-l*o+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(hl.makeScale(t,e)),this}rotate(t){return this.premultiply(hl.makeRotation(-t)),this}translate(t,e){return this.premultiply(hl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const hl=new Me;function Wm(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function xc(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function A1(){const n=xc("canvas");return n.style.display="block",n}const gf={};function Po(n){n in gf||(gf[n]=!0,console.warn(n))}function R1(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function P1(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function C1(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Te={enabled:!0,workingColorSpace:to,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Be&&(n.r=ia(n.r),n.g=ia(n.g),n.b=ia(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Be&&(n.r=Xs(n.r),n.g=Xs(n.g),n.b=Xs(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===xa?Cc:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function ia(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Xs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const xf=[.64,.33,.3,.6,.15,.06],vf=[.2126,.7152,.0722],yf=[.3127,.329],Mf=new Me().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_f=new Me().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Te.define({[to]:{primaries:xf,whitePoint:yf,transfer:Cc,toXYZ:Mf,fromXYZ:_f,luminanceCoefficients:vf,workingColorSpaceConfig:{unpackColorSpace:Hn},outputColorSpaceConfig:{drawingBufferColorSpace:Hn}},[Hn]:{primaries:xf,whitePoint:yf,transfer:Be,toXYZ:Mf,fromXYZ:_f,luminanceCoefficients:vf,outputColorSpaceConfig:{drawingBufferColorSpace:Hn}}});let xs;class L1{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{xs===void 0&&(xs=xc("canvas")),xs.width=t.width,xs.height=t.height;const i=xs.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=xs}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=xc("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=ia(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(ia(e[i]/255)*255):e[i]=ia(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let D1=0;class Ym{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:D1++}),this.uuid=Oi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(ul(a[o].image)):s.push(ul(a[o]))}else s=ul(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function ul(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?L1.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let k1=0;class Dn extends eo{constructor(t=Dn.DEFAULT_IMAGE,e=Dn.DEFAULT_MAPPING,i=Ka,a=Ka,s=Fi,o=Ja,r=wi,c=aa,l=Dn.DEFAULT_ANISOTROPY,d=xa){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:k1++}),this.uuid=Oi(),this.name="",this.source=new Ym(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new $t(0,0),this.repeat=new $t(1,1),this.center=new $t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Me,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==km)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case wd:t.x=t.x-Math.floor(t.x);break;case Ka:t.x=t.x<0?0:1;break;case Ed:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case wd:t.y=t.y-Math.floor(t.y);break;case Ka:t.y=t.y<0?0:1;break;case Ed:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Dn.DEFAULT_IMAGE=null;Dn.DEFAULT_MAPPING=km;Dn.DEFAULT_ANISOTROPY=1;class on{constructor(t=0,e=0,i=0,a=1){on.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const c=t.elements,l=c[0],d=c[4],u=c[8],h=c[1],f=c[5],m=c[9],v=c[2],g=c[6],p=c[10];if(Math.abs(d-h)<.01&&Math.abs(u-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+v)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,y=(f+1)/2,S=(p+1)/2,w=(d+h)/4,E=(u+v)/4,R=(m+g)/4;return x>y&&x>S?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=w/i,s=E/i):y>S?y<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(y),i=w/a,s=R/a):S<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(S),i=E/s,a=R/s),this.set(i,a,s,e),this}let _=Math.sqrt((g-m)*(g-m)+(u-v)*(u-v)+(h-d)*(h-d));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(u-v)/_,this.z=(h-d)/_,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class I1 extends eo{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new on(0,0,t,e),this.scissorTest=!1,this.viewport=new on(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Fi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Dn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Ym(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ns extends I1{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class $m extends Dn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=oi,this.minFilter=oi,this.wrapR=Ka,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class z1 extends Dn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=oi,this.minFilter=oi,this.wrapR=Ka,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class wa{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let c=i[a+0],l=i[a+1],d=i[a+2],u=i[a+3];const h=s[o+0],f=s[o+1],m=s[o+2],v=s[o+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u;return}if(r===1){t[e+0]=h,t[e+1]=f,t[e+2]=m,t[e+3]=v;return}if(u!==v||c!==h||l!==f||d!==m){let g=1-r;const p=c*h+l*f+d*m+u*v,_=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const S=Math.sqrt(x),w=Math.atan2(S,p*_);g=Math.sin(g*w)/S,r=Math.sin(r*w)/S}const y=r*_;if(c=c*g+h*y,l=l*g+f*y,d=d*g+m*y,u=u*g+v*y,g===1-r){const S=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=S,l*=S,d*=S,u*=S}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],c=i[a+1],l=i[a+2],d=i[a+3],u=s[o],h=s[o+1],f=s[o+2],m=s[o+3];return t[e]=r*m+d*u+c*f-l*h,t[e+1]=c*m+d*h+l*u-r*f,t[e+2]=l*m+d*f+r*h-c*u,t[e+3]=d*m-r*u-c*h-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,c=Math.sin,l=r(i/2),d=r(a/2),u=r(s/2),h=c(i/2),f=c(a/2),m=c(s/2);switch(o){case"XYZ":this._x=h*d*u+l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u-h*f*m;break;case"YXZ":this._x=h*d*u+l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u+h*f*m;break;case"ZXY":this._x=h*d*u-l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u-h*f*m;break;case"ZYX":this._x=h*d*u-l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u+h*f*m;break;case"YZX":this._x=h*d*u+l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u-h*f*m;break;case"XZY":this._x=h*d*u-l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u+h*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],c=e[9],l=e[2],d=e[6],u=e[10],h=i+r+u;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(d-c)*f,this._y=(s-l)*f,this._z=(o-a)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(d-c)/f,this._x=.25*f,this._y=(a+o)/f,this._z=(s+l)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(s-l)/f,this._x=(a+o)/f,this._y=.25*f,this._z=(c+d)/f}else{const f=2*Math.sqrt(1+u-i-r);this._w=(o-a)/f,this._x=(s+l)/f,this._y=(c+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Tn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,c=e._y,l=e._z,d=e._w;return this._x=i*d+o*r+a*l-s*c,this._y=a*d+o*c+s*r-i*l,this._z=s*d+o*l+i*c-a*r,this._w=o*d-i*r-a*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const c=1-r*r;if(c<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*a+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,r),u=Math.sin((1-e)*d)/l,h=Math.sin(e*d)/l;return this._w=o*u+this._w*h,this._x=i*u+this._x*h,this._y=a*u+this._y*h,this._z=s*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class W{constructor(t=0,e=0,i=0){W.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(bf.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(bf.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,c=t.w,l=2*(o*a-r*i),d=2*(r*e-s*a),u=2*(s*i-o*e);return this.x=e+c*l+o*u-r*d,this.y=i+c*d+r*l-s*u,this.z=a+c*u+s*d-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,c=e.z;return this.x=a*c-s*r,this.y=s*o-i*c,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return fl.copy(this).projectOnVector(t),this.sub(fl)}reflect(t){return this.sub(fl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Tn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fl=new W,bf=new wa;class as{constructor(t=new W(1/0,1/0,1/0),e=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Mi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Mi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Mi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,Mi):Mi.fromBufferAttribute(s,o),Mi.applyMatrix4(t.matrixWorld),this.expandByPoint(Mi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),mr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),mr.copy(i.boundingBox)),mr.applyMatrix4(t.matrixWorld),this.union(mr)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Mi),Mi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(vo),gr.subVectors(this.max,vo),vs.subVectors(t.a,vo),ys.subVectors(t.b,vo),Ms.subVectors(t.c,vo),da.subVectors(ys,vs),ha.subVectors(Ms,ys),Fa.subVectors(vs,Ms);let e=[0,-da.z,da.y,0,-ha.z,ha.y,0,-Fa.z,Fa.y,da.z,0,-da.x,ha.z,0,-ha.x,Fa.z,0,-Fa.x,-da.y,da.x,0,-ha.y,ha.x,0,-Fa.y,Fa.x,0];return!pl(e,vs,ys,Ms,gr)||(e=[1,0,0,0,1,0,0,0,1],!pl(e,vs,ys,Ms,gr))?!1:(xr.crossVectors(da,ha),e=[xr.x,xr.y,xr.z],pl(e,vs,ys,Ms,gr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Yi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Yi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Yi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Yi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Yi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Yi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Yi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Yi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Yi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Yi=[new W,new W,new W,new W,new W,new W,new W,new W],Mi=new W,mr=new as,vs=new W,ys=new W,Ms=new W,da=new W,ha=new W,Fa=new W,vo=new W,gr=new W,xr=new W,Ua=new W;function pl(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){Ua.fromArray(n,s);const r=a.x*Math.abs(Ua.x)+a.y*Math.abs(Ua.y)+a.z*Math.abs(Ua.z),c=t.dot(Ua),l=e.dot(Ua),d=i.dot(Ua);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>r)return!1}return!0}const F1=new as,yo=new W,ml=new W;class no{constructor(t=new W,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):F1.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;yo.subVectors(t,this.center);const e=yo.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(yo,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ml.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(yo.copy(t.center).add(ml)),this.expandByPoint(yo.copy(t.center).sub(ml))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const $i=new W,gl=new W,vr=new W,ua=new W,xl=new W,yr=new W,vl=new W;class Rh{constructor(t=new W,e=new W(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,$i)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=$i.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):($i.copy(this.origin).addScaledVector(this.direction,e),$i.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){gl.copy(t).add(e).multiplyScalar(.5),vr.copy(e).sub(t).normalize(),ua.copy(this.origin).sub(gl);const s=t.distanceTo(e)*.5,o=-this.direction.dot(vr),r=ua.dot(this.direction),c=-ua.dot(vr),l=ua.lengthSq(),d=Math.abs(1-o*o);let u,h,f,m;if(d>0)if(u=o*c-r,h=o*r-c,m=s*d,u>=0)if(h>=-m)if(h<=m){const v=1/d;u*=v,h*=v,f=u*(u+o*h+2*r)+h*(o*u+h+2*c)+l}else h=s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;else h=-s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;else h<=-m?(u=Math.max(0,-(-o*s+r)),h=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+h*(h+2*c)+l):h<=m?(u=0,h=Math.min(Math.max(-s,-c),s),f=h*(h+2*c)+l):(u=Math.max(0,-(o*s+r)),h=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+h*(h+2*c)+l);else h=o>0?-s:s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),a&&a.copy(gl).addScaledVector(vr,h),f}intersectSphere(t,e){$i.subVectors(t.center,this.origin);const i=$i.dot(this.direction),a=$i.dot($i)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,c=i+o;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,a=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,a=(t.min.x-h.x)*l),d>=0?(s=(t.min.y-h.y)*d,o=(t.max.y-h.y)*d):(s=(t.max.y-h.y)*d,o=(t.min.y-h.y)*d),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),u>=0?(r=(t.min.z-h.z)*u,c=(t.max.z-h.z)*u):(r=(t.max.z-h.z)*u,c=(t.min.z-h.z)*u),i>c||r>a)||((r>i||i!==i)&&(i=r),(c<a||a!==a)&&(a=c),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,$i)!==null}intersectTriangle(t,e,i,a,s){xl.subVectors(e,t),yr.subVectors(i,t),vl.crossVectors(xl,yr);let o=this.direction.dot(vl),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;ua.subVectors(this.origin,t);const c=r*this.direction.dot(yr.crossVectors(ua,yr));if(c<0)return null;const l=r*this.direction.dot(xl.cross(ua));if(l<0||c+l>o)return null;const d=-r*ua.dot(vl);return d<0?null:this.at(d/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ce{constructor(t,e,i,a,s,o,r,c,l,d,u,h,f,m,v,g){Ce.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l,d,u,h,f,m,v,g)}set(t,e,i,a,s,o,r,c,l,d,u,h,f,m,v,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=c,p[2]=l,p[6]=d,p[10]=u,p[14]=h,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ce().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/_s.setFromMatrixColumn(t,0).length(),s=1/_s.setFromMatrixColumn(t,1).length(),o=1/_s.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),c=Math.cos(a),l=Math.sin(a),d=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const h=o*d,f=o*u,m=r*d,v=r*u;e[0]=c*d,e[4]=-c*u,e[8]=l,e[1]=f+m*l,e[5]=h-v*l,e[9]=-r*c,e[2]=v-h*l,e[6]=m+f*l,e[10]=o*c}else if(t.order==="YXZ"){const h=c*d,f=c*u,m=l*d,v=l*u;e[0]=h+v*r,e[4]=m*r-f,e[8]=o*l,e[1]=o*u,e[5]=o*d,e[9]=-r,e[2]=f*r-m,e[6]=v+h*r,e[10]=o*c}else if(t.order==="ZXY"){const h=c*d,f=c*u,m=l*d,v=l*u;e[0]=h-v*r,e[4]=-o*u,e[8]=m+f*r,e[1]=f+m*r,e[5]=o*d,e[9]=v-h*r,e[2]=-o*l,e[6]=r,e[10]=o*c}else if(t.order==="ZYX"){const h=o*d,f=o*u,m=r*d,v=r*u;e[0]=c*d,e[4]=m*l-f,e[8]=h*l+v,e[1]=c*u,e[5]=v*l+h,e[9]=f*l-m,e[2]=-l,e[6]=r*c,e[10]=o*c}else if(t.order==="YZX"){const h=o*c,f=o*l,m=r*c,v=r*l;e[0]=c*d,e[4]=v-h*u,e[8]=m*u+f,e[1]=u,e[5]=o*d,e[9]=-r*d,e[2]=-l*d,e[6]=f*u+m,e[10]=h-v*u}else if(t.order==="XZY"){const h=o*c,f=o*l,m=r*c,v=r*l;e[0]=c*d,e[4]=-u,e[8]=l*d,e[1]=h*u+v,e[5]=o*d,e[9]=f*u-m,e[2]=m*u-f,e[6]=r*d,e[10]=v*u+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(U1,t,N1)}lookAt(t,e,i){const a=this.elements;return ni.subVectors(t,e),ni.lengthSq()===0&&(ni.z=1),ni.normalize(),fa.crossVectors(i,ni),fa.lengthSq()===0&&(Math.abs(i.z)===1?ni.x+=1e-4:ni.z+=1e-4,ni.normalize(),fa.crossVectors(i,ni)),fa.normalize(),Mr.crossVectors(ni,fa),a[0]=fa.x,a[4]=Mr.x,a[8]=ni.x,a[1]=fa.y,a[5]=Mr.y,a[9]=ni.y,a[2]=fa.z,a[6]=Mr.z,a[10]=ni.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],c=i[8],l=i[12],d=i[1],u=i[5],h=i[9],f=i[13],m=i[2],v=i[6],g=i[10],p=i[14],_=i[3],x=i[7],y=i[11],S=i[15],w=a[0],E=a[4],R=a[8],b=a[12],M=a[1],P=a[5],I=a[9],D=a[13],U=a[2],C=a[6],T=a[10],O=a[14],G=a[3],$=a[7],at=a[11],mt=a[15];return s[0]=o*w+r*M+c*U+l*G,s[4]=o*E+r*P+c*C+l*$,s[8]=o*R+r*I+c*T+l*at,s[12]=o*b+r*D+c*O+l*mt,s[1]=d*w+u*M+h*U+f*G,s[5]=d*E+u*P+h*C+f*$,s[9]=d*R+u*I+h*T+f*at,s[13]=d*b+u*D+h*O+f*mt,s[2]=m*w+v*M+g*U+p*G,s[6]=m*E+v*P+g*C+p*$,s[10]=m*R+v*I+g*T+p*at,s[14]=m*b+v*D+g*O+p*mt,s[3]=_*w+x*M+y*U+S*G,s[7]=_*E+x*P+y*C+S*$,s[11]=_*R+x*I+y*T+S*at,s[15]=_*b+x*D+y*O+S*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],c=t[9],l=t[13],d=t[2],u=t[6],h=t[10],f=t[14],m=t[3],v=t[7],g=t[11],p=t[15];return m*(+s*c*u-a*l*u-s*r*h+i*l*h+a*r*f-i*c*f)+v*(+e*c*f-e*l*h+s*o*h-a*o*f+a*l*d-s*c*d)+g*(+e*l*u-e*r*f-s*o*u+i*o*f+s*r*d-i*l*d)+p*(-a*r*d-e*c*u+e*r*h+a*o*u-i*o*h+i*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],u=t[9],h=t[10],f=t[11],m=t[12],v=t[13],g=t[14],p=t[15],_=u*g*l-v*h*l+v*c*f-r*g*f-u*c*p+r*h*p,x=m*h*l-d*g*l-m*c*f+o*g*f+d*c*p-o*h*p,y=d*v*l-m*u*l+m*r*f-o*v*f-d*r*p+o*u*p,S=m*u*c-d*v*c-m*r*h+o*v*h+d*r*g-o*u*g,w=e*_+i*x+a*y+s*S;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/w;return t[0]=_*E,t[1]=(v*h*s-u*g*s-v*a*f+i*g*f+u*a*p-i*h*p)*E,t[2]=(r*g*s-v*c*s+v*a*l-i*g*l-r*a*p+i*c*p)*E,t[3]=(u*c*s-r*h*s-u*a*l+i*h*l+r*a*f-i*c*f)*E,t[4]=x*E,t[5]=(d*g*s-m*h*s+m*a*f-e*g*f-d*a*p+e*h*p)*E,t[6]=(m*c*s-o*g*s-m*a*l+e*g*l+o*a*p-e*c*p)*E,t[7]=(o*h*s-d*c*s+d*a*l-e*h*l-o*a*f+e*c*f)*E,t[8]=y*E,t[9]=(m*u*s-d*v*s-m*i*f+e*v*f+d*i*p-e*u*p)*E,t[10]=(o*v*s-m*r*s+m*i*l-e*v*l-o*i*p+e*r*p)*E,t[11]=(d*r*s-o*u*s-d*i*l+e*u*l+o*i*f-e*r*f)*E,t[12]=S*E,t[13]=(d*v*a-m*u*a+m*i*h-e*v*h-d*i*g+e*u*g)*E,t[14]=(m*r*a-o*v*a-m*i*c+e*v*c+o*i*g-e*r*g)*E,t[15]=(o*u*a-d*r*a+d*i*c-e*u*c-o*i*h+e*r*h)*E,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,c=t.z,l=s*o,d=s*r;return this.set(l*o+i,l*r-a*c,l*c+a*r,0,l*r+a*c,d*r+i,d*c-a*o,0,l*c-a*r,d*c+a*o,s*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,c=e._w,l=s+s,d=o+o,u=r+r,h=s*l,f=s*d,m=s*u,v=o*d,g=o*u,p=r*u,_=c*l,x=c*d,y=c*u,S=i.x,w=i.y,E=i.z;return a[0]=(1-(v+p))*S,a[1]=(f+y)*S,a[2]=(m-x)*S,a[3]=0,a[4]=(f-y)*w,a[5]=(1-(h+p))*w,a[6]=(g+_)*w,a[7]=0,a[8]=(m+x)*E,a[9]=(g-_)*E,a[10]=(1-(h+v))*E,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=_s.set(a[0],a[1],a[2]).length();const o=_s.set(a[4],a[5],a[6]).length(),r=_s.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],_i.copy(this);const l=1/s,d=1/o,u=1/r;return _i.elements[0]*=l,_i.elements[1]*=l,_i.elements[2]*=l,_i.elements[4]*=d,_i.elements[5]*=d,_i.elements[6]*=d,_i.elements[8]*=u,_i.elements[9]*=u,_i.elements[10]*=u,e.setFromRotationMatrix(_i),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=na){const c=this.elements,l=2*s/(e-t),d=2*s/(i-a),u=(e+t)/(e-t),h=(i+a)/(i-a);let f,m;if(r===na)f=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===gc)f=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=na){const c=this.elements,l=1/(e-t),d=1/(i-a),u=1/(o-s),h=(e+t)*l,f=(i+a)*d;let m,v;if(r===na)m=(o+s)*u,v=-2*u;else if(r===gc)m=s*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=v,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const _s=new W,_i=new Ce,U1=new W(0,0,0),N1=new W(1,1,1),fa=new W,Mr=new W,ni=new W,Sf=new Ce,wf=new wa;class Bi{constructor(t=0,e=0,i=0,a=Bi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],c=a[1],l=a[5],d=a[9],u=a[2],h=a[6],f=a[10];switch(e){case"XYZ":this._y=Math.asin(Tn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Tn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Tn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Tn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Tn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-Tn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-d,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Sf.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Sf,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return wf.setFromEuler(this),this.setFromQuaternion(wf,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Bi.DEFAULT_ORDER="XYZ";class Ph{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let O1=0;const Ef=new W,bs=new wa,Zi=new Ce,_r=new W,Mo=new W,B1=new W,H1=new wa,Tf=new W(1,0,0),Af=new W(0,1,0),Rf=new W(0,0,1),Pf={type:"added"},G1={type:"removed"},Ss={type:"childadded",child:null},yl={type:"childremoved",child:null};class nn extends eo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:O1++}),this.uuid=Oi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=nn.DEFAULT_UP.clone();const t=new W,e=new Bi,i=new wa,a=new W(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Ce},normalMatrix:{value:new Me}}),this.matrix=new Ce,this.matrixWorld=new Ce,this.matrixAutoUpdate=nn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ph,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return bs.setFromAxisAngle(t,e),this.quaternion.multiply(bs),this}rotateOnWorldAxis(t,e){return bs.setFromAxisAngle(t,e),this.quaternion.premultiply(bs),this}rotateX(t){return this.rotateOnAxis(Tf,t)}rotateY(t){return this.rotateOnAxis(Af,t)}rotateZ(t){return this.rotateOnAxis(Rf,t)}translateOnAxis(t,e){return Ef.copy(t).applyQuaternion(this.quaternion),this.position.add(Ef.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Tf,t)}translateY(t){return this.translateOnAxis(Af,t)}translateZ(t){return this.translateOnAxis(Rf,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Zi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?_r.copy(t):_r.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),Mo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zi.lookAt(Mo,_r,this.up):Zi.lookAt(_r,Mo,this.up),this.quaternion.setFromRotationMatrix(Zi),a&&(Zi.extractRotation(a.matrixWorld),bs.setFromRotationMatrix(Zi),this.quaternion.premultiply(bs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Pf),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(G1),yl.child=t,this.dispatchEvent(yl),yl.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Zi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Zi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Zi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Pf),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mo,t,B1),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mo,H1,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(s(t.materials,this.material[c]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];a.animations.push(s(t.animations,c))}}if(e){const r=o(t.geometries),c=o(t.materials),l=o(t.textures),d=o(t.images),u=o(t.shapes),h=o(t.skeletons),f=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const c=[];for(const l in r){const d=r[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}nn.DEFAULT_UP=new W(0,1,0);nn.DEFAULT_MATRIX_AUTO_UPDATE=!0;nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const bi=new W,ji=new W,Ml=new W,qi=new W,ws=new W,Es=new W,Cf=new W,_l=new W,bl=new W,Sl=new W,wl=new on,El=new on,Tl=new on;class si{constructor(t=new W,e=new W,i=new W){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),bi.subVectors(t,e),a.cross(bi);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){bi.subVectors(a,e),ji.subVectors(i,e),Ml.subVectors(t,e);const o=bi.dot(bi),r=bi.dot(ji),c=bi.dot(Ml),l=ji.dot(ji),d=ji.dot(Ml),u=o*l-r*r;if(u===0)return s.set(0,0,0),null;const h=1/u,f=(l*c-r*d)*h,m=(o*d-r*c)*h;return s.set(1-f-m,m,f)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,qi)===null?!1:qi.x>=0&&qi.y>=0&&qi.x+qi.y<=1}static getInterpolation(t,e,i,a,s,o,r,c){return this.getBarycoord(t,e,i,a,qi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,qi.x),c.addScaledVector(o,qi.y),c.addScaledVector(r,qi.z),c)}static getInterpolatedAttribute(t,e,i,a,s,o){return wl.setScalar(0),El.setScalar(0),Tl.setScalar(0),wl.fromBufferAttribute(t,e),El.fromBufferAttribute(t,i),Tl.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(wl,s.x),o.addScaledVector(El,s.y),o.addScaledVector(Tl,s.z),o}static isFrontFacing(t,e,i,a){return bi.subVectors(i,e),ji.subVectors(t,e),bi.cross(ji).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return bi.subVectors(this.c,this.b),ji.subVectors(this.a,this.b),bi.cross(ji).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return si.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return si.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return si.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return si.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return si.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;ws.subVectors(a,i),Es.subVectors(s,i),_l.subVectors(t,i);const c=ws.dot(_l),l=Es.dot(_l);if(c<=0&&l<=0)return e.copy(i);bl.subVectors(t,a);const d=ws.dot(bl),u=Es.dot(bl);if(d>=0&&u<=d)return e.copy(a);const h=c*u-d*l;if(h<=0&&c>=0&&d<=0)return o=c/(c-d),e.copy(i).addScaledVector(ws,o);Sl.subVectors(t,s);const f=ws.dot(Sl),m=Es.dot(Sl);if(m>=0&&f<=m)return e.copy(s);const v=f*l-c*m;if(v<=0&&l>=0&&m<=0)return r=l/(l-m),e.copy(i).addScaledVector(Es,r);const g=d*m-f*u;if(g<=0&&u-d>=0&&f-m>=0)return Cf.subVectors(s,a),r=(u-d)/(u-d+(f-m)),e.copy(a).addScaledVector(Cf,r);const p=1/(g+v+h);return o=v*p,r=h*p,e.copy(i).addScaledVector(ws,o).addScaledVector(Es,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Zm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},pa={h:0,s:0,l:0},br={h:0,s:0,l:0};function Al(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ee{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Hn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Te.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Te.workingColorSpace){return this.r=t,this.g=e,this.b=i,Te.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Te.workingColorSpace){if(t=Ah(t,1),e=Tn(e,0,1),i=Tn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=Al(o,s,t+1/3),this.g=Al(o,s,t),this.b=Al(o,s,t-1/3)}return Te.toWorkingColorSpace(this,a),this}setStyle(t,e=Hn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Hn){const i=Zm[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ia(t.r),this.g=ia(t.g),this.b=ia(t.b),this}copyLinearToSRGB(t){return this.r=Xs(t.r),this.g=Xs(t.g),this.b=Xs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Hn){return Te.fromWorkingColorSpace(Cn.copy(this),t),Math.round(Tn(Cn.r*255,0,255))*65536+Math.round(Tn(Cn.g*255,0,255))*256+Math.round(Tn(Cn.b*255,0,255))}getHexString(t=Hn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Te.workingColorSpace){Te.fromWorkingColorSpace(Cn.copy(this),e);const i=Cn.r,a=Cn.g,s=Cn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let c,l;const d=(r+o)/2;if(r===o)c=0,l=0;else{const u=o-r;switch(l=d<=.5?u/(o+r):u/(2-o-r),o){case i:c=(a-s)/u+(a<s?6:0);break;case a:c=(s-i)/u+2;break;case s:c=(i-a)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=Te.workingColorSpace){return Te.fromWorkingColorSpace(Cn.copy(this),e),t.r=Cn.r,t.g=Cn.g,t.b=Cn.b,t}getStyle(t=Hn){Te.fromWorkingColorSpace(Cn.copy(this),t);const e=Cn.r,i=Cn.g,a=Cn.b;return t!==Hn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(pa),this.setHSL(pa.h+t,pa.s+e,pa.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(pa),t.getHSL(br);const i=Fo(pa.h,br.h,e),a=Fo(pa.s,br.s,e),s=Fo(pa.l,br.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Cn=new ee;ee.NAMES=Zm;let X1=0;class ss extends eo{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:X1++}),this.uuid=Oi(),this.name="",this.blending=Bs,this.side=Ta,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fd,this.blendDst=pd,this.blendEquation=ja,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ee(0,0,0),this.blendAlpha=0,this.depthFunc=Zs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=uf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gs,this.stencilZFail=gs,this.stencilZPass=gs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Bs&&(i.blending=this.blending),this.side!==Ta&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==fd&&(i.blendSrc=this.blendSrc),this.blendDst!==pd&&(i.blendDst=this.blendDst),this.blendEquation!==ja&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Zs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==uf&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==gs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==gs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const c=s[r];delete c.metadata,o.push(c)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class yn extends ss{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bi,this.combine=yh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const fn=new W,Sr=new $t;class rn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Jd,this.updateRanges=[],this.gpuType=Ui,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Sr.fromBufferAttribute(this,e),Sr.applyMatrix3(t),this.setXY(e,Sr.x,Sr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)fn.fromBufferAttribute(this,e),fn.applyMatrix3(t),this.setXYZ(e,fn.x,fn.y,fn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)fn.fromBufferAttribute(this,e),fn.applyMatrix4(t),this.setXYZ(e,fn.x,fn.y,fn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)fn.fromBufferAttribute(this,e),fn.applyNormalMatrix(t),this.setXYZ(e,fn.x,fn.y,fn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)fn.fromBufferAttribute(this,e),fn.transformDirection(t),this.setXYZ(e,fn.x,fn.y,fn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Si(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Fe(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Si(e,this.array)),e}setX(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Si(e,this.array)),e}setY(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Si(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Si(e,this.array)),e}setW(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),i=Fe(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),i=Fe(i,this.array),a=Fe(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),i=Fe(i,this.array),a=Fe(a,this.array),s=Fe(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Jd&&(t.usage=this.usage),t}}class jm extends rn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class qm extends rn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class De extends rn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let V1=0;const hi=new Ce,Rl=new nn,Ts=new W,ii=new as,_o=new as,wn=new W;class Qe extends eo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:V1++}),this.uuid=Oi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Wm(t)?qm:jm)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Me().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return hi.makeRotationFromQuaternion(t),this.applyMatrix4(hi),this}rotateX(t){return hi.makeRotationX(t),this.applyMatrix4(hi),this}rotateY(t){return hi.makeRotationY(t),this.applyMatrix4(hi),this}rotateZ(t){return hi.makeRotationZ(t),this.applyMatrix4(hi),this}translate(t,e,i){return hi.makeTranslation(t,e,i),this.applyMatrix4(hi),this}scale(t,e,i){return hi.makeScale(t,e,i),this.applyMatrix4(hi),this}lookAt(t){return Rl.lookAt(t),Rl.updateMatrix(),this.applyMatrix4(Rl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ts).negate(),this.translate(Ts.x,Ts.y,Ts.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new De(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new as);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];ii.setFromBufferAttribute(s),this.morphTargetsRelative?(wn.addVectors(this.boundingBox.min,ii.min),this.boundingBox.expandByPoint(wn),wn.addVectors(this.boundingBox.max,ii.max),this.boundingBox.expandByPoint(wn)):(this.boundingBox.expandByPoint(ii.min),this.boundingBox.expandByPoint(ii.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new no);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new W,1/0);return}if(t){const i=this.boundingSphere.center;if(ii.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];_o.setFromBufferAttribute(r),this.morphTargetsRelative?(wn.addVectors(ii.min,_o.min),ii.expandByPoint(wn),wn.addVectors(ii.max,_o.max),ii.expandByPoint(wn)):(ii.expandByPoint(_o.min),ii.expandByPoint(_o.max))}ii.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)wn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(wn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],c=this.morphTargetsRelative;for(let l=0,d=r.count;l<d;l++)wn.fromBufferAttribute(r,l),c&&(Ts.fromBufferAttribute(t,l),wn.add(Ts)),a=Math.max(a,i.distanceToSquared(wn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new rn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],c=[];for(let R=0;R<i.count;R++)r[R]=new W,c[R]=new W;const l=new W,d=new W,u=new W,h=new $t,f=new $t,m=new $t,v=new W,g=new W;function p(R,b,M){l.fromBufferAttribute(i,R),d.fromBufferAttribute(i,b),u.fromBufferAttribute(i,M),h.fromBufferAttribute(s,R),f.fromBufferAttribute(s,b),m.fromBufferAttribute(s,M),d.sub(l),u.sub(l),f.sub(h),m.sub(h);const P=1/(f.x*m.y-m.x*f.y);isFinite(P)&&(v.copy(d).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(P),g.copy(u).multiplyScalar(f.x).addScaledVector(d,-m.x).multiplyScalar(P),r[R].add(v),r[b].add(v),r[M].add(v),c[R].add(g),c[b].add(g),c[M].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let R=0,b=_.length;R<b;++R){const M=_[R],P=M.start,I=M.count;for(let D=P,U=P+I;D<U;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const x=new W,y=new W,S=new W,w=new W;function E(R){S.fromBufferAttribute(a,R),w.copy(S);const b=r[R];x.copy(b),x.sub(S.multiplyScalar(S.dot(b))).normalize(),y.crossVectors(w,b);const P=y.dot(c[R])<0?-1:1;o.setXYZW(R,x.x,x.y,x.z,P)}for(let R=0,b=_.length;R<b;++R){const M=_[R],P=M.start,I=M.count;for(let D=P,U=P+I;D<U;D+=3)E(t.getX(D+0)),E(t.getX(D+1)),E(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new rn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);const a=new W,s=new W,o=new W,r=new W,c=new W,l=new W,d=new W,u=new W;if(t)for(let h=0,f=t.count;h<f;h+=3){const m=t.getX(h+0),v=t.getX(h+1),g=t.getX(h+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),d.subVectors(o,s),u.subVectors(a,s),d.cross(u),r.fromBufferAttribute(i,m),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,g),r.add(d),c.add(d),l.add(d),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let h=0,f=e.count;h<f;h+=3)a.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),d.subVectors(o,s),u.subVectors(a,s),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)wn.fromBufferAttribute(t,e),wn.normalize(),t.setXYZ(e,wn.x,wn.y,wn.z)}toNonIndexed(){function t(r,c){const l=r.array,d=r.itemSize,u=r.normalized,h=new l.constructor(c.length*d);let f=0,m=0;for(let v=0,g=c.length;v<g;v++){r.isInterleavedBufferAttribute?f=c[v]*r.data.stride+r.offset:f=c[v]*d;for(let p=0;p<d;p++)h[m++]=l[f++]}return new rn(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Qe,i=this.index.array,a=this.attributes;for(const r in a){const c=a[r],l=t(c,i);e.setAttribute(r,l)}const s=this.morphAttributes;for(const r in s){const c=[],l=s[r];for(let d=0,u=l.length;d<u;d++){const h=l[d],f=t(h,i);c.push(f)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,c=o.length;r<c;r++){const l=o[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const a={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,h=l.length;u<h;u++){const f=l[u];d.push(f.toJSON(t.data))}d.length>0&&(a[c]=d,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const l in a){const d=a[l];this.setAttribute(l,d.clone(e))}const s=t.morphAttributes;for(const l in s){const d=[],u=s[l];for(let h=0,f=u.length;h<f;h++)d.push(u[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,d=o.length;l<d;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Lf=new Ce,Na=new Rh,wr=new no,Df=new W,Er=new W,Tr=new W,Ar=new W,Pl=new W,Rr=new W,kf=new W,Pr=new W;class ge extends nn{constructor(t=new Qe,e=new yn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){Rr.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const d=r[c],u=s[c];d!==0&&(Pl.fromBufferAttribute(u,t),o?Rr.addScaledVector(Pl,d):Rr.addScaledVector(Pl.sub(e),d))}e.add(Rr)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),wr.copy(i.boundingSphere),wr.applyMatrix4(s),Na.copy(t.ray).recast(t.near),!(wr.containsPoint(Na.origin)===!1&&(Na.intersectSphere(wr,Df)===null||Na.origin.distanceToSquared(Df)>(t.far-t.near)**2))&&(Lf.copy(s).invert(),Na.copy(t.ray).applyMatrix4(Lf),!(i.boundingBox!==null&&Na.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Na)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,c=s.attributes.position,l=s.attributes.uv,d=s.attributes.uv1,u=s.attributes.normal,h=s.groups,f=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,v=h.length;m<v;m++){const g=h[m],p=o[g.materialIndex],_=Math.max(g.start,f.start),x=Math.min(r.count,Math.min(g.start+g.count,f.start+f.count));for(let y=_,S=x;y<S;y+=3){const w=r.getX(y),E=r.getX(y+1),R=r.getX(y+2);a=Cr(this,p,t,i,l,d,u,w,E,R),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),v=Math.min(r.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const _=r.getX(g),x=r.getX(g+1),y=r.getX(g+2);a=Cr(this,o,t,i,l,d,u,_,x,y),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,v=h.length;m<v;m++){const g=h[m],p=o[g.materialIndex],_=Math.max(g.start,f.start),x=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let y=_,S=x;y<S;y+=3){const w=y,E=y+1,R=y+2;a=Cr(this,p,t,i,l,d,u,w,E,R),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const _=g,x=g+1,y=g+2;a=Cr(this,o,t,i,l,d,u,_,x,y),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function W1(n,t,e,i,a,s,o,r){let c;if(t.side===qn?c=i.intersectTriangle(o,s,a,!0,r):c=i.intersectTriangle(a,s,o,t.side===Ta,r),c===null)return null;Pr.copy(r),Pr.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Pr);return l<e.near||l>e.far?null:{distance:l,point:Pr.clone(),object:n}}function Cr(n,t,e,i,a,s,o,r,c,l){n.getVertexPosition(r,Er),n.getVertexPosition(c,Tr),n.getVertexPosition(l,Ar);const d=W1(n,t,e,i,Er,Tr,Ar,kf);if(d){const u=new W;si.getBarycoord(kf,Er,Tr,Ar,u),a&&(d.uv=si.getInterpolatedAttribute(a,r,c,l,u,new $t)),s&&(d.uv1=si.getInterpolatedAttribute(s,r,c,l,u,new $t)),o&&(d.normal=si.getInterpolatedAttribute(o,r,c,l,u,new W),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:r,b:c,c:l,normal:new W,materialIndex:0};si.getNormal(Er,Tr,Ar,h.normal),d.face=h,d.barycoord=u}return d}class An extends Qe{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],d=[],u=[];let h=0,f=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(c),this.setAttribute("position",new De(l,3)),this.setAttribute("normal",new De(d,3)),this.setAttribute("uv",new De(u,2));function m(v,g,p,_,x,y,S,w,E,R,b){const M=y/E,P=S/R,I=y/2,D=S/2,U=w/2,C=E+1,T=R+1;let O=0,G=0;const $=new W;for(let at=0;at<T;at++){const mt=at*P-D;for(let xt=0;xt<C;xt++){const Pt=xt*M-I;$[v]=Pt*_,$[g]=mt*x,$[p]=U,l.push($.x,$.y,$.z),$[v]=0,$[g]=0,$[p]=w>0?1:-1,d.push($.x,$.y,$.z),u.push(xt/E),u.push(1-at/R),O+=1}}for(let at=0;at<R;at++)for(let mt=0;mt<E;mt++){const xt=h+mt+C*at,Pt=h+mt+C*(at+1),q=h+(mt+1)+C*(at+1),k=h+(mt+1)+C*at;c.push(xt,Pt,k),c.push(Pt,q,k),G+=6}r.addGroup(f,G,b),f+=G,h+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new An(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Qs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function Bn(n){const t={};for(let e=0;e<n.length;e++){const i=Qs(n[e]);for(const a in i)t[a]=i[a]}return t}function Y1(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Km(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Te.workingColorSpace}const $1={clone:Qs,merge:Bn};var Z1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,j1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Aa extends ss{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Z1,this.fragmentShader=j1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Qs(t.uniforms),this.uniformsGroups=Y1(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Jm extends nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ce,this.projectionMatrix=new Ce,this.projectionMatrixInverse=new Ce,this.coordinateSystem=na}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ma=new W,If=new $t,zf=new $t;class ui extends Jm{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Zo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Gs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Zo*2*Math.atan(Math.tan(Gs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ma.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ma.x,ma.y).multiplyScalar(-t/ma.z),ma.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ma.x,ma.y).multiplyScalar(-t/ma.z)}getViewSize(t,e){return this.getViewBounds(t,If,zf),e.subVectors(zf,If)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Gs*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*a/c,e-=o.offsetY*i/l,a*=o.width/c,i*=o.height/l}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const As=-90,Rs=1;class q1 extends nn{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new ui(As,Rs,t,e);a.layers=this.layers,this.add(a);const s=new ui(As,Rs,t,e);s.layers=this.layers,this.add(s);const o=new ui(As,Rs,t,e);o.layers=this.layers,this.add(o);const r=new ui(As,Rs,t,e);r.layers=this.layers,this.add(r);const c=new ui(As,Rs,t,e);c.layers=this.layers,this.add(c);const l=new ui(As,Rs,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,c]=e;for(const l of e)this.remove(l);if(t===na)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===gc)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,c,l,d]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,c),t.setRenderTarget(i,4,a),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,a),t.render(e,d),t.setRenderTarget(u,h,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Qm extends Dn{constructor(t,e,i,a,s,o,r,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:js,super(t,e,i,a,s,o,r,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class K1 extends ns{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Qm(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Fi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new An(5,5,5),s=new Aa({name:"CubemapFromEquirect",uniforms:Qs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:qn,blending:ba});s.uniforms.tEquirect.value=e;const o=new ge(a,s),r=e.minFilter;return e.minFilter===Ja&&(e.minFilter=Fi),new q1(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const Cl=new W,J1=new W,Q1=new Me;class Ya{constructor(t=new W(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=Cl.subVectors(i,e).cross(J1.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Cl),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Q1.getNormalMatrix(t),a=this.coplanarPoint(Cl).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Oa=new no,Lr=new W;class Ch{constructor(t=new Ya,e=new Ya,i=new Ya,a=new Ya,s=new Ya,o=new Ya){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=na){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],c=a[3],l=a[4],d=a[5],u=a[6],h=a[7],f=a[8],m=a[9],v=a[10],g=a[11],p=a[12],_=a[13],x=a[14],y=a[15];if(i[0].setComponents(c-s,h-l,g-f,y-p).normalize(),i[1].setComponents(c+s,h+l,g+f,y+p).normalize(),i[2].setComponents(c+o,h+d,g+m,y+_).normalize(),i[3].setComponents(c-o,h-d,g-m,y-_).normalize(),i[4].setComponents(c-r,h-u,g-v,y-x).normalize(),e===na)i[5].setComponents(c+r,h+u,g+v,y+x).normalize();else if(e===gc)i[5].setComponents(r,u,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Oa.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Oa.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Oa)}intersectsSprite(t){return Oa.center.set(0,0,0),Oa.radius=.7071067811865476,Oa.applyMatrix4(t.matrixWorld),this.intersectsSphere(Oa)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(Lr.x=a.normal.x>0?t.max.x:t.min.x,Lr.y=a.normal.y>0?t.max.y:t.min.y,Lr.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(Lr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function t0(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function tS(n){const t=new WeakMap;function e(r,c){const l=r.array,d=r.usage,u=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,d),r.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,c,l){const d=c.array,u=c.updateRanges;if(n.bindBuffer(l,r),u.length===0)n.bufferSubData(l,0,d);else{u.sort((f,m)=>f.start-m.start);let h=0;for(let f=1;f<u.length;f++){const m=u[h],v=u[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++h,u[h]=v)}u.length=h+1;for(let f=0,m=u.length;f<m;f++){const v=u[f];n.bufferSubData(l,v.start*d.BYTES_PER_ELEMENT,d,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function o(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const d=t.get(r);(!d||d.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:a,remove:s,update:o}}class jn extends Qe{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),c=Math.floor(a),l=r+1,d=c+1,u=t/r,h=e/c,f=[],m=[],v=[],g=[];for(let p=0;p<d;p++){const _=p*h-o;for(let x=0;x<l;x++){const y=x*u-s;m.push(y,-_,0),v.push(0,0,1),g.push(x/r),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<r;_++){const x=_+l*p,y=_+l*(p+1),S=_+1+l*(p+1),w=_+1+l*p;f.push(x,y,w),f.push(y,S,w)}this.setIndex(f),this.setAttribute("position",new De(m,3)),this.setAttribute("normal",new De(v,3)),this.setAttribute("uv",new De(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jn(t.width,t.height,t.widthSegments,t.heightSegments)}}var eS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,nS=`#ifdef USE_ALPHAHASH
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
#endif`,iS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,aS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,oS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,rS=`#ifdef USE_AOMAP
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
#endif`,cS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,lS=`#ifdef USE_BATCHING
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
#endif`,dS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,uS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,fS=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,pS=`#ifdef USE_IRIDESCENCE
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
#endif`,mS=`#ifdef USE_BUMPMAP
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
#endif`,gS=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,xS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,MS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,_S=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,bS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,SS=`#if defined( USE_COLOR_ALPHA )
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
#endif`,wS=`#define PI 3.141592653589793
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
} // validated`,ES=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,TS=`vec3 transformedNormal = objectNormal;
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
#endif`,AS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,RS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,PS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,CS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,LS="gl_FragColor = linearToOutputTexel( gl_FragColor );",DS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,kS=`#ifdef USE_ENVMAP
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
#endif`,IS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,zS=`#ifdef USE_ENVMAP
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
#endif`,FS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,US=`#ifdef USE_ENVMAP
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
#endif`,NS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,OS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,BS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,HS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,GS=`#ifdef USE_GRADIENTMAP
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
}`,XS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,VS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,WS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,YS=`uniform bool receiveShadow;
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
#endif`,$S=`#ifdef USE_ENVMAP
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
#endif`,ZS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,jS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,KS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,JS=`PhysicalMaterial material;
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
#endif`,QS=`struct PhysicalMaterial {
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
}`,tw=`
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
#endif`,ew=`#if defined( RE_IndirectDiffuse )
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
#endif`,nw=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,iw=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,aw=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sw=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ow=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,rw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,lw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,dw=`#if defined( USE_POINTS_UV )
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
#endif`,hw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,uw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,fw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,pw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,mw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gw=`#ifdef USE_MORPHTARGETS
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
#endif`,xw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,yw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Mw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_w=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Sw=`#ifdef USE_NORMALMAP
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
#endif`,ww=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ew=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Tw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Aw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Rw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Pw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Cw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Lw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Dw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,kw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Iw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,zw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Fw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Uw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Nw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ow=`float getShadowMask() {
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
}`,Bw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Hw=`#ifdef USE_SKINNING
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
#endif`,Gw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Xw=`#ifdef USE_SKINNING
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
#endif`,Vw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ww=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Yw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$w=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Zw=`#ifdef USE_TRANSMISSION
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
#endif`,jw=`#ifdef USE_TRANSMISSION
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
#endif`,qw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Kw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Qw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const tE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,eE=`uniform sampler2D t2D;
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
}`,nE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,iE=`#ifdef ENVMAP_TYPE_CUBE
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
}`,aE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,oE=`#include <common>
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
}`,rE=`#if DEPTH_PACKING == 3200
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
}`,cE=`#define DISTANCE
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
}`,lE=`#define DISTANCE
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
}`,dE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uE=`uniform float scale;
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
}`,fE=`uniform vec3 diffuse;
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
}`,pE=`#include <common>
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
}`,mE=`uniform vec3 diffuse;
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
}`,gE=`#define LAMBERT
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
}`,xE=`#define LAMBERT
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
}`,vE=`#define MATCAP
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
}`,yE=`#define MATCAP
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
}`,ME=`#define NORMAL
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
}`,_E=`#define NORMAL
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
}`,bE=`#define PHONG
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
}`,SE=`#define PHONG
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
}`,wE=`#define STANDARD
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
}`,EE=`#define STANDARD
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
}`,TE=`#define TOON
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
}`,AE=`#define TOON
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
}`,RE=`uniform float size;
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
}`,PE=`uniform vec3 diffuse;
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
}`,CE=`#include <common>
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
}`,LE=`uniform vec3 color;
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
}`,DE=`uniform float rotation;
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
}`,kE=`uniform vec3 diffuse;
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
}`,be={alphahash_fragment:eS,alphahash_pars_fragment:nS,alphamap_fragment:iS,alphamap_pars_fragment:aS,alphatest_fragment:sS,alphatest_pars_fragment:oS,aomap_fragment:rS,aomap_pars_fragment:cS,batching_pars_vertex:lS,batching_vertex:dS,begin_vertex:hS,beginnormal_vertex:uS,bsdfs:fS,iridescence_fragment:pS,bumpmap_pars_fragment:mS,clipping_planes_fragment:gS,clipping_planes_pars_fragment:xS,clipping_planes_pars_vertex:vS,clipping_planes_vertex:yS,color_fragment:MS,color_pars_fragment:_S,color_pars_vertex:bS,color_vertex:SS,common:wS,cube_uv_reflection_fragment:ES,defaultnormal_vertex:TS,displacementmap_pars_vertex:AS,displacementmap_vertex:RS,emissivemap_fragment:PS,emissivemap_pars_fragment:CS,colorspace_fragment:LS,colorspace_pars_fragment:DS,envmap_fragment:kS,envmap_common_pars_fragment:IS,envmap_pars_fragment:zS,envmap_pars_vertex:FS,envmap_physical_pars_fragment:$S,envmap_vertex:US,fog_vertex:NS,fog_pars_vertex:OS,fog_fragment:BS,fog_pars_fragment:HS,gradientmap_pars_fragment:GS,lightmap_pars_fragment:XS,lights_lambert_fragment:VS,lights_lambert_pars_fragment:WS,lights_pars_begin:YS,lights_toon_fragment:ZS,lights_toon_pars_fragment:jS,lights_phong_fragment:qS,lights_phong_pars_fragment:KS,lights_physical_fragment:JS,lights_physical_pars_fragment:QS,lights_fragment_begin:tw,lights_fragment_maps:ew,lights_fragment_end:nw,logdepthbuf_fragment:iw,logdepthbuf_pars_fragment:aw,logdepthbuf_pars_vertex:sw,logdepthbuf_vertex:ow,map_fragment:rw,map_pars_fragment:cw,map_particle_fragment:lw,map_particle_pars_fragment:dw,metalnessmap_fragment:hw,metalnessmap_pars_fragment:uw,morphinstance_vertex:fw,morphcolor_vertex:pw,morphnormal_vertex:mw,morphtarget_pars_vertex:gw,morphtarget_vertex:xw,normal_fragment_begin:vw,normal_fragment_maps:yw,normal_pars_fragment:Mw,normal_pars_vertex:_w,normal_vertex:bw,normalmap_pars_fragment:Sw,clearcoat_normal_fragment_begin:ww,clearcoat_normal_fragment_maps:Ew,clearcoat_pars_fragment:Tw,iridescence_pars_fragment:Aw,opaque_fragment:Rw,packing:Pw,premultiplied_alpha_fragment:Cw,project_vertex:Lw,dithering_fragment:Dw,dithering_pars_fragment:kw,roughnessmap_fragment:Iw,roughnessmap_pars_fragment:zw,shadowmap_pars_fragment:Fw,shadowmap_pars_vertex:Uw,shadowmap_vertex:Nw,shadowmask_pars_fragment:Ow,skinbase_vertex:Bw,skinning_pars_vertex:Hw,skinning_vertex:Gw,skinnormal_vertex:Xw,specularmap_fragment:Vw,specularmap_pars_fragment:Ww,tonemapping_fragment:Yw,tonemapping_pars_fragment:$w,transmission_fragment:Zw,transmission_pars_fragment:jw,uv_pars_fragment:qw,uv_pars_vertex:Kw,uv_vertex:Jw,worldpos_vertex:Qw,background_vert:tE,background_frag:eE,backgroundCube_vert:nE,backgroundCube_frag:iE,cube_vert:aE,cube_frag:sE,depth_vert:oE,depth_frag:rE,distanceRGBA_vert:cE,distanceRGBA_frag:lE,equirect_vert:dE,equirect_frag:hE,linedashed_vert:uE,linedashed_frag:fE,meshbasic_vert:pE,meshbasic_frag:mE,meshlambert_vert:gE,meshlambert_frag:xE,meshmatcap_vert:vE,meshmatcap_frag:yE,meshnormal_vert:ME,meshnormal_frag:_E,meshphong_vert:bE,meshphong_frag:SE,meshphysical_vert:wE,meshphysical_frag:EE,meshtoon_vert:TE,meshtoon_frag:AE,points_vert:RE,points_frag:PE,shadow_vert:CE,shadow_frag:LE,sprite_vert:DE,sprite_frag:kE},Wt={common:{diffuse:{value:new ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Me},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Me}},envmap:{envMap:{value:null},envMapRotation:{value:new Me},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Me}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Me}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Me},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Me},normalScale:{value:new $t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Me},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Me}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Me}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Me}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0},uvTransform:{value:new Me}},sprite:{diffuse:{value:new ee(16777215)},opacity:{value:1},center:{value:new $t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Me},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0}}},zi={basic:{uniforms:Bn([Wt.common,Wt.specularmap,Wt.envmap,Wt.aomap,Wt.lightmap,Wt.fog]),vertexShader:be.meshbasic_vert,fragmentShader:be.meshbasic_frag},lambert:{uniforms:Bn([Wt.common,Wt.specularmap,Wt.envmap,Wt.aomap,Wt.lightmap,Wt.emissivemap,Wt.bumpmap,Wt.normalmap,Wt.displacementmap,Wt.fog,Wt.lights,{emissive:{value:new ee(0)}}]),vertexShader:be.meshlambert_vert,fragmentShader:be.meshlambert_frag},phong:{uniforms:Bn([Wt.common,Wt.specularmap,Wt.envmap,Wt.aomap,Wt.lightmap,Wt.emissivemap,Wt.bumpmap,Wt.normalmap,Wt.displacementmap,Wt.fog,Wt.lights,{emissive:{value:new ee(0)},specular:{value:new ee(1118481)},shininess:{value:30}}]),vertexShader:be.meshphong_vert,fragmentShader:be.meshphong_frag},standard:{uniforms:Bn([Wt.common,Wt.envmap,Wt.aomap,Wt.lightmap,Wt.emissivemap,Wt.bumpmap,Wt.normalmap,Wt.displacementmap,Wt.roughnessmap,Wt.metalnessmap,Wt.fog,Wt.lights,{emissive:{value:new ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:be.meshphysical_vert,fragmentShader:be.meshphysical_frag},toon:{uniforms:Bn([Wt.common,Wt.aomap,Wt.lightmap,Wt.emissivemap,Wt.bumpmap,Wt.normalmap,Wt.displacementmap,Wt.gradientmap,Wt.fog,Wt.lights,{emissive:{value:new ee(0)}}]),vertexShader:be.meshtoon_vert,fragmentShader:be.meshtoon_frag},matcap:{uniforms:Bn([Wt.common,Wt.bumpmap,Wt.normalmap,Wt.displacementmap,Wt.fog,{matcap:{value:null}}]),vertexShader:be.meshmatcap_vert,fragmentShader:be.meshmatcap_frag},points:{uniforms:Bn([Wt.points,Wt.fog]),vertexShader:be.points_vert,fragmentShader:be.points_frag},dashed:{uniforms:Bn([Wt.common,Wt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:be.linedashed_vert,fragmentShader:be.linedashed_frag},depth:{uniforms:Bn([Wt.common,Wt.displacementmap]),vertexShader:be.depth_vert,fragmentShader:be.depth_frag},normal:{uniforms:Bn([Wt.common,Wt.bumpmap,Wt.normalmap,Wt.displacementmap,{opacity:{value:1}}]),vertexShader:be.meshnormal_vert,fragmentShader:be.meshnormal_frag},sprite:{uniforms:Bn([Wt.sprite,Wt.fog]),vertexShader:be.sprite_vert,fragmentShader:be.sprite_frag},background:{uniforms:{uvTransform:{value:new Me},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:be.background_vert,fragmentShader:be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Me}},vertexShader:be.backgroundCube_vert,fragmentShader:be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:be.cube_vert,fragmentShader:be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:be.equirect_vert,fragmentShader:be.equirect_frag},distanceRGBA:{uniforms:Bn([Wt.common,Wt.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:be.distanceRGBA_vert,fragmentShader:be.distanceRGBA_frag},shadow:{uniforms:Bn([Wt.lights,Wt.fog,{color:{value:new ee(0)},opacity:{value:1}}]),vertexShader:be.shadow_vert,fragmentShader:be.shadow_frag}};zi.physical={uniforms:Bn([zi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Me},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Me},clearcoatNormalScale:{value:new $t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Me},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Me},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Me},sheen:{value:0},sheenColor:{value:new ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Me},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Me},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Me},transmissionSamplerSize:{value:new $t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Me},attenuationDistance:{value:0},attenuationColor:{value:new ee(0)},specularColor:{value:new ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Me},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Me},anisotropyVector:{value:new $t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Me}}]),vertexShader:be.meshphysical_vert,fragmentShader:be.meshphysical_frag};const Dr={r:0,b:0,g:0},Ba=new Bi,IE=new Ce;function zE(n,t,e,i,a,s,o){const r=new ee(0);let c=s===!0?0:1,l,d,u=null,h=0,f=null;function m(_){let x=_.isScene===!0?_.background:null;return x&&x.isTexture&&(x=(_.backgroundBlurriness>0?e:t).get(x)),x}function v(_){let x=!1;const y=m(_);y===null?p(r,c):y&&y.isColor&&(p(y,1),x=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(_,x){const y=m(x);y&&(y.isCubeTexture||y.mapping===Pc)?(d===void 0&&(d=new ge(new An(1,1,1),new Aa({name:"BackgroundCubeMaterial",uniforms:Qs(zi.backgroundCube.uniforms),vertexShader:zi.backgroundCube.vertexShader,fragmentShader:zi.backgroundCube.fragmentShader,side:qn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(S,w,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(d)),Ba.copy(x.backgroundRotation),Ba.x*=-1,Ba.y*=-1,Ba.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ba.y*=-1,Ba.z*=-1),d.material.uniforms.envMap.value=y,d.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(IE.makeRotationFromEuler(Ba)),d.material.toneMapped=Te.getTransfer(y.colorSpace)!==Be,(u!==y||h!==y.version||f!==n.toneMapping)&&(d.material.needsUpdate=!0,u=y,h=y.version,f=n.toneMapping),d.layers.enableAll(),_.unshift(d,d.geometry,d.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new ge(new jn(2,2),new Aa({name:"BackgroundMaterial",uniforms:Qs(zi.background.uniforms),vertexShader:zi.background.vertexShader,fragmentShader:zi.background.fragmentShader,side:Ta,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=Te.getTransfer(y.colorSpace)!==Be,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||h!==y.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,h=y.version,f=n.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function p(_,x){_.getRGB(Dr,Km(n)),i.buffers.color.setClear(Dr.r,Dr.g,Dr.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(_,x=1){r.set(_),c=x,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,p(r,c)},render:v,addToRenderList:g}}function FE(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=h(null);let s=a,o=!1;function r(M,P,I,D,U){let C=!1;const T=u(D,I,P);s!==T&&(s=T,l(s.object)),C=f(M,D,I,U),C&&m(M,D,I,U),U!==null&&t.update(U,n.ELEMENT_ARRAY_BUFFER),(C||o)&&(o=!1,y(M,P,I,D),U!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function c(){return n.createVertexArray()}function l(M){return n.bindVertexArray(M)}function d(M){return n.deleteVertexArray(M)}function u(M,P,I){const D=I.wireframe===!0;let U=i[M.id];U===void 0&&(U={},i[M.id]=U);let C=U[P.id];C===void 0&&(C={},U[P.id]=C);let T=C[D];return T===void 0&&(T=h(c()),C[D]=T),T}function h(M){const P=[],I=[],D=[];for(let U=0;U<e;U++)P[U]=0,I[U]=0,D[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:I,attributeDivisors:D,object:M,attributes:{},index:null}}function f(M,P,I,D){const U=s.attributes,C=P.attributes;let T=0;const O=I.getAttributes();for(const G in O)if(O[G].location>=0){const at=U[G];let mt=C[G];if(mt===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(mt=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(mt=M.instanceColor)),at===void 0||at.attribute!==mt||mt&&at.data!==mt.data)return!0;T++}return s.attributesNum!==T||s.index!==D}function m(M,P,I,D){const U={},C=P.attributes;let T=0;const O=I.getAttributes();for(const G in O)if(O[G].location>=0){let at=C[G];at===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(at=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(at=M.instanceColor));const mt={};mt.attribute=at,at&&at.data&&(mt.data=at.data),U[G]=mt,T++}s.attributes=U,s.attributesNum=T,s.index=D}function v(){const M=s.newAttributes;for(let P=0,I=M.length;P<I;P++)M[P]=0}function g(M){p(M,0)}function p(M,P){const I=s.newAttributes,D=s.enabledAttributes,U=s.attributeDivisors;I[M]=1,D[M]===0&&(n.enableVertexAttribArray(M),D[M]=1),U[M]!==P&&(n.vertexAttribDivisor(M,P),U[M]=P)}function _(){const M=s.newAttributes,P=s.enabledAttributes;for(let I=0,D=P.length;I<D;I++)P[I]!==M[I]&&(n.disableVertexAttribArray(I),P[I]=0)}function x(M,P,I,D,U,C,T){T===!0?n.vertexAttribIPointer(M,P,I,U,C):n.vertexAttribPointer(M,P,I,D,U,C)}function y(M,P,I,D){v();const U=D.attributes,C=I.getAttributes(),T=P.defaultAttributeValues;for(const O in C){const G=C[O];if(G.location>=0){let $=U[O];if($===void 0&&(O==="instanceMatrix"&&M.instanceMatrix&&($=M.instanceMatrix),O==="instanceColor"&&M.instanceColor&&($=M.instanceColor)),$!==void 0){const at=$.normalized,mt=$.itemSize,xt=t.get($);if(xt===void 0)continue;const Pt=xt.buffer,q=xt.type,k=xt.bytesPerElement,Y=q===n.INT||q===n.UNSIGNED_INT||$.gpuType===Mh;if($.isInterleavedBufferAttribute){const tt=$.data,ut=tt.stride,st=$.offset;if(tt.isInstancedInterleavedBuffer){for(let wt=0;wt<G.locationSize;wt++)p(G.location+wt,tt.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let wt=0;wt<G.locationSize;wt++)g(G.location+wt);n.bindBuffer(n.ARRAY_BUFFER,Pt);for(let wt=0;wt<G.locationSize;wt++)x(G.location+wt,mt/G.locationSize,q,at,ut*k,(st+mt/G.locationSize*wt)*k,Y)}else{if($.isInstancedBufferAttribute){for(let tt=0;tt<G.locationSize;tt++)p(G.location+tt,$.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let tt=0;tt<G.locationSize;tt++)g(G.location+tt);n.bindBuffer(n.ARRAY_BUFFER,Pt);for(let tt=0;tt<G.locationSize;tt++)x(G.location+tt,mt/G.locationSize,q,at,mt*k,mt/G.locationSize*tt*k,Y)}}else if(T!==void 0){const at=T[O];if(at!==void 0)switch(at.length){case 2:n.vertexAttrib2fv(G.location,at);break;case 3:n.vertexAttrib3fv(G.location,at);break;case 4:n.vertexAttrib4fv(G.location,at);break;default:n.vertexAttrib1fv(G.location,at)}}}}_()}function S(){R();for(const M in i){const P=i[M];for(const I in P){const D=P[I];for(const U in D)d(D[U].object),delete D[U];delete P[I]}delete i[M]}}function w(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const I in P){const D=P[I];for(const U in D)d(D[U].object),delete D[U];delete P[I]}delete i[M.id]}function E(M){for(const P in i){const I=i[P];if(I[M.id]===void 0)continue;const D=I[M.id];for(const U in D)d(D[U].object),delete D[U];delete I[M.id]}}function R(){b(),o=!0,s!==a&&(s=a,l(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:R,resetDefaultState:b,dispose:S,releaseStatesOfGeometry:w,releaseStatesOfProgram:E,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function UE(n,t,e){let i;function a(l){i=l}function s(l,d){n.drawArrays(i,l,d),e.update(d,i,1)}function o(l,d,u){u!==0&&(n.drawArraysInstanced(i,l,d,u),e.update(d,i,u))}function r(l,d,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,d,0,u);let f=0;for(let m=0;m<u;m++)f+=d[m];e.update(f,i,1)}function c(l,d,u,h){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)o(l[m],d[m],h[m]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,d,0,h,0,u);let m=0;for(let v=0;v<u;v++)m+=d[v]*h[v];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function NE(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(E){return!(E!==wi&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(E){const R=E===tr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==aa&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Ui&&!R)}function c(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=e.logarithmicDepthBuffer===!0,h=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=m>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:h,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:S,maxSamples:w}}function OE(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new Ya,r=new Me,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const f=u.length!==0||h||i!==0||a;return a=h,i=u.length,f},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){e=d(u,h,0)},this.setState=function(u,h,f){const m=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!a||m===null||m.length===0||s&&!g)s?d(null):l();else{const _=s?0:i,x=_*4;let y=p.clippingState||null;c.value=y,y=d(m,h,x,f);for(let S=0;S!==x;++S)y[S]=e[S];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function d(u,h,f,m){const v=u!==null?u.length:0;let g=null;if(v!==0){if(g=c.value,m!==!0||g===null){const p=f+v*4,_=h.matrixWorldInverse;r.getNormalMatrix(_),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,y=f;x!==v;++x,y+=4)o.copy(u[x]).applyMatrix4(_,r),o.normal.toArray(g,y),g[y+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function BE(n){let t=new WeakMap;function e(o,r){return r===bd?o.mapping=js:r===Sd&&(o.mapping=qs),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===bd||r===Sd)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new K1(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",a),e(l.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class e0 extends Jm{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,c=a-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,r-=d*this.view.offsetY,c=r-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Us=4,Ff=[.125,.215,.35,.446,.526,.582],qa=20,Ll=new e0,Uf=new ee;let Dl=null,kl=0,Il=0,zl=!1;const $a=(1+Math.sqrt(5))/2,Ps=1/$a,Nf=[new W(-$a,Ps,0),new W($a,Ps,0),new W(-Ps,0,$a),new W(Ps,0,$a),new W(0,$a,-Ps),new W(0,$a,Ps),new W(-1,1,-1),new W(1,1,-1),new W(-1,1,1),new W(1,1,1)];class Of{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){Dl=this._renderer.getRenderTarget(),kl=this._renderer.getActiveCubeFace(),Il=this._renderer.getActiveMipmapLevel(),zl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Dl,kl,Il),this._renderer.xr.enabled=zl,t.scissorTest=!1,kr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===js||t.mapping===qs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Dl=this._renderer.getRenderTarget(),kl=this._renderer.getActiveCubeFace(),Il=this._renderer.getActiveMipmapLevel(),zl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Fi,minFilter:Fi,generateMipmaps:!1,type:tr,format:wi,colorSpace:to,depthBuffer:!1},a=Bf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bf(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=HE(s)),this._blurMaterial=GE(s,t,e)}return a}_compileMaterial(t){const e=new ge(this._lodPlanes[0],t);this._renderer.compile(e,Ll)}_sceneToCubeUV(t,e,i,a){const r=new ui(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor(Uf),d.toneMapping=Sa,d.autoClear=!1;const f=new yn({name:"PMREM.Background",side:qn,depthWrite:!1,depthTest:!1}),m=new ge(new An,f);let v=!1;const g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,v=!0):(f.color.copy(Uf),v=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(r.up.set(0,c[p],0),r.lookAt(l[p],0,0)):_===1?(r.up.set(0,0,c[p]),r.lookAt(0,l[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,l[p]));const x=this._cubeSize;kr(a,_*x,p>2?x:0,x,x),d.setRenderTarget(a),v&&d.render(m,r),d.render(t,r)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=h,d.autoClear=u,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===js||t.mapping===qs;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hf());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new ge(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const c=this._cubeSize;kr(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,Ll)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=Nf[(a-s-1)%Nf.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new ge(this._lodPlanes[a],l),h=l.uniforms,f=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*qa-1),v=s/m,g=isFinite(s)?1+Math.floor(d*v):qa;g>qa&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${qa}`);const p=[];let _=0;for(let E=0;E<qa;++E){const R=E/v,b=Math.exp(-R*R/2);p.push(b),E===0?_+=b:E<g&&(_+=2*b)}for(let E=0;E<p.length;E++)p[E]=p[E]/_;h.envMap.value=t.texture,h.samples.value=g,h.weights.value=p,h.latitudinal.value=o==="latitudinal",r&&(h.poleAxis.value=r);const{_lodMax:x}=this;h.dTheta.value=m,h.mipInt.value=x-i;const y=this._sizeLods[a],S=3*y*(a>x-Us?a-x+Us:0),w=4*(this._cubeSize-y);kr(e,S,w,3*y,2*y),c.setRenderTarget(e),c.render(u,Ll)}}function HE(n){const t=[],e=[],i=[];let a=n;const s=n-Us+1+Ff.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let c=1/r;o>n-Us?c=Ff[o-n+Us-1]:o===0&&(c=0),i.push(c);const l=1/(r-2),d=-l,u=1+l,h=[d,d,u,d,u,u,d,d,u,u,d,u],f=6,m=6,v=3,g=2,p=1,_=new Float32Array(v*m*f),x=new Float32Array(g*m*f),y=new Float32Array(p*m*f);for(let w=0;w<f;w++){const E=w%3*2/3-1,R=w>2?0:-1,b=[E,R,0,E+2/3,R,0,E+2/3,R+1,0,E,R,0,E+2/3,R+1,0,E,R+1,0];_.set(b,v*m*w),x.set(h,g*m*w);const M=[w,w,w,w,w,w];y.set(M,p*m*w)}const S=new Qe;S.setAttribute("position",new rn(_,v)),S.setAttribute("uv",new rn(x,g)),S.setAttribute("faceIndex",new rn(y,p)),t.push(S),a>Us&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Bf(n,t,e){const i=new ns(n,t,e);return i.texture.mapping=Pc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function kr(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function GE(n,t,e){const i=new Float32Array(qa),a=new W(0,1,0);return new Aa({name:"SphericalGaussianBlur",defines:{n:qa,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Lh(),fragmentShader:`

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
		`,blending:ba,depthTest:!1,depthWrite:!1})}function Hf(){return new Aa({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Lh(),fragmentShader:`

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
		`,blending:ba,depthTest:!1,depthWrite:!1})}function Gf(){return new Aa({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Lh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ba,depthTest:!1,depthWrite:!1})}function Lh(){return`

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
	`}function XE(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===bd||c===Sd,d=c===js||c===qs;if(l||d){let u=t.get(r);const h=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==h)return e===null&&(e=new Of(n)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return l&&f&&f.height>0||d&&f&&a(f)?(e===null&&(e=new Of(n)),u=l?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",s),u.texture):null}}}return r}function a(r){let c=0;const l=6;for(let d=0;d<l;d++)r[d]!==void 0&&c++;return c===l}function s(r){const c=r.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function VE(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&Po("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function WE(n,t,e,i){const a={},s=new WeakMap;function o(u){const h=u.target;h.index!==null&&t.remove(h.index);for(const m in h.attributes)t.remove(h.attributes[m]);for(const m in h.morphAttributes){const v=h.morphAttributes[m];for(let g=0,p=v.length;g<p;g++)t.remove(v[g])}h.removeEventListener("dispose",o),delete a[h.id];const f=s.get(h);f&&(t.remove(f),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function r(u,h){return a[h.id]===!0||(h.addEventListener("dispose",o),a[h.id]=!0,e.memory.geometries++),h}function c(u){const h=u.attributes;for(const m in h)t.update(h[m],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const m in f){const v=f[m];for(let g=0,p=v.length;g<p;g++)t.update(v[g],n.ARRAY_BUFFER)}}function l(u){const h=[],f=u.index,m=u.attributes.position;let v=0;if(f!==null){const _=f.array;v=f.version;for(let x=0,y=_.length;x<y;x+=3){const S=_[x+0],w=_[x+1],E=_[x+2];h.push(S,w,w,E,E,S)}}else if(m!==void 0){const _=m.array;v=m.version;for(let x=0,y=_.length/3-1;x<y;x+=3){const S=x+0,w=x+1,E=x+2;h.push(S,w,w,E,E,S)}}else return;const g=new(Wm(h)?qm:jm)(h,1);g.version=v;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function d(u){const h=s.get(u);if(h){const f=u.index;f!==null&&h.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:r,update:c,getWireframeAttribute:d}}function YE(n,t,e){let i;function a(h){i=h}let s,o;function r(h){s=h.type,o=h.bytesPerElement}function c(h,f){n.drawElements(i,f,s,h*o),e.update(f,i,1)}function l(h,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,h*o,m),e.update(f,i,m))}function d(h,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,h,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,i,1)}function u(h,f,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<h.length;p++)l(h[p]/o,f[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,s,h,0,v,0,m);let p=0;for(let _=0;_<m;_++)p+=f[_]*v[_];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function $E(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function ZE(n,t,e){const i=new WeakMap,a=new on;function s(o,r,c){const l=o.morphTargetInfluences,d=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=d!==void 0?d.length:0;let h=i.get(r);if(h===void 0||h.count!==u){let M=function(){R.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var f=M;h!==void 0&&h.texture.dispose();const m=r.morphAttributes.position!==void 0,v=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],_=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let y=0;m===!0&&(y=1),v===!0&&(y=2),g===!0&&(y=3);let S=r.attributes.position.count*y,w=1;S>t.maxTextureSize&&(w=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const E=new Float32Array(S*w*4*u),R=new $m(E,S,w,u);R.type=Ui,R.needsUpdate=!0;const b=y*4;for(let P=0;P<u;P++){const I=p[P],D=_[P],U=x[P],C=S*w*4*P;for(let T=0;T<I.count;T++){const O=T*b;m===!0&&(a.fromBufferAttribute(I,T),E[C+O+0]=a.x,E[C+O+1]=a.y,E[C+O+2]=a.z,E[C+O+3]=0),v===!0&&(a.fromBufferAttribute(D,T),E[C+O+4]=a.x,E[C+O+5]=a.y,E[C+O+6]=a.z,E[C+O+7]=0),g===!0&&(a.fromBufferAttribute(U,T),E[C+O+8]=a.x,E[C+O+9]=a.y,E[C+O+10]=a.z,E[C+O+11]=U.itemSize===4?a.w:1)}}h={count:u,texture:R,size:new $t(S,w)},i.set(r,h),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<l.length;g++)m+=l[g];const v=r.morphTargetsRelative?1:1-m;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function jE(n,t,e,i){let a=new WeakMap;function s(c){const l=i.render.frame,d=c.geometry,u=t.get(c,d);if(a.get(u)!==l&&(t.update(u),a.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),a.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;a.get(h)!==l&&(h.update(),a.set(h,l))}return u}function o(){a=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}class n0 extends Dn{constructor(t,e,i,a,s,o,r,c,l,d=Hs){if(d!==Hs&&d!==Js)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Hs&&(i=es),i===void 0&&d===Js&&(i=Ks),super(null,a,s,o,r,c,d,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:oi,this.minFilter=c!==void 0?c:oi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const i0=new Dn,Xf=new n0(1,1),a0=new $m,s0=new z1,o0=new Qm,Vf=[],Wf=[],Yf=new Float32Array(16),$f=new Float32Array(9),Zf=new Float32Array(4);function io(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Vf[a];if(s===void 0&&(s=new Float32Array(a),Vf[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function Mn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function _n(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Lc(n,t){let e=Wf[t];e===void 0&&(e=new Int32Array(t),Wf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function qE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function KE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Mn(e,t))return;n.uniform2fv(this.addr,t),_n(e,t)}}function JE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Mn(e,t))return;n.uniform3fv(this.addr,t),_n(e,t)}}function QE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Mn(e,t))return;n.uniform4fv(this.addr,t),_n(e,t)}}function tT(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Mn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),_n(e,t)}else{if(Mn(e,i))return;Zf.set(i),n.uniformMatrix2fv(this.addr,!1,Zf),_n(e,i)}}function eT(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Mn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),_n(e,t)}else{if(Mn(e,i))return;$f.set(i),n.uniformMatrix3fv(this.addr,!1,$f),_n(e,i)}}function nT(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Mn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),_n(e,t)}else{if(Mn(e,i))return;Yf.set(i),n.uniformMatrix4fv(this.addr,!1,Yf),_n(e,i)}}function iT(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function aT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Mn(e,t))return;n.uniform2iv(this.addr,t),_n(e,t)}}function sT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Mn(e,t))return;n.uniform3iv(this.addr,t),_n(e,t)}}function oT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Mn(e,t))return;n.uniform4iv(this.addr,t),_n(e,t)}}function rT(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function cT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Mn(e,t))return;n.uniform2uiv(this.addr,t),_n(e,t)}}function lT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Mn(e,t))return;n.uniform3uiv(this.addr,t),_n(e,t)}}function dT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Mn(e,t))return;n.uniform4uiv(this.addr,t),_n(e,t)}}function hT(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Xf.compareFunction=Vm,s=Xf):s=i0,e.setTexture2D(t||s,a)}function uT(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||s0,a)}function fT(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||o0,a)}function pT(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||a0,a)}function mT(n){switch(n){case 5126:return qE;case 35664:return KE;case 35665:return JE;case 35666:return QE;case 35674:return tT;case 35675:return eT;case 35676:return nT;case 5124:case 35670:return iT;case 35667:case 35671:return aT;case 35668:case 35672:return sT;case 35669:case 35673:return oT;case 5125:return rT;case 36294:return cT;case 36295:return lT;case 36296:return dT;case 35678:case 36198:case 36298:case 36306:case 35682:return hT;case 35679:case 36299:case 36307:return uT;case 35680:case 36300:case 36308:case 36293:return fT;case 36289:case 36303:case 36311:case 36292:return pT}}function gT(n,t){n.uniform1fv(this.addr,t)}function xT(n,t){const e=io(t,this.size,2);n.uniform2fv(this.addr,e)}function vT(n,t){const e=io(t,this.size,3);n.uniform3fv(this.addr,e)}function yT(n,t){const e=io(t,this.size,4);n.uniform4fv(this.addr,e)}function MT(n,t){const e=io(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function _T(n,t){const e=io(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function bT(n,t){const e=io(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function ST(n,t){n.uniform1iv(this.addr,t)}function wT(n,t){n.uniform2iv(this.addr,t)}function ET(n,t){n.uniform3iv(this.addr,t)}function TT(n,t){n.uniform4iv(this.addr,t)}function AT(n,t){n.uniform1uiv(this.addr,t)}function RT(n,t){n.uniform2uiv(this.addr,t)}function PT(n,t){n.uniform3uiv(this.addr,t)}function CT(n,t){n.uniform4uiv(this.addr,t)}function LT(n,t,e){const i=this.cache,a=t.length,s=Lc(e,a);Mn(i,s)||(n.uniform1iv(this.addr,s),_n(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||i0,s[o])}function DT(n,t,e){const i=this.cache,a=t.length,s=Lc(e,a);Mn(i,s)||(n.uniform1iv(this.addr,s),_n(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||s0,s[o])}function kT(n,t,e){const i=this.cache,a=t.length,s=Lc(e,a);Mn(i,s)||(n.uniform1iv(this.addr,s),_n(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||o0,s[o])}function IT(n,t,e){const i=this.cache,a=t.length,s=Lc(e,a);Mn(i,s)||(n.uniform1iv(this.addr,s),_n(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||a0,s[o])}function zT(n){switch(n){case 5126:return gT;case 35664:return xT;case 35665:return vT;case 35666:return yT;case 35674:return MT;case 35675:return _T;case 35676:return bT;case 5124:case 35670:return ST;case 35667:case 35671:return wT;case 35668:case 35672:return ET;case 35669:case 35673:return TT;case 5125:return AT;case 36294:return RT;case 36295:return PT;case 36296:return CT;case 35678:case 36198:case 36298:case 36306:case 35682:return LT;case 35679:case 36299:case 36307:return DT;case 35680:case 36300:case 36308:case 36293:return kT;case 36289:case 36303:case 36311:case 36292:return IT}}class FT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=mT(e.type)}}class UT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=zT(e.type)}}class NT{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const Fl=/(\w+)(\])?(\[|\.)?/g;function jf(n,t){n.seq.push(t),n.map[t.id]=t}function OT(n,t,e){const i=n.name,a=i.length;for(Fl.lastIndex=0;;){const s=Fl.exec(i),o=Fl.lastIndex;let r=s[1];const c=s[2]==="]",l=s[3];if(c&&(r=r|0),l===void 0||l==="["&&o+2===a){jf(e,l===void 0?new FT(r,n,t):new UT(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new NT(r),jf(e,u)),e=u}}}class nc{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);OT(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function qf(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const BT=37297;let HT=0;function GT(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Kf=new Me;function XT(n){Te._getMatrix(Kf,Te.workingColorSpace,n);const t=`mat3( ${Kf.elements.map(e=>e.toFixed(4))} )`;switch(Te.getTransfer(n)){case Cc:return[t,"LinearTransferOETF"];case Be:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Jf(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+GT(n.getShaderSource(t),o)}else return a}function VT(n,t){const e=XT(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function WT(n,t){let e;switch(t){case $b:e="Linear";break;case Zb:e="Reinhard";break;case jb:e="Cineon";break;case qb:e="ACESFilmic";break;case Jb:e="AgX";break;case Qb:e="Neutral";break;case Kb:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ir=new W;function YT(){Te.getLuminanceCoefficients(Ir);const n=Ir.x.toFixed(4),t=Ir.y.toFixed(4),e=Ir.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $T(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Co).join(`
`)}function ZT(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function jT(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function Co(n){return n!==""}function Qf(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function tp(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const qT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Qd(n){return n.replace(qT,JT)}const KT=new Map;function JT(n,t){let e=be[t];if(e===void 0){const i=KT.get(t);if(i!==void 0)e=be[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Qd(e)}const QT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ep(n){return n.replace(QT,tA)}function tA(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function np(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function eA(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Lm?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Dm?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ji&&(t="SHADOWMAP_TYPE_VSM"),t}function nA(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case js:case qs:t="ENVMAP_TYPE_CUBE";break;case Pc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function iA(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case qs:t="ENVMAP_MODE_REFRACTION";break}return t}function aA(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case yh:t="ENVMAP_BLENDING_MULTIPLY";break;case Wb:t="ENVMAP_BLENDING_MIX";break;case Yb:t="ENVMAP_BLENDING_ADD";break}return t}function sA(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function oA(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const c=eA(e),l=nA(e),d=iA(e),u=aA(e),h=sA(e),f=$T(e),m=ZT(s),v=a.createProgram();let g,p,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Co).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Co).join(`
`),p.length>0&&(p+=`
`)):(g=[np(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Co).join(`
`),p=[np(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Sa?"#define TONE_MAPPING":"",e.toneMapping!==Sa?be.tonemapping_pars_fragment:"",e.toneMapping!==Sa?WT("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",be.colorspace_pars_fragment,VT("linearToOutputTexel",e.outputColorSpace),YT(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Co).join(`
`)),o=Qd(o),o=Qf(o,e),o=tp(o,e),r=Qd(r),r=Qf(r,e),r=tp(r,e),o=ep(o),r=ep(r),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===ff?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ff?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=_+g+o,y=_+p+r,S=qf(a,a.VERTEX_SHADER,x),w=qf(a,a.FRAGMENT_SHADER,y);a.attachShader(v,S),a.attachShader(v,w),e.index0AttributeName!==void 0?a.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(v,0,"position"),a.linkProgram(v);function E(P){if(n.debug.checkShaderErrors){const I=a.getProgramInfoLog(v).trim(),D=a.getShaderInfoLog(S).trim(),U=a.getShaderInfoLog(w).trim();let C=!0,T=!0;if(a.getProgramParameter(v,a.LINK_STATUS)===!1)if(C=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,v,S,w);else{const O=Jf(a,S,"vertex"),G=Jf(a,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(v,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+I+`
`+O+`
`+G)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(D===""||U==="")&&(T=!1);T&&(P.diagnostics={runnable:C,programLog:I,vertexShader:{log:D,prefix:g},fragmentShader:{log:U,prefix:p}})}a.deleteShader(S),a.deleteShader(w),R=new nc(a,v),b=jT(a,v)}let R;this.getUniforms=function(){return R===void 0&&E(this),R};let b;this.getAttributes=function(){return b===void 0&&E(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=a.getProgramParameter(v,BT)),M},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=HT++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=S,this.fragmentShader=w,this}let rA=0;class cA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new lA(t),e.set(t,i)),i}}class lA{constructor(t){this.id=rA++,this.code=t,this.usedTimes=0}}function dA(n,t,e,i,a,s,o){const r=new Ph,c=new cA,l=new Set,d=[],u=a.logarithmicDepthBuffer,h=a.vertexTextures;let f=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return l.add(b),b===0?"uv":`uv${b}`}function g(b,M,P,I,D){const U=I.fog,C=D.geometry,T=b.isMeshStandardMaterial?I.environment:null,O=(b.isMeshStandardMaterial?e:t).get(b.envMap||T),G=O&&O.mapping===Pc?O.image.height:null,$=m[b.type];b.precision!==null&&(f=a.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const at=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,mt=at!==void 0?at.length:0;let xt=0;C.morphAttributes.position!==void 0&&(xt=1),C.morphAttributes.normal!==void 0&&(xt=2),C.morphAttributes.color!==void 0&&(xt=3);let Pt,q,k,Y;if($){const ne=zi[$];Pt=ne.vertexShader,q=ne.fragmentShader}else Pt=b.vertexShader,q=b.fragmentShader,c.update(b),k=c.getVertexShaderID(b),Y=c.getFragmentShaderID(b);const tt=n.getRenderTarget(),ut=n.state.buffers.depth.getReversed(),st=D.isInstancedMesh===!0,wt=D.isBatchedMesh===!0,Zt=!!b.map,j=!!b.matcap,V=!!O,B=!!b.aoMap,zt=!!b.lightMap,kt=!!b.bumpMap,yt=!!b.normalMap,_t=!!b.displacementMap,K=!!b.emissiveMap,lt=!!b.metalnessMap,L=!!b.roughnessMap,A=b.anisotropy>0,Q=b.clearcoat>0,ht=b.dispersion>0,ft=b.iridescence>0,rt=b.sheen>0,It=b.transmission>0,Ct=A&&!!b.anisotropyMap,Mt=Q&&!!b.clearcoatMap,Xt=Q&&!!b.clearcoatNormalMap,pt=Q&&!!b.clearcoatRoughnessMap,Nt=ft&&!!b.iridescenceMap,Z=ft&&!!b.iridescenceThicknessMap,J=rt&&!!b.sheenColorMap,gt=rt&&!!b.sheenRoughnessMap,bt=!!b.specularMap,Ot=!!b.specularColorMap,Ft=!!b.specularIntensityMap,N=It&&!!b.transmissionMap,Tt=It&&!!b.thicknessMap,X=!!b.gradientMap,dt=!!b.alphaMap,Dt=b.alphaTest>0,Lt=!!b.alphaHash,qt=!!b.extensions;let se=Sa;b.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(se=n.toneMapping);const ue={shaderID:$,shaderType:b.type,shaderName:b.name,vertexShader:Pt,fragmentShader:q,defines:b.defines,customVertexShaderID:k,customFragmentShaderID:Y,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:wt,batchingColor:wt&&D._colorsTexture!==null,instancing:st,instancingColor:st&&D.instanceColor!==null,instancingMorph:st&&D.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:tt===null?n.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:to,alphaToCoverage:!!b.alphaToCoverage,map:Zt,matcap:j,envMap:V,envMapMode:V&&O.mapping,envMapCubeUVHeight:G,aoMap:B,lightMap:zt,bumpMap:kt,normalMap:yt,displacementMap:h&&_t,emissiveMap:K,normalMapObjectSpace:yt&&b.normalMapType===i1,normalMapTangentSpace:yt&&b.normalMapType===Xm,metalnessMap:lt,roughnessMap:L,anisotropy:A,anisotropyMap:Ct,clearcoat:Q,clearcoatMap:Mt,clearcoatNormalMap:Xt,clearcoatRoughnessMap:pt,dispersion:ht,iridescence:ft,iridescenceMap:Nt,iridescenceThicknessMap:Z,sheen:rt,sheenColorMap:J,sheenRoughnessMap:gt,specularMap:bt,specularColorMap:Ot,specularIntensityMap:Ft,transmission:It,transmissionMap:N,thicknessMap:Tt,gradientMap:X,opaque:b.transparent===!1&&b.blending===Bs&&b.alphaToCoverage===!1,alphaMap:dt,alphaTest:Dt,alphaHash:Lt,combine:b.combine,mapUv:Zt&&v(b.map.channel),aoMapUv:B&&v(b.aoMap.channel),lightMapUv:zt&&v(b.lightMap.channel),bumpMapUv:kt&&v(b.bumpMap.channel),normalMapUv:yt&&v(b.normalMap.channel),displacementMapUv:_t&&v(b.displacementMap.channel),emissiveMapUv:K&&v(b.emissiveMap.channel),metalnessMapUv:lt&&v(b.metalnessMap.channel),roughnessMapUv:L&&v(b.roughnessMap.channel),anisotropyMapUv:Ct&&v(b.anisotropyMap.channel),clearcoatMapUv:Mt&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:Xt&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pt&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Nt&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:J&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:gt&&v(b.sheenRoughnessMap.channel),specularMapUv:bt&&v(b.specularMap.channel),specularColorMapUv:Ot&&v(b.specularColorMap.channel),specularIntensityMapUv:Ft&&v(b.specularIntensityMap.channel),transmissionMapUv:N&&v(b.transmissionMap.channel),thicknessMapUv:Tt&&v(b.thicknessMap.channel),alphaMapUv:dt&&v(b.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(yt||A),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!C.attributes.uv&&(Zt||dt),fog:!!U,useFog:b.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:ut,skinning:D.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:xt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:se,decodeVideoTexture:Zt&&b.map.isVideoTexture===!0&&Te.getTransfer(b.map.colorSpace)===Be,decodeVideoTextureEmissive:K&&b.emissiveMap.isVideoTexture===!0&&Te.getTransfer(b.emissiveMap.colorSpace)===Be,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Je,flipSided:b.side===qn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:qt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(qt&&b.extensions.multiDraw===!0||wt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ue.vertexUv1s=l.has(1),ue.vertexUv2s=l.has(2),ue.vertexUv3s=l.has(3),l.clear(),ue}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const P in b.defines)M.push(P),M.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(_(M,b),x(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function _(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function x(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function y(b){const M=m[b.type];let P;if(M){const I=zi[M];P=$1.clone(I.uniforms)}else P=b.uniforms;return P}function S(b,M){let P;for(let I=0,D=d.length;I<D;I++){const U=d[I];if(U.cacheKey===M){P=U,++P.usedTimes;break}}return P===void 0&&(P=new oA(n,M,b,s),d.push(P)),P}function w(b){if(--b.usedTimes===0){const M=d.indexOf(b);d[M]=d[d.length-1],d.pop(),b.destroy()}}function E(b){c.remove(b)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:y,acquireProgram:S,releaseProgram:w,releaseShaderCache:E,programs:d,dispose:R}}function hA(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,c){n.get(o)[r]=c}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function uA(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function ip(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function ap(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(u,h,f,m,v,g){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:h,material:f,groupOrder:m,renderOrder:u.renderOrder,z:v,group:g},n[t]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=v,p.group=g),t++,p}function r(u,h,f,m,v,g){const p=o(u,h,f,m,v,g);f.transmission>0?i.push(p):f.transparent===!0?a.push(p):e.push(p)}function c(u,h,f,m,v,g){const p=o(u,h,f,m,v,g);f.transmission>0?i.unshift(p):f.transparent===!0?a.unshift(p):e.unshift(p)}function l(u,h){e.length>1&&e.sort(u||uA),i.length>1&&i.sort(h||ip),a.length>1&&a.sort(h||ip)}function d(){for(let u=t,h=n.length;u<h;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:c,finish:d,sort:l}}function fA(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new ap,n.set(i,[o])):a>=s.length?(o=new ap,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function pA(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new W,color:new ee};break;case"SpotLight":e={position:new W,direction:new W,color:new ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new W,color:new ee,distance:0,decay:0};break;case"HemisphereLight":e={direction:new W,skyColor:new ee,groundColor:new ee};break;case"RectAreaLight":e={color:new ee,position:new W,halfWidth:new W,halfHeight:new W};break}return n[t.id]=e,e}}}function mA(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let gA=0;function xA(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function vA(n){const t=new pA,e=mA(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new W);const a=new W,s=new Ce,o=new Ce;function r(l){let d=0,u=0,h=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,_=0,x=0,y=0,S=0,w=0,E=0;l.sort(xA);for(let b=0,M=l.length;b<M;b++){const P=l[b],I=P.color,D=P.intensity,U=P.distance,C=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=I.r*D,u+=I.g*D,h+=I.b*D;else if(P.isLightProbe){for(let T=0;T<9;T++)i.probe[T].addScaledVector(P.sh.coefficients[T],D);E++}else if(P.isDirectionalLight){const T=t.get(P);if(T.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const O=P.shadow,G=e.get(P);G.shadowIntensity=O.intensity,G.shadowBias=O.bias,G.shadowNormalBias=O.normalBias,G.shadowRadius=O.radius,G.shadowMapSize=O.mapSize,i.directionalShadow[f]=G,i.directionalShadowMap[f]=C,i.directionalShadowMatrix[f]=P.shadow.matrix,_++}i.directional[f]=T,f++}else if(P.isSpotLight){const T=t.get(P);T.position.setFromMatrixPosition(P.matrixWorld),T.color.copy(I).multiplyScalar(D),T.distance=U,T.coneCos=Math.cos(P.angle),T.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),T.decay=P.decay,i.spot[v]=T;const O=P.shadow;if(P.map&&(i.spotLightMap[S]=P.map,S++,O.updateMatrices(P),P.castShadow&&w++),i.spotLightMatrix[v]=O.matrix,P.castShadow){const G=e.get(P);G.shadowIntensity=O.intensity,G.shadowBias=O.bias,G.shadowNormalBias=O.normalBias,G.shadowRadius=O.radius,G.shadowMapSize=O.mapSize,i.spotShadow[v]=G,i.spotShadowMap[v]=C,y++}v++}else if(P.isRectAreaLight){const T=t.get(P);T.color.copy(I).multiplyScalar(D),T.halfWidth.set(P.width*.5,0,0),T.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=T,g++}else if(P.isPointLight){const T=t.get(P);if(T.color.copy(P.color).multiplyScalar(P.intensity),T.distance=P.distance,T.decay=P.decay,P.castShadow){const O=P.shadow,G=e.get(P);G.shadowIntensity=O.intensity,G.shadowBias=O.bias,G.shadowNormalBias=O.normalBias,G.shadowRadius=O.radius,G.shadowMapSize=O.mapSize,G.shadowCameraNear=O.camera.near,G.shadowCameraFar=O.camera.far,i.pointShadow[m]=G,i.pointShadowMap[m]=C,i.pointShadowMatrix[m]=P.shadow.matrix,x++}i.point[m]=T,m++}else if(P.isHemisphereLight){const T=t.get(P);T.skyColor.copy(P.color).multiplyScalar(D),T.groundColor.copy(P.groundColor).multiplyScalar(D),i.hemi[p]=T,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Wt.LTC_FLOAT_1,i.rectAreaLTC2=Wt.LTC_FLOAT_2):(i.rectAreaLTC1=Wt.LTC_HALF_1,i.rectAreaLTC2=Wt.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;const R=i.hash;(R.directionalLength!==f||R.pointLength!==m||R.spotLength!==v||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==_||R.numPointShadows!==x||R.numSpotShadows!==y||R.numSpotMaps!==S||R.numLightProbes!==E)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=y+S-w,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=E,R.directionalLength=f,R.pointLength=m,R.spotLength=v,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=_,R.numPointShadows=x,R.numSpotShadows=y,R.numSpotMaps=S,R.numLightProbes=E,i.version=gA++)}function c(l,d){let u=0,h=0,f=0,m=0,v=0;const g=d.matrixWorldInverse;for(let p=0,_=l.length;p<_;p++){const x=l[p];if(x.isDirectionalLight){const y=i.directional[u];y.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(g),u++}else if(x.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(g),f++}else if(x.isRectAreaLight){const y=i.rectArea[m];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const y=i.point[h];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),h++}else if(x.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(g),v++}}}return{setup:r,setupView:c,state:i}}function sp(n){const t=new vA(n),e=[],i=[];function a(d){l.camera=d,e.length=0,i.length=0}function s(d){e.push(d)}function o(d){i.push(d)}function r(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:l,setupLights:r,setupLightsView:c,pushLight:s,pushShadow:o}}function yA(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new sp(n),t.set(a,[r])):s>=o.length?(r=new sp(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class MA extends ss{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=e1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class _A extends ss{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const bA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,SA=`uniform sampler2D shadow_pass;
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
}`;function wA(n,t,e){let i=new Ch;const a=new $t,s=new $t,o=new on,r=new MA({depthPacking:n1}),c=new _A,l={},d=e.maxTextureSize,u={[Ta]:qn,[qn]:Ta,[Je]:Je},h=new Aa({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $t},radius:{value:4}},vertexShader:bA,fragmentShader:SA}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const m=new Qe;m.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ge(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lm;let p=this.type;this.render=function(w,E,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),I=n.state;I.setBlending(ba),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const D=p!==Ji&&this.type===Ji,U=p===Ji&&this.type!==Ji;for(let C=0,T=w.length;C<T;C++){const O=w[C],G=O.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",O,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;a.copy(G.mapSize);const $=G.getFrameExtents();if(a.multiply($),s.copy(G.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(s.x=Math.floor(d/$.x),a.x=s.x*$.x,G.mapSize.x=s.x),a.y>d&&(s.y=Math.floor(d/$.y),a.y=s.y*$.y,G.mapSize.y=s.y)),G.map===null||D===!0||U===!0){const mt=this.type!==Ji?{minFilter:oi,magFilter:oi}:{};G.map!==null&&G.map.dispose(),G.map=new ns(a.x,a.y,mt),G.map.texture.name=O.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();const at=G.getViewportCount();for(let mt=0;mt<at;mt++){const xt=G.getViewport(mt);o.set(s.x*xt.x,s.y*xt.y,s.x*xt.z,s.y*xt.w),I.viewport(o),G.updateMatrices(O,mt),i=G.getFrustum(),y(E,R,G.camera,O,this.type)}G.isPointLightShadow!==!0&&this.type===Ji&&_(G,R),G.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(b,M,P)};function _(w,E){const R=t.update(v);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new ns(a.x,a.y)),h.uniforms.shadow_pass.value=w.map.texture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(E,null,R,h,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(E,null,R,f,v,null)}function x(w,E,R,b){let M=null;const P=R.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(P!==void 0)M=P;else if(M=R.isPointLight===!0?c:r,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const I=M.uuid,D=E.uuid;let U=l[I];U===void 0&&(U={},l[I]=U);let C=U[D];C===void 0&&(C=M.clone(),U[D]=C,E.addEventListener("dispose",S)),M=C}if(M.visible=E.visible,M.wireframe=E.wireframe,b===Ji?M.side=E.shadowSide!==null?E.shadowSide:E.side:M.side=E.shadowSide!==null?E.shadowSide:u[E.side],M.alphaMap=E.alphaMap,M.alphaTest=E.alphaTest,M.map=E.map,M.clipShadows=E.clipShadows,M.clippingPlanes=E.clippingPlanes,M.clipIntersection=E.clipIntersection,M.displacementMap=E.displacementMap,M.displacementScale=E.displacementScale,M.displacementBias=E.displacementBias,M.wireframeLinewidth=E.wireframeLinewidth,M.linewidth=E.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const I=n.properties.get(M);I.light=R}return M}function y(w,E,R,b,M){if(w.visible===!1)return;if(w.layers.test(E.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===Ji)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,w.matrixWorld);const D=t.update(w),U=w.material;if(Array.isArray(U)){const C=D.groups;for(let T=0,O=C.length;T<O;T++){const G=C[T],$=U[G.materialIndex];if($&&$.visible){const at=x(w,$,b,M);w.onBeforeShadow(n,w,E,R,D,at,G),n.renderBufferDirect(R,null,D,at,w,G),w.onAfterShadow(n,w,E,R,D,at,G)}}}else if(U.visible){const C=x(w,U,b,M);w.onBeforeShadow(n,w,E,R,D,C,null),n.renderBufferDirect(R,null,D,C,w,null),w.onAfterShadow(n,w,E,R,D,C,null)}}const I=w.children;for(let D=0,U=I.length;D<U;D++)y(I[D],E,R,b,M)}function S(w){w.target.removeEventListener("dispose",S);for(const R in l){const b=l[R],M=w.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const EA={[md]:gd,[xd]:Md,[vd]:_d,[Zs]:yd,[gd]:md,[Md]:xd,[_d]:vd,[yd]:Zs};function TA(n,t){function e(){let N=!1;const Tt=new on;let X=null;const dt=new on(0,0,0,0);return{setMask:function(Dt){X!==Dt&&!N&&(n.colorMask(Dt,Dt,Dt,Dt),X=Dt)},setLocked:function(Dt){N=Dt},setClear:function(Dt,Lt,qt,se,ue){ue===!0&&(Dt*=se,Lt*=se,qt*=se),Tt.set(Dt,Lt,qt,se),dt.equals(Tt)===!1&&(n.clearColor(Dt,Lt,qt,se),dt.copy(Tt))},reset:function(){N=!1,X=null,dt.set(-1,0,0,0)}}}function i(){let N=!1,Tt=!1,X=null,dt=null,Dt=null;return{setReversed:function(Lt){if(Tt!==Lt){const qt=t.get("EXT_clip_control");Tt?qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.ZERO_TO_ONE_EXT):qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.NEGATIVE_ONE_TO_ONE_EXT);const se=Dt;Dt=null,this.setClear(se)}Tt=Lt},getReversed:function(){return Tt},setTest:function(Lt){Lt?tt(n.DEPTH_TEST):ut(n.DEPTH_TEST)},setMask:function(Lt){X!==Lt&&!N&&(n.depthMask(Lt),X=Lt)},setFunc:function(Lt){if(Tt&&(Lt=EA[Lt]),dt!==Lt){switch(Lt){case md:n.depthFunc(n.NEVER);break;case gd:n.depthFunc(n.ALWAYS);break;case xd:n.depthFunc(n.LESS);break;case Zs:n.depthFunc(n.LEQUAL);break;case vd:n.depthFunc(n.EQUAL);break;case yd:n.depthFunc(n.GEQUAL);break;case Md:n.depthFunc(n.GREATER);break;case _d:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}dt=Lt}},setLocked:function(Lt){N=Lt},setClear:function(Lt){Dt!==Lt&&(Tt&&(Lt=1-Lt),n.clearDepth(Lt),Dt=Lt)},reset:function(){N=!1,X=null,dt=null,Dt=null,Tt=!1}}}function a(){let N=!1,Tt=null,X=null,dt=null,Dt=null,Lt=null,qt=null,se=null,ue=null;return{setTest:function(ne){N||(ne?tt(n.STENCIL_TEST):ut(n.STENCIL_TEST))},setMask:function(ne){Tt!==ne&&!N&&(n.stencilMask(ne),Tt=ne)},setFunc:function(ne,Se,ke){(X!==ne||dt!==Se||Dt!==ke)&&(n.stencilFunc(ne,Se,ke),X=ne,dt=Se,Dt=ke)},setOp:function(ne,Se,ke){(Lt!==ne||qt!==Se||se!==ke)&&(n.stencilOp(ne,Se,ke),Lt=ne,qt=Se,se=ke)},setLocked:function(ne){N=ne},setClear:function(ne){ue!==ne&&(n.clearStencil(ne),ue=ne)},reset:function(){N=!1,Tt=null,X=null,dt=null,Dt=null,Lt=null,qt=null,se=null,ue=null}}}const s=new e,o=new i,r=new a,c=new WeakMap,l=new WeakMap;let d={},u={},h=new WeakMap,f=[],m=null,v=!1,g=null,p=null,_=null,x=null,y=null,S=null,w=null,E=new ee(0,0,0),R=0,b=!1,M=null,P=null,I=null,D=null,U=null;const C=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let T=!1,O=0;const G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(G)[1]),T=O>=1):G.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),T=O>=2);let $=null,at={};const mt=n.getParameter(n.SCISSOR_BOX),xt=n.getParameter(n.VIEWPORT),Pt=new on().fromArray(mt),q=new on().fromArray(xt);function k(N,Tt,X,dt){const Dt=new Uint8Array(4),Lt=n.createTexture();n.bindTexture(N,Lt),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let qt=0;qt<X;qt++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(Tt,0,n.RGBA,1,1,dt,0,n.RGBA,n.UNSIGNED_BYTE,Dt):n.texImage2D(Tt+qt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Dt);return Lt}const Y={};Y[n.TEXTURE_2D]=k(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=k(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=k(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=k(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),tt(n.DEPTH_TEST),o.setFunc(Zs),kt(!1),yt(lf),tt(n.CULL_FACE),B(ba);function tt(N){d[N]!==!0&&(n.enable(N),d[N]=!0)}function ut(N){d[N]!==!1&&(n.disable(N),d[N]=!1)}function st(N,Tt){return u[N]!==Tt?(n.bindFramebuffer(N,Tt),u[N]=Tt,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Tt),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Tt),!0):!1}function wt(N,Tt){let X=f,dt=!1;if(N){X=h.get(Tt),X===void 0&&(X=[],h.set(Tt,X));const Dt=N.textures;if(X.length!==Dt.length||X[0]!==n.COLOR_ATTACHMENT0){for(let Lt=0,qt=Dt.length;Lt<qt;Lt++)X[Lt]=n.COLOR_ATTACHMENT0+Lt;X.length=Dt.length,dt=!0}}else X[0]!==n.BACK&&(X[0]=n.BACK,dt=!0);dt&&n.drawBuffers(X)}function Zt(N){return m!==N?(n.useProgram(N),m=N,!0):!1}const j={[ja]:n.FUNC_ADD,[Rb]:n.FUNC_SUBTRACT,[Pb]:n.FUNC_REVERSE_SUBTRACT};j[Cb]=n.MIN,j[Lb]=n.MAX;const V={[Db]:n.ZERO,[kb]:n.ONE,[Ib]:n.SRC_COLOR,[fd]:n.SRC_ALPHA,[Bb]:n.SRC_ALPHA_SATURATE,[Nb]:n.DST_COLOR,[Fb]:n.DST_ALPHA,[zb]:n.ONE_MINUS_SRC_COLOR,[pd]:n.ONE_MINUS_SRC_ALPHA,[Ob]:n.ONE_MINUS_DST_COLOR,[Ub]:n.ONE_MINUS_DST_ALPHA,[Hb]:n.CONSTANT_COLOR,[Gb]:n.ONE_MINUS_CONSTANT_COLOR,[Xb]:n.CONSTANT_ALPHA,[Vb]:n.ONE_MINUS_CONSTANT_ALPHA};function B(N,Tt,X,dt,Dt,Lt,qt,se,ue,ne){if(N===ba){v===!0&&(ut(n.BLEND),v=!1);return}if(v===!1&&(tt(n.BLEND),v=!0),N!==Ab){if(N!==g||ne!==b){if((p!==ja||y!==ja)&&(n.blendEquation(n.FUNC_ADD),p=ja,y=ja),ne)switch(N){case Bs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ta:n.blendFunc(n.ONE,n.ONE);break;case df:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case hf:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Bs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ta:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case df:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case hf:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}_=null,x=null,S=null,w=null,E.set(0,0,0),R=0,g=N,b=ne}return}Dt=Dt||Tt,Lt=Lt||X,qt=qt||dt,(Tt!==p||Dt!==y)&&(n.blendEquationSeparate(j[Tt],j[Dt]),p=Tt,y=Dt),(X!==_||dt!==x||Lt!==S||qt!==w)&&(n.blendFuncSeparate(V[X],V[dt],V[Lt],V[qt]),_=X,x=dt,S=Lt,w=qt),(se.equals(E)===!1||ue!==R)&&(n.blendColor(se.r,se.g,se.b,ue),E.copy(se),R=ue),g=N,b=!1}function zt(N,Tt){N.side===Je?ut(n.CULL_FACE):tt(n.CULL_FACE);let X=N.side===qn;Tt&&(X=!X),kt(X),N.blending===Bs&&N.transparent===!1?B(ba):B(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const dt=N.stencilWrite;r.setTest(dt),dt&&(r.setMask(N.stencilWriteMask),r.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),r.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),K(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?tt(n.SAMPLE_ALPHA_TO_COVERAGE):ut(n.SAMPLE_ALPHA_TO_COVERAGE)}function kt(N){M!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),M=N)}function yt(N){N!==Eb?(tt(n.CULL_FACE),N!==P&&(N===lf?n.cullFace(n.BACK):N===Tb?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ut(n.CULL_FACE),P=N}function _t(N){N!==I&&(T&&n.lineWidth(N),I=N)}function K(N,Tt,X){N?(tt(n.POLYGON_OFFSET_FILL),(D!==Tt||U!==X)&&(n.polygonOffset(Tt,X),D=Tt,U=X)):ut(n.POLYGON_OFFSET_FILL)}function lt(N){N?tt(n.SCISSOR_TEST):ut(n.SCISSOR_TEST)}function L(N){N===void 0&&(N=n.TEXTURE0+C-1),$!==N&&(n.activeTexture(N),$=N)}function A(N,Tt,X){X===void 0&&($===null?X=n.TEXTURE0+C-1:X=$);let dt=at[X];dt===void 0&&(dt={type:void 0,texture:void 0},at[X]=dt),(dt.type!==N||dt.texture!==Tt)&&($!==X&&(n.activeTexture(X),$=X),n.bindTexture(N,Tt||Y[N]),dt.type=N,dt.texture=Tt)}function Q(){const N=at[$];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function ht(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ft(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function rt(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function It(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ct(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Mt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Xt(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function pt(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Nt(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Z(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function J(N){Pt.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),Pt.copy(N))}function gt(N){q.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),q.copy(N))}function bt(N,Tt){let X=l.get(Tt);X===void 0&&(X=new WeakMap,l.set(Tt,X));let dt=X.get(N);dt===void 0&&(dt=n.getUniformBlockIndex(Tt,N.name),X.set(N,dt))}function Ot(N,Tt){const dt=l.get(Tt).get(N);c.get(Tt)!==dt&&(n.uniformBlockBinding(Tt,dt,N.__bindingPointIndex),c.set(Tt,dt))}function Ft(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},$=null,at={},u={},h=new WeakMap,f=[],m=null,v=!1,g=null,p=null,_=null,x=null,y=null,S=null,w=null,E=new ee(0,0,0),R=0,b=!1,M=null,P=null,I=null,D=null,U=null,Pt.set(0,0,n.canvas.width,n.canvas.height),q.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:tt,disable:ut,bindFramebuffer:st,drawBuffers:wt,useProgram:Zt,setBlending:B,setMaterial:zt,setFlipSided:kt,setCullFace:yt,setLineWidth:_t,setPolygonOffset:K,setScissorTest:lt,activeTexture:L,bindTexture:A,unbindTexture:Q,compressedTexImage2D:ht,compressedTexImage3D:ft,texImage2D:Nt,texImage3D:Z,updateUBOMapping:bt,uniformBlockBinding:Ot,texStorage2D:Xt,texStorage3D:pt,texSubImage2D:rt,texSubImage3D:It,compressedTexSubImage2D:Ct,compressedTexSubImage3D:Mt,scissor:J,viewport:gt,reset:Ft}}function op(n,t,e,i){const a=AA(i);switch(e){case Um:return n*t;case Om:return n*t;case Bm:return n*t*2;case Sh:return n*t/a.components*a.byteLength;case wh:return n*t/a.components*a.byteLength;case Hm:return n*t*2/a.components*a.byteLength;case Eh:return n*t*2/a.components*a.byteLength;case Nm:return n*t*3/a.components*a.byteLength;case wi:return n*t*4/a.components*a.byteLength;case Th:return n*t*4/a.components*a.byteLength;case Kr:case Jr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Qr:case tc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ad:case Pd:return Math.max(n,16)*Math.max(t,8)/4;case Td:case Rd:return Math.max(n,8)*Math.max(t,8)/2;case Cd:case Ld:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Dd:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case kd:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Id:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case zd:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Fd:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Ud:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Nd:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Od:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Bd:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Hd:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Gd:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Xd:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Vd:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Wd:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Yd:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case ec:case $d:case Zd:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Gm:case jd:return Math.ceil(n/4)*Math.ceil(t/4)*8;case qd:case Kd:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function AA(n){switch(n){case aa:case Im:return{byteLength:1,components:1};case $o:case zm:case tr:return{byteLength:2,components:1};case _h:case bh:return{byteLength:2,components:4};case es:case Mh:case Ui:return{byteLength:4,components:1};case Fm:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function RA(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new $t,d=new WeakMap;let u;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(L,A){return f?new OffscreenCanvas(L,A):xc("canvas")}function v(L,A,Q){let ht=1;const ft=lt(L);if((ft.width>Q||ft.height>Q)&&(ht=Q/Math.max(ft.width,ft.height)),ht<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const rt=Math.floor(ht*ft.width),It=Math.floor(ht*ft.height);u===void 0&&(u=m(rt,It));const Ct=A?m(rt,It):u;return Ct.width=rt,Ct.height=It,Ct.getContext("2d").drawImage(L,0,0,rt,It),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ft.width+"x"+ft.height+") to ("+rt+"x"+It+")."),Ct}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ft.width+"x"+ft.height+")."),L;return L}function g(L){return L.generateMipmaps}function p(L){n.generateMipmap(L)}function _(L){return L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?n.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(L,A,Q,ht,ft=!1){if(L!==null){if(n[L]!==void 0)return n[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let rt=A;if(A===n.RED&&(Q===n.FLOAT&&(rt=n.R32F),Q===n.HALF_FLOAT&&(rt=n.R16F),Q===n.UNSIGNED_BYTE&&(rt=n.R8)),A===n.RED_INTEGER&&(Q===n.UNSIGNED_BYTE&&(rt=n.R8UI),Q===n.UNSIGNED_SHORT&&(rt=n.R16UI),Q===n.UNSIGNED_INT&&(rt=n.R32UI),Q===n.BYTE&&(rt=n.R8I),Q===n.SHORT&&(rt=n.R16I),Q===n.INT&&(rt=n.R32I)),A===n.RG&&(Q===n.FLOAT&&(rt=n.RG32F),Q===n.HALF_FLOAT&&(rt=n.RG16F),Q===n.UNSIGNED_BYTE&&(rt=n.RG8)),A===n.RG_INTEGER&&(Q===n.UNSIGNED_BYTE&&(rt=n.RG8UI),Q===n.UNSIGNED_SHORT&&(rt=n.RG16UI),Q===n.UNSIGNED_INT&&(rt=n.RG32UI),Q===n.BYTE&&(rt=n.RG8I),Q===n.SHORT&&(rt=n.RG16I),Q===n.INT&&(rt=n.RG32I)),A===n.RGB_INTEGER&&(Q===n.UNSIGNED_BYTE&&(rt=n.RGB8UI),Q===n.UNSIGNED_SHORT&&(rt=n.RGB16UI),Q===n.UNSIGNED_INT&&(rt=n.RGB32UI),Q===n.BYTE&&(rt=n.RGB8I),Q===n.SHORT&&(rt=n.RGB16I),Q===n.INT&&(rt=n.RGB32I)),A===n.RGBA_INTEGER&&(Q===n.UNSIGNED_BYTE&&(rt=n.RGBA8UI),Q===n.UNSIGNED_SHORT&&(rt=n.RGBA16UI),Q===n.UNSIGNED_INT&&(rt=n.RGBA32UI),Q===n.BYTE&&(rt=n.RGBA8I),Q===n.SHORT&&(rt=n.RGBA16I),Q===n.INT&&(rt=n.RGBA32I)),A===n.RGB&&Q===n.UNSIGNED_INT_5_9_9_9_REV&&(rt=n.RGB9_E5),A===n.RGBA){const It=ft?Cc:Te.getTransfer(ht);Q===n.FLOAT&&(rt=n.RGBA32F),Q===n.HALF_FLOAT&&(rt=n.RGBA16F),Q===n.UNSIGNED_BYTE&&(rt=It===Be?n.SRGB8_ALPHA8:n.RGBA8),Q===n.UNSIGNED_SHORT_4_4_4_4&&(rt=n.RGBA4),Q===n.UNSIGNED_SHORT_5_5_5_1&&(rt=n.RGB5_A1)}return(rt===n.R16F||rt===n.R32F||rt===n.RG16F||rt===n.RG32F||rt===n.RGBA16F||rt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function y(L,A){let Q;return L?A===null||A===es||A===Ks?Q=n.DEPTH24_STENCIL8:A===Ui?Q=n.DEPTH32F_STENCIL8:A===$o&&(Q=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===es||A===Ks?Q=n.DEPTH_COMPONENT24:A===Ui?Q=n.DEPTH_COMPONENT32F:A===$o&&(Q=n.DEPTH_COMPONENT16),Q}function S(L,A){return g(L)===!0||L.isFramebufferTexture&&L.minFilter!==oi&&L.minFilter!==Fi?Math.log2(Math.max(A.width,A.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?A.mipmaps.length:1}function w(L){const A=L.target;A.removeEventListener("dispose",w),R(A),A.isVideoTexture&&d.delete(A)}function E(L){const A=L.target;A.removeEventListener("dispose",E),M(A)}function R(L){const A=i.get(L);if(A.__webglInit===void 0)return;const Q=L.source,ht=h.get(Q);if(ht){const ft=ht[A.__cacheKey];ft.usedTimes--,ft.usedTimes===0&&b(L),Object.keys(ht).length===0&&h.delete(Q)}i.remove(L)}function b(L){const A=i.get(L);n.deleteTexture(A.__webglTexture);const Q=L.source,ht=h.get(Q);delete ht[A.__cacheKey],o.memory.textures--}function M(L){const A=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let ht=0;ht<6;ht++){if(Array.isArray(A.__webglFramebuffer[ht]))for(let ft=0;ft<A.__webglFramebuffer[ht].length;ft++)n.deleteFramebuffer(A.__webglFramebuffer[ht][ft]);else n.deleteFramebuffer(A.__webglFramebuffer[ht]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[ht])}else{if(Array.isArray(A.__webglFramebuffer))for(let ht=0;ht<A.__webglFramebuffer.length;ht++)n.deleteFramebuffer(A.__webglFramebuffer[ht]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ht=0;ht<A.__webglColorRenderbuffer.length;ht++)A.__webglColorRenderbuffer[ht]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[ht]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const Q=L.textures;for(let ht=0,ft=Q.length;ht<ft;ht++){const rt=i.get(Q[ht]);rt.__webglTexture&&(n.deleteTexture(rt.__webglTexture),o.memory.textures--),i.remove(Q[ht])}i.remove(L)}let P=0;function I(){P=0}function D(){const L=P;return L>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+a.maxTextures),P+=1,L}function U(L){const A=[];return A.push(L.wrapS),A.push(L.wrapT),A.push(L.wrapR||0),A.push(L.magFilter),A.push(L.minFilter),A.push(L.anisotropy),A.push(L.internalFormat),A.push(L.format),A.push(L.type),A.push(L.generateMipmaps),A.push(L.premultiplyAlpha),A.push(L.flipY),A.push(L.unpackAlignment),A.push(L.colorSpace),A.join()}function C(L,A){const Q=i.get(L);if(L.isVideoTexture&&_t(L),L.isRenderTargetTexture===!1&&L.version>0&&Q.__version!==L.version){const ht=L.image;if(ht===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ht.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(Q,L,A);return}}e.bindTexture(n.TEXTURE_2D,Q.__webglTexture,n.TEXTURE0+A)}function T(L,A){const Q=i.get(L);if(L.version>0&&Q.__version!==L.version){q(Q,L,A);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Q.__webglTexture,n.TEXTURE0+A)}function O(L,A){const Q=i.get(L);if(L.version>0&&Q.__version!==L.version){q(Q,L,A);return}e.bindTexture(n.TEXTURE_3D,Q.__webglTexture,n.TEXTURE0+A)}function G(L,A){const Q=i.get(L);if(L.version>0&&Q.__version!==L.version){k(Q,L,A);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture,n.TEXTURE0+A)}const $={[wd]:n.REPEAT,[Ka]:n.CLAMP_TO_EDGE,[Ed]:n.MIRRORED_REPEAT},at={[oi]:n.NEAREST,[t1]:n.NEAREST_MIPMAP_NEAREST,[pr]:n.NEAREST_MIPMAP_LINEAR,[Fi]:n.LINEAR,[dl]:n.LINEAR_MIPMAP_NEAREST,[Ja]:n.LINEAR_MIPMAP_LINEAR},mt={[a1]:n.NEVER,[d1]:n.ALWAYS,[s1]:n.LESS,[Vm]:n.LEQUAL,[o1]:n.EQUAL,[l1]:n.GEQUAL,[r1]:n.GREATER,[c1]:n.NOTEQUAL};function xt(L,A){if(A.type===Ui&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===Fi||A.magFilter===dl||A.magFilter===pr||A.magFilter===Ja||A.minFilter===Fi||A.minFilter===dl||A.minFilter===pr||A.minFilter===Ja)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(L,n.TEXTURE_WRAP_S,$[A.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,$[A.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,$[A.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,at[A.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,at[A.minFilter]),A.compareFunction&&(n.texParameteri(L,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(L,n.TEXTURE_COMPARE_FUNC,mt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===oi||A.minFilter!==pr&&A.minFilter!==Ja||A.type===Ui&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const Q=t.get("EXT_texture_filter_anisotropic");n.texParameterf(L,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,a.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function Pt(L,A){let Q=!1;L.__webglInit===void 0&&(L.__webglInit=!0,A.addEventListener("dispose",w));const ht=A.source;let ft=h.get(ht);ft===void 0&&(ft={},h.set(ht,ft));const rt=U(A);if(rt!==L.__cacheKey){ft[rt]===void 0&&(ft[rt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Q=!0),ft[rt].usedTimes++;const It=ft[L.__cacheKey];It!==void 0&&(ft[L.__cacheKey].usedTimes--,It.usedTimes===0&&b(A)),L.__cacheKey=rt,L.__webglTexture=ft[rt].texture}return Q}function q(L,A,Q){let ht=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ht=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ht=n.TEXTURE_3D);const ft=Pt(L,A),rt=A.source;e.bindTexture(ht,L.__webglTexture,n.TEXTURE0+Q);const It=i.get(rt);if(rt.version!==It.__version||ft===!0){e.activeTexture(n.TEXTURE0+Q);const Ct=Te.getPrimaries(Te.workingColorSpace),Mt=A.colorSpace===xa?null:Te.getPrimaries(A.colorSpace),Xt=A.colorSpace===xa||Ct===Mt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);let pt=v(A.image,!1,a.maxTextureSize);pt=K(A,pt);const Nt=s.convert(A.format,A.colorSpace),Z=s.convert(A.type);let J=x(A.internalFormat,Nt,Z,A.colorSpace,A.isVideoTexture);xt(ht,A);let gt;const bt=A.mipmaps,Ot=A.isVideoTexture!==!0,Ft=It.__version===void 0||ft===!0,N=rt.dataReady,Tt=S(A,pt);if(A.isDepthTexture)J=y(A.format===Js,A.type),Ft&&(Ot?e.texStorage2D(n.TEXTURE_2D,1,J,pt.width,pt.height):e.texImage2D(n.TEXTURE_2D,0,J,pt.width,pt.height,0,Nt,Z,null));else if(A.isDataTexture)if(bt.length>0){Ot&&Ft&&e.texStorage2D(n.TEXTURE_2D,Tt,J,bt[0].width,bt[0].height);for(let X=0,dt=bt.length;X<dt;X++)gt=bt[X],Ot?N&&e.texSubImage2D(n.TEXTURE_2D,X,0,0,gt.width,gt.height,Nt,Z,gt.data):e.texImage2D(n.TEXTURE_2D,X,J,gt.width,gt.height,0,Nt,Z,gt.data);A.generateMipmaps=!1}else Ot?(Ft&&e.texStorage2D(n.TEXTURE_2D,Tt,J,pt.width,pt.height),N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,pt.width,pt.height,Nt,Z,pt.data)):e.texImage2D(n.TEXTURE_2D,0,J,pt.width,pt.height,0,Nt,Z,pt.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Ot&&Ft&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Tt,J,bt[0].width,bt[0].height,pt.depth);for(let X=0,dt=bt.length;X<dt;X++)if(gt=bt[X],A.format!==wi)if(Nt!==null)if(Ot){if(N)if(A.layerUpdates.size>0){const Dt=op(gt.width,gt.height,A.format,A.type);for(const Lt of A.layerUpdates){const qt=gt.data.subarray(Lt*Dt/gt.data.BYTES_PER_ELEMENT,(Lt+1)*Dt/gt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,Lt,gt.width,gt.height,1,Nt,qt)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,0,gt.width,gt.height,pt.depth,Nt,gt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,X,J,gt.width,gt.height,pt.depth,0,gt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ot?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,0,gt.width,gt.height,pt.depth,Nt,Z,gt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,X,J,gt.width,gt.height,pt.depth,0,Nt,Z,gt.data)}else{Ot&&Ft&&e.texStorage2D(n.TEXTURE_2D,Tt,J,bt[0].width,bt[0].height);for(let X=0,dt=bt.length;X<dt;X++)gt=bt[X],A.format!==wi?Nt!==null?Ot?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,X,0,0,gt.width,gt.height,Nt,gt.data):e.compressedTexImage2D(n.TEXTURE_2D,X,J,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ot?N&&e.texSubImage2D(n.TEXTURE_2D,X,0,0,gt.width,gt.height,Nt,Z,gt.data):e.texImage2D(n.TEXTURE_2D,X,J,gt.width,gt.height,0,Nt,Z,gt.data)}else if(A.isDataArrayTexture)if(Ot){if(Ft&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Tt,J,pt.width,pt.height,pt.depth),N)if(A.layerUpdates.size>0){const X=op(pt.width,pt.height,A.format,A.type);for(const dt of A.layerUpdates){const Dt=pt.data.subarray(dt*X/pt.data.BYTES_PER_ELEMENT,(dt+1)*X/pt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,dt,pt.width,pt.height,1,Nt,Z,Dt)}A.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,pt.width,pt.height,pt.depth,Nt,Z,pt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,J,pt.width,pt.height,pt.depth,0,Nt,Z,pt.data);else if(A.isData3DTexture)Ot?(Ft&&e.texStorage3D(n.TEXTURE_3D,Tt,J,pt.width,pt.height,pt.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,pt.width,pt.height,pt.depth,Nt,Z,pt.data)):e.texImage3D(n.TEXTURE_3D,0,J,pt.width,pt.height,pt.depth,0,Nt,Z,pt.data);else if(A.isFramebufferTexture){if(Ft)if(Ot)e.texStorage2D(n.TEXTURE_2D,Tt,J,pt.width,pt.height);else{let X=pt.width,dt=pt.height;for(let Dt=0;Dt<Tt;Dt++)e.texImage2D(n.TEXTURE_2D,Dt,J,X,dt,0,Nt,Z,null),X>>=1,dt>>=1}}else if(bt.length>0){if(Ot&&Ft){const X=lt(bt[0]);e.texStorage2D(n.TEXTURE_2D,Tt,J,X.width,X.height)}for(let X=0,dt=bt.length;X<dt;X++)gt=bt[X],Ot?N&&e.texSubImage2D(n.TEXTURE_2D,X,0,0,Nt,Z,gt):e.texImage2D(n.TEXTURE_2D,X,J,Nt,Z,gt);A.generateMipmaps=!1}else if(Ot){if(Ft){const X=lt(pt);e.texStorage2D(n.TEXTURE_2D,Tt,J,X.width,X.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Nt,Z,pt)}else e.texImage2D(n.TEXTURE_2D,0,J,Nt,Z,pt);g(A)&&p(ht),It.__version=rt.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function k(L,A,Q){if(A.image.length!==6)return;const ht=Pt(L,A),ft=A.source;e.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+Q);const rt=i.get(ft);if(ft.version!==rt.__version||ht===!0){e.activeTexture(n.TEXTURE0+Q);const It=Te.getPrimaries(Te.workingColorSpace),Ct=A.colorSpace===xa?null:Te.getPrimaries(A.colorSpace),Mt=A.colorSpace===xa||It===Ct?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);const Xt=A.isCompressedTexture||A.image[0].isCompressedTexture,pt=A.image[0]&&A.image[0].isDataTexture,Nt=[];for(let dt=0;dt<6;dt++)!Xt&&!pt?Nt[dt]=v(A.image[dt],!0,a.maxCubemapSize):Nt[dt]=pt?A.image[dt].image:A.image[dt],Nt[dt]=K(A,Nt[dt]);const Z=Nt[0],J=s.convert(A.format,A.colorSpace),gt=s.convert(A.type),bt=x(A.internalFormat,J,gt,A.colorSpace),Ot=A.isVideoTexture!==!0,Ft=rt.__version===void 0||ht===!0,N=ft.dataReady;let Tt=S(A,Z);xt(n.TEXTURE_CUBE_MAP,A);let X;if(Xt){Ot&&Ft&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Tt,bt,Z.width,Z.height);for(let dt=0;dt<6;dt++){X=Nt[dt].mipmaps;for(let Dt=0;Dt<X.length;Dt++){const Lt=X[Dt];A.format!==wi?J!==null?Ot?N&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Dt,0,0,Lt.width,Lt.height,J,Lt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Dt,bt,Lt.width,Lt.height,0,Lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Dt,0,0,Lt.width,Lt.height,J,gt,Lt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Dt,bt,Lt.width,Lt.height,0,J,gt,Lt.data)}}}else{if(X=A.mipmaps,Ot&&Ft){X.length>0&&Tt++;const dt=lt(Nt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Tt,bt,dt.width,dt.height)}for(let dt=0;dt<6;dt++)if(pt){Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,Nt[dt].width,Nt[dt].height,J,gt,Nt[dt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,bt,Nt[dt].width,Nt[dt].height,0,J,gt,Nt[dt].data);for(let Dt=0;Dt<X.length;Dt++){const qt=X[Dt].image[dt].image;Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Dt+1,0,0,qt.width,qt.height,J,gt,qt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Dt+1,bt,qt.width,qt.height,0,J,gt,qt.data)}}else{Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,J,gt,Nt[dt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,bt,J,gt,Nt[dt]);for(let Dt=0;Dt<X.length;Dt++){const Lt=X[Dt];Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Dt+1,0,0,J,gt,Lt.image[dt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Dt+1,bt,J,gt,Lt.image[dt])}}}g(A)&&p(n.TEXTURE_CUBE_MAP),rt.__version=ft.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function Y(L,A,Q,ht,ft,rt){const It=s.convert(Q.format,Q.colorSpace),Ct=s.convert(Q.type),Mt=x(Q.internalFormat,It,Ct,Q.colorSpace),Xt=i.get(A),pt=i.get(Q);if(pt.__renderTarget=A,!Xt.__hasExternalTextures){const Nt=Math.max(1,A.width>>rt),Z=Math.max(1,A.height>>rt);ft===n.TEXTURE_3D||ft===n.TEXTURE_2D_ARRAY?e.texImage3D(ft,rt,Mt,Nt,Z,A.depth,0,It,Ct,null):e.texImage2D(ft,rt,Mt,Nt,Z,0,It,Ct,null)}e.bindFramebuffer(n.FRAMEBUFFER,L),yt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ht,ft,pt.__webglTexture,0,kt(A)):(ft===n.TEXTURE_2D||ft>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ft<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ht,ft,pt.__webglTexture,rt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function tt(L,A,Q){if(n.bindRenderbuffer(n.RENDERBUFFER,L),A.depthBuffer){const ht=A.depthTexture,ft=ht&&ht.isDepthTexture?ht.type:null,rt=y(A.stencilBuffer,ft),It=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ct=kt(A);yt(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ct,rt,A.width,A.height):Q?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ct,rt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,rt,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,It,n.RENDERBUFFER,L)}else{const ht=A.textures;for(let ft=0;ft<ht.length;ft++){const rt=ht[ft],It=s.convert(rt.format,rt.colorSpace),Ct=s.convert(rt.type),Mt=x(rt.internalFormat,It,Ct,rt.colorSpace),Xt=kt(A);Q&&yt(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Xt,Mt,A.width,A.height):yt(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Xt,Mt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,Mt,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ut(L,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,L),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ht=i.get(A.depthTexture);ht.__renderTarget=A,(!ht.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),C(A.depthTexture,0);const ft=ht.__webglTexture,rt=kt(A);if(A.depthTexture.format===Hs)yt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ft,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ft,0);else if(A.depthTexture.format===Js)yt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ft,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ft,0);else throw new Error("Unknown depthTexture format")}function st(L){const A=i.get(L),Q=L.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==L.depthTexture){const ht=L.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ht){const ft=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ht.removeEventListener("dispose",ft)};ht.addEventListener("dispose",ft),A.__depthDisposeCallback=ft}A.__boundDepthTexture=ht}if(L.depthTexture&&!A.__autoAllocateDepthBuffer){if(Q)throw new Error("target.depthTexture not supported in Cube render targets");ut(A.__webglFramebuffer,L)}else if(Q){A.__webglDepthbuffer=[];for(let ht=0;ht<6;ht++)if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[ht]),A.__webglDepthbuffer[ht]===void 0)A.__webglDepthbuffer[ht]=n.createRenderbuffer(),tt(A.__webglDepthbuffer[ht],L,!1);else{const ft=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=A.__webglDepthbuffer[ht];n.bindRenderbuffer(n.RENDERBUFFER,rt),n.framebufferRenderbuffer(n.FRAMEBUFFER,ft,n.RENDERBUFFER,rt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),tt(A.__webglDepthbuffer,L,!1);else{const ht=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ft=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ft),n.framebufferRenderbuffer(n.FRAMEBUFFER,ht,n.RENDERBUFFER,ft)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function wt(L,A,Q){const ht=i.get(L);A!==void 0&&Y(ht.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Q!==void 0&&st(L)}function Zt(L){const A=L.texture,Q=i.get(L),ht=i.get(A);L.addEventListener("dispose",E);const ft=L.textures,rt=L.isWebGLCubeRenderTarget===!0,It=ft.length>1;if(It||(ht.__webglTexture===void 0&&(ht.__webglTexture=n.createTexture()),ht.__version=A.version,o.memory.textures++),rt){Q.__webglFramebuffer=[];for(let Ct=0;Ct<6;Ct++)if(A.mipmaps&&A.mipmaps.length>0){Q.__webglFramebuffer[Ct]=[];for(let Mt=0;Mt<A.mipmaps.length;Mt++)Q.__webglFramebuffer[Ct][Mt]=n.createFramebuffer()}else Q.__webglFramebuffer[Ct]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){Q.__webglFramebuffer=[];for(let Ct=0;Ct<A.mipmaps.length;Ct++)Q.__webglFramebuffer[Ct]=n.createFramebuffer()}else Q.__webglFramebuffer=n.createFramebuffer();if(It)for(let Ct=0,Mt=ft.length;Ct<Mt;Ct++){const Xt=i.get(ft[Ct]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=n.createTexture(),o.memory.textures++)}if(L.samples>0&&yt(L)===!1){Q.__webglMultisampledFramebuffer=n.createFramebuffer(),Q.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Q.__webglMultisampledFramebuffer);for(let Ct=0;Ct<ft.length;Ct++){const Mt=ft[Ct];Q.__webglColorRenderbuffer[Ct]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Q.__webglColorRenderbuffer[Ct]);const Xt=s.convert(Mt.format,Mt.colorSpace),pt=s.convert(Mt.type),Nt=x(Mt.internalFormat,Xt,pt,Mt.colorSpace,L.isXRRenderTarget===!0),Z=kt(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,Z,Nt,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ct,n.RENDERBUFFER,Q.__webglColorRenderbuffer[Ct])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&(Q.__webglDepthRenderbuffer=n.createRenderbuffer(),tt(Q.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(rt){e.bindTexture(n.TEXTURE_CUBE_MAP,ht.__webglTexture),xt(n.TEXTURE_CUBE_MAP,A);for(let Ct=0;Ct<6;Ct++)if(A.mipmaps&&A.mipmaps.length>0)for(let Mt=0;Mt<A.mipmaps.length;Mt++)Y(Q.__webglFramebuffer[Ct][Mt],L,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ct,Mt);else Y(Q.__webglFramebuffer[Ct],L,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Ct,0);g(A)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(It){for(let Ct=0,Mt=ft.length;Ct<Mt;Ct++){const Xt=ft[Ct],pt=i.get(Xt);e.bindTexture(n.TEXTURE_2D,pt.__webglTexture),xt(n.TEXTURE_2D,Xt),Y(Q.__webglFramebuffer,L,Xt,n.COLOR_ATTACHMENT0+Ct,n.TEXTURE_2D,0),g(Xt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let Ct=n.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Ct=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Ct,ht.__webglTexture),xt(Ct,A),A.mipmaps&&A.mipmaps.length>0)for(let Mt=0;Mt<A.mipmaps.length;Mt++)Y(Q.__webglFramebuffer[Mt],L,A,n.COLOR_ATTACHMENT0,Ct,Mt);else Y(Q.__webglFramebuffer,L,A,n.COLOR_ATTACHMENT0,Ct,0);g(A)&&p(Ct),e.unbindTexture()}L.depthBuffer&&st(L)}function j(L){const A=L.textures;for(let Q=0,ht=A.length;Q<ht;Q++){const ft=A[Q];if(g(ft)){const rt=_(L),It=i.get(ft).__webglTexture;e.bindTexture(rt,It),p(rt),e.unbindTexture()}}}const V=[],B=[];function zt(L){if(L.samples>0){if(yt(L)===!1){const A=L.textures,Q=L.width,ht=L.height;let ft=n.COLOR_BUFFER_BIT;const rt=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,It=i.get(L),Ct=A.length>1;if(Ct)for(let Mt=0;Mt<A.length;Mt++)e.bindFramebuffer(n.FRAMEBUFFER,It.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,It.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,It.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,It.__webglFramebuffer);for(let Mt=0;Mt<A.length;Mt++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(ft|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(ft|=n.STENCIL_BUFFER_BIT)),Ct){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,It.__webglColorRenderbuffer[Mt]);const Xt=i.get(A[Mt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Xt,0)}n.blitFramebuffer(0,0,Q,ht,0,0,Q,ht,ft,n.NEAREST),c===!0&&(V.length=0,B.length=0,V.push(n.COLOR_ATTACHMENT0+Mt),L.depthBuffer&&L.resolveDepthBuffer===!1&&(V.push(rt),B.push(rt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,B)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,V))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Ct)for(let Mt=0;Mt<A.length;Mt++){e.bindFramebuffer(n.FRAMEBUFFER,It.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.RENDERBUFFER,It.__webglColorRenderbuffer[Mt]);const Xt=i.get(A[Mt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,It.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.TEXTURE_2D,Xt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,It.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const A=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function kt(L){return Math.min(a.maxSamples,L.samples)}function yt(L){const A=i.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function _t(L){const A=o.render.frame;d.get(L)!==A&&(d.set(L,A),L.update())}function K(L,A){const Q=L.colorSpace,ht=L.format,ft=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||Q!==to&&Q!==xa&&(Te.getTransfer(Q)===Be?(ht!==wi||ft!==aa)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Q)),A}function lt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=I,this.setTexture2D=C,this.setTexture2DArray=T,this.setTexture3D=O,this.setTextureCube=G,this.rebindTextures=wt,this.setupRenderTarget=Zt,this.updateRenderTargetMipmap=j,this.updateMultisampleRenderTarget=zt,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=Y,this.useMultisampledRTT=yt}function PA(n,t){function e(i,a=xa){let s;const o=Te.getTransfer(a);if(i===aa)return n.UNSIGNED_BYTE;if(i===_h)return n.UNSIGNED_SHORT_4_4_4_4;if(i===bh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Fm)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Im)return n.BYTE;if(i===zm)return n.SHORT;if(i===$o)return n.UNSIGNED_SHORT;if(i===Mh)return n.INT;if(i===es)return n.UNSIGNED_INT;if(i===Ui)return n.FLOAT;if(i===tr)return n.HALF_FLOAT;if(i===Um)return n.ALPHA;if(i===Nm)return n.RGB;if(i===wi)return n.RGBA;if(i===Om)return n.LUMINANCE;if(i===Bm)return n.LUMINANCE_ALPHA;if(i===Hs)return n.DEPTH_COMPONENT;if(i===Js)return n.DEPTH_STENCIL;if(i===Sh)return n.RED;if(i===wh)return n.RED_INTEGER;if(i===Hm)return n.RG;if(i===Eh)return n.RG_INTEGER;if(i===Th)return n.RGBA_INTEGER;if(i===Kr||i===Jr||i===Qr||i===tc)if(o===Be)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Kr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Jr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Qr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===tc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Kr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Jr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Qr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===tc)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Td||i===Ad||i===Rd||i===Pd)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Td)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ad)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Rd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Pd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Cd||i===Ld||i===Dd)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Cd||i===Ld)return o===Be?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Dd)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===kd||i===Id||i===zd||i===Fd||i===Ud||i===Nd||i===Od||i===Bd||i===Hd||i===Gd||i===Xd||i===Vd||i===Wd||i===Yd)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===kd)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Id)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===zd)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Fd)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ud)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Nd)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Od)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Bd)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Hd)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Gd)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Xd)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Vd)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Wd)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Yd)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ec||i===$d||i===Zd)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===ec)return o===Be?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===$d)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Zd)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Gm||i===jd||i===qd||i===Kd)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===ec)return s.COMPRESSED_RED_RGTC1_EXT;if(i===jd)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===qd)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Kd)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ks?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class CA extends ui{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class xe extends nn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const LA={type:"move"};class Ul{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),p=this._getHandJoint(l,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=d.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&h>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(LA)))}return r!==null&&(r.visible=a!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new xe;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const DA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,kA=`
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

}`;class IA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new Dn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Aa({vertexShader:DA,fragmentShader:kA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ge(new jn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class zA extends eo{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",c=1,l=null,d=null,u=null,h=null,f=null,m=null;const v=new IA,g=e.getContextAttributes();let p=null,_=null;const x=[],y=[],S=new $t;let w=null;const E=new ui;E.viewport=new on;const R=new ui;R.viewport=new on;const b=[E,R],M=new CA;let P=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let k=x[q];return k===void 0&&(k=new Ul,x[q]=k),k.getTargetRaySpace()},this.getControllerGrip=function(q){let k=x[q];return k===void 0&&(k=new Ul,x[q]=k),k.getGripSpace()},this.getHand=function(q){let k=x[q];return k===void 0&&(k=new Ul,x[q]=k),k.getHandSpace()};function D(q){const k=y.indexOf(q.inputSource);if(k===-1)return;const Y=x[k];Y!==void 0&&(Y.update(q.inputSource,q.frame,l||o),Y.dispatchEvent({type:q.type,data:q.inputSource}))}function U(){a.removeEventListener("select",D),a.removeEventListener("selectstart",D),a.removeEventListener("selectend",D),a.removeEventListener("squeeze",D),a.removeEventListener("squeezestart",D),a.removeEventListener("squeezeend",D),a.removeEventListener("end",U),a.removeEventListener("inputsourceschange",C);for(let q=0;q<x.length;q++){const k=y[q];k!==null&&(y[q]=null,x[q].disconnect(k))}P=null,I=null,v.reset(),t.setRenderTarget(p),f=null,h=null,u=null,a=null,_=null,Pt.stop(),i.isPresenting=!1,t.setPixelRatio(w),t.setSize(S.width,S.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){r=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(q){if(a=q,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",D),a.addEventListener("selectstart",D),a.addEventListener("selectend",D),a.addEventListener("squeeze",D),a.addEventListener("squeezestart",D),a.addEventListener("squeezeend",D),a.addEventListener("end",U),a.addEventListener("inputsourceschange",C),g.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(S),a.renderState.layers===void 0){const k={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(a,e,k),a.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new ns(f.framebufferWidth,f.framebufferHeight,{format:wi,type:aa,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let k=null,Y=null,tt=null;g.depth&&(tt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,k=g.stencil?Js:Hs,Y=g.stencil?Ks:es);const ut={colorFormat:e.RGBA8,depthFormat:tt,scaleFactor:s};u=new XRWebGLBinding(a,e),h=u.createProjectionLayer(ut),a.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),_=new ns(h.textureWidth,h.textureHeight,{format:wi,type:aa,depthTexture:new n0(h.textureWidth,h.textureHeight,Y,void 0,void 0,void 0,void 0,void 0,void 0,k),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await a.requestReferenceSpace(r),Pt.setContext(a),Pt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function C(q){for(let k=0;k<q.removed.length;k++){const Y=q.removed[k],tt=y.indexOf(Y);tt>=0&&(y[tt]=null,x[tt].disconnect(Y))}for(let k=0;k<q.added.length;k++){const Y=q.added[k];let tt=y.indexOf(Y);if(tt===-1){for(let st=0;st<x.length;st++)if(st>=y.length){y.push(Y),tt=st;break}else if(y[st]===null){y[st]=Y,tt=st;break}if(tt===-1)break}const ut=x[tt];ut&&ut.connect(Y)}}const T=new W,O=new W;function G(q,k,Y){T.setFromMatrixPosition(k.matrixWorld),O.setFromMatrixPosition(Y.matrixWorld);const tt=T.distanceTo(O),ut=k.projectionMatrix.elements,st=Y.projectionMatrix.elements,wt=ut[14]/(ut[10]-1),Zt=ut[14]/(ut[10]+1),j=(ut[9]+1)/ut[5],V=(ut[9]-1)/ut[5],B=(ut[8]-1)/ut[0],zt=(st[8]+1)/st[0],kt=wt*B,yt=wt*zt,_t=tt/(-B+zt),K=_t*-B;if(k.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(K),q.translateZ(_t),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),ut[10]===-1)q.projectionMatrix.copy(k.projectionMatrix),q.projectionMatrixInverse.copy(k.projectionMatrixInverse);else{const lt=wt+_t,L=Zt+_t,A=kt-K,Q=yt+(tt-K),ht=j*Zt/L*lt,ft=V*Zt/L*lt;q.projectionMatrix.makePerspective(A,Q,ht,ft,lt,L),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function $(q,k){k===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(k.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(a===null)return;let k=q.near,Y=q.far;v.texture!==null&&(v.depthNear>0&&(k=v.depthNear),v.depthFar>0&&(Y=v.depthFar)),M.near=R.near=E.near=k,M.far=R.far=E.far=Y,(P!==M.near||I!==M.far)&&(a.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,I=M.far),E.layers.mask=q.layers.mask|2,R.layers.mask=q.layers.mask|4,M.layers.mask=E.layers.mask|R.layers.mask;const tt=q.parent,ut=M.cameras;$(M,tt);for(let st=0;st<ut.length;st++)$(ut[st],tt);ut.length===2?G(M,E,R):M.projectionMatrix.copy(E.projectionMatrix),at(q,M,tt)};function at(q,k,Y){Y===null?q.matrix.copy(k.matrixWorld):(q.matrix.copy(Y.matrixWorld),q.matrix.invert(),q.matrix.multiply(k.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(k.projectionMatrix),q.projectionMatrixInverse.copy(k.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Zo*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function(q){c=q,h!==null&&(h.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let mt=null;function xt(q,k){if(d=k.getViewerPose(l||o),m=k,d!==null){const Y=d.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let tt=!1;Y.length!==M.cameras.length&&(M.cameras.length=0,tt=!0);for(let st=0;st<Y.length;st++){const wt=Y[st];let Zt=null;if(f!==null)Zt=f.getViewport(wt);else{const V=u.getViewSubImage(h,wt);Zt=V.viewport,st===0&&(t.setRenderTargetTextures(_,V.colorTexture,h.ignoreDepthValues?void 0:V.depthStencilTexture),t.setRenderTarget(_))}let j=b[st];j===void 0&&(j=new ui,j.layers.enable(st),j.viewport=new on,b[st]=j),j.matrix.fromArray(wt.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(wt.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(Zt.x,Zt.y,Zt.width,Zt.height),st===0&&(M.matrix.copy(j.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),tt===!0&&M.cameras.push(j)}const ut=a.enabledFeatures;if(ut&&ut.includes("depth-sensing")){const st=u.getDepthInformation(Y[0]);st&&st.isValid&&st.texture&&v.init(t,st,a.renderState)}}for(let Y=0;Y<x.length;Y++){const tt=y[Y],ut=x[Y];tt!==null&&ut!==void 0&&ut.update(tt,k,l||o)}mt&&mt(q,k),k.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:k}),m=null}const Pt=new t0;Pt.setAnimationLoop(xt),this.setAnimationLoop=function(q){mt=q},this.dispose=function(){}}}const Ha=new Bi,FA=new Ce;function UA(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Km(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,_,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),d(g,p)):p.isMeshStandardMaterial?(s(g,p),h(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),v(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?c(g,p,_,x):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===qn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===qn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const _=t.get(p),x=_.envMap,y=_.envMapRotation;x&&(g.envMap.value=x,Ha.copy(y),Ha.x*=-1,Ha.y*=-1,Ha.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Ha.y*=-1,Ha.z*=-1),g.envMapRotation.value.setFromMatrix4(FA.makeRotationFromEuler(Ha)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,_,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*_,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function d(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,_){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===qn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const _=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function NA(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,x){const y=x.program;i.uniformBlockBinding(_,y)}function l(_,x){let y=a[_.id];y===void 0&&(m(_),y=d(_),a[_.id]=y,_.addEventListener("dispose",g));const S=x.program;i.updateUBOMapping(_,S);const w=t.render.frame;s[_.id]!==w&&(h(_),s[_.id]=w)}function d(_){const x=u();_.__bindingPointIndex=x;const y=n.createBuffer(),S=_.__size,w=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,S,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,y),y}function u(){for(let _=0;_<r;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(_){const x=a[_.id],y=_.uniforms,S=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let w=0,E=y.length;w<E;w++){const R=Array.isArray(y[w])?y[w]:[y[w]];for(let b=0,M=R.length;b<M;b++){const P=R[b];if(f(P,w,b,S)===!0){const I=P.__offset,D=Array.isArray(P.value)?P.value:[P.value];let U=0;for(let C=0;C<D.length;C++){const T=D[C],O=v(T);typeof T=="number"||typeof T=="boolean"?(P.__data[0]=T,n.bufferSubData(n.UNIFORM_BUFFER,I+U,P.__data)):T.isMatrix3?(P.__data[0]=T.elements[0],P.__data[1]=T.elements[1],P.__data[2]=T.elements[2],P.__data[3]=0,P.__data[4]=T.elements[3],P.__data[5]=T.elements[4],P.__data[6]=T.elements[5],P.__data[7]=0,P.__data[8]=T.elements[6],P.__data[9]=T.elements[7],P.__data[10]=T.elements[8],P.__data[11]=0):(T.toArray(P.__data,U),U+=O.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(_,x,y,S){const w=_.value,E=x+"_"+y;if(S[E]===void 0)return typeof w=="number"||typeof w=="boolean"?S[E]=w:S[E]=w.clone(),!0;{const R=S[E];if(typeof w=="number"||typeof w=="boolean"){if(R!==w)return S[E]=w,!0}else if(R.equals(w)===!1)return R.copy(w),!0}return!1}function m(_){const x=_.uniforms;let y=0;const S=16;for(let E=0,R=x.length;E<R;E++){const b=Array.isArray(x[E])?x[E]:[x[E]];for(let M=0,P=b.length;M<P;M++){const I=b[M],D=Array.isArray(I.value)?I.value:[I.value];for(let U=0,C=D.length;U<C;U++){const T=D[U],O=v(T),G=y%S,$=G%O.boundary,at=G+$;y+=$,at!==0&&S-at<O.storage&&(y+=S-at),I.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=y,y+=O.storage}}}const w=y%S;return w>0&&(y+=S-w),_.__size=y,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function g(_){const x=_.target;x.removeEventListener("dispose",g);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const _ in a)n.deleteBuffer(a[_]);o=[],a={},s={}}return{bind:c,update:l,dispose:p}}class OA{constructor(t={}){const{canvas:e=A1(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const _=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Hn,this.toneMapping=Sa,this.toneMappingExposure=1;const y=this;let S=!1,w=0,E=0,R=null,b=-1,M=null;const P=new on,I=new on;let D=null;const U=new ee(0);let C=0,T=e.width,O=e.height,G=1,$=null,at=null;const mt=new on(0,0,T,O),xt=new on(0,0,T,O);let Pt=!1;const q=new Ch;let k=!1,Y=!1;const tt=new Ce,ut=new Ce,st=new W,wt=new on,Zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let j=!1;function V(){return R===null?G:1}let B=i;function zt(z,it){return e.getContext(z,it)}try{const z={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${vh}`),e.addEventListener("webglcontextlost",dt,!1),e.addEventListener("webglcontextrestored",Dt,!1),e.addEventListener("webglcontextcreationerror",Lt,!1),B===null){const it="webgl2";if(B=zt(it,z),B===null)throw zt(it)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(z){throw console.error("THREE.WebGLRenderer: "+z.message),z}let kt,yt,_t,K,lt,L,A,Q,ht,ft,rt,It,Ct,Mt,Xt,pt,Nt,Z,J,gt,bt,Ot,Ft,N;function Tt(){kt=new VE(B),kt.init(),Ot=new PA(B,kt),yt=new NE(B,kt,t,Ot),_t=new TA(B,kt),yt.reverseDepthBuffer&&h&&_t.buffers.depth.setReversed(!0),K=new $E(B),lt=new hA,L=new RA(B,kt,_t,lt,yt,Ot,K),A=new BE(y),Q=new XE(y),ht=new tS(B),Ft=new FE(B,ht),ft=new WE(B,ht,K,Ft),rt=new jE(B,ft,ht,K),J=new ZE(B,yt,L),pt=new OE(lt),It=new dA(y,A,Q,kt,yt,Ft,pt),Ct=new UA(y,lt),Mt=new fA,Xt=new yA(kt),Z=new zE(y,A,Q,_t,rt,f,c),Nt=new wA(y,rt,yt),N=new NA(B,K,yt,_t),gt=new UE(B,kt,K),bt=new YE(B,kt,K),K.programs=It.programs,y.capabilities=yt,y.extensions=kt,y.properties=lt,y.renderLists=Mt,y.shadowMap=Nt,y.state=_t,y.info=K}Tt();const X=new zA(y,B);this.xr=X,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const z=kt.get("WEBGL_lose_context");z&&z.loseContext()},this.forceContextRestore=function(){const z=kt.get("WEBGL_lose_context");z&&z.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(z){z!==void 0&&(G=z,this.setSize(T,O,!1))},this.getSize=function(z){return z.set(T,O)},this.setSize=function(z,it,ct=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}T=z,O=it,e.width=Math.floor(z*G),e.height=Math.floor(it*G),ct===!0&&(e.style.width=z+"px",e.style.height=it+"px"),this.setViewport(0,0,z,it)},this.getDrawingBufferSize=function(z){return z.set(T*G,O*G).floor()},this.setDrawingBufferSize=function(z,it,ct){T=z,O=it,G=ct,e.width=Math.floor(z*ct),e.height=Math.floor(it*ct),this.setViewport(0,0,z,it)},this.getCurrentViewport=function(z){return z.copy(P)},this.getViewport=function(z){return z.copy(mt)},this.setViewport=function(z,it,ct,ot){z.isVector4?mt.set(z.x,z.y,z.z,z.w):mt.set(z,it,ct,ot),_t.viewport(P.copy(mt).multiplyScalar(G).round())},this.getScissor=function(z){return z.copy(xt)},this.setScissor=function(z,it,ct,ot){z.isVector4?xt.set(z.x,z.y,z.z,z.w):xt.set(z,it,ct,ot),_t.scissor(I.copy(xt).multiplyScalar(G).round())},this.getScissorTest=function(){return Pt},this.setScissorTest=function(z){_t.setScissorTest(Pt=z)},this.setOpaqueSort=function(z){$=z},this.setTransparentSort=function(z){at=z},this.getClearColor=function(z){return z.copy(Z.getClearColor())},this.setClearColor=function(){Z.setClearColor.apply(Z,arguments)},this.getClearAlpha=function(){return Z.getClearAlpha()},this.setClearAlpha=function(){Z.setClearAlpha.apply(Z,arguments)},this.clear=function(z=!0,it=!0,ct=!0){let ot=0;if(z){let nt=!1;if(R!==null){const Ut=R.texture.format;nt=Ut===Th||Ut===Eh||Ut===wh}if(nt){const Ut=R.texture.type,Gt=Ut===aa||Ut===es||Ut===$o||Ut===Ks||Ut===_h||Ut===bh,Jt=Z.getClearColor(),Kt=Z.getClearAlpha(),re=Jt.r,te=Jt.g,jt=Jt.b;Gt?(m[0]=re,m[1]=te,m[2]=jt,m[3]=Kt,B.clearBufferuiv(B.COLOR,0,m)):(v[0]=re,v[1]=te,v[2]=jt,v[3]=Kt,B.clearBufferiv(B.COLOR,0,v))}else ot|=B.COLOR_BUFFER_BIT}it&&(ot|=B.DEPTH_BUFFER_BIT),ct&&(ot|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(ot)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",dt,!1),e.removeEventListener("webglcontextrestored",Dt,!1),e.removeEventListener("webglcontextcreationerror",Lt,!1),Mt.dispose(),Xt.dispose(),lt.dispose(),A.dispose(),Q.dispose(),rt.dispose(),Ft.dispose(),N.dispose(),It.dispose(),X.dispose(),X.removeEventListener("sessionstart",Ae),X.removeEventListener("sessionend",dn),Re.stop()};function dt(z){z.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function Dt(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const z=K.autoReset,it=Nt.enabled,ct=Nt.autoUpdate,ot=Nt.needsUpdate,nt=Nt.type;Tt(),K.autoReset=z,Nt.enabled=it,Nt.autoUpdate=ct,Nt.needsUpdate=ot,Nt.type=nt}function Lt(z){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",z.statusMessage)}function qt(z){const it=z.target;it.removeEventListener("dispose",qt),se(it)}function se(z){ue(z),lt.remove(z)}function ue(z){const it=lt.get(z).programs;it!==void 0&&(it.forEach(function(ct){It.releaseProgram(ct)}),z.isShaderMaterial&&It.releaseShaderCache(z))}this.renderBufferDirect=function(z,it,ct,ot,nt,Ut){it===null&&(it=Zt);const Gt=nt.isMesh&&nt.matrixWorld.determinant()<0,Jt=Ei(z,it,ct,ot,nt);_t.setMaterial(ot,Gt);let Kt=ct.index,re=1;if(ot.wireframe===!0){if(Kt=ft.getWireframeAttribute(ct),Kt===void 0)return;re=2}const te=ct.drawRange,jt=ct.attributes.position;let ye=te.start*re,oe=(te.start+te.count)*re;Ut!==null&&(ye=Math.max(ye,Ut.start*re),oe=Math.min(oe,(Ut.start+Ut.count)*re)),Kt!==null?(ye=Math.max(ye,0),oe=Math.min(oe,Kt.count)):jt!=null&&(ye=Math.max(ye,0),oe=Math.min(oe,jt.count));const H=oe-ye;if(H<0||H===1/0)return;Ft.setup(nt,ot,Jt,ct,Kt);let Rt,At=gt;if(Kt!==null&&(Rt=ht.get(Kt),At=bt,At.setIndex(Rt)),nt.isMesh)ot.wireframe===!0?(_t.setLineWidth(ot.wireframeLinewidth*V()),At.setMode(B.LINES)):At.setMode(B.TRIANGLES);else if(nt.isLine){let Et=ot.linewidth;Et===void 0&&(Et=1),_t.setLineWidth(Et*V()),nt.isLineSegments?At.setMode(B.LINES):nt.isLineLoop?At.setMode(B.LINE_LOOP):At.setMode(B.LINE_STRIP)}else nt.isPoints?At.setMode(B.POINTS):nt.isSprite&&At.setMode(B.TRIANGLES);if(nt.isBatchedMesh)if(nt._multiDrawInstances!==null)At.renderMultiDrawInstances(nt._multiDrawStarts,nt._multiDrawCounts,nt._multiDrawCount,nt._multiDrawInstances);else if(kt.get("WEBGL_multi_draw"))At.renderMultiDraw(nt._multiDrawStarts,nt._multiDrawCounts,nt._multiDrawCount);else{const Et=nt._multiDrawStarts,ie=nt._multiDrawCounts,Ht=nt._multiDrawCount,ce=Kt?ht.get(Kt).bytesPerElement:1,He=lt.get(ot).currentProgram.getUniforms();for(let we=0;we<Ht;we++)He.setValue(B,"_gl_DrawID",we),At.render(Et[we]/ce,ie[we])}else if(nt.isInstancedMesh)At.renderInstances(ye,H,nt.count);else if(ct.isInstancedBufferGeometry){const Et=ct._maxInstanceCount!==void 0?ct._maxInstanceCount:1/0,ie=Math.min(ct.instanceCount,Et);At.renderInstances(ye,H,ie)}else At.render(ye,H)};function ne(z,it,ct){z.transparent===!0&&z.side===Je&&z.forceSinglePass===!1?(z.side=qn,z.needsUpdate=!0,En(z,it,ct),z.side=Ta,z.needsUpdate=!0,En(z,it,ct),z.side=Je):En(z,it,ct)}this.compile=function(z,it,ct=null){ct===null&&(ct=z),p=Xt.get(ct),p.init(it),x.push(p),ct.traverseVisible(function(nt){nt.isLight&&nt.layers.test(it.layers)&&(p.pushLight(nt),nt.castShadow&&p.pushShadow(nt))}),z!==ct&&z.traverseVisible(function(nt){nt.isLight&&nt.layers.test(it.layers)&&(p.pushLight(nt),nt.castShadow&&p.pushShadow(nt))}),p.setupLights();const ot=new Set;return z.traverse(function(nt){if(!(nt.isMesh||nt.isPoints||nt.isLine||nt.isSprite))return;const Ut=nt.material;if(Ut)if(Array.isArray(Ut))for(let Gt=0;Gt<Ut.length;Gt++){const Jt=Ut[Gt];ne(Jt,ct,nt),ot.add(Jt)}else ne(Ut,ct,nt),ot.add(Ut)}),x.pop(),p=null,ot},this.compileAsync=function(z,it,ct=null){const ot=this.compile(z,it,ct);return new Promise(nt=>{function Ut(){if(ot.forEach(function(Gt){lt.get(Gt).currentProgram.isReady()&&ot.delete(Gt)}),ot.size===0){nt(z);return}setTimeout(Ut,10)}kt.get("KHR_parallel_shader_compile")!==null?Ut():setTimeout(Ut,10)})};let Se=null;function ke(z){Se&&Se(z)}function Ae(){Re.stop()}function dn(){Re.start()}const Re=new t0;Re.setAnimationLoop(ke),typeof self<"u"&&Re.setContext(self),this.setAnimationLoop=function(z){Se=z,X.setAnimationLoop(z),z===null?Re.stop():Re.start()},X.addEventListener("sessionstart",Ae),X.addEventListener("sessionend",dn),this.render=function(z,it){if(it!==void 0&&it.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),it.parent===null&&it.matrixWorldAutoUpdate===!0&&it.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(it),it=X.getCamera()),z.isScene===!0&&z.onBeforeRender(y,z,it,R),p=Xt.get(z,x.length),p.init(it),x.push(p),ut.multiplyMatrices(it.projectionMatrix,it.matrixWorldInverse),q.setFromProjectionMatrix(ut),Y=this.localClippingEnabled,k=pt.init(this.clippingPlanes,Y),g=Mt.get(z,_.length),g.init(),_.push(g),X.enabled===!0&&X.isPresenting===!0){const Ut=y.xr.getDepthSensingMesh();Ut!==null&&Ue(Ut,it,-1/0,y.sortObjects)}Ue(z,it,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort($,at),j=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,j&&Z.addToRenderList(g,z),this.info.render.frame++,k===!0&&pt.beginShadows();const ct=p.state.shadowsArray;Nt.render(ct,z,it),k===!0&&pt.endShadows(),this.info.autoReset===!0&&this.info.reset();const ot=g.opaque,nt=g.transmissive;if(p.setupLights(),it.isArrayCamera){const Ut=it.cameras;if(nt.length>0)for(let Gt=0,Jt=Ut.length;Gt<Jt;Gt++){const Kt=Ut[Gt];Xn(ot,nt,z,Kt)}j&&Z.render(z);for(let Gt=0,Jt=Ut.length;Gt<Jt;Gt++){const Kt=Ut[Gt];mn(g,z,Kt,Kt.viewport)}}else nt.length>0&&Xn(ot,nt,z,it),j&&Z.render(z),mn(g,z,it);R!==null&&(L.updateMultisampleRenderTarget(R),L.updateRenderTargetMipmap(R)),z.isScene===!0&&z.onAfterRender(y,z,it),Ft.resetDefaultState(),b=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],k===!0&&pt.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,_.pop(),_.length>0?g=_[_.length-1]:g=null};function Ue(z,it,ct,ot){if(z.visible===!1)return;if(z.layers.test(it.layers)){if(z.isGroup)ct=z.renderOrder;else if(z.isLOD)z.autoUpdate===!0&&z.update(it);else if(z.isLight)p.pushLight(z),z.castShadow&&p.pushShadow(z);else if(z.isSprite){if(!z.frustumCulled||q.intersectsSprite(z)){ot&&wt.setFromMatrixPosition(z.matrixWorld).applyMatrix4(ut);const Gt=rt.update(z),Jt=z.material;Jt.visible&&g.push(z,Gt,Jt,ct,wt.z,null)}}else if((z.isMesh||z.isLine||z.isPoints)&&(!z.frustumCulled||q.intersectsObject(z))){const Gt=rt.update(z),Jt=z.material;if(ot&&(z.boundingSphere!==void 0?(z.boundingSphere===null&&z.computeBoundingSphere(),wt.copy(z.boundingSphere.center)):(Gt.boundingSphere===null&&Gt.computeBoundingSphere(),wt.copy(Gt.boundingSphere.center)),wt.applyMatrix4(z.matrixWorld).applyMatrix4(ut)),Array.isArray(Jt)){const Kt=Gt.groups;for(let re=0,te=Kt.length;re<te;re++){const jt=Kt[re],ye=Jt[jt.materialIndex];ye&&ye.visible&&g.push(z,Gt,ye,ct,wt.z,jt)}}else Jt.visible&&g.push(z,Gt,Jt,ct,wt.z,null)}}const Ut=z.children;for(let Gt=0,Jt=Ut.length;Gt<Jt;Gt++)Ue(Ut[Gt],it,ct,ot)}function mn(z,it,ct,ot){const nt=z.opaque,Ut=z.transmissive,Gt=z.transparent;p.setupLightsView(ct),k===!0&&pt.setGlobalState(y.clippingPlanes,ct),ot&&_t.viewport(P.copy(ot)),nt.length>0&&hn(nt,it,ct),Ut.length>0&&hn(Ut,it,ct),Gt.length>0&&hn(Gt,it,ct),_t.buffers.depth.setTest(!0),_t.buffers.depth.setMask(!0),_t.buffers.color.setMask(!0),_t.setPolygonOffset(!1)}function Xn(z,it,ct,ot){if((ct.isScene===!0?ct.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[ot.id]===void 0&&(p.state.transmissionRenderTarget[ot.id]=new ns(1,1,{generateMipmaps:!0,type:kt.has("EXT_color_buffer_half_float")||kt.has("EXT_color_buffer_float")?tr:aa,minFilter:Ja,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Te.workingColorSpace}));const Ut=p.state.transmissionRenderTarget[ot.id],Gt=ot.viewport||P;Ut.setSize(Gt.z,Gt.w);const Jt=y.getRenderTarget();y.setRenderTarget(Ut),y.getClearColor(U),C=y.getClearAlpha(),C<1&&y.setClearColor(16777215,.5),y.clear(),j&&Z.render(ct);const Kt=y.toneMapping;y.toneMapping=Sa;const re=ot.viewport;if(ot.viewport!==void 0&&(ot.viewport=void 0),p.setupLightsView(ot),k===!0&&pt.setGlobalState(y.clippingPlanes,ot),hn(z,ct,ot),L.updateMultisampleRenderTarget(Ut),L.updateRenderTargetMipmap(Ut),kt.has("WEBGL_multisampled_render_to_texture")===!1){let te=!1;for(let jt=0,ye=it.length;jt<ye;jt++){const oe=it[jt],H=oe.object,Rt=oe.geometry,At=oe.material,Et=oe.group;if(At.side===Je&&H.layers.test(ot.layers)){const ie=At.side;At.side=qn,At.needsUpdate=!0,kn(H,ct,ot,Rt,At,Et),At.side=ie,At.needsUpdate=!0,te=!0}}te===!0&&(L.updateMultisampleRenderTarget(Ut),L.updateRenderTargetMipmap(Ut))}y.setRenderTarget(Jt),y.setClearColor(U,C),re!==void 0&&(ot.viewport=re),y.toneMapping=Kt}function hn(z,it,ct){const ot=it.isScene===!0?it.overrideMaterial:null;for(let nt=0,Ut=z.length;nt<Ut;nt++){const Gt=z[nt],Jt=Gt.object,Kt=Gt.geometry,re=ot===null?Gt.material:ot,te=Gt.group;Jt.layers.test(ct.layers)&&kn(Jt,it,ct,Kt,re,te)}}function kn(z,it,ct,ot,nt,Ut){z.onBeforeRender(y,it,ct,ot,nt,Ut),z.modelViewMatrix.multiplyMatrices(ct.matrixWorldInverse,z.matrixWorld),z.normalMatrix.getNormalMatrix(z.modelViewMatrix),nt.onBeforeRender(y,it,ct,ot,z,Ut),nt.transparent===!0&&nt.side===Je&&nt.forceSinglePass===!1?(nt.side=qn,nt.needsUpdate=!0,y.renderBufferDirect(ct,it,ot,nt,z,Ut),nt.side=Ta,nt.needsUpdate=!0,y.renderBufferDirect(ct,it,ot,nt,z,Ut),nt.side=Je):y.renderBufferDirect(ct,it,ot,nt,z,Ut),z.onAfterRender(y,it,ct,ot,nt,Ut)}function En(z,it,ct){it.isScene!==!0&&(it=Zt);const ot=lt.get(z),nt=p.state.lights,Ut=p.state.shadowsArray,Gt=nt.state.version,Jt=It.getParameters(z,nt.state,Ut,it,ct),Kt=It.getProgramCacheKey(Jt);let re=ot.programs;ot.environment=z.isMeshStandardMaterial?it.environment:null,ot.fog=it.fog,ot.envMap=(z.isMeshStandardMaterial?Q:A).get(z.envMap||ot.environment),ot.envMapRotation=ot.environment!==null&&z.envMap===null?it.environmentRotation:z.envMapRotation,re===void 0&&(z.addEventListener("dispose",qt),re=new Map,ot.programs=re);let te=re.get(Kt);if(te!==void 0){if(ot.currentProgram===te&&ot.lightsStateVersion===Gt)return zn(z,Jt),te}else Jt.uniforms=It.getUniforms(z),z.onBeforeCompile(Jt,y),te=It.acquireProgram(Jt,Kt),re.set(Kt,te),ot.uniforms=Jt.uniforms;const jt=ot.uniforms;return(!z.isShaderMaterial&&!z.isRawShaderMaterial||z.clipping===!0)&&(jt.clippingPlanes=pt.uniform),zn(z,Jt),ot.needsLights=Vn(z),ot.lightsStateVersion=Gt,ot.needsLights&&(jt.ambientLightColor.value=nt.state.ambient,jt.lightProbe.value=nt.state.probe,jt.directionalLights.value=nt.state.directional,jt.directionalLightShadows.value=nt.state.directionalShadow,jt.spotLights.value=nt.state.spot,jt.spotLightShadows.value=nt.state.spotShadow,jt.rectAreaLights.value=nt.state.rectArea,jt.ltc_1.value=nt.state.rectAreaLTC1,jt.ltc_2.value=nt.state.rectAreaLTC2,jt.pointLights.value=nt.state.point,jt.pointLightShadows.value=nt.state.pointShadow,jt.hemisphereLights.value=nt.state.hemi,jt.directionalShadowMap.value=nt.state.directionalShadowMap,jt.directionalShadowMatrix.value=nt.state.directionalShadowMatrix,jt.spotShadowMap.value=nt.state.spotShadowMap,jt.spotLightMatrix.value=nt.state.spotLightMatrix,jt.spotLightMap.value=nt.state.spotLightMap,jt.pointShadowMap.value=nt.state.pointShadowMap,jt.pointShadowMatrix.value=nt.state.pointShadowMatrix),ot.currentProgram=te,ot.uniformsList=null,te}function In(z){if(z.uniformsList===null){const it=z.currentProgram.getUniforms();z.uniformsList=nc.seqWithValue(it.seq,z.uniforms)}return z.uniformsList}function zn(z,it){const ct=lt.get(z);ct.outputColorSpace=it.outputColorSpace,ct.batching=it.batching,ct.batchingColor=it.batchingColor,ct.instancing=it.instancing,ct.instancingColor=it.instancingColor,ct.instancingMorph=it.instancingMorph,ct.skinning=it.skinning,ct.morphTargets=it.morphTargets,ct.morphNormals=it.morphNormals,ct.morphColors=it.morphColors,ct.morphTargetsCount=it.morphTargetsCount,ct.numClippingPlanes=it.numClippingPlanes,ct.numIntersection=it.numClipIntersection,ct.vertexAlphas=it.vertexAlphas,ct.vertexTangents=it.vertexTangents,ct.toneMapping=it.toneMapping}function Ei(z,it,ct,ot,nt){it.isScene!==!0&&(it=Zt),L.resetTextureUnits();const Ut=it.fog,Gt=ot.isMeshStandardMaterial?it.environment:null,Jt=R===null?y.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:to,Kt=(ot.isMeshStandardMaterial?Q:A).get(ot.envMap||Gt),re=ot.vertexColors===!0&&!!ct.attributes.color&&ct.attributes.color.itemSize===4,te=!!ct.attributes.tangent&&(!!ot.normalMap||ot.anisotropy>0),jt=!!ct.morphAttributes.position,ye=!!ct.morphAttributes.normal,oe=!!ct.morphAttributes.color;let H=Sa;ot.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(H=y.toneMapping);const Rt=ct.morphAttributes.position||ct.morphAttributes.normal||ct.morphAttributes.color,At=Rt!==void 0?Rt.length:0,Et=lt.get(ot),ie=p.state.lights;if(k===!0&&(Y===!0||z!==M)){const Le=z===M&&ot.id===b;pt.setState(ot,z,Le)}let Ht=!1;ot.version===Et.__version?(Et.needsLights&&Et.lightsStateVersion!==ie.state.version||Et.outputColorSpace!==Jt||nt.isBatchedMesh&&Et.batching===!1||!nt.isBatchedMesh&&Et.batching===!0||nt.isBatchedMesh&&Et.batchingColor===!0&&nt.colorTexture===null||nt.isBatchedMesh&&Et.batchingColor===!1&&nt.colorTexture!==null||nt.isInstancedMesh&&Et.instancing===!1||!nt.isInstancedMesh&&Et.instancing===!0||nt.isSkinnedMesh&&Et.skinning===!1||!nt.isSkinnedMesh&&Et.skinning===!0||nt.isInstancedMesh&&Et.instancingColor===!0&&nt.instanceColor===null||nt.isInstancedMesh&&Et.instancingColor===!1&&nt.instanceColor!==null||nt.isInstancedMesh&&Et.instancingMorph===!0&&nt.morphTexture===null||nt.isInstancedMesh&&Et.instancingMorph===!1&&nt.morphTexture!==null||Et.envMap!==Kt||ot.fog===!0&&Et.fog!==Ut||Et.numClippingPlanes!==void 0&&(Et.numClippingPlanes!==pt.numPlanes||Et.numIntersection!==pt.numIntersection)||Et.vertexAlphas!==re||Et.vertexTangents!==te||Et.morphTargets!==jt||Et.morphNormals!==ye||Et.morphColors!==oe||Et.toneMapping!==H||Et.morphTargetsCount!==At)&&(Ht=!0):(Ht=!0,Et.__version=ot.version);let ce=Et.currentProgram;Ht===!0&&(ce=En(ot,it,nt));let He=!1,we=!1,Ie=!1;const me=ce.getUniforms(),_e=Et.uniforms;if(_t.useProgram(ce.program)&&(He=!0,we=!0,Ie=!0),ot.id!==b&&(b=ot.id,we=!0),He||M!==z){_t.buffers.depth.getReversed()?(tt.copy(z.projectionMatrix),P1(tt),C1(tt),me.setValue(B,"projectionMatrix",tt)):me.setValue(B,"projectionMatrix",z.projectionMatrix),me.setValue(B,"viewMatrix",z.matrixWorldInverse);const $e=me.map.cameraPosition;$e!==void 0&&$e.setValue(B,st.setFromMatrixPosition(z.matrixWorld)),yt.logarithmicDepthBuffer&&me.setValue(B,"logDepthBufFC",2/(Math.log(z.far+1)/Math.LN2)),(ot.isMeshPhongMaterial||ot.isMeshToonMaterial||ot.isMeshLambertMaterial||ot.isMeshBasicMaterial||ot.isMeshStandardMaterial||ot.isShaderMaterial)&&me.setValue(B,"isOrthographic",z.isOrthographicCamera===!0),M!==z&&(M=z,we=!0,Ie=!0)}if(nt.isSkinnedMesh){me.setOptional(B,nt,"bindMatrix"),me.setOptional(B,nt,"bindMatrixInverse");const Le=nt.skeleton;Le&&(Le.boneTexture===null&&Le.computeBoneTexture(),me.setValue(B,"boneTexture",Le.boneTexture,L))}nt.isBatchedMesh&&(me.setOptional(B,nt,"batchingTexture"),me.setValue(B,"batchingTexture",nt._matricesTexture,L),me.setOptional(B,nt,"batchingIdTexture"),me.setValue(B,"batchingIdTexture",nt._indirectTexture,L),me.setOptional(B,nt,"batchingColorTexture"),nt._colorsTexture!==null&&me.setValue(B,"batchingColorTexture",nt._colorsTexture,L));const Pe=ct.morphAttributes;if((Pe.position!==void 0||Pe.normal!==void 0||Pe.color!==void 0)&&J.update(nt,ct,ce),(we||Et.receiveShadow!==nt.receiveShadow)&&(Et.receiveShadow=nt.receiveShadow,me.setValue(B,"receiveShadow",nt.receiveShadow)),ot.isMeshGouraudMaterial&&ot.envMap!==null&&(_e.envMap.value=Kt,_e.flipEnvMap.value=Kt.isCubeTexture&&Kt.isRenderTargetTexture===!1?-1:1),ot.isMeshStandardMaterial&&ot.envMap===null&&it.environment!==null&&(_e.envMapIntensity.value=it.environmentIntensity),we&&(me.setValue(B,"toneMappingExposure",y.toneMappingExposure),Et.needsLights&&Ti(_e,Ie),Ut&&ot.fog===!0&&Ct.refreshFogUniforms(_e,Ut),Ct.refreshMaterialUniforms(_e,ot,G,O,p.state.transmissionRenderTarget[z.id]),nc.upload(B,In(Et),_e,L)),ot.isShaderMaterial&&ot.uniformsNeedUpdate===!0&&(nc.upload(B,In(Et),_e,L),ot.uniformsNeedUpdate=!1),ot.isSpriteMaterial&&me.setValue(B,"center",nt.center),me.setValue(B,"modelViewMatrix",nt.modelViewMatrix),me.setValue(B,"normalMatrix",nt.normalMatrix),me.setValue(B,"modelMatrix",nt.matrixWorld),ot.isShaderMaterial||ot.isRawShaderMaterial){const Le=ot.uniformsGroups;for(let $e=0,un=Le.length;$e<un;$e++){const Ai=Le[$e];N.update(Ai,ce),N.bind(Ai,ce)}}return ce}function Ti(z,it){z.ambientLightColor.needsUpdate=it,z.lightProbe.needsUpdate=it,z.directionalLights.needsUpdate=it,z.directionalLightShadows.needsUpdate=it,z.pointLights.needsUpdate=it,z.pointLightShadows.needsUpdate=it,z.spotLights.needsUpdate=it,z.spotLightShadows.needsUpdate=it,z.rectAreaLights.needsUpdate=it,z.hemisphereLights.needsUpdate=it}function Vn(z){return z.isMeshLambertMaterial||z.isMeshToonMaterial||z.isMeshPhongMaterial||z.isMeshStandardMaterial||z.isShadowMaterial||z.isShaderMaterial&&z.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(z,it,ct){lt.get(z.texture).__webglTexture=it,lt.get(z.depthTexture).__webglTexture=ct;const ot=lt.get(z);ot.__hasExternalTextures=!0,ot.__autoAllocateDepthBuffer=ct===void 0,ot.__autoAllocateDepthBuffer||kt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ot.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(z,it){const ct=lt.get(z);ct.__webglFramebuffer=it,ct.__useDefaultFramebuffer=it===void 0},this.setRenderTarget=function(z,it=0,ct=0){R=z,w=it,E=ct;let ot=!0,nt=null,Ut=!1,Gt=!1;if(z){const Kt=lt.get(z);if(Kt.__useDefaultFramebuffer!==void 0)_t.bindFramebuffer(B.FRAMEBUFFER,null),ot=!1;else if(Kt.__webglFramebuffer===void 0)L.setupRenderTarget(z);else if(Kt.__hasExternalTextures)L.rebindTextures(z,lt.get(z.texture).__webglTexture,lt.get(z.depthTexture).__webglTexture);else if(z.depthBuffer){const jt=z.depthTexture;if(Kt.__boundDepthTexture!==jt){if(jt!==null&&lt.has(jt)&&(z.width!==jt.image.width||z.height!==jt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(z)}}const re=z.texture;(re.isData3DTexture||re.isDataArrayTexture||re.isCompressedArrayTexture)&&(Gt=!0);const te=lt.get(z).__webglFramebuffer;z.isWebGLCubeRenderTarget?(Array.isArray(te[it])?nt=te[it][ct]:nt=te[it],Ut=!0):z.samples>0&&L.useMultisampledRTT(z)===!1?nt=lt.get(z).__webglMultisampledFramebuffer:Array.isArray(te)?nt=te[ct]:nt=te,P.copy(z.viewport),I.copy(z.scissor),D=z.scissorTest}else P.copy(mt).multiplyScalar(G).floor(),I.copy(xt).multiplyScalar(G).floor(),D=Pt;if(_t.bindFramebuffer(B.FRAMEBUFFER,nt)&&ot&&_t.drawBuffers(z,nt),_t.viewport(P),_t.scissor(I),_t.setScissorTest(D),Ut){const Kt=lt.get(z.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+it,Kt.__webglTexture,ct)}else if(Gt){const Kt=lt.get(z.texture),re=it||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,Kt.__webglTexture,ct||0,re)}b=-1},this.readRenderTargetPixels=function(z,it,ct,ot,nt,Ut,Gt){if(!(z&&z.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Jt=lt.get(z).__webglFramebuffer;if(z.isWebGLCubeRenderTarget&&Gt!==void 0&&(Jt=Jt[Gt]),Jt){_t.bindFramebuffer(B.FRAMEBUFFER,Jt);try{const Kt=z.texture,re=Kt.format,te=Kt.type;if(!yt.textureFormatReadable(re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!yt.textureTypeReadable(te)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}it>=0&&it<=z.width-ot&&ct>=0&&ct<=z.height-nt&&B.readPixels(it,ct,ot,nt,Ot.convert(re),Ot.convert(te),Ut)}finally{const Kt=R!==null?lt.get(R).__webglFramebuffer:null;_t.bindFramebuffer(B.FRAMEBUFFER,Kt)}}},this.readRenderTargetPixelsAsync=async function(z,it,ct,ot,nt,Ut,Gt){if(!(z&&z.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Jt=lt.get(z).__webglFramebuffer;if(z.isWebGLCubeRenderTarget&&Gt!==void 0&&(Jt=Jt[Gt]),Jt){const Kt=z.texture,re=Kt.format,te=Kt.type;if(!yt.textureFormatReadable(re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!yt.textureTypeReadable(te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(it>=0&&it<=z.width-ot&&ct>=0&&ct<=z.height-nt){_t.bindFramebuffer(B.FRAMEBUFFER,Jt);const jt=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,jt),B.bufferData(B.PIXEL_PACK_BUFFER,Ut.byteLength,B.STREAM_READ),B.readPixels(it,ct,ot,nt,Ot.convert(re),Ot.convert(te),0);const ye=R!==null?lt.get(R).__webglFramebuffer:null;_t.bindFramebuffer(B.FRAMEBUFFER,ye);const oe=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await R1(B,oe,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,jt),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,Ut),B.deleteBuffer(jt),B.deleteSync(oe),Ut}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(z,it=null,ct=0){z.isTexture!==!0&&(Po("WebGLRenderer: copyFramebufferToTexture function signature has changed."),it=arguments[0]||null,z=arguments[1]);const ot=Math.pow(2,-ct),nt=Math.floor(z.image.width*ot),Ut=Math.floor(z.image.height*ot),Gt=it!==null?it.x:0,Jt=it!==null?it.y:0;L.setTexture2D(z,0),B.copyTexSubImage2D(B.TEXTURE_2D,ct,0,0,Gt,Jt,nt,Ut),_t.unbindTexture()},this.copyTextureToTexture=function(z,it,ct=null,ot=null,nt=0){z.isTexture!==!0&&(Po("WebGLRenderer: copyTextureToTexture function signature has changed."),ot=arguments[0]||null,z=arguments[1],it=arguments[2],nt=arguments[3]||0,ct=null);let Ut,Gt,Jt,Kt,re,te,jt,ye,oe;const H=z.isCompressedTexture?z.mipmaps[nt]:z.image;ct!==null?(Ut=ct.max.x-ct.min.x,Gt=ct.max.y-ct.min.y,Jt=ct.isBox3?ct.max.z-ct.min.z:1,Kt=ct.min.x,re=ct.min.y,te=ct.isBox3?ct.min.z:0):(Ut=H.width,Gt=H.height,Jt=H.depth||1,Kt=0,re=0,te=0),ot!==null?(jt=ot.x,ye=ot.y,oe=ot.z):(jt=0,ye=0,oe=0);const Rt=Ot.convert(it.format),At=Ot.convert(it.type);let Et;it.isData3DTexture?(L.setTexture3D(it,0),Et=B.TEXTURE_3D):it.isDataArrayTexture||it.isCompressedArrayTexture?(L.setTexture2DArray(it,0),Et=B.TEXTURE_2D_ARRAY):(L.setTexture2D(it,0),Et=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,it.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,it.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,it.unpackAlignment);const ie=B.getParameter(B.UNPACK_ROW_LENGTH),Ht=B.getParameter(B.UNPACK_IMAGE_HEIGHT),ce=B.getParameter(B.UNPACK_SKIP_PIXELS),He=B.getParameter(B.UNPACK_SKIP_ROWS),we=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,H.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,H.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Kt),B.pixelStorei(B.UNPACK_SKIP_ROWS,re),B.pixelStorei(B.UNPACK_SKIP_IMAGES,te);const Ie=z.isDataArrayTexture||z.isData3DTexture,me=it.isDataArrayTexture||it.isData3DTexture;if(z.isRenderTargetTexture||z.isDepthTexture){const _e=lt.get(z),Pe=lt.get(it),Le=lt.get(_e.__renderTarget),$e=lt.get(Pe.__renderTarget);_t.bindFramebuffer(B.READ_FRAMEBUFFER,Le.__webglFramebuffer),_t.bindFramebuffer(B.DRAW_FRAMEBUFFER,$e.__webglFramebuffer);for(let un=0;un<Jt;un++)Ie&&B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,lt.get(z).__webglTexture,nt,te+un),z.isDepthTexture?(me&&B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,lt.get(it).__webglTexture,nt,oe+un),B.blitFramebuffer(Kt,re,Ut,Gt,jt,ye,Ut,Gt,B.DEPTH_BUFFER_BIT,B.NEAREST)):me?B.copyTexSubImage3D(Et,nt,jt,ye,oe+un,Kt,re,Ut,Gt):B.copyTexSubImage2D(Et,nt,jt,ye,oe+un,Kt,re,Ut,Gt);_t.bindFramebuffer(B.READ_FRAMEBUFFER,null),_t.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else me?z.isDataTexture||z.isData3DTexture?B.texSubImage3D(Et,nt,jt,ye,oe,Ut,Gt,Jt,Rt,At,H.data):it.isCompressedArrayTexture?B.compressedTexSubImage3D(Et,nt,jt,ye,oe,Ut,Gt,Jt,Rt,H.data):B.texSubImage3D(Et,nt,jt,ye,oe,Ut,Gt,Jt,Rt,At,H):z.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,nt,jt,ye,Ut,Gt,Rt,At,H.data):z.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,nt,jt,ye,H.width,H.height,Rt,H.data):B.texSubImage2D(B.TEXTURE_2D,nt,jt,ye,Ut,Gt,Rt,At,H);B.pixelStorei(B.UNPACK_ROW_LENGTH,ie),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Ht),B.pixelStorei(B.UNPACK_SKIP_PIXELS,ce),B.pixelStorei(B.UNPACK_SKIP_ROWS,He),B.pixelStorei(B.UNPACK_SKIP_IMAGES,we),nt===0&&it.generateMipmaps&&B.generateMipmap(Et),_t.unbindTexture()},this.copyTextureToTexture3D=function(z,it,ct=null,ot=null,nt=0){return z.isTexture!==!0&&(Po("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ct=arguments[0]||null,ot=arguments[1]||null,z=arguments[2],it=arguments[3],nt=arguments[4]||0),Po('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(z,it,ct,ot,nt)},this.initRenderTarget=function(z){lt.get(z).__webglFramebuffer===void 0&&L.setupRenderTarget(z)},this.initTexture=function(z){z.isCubeTexture?L.setTextureCube(z,0):z.isData3DTexture?L.setTexture3D(z,0):z.isDataArrayTexture||z.isCompressedArrayTexture?L.setTexture2DArray(z,0):L.setTexture2D(z,0),_t.unbindTexture()},this.resetState=function(){w=0,E=0,R=null,_t.reset(),Ft.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return na}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Te._getDrawingBufferColorSpace(t),e.unpackColorSpace=Te._getUnpackColorSpace()}}class BA extends nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Bi,this.environmentIntensity=1,this.environmentRotation=new Bi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class HA{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Jd,this.updateRanges=[],this.version=0,this.uuid=Oi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Oi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Oi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Un=new W;class vc{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.applyMatrix4(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.applyNormalMatrix(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Un.fromBufferAttribute(this,e),Un.transformDirection(t),this.setXYZ(e,Un.x,Un.y,Un.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Si(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Fe(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Fe(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Si(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Si(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Si(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Si(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Fe(e,this.array),i=Fe(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Fe(e,this.array),i=Fe(i,this.array),a=Fe(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Fe(e,this.array),i=Fe(i,this.array),a=Fe(a,this.array),s=Fe(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new rn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new vc(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class th extends ss{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ee(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Cs;const bo=new W,Ls=new W,Ds=new W,ks=new $t,So=new $t,r0=new Ce,zr=new W,wo=new W,Fr=new W,rp=new $t,Nl=new $t,cp=new $t;class lp extends nn{constructor(t=new th){if(super(),this.isSprite=!0,this.type="Sprite",Cs===void 0){Cs=new Qe;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new HA(e,5);Cs.setIndex([0,1,2,0,2,3]),Cs.setAttribute("position",new vc(i,3,0,!1)),Cs.setAttribute("uv",new vc(i,2,3,!1))}this.geometry=Cs,this.material=t,this.center=new $t(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ls.setFromMatrixScale(this.matrixWorld),r0.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ds.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ls.multiplyScalar(-Ds.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;Ur(zr.set(-.5,-.5,0),Ds,o,Ls,a,s),Ur(wo.set(.5,-.5,0),Ds,o,Ls,a,s),Ur(Fr.set(.5,.5,0),Ds,o,Ls,a,s),rp.set(0,0),Nl.set(1,0),cp.set(1,1);let r=t.ray.intersectTriangle(zr,wo,Fr,!1,bo);if(r===null&&(Ur(wo.set(-.5,.5,0),Ds,o,Ls,a,s),Nl.set(0,1),r=t.ray.intersectTriangle(zr,Fr,wo,!1,bo),r===null))return;const c=t.ray.origin.distanceTo(bo);c<t.near||c>t.far||e.push({distance:c,point:bo.clone(),uv:si.getInterpolation(bo,zr,wo,Fr,rp,Nl,cp,new $t),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ur(n,t,e,i,a,s){ks.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(So.x=s*ks.x-a*ks.y,So.y=a*ks.x+s*ks.y):So.copy(ks),n.copy(t),n.x+=So.x,n.y+=So.y,n.applyMatrix4(r0)}class GA extends Dn{constructor(t=null,e=1,i=1,a,s,o,r,c,l=oi,d=oi,u,h){super(null,o,r,c,l,d,a,s,u,h),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Uo extends rn{constructor(t,e,i,a=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Is=new Ce,dp=new Ce,Nr=[],hp=new as,XA=new Ce,Eo=new ge,To=new no;class up extends ge{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Uo(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,XA)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new as),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Is),hp.copy(t.boundingBox).applyMatrix4(Is),this.boundingBox.union(hp)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new no),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Is),To.copy(t.boundingSphere).applyMatrix4(Is),this.boundingSphere.union(To)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,a=this.morphTexture.source.data.data,s=i.length+1,o=t*s+1;for(let r=0;r<i.length;r++)i[r]=a[o+r]}raycast(t,e){const i=this.matrixWorld,a=this.count;if(Eo.geometry=this.geometry,Eo.material=this.material,Eo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),To.copy(this.boundingSphere),To.applyMatrix4(i),t.ray.intersectsSphere(To)!==!1))for(let s=0;s<a;s++){this.getMatrixAt(s,Is),dp.multiplyMatrices(i,Is),Eo.matrixWorld=dp,Eo.raycast(t,Nr);for(let o=0,r=Nr.length;o<r;o++){const c=Nr[o];c.instanceId=s,c.object=this,e.push(c)}Nr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Uo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new GA(new Float32Array(a*this.count),a,this.count,Sh,Ui));const s=this.morphTexture.source.data.data;let o=0;for(let l=0;l<i.length;l++)o+=i[l];const r=this.geometry.morphTargetsRelative?1:1-o,c=a*t;s[c]=r,s.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class eh extends ss{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const yc=new W,Mc=new W,fp=new Ce,Ao=new Rh,Or=new no,Ol=new W,pp=new W;class VA extends nn{constructor(t=new Qe,e=new eh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)yc.fromBufferAttribute(e,a-1),Mc.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=yc.distanceTo(Mc);t.setAttribute("lineDistance",new De(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Or.copy(i.boundingSphere),Or.applyMatrix4(a),Or.radius+=s,t.ray.intersectsSphere(Or)===!1)return;fp.copy(a).invert(),Ao.copy(t.ray).applyMatrix4(fp);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=l){const p=d.getX(v),_=d.getX(v+1),x=Br(this,t,Ao,c,p,_);x&&e.push(x)}if(this.isLineLoop){const v=d.getX(m-1),g=d.getX(f),p=Br(this,t,Ao,c,v,g);p&&e.push(p)}}else{const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=l){const p=Br(this,t,Ao,c,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=Br(this,t,Ao,c,m-1,f);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function Br(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(yc.fromBufferAttribute(o,a),Mc.fromBufferAttribute(o,s),e.distanceSqToSegment(yc,Mc,Ol,pp)>i)return;Ol.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Ol);if(!(c<t.near||c>t.far))return{distance:c,point:pp.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const mp=new W,gp=new W;class xp extends VA{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)mp.fromBufferAttribute(e,a),gp.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+mp.distanceTo(gp);t.setAttribute("lineDistance",new De(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class nh extends Dn{constructor(t,e,i,a,s,o,r,c,l){super(t,e,i,a,s,o,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Hi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,c=s-1,l;for(;r<=c;)if(a=Math.floor(r+(c-r)/2),l=i[a]-o,l<0)r=a+1;else if(l>0)c=a-1;else{c=a;break}if(a=c,i[a]===o)return a/(s-1);const d=i[a],h=i[a+1]-d,f=(o-d)/h;return(a+f)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),c=e||(o.isVector2?new $t:new W);return c.copy(r).sub(o).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new W,a=[],s=[],o=[],r=new W,c=new Ce;for(let f=0;f<=t;f++){const m=f/t;a[f]=this.getTangentAt(m,new W)}s[0]=new W,o[0]=new W;let l=Number.MAX_VALUE;const d=Math.abs(a[0].x),u=Math.abs(a[0].y),h=Math.abs(a[0].z);d<=l&&(l=d,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),h<=l&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),r.crossVectors(a[f-1],a[f]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(Tn(a[f-1].dot(a[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(r,m))}o[f].crossVectors(a[f],s[f])}if(e===!0){let f=Math.acos(Tn(s[0].dot(s[t]),-1,1));f/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(a[m],f*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Dh extends Hi{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new $t){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=c-this.aX,f=l-this.aY;c=h*d-f*u+this.aX,l=h*u+f*d+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class WA extends Dh{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function kh(){let n=0,t=0,e=0,i=0;function a(s,o,r,c){n=s,t=r,e=-3*s+3*o-2*r-c,i=2*s-2*o+r+c}return{initCatmullRom:function(s,o,r,c,l){a(o,r,l*(r-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,r,c,l,d,u){let h=(o-s)/l-(r-s)/(l+d)+(r-o)/d,f=(r-o)/d-(c-o)/(d+u)+(c-r)/u;h*=d,f*=d,a(o,r,h,f)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const Hr=new W,Bl=new kh,Hl=new kh,Gl=new kh;class YA extends Hi{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new W){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),c=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:c===0&&r===s-1&&(r=s-2,c=1);let l,d;this.closed||r>0?l=a[(r-1)%s]:(Hr.subVectors(a[0],a[1]).add(a[0]),l=Hr);const u=a[r%s],h=a[(r+1)%s];if(this.closed||r+2<s?d=a[(r+2)%s]:(Hr.subVectors(a[s-1],a[s-2]).add(a[s-1]),d=Hr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(h),f),g=Math.pow(h.distanceToSquared(d),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),Bl.initNonuniformCatmullRom(l.x,u.x,h.x,d.x,m,v,g),Hl.initNonuniformCatmullRom(l.y,u.y,h.y,d.y,m,v,g),Gl.initNonuniformCatmullRom(l.z,u.z,h.z,d.z,m,v,g)}else this.curveType==="catmullrom"&&(Bl.initCatmullRom(l.x,u.x,h.x,d.x,this.tension),Hl.initCatmullRom(l.y,u.y,h.y,d.y,this.tension),Gl.initCatmullRom(l.z,u.z,h.z,d.z,this.tension));return i.set(Bl.calc(c),Hl.calc(c),Gl.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new W().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function vp(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,c=n*r;return(2*e-2*i+s+o)*c+(-3*e+3*i-2*s-o)*r+s*n+e}function $A(n,t){const e=1-n;return e*e*t}function ZA(n,t){return 2*(1-n)*n*t}function jA(n,t){return n*n*t}function No(n,t,e,i){return $A(n,t)+ZA(n,e)+jA(n,i)}function qA(n,t){const e=1-n;return e*e*e*t}function KA(n,t){const e=1-n;return 3*e*e*n*t}function JA(n,t){return 3*(1-n)*n*n*t}function QA(n,t){return n*n*n*t}function Oo(n,t,e,i,a){return qA(n,t)+KA(n,e)+JA(n,i)+QA(n,a)}class c0 extends Hi{constructor(t=new $t,e=new $t,i=new $t,a=new $t){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new $t){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Oo(t,a.x,s.x,o.x,r.x),Oo(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class t2 extends Hi{constructor(t=new W,e=new W,i=new W,a=new W){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new W){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Oo(t,a.x,s.x,o.x,r.x),Oo(t,a.y,s.y,o.y,r.y),Oo(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class l0 extends Hi{constructor(t=new $t,e=new $t){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new $t){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new $t){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class e2 extends Hi{constructor(t=new W,e=new W){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new W){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new W){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class d0 extends Hi{constructor(t=new $t,e=new $t,i=new $t){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new $t){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(No(t,a.x,s.x,o.x),No(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class n2 extends Hi{constructor(t=new W,e=new W,i=new W){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new W){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(No(t,a.x,s.x,o.x),No(t,a.y,s.y,o.y),No(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class h0 extends Hi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new $t){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,c=a[o===0?o:o-1],l=a[o],d=a[o>a.length-2?a.length-1:o+1],u=a[o>a.length-3?a.length-1:o+2];return i.set(vp(r,c.x,l.x,d.x,u.x),vp(r,c.y,l.y,d.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new $t().fromArray(a))}return this}}var yp=Object.freeze({__proto__:null,ArcCurve:WA,CatmullRomCurve3:YA,CubicBezierCurve:c0,CubicBezierCurve3:t2,EllipseCurve:Dh,LineCurve:l0,LineCurve3:e2,QuadraticBezierCurve:d0,QuadraticBezierCurve3:n2,SplineCurve:h0});class i2 extends Hi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new yp[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],c=r.getLength(),l=c===0?0:1-o/c;return r.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(r);for(let l=0;l<c.length;l++){const d=c[l];i&&i.equals(d)||(e.push(d),i=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new yp[a.type]().fromJSON(a))}return this}}class Mp extends i2{constructor(t){super(),this.type="Path",this.currentPoint=new $t,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new l0(this.currentPoint.clone(),new $t(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new d0(this.currentPoint.clone(),new $t(t,e),new $t(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new c0(this.currentPoint.clone(),new $t(t,e),new $t(i,a),new $t(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new h0(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+l,e+d,i,a,s,o,r,c),this}absellipse(t,e,i,a,s,o,r,c){const l=new Dh(t,e,i,a,s,o,r,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Ih extends Qe{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],c=[],l=new W,d=new $t;o.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let u=0,h=3;u<=e;u++,h+=3){const f=i+u/e*a;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),r.push(0,0,1),d.x=(o[h]/t+1)/2,d.y=(o[h+1]/t+1)/2,c.push(d.x,d.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new De(o,3)),this.setAttribute("normal",new De(r,3)),this.setAttribute("uv",new De(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ih(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class jo extends Qe{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:c};const l=this;a=Math.floor(a),s=Math.floor(s);const d=[],u=[],h=[],f=[];let m=0;const v=[],g=i/2;let p=0;_(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(d),this.setAttribute("position",new De(u,3)),this.setAttribute("normal",new De(h,3)),this.setAttribute("uv",new De(f,2));function _(){const y=new W,S=new W;let w=0;const E=(e-t)/i;for(let R=0;R<=s;R++){const b=[],M=R/s,P=M*(e-t)+t;for(let I=0;I<=a;I++){const D=I/a,U=D*c+r,C=Math.sin(U),T=Math.cos(U);S.x=P*C,S.y=-M*i+g,S.z=P*T,u.push(S.x,S.y,S.z),y.set(C,E,T).normalize(),h.push(y.x,y.y,y.z),f.push(D,1-M),b.push(m++)}v.push(b)}for(let R=0;R<a;R++)for(let b=0;b<s;b++){const M=v[b][R],P=v[b+1][R],I=v[b+1][R+1],D=v[b][R+1];(t>0||b!==0)&&(d.push(M,P,D),w+=3),(e>0||b!==s-1)&&(d.push(P,I,D),w+=3)}l.addGroup(p,w,0),p+=w}function x(y){const S=m,w=new $t,E=new W;let R=0;const b=y===!0?t:e,M=y===!0?1:-1;for(let I=1;I<=a;I++)u.push(0,g*M,0),h.push(0,M,0),f.push(.5,.5),m++;const P=m;for(let I=0;I<=a;I++){const U=I/a*c+r,C=Math.cos(U),T=Math.sin(U);E.x=b*T,E.y=g*M,E.z=b*C,u.push(E.x,E.y,E.z),h.push(0,M,0),w.x=C*.5+.5,w.y=T*.5*M+.5,f.push(w.x,w.y),m++}for(let I=0;I<a;I++){const D=S+I,U=P+I;y===!0?d.push(U,U+1,D):d.push(U+1,U,D),R+=3}l.addGroup(p,R,y===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jo(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class zh extends jo{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new zh(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Fh extends Qe{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),l(i),d(),this.setAttribute("position",new De(s,3)),this.setAttribute("normal",new De(s.slice(),3)),this.setAttribute("uv",new De(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(_){const x=new W,y=new W,S=new W;for(let w=0;w<e.length;w+=3)f(e[w+0],x),f(e[w+1],y),f(e[w+2],S),c(x,y,S,_)}function c(_,x,y,S){const w=S+1,E=[];for(let R=0;R<=w;R++){E[R]=[];const b=_.clone().lerp(y,R/w),M=x.clone().lerp(y,R/w),P=w-R;for(let I=0;I<=P;I++)I===0&&R===w?E[R][I]=b:E[R][I]=b.clone().lerp(M,I/P)}for(let R=0;R<w;R++)for(let b=0;b<2*(w-R)-1;b++){const M=Math.floor(b/2);b%2===0?(h(E[R][M+1]),h(E[R+1][M]),h(E[R][M])):(h(E[R][M+1]),h(E[R+1][M+1]),h(E[R+1][M]))}}function l(_){const x=new W;for(let y=0;y<s.length;y+=3)x.x=s[y+0],x.y=s[y+1],x.z=s[y+2],x.normalize().multiplyScalar(_),s[y+0]=x.x,s[y+1]=x.y,s[y+2]=x.z}function d(){const _=new W;for(let x=0;x<s.length;x+=3){_.x=s[x+0],_.y=s[x+1],_.z=s[x+2];const y=g(_)/2/Math.PI+.5,S=p(_)/Math.PI+.5;o.push(y,1-S)}m(),u()}function u(){for(let _=0;_<o.length;_+=6){const x=o[_+0],y=o[_+2],S=o[_+4],w=Math.max(x,y,S),E=Math.min(x,y,S);w>.9&&E<.1&&(x<.2&&(o[_+0]+=1),y<.2&&(o[_+2]+=1),S<.2&&(o[_+4]+=1))}}function h(_){s.push(_.x,_.y,_.z)}function f(_,x){const y=_*3;x.x=t[y+0],x.y=t[y+1],x.z=t[y+2]}function m(){const _=new W,x=new W,y=new W,S=new W,w=new $t,E=new $t,R=new $t;for(let b=0,M=0;b<s.length;b+=9,M+=6){_.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),y.set(s[b+6],s[b+7],s[b+8]),w.set(o[M+0],o[M+1]),E.set(o[M+2],o[M+3]),R.set(o[M+4],o[M+5]),S.copy(_).add(x).add(y).divideScalar(3);const P=g(S);v(w,M+0,_,P),v(E,M+2,x,P),v(R,M+4,y,P)}}function v(_,x,y,S){S<0&&_.x===1&&(o[x]=_.x-1),y.x===0&&y.z===0&&(o[x]=S/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fh(t.vertices,t.indices,t.radius,t.details)}}const Gr=new W,Xr=new W,Xl=new W,Vr=new si;class a2 extends Qe{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(Gs*e),o=t.getIndex(),r=t.getAttribute("position"),c=o?o.count:r.count,l=[0,0,0],d=["a","b","c"],u=new Array(3),h={},f=[];for(let m=0;m<c;m+=3){o?(l[0]=o.getX(m),l[1]=o.getX(m+1),l[2]=o.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);const{a:v,b:g,c:p}=Vr;if(v.fromBufferAttribute(r,l[0]),g.fromBufferAttribute(r,l[1]),p.fromBufferAttribute(r,l[2]),Vr.getNormal(Xl),u[0]=`${Math.round(v.x*a)},${Math.round(v.y*a)},${Math.round(v.z*a)}`,u[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,u[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let _=0;_<3;_++){const x=(_+1)%3,y=u[_],S=u[x],w=Vr[d[_]],E=Vr[d[x]],R=`${y}_${S}`,b=`${S}_${y}`;b in h&&h[b]?(Xl.dot(h[b].normal)<=s&&(f.push(w.x,w.y,w.z),f.push(E.x,E.y,E.z)),h[b]=null):R in h||(h[R]={index0:l[_],index1:l[x],normal:Xl.clone()})}}for(const m in h)if(h[m]){const{index0:v,index1:g}=h[m];Gr.fromBufferAttribute(r,v),Xr.fromBufferAttribute(r,g),f.push(Gr.x,Gr.y,Gr.z),f.push(Xr.x,Xr.y,Xr.z)}this.setAttribute("position",new De(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class u0 extends Mp{constructor(t){super(t),this.uuid=Oi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new Mp().fromJSON(a))}return this}}const s2={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=f0(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,c,l,d,u,h,f;if(i&&(s=d2(n,t,s,e)),n.length>80*e){r=l=n[0],c=d=n[1];for(let m=e;m<a;m+=e)u=n[m],h=n[m+1],u<r&&(r=u),h<c&&(c=h),u>l&&(l=u),h>d&&(d=h);f=Math.max(l-r,d-c),f=f!==0?32767/f:0}return qo(s,o,e,r,c,f,0),o}};function f0(n,t,e,i,a){let s,o;if(a===_2(n,t,e,i)>0)for(s=t;s<e;s+=i)o=_p(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=_p(s,n[s],n[s+1],o);return o&&Dc(o,o.next)&&(Jo(o),o=o.next),o}function is(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Dc(e,e.next)||en(e.prev,e,e.next)===0)){if(Jo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function qo(n,t,e,i,a,s,o){if(!n)return;!o&&s&&m2(n,i,a,s);let r=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,s?r2(n,i,a,s):o2(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),Jo(n),n=l.next,r=l.next;continue}if(n=l,n===r){o?o===1?(n=c2(is(n),t,e),qo(n,t,e,i,a,s,2)):o===2&&l2(n,t,e,i,a,s):qo(is(n),t,e,i,a,s,1);break}}}function o2(n){const t=n.prev,e=n,i=n.next;if(en(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,c=e.y,l=i.y,d=a<s?a<o?a:o:s<o?s:o,u=r<c?r<l?r:l:c<l?c:l,h=a>s?a>o?a:o:s>o?s:o,f=r>c?r>l?r:l:c>l?c:l;let m=i.next;for(;m!==t;){if(m.x>=d&&m.x<=h&&m.y>=u&&m.y<=f&&Ns(a,r,s,c,o,l,m.x,m.y)&&en(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function r2(n,t,e,i){const a=n.prev,s=n,o=n.next;if(en(a,s,o)>=0)return!1;const r=a.x,c=s.x,l=o.x,d=a.y,u=s.y,h=o.y,f=r<c?r<l?r:l:c<l?c:l,m=d<u?d<h?d:h:u<h?u:h,v=r>c?r>l?r:l:c>l?c:l,g=d>u?d>h?d:h:u>h?u:h,p=ih(f,m,t,e,i),_=ih(v,g,t,e,i);let x=n.prevZ,y=n.nextZ;for(;x&&x.z>=p&&y&&y.z<=_;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&Ns(r,d,c,u,l,h,x.x,x.y)&&en(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==a&&y!==o&&Ns(r,d,c,u,l,h,y.x,y.y)&&en(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&Ns(r,d,c,u,l,h,x.x,x.y)&&en(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=_;){if(y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==a&&y!==o&&Ns(r,d,c,u,l,h,y.x,y.y)&&en(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function c2(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!Dc(a,s)&&p0(a,i,i.next,s)&&Ko(a,s)&&Ko(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),Jo(i),Jo(i.next),i=n=s),i=i.next}while(i!==n);return is(i)}function l2(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&v2(o,r)){let c=m0(o,r);o=is(o,o.next),c=is(c,c.next),qo(o,t,e,i,a,s,0),qo(c,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function d2(n,t,e,i){const a=[];let s,o,r,c,l;for(s=0,o=t.length;s<o;s++)r=t[s]*i,c=s<o-1?t[s+1]*i:n.length,l=f0(n,r,c,i,!1),l===l.next&&(l.steiner=!0),a.push(x2(l));for(a.sort(h2),s=0;s<a.length;s++)e=u2(a[s],e);return e}function h2(n,t){return n.x-t.x}function u2(n,t){const e=f2(n,t);if(!e)return t;const i=m0(e,n);return is(i,i.next),is(e,e.next)}function f2(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const h=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=s&&h>i&&(i=h,a=e.x<e.next.x?e:e.next,h===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,c=a.x,l=a.y;let d=1/0,u;e=a;do s>=e.x&&e.x>=c&&s!==e.x&&Ns(o<l?s:i,o,c,l,o<l?i:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),Ko(e,n)&&(u<d||u===d&&(e.x>a.x||e.x===a.x&&p2(a,e)))&&(a=e,d=u)),e=e.next;while(e!==r);return a}function p2(n,t){return en(n.prev,n,t.prev)<0&&en(t.next,n,n.next)<0}function m2(n,t,e,i){let a=n;do a.z===0&&(a.z=ih(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,g2(a)}function g2(n){let t,e,i,a,s,o,r,c,l=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<l&&(r++,i=i.nextZ,!!i);t++);for(c=l;r>0||c>0&&i;)r!==0&&(c===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,c--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,l*=2}while(o>1);return n}function ih(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function x2(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Ns(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function v2(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!y2(n,t)&&(Ko(n,t)&&Ko(t,n)&&M2(n,t)&&(en(n.prev,n,t.prev)||en(n,t.prev,t))||Dc(n,t)&&en(n.prev,n,n.next)>0&&en(t.prev,t,t.next)>0)}function en(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Dc(n,t){return n.x===t.x&&n.y===t.y}function p0(n,t,e,i){const a=Yr(en(n,t,e)),s=Yr(en(n,t,i)),o=Yr(en(e,i,n)),r=Yr(en(e,i,t));return!!(a!==s&&o!==r||a===0&&Wr(n,e,t)||s===0&&Wr(n,i,t)||o===0&&Wr(e,n,i)||r===0&&Wr(e,t,i))}function Wr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Yr(n){return n>0?1:n<0?-1:0}function y2(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&p0(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Ko(n,t){return en(n.prev,n,n.next)<0?en(n,t,n.next)>=0&&en(n,n.prev,t)>=0:en(n,t,n.prev)<0||en(n,n.next,t)<0}function M2(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function m0(n,t){const e=new ah(n.i,n.x,n.y),i=new ah(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function _p(n,t,e,i){const a=new ah(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function Jo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function ah(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function _2(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class Bo{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return Bo.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];bp(t),Sp(i,t);let o=t.length;e.forEach(bp);for(let c=0;c<e.length;c++)a.push(o),o+=e[c].length,Sp(i,e[c]);const r=s2.triangulate(i,a);for(let c=0;c<r.length;c+=3)s.push(r.slice(c,c+3));return s}}function bp(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Sp(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Uh extends Fh{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Uh(t.radius,t.detail)}}class Vs extends Qe{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],c=[],l=[],d=[];let u=t;const h=(e-t)/a,f=new W,m=new $t;for(let v=0;v<=a;v++){for(let g=0;g<=i;g++){const p=s+g/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,d.push(m.x,m.y)}u+=h}for(let v=0;v<a;v++){const g=v*(i+1);for(let p=0;p<i;p++){const _=p+g,x=_,y=_+i+1,S=_+i+2,w=_+1;r.push(x,y,w),r.push(y,S,w)}}this.setIndex(r),this.setAttribute("position",new De(c,3)),this.setAttribute("normal",new De(l,3)),this.setAttribute("uv",new De(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Nh extends Qe{constructor(t=new u0([new $t(0,.5),new $t(-.5,-.5),new $t(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let d=0;d<t.length;d++)l(t[d]),this.addGroup(r,c,d),r+=c,c=0;this.setIndex(i),this.setAttribute("position",new De(a,3)),this.setAttribute("normal",new De(s,3)),this.setAttribute("uv",new De(o,2));function l(d){const u=a.length/3,h=d.extractPoints(e);let f=h.shape;const m=h.holes;Bo.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){const _=m[g];Bo.isClockWise(_)===!0&&(m[g]=_.reverse())}const v=Bo.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){const _=m[g];f=f.concat(_)}for(let g=0,p=f.length;g<p;g++){const _=f[g];a.push(_.x,_.y,0),s.push(0,0,1),o.push(_.x,_.y)}for(let g=0,p=v.length;g<p;g++){const _=v[g],x=_[0]+u,y=_[1]+u,S=_[2]+u;i.push(x,y,S),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return b2(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new Nh(i,t.curveSegments)}}function b2(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class kc extends Qe{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],c=[],l=[],d=new W,u=new W,h=new W;for(let f=0;f<=i;f++)for(let m=0;m<=a;m++){const v=m/a*s,g=f/i*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(v),u.y=(t+e*Math.cos(g))*Math.sin(v),u.z=e*Math.sin(g),r.push(u.x,u.y,u.z),d.x=t*Math.cos(v),d.y=t*Math.sin(v),h.subVectors(u,d).normalize(),c.push(h.x,h.y,h.z),l.push(m/a),l.push(f/i)}for(let f=1;f<=i;f++)for(let m=1;m<=a;m++){const v=(a+1)*f+m-1,g=(a+1)*(f-1)+m-1,p=(a+1)*(f-1)+m,_=(a+1)*f+m;o.push(v,g,_),o.push(g,p,_)}this.setIndex(o),this.setAttribute("position",new De(r,3)),this.setAttribute("normal",new De(c,3)),this.setAttribute("uv",new De(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kc(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class fi extends ss{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Xm,this.normalScale=new $t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bi,this.combine=yh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class g0 extends nn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ee(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class S2 extends g0{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ee(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Vl=new Ce,wp=new W,Ep=new W;class w2{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new $t(512,512),this.map=null,this.mapPass=null,this.matrix=new Ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ch,this._frameExtents=new $t(1,1),this._viewportCount=1,this._viewports=[new on(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;wp.setFromMatrixPosition(t.matrixWorld),e.position.copy(wp),Ep.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ep),e.updateMatrixWorld(),Vl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Vl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Vl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class E2 extends w2{constructor(){super(new e0(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class T2 extends g0{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.target=new nn,this.shadow=new E2}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Tp=new Ce;class A2{constructor(t,e,i=0,a=1/0){this.ray=new Rh(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new Ph,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Tp.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Tp),this}intersectObject(t,e=!0,i=[]){return sh(t,this,i,e),i.sort(Ap),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)sh(t[a],this,i,e);return i.sort(Ap),i}}function Ap(n,t){return n.distance-t.distance}function sh(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)sh(s[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:vh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=vh);const R2={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function P2(n,t,e,i){const a=new ui(n.fov,i,.1,200),s=new W,o=new W,r=new W;let c=!1,l=n.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1,h=0,f=0,m=0,v=0,g=0,p=0;function _(){const x=(n.pitchDeg+d.pitchDelta)*Math.PI/180,y=n.yawDeg*Math.PI/180;r.set(Math.sin(y)*Math.cos(x),Math.sin(x),Math.cos(y)*Math.cos(x)).multiplyScalar(n.distance*d.distanceScale*d.zoom)}return _(),{camera:a,update(x,y,S,w,E=R2){const R=y+.6;if(!c)s.set(x,R,S),c=!0;else{const P=1-Math.exp(-Math.max(n.smoothing,.001)*w);s.x+=(x-s.x)*P,s.y+=(R-s.y)*P,s.z+=(S-s.z)*P}const b=1-Math.exp(-Math.max(t.smoothing,.001)*w);d.distanceScale+=(E.distanceScale-d.distanceScale)*b,d.offsetX+=(E.offsetX-d.offsetX)*b,d.offsetZ+=(E.offsetZ-d.offsetZ)*b,d.pitchDelta+=(E.pitchDelta-d.pitchDelta)*b;const M=1-Math.exp(-Math.max(e.smoothing,.001)*w);if(d.zoom+=(u-d.zoom)*M,_(),(a.fov!==l||a.fov!==n.fov)&&(a.fov=n.fov,l=n.fov,a.updateProjectionMatrix()),o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),a.position.copy(o).add(r),a.lookAt(o),h>.001){f+=w*52;const P=h*.055;a.position.x+=Math.sin(f*1.7)*P,a.position.y+=Math.sin(f*2.3+1.1)*P*.75,a.position.z+=Math.sin(f*1.3+2.4)*P*.5,h*=Math.exp(-9*w)}else h=0;g>.001?(a.position.x+=m*g,a.position.z+=v*g,g*=Math.exp(-13*w)):g=0,a.updateMatrixWorld()},snap(x,y,S){s.set(x,y+.6,S),c=!0,o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),_(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new W().setFromMatrixColumn(a.matrixWorld,0),y=new W().setFromMatrixColumn(a.matrixWorld,2).negate(),S=Math.hypot(x.x,x.z)||1,w=Math.hypot(y.x,y.z)||1;return{rightX:x.x/S,rightZ:x.z/S,forwardX:y.x/w,forwardZ:y.z/w}},addShake(x){!Number.isFinite(x)||x<=0||(h=Math.min(1,h+x))},shakeLevel(){return h},addKick(x,y,S){if(!Number.isFinite(x)||!Number.isFinite(y)||!(S>0))return;const w=Math.hypot(x,y);w<1e-4||(m=x/w*S,v=y/w*S,g=1,p++)},kickLevel(){return g},kickCount(){return p},setZoom(x){u=Number.isFinite(x)&&x>0?x:1},smart(){return{...d}}}}const Qa=Math.PI*2,Gn=1e-6;function an(n,t,e){return n<t?t:n>e?e:n}function x0(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function C2(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function v0(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=C2(n);return i===1?a:e+(a-e)*i}function Rp(n){return(1-Math.sin(n))/2}function Oh(n,t,e){const i=Math.PI/180,a=an(Number.isFinite(t)?t:100,0,180),s=an(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const c=an((o-n)/(o-r),0,1);return 1-c*c*(3-2*c)}function _c(n,t,e,i){const a=t>=0?1:-1,o=2/Math.max(Gn,i)*Math.max(0,e),r=an(n,-1,1),c=a-r;return Math.abs(c)<=o?a:r+Math.sign(c)*o}function Pp(n){const t=an(Number.isFinite(n)?n:1,-1,1),e=Math.abs(t);return Math.sign(t)*e*e*(3-2*e)}function L2(n,t,e,i){if(!(e>0))return t;const a=e*Math.max(0,i),s=t-n;return Math.abs(s)<=a?t:n+Math.sign(s)*a}const Cp=30*Math.PI/180,D2=100*Math.PI/180,k2=.06,I2=.22;function y0(n){return an((Math.abs(n)-Cp)/(D2-Cp),0,1)}function M0(n,t,e,i=k2,a=I2){const s=an(n,0,1),o=an(t,0,1),r=o>s?Math.max(Gn,i):Math.max(Gn,a),c=e/r*1,l=o-s;return Math.abs(l)<=c?o:s+Math.sign(l)*c}function _0(n,t,e,i,a){if(!(e>0))return t;const s=1-an(a,0,1);return s<=1e-9?n:L2(n,t,s*e,i)}function bc(n,t){if(!n.grounded||n.speed<Gn)return x0();const e=n.speed/Math.max(n.moveSpeed,Gn),i=Math.max(n.legLength,Gn),a=n.stride>Gn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),c=Math.abs(n.localRight),l=r+c+Gn,d=Oh(n.localForward/Math.max(n.speed,Gn),t.backStrafeStartDeg,t.backStrafeFullDeg),u=c/l*d,h=r/l+c/l*(1-d),f=Pp(n.dirF??(n.localForward>=0?1:-1)),m=Pp(n.dirR??(n.localRight>=0?1:-1)),v=a,g=U=>Math.asin(an(U,-o,o)/i);function p(U,C){const T=v0(U,t.plantLock),O=Rp(U),G=f*h*v*T,$=-g(G),at=C*m>0?1:-1,mt=1+at*t.crossStep*.45,xt=m*at*t.crossStep*v*.4*O,Pt=m*u*v*t.sideWeight*mt*T+xt*u,q=g(Pt),k=t.kneeLift*O*s*(.55+.25*h+.1*u*(1+C*m));return{pitchX:$,rollZ:q,kneeX:k}}const _=(n.phase%Qa+Qa)%Qa,x=p(_,-1),y=p((_+Math.PI)%Qa,1),S=Math.cos(_),w=Rp(_),E=-t.comSway*s*S*(.6*h+.8*u)-m*t.comSway*s*u*.45,R=t.comBob*w*s,b=m*t.hipLean*s*u*S*.6,M=m*t.hipLean*s*u*(.45+.25*S),P=t.armSwing*s*S*(h*f+.3*u),I=P,D=-P;return{legL:x,legR:y,pelvisX:E,pelvisY:R,pelvisRoll:b,sideLean:M,armL:I,armR:D,strafe:u,backward:f<0?h:0}}function b0(n){const t=(n%Qa+Qa)%Qa,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function S0(n,t,e){const i=an(e.progress,0,1);if(i>=1||n.speed<Gn)return x0();const a=i*i*(3-2*i),s=1-a;return bc({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function w0(n,t,e,i){const a=an(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return an(o*a,-1,1)*(e*Math.PI/180)}function E0(n,t=0){const e=an(n,0,1);return e*e+(1-e*e)*an(t,0,1)}function T0(n,t,e){if(!(n>0)||!(t>0))return 0;const i=an(e,0,1);return t+(n-t)*i}function A0(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,c=an(i,0,1);return e*c+r*(1-c)}function R0(n,t,e,i,a){const s=Math.max(e,Gn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,c=t>Gn?(t-n)/t:0,l=c>.02,d=c<-.015,u=n<=o*.15,h=!d&&n<r&&(l||u);return{enter:n>Gn&&n<=o&&l,resume:!h}}function P0(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return an(n*an(t,0,2),-i,i)}function C0(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function L0(n,t,e){const i=an(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function z2(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=an(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,c=r?1:.35,l=r?.35:1,d=Math.max(0,e.turnStepPitch)*o,u=Math.max(0,e.turnStepKnee)*o,h=Math.max(0,e.turnStepPitch)*.35*o,f=r?1:-1;return{legL:{pitchX:-d*c,rollZ:f*h*c,kneeX:u*c},legR:{pitchX:-d*l,rollZ:-f*h*l,kneeX:u*l},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function D0(n,t,e,i,a){const s=an(n,0,1),o=an(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),c=r*r*(3-2*r),l=s<=o?c:1-c,d=Math.hypot(e,i),u=d>Gn?e/d:1,h=d>Gn?i/d:0,f=v0(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*l,trailPitch:Math.max(0,a.stopTrailPitch)*l,leadKnee:Math.max(0,a.stopStepKnee)*l,bodyShift:Math.max(0,a.stopBodyShift)*l,bodyDip:Math.max(0,a.stopBodyDip)*l,chestPitch:Math.max(0,a.stopChestPitch)*l,leadLeft:f,fwdN:u,rightN:h,env:l}}function Ln(n){return n<0?0:n>1?1:n}const ic=Math.PI*2;function F2(n){return((n+Math.PI)%ic+ic)%ic-Math.PI}function U2(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function N2(n,t,e,i,a,s=n.phase){const o=Ln(i);if(o<=0)return n;const r=Ln(t),c=Math.max(1,Math.round(a.cycles)),l=Math.max(0,a.strideSpeed),d=e%2===0?1:-1,u=Ln(a.forwardBias),h=Math.max(0,n.stride??0),f=Math.max(0,a.strideScale??0)*h,m=r*r*(3-2*r),v={speed:l,phase:s+ic*c/2*m,localForward:l*u,localRight:l*(1-u)*d},g=F2(v.phase-n.phase),p=o*o*(3-2*o),_=n.speed>.05?h:0;return{speed:n.speed+(v.speed-n.speed)*o,phase:n.phase+g*p,localForward:n.localForward+(v.localForward-n.localForward)*o,localRight:n.localRight+(v.localRight-n.localRight)*o,stride:_+(f-_)*o*o}}function O2(n,t,e){const i=U2(),a=Ln(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,c=o>0,l=e.stepPitch*s,d=e.stepKnee*s,u=e.stepSide*s;return i.legL.pitchX=r?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=r?d:d*.4,i.legR.kneeX=c?d:d*.4,i.legL.rollZ=-u*o,i.legR.rollZ=u*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=u*.25*o,i}function k0(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function Lp(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*k0(s,a)}function B2(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function H2(n,t,e){const i=Ln(n);return{gaitScale:1-i*(1-Ln(t)),attackLegWeight:Ln(e)*i}}function G2(n,t,e){const i=Ln(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function X2(n,t){const e=Ln(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function V2(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Ln(t.minScale+(1-t.minScale)*e)}function I0(){return z0()}function z0(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function W2(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function Y2(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Ln(t.forceHitHeight):n.type==="light"?Ln(t.hitHeight.light):n.type==="heavy"?Ln(t.hitHeight.heavy):n.type==="knock"?Ln(t.hitHeight.knock):0}function $2(n,t,e){const i=Ln(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function F0(n,t,e){const i=z0(),a=W2(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=Ln(1-n.timer/n.duration),o=k0(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=Y2(n,e);const r=Math.sin(t),c=Math.cos(t),l=Math.cos(t),d=-Math.sin(t),u=n.dirX*r+n.dirZ*c,h=n.dirX*l+n.dirZ*d;if(i.localFwd=u,i.localRight=h,!e.enabled){i.legacy=!0;const v=Math.sin(Math.PI*s);return i.upperPitch=a*v*u,i.upperRoll=-a*v*h*.7,i.drop=(a>.5?.09:.04)*v,i.flash=e.flashStrength*v,i.active=v>0,i}const f=a*o,m=$2(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=f*(m.upperPitch*u+m.fold),i.upperRoll=-f*m.upperRoll*h,i.upperYaw=f*m.upperYaw*h,i.upperShift=f*m.shift,i.upperShiftX=i.upperShift*h,i.upperShiftZ=i.upperShift*u,i.comShift=f*e.comShift,i.comX=i.comShift*h,i.comZ=i.comShift*u,i.pelvisBack=f*m.back,i.drop=f*m.drop,i.knee=f*m.knee,i.hip=f*m.hip,i.arm=f*m.arm,i.flash=e.flashStrength*o,i}function U0(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const Ga=1e-6;function Ho(n,t,e){return n<t?t:n>e?e:n}function N0(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=Ga||s<=Ga||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,c=Math.abs(a-s)+Ga,l=Math.hypot(n.x,n.y,n.z);if(l<=Ga)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(n.x,-n.y),u=Math.hypot(n.x,n.y),h=n.z,f=Math.hypot(h,u),m=Ho(f,c,r),v=f>r+Ga||f<c-Ga,g=Math.atan2(-h,Math.max(u,Ga)),p=Ho((a*a+m*m-s*s)/(2*a*m),-1,1),_=Ho((s*s+m*m-a*a)/(2*s*m),-1,1),x=Math.acos(p),y=Math.acos(_),S=i>=0?1:-1;return{rootPitch:g-S*x,rootRoll:d,jointPitch:S*(x+y),clamped:v,reach:l/r}}function O0(n,t,e,i){const a=Ho(e,0,1),s=Math.max(0,i),o=(r,c)=>{const l=Ho((c-r)*a,-s,s);return r+l};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function B0(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Bh={active:!1,weight:0,clamped:0,maxError:0};function H0(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...Bh};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=a.map(f=>f.tip.getWorldPosition(new W));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),d=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let u=0;for(let f=0;f<a.length;f++){const m=a[f],v=i.worldToLocal(c[f].clone()),g={x:v.x-m.root.position.x,y:v.y-m.root.position.y,z:v.z-m.root.position.z},p=N0(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(u+=1);const _=O0({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,l,d);m.root.rotation.x=_.rootPitch,m.root.rotation.z=_.rootRoll,m.joint.rotation.x=_.jointPitch}t.updateWorldMatrix(!0,!0);let h=0;for(let f=0;f<a.length;f++){const m=a[f].tip.getWorldPosition(new W);h=Math.max(h,m.distanceTo(c[f]))}return{active:!0,weight:l,clamped:u,maxError:h}}function Nn(n,t,e){return n<t?t:n>e?e:n}function Z2(n,t,e,i,a,s,o,r,c,l){const d=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new xe,h=new xe;h.name="pelvis",h.position.y=n.legLength,u.add(h);const f=new xe;f.name="lower";const m=new xe;m.name="upper",h.add(f),h.add(m);const v=[],g=(J,gt,bt,Ot)=>{const Ft=new fi({color:Ot}),N=new ge(new An(J,gt,bt),Ft);return N.castShadow=!0,N.receiveShadow=!0,v.push(Ft),N},p=n.headSize,_=n.legLength,x=n.armLength,y=n.limbThickness,S=n.bodyHeight,w=n.bodyWidth,E=g(w,S,.28,e);E.position.y=S/2,m.add(E);const R=new xe;R.name="headPivot",R.rotation.order="YXZ",R.position.y=S,m.add(R);const b=g(p,p,p,e);b.position.y=p/2,R.add(b);for(const J of[-1,1]){const gt=g(.06,.07,.02,t.shoe);gt.position.set(J*.09,p/2+.03,p/2+.011),R.add(gt)}const M=(J,gt)=>{const bt=gt?x:_,Ot=new xe;Ot.name=gt?J<0?"shoulderL":"shoulderR":J<0?"hipL":"hipR",gt||(Ot.rotation.order="ZYX"),Ot.position.set(J*(gt?w/2+y/2:w/2-y/2),gt?S-.04:0,0),(gt?m:f).add(Ot);const Ft=g(y,bt/2,y,t.limb);Ft.position.y=-bt/4,Ot.add(Ft);const N=new xe;N.name=gt?"elbow":"knee",N.position.y=-bt/2,Ot.add(N);const Tt=g(y,bt/2,y,t.limb);if(Tt.position.y=-bt/4,N.add(Tt),!gt){const X=g(y*1.15,.07,y*1.7,t.shoe);X.position.set(0,-bt/2+.035,.045),N.add(X);const dt=new nn;return dt.name="footTip",dt.position.y=-bt/2,N.add(dt),{root:Ot,joint:N,tip:dt}}return{root:Ot,joint:N}},P=M(-1,!1),I=M(1,!1),D=M(-1,!0),U=M(1,!0),C=[P,I].map(J=>({root:J.root,joint:J.joint,tip:J.tip,upperLen:_/2,lowerLen:_/2,bend:1})),T=new yn({color:a.attackArcColor,transparent:!0,opacity:0,side:Je,depthWrite:!1}),O=new ge(new kc(.62,.042,6,20,Math.PI*1.1),T);O.position.set(0,.78-_,.56),m.add(O);const G=new ee(e),$=new ee(r.flashColor),at=new ee;let mt=null,xt=0,Pt=0,q=0,k=0,Y=0,tt=0,ut=0,st={...Bh},wt=-1,Zt=0,j=0,V=0,B=0,zt=0,kt=0,yt=0,_t=1,K=0,lt=0,L=0,A=0,Q=-1,ht=0,ft="none",rt=0,It=!1,Ct=-1,Mt=!1,Xt=0,pt=0,Nt=1,Z=1;return{group:u,boneAtWorld(J,gt,bt){const Ot=[{node:m,ax:0,ay:.05,az:0,bx:0,by:S,bz:0},{node:R,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:D.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:D.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:P.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:P.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:I.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:I.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0}],Ft=new W,N=new W,Tt=new W(J,gt,bt),X=new W;let dt=null,Dt=Number.POSITIVE_INFINITY;for(const Lt of Ot){Lt.node.updateWorldMatrix(!0,!1),Ft.set(Lt.ax,Lt.ay,Lt.az),N.set(Lt.bx,Lt.by,Lt.bz),Lt.node.localToWorld(Ft),Lt.node.localToWorld(N);const qt=N.x-Ft.x,se=N.y-Ft.y,ue=N.z-Ft.z,ne=qt*qt+se*se+ue*ue;let Se=ne>1e-8?((Tt.x-Ft.x)*qt+(Tt.y-Ft.y)*se+(Tt.z-Ft.z)*ue)/ne:0;Se=Math.max(0,Math.min(1,Se));const ke=Ft.x+qt*Se,Ae=Ft.y+se*Se,dn=Ft.z+ue*Se,Re=(Tt.x-ke)**2+(Tt.y-Ae)**2+(Tt.z-dn)**2;Re<Dt&&(Dt=Re,dt=Lt.node,X.set(ke,Ae,dn))}return dt?{node:dt,point:X.clone()}:null},update(J,gt,bt){const Ot=bt===void 0||Q<0?gt:Nn(bt-Q,0,.1);bt!==void 0&&(Q=bt),u.position.set(J.position.x,J.position.y,J.position.z),u.rotation.y=J.bodyYaw,R.rotation.y=(J.headYaw-J.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,J.mode!==mt&&(mt=J.mode,xt=1),xt=Math.max(0,xt-gt*2.2);const Ft=J.hurt,N=F0(Ft,J.bodyYaw,r),Tt=N.flash;at.copy($).multiplyScalar(Tt);for(const _e of v)_e.emissive.copy(G).multiplyScalar(xt*.5),Tt>0&&_e.emissive.add(at);h.position.set(0,_,0),h.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),f.position.set(0,0,0),f.rotation.z=0;const X=Math.hypot(J.velocity.x,J.velocity.z),dt=Nn(o.knockGaitScale??0,0,1),Dt=J.hurt.knockX*dt,Lt=J.hurt.knockZ*dt,qt=dt>0&&Math.hypot(J.hurt.knockX,J.hurt.knockZ)>.001,se=J.velocity.x+Dt,ue=J.velocity.z+Lt,ne=Math.hypot(se,ue),Se=Math.cos(J.bodyYaw),ke=-Math.sin(J.bodyYaw),Ae=X>1e-6?Nn((J.velocity.x*Se+J.velocity.z*ke)/X,-1,1):0,dn=X>1e-6?Nn((J.velocity.x*Math.sin(J.bodyYaw)+J.velocity.z*Math.cos(J.bodyYaw))/X,-1,1):1,Re=Oh(dn,o.backStrafeStartDeg,o.backStrafeFullDeg);ft==="settled"&&Mt&&Xt>pt*1.02+1e-4&&(ft="none");let Ue=1;ft==="blend"?(Ue=L0(It?Ct:rt,o.stopYawBlendMode,It),It||(rt=Math.min(1,rt+gt/Math.max(.01,o.stopYawAfterSec)),(rt>=1||o.stopYawBlendMode==="inStop"||Mt)&&(ft="settled",Ue=0))):ft==="settled"&&(Ue=Nn(X/Math.max(1e-6,o.stopEnterRatio*s),0,1));const mn=w0(Ae,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),Xn=Ot>1e-6?Ye(J.bodyYaw-L)/Ot:0;L=J.bodyYaw;const hn=(o.hipYawTrackRateDeg??0)*Math.PI/180,kn=(o.hipYawBackRateDeg??0)*Math.PI/180,En=Ot>1e-6?Ot:gt;A=hn>0?M0(A,y0(Xn),En):0;const In=E0(Re,A),zn=Nn(X/.5,0,1),Ei=A0(dn,Ae,mn,In)*Ue*zn,Ti=_0(lt,Ei,T0(hn,kn,In),En,A);lt=Ti,K+=(Ti-K)*(1-Math.exp(-12*Math.max(0,En))),f.rotation.y=K;const Vn=J.bodyYaw+K,z=Math.sin(Vn),it=Math.cos(Vn),ct=Math.cos(Vn),ot=-Math.sin(Vn),nt=se*z+ue*it,Ut=se*ct+ue*ot,Gt=Math.max(0,o.stopBlendSec||0),Jt=Gt>0&&!qt,Kt=R0(X,ht,s,o.stopEnterRatio,o.stopExitRatio);if(!Jt||Kt.resume)wt=-1;else if(wt<0&&Kt.enter){wt=0,Zt=J.gaitPhase,j=b0(J.gaitPhase),V=X,B=Math.max(J.stride,1e-6),zt=nt,kt=Ut;const _e=1/Math.max(1e-6,X);yt=J.velocity.x*_e,_t=J.velocity.z*_e}const re=ht;ht=X;const te=Jt&&wt>=0;te&&(wt=Math.min(1,wt+gt/Gt)),te&&ft!=="blend"&&(ft="blend",rt=0),It=te&&wt<1,Ct=wt,Mt=Kt.resume,Xt=X,pt=re;const jt=Math.max(0,o.dirFlipSec??0);jt>0?(Nt=_c(Nt,nt>=0?1:-1,gt,jt),Z=_c(Z,Ut>=0?1:-1,gt,jt)):(Nt=nt>=0?1:-1,Z=Ut>=0?1:-1);const ye=te?{phase:Zt,speed:V,moveSpeed:s,localForward:zt,localRight:kt,dirF:Nt,dirR:Z,legLength:n.legLength,stride:B,grounded:!0}:{phase:J.gaitPhase,speed:ne,moveSpeed:s,localForward:nt,localRight:Ut,dirF:Nt,dirR:Z,legLength:n.legLength,stride:J.stride,grounded:!0},oe=te?S0(ye,o,{progress:wt,phase0:Zt,phaseEnd:j}):bc(ye,o);let H=0,Rt=0,At=0,Et=0;if(te){const _e=C0(J.bodyYaw,yt,_t),Pe=D0(wt,Zt,_e.forward,_e.right,o);Pe.leadLeft?(oe.legL.pitchX-=Pe.leadPitch,oe.legL.kneeX+=Pe.leadKnee,oe.legR.pitchX+=Pe.trailPitch):(oe.legR.pitchX-=Pe.leadPitch,oe.legR.kneeX+=Pe.leadKnee,oe.legL.pitchX+=Pe.trailPitch),Rt=Pe.bodyShift*Pe.fwdN,H=Pe.bodyShift*Pe.rightN,At=Pe.bodyDip,Et=Pe.chestPitch}P.root.rotation.x=oe.legL.pitchX,I.root.rotation.x=oe.legR.pitchX,P.root.rotation.z=oe.legL.rollZ,I.root.rotation.z=oe.legR.rollZ,P.joint.rotation.x=oe.legL.kneeX,I.joint.rotation.x=oe.legR.kneeX,D.root.rotation.x=oe.armL,U.root.rotation.x=oe.armR,D.joint.rotation.x=-.18,U.joint.rotation.x=-.18,h.position.x=oe.pelvisX,h.position.y=_+oe.pelvisY,h.position.z=0,h.rotation.z=oe.pelvisRoll,m.rotation.z=oe.sideLean*(N.intensity>0?.4:1);const ie=B0(h,f),Ht=te&&d.enabled?{...d,weight:1}:d,ce=Ht.enabled&&Ht.weight>0?Nn(Ht.weight,0,1):0;if(h.position.x+=H,h.position.z+=Rt,h.position.y-=At,f.position.y+=At,ce<=0&&(f.position.x-=H,f.position.z-=Rt),c){const _e=Math.max(.004166666666666667,Math.min(gt,.1)),Pe=Math.sin(J.bodyYaw),Le=Math.cos(J.bodyYaw),$e=Nn((J.velocity.x-Pt)/_e,-60,60),un=Nn((J.velocity.z-q)/_e,-60,60),Ai=$e*Pe+un*Le,Kn=Ye(J.bodyYaw-k)/_e,Wn=c.maxForwardDeg*Math.PI/180,Gi=c.maxSideDeg*Math.PI/180,Yn=1-Math.exp(-Math.max(0,c.smoothing)*_e);Y+=(Nn(Ai*c.accelGain,-Wn,Wn)-Y)*Yn,tt+=(Nn(-Kn*X*c.turnGain,-Gi,Gi)-tt)*Yn;const pi=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;ut+=(Nn(X/Math.max(s,1e-6),0,1)-ut)*(1-Math.exp(-Math.max(0,pi)*_e));const $n=U0({leanForward:Y,leanSide:tt,speedRatio:ut},c);m.rotation.x+=Y+Et,m.rotation.z+=tt,h.rotation.x+=$n.pelvisPitch,h.rotation.z+=$n.pelvisRoll,h.position.x+=$n.pelvisX,h.position.z+=$n.pelvisZ,h.position.y-=$n.crouch,f.position.y+=$n.crouch*(1-ce)}Pt=J.velocity.x,q=J.velocity.z,k=J.bodyYaw,m.rotation.x+=N.upperPitch,m.rotation.z+=N.upperRoll,m.rotation.y+=N.upperYaw;const He=Nn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),we=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Nn(N.upperShiftX*He,-we,we),m.position.z+=Nn(N.upperShiftZ*He,-we,we),h.position.x+=N.comX,h.position.z+=N.comZ-N.pelvisBack,h.position.y-=N.drop;const Ie=N.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(f.position.z+=N.pelvisBack*(1-Ie),f.position.y+=N.drop*(1-Ie),P.joint.rotation.x+=N.knee,I.joint.rotation.x+=N.knee,P.root.rotation.x-=N.hip,I.root.rotation.x-=N.hip,D.root.rotation.x+=N.arm,U.root.rotation.x+=N.arm*.8,J.attackPhase!=="idle"&&N.intensity===0){const _e=J.attackProgress,Pe=_e<.34?-1:_e<.68?-1+(_e-.34)/.34*2:Math.max(0,1-(_e-.68)/.32),Le=Math.max(0,-Pe),$e=Math.max(0,Pe);U.root.rotation.x=-1.7*Le+1.25*$e,U.joint.rotation.x=-(.25+Le*.45),m.rotation.y=-.28*Pe,T.opacity=J.attackPhase==="active"?.85:0,J.attackPhase==="active"&&(O.rotation.z=-1.1+_e*3)}else T.opacity=0;const me=P0(K,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=me,R.rotation.y=(J.headYaw-J.bodyYaw-me+Math.PI*3)%(Math.PI*2)-Math.PI,st=H0({root:u,pelvis:h,lower:f,limbs:C,base:ie,cfg:Ht,grounded:!0,attacking:J.attackPhase!=="idle"})},ik(){return st},dispose(){u.traverse(J=>{if(J instanceof ge){J.geometry.dispose();const gt=J.material;Array.isArray(gt)?gt.forEach(bt=>bt.dispose()):gt.dispose()}})}}}const j2=9.81;function Lo(n,t,e){return n<t?t:n>e?e:n}function q2(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:j2,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,c=0,l=0,d=0;for(const b of n){const M=Number.isFinite(b.mass)&&b.mass>0?b.mass:0;!Number.isFinite(b.x)||!Number.isFinite(b.y)||!Number.isFinite(b.z)||(r+=M,c+=b.x*M,l+=b.y*M,d+=b.z*M)}if(r<=1e-6)return o;c/=r,l/=r,d/=r;const u=Math.max(.02,(t.maxX-t.minX)/2),h=Math.max(.02,(t.maxZ-t.minZ)/2),f=(t.minX+t.maxX)/2,m=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:c,comY:l,comZ:d,centerX:f,centerZ:m,halfX:u,halfZ:h};const g=Lo((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,l)/s)*g*4,_=c+(Number.isFinite(e)?e:0)*p,x=d+(Number.isFinite(i)?i:0)*p,y=Math.abs(_-f)/u,S=Math.abs(x-m)/h,w=Lo(1-Math.max(y,S),0,1),E=Math.max(0,Math.abs(_-f)-u),R=Math.max(0,Math.abs(x-m)-h);return{comX:c,comY:l,comZ:d,xcomX:_,xcomZ:x,centerX:f,centerZ:m,halfX:u,halfZ:h,marginX:Lo(1-y,-1,1),marginZ:Lo(1-S,-1,1),score:w,leanDeg:Math.atan2(_-f,x-m)*180/Math.PI,side:y>.98?_>f?1:-1:0,overX:E,overZ:R,grounded:!0}}function K2(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function J2(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=Lo(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const oh={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},Q2=1e-6;function ai(n,t,e){return n<t?t:n>e?e:n}function Wl(n,t){const e=Math.max(.2,n);return ai(Math.pow(e,-t),.5,2)}function tR(n,t){if(!t.enabled)return{...oh};const e=ai(n.swing,-1,1),i=ai(n.charge,0,1),a=ai(n.impact,0,1),s=ai(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),c=1+(Math.max(1,t.swingArm)-1)*r,l=Math.max(0,-e),d=ai(t.chargeArm,.6,1),u=1-(1-d)*l,h=1-(1-d)*i;let f=1;o>0?f=c:l>0?f=u:i>0&&(f=h);const m=1-ai(t.impactSquash,0,.6)*a;f*=m;const v=Math.max(1,t.runLeg),p=(n.grounded?1+(v-1)*s:1)*(1-ai(t.impactSquash,0,.6)*a*.6),_=ai(t.torsoGain,0,1),x=1+(f-1)*_;return f=ai(f,.6,1.6),{arm:f,leg:ai(p,.6,1.4),torso:ai(x,.7,1.4),girthArm:Wl(f,t.volumeExp),girthLeg:Wl(p,t.volumeExp),girthTorso:Wl(x,t.volumeExp)}}function eR(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function nR(n,t,e){const i=n*Math.exp(-Math.max(Q2,e)*Math.max(0,t));return i<.001?0:ai(i,0,1)}const Dp=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function Ws(n,t,e){return n<t?t:n>e?e:n}function Ge(n,t,e){return n+(t-n)*e}function iR(n){return n?typeof n=="string"?{clip:n}:n:null}function aR(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function sR(n,t){const e=n%3*2,i=Dp[e],a=Dp[e+1];return{...aR(),bodyYaw:Ge(i.yaw,a.yaw,t),bodyPitch:Ge(i.pitch,a.pitch,t),bodyRoll:Ge(i.roll,a.roll,t),pelvisX:Ge(i.px,a.px,t),pelvisZ:Ge(i.pz,a.pz,t),armPitch:Ge(i.ap,a.ap,t),armYaw:Ge(i.ay,a.ay,t),armRoll:Ge(i.ar,a.ar,t),elbow:Ge(i.el,a.el,t),bladePitch:Ge(i.blade,a.blade,t)}}function oR(n,t,e,i,a=0){var b,M,P;const s=((b=i.combo)==null?void 0:b[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,c=iR(s[r]),l=c?((M=i.clips)==null?void 0:M[c.clip])??null:null,d=Ws(((P=i.weaponScale)==null?void 0:P[n])??1,0,2),u=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,h=c&&Number.isFinite(c.scale)?c.scale:d,f=h*u,m=Ws((e+1)/2,0,1),v=l&&l.keys.length>0?qv(l,m):sR(r,m),g=((c==null?void 0:c.lead)??(l==null?void 0:l.lead)??"R")==="L"?"L":"R",p=(l==null?void 0:l.kind)??["right-left","left-right","overhead"][r]??"custom",_=n==="dual-swords",x=l&&Ia(l,"bladeTwistOff")?v.bladeTwistOff:_?v.bladeTwist:0,y=l&&Ia(l,"bladeYawOff")?v.bladeYawOff:-v.bladeYaw,S={yaw:v.bodyYaw*f,rootYaw:v.rootYaw*f,spinYaw:Kv(l,Ws(a,0,1)),pitch:v.bodyPitch*f,roll:v.bodyRoll*f,pelvisZ:v.pelvisZ*f,pelvisX:v.pelvisX*f,armR:null,armL:null,bladePitch:v.bladePitch,bladePitchOff:l&&Ia(l,"bladePitchOff")?v.bladePitchOff:null,bladeTwist:v.bladeTwist,bladeTwistOff:x,bladeYaw:v.bladeYaw,bladeYawOff:y,lead:g,kind:p,strike:m,blend:c&&Number.isFinite(c.blend)?c.blend:null},w={pitch:v.armPitch*h,yaw:v.armYaw*h,roll:v.armRoll*h,elbow:v.elbow*h},E=l?Ia(l,"armLPitch")||Ia(l,"armLYaw")||Ia(l,"armLRoll")||Ia(l,"elbowL"):!1,R=E?{pitch:v.armLPitch*h,yaw:v.armLYaw*h,roll:v.armLRoll*h,elbow:v.elbowL*h}:{pitch:w.pitch+(n==="greatsword"?.08:.1),yaw:w.yaw*.8,roll:n==="greatsword"?.4:-w.roll*.6,elbow:w.elbow};return g==="L"?(S.armL=w,S.armR=n==="greatsword"?null:R):(S.armR=w,(n==="greatsword"||n==="dual-swords"||E)&&(S.armL=R)),S}function rR(n,t,e){const i=Ws(e,0,1),a=(s,o)=>s?o?{pitch:Ge(s.pitch,o.pitch,i),yaw:Ge(s.yaw,o.yaw,i),roll:Ge(s.roll,o.roll,i),elbow:Ge(s.elbow,o.elbow,i)}:null:o;return{yaw:Ge(n.yaw,t.yaw,i),rootYaw:Ge(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Ge(n.pitch,t.pitch,i),roll:Ge(n.roll,t.roll,i),pelvisZ:Ge(n.pelvisZ,t.pelvisZ,i),pelvisX:Ge(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Ge(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Ge(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Ge(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Ge(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Ge(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Ge(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Ge(n.strike,t.strike,i),blend:t.blend??null}}function cR(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function kp(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function lR(n,t){const e=(a,s)=>Math.abs(cR(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=kp(n.armR,t.armR),i+=kp(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function dR(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),c=Math.max(.1,e.segBlendRef??6),l=Ws(lR(n,t)/c,0,1);return o+(r-o)*l}function Ip(n){const t=Ws(n,0,1);return t*t*(3-2*t)}const hR={omega:11,follow:.82,maxAngle:.85};function uR(){return{ang:[0,0,0],vel:[0,0,0],side:[0,0,0],svel:[0,0,0],ready:!1}}function fR(n,t,e,i=0,a){const s={...hR};if(!(t>0))return{pitch:n.ang,roll:n.side};if(!n.ready)return n.ang=[0,0,0],n.vel=[0,0,0],n.side=[0,0,0],n.svel=[0,0,0],n.ready=!0,{pitch:n.ang,roll:n.side};const o=Math.min(4,Math.max(1,Math.ceil(t/(1/90)))),r=t/o,c=s.omega,l=s.maxAngle;for(let d=0;d<o;d++)for(let u=0;u<3;u++){const h=u===0?0:n.ang[u-1]*s.follow,f=c*c*(h-n.ang[u])-2*c*n.vel[u]+(u===0?e:0);n.vel[u]+=f*r,n.ang[u]+=n.vel[u]*r,n.ang[u]>l&&(n.ang[u]=l,n.vel[u]=0),n.ang[u]<-l&&(n.ang[u]=-l,n.vel[u]=0);const m=u===0?0:n.side[u-1]*s.follow,v=c*c*(m-n.side[u])-2*c*n.svel[u]+(u===0?i:0);n.svel[u]+=v*r,n.side[u]+=n.svel[u]*r,n.side[u]>l&&(n.side[u]=l,n.svel[u]=0),n.side[u]<-l&&(n.side[u]=-l,n.svel[u]=0)}return{pitch:n.ang,roll:n.side}}function pR(n,t,e){const i=Yl((e-.05)/.2),a=Yl((.3-Math.abs(n))/.3),s=Yl(1-Math.abs(t+.23)/.3),o=i*a*s;return{push:o,side:(n>=0?-1:1)*o}}function Yl(n){return n<0?0:n>1?1:n}function Xe(n,t,e,i){const a=new ge(new An(n,t,e),new fi({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function qe(){return new xe}function ac(n,t,e){const i=qe(),a=Xe(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Xe(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Xe(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Xe(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const c=Xe(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function mR(n){const t=ac(.72,.15,n),e=Xe(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function gR(n){const t=qe(),e=Xe(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Xe(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function xR(n){const t=qe(),e=Xe(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Xe(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new ee(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function vR(n){const t=qe();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Xe(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Xe(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function yR(n){const t=qe(),e=Xe(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Xe(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function le(n,t,e){return n<t?t:n>e?e:n}const Ki=1e-6;function G0(n,t,e,i,a,s,o,r,c,l,d,u,h){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},m=u??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},v=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=c.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=c.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},_=qe(),x=qe();x.name="pelvis",x.position.y=n.legLength,_.add(x);const y=qe();y.name="lower";const S=qe();S.name="upper",x.add(y),x.add(S);const w=n.headSize,E=n.style,R=E!=null&&E.headScale&&E.headScale>0?E.headScale:1,b=w*R,M=Math.max(0,(E==null?void 0:E.beard)??0),P=Math.max(0,(E==null?void 0:E.hunch)??0),I=Math.max(0,(E==null?void 0:E.kneeSink)??0),D=!!(E!=null&&E.breath),U=n.legLength,C=n.armLength,T=n.limbThickness,O=n.bodyHeight,G=n.bodyWidth,$=.28*le(G/.46,1,1.4),at=c.spine,mt=!!(at!=null&&at.enabled),xt=mt?le(at.chestPivot??.42,.15,.85)*O:0,Pt=qe();Pt.name="chest",Pt.position.y=xt,S.add(Pt);const q=mt?Pt:S;let k,Y=null,tt=O,ut=0;mt?(tt=Math.max(.05,xt),ut=Math.max(.05,O-xt),k=Xe(G,tt,$,t.body),k.name="torsoLower",k.position.y=tt/2,S.add(k),Y=Xe(G+.008,ut,$+.008,t.body),Y.name="torsoUpper",Y.position.y=ut/2,Pt.add(Y)):(k=Xe(G,O,$,t.body),k.name="torso",k.position.y=O/2,S.add(k));const st=qe();st.name="headPivot",st.rotation.order="YXZ",st.position.y=Math.min(i.headPivotHeight,O)-xt,q.add(st);const wt=Xe(b,b,b,t.head);wt.position.y=b/2,st.add(wt);const Zt=new fi({color:"#1b2733"});for(const F of[-1,1]){const et=new ge(new An(.06*R,.07*R,.02*R),Zt);et.position.set(F*.09*R,(w/2+.03)*R,(w/2+.011)*R),st.add(et)}const j=[];let V=null;const B=new W;if(E!=null&&E.balding){const F=E.hairColor??"#e8e8e8",et=new fi({color:F,emissive:F,emissiveIntensity:.55}),vt=(Yt,ae,ve,Ve,pe,tn)=>{const We=new ge(new An(Yt,ae,ve),et);We.position.set(Ve,pe,tn),st.add(We)},St=b*.075,Vt=new ge(new An(b+St*2,b*.66,b*.84+St),et);Vt.name="hairCap",Vt.position.set(0,b*.47,-b*.08-St/2),st.add(Vt);for(const Yt of[-1,1])vt(b*.28,b*.05,b*.03,Yt*b*.2,b*.655,b/2+.006)}if(P>0){const F=Xe(b*.46,b*.3,b*.46,t.head);F.position.set(0,-b*.12,-b*.04),st.add(F)}if(M>0){const F=(E==null?void 0:E.beardColor)??"#f2f2f2",et=new fi({color:F,emissive:F,emissiveIntensity:.42}),vt=M/3;let St=st;for(let Vt=0;Vt<3;Vt++){const Yt=qe();Yt.name=`beard${Vt}`,Yt.position.set(0,Vt===0?b*.02:-vt,Vt===0?Math.max(b*.5,$/2+.025):0),St.add(Yt);const ae=b*[.52,.42,.28][Vt],ve=new ge(new An(ae,vt*1.06,b*(.2-Vt*.04)),et);ve.position.y=-vt/2,Yt.add(ve),j.push(Yt),St=Yt}V=uR()}const zt=F=>{const et=qe();et.name=F<0?"hipL":"hipR",et.rotation.order="ZYX",et.position.set(F*(G/2-T/2),0,0),y.add(et);const vt=Xe(T,U/2,T,t.limb);vt.position.y=-U/4,et.add(vt);const St=qe();St.name="knee",St.position.y=-U/2,et.add(St);const Vt=Xe(T,U/2,T,t.limb);Vt.position.y=-U/4,St.add(Vt);const Yt=Xe(T*1.15,.07,T*1.7,t.shoe);Yt.position.set(0,-U/2+.035,.045),St.add(Yt);const ae=new nn;ae.name="footTip",ae.position.y=-U/2,St.add(ae);const ve=qe();return{root:et,joint:St,hand:ve,wrist:ve,tip:ae,upperMesh:vt,lowerMesh:Vt,segLen:U/2}},kt=F=>{const et=qe();et.name=F<0?"shoulderL":"shoulderR",et.rotation.order="YXZ",et.position.set(F*(G/2+T/2),O-.04-xt,0),q.add(et);const vt=Xe(T,C/2,T,t.limb);vt.position.y=-C/4,et.add(vt);const St=qe();St.name="elbow",St.position.y=-C/2,et.add(St);const Vt=Xe(T,C/2,T,t.limb);Vt.position.y=-C/4,St.add(Vt);const Yt=qe();Yt.name=F<0?"handL":"handR",Yt.position.y=-C/2,St.add(Yt);const ae=Xe(T*1.1,.09,T*1.1,t.head);ae.position.y=.045,Yt.add(ae);const ve=qe();return ve.name=F<0?"wristL":"wristR",Yt.add(ve),{root:et,joint:St,hand:Yt,wrist:ve,upperMesh:vt,lowerMesh:Vt,segLen:C/2}},yt=zt(-1),_t=zt(1),K=kt(-1),lt=kt(1);if(E!=null&&E.spaulder)for(const F of[-1,1]){const et=Xe(T*1.2,T*1.1,G*.4,t.body);et.name=F<0?"spaulderL":"spaulderR",et.position.set(F*(G/2+T*.4),O-.05-xt,0),q.add(et)}const L=[yt,_t].map(F=>({root:F.root,joint:F.joint,tip:F.tip,upperLen:U/2,lowerLen:U/2,bend:1})),A=qe(),Q=qe();A.name="mountR",Q.name="mountL";const ht=qe(),ft=qe();ht.name="gripR",ft.name="gripL",lt.wrist.add(A),K.wrist.add(Q),A.add(ht),Q.add(ft);const rt=xR(t),It=vR(t),Ct=yR(t),Mt={"sword-shield":{right:ac(.42,.075,t),left:gR(t)},"dual-swords":{right:ac(.42,.075,t),left:ac(.42,.075,t)},greatsword:{right:mR(t),left:Xe(.12,.2,.12,t.wood)},staff:{right:rt.g,left:qe(),orb:rt.orb},bow:{right:Ct,left:It.g,arrow:Ct,drawString:It.drawString}};for(const F of Object.keys(Mt))ht.add(Mt[F].right),ft.add(Mt[F].left),Mt[F].right.visible=!1,Mt[F].left.visible=!1;function Xt(F,et,vt){const St=new nn;St.name="bladeBase",St.position.y=et,F.add(St);const Vt=new nn;Vt.name="bladeTip",Vt.position.y=vt,F.add(Vt)}Xt(Mt["sword-shield"].right,.44,.55),Xt(Mt["dual-swords"].right,.44,.55),Xt(Mt["dual-swords"].left,.44,.55),Xt(Mt.greatsword.right,.74,.88),Xt(Mt.staff.right,.78,.92);let pt=null,Nt=null,Z=1,J=0,gt=0,bt=null,Ot=0,Ft=0,N=0,Tt=0,X=0,dt=0,Dt=I0(),Lt={...Bh},qt=0,se=0,ue=0,ne=0,Se=0,ke=-1,Ae=-1,dn=0,Re=0,Ue=0,mn=0,Xn=0,hn=0,kn=0,En=1,In=0,zn=0,Ei=0,Ti=0,Vn=!1,z=0,it=-1,ct=0,ot=0,nt=0,Ut=!1,Gt=0,Jt=0,Kt=0,re=0,te="none",jt=0,ye=1,oe=!1,H=-1,Rt=!1,At=0,Et=0,ie=0,Ht=0,ce=0,He=0,we=0,Ie={...oh},me=0,_e=0,Pe={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},Le=NaN,$e=0,un=0,Ai=0,Kn=NaN,Wn=NaN,Gi=-1,Yn=null,pi=null,$n=0,Xi=1,os=.1,de=null,Bt={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},he=null,cn=null,gn=null,sa=null,ri=null,oa=null,er="R",mi=0,gi=0,Rn=0,Ra=0,nr=1,Ri=0,ir=null,Pa=0,Xh=0,Ic=NaN,Vh=NaN,ar={speed:0,phase:0},Ca=1,La=1,ao={lp:0,lr:0,rp:0,rr:0},Y0=0,zc=0,Fc=!0,Uc=0,so="none",rs=0,cs=0,ls=0,sr=.3,Wh=0;function $0(F){const et=Math.PI/180,vt=s;let St=0,Vt=0,Yt=0,ae=0;F==="sword-shield"?(St=vt.swordPitchDeg*et,Yt=vt.shieldPitchDeg*et):F==="dual-swords"?(St=vt.swordPitchDeg*et,Yt=vt.swordPitchDeg*et):F==="greatsword"?(St=vt.greatswordPitchDeg*et,Yt=vt.greatswordPitchDeg*et):F==="staff"?St=vt.staffPitchDeg*et:Yt=vt.bowPitchDeg*et,A.rotation.set(St,0,Vt),Q.rotation.set(Yt,0,ae),A.position.x=F==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function Yh(F){if(F!==pt){pt=F;for(const et of Object.keys(Mt))Mt[et].right.visible=et===F,Mt[et].left.visible=et===F;$0(F),It.drawString.position.z=-.06,Ct.position.z=0,rt.orb.scale.setScalar(1),S.rotation.y=0}}Yh("sword-shield");const $h=[];_.traverse(F=>{F instanceof ge&&F.material instanceof fi&&$h.push(F.material)});const Z0=new ee(r.flashColor);function j0(F,et){const vt=F0(F,et,r);Dt=vt,S.rotation.x+=vt.upperPitch,S.rotation.z+=vt.upperRoll,S.rotation.y+=vt.upperYaw;const St=le(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Vt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;S.position.x+=le(vt.upperShiftX*St,-Vt,Vt),S.position.z+=le(vt.upperShiftZ*St,-Vt,Vt),x.position.x+=vt.comX,x.position.z+=vt.comZ-vt.pelvisBack,x.position.y-=vt.drop;const Yt=vt.legacy?0:le(r.lowerScale,0,1);y.position.z+=vt.pelvisBack*(1-Yt),y.position.y+=vt.drop*(1-Yt),yt.joint.rotation.x+=vt.knee,_t.joint.rotation.x+=vt.knee,yt.root.rotation.x-=vt.hip,_t.root.rotation.x-=vt.hip,K.root.rotation.x+=vt.arm,lt.root.rotation.x+=vt.arm*.8;for(const ae of $h)ae.emissive.copy(Z0).multiplyScalar(vt.flash)}function or(F){return F<.22?-1:F<.42?-1+(F-.22)/.2*2:F<.5?1:Math.max(0,1-(F-.5)/.5)}function q0(F){for(const et of[K,lt])et.upperMesh.scale.set(F.girthArm,F.arm,F.girthArm),et.upperMesh.position.y=-et.segLen/2*F.arm,et.joint.position.y=-et.segLen*F.arm,et.lowerMesh.scale.set(F.girthArm,F.arm,F.girthArm),et.lowerMesh.position.y=-et.segLen/2*F.arm,et.hand.position.y=-et.segLen*F.arm;for(const et of[yt,_t])et.upperMesh.scale.set(F.girthLeg,F.leg,F.girthLeg),et.upperMesh.position.y=-et.segLen/2*F.leg,et.joint.position.y=-et.segLen*F.leg,et.lowerMesh.scale.set(F.girthLeg,F.leg,F.girthLeg),et.lowerMesh.position.y=-et.segLen/2*F.leg,et.tip.position.y=-et.segLen*F.leg;k.scale.set(F.girthTorso,F.torso,F.girthTorso),k.position.y=tt/2*F.torso,Y&&(Y.scale.set(F.girthTorso,F.torso,F.girthTorso),Y.position.y=ut/2*F.torso,Pt.position.y=tt*F.torso)}function K0(F,et){const vt=s.twoHandGripY??-.16,St=Math.max(1,s.twoHandMaxStretch??1.25),Vt=C*St*.99,Yt=K.root.position.x,ae=K.root.position.y,ve=K.root.position.z,Ve=K.root.rotation.y,pe=Math.cos(Ve),tn=Math.sin(Ve),We=Vi=>{const co=A.localToWorld(new W(0,Vi,0)),lo=(mt?Pt:S).worldToLocal(co),ho=lo.x-Yt,Fn=lo.y-ae,ds=lo.z-ve,hs={x:ho*pe-ds*tn,y:Fn,z:ho*tn+ds*pe};return{t:hs,dist:Math.hypot(hs.x,hs.y,hs.z)}};let Ze=vt,Ee=We(Ze);if(!Number.isFinite(Ee.dist)||Ee.dist<=Ki)return;for(let Vi=0;Vi<18&&Ee.dist>Vt;Vi++)if(Ze*=.78,Ee=We(Ze),!Number.isFinite(Ee.dist)||Ee.dist<=Ki)return;Number.isFinite(Le)||(Le=Ze);const sn=Math.max(0,s.twoHandSlideRate??9);Le+=(Ze-Le)*(1-Math.exp(-sn*et));const ln=We(Le),xn=ln.t,Jn=ln.dist,Qn=Jn/Math.max(Ki,C),ci=le(Qn,1,St),Pi=Math.max(1,s.twoHandGripStart??1.02),ra=Math.max(Pi+.001,St),ca=le(s.twoHandMinGrip??1,0,1),ti=le((Qn-Pi)/(ra-Pi),0,1),Ci=1-ti*ti*(3-2*ti)*(1-ca),ei=C/2*ci,ro=N0(xn,ei,ei,-1),la=O0({rootPitch:K.root.rotation.x,rootRoll:K.root.rotation.z,jointPitch:K.joint.rotation.x},ro,le(F*Ci,0,1),Math.PI);K.root.rotation.x=la.rootPitch,K.root.rotation.z=la.rootRoll,K.joint.rotation.x=Math.min(la.jointPitch,-.06);const li=1/Math.sqrt(ci);K.upperMesh.scale.set(li,ci,li),K.upperMesh.position.y=-ei/2,K.joint.position.y=-ei,K.lowerMesh.scale.set(li,ci,li),K.lowerMesh.position.y=-ei/2,K.hand.position.y=-ei,Pe={active:!0,dist:Jn,gy:Le,pitch:la.rootPitch,joint:K.joint.rotation.x,grip:Ci}}function J0(F,et){if(!m.enabled){$e=0,un=0,lt.wrist.rotation.set(0,0,0),Kn=lt.root.rotation.x,Wn=Jh();return}const vt=lt.root.rotation.x,St=Jh();if(et!==Gi){Gi=et,Kn=vt,Wn=St,lt.wrist.rotation.set($e,0,un);return}if(!Number.isFinite(Kn)||F<=1e-5){Kn=vt,Wn=St,lt.wrist.rotation.set($e,0,un);return}const Vt=(vt-Kn)/F,Yt=Ye(St-Wn)/F;Kn=vt,Wn=St;const ae=Math.max(0,m.maxAngle),ve=Math.max(0,m.maxTwist),Ve=.15+.85*le(gi,0,1),tn=-le(Ai,0,1.4)*Math.max(0,m.runDrag),We=le(-Vt*m.lag*Ve+tn,-ae,ae),Ze=le(Yt*m.twistLag*Ve,-ve,ve),Ee=1-Math.exp(-Math.max(0,m.rate)*F);$e+=(We-$e)*Ee,un+=(Ze-un)*Ee,lt.wrist.rotation.set($e,0,un)}function Q0(F){const et=Math.PI/180;return F==="greatsword"?s.greatswordPitchDeg*et:F==="staff"?s.staffPitchDeg*et:F==="bow"?s.bowPitchDeg*et:s.swordPitchDeg*et}function Nc(F){const et=Math.PI/180;return F==="sword-shield"?s.shieldPitchDeg*et:F==="greatsword"?s.greatswordPitchDeg*et:F==="bow"?s.bowPitchDeg*et:s.swordPitchDeg*et}function tg(F){const et=Math.PI/180;return F==="sword-shield"||F==="dual-swords"?(s.swordCantDeg??0)*et:F==="greatsword"?(s.greatswordCantDeg??0)*et:0}function eg(F,et){const vt=F.weapon;if(vt==="staff"||vt==="bow")return;const St=er==="R",Vt=St?lt:K,Yt=St?A:Q,ae=St?K:lt,ve=St?Q:A,Ve=vt==="greatsword"&&St?dt:0,pe=vt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,tn=Math.PI/180,We=-pe*tn,Ze=pe*tn,Ee=(ti,Ci)=>{const ei=Math.max(0,Math.PI/2-Math.abs(Ci));return Math.sign(ti)*Math.min(Math.abs(ti),ei)},sn=(he??Q0(vt)+J)+Ve,ln=et+Vt.root.rotation.x+Vt.joint.rotation.x;Yt.rotation.set(Math.PI/2-sn-ln,0,Ee(St?We:Ze,sn));const xn=cn??(vt==="sword-shield"?null:Nc(vt)+gt),Jn=et+ae.root.rotation.x+ae.joint.rotation.x;vt==="sword-shield"?ve.rotation.x=xn===null?Nc(vt):Nc(vt)-xn-Jn:ve.rotation.set(Math.PI/2-(xn??0)-Jn,0,Ee(St?Ze:We,xn??0));const Qn=tg(vt),ci=ri??0,Pi=oa??0,ra=gn??0,ca=sa??0;St?(ht.rotation.z=-Qn+ci,ht.rotation.y=ra,ft.rotation.z=Qn+Pi,ft.rotation.y=ca):(ft.rotation.z=Qn+ci,ft.rotation.y=ra,ht.rotation.z=-Qn+Pi,ht.rotation.y=ca)}function Zh(F){he=F.bladePitch,cn=F.bladePitchOff,gn=F.bladeTwist,sa=F.bladeTwistOff,ri=F.bladeYaw,oa=F.bladeYawOff,er=F.lead,mi=F.rootYaw+F.spinYaw,_.rotation.y=mi,S.rotation.y+=F.yaw,S.rotation.x+=F.pitch,S.rotation.z+=F.roll,x.position.z+=F.pelvisZ,x.position.x+=F.pelvisX,F.armR&&(lt.root.rotation.x=F.armR.pitch,lt.root.rotation.y=F.armR.yaw,lt.root.rotation.z=F.armR.roll,lt.joint.rotation.x=F.armR.elbow),F.armL&&(K.root.rotation.x=F.armL.pitch,K.root.rotation.y=F.armL.yaw,K.root.rotation.z=F.armL.roll,K.joint.rotation.x=F.armL.elbow)}function jh(F,et){const vt=de??or(F.attackProgress),St=oR(F.weapon,F.comboIndex,vt,p,F.attackProgress);if(F.comboIndex!==$n){pi=Yn,Xi=0,$n=F.comboIndex;const ae=F.timings.windup+F.timings.active+F.timings.recovery,ve=Math.max(p.segBlendMin??.03,ae*.22);os=dR(pi,St,p,St.blend??null,ve)}const Vt=Math.max(.008,os);Xi=Math.min(1,Xi+et/Vt);const Yt=pi&&Xi<1?rR(pi,St,Ip(Xi)):St;return Yn=Yt,Yt}function ng(F,et){const vt=G/2+T/2,St=O-.04-xt;if(!p.enabled){K.root.position.set(-vt,St,0),lt.root.position.set(vt,St,0),Bt={lx:-vt,ly:St,lz:0,rx:vt,ry:St,rz:0};return}const Vt=Math.max(0,p.shoulderLift),Yt=Math.max(0,p.shoulderPush),ae=F&&et==="greatsword"?Math.max(0,p.shoulderIn):0,ve=ln=>Vt*le((-ln-.5)/1.45,0,1),Ve=ln=>Yt*le((-ln-.2)/1.9,0,1),pe=-vt+ae,tn=St+ve(K.root.rotation.x),We=Ve(K.root.rotation.x),Ze=vt-ae,Ee=St+ve(lt.root.rotation.x),sn=Ve(lt.root.rotation.x);K.root.position.set(pe,tn,We),lt.root.position.set(Ze,Ee,sn),Bt={lx:pe,ly:tn,lz:We,rx:Ze,ry:Ee,rz:sn}}function ig(F,et,vt){if(F.phase==="idle"||F.charging){ct=0,ot=0,nt=0;return}const St=F.attackProgress,Vt=or(St),Yt=Math.max(0,Vt),ae=c.stride,ve=Number.isFinite(ae.stepReach)?ae.stepReach:.17,Ve=Number.isFinite(ae.stepSideReach)?ae.stepSideReach:.14,pe=Number.isFinite(ae.stepDipReach)?ae.stepDipReach:.05,tn=F.weapon==="greatsword"?le(Number.isFinite(ae.heavyScale)?ae.heavyScale:1,0,1):1,We=1-Math.exp(-12*Math.max(0,vt));ct+=(ve*Yt*tn-ct)*We,ot+=(et*Ve*Yt*tn-ot)*We,nt+=(pe*Math.sin(Math.PI*St)*tn-nt)*We,x.position.z+=ct,x.position.x+=ot,x.position.y-=nt}let qh=null;function ag(){qh={upperX:S.rotation.x,upperY:S.rotation.y,upperZ:S.rotation.z,upperPX:S.position.x,upperPZ:S.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:K.root.rotation.x,lry:K.root.rotation.y,lrz:K.root.rotation.z,lj:K.joint.rotation.x,rrx:lt.root.rotation.x,rry:lt.root.rotation.y,rrz:lt.root.rotation.z,rj:lt.joint.rotation.x,rootY:_.rotation.y}}function sg(F){const et=qh;if(!et)return;const vt=Ip(le(F,0,1));if(vt>=1)return;const St=(Vt,Yt)=>Vt+(Yt-Vt)*vt;S.rotation.x=St(et.upperX,S.rotation.x),S.rotation.y=St(et.upperY,S.rotation.y),S.rotation.z=St(et.upperZ,S.rotation.z),S.position.x=St(et.upperPX,S.position.x),S.position.z=St(et.upperPZ,S.position.z),x.position.x=St(et.pelvisX,x.position.x),x.position.y=St(et.pelvisY,x.position.y),x.position.z=St(et.pelvisZ,x.position.z),x.rotation.x=St(et.pelvisRX,x.rotation.x),x.rotation.z=St(et.pelvisRZ,x.rotation.z),K.root.rotation.x=St(et.lrx,K.root.rotation.x),K.root.rotation.y=St(et.lry,K.root.rotation.y),K.root.rotation.z=St(et.lrz,K.root.rotation.z),K.joint.rotation.x=St(et.lj,K.joint.rotation.x),lt.root.rotation.x=St(et.rrx,lt.root.rotation.x),lt.root.rotation.y=St(et.rry,lt.root.rotation.y),lt.root.rotation.z=St(et.rrz,lt.root.rotation.z),lt.joint.rotation.x=St(et.rj,lt.joint.rotation.x),_.rotation.y=et.rootY+Ye(_.rotation.y-et.rootY)*vt,mi=_.rotation.y}let oo=null,Oc=0,Kh=0;function og(){if(!mt)return;const F=at,et=Math.max(0,F.waist??1),vt=Math.max(0,F.chest??0),St=et+vt,Vt=St>1e-6?et/St:1,Yt=St>1e-6?vt/St:0,ae=S.rotation.x,ve=S.rotation.y,Ve=S.rotation.z;S.rotation.set(ae*Vt,ve*Vt,Ve*Vt),Pt.rotation.set(ae*Yt,ve*Yt,Ve*Yt);const pe=le(F.neck??0,0,1);pe>0&&(st.rotation.x-=ae*pe),oo={x:ae,y:ve,z:Ve}}function rr(){return{yaw:S.rotation.y+(mt?Pt.rotation.y:0),pitch:S.rotation.x+(mt?Pt.rotation.x:0),lean:S.rotation.z+(mt?Pt.rotation.z:0)}}function Jh(){return rr().yaw}function rg(F,et){if(!(h!=null&&h.enabled)){ir=null,Pa=0;return}_.updateWorldMatrix(!0,!0);const vt=new W,St=[],Vt=(li,Vi,co=0)=>{li.getWorldPosition(vt),St.push({x:vt.x,y:vt.y+co,z:vt.z,mass:Vi})},Yt=n.headSize;Vt(st,.08,Yt/2),Vt(k,.14),Vt(Y??Pt,.24),Vt(x,.12),Vt(K.hand,.05),Vt(lt.hand,.05),Vt(yt.joint,.15),Vt(_t.joint,.15);const ae=pt?cr(Mt[pt].right):null;ae&&St.push({x:(ae.base.x+ae.tip.x)/2,y:(ae.base.y+ae.tip.y)/2,z:(ae.base.z+ae.tip.z)/2,mass:pt==="greatsword"?.09:.04});const ve=Math.max(.05,n.limbThickness*1.15/2+.015),Ve=Math.max(.06,n.limbThickness*1.7/2+.02);let pe=1/0,tn=-1/0,We=1/0,Ze=-1/0,Ee=0;for(const li of[yt,_t])li.tip.getWorldPosition(vt),vt.y<=.13&&(Ee+=1),pe=Math.min(pe,vt.x-ve),tn=Math.max(tn,vt.x+ve),We=Math.min(We,vt.z-Ve),Ze=Math.max(Ze,vt.z+Ve);(!Number.isFinite(pe)||Ee===0)&&(pe=tn=We=Ze=0);let sn=0,ln=0;Number.isFinite(Ic)&&et>1e-5&&(sn=le((F.position.x-Ic)/et,-20,20),ln=le((F.position.z-Vh)/et,-20,20)),Ic=F.position.x,Vh=F.position.z;const xn=q2(St,{minX:pe,maxX:tn,minZ:We,maxZ:Ze},sn,ln,h);if(ir=xn,!h.autoCounter){Pa=0;return}const Jn=Math.cos(F.bodyYaw),Qn=-Math.sin(F.bodyYaw),ci=xn.xcomX-xn.centerX,Pi=xn.xcomZ-xn.centerZ,ra=ci*Jn+Pi*Qn,ca=sn*Jn+ln*Qn,ti=xn.grounded?K2(ra,ca,h.predLead??0):0;Kh=ti;const Ci=Math.abs(ti)-.45*xn.halfX;Xh=Ci;let ei=0;Ci>.002&&xn.grounded&&(ei=-Math.sign(ti)*Math.min(Math.max(.005,h.maxShift??.045),(Ci+.002)*1.1666666666666667));const ro=Math.abs(ti)/Math.max(1e-4,xn.halfX),la=Math.max(.1,J2(h.counterRate,ro,h.counterBoost??0));Pa+=(ei-Pa)*(1-Math.exp(-la*et))}function cg(F,et){if(It.drawString.position.z=-.06,Ct.position.z=0,rt.orb.scale.setScalar(1),S.rotation.y=0,F.charging&&F.weapon==="bow"){const Yt=F.charge;K.root.rotation.x=-1.25,K.joint.rotation.x=-.15,lt.root.rotation.x=.35+Yt*.3,lt.joint.rotation.x=-1.15,It.drawString.position.z=-.06-Yt*.22,Ct.position.z=-Yt*.3,S.rotation.y=-.22;return}if(F.phase==="idle"&&Rn<=.001){pi=null,Yn=null,$n=0,Xi=1,os=Math.max(.008,p.segBlend),he=null,cn=null,gn=null,sa=null,ri=null,oa=null,Le=NaN,F.weapon==="greatsword"&&(A.position.x=-Math.max(0,s.twoHandInsetX??0));return}const vt=or(F.attackProgress),St=Math.max(0,-vt),Vt=Math.max(0,vt);if(F.weapon==="bow")K.root.rotation.x=-1.2,K.joint.rotation.x=-.15,lt.root.rotation.x=.9-Vt*.8,lt.joint.rotation.x=-.3;else if(F.weapon==="greatsword")if(p.enabled)Zh(jh(F,et));else{const Yt=-1.6*St+1.25*Vt,ae=le(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);lt.root.rotation.x=Yt,lt.joint.rotation.x=-(.25+St*.4),K.root.rotation.x=Yt+.06,K.joint.rotation.x=-(.32+St*.4),K.root.rotation.z=.42,lt.root.rotation.z=0;const ve=-Math.sin(lt.root.rotation.x);lt.root.rotation.y=-.72*Math.tanh(ve*4),S.rotation.y=-.2*vt*ae}else if(p.enabled)Zh(jh(F,et));else{const Yt=F.comboIndex;if(Yt===1)lt.root.rotation.x=-1.7*St+1.1*Vt,lt.joint.rotation.x=-(.2+St*.5),K.root.rotation.x=.1,S.rotation.y=-.18*vt;else if(Yt===2)K.root.rotation.x=-1.5*St+1*Vt,K.joint.rotation.x=-(.2+St*.5),lt.root.rotation.x=.2,S.rotation.y=.45*-vt;else{const ae=-1.9*St+1.2*Vt;K.root.rotation.x=ae,lt.root.rotation.x=ae,K.joint.rotation.x=-(.15+St*.4),lt.joint.rotation.x=-(.15+St*.4),S.rotation.y=-.3*vt}}if(F.weapon==="greatsword"){const Yt=le((-lt.root.rotation.x-1.3)/1.2,0,1);A.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Yt)}ig(F,z%2===0?1:-1,et)}function lg(F,et){F&&(lt.root.rotation.x=-1.05,lt.joint.rotation.x=-.35,K.root.rotation.x=-.45,K.joint.rotation.x=-.2,S.rotation.y=-.12,rt.orb.scale.setScalar(1.25+.12*Math.sin(et*2)))}function dg(F){if(!F||F.phase==="idle")return;const et=F.progress,vt=et<.3?-.35+et/.3*1.35:et<.7?1:Math.max(0,1-(et-.7)/.3),St=Math.PI/180;S.rotation.x+=v.leanDeg*St*vt,K.root.rotation.x-=v.shieldPitchDeg*St*vt,K.joint.rotation.x-=.22*vt,lt.root.rotation.x-=.3*vt,x.position.z+=v.pelvisReach*Math.max(0,vt)}function cr(F){if(!F)return null;const et=F.getObjectByName("bladeBase"),vt=F.getObjectByName("bladeTip");if(!et||!vt)return null;F.updateWorldMatrix(!0,!1);const St=et.getWorldPosition(new W),Vt=vt.getWorldPosition(new W),Yt=new W().setFromMatrixColumn(F.matrixWorld,0).normalize();return{base:{x:St.x,y:St.y,z:St.z},tip:{x:Vt.x,y:Vt.y,z:Vt.z},normal:{x:Yt.x,y:Yt.y,z:Yt.z}}}const Qh=F=>Math.abs(F)<.6?0:F;function hg(){if(!j.length)return{pitch:0,roll:0};st.updateWorldMatrix(!0,!1);let F=0,et=0;for(const vt of[K,lt]){vt.hand.getWorldPosition(B),st.worldToLocal(B);const St=pR(B.x,B.y,B.z);St.push>0&&(F=Math.max(F,St.push),et+=St.side)}return{pitch:F*5,roll:le(et,-1,1)*8}}return{group:_,update(F,et,vt,St,Vt=!1,Yt,ae,ve){var fu,pu,mu;Yh(et.weapon);const Ve=Yt===void 0||ke<0?St:le(Yt-ke,0,.1);Yt!==void 0&&(ke=Yt),_.rotation.y=0,mi=0,S.rotation.x=0,S.rotation.z=0,x.position.x=0,x.position.y=U,x.position.z=0,x.rotation.z=0,x.rotation.x=0,S.position.x=0,S.position.y=0,S.position.z=0,Pt.rotation.set(0,0,0),y.position.x=0,y.position.y=0,y.position.z=0,y.rotation.z=0;const pe=Math.max(1/240,Math.min(St,.1));bt=((fu=c.stance)==null?void 0:fu[et.weapon])??null,Nt!==et.weapon&&(Nt=et.weapon,Z=bt?0:1);const tn=Math.max(.01,(bt==null?void 0:bt.blend)??.22);Z=Math.min(1,Z+pe/tn);const We=bt?Z:0;J=((bt==null?void 0:bt.bladePitchDeg)??0)*Math.PI/180*We,gt=((bt==null?void 0:bt.bladePitchOffDeg)??0)*Math.PI/180*We;const Ze=Yt===void 0?Y0+=St:Yt;zc=Ze;const Ee=c.landing;Ee.enabled?Fc&&!F.grounded?(so="jump",rs=Ze,cs=Ee.anticipationDuration,ls=Math.max(0,Ee.jumpAnticipation),sr=.32):!Fc&&F.grounded&&(so="land",rs=Ze,cs=Ee.duration,ls=V2(Uc,Ee),sr=Ee.compressRatio,Wh=Uc):(so="none",ls=0),Ze<rs&&(so="none",ls=0),Fc=F.grounded,Uc=F.velocity.y;const sn=Lp(Ze,rs,cs,ls,sr),ln=et.phase!=="idle",xn=(ve==null?void 0:ve.phase)==="active";gi=B2(gi,ln,pe,c.attack.blendRate);const Jn=H2(gi,c.attack.gaitWeight,c.attack.lowerBodyWeight);Ra=Jn.attackLegWeight,nr=Jn.gaitScale;const Qn=Math.sin(F.bodyYaw),ci=Math.cos(F.bodyYaw),Pi=(F.velocity.x-Ot)/pe,ra=(F.velocity.z-Ft)/pe,ca=le(Pi,-60,60),ti=le(ra,-60,60),Ci=ca*Qn+ti*ci,ei=Ye(F.bodyYaw-N)/pe,ro=Ve>1e-6?Ye(F.bodyYaw-N)/Ve:0,la=Math.hypot(F.velocity.x,F.velocity.z),li=o.maxForwardDeg*Math.PI/180,Vi=o.maxSideDeg*Math.PI/180,co=le(Ci*o.accelGain,-li,li),lo=le(-ei*la*o.turnGain,-Vi,Vi),ho=1-Math.exp(-o.smoothing*pe);Tt+=(co-Tt)*ho,X+=(lo-X)*ho,Ot=F.velocity.x,Ft=F.velocity.z,N=F.bodyYaw;const Fn=Math.hypot(F.velocity.x,F.velocity.z),ds=le(a.knockGaitScale??0,0,1),hs=vt.knockX*ds,ug=vt.knockZ*ds,fg=ds>0&&Math.hypot(vt.knockX,vt.knockZ)>.001,Bc=F.velocity.x+hs,Hc=F.velocity.z+ug,tu=Math.hypot(Bc,Hc);re=tu;const pg=Math.cos(F.bodyYaw),mg=-Math.sin(F.bodyYaw),gg=F.velocity.x*pg+F.velocity.z*mg,eu=Fn>Ki?le(gg/Fn,-1,1):0,nu=Fn>Ki?le((F.velocity.x*Qn+F.velocity.z*ci)/Fn,-1,1):1,xg=Oh(nu,a.backStrafeStartDeg,a.backStrafeFullDeg);te==="settled"&&Rt&&At>Et*1.02+1e-4&&(te="none");let uo=1;te==="blend"?(uo=L0(oe?H:jt,a.stopYawBlendMode,oe),oe||(jt=Math.min(1,jt+pe/Math.max(.01,a.stopYawAfterSec)),(jt>=1||a.stopYawBlendMode==="inStop"||Rt)&&(te="settled",uo=0))):te==="settled"&&(uo=le(Fn/Math.max(Ki,a.stopEnterRatio*e),0,1)),ye=uo;const vg=w0(eu,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),iu=(a.hipYawTrackRateDeg??0)*Math.PI/180,yg=(a.hipYawBackRateDeg??0)*Math.PI/180,Gc=Ve>1e-6?Ve:St;Se=iu>0?M0(Se,y0(ro),Gc):0;const au=E0(xg,Se),Mg=le(Fn/.5,0,1),_g=A0(nu,eu,vg,au)*uo*Mg,su=_0(ne,_g,T0(iu,yg,au),Gc,Se);ne=su,se+=(su-se)*(1-Math.exp(-i.hipYawSmoothing*Gc));const fo=F.bodyYaw+se;ue=fo;const bg=Math.sin(fo),Sg=Math.cos(fo),wg=Math.cos(fo),Eg=-Math.sin(fo),di={speed:tu,phase:F.gaitPhase,localForward:Bc*bg+Hc*Sg,localRight:Bc*wg+Hc*Eg,stride:F.stride};if(ln&&et.attackId!==it){const Qt=!Ut;it=et.attackId,z+=1,Ei=Qt&&(!Vn||di.speed>.05)?di.phase:Ti,Vn=!0}Ut=ln;const xi=gi>0?N2(di,et.attackProgress,z,gi,c.stride,Ei):di;ar=xi,ln&&(Ti=xi.phase);const Xc=Math.max(0,a.dirFlipSec??0);Xc>0?(Ca=_c(Ca,xi.localForward>=0?1:-1,pe,Xc),La=_c(La,xi.localRight>=0?1:-1,pe,Xc)):(Ca=xi.localForward>=0?1:-1,La=xi.localRight>=0?1:-1);const ou=Math.max(0,a.stopBlendSec||0),ru=ou>0&&!ln&&!fg&&F.grounded,Vc=R0(Fn,In,e,a.stopEnterRatio,a.stopExitRatio);if(!ru||Vc.resume)Ae=-1;else if(Ae<0&&Vc.enter){Ae=0,dn=F.gaitPhase,Re=b0(F.gaitPhase),Ue=Fn,mn=Math.max(F.stride,Ki),Xn=di.localForward,hn=di.localRight;const Qt=1/Math.max(Ki,Fn);kn=F.velocity.x*Qt,En=F.velocity.z*Qt}const Tg=In;In=Fn;const Li=ru&&Ae>=0;Li&&(Ae=Math.min(1,Ae+pe/ou)),Li&&te!=="blend"&&(te="blend",jt=0),oe=Li&&Ae<1,H=Ae,Rt=Vc.resume,At=Fn,Et=Tg;const cu=Li?{phase:dn,speed:Ue,moveSpeed:e,localForward:Xn,localRight:hn,dirF:Ca,dirR:La,legLength:n.legLength,stride:mn,grounded:!0}:{phase:xi.phase,speed:xi.speed,moveSpeed:e,localForward:xi.localForward,localRight:xi.localRight,dirF:Ca,dirR:La,legLength:n.legLength,stride:xi.stride??0,grounded:F.grounded};let Wc=Li?S0(cu,a,{progress:Ae,phase0:dn,phaseEnd:Re}):bc(cu,a);const Da=c.attack.moveTakeover;if(Da&&!Li){const Qt=et.phase==="windup"?Da.windup:et.phase==="recovery"?Da.recovery:et.phase==="settle"?Da.settle:0,fe=Math.max(.05,Da.full-Da.speed),vn=le((di.speed-Da.speed)/fe,0,1),bn=le(Qt,0,1)*vn,ka=bn>Ri?10:6;Ri=le(Ri+(bn-Ri)*(1-Math.exp(-ka*pe)),0,1)}else Li?Ri=0:Ri=le(Ri*Math.exp(-8*pe),0,1);if(Ri>.001&&!Li){const Qt=bc({phase:di.phase,speed:di.speed,moveSpeed:e,localForward:di.localForward,localRight:di.localRight,dirF:Ca,dirR:La,legLength:n.legLength,stride:di.stride??0,grounded:F.grounded},a);Wc=G2(Wc,Qt,Ri)}const ze=X2(Wc,Jn.gaitScale);if(we=0,xn&&ve){const Qt=z2(ve.progress,ve.dir,a),fe=Jn.gaitScale;ze.legL.pitchX+=Qt.legL.pitchX*fe,ze.legL.rollZ+=Qt.legL.rollZ*fe,ze.legL.kneeX+=Qt.legL.kneeX*fe,ze.legR.pitchX+=Qt.legR.pitchX*fe,ze.legR.rollZ+=Qt.legR.rollZ*fe,ze.legR.kneeX+=Qt.legR.kneeX*fe,ze.pelvisY+=Qt.pelvisY*fe,we=Qt.env}let Yc=0,$c=0,Zc=0,lu=0;if(Li){const Qt=C0(F.bodyYaw,kn,En),fe=D0(Ae,dn,Qt.forward,Qt.right,a);fe.leadLeft?(ze.legL.pitchX-=fe.leadPitch,ze.legL.kneeX+=fe.leadKnee,ze.legR.pitchX+=fe.trailPitch):(ze.legR.pitchX-=fe.leadPitch,ze.legR.kneeX+=fe.leadKnee,ze.legL.pitchX+=fe.trailPitch),$c=fe.bodyShift*fe.fwdN,Yc=fe.bodyShift*fe.rightN,Zc=fe.bodyDip,lu=fe.chestPitch,Gt=fe.leadPitch,Jt=fe.bodyShift,Kt=fe.bodyDip}else Gt=0,Jt=0,Kt=0;if(ao={lp:ze.legL.pitchX,lr:ze.legL.rollZ,rp:ze.legR.pitchX,rr:ze.legR.rollZ},!F.grounded)yt.root.rotation.x=-.55,_t.root.rotation.x=-.25,yt.joint.rotation.x=.75,_t.joint.rotation.x=.55,K.root.rotation.x=-.9,lt.root.rotation.x=-.7,K.joint.rotation.x=-.6,lt.joint.rotation.x=-.6,yt.root.rotation.z=0,_t.root.rotation.z=0;else{yt.root.rotation.x=ze.legL.pitchX,_t.root.rotation.x=ze.legR.pitchX,yt.root.rotation.z=ze.legL.rollZ,_t.root.rotation.z=ze.legR.rollZ,yt.joint.rotation.x=ze.legL.kneeX,_t.joint.rotation.x=ze.legR.kneeX;const Qt=bt?Z:0,fe=1+(((bt==null?void 0:bt.armSwing)??1)-1)*Qt,vn=bt==null?void 0:bt.armR,bn=bt==null?void 0:bt.armL,ka=ze.armL*fe+((bn==null?void 0:bn.pitch)??0)*Qt,mo=ze.armR*fe+((vn==null?void 0:vn.pitch)??0)*Qt;K.root.rotation.x=ka,lt.root.rotation.x=mo,K.joint.rotation.x=-(.18+ka*.2)+((bn==null?void 0:bn.elbow)??0)*Qt,lt.joint.rotation.x=-(.18+mo*.2)+((vn==null?void 0:vn.elbow)??0)*Qt,K.root.rotation.z=((bn==null?void 0:bn.roll)??0)*Qt,lt.root.rotation.z=((vn==null?void 0:vn.roll)??0)*Qt,K.root.rotation.y=((bn==null?void 0:bn.yaw)??0)*Qt,lt.root.rotation.y=((vn==null?void 0:vn.yaw)??0)*Qt,x.position.x=ze.pelvisX,x.position.y=U+ze.pelvisY,x.position.z=0,x.rotation.z=ze.pelvisRoll}const Ag=B0(x,y),po=xn?{...f,weight:0}:Li&&f.enabled?{...f,weight:1}:f,jc=po.enabled&&F.grounded&&po.weight>0?le(po.weight,0,1)*(ln?le(po.attackScale,0,1):1):0;x.position.x+=Yc,x.position.z+=$c,x.position.y-=Zc,y.position.y+=Zc,jc<=0&&(y.position.x-=Yc,y.position.z-=$c);const qc=Fn/Math.max(e,Ki);Ai=qc;const Rg=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Pg=1-Math.exp(-Math.max(0,Rg)*pe);qt+=(le(qc,0,1)-qt)*Pg;const us=U0({leanForward:Tt,leanSide:X,speedRatio:qt},o);x.rotation.x+=us.pelvisPitch,x.rotation.z+=us.pelvisRoll,x.position.x+=us.pelvisX,x.position.z+=us.pelvisZ,x.position.y-=us.crouch,y.position.y+=us.crouch*(1-le(jc,0,1)),I>0&&(x.position.y-=I,y.position.y+=I*(1-le(jc,0,1)));const du=et.phase!=="idle"||et.charging&&et.weapon==="bow",Kc=du?1:0,Cg=Math.max(.001,Kc>Rn?p.poseIn??.1:p.poseOut??.16);if(Rn!==Kc){const Qt=pe/Cg;Rn=le(Rn+(Kc>Rn?Qt:-Qt),0,1)}if((Rn>0||du)&&ag(),cg(et,pe),Rn>0&&Rn<1&&sg(Rn),bt){const Qt=(1-Rn)*Z;S.rotation.y+=(bt.torsoYaw??0)*Qt,S.rotation.x+=(bt.torsoPitch??0)*Qt}lg(Vt,F.gaitPhase),dg(ae);const Lg=et.weapon==="greatsword",hu=Math.hypot(F.velocity.x,F.velocity.z),Dg=Lg&&et.phase==="idle"&&hu>.5?Math.min(1.15,hu/Math.max(e,.001)*.9):0;dt+=(Dg-dt)*(1-Math.exp(-6*pe));const kg=S.rotation.x;et.weapon==="bow"&&(It.g.rotation.x=-(K.root.rotation.x+K.joint.rotation.x),Ct.rotation.x=-(lt.root.rotation.x+lt.joint.rotation.x));const Ig=S.rotation.y;j0(vt,F.bodyYaw);const uu=vt.type==="none"?1:.4;if(S.rotation.x+=Tt*uu+lu,S.rotation.z+=(X+ze.sideLean)*uu,sn>0&&(yt.root.rotation.x-=Ee.hipPitch*sn,_t.root.rotation.x-=Ee.hipPitch*sn,yt.joint.rotation.x+=Ee.kneeBend*sn,_t.joint.rotation.x+=Ee.kneeBend*sn,x.position.y-=Ee.crouchDepth*sn,y.position.y+=Ee.crouchDepth*(1-Ee.lowerScale)*sn,S.rotation.x+=Ee.upperPitch*sn,K.root.rotation.x-=Ee.armTuck*sn,lt.root.rotation.x-=Ee.armTuck*sn),Ra>0&&F.grounded){const Qt=O2(et.attackProgress,z,c.stride),fe=Ra;yt.root.rotation.x+=Qt.legL.pitchX*fe,_t.root.rotation.x+=Qt.legR.pitchX*fe,yt.root.rotation.z+=Qt.legL.rollZ*fe,_t.root.rotation.z+=Qt.legR.rollZ*fe,yt.joint.rotation.x+=Qt.legL.kneeX*fe,_t.joint.rotation.x+=Qt.legR.kneeX*fe,x.position.x+=Qt.pelvisX*fe,x.position.y+=Qt.pelvisY*fe,x.rotation.z+=Qt.pelvisRoll*fe}if(ng(ln,et.weapon),h!=null&&h.enabled&&h.autoCounter&&Math.abs(Pa)>1e-4&&(x.position.x+=Pa),g.enabled){const Qt=et.phase!=="idle"&&!et.charging,fe=Qt?or(et.attackProgress):0;Qt&&_e>.55&&fe<_e-1e-4&&(me=1),_e=fe,me=nR(me,pe,g.impactDecay);const vn=tR({swing:fe,charge:et.charging?et.charge:0,impact:me,speedRatio:qc,grounded:F.grounded},g);Ie=eR(Ie,vn,pe,g.smoothing)}else Ie={...oh};q0(Ie),y.rotation.y=se,zn=P0(se,a.chestYawScale,a.chestYawMaxDeg),S.rotation.y+=zn;const zg=Ig;if(st.rotation.y=Ye(F.headYaw-F.bodyYaw-zg-zn),st.rotation.x=-le(F.headPitch??0,-.7,.7),S.rotation.x+=-le(F.bodyPitch??0,-.4,.4),P>0&&(S.rotation.x+=P,st.rotation.x-=P*.55,st.position.z=P*.1),og(),J0(St,et.comboIndex),eg(et,kg),et.weapon==="greatsword"&&!et.charging&&(et.phase!=="idle"||Rn>0)){_.updateWorldMatrix(!0,!0);const Qt=et.phase==="idle"?Math.max(Rn,gi):1;K0(le(Qt,0,1),pe)}if(Lt=H0({root:_,pelvis:x,lower:y,limbs:L,base:Ag,cfg:po,grounded:F.grounded,attacking:ln}),rg(F,pe),V&&j.length===3){const Qt=F.bodyYaw??0,fe=Math.sin(Qt),vn=Math.cos(Qt),bn=((pu=F.velocity)==null?void 0:pu.x)??0,ka=((mu=F.velocity)==null?void 0:mu.z)??0,mo=bn*fe+ka*vn,gu=bn*vn-ka*fe,Jc=Math.max(pe,1e-4),Fg=(mo-ie)/Jc,Ug=(gu-Ht)/Jc,Ng=Math.atan2(Math.sin(Qt-ce),Math.cos(Qt-ce)),Og=le(Ng/Jc,-14,14);ie=mo,Ht=gu,ce=Qt;const Bg=Og*.18*30,xu=hg(),vu=fR(V,pe,Qh(le(Fg*.3-xu.pitch,-9,9)),Qh(le(-Ug*.5+Bg+xu.roll,-26,26)));for(let fs=0;fs<3;fs++)j[fs].rotation.x=vu.pitch[fs],j[fs].rotation.z=vu.roll[fs]}if(D){He+=pe;const Qt=le(1-Fn/.6,0,1);k.scale.z=1+Math.sin(He*1.4)*.02*Qt}if(mt&&oo){const Qt=rr();Oc=Math.max(Math.abs(Qt.pitch-oo.x),Math.abs(Qt.yaw-oo.y),Math.abs(Qt.lean-oo.z))}else Oc=0},lean(){return{forward:Tt,side:X}},landing(){const F=Lp(zc,rs,cs,ls,sr),et=cs>0?Math.max(0,cs-Math.max(0,zc-rs)):0;return{pulse:F,remaining:et,kind:F>0?so:"none",impactVy:Wh}},hurt(){return Dt},ik(){return Lt},stretch(){return{...Ie,impact:me}},gripDebug(){return{...Pe}},weaponDebug(){return{wristPitch:$e,wristTwist:un}},setClipT(F){de=F===null||!Number.isFinite(F)?null:Math.max(0,Math.min(1,F))},stanceDebug(){const F=bt==null?void 0:bt.armR,et=bt==null?void 0:bt.armL,vt=bt?Z:0;return{weapon:pt??"sword-shield",weight:vt,armL:{pitch:((et==null?void 0:et.pitch)??0)*vt,yaw:((et==null?void 0:et.yaw)??0)*vt,roll:((et==null?void 0:et.roll)??0)*vt,elbow:((et==null?void 0:et.elbow)??0)*vt},armR:{pitch:((F==null?void 0:F.pitch)??0)*vt,yaw:((F==null?void 0:F.yaw)??0)*vt,roll:((F==null?void 0:F.roll)??0)*vt,elbow:((F==null?void 0:F.elbow)??0)*vt},torsoYaw:((bt==null?void 0:bt.torsoYaw)??0)*vt,torsoPitch:((bt==null?void 0:bt.torsoPitch)??0)*vt,bladePitchDeg:J*180/Math.PI,bladePitchOffDeg:gt*180/Math.PI,armSwing:(bt==null?void 0:bt.armSwing)??1}},swingDebug(){const F=Yn;return{seg:$n,kind:(F==null?void 0:F.kind)??"right-left",lead:(F==null?void 0:F.lead)??"R",yaw:(F==null?void 0:F.yaw)??0,rootYaw:(F==null?void 0:F.rootYaw)??0,spinYaw:(F==null?void 0:F.spinYaw)??0,rootTurn:mi,pitch:(F==null?void 0:F.pitch)??0,roll:(F==null?void 0:F.roll)??0,strike:(F==null?void 0:F.strike)??0,bladeTwist:(F==null?void 0:F.bladeTwist)??0,bladeTwistOff:(F==null?void 0:F.bladeTwistOff)??0,bladeYaw:(F==null?void 0:F.bladeYaw)??0,bladeYawOff:(F==null?void 0:F.bladeYawOff)??0,shoulderL:{x:Bt.lx,y:Bt.ly,z:Bt.lz},shoulderR:{x:Bt.rx,y:Bt.ry,z:Bt.rz}}},attackBlend(){return gi},attackWeights(){return{gaitScale:nr,attackLegWeight:Ra,driveSpeed:ar.speed,stridePhase:ar.phase,strideBase:Ei,stepIndex:z}},hipYaw(){return se},torsoTotal(){return rr()},spineDebug(){if(!mt)return null;const F=rr();return{enabled:!0,waistYaw:S.rotation.y,chestYaw:Pt.rotation.y,totalYaw:F.yaw,totalPitch:F.pitch,totalLean:F.lean,neckPitch:st.rotation.x,leak:Oc}},balanceDebug(){return ir?{...ir,shift:Pa,latDeficit:Xh,lateralFf:Kh}:null},gaitDebug(){return{stopT:Ae,hipYaw:se,chestYaw:zn,speed:In,gaitSpeed:re,stopStep:Gt,stopShift:Jt,stopDip:Kt,stopYawFade:ye,turnStep:we,legTakeover:Ri,legLPitch:ao.lp,legLRoll:ao.lr,legRPitch:ao.rp,legRRoll:ao.rr,phase:ar.phase,dirF:Ca,dirR:La,hipYawTarget:ne,spin:Se}},gaitYaw(){return ue},arrowDirection(){Ct.updateWorldMatrix(!0,!1);const F=Ct.matrixWorld.elements,et=F[8],vt=F[9],St=F[10],Vt=Math.hypot(et,vt,St)||1;return{x:et/Vt,y:vt/Vt,z:St/Vt}},weaponBlade(){return pt?cr(Mt[pt].right):null},bladesWorld(){return pt?{right:cr(Mt[pt].right),left:cr(Mt[pt].left)}:{right:null,left:null}},dispose(){_.traverse(F=>{if(F instanceof ge){F.geometry.dispose();const et=F.material;Array.isArray(et)?et.forEach(vt=>vt.dispose()):et.dispose()}})}}}function MR(n){const t=G0(n.voxel,n.colors,n.moveSpeed,n.orientation,n.gait,n.mount,n.lean,n.hurt,n.animation,n.ik,n.links,n.wrist,n.balance),e=new xe;e.add(t.group);const i={position:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:1,distance:0,coyoteTime:0,jumpBuffer:0},a=[];for(const s of["headPivot","chest","torsoUpper","torso","pelvis"]){const o=t.group.getObjectByName(s);o&&a.push(o)}return{group:e,update(s,o,r){i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.velocity.x=s.velocity.x,i.velocity.y=s.velocity.y,i.velocity.z=s.velocity.z,i.facing=s.facing,i.moveYaw=Math.atan2(i.velocity.x,i.velocity.z),i.bodyYaw=s.bodyYaw,i.headYaw=s.headYaw,i.gaitPhase=s.gaitPhase,i.stride=s.stride,i.distance=s.distance,i.grounded=!0,i.sprinting=!1,e.position.set(s.position.x,s.position.y,s.position.z),e.rotation.y=s.bodyYaw,s.combat&&t.update(i,s.combat,s.hurt,o,!1,r,s.link)},debug(){return t.gaitDebug()},boneAtWorld(s,o,r){if(a.length===0)return null;const c=new W(s,o,r),l=new W;let d=null,u=Number.POSITIVE_INFINITY;for(const h of a){h.updateWorldMatrix(!0,!1),h.getWorldPosition(l);const f=l.distanceToSquared(c);f<u&&(u=f,d=h)}return d?{node:d,point:c}:null},dispose(){t.dispose()}}}const Xa=.012,Va=.016;function _R(n,t,e=[]){const i=t.lab,a=new xe;a.name="test-lab";const s=[],o=[],r=[],c=[];function l(S){return r.push(S),S}function d(S){return c.push(S),S}function u(S,w,E,R=Xa){const b=l(new yn({color:w,transparent:!0,opacity:E,depthWrite:!1,side:Je,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),M=new ge(S,b);return M.rotation.x=-Math.PI/2,M.position.y=R,M.renderOrder=2,M}function h(S,w){return d(new Vs(Math.max(S,.001),w,72))}function f(S,w,E,R=Va){const M=document.createElement("canvas"),P=M.getContext("2d");if(!P)return new ge;const I='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';P.font=I,M.width=mf.ceilPowerOfTwo(Math.ceil(P.measureText(S).width)+32),M.height=mf.ceilPowerOfTwo(96*1.4);const D=M.getContext("2d");if(!D)return new ge;D.font=I,D.textAlign="center",D.textBaseline="middle",D.fillStyle=E,D.fillText(S,M.width/2,M.height/2);const U=new nh(M);U.colorSpace=Hn,o.push(U);const C=M.width/M.height,T=d(new jn(w*C,w)),O=l(new yn({map:U,transparent:!0,depthWrite:!1,side:Je,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),G=new ge(T,O);return G.rotation.x=-Math.PI/2,G.position.y=R,G.renderOrder=3,G}function m(S,w,E,R,b,M){const P=E-w,I=d(new jn(P,R)),D=u(I,b,M,Xa);D.position.set(P/2+w,Xa,0);const U=new xe;return U.add(D),U.rotation.y=S-Math.PI/2,U}function v(S,w,E,R,b){const M=new u0;M.moveTo(0,w*.5),M.lineTo(-E*.5,w*.5-E*.9),M.lineTo(-E*.18,w*.5-E*.9),M.lineTo(-E*.18,-w*.5),M.lineTo(E*.18,-w*.5),M.lineTo(E*.18,w*.5-E*.9),M.lineTo(E*.5,w*.5-E*.9),M.closePath();const P=d(new Nh(M)),I=u(P,R,b,Xa+.002),D=new xe;return D.add(I),D.rotation.y=S+Math.PI,D}function g(S){var P;const w=new xe,E=f(`${S.index} · ${S.name}`,t.lab.labelTextHeight,"#eaf4ff"),b=((P=E.geometry.parameters)==null?void 0:P.width)??3;w.add(E);const M=u(d(new jn(b*.98,.08)),S.color,.7,Va);return M.position.set(0,Va,t.lab.labelTextHeight*.66),w.add(M),w.position.set(S.labelX,0,S.labelZ),w}function p(S,w){const E=new xe,R=S.maxX-S.minX,b=S.maxZ-S.minZ,M=(S.minX+S.maxX)/2,P=(S.minZ+S.maxZ)/2,I=.09,D=.006,U=[[M,S.minZ+I/2,R,I],[M,S.maxZ-I/2,R,I],[S.minX+I/2,P,I,b],[S.maxX-I/2,P,I,b]];for(const[T,O,G,$]of U){const at=u(d(new jn(G,$)),w,.38,D);at.position.set(T,D,O),E.add(at)}const C=.42;for(const[T,O]of[[S.minX+C/2,S.minZ+C/2],[S.maxX-C/2,S.minZ+C/2],[S.minX+C/2,S.maxZ-C/2],[S.maxX-C/2,S.maxZ-C/2]]){const G=u(d(new jn(C,C)),w,.55,D);G.position.set(T,D,O),E.add(G)}return E}const _=new xe,x=new Map;for(const S of n??[])x.set(S.id,S.color);for(const S of e)S.plotId&&_.add(p(S,x.get(S.plotId)??"#7f8fa0"));for(const S of n??[]){const w=new xe;if(w.position.set(S.x,0,S.z),S.shape==="square"){const E=S.radius,R=u(d(new jn(E*2,E*2)),S.color,i.padOpacity*.09);w.add(R);const b=.07,M=[[0,E,E*2+b,b],[0,-E,E*2+b,b],[-E,0,b,E*2+b],[E,0,b,E*2+b]];for(const[P,I,D,U]of M){const C=u(d(new jn(D,U)),S.color,i.padOpacity);C.position.x=P,C.position.z=I,w.add(C)}}else w.add(u(d(new Ih(S.radius,72)),S.color,i.padOpacity*.075)),w.add(u(h(S.radius-.075,S.radius),S.color,i.padOpacity));if(S.id==="hub"){for(let E=0;E<4;E++){const R=E*Math.PI/4,b=E%2===0;for(const M of[0,Math.PI])w.add(m(R+M,S.radius*.12,S.radius*.94,b?.09:.055,S.color,b?.5:.32))}w.add(u(h(.5,.56),S.color,.4))}else if(S.id==="dash"){const E=S.spawnZ-S.z,R=-S.radius+.5,b=E-R,M=u(d(new jn(.06,b)),S.color,.36);M.position.set(0,Xa,(E+R)/2),w.add(M);let P=0;for(let D=E;D>=R-.01;D-=1,P++){const U=P%5===0,C=u(d(new jn(U?2.4:1.3,U?.1:.07)),S.color,U?.72:.42);C.position.set(0,Xa,D),w.add(C);const T=f(String(P),.52,U?"#eaf4ff":"rgba(200,225,245,0.8)");T.position.set(1.6,Va,D),w.add(T)}const I=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[D,U]of I){const C=E-D,T=u(d(new jn(1.9,.09)),"#ffffff",.5);T.position.set(-1.5,Xa,C),w.add(T);const O=f(U,.42,"rgba(220, 236, 250, 0.86)");O.position.set(-3,Va,C),w.add(O)}}else if(S.id==="gait"){w.add(u(h(1.44,1.5),S.color,.5)),w.add(u(h(1.14,1.2),S.color,.22));const E=1.55,R=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[b,M,P]of R){const D=Math.sin(b),U=Math.cos(b),C=v(b,1.7,.34,P,.75);C.position.set(D*1.7*.5,0,E+U*1.7*.5),w.add(C);const T=f(M,.44,P);T.position.set(D*(1.7+.7),Va,E+U*(1.7+.7)),w.add(T)}}if(_.add(w),i.showLabels){const E=g(S);s.push(E),_.add(E)}}a.add(_);const y=n==null?void 0:n.find(S=>S.id==="hub");if(y&&i.showLabels){const S=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[w,E,R]of S){const b=f(R,.4,"rgba(190, 224, 248, 0.8)");b.position.set(y.x+w*(y.radius+.7),Va,y.z+E*(y.radius+.7)),a.add(b),s.push(b)}}return a.visible=i.enabled,{group:a,setVisible(S){a.visible=S},setLabelsVisible(S){for(const w of s)w.visible=S},dispose(){for(const S of c)S.dispose();for(const S of r)S.dispose();for(const S of o)S.dispose();a.clear()}}}const je={grass:8,groundArea:12,ringHalo:20,ring:22,ringMeter:24,ringWarn:26,groundFx:30,trail:40,slash:44,projectileTrail:46,projectile:48,projectileGlow:50};function $l(n,t){n.renderOrder=t,n.traverse(e=>{e.renderOrder=t})}function Zl(n,t,e){const i=Array.from({length:t.count},()=>{const a=new yn({color:t.color,transparent:!0,opacity:0,side:Je,depthWrite:!1,...t.blending?{blending:t.blending}:{}}),s=new ge(t.geometry,a);return s.rotation.x=-Math.PI/2,s.renderOrder=t.renderOrder,s.visible=!1,n.add(s),{mesh:s,mat:a,life:0,base:1,delay:0}});return{entries:i,spawn(a,s,o,r,c){const l=i.find(d=>d.life<=0)??i[0];c!=null&&c.color&&l.mat.color.set(c.color),l.mesh.position.set(a,e(a,s,o)+t.yOffset,s),l.base=r,l.mesh.scale.setScalar(r*t.scaleFrom),l.mesh.visible=!0,l.mat.opacity=t.spawnOpacity,l.life=t.duration,l.delay=(c==null?void 0:c.delay)??0},update(a){for(const s of i){if(s.life<=0)continue;if(s.delay>0){s.delay-=a;continue}s.life-=a;const o=Math.max(0,s.life/Math.max(t.duration,1e-6));s.mesh.scale.setScalar(s.base*(t.scaleFrom+t.scaleSpan*(1-Math.pow(o,t.growPow)))),s.mat.opacity=t.peak*Math.pow(o,t.fadePow),s.life<=0&&(s.mesh.visible=!1)}},live(){return i.filter(a=>a.life>0)},dispose(){for(const a of i)a.mat.dispose()}}}function bR(n,t,e,i){const a=t.dash,s={count:6,geometry:new Vs(a.ringRadius-.06,a.ringRadius,28),color:"#ffffff",renderOrder:je.groundFx,duration:a.fxDuration,peak:.9,fadePow:1,scaleFrom:.6,scaleSpan:1.2,growPow:1,yOffset:.04,spawnOpacity:.9},o=Zl(n,s,i),r=t.links,c={count:5,geometry:new Vs(r.ringRadius-.07,r.ringRadius,28),color:r.chargeColor,renderOrder:je.groundFx,duration:r.fxDuration,peak:.85,fadePow:1,scaleFrom:.55,scaleSpan:1.1,growPow:1,yOffset:.05,spawnOpacity:.85},l=Zl(n,c,i),d=t.groundSlam,u={count:4,geometry:new Vs(.78,1,56),color:d.color,blending:ta,renderOrder:je.groundFx+1,duration:d.duration,peak:.85,fadePow:1.3,scaleFrom:.35,scaleSpan:.65,growPow:1.8,yOffset:.035,spawnOpacity:0},h=Zl(n,u,i);let f=e.dash.id,m="none",v=e.playerLink.id,g=e.playerLink.hitIds.length,p=e.combat.slamAttackId,_=0;return{update(x,y,S){var R;const w=x.character;if(x.dash.id!==f){f=x.dash.id;const b=x.dash;m=b.kind,b.kind==="blink"?(o.spawn(b.fromX,b.fromZ,w.position.y,.9,{color:a.blinkColor}),o.spawn(b.toX,b.toZ,w.position.y,1.35,{color:a.blinkColor})):o.spawn(b.fromX,b.fromZ,w.position.y,1.1,{color:a.rollColor})}if(o.update(y),x.combat.slamAttackId!==p&&(p=x.combat.slamAttackId,_+=1,d.enabled)){const b=(R=x.config.combat.weapons[x.combat.weapon])==null?void 0:R.groundSlam,M=Math.max(.6,(b==null?void 0:b.radius)??2.2);h.spawn(w.position.x,w.position.z,w.position.y,M,{delay:0}),h.spawn(w.position.x,w.position.z,w.position.y,M*d.outerScale,{delay:d.delay}),S(d.shake)}h.update(y);const E=x.playerLink;E.id!==v&&(v=E.id,g=E.hitIds.length,l.spawn(w.position.x,w.position.z,w.position.y,1)),E.hitIds.length>g?(g=E.hitIds.length,l.spawn(w.position.x,w.position.z,w.position.y,1.35)):E.hitIds.length<g&&(g=E.hitIds.length),l.update(y)},slamDebug(){return{spawns:_,lastId:p,live:h.live().map(x=>({life:x.life,scale:x.mesh.scale.x,opacity:x.mat.opacity,visible:x.mesh.visible}))}},groundOrder(){var x;return((x=h.entries[0])==null?void 0:x.mesh.renderOrder)??je.groundFx+1},activeDash(){return o.live().length},dashKind(){return m},dispose(){o.dispose(),l.dispose(),h.dispose();for(const x of[s.geometry,c.geometry,u.geometry])x.dispose()}}}const Hh=64,X0=[0,.24,.76,1],SR=[0,1,1,0],V0=[0,.12,.28,.5,.72,.88,1],wR=[0,.16,.5,1,.5,.16,0];function zp(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function Gh(n,t,e,i,a=Hh,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),c=s==="glow"?V0:X0,l=s==="glow"?wR:SR,d=c.length,u=a+1,h=new Float32Array(u*d*3),f=new Float32Array(u*d*4),m=[];for(let g=0;g<u;g++){const p=g/a,_=(p-.5)*e,x=zp(p,i)*zp(1-p,i),y=Math.sin(_),S=Math.cos(_);for(let w=0;w<d;w++){const E=o+(r-o)*c[w],R=g*d+w;h[R*3]=y*E,h[R*3+1]=0,h[R*3+2]=S*E;const b=x*l[w];f[R*4]=1,f[R*4+1]=1,f[R*4+2]=1,f[R*4+3]=b}}for(let g=0;g<a;g++)for(let p=0;p<d-1;p++){const _=g*d+p,x=_+d;m.push(_,x,_+1,_+1,x,x+1)}const v=new Qe;return v.setAttribute("position",new rn(h,3)),v.setAttribute("color",new rn(f,4)),v.setIndex(m),v.computeBoundingSphere(),v}function jl(n){const t=new yn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Je,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(c,l)=>{const d=Math.round(c*32)/32,u=Math.max(.05,Math.round(l*20)/20),h=`${Math.round(d*32)}|${Math.round(u*20)}`,f=e.get(h);if(f)return f;const m=Gh(n.radius,n.thickness*u,d,n.edgeFade,Hh,n.profile??"band");if(e.set(h,m),e.size>64){for(const[v,g]of e)if(v!==h&&g!==i){g.dispose(),e.delete(v);break}}return m};i=a(n.arcRad,1);const s=new ge(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(c,l,d,u,h,f=1){const m=Math.max(.05,f);(Math.abs(c-o)>.01||Math.abs(m-r)>.01)&&(i=a(c,m),s.geometry=i,o=c,r=m),t.opacity=l,t.color.copy(u),s.scale.set(d,1,d),s.rotation.y=h,s.visible=l>.002},arcRad(){return o},dispose(){for(const c of e.values())c.dispose();e.clear(),t.dispose()}}}function Fp(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function ER(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),c=Math.min(1,Math.max(0,e)),l=a.selectedArcDeg*Math.PI/180,d=s+(l-s)*(.35+.65*r),u=4+4*r+6*c,h=.5+.5*Math.sin(i*u),f=Math.min(.95,o+(.2+.1*c)*r+.04*h),m=1+.02*r+.012*h*r;return{arcRad:d,opacity:f,scale:m,level:r}}function TR(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function AR(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let l=0;l<i;l++){const d=l/n*Math.PI*2,u=Math.sin(d),h=Math.cos(d);for(let f=0;f<a;f++){const m=f/e,v=t+(1-t)*m,g=l*a+f;s[g*3]=u*v,s[g*3+1]=0,s[g*3+2]=h*v;const p=Math.pow(1-m,1.8)*.9+(f===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let l=0;l<n;l++)for(let d=0;d<e;d++){const u=l*a+d,h=u+a;r.push(u,h,u+1,u+1,h,h+1)}const c=new Qe;return c.setAttribute("position",new rn(s,3)),c.setAttribute("color",new rn(o,4)),c.setIndex(r),c.computeBoundingSphere(),c}function Up(n){const t=n.segments??Hh,e=n.profile??"band",a=((e==="glow"?V0.length:X0.length)-1)*6,s=Gh(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new yn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Je,vertexColors:!0,toneMapped:!1}),r=new ge(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let c=0;return{mesh:r,set(l,d,u,h,f=1){const m=Math.min(1,Math.max(0,l)),v=Math.round(m*t),g=m>.001?Math.max(1,v)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),c=v,o.opacity=d,o.color.copy(u),r.scale.set(f,1,f),r.rotation.y=h,r.visible=d>.002&&m>.001},ratio(){return t>0?c/t:0},filledSegments(){return c},dispose(){s.dispose(),o.dispose()}}}function Np(n){const t=new xe,e=AR(48),i=new yn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Je,vertexColors:!0,toneMapped:!1}),a=new ge(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=Gh(1-s*.5,s,Math.PI*2,0,64,"band"),r=new yn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Je,vertexColors:!0,toneMapped:!1}),c=new ge(o,r);return c.renderOrder=(n.renderOrder??2)+1,t.add(c),t.position.y=n.y,{group:t,set(l,d,u,h,f,m){const v=Math.min(1,Math.max(0,f));t.position.set(l,u,d),a.scale.set(h,1,h),c.scale.set(h,1,h),i.opacity=v*.26,r.opacity=v*(.72+.18*Math.sin(m*7)),t.visible=v>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function Op(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function RR(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function PR(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function CR(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function LR(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function DR(n,t,e){return n?t:e}function W0(n){return{x:0,y:0,z:1}}function kR(n){return Math.asin(W0().y)}function IR(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const zR=.15,FR=-.032,UR=[.255,.175,.095,.025],Bp=[[.471,.376],[.53,.101],[.486,-.185],[.35,-.438]],NR=[{L1:.41,L2:.346},{L1:.432,L2:.367},{L1:.454,L2:.389},{L1:.497,L2:.432}],$r=.09,OR=.42,Hp=.045,On={carapace:"#332c47",carapaceTop:"#453c60",carapaceEdge:"#4d4369",leg:"#5d4f82",tarsus:"#463a63",dark:"#1a1626",eyeMain:"#e0395a",eyeSub:"#d4823c"};function BR(n,t){const e=n.map(([f,m,v,g,p,_,x=0,y=0,S=0])=>{const w=new An(f,m,v);return x!==0&&w.rotateX(x),y!==0&&w.rotateY(y),S!==0&&w.rotateZ(S),w.translate(g,p,_),w});let i=0,a=0;for(const f of e)i+=f.attributes.position.count,a+=f.index.count;const s=new Float32Array(i*3),o=new Float32Array(i*3),r=new Float32Array(i*3),c=i>65535?new Uint32Array(a):new Uint16Array(a),l=new ee;let d=0,u=0;e.forEach((f,m)=>{const v=f.attributes.position.count;s.set(f.attributes.position.array,d*3),o.set(f.attributes.normal.array,d*3),l.setStyle(t[m]);for(let p=0;p<v;p++)r[(d+p)*3]=l.r,r[(d+p)*3+1]=l.g,r[(d+p)*3+2]=l.b;const g=f.index.array;for(let p=0;p<g.length;p++)c[u+p]=g[p]+d;d+=v,u+=g.length,f.dispose()});const h=new Qe;return h.setAttribute("position",new rn(s,3)),h.setAttribute("normal",new rn(o,3)),h.setAttribute("color",new rn(r,3)),h.setIndex(new rn(c,1)),h.computeBoundingSphere(),h}function HR(n,t,e,i,a){const s=Math.hypot(n,e),o=-t,r=Math.atan2(n,e),c=(i+a)*.999,l=Math.abs(i-a)+.002,d=Math.hypot(s,o),u=d>c||d<l,h=Math.min(Math.max(d,l),c),f=(i*i+h*h-a*a)/(2*i*h),m=Math.acos(Math.min(1,Math.max(-1,f))),g=Math.atan2(s,o)+m,p=i*Math.sin(g),_=i*Math.cos(g),x=Math.atan2(s-p,o-_);return{yaw:r,femurPitch:-g,tibiaPitch:-(x-g),clamped:u,reach:d/(i+a)}}function GR(n,t={}){const e={height:t.height??.32,lift:t.lift??.13,duty:t.duty??.55,strideRatio:t.strideRatio??.62,bob:t.bob??.006,scale:t.scale??1,inertia:t.inertia??1},i=[],a=new fi({vertexColors:!0}),s=new yn({vertexColors:!0});i.push(a,s);const o=(k,Y,tt=!1)=>{const ut=typeof Y=="string"?k.map(()=>Y):Y,st=BR(k,ut);i.push(st);const wt=new ge(st,tt?s:a);return wt.castShadow=!tt,wt.receiveShadow=!tt,wt},r=new xe;r.name="spider-root",r.scale.setScalar(e.scale);const c=new xe;c.name="spider-body",c.position.y=e.height,r.add(c);const l=new xe;l.name="carapace",l.position.set(0,0,.15),c.add(l);const d=[[.3,.036,.3,0,-.03,0],[.292,.042,.292,0,.008,0],[.268,.038,.268,0,.046,0],[.228,.03,.228,0,.078,0],[.13,.105,.115,0,.03,-.175]],u=[On.carapace,On.carapaceTop,On.carapaceEdge,On.carapaceTop,"#231e33"];for(const k of[-1,1])d.push([.058,.084,.056,k*.044,-.046,.126,.28]),u.push(On.dark),d.push([.022,.042,.022,k*.044,-.098,.108,.95]),u.push("#0f0c18"),d.push([.038,.086,.038,k*.086,-.012,.108,.72,0,k*.14]),u.push(On.leg),d.push([.03,.07,.03,k*.108,-.074,.158,.06]),u.push(On.leg);l.add(o(d,u));const h=[],f=[],m=[[.034,.084,.11,.03,On.eyeMain],[.074,.076,.102,.021,On.eyeSub],[.04,.066,.108,.018,On.eyeSub],[.068,.058,.098,.016,On.eyeSub]];for(const[k,Y,tt,ut,st]of m)for(const wt of[-1,1])h.push([ut,ut,ut*.5,wt*k,Y,tt]),f.push(st);l.add(o(h,f,!0));const v=new xe;v.name="abdomen",v.position.set(0,.055,-.268),v.rotation.x=Hp,c.add(v);const g=[[.292,.044,.352,0,-.072,0],[.34,.05,.416,0,-.028,0],[.37,.054,.456,0,.023,0],[.372,.054,.454,0,.075,0],[.344,.048,.416,0,.124,0],[.284,.038,.338,0,.166,0],[.07,.038,.042,0,-.07,-.238]],p=["#3f3556","#453a5e","#4a3d63","#4d4067","#50426b","#53456f","#231e33"];v.add(o(g,p));const _=[];for(let k=0;k<8;k++){const Y=k<4?-1:1,tt=k%4,{L1:ut,L2:st}=NR[tt],wt=new xe;wt.name=`hip-${k}`,wt.rotation.order="YXZ",wt.position.set(Y*zR,FR,UR[tt]),c.add(wt),wt.add(o([[.088,.078,.1,0,.006,0]],On.leg));const Zt=new xe;Zt.rotation.order="YXZ",wt.add(Zt),Zt.add(o([[.064,ut*.46,.064,0,-ut*.23,0],[.052,ut*.42,.052,0,-ut*.68,0],[.042,ut*.14,.042,0,-ut*.95,0]],On.leg));const j=new xe;j.rotation.order="YXZ",j.position.y=-ut,Zt.add(j),j.add(o([[.072,.05,.072,0,.004,0],[.054,st*.44,.054,0,-st*.26,0],[.043,st*.4,.043,0,-st*.68,0],[.034,st*.16,.034,0,-st*.95,0]],On.leg));const V=new xe;V.position.y=-st,j.add(V),V.add(o([[.044,.042,.044,0,0,0],[.03,$r*.86,.03,0,-$r*.5,0],[.044,.018,.044,0,-$r,0]],On.tarsus));const B=(k<4?0:1)^k%2;_.push({index:k,side:Y,k:tt,hip:wt,femur:Zt,tibia:j,tarsus:V,L1:ut,L2:st,home:new W(Y*Bp[tt][0],0,Bp[tt][1]),phaseOffset:B*.5,foot:new W,from:new W,to:new W,swinging:!1,clamped:!1,reach:0})}let x=0,y=0;r.traverse(k=>{const Y=k;if(!Y.isMesh)return;x++;const tt=Y.geometry;y+=(tt.index?tt.index.count:tt.attributes.position.count)/3});const S=new W,w=new W,E=new W;let R=0,b=0,M=0,P=0,I=!1,D=0,U=0,C=0,T=0,O=0,G=0;const $={pitch:{x:0,v:0},roll:{x:0,v:0},lean:{x:0,v:0},abdom:{x:0,v:0}},at=(k,Y,tt,ut)=>{const st=tt*tt*(Y-k.x)-2*tt*k.v;return k.v+=st*ut,k.x+=k.v*ut,k.x},mt=(k,Y)=>k<-Y?-Y:k>Y?Y:k;let xt={maxReach:0,clamped:0,phase:0,strideUsed:0,gaitSpeed:0,effSpeed:0,slide:0,dt:0,pitch:0,roll:0,leanZ:0,abdomen:0,meshes:x,triangles:y};const Pt=(k,Y,tt,ut)=>(Y.set(k.home.x*ut,0,k.home.z*ut),r.localToWorld(Y),Y.y=tt,Y);return{group:r,update:(k,Y,tt,ut)=>{const st=Math.min(Math.max(ut,0),.05);if(st<=0)return;r.updateWorldMatrix(!0,!1),c.getWorldDirection(E),E.y=0,E.lengthSq()<1e-8&&E.set(0,0,1),E.normalize();const wt=E.z,Zt=-E.x,j=Math.atan2(E.x,E.z);let V=j-b;for(;V>Math.PI;)V-=Math.PI*2;for(;V<-Math.PI;)V+=Math.PI*2;b=j;const B=V/st,zt=Math.hypot(k.position.x-C,k.position.z-T);C=k.position.x,T=k.position.z;const kt=zt>.8;if(kt){R=0;for(const X of _)X.swinging=!1}const yt=kt?0:zt/st,_t=Math.abs(B)*OR,K=.66,lt=Math.max(.62,1/(1+_t*1.1)),L=Math.min(k.stride*e.strideRatio,K)*lt,A=yt+_t,ht=Math.min(6.4*st,(1-e.duty)/1.5),ft=A*st,rt=Math.min(ft,ht*L);A>.02&&(R=(R+rt/Math.max(L,.15))%1);const It=ft-rt,Ct=(k.velocity.x-D)/st,Mt=(k.velocity.z-U)/st;D=k.velocity.x,U=k.velocity.z;const Xt=1-Math.exp(-st*18);O+=(Ct*E.x+Mt*E.z-O)*Xt,G+=(Ct*wt+Mt*Zt-G)*Xt;const pt=e.inertia,Nt=mt(-O*.016,.1)*pt,Z=mt(G*.014-yt*B*.02,.12)*pt,J=mt(-O*.01,.05)*pt,gt=mt(-O*.03,.16)*pt;at($.pitch,Nt,9,st),at($.roll,Z,8,st),at($.lean,J,7,st),at($.abdom,gt,5,st);const bt=k.position.y,Ot=k.grounded?0:1;M+=(Ot-M)*Math.min(1,st*9);const Ft=1-.22*M;P+=st*6.6*Math.min(1,A/1.4),c.position.y=e.height+Math.sin(P)*e.bob*Math.min(A,1.4)-M*.02,c.position.z=$.lean.x,c.rotation.x=$.pitch.x,c.rotation.z=$.roll.x,v.rotation.x=Hp+$.abdom.x,c.updateMatrixWorld(!0);let N=0,Tt=0;if(!I){I=!0,C=k.position.x,T=k.position.z;for(const X of _)Pt(X,X.foot,bt,Ft),X.from.copy(X.foot),X.to.copy(X.foot),X.swinging=!1}for(const X of _){const dt=(R+X.phaseOffset)%1;if(dt<e.duty)X.swinging=!1,It>0&&X.foot.addScaledVector(E,It),A<.02?(Pt(X,S,bt,Ft),X.foot.lerp(S,Math.min(1,st*5))):M>.01&&(Pt(X,S,bt,Ft),X.foot.lerp(S,Math.min(1,st*6)));else{const Lt=(dt-e.duty)/(1-e.duty);X.swinging||(X.swinging=!0,X.from.copy(X.foot),Pt(X,X.to,bt,Ft),X.to.addScaledVector(E,L*e.duty));const qt=Lt*Lt*(3-2*Lt);X.foot.lerpVectors(X.from,X.to,qt),X.foot.y=bt+Math.sin(Math.PI*Lt)*e.lift}w.copy(X.foot),w.y+=$r*.98,c.worldToLocal(w),w.sub(X.hip.position);const Dt=HR(w.x,w.y,w.z,X.L1,X.L2);X.hip.rotation.y=Dt.yaw,X.femur.rotation.x=Dt.femurPitch,X.tibia.rotation.x=Dt.tibiaPitch,X.tarsus.rotation.x=-(Dt.femurPitch+Dt.tibiaPitch)-.1,X.clamped=Dt.clamped,X.reach=Dt.reach,Dt.reach>N&&(N=Dt.reach),Dt.clamped&&Tt++}xt={maxReach:N,clamped:Tt,phase:R,strideUsed:L,gaitSpeed:rt/Math.max(st,1e-6),effSpeed:A,slide:It/Math.max(st,1e-6),dt:st,pitch:$.pitch.x,roll:$.roll.x,leanZ:$.lean.x,abdomen:$.abdom.x,meshes:x,triangles:y}},legs:()=>_.map(k=>({x:k.foot.x,y:k.foot.y,z:k.foot.z,swinging:k.swinging,reach:k.reach})),debug:()=>xt,dispose(){i.forEach(k=>k.dispose()),i.length=0,r.clear()}}}const XR=Math.PI/3;function Gp(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function VR(){let n=0,t=!1;return{update(e,i,a,s=XR){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=Gp(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=Gp(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function WR(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new Qe,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new rn(i,3),o=new rn(a,3);s.setUsage(zo),o.setUsage(zo),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const y=x*2,S=y+1,w=y+2,E=y+3;r.push(y,S,w,S,E,w)}e.setIndex(r),e.setDrawRange(0,0);const c=new yn({vertexColors:!0,transparent:!0,opacity:1,blending:ta,depthWrite:!1,side:Je}),l=new ge(e,c);l.frustumCulled=!1,l.renderOrder=6,l.visible=!1;const d=new ee(n.color);let u=[],h=null,f=0,m=0,v=!1,g=!1,p=0;function _(){const x=u.length;if(x<2||!n.enabled){l.visible=!1,e.setDrawRange(0,0);return}const y=Math.max(.001,n.life);for(let S=0;S<x;S++){const w=u[S],E=Math.max(0,1-w.age/y),R=E*E,b=Math.min(1,w.speed/Math.max(.001,n.minSpeed*2)),M=n.intensity*R*(.55+.45*b)*(1+p),P=.18+.82*E,I=S*6;i[I]=w.tx+(w.bx-w.tx)*P,i[I+1]=w.ty+(w.by-w.ty)*P,i[I+2]=w.tz+(w.bz-w.tz)*P,i[I+3]=w.tx,i[I+4]=w.ty,i[I+5]=w.tz;const D=d.r*M,U=d.g*M,C=d.b*M,T=D*.22,O=U*.22,G=C*.22;a[I]=T,a[I+1]=O,a[I+2]=G;const $=1+n.tipBoost;a[I+3]=Math.min(1,D*$),a[I+4]=Math.min(1,U*$),a[I+5]=Math.min(1,C*$)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),l.visible=!0}return{object:l,update(x,y,S){if(!n.enabled){l.visible=!1;return}const w=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*w),p<.001&&(p=0);for(const E of u)E.age+=w;for(;u.length>0&&u[0].age>n.life;)u.shift();if(y){const E=h?Math.hypot(y.tip.x-h.x,y.tip.y-h.y,y.tip.z-h.z)/Math.max(1e-4,w):0,R=u[u.length-1],b=R?Math.hypot(y.tip.x-R.tx,y.tip.y-R.ty,y.tip.z-R.tz):1/0;if(S&&b>=n.minStep)for(u.push({bx:y.base.x,by:y.base.y,bz:y.base.z,tx:y.tip.x,ty:y.tip.y,tz:y.tip.z,age:0,speed:E});u.length>t;)u.shift();h={x:y.tip.x,y:y.tip.y,z:y.tip.z},f=E,m=b,v=!0}else h=null,v=!1,f=0,m=0;g=S,_()},debug(){return{count:u.length,visible:l.visible,speed:f,moved:m,hasBlade:v,active:g,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){u=[],h=null,p=0,l.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),c.dispose()}}}const YR=`#include <common>
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
}`,$R=`vec4 mvPosition = vec4( transformed, 1.0 );
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
  float effL = ${Ou.toFixed(2)} * aWindGeom.x + aWindGeom.y;
  float theta = atan(sway, max(effL, 1e-3));
  float tLow = theta * ${Ou.toFixed(2)};
  float tUp  = theta * ${Lv.toFixed(2)};

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
gl_Position = projectionMatrix * mvPosition;`,ZR=`#include <common>
varying float vWindShade;`,jR=`#include <color_fragment>
diffuseColor.rgb *= vWindShade;`;function qR(n,t,e,i,a){const s=Math.min(e.blades.length,Math.floor(Math.max(0,i.maxInstances)/2)),o=s*2,r=new Float32Array(o*2),c=new Float32Array(o*3),l=new Float32Array(o*4),d=Math.max(.01,i.segmentHeight);for(let f=0;f<s;f++){const m=e.blades[f],v=Math.min(d,m.height),g=Math.max(0,m.height-v),[p,_]=Pv(a,m.x,m.z,m.yaw*a.jitter),x=Math.min(1.4,Math.max(.6,m.height/(d*1.5)));for(let y=0;y<2;y++){const S=f*2+y;r[S*2]=p,r[S*2+1]=_,c[S*3]=m.x,c[S*3+1]=m.y,c[S*3+2]=m.z,l[S*4]=v,l[S*4+1]=g,l[S*4+2]=x,l[S*4+3]=y}}t.setAttribute("aWindPhase",new Uo(r,2)),t.setAttribute("aWindRoot",new Uo(c,3)),t.setAttribute("aWindGeom",new Uo(l,4));const u=xm(a),h={uWindTime:{value:0},uWindDir:{value:new $t(u.dirX,u.dirZ)},uWindOmega:{value:new $t(u.omega1,u.omega2)},uWindAmp:{value:new $t(u.amp1,u.amp2)},uWindGust:{value:1},uWindShade:{value:u.shadeAmount},uWindOn:{value:a.enabled?1:0}};return n.onBeforeCompile=f=>{Object.assign(f.uniforms,h),f.vertexShader=f.vertexShader.replace("#include <common>",YR).replace("#include <project_vertex>",$R),f.fragmentShader=f.fragmentShader.replace("#include <common>",ZR).replace("#include <color_fragment>",jR)},n.customProgramCacheKey=()=>"grass-wind-pivot-v2",h}function KR(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function JR(n,t,e=Wo){const i=new xe;i.name="grass-layer";const s=n.blades.length,o=Math.max(0,Math.floor(t.maxInstances)),r=Math.min(s,Math.floor(o/2)),c=r*2,l=t.enabled&&c>0,u=(t.palette.length>0?t.palette:["#4a8f57"]).map(B=>new ee(B)),h=new ee(t.stumpColor),f=new ee(t.debris.color),m=new An(1,1,1),v=new An(1,1,1),g=new fi({color:16777215,transparent:!1}),p=qR(g,v,n,t,e),_=new fi({color:f,transparent:!1});let x=null,y=null,S=null;const w=[],E=KR(2654435769^r),R=new Float32Array(r),b=new Uint8Array(r),M=new Float32Array(r),P=new Uint8Array(r).fill(1),I=new Ce,D=new wa,U=new wa,C=new wa,T=new W,O=new W,G=new W,$=new W,at=new ee,mt=new ee,xt=new Ce().makeScale(0,0,0);let Pt=0,q=0,k=0,Y=0,tt=1,ut=1;const st=8;let wt={enabled:e.enabled,time:0,gust:1,mode:"pivot"};function Zt(B,zt){if(u.length===1)return zt.copy(u[0]);const kt=Math.max(0,Math.min(u.length-1,B*(u.length-1))),yt=Math.min(u.length-2,Math.max(0,Math.floor(kt)));return zt.copy(u[yt]).lerp(u[yt+1],Math.min(1,Math.max(0,kt-yt)))}if(l){x=new up(v,g,c),x.instanceMatrix.setUsage(zo),x.castShadow=!1,x.receiveShadow=!0,x.frustumCulled=!1,x.name="grass-blades",x.setColorAt(0,u[0]),y=x.instanceColor,y&&y.setUsage(zo);for(let zt=0;zt<c;zt++)x.setMatrixAt(zt,xt);i.add(x);const B=Math.max(1,Math.floor(t.debris.max));S=new up(m,_,B),S.instanceMatrix.setUsage(zo),S.castShadow=!1,S.receiveShadow=!1,S.frustumCulled=!1,S.name="grass-debris";for(let zt=0;zt<B;zt++)S.setMatrixAt(zt,xt);i.add(S)}i.visible=l;function j(B,zt,kt,yt,_t,K){if(!S)return;const lt=S.count;if(w.length>=lt)return;const L=t.debris.life,A=1.1+E()*1.5;w.push({x:B,y:zt,z:kt,vx:yt*A+(E()-.5)*1.2,vy:1.9+E()*1.8,vz:_t*A+(E()-.5)*1.2,life:L,total:L,size:K*(.55+E()*.45),spin:(E()-.5)*9})}function V(B){if(!S)return;const zt=S.count,kt=12;for(let _t=w.length-1;_t>=0;_t--){const K=w[_t];if(K.life-=B,K.life<=0){w.splice(_t,1);continue}K.vy-=kt*B,K.x+=K.vx*B,K.y+=K.vy*B,K.z+=K.vz*B,K.y<.02&&(K.y=.02,K.vy=-K.vy*.25,K.vx*=.6,K.vz*=.6)}const yt=1e-4;for(let _t=0;_t<zt;_t++){const K=w[_t];if(!K){S.setMatrixAt(_t,xt);continue}const lt=Math.max(yt,K.life/K.total);O.set(K.x,K.y,K.z),T.set(.4+_t*.13,1,.2).normalize(),D.setFromAxisAngle(T,K.spin*(K.total-K.life)),G.set(K.size*lt,K.size*.7*lt,K.size*lt),I.compose(O,D,G),S.setMatrixAt(_t,I)}S.instanceMatrix.needsUpdate=!0}return{object:i,update(B,zt){var gt,bt,Ot;if(!l||!x)return;const kt=B.grass,yt=((gt=B.config.grass)==null?void 0:gt.wind)??Wo,_t=xm(yt),K=((bt=kt.wind)==null?void 0:bt.time)??0,lt=((Ot=kt.wind)==null?void 0:Ot.gust)??1;p.uWindTime.value=K,p.uWindGust.value=lt,p.uWindDir.value.set(_t.dirX,_t.dirZ),p.uWindOmega.value.set(_t.omega1,_t.omega2),p.uWindAmp.value.set(_t.amp1,_t.amp2),p.uWindShade.value=_t.shadeAmount,p.uWindOn.value=yt.enabled?1:0,wt={enabled:yt.enabled,time:K,gust:lt,mode:"pivot"};const L=Math.min(r,kt.blades.length),A=Math.min(.05,Math.max(0,zt)),Q=B.config.grass,ht=(Q==null?void 0:Q.regrowSec)??0,ft=Math.min(1,Math.max(.05,(Q==null?void 0:Q.stumpRatio)??.34)),rt=t.segmentHeight,It=Math.PI*2;x.instanceMatrix.clearUpdateRanges(),y&&y.clearUpdateRanges();let Ct=0,Mt=0,Xt=0,pt=0,Nt=0,Z=0,J=0;for(let Ft=0;Ft<L;Ft++){const N=kt.blades[Ft],Tt=N.cut!==0?1:0,X=N.yaw/It,dt=Dv(N.cut,ht,X),Dt=Math.min(rt,N.height),Lt=Dt*ft,qt=Lt+(N.height-Lt)*dt;if(Ft<st&&(Z+=qt/Math.max(1e-6,N.height),J+=1),dt>.001&&dt<1-.001&&(pt+=1,Nt+=dt),!(P[Ft]===1||Math.abs(N.bend-R[Ft])>1e-4||Tt!==b[Ft]||Math.abs(dt-M[Ft])>.001)){N.bend>.02&&(Mt+=1),Tt&&(Xt+=1);continue}Tt&&!b[Ft]&&P[Ft]!==1&&(j(N.x,N.y+Dt*.75,N.z,N.bendX||1,N.bendZ||0,N.width*1.5),j(N.x,N.y+Dt+(N.height-Dt)*.5,N.z,N.bendX||1,N.bendZ||0,N.width*1.2)),T.set(Math.cos(N.yaw),0,-Math.sin(N.yaw)),C.setFromAxisAngle(T,N.lean),T.set(N.bendZ,0,-N.bendX),U.setFromAxisAngle(T,N.bend),D.copy(U).multiply(C),$.set(N.x,N.y,N.z);const ue=Math.min(rt,qt),ne=Math.max(0,qt-rt);O.set(0,ue*.5,0).applyQuaternion(D).add($),G.set(N.width,ue,N.width),I.compose(O,D,G),x.setMatrixAt(Ft*2,I),ne<1e-4?x.setMatrixAt(Ft*2+1,xt):(O.set(0,ue+ne*.5,0).applyQuaternion(D).add($),G.set(N.width*.84,ne,N.width*.84),I.compose(O,D,G),x.setMatrixAt(Ft*2+1,I)),Zt(N.tone,mt),dt>=1?at.copy(mt):at.copy(h).lerp(mt,dt),x.setColorAt(Ft*2,at),x.setColorAt(Ft*2+1,at),x.instanceMatrix.addUpdateRange(Ft*32,32),y&&y.addUpdateRange(Ft*6,6),R[Ft]=N.bend,b[Ft]=Tt,M[Ft]=dt,P[Ft]=0,Ct+=1,N.bend>.02&&(Mt+=1),Tt&&(Xt+=1)}Ct>0&&(x.instanceMatrix.needsUpdate=!0,y&&(y.needsUpdate=!0)),V(A),Pt=Ct,q=Mt,k=Xt,Y=pt,tt=pt>0?Nt/pt:1,ut=J>0?Z/J:1},debug(){return{enabled:l,blades:s,patches:n.patches.length,instances:c,drawCalls:l?2:0,dirty:Pt,bent:q,cut:k,debris:w.length,growing:Y,avgGrowth:tt,sampleHeight:ut,wind:{...wt}}},dispose(){m.dispose(),v.dispose(),g.dispose(),_.dispose(),i.clear()}}}const ql=10,QR=.14,Do=1e-6;function Ro(n,t,e){return n<t?t:n>e?e:n}function Xp(n,t,e,i){const a=t.length,s=[],o=(d,u,h)=>{s.push(d[0],d[1],d[2],u[0],u[1],u[2],h[0],h[1],h[2])},r=(d,u)=>{const h=u/a*Math.PI*2;return[Math.cos(h)*n,d,Math.sin(h)*n]};for(let d=0;d<a;d++){const u=(d+1)%a,h=r(t[d],d),f=r(t[u],u),m=r(e[d],d),v=r(e[u],u);o(h,f,v),o(h,v,m)}const c=a*6;if(i!=="none"){const d=i==="b"?e:t;let u=0;for(let h=0;h<a;h++)u+=d[h];u/=a;for(let h=0;h<a;h++){const f=(h+1)%a;o([0,u,0],r(d[h],h),r(d[f],f))}}const l=new Qe;return l.setAttribute("position",new De(s,3)),l.addGroup(0,c,0),i!=="none"&&l.addGroup(c,a*3,1),l.computeVertexNormals(),l}function tP(n,t,e,i){const a={x:t.x-n.x,y:t.y-n.y,z:t.z-n.z},s={x:i.x-e.x,y:i.y-e.y,z:i.z-e.z},o={x:n.x-e.x,y:n.y-e.y,z:n.z-e.z},r=(v,g)=>v.x*g.x+v.y*g.y+v.z*g.z,c=r(a,a),l=r(s,s),d=r(s,o);let u=0,h=0;if(c<=Do&&l<=Do)u=0,h=0;else if(c<=Do)u=0,h=Ro(d/l,0,1);else{const v=r(a,o);if(l<=Do)h=0,u=Ro(-v/c,0,1);else{const g=r(a,s),p=c*l-g*g;u=p!==0?Ro((g*d-v*l)/p,0,1):0,h=(g*u+d)/l,h<0?(h=0,u=Ro(-v/c,0,1)):h>1&&(h=1,u=Ro((g-v)/c,0,1))}}const f={x:n.x+a.x*u,y:n.y+a.y*u,z:n.z+a.z*u},m={x:e.x+s.x*h,y:e.y+s.y*h,z:e.z+s.z*h};return{dist:Math.hypot(f.x-m.x,f.y-m.y,f.z-m.z),cq:m}}function eP(n){const t=new xe;t.name="destructibles";const e=[];let i=null,a=null;for(const f of n){const m=new fi({color:new ee(f.color),side:Je}),v=new fi({color:new ee(f.cutColor),side:Je}),g=new ge(new Qe,[m,v]),p=new ge(new Qe,[m,v]);g.name=`lower-${f.id}`,p.name=`upper-${f.id}`;const _=new xe;_.add(p);const x=new xe;x.name=`piece-${f.id}`,x.position.set(f.x,f.y,f.z),x.add(g,_),t.add(x),e.push({id:f.id,root:x,lower:g,upperGroup:_,upper:p,bodyMat:m,capMat:v,key:""})}const s=(f,m)=>{const v=m.cutU*m.height,g=Hv(m.radius,ql,m.cutU,m.height,m.nx,m.ny,m.nz),p=new Array(ql).fill(0),_=new Array(ql).fill(m.height),x=Xp(m.radius,p,g,"b"),y=Xp(m.radius,g.map(S=>S-v),_.map(S=>S-v),"a");f.lower.geometry.dispose(),f.upper.geometry.dispose(),f.lower.geometry=x,f.upper.geometry=y},o=new W;function r(f){for(let m=0;m<e.length;m++){const v=e[m];let g;for(let _=0;_<f.length;_++)if(f[_].id===v.id){g=f[_];break}if(!g){v.upperGroup.visible=!1;continue}const p=`${g.broken}|${g.cutU}|${g.theta}|${g.nx}|${g.ny}|${g.nz}`;p!==v.key&&(s(v,g),v.key=p),v.bodyMat.color.set(g.color),v.capMat.color.set(g.cutColor),v.root.position.set(g.x,g.y,g.z),v.upperGroup.visible=g.broken!==0,v.upperGroup.position.set(0,g.cutU*g.height,0),o.set(g.ax,g.ay,g.az),v.upperGroup.quaternion.setFromAxisAngle(o,g.fall)}}function c(f,m){const v=[],g=(p,_)=>{if(!p){_==="right"?i=null:a=null;return}const x={x:(p.base.x+p.tip.x)/2,y:(p.base.y+p.tip.y)/2,z:(p.base.z+p.tip.z)/2},y=_==="right"?i:a;if(_==="right"?i=x:a=x,!y)return;let S=p.tip.x-p.base.x,w=p.tip.y-p.base.y,E=p.tip.z-p.base.z;const R=x.x-y.x,b=x.y-y.y,M=x.z-y.z;Math.hypot(R,b,M)>.002&&(S=R,w=b,E=M);const I=Math.hypot(S,w,E);I>Do?(S/=I,w/=I,E/=I):(S=0,w=0,E=1);const D={x:0,y:0,z:0},U={x:0,y:0,z:0};for(let C=0;C<f.length;C++){const T=f[C];if(T.broken!==0)continue;D.x=T.x,D.y=T.y,D.z=T.z,U.x=T.x,U.y=T.y+T.height,U.z=T.z;const O=tP(p.base,p.tip,D,U);if(!(O.dist>T.radius+QR)){v.push({id:T.id,x:O.cq.x,y:O.cq.y,z:O.cq.z,dx:S,dy:w,dz:E});break}}};return g(m.right,"right"),g(m.left,"left"),v}function l(){let f=0;const m=[],v=[];let g=0;for(const p of e)p.lower.visible&&(f+=1),p.upperGroup.visible&&(f+=1),v.push({id:p.id,x:p.root.position.x,y:p.root.position.y,z:p.root.position.z});for(const p of d)p.broken!==0&&(g+=1,m.push({id:p.id,cutU:p.cutU,theta:p.theta,nx:p.nx,ny:p.ny,nz:p.nz,fall:p.fall}));return{count:e.length,broken:g,drawCalls:f,positions:v,cuts:m}}let d=n;const u=f=>{d=f,r(f)};function h(){for(const f of e)f.lower.geometry.dispose(),f.upper.geometry.dispose(),f.bodyMat.dispose(),f.capMat.dispose();t.clear()}return u(n),{object:t,update:u,computeHits:c,debug:l,dispose:h}}function nP(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function iP(n,t,e,i,a){var re,te,jt,ye,oe;const s=Math.max(1,n.clientWidth),o=Math.max(1,n.clientHeight),r=new OA({antialias:!0});r.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),r.shadowMap.enabled=!0,r.shadowMap.type=Dm,r.setSize(s,o,!1),n.appendChild(r.domElement);const c=new BA;c.background=new ee("#12161d"),c.add(new S2(11061486,2764600,1.15));const l=(t.gridMeta.minX+t.gridMeta.maxX)/2,d=(t.gridMeta.minZ+t.gridMeta.maxZ)/2,u=Math.max(t.gridMeta.maxX-t.gridMeta.minX,t.gridMeta.maxZ-t.gridMeta.minZ)/2+4,h=new T2(16773852,1.5);h.position.set(l+9,18,d+11),h.target.position.set(l,0,d),h.castShadow=!0,h.shadow.mapSize.set(2048,2048);const f=h.shadow.camera;f.left=-u,f.right=u,f.top=u,f.bottom=-u,f.near=1,f.far=90,c.add(h),c.add(h.target);const m=[],v=new xe;for(const H of t.boxes){const Rt=H.maxX-H.minX,At=H.maxY-H.minY,Et=H.maxZ-H.minZ;let ie=nP(H.kind,e);H.kind==="step"&&(ie=new ee(ie).offsetHSL(0,0,H.maxY*.09).getStyle());const Ht=new fi({color:ie,transparent:!1,opacity:1}),ce=new ge(new An(Rt,At,Et),Ht);ce.position.set((H.minX+H.maxX)/2,(H.minY+H.maxY)/2,(H.minZ+H.maxZ)/2),ce.castShadow=H.kind!=="ground",ce.receiveShadow=!0,ce.add(new xp(new a2(ce.geometry),new eh({color:10467020,transparent:!0,opacity:.32}))),v.add(ce),m.push(Ht)}c.add(v);const g=t.gridMeta,p=[],_=[],x=.002,y=1;for(let H=g.minX;H<=g.maxX+1e-6;H+=y)(Math.round(H/y)%5===0?_:p).push(H,x,g.minZ,H,x,g.maxZ);for(let H=g.minZ;H<=g.maxZ+1e-6;H+=y)(Math.round(H/y)%5===0?_:p).push(g.minX,x,H,g.maxX,x,H);const S=new xe,w=[[p,3358797,.5],[_,4873328,.85]];for(const[H,Rt,At]of w){const Et=new Qe;Et.setAttribute("position",new De(H,3)),S.add(new xp(Et,new eh({color:Rt,transparent:!0,opacity:At})))}S.visible=e.showGrid,c.add(S);const E=_R(i,e,a);c.add(E.group);const R=JR(t.grass,e.grass,t.config.grass.wind);$l(R.object,je.grass),c.add(R.object);const b=eP(t.destructibles);c.add(b.object);let M=[];const P=H=>(H==null?void 0:H.rig)==="spider"?(C=.2,e.camera.pitchDeg=27,GR(e.colors,{height:.35,scale:1.3})):(C=1,e.camera.pitchDeg=I,G0((H==null?void 0:H.voxel)??e.voxel,H!=null&&H.colors?{...e.colors,...H.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance)),I=e.camera.pitchDeg,D=typeof location<"u"?new URLSearchParams(location.search).get("hero"):null;let U=D&&((re=e.bodyTypes)!=null&&re[D])?D:"standard",C=1,T=P((te=e.bodyTypes)==null?void 0:te[U]);const O=WR(e.weaponTrail);$l(O.object,je.trail),c.add(O.object);const G=new xe,$=new xe;let at=.9;const mt=H=>(H==null?void 0:H.rig)==="spider"?.26:.9,xt=(H,Rt)=>{at=Rt,$.position.y=Rt,H.group.position.y=-Rt,$.add(H.group)};xt(T,mt((jt=e.bodyTypes)==null?void 0:jt[U])),G.add($),c.add(G);const Pt=t.config.moveSpeed,q=H=>{H&&(t.config.characterHeight=H.height,H.radius!==void 0&&(t.config.characterRadius=H.radius),t.config.moveSpeed=H.moveSpeed??Pt)};q((ye=e.bodyTypes)==null?void 0:ye[U]);const k=VR();let Y=0;const tt=((oe=t.config.dummies.fighters)==null?void 0:oe.moveSpeed)??t.config.dummies.moveSpeed;function ut(H,Rt){const At=e.dummies.colors,Et=At[Rt%At.length]??"#cccccc";let ie;if(H.weapon){const Ht=e.dummies.fighterColors,ce=Ht&&Ht.length>0?Ht[(Rt-t.config.dummies.count)%Ht.length]:void 0;ie=MR({voxel:e.voxel,colors:ce?{...e.colors,...ce}:e.colors,moveSpeed:tt,orientation:e.orientation,gait:e.gait,mount:e.weaponMount,lean:e.lean,hurt:e.hurt,animation:e.animation,ik:e.ik,links:e.links,wrist:e.weaponWrist,balance:e.balance})}else{const Ht=Z2(e.voxel,e.colors,Et,H.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);ie={group:Ht.group,update:(ce,He)=>Ht.update(ce,He),boneAtWorld:(ce,He,we)=>Ht.boneAtWorld(ce,He,we),dispose:()=>Ht.dispose()}}return ie.group.traverse(Ht=>{Ht.userData.dummyId=H.id}),c.add(ie.group),ie}const st=t.dummies.map(ut),wt=st.map(H=>H.group),Zt=new A2,j=e.groundRing,V=e.voxel.bodyWidth,B=Fp(V,j.playerRadiusFactor),zt=Fp(V,j.dummyRadiusFactor),kt=V*j.thicknessFactor,yt=j.arcDeg*Math.PI/180;let _t=0;const K=(H,Rt,At)=>am(t.boxes,H,Rt,At+.55,0),lt=jl({radius:B,thickness:kt,arcRad:yt,edgeFade:j.edgeFade,color:j.playerColor,opacity:j.playerOpacity,y:.028,renderOrder:je.ring});lt.mesh.name="player-ground-ring",c.add(lt.mesh);function L(H){const Rt=jl({radius:zt,thickness:kt,arcRad:yt,edgeFade:j.edgeFade,color:j.neutralColor,opacity:j.opacity,y:.022,renderOrder:je.ring});return Rt.mesh.name=`dummy-ground-ring-${H.id}`,c.add(Rt.mesh),Rt}function A(H){const Rt=jl({radius:zt*j.haloRadiusFactor,thickness:kt*j.haloThicknessFactor,arcRad:yt,edgeFade:j.edgeFade,color:j.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:je.ringHalo});return Rt.mesh.name=`dummy-ground-halo-${H.id}`,c.add(Rt.mesh),Rt}function Q(H){const Rt=Up({radius:zt*j.warnRadiusFactor,thickness:kt*j.warnThicknessFactor,arcRad:yt,edgeFade:.02,color:j.warnColor,y:.031,renderOrder:je.ringWarn});return Rt.mesh.name=`dummy-ground-warn-${H.id}`,c.add(Rt.mesh),Rt}const ht=t.dummies.map(L),ft=t.dummies.map(A),rt=t.dummies.map(()=>0),It=t.dummies.map(()=>0),Ct=Up({radius:B*j.meterRadiusFactor,thickness:kt*j.meterThicknessFactor,arcRad:yt,edgeFade:.06,color:j.meterColorCharge,y:.03,renderOrder:je.ringMeter});Ct.mesh.name="player-ground-meter",c.add(Ct.mesh);const Mt=t.dummies.map(Q),Xt=Np({color:j.playerColor,y:.042,renderOrder:je.groundArea});Xt.group.name="player-landing-preview",c.add(Xt.group);const pt=new ee,Nt=new ee(j.playerColor),Z=new ee(j.neutralColor),J=new ee(j.lowThreatColor),gt=new ee(j.highThreatColor),bt=new ee(j.meterColorCharge),Ot=new ee(j.meterColorChannel),Ft=new ee(j.meterColorCooldown),N=new ee(j.warnColor),Tt=new xe;c.add(Tt);const X=e.projectiles;function dt(){const Rt=document.createElement("canvas");Rt.width=64,Rt.height=64;const At=Rt.getContext("2d");if(At){const ie=At.createRadialGradient(32,32,0,32,32,32);ie.addColorStop(0,"rgba(255,255,255,1)"),ie.addColorStop(.28,"rgba(255,255,255,0.72)"),ie.addColorStop(.62,"rgba(255,255,255,0.22)"),ie.addColorStop(1,"rgba(255,255,255,0)"),At.fillStyle=ie,At.fillRect(0,0,64,64)}const Et=new nh(Rt);return Et.colorSpace=Hn,Et}function Dt(){const At=document.createElement("canvas");At.width=2,At.height=64;const Et=At.getContext("2d");if(Et){const Ht=Et.createLinearGradient(0,0,0,64);Ht.addColorStop(0,"rgba(255,255,255,0)"),Ht.addColorStop(.55,"rgba(255,255,255,0.35)"),Ht.addColorStop(1,"rgba(255,255,255,0.95)"),Et.fillStyle=Ht,Et.fillRect(0,0,2,64)}const ie=new nh(At);return ie.colorSpace=Hn,ie}const Lt=dt(),qt=Dt(),se=new yn({color:12577023,transparent:!0,opacity:0,side:Je,depthWrite:!1}),ue=new yn({color:14217983,transparent:!0,opacity:0,side:Je,depthWrite:!1,blending:ta}),ne=new xe;ne.position.set(0,.95,.72),Tt.add(ne);const Se=new xe;Se.rotation.x=kR(e.camera.pitchDeg),ne.add(Se);const ke=new kc(.78,X.slashThickness,6,28,Math.PI*1.15),Ae=new xe,dn=new ge(ke,se),Re=new ge(ke,ue);Re.scale.setScalar(1.09),$l(Ae,je.slash),Re.renderOrder=je.slash+1,Ae.add(dn,Re),Se.add(Ae);const Ue=new An(X.arrowWidth,X.arrowWidth,X.arrowLength),mn=new zh(X.arrowHeadSize*.42,X.arrowHeadSize,4);mn.rotateX(Math.PI/2);const Xn=new An(X.arrowWidth*2.6,X.arrowWidth*.4,.1),hn=new jo(X.arrowWidth*.45,X.arrowWidth*1.3,X.trailLength,6,1,!0);hn.rotateX(-Math.PI/2),hn.translate(0,0,-X.trailLength/2);const kn=Array.from({length:10},()=>{const H=new xe,Rt=new yn({color:X.arrowColor,transparent:!0}),At=new yn({color:X.arrowHeadColor,transparent:!0}),Et=new th({map:Lt,color:X.arrowColor,transparent:!0,opacity:.85,blending:ta,depthWrite:!1}),ie=new yn({color:X.arrowTrailColor,map:qt,transparent:!0,opacity:0,blending:ta,depthWrite:!1,side:Je}),Ht=new ge(Ue,Rt),ce=new ge(mn,At);ce.position.z=X.arrowLength/2+X.arrowHeadSize*.42;const He=new ge(Xn,At),we=new ge(Xn,At);He.position.z=-X.arrowLength/2+.08,we.position.z=He.position.z,we.rotation.z=Math.PI/2;const Ie=new lp(Et);Ie.scale.setScalar(X.arrowGlowSize),Ie.renderOrder=je.projectileGlow;const me=new ge(hn,ie);return me.renderOrder=je.projectileTrail,Ht.renderOrder=je.projectile,ce.renderOrder=je.projectile,He.renderOrder=je.projectile,we.renderOrder=je.projectile,H.add(Ht,ce,He,we,Ie,me),H.visible=!1,c.add(H),{group:H,shaftMat:Rt,tipMat:At,glowMat:Et,trailMat:ie,glow:Ie,trail:me,arrowId:0,bone:null}}),En=new Uh(1,0),In=new W(X.boltShapeX,X.boltShapeY,X.boltShapeZ),zn=new yn({color:X.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),Ei=new th({map:Lt,color:X.boltGlowColor,transparent:!0,opacity:.45,blending:ta,depthWrite:!1}),Ti=new yn({color:X.boltGlowColor,map:qt,transparent:!0,opacity:X.trailOpacity,blending:ta,depthWrite:!1,side:Je}),Vn=new jo(.5,.03,X.boltTrailScale,6,1,!0);Vn.rotateX(-Math.PI/2),Vn.translate(0,0,-X.boltTrailScale/2);const z=Array.from({length:24},()=>{const H=new xe,Rt=new ge(En,zn);Rt.scale.copy(In);const At=new lp(Ei);At.scale.setScalar(X.boltGlowScale),At.renderOrder=je.projectileGlow;const Et=new ge(Vn,Ti);return Et.renderOrder=je.projectileTrail,Rt.renderOrder=je.projectile,H.add(Rt,At,Et),H.visible=!1,c.add(H),{group:H,core:Rt}}),it=Array.from({length:6},()=>{const H=Np({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:je.groundArea});return H.group.visible=!1,c.add(H.group),H}),ct=bR(c,e,t,K),ot=P2(e.camera,e.smartCamera,e.zoom,s/o),nt=t.character.position;ot.update(nt.x,nt.y,nt.z,1,t.camera);function Ut(H){const Rt=H.dummies.length;for(;st.length<Rt;){const Et=st.length,ie=H.dummies[Et],Ht=ut(ie,Et);st.push(Ht),wt.push(Ht.group),ht.push(L(ie)),ft.push(A(ie)),Mt.push(Q(ie)),rt.push(0),It.push(0)}let At=!1;for(;st.length>Rt;){At=!0;const Et=st.pop();c.remove(Et.group),Et.dispose(),wt.pop();const ie=ht.pop();c.remove(ie.mesh),ie.dispose();const Ht=ft.pop();c.remove(Ht.mesh),Ht.dispose();const ce=Mt.pop();c.remove(ce.mesh),ce.dispose(),rt.pop(),It.pop()}if(At)for(let Et=0;Et<Rt;Et++){const ie=H.dummies[Et].id;st[Et].group.userData.dummyId!==ie&&st[Et].group.traverse(Ht=>{Ht.userData.dummyId=ie})}}function Gt(H,Rt){if(wt.length===0)return 0;const At=r.domElement.getBoundingClientRect(),Et=new $t((H-At.left)/At.width*2-1,-((Rt-At.top)/At.height)*2+1);Zt.setFromCamera(Et,ot.camera);const ie=Zt.intersectObjects(wt,!0);for(const Ht of ie){const ce=Ht.object.userData.dummyId;if(ce&&ce>0)return ce}return 0}function Jt(H,Rt,At){const Et=r.domElement.getBoundingClientRect(),ie=new W(H,Rt,At).project(ot.camera);return{x:Et.left+(ie.x*.5+.5)*Et.width,y:Et.top+(-ie.y*.5+.5)*Et.height}}let Kt=!1;return{balanceDebug(){var H;return((H=T.balanceDebug)==null?void 0:H.call(T))??null},spineDebug(){var H;return((H=T.spineDebug)==null?void 0:H.call(T))??null},spiderDebug(){var H;return((H=T.debug)==null?void 0:H.call(T))??null},gaitDebug(){var H;return((H=T.gaitDebug)==null?void 0:H.call(T))??{stopT:0,hipYaw:0,chestYaw:0,speed:0,gaitSpeed:0,stopStep:0,stopShift:0,stopDip:0,stopYawFade:0,turnStep:0,legLPitch:0,legLRoll:0,legRPitch:0,legRRoll:0,legTakeover:0,phase:0,dirF:0,dirR:0,hipYawTarget:0,spin:0}},trailDebug(){return O.debug()},stretchDebug(){var Rt;const H=((Rt=T.stretch)==null?void 0:Rt.call(T))??{arm:1,leg:1,torso:1,impact:0};return{arm:H.arm,leg:H.leg,torso:H.torso,impact:H.impact}},swingDebug(){var H;return((H=T.swingDebug)==null?void 0:H.call(T))??{seg:0,kind:"none",lead:"R",yaw:0,pitch:0,roll:0,strike:0,rootYaw:0,spinYaw:0,rootTurn:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0,shoulderL:{x:0,y:0,z:0},shoulderR:{x:0,y:0,z:0}}},stanceDebug(){var H;return((H=T.stanceDebug)==null?void 0:H.call(T))??{weapon:t.combat.weapon,weight:0,armL:{pitch:0,yaw:0,roll:0,elbow:0},armR:{pitch:0,yaw:0,roll:0,elbow:0},torsoYaw:0,torsoPitch:0,bladePitchDeg:0,bladePitchOffDeg:0,armSwing:0}},bladeWorld(){var H;return((H=T.weaponBlade)==null?void 0:H.call(T))??null},bladesWorld(){var H;return((H=T.bladesWorld)==null?void 0:H.call(T))??{right:null,left:null}},slamDebug(){return ct.slamDebug()},yawDebug(){var H;return{target:Y,shown:k.value,tauMs:((H=e.renderInterp)==null?void 0:H.yawSmoothMs)??0}},grassDebug(){return R.debug()},breakHits(){return M},destructibleDebug(){return b.debug()},fxDebug(){var H,Rt;return{boxOpaque:m.every(At=>!At.transparent),boxCount:m.length,orders:{ring:lt.mesh.renderOrder,groundFx:ct.groundOrder(),trail:O.object.renderOrder,slash:Ae.renderOrder,projectile:((Rt=(H=kn[0])==null?void 0:H.group.children[0])==null?void 0:Rt.renderOrder)??-1}}},renderPose(){return{x:G.position.x,y:G.position.y,z:G.position.z,bodyYaw:G.rotation.y}},projectPoint(H,Rt,At){return Jt(H,Rt,At)},setClipT(H){var Rt;(Rt=T.setClipT)==null||Rt.call(T,H)},weaponDebug(){var H;return((H=T.weaponDebug)==null?void 0:H.call(T))??{wristPitch:0,wristTwist:0}},gripDebug(){var H;return((H=T.gripDebug)==null?void 0:H.call(T))??{active:!1,dist:0,gy:0,pitch:0,joint:0,grip:0}},render(H,Rt){var $n,Xi,os;Ut(H);const At=H.character,Et=H.combat,ie=e.hitstop.enabled&&H.combat.hitstop>0,Ht=Rt*Math.max(0,Math.min(4,Et.warp??1));if(ie&&!Kt){const de=Math.max(0,H.combat.hitstop),Bt=Math.max(0,Math.min(1,de/.1));ot.addShake(.34+Bt*.48);let he=null;for(let cn=0;cn<H.events.length;cn++){const gn=H.events[cn];if(gn.type==="hit"){he=gn;break}}he&&ot.addKick(he.x-At.position.x,he.z-At.position.z,.03+Bt*.05)}Kt=ie;for(let de=0;de<H.events.length;de++){const Bt=H.events[de];if(Bt.type!=="notify")continue;const he=Number.isFinite(Bt.value)?Bt.value:0;if(Bt.name==="blade-air"){const cn=Math.max(0,Math.min(1,he));O.pulse((Et.weapon==="greatsword"?.9:.55)*(.4+.6*cn))}}G.position.set(At.position.x,At.position.y,At.position.z),Y=At.bodyYaw,G.rotation.y=k.update(Y,Rt,(($n=e.renderInterp)==null?void 0:$n.yawSmoothMs)??0);const ce=H.dash.phase==="active"&&H.dash.kind==="roll",He=ce&&H.dash.duration>0?Math.min(1,1-H.dash.timer/H.dash.duration):0;if($.rotation.x=ce?He*Math.PI*2:0,$.position.y=at-(ce?.2*Math.sin(Math.PI*He):0),Ht>0&&T.update(At,Et,H.playerHurt,Ht,H.abilities.channeling,H.time,H.playerLink,H.turnInPlace),O.update(Ht,Ht>0?((Xi=T.weaponBlade)==null?void 0:Xi.call(T))??null:null,Ht>0&&(Et.phase==="active"||H.playerLink.phase==="active"||ce&&H.dash.duration>0)),Ht>0)for(let de=0;de<st.length;de++)H.dummies[de]&&st[de].update(H.dummies[de],Ht,H.time);const we=ot.camera.position,Ie=Math.atan2(we.x-At.position.x,we.z-At.position.z),me=H.config.gaze.hurtHoldSec,_e=H.time-H.playerHurt.lastAt,Pe=me>0&&_e>=0&&_e<me?1-_e/me:0,Le=ER(H.gaze.active,H.gaze.threat,Pe,H.time,j);TR(pt,Nt,J,gt,Le.level),_t=DR(At.grounded,At.position.y,_t),lt.mesh.position.set(At.position.x,_t+.028,At.position.z),lt.update(Le.arcRad,Le.opacity,Le.scale,pt,Ie);const $e=H.config.abilities.arcane,un=Math.max(1,Math.floor($e.waves)),Ai=Math.max(1e-4,$e.waveInterval),Kn=PR({charging:Et.charging,charge:Et.charge,channeling:H.abilities.channeling,fireTimer:H.abilities.fireTimer,fireInterval:Ai,channelProgress:H.abilities.channeling?(H.abilities.waveIndex+(1-Math.min(1,Math.max(0,H.abilities.fireTimer/Ai))))/un:0,arcaneCooldown:H.abilities.cooldown,arcaneCooldownMax:$e.cooldown,dashCooldown:H.dash.cooldown,dashCooldownMax:H.dash.kind==="blink"?H.config.dash.blinkCooldown:H.config.dash.rollCooldown});Ct.mesh.position.set(At.position.x,At.position.y+.03,At.position.z),Ct.set(Kn.ratio,Kn.source==="none"?0:j.meterOpacity,Kn.source==="charge"?bt:Kn.source==="channel"?Ot:Ft,Ie);const Wn=H.playerLink,Gi=Wn.weapon?H.config.links.moves[Wn.weapon]:void 0,Yn=CR(Wn.phase,At.position.x,At.position.z,Wn.facing,Wn.travel,(Gi==null?void 0:Gi.hit.radius)??.9);Xt.set(Yn.x,Yn.z,K(Yn.x,Yn.z,At.position.y)+.042,Yn.radius,Yn.active?j.landingOpacity:0,H.time);for(let de=0;de<ht.length;de++){const Bt=H.dummies[de],he=ht[de],cn=ft[de],gn=Mt[de];if(!Bt){he.mesh.visible=!1,cn.mesh.visible=!1,gn.mesh.visible=!1;continue}const sa=H.targeting.hasTarget&&H.targeting.targetId===Bt.id;if(Tv(H,Bt)){const nr=Av(H,Bt);pt.copy(J).lerp(gt,nr)}else pt.copy(Z);const ri=RR(Bt.attackPhase,Bt.attackPhaseTimer,H.config.dummies.attackWindup);ri.active?(pt.lerp(N,.5*ri.urgency),gn.mesh.position.set(Bt.position.x,Bt.position.y+.031,Bt.position.z),gn.set(ri.ratio,j.warnOpacity*(.65+.35*ri.urgency),N,Ie)):gn.set(0,0,N,Ie);const oa=sa?1:0,er=oa>rt[de]?j.haloFadeInSec:j.haloFadeOutSec;rt[de]=Op(rt[de],oa,Rt,er);const mi=rt[de],gi=1+.02*mi*Math.sin(H.time*2.2+Bt.id),Rn=j.arcDeg+(j.selectedArcDeg-j.arcDeg)*mi;he.mesh.position.set(Bt.position.x,Bt.position.y+.022,Bt.position.z),he.update(Rn*Math.PI/180,j.opacity+(j.selectedOpacity-j.opacity)*mi,1+(j.selectedScale-1)*mi*gi,pt,Ie,1+(j.selectedThicknessScale-1)*mi),It[de]=Op(It[de],oa,Rt,oa>It[de]?j.haloFadeInSec:j.haloFadeOutSec);const Ra=It[de];cn.mesh.position.set(Bt.position.x,Bt.position.y+.019,Bt.position.z),cn.update(Rn*Math.PI/180,j.haloOpacity*Ra*(.88+.12*Math.sin(H.time*2.2+Bt.id)),j.selectedScale*(.94+.06*Ra)*gi,pt,Ie)}Tt.position.set(At.position.x,At.position.y,At.position.z),Tt.rotation.y=Et.phase!=="idle"?Et.attackFacing:At.bodyYaw,ct.update(H,Rt,de=>ot.addShake(de));const pi=X.slashEnabled&&Et.phase==="active"&&Et.comboIndex>=3;se.opacity=pi?.7:0,ue.opacity=pi?X.slashGlowOpacity:0,pi&&(Ae.rotation.z=-1.2+Et.attackProgress*3.2,Ae.scale.setScalar(.9+Et.comboIndex*.13));for(let de=0;de<z.length;de++){const Bt=H.abilities.projectiles[de],he=z[de];he.group.visible=!!Bt,Bt&&(he.group.position.set(Bt.x,Bt.y,Bt.z),he.group.scale.setScalar(Bt.radius),he.group.rotation.set(0,Math.atan2(Bt.dirX,Bt.dirZ),0))}for(let de=0;de<it.length;de++){const Bt=H.abilities.rings[de],he=it[de];if(!Bt){he.group.visible=!1;continue}const cn=Math.max(0,Math.min(1,Bt.life/Math.max(Bt.duration,1e-6))),gn=LR(Math.max(0,Bt.duration-Bt.life),j.areaExpandSec);he.set(Bt.x,Bt.z,K(Bt.x,Bt.z,At.position.y)+.045,Bt.radius*gn.scale,j.areaOpacity*(.35+.65*cn)*gn.alpha,H.time)}for(let de=0;de<kn.length;de++){const Bt=H.arrows[de],he=kn[de];if(!Bt){he.group.visible=!1,he.bone&&(c.attach(he.group),he.bone=null),he.arrowId=0;continue}const cn=Bt.stuck&&Bt.stuckDummy>=0;if(he.arrowId!==Bt.id){if(he.bone&&(c.attach(he.group),he.bone=null),he.arrowId=Bt.id,he.group.position.set(Bt.x,Bt.y,Bt.z),he.group.rotation.set(Bt.pitch,Bt.yaw,0,"YXZ"),cn){const sa=st[Bt.stuckDummy],ri=sa?sa.boneAtWorld(Bt.x,Bt.y,Bt.z):null;ri&&(ri.node.attach(he.group),he.bone=ri.node)}}else he.bone||(he.group.position.set(Bt.x,Bt.y,Bt.z),he.group.rotation.set(Bt.pitch,Bt.yaw,0,"YXZ"));he.group.visible=!0;const gn=Bt.stuck?Math.min(1,Bt.rest/.6):1;he.shaftMat.opacity=gn,he.tipMat.opacity=gn,he.glowMat.opacity=(Bt.stuck?.28:.85)*gn,he.trailMat.opacity=Bt.stuck?0:X.trailOpacity*gn,he.trail.visible=!Bt.stuck}if(R.update(H,Rt),b.update(H.destructibles),Et.phase==="active"||H.playerLink.phase==="active"){const de=b.computeHits(H.destructibles,((os=T.bladesWorld)==null?void 0:os.call(T))??{right:null,left:null});for(let Bt=0;Bt<de.length;Bt++){let he=!1;for(let cn=0;cn<M.length;cn++)if(M[cn].id===de[Bt].id){he=!0;break}he||M.push(de[Bt])}}else M=[];ot.update(At.position.x,At.position.y,At.position.z,Rt,H.camera),r.render(c,ot.camera)},resize(){const H=Math.max(1,n.clientWidth),Rt=Math.max(1,n.clientHeight);r.setSize(H,Rt,!1),ot.resize(H/Rt)},getGroundBasis(){return ot.getGroundBasis()},setCollidersVisible(H){for(const Rt of m)Rt.opacity=H?.3:1,Rt.wireframe=H,Rt.transparent=H,Rt.depthWrite=!H,Rt.needsUpdate=!0},setGridVisible(H){S.visible=H},setLabVisible(H){E.setVisible(H)},setLabLabelsVisible(H){E.setLabelsVisible(H)},snapCamera(H,Rt,At){ot.snap(H,Rt,At)},setZoom(H){ot.setZoom(H*C)},setBodyType(H){var At;const Rt=(At=e.bodyTypes)==null?void 0:At[H];return!Rt||H===U||($.remove(T.group),T.dispose(),T=P(Rt),xt(T,mt(Rt)),O.reset(),U=H,q(Rt)),U},bodyTypes(){return{id:U,ids:Object.keys(e.bodyTypes??{})}},heroGroup:()=>T.group,pickDummy:Gt,dummyRenderCount:()=>st.length,projectToScreen:Jt,dummyRigDebug(H){const Rt=st[H-1];return Rt!=null&&Rt.debug?Rt.debug():null},diagnostics(){var At,Et,ie,Ht,ce,He,we,Ie,me;const H=W0(e.camera.pitchDeg),Rt=IR(H,Tt.rotation.y);return{lean:((At=T.lean)==null?void 0:At.call(T))??{forward:0,side:0},slashNormal:Rt,arrowForward:((Et=T.arrowDirection)==null?void 0:Et.call(T))??{x:0,y:0,z:1},gait:{hipYaw:((ie=T.hipYaw)==null?void 0:ie.call(T))??0,gaitYaw:((Ht=T.gaitYaw)==null?void 0:Ht.call(T))??0},attackBlend:((ce=T.attackBlend)==null?void 0:ce.call(T))??0,attackWeights:((He=T.attackWeights)==null?void 0:He.call(T))??{gaitScale:1,attackLegWeight:0,driveSpeed:0,stridePhase:0,strideBase:0,stepIndex:0},landing:((we=T.landing)==null?void 0:we.call(T))??{pulse:0,remaining:0,kind:"none",impactVy:0},hurt:((Ie=T.hurt)==null?void 0:Ie.call(T))??I0(),ik:((me=T.ik)==null?void 0:me.call(T))??{active:!1,weight:0,clamped:0,maxError:0},link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:$.rotation.x,activeRings:ct.activeDash(),lastKind:ct.dashKind()},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...ot.smart(),shake:ot.shakeLevel(),kick:ot.kickLevel(),kickCount:ot.kickCount()}}},dispose(){T.dispose(),E.dispose(),R.dispose(),b.dispose();for(const H of st)H.dispose();lt.dispose();for(const H of ht)H.dispose();for(const H of ft)H.dispose();Ct.dispose(),O.dispose();for(const H of Mt)H.dispose();Xt.dispose(),ke.dispose(),se.dispose(),ue.dispose(),En.dispose(),zn.dispose(),Ei.dispose(),Ti.dispose(),Vn.dispose();for(const H of it)H.dispose();Ue.dispose(),mn.dispose(),Xn.dispose(),hn.dispose();for(const H of kn)H.shaftMat.dispose(),H.tipMat.dispose(),H.glowMat.dispose(),H.trailMat.dispose();Lt.dispose(),qt.dispose(),ct.dispose(),v.traverse(H=>{H instanceof ge&&H.geometry.dispose()}),r.dispose(),r.domElement.remove()}}}async function aP(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function sP(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function oP(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=_=>e.querySelector(`#${_}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),d=i("diag-close"),u=i("diag-mask");let h=!1,f=!0,m=0;function v(){const _=n.status();a.textContent=_.enabled?`已记录 ${_.durationS.toFixed(1)}s · ${_.frames} 帧 · 事件 ${_.events} · 异常 ${_.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=_.enabled?"暂停记录":"继续记录"}function g(_){h=_,e.hidden=!_,_?v():s.hidden=!0}function p(_){o.textContent=_,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",_=>{_.preventDefault(),_.stopPropagation(),g(!h)}),d.addEventListener("click",()=>g(!1)),u.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const _=n.summary();aP(_).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=_,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const _=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);sP(`harness-${_.meta.version}-${x}.json`,JSON.stringify(_)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),s.hidden=!0,v(),p("已清空")}),l.addEventListener("click",()=>{f=!f,n.setEnabled(f),v()}),{tick(){const _=n.status();t==null||t.classList.toggle("is-alert",_.alert),h&&v()},isOpen:()=>h,close:()=>g(!1)}}const rP={intents:{...Wp},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function cP(){var j;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Yv(Cm,qr),i=iP(n,e,Sn,qr.stations,qr.slabs),a=Jv(e),s=Sb(t),o=wb(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.75 · 11-10 01:06 · 诊断");const c=V=>String(V).padStart(2,"0"),l=new Date,d=Ry({meta:{version:"v0.9.75",buildTime:"11-10 01:06",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),u=oP(d,r),h=Mb({deadZone:()=>Sn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0,phaseSource:()=>i.gaitDebug().phase});document.addEventListener("visibilitychange",()=>{document.hidden&&d.suspend(800)});const f={timeScale:1,paused:!1,showColliders:Sn.showColliders,showGrid:Sn.showGrid,showLab:Sn.lab.enabled,showLabLabels:Sn.lab.showLabels};let m=1,v=!1;const g=xy({maxRadiusPx:()=>Sn.joystick.maxRadiusPx,deadZone:Sn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>Sn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let _=e.combat.weapon;function x(V){if(V===_)return;_=V;const B=Ea.indexOf(V)+1;for(const zt of p)zt.classList.toggle("is-active",Number(zt.dataset.weapon)===B);E.refreshWeapon()}let y=rP,S=0;const w=()=>{m=1,i.setZoom(1)},E=Q_(e,Sn,f,{singleStep:()=>a.singleStep(y.intents),reset:()=>{m=1,a.singleStep({...Wp,resetPressed:!0})},resetZoom:w,onToggleColliders:V=>i.setCollidersVisible(V),onToggleGrid:V=>i.setGridVisible(V),onToggleLab:V=>i.setLabVisible(V),onToggleLabLabels:V=>i.setLabLabelsVisible(V),setFighterMode:V=>{for(const B of e.dummies)B.weapon&&(B.mode=V,B.attackPhase="idle",B.attackPhaseTimer=0,B.attackProgress=0,B.attackCooldown=0,B.combat&&(B.combat.phase="idle",B.combat.attackProgress=0,B.combat.comboIndex=0))}}),R=nb({stations:Qi.stations,plots:$u,world:e,view:i,onResetZoom:w,onPlotTest:V=>{rd(e);const B=dv(e,V);return C(`已在「${V.name}」生成 ${B} 人 · 点「清除测试单位」回基线`),B},onClearTestUnits:()=>{const V=rd(e);return C(V>0?`已清除 ${V} 个测试单位`:"当前没有测试单位"),V}});o.register({motion:h,debug:E.gui}),window.addEventListener("resize",()=>i.resize());const b=i.bodyTypes().ids,M=document.getElementById("body-toggle"),P=V=>{var B,zt;return((zt=(B=Sn.bodyTypes)==null?void 0:B[V])==null?void 0:zt.name)??V},I=()=>{if(!M)return;const V=i.bodyTypes().id;M.textContent=`体型 ${P(V)}`,M.setAttribute("aria-label",`切换体型（当前：${P(V)}，快捷键 B）`)},D=document.createElement("div");D.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(D);let U=0;const C=V=>{D.textContent=V,D.style.opacity="1",window.clearTimeout(U),U=window.setTimeout(()=>{D.style.opacity="0"},1600)},T=()=>{if(b.length<2){C("只有一个体型预设");return}const V=i.bodyTypes().id,B=Math.max(0,b.indexOf(V)),zt=i.setBodyType(b[(B+1)%b.length]);I(),C(`体型：${P(zt)}（B / 顶部胶囊切换）`)};I(),M==null||M.addEventListener("click",T);const O=document.getElementById("wind-toggle"),G=()=>{var V;return(V=e.config.grass)==null?void 0:V.wind},$=()=>{var B;if(!O)return;const V=!!((B=G())!=null&&B.enabled);O.textContent=`风：${V?"开":"关"}`,O.classList.toggle("is-off",!V),O.setAttribute("aria-label",`${V?"关闭":"开启"}风吹麦浪（当前${V?"开启":"关闭"}，快捷键 G）`)},at=()=>{const V=G();if(!V){C("本场景未启用草块");return}V.enabled=!V.enabled,$(),C(`风吹麦浪：${V.enabled?"开":"关"}（G 切换）`)};$(),O==null||O.addEventListener("click",at),window.addEventListener("keydown",V=>{V.repeat||(V.code==="KeyB"?T():V.code==="KeyG"&&at())}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:Sn,debug:f,getUserZoom:()=>m,getGestures:()=>y.gestures,getLastGesture:()=>y.lastGesture,telemetry:d,telemetrySummary:()=>d.summary(),dirDebug:h.dirDebug,dirAngles:()=>h.dirDebug.last(),motionDebug:h,speedDebug:()=>h.last(),speedSamples:()=>h.samples(),gaitDebug:()=>i.gaitDebug(),spiderDebug:()=>i.spiderDebug(),dummyRigDebug:V=>i.dummyRigDebug(V),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:tt,applied:ut,enabled:q,skip:st}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),fxDebug:()=>i.fxDebug(),grassDebug:()=>i.grassDebug(),breakDebug:()=>({version:"v0.9.75",count:e.destructibles.length,broken:e.destructibles.filter(V=>V.broken!==0).length,cuts:e.destructibles.map(V=>({id:V.id,kind:V.kind,broken:V.broken,cutU:V.cutU,theta:V.theta,nx:V.nx,ny:V.ny,nz:V.nz,fall:V.fall,height:V.height})),rendered:i.destructibleDebug()}),breakTest:(V,B,zt=1,kt=0,yt=0)=>Xv(e,V,B,zt,kt,yt),resetBreaks:()=>(_m(e),e.destructibles.length),breakHits:()=>i.breakHits(),windDebug:()=>{var B;const V=i.grassDebug().wind;return{configured:!!((B=G())!=null&&B.enabled),rendered:V.enabled,time:V.time,gust:V.gust}},setWind:V=>{const B=G();return B?(B.enabled=!!V,$(),B.enabled):!1},setRenderInterp:V=>(q=!!V,q),renderHold:()=>v,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(V,B,zt)=>i.projectPoint(V,B,zt),setBodyType:V=>{const B=i.setBodyType(V);return I(),B},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var V;return Object.keys(((V=Sn.animation.swing)==null?void 0:V.clips)??{})},preview:V=>{const B=e.combat,zt={...B};B.weapon=V.weapon,B.phase="active",B.comboIndex=Math.max(1,Math.min(3,Math.floor(V.comboIndex))),B.attackProgress=Math.max(0,Math.min(1,V.progress)),B.attackFacing=e.character.bodyYaw,i.setClipT(typeof V.t=="number"?V.t:null);const kt=Math.max(1,Math.min(30,Math.floor(V.warm??12)));v=!0;for(let yt=0;yt<kt;yt++)i.render(e,1/60);return i.setClipT(null),Object.assign(B,zt),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:V=>{e.character.bodyYaw=V},zoom:V=>{m=Vu(V,1,Sn.zoom.min,Sn.zoom.max),i.setZoom(m)},release:()=>{v=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),plotDebug:()=>({version:"v0.9.75",count:Qi.plots.length,diagnostics:Qi.diagnostics,testUnits:hv(e),dummies:e.dummies.length,rendered:i.dummyRenderCount(),bounds:Qi.bounds,worldBounds:e.config.worldBounds,slabs:Qi.slabs.map(V=>({plotId:V.plotId,cell:V.cell,span:V.span,rect:[V.minX,V.maxX,V.minZ,V.maxZ],top:V.top})),plots:Qi.plots.map(V=>({id:V.id,index:V.index,placement:V.placement,slot:V.slot,cell:V.cell,span:V.span,centerX:V.centerX,centerZ:V.centerZ,spawnX:V.station.spawnX,spawnZ:V.station.spawnZ,slab:[V.slab.minX,V.slab.maxX,V.slab.minZ,V.slab.maxZ],hasTest:!!V.testSpawn}))}),spawnAt:V=>R.spawnAt(V),clearSpawned:()=>R.clearSpawned(),lab:{stations:Qi.stations,plots:$u,goto:V=>R.goto(V),current:()=>R.current(),recall:()=>R.recall(),spawnAt:V=>R.spawnAt(V),clearSpawned:()=>R.clearSpawned()}};let mt=performance.now(),xt=60,Pt=0,q=((j=Sn.renderInterp)==null?void 0:j.enabled)??!0,k=Xu(e),Y=null,tt=1,ut=!1,st="";function wt(V){const B=q&&!f.paused&&f.timeScale>0;if(ut=!1,st="",!B)return st="off",tt=1,e;if(!Y)return st="noprev",tt=1,e;if(!ty(Y,k))return st="key",tt=1,e;const zt=a.alpha;return tt=zt,zt>=.999?(st="alpha",e):(ut=!0,ny(e,ey(Y,k,zt)))}function Zt(V){const B=Math.min((V-mt)/1e3,.1);mt=V,B>0&&(xt=xt*.9+1/B*.1);const zt=g.sample();zt.intents.resetPressed&&(m=1),m=Vu(m,zt.zoomScale,Sn.zoom.min,Sn.zoom.max),i.setZoom(m);let kt=zt.intents.dummyClickId;if(zt.tap){const K=i.pickDummy(zt.tap.x,zt.tap.y);K>0&&(kt=K)}kt>0&&(S=kt),y={...zt,intents:{...zt.intents,dummyClickId:S,breakHits:i.breakHits()}};const yt=a.frame(B,y.intents,f.timeScale,f.paused,()=>{const K=e.events;for(let lt=0;lt<K.length;lt++)d.event(K[lt],e.time);Y=k,k=Xu(e)});yt>0&&(S=0),d.sample(e,y,B*1e3,yt);for(const K of y.gestures)d.gesture(K);V-Pt>250&&(Pt=V,u.tick()),x(e.combat.weapon),v||i.render(wt(),B),R.tick(),h.update(e,y,i.getGroundBasis());const _t=i.diagnostics();s.update(e,xt,yt,y,f,{attackBlend:_t.attackBlend,attackWeights:_t.attackWeights,landing:_t.landing,hurt:_t.hurt,ik:_t.ik,zoom:_t.camera.zoom},o.hudCompact()),requestAnimationFrame(Zt)}requestAnimationFrame(Zt)}cP();

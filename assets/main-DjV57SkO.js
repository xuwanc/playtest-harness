(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const ma=["sword-shield","dual-swords","greatsword","staff","bow"],Mg=["wander","follow","keep-distance","attack","idle"],Ep=["spar","wander","follow","keep-distance","attack","idle"],Tp={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},Yr=1e-6;function Do(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Yr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>Yr?Math.atan2(t.moveX,t.moveZ):n.character.facing}function _g(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Yr){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>Yr)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const je=1e-6,ha=Math.PI/180,Xh=-1e9;function Ap(){return{type:"none",lastAt:Xh,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function So(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Jd(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function Vh(n,t,e){var c,h;const i=e.duration>0?e.duration:hc(n,e.type);if(t.kind==="player"){const f=n.playerHurt;if(Jd(f,e.type,i,e.dirX,e.dirZ),f.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>je){const d=e.knockback*n.config.hits.knockbackDecay;f.knockX=e.dirX*d,f.knockZ=e.dirZ*d}So(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(Jd(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>je){const f=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*f,a.hurt.knockZ=e.dirZ*f}n.hitCount+=1,So(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((c=n.config.hits.hitstopByWeapon)==null?void 0:c[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const f=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[f])}o*=Math.max(0,e.holdMul??1);const l=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;l>0&&n.combat.hitstop<l&&(n.combat.hitstop=l,n.combat.warpPhase=1,n.combat.warp=(h=n.config.hits.hitstopWarp)!=null&&h.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,So(n,"hitstop",l,a.position))}function Xo(n,t,e){Vh(n,{kind:"dummy",index:t},e)}function bg(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function hc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function $r(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function Rp(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function Pp(n){var y,g;const t=n.combat,e=n.character.position,i={active:!1,x:e.x,z:e.z,facing:t.attackFacing,fx:Math.sin(t.attackFacing),fz:Math.cos(t.attackFacing),reach:0,cosArc:1,sweepActive:!1,sweepLo:0,sweepHi:0,slamRadius:0,slamX:e.x,slamZ:e.z};if(t.phase!=="active"||t.weapon==="bow")return i;const a=n.config.hits,s=n.config.combat.weapons[t.weapon],o=s==null?void 0:s.hitWindow,r=o?Math.min(1,Math.max(0,o.start)):0,l=o?Math.min(1,Math.max(r,o.end)):1,c=t.timings.active,h=c>je?Math.min(1,Math.max(0,t.phaseTimer/c)):1;if(h<r-je||h>l+je)return i;i.active=!0,i.reach=a.reach[t.weapon]??0,i.cosArc=Math.cos(Math.min(90,Math.max(0,a.arcDeg))*ha);const f=s==null?void 0:s.hitSweep,d=((y=f==null?void 0:f.byCombo)==null?void 0:y[String(t.comboIndex)])??((g=f==null?void 0:f.byCombo)==null?void 0:g["1"]),u=(f==null?void 0:f.tolDeg)??10;if(d){if(typeof d.stabU=="number"){if(h<d.stabU)return i.active=!1,i}else if(d.pts&&d.pts.length>=2){const p=$r(d.pts,0),M=$r(d.pts,h);i.sweepActive=!0,i.sweepLo=Math.min(p,M)-u,i.sweepHi=Math.max(p,M)+u}}const m=s==null?void 0:s.groundSlam;return m&&h>=m.slamU-je&&t.slamAttackId===t.attackId&&(i.slamRadius=Math.max(0,m.radius),i.slamX=e.x+i.fx*Math.min(i.slamRadius*.25,.5),i.slamZ=e.z+i.fz*Math.min(i.slamRadius*.25,.5)),i}function Sg(n,t,e,i){if(!n.active)return!1;const a=t-n.x,s=e-n.z,o=Math.sqrt(a*a+s*s);if(o>n.reach+i||o>je&&(a*n.fx+s*n.fz)/o<n.cosArc)return!1;if(n.sweepActive){const r=Rp(Math.atan2(a,s)/ha-n.facing/ha);if(r<n.sweepLo||r>n.sweepHi)return!1}return!0}function wg(n,t,e,i){if(n.slamRadius<=0)return!1;const a=t-n.slamX,s=e-n.slamZ;return a*a+s*s<=(n.slamRadius+i)*(n.slamRadius+i)}function Eg(n){var S,E;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,l=t.timings.active,c=l>je?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(c<o-je||c>r+je)return;const h=e.reach[t.weapon]??0,f=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*ha),d=Math.sin(t.attackFacing),u=Math.cos(t.attackFacing),m=n.config.dummies.radius,y=n.config.targeting.idealRange,g=a==null?void 0:a.hitSweep,p=((S=g==null?void 0:g.byCombo)==null?void 0:S[String(t.comboIndex)])??((E=g==null?void 0:g.byCombo)==null?void 0:E["1"]),M=(g==null?void 0:g.tolDeg)??10;let x=0,v=0,w=!1;if(p){if(typeof p.stabU=="number"){if(c<p.stabU)return}else if(p.pts&&p.pts.length>=2){const T=$r(p.pts,0),b=$r(p.pts,c);x=Math.min(T,b)-M,v=Math.max(T,b)+M,w=!0}}for(const T of n.dummies){if(t.hitIds.indexOf(T.id)>=0)continue;const b=T.position.x-i.x,_=T.position.z-i.z,A=Math.hypot(b,_);if(A>h+m)continue;const k=A>je?b/A:d,L=A>je?_/A:u;if(A>je&&(b*d+_*u)/A<f)continue;if(w){const B=Rp(Math.atan2(b,_)/ha-t.attackFacing/ha);if(B<x||B>v)continue}let U="light";t.weapon==="greatsword"?U="knock":t.comboIndex>=3&&(U="heavy");const D=e.knockback[t.weapon]??0;let P=A;D>0&&(P=Math.max(A+D,y));const O=Math.max(0,P-A);Xo(n,n.dummies.indexOf(T),{type:U,duration:hc(n,U),dirX:k,dirZ:L,knockback:O}),t.hitIds.push(T.id)}}function Tg(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>je?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-je)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,l=Math.sin(t.attackFacing),c=Math.cos(t.attackFacing),h=n.config.dummies.radius,f=Math.max(0,i.radius),d=i.onlyUnhit!==!1,u=i.type??(t.weapon==="greatsword"?"knock":"heavy"),m=i.knockback??o.knockback[t.weapon]??0,y=n.config.targeting.idealRange,g=i.holdMul??1.6;for(let p=0;p<n.dummies.length;p++){const M=n.dummies[p];if(d&&t.hitIds.indexOf(M.id)>=0)continue;const x=M.position.x-r.x,v=M.position.z-r.z,w=Math.hypot(x,v);if(w>f+h)continue;const S=w>je?x/w:l,E=w>je?v/w:c,T=m>0?Math.max(w+m,y):w,b=Math.max(0,T-w);Xo(n,p,{type:u,duration:hc(n,u),dirX:S,dirZ:E,knockback:b,holdMul:g}),t.hitIds.push(M.id)}So(n,"ground-slam",f,{x:r.x+l*Math.min(f*.25,.5),y:r.y,z:r.z+c*Math.min(f*.25,.5)})}function Ag(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,f=c-r,d=h-l,u=f*f+d*d,m=Math.sin(i.facing),y=Math.cos(i.facing),g=Math.cos(Qd(s.arcDeg,0,180)*ha),p=n.config.dummies.radius;for(let M=0;M<n.dummies.length;M++){const x=n.dummies[M];if(i.hitIds.indexOf(x.id)>=0)continue;const v=u>je?Qd(((x.position.x-r)*f+(x.position.z-l)*d)/u,0,1):0,w=r+f*v,S=l+d*v,E=Math.hypot(x.position.x-w,x.position.z-S);let T=!1;if(s.shape==="circle")T=E<=s.radius+p;else if(s.shape==="capsule")T=E<=Math.max(s.radius,s.width)+p;else{const U=x.position.x-c,D=x.position.z-h,P=Math.hypot(U,D),O=P>je?(U*m+D*y)/P>=g:!0;T=P<=s.radius+p&&O||E<=s.width+p}if(!T)continue;const b=x.position.x-r,_=x.position.z-l,A=Math.hypot(b,_);if(A>je&&(b*m+_*y)/A<Math.cos(Math.max(s.arcDeg,90)*ha))continue;const k=A>je?b/A:m,L=A>je?_/A:y;Vh(n,{kind:"dummy",index:M},{type:s.type,duration:s.duration,dirX:k,dirZ:L,knockback:s.knockback}),i.hitIds.push(x.id),So(n,"link-hit",x.id,x.position)}}function Rg(n){const t=n.config.hits,e=n.config.dummies.fighters,i=n.character.position;for(const a of n.events){if(a.type!=="dummy-hit")continue;const s=n.dummies[a.value-1];if(!s)continue;const o=s.weapon?t.reach[s.weapon]??t.dummyReach:t.dummyReach,r=i.x-s.position.x,l=i.z-s.position.z,c=Math.hypot(r,l);if(c>o)continue;const h=c>je?r/c:0,f=c>je?l/c:1,u=(s.weapon?Math.max(t.knockback[s.weapon]??0,t.dummyKnockback):t.dummyKnockback)*(s.weapon?(e==null?void 0:e.knockbackScale)??1:1),y=s.weapon==="greatsword"&&s.attackComboLeft<=0?"knock":"light";Vh(n,{kind:"player"},{type:y,duration:hc(n,y),dirX:h,dirZ:f,knockback:u,sourceId:s.id})}}function Pg(n,t){n.modules.hits&&(n.combat.phase==="active"&&(Eg(n),Tg(n)),Ag(n,t),Rg(n))}function Qd(n,t,e){return n<t?t:n>e?e:n}const Cp=Math.PI/180,Wh=1e-6;function Cg(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Zr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function Lp(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Wh?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Dp(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Wh)&&s<=Math.max(0,e.inputDeadZone)&&!o}function Lg(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Dg(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Dp(n,t,e))return!1;const i=Lp(n,t,e.lookRange);if(i===null)return!1;const a=Ve(i-n.character.bodyYaw);return Math.abs(a)>kp(n,e)}function kp(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Cp}function kg(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!Dp(n,e,a)){Zr(n);return}const s=Lp(n,e,a.lookRange);if(s===null){Zr(n);return}const o=n.character,r=Ve(s-o.bodyYaw),l=Math.abs(r),c=kp(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Wh;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(l,Math.max(0,a.settleDeg)*Cp);i.targetYaw=Ve(o.bodyYaw+i.dir*(l-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=Ve(i.targetYaw-i.fromYaw);o.bodyYaw=Ve(i.fromYaw+d*Lg(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const da=1e-6;function Ve(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Jo(n,t,e,i){const a=Ve(t-n);return n+a*(1-Math.exp(-Math.max(e,da)*i))}function Qo(n,t,e,i,a){const o=Ve(t-n)*(1-Math.exp(-Math.max(e,da)*a)),r=Math.max(i,0)*a;return r<=da?n:n+Ss(o,-r,r)}function tu(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,da)*a)),o=Math.max(i,0)*a;return o<=da?n+s:n+Ss(s,-o,o)}function Ss(n,t,e){return n<t?t:n>e?e:n}function eu(n,t,e,i){const a=Ve(t-n),s=Math.abs(a);return s<=i||s<=e?t:Ve(n+Math.sign(a)*Math.max(e,0))}function Ig(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>da,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=Do(n,e);else if(c)i.facing=Qo(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(f)i.facing=Do(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,da)){const _=Math.atan2(e.moveX,e.moveZ),A=a.facingTurnRate*Math.PI/180*t,k=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=eu(i.facing,_,A,k);else if(h>=a.facingMinMagnitude&&Math.abs(Ve(_-i.facing))>a.facingDeadbandDeg*Math.PI/180){const U=Jo(i.facing,_,a.facingSmoothRate,t);i.facing=eu(i.facing,U,A,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const m=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Dg(n,e)||(c?i.bodyYaw=Qo(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Jo(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:f?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const _=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Ve(p-i.bodyYaw))>_&&(p=i.moveYaw)}const M=o||f||g,x=a.maxHeadTurnDeg*Math.PI/180;let v;if(M){const _=c?n.config.gaze.headTurnRate:a.headTurnRate;v=c?Qo(i.headYaw,p,_,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Jo(i.headYaw,p,_,t)}else{const _=Ve(i.headYaw-i.bodyYaw),A=Ve(p-i.bodyYaw),k=Math.abs(A)<Math.abs(_)-1e-9,L=k?n.config.gaze.headReturnRate:a.headTurnRate,U=k?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,D=Number.isFinite(U)?Qo(_,A,L,U,t):Jo(_,A,L,t);v=i.bodyYaw+D}const w=Ve(v-i.bodyYaw);w>x?v=i.bodyYaw+x:w<-x&&(v=i.bodyYaw-x),i.headYaw=v;const S=n.config.gaze;let E=0;if(c)E=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const _=n.dummies[n.targeting.targetId-1];if(_){const A=i.position.y+n.config.characterHeight*Ss(S.eyeHeightRatio,0,1),k=_.position.y+n.config.dummies.height*Ss(S.aimHeightRatio,0,1),L=Math.hypot(_.position.x-i.position.x,_.position.z-i.position.z);E=Math.atan2(k-A,Math.max(da,L))}}const T=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;E=Ss(E,-T,T);const b=M?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=tu(i.headPitch,E,b,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=tu(i.bodyPitch,i.headPitch*Ss(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const Ip=1e-6,dc=Math.PI/180;function uc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function zg(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*dc,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);f<.001||f>s||Math.abs(Ve(Math.atan2(c,h)-t))>a||o.push({i:r,d:f})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function Fg(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Ug(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*dc,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=zg(n,e.channelYaw,t);for(let c=0;c<a;c++){const h=(c-(a-1)*.5)*s,f=e.channelYaw+h,d=(c-(a-1)*.5)*o,u=Math.sin(f),m=Math.cos(f);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+u*.5+Math.cos(f)*d,y:i.y+1,z:i.z+m*.5-Math.sin(f)*d,yaw:f,speed:t.speed*(1+(Fg(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}uc(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Ng(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*dc,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,uc(n,"projectile-fire",i.volleyId,o)}i.pending=a}function nu(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,uc(n,"channel-end",0,n.character.position))}function Og(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){nu(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),uc(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=Do(n,e),o.fireTimer-=t;let f=0;for(;o.fireTimer<=0&&f++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Ip),Ug(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){nu(n,i);break}}function Bg(n,t,e){const i=Math.max(0,e.homingConeDeg)*dc,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Ip;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,f=c.position.z-t.z,d=Math.hypot(h,f);d<.001||d>r||Math.abs(Ve(Math.atan2(h,f)-s))>i||(o=l,r=d)}return o}function Hg(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=Bg(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),f=Math.atan2(r.dirX,r.dirZ),d=Ve(h-f),u=r.turnRate*t,m=Math.max(-u,Math.min(u,d)),y=f+m;r.dirX=Math.sin(y),r.dirZ=Math.cos(y)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(!(f*f+d*d>u*u)){Xo(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const Gg={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;Og(n,t,e,s,a,i.cfg.slot),Ng(n,t,s),Hg(n,t,s)}},Nc=1e-6;function zp(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Xg(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),zp(n,"ring-place",i.id,e)}function Vg(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Nc),s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(f*f+d*d>u*u)continue;const m=Math.hypot(f,d),y=m>Nc?f/m:0,g=m>Nc?d/m:1;Xo(n,c,{type:"heavy",duration:e.stun,dirX:y,dirZ:g,knockback:e.knockback})}zp(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const Wg={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&Xg(n,s),Vg(n,t,s)}},Yg={channelVolley:Gg,groundRing:Wg};function $g(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function Zg(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=Yg[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function qg(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Fp(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function jg(n,t,e){Zg(n,t,e)}function Un(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const iu=1e-6;function au(n,t,e){return n<t?t:n>e?e:n}function Up(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Np(n){const t=n.camera,e=Up();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Kg(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,f=c.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=au((e.radius-d)/Math.max(iu,e.radius-e.nearDistance),0,1);let m=u*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(m+=e.attackBoost*u),a+=m,s+=c.position.x*m,o+=c.position.z*m,r+=1}const l=a<=0?0:au(a/(a+Math.max(iu,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,h=o/a;t.centroidX=c,t.centroidZ=h;let f=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function Jg(n){const t=[],e=n.ground.size;t.push(es("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(es(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(es(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(es(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(es(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(es(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function es(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const Op={cellSize:.5,originX:0,originZ:14,stepX:-4.5,stepZ:-4.5,columns:4,gap:.3,spawnDz:0,labelDz:-2.8,defaultRadius:2,defaultShape:"circle",defaultColor:"#7fd8c0",bounds:{minX:-13,maxX:13,minZ:-13,maxZ:14}};function ni(n){return Math.round(n*1e6)/1e6}function Qg(n,t,e){return Math.hypot(n.x-t.x,n.z-t.z)<n.r+t.r+e}const tx=400;function ex(n,t=Op){const e={duplicates:[],relocated:[],unplaced:[]},i=new Set,a=[];for(const u of n)if(!(!u||typeof u.id!="string"||u.id.length===0)){if(i.has(u.id)){e.duplicates.push(u.id);continue}i.add(u.id),a.push(u)}const s=[...a].sort((u,m)=>u.id<m.id?-1:u.id>m.id?1:0),o=[],r=[];for(const u of s){if(!u.anchor)continue;const m=ni(u.anchor.x),y=ni(u.anchor.z);r.push({def:u,centerX:m,centerZ:y}),o.push({x:m,z:y,r:u.radius??t.defaultRadius})}let l=0;for(const u of s)typeof u.index=="number"&&(l=Math.max(l,u.index));const c=[];let h=0;const f=(u,m,y,g,p,M)=>{const x=u.radius??t.defaultRadius,v=u.shape??t.defaultShape,w=u.color??t.defaultColor,S=u.spawn??{dx:0,dz:t.spawnDz},E=u.label??{dx:0,dz:t.labelDz},T={id:u.id,index:M,name:u.name,hint:u.hint,shape:v,x:ni(m),z:ni(y),radius:x,spawnX:ni(m+S.dx),spawnZ:ni(y+S.dz),labelX:ni(m+E.dx),labelZ:ni(y+E.dz),color:w},b=[];if(u.grass){const A=u.grass,k=A.absolute?0:Math.round(m/t.cellSize),L=A.absolute?0:Math.round(y/t.cellSize),U={minCellX:A.minCellX+k,maxCellX:A.maxCellX+k,minCellZ:A.minCellZ+L,maxCellZ:A.maxCellZ+L};A.density!==void 0&&(U.density=A.density),A.clearMarginCells!==void 0&&(U.clearMarginCells=A.clearMarginCells),b.push(U)}const _=[];if(u.destructibles)for(const A of u.destructibles)_.push({id:A.id,kind:A.kind,x:ni(m+A.dx),y:A.y??0,z:ni(y+A.dz),height:A.height,radius:A.radius,tiltDeg:A.tiltDeg,pitchGain:A.pitchGain,maxTiltDeg:A.maxTiltDeg,fallSec:A.fallSec,bands:A.bands?[...A.bands]:void 0,color:A.color,cutColor:A.cutColor});return{id:u.id,index:M,name:u.name,hint:u.hint,owner:u.owner??"",centerX:T.x,centerZ:T.z,placement:g,slot:p,shape:v,radius:x,color:w,station:T,grassPlots:b,destructibles:_,testSpawn:u.testSpawn}};for(const u of r)c.push(f(u.def,u.centerX,u.centerZ,"pinned",-1,u.def.index??++l));for(const u of s){if(u.anchor)continue;const m=u.radius??t.defaultRadius;let y=-1,g=0,p=0,M=0;for(let x=h;x<tx;x++){const v=x%t.columns,w=Math.floor(x/t.columns),S=ni(t.originX+v*t.stepX),E=ni(t.originZ+w*t.stepZ),T=t.bounds;if(T&&(S<T.minX||S>T.maxX||E<T.minZ||E>T.maxZ)){M++;continue}const b={x:S,z:E,r:m};if(o.some(_=>Qg(b,_,t.gap))){M++;continue}y=x,g=S,p=E;break}if(y<0){e.unplaced.push(u.id);continue}M>0&&e.relocated.push(u.id),o.push({x:g,z:p,r:m}),h=y+1,c.push(f(u,g,p,"auto",y,u.index??++l))}c.sort((u,m)=>u.index-m.index);const d=[...c].sort((u,m)=>u.id<m.id?-1:u.id>m.id?1:0);return{plots:c,stations:c.map(u=>u.station),grassPlots:c.flatMap(u=>u.grassPlots),destructibles:d.flatMap(u=>u.destructibles),diagnostics:e}}const Wi=1e-6;function qr(n,t,e){return n<t?t:n>e?e:n}function ko(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+Wi||c.maxY<i-o-Wi||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function Bp(n,t,e,i,a=0,s=.05){let o=Number.NEGATIVE_INFINITY;for(const r of n)r.maxY>i+s||t<r.minX||t>r.maxX||e<r.minZ||e>r.maxZ||r.maxY>o&&(o=r.maxY);return o===Number.NEGATIVE_INFINITY?a:o}function Yh(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+Wi||l.minY>=o-Wi)continue;const c=qr(t.x,l.minX,l.maxX),h=qr(t.z,l.minZ,l.maxZ),f=t.x-c,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(s=!0,u>Wi*Wi){const m=Math.sqrt(u),y=(e-m)/m;t.x+=f*y,t.z+=d*y}else{const m=t.x-l.minX,y=l.maxX-t.x,g=t.z-l.minZ,p=l.maxZ-t.z,M=Math.min(m,y,g,p);M===m?t.x=l.minX-e:M===y?t.x=l.maxX+e:M===g?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function $h(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Wi||o.minY>=s-Wi)continue;const r=qr(t.x,o.minX,o.maxX),l=qr(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-Wi)return!0}return!1}const ra=1e-6,Is=Math.PI/180;function Zh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Il(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Hp(n){n.arrows.length=0}function nx(n,t,e,i,a,s,o,r,l,c,h){const f=i-n,d=s-e,u=f*f+d*d;let m=0;u>ra&&(m=((o-n)*f+(r-e)*d)/u,m=Math.max(0,Math.min(1,m)));const y=n+f*m,g=e+d*m,p=y-o,M=g-r;if(p*p+M*M>h*h)return-1;const x=t+(a-t)*m;return x<l-.1||x>l+c?-1:m}function ix(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=ra)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*Is,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+ra;for(const h of n.dummies){if(!n.modules.dummies)break;const f=h.position.x-a.x,d=h.position.z-a.z,u=Math.hypot(f,d);if(!(u<.001||u>i)){if(h.id===r)return h.id;Math.abs(Zh(Math.atan2(f,d)-t))>s||u<c&&(l=h.id,c=u)}}return l}function ax(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*Is;return t+As(Zh(s-t),-o,o)}function sx(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*Is),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*Is),a<=0)return r;const l=n.dummies.find(y=>y.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(ra,s),f=l.position.y+n.config.dummies.height*As(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),u=(f-e+.5*d*h*h)/h,m=As(u,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function ox(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=ix(n,e),l=ax(n,e,r),c=Math.sin(l),h=Math.cos(l),f=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,u=o.y+.95,m=sx(n,f,u,d,r,s),y={id:++n.arrowSeq,x:f,y:u,z:d,vx:c*m.horizontal,vy:m.vy,vz:h*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*Is};return n.arrows.push(y),Il(n,"arrow-shot",a,y),y}function As(n,t,e){return n<t?t:n>e?e:n}function rx(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const v=n.dummies[c.stuckDummy];if(v){const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw);c.x=v.position.x+c.offX*w+c.offZ*S,c.y=v.position.y+c.offY,c.z=v.position.z-c.offX*S+c.offZ*w,c.yaw=v.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,f=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const v=n.dummies.find(w=>w.id===c.targetId);if(!v)c.targetId=0;else{const w=Math.hypot(c.vx,c.vz);if(w>ra){const S=Math.atan2(v.position.x-c.x,v.position.z-c.z),E=Math.atan2(c.vx,c.vz),T=c.turnRate*t,b=E+As(Zh(S-E),-T,T);c.vx=Math.sin(b)*w,c.vz=Math.cos(b)*w;const _=Math.hypot(v.position.x-c.x,v.position.z-c.z);if(_>.3){const A=_/w,L=(v.position.y+s*As(i.aimHeightRatio,0,1)-c.y+.5*r*A*A)/A,U=Math.max(0,i.verticalTurnRate)*t;c.vy+=As(L-c.vy,-U,U)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const u=h+c.vx*t,m=f+c.vy*t,y=d+c.vz*t;let g=-1,p=2;if(o)for(let v=0;v<n.dummies.length;v++){const w=n.dummies[v],S=nx(h,f,d,u,m,y,w.position.x,w.position.z,w.position.y,s,a+i.radius);S>=0&&S<p&&(p=S,g=v)}if(g>=0){const v=n.dummies[g];c.x=h+(u-h)*p,c.y=f+(m-f)*p,c.z=d+(y-d)*p,c.stuck=!0,c.stuckDummy=g;const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw),E=c.x-v.position.x,T=c.z-v.position.z;c.offX=E*w-T*S,c.offZ=E*S+T*w,c.offY=c.y-v.position.y;const b=Math.atan2(c.vx,c.vz);c.localYaw=b-v.bodyYaw,c.yaw=b,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const _=Math.hypot(c.vx,c.vz);Xo(n,g,{type:"light",duration:.22,dirX:_>ra?c.vx/_:0,dirZ:_>ra?c.vz/_:1,knockback:.14}),Il(n,"arrow-land",v.id,c),l.push(c);continue}const M=ko(n.boxes,u,y,m+.4,.04,0,6),x=Number.isFinite(M)?M:0;if(m<=x+.02&&c.vy<0){c.x=u,c.y=x+Math.max(0,i.groundStickLift),c.z=y,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const v=Math.atan2(-c.vy,Math.max(ra,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(v,Math.max(0,i.stickMinPitchDeg)*Is),c.rest=Math.max(.2,i.stickSec),Il(n,"arrow-land",-1,c),l.push(c);continue}c.x=u,c.y=m,c.z=y,l.push(c)}n.arrows=l}const zl=1e-6,cx=Math.PI/180;function Fl(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function qh(n,t,e){return n<t?t:n>e?e:n}function fc(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Ul(n){const t=n.id,e=n.windowId;Object.assign(n,fc()),n.id=t,n.windowId=e}function lx(n){Ul(n)}function Gp(n){Ul(n.playerLink);for(const t of n.dummies)Ul(t.link)}function hx(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Nl(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function jr(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,fc()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function dx(n,t){const e=n.config.links.search,i=n.character.position,a=qh(e.maxAngleDeg,0,180)*cx;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);if(f<zl||f>e.range)continue;const d=Math.atan2(c,h);Math.abs(Ve(d-t))>a||f<r&&(r=f,s=l.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function ux(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=Do(n,t),l=dx(n,r),c=l.id>0?l.yaw:r,h=l.id>0?qh(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Fl(n,"link-start",s.id)}function fx(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){jr(n);return}if(e.weapon!==n.combat.weapon){jr(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Fl(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Fl(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?qh(r/o,0,1):1,e.phase==="active"&&i.active>zl){const l=Math.max(0,e.travel-e.travelled),c=Math.max(zl,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function px(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&jr(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&Nl(n,"sprint"),a.prevSprinting=r,fx(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&ux(n,e,l,o.weapon)}const Fr={windup:0,active:1,recovery:2},su=1e-9;function Xp(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function mx(n){return n==="windup"||n==="active"||n==="recovery"}function gx(n,t){return Fr[n]+Xp(t)}function xx(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!mx(s.at))continue;const o=Xp(s.u??0),r=Fr[s.at]+o;r>i+su&&r<=e+su&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>Fr[s.at]+s.u-(Fr[o.at]+o.u)),a}const Io=1e-6;function ca(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function vx(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function Vp(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function pc(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=Vp()}function Wp(n){return{weapon:ma[Math.max(0,n-1)]??ma[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:Vp()}}function yx(n,t){return Do(n,t)}function Mx(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function Yp(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=yx(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,ca(n,"attack-start",i)}function $p(n){return Math.max(0,n.config.combat.settle)}function Ol(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Yp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:$p(n),lunge:Mx(n,i.lunge[e-1]??0)},e)}function ou(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Yp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:$p(n),lunge:i.lunge},0),ox(n,e,n.combat.attackFacing),ca(n,"charge-release",e)}function _x(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),l=a+(1-a)*r;if(e.warp=l,e.warpDebt+=t*(1-l),o>=1){e.warpPhase=3,e.warpTimer=0;const c=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,c)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function bx(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=_x(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const h=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<h)break;if(i.phaseTimer-=h,i.phase==="windup")i.phase="active",ca(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,ca(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const f=n.config.combat.weapons[i.weapon];f.comboCount>0&&Ol(n,e,i.comboIndex<f.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const h=i.timings.recovery;if(h>Io&&i.phaseTimer>=h*n.config.combat.cancelWindow){i.queued=!1;const f=n.config.combat.weapons[i.weapon];f.comboCount>0&&Ol(n,e,i.comboIndex<f.comboCount?i.comboIndex+1:1)}}const l=a.windup+a.active+a.recovery;let c=0;i.phase==="windup"?c=i.phaseTimer:i.phase==="active"?c=a.windup+i.phaseTimer:i.phase==="recovery"?c=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(c=l),i.phase!=="idle"&&(i.attackProgress=l>0?Math.min(1,c/l):1),Sx(n)}function Sx(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>Io?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:gx(t.phase,a);if(s<=t.notifyCursor+Io)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of xx(o,t.notifyCursor,s))vx(n,r.name,r.value);t.notifyCursor=s}function wx(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=ma.length){const l=ma[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,pc(n),jr(n),ca(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,ca(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),bx(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Ol(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,ca(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,Io)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,ou(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?ou(n,e,l):ca(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>Io)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),f=g=>c*(1-Math.pow(1-Math.min(1,Math.max(0,g/l)),h+1)),d=t*i.warp,u=Math.min(l,Math.max(0,i.phaseTimer)),m=Math.min(l,Math.max(0,i.phaseTimer-d));let y=Math.max(0,f(u)-f(m))/Math.max(d,1e-4);y=Math.min(y,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*y,n.impulse.z=Math.cos(i.attackFacing)*y}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const dn=1e-6,Bl=Math.PI*2,Ex=7,Tx=18,Zp=1.3,qp=.4,Ax=.9,ru=.9;function cu(n,t,e,i){const a=Math.max(e,.1),s=((n+t*2.37)%a+a)%a,o=Math.min(Math.max(i,0),1)*a;if(o<=dn||s>=o)return 0;const r=Math.min(Math.max(a*.12,.15),o*.5),l=Math.min(1,Math.min(s/r,(o-s)/r));return l*l*(3-2*l)}function Rx(n,t){const e=Math.hypot(n,t);return e<=1?{x:n,z:t}:{x:n/e,z:t/e}}function Px(n){return Math.atan2(Math.sin(n),Math.cos(n))}function lu(n,t,e,i){return n+Px(t-n)*(1-Math.exp(-Math.max(e,dn)*i))}function Kr(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Cx(n){var i;const t=[];for(let a=0;a<n.count;a++){const s=n.spawn[a]??{x:0,z:0},o=n.initialModes[a]??"idle";t.push(Hl(a+1,o,s.x,s.z,null))}const e=n.fighters;if(e)for(let a=0;a<e.weapons.length;a++){const s=e.spawn[a]??{x:0,z:0},o=((i=e.initialModes)==null?void 0:i[a])??"spar",r=e.attackInterval*(.25+.22*a);t.push(Hl(t.length+1,o,s.x,s.z,e.weapons[a],r))}return t}function Hl(n,t,e,i,a,s=0){return{id:n,mode:t,initialMode:t,homeX:e,homeZ:i,position:{x:e,y:0,z:i},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:e,targetZ:i,wanderTimer:0,attackCooldown:s,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,attackComboIndex:0,attackComboLeft:0,comboGap:0,hurt:Ap(),link:fc(),weapon:a,combat:a?{...Wp(ma.indexOf(a)+1),weapon:a}:null}}function Lx(n,t=!1){const e=t?Ep:Mg,i=e.indexOf(n);return e[(i+1)%e.length]}function jp(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0,i.attackComboIndex=0,i.attackComboLeft=0,i.comboGap=0;const o=i.hurt;if(o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,lx(i.link),i.combat){const r=i.combat;r.phase="idle",r.comboIndex=0,r.phaseTimer=0,r.attackProgress=0,r.attackFacing=0,r.charging=!1,r.charge=0,r.hitstop=0,r.warp=1,r.warpPhase=0,r.warpDebt=0,r.warpTimer=0,r.hitIds.length=0,r.timings={windup:0,active:0,recovery:0,settle:0,lunge:0}}}n.dummyAttackCount=0}function Dx(n,t,e){const i=Un(n)*Bl,a=Math.sqrt(Un(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+Un(n)*.8)}function jh(n,t,e){if(t.weapon){const i=n.config.combat.weapons[t.weapon];if(i)return{windup:i.windup,active:i.active,recovery:i.recovery}}return{windup:e.attackWindup,active:e.attackActive,recovery:e.attackRecovery}}function Gl(n,t,e){var s;if(!t.weapon)return e.attackRange;const i=n.config.hits.reach[t.weapon]??e.attackRange,a=((s=e.fighters)==null?void 0:s.attackRangeScale)??.9;return Math.max(.4,i*a)}function Xl(n,t){return n.weapon&&t.fighters?t.fighters.attackInterval:t.attackInterval}function kx(n,t){return n.weapon&&t.fighters?Math.max(t.leashRadius,t.fighters.leashRadius):t.leashRadius}function Ix(n,t,e){const i=jh(e,n,t);return n.attackPhase==="windup"?i.windup:n.attackPhase==="active"?i.active:n.attackPhase==="recovery"?i.recovery:0}function zx(n,t,e){var s;if(!t.weapon)return 1;const i=((s=e.fighters)==null?void 0:s.comboCount)??0;if(i>0)return Math.max(1,Math.round(i));const a=n.config.combat.weapons[t.weapon];return Math.max(1,Math.round((a==null?void 0:a.comboCount)??1))}function Fx(n,t){var i;const e=((i=t.fighters)==null?void 0:i.comboGap)??0;return e>0?e:Math.max(0,n.config.combat.settle)}function Ux(n){return n.attackPhase!=="idle"||n.attackComboLeft>0}function Nx(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0,hu(n,t,i);return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const l=Math.max(Ix(t,i,n),dn);if(t.attackPhaseTimer<l)break;t.attackPhaseTimer-=l,t.attackPhase==="windup"?(t.attackPhase="active",Kr(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0,t.attackComboLeft>0?t.comboGap=Fx(n,i):(t.attackComboIndex=0,t.weapon&&t.attackCooldown<=0&&(t.attackCooldown=Xl(t,i)*qp)))}const s=jh(n,t,i),o=s.windup+s.active+s.recovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=s.windup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=s.windup+s.active+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||o<=0?0:Math.min(1,r/o),hu(n,t,i)}function hu(n,t,e){const i=t.combat;if(!i)return;const a=jh(n,t,e),s=t.attackPhase==="idle"&&t.attackComboLeft>0&&t.comboGap>0;i.weapon=t.weapon??i.weapon,i.phase=s?"settle":t.attackPhase,i.comboIndex=t.attackComboIndex,i.phaseTimer=t.attackPhaseTimer,i.attackProgress=s?1:t.attackProgress,i.attackFacing=t.facing,i.timings={windup:a.windup,active:a.active,recovery:a.recovery,settle:0,lunge:0},i.hitstop=0,i.warp=1,i.warpPhase=0,i.charging=!1,i.charge=0}function Ox(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>dn?a/o:0,l=o>dn?s/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,m=Math.hypot(d,u);(t.wanderTimer<=0||m<.3)&&Dx(n,t,e);const y=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(y,g);p>dn&&(c=y/p,h=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance,u=Math.max(e.keepDeadZone,.2),m=Math.max(-1,Math.min(1,d/u))*ru,y=cu(n.time,t.id,e.strafePeriod,e.strafeDuty)*e.keepStrafe;c=r*m-l*y,h=l*m+r*y}else if(t.mode==="attack")o>Gl(n,t,e)&&t.attackPhase==="idle"&&(c=r,h=l);else if(t.mode==="spar"){const d=Gl(n,t,e),u=d*1.7;if(Ux(t))o>d*Zp?(c=r,h=l):o<d*.55&&(c=-r*.6,h=-l*.6);else if(t.attackPhase==="idle"&&t.attackCooldown<=0&&o>d)c=r,h=l;else{const y=Math.max(-1,Math.min(1,(o-u)/.5))*ru,g=cu(n.time,t.id,e.strafePeriod,e.strafeDuty)*Ax;c=r*y-l*g,h=l*y+r*g}}({x:c,z:h}=Rx(c,h));let f=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>dn&&(f=Math.atan2(c,h)):o>dn&&(f=Math.atan2(r,l)),e.leashRadius>dn&&t.mode!=="wander"&&t.mode!=="idle"){const d=kx(t,e),u=t.position.x-t.homeX,m=t.position.z-t.homeZ,y=Math.hypot(u,m);if(y>d){const g=Math.min(1,(y-d)/Math.max(d*.5,.5)),p=-u/y,M=-m/y;c=c*(1-g)+p*g,h=h*(1-g)+M*g;const x=Math.hypot(c,h);x>dn&&(c/=x,h/=x)}}return{x:c,z:h,facing:f}}function Bx(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.comboGap=Math.max(0,e.comboGap-t),e.hurt.timer>0&&(e.attackComboLeft=0,e.comboGap=0),(e.mode==="attack"||e.mode==="spar")&&e.attackPhase==="idle"&&e.hurt.timer<=0){const M=n.character.position,x=Math.hypot(M.x-e.position.x,M.z-e.position.z),v=Gl(n,e,i);if(e.attackComboLeft>0)e.comboGap<=0&&(x<=v*Zp+dn?(e.attackComboIndex+=1,e.attackComboLeft-=1,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,n.dummyAttackCount+=1,Kr(n,"dummy-attack",e)):(e.attackComboLeft=0,e.attackComboIndex=0,e.attackCooldown=Math.max(e.attackCooldown,Xl(e,i)*qp)));else if(e.attackCooldown<=0&&x<=v+dn){const w=zx(n,e,i);e.attackComboIndex=1,e.attackComboLeft=Math.max(0,w-1),e.comboGap=0,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=Xl(e,i),n.dummyAttackCount+=1,Kr(n,"dummy-attack",e)}}Nx(n,e,t,i);const a=Ox(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-dn||a.x<0&&e.position.x<=s.minX+dn)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-dn||a.z<0&&e.position.z<=s.minZ+dn)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,dn)*t),r=e.weapon&&i.fighters?i.fighters.moveSpeed:i.moveSpeed;e.velocity.x+=(a.x*r-e.velocity.x)*o,e.velocity.z+=(a.z*r-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=lu(e.bodyYaw,e.facing,Ex,t),e.headYaw=lu(e.headYaw,e.facing,Tx,t);const l=e.position.x,c=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const h=n.config.stepHeight;if(Yh(n.boxes,e.position,i.radius,i.height,h))if($h(n.boxes,e.position,i.radius,i.height,h))e.position.x=l,e.position.z=c,e.velocity.x=0,e.velocity.z=0;else{const M=e.position.x-l,x=e.position.z-c;Math.abs(M)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const d=n.config.worldBounds;e.position.x<d.minX?(e.position.x=d.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>d.maxX&&(e.position.x=d.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<d.minZ?(e.position.z=d.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>d.maxZ&&(e.position.z=d.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const u=ko(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,h,Number.POSITIVE_INFINITY);u>Number.NEGATIVE_INFINITY&&u<=e.position.y+h+dn&&(e.position.y=u);const m=Math.hypot(e.position.x-l,e.position.z-c);e.distance+=m;const y=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,y/Math.max(n.config.moveSpeed,dn)),p=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),dn);e.stride=p,e.gaitPhase=(e.gaitPhase+m/p*Bl)%Bl}function Hx(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=Lx(a.mode,!!a.weapon),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,a.attackComboIndex=0,a.attackComboLeft=0,a.comboGap=0,a.combat&&(a.combat.phase="idle",a.combat.attackProgress=0,a.combat.comboIndex=0),Kr(n,"dummy-mode",a)}for(const a of n.dummies)Bx(n,t,a,i)}const Gx=["idle","attack","keep-distance"],Xx=["sword-shield","dual-swords","greatsword"];function Vl(n,t){const e=n.dummies.length,i=n.dummies.filter(a=>a.spawnedByPlot?t!==void 0&&a.spawnedByPlot!==t:!0);n.dummies=i;for(let a=0;a<n.dummies.length;a++)n.dummies[a].id=a+1;return e-n.dummies.length}function Vx(n,t){var d,u;const e=t.testSpawn??{},i=Math.max(0,Math.floor(e.dummies??0)),a=Math.max(0,Math.floor(e.fighters??0));Vl(n,t.id);const s=i+a;if(s===0)return 0;const o=Math.max(.4,e.ringRadius??1.6),r=e.startDeg??-90,l=e.modes??Gx,c=e.weapons??((d=n.config.dummies.fighters)==null?void 0:d.weapons)??Xx,h=((u=n.config.dummies.fighters)==null?void 0:u.attackInterval)??3.4,f=[];for(let m=0;m<s;m++){const y=(r+360*m/s)*Math.PI/180,g=t.centerX+Math.cos(y)*o,p=t.centerZ+Math.sin(y)*o,M=m>=i,x=m-i,v=M?"spar":l[m%l.length],w=M?c[x%c.length]:null,S=M?h*(.25+.22*x):0,E=Hl(n.dummies.length+f.length+1,v,g,p,w,S);E.spawnedByPlot=t.id,f.push(E)}return n.dummies.push(...f),f.length}function Wx(n){let t=0;for(const e of n.dummies)e.spawnedByPlot&&t++;return t}const Wl=1e-6;function Oc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Yx(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Kp(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function du(n,t,e){return n<t?t:n>e?e:n}function $x(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=s.x,f=s.z;for(;c<l-Wl;){const d=Math.min(l,c+r),u=s.x+t*d,m=s.z+e*d,y=du(u,o.minX,o.maxX),g=du(m,o.minZ,o.maxZ),p={x:y,y:s.y,z:g};if($h(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=y,f=g,c=d,y!==u||g!==m))break}return{x:h,z:f}}function Zx(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Nl(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&Oc(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&pc(n));const l=_g(n,e),c=l.x,h=l.z,f=n.combat.weapon==="staff";if(i.kind=f?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=f?a.blinkCooldown:a.rollCooldown,f){const d=$x(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Nl(n,"blink"),Oc(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Wl,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,Oc(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(Wl,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const hi=1e-6,uu=Math.PI*2;function fu(n,t){return Math.sqrt(n*n+t*t)}function tr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function qx(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,pc(n)}function jx(n,t,e){const i=n.character,a=n.config,s=ko(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,pc(n),Gp(n),Kp(n),Fp(n),Hp(n),Zr(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Xh,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function Kx(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=fu(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&s.x>=h.maxX-hi||r<0&&s.x<=h.minX+hi)&&(r=0),(l>0&&s.z>=h.maxZ-hi||l<0&&s.z<=h.minZ+hi)&&(l=0);const f=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",u=n.dash.phase==="active",m=f||u||d;a.sprinting=!m&&e.sprintHeld&&c>hi;const y=i.combat.weapons[n.combat.weapon];let g=y?y.moveMultiplier:1;u||d?g=0:f?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const L=m?i.skillDecel:c>hi?i.acceleration:i.friction,U=1-Math.exp(-L*t);o.x+=(r*p-o.x)*U,o.z+=(l*p-o.z)*U}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,tr(n,"jumped",i.jumpSpeed)),n.events.some(L=>L.type==="blink"&&L.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,v=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Yh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if($h(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=v,o.x=0,o.z=0;else{const L=s.x-x,U=s.z-v;Math.abs(L)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(U)<Math.abs(o.z*t)*.5&&(o.z=0)}tr(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=ko(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+hi&&S-s.y<=i.stepHeight+hi&&(s.y=S,o.y=0,tr(n,"stepUp",S));const E=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const T=ko(n.boxes,s.x,s.z,E,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&s.y<=T&&o.y<=0?(s.y=T,o.y=0,a.grounded||tr(n,"landed",T),a.grounded=!0):a.grounded=!1;const b=fu(s.x-x,s.z-v);a.distance+=b;const _=b/Math.max(t,hi),A=Math.min(i.strideSpeedCap,_/Math.max(i.moveSpeed,hi)),k=Math.max(i.strideLength*(1+A*i.strideSpeedGain),hi);a.stride=k,a.gaitPhase=(a.gaitPhase+b/k*uu)%uu}const Yl=1e-6,pu=2.399963229728653;function Fa(n,t,e){return n<t?t:n>e?e:n}function mu(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,h=t.z-n.z,f=Math.hypot(c,h),d=e+i;if(f>=d)return;let u,m,y;f<Yl?(u=r,m=l,y=d):(u=c/f,m=h/f,y=d-f);const g=y+o;n.x-=u*g*a,n.z-=m*g*a,t.x+=u*g*s,t.z+=m*g*s}function Jx(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*pu;mu(e[f].position,e[d].position,s,s,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*pu;mu(i,e[f].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)Yh(n.boxes,h.position,s,n.config.dummies.height,l),h.position.x=Fa(h.position.x,c.minX,c.maxX),h.position.z=Fa(h.position.z,c.minZ,c.maxZ)}function Qx(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=Fa(r.minScale,0,1);if(l<Yl||c<=0||h>=1)return 1;const f=a+o,d=Fa(r.approachDot,0,.99);let u=0;for(const m of s){const y=m.position.x-n,g=m.position.z-t,p=Math.hypot(y,g);if(p>=f+c)continue;if(p<Yl){u=1;continue}const M=(e*y+i*g)/(l*p);if(M<=d)continue;const x=Fa(1-(p-f)/c,0,1),v=Fa((M-d)/(1-d),0,1);u=Math.max(u,x*v)}return 1-(1-h)*Fa(u,0,1)}function tv(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Qx(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Bc=1e-6,ev=Math.PI/180;function nv(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function iv(n,t,e){return n<t?t:n>e?e:n}function av(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>Bc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>Bc&&(o=Math.atan2(e.moveX,e.moveZ));const l=iv(i.maxAngleDeg,0,180)*ev;let c=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const m=u.position.x-s.x,y=u.position.z-s.z,g=Math.hypot(m,y);if(g<Bc||g>i.range)continue;const p=Math.atan2(m,y),M=Math.abs(Ve(p-o));if(M>l)continue;const x=g-i.frontBias*Math.cos(M);x<c&&(c=x,h=u.id,f=p,d=g)}a.targetId=h,a.targetYaw=f,a.targetDist=d,a.hasTarget=h>0}const Si=1e-6;function ws(n,t,e){return n<t?t:n>e?e:n}function gu(n){return Math.atan2(Math.sin(n),Math.cos(n))}function sv(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(L,U)=>{const D=L.position.x-s.x,P=L.position.z-s.z,O=Math.hypot(D,P);if(O<Si||O>U)return 0;const B=ws((U-O)/Math.max(Si,U-i.nearDistance),0,1);let W=B*(i.modeWeight[L.mode]??.5);return L.attackPhase==="active"&&(W+=i.attackBoost*B),W},r=[];let l=0,c=!1,h=!1,f=!1;for(const L of n.dummies){const U=o(L,i.threatRange),D=L.position.x-s.x,P=L.position.z-s.z,O=Math.hypot(D,P);U>0&&(r.push({id:L.id,x:L.position.x,z:L.position.z,dx:D,dz:P,yaw:Math.atan2(D,P),w:U}),l+=U,O<=i.approachDist&&(i.modeWeight[L.mode]??.5)>=i.hostileModeWeight&&(f=!0)),O>Si&&O<=i.recoveryDist&&(c=!0),(L.attackPhase==="windup"||L.attackPhase==="active")&&O<=i.threatRange&&(h=!0)}const d=l<=0?0:ws(l/(l+Math.max(Si,i.saturation)),0,1),u=r.length>0,m=a.active,y=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),g=i.hurtHoldSec>Si&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(c||g);if(a.active=y||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((L,U)=>U.w-L.w);const M=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],v=Math.atan2(x.dx,x.dz),w=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let E=0,T=0,b=0;for(const L of M){const U=Math.abs(gu(L.yaw-v))/Math.PI;let D=L.w/(1+Math.max(i.spreadFalloff,0)*U*U);L!==x&&i.behindFalloff<1&&Math.abs(gu(L.yaw-S))>w&&(D*=Math.max(i.behindFalloff,0)),E+=L.x*D,T+=L.z*D,b+=D}a.mainId=x.id,a.mainYaw=v;const _=n.dummies.find(L=>L.id===x.id),A=(_?_.position.y:0)+n.config.dummies.height*ws(i.aimHeightRatio,0,1),k=s.y+n.config.characterHeight*ws(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(A-k,Math.max(Si,Math.hypot(x.dx,x.dz))),a.centroidYaw=b>Si?Math.atan2(E/b-s.x,T/b-s.z):v,a.threatCount=r.length,a.threat=d}function ov(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function rv(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<Si||a>e.threatRange)return 0;const s=Math.max(Si,e.threatRange-e.nearDistance),o=ws((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(Si,e.modeWeight.attack??1.5);return ws(r/l,0,1)}const Xa=1e-6,zs=Math.PI*2,zo={enabled:!1,dirDeg:0,speed:0,amplitude:0,wavelength:4,secondWave:{wavelength:2,amplitude:0,speedScale:1},gust:{periodSec:8,depth:0},jitter:0,shadeAmount:0};function Jp(n){var t;return((t=n==null?void 0:n.grass)==null?void 0:t.wind)??zo}function mc(n){return{time:0,gust:1-Math.min(1,Math.max(0,n.gust.depth))}}function cv(n,t,e){if(!t.enabled)return;n.time+=Math.max(0,e);const i=Math.max(.1,t.gust.periodSec),a=Math.min(1,Math.max(0,t.gust.depth));n.gust=1-a+a*(.5+.5*Math.sin(zs*n.time/i-Math.PI/2))}function lv(n,t,e,i){const a=n.dirDeg*Math.PI/180,s=t*Math.cos(a)+e*Math.sin(a),o=zs/Math.max(.1,n.wavelength),r=zs/Math.max(.1,n.secondWave.wavelength);return[o*s+i,r*s+i*1.7]}function Qp(n){const t=n.dirDeg*Math.PI/180,e=zs/Math.max(.1,n.wavelength),i=zs/Math.max(.1,n.secondWave.wavelength);return{dirX:Math.cos(t),dirZ:Math.sin(t),omega1:e*n.speed,omega2:i*n.speed*n.secondWave.speedScale,amp1:n.amplitude,amp2:n.secondWave.amplitude,shadeAmount:n.shadeAmount}}const hv=.18,xu=.4,dv=.6;function uv(n,t,e){if(n<0)return 0;if(n===0)return 1;if(t<=0)return 0;const i=Math.min(1,Math.max(0,1-n/t)),a=Math.min(1,Math.max(0,e))*hv,s=Math.min(1,Math.max(0,(i-a)/(1-a)));return s*s*(3-2*s)}function fv(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function tm(n,t){return n+","+t}function pv(n,t,e){return{spec:e??{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:0,bladesPerPatch:[0,0],avoidMargin:0,seed:0},cellSize:t.cellSize>0?t.cellSize:.5,bucketCells:(n==null?void 0:n.bucketCells)??4,blades:[],patches:[],buckets:{},cutCount:0,lastCutAt:0,wind:mc((n==null?void 0:n.wind)??zo)}}function mv(n,t,e,i){const a=t.grass,s=n.grass;if(!a||!s||!s.enabled)return pv(s,i,a);const o=i.cellSize>0?i.cellSize:.5,r=fv(a.seed),l=Math.max(1,Math.floor(s.footprintCells)),c=Math.max(1,s.bucketCells)*o,h=Math.max(o,s.minHeightCells*o),f=Math.max(h,s.maxHeightCells*o),[d,u]=a.bladesPerPatch,m=Math.max(0,Math.floor(d)),y=Math.max(m,Math.floor(u)),g=e.filter(T=>T.kind!=="ground").map(T=>({minX:T.minX-a.avoidMargin,maxX:T.maxX+a.avoidMargin,minZ:T.minZ-a.avoidMargin,maxZ:T.maxZ+a.avoidMargin})),p=[],M=[],x={},v=a.plots??[],w=(T,b)=>{const _=T+l/2,A=b+l/2;for(let k=0;k<v.length;k++){const L=v[k],U=Math.max(0,L.clearMarginCells??0);if(_>=L.minCellX-U&&_<=L.maxCellX+U&&A>=L.minCellZ-U&&A<=L.maxCellZ+U)return!0}return!1},S=(T,b,_)=>{const A=p.length;for(let k=0;k<_;k++){const L=(T+r()*l)*o,U=(b+r()*l)*o;let D=!1;for(let Pt=0;Pt<g.length;Pt++){const Y=g[Pt];if(L>=Y.minX&&L<=Y.maxX&&U>=Y.minZ&&U<=Y.maxZ){D=!0;break}}if(D)continue;const P=Bp(e,L,U,3,0,.05),O=h+(f-h)*r(),B=(O-h)/Math.max(Xa,f-h),W=Math.min(1,Math.max(0,r()*.68+B*.32)),et=p.length;p.push({id:et,x:L,y:P,z:U,yaw:r()*zs,height:O,width:o*.26,tone:W,lean:(r()-.5)*.24,bend:0,bendX:0,bendZ:0,targetBend:0,recover:0,cut:0,cutAt:0});const lt=tm(Math.floor(L/c),Math.floor(U/c)),pt=x[lt];pt?pt.push(et):x[lt]=[et]}p.length>A&&M.push({id:M.length,cellX:T,cellZ:b,bladeFrom:A,bladeTo:p.length})},E=()=>m+Math.floor(r()*(y-m+1));for(let T=a.minCellZ;T+l<=a.maxCellZ;T+=l)for(let b=a.minCellX;b+l<=a.maxCellX;b+=l){const _=r();w(b,T)||_>a.density||S(b,T,E())}for(let T=0;T<v.length;T++){const b=v[T],_=Math.min(1,Math.max(0,b.density??1));for(let A=b.minCellZ;A+l<=b.maxCellZ;A+=l)for(let k=b.minCellX;k+l<=b.maxCellX;k+=l)r()>_||S(k,A,E())}return{spec:a,cellSize:o,bucketCells:s.bucketCells,blades:p,patches:M,buckets:x,cutCount:0,lastCutAt:0,wind:mc(s.wind??zo)}}function em(n,t,e,i){const a=Math.max(1,n.bucketCells)*n.cellSize,s=Math.floor((t-i)/a),o=Math.floor((t+i)/a),r=Math.floor((e-i)/a),l=Math.floor((e+i)/a),c=[];for(let h=s;h<=o;h++)for(let f=r;f<=l;f++){const d=n.buckets[tm(h,f)];if(d)for(let u=0;u<d.length;u++)c.push(d[u])}return c}function gv(n){const t=n.grass,e=n.config.grass;if(!t||!e||!e.enabled||!n.modules.grass)return 0;const i=Pp(n);if(!i.active&&i.slamRadius<=0)return 0;const a=.02,s=Math.max(i.reach,i.slamRadius)+1;let o=0;const r=em(t,i.x,i.z,s);for(let l=0;l<r.length;l++){const c=t.blades[r[l]];if(c.cut!==0||!Sg(i,c.x,c.z,a)&&!wg(i,c.x,c.z,a))continue;c.cut=e.regrow?Math.max(Xa,e.regrowSec):-1,c.cutAt=n.time;const h=c.x-i.x,f=c.z-i.z,d=Math.sqrt(h*h+f*f);c.bendX=d>Xa?h/d:i.fx,c.bendZ=d>Xa?f/d:i.fz,c.bend=Math.min(e.maxBendRad,.55),c.targetBend=0,o+=1}return o>0&&(t.cutCount+=o,t.lastCutAt=n.time,n.events.push({type:"grass-cut",tick:n.tick,x:i.x,y:n.character.position.y,z:i.z,value:o})),o}function xv(n,t){const e=n.grass,i=n.config.grass;if(!e||e.blades.length===0||!i||!i.enabled||!n.modules.grass)return;const a=Jp(n.config);e.wind||(e.wind=mc(a)),cv(e.wind,a,t);const s=e.blades,o=s.length,r=new Array(o).fill(0),l=Math.max(0,i.bendRadius)+n.config.characterRadius;for(let m=0;m<o;m++)s[m].targetBend=0;const c=n.character.position.x,h=n.character.position.z,f=(m,y)=>{const g=em(e,m,y,l);for(let p=0;p<g.length;p++){const M=g[p],x=s[M];if(x.cut!==0)continue;const v=x.x-m,w=x.z-y,S=Math.sqrt(v*v+w*w);if(S>l)continue;const E=1-S/l,T=i.maxBendRad*E*E;if(T>x.targetBend){x.targetBend=T;const b=S>Xa?1/S:0;x.bendX=S>Xa?v*b:0,x.bendZ=S>Xa?w*b:1,x.recover=0}r[M]=1}};if(f(c,h),n.modules.dummies)for(let m=0;m<n.dummies.length;m++)f(n.dummies[m].position.x,n.dummies[m].position.z);const d=1-Math.exp(-Math.max(0,i.bendRate)*t),u=1-Math.exp(-Math.max(0,i.recoverRate)*t);for(let m=0;m<o;m++){const y=s[m];y.bend+=(y.targetBend-y.bend)*(y.targetBend>y.bend?d:u),y.bend<1e-4&&(y.bend=0),!r[m]&&y.bend===0&&(y.recover+=t),y.cut>0&&(y.cut-=t,y.cut<=0&&(y.cut=0))}gv(n)}function vv(n){const t=n.grass;if(!t)return;for(let i=0;i<t.blades.length;i++){const a=t.blades[i];a.bend=0,a.targetBend=0,a.bendX=0,a.bendZ=0,a.recover=0,a.cut=0,a.cutAt=0}t.cutCount=0,t.lastCutAt=0;const e=mc(Jp(n.config));t.wind.time=e.time,t.wind.gust=e.gust}const yv=.55,Mv=.5,_v=.8,bv=.25,Sv=.004,wv=.6,Ev=6,Tv=.8,Av=1.6,ns=.82,Rv=.6;function Xe(n,t,e){return{x:n,y:t,z:e}}function Oa(n,t){return Xe(n.y*t.z-n.z*t.y,n.z*t.x-n.x*t.z,n.x*t.y-n.y*t.x)}function la(n,t){return n.x*t.x+n.y*t.y+n.z*t.z}function Ai(n,t,e,i,a,s,o){const r=2*(e*o-i*s),l=2*(i*a-t*o),c=2*(t*s-e*a);return Xe(a+n*r+(e*c-i*l),s+n*l+(i*r-t*c),o+n*c+(t*l-e*r))}function Pv(n,t,e,i,a,s,o,r){return[n*a-t*s-e*o-i*r,n*s+t*a+e*r-i*o,n*o-t*r+e*a+i*s,n*r+t*o-e*s+i*a]}function Cv(n,t,e,i){const a=i*.5,s=Math.sin(a);return[Math.cos(a),n*s,t*s,e*s]}function Lv(n){const t=[];for(let e=0;e<8;e++){const i=e&1?n.hx:-n.hx,a=e&2?n.hy:-n.hy,s=e&4?n.hz:-n.hz,o=Ai(n.qw,n.qx,n.qy,n.qz,i,a,s);t.push(Xe(n.x+o.x,n.y+o.y,n.z+o.z))}return t}function vu(n,t){const e=Ai(n.qw,-n.qx,-n.qy,-n.qz,t.x,t.y,t.z),i=e.x>=0?n.hx:-n.hx,a=e.y>=0?n.hy:-n.hy,s=e.z>=0?n.hz:-n.hz,o=Ai(n.qw,n.qx,n.qy,n.qz,i,a,s);return Xe(n.x+o.x,n.y+o.y,n.z+o.z)}function yu(n,t){const e=Ai(n.qw,n.qx,n.qy,n.qz,1,0,0),i=Ai(n.qw,n.qx,n.qy,n.qz,0,1,0),a=Ai(n.qw,n.qx,n.qy,n.qz,0,0,1);return n.hx*Math.abs(la(t,e))+n.hy*Math.abs(la(t,i))+n.hz*Math.abs(la(t,a))}function Dv(n,t){const e=[];for(let o=0;o<3;o++)e.push(Ai(n.qw,n.qx,n.qy,n.qz,o===0?1:0,o===1?1:0,o===2?1:0)),e.push(Ai(t.qw,t.qx,t.qy,t.qz,o===0?1:0,o===1?1:0,o===2?1:0));for(let o=0;o<3;o++)for(let r=0;r<3;r++){const l=Ai(n.qw,n.qx,n.qy,n.qz,o===0?1:0,o===1?1:0,o===2?1:0),c=Ai(t.qw,t.qx,t.qy,t.qz,r===0?1:0,r===1?1:0,r===2?1:0),h=Oa(l,c);if(h.x===0&&h.y===0&&h.z===0)continue;const f=Math.hypot(h.x,h.y,h.z);e.push(Xe(h.x/f,h.y/f,h.z/f))}const i=Xe(t.x-n.x,t.y-n.y,t.z-n.z);let a=null,s=-1/0;for(const o of e){const r=yu(n,o),l=yu(t,o),c=la(i,o),h=r+l-Math.abs(c);if(h<=0)return null;h>s&&(s=h,a=c<0?Xe(-o.x,-o.y,-o.z):Xe(o.x,o.y,o.z))}return a?{axis:a,depth:s}:null}function kv(n,t){const e=n.a,i=n.b,a=i?i.invMass:0,s=i?i.invInertia:0,o=e.invMass+a;if(o===0)return;const r=Xe(n.p.x-e.x,n.p.y-e.y,n.p.z-e.z),l=i?Xe(n.p.x-i.x,n.p.y-i.y,n.p.z-i.z):Xe(0,0,0),c=Xe(e.vx+(e.wy*r.z-e.wz*r.y),e.vy+(e.wz*r.x-e.wx*r.z),e.vz+(e.wx*r.y-e.wy*r.x)),h=i?Xe(i.vx+(i.wy*l.z-i.wz*l.y),i.vy+(i.wz*l.x-i.wx*l.z),i.vz+(i.wx*l.y-i.wy*l.x)):Xe(0,0,0),f=Xe(c.x-h.x,c.y-h.y,c.z-h.z),d=la(f,n.n),u=Oa(r,n.n),m=i?Oa(l,n.n):Xe(0,0,0),y=e.invInertia*(u.x*u.x+u.y*u.y+u.z*u.z)+s*(m.x*m.x+m.y*m.y+m.z*m.z),g=o+y;if(g<=0)return;let p=0;d<0&&(p=-(1+(-d>Rv?t:0))*d/g,Mu(e,i,n.n,r,l,p));const M=Xe(e.vx+(e.wy*r.z-e.wz*r.y),e.vy+(e.wz*r.x-e.wx*r.z),e.vz+(e.wx*r.y-e.wy*r.x)),x=i?Xe(i.vx+(i.wy*l.z-i.wz*l.y),i.vy+(i.wz*l.x-i.wx*l.z),i.vz+(i.wx*l.y-i.wy*l.x)):Xe(0,0,0),v=Xe(M.x-x.x,M.y-x.y,M.z-x.z),w=Xe(v.x-n.n.x*la(v,n.n),v.y-n.n.y*la(v,n.n),v.z-n.n.z*la(v,n.n)),S=Math.hypot(w.x,w.y,w.z);if(S>1e-5){const E=w.x/S,T=w.y/S,b=Xe(E,T,w.z/S),_=Oa(r,b),A=i?Oa(l,b):Xe(0,0,0),k=e.invInertia*(_.x*_.x+_.y*_.y+_.z*_.z)+s*(A.x*A.x+A.y*A.y+A.z*A.z),L=o+k;if(L>0){let U=-S/L;const D=(e.friction+(i?i.friction:e.friction))*.5*Math.max(0,p);U>D&&(U=D),U<-D&&(U=-D),Mu(e,i,b,r,l,U)}}p>bv&&(e.rest&&(e.rest=0,e.restT=0),i&&i.rest&&(i.rest=0,i.restT=0))}function Iv(n){const t=n.a,e=n.b,i=e?e.invMass:0,a=t.invMass+i;if(a===0)return;const s=Math.max(n.depth-Sv,0)*wv;if(s<=0)return;const o=t.invMass/a,r=i/a;t.x+=n.n.x*s*o,t.y+=n.n.y*s*o,t.z+=n.n.z*s*o,e&&(e.x-=n.n.x*s*r,e.y-=n.n.y*s*r,e.z-=n.n.z*s*r)}function Mu(n,t,e,i,a,s){n.vx+=e.x*s*n.invMass,n.vy+=e.y*s*n.invMass,n.vz+=e.z*s*n.invMass;const o=Oa(i,e);if(n.wx+=n.invInertia*(o.x*s),n.wy+=n.invInertia*(o.y*s),n.wz+=n.invInertia*(o.z*s),t){t.vx-=e.x*s*t.invMass,t.vy-=e.y*s*t.invMass,t.vz-=e.z*s*t.invMass;const r=Oa(a,e);t.wx-=t.invInertia*(r.x*s),t.wy-=t.invInertia*(r.y*s),t.wz-=t.invInertia*(r.z*s)}}function zv(n,t,e,i){for(const o of n){if(o.invMass===0||o.rest)continue;o.vy-=i*t,o.x+=o.vx*t,o.y+=o.vy*t,o.z+=o.vz*t;const r=1/(1+Tv*t),l=1/(1+Av*t);o.vx*=r,o.vy*=r,o.vz*=r,o.wx*=l,o.wy*=l,o.wz*=l;const c=Math.hypot(o.wx,o.wy,o.wz);if(c>1e-9){const[h,f,d,u]=Cv(o.wx/c,o.wy/c,o.wz/c,c*t),[m,y,g,p]=Pv(h,f,d,u,o.qw,o.qx,o.qy,o.qz),M=1/Math.hypot(m,y,g,p);o.qw=m*M,o.qx=y*M,o.qy=g*M,o.qz=p*M}}const a=[],s=new Array(n.length).fill(!1);for(let o=0;o<n.length;o++){const r=n[o];if(r.invMass===0)continue;const l=Lv(r);for(const c of l){const h=e-c.y;h>0&&(s[o]=!0,a.push({a:r,b:null,n:Xe(0,1,0),p:c,depth:h}))}for(let c=o+1;c<n.length;c++){const h=Dv(r,n[c]);if(!h)continue;const f=vu(r,h.axis),d=vu(n[c],Xe(-h.axis.x,-h.axis.y,-h.axis.z)),u=Xe((f.x+d.x)*.5,(f.y+d.y)*.5,(f.z+d.z)*.5);s[o]=!0,s[c]=!0,a.push({a:r,b:n[c],n:Xe(-h.axis.x,-h.axis.y,-h.axis.z),p:u,depth:h.depth})}}for(let o=0;o<Ev;o++)for(const r of a)kv(r,Math.min(r.a.restitution,r.b?r.b.restitution:r.a.restitution));for(const o of a)Iv(o);for(let o=0;o<n.length;o++){const r=n[o];if(r.invMass===0)continue;const l=r.hx+r.hy+r.hz,c=Math.hypot(r.vx,r.vy,r.vz)+l*Math.hypot(r.wx,r.wy,r.wz);s[o]&&c<_v&&(r.vx*=ns,r.vy*=ns,r.vz*=ns,r.wx*=ns,r.wy*=ns,r.wz*=ns),c<yv?(r.restT+=t,r.restT>=Mv&&!r.rest&&(r.rest=1,r.vx=r.vy=r.vz=0,r.wx=r.wy=r.wz=0)):r.restT=0}}const wi=1e-6,_u=Math.PI/180,Fs=.08,Fv=12,Uv=.6,bu=2.4,Nv=1.6,Hc=5,Su=2,Ov=2.2,nm=.28,im=.7;function Ei(n,t,e){return n<t?t:n>e?e:n}function Bv(n,t,e,i,a,s,o,r){const l=Math.max(wi,e),c=Ei(r.minU??Fs,0,1),h=Ei(r.maxU??.92,0,1);let f=Ei((n-t)/l,c,h);const d=r.bands;if(d&&d.length>0){let L=d[0],U=Math.abs(L-f);for(let D=1;D<d.length;D++){const P=Math.abs(d[D]-f);P<U&&(L=d[D],U=P)}f=Ei(L,c,h)}const u=Math.sqrt(a*a+s*s+o*o),m=u>wi?a/u:0,y=u>wi?s/u:0,g=u>wi?o/u:1,p=Math.sqrt(m*m+g*g),M=p>wi?m/p:0,x=p>wi?g/p:1,v=r.pitchGain??.85,w=Ei(r.maxTiltDeg??62,0,89)*_u,S=Math.max(0,-y);let E=Math.min(w,Ei(r.tiltDeg,0,89)*_u+S*v);const T=f*l,b=Math.min(T,l-T),_=Math.atan(Math.max(0,b*.9)/Math.max(wi,i));E=Math.min(E,_);const A=Math.tan(E),k=1/Math.sqrt(1+A*A);return{u:f,theta:E,nx:M*A*k,ny:k,nz:x*A*k,ax:x,ay:0,az:-M}}function Hv(n,t,e,i,a,s){const o=t*e,r=1/Math.max(wi,a),l=(c,h)=>Ei(o-(i*c+s*h)*r,0,e);return[l(-n,-n),l(n,-n),l(n,n),l(-n,n)]}function Gv(n){return!n||n.length===0?[]:n.map(t=>({id:t.id,kind:t.kind,x:t.x,y:t.y,z:t.z,height:t.height,radius:t.radius,tiltDeg:t.tiltDeg??18,pitchGain:t.pitchGain??.85,maxTiltDeg:t.maxTiltDeg??62,fallSec:t.fallSec??.9,bands:t.bands?[...t.bands]:[],color:t.color??"#8a6b4a",cutColor:t.cutColor??"#e8c9a0",broken:0,standU:1,snx:0,sny:1,snz:0,cutU:1,theta:0,nx:0,ny:1,nz:0,ax:0,ay:0,az:-1,brokenAt:0,fragments:[]}))}function am(n,t,e){const i=2*n*(2*t)*(2*e),s=1/Math.max(1e-4,i*Fv),o=n*n+t*t+e*e,r=s*Uv/Math.max(1e-4,o);return{invMass:s,invInertia:r}}function sm(n,t,e,i){n.events.push({type:"break",tick:n.tick,x:t.x,y:i,z:t.z,value:e})}function om(n,t,e,i,a,s,o){const r=t.y+t.standU*t.height,l=Ei(i,t.y+Fs*t.height,r),c=(l-t.y)/t.height,h=Bv(l,t.y,t.height,t.radius,a,s,o,{tiltDeg:t.tiltDeg,bands:t.bands,pitchGain:t.pitchGain,maxTiltDeg:t.maxTiltDeg,minU:Fs,maxU:t.standU}),f=c,d=t.standU,u=(d-f)*t.height,m=t.y+(f+d)*.5*t.height,y=am(t.radius,u*.5,t.radius),g=Math.hypot(a,o),p=g>wi?a/g:1,M=g>wi?o/g:0,x={x:t.x,y:m,z:t.z,hx:t.radius,hy:u*.5,hz:t.radius,qw:1,qx:0,qy:0,qz:0,vx:p*bu,vy:Nv,vz:M*bu,wx:h.ax*Hc,wy:h.ay*Hc,wz:h.az*Hc,invMass:y.invMass,invInertia:y.invInertia,restitution:nm,friction:im,rest:0,restT:0};t.fragments.push(x),t.standU=c,t.snx=h.nx,t.sny=h.ny,t.snz=h.nz,t.broken+=1,t.cutU=c,t.theta=h.theta,t.nx=h.nx,t.ny=h.ny,t.nz=h.nz,t.ax=h.ax,t.ay=h.ay,t.az=h.az,t.brokenAt=n.time,sm(n,t,e,l)}function rm(n,t,e,i,a,s,o){const r=Math.round(t.height*t.radius*30),l=Ei(r,6,12);let c=2;for(;c*c*c<l;)c++;const h=c*c*c,f=2*t.radius/c,d=t.height/c,u=t.radius,m=t.x,y=Ei(i,t.y+.05,t.y+t.height-.05),g=t.z,p=[];let M=0;for(let x=0;x<c&&M<h;x++)for(let v=0;v<c&&M<h;v++)for(let w=0;w<c&&M<h;w++){const S=t.x-u+(x+.5)*f,E=t.y+(v+.5)*d,T=t.z-u+(w+.5)*f,b=(Un(n)-.5)*f*.4,_=(Un(n)-.5)*d*.4,A=(Un(n)-.5)*f*.4,k=S+b,L=E+_,U=T+A,D=f*.5*(.72+Un(n)*.22),P=d*.5*(.72+Un(n)*.22),O=f*.5*(.72+Un(n)*.22),B=am(D,P,O);let W=k-m,et=L-y,lt=U-g;const pt=Math.hypot(W,et,lt)||1;W/=pt,et/=pt,lt/=pt,pt<.001&&(W=wu(n),et=0,lt=wu(n));const Pt=4+Un(n)*5;p.push({x:k,y:L,z:U,hx:D,hy:P,hz:O,qw:1,qx:0,qy:0,qz:0,vx:W*Su,vy:Ov+Un(n)*1.2,vz:lt*Su,wx:(Un(n)-.5)*Pt,wy:(Un(n)-.5)*Pt,wz:(Un(n)-.5)*Pt,invMass:B.invMass,invInertia:B.invInertia,restitution:nm,friction:im,rest:0,restT:0}),M++}t.fragments=p,t.broken=1,t.standU=0,t.cutU=0,t.theta=0,t.nx=0,t.ny=1,t.nz=0,t.ax=0,t.ay=0,t.az=-1,t.brokenAt=n.time,sm(n,t,e,y)}function wu(n){return Un(n)*2-1}function Xv(n,t,e,i,a,s){const o=n.destructibles;if(!o)return!1;for(let r=0;r<o.length;r++){const l=o[r];if(l.id===t){if(l.kind==="pole")return l.standU<=Fs?!1:(om(n,l,r,e,i,a,s),!0);if(l.kind==="jar")return l.broken!==0?!1:(rm(n,l,r,e),!0)}}return!1}function Vv(n,t,e){const i=n.destructibles;if(!i||i.length===0||!n.modules.destructibles)return;const a=e.breakHits??[],s=a.length>0?Pp(n):null;if(!!s&&(s.active||s.slamRadius>0)&&s)for(let l=0;l<a.length;l++){const c=a[l];let h=-1;for(let d=0;d<i.length;d++)if(i[d].id===c.id){h=d;break}if(h<0)continue;const f=i[h];if(f.kind==="pole"){if(f.standU<=Fs)continue;om(n,f,h,c.y,c.dx,c.dy,c.dz)}else if(f.kind==="jar"){if(f.broken!==0)continue;rm(n,f,h,c.y,c.dx,c.dy,c.dz)}}const r=n.config.gravity;for(let l=0;l<i.length;l++){const c=i[l];if(!c.fragments||c.fragments.length===0)continue;const h=c.fragments.slice();if(c.kind==="pole"&&c.standU>.02){const f=c.standU*c.height*.5;h.push({x:c.x,y:c.y+f,z:c.z,hx:c.radius,hy:f,hz:c.radius,qw:1,qx:0,qy:0,qz:0,vx:0,vy:0,vz:0,wx:0,wy:0,wz:0,invMass:0,invInertia:0,restitution:0,friction:0,rest:0,restT:0})}zv(h,t,c.y,r)}}function cm(n){const t=n.destructibles;if(t)for(let e=0;e<t.length;e++){const i=t[e];i.broken=0,i.standU=1,i.snx=0,i.sny=1,i.snz=0,i.cutU=1,i.theta=0,i.nx=0,i.ny=1,i.nz=0,i.ax=0,i.ay=0,i.az=-1,i.brokenAt=0,i.fragments=[]}}function Wv(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function Yv(n,t){const e=Jg(t);return{tick:0,time:0,rngState:2654435769,config:n,boxes:e,gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Wp(1),playerLink:fc(),arrows:[],arrowSeq:0,abilities:qg(),skills:$g(n),impulse:{x:0,z:0},targeting:nv(),turnInPlace:Cg(),playerHurt:Ap(),hitCount:0,dash:{...Yx(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Up(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Wv(),dummies:Cx(n.dummies),dummyAttackCount:0,grass:mv(n,t,e,t.grid),destructibles:Gv(t.destructibles),events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0,grass:!0,destructibles:!0}}}function $v(n){qx(n),jp(n),Gp(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Xh,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Fp(n),Hp(n),Kp(n),Np(n),Zr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,vv(n),cm(n),n.events.length=0}function Eu(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){$v(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?av(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),px(n,t,e),n.modules.combat&&wx(n,t,e),n.modules.dash&&Zx(n,t,e),n.modules.movement&&Kx(n,t,e),n.modules.gaze&&sv(n,t,e),n.modules.orientation&&Ig(n,t,e),kg(n,t,e),n.modules.dummies&&Hx(n,t,e),bg(n,t),hx(n,t),n.modules.abilities&&jg(n,t,e),n.modules.combat&&rx(n,t),n.modules.dummies&&(Pg(n,t),n.modules.separation&&(Jx(n),tv(n))),xv(n,t),Vv(n,t,e),n.modules.camera?Kg(n):Np(n),n}const lm=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],Tu=1e-9;function Zv(n,t,e){return n<t?t:n>e?e:n}function hm(n){return Zv(Number.isFinite(n)?n:0,0,1)}function dm(n,t){const e=hm(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function qv(){const n={};for(const t of lm)n[t]=0;return n}function jv(n,t){const e=qv(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=hm(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+Tu;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>Tu?(a-o.t)/l:0,h=dm(o.ease??"linear",c);for(const f of lm){const d=o.pose[f]??r.pose[f]??0,u=r.pose[f]??o.pose[f]??0;e[f]=d+(u-d)*h}return e}function Kv(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=dm(i,t/a);return e.turns*Math.PI*2*s}function Sa(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function Jv(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Eu(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){Eu(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function zi(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function Oe(n,t,e){return n+(t-n)*e}function Qv(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function Au(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:Qv(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function ty(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function ey(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:Oe(n.ch.x,t.ch.x,i),y:Oe(n.ch.y,t.ch.y,i),z:Oe(n.ch.z,t.ch.z,i)},facing:zi(n.ch.facing,t.ch.facing,i),moveYaw:zi(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:zi(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:zi(n.ch.headYaw,t.ch.headYaw,i),headPitch:Oe(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:Oe(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:zi(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:Oe(n.ch.stride,t.ch.stride,i),velocity:{x:Oe(n.ch.vx,t.ch.vx,i),y:Oe(n.ch.vy,t.ch.vy,i),z:Oe(n.ch.vz,t.ch.vz,i)}},s={attackProgress:Oe(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:Oe(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:Oe(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,Oe(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:Oe(n.hurt.timer,t.hurt.timer,i),knockX:Oe(n.hurt.knockX,t.hurt.knockX,i),knockZ:Oe(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((l,c)=>{const h=n.dm[c];return h?{position:{x:Oe(h.x,l.x,i),y:Oe(h.y,l.y,i),z:Oe(h.z,l.z,i)},facing:zi(h.facing,l.facing,i),bodyYaw:zi(h.bodyYaw,l.bodyYaw,i),headYaw:zi(h.headYaw,l.headYaw,i),gaitPhase:zi(h.gaitPhase,l.gaitPhase,i),stride:Oe(h.stride,l.stride,i),attackProgress:Oe(h.attackProgress,l.attackProgress,i),velocity:{x:Oe(h.vx,l.vx,i),y:Oe(h.vy,l.vy,i),z:Oe(h.vz,l.vz,i)}}:null});return{time:Oe(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:Oe(n.dash.timer,t.dash.timer,i)},turn:{progress:Oe(n.turn.progress,t.turn.progress,i)},link:{progress:Oe(n.link.progress,t.link.progress,i)},dummies:r}}function ny(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const um={slopPx:12,longPressMs:450,doubleTapMs:280};function iy(n,t,e=um.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function wa(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function ay(n=um){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),wa(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,wa(l.button,"drag",c,h,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY,f=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return wa(l.button,"release",c,h,f,1);const u=e.get(l.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(s-u.x,o-u.y)<=n.slopPx*2?(e.delete(l.button),wa(l.button,"doubleTap",c,h,f,2)):(e.set(l.button,{at:r,x:s,y:o}),wa(l.button,"tap",c,h,f,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),wa(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,wa(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const Gc=.001,sy=18;function $l(n,t,e){return n<t?t:n>e?e:n}function Zl(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function oy(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function ry(n,t,e,i,a=sy){const s=oy(t);if(!s)return{state:Zl(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<Gc)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<Gc?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Gc)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:$l(Number.isFinite(u)?u:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Ru(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?$l(r,a,s):$l(n,a,s)}function cy(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function ly(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Xc=["jump","sprint","reset","attack","skill2"],hy=8,dy=16,Vc=10,Pu=14,Cu=140,uy=18,fy=16,py=400,my=1.0001;function Ur(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function gy(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Ur(e)}function xy(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,f=0,d=0,u=-1,m=0,y=null,g=-1,p=0,M=0,x=0,v=0,w=!1,S=0,E=1,T=0,b=null,_=0,A=0,k=!1,L=null,U=null,D=0,P=0,O=0,B=0,W=!1,et=!0,lt=-1;const pt=ay({slopPx:Pu,longPressMs:450,doubleTapMs:350});let Pt=[],Y=null;const nt=new Set;function ut(j){j&&Pt.push(j)}const st=new Map;let tt=Zl(),dt=!1,Ut=1;function Vt(){const j=Array.from(st.values()),$=a(),ct=ry(tt,j,$.pinchGain,$.maxStepRatio,uy);if(tt=ct.state,dt=ct.pinching,ct.scale!==1&&(Ut*=ct.scale),ct.started||ct.armedNow)b=null,k=!0,L=null;else if(ct.ended&&o===null&&j.length===1){const Nt=j[0];o=Nt.id,r=Nt.x,l=Nt.y,c=0,h=0,f=Nt.x,d=Nt.y,w=!1,S=0,E=1,T=0,performance.now(),b=null,k=!0,L=null}}const ht={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},X={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let N=0,At=0;const Rt={},St=new Set,vt=[];function mt(){for(const j of Xc)Rt[j]!==void 0&&(Rt[j]=void 0),K(j);pt.reset(),nt.clear(),st.clear(),tt=Zl(),dt=!1,o=null,c=0,h=0,f=0,d=0,w=!1,S=0,E=1,T=0,p=0,M=0,x=0,v=0,y=null,g=-1,b=null,k=!1,L=null,U=null,lt=-1,O=0,B=0,W=!1,et=!0}const kt=()=>{document.hidden&&mt()},F=j=>{if(j.clientX===0&&j.clientY===0){m++;return}if(Ur(j.target)||gy(j.clientX,j.clientY)){nt.add(j.pointerId);return}if(nt.delete(j.pointerId),st.set(j.pointerId,{id:j.pointerId,x:j.clientX,y:j.clientY}),o===null&&!dt){y=null,g=-1,o=j.pointerId,r=j.clientX,l=j.clientY,c=0,h=0,f=j.clientX,d=j.clientY,performance.now();const $=Number.isFinite(j.screenX)&&Number.isFinite(j.screenY)&&(j.screenX!==0||j.screenY!==0);w=$,S=0,E=1,T=0,p=$?j.screenX:0,M=$?j.screenY:0,x=p,v=M,b=j.pointerId,_=j.clientX,A=j.clientY,k=!1}Vt()},R=j=>{if(j.pointerId===U&&(j.pointerType==="mouse"&&j.buttons===0||j.clientX===0&&j.clientY===0&&(D!==0||P!==0)||(et?(O=j.clientX-D,B=j.clientY-P):(D=j.clientX,P=j.clientY,et=!0,O=0,B=0))),ut(pt.move(j.pointerId,j.clientX,j.clientY,performance.now())),!nt.has(j.pointerId)&&st.has(j.pointerId)&&(st.set(j.pointerId,{id:j.pointerId,x:j.clientX,y:j.clientY}),Vt()),nt.has(j.pointerId)||j.pointerId!==o)return;const $=performance.now();if(y===j.pointerId&&$-g<150){m++;return}const ct=j.clientX,Nt=j.clientY;if(ct===0&&Nt===0&&(r!==0||l!==0)){m++;return}const Ct=ct-f,I=Nt-d,yt=Number.isFinite(j.screenX)&&Number.isFinite(j.screenY),Q=yt?j.screenX:0,rt=yt?j.screenY:0,Dt=yt&&(Q!==0||rt!==0),Tt=Q-x,qt=rt-v;if(w&&Dt){const Le=Math.hypot(Tt,qt),ze=Math.hypot(Ct,I);if(Le>3){if(S=0,T<30&&ze>6&&Tt*Ct+qt*I>.7*Le*ze){const Mn=Le/ze;Mn>.2&&Mn<5&&(E+=(Mn-E)*.3,T++)}}else ze>12&&(S++,S>=2&&(w=!1))}const he=Math.hypot(Ct,I);if(!w){const Le=u<0?Number.POSITIVE_INFINITY:$-u,ze=Dt?Math.hypot(Tt,qt):1/0;he>28&&(Le<200||ze<he*.4)&&(r+=Ct,l+=I,m++)}f=ct,d=Nt,x=Q,v=rt,j.pointerId===b&&Math.hypot(j.clientX-_,j.clientY-A)>hy&&(k=!0);let de,ne;w&&Dt?(de=(Q-p)/E,ne=(rt-M)/E):(de=ct-r,ne=Nt-l);const Ee=Math.hypot(de,ne),Ie=s();Ee>Ie&&(de*=Ie/Ee,ne*=Ie/Ee);const Ye=Math.hypot(c,h),Te=Math.hypot(de,ne);if(Ye>10&&Te>10){const Le=Math.abs(Math.atan2(c*ne-h*de,c*de+h*ne)),ze=Math.max(Ye,Te)*Le,Mn=Math.max(Math.hypot(Ct,I),Math.hypot(Tt,qt)/Math.max(.2,E));if(Le>.6&&Mn<Math.max(6,ze*.5)){m++;return}}c=de,h=ne};function K(j){if(!ht[j])return;ht[j]=!1,j==="attack"&&(X.attackReleased=!0);const $=document.getElementById(`btn-${j}`);$==null||$.classList.remove("is-down")}function ft(){o!==null&&(y=o,g=performance.now(),o=null,c=0,h=0,f=0,d=0,w=!1,S=0,E=1,T=0,p=0,M=0,x=0,v=0)}const V=j=>{const $=st.delete(j.pointerId),ct=nt.delete(j.pointerId);$&&Vt(),j.pointerId===U&&(U=null,W?lt=performance.now():(O=0,B=0,lt=-1)),ut(pt.end(j.pointerId,j.clientX,j.clientY,performance.now()));for(const Ft of Xc)Rt[Ft]===j.pointerId&&(Rt[Ft]=void 0,K(Ft));const Nt=!$&&!ct&&st.size<=1&&o!==null;(j.pointerId===o||st.size===0||Nt)&&ft(),!ct&&j.pointerId===b&&(!k&&!Ur(j.target)&&(L={x:j.clientX,y:j.clientY}),b=null)};for(const j of Xc){const $=document.getElementById(`btn-${j}`);if(!$)continue;const ct=j==="attack"||j==="skill2",Nt=I=>{if(I.preventDefault(),Rt[j]===void 0){Rt[j]=I.pointerId,ht[j]=!0,j==="jump"&&(X.jump=!0),j==="reset"&&(X.reset=!0),j==="sprint"&&(X.sprintPressed=!0),j==="attack"&&(X.attackPressed=!0),j==="skill2"&&(X.skill2=!0),$.classList.add("is-down"),ut(pt.begin(j,I.pointerId,I.clientX,I.clientY,performance.now()));try{$.setPointerCapture(I.pointerId)}catch{}ct&&(U=I.pointerId,D=I.clientX,P=I.clientY,et=!(I.clientX===0&&I.clientY===0),O=0,B=0,W=!1,lt=-1)}},Ft=I=>{Rt[j]===I.pointerId&&(Rt[j]=void 0,K(j),ut(pt.end(I.pointerId,I.clientX,I.clientY,performance.now())))},Ct=I=>{Rt[j]===I.pointerId&&(Rt[j]=void 0,K(j),ut(pt.cancel(I.pointerId,performance.now())))};$.addEventListener("pointerdown",Nt),$.addEventListener("pointerup",Ft),$.addEventListener("pointercancel",Ct),vt.push(()=>{$.removeEventListener("pointerdown",Nt),$.removeEventListener("pointerup",Ft),$.removeEventListener("pointercancel",Ct)})}const ot=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const j of ot){const $=ct=>{ct.preventDefault(),N=Number(j.dataset.weapon)||0};j.addEventListener("pointerdown",$),vt.push(()=>j.removeEventListener("pointerdown",$))}const zt=j=>{const $=j.key.toLowerCase();if(($===" "||$.startsWith("arrow"))&&j.preventDefault(),St.has($))return;St.add($),$===" "&&(X.jump=!0),$==="r"&&(X.reset=!0),$==="shift"&&(X.sprintPressed=!0),$==="j"&&(X.attackPressed=!0),$==="k"&&(X.skill2=!0),$>="1"&&$<="5"&&(N=Number($)),$>="6"&&$<="9"&&(At=Number($)-5);const ct=Math.max(my,a().keyStep||1.12);($==="="||$==="+")&&(Ut*=ct),($==="-"||$==="_")&&(Ut/=ct)},Et=j=>{const $=j.key.toLowerCase();St.has($)&&(St.delete($),$==="j"&&(X.attackReleased=!0))},bt=j=>{if(Ur(j.target))return;j.preventDefault();const $=j.deltaMode===1?j.deltaY*fy:j.deltaMode===2?j.deltaY*py:j.deltaY;Ut*=cy($,a().wheelStep)},Wt=j=>{j.preventDefault()},gt=()=>{u=performance.now()};window.addEventListener("resize",gt),window.addEventListener("orientationchange",gt);const Lt=typeof window<"u"?window.visualViewport:null;return Lt&&(Lt.addEventListener("resize",gt),Lt.addEventListener("scroll",gt)),window.addEventListener("pointerdown",F),window.addEventListener("pointermove",R),window.addEventListener("pointerup",V),window.addEventListener("pointercancel",V),window.addEventListener("blur",mt),document.addEventListener("visibilitychange",kt),window.addEventListener("keydown",zt),window.addEventListener("keyup",Et),window.addEventListener("wheel",bt,{passive:!1}),window.addEventListener("gesturestart",Wt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:f,y:d,dx:f-r,dy:d-l,radius:s(),badMoves:m,screenOk:w,originSX:p,originSY:M,screenX:x,screenY:v,scale:E}},peekAim(){const j=performance.now(),$=Math.hypot(O,B),ct=U!==null||lt>=0&&j-lt<Cu;if(!(ct&&W&&$>=Vc))return{active:!1,holding:ct,x:0,z:0,dx:O,dy:B};const Ft=i(),Ct=O/$,I=B/$,yt=Ft.rightX*Ct+Ft.forwardX*-I,Q=Ft.rightZ*Ct+Ft.forwardZ*-I,rt=Math.hypot(yt,Q)||1;return{active:!0,holding:ct,x:yt/rt,z:Q/rt,dx:O,dy:B}},sample(){var Cn;const j=s();let $=o!==null?Math.max(-1,Math.min(1,c/j)):0,ct=o!==null?Math.max(-1,Math.min(1,h/j)):0,Nt=0,Ft=0;(St.has("a")||St.has("arrowleft"))&&(Nt-=1),(St.has("d")||St.has("arrowright"))&&(Nt+=1),(St.has("w")||St.has("arrowup"))&&(Ft-=1),(St.has("s")||St.has("arrowdown"))&&(Ft+=1),$+=Nt,ct+=Ft;let Ct=Math.hypot($,ct);Ct>1&&($/=Ct,ct/=Ct,Ct=1);const I=$,yt=ct;Ct<e&&($=0,ct=0);const Q=i();let rt=Q.rightX*$+Q.forwardX*-ct,Dt=Q.rightZ*$+Q.forwardZ*-ct;const Tt=Math.hypot(rt,Dt);Tt>1&&(rt/=Tt,Dt/=Tt);const qt=performance.now();ut(pt.poll(qt));const he=Math.hypot(O,B);U!==null&&(he>=dy?W=!0:he<Vc&&(W=!1));const de=U!==null||lt>=0&&qt-lt<Cu,ne=de&&W&&he>=Vc;let Ee=0,Ie=0;if(ne){const ln=O/he,Ln=B/he,_n=Q.rightX*ln+Q.forwardX*-Ln,Z=Q.rightZ*ln+Q.forwardZ*-Ln,It=Math.hypot(_n,Z)||1;Ee=_n/It,Ie=Z/It}!de&&U===null&&(O=0,B=0,lt=-1,W=!1);const Ye=L;L=null;const Te=Ut;Ut=1;const Le={moveX:rt,moveZ:Dt,jumpPressed:X.jump,sprintHeld:ht.sprint||St.has("shift"),sprintPressed:X.sprintPressed,resetPressed:X.reset,attackPressed:X.attackPressed,attackHeld:ht.attack||St.has("j"),attackReleased:X.attackReleased,skill2Pressed:X.skill2,weaponSlot:N,dummyClickId:At,aimX:Ee,aimZ:Ie,aimActive:ne};X.jump=!1,X.reset=!1,X.sprintPressed=!1,X.attackPressed=!1,X.attackReleased=!1,X.skill2=!1,N=0,At=0;const ze=Pt.map(ln=>iy(ln,Q,Pu));Pt=[],ze.length>0&&(Y=ze[ze.length-1]);const Mn=o!==null?"pointer":St.size>0?"keyboard":"idle";return{intents:Le,stickX:$,stickY:ct,stickRawX:I,stickRawY:yt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:f,stickPxY:d,stickBad:m,stickScreenOk:w,stickOriginSX:p,stickOriginSY:M,stickScreenX:x,stickScreenY:v,stickScale:E,stickVpTop:((Cn=ly())==null?void 0:Cn.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:O,aimDY:B,source:Mn,tap:Ye,zoomScale:Te,gestures:ze,lastGesture:Y}},dispose(){window.removeEventListener("pointerdown",F),window.removeEventListener("pointermove",R),window.removeEventListener("pointerup",V),window.removeEventListener("pointercancel",V),window.removeEventListener("blur",mt),document.removeEventListener("visibilitychange",kt),window.removeEventListener("keydown",zt),window.removeEventListener("keyup",Et),window.removeEventListener("wheel",bt),window.removeEventListener("resize",gt),window.removeEventListener("orientationchange",gt),Lt&&(Lt.removeEventListener("resize",gt),Lt.removeEventListener("scroll",gt)),window.removeEventListener("gesturestart",Wt),pt.reset();for(const j of vt)j()}}}const Jr=1,Qr=2,tc=4,fm=8,ec=16,wo=32,pm=64,mm=128,vy=[[Jr,"atk"],[Qr,"dash"],[tc,"link"],[fm,"air"],[ec,"hurt"],[wo,"aim"],[pm,"spr"],[mm,"chan"]];function is(n){if(n===0)return"-";const t=vy.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const yy=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],My=0,_y=15,Wc=19,by=21,Sy=22,wy=23,Ey=24,_i={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Hn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,di=n=>Math.round(n*180/Math.PI*10)/10,Yc=Math.PI*2;function so(n){let t=n%Yc;return t>Math.PI&&(t-=Yc),t<-Math.PI&&(t+=Yc),t}function Ty(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Jr),n.dash.phase!=="idle"&&(e|=Qr),n.playerLink.phase!=="idle"&&(e|=tc),n.character.grounded||(e|=fm),n.playerHurt.type!=="none"&&(e|=ec),t.intents.aimActive&&(e|=wo),n.character.sprinting&&(e|=pm),n.abilities.channeling&&(e|=mm),e}function Ay(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Ry(n){const t={sampleHz:n.sampleHz??_i.sampleHz,sampleCapacity:n.sampleCapacity??_i.sampleCapacity,eventCapacity:n.eventCapacity??_i.eventCapacity,anomalyCapacity:n.anomalyCapacity??_i.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??_i.dirJumpDeg,aimDropDeg:n.aimDropDeg??_i.aimDropDeg,freezeMs:n.freezeMs??_i.freezeMs,freezeSpeed:n.freezeSpeed??_i.freezeSpeed,stickLostMs:n.stickLostMs??_i.stickLostMs,spikeMs:n.spikeMs??_i.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,f=0,d=0,u="",m=-1,y=-1,g=-1,p=0,M=-1e9,x=-1,v={},w=null,S=0,E=0,T=0,b=0;function _(D,P){const O=1/t.sampleHz,B=D[My];B-c<O-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(D),c=B)}function A(D,P,O,B,W,et){const lt=v[D]??-1e9;if(P-lt<1.2)return;if(v[D]=P,D==="frameSpike"){let Pt=0;for(const Y of s)Y.kind==="frameSpike"&&Pt++;if(Pt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let pt=i.slice(-7);et&&(pt.length===0||pt[pt.length-1]!==et)&&(pt=[...pt.slice(-6),et]),s.push({kind:D,t:Hn(P),tick:O,ms:Math.round(B),detail:W,ctx:pt}),D==="dirJump"?o.dirJumps++:D==="aimDrop"?o.aimDrops++:D==="moveFreeze"?o.freezes++:D==="stickLost"?o.stickLosts++:D==="stickJump"?o.stickJumps++:D==="stickBad"?o.stickBads++:D==="stickDrift"&&o.stickDrifts++}function k(D,P,O,B){a.length>=t.eventCapacity&&a.shift(),a.push({t:Hn(O),tick:B,k:D,d:P})}function L(D){switch(D.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":M=D.tick;break}}function U(){const D=o,P=D.wallMs/1e3,O=D.gestures,B=pt=>Object.entries(O).filter(([Pt])=>Pt.endsWith(`.${pt}`)).reduce((Pt,[,Y])=>Pt+Y,0),W=[];if(W.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),W.push(`运行 ${P.toFixed(1)}s / ${D.frames} 帧 · ${D.fps.toFixed(1)}fps · 最大 ${D.dtMax.toFixed(0)}ms · 尖峰 ${D.spikes} · 步 ${D.steps}`),W.push(`摇杆活跃 ${P>0?Math.round(D.stickActiveMs/1e3/P*100):0}% · 手势 按下 ${B("press")}（单击 ${B("tap")} / 双击 ${B("doubleTap")} / 拖拽 ${B("drag")} / 长按 ${B("longPress")} / 打断 ${B("cancel")} / 拖放 ${B("release")}）`),W.push(`攻击 ${D.attacks}(中${D.hits}) · 受击 ${D.hurts} · 派生 ${D.links}(中${D.linkHits}) · 翻滚 ${D.rolls} 闪现 ${D.blinks} · 跳 ${D.jumps} · 复位 ${D.resets}`),W.push(`法杖 引导${D.channels} 飞弹${D.bolts} 电环${D.rings} · 弓蓄力${D.bowCharges} · 当前武器 ${u||"-"}`),W.push(`异常 ${D.dirJumps+D.aimDrops+D.freezes+D.stickLosts+D.stickJumps+D.stickBads+D.stickDrifts}（dir ${D.dirJumps} / aim ${D.aimDrops} / freeze ${D.freezes} / stick ${D.stickLosts} / stickJump ${D.stickJumps} / 坏指针 ${D.stickBads} / 坐标漂移 ${D.stickDrifts}） · 掉帧尖峰 ${D.spikes}`+(D.inTurns>0?` · 输入转向 ${D.inTurns} 次（最大 ${D.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const pt of s.slice(-6)){W.push(`· ${pt.kind} @t${pt.t.toFixed(2)} tick${pt.tick} ${pt.ms>0?`${pt.ms}ms `:""}${pt.detail}`);const Pt=pt.ctx.map(nt=>String(nt[_y])).join(" "),Y=pt.ctx.map(nt=>nt[Wc]===""||nt[Wc]==null?".":String(nt[Wc])).join(" ");if(W.push(`  yaw ${Pt}`),W.push(`  in  ${Y}`),pt.kind==="stickJump"||pt.kind==="stickBad"||pt.kind==="stickLost"){const nt=pt.ctx.map(st=>`${st[by]},${st[Sy]}`).join(" "),ut=pt.ctx.map(st=>`${st[wy]},${st[Ey]}`).join(" ");W.push(`  o   ${nt}`),W.push(`  p   ${ut}`)}}if(a.length>0){W.push("最近事件：");for(const pt of a.slice(-12))W.push(`  ${pt.t.toFixed(2)} ${pt.k} ${pt.d}`.trimEnd())}const et=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",lt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return W.push(`摇杆坐标源 ${et}${lt}`),W.push(`UA ${e.ua}`),W.join(`
`)}return{sample(D,P,O,B=0){o.frames++,P.stickHeld&&(P.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=B,o.wallMs+=O,O>o.dtMax&&(o.dtMax=O),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=D.time;const W=D.time;if(l<0&&(l=W),T=W,b=D.tick,!r)return;const et=D.character,lt=Math.hypot(P.stickX,P.stickY),pt=Math.hypot(et.velocity.x,et.velocity.z);u=D.combat.weapon;const Pt=Ty(D,P),Y=et.facing,ut=Math.hypot(P.intents.moveX,P.intents.moveZ)>.05?Math.atan2(P.intents.moveX,P.intents.moveZ):null;lt>.2&&(o.stickActiveMs+=O);const st=[Hn(W),D.tick,Math.round(O*10)/10,Hn(P.stickX),Hn(P.stickY),Hn(P.stickRawX),Hn(P.stickRawY),P.stickHeld?1:0,P.source.slice(0,8),Hn(P.intents.moveX),Hn(P.intents.moveZ),Hn(et.position.x),Hn(et.position.z),Hn(et.velocity.x),Hn(et.velocity.z),di(Y),di(et.bodyYaw),Pt,Hn(et.stride),ut===null?"":di(ut),P.stickId===null?"":P.stickId,Math.round(P.stickOriginX),Math.round(P.stickOriginY),Math.round(P.stickPxX),Math.round(P.stickPxY),P.stickBad,Math.round(P.stickVpTop),Math.round(P.stickOriginSX),Math.round(P.stickOriginSY),Math.round(P.stickScreenX),Math.round(P.stickScreenY),P.stickScreenOk?1:0,Math.round(P.stickScale*100)/100];_(st);const tt=W*1e3<x;if(O>t.spikeMs&&!tt&&W-l>.6&&(o.spikes++,A("frameSpike",W,D.tick,O,`dt ${O.toFixed(0)}ms fl=${is(Pt)}`,st)),h!==null&&!tt){const mt=Math.abs(di(so(Y-h))),kt=Math.abs(di(so(et.moveYaw-f))),F=(d|Pt)&(Jr|Qr|tc|ec)|Pt&wo,R=ut===null?null:Math.abs(di(so(Y-ut))),K=ut===null||h===null?null:Math.abs(di(so(h-ut))),ft=R!==null&&K!==null&&R<K-.5,V=(d&wo)!==0&&(Pt&wo)===0&&ut===null,ot=R!==null&&(R<=12||ft);mt>t.aimDropDeg&&V?A("aimDrop",W,D.tick,0,`${mt.toFixed(0)}° @aim→none stick(${P.stickX.toFixed(2)},${P.stickY.toFixed(2)}) aim(${P.aimDX.toFixed(0)},${P.aimDY.toFixed(0)}) fl=${is(Pt)}`,st):mt>t.dirJumpDeg&&F===0&&!V&&(ot?(o.inTurns++,mt>o.inTurnMax&&(o.inTurnMax=mt)):A("dirJump",W,D.tick,0,`${mt.toFixed(0)}° res${R===null?" 无输入":`${R.toFixed(0)}°`} yaw ${di(h)}→${di(Y)} in ${ut===null?".":di(ut)}° mvΔ${kt.toFixed(0)}° aim(${P.aimDX.toFixed(0)},${P.aimDY.toFixed(0)}) fl=${is(d)}→${is(Pt)}`,st))}const dt=(Pt&(Jr|Qr|tc|ec))!==0,Ut=D.tick-M<30;lt>.35&&pt<t.freezeSpeed&&!dt&&!Ut?(m<0&&(m=W),W-m>=t.freezeMs/1e3&&W>=y&&(A("moveFreeze",W,D.tick,(W-m)*1e3,`stick(${P.stickX.toFixed(2)},${P.stickY.toFixed(2)}) v${pt.toFixed(2)} ${P.source} fl=${is(Pt)}`,st),y=W+1.5,m=-1)):m=-1,P.stickHeld?(lt>p&&(p=lt),p>.35&&lt<.06?(g<0&&(g=W),W-g>=t.stickLostMs/1e3&&(A("stickLost",W,D.tick,(W-g)*1e3,`raw(${P.stickRawX.toFixed(2)},${P.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${is(Pt)}`,st),g=-1,p=0)):g=-1):(p=0,g=-1);const Vt=P.stickScale>.2&&P.stickScale<5?P.stickScale:1,ht=P.stickScreenOk,X=ht?P.stickScreenX/Vt:P.stickPxX,N=ht?P.stickScreenY/Vt:P.stickPxY,At=ht?P.stickOriginSX/Vt:P.stickOriginX,Rt=ht?P.stickOriginSY/Vt:P.stickOriginY,St=X-At,vt=N-Rt;if(P.stickHeld&&P.stickId!==null){const mt=w;if(mt&&mt.held&&mt.id===P.stickId){const kt=Math.hypot(mt.dx,mt.dy),F=Math.hypot(St,vt),R=Math.max(kt,F),K=Math.hypot(X-mt.cx,N-mt.cy),ft=Math.abs(di(so(Math.atan2(vt,St)-Math.atan2(mt.dy,mt.dx)))),V=R*ft*Math.PI/180,ot=Math.hypot(At-mt.ox,Rt-mt.oy);if(R>18&&ft>35&&K<Math.max(5,V*.35)&&A("stickJump",W,D.tick,0,`Δ${ft.toFixed(0)}° 手指只动${K.toFixed(0)}px(弧长应${V.toFixed(0)}px) o(${Math.round(mt.ox)},${Math.round(mt.oy)})→(${Math.round(At)},${Math.round(Rt)}) 原点位移${ot.toFixed(0)}px p(${Math.round(X)},${Math.round(N)}) raw(${Math.round(St)},${Math.round(vt)}) id${P.stickId} ${ht?"src=屏幕":"src=client"}`,st),ht&&mt.screenOk){const zt=Math.hypot(P.stickPxX-mt.x,P.stickPxY-mt.y),Et=Math.hypot((P.stickScreenX-mt.sx)/Vt,(P.stickScreenY-mt.sy)/Vt);S+=zt-Et,Math.abs(S)>20&&(A("stickDrift",W,D.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(P.stickPxX)},${Math.round(P.stickPxY)}) screen(${Math.round(P.stickScreenX)},${Math.round(P.stickScreenY)})`,st),S=0)}}w={id:P.stickId,ox:At,oy:Rt,cx:X,cy:N,x:P.stickPxX,y:P.stickPxY,sx:P.stickScreenX,sy:P.stickScreenY,dx:St,dy:vt,held:!0,screenOk:ht}}else w=null,S=0;if(P.stickBad>E){const mt=P.stickBad-E;A("stickBad",W,D.tick,0,`拦截 ${mt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${P.stickBad}）o(${Math.round(P.stickOriginX)},${Math.round(P.stickOriginY)}) p(${Math.round(P.stickPxX)},${Math.round(P.stickPxY)}) id${P.stickId??"-"}`,st)}E=P.stickBad,h=Y,f=et.moveYaw,d=Pt},event(D,P){const O=Ay(D);L(D),r&&(D.type==="dash-ready"||D.type==="combo-reset"||D.type==="stepUp"||k(D.type,O,P,D.tick))},gesture(D){const P=`${D.button}.${D.kind}`;o.gestures[P]=(o.gestures[P]??0)+1,r&&(D.kind==="longPress"||D.kind==="doubleTap"||D.kind==="drag"||D.kind==="cancel")&&k(`g:${D.kind}`,`${D.button} ${D.heldMs.toFixed(0)}ms d${D.distance.toFixed(0)}px ${D.angleDeg.toFixed(0)}°`,T,b)},suspend(D){x=T*1e3+D,m=-1,g=-1},setEnabled(D){r=D,D||(h=null,w=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,v={},c=-1e9,h=null,d=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,w=null,E=0;for(const D of Object.keys(o.gestures))delete o.gestures[D]},status(){const D=o.simS,P=s.some(O=>D-O.t<8&&(O.kind==="dirJump"||O.kind==="aimDrop"||O.kind==="moveFreeze"||O.kind==="stickLost"||O.kind==="stickJump"||O.kind==="stickBad"||O.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:P,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:yy,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:U}}const Py="dash",Cy=6,Ly="冲刺标尺",Dy="沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",ky="square",Iy=5.2,zy="#bfe8ff",Fy="v9s.15 历史固定工位",Uy={x:9.8,z:8.2},Ny={dx:0,dz:4.6},Oy={dx:-2.8,dz:-4},By={id:Py,index:Cy,name:Ly,hint:Dy,shape:ky,radius:Iy,color:zy,owner:Fy,anchor:Uy,spawn:Ny,label:Oy},Hy="gait",Gy=7,Xy="侧后方步态",Vy="面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",Wy="circle",Yy=3.2,$y="#6fc9a0",Zy="v9s.15 历史固定工位",qy={x:-9.5,z:0},jy={dx:0,dz:2.6},Ky={dx:0,dz:-2.5},Jy={id:Hy,index:Gy,name:Xy,hint:Vy,shape:Wy,radius:Yy,color:$y,owner:Zy,anchor:qy,spawn:jy,label:Ky},Qy="hub",tM=1,eM="中央 8 向",nM="推杆走 8 个方向 · 松手看停步收相 / 转身踏步",iM="circle",aM=3.6,sM="#8fe7ff",oM="v9s.15 历史固定工位",rM={x:0,z:0},cM={dx:0,dz:0},lM={dx:0,dz:-3.1},hM={minCellX:-4,maxCellX:4,minCellZ:0,maxCellZ:6,density:1,clearMarginCells:2,absolute:!0},dM={id:Qy,index:tM,name:eM,hint:nM,shape:iM,radius:aM,color:sM,owner:oM,anchor:rM,spawn:cM,label:lM,grass:hM},uM="meter",fM=5,pM="进度弧",mM="弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",gM="circle",xM=3.2,vM="#b48cff",yM="v9s.15 历史固定工位",MM={x:-9.5,z:8.6},_M={dx:0,dz:2.8},bM={dx:0,dz:1.3},SM={id:uM,index:fM,name:pM,hint:mM,shape:gM,radius:xM,color:vM,owner:yM,anchor:MM,spawn:_M,label:bM},wM="rings",EM=2,TM="环状态色阶",AM="同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",RM="circle",PM=3.4,CM="#ffc85a",LM="v9s.15 历史固定工位",DM={x:-9.5,z:-8.2},kM={dx:0,dz:3},IM={dx:0,dz:-2.7},zM={id:wM,index:EM,name:TM,hint:AM,shape:RM,radius:PM,color:CM,owner:LM,anchor:DM,spawn:kM,label:IM},FM="sparring-demo",UM="陪练试验场",NM="动态拼合示范地块 · 点「生成 4 人」就地摆出假人 + 持械陪练，用完点「清除」回基线",OM=2,BM="#7fd8c0",HM="v9s.43 动态拼合示范（auto 地块，不写世界坐标，由 assemblePlots 自动分配槽位）",GM={label:"生成 4 人",dummies:2,modes:["idle","keep-distance"],fighters:2,ringRadius:1.5,startDeg:-90},XM={id:FM,name:UM,hint:NM,radius:OM,color:BM,owner:HM,testSpawn:GM},VM="terrain",WM=4,YM="地形 / 门洞",$M="宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",ZM="square",qM=5.2,jM="#7fb8d8",KM="v9s.15 历史固定工位",JM={x:8.9,z:-7.4},QM={dx:0,dz:4.6},t_={dx:0,dz:-4.5},e_={id:VM,index:WM,name:YM,hint:$M,shape:ZM,radius:qM,color:jM,owner:KM,anchor:JM,spawn:QM,label:t_},n_="windup",i_=3,a_="起手预警",s_="走进 1.6m：脚下红弧填满 = 命中帧",o_="circle",r_=3.2,c_="#ff5a4a",l_="v9s.15 历史固定工位",h_={x:0,z:-10},d_={dx:0,dz:3},u_={dx:0,dz:-2.6},f_={id:n_,index:i_,name:a_,hint:s_,shape:o_,radius:r_,color:c_,owner:l_,anchor:h_,spawn:d_,label:u_},p_="x-destructibles",m_="可破坏物件 · 斜切断口",g_="站高台打=高处断，平地打=低处断；切口朝挥刀方向斜切 · 瓶罐只断预设带",x_=2,v_="#e8a05c",y_="可破坏物件（auto 地块，只写相对偏移；id 不带版本代号，由合并闸门统一领号；排在 sparring-demo 之后不抢槽位）",M_=[{id:"pole-a",kind:"pole",dx:-1.25,dz:-1,height:2.4,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-b",kind:"pole",dx:0,dz:-1,height:2.8,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-c",kind:"pole",dx:1.25,dz:-1,height:2,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"jar-a",kind:"jar",dx:-.7,dz:-1.8,height:.9,radius:.28,tiltDeg:14,bands:[.35,.62],color:"#6f8fb8",cutColor:"#d8e4f0"},{id:"jar-b",kind:"jar",dx:.7,dz:-1.8,height:.8,radius:.26,tiltDeg:14,bands:[.4,.68],color:"#b87f6f",cutColor:"#f0d8c8"}],__={id:p_,name:m_,hint:g_,radius:x_,color:v_,owner:y_,destructibles:M_},b_={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!1,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,strafePeriod:5.2,strafeDuty:.34,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4,fighters:{weapons:["sword-shield","dual-swords","greatsword"],spawn:[{x:-3.6,z:3.8},{x:3.9,z:3.6},{x:.2,z:5.9}],initialModes:["spar","spar","spar"],moveSpeed:2.1,attackInterval:3.4,attackRangeScale:.9,knockbackScale:.6,leashRadius:7,comboCount:0,comboGap:0}},grass:{enabled:!0,footprintCells:2,minHeightCells:1,maxHeightCells:2,bendRadius:.85,maxBendRad:.95,bendRate:18,recoverRate:3.2,stumpRatio:.34,regrow:!0,regrowSec:6,bucketCells:4,wind:{enabled:!0,dirDeg:28,speed:1.35,amplitude:.19,wavelength:4.2,secondWave:{wavelength:1.7,amplitude:.055,speedScale:1.55},gust:{periodSec:7.5,depth:.35},jitter:.16,shadeAmount:.26}}},S_={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},grass:{minCellX:-12,maxCellX:12,minCellZ:4,maxCellZ:24,density:.72,bladesPerPatch:[3,6],avoidMargin:.45,seed:20261108}},w_={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132,dirFlipSec:.16,hipYawTrackRateDeg:240,hipYawBackRateDeg:150},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e",fighterColors:[{body:"#c85a4a",limb:"#8d3a30",head:"#f0c9a0"},{body:"#c9a03c",limb:"#8a6b22",head:"#f0d6a0"},{body:"#7d6ec4",limb:"#4f4488",head:"#e6d2b0"}]},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95},grass:{enabled:!0,bladeWidth:.13,segmentHeight:.5,palette:["#3f7d4f","#569a5c","#6fb56a","#8ccb78","#a9dc86"],stumpColor:"#6b7a48",maxInstances:6e3,debris:{max:220,life:.85,color:"#a9dc86"}}},E_={core:b_,scene:S_,view:w_};function Kh(n){return JSON.parse(JSON.stringify(n))}const Jh=E_,T_=Object.assign({"../config/plots/dash.json":By,"../config/plots/gait.json":Jy,"../config/plots/hub.json":dM,"../config/plots/meter.json":SM,"../config/plots/rings.json":zM,"../config/plots/sparring-demo.json":XM,"../config/plots/terrain.json":e_,"../config/plots/windup.json":f_,"../config/plots/x-destructibles.json":__}),A_=Object.values(T_).filter(n=>n&&typeof n.id=="string"&&n.id.length>0),R_=Op,Xi=ex(A_,R_),Lu=Xi.plots,P_=Kh(Jh.core),Us=Kh(Jh.scene),gn=Kh(Jh.view);Us.stations=Xi.stations;Us.grass&&(Us.grass.plots=Xi.grassPlots);Us.destructibles=Xi.destructibles;/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Ci{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),Ci.nextNameID=Ci.nextNameID||0,this.$name.id=`lil-gui-name-${++Ci.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class C_ extends Ci{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function ql(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const L_={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:ql,toHexString:ql},Fo={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},D_={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Fo.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Fo.toHexString(a)}},k_={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Fo.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Fo.toHexString(a)}},I_=[L_,Fo,D_,k_];function z_(n){return I_.find(t=>t.match(n))}class F_ extends Ci{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=z_(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=ql(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class $c extends Ci{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class U_ extends Ci{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let M=parseFloat(this.$input.value);isNaN(M)||(this._stepExplicit&&(M=this._snap(M)),this.setValue(this._clamp(M)))},i=M=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+M),this.$input.value=this.getValue())},a=M=>{M.key==="Enter"&&this.$input.blur(),M.code==="ArrowUp"&&(M.preventDefault(),i(this._step*this._arrowKeyMultiplier(M))),M.code==="ArrowDown"&&(M.preventDefault(),i(this._step*this._arrowKeyMultiplier(M)*-1))},s=M=>{this._inputFocused&&(M.preventDefault(),i(this._step*this._normalizeMouseWheel(M)))};let o=!1,r,l,c,h,f;const d=5,u=M=>{r=M.clientX,l=c=M.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",y)},m=M=>{if(o){const x=M.clientX-r,v=M.clientY-l;Math.abs(v)>d?(M.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>d&&y()}if(!o){const x=M.clientY-c;f-=x*this._step*this._arrowKeyMultiplier(M),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}c=M.clientY},y=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",y)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,M,x,v,w)=>(p-M)/(x-M)*(w-v)+v,e=p=>{const M=this.$slider.getBoundingClientRect();let x=t(p,M.left,M.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=p=>{if(o){const M=p.touches[0].clientX-r,x=p.touches[0].clientY-l;Math.abs(M)>Math.abs(x)?c(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),m=400;let y;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(y),y=setTimeout(u,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class N_ extends Ci{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class O_ extends Ci{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const B_=`.lil-gui {
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
}`;function H_(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Du=!1;class nc{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Du&&r&&(H_(B_),Du=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new N_(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new U_(this,t,e,i,a,s);case"boolean":return new C_(this,t,e);case"string":return new O_(this,t,e);case"function":return new $c(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new F_(this,t,e,i)}addFolder(t){const e=new nc({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof $c||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof $c)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function G_(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new nc({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new nc({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=bt=>{const Wt=s.addFolder(bt);return l.push(Wt),Wt},h=(bt,Wt)=>{const gt=bt.addFolder(Wt);return r.push(gt),gt},f=c("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=c("移动 / 输入"),m=h(u,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const y=h(u,"摇杆 / 输入");y.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),y.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=h(u,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const M=o.separation,x=h(u,"角色间分离 / 挤压阻力");x.add(M,"iterations",1,8,1).name("迭代次数"),x.add(M,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(M.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(M.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(M.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=c("动作 / 步态"),w=h(v,"程序化步态");w.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),w.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),w.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),w.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),w.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),w.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),w.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),w.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),w.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),w.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),w.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),w.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),w.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),w.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),w.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),w.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)"),w.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)"),w.add(t.gait,"dirFlipSec",0,.4,.01).name("换向融合时长 (s)"),w.add(t.gait,"hipYawTrackRateDeg",0,600,10).name("下盘目标转速上限 (°/s)"),w.add(t.gait,"hipYawBackRateDeg",0,600,10).name("└ 后退相位上限 (°/s)");const S=h(v,"停步 / 收相 / 惯性");S.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),S.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),S.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),S.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),S.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),S.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),S.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),S.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),S.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),S.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),S.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),S.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const E=h(v,"足部 IK"),T=t.ik;E.add(T,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),E.add(T,"weight",0,1,.01).name("钉地权重"),E.add(T,"attackScale",0,1,.01).name("攻击时权重倍率"),E.add(T,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const b=h(v,"惯性倾斜 / 盆骨"),_=t.lean;b.add(_,"accelGain",0,.1,.002).name("前后加速度增益"),b.add(_,"turnGain",0,.2,.005).name("绕圈侧倾增益"),b.add(_,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),b.add(_,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),b.add(_,"smoothing",1,30,1).name("倾斜平滑速率"),b.add(_,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),b.add(_,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),b.add(_,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),b.add(_,"crouchSmoothing",1,30,1).name("下沉平滑速率");const A=o.orientation,k=h(v,"朝向 / 接敌注视 / 原地转身");k.add(A,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),k.add(A,"headTurnRate",.5,40,.5).name("头部转向速率"),k.add(A,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),k.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),k.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),k.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const L=o.gaze;k.add(L,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),k.add(L,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),k.add(L,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),k.add(L,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),k.add(L,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),k.add(L,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),k.add(L,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),k.add(L,"headPitchRate",.5,20,.5).name("头部俯仰速率"),k.add(L,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),k.add(L,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),k.add(L,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const U=o.turnInPlace;k.add(U,"enabled").name("启用原地转身 (关=纯插值)"),k.add(U,"triggerDeg",20,180,5).name("触发夹角 (°)"),k.add(U,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),k.add(U,"settleDeg",0,60,1).name("转身保留余角 (°)"),k.add(U,"durationSec",.1,1.5,.02).name("转身时长 (s)"),k.add(U,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),k.add(U,"inputDeadZone",0,.5,.01).name("起步输入死区"),k.add(U,"armSec",0,.5,.01).name("触发防抖 (s)"),k.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("停步偏差消化窗口"),k.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),k.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),k.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),k.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),k.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const D=c("战斗 / 命中"),P=o.combat,O=h(D,"连击 / 武器时序"),B=O.add(n.combat,"weapon",ma).name("当前武器");O.add(P,"comboWindow",.1,2,.05).name("连击窗口 (s)"),O.add(P,"settle",0,.8,.01).name("段间停顿 (s)"),O.add(P,"attackMoveScale",0,1,.01).name("攻击时移动比例"),O.add(P,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),O.add(P,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),O.add(P,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),O.add(P,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),O.add(P,"cancelWindow",0,1,.01).name("取消窗口 (s)"),O.add(P,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),O.add(P,"autoCombo").name("按住自动连击"),O.add(P.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),O.add(P.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),O.add(P.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),O.add(P.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率"),O.add(P.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),O.add(P.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),O.add(P.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),O.add(P.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),O.add(P.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),O.add(P.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),O.add(P.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),O.add(P.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),O.add(P.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度");const W=o.abilities;O.add(W.arcane,"perWave",1,8,1).name("每波飞弹数"),O.add(W.arcane,"waves",1,12,1).name("每次引导波数"),O.add(W.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),O.add(W.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),O.add(W.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),O.add(W.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),O.add(W.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),O.add(W.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),O.add(W.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),O.add(W.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),O.add(W.arcane,"speed",3,24,.5).name("飞弹速度"),O.add(W.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),O.add(W.ring,"radius",.5,5,.1).name("电环半径"),O.add(W.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),O.add(W.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const et=o.hits.hitstopWarp;if(et){const bt=h(D,"卡肉节奏（接触瓦片）");bt.add(et,"enabled").name("瓦片开（关=硬冻结）"),bt.add(et,"holdRate",0,.4,.01).name("保持期速率"),bt.add(et,"release",.005,.2,.005).name("释放时长 (s)"),bt.add(et,"payback",1,2.5,.05).name("偿还倍率"),bt.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),bt.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),bt.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const lt=o.hits,pt=h(D,"命中 / 受击 / 击退");pt.add(lt,"arcDeg",10,120,5).name("命中扇区半角 (°)"),pt.add(lt,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),pt.add(lt,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),pt.add(lt,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),pt.add(lt.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),pt.add(lt.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),pt.add(lt,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),pt.add(lt,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Pt={get enabled(){return!lt.noDamageToPlayer},set enabled(bt){lt.noDamageToPlayer=!bt}};pt.add(Pt,"enabled").name("玩家受击击退");const Y=h(D,"受击分层"),nt=t.hurt;Y.add(nt,"enabled").name("启用分层受击 (关=旧版对照)"),Y.add(nt,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Y.add(nt,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Y.add(nt,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Y.add(nt,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Y.add(nt,"upperShiftScale",0,1,.01).name("上身位移缩放"),Y.add(nt,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Y.add(nt.hitHeight,"light",0,1,.01).name("轻击命中部位"),Y.add(nt.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Y.add(nt.hitHeight,"knock",0,1,.01).name("击退命中部位"),Y.add(nt,"leanLight",0,1.5,.01).name("轻击力度"),Y.add(nt,"leanHeavy",0,1.5,.01).name("重击力度"),Y.add(nt,"leanKnock",0,1.5,.01).name("击退力度"),Y.add(nt,"flashStrength",0,2,.05).name("受击闪光强度");for(const{name:bt,p:Wt}of[{name:"打腹 (abdomen)",p:nt.abdomen},{name:"打肩 (shoulder)",p:nt.shoulder}]){const gt=h(Y,bt);gt.add(Wt,"upperPitch",0,2,.01).name("上身前后倾斜"),gt.add(Wt,"upperRoll",0,2,.01).name("上身侧倾"),gt.add(Wt,"upperYaw",0,1.5,.01).name("肩部扭转"),gt.add(Wt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),gt.add(Wt,"shift",0,.8,.01).name("身体反应位移"),gt.add(Wt,"drop",0,.4,.01).name("整体下沉"),gt.add(Wt,"back",0,.4,.01).name("屁股向后"),gt.add(Wt,"knee",0,1.6,.01).name("屈膝"),gt.add(Wt,"hip",0,1,.01).name("髋前倾"),gt.add(Wt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)")}const ut=h(D,"派生招"),st=o.links;ut.add(st,"enabled").name("总开关 (false=旧连击)"),ut.add(st.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),ut.add(st.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),ut.add(st.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),ut.add(st,"sharedCooldown",0,3,.05).name("共享 CD (s)"),ut.add(st,"triggerWhileSprinting").name("长跑中可直接触发"),ut.add(st.search,"range",1,14,.1).name("索敌距离 (m)"),ut.add(st.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),ut.add(st.search,"stopDistance",0,3,.05).name("停住距离 (m)");const tt=st.moves["sword-shield"];tt&&(ut.add(tt,"enabled").name("剑盾盾击"),ut.add(tt,"distance",0,8,.1).name("冲锋极限 (m)"),ut.add(tt,"windup",0,.5,.01).name("前摇 (s)"),ut.add(tt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),ut.add(tt,"recovery",0,.8,.01).name("收势 (s)"),ut.add(tt.hit,"radius",0,4,.05).name("命中半径 (m)"),ut.add(tt.hit,"width",0,2,.05).name("扫掠半径 (m)"),ut.add(tt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),ut.add(tt.hit,"duration",0,1.5,.01).name("僵直 (s)"));const dt=o.targeting,Ut=h(D,"目标辅助");Ut.add(dt,"targetAssist").name("启用目标辅助"),Ut.add(dt,"range",1,14,.5).name("锁定范围 (m)"),Ut.add(dt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Ut.add(dt,"frontBias",0,4,.1).name("朝向加权"),Ut.add(dt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Ut.add(dt,"maxLungeScale",1,3,.1).name("前冲最大放大");const Vt=c("表现 / 特效"),ht=h(Vt,"挥击幅度 / 刀光"),X=t.animation.swing;ht.add(X,"enabled").name("挥击身体幅度 开"),ht.add(X,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),ht.add(X,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),ht.add(X,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),ht.add(X,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),ht.add(X,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),ht.add(X,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),ht.add(X,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),ht.add(X.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const N=t.weaponTrail;ht.add(N,"enabled").name("挥击刀光 开"),ht.add(N,"life",.04,.4,.01).name("刀光残留 (s)"),ht.add(N,"intensity",0,1.5,.05).name("刀光亮度"),ht.add(N,"minStep",.005,.1,.005).name("采样最小位移 (m)"),ht.add(t.hitstop,"enabled").name("命中卡肉 / 震屏");const At=h(Vt,"夸张化 / 四肢伸缩"),Rt=t.animation.stretch;At.add(Rt,"enabled").name("四肢伸缩 开"),At.add(Rt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),At.add(Rt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),At.add(Rt,"impactSquash",0,.5,.01).name("命中挤压量"),At.add(Rt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),At.add(Rt,"torsoGain",0,1,.05).name("躯干跟随比例"),At.add(Rt,"volumeExp",0,1.5,.05).name("体积补偿指数");const St=h(Vt,"武器握持 / 腕部"),vt=t.weaponWrist;St.add(vt,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),St.add(vt,"lag",0,.08,.002).name("臂速 → 腕滞后"),St.add(vt,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),St.add(vt,"rate",4,50,1).name("腕部跟随速率 (1/s)"),St.add(vt,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),St.add(vt,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const mt=t.weaponMount;St.add(mt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),St.add(mt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),St.add(mt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),St.add(mt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),St.add(mt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),St.add(mt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),St.add(mt,"swordPitchDeg",0,90,1).name("剑前倾角"),St.add(mt,"swordYawDeg",0,45,1).name("剑外张角"),St.add(mt,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),St.add(mt,"staffPitchDeg",0,60,1).name("法杖前倾角");const kt=c("假人 / 混战"),F=o.dummies,R=h(kt,"普通假人 AI");R.add(F,"moveSpeed",.5,8,.1).name("移动速度"),R.add(F,"wanderRadius",.5,8,.1).name("游走半径"),R.add(F,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),R.add(F,"followStopDistance",.3,5,.1).name("跟随停距"),R.add(F,"keepDistance",1,10,.1).name("保持距离"),R.add(F,"keepDeadZone",.1,2,.05).name("保持死区"),R.add(F,"attackRange",.5,5,.1).name("攻击距离"),R.add(F,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),R.add(F,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const K=F.fighters;if(K){const bt=h(kt,"持械陪练（剑盾 / 双刀 / 大剑）");bt.add(K,"moveSpeed",.5,6,.1).name("移动速度"),bt.add(K,"attackInterval",.5,8,.1).name("攻击间隔 (s)"),bt.add(K,"attackRangeScale",.5,1.2,.02).name("起手距离 / 武器 reach"),bt.add(K,"knockbackScale",0,2,.05).name("击退比例"),bt.add(K,"leashRadius",0,14,.5).name("牵引半径 (m)"),bt.add(K,"comboCount",0,3,1).name("连击段数 (0=随武器)"),bt.add(K,"comboGap",0,.6,.01).name("段间缝隙 (s, 0=用全局)");const Wt=()=>n.dummies.find(Lt=>Lt.weapon!==null),gt={get mode(){var Lt;return((Lt=Wt())==null?void 0:Lt.mode)??"spar"},set mode(Lt){i.setFighterMode(Lt)}};bt.add(gt,"mode",Ep).name("陪练行为（全部）")}const ft=c("相机"),V=h(ft,"基础");V.add(t.camera,"pitchDeg",20,80,1).name("俯角"),V.add(t.camera,"yawDeg",-180,180,1).name("方位角"),V.add(t.camera,"distance",6,35,.5).name("距离"),V.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),V.add(t.camera,"fov",25,90,1).name("FOV");const ot=o.camera,zt=h(ft,"智能构图");zt.add(ot,"radius",2,18,.5).name("威胁评估半径 (m)"),zt.add(ot,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),zt.add(ot,"saturation",.5,8,.1).name("威胁归一化饱和"),zt.add(ot,"pushIn",0,.5,.01).name("无威胁推进比例"),zt.add(ot,"maxPullback",0,1,.02).name("最大拉远比例"),zt.add(ot,"maxOffset",0,6,.1).name("最大构图平移 (m)"),zt.add(ot,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),zt.add(ot,"framingBias",0,1,.05).name("威胁质心平移系数"),zt.add(ot,"attackBoost",0,2,.05).name("挥砍中额外加权"),zt.add(ot.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),zt.add(ot.modeWeight,"spar",0,3,.05).name("陪练模式威胁倍率"),zt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Et=h(ft,"缩放");return Et.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),Et.add(t.zoom,"max",1,4,.05).name("最大拉远上限"),Et.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),Et.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),Et.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),Et.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),Et.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),Et.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(bt=>bt.close()),l.forEach(bt=>bt.close()),s.close(),{gui:s,refreshWeapon:()=>B.updateDisplay()}}function X_(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function V_(n,t){return n.find(e=>e.id===t)??null}function ku(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function W_({stations:n,plots:t=[],world:e,view:i,container:a,onResetZoom:s,onPlotTest:o,onClearTestUnits:r}){var T;const l=a??document.getElementById("lab-panel");let c=null,h=null;const f=new Map,d=document.createElement("div");d.id="lab-toast",d.setAttribute("aria-live","polite"),document.body.appendChild(d);let u=0;function m(b){d.textContent=`${b.index} · ${b.name} — ${b.hint}`,d.style.borderColor=b.color,d.classList.add("is-on"),window.clearTimeout(u),u=window.setTimeout(()=>d.classList.remove("is-on"),5e3)}function y(){return X_(n,e.character.position.x,e.character.position.z)}function g(){const b=y(),_=(b==null?void 0:b.id)??null;if(_===c)return;const A=c!==null;c=_;for(const[k,L]of f)L.classList.toggle("is-active",k===_);h&&(h.textContent=b?`${b.index} · ${b.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",h.style.color=b?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),b?m(b):A&&d.classList.remove("is-on")}function p(b){const _=typeof b=="number"?n.find(A=>A.index===b)??null:V_(n,b);return _?(jx(e,_.spawnX,_.spawnZ),e.camera.centroidX=_.spawnX,e.camera.centroidZ=_.spawnZ,i.snapCamera(_.spawnX,e.character.position.y,_.spawnZ),g(),!0):!1}function M(){jp(e)}function x(b){return p(b.id),o?o(b):0}function v(){return r?r():0}function w(b){const _=typeof b=="number"?t.find(A=>A.index===b):t.find(A=>A.id===b);return _&&_.testSpawn?x(_):0}const S=t.filter(b=>b.testSpawn),E=b=>{var _,A;return(((_=b.testSpawn)==null?void 0:_.dummies)??0)+(((A=b.testSpawn)==null?void 0:A.fighters)??0)};if(l){l.textContent="";const b=document.createElement("div");b.className="lab-head",b.textContent="测试工位";const _=document.createElement("span");_.className="lab-tip",_.textContent="[ / ] 切换",b.appendChild(_),l.appendChild(b);for(const L of[...n].sort((U,D)=>U.index-D.index)){const U=document.createElement("button");U.type="button",U.className="lab-row",U.dataset.station=L.id,U.dataset.uiButton="",U.style.setProperty("--lab-color",L.color),U.setAttribute("aria-label",`传送到工位 ${L.index}：${L.name}`);const D=document.createElement("span");D.className="lab-idx",D.textContent=String(L.index);const P=document.createElement("span");P.className="lab-name",P.textContent=L.name,U.append(D,P),U.addEventListener("pointerdown",O=>{O.preventDefault(),O.stopPropagation(),p(L.id)}),l.appendChild(U),f.set(L.id,U)}if(h=document.createElement("div"),h.className="lab-hint",l.appendChild(h),S.length>0){const L=document.createElement("div");L.className="lab-head lab-subhead",L.textContent="地块测试";const U=document.createElement("span");U.className="lab-tip",U.textContent="就地生成",L.appendChild(U),l.appendChild(L);for(const D of S){const P=document.createElement("div");P.className="lab-row lab-test-row",P.dataset.plot=D.id;const O=document.createElement("span");O.className="lab-name",O.textContent=D.name;const B=document.createElement("button");B.type="button",B.className="lab-btn lab-test",B.dataset.uiButton="",B.dataset.plotTest=D.id,B.textContent=((T=D.testSpawn)==null?void 0:T.label)??`生成 ${E(D)} 人`,B.setAttribute("aria-label",`在${D.name}就地生成 ${E(D)} 个测试单位`),B.addEventListener("pointerdown",W=>{W.preventDefault(),W.stopPropagation(),x(D)}),P.append(O,B),l.appendChild(P)}}const A=document.createElement("div");A.className="lab-foot";const k=document.createElement("button");if(k.type="button",k.className="lab-btn",k.dataset.uiButton="",k.textContent="召回假人",k.setAttribute("aria-label","召回全部假人回到各自工位"),k.addEventListener("pointerdown",L=>{L.preventDefault(),L.stopPropagation(),M()}),A.appendChild(k),S.length>0){const L=document.createElement("button");L.type="button",L.className="lab-btn",L.dataset.uiButton="",L.dataset.clearTestUnits="",L.textContent="清除测试单位",L.setAttribute("aria-label","清除所有由地块测试按钮生成的假人与陪练"),L.addEventListener("pointerdown",U=>{U.preventDefault(),U.stopPropagation(),v()}),A.appendChild(L)}if(s){const L=document.createElement("button");L.type="button",L.className="lab-btn",L.dataset.uiButton="",L.textContent="镜头归位",L.setAttribute("aria-label","把镜头缩放恢复到默认"),L.addEventListener("pointerdown",U=>{U.preventDefault(),U.stopPropagation(),s()}),A.appendChild(L)}l.appendChild(A)}return window.addEventListener("keydown",b=>{var _,A;if(!(b.metaKey||b.ctrlKey||b.altKey))if(b.key==="["){const k=ku(n,((_=y())==null?void 0:_.id)??c,-1);k&&p(k.id)}else if(b.key==="]"){const k=ku(n,((A=y())==null?void 0:A.id)??c,1);k&&p(k.id)}else b.key==="\\"&&M()}),g(),{goto:p,current:y,tick:g,recall:M,spawnAt:w,clearSpawned:v,element:l}}const Zc=Math.PI*2,bi={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},Y_=45,$_=50;function Z_(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function oo(n,t,e){const i=Z_(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function q_(n,t){return Math.atan2(n,-t)*180/Math.PI}function Iu(n,t){return Math.abs(((n-t)%360+540)%360-180)}function er(n){return(n%360+360)%360}const j_={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function K_(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),h=o>.001?oo(s.moveX,s.moveZ,e):null,f=c>.15?oo(l.x,l.z,e):null,d=oo(Math.sin(a.facing),Math.cos(a.facing),e),u=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?oo(s.aimX,s.aimZ,e):null,m=n.targeting,y=m.hasTarget?oo(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=h!==null&&f!==null?Iu(h,f):null,p=h!==null?Iu(h,d):null,M=g!==null&&g>Y_&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?q_(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:c,faceDeg:d,lockDeg:y,lockId:m.targetId,lockDist:m.targetDist,aimDeg:u,gapMove:g,gapFace:p,warnMove:M}}function zu(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>$_&&(n.inLen>=.35||n.speed>=.4)}const Fu="harness.dirDebug";function J_(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(Fu)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function h(x){if(l=x,!t)try{window.localStorage.setItem(Fu,x?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&h(!l)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*f),a.height=Math.round(d*f);let u=j_,m=0,y="",g=8;function p(x){if(!r)return;const v=d,w=d,S=v/2,E=w/2,T=Math.min(v,w)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,v,w),r.beginPath(),r.arc(S,E,T,0,Zc),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":bi.ring,r.stroke(),r.strokeStyle=bi.grid,r.beginPath(),r.moveTo(S-T,E),r.lineTo(S+T,E),r.moveTo(S,E-T),r.lineTo(S,E+T),r.stroke();for(let k=0;k<8;k++){const L=k*Math.PI/4,U=S+Math.sin(L)*(T-3),D=E-Math.cos(L)*(T-3),P=S+Math.sin(L)*T,O=E-Math.cos(L)*T;r.beginPath(),r.moveTo(U,D),r.lineTo(P,O),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=bi.dead,r.beginPath(),r.arc(S,E,T*b,0,Zc),r.stroke(),r.restore());const _=(k,L,U,D,P=!1,O=1)=>{const B=k*Math.PI/180,W=Math.sin(B),et=-Math.cos(B),lt=T*Math.max(.14,Math.min(1,L)),pt=S+W*T*.14,Pt=E+et*T*.14,Y=S+W*lt,nt=E+et*lt;if(r.save(),r.globalAlpha=O,r.strokeStyle=U,r.fillStyle=U,r.lineWidth=D,r.lineCap="round",P&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(pt,Pt),r.lineTo(Y,nt),r.stroke(),!P&&lt>T*.3){const ut=-et,st=W,tt=5.2;r.beginPath(),r.moveTo(Y+W*1.5,nt+et*1.5),r.lineTo(Y-W*tt+ut*tt*.72,nt-et*tt+st*tt*.72),r.lineTo(Y-W*tt-ut*tt*.72,nt-et*tt-st*tt*.72),r.closePath(),r.fill()}r.restore()},A=(k,L)=>{const U=k*Math.PI/180,D=Math.sin(U),P=-Math.cos(U),O=-P,B=D,W=T+1.5,et=W+6.5;r.save(),r.fillStyle=L,r.strokeStyle=L,r.lineWidth=1,r.beginPath(),r.moveTo(S+D*et,E+P*et),r.lineTo(S+D*W+O*4,E+P*W+B*4),r.lineTo(S+D*W-O*4,E+P*W-B*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&_(x.lockDeg,1,bi.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&_(x.rawDeg,x.rawLen,bi.raw,1,!0,.9),x.aimDeg!==null&&_(x.aimDeg,1,bi.aim,1.6,!0,.95),_(x.faceDeg,1,bi.face,1.1,!0,.55),x.moveDeg!==null&&_(x.moveDeg,x.speed/Math.max(1,g),bi.move,5.5,!1,.8),x.inDeg!==null&&_(x.inDeg,x.inLen,bi.input,2.2),A(x.faceDeg,bi.face),r.beginPath(),r.arc(S,E,2.2,0,Zc),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function M(x,v){const w=T=>T===null?"-":String(Math.round(er(T)));o.in.textContent=`入 ${w(x.inDeg)}`,o.mv.textContent=`移 ${w(x.moveDeg)}`,o.fc.textContent=`面 ${w(x.faceDeg)}`;const S=T=>T===null?"-":`${Math.round(T)}°`,E=[`Δ入→移 ${S(x.gapMove)}`,`Δ入→面 ${S(x.gapFace)}`];x.speed>.05&&E.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&E.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&E.push("拖拽瞄准"),o.gap.textContent=E.join("  "),e.classList.toggle("is-warn",x.warnMove||zu(x,v))}return{update(x,v,w){if(!l)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const S=K_(x,v,w,g);u=S;const E=x.combat.phase!=="idle";p(S);const T=performance.now(),b=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(T-m>90||b!==y)&&(m=T,y=b,M(S,E),e.dataset.in=S.inDeg===null?"":er(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":er(S.moveDeg).toFixed(1),e.dataset.fc=er(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||zu(S,E)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>u}}const Q_=6,tb=480,Uu=240,Nu=128,eb=18,nb=.05,Ou=.16,ib=.02;function Bu(n,t,e){if(!e)return"air";if(t<nb)return"both";const i=Math.sin(n);return i>Ou?"L":i<-Ou?"R":"both"}function Hu(n){const t=Math.PI*2;return(n%t+t)%t}function Gu(n,t){const e=Math.PI*2;let i=t-n;return i-=Math.round(i/e)*e,n+i}const Xu={L:"#fbbf24",R:"#a78bfa",both:"rgba(148, 163, 184, 0.85)",air:"#38bdf8"},ab={L:"rgba(251, 191, 36, 0.13)",R:"rgba(167, 139, 250, 0.13)",both:"rgba(148, 163, 184, 0.09)",air:"rgba(56, 189, 248, 0.07)"},sb={L:"左踩",R:"右踩",both:"双踩",air:"腾空"};function ob(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1,phase:0,stance:"both",grounded:!0,moving:!1}}function rb(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function cb(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function lb(n={}){const t=Math.max(1,n.windowS??Q_),e=Math.max(60,n.capacity??tb),i=Math.max(1,n.speedCap??eb),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv / 相位</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="128"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),f=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(Uu*u),l.height=Math.round(Nu*u);const m=J_({deadZone:n.deadZone,container:f,embedded:!0});let y=!1;function g(_){y=_,s.classList.toggle("is-off",!_),!a&&r&&(r.textContent=_?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(_)),r.setAttribute("aria-label",_?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",_=>{_.preventDefault(),_.stopPropagation(),g(!y)}),window.addEventListener("keydown",_=>{_.key.toLowerCase()==="v"&&!_.metaKey&&!_.ctrlKey&&g(!y)}));const p=[];let M=0,x=null,v=0,w=!1,S=-1,E={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1,phase:0,stance:"both"};function T(_){const A=_-t;let k=0;for(;k<p.length&&p[k].t<A;)k++;return p.slice(k)}function b(_,A){if(!d)return;const k=Uu,L=Nu;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,k,L),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,k,L);const U=4,D=4,P=k-U-D,O=9,B=44,W=58,et=20,lt=84,pt=38,Pt=A-t,Y=ht=>U+Math.max(0,Math.min(1,(ht-Pt)/t))*P;for(let ht=0;ht<_.length;ht++){if(!_[ht].busy)continue;const X=Y(_[ht].t),N=ht+1<_.length?Y(_[ht+1].t):X+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(X,O,Math.max(2,N-X),B)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const ht of[O,O+B/2,O+B])d.moveTo(U,ht),d.lineTo(k-D,ht);d.moveTo(U,W+et/2),d.lineTo(k-D,W+et/2);for(const ht of[lt,lt+pt/2,lt+pt])d.moveTo(U,ht),d.lineTo(k-D,ht);d.stroke();const ut=Math.max(1,..._.map(ht=>ht.speed),..._.map(ht=>ht.drive))*1.15,st=ht=>O+B-ht/ut*B;if(_.length>1){d.beginPath(),d.moveTo(Y(_[0].t),st(_[0].speed));for(let ht=1;ht<_.length;ht++)d.lineTo(Y(_[ht].t),st(_[ht].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(Y(_[_.length-1].t),O+B),d.lineTo(Y(_[0].t),O+B),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(Y(_[0].t),st(_[0].drive));for(let ht=1;ht<_.length;ht++)d.lineTo(Y(_[ht].t),st(_[ht].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let tt=.02;for(const ht of _)tt=Math.max(tt,Math.abs(ht.dv));tt*=1.1;const dt=W+et/2,Ut=et/2;for(const ht of _){const X=Math.min(Ut,Math.abs(ht.dv)/tt*Ut);d.fillStyle=ht.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(Y(ht.t)-.7,ht.dv>=0?dt-X:dt,1.4,Math.max(.5,X))}const Vt=ht=>lt+pt/2-ht*(pt/2-1);for(let ht=0;ht<_.length;ht++){const X=_[ht].stance;if(X==="air")continue;const N=Y(_[ht].t),At=ht+1<_.length?Y(_[ht+1].t):N+2;d.fillStyle=ab[X],d.fillRect(N,lt,Math.max(1,At-N),pt)}if(_.length>1){let ht=Y(_[0].t),X=Vt(Math.sin(_[0].phase));for(let At=1;At<_.length;At++){const Rt=_[At-1],St=_[At],vt=Y(Rt.t),mt=Y(St.t),kt=Gu(Rt.phase,St.phase),F=Math.max(1,Math.min(16,Math.round((mt-vt)/2)));for(let R=1;R<=F;R++){const K=R/F,ft=Rt.phase+(kt-Rt.phase)*K,V=vt+(mt-vt)*K,ot=Vt(Math.sin(ft)),zt=R===F?St.stance:Bu(ft,Rt.moving?1:0,Rt.grounded);d.beginPath(),d.moveTo(ht,X),d.lineTo(V,ot),d.strokeStyle=Xu[zt],d.lineWidth=1.7,d.lineJoin="round",d.stroke(),ht=V,X=ot}}const N=_[_.length-1];d.beginPath(),d.arc(Y(N.t)-1.5,Vt(Math.sin(N.phase)),2.1,0,Math.PI*2),d.fillStyle=Xu[N.stance],d.fill()}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(ut.toFixed(1),U+2,O+8),d.fillText("v",U+2,O+B-2),d.fillText("Δv",U+2,W+9),d.fillStyle="rgba(251, 191, 36, 0.75)",d.fillText("L",U+2,lt+8),d.fillStyle="rgba(167, 139, 250, 0.75)",d.fillText("R",U+2,lt+pt-2),d.textAlign="right",d.fillStyle="rgba(190, 214, 234, 0.55)",d.fillText("0",k-D-2,O+B-2),d.textAlign="left"}return{dirDebug:m,update(_,A,k){var Y;const L=performance.now()/1e3,U=S<0?1/60:Math.max(1e-4,Math.min(.25,L-S));S=L;const D=_.character,P={x:D.position.x,z:D.position.z},O=Math.hypot(D.velocity.x,D.velocity.z),{speed:B,raw:W}=x?rb(x,P,U,i):{speed:0,raw:0},et=ob(M,B,U,L);et.drive=O,et.raw=W,et.busy=cb(_);const lt=((Y=n.phaseSource)==null?void 0:Y.call(n))??D.gaitPhase;et.phase=lt,et.grounded=D.grounded,et.moving=w&&Math.abs(Gu(v,lt)-v)>ib,v=lt,w=!0,et.stance=Bu(lt,et.moving?1:0,D.grounded),x=P,M=B,p.push(et),p.length>e&&p.shift();const pt=T(L);let Pt=0;for(const nt of pt)Pt=Math.max(Pt,nt.speed);if(E={speed:B,drive:O,raw:W,dv:et.dv,accel:et.accel,peak:Pt,samples:pt.length,windowS:t,busy:et.busy,phase:Hu(lt),stance:et.stance},m.update(_,A,k),y){b(pt,L);const nt=et.dv>=0?"+":"";c.textContent=`v ${B.toFixed(2)} · 驱 ${O.toFixed(2)} · 峰 ${Pt.toFixed(2)} · Δv ${nt}${et.dv.toFixed(3)} · ${pt.length} 帧
φ ${Hu(lt).toFixed(2)} · ${sb[et.stance]}`}},setEnabled:g,toggle(){return g(!y),y},enabled:()=>y,last:()=>({...E}),samples:()=>T(performance.now()/1e3).map(_=>({..._}))}}const hb=["剑盾","双剑","大剑","法杖","弓"],db={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击",spar:"陪练"};function ub(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,h=l.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=ht=>ht.toFixed(2),m=ht=>(ht*180/Math.PI).toFixed(0),y=hb[ma.indexOf(f.weapon)]??f.weapon,g=Math.round(f.charge*10),p="|".repeat(g)+".".repeat(10-g),M=t.dash,x=M.phase==="active"&&M.duration>0?(1-M.timer/M.duration)*100:0,v=M.phase==="active"?`${M.kind}@${x.toFixed(0)}%`:`${M.kind} cd${u(M.cooldown)}`,w=a.intents.aimActive?`(${u(a.intents.aimX)},${u(a.intents.aimZ)})`:"-",S=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),E=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),T=Math.abs(S)+Math.abs(E)+1e-6,b=Math.round(Math.abs(E)/T*100),_=`strafe ${b}%${S<-.05?" back":""}`,A=t.camera,k=`threat ${(A.threat*100).toFixed(0)}%  dist×${u(A.distanceScale)}  off (${u(A.offsetX)},${u(A.offsetZ)})  pitch +${u(A.pitchDelta)}°  n=${A.threatCount}`,L=o?u(o.attackBlend):"-",U=o==null?void 0:o.attackWeights,D=U?`gw ${u(U.gaitScale)}  lw ${u(U.attackLegWeight)}  spd ${u(U.driveSpeed)}`:"-",P=U?`${u(U.gaitScale)}/${u(U.attackLegWeight)}`:"-",O=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",B=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",W=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",et=o==null?void 0:o.hurt,lt=et?`hurt ${t.playerHurt.type}  部位h${u(et.hitHeight)}  脉冲p${u(et.pulse)}  上身${u(et.upperShift)}  重心${u(et.comShift)}  后坐${u(et.pelvisBack)}  屈膝${u(et.knee)}`:"-",pt=et?`${u(et.hitHeight)}/${u(et.pulse)}/${u(et.knee)}`:"-",Pt=o==null?void 0:o.ik,Y=Pt?`${Pt.active?"on":"off"} w${u(Pt.weight)} e${u(Pt.maxError)}`:"-",nt=t.playerLink,ut=`link ${nt.kind||"-"}  ${nt.phase}  prog ${u(nt.progress)}  win ${u(nt.linkWindow)}s  cd ${u(nt.cooldown)}s  hits ${nt.hitIds.length}  travel ${u(nt.travelled)}/${u(nt.travel)}m  id ${nt.id}`,st=`${nt.phase}/${nt.kind||"-"}/w${u(nt.linkWindow)}`,tt=a.lastGesture,dt=tt?`${tt.button} ${tt.kind} ${tt.heldMs.toFixed(0)}ms d${tt.distance.toFixed(0)}px ${tt.angleDeg.toFixed(0)}° taps${tt.taps}`:"-",Ut=t.dummies.map(ht=>`${ht.id}:${db[ht.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${y} ${f.phase} · lk ${nt.phase}${nt.kind?`/${nt.kind}`:""} w${u(nt.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(c.x)},${u(c.y)},${u(c.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  st${b}%  stick(${u(a.stickX)},${u(a.stickY)}) ${a.source}  str${u(l.stride)}`,`weapon ${y}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${v}  ab ${L}  gw/lw ${P}  land ${B}  ik ${Y}`,`aim ${w}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${pt}`,`dummies ${Ut}  atkCount ${t.dummyAttackCount}  cam ${(A.threat*100).toFixed(0)}% ×${u(A.distanceScale)}  ${W}  lk ${st}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(s.timeScale)}${s.paused?" [P]":""}  g ${dt}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(c.x)}, ${u(c.y)}, ${u(c.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${m(l.facing)}deg   atkBlend ${L}   ${D}   land ${O}`,lt,`ik ${Y}  clamped ${Pt?Pt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  (head-body ${m(l.headYaw-l.bodyYaw)})  ${_}`,`move (${u(a.intents.moveX)}, ${u(a.intents.moveZ)})  stick (${u(a.stickX)}, ${u(a.stickY)})  ${a.source}  aim ${w}`,`weapon ${y}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${M.kind}  phase ${M.phase}  prog ${x.toFixed(0)}%  cd ${u(M.cooldown)}s  id ${M.id}  from (${u(M.fromX)},${u(M.fromZ)}) → to (${u(M.toX)},${u(M.toZ)})`,ut,`camera ${k}  ${W}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Ut}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${dt}`].join(`
`)}}}const nr=["lab","hud","motion","debug"],Vu={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Wu={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function fb(n){var l;const t=Object.fromEntries(nr.map(c=>[c,document.getElementById(Wu[c].toggle)])),e=Object.fromEntries(nr.map(c=>[c,document.getElementById(Wu[c].panel)]));let i={},a=null;function s(){var c,h,f;for(const d of nr){const u=a===d,m=t[d],y=e[d];m&&(m.setAttribute("aria-expanded",String(u)),m.textContent=`${Vu[d].short} ${u?"▾":"▸"}`,m.setAttribute("aria-label",`${u?"收起":"展开"}${Vu[d].full}`)),y&&y.classList.toggle("is-open",u)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of nr)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Qh="170",pb=0,Yu=1,mb=2,gm=1,xm=2,Gi=3,ga=0,Gn=1,Ke=2,ua=0,Rs=1,Vi=2,$u=3,Zu=4,gb=5,Ua=100,xb=101,vb=102,yb=103,Mb=104,_b=200,bb=201,Sb=202,wb=203,jl=204,Kl=205,Eb=206,Tb=207,Ab=208,Rb=209,Pb=210,Cb=211,Lb=212,Db=213,kb=214,Jl=0,Ql=1,th=2,Ns=3,eh=4,nh=5,ih=6,ah=7,td=0,Ib=1,zb=2,fa=0,Fb=1,Ub=2,Nb=3,Ob=4,Bb=5,Hb=6,Gb=7,vm=300,Os=301,Bs=302,sh=303,oh=304,gc=306,rh=1e3,Ba=1001,ch=1002,Jn=1003,Xb=1004,ir=1005,Ri=1006,qc=1007,Ha=1008,Zi=1009,ym=1010,Mm=1011,Uo=1012,ed=1013,Va=1014,Pi=1015,Vo=1016,nd=1017,id=1018,Hs=1020,_m=35902,bm=1021,Sm=1022,gi=1023,wm=1024,Em=1025,Ps=1026,Gs=1027,ad=1028,sd=1029,Tm=1030,od=1031,rd=1033,Nr=33776,Or=33777,Br=33778,Hr=33779,lh=35840,hh=35841,dh=35842,uh=35843,fh=36196,ph=37492,mh=37496,gh=37808,xh=37809,vh=37810,yh=37811,Mh=37812,_h=37813,bh=37814,Sh=37815,wh=37816,Eh=37817,Th=37818,Ah=37819,Rh=37820,Ph=37821,Gr=36492,Ch=36494,Lh=36495,Am=36283,Dh=36284,kh=36285,Ih=36286,Vb=3200,Wb=3201,Rm=0,Yb=1,oa="",Nn="srgb",Vs="srgb-linear",xc="linear",Be="srgb",as=7680,qu=519,$b=512,Zb=513,qb=514,Pm=515,jb=516,Kb=517,Jb=518,Qb=519,zh=35044,Eo=35048,ju="300 es",Yi=2e3,ic=2001;class Ws{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const Tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ku=1234567;const Cs=Math.PI/180,No=180/Math.PI;function Li(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Tn[n&255]+Tn[n>>8&255]+Tn[n>>16&255]+Tn[n>>24&255]+"-"+Tn[t&255]+Tn[t>>8&255]+"-"+Tn[t>>16&15|64]+Tn[t>>24&255]+"-"+Tn[e&63|128]+Tn[e>>8&255]+"-"+Tn[e>>16&255]+Tn[e>>24&255]+Tn[i&255]+Tn[i>>8&255]+Tn[i>>16&255]+Tn[i>>24&255]).toLowerCase()}function wn(n,t,e){return Math.max(t,Math.min(e,n))}function cd(n,t){return(n%t+t)%t}function t1(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function e1(n,t,e){return n!==t?(e-n)/(t-n):0}function To(n,t,e){return(1-e)*n+e*t}function n1(n,t,e,i){return To(n,t,1-Math.exp(-e*i))}function i1(n,t=1){return t-Math.abs(cd(n,t*2)-t)}function a1(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function s1(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function o1(n,t){return n+Math.floor(Math.random()*(t-n+1))}function r1(n,t){return n+Math.random()*(t-n)}function c1(n){return n*(.5-Math.random())}function l1(n){n!==void 0&&(Ku=n);let t=Ku+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function h1(n){return n*Cs}function d1(n){return n*No}function u1(n){return(n&n-1)===0&&n!==0}function f1(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function p1(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function m1(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),f=s((t-i)/2),d=o((t-i)/2),u=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*h,l*f,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*f,r*c);break;case"ZXZ":n.set(l*f,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*m,l*u,r*c);break;case"YXY":n.set(l*u,r*h,l*m,r*c);break;case"ZYZ":n.set(l*m,l*u,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function mi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ue(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Ju={DEG2RAD:Cs,RAD2DEG:No,generateUUID:Li,clamp:wn,euclideanModulo:cd,mapLinear:t1,inverseLerp:e1,lerp:To,damp:n1,pingpong:i1,smoothstep:a1,smootherstep:s1,randInt:o1,randFloat:r1,randFloatSpread:c1,seededRandom:l1,degToRad:h1,radToDeg:d1,isPowerOfTwo:u1,ceilPowerOfTwo:f1,floorPowerOfTwo:p1,setQuaternionFromProperEuler:m1,normalize:Ue,denormalize:mi};class Gt{constructor(t=0,e=0){Gt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(wn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ye{constructor(t,e,i,a,s,o,r,l,c){ye.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],m=i[8],y=a[0],g=a[3],p=a[6],M=a[1],x=a[4],v=a[7],w=a[2],S=a[5],E=a[8];return s[0]=o*y+r*M+l*w,s[3]=o*g+r*x+l*S,s[6]=o*p+r*v+l*E,s[1]=c*y+h*M+f*w,s[4]=c*g+h*x+f*S,s[7]=c*p+h*v+f*E,s[2]=d*y+u*M+m*w,s[5]=d*g+u*x+m*S,s[8]=d*p+u*v+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*s*h+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*o-r*c,d=r*l-h*s,u=c*s-o*l,m=e*f+i*d+a*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/m;return t[0]=f*y,t[1]=(a*c-h*i)*y,t[2]=(r*i-a*o)*y,t[3]=d*y,t[4]=(h*e-a*l)*y,t[5]=(a*s-r*e)*y,t[6]=u*y,t[7]=(i*l-c*e)*y,t[8]=(o*e-i*s)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(jc.makeScale(t,e)),this}rotate(t){return this.premultiply(jc.makeRotation(-t)),this}translate(t,e){return this.premultiply(jc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const jc=new ye;function Cm(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function ac(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function g1(){const n=ac("canvas");return n.style.display="block",n}const Qu={};function yo(n){n in Qu||(Qu[n]=!0,console.warn(n))}function x1(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function v1(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function y1(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Ae={enabled:!0,workingColorSpace:Vs,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Be&&(n.r=$i(n.r),n.g=$i(n.g),n.b=$i(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Be&&(n.r=Ls(n.r),n.g=Ls(n.g),n.b=Ls(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===oa?xc:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function $i(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ls(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const tf=[.64,.33,.3,.6,.15,.06],ef=[.2126,.7152,.0722],nf=[.3127,.329],af=new ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sf=new ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ae.define({[Vs]:{primaries:tf,whitePoint:nf,transfer:xc,toXYZ:af,fromXYZ:sf,luminanceCoefficients:ef,workingColorSpaceConfig:{unpackColorSpace:Nn},outputColorSpaceConfig:{drawingBufferColorSpace:Nn}},[Nn]:{primaries:tf,whitePoint:nf,transfer:Be,toXYZ:af,fromXYZ:sf,luminanceCoefficients:ef,outputColorSpaceConfig:{drawingBufferColorSpace:Nn}}});let ss;class M1{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ss===void 0&&(ss=ac("canvas")),ss.width=t.width,ss.height=t.height;const i=ss.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=ss}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ac("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=$i(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor($i(e[i]/255)*255):e[i]=$i(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let _1=0;class Lm{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_1++}),this.uuid=Li(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(Kc(a[o].image)):s.push(Kc(a[o]))}else s=Kc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function Kc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?M1.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let b1=0;class Pn extends Ws{constructor(t=Pn.DEFAULT_IMAGE,e=Pn.DEFAULT_MAPPING,i=Ba,a=Ba,s=Ri,o=Ha,r=gi,l=Zi,c=Pn.DEFAULT_ANISOTROPY,h=oa){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:b1++}),this.uuid=Li(),this.name="",this.source=new Lm(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Gt(0,0),this.repeat=new Gt(1,1),this.center=new Gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==vm)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case rh:t.x=t.x-Math.floor(t.x);break;case Ba:t.x=t.x<0?0:1;break;case ch:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case rh:t.y=t.y-Math.floor(t.y);break;case Ba:t.y=t.y<0?0:1;break;case ch:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=vm;Pn.DEFAULT_ANISOTROPY=1;class sn{constructor(t=0,e=0,i=0,a=1){sn.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],m=l[9],y=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-y)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+y)<.1&&Math.abs(m+g)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,v=(u+1)/2,w=(p+1)/2,S=(h+d)/4,E=(f+y)/4,T=(m+g)/4;return x>v&&x>w?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=S/i,s=E/i):v>w?v<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(v),i=S/a,s=T/a):w<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(w),i=E/s,a=T/s),this.set(i,a,s,e),this}let M=Math.sqrt((g-m)*(g-m)+(f-y)*(f-y)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(g-m)/M,this.y=(f-y)/M,this.z=(d-h)/M,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class S1 extends Ws{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new sn(0,0,t,e),this.scissorTest=!1,this.viewport=new sn(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ri,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Pn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Lm(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wa extends S1{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Dm extends Pn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=Jn,this.minFilter=Jn,this.wrapR=Ba,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class w1 extends Pn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=Jn,this.minFilter=Jn,this.wrapR=Ba,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class pa{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],h=i[a+2],f=i[a+3];const d=s[o+0],u=s[o+1],m=s[o+2],y=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=m,t[e+3]=y;return}if(f!==y||l!==d||c!==u||h!==m){let g=1-r;const p=l*d+c*u+h*m+f*y,M=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),S=Math.atan2(w,p*M);g=Math.sin(g*S)/w,r=Math.sin(r*S)/w}const v=r*M;if(l=l*g+d*v,c=c*g+u*v,h=h*g+m*v,f=f*g+y*v,g===1-r){const w=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=w,c*=w,h*=w,f*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],h=i[a+3],f=s[o],d=s[o+1],u=s[o+2],m=s[o+3];return t[e]=r*m+h*f+l*u-c*d,t[e+1]=l*m+h*d+c*f-r*u,t[e+2]=c*m+h*u+r*d-l*f,t[e+3]=h*m-r*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(a/2),f=r(s/2),d=l(i/2),u=l(a/2),m=l(s/2);switch(o){case"XYZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"YXZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"ZXY":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"ZYX":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"YZX":this._x=d*h*f+c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f-d*u*m;break;case"XZY":this._x=d*h*f-c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f+d*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(s-c)*u,this._z=(o-a)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-l)/u,this._x=.25*u,this._y=(a+o)/u,this._z=(s+c)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(s-c)/u,this._x=(a+o)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-a)/u,this._x=(s+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(wn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+a*c-s*l,this._y=a*h+o*l+s*r-i*c,this._z=s*h+o*c+i*l-a*r,this._w=o*h-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*a+e*this._y,this._z=u*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=a*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(t=0,e=0,i=0){H.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(of.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(of.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),h=2*(r*e-s*a),f=2*(s*i-o*e);return this.x=e+l*c+o*f-r*h,this.y=i+l*h+r*c-s*f,this.z=a+l*f+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Jc.copy(this).projectOnVector(t),this.sub(Jc)}reflect(t){return this.sub(Jc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(wn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Jc=new H,of=new pa;class $a{constructor(t=new H(1/0,1/0,1/0),e=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ui.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ui.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ui.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ui):ui.fromBufferAttribute(s,o),ui.applyMatrix4(t.matrixWorld),this.expandByPoint(ui);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ar.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ar.copy(i.boundingBox)),ar.applyMatrix4(t.matrixWorld),this.union(ar)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ui),ui.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ro),sr.subVectors(this.max,ro),os.subVectors(t.a,ro),rs.subVectors(t.b,ro),cs.subVectors(t.c,ro),ta.subVectors(rs,os),ea.subVectors(cs,rs),Ea.subVectors(os,cs);let e=[0,-ta.z,ta.y,0,-ea.z,ea.y,0,-Ea.z,Ea.y,ta.z,0,-ta.x,ea.z,0,-ea.x,Ea.z,0,-Ea.x,-ta.y,ta.x,0,-ea.y,ea.x,0,-Ea.y,Ea.x,0];return!Qc(e,os,rs,cs,sr)||(e=[1,0,0,0,1,0,0,0,1],!Qc(e,os,rs,cs,sr))?!1:(or.crossVectors(ta,ea),e=[or.x,or.y,or.z],Qc(e,os,rs,cs,sr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ui).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ui).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Fi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Fi=[new H,new H,new H,new H,new H,new H,new H,new H],ui=new H,ar=new $a,os=new H,rs=new H,cs=new H,ta=new H,ea=new H,Ea=new H,ro=new H,sr=new H,or=new H,Ta=new H;function Qc(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){Ta.fromArray(n,s);const r=a.x*Math.abs(Ta.x)+a.y*Math.abs(Ta.y)+a.z*Math.abs(Ta.z),l=t.dot(Ta),c=e.dot(Ta),h=i.dot(Ta);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const E1=new $a,co=new H,tl=new H;class Ys{constructor(t=new H,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):E1.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;co.subVectors(t,this.center);const e=co.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(co,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(tl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(co.copy(t.center).add(tl)),this.expandByPoint(co.copy(t.center).sub(tl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ui=new H,el=new H,rr=new H,na=new H,nl=new H,cr=new H,il=new H;class ld{constructor(t=new H,e=new H(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ui)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ui.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ui.copy(this.origin).addScaledVector(this.direction,e),Ui.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){el.copy(t).add(e).multiplyScalar(.5),rr.copy(e).sub(t).normalize(),na.copy(this.origin).sub(el);const s=t.distanceTo(e)*.5,o=-this.direction.dot(rr),r=na.dot(this.direction),l=-na.dot(rr),c=na.lengthSq(),h=Math.abs(1-o*o);let f,d,u,m;if(h>0)if(f=o*l-r,d=o*r-l,m=s*h,f>=0)if(d>=-m)if(d<=m){const y=1/h;f*=y,d*=y,u=f*(f+o*d+2*r)+d*(o*f+d+2*l)+c}else d=s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d<=-m?(f=Math.max(0,-(-o*s+r)),d=f>0?-s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c):d<=m?(f=0,d=Math.min(Math.max(-s,-l),s),u=d*(d+2*l)+c):(f=Math.max(0,-(o*s+r)),d=f>0?s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c);else d=o>0?-s:s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),a&&a.copy(el).addScaledVector(rr,d),u}intersectSphere(t,e){Ui.subVectors(t.center,this.origin);const i=Ui.dot(this.direction),a=Ui.dot(Ui)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,a=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,a=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),f>=0?(r=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Ui)!==null}intersectTriangle(t,e,i,a,s){nl.subVectors(e,t),cr.subVectors(i,t),il.crossVectors(nl,cr);let o=this.direction.dot(il),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;na.subVectors(this.origin,t);const l=r*this.direction.dot(cr.crossVectors(na,cr));if(l<0)return null;const c=r*this.direction.dot(nl.cross(na));if(c<0||l+c>o)return null;const h=-r*na.dot(il);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class De{constructor(t,e,i,a,s,o,r,l,c,h,f,d,u,m,y,g){De.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,h,f,d,u,m,y,g)}set(t,e,i,a,s,o,r,l,c,h,f,d,u,m,y,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=m,p[11]=y,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new De().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/ls.setFromMatrixColumn(t,0).length(),s=1/ls.setFromMatrixColumn(t,1).length(),o=1/ls.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const d=o*h,u=o*f,m=r*h,y=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+m*c,e[5]=d-y*c,e[9]=-r*l,e[2]=y-d*c,e[6]=m+u*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,m=c*h,y=c*f;e[0]=d+y*r,e[4]=m*r-u,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-m,e[6]=y+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,m=c*h,y=c*f;e[0]=d-y*r,e[4]=-o*f,e[8]=m+u*r,e[1]=u+m*r,e[5]=o*h,e[9]=y-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,u=o*f,m=r*h,y=r*f;e[0]=l*h,e[4]=m*c-u,e[8]=d*c+y,e[1]=l*f,e[5]=y*c+d,e[9]=u*c-m,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,u=o*c,m=r*l,y=r*c;e[0]=l*h,e[4]=y-d*f,e[8]=m*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=u*f+m,e[10]=d-y*f}else if(t.order==="XZY"){const d=o*l,u=o*c,m=r*l,y=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+y,e[5]=o*h,e[9]=u*f-m,e[2]=m*f-u,e[6]=r*h,e[10]=y*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(T1,t,A1)}lookAt(t,e,i){const a=this.elements;return Zn.subVectors(t,e),Zn.lengthSq()===0&&(Zn.z=1),Zn.normalize(),ia.crossVectors(i,Zn),ia.lengthSq()===0&&(Math.abs(i.z)===1?Zn.x+=1e-4:Zn.z+=1e-4,Zn.normalize(),ia.crossVectors(i,Zn)),ia.normalize(),lr.crossVectors(Zn,ia),a[0]=ia.x,a[4]=lr.x,a[8]=Zn.x,a[1]=ia.y,a[5]=lr.y,a[9]=Zn.y,a[2]=ia.z,a[6]=lr.z,a[10]=Zn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],m=i[2],y=i[6],g=i[10],p=i[14],M=i[3],x=i[7],v=i[11],w=i[15],S=a[0],E=a[4],T=a[8],b=a[12],_=a[1],A=a[5],k=a[9],L=a[13],U=a[2],D=a[6],P=a[10],O=a[14],B=a[3],W=a[7],et=a[11],lt=a[15];return s[0]=o*S+r*_+l*U+c*B,s[4]=o*E+r*A+l*D+c*W,s[8]=o*T+r*k+l*P+c*et,s[12]=o*b+r*L+l*O+c*lt,s[1]=h*S+f*_+d*U+u*B,s[5]=h*E+f*A+d*D+u*W,s[9]=h*T+f*k+d*P+u*et,s[13]=h*b+f*L+d*O+u*lt,s[2]=m*S+y*_+g*U+p*B,s[6]=m*E+y*A+g*D+p*W,s[10]=m*T+y*k+g*P+p*et,s[14]=m*b+y*L+g*O+p*lt,s[3]=M*S+x*_+v*U+w*B,s[7]=M*E+x*A+v*D+w*W,s[11]=M*T+x*k+v*P+w*et,s[15]=M*b+x*L+v*O+w*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],m=t[3],y=t[7],g=t[11],p=t[15];return m*(+s*l*f-a*c*f-s*r*d+i*c*d+a*r*u-i*l*u)+y*(+e*l*u-e*c*d+s*o*d-a*o*u+a*c*h-s*l*h)+g*(+e*c*f-e*r*u-s*o*f+i*o*u+s*r*h-i*c*h)+p*(-a*r*h-e*l*f+e*r*d+a*o*f-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],m=t[12],y=t[13],g=t[14],p=t[15],M=f*g*c-y*d*c+y*l*u-r*g*u-f*l*p+r*d*p,x=m*d*c-h*g*c-m*l*u+o*g*u+h*l*p-o*d*p,v=h*y*c-m*f*c+m*r*u-o*y*u-h*r*p+o*f*p,w=m*f*l-h*y*l-m*r*d+o*y*d+h*r*g-o*f*g,S=e*M+i*x+a*v+s*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=M*E,t[1]=(y*d*s-f*g*s-y*a*u+i*g*u+f*a*p-i*d*p)*E,t[2]=(r*g*s-y*l*s+y*a*c-i*g*c-r*a*p+i*l*p)*E,t[3]=(f*l*s-r*d*s-f*a*c+i*d*c+r*a*u-i*l*u)*E,t[4]=x*E,t[5]=(h*g*s-m*d*s+m*a*u-e*g*u-h*a*p+e*d*p)*E,t[6]=(m*l*s-o*g*s-m*a*c+e*g*c+o*a*p-e*l*p)*E,t[7]=(o*d*s-h*l*s+h*a*c-e*d*c-o*a*u+e*l*u)*E,t[8]=v*E,t[9]=(m*f*s-h*y*s-m*i*u+e*y*u+h*i*p-e*f*p)*E,t[10]=(o*y*s-m*r*s+m*i*c-e*y*c-o*i*p+e*r*p)*E,t[11]=(h*r*s-o*f*s-h*i*c+e*f*c+o*i*u-e*r*u)*E,t[12]=w*E,t[13]=(h*y*a-m*f*a+m*i*d-e*y*d-h*i*g+e*f*g)*E,t[14]=(m*r*a-o*y*a-m*i*l+e*y*l+o*i*g-e*r*g)*E,t[15]=(o*f*a-h*r*a+h*i*l-e*f*l-o*i*d+e*r*d)*E,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,h=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+i,h*l-a*o,0,c*l-a*r,h*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,h=o+o,f=r+r,d=s*c,u=s*h,m=s*f,y=o*h,g=o*f,p=r*f,M=l*c,x=l*h,v=l*f,w=i.x,S=i.y,E=i.z;return a[0]=(1-(y+p))*w,a[1]=(u+v)*w,a[2]=(m-x)*w,a[3]=0,a[4]=(u-v)*S,a[5]=(1-(d+p))*S,a[6]=(g+M)*S,a[7]=0,a[8]=(m+x)*E,a[9]=(g-M)*E,a[10]=(1-(d+y))*E,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=ls.set(a[0],a[1],a[2]).length();const o=ls.set(a[4],a[5],a[6]).length(),r=ls.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],fi.copy(this);const c=1/s,h=1/o,f=1/r;return fi.elements[0]*=c,fi.elements[1]*=c,fi.elements[2]*=c,fi.elements[4]*=h,fi.elements[5]*=h,fi.elements[6]*=h,fi.elements[8]*=f,fi.elements[9]*=f,fi.elements[10]*=f,e.setFromRotationMatrix(fi),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=Yi){const l=this.elements,c=2*s/(e-t),h=2*s/(i-a),f=(e+t)/(e-t),d=(i+a)/(i-a);let u,m;if(r===Yi)u=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===ic)u=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=u,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=Yi){const l=this.elements,c=1/(e-t),h=1/(i-a),f=1/(o-s),d=(e+t)*c,u=(i+a)*h;let m,y;if(r===Yi)m=(o+s)*f,y=-2*f;else if(r===ic)m=s*f,y=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-u,l[2]=0,l[6]=0,l[10]=y,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ls=new H,fi=new De,T1=new H(0,0,0),A1=new H(1,1,1),ia=new H,lr=new H,Zn=new H,rf=new De,cf=new pa;class Di{constructor(t=0,e=0,i=0,a=Di.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],h=a[9],f=a[2],d=a[6],u=a[10];switch(e){case"XYZ":this._y=Math.asin(wn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-wn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(wn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-wn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(wn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-wn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return rf.makeRotationFromQuaternion(t),this.setFromRotationMatrix(rf,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return cf.setFromEuler(this),this.setFromQuaternion(cf,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Di.DEFAULT_ORDER="XYZ";class hd{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let R1=0;const lf=new H,hs=new pa,Ni=new De,hr=new H,lo=new H,P1=new H,C1=new pa,hf=new H(1,0,0),df=new H(0,1,0),uf=new H(0,0,1),ff={type:"added"},L1={type:"removed"},ds={type:"childadded",child:null},al={type:"childremoved",child:null};class en extends Ws{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:R1++}),this.uuid=Li(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=en.DEFAULT_UP.clone();const t=new H,e=new Di,i=new pa,a=new H(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new De},normalMatrix:{value:new ye}}),this.matrix=new De,this.matrixWorld=new De,this.matrixAutoUpdate=en.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return hs.setFromAxisAngle(t,e),this.quaternion.multiply(hs),this}rotateOnWorldAxis(t,e){return hs.setFromAxisAngle(t,e),this.quaternion.premultiply(hs),this}rotateX(t){return this.rotateOnAxis(hf,t)}rotateY(t){return this.rotateOnAxis(df,t)}rotateZ(t){return this.rotateOnAxis(uf,t)}translateOnAxis(t,e){return lf.copy(t).applyQuaternion(this.quaternion),this.position.add(lf.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(hf,t)}translateY(t){return this.translateOnAxis(df,t)}translateZ(t){return this.translateOnAxis(uf,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ni.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?hr.copy(t):hr.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),lo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ni.lookAt(lo,hr,this.up):Ni.lookAt(hr,lo,this.up),this.quaternion.setFromRotationMatrix(Ni),a&&(Ni.extractRotation(a.matrixWorld),hs.setFromRotationMatrix(Ni),this.quaternion.premultiply(hs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ff),ds.child=t,this.dispatchEvent(ds),ds.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(L1),al.child=t,this.dispatchEvent(al),al.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ni.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ni.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ni),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ff),ds.child=t,this.dispatchEvent(ds),ds.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lo,t,P1),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lo,C1,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}en.DEFAULT_UP=new H(0,1,0);en.DEFAULT_MATRIX_AUTO_UPDATE=!0;en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const pi=new H,Oi=new H,sl=new H,Bi=new H,us=new H,fs=new H,pf=new H,ol=new H,rl=new H,cl=new H,ll=new sn,hl=new sn,dl=new sn;class Kn{constructor(t=new H,e=new H,i=new H){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),pi.subVectors(t,e),a.cross(pi);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){pi.subVectors(a,e),Oi.subVectors(i,e),sl.subVectors(t,e);const o=pi.dot(pi),r=pi.dot(Oi),l=pi.dot(sl),c=Oi.dot(Oi),h=Oi.dot(sl),f=o*c-r*r;if(f===0)return s.set(0,0,0),null;const d=1/f,u=(c*l-r*h)*d,m=(o*h-r*l)*d;return s.set(1-u-m,m,u)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Bi)===null?!1:Bi.x>=0&&Bi.y>=0&&Bi.x+Bi.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,Bi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Bi.x),l.addScaledVector(o,Bi.y),l.addScaledVector(r,Bi.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return ll.setScalar(0),hl.setScalar(0),dl.setScalar(0),ll.fromBufferAttribute(t,e),hl.fromBufferAttribute(t,i),dl.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(ll,s.x),o.addScaledVector(hl,s.y),o.addScaledVector(dl,s.z),o}static isFrontFacing(t,e,i,a){return pi.subVectors(i,e),Oi.subVectors(t,e),pi.cross(Oi).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pi.subVectors(this.c,this.b),Oi.subVectors(this.a,this.b),pi.cross(Oi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Kn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Kn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return Kn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return Kn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Kn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;us.subVectors(a,i),fs.subVectors(s,i),ol.subVectors(t,i);const l=us.dot(ol),c=fs.dot(ol);if(l<=0&&c<=0)return e.copy(i);rl.subVectors(t,a);const h=us.dot(rl),f=fs.dot(rl);if(h>=0&&f<=h)return e.copy(a);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(us,o);cl.subVectors(t,s);const u=us.dot(cl),m=fs.dot(cl);if(m>=0&&u<=m)return e.copy(s);const y=u*c-l*m;if(y<=0&&c>=0&&m<=0)return r=c/(c-m),e.copy(i).addScaledVector(fs,r);const g=h*m-u*f;if(g<=0&&f-h>=0&&u-m>=0)return pf.subVectors(s,a),r=(f-h)/(f-h+(u-m)),e.copy(a).addScaledVector(pf,r);const p=1/(g+y+d);return o=y*p,r=d*p,e.copy(i).addScaledVector(us,o).addScaledVector(fs,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const km={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},aa={h:0,s:0,l:0},dr={h:0,s:0,l:0};function ul(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class te{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Nn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Ae.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Ae.workingColorSpace){return this.r=t,this.g=e,this.b=i,Ae.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Ae.workingColorSpace){if(t=cd(t,1),e=wn(e,0,1),i=wn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=ul(o,s,t+1/3),this.g=ul(o,s,t),this.b=ul(o,s,t-1/3)}return Ae.toWorkingColorSpace(this,a),this}setStyle(t,e=Nn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Nn){const i=km[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=$i(t.r),this.g=$i(t.g),this.b=$i(t.b),this}copyLinearToSRGB(t){return this.r=Ls(t.r),this.g=Ls(t.g),this.b=Ls(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Nn){return Ae.fromWorkingColorSpace(An.copy(this),t),Math.round(wn(An.r*255,0,255))*65536+Math.round(wn(An.g*255,0,255))*256+Math.round(wn(An.b*255,0,255))}getHexString(t=Nn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Ae.workingColorSpace){Ae.fromWorkingColorSpace(An.copy(this),e);const i=An.r,a=An.g,s=An.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const f=o-r;switch(c=h<=.5?f/(o+r):f/(2-o-r),o){case i:l=(a-s)/f+(a<s?6:0);break;case a:l=(s-i)/f+2;break;case s:l=(i-a)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Ae.workingColorSpace){return Ae.fromWorkingColorSpace(An.copy(this),e),t.r=An.r,t.g=An.g,t.b=An.b,t}getStyle(t=Nn){Ae.fromWorkingColorSpace(An.copy(this),t);const e=An.r,i=An.g,a=An.b;return t!==Nn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(aa),this.setHSL(aa.h+t,aa.s+e,aa.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(aa),t.getHSL(dr);const i=To(aa.h,dr.h,e),a=To(aa.s,dr.s,e),s=To(aa.l,dr.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const An=new te;te.NAMES=km;let D1=0;class Za extends Ws{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:D1++}),this.uuid=Li(),this.name="",this.blending=Rs,this.side=ga,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=jl,this.blendDst=Kl,this.blendEquation=Ua,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new te(0,0,0),this.blendAlpha=0,this.depthFunc=Ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=qu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=as,this.stencilZFail=as,this.stencilZPass=as,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Rs&&(i.blending=this.blending),this.side!==ga&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==jl&&(i.blendSrc=this.blendSrc),this.blendDst!==Kl&&(i.blendDst=this.blendDst),this.blendEquation!==Ua&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ns&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==qu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==as&&(i.stencilFail=this.stencilFail),this.stencilZFail!==as&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==as&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class vn extends Za{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Di,this.combine=td,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const hn=new H,ur=new Gt;class yn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=zh,this.updateRanges=[],this.gpuType=Pi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ur.fromBufferAttribute(this,e),ur.applyMatrix3(t),this.setXY(e,ur.x,ur.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)hn.fromBufferAttribute(this,e),hn.applyMatrix3(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)hn.fromBufferAttribute(this,e),hn.applyMatrix4(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)hn.fromBufferAttribute(this,e),hn.applyNormalMatrix(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)hn.fromBufferAttribute(this,e),hn.transformDirection(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=mi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ue(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=mi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=mi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=mi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=mi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array),a=Ue(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array),a=Ue(a,this.array),s=Ue(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==zh&&(t.usage=this.usage),t}}class Im extends yn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class zm extends yn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class ke extends yn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let k1=0;const ii=new De,fl=new en,ps=new H,qn=new $a,ho=new $a,xn=new H;class cn extends Ws{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:k1++}),this.uuid=Li(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Cm(t)?zm:Im)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ye().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ii.makeRotationFromQuaternion(t),this.applyMatrix4(ii),this}rotateX(t){return ii.makeRotationX(t),this.applyMatrix4(ii),this}rotateY(t){return ii.makeRotationY(t),this.applyMatrix4(ii),this}rotateZ(t){return ii.makeRotationZ(t),this.applyMatrix4(ii),this}translate(t,e,i){return ii.makeTranslation(t,e,i),this.applyMatrix4(ii),this}scale(t,e,i){return ii.makeScale(t,e,i),this.applyMatrix4(ii),this}lookAt(t){return fl.lookAt(t),fl.updateMatrix(),this.applyMatrix4(fl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ps).negate(),this.translate(ps.x,ps.y,ps.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ke(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $a);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];qn.setFromBufferAttribute(s),this.morphTargetsRelative?(xn.addVectors(this.boundingBox.min,qn.min),this.boundingBox.expandByPoint(xn),xn.addVectors(this.boundingBox.max,qn.max),this.boundingBox.expandByPoint(xn)):(this.boundingBox.expandByPoint(qn.min),this.boundingBox.expandByPoint(qn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ys);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(t){const i=this.boundingSphere.center;if(qn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];ho.setFromBufferAttribute(r),this.morphTargetsRelative?(xn.addVectors(qn.min,ho.min),qn.expandByPoint(xn),xn.addVectors(qn.max,ho.max),qn.expandByPoint(xn)):(qn.expandByPoint(ho.min),qn.expandByPoint(ho.max))}qn.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)xn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(xn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)xn.fromBufferAttribute(r,c),l&&(ps.fromBufferAttribute(t,c),xn.add(ps)),a=Math.max(a,i.distanceToSquared(xn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new yn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let T=0;T<i.count;T++)r[T]=new H,l[T]=new H;const c=new H,h=new H,f=new H,d=new Gt,u=new Gt,m=new Gt,y=new H,g=new H;function p(T,b,_){c.fromBufferAttribute(i,T),h.fromBufferAttribute(i,b),f.fromBufferAttribute(i,_),d.fromBufferAttribute(s,T),u.fromBufferAttribute(s,b),m.fromBufferAttribute(s,_),h.sub(c),f.sub(c),u.sub(d),m.sub(d);const A=1/(u.x*m.y-m.x*u.y);isFinite(A)&&(y.copy(h).multiplyScalar(m.y).addScaledVector(f,-u.y).multiplyScalar(A),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-m.x).multiplyScalar(A),r[T].add(y),r[b].add(y),r[_].add(y),l[T].add(g),l[b].add(g),l[_].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let T=0,b=M.length;T<b;++T){const _=M[T],A=_.start,k=_.count;for(let L=A,U=A+k;L<U;L+=3)p(t.getX(L+0),t.getX(L+1),t.getX(L+2))}const x=new H,v=new H,w=new H,S=new H;function E(T){w.fromBufferAttribute(a,T),S.copy(w);const b=r[T];x.copy(b),x.sub(w.multiplyScalar(w.dot(b))).normalize(),v.crossVectors(S,b);const A=v.dot(l[T])<0?-1:1;o.setXYZW(T,x.x,x.y,x.z,A)}for(let T=0,b=M.length;T<b;++T){const _=M[T],A=_.start,k=_.count;for(let L=A,U=A+k;L<U;L+=3)E(t.getX(L+0)),E(t.getX(L+1)),E(t.getX(L+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new yn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const a=new H,s=new H,o=new H,r=new H,l=new H,c=new H,h=new H,f=new H;if(t)for(let d=0,u=t.count;d<u;d+=3){const m=t.getX(d+0),y=t.getX(d+1),g=t.getX(d+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,y),o.fromBufferAttribute(e,g),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),r.fromBufferAttribute(i,m),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,g),r.add(h),l.add(h),c.add(h),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)xn.fromBufferAttribute(t,e),xn.normalize(),t.setXYZ(e,xn.x,xn.y,xn.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,d=new c.constructor(l.length*h);let u=0,m=0;for(let y=0,g=l.length;y<g;y++){r.isInterleavedBufferAttribute?u=l[y]*r.data.stride+r.offset:u=l[y]*h;for(let p=0;p<h;p++)d[m++]=c[u++]}return new yn(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new cn,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,i);l.push(u)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(a[l]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],f=s[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const mf=new De,Aa=new ld,fr=new Ys,gf=new H,pr=new H,mr=new H,gr=new H,pl=new H,xr=new H,xf=new H,vr=new H;class Me extends en{constructor(t=new cn,e=new vn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){xr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=r[l],f=s[l];h!==0&&(pl.fromBufferAttribute(f,t),o?xr.addScaledVector(pl,h):xr.addScaledVector(pl.sub(e),h))}e.add(xr)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),fr.copy(i.boundingSphere),fr.applyMatrix4(s),Aa.copy(t.ray).recast(t.near),!(fr.containsPoint(Aa.origin)===!1&&(Aa.intersectSphere(fr,gf)===null||Aa.origin.distanceToSquared(gf)>(t.far-t.near)**2))&&(mf.copy(s).invert(),Aa.copy(t.ray).applyMatrix4(mf),!(i.boundingBox!==null&&Aa.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Aa)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,d=s.groups,u=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,y=d.length;m<y;m++){const g=d[m],p=o[g.materialIndex],M=Math.max(g.start,u.start),x=Math.min(r.count,Math.min(g.start+g.count,u.start+u.count));for(let v=M,w=x;v<w;v+=3){const S=r.getX(v),E=r.getX(v+1),T=r.getX(v+2);a=yr(this,p,t,i,c,h,f,S,E,T),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,u.start),y=Math.min(r.count,u.start+u.count);for(let g=m,p=y;g<p;g+=3){const M=r.getX(g),x=r.getX(g+1),v=r.getX(g+2);a=yr(this,o,t,i,c,h,f,M,x,v),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,y=d.length;m<y;m++){const g=d[m],p=o[g.materialIndex],M=Math.max(g.start,u.start),x=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let v=M,w=x;v<w;v+=3){const S=v,E=v+1,T=v+2;a=yr(this,p,t,i,c,h,f,S,E,T),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,u.start),y=Math.min(l.count,u.start+u.count);for(let g=m,p=y;g<p;g+=3){const M=g,x=g+1,v=g+2;a=yr(this,o,t,i,c,h,f,M,x,v),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function I1(n,t,e,i,a,s,o,r){let l;if(t.side===Gn?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===ga,r),l===null)return null;vr.copy(r),vr.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(vr);return c<e.near||c>e.far?null:{distance:c,point:vr.clone(),object:n}}function yr(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,pr),n.getVertexPosition(l,mr),n.getVertexPosition(c,gr);const h=I1(n,t,e,i,pr,mr,gr,xf);if(h){const f=new H;Kn.getBarycoord(xf,pr,mr,gr,f),a&&(h.uv=Kn.getInterpolatedAttribute(a,r,l,c,f,new Gt)),s&&(h.uv1=Kn.getInterpolatedAttribute(s,r,l,c,f,new Gt)),o&&(h.normal=Kn.getInterpolatedAttribute(o,r,l,c,f,new H),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new H,materialIndex:0};Kn.getNormal(pr,mr,gr,d.normal),h.face=d,h.barycoord=f}return h}class Xn extends cn{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,u=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new ke(c,3)),this.setAttribute("normal",new ke(h,3)),this.setAttribute("uv",new ke(f,2));function m(y,g,p,M,x,v,w,S,E,T,b){const _=v/E,A=w/T,k=v/2,L=w/2,U=S/2,D=E+1,P=T+1;let O=0,B=0;const W=new H;for(let et=0;et<P;et++){const lt=et*A-L;for(let pt=0;pt<D;pt++){const Pt=pt*_-k;W[y]=Pt*M,W[g]=lt*x,W[p]=U,c.push(W.x,W.y,W.z),W[y]=0,W[g]=0,W[p]=S>0?1:-1,h.push(W.x,W.y,W.z),f.push(pt/E),f.push(1-et/T),O+=1}}for(let et=0;et<T;et++)for(let lt=0;lt<E;lt++){const pt=d+lt+D*et,Pt=d+lt+D*(et+1),Y=d+(lt+1)+D*(et+1),nt=d+(lt+1)+D*et;l.push(pt,Pt,nt),l.push(Pt,Y,nt),B+=6}r.addGroup(u,B,b),u+=B,d+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Xs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function Fn(n){const t={};for(let e=0;e<n.length;e++){const i=Xs(n[e]);for(const a in i)t[a]=i[a]}return t}function z1(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Fm(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Ae.workingColorSpace}const F1={clone:Xs,merge:Fn};var U1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,N1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class xa extends Za{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=U1,this.fragmentShader=N1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Xs(t.uniforms),this.uniformsGroups=z1(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Um extends en{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new De,this.projectionMatrix=new De,this.projectionMatrixInverse=new De,this.coordinateSystem=Yi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const sa=new H,vf=new Gt,yf=new Gt;class si extends Um{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=No*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Cs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return No*2*Math.atan(Math.tan(Cs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){sa.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(sa.x,sa.y).multiplyScalar(-t/sa.z),sa.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(sa.x,sa.y).multiplyScalar(-t/sa.z)}getViewSize(t,e){return this.getViewBounds(t,vf,yf),e.subVectors(yf,vf)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Cs*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ms=-90,gs=1;class O1 extends en{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new si(ms,gs,t,e);a.layers=this.layers,this.add(a);const s=new si(ms,gs,t,e);s.layers=this.layers,this.add(s);const o=new si(ms,gs,t,e);o.layers=this.layers,this.add(o);const r=new si(ms,gs,t,e);r.layers=this.layers,this.add(r);const l=new si(ms,gs,t,e);l.layers=this.layers,this.add(l);const c=new si(ms,gs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===Yi)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ic)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=y,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Nm extends Pn{constructor(t,e,i,a,s,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Os,super(t,e,i,a,s,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class B1 extends Wa{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Nm(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ri}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new Xn(5,5,5),s=new xa({name:"CubemapFromEquirect",uniforms:Xs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Gn,blending:ua});s.uniforms.tEquirect.value=e;const o=new Me(a,s),r=e.minFilter;return e.minFilter===Ha&&(e.minFilter=Ri),new O1(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const ml=new H,H1=new H,G1=new ye;class Ia{constructor(t=new H(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=ml.subVectors(i,e).cross(H1.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(ml),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||G1.getNormalMatrix(t),a=this.coplanarPoint(ml).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ra=new Ys,Mr=new H;class dd{constructor(t=new Ia,e=new Ia,i=new Ia,a=new Ia,s=new Ia,o=new Ia){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Yi){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],h=a[5],f=a[6],d=a[7],u=a[8],m=a[9],y=a[10],g=a[11],p=a[12],M=a[13],x=a[14],v=a[15];if(i[0].setComponents(l-s,d-c,g-u,v-p).normalize(),i[1].setComponents(l+s,d+c,g+u,v+p).normalize(),i[2].setComponents(l+o,d+h,g+m,v+M).normalize(),i[3].setComponents(l-o,d-h,g-m,v-M).normalize(),i[4].setComponents(l-r,d-f,g-y,v-x).normalize(),e===Yi)i[5].setComponents(l+r,d+f,g+y,v+x).normalize();else if(e===ic)i[5].setComponents(r,f,y,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ra.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ra.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ra)}intersectsSprite(t){return Ra.center.set(0,0,0),Ra.radius=.7071067811865476,Ra.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ra)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(Mr.x=a.normal.x>0?t.max.x:t.min.x,Mr.y=a.normal.y>0?t.max.y:t.min.y,Mr.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(Mr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Om(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function X1(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,r),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,m)=>u.start-m.start);let d=0;for(let u=1;u<f.length;u++){const m=f[d],y=f[u];y.start<=m.start+m.count+1?m.count=Math.max(m.count,y.start+y.count-m.start):(++d,f[d]=y)}f.length=d+1;for(let u=0,m=f.length;u<m;u++){const y=f[u];n.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class ai extends cn{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,h=l+1,f=t/r,d=e/l,u=[],m=[],y=[],g=[];for(let p=0;p<h;p++){const M=p*d-o;for(let x=0;x<c;x++){const v=x*f-s;m.push(v,-M,0),y.push(0,0,1),g.push(x/r),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<r;M++){const x=M+c*p,v=M+c*(p+1),w=M+1+c*(p+1),S=M+1+c*p;u.push(x,v,S),u.push(v,w,S)}this.setIndex(u),this.setAttribute("position",new ke(m,3)),this.setAttribute("normal",new ke(y,3)),this.setAttribute("uv",new ke(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ai(t.width,t.height,t.widthSegments,t.heightSegments)}}var V1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,W1=`#ifdef USE_ALPHAHASH
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
#endif`,Y1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Z1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,q1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,j1=`#ifdef USE_AOMAP
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
#endif`,K1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,J1=`#ifdef USE_BATCHING
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
#endif`,Q1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,tS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,eS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nS=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,iS=`#ifdef USE_IRIDESCENCE
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
#endif`,aS=`#ifdef USE_BUMPMAP
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
#endif`,sS=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,oS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,rS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,lS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,hS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,dS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,uS=`#if defined( USE_COLOR_ALPHA )
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
#endif`,fS=`#define PI 3.141592653589793
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
} // validated`,pS=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,mS=`vec3 transformedNormal = objectNormal;
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
#endif`,gS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,MS="gl_FragColor = linearToOutputTexel( gl_FragColor );",_S=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,bS=`#ifdef USE_ENVMAP
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
#endif`,SS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,wS=`#ifdef USE_ENVMAP
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
#endif`,ES=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,TS=`#ifdef USE_ENVMAP
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
#endif`,AS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,RS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,PS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,CS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,LS=`#ifdef USE_GRADIENTMAP
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
}`,DS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,kS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,IS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,zS=`uniform bool receiveShadow;
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
#endif`,FS=`#ifdef USE_ENVMAP
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
#endif`,US=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,NS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,OS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,BS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,HS=`PhysicalMaterial material;
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
#endif`,GS=`struct PhysicalMaterial {
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
}`,XS=`
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
#endif`,VS=`#if defined( RE_IndirectDiffuse )
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
#endif`,WS=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,YS=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$S=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ZS=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qS=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,jS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,KS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,JS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,QS=`#if defined( USE_POINTS_UV )
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
#endif`,tw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ew=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,nw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,iw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,aw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sw=`#ifdef USE_MORPHTARGETS
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
#endif`,ow=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,cw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,lw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,uw=`#ifdef USE_NORMALMAP
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
#endif`,fw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,pw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,mw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,gw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,yw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Mw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,_w=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,bw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ww=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ew=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Tw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Aw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Rw=`float getShadowMask() {
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
}`,Pw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Cw=`#ifdef USE_SKINNING
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
#endif`,Lw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Dw=`#ifdef USE_SKINNING
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
#endif`,kw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Iw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,zw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Fw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Uw=`#ifdef USE_TRANSMISSION
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
#endif`,Nw=`#ifdef USE_TRANSMISSION
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
#endif`,Ow=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Bw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Hw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Vw=`uniform sampler2D t2D;
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
}`,Ww=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,$w=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qw=`#include <common>
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
}`,jw=`#if DEPTH_PACKING == 3200
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
}`,Kw=`#define DISTANCE
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
}`,Jw=`#define DISTANCE
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
}`,Qw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eE=`uniform float scale;
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
}`,nE=`uniform vec3 diffuse;
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
}`,iE=`#include <common>
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
}`,aE=`uniform vec3 diffuse;
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
}`,sE=`#define LAMBERT
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
}`,oE=`#define LAMBERT
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
}`,rE=`#define MATCAP
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
}`,cE=`#define MATCAP
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
}`,lE=`#define NORMAL
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
}`,hE=`#define NORMAL
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
}`,dE=`#define PHONG
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
}`,uE=`#define PHONG
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
}`,fE=`#define STANDARD
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
}`,pE=`#define STANDARD
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
}`,mE=`#define TOON
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
}`,gE=`#define TOON
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
}`,xE=`uniform float size;
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
}`,vE=`uniform vec3 diffuse;
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
}`,yE=`#include <common>
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
}`,ME=`uniform vec3 color;
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
}`,_E=`uniform float rotation;
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
}`,bE=`uniform vec3 diffuse;
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
}`,be={alphahash_fragment:V1,alphahash_pars_fragment:W1,alphamap_fragment:Y1,alphamap_pars_fragment:$1,alphatest_fragment:Z1,alphatest_pars_fragment:q1,aomap_fragment:j1,aomap_pars_fragment:K1,batching_pars_vertex:J1,batching_vertex:Q1,begin_vertex:tS,beginnormal_vertex:eS,bsdfs:nS,iridescence_fragment:iS,bumpmap_pars_fragment:aS,clipping_planes_fragment:sS,clipping_planes_pars_fragment:oS,clipping_planes_pars_vertex:rS,clipping_planes_vertex:cS,color_fragment:lS,color_pars_fragment:hS,color_pars_vertex:dS,color_vertex:uS,common:fS,cube_uv_reflection_fragment:pS,defaultnormal_vertex:mS,displacementmap_pars_vertex:gS,displacementmap_vertex:xS,emissivemap_fragment:vS,emissivemap_pars_fragment:yS,colorspace_fragment:MS,colorspace_pars_fragment:_S,envmap_fragment:bS,envmap_common_pars_fragment:SS,envmap_pars_fragment:wS,envmap_pars_vertex:ES,envmap_physical_pars_fragment:FS,envmap_vertex:TS,fog_vertex:AS,fog_pars_vertex:RS,fog_fragment:PS,fog_pars_fragment:CS,gradientmap_pars_fragment:LS,lightmap_pars_fragment:DS,lights_lambert_fragment:kS,lights_lambert_pars_fragment:IS,lights_pars_begin:zS,lights_toon_fragment:US,lights_toon_pars_fragment:NS,lights_phong_fragment:OS,lights_phong_pars_fragment:BS,lights_physical_fragment:HS,lights_physical_pars_fragment:GS,lights_fragment_begin:XS,lights_fragment_maps:VS,lights_fragment_end:WS,logdepthbuf_fragment:YS,logdepthbuf_pars_fragment:$S,logdepthbuf_pars_vertex:ZS,logdepthbuf_vertex:qS,map_fragment:jS,map_pars_fragment:KS,map_particle_fragment:JS,map_particle_pars_fragment:QS,metalnessmap_fragment:tw,metalnessmap_pars_fragment:ew,morphinstance_vertex:nw,morphcolor_vertex:iw,morphnormal_vertex:aw,morphtarget_pars_vertex:sw,morphtarget_vertex:ow,normal_fragment_begin:rw,normal_fragment_maps:cw,normal_pars_fragment:lw,normal_pars_vertex:hw,normal_vertex:dw,normalmap_pars_fragment:uw,clearcoat_normal_fragment_begin:fw,clearcoat_normal_fragment_maps:pw,clearcoat_pars_fragment:mw,iridescence_pars_fragment:gw,opaque_fragment:xw,packing:vw,premultiplied_alpha_fragment:yw,project_vertex:Mw,dithering_fragment:_w,dithering_pars_fragment:bw,roughnessmap_fragment:Sw,roughnessmap_pars_fragment:ww,shadowmap_pars_fragment:Ew,shadowmap_pars_vertex:Tw,shadowmap_vertex:Aw,shadowmask_pars_fragment:Rw,skinbase_vertex:Pw,skinning_pars_vertex:Cw,skinning_vertex:Lw,skinnormal_vertex:Dw,specularmap_fragment:kw,specularmap_pars_fragment:Iw,tonemapping_fragment:zw,tonemapping_pars_fragment:Fw,transmission_fragment:Uw,transmission_pars_fragment:Nw,uv_pars_fragment:Ow,uv_pars_vertex:Bw,uv_vertex:Hw,worldpos_vertex:Gw,background_vert:Xw,background_frag:Vw,backgroundCube_vert:Ww,backgroundCube_frag:Yw,cube_vert:$w,cube_frag:Zw,depth_vert:qw,depth_frag:jw,distanceRGBA_vert:Kw,distanceRGBA_frag:Jw,equirect_vert:Qw,equirect_frag:tE,linedashed_vert:eE,linedashed_frag:nE,meshbasic_vert:iE,meshbasic_frag:aE,meshlambert_vert:sE,meshlambert_frag:oE,meshmatcap_vert:rE,meshmatcap_frag:cE,meshnormal_vert:lE,meshnormal_frag:hE,meshphong_vert:dE,meshphong_frag:uE,meshphysical_vert:fE,meshphysical_frag:pE,meshtoon_vert:mE,meshtoon_frag:gE,points_vert:xE,points_frag:vE,shadow_vert:yE,shadow_frag:ME,sprite_vert:_E,sprite_frag:bE},Ht={common:{diffuse:{value:new te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ye},alphaMap:{value:null},alphaMapTransform:{value:new ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ye}},envmap:{envMap:{value:null},envMapRotation:{value:new ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ye},normalScale:{value:new Gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ye},alphaTest:{value:0},uvTransform:{value:new ye}},sprite:{diffuse:{value:new te(16777215)},opacity:{value:1},center:{value:new Gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ye},alphaMap:{value:null},alphaMapTransform:{value:new ye},alphaTest:{value:0}}},Ti={basic:{uniforms:Fn([Ht.common,Ht.specularmap,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.fog]),vertexShader:be.meshbasic_vert,fragmentShader:be.meshbasic_frag},lambert:{uniforms:Fn([Ht.common,Ht.specularmap,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.fog,Ht.lights,{emissive:{value:new te(0)}}]),vertexShader:be.meshlambert_vert,fragmentShader:be.meshlambert_frag},phong:{uniforms:Fn([Ht.common,Ht.specularmap,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.fog,Ht.lights,{emissive:{value:new te(0)},specular:{value:new te(1118481)},shininess:{value:30}}]),vertexShader:be.meshphong_vert,fragmentShader:be.meshphong_frag},standard:{uniforms:Fn([Ht.common,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.roughnessmap,Ht.metalnessmap,Ht.fog,Ht.lights,{emissive:{value:new te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:be.meshphysical_vert,fragmentShader:be.meshphysical_frag},toon:{uniforms:Fn([Ht.common,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.gradientmap,Ht.fog,Ht.lights,{emissive:{value:new te(0)}}]),vertexShader:be.meshtoon_vert,fragmentShader:be.meshtoon_frag},matcap:{uniforms:Fn([Ht.common,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.fog,{matcap:{value:null}}]),vertexShader:be.meshmatcap_vert,fragmentShader:be.meshmatcap_frag},points:{uniforms:Fn([Ht.points,Ht.fog]),vertexShader:be.points_vert,fragmentShader:be.points_frag},dashed:{uniforms:Fn([Ht.common,Ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:be.linedashed_vert,fragmentShader:be.linedashed_frag},depth:{uniforms:Fn([Ht.common,Ht.displacementmap]),vertexShader:be.depth_vert,fragmentShader:be.depth_frag},normal:{uniforms:Fn([Ht.common,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,{opacity:{value:1}}]),vertexShader:be.meshnormal_vert,fragmentShader:be.meshnormal_frag},sprite:{uniforms:Fn([Ht.sprite,Ht.fog]),vertexShader:be.sprite_vert,fragmentShader:be.sprite_frag},background:{uniforms:{uvTransform:{value:new ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:be.background_vert,fragmentShader:be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ye}},vertexShader:be.backgroundCube_vert,fragmentShader:be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:be.cube_vert,fragmentShader:be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:be.equirect_vert,fragmentShader:be.equirect_frag},distanceRGBA:{uniforms:Fn([Ht.common,Ht.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:be.distanceRGBA_vert,fragmentShader:be.distanceRGBA_frag},shadow:{uniforms:Fn([Ht.lights,Ht.fog,{color:{value:new te(0)},opacity:{value:1}}]),vertexShader:be.shadow_vert,fragmentShader:be.shadow_frag}};Ti.physical={uniforms:Fn([Ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ye},clearcoatNormalScale:{value:new Gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ye},sheen:{value:0},sheenColor:{value:new te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ye},transmissionSamplerSize:{value:new Gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ye},attenuationDistance:{value:0},attenuationColor:{value:new te(0)},specularColor:{value:new te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ye},anisotropyVector:{value:new Gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ye}}]),vertexShader:be.meshphysical_vert,fragmentShader:be.meshphysical_frag};const _r={r:0,b:0,g:0},Pa=new Di,SE=new De;function wE(n,t,e,i,a,s,o){const r=new te(0);let l=s===!0?0:1,c,h,f=null,d=0,u=null;function m(M){let x=M.isScene===!0?M.background:null;return x&&x.isTexture&&(x=(M.backgroundBlurriness>0?e:t).get(x)),x}function y(M){let x=!1;const v=m(M);v===null?p(r,l):v&&v.isColor&&(p(v,1),x=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(M,x){const v=m(x);v&&(v.isCubeTexture||v.mapping===gc)?(h===void 0&&(h=new Me(new Xn(1,1,1),new xa({name:"BackgroundCubeMaterial",uniforms:Xs(Ti.backgroundCube.uniforms),vertexShader:Ti.backgroundCube.vertexShader,fragmentShader:Ti.backgroundCube.fragmentShader,side:Gn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),Pa.copy(x.backgroundRotation),Pa.x*=-1,Pa.y*=-1,Pa.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Pa.y*=-1,Pa.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(SE.makeRotationFromEuler(Pa)),h.material.toneMapped=Ae.getTransfer(v.colorSpace)!==Be,(f!==v||d!==v.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Me(new ai(2,2),new xa({name:"BackgroundMaterial",uniforms:Xs(Ti.background.uniforms),vertexShader:Ti.background.vertexShader,fragmentShader:Ti.background.fragmentShader,side:ga,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Ae.getTransfer(v.colorSpace)!==Be,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||d!==v.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function p(M,x){M.getRGB(_r,Fm(n)),i.buffers.color.setClear(_r.r,_r.g,_r.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(M,x=1){r.set(M),l=x,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,p(r,l)},render:y,addToRenderList:g}}function EE(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(_,A,k,L,U){let D=!1;const P=f(L,k,A);s!==P&&(s=P,c(s.object)),D=u(_,L,k,U),D&&m(_,L,k,U),U!==null&&t.update(U,n.ELEMENT_ARRAY_BUFFER),(D||o)&&(o=!1,v(_,A,k,L),U!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return n.createVertexArray()}function c(_){return n.bindVertexArray(_)}function h(_){return n.deleteVertexArray(_)}function f(_,A,k){const L=k.wireframe===!0;let U=i[_.id];U===void 0&&(U={},i[_.id]=U);let D=U[A.id];D===void 0&&(D={},U[A.id]=D);let P=D[L];return P===void 0&&(P=d(l()),D[L]=P),P}function d(_){const A=[],k=[],L=[];for(let U=0;U<e;U++)A[U]=0,k[U]=0,L[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:k,attributeDivisors:L,object:_,attributes:{},index:null}}function u(_,A,k,L){const U=s.attributes,D=A.attributes;let P=0;const O=k.getAttributes();for(const B in O)if(O[B].location>=0){const et=U[B];let lt=D[B];if(lt===void 0&&(B==="instanceMatrix"&&_.instanceMatrix&&(lt=_.instanceMatrix),B==="instanceColor"&&_.instanceColor&&(lt=_.instanceColor)),et===void 0||et.attribute!==lt||lt&&et.data!==lt.data)return!0;P++}return s.attributesNum!==P||s.index!==L}function m(_,A,k,L){const U={},D=A.attributes;let P=0;const O=k.getAttributes();for(const B in O)if(O[B].location>=0){let et=D[B];et===void 0&&(B==="instanceMatrix"&&_.instanceMatrix&&(et=_.instanceMatrix),B==="instanceColor"&&_.instanceColor&&(et=_.instanceColor));const lt={};lt.attribute=et,et&&et.data&&(lt.data=et.data),U[B]=lt,P++}s.attributes=U,s.attributesNum=P,s.index=L}function y(){const _=s.newAttributes;for(let A=0,k=_.length;A<k;A++)_[A]=0}function g(_){p(_,0)}function p(_,A){const k=s.newAttributes,L=s.enabledAttributes,U=s.attributeDivisors;k[_]=1,L[_]===0&&(n.enableVertexAttribArray(_),L[_]=1),U[_]!==A&&(n.vertexAttribDivisor(_,A),U[_]=A)}function M(){const _=s.newAttributes,A=s.enabledAttributes;for(let k=0,L=A.length;k<L;k++)A[k]!==_[k]&&(n.disableVertexAttribArray(k),A[k]=0)}function x(_,A,k,L,U,D,P){P===!0?n.vertexAttribIPointer(_,A,k,U,D):n.vertexAttribPointer(_,A,k,L,U,D)}function v(_,A,k,L){y();const U=L.attributes,D=k.getAttributes(),P=A.defaultAttributeValues;for(const O in D){const B=D[O];if(B.location>=0){let W=U[O];if(W===void 0&&(O==="instanceMatrix"&&_.instanceMatrix&&(W=_.instanceMatrix),O==="instanceColor"&&_.instanceColor&&(W=_.instanceColor)),W!==void 0){const et=W.normalized,lt=W.itemSize,pt=t.get(W);if(pt===void 0)continue;const Pt=pt.buffer,Y=pt.type,nt=pt.bytesPerElement,ut=Y===n.INT||Y===n.UNSIGNED_INT||W.gpuType===ed;if(W.isInterleavedBufferAttribute){const st=W.data,tt=st.stride,dt=W.offset;if(st.isInstancedInterleavedBuffer){for(let Ut=0;Ut<B.locationSize;Ut++)p(B.location+Ut,st.meshPerAttribute);_.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let Ut=0;Ut<B.locationSize;Ut++)g(B.location+Ut);n.bindBuffer(n.ARRAY_BUFFER,Pt);for(let Ut=0;Ut<B.locationSize;Ut++)x(B.location+Ut,lt/B.locationSize,Y,et,tt*nt,(dt+lt/B.locationSize*Ut)*nt,ut)}else{if(W.isInstancedBufferAttribute){for(let st=0;st<B.locationSize;st++)p(B.location+st,W.meshPerAttribute);_.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let st=0;st<B.locationSize;st++)g(B.location+st);n.bindBuffer(n.ARRAY_BUFFER,Pt);for(let st=0;st<B.locationSize;st++)x(B.location+st,lt/B.locationSize,Y,et,lt*nt,lt/B.locationSize*st*nt,ut)}}else if(P!==void 0){const et=P[O];if(et!==void 0)switch(et.length){case 2:n.vertexAttrib2fv(B.location,et);break;case 3:n.vertexAttrib3fv(B.location,et);break;case 4:n.vertexAttrib4fv(B.location,et);break;default:n.vertexAttrib1fv(B.location,et)}}}}M()}function w(){T();for(const _ in i){const A=i[_];for(const k in A){const L=A[k];for(const U in L)h(L[U].object),delete L[U];delete A[k]}delete i[_]}}function S(_){if(i[_.id]===void 0)return;const A=i[_.id];for(const k in A){const L=A[k];for(const U in L)h(L[U].object),delete L[U];delete A[k]}delete i[_.id]}function E(_){for(const A in i){const k=i[A];if(k[_.id]===void 0)continue;const L=k[_.id];for(const U in L)h(L[U].object),delete L[U];delete k[_.id]}}function T(){b(),o=!0,s!==a&&(s=a,c(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:T,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:y,enableAttribute:g,disableUnusedAttributes:M}}function TE(n,t,e){let i;function a(c){i=c}function s(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,f){f!==0&&(n.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function r(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let u=0;for(let m=0;m<f;m++)u+=h[m];e.update(u,i,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<c.length;m++)o(c[m],h[m],d[m]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,f);let m=0;for(let y=0;y<f;y++)m+=h[y]*d[y];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function AE(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(E){return!(E!==gi&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(E){const T=E===Vo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==Zi&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Pi&&!T)}function l(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=m>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:m,maxTextureSize:y,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:M,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:w,maxSamples:S}}function RE(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new Ia,r=new ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||a;return a=d,i=f.length,u},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const m=f.clippingPlanes,y=f.clipIntersection,g=f.clipShadows,p=n.get(f);if(!a||m===null||m.length===0||s&&!g)s?h(null):c();else{const M=s?0:i,x=M*4;let v=p.clippingState||null;l.value=v,v=h(m,d,x,u);for(let w=0;w!==x;++w)v[w]=e[w];p.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,m){const y=f!==null?f.length:0;let g=null;if(y!==0){if(g=l.value,m!==!0||g===null){const p=u+y*4,M=d.matrixWorldInverse;r.getNormalMatrix(M),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,v=u;x!==y;++x,v+=4)o.copy(f[x]).applyMatrix4(M,r),o.normal.toArray(g,v),g[v+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,g}}function PE(n){let t=new WeakMap;function e(o,r){return r===sh?o.mapping=Os:r===oh&&(o.mapping=Bs),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===sh||r===oh)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new B1(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class Bm extends Um{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Es=4,Mf=[.125,.215,.35,.446,.526,.582],Na=20,gl=new Bm,_f=new te;let xl=null,vl=0,yl=0,Ml=!1;const za=(1+Math.sqrt(5))/2,xs=1/za,bf=[new H(-za,xs,0),new H(za,xs,0),new H(-xs,0,za),new H(xs,0,za),new H(0,za,-xs),new H(0,za,xs),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)];class Sf{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){xl=this._renderer.getRenderTarget(),vl=this._renderer.getActiveCubeFace(),yl=this._renderer.getActiveMipmapLevel(),Ml=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ef(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(xl,vl,yl),this._renderer.xr.enabled=Ml,t.scissorTest=!1,br(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Os||t.mapping===Bs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),xl=this._renderer.getRenderTarget(),vl=this._renderer.getActiveCubeFace(),yl=this._renderer.getActiveMipmapLevel(),Ml=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Ri,minFilter:Ri,generateMipmaps:!1,type:Vo,format:gi,colorSpace:Vs,depthBuffer:!1},a=wf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wf(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=CE(s)),this._blurMaterial=LE(s,t,e)}return a}_compileMaterial(t){const e=new Me(this._lodPlanes[0],t);this._renderer.compile(e,gl)}_sceneToCubeUV(t,e,i,a){const r=new si(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(_f),h.toneMapping=fa,h.autoClear=!1;const u=new vn({name:"PMREM.Background",side:Gn,depthWrite:!1,depthTest:!1}),m=new Me(new Xn,u);let y=!1;const g=t.background;g?g.isColor&&(u.color.copy(g),t.background=null,y=!0):(u.color.copy(_f),y=!0);for(let p=0;p<6;p++){const M=p%3;M===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):M===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const x=this._cubeSize;br(a,M*x,p>2?x:0,x,x),h.setRenderTarget(a),y&&h.render(m,r),h.render(t,r)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===Os||t.mapping===Bs;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ef());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new Me(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;br(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,gl)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=bf[(a-s-1)%bf.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new Me(this._lodPlanes[a],c),d=c.uniforms,u=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*Na-1),y=s/m,g=isFinite(s)?1+Math.floor(h*y):Na;g>Na&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Na}`);const p=[];let M=0;for(let E=0;E<Na;++E){const T=E/y,b=Math.exp(-T*T/2);p.push(b),E===0?M+=b:E<g&&(M+=2*b)}for(let E=0;E<p.length;E++)p[E]=p[E]/M;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:x}=this;d.dTheta.value=m,d.mipInt.value=x-i;const v=this._sizeLods[a],w=3*v*(a>x-Es?a-x+Es:0),S=4*(this._cubeSize-v);br(e,w,S,3*v,2*v),l.setRenderTarget(e),l.render(f,gl)}}function CE(n){const t=[],e=[],i=[];let a=n;const s=n-Es+1+Mf.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-Es?l=Mf[o-n+Es-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,m=6,y=3,g=2,p=1,M=new Float32Array(y*m*u),x=new Float32Array(g*m*u),v=new Float32Array(p*m*u);for(let S=0;S<u;S++){const E=S%3*2/3-1,T=S>2?0:-1,b=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];M.set(b,y*m*S),x.set(d,g*m*S);const _=[S,S,S,S,S,S];v.set(_,p*m*S)}const w=new cn;w.setAttribute("position",new yn(M,y)),w.setAttribute("uv",new yn(x,g)),w.setAttribute("faceIndex",new yn(v,p)),t.push(w),a>Es&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function wf(n,t,e){const i=new Wa(n,t,e);return i.texture.mapping=gc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function br(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function LE(n,t,e){const i=new Float32Array(Na),a=new H(0,1,0);return new xa({name:"SphericalGaussianBlur",defines:{n:Na,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:ud(),fragmentShader:`

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
		`,blending:ua,depthTest:!1,depthWrite:!1})}function Ef(){return new xa({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ud(),fragmentShader:`

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
		`,blending:ua,depthTest:!1,depthWrite:!1})}function Tf(){return new xa({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ud(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ua,depthTest:!1,depthWrite:!1})}function ud(){return`

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
	`}function DE(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===sh||l===oh,h=l===Os||l===Bs;if(c||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new Sf(n)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return c&&u&&u.height>0||h&&u&&a(u)?(e===null&&(e=new Sf(n)),f=c?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",s),f.texture):null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function kE(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&yo("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function IE(n,t,e,i){const a={},s=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);for(const m in d.morphAttributes){const y=d.morphAttributes[m];for(let g=0,p=y.length;g<p;g++)t.remove(y[g])}d.removeEventListener("dispose",o),delete a[d.id];const u=s.get(d);u&&(t.remove(u),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const m in d)t.update(d[m],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const m in u){const y=u[m];for(let g=0,p=y.length;g<p;g++)t.update(y[g],n.ARRAY_BUFFER)}}function c(f){const d=[],u=f.index,m=f.attributes.position;let y=0;if(u!==null){const M=u.array;y=u.version;for(let x=0,v=M.length;x<v;x+=3){const w=M[x+0],S=M[x+1],E=M[x+2];d.push(w,S,S,E,E,w)}}else if(m!==void 0){const M=m.array;y=m.version;for(let x=0,v=M.length/3-1;x<v;x+=3){const w=x+0,S=x+1,E=x+2;d.push(w,S,S,E,E,w)}}else return;const g=new(Cm(d)?zm:Im)(d,1);g.version=y;const p=s.get(f);p&&t.remove(p),s.set(f,g)}function h(f){const d=s.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return s.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function zE(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,s,d*o),e.update(u,i,1)}function c(d,u,m){m!==0&&(n.drawElementsInstanced(i,u,s,d*o,m),e.update(u,i,m))}function h(d,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,d,0,m);let g=0;for(let p=0;p<m;p++)g+=u[p];e.update(g,i,1)}function f(d,u,m,y){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/o,u[p],y[p]);else{g.multiDrawElementsInstancedWEBGL(i,u,0,s,d,0,y,0,m);let p=0;for(let M=0;M<m;M++)p+=u[M]*y[M];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function FE(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function UE(n,t,e){const i=new WeakMap,a=new sn;function s(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let _=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",_)};var u=_;d!==void 0&&d.texture.dispose();const m=r.morphAttributes.position!==void 0,y=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],M=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let v=0;m===!0&&(v=1),y===!0&&(v=2),g===!0&&(v=3);let w=r.attributes.position.count*v,S=1;w>t.maxTextureSize&&(S=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const E=new Float32Array(w*S*4*f),T=new Dm(E,w,S,f);T.type=Pi,T.needsUpdate=!0;const b=v*4;for(let A=0;A<f;A++){const k=p[A],L=M[A],U=x[A],D=w*S*4*A;for(let P=0;P<k.count;P++){const O=P*b;m===!0&&(a.fromBufferAttribute(k,P),E[D+O+0]=a.x,E[D+O+1]=a.y,E[D+O+2]=a.z,E[D+O+3]=0),y===!0&&(a.fromBufferAttribute(L,P),E[D+O+4]=a.x,E[D+O+5]=a.y,E[D+O+6]=a.z,E[D+O+7]=0),g===!0&&(a.fromBufferAttribute(U,P),E[D+O+8]=a.x,E[D+O+9]=a.y,E[D+O+10]=a.z,E[D+O+11]=U.itemSize===4?a.w:1)}}d={count:f,texture:T,size:new Gt(w,S)},i.set(r,d),r.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const y=r.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",y),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function NE(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(a.get(f)!==c&&(t.update(f),a.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return f}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class Hm extends Pn{constructor(t,e,i,a,s,o,r,l,c,h=Ps){if(h!==Ps&&h!==Gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Ps&&(i=Va),i===void 0&&h===Gs&&(i=Hs),super(null,a,s,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Jn,this.minFilter=l!==void 0?l:Jn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Gm=new Pn,Af=new Hm(1,1),Xm=new Dm,Vm=new w1,Wm=new Nm,Rf=[],Pf=[],Cf=new Float32Array(16),Lf=new Float32Array(9),Df=new Float32Array(4);function $s(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Rf[a];if(s===void 0&&(s=new Float32Array(a),Rf[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function pn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function mn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function vc(n,t){let e=Pf[t];e===void 0&&(e=new Int32Array(t),Pf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function OE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function BE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pn(e,t))return;n.uniform2fv(this.addr,t),mn(e,t)}}function HE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(pn(e,t))return;n.uniform3fv(this.addr,t),mn(e,t)}}function GE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pn(e,t))return;n.uniform4fv(this.addr,t),mn(e,t)}}function XE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(pn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),mn(e,t)}else{if(pn(e,i))return;Df.set(i),n.uniformMatrix2fv(this.addr,!1,Df),mn(e,i)}}function VE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(pn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),mn(e,t)}else{if(pn(e,i))return;Lf.set(i),n.uniformMatrix3fv(this.addr,!1,Lf),mn(e,i)}}function WE(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(pn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),mn(e,t)}else{if(pn(e,i))return;Cf.set(i),n.uniformMatrix4fv(this.addr,!1,Cf),mn(e,i)}}function YE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function $E(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pn(e,t))return;n.uniform2iv(this.addr,t),mn(e,t)}}function ZE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pn(e,t))return;n.uniform3iv(this.addr,t),mn(e,t)}}function qE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pn(e,t))return;n.uniform4iv(this.addr,t),mn(e,t)}}function jE(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function KE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pn(e,t))return;n.uniform2uiv(this.addr,t),mn(e,t)}}function JE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pn(e,t))return;n.uniform3uiv(this.addr,t),mn(e,t)}}function QE(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pn(e,t))return;n.uniform4uiv(this.addr,t),mn(e,t)}}function tT(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Af.compareFunction=Pm,s=Af):s=Gm,e.setTexture2D(t||s,a)}function eT(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||Vm,a)}function nT(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||Wm,a)}function iT(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Xm,a)}function aT(n){switch(n){case 5126:return OE;case 35664:return BE;case 35665:return HE;case 35666:return GE;case 35674:return XE;case 35675:return VE;case 35676:return WE;case 5124:case 35670:return YE;case 35667:case 35671:return $E;case 35668:case 35672:return ZE;case 35669:case 35673:return qE;case 5125:return jE;case 36294:return KE;case 36295:return JE;case 36296:return QE;case 35678:case 36198:case 36298:case 36306:case 35682:return tT;case 35679:case 36299:case 36307:return eT;case 35680:case 36300:case 36308:case 36293:return nT;case 36289:case 36303:case 36311:case 36292:return iT}}function sT(n,t){n.uniform1fv(this.addr,t)}function oT(n,t){const e=$s(t,this.size,2);n.uniform2fv(this.addr,e)}function rT(n,t){const e=$s(t,this.size,3);n.uniform3fv(this.addr,e)}function cT(n,t){const e=$s(t,this.size,4);n.uniform4fv(this.addr,e)}function lT(n,t){const e=$s(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function hT(n,t){const e=$s(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function dT(n,t){const e=$s(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function uT(n,t){n.uniform1iv(this.addr,t)}function fT(n,t){n.uniform2iv(this.addr,t)}function pT(n,t){n.uniform3iv(this.addr,t)}function mT(n,t){n.uniform4iv(this.addr,t)}function gT(n,t){n.uniform1uiv(this.addr,t)}function xT(n,t){n.uniform2uiv(this.addr,t)}function vT(n,t){n.uniform3uiv(this.addr,t)}function yT(n,t){n.uniform4uiv(this.addr,t)}function MT(n,t,e){const i=this.cache,a=t.length,s=vc(e,a);pn(i,s)||(n.uniform1iv(this.addr,s),mn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||Gm,s[o])}function _T(n,t,e){const i=this.cache,a=t.length,s=vc(e,a);pn(i,s)||(n.uniform1iv(this.addr,s),mn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||Vm,s[o])}function bT(n,t,e){const i=this.cache,a=t.length,s=vc(e,a);pn(i,s)||(n.uniform1iv(this.addr,s),mn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||Wm,s[o])}function ST(n,t,e){const i=this.cache,a=t.length,s=vc(e,a);pn(i,s)||(n.uniform1iv(this.addr,s),mn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Xm,s[o])}function wT(n){switch(n){case 5126:return sT;case 35664:return oT;case 35665:return rT;case 35666:return cT;case 35674:return lT;case 35675:return hT;case 35676:return dT;case 5124:case 35670:return uT;case 35667:case 35671:return fT;case 35668:case 35672:return pT;case 35669:case 35673:return mT;case 5125:return gT;case 36294:return xT;case 36295:return vT;case 36296:return yT;case 35678:case 36198:case 36298:case 36306:case 35682:return MT;case 35679:case 36299:case 36307:return _T;case 35680:case 36300:case 36308:case 36293:return bT;case 36289:case 36303:case 36311:case 36292:return ST}}class ET{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=aT(e.type)}}class TT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=wT(e.type)}}class AT{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const _l=/(\w+)(\])?(\[|\.)?/g;function kf(n,t){n.seq.push(t),n.map[t.id]=t}function RT(n,t,e){const i=n.name,a=i.length;for(_l.lastIndex=0;;){const s=_l.exec(i),o=_l.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){kf(e,c===void 0?new ET(r,n,t):new TT(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new AT(r),kf(e,f)),e=f}}}class Xr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);RT(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function If(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const PT=37297;let CT=0;function LT(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const zf=new ye;function DT(n){Ae._getMatrix(zf,Ae.workingColorSpace,n);const t=`mat3( ${zf.elements.map(e=>e.toFixed(4))} )`;switch(Ae.getTransfer(n)){case xc:return[t,"LinearTransferOETF"];case Be:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Ff(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+LT(n.getShaderSource(t),o)}else return a}function kT(n,t){const e=DT(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function IT(n,t){let e;switch(t){case Fb:e="Linear";break;case Ub:e="Reinhard";break;case Nb:e="Cineon";break;case Ob:e="ACESFilmic";break;case Hb:e="AgX";break;case Gb:e="Neutral";break;case Bb:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Sr=new H;function zT(){Ae.getLuminanceCoefficients(Sr);const n=Sr.x.toFixed(4),t=Sr.y.toFixed(4),e=Sr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function FT(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Mo).join(`
`)}function UT(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function NT(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function Mo(n){return n!==""}function Uf(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Nf(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const OT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fh(n){return n.replace(OT,HT)}const BT=new Map;function HT(n,t){let e=be[t];if(e===void 0){const i=BT.get(t);if(i!==void 0)e=be[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Fh(e)}const GT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Of(n){return n.replace(GT,XT)}function XT(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Bf(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function VT(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===gm?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===xm?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Gi&&(t="SHADOWMAP_TYPE_VSM"),t}function WT(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Os:case Bs:t="ENVMAP_TYPE_CUBE";break;case gc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function YT(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Bs:t="ENVMAP_MODE_REFRACTION";break}return t}function $T(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case td:t="ENVMAP_BLENDING_MULTIPLY";break;case Ib:t="ENVMAP_BLENDING_MIX";break;case zb:t="ENVMAP_BLENDING_ADD";break}return t}function ZT(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function qT(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=VT(e),c=WT(e),h=YT(e),f=$T(e),d=ZT(e),u=FT(e),m=UT(s),y=a.createProgram();let g,p,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Mo).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Mo).join(`
`),p.length>0&&(p+=`
`)):(g=[Bf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Mo).join(`
`),p=[Bf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==fa?"#define TONE_MAPPING":"",e.toneMapping!==fa?be.tonemapping_pars_fragment:"",e.toneMapping!==fa?IT("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",be.colorspace_pars_fragment,kT("linearToOutputTexel",e.outputColorSpace),zT(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Mo).join(`
`)),o=Fh(o),o=Uf(o,e),o=Nf(o,e),r=Fh(r),r=Uf(r,e),r=Nf(r,e),o=Of(o),r=Of(r),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===ju?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ju?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=M+g+o,v=M+p+r,w=If(a,a.VERTEX_SHADER,x),S=If(a,a.FRAGMENT_SHADER,v);a.attachShader(y,w),a.attachShader(y,S),e.index0AttributeName!==void 0?a.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(y,0,"position"),a.linkProgram(y);function E(A){if(n.debug.checkShaderErrors){const k=a.getProgramInfoLog(y).trim(),L=a.getShaderInfoLog(w).trim(),U=a.getShaderInfoLog(S).trim();let D=!0,P=!0;if(a.getProgramParameter(y,a.LINK_STATUS)===!1)if(D=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,y,w,S);else{const O=Ff(a,w,"vertex"),B=Ff(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(y,a.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+k+`
`+O+`
`+B)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(L===""||U==="")&&(P=!1);P&&(A.diagnostics={runnable:D,programLog:k,vertexShader:{log:L,prefix:g},fragmentShader:{log:U,prefix:p}})}a.deleteShader(w),a.deleteShader(S),T=new Xr(a,y),b=NT(a,y)}let T;this.getUniforms=function(){return T===void 0&&E(this),T};let b;this.getAttributes=function(){return b===void 0&&E(this),b};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=a.getProgramParameter(y,PT)),_},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=CT++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=w,this.fragmentShader=S,this}let jT=0;class KT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new JT(t),e.set(t,i)),i}}class JT{constructor(t){this.id=jT++,this.code=t,this.usedTimes=0}}function QT(n,t,e,i,a,s,o){const r=new hd,l=new KT,c=new Set,h=[],f=a.logarithmicDepthBuffer,d=a.vertexTextures;let u=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,_,A,k,L){const U=k.fog,D=L.geometry,P=b.isMeshStandardMaterial?k.environment:null,O=(b.isMeshStandardMaterial?e:t).get(b.envMap||P),B=O&&O.mapping===gc?O.image.height:null,W=m[b.type];b.precision!==null&&(u=a.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const et=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,lt=et!==void 0?et.length:0;let pt=0;D.morphAttributes.position!==void 0&&(pt=1),D.morphAttributes.normal!==void 0&&(pt=2),D.morphAttributes.color!==void 0&&(pt=3);let Pt,Y,nt,ut;if(W){const ne=Ti[W];Pt=ne.vertexShader,Y=ne.fragmentShader}else Pt=b.vertexShader,Y=b.fragmentShader,l.update(b),nt=l.getVertexShaderID(b),ut=l.getFragmentShaderID(b);const st=n.getRenderTarget(),tt=n.state.buffers.depth.getReversed(),dt=L.isInstancedMesh===!0,Ut=L.isBatchedMesh===!0,Vt=!!b.map,ht=!!b.matcap,X=!!O,N=!!b.aoMap,At=!!b.lightMap,Rt=!!b.bumpMap,St=!!b.normalMap,vt=!!b.displacementMap,mt=!!b.emissiveMap,kt=!!b.metalnessMap,F=!!b.roughnessMap,R=b.anisotropy>0,K=b.clearcoat>0,ft=b.dispersion>0,V=b.iridescence>0,ot=b.sheen>0,zt=b.transmission>0,Et=R&&!!b.anisotropyMap,bt=K&&!!b.clearcoatMap,Wt=K&&!!b.clearcoatNormalMap,gt=K&&!!b.clearcoatRoughnessMap,Lt=V&&!!b.iridescenceMap,j=V&&!!b.iridescenceThicknessMap,$=ot&&!!b.sheenColorMap,ct=ot&&!!b.sheenRoughnessMap,Nt=!!b.specularMap,Ft=!!b.specularColorMap,Ct=!!b.specularIntensityMap,I=zt&&!!b.transmissionMap,yt=zt&&!!b.thicknessMap,Q=!!b.gradientMap,rt=!!b.alphaMap,Dt=b.alphaTest>0,Tt=!!b.alphaHash,qt=!!b.extensions;let he=fa;b.toneMapped&&(st===null||st.isXRRenderTarget===!0)&&(he=n.toneMapping);const de={shaderID:W,shaderType:b.type,shaderName:b.name,vertexShader:Pt,fragmentShader:Y,defines:b.defines,customVertexShaderID:nt,customFragmentShaderID:ut,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:Ut,batchingColor:Ut&&L._colorsTexture!==null,instancing:dt,instancingColor:dt&&L.instanceColor!==null,instancingMorph:dt&&L.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:st===null?n.outputColorSpace:st.isXRRenderTarget===!0?st.texture.colorSpace:Vs,alphaToCoverage:!!b.alphaToCoverage,map:Vt,matcap:ht,envMap:X,envMapMode:X&&O.mapping,envMapCubeUVHeight:B,aoMap:N,lightMap:At,bumpMap:Rt,normalMap:St,displacementMap:d&&vt,emissiveMap:mt,normalMapObjectSpace:St&&b.normalMapType===Yb,normalMapTangentSpace:St&&b.normalMapType===Rm,metalnessMap:kt,roughnessMap:F,anisotropy:R,anisotropyMap:Et,clearcoat:K,clearcoatMap:bt,clearcoatNormalMap:Wt,clearcoatRoughnessMap:gt,dispersion:ft,iridescence:V,iridescenceMap:Lt,iridescenceThicknessMap:j,sheen:ot,sheenColorMap:$,sheenRoughnessMap:ct,specularMap:Nt,specularColorMap:Ft,specularIntensityMap:Ct,transmission:zt,transmissionMap:I,thicknessMap:yt,gradientMap:Q,opaque:b.transparent===!1&&b.blending===Rs&&b.alphaToCoverage===!1,alphaMap:rt,alphaTest:Dt,alphaHash:Tt,combine:b.combine,mapUv:Vt&&y(b.map.channel),aoMapUv:N&&y(b.aoMap.channel),lightMapUv:At&&y(b.lightMap.channel),bumpMapUv:Rt&&y(b.bumpMap.channel),normalMapUv:St&&y(b.normalMap.channel),displacementMapUv:vt&&y(b.displacementMap.channel),emissiveMapUv:mt&&y(b.emissiveMap.channel),metalnessMapUv:kt&&y(b.metalnessMap.channel),roughnessMapUv:F&&y(b.roughnessMap.channel),anisotropyMapUv:Et&&y(b.anisotropyMap.channel),clearcoatMapUv:bt&&y(b.clearcoatMap.channel),clearcoatNormalMapUv:Wt&&y(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:gt&&y(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Lt&&y(b.iridescenceMap.channel),iridescenceThicknessMapUv:j&&y(b.iridescenceThicknessMap.channel),sheenColorMapUv:$&&y(b.sheenColorMap.channel),sheenRoughnessMapUv:ct&&y(b.sheenRoughnessMap.channel),specularMapUv:Nt&&y(b.specularMap.channel),specularColorMapUv:Ft&&y(b.specularColorMap.channel),specularIntensityMapUv:Ct&&y(b.specularIntensityMap.channel),transmissionMapUv:I&&y(b.transmissionMap.channel),thicknessMapUv:yt&&y(b.thicknessMap.channel),alphaMapUv:rt&&y(b.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(St||R),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!D.attributes.uv&&(Vt||rt),fog:!!U,useFog:b.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:tt,skinning:L.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:lt,morphTextureStride:pt,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&A.length>0,shadowMapType:n.shadowMap.type,toneMapping:he,decodeVideoTexture:Vt&&b.map.isVideoTexture===!0&&Ae.getTransfer(b.map.colorSpace)===Be,decodeVideoTextureEmissive:mt&&b.emissiveMap.isVideoTexture===!0&&Ae.getTransfer(b.emissiveMap.colorSpace)===Be,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ke,flipSided:b.side===Gn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:qt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(qt&&b.extensions.multiDraw===!0||Ut)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return de.vertexUv1s=c.has(1),de.vertexUv2s=c.has(2),de.vertexUv3s=c.has(3),c.clear(),de}function p(b){const _=[];if(b.shaderID?_.push(b.shaderID):(_.push(b.customVertexShaderID),_.push(b.customFragmentShaderID)),b.defines!==void 0)for(const A in b.defines)_.push(A),_.push(b.defines[A]);return b.isRawShaderMaterial===!1&&(M(_,b),x(_,b),_.push(n.outputColorSpace)),_.push(b.customProgramCacheKey),_.join()}function M(b,_){b.push(_.precision),b.push(_.outputColorSpace),b.push(_.envMapMode),b.push(_.envMapCubeUVHeight),b.push(_.mapUv),b.push(_.alphaMapUv),b.push(_.lightMapUv),b.push(_.aoMapUv),b.push(_.bumpMapUv),b.push(_.normalMapUv),b.push(_.displacementMapUv),b.push(_.emissiveMapUv),b.push(_.metalnessMapUv),b.push(_.roughnessMapUv),b.push(_.anisotropyMapUv),b.push(_.clearcoatMapUv),b.push(_.clearcoatNormalMapUv),b.push(_.clearcoatRoughnessMapUv),b.push(_.iridescenceMapUv),b.push(_.iridescenceThicknessMapUv),b.push(_.sheenColorMapUv),b.push(_.sheenRoughnessMapUv),b.push(_.specularMapUv),b.push(_.specularColorMapUv),b.push(_.specularIntensityMapUv),b.push(_.transmissionMapUv),b.push(_.thicknessMapUv),b.push(_.combine),b.push(_.fogExp2),b.push(_.sizeAttenuation),b.push(_.morphTargetsCount),b.push(_.morphAttributeCount),b.push(_.numDirLights),b.push(_.numPointLights),b.push(_.numSpotLights),b.push(_.numSpotLightMaps),b.push(_.numHemiLights),b.push(_.numRectAreaLights),b.push(_.numDirLightShadows),b.push(_.numPointLightShadows),b.push(_.numSpotLightShadows),b.push(_.numSpotLightShadowsWithMaps),b.push(_.numLightProbes),b.push(_.shadowMapType),b.push(_.toneMapping),b.push(_.numClippingPlanes),b.push(_.numClipIntersection),b.push(_.depthPacking)}function x(b,_){r.disableAll(),_.supportsVertexTextures&&r.enable(0),_.instancing&&r.enable(1),_.instancingColor&&r.enable(2),_.instancingMorph&&r.enable(3),_.matcap&&r.enable(4),_.envMap&&r.enable(5),_.normalMapObjectSpace&&r.enable(6),_.normalMapTangentSpace&&r.enable(7),_.clearcoat&&r.enable(8),_.iridescence&&r.enable(9),_.alphaTest&&r.enable(10),_.vertexColors&&r.enable(11),_.vertexAlphas&&r.enable(12),_.vertexUv1s&&r.enable(13),_.vertexUv2s&&r.enable(14),_.vertexUv3s&&r.enable(15),_.vertexTangents&&r.enable(16),_.anisotropy&&r.enable(17),_.alphaHash&&r.enable(18),_.batching&&r.enable(19),_.dispersion&&r.enable(20),_.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),_.fog&&r.enable(0),_.useFog&&r.enable(1),_.flatShading&&r.enable(2),_.logarithmicDepthBuffer&&r.enable(3),_.reverseDepthBuffer&&r.enable(4),_.skinning&&r.enable(5),_.morphTargets&&r.enable(6),_.morphNormals&&r.enable(7),_.morphColors&&r.enable(8),_.premultipliedAlpha&&r.enable(9),_.shadowMapEnabled&&r.enable(10),_.doubleSided&&r.enable(11),_.flipSided&&r.enable(12),_.useDepthPacking&&r.enable(13),_.dithering&&r.enable(14),_.transmission&&r.enable(15),_.sheen&&r.enable(16),_.opaque&&r.enable(17),_.pointsUvs&&r.enable(18),_.decodeVideoTexture&&r.enable(19),_.decodeVideoTextureEmissive&&r.enable(20),_.alphaToCoverage&&r.enable(21),b.push(r.mask)}function v(b){const _=m[b.type];let A;if(_){const k=Ti[_];A=F1.clone(k.uniforms)}else A=b.uniforms;return A}function w(b,_){let A;for(let k=0,L=h.length;k<L;k++){const U=h[k];if(U.cacheKey===_){A=U,++A.usedTimes;break}}return A===void 0&&(A=new qT(n,_,b,s),h.push(A)),A}function S(b){if(--b.usedTimes===0){const _=h.indexOf(b);h[_]=h[h.length-1],h.pop(),b.destroy()}}function E(b){l.remove(b)}function T(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:v,acquireProgram:w,releaseProgram:S,releaseShaderCache:E,programs:h,dispose:T}}function tA(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function eA(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Hf(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Gf(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(f,d,u,m,y,g){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:m,renderOrder:f.renderOrder,z:y,group:g},n[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=m,p.renderOrder=f.renderOrder,p.z=y,p.group=g),t++,p}function r(f,d,u,m,y,g){const p=o(f,d,u,m,y,g);u.transmission>0?i.push(p):u.transparent===!0?a.push(p):e.push(p)}function l(f,d,u,m,y,g){const p=o(f,d,u,m,y,g);u.transmission>0?i.unshift(p):u.transparent===!0?a.unshift(p):e.unshift(p)}function c(f,d){e.length>1&&e.sort(f||eA),i.length>1&&i.sort(d||Hf),a.length>1&&a.sort(d||Hf)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:h,sort:c}}function nA(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new Gf,n.set(i,[o])):a>=s.length?(o=new Gf,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function iA(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new H,color:new te};break;case"SpotLight":e={position:new H,direction:new H,color:new te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new H,color:new te,distance:0,decay:0};break;case"HemisphereLight":e={direction:new H,skyColor:new te,groundColor:new te};break;case"RectAreaLight":e={color:new te,position:new H,halfWidth:new H,halfHeight:new H};break}return n[t.id]=e,e}}}function aA(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let sA=0;function oA(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function rA(n){const t=new iA,e=aA(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new H);const a=new H,s=new De,o=new De;function r(c){let h=0,f=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let u=0,m=0,y=0,g=0,p=0,M=0,x=0,v=0,w=0,S=0,E=0;c.sort(oA);for(let b=0,_=c.length;b<_;b++){const A=c[b],k=A.color,L=A.intensity,U=A.distance,D=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=k.r*L,f+=k.g*L,d+=k.b*L;else if(A.isLightProbe){for(let P=0;P<9;P++)i.probe[P].addScaledVector(A.sh.coefficients[P],L);E++}else if(A.isDirectionalLight){const P=t.get(A);if(P.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const O=A.shadow,B=e.get(A);B.shadowIntensity=O.intensity,B.shadowBias=O.bias,B.shadowNormalBias=O.normalBias,B.shadowRadius=O.radius,B.shadowMapSize=O.mapSize,i.directionalShadow[u]=B,i.directionalShadowMap[u]=D,i.directionalShadowMatrix[u]=A.shadow.matrix,M++}i.directional[u]=P,u++}else if(A.isSpotLight){const P=t.get(A);P.position.setFromMatrixPosition(A.matrixWorld),P.color.copy(k).multiplyScalar(L),P.distance=U,P.coneCos=Math.cos(A.angle),P.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),P.decay=A.decay,i.spot[y]=P;const O=A.shadow;if(A.map&&(i.spotLightMap[w]=A.map,w++,O.updateMatrices(A),A.castShadow&&S++),i.spotLightMatrix[y]=O.matrix,A.castShadow){const B=e.get(A);B.shadowIntensity=O.intensity,B.shadowBias=O.bias,B.shadowNormalBias=O.normalBias,B.shadowRadius=O.radius,B.shadowMapSize=O.mapSize,i.spotShadow[y]=B,i.spotShadowMap[y]=D,v++}y++}else if(A.isRectAreaLight){const P=t.get(A);P.color.copy(k).multiplyScalar(L),P.halfWidth.set(A.width*.5,0,0),P.halfHeight.set(0,A.height*.5,0),i.rectArea[g]=P,g++}else if(A.isPointLight){const P=t.get(A);if(P.color.copy(A.color).multiplyScalar(A.intensity),P.distance=A.distance,P.decay=A.decay,A.castShadow){const O=A.shadow,B=e.get(A);B.shadowIntensity=O.intensity,B.shadowBias=O.bias,B.shadowNormalBias=O.normalBias,B.shadowRadius=O.radius,B.shadowMapSize=O.mapSize,B.shadowCameraNear=O.camera.near,B.shadowCameraFar=O.camera.far,i.pointShadow[m]=B,i.pointShadowMap[m]=D,i.pointShadowMatrix[m]=A.shadow.matrix,x++}i.point[m]=P,m++}else if(A.isHemisphereLight){const P=t.get(A);P.skyColor.copy(A.color).multiplyScalar(L),P.groundColor.copy(A.groundColor).multiplyScalar(L),i.hemi[p]=P,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ht.LTC_FLOAT_1,i.rectAreaLTC2=Ht.LTC_FLOAT_2):(i.rectAreaLTC1=Ht.LTC_HALF_1,i.rectAreaLTC2=Ht.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==u||T.pointLength!==m||T.spotLength!==y||T.rectAreaLength!==g||T.hemiLength!==p||T.numDirectionalShadows!==M||T.numPointShadows!==x||T.numSpotShadows!==v||T.numSpotMaps!==w||T.numLightProbes!==E)&&(i.directional.length=u,i.spot.length=y,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=v+w-S,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=E,T.directionalLength=u,T.pointLength=m,T.spotLength=y,T.rectAreaLength=g,T.hemiLength=p,T.numDirectionalShadows=M,T.numPointShadows=x,T.numSpotShadows=v,T.numSpotMaps=w,T.numLightProbes=E,i.version=sA++)}function l(c,h){let f=0,d=0,u=0,m=0,y=0;const g=h.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){const x=c[p];if(x.isDirectionalLight){const v=i.directional[f];v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(g),f++}else if(x.isSpotLight){const v=i.spot[u];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(g),u++}else if(x.isRectAreaLight){const v=i.rectArea[m];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),d++}else if(x.isHemisphereLight){const v=i.hemi[y];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(g),y++}}}return{setup:r,setupView:l,state:i}}function Xf(n){const t=new rA(n),e=[],i=[];function a(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function cA(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new Xf(n),t.set(a,[r])):s>=o.length?(r=new Xf(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class lA extends Za{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Vb,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class hA extends Za{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const dA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,uA=`uniform sampler2D shadow_pass;
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
}`;function fA(n,t,e){let i=new dd;const a=new Gt,s=new Gt,o=new sn,r=new lA({depthPacking:Wb}),l=new hA,c={},h=e.maxTextureSize,f={[ga]:Gn,[Gn]:ga,[Ke]:Ke},d=new xa({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Gt},radius:{value:4}},vertexShader:dA,fragmentShader:uA}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const m=new cn;m.setAttribute("position",new yn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Me(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gm;let p=this.type;this.render=function(S,E,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const b=n.getRenderTarget(),_=n.getActiveCubeFace(),A=n.getActiveMipmapLevel(),k=n.state;k.setBlending(ua),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const L=p!==Gi&&this.type===Gi,U=p===Gi&&this.type!==Gi;for(let D=0,P=S.length;D<P;D++){const O=S[D],B=O.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",O,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;a.copy(B.mapSize);const W=B.getFrameExtents();if(a.multiply(W),s.copy(B.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/W.x),a.x=s.x*W.x,B.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/W.y),a.y=s.y*W.y,B.mapSize.y=s.y)),B.map===null||L===!0||U===!0){const lt=this.type!==Gi?{minFilter:Jn,magFilter:Jn}:{};B.map!==null&&B.map.dispose(),B.map=new Wa(a.x,a.y,lt),B.map.texture.name=O.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const et=B.getViewportCount();for(let lt=0;lt<et;lt++){const pt=B.getViewport(lt);o.set(s.x*pt.x,s.y*pt.y,s.x*pt.z,s.y*pt.w),k.viewport(o),B.updateMatrices(O,lt),i=B.getFrustum(),v(E,T,B.camera,O,this.type)}B.isPointLightShadow!==!0&&this.type===Gi&&M(B,T),B.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(b,_,A)};function M(S,E){const T=t.update(y);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,u.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Wa(a.x,a.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(E,null,T,d,y,null),u.uniforms.shadow_pass.value=S.mapPass.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(E,null,T,u,y,null)}function x(S,E,T,b){let _=null;const A=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(A!==void 0)_=A;else if(_=T.isPointLight===!0?l:r,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const k=_.uuid,L=E.uuid;let U=c[k];U===void 0&&(U={},c[k]=U);let D=U[L];D===void 0&&(D=_.clone(),U[L]=D,E.addEventListener("dispose",w)),_=D}if(_.visible=E.visible,_.wireframe=E.wireframe,b===Gi?_.side=E.shadowSide!==null?E.shadowSide:E.side:_.side=E.shadowSide!==null?E.shadowSide:f[E.side],_.alphaMap=E.alphaMap,_.alphaTest=E.alphaTest,_.map=E.map,_.clipShadows=E.clipShadows,_.clippingPlanes=E.clippingPlanes,_.clipIntersection=E.clipIntersection,_.displacementMap=E.displacementMap,_.displacementScale=E.displacementScale,_.displacementBias=E.displacementBias,_.wireframeLinewidth=E.wireframeLinewidth,_.linewidth=E.linewidth,T.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const k=n.properties.get(_);k.light=T}return _}function v(S,E,T,b,_){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&_===Gi)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const L=t.update(S),U=S.material;if(Array.isArray(U)){const D=L.groups;for(let P=0,O=D.length;P<O;P++){const B=D[P],W=U[B.materialIndex];if(W&&W.visible){const et=x(S,W,b,_);S.onBeforeShadow(n,S,E,T,L,et,B),n.renderBufferDirect(T,null,L,et,S,B),S.onAfterShadow(n,S,E,T,L,et,B)}}}else if(U.visible){const D=x(S,U,b,_);S.onBeforeShadow(n,S,E,T,L,D,null),n.renderBufferDirect(T,null,L,D,S,null),S.onAfterShadow(n,S,E,T,L,D,null)}}const k=S.children;for(let L=0,U=k.length;L<U;L++)v(k[L],E,T,b,_)}function w(S){S.target.removeEventListener("dispose",w);for(const T in c){const b=c[T],_=S.target.uuid;_ in b&&(b[_].dispose(),delete b[_])}}}const pA={[Jl]:Ql,[th]:ih,[eh]:ah,[Ns]:nh,[Ql]:Jl,[ih]:th,[ah]:eh,[nh]:Ns};function mA(n,t){function e(){let I=!1;const yt=new sn;let Q=null;const rt=new sn(0,0,0,0);return{setMask:function(Dt){Q!==Dt&&!I&&(n.colorMask(Dt,Dt,Dt,Dt),Q=Dt)},setLocked:function(Dt){I=Dt},setClear:function(Dt,Tt,qt,he,de){de===!0&&(Dt*=he,Tt*=he,qt*=he),yt.set(Dt,Tt,qt,he),rt.equals(yt)===!1&&(n.clearColor(Dt,Tt,qt,he),rt.copy(yt))},reset:function(){I=!1,Q=null,rt.set(-1,0,0,0)}}}function i(){let I=!1,yt=!1,Q=null,rt=null,Dt=null;return{setReversed:function(Tt){if(yt!==Tt){const qt=t.get("EXT_clip_control");yt?qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.ZERO_TO_ONE_EXT):qt.clipControlEXT(qt.LOWER_LEFT_EXT,qt.NEGATIVE_ONE_TO_ONE_EXT);const he=Dt;Dt=null,this.setClear(he)}yt=Tt},getReversed:function(){return yt},setTest:function(Tt){Tt?st(n.DEPTH_TEST):tt(n.DEPTH_TEST)},setMask:function(Tt){Q!==Tt&&!I&&(n.depthMask(Tt),Q=Tt)},setFunc:function(Tt){if(yt&&(Tt=pA[Tt]),rt!==Tt){switch(Tt){case Jl:n.depthFunc(n.NEVER);break;case Ql:n.depthFunc(n.ALWAYS);break;case th:n.depthFunc(n.LESS);break;case Ns:n.depthFunc(n.LEQUAL);break;case eh:n.depthFunc(n.EQUAL);break;case nh:n.depthFunc(n.GEQUAL);break;case ih:n.depthFunc(n.GREATER);break;case ah:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}rt=Tt}},setLocked:function(Tt){I=Tt},setClear:function(Tt){Dt!==Tt&&(yt&&(Tt=1-Tt),n.clearDepth(Tt),Dt=Tt)},reset:function(){I=!1,Q=null,rt=null,Dt=null,yt=!1}}}function a(){let I=!1,yt=null,Q=null,rt=null,Dt=null,Tt=null,qt=null,he=null,de=null;return{setTest:function(ne){I||(ne?st(n.STENCIL_TEST):tt(n.STENCIL_TEST))},setMask:function(ne){yt!==ne&&!I&&(n.stencilMask(ne),yt=ne)},setFunc:function(ne,Ee,Ie){(Q!==ne||rt!==Ee||Dt!==Ie)&&(n.stencilFunc(ne,Ee,Ie),Q=ne,rt=Ee,Dt=Ie)},setOp:function(ne,Ee,Ie){(Tt!==ne||qt!==Ee||he!==Ie)&&(n.stencilOp(ne,Ee,Ie),Tt=ne,qt=Ee,he=Ie)},setLocked:function(ne){I=ne},setClear:function(ne){de!==ne&&(n.clearStencil(ne),de=ne)},reset:function(){I=!1,yt=null,Q=null,rt=null,Dt=null,Tt=null,qt=null,he=null,de=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],m=null,y=!1,g=null,p=null,M=null,x=null,v=null,w=null,S=null,E=new te(0,0,0),T=0,b=!1,_=null,A=null,k=null,L=null,U=null;const D=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let P=!1,O=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(B)[1]),P=O>=1):B.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),P=O>=2);let W=null,et={};const lt=n.getParameter(n.SCISSOR_BOX),pt=n.getParameter(n.VIEWPORT),Pt=new sn().fromArray(lt),Y=new sn().fromArray(pt);function nt(I,yt,Q,rt){const Dt=new Uint8Array(4),Tt=n.createTexture();n.bindTexture(I,Tt),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let qt=0;qt<Q;qt++)I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY?n.texImage3D(yt,0,n.RGBA,1,1,rt,0,n.RGBA,n.UNSIGNED_BYTE,Dt):n.texImage2D(yt+qt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Dt);return Tt}const ut={};ut[n.TEXTURE_2D]=nt(n.TEXTURE_2D,n.TEXTURE_2D,1),ut[n.TEXTURE_CUBE_MAP]=nt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ut[n.TEXTURE_2D_ARRAY]=nt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ut[n.TEXTURE_3D]=nt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),st(n.DEPTH_TEST),o.setFunc(Ns),Rt(!1),St(Yu),st(n.CULL_FACE),N(ua);function st(I){h[I]!==!0&&(n.enable(I),h[I]=!0)}function tt(I){h[I]!==!1&&(n.disable(I),h[I]=!1)}function dt(I,yt){return f[I]!==yt?(n.bindFramebuffer(I,yt),f[I]=yt,I===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=yt),I===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=yt),!0):!1}function Ut(I,yt){let Q=u,rt=!1;if(I){Q=d.get(yt),Q===void 0&&(Q=[],d.set(yt,Q));const Dt=I.textures;if(Q.length!==Dt.length||Q[0]!==n.COLOR_ATTACHMENT0){for(let Tt=0,qt=Dt.length;Tt<qt;Tt++)Q[Tt]=n.COLOR_ATTACHMENT0+Tt;Q.length=Dt.length,rt=!0}}else Q[0]!==n.BACK&&(Q[0]=n.BACK,rt=!0);rt&&n.drawBuffers(Q)}function Vt(I){return m!==I?(n.useProgram(I),m=I,!0):!1}const ht={[Ua]:n.FUNC_ADD,[xb]:n.FUNC_SUBTRACT,[vb]:n.FUNC_REVERSE_SUBTRACT};ht[yb]=n.MIN,ht[Mb]=n.MAX;const X={[_b]:n.ZERO,[bb]:n.ONE,[Sb]:n.SRC_COLOR,[jl]:n.SRC_ALPHA,[Pb]:n.SRC_ALPHA_SATURATE,[Ab]:n.DST_COLOR,[Eb]:n.DST_ALPHA,[wb]:n.ONE_MINUS_SRC_COLOR,[Kl]:n.ONE_MINUS_SRC_ALPHA,[Rb]:n.ONE_MINUS_DST_COLOR,[Tb]:n.ONE_MINUS_DST_ALPHA,[Cb]:n.CONSTANT_COLOR,[Lb]:n.ONE_MINUS_CONSTANT_COLOR,[Db]:n.CONSTANT_ALPHA,[kb]:n.ONE_MINUS_CONSTANT_ALPHA};function N(I,yt,Q,rt,Dt,Tt,qt,he,de,ne){if(I===ua){y===!0&&(tt(n.BLEND),y=!1);return}if(y===!1&&(st(n.BLEND),y=!0),I!==gb){if(I!==g||ne!==b){if((p!==Ua||v!==Ua)&&(n.blendEquation(n.FUNC_ADD),p=Ua,v=Ua),ne)switch(I){case Rs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Vi:n.blendFunc(n.ONE,n.ONE);break;case $u:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Zu:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Rs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Vi:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case $u:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Zu:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}M=null,x=null,w=null,S=null,E.set(0,0,0),T=0,g=I,b=ne}return}Dt=Dt||yt,Tt=Tt||Q,qt=qt||rt,(yt!==p||Dt!==v)&&(n.blendEquationSeparate(ht[yt],ht[Dt]),p=yt,v=Dt),(Q!==M||rt!==x||Tt!==w||qt!==S)&&(n.blendFuncSeparate(X[Q],X[rt],X[Tt],X[qt]),M=Q,x=rt,w=Tt,S=qt),(he.equals(E)===!1||de!==T)&&(n.blendColor(he.r,he.g,he.b,de),E.copy(he),T=de),g=I,b=!1}function At(I,yt){I.side===Ke?tt(n.CULL_FACE):st(n.CULL_FACE);let Q=I.side===Gn;yt&&(Q=!Q),Rt(Q),I.blending===Rs&&I.transparent===!1?N(ua):N(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),s.setMask(I.colorWrite);const rt=I.stencilWrite;r.setTest(rt),rt&&(r.setMask(I.stencilWriteMask),r.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),r.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),mt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?st(n.SAMPLE_ALPHA_TO_COVERAGE):tt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Rt(I){_!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),_=I)}function St(I){I!==pb?(st(n.CULL_FACE),I!==A&&(I===Yu?n.cullFace(n.BACK):I===mb?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):tt(n.CULL_FACE),A=I}function vt(I){I!==k&&(P&&n.lineWidth(I),k=I)}function mt(I,yt,Q){I?(st(n.POLYGON_OFFSET_FILL),(L!==yt||U!==Q)&&(n.polygonOffset(yt,Q),L=yt,U=Q)):tt(n.POLYGON_OFFSET_FILL)}function kt(I){I?st(n.SCISSOR_TEST):tt(n.SCISSOR_TEST)}function F(I){I===void 0&&(I=n.TEXTURE0+D-1),W!==I&&(n.activeTexture(I),W=I)}function R(I,yt,Q){Q===void 0&&(W===null?Q=n.TEXTURE0+D-1:Q=W);let rt=et[Q];rt===void 0&&(rt={type:void 0,texture:void 0},et[Q]=rt),(rt.type!==I||rt.texture!==yt)&&(W!==Q&&(n.activeTexture(Q),W=Q),n.bindTexture(I,yt||ut[I]),rt.type=I,rt.texture=yt)}function K(){const I=et[W];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function ft(){try{n.compressedTexImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function V(){try{n.compressedTexImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ot(){try{n.texSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function zt(){try{n.texSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Et(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function bt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Wt(){try{n.texStorage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function gt(){try{n.texStorage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Lt(){try{n.texImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function j(){try{n.texImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function $(I){Pt.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),Pt.copy(I))}function ct(I){Y.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),Y.copy(I))}function Nt(I,yt){let Q=c.get(yt);Q===void 0&&(Q=new WeakMap,c.set(yt,Q));let rt=Q.get(I);rt===void 0&&(rt=n.getUniformBlockIndex(yt,I.name),Q.set(I,rt))}function Ft(I,yt){const rt=c.get(yt).get(I);l.get(yt)!==rt&&(n.uniformBlockBinding(yt,rt,I.__bindingPointIndex),l.set(yt,rt))}function Ct(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},W=null,et={},f={},d=new WeakMap,u=[],m=null,y=!1,g=null,p=null,M=null,x=null,v=null,w=null,S=null,E=new te(0,0,0),T=0,b=!1,_=null,A=null,k=null,L=null,U=null,Pt.set(0,0,n.canvas.width,n.canvas.height),Y.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:st,disable:tt,bindFramebuffer:dt,drawBuffers:Ut,useProgram:Vt,setBlending:N,setMaterial:At,setFlipSided:Rt,setCullFace:St,setLineWidth:vt,setPolygonOffset:mt,setScissorTest:kt,activeTexture:F,bindTexture:R,unbindTexture:K,compressedTexImage2D:ft,compressedTexImage3D:V,texImage2D:Lt,texImage3D:j,updateUBOMapping:Nt,uniformBlockBinding:Ft,texStorage2D:Wt,texStorage3D:gt,texSubImage2D:ot,texSubImage3D:zt,compressedTexSubImage2D:Et,compressedTexSubImage3D:bt,scissor:$,viewport:ct,reset:Ct}}function Vf(n,t,e,i){const a=gA(i);switch(e){case bm:return n*t;case wm:return n*t;case Em:return n*t*2;case ad:return n*t/a.components*a.byteLength;case sd:return n*t/a.components*a.byteLength;case Tm:return n*t*2/a.components*a.byteLength;case od:return n*t*2/a.components*a.byteLength;case Sm:return n*t*3/a.components*a.byteLength;case gi:return n*t*4/a.components*a.byteLength;case rd:return n*t*4/a.components*a.byteLength;case Nr:case Or:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Br:case Hr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case hh:case uh:return Math.max(n,16)*Math.max(t,8)/4;case lh:case dh:return Math.max(n,8)*Math.max(t,8)/2;case fh:case ph:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case mh:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case gh:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case xh:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case vh:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case yh:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Mh:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case _h:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case bh:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Sh:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case wh:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Eh:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Th:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Ah:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Rh:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Ph:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Gr:case Ch:case Lh:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Am:case Dh:return Math.ceil(n/4)*Math.ceil(t/4)*8;case kh:case Ih:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function gA(n){switch(n){case Zi:case ym:return{byteLength:1,components:1};case Uo:case Mm:case Vo:return{byteLength:2,components:1};case nd:case id:return{byteLength:2,components:4};case Va:case ed:case Pi:return{byteLength:4,components:1};case _m:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function xA(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Gt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(F,R){return u?new OffscreenCanvas(F,R):ac("canvas")}function y(F,R,K){let ft=1;const V=kt(F);if((V.width>K||V.height>K)&&(ft=K/Math.max(V.width,V.height)),ft<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const ot=Math.floor(ft*V.width),zt=Math.floor(ft*V.height);f===void 0&&(f=m(ot,zt));const Et=R?m(ot,zt):f;return Et.width=ot,Et.height=zt,Et.getContext("2d").drawImage(F,0,0,ot,zt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+V.width+"x"+V.height+") to ("+ot+"x"+zt+")."),Et}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+V.width+"x"+V.height+")."),F;return F}function g(F){return F.generateMipmaps}function p(F){n.generateMipmap(F)}function M(F){return F.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:F.isWebGL3DRenderTarget?n.TEXTURE_3D:F.isWebGLArrayRenderTarget||F.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(F,R,K,ft,V=!1){if(F!==null){if(n[F]!==void 0)return n[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let ot=R;if(R===n.RED&&(K===n.FLOAT&&(ot=n.R32F),K===n.HALF_FLOAT&&(ot=n.R16F),K===n.UNSIGNED_BYTE&&(ot=n.R8)),R===n.RED_INTEGER&&(K===n.UNSIGNED_BYTE&&(ot=n.R8UI),K===n.UNSIGNED_SHORT&&(ot=n.R16UI),K===n.UNSIGNED_INT&&(ot=n.R32UI),K===n.BYTE&&(ot=n.R8I),K===n.SHORT&&(ot=n.R16I),K===n.INT&&(ot=n.R32I)),R===n.RG&&(K===n.FLOAT&&(ot=n.RG32F),K===n.HALF_FLOAT&&(ot=n.RG16F),K===n.UNSIGNED_BYTE&&(ot=n.RG8)),R===n.RG_INTEGER&&(K===n.UNSIGNED_BYTE&&(ot=n.RG8UI),K===n.UNSIGNED_SHORT&&(ot=n.RG16UI),K===n.UNSIGNED_INT&&(ot=n.RG32UI),K===n.BYTE&&(ot=n.RG8I),K===n.SHORT&&(ot=n.RG16I),K===n.INT&&(ot=n.RG32I)),R===n.RGB_INTEGER&&(K===n.UNSIGNED_BYTE&&(ot=n.RGB8UI),K===n.UNSIGNED_SHORT&&(ot=n.RGB16UI),K===n.UNSIGNED_INT&&(ot=n.RGB32UI),K===n.BYTE&&(ot=n.RGB8I),K===n.SHORT&&(ot=n.RGB16I),K===n.INT&&(ot=n.RGB32I)),R===n.RGBA_INTEGER&&(K===n.UNSIGNED_BYTE&&(ot=n.RGBA8UI),K===n.UNSIGNED_SHORT&&(ot=n.RGBA16UI),K===n.UNSIGNED_INT&&(ot=n.RGBA32UI),K===n.BYTE&&(ot=n.RGBA8I),K===n.SHORT&&(ot=n.RGBA16I),K===n.INT&&(ot=n.RGBA32I)),R===n.RGB&&K===n.UNSIGNED_INT_5_9_9_9_REV&&(ot=n.RGB9_E5),R===n.RGBA){const zt=V?xc:Ae.getTransfer(ft);K===n.FLOAT&&(ot=n.RGBA32F),K===n.HALF_FLOAT&&(ot=n.RGBA16F),K===n.UNSIGNED_BYTE&&(ot=zt===Be?n.SRGB8_ALPHA8:n.RGBA8),K===n.UNSIGNED_SHORT_4_4_4_4&&(ot=n.RGBA4),K===n.UNSIGNED_SHORT_5_5_5_1&&(ot=n.RGB5_A1)}return(ot===n.R16F||ot===n.R32F||ot===n.RG16F||ot===n.RG32F||ot===n.RGBA16F||ot===n.RGBA32F)&&t.get("EXT_color_buffer_float"),ot}function v(F,R){let K;return F?R===null||R===Va||R===Hs?K=n.DEPTH24_STENCIL8:R===Pi?K=n.DEPTH32F_STENCIL8:R===Uo&&(K=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===Va||R===Hs?K=n.DEPTH_COMPONENT24:R===Pi?K=n.DEPTH_COMPONENT32F:R===Uo&&(K=n.DEPTH_COMPONENT16),K}function w(F,R){return g(F)===!0||F.isFramebufferTexture&&F.minFilter!==Jn&&F.minFilter!==Ri?Math.log2(Math.max(R.width,R.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?R.mipmaps.length:1}function S(F){const R=F.target;R.removeEventListener("dispose",S),T(R),R.isVideoTexture&&h.delete(R)}function E(F){const R=F.target;R.removeEventListener("dispose",E),_(R)}function T(F){const R=i.get(F);if(R.__webglInit===void 0)return;const K=F.source,ft=d.get(K);if(ft){const V=ft[R.__cacheKey];V.usedTimes--,V.usedTimes===0&&b(F),Object.keys(ft).length===0&&d.delete(K)}i.remove(F)}function b(F){const R=i.get(F);n.deleteTexture(R.__webglTexture);const K=F.source,ft=d.get(K);delete ft[R.__cacheKey],o.memory.textures--}function _(F){const R=i.get(F);if(F.depthTexture&&(F.depthTexture.dispose(),i.remove(F.depthTexture)),F.isWebGLCubeRenderTarget)for(let ft=0;ft<6;ft++){if(Array.isArray(R.__webglFramebuffer[ft]))for(let V=0;V<R.__webglFramebuffer[ft].length;V++)n.deleteFramebuffer(R.__webglFramebuffer[ft][V]);else n.deleteFramebuffer(R.__webglFramebuffer[ft]);R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer[ft])}else{if(Array.isArray(R.__webglFramebuffer))for(let ft=0;ft<R.__webglFramebuffer.length;ft++)n.deleteFramebuffer(R.__webglFramebuffer[ft]);else n.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&n.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let ft=0;ft<R.__webglColorRenderbuffer.length;ft++)R.__webglColorRenderbuffer[ft]&&n.deleteRenderbuffer(R.__webglColorRenderbuffer[ft]);R.__webglDepthRenderbuffer&&n.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const K=F.textures;for(let ft=0,V=K.length;ft<V;ft++){const ot=i.get(K[ft]);ot.__webglTexture&&(n.deleteTexture(ot.__webglTexture),o.memory.textures--),i.remove(K[ft])}i.remove(F)}let A=0;function k(){A=0}function L(){const F=A;return F>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+a.maxTextures),A+=1,F}function U(F){const R=[];return R.push(F.wrapS),R.push(F.wrapT),R.push(F.wrapR||0),R.push(F.magFilter),R.push(F.minFilter),R.push(F.anisotropy),R.push(F.internalFormat),R.push(F.format),R.push(F.type),R.push(F.generateMipmaps),R.push(F.premultiplyAlpha),R.push(F.flipY),R.push(F.unpackAlignment),R.push(F.colorSpace),R.join()}function D(F,R){const K=i.get(F);if(F.isVideoTexture&&vt(F),F.isRenderTargetTexture===!1&&F.version>0&&K.__version!==F.version){const ft=F.image;if(ft===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ft.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(K,F,R);return}}e.bindTexture(n.TEXTURE_2D,K.__webglTexture,n.TEXTURE0+R)}function P(F,R){const K=i.get(F);if(F.version>0&&K.__version!==F.version){Y(K,F,R);return}e.bindTexture(n.TEXTURE_2D_ARRAY,K.__webglTexture,n.TEXTURE0+R)}function O(F,R){const K=i.get(F);if(F.version>0&&K.__version!==F.version){Y(K,F,R);return}e.bindTexture(n.TEXTURE_3D,K.__webglTexture,n.TEXTURE0+R)}function B(F,R){const K=i.get(F);if(F.version>0&&K.__version!==F.version){nt(K,F,R);return}e.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture,n.TEXTURE0+R)}const W={[rh]:n.REPEAT,[Ba]:n.CLAMP_TO_EDGE,[ch]:n.MIRRORED_REPEAT},et={[Jn]:n.NEAREST,[Xb]:n.NEAREST_MIPMAP_NEAREST,[ir]:n.NEAREST_MIPMAP_LINEAR,[Ri]:n.LINEAR,[qc]:n.LINEAR_MIPMAP_NEAREST,[Ha]:n.LINEAR_MIPMAP_LINEAR},lt={[$b]:n.NEVER,[Qb]:n.ALWAYS,[Zb]:n.LESS,[Pm]:n.LEQUAL,[qb]:n.EQUAL,[Jb]:n.GEQUAL,[jb]:n.GREATER,[Kb]:n.NOTEQUAL};function pt(F,R){if(R.type===Pi&&t.has("OES_texture_float_linear")===!1&&(R.magFilter===Ri||R.magFilter===qc||R.magFilter===ir||R.magFilter===Ha||R.minFilter===Ri||R.minFilter===qc||R.minFilter===ir||R.minFilter===Ha)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(F,n.TEXTURE_WRAP_S,W[R.wrapS]),n.texParameteri(F,n.TEXTURE_WRAP_T,W[R.wrapT]),(F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY)&&n.texParameteri(F,n.TEXTURE_WRAP_R,W[R.wrapR]),n.texParameteri(F,n.TEXTURE_MAG_FILTER,et[R.magFilter]),n.texParameteri(F,n.TEXTURE_MIN_FILTER,et[R.minFilter]),R.compareFunction&&(n.texParameteri(F,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(F,n.TEXTURE_COMPARE_FUNC,lt[R.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===Jn||R.minFilter!==ir&&R.minFilter!==Ha||R.type===Pi&&t.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||i.get(R).__currentAnisotropy){const K=t.get("EXT_texture_filter_anisotropic");n.texParameterf(F,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,a.getMaxAnisotropy())),i.get(R).__currentAnisotropy=R.anisotropy}}}function Pt(F,R){let K=!1;F.__webglInit===void 0&&(F.__webglInit=!0,R.addEventListener("dispose",S));const ft=R.source;let V=d.get(ft);V===void 0&&(V={},d.set(ft,V));const ot=U(R);if(ot!==F.__cacheKey){V[ot]===void 0&&(V[ot]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,K=!0),V[ot].usedTimes++;const zt=V[F.__cacheKey];zt!==void 0&&(V[F.__cacheKey].usedTimes--,zt.usedTimes===0&&b(R)),F.__cacheKey=ot,F.__webglTexture=V[ot].texture}return K}function Y(F,R,K){let ft=n.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(ft=n.TEXTURE_2D_ARRAY),R.isData3DTexture&&(ft=n.TEXTURE_3D);const V=Pt(F,R),ot=R.source;e.bindTexture(ft,F.__webglTexture,n.TEXTURE0+K);const zt=i.get(ot);if(ot.version!==zt.__version||V===!0){e.activeTexture(n.TEXTURE0+K);const Et=Ae.getPrimaries(Ae.workingColorSpace),bt=R.colorSpace===oa?null:Ae.getPrimaries(R.colorSpace),Wt=R.colorSpace===oa||Et===bt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Wt);let gt=y(R.image,!1,a.maxTextureSize);gt=mt(R,gt);const Lt=s.convert(R.format,R.colorSpace),j=s.convert(R.type);let $=x(R.internalFormat,Lt,j,R.colorSpace,R.isVideoTexture);pt(ft,R);let ct;const Nt=R.mipmaps,Ft=R.isVideoTexture!==!0,Ct=zt.__version===void 0||V===!0,I=ot.dataReady,yt=w(R,gt);if(R.isDepthTexture)$=v(R.format===Gs,R.type),Ct&&(Ft?e.texStorage2D(n.TEXTURE_2D,1,$,gt.width,gt.height):e.texImage2D(n.TEXTURE_2D,0,$,gt.width,gt.height,0,Lt,j,null));else if(R.isDataTexture)if(Nt.length>0){Ft&&Ct&&e.texStorage2D(n.TEXTURE_2D,yt,$,Nt[0].width,Nt[0].height);for(let Q=0,rt=Nt.length;Q<rt;Q++)ct=Nt[Q],Ft?I&&e.texSubImage2D(n.TEXTURE_2D,Q,0,0,ct.width,ct.height,Lt,j,ct.data):e.texImage2D(n.TEXTURE_2D,Q,$,ct.width,ct.height,0,Lt,j,ct.data);R.generateMipmaps=!1}else Ft?(Ct&&e.texStorage2D(n.TEXTURE_2D,yt,$,gt.width,gt.height),I&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,gt.width,gt.height,Lt,j,gt.data)):e.texImage2D(n.TEXTURE_2D,0,$,gt.width,gt.height,0,Lt,j,gt.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){Ft&&Ct&&e.texStorage3D(n.TEXTURE_2D_ARRAY,yt,$,Nt[0].width,Nt[0].height,gt.depth);for(let Q=0,rt=Nt.length;Q<rt;Q++)if(ct=Nt[Q],R.format!==gi)if(Lt!==null)if(Ft){if(I)if(R.layerUpdates.size>0){const Dt=Vf(ct.width,ct.height,R.format,R.type);for(const Tt of R.layerUpdates){const qt=ct.data.subarray(Tt*Dt/ct.data.BYTES_PER_ELEMENT,(Tt+1)*Dt/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,Tt,ct.width,ct.height,1,Lt,qt)}R.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,ct.width,ct.height,gt.depth,Lt,ct.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,$,ct.width,ct.height,gt.depth,0,ct.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ft?I&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,ct.width,ct.height,gt.depth,Lt,j,ct.data):e.texImage3D(n.TEXTURE_2D_ARRAY,Q,$,ct.width,ct.height,gt.depth,0,Lt,j,ct.data)}else{Ft&&Ct&&e.texStorage2D(n.TEXTURE_2D,yt,$,Nt[0].width,Nt[0].height);for(let Q=0,rt=Nt.length;Q<rt;Q++)ct=Nt[Q],R.format!==gi?Lt!==null?Ft?I&&e.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,ct.width,ct.height,Lt,ct.data):e.compressedTexImage2D(n.TEXTURE_2D,Q,$,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ft?I&&e.texSubImage2D(n.TEXTURE_2D,Q,0,0,ct.width,ct.height,Lt,j,ct.data):e.texImage2D(n.TEXTURE_2D,Q,$,ct.width,ct.height,0,Lt,j,ct.data)}else if(R.isDataArrayTexture)if(Ft){if(Ct&&e.texStorage3D(n.TEXTURE_2D_ARRAY,yt,$,gt.width,gt.height,gt.depth),I)if(R.layerUpdates.size>0){const Q=Vf(gt.width,gt.height,R.format,R.type);for(const rt of R.layerUpdates){const Dt=gt.data.subarray(rt*Q/gt.data.BYTES_PER_ELEMENT,(rt+1)*Q/gt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,rt,gt.width,gt.height,1,Lt,j,Dt)}R.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,gt.width,gt.height,gt.depth,Lt,j,gt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,$,gt.width,gt.height,gt.depth,0,Lt,j,gt.data);else if(R.isData3DTexture)Ft?(Ct&&e.texStorage3D(n.TEXTURE_3D,yt,$,gt.width,gt.height,gt.depth),I&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,gt.width,gt.height,gt.depth,Lt,j,gt.data)):e.texImage3D(n.TEXTURE_3D,0,$,gt.width,gt.height,gt.depth,0,Lt,j,gt.data);else if(R.isFramebufferTexture){if(Ct)if(Ft)e.texStorage2D(n.TEXTURE_2D,yt,$,gt.width,gt.height);else{let Q=gt.width,rt=gt.height;for(let Dt=0;Dt<yt;Dt++)e.texImage2D(n.TEXTURE_2D,Dt,$,Q,rt,0,Lt,j,null),Q>>=1,rt>>=1}}else if(Nt.length>0){if(Ft&&Ct){const Q=kt(Nt[0]);e.texStorage2D(n.TEXTURE_2D,yt,$,Q.width,Q.height)}for(let Q=0,rt=Nt.length;Q<rt;Q++)ct=Nt[Q],Ft?I&&e.texSubImage2D(n.TEXTURE_2D,Q,0,0,Lt,j,ct):e.texImage2D(n.TEXTURE_2D,Q,$,Lt,j,ct);R.generateMipmaps=!1}else if(Ft){if(Ct){const Q=kt(gt);e.texStorage2D(n.TEXTURE_2D,yt,$,Q.width,Q.height)}I&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Lt,j,gt)}else e.texImage2D(n.TEXTURE_2D,0,$,Lt,j,gt);g(R)&&p(ft),zt.__version=ot.version,R.onUpdate&&R.onUpdate(R)}F.__version=R.version}function nt(F,R,K){if(R.image.length!==6)return;const ft=Pt(F,R),V=R.source;e.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+K);const ot=i.get(V);if(V.version!==ot.__version||ft===!0){e.activeTexture(n.TEXTURE0+K);const zt=Ae.getPrimaries(Ae.workingColorSpace),Et=R.colorSpace===oa?null:Ae.getPrimaries(R.colorSpace),bt=R.colorSpace===oa||zt===Et?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt);const Wt=R.isCompressedTexture||R.image[0].isCompressedTexture,gt=R.image[0]&&R.image[0].isDataTexture,Lt=[];for(let rt=0;rt<6;rt++)!Wt&&!gt?Lt[rt]=y(R.image[rt],!0,a.maxCubemapSize):Lt[rt]=gt?R.image[rt].image:R.image[rt],Lt[rt]=mt(R,Lt[rt]);const j=Lt[0],$=s.convert(R.format,R.colorSpace),ct=s.convert(R.type),Nt=x(R.internalFormat,$,ct,R.colorSpace),Ft=R.isVideoTexture!==!0,Ct=ot.__version===void 0||ft===!0,I=V.dataReady;let yt=w(R,j);pt(n.TEXTURE_CUBE_MAP,R);let Q;if(Wt){Ft&&Ct&&e.texStorage2D(n.TEXTURE_CUBE_MAP,yt,Nt,j.width,j.height);for(let rt=0;rt<6;rt++){Q=Lt[rt].mipmaps;for(let Dt=0;Dt<Q.length;Dt++){const Tt=Q[Dt];R.format!==gi?$!==null?Ft?I&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Dt,0,0,Tt.width,Tt.height,$,Tt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Dt,Nt,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ft?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Dt,0,0,Tt.width,Tt.height,$,ct,Tt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Dt,Nt,Tt.width,Tt.height,0,$,ct,Tt.data)}}}else{if(Q=R.mipmaps,Ft&&Ct){Q.length>0&&yt++;const rt=kt(Lt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,yt,Nt,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(gt){Ft?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,Lt[rt].width,Lt[rt].height,$,ct,Lt[rt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Nt,Lt[rt].width,Lt[rt].height,0,$,ct,Lt[rt].data);for(let Dt=0;Dt<Q.length;Dt++){const qt=Q[Dt].image[rt].image;Ft?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Dt+1,0,0,qt.width,qt.height,$,ct,qt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Dt+1,Nt,qt.width,qt.height,0,$,ct,qt.data)}}else{Ft?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,$,ct,Lt[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Nt,$,ct,Lt[rt]);for(let Dt=0;Dt<Q.length;Dt++){const Tt=Q[Dt];Ft?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Dt+1,0,0,$,ct,Tt.image[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Dt+1,Nt,$,ct,Tt.image[rt])}}}g(R)&&p(n.TEXTURE_CUBE_MAP),ot.__version=V.version,R.onUpdate&&R.onUpdate(R)}F.__version=R.version}function ut(F,R,K,ft,V,ot){const zt=s.convert(K.format,K.colorSpace),Et=s.convert(K.type),bt=x(K.internalFormat,zt,Et,K.colorSpace),Wt=i.get(R),gt=i.get(K);if(gt.__renderTarget=R,!Wt.__hasExternalTextures){const Lt=Math.max(1,R.width>>ot),j=Math.max(1,R.height>>ot);V===n.TEXTURE_3D||V===n.TEXTURE_2D_ARRAY?e.texImage3D(V,ot,bt,Lt,j,R.depth,0,zt,Et,null):e.texImage2D(V,ot,bt,Lt,j,0,zt,Et,null)}e.bindFramebuffer(n.FRAMEBUFFER,F),St(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ft,V,gt.__webglTexture,0,Rt(R)):(V===n.TEXTURE_2D||V>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&V<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ft,V,gt.__webglTexture,ot),e.bindFramebuffer(n.FRAMEBUFFER,null)}function st(F,R,K){if(n.bindRenderbuffer(n.RENDERBUFFER,F),R.depthBuffer){const ft=R.depthTexture,V=ft&&ft.isDepthTexture?ft.type:null,ot=v(R.stencilBuffer,V),zt=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Et=Rt(R);St(R)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Et,ot,R.width,R.height):K?n.renderbufferStorageMultisample(n.RENDERBUFFER,Et,ot,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,ot,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,zt,n.RENDERBUFFER,F)}else{const ft=R.textures;for(let V=0;V<ft.length;V++){const ot=ft[V],zt=s.convert(ot.format,ot.colorSpace),Et=s.convert(ot.type),bt=x(ot.internalFormat,zt,Et,ot.colorSpace),Wt=Rt(R);K&&St(R)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Wt,bt,R.width,R.height):St(R)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Wt,bt,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,bt,R.width,R.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function tt(F,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,F),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ft=i.get(R.depthTexture);ft.__renderTarget=R,(!ft.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),D(R.depthTexture,0);const V=ft.__webglTexture,ot=Rt(R);if(R.depthTexture.format===Ps)St(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,V,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,V,0);else if(R.depthTexture.format===Gs)St(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,V,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,V,0);else throw new Error("Unknown depthTexture format")}function dt(F){const R=i.get(F),K=F.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==F.depthTexture){const ft=F.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),ft){const V=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,ft.removeEventListener("dispose",V)};ft.addEventListener("dispose",V),R.__depthDisposeCallback=V}R.__boundDepthTexture=ft}if(F.depthTexture&&!R.__autoAllocateDepthBuffer){if(K)throw new Error("target.depthTexture not supported in Cube render targets");tt(R.__webglFramebuffer,F)}else if(K){R.__webglDepthbuffer=[];for(let ft=0;ft<6;ft++)if(e.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer[ft]),R.__webglDepthbuffer[ft]===void 0)R.__webglDepthbuffer[ft]=n.createRenderbuffer(),st(R.__webglDepthbuffer[ft],F,!1);else{const V=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ot=R.__webglDepthbuffer[ft];n.bindRenderbuffer(n.RENDERBUFFER,ot),n.framebufferRenderbuffer(n.FRAMEBUFFER,V,n.RENDERBUFFER,ot)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=n.createRenderbuffer(),st(R.__webglDepthbuffer,F,!1);else{const ft=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,V=R.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,V),n.framebufferRenderbuffer(n.FRAMEBUFFER,ft,n.RENDERBUFFER,V)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ut(F,R,K){const ft=i.get(F);R!==void 0&&ut(ft.__webglFramebuffer,F,F.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),K!==void 0&&dt(F)}function Vt(F){const R=F.texture,K=i.get(F),ft=i.get(R);F.addEventListener("dispose",E);const V=F.textures,ot=F.isWebGLCubeRenderTarget===!0,zt=V.length>1;if(zt||(ft.__webglTexture===void 0&&(ft.__webglTexture=n.createTexture()),ft.__version=R.version,o.memory.textures++),ot){K.__webglFramebuffer=[];for(let Et=0;Et<6;Et++)if(R.mipmaps&&R.mipmaps.length>0){K.__webglFramebuffer[Et]=[];for(let bt=0;bt<R.mipmaps.length;bt++)K.__webglFramebuffer[Et][bt]=n.createFramebuffer()}else K.__webglFramebuffer[Et]=n.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){K.__webglFramebuffer=[];for(let Et=0;Et<R.mipmaps.length;Et++)K.__webglFramebuffer[Et]=n.createFramebuffer()}else K.__webglFramebuffer=n.createFramebuffer();if(zt)for(let Et=0,bt=V.length;Et<bt;Et++){const Wt=i.get(V[Et]);Wt.__webglTexture===void 0&&(Wt.__webglTexture=n.createTexture(),o.memory.textures++)}if(F.samples>0&&St(F)===!1){K.__webglMultisampledFramebuffer=n.createFramebuffer(),K.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let Et=0;Et<V.length;Et++){const bt=V[Et];K.__webglColorRenderbuffer[Et]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,K.__webglColorRenderbuffer[Et]);const Wt=s.convert(bt.format,bt.colorSpace),gt=s.convert(bt.type),Lt=x(bt.internalFormat,Wt,gt,bt.colorSpace,F.isXRRenderTarget===!0),j=Rt(F);n.renderbufferStorageMultisample(n.RENDERBUFFER,j,Lt,F.width,F.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Et,n.RENDERBUFFER,K.__webglColorRenderbuffer[Et])}n.bindRenderbuffer(n.RENDERBUFFER,null),F.depthBuffer&&(K.__webglDepthRenderbuffer=n.createRenderbuffer(),st(K.__webglDepthRenderbuffer,F,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ot){e.bindTexture(n.TEXTURE_CUBE_MAP,ft.__webglTexture),pt(n.TEXTURE_CUBE_MAP,R);for(let Et=0;Et<6;Et++)if(R.mipmaps&&R.mipmaps.length>0)for(let bt=0;bt<R.mipmaps.length;bt++)ut(K.__webglFramebuffer[Et][bt],F,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Et,bt);else ut(K.__webglFramebuffer[Et],F,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0);g(R)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(zt){for(let Et=0,bt=V.length;Et<bt;Et++){const Wt=V[Et],gt=i.get(Wt);e.bindTexture(n.TEXTURE_2D,gt.__webglTexture),pt(n.TEXTURE_2D,Wt),ut(K.__webglFramebuffer,F,Wt,n.COLOR_ATTACHMENT0+Et,n.TEXTURE_2D,0),g(Wt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let Et=n.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Et=F.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Et,ft.__webglTexture),pt(Et,R),R.mipmaps&&R.mipmaps.length>0)for(let bt=0;bt<R.mipmaps.length;bt++)ut(K.__webglFramebuffer[bt],F,R,n.COLOR_ATTACHMENT0,Et,bt);else ut(K.__webglFramebuffer,F,R,n.COLOR_ATTACHMENT0,Et,0);g(R)&&p(Et),e.unbindTexture()}F.depthBuffer&&dt(F)}function ht(F){const R=F.textures;for(let K=0,ft=R.length;K<ft;K++){const V=R[K];if(g(V)){const ot=M(F),zt=i.get(V).__webglTexture;e.bindTexture(ot,zt),p(ot),e.unbindTexture()}}}const X=[],N=[];function At(F){if(F.samples>0){if(St(F)===!1){const R=F.textures,K=F.width,ft=F.height;let V=n.COLOR_BUFFER_BIT;const ot=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,zt=i.get(F),Et=R.length>1;if(Et)for(let bt=0;bt<R.length;bt++)e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+bt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+bt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,zt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglFramebuffer);for(let bt=0;bt<R.length;bt++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(V|=n.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(V|=n.STENCIL_BUFFER_BIT)),Et){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,zt.__webglColorRenderbuffer[bt]);const Wt=i.get(R[bt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Wt,0)}n.blitFramebuffer(0,0,K,ft,0,0,K,ft,V,n.NEAREST),l===!0&&(X.length=0,N.length=0,X.push(n.COLOR_ATTACHMENT0+bt),F.depthBuffer&&F.resolveDepthBuffer===!1&&(X.push(ot),N.push(ot),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,N)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,X))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Et)for(let bt=0;bt<R.length;bt++){e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+bt,n.RENDERBUFFER,zt.__webglColorRenderbuffer[bt]);const Wt=i.get(R[bt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+bt,n.TEXTURE_2D,Wt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&l){const R=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[R])}}}function Rt(F){return Math.min(a.maxSamples,F.samples)}function St(F){const R=i.get(F);return F.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function vt(F){const R=o.render.frame;h.get(F)!==R&&(h.set(F,R),F.update())}function mt(F,R){const K=F.colorSpace,ft=F.format,V=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||K!==Vs&&K!==oa&&(Ae.getTransfer(K)===Be?(ft!==gi||V!==Zi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",K)),R}function kt(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(c.width=F.naturalWidth||F.width,c.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(c.width=F.displayWidth,c.height=F.displayHeight):(c.width=F.width,c.height=F.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=k,this.setTexture2D=D,this.setTexture2DArray=P,this.setTexture3D=O,this.setTextureCube=B,this.rebindTextures=Ut,this.setupRenderTarget=Vt,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=At,this.setupDepthRenderbuffer=dt,this.setupFrameBufferTexture=ut,this.useMultisampledRTT=St}function vA(n,t){function e(i,a=oa){let s;const o=Ae.getTransfer(a);if(i===Zi)return n.UNSIGNED_BYTE;if(i===nd)return n.UNSIGNED_SHORT_4_4_4_4;if(i===id)return n.UNSIGNED_SHORT_5_5_5_1;if(i===_m)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===ym)return n.BYTE;if(i===Mm)return n.SHORT;if(i===Uo)return n.UNSIGNED_SHORT;if(i===ed)return n.INT;if(i===Va)return n.UNSIGNED_INT;if(i===Pi)return n.FLOAT;if(i===Vo)return n.HALF_FLOAT;if(i===bm)return n.ALPHA;if(i===Sm)return n.RGB;if(i===gi)return n.RGBA;if(i===wm)return n.LUMINANCE;if(i===Em)return n.LUMINANCE_ALPHA;if(i===Ps)return n.DEPTH_COMPONENT;if(i===Gs)return n.DEPTH_STENCIL;if(i===ad)return n.RED;if(i===sd)return n.RED_INTEGER;if(i===Tm)return n.RG;if(i===od)return n.RG_INTEGER;if(i===rd)return n.RGBA_INTEGER;if(i===Nr||i===Or||i===Br||i===Hr)if(o===Be)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Nr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Or)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Br)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Hr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Nr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Or)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Br)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Hr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===lh||i===hh||i===dh||i===uh)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===lh)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===hh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===dh)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===uh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===fh||i===ph||i===mh)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===fh||i===ph)return o===Be?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===mh)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===gh||i===xh||i===vh||i===yh||i===Mh||i===_h||i===bh||i===Sh||i===wh||i===Eh||i===Th||i===Ah||i===Rh||i===Ph)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===gh)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===xh)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===vh)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===yh)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Mh)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===_h)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===bh)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Sh)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===wh)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Eh)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Th)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ah)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Rh)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ph)return o===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Gr||i===Ch||i===Lh)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Gr)return o===Be?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ch)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Lh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Am||i===Dh||i===kh||i===Ih)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Gr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Dh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===kh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ih)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Hs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class yA extends si{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Re extends en{constructor(){super(),this.isGroup=!0,this.type="Group"}}const MA={type:"move"};class bl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Re,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Re,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Re,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const y of t.hand.values()){const g=e.getJointPose(y,i),p=this._getHandJoint(c,y);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,m=.005;c.inputState.pinching&&d>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(MA)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Re;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const _A=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,bA=`
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

}`;class SA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new Pn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new xa({vertexShader:_A,fragmentShader:bA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Me(new ai(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class wA extends Ws{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,m=null;const y=new SA,g=e.getContextAttributes();let p=null,M=null;const x=[],v=[],w=new Gt;let S=null;const E=new si;E.viewport=new sn;const T=new si;T.viewport=new sn;const b=[E,T],_=new yA;let A=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let nt=x[Y];return nt===void 0&&(nt=new bl,x[Y]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(Y){let nt=x[Y];return nt===void 0&&(nt=new bl,x[Y]=nt),nt.getGripSpace()},this.getHand=function(Y){let nt=x[Y];return nt===void 0&&(nt=new bl,x[Y]=nt),nt.getHandSpace()};function L(Y){const nt=v.indexOf(Y.inputSource);if(nt===-1)return;const ut=x[nt];ut!==void 0&&(ut.update(Y.inputSource,Y.frame,c||o),ut.dispatchEvent({type:Y.type,data:Y.inputSource}))}function U(){a.removeEventListener("select",L),a.removeEventListener("selectstart",L),a.removeEventListener("selectend",L),a.removeEventListener("squeeze",L),a.removeEventListener("squeezestart",L),a.removeEventListener("squeezeend",L),a.removeEventListener("end",U),a.removeEventListener("inputsourceschange",D);for(let Y=0;Y<x.length;Y++){const nt=v[Y];nt!==null&&(v[Y]=null,x[Y].disconnect(nt))}A=null,k=null,y.reset(),t.setRenderTarget(p),u=null,d=null,f=null,a=null,M=null,Pt.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){r=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(Y){if(a=Y,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",L),a.addEventListener("selectstart",L),a.addEventListener("selectend",L),a.addEventListener("squeeze",L),a.addEventListener("squeezestart",L),a.addEventListener("squeezeend",L),a.addEventListener("end",U),a.addEventListener("inputsourceschange",D),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(w),a.renderState.layers===void 0){const nt={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(a,e,nt),a.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),M=new Wa(u.framebufferWidth,u.framebufferHeight,{format:gi,type:Zi,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let nt=null,ut=null,st=null;g.depth&&(st=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=g.stencil?Gs:Ps,ut=g.stencil?Hs:Va);const tt={colorFormat:e.RGBA8,depthFormat:st,scaleFactor:s};f=new XRWebGLBinding(a,e),d=f.createProjectionLayer(tt),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new Wa(d.textureWidth,d.textureHeight,{format:gi,type:Zi,depthTexture:new Hm(d.textureWidth,d.textureHeight,ut,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),Pt.setContext(a),Pt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function D(Y){for(let nt=0;nt<Y.removed.length;nt++){const ut=Y.removed[nt],st=v.indexOf(ut);st>=0&&(v[st]=null,x[st].disconnect(ut))}for(let nt=0;nt<Y.added.length;nt++){const ut=Y.added[nt];let st=v.indexOf(ut);if(st===-1){for(let dt=0;dt<x.length;dt++)if(dt>=v.length){v.push(ut),st=dt;break}else if(v[dt]===null){v[dt]=ut,st=dt;break}if(st===-1)break}const tt=x[st];tt&&tt.connect(ut)}}const P=new H,O=new H;function B(Y,nt,ut){P.setFromMatrixPosition(nt.matrixWorld),O.setFromMatrixPosition(ut.matrixWorld);const st=P.distanceTo(O),tt=nt.projectionMatrix.elements,dt=ut.projectionMatrix.elements,Ut=tt[14]/(tt[10]-1),Vt=tt[14]/(tt[10]+1),ht=(tt[9]+1)/tt[5],X=(tt[9]-1)/tt[5],N=(tt[8]-1)/tt[0],At=(dt[8]+1)/dt[0],Rt=Ut*N,St=Ut*At,vt=st/(-N+At),mt=vt*-N;if(nt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(mt),Y.translateZ(vt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),tt[10]===-1)Y.projectionMatrix.copy(nt.projectionMatrix),Y.projectionMatrixInverse.copy(nt.projectionMatrixInverse);else{const kt=Ut+vt,F=Vt+vt,R=Rt-mt,K=St+(st-mt),ft=ht*Vt/F*kt,V=X*Vt/F*kt;Y.projectionMatrix.makePerspective(R,K,ft,V,kt,F),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function W(Y,nt){nt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(nt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(a===null)return;let nt=Y.near,ut=Y.far;y.texture!==null&&(y.depthNear>0&&(nt=y.depthNear),y.depthFar>0&&(ut=y.depthFar)),_.near=T.near=E.near=nt,_.far=T.far=E.far=ut,(A!==_.near||k!==_.far)&&(a.updateRenderState({depthNear:_.near,depthFar:_.far}),A=_.near,k=_.far),E.layers.mask=Y.layers.mask|2,T.layers.mask=Y.layers.mask|4,_.layers.mask=E.layers.mask|T.layers.mask;const st=Y.parent,tt=_.cameras;W(_,st);for(let dt=0;dt<tt.length;dt++)W(tt[dt],st);tt.length===2?B(_,E,T):_.projectionMatrix.copy(E.projectionMatrix),et(Y,_,st)};function et(Y,nt,ut){ut===null?Y.matrix.copy(nt.matrixWorld):(Y.matrix.copy(ut.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(nt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(nt.projectionMatrix),Y.projectionMatrixInverse.copy(nt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=No*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Y)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(_)};let lt=null;function pt(Y,nt){if(h=nt.getViewerPose(c||o),m=nt,h!==null){const ut=h.views;u!==null&&(t.setRenderTargetFramebuffer(M,u.framebuffer),t.setRenderTarget(M));let st=!1;ut.length!==_.cameras.length&&(_.cameras.length=0,st=!0);for(let dt=0;dt<ut.length;dt++){const Ut=ut[dt];let Vt=null;if(u!==null)Vt=u.getViewport(Ut);else{const X=f.getViewSubImage(d,Ut);Vt=X.viewport,dt===0&&(t.setRenderTargetTextures(M,X.colorTexture,d.ignoreDepthValues?void 0:X.depthStencilTexture),t.setRenderTarget(M))}let ht=b[dt];ht===void 0&&(ht=new si,ht.layers.enable(dt),ht.viewport=new sn,b[dt]=ht),ht.matrix.fromArray(Ut.transform.matrix),ht.matrix.decompose(ht.position,ht.quaternion,ht.scale),ht.projectionMatrix.fromArray(Ut.projectionMatrix),ht.projectionMatrixInverse.copy(ht.projectionMatrix).invert(),ht.viewport.set(Vt.x,Vt.y,Vt.width,Vt.height),dt===0&&(_.matrix.copy(ht.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),st===!0&&_.cameras.push(ht)}const tt=a.enabledFeatures;if(tt&&tt.includes("depth-sensing")){const dt=f.getDepthInformation(ut[0]);dt&&dt.isValid&&dt.texture&&y.init(t,dt,a.renderState)}}for(let ut=0;ut<x.length;ut++){const st=v[ut],tt=x[ut];st!==null&&tt!==void 0&&tt.update(st,nt,c||o)}lt&&lt(Y,nt),nt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:nt}),m=null}const Pt=new Om;Pt.setAnimationLoop(pt),this.setAnimationLoop=function(Y){lt=Y},this.dispose=function(){}}}const Ca=new Di,EA=new De;function TA(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Fm(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,M,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),f(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&u(g,p,v)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),y(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?l(g,p,M,x):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Gn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Gn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const M=t.get(p),x=M.envMap,v=M.envMapRotation;x&&(g.envMap.value=x,Ca.copy(v),Ca.x*=-1,Ca.y*=-1,Ca.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Ca.y*=-1,Ca.z*=-1),g.envMapRotation.value.setFromMatrix4(EA.makeRotationFromEuler(Ca)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,M,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*M,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function u(g,p,M){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Gn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function y(g,p){const M=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function AA(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,x){const v=x.program;i.uniformBlockBinding(M,v)}function c(M,x){let v=a[M.id];v===void 0&&(m(M),v=h(M),a[M.id]=v,M.addEventListener("dispose",g));const w=x.program;i.updateUBOMapping(M,w);const S=t.render.frame;s[M.id]!==S&&(d(M),s[M.id]=S)}function h(M){const x=f();M.__bindingPointIndex=x;const v=n.createBuffer(),w=M.__size,S=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,w,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,v),v}function f(){for(let M=0;M<r;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const x=a[M.id],v=M.uniforms,w=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let S=0,E=v.length;S<E;S++){const T=Array.isArray(v[S])?v[S]:[v[S]];for(let b=0,_=T.length;b<_;b++){const A=T[b];if(u(A,S,b,w)===!0){const k=A.__offset,L=Array.isArray(A.value)?A.value:[A.value];let U=0;for(let D=0;D<L.length;D++){const P=L[D],O=y(P);typeof P=="number"||typeof P=="boolean"?(A.__data[0]=P,n.bufferSubData(n.UNIFORM_BUFFER,k+U,A.__data)):P.isMatrix3?(A.__data[0]=P.elements[0],A.__data[1]=P.elements[1],A.__data[2]=P.elements[2],A.__data[3]=0,A.__data[4]=P.elements[3],A.__data[5]=P.elements[4],A.__data[6]=P.elements[5],A.__data[7]=0,A.__data[8]=P.elements[6],A.__data[9]=P.elements[7],A.__data[10]=P.elements[8],A.__data[11]=0):(P.toArray(A.__data,U),U+=O.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,A.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(M,x,v,w){const S=M.value,E=x+"_"+v;if(w[E]===void 0)return typeof S=="number"||typeof S=="boolean"?w[E]=S:w[E]=S.clone(),!0;{const T=w[E];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return w[E]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function m(M){const x=M.uniforms;let v=0;const w=16;for(let E=0,T=x.length;E<T;E++){const b=Array.isArray(x[E])?x[E]:[x[E]];for(let _=0,A=b.length;_<A;_++){const k=b[_],L=Array.isArray(k.value)?k.value:[k.value];for(let U=0,D=L.length;U<D;U++){const P=L[U],O=y(P),B=v%w,W=B%O.boundary,et=B+W;v+=W,et!==0&&w-et<O.storage&&(v+=w-et),k.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=v,v+=O.storage}}}const S=v%w;return S>0&&(v+=w-S),M.__size=v,M.__cache={},this}function y(M){const x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function g(M){const x=M.target;x.removeEventListener("dispose",g);const v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const M in a)n.deleteBuffer(a[M]);o=[],a={},s={}}return{bind:l,update:c,dispose:p}}class RA{constructor(t={}){const{canvas:e=g1(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const m=new Uint32Array(4),y=new Int32Array(4);let g=null,p=null;const M=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Nn,this.toneMapping=fa,this.toneMappingExposure=1;const v=this;let w=!1,S=0,E=0,T=null,b=-1,_=null;const A=new sn,k=new sn;let L=null;const U=new te(0);let D=0,P=e.width,O=e.height,B=1,W=null,et=null;const lt=new sn(0,0,P,O),pt=new sn(0,0,P,O);let Pt=!1;const Y=new dd;let nt=!1,ut=!1;const st=new De,tt=new De,dt=new H,Ut=new sn,Vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ht=!1;function X(){return T===null?B:1}let N=i;function At(C,G){return e.getContext(C,G)}try{const C={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Qh}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",Dt,!1),e.addEventListener("webglcontextcreationerror",Tt,!1),N===null){const G="webgl2";if(N=At(G,C),N===null)throw At(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let Rt,St,vt,mt,kt,F,R,K,ft,V,ot,zt,Et,bt,Wt,gt,Lt,j,$,ct,Nt,Ft,Ct,I;function yt(){Rt=new kE(N),Rt.init(),Ft=new vA(N,Rt),St=new AE(N,Rt,t,Ft),vt=new mA(N,Rt),St.reverseDepthBuffer&&d&&vt.buffers.depth.setReversed(!0),mt=new FE(N),kt=new tA,F=new xA(N,Rt,vt,kt,St,Ft,mt),R=new PE(v),K=new DE(v),ft=new X1(N),Ct=new EE(N,ft),V=new IE(N,ft,mt,Ct),ot=new NE(N,V,ft,mt),$=new UE(N,St,F),gt=new RE(kt),zt=new QT(v,R,K,Rt,St,Ct,gt),Et=new TA(v,kt),bt=new nA,Wt=new cA(Rt),j=new wE(v,R,K,vt,ot,u,l),Lt=new fA(v,ot,St),I=new AA(N,mt,St,vt),ct=new TE(N,Rt,mt),Nt=new zE(N,Rt,mt),mt.programs=zt.programs,v.capabilities=St,v.extensions=Rt,v.properties=kt,v.renderLists=bt,v.shadowMap=Lt,v.state=vt,v.info=mt}yt();const Q=new wA(v,N);this.xr=Q,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const C=Rt.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=Rt.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(C){C!==void 0&&(B=C,this.setSize(P,O,!1))},this.getSize=function(C){return C.set(P,O)},this.setSize=function(C,G,it=!0){if(Q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}P=C,O=G,e.width=Math.floor(C*B),e.height=Math.floor(G*B),it===!0&&(e.style.width=C+"px",e.style.height=G+"px"),this.setViewport(0,0,C,G)},this.getDrawingBufferSize=function(C){return C.set(P*B,O*B).floor()},this.setDrawingBufferSize=function(C,G,it){P=C,O=G,B=it,e.width=Math.floor(C*it),e.height=Math.floor(G*it),this.setViewport(0,0,C,G)},this.getCurrentViewport=function(C){return C.copy(A)},this.getViewport=function(C){return C.copy(lt)},this.setViewport=function(C,G,it,at){C.isVector4?lt.set(C.x,C.y,C.z,C.w):lt.set(C,G,it,at),vt.viewport(A.copy(lt).multiplyScalar(B).round())},this.getScissor=function(C){return C.copy(pt)},this.setScissor=function(C,G,it,at){C.isVector4?pt.set(C.x,C.y,C.z,C.w):pt.set(C,G,it,at),vt.scissor(k.copy(pt).multiplyScalar(B).round())},this.getScissorTest=function(){return Pt},this.setScissorTest=function(C){vt.setScissorTest(Pt=C)},this.setOpaqueSort=function(C){W=C},this.setTransparentSort=function(C){et=C},this.getClearColor=function(C){return C.copy(j.getClearColor())},this.setClearColor=function(){j.setClearColor.apply(j,arguments)},this.getClearAlpha=function(){return j.getClearAlpha()},this.setClearAlpha=function(){j.setClearAlpha.apply(j,arguments)},this.clear=function(C=!0,G=!0,it=!0){let at=0;if(C){let q=!1;if(T!==null){const wt=T.texture.format;q=wt===rd||wt===od||wt===sd}if(q){const wt=T.texture.type,Bt=wt===Zi||wt===Va||wt===Uo||wt===Hs||wt===nd||wt===id,Zt=j.getClearColor(),Xt=j.getClearAlpha(),ae=Zt.r,re=Zt.g,Yt=Zt.b;Bt?(m[0]=ae,m[1]=re,m[2]=Yt,m[3]=Xt,N.clearBufferuiv(N.COLOR,0,m)):(y[0]=ae,y[1]=re,y[2]=Yt,y[3]=Xt,N.clearBufferiv(N.COLOR,0,y))}else at|=N.COLOR_BUFFER_BIT}G&&(at|=N.DEPTH_BUFFER_BIT),it&&(at|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(at)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",Dt,!1),e.removeEventListener("webglcontextcreationerror",Tt,!1),bt.dispose(),Wt.dispose(),kt.dispose(),R.dispose(),K.dispose(),ot.dispose(),Ct.dispose(),I.dispose(),zt.dispose(),Q.dispose(),Q.removeEventListener("sessionstart",Ye),Q.removeEventListener("sessionend",Te),Le.stop()};function rt(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Dt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const C=mt.autoReset,G=Lt.enabled,it=Lt.autoUpdate,at=Lt.needsUpdate,q=Lt.type;yt(),mt.autoReset=C,Lt.enabled=G,Lt.autoUpdate=it,Lt.needsUpdate=at,Lt.type=q}function Tt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function qt(C){const G=C.target;G.removeEventListener("dispose",qt),he(G)}function he(C){de(C),kt.remove(C)}function de(C){const G=kt.get(C).programs;G!==void 0&&(G.forEach(function(it){zt.releaseProgram(it)}),C.isShaderMaterial&&zt.releaseShaderCache(C))}this.renderBufferDirect=function(C,G,it,at,q,wt){G===null&&(G=Vt);const Bt=q.isMesh&&q.matrixWorld.determinant()<0,Zt=Ot(C,G,it,at,q);vt.setMaterial(at,Bt);let Xt=it.index,ae=1;if(at.wireframe===!0){if(Xt=V.getWireframeAttribute(it),Xt===void 0)return;ae=2}const re=it.drawRange,Yt=it.attributes.position;let le=re.start*ae,ee=(re.start+re.count)*ae;wt!==null&&(le=Math.max(le,wt.start*ae),ee=Math.min(ee,(wt.start+wt.count)*ae)),Xt!==null?(le=Math.max(le,0),ee=Math.min(ee,Xt.count)):Yt!=null&&(le=Math.max(le,0),ee=Math.min(ee,Yt.count));const ge=ee-le;if(ge<0||ge===1/0)return;Ct.setup(q,at,Zt,it,Xt);let Ne,fe=ct;if(Xt!==null&&(Ne=ft.get(Xt),fe=Nt,fe.setIndex(Ne)),q.isMesh)at.wireframe===!0?(vt.setLineWidth(at.wireframeLinewidth*X()),fe.setMode(N.LINES)):fe.setMode(N.TRIANGLES);else if(q.isLine){let $t=at.linewidth;$t===void 0&&($t=1),vt.setLineWidth($t*X()),q.isLineSegments?fe.setMode(N.LINES):q.isLineLoop?fe.setMode(N.LINE_LOOP):fe.setMode(N.LINE_STRIP)}else q.isPoints?fe.setMode(N.POINTS):q.isSprite&&fe.setMode(N.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)fe.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(Rt.get("WEBGL_multi_draw"))fe.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const $t=q._multiDrawStarts,Qt=q._multiDrawCounts,Mt=q._multiDrawCount,jt=Xt?ft.get(Xt).bytesPerElement:1,Pe=kt.get(at).currentProgram.getUniforms();for(let xe=0;xe<Mt;xe++)Pe.setValue(N,"_gl_DrawID",xe),fe.render($t[xe]/jt,Qt[xe])}else if(q.isInstancedMesh)fe.renderInstances(le,ge,q.count);else if(it.isInstancedBufferGeometry){const $t=it._maxInstanceCount!==void 0?it._maxInstanceCount:1/0,Qt=Math.min(it.instanceCount,$t);fe.renderInstances(le,ge,Qt)}else fe.render(le,ge)};function ne(C,G,it){C.transparent===!0&&C.side===Ke&&C.forceSinglePass===!1?(C.side=Gn,C.needsUpdate=!0,_n(C,G,it),C.side=ga,C.needsUpdate=!0,_n(C,G,it),C.side=Ke):_n(C,G,it)}this.compile=function(C,G,it=null){it===null&&(it=C),p=Wt.get(it),p.init(G),x.push(p),it.traverseVisible(function(q){q.isLight&&q.layers.test(G.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),C!==it&&C.traverseVisible(function(q){q.isLight&&q.layers.test(G.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),p.setupLights();const at=new Set;return C.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const wt=q.material;if(wt)if(Array.isArray(wt))for(let Bt=0;Bt<wt.length;Bt++){const Zt=wt[Bt];ne(Zt,it,q),at.add(Zt)}else ne(wt,it,q),at.add(wt)}),x.pop(),p=null,at},this.compileAsync=function(C,G,it=null){const at=this.compile(C,G,it);return new Promise(q=>{function wt(){if(at.forEach(function(Bt){kt.get(Bt).currentProgram.isReady()&&at.delete(Bt)}),at.size===0){q(C);return}setTimeout(wt,10)}Rt.get("KHR_parallel_shader_compile")!==null?wt():setTimeout(wt,10)})};let Ee=null;function Ie(C){Ee&&Ee(C)}function Ye(){Le.stop()}function Te(){Le.start()}const Le=new Om;Le.setAnimationLoop(Ie),typeof self<"u"&&Le.setContext(self),this.setAnimationLoop=function(C){Ee=C,Q.setAnimationLoop(C),C===null?Le.stop():Le.start()},Q.addEventListener("sessionstart",Ye),Q.addEventListener("sessionend",Te),this.render=function(C,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),Q.enabled===!0&&Q.isPresenting===!0&&(Q.cameraAutoUpdate===!0&&Q.updateCamera(G),G=Q.getCamera()),C.isScene===!0&&C.onBeforeRender(v,C,G,T),p=Wt.get(C,x.length),p.init(G),x.push(p),tt.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),Y.setFromProjectionMatrix(tt),ut=this.localClippingEnabled,nt=gt.init(this.clippingPlanes,ut),g=bt.get(C,M.length),g.init(),M.push(g),Q.enabled===!0&&Q.isPresenting===!0){const wt=v.xr.getDepthSensingMesh();wt!==null&&ze(wt,G,-1/0,v.sortObjects)}ze(C,G,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(W,et),ht=Q.enabled===!1||Q.isPresenting===!1||Q.hasDepthSensing()===!1,ht&&j.addToRenderList(g,C),this.info.render.frame++,nt===!0&&gt.beginShadows();const it=p.state.shadowsArray;Lt.render(it,C,G),nt===!0&&gt.endShadows(),this.info.autoReset===!0&&this.info.reset();const at=g.opaque,q=g.transmissive;if(p.setupLights(),G.isArrayCamera){const wt=G.cameras;if(q.length>0)for(let Bt=0,Zt=wt.length;Bt<Zt;Bt++){const Xt=wt[Bt];Cn(at,q,C,Xt)}ht&&j.render(C);for(let Bt=0,Zt=wt.length;Bt<Zt;Bt++){const Xt=wt[Bt];Mn(g,C,Xt,Xt.viewport)}}else q.length>0&&Cn(at,q,C,G),ht&&j.render(C),Mn(g,C,G);T!==null&&(F.updateMultisampleRenderTarget(T),F.updateRenderTargetMipmap(T)),C.isScene===!0&&C.onAfterRender(v,C,G),Ct.resetDefaultState(),b=-1,_=null,x.pop(),x.length>0?(p=x[x.length-1],nt===!0&&gt.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?g=M[M.length-1]:g=null};function ze(C,G,it,at){if(C.visible===!1)return;if(C.layers.test(G.layers)){if(C.isGroup)it=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(G);else if(C.isLight)p.pushLight(C),C.castShadow&&p.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Y.intersectsSprite(C)){at&&Ut.setFromMatrixPosition(C.matrixWorld).applyMatrix4(tt);const Bt=ot.update(C),Zt=C.material;Zt.visible&&g.push(C,Bt,Zt,it,Ut.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Y.intersectsObject(C))){const Bt=ot.update(C),Zt=C.material;if(at&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Ut.copy(C.boundingSphere.center)):(Bt.boundingSphere===null&&Bt.computeBoundingSphere(),Ut.copy(Bt.boundingSphere.center)),Ut.applyMatrix4(C.matrixWorld).applyMatrix4(tt)),Array.isArray(Zt)){const Xt=Bt.groups;for(let ae=0,re=Xt.length;ae<re;ae++){const Yt=Xt[ae],le=Zt[Yt.materialIndex];le&&le.visible&&g.push(C,Bt,le,it,Ut.z,Yt)}}else Zt.visible&&g.push(C,Bt,Zt,it,Ut.z,null)}}const wt=C.children;for(let Bt=0,Zt=wt.length;Bt<Zt;Bt++)ze(wt[Bt],G,it,at)}function Mn(C,G,it,at){const q=C.opaque,wt=C.transmissive,Bt=C.transparent;p.setupLightsView(it),nt===!0&&gt.setGlobalState(v.clippingPlanes,it),at&&vt.viewport(A.copy(at)),q.length>0&&ln(q,G,it),wt.length>0&&ln(wt,G,it),Bt.length>0&&ln(Bt,G,it),vt.buffers.depth.setTest(!0),vt.buffers.depth.setMask(!0),vt.buffers.color.setMask(!0),vt.setPolygonOffset(!1)}function Cn(C,G,it,at){if((it.isScene===!0?it.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[at.id]===void 0&&(p.state.transmissionRenderTarget[at.id]=new Wa(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")||Rt.has("EXT_color_buffer_float")?Vo:Zi,minFilter:Ha,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ae.workingColorSpace}));const wt=p.state.transmissionRenderTarget[at.id],Bt=at.viewport||A;wt.setSize(Bt.z,Bt.w);const Zt=v.getRenderTarget();v.setRenderTarget(wt),v.getClearColor(U),D=v.getClearAlpha(),D<1&&v.setClearColor(16777215,.5),v.clear(),ht&&j.render(it);const Xt=v.toneMapping;v.toneMapping=fa;const ae=at.viewport;if(at.viewport!==void 0&&(at.viewport=void 0),p.setupLightsView(at),nt===!0&&gt.setGlobalState(v.clippingPlanes,at),ln(C,it,at),F.updateMultisampleRenderTarget(wt),F.updateRenderTargetMipmap(wt),Rt.has("WEBGL_multisampled_render_to_texture")===!1){let re=!1;for(let Yt=0,le=G.length;Yt<le;Yt++){const ee=G[Yt],ge=ee.object,Ne=ee.geometry,fe=ee.material,$t=ee.group;if(fe.side===Ke&&ge.layers.test(at.layers)){const Qt=fe.side;fe.side=Gn,fe.needsUpdate=!0,Ln(ge,it,at,Ne,fe,$t),fe.side=Qt,fe.needsUpdate=!0,re=!0}}re===!0&&(F.updateMultisampleRenderTarget(wt),F.updateRenderTargetMipmap(wt))}v.setRenderTarget(Zt),v.setClearColor(U,D),ae!==void 0&&(at.viewport=ae),v.toneMapping=Xt}function ln(C,G,it){const at=G.isScene===!0?G.overrideMaterial:null;for(let q=0,wt=C.length;q<wt;q++){const Bt=C[q],Zt=Bt.object,Xt=Bt.geometry,ae=at===null?Bt.material:at,re=Bt.group;Zt.layers.test(it.layers)&&Ln(Zt,G,it,Xt,ae,re)}}function Ln(C,G,it,at,q,wt){C.onBeforeRender(v,G,it,at,q,wt),C.modelViewMatrix.multiplyMatrices(it.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),q.onBeforeRender(v,G,it,at,C,wt),q.transparent===!0&&q.side===Ke&&q.forceSinglePass===!1?(q.side=Gn,q.needsUpdate=!0,v.renderBufferDirect(it,G,at,q,C,wt),q.side=ga,q.needsUpdate=!0,v.renderBufferDirect(it,G,at,q,C,wt),q.side=Ke):v.renderBufferDirect(it,G,at,q,C,wt),C.onAfterRender(v,G,it,at,q,wt)}function _n(C,G,it){G.isScene!==!0&&(G=Vt);const at=kt.get(C),q=p.state.lights,wt=p.state.shadowsArray,Bt=q.state.version,Zt=zt.getParameters(C,q.state,wt,G,it),Xt=zt.getProgramCacheKey(Zt);let ae=at.programs;at.environment=C.isMeshStandardMaterial?G.environment:null,at.fog=G.fog,at.envMap=(C.isMeshStandardMaterial?K:R).get(C.envMap||at.environment),at.envMapRotation=at.environment!==null&&C.envMap===null?G.environmentRotation:C.envMapRotation,ae===void 0&&(C.addEventListener("dispose",qt),ae=new Map,at.programs=ae);let re=ae.get(Xt);if(re!==void 0){if(at.currentProgram===re&&at.lightsStateVersion===Bt)return It(C,Zt),re}else Zt.uniforms=zt.getUniforms(C),C.onBeforeCompile(Zt,v),re=zt.acquireProgram(Zt,Xt),ae.set(Xt,re),at.uniforms=Zt.uniforms;const Yt=at.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Yt.clippingPlanes=gt.uniform),It(C,Zt),at.needsLights=oe(C),at.lightsStateVersion=Bt,at.needsLights&&(Yt.ambientLightColor.value=q.state.ambient,Yt.lightProbe.value=q.state.probe,Yt.directionalLights.value=q.state.directional,Yt.directionalLightShadows.value=q.state.directionalShadow,Yt.spotLights.value=q.state.spot,Yt.spotLightShadows.value=q.state.spotShadow,Yt.rectAreaLights.value=q.state.rectArea,Yt.ltc_1.value=q.state.rectAreaLTC1,Yt.ltc_2.value=q.state.rectAreaLTC2,Yt.pointLights.value=q.state.point,Yt.pointLightShadows.value=q.state.pointShadow,Yt.hemisphereLights.value=q.state.hemi,Yt.directionalShadowMap.value=q.state.directionalShadowMap,Yt.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Yt.spotShadowMap.value=q.state.spotShadowMap,Yt.spotLightMatrix.value=q.state.spotLightMatrix,Yt.spotLightMap.value=q.state.spotLightMap,Yt.pointShadowMap.value=q.state.pointShadowMap,Yt.pointShadowMatrix.value=q.state.pointShadowMatrix),at.currentProgram=re,at.uniformsList=null,re}function Z(C){if(C.uniformsList===null){const G=C.currentProgram.getUniforms();C.uniformsList=Xr.seqWithValue(G.seq,C.uniforms)}return C.uniformsList}function It(C,G){const it=kt.get(C);it.outputColorSpace=G.outputColorSpace,it.batching=G.batching,it.batchingColor=G.batchingColor,it.instancing=G.instancing,it.instancingColor=G.instancingColor,it.instancingMorph=G.instancingMorph,it.skinning=G.skinning,it.morphTargets=G.morphTargets,it.morphNormals=G.morphNormals,it.morphColors=G.morphColors,it.morphTargetsCount=G.morphTargetsCount,it.numClippingPlanes=G.numClippingPlanes,it.numIntersection=G.numClipIntersection,it.vertexAlphas=G.vertexAlphas,it.vertexTangents=G.vertexTangents,it.toneMapping=G.toneMapping}function Ot(C,G,it,at,q){G.isScene!==!0&&(G=Vt),F.resetTextureUnits();const wt=G.fog,Bt=at.isMeshStandardMaterial?G.environment:null,Zt=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Vs,Xt=(at.isMeshStandardMaterial?K:R).get(at.envMap||Bt),ae=at.vertexColors===!0&&!!it.attributes.color&&it.attributes.color.itemSize===4,re=!!it.attributes.tangent&&(!!at.normalMap||at.anisotropy>0),Yt=!!it.morphAttributes.position,le=!!it.morphAttributes.normal,ee=!!it.morphAttributes.color;let ge=fa;at.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ge=v.toneMapping);const Ne=it.morphAttributes.position||it.morphAttributes.normal||it.morphAttributes.color,fe=Ne!==void 0?Ne.length:0,$t=kt.get(at),Qt=p.state.lights;if(nt===!0&&(ut===!0||C!==_)){const He=C===_&&at.id===b;gt.setState(at,C,He)}let Mt=!1;at.version===$t.__version?($t.needsLights&&$t.lightsStateVersion!==Qt.state.version||$t.outputColorSpace!==Zt||q.isBatchedMesh&&$t.batching===!1||!q.isBatchedMesh&&$t.batching===!0||q.isBatchedMesh&&$t.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&$t.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&$t.instancing===!1||!q.isInstancedMesh&&$t.instancing===!0||q.isSkinnedMesh&&$t.skinning===!1||!q.isSkinnedMesh&&$t.skinning===!0||q.isInstancedMesh&&$t.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&$t.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&$t.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&$t.instancingMorph===!1&&q.morphTexture!==null||$t.envMap!==Xt||at.fog===!0&&$t.fog!==wt||$t.numClippingPlanes!==void 0&&($t.numClippingPlanes!==gt.numPlanes||$t.numIntersection!==gt.numIntersection)||$t.vertexAlphas!==ae||$t.vertexTangents!==re||$t.morphTargets!==Yt||$t.morphNormals!==le||$t.morphColors!==ee||$t.toneMapping!==ge||$t.morphTargetsCount!==fe)&&(Mt=!0):(Mt=!0,$t.__version=at.version);let jt=$t.currentProgram;Mt===!0&&(jt=_n(at,G,q));let Pe=!1,xe=!1,bn=!1;const _e=jt.getUniforms(),ue=$t.uniforms;if(vt.useProgram(jt.program)&&(Pe=!0,xe=!0,bn=!0),at.id!==b&&(b=at.id,xe=!0),Pe||_!==C){vt.buffers.depth.getReversed()?(st.copy(C.projectionMatrix),v1(st),y1(st),_e.setValue(N,"projectionMatrix",st)):_e.setValue(N,"projectionMatrix",C.projectionMatrix),_e.setValue(N,"viewMatrix",C.matrixWorldInverse);const un=_e.map.cameraPosition;un!==void 0&&un.setValue(N,dt.setFromMatrixPosition(C.matrixWorld)),St.logarithmicDepthBuffer&&_e.setValue(N,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(at.isMeshPhongMaterial||at.isMeshToonMaterial||at.isMeshLambertMaterial||at.isMeshBasicMaterial||at.isMeshStandardMaterial||at.isShaderMaterial)&&_e.setValue(N,"isOrthographic",C.isOrthographicCamera===!0),_!==C&&(_=C,xe=!0,bn=!0)}if(q.isSkinnedMesh){_e.setOptional(N,q,"bindMatrix"),_e.setOptional(N,q,"bindMatrixInverse");const He=q.skeleton;He&&(He.boneTexture===null&&He.computeBoneTexture(),_e.setValue(N,"boneTexture",He.boneTexture,F))}q.isBatchedMesh&&(_e.setOptional(N,q,"batchingTexture"),_e.setValue(N,"batchingTexture",q._matricesTexture,F),_e.setOptional(N,q,"batchingIdTexture"),_e.setValue(N,"batchingIdTexture",q._indirectTexture,F),_e.setOptional(N,q,"batchingColorTexture"),q._colorsTexture!==null&&_e.setValue(N,"batchingColorTexture",q._colorsTexture,F));const Ce=it.morphAttributes;if((Ce.position!==void 0||Ce.normal!==void 0||Ce.color!==void 0)&&$.update(q,it,jt),(xe||$t.receiveShadow!==q.receiveShadow)&&($t.receiveShadow=q.receiveShadow,_e.setValue(N,"receiveShadow",q.receiveShadow)),at.isMeshGouraudMaterial&&at.envMap!==null&&(ue.envMap.value=Xt,ue.flipEnvMap.value=Xt.isCubeTexture&&Xt.isRenderTargetTexture===!1?-1:1),at.isMeshStandardMaterial&&at.envMap===null&&G.environment!==null&&(ue.envMapIntensity.value=G.environmentIntensity),xe&&(_e.setValue(N,"toneMappingExposure",v.toneMappingExposure),$t.needsLights&&ie(ue,bn),wt&&at.fog===!0&&Et.refreshFogUniforms(ue,wt),Et.refreshMaterialUniforms(ue,at,B,O,p.state.transmissionRenderTarget[C.id]),Xr.upload(N,Z($t),ue,F)),at.isShaderMaterial&&at.uniformsNeedUpdate===!0&&(Xr.upload(N,Z($t),ue,F),at.uniformsNeedUpdate=!1),at.isSpriteMaterial&&_e.setValue(N,"center",q.center),_e.setValue(N,"modelViewMatrix",q.modelViewMatrix),_e.setValue(N,"normalMatrix",q.normalMatrix),_e.setValue(N,"modelMatrix",q.matrixWorld),at.isShaderMaterial||at.isRawShaderMaterial){const He=at.uniformsGroups;for(let un=0,Sn=He.length;un<Sn;un++){const oi=He[un];I.update(oi,jt),I.bind(oi,jt)}}return jt}function ie(C,G){C.ambientLightColor.needsUpdate=G,C.lightProbe.needsUpdate=G,C.directionalLights.needsUpdate=G,C.directionalLightShadows.needsUpdate=G,C.pointLights.needsUpdate=G,C.pointLightShadows.needsUpdate=G,C.spotLights.needsUpdate=G,C.spotLightShadows.needsUpdate=G,C.rectAreaLights.needsUpdate=G,C.hemisphereLights.needsUpdate=G}function oe(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(C,G,it){kt.get(C.texture).__webglTexture=G,kt.get(C.depthTexture).__webglTexture=it;const at=kt.get(C);at.__hasExternalTextures=!0,at.__autoAllocateDepthBuffer=it===void 0,at.__autoAllocateDepthBuffer||Rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),at.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(C,G){const it=kt.get(C);it.__webglFramebuffer=G,it.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(C,G=0,it=0){T=C,S=G,E=it;let at=!0,q=null,wt=!1,Bt=!1;if(C){const Xt=kt.get(C);if(Xt.__useDefaultFramebuffer!==void 0)vt.bindFramebuffer(N.FRAMEBUFFER,null),at=!1;else if(Xt.__webglFramebuffer===void 0)F.setupRenderTarget(C);else if(Xt.__hasExternalTextures)F.rebindTextures(C,kt.get(C.texture).__webglTexture,kt.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Yt=C.depthTexture;if(Xt.__boundDepthTexture!==Yt){if(Yt!==null&&kt.has(Yt)&&(C.width!==Yt.image.width||C.height!==Yt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");F.setupDepthRenderbuffer(C)}}const ae=C.texture;(ae.isData3DTexture||ae.isDataArrayTexture||ae.isCompressedArrayTexture)&&(Bt=!0);const re=kt.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(re[G])?q=re[G][it]:q=re[G],wt=!0):C.samples>0&&F.useMultisampledRTT(C)===!1?q=kt.get(C).__webglMultisampledFramebuffer:Array.isArray(re)?q=re[it]:q=re,A.copy(C.viewport),k.copy(C.scissor),L=C.scissorTest}else A.copy(lt).multiplyScalar(B).floor(),k.copy(pt).multiplyScalar(B).floor(),L=Pt;if(vt.bindFramebuffer(N.FRAMEBUFFER,q)&&at&&vt.drawBuffers(C,q),vt.viewport(A),vt.scissor(k),vt.setScissorTest(L),wt){const Xt=kt.get(C.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+G,Xt.__webglTexture,it)}else if(Bt){const Xt=kt.get(C.texture),ae=G||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,Xt.__webglTexture,it||0,ae)}b=-1},this.readRenderTargetPixels=function(C,G,it,at,q,wt,Bt){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Zt=kt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Bt!==void 0&&(Zt=Zt[Bt]),Zt){vt.bindFramebuffer(N.FRAMEBUFFER,Zt);try{const Xt=C.texture,ae=Xt.format,re=Xt.type;if(!St.textureFormatReadable(ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!St.textureTypeReadable(re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=C.width-at&&it>=0&&it<=C.height-q&&N.readPixels(G,it,at,q,Ft.convert(ae),Ft.convert(re),wt)}finally{const Xt=T!==null?kt.get(T).__webglFramebuffer:null;vt.bindFramebuffer(N.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(C,G,it,at,q,wt,Bt){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Zt=kt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Bt!==void 0&&(Zt=Zt[Bt]),Zt){const Xt=C.texture,ae=Xt.format,re=Xt.type;if(!St.textureFormatReadable(ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!St.textureTypeReadable(re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(G>=0&&G<=C.width-at&&it>=0&&it<=C.height-q){vt.bindFramebuffer(N.FRAMEBUFFER,Zt);const Yt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Yt),N.bufferData(N.PIXEL_PACK_BUFFER,wt.byteLength,N.STREAM_READ),N.readPixels(G,it,at,q,Ft.convert(ae),Ft.convert(re),0);const le=T!==null?kt.get(T).__webglFramebuffer:null;vt.bindFramebuffer(N.FRAMEBUFFER,le);const ee=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await x1(N,ee,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Yt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,wt),N.deleteBuffer(Yt),N.deleteSync(ee),wt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(C,G=null,it=0){C.isTexture!==!0&&(yo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),G=arguments[0]||null,C=arguments[1]);const at=Math.pow(2,-it),q=Math.floor(C.image.width*at),wt=Math.floor(C.image.height*at),Bt=G!==null?G.x:0,Zt=G!==null?G.y:0;F.setTexture2D(C,0),N.copyTexSubImage2D(N.TEXTURE_2D,it,0,0,Bt,Zt,q,wt),vt.unbindTexture()},this.copyTextureToTexture=function(C,G,it=null,at=null,q=0){C.isTexture!==!0&&(yo("WebGLRenderer: copyTextureToTexture function signature has changed."),at=arguments[0]||null,C=arguments[1],G=arguments[2],q=arguments[3]||0,it=null);let wt,Bt,Zt,Xt,ae,re,Yt,le,ee;const ge=C.isCompressedTexture?C.mipmaps[q]:C.image;it!==null?(wt=it.max.x-it.min.x,Bt=it.max.y-it.min.y,Zt=it.isBox3?it.max.z-it.min.z:1,Xt=it.min.x,ae=it.min.y,re=it.isBox3?it.min.z:0):(wt=ge.width,Bt=ge.height,Zt=ge.depth||1,Xt=0,ae=0,re=0),at!==null?(Yt=at.x,le=at.y,ee=at.z):(Yt=0,le=0,ee=0);const Ne=Ft.convert(G.format),fe=Ft.convert(G.type);let $t;G.isData3DTexture?(F.setTexture3D(G,0),$t=N.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(F.setTexture2DArray(G,0),$t=N.TEXTURE_2D_ARRAY):(F.setTexture2D(G,0),$t=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,G.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,G.unpackAlignment);const Qt=N.getParameter(N.UNPACK_ROW_LENGTH),Mt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),jt=N.getParameter(N.UNPACK_SKIP_PIXELS),Pe=N.getParameter(N.UNPACK_SKIP_ROWS),xe=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,ge.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ge.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Xt),N.pixelStorei(N.UNPACK_SKIP_ROWS,ae),N.pixelStorei(N.UNPACK_SKIP_IMAGES,re);const bn=C.isDataArrayTexture||C.isData3DTexture,_e=G.isDataArrayTexture||G.isData3DTexture;if(C.isRenderTargetTexture||C.isDepthTexture){const ue=kt.get(C),Ce=kt.get(G),He=kt.get(ue.__renderTarget),un=kt.get(Ce.__renderTarget);vt.bindFramebuffer(N.READ_FRAMEBUFFER,He.__webglFramebuffer),vt.bindFramebuffer(N.DRAW_FRAMEBUFFER,un.__webglFramebuffer);for(let Sn=0;Sn<Zt;Sn++)bn&&N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,kt.get(C).__webglTexture,q,re+Sn),C.isDepthTexture?(_e&&N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,kt.get(G).__webglTexture,q,ee+Sn),N.blitFramebuffer(Xt,ae,wt,Bt,Yt,le,wt,Bt,N.DEPTH_BUFFER_BIT,N.NEAREST)):_e?N.copyTexSubImage3D($t,q,Yt,le,ee+Sn,Xt,ae,wt,Bt):N.copyTexSubImage2D($t,q,Yt,le,ee+Sn,Xt,ae,wt,Bt);vt.bindFramebuffer(N.READ_FRAMEBUFFER,null),vt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else _e?C.isDataTexture||C.isData3DTexture?N.texSubImage3D($t,q,Yt,le,ee,wt,Bt,Zt,Ne,fe,ge.data):G.isCompressedArrayTexture?N.compressedTexSubImage3D($t,q,Yt,le,ee,wt,Bt,Zt,Ne,ge.data):N.texSubImage3D($t,q,Yt,le,ee,wt,Bt,Zt,Ne,fe,ge):C.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,q,Yt,le,wt,Bt,Ne,fe,ge.data):C.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,q,Yt,le,ge.width,ge.height,Ne,ge.data):N.texSubImage2D(N.TEXTURE_2D,q,Yt,le,wt,Bt,Ne,fe,ge);N.pixelStorei(N.UNPACK_ROW_LENGTH,Qt),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Mt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,jt),N.pixelStorei(N.UNPACK_SKIP_ROWS,Pe),N.pixelStorei(N.UNPACK_SKIP_IMAGES,xe),q===0&&G.generateMipmaps&&N.generateMipmap($t),vt.unbindTexture()},this.copyTextureToTexture3D=function(C,G,it=null,at=null,q=0){return C.isTexture!==!0&&(yo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),it=arguments[0]||null,at=arguments[1]||null,C=arguments[2],G=arguments[3],q=arguments[4]||0),yo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(C,G,it,at,q)},this.initRenderTarget=function(C){kt.get(C).__webglFramebuffer===void 0&&F.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?F.setTextureCube(C,0):C.isData3DTexture?F.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?F.setTexture2DArray(C,0):F.setTexture2D(C,0),vt.unbindTexture()},this.resetState=function(){S=0,E=0,T=null,vt.reset(),Ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Ae._getDrawingBufferColorSpace(t),e.unpackColorSpace=Ae._getUnpackColorSpace()}}class PA extends en{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Di,this.environmentIntensity=1,this.environmentRotation=new Di,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class CA{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=zh,this.updateRanges=[],this.version=0,this.uuid=Li()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Li()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Li()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const In=new H;class sc{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)In.fromBufferAttribute(this,e),In.applyMatrix4(t),this.setXYZ(e,In.x,In.y,In.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)In.fromBufferAttribute(this,e),In.applyNormalMatrix(t),this.setXYZ(e,In.x,In.y,In.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)In.fromBufferAttribute(this,e),In.transformDirection(t),this.setXYZ(e,In.x,In.y,In.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=mi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ue(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Ue(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=mi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=mi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=mi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=mi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array),a=Ue(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array),a=Ue(a,this.array),s=Ue(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new yn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new sc(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Uh extends Za{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new te(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let vs;const uo=new H,ys=new H,Ms=new H,_s=new Gt,fo=new Gt,Ym=new De,wr=new H,po=new H,Er=new H,Wf=new Gt,Sl=new Gt,Yf=new Gt;class $f extends en{constructor(t=new Uh){if(super(),this.isSprite=!0,this.type="Sprite",vs===void 0){vs=new cn;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new CA(e,5);vs.setIndex([0,1,2,0,2,3]),vs.setAttribute("position",new sc(i,3,0,!1)),vs.setAttribute("uv",new sc(i,2,3,!1))}this.geometry=vs,this.material=t,this.center=new Gt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ys.setFromMatrixScale(this.matrixWorld),Ym.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ms.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ys.multiplyScalar(-Ms.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;Tr(wr.set(-.5,-.5,0),Ms,o,ys,a,s),Tr(po.set(.5,-.5,0),Ms,o,ys,a,s),Tr(Er.set(.5,.5,0),Ms,o,ys,a,s),Wf.set(0,0),Sl.set(1,0),Yf.set(1,1);let r=t.ray.intersectTriangle(wr,po,Er,!1,uo);if(r===null&&(Tr(po.set(-.5,.5,0),Ms,o,ys,a,s),Sl.set(0,1),r=t.ray.intersectTriangle(wr,Er,po,!1,uo),r===null))return;const l=t.ray.origin.distanceTo(uo);l<t.near||l>t.far||e.push({distance:l,point:uo.clone(),uv:Kn.getInterpolation(uo,wr,po,Er,Wf,Sl,Yf,new Gt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Tr(n,t,e,i,a,s){_s.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(fo.x=s*_s.x-a*_s.y,fo.y=a*_s.x+s*_s.y):fo.copy(_s),n.copy(t),n.x+=fo.x,n.y+=fo.y,n.applyMatrix4(Ym)}class LA extends Pn{constructor(t=null,e=1,i=1,a,s,o,r,l,c=Jn,h=Jn,f,d){super(null,o,r,l,c,h,a,s,f,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ao extends yn{constructor(t,e,i,a=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const bs=new De,Zf=new De,Ar=[],qf=new $a,DA=new De,mo=new Me,go=new Ys;class jf extends Me{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ao(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,DA)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new $a),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,bs),qf.copy(t.boundingBox).applyMatrix4(bs),this.boundingBox.union(qf)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ys),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,bs),go.copy(t.boundingSphere).applyMatrix4(bs),this.boundingSphere.union(go)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,a=this.morphTexture.source.data.data,s=i.length+1,o=t*s+1;for(let r=0;r<i.length;r++)i[r]=a[o+r]}raycast(t,e){const i=this.matrixWorld,a=this.count;if(mo.geometry=this.geometry,mo.material=this.material,mo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),go.copy(this.boundingSphere),go.applyMatrix4(i),t.ray.intersectsSphere(go)!==!1))for(let s=0;s<a;s++){this.getMatrixAt(s,bs),Zf.multiplyMatrices(i,bs),mo.matrixWorld=Zf,mo.raycast(t,Ar);for(let o=0,r=Ar.length;o<r;o++){const l=Ar[o];l.instanceId=s,l.object=this,e.push(l)}Ar.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ao(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new LA(new Float32Array(a*this.count),a,this.count,ad,Pi));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<i.length;c++)o+=i[c];const r=this.geometry.morphTargetsRelative?1:1-o,l=a*t;s[l]=r,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class fd extends Za{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const oc=new H,rc=new H,Kf=new De,xo=new ld,Rr=new Ys,wl=new H,Jf=new H;class kA extends en{constructor(t=new cn,e=new fd){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)oc.fromBufferAttribute(e,a-1),rc.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=oc.distanceTo(rc);t.setAttribute("lineDistance",new ke(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Rr.copy(i.boundingSphere),Rr.applyMatrix4(a),Rr.radius+=s,t.ray.intersectsSphere(Rr)===!1)return;Kf.copy(a).invert(),xo.copy(t.ray).applyMatrix4(Kf);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let y=u,g=m-1;y<g;y+=c){const p=h.getX(y),M=h.getX(y+1),x=Pr(this,t,xo,l,p,M);x&&e.push(x)}if(this.isLineLoop){const y=h.getX(m-1),g=h.getX(u),p=Pr(this,t,xo,l,y,g);p&&e.push(p)}}else{const u=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let y=u,g=m-1;y<g;y+=c){const p=Pr(this,t,xo,l,y,y+1);p&&e.push(p)}if(this.isLineLoop){const y=Pr(this,t,xo,l,m-1,u);y&&e.push(y)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function Pr(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(oc.fromBufferAttribute(o,a),rc.fromBufferAttribute(o,s),e.distanceSqToSegment(oc,rc,wl,Jf)>i)return;wl.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(wl);if(!(l<t.near||l>t.far))return{distance:l,point:Jf.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Qf=new H,tp=new H;class $m extends kA{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)Qf.fromBufferAttribute(e,a),tp.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+Qf.distanceTo(tp);t.setAttribute("lineDistance",new ke(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Nh extends Pn{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ki{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,u=(o-h)/d;return(a+u)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new Gt:new H);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new H,a=[],s=[],o=[],r=new H,l=new De;for(let u=0;u<=t;u++){const m=u/t;a[u]=this.getTangentAt(m,new H)}s[0]=new H,o[0]=new H;let c=Number.MAX_VALUE;const h=Math.abs(a[0].x),f=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let u=1;u<=t;u++){if(s[u]=s[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(a[u-1],a[u]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(wn(a[u-1].dot(a[u]),-1,1));s[u].applyMatrix4(l.makeRotationAxis(r,m))}o[u].crossVectors(a[u],s[u])}if(e===!0){let u=Math.acos(wn(s[0].dot(s[t]),-1,1));u/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(u=-u);for(let m=1;m<=t;m++)s[m].applyMatrix4(l.makeRotationAxis(a[m],u*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class pd extends ki{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Gt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class IA extends pd{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function md(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,h,f){let d=(o-s)/c-(r-s)/(c+h)+(r-o)/h,u=(r-o)/h-(l-o)/(h+f)+(l-r)/f;d*=h,u*=h,a(o,r,d,u)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const Cr=new H,El=new md,Tl=new md,Al=new md;class zA extends ki{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new H){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,h;this.closed||r>0?c=a[(r-1)%s]:(Cr.subVectors(a[0],a[1]).add(a[0]),c=Cr);const f=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:(Cr.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=Cr),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(f),u),y=Math.pow(f.distanceToSquared(d),u),g=Math.pow(d.distanceToSquared(h),u);y<1e-4&&(y=1),m<1e-4&&(m=y),g<1e-4&&(g=y),El.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,m,y,g),Tl.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,m,y,g),Al.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,m,y,g)}else this.curveType==="catmullrom"&&(El.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),Tl.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),Al.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return i.set(El.calc(l),Tl.calc(l),Al.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new H().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function ep(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function FA(n,t){const e=1-n;return e*e*t}function UA(n,t){return 2*(1-n)*n*t}function NA(n,t){return n*n*t}function Ro(n,t,e,i){return FA(n,t)+UA(n,e)+NA(n,i)}function OA(n,t){const e=1-n;return e*e*e*t}function BA(n,t){const e=1-n;return 3*e*e*n*t}function HA(n,t){return 3*(1-n)*n*n*t}function GA(n,t){return n*n*n*t}function Po(n,t,e,i,a){return OA(n,t)+BA(n,e)+HA(n,i)+GA(n,a)}class Zm extends ki{constructor(t=new Gt,e=new Gt,i=new Gt,a=new Gt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Gt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Po(t,a.x,s.x,o.x,r.x),Po(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class XA extends ki{constructor(t=new H,e=new H,i=new H,a=new H){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new H){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Po(t,a.x,s.x,o.x,r.x),Po(t,a.y,s.y,o.y,r.y),Po(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class qm extends ki{constructor(t=new Gt,e=new Gt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Gt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Gt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class VA extends ki{constructor(t=new H,e=new H){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new H){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new H){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class jm extends ki{constructor(t=new Gt,e=new Gt,i=new Gt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Gt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Ro(t,a.x,s.x,o.x),Ro(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class WA extends ki{constructor(t=new H,e=new H,i=new H){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new H){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Ro(t,a.x,s.x,o.x),Ro(t,a.y,s.y,o.y),Ro(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Km extends ki{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Gt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],h=a[o>a.length-2?a.length-1:o+1],f=a[o>a.length-3?a.length-1:o+2];return i.set(ep(r,l.x,c.x,h.x,f.x),ep(r,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Gt().fromArray(a))}return this}}var np=Object.freeze({__proto__:null,ArcCurve:IA,CatmullRomCurve3:zA,CubicBezierCurve:Zm,CubicBezierCurve3:XA,EllipseCurve:pd,LineCurve:qm,LineCurve3:VA,QuadraticBezierCurve:jm,QuadraticBezierCurve3:WA,SplineCurve:Km});class YA extends ki{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new np[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new np[a.type]().fromJSON(a))}return this}}class ip extends YA{constructor(t){super(),this.type="Path",this.currentPoint=new Gt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new qm(this.currentPoint.clone(),new Gt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new jm(this.currentPoint.clone(),new Gt(t,e),new Gt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new Zm(this.currentPoint.clone(),new Gt(t,e),new Gt(i,a),new Gt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Km(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new pd(t,e,i,a,s,o,r,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class gd extends cn{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new H,h=new Gt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*a;c.x=t*Math.cos(u),c.y=t*Math.sin(u),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new ke(o,3)),this.setAttribute("normal",new ke(r,3)),this.setAttribute("uv",new ke(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gd(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Oo extends cn{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const h=[],f=[],d=[],u=[];let m=0;const y=[],g=i/2;let p=0;M(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new ke(f,3)),this.setAttribute("normal",new ke(d,3)),this.setAttribute("uv",new ke(u,2));function M(){const v=new H,w=new H;let S=0;const E=(e-t)/i;for(let T=0;T<=s;T++){const b=[],_=T/s,A=_*(e-t)+t;for(let k=0;k<=a;k++){const L=k/a,U=L*l+r,D=Math.sin(U),P=Math.cos(U);w.x=A*D,w.y=-_*i+g,w.z=A*P,f.push(w.x,w.y,w.z),v.set(D,E,P).normalize(),d.push(v.x,v.y,v.z),u.push(L,1-_),b.push(m++)}y.push(b)}for(let T=0;T<a;T++)for(let b=0;b<s;b++){const _=y[b][T],A=y[b+1][T],k=y[b+1][T+1],L=y[b][T+1];(t>0||b!==0)&&(h.push(_,A,L),S+=3),(e>0||b!==s-1)&&(h.push(A,k,L),S+=3)}c.addGroup(p,S,0),p+=S}function x(v){const w=m,S=new Gt,E=new H;let T=0;const b=v===!0?t:e,_=v===!0?1:-1;for(let k=1;k<=a;k++)f.push(0,g*_,0),d.push(0,_,0),u.push(.5,.5),m++;const A=m;for(let k=0;k<=a;k++){const U=k/a*l+r,D=Math.cos(U),P=Math.sin(U);E.x=b*P,E.y=g*_,E.z=b*D,f.push(E.x,E.y,E.z),d.push(0,_,0),S.x=D*.5+.5,S.y=P*.5*_+.5,u.push(S.x,S.y),m++}for(let k=0;k<a;k++){const L=w+k,U=A+k;v===!0?h.push(U,U+1,L):h.push(U+1,U,L),T+=3}c.addGroup(p,T,v===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oo(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class xd extends Oo{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new xd(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class vd extends cn{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),h(),this.setAttribute("position",new ke(s,3)),this.setAttribute("normal",new ke(s.slice(),3)),this.setAttribute("uv",new ke(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(M){const x=new H,v=new H,w=new H;for(let S=0;S<e.length;S+=3)u(e[S+0],x),u(e[S+1],v),u(e[S+2],w),l(x,v,w,M)}function l(M,x,v,w){const S=w+1,E=[];for(let T=0;T<=S;T++){E[T]=[];const b=M.clone().lerp(v,T/S),_=x.clone().lerp(v,T/S),A=S-T;for(let k=0;k<=A;k++)k===0&&T===S?E[T][k]=b:E[T][k]=b.clone().lerp(_,k/A)}for(let T=0;T<S;T++)for(let b=0;b<2*(S-T)-1;b++){const _=Math.floor(b/2);b%2===0?(d(E[T][_+1]),d(E[T+1][_]),d(E[T][_])):(d(E[T][_+1]),d(E[T+1][_+1]),d(E[T+1][_]))}}function c(M){const x=new H;for(let v=0;v<s.length;v+=3)x.x=s[v+0],x.y=s[v+1],x.z=s[v+2],x.normalize().multiplyScalar(M),s[v+0]=x.x,s[v+1]=x.y,s[v+2]=x.z}function h(){const M=new H;for(let x=0;x<s.length;x+=3){M.x=s[x+0],M.y=s[x+1],M.z=s[x+2];const v=g(M)/2/Math.PI+.5,w=p(M)/Math.PI+.5;o.push(v,1-w)}m(),f()}function f(){for(let M=0;M<o.length;M+=6){const x=o[M+0],v=o[M+2],w=o[M+4],S=Math.max(x,v,w),E=Math.min(x,v,w);S>.9&&E<.1&&(x<.2&&(o[M+0]+=1),v<.2&&(o[M+2]+=1),w<.2&&(o[M+4]+=1))}}function d(M){s.push(M.x,M.y,M.z)}function u(M,x){const v=M*3;x.x=t[v+0],x.y=t[v+1],x.z=t[v+2]}function m(){const M=new H,x=new H,v=new H,w=new H,S=new Gt,E=new Gt,T=new Gt;for(let b=0,_=0;b<s.length;b+=9,_+=6){M.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),v.set(s[b+6],s[b+7],s[b+8]),S.set(o[_+0],o[_+1]),E.set(o[_+2],o[_+3]),T.set(o[_+4],o[_+5]),w.copy(M).add(x).add(v).divideScalar(3);const A=g(w);y(S,_+0,M,A),y(E,_+2,x,A),y(T,_+4,v,A)}}function y(M,x,v,w){w<0&&M.x===1&&(o[x]=M.x-1),v.x===0&&v.z===0&&(o[x]=w/2/Math.PI+.5)}function g(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vd(t.vertices,t.indices,t.radius,t.details)}}const Lr=new H,Dr=new H,Rl=new H,kr=new Kn;class $A extends cn{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(Cs*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);const{a:y,b:g,c:p}=kr;if(y.fromBufferAttribute(r,c[0]),g.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),kr.getNormal(Rl),f[0]=`${Math.round(y.x*a)},${Math.round(y.y*a)},${Math.round(y.z*a)}`,f[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,f[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let M=0;M<3;M++){const x=(M+1)%3,v=f[M],w=f[x],S=kr[h[M]],E=kr[h[x]],T=`${v}_${w}`,b=`${w}_${v}`;b in d&&d[b]?(Rl.dot(d[b].normal)<=s&&(u.push(S.x,S.y,S.z),u.push(E.x,E.y,E.z)),d[b]=null):T in d||(d[T]={index0:c[M],index1:c[x],normal:Rl.clone()})}}for(const m in d)if(d[m]){const{index0:y,index1:g}=d[m];Lr.fromBufferAttribute(r,y),Dr.fromBufferAttribute(r,g),u.push(Lr.x,Lr.y,Lr.z),u.push(Dr.x,Dr.y,Dr.z)}this.setAttribute("position",new ke(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Jm extends ip{constructor(t){super(t),this.uuid=Li(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new ip().fromJSON(a))}return this}}const ZA={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=Qm(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,h,f,d,u;if(i&&(s=QA(n,t,s,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let m=e;m<a;m+=e)f=n[m],d=n[m+1],f<r&&(r=f),d<l&&(l=d),f>c&&(c=f),d>h&&(h=d);u=Math.max(c-r,h-l),u=u!==0?32767/u:0}return Bo(s,o,e,r,l,u,0),o}};function Qm(n,t,e,i,a){let s,o;if(a===h2(n,t,e,i)>0)for(s=t;s<e;s+=i)o=ap(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=ap(s,n[s],n[s+1],o);return o&&yc(o,o.next)&&(Go(o),o=o.next),o}function Ya(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(yc(e,e.next)||tn(e.prev,e,e.next)===0)){if(Go(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Bo(n,t,e,i,a,s,o){if(!n)return;!o&&s&&a2(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?jA(n,i,a,s):qA(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),Go(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=KA(Ya(n),t,e),Bo(n,t,e,i,a,s,2)):o===2&&JA(n,t,e,i,a,s):Bo(Ya(n),t,e,i,a,s,1);break}}}function qA(n){const t=n.prev,e=n,i=n.next;if(tn(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=a<s?a<o?a:o:s<o?s:o,f=r<l?r<c?r:c:l<c?l:c,d=a>s?a>o?a:o:s>o?s:o,u=r>l?r>c?r:c:l>c?l:c;let m=i.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=f&&m.y<=u&&Ts(a,r,s,l,o,c,m.x,m.y)&&tn(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function jA(n,t,e,i){const a=n.prev,s=n,o=n.next;if(tn(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,h=a.y,f=s.y,d=o.y,u=r<l?r<c?r:c:l<c?l:c,m=h<f?h<d?h:d:f<d?f:d,y=r>l?r>c?r:c:l>c?l:c,g=h>f?h>d?h:d:f>d?f:d,p=Oh(u,m,t,e,i),M=Oh(y,g,t,e,i);let x=n.prevZ,v=n.nextZ;for(;x&&x.z>=p&&v&&v.z<=M;){if(x.x>=u&&x.x<=y&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&Ts(r,h,l,f,c,d,x.x,x.y)&&tn(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=u&&v.x<=y&&v.y>=m&&v.y<=g&&v!==a&&v!==o&&Ts(r,h,l,f,c,d,v.x,v.y)&&tn(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=p;){if(x.x>=u&&x.x<=y&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&Ts(r,h,l,f,c,d,x.x,x.y)&&tn(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=M;){if(v.x>=u&&v.x<=y&&v.y>=m&&v.y<=g&&v!==a&&v!==o&&Ts(r,h,l,f,c,d,v.x,v.y)&&tn(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function KA(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!yc(a,s)&&t0(a,i,i.next,s)&&Ho(a,s)&&Ho(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),Go(i),Go(i.next),i=n=s),i=i.next}while(i!==n);return Ya(i)}function JA(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&r2(o,r)){let l=e0(o,r);o=Ya(o,o.next),l=Ya(l,l.next),Bo(o,t,e,i,a,s,0),Bo(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function QA(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=Qm(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(o2(c));for(a.sort(t2),s=0;s<a.length;s++)e=e2(a[s],e);return e}function t2(n,t){return n.x-t.x}function e2(n,t){const e=n2(n,t);if(!e)return t;const i=e0(e,n);return Ya(i,i.next),Ya(e,e.next)}function n2(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let h=1/0,f;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&Ts(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(s-e.x),Ho(e,n)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&i2(a,e)))&&(a=e,h=f)),e=e.next;while(e!==r);return a}function i2(n,t){return tn(n.prev,n,t.prev)<0&&tn(t.next,n,n.next)<0}function a2(n,t,e,i){let a=n;do a.z===0&&(a.z=Oh(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,s2(a)}function s2(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function Oh(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function o2(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Ts(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function r2(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!c2(n,t)&&(Ho(n,t)&&Ho(t,n)&&l2(n,t)&&(tn(n.prev,n,t.prev)||tn(n,t.prev,t))||yc(n,t)&&tn(n.prev,n,n.next)>0&&tn(t.prev,t,t.next)>0)}function tn(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function yc(n,t){return n.x===t.x&&n.y===t.y}function t0(n,t,e,i){const a=zr(tn(n,t,e)),s=zr(tn(n,t,i)),o=zr(tn(e,i,n)),r=zr(tn(e,i,t));return!!(a!==s&&o!==r||a===0&&Ir(n,e,t)||s===0&&Ir(n,i,t)||o===0&&Ir(e,n,i)||r===0&&Ir(e,t,i))}function Ir(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function zr(n){return n>0?1:n<0?-1:0}function c2(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&t0(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Ho(n,t){return tn(n.prev,n,n.next)<0?tn(n,t,n.next)>=0&&tn(n,n.prev,t)>=0:tn(n,t,n.prev)<0||tn(n,n.next,t)<0}function l2(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function e0(n,t){const e=new Bh(n.i,n.x,n.y),i=new Bh(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function ap(n,t,e,i){const a=new Bh(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function Go(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Bh(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function h2(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class Co{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return Co.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];sp(t),op(i,t);let o=t.length;e.forEach(sp);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,op(i,e[l]);const r=ZA.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function sp(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function op(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class yd extends vd{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new yd(t.radius,t.detail)}}class Ds extends cn{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],h=[];let f=t;const d=(e-t)/a,u=new H,m=new Gt;for(let y=0;y<=a;y++){for(let g=0;g<=i;g++){const p=s+g/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),l.push(u.x,u.y,u.z),c.push(0,0,1),m.x=(u.x/e+1)/2,m.y=(u.y/e+1)/2,h.push(m.x,m.y)}f+=d}for(let y=0;y<a;y++){const g=y*(i+1);for(let p=0;p<i;p++){const M=p+g,x=M,v=M+i+1,w=M+i+2,S=M+1;r.push(x,v,S),r.push(v,w,S)}}this.setIndex(r),this.setAttribute("position",new ke(l,3)),this.setAttribute("normal",new ke(c,3)),this.setAttribute("uv",new ke(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ds(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Md extends cn{constructor(t=new Jm([new Gt(0,.5),new Gt(-.5,-.5),new Gt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new ke(a,3)),this.setAttribute("normal",new ke(s,3)),this.setAttribute("uv",new ke(o,2));function c(h){const f=a.length/3,d=h.extractPoints(e);let u=d.shape;const m=d.holes;Co.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,p=m.length;g<p;g++){const M=m[g];Co.isClockWise(M)===!0&&(m[g]=M.reverse())}const y=Co.triangulateShape(u,m);for(let g=0,p=m.length;g<p;g++){const M=m[g];u=u.concat(M)}for(let g=0,p=u.length;g<p;g++){const M=u[g];a.push(M.x,M.y,0),s.push(0,0,1),o.push(M.x,M.y)}for(let g=0,p=y.length;g<p;g++){const M=y[g],x=M[0]+f,v=M[1]+f,w=M[2]+f;i.push(x,v,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return d2(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new Md(i,t.curveSegments)}}function d2(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class Mc extends cn{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],h=new H,f=new H,d=new H;for(let u=0;u<=i;u++)for(let m=0;m<=a;m++){const y=m/a*s,g=u/i*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(y),f.y=(t+e*Math.cos(g))*Math.sin(y),f.z=e*Math.sin(g),r.push(f.x,f.y,f.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/a),c.push(u/i)}for(let u=1;u<=i;u++)for(let m=1;m<=a;m++){const y=(a+1)*u+m-1,g=(a+1)*(u-1)+m-1,p=(a+1)*(u-1)+m,M=(a+1)*u+m;o.push(y,g,M),o.push(g,p,M)}this.setIndex(o),this.setAttribute("position",new ke(r,3)),this.setAttribute("normal",new ke(l,3)),this.setAttribute("uv",new ke(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mc(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class qi extends Za{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rm,this.normalScale=new Gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Di,this.combine=td,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class n0 extends en{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new te(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class u2 extends n0{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.groundColor=new te(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Pl=new De,rp=new H,cp=new H;class f2{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Gt(512,512),this.map=null,this.mapPass=null,this.matrix=new De,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new dd,this._frameExtents=new Gt(1,1),this._viewportCount=1,this._viewports=[new sn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;rp.setFromMatrixPosition(t.matrixWorld),e.position.copy(rp),cp.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(cp),e.updateMatrixWorld(),Pl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Pl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Pl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class p2 extends f2{constructor(){super(new Bm(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class m2 extends n0{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.shadow=new p2}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const lp=new De;class g2{constructor(t,e,i=0,a=1/0){this.ray=new ld(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new hd,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return lp.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(lp),this}intersectObject(t,e=!0,i=[]){return Hh(t,this,i,e),i.sort(hp),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)Hh(t[a],this,i,e);return i.sort(hp),i}}function hp(n,t){return n.distance-t.distance}function Hh(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)Hh(s[o],t,e,!0)}}class x2 extends $m{constructor(t=10,e=10,i=4473924,a=8947848){i=new te(i),a=new te(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,u=0,m=-r;d<=e;d++,m+=o){l.push(-r,0,m,r,0,m),l.push(m,0,-r,m,0,r);const y=d===s?i:a;y.toArray(c,u),u+=3,y.toArray(c,u),u+=3,y.toArray(c,u),u+=3,y.toArray(c,u),u+=3}const h=new cn;h.setAttribute("position",new ke(l,3)),h.setAttribute("color",new ke(c,3));const f=new fd({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Qh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Qh);const v2={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function y2(n,t,e,i){const a=new si(n.fov,i,.1,200),s=new H,o=new H,r=new H;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1,d=0,u=0,m=0,y=0,g=0,p=0;function M(){const x=(n.pitchDeg+h.pitchDelta)*Math.PI/180,v=n.yawDeg*Math.PI/180;r.set(Math.sin(v)*Math.cos(x),Math.sin(x),Math.cos(v)*Math.cos(x)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return M(),{camera:a,update(x,v,w,S,E=v2){const T=v+.6;if(!l)s.set(x,T,w),l=!0;else{const A=1-Math.exp(-Math.max(n.smoothing,.001)*S);s.x+=(x-s.x)*A,s.y+=(T-s.y)*A,s.z+=(w-s.z)*A}const b=1-Math.exp(-Math.max(t.smoothing,.001)*S);h.distanceScale+=(E.distanceScale-h.distanceScale)*b,h.offsetX+=(E.offsetX-h.offsetX)*b,h.offsetZ+=(E.offsetZ-h.offsetZ)*b,h.pitchDelta+=(E.pitchDelta-h.pitchDelta)*b;const _=1-Math.exp(-Math.max(e.smoothing,.001)*S);if(h.zoom+=(f-h.zoom)*_,M(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),d>.001){u+=S*52;const A=d*.055;a.position.x+=Math.sin(u*1.7)*A,a.position.y+=Math.sin(u*2.3+1.1)*A*.75,a.position.z+=Math.sin(u*1.3+2.4)*A*.5,d*=Math.exp(-9*S)}else d=0;g>.001?(a.position.x+=m*g,a.position.z+=y*g,g*=Math.exp(-13*S)):g=0,a.updateMatrixWorld()},snap(x,v,w){s.set(x,v+.6,w),l=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),M(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new H().setFromMatrixColumn(a.matrixWorld,0),v=new H().setFromMatrixColumn(a.matrixWorld,2).negate(),w=Math.hypot(x.x,x.z)||1,S=Math.hypot(v.x,v.z)||1;return{rightX:x.x/w,rightZ:x.z/w,forwardX:v.x/S,forwardZ:v.z/S}},addShake(x){!Number.isFinite(x)||x<=0||(d=Math.min(1,d+x))},shakeLevel(){return d},addKick(x,v,w){if(!Number.isFinite(x)||!Number.isFinite(v)||!(w>0))return;const S=Math.hypot(x,v);S<1e-4||(m=x/S*w,y=v/S*w,g=1,p++)},kickLevel(){return g},kickCount(){return p},setZoom(x){f=Number.isFinite(x)&&x>0?x:1},smart(){return{...h}}}}const Ga=Math.PI*2,On=1e-6;function nn(n,t,e){return n<t?t:n>e?e:n}function i0(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function M2(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function a0(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=M2(n);return i===1?a:e+(a-e)*i}function dp(n){return(1-Math.sin(n))/2}function _d(n,t,e){const i=Math.PI/180,a=nn(Number.isFinite(t)?t:100,0,180),s=nn(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=nn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function cc(n,t,e,i){const a=t>=0?1:-1,o=2/Math.max(On,i)*Math.max(0,e),r=nn(n,-1,1),l=a-r;return Math.abs(l)<=o?a:r+Math.sign(l)*o}function up(n){const t=nn(Number.isFinite(n)?n:1,-1,1),e=Math.abs(t);return Math.sign(t)*e*e*(3-2*e)}function _2(n,t,e,i){if(!(e>0))return t;const a=e*Math.max(0,i),s=t-n;return Math.abs(s)<=a?t:n+Math.sign(s)*a}const fp=30*Math.PI/180,b2=100*Math.PI/180,S2=.06,w2=.22;function s0(n){return nn((Math.abs(n)-fp)/(b2-fp),0,1)}function o0(n,t,e,i=S2,a=w2){const s=nn(n,0,1),o=nn(t,0,1),r=o>s?Math.max(On,i):Math.max(On,a),l=e/r*1,c=o-s;return Math.abs(c)<=l?o:s+Math.sign(c)*l}function r0(n,t,e,i,a){if(!(e>0))return t;const s=1-nn(a,0,1);return s<=1e-9?n:_2(n,t,s*e,i)}function lc(n,t){if(!n.grounded||n.speed<On)return i0();const e=n.speed/Math.max(n.moveSpeed,On),i=Math.max(n.legLength,On),a=n.stride>On?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+On,h=_d(n.localForward/Math.max(n.speed,On),t.backStrafeStartDeg,t.backStrafeFullDeg),f=l/c*h,d=r/c+l/c*(1-h),u=up(n.dirF??(n.localForward>=0?1:-1)),m=up(n.dirR??(n.localRight>=0?1:-1)),y=a,g=U=>Math.asin(nn(U,-o,o)/i);function p(U,D){const P=a0(U,t.plantLock),O=dp(U),B=u*d*y*P,W=-g(B),et=D*m>0?1:-1,lt=1+et*t.crossStep*.45,pt=m*et*t.crossStep*y*.4*O,Pt=m*f*y*t.sideWeight*lt*P+pt*f,Y=g(Pt),nt=t.kneeLift*O*s*(.55+.25*d+.1*f*(1+D*m));return{pitchX:W,rollZ:Y,kneeX:nt}}const M=(n.phase%Ga+Ga)%Ga,x=p(M,-1),v=p((M+Math.PI)%Ga,1),w=Math.cos(M),S=dp(M),E=-t.comSway*s*w*(.6*d+.8*f)-m*t.comSway*s*f*.45,T=t.comBob*S*s,b=m*t.hipLean*s*f*w*.6,_=m*t.hipLean*s*f*(.45+.25*w),A=t.armSwing*s*w*(d*u+.3*f),k=A,L=-A;return{legL:x,legR:v,pelvisX:E,pelvisY:T,pelvisRoll:b,sideLean:_,armL:k,armR:L,strafe:f,backward:u<0?d:0}}function c0(n){const t=(n%Ga+Ga)%Ga,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function l0(n,t,e){const i=nn(e.progress,0,1);if(i>=1||n.speed<On)return i0();const a=i*i*(3-2*i),s=1-a;return lc({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function h0(n,t,e,i){const a=nn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return nn(o*a,-1,1)*(e*Math.PI/180)}function d0(n,t=0){const e=nn(n,0,1);return e*e+(1-e*e)*nn(t,0,1)}function u0(n,t,e){if(!(n>0)||!(t>0))return 0;const i=nn(e,0,1);return t+(n-t)*i}function f0(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=nn(i,0,1);return e*l+r*(1-l)}function p0(n,t,e,i,a){const s=Math.max(e,On),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>On?(t-n)/t:0,c=l>.02,h=l<-.015,f=n<=o*.15,d=!h&&n<r&&(c||f);return{enter:n>On&&n<=o&&c,resume:!d}}function m0(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return nn(n*nn(t,0,2),-i,i)}function g0(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function x0(n,t,e){const i=nn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function E2(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=nn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*l,rollZ:u*d*l,kneeX:f*l},legR:{pitchX:-h*c,rollZ:-u*d*c,kneeX:f*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function v0(n,t,e,i,a){const s=nn(n,0,1),o=nn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,h=Math.hypot(e,i),f=h>On?e/h:1,d=h>On?i/h:0,u=a0(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:u,fwdN:f,rightN:d,env:c}}function Rn(n){return n<0?0:n>1?1:n}const Vr=Math.PI*2;function T2(n){return((n+Math.PI)%Vr+Vr)%Vr-Math.PI}function A2(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function R2(n,t,e,i,a,s=n.phase){const o=Rn(i);if(o<=0)return n;const r=Rn(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,f=Rn(a.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,a.strideScale??0)*d,m=r*r*(3-2*r),y={speed:c,phase:s+Vr*l/2*m,localForward:c*f,localRight:c*(1-f)*h},g=T2(y.phase-n.phase),p=o*o*(3-2*o),M=n.speed>.05?d:0;return{speed:n.speed+(y.speed-n.speed)*o,phase:n.phase+g*p,localForward:n.localForward+(y.localForward-n.localForward)*o,localRight:n.localRight+(y.localRight-n.localRight)*o,stride:M+(u-M)*o*o}}function P2(n,t,e){const i=A2(),a=Rn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,h=e.stepKnee*s,f=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=f*.25*o,i}function y0(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function pp(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*y0(s,a)}function C2(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function L2(n,t,e){const i=Rn(n);return{gaitScale:1-i*(1-Rn(t)),attackLegWeight:Rn(e)*i}}function D2(n,t,e){const i=Rn(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function k2(n,t){const e=Rn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function I2(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Rn(t.minScale+(1-t.minScale)*e)}function z2(){return M0()}function M0(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function F2(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function U2(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Rn(t.forceHitHeight):n.type==="light"?Rn(t.hitHeight.light):n.type==="heavy"?Rn(t.hitHeight.heavy):n.type==="knock"?Rn(t.hitHeight.knock):0}function N2(n,t,e){const i=Rn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function _0(n,t,e){const i=M0(),a=F2(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=Rn(1-n.timer/n.duration),o=y0(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=U2(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const y=Math.sin(Math.PI*s);return i.upperPitch=a*y*f,i.upperRoll=-a*y*d*.7,i.drop=(a>.5?.09:.04)*y,i.flash=e.flashStrength*y,i.active=y>0,i}const u=a*o,m=N2(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(m.upperPitch*f+m.fold),i.upperRoll=-u*m.upperRoll*d,i.upperYaw=u*m.upperYaw*d,i.upperShift=u*m.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*m.back,i.drop=u*m.drop,i.knee=u*m.knee,i.hip=u*m.hip,i.arm=u*m.arm,i.flash=e.flashStrength*o,i}function b0(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const La=1e-6;function Lo(n,t,e){return n<t?t:n>e?e:n}function S0(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=La||s<=La||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+La,c=Math.hypot(n.x,n.y,n.z);if(c<=La)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),m=Lo(u,l,r),y=u>r+La||u<l-La,g=Math.atan2(-d,Math.max(f,La)),p=Lo((a*a+m*m-s*s)/(2*a*m),-1,1),M=Lo((s*s+m*m-a*a)/(2*s*m),-1,1),x=Math.acos(p),v=Math.acos(M),w=i>=0?1:-1;return{rootPitch:g-w*x,rootRoll:h,jointPitch:w*(x+v),clamped:y,reach:c/r}}function w0(n,t,e,i){const a=Lo(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=Lo((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function E0(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const bd={active:!1,weight:0,clamped:0,maxError:0};function T0(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...bd};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(u=>u.tip.getWorldPosition(new H));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<a.length;u++){const m=a[u],y=i.worldToLocal(l[u].clone()),g={x:y.x-m.root.position.x,y:y.y-m.root.position.y,z:y.z-m.root.position.z},p=S0(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(f+=1);const M=w0({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,c,h);m.root.rotation.x=M.rootPitch,m.root.rotation.z=M.rootRoll,m.joint.rotation.x=M.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<a.length;u++){const m=a[u].tip.getWorldPosition(new H);d=Math.max(d,m.distanceTo(l[u]))}return{active:!0,weight:c,clamped:f,maxError:d}}function zn(n,t,e){return n<t?t:n>e?e:n}function O2(n,t,e,i,a,s,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Re,d=new Re;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new Re;u.name="lower";const m=new Re;m.name="upper",d.add(u),d.add(m);const y=[],g=($,ct,Nt,Ft)=>{const Ct=new qi({color:Ft}),I=new Me(new Xn($,ct,Nt),Ct);return I.castShadow=!0,I.receiveShadow=!0,y.push(Ct),I},p=n.headSize,M=n.legLength,x=n.armLength,v=n.limbThickness,w=n.bodyHeight,S=n.bodyWidth,E=g(S,w,.28,e);E.position.y=w/2,m.add(E);const T=new Re;T.name="headPivot",T.rotation.order="YXZ",T.position.y=w,m.add(T);const b=g(p,p,p,e);b.position.y=p/2,T.add(b);for(const $ of[-1,1]){const ct=g(.06,.07,.02,t.shoe);ct.position.set($*.09,p/2+.03,p/2+.011),T.add(ct)}const _=($,ct)=>{const Nt=ct?x:M,Ft=new Re;Ft.name=ct?$<0?"shoulderL":"shoulderR":$<0?"hipL":"hipR",ct||(Ft.rotation.order="ZYX"),Ft.position.set($*(ct?S/2+v/2:S/2-v/2),ct?w-.04:0,0),(ct?m:u).add(Ft);const Ct=g(v,Nt/2,v,t.limb);Ct.position.y=-Nt/4,Ft.add(Ct);const I=new Re;I.name=ct?"elbow":"knee",I.position.y=-Nt/2,Ft.add(I);const yt=g(v,Nt/2,v,t.limb);if(yt.position.y=-Nt/4,I.add(yt),!ct){const Q=g(v*1.15,.07,v*1.7,t.shoe);Q.position.set(0,-Nt/2+.035,.045),I.add(Q);const rt=new en;return rt.name="footTip",rt.position.y=-Nt/2,I.add(rt),{root:Ft,joint:I,tip:rt}}return{root:Ft,joint:I}},A=_(-1,!1),k=_(1,!1),L=_(-1,!0),U=_(1,!0),D=[A,k].map($=>({root:$.root,joint:$.joint,tip:$.tip,upperLen:M/2,lowerLen:M/2,bend:1})),P=new vn({color:a.attackArcColor,transparent:!0,opacity:0,side:Ke,depthWrite:!1}),O=new Me(new Mc(.62,.042,6,20,Math.PI*1.1),P);O.position.set(0,.78-M,.56),m.add(O);const B=new te(e),W=new te(r.flashColor),et=new te;let lt=null,pt=0,Pt=0,Y=0,nt=0,ut=0,st=0,tt=0,dt={...bd},Ut=-1,Vt=0,ht=0,X=0,N=0,At=0,Rt=0,St=0,vt=1,mt=0,kt=0,F=0,R=0,K=-1,ft=0,V="none",ot=0,zt=!1,Et=-1,bt=!1,Wt=0,gt=0,Lt=1,j=1;return{group:f,boneAtWorld($,ct,Nt){const Ft=[{node:m,ax:0,ay:.05,az:0,bx:0,by:w,bz:0},{node:T,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:L.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:L.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:A.root,ax:0,ay:0,az:0,bx:0,by:-M/2,bz:0},{node:A.joint,ax:0,ay:0,az:0,bx:0,by:-M/2,bz:0},{node:k.root,ax:0,ay:0,az:0,bx:0,by:-M/2,bz:0},{node:k.joint,ax:0,ay:0,az:0,bx:0,by:-M/2,bz:0}],Ct=new H,I=new H,yt=new H($,ct,Nt),Q=new H;let rt=null,Dt=Number.POSITIVE_INFINITY;for(const Tt of Ft){Tt.node.updateWorldMatrix(!0,!1),Ct.set(Tt.ax,Tt.ay,Tt.az),I.set(Tt.bx,Tt.by,Tt.bz),Tt.node.localToWorld(Ct),Tt.node.localToWorld(I);const qt=I.x-Ct.x,he=I.y-Ct.y,de=I.z-Ct.z,ne=qt*qt+he*he+de*de;let Ee=ne>1e-8?((yt.x-Ct.x)*qt+(yt.y-Ct.y)*he+(yt.z-Ct.z)*de)/ne:0;Ee=Math.max(0,Math.min(1,Ee));const Ie=Ct.x+qt*Ee,Ye=Ct.y+he*Ee,Te=Ct.z+de*Ee,Le=(yt.x-Ie)**2+(yt.y-Ye)**2+(yt.z-Te)**2;Le<Dt&&(Dt=Le,rt=Tt.node,Q.set(Ie,Ye,Te))}return rt?{node:rt,point:Q.clone()}:null},update($,ct,Nt){const Ft=Nt===void 0||K<0?ct:zn(Nt-K,0,.1);Nt!==void 0&&(K=Nt),f.position.set($.position.x,$.position.y,$.position.z),f.rotation.y=$.bodyYaw,T.rotation.y=($.headYaw-$.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,$.mode!==lt&&(lt=$.mode,pt=1),pt=Math.max(0,pt-ct*2.2);const Ct=$.hurt,I=_0(Ct,$.bodyYaw,r),yt=I.flash;et.copy(W).multiplyScalar(yt);for(const ue of y)ue.emissive.copy(B).multiplyScalar(pt*.5),yt>0&&ue.emissive.add(et);d.position.set(0,M,0),d.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const Q=Math.hypot($.velocity.x,$.velocity.z),rt=zn(o.knockGaitScale??0,0,1),Dt=$.hurt.knockX*rt,Tt=$.hurt.knockZ*rt,qt=rt>0&&Math.hypot($.hurt.knockX,$.hurt.knockZ)>.001,he=$.velocity.x+Dt,de=$.velocity.z+Tt,ne=Math.hypot(he,de),Ee=Math.cos($.bodyYaw),Ie=-Math.sin($.bodyYaw),Ye=Q>1e-6?zn(($.velocity.x*Ee+$.velocity.z*Ie)/Q,-1,1):0,Te=Q>1e-6?zn(($.velocity.x*Math.sin($.bodyYaw)+$.velocity.z*Math.cos($.bodyYaw))/Q,-1,1):1,Le=_d(Te,o.backStrafeStartDeg,o.backStrafeFullDeg);V==="settled"&&bt&&Wt>gt*1.02+1e-4&&(V="none");let ze=1;V==="blend"?(ze=x0(zt?Et:ot,o.stopYawBlendMode,zt),zt||(ot=Math.min(1,ot+ct/Math.max(.01,o.stopYawAfterSec)),(ot>=1||o.stopYawBlendMode==="inStop"||bt)&&(V="settled",ze=0))):V==="settled"&&(ze=zn(Q/Math.max(1e-6,o.stopEnterRatio*s),0,1));const Mn=h0(Ye,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),Cn=Ft>1e-6?Ve($.bodyYaw-F)/Ft:0;F=$.bodyYaw;const ln=(o.hipYawTrackRateDeg??0)*Math.PI/180,Ln=(o.hipYawBackRateDeg??0)*Math.PI/180,_n=Ft>1e-6?Ft:ct;R=ln>0?o0(R,s0(Cn),_n):0;const Z=d0(Le,R),It=zn(Q/.5,0,1),Ot=f0(Te,Ye,Mn,Z)*ze*It,ie=r0(kt,Ot,u0(ln,Ln,Z),_n,R);kt=ie,mt+=(ie-mt)*(1-Math.exp(-12*Math.max(0,_n))),u.rotation.y=mt;const oe=$.bodyYaw+mt,C=Math.sin(oe),G=Math.cos(oe),it=Math.cos(oe),at=-Math.sin(oe),q=he*C+de*G,wt=he*it+de*at,Bt=Math.max(0,o.stopBlendSec||0),Zt=Bt>0&&!qt,Xt=p0(Q,ft,s,o.stopEnterRatio,o.stopExitRatio);if(!Zt||Xt.resume)Ut=-1;else if(Ut<0&&Xt.enter){Ut=0,Vt=$.gaitPhase,ht=c0($.gaitPhase),X=Q,N=Math.max($.stride,1e-6),At=q,Rt=wt;const ue=1/Math.max(1e-6,Q);St=$.velocity.x*ue,vt=$.velocity.z*ue}const ae=ft;ft=Q;const re=Zt&&Ut>=0;re&&(Ut=Math.min(1,Ut+ct/Bt)),re&&V!=="blend"&&(V="blend",ot=0),zt=re&&Ut<1,Et=Ut,bt=Xt.resume,Wt=Q,gt=ae;const Yt=Math.max(0,o.dirFlipSec??0);Yt>0?(Lt=cc(Lt,q>=0?1:-1,ct,Yt),j=cc(j,wt>=0?1:-1,ct,Yt)):(Lt=q>=0?1:-1,j=wt>=0?1:-1);const le=re?{phase:Vt,speed:X,moveSpeed:s,localForward:At,localRight:Rt,dirF:Lt,dirR:j,legLength:n.legLength,stride:N,grounded:!0}:{phase:$.gaitPhase,speed:ne,moveSpeed:s,localForward:q,localRight:wt,dirF:Lt,dirR:j,legLength:n.legLength,stride:$.stride,grounded:!0},ee=re?l0(le,o,{progress:Ut,phase0:Vt,phaseEnd:ht}):lc(le,o);let ge=0,Ne=0,fe=0,$t=0;if(re){const ue=g0($.bodyYaw,St,vt),Ce=v0(Ut,Vt,ue.forward,ue.right,o);Ce.leadLeft?(ee.legL.pitchX-=Ce.leadPitch,ee.legL.kneeX+=Ce.leadKnee,ee.legR.pitchX+=Ce.trailPitch):(ee.legR.pitchX-=Ce.leadPitch,ee.legR.kneeX+=Ce.leadKnee,ee.legL.pitchX+=Ce.trailPitch),Ne=Ce.bodyShift*Ce.fwdN,ge=Ce.bodyShift*Ce.rightN,fe=Ce.bodyDip,$t=Ce.chestPitch}A.root.rotation.x=ee.legL.pitchX,k.root.rotation.x=ee.legR.pitchX,A.root.rotation.z=ee.legL.rollZ,k.root.rotation.z=ee.legR.rollZ,A.joint.rotation.x=ee.legL.kneeX,k.joint.rotation.x=ee.legR.kneeX,L.root.rotation.x=ee.armL,U.root.rotation.x=ee.armR,L.joint.rotation.x=-.18,U.joint.rotation.x=-.18,d.position.x=ee.pelvisX,d.position.y=M+ee.pelvisY,d.position.z=0,d.rotation.z=ee.pelvisRoll,m.rotation.z=ee.sideLean*(I.intensity>0?.4:1);const Qt=E0(d,u),Mt=re&&h.enabled?{...h,weight:1}:h,jt=Mt.enabled&&Mt.weight>0?zn(Mt.weight,0,1):0;if(d.position.x+=ge,d.position.z+=Ne,d.position.y-=fe,u.position.y+=fe,jt<=0&&(u.position.x-=ge,u.position.z-=Ne),l){const ue=Math.max(.004166666666666667,Math.min(ct,.1)),Ce=Math.sin($.bodyYaw),He=Math.cos($.bodyYaw),un=zn(($.velocity.x-Pt)/ue,-60,60),Sn=zn(($.velocity.z-Y)/ue,-60,60),oi=un*Ce+Sn*He,va=Ve($.bodyYaw-nt)/ue,Zs=l.maxForwardDeg*Math.PI/180,ji=l.maxSideDeg*Math.PI/180,ri=1-Math.exp(-Math.max(0,l.smoothing)*ue);ut+=(zn(oi*l.accelGain,-Zs,Zs)-ut)*ri,st+=(zn(-va*Q*l.turnGain,-ji,ji)-st)*ri;const Dn=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;tt+=(zn(Q/Math.max(s,1e-6),0,1)-tt)*(1-Math.exp(-Math.max(0,Dn)*ue));const ci=b0({leanForward:ut,leanSide:st,speedRatio:tt},l);m.rotation.x+=ut+$t,m.rotation.z+=st,d.rotation.x+=ci.pelvisPitch,d.rotation.z+=ci.pelvisRoll,d.position.x+=ci.pelvisX,d.position.z+=ci.pelvisZ,d.position.y-=ci.crouch,u.position.y+=ci.crouch*(1-jt)}Pt=$.velocity.x,Y=$.velocity.z,nt=$.bodyYaw,m.rotation.x+=I.upperPitch,m.rotation.z+=I.upperRoll,m.rotation.y+=I.upperYaw;const Pe=zn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),xe=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=zn(I.upperShiftX*Pe,-xe,xe),m.position.z+=zn(I.upperShiftZ*Pe,-xe,xe),d.position.x+=I.comX,d.position.z+=I.comZ-I.pelvisBack,d.position.y-=I.drop;const bn=I.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=I.pelvisBack*(1-bn),u.position.y+=I.drop*(1-bn),A.joint.rotation.x+=I.knee,k.joint.rotation.x+=I.knee,A.root.rotation.x-=I.hip,k.root.rotation.x-=I.hip,L.root.rotation.x+=I.arm,U.root.rotation.x+=I.arm*.8,$.attackPhase!=="idle"&&I.intensity===0){const ue=$.attackProgress,Ce=ue<.34?-1:ue<.68?-1+(ue-.34)/.34*2:Math.max(0,1-(ue-.68)/.32),He=Math.max(0,-Ce),un=Math.max(0,Ce);U.root.rotation.x=-1.7*He+1.25*un,U.joint.rotation.x=-(.25+He*.45),m.rotation.y=-.28*Ce,P.opacity=$.attackPhase==="active"?.85:0,$.attackPhase==="active"&&(O.rotation.z=-1.1+ue*3)}else P.opacity=0;const _e=m0(mt,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=_e,T.rotation.y=($.headYaw-$.bodyYaw-_e+Math.PI*3)%(Math.PI*2)-Math.PI,dt=T0({root:f,pelvis:d,lower:u,limbs:D,base:Qt,cfg:Mt,grounded:!0,attacking:$.attackPhase!=="idle"})},ik(){return dt},dispose(){f.traverse($=>{if($ instanceof Me){$.geometry.dispose();const ct=$.material;Array.isArray(ct)?ct.forEach(Nt=>Nt.dispose()):ct.dispose()}})}}}const B2=9.81;function _o(n,t,e){return n<t?t:n>e?e:n}function H2(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:B2,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,l=0,c=0,h=0;for(const b of n){const _=Number.isFinite(b.mass)&&b.mass>0?b.mass:0;!Number.isFinite(b.x)||!Number.isFinite(b.y)||!Number.isFinite(b.z)||(r+=_,l+=b.x*_,c+=b.y*_,h+=b.z*_)}if(r<=1e-6)return o;l/=r,c/=r,h/=r;const f=Math.max(.02,(t.maxX-t.minX)/2),d=Math.max(.02,(t.maxZ-t.minZ)/2),u=(t.minX+t.maxX)/2,m=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:l,comY:c,comZ:h,centerX:u,centerZ:m,halfX:f,halfZ:d};const g=_o((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,c)/s)*g*4,M=l+(Number.isFinite(e)?e:0)*p,x=h+(Number.isFinite(i)?i:0)*p,v=Math.abs(M-u)/f,w=Math.abs(x-m)/d,S=_o(1-Math.max(v,w),0,1),E=Math.max(0,Math.abs(M-u)-f),T=Math.max(0,Math.abs(x-m)-d);return{comX:l,comY:c,comZ:h,xcomX:M,xcomZ:x,centerX:u,centerZ:m,halfX:f,halfZ:d,marginX:_o(1-v,-1,1),marginZ:_o(1-w,-1,1),score:S,leanDeg:Math.atan2(M-u,x-m)*180/Math.PI,side:v>.98?M>u?1:-1:0,overX:E,overZ:T,grounded:!0}}function G2(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function X2(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=_o(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const Gh={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},V2=1e-6;function jn(n,t,e){return n<t?t:n>e?e:n}function Cl(n,t){const e=Math.max(.2,n);return jn(Math.pow(e,-t),.5,2)}function W2(n,t){if(!t.enabled)return{...Gh};const e=jn(n.swing,-1,1),i=jn(n.charge,0,1),a=jn(n.impact,0,1),s=jn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=jn(t.chargeArm,.6,1),f=1-(1-h)*c,d=1-(1-h)*i;let u=1;o>0?u=l:c>0?u=f:i>0&&(u=d);const m=1-jn(t.impactSquash,0,.6)*a;u*=m;const y=Math.max(1,t.runLeg),p=(n.grounded?1+(y-1)*s:1)*(1-jn(t.impactSquash,0,.6)*a*.6),M=jn(t.torsoGain,0,1),x=1+(u-1)*M;return u=jn(u,.6,1.6),{arm:u,leg:jn(p,.6,1.4),torso:jn(x,.7,1.4),girthArm:Cl(u,t.volumeExp),girthLeg:Cl(p,t.volumeExp),girthTorso:Cl(x,t.volumeExp)}}function Y2(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function $2(n,t,e){const i=n*Math.exp(-Math.max(V2,e)*Math.max(0,t));return i<.001?0:jn(i,0,1)}const mp=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function ks(n,t,e){return n<t?t:n>e?e:n}function Ge(n,t,e){return n+(t-n)*e}function Z2(n){return n?typeof n=="string"?{clip:n}:n:null}function q2(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function j2(n,t){const e=n%3*2,i=mp[e],a=mp[e+1];return{...q2(),bodyYaw:Ge(i.yaw,a.yaw,t),bodyPitch:Ge(i.pitch,a.pitch,t),bodyRoll:Ge(i.roll,a.roll,t),pelvisX:Ge(i.px,a.px,t),pelvisZ:Ge(i.pz,a.pz,t),armPitch:Ge(i.ap,a.ap,t),armYaw:Ge(i.ay,a.ay,t),armRoll:Ge(i.ar,a.ar,t),elbow:Ge(i.el,a.el,t),bladePitch:Ge(i.blade,a.blade,t)}}function K2(n,t,e,i,a=0){var b,_,A;const s=((b=i.combo)==null?void 0:b[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=Z2(s[r]),c=l?((_=i.clips)==null?void 0:_[l.clip])??null:null,h=ks(((A=i.weaponScale)==null?void 0:A[n])??1,0,2),f=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=l&&Number.isFinite(l.scale)?l.scale:h,u=d*f,m=ks((e+1)/2,0,1),y=c&&c.keys.length>0?jv(c,m):j2(r,m),g=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",p=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",M=n==="dual-swords",x=c&&Sa(c,"bladeTwistOff")?y.bladeTwistOff:M?y.bladeTwist:0,v=c&&Sa(c,"bladeYawOff")?y.bladeYawOff:-y.bladeYaw,w={yaw:y.bodyYaw*u,rootYaw:y.rootYaw*u,spinYaw:Kv(c,ks(a,0,1)),pitch:y.bodyPitch*u,roll:y.bodyRoll*u,pelvisZ:y.pelvisZ*u,pelvisX:y.pelvisX*u,armR:null,armL:null,bladePitch:y.bladePitch,bladePitchOff:c&&Sa(c,"bladePitchOff")?y.bladePitchOff:null,bladeTwist:y.bladeTwist,bladeTwistOff:x,bladeYaw:y.bladeYaw,bladeYawOff:v,lead:g,kind:p,strike:m,blend:l&&Number.isFinite(l.blend)?l.blend:null},S={pitch:y.armPitch*d,yaw:y.armYaw*d,roll:y.armRoll*d,elbow:y.elbow*d},E=c?Sa(c,"armLPitch")||Sa(c,"armLYaw")||Sa(c,"armLRoll")||Sa(c,"elbowL"):!1,T=E?{pitch:y.armLPitch*d,yaw:y.armLYaw*d,roll:y.armLRoll*d,elbow:y.elbowL*d}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return g==="L"?(w.armL=S,w.armR=n==="greatsword"?null:T):(w.armR=S,(n==="greatsword"||n==="dual-swords"||E)&&(w.armL=T)),w}function J2(n,t,e){const i=ks(e,0,1),a=(s,o)=>s?o?{pitch:Ge(s.pitch,o.pitch,i),yaw:Ge(s.yaw,o.yaw,i),roll:Ge(s.roll,o.roll,i),elbow:Ge(s.elbow,o.elbow,i)}:null:o;return{yaw:Ge(n.yaw,t.yaw,i),rootYaw:Ge(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Ge(n.pitch,t.pitch,i),roll:Ge(n.roll,t.roll,i),pelvisZ:Ge(n.pelvisZ,t.pelvisZ,i),pelvisX:Ge(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Ge(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Ge(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Ge(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Ge(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Ge(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Ge(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Ge(n.strike,t.strike,i),blend:t.blend??null}}function Q2(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function gp(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function tR(n,t){const e=(a,s)=>Math.abs(Q2(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=gp(n.armR,t.armR),i+=gp(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function eR(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),l=Math.max(.1,e.segBlendRef??6),c=ks(tR(n,t)/l,0,1);return o+(r-o)*c}function xp(n){const t=ks(n,0,1);return t*t*(3-2*t)}function We(n,t,e,i){const a=new Me(new Xn(n,t,e),new qi({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function Qe(){return new Re}function Wr(n,t,e){const i=Qe(),a=We(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=We(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=We(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=We(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=We(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function nR(n){const t=Wr(.72,.15,n),e=We(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function iR(n){const t=Qe(),e=We(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=We(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function aR(n){const t=Qe(),e=We(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=We(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new te(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function sR(n){const t=Qe();for(let i=0;i<5;i++){const a=(i-2)*.15,s=We(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=We(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function oR(n){const t=Qe(),e=We(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=We(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function me(n,t,e){return n<t?t:n>e?e:n}const Hi=1e-6;function A0(n,t,e,i,a,s,o,r,l,c,h,f,d){const u=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},m=f??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},y=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},M=Qe(),x=Qe();x.name="pelvis",x.position.y=n.legLength,M.add(x);const v=Qe();v.name="lower";const w=Qe();w.name="upper",x.add(v),x.add(w);const S=n.headSize,E=n.legLength,T=n.armLength,b=n.limbThickness,_=n.bodyHeight,A=n.bodyWidth,k=l.spine,L=!!(k!=null&&k.enabled),U=L?me(k.chestPivot??.42,.15,.85)*_:0,D=Qe();D.name="chest",D.position.y=U,w.add(D);const P=L?D:w;let O,B=null,W=_,et=0;L?(W=Math.max(.05,U),et=Math.max(.05,_-U),O=We(A,W,.28,t.body),O.name="torsoLower",O.position.y=W/2,w.add(O),B=We(A+.008,et,.288,t.body),B.name="torsoUpper",B.position.y=et/2,D.add(B)):(O=We(A,_,.28,t.body),O.name="torso",O.position.y=_/2,w.add(O));const lt=Qe();lt.name="headPivot",lt.rotation.order="YXZ",lt.position.y=Math.min(i.headPivotHeight,_)-U,P.add(lt);const pt=We(S,S,S,t.head);pt.position.y=S/2,lt.add(pt);const Pt=new qi({color:"#1b2733"});for(const z of[-1,1]){const J=new Me(new Xn(.06,.07,.02),Pt);J.position.set(z*.09,S/2+.03,S/2+.011),lt.add(J)}const Y=z=>{const J=Qe();J.name=z<0?"hipL":"hipR",J.rotation.order="ZYX",J.position.set(z*(A/2-b/2),0,0),v.add(J);const xt=We(b,E/2,b,t.limb);xt.position.y=-E/4,J.add(xt);const _t=Qe();_t.name="knee",_t.position.y=-E/2,J.add(_t);const Kt=We(b,E/2,b,t.limb);Kt.position.y=-E/4,_t.add(Kt);const Jt=We(b*1.15,.07,b*1.7,t.shoe);Jt.position.set(0,-E/2+.035,.045),_t.add(Jt);const ce=new en;ce.name="footTip",ce.position.y=-E/2,_t.add(ce);const Se=Qe();return{root:J,joint:_t,hand:Se,wrist:Se,tip:ce,upperMesh:xt,lowerMesh:Kt,segLen:E/2}},nt=z=>{const J=Qe();J.name=z<0?"shoulderL":"shoulderR",J.rotation.order="YXZ",J.position.set(z*(A/2+b/2),_-.04-U,0),P.add(J);const xt=We(b,T/2,b,t.limb);xt.position.y=-T/4,J.add(xt);const _t=Qe();_t.name="elbow",_t.position.y=-T/2,J.add(_t);const Kt=We(b,T/2,b,t.limb);Kt.position.y=-T/4,_t.add(Kt);const Jt=Qe();Jt.name=z<0?"handL":"handR",Jt.position.y=-T/2,_t.add(Jt);const ce=We(b*1.1,.09,b*1.1,t.head);ce.position.y=.045,Jt.add(ce);const Se=Qe();return Se.name=z<0?"wristL":"wristR",Jt.add(Se),{root:J,joint:_t,hand:Jt,wrist:Se,upperMesh:xt,lowerMesh:Kt,segLen:T/2}},ut=Y(-1),st=Y(1),tt=nt(-1),dt=nt(1),Ut=[ut,st].map(z=>({root:z.root,joint:z.joint,tip:z.tip,upperLen:E/2,lowerLen:E/2,bend:1})),Vt=Qe(),ht=Qe();Vt.name="mountR",ht.name="mountL";const X=Qe(),N=Qe();X.name="gripR",N.name="gripL",dt.wrist.add(Vt),tt.wrist.add(ht),Vt.add(X),ht.add(N);const At=aR(t),Rt=sR(t),St=oR(t),vt={"sword-shield":{right:Wr(.42,.075,t),left:iR(t)},"dual-swords":{right:Wr(.42,.075,t),left:Wr(.42,.075,t)},greatsword:{right:nR(t),left:We(.12,.2,.12,t.wood)},staff:{right:At.g,left:Qe(),orb:At.orb},bow:{right:St,left:Rt.g,arrow:St,drawString:Rt.drawString}};for(const z of Object.keys(vt))X.add(vt[z].right),N.add(vt[z].left),vt[z].right.visible=!1,vt[z].left.visible=!1;function mt(z,J,xt){const _t=new en;_t.name="bladeBase",_t.position.y=J,z.add(_t);const Kt=new en;Kt.name="bladeTip",Kt.position.y=xt,z.add(Kt)}mt(vt["sword-shield"].right,.44,.55),mt(vt["dual-swords"].right,.44,.55),mt(vt["dual-swords"].left,.44,.55),mt(vt.greatsword.right,.74,.88),mt(vt.staff.right,.78,.92);let kt=null,F=null,R=1,K=0,ft=0,V=null,ot=0,zt=0,Et=0,bt=0,Wt=0,gt=0,Lt=z2(),j={...bd},$=0,ct=0,Nt=0,Ft=0,Ct=0,I=-1,yt=-1,Q=0,rt=0,Dt=0,Tt=0,qt=0,he=0,de=0,ne=1,Ee=0,Ie=0,Ye=0,Te=0,Le=!1,ze=0,Mn=-1,Cn=0,ln=0,Ln=0,_n=!1,Z=0,It=0,Ot=0,ie=0,oe="none",C=0,G=1,it=!1,at=-1,q=!1,wt=0,Bt=0,Zt=0,Xt={...Gh},ae=0,re=0,Yt={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},le=NaN,ee=0,ge=0,Ne=0,fe=NaN,$t=NaN,Qt=-1,Mt=null,jt=null,Pe=0,xe=1,bn=.1,_e=null,ue={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},Ce=null,He=null,un=null,Sn=null,oi=null,va=null,Zs="R",ji=0,ri=0,Dn=0,ci=0,Ed=1,xi=0,Wo=null,ya=0,Td=0,_c=NaN,Ad=NaN,Yo={speed:0,phase:0},Ma=1,_a=1,qs={lp:0,lr:0,rp:0,rr:0},L0=0,bc=0,Sc=!0,wc=0,js="none",qa=0,ja=0,Ka=0,$o=.3,Rd=0;function D0(z){const J=Math.PI/180,xt=s;let _t=0,Kt=0,Jt=0,ce=0;z==="sword-shield"?(_t=xt.swordPitchDeg*J,Jt=xt.shieldPitchDeg*J):z==="dual-swords"?(_t=xt.swordPitchDeg*J,Jt=xt.swordPitchDeg*J):z==="greatsword"?(_t=xt.greatswordPitchDeg*J,Jt=xt.greatswordPitchDeg*J):z==="staff"?_t=xt.staffPitchDeg*J:Jt=xt.bowPitchDeg*J,Vt.rotation.set(_t,0,Kt),ht.rotation.set(Jt,0,ce),Vt.position.x=z==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function Pd(z){if(z!==kt){kt=z;for(const J of Object.keys(vt))vt[J].right.visible=J===z,vt[J].left.visible=J===z;D0(z),Rt.drawString.position.z=-.06,St.position.z=0,At.orb.scale.setScalar(1),w.rotation.y=0}}Pd("sword-shield");const Cd=[];M.traverse(z=>{z instanceof Me&&z.material instanceof qi&&Cd.push(z.material)});const k0=new te(r.flashColor);function I0(z,J){const xt=_0(z,J,r);Lt=xt,w.rotation.x+=xt.upperPitch,w.rotation.z+=xt.upperRoll,w.rotation.y+=xt.upperYaw;const _t=me(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Kt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;w.position.x+=me(xt.upperShiftX*_t,-Kt,Kt),w.position.z+=me(xt.upperShiftZ*_t,-Kt,Kt),x.position.x+=xt.comX,x.position.z+=xt.comZ-xt.pelvisBack,x.position.y-=xt.drop;const Jt=xt.legacy?0:me(r.lowerScale,0,1);v.position.z+=xt.pelvisBack*(1-Jt),v.position.y+=xt.drop*(1-Jt),ut.joint.rotation.x+=xt.knee,st.joint.rotation.x+=xt.knee,ut.root.rotation.x-=xt.hip,st.root.rotation.x-=xt.hip,tt.root.rotation.x+=xt.arm,dt.root.rotation.x+=xt.arm*.8;for(const ce of Cd)ce.emissive.copy(k0).multiplyScalar(xt.flash)}function Zo(z){return z<.22?-1:z<.42?-1+(z-.22)/.2*2:z<.5?1:Math.max(0,1-(z-.5)/.5)}function z0(z){for(const J of[tt,dt])J.upperMesh.scale.set(z.girthArm,z.arm,z.girthArm),J.upperMesh.position.y=-J.segLen/2*z.arm,J.joint.position.y=-J.segLen*z.arm,J.lowerMesh.scale.set(z.girthArm,z.arm,z.girthArm),J.lowerMesh.position.y=-J.segLen/2*z.arm,J.hand.position.y=-J.segLen*z.arm;for(const J of[ut,st])J.upperMesh.scale.set(z.girthLeg,z.leg,z.girthLeg),J.upperMesh.position.y=-J.segLen/2*z.leg,J.joint.position.y=-J.segLen*z.leg,J.lowerMesh.scale.set(z.girthLeg,z.leg,z.girthLeg),J.lowerMesh.position.y=-J.segLen/2*z.leg,J.tip.position.y=-J.segLen*z.leg;O.scale.set(z.girthTorso,z.torso,z.girthTorso),O.position.y=W/2*z.torso,B&&(B.scale.set(z.girthTorso,z.torso,z.girthTorso),B.position.y=et/2*z.torso,D.position.y=W*z.torso)}function F0(z,J){const xt=s.twoHandGripY??-.16,_t=Math.max(1,s.twoHandMaxStretch??1.25),Kt=T*_t*.99,Jt=tt.root.position.x,ce=tt.root.position.y,Se=tt.root.position.z,$e=tt.root.rotation.y,ve=Math.cos($e),on=Math.sin($e),Je=Ii=>{const Qs=Vt.localToWorld(new H(0,Ii,0)),to=(L?D:w).worldToLocal(Qs),eo=to.x-Jt,Bn=to.y-ce,Ja=to.z-Se,Qa={x:eo*ve-Ja*on,y:Bn,z:eo*on+Ja*ve};return{t:Qa,dist:Math.hypot(Qa.x,Qa.y,Qa.z)}};let Ze=xt,we=Je(Ze);if(!Number.isFinite(we.dist)||we.dist<=Hi)return;for(let Ii=0;Ii<18&&we.dist>Kt;Ii++)if(Ze*=.78,we=Je(Ze),!Number.isFinite(we.dist)||we.dist<=Hi)return;Number.isFinite(le)||(le=Ze);const an=Math.max(0,s.twoHandSlideRate??9);le+=(Ze-le)*(1-Math.exp(-an*J));const rn=Je(le),fn=rn.t,Vn=rn.dist,Wn=Vn/Math.max(Hi,T),Qn=me(Wn,1,_t),vi=Math.max(1,s.twoHandGripStart??1.02),Ki=Math.max(vi+.001,_t),Ji=me(s.twoHandMinGrip??1,0,1),Yn=me((Wn-vi)/(Ki-vi),0,1),yi=1-Yn*Yn*(3-2*Yn)*(1-Ji),$n=T/2*Qn,Js=S0(fn,$n,$n,-1),Qi=w0({rootPitch:tt.root.rotation.x,rootRoll:tt.root.rotation.z,jointPitch:tt.joint.rotation.x},Js,me(z*yi,0,1),Math.PI);tt.root.rotation.x=Qi.rootPitch,tt.root.rotation.z=Qi.rootRoll,tt.joint.rotation.x=Math.min(Qi.jointPitch,-.06);const ti=1/Math.sqrt(Qn);tt.upperMesh.scale.set(ti,Qn,ti),tt.upperMesh.position.y=-$n/2,tt.joint.position.y=-$n,tt.lowerMesh.scale.set(ti,Qn,ti),tt.lowerMesh.position.y=-$n/2,tt.hand.position.y=-$n,Yt={active:!0,dist:Vn,gy:le,pitch:Qi.rootPitch,joint:tt.joint.rotation.x,grip:yi}}function U0(z,J){if(!m.enabled){ee=0,ge=0,dt.wrist.rotation.set(0,0,0),fe=dt.root.rotation.x,$t=zd();return}const xt=dt.root.rotation.x,_t=zd();if(J!==Qt){Qt=J,fe=xt,$t=_t,dt.wrist.rotation.set(ee,0,ge);return}if(!Number.isFinite(fe)||z<=1e-5){fe=xt,$t=_t,dt.wrist.rotation.set(ee,0,ge);return}const Kt=(xt-fe)/z,Jt=Ve(_t-$t)/z;fe=xt,$t=_t;const ce=Math.max(0,m.maxAngle),Se=Math.max(0,m.maxTwist),$e=.15+.85*me(ri,0,1),on=-me(Ne,0,1.4)*Math.max(0,m.runDrag),Je=me(-Kt*m.lag*$e+on,-ce,ce),Ze=me(Jt*m.twistLag*$e,-Se,Se),we=1-Math.exp(-Math.max(0,m.rate)*z);ee+=(Je-ee)*we,ge+=(Ze-ge)*we,dt.wrist.rotation.set(ee,0,ge)}function N0(z){const J=Math.PI/180;return z==="greatsword"?s.greatswordPitchDeg*J:z==="staff"?s.staffPitchDeg*J:z==="bow"?s.bowPitchDeg*J:s.swordPitchDeg*J}function Ec(z){const J=Math.PI/180;return z==="sword-shield"?s.shieldPitchDeg*J:z==="greatsword"?s.greatswordPitchDeg*J:z==="bow"?s.bowPitchDeg*J:s.swordPitchDeg*J}function O0(z){const J=Math.PI/180;return z==="sword-shield"||z==="dual-swords"?(s.swordCantDeg??0)*J:z==="greatsword"?(s.greatswordCantDeg??0)*J:0}function B0(z,J){const xt=z.weapon;if(xt==="staff"||xt==="bow")return;const _t=Zs==="R",Kt=_t?dt:tt,Jt=_t?Vt:ht,ce=_t?tt:dt,Se=_t?ht:Vt,$e=xt==="greatsword"&&_t?gt:0,ve=xt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,on=Math.PI/180,Je=-ve*on,Ze=ve*on,we=(Yn,yi)=>{const $n=Math.max(0,Math.PI/2-Math.abs(yi));return Math.sign(Yn)*Math.min(Math.abs(Yn),$n)},an=(Ce??N0(xt)+K)+$e,rn=J+Kt.root.rotation.x+Kt.joint.rotation.x;Jt.rotation.set(Math.PI/2-an-rn,0,we(_t?Je:Ze,an));const fn=He??(xt==="sword-shield"?null:Ec(xt)+ft),Vn=J+ce.root.rotation.x+ce.joint.rotation.x;xt==="sword-shield"?Se.rotation.x=fn===null?Ec(xt):Ec(xt)-fn-Vn:Se.rotation.set(Math.PI/2-(fn??0)-Vn,0,we(_t?Ze:Je,fn??0));const Wn=O0(xt),Qn=oi??0,vi=va??0,Ki=un??0,Ji=Sn??0;_t?(X.rotation.z=-Wn+Qn,X.rotation.y=Ki,N.rotation.z=Wn+vi,N.rotation.y=Ji):(N.rotation.z=Wn+Qn,N.rotation.y=Ki,X.rotation.z=-Wn+vi,X.rotation.y=Ji)}function Ld(z){Ce=z.bladePitch,He=z.bladePitchOff,un=z.bladeTwist,Sn=z.bladeTwistOff,oi=z.bladeYaw,va=z.bladeYawOff,Zs=z.lead,ji=z.rootYaw+z.spinYaw,M.rotation.y=ji,w.rotation.y+=z.yaw,w.rotation.x+=z.pitch,w.rotation.z+=z.roll,x.position.z+=z.pelvisZ,x.position.x+=z.pelvisX,z.armR&&(dt.root.rotation.x=z.armR.pitch,dt.root.rotation.y=z.armR.yaw,dt.root.rotation.z=z.armR.roll,dt.joint.rotation.x=z.armR.elbow),z.armL&&(tt.root.rotation.x=z.armL.pitch,tt.root.rotation.y=z.armL.yaw,tt.root.rotation.z=z.armL.roll,tt.joint.rotation.x=z.armL.elbow)}function Dd(z,J){const xt=_e??Zo(z.attackProgress),_t=K2(z.weapon,z.comboIndex,xt,p,z.attackProgress);if(z.comboIndex!==Pe){jt=Mt,xe=0,Pe=z.comboIndex;const ce=z.timings.windup+z.timings.active+z.timings.recovery,Se=Math.max(p.segBlendMin??.03,ce*.22);bn=eR(jt,_t,p,_t.blend??null,Se)}const Kt=Math.max(.008,bn);xe=Math.min(1,xe+J/Kt);const Jt=jt&&xe<1?J2(jt,_t,xp(xe)):_t;return Mt=Jt,Jt}function H0(z,J){const xt=A/2+b/2,_t=_-.04-U;if(!p.enabled){tt.root.position.set(-xt,_t,0),dt.root.position.set(xt,_t,0),ue={lx:-xt,ly:_t,lz:0,rx:xt,ry:_t,rz:0};return}const Kt=Math.max(0,p.shoulderLift),Jt=Math.max(0,p.shoulderPush),ce=z&&J==="greatsword"?Math.max(0,p.shoulderIn):0,Se=rn=>Kt*me((-rn-.5)/1.45,0,1),$e=rn=>Jt*me((-rn-.2)/1.9,0,1),ve=-xt+ce,on=_t+Se(tt.root.rotation.x),Je=$e(tt.root.rotation.x),Ze=xt-ce,we=_t+Se(dt.root.rotation.x),an=$e(dt.root.rotation.x);tt.root.position.set(ve,on,Je),dt.root.position.set(Ze,we,an),ue={lx:ve,ly:on,lz:Je,rx:Ze,ry:we,rz:an}}function G0(z,J,xt){if(z.phase==="idle"||z.charging){Cn=0,ln=0,Ln=0;return}const _t=z.attackProgress,Kt=Zo(_t),Jt=Math.max(0,Kt),ce=l.stride,Se=Number.isFinite(ce.stepReach)?ce.stepReach:.17,$e=Number.isFinite(ce.stepSideReach)?ce.stepSideReach:.14,ve=Number.isFinite(ce.stepDipReach)?ce.stepDipReach:.05,on=z.weapon==="greatsword"?me(Number.isFinite(ce.heavyScale)?ce.heavyScale:1,0,1):1,Je=1-Math.exp(-12*Math.max(0,xt));Cn+=(Se*Jt*on-Cn)*Je,ln+=(J*$e*Jt*on-ln)*Je,Ln+=(ve*Math.sin(Math.PI*_t)*on-Ln)*Je,x.position.z+=Cn,x.position.x+=ln,x.position.y-=Ln}let kd=null;function X0(){kd={upperX:w.rotation.x,upperY:w.rotation.y,upperZ:w.rotation.z,upperPX:w.position.x,upperPZ:w.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:tt.root.rotation.x,lry:tt.root.rotation.y,lrz:tt.root.rotation.z,lj:tt.joint.rotation.x,rrx:dt.root.rotation.x,rry:dt.root.rotation.y,rrz:dt.root.rotation.z,rj:dt.joint.rotation.x,rootY:M.rotation.y}}function V0(z){const J=kd;if(!J)return;const xt=xp(me(z,0,1));if(xt>=1)return;const _t=(Kt,Jt)=>Kt+(Jt-Kt)*xt;w.rotation.x=_t(J.upperX,w.rotation.x),w.rotation.y=_t(J.upperY,w.rotation.y),w.rotation.z=_t(J.upperZ,w.rotation.z),w.position.x=_t(J.upperPX,w.position.x),w.position.z=_t(J.upperPZ,w.position.z),x.position.x=_t(J.pelvisX,x.position.x),x.position.y=_t(J.pelvisY,x.position.y),x.position.z=_t(J.pelvisZ,x.position.z),x.rotation.x=_t(J.pelvisRX,x.rotation.x),x.rotation.z=_t(J.pelvisRZ,x.rotation.z),tt.root.rotation.x=_t(J.lrx,tt.root.rotation.x),tt.root.rotation.y=_t(J.lry,tt.root.rotation.y),tt.root.rotation.z=_t(J.lrz,tt.root.rotation.z),tt.joint.rotation.x=_t(J.lj,tt.joint.rotation.x),dt.root.rotation.x=_t(J.rrx,dt.root.rotation.x),dt.root.rotation.y=_t(J.rry,dt.root.rotation.y),dt.root.rotation.z=_t(J.rrz,dt.root.rotation.z),dt.joint.rotation.x=_t(J.rj,dt.joint.rotation.x),M.rotation.y=J.rootY+Ve(M.rotation.y-J.rootY)*xt,ji=M.rotation.y}let Ks=null,Tc=0,Id=0;function W0(){if(!L)return;const z=k,J=Math.max(0,z.waist??1),xt=Math.max(0,z.chest??0),_t=J+xt,Kt=_t>1e-6?J/_t:1,Jt=_t>1e-6?xt/_t:0,ce=w.rotation.x,Se=w.rotation.y,$e=w.rotation.z;w.rotation.set(ce*Kt,Se*Kt,$e*Kt),D.rotation.set(ce*Jt,Se*Jt,$e*Jt);const ve=me(z.neck??0,0,1);ve>0&&(lt.rotation.x-=ce*ve),Ks={x:ce,y:Se,z:$e}}function qo(){return{yaw:w.rotation.y+(L?D.rotation.y:0),pitch:w.rotation.x+(L?D.rotation.x:0),lean:w.rotation.z+(L?D.rotation.z:0)}}function zd(){return qo().yaw}function Y0(z,J){if(!(d!=null&&d.enabled)){Wo=null,ya=0;return}M.updateWorldMatrix(!0,!0);const xt=new H,_t=[],Kt=(ti,Ii,Qs=0)=>{ti.getWorldPosition(xt),_t.push({x:xt.x,y:xt.y+Qs,z:xt.z,mass:Ii})},Jt=n.headSize;Kt(lt,.08,Jt/2),Kt(O,.14),Kt(B??D,.24),Kt(x,.12),Kt(tt.hand,.05),Kt(dt.hand,.05),Kt(ut.joint,.15),Kt(st.joint,.15);const ce=kt?jo(vt[kt].right):null;ce&&_t.push({x:(ce.base.x+ce.tip.x)/2,y:(ce.base.y+ce.tip.y)/2,z:(ce.base.z+ce.tip.z)/2,mass:kt==="greatsword"?.09:.04});const Se=Math.max(.05,n.limbThickness*1.15/2+.015),$e=Math.max(.06,n.limbThickness*1.7/2+.02);let ve=1/0,on=-1/0,Je=1/0,Ze=-1/0,we=0;for(const ti of[ut,st])ti.tip.getWorldPosition(xt),xt.y<=.13&&(we+=1),ve=Math.min(ve,xt.x-Se),on=Math.max(on,xt.x+Se),Je=Math.min(Je,xt.z-$e),Ze=Math.max(Ze,xt.z+$e);(!Number.isFinite(ve)||we===0)&&(ve=on=Je=Ze=0);let an=0,rn=0;Number.isFinite(_c)&&J>1e-5&&(an=me((z.position.x-_c)/J,-20,20),rn=me((z.position.z-Ad)/J,-20,20)),_c=z.position.x,Ad=z.position.z;const fn=H2(_t,{minX:ve,maxX:on,minZ:Je,maxZ:Ze},an,rn,d);if(Wo=fn,!d.autoCounter){ya=0;return}const Vn=Math.cos(z.bodyYaw),Wn=-Math.sin(z.bodyYaw),Qn=fn.xcomX-fn.centerX,vi=fn.xcomZ-fn.centerZ,Ki=Qn*Vn+vi*Wn,Ji=an*Vn+rn*Wn,Yn=fn.grounded?G2(Ki,Ji,d.predLead??0):0;Id=Yn;const yi=Math.abs(Yn)-.45*fn.halfX;Td=yi;let $n=0;yi>.002&&fn.grounded&&($n=-Math.sign(Yn)*Math.min(Math.max(.005,d.maxShift??.045),(yi+.002)*1.1666666666666667));const Js=Math.abs(Yn)/Math.max(1e-4,fn.halfX),Qi=Math.max(.1,X2(d.counterRate,Js,d.counterBoost??0));ya+=($n-ya)*(1-Math.exp(-Qi*J))}function $0(z,J){if(Rt.drawString.position.z=-.06,St.position.z=0,At.orb.scale.setScalar(1),w.rotation.y=0,z.charging&&z.weapon==="bow"){const Jt=z.charge;tt.root.rotation.x=-1.25,tt.joint.rotation.x=-.15,dt.root.rotation.x=.35+Jt*.3,dt.joint.rotation.x=-1.15,Rt.drawString.position.z=-.06-Jt*.22,St.position.z=-Jt*.3,w.rotation.y=-.22;return}if(z.phase==="idle"&&Dn<=.001){jt=null,Mt=null,Pe=0,xe=1,bn=Math.max(.008,p.segBlend),Ce=null,He=null,un=null,Sn=null,oi=null,va=null,le=NaN,z.weapon==="greatsword"&&(Vt.position.x=-Math.max(0,s.twoHandInsetX??0));return}const xt=Zo(z.attackProgress),_t=Math.max(0,-xt),Kt=Math.max(0,xt);if(z.weapon==="bow")tt.root.rotation.x=-1.2,tt.joint.rotation.x=-.15,dt.root.rotation.x=.9-Kt*.8,dt.joint.rotation.x=-.3;else if(z.weapon==="greatsword")if(p.enabled)Ld(Dd(z,J));else{const Jt=-1.6*_t+1.25*Kt,ce=me(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);dt.root.rotation.x=Jt,dt.joint.rotation.x=-(.25+_t*.4),tt.root.rotation.x=Jt+.06,tt.joint.rotation.x=-(.32+_t*.4),tt.root.rotation.z=.42,dt.root.rotation.z=0;const Se=-Math.sin(dt.root.rotation.x);dt.root.rotation.y=-.72*Math.tanh(Se*4),w.rotation.y=-.2*xt*ce}else if(p.enabled)Ld(Dd(z,J));else{const Jt=z.comboIndex;if(Jt===1)dt.root.rotation.x=-1.7*_t+1.1*Kt,dt.joint.rotation.x=-(.2+_t*.5),tt.root.rotation.x=.1,w.rotation.y=-.18*xt;else if(Jt===2)tt.root.rotation.x=-1.5*_t+1*Kt,tt.joint.rotation.x=-(.2+_t*.5),dt.root.rotation.x=.2,w.rotation.y=.45*-xt;else{const ce=-1.9*_t+1.2*Kt;tt.root.rotation.x=ce,dt.root.rotation.x=ce,tt.joint.rotation.x=-(.15+_t*.4),dt.joint.rotation.x=-(.15+_t*.4),w.rotation.y=-.3*xt}}if(z.weapon==="greatsword"){const Jt=me((-dt.root.rotation.x-1.3)/1.2,0,1);Vt.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Jt)}G0(z,ze%2===0?1:-1,J)}function Z0(z,J){z&&(dt.root.rotation.x=-1.05,dt.joint.rotation.x=-.35,tt.root.rotation.x=-.45,tt.joint.rotation.x=-.2,w.rotation.y=-.12,At.orb.scale.setScalar(1.25+.12*Math.sin(J*2)))}function q0(z){if(!z||z.phase==="idle")return;const J=z.progress,xt=J<.3?-.35+J/.3*1.35:J<.7?1:Math.max(0,1-(J-.7)/.3),_t=Math.PI/180;w.rotation.x+=y.leanDeg*_t*xt,tt.root.rotation.x-=y.shieldPitchDeg*_t*xt,tt.joint.rotation.x-=.22*xt,dt.root.rotation.x-=.3*xt,x.position.z+=y.pelvisReach*Math.max(0,xt)}function jo(z){if(!z)return null;const J=z.getObjectByName("bladeBase"),xt=z.getObjectByName("bladeTip");if(!J||!xt)return null;z.updateWorldMatrix(!0,!1);const _t=J.getWorldPosition(new H),Kt=xt.getWorldPosition(new H),Jt=new H().setFromMatrixColumn(z.matrixWorld,0).normalize();return{base:{x:_t.x,y:_t.y,z:_t.z},tip:{x:Kt.x,y:Kt.y,z:Kt.z},normal:{x:Jt.x,y:Jt.y,z:Jt.z}}}return{group:M,update(z,J,xt,_t,Kt=!1,Jt,ce,Se){var jd;Pd(J.weapon);const $e=Jt===void 0||I<0?_t:me(Jt-I,0,.1);Jt!==void 0&&(I=Jt),M.rotation.y=0,ji=0,w.rotation.x=0,w.rotation.z=0,x.position.x=0,x.position.y=E,x.position.z=0,x.rotation.z=0,x.rotation.x=0,w.position.x=0,w.position.y=0,w.position.z=0,D.rotation.set(0,0,0),v.position.x=0,v.position.y=0,v.position.z=0,v.rotation.z=0;const ve=Math.max(1/240,Math.min(_t,.1));V=((jd=l.stance)==null?void 0:jd[J.weapon])??null,F!==J.weapon&&(F=J.weapon,R=V?0:1);const on=Math.max(.01,(V==null?void 0:V.blend)??.22);R=Math.min(1,R+ve/on);const Je=V?R:0;K=((V==null?void 0:V.bladePitchDeg)??0)*Math.PI/180*Je,ft=((V==null?void 0:V.bladePitchOffDeg)??0)*Math.PI/180*Je;const Ze=Jt===void 0?L0+=_t:Jt;bc=Ze;const we=l.landing;we.enabled?Sc&&!z.grounded?(js="jump",qa=Ze,ja=we.anticipationDuration,Ka=Math.max(0,we.jumpAnticipation),$o=.32):!Sc&&z.grounded&&(js="land",qa=Ze,ja=we.duration,Ka=I2(wc,we),$o=we.compressRatio,Rd=wc):(js="none",Ka=0),Ze<qa&&(js="none",Ka=0),Sc=z.grounded,wc=z.velocity.y;const an=pp(Ze,qa,ja,Ka,$o),rn=J.phase!=="idle",fn=(Se==null?void 0:Se.phase)==="active";ri=C2(ri,rn,ve,l.attack.blendRate);const Vn=L2(ri,l.attack.gaitWeight,l.attack.lowerBodyWeight);ci=Vn.attackLegWeight,Ed=Vn.gaitScale;const Wn=Math.sin(z.bodyYaw),Qn=Math.cos(z.bodyYaw),vi=(z.velocity.x-ot)/ve,Ki=(z.velocity.z-zt)/ve,Ji=me(vi,-60,60),Yn=me(Ki,-60,60),yi=Ji*Wn+Yn*Qn,$n=Ve(z.bodyYaw-Et)/ve,Js=$e>1e-6?Ve(z.bodyYaw-Et)/$e:0,Qi=Math.hypot(z.velocity.x,z.velocity.z),ti=o.maxForwardDeg*Math.PI/180,Ii=o.maxSideDeg*Math.PI/180,Qs=me(yi*o.accelGain,-ti,ti),to=me(-$n*Qi*o.turnGain,-Ii,Ii),eo=1-Math.exp(-o.smoothing*ve);bt+=(Qs-bt)*eo,Wt+=(to-Wt)*eo,ot=z.velocity.x,zt=z.velocity.z,Et=z.bodyYaw;const Bn=Math.hypot(z.velocity.x,z.velocity.z),Ja=me(a.knockGaitScale??0,0,1),Qa=xt.knockX*Ja,j0=xt.knockZ*Ja,K0=Ja>0&&Math.hypot(xt.knockX,xt.knockZ)>.001,Ac=z.velocity.x+Qa,Rc=z.velocity.z+j0,Fd=Math.hypot(Ac,Rc);ie=Fd;const J0=Math.cos(z.bodyYaw),Q0=-Math.sin(z.bodyYaw),tg=z.velocity.x*J0+z.velocity.z*Q0,Ud=Bn>Hi?me(tg/Bn,-1,1):0,Nd=Bn>Hi?me((z.velocity.x*Wn+z.velocity.z*Qn)/Bn,-1,1):1,eg=_d(Nd,a.backStrafeStartDeg,a.backStrafeFullDeg);oe==="settled"&&q&&wt>Bt*1.02+1e-4&&(oe="none");let no=1;oe==="blend"?(no=x0(it?at:C,a.stopYawBlendMode,it),it||(C=Math.min(1,C+ve/Math.max(.01,a.stopYawAfterSec)),(C>=1||a.stopYawBlendMode==="inStop"||q)&&(oe="settled",no=0))):oe==="settled"&&(no=me(Bn/Math.max(Hi,a.stopEnterRatio*e),0,1)),G=no;const ng=h0(Ud,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),Od=(a.hipYawTrackRateDeg??0)*Math.PI/180,ig=(a.hipYawBackRateDeg??0)*Math.PI/180,Pc=$e>1e-6?$e:_t;Ct=Od>0?o0(Ct,s0(Js),Pc):0;const Bd=d0(eg,Ct),ag=me(Bn/.5,0,1),sg=f0(Nd,Ud,ng,Bd)*no*ag,Hd=r0(Ft,sg,u0(Od,ig,Bd),Pc,Ct);Ft=Hd,ct+=(Hd-ct)*(1-Math.exp(-i.hipYawSmoothing*Pc));const io=z.bodyYaw+ct;Nt=io;const og=Math.sin(io),rg=Math.cos(io),cg=Math.cos(io),lg=-Math.sin(io),ei={speed:Fd,phase:z.gaitPhase,localForward:Ac*og+Rc*rg,localRight:Ac*cg+Rc*lg,stride:z.stride};if(rn&&J.attackId!==Mn){const se=!_n;Mn=J.attackId,ze+=1,Ye=se&&(!Le||ei.speed>.05)?ei.phase:Te,Le=!0}_n=rn;const li=ri>0?R2(ei,J.attackProgress,ze,ri,l.stride,Ye):ei;Yo=li,rn&&(Te=li.phase);const Cc=Math.max(0,a.dirFlipSec??0);Cc>0?(Ma=cc(Ma,li.localForward>=0?1:-1,ve,Cc),_a=cc(_a,li.localRight>=0?1:-1,ve,Cc)):(Ma=li.localForward>=0?1:-1,_a=li.localRight>=0?1:-1);const Gd=Math.max(0,a.stopBlendSec||0),Xd=Gd>0&&!rn&&!K0&&z.grounded,Lc=p0(Bn,Ee,e,a.stopEnterRatio,a.stopExitRatio);if(!Xd||Lc.resume)yt=-1;else if(yt<0&&Lc.enter){yt=0,Q=z.gaitPhase,rt=c0(z.gaitPhase),Dt=Bn,Tt=Math.max(z.stride,Hi),qt=ei.localForward,he=ei.localRight;const se=1/Math.max(Hi,Bn);de=z.velocity.x*se,ne=z.velocity.z*se}const hg=Ee;Ee=Bn;const Mi=Xd&&yt>=0;Mi&&(yt=Math.min(1,yt+ve/Gd)),Mi&&oe!=="blend"&&(oe="blend",C=0),it=Mi&&yt<1,at=yt,q=Lc.resume,wt=Bn,Bt=hg;const Vd=Mi?{phase:Q,speed:Dt,moveSpeed:e,localForward:qt,localRight:he,dirF:Ma,dirR:_a,legLength:n.legLength,stride:Tt,grounded:!0}:{phase:li.phase,speed:li.speed,moveSpeed:e,localForward:li.localForward,localRight:li.localRight,dirF:Ma,dirR:_a,legLength:n.legLength,stride:li.stride??0,grounded:z.grounded};let Dc=Mi?l0(Vd,a,{progress:yt,phase0:Q,phaseEnd:rt}):lc(Vd,a);const ba=l.attack.moveTakeover;if(ba&&!Mi){const se=J.phase==="windup"?ba.windup:J.phase==="recovery"?ba.recovery:J.phase==="settle"?ba.settle:0,pe=Math.max(.05,ba.full-ba.speed),En=me((ei.speed-ba.speed)/pe,0,1),kn=me(se,0,1)*En,Ko=kn>xi?10:6;xi=me(xi+(kn-xi)*(1-Math.exp(-Ko*ve)),0,1)}else Mi?xi=0:xi=me(xi*Math.exp(-8*ve),0,1);if(xi>.001&&!Mi){const se=lc({phase:ei.phase,speed:ei.speed,moveSpeed:e,localForward:ei.localForward,localRight:ei.localRight,dirF:Ma,dirR:_a,legLength:n.legLength,stride:ei.stride??0,grounded:z.grounded},a);Dc=D2(Dc,se,xi)}const Fe=k2(Dc,Vn.gaitScale);if(Zt=0,fn&&Se){const se=E2(Se.progress,Se.dir,a),pe=Vn.gaitScale;Fe.legL.pitchX+=se.legL.pitchX*pe,Fe.legL.rollZ+=se.legL.rollZ*pe,Fe.legL.kneeX+=se.legL.kneeX*pe,Fe.legR.pitchX+=se.legR.pitchX*pe,Fe.legR.rollZ+=se.legR.rollZ*pe,Fe.legR.kneeX+=se.legR.kneeX*pe,Fe.pelvisY+=se.pelvisY*pe,Zt=se.env}let kc=0,Ic=0,zc=0,Wd=0;if(Mi){const se=g0(z.bodyYaw,de,ne),pe=v0(yt,Q,se.forward,se.right,a);pe.leadLeft?(Fe.legL.pitchX-=pe.leadPitch,Fe.legL.kneeX+=pe.leadKnee,Fe.legR.pitchX+=pe.trailPitch):(Fe.legR.pitchX-=pe.leadPitch,Fe.legR.kneeX+=pe.leadKnee,Fe.legL.pitchX+=pe.trailPitch),Ic=pe.bodyShift*pe.fwdN,kc=pe.bodyShift*pe.rightN,zc=pe.bodyDip,Wd=pe.chestPitch,Z=pe.leadPitch,It=pe.bodyShift,Ot=pe.bodyDip}else Z=0,It=0,Ot=0;if(qs={lp:Fe.legL.pitchX,lr:Fe.legL.rollZ,rp:Fe.legR.pitchX,rr:Fe.legR.rollZ},!z.grounded)ut.root.rotation.x=-.55,st.root.rotation.x=-.25,ut.joint.rotation.x=.75,st.joint.rotation.x=.55,tt.root.rotation.x=-.9,dt.root.rotation.x=-.7,tt.joint.rotation.x=-.6,dt.joint.rotation.x=-.6,ut.root.rotation.z=0,st.root.rotation.z=0;else{ut.root.rotation.x=Fe.legL.pitchX,st.root.rotation.x=Fe.legR.pitchX,ut.root.rotation.z=Fe.legL.rollZ,st.root.rotation.z=Fe.legR.rollZ,ut.joint.rotation.x=Fe.legL.kneeX,st.joint.rotation.x=Fe.legR.kneeX;const se=V?R:0,pe=1+(((V==null?void 0:V.armSwing)??1)-1)*se,En=V==null?void 0:V.armR,kn=V==null?void 0:V.armL,Ko=Fe.armL*pe+((kn==null?void 0:kn.pitch)??0)*se,Kd=Fe.armR*pe+((En==null?void 0:En.pitch)??0)*se;tt.root.rotation.x=Ko,dt.root.rotation.x=Kd,tt.joint.rotation.x=-(.18+Ko*.2)+((kn==null?void 0:kn.elbow)??0)*se,dt.joint.rotation.x=-(.18+Kd*.2)+((En==null?void 0:En.elbow)??0)*se,tt.root.rotation.z=((kn==null?void 0:kn.roll)??0)*se,dt.root.rotation.z=((En==null?void 0:En.roll)??0)*se,tt.root.rotation.y=((kn==null?void 0:kn.yaw)??0)*se,dt.root.rotation.y=((En==null?void 0:En.yaw)??0)*se,x.position.x=Fe.pelvisX,x.position.y=E+Fe.pelvisY,x.position.z=0,x.rotation.z=Fe.pelvisRoll}const dg=E0(x,v),ao=fn?{...u,weight:0}:Mi&&u.enabled?{...u,weight:1}:u,Yd=ao.enabled&&z.grounded&&ao.weight>0?me(ao.weight,0,1)*(rn?me(ao.attackScale,0,1):1):0;x.position.x+=kc,x.position.z+=Ic,x.position.y-=zc,v.position.y+=zc,Yd<=0&&(v.position.x-=kc,v.position.z-=Ic);const Fc=Bn/Math.max(e,Hi);Ne=Fc;const ug=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,fg=1-Math.exp(-Math.max(0,ug)*ve);$+=(me(Fc,0,1)-$)*fg;const ts=b0({leanForward:bt,leanSide:Wt,speedRatio:$},o);x.rotation.x+=ts.pelvisPitch,x.rotation.z+=ts.pelvisRoll,x.position.x+=ts.pelvisX,x.position.z+=ts.pelvisZ,x.position.y-=ts.crouch,v.position.y+=ts.crouch*(1-me(Yd,0,1));const $d=J.phase!=="idle"||J.charging&&J.weapon==="bow",Uc=$d?1:0,pg=Math.max(.001,Uc>Dn?p.poseIn??.1:p.poseOut??.16);if(Dn!==Uc){const se=ve/pg;Dn=me(Dn+(Uc>Dn?se:-se),0,1)}if((Dn>0||$d)&&X0(),$0(J,ve),Dn>0&&Dn<1&&V0(Dn),V){const se=(1-Dn)*R;w.rotation.y+=(V.torsoYaw??0)*se,w.rotation.x+=(V.torsoPitch??0)*se}Z0(Kt,z.gaitPhase),q0(ce);const mg=J.weapon==="greatsword",Zd=Math.hypot(z.velocity.x,z.velocity.z),gg=mg&&J.phase==="idle"&&Zd>.5?Math.min(1.15,Zd/Math.max(e,.001)*.9):0;gt+=(gg-gt)*(1-Math.exp(-6*ve));const xg=w.rotation.x;J.weapon==="bow"&&(Rt.g.rotation.x=-(tt.root.rotation.x+tt.joint.rotation.x),St.rotation.x=-(dt.root.rotation.x+dt.joint.rotation.x));const vg=w.rotation.y;I0(xt,z.bodyYaw);const qd=xt.type==="none"?1:.4;if(w.rotation.x+=bt*qd+Wd,w.rotation.z+=(Wt+Fe.sideLean)*qd,an>0&&(ut.root.rotation.x-=we.hipPitch*an,st.root.rotation.x-=we.hipPitch*an,ut.joint.rotation.x+=we.kneeBend*an,st.joint.rotation.x+=we.kneeBend*an,x.position.y-=we.crouchDepth*an,v.position.y+=we.crouchDepth*(1-we.lowerScale)*an,w.rotation.x+=we.upperPitch*an,tt.root.rotation.x-=we.armTuck*an,dt.root.rotation.x-=we.armTuck*an),ci>0&&z.grounded){const se=P2(J.attackProgress,ze,l.stride),pe=ci;ut.root.rotation.x+=se.legL.pitchX*pe,st.root.rotation.x+=se.legR.pitchX*pe,ut.root.rotation.z+=se.legL.rollZ*pe,st.root.rotation.z+=se.legR.rollZ*pe,ut.joint.rotation.x+=se.legL.kneeX*pe,st.joint.rotation.x+=se.legR.kneeX*pe,x.position.x+=se.pelvisX*pe,x.position.y+=se.pelvisY*pe,x.rotation.z+=se.pelvisRoll*pe}if(H0(rn,J.weapon),d!=null&&d.enabled&&d.autoCounter&&Math.abs(ya)>1e-4&&(x.position.x+=ya),g.enabled){const se=J.phase!=="idle"&&!J.charging,pe=se?Zo(J.attackProgress):0;se&&re>.55&&pe<re-1e-4&&(ae=1),re=pe,ae=$2(ae,ve,g.impactDecay);const En=W2({swing:pe,charge:J.charging?J.charge:0,impact:ae,speedRatio:Fc,grounded:z.grounded},g);Xt=Y2(Xt,En,ve,g.smoothing)}else Xt={...Gh};z0(Xt),v.rotation.y=ct,Ie=m0(ct,a.chestYawScale,a.chestYawMaxDeg),w.rotation.y+=Ie;const yg=vg;if(lt.rotation.y=Ve(z.headYaw-z.bodyYaw-yg-Ie),lt.rotation.x=-me(z.headPitch??0,-.7,.7),w.rotation.x+=-me(z.bodyPitch??0,-.4,.4),W0(),U0(_t,J.comboIndex),B0(J,xg),J.weapon==="greatsword"&&!J.charging&&(J.phase!=="idle"||Dn>0)){M.updateWorldMatrix(!0,!0);const se=J.phase==="idle"?Math.max(Dn,ri):1;F0(me(se,0,1),ve)}if(j=T0({root:M,pelvis:x,lower:v,limbs:Ut,base:dg,cfg:ao,grounded:z.grounded,attacking:rn}),Y0(z,ve),L&&Ks){const se=qo();Tc=Math.max(Math.abs(se.pitch-Ks.x),Math.abs(se.yaw-Ks.y),Math.abs(se.lean-Ks.z))}else Tc=0},lean(){return{forward:bt,side:Wt}},landing(){const z=pp(bc,qa,ja,Ka,$o),J=ja>0?Math.max(0,ja-Math.max(0,bc-qa)):0;return{pulse:z,remaining:J,kind:z>0?js:"none",impactVy:Rd}},hurt(){return Lt},ik(){return j},stretch(){return{...Xt,impact:ae}},gripDebug(){return{...Yt}},weaponDebug(){return{wristPitch:ee,wristTwist:ge}},setClipT(z){_e=z===null||!Number.isFinite(z)?null:Math.max(0,Math.min(1,z))},stanceDebug(){const z=V==null?void 0:V.armR,J=V==null?void 0:V.armL,xt=V?R:0;return{weapon:kt??"sword-shield",weight:xt,armL:{pitch:((J==null?void 0:J.pitch)??0)*xt,yaw:((J==null?void 0:J.yaw)??0)*xt,roll:((J==null?void 0:J.roll)??0)*xt,elbow:((J==null?void 0:J.elbow)??0)*xt},armR:{pitch:((z==null?void 0:z.pitch)??0)*xt,yaw:((z==null?void 0:z.yaw)??0)*xt,roll:((z==null?void 0:z.roll)??0)*xt,elbow:((z==null?void 0:z.elbow)??0)*xt},torsoYaw:((V==null?void 0:V.torsoYaw)??0)*xt,torsoPitch:((V==null?void 0:V.torsoPitch)??0)*xt,bladePitchDeg:K*180/Math.PI,bladePitchOffDeg:ft*180/Math.PI,armSwing:(V==null?void 0:V.armSwing)??1}},swingDebug(){const z=Mt;return{seg:Pe,kind:(z==null?void 0:z.kind)??"right-left",lead:(z==null?void 0:z.lead)??"R",yaw:(z==null?void 0:z.yaw)??0,rootYaw:(z==null?void 0:z.rootYaw)??0,spinYaw:(z==null?void 0:z.spinYaw)??0,rootTurn:ji,pitch:(z==null?void 0:z.pitch)??0,roll:(z==null?void 0:z.roll)??0,strike:(z==null?void 0:z.strike)??0,bladeTwist:(z==null?void 0:z.bladeTwist)??0,bladeTwistOff:(z==null?void 0:z.bladeTwistOff)??0,bladeYaw:(z==null?void 0:z.bladeYaw)??0,bladeYawOff:(z==null?void 0:z.bladeYawOff)??0,shoulderL:{x:ue.lx,y:ue.ly,z:ue.lz},shoulderR:{x:ue.rx,y:ue.ry,z:ue.rz}}},attackBlend(){return ri},attackWeights(){return{gaitScale:Ed,attackLegWeight:ci,driveSpeed:Yo.speed,stridePhase:Yo.phase,strideBase:Ye,stepIndex:ze}},hipYaw(){return ct},torsoTotal(){return qo()},spineDebug(){if(!L)return null;const z=qo();return{enabled:!0,waistYaw:w.rotation.y,chestYaw:D.rotation.y,totalYaw:z.yaw,totalPitch:z.pitch,totalLean:z.lean,neckPitch:lt.rotation.x,leak:Tc}},balanceDebug(){return Wo?{...Wo,shift:ya,latDeficit:Td,lateralFf:Id}:null},gaitDebug(){return{stopT:yt,hipYaw:ct,chestYaw:Ie,speed:Ee,gaitSpeed:ie,stopStep:Z,stopShift:It,stopDip:Ot,stopYawFade:G,turnStep:Zt,legTakeover:xi,legLPitch:qs.lp,legLRoll:qs.lr,legRPitch:qs.rp,legRRoll:qs.rr,phase:Yo.phase,dirF:Ma,dirR:_a,hipYawTarget:Ft,spin:Ct}},gaitYaw(){return Nt},arrowDirection(){St.updateWorldMatrix(!0,!1);const z=St.matrixWorld.elements,J=z[8],xt=z[9],_t=z[10],Kt=Math.hypot(J,xt,_t)||1;return{x:J/Kt,y:xt/Kt,z:_t/Kt}},weaponBlade(){return kt?jo(vt[kt].right):null},bladesWorld(){return kt?{right:jo(vt[kt].right),left:jo(vt[kt].left)}:{right:null,left:null}},dispose(){M.traverse(z=>{if(z instanceof Me){z.geometry.dispose();const J=z.material;Array.isArray(J)?J.forEach(xt=>xt.dispose()):J.dispose()}})}}}function rR(n){const t=A0(n.voxel,n.colors,n.moveSpeed,n.orientation,n.gait,n.mount,n.lean,n.hurt,n.animation,n.ik,n.links,n.wrist,n.balance),e=new Re;e.add(t.group);const i={position:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:1,distance:0,coyoteTime:0,jumpBuffer:0},a=[];for(const s of["headPivot","chest","torsoUpper","torso","pelvis"]){const o=t.group.getObjectByName(s);o&&a.push(o)}return{group:e,update(s,o,r){i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.velocity.x=s.velocity.x,i.velocity.y=s.velocity.y,i.velocity.z=s.velocity.z,i.facing=s.facing,i.moveYaw=Math.atan2(i.velocity.x,i.velocity.z),i.bodyYaw=s.bodyYaw,i.headYaw=s.headYaw,i.gaitPhase=s.gaitPhase,i.stride=s.stride,i.distance=s.distance,i.grounded=!0,i.sprinting=!1,e.position.set(s.position.x,s.position.y,s.position.z),e.rotation.y=s.bodyYaw,s.combat&&t.update(i,s.combat,s.hurt,o,!1,r,s.link)},debug(){return t.gaitDebug()},boneAtWorld(s,o,r){if(a.length===0)return null;const l=new H(s,o,r),c=new H;let h=null,f=Number.POSITIVE_INFINITY;for(const d of a){d.updateWorldMatrix(!0,!1),d.getWorldPosition(c);const u=c.distanceToSquared(l);u<f&&(f=u,h=d)}return h?{node:h,point:l}:null},dispose(){t.dispose()}}}const Da=.012,ka=.016;function cR(n,t){const e=t.lab,i=new Re;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(M){return o.push(M),M}function c(M){return r.push(M),M}function h(M,x,v,w=Da){const S=l(new vn({color:x,transparent:!0,opacity:v,depthWrite:!1,side:Ke,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),E=new Me(M,S);return E.rotation.x=-Math.PI/2,E.position.y=w,E.renderOrder=2,E}function f(M,x){return c(new Ds(Math.max(M,.001),x,72))}function d(M,x,v,w=ka){const E=document.createElement("canvas"),T=E.getContext("2d");if(!T)return new Me;const b='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';T.font=b,E.width=Ju.ceilPowerOfTwo(Math.ceil(T.measureText(M).width)+32),E.height=Ju.ceilPowerOfTwo(96*1.4);const _=E.getContext("2d");if(!_)return new Me;_.font=b,_.textAlign="center",_.textBaseline="middle",_.fillStyle=v,_.fillText(M,E.width/2,E.height/2);const A=new Nh(E);A.colorSpace=Nn,s.push(A);const k=E.width/E.height,L=c(new ai(x*k,x)),U=l(new vn({map:A,transparent:!0,depthWrite:!1,side:Ke,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),D=new Me(L,U);return D.rotation.x=-Math.PI/2,D.position.y=w,D.renderOrder=3,D}function u(M,x,v,w,S,E){const T=v-x,b=c(new ai(T,w)),_=h(b,S,E,Da);_.position.set(T/2+x,Da,0);const A=new Re;return A.add(_),A.rotation.y=M-Math.PI/2,A}function m(M,x,v,w,S){const E=new Jm;E.moveTo(0,x*.5),E.lineTo(-v*.5,x*.5-v*.9),E.lineTo(-v*.18,x*.5-v*.9),E.lineTo(-v*.18,-x*.5),E.lineTo(v*.18,-x*.5),E.lineTo(v*.18,x*.5-v*.9),E.lineTo(v*.5,x*.5-v*.9),E.closePath();const T=c(new Md(E)),b=h(T,w,S,Da+.002),_=new Re;return _.add(b),_.rotation.y=M+Math.PI,_}function y(M){var T;const x=new Re,v=d(`${M.index} · ${M.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((T=v.geometry.parameters)==null?void 0:T.width)??3;x.add(v);const E=h(c(new ai(S*.98,.08)),M.color,.7,ka);return E.position.set(0,ka,t.lab.labelTextHeight*.66),x.add(E),x.position.set(M.labelX,0,M.labelZ),x}const g=new Re;for(const M of n??[]){const x=new Re;if(x.position.set(M.x,0,M.z),M.shape==="square"){const v=M.radius,w=h(c(new ai(v*2,v*2)),M.color,e.padOpacity*.09);x.add(w);const S=.07,E=[[0,v,v*2+S,S],[0,-v,v*2+S,S],[-v,0,S,v*2+S],[v,0,S,v*2+S]];for(const[T,b,_,A]of E){const k=h(c(new ai(_,A)),M.color,e.padOpacity);k.position.x=T,k.position.z=b,x.add(k)}}else x.add(h(c(new gd(M.radius,72)),M.color,e.padOpacity*.075)),x.add(h(f(M.radius-.075,M.radius),M.color,e.padOpacity));if(M.id==="hub"){for(let v=0;v<4;v++){const w=v*Math.PI/4,S=v%2===0;for(const E of[0,Math.PI])x.add(u(w+E,M.radius*.12,M.radius*.94,S?.09:.055,M.color,S?.5:.32))}x.add(h(f(.5,.56),M.color,.4))}else if(M.id==="dash"){const v=M.spawnZ-M.z,w=-M.radius+.5,S=v-w,E=h(c(new ai(.06,S)),M.color,.36);E.position.set(0,Da,(v+w)/2),x.add(E);let T=0;for(let _=v;_>=w-.01;_-=1,T++){const A=T%5===0,k=h(c(new ai(A?2.4:1.3,A?.1:.07)),M.color,A?.72:.42);k.position.set(0,Da,_),x.add(k);const L=d(String(T),.52,A?"#eaf4ff":"rgba(200,225,245,0.8)");L.position.set(1.6,ka,_),x.add(L)}const b=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[_,A]of b){const k=v-_,L=h(c(new ai(1.9,.09)),"#ffffff",.5);L.position.set(-1.5,Da,k),x.add(L);const U=d(A,.42,"rgba(220, 236, 250, 0.86)");U.position.set(-3,ka,k),x.add(U)}}else if(M.id==="gait"){x.add(h(f(1.44,1.5),M.color,.5)),x.add(h(f(1.14,1.2),M.color,.22));const v=1.55,w=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,E,T]of w){const _=Math.sin(S),A=Math.cos(S),k=m(S,1.7,.34,T,.75);k.position.set(_*1.7*.5,0,v+A*1.7*.5),x.add(k);const L=d(E,.44,T);L.position.set(_*(1.7+.7),ka,v+A*(1.7+.7)),x.add(L)}}if(g.add(x),e.showLabels){const v=y(M);a.push(v),g.add(v)}}i.add(g);const p=n==null?void 0:n.find(M=>M.id==="hub");if(p&&e.showLabels){const M=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[x,v,w]of M){const S=d(w,.4,"rgba(190, 224, 248, 0.8)");S.position.set(p.x+x*(p.radius+.7),ka,p.z+v*(p.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(M){i.visible=M},setLabelsVisible(M){for(const x of a)x.visible=M},dispose(){for(const M of r)M.dispose();for(const M of o)M.dispose();for(const M of s)M.dispose();i.clear()}}}const qe={grass:8,groundArea:12,ringHalo:20,ring:22,ringMeter:24,ringWarn:26,groundFx:30,trail:40,slash:44,projectileTrail:46,projectile:48,projectileGlow:50};function Ll(n,t){n.renderOrder=t,n.traverse(e=>{e.renderOrder=t})}function Dl(n,t,e){const i=Array.from({length:t.count},()=>{const a=new vn({color:t.color,transparent:!0,opacity:0,side:Ke,depthWrite:!1,...t.blending?{blending:t.blending}:{}}),s=new Me(t.geometry,a);return s.rotation.x=-Math.PI/2,s.renderOrder=t.renderOrder,s.visible=!1,n.add(s),{mesh:s,mat:a,life:0,base:1,delay:0}});return{entries:i,spawn(a,s,o,r,l){const c=i.find(h=>h.life<=0)??i[0];l!=null&&l.color&&c.mat.color.set(l.color),c.mesh.position.set(a,e(a,s,o)+t.yOffset,s),c.base=r,c.mesh.scale.setScalar(r*t.scaleFrom),c.mesh.visible=!0,c.mat.opacity=t.spawnOpacity,c.life=t.duration,c.delay=(l==null?void 0:l.delay)??0},update(a){for(const s of i){if(s.life<=0)continue;if(s.delay>0){s.delay-=a;continue}s.life-=a;const o=Math.max(0,s.life/Math.max(t.duration,1e-6));s.mesh.scale.setScalar(s.base*(t.scaleFrom+t.scaleSpan*(1-Math.pow(o,t.growPow)))),s.mat.opacity=t.peak*Math.pow(o,t.fadePow),s.life<=0&&(s.mesh.visible=!1)}},live(){return i.filter(a=>a.life>0)},dispose(){for(const a of i)a.mat.dispose()}}}function lR(n,t,e,i){const a=t.dash,s={count:6,geometry:new Ds(a.ringRadius-.06,a.ringRadius,28),color:"#ffffff",renderOrder:qe.groundFx,duration:a.fxDuration,peak:.9,fadePow:1,scaleFrom:.6,scaleSpan:1.2,growPow:1,yOffset:.04,spawnOpacity:.9},o=Dl(n,s,i),r=t.links,l={count:5,geometry:new Ds(r.ringRadius-.07,r.ringRadius,28),color:r.chargeColor,renderOrder:qe.groundFx,duration:r.fxDuration,peak:.85,fadePow:1,scaleFrom:.55,scaleSpan:1.1,growPow:1,yOffset:.05,spawnOpacity:.85},c=Dl(n,l,i),h=t.groundSlam,f={count:4,geometry:new Ds(.78,1,56),color:h.color,blending:Vi,renderOrder:qe.groundFx+1,duration:h.duration,peak:.85,fadePow:1.3,scaleFrom:.35,scaleSpan:.65,growPow:1.8,yOffset:.035,spawnOpacity:0},d=Dl(n,f,i);let u=e.dash.id,m="none",y=e.playerLink.id,g=e.playerLink.hitIds.length,p=e.combat.slamAttackId,M=0;return{update(x,v,w){var T;const S=x.character;if(x.dash.id!==u){u=x.dash.id;const b=x.dash;m=b.kind,b.kind==="blink"?(o.spawn(b.fromX,b.fromZ,S.position.y,.9,{color:a.blinkColor}),o.spawn(b.toX,b.toZ,S.position.y,1.35,{color:a.blinkColor})):o.spawn(b.fromX,b.fromZ,S.position.y,1.1,{color:a.rollColor})}if(o.update(v),x.combat.slamAttackId!==p&&(p=x.combat.slamAttackId,M+=1,h.enabled)){const b=(T=x.config.combat.weapons[x.combat.weapon])==null?void 0:T.groundSlam,_=Math.max(.6,(b==null?void 0:b.radius)??2.2);d.spawn(S.position.x,S.position.z,S.position.y,_,{delay:0}),d.spawn(S.position.x,S.position.z,S.position.y,_*h.outerScale,{delay:h.delay}),w(h.shake)}d.update(v);const E=x.playerLink;E.id!==y&&(y=E.id,g=E.hitIds.length,c.spawn(S.position.x,S.position.z,S.position.y,1)),E.hitIds.length>g?(g=E.hitIds.length,c.spawn(S.position.x,S.position.z,S.position.y,1.35)):E.hitIds.length<g&&(g=E.hitIds.length),c.update(v)},slamDebug(){return{spawns:M,lastId:p,live:d.live().map(x=>({life:x.life,scale:x.mesh.scale.x,opacity:x.mat.opacity,visible:x.mesh.visible}))}},groundOrder(){var x;return((x=d.entries[0])==null?void 0:x.mesh.renderOrder)??qe.groundFx+1},activeDash(){return o.live().length},dashKind(){return m},dispose(){o.dispose(),c.dispose(),d.dispose();for(const x of[s.geometry,l.geometry,f.geometry])x.dispose()}}}const Sd=64,R0=[0,.24,.76,1],hR=[0,1,1,0],P0=[0,.12,.28,.5,.72,.88,1],dR=[0,.16,.5,1,.5,.16,0];function vp(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function wd(n,t,e,i,a=Sd,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?P0:R0,c=s==="glow"?dR:hR,h=l.length,f=a+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),m=[];for(let g=0;g<f;g++){const p=g/a,M=(p-.5)*e,x=vp(p,i)*vp(1-p,i),v=Math.sin(M),w=Math.cos(M);for(let S=0;S<h;S++){const E=o+(r-o)*l[S],T=g*h+S;d[T*3]=v*E,d[T*3+1]=0,d[T*3+2]=w*E;const b=x*c[S];u[T*4]=1,u[T*4+1]=1,u[T*4+2]=1,u[T*4+3]=b}}for(let g=0;g<a;g++)for(let p=0;p<h-1;p++){const M=g*h+p,x=M+h;m.push(M,x,M+1,M+1,x,x+1)}const y=new cn;return y.setAttribute("position",new yn(d,3)),y.setAttribute("color",new yn(u,4)),y.setIndex(m),y.computeBoundingSphere(),y}function kl(n){const t=new vn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Ke,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const h=Math.round(l*32)/32,f=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const m=wd(n.radius,n.thickness*f,h,n.edgeFade,Sd,n.profile??"band");if(e.set(d,m),e.size>64){for(const[y,g]of e)if(y!==d&&g!==i){g.dispose(),e.delete(y);break}}return m};i=a(n.arcRad,1);const s=new Me(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,h,f,d,u=1){const m=Math.max(.05,u);(Math.abs(l-o)>.01||Math.abs(m-r)>.01)&&(i=a(l,m),s.geometry=i,o=l,r=m),t.opacity=c,t.color.copy(f),s.scale.set(h,1,h),s.rotation.y=d,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function yp(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function uR(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,h=s+(c-s)*(.35+.65*r),f=4+4*r+6*l,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*l)*r+.04*d),m=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:m,level:r}}function fR(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function pR(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<a;u++){const m=u/e,y=t+(1-t)*m,g=c*a+u;s[g*3]=f*y,s[g*3+1]=0,s[g*3+2]=d*y;const p=Math.pow(1-m,1.8)*.9+(u===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const f=c*a+h,d=f+a;r.push(f,d,f+1,f+1,d,d+1)}const l=new cn;return l.setAttribute("position",new yn(s,3)),l.setAttribute("color",new yn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function Mp(n){const t=n.segments??Sd,e=n.profile??"band",a=((e==="glow"?P0.length:R0.length)-1)*6,s=wd(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new vn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ke,vertexColors:!0,toneMapped:!1}),r=new Me(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,f,d,u=1){const m=Math.min(1,Math.max(0,c)),y=Math.round(m*t),g=m>.001?Math.max(1,y)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),l=y,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&m>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function _p(n){const t=new Re,e=pR(48),i=new vn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ke,vertexColors:!0,toneMapped:!1}),a=new Me(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=wd(1-s*.5,s,Math.PI*2,0,64,"band"),r=new vn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ke,vertexColors:!0,toneMapped:!1}),l=new Me(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,f,d,u,m){const y=Math.min(1,Math.max(0,u));t.position.set(c,f,h),a.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=y*.26,r.opacity=y*(.72+.18*Math.sin(m*7)),t.visible=y>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function bp(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function mR(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function gR(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function xR(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function vR(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function yR(n,t,e){return n?t:e}function C0(n){return{x:0,y:0,z:1}}function MR(n){return Math.asin(C0().y)}function _R(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const bR=Math.PI/3;function Sp(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function SR(){let n=0,t=!1;return{update(e,i,a,s=bR){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=Sp(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=Sp(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function wR(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new cn,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new yn(i,3),o=new yn(a,3);s.setUsage(Eo),o.setUsage(Eo),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const v=x*2,w=v+1,S=v+2,E=v+3;r.push(v,w,S,w,E,S)}e.setIndex(r),e.setDrawRange(0,0);const l=new vn({vertexColors:!0,transparent:!0,opacity:1,blending:Vi,depthWrite:!1,side:Ke}),c=new Me(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new te(n.color);let f=[],d=null,u=0,m=0,y=!1,g=!1,p=0;function M(){const x=f.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const v=Math.max(.001,n.life);for(let w=0;w<x;w++){const S=f[w],E=Math.max(0,1-S.age/v),T=E*E,b=Math.min(1,S.speed/Math.max(.001,n.minSpeed*2)),_=n.intensity*T*(.55+.45*b)*(1+p),A=.18+.82*E,k=w*6;i[k]=S.tx+(S.bx-S.tx)*A,i[k+1]=S.ty+(S.by-S.ty)*A,i[k+2]=S.tz+(S.bz-S.tz)*A,i[k+3]=S.tx,i[k+4]=S.ty,i[k+5]=S.tz;const L=h.r*_,U=h.g*_,D=h.b*_,P=L*.22,O=U*.22,B=D*.22;a[k]=P,a[k+1]=O,a[k+2]=B;const W=1+n.tipBoost;a[k+3]=Math.min(1,L*W),a[k+4]=Math.min(1,U*W),a[k+5]=Math.min(1,D*W)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,v,w){if(!n.enabled){c.visible=!1;return}const S=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*S),p<.001&&(p=0);for(const E of f)E.age+=S;for(;f.length>0&&f[0].age>n.life;)f.shift();if(v){const E=d?Math.hypot(v.tip.x-d.x,v.tip.y-d.y,v.tip.z-d.z)/Math.max(1e-4,S):0,T=f[f.length-1],b=T?Math.hypot(v.tip.x-T.tx,v.tip.y-T.ty,v.tip.z-T.tz):1/0;if(w&&b>=n.minStep)for(f.push({bx:v.base.x,by:v.base.y,bz:v.base.z,tx:v.tip.x,ty:v.tip.y,tz:v.tip.z,age:0,speed:E});f.length>t;)f.shift();d={x:v.tip.x,y:v.tip.y,z:v.tip.z},u=E,m=b,y=!0}else d=null,y=!1,u=0,m=0;g=w,M()},debug(){return{count:f.length,visible:c.visible,speed:u,moved:m,hasBlade:y,active:g,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){f=[],d=null,p=0,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}const ER=`#include <common>
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
}`,TR=`vec4 mvPosition = vec4( transformed, 1.0 );
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
  float effL = ${xu.toFixed(2)} * aWindGeom.x + aWindGeom.y;
  float theta = atan(sway, max(effL, 1e-3));
  float tLow = theta * ${xu.toFixed(2)};
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
gl_Position = projectionMatrix * mvPosition;`,AR=`#include <common>
varying float vWindShade;`,RR=`#include <color_fragment>
diffuseColor.rgb *= vWindShade;`;function PR(n,t,e,i,a){const s=Math.min(e.blades.length,Math.floor(Math.max(0,i.maxInstances)/2)),o=s*2,r=new Float32Array(o*2),l=new Float32Array(o*3),c=new Float32Array(o*4),h=Math.max(.01,i.segmentHeight);for(let u=0;u<s;u++){const m=e.blades[u],y=Math.min(h,m.height),g=Math.max(0,m.height-y),[p,M]=lv(a,m.x,m.z,m.yaw*a.jitter),x=Math.min(1.4,Math.max(.6,m.height/(h*1.5)));for(let v=0;v<2;v++){const w=u*2+v;r[w*2]=p,r[w*2+1]=M,l[w*3]=m.x,l[w*3+1]=m.y,l[w*3+2]=m.z,c[w*4]=y,c[w*4+1]=g,c[w*4+2]=x,c[w*4+3]=v}}t.setAttribute("aWindPhase",new Ao(r,2)),t.setAttribute("aWindRoot",new Ao(l,3)),t.setAttribute("aWindGeom",new Ao(c,4));const f=Qp(a),d={uWindTime:{value:0},uWindDir:{value:new Gt(f.dirX,f.dirZ)},uWindOmega:{value:new Gt(f.omega1,f.omega2)},uWindAmp:{value:new Gt(f.amp1,f.amp2)},uWindGust:{value:1},uWindShade:{value:f.shadeAmount},uWindOn:{value:a.enabled?1:0}};return n.onBeforeCompile=u=>{Object.assign(u.uniforms,d),u.vertexShader=u.vertexShader.replace("#include <common>",ER).replace("#include <project_vertex>",TR),u.fragmentShader=u.fragmentShader.replace("#include <common>",AR).replace("#include <color_fragment>",RR)},n.customProgramCacheKey=()=>"grass-wind-pivot-v2",d}function CR(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function LR(n,t,e=zo){const i=new Re;i.name="grass-layer";const s=n.blades.length,o=Math.max(0,Math.floor(t.maxInstances)),r=Math.min(s,Math.floor(o/2)),l=r*2,c=t.enabled&&l>0,f=(t.palette.length>0?t.palette:["#4a8f57"]).map(N=>new te(N)),d=new te(t.stumpColor),u=new te(t.debris.color),m=new Xn(1,1,1),y=new Xn(1,1,1),g=new qi({color:16777215,transparent:!1}),p=PR(g,y,n,t,e),M=new qi({color:u,transparent:!1});let x=null,v=null,w=null;const S=[],E=CR(2654435769^r),T=new Float32Array(r),b=new Uint8Array(r),_=new Float32Array(r),A=new Uint8Array(r).fill(1),k=new De,L=new pa,U=new pa,D=new pa,P=new H,O=new H,B=new H,W=new H,et=new te,lt=new te,pt=new De().makeScale(0,0,0);let Pt=0,Y=0,nt=0,ut=0,st=1,tt=1;const dt=8;let Ut={enabled:e.enabled,time:0,gust:1,mode:"pivot"};function Vt(N,At){if(f.length===1)return At.copy(f[0]);const Rt=Math.max(0,Math.min(f.length-1,N*(f.length-1))),St=Math.min(f.length-2,Math.max(0,Math.floor(Rt)));return At.copy(f[St]).lerp(f[St+1],Math.min(1,Math.max(0,Rt-St)))}if(c){x=new jf(y,g,l),x.instanceMatrix.setUsage(Eo),x.castShadow=!1,x.receiveShadow=!0,x.frustumCulled=!1,x.name="grass-blades",x.setColorAt(0,f[0]),v=x.instanceColor,v&&v.setUsage(Eo);for(let At=0;At<l;At++)x.setMatrixAt(At,pt);i.add(x);const N=Math.max(1,Math.floor(t.debris.max));w=new jf(m,M,N),w.instanceMatrix.setUsage(Eo),w.castShadow=!1,w.receiveShadow=!1,w.frustumCulled=!1,w.name="grass-debris";for(let At=0;At<N;At++)w.setMatrixAt(At,pt);i.add(w)}i.visible=c;function ht(N,At,Rt,St,vt,mt){if(!w)return;const kt=w.count;if(S.length>=kt)return;const F=t.debris.life,R=1.1+E()*1.5;S.push({x:N,y:At,z:Rt,vx:St*R+(E()-.5)*1.2,vy:1.9+E()*1.8,vz:vt*R+(E()-.5)*1.2,life:F,total:F,size:mt*(.55+E()*.45),spin:(E()-.5)*9})}function X(N){if(!w)return;const At=w.count,Rt=12;for(let vt=S.length-1;vt>=0;vt--){const mt=S[vt];if(mt.life-=N,mt.life<=0){S.splice(vt,1);continue}mt.vy-=Rt*N,mt.x+=mt.vx*N,mt.y+=mt.vy*N,mt.z+=mt.vz*N,mt.y<.02&&(mt.y=.02,mt.vy=-mt.vy*.25,mt.vx*=.6,mt.vz*=.6)}const St=1e-4;for(let vt=0;vt<At;vt++){const mt=S[vt];if(!mt){w.setMatrixAt(vt,pt);continue}const kt=Math.max(St,mt.life/mt.total);O.set(mt.x,mt.y,mt.z),P.set(.4+vt*.13,1,.2).normalize(),L.setFromAxisAngle(P,mt.spin*(mt.total-mt.life)),B.set(mt.size*kt,mt.size*.7*kt,mt.size*kt),k.compose(O,L,B),w.setMatrixAt(vt,k)}w.instanceMatrix.needsUpdate=!0}return{object:i,update(N,At){var ct,Nt,Ft;if(!c||!x)return;const Rt=N.grass,St=((ct=N.config.grass)==null?void 0:ct.wind)??zo,vt=Qp(St),mt=((Nt=Rt.wind)==null?void 0:Nt.time)??0,kt=((Ft=Rt.wind)==null?void 0:Ft.gust)??1;p.uWindTime.value=mt,p.uWindGust.value=kt,p.uWindDir.value.set(vt.dirX,vt.dirZ),p.uWindOmega.value.set(vt.omega1,vt.omega2),p.uWindAmp.value.set(vt.amp1,vt.amp2),p.uWindShade.value=vt.shadeAmount,p.uWindOn.value=St.enabled?1:0,Ut={enabled:St.enabled,time:mt,gust:kt,mode:"pivot"};const F=Math.min(r,Rt.blades.length),R=Math.min(.05,Math.max(0,At)),K=N.config.grass,ft=(K==null?void 0:K.regrowSec)??0,V=Math.min(1,Math.max(.05,(K==null?void 0:K.stumpRatio)??.34)),ot=t.segmentHeight,zt=Math.PI*2;x.instanceMatrix.clearUpdateRanges(),v&&v.clearUpdateRanges();let Et=0,bt=0,Wt=0,gt=0,Lt=0,j=0,$=0;for(let Ct=0;Ct<F;Ct++){const I=Rt.blades[Ct],yt=I.cut!==0?1:0,Q=I.yaw/zt,rt=uv(I.cut,ft,Q),Dt=Math.min(ot,I.height),Tt=Dt*V,qt=Tt+(I.height-Tt)*rt;if(Ct<dt&&(j+=qt/Math.max(1e-6,I.height),$+=1),rt>.001&&rt<1-.001&&(gt+=1,Lt+=rt),!(A[Ct]===1||Math.abs(I.bend-T[Ct])>1e-4||yt!==b[Ct]||Math.abs(rt-_[Ct])>.001)){I.bend>.02&&(bt+=1),yt&&(Wt+=1);continue}yt&&!b[Ct]&&A[Ct]!==1&&(ht(I.x,I.y+Dt*.75,I.z,I.bendX||1,I.bendZ||0,I.width*1.5),ht(I.x,I.y+Dt+(I.height-Dt)*.5,I.z,I.bendX||1,I.bendZ||0,I.width*1.2)),P.set(Math.cos(I.yaw),0,-Math.sin(I.yaw)),D.setFromAxisAngle(P,I.lean),P.set(I.bendZ,0,-I.bendX),U.setFromAxisAngle(P,I.bend),L.copy(U).multiply(D),W.set(I.x,I.y,I.z);const de=Math.min(ot,qt),ne=Math.max(0,qt-ot);O.set(0,de*.5,0).applyQuaternion(L).add(W),B.set(I.width,de,I.width),k.compose(O,L,B),x.setMatrixAt(Ct*2,k),ne<1e-4?x.setMatrixAt(Ct*2+1,pt):(O.set(0,de+ne*.5,0).applyQuaternion(L).add(W),B.set(I.width*.84,ne,I.width*.84),k.compose(O,L,B),x.setMatrixAt(Ct*2+1,k)),Vt(I.tone,lt),rt>=1?et.copy(lt):et.copy(d).lerp(lt,rt),x.setColorAt(Ct*2,et),x.setColorAt(Ct*2+1,et),x.instanceMatrix.addUpdateRange(Ct*32,32),v&&v.addUpdateRange(Ct*6,6),T[Ct]=I.bend,b[Ct]=yt,_[Ct]=rt,A[Ct]=0,Et+=1,I.bend>.02&&(bt+=1),yt&&(Wt+=1)}Et>0&&(x.instanceMatrix.needsUpdate=!0,v&&(v.needsUpdate=!0)),X(R),Pt=Et,Y=bt,nt=Wt,ut=gt,st=gt>0?Lt/gt:1,tt=$>0?j/$:1},debug(){return{enabled:c,blades:s,patches:n.patches.length,instances:l,drawCalls:c?2:0,dirty:Pt,bent:Y,cut:nt,debris:S.length,growing:ut,avgGrowth:st,sampleHeight:tt,wind:{...Ut}}},dispose(){m.dispose(),y.dispose(),g.dispose(),M.dispose(),i.clear()}}}const DR=.14,bo=1e-6;function vo(n,t,e){return n<t?t:n>e?e:n}function wp(n,t){const e=[-n,n,n,-n],i=[-n,-n,n,n],a=[],s=(c,h,f,d)=>{a.push(c[0],c[1],c[2],h[0],h[1],h[2],f[0],f[1],f[2]),a.push(c[0],c[1],c[2],f[0],f[1],f[2],d[0],d[1],d[2])},o=e.map((c,h)=>[c,0,i[h]]);s(o[0],o[3],o[2],o[1]);for(let c=0;c<4;c++){const h=(c+1)%4,f=[e[c],0,i[c]],d=[e[h],0,i[h]],u=[e[c],t[c],i[c]],m=[e[h],t[h],i[h]];s(f,d,m,u)}const r=e.map((c,h)=>[c,t[h],i[h]]);s(r[0],r[1],r[2],r[3]);const l=new cn;return l.setAttribute("position",new ke(a,3)),a.length/3,l.addGroup(0,30,0),l.addGroup(30,6,1),l.computeVertexNormals(),l}function kR(n,t,e,i){const a={x:t.x-n.x,y:t.y-n.y,z:t.z-n.z},s={x:i.x-e.x,y:i.y-e.y,z:i.z-e.z},o={x:n.x-e.x,y:n.y-e.y,z:n.z-e.z},r=(y,g)=>y.x*g.x+y.y*g.y+y.z*g.z,l=r(a,a),c=r(s,s),h=r(s,o);let f=0,d=0;if(l<=bo&&c<=bo)f=0,d=0;else if(l<=bo)f=0,d=vo(h/c,0,1);else{const y=r(a,o);if(c<=bo)d=0,f=vo(-y/l,0,1);else{const g=r(a,s),p=l*c-g*g;f=p!==0?vo((g*h-y*c)/p,0,1):0,d=(g*f+h)/c,d<0?(d=0,f=vo(-y/l,0,1)):d>1&&(d=1,f=vo((g-y)/l,0,1))}}const u={x:n.x+a.x*f,y:n.y+a.y*f,z:n.z+a.z*f},m={x:e.x+s.x*d,y:e.y+s.y*d,z:e.z+s.z*d};return{dist:Math.hypot(u.x-m.x,u.y-m.y,u.z-m.z),cq:m}}function IR(n){const t=new Re;t.name="destructibles";const e=[];let i=null,a=null;const s=new Xn(1,1,1);for(const u of n){const m=new qi({color:new te(u.color),side:Ke}),y=new qi({color:new te(u.cutColor),side:Ke}),g=new Me(wp(u.radius,[0,0,0,0]),[m,y]);g.name=`standing-${u.id}`;const p=new Re;p.name=`frags-${u.id}`;const M=new Re;M.name=`piece-${u.id}`,M.position.set(u.x,u.y,u.z),M.add(g,p),t.add(M),e.push({id:u.id,root:M,standing:g,fragGroup:p,fragMeshes:[],bodyMat:m,capMat:y,key:""})}const o=(u,m)=>{const y=Hv(m.radius,m.standU,m.height,m.snx,m.sny,m.snz);u.standing.geometry.dispose(),u.standing.geometry=wp(m.radius,y)};function r(u){for(let m=0;m<e.length;m++){const y=e[m];let g;for(let x=0;x<u.length;x++)if(u[x].id===y.id){g=u[x];break}if(!g){y.root.visible=!1;continue}const p=g.kind==="pole"?`${g.standU}|${g.snx}|${g.sny}|${g.snz}`:`${g.broken}`;p!==y.key&&(o(y,g),y.key=p),y.bodyMat.color.set(g.color),y.capMat.color.set(g.cutColor),y.root.position.set(g.x,g.y,g.z),y.standing.visible=!(g.kind==="jar"&&g.broken!==0);const M=g.fragments??[];for(;y.fragMeshes.length<M.length;){const x=new Me(s,y.bodyMat);x.name=`frag-${g.id}-${y.fragMeshes.length}`,y.fragGroup.add(x),y.fragMeshes.push(x)}for(let x=0;x<y.fragMeshes.length;x++){const v=y.fragMeshes[x];if(x>=M.length){v.visible=!1;continue}const w=M[x];v.visible=!0,v.position.set(w.x,w.y,w.z),v.quaternion.set(w.qx,w.qy,w.qz,w.qw),v.scale.set(w.hx*2,w.hy*2,w.hz*2)}}}function l(u,m){const y=[],g=(p,M)=>{if(!p){M==="right"?i=null:a=null;return}const x={x:(p.base.x+p.tip.x)/2,y:(p.base.y+p.tip.y)/2,z:(p.base.z+p.tip.z)/2},v=M==="right"?i:a;if(M==="right"?i=x:a=x,!v)return;let w=p.tip.x-p.base.x,S=p.tip.y-p.base.y,E=p.tip.z-p.base.z;const T=x.x-v.x,b=x.y-v.y,_=x.z-v.z;Math.hypot(T,b,_)>.002&&(w=T,S=b,E=_);const k=Math.hypot(w,S,E);k>bo?(w/=k,S/=k,E/=k):(w=0,S=0,E=1);const L={x:0,y:0,z:0},U={x:0,y:0,z:0};for(let D=0;D<u.length;D++){const P=u[D];if(P.kind==="jar"&&P.broken!==0||P.kind==="pole"&&P.standU<=Fs)continue;const O=P.y+(P.kind==="pole"?P.standU:1)*P.height;L.x=P.x,L.y=P.y,L.z=P.z,U.x=P.x,U.y=O,U.z=P.z;const B=kR(p.base,p.tip,L,U);if(!(B.dist>P.radius+DR)){y.push({id:P.id,x:B.cq.x,y:B.cq.y,z:B.cq.z,dx:w,dy:S,dz:E});break}}};return g(m.right,"right"),g(m.left,"left"),y}function c(){const u=[],m=[],y={};let g=0,p=0;for(const M of e){M.root.visible&&(m.push({id:M.id,x:M.root.position.x,y:M.root.position.y,z:M.root.position.z}),M.standing.visible&&(p+=1));for(const x of M.fragMeshes)x.visible&&(p+=1)}for(const M of h)y[M.id]=(M.fragments??[]).length,M.broken!==0&&(g+=1,u.push({id:M.id,cutU:M.cutU,theta:M.theta,nx:M.nx,ny:M.ny,nz:M.nz}));return{count:e.length,broken:g,drawCalls:p,positions:m,fragments:y,cuts:u}}let h=n;const f=u=>{h=u,r(u)};function d(){for(const u of e)u.standing.geometry.dispose(),u.bodyMat.dispose(),u.capMat.dispose();s.dispose(),t.clear()}return f(n),{object:t,update:f,computeHits:l,debug:c,dispose:d}}function zR(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function FR(n,t,e,i){var Ln,_n;const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new RA({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=xm,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new PA;r.background=new te("#12161d"),r.add(new u2(11061486,2764600,1.15));const l=new m2(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],f=new Re;for(const Z of t.boxes){const It=Z.maxX-Z.minX,Ot=Z.maxY-Z.minY,ie=Z.maxZ-Z.minZ;let oe=zR(Z.kind,e);Z.kind==="step"&&(oe=new te(oe).offsetHSL(0,0,Z.maxY*.09).getStyle());const C=new qi({color:oe,transparent:!1,opacity:1}),G=new Me(new Xn(It,Ot,ie),C);G.position.set((Z.minX+Z.maxX)/2,(Z.minY+Z.maxY)/2,(Z.minZ+Z.maxZ)/2),G.castShadow=Z.kind!=="ground",G.receiveShadow=!0,G.add(new $m(new $A(G.geometry),new fd({color:10467020,transparent:!0,opacity:.32}))),f.add(G),h.push(C)}r.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new x2(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const m=cR(i,e);r.add(m.group);const y=LR(t.grass,e.grass,t.config.grass.wind);Ll(y.object,qe.grass),r.add(y.object);const g=IR(t.destructibles);r.add(g.object);let p=[];const M=Z=>A0((Z==null?void 0:Z.voxel)??e.voxel,Z!=null&&Z.colors?{...e.colors,...Z.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance);let x="standard",v=M((Ln=e.bodyTypes)==null?void 0:Ln[x]);const w=wR(e.weaponTrail);Ll(w.object,qe.trail),r.add(w.object);const S=new Re,E=.9,T=new Re;T.position.y=E,v.group.position.y=-E,T.add(v.group),S.add(T),r.add(S);const b=SR();let _=0;const A=((_n=t.config.dummies.fighters)==null?void 0:_n.moveSpeed)??t.config.dummies.moveSpeed;function k(Z,It){const Ot=e.dummies.colors,ie=Ot[It%Ot.length]??"#cccccc";let oe;if(Z.weapon){const C=e.dummies.fighterColors,G=C&&C.length>0?C[(It-t.config.dummies.count)%C.length]:void 0;oe=rR({voxel:e.voxel,colors:G?{...e.colors,...G}:e.colors,moveSpeed:A,orientation:e.orientation,gait:e.gait,mount:e.weaponMount,lean:e.lean,hurt:e.hurt,animation:e.animation,ik:e.ik,links:e.links,wrist:e.weaponWrist,balance:e.balance})}else{const C=O2(e.voxel,e.colors,ie,Z.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);oe={group:C.group,update:(G,it)=>C.update(G,it),boneAtWorld:(G,it,at)=>C.boneAtWorld(G,it,at),dispose:()=>C.dispose()}}return oe.group.traverse(C=>{C.userData.dummyId=Z.id}),r.add(oe.group),oe}const L=t.dummies.map(k),U=L.map(Z=>Z.group),D=new g2,P=e.groundRing,O=e.voxel.bodyWidth,B=yp(O,P.playerRadiusFactor),W=yp(O,P.dummyRadiusFactor),et=O*P.thicknessFactor,lt=P.arcDeg*Math.PI/180;let pt=0;const Pt=(Z,It,Ot)=>Bp(t.boxes,Z,It,Ot+.55,0),Y=kl({radius:B,thickness:et,arcRad:lt,edgeFade:P.edgeFade,color:P.playerColor,opacity:P.playerOpacity,y:.028,renderOrder:qe.ring});Y.mesh.name="player-ground-ring",r.add(Y.mesh);function nt(Z){const It=kl({radius:W,thickness:et,arcRad:lt,edgeFade:P.edgeFade,color:P.neutralColor,opacity:P.opacity,y:.022,renderOrder:qe.ring});return It.mesh.name=`dummy-ground-ring-${Z.id}`,r.add(It.mesh),It}function ut(Z){const It=kl({radius:W*P.haloRadiusFactor,thickness:et*P.haloThicknessFactor,arcRad:lt,edgeFade:P.edgeFade,color:P.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:qe.ringHalo});return It.mesh.name=`dummy-ground-halo-${Z.id}`,r.add(It.mesh),It}function st(Z){const It=Mp({radius:W*P.warnRadiusFactor,thickness:et*P.warnThicknessFactor,arcRad:lt,edgeFade:.02,color:P.warnColor,y:.031,renderOrder:qe.ringWarn});return It.mesh.name=`dummy-ground-warn-${Z.id}`,r.add(It.mesh),It}const tt=t.dummies.map(nt),dt=t.dummies.map(ut),Ut=t.dummies.map(()=>0),Vt=t.dummies.map(()=>0),ht=Mp({radius:B*P.meterRadiusFactor,thickness:et*P.meterThicknessFactor,arcRad:lt,edgeFade:.06,color:P.meterColorCharge,y:.03,renderOrder:qe.ringMeter});ht.mesh.name="player-ground-meter",r.add(ht.mesh);const X=t.dummies.map(st),N=_p({color:P.playerColor,y:.042,renderOrder:qe.groundArea});N.group.name="player-landing-preview",r.add(N.group);const At=new te,Rt=new te(P.playerColor),St=new te(P.neutralColor),vt=new te(P.lowThreatColor),mt=new te(P.highThreatColor),kt=new te(P.meterColorCharge),F=new te(P.meterColorChannel),R=new te(P.meterColorCooldown),K=new te(P.warnColor),ft=new Re;r.add(ft);const V=e.projectiles;function ot(){const It=document.createElement("canvas");It.width=64,It.height=64;const Ot=It.getContext("2d");if(Ot){const oe=Ot.createRadialGradient(32,32,0,32,32,32);oe.addColorStop(0,"rgba(255,255,255,1)"),oe.addColorStop(.28,"rgba(255,255,255,0.72)"),oe.addColorStop(.62,"rgba(255,255,255,0.22)"),oe.addColorStop(1,"rgba(255,255,255,0)"),Ot.fillStyle=oe,Ot.fillRect(0,0,64,64)}const ie=new Nh(It);return ie.colorSpace=Nn,ie}function zt(){const Ot=document.createElement("canvas");Ot.width=2,Ot.height=64;const ie=Ot.getContext("2d");if(ie){const C=ie.createLinearGradient(0,0,0,64);C.addColorStop(0,"rgba(255,255,255,0)"),C.addColorStop(.55,"rgba(255,255,255,0.35)"),C.addColorStop(1,"rgba(255,255,255,0.95)"),ie.fillStyle=C,ie.fillRect(0,0,2,64)}const oe=new Nh(Ot);return oe.colorSpace=Nn,oe}const Et=ot(),bt=zt(),Wt=new vn({color:12577023,transparent:!0,opacity:0,side:Ke,depthWrite:!1}),gt=new vn({color:14217983,transparent:!0,opacity:0,side:Ke,depthWrite:!1,blending:Vi}),Lt=new Re;Lt.position.set(0,.95,.72),ft.add(Lt);const j=new Re;j.rotation.x=MR(e.camera.pitchDeg),Lt.add(j);const $=new Mc(.78,V.slashThickness,6,28,Math.PI*1.15),ct=new Re,Nt=new Me($,Wt),Ft=new Me($,gt);Ft.scale.setScalar(1.09),Ll(ct,qe.slash),Ft.renderOrder=qe.slash+1,ct.add(Nt,Ft),j.add(ct);const Ct=new Xn(V.arrowWidth,V.arrowWidth,V.arrowLength),I=new xd(V.arrowHeadSize*.42,V.arrowHeadSize,4);I.rotateX(Math.PI/2);const yt=new Xn(V.arrowWidth*2.6,V.arrowWidth*.4,.1),Q=new Oo(V.arrowWidth*.45,V.arrowWidth*1.3,V.trailLength,6,1,!0);Q.rotateX(-Math.PI/2),Q.translate(0,0,-V.trailLength/2);const rt=Array.from({length:10},()=>{const Z=new Re,It=new vn({color:V.arrowColor,transparent:!0}),Ot=new vn({color:V.arrowHeadColor,transparent:!0}),ie=new Uh({map:Et,color:V.arrowColor,transparent:!0,opacity:.85,blending:Vi,depthWrite:!1}),oe=new vn({color:V.arrowTrailColor,map:bt,transparent:!0,opacity:0,blending:Vi,depthWrite:!1,side:Ke}),C=new Me(Ct,It),G=new Me(I,Ot);G.position.z=V.arrowLength/2+V.arrowHeadSize*.42;const it=new Me(yt,Ot),at=new Me(yt,Ot);it.position.z=-V.arrowLength/2+.08,at.position.z=it.position.z,at.rotation.z=Math.PI/2;const q=new $f(ie);q.scale.setScalar(V.arrowGlowSize),q.renderOrder=qe.projectileGlow;const wt=new Me(Q,oe);return wt.renderOrder=qe.projectileTrail,C.renderOrder=qe.projectile,G.renderOrder=qe.projectile,it.renderOrder=qe.projectile,at.renderOrder=qe.projectile,Z.add(C,G,it,at,q,wt),Z.visible=!1,r.add(Z),{group:Z,shaftMat:It,tipMat:Ot,glowMat:ie,trailMat:oe,glow:q,trail:wt,arrowId:0,bone:null}}),Dt=new yd(1,0),Tt=new H(V.boltShapeX,V.boltShapeY,V.boltShapeZ),qt=new vn({color:V.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),he=new Uh({map:Et,color:V.boltGlowColor,transparent:!0,opacity:.45,blending:Vi,depthWrite:!1}),de=new vn({color:V.boltGlowColor,map:bt,transparent:!0,opacity:V.trailOpacity,blending:Vi,depthWrite:!1,side:Ke}),ne=new Oo(.5,.03,V.boltTrailScale,6,1,!0);ne.rotateX(-Math.PI/2),ne.translate(0,0,-V.boltTrailScale/2);const Ee=Array.from({length:24},()=>{const Z=new Re,It=new Me(Dt,qt);It.scale.copy(Tt);const Ot=new $f(he);Ot.scale.setScalar(V.boltGlowScale),Ot.renderOrder=qe.projectileGlow;const ie=new Me(ne,de);return ie.renderOrder=qe.projectileTrail,It.renderOrder=qe.projectile,Z.add(It,Ot,ie),Z.visible=!1,r.add(Z),{group:Z,core:It}}),Ie=Array.from({length:6},()=>{const Z=_p({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:qe.groundArea});return Z.group.visible=!1,r.add(Z.group),Z}),Ye=lR(r,e,t,Pt),Te=y2(e.camera,e.smartCamera,e.zoom,a/s),Le=t.character.position;Te.update(Le.x,Le.y,Le.z,1,t.camera);function ze(Z){const It=Z.dummies.length;for(;L.length<It;){const ie=L.length,oe=Z.dummies[ie],C=k(oe,ie);L.push(C),U.push(C.group),tt.push(nt(oe)),dt.push(ut(oe)),X.push(st(oe)),Ut.push(0),Vt.push(0)}let Ot=!1;for(;L.length>It;){Ot=!0;const ie=L.pop();r.remove(ie.group),ie.dispose(),U.pop();const oe=tt.pop();r.remove(oe.mesh),oe.dispose();const C=dt.pop();r.remove(C.mesh),C.dispose();const G=X.pop();r.remove(G.mesh),G.dispose(),Ut.pop(),Vt.pop()}if(Ot)for(let ie=0;ie<It;ie++){const oe=Z.dummies[ie].id;L[ie].group.userData.dummyId!==oe&&L[ie].group.traverse(C=>{C.userData.dummyId=oe})}}function Mn(Z,It){if(U.length===0)return 0;const Ot=o.domElement.getBoundingClientRect(),ie=new Gt((Z-Ot.left)/Ot.width*2-1,-((It-Ot.top)/Ot.height)*2+1);D.setFromCamera(ie,Te.camera);const oe=D.intersectObjects(U,!0);for(const C of oe){const G=C.object.userData.dummyId;if(G&&G>0)return G}return 0}function Cn(Z,It,Ot){const ie=o.domElement.getBoundingClientRect(),oe=new H(Z,It,Ot).project(Te.camera);return{x:ie.left+(oe.x*.5+.5)*ie.width,y:ie.top+(-oe.y*.5+.5)*ie.height}}let ln=!1;return{balanceDebug(){return v.balanceDebug()},spineDebug(){return v.spineDebug()},gaitDebug(){return v.gaitDebug()},trailDebug(){return w.debug()},stretchDebug(){const Z=v.stretch();return{arm:Z.arm,leg:Z.leg,torso:Z.torso,impact:Z.impact}},swingDebug(){return v.swingDebug()},stanceDebug(){return v.stanceDebug()},bladeWorld(){return v.weaponBlade()},bladesWorld(){return v.bladesWorld()},slamDebug(){return Ye.slamDebug()},yawDebug(){var Z;return{target:_,shown:b.value,tauMs:((Z=e.renderInterp)==null?void 0:Z.yawSmoothMs)??0}},grassDebug(){return y.debug()},breakHits(){return p},destructibleDebug(){return g.debug()},fxDebug(){var Z,It;return{boxOpaque:h.every(Ot=>!Ot.transparent),boxCount:h.length,orders:{ring:Y.mesh.renderOrder,groundFx:Ye.groundOrder(),trail:w.object.renderOrder,slash:ct.renderOrder,projectile:((It=(Z=rt[0])==null?void 0:Z.group.children[0])==null?void 0:It.renderOrder)??-1}}},renderPose(){return{x:S.position.x,y:S.position.y,z:S.position.z,bodyYaw:S.rotation.y}},projectPoint(Z,It,Ot){return Cn(Z,It,Ot)},setClipT(Z){v.setClipT(Z)},weaponDebug(){return v.weaponDebug()},gripDebug(){return v.gripDebug()},render(Z,It){var $t;ze(Z);const Ot=Z.character,ie=Z.combat,oe=e.hitstop.enabled&&Z.combat.hitstop>0,C=It*Math.max(0,Math.min(4,ie.warp??1));if(oe&&!ln){const Qt=Math.max(0,Z.combat.hitstop),Mt=Math.max(0,Math.min(1,Qt/.1));Te.addShake(.34+Mt*.48);let jt=null;for(let Pe=0;Pe<Z.events.length;Pe++){const xe=Z.events[Pe];if(xe.type==="hit"){jt=xe;break}}jt&&Te.addKick(jt.x-Ot.position.x,jt.z-Ot.position.z,.03+Mt*.05)}ln=oe;for(let Qt=0;Qt<Z.events.length;Qt++){const Mt=Z.events[Qt];if(Mt.type!=="notify")continue;const jt=Number.isFinite(Mt.value)?Mt.value:0;if(Mt.name==="blade-air"){const Pe=Math.max(0,Math.min(1,jt));w.pulse((ie.weapon==="greatsword"?.9:.55)*(.4+.6*Pe))}}S.position.set(Ot.position.x,Ot.position.y,Ot.position.z),_=Ot.bodyYaw,S.rotation.y=b.update(_,It,(($t=e.renderInterp)==null?void 0:$t.yawSmoothMs)??0);const G=Z.dash.phase==="active"&&Z.dash.kind==="roll",it=G&&Z.dash.duration>0?Math.min(1,1-Z.dash.timer/Z.dash.duration):0;if(T.rotation.x=G?it*Math.PI*2:0,T.position.y=E-(G?.2*Math.sin(Math.PI*it):0),C>0&&v.update(Ot,ie,Z.playerHurt,C,Z.abilities.channeling,Z.time,Z.playerLink,Z.turnInPlace),w.update(C,C>0?v.weaponBlade():null,C>0&&(ie.phase==="active"||Z.playerLink.phase==="active"||G&&Z.dash.duration>0)),C>0)for(let Qt=0;Qt<L.length;Qt++)Z.dummies[Qt]&&L[Qt].update(Z.dummies[Qt],C,Z.time);const at=Te.camera.position,q=Math.atan2(at.x-Ot.position.x,at.z-Ot.position.z),wt=Z.config.gaze.hurtHoldSec,Bt=Z.time-Z.playerHurt.lastAt,Zt=wt>0&&Bt>=0&&Bt<wt?1-Bt/wt:0,Xt=uR(Z.gaze.active,Z.gaze.threat,Zt,Z.time,P);fR(At,Rt,vt,mt,Xt.level),pt=yR(Ot.grounded,Ot.position.y,pt),Y.mesh.position.set(Ot.position.x,pt+.028,Ot.position.z),Y.update(Xt.arcRad,Xt.opacity,Xt.scale,At,q);const ae=Z.config.abilities.arcane,re=Math.max(1,Math.floor(ae.waves)),Yt=Math.max(1e-4,ae.waveInterval),le=gR({charging:ie.charging,charge:ie.charge,channeling:Z.abilities.channeling,fireTimer:Z.abilities.fireTimer,fireInterval:Yt,channelProgress:Z.abilities.channeling?(Z.abilities.waveIndex+(1-Math.min(1,Math.max(0,Z.abilities.fireTimer/Yt))))/re:0,arcaneCooldown:Z.abilities.cooldown,arcaneCooldownMax:ae.cooldown,dashCooldown:Z.dash.cooldown,dashCooldownMax:Z.dash.kind==="blink"?Z.config.dash.blinkCooldown:Z.config.dash.rollCooldown});ht.mesh.position.set(Ot.position.x,Ot.position.y+.03,Ot.position.z),ht.set(le.ratio,le.source==="none"?0:P.meterOpacity,le.source==="charge"?kt:le.source==="channel"?F:R,q);const ee=Z.playerLink,ge=ee.weapon?Z.config.links.moves[ee.weapon]:void 0,Ne=xR(ee.phase,Ot.position.x,Ot.position.z,ee.facing,ee.travel,(ge==null?void 0:ge.hit.radius)??.9);N.set(Ne.x,Ne.z,Pt(Ne.x,Ne.z,Ot.position.y)+.042,Ne.radius,Ne.active?P.landingOpacity:0,Z.time);for(let Qt=0;Qt<tt.length;Qt++){const Mt=Z.dummies[Qt],jt=tt[Qt],Pe=dt[Qt],xe=X[Qt];if(!Mt){jt.mesh.visible=!1,Pe.mesh.visible=!1,xe.mesh.visible=!1;continue}const bn=Z.targeting.hasTarget&&Z.targeting.targetId===Mt.id;if(ov(Z,Mt)){const va=rv(Z,Mt);At.copy(vt).lerp(mt,va)}else At.copy(St);const _e=mR(Mt.attackPhase,Mt.attackPhaseTimer,Z.config.dummies.attackWindup);_e.active?(At.lerp(K,.5*_e.urgency),xe.mesh.position.set(Mt.position.x,Mt.position.y+.031,Mt.position.z),xe.set(_e.ratio,P.warnOpacity*(.65+.35*_e.urgency),K,q)):xe.set(0,0,K,q);const ue=bn?1:0,Ce=ue>Ut[Qt]?P.haloFadeInSec:P.haloFadeOutSec;Ut[Qt]=bp(Ut[Qt],ue,It,Ce);const He=Ut[Qt],un=1+.02*He*Math.sin(Z.time*2.2+Mt.id),Sn=P.arcDeg+(P.selectedArcDeg-P.arcDeg)*He;jt.mesh.position.set(Mt.position.x,Mt.position.y+.022,Mt.position.z),jt.update(Sn*Math.PI/180,P.opacity+(P.selectedOpacity-P.opacity)*He,1+(P.selectedScale-1)*He*un,At,q,1+(P.selectedThicknessScale-1)*He),Vt[Qt]=bp(Vt[Qt],ue,It,ue>Vt[Qt]?P.haloFadeInSec:P.haloFadeOutSec);const oi=Vt[Qt];Pe.mesh.position.set(Mt.position.x,Mt.position.y+.019,Mt.position.z),Pe.update(Sn*Math.PI/180,P.haloOpacity*oi*(.88+.12*Math.sin(Z.time*2.2+Mt.id)),P.selectedScale*(.94+.06*oi)*un,At,q)}ft.position.set(Ot.position.x,Ot.position.y,Ot.position.z),ft.rotation.y=ie.phase!=="idle"?ie.attackFacing:Ot.bodyYaw,Ye.update(Z,It,Qt=>Te.addShake(Qt));const fe=V.slashEnabled&&ie.phase==="active"&&ie.comboIndex>=3;Wt.opacity=fe?.7:0,gt.opacity=fe?V.slashGlowOpacity:0,fe&&(ct.rotation.z=-1.2+ie.attackProgress*3.2,ct.scale.setScalar(.9+ie.comboIndex*.13));for(let Qt=0;Qt<Ee.length;Qt++){const Mt=Z.abilities.projectiles[Qt],jt=Ee[Qt];jt.group.visible=!!Mt,Mt&&(jt.group.position.set(Mt.x,Mt.y,Mt.z),jt.group.scale.setScalar(Mt.radius),jt.group.rotation.set(0,Math.atan2(Mt.dirX,Mt.dirZ),0))}for(let Qt=0;Qt<Ie.length;Qt++){const Mt=Z.abilities.rings[Qt],jt=Ie[Qt];if(!Mt){jt.group.visible=!1;continue}const Pe=Math.max(0,Math.min(1,Mt.life/Math.max(Mt.duration,1e-6))),xe=vR(Math.max(0,Mt.duration-Mt.life),P.areaExpandSec);jt.set(Mt.x,Mt.z,Pt(Mt.x,Mt.z,Ot.position.y)+.045,Mt.radius*xe.scale,P.areaOpacity*(.35+.65*Pe)*xe.alpha,Z.time)}for(let Qt=0;Qt<rt.length;Qt++){const Mt=Z.arrows[Qt],jt=rt[Qt];if(!Mt){jt.group.visible=!1,jt.bone&&(r.attach(jt.group),jt.bone=null),jt.arrowId=0;continue}const Pe=Mt.stuck&&Mt.stuckDummy>=0;if(jt.arrowId!==Mt.id){if(jt.bone&&(r.attach(jt.group),jt.bone=null),jt.arrowId=Mt.id,jt.group.position.set(Mt.x,Mt.y,Mt.z),jt.group.rotation.set(Mt.pitch,Mt.yaw,0,"YXZ"),Pe){const bn=L[Mt.stuckDummy],_e=bn?bn.boneAtWorld(Mt.x,Mt.y,Mt.z):null;_e&&(_e.node.attach(jt.group),jt.bone=_e.node)}}else jt.bone||(jt.group.position.set(Mt.x,Mt.y,Mt.z),jt.group.rotation.set(Mt.pitch,Mt.yaw,0,"YXZ"));jt.group.visible=!0;const xe=Mt.stuck?Math.min(1,Mt.rest/.6):1;jt.shaftMat.opacity=xe,jt.tipMat.opacity=xe,jt.glowMat.opacity=(Mt.stuck?.28:.85)*xe,jt.trailMat.opacity=Mt.stuck?0:V.trailOpacity*xe,jt.trail.visible=!Mt.stuck}if(y.update(Z,It),g.update(Z.destructibles),ie.phase==="active"||Z.playerLink.phase==="active"){const Qt=g.computeHits(Z.destructibles,v.bladesWorld());for(let Mt=0;Mt<Qt.length;Mt++){let jt=!1;for(let Pe=0;Pe<p.length;Pe++)if(p[Pe].id===Qt[Mt].id){jt=!0;break}jt||p.push(Qt[Mt])}}else p=[];Te.update(Ot.position.x,Ot.position.y,Ot.position.z,It,Z.camera),o.render(r,Te.camera)},resize(){const Z=Math.max(1,n.clientWidth),It=Math.max(1,n.clientHeight);o.setSize(Z,It,!1),Te.resize(Z/It)},getGroundBasis(){return Te.getGroundBasis()},setCollidersVisible(Z){for(const It of h)It.opacity=Z?.3:1,It.wireframe=Z,It.transparent=Z,It.depthWrite=!Z,It.needsUpdate=!0},setGridVisible(Z){u.visible=Z},setLabVisible(Z){m.setVisible(Z)},setLabLabelsVisible(Z){m.setLabelsVisible(Z)},snapCamera(Z,It,Ot){Te.snap(Z,It,Ot)},setZoom(Z){Te.setZoom(Z)},setBodyType(Z){var Ot;const It=(Ot=e.bodyTypes)==null?void 0:Ot[Z];return!It||Z===x||(T.remove(v.group),v.dispose(),v=M(It),v.group.position.y=-E,T.add(v.group),w.reset(),x=Z,t.config.characterHeight=It.height,It.radius!==void 0&&(t.config.characterRadius=It.radius)),x},bodyTypes(){return{id:x,ids:Object.keys(e.bodyTypes??{})}},pickDummy:Mn,dummyRenderCount:()=>L.length,projectToScreen:Cn,dummyRigDebug(Z){const It=L[Z-1];return It!=null&&It.debug?It.debug():null},diagnostics(){const Z=C0(e.camera.pitchDeg),It=_R(Z,ft.rotation.y);return{lean:v.lean(),slashNormal:It,arrowForward:v.arrowDirection(),gait:{hipYaw:v.hipYaw(),gaitYaw:v.gaitYaw()},attackBlend:v.attackBlend(),attackWeights:v.attackWeights(),landing:v.landing(),hurt:v.hurt(),ik:v.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:T.rotation.x,activeRings:Ye.activeDash(),lastKind:Ye.dashKind()},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...Te.smart(),shake:Te.shakeLevel(),kick:Te.kickLevel(),kickCount:Te.kickCount()}}},dispose(){v.dispose(),m.dispose(),y.dispose(),g.dispose();for(const Z of L)Z.dispose();Y.dispose();for(const Z of tt)Z.dispose();for(const Z of dt)Z.dispose();ht.dispose(),w.dispose();for(const Z of X)Z.dispose();N.dispose(),$.dispose(),Wt.dispose(),gt.dispose(),Dt.dispose(),qt.dispose(),he.dispose(),de.dispose(),ne.dispose();for(const Z of Ie)Z.dispose();Ct.dispose(),I.dispose(),yt.dispose(),Q.dispose();for(const Z of rt)Z.shaftMat.dispose(),Z.tipMat.dispose(),Z.glowMat.dispose(),Z.trailMat.dispose();Et.dispose(),bt.dispose(),Ye.dispose(),f.traverse(Z=>{Z instanceof Me&&Z.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function UR(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function NR(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function OR(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=M=>e.querySelector(`#${M}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,m=0;function y(){const M=n.status();a.textContent=M.enabled?`已记录 ${M.durationS.toFixed(1)}s · ${M.frames} 帧 · 事件 ${M.events} · 异常 ${M.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=M.enabled?"暂停记录":"继续记录"}function g(M){d=M,e.hidden=!M,M?y():s.hidden=!0}function p(M){o.textContent=M,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",M=>{M.preventDefault(),M.stopPropagation(),g(!d)}),h.addEventListener("click",()=>g(!1)),f.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const M=n.summary();UR(M).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=M,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const M=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);NR(`harness-${M.meta.version}-${x}.json`,JSON.stringify(M)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,y(),p("已清空")}),c.addEventListener("click",()=>{u=!u,n.setEnabled(u),y()}),{tick(){const M=n.status();t==null||t.classList.toggle("is-alert",M.alert),d&&y()},isOpen:()=>d,close:()=>g(!1)}}const BR={intents:{...Tp},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function HR(){var ht;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Yv(P_,Us),i=FR(n,e,gn,Us.stations),a=Jv(e),s=ub(t),o=fb(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.69 · 11-09 21:29 · 诊断");const l=X=>String(X).padStart(2,"0"),c=new Date,h=Ry({meta:{version:"v0.9.69",buildTime:"11-09 21:29",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=OR(h,r),d=lb({deadZone:()=>gn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0,phaseSource:()=>i.gaitDebug().phase});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:gn.showColliders,showGrid:gn.showGrid,showLab:gn.lab.enabled,showLabLabels:gn.lab.showLabels};let m=1,y=!1;const g=xy({maxRadiusPx:()=>gn.joystick.maxRadiusPx,deadZone:gn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>gn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let M=e.combat.weapon;function x(X){if(X===M)return;M=X;const N=ma.indexOf(X)+1;for(const At of p)At.classList.toggle("is-active",Number(At.dataset.weapon)===N);E.refreshWeapon()}let v=BR,w=0;const S=()=>{m=1,i.setZoom(1)},E=G_(e,gn,u,{singleStep:()=>a.singleStep(v.intents),reset:()=>{m=1,a.singleStep({...Tp,resetPressed:!0})},resetZoom:S,onToggleColliders:X=>i.setCollidersVisible(X),onToggleGrid:X=>i.setGridVisible(X),onToggleLab:X=>i.setLabVisible(X),onToggleLabLabels:X=>i.setLabLabelsVisible(X),setFighterMode:X=>{for(const N of e.dummies)N.weapon&&(N.mode=X,N.attackPhase="idle",N.attackPhaseTimer=0,N.attackProgress=0,N.attackCooldown=0,N.combat&&(N.combat.phase="idle",N.combat.attackProgress=0,N.combat.comboIndex=0))}}),T=W_({stations:Xi.stations,plots:Lu,world:e,view:i,onResetZoom:S,onPlotTest:X=>{Vl(e);const N=Vx(e,X);return D(`已在「${X.name}」生成 ${N} 人 · 点「清除测试单位」回基线`),N},onClearTestUnits:()=>{const X=Vl(e);return D(X>0?`已清除 ${X} 个测试单位`:"当前没有测试单位"),X}});o.register({motion:d,debug:E.gui}),window.addEventListener("resize",()=>i.resize());const b=i.bodyTypes().ids,_=document.getElementById("body-toggle"),A=X=>{var N,At;return((At=(N=gn.bodyTypes)==null?void 0:N[X])==null?void 0:At.name)??X},k=()=>{if(!_)return;const X=i.bodyTypes().id;_.textContent=`体型 ${A(X)}`,_.setAttribute("aria-label",`切换体型（当前：${A(X)}，快捷键 B）`)},L=document.createElement("div");L.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(L);let U=0;const D=X=>{L.textContent=X,L.style.opacity="1",window.clearTimeout(U),U=window.setTimeout(()=>{L.style.opacity="0"},1600)},P=()=>{if(b.length<2){D("只有一个体型预设");return}const X=i.bodyTypes().id,N=Math.max(0,b.indexOf(X)),At=i.setBodyType(b[(N+1)%b.length]);k(),D(`体型：${A(At)}（B / 顶部胶囊切换）`)};k(),_==null||_.addEventListener("click",P);const O=document.getElementById("wind-toggle"),B=()=>{var X;return(X=e.config.grass)==null?void 0:X.wind},W=()=>{var N;if(!O)return;const X=!!((N=B())!=null&&N.enabled);O.textContent=`风：${X?"开":"关"}`,O.classList.toggle("is-off",!X),O.setAttribute("aria-label",`${X?"关闭":"开启"}风吹麦浪（当前${X?"开启":"关闭"}，快捷键 G）`)},et=()=>{const X=B();if(!X){D("本场景未启用草块");return}X.enabled=!X.enabled,W(),D(`风吹麦浪：${X.enabled?"开":"关"}（G 切换）`)};W(),O==null||O.addEventListener("click",et),window.addEventListener("keydown",X=>{X.repeat||(X.code==="KeyB"?P():X.code==="KeyG"&&et())}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:gn,debug:u,getUserZoom:()=>m,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),dummyRigDebug:X=>i.dummyRigDebug(X),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:st,applied:tt,enabled:Y,skip:dt}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),fxDebug:()=>i.fxDebug(),grassDebug:()=>i.grassDebug(),breakDebug:()=>({version:"v0.9.69",count:e.destructibles.length,broken:e.destructibles.filter(X=>X.broken!==0).length,cuts:e.destructibles.map(X=>({id:X.id,kind:X.kind,broken:X.broken,cutU:X.cutU,theta:X.theta,nx:X.nx,ny:X.ny,nz:X.nz,standU:X.standU,fragments:X.fragments.length,height:X.height})),rendered:i.destructibleDebug()}),breakTest:(X,N,At=1,Rt=0,St=0)=>Xv(e,X,N,At,Rt,St),resetBreaks:()=>(cm(e),e.destructibles.length),breakHits:()=>i.breakHits(),windDebug:()=>{var N;const X=i.grassDebug().wind;return{configured:!!((N=B())!=null&&N.enabled),rendered:X.enabled,time:X.time,gust:X.gust}},setWind:X=>{const N=B();return N?(N.enabled=!!X,W(),N.enabled):!1},setRenderInterp:X=>(Y=!!X,Y),renderHold:()=>y,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(X,N,At)=>i.projectPoint(X,N,At),setBodyType:X=>{const N=i.setBodyType(X);return k(),N},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var X;return Object.keys(((X=gn.animation.swing)==null?void 0:X.clips)??{})},preview:X=>{const N=e.combat,At={...N};N.weapon=X.weapon,N.phase="active",N.comboIndex=Math.max(1,Math.min(3,Math.floor(X.comboIndex))),N.attackProgress=Math.max(0,Math.min(1,X.progress)),N.attackFacing=e.character.bodyYaw,i.setClipT(typeof X.t=="number"?X.t:null);const Rt=Math.max(1,Math.min(30,Math.floor(X.warm??12)));y=!0;for(let St=0;St<Rt;St++)i.render(e,1/60);return i.setClipT(null),Object.assign(N,At),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:X=>{e.character.bodyYaw=X},zoom:X=>{m=Ru(X,1,gn.zoom.min,gn.zoom.max),i.setZoom(m)},release:()=>{y=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),plotDebug:()=>({version:"v0.9.69",count:Xi.plots.length,diagnostics:Xi.diagnostics,testUnits:Wx(e),dummies:e.dummies.length,rendered:i.dummyRenderCount(),plots:Xi.plots.map(X=>({id:X.id,index:X.index,placement:X.placement,slot:X.slot,centerX:X.centerX,centerZ:X.centerZ,spawnX:X.station.spawnX,spawnZ:X.station.spawnZ,hasTest:!!X.testSpawn}))}),spawnAt:X=>T.spawnAt(X),clearSpawned:()=>T.clearSpawned(),lab:{stations:Xi.stations,plots:Lu,goto:X=>T.goto(X),current:()=>T.current(),recall:()=>T.recall(),spawnAt:X=>T.spawnAt(X),clearSpawned:()=>T.clearSpawned()}};let lt=performance.now(),pt=60,Pt=0,Y=((ht=gn.renderInterp)==null?void 0:ht.enabled)??!0,nt=Au(e),ut=null,st=1,tt=!1,dt="";function Ut(X){const N=Y&&!u.paused&&u.timeScale>0;if(tt=!1,dt="",!N)return dt="off",st=1,e;if(!ut)return dt="noprev",st=1,e;if(!ty(ut,nt))return dt="key",st=1,e;const At=a.alpha;return st=At,At>=.999?(dt="alpha",e):(tt=!0,ny(e,ey(ut,nt,At)))}function Vt(X){const N=Math.min((X-lt)/1e3,.1);lt=X,N>0&&(pt=pt*.9+1/N*.1);const At=g.sample();At.intents.resetPressed&&(m=1),m=Ru(m,At.zoomScale,gn.zoom.min,gn.zoom.max),i.setZoom(m);let Rt=At.intents.dummyClickId;if(At.tap){const mt=i.pickDummy(At.tap.x,At.tap.y);mt>0&&(Rt=mt)}Rt>0&&(w=Rt),v={...At,intents:{...At.intents,dummyClickId:w,breakHits:i.breakHits()}};const St=a.frame(N,v.intents,u.timeScale,u.paused,()=>{const mt=e.events;for(let kt=0;kt<mt.length;kt++)h.event(mt[kt],e.time);ut=nt,nt=Au(e)});St>0&&(w=0),h.sample(e,v,N*1e3,St);for(const mt of v.gestures)h.gesture(mt);X-Pt>250&&(Pt=X,f.tick()),x(e.combat.weapon),y||i.render(Ut(),N),T.tick(),d.update(e,v,i.getGroundBasis());const vt=i.diagnostics();s.update(e,pt,St,v,u,{attackBlend:vt.attackBlend,attackWeights:vt.attackWeights,landing:vt.landing,hurt:vt.hurt,ik:vt.ik,zoom:vt.camera.zoom},o.hudCompact()),requestAnimationFrame(Vt)}requestAnimationFrame(Vt)}HR();

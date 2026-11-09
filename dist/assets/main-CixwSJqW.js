(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const xa=["sword-shield","dual-swords","greatsword","staff","bow"],wg=["wander","follow","keep-distance","attack","idle"],Rp=["spar","wander","follow","keep-distance","attack","idle"],Pp={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},Yr=1e-6;function ko(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Yr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>Yr?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Eg(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Yr){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>Yr)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Ye=1e-6,ua=Math.PI/180,Vh=-1e9;function Cp(){return{type:"none",lastAt:Vh,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function So(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Qd(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function Xh(n,t,e){var c,h;const i=e.duration>0?e.duration:hc(n,e.type);if(t.kind==="player"){const f=n.playerHurt;if(Qd(f,e.type,i,e.dirX,e.dirZ),f.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Ye){const d=e.knockback*n.config.hits.knockbackDecay;f.knockX=e.dirX*d,f.knockZ=e.dirZ*d}So(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(Qd(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Ye){const f=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*f,a.hurt.knockZ=e.dirZ*f}n.hitCount+=1,So(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((c=n.config.hits.hitstopByWeapon)==null?void 0:c[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const f=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[f])}o*=Math.max(0,e.holdMul??1);const l=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;l>0&&n.combat.hitstop<l&&(n.combat.hitstop=l,n.combat.warpPhase=1,n.combat.warp=(h=n.config.hits.hitstopWarp)!=null&&h.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,So(n,"hitstop",l,a.position))}function Vo(n,t,e){Xh(n,{kind:"dummy",index:t},e)}function Tg(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function hc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function $r(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function Lp(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function kp(n){var v,g;const t=n.combat,e=n.character.position,i={active:!1,x:e.x,z:e.z,facing:t.attackFacing,fx:Math.sin(t.attackFacing),fz:Math.cos(t.attackFacing),reach:0,cosArc:1,sweepActive:!1,sweepLo:0,sweepHi:0,slamRadius:0,slamX:e.x,slamZ:e.z};if(t.phase!=="active"||t.weapon==="bow")return i;const a=n.config.hits,s=n.config.combat.weapons[t.weapon],o=s==null?void 0:s.hitWindow,r=o?Math.min(1,Math.max(0,o.start)):0,l=o?Math.min(1,Math.max(r,o.end)):1,c=t.timings.active,h=c>Ye?Math.min(1,Math.max(0,t.phaseTimer/c)):1;if(h<r-Ye||h>l+Ye)return i;i.active=!0,i.reach=a.reach[t.weapon]??0,i.cosArc=Math.cos(Math.min(90,Math.max(0,a.arcDeg))*ua);const f=s==null?void 0:s.hitSweep,d=((v=f==null?void 0:f.byCombo)==null?void 0:v[String(t.comboIndex)])??((g=f==null?void 0:f.byCombo)==null?void 0:g["1"]),u=(f==null?void 0:f.tolDeg)??10;if(d){if(typeof d.stabU=="number"){if(h<d.stabU)return i.active=!1,i}else if(d.pts&&d.pts.length>=2){const m=$r(d.pts,0),y=$r(d.pts,h);i.sweepActive=!0,i.sweepLo=Math.min(m,y)-u,i.sweepHi=Math.max(m,y)+u}}const p=s==null?void 0:s.groundSlam;return p&&h>=p.slamU-Ye&&t.slamAttackId===t.attackId&&(i.slamRadius=Math.max(0,p.radius),i.slamX=e.x+i.fx*Math.min(i.slamRadius*.25,.5),i.slamZ=e.z+i.fz*Math.min(i.slamRadius*.25,.5)),i}function Ag(n,t,e,i){if(!n.active)return!1;const a=t-n.x,s=e-n.z,o=Math.sqrt(a*a+s*s);if(o>n.reach+i||o>Ye&&(a*n.fx+s*n.fz)/o<n.cosArc)return!1;if(n.sweepActive){const r=Lp(Math.atan2(a,s)/ua-n.facing/ua);if(r<n.sweepLo||r>n.sweepHi)return!1}return!0}function Rg(n,t,e,i){if(n.slamRadius<=0)return!1;const a=t-n.slamX,s=e-n.slamZ;return a*a+s*s<=(n.slamRadius+i)*(n.slamRadius+i)}function Pg(n){var S,E;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,l=t.timings.active,c=l>Ye?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(c<o-Ye||c>r+Ye)return;const h=e.reach[t.weapon]??0,f=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*ua),d=Math.sin(t.attackFacing),u=Math.cos(t.attackFacing),p=n.config.dummies.radius,v=n.config.targeting.idealRange,g=a==null?void 0:a.hitSweep,m=((S=g==null?void 0:g.byCombo)==null?void 0:S[String(t.comboIndex)])??((E=g==null?void 0:g.byCombo)==null?void 0:E["1"]),y=(g==null?void 0:g.tolDeg)??10;let x=0,M=0,w=!1;if(m){if(typeof m.stabU=="number"){if(c<m.stabU)return}else if(m.pts&&m.pts.length>=2){const T=$r(m.pts,0),b=$r(m.pts,c);x=Math.min(T,b)-y,M=Math.max(T,b)+y,w=!0}}for(const T of n.dummies){if(t.hitIds.indexOf(T.id)>=0)continue;const b=T.position.x-i.x,_=T.position.z-i.z,A=Math.hypot(b,_);if(A>h+p)continue;const k=A>Ye?b/A:d,L=A>Ye?_/A:u;if(A>Ye&&(b*d+_*u)/A<f)continue;if(w){const O=Lp(Math.atan2(b,_)/ua-t.attackFacing/ua);if(O<x||O>M)continue}let U="light";t.weapon==="greatsword"?U="knock":t.comboIndex>=3&&(U="heavy");const C=e.knockback[t.weapon]??0;let D=A;C>0&&(D=Math.max(A+C,v));const B=Math.max(0,D-A);Vo(n,n.dummies.indexOf(T),{type:U,duration:hc(n,U),dirX:k,dirZ:L,knockback:B}),t.hitIds.push(T.id)}}function Cg(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>Ye?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-Ye)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,l=Math.sin(t.attackFacing),c=Math.cos(t.attackFacing),h=n.config.dummies.radius,f=Math.max(0,i.radius),d=i.onlyUnhit!==!1,u=i.type??(t.weapon==="greatsword"?"knock":"heavy"),p=i.knockback??o.knockback[t.weapon]??0,v=n.config.targeting.idealRange,g=i.holdMul??1.6;for(let m=0;m<n.dummies.length;m++){const y=n.dummies[m];if(d&&t.hitIds.indexOf(y.id)>=0)continue;const x=y.position.x-r.x,M=y.position.z-r.z,w=Math.hypot(x,M);if(w>f+h)continue;const S=w>Ye?x/w:l,E=w>Ye?M/w:c,T=p>0?Math.max(w+p,v):w,b=Math.max(0,T-w);Vo(n,m,{type:u,duration:hc(n,u),dirX:S,dirZ:E,knockback:b,holdMul:g}),t.hitIds.push(y.id)}So(n,"ground-slam",f,{x:r.x+l*Math.min(f*.25,.5),y:r.y,z:r.z+c*Math.min(f*.25,.5)})}function Lg(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,f=c-r,d=h-l,u=f*f+d*d,p=Math.sin(i.facing),v=Math.cos(i.facing),g=Math.cos(tu(s.arcDeg,0,180)*ua),m=n.config.dummies.radius;for(let y=0;y<n.dummies.length;y++){const x=n.dummies[y];if(i.hitIds.indexOf(x.id)>=0)continue;const M=u>Ye?tu(((x.position.x-r)*f+(x.position.z-l)*d)/u,0,1):0,w=r+f*M,S=l+d*M,E=Math.hypot(x.position.x-w,x.position.z-S);let T=!1;if(s.shape==="circle")T=E<=s.radius+m;else if(s.shape==="capsule")T=E<=Math.max(s.radius,s.width)+m;else{const U=x.position.x-c,C=x.position.z-h,D=Math.hypot(U,C),B=D>Ye?(U*p+C*v)/D>=g:!0;T=D<=s.radius+m&&B||E<=s.width+m}if(!T)continue;const b=x.position.x-r,_=x.position.z-l,A=Math.hypot(b,_);if(A>Ye&&(b*p+_*v)/A<Math.cos(Math.max(s.arcDeg,90)*ua))continue;const k=A>Ye?b/A:p,L=A>Ye?_/A:v;Xh(n,{kind:"dummy",index:y},{type:s.type,duration:s.duration,dirX:k,dirZ:L,knockback:s.knockback}),i.hitIds.push(x.id),So(n,"link-hit",x.id,x.position)}}function kg(n){const t=n.config.hits,e=n.config.dummies.fighters,i=n.character.position;for(const a of n.events){if(a.type!=="dummy-hit")continue;const s=n.dummies[a.value-1];if(!s)continue;const o=s.weapon?t.reach[s.weapon]??t.dummyReach:t.dummyReach,r=i.x-s.position.x,l=i.z-s.position.z,c=Math.hypot(r,l);if(c>o)continue;const h=c>Ye?r/c:0,f=c>Ye?l/c:1,u=(s.weapon?Math.max(t.knockback[s.weapon]??0,t.dummyKnockback):t.dummyKnockback)*(s.weapon?(e==null?void 0:e.knockbackScale)??1:1),v=s.weapon==="greatsword"&&s.attackComboLeft<=0?"knock":"light";Xh(n,{kind:"player"},{type:v,duration:hc(n,v),dirX:h,dirZ:f,knockback:u,sourceId:s.id})}}function Dg(n,t){n.modules.hits&&(n.combat.phase==="active"&&(Pg(n),Cg(n)),Lg(n,t),kg(n))}function tu(n,t,e){return n<t?t:n>e?e:n}const Dp=Math.PI/180,Wh=1e-6;function Ig(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Zr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function Ip(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Wh?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function zp(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Wh)&&s<=Math.max(0,e.inputDeadZone)&&!o}function zg(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Fg(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!zp(n,t,e))return!1;const i=Ip(n,t,e.lookRange);if(i===null)return!1;const a=He(i-n.character.bodyYaw);return Math.abs(a)>Fp(n,e)}function Fp(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Dp}function Ug(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!zp(n,e,a)){Zr(n);return}const s=Ip(n,e,a.lookRange);if(s===null){Zr(n);return}const o=n.character,r=He(s-o.bodyYaw),l=Math.abs(r),c=Fp(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Wh;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(l,Math.max(0,a.settleDeg)*Dp);i.targetYaw=He(o.bodyYaw+i.dir*(l-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=He(i.targetYaw-i.fromYaw);o.bodyYaw=He(i.fromYaw+d*zg(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const fa=1e-6;function He(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Jo(n,t,e,i){const a=He(t-n);return n+a*(1-Math.exp(-Math.max(e,fa)*i))}function Qo(n,t,e,i,a){const o=He(t-n)*(1-Math.exp(-Math.max(e,fa)*a)),r=Math.max(i,0)*a;return r<=fa?n:n+Es(o,-r,r)}function eu(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,fa)*a)),o=Math.max(i,0)*a;return o<=fa?n+s:n+Es(s,-o,o)}function Es(n,t,e){return n<t?t:n>e?e:n}function nu(n,t,e,i){const a=He(t-n),s=Math.abs(a);return s<=i||s<=e?t:He(n+Math.sign(a)*Math.max(e,0))}function Ng(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>fa,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=ko(n,e);else if(c)i.facing=Qo(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(f)i.facing=ko(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,fa)){const _=Math.atan2(e.moveX,e.moveZ),A=a.facingTurnRate*Math.PI/180*t,k=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=nu(i.facing,_,A,k);else if(h>=a.facingMinMagnitude&&Math.abs(He(_-i.facing))>a.facingDeadbandDeg*Math.PI/180){const U=Jo(i.facing,_,a.facingSmoothRate,t);i.facing=nu(i.facing,U,A,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const p=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Fg(n,e)||(c?i.bodyYaw=Qo(i.bodyYaw,p,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Jo(i.bodyYaw,p,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let m=i.facing;if(o?m=c?n.gaze.mainYaw:i.facing:f?m=Math.atan2(e.aimX,e.aimZ):g&&(m=n.targeting.targetYaw),!o){const _=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(He(m-i.bodyYaw))>_&&(m=i.moveYaw)}const y=o||f||g,x=a.maxHeadTurnDeg*Math.PI/180;let M;if(y){const _=c?n.config.gaze.headTurnRate:a.headTurnRate;M=c?Qo(i.headYaw,m,_,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Jo(i.headYaw,m,_,t)}else{const _=He(i.headYaw-i.bodyYaw),A=He(m-i.bodyYaw),k=Math.abs(A)<Math.abs(_)-1e-9,L=k?n.config.gaze.headReturnRate:a.headTurnRate,U=k?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,C=Number.isFinite(U)?Qo(_,A,L,U,t):Jo(_,A,L,t);M=i.bodyYaw+C}const w=He(M-i.bodyYaw);w>x?M=i.bodyYaw+x:w<-x&&(M=i.bodyYaw-x),i.headYaw=M;const S=n.config.gaze;let E=0;if(c)E=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const _=n.dummies[n.targeting.targetId-1];if(_){const A=i.position.y+n.config.characterHeight*Es(S.eyeHeightRatio,0,1),k=_.position.y+n.config.dummies.height*Es(S.aimHeightRatio,0,1),L=Math.hypot(_.position.x-i.position.x,_.position.z-i.position.z);E=Math.atan2(k-A,Math.max(fa,L))}}const T=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;E=Es(E,-T,T);const b=y?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=eu(i.headPitch,E,b,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=eu(i.bodyPitch,i.headPitch*Es(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const Up=1e-6,dc=Math.PI/180;function uc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Og(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*dc,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);f<.001||f>s||Math.abs(He(Math.atan2(c,h)-t))>a||o.push({i:r,d:f})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function Bg(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Hg(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*dc,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=Og(n,e.channelYaw,t);for(let c=0;c<a;c++){const h=(c-(a-1)*.5)*s,f=e.channelYaw+h,d=(c-(a-1)*.5)*o,u=Math.sin(f),p=Math.cos(f);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+u*.5+Math.cos(f)*d,y:i.y+1,z:i.z+p*.5-Math.sin(f)*d,yaw:f,speed:t.speed*(1+(Bg(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}uc(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Gg(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*dc,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,uc(n,"projectile-fire",i.volleyId,o)}i.pending=a}function iu(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,uc(n,"channel-end",0,n.character.position))}function Vg(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){iu(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),uc(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=ko(n,e),o.fireTimer-=t;let f=0;for(;o.fireTimer<=0&&f++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Up),Hg(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){iu(n,i);break}}function Xg(n,t,e){const i=Math.max(0,e.homingConeDeg)*dc,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Up;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,f=c.position.z-t.z,d=Math.hypot(h,f);d<.001||d>r||Math.abs(He(Math.atan2(h,f)-s))>i||(o=l,r=d)}return o}function Wg(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=Xg(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),f=Math.atan2(r.dirX,r.dirZ),d=He(h-f),u=r.turnRate*t,p=Math.max(-u,Math.min(u,d)),v=f+p;r.dirX=Math.sin(v),r.dirZ=Math.cos(v)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(!(f*f+d*d>u*u)){Vo(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const Yg={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;Vg(n,t,e,s,a,i.cfg.slot),Gg(n,t,s),Wg(n,t,s)}},Nc=1e-6;function Np(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function $g(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),Np(n,"ring-place",i.id,e)}function Zg(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Nc),s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(f*f+d*d>u*u)continue;const p=Math.hypot(f,d),v=p>Nc?f/p:0,g=p>Nc?d/p:1;Vo(n,c,{type:"heavy",duration:e.stun,dirX:v,dirZ:g,knockback:e.knockback})}Np(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const qg={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&$g(n,s),Zg(n,t,s)}},jg={channelVolley:Yg,groundRing:qg};function Kg(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function Jg(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=jg[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function Qg(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Op(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function tx(n,t,e){Jg(n,t,e)}function zn(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const au=1e-6;function su(n,t,e){return n<t?t:n>e?e:n}function Bp(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Hp(n){const t=n.camera,e=Bp();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function ex(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,f=c.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=su((e.radius-d)/Math.max(au,e.radius-e.nearDistance),0,1);let p=u*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(p+=e.attackBoost*u),a+=p,s+=c.position.x*p,o+=c.position.z*p,r+=1}const l=a<=0?0:su(a/(a+Math.max(au,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,h=o/a;t.centroidX=c,t.centroidZ=h;let f=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function nx(n){const t=[],e=n.ground.size;t.push(is("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(is(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(is(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(is(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(is(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(is(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function is(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const Gp={cellSize:.5,originX:0,originZ:14,stepX:-4.5,stepZ:-4.5,columns:4,gap:.3,spawnDz:0,labelDz:-2.8,defaultRadius:2,defaultShape:"circle",defaultColor:"#7fd8c0",bounds:{minX:-13,maxX:13,minZ:-13,maxZ:14}};function ni(n){return Math.round(n*1e6)/1e6}function ix(n,t,e){return Math.hypot(n.x-t.x,n.z-t.z)<n.r+t.r+e}const ax=400;function sx(n,t=Gp){const e={duplicates:[],relocated:[],unplaced:[]},i=new Set,a=[];for(const u of n)if(!(!u||typeof u.id!="string"||u.id.length===0)){if(i.has(u.id)){e.duplicates.push(u.id);continue}i.add(u.id),a.push(u)}const s=[...a].sort((u,p)=>u.id<p.id?-1:u.id>p.id?1:0),o=[],r=[];for(const u of s){if(!u.anchor)continue;const p=ni(u.anchor.x),v=ni(u.anchor.z);r.push({def:u,centerX:p,centerZ:v}),o.push({x:p,z:v,r:u.radius??t.defaultRadius})}let l=0;for(const u of s)typeof u.index=="number"&&(l=Math.max(l,u.index));const c=[];let h=0;const f=(u,p,v,g,m,y)=>{const x=u.radius??t.defaultRadius,M=u.shape??t.defaultShape,w=u.color??t.defaultColor,S=u.spawn??{dx:0,dz:t.spawnDz},E=u.label??{dx:0,dz:t.labelDz},T={id:u.id,index:y,name:u.name,hint:u.hint,shape:M,x:ni(p),z:ni(v),radius:x,spawnX:ni(p+S.dx),spawnZ:ni(v+S.dz),labelX:ni(p+E.dx),labelZ:ni(v+E.dz),color:w},b=[];if(u.grass){const A=u.grass,k=A.absolute?0:Math.round(p/t.cellSize),L=A.absolute?0:Math.round(v/t.cellSize),U={minCellX:A.minCellX+k,maxCellX:A.maxCellX+k,minCellZ:A.minCellZ+L,maxCellZ:A.maxCellZ+L};A.density!==void 0&&(U.density=A.density),A.clearMarginCells!==void 0&&(U.clearMarginCells=A.clearMarginCells),b.push(U)}const _=[];if(u.destructibles)for(const A of u.destructibles)_.push({id:A.id,kind:A.kind,x:ni(p+A.dx),y:A.y??0,z:ni(v+A.dz),height:A.height,radius:A.radius,tiltDeg:A.tiltDeg,pitchGain:A.pitchGain,maxTiltDeg:A.maxTiltDeg,fallSec:A.fallSec,bands:A.bands?[...A.bands]:void 0,color:A.color,cutColor:A.cutColor,seed:A.seed,targetId:A.targetId});return{id:u.id,index:y,name:u.name,hint:u.hint,owner:u.owner??"",centerX:T.x,centerZ:T.z,placement:g,slot:m,shape:M,radius:x,color:w,station:T,grassPlots:b,destructibles:_,testSpawn:u.testSpawn}};for(const u of r)c.push(f(u.def,u.centerX,u.centerZ,"pinned",-1,u.def.index??++l));for(const u of s){if(u.anchor)continue;const p=u.radius??t.defaultRadius;let v=-1,g=0,m=0,y=0;for(let x=h;x<ax;x++){const M=x%t.columns,w=Math.floor(x/t.columns),S=ni(t.originX+M*t.stepX),E=ni(t.originZ+w*t.stepZ),T=t.bounds;if(T&&(S<T.minX||S>T.maxX||E<T.minZ||E>T.maxZ)){y++;continue}const b={x:S,z:E,r:p};if(o.some(_=>ix(b,_,t.gap))){y++;continue}v=x,g=S,m=E;break}if(v<0){e.unplaced.push(u.id);continue}y>0&&e.relocated.push(u.id),o.push({x:g,z:m,r:p}),h=v+1,c.push(f(u,g,m,"auto",v,u.index??++l))}c.sort((u,p)=>u.index-p.index);const d=[...c].sort((u,p)=>u.id<p.id?-1:u.id>p.id?1:0);return{plots:c,stations:c.map(u=>u.station),grassPlots:c.flatMap(u=>u.grassPlots),destructibles:d.flatMap(u=>u.destructibles),diagnostics:e}}const Yi=1e-6;function qr(n,t,e){return n<t?t:n>e?e:n}function Do(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+Yi||c.maxY<i-o-Yi||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function Vp(n,t,e,i,a=0,s=.05){let o=Number.NEGATIVE_INFINITY;for(const r of n)r.maxY>i+s||t<r.minX||t>r.maxX||e<r.minZ||e>r.maxZ||r.maxY>o&&(o=r.maxY);return o===Number.NEGATIVE_INFINITY?a:o}function Yh(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+Yi||l.minY>=o-Yi)continue;const c=qr(t.x,l.minX,l.maxX),h=qr(t.z,l.minZ,l.maxZ),f=t.x-c,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(s=!0,u>Yi*Yi){const p=Math.sqrt(u),v=(e-p)/p;t.x+=f*v,t.z+=d*v}else{const p=t.x-l.minX,v=l.maxX-t.x,g=t.z-l.minZ,m=l.maxZ-t.z,y=Math.min(p,v,g,m);y===p?t.x=l.minX-e:y===v?t.x=l.maxX+e:y===g?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function $h(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Yi||o.minY>=s-Yi)continue;const r=qr(t.x,o.minX,o.maxX),l=qr(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-Yi)return!0}return!1}const la=1e-6,Fs=Math.PI/180;function Zh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Il(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Xp(n){n.arrows.length=0}function ox(n,t,e,i,a,s,o,r,l,c,h){const f=i-n,d=s-e,u=f*f+d*d;let p=0;u>la&&(p=((o-n)*f+(r-e)*d)/u,p=Math.max(0,Math.min(1,p)));const v=n+f*p,g=e+d*p,m=v-o,y=g-r;if(m*m+y*y>h*h)return-1;const x=t+(a-t)*p;return x<l-.1||x>l+c?-1:p}function rx(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=la)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*Fs,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+la;for(const h of n.dummies){if(!n.modules.dummies)break;const f=h.position.x-a.x,d=h.position.z-a.z,u=Math.hypot(f,d);if(!(u<.001||u>i)){if(h.id===r)return h.id;Math.abs(Zh(Math.atan2(f,d)-t))>s||u<c&&(l=h.id,c=u)}}return l}function cx(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*Fs;return t+Ps(Zh(s-t),-o,o)}function lx(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*Fs),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*Fs),a<=0)return r;const l=n.dummies.find(v=>v.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(la,s),f=l.position.y+n.config.dummies.height*Ps(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),u=(f-e+.5*d*h*h)/h,p=Ps(u,-s*.45,s*.92);return{vy:p,horizontal:Math.sqrt(Math.max(0,s*s-p*p))}}function hx(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=rx(n,e),l=cx(n,e,r),c=Math.sin(l),h=Math.cos(l),f=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,u=o.y+.95,p=lx(n,f,u,d,r,s),v={id:++n.arrowSeq,x:f,y:u,z:d,vx:c*p.horizontal,vy:p.vy,vz:h*p.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*Fs};return n.arrows.push(v),Il(n,"arrow-shot",a,v),v}function Ps(n,t,e){return n<t?t:n>e?e:n}function dx(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const M=n.dummies[c.stuckDummy];if(M){const w=Math.cos(M.bodyYaw),S=Math.sin(M.bodyYaw);c.x=M.position.x+c.offX*w+c.offZ*S,c.y=M.position.y+c.offY,c.z=M.position.z-c.offX*S+c.offZ*w,c.yaw=M.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,f=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const M=n.dummies.find(w=>w.id===c.targetId);if(!M)c.targetId=0;else{const w=Math.hypot(c.vx,c.vz);if(w>la){const S=Math.atan2(M.position.x-c.x,M.position.z-c.z),E=Math.atan2(c.vx,c.vz),T=c.turnRate*t,b=E+Ps(Zh(S-E),-T,T);c.vx=Math.sin(b)*w,c.vz=Math.cos(b)*w;const _=Math.hypot(M.position.x-c.x,M.position.z-c.z);if(_>.3){const A=_/w,L=(M.position.y+s*Ps(i.aimHeightRatio,0,1)-c.y+.5*r*A*A)/A,U=Math.max(0,i.verticalTurnRate)*t;c.vy+=Ps(L-c.vy,-U,U)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const u=h+c.vx*t,p=f+c.vy*t,v=d+c.vz*t;let g=-1,m=2;if(o)for(let M=0;M<n.dummies.length;M++){const w=n.dummies[M],S=ox(h,f,d,u,p,v,w.position.x,w.position.z,w.position.y,s,a+i.radius);S>=0&&S<m&&(m=S,g=M)}if(g>=0){const M=n.dummies[g];c.x=h+(u-h)*m,c.y=f+(p-f)*m,c.z=d+(v-d)*m,c.stuck=!0,c.stuckDummy=g;const w=Math.cos(M.bodyYaw),S=Math.sin(M.bodyYaw),E=c.x-M.position.x,T=c.z-M.position.z;c.offX=E*w-T*S,c.offZ=E*S+T*w,c.offY=c.y-M.position.y;const b=Math.atan2(c.vx,c.vz);c.localYaw=b-M.bodyYaw,c.yaw=b,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const _=Math.hypot(c.vx,c.vz);Vo(n,g,{type:"light",duration:.22,dirX:_>la?c.vx/_:0,dirZ:_>la?c.vz/_:1,knockback:.14}),Il(n,"arrow-land",M.id,c),l.push(c);continue}const y=Do(n.boxes,u,v,p+.4,.04,0,6),x=Number.isFinite(y)?y:0;if(p<=x+.02&&c.vy<0){c.x=u,c.y=x+Math.max(0,i.groundStickLift),c.z=v,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const M=Math.atan2(-c.vy,Math.max(la,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(M,Math.max(0,i.stickMinPitchDeg)*Fs),c.rest=Math.max(.2,i.stickSec),Il(n,"arrow-land",-1,c),l.push(c);continue}c.x=u,c.y=p,c.z=v,l.push(c)}n.arrows=l}const zl=1e-6,ux=Math.PI/180;function Fl(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function qh(n,t,e){return n<t?t:n>e?e:n}function fc(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Ul(n){const t=n.id,e=n.windowId;Object.assign(n,fc()),n.id=t,n.windowId=e}function fx(n){Ul(n)}function Wp(n){Ul(n.playerLink);for(const t of n.dummies)Ul(t.link)}function px(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Nl(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function jr(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,fc()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function mx(n,t){const e=n.config.links.search,i=n.character.position,a=qh(e.maxAngleDeg,0,180)*ux;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);if(f<zl||f>e.range)continue;const d=Math.atan2(c,h);Math.abs(He(d-t))>a||f<r&&(r=f,s=l.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function gx(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=ko(n,t),l=mx(n,r),c=l.id>0?l.yaw:r,h=l.id>0?qh(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Fl(n,"link-start",s.id)}function xx(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){jr(n);return}if(e.weapon!==n.combat.weapon){jr(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Fl(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Fl(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?qh(r/o,0,1):1,e.phase==="active"&&i.active>zl){const l=Math.max(0,e.travel-e.travelled),c=Math.max(zl,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function vx(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&jr(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&Nl(n,"sprint"),a.prevSprinting=r,xx(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&gx(n,e,l,o.weapon)}const Fr={windup:0,active:1,recovery:2},ou=1e-9;function Yp(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function yx(n){return n==="windup"||n==="active"||n==="recovery"}function Mx(n,t){return Fr[n]+Yp(t)}function _x(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!yx(s.at))continue;const o=Yp(s.u??0),r=Fr[s.at]+o;r>i+ou&&r<=e+ou&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>Fr[s.at]+s.u-(Fr[o.at]+o.u)),a}const Io=1e-6;function ha(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function bx(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function $p(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function pc(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=$p()}function Zp(n){return{weapon:xa[Math.max(0,n-1)]??xa[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:$p()}}function Sx(n,t){return ko(n,t)}function wx(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function qp(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=Sx(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,ha(n,"attack-start",i)}function jp(n){return Math.max(0,n.config.combat.settle)}function Ol(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];qp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:jp(n),lunge:wx(n,i.lunge[e-1]??0)},e)}function ru(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,qp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:jp(n),lunge:i.lunge},0),hx(n,e,n.combat.attackFacing),ha(n,"charge-release",e)}function Ex(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),l=a+(1-a)*r;if(e.warp=l,e.warpDebt+=t*(1-l),o>=1){e.warpPhase=3,e.warpTimer=0;const c=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,c)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function Tx(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=Ex(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const h=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<h)break;if(i.phaseTimer-=h,i.phase==="windup")i.phase="active",ha(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,ha(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const f=n.config.combat.weapons[i.weapon];f.comboCount>0&&Ol(n,e,i.comboIndex<f.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const h=i.timings.recovery;if(h>Io&&i.phaseTimer>=h*n.config.combat.cancelWindow){i.queued=!1;const f=n.config.combat.weapons[i.weapon];f.comboCount>0&&Ol(n,e,i.comboIndex<f.comboCount?i.comboIndex+1:1)}}const l=a.windup+a.active+a.recovery;let c=0;i.phase==="windup"?c=i.phaseTimer:i.phase==="active"?c=a.windup+i.phaseTimer:i.phase==="recovery"?c=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(c=l),i.phase!=="idle"&&(i.attackProgress=l>0?Math.min(1,c/l):1),Ax(n)}function Ax(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>Io?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:Mx(t.phase,a);if(s<=t.notifyCursor+Io)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of _x(o,t.notifyCursor,s))bx(n,r.name,r.value);t.notifyCursor=s}function Rx(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=xa.length){const l=xa[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,pc(n),jr(n),ha(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,ha(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),Tx(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Ol(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,ha(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,Io)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,ru(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?ru(n,e,l):ha(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>Io)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),f=g=>c*(1-Math.pow(1-Math.min(1,Math.max(0,g/l)),h+1)),d=t*i.warp,u=Math.min(l,Math.max(0,i.phaseTimer)),p=Math.min(l,Math.max(0,i.phaseTimer-d));let v=Math.max(0,f(u)-f(p))/Math.max(d,1e-4);v=Math.min(v,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*v,n.impulse.z=Math.cos(i.attackFacing)*v}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const ln=1e-6,Bl=Math.PI*2,Px=7,Cx=18,Kp=1.3,Jp=.4,Lx=.9,cu=.9;function lu(n,t,e,i){const a=Math.max(e,.1),s=((n+t*2.37)%a+a)%a,o=Math.min(Math.max(i,0),1)*a;if(o<=ln||s>=o)return 0;const r=Math.min(Math.max(a*.12,.15),o*.5),l=Math.min(1,Math.min(s/r,(o-s)/r));return l*l*(3-2*l)}function kx(n,t){const e=Math.hypot(n,t);return e<=1?{x:n,z:t}:{x:n/e,z:t/e}}function Dx(n){return Math.atan2(Math.sin(n),Math.cos(n))}function hu(n,t,e,i){return n+Dx(t-n)*(1-Math.exp(-Math.max(e,ln)*i))}function Kr(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Ix(n){var i;const t=[];for(let a=0;a<n.count;a++){const s=n.spawn[a]??{x:0,z:0},o=n.initialModes[a]??"idle";t.push(Hl(a+1,o,s.x,s.z,null))}const e=n.fighters;if(e)for(let a=0;a<e.weapons.length;a++){const s=e.spawn[a]??{x:0,z:0},o=((i=e.initialModes)==null?void 0:i[a])??"spar",r=e.attackInterval*(.25+.22*a);t.push(Hl(t.length+1,o,s.x,s.z,e.weapons[a],r))}return t}function Hl(n,t,e,i,a,s=0){return{id:n,mode:t,initialMode:t,homeX:e,homeZ:i,position:{x:e,y:0,z:i},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:e,targetZ:i,wanderTimer:0,attackCooldown:s,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,attackComboIndex:0,attackComboLeft:0,comboGap:0,hurt:Cp(),link:fc(),weapon:a,combat:a?{...Zp(xa.indexOf(a)+1),weapon:a}:null}}function zx(n,t=!1){const e=t?Rp:wg,i=e.indexOf(n);return e[(i+1)%e.length]}function Qp(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0,i.attackComboIndex=0,i.attackComboLeft=0,i.comboGap=0;const o=i.hurt;if(o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,fx(i.link),i.combat){const r=i.combat;r.phase="idle",r.comboIndex=0,r.phaseTimer=0,r.attackProgress=0,r.attackFacing=0,r.charging=!1,r.charge=0,r.hitstop=0,r.warp=1,r.warpPhase=0,r.warpDebt=0,r.warpTimer=0,r.hitIds.length=0,r.timings={windup:0,active:0,recovery:0,settle:0,lunge:0}}}n.dummyAttackCount=0}function Fx(n,t,e){const i=zn(n)*Bl,a=Math.sqrt(zn(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+zn(n)*.8)}function jh(n,t,e){if(t.weapon){const i=n.config.combat.weapons[t.weapon];if(i)return{windup:i.windup,active:i.active,recovery:i.recovery}}return{windup:e.attackWindup,active:e.attackActive,recovery:e.attackRecovery}}function Gl(n,t,e){var s;if(!t.weapon)return e.attackRange;const i=n.config.hits.reach[t.weapon]??e.attackRange,a=((s=e.fighters)==null?void 0:s.attackRangeScale)??.9;return Math.max(.4,i*a)}function Vl(n,t){return n.weapon&&t.fighters?t.fighters.attackInterval:t.attackInterval}function Ux(n,t){return n.weapon&&t.fighters?Math.max(t.leashRadius,t.fighters.leashRadius):t.leashRadius}function Nx(n,t,e){const i=jh(e,n,t);return n.attackPhase==="windup"?i.windup:n.attackPhase==="active"?i.active:n.attackPhase==="recovery"?i.recovery:0}function Ox(n,t,e){var s;if(!t.weapon)return 1;const i=((s=e.fighters)==null?void 0:s.comboCount)??0;if(i>0)return Math.max(1,Math.round(i));const a=n.config.combat.weapons[t.weapon];return Math.max(1,Math.round((a==null?void 0:a.comboCount)??1))}function Bx(n,t){var i;const e=((i=t.fighters)==null?void 0:i.comboGap)??0;return e>0?e:Math.max(0,n.config.combat.settle)}function Hx(n){return n.attackPhase!=="idle"||n.attackComboLeft>0}function Gx(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0,du(n,t,i);return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const l=Math.max(Nx(t,i,n),ln);if(t.attackPhaseTimer<l)break;t.attackPhaseTimer-=l,t.attackPhase==="windup"?(t.attackPhase="active",Kr(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0,t.attackComboLeft>0?t.comboGap=Bx(n,i):(t.attackComboIndex=0,t.weapon&&t.attackCooldown<=0&&(t.attackCooldown=Vl(t,i)*Jp)))}const s=jh(n,t,i),o=s.windup+s.active+s.recovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=s.windup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=s.windup+s.active+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||o<=0?0:Math.min(1,r/o),du(n,t,i)}function du(n,t,e){const i=t.combat;if(!i)return;const a=jh(n,t,e),s=t.attackPhase==="idle"&&t.attackComboLeft>0&&t.comboGap>0;i.weapon=t.weapon??i.weapon,i.phase=s?"settle":t.attackPhase,i.comboIndex=t.attackComboIndex,i.phaseTimer=t.attackPhaseTimer,i.attackProgress=s?1:t.attackProgress,i.attackFacing=t.facing,i.timings={windup:a.windup,active:a.active,recovery:a.recovery,settle:0,lunge:0},i.hitstop=0,i.warp=1,i.warpPhase=0,i.charging=!1,i.charge=0}function Vx(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>ln?a/o:0,l=o>ln?s/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,p=Math.hypot(d,u);(t.wanderTimer<=0||p<.3)&&Fx(n,t,e);const v=t.targetX-t.position.x,g=t.targetZ-t.position.z,m=Math.hypot(v,g);m>ln&&(c=v/m,h=g/m)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance,u=Math.max(e.keepDeadZone,.2),p=Math.max(-1,Math.min(1,d/u))*cu,v=lu(n.time,t.id,e.strafePeriod,e.strafeDuty)*e.keepStrafe;c=r*p-l*v,h=l*p+r*v}else if(t.mode==="attack")o>Gl(n,t,e)&&t.attackPhase==="idle"&&(c=r,h=l);else if(t.mode==="spar"){const d=Gl(n,t,e),u=d*1.7;if(Hx(t))o>d*Kp?(c=r,h=l):o<d*.55&&(c=-r*.6,h=-l*.6);else if(t.attackPhase==="idle"&&t.attackCooldown<=0&&o>d)c=r,h=l;else{const v=Math.max(-1,Math.min(1,(o-u)/.5))*cu,g=lu(n.time,t.id,e.strafePeriod,e.strafeDuty)*Lx;c=r*v-l*g,h=l*v+r*g}}({x:c,z:h}=kx(c,h));let f=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>ln&&(f=Math.atan2(c,h)):o>ln&&(f=Math.atan2(r,l)),e.leashRadius>ln&&t.mode!=="wander"&&t.mode!=="idle"){const d=Ux(t,e),u=t.position.x-t.homeX,p=t.position.z-t.homeZ,v=Math.hypot(u,p);if(v>d){const g=Math.min(1,(v-d)/Math.max(d*.5,.5)),m=-u/v,y=-p/v;c=c*(1-g)+m*g,h=h*(1-g)+y*g;const x=Math.hypot(c,h);x>ln&&(c/=x,h/=x)}}return{x:c,z:h,facing:f}}function Xx(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.comboGap=Math.max(0,e.comboGap-t),e.hurt.timer>0&&(e.attackComboLeft=0,e.comboGap=0),(e.mode==="attack"||e.mode==="spar")&&e.attackPhase==="idle"&&e.hurt.timer<=0){const y=n.character.position,x=Math.hypot(y.x-e.position.x,y.z-e.position.z),M=Gl(n,e,i);if(e.attackComboLeft>0)e.comboGap<=0&&(x<=M*Kp+ln?(e.attackComboIndex+=1,e.attackComboLeft-=1,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,n.dummyAttackCount+=1,Kr(n,"dummy-attack",e)):(e.attackComboLeft=0,e.attackComboIndex=0,e.attackCooldown=Math.max(e.attackCooldown,Vl(e,i)*Jp)));else if(e.attackCooldown<=0&&x<=M+ln){const w=Ox(n,e,i);e.attackComboIndex=1,e.attackComboLeft=Math.max(0,w-1),e.comboGap=0,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=Vl(e,i),n.dummyAttackCount+=1,Kr(n,"dummy-attack",e)}}Gx(n,e,t,i);const a=Vx(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-ln||a.x<0&&e.position.x<=s.minX+ln)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-ln||a.z<0&&e.position.z<=s.minZ+ln)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,ln)*t),r=e.weapon&&i.fighters?i.fighters.moveSpeed:i.moveSpeed;e.velocity.x+=(a.x*r-e.velocity.x)*o,e.velocity.z+=(a.z*r-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=hu(e.bodyYaw,e.facing,Px,t),e.headYaw=hu(e.headYaw,e.facing,Cx,t);const l=e.position.x,c=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const h=n.config.stepHeight;if(Yh(n.boxes,e.position,i.radius,i.height,h))if($h(n.boxes,e.position,i.radius,i.height,h))e.position.x=l,e.position.z=c,e.velocity.x=0,e.velocity.z=0;else{const y=e.position.x-l,x=e.position.z-c;Math.abs(y)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const d=n.config.worldBounds;e.position.x<d.minX?(e.position.x=d.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>d.maxX&&(e.position.x=d.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<d.minZ?(e.position.z=d.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>d.maxZ&&(e.position.z=d.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const u=Do(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,h,Number.POSITIVE_INFINITY);u>Number.NEGATIVE_INFINITY&&u<=e.position.y+h+ln&&(e.position.y=u);const p=Math.hypot(e.position.x-l,e.position.z-c);e.distance+=p;const v=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,v/Math.max(n.config.moveSpeed,ln)),m=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),ln);e.stride=m,e.gaitPhase=(e.gaitPhase+p/m*Bl)%Bl}function Wx(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=zx(a.mode,!!a.weapon),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,a.attackComboIndex=0,a.attackComboLeft=0,a.comboGap=0,a.combat&&(a.combat.phase="idle",a.combat.attackProgress=0,a.combat.comboIndex=0),Kr(n,"dummy-mode",a)}for(const a of n.dummies)Xx(n,t,a,i)}const Yx=["idle","attack","keep-distance"],$x=["sword-shield","dual-swords","greatsword"];function Xl(n,t){const e=n.dummies.length,i=n.dummies.filter(a=>a.spawnedByPlot?t!==void 0&&a.spawnedByPlot!==t:!0);n.dummies=i;for(let a=0;a<n.dummies.length;a++)n.dummies[a].id=a+1;return e-n.dummies.length}function Zx(n,t){var d,u;const e=t.testSpawn??{},i=Math.max(0,Math.floor(e.dummies??0)),a=Math.max(0,Math.floor(e.fighters??0));Xl(n,t.id);const s=i+a;if(s===0)return 0;const o=Math.max(.4,e.ringRadius??1.6),r=e.startDeg??-90,l=e.modes??Yx,c=e.weapons??((d=n.config.dummies.fighters)==null?void 0:d.weapons)??$x,h=((u=n.config.dummies.fighters)==null?void 0:u.attackInterval)??3.4,f=[];for(let p=0;p<s;p++){const v=(r+360*p/s)*Math.PI/180,g=t.centerX+Math.cos(v)*o,m=t.centerZ+Math.sin(v)*o,y=p>=i,x=p-i,M=y?"spar":l[p%l.length],w=y?c[x%c.length]:null,S=y?h*(.25+.22*x):0,E=Hl(n.dummies.length+f.length+1,M,g,m,w,S);E.spawnedByPlot=t.id,f.push(E)}return n.dummies.push(...f),f.length}function qx(n){let t=0;for(const e of n.dummies)e.spawnedByPlot&&t++;return t}const Wl=1e-6;function Oc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function jx(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function tm(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function uu(n,t,e){return n<t?t:n>e?e:n}function Kx(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=s.x,f=s.z;for(;c<l-Wl;){const d=Math.min(l,c+r),u=s.x+t*d,p=s.z+e*d,v=uu(u,o.minX,o.maxX),g=uu(p,o.minZ,o.maxZ),m={x:v,y:s.y,z:g};if($h(n.boxes,m,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=v,f=g,c=d,v!==u||g!==p))break}return{x:h,z:f}}function Jx(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Nl(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&Oc(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&pc(n));const l=Eg(n,e),c=l.x,h=l.z,f=n.combat.weapon==="staff";if(i.kind=f?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=f?a.blinkCooldown:a.rollCooldown,f){const d=Kx(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Nl(n,"blink"),Oc(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Wl,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,Oc(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(Wl,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const hi=1e-6,fu=Math.PI*2;function pu(n,t){return Math.sqrt(n*n+t*t)}function tr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Qx(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,pc(n)}function tv(n,t,e){const i=n.character,a=n.config,s=Do(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,pc(n),Wp(n),tm(n),Op(n),Xp(n),Zr(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Vh,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function ev(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=pu(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&s.x>=h.maxX-hi||r<0&&s.x<=h.minX+hi)&&(r=0),(l>0&&s.z>=h.maxZ-hi||l<0&&s.z<=h.minZ+hi)&&(l=0);const f=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",u=n.dash.phase==="active",p=f||u||d;a.sprinting=!p&&e.sprintHeld&&c>hi;const v=i.combat.weapons[n.combat.weapon];let g=v?v.moveMultiplier:1;u||d?g=0:f?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const m=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const L=p?i.skillDecel:c>hi?i.acceleration:i.friction,U=1-Math.exp(-L*t);o.x+=(r*m-o.x)*U,o.z+=(l*m-o.z)*U}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,tr(n,"jumped",i.jumpSpeed)),n.events.some(L=>L.type==="blink"&&L.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,M=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Yh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if($h(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=M,o.x=0,o.z=0;else{const L=s.x-x,U=s.z-M;Math.abs(L)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(U)<Math.abs(o.z*t)*.5&&(o.z=0)}tr(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=Do(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+hi&&S-s.y<=i.stepHeight+hi&&(s.y=S,o.y=0,tr(n,"stepUp",S));const E=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const T=Do(n.boxes,s.x,s.z,E,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&s.y<=T&&o.y<=0?(s.y=T,o.y=0,a.grounded||tr(n,"landed",T),a.grounded=!0):a.grounded=!1;const b=pu(s.x-x,s.z-M);a.distance+=b;const _=b/Math.max(t,hi),A=Math.min(i.strideSpeedCap,_/Math.max(i.moveSpeed,hi)),k=Math.max(i.strideLength*(1+A*i.strideSpeedGain),hi);a.stride=k,a.gaitPhase=(a.gaitPhase+b/k*fu)%fu}const Yl=1e-6,mu=2.399963229728653;function Na(n,t,e){return n<t?t:n>e?e:n}function gu(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,h=t.z-n.z,f=Math.hypot(c,h),d=e+i;if(f>=d)return;let u,p,v;f<Yl?(u=r,p=l,v=d):(u=c/f,p=h/f,v=d-f);const g=v+o;n.x-=u*g*a,n.z-=p*g*a,t.x+=u*g*s,t.z+=p*g*s}function nv(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*mu;gu(e[f].position,e[d].position,s,s,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*mu;gu(i,e[f].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)Yh(n.boxes,h.position,s,n.config.dummies.height,l),h.position.x=Na(h.position.x,c.minX,c.maxX),h.position.z=Na(h.position.z,c.minZ,c.maxZ)}function iv(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=Na(r.minScale,0,1);if(l<Yl||c<=0||h>=1)return 1;const f=a+o,d=Na(r.approachDot,0,.99);let u=0;for(const p of s){const v=p.position.x-n,g=p.position.z-t,m=Math.hypot(v,g);if(m>=f+c)continue;if(m<Yl){u=1;continue}const y=(e*v+i*g)/(l*m);if(y<=d)continue;const x=Na(1-(m-f)/c,0,1),M=Na((y-d)/(1-d),0,1);u=Math.max(u,x*M)}return 1-(1-h)*Na(u,0,1)}function av(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=iv(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Bc=1e-6,sv=Math.PI/180;function ov(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function rv(n,t,e){return n<t?t:n>e?e:n}function cv(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>Bc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>Bc&&(o=Math.atan2(e.moveX,e.moveZ));const l=rv(i.maxAngleDeg,0,180)*sv;let c=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const p=u.position.x-s.x,v=u.position.z-s.z,g=Math.hypot(p,v);if(g<Bc||g>i.range)continue;const m=Math.atan2(p,v),y=Math.abs(He(m-o));if(y>l)continue;const x=g-i.frontBias*Math.cos(y);x<c&&(c=x,h=u.id,f=m,d=g)}a.targetId=h,a.targetYaw=f,a.targetDist=d,a.hasTarget=h>0}const wi=1e-6;function Ts(n,t,e){return n<t?t:n>e?e:n}function xu(n){return Math.atan2(Math.sin(n),Math.cos(n))}function lv(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(L,U)=>{const C=L.position.x-s.x,D=L.position.z-s.z,B=Math.hypot(C,D);if(B<wi||B>U)return 0;const O=Ts((U-B)/Math.max(wi,U-i.nearDistance),0,1);let X=O*(i.modeWeight[L.mode]??.5);return L.attackPhase==="active"&&(X+=i.attackBoost*O),X},r=[];let l=0,c=!1,h=!1,f=!1;for(const L of n.dummies){const U=o(L,i.threatRange),C=L.position.x-s.x,D=L.position.z-s.z,B=Math.hypot(C,D);U>0&&(r.push({id:L.id,x:L.position.x,z:L.position.z,dx:C,dz:D,yaw:Math.atan2(C,D),w:U}),l+=U,B<=i.approachDist&&(i.modeWeight[L.mode]??.5)>=i.hostileModeWeight&&(f=!0)),B>wi&&B<=i.recoveryDist&&(c=!0),(L.attackPhase==="windup"||L.attackPhase==="active")&&B<=i.threatRange&&(h=!0)}const d=l<=0?0:Ts(l/(l+Math.max(wi,i.saturation)),0,1),u=r.length>0,p=a.active,v=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),g=i.hurtHoldSec>wi&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,m=p&&(c||g);if(a.active=v||m,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((L,U)=>U.w-L.w);const y=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],M=Math.atan2(x.dx,x.dz),w=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let E=0,T=0,b=0;for(const L of y){const U=Math.abs(xu(L.yaw-M))/Math.PI;let C=L.w/(1+Math.max(i.spreadFalloff,0)*U*U);L!==x&&i.behindFalloff<1&&Math.abs(xu(L.yaw-S))>w&&(C*=Math.max(i.behindFalloff,0)),E+=L.x*C,T+=L.z*C,b+=C}a.mainId=x.id,a.mainYaw=M;const _=n.dummies.find(L=>L.id===x.id),A=(_?_.position.y:0)+n.config.dummies.height*Ts(i.aimHeightRatio,0,1),k=s.y+n.config.characterHeight*Ts(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(A-k,Math.max(wi,Math.hypot(x.dx,x.dz))),a.centroidYaw=b>wi?Math.atan2(E/b-s.x,T/b-s.z):M,a.threatCount=r.length,a.threat=d}function hv(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function dv(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<wi||a>e.threatRange)return 0;const s=Math.max(wi,e.threatRange-e.nearDistance),o=Ts((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(wi,e.modeWeight.attack??1.5);return Ts(r/l,0,1)}const Wa=1e-6,Us=Math.PI*2,zo={enabled:!1,dirDeg:0,speed:0,amplitude:0,wavelength:4,secondWave:{wavelength:2,amplitude:0,speedScale:1},gust:{periodSec:8,depth:0},jitter:0,shadeAmount:0};function em(n){var t;return((t=n==null?void 0:n.grass)==null?void 0:t.wind)??zo}function mc(n){return{time:0,gust:1-Math.min(1,Math.max(0,n.gust.depth))}}function uv(n,t,e){if(!t.enabled)return;n.time+=Math.max(0,e);const i=Math.max(.1,t.gust.periodSec),a=Math.min(1,Math.max(0,t.gust.depth));n.gust=1-a+a*(.5+.5*Math.sin(Us*n.time/i-Math.PI/2))}function fv(n,t,e,i){const a=n.dirDeg*Math.PI/180,s=t*Math.cos(a)+e*Math.sin(a),o=Us/Math.max(.1,n.wavelength),r=Us/Math.max(.1,n.secondWave.wavelength);return[o*s+i,r*s+i*1.7]}function nm(n){const t=n.dirDeg*Math.PI/180,e=Us/Math.max(.1,n.wavelength),i=Us/Math.max(.1,n.secondWave.wavelength);return{dirX:Math.cos(t),dirZ:Math.sin(t),omega1:e*n.speed,omega2:i*n.speed*n.secondWave.speedScale,amp1:n.amplitude,amp2:n.secondWave.amplitude,shadeAmount:n.shadeAmount}}const pv=.18,vu=.4,mv=.6;function gv(n,t,e){if(n<0)return 0;if(n===0)return 1;if(t<=0)return 0;const i=Math.min(1,Math.max(0,1-n/t)),a=Math.min(1,Math.max(0,e))*pv,s=Math.min(1,Math.max(0,(i-a)/(1-a)));return s*s*(3-2*s)}function xv(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function im(n,t){return n+","+t}function vv(n,t,e){return{spec:e??{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:0,bladesPerPatch:[0,0],avoidMargin:0,seed:0},cellSize:t.cellSize>0?t.cellSize:.5,bucketCells:(n==null?void 0:n.bucketCells)??4,blades:[],patches:[],buckets:{},cutCount:0,lastCutAt:0,wind:mc((n==null?void 0:n.wind)??zo)}}function yv(n,t,e,i){const a=t.grass,s=n.grass;if(!a||!s||!s.enabled)return vv(s,i,a);const o=i.cellSize>0?i.cellSize:.5,r=xv(a.seed),l=Math.max(1,Math.floor(s.footprintCells)),c=Math.max(1,s.bucketCells)*o,h=Math.max(o,s.minHeightCells*o),f=Math.max(h,s.maxHeightCells*o),[d,u]=a.bladesPerPatch,p=Math.max(0,Math.floor(d)),v=Math.max(p,Math.floor(u)),g=e.filter(T=>T.kind!=="ground").map(T=>({minX:T.minX-a.avoidMargin,maxX:T.maxX+a.avoidMargin,minZ:T.minZ-a.avoidMargin,maxZ:T.maxZ+a.avoidMargin})),m=[],y=[],x={},M=a.plots??[],w=(T,b)=>{const _=T+l/2,A=b+l/2;for(let k=0;k<M.length;k++){const L=M[k],U=Math.max(0,L.clearMarginCells??0);if(_>=L.minCellX-U&&_<=L.maxCellX+U&&A>=L.minCellZ-U&&A<=L.maxCellZ+U)return!0}return!1},S=(T,b,_)=>{const A=m.length;for(let k=0;k<_;k++){const L=(T+r()*l)*o,U=(b+r()*l)*o;let C=!1;for(let Rt=0;Rt<g.length;Rt++){const Z=g[Rt];if(L>=Z.minX&&L<=Z.maxX&&U>=Z.minZ&&U<=Z.maxZ){C=!0;break}}if(C)continue;const D=Vp(e,L,U,3,0,.05),B=h+(f-h)*r(),O=(B-h)/Math.max(Wa,f-h),X=Math.min(1,Math.max(0,r()*.68+O*.32)),it=m.length;m.push({id:it,x:L,y:D,z:U,yaw:r()*Us,height:B,width:o*.26,tone:X,lean:(r()-.5)*.24,bend:0,bendX:0,bendZ:0,targetBend:0,recover:0,cut:0,cutAt:0});const ht=im(Math.floor(L/c),Math.floor(U/c)),ft=x[ht];ft?ft.push(it):x[ht]=[it]}m.length>A&&y.push({id:y.length,cellX:T,cellZ:b,bladeFrom:A,bladeTo:m.length})},E=()=>p+Math.floor(r()*(v-p+1));for(let T=a.minCellZ;T+l<=a.maxCellZ;T+=l)for(let b=a.minCellX;b+l<=a.maxCellX;b+=l){const _=r();w(b,T)||_>a.density||S(b,T,E())}for(let T=0;T<M.length;T++){const b=M[T],_=Math.min(1,Math.max(0,b.density??1));for(let A=b.minCellZ;A+l<=b.maxCellZ;A+=l)for(let k=b.minCellX;k+l<=b.maxCellX;k+=l)r()>_||S(k,A,E())}return{spec:a,cellSize:o,bucketCells:s.bucketCells,blades:m,patches:y,buckets:x,cutCount:0,lastCutAt:0,wind:mc(s.wind??zo)}}function am(n,t,e,i){const a=Math.max(1,n.bucketCells)*n.cellSize,s=Math.floor((t-i)/a),o=Math.floor((t+i)/a),r=Math.floor((e-i)/a),l=Math.floor((e+i)/a),c=[];for(let h=s;h<=o;h++)for(let f=r;f<=l;f++){const d=n.buckets[im(h,f)];if(d)for(let u=0;u<d.length;u++)c.push(d[u])}return c}function Mv(n){const t=n.grass,e=n.config.grass;if(!t||!e||!e.enabled||!n.modules.grass)return 0;const i=kp(n);if(!i.active&&i.slamRadius<=0)return 0;const a=.02,s=Math.max(i.reach,i.slamRadius)+1;let o=0;const r=am(t,i.x,i.z,s);for(let l=0;l<r.length;l++){const c=t.blades[r[l]];if(c.cut!==0||!Ag(i,c.x,c.z,a)&&!Rg(i,c.x,c.z,a))continue;c.cut=e.regrow?Math.max(Wa,e.regrowSec):-1,c.cutAt=n.time;const h=c.x-i.x,f=c.z-i.z,d=Math.sqrt(h*h+f*f);c.bendX=d>Wa?h/d:i.fx,c.bendZ=d>Wa?f/d:i.fz,c.bend=Math.min(e.maxBendRad,.55),c.targetBend=0,o+=1}return o>0&&(t.cutCount+=o,t.lastCutAt=n.time,n.events.push({type:"grass-cut",tick:n.tick,x:i.x,y:n.character.position.y,z:i.z,value:o})),o}function _v(n,t){const e=n.grass,i=n.config.grass;if(!e||e.blades.length===0||!i||!i.enabled||!n.modules.grass)return;const a=em(n.config);e.wind||(e.wind=mc(a)),uv(e.wind,a,t);const s=e.blades,o=s.length,r=new Array(o).fill(0),l=Math.max(0,i.bendRadius)+n.config.characterRadius;for(let p=0;p<o;p++)s[p].targetBend=0;const c=n.character.position.x,h=n.character.position.z,f=(p,v)=>{const g=am(e,p,v,l);for(let m=0;m<g.length;m++){const y=g[m],x=s[y];if(x.cut!==0)continue;const M=x.x-p,w=x.z-v,S=Math.sqrt(M*M+w*w);if(S>l)continue;const E=1-S/l,T=i.maxBendRad*E*E;if(T>x.targetBend){x.targetBend=T;const b=S>Wa?1/S:0;x.bendX=S>Wa?M*b:0,x.bendZ=S>Wa?w*b:1,x.recover=0}r[y]=1}};if(f(c,h),n.modules.dummies)for(let p=0;p<n.dummies.length;p++)f(n.dummies[p].position.x,n.dummies[p].position.z);const d=1-Math.exp(-Math.max(0,i.bendRate)*t),u=1-Math.exp(-Math.max(0,i.recoverRate)*t);for(let p=0;p<o;p++){const v=s[p];v.bend+=(v.targetBend-v.bend)*(v.targetBend>v.bend?d:u),v.bend<1e-4&&(v.bend=0),!r[p]&&v.bend===0&&(v.recover+=t),v.cut>0&&(v.cut-=t,v.cut<=0&&(v.cut=0))}Mv(n)}function bv(n){const t=n.grass;if(!t)return;for(let i=0;i<t.blades.length;i++){const a=t.blades[i];a.bend=0,a.targetBend=0,a.bendX=0,a.bendZ=0,a.recover=0,a.cut=0,a.cutAt=0}t.cutCount=0,t.lastCutAt=0;const e=mc(em(n.config));t.wind.time=e.time,t.wind.gust=e.gust}const Sv=.55,wv=.5,Ev=.8,Tv=.25,Av=.004,Rv=.6,Pv=6,Cv=.8,Lv=1.6,as=.82,kv=.6;function Oe(n,t,e){return{x:n,y:t,z:e}}function Ha(n,t){return Oe(n.y*t.z-n.z*t.y,n.z*t.x-n.x*t.z,n.x*t.y-n.y*t.x)}function da(n,t){return n.x*t.x+n.y*t.y+n.z*t.z}function Ri(n,t,e,i,a,s,o){const r=2*(e*o-i*s),l=2*(i*a-t*o),c=2*(t*s-e*a);return Oe(a+n*r+(e*c-i*l),s+n*l+(i*r-t*c),o+n*c+(t*l-e*r))}function Dv(n,t,e,i,a,s,o,r){return[n*a-t*s-e*o-i*r,n*s+t*a+e*r-i*o,n*o-t*r+e*a+i*s,n*r+t*o-e*s+i*a]}function Iv(n,t,e,i){const a=i*.5,s=Math.sin(a);return[Math.cos(a),n*s,t*s,e*s]}function zv(n){const t=[];for(let e=0;e<8;e++){const i=e&1?n.hx:-n.hx,a=e&2?n.hy:-n.hy,s=e&4?n.hz:-n.hz,o=Ri(n.qw,n.qx,n.qy,n.qz,i,a,s);t.push(Oe(n.x+o.x,n.y+o.y,n.z+o.z))}return t}function yu(n,t){const e=Ri(n.qw,-n.qx,-n.qy,-n.qz,t.x,t.y,t.z),i=e.x>=0?n.hx:-n.hx,a=e.y>=0?n.hy:-n.hy,s=e.z>=0?n.hz:-n.hz,o=Ri(n.qw,n.qx,n.qy,n.qz,i,a,s);return Oe(n.x+o.x,n.y+o.y,n.z+o.z)}function Mu(n,t){const e=Ri(n.qw,n.qx,n.qy,n.qz,1,0,0),i=Ri(n.qw,n.qx,n.qy,n.qz,0,1,0),a=Ri(n.qw,n.qx,n.qy,n.qz,0,0,1);return n.hx*Math.abs(da(t,e))+n.hy*Math.abs(da(t,i))+n.hz*Math.abs(da(t,a))}function Fv(n,t){const e=[];for(let o=0;o<3;o++)e.push(Ri(n.qw,n.qx,n.qy,n.qz,o===0?1:0,o===1?1:0,o===2?1:0)),e.push(Ri(t.qw,t.qx,t.qy,t.qz,o===0?1:0,o===1?1:0,o===2?1:0));for(let o=0;o<3;o++)for(let r=0;r<3;r++){const l=Ri(n.qw,n.qx,n.qy,n.qz,o===0?1:0,o===1?1:0,o===2?1:0),c=Ri(t.qw,t.qx,t.qy,t.qz,r===0?1:0,r===1?1:0,r===2?1:0),h=Ha(l,c);if(h.x===0&&h.y===0&&h.z===0)continue;const f=Math.hypot(h.x,h.y,h.z);e.push(Oe(h.x/f,h.y/f,h.z/f))}const i=Oe(t.x-n.x,t.y-n.y,t.z-n.z);let a=null,s=-1/0;for(const o of e){const r=Mu(n,o),l=Mu(t,o),c=da(i,o),h=r+l-Math.abs(c);if(h<=0)return null;h>s&&(s=h,a=c<0?Oe(-o.x,-o.y,-o.z):Oe(o.x,o.y,o.z))}return a?{axis:a,depth:s}:null}function Uv(n,t){const e=n.a,i=n.b,a=i?i.invMass:0,s=i?i.invInertia:0,o=e.invMass+a;if(o===0)return;const r=Oe(n.p.x-e.x,n.p.y-e.y,n.p.z-e.z),l=i?Oe(n.p.x-i.x,n.p.y-i.y,n.p.z-i.z):Oe(0,0,0),c=Oe(e.vx+(e.wy*r.z-e.wz*r.y),e.vy+(e.wz*r.x-e.wx*r.z),e.vz+(e.wx*r.y-e.wy*r.x)),h=i?Oe(i.vx+(i.wy*l.z-i.wz*l.y),i.vy+(i.wz*l.x-i.wx*l.z),i.vz+(i.wx*l.y-i.wy*l.x)):Oe(0,0,0),f=Oe(c.x-h.x,c.y-h.y,c.z-h.z),d=da(f,n.n),u=Ha(r,n.n),p=i?Ha(l,n.n):Oe(0,0,0),v=e.invInertia*(u.x*u.x+u.y*u.y+u.z*u.z)+s*(p.x*p.x+p.y*p.y+p.z*p.z),g=o+v;if(g<=0)return;let m=0;d<0&&(m=-(1+(-d>kv?t:0))*d/g,_u(e,i,n.n,r,l,m));const y=Oe(e.vx+(e.wy*r.z-e.wz*r.y),e.vy+(e.wz*r.x-e.wx*r.z),e.vz+(e.wx*r.y-e.wy*r.x)),x=i?Oe(i.vx+(i.wy*l.z-i.wz*l.y),i.vy+(i.wz*l.x-i.wx*l.z),i.vz+(i.wx*l.y-i.wy*l.x)):Oe(0,0,0),M=Oe(y.x-x.x,y.y-x.y,y.z-x.z),w=Oe(M.x-n.n.x*da(M,n.n),M.y-n.n.y*da(M,n.n),M.z-n.n.z*da(M,n.n)),S=Math.hypot(w.x,w.y,w.z);if(S>1e-5){const E=w.x/S,T=w.y/S,b=Oe(E,T,w.z/S),_=Ha(r,b),A=i?Ha(l,b):Oe(0,0,0),k=e.invInertia*(_.x*_.x+_.y*_.y+_.z*_.z)+s*(A.x*A.x+A.y*A.y+A.z*A.z),L=o+k;if(L>0){let U=-S/L;const C=(e.friction+(i?i.friction:e.friction))*.5*Math.max(0,m);U>C&&(U=C),U<-C&&(U=-C),_u(e,i,b,r,l,U)}}m>Tv&&(e.rest&&(e.rest=0,e.restT=0),i&&i.rest&&(i.rest=0,i.restT=0))}function Nv(n){const t=n.a,e=n.b,i=e?e.invMass:0,a=t.invMass+i;if(a===0)return;const s=Math.max(n.depth-Av,0)*Rv;if(s<=0)return;const o=t.invMass/a,r=i/a;t.x+=n.n.x*s*o,t.y+=n.n.y*s*o,t.z+=n.n.z*s*o,e&&(e.x-=n.n.x*s*r,e.y-=n.n.y*s*r,e.z-=n.n.z*s*r)}function _u(n,t,e,i,a,s){n.vx+=e.x*s*n.invMass,n.vy+=e.y*s*n.invMass,n.vz+=e.z*s*n.invMass;const o=Ha(i,e);if(n.wx+=n.invInertia*(o.x*s),n.wy+=n.invInertia*(o.y*s),n.wz+=n.invInertia*(o.z*s),t){t.vx-=e.x*s*t.invMass,t.vy-=e.y*s*t.invMass,t.vz-=e.z*s*t.invMass;const r=Ha(a,e);t.wx-=t.invInertia*(r.x*s),t.wy-=t.invInertia*(r.y*s),t.wz-=t.invInertia*(r.z*s)}}function Ov(n,t,e,i){for(const o of n){if(o.invMass===0||o.rest)continue;o.vy-=i*t,o.x+=o.vx*t,o.y+=o.vy*t,o.z+=o.vz*t;const r=1/(1+Cv*t),l=1/(1+Lv*t);o.vx*=r,o.vy*=r,o.vz*=r,o.wx*=l,o.wy*=l,o.wz*=l;const c=Math.hypot(o.wx,o.wy,o.wz);if(c>1e-9){const[h,f,d,u]=Iv(o.wx/c,o.wy/c,o.wz/c,c*t),[p,v,g,m]=Dv(h,f,d,u,o.qw,o.qx,o.qy,o.qz),y=1/Math.hypot(p,v,g,m);o.qw=p*y,o.qx=v*y,o.qy=g*y,o.qz=m*y}}const a=[],s=new Array(n.length).fill(!1);for(let o=0;o<n.length;o++){const r=n[o];if(r.invMass===0)continue;const l=zv(r);for(const c of l){const h=e-c.y;h>0&&(s[o]=!0,a.push({a:r,b:null,n:Oe(0,1,0),p:c,depth:h}))}for(let c=o+1;c<n.length;c++){const h=Fv(r,n[c]);if(!h)continue;const f=yu(r,h.axis),d=yu(n[c],Oe(-h.axis.x,-h.axis.y,-h.axis.z)),u=Oe((f.x+d.x)*.5,(f.y+d.y)*.5,(f.z+d.z)*.5);s[o]=!0,s[c]=!0,a.push({a:r,b:n[c],n:Oe(-h.axis.x,-h.axis.y,-h.axis.z),p:u,depth:h.depth})}}for(let o=0;o<Pv;o++)for(const r of a)Uv(r,Math.min(r.a.restitution,r.b?r.b.restitution:r.a.restitution));for(const o of a)Nv(o);for(let o=0;o<n.length;o++){const r=n[o];if(r.invMass===0)continue;const l=r.hx+r.hy+r.hz,c=Math.hypot(r.vx,r.vy,r.vz)+l*Math.hypot(r.wx,r.wy,r.wz);s[o]&&c<Ev&&(r.vx*=as,r.vy*=as,r.vz*=as,r.wx*=as,r.wy*=as,r.wz*=as),c<Sv?(r.restT+=t,r.restT>=wv&&!r.rest&&(r.rest=1,r.vx=r.vy=r.vz=0,r.wx=r.wy=r.wz=0)):r.restT=0}}const Ei=1e-6,bu=Math.PI/180,va=.08,Bv=12,Hv=.6,Su=2.4,Gv=1.6,Hc=5,wu=2,Vv=2.2,sm=.28,om=.7;function Ti(n,t,e){return n<t?t:n>e?e:n}function Xv(n,t,e,i,a,s,o,r){const l=Math.max(Ei,e),c=Ti(r.minU??va,0,1),h=Ti(r.maxU??.92,0,1);let f=Ti((n-t)/l,c,h);const d=r.bands;if(d&&d.length>0){let L=d[0],U=Math.abs(L-f);for(let C=1;C<d.length;C++){const D=Math.abs(d[C]-f);D<U&&(L=d[C],U=D)}f=Ti(L,c,h)}const u=Math.sqrt(a*a+s*s+o*o),p=u>Ei?a/u:0,v=u>Ei?s/u:0,g=u>Ei?o/u:1,m=Math.sqrt(p*p+g*g),y=m>Ei?p/m:0,x=m>Ei?g/m:1,M=r.pitchGain??.85,w=Ti(r.maxTiltDeg??62,0,89)*bu,S=Math.max(0,-v);let E=Math.min(w,Ti(r.tiltDeg,0,89)*bu+S*M);const T=f*l,b=Math.min(T,l-T),_=Math.atan(Math.max(0,b*.9)/Math.max(Ei,i));E=Math.min(E,_);const A=Math.tan(E),k=1/Math.sqrt(1+A*A);return{u:f,theta:E,nx:y*A*k,ny:k,nz:x*A*k,ax:x,ay:0,az:-y}}function Wv(n,t,e,i,a,s){const o=t*e,r=1/Math.max(Ei,a),l=(c,h)=>Ti(o-(i*c+s*h)*r,0,e);return[l(-n,-n),l(n,-n),l(n,n),l(-n,n)]}function Yv(n){return!n||n.length===0?[]:n.map(t=>{const e=t.seed??$v(t.id),i=t.kind==="cactus"?Zv(t.height,t.radius):[],a=t.color??(t.kind==="cactus"?"#3f8f4f":t.kind==="button"?"#8a8a8a":"#8a6b4a"),s=t.cutColor??(t.kind==="cactus"?"#bfe8b0":t.kind==="button"?"#ff5a5a":"#e8c9a0");return{id:t.id,kind:t.kind,x:t.x,y:t.y,z:t.z,height:t.height,radius:t.radius,tiltDeg:t.tiltDeg??18,pitchGain:t.pitchGain??.85,maxTiltDeg:t.maxTiltDeg??62,fallSec:t.fallSec??.9,bands:t.bands?[...t.bands]:[],color:a,cutColor:s,broken:0,standU:1,snx:0,sny:1,snz:0,cutU:1,theta:0,nx:0,ny:1,nz:0,ax:0,ay:0,az:-1,brokenAt:0,fragments:[],seed:e,arms:i,targetId:t.targetId,hitArmed:!1}})}function rm(n,t,e){const i=2*n*(2*t)*(2*e),s=1/Math.max(1e-4,i*Bv),o=n*n+t*t+e*e,r=s*Hv/Math.max(1e-4,o);return{invMass:s,invInertia:r}}function $v(n){let t=2166136261;for(let e=0;e<n.length;e++)t^=n.charCodeAt(e),t=Math.imul(t,16777619)>>>0;return t>>>0}function Zv(n,t,e){const i=t*.45,a=t*1.7,s=t*1.45,o=[{atU:.58,dx:1,dz:0,outLen:a,upLen:s,rad:i},{atU:.72,dx:-1,dz:0,outLen:a,upLen:s,rad:i}];return o.sort((r,l)=>r.atU-l.atU),o}function qv(n,t,e,i){const a=[];for(const s of t){if(s.atU<=e)continue;const o=n.y+s.atU*n.height,r=Math.abs(s.dx)>.5,l=r?s.outLen:s.rad,c=r?s.rad:s.outLen;a.push({x:s.dx*(n.radius+s.outLen/2),y:o-i,z:s.dz*(n.radius+s.outLen/2),hx:l,hy:s.rad,hz:c}),a.push({x:s.dx*(n.radius+s.outLen),y:o+s.upLen/2-i,z:s.dz*(n.radius+s.outLen),hx:s.rad,hy:s.upLen,hz:s.rad})}return a.length>0?a:void 0}function cm(n,t,e,i){n.events.push({type:"break",tick:n.tick,x:t.x,y:i,z:t.z,value:e})}function Kh(n,t,e,i,a,s,o){const r=t.y+t.standU*t.height,l=Ti(i,t.y+va*t.height,r),c=(l-t.y)/t.height;if(c>=t.standU-.001)return;const h=Xv(l,t.y,t.height,t.radius,a,s,o,{tiltDeg:t.tiltDeg,bands:t.bands,pitchGain:t.pitchGain,maxTiltDeg:t.maxTiltDeg,minU:va,maxU:t.standU}),f=c,d=t.standU,u=(d-f)*t.height,p=t.y+(f+d)*.5*t.height,v=rm(t.radius,u*.5,t.radius),g=Math.hypot(a,o),m=g>Ei?a/g:1,y=g>Ei?o/g:0,x=t.kind==="cactus"?qv(t,t.arms,c,p):void 0,M={x:t.x,y:p,z:t.z,hx:t.radius,hy:u*.5,hz:t.radius,qw:1,qx:0,qy:0,qz:0,vx:m*Su,vy:Gv,vz:y*Su,wx:h.ax*Hc,wy:h.ay*Hc,wz:h.az*Hc,invMass:v.invMass,invInertia:v.invInertia,restitution:sm,friction:om,rest:0,restT:0,parts:x};t.fragments.push(M),t.standU=c,t.snx=h.nx,t.sny=h.ny,t.snz=h.nz,t.broken+=1,t.cutU=c,t.theta=h.theta,t.nx=h.nx,t.ny=h.ny,t.nz=h.nz,t.ax=h.ax,t.ay=h.ay,t.az=h.az,t.brokenAt=n.time,cm(n,t,e,l)}function lm(n,t,e,i,a,s,o){const r=Math.round(t.height*t.radius*30),l=Ti(r,6,12);let c=2;for(;c*c*c<l;)c++;const h=c*c*c,f=2*t.radius/c,d=t.height/c,u=t.radius,p=t.x,v=Ti(i,t.y+.05,t.y+t.height-.05),g=t.z,m=[];let y=0;for(let x=0;x<c&&y<h;x++)for(let M=0;M<c&&y<h;M++)for(let w=0;w<c&&y<h;w++){const S=t.x-u+(x+.5)*f,E=t.y+(M+.5)*d,T=t.z-u+(w+.5)*f,b=(zn(n)-.5)*f*.4,_=(zn(n)-.5)*d*.4,A=(zn(n)-.5)*f*.4,k=S+b,L=E+_,U=T+A,C=f*.5*(.72+zn(n)*.22),D=d*.5*(.72+zn(n)*.22),B=f*.5*(.72+zn(n)*.22),O=rm(C,D,B);let X=k-p,it=L-v,ht=U-g;const ft=Math.hypot(X,it,ht)||1;X/=ft,it/=ft,ht/=ft,ft<.001&&(X=Eu(n),it=0,ht=Eu(n));const Rt=4+zn(n)*5;m.push({x:k,y:L,z:U,hx:C,hy:D,hz:B,qw:1,qx:0,qy:0,qz:0,vx:X*wu,vy:Vv+zn(n)*1.2,vz:ht*wu,wx:(zn(n)-.5)*Rt,wy:(zn(n)-.5)*Rt,wz:(zn(n)-.5)*Rt,invMass:O.invMass,invInertia:O.invInertia,restitution:sm,friction:om,rest:0,restT:0}),y++}t.fragments=m,t.broken=1,t.standU=0,t.cutU=0,t.theta=0,t.nx=0,t.ny=1,t.nz=0,t.ax=0,t.ay=0,t.az=-1,t.brokenAt=n.time,cm(n,t,e,v)}function Eu(n){return zn(n)*2-1}function hm(n,t,e){const i=n.destructibles;if(!i||!t.targetId)return;const a=i.find(s=>s.id===t.targetId);if(a){if(a.kind==="pole"||a.kind==="cactus"){if(a.standU>va+.001){const s=i.indexOf(a);Kh(n,a,s,a.y+(va+.001)*a.height,1,0,0)}else Tu(n,a.id);return}Tu(n,a.id)}}function Tu(n,t){var i;const e=(i=n.destructibles)==null?void 0:i.find(a=>a.id===t);e&&(e.broken=0,e.standU=1,e.snx=0,e.sny=1,e.snz=0,e.cutU=1,e.theta=0,e.nx=0,e.ny=1,e.nz=0,e.ax=0,e.ay=0,e.az=-1,e.brokenAt=0,e.fragments=[],e.hitArmed=!1)}function jv(n,t,e,i,a,s){const o=n.destructibles;if(!o)return!1;for(let r=0;r<o.length;r++){const l=o[r];if(l.id===t){if(l.kind==="pole"||l.kind==="cactus")return l.standU<=va?!1:(Kh(n,l,r,e,i,a,s),!0);if(l.kind==="jar")return l.broken!==0?!1:(lm(n,l,r,e),!0);if(l.kind==="button")return hm(n,l),!0}}return!1}function Kv(n,t,e){const i=n.destructibles;if(!i||i.length===0||!n.modules.destructibles)return;const a=e.breakHits??[],s=a.length>0?kp(n):null,o=!!s&&(s.active||s.slamRadius>0),r=o?new Set:null;if(o&&s)for(let c=0;c<a.length;c++){const h=a[c];let f=-1;for(let u=0;u<i.length;u++)if(i[u].id===h.id){f=u;break}if(f<0)continue;const d=i[f];if(r.add(d.id),!d.hitArmed)if(d.hitArmed=!0,d.kind==="pole"||d.kind==="cactus"){if(d.standU<=va)continue;Kh(n,d,f,h.y,h.dx,h.dy,h.dz)}else if(d.kind==="jar"){if(d.broken!==0)continue;lm(n,d,f,h.y,h.dx,h.dy,h.dz)}else d.kind==="button"&&hm(n,d)}for(let c=0;c<i.length;c++){const h=i[c];r&&r.has(h.id)||(h.hitArmed=!1)}const l=n.config.gravity;for(let c=0;c<i.length;c++){const h=i[c];if(!h.fragments||h.fragments.length===0)continue;const f=h.fragments.slice();if((h.kind==="pole"||h.kind==="cactus")&&h.standU>.02){const d=h.standU*h.height*.5;f.push({x:h.x,y:h.y+d,z:h.z,hx:h.radius,hy:d,hz:h.radius,qw:1,qx:0,qy:0,qz:0,vx:0,vy:0,vz:0,wx:0,wy:0,wz:0,invMass:0,invInertia:0,restitution:0,friction:0,rest:0,restT:0})}Ov(f,t,h.y,l)}}function dm(n){const t=n.destructibles;if(t)for(let e=0;e<t.length;e++){const i=t[e];i.broken=0,i.standU=1,i.snx=0,i.sny=1,i.snz=0,i.cutU=1,i.theta=0,i.nx=0,i.ny=1,i.nz=0,i.ax=0,i.ay=0,i.az=-1,i.brokenAt=0,i.fragments=[],i.hitArmed=!1}}function Jv(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function Qv(n,t){const e=nx(t);return{tick:0,time:0,rngState:2654435769,config:n,boxes:e,gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Zp(1),playerLink:fc(),arrows:[],arrowSeq:0,abilities:Qg(),skills:Kg(n),impulse:{x:0,z:0},targeting:ov(),turnInPlace:Ig(),playerHurt:Cp(),hitCount:0,dash:{...jx(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Bp(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Jv(),dummies:Ix(n.dummies),dummyAttackCount:0,grass:yv(n,t,e,t.grid),destructibles:Yv(t.destructibles),events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0,grass:!0,destructibles:!0}}}function ty(n){Qx(n),Qp(n),Wp(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Vh,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Op(n),Xp(n),tm(n),Hp(n),Zr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,bv(n),dm(n),n.events.length=0}function Au(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){ty(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?cv(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),vx(n,t,e),n.modules.combat&&Rx(n,t,e),n.modules.dash&&Jx(n,t,e),n.modules.movement&&ev(n,t,e),n.modules.gaze&&lv(n,t,e),n.modules.orientation&&Ng(n,t,e),Ug(n,t,e),n.modules.dummies&&Wx(n,t,e),Tg(n,t),px(n,t),n.modules.abilities&&tx(n,t,e),n.modules.combat&&dx(n,t),n.modules.dummies&&(Dg(n,t),n.modules.separation&&(nv(n),av(n))),_v(n,t),Kv(n,t,e),n.modules.camera?ex(n):Hp(n),n}const um=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],Ru=1e-9;function ey(n,t,e){return n<t?t:n>e?e:n}function fm(n){return ey(Number.isFinite(n)?n:0,0,1)}function pm(n,t){const e=fm(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function ny(){const n={};for(const t of um)n[t]=0;return n}function iy(n,t){const e=ny(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=fm(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+Ru;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>Ru?(a-o.t)/l:0,h=pm(o.ease??"linear",c);for(const f of um){const d=o.pose[f]??r.pose[f]??0,u=r.pose[f]??o.pose[f]??0;e[f]=d+(u-d)*h}return e}function ay(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=pm(i,t/a);return e.turns*Math.PI*2*s}function Ea(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function sy(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Au(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){Au(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function Fi(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function ze(n,t,e){return n+(t-n)*e}function oy(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function Pu(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:oy(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function ry(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function cy(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:ze(n.ch.x,t.ch.x,i),y:ze(n.ch.y,t.ch.y,i),z:ze(n.ch.z,t.ch.z,i)},facing:Fi(n.ch.facing,t.ch.facing,i),moveYaw:Fi(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:Fi(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:Fi(n.ch.headYaw,t.ch.headYaw,i),headPitch:ze(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:ze(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:Fi(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:ze(n.ch.stride,t.ch.stride,i),velocity:{x:ze(n.ch.vx,t.ch.vx,i),y:ze(n.ch.vy,t.ch.vy,i),z:ze(n.ch.vz,t.ch.vz,i)}},s={attackProgress:ze(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:ze(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:ze(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,ze(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:ze(n.hurt.timer,t.hurt.timer,i),knockX:ze(n.hurt.knockX,t.hurt.knockX,i),knockZ:ze(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((l,c)=>{const h=n.dm[c];return h?{position:{x:ze(h.x,l.x,i),y:ze(h.y,l.y,i),z:ze(h.z,l.z,i)},facing:Fi(h.facing,l.facing,i),bodyYaw:Fi(h.bodyYaw,l.bodyYaw,i),headYaw:Fi(h.headYaw,l.headYaw,i),gaitPhase:Fi(h.gaitPhase,l.gaitPhase,i),stride:ze(h.stride,l.stride,i),attackProgress:ze(h.attackProgress,l.attackProgress,i),velocity:{x:ze(h.vx,l.vx,i),y:ze(h.vy,l.vy,i),z:ze(h.vz,l.vz,i)}}:null});return{time:ze(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:ze(n.dash.timer,t.dash.timer,i)},turn:{progress:ze(n.turn.progress,t.turn.progress,i)},link:{progress:ze(n.link.progress,t.link.progress,i)},dummies:r}}function ly(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const mm={slopPx:12,longPressMs:450,doubleTapMs:280};function hy(n,t,e=mm.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function Ta(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function dy(n=mm){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),Ta(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,Ta(l.button,"drag",c,h,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY,f=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return Ta(l.button,"release",c,h,f,1);const u=e.get(l.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(s-u.x,o-u.y)<=n.slopPx*2?(e.delete(l.button),Ta(l.button,"doubleTap",c,h,f,2)):(e.set(l.button,{at:r,x:s,y:o}),Ta(l.button,"tap",c,h,f,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),Ta(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,Ta(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const Gc=.001,uy=18;function $l(n,t,e){return n<t?t:n>e?e:n}function Zl(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function fy(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function py(n,t,e,i,a=uy){const s=fy(t);if(!s)return{state:Zl(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<Gc)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const p=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:p},scale:1,started:!0,ended:!1,armedNow:!1,pinching:p}}if(!n.armed)return n.armDist<Gc?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Gc)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:$l(Number.isFinite(u)?u:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Cu(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?$l(r,a,s):$l(n,a,s)}function my(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function gy(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Vc=["jump","sprint","reset","attack","skill2"],xy=8,vy=16,Xc=10,Lu=14,ku=140,yy=18,My=16,_y=400,by=1.0001;function Ur(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function Sy(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Ur(e)}function wy(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,f=0,d=0,u=-1,p=0,v=null,g=-1,m=0,y=0,x=0,M=0,w=!1,S=0,E=1,T=0,b=null,_=0,A=0,k=!1,L=null,U=null,C=0,D=0,B=0,O=0,X=!1,it=!0,ht=-1;const ft=dy({slopPx:Lu,longPressMs:450,doubleTapMs:350});let Rt=[],Z=null;const at=new Set;function dt($){$&&Rt.push($)}const st=new Map;let nt=Zl(),ut=!1,Bt=1;function Zt(){const $=Array.from(st.values()),W=a(),ct=py(nt,$,W.pinchGain,W.maxStepRatio,yy);if(nt=ct.state,ut=ct.pinching,ct.scale!==1&&(Bt*=ct.scale),ct.started||ct.armedNow)b=null,k=!0,L=null;else if(ct.ended&&o===null&&$.length===1){const Ot=$[0];o=Ot.id,r=Ot.x,l=Ot.y,c=0,h=0,f=Ot.x,d=Ot.y,w=!1,S=0,E=1,T=0,performance.now(),b=null,k=!0,L=null}}const lt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},V={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let N=0,Ct=0;const Tt={},Mt=new Set,vt=[];function mt(){for(const $ of Vc)Tt[$]!==void 0&&(Tt[$]=void 0),K($);ft.reset(),at.clear(),st.clear(),nt=Zl(),ut=!1,o=null,c=0,h=0,f=0,d=0,w=!1,S=0,E=1,T=0,m=0,y=0,x=0,M=0,v=null,g=-1,b=null,k=!1,L=null,U=null,ht=-1,B=0,O=0,X=!1,it=!0}const kt=()=>{document.hidden&&mt()},F=$=>{if($.clientX===0&&$.clientY===0){p++;return}if(Ur($.target)||Sy($.clientX,$.clientY)){at.add($.pointerId);return}if(at.delete($.pointerId),st.set($.pointerId,{id:$.pointerId,x:$.clientX,y:$.clientY}),o===null&&!ut){v=null,g=-1,o=$.pointerId,r=$.clientX,l=$.clientY,c=0,h=0,f=$.clientX,d=$.clientY,performance.now();const W=Number.isFinite($.screenX)&&Number.isFinite($.screenY)&&($.screenX!==0||$.screenY!==0);w=W,S=0,E=1,T=0,m=W?$.screenX:0,y=W?$.screenY:0,x=m,M=y,b=$.pointerId,_=$.clientX,A=$.clientY,k=!1}Zt()},R=$=>{if($.pointerId===U&&($.pointerType==="mouse"&&$.buttons===0||$.clientX===0&&$.clientY===0&&(C!==0||D!==0)||(it?(B=$.clientX-C,O=$.clientY-D):(C=$.clientX,D=$.clientY,it=!0,B=0,O=0))),dt(ft.move($.pointerId,$.clientX,$.clientY,performance.now())),!at.has($.pointerId)&&st.has($.pointerId)&&(st.set($.pointerId,{id:$.pointerId,x:$.clientX,y:$.clientY}),Zt()),at.has($.pointerId)||$.pointerId!==o)return;const W=performance.now();if(v===$.pointerId&&W-g<150){p++;return}const ct=$.clientX,Ot=$.clientY;if(ct===0&&Ot===0&&(r!==0||l!==0)){p++;return}const Lt=ct-f,I=Ot-d,_t=Number.isFinite($.screenX)&&Number.isFinite($.screenY),tt=_t?$.screenX:0,rt=_t?$.screenY:0,Pt=_t&&(tt!==0||rt!==0),wt=tt-x,Kt=rt-M;if(w&&Pt){const Ae=Math.hypot(wt,Kt),de=Math.hypot(Lt,I);if(Ae>3){if(S=0,T<30&&de>6&&wt*Lt+Kt*I>.7*Ae*de){const hn=Ae/de;hn>.2&&hn<5&&(E+=(hn-E)*.3,T++)}}else de>12&&(S++,S>=2&&(w=!1))}const he=Math.hypot(Lt,I);if(!w){const Ae=u<0?Number.POSITIVE_INFINITY:W-u,de=Pt?Math.hypot(wt,Kt):1/0;he>28&&(Ae<200||de<he*.4)&&(r+=Lt,l+=I,p++)}f=ct,d=Ot,x=tt,M=rt,$.pointerId===b&&Math.hypot($.clientX-_,$.clientY-A)>xy&&(k=!0);let ce,ne;w&&Pt?(ce=(tt-m)/E,ne=(rt-y)/E):(ce=ct-r,ne=Ot-l);const Te=Math.hypot(ce,ne),Pe=s();Te>Pe&&(ce*=Pe/Te,ne*=Pe/Te);const sn=Math.hypot(c,h),on=Math.hypot(ce,ne);if(sn>10&&on>10){const Ae=Math.abs(Math.atan2(c*ne-h*ce,c*ce+h*ne)),de=Math.max(sn,on)*Ae,hn=Math.max(Math.hypot(Lt,I),Math.hypot(wt,Kt)/Math.max(.2,E));if(Ae>.6&&hn<Math.max(6,de*.5)){p++;return}}c=ce,h=ne};function K($){if(!lt[$])return;lt[$]=!1,$==="attack"&&(V.attackReleased=!0);const W=document.getElementById(`btn-${$}`);W==null||W.classList.remove("is-down")}function pt(){o!==null&&(v=o,g=performance.now(),o=null,c=0,h=0,f=0,d=0,w=!1,S=0,E=1,T=0,m=0,y=0,x=0,M=0)}const et=$=>{const W=st.delete($.pointerId),ct=at.delete($.pointerId);W&&Zt(),$.pointerId===U&&(U=null,X?ht=performance.now():(B=0,O=0,ht=-1)),dt(ft.end($.pointerId,$.clientX,$.clientY,performance.now()));for(const zt of Vc)Tt[zt]===$.pointerId&&(Tt[zt]=void 0,K(zt));const Ot=!W&&!ct&&st.size<=1&&o!==null;($.pointerId===o||st.size===0||Ot)&&pt(),!ct&&$.pointerId===b&&(!k&&!Ur($.target)&&(L={x:$.clientX,y:$.clientY}),b=null)};for(const $ of Vc){const W=document.getElementById(`btn-${$}`);if(!W)continue;const ct=$==="attack"||$==="skill2",Ot=I=>{if(I.preventDefault(),Tt[$]===void 0){Tt[$]=I.pointerId,lt[$]=!0,$==="jump"&&(V.jump=!0),$==="reset"&&(V.reset=!0),$==="sprint"&&(V.sprintPressed=!0),$==="attack"&&(V.attackPressed=!0),$==="skill2"&&(V.skill2=!0),W.classList.add("is-down"),dt(ft.begin($,I.pointerId,I.clientX,I.clientY,performance.now()));try{W.setPointerCapture(I.pointerId)}catch{}ct&&(U=I.pointerId,C=I.clientX,D=I.clientY,it=!(I.clientX===0&&I.clientY===0),B=0,O=0,X=!1,ht=-1)}},zt=I=>{Tt[$]===I.pointerId&&(Tt[$]=void 0,K($),dt(ft.end(I.pointerId,I.clientX,I.clientY,performance.now())))},Lt=I=>{Tt[$]===I.pointerId&&(Tt[$]=void 0,K($),dt(ft.cancel(I.pointerId,performance.now())))};W.addEventListener("pointerdown",Ot),W.addEventListener("pointerup",zt),W.addEventListener("pointercancel",Lt),vt.push(()=>{W.removeEventListener("pointerdown",Ot),W.removeEventListener("pointerup",zt),W.removeEventListener("pointercancel",Lt)})}const ot=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const $ of ot){const W=ct=>{ct.preventDefault(),N=Number($.dataset.weapon)||0};$.addEventListener("pointerdown",W),vt.push(()=>$.removeEventListener("pointerdown",W))}const yt=$=>{const W=$.key.toLowerCase();if((W===" "||W.startsWith("arrow"))&&$.preventDefault(),Mt.has(W))return;Mt.add(W),W===" "&&(V.jump=!0),W==="r"&&(V.reset=!0),W==="shift"&&(V.sprintPressed=!0),W==="j"&&(V.attackPressed=!0),W==="k"&&(V.skill2=!0),W>="1"&&W<="5"&&(N=Number(W)),W>="6"&&W<="9"&&(Ct=Number(W)-5);const ct=Math.max(by,a().keyStep||1.12);(W==="="||W==="+")&&(Bt*=ct),(W==="-"||W==="_")&&(Bt/=ct)},At=$=>{const W=$.key.toLowerCase();Mt.has(W)&&(Mt.delete(W),W==="j"&&(V.attackReleased=!0))},St=$=>{if(Ur($.target))return;$.preventDefault();const W=$.deltaMode===1?$.deltaY*My:$.deltaMode===2?$.deltaY*_y:$.deltaY;Bt*=my(W,a().wheelStep)},Yt=$=>{$.preventDefault()},gt=()=>{u=performance.now()};window.addEventListener("resize",gt),window.addEventListener("orientationchange",gt);const Dt=typeof window<"u"?window.visualViewport:null;return Dt&&(Dt.addEventListener("resize",gt),Dt.addEventListener("scroll",gt)),window.addEventListener("pointerdown",F),window.addEventListener("pointermove",R),window.addEventListener("pointerup",et),window.addEventListener("pointercancel",et),window.addEventListener("blur",mt),document.addEventListener("visibilitychange",kt),window.addEventListener("keydown",yt),window.addEventListener("keyup",At),window.addEventListener("wheel",St,{passive:!1}),window.addEventListener("gesturestart",Yt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:f,y:d,dx:f-r,dy:d-l,radius:s(),badMoves:p,screenOk:w,originSX:m,originSY:y,screenX:x,screenY:M,scale:E}},peekAim(){const $=performance.now(),W=Math.hypot(B,O),ct=U!==null||ht>=0&&$-ht<ku;if(!(ct&&X&&W>=Xc))return{active:!1,holding:ct,x:0,z:0,dx:B,dy:O};const zt=i(),Lt=B/W,I=O/W,_t=zt.rightX*Lt+zt.forwardX*-I,tt=zt.rightZ*Lt+zt.forwardZ*-I,rt=Math.hypot(_t,tt)||1;return{active:!0,holding:ct,x:_t/rt,z:tt/rt,dx:B,dy:O}},sample(){var Nn;const $=s();let W=o!==null?Math.max(-1,Math.min(1,c/$)):0,ct=o!==null?Math.max(-1,Math.min(1,h/$)):0,Ot=0,zt=0;(Mt.has("a")||Mt.has("arrowleft"))&&(Ot-=1),(Mt.has("d")||Mt.has("arrowright"))&&(Ot+=1),(Mt.has("w")||Mt.has("arrowup"))&&(zt-=1),(Mt.has("s")||Mt.has("arrowdown"))&&(zt+=1),W+=Ot,ct+=zt;let Lt=Math.hypot(W,ct);Lt>1&&(W/=Lt,ct/=Lt,Lt=1);const I=W,_t=ct;Lt<e&&(W=0,ct=0);const tt=i();let rt=tt.rightX*W+tt.forwardX*-ct,Pt=tt.rightZ*W+tt.forwardZ*-ct;const wt=Math.hypot(rt,Pt);wt>1&&(rt/=wt,Pt/=wt);const Kt=performance.now();dt(ft.poll(Kt));const he=Math.hypot(B,O);U!==null&&(he>=vy?X=!0:he<Xc&&(X=!1));const ce=U!==null||ht>=0&&Kt-ht<ku,ne=ce&&X&&he>=Xc;let Te=0,Pe=0;if(ne){const dn=B/he,Rn=O/he,_n=tt.rightX*dn+tt.forwardX*-Rn,Pn=tt.rightZ*dn+tt.forwardZ*-Rn,On=Math.hypot(_n,Pn)||1;Te=_n/On,Pe=Pn/On}!ce&&U===null&&(B=0,O=0,ht=-1,X=!1);const sn=L;L=null;const on=Bt;Bt=1;const Ae={moveX:rt,moveZ:Pt,jumpPressed:V.jump,sprintHeld:lt.sprint||Mt.has("shift"),sprintPressed:V.sprintPressed,resetPressed:V.reset,attackPressed:V.attackPressed,attackHeld:lt.attack||Mt.has("j"),attackReleased:V.attackReleased,skill2Pressed:V.skill2,weaponSlot:N,dummyClickId:Ct,aimX:Te,aimZ:Pe,aimActive:ne};V.jump=!1,V.reset=!1,V.sprintPressed=!1,V.attackPressed=!1,V.attackReleased=!1,V.skill2=!1,N=0,Ct=0;const de=Rt.map(dn=>hy(dn,tt,Lu));Rt=[],de.length>0&&(Z=de[de.length-1]);const hn=o!==null?"pointer":Mt.size>0?"keyboard":"idle";return{intents:Ae,stickX:W,stickY:ct,stickRawX:I,stickRawY:_t,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:f,stickPxY:d,stickBad:p,stickScreenOk:w,stickOriginSX:m,stickOriginSY:y,stickScreenX:x,stickScreenY:M,stickScale:E,stickVpTop:((Nn=gy())==null?void 0:Nn.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:B,aimDY:O,source:hn,tap:sn,zoomScale:on,gestures:de,lastGesture:Z}},dispose(){window.removeEventListener("pointerdown",F),window.removeEventListener("pointermove",R),window.removeEventListener("pointerup",et),window.removeEventListener("pointercancel",et),window.removeEventListener("blur",mt),document.removeEventListener("visibilitychange",kt),window.removeEventListener("keydown",yt),window.removeEventListener("keyup",At),window.removeEventListener("wheel",St),window.removeEventListener("resize",gt),window.removeEventListener("orientationchange",gt),Dt&&(Dt.removeEventListener("resize",gt),Dt.removeEventListener("scroll",gt)),window.removeEventListener("gesturestart",Yt),ft.reset();for(const $ of vt)$()}}}const Jr=1,Qr=2,tc=4,gm=8,ec=16,wo=32,xm=64,vm=128,Ey=[[Jr,"atk"],[Qr,"dash"],[tc,"link"],[gm,"air"],[ec,"hurt"],[wo,"aim"],[xm,"spr"],[vm,"chan"]];function ss(n){if(n===0)return"-";const t=Ey.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Ty=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Ay=0,Ry=15,Wc=19,Py=21,Cy=22,Ly=23,ky=24,bi={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Hn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,di=n=>Math.round(n*180/Math.PI*10)/10,Yc=Math.PI*2;function so(n){let t=n%Yc;return t>Math.PI&&(t-=Yc),t<-Math.PI&&(t+=Yc),t}function Dy(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Jr),n.dash.phase!=="idle"&&(e|=Qr),n.playerLink.phase!=="idle"&&(e|=tc),n.character.grounded||(e|=gm),n.playerHurt.type!=="none"&&(e|=ec),t.intents.aimActive&&(e|=wo),n.character.sprinting&&(e|=xm),n.abilities.channeling&&(e|=vm),e}function Iy(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function zy(n){const t={sampleHz:n.sampleHz??bi.sampleHz,sampleCapacity:n.sampleCapacity??bi.sampleCapacity,eventCapacity:n.eventCapacity??bi.eventCapacity,anomalyCapacity:n.anomalyCapacity??bi.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??bi.dirJumpDeg,aimDropDeg:n.aimDropDeg??bi.aimDropDeg,freezeMs:n.freezeMs??bi.freezeMs,freezeSpeed:n.freezeSpeed??bi.freezeSpeed,stickLostMs:n.stickLostMs??bi.stickLostMs,spikeMs:n.spikeMs??bi.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,f=0,d=0,u="",p=-1,v=-1,g=-1,m=0,y=-1e9,x=-1,M={},w=null,S=0,E=0,T=0,b=0;function _(C,D){const B=1/t.sampleHz,O=C[Ay];O-c<B-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(C),c=O)}function A(C,D,B,O,X,it){const ht=M[C]??-1e9;if(D-ht<1.2)return;if(M[C]=D,C==="frameSpike"){let Rt=0;for(const Z of s)Z.kind==="frameSpike"&&Rt++;if(Rt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let ft=i.slice(-7);it&&(ft.length===0||ft[ft.length-1]!==it)&&(ft=[...ft.slice(-6),it]),s.push({kind:C,t:Hn(D),tick:B,ms:Math.round(O),detail:X,ctx:ft}),C==="dirJump"?o.dirJumps++:C==="aimDrop"?o.aimDrops++:C==="moveFreeze"?o.freezes++:C==="stickLost"?o.stickLosts++:C==="stickJump"?o.stickJumps++:C==="stickBad"?o.stickBads++:C==="stickDrift"&&o.stickDrifts++}function k(C,D,B,O){a.length>=t.eventCapacity&&a.shift(),a.push({t:Hn(B),tick:O,k:C,d:D})}function L(C){switch(C.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":y=C.tick;break}}function U(){const C=o,D=C.wallMs/1e3,B=C.gestures,O=ft=>Object.entries(B).filter(([Rt])=>Rt.endsWith(`.${ft}`)).reduce((Rt,[,Z])=>Rt+Z,0),X=[];if(X.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),X.push(`运行 ${D.toFixed(1)}s / ${C.frames} 帧 · ${C.fps.toFixed(1)}fps · 最大 ${C.dtMax.toFixed(0)}ms · 尖峰 ${C.spikes} · 步 ${C.steps}`),X.push(`摇杆活跃 ${D>0?Math.round(C.stickActiveMs/1e3/D*100):0}% · 手势 按下 ${O("press")}（单击 ${O("tap")} / 双击 ${O("doubleTap")} / 拖拽 ${O("drag")} / 长按 ${O("longPress")} / 打断 ${O("cancel")} / 拖放 ${O("release")}）`),X.push(`攻击 ${C.attacks}(中${C.hits}) · 受击 ${C.hurts} · 派生 ${C.links}(中${C.linkHits}) · 翻滚 ${C.rolls} 闪现 ${C.blinks} · 跳 ${C.jumps} · 复位 ${C.resets}`),X.push(`法杖 引导${C.channels} 飞弹${C.bolts} 电环${C.rings} · 弓蓄力${C.bowCharges} · 当前武器 ${u||"-"}`),X.push(`异常 ${C.dirJumps+C.aimDrops+C.freezes+C.stickLosts+C.stickJumps+C.stickBads+C.stickDrifts}（dir ${C.dirJumps} / aim ${C.aimDrops} / freeze ${C.freezes} / stick ${C.stickLosts} / stickJump ${C.stickJumps} / 坏指针 ${C.stickBads} / 坐标漂移 ${C.stickDrifts}） · 掉帧尖峰 ${C.spikes}`+(C.inTurns>0?` · 输入转向 ${C.inTurns} 次（最大 ${C.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const ft of s.slice(-6)){X.push(`· ${ft.kind} @t${ft.t.toFixed(2)} tick${ft.tick} ${ft.ms>0?`${ft.ms}ms `:""}${ft.detail}`);const Rt=ft.ctx.map(at=>String(at[Ry])).join(" "),Z=ft.ctx.map(at=>at[Wc]===""||at[Wc]==null?".":String(at[Wc])).join(" ");if(X.push(`  yaw ${Rt}`),X.push(`  in  ${Z}`),ft.kind==="stickJump"||ft.kind==="stickBad"||ft.kind==="stickLost"){const at=ft.ctx.map(st=>`${st[Py]},${st[Cy]}`).join(" "),dt=ft.ctx.map(st=>`${st[Ly]},${st[ky]}`).join(" ");X.push(`  o   ${at}`),X.push(`  p   ${dt}`)}}if(a.length>0){X.push("最近事件：");for(const ft of a.slice(-12))X.push(`  ${ft.t.toFixed(2)} ${ft.k} ${ft.d}`.trimEnd())}const it=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",ht=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return X.push(`摇杆坐标源 ${it}${ht}`),X.push(`UA ${e.ua}`),X.join(`
`)}return{sample(C,D,B,O=0){o.frames++,D.stickHeld&&(D.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=O,o.wallMs+=B,B>o.dtMax&&(o.dtMax=B),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=C.time;const X=C.time;if(l<0&&(l=X),T=X,b=C.tick,!r)return;const it=C.character,ht=Math.hypot(D.stickX,D.stickY),ft=Math.hypot(it.velocity.x,it.velocity.z);u=C.combat.weapon;const Rt=Dy(C,D),Z=it.facing,dt=Math.hypot(D.intents.moveX,D.intents.moveZ)>.05?Math.atan2(D.intents.moveX,D.intents.moveZ):null;ht>.2&&(o.stickActiveMs+=B);const st=[Hn(X),C.tick,Math.round(B*10)/10,Hn(D.stickX),Hn(D.stickY),Hn(D.stickRawX),Hn(D.stickRawY),D.stickHeld?1:0,D.source.slice(0,8),Hn(D.intents.moveX),Hn(D.intents.moveZ),Hn(it.position.x),Hn(it.position.z),Hn(it.velocity.x),Hn(it.velocity.z),di(Z),di(it.bodyYaw),Rt,Hn(it.stride),dt===null?"":di(dt),D.stickId===null?"":D.stickId,Math.round(D.stickOriginX),Math.round(D.stickOriginY),Math.round(D.stickPxX),Math.round(D.stickPxY),D.stickBad,Math.round(D.stickVpTop),Math.round(D.stickOriginSX),Math.round(D.stickOriginSY),Math.round(D.stickScreenX),Math.round(D.stickScreenY),D.stickScreenOk?1:0,Math.round(D.stickScale*100)/100];_(st);const nt=X*1e3<x;if(B>t.spikeMs&&!nt&&X-l>.6&&(o.spikes++,A("frameSpike",X,C.tick,B,`dt ${B.toFixed(0)}ms fl=${ss(Rt)}`,st)),h!==null&&!nt){const mt=Math.abs(di(so(Z-h))),kt=Math.abs(di(so(it.moveYaw-f))),F=(d|Rt)&(Jr|Qr|tc|ec)|Rt&wo,R=dt===null?null:Math.abs(di(so(Z-dt))),K=dt===null||h===null?null:Math.abs(di(so(h-dt))),pt=R!==null&&K!==null&&R<K-.5,et=(d&wo)!==0&&(Rt&wo)===0&&dt===null,ot=R!==null&&(R<=12||pt);mt>t.aimDropDeg&&et?A("aimDrop",X,C.tick,0,`${mt.toFixed(0)}° @aim→none stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${ss(Rt)}`,st):mt>t.dirJumpDeg&&F===0&&!et&&(ot?(o.inTurns++,mt>o.inTurnMax&&(o.inTurnMax=mt)):A("dirJump",X,C.tick,0,`${mt.toFixed(0)}° res${R===null?" 无输入":`${R.toFixed(0)}°`} yaw ${di(h)}→${di(Z)} in ${dt===null?".":di(dt)}° mvΔ${kt.toFixed(0)}° aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${ss(d)}→${ss(Rt)}`,st))}const ut=(Rt&(Jr|Qr|tc|ec))!==0,Bt=C.tick-y<30;ht>.35&&ft<t.freezeSpeed&&!ut&&!Bt?(p<0&&(p=X),X-p>=t.freezeMs/1e3&&X>=v&&(A("moveFreeze",X,C.tick,(X-p)*1e3,`stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) v${ft.toFixed(2)} ${D.source} fl=${ss(Rt)}`,st),v=X+1.5,p=-1)):p=-1,D.stickHeld?(ht>m&&(m=ht),m>.35&&ht<.06?(g<0&&(g=X),X-g>=t.stickLostMs/1e3&&(A("stickLost",X,C.tick,(X-g)*1e3,`raw(${D.stickRawX.toFixed(2)},${D.stickRawY.toFixed(2)}) peak ${m.toFixed(2)} fl=${ss(Rt)}`,st),g=-1,m=0)):g=-1):(m=0,g=-1);const Zt=D.stickScale>.2&&D.stickScale<5?D.stickScale:1,lt=D.stickScreenOk,V=lt?D.stickScreenX/Zt:D.stickPxX,N=lt?D.stickScreenY/Zt:D.stickPxY,Ct=lt?D.stickOriginSX/Zt:D.stickOriginX,Tt=lt?D.stickOriginSY/Zt:D.stickOriginY,Mt=V-Ct,vt=N-Tt;if(D.stickHeld&&D.stickId!==null){const mt=w;if(mt&&mt.held&&mt.id===D.stickId){const kt=Math.hypot(mt.dx,mt.dy),F=Math.hypot(Mt,vt),R=Math.max(kt,F),K=Math.hypot(V-mt.cx,N-mt.cy),pt=Math.abs(di(so(Math.atan2(vt,Mt)-Math.atan2(mt.dy,mt.dx)))),et=R*pt*Math.PI/180,ot=Math.hypot(Ct-mt.ox,Tt-mt.oy);if(R>18&&pt>35&&K<Math.max(5,et*.35)&&A("stickJump",X,C.tick,0,`Δ${pt.toFixed(0)}° 手指只动${K.toFixed(0)}px(弧长应${et.toFixed(0)}px) o(${Math.round(mt.ox)},${Math.round(mt.oy)})→(${Math.round(Ct)},${Math.round(Tt)}) 原点位移${ot.toFixed(0)}px p(${Math.round(V)},${Math.round(N)}) raw(${Math.round(Mt)},${Math.round(vt)}) id${D.stickId} ${lt?"src=屏幕":"src=client"}`,st),lt&&mt.screenOk){const yt=Math.hypot(D.stickPxX-mt.x,D.stickPxY-mt.y),At=Math.hypot((D.stickScreenX-mt.sx)/Zt,(D.stickScreenY-mt.sy)/Zt);S+=yt-At,Math.abs(S)>20&&(A("stickDrift",X,C.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) screen(${Math.round(D.stickScreenX)},${Math.round(D.stickScreenY)})`,st),S=0)}}w={id:D.stickId,ox:Ct,oy:Tt,cx:V,cy:N,x:D.stickPxX,y:D.stickPxY,sx:D.stickScreenX,sy:D.stickScreenY,dx:Mt,dy:vt,held:!0,screenOk:lt}}else w=null,S=0;if(D.stickBad>E){const mt=D.stickBad-E;A("stickBad",X,C.tick,0,`拦截 ${mt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${D.stickBad}）o(${Math.round(D.stickOriginX)},${Math.round(D.stickOriginY)}) p(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) id${D.stickId??"-"}`,st)}E=D.stickBad,h=Z,f=it.moveYaw,d=Rt},event(C,D){const B=Iy(C);L(C),r&&(C.type==="dash-ready"||C.type==="combo-reset"||C.type==="stepUp"||k(C.type,B,D,C.tick))},gesture(C){const D=`${C.button}.${C.kind}`;o.gestures[D]=(o.gestures[D]??0)+1,r&&(C.kind==="longPress"||C.kind==="doubleTap"||C.kind==="drag"||C.kind==="cancel")&&k(`g:${C.kind}`,`${C.button} ${C.heldMs.toFixed(0)}ms d${C.distance.toFixed(0)}px ${C.angleDeg.toFixed(0)}°`,T,b)},suspend(C){x=T*1e3+C,p=-1,g=-1},setEnabled(C){r=C,C||(h=null,w=null,p=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,M={},c=-1e9,h=null,d=0,p=-1,g=-1,m=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,w=null,E=0;for(const C of Object.keys(o.gestures))delete o.gestures[C]},status(){const C=o.simS,D=s.some(B=>C-B.t<8&&(B.kind==="dirJump"||B.kind==="aimDrop"||B.kind==="moveFreeze"||B.kind==="stickLost"||B.kind==="stickJump"||B.kind==="stickBad"||B.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:D,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Ty,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:U}}const Fy="cactus-test",Uy="仙人掌工位 · 旗杆物理多段砍",Ny="萨瓜罗造型仙人掌：用旗杆物理可多次从任意高度砍断，断块带侧臂飞出；砍红色按钮=触发仙人掌整体掉落/复位",Oy=2.4,By="#5fae6f",Hy="v9s.x 仙人掌工位（auto 地块，只写相对偏移；排在 sparring-demo 之后不抢槽位）",Gy=[{id:"ct-cac-1",kind:"cactus",dx:-.9,dz:-1,height:2.6,radius:.2,seed:7,color:"#3f8f4f",cutColor:"#bfe8b0"},{id:"ct-cac-2",kind:"cactus",dx:.9,dz:-1,height:2,radius:.17,seed:23,color:"#4f9f5f",cutColor:"#c8f0b8"},{id:"ct-btn-1",kind:"button",dx:-.9,dz:.6,height:.42,radius:.18,targetId:"ct-cac-1",color:"#7a7a7a",cutColor:"#ff5a5a"},{id:"ct-btn-2",kind:"button",dx:.9,dz:.6,height:.42,radius:.18,targetId:"ct-cac-2",color:"#7a7a7a",cutColor:"#ff5a5a"}],Vy={id:Fy,name:Uy,hint:Ny,radius:Oy,color:By,owner:Hy,destructibles:Gy},Xy="dash",Wy=6,Yy="冲刺标尺",$y="沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",Zy="square",qy=5.2,jy="#bfe8ff",Ky="v9s.15 历史固定工位",Jy={x:9.8,z:8.2},Qy={dx:0,dz:4.6},tM={dx:-2.8,dz:-4},eM={id:Xy,index:Wy,name:Yy,hint:$y,shape:Zy,radius:qy,color:jy,owner:Ky,anchor:Jy,spawn:Qy,label:tM},nM="gait",iM=7,aM="侧后方步态",sM="面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",oM="circle",rM=3.2,cM="#6fc9a0",lM="v9s.15 历史固定工位",hM={x:-9.5,z:0},dM={dx:0,dz:2.6},uM={dx:0,dz:-2.5},fM={id:nM,index:iM,name:aM,hint:sM,shape:oM,radius:rM,color:cM,owner:lM,anchor:hM,spawn:dM,label:uM},pM="hub",mM=1,gM="中央 8 向",xM="推杆走 8 个方向 · 松手看停步收相 / 转身踏步",vM="circle",yM=3.6,MM="#8fe7ff",_M="v9s.15 历史固定工位",bM={x:0,z:0},SM={dx:0,dz:0},wM={dx:0,dz:-3.1},EM={minCellX:-4,maxCellX:4,minCellZ:0,maxCellZ:6,density:1,clearMarginCells:2,absolute:!0},TM={id:pM,index:mM,name:gM,hint:xM,shape:vM,radius:yM,color:MM,owner:_M,anchor:bM,spawn:SM,label:wM,grass:EM},AM="meter",RM=5,PM="进度弧",CM="弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",LM="circle",kM=3.2,DM="#b48cff",IM="v9s.15 历史固定工位",zM={x:-9.5,z:8.6},FM={dx:0,dz:2.8},UM={dx:0,dz:1.3},NM={id:AM,index:RM,name:PM,hint:CM,shape:LM,radius:kM,color:DM,owner:IM,anchor:zM,spawn:FM,label:UM},OM="rings",BM=2,HM="环状态色阶",GM="同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",VM="circle",XM=3.4,WM="#ffc85a",YM="v9s.15 历史固定工位",$M={x:-9.5,z:-8.2},ZM={dx:0,dz:3},qM={dx:0,dz:-2.7},jM={id:OM,index:BM,name:HM,hint:GM,shape:VM,radius:XM,color:WM,owner:YM,anchor:$M,spawn:ZM,label:qM},KM="sparring-demo",JM="陪练试验场",QM="动态拼合示范地块 · 点「生成 4 人」就地摆出假人 + 持械陪练，用完点「清除」回基线",t_=2,e_="#7fd8c0",n_="v9s.43 动态拼合示范（auto 地块，不写世界坐标，由 assemblePlots 自动分配槽位）",i_={label:"生成 4 人",dummies:2,modes:["idle","keep-distance"],fighters:2,ringRadius:1.5,startDeg:-90},a_={id:KM,name:JM,hint:QM,radius:t_,color:e_,owner:n_,testSpawn:i_},s_="terrain",o_=4,r_="地形 / 门洞",c_="宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",l_="square",h_=5.2,d_="#7fb8d8",u_="v9s.15 历史固定工位",f_={x:8.9,z:-7.4},p_={dx:0,dz:4.6},m_={dx:0,dz:-4.5},g_={id:s_,index:o_,name:r_,hint:c_,shape:l_,radius:h_,color:d_,owner:u_,anchor:f_,spawn:p_,label:m_},x_="windup",v_=3,y_="起手预警",M_="走进 1.6m：脚下红弧填满 = 命中帧",__="circle",b_=3.2,S_="#ff5a4a",w_="v9s.15 历史固定工位",E_={x:0,z:-10},T_={dx:0,dz:3},A_={dx:0,dz:-2.6},R_={id:x_,index:v_,name:y_,hint:M_,shape:__,radius:b_,color:S_,owner:w_,anchor:E_,spawn:T_,label:A_},P_="x-destructibles",C_="可破坏物件 · 斜切断口",L_="站高台打=高处断，平地打=低处断；切口朝挥刀方向斜切 · 瓶罐只断预设带",k_=2,D_="#e8a05c",I_="可破坏物件（auto 地块，只写相对偏移；id 不带版本代号，由合并闸门统一领号；排在 sparring-demo 之后不抢槽位）",z_=[{id:"pole-a",kind:"pole",dx:-1.25,dz:-1,height:2.4,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-b",kind:"pole",dx:0,dz:-1,height:2.8,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"pole-c",kind:"pole",dx:1.25,dz:-1,height:2,radius:.11,tiltDeg:20,color:"#8a6b4a",cutColor:"#f0d2a0"},{id:"jar-a",kind:"jar",dx:-.7,dz:-1.8,height:.9,radius:.28,tiltDeg:14,bands:[.35,.62],color:"#6f8fb8",cutColor:"#d8e4f0"},{id:"jar-b",kind:"jar",dx:.7,dz:-1.8,height:.8,radius:.26,tiltDeg:14,bands:[.4,.68],color:"#b87f6f",cutColor:"#f0d8c8"}],F_={id:P_,name:C_,hint:L_,radius:k_,color:D_,owner:I_,destructibles:z_},U_={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!1,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,strafePeriod:5.2,strafeDuty:.34,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4,fighters:{weapons:["sword-shield","dual-swords","greatsword"],spawn:[{x:-3.6,z:3.8},{x:3.9,z:3.6},{x:.2,z:5.9}],initialModes:["spar","spar","spar"],moveSpeed:2.1,attackInterval:3.4,attackRangeScale:.9,knockbackScale:.6,leashRadius:7,comboCount:0,comboGap:0}},grass:{enabled:!0,footprintCells:2,minHeightCells:1,maxHeightCells:2,bendRadius:.85,maxBendRad:.95,bendRate:18,recoverRate:3.2,stumpRatio:.34,regrow:!0,regrowSec:6,bucketCells:4,wind:{enabled:!0,dirDeg:28,speed:1.35,amplitude:.19,wavelength:4.2,secondWave:{wavelength:1.7,amplitude:.055,speedScale:1.55},gust:{periodSec:7.5,depth:.35},jitter:.16,shadeAmount:.26}}},N_={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},grass:{minCellX:-12,maxCellX:12,minCellZ:4,maxCellZ:24,density:.72,bladesPerPatch:[3,6],avoidMargin:.45,seed:20261108}},O_={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132,dirFlipSec:.16,hipYawTrackRateDeg:240,hipYawBackRateDeg:150},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e",fighterColors:[{body:"#c85a4a",limb:"#8d3a30",head:"#f0c9a0"},{body:"#c9a03c",limb:"#8a6b22",head:"#f0d6a0"},{body:"#7d6ec4",limb:"#4f4488",head:"#e6d2b0"}]},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95},grass:{enabled:!0,bladeWidth:.13,segmentHeight:.5,palette:["#3f7d4f","#569a5c","#6fb56a","#8ccb78","#a9dc86"],stumpColor:"#6b7a48",maxInstances:6e3,debris:{max:220,life:.85,color:"#a9dc86"}}},B_={core:U_,scene:N_,view:O_};function Jh(n){return JSON.parse(JSON.stringify(n))}const Qh=B_,H_=Object.assign({"../config/plots/cactus-test.json":Vy,"../config/plots/dash.json":eM,"../config/plots/gait.json":fM,"../config/plots/hub.json":TM,"../config/plots/meter.json":NM,"../config/plots/rings.json":jM,"../config/plots/sparring-demo.json":a_,"../config/plots/terrain.json":g_,"../config/plots/windup.json":R_,"../config/plots/x-destructibles.json":F_}),G_=Object.values(H_).filter(n=>n&&typeof n.id=="string"&&n.id.length>0),V_=Gp,Xi=sx(G_,V_),Du=Xi.plots,X_=Jh(Qh.core),Ns=Jh(Qh.scene),xn=Jh(Qh.view);Ns.stations=Xi.stations;Ns.grass&&(Ns.grass.plots=Xi.grassPlots);Ns.destructibles=Xi.destructibles;/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Li{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),Li.nextNameID=Li.nextNameID||0,this.$name.id=`lil-gui-name-${++Li.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class W_ extends Li{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function ql(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Y_={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:ql,toHexString:ql},Fo={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},$_={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Fo.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Fo.toHexString(a)}},Z_={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Fo.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Fo.toHexString(a)}},q_=[Y_,Fo,$_,Z_];function j_(n){return q_.find(t=>t.match(n))}class K_ extends Li{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=j_(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=ql(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class $c extends Li{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class J_ extends Li{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let y=parseFloat(this.$input.value);isNaN(y)||(this._stepExplicit&&(y=this._snap(y)),this.setValue(this._clamp(y)))},i=y=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+y),this.$input.value=this.getValue())},a=y=>{y.key==="Enter"&&this.$input.blur(),y.code==="ArrowUp"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y))),y.code==="ArrowDown"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y)*-1))},s=y=>{this._inputFocused&&(y.preventDefault(),i(this._step*this._normalizeMouseWheel(y)))};let o=!1,r,l,c,h,f;const d=5,u=y=>{r=y.clientX,l=c=y.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",p),window.addEventListener("mouseup",v)},p=y=>{if(o){const x=y.clientX-r,M=y.clientY-l;Math.abs(M)>d?(y.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>d&&v()}if(!o){const x=y.clientY-c;f-=x*this._step*this._arrowKeyMultiplier(y),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}c=y.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",p),window.removeEventListener("mouseup",v)},g=()=>{this._inputFocused=!0},m=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",m)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(m,y,x,M,w)=>(m-y)/(x-y)*(w-M)+M,e=m=>{const y=this.$slider.getBoundingClientRect();let x=t(m,y.left,y.right,this._min,this._max);this._snapClampSetValue(x)},i=m=>{this._setDraggingStyle(!0),e(m.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=m=>{e(m.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=m=>{m.preventDefault(),this._setDraggingStyle(!0),e(m.touches[0].clientX),o=!1},h=m=>{m.touches.length>1||(this._hasScrollBar?(r=m.touches[0].clientX,l=m.touches[0].clientY,o=!0):c(m),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=m=>{if(o){const y=m.touches[0].clientX-r,x=m.touches[0].clientY-l;Math.abs(y)>Math.abs(x)?c(m):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else m.preventDefault(),e(m.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),p=400;let v;const g=m=>{if(Math.abs(m.deltaX)<Math.abs(m.deltaY)&&this._hasScrollBar)return;m.preventDefault();const x=this._normalizeMouseWheel(m)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(u,p)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Q_ extends Li{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class tb extends Li{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const eb=`.lil-gui {
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
}`;function nb(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Iu=!1;class nc{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Iu&&r&&(nb(eb),Iu=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new Q_(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new J_(this,t,e,i,a,s);case"boolean":return new W_(this,t,e);case"string":return new tb(this,t,e);case"function":return new $c(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new K_(this,t,e,i)}addFolder(t){const e=new nc({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof $c||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof $c)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function ib(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new nc({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new nc({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=St=>{const Yt=s.addFolder(St);return l.push(Yt),Yt},h=(St,Yt)=>{const gt=St.addFolder(Yt);return r.push(gt),gt},f=c("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=c("移动 / 输入"),p=h(u,"基础移动参数");p.add(o,"moveSpeed",1,10,.1).name("移动速度"),p.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),p.add(o,"acceleration",1,40,.5).name("加速度"),p.add(o,"friction",1,40,.5).name("摩擦"),p.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),p.add(o,"gravity",5,60,.5).name("重力"),p.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),p.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),p.add(o,"characterRadius",.1,.8,.01).name("角色半径"),p.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),p.add(o,"strideLength",.3,3,.05).name("基础步幅"),p.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),p.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const v=h(u,"摇杆 / 输入");v.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),v.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,m=h(u,"冲刺 / 闪避");m.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),m.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),m.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),m.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),m.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),m.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),m.add(g,"blinkClearVelocity").name("闪现清空速度"),m.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),m.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const y=o.separation,x=h(u,"角色间分离 / 挤压阻力");x.add(y,"iterations",1,8,1).name("迭代次数"),x.add(y,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(y.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(y.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(y.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const M=c("动作 / 步态"),w=h(M,"程序化步态");w.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),w.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),w.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),w.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),w.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),w.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),w.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),w.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),w.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),w.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),w.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),w.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),w.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),w.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),w.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),w.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)"),w.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)"),w.add(t.gait,"dirFlipSec",0,.4,.01).name("换向融合时长 (s)"),w.add(t.gait,"hipYawTrackRateDeg",0,600,10).name("下盘目标转速上限 (°/s)"),w.add(t.gait,"hipYawBackRateDeg",0,600,10).name("└ 后退相位上限 (°/s)");const S=h(M,"停步 / 收相 / 惯性");S.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),S.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),S.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),S.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),S.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),S.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),S.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),S.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),S.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),S.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),S.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),S.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const E=h(M,"足部 IK"),T=t.ik;E.add(T,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),E.add(T,"weight",0,1,.01).name("钉地权重"),E.add(T,"attackScale",0,1,.01).name("攻击时权重倍率"),E.add(T,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const b=h(M,"惯性倾斜 / 盆骨"),_=t.lean;b.add(_,"accelGain",0,.1,.002).name("前后加速度增益"),b.add(_,"turnGain",0,.2,.005).name("绕圈侧倾增益"),b.add(_,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),b.add(_,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),b.add(_,"smoothing",1,30,1).name("倾斜平滑速率"),b.add(_,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),b.add(_,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),b.add(_,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),b.add(_,"crouchSmoothing",1,30,1).name("下沉平滑速率");const A=o.orientation,k=h(M,"朝向 / 接敌注视 / 原地转身");k.add(A,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),k.add(A,"headTurnRate",.5,40,.5).name("头部转向速率"),k.add(A,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),k.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),k.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),k.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const L=o.gaze;k.add(L,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),k.add(L,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),k.add(L,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),k.add(L,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),k.add(L,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),k.add(L,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),k.add(L,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),k.add(L,"headPitchRate",.5,20,.5).name("头部俯仰速率"),k.add(L,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),k.add(L,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),k.add(L,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const U=o.turnInPlace;k.add(U,"enabled").name("启用原地转身 (关=纯插值)"),k.add(U,"triggerDeg",20,180,5).name("触发夹角 (°)"),k.add(U,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),k.add(U,"settleDeg",0,60,1).name("转身保留余角 (°)"),k.add(U,"durationSec",.1,1.5,.02).name("转身时长 (s)"),k.add(U,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),k.add(U,"inputDeadZone",0,.5,.01).name("起步输入死区"),k.add(U,"armSec",0,.5,.01).name("触发防抖 (s)"),k.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("停步偏差消化窗口"),k.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),k.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),k.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),k.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),k.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const C=c("战斗 / 命中"),D=o.combat,B=h(C,"连击 / 武器时序"),O=B.add(n.combat,"weapon",xa).name("当前武器");B.add(D,"comboWindow",.1,2,.05).name("连击窗口 (s)"),B.add(D,"settle",0,.8,.01).name("段间停顿 (s)"),B.add(D,"attackMoveScale",0,1,.01).name("攻击时移动比例"),B.add(D,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),B.add(D,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),B.add(D,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),B.add(D,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),B.add(D,"cancelWindow",0,1,.01).name("取消窗口 (s)"),B.add(D,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),B.add(D,"autoCombo").name("按住自动连击"),B.add(D.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),B.add(D.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),B.add(D.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),B.add(D.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率"),B.add(D.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),B.add(D.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),B.add(D.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),B.add(D.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),B.add(D.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),B.add(D.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),B.add(D.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),B.add(D.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),B.add(D.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度");const X=o.abilities;B.add(X.arcane,"perWave",1,8,1).name("每波飞弹数"),B.add(X.arcane,"waves",1,12,1).name("每次引导波数"),B.add(X.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),B.add(X.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),B.add(X.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),B.add(X.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),B.add(X.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),B.add(X.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),B.add(X.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),B.add(X.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),B.add(X.arcane,"speed",3,24,.5).name("飞弹速度"),B.add(X.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),B.add(X.ring,"radius",.5,5,.1).name("电环半径"),B.add(X.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),B.add(X.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const it=o.hits.hitstopWarp;if(it){const St=h(C,"卡肉节奏（接触瓦片）");St.add(it,"enabled").name("瓦片开（关=硬冻结）"),St.add(it,"holdRate",0,.4,.01).name("保持期速率"),St.add(it,"release",.005,.2,.005).name("释放时长 (s)"),St.add(it,"payback",1,2.5,.05).name("偿还倍率"),St.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),St.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),St.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const ht=o.hits,ft=h(C,"命中 / 受击 / 击退");ft.add(ht,"arcDeg",10,120,5).name("命中扇区半角 (°)"),ft.add(ht,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),ft.add(ht,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),ft.add(ht,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),ft.add(ht.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),ft.add(ht.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),ft.add(ht,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),ft.add(ht,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Rt={get enabled(){return!ht.noDamageToPlayer},set enabled(St){ht.noDamageToPlayer=!St}};ft.add(Rt,"enabled").name("玩家受击击退");const Z=h(C,"受击分层"),at=t.hurt;Z.add(at,"enabled").name("启用分层受击 (关=旧版对照)"),Z.add(at,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Z.add(at,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Z.add(at,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Z.add(at,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Z.add(at,"upperShiftScale",0,1,.01).name("上身位移缩放"),Z.add(at,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Z.add(at.hitHeight,"light",0,1,.01).name("轻击命中部位"),Z.add(at.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Z.add(at.hitHeight,"knock",0,1,.01).name("击退命中部位"),Z.add(at,"leanLight",0,1.5,.01).name("轻击力度"),Z.add(at,"leanHeavy",0,1.5,.01).name("重击力度"),Z.add(at,"leanKnock",0,1.5,.01).name("击退力度"),Z.add(at,"flashStrength",0,2,.05).name("受击闪光强度");for(const{name:St,p:Yt}of[{name:"打腹 (abdomen)",p:at.abdomen},{name:"打肩 (shoulder)",p:at.shoulder}]){const gt=h(Z,St);gt.add(Yt,"upperPitch",0,2,.01).name("上身前后倾斜"),gt.add(Yt,"upperRoll",0,2,.01).name("上身侧倾"),gt.add(Yt,"upperYaw",0,1.5,.01).name("肩部扭转"),gt.add(Yt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),gt.add(Yt,"shift",0,.8,.01).name("身体反应位移"),gt.add(Yt,"drop",0,.4,.01).name("整体下沉"),gt.add(Yt,"back",0,.4,.01).name("屁股向后"),gt.add(Yt,"knee",0,1.6,.01).name("屈膝"),gt.add(Yt,"hip",0,1,.01).name("髋前倾"),gt.add(Yt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)")}const dt=h(C,"派生招"),st=o.links;dt.add(st,"enabled").name("总开关 (false=旧连击)"),dt.add(st.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),dt.add(st.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),dt.add(st.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),dt.add(st,"sharedCooldown",0,3,.05).name("共享 CD (s)"),dt.add(st,"triggerWhileSprinting").name("长跑中可直接触发"),dt.add(st.search,"range",1,14,.1).name("索敌距离 (m)"),dt.add(st.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),dt.add(st.search,"stopDistance",0,3,.05).name("停住距离 (m)");const nt=st.moves["sword-shield"];nt&&(dt.add(nt,"enabled").name("剑盾盾击"),dt.add(nt,"distance",0,8,.1).name("冲锋极限 (m)"),dt.add(nt,"windup",0,.5,.01).name("前摇 (s)"),dt.add(nt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),dt.add(nt,"recovery",0,.8,.01).name("收势 (s)"),dt.add(nt.hit,"radius",0,4,.05).name("命中半径 (m)"),dt.add(nt.hit,"width",0,2,.05).name("扫掠半径 (m)"),dt.add(nt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),dt.add(nt.hit,"duration",0,1.5,.01).name("僵直 (s)"));const ut=o.targeting,Bt=h(C,"目标辅助");Bt.add(ut,"targetAssist").name("启用目标辅助"),Bt.add(ut,"range",1,14,.5).name("锁定范围 (m)"),Bt.add(ut,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Bt.add(ut,"frontBias",0,4,.1).name("朝向加权"),Bt.add(ut,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Bt.add(ut,"maxLungeScale",1,3,.1).name("前冲最大放大");const Zt=c("表现 / 特效"),lt=h(Zt,"挥击幅度 / 刀光"),V=t.animation.swing;lt.add(V,"enabled").name("挥击身体幅度 开"),lt.add(V,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),lt.add(V,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),lt.add(V,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),lt.add(V,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),lt.add(V,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),lt.add(V,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),lt.add(V,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),lt.add(V.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const N=t.weaponTrail;lt.add(N,"enabled").name("挥击刀光 开"),lt.add(N,"life",.04,.4,.01).name("刀光残留 (s)"),lt.add(N,"intensity",0,1.5,.05).name("刀光亮度"),lt.add(N,"minStep",.005,.1,.005).name("采样最小位移 (m)"),lt.add(t.hitstop,"enabled").name("命中卡肉 / 震屏");const Ct=h(Zt,"夸张化 / 四肢伸缩"),Tt=t.animation.stretch;Ct.add(Tt,"enabled").name("四肢伸缩 开"),Ct.add(Tt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),Ct.add(Tt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),Ct.add(Tt,"impactSquash",0,.5,.01).name("命中挤压量"),Ct.add(Tt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),Ct.add(Tt,"torsoGain",0,1,.05).name("躯干跟随比例"),Ct.add(Tt,"volumeExp",0,1.5,.05).name("体积补偿指数");const Mt=h(Zt,"武器握持 / 腕部"),vt=t.weaponWrist;Mt.add(vt,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),Mt.add(vt,"lag",0,.08,.002).name("臂速 → 腕滞后"),Mt.add(vt,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),Mt.add(vt,"rate",4,50,1).name("腕部跟随速率 (1/s)"),Mt.add(vt,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),Mt.add(vt,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const mt=t.weaponMount;Mt.add(mt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),Mt.add(mt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),Mt.add(mt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),Mt.add(mt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),Mt.add(mt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),Mt.add(mt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),Mt.add(mt,"swordPitchDeg",0,90,1).name("剑前倾角"),Mt.add(mt,"swordYawDeg",0,45,1).name("剑外张角"),Mt.add(mt,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),Mt.add(mt,"staffPitchDeg",0,60,1).name("法杖前倾角");const kt=c("假人 / 混战"),F=o.dummies,R=h(kt,"普通假人 AI");R.add(F,"moveSpeed",.5,8,.1).name("移动速度"),R.add(F,"wanderRadius",.5,8,.1).name("游走半径"),R.add(F,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),R.add(F,"followStopDistance",.3,5,.1).name("跟随停距"),R.add(F,"keepDistance",1,10,.1).name("保持距离"),R.add(F,"keepDeadZone",.1,2,.05).name("保持死区"),R.add(F,"attackRange",.5,5,.1).name("攻击距离"),R.add(F,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),R.add(F,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const K=F.fighters;if(K){const St=h(kt,"持械陪练（剑盾 / 双刀 / 大剑）");St.add(K,"moveSpeed",.5,6,.1).name("移动速度"),St.add(K,"attackInterval",.5,8,.1).name("攻击间隔 (s)"),St.add(K,"attackRangeScale",.5,1.2,.02).name("起手距离 / 武器 reach"),St.add(K,"knockbackScale",0,2,.05).name("击退比例"),St.add(K,"leashRadius",0,14,.5).name("牵引半径 (m)"),St.add(K,"comboCount",0,3,1).name("连击段数 (0=随武器)"),St.add(K,"comboGap",0,.6,.01).name("段间缝隙 (s, 0=用全局)");const Yt=()=>n.dummies.find(Dt=>Dt.weapon!==null),gt={get mode(){var Dt;return((Dt=Yt())==null?void 0:Dt.mode)??"spar"},set mode(Dt){i.setFighterMode(Dt)}};St.add(gt,"mode",Rp).name("陪练行为（全部）")}const pt=c("相机"),et=h(pt,"基础");et.add(t.camera,"pitchDeg",20,80,1).name("俯角"),et.add(t.camera,"yawDeg",-180,180,1).name("方位角"),et.add(t.camera,"distance",6,35,.5).name("距离"),et.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),et.add(t.camera,"fov",25,90,1).name("FOV");const ot=o.camera,yt=h(pt,"智能构图");yt.add(ot,"radius",2,18,.5).name("威胁评估半径 (m)"),yt.add(ot,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),yt.add(ot,"saturation",.5,8,.1).name("威胁归一化饱和"),yt.add(ot,"pushIn",0,.5,.01).name("无威胁推进比例"),yt.add(ot,"maxPullback",0,1,.02).name("最大拉远比例"),yt.add(ot,"maxOffset",0,6,.1).name("最大构图平移 (m)"),yt.add(ot,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),yt.add(ot,"framingBias",0,1,.05).name("威胁质心平移系数"),yt.add(ot,"attackBoost",0,2,.05).name("挥砍中额外加权"),yt.add(ot.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),yt.add(ot.modeWeight,"spar",0,3,.05).name("陪练模式威胁倍率"),yt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const At=h(pt,"缩放");return At.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),At.add(t.zoom,"max",1,4,.05).name("最大拉远上限"),At.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),At.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),At.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),At.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),At.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),At.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(St=>St.close()),l.forEach(St=>St.close()),s.close(),{gui:s,refreshWeapon:()=>O.updateDisplay()}}function ab(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function sb(n,t){return n.find(e=>e.id===t)??null}function zu(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function ob({stations:n,plots:t=[],world:e,view:i,container:a,onResetZoom:s,onPlotTest:o,onClearTestUnits:r}){var T;const l=a??document.getElementById("lab-panel");let c=null,h=null;const f=new Map,d=document.createElement("div");d.id="lab-toast",d.setAttribute("aria-live","polite"),document.body.appendChild(d);let u=0;function p(b){d.textContent=`${b.index} · ${b.name} — ${b.hint}`,d.style.borderColor=b.color,d.classList.add("is-on"),window.clearTimeout(u),u=window.setTimeout(()=>d.classList.remove("is-on"),5e3)}function v(){return ab(n,e.character.position.x,e.character.position.z)}function g(){const b=v(),_=(b==null?void 0:b.id)??null;if(_===c)return;const A=c!==null;c=_;for(const[k,L]of f)L.classList.toggle("is-active",k===_);h&&(h.textContent=b?`${b.index} · ${b.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",h.style.color=b?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),b?p(b):A&&d.classList.remove("is-on")}function m(b){const _=typeof b=="number"?n.find(A=>A.index===b)??null:sb(n,b);return _?(tv(e,_.spawnX,_.spawnZ),e.camera.centroidX=_.spawnX,e.camera.centroidZ=_.spawnZ,i.snapCamera(_.spawnX,e.character.position.y,_.spawnZ),g(),!0):!1}function y(){Qp(e)}function x(b){return m(b.id),o?o(b):0}function M(){return r?r():0}function w(b){const _=typeof b=="number"?t.find(A=>A.index===b):t.find(A=>A.id===b);return _&&_.testSpawn?x(_):0}const S=t.filter(b=>b.testSpawn),E=b=>{var _,A;return(((_=b.testSpawn)==null?void 0:_.dummies)??0)+(((A=b.testSpawn)==null?void 0:A.fighters)??0)};if(l){l.textContent="";const b=document.createElement("div");b.className="lab-head",b.textContent="测试工位";const _=document.createElement("span");_.className="lab-tip",_.textContent="[ / ] 切换",b.appendChild(_),l.appendChild(b);for(const L of[...n].sort((U,C)=>U.index-C.index)){const U=document.createElement("button");U.type="button",U.className="lab-row",U.dataset.station=L.id,U.dataset.uiButton="",U.style.setProperty("--lab-color",L.color),U.setAttribute("aria-label",`传送到工位 ${L.index}：${L.name}`);const C=document.createElement("span");C.className="lab-idx",C.textContent=String(L.index);const D=document.createElement("span");D.className="lab-name",D.textContent=L.name,U.append(C,D),U.addEventListener("pointerdown",B=>{B.preventDefault(),B.stopPropagation(),m(L.id)}),l.appendChild(U),f.set(L.id,U)}if(h=document.createElement("div"),h.className="lab-hint",l.appendChild(h),S.length>0){const L=document.createElement("div");L.className="lab-head lab-subhead",L.textContent="地块测试";const U=document.createElement("span");U.className="lab-tip",U.textContent="就地生成",L.appendChild(U),l.appendChild(L);for(const C of S){const D=document.createElement("div");D.className="lab-row lab-test-row",D.dataset.plot=C.id;const B=document.createElement("span");B.className="lab-name",B.textContent=C.name;const O=document.createElement("button");O.type="button",O.className="lab-btn lab-test",O.dataset.uiButton="",O.dataset.plotTest=C.id,O.textContent=((T=C.testSpawn)==null?void 0:T.label)??`生成 ${E(C)} 人`,O.setAttribute("aria-label",`在${C.name}就地生成 ${E(C)} 个测试单位`),O.addEventListener("pointerdown",X=>{X.preventDefault(),X.stopPropagation(),x(C)}),D.append(B,O),l.appendChild(D)}}const A=document.createElement("div");A.className="lab-foot";const k=document.createElement("button");if(k.type="button",k.className="lab-btn",k.dataset.uiButton="",k.textContent="召回假人",k.setAttribute("aria-label","召回全部假人回到各自工位"),k.addEventListener("pointerdown",L=>{L.preventDefault(),L.stopPropagation(),y()}),A.appendChild(k),S.length>0){const L=document.createElement("button");L.type="button",L.className="lab-btn",L.dataset.uiButton="",L.dataset.clearTestUnits="",L.textContent="清除测试单位",L.setAttribute("aria-label","清除所有由地块测试按钮生成的假人与陪练"),L.addEventListener("pointerdown",U=>{U.preventDefault(),U.stopPropagation(),M()}),A.appendChild(L)}if(s){const L=document.createElement("button");L.type="button",L.className="lab-btn",L.dataset.uiButton="",L.textContent="镜头归位",L.setAttribute("aria-label","把镜头缩放恢复到默认"),L.addEventListener("pointerdown",U=>{U.preventDefault(),U.stopPropagation(),s()}),A.appendChild(L)}l.appendChild(A)}return window.addEventListener("keydown",b=>{var _,A;if(!(b.metaKey||b.ctrlKey||b.altKey))if(b.key==="["){const k=zu(n,((_=v())==null?void 0:_.id)??c,-1);k&&m(k.id)}else if(b.key==="]"){const k=zu(n,((A=v())==null?void 0:A.id)??c,1);k&&m(k.id)}else b.key==="\\"&&y()}),g(),{goto:m,current:v,tick:g,recall:y,spawnAt:w,clearSpawned:M,element:l}}const Zc=Math.PI*2,Si={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},rb=45,cb=50;function lb(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function oo(n,t,e){const i=lb(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function hb(n,t){return Math.atan2(n,-t)*180/Math.PI}function Fu(n,t){return Math.abs(((n-t)%360+540)%360-180)}function er(n){return(n%360+360)%360}const db={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function ub(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),h=o>.001?oo(s.moveX,s.moveZ,e):null,f=c>.15?oo(l.x,l.z,e):null,d=oo(Math.sin(a.facing),Math.cos(a.facing),e),u=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?oo(s.aimX,s.aimZ,e):null,p=n.targeting,v=p.hasTarget?oo(Math.sin(p.targetYaw),Math.cos(p.targetYaw),e):null,g=h!==null&&f!==null?Fu(h,f):null,m=h!==null?Fu(h,d):null,y=g!==null&&g>rb&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?hb(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:c,faceDeg:d,lockDeg:v,lockId:p.targetId,lockDist:p.targetDist,aimDeg:u,gapMove:g,gapFace:m,warnMove:y}}function Uu(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>cb&&(n.inLen>=.35||n.speed>=.4)}const Nu="harness.dirDebug";function fb(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(Nu)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function h(x){if(l=x,!t)try{window.localStorage.setItem(Nu,x?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&h(!l)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*f),a.height=Math.round(d*f);let u=db,p=0,v="",g=8;function m(x){if(!r)return;const M=d,w=d,S=M/2,E=w/2,T=Math.min(M,w)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,M,w),r.beginPath(),r.arc(S,E,T,0,Zc),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":Si.ring,r.stroke(),r.strokeStyle=Si.grid,r.beginPath(),r.moveTo(S-T,E),r.lineTo(S+T,E),r.moveTo(S,E-T),r.lineTo(S,E+T),r.stroke();for(let k=0;k<8;k++){const L=k*Math.PI/4,U=S+Math.sin(L)*(T-3),C=E-Math.cos(L)*(T-3),D=S+Math.sin(L)*T,B=E-Math.cos(L)*T;r.beginPath(),r.moveTo(U,C),r.lineTo(D,B),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=Si.dead,r.beginPath(),r.arc(S,E,T*b,0,Zc),r.stroke(),r.restore());const _=(k,L,U,C,D=!1,B=1)=>{const O=k*Math.PI/180,X=Math.sin(O),it=-Math.cos(O),ht=T*Math.max(.14,Math.min(1,L)),ft=S+X*T*.14,Rt=E+it*T*.14,Z=S+X*ht,at=E+it*ht;if(r.save(),r.globalAlpha=B,r.strokeStyle=U,r.fillStyle=U,r.lineWidth=C,r.lineCap="round",D&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(ft,Rt),r.lineTo(Z,at),r.stroke(),!D&&ht>T*.3){const dt=-it,st=X,nt=5.2;r.beginPath(),r.moveTo(Z+X*1.5,at+it*1.5),r.lineTo(Z-X*nt+dt*nt*.72,at-it*nt+st*nt*.72),r.lineTo(Z-X*nt-dt*nt*.72,at-it*nt-st*nt*.72),r.closePath(),r.fill()}r.restore()},A=(k,L)=>{const U=k*Math.PI/180,C=Math.sin(U),D=-Math.cos(U),B=-D,O=C,X=T+1.5,it=X+6.5;r.save(),r.fillStyle=L,r.strokeStyle=L,r.lineWidth=1,r.beginPath(),r.moveTo(S+C*it,E+D*it),r.lineTo(S+C*X+B*4,E+D*X+O*4),r.lineTo(S+C*X-B*4,E+D*X-O*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&_(x.lockDeg,1,Si.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&_(x.rawDeg,x.rawLen,Si.raw,1,!0,.9),x.aimDeg!==null&&_(x.aimDeg,1,Si.aim,1.6,!0,.95),_(x.faceDeg,1,Si.face,1.1,!0,.55),x.moveDeg!==null&&_(x.moveDeg,x.speed/Math.max(1,g),Si.move,5.5,!1,.8),x.inDeg!==null&&_(x.inDeg,x.inLen,Si.input,2.2),A(x.faceDeg,Si.face),r.beginPath(),r.arc(S,E,2.2,0,Zc),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function y(x,M){const w=T=>T===null?"-":String(Math.round(er(T)));o.in.textContent=`入 ${w(x.inDeg)}`,o.mv.textContent=`移 ${w(x.moveDeg)}`,o.fc.textContent=`面 ${w(x.faceDeg)}`;const S=T=>T===null?"-":`${Math.round(T)}°`,E=[`Δ入→移 ${S(x.gapMove)}`,`Δ入→面 ${S(x.gapFace)}`];x.speed>.05&&E.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&E.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&E.push("拖拽瞄准"),o.gap.textContent=E.join("  "),e.classList.toggle("is-warn",x.warnMove||Uu(x,M))}return{update(x,M,w){if(!l)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const S=ub(x,M,w,g);u=S;const E=x.combat.phase!=="idle";m(S);const T=performance.now(),b=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(T-p>90||b!==v)&&(p=T,v=b,y(S,E),e.dataset.in=S.inDeg===null?"":er(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":er(S.moveDeg).toFixed(1),e.dataset.fc=er(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||Uu(S,E)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>u}}const pb=6,mb=480,Ou=240,Bu=128,gb=18,xb=.05,Hu=.16,vb=.02;function Gu(n,t,e){if(!e)return"air";if(t<xb)return"both";const i=Math.sin(n);return i>Hu?"L":i<-Hu?"R":"both"}function Vu(n){const t=Math.PI*2;return(n%t+t)%t}function Xu(n,t){const e=Math.PI*2;let i=t-n;return i-=Math.round(i/e)*e,n+i}const Wu={L:"#fbbf24",R:"#a78bfa",both:"rgba(148, 163, 184, 0.85)",air:"#38bdf8"},yb={L:"rgba(251, 191, 36, 0.13)",R:"rgba(167, 139, 250, 0.13)",both:"rgba(148, 163, 184, 0.09)",air:"rgba(56, 189, 248, 0.07)"},Mb={L:"左踩",R:"右踩",both:"双踩",air:"腾空"};function _b(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1,phase:0,stance:"both",grounded:!0,moving:!1}}function bb(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function Sb(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function wb(n={}){const t=Math.max(1,n.windowS??pb),e=Math.max(60,n.capacity??mb),i=Math.max(1,n.speedCap??gb),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv / 相位</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="128"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),f=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(Ou*u),l.height=Math.round(Bu*u);const p=fb({deadZone:n.deadZone,container:f,embedded:!0});let v=!1;function g(_){v=_,s.classList.toggle("is-off",!_),!a&&r&&(r.textContent=_?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(_)),r.setAttribute("aria-label",_?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",_=>{_.preventDefault(),_.stopPropagation(),g(!v)}),window.addEventListener("keydown",_=>{_.key.toLowerCase()==="v"&&!_.metaKey&&!_.ctrlKey&&g(!v)}));const m=[];let y=0,x=null,M=0,w=!1,S=-1,E={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1,phase:0,stance:"both"};function T(_){const A=_-t;let k=0;for(;k<m.length&&m[k].t<A;)k++;return m.slice(k)}function b(_,A){if(!d)return;const k=Ou,L=Bu;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,k,L),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,k,L);const U=4,C=4,D=k-U-C,B=9,O=44,X=58,it=20,ht=84,ft=38,Rt=A-t,Z=lt=>U+Math.max(0,Math.min(1,(lt-Rt)/t))*D;for(let lt=0;lt<_.length;lt++){if(!_[lt].busy)continue;const V=Z(_[lt].t),N=lt+1<_.length?Z(_[lt+1].t):V+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(V,B,Math.max(2,N-V),O)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const lt of[B,B+O/2,B+O])d.moveTo(U,lt),d.lineTo(k-C,lt);d.moveTo(U,X+it/2),d.lineTo(k-C,X+it/2);for(const lt of[ht,ht+ft/2,ht+ft])d.moveTo(U,lt),d.lineTo(k-C,lt);d.stroke();const dt=Math.max(1,..._.map(lt=>lt.speed),..._.map(lt=>lt.drive))*1.15,st=lt=>B+O-lt/dt*O;if(_.length>1){d.beginPath(),d.moveTo(Z(_[0].t),st(_[0].speed));for(let lt=1;lt<_.length;lt++)d.lineTo(Z(_[lt].t),st(_[lt].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(Z(_[_.length-1].t),B+O),d.lineTo(Z(_[0].t),B+O),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(Z(_[0].t),st(_[0].drive));for(let lt=1;lt<_.length;lt++)d.lineTo(Z(_[lt].t),st(_[lt].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let nt=.02;for(const lt of _)nt=Math.max(nt,Math.abs(lt.dv));nt*=1.1;const ut=X+it/2,Bt=it/2;for(const lt of _){const V=Math.min(Bt,Math.abs(lt.dv)/nt*Bt);d.fillStyle=lt.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(Z(lt.t)-.7,lt.dv>=0?ut-V:ut,1.4,Math.max(.5,V))}const Zt=lt=>ht+ft/2-lt*(ft/2-1);for(let lt=0;lt<_.length;lt++){const V=_[lt].stance;if(V==="air")continue;const N=Z(_[lt].t),Ct=lt+1<_.length?Z(_[lt+1].t):N+2;d.fillStyle=yb[V],d.fillRect(N,ht,Math.max(1,Ct-N),ft)}if(_.length>1){let lt=Z(_[0].t),V=Zt(Math.sin(_[0].phase));for(let Ct=1;Ct<_.length;Ct++){const Tt=_[Ct-1],Mt=_[Ct],vt=Z(Tt.t),mt=Z(Mt.t),kt=Xu(Tt.phase,Mt.phase),F=Math.max(1,Math.min(16,Math.round((mt-vt)/2)));for(let R=1;R<=F;R++){const K=R/F,pt=Tt.phase+(kt-Tt.phase)*K,et=vt+(mt-vt)*K,ot=Zt(Math.sin(pt)),yt=R===F?Mt.stance:Gu(pt,Tt.moving?1:0,Tt.grounded);d.beginPath(),d.moveTo(lt,V),d.lineTo(et,ot),d.strokeStyle=Wu[yt],d.lineWidth=1.7,d.lineJoin="round",d.stroke(),lt=et,V=ot}}const N=_[_.length-1];d.beginPath(),d.arc(Z(N.t)-1.5,Zt(Math.sin(N.phase)),2.1,0,Math.PI*2),d.fillStyle=Wu[N.stance],d.fill()}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(dt.toFixed(1),U+2,B+8),d.fillText("v",U+2,B+O-2),d.fillText("Δv",U+2,X+9),d.fillStyle="rgba(251, 191, 36, 0.75)",d.fillText("L",U+2,ht+8),d.fillStyle="rgba(167, 139, 250, 0.75)",d.fillText("R",U+2,ht+ft-2),d.textAlign="right",d.fillStyle="rgba(190, 214, 234, 0.55)",d.fillText("0",k-C-2,B+O-2),d.textAlign="left"}return{dirDebug:p,update(_,A,k){var Z;const L=performance.now()/1e3,U=S<0?1/60:Math.max(1e-4,Math.min(.25,L-S));S=L;const C=_.character,D={x:C.position.x,z:C.position.z},B=Math.hypot(C.velocity.x,C.velocity.z),{speed:O,raw:X}=x?bb(x,D,U,i):{speed:0,raw:0},it=_b(y,O,U,L);it.drive=B,it.raw=X,it.busy=Sb(_);const ht=((Z=n.phaseSource)==null?void 0:Z.call(n))??C.gaitPhase;it.phase=ht,it.grounded=C.grounded,it.moving=w&&Math.abs(Xu(M,ht)-M)>vb,M=ht,w=!0,it.stance=Gu(ht,it.moving?1:0,C.grounded),x=D,y=O,m.push(it),m.length>e&&m.shift();const ft=T(L);let Rt=0;for(const at of ft)Rt=Math.max(Rt,at.speed);if(E={speed:O,drive:B,raw:X,dv:it.dv,accel:it.accel,peak:Rt,samples:ft.length,windowS:t,busy:it.busy,phase:Vu(ht),stance:it.stance},p.update(_,A,k),v){b(ft,L);const at=it.dv>=0?"+":"";c.textContent=`v ${O.toFixed(2)} · 驱 ${B.toFixed(2)} · 峰 ${Rt.toFixed(2)} · Δv ${at}${it.dv.toFixed(3)} · ${ft.length} 帧
φ ${Vu(ht).toFixed(2)} · ${Mb[it.stance]}`}},setEnabled:g,toggle(){return g(!v),v},enabled:()=>v,last:()=>({...E}),samples:()=>T(performance.now()/1e3).map(_=>({..._}))}}const Eb=["剑盾","双剑","大剑","法杖","弓"],Tb={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击",spar:"陪练"};function Ab(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,h=l.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=lt=>lt.toFixed(2),p=lt=>(lt*180/Math.PI).toFixed(0),v=Eb[xa.indexOf(f.weapon)]??f.weapon,g=Math.round(f.charge*10),m="|".repeat(g)+".".repeat(10-g),y=t.dash,x=y.phase==="active"&&y.duration>0?(1-y.timer/y.duration)*100:0,M=y.phase==="active"?`${y.kind}@${x.toFixed(0)}%`:`${y.kind} cd${u(y.cooldown)}`,w=a.intents.aimActive?`(${u(a.intents.aimX)},${u(a.intents.aimZ)})`:"-",S=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),E=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),T=Math.abs(S)+Math.abs(E)+1e-6,b=Math.round(Math.abs(E)/T*100),_=`strafe ${b}%${S<-.05?" back":""}`,A=t.camera,k=`threat ${(A.threat*100).toFixed(0)}%  dist×${u(A.distanceScale)}  off (${u(A.offsetX)},${u(A.offsetZ)})  pitch +${u(A.pitchDelta)}°  n=${A.threatCount}`,L=o?u(o.attackBlend):"-",U=o==null?void 0:o.attackWeights,C=U?`gw ${u(U.gaitScale)}  lw ${u(U.attackLegWeight)}  spd ${u(U.driveSpeed)}`:"-",D=U?`${u(U.gaitScale)}/${u(U.attackLegWeight)}`:"-",B=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",O=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",X=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",it=o==null?void 0:o.hurt,ht=it?`hurt ${t.playerHurt.type}  部位h${u(it.hitHeight)}  脉冲p${u(it.pulse)}  上身${u(it.upperShift)}  重心${u(it.comShift)}  后坐${u(it.pelvisBack)}  屈膝${u(it.knee)}`:"-",ft=it?`${u(it.hitHeight)}/${u(it.pulse)}/${u(it.knee)}`:"-",Rt=o==null?void 0:o.ik,Z=Rt?`${Rt.active?"on":"off"} w${u(Rt.weight)} e${u(Rt.maxError)}`:"-",at=t.playerLink,dt=`link ${at.kind||"-"}  ${at.phase}  prog ${u(at.progress)}  win ${u(at.linkWindow)}s  cd ${u(at.cooldown)}s  hits ${at.hitIds.length}  travel ${u(at.travelled)}/${u(at.travel)}m  id ${at.id}`,st=`${at.phase}/${at.kind||"-"}/w${u(at.linkWindow)}`,nt=a.lastGesture,ut=nt?`${nt.button} ${nt.kind} ${nt.heldMs.toFixed(0)}ms d${nt.distance.toFixed(0)}px ${nt.angleDeg.toFixed(0)}° taps${nt.taps}`:"-",Bt=t.dummies.map(lt=>`${lt.id}:${Tb[lt.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${v} ${f.phase} · lk ${at.phase}${at.kind?`/${at.kind}`:""} w${u(at.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(c.x)},${u(c.y)},${u(c.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${p(l.facing)}  body ${p(l.bodyYaw)}  head ${p(l.headYaw)}  move ${p(l.moveYaw)}  st${b}%  stick(${u(a.stickX)},${u(a.stickY)}) ${a.source}  str${u(l.stride)}`,`weapon ${v}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${M}  ab ${L}  gw/lw ${D}  land ${O}  ik ${Z}`,`aim ${w}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ft}`,`dummies ${Bt}  atkCount ${t.dummyAttackCount}  cam ${(A.threat*100).toFixed(0)}% ×${u(A.distanceScale)}  ${X}  lk ${st}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(s.timeScale)}${s.paused?" [P]":""}  g ${ut}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(c.x)}, ${u(c.y)}, ${u(c.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${p(l.facing)}deg   atkBlend ${L}   ${C}   land ${B}`,ht,`ik ${Z}  clamped ${Rt?Rt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${p(l.facing)}  body ${p(l.bodyYaw)}  head ${p(l.headYaw)}  move ${p(l.moveYaw)}  (head-body ${p(l.headYaw-l.bodyYaw)})  ${_}`,`move (${u(a.intents.moveX)}, ${u(a.intents.moveZ)})  stick (${u(a.stickX)}, ${u(a.stickY)})  ${a.source}  aim ${w}`,`weapon ${v}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${y.kind}  phase ${y.phase}  prog ${x.toFixed(0)}%  cd ${u(y.cooldown)}s  id ${y.id}  from (${u(y.fromX)},${u(y.fromZ)}) → to (${u(y.toX)},${u(y.toZ)})`,dt,`camera ${k}  ${X}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${p(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${m}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Bt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${ut}`].join(`
`)}}}const nr=["lab","hud","motion","debug"],Yu={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},$u={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function Rb(n){var l;const t=Object.fromEntries(nr.map(c=>[c,document.getElementById($u[c].toggle)])),e=Object.fromEntries(nr.map(c=>[c,document.getElementById($u[c].panel)]));let i={},a=null;function s(){var c,h,f;for(const d of nr){const u=a===d,p=t[d],v=e[d];p&&(p.setAttribute("aria-expanded",String(u)),p.textContent=`${Yu[d].short} ${u?"▾":"▸"}`,p.setAttribute("aria-label",`${u?"收起":"展开"}${Yu[d].full}`)),v&&v.classList.toggle("is-open",u)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of nr)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const td="170",Pb=0,Zu=1,Cb=2,ym=1,Mm=2,Vi=3,ya=0,Gn=1,$e=2,pa=0,Cs=1,Wi=2,qu=3,ju=4,Lb=5,Oa=100,kb=101,Db=102,Ib=103,zb=104,Fb=200,Ub=201,Nb=202,Ob=203,jl=204,Kl=205,Bb=206,Hb=207,Gb=208,Vb=209,Xb=210,Wb=211,Yb=212,$b=213,Zb=214,Jl=0,Ql=1,th=2,Os=3,eh=4,nh=5,ih=6,ah=7,ed=0,qb=1,jb=2,ma=0,Kb=1,Jb=2,Qb=3,t1=4,e1=5,n1=6,i1=7,_m=300,Bs=301,Hs=302,sh=303,oh=304,gc=306,rh=1e3,Ga=1001,ch=1002,Jn=1003,a1=1004,ir=1005,Pi=1006,qc=1007,Va=1008,qi=1009,bm=1010,Sm=1011,Uo=1012,nd=1013,Ya=1014,Ci=1015,Xo=1016,id=1017,ad=1018,Gs=1020,wm=35902,Em=1021,Tm=1022,gi=1023,Am=1024,Rm=1025,Ls=1026,Vs=1027,sd=1028,od=1029,Pm=1030,rd=1031,cd=1033,Nr=33776,Or=33777,Br=33778,Hr=33779,lh=35840,hh=35841,dh=35842,uh=35843,fh=36196,ph=37492,mh=37496,gh=37808,xh=37809,vh=37810,yh=37811,Mh=37812,_h=37813,bh=37814,Sh=37815,wh=37816,Eh=37817,Th=37818,Ah=37819,Rh=37820,Ph=37821,Gr=36492,Ch=36494,Lh=36495,Cm=36283,kh=36284,Dh=36285,Ih=36286,s1=3200,o1=3201,Lm=0,r1=1,ca="",Fn="srgb",Ws="srgb-linear",xc="linear",Fe="srgb",os=7680,Ku=519,c1=512,l1=513,h1=514,km=515,d1=516,u1=517,f1=518,p1=519,zh=35044,Eo=35048,Ju="300 es",$i=2e3,ic=2001;class Ys{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const wn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Qu=1234567;const ks=Math.PI/180,No=180/Math.PI;function ki(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(wn[n&255]+wn[n>>8&255]+wn[n>>16&255]+wn[n>>24&255]+"-"+wn[t&255]+wn[t>>8&255]+"-"+wn[t>>16&15|64]+wn[t>>24&255]+"-"+wn[e&63|128]+wn[e>>8&255]+"-"+wn[e>>16&255]+wn[e>>24&255]+wn[i&255]+wn[i>>8&255]+wn[i>>16&255]+wn[i>>24&255]).toLowerCase()}function bn(n,t,e){return Math.max(t,Math.min(e,n))}function ld(n,t){return(n%t+t)%t}function m1(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function g1(n,t,e){return n!==t?(e-n)/(t-n):0}function To(n,t,e){return(1-e)*n+e*t}function x1(n,t,e,i){return To(n,t,1-Math.exp(-e*i))}function v1(n,t=1){return t-Math.abs(ld(n,t*2)-t)}function y1(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function M1(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function _1(n,t){return n+Math.floor(Math.random()*(t-n+1))}function b1(n,t){return n+Math.random()*(t-n)}function S1(n){return n*(.5-Math.random())}function w1(n){n!==void 0&&(Qu=n);let t=Qu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function E1(n){return n*ks}function T1(n){return n*No}function A1(n){return(n&n-1)===0&&n!==0}function R1(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function P1(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function C1(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),f=s((t-i)/2),d=o((t-i)/2),u=s((i-t)/2),p=o((i-t)/2);switch(a){case"XYX":n.set(r*h,l*f,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*f,r*c);break;case"ZXZ":n.set(l*f,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*p,l*u,r*c);break;case"YXY":n.set(l*u,r*h,l*p,r*c);break;case"ZYZ":n.set(l*p,l*u,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function mi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ie(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const tf={DEG2RAD:ks,RAD2DEG:No,generateUUID:ki,clamp:bn,euclideanModulo:ld,mapLinear:m1,inverseLerp:g1,lerp:To,damp:x1,pingpong:v1,smoothstep:y1,smootherstep:M1,randInt:_1,randFloat:b1,randFloatSpread:S1,seededRandom:w1,degToRad:E1,radToDeg:T1,isPowerOfTwo:A1,ceilPowerOfTwo:R1,floorPowerOfTwo:P1,setQuaternionFromProperEuler:C1,normalize:Ie,denormalize:mi};class Gt{constructor(t=0,e=0){Gt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(bn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Me{constructor(t,e,i,a,s,o,r,l,c){Me.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],p=i[8],v=a[0],g=a[3],m=a[6],y=a[1],x=a[4],M=a[7],w=a[2],S=a[5],E=a[8];return s[0]=o*v+r*y+l*w,s[3]=o*g+r*x+l*S,s[6]=o*m+r*M+l*E,s[1]=c*v+h*y+f*w,s[4]=c*g+h*x+f*S,s[7]=c*m+h*M+f*E,s[2]=d*v+u*y+p*w,s[5]=d*g+u*x+p*S,s[8]=d*m+u*M+p*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*s*h+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*o-r*c,d=r*l-h*s,u=c*s-o*l,p=e*f+i*d+a*u;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return t[0]=f*v,t[1]=(a*c-h*i)*v,t[2]=(r*i-a*o)*v,t[3]=d*v,t[4]=(h*e-a*l)*v,t[5]=(a*s-r*e)*v,t[6]=u*v,t[7]=(i*l-c*e)*v,t[8]=(o*e-i*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(jc.makeScale(t,e)),this}rotate(t){return this.premultiply(jc.makeRotation(-t)),this}translate(t,e){return this.premultiply(jc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const jc=new Me;function Dm(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function ac(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function L1(){const n=ac("canvas");return n.style.display="block",n}const ef={};function yo(n){n in ef||(ef[n]=!0,console.warn(n))}function k1(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function D1(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function I1(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Re={enabled:!0,workingColorSpace:Ws,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Fe&&(n.r=Zi(n.r),n.g=Zi(n.g),n.b=Zi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Fe&&(n.r=Ds(n.r),n.g=Ds(n.g),n.b=Ds(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===ca?xc:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Zi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ds(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const nf=[.64,.33,.3,.6,.15,.06],af=[.2126,.7152,.0722],sf=[.3127,.329],of=new Me().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),rf=new Me().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Re.define({[Ws]:{primaries:nf,whitePoint:sf,transfer:xc,toXYZ:of,fromXYZ:rf,luminanceCoefficients:af,workingColorSpaceConfig:{unpackColorSpace:Fn},outputColorSpaceConfig:{drawingBufferColorSpace:Fn}},[Fn]:{primaries:nf,whitePoint:sf,transfer:Fe,toXYZ:of,fromXYZ:rf,luminanceCoefficients:af,outputColorSpaceConfig:{drawingBufferColorSpace:Fn}}});let rs;class z1{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{rs===void 0&&(rs=ac("canvas")),rs.width=t.width,rs.height=t.height;const i=rs.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=rs}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ac("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=Zi(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Zi(e[i]/255)*255):e[i]=Zi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let F1=0;class Im{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:F1++}),this.uuid=ki(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(Kc(a[o].image)):s.push(Kc(a[o]))}else s=Kc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function Kc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?z1.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let U1=0;class An extends Ys{constructor(t=An.DEFAULT_IMAGE,e=An.DEFAULT_MAPPING,i=Ga,a=Ga,s=Pi,o=Va,r=gi,l=qi,c=An.DEFAULT_ANISOTROPY,h=ca){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:U1++}),this.uuid=ki(),this.name="",this.source=new Im(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Gt(0,0),this.repeat=new Gt(1,1),this.center=new Gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Me,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==_m)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case rh:t.x=t.x-Math.floor(t.x);break;case Ga:t.x=t.x<0?0:1;break;case ch:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case rh:t.y=t.y-Math.floor(t.y);break;case Ga:t.y=t.y<0?0:1;break;case ch:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}An.DEFAULT_IMAGE=null;An.DEFAULT_MAPPING=_m;An.DEFAULT_ANISOTROPY=1;class tn{constructor(t=0,e=0,i=0,a=1){tn.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],p=l[9],v=l[2],g=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-v)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+v)<.1&&Math.abs(p+g)<.1&&Math.abs(c+u+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,M=(u+1)/2,w=(m+1)/2,S=(h+d)/4,E=(f+v)/4,T=(p+g)/4;return x>M&&x>w?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=S/i,s=E/i):M>w?M<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(M),i=S/a,s=T/a):w<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(w),i=E/s,a=T/s),this.set(i,a,s,e),this}let y=Math.sqrt((g-p)*(g-p)+(f-v)*(f-v)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(g-p)/y,this.y=(f-v)/y,this.z=(d-h)/y,this.w=Math.acos((c+u+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class N1 extends Ys{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new tn(0,0,t,e),this.scissorTest=!1,this.viewport=new tn(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new An(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Im(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class $a extends N1{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class zm extends An{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=Jn,this.minFilter=Jn,this.wrapR=Ga,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class O1 extends An{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=Jn,this.minFilter=Jn,this.wrapR=Ga,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ga{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],h=i[a+2],f=i[a+3];const d=s[o+0],u=s[o+1],p=s[o+2],v=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=p,t[e+3]=v;return}if(f!==v||l!==d||c!==u||h!==p){let g=1-r;const m=l*d+c*u+h*p+f*v,y=m>=0?1:-1,x=1-m*m;if(x>Number.EPSILON){const w=Math.sqrt(x),S=Math.atan2(w,m*y);g=Math.sin(g*S)/w,r=Math.sin(r*S)/w}const M=r*y;if(l=l*g+d*M,c=c*g+u*M,h=h*g+p*M,f=f*g+v*M,g===1-r){const w=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=w,c*=w,h*=w,f*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],h=i[a+3],f=s[o],d=s[o+1],u=s[o+2],p=s[o+3];return t[e]=r*p+h*f+l*u-c*d,t[e+1]=l*p+h*d+c*f-r*u,t[e+2]=c*p+h*u+r*d-l*f,t[e+3]=h*p-r*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(a/2),f=r(s/2),d=l(i/2),u=l(a/2),p=l(s/2);switch(o){case"XYZ":this._x=d*h*f+c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f-d*u*p;break;case"YXZ":this._x=d*h*f+c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f+d*u*p;break;case"ZXY":this._x=d*h*f-c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f-d*u*p;break;case"ZYX":this._x=d*h*f-c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f+d*u*p;break;case"YZX":this._x=d*h*f+c*u*p,this._y=c*u*f+d*h*p,this._z=c*h*p-d*u*f,this._w=c*h*f-d*u*p;break;case"XZY":this._x=d*h*f-c*u*p,this._y=c*u*f-d*h*p,this._z=c*h*p+d*u*f,this._w=c*h*f+d*u*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(s-c)*u,this._z=(o-a)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-l)/u,this._x=.25*u,this._y=(a+o)/u,this._z=(s+c)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(s-c)/u,this._x=(a+o)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-a)/u,this._x=(s+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(bn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+a*c-s*l,this._y=a*h+o*l+s*r-i*c,this._z=s*h+o*c+i*l-a*r,this._w=o*h-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*a+e*this._y,this._z=u*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=a*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(t=0,e=0,i=0){G.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(cf.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(cf.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),h=2*(r*e-s*a),f=2*(s*i-o*e);return this.x=e+l*c+o*f-r*h,this.y=i+l*h+r*c-s*f,this.z=a+l*f+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Jc.copy(this).projectOnVector(t),this.sub(Jc)}reflect(t){return this.sub(Jc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(bn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Jc=new G,cf=new ga;class qa{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ui.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ui.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ui.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ui):ui.fromBufferAttribute(s,o),ui.applyMatrix4(t.matrixWorld),this.expandByPoint(ui);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ar.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ar.copy(i.boundingBox)),ar.applyMatrix4(t.matrixWorld),this.union(ar)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ui),ui.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ro),sr.subVectors(this.max,ro),cs.subVectors(t.a,ro),ls.subVectors(t.b,ro),hs.subVectors(t.c,ro),na.subVectors(ls,cs),ia.subVectors(hs,ls),Aa.subVectors(cs,hs);let e=[0,-na.z,na.y,0,-ia.z,ia.y,0,-Aa.z,Aa.y,na.z,0,-na.x,ia.z,0,-ia.x,Aa.z,0,-Aa.x,-na.y,na.x,0,-ia.y,ia.x,0,-Aa.y,Aa.x,0];return!Qc(e,cs,ls,hs,sr)||(e=[1,0,0,0,1,0,0,0,1],!Qc(e,cs,ls,hs,sr))?!1:(or.crossVectors(na,ia),e=[or.x,or.y,or.z],Qc(e,cs,ls,hs,sr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ui).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ui).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ui),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Ui=[new G,new G,new G,new G,new G,new G,new G,new G],ui=new G,ar=new qa,cs=new G,ls=new G,hs=new G,na=new G,ia=new G,Aa=new G,ro=new G,sr=new G,or=new G,Ra=new G;function Qc(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){Ra.fromArray(n,s);const r=a.x*Math.abs(Ra.x)+a.y*Math.abs(Ra.y)+a.z*Math.abs(Ra.z),l=t.dot(Ra),c=e.dot(Ra),h=i.dot(Ra);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const B1=new qa,co=new G,tl=new G;class $s{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):B1.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;co.subVectors(t,this.center);const e=co.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(co,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(tl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(co.copy(t.center).add(tl)),this.expandByPoint(co.copy(t.center).sub(tl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ni=new G,el=new G,rr=new G,aa=new G,nl=new G,cr=new G,il=new G;class hd{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ni)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ni.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ni.copy(this.origin).addScaledVector(this.direction,e),Ni.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){el.copy(t).add(e).multiplyScalar(.5),rr.copy(e).sub(t).normalize(),aa.copy(this.origin).sub(el);const s=t.distanceTo(e)*.5,o=-this.direction.dot(rr),r=aa.dot(this.direction),l=-aa.dot(rr),c=aa.lengthSq(),h=Math.abs(1-o*o);let f,d,u,p;if(h>0)if(f=o*l-r,d=o*r-l,p=s*h,f>=0)if(d>=-p)if(d<=p){const v=1/h;f*=v,d*=v,u=f*(f+o*d+2*r)+d*(o*f+d+2*l)+c}else d=s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d<=-p?(f=Math.max(0,-(-o*s+r)),d=f>0?-s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c):d<=p?(f=0,d=Math.min(Math.max(-s,-l),s),u=d*(d+2*l)+c):(f=Math.max(0,-(o*s+r)),d=f>0?s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c);else d=o>0?-s:s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),a&&a.copy(el).addScaledVector(rr,d),u}intersectSphere(t,e){Ni.subVectors(t.center,this.origin);const i=Ni.dot(this.direction),a=Ni.dot(Ni)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,a=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,a=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),f>=0?(r=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Ni)!==null}intersectTriangle(t,e,i,a,s){nl.subVectors(e,t),cr.subVectors(i,t),il.crossVectors(nl,cr);let o=this.direction.dot(il),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;aa.subVectors(this.origin,t);const l=r*this.direction.dot(cr.crossVectors(aa,cr));if(l<0)return null;const c=r*this.direction.dot(nl.cross(aa));if(c<0||l+c>o)return null;const h=-r*aa.dot(il);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ce{constructor(t,e,i,a,s,o,r,l,c,h,f,d,u,p,v,g){Ce.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,h,f,d,u,p,v,g)}set(t,e,i,a,s,o,r,l,c,h,f,d,u,p,v,g){const m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=a,m[1]=s,m[5]=o,m[9]=r,m[13]=l,m[2]=c,m[6]=h,m[10]=f,m[14]=d,m[3]=u,m[7]=p,m[11]=v,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ce().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/ds.setFromMatrixColumn(t,0).length(),s=1/ds.setFromMatrixColumn(t,1).length(),o=1/ds.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const d=o*h,u=o*f,p=r*h,v=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+p*c,e[5]=d-v*c,e[9]=-r*l,e[2]=v-d*c,e[6]=p+u*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,p=c*h,v=c*f;e[0]=d+v*r,e[4]=p*r-u,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-p,e[6]=v+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,p=c*h,v=c*f;e[0]=d-v*r,e[4]=-o*f,e[8]=p+u*r,e[1]=u+p*r,e[5]=o*h,e[9]=v-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,u=o*f,p=r*h,v=r*f;e[0]=l*h,e[4]=p*c-u,e[8]=d*c+v,e[1]=l*f,e[5]=v*c+d,e[9]=u*c-p,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,u=o*c,p=r*l,v=r*c;e[0]=l*h,e[4]=v-d*f,e[8]=p*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=u*f+p,e[10]=d-v*f}else if(t.order==="XZY"){const d=o*l,u=o*c,p=r*l,v=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+v,e[5]=o*h,e[9]=u*f-p,e[2]=p*f-u,e[6]=r*h,e[10]=v*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(H1,t,G1)}lookAt(t,e,i){const a=this.elements;return Zn.subVectors(t,e),Zn.lengthSq()===0&&(Zn.z=1),Zn.normalize(),sa.crossVectors(i,Zn),sa.lengthSq()===0&&(Math.abs(i.z)===1?Zn.x+=1e-4:Zn.z+=1e-4,Zn.normalize(),sa.crossVectors(i,Zn)),sa.normalize(),lr.crossVectors(Zn,sa),a[0]=sa.x,a[4]=lr.x,a[8]=Zn.x,a[1]=sa.y,a[5]=lr.y,a[9]=Zn.y,a[2]=sa.z,a[6]=lr.z,a[10]=Zn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],p=i[2],v=i[6],g=i[10],m=i[14],y=i[3],x=i[7],M=i[11],w=i[15],S=a[0],E=a[4],T=a[8],b=a[12],_=a[1],A=a[5],k=a[9],L=a[13],U=a[2],C=a[6],D=a[10],B=a[14],O=a[3],X=a[7],it=a[11],ht=a[15];return s[0]=o*S+r*_+l*U+c*O,s[4]=o*E+r*A+l*C+c*X,s[8]=o*T+r*k+l*D+c*it,s[12]=o*b+r*L+l*B+c*ht,s[1]=h*S+f*_+d*U+u*O,s[5]=h*E+f*A+d*C+u*X,s[9]=h*T+f*k+d*D+u*it,s[13]=h*b+f*L+d*B+u*ht,s[2]=p*S+v*_+g*U+m*O,s[6]=p*E+v*A+g*C+m*X,s[10]=p*T+v*k+g*D+m*it,s[14]=p*b+v*L+g*B+m*ht,s[3]=y*S+x*_+M*U+w*O,s[7]=y*E+x*A+M*C+w*X,s[11]=y*T+x*k+M*D+w*it,s[15]=y*b+x*L+M*B+w*ht,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],p=t[3],v=t[7],g=t[11],m=t[15];return p*(+s*l*f-a*c*f-s*r*d+i*c*d+a*r*u-i*l*u)+v*(+e*l*u-e*c*d+s*o*d-a*o*u+a*c*h-s*l*h)+g*(+e*c*f-e*r*u-s*o*f+i*o*u+s*r*h-i*c*h)+m*(-a*r*h-e*l*f+e*r*d+a*o*f-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],p=t[12],v=t[13],g=t[14],m=t[15],y=f*g*c-v*d*c+v*l*u-r*g*u-f*l*m+r*d*m,x=p*d*c-h*g*c-p*l*u+o*g*u+h*l*m-o*d*m,M=h*v*c-p*f*c+p*r*u-o*v*u-h*r*m+o*f*m,w=p*f*l-h*v*l-p*r*d+o*v*d+h*r*g-o*f*g,S=e*y+i*x+a*M+s*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=y*E,t[1]=(v*d*s-f*g*s-v*a*u+i*g*u+f*a*m-i*d*m)*E,t[2]=(r*g*s-v*l*s+v*a*c-i*g*c-r*a*m+i*l*m)*E,t[3]=(f*l*s-r*d*s-f*a*c+i*d*c+r*a*u-i*l*u)*E,t[4]=x*E,t[5]=(h*g*s-p*d*s+p*a*u-e*g*u-h*a*m+e*d*m)*E,t[6]=(p*l*s-o*g*s-p*a*c+e*g*c+o*a*m-e*l*m)*E,t[7]=(o*d*s-h*l*s+h*a*c-e*d*c-o*a*u+e*l*u)*E,t[8]=M*E,t[9]=(p*f*s-h*v*s-p*i*u+e*v*u+h*i*m-e*f*m)*E,t[10]=(o*v*s-p*r*s+p*i*c-e*v*c-o*i*m+e*r*m)*E,t[11]=(h*r*s-o*f*s-h*i*c+e*f*c+o*i*u-e*r*u)*E,t[12]=w*E,t[13]=(h*v*a-p*f*a+p*i*d-e*v*d-h*i*g+e*f*g)*E,t[14]=(p*r*a-o*v*a-p*i*l+e*v*l+o*i*g-e*r*g)*E,t[15]=(o*f*a-h*r*a+h*i*l-e*f*l-o*i*d+e*r*d)*E,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,h=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+i,h*l-a*o,0,c*l-a*r,h*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,h=o+o,f=r+r,d=s*c,u=s*h,p=s*f,v=o*h,g=o*f,m=r*f,y=l*c,x=l*h,M=l*f,w=i.x,S=i.y,E=i.z;return a[0]=(1-(v+m))*w,a[1]=(u+M)*w,a[2]=(p-x)*w,a[3]=0,a[4]=(u-M)*S,a[5]=(1-(d+m))*S,a[6]=(g+y)*S,a[7]=0,a[8]=(p+x)*E,a[9]=(g-y)*E,a[10]=(1-(d+v))*E,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=ds.set(a[0],a[1],a[2]).length();const o=ds.set(a[4],a[5],a[6]).length(),r=ds.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],fi.copy(this);const c=1/s,h=1/o,f=1/r;return fi.elements[0]*=c,fi.elements[1]*=c,fi.elements[2]*=c,fi.elements[4]*=h,fi.elements[5]*=h,fi.elements[6]*=h,fi.elements[8]*=f,fi.elements[9]*=f,fi.elements[10]*=f,e.setFromRotationMatrix(fi),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=$i){const l=this.elements,c=2*s/(e-t),h=2*s/(i-a),f=(e+t)/(e-t),d=(i+a)/(i-a);let u,p;if(r===$i)u=-(o+s)/(o-s),p=-2*o*s/(o-s);else if(r===ic)u=-o/(o-s),p=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=u,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=$i){const l=this.elements,c=1/(e-t),h=1/(i-a),f=1/(o-s),d=(e+t)*c,u=(i+a)*h;let p,v;if(r===$i)p=(o+s)*f,v=-2*f;else if(r===ic)p=s*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-u,l[2]=0,l[6]=0,l[10]=v,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ds=new G,fi=new Ce,H1=new G(0,0,0),G1=new G(1,1,1),sa=new G,lr=new G,Zn=new G,lf=new Ce,hf=new ga;class Di{constructor(t=0,e=0,i=0,a=Di.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],h=a[9],f=a[2],d=a[6],u=a[10];switch(e){case"XYZ":this._y=Math.asin(bn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-bn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(bn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-bn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(bn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-bn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return lf.makeRotationFromQuaternion(t),this.setFromRotationMatrix(lf,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return hf.setFromEuler(this),this.setFromQuaternion(hf,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Di.DEFAULT_ORDER="XYZ";class dd{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let V1=0;const df=new G,us=new ga,Oi=new Ce,hr=new G,lo=new G,X1=new G,W1=new ga,uf=new G(1,0,0),ff=new G(0,1,0),pf=new G(0,0,1),mf={type:"added"},Y1={type:"removed"},fs={type:"childadded",child:null},al={type:"childremoved",child:null};class Ke extends Ys{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:V1++}),this.uuid=ki(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ke.DEFAULT_UP.clone();const t=new G,e=new Di,i=new ga,a=new G(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Ce},normalMatrix:{value:new Me}}),this.matrix=new Ce,this.matrixWorld=new Ce,this.matrixAutoUpdate=Ke.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return us.setFromAxisAngle(t,e),this.quaternion.multiply(us),this}rotateOnWorldAxis(t,e){return us.setFromAxisAngle(t,e),this.quaternion.premultiply(us),this}rotateX(t){return this.rotateOnAxis(uf,t)}rotateY(t){return this.rotateOnAxis(ff,t)}rotateZ(t){return this.rotateOnAxis(pf,t)}translateOnAxis(t,e){return df.copy(t).applyQuaternion(this.quaternion),this.position.add(df.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(uf,t)}translateY(t){return this.translateOnAxis(ff,t)}translateZ(t){return this.translateOnAxis(pf,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Oi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?hr.copy(t):hr.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),lo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Oi.lookAt(lo,hr,this.up):Oi.lookAt(hr,lo,this.up),this.quaternion.setFromRotationMatrix(Oi),a&&(Oi.extractRotation(a.matrixWorld),us.setFromRotationMatrix(Oi),this.quaternion.premultiply(us.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(mf),fs.child=t,this.dispatchEvent(fs),fs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Y1),al.child=t,this.dispatchEvent(al),al.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Oi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Oi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Oi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(mf),fs.child=t,this.dispatchEvent(fs),fs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lo,t,X1),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lo,W1,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),p=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),p.length>0&&(i.nodes=p)}return i.object=a,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}Ke.DEFAULT_UP=new G(0,1,0);Ke.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const pi=new G,Bi=new G,sl=new G,Hi=new G,ps=new G,ms=new G,gf=new G,ol=new G,rl=new G,cl=new G,ll=new tn,hl=new tn,dl=new tn;class Kn{constructor(t=new G,e=new G,i=new G){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),pi.subVectors(t,e),a.cross(pi);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){pi.subVectors(a,e),Bi.subVectors(i,e),sl.subVectors(t,e);const o=pi.dot(pi),r=pi.dot(Bi),l=pi.dot(sl),c=Bi.dot(Bi),h=Bi.dot(sl),f=o*c-r*r;if(f===0)return s.set(0,0,0),null;const d=1/f,u=(c*l-r*h)*d,p=(o*h-r*l)*d;return s.set(1-u-p,p,u)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Hi)===null?!1:Hi.x>=0&&Hi.y>=0&&Hi.x+Hi.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,Hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Hi.x),l.addScaledVector(o,Hi.y),l.addScaledVector(r,Hi.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return ll.setScalar(0),hl.setScalar(0),dl.setScalar(0),ll.fromBufferAttribute(t,e),hl.fromBufferAttribute(t,i),dl.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(ll,s.x),o.addScaledVector(hl,s.y),o.addScaledVector(dl,s.z),o}static isFrontFacing(t,e,i,a){return pi.subVectors(i,e),Bi.subVectors(t,e),pi.cross(Bi).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pi.subVectors(this.c,this.b),Bi.subVectors(this.a,this.b),pi.cross(Bi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Kn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Kn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return Kn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return Kn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Kn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;ps.subVectors(a,i),ms.subVectors(s,i),ol.subVectors(t,i);const l=ps.dot(ol),c=ms.dot(ol);if(l<=0&&c<=0)return e.copy(i);rl.subVectors(t,a);const h=ps.dot(rl),f=ms.dot(rl);if(h>=0&&f<=h)return e.copy(a);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(ps,o);cl.subVectors(t,s);const u=ps.dot(cl),p=ms.dot(cl);if(p>=0&&u<=p)return e.copy(s);const v=u*c-l*p;if(v<=0&&c>=0&&p<=0)return r=c/(c-p),e.copy(i).addScaledVector(ms,r);const g=h*p-u*f;if(g<=0&&f-h>=0&&u-p>=0)return gf.subVectors(s,a),r=(f-h)/(f-h+(u-p)),e.copy(a).addScaledVector(gf,r);const m=1/(g+v+d);return o=v*m,r=d*m,e.copy(i).addScaledVector(ps,o).addScaledVector(ms,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Fm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},oa={h:0,s:0,l:0},dr={h:0,s:0,l:0};function ul(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class te{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Fn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Re.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Re.workingColorSpace){return this.r=t,this.g=e,this.b=i,Re.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Re.workingColorSpace){if(t=ld(t,1),e=bn(e,0,1),i=bn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=ul(o,s,t+1/3),this.g=ul(o,s,t),this.b=ul(o,s,t-1/3)}return Re.toWorkingColorSpace(this,a),this}setStyle(t,e=Fn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Fn){const i=Fm[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Zi(t.r),this.g=Zi(t.g),this.b=Zi(t.b),this}copyLinearToSRGB(t){return this.r=Ds(t.r),this.g=Ds(t.g),this.b=Ds(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Fn){return Re.fromWorkingColorSpace(En.copy(this),t),Math.round(bn(En.r*255,0,255))*65536+Math.round(bn(En.g*255,0,255))*256+Math.round(bn(En.b*255,0,255))}getHexString(t=Fn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Re.workingColorSpace){Re.fromWorkingColorSpace(En.copy(this),e);const i=En.r,a=En.g,s=En.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const f=o-r;switch(c=h<=.5?f/(o+r):f/(2-o-r),o){case i:l=(a-s)/f+(a<s?6:0);break;case a:l=(s-i)/f+2;break;case s:l=(i-a)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Re.workingColorSpace){return Re.fromWorkingColorSpace(En.copy(this),e),t.r=En.r,t.g=En.g,t.b=En.b,t}getStyle(t=Fn){Re.fromWorkingColorSpace(En.copy(this),t);const e=En.r,i=En.g,a=En.b;return t!==Fn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(oa),this.setHSL(oa.h+t,oa.s+e,oa.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(oa),t.getHSL(dr);const i=To(oa.h,dr.h,e),a=To(oa.s,dr.s,e),s=To(oa.l,dr.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const En=new te;te.NAMES=Fm;let $1=0;class ja extends Ys{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$1++}),this.uuid=ki(),this.name="",this.blending=Cs,this.side=ya,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=jl,this.blendDst=Kl,this.blendEquation=Oa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new te(0,0,0),this.blendAlpha=0,this.depthFunc=Os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ku,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=os,this.stencilZFail=os,this.stencilZPass=os,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Cs&&(i.blending=this.blending),this.side!==ya&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==jl&&(i.blendSrc=this.blendSrc),this.blendDst!==Kl&&(i.blendDst=this.blendDst),this.blendEquation!==Oa&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Os&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ku&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==os&&(i.stencilFail=this.stencilFail),this.stencilZFail!==os&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==os&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class yn extends ja{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Di,this.combine=ed,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const cn=new G,ur=new Gt;class Mn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=zh,this.updateRanges=[],this.gpuType=Ci,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ur.fromBufferAttribute(this,e),ur.applyMatrix3(t),this.setXY(e,ur.x,ur.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.applyMatrix3(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.applyMatrix4(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.applyNormalMatrix(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.transformDirection(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=mi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ie(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=mi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=mi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=mi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=mi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array),a=Ie(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array),a=Ie(a,this.array),s=Ie(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==zh&&(t.usage=this.usage),t}}class Um extends Mn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Nm extends Mn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Le extends Mn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Z1=0;const ii=new Ce,fl=new Ke,gs=new G,qn=new qa,ho=new qa,vn=new G;class an extends Ys{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Z1++}),this.uuid=ki(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Dm(t)?Nm:Um)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Me().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ii.makeRotationFromQuaternion(t),this.applyMatrix4(ii),this}rotateX(t){return ii.makeRotationX(t),this.applyMatrix4(ii),this}rotateY(t){return ii.makeRotationY(t),this.applyMatrix4(ii),this}rotateZ(t){return ii.makeRotationZ(t),this.applyMatrix4(ii),this}translate(t,e,i){return ii.makeTranslation(t,e,i),this.applyMatrix4(ii),this}scale(t,e,i){return ii.makeScale(t,e,i),this.applyMatrix4(ii),this}lookAt(t){return fl.lookAt(t),fl.updateMatrix(),this.applyMatrix4(fl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gs).negate(),this.translate(gs.x,gs.y,gs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Le(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qa);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];qn.setFromBufferAttribute(s),this.morphTargetsRelative?(vn.addVectors(this.boundingBox.min,qn.min),this.boundingBox.expandByPoint(vn),vn.addVectors(this.boundingBox.max,qn.max),this.boundingBox.expandByPoint(vn)):(this.boundingBox.expandByPoint(qn.min),this.boundingBox.expandByPoint(qn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $s);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(t){const i=this.boundingSphere.center;if(qn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];ho.setFromBufferAttribute(r),this.morphTargetsRelative?(vn.addVectors(qn.min,ho.min),qn.expandByPoint(vn),vn.addVectors(qn.max,ho.max),qn.expandByPoint(vn)):(qn.expandByPoint(ho.min),qn.expandByPoint(ho.max))}qn.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)vn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(vn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)vn.fromBufferAttribute(r,c),l&&(gs.fromBufferAttribute(t,c),vn.add(gs)),a=Math.max(a,i.distanceToSquared(vn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Mn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let T=0;T<i.count;T++)r[T]=new G,l[T]=new G;const c=new G,h=new G,f=new G,d=new Gt,u=new Gt,p=new Gt,v=new G,g=new G;function m(T,b,_){c.fromBufferAttribute(i,T),h.fromBufferAttribute(i,b),f.fromBufferAttribute(i,_),d.fromBufferAttribute(s,T),u.fromBufferAttribute(s,b),p.fromBufferAttribute(s,_),h.sub(c),f.sub(c),u.sub(d),p.sub(d);const A=1/(u.x*p.y-p.x*u.y);isFinite(A)&&(v.copy(h).multiplyScalar(p.y).addScaledVector(f,-u.y).multiplyScalar(A),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-p.x).multiplyScalar(A),r[T].add(v),r[b].add(v),r[_].add(v),l[T].add(g),l[b].add(g),l[_].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let T=0,b=y.length;T<b;++T){const _=y[T],A=_.start,k=_.count;for(let L=A,U=A+k;L<U;L+=3)m(t.getX(L+0),t.getX(L+1),t.getX(L+2))}const x=new G,M=new G,w=new G,S=new G;function E(T){w.fromBufferAttribute(a,T),S.copy(w);const b=r[T];x.copy(b),x.sub(w.multiplyScalar(w.dot(b))).normalize(),M.crossVectors(S,b);const A=M.dot(l[T])<0?-1:1;o.setXYZW(T,x.x,x.y,x.z,A)}for(let T=0,b=y.length;T<b;++T){const _=y[T],A=_.start,k=_.count;for(let L=A,U=A+k;L<U;L+=3)E(t.getX(L+0)),E(t.getX(L+1)),E(t.getX(L+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Mn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const a=new G,s=new G,o=new G,r=new G,l=new G,c=new G,h=new G,f=new G;if(t)for(let d=0,u=t.count;d<u;d+=3){const p=t.getX(d+0),v=t.getX(d+1),g=t.getX(d+2);a.fromBufferAttribute(e,p),s.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),r.fromBufferAttribute(i,p),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,g),r.add(h),l.add(h),c.add(h),i.setXYZ(p,r.x,r.y,r.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)vn.fromBufferAttribute(t,e),vn.normalize(),t.setXYZ(e,vn.x,vn.y,vn.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,d=new c.constructor(l.length*h);let u=0,p=0;for(let v=0,g=l.length;v<g;v++){r.isInterleavedBufferAttribute?u=l[v]*r.data.stride+r.offset:u=l[v]*h;for(let m=0;m<h;m++)d[p++]=c[u++]}return new Mn(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new an,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,i);l.push(u)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(a[l]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],f=s[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const xf=new Ce,Pa=new hd,fr=new $s,vf=new G,pr=new G,mr=new G,gr=new G,pl=new G,xr=new G,yf=new G,vr=new G;class re extends Ke{constructor(t=new an,e=new yn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){xr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=r[l],f=s[l];h!==0&&(pl.fromBufferAttribute(f,t),o?xr.addScaledVector(pl,h):xr.addScaledVector(pl.sub(e),h))}e.add(xr)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),fr.copy(i.boundingSphere),fr.applyMatrix4(s),Pa.copy(t.ray).recast(t.near),!(fr.containsPoint(Pa.origin)===!1&&(Pa.intersectSphere(fr,vf)===null||Pa.origin.distanceToSquared(vf)>(t.far-t.near)**2))&&(xf.copy(s).invert(),Pa.copy(t.ray).applyMatrix4(xf),!(i.boundingBox!==null&&Pa.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Pa)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,d=s.groups,u=s.drawRange;if(r!==null)if(Array.isArray(o))for(let p=0,v=d.length;p<v;p++){const g=d[p],m=o[g.materialIndex],y=Math.max(g.start,u.start),x=Math.min(r.count,Math.min(g.start+g.count,u.start+u.count));for(let M=y,w=x;M<w;M+=3){const S=r.getX(M),E=r.getX(M+1),T=r.getX(M+2);a=yr(this,m,t,i,c,h,f,S,E,T),a&&(a.faceIndex=Math.floor(M/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const p=Math.max(0,u.start),v=Math.min(r.count,u.start+u.count);for(let g=p,m=v;g<m;g+=3){const y=r.getX(g),x=r.getX(g+1),M=r.getX(g+2);a=yr(this,o,t,i,c,h,f,y,x,M),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,v=d.length;p<v;p++){const g=d[p],m=o[g.materialIndex],y=Math.max(g.start,u.start),x=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let M=y,w=x;M<w;M+=3){const S=M,E=M+1,T=M+2;a=yr(this,m,t,i,c,h,f,S,E,T),a&&(a.faceIndex=Math.floor(M/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const p=Math.max(0,u.start),v=Math.min(l.count,u.start+u.count);for(let g=p,m=v;g<m;g+=3){const y=g,x=g+1,M=g+2;a=yr(this,o,t,i,c,h,f,y,x,M),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function q1(n,t,e,i,a,s,o,r){let l;if(t.side===Gn?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===ya,r),l===null)return null;vr.copy(r),vr.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(vr);return c<e.near||c>e.far?null:{distance:c,point:vr.clone(),object:n}}function yr(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,pr),n.getVertexPosition(l,mr),n.getVertexPosition(c,gr);const h=q1(n,t,e,i,pr,mr,gr,yf);if(h){const f=new G;Kn.getBarycoord(yf,pr,mr,gr,f),a&&(h.uv=Kn.getInterpolatedAttribute(a,r,l,c,f,new Gt)),s&&(h.uv1=Kn.getInterpolatedAttribute(s,r,l,c,f,new Gt)),o&&(h.normal=Kn.getInterpolatedAttribute(o,r,l,c,f,new G),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new G,materialIndex:0};Kn.getNormal(pr,mr,gr,d.normal),h.face=d,h.barycoord=f}return h}class Vn extends an{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,u=0;p("z","y","x",-1,-1,i,e,t,o,s,0),p("z","y","x",1,-1,i,e,-t,o,s,1),p("x","z","y",1,1,t,i,e,a,o,2),p("x","z","y",1,-1,t,i,-e,a,o,3),p("x","y","z",1,-1,t,e,i,a,s,4),p("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new Le(c,3)),this.setAttribute("normal",new Le(h,3)),this.setAttribute("uv",new Le(f,2));function p(v,g,m,y,x,M,w,S,E,T,b){const _=M/E,A=w/T,k=M/2,L=w/2,U=S/2,C=E+1,D=T+1;let B=0,O=0;const X=new G;for(let it=0;it<D;it++){const ht=it*A-L;for(let ft=0;ft<C;ft++){const Rt=ft*_-k;X[v]=Rt*y,X[g]=ht*x,X[m]=U,c.push(X.x,X.y,X.z),X[v]=0,X[g]=0,X[m]=S>0?1:-1,h.push(X.x,X.y,X.z),f.push(ft/E),f.push(1-it/T),B+=1}}for(let it=0;it<T;it++)for(let ht=0;ht<E;ht++){const ft=d+ht+C*it,Rt=d+ht+C*(it+1),Z=d+(ht+1)+C*(it+1),at=d+(ht+1)+C*it;l.push(ft,Rt,at),l.push(Rt,Z,at),O+=6}r.addGroup(u,O,b),u+=O,d+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Xs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function In(n){const t={};for(let e=0;e<n.length;e++){const i=Xs(n[e]);for(const a in i)t[a]=i[a]}return t}function j1(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Om(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Re.workingColorSpace}const K1={clone:Xs,merge:In};var J1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Q1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ma extends ja{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=J1,this.fragmentShader=Q1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Xs(t.uniforms),this.uniformsGroups=j1(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Bm extends Ke{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ce,this.projectionMatrix=new Ce,this.projectionMatrixInverse=new Ce,this.coordinateSystem=$i}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ra=new G,Mf=new Gt,_f=new Gt;class si extends Bm{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=No*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ks*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return No*2*Math.atan(Math.tan(ks*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ra.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ra.x,ra.y).multiplyScalar(-t/ra.z),ra.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ra.x,ra.y).multiplyScalar(-t/ra.z)}getViewSize(t,e){return this.getViewBounds(t,Mf,_f),e.subVectors(_f,Mf)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ks*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const xs=-90,vs=1;class tS extends Ke{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new si(xs,vs,t,e);a.layers=this.layers,this.add(a);const s=new si(xs,vs,t,e);s.layers=this.layers,this.add(s);const o=new si(xs,vs,t,e);o.layers=this.layers,this.add(o);const r=new si(xs,vs,t,e);r.layers=this.layers,this.add(r);const l=new si(xs,vs,t,e);l.layers=this.layers,this.add(l);const c=new si(xs,vs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===$i)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ic)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class Hm extends An{constructor(t,e,i,a,s,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Bs,super(t,e,i,a,s,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class eS extends $a{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Hm(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Pi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new Vn(5,5,5),s=new Ma({name:"CubemapFromEquirect",uniforms:Xs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Gn,blending:pa});s.uniforms.tEquirect.value=e;const o=new re(a,s),r=e.minFilter;return e.minFilter===Va&&(e.minFilter=Pi),new tS(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const ml=new G,nS=new G,iS=new Me;class Fa{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=ml.subVectors(i,e).cross(nS.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(ml),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||iS.getNormalMatrix(t),a=this.coplanarPoint(ml).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ca=new $s,Mr=new G;class ud{constructor(t=new Fa,e=new Fa,i=new Fa,a=new Fa,s=new Fa,o=new Fa){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=$i){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],h=a[5],f=a[6],d=a[7],u=a[8],p=a[9],v=a[10],g=a[11],m=a[12],y=a[13],x=a[14],M=a[15];if(i[0].setComponents(l-s,d-c,g-u,M-m).normalize(),i[1].setComponents(l+s,d+c,g+u,M+m).normalize(),i[2].setComponents(l+o,d+h,g+p,M+y).normalize(),i[3].setComponents(l-o,d-h,g-p,M-y).normalize(),i[4].setComponents(l-r,d-f,g-v,M-x).normalize(),e===$i)i[5].setComponents(l+r,d+f,g+v,M+x).normalize();else if(e===ic)i[5].setComponents(r,f,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ca.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ca.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ca)}intersectsSprite(t){return Ca.center.set(0,0,0),Ca.radius=.7071067811865476,Ca.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ca)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(Mr.x=a.normal.x>0?t.max.x:t.min.x,Mr.y=a.normal.y>0?t.max.y:t.min.y,Mr.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(Mr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Gm(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function aS(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,r),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,p)=>u.start-p.start);let d=0;for(let u=1;u<f.length;u++){const p=f[d],v=f[u];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++d,f[d]=v)}f.length=d+1;for(let u=0,p=f.length;u<p;u++){const v=f[u];n.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class ai extends an{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,h=l+1,f=t/r,d=e/l,u=[],p=[],v=[],g=[];for(let m=0;m<h;m++){const y=m*d-o;for(let x=0;x<c;x++){const M=x*f-s;p.push(M,-y,0),v.push(0,0,1),g.push(x/r),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let y=0;y<r;y++){const x=y+c*m,M=y+c*(m+1),w=y+1+c*(m+1),S=y+1+c*m;u.push(x,M,S),u.push(M,w,S)}this.setIndex(u),this.setAttribute("position",new Le(p,3)),this.setAttribute("normal",new Le(v,3)),this.setAttribute("uv",new Le(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ai(t.width,t.height,t.widthSegments,t.heightSegments)}}var sS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,oS=`#ifdef USE_ALPHAHASH
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
#endif`,rS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,hS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,dS=`#ifdef USE_AOMAP
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
#endif`,uS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,fS=`#ifdef USE_BATCHING
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
#endif`,pS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,mS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,gS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xS=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,vS=`#ifdef USE_IRIDESCENCE
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
#endif`,yS=`#ifdef USE_BUMPMAP
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
#endif`,MS=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,_S=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,bS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,SS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,wS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ES=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,TS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,AS=`#if defined( USE_COLOR_ALPHA )
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
#endif`,RS=`#define PI 3.141592653589793
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
} // validated`,PS=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,CS=`vec3 transformedNormal = objectNormal;
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
#endif`,LS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,kS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,DS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,IS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,zS="gl_FragColor = linearToOutputTexel( gl_FragColor );",FS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,US=`#ifdef USE_ENVMAP
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
#endif`,NS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,OS=`#ifdef USE_ENVMAP
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
#endif`,BS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,HS=`#ifdef USE_ENVMAP
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
#endif`,GS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,VS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,XS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,WS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,YS=`#ifdef USE_GRADIENTMAP
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
}`,$S=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ZS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,qS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,jS=`uniform bool receiveShadow;
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
#endif`,KS=`#ifdef USE_ENVMAP
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
#endif`,JS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,QS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tw=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ew=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,nw=`PhysicalMaterial material;
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
#endif`,iw=`struct PhysicalMaterial {
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
}`,aw=`
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
#endif`,sw=`#if defined( RE_IndirectDiffuse )
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
#endif`,ow=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,rw=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cw=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lw=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hw=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,dw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,uw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,fw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,pw=`#if defined( USE_POINTS_UV )
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
#endif`,mw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,gw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,vw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mw=`#ifdef USE_MORPHTARGETS
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
#endif`,_w=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Sw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,ww=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ew=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Aw=`#ifdef USE_NORMALMAP
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
#endif`,Rw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Cw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Lw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,kw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Dw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Iw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,zw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Fw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Uw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Nw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ow=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Bw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Hw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Gw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Vw=`float getShadowMask() {
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
}`,Xw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ww=`#ifdef USE_SKINNING
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
#endif`,Yw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$w=`#ifdef USE_SKINNING
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
#endif`,Zw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,qw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Kw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Jw=`#ifdef USE_TRANSMISSION
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
#endif`,Qw=`#ifdef USE_TRANSMISSION
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
#endif`,tE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,eE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,nE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,iE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const aE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,sE=`uniform sampler2D t2D;
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
}`,oE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rE=`#ifdef ENVMAP_TYPE_CUBE
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
}`,cE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hE=`#include <common>
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
}`,dE=`#if DEPTH_PACKING == 3200
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
}`,uE=`#define DISTANCE
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
}`,fE=`#define DISTANCE
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
}`,pE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,mE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gE=`uniform float scale;
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
}`,xE=`uniform vec3 diffuse;
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
}`,vE=`#include <common>
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
}`,yE=`uniform vec3 diffuse;
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
}`,ME=`#define LAMBERT
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
}`,_E=`#define LAMBERT
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
}`,bE=`#define MATCAP
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
}`,SE=`#define MATCAP
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
}`,wE=`#define NORMAL
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
}`,EE=`#define NORMAL
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
}`,TE=`#define PHONG
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
}`,AE=`#define PHONG
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
}`,RE=`#define STANDARD
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
}`,PE=`#define STANDARD
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
}`,CE=`#define TOON
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
}`,LE=`#define TOON
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
}`,kE=`uniform float size;
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
}`,DE=`uniform vec3 diffuse;
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
}`,IE=`#include <common>
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
}`,zE=`uniform vec3 color;
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
}`,FE=`uniform float rotation;
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
}`,UE=`uniform vec3 diffuse;
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
}`,_e={alphahash_fragment:sS,alphahash_pars_fragment:oS,alphamap_fragment:rS,alphamap_pars_fragment:cS,alphatest_fragment:lS,alphatest_pars_fragment:hS,aomap_fragment:dS,aomap_pars_fragment:uS,batching_pars_vertex:fS,batching_vertex:pS,begin_vertex:mS,beginnormal_vertex:gS,bsdfs:xS,iridescence_fragment:vS,bumpmap_pars_fragment:yS,clipping_planes_fragment:MS,clipping_planes_pars_fragment:_S,clipping_planes_pars_vertex:bS,clipping_planes_vertex:SS,color_fragment:wS,color_pars_fragment:ES,color_pars_vertex:TS,color_vertex:AS,common:RS,cube_uv_reflection_fragment:PS,defaultnormal_vertex:CS,displacementmap_pars_vertex:LS,displacementmap_vertex:kS,emissivemap_fragment:DS,emissivemap_pars_fragment:IS,colorspace_fragment:zS,colorspace_pars_fragment:FS,envmap_fragment:US,envmap_common_pars_fragment:NS,envmap_pars_fragment:OS,envmap_pars_vertex:BS,envmap_physical_pars_fragment:KS,envmap_vertex:HS,fog_vertex:GS,fog_pars_vertex:VS,fog_fragment:XS,fog_pars_fragment:WS,gradientmap_pars_fragment:YS,lightmap_pars_fragment:$S,lights_lambert_fragment:ZS,lights_lambert_pars_fragment:qS,lights_pars_begin:jS,lights_toon_fragment:JS,lights_toon_pars_fragment:QS,lights_phong_fragment:tw,lights_phong_pars_fragment:ew,lights_physical_fragment:nw,lights_physical_pars_fragment:iw,lights_fragment_begin:aw,lights_fragment_maps:sw,lights_fragment_end:ow,logdepthbuf_fragment:rw,logdepthbuf_pars_fragment:cw,logdepthbuf_pars_vertex:lw,logdepthbuf_vertex:hw,map_fragment:dw,map_pars_fragment:uw,map_particle_fragment:fw,map_particle_pars_fragment:pw,metalnessmap_fragment:mw,metalnessmap_pars_fragment:gw,morphinstance_vertex:xw,morphcolor_vertex:vw,morphnormal_vertex:yw,morphtarget_pars_vertex:Mw,morphtarget_vertex:_w,normal_fragment_begin:bw,normal_fragment_maps:Sw,normal_pars_fragment:ww,normal_pars_vertex:Ew,normal_vertex:Tw,normalmap_pars_fragment:Aw,clearcoat_normal_fragment_begin:Rw,clearcoat_normal_fragment_maps:Pw,clearcoat_pars_fragment:Cw,iridescence_pars_fragment:Lw,opaque_fragment:kw,packing:Dw,premultiplied_alpha_fragment:Iw,project_vertex:zw,dithering_fragment:Fw,dithering_pars_fragment:Uw,roughnessmap_fragment:Nw,roughnessmap_pars_fragment:Ow,shadowmap_pars_fragment:Bw,shadowmap_pars_vertex:Hw,shadowmap_vertex:Gw,shadowmask_pars_fragment:Vw,skinbase_vertex:Xw,skinning_pars_vertex:Ww,skinning_vertex:Yw,skinnormal_vertex:$w,specularmap_fragment:Zw,specularmap_pars_fragment:qw,tonemapping_fragment:jw,tonemapping_pars_fragment:Kw,transmission_fragment:Jw,transmission_pars_fragment:Qw,uv_pars_fragment:tE,uv_pars_vertex:eE,uv_vertex:nE,worldpos_vertex:iE,background_vert:aE,background_frag:sE,backgroundCube_vert:oE,backgroundCube_frag:rE,cube_vert:cE,cube_frag:lE,depth_vert:hE,depth_frag:dE,distanceRGBA_vert:uE,distanceRGBA_frag:fE,equirect_vert:pE,equirect_frag:mE,linedashed_vert:gE,linedashed_frag:xE,meshbasic_vert:vE,meshbasic_frag:yE,meshlambert_vert:ME,meshlambert_frag:_E,meshmatcap_vert:bE,meshmatcap_frag:SE,meshnormal_vert:wE,meshnormal_frag:EE,meshphong_vert:TE,meshphong_frag:AE,meshphysical_vert:RE,meshphysical_frag:PE,meshtoon_vert:CE,meshtoon_frag:LE,points_vert:kE,points_frag:DE,shadow_vert:IE,shadow_frag:zE,sprite_vert:FE,sprite_frag:UE},Ht={common:{diffuse:{value:new te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Me},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Me}},envmap:{envMap:{value:null},envMapRotation:{value:new Me},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Me}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Me}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Me},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Me},normalScale:{value:new Gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Me},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Me}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Me}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Me}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0},uvTransform:{value:new Me}},sprite:{diffuse:{value:new te(16777215)},opacity:{value:1},center:{value:new Gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Me},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0}}},Ai={basic:{uniforms:In([Ht.common,Ht.specularmap,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.fog]),vertexShader:_e.meshbasic_vert,fragmentShader:_e.meshbasic_frag},lambert:{uniforms:In([Ht.common,Ht.specularmap,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.fog,Ht.lights,{emissive:{value:new te(0)}}]),vertexShader:_e.meshlambert_vert,fragmentShader:_e.meshlambert_frag},phong:{uniforms:In([Ht.common,Ht.specularmap,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.fog,Ht.lights,{emissive:{value:new te(0)},specular:{value:new te(1118481)},shininess:{value:30}}]),vertexShader:_e.meshphong_vert,fragmentShader:_e.meshphong_frag},standard:{uniforms:In([Ht.common,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.roughnessmap,Ht.metalnessmap,Ht.fog,Ht.lights,{emissive:{value:new te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_e.meshphysical_vert,fragmentShader:_e.meshphysical_frag},toon:{uniforms:In([Ht.common,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.gradientmap,Ht.fog,Ht.lights,{emissive:{value:new te(0)}}]),vertexShader:_e.meshtoon_vert,fragmentShader:_e.meshtoon_frag},matcap:{uniforms:In([Ht.common,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.fog,{matcap:{value:null}}]),vertexShader:_e.meshmatcap_vert,fragmentShader:_e.meshmatcap_frag},points:{uniforms:In([Ht.points,Ht.fog]),vertexShader:_e.points_vert,fragmentShader:_e.points_frag},dashed:{uniforms:In([Ht.common,Ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_e.linedashed_vert,fragmentShader:_e.linedashed_frag},depth:{uniforms:In([Ht.common,Ht.displacementmap]),vertexShader:_e.depth_vert,fragmentShader:_e.depth_frag},normal:{uniforms:In([Ht.common,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,{opacity:{value:1}}]),vertexShader:_e.meshnormal_vert,fragmentShader:_e.meshnormal_frag},sprite:{uniforms:In([Ht.sprite,Ht.fog]),vertexShader:_e.sprite_vert,fragmentShader:_e.sprite_frag},background:{uniforms:{uvTransform:{value:new Me},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_e.background_vert,fragmentShader:_e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Me}},vertexShader:_e.backgroundCube_vert,fragmentShader:_e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_e.cube_vert,fragmentShader:_e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_e.equirect_vert,fragmentShader:_e.equirect_frag},distanceRGBA:{uniforms:In([Ht.common,Ht.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_e.distanceRGBA_vert,fragmentShader:_e.distanceRGBA_frag},shadow:{uniforms:In([Ht.lights,Ht.fog,{color:{value:new te(0)},opacity:{value:1}}]),vertexShader:_e.shadow_vert,fragmentShader:_e.shadow_frag}};Ai.physical={uniforms:In([Ai.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Me},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Me},clearcoatNormalScale:{value:new Gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Me},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Me},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Me},sheen:{value:0},sheenColor:{value:new te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Me},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Me},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Me},transmissionSamplerSize:{value:new Gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Me},attenuationDistance:{value:0},attenuationColor:{value:new te(0)},specularColor:{value:new te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Me},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Me},anisotropyVector:{value:new Gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Me}}]),vertexShader:_e.meshphysical_vert,fragmentShader:_e.meshphysical_frag};const _r={r:0,b:0,g:0},La=new Di,NE=new Ce;function OE(n,t,e,i,a,s,o){const r=new te(0);let l=s===!0?0:1,c,h,f=null,d=0,u=null;function p(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?e:t).get(x)),x}function v(y){let x=!1;const M=p(y);M===null?m(r,l):M&&M.isColor&&(m(M,1),x=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(y,x){const M=p(x);M&&(M.isCubeTexture||M.mapping===gc)?(h===void 0&&(h=new re(new Vn(1,1,1),new Ma({name:"BackgroundCubeMaterial",uniforms:Xs(Ai.backgroundCube.uniforms),vertexShader:Ai.backgroundCube.vertexShader,fragmentShader:Ai.backgroundCube.fragmentShader,side:Gn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),La.copy(x.backgroundRotation),La.x*=-1,La.y*=-1,La.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(La.y*=-1,La.z*=-1),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(NE.makeRotationFromEuler(La)),h.material.toneMapped=Re.getTransfer(M.colorSpace)!==Fe,(f!==M||d!==M.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=M,d=M.version,u=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new re(new ai(2,2),new Ma({name:"BackgroundMaterial",uniforms:Xs(Ai.background.uniforms),vertexShader:Ai.background.vertexShader,fragmentShader:Ai.background.fragmentShader,side:ya,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Re.getTransfer(M.colorSpace)!==Fe,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(f!==M||d!==M.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=M,d=M.version,u=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function m(y,x){y.getRGB(_r,Om(n)),i.buffers.color.setClear(_r.r,_r.g,_r.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(y,x=1){r.set(y),l=x,m(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,m(r,l)},render:v,addToRenderList:g}}function BE(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(_,A,k,L,U){let C=!1;const D=f(L,k,A);s!==D&&(s=D,c(s.object)),C=u(_,L,k,U),C&&p(_,L,k,U),U!==null&&t.update(U,n.ELEMENT_ARRAY_BUFFER),(C||o)&&(o=!1,M(_,A,k,L),U!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return n.createVertexArray()}function c(_){return n.bindVertexArray(_)}function h(_){return n.deleteVertexArray(_)}function f(_,A,k){const L=k.wireframe===!0;let U=i[_.id];U===void 0&&(U={},i[_.id]=U);let C=U[A.id];C===void 0&&(C={},U[A.id]=C);let D=C[L];return D===void 0&&(D=d(l()),C[L]=D),D}function d(_){const A=[],k=[],L=[];for(let U=0;U<e;U++)A[U]=0,k[U]=0,L[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:k,attributeDivisors:L,object:_,attributes:{},index:null}}function u(_,A,k,L){const U=s.attributes,C=A.attributes;let D=0;const B=k.getAttributes();for(const O in B)if(B[O].location>=0){const it=U[O];let ht=C[O];if(ht===void 0&&(O==="instanceMatrix"&&_.instanceMatrix&&(ht=_.instanceMatrix),O==="instanceColor"&&_.instanceColor&&(ht=_.instanceColor)),it===void 0||it.attribute!==ht||ht&&it.data!==ht.data)return!0;D++}return s.attributesNum!==D||s.index!==L}function p(_,A,k,L){const U={},C=A.attributes;let D=0;const B=k.getAttributes();for(const O in B)if(B[O].location>=0){let it=C[O];it===void 0&&(O==="instanceMatrix"&&_.instanceMatrix&&(it=_.instanceMatrix),O==="instanceColor"&&_.instanceColor&&(it=_.instanceColor));const ht={};ht.attribute=it,it&&it.data&&(ht.data=it.data),U[O]=ht,D++}s.attributes=U,s.attributesNum=D,s.index=L}function v(){const _=s.newAttributes;for(let A=0,k=_.length;A<k;A++)_[A]=0}function g(_){m(_,0)}function m(_,A){const k=s.newAttributes,L=s.enabledAttributes,U=s.attributeDivisors;k[_]=1,L[_]===0&&(n.enableVertexAttribArray(_),L[_]=1),U[_]!==A&&(n.vertexAttribDivisor(_,A),U[_]=A)}function y(){const _=s.newAttributes,A=s.enabledAttributes;for(let k=0,L=A.length;k<L;k++)A[k]!==_[k]&&(n.disableVertexAttribArray(k),A[k]=0)}function x(_,A,k,L,U,C,D){D===!0?n.vertexAttribIPointer(_,A,k,U,C):n.vertexAttribPointer(_,A,k,L,U,C)}function M(_,A,k,L){v();const U=L.attributes,C=k.getAttributes(),D=A.defaultAttributeValues;for(const B in C){const O=C[B];if(O.location>=0){let X=U[B];if(X===void 0&&(B==="instanceMatrix"&&_.instanceMatrix&&(X=_.instanceMatrix),B==="instanceColor"&&_.instanceColor&&(X=_.instanceColor)),X!==void 0){const it=X.normalized,ht=X.itemSize,ft=t.get(X);if(ft===void 0)continue;const Rt=ft.buffer,Z=ft.type,at=ft.bytesPerElement,dt=Z===n.INT||Z===n.UNSIGNED_INT||X.gpuType===nd;if(X.isInterleavedBufferAttribute){const st=X.data,nt=st.stride,ut=X.offset;if(st.isInstancedInterleavedBuffer){for(let Bt=0;Bt<O.locationSize;Bt++)m(O.location+Bt,st.meshPerAttribute);_.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let Bt=0;Bt<O.locationSize;Bt++)g(O.location+Bt);n.bindBuffer(n.ARRAY_BUFFER,Rt);for(let Bt=0;Bt<O.locationSize;Bt++)x(O.location+Bt,ht/O.locationSize,Z,it,nt*at,(ut+ht/O.locationSize*Bt)*at,dt)}else{if(X.isInstancedBufferAttribute){for(let st=0;st<O.locationSize;st++)m(O.location+st,X.meshPerAttribute);_.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let st=0;st<O.locationSize;st++)g(O.location+st);n.bindBuffer(n.ARRAY_BUFFER,Rt);for(let st=0;st<O.locationSize;st++)x(O.location+st,ht/O.locationSize,Z,it,ht*at,ht/O.locationSize*st*at,dt)}}else if(D!==void 0){const it=D[B];if(it!==void 0)switch(it.length){case 2:n.vertexAttrib2fv(O.location,it);break;case 3:n.vertexAttrib3fv(O.location,it);break;case 4:n.vertexAttrib4fv(O.location,it);break;default:n.vertexAttrib1fv(O.location,it)}}}}y()}function w(){T();for(const _ in i){const A=i[_];for(const k in A){const L=A[k];for(const U in L)h(L[U].object),delete L[U];delete A[k]}delete i[_]}}function S(_){if(i[_.id]===void 0)return;const A=i[_.id];for(const k in A){const L=A[k];for(const U in L)h(L[U].object),delete L[U];delete A[k]}delete i[_.id]}function E(_){for(const A in i){const k=i[A];if(k[_.id]===void 0)continue;const L=k[_.id];for(const U in L)h(L[U].object),delete L[U];delete k[_.id]}}function T(){b(),o=!0,s!==a&&(s=a,c(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:T,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:v,enableAttribute:g,disableUnusedAttributes:y}}function HE(n,t,e){let i;function a(c){i=c}function s(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,f){f!==0&&(n.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function r(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let u=0;for(let p=0;p<f;p++)u+=h[p];e.update(u,i,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let p=0;p<c.length;p++)o(c[p],h[p],d[p]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,f);let p=0;for(let v=0;v<f;v++)p+=h[v]*d[v];e.update(p,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function GE(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(E){return!(E!==gi&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(E){const T=E===Xo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==qi&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Ci&&!T)}function l(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=p>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:M,vertexTextures:w,maxSamples:S}}function VE(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new Fa,r=new Me,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||a;return a=d,i=f.length,u},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const p=f.clippingPlanes,v=f.clipIntersection,g=f.clipShadows,m=n.get(f);if(!a||p===null||p.length===0||s&&!g)s?h(null):c();else{const y=s?0:i,x=y*4;let M=m.clippingState||null;l.value=M,M=h(p,d,x,u);for(let w=0;w!==x;++w)M[w]=e[w];m.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,p){const v=f!==null?f.length:0;let g=null;if(v!==0){if(g=l.value,p!==!0||g===null){const m=u+v*4,y=d.matrixWorldInverse;r.getNormalMatrix(y),(g===null||g.length<m)&&(g=new Float32Array(m));for(let x=0,M=u;x!==v;++x,M+=4)o.copy(f[x]).applyMatrix4(y,r),o.normal.toArray(g,M),g[M+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function XE(n){let t=new WeakMap;function e(o,r){return r===sh?o.mapping=Bs:r===oh&&(o.mapping=Hs),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===sh||r===oh)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new eS(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class Vm extends Bm{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const As=4,bf=[.125,.215,.35,.446,.526,.582],Ba=20,gl=new Vm,Sf=new te;let xl=null,vl=0,yl=0,Ml=!1;const Ua=(1+Math.sqrt(5))/2,ys=1/Ua,wf=[new G(-Ua,ys,0),new G(Ua,ys,0),new G(-ys,0,Ua),new G(ys,0,Ua),new G(0,Ua,-ys),new G(0,Ua,ys),new G(-1,1,-1),new G(1,1,-1),new G(-1,1,1),new G(1,1,1)];class Ef{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){xl=this._renderer.getRenderTarget(),vl=this._renderer.getActiveCubeFace(),yl=this._renderer.getActiveMipmapLevel(),Ml=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Rf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Af(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(xl,vl,yl),this._renderer.xr.enabled=Ml,t.scissorTest=!1,br(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Bs||t.mapping===Hs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),xl=this._renderer.getRenderTarget(),vl=this._renderer.getActiveCubeFace(),yl=this._renderer.getActiveMipmapLevel(),Ml=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Pi,minFilter:Pi,generateMipmaps:!1,type:Xo,format:gi,colorSpace:Ws,depthBuffer:!1},a=Tf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Tf(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=WE(s)),this._blurMaterial=YE(s,t,e)}return a}_compileMaterial(t){const e=new re(this._lodPlanes[0],t);this._renderer.compile(e,gl)}_sceneToCubeUV(t,e,i,a){const r=new si(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(Sf),h.toneMapping=ma,h.autoClear=!1;const u=new yn({name:"PMREM.Background",side:Gn,depthWrite:!1,depthTest:!1}),p=new re(new Vn,u);let v=!1;const g=t.background;g?g.isColor&&(u.color.copy(g),t.background=null,v=!0):(u.color.copy(Sf),v=!0);for(let m=0;m<6;m++){const y=m%3;y===0?(r.up.set(0,l[m],0),r.lookAt(c[m],0,0)):y===1?(r.up.set(0,0,l[m]),r.lookAt(0,c[m],0)):(r.up.set(0,l[m],0),r.lookAt(0,0,c[m]));const x=this._cubeSize;br(a,y*x,m>2?x:0,x,x),h.setRenderTarget(a),v&&h.render(p,r),h.render(t,r)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===Bs||t.mapping===Hs;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Rf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Af());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new re(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;br(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,gl)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=wf[(a-s-1)%wf.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new re(this._lodPlanes[a],c),d=c.uniforms,u=this._sizeLods[i]-1,p=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*Ba-1),v=s/p,g=isFinite(s)?1+Math.floor(h*v):Ba;g>Ba&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ba}`);const m=[];let y=0;for(let E=0;E<Ba;++E){const T=E/v,b=Math.exp(-T*T/2);m.push(b),E===0?y+=b:E<g&&(y+=2*b)}for(let E=0;E<m.length;E++)m[E]=m[E]/y;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:x}=this;d.dTheta.value=p,d.mipInt.value=x-i;const M=this._sizeLods[a],w=3*M*(a>x-As?a-x+As:0),S=4*(this._cubeSize-M);br(e,w,S,3*M,2*M),l.setRenderTarget(e),l.render(f,gl)}}function WE(n){const t=[],e=[],i=[];let a=n;const s=n-As+1+bf.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-As?l=bf[o-n+As-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,p=6,v=3,g=2,m=1,y=new Float32Array(v*p*u),x=new Float32Array(g*p*u),M=new Float32Array(m*p*u);for(let S=0;S<u;S++){const E=S%3*2/3-1,T=S>2?0:-1,b=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];y.set(b,v*p*S),x.set(d,g*p*S);const _=[S,S,S,S,S,S];M.set(_,m*p*S)}const w=new an;w.setAttribute("position",new Mn(y,v)),w.setAttribute("uv",new Mn(x,g)),w.setAttribute("faceIndex",new Mn(M,m)),t.push(w),a>As&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Tf(n,t,e){const i=new $a(n,t,e);return i.texture.mapping=gc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function br(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function YE(n,t,e){const i=new Float32Array(Ba),a=new G(0,1,0);return new Ma({name:"SphericalGaussianBlur",defines:{n:Ba,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:fd(),fragmentShader:`

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
		`,blending:pa,depthTest:!1,depthWrite:!1})}function Af(){return new Ma({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:fd(),fragmentShader:`

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
		`,blending:pa,depthTest:!1,depthWrite:!1})}function Rf(){return new Ma({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:pa,depthTest:!1,depthWrite:!1})}function fd(){return`

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
	`}function $E(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===sh||l===oh,h=l===Bs||l===Hs;if(c||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new Ef(n)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return c&&u&&u.height>0||h&&u&&a(u)?(e===null&&(e=new Ef(n)),f=c?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",s),f.texture):null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function ZE(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&yo("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function qE(n,t,e,i){const a={},s=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const p in d.attributes)t.remove(d.attributes[p]);for(const p in d.morphAttributes){const v=d.morphAttributes[p];for(let g=0,m=v.length;g<m;g++)t.remove(v[g])}d.removeEventListener("dispose",o),delete a[d.id];const u=s.get(d);u&&(t.remove(u),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const p in d)t.update(d[p],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const p in u){const v=u[p];for(let g=0,m=v.length;g<m;g++)t.update(v[g],n.ARRAY_BUFFER)}}function c(f){const d=[],u=f.index,p=f.attributes.position;let v=0;if(u!==null){const y=u.array;v=u.version;for(let x=0,M=y.length;x<M;x+=3){const w=y[x+0],S=y[x+1],E=y[x+2];d.push(w,S,S,E,E,w)}}else if(p!==void 0){const y=p.array;v=p.version;for(let x=0,M=y.length/3-1;x<M;x+=3){const w=x+0,S=x+1,E=x+2;d.push(w,S,S,E,E,w)}}else return;const g=new(Dm(d)?Nm:Um)(d,1);g.version=v;const m=s.get(f);m&&t.remove(m),s.set(f,g)}function h(f){const d=s.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return s.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function jE(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,s,d*o),e.update(u,i,1)}function c(d,u,p){p!==0&&(n.drawElementsInstanced(i,u,s,d*o,p),e.update(u,i,p))}function h(d,u,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,d,0,p);let g=0;for(let m=0;m<p;m++)g+=u[m];e.update(g,i,1)}function f(d,u,p,v){if(p===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<d.length;m++)c(d[m]/o,u[m],v[m]);else{g.multiDrawElementsInstancedWEBGL(i,u,0,s,d,0,v,0,p);let m=0;for(let y=0;y<p;y++)m+=u[y]*v[y];e.update(m,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function KE(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function JE(n,t,e){const i=new WeakMap,a=new tn;function s(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let _=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",_)};var u=_;d!==void 0&&d.texture.dispose();const p=r.morphAttributes.position!==void 0,v=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,m=r.morphAttributes.position||[],y=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let M=0;p===!0&&(M=1),v===!0&&(M=2),g===!0&&(M=3);let w=r.attributes.position.count*M,S=1;w>t.maxTextureSize&&(S=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const E=new Float32Array(w*S*4*f),T=new zm(E,w,S,f);T.type=Ci,T.needsUpdate=!0;const b=M*4;for(let A=0;A<f;A++){const k=m[A],L=y[A],U=x[A],C=w*S*4*A;for(let D=0;D<k.count;D++){const B=D*b;p===!0&&(a.fromBufferAttribute(k,D),E[C+B+0]=a.x,E[C+B+1]=a.y,E[C+B+2]=a.z,E[C+B+3]=0),v===!0&&(a.fromBufferAttribute(L,D),E[C+B+4]=a.x,E[C+B+5]=a.y,E[C+B+6]=a.z,E[C+B+7]=0),g===!0&&(a.fromBufferAttribute(U,D),E[C+B+8]=a.x,E[C+B+9]=a.y,E[C+B+10]=a.z,E[C+B+11]=U.itemSize===4?a.w:1)}}d={count:f,texture:T,size:new Gt(w,S)},i.set(r,d),r.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];const v=r.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",v),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function QE(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(a.get(f)!==c&&(t.update(f),a.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return f}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class Xm extends An{constructor(t,e,i,a,s,o,r,l,c,h=Ls){if(h!==Ls&&h!==Vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Ls&&(i=Ya),i===void 0&&h===Vs&&(i=Gs),super(null,a,s,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Jn,this.minFilter=l!==void 0?l:Jn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Wm=new An,Pf=new Xm(1,1),Ym=new zm,$m=new O1,Zm=new Hm,Cf=[],Lf=[],kf=new Float32Array(16),Df=new Float32Array(9),If=new Float32Array(4);function Zs(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Cf[a];if(s===void 0&&(s=new Float32Array(a),Cf[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function fn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function pn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function vc(n,t){let e=Lf[t];e===void 0&&(e=new Int32Array(t),Lf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function tT(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function eT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(fn(e,t))return;n.uniform2fv(this.addr,t),pn(e,t)}}function nT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(fn(e,t))return;n.uniform3fv(this.addr,t),pn(e,t)}}function iT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(fn(e,t))return;n.uniform4fv(this.addr,t),pn(e,t)}}function aT(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(fn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),pn(e,t)}else{if(fn(e,i))return;If.set(i),n.uniformMatrix2fv(this.addr,!1,If),pn(e,i)}}function sT(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(fn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),pn(e,t)}else{if(fn(e,i))return;Df.set(i),n.uniformMatrix3fv(this.addr,!1,Df),pn(e,i)}}function oT(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(fn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),pn(e,t)}else{if(fn(e,i))return;kf.set(i),n.uniformMatrix4fv(this.addr,!1,kf),pn(e,i)}}function rT(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function cT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(fn(e,t))return;n.uniform2iv(this.addr,t),pn(e,t)}}function lT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(fn(e,t))return;n.uniform3iv(this.addr,t),pn(e,t)}}function hT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(fn(e,t))return;n.uniform4iv(this.addr,t),pn(e,t)}}function dT(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function uT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(fn(e,t))return;n.uniform2uiv(this.addr,t),pn(e,t)}}function fT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(fn(e,t))return;n.uniform3uiv(this.addr,t),pn(e,t)}}function pT(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(fn(e,t))return;n.uniform4uiv(this.addr,t),pn(e,t)}}function mT(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Pf.compareFunction=km,s=Pf):s=Wm,e.setTexture2D(t||s,a)}function gT(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||$m,a)}function xT(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||Zm,a)}function vT(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Ym,a)}function yT(n){switch(n){case 5126:return tT;case 35664:return eT;case 35665:return nT;case 35666:return iT;case 35674:return aT;case 35675:return sT;case 35676:return oT;case 5124:case 35670:return rT;case 35667:case 35671:return cT;case 35668:case 35672:return lT;case 35669:case 35673:return hT;case 5125:return dT;case 36294:return uT;case 36295:return fT;case 36296:return pT;case 35678:case 36198:case 36298:case 36306:case 35682:return mT;case 35679:case 36299:case 36307:return gT;case 35680:case 36300:case 36308:case 36293:return xT;case 36289:case 36303:case 36311:case 36292:return vT}}function MT(n,t){n.uniform1fv(this.addr,t)}function _T(n,t){const e=Zs(t,this.size,2);n.uniform2fv(this.addr,e)}function bT(n,t){const e=Zs(t,this.size,3);n.uniform3fv(this.addr,e)}function ST(n,t){const e=Zs(t,this.size,4);n.uniform4fv(this.addr,e)}function wT(n,t){const e=Zs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function ET(n,t){const e=Zs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function TT(n,t){const e=Zs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function AT(n,t){n.uniform1iv(this.addr,t)}function RT(n,t){n.uniform2iv(this.addr,t)}function PT(n,t){n.uniform3iv(this.addr,t)}function CT(n,t){n.uniform4iv(this.addr,t)}function LT(n,t){n.uniform1uiv(this.addr,t)}function kT(n,t){n.uniform2uiv(this.addr,t)}function DT(n,t){n.uniform3uiv(this.addr,t)}function IT(n,t){n.uniform4uiv(this.addr,t)}function zT(n,t,e){const i=this.cache,a=t.length,s=vc(e,a);fn(i,s)||(n.uniform1iv(this.addr,s),pn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||Wm,s[o])}function FT(n,t,e){const i=this.cache,a=t.length,s=vc(e,a);fn(i,s)||(n.uniform1iv(this.addr,s),pn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||$m,s[o])}function UT(n,t,e){const i=this.cache,a=t.length,s=vc(e,a);fn(i,s)||(n.uniform1iv(this.addr,s),pn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||Zm,s[o])}function NT(n,t,e){const i=this.cache,a=t.length,s=vc(e,a);fn(i,s)||(n.uniform1iv(this.addr,s),pn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Ym,s[o])}function OT(n){switch(n){case 5126:return MT;case 35664:return _T;case 35665:return bT;case 35666:return ST;case 35674:return wT;case 35675:return ET;case 35676:return TT;case 5124:case 35670:return AT;case 35667:case 35671:return RT;case 35668:case 35672:return PT;case 35669:case 35673:return CT;case 5125:return LT;case 36294:return kT;case 36295:return DT;case 36296:return IT;case 35678:case 36198:case 36298:case 36306:case 35682:return zT;case 35679:case 36299:case 36307:return FT;case 35680:case 36300:case 36308:case 36293:return UT;case 36289:case 36303:case 36311:case 36292:return NT}}class BT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=yT(e.type)}}class HT{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=OT(e.type)}}class GT{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const _l=/(\w+)(\])?(\[|\.)?/g;function zf(n,t){n.seq.push(t),n.map[t.id]=t}function VT(n,t,e){const i=n.name,a=i.length;for(_l.lastIndex=0;;){const s=_l.exec(i),o=_l.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){zf(e,c===void 0?new BT(r,n,t):new HT(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new GT(r),zf(e,f)),e=f}}}class Vr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);VT(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Ff(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const XT=37297;let WT=0;function YT(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Uf=new Me;function $T(n){Re._getMatrix(Uf,Re.workingColorSpace,n);const t=`mat3( ${Uf.elements.map(e=>e.toFixed(4))} )`;switch(Re.getTransfer(n)){case xc:return[t,"LinearTransferOETF"];case Fe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Nf(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+YT(n.getShaderSource(t),o)}else return a}function ZT(n,t){const e=$T(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function qT(n,t){let e;switch(t){case Kb:e="Linear";break;case Jb:e="Reinhard";break;case Qb:e="Cineon";break;case t1:e="ACESFilmic";break;case n1:e="AgX";break;case i1:e="Neutral";break;case e1:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Sr=new G;function jT(){Re.getLuminanceCoefficients(Sr);const n=Sr.x.toFixed(4),t=Sr.y.toFixed(4),e=Sr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function KT(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Mo).join(`
`)}function JT(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function QT(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function Mo(n){return n!==""}function Of(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Bf(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const tA=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fh(n){return n.replace(tA,nA)}const eA=new Map;function nA(n,t){let e=_e[t];if(e===void 0){const i=eA.get(t);if(i!==void 0)e=_e[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Fh(e)}const iA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Hf(n){return n.replace(iA,aA)}function aA(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Gf(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function sA(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===ym?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Mm?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Vi&&(t="SHADOWMAP_TYPE_VSM"),t}function oA(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Bs:case Hs:t="ENVMAP_TYPE_CUBE";break;case gc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function rA(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Hs:t="ENVMAP_MODE_REFRACTION";break}return t}function cA(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ed:t="ENVMAP_BLENDING_MULTIPLY";break;case qb:t="ENVMAP_BLENDING_MIX";break;case jb:t="ENVMAP_BLENDING_ADD";break}return t}function lA(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function hA(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=sA(e),c=oA(e),h=rA(e),f=cA(e),d=lA(e),u=KT(e),p=JT(s),v=a.createProgram();let g,m,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Mo).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Mo).join(`
`),m.length>0&&(m+=`
`)):(g=[Gf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Mo).join(`
`),m=[Gf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ma?"#define TONE_MAPPING":"",e.toneMapping!==ma?_e.tonemapping_pars_fragment:"",e.toneMapping!==ma?qT("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",_e.colorspace_pars_fragment,ZT("linearToOutputTexel",e.outputColorSpace),jT(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Mo).join(`
`)),o=Fh(o),o=Of(o,e),o=Bf(o,e),r=Fh(r),r=Of(r,e),r=Bf(r,e),o=Hf(o),r=Hf(r),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===Ju?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ju?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const x=y+g+o,M=y+m+r,w=Ff(a,a.VERTEX_SHADER,x),S=Ff(a,a.FRAGMENT_SHADER,M);a.attachShader(v,w),a.attachShader(v,S),e.index0AttributeName!==void 0?a.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(v,0,"position"),a.linkProgram(v);function E(A){if(n.debug.checkShaderErrors){const k=a.getProgramInfoLog(v).trim(),L=a.getShaderInfoLog(w).trim(),U=a.getShaderInfoLog(S).trim();let C=!0,D=!0;if(a.getProgramParameter(v,a.LINK_STATUS)===!1)if(C=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,v,w,S);else{const B=Nf(a,w,"vertex"),O=Nf(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(v,a.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+k+`
`+B+`
`+O)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(L===""||U==="")&&(D=!1);D&&(A.diagnostics={runnable:C,programLog:k,vertexShader:{log:L,prefix:g},fragmentShader:{log:U,prefix:m}})}a.deleteShader(w),a.deleteShader(S),T=new Vr(a,v),b=QT(a,v)}let T;this.getUniforms=function(){return T===void 0&&E(this),T};let b;this.getAttributes=function(){return b===void 0&&E(this),b};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=a.getProgramParameter(v,XT)),_},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=WT++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=w,this.fragmentShader=S,this}let dA=0;class uA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new fA(t),e.set(t,i)),i}}class fA{constructor(t){this.id=dA++,this.code=t,this.usedTimes=0}}function pA(n,t,e,i,a,s,o){const r=new dd,l=new uA,c=new Set,h=[],f=a.logarithmicDepthBuffer,d=a.vertexTextures;let u=a.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,_,A,k,L){const U=k.fog,C=L.geometry,D=b.isMeshStandardMaterial?k.environment:null,B=(b.isMeshStandardMaterial?e:t).get(b.envMap||D),O=B&&B.mapping===gc?B.image.height:null,X=p[b.type];b.precision!==null&&(u=a.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const it=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,ht=it!==void 0?it.length:0;let ft=0;C.morphAttributes.position!==void 0&&(ft=1),C.morphAttributes.normal!==void 0&&(ft=2),C.morphAttributes.color!==void 0&&(ft=3);let Rt,Z,at,dt;if(X){const ne=Ai[X];Rt=ne.vertexShader,Z=ne.fragmentShader}else Rt=b.vertexShader,Z=b.fragmentShader,l.update(b),at=l.getVertexShaderID(b),dt=l.getFragmentShaderID(b);const st=n.getRenderTarget(),nt=n.state.buffers.depth.getReversed(),ut=L.isInstancedMesh===!0,Bt=L.isBatchedMesh===!0,Zt=!!b.map,lt=!!b.matcap,V=!!B,N=!!b.aoMap,Ct=!!b.lightMap,Tt=!!b.bumpMap,Mt=!!b.normalMap,vt=!!b.displacementMap,mt=!!b.emissiveMap,kt=!!b.metalnessMap,F=!!b.roughnessMap,R=b.anisotropy>0,K=b.clearcoat>0,pt=b.dispersion>0,et=b.iridescence>0,ot=b.sheen>0,yt=b.transmission>0,At=R&&!!b.anisotropyMap,St=K&&!!b.clearcoatMap,Yt=K&&!!b.clearcoatNormalMap,gt=K&&!!b.clearcoatRoughnessMap,Dt=et&&!!b.iridescenceMap,$=et&&!!b.iridescenceThicknessMap,W=ot&&!!b.sheenColorMap,ct=ot&&!!b.sheenRoughnessMap,Ot=!!b.specularMap,zt=!!b.specularColorMap,Lt=!!b.specularIntensityMap,I=yt&&!!b.transmissionMap,_t=yt&&!!b.thicknessMap,tt=!!b.gradientMap,rt=!!b.alphaMap,Pt=b.alphaTest>0,wt=!!b.alphaHash,Kt=!!b.extensions;let he=ma;b.toneMapped&&(st===null||st.isXRRenderTarget===!0)&&(he=n.toneMapping);const ce={shaderID:X,shaderType:b.type,shaderName:b.name,vertexShader:Rt,fragmentShader:Z,defines:b.defines,customVertexShaderID:at,customFragmentShaderID:dt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:Bt,batchingColor:Bt&&L._colorsTexture!==null,instancing:ut,instancingColor:ut&&L.instanceColor!==null,instancingMorph:ut&&L.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:st===null?n.outputColorSpace:st.isXRRenderTarget===!0?st.texture.colorSpace:Ws,alphaToCoverage:!!b.alphaToCoverage,map:Zt,matcap:lt,envMap:V,envMapMode:V&&B.mapping,envMapCubeUVHeight:O,aoMap:N,lightMap:Ct,bumpMap:Tt,normalMap:Mt,displacementMap:d&&vt,emissiveMap:mt,normalMapObjectSpace:Mt&&b.normalMapType===r1,normalMapTangentSpace:Mt&&b.normalMapType===Lm,metalnessMap:kt,roughnessMap:F,anisotropy:R,anisotropyMap:At,clearcoat:K,clearcoatMap:St,clearcoatNormalMap:Yt,clearcoatRoughnessMap:gt,dispersion:pt,iridescence:et,iridescenceMap:Dt,iridescenceThicknessMap:$,sheen:ot,sheenColorMap:W,sheenRoughnessMap:ct,specularMap:Ot,specularColorMap:zt,specularIntensityMap:Lt,transmission:yt,transmissionMap:I,thicknessMap:_t,gradientMap:tt,opaque:b.transparent===!1&&b.blending===Cs&&b.alphaToCoverage===!1,alphaMap:rt,alphaTest:Pt,alphaHash:wt,combine:b.combine,mapUv:Zt&&v(b.map.channel),aoMapUv:N&&v(b.aoMap.channel),lightMapUv:Ct&&v(b.lightMap.channel),bumpMapUv:Tt&&v(b.bumpMap.channel),normalMapUv:Mt&&v(b.normalMap.channel),displacementMapUv:vt&&v(b.displacementMap.channel),emissiveMapUv:mt&&v(b.emissiveMap.channel),metalnessMapUv:kt&&v(b.metalnessMap.channel),roughnessMapUv:F&&v(b.roughnessMap.channel),anisotropyMapUv:At&&v(b.anisotropyMap.channel),clearcoatMapUv:St&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:Yt&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:gt&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Dt&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:$&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:W&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:ct&&v(b.sheenRoughnessMap.channel),specularMapUv:Ot&&v(b.specularMap.channel),specularColorMapUv:zt&&v(b.specularColorMap.channel),specularIntensityMapUv:Lt&&v(b.specularIntensityMap.channel),transmissionMapUv:I&&v(b.transmissionMap.channel),thicknessMapUv:_t&&v(b.thicknessMap.channel),alphaMapUv:rt&&v(b.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(Mt||R),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!C.attributes.uv&&(Zt||rt),fog:!!U,useFog:b.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:nt,skinning:L.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:ft,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&A.length>0,shadowMapType:n.shadowMap.type,toneMapping:he,decodeVideoTexture:Zt&&b.map.isVideoTexture===!0&&Re.getTransfer(b.map.colorSpace)===Fe,decodeVideoTextureEmissive:mt&&b.emissiveMap.isVideoTexture===!0&&Re.getTransfer(b.emissiveMap.colorSpace)===Fe,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===$e,flipSided:b.side===Gn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Kt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Kt&&b.extensions.multiDraw===!0||Bt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ce.vertexUv1s=c.has(1),ce.vertexUv2s=c.has(2),ce.vertexUv3s=c.has(3),c.clear(),ce}function m(b){const _=[];if(b.shaderID?_.push(b.shaderID):(_.push(b.customVertexShaderID),_.push(b.customFragmentShaderID)),b.defines!==void 0)for(const A in b.defines)_.push(A),_.push(b.defines[A]);return b.isRawShaderMaterial===!1&&(y(_,b),x(_,b),_.push(n.outputColorSpace)),_.push(b.customProgramCacheKey),_.join()}function y(b,_){b.push(_.precision),b.push(_.outputColorSpace),b.push(_.envMapMode),b.push(_.envMapCubeUVHeight),b.push(_.mapUv),b.push(_.alphaMapUv),b.push(_.lightMapUv),b.push(_.aoMapUv),b.push(_.bumpMapUv),b.push(_.normalMapUv),b.push(_.displacementMapUv),b.push(_.emissiveMapUv),b.push(_.metalnessMapUv),b.push(_.roughnessMapUv),b.push(_.anisotropyMapUv),b.push(_.clearcoatMapUv),b.push(_.clearcoatNormalMapUv),b.push(_.clearcoatRoughnessMapUv),b.push(_.iridescenceMapUv),b.push(_.iridescenceThicknessMapUv),b.push(_.sheenColorMapUv),b.push(_.sheenRoughnessMapUv),b.push(_.specularMapUv),b.push(_.specularColorMapUv),b.push(_.specularIntensityMapUv),b.push(_.transmissionMapUv),b.push(_.thicknessMapUv),b.push(_.combine),b.push(_.fogExp2),b.push(_.sizeAttenuation),b.push(_.morphTargetsCount),b.push(_.morphAttributeCount),b.push(_.numDirLights),b.push(_.numPointLights),b.push(_.numSpotLights),b.push(_.numSpotLightMaps),b.push(_.numHemiLights),b.push(_.numRectAreaLights),b.push(_.numDirLightShadows),b.push(_.numPointLightShadows),b.push(_.numSpotLightShadows),b.push(_.numSpotLightShadowsWithMaps),b.push(_.numLightProbes),b.push(_.shadowMapType),b.push(_.toneMapping),b.push(_.numClippingPlanes),b.push(_.numClipIntersection),b.push(_.depthPacking)}function x(b,_){r.disableAll(),_.supportsVertexTextures&&r.enable(0),_.instancing&&r.enable(1),_.instancingColor&&r.enable(2),_.instancingMorph&&r.enable(3),_.matcap&&r.enable(4),_.envMap&&r.enable(5),_.normalMapObjectSpace&&r.enable(6),_.normalMapTangentSpace&&r.enable(7),_.clearcoat&&r.enable(8),_.iridescence&&r.enable(9),_.alphaTest&&r.enable(10),_.vertexColors&&r.enable(11),_.vertexAlphas&&r.enable(12),_.vertexUv1s&&r.enable(13),_.vertexUv2s&&r.enable(14),_.vertexUv3s&&r.enable(15),_.vertexTangents&&r.enable(16),_.anisotropy&&r.enable(17),_.alphaHash&&r.enable(18),_.batching&&r.enable(19),_.dispersion&&r.enable(20),_.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),_.fog&&r.enable(0),_.useFog&&r.enable(1),_.flatShading&&r.enable(2),_.logarithmicDepthBuffer&&r.enable(3),_.reverseDepthBuffer&&r.enable(4),_.skinning&&r.enable(5),_.morphTargets&&r.enable(6),_.morphNormals&&r.enable(7),_.morphColors&&r.enable(8),_.premultipliedAlpha&&r.enable(9),_.shadowMapEnabled&&r.enable(10),_.doubleSided&&r.enable(11),_.flipSided&&r.enable(12),_.useDepthPacking&&r.enable(13),_.dithering&&r.enable(14),_.transmission&&r.enable(15),_.sheen&&r.enable(16),_.opaque&&r.enable(17),_.pointsUvs&&r.enable(18),_.decodeVideoTexture&&r.enable(19),_.decodeVideoTextureEmissive&&r.enable(20),_.alphaToCoverage&&r.enable(21),b.push(r.mask)}function M(b){const _=p[b.type];let A;if(_){const k=Ai[_];A=K1.clone(k.uniforms)}else A=b.uniforms;return A}function w(b,_){let A;for(let k=0,L=h.length;k<L;k++){const U=h[k];if(U.cacheKey===_){A=U,++A.usedTimes;break}}return A===void 0&&(A=new hA(n,_,b,s),h.push(A)),A}function S(b){if(--b.usedTimes===0){const _=h.indexOf(b);h[_]=h[h.length-1],h.pop(),b.destroy()}}function E(b){l.remove(b)}function T(){l.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:M,acquireProgram:w,releaseProgram:S,releaseShaderCache:E,programs:h,dispose:T}}function mA(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function gA(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Vf(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Xf(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(f,d,u,p,v,g){let m=n[t];return m===void 0?(m={id:f.id,object:f,geometry:d,material:u,groupOrder:p,renderOrder:f.renderOrder,z:v,group:g},n[t]=m):(m.id=f.id,m.object=f,m.geometry=d,m.material=u,m.groupOrder=p,m.renderOrder=f.renderOrder,m.z=v,m.group=g),t++,m}function r(f,d,u,p,v,g){const m=o(f,d,u,p,v,g);u.transmission>0?i.push(m):u.transparent===!0?a.push(m):e.push(m)}function l(f,d,u,p,v,g){const m=o(f,d,u,p,v,g);u.transmission>0?i.unshift(m):u.transparent===!0?a.unshift(m):e.unshift(m)}function c(f,d){e.length>1&&e.sort(f||gA),i.length>1&&i.sort(d||Vf),a.length>1&&a.sort(d||Vf)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:h,sort:c}}function xA(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new Xf,n.set(i,[o])):a>=s.length?(o=new Xf,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function vA(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new G,color:new te};break;case"SpotLight":e={position:new G,direction:new G,color:new te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new te,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new te,groundColor:new te};break;case"RectAreaLight":e={color:new te,position:new G,halfWidth:new G,halfHeight:new G};break}return n[t.id]=e,e}}}function yA(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let MA=0;function _A(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function bA(n){const t=new vA,e=yA(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new G);const a=new G,s=new Ce,o=new Ce;function r(c){let h=0,f=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let u=0,p=0,v=0,g=0,m=0,y=0,x=0,M=0,w=0,S=0,E=0;c.sort(_A);for(let b=0,_=c.length;b<_;b++){const A=c[b],k=A.color,L=A.intensity,U=A.distance,C=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=k.r*L,f+=k.g*L,d+=k.b*L;else if(A.isLightProbe){for(let D=0;D<9;D++)i.probe[D].addScaledVector(A.sh.coefficients[D],L);E++}else if(A.isDirectionalLight){const D=t.get(A);if(D.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const B=A.shadow,O=e.get(A);O.shadowIntensity=B.intensity,O.shadowBias=B.bias,O.shadowNormalBias=B.normalBias,O.shadowRadius=B.radius,O.shadowMapSize=B.mapSize,i.directionalShadow[u]=O,i.directionalShadowMap[u]=C,i.directionalShadowMatrix[u]=A.shadow.matrix,y++}i.directional[u]=D,u++}else if(A.isSpotLight){const D=t.get(A);D.position.setFromMatrixPosition(A.matrixWorld),D.color.copy(k).multiplyScalar(L),D.distance=U,D.coneCos=Math.cos(A.angle),D.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),D.decay=A.decay,i.spot[v]=D;const B=A.shadow;if(A.map&&(i.spotLightMap[w]=A.map,w++,B.updateMatrices(A),A.castShadow&&S++),i.spotLightMatrix[v]=B.matrix,A.castShadow){const O=e.get(A);O.shadowIntensity=B.intensity,O.shadowBias=B.bias,O.shadowNormalBias=B.normalBias,O.shadowRadius=B.radius,O.shadowMapSize=B.mapSize,i.spotShadow[v]=O,i.spotShadowMap[v]=C,M++}v++}else if(A.isRectAreaLight){const D=t.get(A);D.color.copy(k).multiplyScalar(L),D.halfWidth.set(A.width*.5,0,0),D.halfHeight.set(0,A.height*.5,0),i.rectArea[g]=D,g++}else if(A.isPointLight){const D=t.get(A);if(D.color.copy(A.color).multiplyScalar(A.intensity),D.distance=A.distance,D.decay=A.decay,A.castShadow){const B=A.shadow,O=e.get(A);O.shadowIntensity=B.intensity,O.shadowBias=B.bias,O.shadowNormalBias=B.normalBias,O.shadowRadius=B.radius,O.shadowMapSize=B.mapSize,O.shadowCameraNear=B.camera.near,O.shadowCameraFar=B.camera.far,i.pointShadow[p]=O,i.pointShadowMap[p]=C,i.pointShadowMatrix[p]=A.shadow.matrix,x++}i.point[p]=D,p++}else if(A.isHemisphereLight){const D=t.get(A);D.skyColor.copy(A.color).multiplyScalar(L),D.groundColor.copy(A.groundColor).multiplyScalar(L),i.hemi[m]=D,m++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ht.LTC_FLOAT_1,i.rectAreaLTC2=Ht.LTC_FLOAT_2):(i.rectAreaLTC1=Ht.LTC_HALF_1,i.rectAreaLTC2=Ht.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==u||T.pointLength!==p||T.spotLength!==v||T.rectAreaLength!==g||T.hemiLength!==m||T.numDirectionalShadows!==y||T.numPointShadows!==x||T.numSpotShadows!==M||T.numSpotMaps!==w||T.numLightProbes!==E)&&(i.directional.length=u,i.spot.length=v,i.rectArea.length=g,i.point.length=p,i.hemi.length=m,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=M+w-S,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=E,T.directionalLength=u,T.pointLength=p,T.spotLength=v,T.rectAreaLength=g,T.hemiLength=m,T.numDirectionalShadows=y,T.numPointShadows=x,T.numSpotShadows=M,T.numSpotMaps=w,T.numLightProbes=E,i.version=MA++)}function l(c,h){let f=0,d=0,u=0,p=0,v=0;const g=h.matrixWorldInverse;for(let m=0,y=c.length;m<y;m++){const x=c[m];if(x.isDirectionalLight){const M=i.directional[f];M.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(a),M.direction.transformDirection(g),f++}else if(x.isSpotLight){const M=i.spot[u];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(a),M.direction.transformDirection(g),u++}else if(x.isRectAreaLight){const M=i.rectArea[p];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),M.halfWidth.set(x.width*.5,0,0),M.halfHeight.set(0,x.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),p++}else if(x.isPointLight){const M=i.point[d];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(g),d++}else if(x.isHemisphereLight){const M=i.hemi[v];M.direction.setFromMatrixPosition(x.matrixWorld),M.direction.transformDirection(g),v++}}}return{setup:r,setupView:l,state:i}}function Wf(n){const t=new bA(n),e=[],i=[];function a(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function SA(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new Wf(n),t.set(a,[r])):s>=o.length?(r=new Wf(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class wA extends ja{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=s1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class EA extends ja{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const TA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,AA=`uniform sampler2D shadow_pass;
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
}`;function RA(n,t,e){let i=new ud;const a=new Gt,s=new Gt,o=new tn,r=new wA({depthPacking:o1}),l=new EA,c={},h=e.maxTextureSize,f={[ya]:Gn,[Gn]:ya,[$e]:$e},d=new Ma({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Gt},radius:{value:4}},vertexShader:TA,fragmentShader:AA}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const p=new an;p.setAttribute("position",new Mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new re(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ym;let m=this.type;this.render=function(S,E,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const b=n.getRenderTarget(),_=n.getActiveCubeFace(),A=n.getActiveMipmapLevel(),k=n.state;k.setBlending(pa),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const L=m!==Vi&&this.type===Vi,U=m===Vi&&this.type!==Vi;for(let C=0,D=S.length;C<D;C++){const B=S[C],O=B.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;a.copy(O.mapSize);const X=O.getFrameExtents();if(a.multiply(X),s.copy(O.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/X.x),a.x=s.x*X.x,O.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/X.y),a.y=s.y*X.y,O.mapSize.y=s.y)),O.map===null||L===!0||U===!0){const ht=this.type!==Vi?{minFilter:Jn,magFilter:Jn}:{};O.map!==null&&O.map.dispose(),O.map=new $a(a.x,a.y,ht),O.map.texture.name=B.name+".shadowMap",O.camera.updateProjectionMatrix()}n.setRenderTarget(O.map),n.clear();const it=O.getViewportCount();for(let ht=0;ht<it;ht++){const ft=O.getViewport(ht);o.set(s.x*ft.x,s.y*ft.y,s.x*ft.z,s.y*ft.w),k.viewport(o),O.updateMatrices(B,ht),i=O.getFrustum(),M(E,T,O.camera,B,this.type)}O.isPointLightShadow!==!0&&this.type===Vi&&y(O,T),O.needsUpdate=!1}m=this.type,g.needsUpdate=!1,n.setRenderTarget(b,_,A)};function y(S,E){const T=t.update(v);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,u.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new $a(a.x,a.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(E,null,T,d,v,null),u.uniforms.shadow_pass.value=S.mapPass.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(E,null,T,u,v,null)}function x(S,E,T,b){let _=null;const A=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(A!==void 0)_=A;else if(_=T.isPointLight===!0?l:r,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const k=_.uuid,L=E.uuid;let U=c[k];U===void 0&&(U={},c[k]=U);let C=U[L];C===void 0&&(C=_.clone(),U[L]=C,E.addEventListener("dispose",w)),_=C}if(_.visible=E.visible,_.wireframe=E.wireframe,b===Vi?_.side=E.shadowSide!==null?E.shadowSide:E.side:_.side=E.shadowSide!==null?E.shadowSide:f[E.side],_.alphaMap=E.alphaMap,_.alphaTest=E.alphaTest,_.map=E.map,_.clipShadows=E.clipShadows,_.clippingPlanes=E.clippingPlanes,_.clipIntersection=E.clipIntersection,_.displacementMap=E.displacementMap,_.displacementScale=E.displacementScale,_.displacementBias=E.displacementBias,_.wireframeLinewidth=E.wireframeLinewidth,_.linewidth=E.linewidth,T.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const k=n.properties.get(_);k.light=T}return _}function M(S,E,T,b,_){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&_===Vi)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const L=t.update(S),U=S.material;if(Array.isArray(U)){const C=L.groups;for(let D=0,B=C.length;D<B;D++){const O=C[D],X=U[O.materialIndex];if(X&&X.visible){const it=x(S,X,b,_);S.onBeforeShadow(n,S,E,T,L,it,O),n.renderBufferDirect(T,null,L,it,S,O),S.onAfterShadow(n,S,E,T,L,it,O)}}}else if(U.visible){const C=x(S,U,b,_);S.onBeforeShadow(n,S,E,T,L,C,null),n.renderBufferDirect(T,null,L,C,S,null),S.onAfterShadow(n,S,E,T,L,C,null)}}const k=S.children;for(let L=0,U=k.length;L<U;L++)M(k[L],E,T,b,_)}function w(S){S.target.removeEventListener("dispose",w);for(const T in c){const b=c[T],_=S.target.uuid;_ in b&&(b[_].dispose(),delete b[_])}}}const PA={[Jl]:Ql,[th]:ih,[eh]:ah,[Os]:nh,[Ql]:Jl,[ih]:th,[ah]:eh,[nh]:Os};function CA(n,t){function e(){let I=!1;const _t=new tn;let tt=null;const rt=new tn(0,0,0,0);return{setMask:function(Pt){tt!==Pt&&!I&&(n.colorMask(Pt,Pt,Pt,Pt),tt=Pt)},setLocked:function(Pt){I=Pt},setClear:function(Pt,wt,Kt,he,ce){ce===!0&&(Pt*=he,wt*=he,Kt*=he),_t.set(Pt,wt,Kt,he),rt.equals(_t)===!1&&(n.clearColor(Pt,wt,Kt,he),rt.copy(_t))},reset:function(){I=!1,tt=null,rt.set(-1,0,0,0)}}}function i(){let I=!1,_t=!1,tt=null,rt=null,Pt=null;return{setReversed:function(wt){if(_t!==wt){const Kt=t.get("EXT_clip_control");_t?Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.ZERO_TO_ONE_EXT):Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.NEGATIVE_ONE_TO_ONE_EXT);const he=Pt;Pt=null,this.setClear(he)}_t=wt},getReversed:function(){return _t},setTest:function(wt){wt?st(n.DEPTH_TEST):nt(n.DEPTH_TEST)},setMask:function(wt){tt!==wt&&!I&&(n.depthMask(wt),tt=wt)},setFunc:function(wt){if(_t&&(wt=PA[wt]),rt!==wt){switch(wt){case Jl:n.depthFunc(n.NEVER);break;case Ql:n.depthFunc(n.ALWAYS);break;case th:n.depthFunc(n.LESS);break;case Os:n.depthFunc(n.LEQUAL);break;case eh:n.depthFunc(n.EQUAL);break;case nh:n.depthFunc(n.GEQUAL);break;case ih:n.depthFunc(n.GREATER);break;case ah:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}rt=wt}},setLocked:function(wt){I=wt},setClear:function(wt){Pt!==wt&&(_t&&(wt=1-wt),n.clearDepth(wt),Pt=wt)},reset:function(){I=!1,tt=null,rt=null,Pt=null,_t=!1}}}function a(){let I=!1,_t=null,tt=null,rt=null,Pt=null,wt=null,Kt=null,he=null,ce=null;return{setTest:function(ne){I||(ne?st(n.STENCIL_TEST):nt(n.STENCIL_TEST))},setMask:function(ne){_t!==ne&&!I&&(n.stencilMask(ne),_t=ne)},setFunc:function(ne,Te,Pe){(tt!==ne||rt!==Te||Pt!==Pe)&&(n.stencilFunc(ne,Te,Pe),tt=ne,rt=Te,Pt=Pe)},setOp:function(ne,Te,Pe){(wt!==ne||Kt!==Te||he!==Pe)&&(n.stencilOp(ne,Te,Pe),wt=ne,Kt=Te,he=Pe)},setLocked:function(ne){I=ne},setClear:function(ne){ce!==ne&&(n.clearStencil(ne),ce=ne)},reset:function(){I=!1,_t=null,tt=null,rt=null,Pt=null,wt=null,Kt=null,he=null,ce=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],p=null,v=!1,g=null,m=null,y=null,x=null,M=null,w=null,S=null,E=new te(0,0,0),T=0,b=!1,_=null,A=null,k=null,L=null,U=null;const C=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,B=0;const O=n.getParameter(n.VERSION);O.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(O)[1]),D=B>=1):O.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),D=B>=2);let X=null,it={};const ht=n.getParameter(n.SCISSOR_BOX),ft=n.getParameter(n.VIEWPORT),Rt=new tn().fromArray(ht),Z=new tn().fromArray(ft);function at(I,_t,tt,rt){const Pt=new Uint8Array(4),wt=n.createTexture();n.bindTexture(I,wt),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Kt=0;Kt<tt;Kt++)I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY?n.texImage3D(_t,0,n.RGBA,1,1,rt,0,n.RGBA,n.UNSIGNED_BYTE,Pt):n.texImage2D(_t+Kt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Pt);return wt}const dt={};dt[n.TEXTURE_2D]=at(n.TEXTURE_2D,n.TEXTURE_2D,1),dt[n.TEXTURE_CUBE_MAP]=at(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),dt[n.TEXTURE_2D_ARRAY]=at(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),dt[n.TEXTURE_3D]=at(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),st(n.DEPTH_TEST),o.setFunc(Os),Tt(!1),Mt(Zu),st(n.CULL_FACE),N(pa);function st(I){h[I]!==!0&&(n.enable(I),h[I]=!0)}function nt(I){h[I]!==!1&&(n.disable(I),h[I]=!1)}function ut(I,_t){return f[I]!==_t?(n.bindFramebuffer(I,_t),f[I]=_t,I===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=_t),I===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=_t),!0):!1}function Bt(I,_t){let tt=u,rt=!1;if(I){tt=d.get(_t),tt===void 0&&(tt=[],d.set(_t,tt));const Pt=I.textures;if(tt.length!==Pt.length||tt[0]!==n.COLOR_ATTACHMENT0){for(let wt=0,Kt=Pt.length;wt<Kt;wt++)tt[wt]=n.COLOR_ATTACHMENT0+wt;tt.length=Pt.length,rt=!0}}else tt[0]!==n.BACK&&(tt[0]=n.BACK,rt=!0);rt&&n.drawBuffers(tt)}function Zt(I){return p!==I?(n.useProgram(I),p=I,!0):!1}const lt={[Oa]:n.FUNC_ADD,[kb]:n.FUNC_SUBTRACT,[Db]:n.FUNC_REVERSE_SUBTRACT};lt[Ib]=n.MIN,lt[zb]=n.MAX;const V={[Fb]:n.ZERO,[Ub]:n.ONE,[Nb]:n.SRC_COLOR,[jl]:n.SRC_ALPHA,[Xb]:n.SRC_ALPHA_SATURATE,[Gb]:n.DST_COLOR,[Bb]:n.DST_ALPHA,[Ob]:n.ONE_MINUS_SRC_COLOR,[Kl]:n.ONE_MINUS_SRC_ALPHA,[Vb]:n.ONE_MINUS_DST_COLOR,[Hb]:n.ONE_MINUS_DST_ALPHA,[Wb]:n.CONSTANT_COLOR,[Yb]:n.ONE_MINUS_CONSTANT_COLOR,[$b]:n.CONSTANT_ALPHA,[Zb]:n.ONE_MINUS_CONSTANT_ALPHA};function N(I,_t,tt,rt,Pt,wt,Kt,he,ce,ne){if(I===pa){v===!0&&(nt(n.BLEND),v=!1);return}if(v===!1&&(st(n.BLEND),v=!0),I!==Lb){if(I!==g||ne!==b){if((m!==Oa||M!==Oa)&&(n.blendEquation(n.FUNC_ADD),m=Oa,M=Oa),ne)switch(I){case Cs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Wi:n.blendFunc(n.ONE,n.ONE);break;case qu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ju:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Cs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Wi:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case qu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ju:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}y=null,x=null,w=null,S=null,E.set(0,0,0),T=0,g=I,b=ne}return}Pt=Pt||_t,wt=wt||tt,Kt=Kt||rt,(_t!==m||Pt!==M)&&(n.blendEquationSeparate(lt[_t],lt[Pt]),m=_t,M=Pt),(tt!==y||rt!==x||wt!==w||Kt!==S)&&(n.blendFuncSeparate(V[tt],V[rt],V[wt],V[Kt]),y=tt,x=rt,w=wt,S=Kt),(he.equals(E)===!1||ce!==T)&&(n.blendColor(he.r,he.g,he.b,ce),E.copy(he),T=ce),g=I,b=!1}function Ct(I,_t){I.side===$e?nt(n.CULL_FACE):st(n.CULL_FACE);let tt=I.side===Gn;_t&&(tt=!tt),Tt(tt),I.blending===Cs&&I.transparent===!1?N(pa):N(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),s.setMask(I.colorWrite);const rt=I.stencilWrite;r.setTest(rt),rt&&(r.setMask(I.stencilWriteMask),r.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),r.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),mt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?st(n.SAMPLE_ALPHA_TO_COVERAGE):nt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Tt(I){_!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),_=I)}function Mt(I){I!==Pb?(st(n.CULL_FACE),I!==A&&(I===Zu?n.cullFace(n.BACK):I===Cb?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):nt(n.CULL_FACE),A=I}function vt(I){I!==k&&(D&&n.lineWidth(I),k=I)}function mt(I,_t,tt){I?(st(n.POLYGON_OFFSET_FILL),(L!==_t||U!==tt)&&(n.polygonOffset(_t,tt),L=_t,U=tt)):nt(n.POLYGON_OFFSET_FILL)}function kt(I){I?st(n.SCISSOR_TEST):nt(n.SCISSOR_TEST)}function F(I){I===void 0&&(I=n.TEXTURE0+C-1),X!==I&&(n.activeTexture(I),X=I)}function R(I,_t,tt){tt===void 0&&(X===null?tt=n.TEXTURE0+C-1:tt=X);let rt=it[tt];rt===void 0&&(rt={type:void 0,texture:void 0},it[tt]=rt),(rt.type!==I||rt.texture!==_t)&&(X!==tt&&(n.activeTexture(tt),X=tt),n.bindTexture(I,_t||dt[I]),rt.type=I,rt.texture=_t)}function K(){const I=it[X];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function pt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function et(){try{n.compressedTexImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ot(){try{n.texSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function yt(){try{n.texSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function At(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function St(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Yt(){try{n.texStorage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function gt(){try{n.texStorage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Dt(){try{n.texImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function $(){try{n.texImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function W(I){Rt.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),Rt.copy(I))}function ct(I){Z.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),Z.copy(I))}function Ot(I,_t){let tt=c.get(_t);tt===void 0&&(tt=new WeakMap,c.set(_t,tt));let rt=tt.get(I);rt===void 0&&(rt=n.getUniformBlockIndex(_t,I.name),tt.set(I,rt))}function zt(I,_t){const rt=c.get(_t).get(I);l.get(_t)!==rt&&(n.uniformBlockBinding(_t,rt,I.__bindingPointIndex),l.set(_t,rt))}function Lt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},X=null,it={},f={},d=new WeakMap,u=[],p=null,v=!1,g=null,m=null,y=null,x=null,M=null,w=null,S=null,E=new te(0,0,0),T=0,b=!1,_=null,A=null,k=null,L=null,U=null,Rt.set(0,0,n.canvas.width,n.canvas.height),Z.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:st,disable:nt,bindFramebuffer:ut,drawBuffers:Bt,useProgram:Zt,setBlending:N,setMaterial:Ct,setFlipSided:Tt,setCullFace:Mt,setLineWidth:vt,setPolygonOffset:mt,setScissorTest:kt,activeTexture:F,bindTexture:R,unbindTexture:K,compressedTexImage2D:pt,compressedTexImage3D:et,texImage2D:Dt,texImage3D:$,updateUBOMapping:Ot,uniformBlockBinding:zt,texStorage2D:Yt,texStorage3D:gt,texSubImage2D:ot,texSubImage3D:yt,compressedTexSubImage2D:At,compressedTexSubImage3D:St,scissor:W,viewport:ct,reset:Lt}}function Yf(n,t,e,i){const a=LA(i);switch(e){case Em:return n*t;case Am:return n*t;case Rm:return n*t*2;case sd:return n*t/a.components*a.byteLength;case od:return n*t/a.components*a.byteLength;case Pm:return n*t*2/a.components*a.byteLength;case rd:return n*t*2/a.components*a.byteLength;case Tm:return n*t*3/a.components*a.byteLength;case gi:return n*t*4/a.components*a.byteLength;case cd:return n*t*4/a.components*a.byteLength;case Nr:case Or:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Br:case Hr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case hh:case uh:return Math.max(n,16)*Math.max(t,8)/4;case lh:case dh:return Math.max(n,8)*Math.max(t,8)/2;case fh:case ph:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case mh:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case gh:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case xh:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case vh:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case yh:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Mh:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case _h:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case bh:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Sh:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case wh:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Eh:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Th:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Ah:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Rh:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Ph:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Gr:case Ch:case Lh:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Cm:case kh:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Dh:case Ih:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function LA(n){switch(n){case qi:case bm:return{byteLength:1,components:1};case Uo:case Sm:case Xo:return{byteLength:2,components:1};case id:case ad:return{byteLength:2,components:4};case Ya:case nd:case Ci:return{byteLength:4,components:1};case wm:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function kA(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Gt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(F,R){return u?new OffscreenCanvas(F,R):ac("canvas")}function v(F,R,K){let pt=1;const et=kt(F);if((et.width>K||et.height>K)&&(pt=K/Math.max(et.width,et.height)),pt<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const ot=Math.floor(pt*et.width),yt=Math.floor(pt*et.height);f===void 0&&(f=p(ot,yt));const At=R?p(ot,yt):f;return At.width=ot,At.height=yt,At.getContext("2d").drawImage(F,0,0,ot,yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+ot+"x"+yt+")."),At}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),F;return F}function g(F){return F.generateMipmaps}function m(F){n.generateMipmap(F)}function y(F){return F.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:F.isWebGL3DRenderTarget?n.TEXTURE_3D:F.isWebGLArrayRenderTarget||F.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(F,R,K,pt,et=!1){if(F!==null){if(n[F]!==void 0)return n[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let ot=R;if(R===n.RED&&(K===n.FLOAT&&(ot=n.R32F),K===n.HALF_FLOAT&&(ot=n.R16F),K===n.UNSIGNED_BYTE&&(ot=n.R8)),R===n.RED_INTEGER&&(K===n.UNSIGNED_BYTE&&(ot=n.R8UI),K===n.UNSIGNED_SHORT&&(ot=n.R16UI),K===n.UNSIGNED_INT&&(ot=n.R32UI),K===n.BYTE&&(ot=n.R8I),K===n.SHORT&&(ot=n.R16I),K===n.INT&&(ot=n.R32I)),R===n.RG&&(K===n.FLOAT&&(ot=n.RG32F),K===n.HALF_FLOAT&&(ot=n.RG16F),K===n.UNSIGNED_BYTE&&(ot=n.RG8)),R===n.RG_INTEGER&&(K===n.UNSIGNED_BYTE&&(ot=n.RG8UI),K===n.UNSIGNED_SHORT&&(ot=n.RG16UI),K===n.UNSIGNED_INT&&(ot=n.RG32UI),K===n.BYTE&&(ot=n.RG8I),K===n.SHORT&&(ot=n.RG16I),K===n.INT&&(ot=n.RG32I)),R===n.RGB_INTEGER&&(K===n.UNSIGNED_BYTE&&(ot=n.RGB8UI),K===n.UNSIGNED_SHORT&&(ot=n.RGB16UI),K===n.UNSIGNED_INT&&(ot=n.RGB32UI),K===n.BYTE&&(ot=n.RGB8I),K===n.SHORT&&(ot=n.RGB16I),K===n.INT&&(ot=n.RGB32I)),R===n.RGBA_INTEGER&&(K===n.UNSIGNED_BYTE&&(ot=n.RGBA8UI),K===n.UNSIGNED_SHORT&&(ot=n.RGBA16UI),K===n.UNSIGNED_INT&&(ot=n.RGBA32UI),K===n.BYTE&&(ot=n.RGBA8I),K===n.SHORT&&(ot=n.RGBA16I),K===n.INT&&(ot=n.RGBA32I)),R===n.RGB&&K===n.UNSIGNED_INT_5_9_9_9_REV&&(ot=n.RGB9_E5),R===n.RGBA){const yt=et?xc:Re.getTransfer(pt);K===n.FLOAT&&(ot=n.RGBA32F),K===n.HALF_FLOAT&&(ot=n.RGBA16F),K===n.UNSIGNED_BYTE&&(ot=yt===Fe?n.SRGB8_ALPHA8:n.RGBA8),K===n.UNSIGNED_SHORT_4_4_4_4&&(ot=n.RGBA4),K===n.UNSIGNED_SHORT_5_5_5_1&&(ot=n.RGB5_A1)}return(ot===n.R16F||ot===n.R32F||ot===n.RG16F||ot===n.RG32F||ot===n.RGBA16F||ot===n.RGBA32F)&&t.get("EXT_color_buffer_float"),ot}function M(F,R){let K;return F?R===null||R===Ya||R===Gs?K=n.DEPTH24_STENCIL8:R===Ci?K=n.DEPTH32F_STENCIL8:R===Uo&&(K=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===Ya||R===Gs?K=n.DEPTH_COMPONENT24:R===Ci?K=n.DEPTH_COMPONENT32F:R===Uo&&(K=n.DEPTH_COMPONENT16),K}function w(F,R){return g(F)===!0||F.isFramebufferTexture&&F.minFilter!==Jn&&F.minFilter!==Pi?Math.log2(Math.max(R.width,R.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?R.mipmaps.length:1}function S(F){const R=F.target;R.removeEventListener("dispose",S),T(R),R.isVideoTexture&&h.delete(R)}function E(F){const R=F.target;R.removeEventListener("dispose",E),_(R)}function T(F){const R=i.get(F);if(R.__webglInit===void 0)return;const K=F.source,pt=d.get(K);if(pt){const et=pt[R.__cacheKey];et.usedTimes--,et.usedTimes===0&&b(F),Object.keys(pt).length===0&&d.delete(K)}i.remove(F)}function b(F){const R=i.get(F);n.deleteTexture(R.__webglTexture);const K=F.source,pt=d.get(K);delete pt[R.__cacheKey],o.memory.textures--}function _(F){const R=i.get(F);if(F.depthTexture&&(F.depthTexture.dispose(),i.remove(F.depthTexture)),F.isWebGLCubeRenderTarget)for(let pt=0;pt<6;pt++){if(Array.isArray(R.__webglFramebuffer[pt]))for(let et=0;et<R.__webglFramebuffer[pt].length;et++)n.deleteFramebuffer(R.__webglFramebuffer[pt][et]);else n.deleteFramebuffer(R.__webglFramebuffer[pt]);R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer[pt])}else{if(Array.isArray(R.__webglFramebuffer))for(let pt=0;pt<R.__webglFramebuffer.length;pt++)n.deleteFramebuffer(R.__webglFramebuffer[pt]);else n.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&n.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&n.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let pt=0;pt<R.__webglColorRenderbuffer.length;pt++)R.__webglColorRenderbuffer[pt]&&n.deleteRenderbuffer(R.__webglColorRenderbuffer[pt]);R.__webglDepthRenderbuffer&&n.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const K=F.textures;for(let pt=0,et=K.length;pt<et;pt++){const ot=i.get(K[pt]);ot.__webglTexture&&(n.deleteTexture(ot.__webglTexture),o.memory.textures--),i.remove(K[pt])}i.remove(F)}let A=0;function k(){A=0}function L(){const F=A;return F>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+a.maxTextures),A+=1,F}function U(F){const R=[];return R.push(F.wrapS),R.push(F.wrapT),R.push(F.wrapR||0),R.push(F.magFilter),R.push(F.minFilter),R.push(F.anisotropy),R.push(F.internalFormat),R.push(F.format),R.push(F.type),R.push(F.generateMipmaps),R.push(F.premultiplyAlpha),R.push(F.flipY),R.push(F.unpackAlignment),R.push(F.colorSpace),R.join()}function C(F,R){const K=i.get(F);if(F.isVideoTexture&&vt(F),F.isRenderTargetTexture===!1&&F.version>0&&K.__version!==F.version){const pt=F.image;if(pt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(pt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(K,F,R);return}}e.bindTexture(n.TEXTURE_2D,K.__webglTexture,n.TEXTURE0+R)}function D(F,R){const K=i.get(F);if(F.version>0&&K.__version!==F.version){Z(K,F,R);return}e.bindTexture(n.TEXTURE_2D_ARRAY,K.__webglTexture,n.TEXTURE0+R)}function B(F,R){const K=i.get(F);if(F.version>0&&K.__version!==F.version){Z(K,F,R);return}e.bindTexture(n.TEXTURE_3D,K.__webglTexture,n.TEXTURE0+R)}function O(F,R){const K=i.get(F);if(F.version>0&&K.__version!==F.version){at(K,F,R);return}e.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture,n.TEXTURE0+R)}const X={[rh]:n.REPEAT,[Ga]:n.CLAMP_TO_EDGE,[ch]:n.MIRRORED_REPEAT},it={[Jn]:n.NEAREST,[a1]:n.NEAREST_MIPMAP_NEAREST,[ir]:n.NEAREST_MIPMAP_LINEAR,[Pi]:n.LINEAR,[qc]:n.LINEAR_MIPMAP_NEAREST,[Va]:n.LINEAR_MIPMAP_LINEAR},ht={[c1]:n.NEVER,[p1]:n.ALWAYS,[l1]:n.LESS,[km]:n.LEQUAL,[h1]:n.EQUAL,[f1]:n.GEQUAL,[d1]:n.GREATER,[u1]:n.NOTEQUAL};function ft(F,R){if(R.type===Ci&&t.has("OES_texture_float_linear")===!1&&(R.magFilter===Pi||R.magFilter===qc||R.magFilter===ir||R.magFilter===Va||R.minFilter===Pi||R.minFilter===qc||R.minFilter===ir||R.minFilter===Va)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(F,n.TEXTURE_WRAP_S,X[R.wrapS]),n.texParameteri(F,n.TEXTURE_WRAP_T,X[R.wrapT]),(F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY)&&n.texParameteri(F,n.TEXTURE_WRAP_R,X[R.wrapR]),n.texParameteri(F,n.TEXTURE_MAG_FILTER,it[R.magFilter]),n.texParameteri(F,n.TEXTURE_MIN_FILTER,it[R.minFilter]),R.compareFunction&&(n.texParameteri(F,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(F,n.TEXTURE_COMPARE_FUNC,ht[R.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===Jn||R.minFilter!==ir&&R.minFilter!==Va||R.type===Ci&&t.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||i.get(R).__currentAnisotropy){const K=t.get("EXT_texture_filter_anisotropic");n.texParameterf(F,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,a.getMaxAnisotropy())),i.get(R).__currentAnisotropy=R.anisotropy}}}function Rt(F,R){let K=!1;F.__webglInit===void 0&&(F.__webglInit=!0,R.addEventListener("dispose",S));const pt=R.source;let et=d.get(pt);et===void 0&&(et={},d.set(pt,et));const ot=U(R);if(ot!==F.__cacheKey){et[ot]===void 0&&(et[ot]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,K=!0),et[ot].usedTimes++;const yt=et[F.__cacheKey];yt!==void 0&&(et[F.__cacheKey].usedTimes--,yt.usedTimes===0&&b(R)),F.__cacheKey=ot,F.__webglTexture=et[ot].texture}return K}function Z(F,R,K){let pt=n.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(pt=n.TEXTURE_2D_ARRAY),R.isData3DTexture&&(pt=n.TEXTURE_3D);const et=Rt(F,R),ot=R.source;e.bindTexture(pt,F.__webglTexture,n.TEXTURE0+K);const yt=i.get(ot);if(ot.version!==yt.__version||et===!0){e.activeTexture(n.TEXTURE0+K);const At=Re.getPrimaries(Re.workingColorSpace),St=R.colorSpace===ca?null:Re.getPrimaries(R.colorSpace),Yt=R.colorSpace===ca||At===St?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Yt);let gt=v(R.image,!1,a.maxTextureSize);gt=mt(R,gt);const Dt=s.convert(R.format,R.colorSpace),$=s.convert(R.type);let W=x(R.internalFormat,Dt,$,R.colorSpace,R.isVideoTexture);ft(pt,R);let ct;const Ot=R.mipmaps,zt=R.isVideoTexture!==!0,Lt=yt.__version===void 0||et===!0,I=ot.dataReady,_t=w(R,gt);if(R.isDepthTexture)W=M(R.format===Vs,R.type),Lt&&(zt?e.texStorage2D(n.TEXTURE_2D,1,W,gt.width,gt.height):e.texImage2D(n.TEXTURE_2D,0,W,gt.width,gt.height,0,Dt,$,null));else if(R.isDataTexture)if(Ot.length>0){zt&&Lt&&e.texStorage2D(n.TEXTURE_2D,_t,W,Ot[0].width,Ot[0].height);for(let tt=0,rt=Ot.length;tt<rt;tt++)ct=Ot[tt],zt?I&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,Dt,$,ct.data):e.texImage2D(n.TEXTURE_2D,tt,W,ct.width,ct.height,0,Dt,$,ct.data);R.generateMipmaps=!1}else zt?(Lt&&e.texStorage2D(n.TEXTURE_2D,_t,W,gt.width,gt.height),I&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,gt.width,gt.height,Dt,$,gt.data)):e.texImage2D(n.TEXTURE_2D,0,W,gt.width,gt.height,0,Dt,$,gt.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){zt&&Lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,_t,W,Ot[0].width,Ot[0].height,gt.depth);for(let tt=0,rt=Ot.length;tt<rt;tt++)if(ct=Ot[tt],R.format!==gi)if(Dt!==null)if(zt){if(I)if(R.layerUpdates.size>0){const Pt=Yf(ct.width,ct.height,R.format,R.type);for(const wt of R.layerUpdates){const Kt=ct.data.subarray(wt*Pt/ct.data.BYTES_PER_ELEMENT,(wt+1)*Pt/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,wt,ct.width,ct.height,1,Dt,Kt)}R.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,ct.width,ct.height,gt.depth,Dt,ct.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,tt,W,ct.width,ct.height,gt.depth,0,ct.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else zt?I&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,ct.width,ct.height,gt.depth,Dt,$,ct.data):e.texImage3D(n.TEXTURE_2D_ARRAY,tt,W,ct.width,ct.height,gt.depth,0,Dt,$,ct.data)}else{zt&&Lt&&e.texStorage2D(n.TEXTURE_2D,_t,W,Ot[0].width,Ot[0].height);for(let tt=0,rt=Ot.length;tt<rt;tt++)ct=Ot[tt],R.format!==gi?Dt!==null?zt?I&&e.compressedTexSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,Dt,ct.data):e.compressedTexImage2D(n.TEXTURE_2D,tt,W,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):zt?I&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,Dt,$,ct.data):e.texImage2D(n.TEXTURE_2D,tt,W,ct.width,ct.height,0,Dt,$,ct.data)}else if(R.isDataArrayTexture)if(zt){if(Lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,_t,W,gt.width,gt.height,gt.depth),I)if(R.layerUpdates.size>0){const tt=Yf(gt.width,gt.height,R.format,R.type);for(const rt of R.layerUpdates){const Pt=gt.data.subarray(rt*tt/gt.data.BYTES_PER_ELEMENT,(rt+1)*tt/gt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,rt,gt.width,gt.height,1,Dt,$,Pt)}R.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,gt.width,gt.height,gt.depth,Dt,$,gt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,W,gt.width,gt.height,gt.depth,0,Dt,$,gt.data);else if(R.isData3DTexture)zt?(Lt&&e.texStorage3D(n.TEXTURE_3D,_t,W,gt.width,gt.height,gt.depth),I&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,gt.width,gt.height,gt.depth,Dt,$,gt.data)):e.texImage3D(n.TEXTURE_3D,0,W,gt.width,gt.height,gt.depth,0,Dt,$,gt.data);else if(R.isFramebufferTexture){if(Lt)if(zt)e.texStorage2D(n.TEXTURE_2D,_t,W,gt.width,gt.height);else{let tt=gt.width,rt=gt.height;for(let Pt=0;Pt<_t;Pt++)e.texImage2D(n.TEXTURE_2D,Pt,W,tt,rt,0,Dt,$,null),tt>>=1,rt>>=1}}else if(Ot.length>0){if(zt&&Lt){const tt=kt(Ot[0]);e.texStorage2D(n.TEXTURE_2D,_t,W,tt.width,tt.height)}for(let tt=0,rt=Ot.length;tt<rt;tt++)ct=Ot[tt],zt?I&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,Dt,$,ct):e.texImage2D(n.TEXTURE_2D,tt,W,Dt,$,ct);R.generateMipmaps=!1}else if(zt){if(Lt){const tt=kt(gt);e.texStorage2D(n.TEXTURE_2D,_t,W,tt.width,tt.height)}I&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Dt,$,gt)}else e.texImage2D(n.TEXTURE_2D,0,W,Dt,$,gt);g(R)&&m(pt),yt.__version=ot.version,R.onUpdate&&R.onUpdate(R)}F.__version=R.version}function at(F,R,K){if(R.image.length!==6)return;const pt=Rt(F,R),et=R.source;e.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+K);const ot=i.get(et);if(et.version!==ot.__version||pt===!0){e.activeTexture(n.TEXTURE0+K);const yt=Re.getPrimaries(Re.workingColorSpace),At=R.colorSpace===ca?null:Re.getPrimaries(R.colorSpace),St=R.colorSpace===ca||yt===At?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,R.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,R.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,St);const Yt=R.isCompressedTexture||R.image[0].isCompressedTexture,gt=R.image[0]&&R.image[0].isDataTexture,Dt=[];for(let rt=0;rt<6;rt++)!Yt&&!gt?Dt[rt]=v(R.image[rt],!0,a.maxCubemapSize):Dt[rt]=gt?R.image[rt].image:R.image[rt],Dt[rt]=mt(R,Dt[rt]);const $=Dt[0],W=s.convert(R.format,R.colorSpace),ct=s.convert(R.type),Ot=x(R.internalFormat,W,ct,R.colorSpace),zt=R.isVideoTexture!==!0,Lt=ot.__version===void 0||pt===!0,I=et.dataReady;let _t=w(R,$);ft(n.TEXTURE_CUBE_MAP,R);let tt;if(Yt){zt&&Lt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,_t,Ot,$.width,$.height);for(let rt=0;rt<6;rt++){tt=Dt[rt].mipmaps;for(let Pt=0;Pt<tt.length;Pt++){const wt=tt[Pt];R.format!==gi?W!==null?zt?I&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Pt,0,0,wt.width,wt.height,W,wt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Pt,Ot,wt.width,wt.height,0,wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):zt?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Pt,0,0,wt.width,wt.height,W,ct,wt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Pt,Ot,wt.width,wt.height,0,W,ct,wt.data)}}}else{if(tt=R.mipmaps,zt&&Lt){tt.length>0&&_t++;const rt=kt(Dt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,_t,Ot,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(gt){zt?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,Dt[rt].width,Dt[rt].height,W,ct,Dt[rt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Ot,Dt[rt].width,Dt[rt].height,0,W,ct,Dt[rt].data);for(let Pt=0;Pt<tt.length;Pt++){const Kt=tt[Pt].image[rt].image;zt?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Pt+1,0,0,Kt.width,Kt.height,W,ct,Kt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Pt+1,Ot,Kt.width,Kt.height,0,W,ct,Kt.data)}}else{zt?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,W,ct,Dt[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Ot,W,ct,Dt[rt]);for(let Pt=0;Pt<tt.length;Pt++){const wt=tt[Pt];zt?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Pt+1,0,0,W,ct,wt.image[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Pt+1,Ot,W,ct,wt.image[rt])}}}g(R)&&m(n.TEXTURE_CUBE_MAP),ot.__version=et.version,R.onUpdate&&R.onUpdate(R)}F.__version=R.version}function dt(F,R,K,pt,et,ot){const yt=s.convert(K.format,K.colorSpace),At=s.convert(K.type),St=x(K.internalFormat,yt,At,K.colorSpace),Yt=i.get(R),gt=i.get(K);if(gt.__renderTarget=R,!Yt.__hasExternalTextures){const Dt=Math.max(1,R.width>>ot),$=Math.max(1,R.height>>ot);et===n.TEXTURE_3D||et===n.TEXTURE_2D_ARRAY?e.texImage3D(et,ot,St,Dt,$,R.depth,0,yt,At,null):e.texImage2D(et,ot,St,Dt,$,0,yt,At,null)}e.bindFramebuffer(n.FRAMEBUFFER,F),Mt(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,pt,et,gt.__webglTexture,0,Tt(R)):(et===n.TEXTURE_2D||et>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,pt,et,gt.__webglTexture,ot),e.bindFramebuffer(n.FRAMEBUFFER,null)}function st(F,R,K){if(n.bindRenderbuffer(n.RENDERBUFFER,F),R.depthBuffer){const pt=R.depthTexture,et=pt&&pt.isDepthTexture?pt.type:null,ot=M(R.stencilBuffer,et),yt=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,At=Tt(R);Mt(R)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,At,ot,R.width,R.height):K?n.renderbufferStorageMultisample(n.RENDERBUFFER,At,ot,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,ot,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,yt,n.RENDERBUFFER,F)}else{const pt=R.textures;for(let et=0;et<pt.length;et++){const ot=pt[et],yt=s.convert(ot.format,ot.colorSpace),At=s.convert(ot.type),St=x(ot.internalFormat,yt,At,ot.colorSpace),Yt=Tt(R);K&&Mt(R)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Yt,St,R.width,R.height):Mt(R)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Yt,St,R.width,R.height):n.renderbufferStorage(n.RENDERBUFFER,St,R.width,R.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function nt(F,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,F),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const pt=i.get(R.depthTexture);pt.__renderTarget=R,(!pt.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),C(R.depthTexture,0);const et=pt.__webglTexture,ot=Tt(R);if(R.depthTexture.format===Ls)Mt(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,et,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,et,0);else if(R.depthTexture.format===Vs)Mt(R)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,et,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function ut(F){const R=i.get(F),K=F.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==F.depthTexture){const pt=F.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),pt){const et=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,pt.removeEventListener("dispose",et)};pt.addEventListener("dispose",et),R.__depthDisposeCallback=et}R.__boundDepthTexture=pt}if(F.depthTexture&&!R.__autoAllocateDepthBuffer){if(K)throw new Error("target.depthTexture not supported in Cube render targets");nt(R.__webglFramebuffer,F)}else if(K){R.__webglDepthbuffer=[];for(let pt=0;pt<6;pt++)if(e.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer[pt]),R.__webglDepthbuffer[pt]===void 0)R.__webglDepthbuffer[pt]=n.createRenderbuffer(),st(R.__webglDepthbuffer[pt],F,!1);else{const et=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ot=R.__webglDepthbuffer[pt];n.bindRenderbuffer(n.RENDERBUFFER,ot),n.framebufferRenderbuffer(n.FRAMEBUFFER,et,n.RENDERBUFFER,ot)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=n.createRenderbuffer(),st(R.__webglDepthbuffer,F,!1);else{const pt=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,et=R.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,et),n.framebufferRenderbuffer(n.FRAMEBUFFER,pt,n.RENDERBUFFER,et)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Bt(F,R,K){const pt=i.get(F);R!==void 0&&dt(pt.__webglFramebuffer,F,F.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),K!==void 0&&ut(F)}function Zt(F){const R=F.texture,K=i.get(F),pt=i.get(R);F.addEventListener("dispose",E);const et=F.textures,ot=F.isWebGLCubeRenderTarget===!0,yt=et.length>1;if(yt||(pt.__webglTexture===void 0&&(pt.__webglTexture=n.createTexture()),pt.__version=R.version,o.memory.textures++),ot){K.__webglFramebuffer=[];for(let At=0;At<6;At++)if(R.mipmaps&&R.mipmaps.length>0){K.__webglFramebuffer[At]=[];for(let St=0;St<R.mipmaps.length;St++)K.__webglFramebuffer[At][St]=n.createFramebuffer()}else K.__webglFramebuffer[At]=n.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){K.__webglFramebuffer=[];for(let At=0;At<R.mipmaps.length;At++)K.__webglFramebuffer[At]=n.createFramebuffer()}else K.__webglFramebuffer=n.createFramebuffer();if(yt)for(let At=0,St=et.length;At<St;At++){const Yt=i.get(et[At]);Yt.__webglTexture===void 0&&(Yt.__webglTexture=n.createTexture(),o.memory.textures++)}if(F.samples>0&&Mt(F)===!1){K.__webglMultisampledFramebuffer=n.createFramebuffer(),K.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let At=0;At<et.length;At++){const St=et[At];K.__webglColorRenderbuffer[At]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,K.__webglColorRenderbuffer[At]);const Yt=s.convert(St.format,St.colorSpace),gt=s.convert(St.type),Dt=x(St.internalFormat,Yt,gt,St.colorSpace,F.isXRRenderTarget===!0),$=Tt(F);n.renderbufferStorageMultisample(n.RENDERBUFFER,$,Dt,F.width,F.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+At,n.RENDERBUFFER,K.__webglColorRenderbuffer[At])}n.bindRenderbuffer(n.RENDERBUFFER,null),F.depthBuffer&&(K.__webglDepthRenderbuffer=n.createRenderbuffer(),st(K.__webglDepthRenderbuffer,F,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ot){e.bindTexture(n.TEXTURE_CUBE_MAP,pt.__webglTexture),ft(n.TEXTURE_CUBE_MAP,R);for(let At=0;At<6;At++)if(R.mipmaps&&R.mipmaps.length>0)for(let St=0;St<R.mipmaps.length;St++)dt(K.__webglFramebuffer[At][St],F,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+At,St);else dt(K.__webglFramebuffer[At],F,R,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+At,0);g(R)&&m(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(yt){for(let At=0,St=et.length;At<St;At++){const Yt=et[At],gt=i.get(Yt);e.bindTexture(n.TEXTURE_2D,gt.__webglTexture),ft(n.TEXTURE_2D,Yt),dt(K.__webglFramebuffer,F,Yt,n.COLOR_ATTACHMENT0+At,n.TEXTURE_2D,0),g(Yt)&&m(n.TEXTURE_2D)}e.unbindTexture()}else{let At=n.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(At=F.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(At,pt.__webglTexture),ft(At,R),R.mipmaps&&R.mipmaps.length>0)for(let St=0;St<R.mipmaps.length;St++)dt(K.__webglFramebuffer[St],F,R,n.COLOR_ATTACHMENT0,At,St);else dt(K.__webglFramebuffer,F,R,n.COLOR_ATTACHMENT0,At,0);g(R)&&m(At),e.unbindTexture()}F.depthBuffer&&ut(F)}function lt(F){const R=F.textures;for(let K=0,pt=R.length;K<pt;K++){const et=R[K];if(g(et)){const ot=y(F),yt=i.get(et).__webglTexture;e.bindTexture(ot,yt),m(ot),e.unbindTexture()}}}const V=[],N=[];function Ct(F){if(F.samples>0){if(Mt(F)===!1){const R=F.textures,K=F.width,pt=F.height;let et=n.COLOR_BUFFER_BIT;const ot=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,yt=i.get(F),At=R.length>1;if(At)for(let St=0;St<R.length;St++)e.bindFramebuffer(n.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,yt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let St=0;St<R.length;St++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(et|=n.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(et|=n.STENCIL_BUFFER_BIT)),At){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,yt.__webglColorRenderbuffer[St]);const Yt=i.get(R[St]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Yt,0)}n.blitFramebuffer(0,0,K,pt,0,0,K,pt,et,n.NEAREST),l===!0&&(V.length=0,N.length=0,V.push(n.COLOR_ATTACHMENT0+St),F.depthBuffer&&F.resolveDepthBuffer===!1&&(V.push(ot),N.push(ot),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,N)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,V))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),At)for(let St=0;St<R.length;St++){e.bindFramebuffer(n.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.RENDERBUFFER,yt.__webglColorRenderbuffer[St]);const Yt=i.get(R[St]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,yt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.TEXTURE_2D,Yt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&l){const R=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[R])}}}function Tt(F){return Math.min(a.maxSamples,F.samples)}function Mt(F){const R=i.get(F);return F.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function vt(F){const R=o.render.frame;h.get(F)!==R&&(h.set(F,R),F.update())}function mt(F,R){const K=F.colorSpace,pt=F.format,et=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||K!==Ws&&K!==ca&&(Re.getTransfer(K)===Fe?(pt!==gi||et!==qi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",K)),R}function kt(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(c.width=F.naturalWidth||F.width,c.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(c.width=F.displayWidth,c.height=F.displayHeight):(c.width=F.width,c.height=F.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=k,this.setTexture2D=C,this.setTexture2DArray=D,this.setTexture3D=B,this.setTextureCube=O,this.rebindTextures=Bt,this.setupRenderTarget=Zt,this.updateRenderTargetMipmap=lt,this.updateMultisampleRenderTarget=Ct,this.setupDepthRenderbuffer=ut,this.setupFrameBufferTexture=dt,this.useMultisampledRTT=Mt}function DA(n,t){function e(i,a=ca){let s;const o=Re.getTransfer(a);if(i===qi)return n.UNSIGNED_BYTE;if(i===id)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ad)return n.UNSIGNED_SHORT_5_5_5_1;if(i===wm)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===bm)return n.BYTE;if(i===Sm)return n.SHORT;if(i===Uo)return n.UNSIGNED_SHORT;if(i===nd)return n.INT;if(i===Ya)return n.UNSIGNED_INT;if(i===Ci)return n.FLOAT;if(i===Xo)return n.HALF_FLOAT;if(i===Em)return n.ALPHA;if(i===Tm)return n.RGB;if(i===gi)return n.RGBA;if(i===Am)return n.LUMINANCE;if(i===Rm)return n.LUMINANCE_ALPHA;if(i===Ls)return n.DEPTH_COMPONENT;if(i===Vs)return n.DEPTH_STENCIL;if(i===sd)return n.RED;if(i===od)return n.RED_INTEGER;if(i===Pm)return n.RG;if(i===rd)return n.RG_INTEGER;if(i===cd)return n.RGBA_INTEGER;if(i===Nr||i===Or||i===Br||i===Hr)if(o===Fe)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Nr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Or)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Br)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Hr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Nr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Or)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Br)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Hr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===lh||i===hh||i===dh||i===uh)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===lh)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===hh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===dh)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===uh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===fh||i===ph||i===mh)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===fh||i===ph)return o===Fe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===mh)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===gh||i===xh||i===vh||i===yh||i===Mh||i===_h||i===bh||i===Sh||i===wh||i===Eh||i===Th||i===Ah||i===Rh||i===Ph)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===gh)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===xh)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===vh)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===yh)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Mh)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===_h)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===bh)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Sh)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===wh)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Eh)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Th)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ah)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Rh)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ph)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Gr||i===Ch||i===Lh)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Gr)return o===Fe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ch)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Lh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Cm||i===kh||i===Dh||i===Ih)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Gr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===kh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Dh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ih)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Gs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class IA extends si{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ee extends Ke{constructor(){super(),this.isGroup=!0,this.type="Group"}}const zA={type:"move"};class bl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ee,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ee,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ee,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),m=this._getHandJoint(c,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,p=.005;c.inputState.pinching&&d>u+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(zA)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ee;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const FA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,UA=`
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

}`;class NA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new An,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Ma({vertexShader:FA,fragmentShader:UA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new re(new ai(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class OA extends Ys{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,p=null;const v=new NA,g=e.getContextAttributes();let m=null,y=null;const x=[],M=[],w=new Gt;let S=null;const E=new si;E.viewport=new tn;const T=new si;T.viewport=new tn;const b=[E,T],_=new IA;let A=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let at=x[Z];return at===void 0&&(at=new bl,x[Z]=at),at.getTargetRaySpace()},this.getControllerGrip=function(Z){let at=x[Z];return at===void 0&&(at=new bl,x[Z]=at),at.getGripSpace()},this.getHand=function(Z){let at=x[Z];return at===void 0&&(at=new bl,x[Z]=at),at.getHandSpace()};function L(Z){const at=M.indexOf(Z.inputSource);if(at===-1)return;const dt=x[at];dt!==void 0&&(dt.update(Z.inputSource,Z.frame,c||o),dt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function U(){a.removeEventListener("select",L),a.removeEventListener("selectstart",L),a.removeEventListener("selectend",L),a.removeEventListener("squeeze",L),a.removeEventListener("squeezestart",L),a.removeEventListener("squeezeend",L),a.removeEventListener("end",U),a.removeEventListener("inputsourceschange",C);for(let Z=0;Z<x.length;Z++){const at=M[Z];at!==null&&(M[Z]=null,x[Z].disconnect(at))}A=null,k=null,v.reset(),t.setRenderTarget(m),u=null,d=null,f=null,a=null,y=null,Rt.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){r=Z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return p},this.getSession=function(){return a},this.setSession=async function(Z){if(a=Z,a!==null){if(m=t.getRenderTarget(),a.addEventListener("select",L),a.addEventListener("selectstart",L),a.addEventListener("selectend",L),a.addEventListener("squeeze",L),a.addEventListener("squeezestart",L),a.addEventListener("squeezeend",L),a.addEventListener("end",U),a.addEventListener("inputsourceschange",C),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(w),a.renderState.layers===void 0){const at={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(a,e,at),a.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),y=new $a(u.framebufferWidth,u.framebufferHeight,{format:gi,type:qi,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let at=null,dt=null,st=null;g.depth&&(st=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,at=g.stencil?Vs:Ls,dt=g.stencil?Gs:Ya);const nt={colorFormat:e.RGBA8,depthFormat:st,scaleFactor:s};f=new XRWebGLBinding(a,e),d=f.createProjectionLayer(nt),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new $a(d.textureWidth,d.textureHeight,{format:gi,type:qi,depthTexture:new Xm(d.textureWidth,d.textureHeight,dt,void 0,void 0,void 0,void 0,void 0,void 0,at),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),Rt.setContext(a),Rt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function C(Z){for(let at=0;at<Z.removed.length;at++){const dt=Z.removed[at],st=M.indexOf(dt);st>=0&&(M[st]=null,x[st].disconnect(dt))}for(let at=0;at<Z.added.length;at++){const dt=Z.added[at];let st=M.indexOf(dt);if(st===-1){for(let ut=0;ut<x.length;ut++)if(ut>=M.length){M.push(dt),st=ut;break}else if(M[ut]===null){M[ut]=dt,st=ut;break}if(st===-1)break}const nt=x[st];nt&&nt.connect(dt)}}const D=new G,B=new G;function O(Z,at,dt){D.setFromMatrixPosition(at.matrixWorld),B.setFromMatrixPosition(dt.matrixWorld);const st=D.distanceTo(B),nt=at.projectionMatrix.elements,ut=dt.projectionMatrix.elements,Bt=nt[14]/(nt[10]-1),Zt=nt[14]/(nt[10]+1),lt=(nt[9]+1)/nt[5],V=(nt[9]-1)/nt[5],N=(nt[8]-1)/nt[0],Ct=(ut[8]+1)/ut[0],Tt=Bt*N,Mt=Bt*Ct,vt=st/(-N+Ct),mt=vt*-N;if(at.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(mt),Z.translateZ(vt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),nt[10]===-1)Z.projectionMatrix.copy(at.projectionMatrix),Z.projectionMatrixInverse.copy(at.projectionMatrixInverse);else{const kt=Bt+vt,F=Zt+vt,R=Tt-mt,K=Mt+(st-mt),pt=lt*Zt/F*kt,et=V*Zt/F*kt;Z.projectionMatrix.makePerspective(R,K,pt,et,kt,F),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function X(Z,at){at===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(at.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(a===null)return;let at=Z.near,dt=Z.far;v.texture!==null&&(v.depthNear>0&&(at=v.depthNear),v.depthFar>0&&(dt=v.depthFar)),_.near=T.near=E.near=at,_.far=T.far=E.far=dt,(A!==_.near||k!==_.far)&&(a.updateRenderState({depthNear:_.near,depthFar:_.far}),A=_.near,k=_.far),E.layers.mask=Z.layers.mask|2,T.layers.mask=Z.layers.mask|4,_.layers.mask=E.layers.mask|T.layers.mask;const st=Z.parent,nt=_.cameras;X(_,st);for(let ut=0;ut<nt.length;ut++)X(nt[ut],st);nt.length===2?O(_,E,T):_.projectionMatrix.copy(E.projectionMatrix),it(Z,_,st)};function it(Z,at,dt){dt===null?Z.matrix.copy(at.matrixWorld):(Z.matrix.copy(dt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(at.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(at.projectionMatrix),Z.projectionMatrixInverse.copy(at.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=No*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Z)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(_)};let ht=null;function ft(Z,at){if(h=at.getViewerPose(c||o),p=at,h!==null){const dt=h.views;u!==null&&(t.setRenderTargetFramebuffer(y,u.framebuffer),t.setRenderTarget(y));let st=!1;dt.length!==_.cameras.length&&(_.cameras.length=0,st=!0);for(let ut=0;ut<dt.length;ut++){const Bt=dt[ut];let Zt=null;if(u!==null)Zt=u.getViewport(Bt);else{const V=f.getViewSubImage(d,Bt);Zt=V.viewport,ut===0&&(t.setRenderTargetTextures(y,V.colorTexture,d.ignoreDepthValues?void 0:V.depthStencilTexture),t.setRenderTarget(y))}let lt=b[ut];lt===void 0&&(lt=new si,lt.layers.enable(ut),lt.viewport=new tn,b[ut]=lt),lt.matrix.fromArray(Bt.transform.matrix),lt.matrix.decompose(lt.position,lt.quaternion,lt.scale),lt.projectionMatrix.fromArray(Bt.projectionMatrix),lt.projectionMatrixInverse.copy(lt.projectionMatrix).invert(),lt.viewport.set(Zt.x,Zt.y,Zt.width,Zt.height),ut===0&&(_.matrix.copy(lt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),st===!0&&_.cameras.push(lt)}const nt=a.enabledFeatures;if(nt&&nt.includes("depth-sensing")){const ut=f.getDepthInformation(dt[0]);ut&&ut.isValid&&ut.texture&&v.init(t,ut,a.renderState)}}for(let dt=0;dt<x.length;dt++){const st=M[dt],nt=x[dt];st!==null&&nt!==void 0&&nt.update(st,at,c||o)}ht&&ht(Z,at),at.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:at}),p=null}const Rt=new Gm;Rt.setAnimationLoop(ft),this.setAnimationLoop=function(Z){ht=Z},this.dispose=function(){}}}const ka=new Di,BA=new Ce;function HA(n,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function i(g,m){m.color.getRGB(g.fogColor.value,Om(n)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function a(g,m,y,x,M){m.isMeshBasicMaterial||m.isMeshLambertMaterial?s(g,m):m.isMeshToonMaterial?(s(g,m),f(g,m)):m.isMeshPhongMaterial?(s(g,m),h(g,m)):m.isMeshStandardMaterial?(s(g,m),d(g,m),m.isMeshPhysicalMaterial&&u(g,m,M)):m.isMeshMatcapMaterial?(s(g,m),p(g,m)):m.isMeshDepthMaterial?s(g,m):m.isMeshDistanceMaterial?(s(g,m),v(g,m)):m.isMeshNormalMaterial?s(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&r(g,m)):m.isPointsMaterial?l(g,m,y,x):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Gn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Gn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const y=t.get(m),x=y.envMap,M=y.envMapRotation;x&&(g.envMap.value=x,ka.copy(M),ka.x*=-1,ka.y*=-1,ka.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ka.y*=-1,ka.z*=-1),g.envMapRotation.value.setFromMatrix4(BA.makeRotationFromEuler(ka)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function r(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,y,x){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*y,g.scale.value=x*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function f(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function u(g,m,y){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Gn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function v(g,m){const y=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function GA(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,x){const M=x.program;i.uniformBlockBinding(y,M)}function c(y,x){let M=a[y.id];M===void 0&&(p(y),M=h(y),a[y.id]=M,y.addEventListener("dispose",g));const w=x.program;i.updateUBOMapping(y,w);const S=t.render.frame;s[y.id]!==S&&(d(y),s[y.id]=S)}function h(y){const x=f();y.__bindingPointIndex=x;const M=n.createBuffer(),w=y.__size,S=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,w,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,M),M}function f(){for(let y=0;y<r;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const x=a[y.id],M=y.uniforms,w=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let S=0,E=M.length;S<E;S++){const T=Array.isArray(M[S])?M[S]:[M[S]];for(let b=0,_=T.length;b<_;b++){const A=T[b];if(u(A,S,b,w)===!0){const k=A.__offset,L=Array.isArray(A.value)?A.value:[A.value];let U=0;for(let C=0;C<L.length;C++){const D=L[C],B=v(D);typeof D=="number"||typeof D=="boolean"?(A.__data[0]=D,n.bufferSubData(n.UNIFORM_BUFFER,k+U,A.__data)):D.isMatrix3?(A.__data[0]=D.elements[0],A.__data[1]=D.elements[1],A.__data[2]=D.elements[2],A.__data[3]=0,A.__data[4]=D.elements[3],A.__data[5]=D.elements[4],A.__data[6]=D.elements[5],A.__data[7]=0,A.__data[8]=D.elements[6],A.__data[9]=D.elements[7],A.__data[10]=D.elements[8],A.__data[11]=0):(D.toArray(A.__data,U),U+=B.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,A.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(y,x,M,w){const S=y.value,E=x+"_"+M;if(w[E]===void 0)return typeof S=="number"||typeof S=="boolean"?w[E]=S:w[E]=S.clone(),!0;{const T=w[E];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return w[E]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function p(y){const x=y.uniforms;let M=0;const w=16;for(let E=0,T=x.length;E<T;E++){const b=Array.isArray(x[E])?x[E]:[x[E]];for(let _=0,A=b.length;_<A;_++){const k=b[_],L=Array.isArray(k.value)?k.value:[k.value];for(let U=0,C=L.length;U<C;U++){const D=L[U],B=v(D),O=M%w,X=O%B.boundary,it=O+X;M+=X,it!==0&&w-it<B.storage&&(M+=w-it),k.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=M,M+=B.storage}}}const S=M%w;return S>0&&(M+=w-S),y.__size=M,y.__cache={},this}function v(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function g(y){const x=y.target;x.removeEventListener("dispose",g);const M=o.indexOf(x.__bindingPointIndex);o.splice(M,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function m(){for(const y in a)n.deleteBuffer(a[y]);o=[],a={},s={}}return{bind:l,update:c,dispose:m}}class VA{constructor(t={}){const{canvas:e=L1(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const p=new Uint32Array(4),v=new Int32Array(4);let g=null,m=null;const y=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Fn,this.toneMapping=ma,this.toneMappingExposure=1;const M=this;let w=!1,S=0,E=0,T=null,b=-1,_=null;const A=new tn,k=new tn;let L=null;const U=new te(0);let C=0,D=e.width,B=e.height,O=1,X=null,it=null;const ht=new tn(0,0,D,B),ft=new tn(0,0,D,B);let Rt=!1;const Z=new ud;let at=!1,dt=!1;const st=new Ce,nt=new Ce,ut=new G,Bt=new tn,Zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let lt=!1;function V(){return T===null?O:1}let N=i;function Ct(P,H){return e.getContext(P,H)}try{const P={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${td}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",Pt,!1),e.addEventListener("webglcontextcreationerror",wt,!1),N===null){const H="webgl2";if(N=Ct(H,P),N===null)throw Ct(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let Tt,Mt,vt,mt,kt,F,R,K,pt,et,ot,yt,At,St,Yt,gt,Dt,$,W,ct,Ot,zt,Lt,I;function _t(){Tt=new ZE(N),Tt.init(),zt=new DA(N,Tt),Mt=new GE(N,Tt,t,zt),vt=new CA(N,Tt),Mt.reverseDepthBuffer&&d&&vt.buffers.depth.setReversed(!0),mt=new KE(N),kt=new mA,F=new kA(N,Tt,vt,kt,Mt,zt,mt),R=new XE(M),K=new $E(M),pt=new aS(N),Lt=new BE(N,pt),et=new qE(N,pt,mt,Lt),ot=new QE(N,et,pt,mt),W=new JE(N,Mt,F),gt=new VE(kt),yt=new pA(M,R,K,Tt,Mt,Lt,gt),At=new HA(M,kt),St=new xA,Yt=new SA(Tt),$=new OE(M,R,K,vt,ot,u,l),Dt=new RA(M,ot,Mt),I=new GA(N,mt,Mt,vt),ct=new HE(N,Tt,mt),Ot=new jE(N,Tt,mt),mt.programs=yt.programs,M.capabilities=Mt,M.extensions=Tt,M.properties=kt,M.renderLists=St,M.shadowMap=Dt,M.state=vt,M.info=mt}_t();const tt=new OA(M,N);this.xr=tt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const P=Tt.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=Tt.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(P){P!==void 0&&(O=P,this.setSize(D,B,!1))},this.getSize=function(P){return P.set(D,B)},this.setSize=function(P,H,j=!0){if(tt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=P,B=H,e.width=Math.floor(P*O),e.height=Math.floor(H*O),j===!0&&(e.style.width=P+"px",e.style.height=H+"px"),this.setViewport(0,0,P,H)},this.getDrawingBufferSize=function(P){return P.set(D*O,B*O).floor()},this.setDrawingBufferSize=function(P,H,j){D=P,B=H,O=j,e.width=Math.floor(P*j),e.height=Math.floor(H*j),this.setViewport(0,0,P,H)},this.getCurrentViewport=function(P){return P.copy(A)},this.getViewport=function(P){return P.copy(ht)},this.setViewport=function(P,H,j,Q){P.isVector4?ht.set(P.x,P.y,P.z,P.w):ht.set(P,H,j,Q),vt.viewport(A.copy(ht).multiplyScalar(O).round())},this.getScissor=function(P){return P.copy(ft)},this.setScissor=function(P,H,j,Q){P.isVector4?ft.set(P.x,P.y,P.z,P.w):ft.set(P,H,j,Q),vt.scissor(k.copy(ft).multiplyScalar(O).round())},this.getScissorTest=function(){return Rt},this.setScissorTest=function(P){vt.setScissorTest(Rt=P)},this.setOpaqueSort=function(P){X=P},this.setTransparentSort=function(P){it=P},this.getClearColor=function(P){return P.copy($.getClearColor())},this.setClearColor=function(){$.setClearColor.apply($,arguments)},this.getClearAlpha=function(){return $.getClearAlpha()},this.setClearAlpha=function(){$.setClearAlpha.apply($,arguments)},this.clear=function(P=!0,H=!0,j=!0){let Q=0;if(P){let Y=!1;if(T!==null){const Et=T.texture.format;Y=Et===cd||Et===rd||Et===od}if(Y){const Et=T.texture.type,Ft=Et===qi||Et===Ya||Et===Uo||Et===Gs||Et===id||Et===ad,Vt=$.getClearColor(),Xt=$.getClearAlpha(),se=Vt.r,ee=Vt.g,qt=Vt.b;Ft?(p[0]=se,p[1]=ee,p[2]=qt,p[3]=Xt,N.clearBufferuiv(N.COLOR,0,p)):(v[0]=se,v[1]=ee,v[2]=qt,v[3]=Xt,N.clearBufferiv(N.COLOR,0,v))}else Q|=N.COLOR_BUFFER_BIT}H&&(Q|=N.DEPTH_BUFFER_BIT),j&&(Q|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",Pt,!1),e.removeEventListener("webglcontextcreationerror",wt,!1),St.dispose(),Yt.dispose(),kt.dispose(),R.dispose(),K.dispose(),ot.dispose(),Lt.dispose(),I.dispose(),yt.dispose(),tt.dispose(),tt.removeEventListener("sessionstart",sn),tt.removeEventListener("sessionend",on),Ae.stop()};function rt(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Pt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const P=mt.autoReset,H=Dt.enabled,j=Dt.autoUpdate,Q=Dt.needsUpdate,Y=Dt.type;_t(),mt.autoReset=P,Dt.enabled=H,Dt.autoUpdate=j,Dt.needsUpdate=Q,Dt.type=Y}function wt(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function Kt(P){const H=P.target;H.removeEventListener("dispose",Kt),he(H)}function he(P){ce(P),kt.remove(P)}function ce(P){const H=kt.get(P).programs;H!==void 0&&(H.forEach(function(j){yt.releaseProgram(j)}),P.isShaderMaterial&&yt.releaseShaderCache(P))}this.renderBufferDirect=function(P,H,j,Q,Y,Et){H===null&&(H=Zt);const Ft=Y.isMesh&&Y.matrixWorld.determinant()<0,Vt=q(P,H,j,Q,Y);vt.setMaterial(Q,Ft);let Xt=j.index,se=1;if(Q.wireframe===!0){if(Xt=et.getWireframeAttribute(j),Xt===void 0)return;se=2}const ee=j.drawRange,qt=j.attributes.position;let fe=ee.start*se,ie=(ee.start+ee.count)*se;Et!==null&&(fe=Math.max(fe,Et.start*se),ie=Math.min(ie,(Et.start+Et.count)*se)),Xt!==null?(fe=Math.max(fe,0),ie=Math.min(ie,Xt.count)):qt!=null&&(fe=Math.max(fe,0),ie=Math.min(ie,qt.count));const ve=ie-fe;if(ve<0||ve===1/0)return;Lt.setup(Y,Q,Vt,j,Xt);let Ue,pe=ct;if(Xt!==null&&(Ue=pt.get(Xt),pe=Ot,pe.setIndex(Ue)),Y.isMesh)Q.wireframe===!0?(vt.setLineWidth(Q.wireframeLinewidth*V()),pe.setMode(N.LINES)):pe.setMode(N.TRIANGLES);else if(Y.isLine){let Wt=Q.linewidth;Wt===void 0&&(Wt=1),vt.setLineWidth(Wt*V()),Y.isLineSegments?pe.setMode(N.LINES):Y.isLineLoop?pe.setMode(N.LINE_LOOP):pe.setMode(N.LINE_STRIP)}else Y.isPoints?pe.setMode(N.POINTS):Y.isSprite&&pe.setMode(N.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)pe.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(Tt.get("WEBGL_multi_draw"))pe.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Wt=Y._multiDrawStarts,mn=Y._multiDrawCounts,xe=Y._multiDrawCount,jt=Xt?pt.get(Xt).bytesPerElement:1,It=kt.get(Q).currentProgram.getUniforms();for(let $t=0;$t<xe;$t++)It.setValue(N,"_gl_DrawID",$t),pe.render(Wt[$t]/jt,mn[$t])}else if(Y.isInstancedMesh)pe.renderInstances(fe,ve,Y.count);else if(j.isInstancedBufferGeometry){const Wt=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,mn=Math.min(j.instanceCount,Wt);pe.renderInstances(fe,ve,mn)}else pe.render(fe,ve)};function ne(P,H,j){P.transparent===!0&&P.side===$e&&P.forceSinglePass===!1?(P.side=Gn,P.needsUpdate=!0,_n(P,H,j),P.side=ya,P.needsUpdate=!0,_n(P,H,j),P.side=$e):_n(P,H,j)}this.compile=function(P,H,j=null){j===null&&(j=P),m=Yt.get(j),m.init(H),x.push(m),j.traverseVisible(function(Y){Y.isLight&&Y.layers.test(H.layers)&&(m.pushLight(Y),Y.castShadow&&m.pushShadow(Y))}),P!==j&&P.traverseVisible(function(Y){Y.isLight&&Y.layers.test(H.layers)&&(m.pushLight(Y),Y.castShadow&&m.pushShadow(Y))}),m.setupLights();const Q=new Set;return P.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const Et=Y.material;if(Et)if(Array.isArray(Et))for(let Ft=0;Ft<Et.length;Ft++){const Vt=Et[Ft];ne(Vt,j,Y),Q.add(Vt)}else ne(Et,j,Y),Q.add(Et)}),x.pop(),m=null,Q},this.compileAsync=function(P,H,j=null){const Q=this.compile(P,H,j);return new Promise(Y=>{function Et(){if(Q.forEach(function(Ft){kt.get(Ft).currentProgram.isReady()&&Q.delete(Ft)}),Q.size===0){Y(P);return}setTimeout(Et,10)}Tt.get("KHR_parallel_shader_compile")!==null?Et():setTimeout(Et,10)})};let Te=null;function Pe(P){Te&&Te(P)}function sn(){Ae.stop()}function on(){Ae.start()}const Ae=new Gm;Ae.setAnimationLoop(Pe),typeof self<"u"&&Ae.setContext(self),this.setAnimationLoop=function(P){Te=P,tt.setAnimationLoop(P),P===null?Ae.stop():Ae.start()},tt.addEventListener("sessionstart",sn),tt.addEventListener("sessionend",on),this.render=function(P,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),tt.enabled===!0&&tt.isPresenting===!0&&(tt.cameraAutoUpdate===!0&&tt.updateCamera(H),H=tt.getCamera()),P.isScene===!0&&P.onBeforeRender(M,P,H,T),m=Yt.get(P,x.length),m.init(H),x.push(m),nt.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),Z.setFromProjectionMatrix(nt),dt=this.localClippingEnabled,at=gt.init(this.clippingPlanes,dt),g=St.get(P,y.length),g.init(),y.push(g),tt.enabled===!0&&tt.isPresenting===!0){const Et=M.xr.getDepthSensingMesh();Et!==null&&de(Et,H,-1/0,M.sortObjects)}de(P,H,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort(X,it),lt=tt.enabled===!1||tt.isPresenting===!1||tt.hasDepthSensing()===!1,lt&&$.addToRenderList(g,P),this.info.render.frame++,at===!0&&gt.beginShadows();const j=m.state.shadowsArray;Dt.render(j,P,H),at===!0&&gt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=g.opaque,Y=g.transmissive;if(m.setupLights(),H.isArrayCamera){const Et=H.cameras;if(Y.length>0)for(let Ft=0,Vt=Et.length;Ft<Vt;Ft++){const Xt=Et[Ft];Nn(Q,Y,P,Xt)}lt&&$.render(P);for(let Ft=0,Vt=Et.length;Ft<Vt;Ft++){const Xt=Et[Ft];hn(g,P,Xt,Xt.viewport)}}else Y.length>0&&Nn(Q,Y,P,H),lt&&$.render(P),hn(g,P,H);T!==null&&(F.updateMultisampleRenderTarget(T),F.updateRenderTargetMipmap(T)),P.isScene===!0&&P.onAfterRender(M,P,H),Lt.resetDefaultState(),b=-1,_=null,x.pop(),x.length>0?(m=x[x.length-1],at===!0&&gt.setGlobalState(M.clippingPlanes,m.state.camera)):m=null,y.pop(),y.length>0?g=y[y.length-1]:g=null};function de(P,H,j,Q){if(P.visible===!1)return;if(P.layers.test(H.layers)){if(P.isGroup)j=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(H);else if(P.isLight)m.pushLight(P),P.castShadow&&m.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||Z.intersectsSprite(P)){Q&&Bt.setFromMatrixPosition(P.matrixWorld).applyMatrix4(nt);const Ft=ot.update(P),Vt=P.material;Vt.visible&&g.push(P,Ft,Vt,j,Bt.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||Z.intersectsObject(P))){const Ft=ot.update(P),Vt=P.material;if(Q&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),Bt.copy(P.boundingSphere.center)):(Ft.boundingSphere===null&&Ft.computeBoundingSphere(),Bt.copy(Ft.boundingSphere.center)),Bt.applyMatrix4(P.matrixWorld).applyMatrix4(nt)),Array.isArray(Vt)){const Xt=Ft.groups;for(let se=0,ee=Xt.length;se<ee;se++){const qt=Xt[se],fe=Vt[qt.materialIndex];fe&&fe.visible&&g.push(P,Ft,fe,j,Bt.z,qt)}}else Vt.visible&&g.push(P,Ft,Vt,j,Bt.z,null)}}const Et=P.children;for(let Ft=0,Vt=Et.length;Ft<Vt;Ft++)de(Et[Ft],H,j,Q)}function hn(P,H,j,Q){const Y=P.opaque,Et=P.transmissive,Ft=P.transparent;m.setupLightsView(j),at===!0&&gt.setGlobalState(M.clippingPlanes,j),Q&&vt.viewport(A.copy(Q)),Y.length>0&&dn(Y,H,j),Et.length>0&&dn(Et,H,j),Ft.length>0&&dn(Ft,H,j),vt.buffers.depth.setTest(!0),vt.buffers.depth.setMask(!0),vt.buffers.color.setMask(!0),vt.setPolygonOffset(!1)}function Nn(P,H,j,Q){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[Q.id]===void 0&&(m.state.transmissionRenderTarget[Q.id]=new $a(1,1,{generateMipmaps:!0,type:Tt.has("EXT_color_buffer_half_float")||Tt.has("EXT_color_buffer_float")?Xo:qi,minFilter:Va,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Re.workingColorSpace}));const Et=m.state.transmissionRenderTarget[Q.id],Ft=Q.viewport||A;Et.setSize(Ft.z,Ft.w);const Vt=M.getRenderTarget();M.setRenderTarget(Et),M.getClearColor(U),C=M.getClearAlpha(),C<1&&M.setClearColor(16777215,.5),M.clear(),lt&&$.render(j);const Xt=M.toneMapping;M.toneMapping=ma;const se=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),m.setupLightsView(Q),at===!0&&gt.setGlobalState(M.clippingPlanes,Q),dn(P,j,Q),F.updateMultisampleRenderTarget(Et),F.updateRenderTargetMipmap(Et),Tt.has("WEBGL_multisampled_render_to_texture")===!1){let ee=!1;for(let qt=0,fe=H.length;qt<fe;qt++){const ie=H[qt],ve=ie.object,Ue=ie.geometry,pe=ie.material,Wt=ie.group;if(pe.side===$e&&ve.layers.test(Q.layers)){const mn=pe.side;pe.side=Gn,pe.needsUpdate=!0,Rn(ve,j,Q,Ue,pe,Wt),pe.side=mn,pe.needsUpdate=!0,ee=!0}}ee===!0&&(F.updateMultisampleRenderTarget(Et),F.updateRenderTargetMipmap(Et))}M.setRenderTarget(Vt),M.setClearColor(U,C),se!==void 0&&(Q.viewport=se),M.toneMapping=Xt}function dn(P,H,j){const Q=H.isScene===!0?H.overrideMaterial:null;for(let Y=0,Et=P.length;Y<Et;Y++){const Ft=P[Y],Vt=Ft.object,Xt=Ft.geometry,se=Q===null?Ft.material:Q,ee=Ft.group;Vt.layers.test(j.layers)&&Rn(Vt,H,j,Xt,se,ee)}}function Rn(P,H,j,Q,Y,Et){P.onBeforeRender(M,H,j,Q,Y,Et),P.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),Y.onBeforeRender(M,H,j,Q,P,Et),Y.transparent===!0&&Y.side===$e&&Y.forceSinglePass===!1?(Y.side=Gn,Y.needsUpdate=!0,M.renderBufferDirect(j,H,Q,Y,P,Et),Y.side=ya,Y.needsUpdate=!0,M.renderBufferDirect(j,H,Q,Y,P,Et),Y.side=$e):M.renderBufferDirect(j,H,Q,Y,P,Et),P.onAfterRender(M,H,j,Q,Y,Et)}function _n(P,H,j){H.isScene!==!0&&(H=Zt);const Q=kt.get(P),Y=m.state.lights,Et=m.state.shadowsArray,Ft=Y.state.version,Vt=yt.getParameters(P,Y.state,Et,H,j),Xt=yt.getProgramCacheKey(Vt);let se=Q.programs;Q.environment=P.isMeshStandardMaterial?H.environment:null,Q.fog=H.fog,Q.envMap=(P.isMeshStandardMaterial?K:R).get(P.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&P.envMap===null?H.environmentRotation:P.envMapRotation,se===void 0&&(P.addEventListener("dispose",Kt),se=new Map,Q.programs=se);let ee=se.get(Xt);if(ee!==void 0){if(Q.currentProgram===ee&&Q.lightsStateVersion===Ft)return On(P,Vt),ee}else Vt.uniforms=yt.getUniforms(P),P.onBeforeCompile(Vt,M),ee=yt.acquireProgram(Vt,Xt),se.set(Xt,ee),Q.uniforms=Vt.uniforms;const qt=Q.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(qt.clippingPlanes=gt.uniform),On(P,Vt),Q.needsLights=Ut(P),Q.lightsStateVersion=Ft,Q.needsLights&&(qt.ambientLightColor.value=Y.state.ambient,qt.lightProbe.value=Y.state.probe,qt.directionalLights.value=Y.state.directional,qt.directionalLightShadows.value=Y.state.directionalShadow,qt.spotLights.value=Y.state.spot,qt.spotLightShadows.value=Y.state.spotShadow,qt.rectAreaLights.value=Y.state.rectArea,qt.ltc_1.value=Y.state.rectAreaLTC1,qt.ltc_2.value=Y.state.rectAreaLTC2,qt.pointLights.value=Y.state.point,qt.pointLightShadows.value=Y.state.pointShadow,qt.hemisphereLights.value=Y.state.hemi,qt.directionalShadowMap.value=Y.state.directionalShadowMap,qt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,qt.spotShadowMap.value=Y.state.spotShadowMap,qt.spotLightMatrix.value=Y.state.spotLightMatrix,qt.spotLightMap.value=Y.state.spotLightMap,qt.pointShadowMap.value=Y.state.pointShadowMap,qt.pointShadowMatrix.value=Y.state.pointShadowMatrix),Q.currentProgram=ee,Q.uniformsList=null,ee}function Pn(P){if(P.uniformsList===null){const H=P.currentProgram.getUniforms();P.uniformsList=Vr.seqWithValue(H.seq,P.uniforms)}return P.uniformsList}function On(P,H){const j=kt.get(P);j.outputColorSpace=H.outputColorSpace,j.batching=H.batching,j.batchingColor=H.batchingColor,j.instancing=H.instancing,j.instancingColor=H.instancingColor,j.instancingMorph=H.instancingMorph,j.skinning=H.skinning,j.morphTargets=H.morphTargets,j.morphNormals=H.morphNormals,j.morphColors=H.morphColors,j.morphTargetsCount=H.morphTargetsCount,j.numClippingPlanes=H.numClippingPlanes,j.numIntersection=H.numClipIntersection,j.vertexAlphas=H.vertexAlphas,j.vertexTangents=H.vertexTangents,j.toneMapping=H.toneMapping}function q(P,H,j,Q,Y){H.isScene!==!0&&(H=Zt),F.resetTextureUnits();const Et=H.fog,Ft=Q.isMeshStandardMaterial?H.environment:null,Vt=T===null?M.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Ws,Xt=(Q.isMeshStandardMaterial?K:R).get(Q.envMap||Ft),se=Q.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,ee=!!j.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),qt=!!j.morphAttributes.position,fe=!!j.morphAttributes.normal,ie=!!j.morphAttributes.color;let ve=ma;Q.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ve=M.toneMapping);const Ue=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,pe=Ue!==void 0?Ue.length:0,Wt=kt.get(Q),mn=m.state.lights;if(at===!0&&(dt===!0||P!==_)){const Be=P===_&&Q.id===b;gt.setState(Q,P,Be)}let xe=!1;Q.version===Wt.__version?(Wt.needsLights&&Wt.lightsStateVersion!==mn.state.version||Wt.outputColorSpace!==Vt||Y.isBatchedMesh&&Wt.batching===!1||!Y.isBatchedMesh&&Wt.batching===!0||Y.isBatchedMesh&&Wt.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Wt.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Wt.instancing===!1||!Y.isInstancedMesh&&Wt.instancing===!0||Y.isSkinnedMesh&&Wt.skinning===!1||!Y.isSkinnedMesh&&Wt.skinning===!0||Y.isInstancedMesh&&Wt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Wt.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Wt.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Wt.instancingMorph===!1&&Y.morphTexture!==null||Wt.envMap!==Xt||Q.fog===!0&&Wt.fog!==Et||Wt.numClippingPlanes!==void 0&&(Wt.numClippingPlanes!==gt.numPlanes||Wt.numIntersection!==gt.numIntersection)||Wt.vertexAlphas!==se||Wt.vertexTangents!==ee||Wt.morphTargets!==qt||Wt.morphNormals!==fe||Wt.morphColors!==ie||Wt.toneMapping!==ve||Wt.morphTargetsCount!==pe)&&(xe=!0):(xe=!0,Wt.__version=Q.version);let jt=Wt.currentProgram;xe===!0&&(jt=_n(Q,H,Y));let It=!1,$t=!1,ke=!1;const le=jt.getUniforms(),ue=Wt.uniforms;if(vt.useProgram(jt.program)&&(It=!0,$t=!0,ke=!0),Q.id!==b&&(b=Q.id,$t=!0),It||_!==P){vt.buffers.depth.getReversed()?(st.copy(P.projectionMatrix),D1(st),I1(st),le.setValue(N,"projectionMatrix",st)):le.setValue(N,"projectionMatrix",P.projectionMatrix),le.setValue(N,"viewMatrix",P.matrixWorldInverse);const gn=le.map.cameraPosition;gn!==void 0&&gn.setValue(N,ut.setFromMatrixPosition(P.matrixWorld)),Mt.logarithmicDepthBuffer&&le.setValue(N,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&le.setValue(N,"isOrthographic",P.isOrthographicCamera===!0),_!==P&&(_=P,$t=!0,ke=!0)}if(Y.isSkinnedMesh){le.setOptional(N,Y,"bindMatrix"),le.setOptional(N,Y,"bindMatrixInverse");const Be=Y.skeleton;Be&&(Be.boneTexture===null&&Be.computeBoneTexture(),le.setValue(N,"boneTexture",Be.boneTexture,F))}Y.isBatchedMesh&&(le.setOptional(N,Y,"batchingTexture"),le.setValue(N,"batchingTexture",Y._matricesTexture,F),le.setOptional(N,Y,"batchingIdTexture"),le.setValue(N,"batchingIdTexture",Y._indirectTexture,F),le.setOptional(N,Y,"batchingColorTexture"),Y._colorsTexture!==null&&le.setValue(N,"batchingColorTexture",Y._colorsTexture,F));const be=j.morphAttributes;if((be.position!==void 0||be.normal!==void 0||be.color!==void 0)&&W.update(Y,j,jt),($t||Wt.receiveShadow!==Y.receiveShadow)&&(Wt.receiveShadow=Y.receiveShadow,le.setValue(N,"receiveShadow",Y.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(ue.envMap.value=Xt,ue.flipEnvMap.value=Xt.isCubeTexture&&Xt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&H.environment!==null&&(ue.envMapIntensity.value=H.environmentIntensity),$t&&(le.setValue(N,"toneMappingExposure",M.toneMappingExposure),Wt.needsLights&&Nt(ue,ke),Et&&Q.fog===!0&&At.refreshFogUniforms(ue,Et),At.refreshMaterialUniforms(ue,Q,O,B,m.state.transmissionRenderTarget[P.id]),Vr.upload(N,Pn(Wt),ue,F)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Vr.upload(N,Pn(Wt),ue,F),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&le.setValue(N,"center",Y.center),le.setValue(N,"modelViewMatrix",Y.modelViewMatrix),le.setValue(N,"normalMatrix",Y.normalMatrix),le.setValue(N,"modelMatrix",Y.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const Be=Q.uniformsGroups;for(let gn=0,rn=Be.length;gn<rn;gn++){const oi=Be[gn];I.update(oi,jt),I.bind(oi,jt)}}return jt}function Nt(P,H){P.ambientLightColor.needsUpdate=H,P.lightProbe.needsUpdate=H,P.directionalLights.needsUpdate=H,P.directionalLightShadows.needsUpdate=H,P.pointLights.needsUpdate=H,P.pointLightShadows.needsUpdate=H,P.spotLights.needsUpdate=H,P.spotLightShadows.needsUpdate=H,P.rectAreaLights.needsUpdate=H,P.hemisphereLights.needsUpdate=H}function Ut(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(P,H,j){kt.get(P.texture).__webglTexture=H,kt.get(P.depthTexture).__webglTexture=j;const Q=kt.get(P);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=j===void 0,Q.__autoAllocateDepthBuffer||Tt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,H){const j=kt.get(P);j.__webglFramebuffer=H,j.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(P,H=0,j=0){T=P,S=H,E=j;let Q=!0,Y=null,Et=!1,Ft=!1;if(P){const Xt=kt.get(P);if(Xt.__useDefaultFramebuffer!==void 0)vt.bindFramebuffer(N.FRAMEBUFFER,null),Q=!1;else if(Xt.__webglFramebuffer===void 0)F.setupRenderTarget(P);else if(Xt.__hasExternalTextures)F.rebindTextures(P,kt.get(P.texture).__webglTexture,kt.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const qt=P.depthTexture;if(Xt.__boundDepthTexture!==qt){if(qt!==null&&kt.has(qt)&&(P.width!==qt.image.width||P.height!==qt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");F.setupDepthRenderbuffer(P)}}const se=P.texture;(se.isData3DTexture||se.isDataArrayTexture||se.isCompressedArrayTexture)&&(Ft=!0);const ee=kt.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(ee[H])?Y=ee[H][j]:Y=ee[H],Et=!0):P.samples>0&&F.useMultisampledRTT(P)===!1?Y=kt.get(P).__webglMultisampledFramebuffer:Array.isArray(ee)?Y=ee[j]:Y=ee,A.copy(P.viewport),k.copy(P.scissor),L=P.scissorTest}else A.copy(ht).multiplyScalar(O).floor(),k.copy(ft).multiplyScalar(O).floor(),L=Rt;if(vt.bindFramebuffer(N.FRAMEBUFFER,Y)&&Q&&vt.drawBuffers(P,Y),vt.viewport(A),vt.scissor(k),vt.setScissorTest(L),Et){const Xt=kt.get(P.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+H,Xt.__webglTexture,j)}else if(Ft){const Xt=kt.get(P.texture),se=H||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,Xt.__webglTexture,j||0,se)}b=-1},this.readRenderTargetPixels=function(P,H,j,Q,Y,Et,Ft){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Vt=kt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Ft!==void 0&&(Vt=Vt[Ft]),Vt){vt.bindFramebuffer(N.FRAMEBUFFER,Vt);try{const Xt=P.texture,se=Xt.format,ee=Xt.type;if(!Mt.textureFormatReadable(se)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Mt.textureTypeReadable(ee)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=P.width-Q&&j>=0&&j<=P.height-Y&&N.readPixels(H,j,Q,Y,zt.convert(se),zt.convert(ee),Et)}finally{const Xt=T!==null?kt.get(T).__webglFramebuffer:null;vt.bindFramebuffer(N.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(P,H,j,Q,Y,Et,Ft){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Vt=kt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Ft!==void 0&&(Vt=Vt[Ft]),Vt){const Xt=P.texture,se=Xt.format,ee=Xt.type;if(!Mt.textureFormatReadable(se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Mt.textureTypeReadable(ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(H>=0&&H<=P.width-Q&&j>=0&&j<=P.height-Y){vt.bindFramebuffer(N.FRAMEBUFFER,Vt);const qt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,qt),N.bufferData(N.PIXEL_PACK_BUFFER,Et.byteLength,N.STREAM_READ),N.readPixels(H,j,Q,Y,zt.convert(se),zt.convert(ee),0);const fe=T!==null?kt.get(T).__webglFramebuffer:null;vt.bindFramebuffer(N.FRAMEBUFFER,fe);const ie=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await k1(N,ie,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,qt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Et),N.deleteBuffer(qt),N.deleteSync(ie),Et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(P,H=null,j=0){P.isTexture!==!0&&(yo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),H=arguments[0]||null,P=arguments[1]);const Q=Math.pow(2,-j),Y=Math.floor(P.image.width*Q),Et=Math.floor(P.image.height*Q),Ft=H!==null?H.x:0,Vt=H!==null?H.y:0;F.setTexture2D(P,0),N.copyTexSubImage2D(N.TEXTURE_2D,j,0,0,Ft,Vt,Y,Et),vt.unbindTexture()},this.copyTextureToTexture=function(P,H,j=null,Q=null,Y=0){P.isTexture!==!0&&(yo("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,P=arguments[1],H=arguments[2],Y=arguments[3]||0,j=null);let Et,Ft,Vt,Xt,se,ee,qt,fe,ie;const ve=P.isCompressedTexture?P.mipmaps[Y]:P.image;j!==null?(Et=j.max.x-j.min.x,Ft=j.max.y-j.min.y,Vt=j.isBox3?j.max.z-j.min.z:1,Xt=j.min.x,se=j.min.y,ee=j.isBox3?j.min.z:0):(Et=ve.width,Ft=ve.height,Vt=ve.depth||1,Xt=0,se=0,ee=0),Q!==null?(qt=Q.x,fe=Q.y,ie=Q.z):(qt=0,fe=0,ie=0);const Ue=zt.convert(H.format),pe=zt.convert(H.type);let Wt;H.isData3DTexture?(F.setTexture3D(H,0),Wt=N.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(F.setTexture2DArray(H,0),Wt=N.TEXTURE_2D_ARRAY):(F.setTexture2D(H,0),Wt=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,H.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,H.unpackAlignment);const mn=N.getParameter(N.UNPACK_ROW_LENGTH),xe=N.getParameter(N.UNPACK_IMAGE_HEIGHT),jt=N.getParameter(N.UNPACK_SKIP_PIXELS),It=N.getParameter(N.UNPACK_SKIP_ROWS),$t=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,ve.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ve.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Xt),N.pixelStorei(N.UNPACK_SKIP_ROWS,se),N.pixelStorei(N.UNPACK_SKIP_IMAGES,ee);const ke=P.isDataArrayTexture||P.isData3DTexture,le=H.isDataArrayTexture||H.isData3DTexture;if(P.isRenderTargetTexture||P.isDepthTexture){const ue=kt.get(P),be=kt.get(H),Be=kt.get(ue.__renderTarget),gn=kt.get(be.__renderTarget);vt.bindFramebuffer(N.READ_FRAMEBUFFER,Be.__webglFramebuffer),vt.bindFramebuffer(N.DRAW_FRAMEBUFFER,gn.__webglFramebuffer);for(let rn=0;rn<Vt;rn++)ke&&N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,kt.get(P).__webglTexture,Y,ee+rn),P.isDepthTexture?(le&&N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,kt.get(H).__webglTexture,Y,ie+rn),N.blitFramebuffer(Xt,se,Et,Ft,qt,fe,Et,Ft,N.DEPTH_BUFFER_BIT,N.NEAREST)):le?N.copyTexSubImage3D(Wt,Y,qt,fe,ie+rn,Xt,se,Et,Ft):N.copyTexSubImage2D(Wt,Y,qt,fe,ie+rn,Xt,se,Et,Ft);vt.bindFramebuffer(N.READ_FRAMEBUFFER,null),vt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else le?P.isDataTexture||P.isData3DTexture?N.texSubImage3D(Wt,Y,qt,fe,ie,Et,Ft,Vt,Ue,pe,ve.data):H.isCompressedArrayTexture?N.compressedTexSubImage3D(Wt,Y,qt,fe,ie,Et,Ft,Vt,Ue,ve.data):N.texSubImage3D(Wt,Y,qt,fe,ie,Et,Ft,Vt,Ue,pe,ve):P.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Y,qt,fe,Et,Ft,Ue,pe,ve.data):P.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Y,qt,fe,ve.width,ve.height,Ue,ve.data):N.texSubImage2D(N.TEXTURE_2D,Y,qt,fe,Et,Ft,Ue,pe,ve);N.pixelStorei(N.UNPACK_ROW_LENGTH,mn),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,xe),N.pixelStorei(N.UNPACK_SKIP_PIXELS,jt),N.pixelStorei(N.UNPACK_SKIP_ROWS,It),N.pixelStorei(N.UNPACK_SKIP_IMAGES,$t),Y===0&&H.generateMipmaps&&N.generateMipmap(Wt),vt.unbindTexture()},this.copyTextureToTexture3D=function(P,H,j=null,Q=null,Y=0){return P.isTexture!==!0&&(yo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),j=arguments[0]||null,Q=arguments[1]||null,P=arguments[2],H=arguments[3],Y=arguments[4]||0),yo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(P,H,j,Q,Y)},this.initRenderTarget=function(P){kt.get(P).__webglFramebuffer===void 0&&F.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?F.setTextureCube(P,0):P.isData3DTexture?F.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?F.setTexture2DArray(P,0):F.setTexture2D(P,0),vt.unbindTexture()},this.resetState=function(){S=0,E=0,T=null,vt.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return $i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Re._getDrawingBufferColorSpace(t),e.unpackColorSpace=Re._getUnpackColorSpace()}}class XA extends Ke{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Di,this.environmentIntensity=1,this.environmentRotation=new Di,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class WA{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=zh,this.updateRanges=[],this.version=0,this.uuid=ki()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ki()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ki()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const kn=new G;class sc{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)kn.fromBufferAttribute(this,e),kn.applyMatrix4(t),this.setXYZ(e,kn.x,kn.y,kn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)kn.fromBufferAttribute(this,e),kn.applyNormalMatrix(t),this.setXYZ(e,kn.x,kn.y,kn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)kn.fromBufferAttribute(this,e),kn.transformDirection(t),this.setXYZ(e,kn.x,kn.y,kn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=mi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ie(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=mi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=mi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=mi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=mi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array),a=Ie(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array),a=Ie(a,this.array),s=Ie(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new Mn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new sc(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Uh extends ja{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new te(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Ms;const uo=new G,_s=new G,bs=new G,Ss=new Gt,fo=new Gt,qm=new Ce,wr=new G,po=new G,Er=new G,$f=new Gt,Sl=new Gt,Zf=new Gt;class qf extends Ke{constructor(t=new Uh){if(super(),this.isSprite=!0,this.type="Sprite",Ms===void 0){Ms=new an;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new WA(e,5);Ms.setIndex([0,1,2,0,2,3]),Ms.setAttribute("position",new sc(i,3,0,!1)),Ms.setAttribute("uv",new sc(i,2,3,!1))}this.geometry=Ms,this.material=t,this.center=new Gt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),_s.setFromMatrixScale(this.matrixWorld),qm.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),bs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&_s.multiplyScalar(-bs.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;Tr(wr.set(-.5,-.5,0),bs,o,_s,a,s),Tr(po.set(.5,-.5,0),bs,o,_s,a,s),Tr(Er.set(.5,.5,0),bs,o,_s,a,s),$f.set(0,0),Sl.set(1,0),Zf.set(1,1);let r=t.ray.intersectTriangle(wr,po,Er,!1,uo);if(r===null&&(Tr(po.set(-.5,.5,0),bs,o,_s,a,s),Sl.set(0,1),r=t.ray.intersectTriangle(wr,Er,po,!1,uo),r===null))return;const l=t.ray.origin.distanceTo(uo);l<t.near||l>t.far||e.push({distance:l,point:uo.clone(),uv:Kn.getInterpolation(uo,wr,po,Er,$f,Sl,Zf,new Gt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Tr(n,t,e,i,a,s){Ss.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(fo.x=s*Ss.x-a*Ss.y,fo.y=a*Ss.x+s*Ss.y):fo.copy(Ss),n.copy(t),n.x+=fo.x,n.y+=fo.y,n.applyMatrix4(qm)}class YA extends An{constructor(t=null,e=1,i=1,a,s,o,r,l,c=Jn,h=Jn,f,d){super(null,o,r,l,c,h,a,s,f,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ao extends Mn{constructor(t,e,i,a=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ws=new Ce,jf=new Ce,Ar=[],Kf=new qa,$A=new Ce,mo=new re,go=new $s;class Jf extends re{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ao(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,$A)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new qa),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,ws),Kf.copy(t.boundingBox).applyMatrix4(ws),this.boundingBox.union(Kf)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new $s),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,ws),go.copy(t.boundingSphere).applyMatrix4(ws),this.boundingSphere.union(go)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,a=this.morphTexture.source.data.data,s=i.length+1,o=t*s+1;for(let r=0;r<i.length;r++)i[r]=a[o+r]}raycast(t,e){const i=this.matrixWorld,a=this.count;if(mo.geometry=this.geometry,mo.material=this.material,mo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),go.copy(this.boundingSphere),go.applyMatrix4(i),t.ray.intersectsSphere(go)!==!1))for(let s=0;s<a;s++){this.getMatrixAt(s,ws),jf.multiplyMatrices(i,ws),mo.matrixWorld=jf,mo.raycast(t,Ar);for(let o=0,r=Ar.length;o<r;o++){const l=Ar[o];l.instanceId=s,l.object=this,e.push(l)}Ar.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ao(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new YA(new Float32Array(a*this.count),a,this.count,sd,Ci));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<i.length;c++)o+=i[c];const r=this.geometry.morphTargetsRelative?1:1-o,l=a*t;s[l]=r,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class pd extends ja{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const oc=new G,rc=new G,Qf=new Ce,xo=new hd,Rr=new $s,wl=new G,tp=new G;class ZA extends Ke{constructor(t=new an,e=new pd){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)oc.fromBufferAttribute(e,a-1),rc.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=oc.distanceTo(rc);t.setAttribute("lineDistance",new Le(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Rr.copy(i.boundingSphere),Rr.applyMatrix4(a),Rr.radius+=s,t.ray.intersectsSphere(Rr)===!1)return;Qf.copy(a).invert(),xo.copy(t.ray).applyMatrix4(Qf);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let v=u,g=p-1;v<g;v+=c){const m=h.getX(v),y=h.getX(v+1),x=Pr(this,t,xo,l,m,y);x&&e.push(x)}if(this.isLineLoop){const v=h.getX(p-1),g=h.getX(u),m=Pr(this,t,xo,l,v,g);m&&e.push(m)}}else{const u=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let v=u,g=p-1;v<g;v+=c){const m=Pr(this,t,xo,l,v,v+1);m&&e.push(m)}if(this.isLineLoop){const v=Pr(this,t,xo,l,p-1,u);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function Pr(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(oc.fromBufferAttribute(o,a),rc.fromBufferAttribute(o,s),e.distanceSqToSegment(oc,rc,wl,tp)>i)return;wl.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(wl);if(!(l<t.near||l>t.far))return{distance:l,point:tp.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const ep=new G,np=new G;class jm extends ZA{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)ep.fromBufferAttribute(e,a),np.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+ep.distanceTo(np);t.setAttribute("lineDistance",new Le(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Nh extends An{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ii{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,u=(o-h)/d;return(a+u)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new Gt:new G);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new G,a=[],s=[],o=[],r=new G,l=new Ce;for(let u=0;u<=t;u++){const p=u/t;a[u]=this.getTangentAt(p,new G)}s[0]=new G,o[0]=new G;let c=Number.MAX_VALUE;const h=Math.abs(a[0].x),f=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let u=1;u<=t;u++){if(s[u]=s[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(a[u-1],a[u]),r.length()>Number.EPSILON){r.normalize();const p=Math.acos(bn(a[u-1].dot(a[u]),-1,1));s[u].applyMatrix4(l.makeRotationAxis(r,p))}o[u].crossVectors(a[u],s[u])}if(e===!0){let u=Math.acos(bn(s[0].dot(s[t]),-1,1));u/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(u=-u);for(let p=1;p<=t;p++)s[p].applyMatrix4(l.makeRotationAxis(a[p],u*p)),o[p].crossVectors(a[p],s[p])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class md extends Ii{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Gt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class qA extends md{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function gd(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,h,f){let d=(o-s)/c-(r-s)/(c+h)+(r-o)/h,u=(r-o)/h-(l-o)/(h+f)+(l-r)/f;d*=h,u*=h,a(o,r,d,u)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const Cr=new G,El=new gd,Tl=new gd,Al=new gd;class jA extends Ii{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new G){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,h;this.closed||r>0?c=a[(r-1)%s]:(Cr.subVectors(a[0],a[1]).add(a[0]),c=Cr);const f=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:(Cr.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=Cr),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(f),u),v=Math.pow(f.distanceToSquared(d),u),g=Math.pow(d.distanceToSquared(h),u);v<1e-4&&(v=1),p<1e-4&&(p=v),g<1e-4&&(g=v),El.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,p,v,g),Tl.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,p,v,g),Al.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,p,v,g)}else this.curveType==="catmullrom"&&(El.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),Tl.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),Al.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return i.set(El.calc(l),Tl.calc(l),Al.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new G().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function ip(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function KA(n,t){const e=1-n;return e*e*t}function JA(n,t){return 2*(1-n)*n*t}function QA(n,t){return n*n*t}function Ro(n,t,e,i){return KA(n,t)+JA(n,e)+QA(n,i)}function t2(n,t){const e=1-n;return e*e*e*t}function e2(n,t){const e=1-n;return 3*e*e*n*t}function n2(n,t){return 3*(1-n)*n*n*t}function i2(n,t){return n*n*n*t}function Po(n,t,e,i,a){return t2(n,t)+e2(n,e)+n2(n,i)+i2(n,a)}class Km extends Ii{constructor(t=new Gt,e=new Gt,i=new Gt,a=new Gt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Gt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Po(t,a.x,s.x,o.x,r.x),Po(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class a2 extends Ii{constructor(t=new G,e=new G,i=new G,a=new G){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new G){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Po(t,a.x,s.x,o.x,r.x),Po(t,a.y,s.y,o.y,r.y),Po(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Jm extends Ii{constructor(t=new Gt,e=new Gt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Gt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Gt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class s2 extends Ii{constructor(t=new G,e=new G){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new G){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new G){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Qm extends Ii{constructor(t=new Gt,e=new Gt,i=new Gt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Gt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Ro(t,a.x,s.x,o.x),Ro(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class o2 extends Ii{constructor(t=new G,e=new G,i=new G){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new G){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Ro(t,a.x,s.x,o.x),Ro(t,a.y,s.y,o.y),Ro(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class t0 extends Ii{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Gt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],h=a[o>a.length-2?a.length-1:o+1],f=a[o>a.length-3?a.length-1:o+2];return i.set(ip(r,l.x,c.x,h.x,f.x),ip(r,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Gt().fromArray(a))}return this}}var ap=Object.freeze({__proto__:null,ArcCurve:qA,CatmullRomCurve3:jA,CubicBezierCurve:Km,CubicBezierCurve3:a2,EllipseCurve:md,LineCurve:Jm,LineCurve3:s2,QuadraticBezierCurve:Qm,QuadraticBezierCurve3:o2,SplineCurve:t0});class r2 extends Ii{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ap[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new ap[a.type]().fromJSON(a))}return this}}class sp extends r2{constructor(t){super(),this.type="Path",this.currentPoint=new Gt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Jm(this.currentPoint.clone(),new Gt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new Qm(this.currentPoint.clone(),new Gt(t,e),new Gt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new Km(this.currentPoint.clone(),new Gt(t,e),new Gt(i,a),new Gt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new t0(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new md(t,e,i,a,s,o,r,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class xd extends an{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new G,h=new Gt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*a;c.x=t*Math.cos(u),c.y=t*Math.sin(u),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new Le(o,3)),this.setAttribute("normal",new Le(r,3)),this.setAttribute("uv",new Le(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xd(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Oo extends an{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const h=[],f=[],d=[],u=[];let p=0;const v=[],g=i/2;let m=0;y(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Le(f,3)),this.setAttribute("normal",new Le(d,3)),this.setAttribute("uv",new Le(u,2));function y(){const M=new G,w=new G;let S=0;const E=(e-t)/i;for(let T=0;T<=s;T++){const b=[],_=T/s,A=_*(e-t)+t;for(let k=0;k<=a;k++){const L=k/a,U=L*l+r,C=Math.sin(U),D=Math.cos(U);w.x=A*C,w.y=-_*i+g,w.z=A*D,f.push(w.x,w.y,w.z),M.set(C,E,D).normalize(),d.push(M.x,M.y,M.z),u.push(L,1-_),b.push(p++)}v.push(b)}for(let T=0;T<a;T++)for(let b=0;b<s;b++){const _=v[b][T],A=v[b+1][T],k=v[b+1][T+1],L=v[b][T+1];(t>0||b!==0)&&(h.push(_,A,L),S+=3),(e>0||b!==s-1)&&(h.push(A,k,L),S+=3)}c.addGroup(m,S,0),m+=S}function x(M){const w=p,S=new Gt,E=new G;let T=0;const b=M===!0?t:e,_=M===!0?1:-1;for(let k=1;k<=a;k++)f.push(0,g*_,0),d.push(0,_,0),u.push(.5,.5),p++;const A=p;for(let k=0;k<=a;k++){const U=k/a*l+r,C=Math.cos(U),D=Math.sin(U);E.x=b*D,E.y=g*_,E.z=b*C,f.push(E.x,E.y,E.z),d.push(0,_,0),S.x=C*.5+.5,S.y=D*.5*_+.5,u.push(S.x,S.y),p++}for(let k=0;k<a;k++){const L=w+k,U=A+k;M===!0?h.push(U,U+1,L):h.push(U+1,U,L),T+=3}c.addGroup(m,T,M===!0?1:2),m+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oo(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class vd extends Oo{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new vd(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class yd extends an{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),h(),this.setAttribute("position",new Le(s,3)),this.setAttribute("normal",new Le(s.slice(),3)),this.setAttribute("uv",new Le(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(y){const x=new G,M=new G,w=new G;for(let S=0;S<e.length;S+=3)u(e[S+0],x),u(e[S+1],M),u(e[S+2],w),l(x,M,w,y)}function l(y,x,M,w){const S=w+1,E=[];for(let T=0;T<=S;T++){E[T]=[];const b=y.clone().lerp(M,T/S),_=x.clone().lerp(M,T/S),A=S-T;for(let k=0;k<=A;k++)k===0&&T===S?E[T][k]=b:E[T][k]=b.clone().lerp(_,k/A)}for(let T=0;T<S;T++)for(let b=0;b<2*(S-T)-1;b++){const _=Math.floor(b/2);b%2===0?(d(E[T][_+1]),d(E[T+1][_]),d(E[T][_])):(d(E[T][_+1]),d(E[T+1][_+1]),d(E[T+1][_]))}}function c(y){const x=new G;for(let M=0;M<s.length;M+=3)x.x=s[M+0],x.y=s[M+1],x.z=s[M+2],x.normalize().multiplyScalar(y),s[M+0]=x.x,s[M+1]=x.y,s[M+2]=x.z}function h(){const y=new G;for(let x=0;x<s.length;x+=3){y.x=s[x+0],y.y=s[x+1],y.z=s[x+2];const M=g(y)/2/Math.PI+.5,w=m(y)/Math.PI+.5;o.push(M,1-w)}p(),f()}function f(){for(let y=0;y<o.length;y+=6){const x=o[y+0],M=o[y+2],w=o[y+4],S=Math.max(x,M,w),E=Math.min(x,M,w);S>.9&&E<.1&&(x<.2&&(o[y+0]+=1),M<.2&&(o[y+2]+=1),w<.2&&(o[y+4]+=1))}}function d(y){s.push(y.x,y.y,y.z)}function u(y,x){const M=y*3;x.x=t[M+0],x.y=t[M+1],x.z=t[M+2]}function p(){const y=new G,x=new G,M=new G,w=new G,S=new Gt,E=new Gt,T=new Gt;for(let b=0,_=0;b<s.length;b+=9,_+=6){y.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),M.set(s[b+6],s[b+7],s[b+8]),S.set(o[_+0],o[_+1]),E.set(o[_+2],o[_+3]),T.set(o[_+4],o[_+5]),w.copy(y).add(x).add(M).divideScalar(3);const A=g(w);v(S,_+0,y,A),v(E,_+2,x,A),v(T,_+4,M,A)}}function v(y,x,M,w){w<0&&y.x===1&&(o[x]=y.x-1),M.x===0&&M.z===0&&(o[x]=w/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function m(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yd(t.vertices,t.indices,t.radius,t.details)}}const Lr=new G,kr=new G,Rl=new G,Dr=new Kn;class c2 extends an{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(ks*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let p=0;p<l;p+=3){o?(c[0]=o.getX(p),c[1]=o.getX(p+1),c[2]=o.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);const{a:v,b:g,c:m}=Dr;if(v.fromBufferAttribute(r,c[0]),g.fromBufferAttribute(r,c[1]),m.fromBufferAttribute(r,c[2]),Dr.getNormal(Rl),f[0]=`${Math.round(v.x*a)},${Math.round(v.y*a)},${Math.round(v.z*a)}`,f[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,f[2]=`${Math.round(m.x*a)},${Math.round(m.y*a)},${Math.round(m.z*a)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let y=0;y<3;y++){const x=(y+1)%3,M=f[y],w=f[x],S=Dr[h[y]],E=Dr[h[x]],T=`${M}_${w}`,b=`${w}_${M}`;b in d&&d[b]?(Rl.dot(d[b].normal)<=s&&(u.push(S.x,S.y,S.z),u.push(E.x,E.y,E.z)),d[b]=null):T in d||(d[T]={index0:c[y],index1:c[x],normal:Rl.clone()})}}for(const p in d)if(d[p]){const{index0:v,index1:g}=d[p];Lr.fromBufferAttribute(r,v),kr.fromBufferAttribute(r,g),u.push(Lr.x,Lr.y,Lr.z),u.push(kr.x,kr.y,kr.z)}this.setAttribute("position",new Le(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class e0 extends sp{constructor(t){super(t),this.uuid=ki(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new sp().fromJSON(a))}return this}}const l2={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=n0(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,h,f,d,u;if(i&&(s=p2(n,t,s,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let p=e;p<a;p+=e)f=n[p],d=n[p+1],f<r&&(r=f),d<l&&(l=d),f>c&&(c=f),d>h&&(h=d);u=Math.max(c-r,h-l),u=u!==0?32767/u:0}return Bo(s,o,e,r,l,u,0),o}};function n0(n,t,e,i,a){let s,o;if(a===E2(n,t,e,i)>0)for(s=t;s<e;s+=i)o=op(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=op(s,n[s],n[s+1],o);return o&&yc(o,o.next)&&(Go(o),o=o.next),o}function Za(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(yc(e,e.next)||je(e.prev,e,e.next)===0)){if(Go(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Bo(n,t,e,i,a,s,o){if(!n)return;!o&&s&&y2(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?d2(n,i,a,s):h2(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),Go(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=u2(Za(n),t,e),Bo(n,t,e,i,a,s,2)):o===2&&f2(n,t,e,i,a,s):Bo(Za(n),t,e,i,a,s,1);break}}}function h2(n){const t=n.prev,e=n,i=n.next;if(je(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=a<s?a<o?a:o:s<o?s:o,f=r<l?r<c?r:c:l<c?l:c,d=a>s?a>o?a:o:s>o?s:o,u=r>l?r>c?r:c:l>c?l:c;let p=i.next;for(;p!==t;){if(p.x>=h&&p.x<=d&&p.y>=f&&p.y<=u&&Rs(a,r,s,l,o,c,p.x,p.y)&&je(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function d2(n,t,e,i){const a=n.prev,s=n,o=n.next;if(je(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,h=a.y,f=s.y,d=o.y,u=r<l?r<c?r:c:l<c?l:c,p=h<f?h<d?h:d:f<d?f:d,v=r>l?r>c?r:c:l>c?l:c,g=h>f?h>d?h:d:f>d?f:d,m=Oh(u,p,t,e,i),y=Oh(v,g,t,e,i);let x=n.prevZ,M=n.nextZ;for(;x&&x.z>=m&&M&&M.z<=y;){if(x.x>=u&&x.x<=v&&x.y>=p&&x.y<=g&&x!==a&&x!==o&&Rs(r,h,l,f,c,d,x.x,x.y)&&je(x.prev,x,x.next)>=0||(x=x.prevZ,M.x>=u&&M.x<=v&&M.y>=p&&M.y<=g&&M!==a&&M!==o&&Rs(r,h,l,f,c,d,M.x,M.y)&&je(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;x&&x.z>=m;){if(x.x>=u&&x.x<=v&&x.y>=p&&x.y<=g&&x!==a&&x!==o&&Rs(r,h,l,f,c,d,x.x,x.y)&&je(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;M&&M.z<=y;){if(M.x>=u&&M.x<=v&&M.y>=p&&M.y<=g&&M!==a&&M!==o&&Rs(r,h,l,f,c,d,M.x,M.y)&&je(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function u2(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!yc(a,s)&&i0(a,i,i.next,s)&&Ho(a,s)&&Ho(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),Go(i),Go(i.next),i=n=s),i=i.next}while(i!==n);return Za(i)}function f2(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&b2(o,r)){let l=a0(o,r);o=Za(o,o.next),l=Za(l,l.next),Bo(o,t,e,i,a,s,0),Bo(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function p2(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=n0(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(_2(c));for(a.sort(m2),s=0;s<a.length;s++)e=g2(a[s],e);return e}function m2(n,t){return n.x-t.x}function g2(n,t){const e=x2(n,t);if(!e)return t;const i=a0(e,n);return Za(i,i.next),Za(e,e.next)}function x2(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let h=1/0,f;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&Rs(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(s-e.x),Ho(e,n)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&v2(a,e)))&&(a=e,h=f)),e=e.next;while(e!==r);return a}function v2(n,t){return je(n.prev,n,t.prev)<0&&je(t.next,n,n.next)<0}function y2(n,t,e,i){let a=n;do a.z===0&&(a.z=Oh(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,M2(a)}function M2(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function Oh(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function _2(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Rs(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function b2(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!S2(n,t)&&(Ho(n,t)&&Ho(t,n)&&w2(n,t)&&(je(n.prev,n,t.prev)||je(n,t.prev,t))||yc(n,t)&&je(n.prev,n,n.next)>0&&je(t.prev,t,t.next)>0)}function je(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function yc(n,t){return n.x===t.x&&n.y===t.y}function i0(n,t,e,i){const a=zr(je(n,t,e)),s=zr(je(n,t,i)),o=zr(je(e,i,n)),r=zr(je(e,i,t));return!!(a!==s&&o!==r||a===0&&Ir(n,e,t)||s===0&&Ir(n,i,t)||o===0&&Ir(e,n,i)||r===0&&Ir(e,t,i))}function Ir(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function zr(n){return n>0?1:n<0?-1:0}function S2(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&i0(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Ho(n,t){return je(n.prev,n,n.next)<0?je(n,t,n.next)>=0&&je(n,n.prev,t)>=0:je(n,t,n.prev)<0||je(n,n.next,t)<0}function w2(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function a0(n,t){const e=new Bh(n.i,n.x,n.y),i=new Bh(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function op(n,t,e,i){const a=new Bh(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function Go(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Bh(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function E2(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class Co{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return Co.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];rp(t),cp(i,t);let o=t.length;e.forEach(rp);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,cp(i,e[l]);const r=l2.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function rp(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function cp(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Md extends yd{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Md(t.radius,t.detail)}}class Is extends an{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],h=[];let f=t;const d=(e-t)/a,u=new G,p=new Gt;for(let v=0;v<=a;v++){for(let g=0;g<=i;g++){const m=s+g/i*o;u.x=f*Math.cos(m),u.y=f*Math.sin(m),l.push(u.x,u.y,u.z),c.push(0,0,1),p.x=(u.x/e+1)/2,p.y=(u.y/e+1)/2,h.push(p.x,p.y)}f+=d}for(let v=0;v<a;v++){const g=v*(i+1);for(let m=0;m<i;m++){const y=m+g,x=y,M=y+i+1,w=y+i+2,S=y+1;r.push(x,M,S),r.push(M,w,S)}}this.setIndex(r),this.setAttribute("position",new Le(l,3)),this.setAttribute("normal",new Le(c,3)),this.setAttribute("uv",new Le(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Is(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class _d extends an{constructor(t=new e0([new Gt(0,.5),new Gt(-.5,-.5),new Gt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new Le(a,3)),this.setAttribute("normal",new Le(s,3)),this.setAttribute("uv",new Le(o,2));function c(h){const f=a.length/3,d=h.extractPoints(e);let u=d.shape;const p=d.holes;Co.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,m=p.length;g<m;g++){const y=p[g];Co.isClockWise(y)===!0&&(p[g]=y.reverse())}const v=Co.triangulateShape(u,p);for(let g=0,m=p.length;g<m;g++){const y=p[g];u=u.concat(y)}for(let g=0,m=u.length;g<m;g++){const y=u[g];a.push(y.x,y.y,0),s.push(0,0,1),o.push(y.x,y.y)}for(let g=0,m=v.length;g<m;g++){const y=v[g],x=y[0]+f,M=y[1]+f,w=y[2]+f;i.push(x,M,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return T2(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new _d(i,t.curveSegments)}}function T2(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class Mc extends an{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],h=new G,f=new G,d=new G;for(let u=0;u<=i;u++)for(let p=0;p<=a;p++){const v=p/a*s,g=u/i*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(v),f.y=(t+e*Math.cos(g))*Math.sin(v),f.z=e*Math.sin(g),r.push(f.x,f.y,f.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(p/a),c.push(u/i)}for(let u=1;u<=i;u++)for(let p=1;p<=a;p++){const v=(a+1)*u+p-1,g=(a+1)*(u-1)+p-1,m=(a+1)*(u-1)+p,y=(a+1)*u+p;o.push(v,g,y),o.push(g,m,y)}this.setIndex(o),this.setAttribute("position",new Le(r,3)),this.setAttribute("normal",new Le(l,3)),this.setAttribute("uv",new Le(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mc(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ji extends ja{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Lm,this.normalScale=new Gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Di,this.combine=ed,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class s0 extends Ke{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new te(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class A2 extends s0{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ke.DEFAULT_UP),this.updateMatrix(),this.groundColor=new te(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Pl=new Ce,lp=new G,hp=new G;class R2{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Gt(512,512),this.map=null,this.mapPass=null,this.matrix=new Ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ud,this._frameExtents=new Gt(1,1),this._viewportCount=1,this._viewports=[new tn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;lp.setFromMatrixPosition(t.matrixWorld),e.position.copy(lp),hp.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(hp),e.updateMatrixWorld(),Pl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Pl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Pl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class P2 extends R2{constructor(){super(new Vm(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class C2 extends s0{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ke.DEFAULT_UP),this.updateMatrix(),this.target=new Ke,this.shadow=new P2}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const dp=new Ce;class L2{constructor(t,e,i=0,a=1/0){this.ray=new hd(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new dd,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return dp.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(dp),this}intersectObject(t,e=!0,i=[]){return Hh(t,this,i,e),i.sort(up),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)Hh(t[a],this,i,e);return i.sort(up),i}}function up(n,t){return n.distance-t.distance}function Hh(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)Hh(s[o],t,e,!0)}}class k2 extends jm{constructor(t=10,e=10,i=4473924,a=8947848){i=new te(i),a=new te(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,u=0,p=-r;d<=e;d++,p+=o){l.push(-r,0,p,r,0,p),l.push(p,0,-r,p,0,r);const v=d===s?i:a;v.toArray(c,u),u+=3,v.toArray(c,u),u+=3,v.toArray(c,u),u+=3,v.toArray(c,u),u+=3}const h=new an;h.setAttribute("position",new Le(l,3)),h.setAttribute("color",new Le(c,3));const f=new pd({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:td}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=td);const D2={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function I2(n,t,e,i){const a=new si(n.fov,i,.1,200),s=new G,o=new G,r=new G;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1,d=0,u=0,p=0,v=0,g=0,m=0;function y(){const x=(n.pitchDeg+h.pitchDelta)*Math.PI/180,M=n.yawDeg*Math.PI/180;r.set(Math.sin(M)*Math.cos(x),Math.sin(x),Math.cos(M)*Math.cos(x)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return y(),{camera:a,update(x,M,w,S,E=D2){const T=M+.6;if(!l)s.set(x,T,w),l=!0;else{const A=1-Math.exp(-Math.max(n.smoothing,.001)*S);s.x+=(x-s.x)*A,s.y+=(T-s.y)*A,s.z+=(w-s.z)*A}const b=1-Math.exp(-Math.max(t.smoothing,.001)*S);h.distanceScale+=(E.distanceScale-h.distanceScale)*b,h.offsetX+=(E.offsetX-h.offsetX)*b,h.offsetZ+=(E.offsetZ-h.offsetZ)*b,h.pitchDelta+=(E.pitchDelta-h.pitchDelta)*b;const _=1-Math.exp(-Math.max(e.smoothing,.001)*S);if(h.zoom+=(f-h.zoom)*_,y(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),d>.001){u+=S*52;const A=d*.055;a.position.x+=Math.sin(u*1.7)*A,a.position.y+=Math.sin(u*2.3+1.1)*A*.75,a.position.z+=Math.sin(u*1.3+2.4)*A*.5,d*=Math.exp(-9*S)}else d=0;g>.001?(a.position.x+=p*g,a.position.z+=v*g,g*=Math.exp(-13*S)):g=0,a.updateMatrixWorld()},snap(x,M,w){s.set(x,M+.6,w),l=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),y(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new G().setFromMatrixColumn(a.matrixWorld,0),M=new G().setFromMatrixColumn(a.matrixWorld,2).negate(),w=Math.hypot(x.x,x.z)||1,S=Math.hypot(M.x,M.z)||1;return{rightX:x.x/w,rightZ:x.z/w,forwardX:M.x/S,forwardZ:M.z/S}},addShake(x){!Number.isFinite(x)||x<=0||(d=Math.min(1,d+x))},shakeLevel(){return d},addKick(x,M,w){if(!Number.isFinite(x)||!Number.isFinite(M)||!(w>0))return;const S=Math.hypot(x,M);S<1e-4||(p=x/S*w,v=M/S*w,g=1,m++)},kickLevel(){return g},kickCount(){return m},setZoom(x){f=Number.isFinite(x)&&x>0?x:1},smart(){return{...h}}}}const Xa=Math.PI*2,Un=1e-6;function Je(n,t,e){return n<t?t:n>e?e:n}function o0(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function z2(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function r0(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=z2(n);return i===1?a:e+(a-e)*i}function fp(n){return(1-Math.sin(n))/2}function bd(n,t,e){const i=Math.PI/180,a=Je(Number.isFinite(t)?t:100,0,180),s=Je(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=Je((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function cc(n,t,e,i){const a=t>=0?1:-1,o=2/Math.max(Un,i)*Math.max(0,e),r=Je(n,-1,1),l=a-r;return Math.abs(l)<=o?a:r+Math.sign(l)*o}function pp(n){const t=Je(Number.isFinite(n)?n:1,-1,1),e=Math.abs(t);return Math.sign(t)*e*e*(3-2*e)}function F2(n,t,e,i){if(!(e>0))return t;const a=e*Math.max(0,i),s=t-n;return Math.abs(s)<=a?t:n+Math.sign(s)*a}const mp=30*Math.PI/180,U2=100*Math.PI/180,N2=.06,O2=.22;function c0(n){return Je((Math.abs(n)-mp)/(U2-mp),0,1)}function l0(n,t,e,i=N2,a=O2){const s=Je(n,0,1),o=Je(t,0,1),r=o>s?Math.max(Un,i):Math.max(Un,a),l=e/r*1,c=o-s;return Math.abs(c)<=l?o:s+Math.sign(c)*l}function h0(n,t,e,i,a){if(!(e>0))return t;const s=1-Je(a,0,1);return s<=1e-9?n:F2(n,t,s*e,i)}function lc(n,t){if(!n.grounded||n.speed<Un)return o0();const e=n.speed/Math.max(n.moveSpeed,Un),i=Math.max(n.legLength,Un),a=n.stride>Un?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+Un,h=bd(n.localForward/Math.max(n.speed,Un),t.backStrafeStartDeg,t.backStrafeFullDeg),f=l/c*h,d=r/c+l/c*(1-h),u=pp(n.dirF??(n.localForward>=0?1:-1)),p=pp(n.dirR??(n.localRight>=0?1:-1)),v=a,g=U=>Math.asin(Je(U,-o,o)/i);function m(U,C){const D=r0(U,t.plantLock),B=fp(U),O=u*d*v*D,X=-g(O),it=C*p>0?1:-1,ht=1+it*t.crossStep*.45,ft=p*it*t.crossStep*v*.4*B,Rt=p*f*v*t.sideWeight*ht*D+ft*f,Z=g(Rt),at=t.kneeLift*B*s*(.55+.25*d+.1*f*(1+C*p));return{pitchX:X,rollZ:Z,kneeX:at}}const y=(n.phase%Xa+Xa)%Xa,x=m(y,-1),M=m((y+Math.PI)%Xa,1),w=Math.cos(y),S=fp(y),E=-t.comSway*s*w*(.6*d+.8*f)-p*t.comSway*s*f*.45,T=t.comBob*S*s,b=p*t.hipLean*s*f*w*.6,_=p*t.hipLean*s*f*(.45+.25*w),A=t.armSwing*s*w*(d*u+.3*f),k=A,L=-A;return{legL:x,legR:M,pelvisX:E,pelvisY:T,pelvisRoll:b,sideLean:_,armL:k,armR:L,strafe:f,backward:u<0?d:0}}function d0(n){const t=(n%Xa+Xa)%Xa,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function u0(n,t,e){const i=Je(e.progress,0,1);if(i>=1||n.speed<Un)return o0();const a=i*i*(3-2*i),s=1-a;return lc({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function f0(n,t,e,i){const a=Je(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Je(o*a,-1,1)*(e*Math.PI/180)}function p0(n,t=0){const e=Je(n,0,1);return e*e+(1-e*e)*Je(t,0,1)}function m0(n,t,e){if(!(n>0)||!(t>0))return 0;const i=Je(e,0,1);return t+(n-t)*i}function g0(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=Je(i,0,1);return e*l+r*(1-l)}function x0(n,t,e,i,a){const s=Math.max(e,Un),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>Un?(t-n)/t:0,c=l>.02,h=l<-.015,f=n<=o*.15,d=!h&&n<r&&(c||f);return{enter:n>Un&&n<=o&&c,resume:!d}}function v0(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Je(n*Je(t,0,2),-i,i)}function y0(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function M0(n,t,e){const i=Je(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function B2(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Je(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*l,rollZ:u*d*l,kneeX:f*l},legR:{pitchX:-h*c,rollZ:-u*d*c,kneeX:f*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function _0(n,t,e,i,a){const s=Je(n,0,1),o=Je(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,h=Math.hypot(e,i),f=h>Un?e/h:1,d=h>Un?i/h:0,u=r0(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:u,fwdN:f,rightN:d,env:c}}function Tn(n){return n<0?0:n>1?1:n}const Xr=Math.PI*2;function H2(n){return((n+Math.PI)%Xr+Xr)%Xr-Math.PI}function G2(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function V2(n,t,e,i,a,s=n.phase){const o=Tn(i);if(o<=0)return n;const r=Tn(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,f=Tn(a.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,a.strideScale??0)*d,p=r*r*(3-2*r),v={speed:c,phase:s+Xr*l/2*p,localForward:c*f,localRight:c*(1-f)*h},g=H2(v.phase-n.phase),m=o*o*(3-2*o),y=n.speed>.05?d:0;return{speed:n.speed+(v.speed-n.speed)*o,phase:n.phase+g*m,localForward:n.localForward+(v.localForward-n.localForward)*o,localRight:n.localRight+(v.localRight-n.localRight)*o,stride:y+(u-y)*o*o}}function X2(n,t,e){const i=G2(),a=Tn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,h=e.stepKnee*s,f=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=f*.25*o,i}function b0(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function gp(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*b0(s,a)}function W2(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function Y2(n,t,e){const i=Tn(n);return{gaitScale:1-i*(1-Tn(t)),attackLegWeight:Tn(e)*i}}function $2(n,t,e){const i=Tn(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function Z2(n,t){const e=Tn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function q2(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Tn(t.minScale+(1-t.minScale)*e)}function j2(){return S0()}function S0(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function K2(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function J2(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Tn(t.forceHitHeight):n.type==="light"?Tn(t.hitHeight.light):n.type==="heavy"?Tn(t.hitHeight.heavy):n.type==="knock"?Tn(t.hitHeight.knock):0}function Q2(n,t,e){const i=Tn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function w0(n,t,e){const i=S0(),a=K2(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=Tn(1-n.timer/n.duration),o=b0(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=J2(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const v=Math.sin(Math.PI*s);return i.upperPitch=a*v*f,i.upperRoll=-a*v*d*.7,i.drop=(a>.5?.09:.04)*v,i.flash=e.flashStrength*v,i.active=v>0,i}const u=a*o,p=Q2(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(p.upperPitch*f+p.fold),i.upperRoll=-u*p.upperRoll*d,i.upperYaw=u*p.upperYaw*d,i.upperShift=u*p.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*p.back,i.drop=u*p.drop,i.knee=u*p.knee,i.hip=u*p.hip,i.arm=u*p.arm,i.flash=e.flashStrength*o,i}function E0(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const Da=1e-6;function Lo(n,t,e){return n<t?t:n>e?e:n}function T0(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=Da||s<=Da||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+Da,c=Math.hypot(n.x,n.y,n.z);if(c<=Da)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),p=Lo(u,l,r),v=u>r+Da||u<l-Da,g=Math.atan2(-d,Math.max(f,Da)),m=Lo((a*a+p*p-s*s)/(2*a*p),-1,1),y=Lo((s*s+p*p-a*a)/(2*s*p),-1,1),x=Math.acos(m),M=Math.acos(y),w=i>=0?1:-1;return{rootPitch:g-w*x,rootRoll:h,jointPitch:w*(x+M),clamped:v,reach:c/r}}function A0(n,t,e,i){const a=Lo(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=Lo((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function R0(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Sd={active:!1,weight:0,clamped:0,maxError:0};function P0(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...Sd};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(u=>u.tip.getWorldPosition(new G));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<a.length;u++){const p=a[u],v=i.worldToLocal(l[u].clone()),g={x:v.x-p.root.position.x,y:v.y-p.root.position.y,z:v.z-p.root.position.z},m=T0(g,p.upperLen,p.lowerLen,p.bend);m.clamped&&(f+=1);const y=A0({rootPitch:p.root.rotation.x,rootRoll:p.root.rotation.z,jointPitch:p.joint.rotation.x},m,c,h);p.root.rotation.x=y.rootPitch,p.root.rotation.z=y.rootRoll,p.joint.rotation.x=y.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<a.length;u++){const p=a[u].tip.getWorldPosition(new G);d=Math.max(d,p.distanceTo(l[u]))}return{active:!0,weight:c,clamped:f,maxError:d}}function Dn(n,t,e){return n<t?t:n>e?e:n}function tR(n,t,e,i,a,s,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Ee,d=new Ee;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new Ee;u.name="lower";const p=new Ee;p.name="upper",d.add(u),d.add(p);const v=[],g=(W,ct,Ot,zt)=>{const Lt=new ji({color:zt}),I=new re(new Vn(W,ct,Ot),Lt);return I.castShadow=!0,I.receiveShadow=!0,v.push(Lt),I},m=n.headSize,y=n.legLength,x=n.armLength,M=n.limbThickness,w=n.bodyHeight,S=n.bodyWidth,E=g(S,w,.28,e);E.position.y=w/2,p.add(E);const T=new Ee;T.name="headPivot",T.rotation.order="YXZ",T.position.y=w,p.add(T);const b=g(m,m,m,e);b.position.y=m/2,T.add(b);for(const W of[-1,1]){const ct=g(.06,.07,.02,t.shoe);ct.position.set(W*.09,m/2+.03,m/2+.011),T.add(ct)}const _=(W,ct)=>{const Ot=ct?x:y,zt=new Ee;zt.name=ct?W<0?"shoulderL":"shoulderR":W<0?"hipL":"hipR",ct||(zt.rotation.order="ZYX"),zt.position.set(W*(ct?S/2+M/2:S/2-M/2),ct?w-.04:0,0),(ct?p:u).add(zt);const Lt=g(M,Ot/2,M,t.limb);Lt.position.y=-Ot/4,zt.add(Lt);const I=new Ee;I.name=ct?"elbow":"knee",I.position.y=-Ot/2,zt.add(I);const _t=g(M,Ot/2,M,t.limb);if(_t.position.y=-Ot/4,I.add(_t),!ct){const tt=g(M*1.15,.07,M*1.7,t.shoe);tt.position.set(0,-Ot/2+.035,.045),I.add(tt);const rt=new Ke;return rt.name="footTip",rt.position.y=-Ot/2,I.add(rt),{root:zt,joint:I,tip:rt}}return{root:zt,joint:I}},A=_(-1,!1),k=_(1,!1),L=_(-1,!0),U=_(1,!0),C=[A,k].map(W=>({root:W.root,joint:W.joint,tip:W.tip,upperLen:y/2,lowerLen:y/2,bend:1})),D=new yn({color:a.attackArcColor,transparent:!0,opacity:0,side:$e,depthWrite:!1}),B=new re(new Mc(.62,.042,6,20,Math.PI*1.1),D);B.position.set(0,.78-y,.56),p.add(B);const O=new te(e),X=new te(r.flashColor),it=new te;let ht=null,ft=0,Rt=0,Z=0,at=0,dt=0,st=0,nt=0,ut={...Sd},Bt=-1,Zt=0,lt=0,V=0,N=0,Ct=0,Tt=0,Mt=0,vt=1,mt=0,kt=0,F=0,R=0,K=-1,pt=0,et="none",ot=0,yt=!1,At=-1,St=!1,Yt=0,gt=0,Dt=1,$=1;return{group:f,boneAtWorld(W,ct,Ot){const zt=[{node:p,ax:0,ay:.05,az:0,bx:0,by:w,bz:0},{node:T,ax:0,ay:0,az:0,bx:0,by:m,bz:0},{node:L.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:L.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:A.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:A.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:k.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:k.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0}],Lt=new G,I=new G,_t=new G(W,ct,Ot),tt=new G;let rt=null,Pt=Number.POSITIVE_INFINITY;for(const wt of zt){wt.node.updateWorldMatrix(!0,!1),Lt.set(wt.ax,wt.ay,wt.az),I.set(wt.bx,wt.by,wt.bz),wt.node.localToWorld(Lt),wt.node.localToWorld(I);const Kt=I.x-Lt.x,he=I.y-Lt.y,ce=I.z-Lt.z,ne=Kt*Kt+he*he+ce*ce;let Te=ne>1e-8?((_t.x-Lt.x)*Kt+(_t.y-Lt.y)*he+(_t.z-Lt.z)*ce)/ne:0;Te=Math.max(0,Math.min(1,Te));const Pe=Lt.x+Kt*Te,sn=Lt.y+he*Te,on=Lt.z+ce*Te,Ae=(_t.x-Pe)**2+(_t.y-sn)**2+(_t.z-on)**2;Ae<Pt&&(Pt=Ae,rt=wt.node,tt.set(Pe,sn,on))}return rt?{node:rt,point:tt.clone()}:null},update(W,ct,Ot){const zt=Ot===void 0||K<0?ct:Dn(Ot-K,0,.1);Ot!==void 0&&(K=Ot),f.position.set(W.position.x,W.position.y,W.position.z),f.rotation.y=W.bodyYaw,T.rotation.y=(W.headYaw-W.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,W.mode!==ht&&(ht=W.mode,ft=1),ft=Math.max(0,ft-ct*2.2);const Lt=W.hurt,I=w0(Lt,W.bodyYaw,r),_t=I.flash;it.copy(X).multiplyScalar(_t);for(const ue of v)ue.emissive.copy(O).multiplyScalar(ft*.5),_t>0&&ue.emissive.add(it);d.position.set(0,y,0),d.rotation.set(0,0,0),p.position.set(0,0,0),p.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const tt=Math.hypot(W.velocity.x,W.velocity.z),rt=Dn(o.knockGaitScale??0,0,1),Pt=W.hurt.knockX*rt,wt=W.hurt.knockZ*rt,Kt=rt>0&&Math.hypot(W.hurt.knockX,W.hurt.knockZ)>.001,he=W.velocity.x+Pt,ce=W.velocity.z+wt,ne=Math.hypot(he,ce),Te=Math.cos(W.bodyYaw),Pe=-Math.sin(W.bodyYaw),sn=tt>1e-6?Dn((W.velocity.x*Te+W.velocity.z*Pe)/tt,-1,1):0,on=tt>1e-6?Dn((W.velocity.x*Math.sin(W.bodyYaw)+W.velocity.z*Math.cos(W.bodyYaw))/tt,-1,1):1,Ae=bd(on,o.backStrafeStartDeg,o.backStrafeFullDeg);et==="settled"&&St&&Yt>gt*1.02+1e-4&&(et="none");let de=1;et==="blend"?(de=M0(yt?At:ot,o.stopYawBlendMode,yt),yt||(ot=Math.min(1,ot+ct/Math.max(.01,o.stopYawAfterSec)),(ot>=1||o.stopYawBlendMode==="inStop"||St)&&(et="settled",de=0))):et==="settled"&&(de=Dn(tt/Math.max(1e-6,o.stopEnterRatio*s),0,1));const hn=f0(sn,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),Nn=zt>1e-6?He(W.bodyYaw-F)/zt:0;F=W.bodyYaw;const dn=(o.hipYawTrackRateDeg??0)*Math.PI/180,Rn=(o.hipYawBackRateDeg??0)*Math.PI/180,_n=zt>1e-6?zt:ct;R=dn>0?l0(R,c0(Nn),_n):0;const Pn=p0(Ae,R),On=Dn(tt/.5,0,1),q=g0(on,sn,hn,Pn)*de*On,Nt=h0(kt,q,m0(dn,Rn,Pn),_n,R);kt=Nt,mt+=(Nt-mt)*(1-Math.exp(-12*Math.max(0,_n))),u.rotation.y=mt;const Ut=W.bodyYaw+mt,P=Math.sin(Ut),H=Math.cos(Ut),j=Math.cos(Ut),Q=-Math.sin(Ut),Y=he*P+ce*H,Et=he*j+ce*Q,Ft=Math.max(0,o.stopBlendSec||0),Vt=Ft>0&&!Kt,Xt=x0(tt,pt,s,o.stopEnterRatio,o.stopExitRatio);if(!Vt||Xt.resume)Bt=-1;else if(Bt<0&&Xt.enter){Bt=0,Zt=W.gaitPhase,lt=d0(W.gaitPhase),V=tt,N=Math.max(W.stride,1e-6),Ct=Y,Tt=Et;const ue=1/Math.max(1e-6,tt);Mt=W.velocity.x*ue,vt=W.velocity.z*ue}const se=pt;pt=tt;const ee=Vt&&Bt>=0;ee&&(Bt=Math.min(1,Bt+ct/Ft)),ee&&et!=="blend"&&(et="blend",ot=0),yt=ee&&Bt<1,At=Bt,St=Xt.resume,Yt=tt,gt=se;const qt=Math.max(0,o.dirFlipSec??0);qt>0?(Dt=cc(Dt,Y>=0?1:-1,ct,qt),$=cc($,Et>=0?1:-1,ct,qt)):(Dt=Y>=0?1:-1,$=Et>=0?1:-1);const fe=ee?{phase:Zt,speed:V,moveSpeed:s,localForward:Ct,localRight:Tt,dirF:Dt,dirR:$,legLength:n.legLength,stride:N,grounded:!0}:{phase:W.gaitPhase,speed:ne,moveSpeed:s,localForward:Y,localRight:Et,dirF:Dt,dirR:$,legLength:n.legLength,stride:W.stride,grounded:!0},ie=ee?u0(fe,o,{progress:Bt,phase0:Zt,phaseEnd:lt}):lc(fe,o);let ve=0,Ue=0,pe=0,Wt=0;if(ee){const ue=y0(W.bodyYaw,Mt,vt),be=_0(Bt,Zt,ue.forward,ue.right,o);be.leadLeft?(ie.legL.pitchX-=be.leadPitch,ie.legL.kneeX+=be.leadKnee,ie.legR.pitchX+=be.trailPitch):(ie.legR.pitchX-=be.leadPitch,ie.legR.kneeX+=be.leadKnee,ie.legL.pitchX+=be.trailPitch),Ue=be.bodyShift*be.fwdN,ve=be.bodyShift*be.rightN,pe=be.bodyDip,Wt=be.chestPitch}A.root.rotation.x=ie.legL.pitchX,k.root.rotation.x=ie.legR.pitchX,A.root.rotation.z=ie.legL.rollZ,k.root.rotation.z=ie.legR.rollZ,A.joint.rotation.x=ie.legL.kneeX,k.joint.rotation.x=ie.legR.kneeX,L.root.rotation.x=ie.armL,U.root.rotation.x=ie.armR,L.joint.rotation.x=-.18,U.joint.rotation.x=-.18,d.position.x=ie.pelvisX,d.position.y=y+ie.pelvisY,d.position.z=0,d.rotation.z=ie.pelvisRoll,p.rotation.z=ie.sideLean*(I.intensity>0?.4:1);const mn=R0(d,u),xe=ee&&h.enabled?{...h,weight:1}:h,jt=xe.enabled&&xe.weight>0?Dn(xe.weight,0,1):0;if(d.position.x+=ve,d.position.z+=Ue,d.position.y-=pe,u.position.y+=pe,jt<=0&&(u.position.x-=ve,u.position.z-=Ue),l){const ue=Math.max(.004166666666666667,Math.min(ct,.1)),be=Math.sin(W.bodyYaw),Be=Math.cos(W.bodyYaw),gn=Dn((W.velocity.x-Rt)/ue,-60,60),rn=Dn((W.velocity.z-Z)/ue,-60,60),oi=gn*be+rn*Be,Ki=He(W.bodyYaw-at)/ue,Ji=l.maxForwardDeg*Math.PI/180,xi=l.maxSideDeg*Math.PI/180,ri=1-Math.exp(-Math.max(0,l.smoothing)*ue);dt+=(Dn(oi*l.accelGain,-Ji,Ji)-dt)*ri,st+=(Dn(-Ki*tt*l.turnGain,-xi,xi)-st)*ri;const Cn=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;nt+=(Dn(tt/Math.max(s,1e-6),0,1)-nt)*(1-Math.exp(-Math.max(0,Cn)*ue));const ci=E0({leanForward:dt,leanSide:st,speedRatio:nt},l);p.rotation.x+=dt+Wt,p.rotation.z+=st,d.rotation.x+=ci.pelvisPitch,d.rotation.z+=ci.pelvisRoll,d.position.x+=ci.pelvisX,d.position.z+=ci.pelvisZ,d.position.y-=ci.crouch,u.position.y+=ci.crouch*(1-jt)}Rt=W.velocity.x,Z=W.velocity.z,at=W.bodyYaw,p.rotation.x+=I.upperPitch,p.rotation.z+=I.upperRoll,p.rotation.y+=I.upperYaw;const It=Dn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),$t=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;p.position.x+=Dn(I.upperShiftX*It,-$t,$t),p.position.z+=Dn(I.upperShiftZ*It,-$t,$t),d.position.x+=I.comX,d.position.z+=I.comZ-I.pelvisBack,d.position.y-=I.drop;const ke=I.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=I.pelvisBack*(1-ke),u.position.y+=I.drop*(1-ke),A.joint.rotation.x+=I.knee,k.joint.rotation.x+=I.knee,A.root.rotation.x-=I.hip,k.root.rotation.x-=I.hip,L.root.rotation.x+=I.arm,U.root.rotation.x+=I.arm*.8,W.attackPhase!=="idle"&&I.intensity===0){const ue=W.attackProgress,be=ue<.34?-1:ue<.68?-1+(ue-.34)/.34*2:Math.max(0,1-(ue-.68)/.32),Be=Math.max(0,-be),gn=Math.max(0,be);U.root.rotation.x=-1.7*Be+1.25*gn,U.joint.rotation.x=-(.25+Be*.45),p.rotation.y=-.28*be,D.opacity=W.attackPhase==="active"?.85:0,W.attackPhase==="active"&&(B.rotation.z=-1.1+ue*3)}else D.opacity=0;const le=v0(mt,o.chestYawScale,o.chestYawMaxDeg);p.rotation.y+=le,T.rotation.y=(W.headYaw-W.bodyYaw-le+Math.PI*3)%(Math.PI*2)-Math.PI,ut=P0({root:f,pelvis:d,lower:u,limbs:C,base:mn,cfg:xe,grounded:!0,attacking:W.attackPhase!=="idle"})},ik(){return ut},dispose(){f.traverse(W=>{if(W instanceof re){W.geometry.dispose();const ct=W.material;Array.isArray(ct)?ct.forEach(Ot=>Ot.dispose()):ct.dispose()}})}}}const eR=9.81;function _o(n,t,e){return n<t?t:n>e?e:n}function nR(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:eR,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,l=0,c=0,h=0;for(const b of n){const _=Number.isFinite(b.mass)&&b.mass>0?b.mass:0;!Number.isFinite(b.x)||!Number.isFinite(b.y)||!Number.isFinite(b.z)||(r+=_,l+=b.x*_,c+=b.y*_,h+=b.z*_)}if(r<=1e-6)return o;l/=r,c/=r,h/=r;const f=Math.max(.02,(t.maxX-t.minX)/2),d=Math.max(.02,(t.maxZ-t.minZ)/2),u=(t.minX+t.maxX)/2,p=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:l,comY:c,comZ:h,centerX:u,centerZ:p,halfX:f,halfZ:d};const g=_o((a==null?void 0:a.reactionTime)??.18,.02,1),m=Math.sqrt(Math.max(.05,c)/s)*g*4,y=l+(Number.isFinite(e)?e:0)*m,x=h+(Number.isFinite(i)?i:0)*m,M=Math.abs(y-u)/f,w=Math.abs(x-p)/d,S=_o(1-Math.max(M,w),0,1),E=Math.max(0,Math.abs(y-u)-f),T=Math.max(0,Math.abs(x-p)-d);return{comX:l,comY:c,comZ:h,xcomX:y,xcomZ:x,centerX:u,centerZ:p,halfX:f,halfZ:d,marginX:_o(1-M,-1,1),marginZ:_o(1-w,-1,1),score:S,leanDeg:Math.atan2(y-u,x-p)*180/Math.PI,side:M>.98?y>u?1:-1:0,overX:E,overZ:T,grounded:!0}}function iR(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function aR(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=_o(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const Gh={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},sR=1e-6;function jn(n,t,e){return n<t?t:n>e?e:n}function Cl(n,t){const e=Math.max(.2,n);return jn(Math.pow(e,-t),.5,2)}function oR(n,t){if(!t.enabled)return{...Gh};const e=jn(n.swing,-1,1),i=jn(n.charge,0,1),a=jn(n.impact,0,1),s=jn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=jn(t.chargeArm,.6,1),f=1-(1-h)*c,d=1-(1-h)*i;let u=1;o>0?u=l:c>0?u=f:i>0&&(u=d);const p=1-jn(t.impactSquash,0,.6)*a;u*=p;const v=Math.max(1,t.runLeg),m=(n.grounded?1+(v-1)*s:1)*(1-jn(t.impactSquash,0,.6)*a*.6),y=jn(t.torsoGain,0,1),x=1+(u-1)*y;return u=jn(u,.6,1.6),{arm:u,leg:jn(m,.6,1.4),torso:jn(x,.7,1.4),girthArm:Cl(u,t.volumeExp),girthLeg:Cl(m,t.volumeExp),girthTorso:Cl(x,t.volumeExp)}}function rR(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function cR(n,t,e){const i=n*Math.exp(-Math.max(sR,e)*Math.max(0,t));return i<.001?0:jn(i,0,1)}const xp=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function zs(n,t,e){return n<t?t:n>e?e:n}function Ne(n,t,e){return n+(t-n)*e}function lR(n){return n?typeof n=="string"?{clip:n}:n:null}function hR(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function dR(n,t){const e=n%3*2,i=xp[e],a=xp[e+1];return{...hR(),bodyYaw:Ne(i.yaw,a.yaw,t),bodyPitch:Ne(i.pitch,a.pitch,t),bodyRoll:Ne(i.roll,a.roll,t),pelvisX:Ne(i.px,a.px,t),pelvisZ:Ne(i.pz,a.pz,t),armPitch:Ne(i.ap,a.ap,t),armYaw:Ne(i.ay,a.ay,t),armRoll:Ne(i.ar,a.ar,t),elbow:Ne(i.el,a.el,t),bladePitch:Ne(i.blade,a.blade,t)}}function uR(n,t,e,i,a=0){var b,_,A;const s=((b=i.combo)==null?void 0:b[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=lR(s[r]),c=l?((_=i.clips)==null?void 0:_[l.clip])??null:null,h=zs(((A=i.weaponScale)==null?void 0:A[n])??1,0,2),f=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=l&&Number.isFinite(l.scale)?l.scale:h,u=d*f,p=zs((e+1)/2,0,1),v=c&&c.keys.length>0?iy(c,p):dR(r,p),g=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",m=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",y=n==="dual-swords",x=c&&Ea(c,"bladeTwistOff")?v.bladeTwistOff:y?v.bladeTwist:0,M=c&&Ea(c,"bladeYawOff")?v.bladeYawOff:-v.bladeYaw,w={yaw:v.bodyYaw*u,rootYaw:v.rootYaw*u,spinYaw:ay(c,zs(a,0,1)),pitch:v.bodyPitch*u,roll:v.bodyRoll*u,pelvisZ:v.pelvisZ*u,pelvisX:v.pelvisX*u,armR:null,armL:null,bladePitch:v.bladePitch,bladePitchOff:c&&Ea(c,"bladePitchOff")?v.bladePitchOff:null,bladeTwist:v.bladeTwist,bladeTwistOff:x,bladeYaw:v.bladeYaw,bladeYawOff:M,lead:g,kind:m,strike:p,blend:l&&Number.isFinite(l.blend)?l.blend:null},S={pitch:v.armPitch*d,yaw:v.armYaw*d,roll:v.armRoll*d,elbow:v.elbow*d},E=c?Ea(c,"armLPitch")||Ea(c,"armLYaw")||Ea(c,"armLRoll")||Ea(c,"elbowL"):!1,T=E?{pitch:v.armLPitch*d,yaw:v.armLYaw*d,roll:v.armLRoll*d,elbow:v.elbowL*d}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return g==="L"?(w.armL=S,w.armR=n==="greatsword"?null:T):(w.armR=S,(n==="greatsword"||n==="dual-swords"||E)&&(w.armL=T)),w}function fR(n,t,e){const i=zs(e,0,1),a=(s,o)=>s?o?{pitch:Ne(s.pitch,o.pitch,i),yaw:Ne(s.yaw,o.yaw,i),roll:Ne(s.roll,o.roll,i),elbow:Ne(s.elbow,o.elbow,i)}:null:o;return{yaw:Ne(n.yaw,t.yaw,i),rootYaw:Ne(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Ne(n.pitch,t.pitch,i),roll:Ne(n.roll,t.roll,i),pelvisZ:Ne(n.pelvisZ,t.pelvisZ,i),pelvisX:Ne(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Ne(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Ne(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Ne(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Ne(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Ne(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Ne(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Ne(n.strike,t.strike,i),blend:t.blend??null}}function pR(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function vp(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function mR(n,t){const e=(a,s)=>Math.abs(pR(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=vp(n.armR,t.armR),i+=vp(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function gR(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),l=Math.max(.1,e.segBlendRef??6),c=zs(mR(n,t)/l,0,1);return o+(r-o)*c}function yp(n){const t=zs(n,0,1);return t*t*(3-2*t)}function Ge(n,t,e,i){const a=new re(new Vn(n,t,e),new ji({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function qe(){return new Ee}function Wr(n,t,e){const i=qe(),a=Ge(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Ge(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Ge(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Ge(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=Ge(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function xR(n){const t=Wr(.72,.15,n),e=Ge(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function vR(n){const t=qe(),e=Ge(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Ge(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function yR(n){const t=qe(),e=Ge(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Ge(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new te(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function MR(n){const t=qe();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Ge(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Ge(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function _R(n){const t=qe(),e=Ge(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Ge(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function ge(n,t,e){return n<t?t:n>e?e:n}const Gi=1e-6;function C0(n,t,e,i,a,s,o,r,l,c,h,f,d){const u=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},p=f??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},v=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},m=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},y=qe(),x=qe();x.name="pelvis",x.position.y=n.legLength,y.add(x);const M=qe();M.name="lower";const w=qe();w.name="upper",x.add(M),x.add(w);const S=n.headSize,E=n.legLength,T=n.armLength,b=n.limbThickness,_=n.bodyHeight,A=n.bodyWidth,k=l.spine,L=!!(k!=null&&k.enabled),U=L?ge(k.chestPivot??.42,.15,.85)*_:0,C=qe();C.name="chest",C.position.y=U,w.add(C);const D=L?C:w;let B,O=null,X=_,it=0;L?(X=Math.max(.05,U),it=Math.max(.05,_-U),B=Ge(A,X,.28,t.body),B.name="torsoLower",B.position.y=X/2,w.add(B),O=Ge(A+.008,it,.288,t.body),O.name="torsoUpper",O.position.y=it/2,C.add(O)):(B=Ge(A,_,.28,t.body),B.name="torso",B.position.y=_/2,w.add(B));const ht=qe();ht.name="headPivot",ht.rotation.order="YXZ",ht.position.y=Math.min(i.headPivotHeight,_)-U,D.add(ht);const ft=Ge(S,S,S,t.head);ft.position.y=S/2,ht.add(ft);const Rt=new ji({color:"#1b2733"});for(const z of[-1,1]){const J=new re(new Vn(.06,.07,.02),Rt);J.position.set(z*.09,S/2+.03,S/2+.011),ht.add(J)}const Z=z=>{const J=qe();J.name=z<0?"hipL":"hipR",J.rotation.order="ZYX",J.position.set(z*(A/2-b/2),0,0),M.add(J);const xt=Ge(b,E/2,b,t.limb);xt.position.y=-E/4,J.add(xt);const bt=qe();bt.name="knee",bt.position.y=-E/2,J.add(bt);const Jt=Ge(b,E/2,b,t.limb);Jt.position.y=-E/4,bt.add(Jt);const Qt=Ge(b*1.15,.07,b*1.7,t.shoe);Qt.position.set(0,-E/2+.035,.045),bt.add(Qt);const oe=new Ke;oe.name="footTip",oe.position.y=-E/2,bt.add(oe);const Se=qe();return{root:J,joint:bt,hand:Se,wrist:Se,tip:oe,upperMesh:xt,lowerMesh:Jt,segLen:E/2}},at=z=>{const J=qe();J.name=z<0?"shoulderL":"shoulderR",J.rotation.order="YXZ",J.position.set(z*(A/2+b/2),_-.04-U,0),D.add(J);const xt=Ge(b,T/2,b,t.limb);xt.position.y=-T/4,J.add(xt);const bt=qe();bt.name="elbow",bt.position.y=-T/2,J.add(bt);const Jt=Ge(b,T/2,b,t.limb);Jt.position.y=-T/4,bt.add(Jt);const Qt=qe();Qt.name=z<0?"handL":"handR",Qt.position.y=-T/2,bt.add(Qt);const oe=Ge(b*1.1,.09,b*1.1,t.head);oe.position.y=.045,Qt.add(oe);const Se=qe();return Se.name=z<0?"wristL":"wristR",Qt.add(Se),{root:J,joint:bt,hand:Qt,wrist:Se,upperMesh:xt,lowerMesh:Jt,segLen:T/2}},dt=Z(-1),st=Z(1),nt=at(-1),ut=at(1),Bt=[dt,st].map(z=>({root:z.root,joint:z.joint,tip:z.tip,upperLen:E/2,lowerLen:E/2,bend:1})),Zt=qe(),lt=qe();Zt.name="mountR",lt.name="mountL";const V=qe(),N=qe();V.name="gripR",N.name="gripL",ut.wrist.add(Zt),nt.wrist.add(lt),Zt.add(V),lt.add(N);const Ct=yR(t),Tt=MR(t),Mt=_R(t),vt={"sword-shield":{right:Wr(.42,.075,t),left:vR(t)},"dual-swords":{right:Wr(.42,.075,t),left:Wr(.42,.075,t)},greatsword:{right:xR(t),left:Ge(.12,.2,.12,t.wood)},staff:{right:Ct.g,left:qe(),orb:Ct.orb},bow:{right:Mt,left:Tt.g,arrow:Mt,drawString:Tt.drawString}};for(const z of Object.keys(vt))V.add(vt[z].right),N.add(vt[z].left),vt[z].right.visible=!1,vt[z].left.visible=!1;function mt(z,J,xt){const bt=new Ke;bt.name="bladeBase",bt.position.y=J,z.add(bt);const Jt=new Ke;Jt.name="bladeTip",Jt.position.y=xt,z.add(Jt)}mt(vt["sword-shield"].right,.44,.55),mt(vt["dual-swords"].right,.44,.55),mt(vt["dual-swords"].left,.44,.55),mt(vt.greatsword.right,.74,.88),mt(vt.staff.right,.78,.92);let kt=null,F=null,R=1,K=0,pt=0,et=null,ot=0,yt=0,At=0,St=0,Yt=0,gt=0,Dt=j2(),$={...Sd},W=0,ct=0,Ot=0,zt=0,Lt=0,I=-1,_t=-1,tt=0,rt=0,Pt=0,wt=0,Kt=0,he=0,ce=0,ne=1,Te=0,Pe=0,sn=0,on=0,Ae=!1,de=0,hn=-1,Nn=0,dn=0,Rn=0,_n=!1,Pn=0,On=0,q=0,Nt=0,Ut="none",P=0,H=1,j=!1,Q=-1,Y=!1,Et=0,Ft=0,Vt=0,Xt={...Gh},se=0,ee=0,qt={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},fe=NaN,ie=0,ve=0,Ue=0,pe=NaN,Wt=NaN,mn=-1,xe=null,jt=null,It=0,$t=1,ke=.1,le=null,ue={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},be=null,Be=null,gn=null,rn=null,oi=null,Ki=null,Ji="R",xi=0,ri=0,Cn=0,ci=0,Td=1,vi=0,Wo=null,_a=0,Ad=0,_c=NaN,Rd=NaN,Yo={speed:0,phase:0},ba=1,Sa=1,qs={lp:0,lr:0,rp:0,rr:0},z0=0,bc=0,Sc=!0,wc=0,js="none",Ka=0,Ja=0,Qa=0,$o=.3,Pd=0;function F0(z){const J=Math.PI/180,xt=s;let bt=0,Jt=0,Qt=0,oe=0;z==="sword-shield"?(bt=xt.swordPitchDeg*J,Qt=xt.shieldPitchDeg*J):z==="dual-swords"?(bt=xt.swordPitchDeg*J,Qt=xt.swordPitchDeg*J):z==="greatsword"?(bt=xt.greatswordPitchDeg*J,Qt=xt.greatswordPitchDeg*J):z==="staff"?bt=xt.staffPitchDeg*J:Qt=xt.bowPitchDeg*J,Zt.rotation.set(bt,0,Jt),lt.rotation.set(Qt,0,oe),Zt.position.x=z==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function Cd(z){if(z!==kt){kt=z;for(const J of Object.keys(vt))vt[J].right.visible=J===z,vt[J].left.visible=J===z;F0(z),Tt.drawString.position.z=-.06,Mt.position.z=0,Ct.orb.scale.setScalar(1),w.rotation.y=0}}Cd("sword-shield");const Ld=[];y.traverse(z=>{z instanceof re&&z.material instanceof ji&&Ld.push(z.material)});const U0=new te(r.flashColor);function N0(z,J){const xt=w0(z,J,r);Dt=xt,w.rotation.x+=xt.upperPitch,w.rotation.z+=xt.upperRoll,w.rotation.y+=xt.upperYaw;const bt=ge(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Jt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;w.position.x+=ge(xt.upperShiftX*bt,-Jt,Jt),w.position.z+=ge(xt.upperShiftZ*bt,-Jt,Jt),x.position.x+=xt.comX,x.position.z+=xt.comZ-xt.pelvisBack,x.position.y-=xt.drop;const Qt=xt.legacy?0:ge(r.lowerScale,0,1);M.position.z+=xt.pelvisBack*(1-Qt),M.position.y+=xt.drop*(1-Qt),dt.joint.rotation.x+=xt.knee,st.joint.rotation.x+=xt.knee,dt.root.rotation.x-=xt.hip,st.root.rotation.x-=xt.hip,nt.root.rotation.x+=xt.arm,ut.root.rotation.x+=xt.arm*.8;for(const oe of Ld)oe.emissive.copy(U0).multiplyScalar(xt.flash)}function Zo(z){return z<.22?-1:z<.42?-1+(z-.22)/.2*2:z<.5?1:Math.max(0,1-(z-.5)/.5)}function O0(z){for(const J of[nt,ut])J.upperMesh.scale.set(z.girthArm,z.arm,z.girthArm),J.upperMesh.position.y=-J.segLen/2*z.arm,J.joint.position.y=-J.segLen*z.arm,J.lowerMesh.scale.set(z.girthArm,z.arm,z.girthArm),J.lowerMesh.position.y=-J.segLen/2*z.arm,J.hand.position.y=-J.segLen*z.arm;for(const J of[dt,st])J.upperMesh.scale.set(z.girthLeg,z.leg,z.girthLeg),J.upperMesh.position.y=-J.segLen/2*z.leg,J.joint.position.y=-J.segLen*z.leg,J.lowerMesh.scale.set(z.girthLeg,z.leg,z.girthLeg),J.lowerMesh.position.y=-J.segLen/2*z.leg,J.tip.position.y=-J.segLen*z.leg;B.scale.set(z.girthTorso,z.torso,z.girthTorso),B.position.y=X/2*z.torso,O&&(O.scale.set(z.girthTorso,z.torso,z.girthTorso),O.position.y=it/2*z.torso,C.position.y=X*z.torso)}function B0(z,J){const xt=s.twoHandGripY??-.16,bt=Math.max(1,s.twoHandMaxStretch??1.25),Jt=T*bt*.99,Qt=nt.root.position.x,oe=nt.root.position.y,Se=nt.root.position.z,Ve=nt.root.rotation.y,ye=Math.cos(Ve),en=Math.sin(Ve),Ze=zi=>{const Qs=Zt.localToWorld(new G(0,zi,0)),to=(L?C:w).worldToLocal(Qs),eo=to.x-Qt,Bn=to.y-oe,ts=to.z-Se,es={x:eo*ye-ts*en,y:Bn,z:eo*en+ts*ye};return{t:es,dist:Math.hypot(es.x,es.y,es.z)}};let Xe=xt,we=Ze(Xe);if(!Number.isFinite(we.dist)||we.dist<=Gi)return;for(let zi=0;zi<18&&we.dist>Jt;zi++)if(Xe*=.78,we=Ze(Xe),!Number.isFinite(we.dist)||we.dist<=Gi)return;Number.isFinite(fe)||(fe=Xe);const Qe=Math.max(0,s.twoHandSlideRate??9);fe+=(Xe-fe)*(1-Math.exp(-Qe*J));const nn=Ze(fe),un=nn.t,Xn=nn.dist,Wn=Xn/Math.max(Gi,T),Qn=ge(Wn,1,bt),yi=Math.max(1,s.twoHandGripStart??1.02),Qi=Math.max(yi+.001,bt),ta=ge(s.twoHandMinGrip??1,0,1),Yn=ge((Wn-yi)/(Qi-yi),0,1),Mi=1-Yn*Yn*(3-2*Yn)*(1-ta),$n=T/2*Qn,Js=T0(un,$n,$n,-1),ea=A0({rootPitch:nt.root.rotation.x,rootRoll:nt.root.rotation.z,jointPitch:nt.joint.rotation.x},Js,ge(z*Mi,0,1),Math.PI);nt.root.rotation.x=ea.rootPitch,nt.root.rotation.z=ea.rootRoll,nt.joint.rotation.x=Math.min(ea.jointPitch,-.06);const ti=1/Math.sqrt(Qn);nt.upperMesh.scale.set(ti,Qn,ti),nt.upperMesh.position.y=-$n/2,nt.joint.position.y=-$n,nt.lowerMesh.scale.set(ti,Qn,ti),nt.lowerMesh.position.y=-$n/2,nt.hand.position.y=-$n,qt={active:!0,dist:Xn,gy:fe,pitch:ea.rootPitch,joint:nt.joint.rotation.x,grip:Mi}}function H0(z,J){if(!p.enabled){ie=0,ve=0,ut.wrist.rotation.set(0,0,0),pe=ut.root.rotation.x,Wt=Fd();return}const xt=ut.root.rotation.x,bt=Fd();if(J!==mn){mn=J,pe=xt,Wt=bt,ut.wrist.rotation.set(ie,0,ve);return}if(!Number.isFinite(pe)||z<=1e-5){pe=xt,Wt=bt,ut.wrist.rotation.set(ie,0,ve);return}const Jt=(xt-pe)/z,Qt=He(bt-Wt)/z;pe=xt,Wt=bt;const oe=Math.max(0,p.maxAngle),Se=Math.max(0,p.maxTwist),Ve=.15+.85*ge(ri,0,1),en=-ge(Ue,0,1.4)*Math.max(0,p.runDrag),Ze=ge(-Jt*p.lag*Ve+en,-oe,oe),Xe=ge(Qt*p.twistLag*Ve,-Se,Se),we=1-Math.exp(-Math.max(0,p.rate)*z);ie+=(Ze-ie)*we,ve+=(Xe-ve)*we,ut.wrist.rotation.set(ie,0,ve)}function G0(z){const J=Math.PI/180;return z==="greatsword"?s.greatswordPitchDeg*J:z==="staff"?s.staffPitchDeg*J:z==="bow"?s.bowPitchDeg*J:s.swordPitchDeg*J}function Ec(z){const J=Math.PI/180;return z==="sword-shield"?s.shieldPitchDeg*J:z==="greatsword"?s.greatswordPitchDeg*J:z==="bow"?s.bowPitchDeg*J:s.swordPitchDeg*J}function V0(z){const J=Math.PI/180;return z==="sword-shield"||z==="dual-swords"?(s.swordCantDeg??0)*J:z==="greatsword"?(s.greatswordCantDeg??0)*J:0}function X0(z,J){const xt=z.weapon;if(xt==="staff"||xt==="bow")return;const bt=Ji==="R",Jt=bt?ut:nt,Qt=bt?Zt:lt,oe=bt?nt:ut,Se=bt?lt:Zt,Ve=xt==="greatsword"&&bt?gt:0,ye=xt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,en=Math.PI/180,Ze=-ye*en,Xe=ye*en,we=(Yn,Mi)=>{const $n=Math.max(0,Math.PI/2-Math.abs(Mi));return Math.sign(Yn)*Math.min(Math.abs(Yn),$n)},Qe=(be??G0(xt)+K)+Ve,nn=J+Jt.root.rotation.x+Jt.joint.rotation.x;Qt.rotation.set(Math.PI/2-Qe-nn,0,we(bt?Ze:Xe,Qe));const un=Be??(xt==="sword-shield"?null:Ec(xt)+pt),Xn=J+oe.root.rotation.x+oe.joint.rotation.x;xt==="sword-shield"?Se.rotation.x=un===null?Ec(xt):Ec(xt)-un-Xn:Se.rotation.set(Math.PI/2-(un??0)-Xn,0,we(bt?Xe:Ze,un??0));const Wn=V0(xt),Qn=oi??0,yi=Ki??0,Qi=gn??0,ta=rn??0;bt?(V.rotation.z=-Wn+Qn,V.rotation.y=Qi,N.rotation.z=Wn+yi,N.rotation.y=ta):(N.rotation.z=Wn+Qn,N.rotation.y=Qi,V.rotation.z=-Wn+yi,V.rotation.y=ta)}function kd(z){be=z.bladePitch,Be=z.bladePitchOff,gn=z.bladeTwist,rn=z.bladeTwistOff,oi=z.bladeYaw,Ki=z.bladeYawOff,Ji=z.lead,xi=z.rootYaw+z.spinYaw,y.rotation.y=xi,w.rotation.y+=z.yaw,w.rotation.x+=z.pitch,w.rotation.z+=z.roll,x.position.z+=z.pelvisZ,x.position.x+=z.pelvisX,z.armR&&(ut.root.rotation.x=z.armR.pitch,ut.root.rotation.y=z.armR.yaw,ut.root.rotation.z=z.armR.roll,ut.joint.rotation.x=z.armR.elbow),z.armL&&(nt.root.rotation.x=z.armL.pitch,nt.root.rotation.y=z.armL.yaw,nt.root.rotation.z=z.armL.roll,nt.joint.rotation.x=z.armL.elbow)}function Dd(z,J){const xt=le??Zo(z.attackProgress),bt=uR(z.weapon,z.comboIndex,xt,m,z.attackProgress);if(z.comboIndex!==It){jt=xe,$t=0,It=z.comboIndex;const oe=z.timings.windup+z.timings.active+z.timings.recovery,Se=Math.max(m.segBlendMin??.03,oe*.22);ke=gR(jt,bt,m,bt.blend??null,Se)}const Jt=Math.max(.008,ke);$t=Math.min(1,$t+J/Jt);const Qt=jt&&$t<1?fR(jt,bt,yp($t)):bt;return xe=Qt,Qt}function W0(z,J){const xt=A/2+b/2,bt=_-.04-U;if(!m.enabled){nt.root.position.set(-xt,bt,0),ut.root.position.set(xt,bt,0),ue={lx:-xt,ly:bt,lz:0,rx:xt,ry:bt,rz:0};return}const Jt=Math.max(0,m.shoulderLift),Qt=Math.max(0,m.shoulderPush),oe=z&&J==="greatsword"?Math.max(0,m.shoulderIn):0,Se=nn=>Jt*ge((-nn-.5)/1.45,0,1),Ve=nn=>Qt*ge((-nn-.2)/1.9,0,1),ye=-xt+oe,en=bt+Se(nt.root.rotation.x),Ze=Ve(nt.root.rotation.x),Xe=xt-oe,we=bt+Se(ut.root.rotation.x),Qe=Ve(ut.root.rotation.x);nt.root.position.set(ye,en,Ze),ut.root.position.set(Xe,we,Qe),ue={lx:ye,ly:en,lz:Ze,rx:Xe,ry:we,rz:Qe}}function Y0(z,J,xt){if(z.phase==="idle"||z.charging){Nn=0,dn=0,Rn=0;return}const bt=z.attackProgress,Jt=Zo(bt),Qt=Math.max(0,Jt),oe=l.stride,Se=Number.isFinite(oe.stepReach)?oe.stepReach:.17,Ve=Number.isFinite(oe.stepSideReach)?oe.stepSideReach:.14,ye=Number.isFinite(oe.stepDipReach)?oe.stepDipReach:.05,en=z.weapon==="greatsword"?ge(Number.isFinite(oe.heavyScale)?oe.heavyScale:1,0,1):1,Ze=1-Math.exp(-12*Math.max(0,xt));Nn+=(Se*Qt*en-Nn)*Ze,dn+=(J*Ve*Qt*en-dn)*Ze,Rn+=(ye*Math.sin(Math.PI*bt)*en-Rn)*Ze,x.position.z+=Nn,x.position.x+=dn,x.position.y-=Rn}let Id=null;function $0(){Id={upperX:w.rotation.x,upperY:w.rotation.y,upperZ:w.rotation.z,upperPX:w.position.x,upperPZ:w.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:nt.root.rotation.x,lry:nt.root.rotation.y,lrz:nt.root.rotation.z,lj:nt.joint.rotation.x,rrx:ut.root.rotation.x,rry:ut.root.rotation.y,rrz:ut.root.rotation.z,rj:ut.joint.rotation.x,rootY:y.rotation.y}}function Z0(z){const J=Id;if(!J)return;const xt=yp(ge(z,0,1));if(xt>=1)return;const bt=(Jt,Qt)=>Jt+(Qt-Jt)*xt;w.rotation.x=bt(J.upperX,w.rotation.x),w.rotation.y=bt(J.upperY,w.rotation.y),w.rotation.z=bt(J.upperZ,w.rotation.z),w.position.x=bt(J.upperPX,w.position.x),w.position.z=bt(J.upperPZ,w.position.z),x.position.x=bt(J.pelvisX,x.position.x),x.position.y=bt(J.pelvisY,x.position.y),x.position.z=bt(J.pelvisZ,x.position.z),x.rotation.x=bt(J.pelvisRX,x.rotation.x),x.rotation.z=bt(J.pelvisRZ,x.rotation.z),nt.root.rotation.x=bt(J.lrx,nt.root.rotation.x),nt.root.rotation.y=bt(J.lry,nt.root.rotation.y),nt.root.rotation.z=bt(J.lrz,nt.root.rotation.z),nt.joint.rotation.x=bt(J.lj,nt.joint.rotation.x),ut.root.rotation.x=bt(J.rrx,ut.root.rotation.x),ut.root.rotation.y=bt(J.rry,ut.root.rotation.y),ut.root.rotation.z=bt(J.rrz,ut.root.rotation.z),ut.joint.rotation.x=bt(J.rj,ut.joint.rotation.x),y.rotation.y=J.rootY+He(y.rotation.y-J.rootY)*xt,xi=y.rotation.y}let Ks=null,Tc=0,zd=0;function q0(){if(!L)return;const z=k,J=Math.max(0,z.waist??1),xt=Math.max(0,z.chest??0),bt=J+xt,Jt=bt>1e-6?J/bt:1,Qt=bt>1e-6?xt/bt:0,oe=w.rotation.x,Se=w.rotation.y,Ve=w.rotation.z;w.rotation.set(oe*Jt,Se*Jt,Ve*Jt),C.rotation.set(oe*Qt,Se*Qt,Ve*Qt);const ye=ge(z.neck??0,0,1);ye>0&&(ht.rotation.x-=oe*ye),Ks={x:oe,y:Se,z:Ve}}function qo(){return{yaw:w.rotation.y+(L?C.rotation.y:0),pitch:w.rotation.x+(L?C.rotation.x:0),lean:w.rotation.z+(L?C.rotation.z:0)}}function Fd(){return qo().yaw}function j0(z,J){if(!(d!=null&&d.enabled)){Wo=null,_a=0;return}y.updateWorldMatrix(!0,!0);const xt=new G,bt=[],Jt=(ti,zi,Qs=0)=>{ti.getWorldPosition(xt),bt.push({x:xt.x,y:xt.y+Qs,z:xt.z,mass:zi})},Qt=n.headSize;Jt(ht,.08,Qt/2),Jt(B,.14),Jt(O??C,.24),Jt(x,.12),Jt(nt.hand,.05),Jt(ut.hand,.05),Jt(dt.joint,.15),Jt(st.joint,.15);const oe=kt?jo(vt[kt].right):null;oe&&bt.push({x:(oe.base.x+oe.tip.x)/2,y:(oe.base.y+oe.tip.y)/2,z:(oe.base.z+oe.tip.z)/2,mass:kt==="greatsword"?.09:.04});const Se=Math.max(.05,n.limbThickness*1.15/2+.015),Ve=Math.max(.06,n.limbThickness*1.7/2+.02);let ye=1/0,en=-1/0,Ze=1/0,Xe=-1/0,we=0;for(const ti of[dt,st])ti.tip.getWorldPosition(xt),xt.y<=.13&&(we+=1),ye=Math.min(ye,xt.x-Se),en=Math.max(en,xt.x+Se),Ze=Math.min(Ze,xt.z-Ve),Xe=Math.max(Xe,xt.z+Ve);(!Number.isFinite(ye)||we===0)&&(ye=en=Ze=Xe=0);let Qe=0,nn=0;Number.isFinite(_c)&&J>1e-5&&(Qe=ge((z.position.x-_c)/J,-20,20),nn=ge((z.position.z-Rd)/J,-20,20)),_c=z.position.x,Rd=z.position.z;const un=nR(bt,{minX:ye,maxX:en,minZ:Ze,maxZ:Xe},Qe,nn,d);if(Wo=un,!d.autoCounter){_a=0;return}const Xn=Math.cos(z.bodyYaw),Wn=-Math.sin(z.bodyYaw),Qn=un.xcomX-un.centerX,yi=un.xcomZ-un.centerZ,Qi=Qn*Xn+yi*Wn,ta=Qe*Xn+nn*Wn,Yn=un.grounded?iR(Qi,ta,d.predLead??0):0;zd=Yn;const Mi=Math.abs(Yn)-.45*un.halfX;Ad=Mi;let $n=0;Mi>.002&&un.grounded&&($n=-Math.sign(Yn)*Math.min(Math.max(.005,d.maxShift??.045),(Mi+.002)*1.1666666666666667));const Js=Math.abs(Yn)/Math.max(1e-4,un.halfX),ea=Math.max(.1,aR(d.counterRate,Js,d.counterBoost??0));_a+=($n-_a)*(1-Math.exp(-ea*J))}function K0(z,J){if(Tt.drawString.position.z=-.06,Mt.position.z=0,Ct.orb.scale.setScalar(1),w.rotation.y=0,z.charging&&z.weapon==="bow"){const Qt=z.charge;nt.root.rotation.x=-1.25,nt.joint.rotation.x=-.15,ut.root.rotation.x=.35+Qt*.3,ut.joint.rotation.x=-1.15,Tt.drawString.position.z=-.06-Qt*.22,Mt.position.z=-Qt*.3,w.rotation.y=-.22;return}if(z.phase==="idle"&&Cn<=.001){jt=null,xe=null,It=0,$t=1,ke=Math.max(.008,m.segBlend),be=null,Be=null,gn=null,rn=null,oi=null,Ki=null,fe=NaN,z.weapon==="greatsword"&&(Zt.position.x=-Math.max(0,s.twoHandInsetX??0));return}const xt=Zo(z.attackProgress),bt=Math.max(0,-xt),Jt=Math.max(0,xt);if(z.weapon==="bow")nt.root.rotation.x=-1.2,nt.joint.rotation.x=-.15,ut.root.rotation.x=.9-Jt*.8,ut.joint.rotation.x=-.3;else if(z.weapon==="greatsword")if(m.enabled)kd(Dd(z,J));else{const Qt=-1.6*bt+1.25*Jt,oe=ge(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);ut.root.rotation.x=Qt,ut.joint.rotation.x=-(.25+bt*.4),nt.root.rotation.x=Qt+.06,nt.joint.rotation.x=-(.32+bt*.4),nt.root.rotation.z=.42,ut.root.rotation.z=0;const Se=-Math.sin(ut.root.rotation.x);ut.root.rotation.y=-.72*Math.tanh(Se*4),w.rotation.y=-.2*xt*oe}else if(m.enabled)kd(Dd(z,J));else{const Qt=z.comboIndex;if(Qt===1)ut.root.rotation.x=-1.7*bt+1.1*Jt,ut.joint.rotation.x=-(.2+bt*.5),nt.root.rotation.x=.1,w.rotation.y=-.18*xt;else if(Qt===2)nt.root.rotation.x=-1.5*bt+1*Jt,nt.joint.rotation.x=-(.2+bt*.5),ut.root.rotation.x=.2,w.rotation.y=.45*-xt;else{const oe=-1.9*bt+1.2*Jt;nt.root.rotation.x=oe,ut.root.rotation.x=oe,nt.joint.rotation.x=-(.15+bt*.4),ut.joint.rotation.x=-(.15+bt*.4),w.rotation.y=-.3*xt}}if(z.weapon==="greatsword"){const Qt=ge((-ut.root.rotation.x-1.3)/1.2,0,1);Zt.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Qt)}Y0(z,de%2===0?1:-1,J)}function J0(z,J){z&&(ut.root.rotation.x=-1.05,ut.joint.rotation.x=-.35,nt.root.rotation.x=-.45,nt.joint.rotation.x=-.2,w.rotation.y=-.12,Ct.orb.scale.setScalar(1.25+.12*Math.sin(J*2)))}function Q0(z){if(!z||z.phase==="idle")return;const J=z.progress,xt=J<.3?-.35+J/.3*1.35:J<.7?1:Math.max(0,1-(J-.7)/.3),bt=Math.PI/180;w.rotation.x+=v.leanDeg*bt*xt,nt.root.rotation.x-=v.shieldPitchDeg*bt*xt,nt.joint.rotation.x-=.22*xt,ut.root.rotation.x-=.3*xt,x.position.z+=v.pelvisReach*Math.max(0,xt)}function jo(z){if(!z)return null;const J=z.getObjectByName("bladeBase"),xt=z.getObjectByName("bladeTip");if(!J||!xt)return null;z.updateWorldMatrix(!0,!1);const bt=J.getWorldPosition(new G),Jt=xt.getWorldPosition(new G),Qt=new G().setFromMatrixColumn(z.matrixWorld,0).normalize();return{base:{x:bt.x,y:bt.y,z:bt.z},tip:{x:Jt.x,y:Jt.y,z:Jt.z},normal:{x:Qt.x,y:Qt.y,z:Qt.z}}}return{group:y,update(z,J,xt,bt,Jt=!1,Qt,oe,Se){var Kd;Cd(J.weapon);const Ve=Qt===void 0||I<0?bt:ge(Qt-I,0,.1);Qt!==void 0&&(I=Qt),y.rotation.y=0,xi=0,w.rotation.x=0,w.rotation.z=0,x.position.x=0,x.position.y=E,x.position.z=0,x.rotation.z=0,x.rotation.x=0,w.position.x=0,w.position.y=0,w.position.z=0,C.rotation.set(0,0,0),M.position.x=0,M.position.y=0,M.position.z=0,M.rotation.z=0;const ye=Math.max(1/240,Math.min(bt,.1));et=((Kd=l.stance)==null?void 0:Kd[J.weapon])??null,F!==J.weapon&&(F=J.weapon,R=et?0:1);const en=Math.max(.01,(et==null?void 0:et.blend)??.22);R=Math.min(1,R+ye/en);const Ze=et?R:0;K=((et==null?void 0:et.bladePitchDeg)??0)*Math.PI/180*Ze,pt=((et==null?void 0:et.bladePitchOffDeg)??0)*Math.PI/180*Ze;const Xe=Qt===void 0?z0+=bt:Qt;bc=Xe;const we=l.landing;we.enabled?Sc&&!z.grounded?(js="jump",Ka=Xe,Ja=we.anticipationDuration,Qa=Math.max(0,we.jumpAnticipation),$o=.32):!Sc&&z.grounded&&(js="land",Ka=Xe,Ja=we.duration,Qa=q2(wc,we),$o=we.compressRatio,Pd=wc):(js="none",Qa=0),Xe<Ka&&(js="none",Qa=0),Sc=z.grounded,wc=z.velocity.y;const Qe=gp(Xe,Ka,Ja,Qa,$o),nn=J.phase!=="idle",un=(Se==null?void 0:Se.phase)==="active";ri=W2(ri,nn,ye,l.attack.blendRate);const Xn=Y2(ri,l.attack.gaitWeight,l.attack.lowerBodyWeight);ci=Xn.attackLegWeight,Td=Xn.gaitScale;const Wn=Math.sin(z.bodyYaw),Qn=Math.cos(z.bodyYaw),yi=(z.velocity.x-ot)/ye,Qi=(z.velocity.z-yt)/ye,ta=ge(yi,-60,60),Yn=ge(Qi,-60,60),Mi=ta*Wn+Yn*Qn,$n=He(z.bodyYaw-At)/ye,Js=Ve>1e-6?He(z.bodyYaw-At)/Ve:0,ea=Math.hypot(z.velocity.x,z.velocity.z),ti=o.maxForwardDeg*Math.PI/180,zi=o.maxSideDeg*Math.PI/180,Qs=ge(Mi*o.accelGain,-ti,ti),to=ge(-$n*ea*o.turnGain,-zi,zi),eo=1-Math.exp(-o.smoothing*ye);St+=(Qs-St)*eo,Yt+=(to-Yt)*eo,ot=z.velocity.x,yt=z.velocity.z,At=z.bodyYaw;const Bn=Math.hypot(z.velocity.x,z.velocity.z),ts=ge(a.knockGaitScale??0,0,1),es=xt.knockX*ts,tg=xt.knockZ*ts,eg=ts>0&&Math.hypot(xt.knockX,xt.knockZ)>.001,Ac=z.velocity.x+es,Rc=z.velocity.z+tg,Ud=Math.hypot(Ac,Rc);Nt=Ud;const ng=Math.cos(z.bodyYaw),ig=-Math.sin(z.bodyYaw),ag=z.velocity.x*ng+z.velocity.z*ig,Nd=Bn>Gi?ge(ag/Bn,-1,1):0,Od=Bn>Gi?ge((z.velocity.x*Wn+z.velocity.z*Qn)/Bn,-1,1):1,sg=bd(Od,a.backStrafeStartDeg,a.backStrafeFullDeg);Ut==="settled"&&Y&&Et>Ft*1.02+1e-4&&(Ut="none");let no=1;Ut==="blend"?(no=M0(j?Q:P,a.stopYawBlendMode,j),j||(P=Math.min(1,P+ye/Math.max(.01,a.stopYawAfterSec)),(P>=1||a.stopYawBlendMode==="inStop"||Y)&&(Ut="settled",no=0))):Ut==="settled"&&(no=ge(Bn/Math.max(Gi,a.stopEnterRatio*e),0,1)),H=no;const og=f0(Nd,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),Bd=(a.hipYawTrackRateDeg??0)*Math.PI/180,rg=(a.hipYawBackRateDeg??0)*Math.PI/180,Pc=Ve>1e-6?Ve:bt;Lt=Bd>0?l0(Lt,c0(Js),Pc):0;const Hd=p0(sg,Lt),cg=ge(Bn/.5,0,1),lg=g0(Od,Nd,og,Hd)*no*cg,Gd=h0(zt,lg,m0(Bd,rg,Hd),Pc,Lt);zt=Gd,ct+=(Gd-ct)*(1-Math.exp(-i.hipYawSmoothing*Pc));const io=z.bodyYaw+ct;Ot=io;const hg=Math.sin(io),dg=Math.cos(io),ug=Math.cos(io),fg=-Math.sin(io),ei={speed:Ud,phase:z.gaitPhase,localForward:Ac*hg+Rc*dg,localRight:Ac*ug+Rc*fg,stride:z.stride};if(nn&&J.attackId!==hn){const ae=!_n;hn=J.attackId,de+=1,sn=ae&&(!Ae||ei.speed>.05)?ei.phase:on,Ae=!0}_n=nn;const li=ri>0?V2(ei,J.attackProgress,de,ri,l.stride,sn):ei;Yo=li,nn&&(on=li.phase);const Cc=Math.max(0,a.dirFlipSec??0);Cc>0?(ba=cc(ba,li.localForward>=0?1:-1,ye,Cc),Sa=cc(Sa,li.localRight>=0?1:-1,ye,Cc)):(ba=li.localForward>=0?1:-1,Sa=li.localRight>=0?1:-1);const Vd=Math.max(0,a.stopBlendSec||0),Xd=Vd>0&&!nn&&!eg&&z.grounded,Lc=x0(Bn,Te,e,a.stopEnterRatio,a.stopExitRatio);if(!Xd||Lc.resume)_t=-1;else if(_t<0&&Lc.enter){_t=0,tt=z.gaitPhase,rt=d0(z.gaitPhase),Pt=Bn,wt=Math.max(z.stride,Gi),Kt=ei.localForward,he=ei.localRight;const ae=1/Math.max(Gi,Bn);ce=z.velocity.x*ae,ne=z.velocity.z*ae}const pg=Te;Te=Bn;const _i=Xd&&_t>=0;_i&&(_t=Math.min(1,_t+ye/Vd)),_i&&Ut!=="blend"&&(Ut="blend",P=0),j=_i&&_t<1,Q=_t,Y=Lc.resume,Et=Bn,Ft=pg;const Wd=_i?{phase:tt,speed:Pt,moveSpeed:e,localForward:Kt,localRight:he,dirF:ba,dirR:Sa,legLength:n.legLength,stride:wt,grounded:!0}:{phase:li.phase,speed:li.speed,moveSpeed:e,localForward:li.localForward,localRight:li.localRight,dirF:ba,dirR:Sa,legLength:n.legLength,stride:li.stride??0,grounded:z.grounded};let kc=_i?u0(Wd,a,{progress:_t,phase0:tt,phaseEnd:rt}):lc(Wd,a);const wa=l.attack.moveTakeover;if(wa&&!_i){const ae=J.phase==="windup"?wa.windup:J.phase==="recovery"?wa.recovery:J.phase==="settle"?wa.settle:0,me=Math.max(.05,wa.full-wa.speed),Sn=ge((ei.speed-wa.speed)/me,0,1),Ln=ge(ae,0,1)*Sn,Ko=Ln>vi?10:6;vi=ge(vi+(Ln-vi)*(1-Math.exp(-Ko*ye)),0,1)}else _i?vi=0:vi=ge(vi*Math.exp(-8*ye),0,1);if(vi>.001&&!_i){const ae=lc({phase:ei.phase,speed:ei.speed,moveSpeed:e,localForward:ei.localForward,localRight:ei.localRight,dirF:ba,dirR:Sa,legLength:n.legLength,stride:ei.stride??0,grounded:z.grounded},a);kc=$2(kc,ae,vi)}const De=Z2(kc,Xn.gaitScale);if(Vt=0,un&&Se){const ae=B2(Se.progress,Se.dir,a),me=Xn.gaitScale;De.legL.pitchX+=ae.legL.pitchX*me,De.legL.rollZ+=ae.legL.rollZ*me,De.legL.kneeX+=ae.legL.kneeX*me,De.legR.pitchX+=ae.legR.pitchX*me,De.legR.rollZ+=ae.legR.rollZ*me,De.legR.kneeX+=ae.legR.kneeX*me,De.pelvisY+=ae.pelvisY*me,Vt=ae.env}let Dc=0,Ic=0,zc=0,Yd=0;if(_i){const ae=y0(z.bodyYaw,ce,ne),me=_0(_t,tt,ae.forward,ae.right,a);me.leadLeft?(De.legL.pitchX-=me.leadPitch,De.legL.kneeX+=me.leadKnee,De.legR.pitchX+=me.trailPitch):(De.legR.pitchX-=me.leadPitch,De.legR.kneeX+=me.leadKnee,De.legL.pitchX+=me.trailPitch),Ic=me.bodyShift*me.fwdN,Dc=me.bodyShift*me.rightN,zc=me.bodyDip,Yd=me.chestPitch,Pn=me.leadPitch,On=me.bodyShift,q=me.bodyDip}else Pn=0,On=0,q=0;if(qs={lp:De.legL.pitchX,lr:De.legL.rollZ,rp:De.legR.pitchX,rr:De.legR.rollZ},!z.grounded)dt.root.rotation.x=-.55,st.root.rotation.x=-.25,dt.joint.rotation.x=.75,st.joint.rotation.x=.55,nt.root.rotation.x=-.9,ut.root.rotation.x=-.7,nt.joint.rotation.x=-.6,ut.joint.rotation.x=-.6,dt.root.rotation.z=0,st.root.rotation.z=0;else{dt.root.rotation.x=De.legL.pitchX,st.root.rotation.x=De.legR.pitchX,dt.root.rotation.z=De.legL.rollZ,st.root.rotation.z=De.legR.rollZ,dt.joint.rotation.x=De.legL.kneeX,st.joint.rotation.x=De.legR.kneeX;const ae=et?R:0,me=1+(((et==null?void 0:et.armSwing)??1)-1)*ae,Sn=et==null?void 0:et.armR,Ln=et==null?void 0:et.armL,Ko=De.armL*me+((Ln==null?void 0:Ln.pitch)??0)*ae,Jd=De.armR*me+((Sn==null?void 0:Sn.pitch)??0)*ae;nt.root.rotation.x=Ko,ut.root.rotation.x=Jd,nt.joint.rotation.x=-(.18+Ko*.2)+((Ln==null?void 0:Ln.elbow)??0)*ae,ut.joint.rotation.x=-(.18+Jd*.2)+((Sn==null?void 0:Sn.elbow)??0)*ae,nt.root.rotation.z=((Ln==null?void 0:Ln.roll)??0)*ae,ut.root.rotation.z=((Sn==null?void 0:Sn.roll)??0)*ae,nt.root.rotation.y=((Ln==null?void 0:Ln.yaw)??0)*ae,ut.root.rotation.y=((Sn==null?void 0:Sn.yaw)??0)*ae,x.position.x=De.pelvisX,x.position.y=E+De.pelvisY,x.position.z=0,x.rotation.z=De.pelvisRoll}const mg=R0(x,M),ao=un?{...u,weight:0}:_i&&u.enabled?{...u,weight:1}:u,$d=ao.enabled&&z.grounded&&ao.weight>0?ge(ao.weight,0,1)*(nn?ge(ao.attackScale,0,1):1):0;x.position.x+=Dc,x.position.z+=Ic,x.position.y-=zc,M.position.y+=zc,$d<=0&&(M.position.x-=Dc,M.position.z-=Ic);const Fc=Bn/Math.max(e,Gi);Ue=Fc;const gg=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,xg=1-Math.exp(-Math.max(0,gg)*ye);W+=(ge(Fc,0,1)-W)*xg;const ns=E0({leanForward:St,leanSide:Yt,speedRatio:W},o);x.rotation.x+=ns.pelvisPitch,x.rotation.z+=ns.pelvisRoll,x.position.x+=ns.pelvisX,x.position.z+=ns.pelvisZ,x.position.y-=ns.crouch,M.position.y+=ns.crouch*(1-ge($d,0,1));const Zd=J.phase!=="idle"||J.charging&&J.weapon==="bow",Uc=Zd?1:0,vg=Math.max(.001,Uc>Cn?m.poseIn??.1:m.poseOut??.16);if(Cn!==Uc){const ae=ye/vg;Cn=ge(Cn+(Uc>Cn?ae:-ae),0,1)}if((Cn>0||Zd)&&$0(),K0(J,ye),Cn>0&&Cn<1&&Z0(Cn),et){const ae=(1-Cn)*R;w.rotation.y+=(et.torsoYaw??0)*ae,w.rotation.x+=(et.torsoPitch??0)*ae}J0(Jt,z.gaitPhase),Q0(oe);const yg=J.weapon==="greatsword",qd=Math.hypot(z.velocity.x,z.velocity.z),Mg=yg&&J.phase==="idle"&&qd>.5?Math.min(1.15,qd/Math.max(e,.001)*.9):0;gt+=(Mg-gt)*(1-Math.exp(-6*ye));const _g=w.rotation.x;J.weapon==="bow"&&(Tt.g.rotation.x=-(nt.root.rotation.x+nt.joint.rotation.x),Mt.rotation.x=-(ut.root.rotation.x+ut.joint.rotation.x));const bg=w.rotation.y;N0(xt,z.bodyYaw);const jd=xt.type==="none"?1:.4;if(w.rotation.x+=St*jd+Yd,w.rotation.z+=(Yt+De.sideLean)*jd,Qe>0&&(dt.root.rotation.x-=we.hipPitch*Qe,st.root.rotation.x-=we.hipPitch*Qe,dt.joint.rotation.x+=we.kneeBend*Qe,st.joint.rotation.x+=we.kneeBend*Qe,x.position.y-=we.crouchDepth*Qe,M.position.y+=we.crouchDepth*(1-we.lowerScale)*Qe,w.rotation.x+=we.upperPitch*Qe,nt.root.rotation.x-=we.armTuck*Qe,ut.root.rotation.x-=we.armTuck*Qe),ci>0&&z.grounded){const ae=X2(J.attackProgress,de,l.stride),me=ci;dt.root.rotation.x+=ae.legL.pitchX*me,st.root.rotation.x+=ae.legR.pitchX*me,dt.root.rotation.z+=ae.legL.rollZ*me,st.root.rotation.z+=ae.legR.rollZ*me,dt.joint.rotation.x+=ae.legL.kneeX*me,st.joint.rotation.x+=ae.legR.kneeX*me,x.position.x+=ae.pelvisX*me,x.position.y+=ae.pelvisY*me,x.rotation.z+=ae.pelvisRoll*me}if(W0(nn,J.weapon),d!=null&&d.enabled&&d.autoCounter&&Math.abs(_a)>1e-4&&(x.position.x+=_a),g.enabled){const ae=J.phase!=="idle"&&!J.charging,me=ae?Zo(J.attackProgress):0;ae&&ee>.55&&me<ee-1e-4&&(se=1),ee=me,se=cR(se,ye,g.impactDecay);const Sn=oR({swing:me,charge:J.charging?J.charge:0,impact:se,speedRatio:Fc,grounded:z.grounded},g);Xt=rR(Xt,Sn,ye,g.smoothing)}else Xt={...Gh};O0(Xt),M.rotation.y=ct,Pe=v0(ct,a.chestYawScale,a.chestYawMaxDeg),w.rotation.y+=Pe;const Sg=bg;if(ht.rotation.y=He(z.headYaw-z.bodyYaw-Sg-Pe),ht.rotation.x=-ge(z.headPitch??0,-.7,.7),w.rotation.x+=-ge(z.bodyPitch??0,-.4,.4),q0(),H0(bt,J.comboIndex),X0(J,_g),J.weapon==="greatsword"&&!J.charging&&(J.phase!=="idle"||Cn>0)){y.updateWorldMatrix(!0,!0);const ae=J.phase==="idle"?Math.max(Cn,ri):1;B0(ge(ae,0,1),ye)}if($=P0({root:y,pelvis:x,lower:M,limbs:Bt,base:mg,cfg:ao,grounded:z.grounded,attacking:nn}),j0(z,ye),L&&Ks){const ae=qo();Tc=Math.max(Math.abs(ae.pitch-Ks.x),Math.abs(ae.yaw-Ks.y),Math.abs(ae.lean-Ks.z))}else Tc=0},lean(){return{forward:St,side:Yt}},landing(){const z=gp(bc,Ka,Ja,Qa,$o),J=Ja>0?Math.max(0,Ja-Math.max(0,bc-Ka)):0;return{pulse:z,remaining:J,kind:z>0?js:"none",impactVy:Pd}},hurt(){return Dt},ik(){return $},stretch(){return{...Xt,impact:se}},gripDebug(){return{...qt}},weaponDebug(){return{wristPitch:ie,wristTwist:ve}},setClipT(z){le=z===null||!Number.isFinite(z)?null:Math.max(0,Math.min(1,z))},stanceDebug(){const z=et==null?void 0:et.armR,J=et==null?void 0:et.armL,xt=et?R:0;return{weapon:kt??"sword-shield",weight:xt,armL:{pitch:((J==null?void 0:J.pitch)??0)*xt,yaw:((J==null?void 0:J.yaw)??0)*xt,roll:((J==null?void 0:J.roll)??0)*xt,elbow:((J==null?void 0:J.elbow)??0)*xt},armR:{pitch:((z==null?void 0:z.pitch)??0)*xt,yaw:((z==null?void 0:z.yaw)??0)*xt,roll:((z==null?void 0:z.roll)??0)*xt,elbow:((z==null?void 0:z.elbow)??0)*xt},torsoYaw:((et==null?void 0:et.torsoYaw)??0)*xt,torsoPitch:((et==null?void 0:et.torsoPitch)??0)*xt,bladePitchDeg:K*180/Math.PI,bladePitchOffDeg:pt*180/Math.PI,armSwing:(et==null?void 0:et.armSwing)??1}},swingDebug(){const z=xe;return{seg:It,kind:(z==null?void 0:z.kind)??"right-left",lead:(z==null?void 0:z.lead)??"R",yaw:(z==null?void 0:z.yaw)??0,rootYaw:(z==null?void 0:z.rootYaw)??0,spinYaw:(z==null?void 0:z.spinYaw)??0,rootTurn:xi,pitch:(z==null?void 0:z.pitch)??0,roll:(z==null?void 0:z.roll)??0,strike:(z==null?void 0:z.strike)??0,bladeTwist:(z==null?void 0:z.bladeTwist)??0,bladeTwistOff:(z==null?void 0:z.bladeTwistOff)??0,bladeYaw:(z==null?void 0:z.bladeYaw)??0,bladeYawOff:(z==null?void 0:z.bladeYawOff)??0,shoulderL:{x:ue.lx,y:ue.ly,z:ue.lz},shoulderR:{x:ue.rx,y:ue.ry,z:ue.rz}}},attackBlend(){return ri},attackWeights(){return{gaitScale:Td,attackLegWeight:ci,driveSpeed:Yo.speed,stridePhase:Yo.phase,strideBase:sn,stepIndex:de}},hipYaw(){return ct},torsoTotal(){return qo()},spineDebug(){if(!L)return null;const z=qo();return{enabled:!0,waistYaw:w.rotation.y,chestYaw:C.rotation.y,totalYaw:z.yaw,totalPitch:z.pitch,totalLean:z.lean,neckPitch:ht.rotation.x,leak:Tc}},balanceDebug(){return Wo?{...Wo,shift:_a,latDeficit:Ad,lateralFf:zd}:null},gaitDebug(){return{stopT:_t,hipYaw:ct,chestYaw:Pe,speed:Te,gaitSpeed:Nt,stopStep:Pn,stopShift:On,stopDip:q,stopYawFade:H,turnStep:Vt,legTakeover:vi,legLPitch:qs.lp,legLRoll:qs.lr,legRPitch:qs.rp,legRRoll:qs.rr,phase:Yo.phase,dirF:ba,dirR:Sa,hipYawTarget:zt,spin:Lt}},gaitYaw(){return Ot},arrowDirection(){Mt.updateWorldMatrix(!0,!1);const z=Mt.matrixWorld.elements,J=z[8],xt=z[9],bt=z[10],Jt=Math.hypot(J,xt,bt)||1;return{x:J/Jt,y:xt/Jt,z:bt/Jt}},weaponBlade(){return kt?jo(vt[kt].right):null},bladesWorld(){return kt?{right:jo(vt[kt].right),left:jo(vt[kt].left)}:{right:null,left:null}},dispose(){y.traverse(z=>{if(z instanceof re){z.geometry.dispose();const J=z.material;Array.isArray(J)?J.forEach(xt=>xt.dispose()):J.dispose()}})}}}function bR(n){const t=C0(n.voxel,n.colors,n.moveSpeed,n.orientation,n.gait,n.mount,n.lean,n.hurt,n.animation,n.ik,n.links,n.wrist,n.balance),e=new Ee;e.add(t.group);const i={position:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:1,distance:0,coyoteTime:0,jumpBuffer:0},a=[];for(const s of["headPivot","chest","torsoUpper","torso","pelvis"]){const o=t.group.getObjectByName(s);o&&a.push(o)}return{group:e,update(s,o,r){i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.velocity.x=s.velocity.x,i.velocity.y=s.velocity.y,i.velocity.z=s.velocity.z,i.facing=s.facing,i.moveYaw=Math.atan2(i.velocity.x,i.velocity.z),i.bodyYaw=s.bodyYaw,i.headYaw=s.headYaw,i.gaitPhase=s.gaitPhase,i.stride=s.stride,i.distance=s.distance,i.grounded=!0,i.sprinting=!1,e.position.set(s.position.x,s.position.y,s.position.z),e.rotation.y=s.bodyYaw,s.combat&&t.update(i,s.combat,s.hurt,o,!1,r,s.link)},debug(){return t.gaitDebug()},boneAtWorld(s,o,r){if(a.length===0)return null;const l=new G(s,o,r),c=new G;let h=null,f=Number.POSITIVE_INFINITY;for(const d of a){d.updateWorldMatrix(!0,!1),d.getWorldPosition(c);const u=c.distanceToSquared(l);u<f&&(f=u,h=d)}return h?{node:h,point:l}:null},dispose(){t.dispose()}}}const Ia=.012,za=.016;function SR(n,t){const e=t.lab,i=new Ee;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(y){return o.push(y),y}function c(y){return r.push(y),y}function h(y,x,M,w=Ia){const S=l(new yn({color:x,transparent:!0,opacity:M,depthWrite:!1,side:$e,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),E=new re(y,S);return E.rotation.x=-Math.PI/2,E.position.y=w,E.renderOrder=2,E}function f(y,x){return c(new Is(Math.max(y,.001),x,72))}function d(y,x,M,w=za){const E=document.createElement("canvas"),T=E.getContext("2d");if(!T)return new re;const b='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';T.font=b,E.width=tf.ceilPowerOfTwo(Math.ceil(T.measureText(y).width)+32),E.height=tf.ceilPowerOfTwo(96*1.4);const _=E.getContext("2d");if(!_)return new re;_.font=b,_.textAlign="center",_.textBaseline="middle",_.fillStyle=M,_.fillText(y,E.width/2,E.height/2);const A=new Nh(E);A.colorSpace=Fn,s.push(A);const k=E.width/E.height,L=c(new ai(x*k,x)),U=l(new yn({map:A,transparent:!0,depthWrite:!1,side:$e,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),C=new re(L,U);return C.rotation.x=-Math.PI/2,C.position.y=w,C.renderOrder=3,C}function u(y,x,M,w,S,E){const T=M-x,b=c(new ai(T,w)),_=h(b,S,E,Ia);_.position.set(T/2+x,Ia,0);const A=new Ee;return A.add(_),A.rotation.y=y-Math.PI/2,A}function p(y,x,M,w,S){const E=new e0;E.moveTo(0,x*.5),E.lineTo(-M*.5,x*.5-M*.9),E.lineTo(-M*.18,x*.5-M*.9),E.lineTo(-M*.18,-x*.5),E.lineTo(M*.18,-x*.5),E.lineTo(M*.18,x*.5-M*.9),E.lineTo(M*.5,x*.5-M*.9),E.closePath();const T=c(new _d(E)),b=h(T,w,S,Ia+.002),_=new Ee;return _.add(b),_.rotation.y=y+Math.PI,_}function v(y){var T;const x=new Ee,M=d(`${y.index} · ${y.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((T=M.geometry.parameters)==null?void 0:T.width)??3;x.add(M);const E=h(c(new ai(S*.98,.08)),y.color,.7,za);return E.position.set(0,za,t.lab.labelTextHeight*.66),x.add(E),x.position.set(y.labelX,0,y.labelZ),x}const g=new Ee;for(const y of n??[]){const x=new Ee;if(x.position.set(y.x,0,y.z),y.shape==="square"){const M=y.radius,w=h(c(new ai(M*2,M*2)),y.color,e.padOpacity*.09);x.add(w);const S=.07,E=[[0,M,M*2+S,S],[0,-M,M*2+S,S],[-M,0,S,M*2+S],[M,0,S,M*2+S]];for(const[T,b,_,A]of E){const k=h(c(new ai(_,A)),y.color,e.padOpacity);k.position.x=T,k.position.z=b,x.add(k)}}else x.add(h(c(new xd(y.radius,72)),y.color,e.padOpacity*.075)),x.add(h(f(y.radius-.075,y.radius),y.color,e.padOpacity));if(y.id==="hub"){for(let M=0;M<4;M++){const w=M*Math.PI/4,S=M%2===0;for(const E of[0,Math.PI])x.add(u(w+E,y.radius*.12,y.radius*.94,S?.09:.055,y.color,S?.5:.32))}x.add(h(f(.5,.56),y.color,.4))}else if(y.id==="dash"){const M=y.spawnZ-y.z,w=-y.radius+.5,S=M-w,E=h(c(new ai(.06,S)),y.color,.36);E.position.set(0,Ia,(M+w)/2),x.add(E);let T=0;for(let _=M;_>=w-.01;_-=1,T++){const A=T%5===0,k=h(c(new ai(A?2.4:1.3,A?.1:.07)),y.color,A?.72:.42);k.position.set(0,Ia,_),x.add(k);const L=d(String(T),.52,A?"#eaf4ff":"rgba(200,225,245,0.8)");L.position.set(1.6,za,_),x.add(L)}const b=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[_,A]of b){const k=M-_,L=h(c(new ai(1.9,.09)),"#ffffff",.5);L.position.set(-1.5,Ia,k),x.add(L);const U=d(A,.42,"rgba(220, 236, 250, 0.86)");U.position.set(-3,za,k),x.add(U)}}else if(y.id==="gait"){x.add(h(f(1.44,1.5),y.color,.5)),x.add(h(f(1.14,1.2),y.color,.22));const M=1.55,w=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,E,T]of w){const _=Math.sin(S),A=Math.cos(S),k=p(S,1.7,.34,T,.75);k.position.set(_*1.7*.5,0,M+A*1.7*.5),x.add(k);const L=d(E,.44,T);L.position.set(_*(1.7+.7),za,M+A*(1.7+.7)),x.add(L)}}if(g.add(x),e.showLabels){const M=v(y);a.push(M),g.add(M)}}i.add(g);const m=n==null?void 0:n.find(y=>y.id==="hub");if(m&&e.showLabels){const y=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[x,M,w]of y){const S=d(w,.4,"rgba(190, 224, 248, 0.8)");S.position.set(m.x+x*(m.radius+.7),za,m.z+M*(m.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(y){i.visible=y},setLabelsVisible(y){for(const x of a)x.visible=y},dispose(){for(const y of r)y.dispose();for(const y of o)y.dispose();for(const y of s)y.dispose();i.clear()}}}const We={grass:8,groundArea:12,ringHalo:20,ring:22,ringMeter:24,ringWarn:26,groundFx:30,trail:40,slash:44,projectileTrail:46,projectile:48,projectileGlow:50};function Ll(n,t){n.renderOrder=t,n.traverse(e=>{e.renderOrder=t})}function kl(n,t,e){const i=Array.from({length:t.count},()=>{const a=new yn({color:t.color,transparent:!0,opacity:0,side:$e,depthWrite:!1,...t.blending?{blending:t.blending}:{}}),s=new re(t.geometry,a);return s.rotation.x=-Math.PI/2,s.renderOrder=t.renderOrder,s.visible=!1,n.add(s),{mesh:s,mat:a,life:0,base:1,delay:0}});return{entries:i,spawn(a,s,o,r,l){const c=i.find(h=>h.life<=0)??i[0];l!=null&&l.color&&c.mat.color.set(l.color),c.mesh.position.set(a,e(a,s,o)+t.yOffset,s),c.base=r,c.mesh.scale.setScalar(r*t.scaleFrom),c.mesh.visible=!0,c.mat.opacity=t.spawnOpacity,c.life=t.duration,c.delay=(l==null?void 0:l.delay)??0},update(a){for(const s of i){if(s.life<=0)continue;if(s.delay>0){s.delay-=a;continue}s.life-=a;const o=Math.max(0,s.life/Math.max(t.duration,1e-6));s.mesh.scale.setScalar(s.base*(t.scaleFrom+t.scaleSpan*(1-Math.pow(o,t.growPow)))),s.mat.opacity=t.peak*Math.pow(o,t.fadePow),s.life<=0&&(s.mesh.visible=!1)}},live(){return i.filter(a=>a.life>0)},dispose(){for(const a of i)a.mat.dispose()}}}function wR(n,t,e,i){const a=t.dash,s={count:6,geometry:new Is(a.ringRadius-.06,a.ringRadius,28),color:"#ffffff",renderOrder:We.groundFx,duration:a.fxDuration,peak:.9,fadePow:1,scaleFrom:.6,scaleSpan:1.2,growPow:1,yOffset:.04,spawnOpacity:.9},o=kl(n,s,i),r=t.links,l={count:5,geometry:new Is(r.ringRadius-.07,r.ringRadius,28),color:r.chargeColor,renderOrder:We.groundFx,duration:r.fxDuration,peak:.85,fadePow:1,scaleFrom:.55,scaleSpan:1.1,growPow:1,yOffset:.05,spawnOpacity:.85},c=kl(n,l,i),h=t.groundSlam,f={count:4,geometry:new Is(.78,1,56),color:h.color,blending:Wi,renderOrder:We.groundFx+1,duration:h.duration,peak:.85,fadePow:1.3,scaleFrom:.35,scaleSpan:.65,growPow:1.8,yOffset:.035,spawnOpacity:0},d=kl(n,f,i);let u=e.dash.id,p="none",v=e.playerLink.id,g=e.playerLink.hitIds.length,m=e.combat.slamAttackId,y=0;return{update(x,M,w){var T;const S=x.character;if(x.dash.id!==u){u=x.dash.id;const b=x.dash;p=b.kind,b.kind==="blink"?(o.spawn(b.fromX,b.fromZ,S.position.y,.9,{color:a.blinkColor}),o.spawn(b.toX,b.toZ,S.position.y,1.35,{color:a.blinkColor})):o.spawn(b.fromX,b.fromZ,S.position.y,1.1,{color:a.rollColor})}if(o.update(M),x.combat.slamAttackId!==m&&(m=x.combat.slamAttackId,y+=1,h.enabled)){const b=(T=x.config.combat.weapons[x.combat.weapon])==null?void 0:T.groundSlam,_=Math.max(.6,(b==null?void 0:b.radius)??2.2);d.spawn(S.position.x,S.position.z,S.position.y,_,{delay:0}),d.spawn(S.position.x,S.position.z,S.position.y,_*h.outerScale,{delay:h.delay}),w(h.shake)}d.update(M);const E=x.playerLink;E.id!==v&&(v=E.id,g=E.hitIds.length,c.spawn(S.position.x,S.position.z,S.position.y,1)),E.hitIds.length>g?(g=E.hitIds.length,c.spawn(S.position.x,S.position.z,S.position.y,1.35)):E.hitIds.length<g&&(g=E.hitIds.length),c.update(M)},slamDebug(){return{spawns:y,lastId:m,live:d.live().map(x=>({life:x.life,scale:x.mesh.scale.x,opacity:x.mat.opacity,visible:x.mesh.visible}))}},groundOrder(){var x;return((x=d.entries[0])==null?void 0:x.mesh.renderOrder)??We.groundFx+1},activeDash(){return o.live().length},dashKind(){return p},dispose(){o.dispose(),c.dispose(),d.dispose();for(const x of[s.geometry,l.geometry,f.geometry])x.dispose()}}}const wd=64,L0=[0,.24,.76,1],ER=[0,1,1,0],k0=[0,.12,.28,.5,.72,.88,1],TR=[0,.16,.5,1,.5,.16,0];function Mp(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function Ed(n,t,e,i,a=wd,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?k0:L0,c=s==="glow"?TR:ER,h=l.length,f=a+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),p=[];for(let g=0;g<f;g++){const m=g/a,y=(m-.5)*e,x=Mp(m,i)*Mp(1-m,i),M=Math.sin(y),w=Math.cos(y);for(let S=0;S<h;S++){const E=o+(r-o)*l[S],T=g*h+S;d[T*3]=M*E,d[T*3+1]=0,d[T*3+2]=w*E;const b=x*c[S];u[T*4]=1,u[T*4+1]=1,u[T*4+2]=1,u[T*4+3]=b}}for(let g=0;g<a;g++)for(let m=0;m<h-1;m++){const y=g*h+m,x=y+h;p.push(y,x,y+1,y+1,x,x+1)}const v=new an;return v.setAttribute("position",new Mn(d,3)),v.setAttribute("color",new Mn(u,4)),v.setIndex(p),v.computeBoundingSphere(),v}function Dl(n){const t=new yn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:$e,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const h=Math.round(l*32)/32,f=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const p=Ed(n.radius,n.thickness*f,h,n.edgeFade,wd,n.profile??"band");if(e.set(d,p),e.size>64){for(const[v,g]of e)if(v!==d&&g!==i){g.dispose(),e.delete(v);break}}return p};i=a(n.arcRad,1);const s=new re(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,h,f,d,u=1){const p=Math.max(.05,u);(Math.abs(l-o)>.01||Math.abs(p-r)>.01)&&(i=a(l,p),s.geometry=i,o=l,r=p),t.opacity=c,t.color.copy(f),s.scale.set(h,1,h),s.rotation.y=d,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function _p(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function AR(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,h=s+(c-s)*(.35+.65*r),f=4+4*r+6*l,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*l)*r+.04*d),p=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:p,level:r}}function RR(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function PR(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<a;u++){const p=u/e,v=t+(1-t)*p,g=c*a+u;s[g*3]=f*v,s[g*3+1]=0,s[g*3+2]=d*v;const m=Math.pow(1-p,1.8)*.9+(u===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,m)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const f=c*a+h,d=f+a;r.push(f,d,f+1,f+1,d,d+1)}const l=new an;return l.setAttribute("position",new Mn(s,3)),l.setAttribute("color",new Mn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function bp(n){const t=n.segments??wd,e=n.profile??"band",a=((e==="glow"?k0.length:L0.length)-1)*6,s=Ed(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new yn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:$e,vertexColors:!0,toneMapped:!1}),r=new re(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,f,d,u=1){const p=Math.min(1,Math.max(0,c)),v=Math.round(p*t),g=p>.001?Math.max(1,v)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),l=v,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&p>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function Sp(n){const t=new Ee,e=PR(48),i=new yn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:$e,vertexColors:!0,toneMapped:!1}),a=new re(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=Ed(1-s*.5,s,Math.PI*2,0,64,"band"),r=new yn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:$e,vertexColors:!0,toneMapped:!1}),l=new re(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,f,d,u,p){const v=Math.min(1,Math.max(0,u));t.position.set(c,f,h),a.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=v*.26,r.opacity=v*(.72+.18*Math.sin(p*7)),t.visible=v>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function wp(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function CR(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function LR(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function kR(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function DR(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function IR(n,t,e){return n?t:e}function D0(n){return{x:0,y:0,z:1}}function zR(n){return Math.asin(D0().y)}function FR(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const UR=Math.PI/3;function Ep(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function NR(){let n=0,t=!1;return{update(e,i,a,s=UR){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=Ep(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=Ep(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function OR(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new an,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new Mn(i,3),o=new Mn(a,3);s.setUsage(Eo),o.setUsage(Eo),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const M=x*2,w=M+1,S=M+2,E=M+3;r.push(M,w,S,w,E,S)}e.setIndex(r),e.setDrawRange(0,0);const l=new yn({vertexColors:!0,transparent:!0,opacity:1,blending:Wi,depthWrite:!1,side:$e}),c=new re(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new te(n.color);let f=[],d=null,u=0,p=0,v=!1,g=!1,m=0;function y(){const x=f.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const M=Math.max(.001,n.life);for(let w=0;w<x;w++){const S=f[w],E=Math.max(0,1-S.age/M),T=E*E,b=Math.min(1,S.speed/Math.max(.001,n.minSpeed*2)),_=n.intensity*T*(.55+.45*b)*(1+m),A=.18+.82*E,k=w*6;i[k]=S.tx+(S.bx-S.tx)*A,i[k+1]=S.ty+(S.by-S.ty)*A,i[k+2]=S.tz+(S.bz-S.tz)*A,i[k+3]=S.tx,i[k+4]=S.ty,i[k+5]=S.tz;const L=h.r*_,U=h.g*_,C=h.b*_,D=L*.22,B=U*.22,O=C*.22;a[k]=D,a[k+1]=B,a[k+2]=O;const X=1+n.tipBoost;a[k+3]=Math.min(1,L*X),a[k+4]=Math.min(1,U*X),a[k+5]=Math.min(1,C*X)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,M,w){if(!n.enabled){c.visible=!1;return}const S=Math.max(0,x);m*=Math.exp(-Math.max(1,n.pulseDecay??14)*S),m<.001&&(m=0);for(const E of f)E.age+=S;for(;f.length>0&&f[0].age>n.life;)f.shift();if(M){const E=d?Math.hypot(M.tip.x-d.x,M.tip.y-d.y,M.tip.z-d.z)/Math.max(1e-4,S):0,T=f[f.length-1],b=T?Math.hypot(M.tip.x-T.tx,M.tip.y-T.ty,M.tip.z-T.tz):1/0;if(w&&b>=n.minStep)for(f.push({bx:M.base.x,by:M.base.y,bz:M.base.z,tx:M.tip.x,ty:M.tip.y,tz:M.tip.z,age:0,speed:E});f.length>t;)f.shift();d={x:M.tip.x,y:M.tip.y,z:M.tip.z},u=E,p=b,v=!0}else d=null,v=!1,u=0,p=0;g=w,y()},debug(){return{count:f.length,visible:c.visible,speed:u,moved:p,hasBlade:v,active:g,pulse:m}},pulse(x){!Number.isFinite(x)||x<=0||(m=Math.min(1.5,m+x))},reset(){f=[],d=null,m=0,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}const BR=`#include <common>
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
}`,HR=`vec4 mvPosition = vec4( transformed, 1.0 );
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
  float effL = ${vu.toFixed(2)} * aWindGeom.x + aWindGeom.y;
  float theta = atan(sway, max(effL, 1e-3));
  float tLow = theta * ${vu.toFixed(2)};
  float tUp  = theta * ${mv.toFixed(2)};

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
gl_Position = projectionMatrix * mvPosition;`,GR=`#include <common>
varying float vWindShade;`,VR=`#include <color_fragment>
diffuseColor.rgb *= vWindShade;`;function XR(n,t,e,i,a){const s=Math.min(e.blades.length,Math.floor(Math.max(0,i.maxInstances)/2)),o=s*2,r=new Float32Array(o*2),l=new Float32Array(o*3),c=new Float32Array(o*4),h=Math.max(.01,i.segmentHeight);for(let u=0;u<s;u++){const p=e.blades[u],v=Math.min(h,p.height),g=Math.max(0,p.height-v),[m,y]=fv(a,p.x,p.z,p.yaw*a.jitter),x=Math.min(1.4,Math.max(.6,p.height/(h*1.5)));for(let M=0;M<2;M++){const w=u*2+M;r[w*2]=m,r[w*2+1]=y,l[w*3]=p.x,l[w*3+1]=p.y,l[w*3+2]=p.z,c[w*4]=v,c[w*4+1]=g,c[w*4+2]=x,c[w*4+3]=M}}t.setAttribute("aWindPhase",new Ao(r,2)),t.setAttribute("aWindRoot",new Ao(l,3)),t.setAttribute("aWindGeom",new Ao(c,4));const f=nm(a),d={uWindTime:{value:0},uWindDir:{value:new Gt(f.dirX,f.dirZ)},uWindOmega:{value:new Gt(f.omega1,f.omega2)},uWindAmp:{value:new Gt(f.amp1,f.amp2)},uWindGust:{value:1},uWindShade:{value:f.shadeAmount},uWindOn:{value:a.enabled?1:0}};return n.onBeforeCompile=u=>{Object.assign(u.uniforms,d),u.vertexShader=u.vertexShader.replace("#include <common>",BR).replace("#include <project_vertex>",HR),u.fragmentShader=u.fragmentShader.replace("#include <common>",GR).replace("#include <color_fragment>",VR)},n.customProgramCacheKey=()=>"grass-wind-pivot-v2",d}function WR(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function YR(n,t,e=zo){const i=new Ee;i.name="grass-layer";const s=n.blades.length,o=Math.max(0,Math.floor(t.maxInstances)),r=Math.min(s,Math.floor(o/2)),l=r*2,c=t.enabled&&l>0,f=(t.palette.length>0?t.palette:["#4a8f57"]).map(N=>new te(N)),d=new te(t.stumpColor),u=new te(t.debris.color),p=new Vn(1,1,1),v=new Vn(1,1,1),g=new ji({color:16777215,transparent:!1}),m=XR(g,v,n,t,e),y=new ji({color:u,transparent:!1});let x=null,M=null,w=null;const S=[],E=WR(2654435769^r),T=new Float32Array(r),b=new Uint8Array(r),_=new Float32Array(r),A=new Uint8Array(r).fill(1),k=new Ce,L=new ga,U=new ga,C=new ga,D=new G,B=new G,O=new G,X=new G,it=new te,ht=new te,ft=new Ce().makeScale(0,0,0);let Rt=0,Z=0,at=0,dt=0,st=1,nt=1;const ut=8;let Bt={enabled:e.enabled,time:0,gust:1,mode:"pivot"};function Zt(N,Ct){if(f.length===1)return Ct.copy(f[0]);const Tt=Math.max(0,Math.min(f.length-1,N*(f.length-1))),Mt=Math.min(f.length-2,Math.max(0,Math.floor(Tt)));return Ct.copy(f[Mt]).lerp(f[Mt+1],Math.min(1,Math.max(0,Tt-Mt)))}if(c){x=new Jf(v,g,l),x.instanceMatrix.setUsage(Eo),x.castShadow=!1,x.receiveShadow=!0,x.frustumCulled=!1,x.name="grass-blades",x.setColorAt(0,f[0]),M=x.instanceColor,M&&M.setUsage(Eo);for(let Ct=0;Ct<l;Ct++)x.setMatrixAt(Ct,ft);i.add(x);const N=Math.max(1,Math.floor(t.debris.max));w=new Jf(p,y,N),w.instanceMatrix.setUsage(Eo),w.castShadow=!1,w.receiveShadow=!1,w.frustumCulled=!1,w.name="grass-debris";for(let Ct=0;Ct<N;Ct++)w.setMatrixAt(Ct,ft);i.add(w)}i.visible=c;function lt(N,Ct,Tt,Mt,vt,mt){if(!w)return;const kt=w.count;if(S.length>=kt)return;const F=t.debris.life,R=1.1+E()*1.5;S.push({x:N,y:Ct,z:Tt,vx:Mt*R+(E()-.5)*1.2,vy:1.9+E()*1.8,vz:vt*R+(E()-.5)*1.2,life:F,total:F,size:mt*(.55+E()*.45),spin:(E()-.5)*9})}function V(N){if(!w)return;const Ct=w.count,Tt=12;for(let vt=S.length-1;vt>=0;vt--){const mt=S[vt];if(mt.life-=N,mt.life<=0){S.splice(vt,1);continue}mt.vy-=Tt*N,mt.x+=mt.vx*N,mt.y+=mt.vy*N,mt.z+=mt.vz*N,mt.y<.02&&(mt.y=.02,mt.vy=-mt.vy*.25,mt.vx*=.6,mt.vz*=.6)}const Mt=1e-4;for(let vt=0;vt<Ct;vt++){const mt=S[vt];if(!mt){w.setMatrixAt(vt,ft);continue}const kt=Math.max(Mt,mt.life/mt.total);B.set(mt.x,mt.y,mt.z),D.set(.4+vt*.13,1,.2).normalize(),L.setFromAxisAngle(D,mt.spin*(mt.total-mt.life)),O.set(mt.size*kt,mt.size*.7*kt,mt.size*kt),k.compose(B,L,O),w.setMatrixAt(vt,k)}w.instanceMatrix.needsUpdate=!0}return{object:i,update(N,Ct){var ct,Ot,zt;if(!c||!x)return;const Tt=N.grass,Mt=((ct=N.config.grass)==null?void 0:ct.wind)??zo,vt=nm(Mt),mt=((Ot=Tt.wind)==null?void 0:Ot.time)??0,kt=((zt=Tt.wind)==null?void 0:zt.gust)??1;m.uWindTime.value=mt,m.uWindGust.value=kt,m.uWindDir.value.set(vt.dirX,vt.dirZ),m.uWindOmega.value.set(vt.omega1,vt.omega2),m.uWindAmp.value.set(vt.amp1,vt.amp2),m.uWindShade.value=vt.shadeAmount,m.uWindOn.value=Mt.enabled?1:0,Bt={enabled:Mt.enabled,time:mt,gust:kt,mode:"pivot"};const F=Math.min(r,Tt.blades.length),R=Math.min(.05,Math.max(0,Ct)),K=N.config.grass,pt=(K==null?void 0:K.regrowSec)??0,et=Math.min(1,Math.max(.05,(K==null?void 0:K.stumpRatio)??.34)),ot=t.segmentHeight,yt=Math.PI*2;x.instanceMatrix.clearUpdateRanges(),M&&M.clearUpdateRanges();let At=0,St=0,Yt=0,gt=0,Dt=0,$=0,W=0;for(let Lt=0;Lt<F;Lt++){const I=Tt.blades[Lt],_t=I.cut!==0?1:0,tt=I.yaw/yt,rt=gv(I.cut,pt,tt),Pt=Math.min(ot,I.height),wt=Pt*et,Kt=wt+(I.height-wt)*rt;if(Lt<ut&&($+=Kt/Math.max(1e-6,I.height),W+=1),rt>.001&&rt<1-.001&&(gt+=1,Dt+=rt),!(A[Lt]===1||Math.abs(I.bend-T[Lt])>1e-4||_t!==b[Lt]||Math.abs(rt-_[Lt])>.001)){I.bend>.02&&(St+=1),_t&&(Yt+=1);continue}_t&&!b[Lt]&&A[Lt]!==1&&(lt(I.x,I.y+Pt*.75,I.z,I.bendX||1,I.bendZ||0,I.width*1.5),lt(I.x,I.y+Pt+(I.height-Pt)*.5,I.z,I.bendX||1,I.bendZ||0,I.width*1.2)),D.set(Math.cos(I.yaw),0,-Math.sin(I.yaw)),C.setFromAxisAngle(D,I.lean),D.set(I.bendZ,0,-I.bendX),U.setFromAxisAngle(D,I.bend),L.copy(U).multiply(C),X.set(I.x,I.y,I.z);const ce=Math.min(ot,Kt),ne=Math.max(0,Kt-ot);B.set(0,ce*.5,0).applyQuaternion(L).add(X),O.set(I.width,ce,I.width),k.compose(B,L,O),x.setMatrixAt(Lt*2,k),ne<1e-4?x.setMatrixAt(Lt*2+1,ft):(B.set(0,ce+ne*.5,0).applyQuaternion(L).add(X),O.set(I.width*.84,ne,I.width*.84),k.compose(B,L,O),x.setMatrixAt(Lt*2+1,k)),Zt(I.tone,ht),rt>=1?it.copy(ht):it.copy(d).lerp(ht,rt),x.setColorAt(Lt*2,it),x.setColorAt(Lt*2+1,it),x.instanceMatrix.addUpdateRange(Lt*32,32),M&&M.addUpdateRange(Lt*6,6),T[Lt]=I.bend,b[Lt]=_t,_[Lt]=rt,A[Lt]=0,At+=1,I.bend>.02&&(St+=1),_t&&(Yt+=1)}At>0&&(x.instanceMatrix.needsUpdate=!0,M&&(M.needsUpdate=!0)),V(R),Rt=At,Z=St,at=Yt,dt=gt,st=gt>0?Dt/gt:1,nt=W>0?$/W:1},debug(){return{enabled:c,blades:s,patches:n.patches.length,instances:l,drawCalls:c?2:0,dirty:Rt,bent:Z,cut:at,debris:S.length,growing:dt,avgGrowth:st,sampleHeight:nt,wind:{...Bt}}},dispose(){p.dispose(),v.dispose(),g.dispose(),y.dispose(),i.clear()}}}const $R=.14,bo=1e-6;function vo(n,t,e){return n<t?t:n>e?e:n}function I0(n,t){const e=[-n,n,n,-n],i=[-n,-n,n,n],a=[],s=(c,h,f,d)=>{a.push(c[0],c[1],c[2],h[0],h[1],h[2],f[0],f[1],f[2]),a.push(c[0],c[1],c[2],f[0],f[1],f[2],d[0],d[1],d[2])},o=e.map((c,h)=>[c,0,i[h]]);s(o[0],o[3],o[2],o[1]);for(let c=0;c<4;c++){const h=(c+1)%4,f=[e[c],0,i[c]],d=[e[h],0,i[h]],u=[e[c],t[c],i[c]],p=[e[h],t[h],i[h]];s(f,d,p,u)}const r=e.map((c,h)=>[c,t[h],i[h]]);s(r[0],r[1],r[2],r[3]);const l=new an;return l.setAttribute("position",new Le(a,3)),a.length/3,l.addGroup(0,30,0),l.addGroup(30,6,1),l.computeVertexNormals(),l}function ZR(n,t,e,i){const a={x:t.x-n.x,y:t.y-n.y,z:t.z-n.z},s={x:i.x-e.x,y:i.y-e.y,z:i.z-e.z},o={x:n.x-e.x,y:n.y-e.y,z:n.z-e.z},r=(v,g)=>v.x*g.x+v.y*g.y+v.z*g.z,l=r(a,a),c=r(s,s),h=r(s,o);let f=0,d=0;if(l<=bo&&c<=bo)f=0,d=0;else if(l<=bo)f=0,d=vo(h/c,0,1);else{const v=r(a,o);if(c<=bo)d=0,f=vo(-v/l,0,1);else{const g=r(a,s),m=l*c-g*g;f=m!==0?vo((g*h-v*c)/m,0,1):0,d=(g*f+h)/c,d<0?(d=0,f=vo(-v/l,0,1)):d>1&&(d=1,f=vo((g-v)/l,0,1))}}const u={x:n.x+a.x*f,y:n.y+a.y*f,z:n.z+a.z*f},p={x:e.x+s.x*d,y:e.y+s.y*d,z:e.z+s.z*d};return{dist:Math.hypot(u.x-p.x,u.y-p.y,u.z-p.z),cq:p}}function qR(n,t,e,i,a){const s=n.radius,o=n.height,r=14,l=h=>{if(h<.6)return s*.95;if(h<.78){const d=(h-.6)/.18;return s*(.95+(.55-.95)*d)}if(h<.92)return s*.52;const f=(h-.92)/.08;return s*(.52+(.7-.52)*f)},c=o/r;for(let h=0;h<r;h++){const f=(h+.5)/r,d=l(f),u=new re(a,h>=r-2?i:e);u.scale.set(d*2,c,d*2),u.position.set(0,(h+.5)*c,0),t.add(u)}}function jR(n,t,e,i,a){const s=Wv(n.radius,n.standU,n.height,n.snx,n.sny,n.snz),o=new re(I0(n.radius,s),[e,i]);t.add(o);for(const r of n.arms){if(r.atU>n.standU+1e-4)continue;const l=r.atU*n.height,c=Math.abs(r.dx)>.5,h=new re(a,e);h.scale.set((c?r.outLen:r.rad)*2,r.rad*2,(c?r.rad:r.outLen)*2),h.position.set(r.dx*(n.radius+r.outLen/2),l,r.dz*(n.radius+r.outLen/2)),t.add(h);const f=new re(a,e);f.scale.set(r.rad*2,r.upLen*2,r.rad*2),f.position.set(r.dx*(n.radius+r.outLen),l+r.upLen/2,r.dz*(n.radius+r.outLen)),t.add(f)}}function KR(n,t,e,i,a){const s=n.height*.55,o=new re(a,e);o.scale.set(n.radius*1.6,s,n.radius*1.6),o.position.set(0,s/2,0),t.add(o);const r=new re(a,i),l=n.radius*2.2;r.scale.set(l*2,n.height*.22,l*2),r.position.set(0,s+n.height*.11,0),t.add(r)}function Tp(n,t,e){for(let i=n.standing.children.length-1;i>=0;i--){const a=n.standing.children[i];a instanceof re&&a.geometry!==e&&a.geometry.dispose(),n.standing.remove(a)}n.standingMesh=null,t.kind==="pole"||t.kind==="cactus"?t.kind==="pole"?(n.standingMesh=new re(I0(t.radius,[t.height,t.height,t.height,t.height]),[n.bodyMat,n.capMat]),n.standing.add(n.standingMesh)):jR(t,n.standing,n.bodyMat,n.capMat,e):t.kind==="jar"?t.broken===0&&qR(t,n.standing,n.bodyMat,n.capMat,e):t.kind==="button"&&KR(t,n.standing,n.bodyMat,n.capMat,e)}function Ap(n){return n.kind==="button"?"const":n.kind==="jar"?`${n.broken}`:`${n.standU}|${n.snx}|${n.sny}|${n.snz}`}function JR(n){const t=new Ee;t.name="destructibles";const e=[];let i=null,a=null;const s=new Vn(1,1,1);for(const d of n){const u=new ji({color:new te(d.color),side:$e}),p=new ji({color:new te(d.cutColor),side:$e}),v=new Ee;v.name=`standing-${d.id}`;const g=new Ee;g.name=`piece-${d.id}`,g.position.set(d.x,d.y,d.z),g.add(v);const m=new Ee;m.name=`frags-${d.id}`,t.add(g),t.add(m);const y={id:d.id,root:g,standing:v,standingMesh:null,fragGroup:m,fragViews:[],bodyMat:u,capMat:p,key:""};Tp(y,d,s),y.key=Ap(d),e.push(y)}function o(d){for(let u=0;u<e.length;u++){const p=e[u];let v;for(let y=0;y<d.length;y++)if(d[y].id===p.id){v=d[y];break}if(!v){p.root.visible=!1,p.fragGroup.visible=!1;continue}p.fragGroup.visible=!0;const g=Ap(v);g!==p.key&&(Tp(p,v,s),p.key=g),p.bodyMat.color.set(v.color),p.capMat.color.set(v.cutColor),p.root.position.set(v.x,v.y,v.z),p.standing.visible=!(v.kind==="jar"&&v.broken!==0);const m=v.fragments??[];for(;p.fragViews.length<m.length;){const y=new Ee;y.name=`frag-${v.id}-${p.fragViews.length}`;const x=new re(s,p.bodyMat);y.add(x),p.fragGroup.add(y),p.fragViews.push({group:y,trunk:x,parts:[]})}for(let y=0;y<p.fragViews.length;y++){const x=p.fragViews[y];if(y>=m.length){x.group.visible=!1;continue}const M=m[y];x.group.visible=!0,x.group.position.set(M.x,M.y,M.z),x.group.quaternion.set(M.qx,M.qy,M.qz,M.qw),x.trunk.scale.set(M.hx*2,M.hy*2,M.hz*2);const w=M.parts??[];for(;x.parts.length<w.length;){const S=new re(s,p.bodyMat);x.group.add(S),x.parts.push(S)}for(let S=0;S<x.parts.length;S++){const E=x.parts[S];if(S>=w.length){E.visible=!1;continue}const T=w[S];E.visible=!0,E.position.set(T.x,T.y,T.z),E.scale.set(T.hx*2,T.hy*2,T.hz*2)}}}}function r(d,u){const p=[],v=(g,m)=>{if(!g){m==="right"?i=null:a=null;return}const y={x:(g.base.x+g.tip.x)/2,y:(g.base.y+g.tip.y)/2,z:(g.base.z+g.tip.z)/2},x=m==="right"?i:a;if(m==="right"?i=y:a=y,!x)return;let M=g.tip.x-g.base.x,w=g.tip.y-g.base.y,S=g.tip.z-g.base.z;const E=y.x-x.x,T=y.y-x.y,b=y.z-x.z;Math.hypot(E,T,b)>.002&&(M=E,w=T,S=b);const A=Math.hypot(M,w,S);A>bo?(M/=A,w/=A,S/=A):(M=0,w=0,S=1);const k={x:0,y:0,z:0},L={x:0,y:0,z:0};for(let U=0;U<d.length;U++){const C=d[U];if(C.kind==="jar"&&C.broken!==0||(C.kind==="pole"||C.kind==="cactus")&&C.standU<=va)continue;const D=C.y+(C.kind==="pole"||C.kind==="cactus"?C.standU:1)*C.height,B=C.radius+(C.kind==="cactus"?.18:0);k.x=C.x,k.y=C.y,k.z=C.z,L.x=C.x,L.y=D,L.z=C.z;const O=ZR(g.base,g.tip,k,L);if(!(O.dist>B+$R)){p.push({id:C.id,x:O.cq.x,y:O.cq.y,z:O.cq.z,dx:M,dy:w,dz:S});break}}};return v(u.right,"right"),v(u.left,"left"),p}function l(){const d=[],u=[],p={};let v=0,g=0;for(const m of e){m.root.visible&&(u.push({id:m.id,x:m.root.position.x,y:m.root.position.y,z:m.root.position.z}),m.standing.visible&&(g+=1));for(const y of m.fragViews)if(y.group.visible){g+=1;for(const x of y.parts)x.visible&&(g+=1)}}for(const m of c)p[m.id]=(m.fragments??[]).length,m.broken!==0&&(v+=1,d.push({id:m.id,cutU:m.cutU,theta:m.theta,nx:m.nx,ny:m.ny,nz:m.nz}));return{count:e.length,broken:v,drawCalls:g,positions:u,fragments:p,cuts:d}}let c=n;const h=d=>{c=d,o(d)};function f(){for(const d of e){d.standing.traverse(u=>{u instanceof re&&u.geometry!==s&&u.geometry.dispose()});for(const u of d.fragViews)u.group.traverse(p=>{p instanceof re&&p.geometry!==s&&p.geometry.dispose()});d.bodyMat.dispose(),d.capMat.dispose()}s.dispose(),t.clear()}return h(n),{object:t,update:h,computeHits:r,debug:l,dispose:f}}function QR(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function tP(n,t,e,i){var Pn,On;const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new VA({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=Mm,o.setSize(a,s,!1),n.appendChild(o.domElement);let r=!1;const l=o.domElement;l.addEventListener("webglcontextlost",q=>{q.preventDefault(),r=!0},!1),l.addEventListener("webglcontextrestored",()=>{r=!1,o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.setSize(n.clientWidth||a,n.clientHeight||s,!1),o.shadowMap.needsUpdate=!0},!1);const c=new XA;c.background=new te("#12161d"),c.add(new A2(11061486,2764600,1.15));const h=new C2(16773852,1.5);h.position.set(9,18,11),h.castShadow=!0,h.shadow.mapSize.set(1024,1024);const f=h.shadow.camera;f.left=-20,f.right=20,f.top=20,f.bottom=-20,f.near=1,f.far=60,c.add(h);const d=[],u=new Ee;for(const q of t.boxes){const Nt=q.maxX-q.minX,Ut=q.maxY-q.minY,P=q.maxZ-q.minZ;let H=QR(q.kind,e);q.kind==="step"&&(H=new te(H).offsetHSL(0,0,q.maxY*.09).getStyle());const j=new ji({color:H,transparent:!1,opacity:1}),Q=new re(new Vn(Nt,Ut,P),j);Q.position.set((q.minX+q.maxX)/2,(q.minY+q.maxY)/2,(q.minZ+q.maxZ)/2),Q.castShadow=q.kind!=="ground",Q.receiveShadow=!0,Q.add(new jm(new c2(Q.geometry),new pd({color:10467020,transparent:!0,opacity:.32}))),u.add(Q),d.push(j)}c.add(u);const p=t.gridMeta.maxX-t.gridMeta.minX,v=new k2(p,p,4873328,3358797);v.position.y=.002,v.visible=e.showGrid,c.add(v);const g=SR(i,e);c.add(g.group);const m=YR(t.grass,e.grass,t.config.grass.wind);Ll(m.object,We.grass),c.add(m.object);const y=JR(t.destructibles);c.add(y.object);let x=[];const M=q=>C0((q==null?void 0:q.voxel)??e.voxel,q!=null&&q.colors?{...e.colors,...q.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance);let w="standard",S=M((Pn=e.bodyTypes)==null?void 0:Pn[w]);const E=OR(e.weaponTrail);Ll(E.object,We.trail),c.add(E.object);const T=new Ee,b=.9,_=new Ee;_.position.y=b,S.group.position.y=-b,_.add(S.group),T.add(_),c.add(T);const A=NR();let k=0;const L=((On=t.config.dummies.fighters)==null?void 0:On.moveSpeed)??t.config.dummies.moveSpeed;function U(q,Nt){const Ut=e.dummies.colors,P=Ut[Nt%Ut.length]??"#cccccc";let H;if(q.weapon){const j=e.dummies.fighterColors,Q=j&&j.length>0?j[(Nt-t.config.dummies.count)%j.length]:void 0;H=bR({voxel:e.voxel,colors:Q?{...e.colors,...Q}:e.colors,moveSpeed:L,orientation:e.orientation,gait:e.gait,mount:e.weaponMount,lean:e.lean,hurt:e.hurt,animation:e.animation,ik:e.ik,links:e.links,wrist:e.weaponWrist,balance:e.balance})}else{const j=tR(e.voxel,e.colors,P,q.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);H={group:j.group,update:(Q,Y)=>j.update(Q,Y),boneAtWorld:(Q,Y,Et)=>j.boneAtWorld(Q,Y,Et),dispose:()=>j.dispose()}}return H.group.traverse(j=>{j.userData.dummyId=q.id}),c.add(H.group),H}const C=t.dummies.map(U),D=C.map(q=>q.group),B=new L2,O=e.groundRing,X=e.voxel.bodyWidth,it=_p(X,O.playerRadiusFactor),ht=_p(X,O.dummyRadiusFactor),ft=X*O.thicknessFactor,Rt=O.arcDeg*Math.PI/180;let Z=0;const at=(q,Nt,Ut)=>Vp(t.boxes,q,Nt,Ut+.55,0),dt=Dl({radius:it,thickness:ft,arcRad:Rt,edgeFade:O.edgeFade,color:O.playerColor,opacity:O.playerOpacity,y:.028,renderOrder:We.ring});dt.mesh.name="player-ground-ring",c.add(dt.mesh);function st(q){const Nt=Dl({radius:ht,thickness:ft,arcRad:Rt,edgeFade:O.edgeFade,color:O.neutralColor,opacity:O.opacity,y:.022,renderOrder:We.ring});return Nt.mesh.name=`dummy-ground-ring-${q.id}`,c.add(Nt.mesh),Nt}function nt(q){const Nt=Dl({radius:ht*O.haloRadiusFactor,thickness:ft*O.haloThicknessFactor,arcRad:Rt,edgeFade:O.edgeFade,color:O.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:We.ringHalo});return Nt.mesh.name=`dummy-ground-halo-${q.id}`,c.add(Nt.mesh),Nt}function ut(q){const Nt=bp({radius:ht*O.warnRadiusFactor,thickness:ft*O.warnThicknessFactor,arcRad:Rt,edgeFade:.02,color:O.warnColor,y:.031,renderOrder:We.ringWarn});return Nt.mesh.name=`dummy-ground-warn-${q.id}`,c.add(Nt.mesh),Nt}const Bt=t.dummies.map(st),Zt=t.dummies.map(nt),lt=t.dummies.map(()=>0),V=t.dummies.map(()=>0),N=bp({radius:it*O.meterRadiusFactor,thickness:ft*O.meterThicknessFactor,arcRad:Rt,edgeFade:.06,color:O.meterColorCharge,y:.03,renderOrder:We.ringMeter});N.mesh.name="player-ground-meter",c.add(N.mesh);const Ct=t.dummies.map(ut),Tt=Sp({color:O.playerColor,y:.042,renderOrder:We.groundArea});Tt.group.name="player-landing-preview",c.add(Tt.group);const Mt=new te,vt=new te(O.playerColor),mt=new te(O.neutralColor),kt=new te(O.lowThreatColor),F=new te(O.highThreatColor),R=new te(O.meterColorCharge),K=new te(O.meterColorChannel),pt=new te(O.meterColorCooldown),et=new te(O.warnColor),ot=new Ee;c.add(ot);const yt=e.projectiles;function At(){const Nt=document.createElement("canvas");Nt.width=64,Nt.height=64;const Ut=Nt.getContext("2d");if(Ut){const H=Ut.createRadialGradient(32,32,0,32,32,32);H.addColorStop(0,"rgba(255,255,255,1)"),H.addColorStop(.28,"rgba(255,255,255,0.72)"),H.addColorStop(.62,"rgba(255,255,255,0.22)"),H.addColorStop(1,"rgba(255,255,255,0)"),Ut.fillStyle=H,Ut.fillRect(0,0,64,64)}const P=new Nh(Nt);return P.colorSpace=Fn,P}function St(){const Ut=document.createElement("canvas");Ut.width=2,Ut.height=64;const P=Ut.getContext("2d");if(P){const j=P.createLinearGradient(0,0,0,64);j.addColorStop(0,"rgba(255,255,255,0)"),j.addColorStop(.55,"rgba(255,255,255,0.35)"),j.addColorStop(1,"rgba(255,255,255,0.95)"),P.fillStyle=j,P.fillRect(0,0,2,64)}const H=new Nh(Ut);return H.colorSpace=Fn,H}const Yt=At(),gt=St(),Dt=new yn({color:12577023,transparent:!0,opacity:0,side:$e,depthWrite:!1}),$=new yn({color:14217983,transparent:!0,opacity:0,side:$e,depthWrite:!1,blending:Wi}),W=new Ee;W.position.set(0,.95,.72),ot.add(W);const ct=new Ee;ct.rotation.x=zR(e.camera.pitchDeg),W.add(ct);const Ot=new Mc(.78,yt.slashThickness,6,28,Math.PI*1.15),zt=new Ee,Lt=new re(Ot,Dt),I=new re(Ot,$);I.scale.setScalar(1.09),Ll(zt,We.slash),I.renderOrder=We.slash+1,zt.add(Lt,I),ct.add(zt);const _t=new Vn(yt.arrowWidth,yt.arrowWidth,yt.arrowLength),tt=new vd(yt.arrowHeadSize*.42,yt.arrowHeadSize,4);tt.rotateX(Math.PI/2);const rt=new Vn(yt.arrowWidth*2.6,yt.arrowWidth*.4,.1),Pt=new Oo(yt.arrowWidth*.45,yt.arrowWidth*1.3,yt.trailLength,6,1,!0);Pt.rotateX(-Math.PI/2),Pt.translate(0,0,-yt.trailLength/2);const wt=Array.from({length:10},()=>{const q=new Ee,Nt=new yn({color:yt.arrowColor,transparent:!0}),Ut=new yn({color:yt.arrowHeadColor,transparent:!0}),P=new Uh({map:Yt,color:yt.arrowColor,transparent:!0,opacity:.85,blending:Wi,depthWrite:!1}),H=new yn({color:yt.arrowTrailColor,map:gt,transparent:!0,opacity:0,blending:Wi,depthWrite:!1,side:$e}),j=new re(_t,Nt),Q=new re(tt,Ut);Q.position.z=yt.arrowLength/2+yt.arrowHeadSize*.42;const Y=new re(rt,Ut),Et=new re(rt,Ut);Y.position.z=-yt.arrowLength/2+.08,Et.position.z=Y.position.z,Et.rotation.z=Math.PI/2;const Ft=new qf(P);Ft.scale.setScalar(yt.arrowGlowSize),Ft.renderOrder=We.projectileGlow;const Vt=new re(Pt,H);return Vt.renderOrder=We.projectileTrail,j.renderOrder=We.projectile,Q.renderOrder=We.projectile,Y.renderOrder=We.projectile,Et.renderOrder=We.projectile,q.add(j,Q,Y,Et,Ft,Vt),q.visible=!1,c.add(q),{group:q,shaftMat:Nt,tipMat:Ut,glowMat:P,trailMat:H,glow:Ft,trail:Vt,arrowId:0,bone:null}}),Kt=new Md(1,0),he=new G(yt.boltShapeX,yt.boltShapeY,yt.boltShapeZ),ce=new yn({color:yt.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),ne=new Uh({map:Yt,color:yt.boltGlowColor,transparent:!0,opacity:.45,blending:Wi,depthWrite:!1}),Te=new yn({color:yt.boltGlowColor,map:gt,transparent:!0,opacity:yt.trailOpacity,blending:Wi,depthWrite:!1,side:$e}),Pe=new Oo(.5,.03,yt.boltTrailScale,6,1,!0);Pe.rotateX(-Math.PI/2),Pe.translate(0,0,-yt.boltTrailScale/2);const sn=Array.from({length:24},()=>{const q=new Ee,Nt=new re(Kt,ce);Nt.scale.copy(he);const Ut=new qf(ne);Ut.scale.setScalar(yt.boltGlowScale),Ut.renderOrder=We.projectileGlow;const P=new re(Pe,Te);return P.renderOrder=We.projectileTrail,Nt.renderOrder=We.projectile,q.add(Nt,Ut,P),q.visible=!1,c.add(q),{group:q,core:Nt}}),on=Array.from({length:6},()=>{const q=Sp({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:We.groundArea});return q.group.visible=!1,c.add(q.group),q}),Ae=wR(c,e,t,at),de=I2(e.camera,e.smartCamera,e.zoom,a/s),hn=t.character.position;de.update(hn.x,hn.y,hn.z,1,t.camera);function Nn(q){const Nt=q.dummies.length;for(;C.length<Nt;){const P=C.length,H=q.dummies[P],j=U(H,P);C.push(j),D.push(j.group),Bt.push(st(H)),Zt.push(nt(H)),Ct.push(ut(H)),lt.push(0),V.push(0)}let Ut=!1;for(;C.length>Nt;){Ut=!0;const P=C.pop();c.remove(P.group),P.dispose(),D.pop();const H=Bt.pop();c.remove(H.mesh),H.dispose();const j=Zt.pop();c.remove(j.mesh),j.dispose();const Q=Ct.pop();c.remove(Q.mesh),Q.dispose(),lt.pop(),V.pop()}if(Ut)for(let P=0;P<Nt;P++){const H=q.dummies[P].id;C[P].group.userData.dummyId!==H&&C[P].group.traverse(j=>{j.userData.dummyId=H})}}function dn(q,Nt){if(D.length===0)return 0;const Ut=o.domElement.getBoundingClientRect(),P=new Gt((q-Ut.left)/Ut.width*2-1,-((Nt-Ut.top)/Ut.height)*2+1);B.setFromCamera(P,de.camera);const H=B.intersectObjects(D,!0);for(const j of H){const Q=j.object.userData.dummyId;if(Q&&Q>0)return Q}return 0}function Rn(q,Nt,Ut){const P=o.domElement.getBoundingClientRect(),H=new G(q,Nt,Ut).project(de.camera);return{x:P.left+(H.x*.5+.5)*P.width,y:P.top+(-H.y*.5+.5)*P.height}}let _n=!1;return{balanceDebug(){return S.balanceDebug()},spineDebug(){return S.spineDebug()},gaitDebug(){return S.gaitDebug()},trailDebug(){return E.debug()},stretchDebug(){const q=S.stretch();return{arm:q.arm,leg:q.leg,torso:q.torso,impact:q.impact}},swingDebug(){return S.swingDebug()},stanceDebug(){return S.stanceDebug()},bladeWorld(){return S.weaponBlade()},bladesWorld(){return S.bladesWorld()},slamDebug(){return Ae.slamDebug()},yawDebug(){var q;return{target:k,shown:A.value,tauMs:((q=e.renderInterp)==null?void 0:q.yawSmoothMs)??0}},grassDebug(){return m.debug()},breakHits(){return x},destructibleDebug(){return y.debug()},fxDebug(){var q,Nt;return{boxOpaque:d.every(Ut=>!Ut.transparent),boxCount:d.length,orders:{ring:dt.mesh.renderOrder,groundFx:Ae.groundOrder(),trail:E.object.renderOrder,slash:zt.renderOrder,projectile:((Nt=(q=wt[0])==null?void 0:q.group.children[0])==null?void 0:Nt.renderOrder)??-1}}},renderPose(){return{x:T.position.x,y:T.position.y,z:T.position.z,bodyYaw:T.rotation.y}},projectPoint(q,Nt,Ut){return Rn(q,Nt,Ut)},setClipT(q){S.setClipT(q)},weaponDebug(){return S.weaponDebug()},gripDebug(){return S.gripDebug()},render(q,Nt){var xe;if(r)return;Nn(q);const Ut=q.character,P=q.combat,H=e.hitstop.enabled&&q.combat.hitstop>0,j=Nt*Math.max(0,Math.min(4,P.warp??1));if(H&&!_n){const jt=Math.max(0,q.combat.hitstop),It=Math.max(0,Math.min(1,jt/.1));de.addShake(.34+It*.48);let $t=null;for(let ke=0;ke<q.events.length;ke++){const le=q.events[ke];if(le.type==="hit"){$t=le;break}}$t&&de.addKick($t.x-Ut.position.x,$t.z-Ut.position.z,.03+It*.05)}_n=H;for(let jt=0;jt<q.events.length;jt++){const It=q.events[jt];if(It.type!=="notify")continue;const $t=Number.isFinite(It.value)?It.value:0;if(It.name==="blade-air"){const ke=Math.max(0,Math.min(1,$t));E.pulse((P.weapon==="greatsword"?.9:.55)*(.4+.6*ke))}}T.position.set(Ut.position.x,Ut.position.y,Ut.position.z),k=Ut.bodyYaw,T.rotation.y=A.update(k,Nt,((xe=e.renderInterp)==null?void 0:xe.yawSmoothMs)??0);const Q=q.dash.phase==="active"&&q.dash.kind==="roll",Y=Q&&q.dash.duration>0?Math.min(1,1-q.dash.timer/q.dash.duration):0;if(_.rotation.x=Q?Y*Math.PI*2:0,_.position.y=b-(Q?.2*Math.sin(Math.PI*Y):0),j>0&&S.update(Ut,P,q.playerHurt,j,q.abilities.channeling,q.time,q.playerLink,q.turnInPlace),E.update(j,j>0?S.weaponBlade():null,j>0&&(P.phase==="active"||q.playerLink.phase==="active"||Q&&q.dash.duration>0)),j>0)for(let jt=0;jt<C.length;jt++)q.dummies[jt]&&C[jt].update(q.dummies[jt],j,q.time);const Et=de.camera.position,Ft=Math.atan2(Et.x-Ut.position.x,Et.z-Ut.position.z),Vt=q.config.gaze.hurtHoldSec,Xt=q.time-q.playerHurt.lastAt,se=Vt>0&&Xt>=0&&Xt<Vt?1-Xt/Vt:0,ee=AR(q.gaze.active,q.gaze.threat,se,q.time,O);RR(Mt,vt,kt,F,ee.level),Z=IR(Ut.grounded,Ut.position.y,Z),dt.mesh.position.set(Ut.position.x,Z+.028,Ut.position.z),dt.update(ee.arcRad,ee.opacity,ee.scale,Mt,Ft);const qt=q.config.abilities.arcane,fe=Math.max(1,Math.floor(qt.waves)),ie=Math.max(1e-4,qt.waveInterval),ve=LR({charging:P.charging,charge:P.charge,channeling:q.abilities.channeling,fireTimer:q.abilities.fireTimer,fireInterval:ie,channelProgress:q.abilities.channeling?(q.abilities.waveIndex+(1-Math.min(1,Math.max(0,q.abilities.fireTimer/ie))))/fe:0,arcaneCooldown:q.abilities.cooldown,arcaneCooldownMax:qt.cooldown,dashCooldown:q.dash.cooldown,dashCooldownMax:q.dash.kind==="blink"?q.config.dash.blinkCooldown:q.config.dash.rollCooldown});N.mesh.position.set(Ut.position.x,Ut.position.y+.03,Ut.position.z),N.set(ve.ratio,ve.source==="none"?0:O.meterOpacity,ve.source==="charge"?R:ve.source==="channel"?K:pt,Ft);const Ue=q.playerLink,pe=Ue.weapon?q.config.links.moves[Ue.weapon]:void 0,Wt=kR(Ue.phase,Ut.position.x,Ut.position.z,Ue.facing,Ue.travel,(pe==null?void 0:pe.hit.radius)??.9);Tt.set(Wt.x,Wt.z,at(Wt.x,Wt.z,Ut.position.y)+.042,Wt.radius,Wt.active?O.landingOpacity:0,q.time);for(let jt=0;jt<Bt.length;jt++){const It=q.dummies[jt],$t=Bt[jt],ke=Zt[jt],le=Ct[jt];if(!It){$t.mesh.visible=!1,ke.mesh.visible=!1,le.mesh.visible=!1;continue}const ue=q.targeting.hasTarget&&q.targeting.targetId===It.id;if(hv(q,It)){const xi=dv(q,It);Mt.copy(kt).lerp(F,xi)}else Mt.copy(mt);const be=CR(It.attackPhase,It.attackPhaseTimer,q.config.dummies.attackWindup);be.active?(Mt.lerp(et,.5*be.urgency),le.mesh.position.set(It.position.x,It.position.y+.031,It.position.z),le.set(be.ratio,O.warnOpacity*(.65+.35*be.urgency),et,Ft)):le.set(0,0,et,Ft);const Be=ue?1:0,gn=Be>lt[jt]?O.haloFadeInSec:O.haloFadeOutSec;lt[jt]=wp(lt[jt],Be,Nt,gn);const rn=lt[jt],oi=1+.02*rn*Math.sin(q.time*2.2+It.id),Ki=O.arcDeg+(O.selectedArcDeg-O.arcDeg)*rn;$t.mesh.position.set(It.position.x,It.position.y+.022,It.position.z),$t.update(Ki*Math.PI/180,O.opacity+(O.selectedOpacity-O.opacity)*rn,1+(O.selectedScale-1)*rn*oi,Mt,Ft,1+(O.selectedThicknessScale-1)*rn),V[jt]=wp(V[jt],Be,Nt,Be>V[jt]?O.haloFadeInSec:O.haloFadeOutSec);const Ji=V[jt];ke.mesh.position.set(It.position.x,It.position.y+.019,It.position.z),ke.update(Ki*Math.PI/180,O.haloOpacity*Ji*(.88+.12*Math.sin(q.time*2.2+It.id)),O.selectedScale*(.94+.06*Ji)*oi,Mt,Ft)}ot.position.set(Ut.position.x,Ut.position.y,Ut.position.z),ot.rotation.y=P.phase!=="idle"?P.attackFacing:Ut.bodyYaw,Ae.update(q,Nt,jt=>de.addShake(jt));const mn=yt.slashEnabled&&P.phase==="active"&&P.comboIndex>=3;Dt.opacity=mn?.7:0,$.opacity=mn?yt.slashGlowOpacity:0,mn&&(zt.rotation.z=-1.2+P.attackProgress*3.2,zt.scale.setScalar(.9+P.comboIndex*.13));for(let jt=0;jt<sn.length;jt++){const It=q.abilities.projectiles[jt],$t=sn[jt];$t.group.visible=!!It,It&&($t.group.position.set(It.x,It.y,It.z),$t.group.scale.setScalar(It.radius),$t.group.rotation.set(0,Math.atan2(It.dirX,It.dirZ),0))}for(let jt=0;jt<on.length;jt++){const It=q.abilities.rings[jt],$t=on[jt];if(!It){$t.group.visible=!1;continue}const ke=Math.max(0,Math.min(1,It.life/Math.max(It.duration,1e-6))),le=DR(Math.max(0,It.duration-It.life),O.areaExpandSec);$t.set(It.x,It.z,at(It.x,It.z,Ut.position.y)+.045,It.radius*le.scale,O.areaOpacity*(.35+.65*ke)*le.alpha,q.time)}for(let jt=0;jt<wt.length;jt++){const It=q.arrows[jt],$t=wt[jt];if(!It){$t.group.visible=!1,$t.bone&&(c.attach($t.group),$t.bone=null),$t.arrowId=0;continue}const ke=It.stuck&&It.stuckDummy>=0;if($t.arrowId!==It.id){if($t.bone&&(c.attach($t.group),$t.bone=null),$t.arrowId=It.id,$t.group.position.set(It.x,It.y,It.z),$t.group.rotation.set(It.pitch,It.yaw,0,"YXZ"),ke){const ue=C[It.stuckDummy],be=ue?ue.boneAtWorld(It.x,It.y,It.z):null;be&&(be.node.attach($t.group),$t.bone=be.node)}}else $t.bone||($t.group.position.set(It.x,It.y,It.z),$t.group.rotation.set(It.pitch,It.yaw,0,"YXZ"));$t.group.visible=!0;const le=It.stuck?Math.min(1,It.rest/.6):1;$t.shaftMat.opacity=le,$t.tipMat.opacity=le,$t.glowMat.opacity=(It.stuck?.28:.85)*le,$t.trailMat.opacity=It.stuck?0:yt.trailOpacity*le,$t.trail.visible=!It.stuck}if(m.update(q,Nt),y.update(q.destructibles),P.phase==="active"||q.playerLink.phase==="active"){const jt=y.computeHits(q.destructibles,S.bladesWorld());for(let It=0;It<jt.length;It++){let $t=!1;for(let ke=0;ke<x.length;ke++)if(x[ke].id===jt[It].id){$t=!0;break}$t||x.push(jt[It])}}else x=[];de.update(Ut.position.x,Ut.position.y,Ut.position.z,Nt,q.camera),o.render(c,de.camera)},resize(){const q=Math.max(1,n.clientWidth),Nt=Math.max(1,n.clientHeight);o.setSize(q,Nt,!1),de.resize(q/Nt)},getGroundBasis(){return de.getGroundBasis()},setCollidersVisible(q){for(const Nt of d)Nt.opacity=q?.3:1,Nt.wireframe=q,Nt.transparent=q,Nt.depthWrite=!q,Nt.needsUpdate=!0},setGridVisible(q){v.visible=q},setLabVisible(q){g.setVisible(q)},setLabLabelsVisible(q){g.setLabelsVisible(q)},snapCamera(q,Nt,Ut){de.snap(q,Nt,Ut)},setZoom(q){de.setZoom(q)},setBodyType(q){var Ut;const Nt=(Ut=e.bodyTypes)==null?void 0:Ut[q];return!Nt||q===w||(_.remove(S.group),S.dispose(),S=M(Nt),S.group.position.y=-b,_.add(S.group),E.reset(),w=q,t.config.characterHeight=Nt.height,Nt.radius!==void 0&&(t.config.characterRadius=Nt.radius)),w},bodyTypes(){return{id:w,ids:Object.keys(e.bodyTypes??{})}},pickDummy:dn,dummyRenderCount:()=>C.length,projectToScreen:Rn,dummyRigDebug(q){const Nt=C[q-1];return Nt!=null&&Nt.debug?Nt.debug():null},diagnostics(){const q=D0(e.camera.pitchDeg),Nt=FR(q,ot.rotation.y);return{lean:S.lean(),slashNormal:Nt,arrowForward:S.arrowDirection(),gait:{hipYaw:S.hipYaw(),gaitYaw:S.gaitYaw()},attackBlend:S.attackBlend(),attackWeights:S.attackWeights(),landing:S.landing(),hurt:S.hurt(),ik:S.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:_.rotation.x,activeRings:Ae.activeDash(),lastKind:Ae.dashKind()},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...de.smart(),shake:de.shakeLevel(),kick:de.kickLevel(),kickCount:de.kickCount()}}},dispose(){S.dispose(),g.dispose(),m.dispose(),y.dispose();for(const q of C)q.dispose();dt.dispose();for(const q of Bt)q.dispose();for(const q of Zt)q.dispose();N.dispose(),E.dispose();for(const q of Ct)q.dispose();Tt.dispose(),Ot.dispose(),Dt.dispose(),$.dispose(),Kt.dispose(),ce.dispose(),ne.dispose(),Te.dispose(),Pe.dispose();for(const q of on)q.dispose();_t.dispose(),tt.dispose(),rt.dispose(),Pt.dispose();for(const q of wt)q.shaftMat.dispose(),q.tipMat.dispose(),q.glowMat.dispose(),q.trailMat.dispose();Yt.dispose(),gt.dispose(),Ae.dispose(),u.traverse(q=>{q instanceof re&&q.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function eP(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function nP(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function iP(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=y=>e.querySelector(`#${y}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,p=0;function v(){const y=n.status();a.textContent=y.enabled?`已记录 ${y.durationS.toFixed(1)}s · ${y.frames} 帧 · 事件 ${y.events} · 异常 ${y.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=y.enabled?"暂停记录":"继续记录"}function g(y){d=y,e.hidden=!y,y?v():s.hidden=!0}function m(y){o.textContent=y,window.clearTimeout(p),p=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),g(!d)}),h.addEventListener("click",()=>g(!1)),f.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const y=n.summary();eP(y).then(x=>{x?(m("已复制 ✓"),s.hidden=!0):(s.value=y,s.hidden=!1,s.focus(),s.select(),m("请长按全选复制"))})}),r.addEventListener("click",()=>{const y=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);nP(`harness-${y.meta.version}-${x}.json`,JSON.stringify(y)),m("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,v(),m("已清空")}),c.addEventListener("click",()=>{u=!u,n.setEnabled(u),v()}),{tick(){const y=n.status();t==null||t.classList.toggle("is-alert",y.alert),d&&v()},isOpen:()=>d,close:()=>g(!1)}}const aP={intents:{...Pp},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function sP(){var lt;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Qv(X_,Ns),i=tP(n,e,xn,Ns.stations),a=sy(e),s=Ab(t),o=Rb(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.69 · 11-10 06:48 · 诊断");const l=V=>String(V).padStart(2,"0"),c=new Date,h=zy({meta:{version:"v0.9.69",buildTime:"11-10 06:48",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=iP(h,r),d=wb({deadZone:()=>xn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0,phaseSource:()=>i.gaitDebug().phase});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:xn.showColliders,showGrid:xn.showGrid,showLab:xn.lab.enabled,showLabLabels:xn.lab.showLabels};let p=1,v=!1;const g=wy({maxRadiusPx:()=>xn.joystick.maxRadiusPx,deadZone:xn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>xn.zoom}),m=Array.from(document.querySelectorAll(".wp[data-weapon]"));let y=e.combat.weapon;function x(V){if(V===y)return;y=V;const N=xa.indexOf(V)+1;for(const Ct of m)Ct.classList.toggle("is-active",Number(Ct.dataset.weapon)===N);E.refreshWeapon()}let M=aP,w=0;const S=()=>{p=1,i.setZoom(1)},E=ib(e,xn,u,{singleStep:()=>a.singleStep(M.intents),reset:()=>{p=1,a.singleStep({...Pp,resetPressed:!0})},resetZoom:S,onToggleColliders:V=>i.setCollidersVisible(V),onToggleGrid:V=>i.setGridVisible(V),onToggleLab:V=>i.setLabVisible(V),onToggleLabLabels:V=>i.setLabLabelsVisible(V),setFighterMode:V=>{for(const N of e.dummies)N.weapon&&(N.mode=V,N.attackPhase="idle",N.attackPhaseTimer=0,N.attackProgress=0,N.attackCooldown=0,N.combat&&(N.combat.phase="idle",N.combat.attackProgress=0,N.combat.comboIndex=0))}}),T=ob({stations:Xi.stations,plots:Du,world:e,view:i,onResetZoom:S,onPlotTest:V=>{Xl(e);const N=Zx(e,V);return C(`已在「${V.name}」生成 ${N} 人 · 点「清除测试单位」回基线`),N},onClearTestUnits:()=>{const V=Xl(e);return C(V>0?`已清除 ${V} 个测试单位`:"当前没有测试单位"),V}});o.register({motion:d,debug:E.gui}),window.addEventListener("resize",()=>i.resize());const b=i.bodyTypes().ids,_=document.getElementById("body-toggle"),A=V=>{var N,Ct;return((Ct=(N=xn.bodyTypes)==null?void 0:N[V])==null?void 0:Ct.name)??V},k=()=>{if(!_)return;const V=i.bodyTypes().id;_.textContent=`体型 ${A(V)}`,_.setAttribute("aria-label",`切换体型（当前：${A(V)}，快捷键 B）`)},L=document.createElement("div");L.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(L);let U=0;const C=V=>{L.textContent=V,L.style.opacity="1",window.clearTimeout(U),U=window.setTimeout(()=>{L.style.opacity="0"},1600)},D=()=>{if(b.length<2){C("只有一个体型预设");return}const V=i.bodyTypes().id,N=Math.max(0,b.indexOf(V)),Ct=i.setBodyType(b[(N+1)%b.length]);k(),C(`体型：${A(Ct)}（B / 顶部胶囊切换）`)};k(),_==null||_.addEventListener("click",D);const B=document.getElementById("wind-toggle"),O=()=>{var V;return(V=e.config.grass)==null?void 0:V.wind},X=()=>{var N;if(!B)return;const V=!!((N=O())!=null&&N.enabled);B.textContent=`风：${V?"开":"关"}`,B.classList.toggle("is-off",!V),B.setAttribute("aria-label",`${V?"关闭":"开启"}风吹麦浪（当前${V?"开启":"关闭"}，快捷键 G）`)},it=()=>{const V=O();if(!V){C("本场景未启用草块");return}V.enabled=!V.enabled,X(),C(`风吹麦浪：${V.enabled?"开":"关"}（G 切换）`)};X(),B==null||B.addEventListener("click",it),window.addEventListener("keydown",V=>{V.repeat||(V.code==="KeyB"?D():V.code==="KeyG"&&it())}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:xn,debug:u,getUserZoom:()=>p,getGestures:()=>M.gestures,getLastGesture:()=>M.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),dummyRigDebug:V=>i.dummyRigDebug(V),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:st,applied:nt,enabled:Z,skip:ut}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),fxDebug:()=>i.fxDebug(),grassDebug:()=>i.grassDebug(),breakDebug:()=>({version:"v0.9.69",count:e.destructibles.length,broken:e.destructibles.filter(V=>V.broken!==0).length,cuts:e.destructibles.map(V=>({id:V.id,kind:V.kind,broken:V.broken,cutU:V.cutU,theta:V.theta,nx:V.nx,ny:V.ny,nz:V.nz,standU:V.standU,fragments:V.fragments.length,height:V.height})),rendered:i.destructibleDebug()}),breakTest:(V,N,Ct=1,Tt=0,Mt=0)=>jv(e,V,N,Ct,Tt,Mt),resetBreaks:()=>(dm(e),e.destructibles.length),breakHits:()=>i.breakHits(),windDebug:()=>{var N;const V=i.grassDebug().wind;return{configured:!!((N=O())!=null&&N.enabled),rendered:V.enabled,time:V.time,gust:V.gust}},setWind:V=>{const N=O();return N?(N.enabled=!!V,X(),N.enabled):!1},setRenderInterp:V=>(Z=!!V,Z),renderHold:()=>v,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(V,N,Ct)=>i.projectPoint(V,N,Ct),setBodyType:V=>{const N=i.setBodyType(V);return k(),N},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var V;return Object.keys(((V=xn.animation.swing)==null?void 0:V.clips)??{})},preview:V=>{const N=e.combat,Ct={...N};N.weapon=V.weapon,N.phase="active",N.comboIndex=Math.max(1,Math.min(3,Math.floor(V.comboIndex))),N.attackProgress=Math.max(0,Math.min(1,V.progress)),N.attackFacing=e.character.bodyYaw,i.setClipT(typeof V.t=="number"?V.t:null);const Tt=Math.max(1,Math.min(30,Math.floor(V.warm??12)));v=!0;for(let Mt=0;Mt<Tt;Mt++)i.render(e,1/60);return i.setClipT(null),Object.assign(N,Ct),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:V=>{e.character.bodyYaw=V},zoom:V=>{p=Cu(V,1,xn.zoom.min,xn.zoom.max),i.setZoom(p)},release:()=>{v=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),plotDebug:()=>({version:"v0.9.69",count:Xi.plots.length,diagnostics:Xi.diagnostics,testUnits:qx(e),dummies:e.dummies.length,rendered:i.dummyRenderCount(),plots:Xi.plots.map(V=>({id:V.id,index:V.index,placement:V.placement,slot:V.slot,centerX:V.centerX,centerZ:V.centerZ,spawnX:V.station.spawnX,spawnZ:V.station.spawnZ,hasTest:!!V.testSpawn}))}),spawnAt:V=>T.spawnAt(V),clearSpawned:()=>T.clearSpawned(),lab:{stations:Xi.stations,plots:Du,goto:V=>T.goto(V),current:()=>T.current(),recall:()=>T.recall(),spawnAt:V=>T.spawnAt(V),clearSpawned:()=>T.clearSpawned()}};let ht=performance.now(),ft=60,Rt=0,Z=((lt=xn.renderInterp)==null?void 0:lt.enabled)??!0,at=Pu(e),dt=null,st=1,nt=!1,ut="";function Bt(V){const N=Z&&!u.paused&&u.timeScale>0;if(nt=!1,ut="",!N)return ut="off",st=1,e;if(!dt)return ut="noprev",st=1,e;if(!ry(dt,at))return ut="key",st=1,e;const Ct=a.alpha;return st=Ct,Ct>=.999?(ut="alpha",e):(nt=!0,ly(e,cy(dt,at,Ct)))}function Zt(V){const N=Math.min((V-ht)/1e3,.1);ht=V,N>0&&(ft=ft*.9+1/N*.1);const Ct=g.sample();Ct.intents.resetPressed&&(p=1),p=Cu(p,Ct.zoomScale,xn.zoom.min,xn.zoom.max),i.setZoom(p);let Tt=Ct.intents.dummyClickId;if(Ct.tap){const mt=i.pickDummy(Ct.tap.x,Ct.tap.y);mt>0&&(Tt=mt)}Tt>0&&(w=Tt),M={...Ct,intents:{...Ct.intents,dummyClickId:w,breakHits:i.breakHits()}};const Mt=a.frame(N,M.intents,u.timeScale,u.paused,()=>{const mt=e.events;for(let kt=0;kt<mt.length;kt++)h.event(mt[kt],e.time);dt=at,at=Pu(e)});Mt>0&&(w=0),h.sample(e,M,N*1e3,Mt);for(const mt of M.gestures)h.gesture(mt);V-Rt>250&&(Rt=V,f.tick()),x(e.combat.weapon),v||i.render(Bt(),N),T.tick(),d.update(e,M,i.getGroundBasis());const vt=i.diagnostics();s.update(e,ft,Mt,M,u,{attackBlend:vt.attackBlend,attackWeights:vt.attackWeights,landing:vt.landing,hurt:vt.hurt,ik:vt.ik,zoom:vt.camera.zoom},o.hudCompact()),requestAnimationFrame(Zt)}requestAnimationFrame(Zt)}sP();

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const Li=["sword-shield","dual-swords","greatsword","staff","bow"],Tr=["wander","follow","keep-distance","attack","idle"],vd={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},Ka=1e-6;function Vs(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Ka?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>Ka?Math.atan2(t.moveX,t.moveZ):n.character.facing}function uf(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Ka){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>Ka)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Sn=1e-6,Mo=Math.PI/180,Cc=-1e9;function _d(){return{type:"none",lastAt:Cc,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function So(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function El(n,t,e,i,s){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=s,n.knockX=0,n.knockZ=0}function Pc(n,t,e){const i=e.duration>0?e.duration:Dc(n,e.type);if(t.kind==="player"){const a=n.playerHurt;if(El(a,e.type,i,e.dirX,e.dirZ),a.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Sn){const r=e.knockback*n.config.hits.knockbackDecay;a.knockX=e.dirX*r,a.knockZ=e.dirZ*r}So(n,"player-hurt",e.sourceId??0,n.character.position);return}const s=n.dummies[t.index];if(s){if(El(s.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Sn){const a=e.knockback*n.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}n.hitCount+=1,So(n,"hit",s.id,s.position)}}function Lc(n,t,e){Pc(n,{kind:"dummy",index:t},e)}function ff(n,t){const e=[n.playerHurt];for(const s of n.dummies)e.push(s.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=i,s.knockZ*=i,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function Dc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function pf(n){const t=n.combat,e=n.config.hits,i=n.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Mo),r=Math.sin(t.attackFacing),o=Math.cos(t.attackFacing),c=n.config.dummies.radius,l=n.config.targeting.idealRange;for(const h of n.dummies){const f=h.position.x-i.x,d=h.position.z-i.z,u=Math.hypot(f,d);if(u>s+c)continue;const g=u>Sn?f/u:r,v=u>Sn?d/u:o;if(u>Sn&&(f*r+d*o)/u<a)continue;let m="light";t.weapon==="greatsword"?m="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(m="heavy");const p=e.knockback[t.weapon]??0;let x=u;p>0&&(x=Math.max(u+p,l));const _=Math.max(0,x-u);Lc(n,n.dummies.indexOf(h),{type:m,duration:Dc(n,m),dirX:g,dirZ:v,knockback:_})}}function mf(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const s=i.weapon===""?void 0:e.moves[i.weapon];if(!s||!s.enabled||!n.modules.hits||!n.modules.dummies)return;const a=s.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(a.pulseInterval,0);const r=n.character.position,o=i.fromX,c=i.fromZ,l=r.x,h=r.z,f=l-o,d=h-c,u=f*f+d*d,g=Math.sin(i.facing),v=Math.cos(i.facing),m=Math.cos(wl(a.arcDeg,0,180)*Mo),p=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const _=n.dummies[x];if(i.hitIds.indexOf(_.id)>=0)continue;const y=u>Sn?wl(((_.position.x-o)*f+(_.position.z-c)*d)/u,0,1):0,k=o+f*y,b=c+d*y,A=Math.hypot(_.position.x-k,_.position.z-b);let T=!1;if(a.shape==="circle")T=A<=a.radius+p;else if(a.shape==="capsule")T=A<=Math.max(a.radius,a.width)+p;else{const B=_.position.x-l,D=_.position.z-h,L=Math.hypot(B,D),X=L>Sn?(B*g+D*v)/L>=m:!0;T=L<=a.radius+p&&X||A<=a.width+p}if(!T)continue;const w=_.position.x-o,M=_.position.z-c,P=Math.hypot(w,M);if(P>Sn&&(w*g+M*v)/P<Math.cos(Math.max(a.arcDeg,90)*Mo))continue;const F=P>Sn?w/P:g,N=P>Sn?M/P:v;Pc(n,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:F,dirZ:N,knockback:a.knockback}),i.hitIds.push(_.id),So(n,"link-hit",_.id,_.position)}}function gf(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const s=n.dummies[i.value-1];if(!s)continue;const a=e.x-s.position.x,r=e.z-s.position.z,o=Math.hypot(a,r);if(o>t.dummyReach)continue;const c=o>Sn?a/o:0,l=o>Sn?r/o:1;Pc(n,{kind:"player"},{type:"light",duration:Dc(n,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function xf(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&pf(n),mf(n,t),gf(n)}function wl(n,t,e){return n<t?t:n>e?e:n}const Ha=1e-6;function Xs(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function vf(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function yd(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function _f(n){const t=n.abilities,e=n.config.abilities.arcane,i=n.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),r=.55,o={id:++t.nextId,x:i.x+s*r,y:i.y+1,z:i.z+a*r,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(o),t.volleyId+=1,Xs(n,"projectile-fire",t.volleyId,o)}function yf(n,t,e){const i=n.abilities,s=n.config.abilities.arcane,a=n.dash.phase==="active",r=n.playerLink;if(n.combat.weapon==="staff"&&e.attackHeld&&!a&&r.phase==="idle"&&!r.consumedAttack){i.channeling||(i.channeling=!0,i.fireTimer=0,Xs(n,"channel-start",0,n.character.position)),i.channelYaw=Vs(n,e),i.fireTimer-=t;let c=0;for(;i.fireTimer<=0&&c++<8;)i.fireTimer+=Math.max(s.fireInterval,Ha),_f(n)}else i.channeling&&(i.channeling=!1,Xs(n,"channel-end",0,n.character.position))}function Mf(n,t){const e=n.config.abilities.ring,i=n.dash.phase==="active";if(n.combat.weapon!=="staff"||!t.skill2Pressed||i)return;const s=n.character.position,a={id:++n.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};n.abilities.rings.push(a),Xs(n,"ring-place",a.id,s)}function Sf(n,t){const e=n.abilities,i=n.config.abilities.arcane,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,r=[];for(const o of e.projectiles){if(o.x+=o.dirX*o.speed*t,o.z+=o.dirZ*o.speed*t,o.life-=t,o.life<=0)continue;let c=!1;if(a)for(let l=0;l<n.dummies.length;l++){const h=n.dummies[l],f=h.position.x-o.x,d=h.position.z-o.z,u=o.radius+s;if(!(f*f+d*d>u*u)){Lc(n,l,{type:i.hurtType,duration:i.hurtDuration,dirX:o.dirX,dirZ:o.dirZ,knockback:i.knockback}),c=!0;break}}c||r.push(o)}e.projectiles=r}function bf(n,t){const e=n.abilities,i=n.config.abilities.ring,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,r=[];for(const o of e.rings){o.life-=t,o.pulseTimer-=t;let c=0;for(;o.pulseTimer<=0&&c++<8;){if(o.pulseTimer+=Math.max(i.pulseInterval,Ha),a)for(let l=0;l<n.dummies.length;l++){const h=n.dummies[l],f=h.position.x-o.x,d=h.position.z-o.z,u=o.radius+s;if(f*f+d*d>u*u)continue;const g=Math.hypot(f,d),v=g>Ha?f/g:0,m=g>Ha?d/g:1;Lc(n,l,{type:"heavy",duration:i.stun,dirX:v,dirZ:m,knockback:i.knockback})}Xs(n,"ring-pulse",o.id,{x:o.x,y:0,z:o.z})}o.life>0&&r.push(o)}e.rings=r}function Ef(n,t,e){yf(n,t,e),Mf(n,e),Sf(n,t),bf(n,t)}function Rr(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Al=1e-6;function Tl(n,t,e){return n<t?t:n>e?e:n}function Md(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Sd(n){const t=n.camera,e=Md();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function wf(n){const t=n.camera,e=n.config.camera,i=n.character.position;let s=0,a=0,r=0,o=0;for(const l of n.dummies){const h=l.position.x-i.x,f=l.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=Tl((e.radius-d)/Math.max(Al,e.radius-e.nearDistance),0,1);let g=u*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(g+=e.attackBoost*u),s+=g,a+=l.position.x*g,r+=l.position.z*g,o+=1}const c=s<=0?0:Tl(s/(s+Math.max(Al,e.saturation)),0,1);if(t.threat=c,t.threatCount=o,s<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,h=r/s;t.centroidX=l,t.centroidZ=h;let f=(l-i.x)*e.framingBias*c,d=(h-i.z)*e.framingBias*c;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Af(n){const t=[],e=n.ground.size;t.push(Oi("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Oi(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const s=i.openingWidth/2,a=i.wallThickness;t.push(Oi(`${i.id}-left`,"wall",i.x-s-i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Oi(`${i.id}-right`,"wall",i.x+s+i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Oi(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,a,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Oi(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Oi(n,t,e,i,s,a,r,o){return{id:n,kind:t,minX:e-s/2,maxX:e+s/2,minY:r,maxY:o,minZ:i-a/2,maxZ:i+a/2}}const Yn=1e-6;function Ja(n,t,e){return n<t?t:n>e?e:n}function Qa(n,t,e,i,s,a,r){const o=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+a+Yn||l.maxY<i-r-Yn||t+o<l.minX||t-o>l.maxX||e+o<l.minZ||e-o>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Ic(n,t,e,i,s){let a=!1;const r=t.y+i;for(let o=0;o<2;o++)for(const c of n){if(c.maxY<=t.y+s+Yn||c.minY>=r-Yn)continue;const l=Ja(t.x,c.minX,c.maxX),h=Ja(t.z,c.minZ,c.maxZ),f=t.x-l,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(a=!0,u>Yn*Yn){const g=Math.sqrt(u),v=(e-g)/g;t.x+=f*v,t.z+=d*v}else{const g=t.x-c.minX,v=c.maxX-t.x,m=t.z-c.minZ,p=c.maxZ-t.z,x=Math.min(g,v,m,p);x===g?t.x=c.minX-e:x===v?t.x=c.maxX+e:x===m?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function kc(n,t,e,i,s){const a=t.y+i;for(const r of n){if(r.maxY<=t.y+s+Yn||r.minY>=a-Yn)continue;const o=Ja(t.x,r.minX,r.maxX),c=Ja(t.z,r.minZ,r.maxZ),l=t.x-o,h=t.z-c;if(l*l+h*h<e*e-Yn)return!0}return!1}const bo=Math.PI/180,Uc=1e-6;function Tf(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function tr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function bd(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Uc?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Ed(n,t,e){const i=n.character,s=Math.hypot(i.velocity.x,i.velocity.z),a=Math.hypot(t.moveX,t.moveZ),r=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&s<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Uc)&&a<=Math.max(0,e.inputDeadZone)&&!r}function Rf(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Cf(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Ed(n,t,e))return!1;const i=bd(n,t,e.lookRange);if(i===null)return!1;const s=Ye(i-n.character.bodyYaw);return Math.abs(s)>Math.max(0,e.triggerDeg)*bo}function Pf(n,t,e){const i=n.turnInPlace,s=n.config.turnInPlace;if(!s.enabled||!n.modules.turnInPlace||!Ed(n,e,s)){tr(n);return}const a=bd(n,e,s.lookRange);if(a===null){tr(n);return}const r=n.character,o=Ye(a-r.bodyYaw),c=Math.abs(o),l=Math.max(0,s.triggerDeg)*bo,h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Uc;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,s.armSec))){i.phase="active",i.fromYaw=r.bodyYaw,i.dir=o>=0?1:-1;const f=Math.min(c,Math.max(0,s.settleDeg)*bo);i.targetYaw=Ye(r.bodyYaw+i.dir*(c-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(s.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=Ye(i.targetYaw-i.fromYaw);r.bodyYaw=Ye(i.fromYaw+d*Rf(i.progress)),h||(r.facing=r.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Eo=1e-6;function Ye(n){return Math.atan2(Math.sin(n),Math.cos(n))}function sa(n,t,e,i){const s=Ye(t-n);return n+s*(1-Math.exp(-Math.max(e,Eo)*i))}function Rl(n,t,e,i){const s=Ye(t-n),a=Math.abs(s);return a<=i||a<=e?t:Ye(n+Math.sign(s)*Math.max(e,0))}function Lf(n,t,e){const i=n.character,s=n.config.orientation,a=n.combat,r=n.modules.gaze&&n.gaze.active,o=n.abilities.channeling,c=a.phase!=="idle"||a.charging||o||n.dash.phase!=="idle",l=r&&!c,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Eo,d=a.charging&&a.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(a.phase!=="idle")i.facing=a.attackFacing;else if(o)i.facing=Vs(n,e);else if(l)i.facing=sa(i.facing,n.gaze.centroidYaw,s.bodyTurnRate,t);else if(f)i.facing=Vs(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(s.facingDeadZone,Eo)){const k=Math.atan2(e.moveX,e.moveZ),b=s.facingTurnRate*Math.PI/180*t,A=s.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=Rl(i.facing,k,b,A);else if(h>=s.facingMinMagnitude&&Math.abs(Ye(k-i.facing))>s.facingDeadbandDeg*Math.PI/180){const w=sa(i.facing,k,s.facingSmoothRate,t);i.facing=Rl(i.facing,w,b,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const g=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Cf(n,e)||(i.bodyYaw=sa(i.bodyYaw,g,s.bodyTurnRate,t));let m=i.facing;if(r?m=l?n.gaze.mainYaw:i.facing:f?m=Math.atan2(e.aimX,e.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget&&(m=n.targeting.targetYaw),!r){const k=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Ye(m-i.bodyYaw))>k&&(m=i.moveYaw)}const p=l?n.config.gaze.headTurnRate:s.headTurnRate;let x=sa(i.headYaw,m,p,t);const _=s.maxHeadTurnDeg*Math.PI/180,y=Ye(x-i.bodyYaw);y>_?x=i.bodyYaw+_:y<-_&&(x=i.bodyYaw-_),i.headYaw=x}const wo=1e-6,Df=Math.PI/180;function Ao(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Fc(n,t,e){return n<t?t:n>e?e:n}function fr(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function To(n){const t=n.id,e=n.windowId;Object.assign(n,fr()),n.id=t,n.windowId=e}function If(n){To(n)}function wd(n){To(n.playerLink);for(const t of n.dummies)To(t.link)}function kf(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Ro(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(i.linkWindow=Math.max(i.linkWindow,s),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function er(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,fr()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function Uf(n,t){const e=n.config.links.search,i=n.character.position,s=Fc(e.maxAngleDeg,0,180)*Df;let a=0,r=t,o=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,h=c.position.z-i.z,f=Math.hypot(l,h);if(f<wo||f>e.range)continue;const d=Math.atan2(l,h);Math.abs(Ye(d-t))>s||f<o&&(o=f,a=c.id,r=d)}return{id:a,yaw:r,dist:a>0?o:0}}function Ff(n,t,e,i){const s=n.config.links,a=n.playerLink,r=n.character.position,o=Vs(n,t),c=Uf(n,o),l=c.id>0?c.yaw:o,h=c.id>0?Fc(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=i,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=h,a.travelled=0,a.fromX=r.x,a.fromZ=r.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,s.sharedCooldown),Ao(n,"link-start",a.id)}function Nf(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){er(n);return}if(e.weapon!==n.combat.weapon){er(n);return}e.timer+=t;const s=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Ao(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Ao(n,"link-end",e.id))}const r=i.windup+i.active+i.recovery;let o=0;if(e.phase==="windup"?o=e.timer:e.phase==="active"?o=i.windup+e.timer:e.phase==="recovery"?o=i.windup+i.active+e.timer:o=r,e.progress=r>0?Fc(o/r,0,1):1,e.phase==="active"&&i.active>wo){const c=Math.max(0,e.travel-e.travelled),l=Math.max(wo,i.active-e.timer),h=c/l;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function zf(n,t,e){const i=n.config.links,s=n.playerLink,a=n.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!i.enabled||!n.modules.links){s.phase!=="idle"&&er(n);return}const r=n.combat,o=n.character.sprinting;o&&i.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&i.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,i.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!o&&Ro(n,"sprint"),s.prevSprinting=o,Nf(n,t);const c=i.moves[r.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&r.phase==="idle"&&!r.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&Ff(n,e,c,r.weapon)}const Co=1e-6;function ri(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ad(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Nc(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.bowQueued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=Ad()}function Of(n){return{weapon:Li[Math.max(0,n-1)]??Li[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,bowQueued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:Ad()}}function Bf(n,t){return Vs(n,t)}function Hf(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+a,s)}function Td(n,t,e,i){const s=n.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=i,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=Bf(n,t),s.attackProgress=0,s.timings=e,s.attackId+=1,ri(n,"attack-start",i)}function Rd(n){return Math.max(0,n.config.combat.settle)}function Po(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Td(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Rd(n),lunge:Hf(n,i.lunge[e-1]??0)},e)}function Gf(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Td(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Rd(n),lunge:i.lunge},0),ri(n,"charge-release",e)}function Vf(n,t,e){const i=n.combat;if(i.phase==="idle")return;const s=i.timings;i.phaseTimer+=t;let a=0;for(;i.phase!=="idle"&&a++<8;){const c=i.phase==="windup"?s.windup:i.phase==="active"?s.active:i.phase==="recovery"?s.recovery:s.settle;if(i.phaseTimer<c)break;if(i.phaseTimer-=c,i.phase==="windup")i.phase="active",ri(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",ri(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&Po(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const c=i.timings.recovery;if(c>Co&&i.phaseTimer>=c*n.config.combat.cancelWindow){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&Po(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}const r=s.windup+s.active+s.recovery;let o=0;i.phase==="windup"?o=i.phaseTimer:i.phase==="active"?o=s.windup+i.phaseTimer:i.phase==="recovery"?o=s.windup+s.active+i.phaseTimer:i.phase==="settle"&&(o=r),i.phase!=="idle"&&(i.attackProgress=r>0?Math.min(1,o/r):1)}function Xf(n,t,e){const i=n.combat,s=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=Li.length){const c=Li[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,Nc(n),er(n),ri(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,ri(n,"combo-reset",0))),Vf(n,t,e);const a=s.weapons[i.weapon],r=n.dash.phase==="active";if(a.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!r&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<a.comboCount?i.comboIndex+1:1;Po(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&(!r&&!n.playerLink.consumedAttack&&(e.attackPressed&&i.phase!=="idle"&&(i.bowQueued=!0),!e.attackHeld&&!i.charging&&(i.bowQueued=!1),i.phase==="idle"&&!i.charging&&e.attackHeld&&(e.attackPressed||i.bowQueued)&&(i.bowQueued=!1,i.charging=!0,i.charge=0,ri(n,"charge-start",0))),i.charging&&e.attackHeld&&(i.charge=Math.min(1,i.charge+t/Math.max(s.bow.maxChargeTime,Co))),i.charging&&!r&&(e.attackReleased||!e.attackHeld))){i.charging=!1;const c=i.charge;i.charge=0,c>=s.bow.minChargeToFire&&i.phase==="idle"?Gf(n,e,c):ri(n,"charge-release",0)}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>Co)){const c=i.timings.lunge/i.timings.active;n.impulse.x=Math.sin(i.attackFacing)*c,n.impulse.z=Math.cos(i.attackFacing)*c}}const Lo=1e-6;function Cr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Wf(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Cd(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Cl(n,t,e){return n<t?t:n>e?e:n}function $f(n,t,e){const i=n.config.dash,a=n.character.position,r=n.config.worldBounds,o=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,h=a.x,f=a.z;for(;l<c-Lo;){const d=Math.min(c,l+o),u=a.x+t*d,g=a.z+e*d,v=Cl(u,r.minX,r.maxX),m=Cl(g,r.minZ,r.maxZ),p={x:v,y:a.y,z:m};if(kc(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=v,f=m,l=d,v!==u||m!==g))break}return{x:h,z:f}}function Yf(n,t,e){const i=n.dash,s=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Ro(n,"roll")),i.cooldown>0){const o=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),o>0&&i.cooldown===0&&Cr(n,"dash-ready",0)}const a=n.combat;if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&a.phase==="idle"&&!a.charging&&n.playerLink.phase==="idle"){const o=uf(n,e),c=o.x,l=o.z,h=n.combat.weapon==="staff";if(i.kind=h?"blink":"roll",i.dirX=c,i.dirZ=l,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=h?s.blinkCooldown:s.rollCooldown,h){const f=$f(n,c,l);n.character.position.x=f.x,n.character.position.z=f.z,i.toX=f.x,i.toZ=f.z,i.duration=0,i.timer=0,i.phase="idle",s.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Ro(n,"blink"),Cr(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Lo,s.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*s.rollDistance,i.toZ=i.fromZ+l*s.rollDistance,Cr(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const o=Math.max(Lo,i.timer),c=n.character.position.x,l=n.character.position.z;n.impulse.x=(i.toX-c)/o,n.impulse.z=(i.toZ-l)/o}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const rn=1e-6,Do=Math.PI*2,Zf=7,qf=18;function Pl(n,t,e){return n<t?t:n>e?e:n}function jf(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ll(n,t,e,i){return n+jf(t-n)*(1-Math.exp(-Math.max(e,rn)*i))}function zc(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Kf(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},s=n.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:_d(),link:fr()})}return t}function Jf(n){const t=Tr.indexOf(n);return Tr[(t+1)%Tr.length]}function Pd(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],s=t.spawn[e]??{x:i.homeX,z:i.homeZ},a=t.initialModes[e]??i.initialMode;i.mode=a,i.initialMode=a,i.homeX=s.x,i.homeZ=s.z,i.position.x=s.x,i.position.y=0,i.position.z=s.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=s.x,i.targetZ=s.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const r=i.hurt;r.type="none",r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,If(i.link)}n.dummyAttackCount=0}function Qf(n,t,e){const i=Rr(n)*Do,s=Math.sqrt(Rr(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*s,t.targetZ=t.homeZ+Math.sin(i)*s,t.wanderTimer=e.wanderInterval*(.6+Rr(n)*.8)}function tp(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function ep(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const o=Math.max(tp(t,i),rn);if(t.attackPhaseTimer<o)break;t.attackPhaseTimer-=o,t.attackPhase==="windup"?(t.attackPhase="active",zc(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=i.attackWindup+i.attackActive+i.attackRecovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,r/a)}function np(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,s=i.x-t.position.x,a=i.z-t.position.z,r=Math.hypot(s,a),o=r>rn?s/r:0,c=r>rn?a/r:0;let l=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,g=Math.hypot(d,u);(t.wanderTimer<=0||g<.3)&&Qf(n,t,e);const v=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(v,m);p>rn&&(l=v/p,h=m/p)}else if(t.mode==="follow")r>e.followStopDistance&&(l=o,h=c);else if(t.mode==="keep-distance"){const d=r-e.keepDistance;d>e.keepDeadZone?(l=o,h=c):d<-e.keepDeadZone?(l=-o,h=-c):(l=-c*e.keepStrafe,h=o*e.keepStrafe)}else t.mode==="attack"&&r>e.attackRange&&t.attackPhase==="idle"&&(l=o,h=c);let f=t.facing;if(t.mode==="wander"?Math.hypot(l,h)>rn&&(f=Math.atan2(l,h)):r>rn&&(f=Math.atan2(o,c)),e.leashRadius>rn&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,g=Math.hypot(d,u);if(g>e.leashRadius){const v=Math.min(1,(g-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),m=-d/g,p=-u/g;l=l*(1-v)+m*v,h=h*(1-v)+p*v;const x=Math.hypot(l,h);x>rn&&(l/=x,h/=x)}}return{x:l,z:h,facing:f}}function ip(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const m=n.character.position;Math.hypot(m.x-e.position.x,m.z-e.position.z)<=i.attackRange+rn&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,zc(n,"dummy-attack",e))}ep(n,e,t,i);const s=np(n,e,i),a=1-Math.exp(-Math.max(i.acceleration,rn)*t);e.velocity.x+=(s.x*i.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*i.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=Ll(e.bodyYaw,e.facing,Zf,t),e.headYaw=Ll(e.headYaw,e.facing,qf,t);const r=e.position.x,o=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;Ic(n.boxes,e.position,i.radius,i.height,c)&&kc(n.boxes,e.position,i.radius,i.height,c)&&(e.position.x=r,e.position.z=o,e.velocity.x=0,e.velocity.z=0);const h=n.config.worldBounds;e.position.x=Pl(e.position.x,h.minX,h.maxX),e.position.z=Pl(e.position.z,h.minZ,h.maxZ);const f=Qa(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+c+rn&&(e.position.y=f);const d=Math.hypot(e.position.x-r,e.position.z-o);e.distance+=d;const u=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,u/Math.max(n.config.moveSpeed,rn)),v=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),rn);e.stride=v,e.gaitPhase=(e.gaitPhase+d/v*Do)%Do}function sp(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const s=n.dummies[e.dummyClickId-1];s.mode=Jf(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,zc(n,"dummy-mode",s)}for(const s of n.dummies)ip(n,t,s,i)}const Bi=1e-6,Dl=Math.PI*2;function Pr(n,t){return Math.sqrt(n*n+t*t)}function aa(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function ap(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,Nc(n)}function rp(n,t,e){const i=n.character,s=n.config,a=Qa(n.boxes,t,e,s.characterHeight,s.characterRadius,s.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=a>Number.NEGATIVE_INFINITY?a:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=s.strideLength,i.distance=0,i.coyoteTime=s.coyoteTime,i.jumpBuffer=0,Nc(n),wd(n),Cd(n),yd(n),tr(n);const r=n.targeting;r.targetId=0,r.targetYaw=0,r.targetDist=0,r.hasTarget=!1;const o=n.playerHurt;o.type="none",o.lastAt=Cc,o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,n.events.length=0}function op(n,t,e){const i=n.config,s=n.character,a=s.position,r=s.velocity;let o=e.moveX,c=e.moveZ;const l=Pr(o,c);l>1&&(o/=l,c/=l);const h=n.combat.phase!=="idle",f=n.playerLink.phase!=="idle",d=h||n.dash.phase==="active"||f;s.sprinting=!d&&e.sprintHeld&&l>Bi;const u=i.combat.weapons[n.combat.weapon];let g=u?u.moveMultiplier:1;d?g*=n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=i.abilities.arcane.moveScale);const v=i.moveSpeed*(s.sprinting?i.sprintMultiplier:1)*g;if(d)r.x=o*v,r.z=c*v;else{const F=l>Bi?i.acceleration:i.friction,N=1-Math.exp(-F*t);r.x+=(o*v-r.x)*N,r.z+=(c*v-r.z)*N}e.jumpPressed?s.jumpBuffer=i.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?i.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(r.y=i.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,aa(n,"jumped",i.jumpSpeed)),n.events.some(F=>F.type==="blink"&&F.tick===n.tick)&&(r.x=0,r.z=0,n.impulse.x=0,n.impulse.z=0);const p=a.x,x=a.z;if(a.x+=(r.x+n.impulse.x+n.playerHurt.knockX)*t,a.z+=(r.z+n.impulse.z+n.playerHurt.knockZ)*t,Ic(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight)){if(kc(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight))a.x=p,a.z=x,r.x=0,r.z=0;else{const F=a.x-p,N=a.z-x;Math.abs(F)<Math.abs(r.x*t)*.5&&(r.x=0),Math.abs(N)<Math.abs(r.z*t)*.5&&(r.z=0)}aa(n,"blocked",1)}const y=i.worldBounds;a.x=Il(a.x,y.minX,y.maxX),a.z=Il(a.z,y.minZ,y.maxZ);const k=Qa(n.boxes,a.x,a.z,a.y,i.characterRadius,i.stepHeight,i.fallTolerance);s.grounded&&k>a.y+Bi&&k-a.y<=i.stepHeight+Bi&&(a.y=k,r.y=0,aa(n,"stepUp",k));const b=a.y;r.y-=i.gravity*t,a.y+=r.y*t;const A=Qa(n.boxes,a.x,a.z,b,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);A>Number.NEGATIVE_INFINITY&&a.y<=A&&r.y<=0?(a.y=A,r.y=0,s.grounded||aa(n,"landed",A),s.grounded=!0):s.grounded=!1;const T=Pr(a.x-p,a.z-x);s.distance+=T;const w=Pr(r.x,r.z),M=Math.min(i.strideSpeedCap,w/Math.max(i.moveSpeed,Bi)),P=Math.max(i.strideLength*(1+M*i.strideSpeedGain),Bi);s.stride=P,s.gaitPhase=(s.gaitPhase+T/P*Dl)%Dl}function Il(n,t,e){return n<t?t:n>e?e:n}const Io=1e-6,kl=2.399963229728653;function Ei(n,t,e){return n<t?t:n>e?e:n}function Ul(n,t,e,i,s,a,r,o,c){const l=t.x-n.x,h=t.z-n.z,f=Math.hypot(l,h),d=e+i;if(f>=d)return;let u,g,v;f<Io?(u=o,g=c,v=d):(u=l/f,g=h/f,v=d-f);const m=v+r;n.x-=u*m*s,n.z-=g*m*s,t.x+=u*m*a,t.z+=g*m*a}function cp(n){const t=n.config.separation,e=n.dummies,i=n.character.position,s=n.config.characterRadius,a=n.config.dummies.radius,r=Math.max(1,Math.floor(t.iterations)),o=Math.max(0,t.slop);for(let h=0;h<r;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*kl;Ul(e[f].position,e[d].position,a,a,.5,.5,o,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*kl;Ul(i,e[f].position,s,a,0,1,o,Math.cos(d),Math.sin(d))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const h of e)Ic(n.boxes,h.position,a,n.config.dummies.height,c),h.position.x=Ei(h.position.x,l.minX,l.maxX),h.position.z=Ei(h.position.z,l.minZ,l.maxZ)}function lp(n,t,e,i,s,a,r,o){const c=Math.hypot(e,i),l=Math.max(0,o.contactBand),h=Ei(o.minScale,0,1);if(c<Io||l<=0||h>=1)return 1;const f=s+r,d=Ei(o.approachDot,0,.99);let u=0;for(const g of a){const v=g.position.x-n,m=g.position.z-t,p=Math.hypot(v,m);if(p>=f+l)continue;if(p<Io){u=1;continue}const x=(e*v+i*m)/(c*p);if(x<=d)continue;const _=Ei(1-(p-f)/l,0,1),y=Ei((x-d)/(1-d),0,1);u=Math.max(u,_*y)}return 1-(1-h)*Ei(u,0,1)}function hp(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=lp(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Fl=1e-6,dp=Math.PI/180;function up(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function fp(n,t,e){return n<t?t:n>e?e:n}function pp(n,t,e){const i=n.config.targeting,s=n.targeting,a=n.character.position;let r=n.character.facing;Math.hypot(e.moveX,e.moveZ)>Fl&&(r=Math.atan2(e.moveX,e.moveZ));const c=fp(i.maxAngleDeg,0,180)*dp;let l=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const g=u.position.x-a.x,v=u.position.z-a.z,m=Math.hypot(g,v);if(m<Fl||m>i.range)continue;const p=Math.atan2(g,v),x=Math.abs(Ye(p-r));if(x>c)continue;const _=m-i.frontBias*Math.cos(x);_<l&&(l=_,h=u.id,f=p,d=m)}s.targetId=h,s.targetYaw=f,s.targetDist=d,s.hasTarget=h>0}const $n=1e-6;function nr(n,t,e){return n<t?t:n>e?e:n}function Nl(n){return Math.atan2(Math.sin(n),Math.cos(n))}function mp(n,t,e){const i=n.config.gaze,s=n.gaze;if(!i.enabled||!n.modules.gaze){s.active=!1,s.mainId=0,s.mainYaw=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}const a=n.character.position,r=(M,P)=>{const F=M.position.x-a.x,N=M.position.z-a.z,B=Math.hypot(F,N);if(B<$n||B>P)return 0;const D=nr((P-B)/Math.max($n,P-i.nearDistance),0,1);let L=D*(i.modeWeight[M.mode]??.5);return M.attackPhase==="active"&&(L+=i.attackBoost*D),L},o=[];let c=0,l=!1,h=!1,f=!1;for(const M of n.dummies){const P=r(M,i.threatRange),F=M.position.x-a.x,N=M.position.z-a.z,B=Math.hypot(F,N);P>0&&(o.push({id:M.id,x:M.position.x,z:M.position.z,dx:F,dz:N,yaw:Math.atan2(F,N),w:P}),c+=P,B<=i.approachDist&&(i.modeWeight[M.mode]??.5)>=i.hostileModeWeight&&(f=!0)),B>$n&&B<=i.recoveryDist&&(l=!0),(M.attackPhase==="windup"||M.attackPhase==="active")&&B<=i.threatRange&&(h=!0)}const d=c<=0?0:nr(c/(c+Math.max($n,i.saturation)),0,1),u=o.length>0,g=s.active,v=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),m=i.hurtHoldSec>$n&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=g&&(l||m);if(s.active=v||p,!s.active){s.mainId=0,s.mainYaw=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}if(o.length===0)return;o.sort((M,P)=>P.w-M.w);const x=o.slice(0,Math.max(1,i.maxThreats)),_=o[0],y=Math.atan2(_.dx,_.dz),k=i.behindAngleDeg*Math.PI/180,b=n.character.bodyYaw;let A=0,T=0,w=0;for(const M of x){const P=Math.abs(Nl(M.yaw-y))/Math.PI;let F=M.w/(1+Math.max(i.spreadFalloff,0)*P*P);M!==_&&i.behindFalloff<1&&Math.abs(Nl(M.yaw-b))>k&&(F*=Math.max(i.behindFalloff,0)),A+=M.x*F,T+=M.z*F,w+=F}s.mainId=_.id,s.mainYaw=y,s.centroidYaw=w>$n?Math.atan2(A/w-a.x,T/w-a.z):y,s.threatCount=o.length,s.threat=d}function gp(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function xp(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,s=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(s<$n||s>e.threatRange)return 0;const a=Math.max($n,e.threatRange-e.nearDistance),r=nr((e.threatRange-s)/a,0,1);let o=r*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(o+=e.attackBoost*r);const c=Math.max($n,e.modeWeight.attack??1.5);return nr(o/c,0,1)}function vp(){return{active:!1,mainId:0,mainYaw:0,centroidYaw:0,threatCount:0,threat:0}}function _p(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:Af(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Of(1),playerLink:fr(),abilities:vf(),impulse:{x:0,z:0},targeting:up(),turnInPlace:Tf(),playerHurt:_d(),hitCount:0,dash:{...Wf(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Md(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:vp(),dummies:Kf(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function yp(n){ap(n),Pd(n),wd(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Cc,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,yd(n),Cd(n),Sd(n),tr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function zl(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){yp(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?pp(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),zf(n,t,e),n.modules.combat&&Xf(n,t,e),n.modules.dash&&Yf(n,t,e),n.modules.movement&&op(n,t,e),n.modules.gaze&&mp(n,t,e),n.modules.orientation&&Lf(n,t,e),Pf(n,t,e),n.modules.dummies&&sp(n,t,e),ff(n,t),kf(n,t),n.modules.abilities&&Ef(n,t,e),n.modules.dummies&&(xf(n,t),n.modules.separation&&(cp(n),hp(n))),n.modules.camera?wf(n):Sd(n),n}function Mp(n){let t=0;return{frame(e,i,s,a,r){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const o=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=o&&l<c;){const h=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};zl(n,o,h),r&&r(),t-=o,l++}return l>=c&&(t=0),l},singleStep(e){zl(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Ld={slopPx:12,longPressMs:450,doubleTapMs:280};function Sp(n,t,e=Ld.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,s=n.dy/n.distance,a=t.rightX*i+t.forwardX*-s,r=t.rightZ*i+t.forwardZ*-s,o=Math.hypot(a,r);return o<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:a/o,worldZ:r/o}}function ui(n,t,e,i,s,a){const r=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:r,angleDeg:r>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function bp(n=Ld){const t=new Map,e=new Map,i=s=>t.get(s);return{begin(s,a,r,o,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:r,startY:o,x:r,y:o,startedAt:c,dragging:!1,longFired:!1}),ui(s,"press",0,0,0,1)},move(s,a,r,o){const c=i(s);if(!c)return null;c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY;return!c.dragging&&Math.hypot(l,h)>=n.slopPx?(c.dragging=!0,ui(c.button,"drag",l,h,o-c.startedAt,1)):null},end(s,a,r,o){const c=i(s);if(!c)return null;t.delete(s),c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY,f=o-c.startedAt,d=Math.hypot(l,h);if(c.dragging||c.longFired||d>=n.slopPx)return ui(c.button,"release",l,h,f,1);const u=e.get(c.button);return u!==void 0&&o-u.at<=n.doubleTapMs&&Math.hypot(a-u.x,r-u.y)<=n.slopPx*2?(e.delete(c.button),ui(c.button,"doubleTap",l,h,f,2)):(e.set(c.button,{at:o,x:a,y:r}),ui(c.button,"tap",l,h,f,1))},cancel(s,a){const r=i(s);return r?(t.delete(s),ui(r.button,"cancel",r.x-r.startX,r.y-r.startY,a-r.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=n.longPressMs)return a.longFired=!0,ui(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const Lr=.001,Ep=18;function ko(n,t,e){return n<t?t:n>e?e:n}function Uo(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function wp(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function Ap(n,t,e,i,s=Ep){const a=wp(t);if(!a)return{state:Uo(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const r=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),o=s,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,h=c;if(!Number.isFinite(r)||r<Lr)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=o<=0;return{state:{active:!0,lastDist:r,armDist:r,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<Lr?{state:{active:!0,lastDist:r,armDist:r,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(r-n.armDist)<o?{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Lr)return{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=r/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!0},scale:ko(Number.isFinite(u)?u:1,l,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Tp(n,t,e,i){const s=Math.min(e,i),a=Math.max(e,i),r=Number.isFinite(t)&&t>0?t:1,o=n*r;return Number.isFinite(o)?ko(o,s,a):ko(n,s,a)}function Rp(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function Cp(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Dr=["jump","sprint","reset","attack","skill2"],Pp=8,Lp=16,Ir=10,Ol=14,Bl=140,Dp=18,Ip=16,kp=400,Up=1.0001;function Ga(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function Fp(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Ga(e)}function Np(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:s}=n,a=()=>Math.max(8,t());let r=null,o=0,c=0,l=0,h=0,f=0,d=0,u=-1,g=0,v=null,m=-1,p=0,x=0,_=0,y=0,k=!1,b=0,A=1,T=0,w=null,M=0,P=0,F=!1,N=null,B=null,D=0,L=0,X=0,H=0,q=!1,j=!0,ot=-1;const dt=bp({slopPx:Ol,longPressMs:450,doubleTapMs:350});let xt=[],Y=null;const tt=new Set;function ut(O){O&&xt.push(O)}const K=new Map;let ft=Uo(),It=!1,Ct=1;function vt(){const O=Array.from(K.values()),it=s(),ht=Ap(ft,O,it.pinchGain,it.maxStepRatio,Dp);if(ft=ht.state,It=ht.pinching,ht.scale!==1&&(Ct*=ht.scale),ht.started||ht.armedNow)w=null,F=!0,N=null;else if(ht.ended&&r===null&&O.length===1){const Nt=O[0];r=Nt.id,o=Nt.x,c=Nt.y,l=0,h=0,f=Nt.x,d=Nt.y,k=!1,b=0,A=1,T=0,performance.now(),w=null,F=!0,N=null}}const At={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},wt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let G=0,jt=0;const kt={},Ut=new Set,Tt=[];function St(){for(const O of Dr)kt[O]!==void 0&&(kt[O]=void 0),W(O);dt.reset(),tt.clear(),K.clear(),ft=Uo(),It=!1,r=null,l=0,h=0,f=0,d=0,k=!1,b=0,A=1,T=0,p=0,x=0,_=0,y=0,v=null,m=-1,w=null,F=!1,N=null,B=null,ot=-1,X=0,H=0,q=!1,j=!0}const Pt=()=>{document.hidden&&St()},I=O=>{if(O.clientX===0&&O.clientY===0){g++;return}if(Ga(O.target)||Fp(O.clientX,O.clientY)){tt.add(O.pointerId);return}if(tt.delete(O.pointerId),K.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),r===null&&!It){v=null,m=-1,r=O.pointerId,o=O.clientX,c=O.clientY,l=0,h=0,f=O.clientX,d=O.clientY,performance.now();const it=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY)&&(O.screenX!==0||O.screenY!==0);k=it,b=0,A=1,T=0,p=it?O.screenX:0,x=it?O.screenY:0,_=p,y=x,w=O.pointerId,M=O.clientX,P=O.clientY,F=!1}vt()},E=O=>{if(O.pointerId===B&&(O.pointerType==="mouse"&&O.buttons===0||O.clientX===0&&O.clientY===0&&(D!==0||L!==0)||(j?(X=O.clientX-D,H=O.clientY-L):(D=O.clientX,L=O.clientY,j=!0,X=0,H=0))),ut(dt.move(O.pointerId,O.clientX,O.clientY,performance.now())),!tt.has(O.pointerId)&&K.has(O.pointerId)&&(K.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),vt()),tt.has(O.pointerId)||O.pointerId!==r)return;const it=performance.now();if(v===O.pointerId&&it-m<150){g++;return}const ht=O.clientX,Nt=O.clientY;if(ht===0&&Nt===0&&(o!==0||c!==0)){g++;return}const Xt=ht-f,z=Nt-d,_t=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY),J=_t?O.screenX:0,rt=_t?O.screenY:0,gt=_t&&(J!==0||rt!==0),yt=J-_,Ht=rt-y;if(k&&gt){const le=Math.hypot(yt,Ht),de=Math.hypot(Xt,z);if(le>3){if(b=0,T<30&&de>6&&yt*Xt+Ht*z>.7*le*de){const Me=le/de;Me>.2&&Me<5&&(A+=(Me-A)*.3,T++)}}else de>12&&(b++,b>=2&&(k=!1))}const Zt=Math.hypot(Xt,z);if(!k){const le=u<0?Number.POSITIVE_INFINITY:it-u,de=gt?Math.hypot(yt,Ht):1/0;Zt>28&&(le<200||de<Zt*.4)&&(o+=Xt,c+=z,g++)}f=ht,d=Nt,_=J,y=rt,O.pointerId===w&&Math.hypot(O.clientX-M,O.clientY-P)>Pp&&(F=!0);let ie,$t;k&&gt?(ie=(J-p)/A,$t=(rt-x)/A):(ie=ht-o,$t=Nt-c);const ce=Math.hypot(ie,$t),pe=a();ce>pe&&(ie*=pe/ce,$t*=pe/ce);const Fe=Math.hypot(l,h),Te=Math.hypot(ie,$t);if(Fe>10&&Te>10){const le=Math.abs(Math.atan2(l*$t-h*ie,l*ie+h*$t)),de=Math.max(Fe,Te)*le,Me=Math.max(Math.hypot(Xt,z),Math.hypot(yt,Ht)/Math.max(.2,A));if(le>.6&&Me<Math.max(6,de*.5)){g++;return}}l=ie,h=$t};function W(O){if(!At[O])return;At[O]=!1,O==="attack"&&(wt.attackReleased=!0);const it=document.getElementById(`btn-${O}`);it==null||it.classList.remove("is-down")}function st(){r!==null&&(v=r,m=performance.now(),r=null,l=0,h=0,f=0,d=0,k=!1,b=0,A=1,T=0,p=0,x=0,_=0,y=0)}const ct=O=>{const it=K.delete(O.pointerId),ht=tt.delete(O.pointerId);it&&vt(),O.pointerId===B&&(B=null,q?ot=performance.now():(X=0,H=0,ot=-1)),ut(dt.end(O.pointerId,O.clientX,O.clientY,performance.now()));for(const Ot of Dr)kt[Ot]===O.pointerId&&(kt[Ot]=void 0,W(Ot));const Nt=!it&&!ht&&K.size<=1&&r!==null;(O.pointerId===r||K.size===0||Nt)&&st(),!ht&&O.pointerId===w&&(!F&&!Ga(O.target)&&(N={x:O.clientX,y:O.clientY}),w=null)};for(const O of Dr){const it=document.getElementById(`btn-${O}`);if(!it)continue;const ht=O==="attack"||O==="skill2",Nt=z=>{if(z.preventDefault(),kt[O]===void 0){kt[O]=z.pointerId,At[O]=!0,O==="jump"&&(wt.jump=!0),O==="reset"&&(wt.reset=!0),O==="sprint"&&(wt.sprintPressed=!0),O==="attack"&&(wt.attackPressed=!0),O==="skill2"&&(wt.skill2=!0),it.classList.add("is-down"),ut(dt.begin(O,z.pointerId,z.clientX,z.clientY,performance.now()));try{it.setPointerCapture(z.pointerId)}catch{}ht&&(B=z.pointerId,D=z.clientX,L=z.clientY,j=!(z.clientX===0&&z.clientY===0),X=0,H=0,q=!1,ot=-1)}},Ot=z=>{kt[O]===z.pointerId&&(kt[O]=void 0,W(O),ut(dt.end(z.pointerId,z.clientX,z.clientY,performance.now())))},Xt=z=>{kt[O]===z.pointerId&&(kt[O]=void 0,W(O),ut(dt.cancel(z.pointerId,performance.now())))};it.addEventListener("pointerdown",Nt),it.addEventListener("pointerup",Ot),it.addEventListener("pointercancel",Xt),Tt.push(()=>{it.removeEventListener("pointerdown",Nt),it.removeEventListener("pointerup",Ot),it.removeEventListener("pointercancel",Xt)})}const at=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const O of at){const it=ht=>{ht.preventDefault(),G=Number(O.dataset.weapon)||0};O.addEventListener("pointerdown",it),Tt.push(()=>O.removeEventListener("pointerdown",it))}const Ft=O=>{const it=O.key.toLowerCase();if((it===" "||it.startsWith("arrow"))&&O.preventDefault(),Ut.has(it))return;Ut.add(it),it===" "&&(wt.jump=!0),it==="r"&&(wt.reset=!0),it==="shift"&&(wt.sprintPressed=!0),it==="j"&&(wt.attackPressed=!0),it==="k"&&(wt.skill2=!0),it>="1"&&it<="5"&&(G=Number(it)),it>="6"&&it<="9"&&(jt=Number(it)-5);const ht=Math.max(Up,s().keyStep||1.12);(it==="="||it==="+")&&(Ct*=ht),(it==="-"||it==="_")&&(Ct/=ht)},Q=O=>{const it=O.key.toLowerCase();Ut.has(it)&&(Ut.delete(it),it==="j"&&(wt.attackReleased=!0))},pt=O=>{if(Ga(O.target))return;O.preventDefault();const it=O.deltaMode===1?O.deltaY*Ip:O.deltaMode===2?O.deltaY*kp:O.deltaY;Ct*=Rp(it,s().wheelStep)},Gt=O=>{O.preventDefault()},nt=()=>{u=performance.now()};window.addEventListener("resize",nt),window.addEventListener("orientationchange",nt);const Mt=typeof window<"u"?window.visualViewport:null;return Mt&&(Mt.addEventListener("resize",nt),Mt.addEventListener("scroll",nt)),window.addEventListener("pointerdown",I),window.addEventListener("pointermove",E),window.addEventListener("pointerup",ct),window.addEventListener("pointercancel",ct),window.addEventListener("blur",St),document.addEventListener("visibilitychange",Pt),window.addEventListener("keydown",Ft),window.addEventListener("keyup",Q),window.addEventListener("wheel",pt,{passive:!1}),window.addEventListener("gesturestart",Gt),{peekStick(){return{id:r,held:r!==null,originX:o,originY:c,x:f,y:d,dx:f-o,dy:d-c,radius:a(),badMoves:g,screenOk:k,originSX:p,originSY:x,screenX:_,screenY:y,scale:A}},peekAim(){const O=performance.now(),it=Math.hypot(X,H),ht=B!==null||ot>=0&&O-ot<Bl;if(!(ht&&q&&it>=Ir))return{active:!1,holding:ht,x:0,z:0,dx:X,dy:H};const Ot=i(),Xt=X/it,z=H/it,_t=Ot.rightX*Xt+Ot.forwardX*-z,J=Ot.rightZ*Xt+Ot.forwardZ*-z,rt=Math.hypot(_t,J)||1;return{active:!0,holding:ht,x:_t/rt,z:J/rt,dx:X,dy:H}},sample(){var en;const O=a();let it=r!==null?Math.max(-1,Math.min(1,l/O)):0,ht=r!==null?Math.max(-1,Math.min(1,h/O)):0,Nt=0,Ot=0;(Ut.has("a")||Ut.has("arrowleft"))&&(Nt-=1),(Ut.has("d")||Ut.has("arrowright"))&&(Nt+=1),(Ut.has("w")||Ut.has("arrowup"))&&(Ot-=1),(Ut.has("s")||Ut.has("arrowdown"))&&(Ot+=1),it+=Nt,ht+=Ot;let Xt=Math.hypot(it,ht);Xt>1&&(it/=Xt,ht/=Xt,Xt=1);const z=it,_t=ht;Xt<e&&(it=0,ht=0);const J=i();let rt=J.rightX*it+J.forwardX*-ht,gt=J.rightZ*it+J.forwardZ*-ht;const yt=Math.hypot(rt,gt);yt>1&&(rt/=yt,gt/=yt);const Ht=performance.now();ut(dt.poll(Ht));const Zt=Math.hypot(X,H);B!==null&&(Zt>=Lp?q=!0:Zt<Ir&&(q=!1));const ie=B!==null||ot>=0&&Ht-ot<Bl,$t=ie&&q&&Zt>=Ir;let ce=0,pe=0;if($t){const Ge=X/Zt,Ze=H/Zt,Ne=J.rightX*Ge+J.forwardX*-Ze,ze=J.rightZ*Ge+J.forwardZ*-Ze,ln=Math.hypot(Ne,ze)||1;ce=Ne/ln,pe=ze/ln}!ie&&B===null&&(X=0,H=0,ot=-1,q=!1);const Fe=N;N=null;const Te=Ct;Ct=1;const le={moveX:rt,moveZ:gt,jumpPressed:wt.jump,sprintHeld:At.sprint||Ut.has("shift"),sprintPressed:wt.sprintPressed,resetPressed:wt.reset,attackPressed:wt.attackPressed,attackHeld:At.attack||Ut.has("j"),attackReleased:wt.attackReleased,skill2Pressed:wt.skill2,weaponSlot:G,dummyClickId:jt,aimX:ce,aimZ:pe,aimActive:$t};wt.jump=!1,wt.reset=!1,wt.sprintPressed=!1,wt.attackPressed=!1,wt.attackReleased=!1,wt.skill2=!1,G=0,jt=0;const de=xt.map(Ge=>Sp(Ge,J,Ol));xt=[],de.length>0&&(Y=de[de.length-1]);const Me=r!==null?"pointer":Ut.size>0?"keyboard":"idle";return{intents:le,stickX:it,stickY:ht,stickRawX:z,stickRawY:_t,stickHeld:r!==null,stickId:r,stickOriginX:o,stickOriginY:c,stickPxX:f,stickPxY:d,stickBad:g,stickScreenOk:k,stickOriginSX:p,stickOriginSY:x,stickScreenX:_,stickScreenY:y,stickScale:A,stickVpTop:((en=Cp())==null?void 0:en.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:X,aimDY:H,source:Me,tap:Fe,zoomScale:Te,gestures:de,lastGesture:Y}},dispose(){window.removeEventListener("pointerdown",I),window.removeEventListener("pointermove",E),window.removeEventListener("pointerup",ct),window.removeEventListener("pointercancel",ct),window.removeEventListener("blur",St),document.removeEventListener("visibilitychange",Pt),window.removeEventListener("keydown",Ft),window.removeEventListener("keyup",Q),window.removeEventListener("wheel",pt),window.removeEventListener("resize",nt),window.removeEventListener("orientationchange",nt),Mt&&(Mt.removeEventListener("resize",nt),Mt.removeEventListener("scroll",nt)),window.removeEventListener("gesturestart",Gt),dt.reset();for(const O of Tt)O()}}}const ir=1,sr=2,ar=4,Dd=8,rr=16,Ns=32,Id=64,kd=128,zp=[[ir,"atk"],[sr,"dash"],[ar,"link"],[Dd,"air"],[rr,"hurt"],[Ns,"aim"],[Id,"spr"],[kd,"chan"]];function Hi(n){if(n===0)return"-";const t=zp.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Op=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Bp=0,Hp=15,kr=19,Gp=21,Vp=22,Xp=23,Wp=24,Dn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},an=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,En=n=>Math.round(n*180/Math.PI*10)/10,Ur=Math.PI*2;function ws(n){let t=n%Ur;return t>Math.PI&&(t-=Ur),t<-Math.PI&&(t+=Ur),t}function $p(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=ir),n.dash.phase!=="idle"&&(e|=sr),n.playerLink.phase!=="idle"&&(e|=ar),n.character.grounded||(e|=Dd),n.playerHurt.type!=="none"&&(e|=rr),t.intents.aimActive&&(e|=Ns),n.character.sprinting&&(e|=Id),n.abilities.channeling&&(e|=kd),e}function Yp(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Zp(n){const t={sampleHz:n.sampleHz??Dn.sampleHz,sampleCapacity:n.sampleCapacity??Dn.sampleCapacity,eventCapacity:n.eventCapacity??Dn.eventCapacity,anomalyCapacity:n.anomalyCapacity??Dn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??Dn.dirJumpDeg,aimDropDeg:n.aimDropDeg??Dn.aimDropDeg,freezeMs:n.freezeMs??Dn.freezeMs,freezeSpeed:n.freezeSpeed??Dn.freezeSpeed,stickLostMs:n.stickLostMs??Dn.stickLostMs,spikeMs:n.spikeMs??Dn.spikeMs},e=n.meta,i=[],s=[],a=[],r={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let o=!0,c=-1,l=-1e9,h=null,f=0,d=0,u="",g=-1,v=-1,m=-1,p=0,x=-1e9,_=-1,y={},k=null,b=0,A=0,T=0,w=0;function M(D,L){const X=1/t.sampleHz,H=D[Bp];H-l<X-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(D),l=H)}function P(D,L,X,H,q,j){const ot=y[D]??-1e9;if(L-ot<1.2)return;if(y[D]=L,D==="frameSpike"){let xt=0;for(const Y of a)Y.kind==="frameSpike"&&xt++;if(xt>=6)return}a.length>=t.anomalyCapacity&&a.shift();let dt=i.slice(-7);j&&(dt.length===0||dt[dt.length-1]!==j)&&(dt=[...dt.slice(-6),j]),a.push({kind:D,t:an(L),tick:X,ms:Math.round(H),detail:q,ctx:dt}),D==="dirJump"?r.dirJumps++:D==="aimDrop"?r.aimDrops++:D==="moveFreeze"?r.freezes++:D==="stickLost"?r.stickLosts++:D==="stickJump"?r.stickJumps++:D==="stickBad"?r.stickBads++:D==="stickDrift"&&r.stickDrifts++}function F(D,L,X,H){s.length>=t.eventCapacity&&s.shift(),s.push({t:an(X),tick:H,k:D,d:L})}function N(D){switch(D.type){case"attack-start":r.attacks++;break;case"hit":r.hits++;break;case"player-hurt":r.hurts++;break;case"link-start":r.links++;break;case"link-hit":r.linkHits++;break;case"roll":r.rolls++;break;case"blink":r.blinks++;break;case"channel-start":r.channels++;break;case"projectile-fire":r.bolts++;break;case"ring-place":r.rings++;break;case"charge-start":r.bowCharges++;break;case"jumped":r.jumps++;break;case"reset":r.resets++;break;case"blocked":x=D.tick;break}}function B(){const D=r,L=D.wallMs/1e3,X=D.gestures,H=dt=>Object.entries(X).filter(([xt])=>xt.endsWith(`.${dt}`)).reduce((xt,[,Y])=>xt+Y,0),q=[];if(q.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),q.push(`运行 ${L.toFixed(1)}s / ${D.frames} 帧 · ${D.fps.toFixed(1)}fps · 最大 ${D.dtMax.toFixed(0)}ms · 尖峰 ${D.spikes} · 步 ${D.steps}`),q.push(`摇杆活跃 ${L>0?Math.round(D.stickActiveMs/1e3/L*100):0}% · 手势 按下 ${H("press")}（单击 ${H("tap")} / 双击 ${H("doubleTap")} / 拖拽 ${H("drag")} / 长按 ${H("longPress")} / 打断 ${H("cancel")} / 拖放 ${H("release")}）`),q.push(`攻击 ${D.attacks}(中${D.hits}) · 受击 ${D.hurts} · 派生 ${D.links}(中${D.linkHits}) · 翻滚 ${D.rolls} 闪现 ${D.blinks} · 跳 ${D.jumps} · 复位 ${D.resets}`),q.push(`法杖 引导${D.channels} 飞弹${D.bolts} 电环${D.rings} · 弓蓄力${D.bowCharges} · 当前武器 ${u||"-"}`),q.push(`异常 ${D.dirJumps+D.aimDrops+D.freezes+D.stickLosts+D.stickJumps+D.stickBads+D.stickDrifts}（dir ${D.dirJumps} / aim ${D.aimDrops} / freeze ${D.freezes} / stick ${D.stickLosts} / stickJump ${D.stickJumps} / 坏指针 ${D.stickBads} / 坐标漂移 ${D.stickDrifts}） · 掉帧尖峰 ${D.spikes}`+(D.inTurns>0?` · 输入转向 ${D.inTurns} 次（最大 ${D.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const dt of a.slice(-6)){q.push(`· ${dt.kind} @t${dt.t.toFixed(2)} tick${dt.tick} ${dt.ms>0?`${dt.ms}ms `:""}${dt.detail}`);const xt=dt.ctx.map(tt=>String(tt[Hp])).join(" "),Y=dt.ctx.map(tt=>tt[kr]===""||tt[kr]==null?".":String(tt[kr])).join(" ");if(q.push(`  yaw ${xt}`),q.push(`  in  ${Y}`),dt.kind==="stickJump"||dt.kind==="stickBad"||dt.kind==="stickLost"){const tt=dt.ctx.map(K=>`${K[Gp]},${K[Vp]}`).join(" "),ut=dt.ctx.map(K=>`${K[Xp]},${K[Wp]}`).join(" ");q.push(`  o   ${tt}`),q.push(`  p   ${ut}`)}}if(s.length>0){q.push("最近事件：");for(const dt of s.slice(-12))q.push(`  ${dt.t.toFixed(2)} ${dt.k} ${dt.d}`.trimEnd())}const j=r.screenFrames>0?`屏幕 screenX/Y（${r.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",ot=r.screenFrames>0&&r.clientFrames>0?` / client 回退 ${r.clientFrames} 帧`:"";return q.push(`摇杆坐标源 ${j}${ot}`),q.push(`UA ${e.ua}`),q.join(`
`)}return{sample(D,L,X,H=0){r.frames++,L.stickHeld&&(L.stickScreenOk?r.screenFrames++:r.clientFrames++),r.steps+=H,r.wallMs+=X,X>r.dtMax&&(r.dtMax=X),r.fps=r.wallMs>0?r.frames*1e3/r.wallMs:0,r.simS=D.time;const q=D.time;if(c<0&&(c=q),T=q,w=D.tick,!o)return;const j=D.character,ot=Math.hypot(L.stickX,L.stickY),dt=Math.hypot(j.velocity.x,j.velocity.z);u=D.combat.weapon;const xt=$p(D,L),Y=j.facing,ut=Math.hypot(L.intents.moveX,L.intents.moveZ)>.05?Math.atan2(L.intents.moveX,L.intents.moveZ):null;ot>.2&&(r.stickActiveMs+=X);const K=[an(q),D.tick,Math.round(X*10)/10,an(L.stickX),an(L.stickY),an(L.stickRawX),an(L.stickRawY),L.stickHeld?1:0,L.source.slice(0,8),an(L.intents.moveX),an(L.intents.moveZ),an(j.position.x),an(j.position.z),an(j.velocity.x),an(j.velocity.z),En(Y),En(j.bodyYaw),xt,an(j.stride),ut===null?"":En(ut),L.stickId===null?"":L.stickId,Math.round(L.stickOriginX),Math.round(L.stickOriginY),Math.round(L.stickPxX),Math.round(L.stickPxY),L.stickBad,Math.round(L.stickVpTop),Math.round(L.stickOriginSX),Math.round(L.stickOriginSY),Math.round(L.stickScreenX),Math.round(L.stickScreenY),L.stickScreenOk?1:0,Math.round(L.stickScale*100)/100];M(K);const ft=q*1e3<_;if(X>t.spikeMs&&!ft&&q-c>.6&&(r.spikes++,P("frameSpike",q,D.tick,X,`dt ${X.toFixed(0)}ms fl=${Hi(xt)}`,K)),h!==null&&!ft){const St=Math.abs(En(ws(Y-h))),Pt=Math.abs(En(ws(j.moveYaw-f))),I=(d|xt)&(ir|sr|ar|rr)|xt&Ns,E=ut===null?null:Math.abs(En(ws(Y-ut))),W=ut===null||h===null?null:Math.abs(En(ws(h-ut))),st=E!==null&&W!==null&&E<W-.5,ct=(d&Ns)!==0&&(xt&Ns)===0&&ut===null,at=E!==null&&(E<=12||st);St>t.aimDropDeg&&ct?P("aimDrop",q,D.tick,0,`${St.toFixed(0)}° @aim→none stick(${L.stickX.toFixed(2)},${L.stickY.toFixed(2)}) aim(${L.aimDX.toFixed(0)},${L.aimDY.toFixed(0)}) fl=${Hi(xt)}`,K):St>t.dirJumpDeg&&I===0&&!ct&&(at?(r.inTurns++,St>r.inTurnMax&&(r.inTurnMax=St)):P("dirJump",q,D.tick,0,`${St.toFixed(0)}° res${E===null?" 无输入":`${E.toFixed(0)}°`} yaw ${En(h)}→${En(Y)} in ${ut===null?".":En(ut)}° mvΔ${Pt.toFixed(0)}° aim(${L.aimDX.toFixed(0)},${L.aimDY.toFixed(0)}) fl=${Hi(d)}→${Hi(xt)}`,K))}const It=(xt&(ir|sr|ar|rr))!==0,Ct=D.tick-x<30;ot>.35&&dt<t.freezeSpeed&&!It&&!Ct?(g<0&&(g=q),q-g>=t.freezeMs/1e3&&q>=v&&(P("moveFreeze",q,D.tick,(q-g)*1e3,`stick(${L.stickX.toFixed(2)},${L.stickY.toFixed(2)}) v${dt.toFixed(2)} ${L.source} fl=${Hi(xt)}`,K),v=q+1.5,g=-1)):g=-1,L.stickHeld?(ot>p&&(p=ot),p>.35&&ot<.06?(m<0&&(m=q),q-m>=t.stickLostMs/1e3&&(P("stickLost",q,D.tick,(q-m)*1e3,`raw(${L.stickRawX.toFixed(2)},${L.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Hi(xt)}`,K),m=-1,p=0)):m=-1):(p=0,m=-1);const vt=L.stickScale>.2&&L.stickScale<5?L.stickScale:1,At=L.stickScreenOk,wt=At?L.stickScreenX/vt:L.stickPxX,G=At?L.stickScreenY/vt:L.stickPxY,jt=At?L.stickOriginSX/vt:L.stickOriginX,kt=At?L.stickOriginSY/vt:L.stickOriginY,Ut=wt-jt,Tt=G-kt;if(L.stickHeld&&L.stickId!==null){const St=k;if(St&&St.held&&St.id===L.stickId){const Pt=Math.hypot(St.dx,St.dy),I=Math.hypot(Ut,Tt),E=Math.max(Pt,I),W=Math.hypot(wt-St.cx,G-St.cy),st=Math.abs(En(ws(Math.atan2(Tt,Ut)-Math.atan2(St.dy,St.dx)))),ct=E*st*Math.PI/180,at=Math.hypot(jt-St.ox,kt-St.oy);if(E>18&&st>35&&W<Math.max(5,ct*.35)&&P("stickJump",q,D.tick,0,`Δ${st.toFixed(0)}° 手指只动${W.toFixed(0)}px(弧长应${ct.toFixed(0)}px) o(${Math.round(St.ox)},${Math.round(St.oy)})→(${Math.round(jt)},${Math.round(kt)}) 原点位移${at.toFixed(0)}px p(${Math.round(wt)},${Math.round(G)}) raw(${Math.round(Ut)},${Math.round(Tt)}) id${L.stickId} ${At?"src=屏幕":"src=client"}`,K),At&&St.screenOk){const Ft=Math.hypot(L.stickPxX-St.x,L.stickPxY-St.y),Q=Math.hypot((L.stickScreenX-St.sx)/vt,(L.stickScreenY-St.sy)/vt);b+=Ft-Q,Math.abs(b)>20&&(P("stickDrift",q,D.tick,0,`client 相对屏幕漂移 ${b>0?"+":""}${b.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(L.stickPxX)},${Math.round(L.stickPxY)}) screen(${Math.round(L.stickScreenX)},${Math.round(L.stickScreenY)})`,K),b=0)}}k={id:L.stickId,ox:jt,oy:kt,cx:wt,cy:G,x:L.stickPxX,y:L.stickPxY,sx:L.stickScreenX,sy:L.stickScreenY,dx:Ut,dy:Tt,held:!0,screenOk:At}}else k=null,b=0;if(L.stickBad>A){const St=L.stickBad-A;P("stickBad",q,D.tick,0,`拦截 ${St} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${L.stickBad}）o(${Math.round(L.stickOriginX)},${Math.round(L.stickOriginY)}) p(${Math.round(L.stickPxX)},${Math.round(L.stickPxY)}) id${L.stickId??"-"}`,K)}A=L.stickBad,h=Y,f=j.moveYaw,d=xt},event(D,L){const X=Yp(D);N(D),o&&(D.type==="dash-ready"||D.type==="combo-reset"||D.type==="stepUp"||F(D.type,X,L,D.tick))},gesture(D){const L=`${D.button}.${D.kind}`;r.gestures[L]=(r.gestures[L]??0)+1,o&&(D.kind==="longPress"||D.kind==="doubleTap"||D.kind==="drag"||D.kind==="cancel")&&F(`g:${D.kind}`,`${D.button} ${D.heldMs.toFixed(0)}ms d${D.distance.toFixed(0)}px ${D.angleDeg.toFixed(0)}°`,T,w)},suspend(D){_=T*1e3+D,g=-1,m=-1},setEnabled(D){o=D,D||(h=null,k=null,g=-1,m=-1)},clear(){i.length=0,s.length=0,a.length=0,y={},l=-1e9,h=null,d=0,g=-1,m=-1,p=0,r.frames=0,r.wallMs=0,r.dtMax=0,r.spikes=0,r.stickActiveMs=0,r.attacks=0,r.hits=0,r.hurts=0,r.links=0,r.linkHits=0,r.rolls=0,r.blinks=0,r.channels=0,r.bolts=0,r.rings=0,r.bowCharges=0,r.jumps=0,r.resets=0,r.dirJumps=0,r.aimDrops=0,r.inTurns=0,r.inTurnMax=0,r.freezes=0,r.stickLosts=0,r.stickJumps=0,r.stickBads=0,r.stickDrifts=0,r.screenFrames=0,r.clientFrames=0,b=0,k=null,A=0;for(const D of Object.keys(r.gestures))delete r.gestures[D]},status(){const D=r.simS,L=a.some(X=>D-X.t<8&&(X.kind==="dirJump"||X.kind==="aimDrop"||X.kind==="moveFreeze"||X.kind==="stickLost"||X.kind==="stickJump"||X.kind==="stickBad"||X.kind==="stickDrift"));return{durationS:r.wallMs/1e3,frames:r.frames,events:s.length,anomalies:a.length,alert:L,enabled:o}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...r,gestures:{...r.gestures}},columns:Op,samples:i.slice(),events:s.slice(),anomalies:a.slice()}},summary:B}}const qp={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:7,headTurnRate:30,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},jp={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},Kp={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.05,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltGlowScale:2.5,boltTrailScale:3.4,slashThickness:.075,slashGlowOpacity:.34},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},Jp={core:qp,scene:jp,view:Kp};function Oc(n){return JSON.parse(JSON.stringify(n))}const Bc=Jp,Qp=Oc(Bc.core),ra=Oc(Bc.scene),un=Oc(Bc.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Fn{constructor(t,e,i,s,a="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),Fn.nextNameID=Fn.nextNameID||0,this.$name.id=`lil-gui-name-${++Fn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class tm extends Fn{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Fo(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const em={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Fo,toHexString:Fo},Ws={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},nm={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Ws.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Ws.toHexString(s)}},im={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Ws.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Ws.toHexString(s)}},sm=[em,Ws,nm,im];function am(n){return sm.find(t=>t.match(n))}class rm extends Fn{constructor(t,e,i,s){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=am(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=Fo(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Fr extends Fn{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class om extends Fn{constructor(t,e,i,s,a,r){super(t,e,i,"number"),this._initInput(),this.min(s),this.max(a);const o=r!==void 0;this.step(o?r:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const _=parseFloat(this.$input.value);isNaN(_)||(this._snapClampSetValue(_+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let r=!1,o,c,l,h,f;const d=5,u=x=>{o=x.clientX,c=l=x.clientY,r=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",v)},g=x=>{if(r){const _=x.clientX-o,y=x.clientY-c;Math.abs(y)>d?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(_)>d&&v()}if(!r){const _=x.clientY-l;f-=_*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}l=x.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",v)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,_,y,k)=>(p-x)/(_-x)*(k-y)+y,e=p=>{const x=this.$slider.getBoundingClientRect();let _=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(_)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=p=>{e(p.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let r=!1,o,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),r=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(o=p.touches[0].clientX,c=p.touches[0].clientY,r=!0):l(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=p=>{if(r){const x=p.touches[0].clientX-o,_=p.touches[0].clientY-c;Math.abs(x)>Math.abs(_)?l(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),g=400;let v;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const _=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+_),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(u,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class cm extends Fn{constructor(t,e,i,s){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class lm extends Fn{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const hm=`.lil-gui {
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
}`;function dm(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Hl=!1;class or{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:a="Controls",closeFolders:r=!1,injectStyles:o=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!Hl&&o&&(dm(hm),Hl=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,i,s,a){if(Object(i)===i)return new cm(this,t,e,i);const r=t[e];switch(typeof r){case"number":return new om(this,t,e,i,s,a);case"boolean":return new tm(this,t,e);case"string":return new lm(this,t,e);case"function":return new Fr(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,i=1){return new rm(this,t,e,i)}addFolder(t){const e=new or({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Fr||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Fr)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function um(n,t,e,i){const s=document.getElementById("debug-panel"),a=s?new or({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new or({title:"实验台 · 调试面板"}),r=n.config,o=[],c=[],l=I=>{const E=a.addFolder(I);return c.push(E),E},h=(I,E)=>{const W=I.addFolder(E);return o.push(W),W},f=l("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=l("移动 / 输入"),g=h(u,"基础移动参数");g.add(r,"moveSpeed",1,10,.1).name("移动速度"),g.add(r,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(r,"acceleration",1,40,.5).name("加速度"),g.add(r,"friction",1,40,.5).name("摩擦"),g.add(r,"gravity",5,60,.5).name("重力"),g.add(r,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(r,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(r,"characterRadius",.1,.8,.01).name("角色半径"),g.add(r,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(r,"strideLength",.3,3,.05).name("基础步幅"),g.add(r,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(r,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const v=h(u,"摇杆 / 输入");v.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),v.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=r.dash,p=h(u,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=r.separation,_=h(u,"角色间分离 / 挤压阻力");_.add(x,"iterations",1,8,1).name("迭代次数"),_.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),_.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),_.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),_.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const y=r.dummies,k=h(u,"假人 AI");k.add(y,"moveSpeed",.5,8,.1).name("移动速度"),k.add(y,"wanderRadius",.5,8,.1).name("游走半径"),k.add(y,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),k.add(y,"followStopDistance",.3,5,.1).name("跟随停距"),k.add(y,"keepDistance",1,10,.1).name("保持距离"),k.add(y,"keepDeadZone",.1,2,.05).name("保持死区"),k.add(y,"attackRange",.5,5,.1).name("攻击距离"),k.add(y,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),k.add(y,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const b=l("步态 / 停步"),A=h(b,"程序化步态");A.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),A.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),A.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),A.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),A.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),A.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),A.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),A.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),A.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),A.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),A.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),A.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),A.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),A.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),A.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),A.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const T=h(b,"停步收相 / 胸朝向");T.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),T.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),T.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),T.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),T.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const w=h(b,"停步惯性");w.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),w.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),w.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),w.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),w.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),w.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),w.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(b,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const P=h(b,"足部 IK"),F=t.ik;P.add(F,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),P.add(F,"weight",0,1,.01).name("钉地权重"),P.add(F,"attackScale",0,1,.01).name("攻击时权重倍率"),P.add(F,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const N=h(b,"惯性倾斜 / 盆骨"),B=t.lean;N.add(B,"accelGain",0,.1,.002).name("前后加速度增益"),N.add(B,"turnGain",0,.2,.005).name("绕圈侧倾增益"),N.add(B,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),N.add(B,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),N.add(B,"smoothing",1,30,1).name("倾斜平滑速率"),N.add(B,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),N.add(B,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),N.add(B,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),N.add(B,"crouchSmoothing",1,30,1).name("下沉平滑速率");const D=r.orientation,L=h(b,"朝向 / 下盘带转");L.add(D,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),L.add(D,"headTurnRate",.5,40,.5).name("头部转向速率"),L.add(D,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),L.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),L.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),L.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const X=h(b,"原地转身 / 停步偏差 (v9s)"),H=r.turnInPlace;X.add(H,"enabled").name("启用原地转身 (关=纯插值)"),X.add(H,"triggerDeg",20,180,5).name("触发夹角 (°)"),X.add(H,"settleDeg",0,60,1).name("转身保留余角 (°)"),X.add(H,"durationSec",.1,1.5,.02).name("转身时长 (s)"),X.add(H,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),X.add(H,"inputDeadZone",0,.5,.01).name("起步输入死区"),X.add(H,"armSec",0,.5,.01).name("触发防抖 (s)"),X.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),X.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),X.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),X.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),X.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),X.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const q=l("战斗 / 受击"),j=r.combat,ot=h(q,"连击 / 武器"),dt=ot.add(n.combat,"weapon",Li).name("当前武器");ot.add(j,"comboWindow",.1,2,.05).name("连击窗口 (s)"),ot.add(j,"settle",0,.8,.01).name("段间停顿 (s)"),ot.add(j,"attackMoveScale",0,1,.01).name("攻击时移动比例"),ot.add(j,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),ot.add(j,"cancelWindow",0,1,.01).name("取消窗口 (s)"),ot.add(j,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),ot.add(j,"autoCombo").name("按住自动连击"),ot.add(j.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),ot.add(j.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),ot.add(j.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),ot.add(j.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),ot.add(j.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),ot.add(j.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const xt=r.abilities;ot.add(xt.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),ot.add(xt.arcane,"speed",3,24,.5).name("飞弹速度"),ot.add(xt.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),ot.add(xt.ring,"radius",.5,5,.1).name("电环半径"),ot.add(xt.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),ot.add(xt.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const Y=h(q,"攻击动作 / 跨步 / 落地");Y.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),Y.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),Y.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const tt=t.animation.stride;Y.add(tt,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),Y.add(tt,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),Y.add(tt,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),Y.add(tt,"cycles",1,3,1).name("每段跨步周期数"),Y.add(tt,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),Y.add(tt,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),Y.add(tt,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),Y.add(tt,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),Y.add(tt,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),Y.add(tt,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),Y.add(tt,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),Y.add(tt,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),Y.add(tt,"heavyScale",0,1,.01).name("大剑重击收敛系数"),Y.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),Y.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),Y.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),Y.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),Y.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),Y.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),Y.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),Y.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),Y.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),Y.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),Y.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),Y.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const ut=h(q,"武器握持");ut.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),ut.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),ut.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),ut.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const K=r.hits,ft=h(q,"命中 / 受击 / 击退");ft.add(K,"arcDeg",10,120,5).name("命中扇区半角 (°)"),ft.add(K,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),ft.add(K,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),ft.add(K,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),ft.add(K.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),ft.add(K.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),ft.add(K,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),ft.add(K,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const It=r.targeting,Ct=h(q,"目标辅助");Ct.add(It,"targetAssist").name("启用目标辅助"),Ct.add(It,"range",1,14,.5).name("锁定范围 (m)"),Ct.add(It,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Ct.add(It,"frontBias",0,4,.1).name("朝向加权"),Ct.add(It,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Ct.add(It,"maxLungeScale",1,3,.1).name("前冲最大放大");const vt=h(q,"受击分层"),At=t.hurt;vt.add(At,"enabled").name("启用分层受击 (关=旧版对照)"),vt.add(At,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),vt.add(At,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),vt.add(At,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),vt.add(At,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),vt.add(At,"upperShiftScale",0,1,.01).name("上身位移缩放"),vt.add(At,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),vt.add(At.hitHeight,"light",0,1,.01).name("轻击命中部位"),vt.add(At.hitHeight,"heavy",0,1,.01).name("重击命中部位"),vt.add(At.hitHeight,"knock",0,1,.01).name("击退命中部位"),vt.add(At,"leanLight",0,1.5,.01).name("轻击力度"),vt.add(At,"leanHeavy",0,1.5,.01).name("重击力度"),vt.add(At,"leanKnock",0,1.5,.01).name("击退力度"),vt.add(At,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:At.abdomen},{name:"打肩 (shoulder)",p:At.shoulder}].map(({name:I,p:E})=>{const W=h(vt,I);return W.add(E,"upperPitch",0,2,.01).name("上身前后倾斜"),W.add(E,"upperRoll",0,2,.01).name("上身侧倾"),W.add(E,"upperYaw",0,1.5,.01).name("肩部扭转"),W.add(E,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),W.add(E,"shift",0,.8,.01).name("身体反应位移"),W.add(E,"drop",0,.4,.01).name("整体下沉"),W.add(E,"back",0,.4,.01).name("屁股向后"),W.add(E,"knee",0,1.6,.01).name("屈膝"),W.add(E,"hip",0,1,.01).name("髋前倾"),W.add(E,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),W});const wt=h(q,"派生招"),G=r.links;wt.add(G,"enabled").name("总开关 (false=旧连击)"),wt.add(G.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),wt.add(G.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),wt.add(G.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),wt.add(G,"sharedCooldown",0,3,.05).name("共享 CD (s)"),wt.add(G,"triggerWhileSprinting").name("长跑中可直接触发"),wt.add(G.search,"range",1,14,.1).name("索敌距离 (m)"),wt.add(G.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),wt.add(G.search,"stopDistance",0,3,.05).name("停住距离 (m)");const jt=G.moves["sword-shield"];jt&&(wt.add(jt,"enabled").name("剑盾盾击"),wt.add(jt,"distance",0,8,.1).name("冲锋极限 (m)"),wt.add(jt,"windup",0,.5,.01).name("前摇 (s)"),wt.add(jt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),wt.add(jt,"recovery",0,.8,.01).name("收势 (s)"),wt.add(jt.hit,"radius",0,4,.05).name("命中半径 (m)"),wt.add(jt.hit,"width",0,2,.05).name("扫掠半径 (m)"),wt.add(jt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),wt.add(jt.hit,"duration",0,1.5,.01).name("僵直 (s)")),wt.add(r.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const kt=l("相机"),Ut=h(kt,"基础");Ut.add(t.camera,"pitchDeg",20,80,1).name("俯角"),Ut.add(t.camera,"yawDeg",-180,180,1).name("方位角"),Ut.add(t.camera,"distance",6,35,.5).name("距离"),Ut.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),Ut.add(t.camera,"fov",25,90,1).name("FOV");const Tt=r.camera,St=h(kt,"智能构图");St.add(Tt,"radius",2,18,.5).name("威胁评估半径 (m)"),St.add(Tt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),St.add(Tt,"saturation",.5,8,.1).name("威胁归一化饱和"),St.add(Tt,"pushIn",0,.5,.01).name("无威胁推进比例"),St.add(Tt,"maxPullback",0,1,.02).name("最大拉远比例"),St.add(Tt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),St.add(Tt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),St.add(Tt,"framingBias",0,1,.05).name("威胁质心平移系数"),St.add(Tt,"attackBoost",0,2,.05).name("挥砍中额外加权"),St.add(Tt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),St.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Pt=h(kt,"缩放");return Pt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),Pt.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),Pt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),Pt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),Pt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),Pt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),Pt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),Pt.add({reset:i.resetZoom},"reset").name("缩放归 1"),o.forEach(I=>I.close()),c.forEach(I=>I.close()),a.close(),{gui:a,refreshWeapon:()=>dt.updateDisplay()}}function fm(n,t,e){let i=null,s=Number.POSITIVE_INFINITY;for(const a of n){const r=Math.hypot(t-a.x,e-a.z);r<=a.radius&&r<s&&(i=a,s=r)}return i}function pm(n,t){return n.find(e=>e.id===t)??null}function Gl(n,t,e){if(n.length===0)return null;const i=[...n].sort((o,c)=>o.index-c.index),s=i.findIndex(o=>o.id===t),a=e<0?-1:1,r=s<0?a>0?0:i.length-1:(s+a+i.length)%i.length;return i[r]??null}function mm({stations:n,world:t,view:e,container:i,onResetZoom:s}){const a=i??document.getElementById("lab-panel");let r=null,o=null;const c=new Map,l=document.createElement("div");l.id="lab-toast",l.setAttribute("aria-live","polite"),document.body.appendChild(l);let h=0;function f(m){l.textContent=`${m.index} · ${m.name} — ${m.hint}`,l.style.borderColor=m.color,l.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>l.classList.remove("is-on"),5e3)}function d(){return fm(n,t.character.position.x,t.character.position.z)}function u(){const m=d(),p=(m==null?void 0:m.id)??null;if(p===r)return;const x=r!==null;r=p;for(const[_,y]of c)y.classList.toggle("is-active",_===p);o&&(o.textContent=m?`${m.index} · ${m.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",o.style.color=m?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),m?f(m):x&&l.classList.remove("is-on")}function g(m){const p=typeof m=="number"?n.find(x=>x.index===m)??null:pm(n,m);return p?(rp(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),u(),!0):!1}function v(){Pd(t)}if(a){a.textContent="";const m=document.createElement("div");m.className="lab-head",m.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",m.appendChild(p),a.appendChild(m);for(const y of[...n].sort((k,b)=>k.index-b.index)){const k=document.createElement("button");k.type="button",k.className="lab-row",k.dataset.station=y.id,k.dataset.uiButton="",k.style.setProperty("--lab-color",y.color),k.setAttribute("aria-label",`传送到工位 ${y.index}：${y.name}`);const b=document.createElement("span");b.className="lab-idx",b.textContent=String(y.index);const A=document.createElement("span");A.className="lab-name",A.textContent=y.name,k.append(b,A),k.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),g(y.id)}),a.appendChild(k),c.set(y.id,k)}o=document.createElement("div"),o.className="lab-hint",a.appendChild(o);const x=document.createElement("div");x.className="lab-foot";const _=document.createElement("button");if(_.type="button",_.className="lab-btn",_.dataset.uiButton="",_.textContent="召回假人",_.setAttribute("aria-label","召回全部假人回到各自工位"),_.addEventListener("pointerdown",y=>{y.preventDefault(),y.stopPropagation(),v()}),x.appendChild(_),s){const y=document.createElement("button");y.type="button",y.className="lab-btn",y.dataset.uiButton="",y.textContent="镜头归位",y.setAttribute("aria-label","把镜头缩放恢复到默认"),y.addEventListener("pointerdown",k=>{k.preventDefault(),k.stopPropagation(),s()}),x.appendChild(y)}a.appendChild(x)}return window.addEventListener("keydown",m=>{var p,x;if(!(m.metaKey||m.ctrlKey||m.altKey))if(m.key==="["){const _=Gl(n,((p=d())==null?void 0:p.id)??r,-1);_&&g(_.id)}else if(m.key==="]"){const _=Gl(n,((x=d())==null?void 0:x.id)??r,1);_&&g(_.id)}else m.key==="\\"&&v()}),u(),{goto:g,current:d,tick:u,recall:v,element:a}}const Nr=Math.PI*2,In={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},gm=45,xm=50;function vm(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function As(n,t,e){const i=vm(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function _m(n,t){return Math.atan2(n,-t)*180/Math.PI}function Vl(n,t){return Math.abs(((n-t)%360+540)%360-180)}function oa(n){return(n%360+360)%360}const ym={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function Mm(n,t,e,i=8){const s=n.character,a=t.intents,r=Math.hypot(a.moveX,a.moveZ),o=Math.hypot(t.stickRawX,t.stickRawY),c=s.velocity,l=Math.hypot(c.x,c.z),h=r>.001?As(a.moveX,a.moveZ,e):null,f=l>.15?As(c.x,c.z,e):null,d=As(Math.sin(s.facing),Math.cos(s.facing),e),u=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?As(a.aimX,a.aimZ,e):null,g=n.targeting,v=g.hasTarget?As(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=h!==null&&f!==null?Vl(h,f):null,p=h!==null?Vl(h,d):null,x=m!==null&&m>gm&&r>=.35&&l>=.4;return{inDeg:h,inLen:Math.min(1,r),rawDeg:o>.02?_m(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,o),stickHeld:t.stickHeld,moveDeg:f,speed:l,faceDeg:d,lockDeg:v,lockId:g.targetId,lockDist:g.targetDist,aimDeg:u,gapMove:m,gapFace:p,warnMove:x}}function Xl(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>xm&&(n.inLen>=.35||n.speed>=.4)}const Wl="harness.dirDebug";function Sm(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const s=e.querySelector("#dirdbg-canvas"),a=e.querySelector("#dirdbg-toggle"),r={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},o=s.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(Wl)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),a&&(a.textContent=c?"方向 ⌄":"方向 ▸",a.setAttribute("aria-expanded",String(c)))}l();function h(_){if(c=_,!t)try{window.localStorage.setItem(Wl,_?"1":"0")}catch{}l()}a==null||a.addEventListener("pointerdown",_=>{_.preventDefault(),_.stopPropagation(),h(!c)}),t||window.addEventListener("keydown",_=>{_.key.toLowerCase()==="v"&&!_.metaKey&&!_.ctrlKey&&h(!c)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;s.width=Math.round(d*f),s.height=Math.round(d*f);let u=ym,g=0,v="",m=8;function p(_){if(!o)return;const y=d,k=d,b=y/2,A=k/2,T=Math.min(y,k)/2-13;o.setTransform(f,0,0,f,0,0),o.clearRect(0,0,y,k),o.beginPath(),o.arc(b,A,T,0,Nr),o.fillStyle="rgba(8, 12, 17, 0.5)",o.fill(),o.lineWidth=1,o.strokeStyle=_.warnMove?"rgba(251, 191, 36, 0.85)":In.ring,o.stroke(),o.strokeStyle=In.grid,o.beginPath(),o.moveTo(b-T,A),o.lineTo(b+T,A),o.moveTo(b,A-T),o.lineTo(b,A+T),o.stroke();for(let F=0;F<8;F++){const N=F*Math.PI/4,B=b+Math.sin(N)*(T-3),D=A-Math.cos(N)*(T-3),L=b+Math.sin(N)*T,X=A-Math.cos(N)*T;o.beginPath(),o.moveTo(B,D),o.lineTo(L,X),o.stroke()}const w=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;w>0&&(o.save(),o.setLineDash([2,3]),o.strokeStyle=In.dead,o.beginPath(),o.arc(b,A,T*w,0,Nr),o.stroke(),o.restore());const M=(F,N,B,D,L=!1,X=1)=>{const H=F*Math.PI/180,q=Math.sin(H),j=-Math.cos(H),ot=T*Math.max(.14,Math.min(1,N)),dt=b+q*T*.14,xt=A+j*T*.14,Y=b+q*ot,tt=A+j*ot;if(o.save(),o.globalAlpha=X,o.strokeStyle=B,o.fillStyle=B,o.lineWidth=D,o.lineCap="round",L&&o.setLineDash([3,3]),o.beginPath(),o.moveTo(dt,xt),o.lineTo(Y,tt),o.stroke(),!L&&ot>T*.3){const ut=-j,K=q,ft=5.2;o.beginPath(),o.moveTo(Y+q*1.5,tt+j*1.5),o.lineTo(Y-q*ft+ut*ft*.72,tt-j*ft+K*ft*.72),o.lineTo(Y-q*ft-ut*ft*.72,tt-j*ft-K*ft*.72),o.closePath(),o.fill()}o.restore()},P=(F,N)=>{const B=F*Math.PI/180,D=Math.sin(B),L=-Math.cos(B),X=-L,H=D,q=T+1.5,j=q+6.5;o.save(),o.fillStyle=N,o.strokeStyle=N,o.lineWidth=1,o.beginPath(),o.moveTo(b+D*j,A+L*j),o.lineTo(b+D*q+X*4,A+L*q+H*4),o.lineTo(b+D*q-X*4,A+L*q-H*4),o.closePath(),o.fill(),o.restore()};_.lockDeg!==null&&M(_.lockDeg,1,In.lock,1,!0,.7),_.rawDeg!==null&&_.stickHeld&&M(_.rawDeg,_.rawLen,In.raw,1,!0,.9),_.aimDeg!==null&&M(_.aimDeg,1,In.aim,1.6,!0,.95),M(_.faceDeg,1,In.face,1.1,!0,.55),_.moveDeg!==null&&M(_.moveDeg,_.speed/Math.max(1,m),In.move,5.5,!1,.8),_.inDeg!==null&&M(_.inDeg,_.inLen,In.input,2.2),P(_.faceDeg,In.face),o.beginPath(),o.arc(b,A,2.2,0,Nr),o.fillStyle="rgba(220, 235, 248, 0.85)",o.fill()}function x(_,y){const k=T=>T===null?"-":String(Math.round(oa(T)));r.in.textContent=`入 ${k(_.inDeg)}`,r.mv.textContent=`移 ${k(_.moveDeg)}`,r.fc.textContent=`面 ${k(_.faceDeg)}`;const b=T=>T===null?"-":`${Math.round(T)}°`,A=[`Δ入→移 ${b(_.gapMove)}`,`Δ入→面 ${b(_.gapFace)}`];_.speed>.05&&A.push(`v${_.speed.toFixed(1)}`),_.lockDeg!==null&&A.push(`锁#${_.lockId} ${_.lockDist.toFixed(1)}m`),_.aimDeg!==null&&A.push("拖拽瞄准"),r.gap.textContent=A.join("  "),e.classList.toggle("is-warn",_.warnMove||Xl(_,y))}return{update(_,y,k){if(!c)return;m=Math.max(1,_.config.moveSpeed*Math.max(1,_.config.sprintMultiplier));const b=Mm(_,y,k,m);u=b;const A=_.combat.phase!=="idle";p(b);const T=performance.now(),w=`${b.inDeg}|${b.moveDeg}|${b.faceDeg}|${b.lockId}|${b.aimDeg}|${b.warnMove}|${b.speed.toFixed(1)}`;(T-g>90||w!==v)&&(g=T,v=w,x(b,A),e.dataset.in=b.inDeg===null?"":oa(b.inDeg).toFixed(1),e.dataset.mv=b.moveDeg===null?"":oa(b.moveDeg).toFixed(1),e.dataset.fc=oa(b.faceDeg).toFixed(1),e.dataset.warn=b.warnMove||Xl(b,A)?"1":"0")},setEnabled:h,toggle(){return h(!c),c},enabled:()=>c,last:()=>u}}const bm=6,Em=480,$l=240,Yl=92,wm=18;function Am(n,t,e,i){const s=t-n;return{t:i,speed:t,drive:t,raw:t,dv:s,accel:e>1e-4?s/e:0,busy:!1}}function Tm(n,t,e,i){const a=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:a,speed:Math.min(a,Math.max(1,i))}}function Rm(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function Cm(n={}){const t=Math.max(1,n.windowS??bm),e=Math.max(60,n.capacity??Em),i=Math.max(1,n.speedCap??wm),s=!!(n.container&&n.toggle),a=n.container??document.createElement("div");a.id="motiondbg",n.container||(a.setAttribute("data-ui-region",""),document.body.appendChild(a));const r=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");a.innerHTML=s?`<div id="motiondbg-body">${r}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${r}</div>`].join("");const o=n.toggle??a.querySelector("#motiondbg-toggle"),c=a.querySelector("#motiondbg-graph"),l=a.querySelector("#motiondbg-read"),h=a.querySelector("#motiondbg-window"),f=a.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=c.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round($l*u),c.height=Math.round(Yl*u);const g=Sm({deadZone:n.deadZone,container:f,embedded:!0});let v=!1;function m(T){v=T,a.classList.toggle("is-off",!T),!s&&o&&(o.textContent=T?"手感 ⌄":"手感 ▸",o.setAttribute("aria-expanded",String(T)),o.setAttribute("aria-label",T?"收起手感调试面板":"展开手感调试面板"))}m(!1),s||(o==null||o.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),m(!v)}),window.addEventListener("keydown",T=>{T.key.toLowerCase()==="v"&&!T.metaKey&&!T.ctrlKey&&m(!v)}));const p=[];let x=0,_=null,y=-1,k={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function b(T){const w=T-t;let M=0;for(;M<p.length&&p[M].t<w;)M++;return p.slice(M)}function A(T,w){if(!d)return;const M=$l,P=Yl;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,M,P),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,P);const F=4,N=4,B=M-F-N,D=9,L=46,X=62,H=22,q=w-t,j=K=>F+Math.max(0,Math.min(1,(K-q)/t))*B;for(let K=0;K<T.length;K++){if(!T[K].busy)continue;const ft=j(T[K].t),It=K+1<T.length?j(T[K+1].t):ft+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(ft,D,Math.max(2,It-ft),L)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const K of[D,D+L/2,D+L])d.moveTo(F,K),d.lineTo(M-N,K);d.moveTo(F,X+H/2),d.lineTo(M-N,X+H/2),d.stroke();const dt=Math.max(1,...T.map(K=>K.speed),...T.map(K=>K.drive))*1.15,xt=K=>D+L-K/dt*L;if(T.length>1){d.beginPath(),d.moveTo(j(T[0].t),xt(T[0].speed));for(let K=1;K<T.length;K++)d.lineTo(j(T[K].t),xt(T[K].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(j(T[T.length-1].t),D+L),d.lineTo(j(T[0].t),D+L),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(j(T[0].t),xt(T[0].drive));for(let K=1;K<T.length;K++)d.lineTo(j(T[K].t),xt(T[K].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let Y=.02;for(const K of T)Y=Math.max(Y,Math.abs(K.dv));Y*=1.1;const tt=X+H/2,ut=H/2;for(const K of T){const ft=Math.min(ut,Math.abs(K.dv)/Y*ut);d.fillStyle=K.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(j(K.t)-.7,K.dv>=0?tt-ft:tt,1.4,Math.max(.5,ft))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(dt.toFixed(1),F+2,D+8),d.fillText("v",F+2,D+L-2),d.fillText("Δv",F+2,X+9),d.textAlign="right",d.fillText("0",M-N-2,D+L-2),d.textAlign="left"}return{dirDebug:g,update(T,w,M){const P=performance.now()/1e3,F=y<0?1/60:Math.max(1e-4,Math.min(.25,P-y));y=P;const N=T.character,B={x:N.position.x,z:N.position.z},D=Math.hypot(N.velocity.x,N.velocity.z),{speed:L,raw:X}=_?Tm(_,B,F,i):{speed:0,raw:0},H=Am(x,L,F,P);H.drive=D,H.raw=X,H.busy=Rm(T),_=B,x=L,p.push(H),p.length>e&&p.shift();const q=b(P);let j=0;for(const ot of q)j=Math.max(j,ot.speed);if(k={speed:L,drive:D,raw:X,dv:H.dv,accel:H.accel,peak:j,samples:q.length,windowS:t,busy:H.busy},g.update(T,w,M),v){A(q,P);const ot=H.dv>=0?"+":"";l.textContent=`v ${L.toFixed(2)} · 驱 ${D.toFixed(2)} · 峰 ${j.toFixed(2)} · Δv ${ot}${H.dv.toFixed(3)} · ${q.length} 帧`}},setEnabled:m,toggle(){return m(!v),v},enabled:()=>v,last:()=>({...k}),samples:()=>b(performance.now()/1e3).map(T=>({...T}))}}const Pm=["剑盾","双剑","大剑","法杖","弓"],Lm={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function Dm(n){return{update(t,e,i,s,a,r,o=!1){const c=t.character,l=c.position,h=c.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=At=>At.toFixed(2),g=At=>(At*180/Math.PI).toFixed(0),v=Pm[Li.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),p="|".repeat(m)+".".repeat(10-m),x=t.dash,_=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,y=x.phase==="active"?`${x.kind}@${_.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,k=s.intents.aimActive?`(${u(s.intents.aimX)},${u(s.intents.aimZ)})`:"-",b=h.x*Math.sin(c.bodyYaw)+h.z*Math.cos(c.bodyYaw),A=h.x*Math.cos(c.bodyYaw)-h.z*Math.sin(c.bodyYaw),T=Math.abs(b)+Math.abs(A)+1e-6,w=Math.round(Math.abs(A)/T*100),M=`strafe ${w}%${b<-.05?" back":""}`,P=t.camera,F=`threat ${(P.threat*100).toFixed(0)}%  dist×${u(P.distanceScale)}  off (${u(P.offsetX)},${u(P.offsetZ)})  pitch +${u(P.pitchDelta)}°  n=${P.threatCount}`,N=r?u(r.attackBlend):"-",B=r==null?void 0:r.attackWeights,D=B?`gw ${u(B.gaitScale)}  lw ${u(B.attackLegWeight)}  spd ${u(B.driveSpeed)}`:"-",L=B?`${u(B.gaitScale)}/${u(B.attackLegWeight)}`:"-",X=r?`${r.landing.kind} ${u(r.landing.pulse)} t${u(r.landing.remaining)} vy${u(r.landing.impactVy)}`:"-",H=r?`${r.landing.kind}/${u(r.landing.pulse)}`:"-",q=(r==null?void 0:r.zoom)!==void 0?`zoom ×${u(r.zoom)}`:"-",j=r==null?void 0:r.hurt,ot=j?`hurt ${t.playerHurt.type}  部位h${u(j.hitHeight)}  脉冲p${u(j.pulse)}  上身${u(j.upperShift)}  重心${u(j.comShift)}  后坐${u(j.pelvisBack)}  屈膝${u(j.knee)}`:"-",dt=j?`${u(j.hitHeight)}/${u(j.pulse)}/${u(j.knee)}`:"-",xt=r==null?void 0:r.ik,Y=xt?`${xt.active?"on":"off"} w${u(xt.weight)} e${u(xt.maxError)}`:"-",tt=t.playerLink,ut=`link ${tt.kind||"-"}  ${tt.phase}  prog ${u(tt.progress)}  win ${u(tt.linkWindow)}s  cd ${u(tt.cooldown)}s  hits ${tt.hitIds.length}  travel ${u(tt.travelled)}/${u(tt.travel)}m  id ${tt.id}`,K=`${tt.phase}/${tt.kind||"-"}/w${u(tt.linkWindow)}`,ft=s.lastGesture,It=ft?`${ft.button} ${ft.kind} ${ft.heldMs.toFixed(0)}ms d${ft.distance.toFixed(0)}px ${ft.angleDeg.toFixed(0)}° taps${ft.taps}`:"-",Ct=t.dummies.map(At=>`${At.id}:${Lm[At.mode]}`).join("  ");if(o){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${v} ${f.phase} · lk ${tt.phase}${tt.kind?`/${tt.kind}`:""} w${u(tt.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(l.x)},${u(l.y)},${u(l.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  st${w}%  stick(${u(s.stickX)},${u(s.stickY)}) ${s.source}  str${u(c.stride)}`,`weapon ${v}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${y}  ab ${N}  gw/lw ${L}  land ${H}  ik ${Y}`,`aim ${k}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${dt}`,`dummies ${Ct}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${u(P.distanceScale)}  ${q}  lk ${K}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(a.timeScale)}${a.paused?" [P]":""}  g ${It}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(l.x)}, ${u(l.y)}, ${u(l.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${g(c.facing)}deg   atkBlend ${N}   ${D}   land ${X}`,ot,`ik ${Y}  clamped ${xt?xt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  (head-body ${g(c.headYaw-c.bodyYaw)})  ${M}`,`move (${u(s.intents.moveX)}, ${u(s.intents.moveZ)})  stick (${u(s.stickX)}, ${u(s.stickY)})  ${s.source}  aim ${k}`,`weapon ${v}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${_.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,ut,`camera ${F}  ${q}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Ct}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${It}`].join(`
`)}}}const ca=["lab","hud","motion","debug"],Zl={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},ql={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function Im(n){var c;const t=Object.fromEntries(ca.map(l=>[l,document.getElementById(ql[l].toggle)])),e=Object.fromEntries(ca.map(l=>[l,document.getElementById(ql[l].panel)]));let i={},s=null;function a(){var l,h,f;for(const d of ca){const u=s===d,g=t[d],v=e[d];g&&(g.setAttribute("aria-expanded",String(u)),g.textContent=`${Zl[d].short} ${u?"▾":"▸"}`,g.setAttribute("aria-label",`${u?"收起":"展开"}${Zl[d].full}`)),v&&v.classList.toggle("is-open",u)}n.classList.toggle("is-compact",s!=="hud"),(l=i.motion)==null||l.setEnabled(s==="motion"),s==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function r(l){s=s===l?null:l,a()}function o(){s!==null&&(s=null,a())}for(const l of ca)(c=t[l])==null||c.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),r(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&r("motion")}),a(),{hudCompact:()=>s!=="hud",register(l){i=l,a()},toggle:r,closeAll:o,isOpen:l=>s===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Hc="170",km=0,jl=1,Um=2,Ud=1,Fd=2,Wn=3,li=0,on=1,we=2,oi=0,ls=1,wi=2,Kl=3,Jl=4,Fm=5,Ai=100,Nm=101,zm=102,Om=103,Bm=104,Hm=200,Gm=201,Vm=202,Xm=203,No=204,zo=205,Wm=206,$m=207,Ym=208,Zm=209,qm=210,jm=211,Km=212,Jm=213,Qm=214,Oo=0,Bo=1,Ho=2,fs=3,Go=4,Vo=5,Xo=6,Wo=7,Gc=0,t0=1,e0=2,ci=0,n0=1,i0=2,s0=3,a0=4,r0=5,o0=6,c0=7,Nd=300,ps=301,ms=302,$o=303,Yo=304,pr=306,Zo=1e3,Ri=1001,qo=1002,Pn=1003,l0=1004,la=1005,Un=1006,zr=1007,Ci=1008,Kn=1009,zd=1010,Od=1011,$s=1012,Vc=1013,Di=1014,Zn=1015,ta=1016,Xc=1017,Wc=1018,gs=1020,Bd=35902,Hd=1021,Gd=1022,Cn=1023,Vd=1024,Xd=1025,hs=1026,xs=1027,Wd=1028,$c=1029,$d=1030,Yc=1031,Zc=1033,Va=33776,Xa=33777,Wa=33778,$a=33779,jo=35840,Ko=35841,Jo=35842,Qo=35843,tc=36196,ec=37492,nc=37496,ic=37808,sc=37809,ac=37810,rc=37811,oc=37812,cc=37813,lc=37814,hc=37815,dc=37816,uc=37817,fc=37818,pc=37819,mc=37820,gc=37821,Ya=36492,xc=36494,vc=36495,Yd=36283,_c=36284,yc=36285,Mc=36286,h0=3200,d0=3201,Zd=0,u0=1,ai="",Ke="srgb",_s="srgb-linear",mr="linear",ge="srgb",Gi=7680,Ql=519,f0=512,p0=513,m0=514,qd=515,g0=516,x0=517,v0=518,_0=519,Sc=35044,th="300 es",qn=2e3,cr=2001;class ys{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}}const We=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let eh=1234567;const ds=Math.PI/180,Ys=180/Math.PI;function Nn(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(We[n&255]+We[n>>8&255]+We[n>>16&255]+We[n>>24&255]+"-"+We[t&255]+We[t>>8&255]+"-"+We[t>>16&15|64]+We[t>>24&255]+"-"+We[e&63|128]+We[e>>8&255]+"-"+We[e>>16&255]+We[e>>24&255]+We[i&255]+We[i>>8&255]+We[i>>16&255]+We[i>>24&255]).toLowerCase()}function Ve(n,t,e){return Math.max(t,Math.min(e,n))}function qc(n,t){return(n%t+t)%t}function y0(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function M0(n,t,e){return n!==t?(e-n)/(t-n):0}function zs(n,t,e){return(1-e)*n+e*t}function S0(n,t,e,i){return zs(n,t,1-Math.exp(-e*i))}function b0(n,t=1){return t-Math.abs(qc(n,t*2)-t)}function E0(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function w0(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function A0(n,t){return n+Math.floor(Math.random()*(t-n+1))}function T0(n,t){return n+Math.random()*(t-n)}function R0(n){return n*(.5-Math.random())}function C0(n){n!==void 0&&(eh=n);let t=eh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function P0(n){return n*ds}function L0(n){return n*Ys}function D0(n){return(n&n-1)===0&&n!==0}function I0(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function k0(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function U0(n,t,e,i,s){const a=Math.cos,r=Math.sin,o=a(e/2),c=r(e/2),l=a((t+i)/2),h=r((t+i)/2),f=a((t-i)/2),d=r((t-i)/2),u=a((i-t)/2),g=r((i-t)/2);switch(s){case"XYX":n.set(o*h,c*f,c*d,o*l);break;case"YZY":n.set(c*d,o*h,c*f,o*l);break;case"ZXZ":n.set(c*f,c*d,o*h,o*l);break;case"XZX":n.set(o*h,c*g,c*u,o*l);break;case"YXY":n.set(c*u,o*h,c*g,o*l);break;case"ZYZ":n.set(c*g,c*u,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Rn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function fe(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const nh={DEG2RAD:ds,RAD2DEG:Ys,generateUUID:Nn,clamp:Ve,euclideanModulo:qc,mapLinear:y0,inverseLerp:M0,lerp:zs,damp:S0,pingpong:b0,smoothstep:E0,smootherstep:w0,randInt:A0,randFloat:T0,randFloatSpread:R0,seededRandom:C0,degToRad:P0,radToDeg:L0,isPowerOfTwo:D0,ceilPowerOfTwo:I0,floorPowerOfTwo:k0,setQuaternionFromProperEuler:U0,normalize:fe,denormalize:Rn};class zt{constructor(t=0,e=0){zt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Ve(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*i-r*s+t.x,this.y=a*s+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Jt{constructor(t,e,i,s,a,r,o,c,l){Jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,r,o,c,l)}set(t,e,i,s,a,r,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=a,h[5]=c,h[6]=i,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,r=i[0],o=i[3],c=i[6],l=i[1],h=i[4],f=i[7],d=i[2],u=i[5],g=i[8],v=s[0],m=s[3],p=s[6],x=s[1],_=s[4],y=s[7],k=s[2],b=s[5],A=s[8];return a[0]=r*v+o*x+c*k,a[3]=r*m+o*_+c*b,a[6]=r*p+o*y+c*A,a[1]=l*v+h*x+f*k,a[4]=l*m+h*_+f*b,a[7]=l*p+h*y+f*A,a[2]=d*v+u*x+g*k,a[5]=d*m+u*_+g*b,a[8]=d*p+u*y+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*r*h-e*o*l-i*a*h+i*o*c+s*a*l-s*r*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=h*r-o*l,d=o*c-h*a,u=l*a-r*c,g=e*f+i*d+s*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=f*v,t[1]=(s*l-h*i)*v,t[2]=(o*i-s*r)*v,t[3]=d*v,t[4]=(h*e-s*c)*v,t[5]=(s*a-o*e)*v,t[6]=u*v,t[7]=(i*c-l*e)*v,t[8]=(r*e-i*a)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(i*c,i*l,-i*(c*r+l*o)+r+t,-s*l,s*c,-s*(-l*r+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Or.makeScale(t,e)),this}rotate(t){return this.premultiply(Or.makeRotation(-t)),this}translate(t,e){return this.premultiply(Or.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Or=new Jt;function jd(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function lr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function F0(){const n=lr("canvas");return n.style.display="block",n}const ih={};function Us(n){n in ih||(ih[n]=!0,console.warn(n))}function N0(n,t,e){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:i()}}setTimeout(a,e)})}function z0(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function O0(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const re={enabled:!0,workingColorSpace:_s,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ge&&(n.r=jn(n.r),n.g=jn(n.g),n.b=jn(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ge&&(n.r=us(n.r),n.g=us(n.g),n.b=us(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===ai?mr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function jn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function us(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const sh=[.64,.33,.3,.6,.15,.06],ah=[.2126,.7152,.0722],rh=[.3127,.329],oh=new Jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ch=new Jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);re.define({[_s]:{primaries:sh,whitePoint:rh,transfer:mr,toXYZ:oh,fromXYZ:ch,luminanceCoefficients:ah,workingColorSpaceConfig:{unpackColorSpace:Ke},outputColorSpaceConfig:{drawingBufferColorSpace:Ke}},[Ke]:{primaries:sh,whitePoint:rh,transfer:ge,toXYZ:oh,fromXYZ:ch,luminanceCoefficients:ah,outputColorSpaceConfig:{drawingBufferColorSpace:Ke}}});let Vi;class B0{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Vi===void 0&&(Vi=lr("canvas")),Vi.width=t.width,Vi.height=t.height;const i=Vi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Vi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=lr("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=jn(a[r]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(jn(e[i]/255)*255):e[i]=jn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let H0=0;class Kd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:H0++}),this.uuid=Nn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Br(s[r].image)):a.push(Br(s[r]))}else a=Br(s);i.url=a}return e||(t.images[this.uuid]=i),i}}function Br(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?B0.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let G0=0;class Qe extends ys{constructor(t=Qe.DEFAULT_IMAGE,e=Qe.DEFAULT_MAPPING,i=Ri,s=Ri,a=Un,r=Ci,o=Cn,c=Kn,l=Qe.DEFAULT_ANISOTROPY,h=ai){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:G0++}),this.uuid=Nn(),this.name="",this.source=new Kd(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new zt(0,0),this.repeat=new zt(1,1),this.center=new zt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Nd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Zo:t.x=t.x-Math.floor(t.x);break;case Ri:t.x=t.x<0?0:1;break;case qo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Zo:t.y=t.y-Math.floor(t.y);break;case Ri:t.y=t.y<0?0:1;break;case qo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Qe.DEFAULT_IMAGE=null;Qe.DEFAULT_MAPPING=Nd;Qe.DEFAULT_ANISOTROPY=1;class Ae{constructor(t=0,e=0,i=0,s=1){Ae.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*i+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,a;const c=t.elements,l=c[0],h=c[4],f=c[8],d=c[1],u=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(f-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(l+1)/2,y=(u+1)/2,k=(p+1)/2,b=(h+d)/4,A=(f+v)/4,T=(g+m)/4;return _>y&&_>k?_<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(_),s=b/i,a=A/i):y>k?y<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(y),i=b/s,a=T/s):k<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(k),i=A/a,s=T/a),this.set(i,s,a,e),this}let x=Math.sqrt((m-g)*(m-g)+(f-v)*(f-v)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(f-v)/x,this.z=(d-h)/x,this.w=Math.acos((l+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class V0 extends ys{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ae(0,0,t,e),this.scissorTest=!1,this.viewport=new Ae(0,0,t,e);const s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Un,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new Qe(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Kd(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ii extends V0{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Jd extends Qe{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class X0 extends Qe{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ea{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,a,r,o){let c=i[s+0],l=i[s+1],h=i[s+2],f=i[s+3];const d=a[r+0],u=a[r+1],g=a[r+2],v=a[r+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=d,t[e+1]=u,t[e+2]=g,t[e+3]=v;return}if(f!==v||c!==d||l!==u||h!==g){let m=1-o;const p=c*d+l*u+h*g+f*v,x=p>=0?1:-1,_=1-p*p;if(_>Number.EPSILON){const k=Math.sqrt(_),b=Math.atan2(k,p*x);m=Math.sin(m*b)/k,o=Math.sin(o*b)/k}const y=o*x;if(c=c*m+d*y,l=l*m+u*y,h=h*m+g*y,f=f*m+v*y,m===1-o){const k=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=k,l*=k,h*=k,f*=k}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,a,r){const o=i[s],c=i[s+1],l=i[s+2],h=i[s+3],f=a[r],d=a[r+1],u=a[r+2],g=a[r+3];return t[e]=o*g+h*f+c*u-l*d,t[e+1]=c*g+h*d+l*f-o*u,t[e+2]=l*g+h*u+o*d-c*f,t[e+3]=h*g-o*f-c*d-l*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(s/2),f=o(a/2),d=c(i/2),u=c(s/2),g=c(a/2);switch(r){case"XYZ":this._x=d*h*f+l*u*g,this._y=l*u*f-d*h*g,this._z=l*h*g+d*u*f,this._w=l*h*f-d*u*g;break;case"YXZ":this._x=d*h*f+l*u*g,this._y=l*u*f-d*h*g,this._z=l*h*g-d*u*f,this._w=l*h*f+d*u*g;break;case"ZXY":this._x=d*h*f-l*u*g,this._y=l*u*f+d*h*g,this._z=l*h*g+d*u*f,this._w=l*h*f-d*u*g;break;case"ZYX":this._x=d*h*f-l*u*g,this._y=l*u*f+d*h*g,this._z=l*h*g-d*u*f,this._w=l*h*f+d*u*g;break;case"YZX":this._x=d*h*f+l*u*g,this._y=l*u*f+d*h*g,this._z=l*h*g-d*u*f,this._w=l*h*f-d*u*g;break;case"XZY":this._x=d*h*f-l*u*g,this._y=l*u*f-d*h*g,this._z=l*h*g+d*u*f,this._w=l*h*f+d*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],a=e[8],r=e[1],o=e[5],c=e[9],l=e[2],h=e[6],f=e[10],d=i+o+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-c)*u,this._y=(a-l)*u,this._z=(r-s)*u}else if(i>o&&i>f){const u=2*Math.sqrt(1+i-o-f);this._w=(h-c)/u,this._x=.25*u,this._y=(s+r)/u,this._z=(a+l)/u}else if(o>f){const u=2*Math.sqrt(1+o-i-f);this._w=(a-l)/u,this._x=(s+r)/u,this._y=.25*u,this._z=(c+h)/u}else{const u=2*Math.sqrt(1+f-i-o);this._w=(r-s)/u,this._x=(a+l)/u,this._y=(c+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ve(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,a=t._z,r=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+r*o+s*l-a*c,this._y=s*h+r*c+a*o-i*l,this._z=a*h+r*l+i*c-s*o,this._w=r*h-i*o-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,a=this._z,r=this._w;let o=r*t._w+i*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=i,this._y=s,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const u=1-e;return this._w=u*r+e*this._w,this._x=u*i+e*this._x,this._y=u*s+e*this._y,this._z=u*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),f=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=r*f+this._w*d,this._x=i*f+this._x*d,this._y=s*f+this._y*d,this._z=a*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class V{constructor(t=0,e=0,i=0){V.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(lh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(lh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6]*s,this.y=a[1]*e+a[4]*i+a[7]*s,this.z=a[2]*e+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,a=t.x,r=t.y,o=t.z,c=t.w,l=2*(r*s-o*i),h=2*(o*e-a*s),f=2*(a*i-r*e);return this.x=e+c*l+r*f-o*h,this.y=i+c*h+o*l-a*f,this.z=s+c*f+a*h-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s,this.y=a[1]*e+a[5]*i+a[9]*s,this.z=a[2]*e+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,a=t.z,r=e.x,o=e.y,c=e.z;return this.x=s*c-a*o,this.y=a*r-i*c,this.z=i*o-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Hr.copy(this).projectOnVector(t),this.sub(Hr)}reflect(t){return this.sub(Hr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Ve(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Hr=new V,lh=new ea;class na{constructor(t=new V(1/0,1/0,1/0),e=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(wn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(wn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=wn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const a=i.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,wn):wn.fromBufferAttribute(a,r),wn.applyMatrix4(t.matrixWorld),this.expandByPoint(wn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ha.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ha.copy(i.boundingBox)),ha.applyMatrix4(t.matrixWorld),this.union(ha)}const s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,wn),wn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ts),da.subVectors(this.max,Ts),Xi.subVectors(t.a,Ts),Wi.subVectors(t.b,Ts),$i.subVectors(t.c,Ts),Qn.subVectors(Wi,Xi),ti.subVectors($i,Wi),fi.subVectors(Xi,$i);let e=[0,-Qn.z,Qn.y,0,-ti.z,ti.y,0,-fi.z,fi.y,Qn.z,0,-Qn.x,ti.z,0,-ti.x,fi.z,0,-fi.x,-Qn.y,Qn.x,0,-ti.y,ti.x,0,-fi.y,fi.x,0];return!Gr(e,Xi,Wi,$i,da)||(e=[1,0,0,0,1,0,0,0,1],!Gr(e,Xi,Wi,$i,da))?!1:(ua.crossVectors(Qn,ti),e=[ua.x,ua.y,ua.z],Gr(e,Xi,Wi,$i,da))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,wn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(wn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Bn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Bn=[new V,new V,new V,new V,new V,new V,new V,new V],wn=new V,ha=new na,Xi=new V,Wi=new V,$i=new V,Qn=new V,ti=new V,fi=new V,Ts=new V,da=new V,ua=new V,pi=new V;function Gr(n,t,e,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){pi.fromArray(n,a);const o=s.x*Math.abs(pi.x)+s.y*Math.abs(pi.y)+s.z*Math.abs(pi.z),c=t.dot(pi),l=e.dot(pi),h=i.dot(pi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const W0=new na,Rs=new V,Vr=new V;class gr{constructor(t=new V,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):W0.setFromPoints(t).getCenter(i);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Rs.subVectors(t,this.center);const e=Rs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Rs,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Vr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Rs.copy(t.center).add(Vr)),this.expandByPoint(Rs.copy(t.center).sub(Vr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Hn=new V,Xr=new V,fa=new V,ei=new V,Wr=new V,pa=new V,$r=new V;class jc{constructor(t=new V,e=new V(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Hn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Hn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Hn.copy(this.origin).addScaledVector(this.direction,e),Hn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Xr.copy(t).add(e).multiplyScalar(.5),fa.copy(e).sub(t).normalize(),ei.copy(this.origin).sub(Xr);const a=t.distanceTo(e)*.5,r=-this.direction.dot(fa),o=ei.dot(this.direction),c=-ei.dot(fa),l=ei.lengthSq(),h=Math.abs(1-r*r);let f,d,u,g;if(h>0)if(f=r*c-o,d=r*o-c,g=a*h,f>=0)if(d>=-g)if(d<=g){const v=1/h;f*=v,d*=v,u=f*(f+r*d+2*o)+d*(r*f+d+2*c)+l}else d=a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*c)+l;else d=-a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*c)+l;else d<=-g?(f=Math.max(0,-(-r*a+o)),d=f>0?-a:Math.min(Math.max(-a,-c),a),u=-f*f+d*(d+2*c)+l):d<=g?(f=0,d=Math.min(Math.max(-a,-c),a),u=d*(d+2*c)+l):(f=Math.max(0,-(r*a+o)),d=f>0?a:Math.min(Math.max(-a,-c),a),u=-f*f+d*(d+2*c)+l);else d=r>0?-a:a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Xr).addScaledVector(fa,d),u}intersectSphere(t,e){Hn.subVectors(t.center,this.origin);const i=Hn.dot(this.direction),s=Hn.dot(Hn)-i*i,a=t.radius*t.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,c=i+r;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,a,r,o,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(a=(t.min.y-d.y)*h,r=(t.max.y-d.y)*h):(a=(t.max.y-d.y)*h,r=(t.min.y-d.y)*h),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(t.min.z-d.z)*f,c=(t.max.z-d.z)*f):(o=(t.max.z-d.z)*f,c=(t.min.z-d.z)*f),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Hn)!==null}intersectTriangle(t,e,i,s,a){Wr.subVectors(e,t),pa.subVectors(i,t),$r.crossVectors(Wr,pa);let r=this.direction.dot($r),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;ei.subVectors(this.origin,t);const c=o*this.direction.dot(pa.crossVectors(ei,pa));if(c<0)return null;const l=o*this.direction.dot(Wr.cross(ei));if(l<0||c+l>r)return null;const h=-o*ei.dot($r);return h<0?null:this.at(h/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ve{constructor(t,e,i,s,a,r,o,c,l,h,f,d,u,g,v,m){ve.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,r,o,c,l,h,f,d,u,g,v,m)}set(t,e,i,s,a,r,o,c,l,h,f,d,u,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ve().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Yi.setFromMatrixColumn(t,0).length(),a=1/Yi.setFromMatrixColumn(t,1).length(),r=1/Yi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*a,e[5]=i[5]*a,e[6]=i[6]*a,e[7]=0,e[8]=i[8]*r,e[9]=i[9]*r,e[10]=i[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,a=t.z,r=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const d=r*h,u=r*f,g=o*h,v=o*f;e[0]=c*h,e[4]=-c*f,e[8]=l,e[1]=u+g*l,e[5]=d-v*l,e[9]=-o*c,e[2]=v-d*l,e[6]=g+u*l,e[10]=r*c}else if(t.order==="YXZ"){const d=c*h,u=c*f,g=l*h,v=l*f;e[0]=d+v*o,e[4]=g*o-u,e[8]=r*l,e[1]=r*f,e[5]=r*h,e[9]=-o,e[2]=u*o-g,e[6]=v+d*o,e[10]=r*c}else if(t.order==="ZXY"){const d=c*h,u=c*f,g=l*h,v=l*f;e[0]=d-v*o,e[4]=-r*f,e[8]=g+u*o,e[1]=u+g*o,e[5]=r*h,e[9]=v-d*o,e[2]=-r*l,e[6]=o,e[10]=r*c}else if(t.order==="ZYX"){const d=r*h,u=r*f,g=o*h,v=o*f;e[0]=c*h,e[4]=g*l-u,e[8]=d*l+v,e[1]=c*f,e[5]=v*l+d,e[9]=u*l-g,e[2]=-l,e[6]=o*c,e[10]=r*c}else if(t.order==="YZX"){const d=r*c,u=r*l,g=o*c,v=o*l;e[0]=c*h,e[4]=v-d*f,e[8]=g*f+u,e[1]=f,e[5]=r*h,e[9]=-o*h,e[2]=-l*h,e[6]=u*f+g,e[10]=d-v*f}else if(t.order==="XZY"){const d=r*c,u=r*l,g=o*c,v=o*l;e[0]=c*h,e[4]=-f,e[8]=l*h,e[1]=d*f+v,e[5]=r*h,e[9]=u*f-g,e[2]=g*f-u,e[6]=o*h,e[10]=v*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose($0,t,Y0)}lookAt(t,e,i){const s=this.elements;return fn.subVectors(t,e),fn.lengthSq()===0&&(fn.z=1),fn.normalize(),ni.crossVectors(i,fn),ni.lengthSq()===0&&(Math.abs(i.z)===1?fn.x+=1e-4:fn.z+=1e-4,fn.normalize(),ni.crossVectors(i,fn)),ni.normalize(),ma.crossVectors(fn,ni),s[0]=ni.x,s[4]=ma.x,s[8]=fn.x,s[1]=ni.y,s[5]=ma.y,s[9]=fn.y,s[2]=ni.z,s[6]=ma.z,s[10]=fn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,r=i[0],o=i[4],c=i[8],l=i[12],h=i[1],f=i[5],d=i[9],u=i[13],g=i[2],v=i[6],m=i[10],p=i[14],x=i[3],_=i[7],y=i[11],k=i[15],b=s[0],A=s[4],T=s[8],w=s[12],M=s[1],P=s[5],F=s[9],N=s[13],B=s[2],D=s[6],L=s[10],X=s[14],H=s[3],q=s[7],j=s[11],ot=s[15];return a[0]=r*b+o*M+c*B+l*H,a[4]=r*A+o*P+c*D+l*q,a[8]=r*T+o*F+c*L+l*j,a[12]=r*w+o*N+c*X+l*ot,a[1]=h*b+f*M+d*B+u*H,a[5]=h*A+f*P+d*D+u*q,a[9]=h*T+f*F+d*L+u*j,a[13]=h*w+f*N+d*X+u*ot,a[2]=g*b+v*M+m*B+p*H,a[6]=g*A+v*P+m*D+p*q,a[10]=g*T+v*F+m*L+p*j,a[14]=g*w+v*N+m*X+p*ot,a[3]=x*b+_*M+y*B+k*H,a[7]=x*A+_*P+y*D+k*q,a[11]=x*T+_*F+y*L+k*j,a[15]=x*w+_*N+y*X+k*ot,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],a=t[12],r=t[1],o=t[5],c=t[9],l=t[13],h=t[2],f=t[6],d=t[10],u=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+a*c*f-s*l*f-a*o*d+i*l*d+s*o*u-i*c*u)+v*(+e*c*u-e*l*d+a*r*d-s*r*u+s*l*h-a*c*h)+m*(+e*l*f-e*o*u-a*r*f+i*r*u+a*o*h-i*l*h)+p*(-s*o*h-e*c*f+e*o*d+s*r*f-i*r*d+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=t[9],d=t[10],u=t[11],g=t[12],v=t[13],m=t[14],p=t[15],x=f*m*l-v*d*l+v*c*u-o*m*u-f*c*p+o*d*p,_=g*d*l-h*m*l-g*c*u+r*m*u+h*c*p-r*d*p,y=h*v*l-g*f*l+g*o*u-r*v*u-h*o*p+r*f*p,k=g*f*c-h*v*c-g*o*d+r*v*d+h*o*m-r*f*m,b=e*x+i*_+s*y+a*k;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/b;return t[0]=x*A,t[1]=(v*d*a-f*m*a-v*s*u+i*m*u+f*s*p-i*d*p)*A,t[2]=(o*m*a-v*c*a+v*s*l-i*m*l-o*s*p+i*c*p)*A,t[3]=(f*c*a-o*d*a-f*s*l+i*d*l+o*s*u-i*c*u)*A,t[4]=_*A,t[5]=(h*m*a-g*d*a+g*s*u-e*m*u-h*s*p+e*d*p)*A,t[6]=(g*c*a-r*m*a-g*s*l+e*m*l+r*s*p-e*c*p)*A,t[7]=(r*d*a-h*c*a+h*s*l-e*d*l-r*s*u+e*c*u)*A,t[8]=y*A,t[9]=(g*f*a-h*v*a-g*i*u+e*v*u+h*i*p-e*f*p)*A,t[10]=(r*v*a-g*o*a+g*i*l-e*v*l-r*i*p+e*o*p)*A,t[11]=(h*o*a-r*f*a-h*i*l+e*f*l+r*i*u-e*o*u)*A,t[12]=k*A,t[13]=(h*v*s-g*f*s+g*i*d-e*v*d-h*i*m+e*f*m)*A,t[14]=(g*o*s-r*v*s-g*i*c+e*v*c+r*i*m-e*o*m)*A,t[15]=(r*f*s-h*o*s+h*i*c-e*f*c-r*i*d+e*o*d)*A,this}scale(t){const e=this.elements,i=t.x,s=t.y,a=t.z;return e[0]*=i,e[4]*=s,e[8]*=a,e[1]*=i,e[5]*=s,e[9]*=a,e[2]*=i,e[6]*=s,e[10]*=a,e[3]*=i,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),a=1-i,r=t.x,o=t.y,c=t.z,l=a*r,h=a*o;return this.set(l*r+i,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+i,h*c-s*r,0,l*c-s*o,h*c+s*r,a*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,a,r){return this.set(1,i,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,a=e._x,r=e._y,o=e._z,c=e._w,l=a+a,h=r+r,f=o+o,d=a*l,u=a*h,g=a*f,v=r*h,m=r*f,p=o*f,x=c*l,_=c*h,y=c*f,k=i.x,b=i.y,A=i.z;return s[0]=(1-(v+p))*k,s[1]=(u+y)*k,s[2]=(g-_)*k,s[3]=0,s[4]=(u-y)*b,s[5]=(1-(d+p))*b,s[6]=(m+x)*b,s[7]=0,s[8]=(g+_)*A,s[9]=(m-x)*A,s[10]=(1-(d+v))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let a=Yi.set(s[0],s[1],s[2]).length();const r=Yi.set(s[4],s[5],s[6]).length(),o=Yi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],An.copy(this);const l=1/a,h=1/r,f=1/o;return An.elements[0]*=l,An.elements[1]*=l,An.elements[2]*=l,An.elements[4]*=h,An.elements[5]*=h,An.elements[6]*=h,An.elements[8]*=f,An.elements[9]*=f,An.elements[10]*=f,e.setFromRotationMatrix(An),i.x=a,i.y=r,i.z=o,this}makePerspective(t,e,i,s,a,r,o=qn){const c=this.elements,l=2*a/(e-t),h=2*a/(i-s),f=(e+t)/(e-t),d=(i+s)/(i-s);let u,g;if(o===qn)u=-(r+a)/(r-a),g=-2*r*a/(r-a);else if(o===cr)u=-r/(r-a),g=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=u,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,a,r,o=qn){const c=this.elements,l=1/(e-t),h=1/(i-s),f=1/(r-a),d=(e+t)*l,u=(i+s)*h;let g,v;if(o===qn)g=(r+a)*f,v=-2*f;else if(o===cr)g=a*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-u,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Yi=new V,An=new ve,$0=new V(0,0,0),Y0=new V(1,1,1),ni=new V,ma=new V,fn=new V,hh=new ve,dh=new ea;class zn{constructor(t=0,e=0,i=0,s=zn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],h=s[9],f=s[2],d=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(Ve(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ve(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ve(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Ve(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Ve(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Ve(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return hh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(hh,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return dh.setFromEuler(this),this.setFromQuaternion(dh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}zn.DEFAULT_ORDER="XYZ";class Kc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Z0=0;const uh=new V,Zi=new ea,Gn=new ve,ga=new V,Cs=new V,q0=new V,j0=new ea,fh=new V(1,0,0),ph=new V(0,1,0),mh=new V(0,0,1),gh={type:"added"},K0={type:"removed"},qi={type:"childadded",child:null},Yr={type:"childremoved",child:null};class Re extends ys{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Z0++}),this.uuid=Nn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Re.DEFAULT_UP.clone();const t=new V,e=new zn,i=new ea,s=new V(1,1,1);function a(){i.setFromEuler(e,!1)}function r(){e.setFromQuaternion(i,void 0,!1)}e._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ve},normalMatrix:{value:new Jt}}),this.matrix=new ve,this.matrixWorld=new ve,this.matrixAutoUpdate=Re.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Kc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Zi.setFromAxisAngle(t,e),this.quaternion.multiply(Zi),this}rotateOnWorldAxis(t,e){return Zi.setFromAxisAngle(t,e),this.quaternion.premultiply(Zi),this}rotateX(t){return this.rotateOnAxis(fh,t)}rotateY(t){return this.rotateOnAxis(ph,t)}rotateZ(t){return this.rotateOnAxis(mh,t)}translateOnAxis(t,e){return uh.copy(t).applyQuaternion(this.quaternion),this.position.add(uh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(fh,t)}translateY(t){return this.translateOnAxis(ph,t)}translateZ(t){return this.translateOnAxis(mh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Gn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ga.copy(t):ga.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Cs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Gn.lookAt(Cs,ga,this.up):Gn.lookAt(ga,Cs,this.up),this.quaternion.setFromRotationMatrix(Gn),s&&(Gn.extractRotation(s.matrixWorld),Zi.setFromRotationMatrix(Gn),this.quaternion.premultiply(Zi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(gh),qi.child=t,this.dispatchEvent(qi),qi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(K0),Yr.child=t,this.dispatchEvent(Yr),Yr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Gn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Gn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Gn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(gh),qi.child=t,this.dispatchEvent(qi),qi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cs,t,q0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cs,j0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];a(t.shapes,f)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(t.materials,this.material[c]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(t.animations,c))}}if(e){const o=r(t.geometries),c=r(t.materials),l=r(t.textures),h=r(t.images),f=r(t.shapes),d=r(t.skeletons),u=r(t.animations),g=r(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=s,i;function r(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Re.DEFAULT_UP=new V(0,1,0);Re.DEFAULT_MATRIX_AUTO_UPDATE=!0;Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Tn=new V,Vn=new V,Zr=new V,Xn=new V,ji=new V,Ki=new V,xh=new V,qr=new V,jr=new V,Kr=new V,Jr=new Ae,Qr=new Ae,to=new Ae;class gn{constructor(t=new V,e=new V,i=new V){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),Tn.subVectors(t,e),s.cross(Tn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,i,s,a){Tn.subVectors(s,e),Vn.subVectors(i,e),Zr.subVectors(t,e);const r=Tn.dot(Tn),o=Tn.dot(Vn),c=Tn.dot(Zr),l=Vn.dot(Vn),h=Vn.dot(Zr),f=r*l-o*o;if(f===0)return a.set(0,0,0),null;const d=1/f,u=(l*c-o*h)*d,g=(r*h-o*c)*d;return a.set(1-u-g,g,u)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Xn)===null?!1:Xn.x>=0&&Xn.y>=0&&Xn.x+Xn.y<=1}static getInterpolation(t,e,i,s,a,r,o,c){return this.getBarycoord(t,e,i,s,Xn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Xn.x),c.addScaledVector(r,Xn.y),c.addScaledVector(o,Xn.z),c)}static getInterpolatedAttribute(t,e,i,s,a,r){return Jr.setScalar(0),Qr.setScalar(0),to.setScalar(0),Jr.fromBufferAttribute(t,e),Qr.fromBufferAttribute(t,i),to.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(Jr,a.x),r.addScaledVector(Qr,a.y),r.addScaledVector(to,a.z),r}static isFrontFacing(t,e,i,s){return Tn.subVectors(i,e),Vn.subVectors(t,e),Tn.cross(Vn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Tn.subVectors(this.c,this.b),Vn.subVectors(this.a,this.b),Tn.cross(Vn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return gn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return gn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,a){return gn.getInterpolation(t,this.a,this.b,this.c,e,i,s,a)}containsPoint(t){return gn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return gn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,a=this.c;let r,o;ji.subVectors(s,i),Ki.subVectors(a,i),qr.subVectors(t,i);const c=ji.dot(qr),l=Ki.dot(qr);if(c<=0&&l<=0)return e.copy(i);jr.subVectors(t,s);const h=ji.dot(jr),f=Ki.dot(jr);if(h>=0&&f<=h)return e.copy(s);const d=c*f-h*l;if(d<=0&&c>=0&&h<=0)return r=c/(c-h),e.copy(i).addScaledVector(ji,r);Kr.subVectors(t,a);const u=ji.dot(Kr),g=Ki.dot(Kr);if(g>=0&&u<=g)return e.copy(a);const v=u*l-c*g;if(v<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(i).addScaledVector(Ki,o);const m=h*g-u*f;if(m<=0&&f-h>=0&&u-g>=0)return xh.subVectors(a,s),o=(f-h)/(f-h+(u-g)),e.copy(s).addScaledVector(xh,o);const p=1/(m+v+d);return r=v*p,o=d*p,e.copy(i).addScaledVector(ji,r).addScaledVector(Ki,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Qd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ii={h:0,s:0,l:0},xa={h:0,s:0,l:0};function eo(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Yt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ke){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,re.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=re.workingColorSpace){return this.r=t,this.g=e,this.b=i,re.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=re.workingColorSpace){if(t=qc(t,1),e=Ve(e,0,1),i=Ve(i,0,1),e===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+e):i+e-i*e,r=2*i-a;this.r=eo(r,a,t+1/3),this.g=eo(r,a,t),this.b=eo(r,a,t-1/3)}return re.toWorkingColorSpace(this,s),this}setStyle(t,e=Ke){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ke){const i=Qd[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=jn(t.r),this.g=jn(t.g),this.b=jn(t.b),this}copyLinearToSRGB(t){return this.r=us(t.r),this.g=us(t.g),this.b=us(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ke){return re.fromWorkingColorSpace($e.copy(this),t),Math.round(Ve($e.r*255,0,255))*65536+Math.round(Ve($e.g*255,0,255))*256+Math.round(Ve($e.b*255,0,255))}getHexString(t=Ke){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=re.workingColorSpace){re.fromWorkingColorSpace($e.copy(this),e);const i=$e.r,s=$e.g,a=$e.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let c,l;const h=(o+r)/2;if(o===r)c=0,l=0;else{const f=r-o;switch(l=h<=.5?f/(r+o):f/(2-r-o),r){case i:c=(s-a)/f+(s<a?6:0);break;case s:c=(a-i)/f+2;break;case a:c=(i-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=re.workingColorSpace){return re.fromWorkingColorSpace($e.copy(this),e),t.r=$e.r,t.g=$e.g,t.b=$e.b,t}getStyle(t=Ke){re.fromWorkingColorSpace($e.copy(this),t);const e=$e.r,i=$e.g,s=$e.b;return t!==Ke?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(ii),this.setHSL(ii.h+t,ii.s+e,ii.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ii),t.getHSL(xa);const i=zs(ii.h,xa.h,e),s=zs(ii.s,xa.s,e),a=zs(ii.l,xa.l,e);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*i+a[6]*s,this.g=a[1]*e+a[4]*i+a[7]*s,this.b=a[2]*e+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $e=new Yt;Yt.NAMES=Qd;let J0=0;class Ui extends ys{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:J0++}),this.uuid=Nn(),this.name="",this.blending=ls,this.side=li,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=No,this.blendDst=zo,this.blendEquation=Ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ql,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Gi,this.stencilZFail=Gi,this.stencilZPass=Gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ls&&(i.blending=this.blending),this.side!==li&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==No&&(i.blendSrc=this.blendSrc),this.blendDst!==zo&&(i.blendDst=this.blendDst),this.blendEquation!==Ai&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==fs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ql&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Gi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Gi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Gi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(e){const a=s(t.textures),r=s(t.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=e[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class He extends Ui{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=Gc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Pe=new V,va=new zt;class tn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Sc,this.updateRanges=[],this.gpuType=Zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)va.fromBufferAttribute(this,e),va.applyMatrix3(t),this.setXY(e,va.x,va.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix3(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix4(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Pe.fromBufferAttribute(this,e),Pe.applyNormalMatrix(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Pe.fromBufferAttribute(this,e),Pe.transformDirection(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Rn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=fe(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Rn(e,this.array)),e}setX(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Rn(e,this.array)),e}setY(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Rn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Rn(e,this.array)),e}setW(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=fe(e,this.array),i=fe(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=fe(e,this.array),i=fe(i,this.array),s=fe(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t*=this.itemSize,this.normalized&&(e=fe(e,this.array),i=fe(i,this.array),s=fe(s,this.array),a=fe(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Sc&&(t.usage=this.usage),t}}class tu extends tn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class eu extends tn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class ue extends tn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Q0=0;const vn=new ve,no=new Re,Ji=new V,pn=new na,Ps=new na,Oe=new V;class Ue extends ys{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Q0++}),this.uuid=Nn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(jd(t)?eu:tu)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Jt().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return vn.makeRotationFromQuaternion(t),this.applyMatrix4(vn),this}rotateX(t){return vn.makeRotationX(t),this.applyMatrix4(vn),this}rotateY(t){return vn.makeRotationY(t),this.applyMatrix4(vn),this}rotateZ(t){return vn.makeRotationZ(t),this.applyMatrix4(vn),this}translate(t,e,i){return vn.makeTranslation(t,e,i),this.applyMatrix4(vn),this}scale(t,e,i){return vn.makeScale(t,e,i),this.applyMatrix4(vn),this}lookAt(t){return no.lookAt(t),no.updateMatrix(),this.applyMatrix4(no.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ji).negate(),this.translate(Ji.x,Ji.y,Ji.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,a=t.length;s<a;s++){const r=t[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ue(i,3))}else{for(let i=0,s=e.count;i<s;i++){const a=t[i];e.setXYZ(i,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new na);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const a=e[i];pn.setFromBufferAttribute(a),this.morphTargetsRelative?(Oe.addVectors(this.boundingBox.min,pn.min),this.boundingBox.expandByPoint(Oe),Oe.addVectors(this.boundingBox.max,pn.max),this.boundingBox.expandByPoint(Oe)):(this.boundingBox.expandByPoint(pn.min),this.boundingBox.expandByPoint(pn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(t){const i=this.boundingSphere.center;if(pn.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];Ps.setFromBufferAttribute(o),this.morphTargetsRelative?(Oe.addVectors(pn.min,Ps.min),pn.expandByPoint(Oe),Oe.addVectors(pn.max,Ps.max),pn.expandByPoint(Oe)):(pn.expandByPoint(Ps.min),pn.expandByPoint(Ps.max))}pn.getCenter(i);let s=0;for(let a=0,r=t.count;a<r;a++)Oe.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(Oe));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Oe.fromBufferAttribute(o,l),c&&(Ji.fromBufferAttribute(t,l),Oe.add(Ji)),s=Math.max(s,i.distanceToSquared(Oe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new tn(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let T=0;T<i.count;T++)o[T]=new V,c[T]=new V;const l=new V,h=new V,f=new V,d=new zt,u=new zt,g=new zt,v=new V,m=new V;function p(T,w,M){l.fromBufferAttribute(i,T),h.fromBufferAttribute(i,w),f.fromBufferAttribute(i,M),d.fromBufferAttribute(a,T),u.fromBufferAttribute(a,w),g.fromBufferAttribute(a,M),h.sub(l),f.sub(l),u.sub(d),g.sub(d);const P=1/(u.x*g.y-g.x*u.y);isFinite(P)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(P),m.copy(f).multiplyScalar(u.x).addScaledVector(h,-g.x).multiplyScalar(P),o[T].add(v),o[w].add(v),o[M].add(v),c[T].add(m),c[w].add(m),c[M].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let T=0,w=x.length;T<w;++T){const M=x[T],P=M.start,F=M.count;for(let N=P,B=P+F;N<B;N+=3)p(t.getX(N+0),t.getX(N+1),t.getX(N+2))}const _=new V,y=new V,k=new V,b=new V;function A(T){k.fromBufferAttribute(s,T),b.copy(k);const w=o[T];_.copy(w),_.sub(k.multiplyScalar(k.dot(w))).normalize(),y.crossVectors(b,w);const P=y.dot(c[T])<0?-1:1;r.setXYZW(T,_.x,_.y,_.z,P)}for(let T=0,w=x.length;T<w;++T){const M=x[T],P=M.start,F=M.count;for(let N=P,B=P+F;N<B;N+=3)A(t.getX(N+0)),A(t.getX(N+1)),A(t.getX(N+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new tn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const s=new V,a=new V,r=new V,o=new V,c=new V,l=new V,h=new V,f=new V;if(t)for(let d=0,u=t.count;d<u;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,v),r.fromBufferAttribute(e,m),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,m),o.add(h),c.add(h),l.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,u=e.count;d<u;d+=3)s.fromBufferAttribute(e,d+0),a.fromBufferAttribute(e,d+1),r.fromBufferAttribute(e,d+2),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Oe.fromBufferAttribute(t,e),Oe.normalize(),t.setXYZ(e,Oe.x,Oe.y,Oe.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,f=o.normalized,d=new l.constructor(c.length*h);let u=0,g=0;for(let v=0,m=c.length;v<m;v++){o.isInterleavedBufferAttribute?u=c[v]*o.data.stride+o.offset:u=c[v]*h;for(let p=0;p<h;p++)d[g++]=l[u++]}return new tn(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ue,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,i);e.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let h=0,f=l.length;h<f;h++){const d=l[h],u=t(d,i);c.push(u)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,d=l.length;f<d;f++){const u=l[f];h.push(u.toJSON(t.data))}h.length>0&&(s[c]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const a=t.morphAttributes;for(const l in a){const h=[],f=a[l];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,h=r.length;l<h;l++){const f=r[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const vh=new ve,mi=new jc,_a=new gr,_h=new V,ya=new V,Ma=new V,Sa=new V,io=new V,ba=new V,yh=new V,Ea=new V;class ne extends Re{constructor(t=new Ue,e=new He){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(a&&o){ba.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const h=o[c],f=a[c];h!==0&&(io.fromBufferAttribute(f,t),r?ba.addScaledVector(io,h):ba.addScaledVector(io.sub(e),h))}e.add(ba)}return e}raycast(t,e){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),_a.copy(i.boundingSphere),_a.applyMatrix4(a),mi.copy(t.ray).recast(t.near),!(_a.containsPoint(mi.origin)===!1&&(mi.intersectSphere(_a,_h)===null||mi.origin.distanceToSquared(_h)>(t.far-t.near)**2))&&(vh.copy(a).invert(),mi.copy(t.ray).applyMatrix4(vh),!(i.boundingBox!==null&&mi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,mi)))}_computeIntersections(t,e,i){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,d=a.groups,u=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=r[m.materialIndex],x=Math.max(m.start,u.start),_=Math.min(o.count,Math.min(m.start+m.count,u.start+u.count));for(let y=x,k=_;y<k;y+=3){const b=o.getX(y),A=o.getX(y+1),T=o.getX(y+2);s=wa(this,p,t,i,l,h,f,b,A,T),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,u.start),v=Math.min(o.count,u.start+u.count);for(let m=g,p=v;m<p;m+=3){const x=o.getX(m),_=o.getX(m+1),y=o.getX(m+2);s=wa(this,r,t,i,l,h,f,x,_,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=r[m.materialIndex],x=Math.max(m.start,u.start),_=Math.min(c.count,Math.min(m.start+m.count,u.start+u.count));for(let y=x,k=_;y<k;y+=3){const b=y,A=y+1,T=y+2;s=wa(this,p,t,i,l,h,f,b,A,T),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,u.start),v=Math.min(c.count,u.start+u.count);for(let m=g,p=v;m<p;m+=3){const x=m,_=m+1,y=m+2;s=wa(this,r,t,i,l,h,f,x,_,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function tg(n,t,e,i,s,a,r,o){let c;if(t.side===on?c=i.intersectTriangle(r,a,s,!0,o):c=i.intersectTriangle(s,a,r,t.side===li,o),c===null)return null;Ea.copy(o),Ea.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Ea);return l<e.near||l>e.far?null:{distance:l,point:Ea.clone(),object:n}}function wa(n,t,e,i,s,a,r,o,c,l){n.getVertexPosition(o,ya),n.getVertexPosition(c,Ma),n.getVertexPosition(l,Sa);const h=tg(n,t,e,i,ya,Ma,Sa,yh);if(h){const f=new V;gn.getBarycoord(yh,ya,Ma,Sa,f),s&&(h.uv=gn.getInterpolatedAttribute(s,o,c,l,f,new zt)),a&&(h.uv1=gn.getInterpolatedAttribute(a,o,c,l,f,new zt)),r&&(h.normal=gn.getInterpolatedAttribute(r,o,c,l,f,new V),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new V,materialIndex:0};gn.getNormal(ya,Ma,Sa,d.normal),h.face=d,h.barycoord=f}return h}class Ln extends Ue{constructor(t=1,e=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],h=[],f=[];let d=0,u=0;g("z","y","x",-1,-1,i,e,t,r,a,0),g("z","y","x",1,-1,i,e,-t,r,a,1),g("x","z","y",1,1,t,i,e,s,r,2),g("x","z","y",1,-1,t,i,-e,s,r,3),g("x","y","z",1,-1,t,e,i,s,a,4),g("x","y","z",-1,-1,t,e,-i,s,a,5),this.setIndex(c),this.setAttribute("position",new ue(l,3)),this.setAttribute("normal",new ue(h,3)),this.setAttribute("uv",new ue(f,2));function g(v,m,p,x,_,y,k,b,A,T,w){const M=y/A,P=k/T,F=y/2,N=k/2,B=b/2,D=A+1,L=T+1;let X=0,H=0;const q=new V;for(let j=0;j<L;j++){const ot=j*P-N;for(let dt=0;dt<D;dt++){const xt=dt*M-F;q[v]=xt*x,q[m]=ot*_,q[p]=B,l.push(q.x,q.y,q.z),q[v]=0,q[m]=0,q[p]=b>0?1:-1,h.push(q.x,q.y,q.z),f.push(dt/A),f.push(1-j/T),X+=1}}for(let j=0;j<T;j++)for(let ot=0;ot<A;ot++){const dt=d+ot+D*j,xt=d+ot+D*(j+1),Y=d+(ot+1)+D*(j+1),tt=d+(ot+1)+D*j;c.push(dt,xt,tt),c.push(xt,Y,tt),H+=6}o.addGroup(u,H,w),u+=H,d+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ln(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function vs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function je(n){const t={};for(let e=0;e<n.length;e++){const i=vs(n[e]);for(const s in i)t[s]=i[s]}return t}function eg(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function nu(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:re.workingColorSpace}const ng={clone:vs,merge:je};var ig=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hi extends Ui{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ig,this.fragmentShader=sg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=vs(t.uniforms),this.uniformsGroups=eg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class iu extends Re{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ve,this.projectionMatrix=new ve,this.projectionMatrixInverse=new ve,this.coordinateSystem=qn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const si=new V,Mh=new zt,Sh=new zt;class yn extends iu{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ys*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ds*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ys*2*Math.atan(Math.tan(ds*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(si.x,si.y).multiplyScalar(-t/si.z),si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(si.x,si.y).multiplyScalar(-t/si.z)}getViewSize(t,e){return this.getViewBounds(t,Mh,Sh),e.subVectors(Sh,Mh)}setViewOffset(t,e,i,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ds*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,e-=r.offsetY*i/l,s*=r.width/c,i*=r.height/l}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Qi=-90,ts=1;class ag extends Re{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new yn(Qi,ts,t,e);s.layers=this.layers,this.add(s);const a=new yn(Qi,ts,t,e);a.layers=this.layers,this.add(a);const r=new yn(Qi,ts,t,e);r.layers=this.layers,this.add(r);const o=new yn(Qi,ts,t,e);o.layers=this.layers,this.add(o);const c=new yn(Qi,ts,t,e);c.layers=this.layers,this.add(c);const l=new yn(Qi,ts,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,a,r,o,c]=e;for(const l of e)this.remove(l);if(t===qn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===cr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,a),t.setRenderTarget(i,1,s),t.render(e,r),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class su extends Qe{constructor(t,e,i,s,a,r,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:ps,super(t,e,i,s,a,r,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class rg extends Ii{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new su(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Un}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ln(5,5,5),a=new hi({name:"CubemapFromEquirect",uniforms:vs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:on,blending:oi});a.uniforms.tEquirect.value=e;const r=new ne(s,a),o=e.minFilter;return e.minFilter===Ci&&(e.minFilter=Un),new ag(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,i,s){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,i,s);t.setRenderTarget(a)}}const so=new V,og=new V,cg=new Jt;class Si{constructor(t=new V(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=so.subVectors(i,e).cross(og.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(so),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||cg.getNormalMatrix(t),s=this.coplanarPoint(so).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gi=new gr,Aa=new V;class Jc{constructor(t=new Si,e=new Si,i=new Si,s=new Si,a=new Si,r=new Si){this.planes=[t,e,i,s,a,r]}set(t,e,i,s,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=qn){const i=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],c=s[3],l=s[4],h=s[5],f=s[6],d=s[7],u=s[8],g=s[9],v=s[10],m=s[11],p=s[12],x=s[13],_=s[14],y=s[15];if(i[0].setComponents(c-a,d-l,m-u,y-p).normalize(),i[1].setComponents(c+a,d+l,m+u,y+p).normalize(),i[2].setComponents(c+r,d+h,m+g,y+x).normalize(),i[3].setComponents(c-r,d-h,m-g,y-x).normalize(),i[4].setComponents(c-o,d-f,m-v,y-_).normalize(),e===qn)i[5].setComponents(c+o,d+f,m+v,y+_).normalize();else if(e===cr)i[5].setComponents(o,f,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),gi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),gi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(gi)}intersectsSprite(t){return gi.center.set(0,0,0),gi.radius=.7071067811865476,gi.applyMatrix4(t.matrixWorld),this.intersectsSphere(gi)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Aa.x=s.normal.x>0?t.max.x:t.min.x,Aa.y=s.normal.y>0?t.max.y:t.min.y,Aa.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Aa)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function au(){let n=null,t=!1,e=null,i=null;function s(a,r){e(a,r),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){n=a}}}function lg(n){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,f=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,h),o.onUploadCallback();let u;if(l instanceof Float32Array)u=n.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=n.SHORT;else if(l instanceof Uint32Array)u=n.UNSIGNED_INT;else if(l instanceof Int32Array)u=n.INT;else if(l instanceof Int8Array)u=n.BYTE;else if(l instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,c,l){const h=c.array,f=c.updateRanges;if(n.bindBuffer(l,o),f.length===0)n.bufferSubData(l,0,h);else{f.sort((u,g)=>u.start-g.start);let d=0;for(let u=1;u<f.length;u++){const g=f[d],v=f[u];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,f[d]=v)}f.length=d+1;for(let u=0,g=f.length;u<g;u++){const v=f[u];n.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(n.deleteBuffer(c.buffer),t.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}class _n extends Ue{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const a=t/2,r=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,h=c+1,f=t/o,d=e/c,u=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const x=p*d-r;for(let _=0;_<l;_++){const y=_*f-a;g.push(y,-x,0),v.push(0,0,1),m.push(_/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<o;x++){const _=x+l*p,y=x+l*(p+1),k=x+1+l*(p+1),b=x+1+l*p;u.push(_,y,b),u.push(y,k,b)}this.setIndex(u),this.setAttribute("position",new ue(g,3)),this.setAttribute("normal",new ue(v,3)),this.setAttribute("uv",new ue(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _n(t.width,t.height,t.widthSegments,t.heightSegments)}}var hg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,dg=`#ifdef USE_ALPHAHASH
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
#endif`,ug=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,fg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,mg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gg=`#ifdef USE_AOMAP
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
#endif`,xg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,vg=`#ifdef USE_BATCHING
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
#endif`,_g=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Mg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,bg=`#ifdef USE_IRIDESCENCE
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
#endif`,Eg=`#ifdef USE_BUMPMAP
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
#endif`,wg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ag=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Rg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Pg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Lg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Dg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ig=`#define PI 3.141592653589793
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
} // validated`,kg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ug=`vec3 transformedNormal = objectNormal;
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
#endif`,Fg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ng=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Og=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Bg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gg=`#ifdef USE_ENVMAP
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
#endif`,Vg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Xg=`#ifdef USE_ENVMAP
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
#endif`,Wg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$g=`#ifdef USE_ENVMAP
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
#endif`,Yg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Zg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,jg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Kg=`#ifdef USE_GRADIENTMAP
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
}`,Jg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ex=`uniform bool receiveShadow;
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
#endif`,nx=`#ifdef USE_ENVMAP
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
#endif`,ix=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,sx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ax=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ox=`PhysicalMaterial material;
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
#endif`,cx=`struct PhysicalMaterial {
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
}`,lx=`
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
#endif`,hx=`#if defined( RE_IndirectDiffuse )
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
#endif`,dx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ux=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fx=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,px=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mx=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,gx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,xx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,_x=`#if defined( USE_POINTS_UV )
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
#endif`,yx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Sx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ex=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wx=`#ifdef USE_MORPHTARGETS
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
#endif`,Ax=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Rx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Cx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Px=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Dx=`#ifdef USE_NORMALMAP
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
#endif`,Ix=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,kx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ux=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Fx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Nx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ox=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Bx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Vx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Xx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Wx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$x=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Yx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Zx=`float getShadowMask() {
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
}`,qx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jx=`#ifdef USE_SKINNING
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
#endif`,Kx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jx=`#ifdef USE_SKINNING
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
#endif`,Qx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ev=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,nv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,iv=`#ifdef USE_TRANSMISSION
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
#endif`,sv=`#ifdef USE_TRANSMISSION
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
#endif`,av=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ov=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const lv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hv=`uniform sampler2D t2D;
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
}`,dv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,uv=`#ifdef ENVMAP_TYPE_CUBE
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
}`,fv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mv=`#include <common>
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
}`,gv=`#if DEPTH_PACKING == 3200
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
}`,xv=`#define DISTANCE
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
}`,vv=`#define DISTANCE
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
}`,_v=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mv=`uniform float scale;
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
}`,Sv=`uniform vec3 diffuse;
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
}`,bv=`#include <common>
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
}`,Ev=`uniform vec3 diffuse;
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
}`,wv=`#define LAMBERT
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
}`,Av=`#define LAMBERT
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
}`,Tv=`#define MATCAP
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
}`,Rv=`#define MATCAP
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
}`,Cv=`#define NORMAL
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
}`,Pv=`#define NORMAL
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
}`,Lv=`#define PHONG
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
}`,Dv=`#define PHONG
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
}`,Iv=`#define STANDARD
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
}`,kv=`#define STANDARD
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
}`,Uv=`#define TOON
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
}`,Fv=`#define TOON
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
}`,Nv=`uniform float size;
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
}`,zv=`uniform vec3 diffuse;
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
}`,Ov=`#include <common>
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
}`,Bv=`uniform vec3 color;
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
}`,Hv=`uniform float rotation;
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
}`,Gv=`uniform vec3 diffuse;
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
}`,Qt={alphahash_fragment:hg,alphahash_pars_fragment:dg,alphamap_fragment:ug,alphamap_pars_fragment:fg,alphatest_fragment:pg,alphatest_pars_fragment:mg,aomap_fragment:gg,aomap_pars_fragment:xg,batching_pars_vertex:vg,batching_vertex:_g,begin_vertex:yg,beginnormal_vertex:Mg,bsdfs:Sg,iridescence_fragment:bg,bumpmap_pars_fragment:Eg,clipping_planes_fragment:wg,clipping_planes_pars_fragment:Ag,clipping_planes_pars_vertex:Tg,clipping_planes_vertex:Rg,color_fragment:Cg,color_pars_fragment:Pg,color_pars_vertex:Lg,color_vertex:Dg,common:Ig,cube_uv_reflection_fragment:kg,defaultnormal_vertex:Ug,displacementmap_pars_vertex:Fg,displacementmap_vertex:Ng,emissivemap_fragment:zg,emissivemap_pars_fragment:Og,colorspace_fragment:Bg,colorspace_pars_fragment:Hg,envmap_fragment:Gg,envmap_common_pars_fragment:Vg,envmap_pars_fragment:Xg,envmap_pars_vertex:Wg,envmap_physical_pars_fragment:nx,envmap_vertex:$g,fog_vertex:Yg,fog_pars_vertex:Zg,fog_fragment:qg,fog_pars_fragment:jg,gradientmap_pars_fragment:Kg,lightmap_pars_fragment:Jg,lights_lambert_fragment:Qg,lights_lambert_pars_fragment:tx,lights_pars_begin:ex,lights_toon_fragment:ix,lights_toon_pars_fragment:sx,lights_phong_fragment:ax,lights_phong_pars_fragment:rx,lights_physical_fragment:ox,lights_physical_pars_fragment:cx,lights_fragment_begin:lx,lights_fragment_maps:hx,lights_fragment_end:dx,logdepthbuf_fragment:ux,logdepthbuf_pars_fragment:fx,logdepthbuf_pars_vertex:px,logdepthbuf_vertex:mx,map_fragment:gx,map_pars_fragment:xx,map_particle_fragment:vx,map_particle_pars_fragment:_x,metalnessmap_fragment:yx,metalnessmap_pars_fragment:Mx,morphinstance_vertex:Sx,morphcolor_vertex:bx,morphnormal_vertex:Ex,morphtarget_pars_vertex:wx,morphtarget_vertex:Ax,normal_fragment_begin:Tx,normal_fragment_maps:Rx,normal_pars_fragment:Cx,normal_pars_vertex:Px,normal_vertex:Lx,normalmap_pars_fragment:Dx,clearcoat_normal_fragment_begin:Ix,clearcoat_normal_fragment_maps:kx,clearcoat_pars_fragment:Ux,iridescence_pars_fragment:Fx,opaque_fragment:Nx,packing:zx,premultiplied_alpha_fragment:Ox,project_vertex:Bx,dithering_fragment:Hx,dithering_pars_fragment:Gx,roughnessmap_fragment:Vx,roughnessmap_pars_fragment:Xx,shadowmap_pars_fragment:Wx,shadowmap_pars_vertex:$x,shadowmap_vertex:Yx,shadowmask_pars_fragment:Zx,skinbase_vertex:qx,skinning_pars_vertex:jx,skinning_vertex:Kx,skinnormal_vertex:Jx,specularmap_fragment:Qx,specularmap_pars_fragment:tv,tonemapping_fragment:ev,tonemapping_pars_fragment:nv,transmission_fragment:iv,transmission_pars_fragment:sv,uv_pars_fragment:av,uv_pars_vertex:rv,uv_vertex:ov,worldpos_vertex:cv,background_vert:lv,background_frag:hv,backgroundCube_vert:dv,backgroundCube_frag:uv,cube_vert:fv,cube_frag:pv,depth_vert:mv,depth_frag:gv,distanceRGBA_vert:xv,distanceRGBA_frag:vv,equirect_vert:_v,equirect_frag:yv,linedashed_vert:Mv,linedashed_frag:Sv,meshbasic_vert:bv,meshbasic_frag:Ev,meshlambert_vert:wv,meshlambert_frag:Av,meshmatcap_vert:Tv,meshmatcap_frag:Rv,meshnormal_vert:Cv,meshnormal_frag:Pv,meshphong_vert:Lv,meshphong_frag:Dv,meshphysical_vert:Iv,meshphysical_frag:kv,meshtoon_vert:Uv,meshtoon_frag:Fv,points_vert:Nv,points_frag:zv,shadow_vert:Ov,shadow_frag:Bv,sprite_vert:Hv,sprite_frag:Gv},Dt={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},envMapRotation:{value:new Jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new zt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new zt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},kn={basic:{uniforms:je([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:je([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:je([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:je([Dt.common,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.roughnessmap,Dt.metalnessmap,Dt.fog,Dt.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:je([Dt.common,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.gradientmap,Dt.fog,Dt.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:je([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:je([Dt.points,Dt.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:je([Dt.common,Dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:je([Dt.common,Dt.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:je([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:je([Dt.sprite,Dt.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Jt}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:je([Dt.common,Dt.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:je([Dt.lights,Dt.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};kn.physical={uniforms:je([kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new zt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new zt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new zt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const Ta={r:0,b:0,g:0},xi=new zn,Vv=new ve;function Xv(n,t,e,i,s,a,r){const o=new Yt(0);let c=a===!0?0:1,l,h,f=null,d=0,u=null;function g(x){let _=x.isScene===!0?x.background:null;return _&&_.isTexture&&(_=(x.backgroundBlurriness>0?e:t).get(_)),_}function v(x){let _=!1;const y=g(x);y===null?p(o,c):y&&y.isColor&&(p(y,1),_=!0);const k=n.xr.getEnvironmentBlendMode();k==="additive"?i.buffers.color.setClear(0,0,0,1,r):k==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,_){const y=g(_);y&&(y.isCubeTexture||y.mapping===pr)?(h===void 0&&(h=new ne(new Ln(1,1,1),new hi({name:"BackgroundCubeMaterial",uniforms:vs(kn.backgroundCube.uniforms),vertexShader:kn.backgroundCube.vertexShader,fragmentShader:kn.backgroundCube.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(k,b,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),xi.copy(_.backgroundRotation),xi.x*=-1,xi.y*=-1,xi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(xi.y*=-1,xi.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Vv.makeRotationFromEuler(xi)),h.material.toneMapped=re.getTransfer(y.colorSpace)!==ge,(f!==y||d!==y.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=y,d=y.version,u=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new ne(new _n(2,2),new hi({name:"BackgroundMaterial",uniforms:vs(kn.background.uniforms),vertexShader:kn.background.vertexShader,fragmentShader:kn.background.fragmentShader,side:li,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=re.getTransfer(y.colorSpace)!==ge,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(f!==y||d!==y.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,f=y,d=y.version,u=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,_){x.getRGB(Ta,nu(n)),i.buffers.color.setClear(Ta.r,Ta.g,Ta.b,_,r)}return{getClearColor:function(){return o},setClearColor:function(x,_=1){o.set(x),c=_,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(o,c)},render:v,addToRenderList:m}}function Wv(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let a=s,r=!1;function o(M,P,F,N,B){let D=!1;const L=f(N,F,P);a!==L&&(a=L,l(a.object)),D=u(M,N,F,B),D&&g(M,N,F,B),B!==null&&t.update(B,n.ELEMENT_ARRAY_BUFFER),(D||r)&&(r=!1,y(M,P,F,N),B!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function c(){return n.createVertexArray()}function l(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function f(M,P,F){const N=F.wireframe===!0;let B=i[M.id];B===void 0&&(B={},i[M.id]=B);let D=B[P.id];D===void 0&&(D={},B[P.id]=D);let L=D[N];return L===void 0&&(L=d(c()),D[N]=L),L}function d(M){const P=[],F=[],N=[];for(let B=0;B<e;B++)P[B]=0,F[B]=0,N[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:N,object:M,attributes:{},index:null}}function u(M,P,F,N){const B=a.attributes,D=P.attributes;let L=0;const X=F.getAttributes();for(const H in X)if(X[H].location>=0){const j=B[H];let ot=D[H];if(ot===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(ot=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(ot=M.instanceColor)),j===void 0||j.attribute!==ot||ot&&j.data!==ot.data)return!0;L++}return a.attributesNum!==L||a.index!==N}function g(M,P,F,N){const B={},D=P.attributes;let L=0;const X=F.getAttributes();for(const H in X)if(X[H].location>=0){let j=D[H];j===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(j=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(j=M.instanceColor));const ot={};ot.attribute=j,j&&j.data&&(ot.data=j.data),B[H]=ot,L++}a.attributes=B,a.attributesNum=L,a.index=N}function v(){const M=a.newAttributes;for(let P=0,F=M.length;P<F;P++)M[P]=0}function m(M){p(M,0)}function p(M,P){const F=a.newAttributes,N=a.enabledAttributes,B=a.attributeDivisors;F[M]=1,N[M]===0&&(n.enableVertexAttribArray(M),N[M]=1),B[M]!==P&&(n.vertexAttribDivisor(M,P),B[M]=P)}function x(){const M=a.newAttributes,P=a.enabledAttributes;for(let F=0,N=P.length;F<N;F++)P[F]!==M[F]&&(n.disableVertexAttribArray(F),P[F]=0)}function _(M,P,F,N,B,D,L){L===!0?n.vertexAttribIPointer(M,P,F,B,D):n.vertexAttribPointer(M,P,F,N,B,D)}function y(M,P,F,N){v();const B=N.attributes,D=F.getAttributes(),L=P.defaultAttributeValues;for(const X in D){const H=D[X];if(H.location>=0){let q=B[X];if(q===void 0&&(X==="instanceMatrix"&&M.instanceMatrix&&(q=M.instanceMatrix),X==="instanceColor"&&M.instanceColor&&(q=M.instanceColor)),q!==void 0){const j=q.normalized,ot=q.itemSize,dt=t.get(q);if(dt===void 0)continue;const xt=dt.buffer,Y=dt.type,tt=dt.bytesPerElement,ut=Y===n.INT||Y===n.UNSIGNED_INT||q.gpuType===Vc;if(q.isInterleavedBufferAttribute){const K=q.data,ft=K.stride,It=q.offset;if(K.isInstancedInterleavedBuffer){for(let Ct=0;Ct<H.locationSize;Ct++)p(H.location+Ct,K.meshPerAttribute);M.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Ct=0;Ct<H.locationSize;Ct++)m(H.location+Ct);n.bindBuffer(n.ARRAY_BUFFER,xt);for(let Ct=0;Ct<H.locationSize;Ct++)_(H.location+Ct,ot/H.locationSize,Y,j,ft*tt,(It+ot/H.locationSize*Ct)*tt,ut)}else{if(q.isInstancedBufferAttribute){for(let K=0;K<H.locationSize;K++)p(H.location+K,q.meshPerAttribute);M.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let K=0;K<H.locationSize;K++)m(H.location+K);n.bindBuffer(n.ARRAY_BUFFER,xt);for(let K=0;K<H.locationSize;K++)_(H.location+K,ot/H.locationSize,Y,j,ot*tt,ot/H.locationSize*K*tt,ut)}}else if(L!==void 0){const j=L[X];if(j!==void 0)switch(j.length){case 2:n.vertexAttrib2fv(H.location,j);break;case 3:n.vertexAttrib3fv(H.location,j);break;case 4:n.vertexAttrib4fv(H.location,j);break;default:n.vertexAttrib1fv(H.location,j)}}}}x()}function k(){T();for(const M in i){const P=i[M];for(const F in P){const N=P[F];for(const B in N)h(N[B].object),delete N[B];delete P[F]}delete i[M]}}function b(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const F in P){const N=P[F];for(const B in N)h(N[B].object),delete N[B];delete P[F]}delete i[M.id]}function A(M){for(const P in i){const F=i[P];if(F[M.id]===void 0)continue;const N=F[M.id];for(const B in N)h(N[B].object),delete N[B];delete F[M.id]}}function T(){w(),r=!0,a!==s&&(a=s,l(a.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:w,dispose:k,releaseStatesOfGeometry:b,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function $v(n,t,e){let i;function s(l){i=l}function a(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function r(l,h,f){f!==0&&(n.drawArraysInstanced(i,l,h,f),e.update(h,i,f))}function o(l,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,f);let u=0;for(let g=0;g<f;g++)u+=h[g];e.update(u,i,1)}function c(l,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<l.length;g++)r(l[g],h[g],d[g]);else{u.multiDrawArraysInstancedWEBGL(i,l,0,h,0,d,0,f);let g=0;for(let v=0;v<f;v++)g+=h[v]*d[v];e.update(g,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Yv(n,t,e,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(A){return!(A!==Cn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const T=A===ta&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Kn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Zn&&!T)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),k=g>0,b=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:y,vertexTextures:k,maxSamples:b}}function Zv(n){const t=this;let e=null,i=0,s=!1,a=!1;const r=new Si,o=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||s;return s=d,i=f.length,u},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const g=f.clippingPlanes,v=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!s||g===null||g.length===0||a&&!m)a?h(null):l();else{const x=a?0:i,_=x*4;let y=p.clippingState||null;c.value=y,y=h(g,d,_,u);for(let k=0;k!==_;++k)y[k]=e[k];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,g){const v=f!==null?f.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=u+v*4,x=d.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let _=0,y=u;_!==v;++_,y+=4)r.copy(f[_]).applyMatrix4(x,o),r.normal.toArray(m,y),m[y+3]=r.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function qv(n){let t=new WeakMap;function e(r,o){return o===$o?r.mapping=ps:o===Yo&&(r.mapping=ms),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===$o||o===Yo)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new rg(c.height);return l.fromEquirectangularTexture(n,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function a(){t=new WeakMap}return{get:i,dispose:a}}class ru extends iu{constructor(t=-1,e=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-t,r=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const os=4,bh=[.125,.215,.35,.446,.526,.582],Ti=20,ao=new ru,Eh=new Yt;let ro=null,oo=0,co=0,lo=!1;const bi=(1+Math.sqrt(5))/2,es=1/bi,wh=[new V(-bi,es,0),new V(bi,es,0),new V(-es,0,bi),new V(es,0,bi),new V(0,bi,-es),new V(0,bi,es),new V(-1,1,-1),new V(1,1,-1),new V(-1,1,1),new V(1,1,1)];class Ah{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){ro=this._renderer.getRenderTarget(),oo=this._renderer.getActiveCubeFace(),co=this._renderer.getActiveMipmapLevel(),lo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,i,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ch(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Rh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ro,oo,co),this._renderer.xr.enabled=lo,t.scissorTest=!1,Ra(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ps||t.mapping===ms?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ro=this._renderer.getRenderTarget(),oo=this._renderer.getActiveCubeFace(),co=this._renderer.getActiveMipmapLevel(),lo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Un,minFilter:Un,generateMipmaps:!1,type:ta,format:Cn,colorSpace:_s,depthBuffer:!1},s=Th(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Th(t,e,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=jv(a)),this._blurMaterial=Kv(a,t,e)}return s}_compileMaterial(t){const e=new ne(this._lodPlanes[0],t);this._renderer.compile(e,ao)}_sceneToCubeUV(t,e,i,s){const o=new yn(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(Eh),h.toneMapping=ci,h.autoClear=!1;const u=new He({name:"PMREM.Background",side:on,depthWrite:!1,depthTest:!1}),g=new ne(new Ln,u);let v=!1;const m=t.background;m?m.isColor&&(u.color.copy(m),t.background=null,v=!0):(u.color.copy(Eh),v=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):x===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const _=this._cubeSize;Ra(s,x*_,p>2?_:0,_,_),h.setRenderTarget(s),v&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===ps||t.mapping===ms;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ch()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Rh());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new ne(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const c=this._cubeSize;Ra(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(r,ao)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=wh[(s-a-1)%wh.length];this._blur(t,a-1,a,r,o)}e.autoClear=i}_blur(t,e,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,i,s,"latitudinal",a),this._halfBlur(r,t,i,i,s,"longitudinal",a)}_halfBlur(t,e,i,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new ne(this._lodPlanes[s],l),d=l.uniforms,u=this._sizeLods[i]-1,g=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*Ti-1),v=a/g,m=isFinite(a)?1+Math.floor(h*v):Ti;m>Ti&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ti}`);const p=[];let x=0;for(let A=0;A<Ti;++A){const T=A/v,w=Math.exp(-T*T/2);p.push(w),A===0?x+=w:A<m&&(x+=2*w)}for(let A=0;A<p.length;A++)p[A]=p[A]/x;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=r==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:_}=this;d.dTheta.value=g,d.mipInt.value=_-i;const y=this._sizeLods[s],k=3*y*(s>_-os?s-_+os:0),b=4*(this._cubeSize-y);Ra(e,k,b,3*y,2*y),c.setRenderTarget(e),c.render(f,ao)}}function jv(n){const t=[],e=[],i=[];let s=n;const a=n-os+1+bh.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>n-os?c=bh[r-n+os-1]:r===0&&(c=0),i.push(c);const l=1/(o-2),h=-l,f=1+l,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,g=6,v=3,m=2,p=1,x=new Float32Array(v*g*u),_=new Float32Array(m*g*u),y=new Float32Array(p*g*u);for(let b=0;b<u;b++){const A=b%3*2/3-1,T=b>2?0:-1,w=[A,T,0,A+2/3,T,0,A+2/3,T+1,0,A,T,0,A+2/3,T+1,0,A,T+1,0];x.set(w,v*g*b),_.set(d,m*g*b);const M=[b,b,b,b,b,b];y.set(M,p*g*b)}const k=new Ue;k.setAttribute("position",new tn(x,v)),k.setAttribute("uv",new tn(_,m)),k.setAttribute("faceIndex",new tn(y,p)),t.push(k),s>os&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Th(n,t,e){const i=new Ii(n,t,e);return i.texture.mapping=pr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ra(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function Kv(n,t,e){const i=new Float32Array(Ti),s=new V(0,1,0);return new hi({name:"SphericalGaussianBlur",defines:{n:Ti,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Qc(),fragmentShader:`

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
		`,blending:oi,depthTest:!1,depthWrite:!1})}function Rh(){return new hi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qc(),fragmentShader:`

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
		`,blending:oi,depthTest:!1,depthWrite:!1})}function Ch(){return new hi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:oi,depthTest:!1,depthWrite:!1})}function Qc(){return`

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
	`}function Jv(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===$o||c===Yo,h=c===ps||c===ms;if(l||h){let f=t.get(o);const d=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Ah(n)),f=l?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const u=o.image;return l&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new Ah(n)),f=l?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",a),f.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:r}}function Qv(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&Us("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function t_(n,t,e,i){const s={},a=new WeakMap;function r(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)t.remove(v[m])}d.removeEventListener("dispose",r),delete s[d.id];const u=a.get(d);u&&(t.remove(u),a.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(f,d){return s[d.id]===!0||(d.addEventListener("dispose",r),s[d.id]=!0,e.memory.geometries++),d}function c(f){const d=f.attributes;for(const g in d)t.update(d[g],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const g in u){const v=u[g];for(let m=0,p=v.length;m<p;m++)t.update(v[m],n.ARRAY_BUFFER)}}function l(f){const d=[],u=f.index,g=f.attributes.position;let v=0;if(u!==null){const x=u.array;v=u.version;for(let _=0,y=x.length;_<y;_+=3){const k=x[_+0],b=x[_+1],A=x[_+2];d.push(k,b,b,A,A,k)}}else if(g!==void 0){const x=g.array;v=g.version;for(let _=0,y=x.length/3-1;_<y;_+=3){const k=_+0,b=_+1,A=_+2;d.push(k,b,b,A,A,k)}}else return;const m=new(jd(d)?eu:tu)(d,1);m.version=v;const p=a.get(f);p&&t.remove(p),a.set(f,m)}function h(f){const d=a.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&l(f)}else l(f);return a.get(f)}return{get:o,update:c,getWireframeAttribute:h}}function e_(n,t,e){let i;function s(d){i=d}let a,r;function o(d){a=d.type,r=d.bytesPerElement}function c(d,u){n.drawElements(i,u,a,d*r),e.update(u,i,1)}function l(d,u,g){g!==0&&(n.drawElementsInstanced(i,u,a,d*r,g),e.update(u,i,g))}function h(d,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,a,d,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,i,1)}function f(d,u,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/r,u[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(i,u,0,a,d,0,v,0,g);let p=0;for(let x=0;x<g;x++)p+=u[x]*v[x];e.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function n_(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(e.calls++,r){case n.TRIANGLES:e.triangles+=o*(a/3);break;case n.LINES:e.lines+=o*(a/2);break;case n.LINE_STRIP:e.lines+=o*(a-1);break;case n.LINE_LOOP:e.lines+=o*a;break;case n.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function i_(n,t,e){const i=new WeakMap,s=new Ae;function a(r,o,c){const l=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==f){let M=function(){T.dispose(),i.delete(o),o.removeEventListener("dispose",M)};var u=M;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),v===!0&&(y=2),m===!0&&(y=3);let k=o.attributes.position.count*y,b=1;k>t.maxTextureSize&&(b=Math.ceil(k/t.maxTextureSize),k=t.maxTextureSize);const A=new Float32Array(k*b*4*f),T=new Jd(A,k,b,f);T.type=Zn,T.needsUpdate=!0;const w=y*4;for(let P=0;P<f;P++){const F=p[P],N=x[P],B=_[P],D=k*b*4*P;for(let L=0;L<F.count;L++){const X=L*w;g===!0&&(s.fromBufferAttribute(F,L),A[D+X+0]=s.x,A[D+X+1]=s.y,A[D+X+2]=s.z,A[D+X+3]=0),v===!0&&(s.fromBufferAttribute(N,L),A[D+X+4]=s.x,A[D+X+5]=s.y,A[D+X+6]=s.z,A[D+X+7]=0),m===!0&&(s.fromBufferAttribute(B,L),A[D+X+8]=s.x,A[D+X+9]=s.y,A[D+X+10]=s.z,A[D+X+11]=B.itemSize===4?s.w:1)}}d={count:f,texture:T,size:new zt(k,b)},i.set(o,d),o.addEventListener("dispose",M)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",r.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const v=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:a}}function s_(n,t,e,i){let s=new WeakMap;function a(c){const l=i.render.frame,h=c.geometry,f=t.get(c,h);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return f}function r(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:r}}class ou extends Qe{constructor(t,e,i,s,a,r,o,c,l,h=hs){if(h!==hs&&h!==xs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===hs&&(i=Di),i===void 0&&h===xs&&(i=gs),super(null,s,a,r,o,c,h,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Pn,this.minFilter=c!==void 0?c:Pn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const cu=new Qe,Ph=new ou(1,1),lu=new Jd,hu=new X0,du=new su,Lh=[],Dh=[],Ih=new Float32Array(16),kh=new Float32Array(9),Uh=new Float32Array(4);function Ms(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let a=Lh[s];if(a===void 0&&(a=new Float32Array(s),Lh[s]=a),t!==0){i.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,n[r].toArray(a,o)}return a}function Ie(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function ke(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function xr(n,t){let e=Dh[t];e===void 0&&(e=new Int32Array(t),Dh[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function a_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function r_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;n.uniform2fv(this.addr,t),ke(e,t)}}function o_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ie(e,t))return;n.uniform3fv(this.addr,t),ke(e,t)}}function c_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;n.uniform4fv(this.addr,t),ke(e,t)}}function l_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ie(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),ke(e,t)}else{if(Ie(e,i))return;Uh.set(i),n.uniformMatrix2fv(this.addr,!1,Uh),ke(e,i)}}function h_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ie(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),ke(e,t)}else{if(Ie(e,i))return;kh.set(i),n.uniformMatrix3fv(this.addr,!1,kh),ke(e,i)}}function d_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ie(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),ke(e,t)}else{if(Ie(e,i))return;Ih.set(i),n.uniformMatrix4fv(this.addr,!1,Ih),ke(e,i)}}function u_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function f_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;n.uniform2iv(this.addr,t),ke(e,t)}}function p_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;n.uniform3iv(this.addr,t),ke(e,t)}}function m_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;n.uniform4iv(this.addr,t),ke(e,t)}}function g_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function x_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;n.uniform2uiv(this.addr,t),ke(e,t)}}function v_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;n.uniform3uiv(this.addr,t),ke(e,t)}}function __(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;n.uniform4uiv(this.addr,t),ke(e,t)}}function y_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Ph.compareFunction=qd,a=Ph):a=cu,e.setTexture2D(t||a,s)}function M_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||hu,s)}function S_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||du,s)}function b_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||lu,s)}function E_(n){switch(n){case 5126:return a_;case 35664:return r_;case 35665:return o_;case 35666:return c_;case 35674:return l_;case 35675:return h_;case 35676:return d_;case 5124:case 35670:return u_;case 35667:case 35671:return f_;case 35668:case 35672:return p_;case 35669:case 35673:return m_;case 5125:return g_;case 36294:return x_;case 36295:return v_;case 36296:return __;case 35678:case 36198:case 36298:case 36306:case 35682:return y_;case 35679:case 36299:case 36307:return M_;case 35680:case 36300:case 36308:case 36293:return S_;case 36289:case 36303:case 36311:case 36292:return b_}}function w_(n,t){n.uniform1fv(this.addr,t)}function A_(n,t){const e=Ms(t,this.size,2);n.uniform2fv(this.addr,e)}function T_(n,t){const e=Ms(t,this.size,3);n.uniform3fv(this.addr,e)}function R_(n,t){const e=Ms(t,this.size,4);n.uniform4fv(this.addr,e)}function C_(n,t){const e=Ms(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function P_(n,t){const e=Ms(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function L_(n,t){const e=Ms(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function D_(n,t){n.uniform1iv(this.addr,t)}function I_(n,t){n.uniform2iv(this.addr,t)}function k_(n,t){n.uniform3iv(this.addr,t)}function U_(n,t){n.uniform4iv(this.addr,t)}function F_(n,t){n.uniform1uiv(this.addr,t)}function N_(n,t){n.uniform2uiv(this.addr,t)}function z_(n,t){n.uniform3uiv(this.addr,t)}function O_(n,t){n.uniform4uiv(this.addr,t)}function B_(n,t,e){const i=this.cache,s=t.length,a=xr(e,s);Ie(i,a)||(n.uniform1iv(this.addr,a),ke(i,a));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||cu,a[r])}function H_(n,t,e){const i=this.cache,s=t.length,a=xr(e,s);Ie(i,a)||(n.uniform1iv(this.addr,a),ke(i,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||hu,a[r])}function G_(n,t,e){const i=this.cache,s=t.length,a=xr(e,s);Ie(i,a)||(n.uniform1iv(this.addr,a),ke(i,a));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||du,a[r])}function V_(n,t,e){const i=this.cache,s=t.length,a=xr(e,s);Ie(i,a)||(n.uniform1iv(this.addr,a),ke(i,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||lu,a[r])}function X_(n){switch(n){case 5126:return w_;case 35664:return A_;case 35665:return T_;case 35666:return R_;case 35674:return C_;case 35675:return P_;case 35676:return L_;case 5124:case 35670:return D_;case 35667:case 35671:return I_;case 35668:case 35672:return k_;case 35669:case 35673:return U_;case 5125:return F_;case 36294:return N_;case 36295:return z_;case 36296:return O_;case 35678:case 36198:case 36298:case 36306:case 35682:return B_;case 35679:case 36299:case 36307:return H_;case 35680:case 36300:case 36308:case 36293:return G_;case 36289:case 36303:case 36311:case 36292:return V_}}class W_{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=E_(e.type)}}class $_{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=X_(e.type)}}class Y_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(t,e[o.id],i)}}}const ho=/(\w+)(\])?(\[|\.)?/g;function Fh(n,t){n.seq.push(t),n.map[t.id]=t}function Z_(n,t,e){const i=n.name,s=i.length;for(ho.lastIndex=0;;){const a=ho.exec(i),r=ho.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){Fh(e,l===void 0?new W_(o,n,t):new $_(o,n,t));break}else{let f=e.map[o];f===void 0&&(f=new Y_(o),Fh(e,f)),e=f}}}class Za{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=t.getActiveUniform(e,s),r=t.getUniformLocation(e,a.name);Z_(a,r,this)}}setValue(t,e,i,s){const a=this.map[e];a!==void 0&&a.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let a=0,r=e.length;a!==r;++a){const o=e[a],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,a=t.length;s!==a;++s){const r=t[s];r.id in e&&i.push(r)}return i}}function Nh(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const q_=37297;let j_=0;function K_(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return i.join(`
`)}const zh=new Jt;function J_(n){re._getMatrix(zh,re.workingColorSpace,n);const t=`mat3( ${zh.elements.map(e=>e.toFixed(4))} )`;switch(re.getTransfer(n)){case mr:return[t,"LinearTransferOETF"];case ge:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Oh(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+K_(n.getShaderSource(t),r)}else return s}function Q_(n,t){const e=J_(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function ty(n,t){let e;switch(t){case n0:e="Linear";break;case i0:e="Reinhard";break;case s0:e="Cineon";break;case a0:e="ACESFilmic";break;case o0:e="AgX";break;case c0:e="Neutral";break;case r0:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ca=new V;function ey(){re.getLuminanceCoefficients(Ca);const n=Ca.x.toFixed(4),t=Ca.y.toFixed(4),e=Ca.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ny(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fs).join(`
`)}function iy(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function sy(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(t,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:n.getAttribLocation(t,r),locationSize:o}}return e}function Fs(n){return n!==""}function Bh(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Hh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const ay=/^[ \t]*#include +<([\w\d./]+)>/gm;function bc(n){return n.replace(ay,oy)}const ry=new Map;function oy(n,t){let e=Qt[t];if(e===void 0){const i=ry.get(t);if(i!==void 0)e=Qt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return bc(e)}const cy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gh(n){return n.replace(cy,ly)}function ly(n,t,e,i){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Vh(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function hy(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Ud?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Fd?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Wn&&(t="SHADOWMAP_TYPE_VSM"),t}function dy(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ps:case ms:t="ENVMAP_TYPE_CUBE";break;case pr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function uy(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ms:t="ENVMAP_MODE_REFRACTION";break}return t}function fy(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Gc:t="ENVMAP_BLENDING_MULTIPLY";break;case t0:t="ENVMAP_BLENDING_MIX";break;case e0:t="ENVMAP_BLENDING_ADD";break}return t}function py(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function my(n,t,e,i){const s=n.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const c=hy(e),l=dy(e),h=uy(e),f=fy(e),d=py(e),u=ny(e),g=iy(a),v=s.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Fs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Fs).join(`
`),p.length>0&&(p+=`
`)):(m=[Vh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fs).join(`
`),p=[Vh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ci?"#define TONE_MAPPING":"",e.toneMapping!==ci?Qt.tonemapping_pars_fragment:"",e.toneMapping!==ci?ty("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,Q_("linearToOutputTexel",e.outputColorSpace),ey(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Fs).join(`
`)),r=bc(r),r=Bh(r,e),r=Hh(r,e),o=bc(o),o=Bh(o,e),o=Hh(o,e),r=Gh(r),o=Gh(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===th?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===th?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const _=x+m+r,y=x+p+o,k=Nh(s,s.VERTEX_SHADER,_),b=Nh(s,s.FRAGMENT_SHADER,y);s.attachShader(v,k),s.attachShader(v,b),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(P){if(n.debug.checkShaderErrors){const F=s.getProgramInfoLog(v).trim(),N=s.getShaderInfoLog(k).trim(),B=s.getShaderInfoLog(b).trim();let D=!0,L=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(D=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,k,b);else{const X=Oh(s,k,"vertex"),H=Oh(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+F+`
`+X+`
`+H)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(N===""||B==="")&&(L=!1);L&&(P.diagnostics={runnable:D,programLog:F,vertexShader:{log:N,prefix:m},fragmentShader:{log:B,prefix:p}})}s.deleteShader(k),s.deleteShader(b),T=new Za(s,v),w=sy(s,v)}let T;this.getUniforms=function(){return T===void 0&&A(this),T};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,q_)),M},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=j_++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=k,this.fragmentShader=b,this}let gy=0;class xy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new vy(t),e.set(t,i)),i}}class vy{constructor(t){this.id=gy++,this.code=t,this.usedTimes=0}}function _y(n,t,e,i,s,a,r){const o=new Kc,c=new xy,l=new Set,h=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures;let u=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(w){return l.add(w),w===0?"uv":`uv${w}`}function m(w,M,P,F,N){const B=F.fog,D=N.geometry,L=w.isMeshStandardMaterial?F.environment:null,X=(w.isMeshStandardMaterial?e:t).get(w.envMap||L),H=X&&X.mapping===pr?X.image.height:null,q=g[w.type];w.precision!==null&&(u=s.getMaxPrecision(w.precision),u!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",u,"instead."));const j=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,ot=j!==void 0?j.length:0;let dt=0;D.morphAttributes.position!==void 0&&(dt=1),D.morphAttributes.normal!==void 0&&(dt=2),D.morphAttributes.color!==void 0&&(dt=3);let xt,Y,tt,ut;if(q){const $t=kn[q];xt=$t.vertexShader,Y=$t.fragmentShader}else xt=w.vertexShader,Y=w.fragmentShader,c.update(w),tt=c.getVertexShaderID(w),ut=c.getFragmentShaderID(w);const K=n.getRenderTarget(),ft=n.state.buffers.depth.getReversed(),It=N.isInstancedMesh===!0,Ct=N.isBatchedMesh===!0,vt=!!w.map,At=!!w.matcap,wt=!!X,G=!!w.aoMap,jt=!!w.lightMap,kt=!!w.bumpMap,Ut=!!w.normalMap,Tt=!!w.displacementMap,St=!!w.emissiveMap,Pt=!!w.metalnessMap,I=!!w.roughnessMap,E=w.anisotropy>0,W=w.clearcoat>0,st=w.dispersion>0,ct=w.iridescence>0,at=w.sheen>0,Ft=w.transmission>0,Q=E&&!!w.anisotropyMap,pt=W&&!!w.clearcoatMap,Gt=W&&!!w.clearcoatNormalMap,nt=W&&!!w.clearcoatRoughnessMap,Mt=ct&&!!w.iridescenceMap,O=ct&&!!w.iridescenceThicknessMap,it=at&&!!w.sheenColorMap,ht=at&&!!w.sheenRoughnessMap,Nt=!!w.specularMap,Ot=!!w.specularColorMap,Xt=!!w.specularIntensityMap,z=Ft&&!!w.transmissionMap,_t=Ft&&!!w.thicknessMap,J=!!w.gradientMap,rt=!!w.alphaMap,gt=w.alphaTest>0,yt=!!w.alphaHash,Ht=!!w.extensions;let Zt=ci;w.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Zt=n.toneMapping);const ie={shaderID:q,shaderType:w.type,shaderName:w.name,vertexShader:xt,fragmentShader:Y,defines:w.defines,customVertexShaderID:tt,customFragmentShaderID:ut,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:u,batching:Ct,batchingColor:Ct&&N._colorsTexture!==null,instancing:It,instancingColor:It&&N.instanceColor!==null,instancingMorph:It&&N.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:_s,alphaToCoverage:!!w.alphaToCoverage,map:vt,matcap:At,envMap:wt,envMapMode:wt&&X.mapping,envMapCubeUVHeight:H,aoMap:G,lightMap:jt,bumpMap:kt,normalMap:Ut,displacementMap:d&&Tt,emissiveMap:St,normalMapObjectSpace:Ut&&w.normalMapType===u0,normalMapTangentSpace:Ut&&w.normalMapType===Zd,metalnessMap:Pt,roughnessMap:I,anisotropy:E,anisotropyMap:Q,clearcoat:W,clearcoatMap:pt,clearcoatNormalMap:Gt,clearcoatRoughnessMap:nt,dispersion:st,iridescence:ct,iridescenceMap:Mt,iridescenceThicknessMap:O,sheen:at,sheenColorMap:it,sheenRoughnessMap:ht,specularMap:Nt,specularColorMap:Ot,specularIntensityMap:Xt,transmission:Ft,transmissionMap:z,thicknessMap:_t,gradientMap:J,opaque:w.transparent===!1&&w.blending===ls&&w.alphaToCoverage===!1,alphaMap:rt,alphaTest:gt,alphaHash:yt,combine:w.combine,mapUv:vt&&v(w.map.channel),aoMapUv:G&&v(w.aoMap.channel),lightMapUv:jt&&v(w.lightMap.channel),bumpMapUv:kt&&v(w.bumpMap.channel),normalMapUv:Ut&&v(w.normalMap.channel),displacementMapUv:Tt&&v(w.displacementMap.channel),emissiveMapUv:St&&v(w.emissiveMap.channel),metalnessMapUv:Pt&&v(w.metalnessMap.channel),roughnessMapUv:I&&v(w.roughnessMap.channel),anisotropyMapUv:Q&&v(w.anisotropyMap.channel),clearcoatMapUv:pt&&v(w.clearcoatMap.channel),clearcoatNormalMapUv:Gt&&v(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&v(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Mt&&v(w.iridescenceMap.channel),iridescenceThicknessMapUv:O&&v(w.iridescenceThicknessMap.channel),sheenColorMapUv:it&&v(w.sheenColorMap.channel),sheenRoughnessMapUv:ht&&v(w.sheenRoughnessMap.channel),specularMapUv:Nt&&v(w.specularMap.channel),specularColorMapUv:Ot&&v(w.specularColorMap.channel),specularIntensityMapUv:Xt&&v(w.specularIntensityMap.channel),transmissionMapUv:z&&v(w.transmissionMap.channel),thicknessMapUv:_t&&v(w.thicknessMap.channel),alphaMapUv:rt&&v(w.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(Ut||E),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!D.attributes.uv&&(vt||rt),fog:!!B,useFog:w.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:ft,skinning:N.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:ot,morphTextureStride:dt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:Zt,decodeVideoTexture:vt&&w.map.isVideoTexture===!0&&re.getTransfer(w.map.colorSpace)===ge,decodeVideoTextureEmissive:St&&w.emissiveMap.isVideoTexture===!0&&re.getTransfer(w.emissiveMap.colorSpace)===ge,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===we,flipSided:w.side===on,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Ht&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ht&&w.extensions.multiDraw===!0||Ct)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return ie.vertexUv1s=l.has(1),ie.vertexUv2s=l.has(2),ie.vertexUv3s=l.has(3),l.clear(),ie}function p(w){const M=[];if(w.shaderID?M.push(w.shaderID):(M.push(w.customVertexShaderID),M.push(w.customFragmentShaderID)),w.defines!==void 0)for(const P in w.defines)M.push(P),M.push(w.defines[P]);return w.isRawShaderMaterial===!1&&(x(M,w),_(M,w),M.push(n.outputColorSpace)),M.push(w.customProgramCacheKey),M.join()}function x(w,M){w.push(M.precision),w.push(M.outputColorSpace),w.push(M.envMapMode),w.push(M.envMapCubeUVHeight),w.push(M.mapUv),w.push(M.alphaMapUv),w.push(M.lightMapUv),w.push(M.aoMapUv),w.push(M.bumpMapUv),w.push(M.normalMapUv),w.push(M.displacementMapUv),w.push(M.emissiveMapUv),w.push(M.metalnessMapUv),w.push(M.roughnessMapUv),w.push(M.anisotropyMapUv),w.push(M.clearcoatMapUv),w.push(M.clearcoatNormalMapUv),w.push(M.clearcoatRoughnessMapUv),w.push(M.iridescenceMapUv),w.push(M.iridescenceThicknessMapUv),w.push(M.sheenColorMapUv),w.push(M.sheenRoughnessMapUv),w.push(M.specularMapUv),w.push(M.specularColorMapUv),w.push(M.specularIntensityMapUv),w.push(M.transmissionMapUv),w.push(M.thicknessMapUv),w.push(M.combine),w.push(M.fogExp2),w.push(M.sizeAttenuation),w.push(M.morphTargetsCount),w.push(M.morphAttributeCount),w.push(M.numDirLights),w.push(M.numPointLights),w.push(M.numSpotLights),w.push(M.numSpotLightMaps),w.push(M.numHemiLights),w.push(M.numRectAreaLights),w.push(M.numDirLightShadows),w.push(M.numPointLightShadows),w.push(M.numSpotLightShadows),w.push(M.numSpotLightShadowsWithMaps),w.push(M.numLightProbes),w.push(M.shadowMapType),w.push(M.toneMapping),w.push(M.numClippingPlanes),w.push(M.numClipIntersection),w.push(M.depthPacking)}function _(w,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),w.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),w.push(o.mask)}function y(w){const M=g[w.type];let P;if(M){const F=kn[M];P=ng.clone(F.uniforms)}else P=w.uniforms;return P}function k(w,M){let P;for(let F=0,N=h.length;F<N;F++){const B=h[F];if(B.cacheKey===M){P=B,++P.usedTimes;break}}return P===void 0&&(P=new my(n,M,w,a),h.push(P)),P}function b(w){if(--w.usedTimes===0){const M=h.indexOf(w);h[M]=h[h.length-1],h.pop(),w.destroy()}}function A(w){c.remove(w)}function T(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:k,releaseProgram:b,releaseShaderCache:A,programs:h,dispose:T}}function yy(){let n=new WeakMap;function t(r){return n.has(r)}function e(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,c){n.get(r)[o]=c}function a(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:a}}function My(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Xh(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Wh(){const n=[];let t=0;const e=[],i=[],s=[];function a(){t=0,e.length=0,i.length=0,s.length=0}function r(f,d,u,g,v,m){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:g,renderOrder:f.renderOrder,z:v,group:m},n[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=v,p.group=m),t++,p}function o(f,d,u,g,v,m){const p=r(f,d,u,g,v,m);u.transmission>0?i.push(p):u.transparent===!0?s.push(p):e.push(p)}function c(f,d,u,g,v,m){const p=r(f,d,u,g,v,m);u.transmission>0?i.unshift(p):u.transparent===!0?s.unshift(p):e.unshift(p)}function l(f,d){e.length>1&&e.sort(f||My),i.length>1&&i.sort(d||Xh),s.length>1&&s.sort(d||Xh)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:s,init:a,push:o,unshift:c,finish:h,sort:l}}function Sy(){let n=new WeakMap;function t(i,s){const a=n.get(i);let r;return a===void 0?(r=new Wh,n.set(i,[r])):s>=a.length?(r=new Wh,a.push(r)):r=a[s],r}function e(){n=new WeakMap}return{get:t,dispose:e}}function by(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new V,color:new Yt};break;case"SpotLight":e={position:new V,direction:new V,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new V,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new V,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":e={color:new Yt,position:new V,halfWidth:new V,halfHeight:new V};break}return n[t.id]=e,e}}}function Ey(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new zt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new zt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new zt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let wy=0;function Ay(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Ty(n){const t=new by,e=Ey(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new V);const s=new V,a=new ve,r=new ve;function o(l){let h=0,f=0,d=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let u=0,g=0,v=0,m=0,p=0,x=0,_=0,y=0,k=0,b=0,A=0;l.sort(Ay);for(let w=0,M=l.length;w<M;w++){const P=l[w],F=P.color,N=P.intensity,B=P.distance,D=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=F.r*N,f+=F.g*N,d+=F.b*N;else if(P.isLightProbe){for(let L=0;L<9;L++)i.probe[L].addScaledVector(P.sh.coefficients[L],N);A++}else if(P.isDirectionalLight){const L=t.get(P);if(L.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const X=P.shadow,H=e.get(P);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,i.directionalShadow[u]=H,i.directionalShadowMap[u]=D,i.directionalShadowMatrix[u]=P.shadow.matrix,x++}i.directional[u]=L,u++}else if(P.isSpotLight){const L=t.get(P);L.position.setFromMatrixPosition(P.matrixWorld),L.color.copy(F).multiplyScalar(N),L.distance=B,L.coneCos=Math.cos(P.angle),L.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),L.decay=P.decay,i.spot[v]=L;const X=P.shadow;if(P.map&&(i.spotLightMap[k]=P.map,k++,X.updateMatrices(P),P.castShadow&&b++),i.spotLightMatrix[v]=X.matrix,P.castShadow){const H=e.get(P);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,i.spotShadow[v]=H,i.spotShadowMap[v]=D,y++}v++}else if(P.isRectAreaLight){const L=t.get(P);L.color.copy(F).multiplyScalar(N),L.halfWidth.set(P.width*.5,0,0),L.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=L,m++}else if(P.isPointLight){const L=t.get(P);if(L.color.copy(P.color).multiplyScalar(P.intensity),L.distance=P.distance,L.decay=P.decay,P.castShadow){const X=P.shadow,H=e.get(P);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,H.shadowCameraNear=X.camera.near,H.shadowCameraFar=X.camera.far,i.pointShadow[g]=H,i.pointShadowMap[g]=D,i.pointShadowMatrix[g]=P.shadow.matrix,_++}i.point[g]=L,g++}else if(P.isHemisphereLight){const L=t.get(P);L.skyColor.copy(P.color).multiplyScalar(N),L.groundColor.copy(P.groundColor).multiplyScalar(N),i.hemi[p]=L,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Dt.LTC_FLOAT_1,i.rectAreaLTC2=Dt.LTC_FLOAT_2):(i.rectAreaLTC1=Dt.LTC_HALF_1,i.rectAreaLTC2=Dt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==u||T.pointLength!==g||T.spotLength!==v||T.rectAreaLength!==m||T.hemiLength!==p||T.numDirectionalShadows!==x||T.numPointShadows!==_||T.numSpotShadows!==y||T.numSpotMaps!==k||T.numLightProbes!==A)&&(i.directional.length=u,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=y+k-b,i.spotLightMap.length=k,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=A,T.directionalLength=u,T.pointLength=g,T.spotLength=v,T.rectAreaLength=m,T.hemiLength=p,T.numDirectionalShadows=x,T.numPointShadows=_,T.numSpotShadows=y,T.numSpotMaps=k,T.numLightProbes=A,i.version=wy++)}function c(l,h){let f=0,d=0,u=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const _=l[p];if(_.isDirectionalLight){const y=i.directional[f];y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),f++}else if(_.isSpotLight){const y=i.spot[u];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(_.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(m),r.identity(),a.copy(_.matrixWorld),a.premultiply(m),r.extractRotation(a),y.halfWidth.set(_.width*.5,0,0),y.halfHeight.set(0,_.height*.5,0),y.halfWidth.applyMatrix4(r),y.halfHeight.applyMatrix4(r),g++}else if(_.isPointLight){const y=i.point[d];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(m),d++}else if(_.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(_.matrixWorld),y.direction.transformDirection(m),v++}}}return{setup:o,setupView:c,state:i}}function $h(n){const t=new Ty(n),e=[],i=[];function s(h){l.camera=h,e.length=0,i.length=0}function a(h){e.push(h)}function r(h){i.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function Ry(n){let t=new WeakMap;function e(s,a=0){const r=t.get(s);let o;return r===void 0?(o=new $h(n),t.set(s,[o])):a>=r.length?(o=new $h(n),r.push(o)):o=r[a],o}function i(){t=new WeakMap}return{get:e,dispose:i}}class Cy extends Ui{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=h0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Py extends Ui{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Ly=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Dy=`uniform sampler2D shadow_pass;
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
}`;function Iy(n,t,e){let i=new Jc;const s=new zt,a=new zt,r=new Ae,o=new Cy({depthPacking:d0}),c=new Py,l={},h=e.maxTextureSize,f={[li]:on,[on]:li,[we]:we},d=new hi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new zt},radius:{value:4}},vertexShader:Ly,fragmentShader:Dy}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const g=new Ue;g.setAttribute("position",new tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ne(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ud;let p=this.type;this.render=function(b,A,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const w=n.getRenderTarget(),M=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),F=n.state;F.setBlending(oi),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const N=p!==Wn&&this.type===Wn,B=p===Wn&&this.type!==Wn;for(let D=0,L=b.length;D<L;D++){const X=b[D],H=X.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const q=H.getFrameExtents();if(s.multiply(q),a.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/q.x),s.x=a.x*q.x,H.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/q.y),s.y=a.y*q.y,H.mapSize.y=a.y)),H.map===null||N===!0||B===!0){const ot=this.type!==Wn?{minFilter:Pn,magFilter:Pn}:{};H.map!==null&&H.map.dispose(),H.map=new Ii(s.x,s.y,ot),H.map.texture.name=X.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();const j=H.getViewportCount();for(let ot=0;ot<j;ot++){const dt=H.getViewport(ot);r.set(a.x*dt.x,a.y*dt.y,a.x*dt.z,a.y*dt.w),F.viewport(r),H.updateMatrices(X,ot),i=H.getFrustum(),y(A,T,H.camera,X,this.type)}H.isPointLightShadow!==!0&&this.type===Wn&&x(H,T),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(w,M,P)};function x(b,A){const T=t.update(v);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,u.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Ii(s.x,s.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(A,null,T,d,v,null),u.uniforms.shadow_pass.value=b.mapPass.texture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(A,null,T,u,v,null)}function _(b,A,T,w){let M=null;const P=T.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(P!==void 0)M=P;else if(M=T.isPointLight===!0?c:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const F=M.uuid,N=A.uuid;let B=l[F];B===void 0&&(B={},l[F]=B);let D=B[N];D===void 0&&(D=M.clone(),B[N]=D,A.addEventListener("dispose",k)),M=D}if(M.visible=A.visible,M.wireframe=A.wireframe,w===Wn?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:f[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=n.properties.get(M);F.light=T}return M}function y(b,A,T,w,M){if(b.visible===!1)return;if(b.layers.test(A.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&M===Wn)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,b.matrixWorld);const N=t.update(b),B=b.material;if(Array.isArray(B)){const D=N.groups;for(let L=0,X=D.length;L<X;L++){const H=D[L],q=B[H.materialIndex];if(q&&q.visible){const j=_(b,q,w,M);b.onBeforeShadow(n,b,A,T,N,j,H),n.renderBufferDirect(T,null,N,j,b,H),b.onAfterShadow(n,b,A,T,N,j,H)}}}else if(B.visible){const D=_(b,B,w,M);b.onBeforeShadow(n,b,A,T,N,D,null),n.renderBufferDirect(T,null,N,D,b,null),b.onAfterShadow(n,b,A,T,N,D,null)}}const F=b.children;for(let N=0,B=F.length;N<B;N++)y(F[N],A,T,w,M)}function k(b){b.target.removeEventListener("dispose",k);for(const T in l){const w=l[T],M=b.target.uuid;M in w&&(w[M].dispose(),delete w[M])}}}const ky={[Oo]:Bo,[Ho]:Xo,[Go]:Wo,[fs]:Vo,[Bo]:Oo,[Xo]:Ho,[Wo]:Go,[Vo]:fs};function Uy(n,t){function e(){let z=!1;const _t=new Ae;let J=null;const rt=new Ae(0,0,0,0);return{setMask:function(gt){J!==gt&&!z&&(n.colorMask(gt,gt,gt,gt),J=gt)},setLocked:function(gt){z=gt},setClear:function(gt,yt,Ht,Zt,ie){ie===!0&&(gt*=Zt,yt*=Zt,Ht*=Zt),_t.set(gt,yt,Ht,Zt),rt.equals(_t)===!1&&(n.clearColor(gt,yt,Ht,Zt),rt.copy(_t))},reset:function(){z=!1,J=null,rt.set(-1,0,0,0)}}}function i(){let z=!1,_t=!1,J=null,rt=null,gt=null;return{setReversed:function(yt){if(_t!==yt){const Ht=t.get("EXT_clip_control");_t?Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.ZERO_TO_ONE_EXT):Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.NEGATIVE_ONE_TO_ONE_EXT);const Zt=gt;gt=null,this.setClear(Zt)}_t=yt},getReversed:function(){return _t},setTest:function(yt){yt?K(n.DEPTH_TEST):ft(n.DEPTH_TEST)},setMask:function(yt){J!==yt&&!z&&(n.depthMask(yt),J=yt)},setFunc:function(yt){if(_t&&(yt=ky[yt]),rt!==yt){switch(yt){case Oo:n.depthFunc(n.NEVER);break;case Bo:n.depthFunc(n.ALWAYS);break;case Ho:n.depthFunc(n.LESS);break;case fs:n.depthFunc(n.LEQUAL);break;case Go:n.depthFunc(n.EQUAL);break;case Vo:n.depthFunc(n.GEQUAL);break;case Xo:n.depthFunc(n.GREATER);break;case Wo:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}rt=yt}},setLocked:function(yt){z=yt},setClear:function(yt){gt!==yt&&(_t&&(yt=1-yt),n.clearDepth(yt),gt=yt)},reset:function(){z=!1,J=null,rt=null,gt=null,_t=!1}}}function s(){let z=!1,_t=null,J=null,rt=null,gt=null,yt=null,Ht=null,Zt=null,ie=null;return{setTest:function($t){z||($t?K(n.STENCIL_TEST):ft(n.STENCIL_TEST))},setMask:function($t){_t!==$t&&!z&&(n.stencilMask($t),_t=$t)},setFunc:function($t,ce,pe){(J!==$t||rt!==ce||gt!==pe)&&(n.stencilFunc($t,ce,pe),J=$t,rt=ce,gt=pe)},setOp:function($t,ce,pe){(yt!==$t||Ht!==ce||Zt!==pe)&&(n.stencilOp($t,ce,pe),yt=$t,Ht=ce,Zt=pe)},setLocked:function($t){z=$t},setClear:function($t){ie!==$t&&(n.clearStencil($t),ie=$t)},reset:function(){z=!1,_t=null,J=null,rt=null,gt=null,yt=null,Ht=null,Zt=null,ie=null}}}const a=new e,r=new i,o=new s,c=new WeakMap,l=new WeakMap;let h={},f={},d=new WeakMap,u=[],g=null,v=!1,m=null,p=null,x=null,_=null,y=null,k=null,b=null,A=new Yt(0,0,0),T=0,w=!1,M=null,P=null,F=null,N=null,B=null;const D=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let L=!1,X=0;const H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(H)[1]),L=X>=1):H.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),L=X>=2);let q=null,j={};const ot=n.getParameter(n.SCISSOR_BOX),dt=n.getParameter(n.VIEWPORT),xt=new Ae().fromArray(ot),Y=new Ae().fromArray(dt);function tt(z,_t,J,rt){const gt=new Uint8Array(4),yt=n.createTexture();n.bindTexture(z,yt),n.texParameteri(z,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(z,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ht=0;Ht<J;Ht++)z===n.TEXTURE_3D||z===n.TEXTURE_2D_ARRAY?n.texImage3D(_t,0,n.RGBA,1,1,rt,0,n.RGBA,n.UNSIGNED_BYTE,gt):n.texImage2D(_t+Ht,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,gt);return yt}const ut={};ut[n.TEXTURE_2D]=tt(n.TEXTURE_2D,n.TEXTURE_2D,1),ut[n.TEXTURE_CUBE_MAP]=tt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ut[n.TEXTURE_2D_ARRAY]=tt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ut[n.TEXTURE_3D]=tt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),K(n.DEPTH_TEST),r.setFunc(fs),kt(!1),Ut(jl),K(n.CULL_FACE),G(oi);function K(z){h[z]!==!0&&(n.enable(z),h[z]=!0)}function ft(z){h[z]!==!1&&(n.disable(z),h[z]=!1)}function It(z,_t){return f[z]!==_t?(n.bindFramebuffer(z,_t),f[z]=_t,z===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=_t),z===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=_t),!0):!1}function Ct(z,_t){let J=u,rt=!1;if(z){J=d.get(_t),J===void 0&&(J=[],d.set(_t,J));const gt=z.textures;if(J.length!==gt.length||J[0]!==n.COLOR_ATTACHMENT0){for(let yt=0,Ht=gt.length;yt<Ht;yt++)J[yt]=n.COLOR_ATTACHMENT0+yt;J.length=gt.length,rt=!0}}else J[0]!==n.BACK&&(J[0]=n.BACK,rt=!0);rt&&n.drawBuffers(J)}function vt(z){return g!==z?(n.useProgram(z),g=z,!0):!1}const At={[Ai]:n.FUNC_ADD,[Nm]:n.FUNC_SUBTRACT,[zm]:n.FUNC_REVERSE_SUBTRACT};At[Om]=n.MIN,At[Bm]=n.MAX;const wt={[Hm]:n.ZERO,[Gm]:n.ONE,[Vm]:n.SRC_COLOR,[No]:n.SRC_ALPHA,[qm]:n.SRC_ALPHA_SATURATE,[Ym]:n.DST_COLOR,[Wm]:n.DST_ALPHA,[Xm]:n.ONE_MINUS_SRC_COLOR,[zo]:n.ONE_MINUS_SRC_ALPHA,[Zm]:n.ONE_MINUS_DST_COLOR,[$m]:n.ONE_MINUS_DST_ALPHA,[jm]:n.CONSTANT_COLOR,[Km]:n.ONE_MINUS_CONSTANT_COLOR,[Jm]:n.CONSTANT_ALPHA,[Qm]:n.ONE_MINUS_CONSTANT_ALPHA};function G(z,_t,J,rt,gt,yt,Ht,Zt,ie,$t){if(z===oi){v===!0&&(ft(n.BLEND),v=!1);return}if(v===!1&&(K(n.BLEND),v=!0),z!==Fm){if(z!==m||$t!==w){if((p!==Ai||y!==Ai)&&(n.blendEquation(n.FUNC_ADD),p=Ai,y=Ai),$t)switch(z){case ls:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case wi:n.blendFunc(n.ONE,n.ONE);break;case Kl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Jl:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case ls:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case wi:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Kl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Jl:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}x=null,_=null,k=null,b=null,A.set(0,0,0),T=0,m=z,w=$t}return}gt=gt||_t,yt=yt||J,Ht=Ht||rt,(_t!==p||gt!==y)&&(n.blendEquationSeparate(At[_t],At[gt]),p=_t,y=gt),(J!==x||rt!==_||yt!==k||Ht!==b)&&(n.blendFuncSeparate(wt[J],wt[rt],wt[yt],wt[Ht]),x=J,_=rt,k=yt,b=Ht),(Zt.equals(A)===!1||ie!==T)&&(n.blendColor(Zt.r,Zt.g,Zt.b,ie),A.copy(Zt),T=ie),m=z,w=!1}function jt(z,_t){z.side===we?ft(n.CULL_FACE):K(n.CULL_FACE);let J=z.side===on;_t&&(J=!J),kt(J),z.blending===ls&&z.transparent===!1?G(oi):G(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),r.setFunc(z.depthFunc),r.setTest(z.depthTest),r.setMask(z.depthWrite),a.setMask(z.colorWrite);const rt=z.stencilWrite;o.setTest(rt),rt&&(o.setMask(z.stencilWriteMask),o.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),o.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),St(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):ft(n.SAMPLE_ALPHA_TO_COVERAGE)}function kt(z){M!==z&&(z?n.frontFace(n.CW):n.frontFace(n.CCW),M=z)}function Ut(z){z!==km?(K(n.CULL_FACE),z!==P&&(z===jl?n.cullFace(n.BACK):z===Um?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ft(n.CULL_FACE),P=z}function Tt(z){z!==F&&(L&&n.lineWidth(z),F=z)}function St(z,_t,J){z?(K(n.POLYGON_OFFSET_FILL),(N!==_t||B!==J)&&(n.polygonOffset(_t,J),N=_t,B=J)):ft(n.POLYGON_OFFSET_FILL)}function Pt(z){z?K(n.SCISSOR_TEST):ft(n.SCISSOR_TEST)}function I(z){z===void 0&&(z=n.TEXTURE0+D-1),q!==z&&(n.activeTexture(z),q=z)}function E(z,_t,J){J===void 0&&(q===null?J=n.TEXTURE0+D-1:J=q);let rt=j[J];rt===void 0&&(rt={type:void 0,texture:void 0},j[J]=rt),(rt.type!==z||rt.texture!==_t)&&(q!==J&&(n.activeTexture(J),q=J),n.bindTexture(z,_t||ut[z]),rt.type=z,rt.texture=_t)}function W(){const z=j[q];z!==void 0&&z.type!==void 0&&(n.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function st(){try{n.compressedTexImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ct(){try{n.compressedTexImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function at(){try{n.texSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ft(){try{n.texSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Q(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function pt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Gt(){try{n.texStorage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function nt(){try{n.texStorage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Mt(){try{n.texImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function O(){try{n.texImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function it(z){xt.equals(z)===!1&&(n.scissor(z.x,z.y,z.z,z.w),xt.copy(z))}function ht(z){Y.equals(z)===!1&&(n.viewport(z.x,z.y,z.z,z.w),Y.copy(z))}function Nt(z,_t){let J=l.get(_t);J===void 0&&(J=new WeakMap,l.set(_t,J));let rt=J.get(z);rt===void 0&&(rt=n.getUniformBlockIndex(_t,z.name),J.set(z,rt))}function Ot(z,_t){const rt=l.get(_t).get(z);c.get(_t)!==rt&&(n.uniformBlockBinding(_t,rt,z.__bindingPointIndex),c.set(_t,rt))}function Xt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},q=null,j={},f={},d=new WeakMap,u=[],g=null,v=!1,m=null,p=null,x=null,_=null,y=null,k=null,b=null,A=new Yt(0,0,0),T=0,w=!1,M=null,P=null,F=null,N=null,B=null,xt.set(0,0,n.canvas.width,n.canvas.height),Y.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:K,disable:ft,bindFramebuffer:It,drawBuffers:Ct,useProgram:vt,setBlending:G,setMaterial:jt,setFlipSided:kt,setCullFace:Ut,setLineWidth:Tt,setPolygonOffset:St,setScissorTest:Pt,activeTexture:I,bindTexture:E,unbindTexture:W,compressedTexImage2D:st,compressedTexImage3D:ct,texImage2D:Mt,texImage3D:O,updateUBOMapping:Nt,uniformBlockBinding:Ot,texStorage2D:Gt,texStorage3D:nt,texSubImage2D:at,texSubImage3D:Ft,compressedTexSubImage2D:Q,compressedTexSubImage3D:pt,scissor:it,viewport:ht,reset:Xt}}function Yh(n,t,e,i){const s=Fy(i);switch(e){case Hd:return n*t;case Vd:return n*t;case Xd:return n*t*2;case Wd:return n*t/s.components*s.byteLength;case $c:return n*t/s.components*s.byteLength;case $d:return n*t*2/s.components*s.byteLength;case Yc:return n*t*2/s.components*s.byteLength;case Gd:return n*t*3/s.components*s.byteLength;case Cn:return n*t*4/s.components*s.byteLength;case Zc:return n*t*4/s.components*s.byteLength;case Va:case Xa:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Wa:case $a:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ko:case Qo:return Math.max(n,16)*Math.max(t,8)/4;case jo:case Jo:return Math.max(n,8)*Math.max(t,8)/2;case tc:case ec:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case nc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case ic:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case sc:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case ac:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case rc:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case oc:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case cc:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case lc:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case hc:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case dc:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case uc:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case fc:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case pc:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case mc:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case gc:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Ya:case xc:case vc:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Yd:case _c:return Math.ceil(n/4)*Math.ceil(t/4)*8;case yc:case Mc:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Fy(n){switch(n){case Kn:case zd:return{byteLength:1,components:1};case $s:case Od:case ta:return{byteLength:2,components:1};case Xc:case Wc:return{byteLength:2,components:4};case Di:case Vc:case Zn:return{byteLength:4,components:1};case Bd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Ny(n,t,e,i,s,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new zt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(I,E){return u?new OffscreenCanvas(I,E):lr("canvas")}function v(I,E,W){let st=1;const ct=Pt(I);if((ct.width>W||ct.height>W)&&(st=W/Math.max(ct.width,ct.height)),st<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const at=Math.floor(st*ct.width),Ft=Math.floor(st*ct.height);f===void 0&&(f=g(at,Ft));const Q=E?g(at,Ft):f;return Q.width=at,Q.height=Ft,Q.getContext("2d").drawImage(I,0,0,at,Ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ct.width+"x"+ct.height+") to ("+at+"x"+Ft+")."),Q}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ct.width+"x"+ct.height+")."),I;return I}function m(I){return I.generateMipmaps}function p(I){n.generateMipmap(I)}function x(I){return I.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?n.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function _(I,E,W,st,ct=!1){if(I!==null){if(n[I]!==void 0)return n[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let at=E;if(E===n.RED&&(W===n.FLOAT&&(at=n.R32F),W===n.HALF_FLOAT&&(at=n.R16F),W===n.UNSIGNED_BYTE&&(at=n.R8)),E===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&(at=n.R8UI),W===n.UNSIGNED_SHORT&&(at=n.R16UI),W===n.UNSIGNED_INT&&(at=n.R32UI),W===n.BYTE&&(at=n.R8I),W===n.SHORT&&(at=n.R16I),W===n.INT&&(at=n.R32I)),E===n.RG&&(W===n.FLOAT&&(at=n.RG32F),W===n.HALF_FLOAT&&(at=n.RG16F),W===n.UNSIGNED_BYTE&&(at=n.RG8)),E===n.RG_INTEGER&&(W===n.UNSIGNED_BYTE&&(at=n.RG8UI),W===n.UNSIGNED_SHORT&&(at=n.RG16UI),W===n.UNSIGNED_INT&&(at=n.RG32UI),W===n.BYTE&&(at=n.RG8I),W===n.SHORT&&(at=n.RG16I),W===n.INT&&(at=n.RG32I)),E===n.RGB_INTEGER&&(W===n.UNSIGNED_BYTE&&(at=n.RGB8UI),W===n.UNSIGNED_SHORT&&(at=n.RGB16UI),W===n.UNSIGNED_INT&&(at=n.RGB32UI),W===n.BYTE&&(at=n.RGB8I),W===n.SHORT&&(at=n.RGB16I),W===n.INT&&(at=n.RGB32I)),E===n.RGBA_INTEGER&&(W===n.UNSIGNED_BYTE&&(at=n.RGBA8UI),W===n.UNSIGNED_SHORT&&(at=n.RGBA16UI),W===n.UNSIGNED_INT&&(at=n.RGBA32UI),W===n.BYTE&&(at=n.RGBA8I),W===n.SHORT&&(at=n.RGBA16I),W===n.INT&&(at=n.RGBA32I)),E===n.RGB&&W===n.UNSIGNED_INT_5_9_9_9_REV&&(at=n.RGB9_E5),E===n.RGBA){const Ft=ct?mr:re.getTransfer(st);W===n.FLOAT&&(at=n.RGBA32F),W===n.HALF_FLOAT&&(at=n.RGBA16F),W===n.UNSIGNED_BYTE&&(at=Ft===ge?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT_4_4_4_4&&(at=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(at=n.RGB5_A1)}return(at===n.R16F||at===n.R32F||at===n.RG16F||at===n.RG32F||at===n.RGBA16F||at===n.RGBA32F)&&t.get("EXT_color_buffer_float"),at}function y(I,E){let W;return I?E===null||E===Di||E===gs?W=n.DEPTH24_STENCIL8:E===Zn?W=n.DEPTH32F_STENCIL8:E===$s&&(W=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Di||E===gs?W=n.DEPTH_COMPONENT24:E===Zn?W=n.DEPTH_COMPONENT32F:E===$s&&(W=n.DEPTH_COMPONENT16),W}function k(I,E){return m(I)===!0||I.isFramebufferTexture&&I.minFilter!==Pn&&I.minFilter!==Un?Math.log2(Math.max(E.width,E.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?E.mipmaps.length:1}function b(I){const E=I.target;E.removeEventListener("dispose",b),T(E),E.isVideoTexture&&h.delete(E)}function A(I){const E=I.target;E.removeEventListener("dispose",A),M(E)}function T(I){const E=i.get(I);if(E.__webglInit===void 0)return;const W=I.source,st=d.get(W);if(st){const ct=st[E.__cacheKey];ct.usedTimes--,ct.usedTimes===0&&w(I),Object.keys(st).length===0&&d.delete(W)}i.remove(I)}function w(I){const E=i.get(I);n.deleteTexture(E.__webglTexture);const W=I.source,st=d.get(W);delete st[E.__cacheKey],r.memory.textures--}function M(I){const E=i.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),i.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let st=0;st<6;st++){if(Array.isArray(E.__webglFramebuffer[st]))for(let ct=0;ct<E.__webglFramebuffer[st].length;ct++)n.deleteFramebuffer(E.__webglFramebuffer[st][ct]);else n.deleteFramebuffer(E.__webglFramebuffer[st]);E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer[st])}else{if(Array.isArray(E.__webglFramebuffer))for(let st=0;st<E.__webglFramebuffer.length;st++)n.deleteFramebuffer(E.__webglFramebuffer[st]);else n.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&n.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let st=0;st<E.__webglColorRenderbuffer.length;st++)E.__webglColorRenderbuffer[st]&&n.deleteRenderbuffer(E.__webglColorRenderbuffer[st]);E.__webglDepthRenderbuffer&&n.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const W=I.textures;for(let st=0,ct=W.length;st<ct;st++){const at=i.get(W[st]);at.__webglTexture&&(n.deleteTexture(at.__webglTexture),r.memory.textures--),i.remove(W[st])}i.remove(I)}let P=0;function F(){P=0}function N(){const I=P;return I>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),P+=1,I}function B(I){const E=[];return E.push(I.wrapS),E.push(I.wrapT),E.push(I.wrapR||0),E.push(I.magFilter),E.push(I.minFilter),E.push(I.anisotropy),E.push(I.internalFormat),E.push(I.format),E.push(I.type),E.push(I.generateMipmaps),E.push(I.premultiplyAlpha),E.push(I.flipY),E.push(I.unpackAlignment),E.push(I.colorSpace),E.join()}function D(I,E){const W=i.get(I);if(I.isVideoTexture&&Tt(I),I.isRenderTargetTexture===!1&&I.version>0&&W.__version!==I.version){const st=I.image;if(st===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(st.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(W,I,E);return}}e.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+E)}function L(I,E){const W=i.get(I);if(I.version>0&&W.__version!==I.version){Y(W,I,E);return}e.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+E)}function X(I,E){const W=i.get(I);if(I.version>0&&W.__version!==I.version){Y(W,I,E);return}e.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+E)}function H(I,E){const W=i.get(I);if(I.version>0&&W.__version!==I.version){tt(W,I,E);return}e.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+E)}const q={[Zo]:n.REPEAT,[Ri]:n.CLAMP_TO_EDGE,[qo]:n.MIRRORED_REPEAT},j={[Pn]:n.NEAREST,[l0]:n.NEAREST_MIPMAP_NEAREST,[la]:n.NEAREST_MIPMAP_LINEAR,[Un]:n.LINEAR,[zr]:n.LINEAR_MIPMAP_NEAREST,[Ci]:n.LINEAR_MIPMAP_LINEAR},ot={[f0]:n.NEVER,[_0]:n.ALWAYS,[p0]:n.LESS,[qd]:n.LEQUAL,[m0]:n.EQUAL,[v0]:n.GEQUAL,[g0]:n.GREATER,[x0]:n.NOTEQUAL};function dt(I,E){if(E.type===Zn&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===Un||E.magFilter===zr||E.magFilter===la||E.magFilter===Ci||E.minFilter===Un||E.minFilter===zr||E.minFilter===la||E.minFilter===Ci)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(I,n.TEXTURE_WRAP_S,q[E.wrapS]),n.texParameteri(I,n.TEXTURE_WRAP_T,q[E.wrapT]),(I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY)&&n.texParameteri(I,n.TEXTURE_WRAP_R,q[E.wrapR]),n.texParameteri(I,n.TEXTURE_MAG_FILTER,j[E.magFilter]),n.texParameteri(I,n.TEXTURE_MIN_FILTER,j[E.minFilter]),E.compareFunction&&(n.texParameteri(I,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(I,n.TEXTURE_COMPARE_FUNC,ot[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Pn||E.minFilter!==la&&E.minFilter!==Ci||E.type===Zn&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");n.texParameterf(I,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function xt(I,E){let W=!1;I.__webglInit===void 0&&(I.__webglInit=!0,E.addEventListener("dispose",b));const st=E.source;let ct=d.get(st);ct===void 0&&(ct={},d.set(st,ct));const at=B(E);if(at!==I.__cacheKey){ct[at]===void 0&&(ct[at]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,W=!0),ct[at].usedTimes++;const Ft=ct[I.__cacheKey];Ft!==void 0&&(ct[I.__cacheKey].usedTimes--,Ft.usedTimes===0&&w(E)),I.__cacheKey=at,I.__webglTexture=ct[at].texture}return W}function Y(I,E,W){let st=n.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(st=n.TEXTURE_2D_ARRAY),E.isData3DTexture&&(st=n.TEXTURE_3D);const ct=xt(I,E),at=E.source;e.bindTexture(st,I.__webglTexture,n.TEXTURE0+W);const Ft=i.get(at);if(at.version!==Ft.__version||ct===!0){e.activeTexture(n.TEXTURE0+W);const Q=re.getPrimaries(re.workingColorSpace),pt=E.colorSpace===ai?null:re.getPrimaries(E.colorSpace),Gt=E.colorSpace===ai||Q===pt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Gt);let nt=v(E.image,!1,s.maxTextureSize);nt=St(E,nt);const Mt=a.convert(E.format,E.colorSpace),O=a.convert(E.type);let it=_(E.internalFormat,Mt,O,E.colorSpace,E.isVideoTexture);dt(st,E);let ht;const Nt=E.mipmaps,Ot=E.isVideoTexture!==!0,Xt=Ft.__version===void 0||ct===!0,z=at.dataReady,_t=k(E,nt);if(E.isDepthTexture)it=y(E.format===xs,E.type),Xt&&(Ot?e.texStorage2D(n.TEXTURE_2D,1,it,nt.width,nt.height):e.texImage2D(n.TEXTURE_2D,0,it,nt.width,nt.height,0,Mt,O,null));else if(E.isDataTexture)if(Nt.length>0){Ot&&Xt&&e.texStorage2D(n.TEXTURE_2D,_t,it,Nt[0].width,Nt[0].height);for(let J=0,rt=Nt.length;J<rt;J++)ht=Nt[J],Ot?z&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,ht.width,ht.height,Mt,O,ht.data):e.texImage2D(n.TEXTURE_2D,J,it,ht.width,ht.height,0,Mt,O,ht.data);E.generateMipmaps=!1}else Ot?(Xt&&e.texStorage2D(n.TEXTURE_2D,_t,it,nt.width,nt.height),z&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,nt.width,nt.height,Mt,O,nt.data)):e.texImage2D(n.TEXTURE_2D,0,it,nt.width,nt.height,0,Mt,O,nt.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Ot&&Xt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,_t,it,Nt[0].width,Nt[0].height,nt.depth);for(let J=0,rt=Nt.length;J<rt;J++)if(ht=Nt[J],E.format!==Cn)if(Mt!==null)if(Ot){if(z)if(E.layerUpdates.size>0){const gt=Yh(ht.width,ht.height,E.format,E.type);for(const yt of E.layerUpdates){const Ht=ht.data.subarray(yt*gt/ht.data.BYTES_PER_ELEMENT,(yt+1)*gt/ht.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,yt,ht.width,ht.height,1,Mt,Ht)}E.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,ht.width,ht.height,nt.depth,Mt,ht.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,J,it,ht.width,ht.height,nt.depth,0,ht.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ot?z&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,ht.width,ht.height,nt.depth,Mt,O,ht.data):e.texImage3D(n.TEXTURE_2D_ARRAY,J,it,ht.width,ht.height,nt.depth,0,Mt,O,ht.data)}else{Ot&&Xt&&e.texStorage2D(n.TEXTURE_2D,_t,it,Nt[0].width,Nt[0].height);for(let J=0,rt=Nt.length;J<rt;J++)ht=Nt[J],E.format!==Cn?Mt!==null?Ot?z&&e.compressedTexSubImage2D(n.TEXTURE_2D,J,0,0,ht.width,ht.height,Mt,ht.data):e.compressedTexImage2D(n.TEXTURE_2D,J,it,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ot?z&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,ht.width,ht.height,Mt,O,ht.data):e.texImage2D(n.TEXTURE_2D,J,it,ht.width,ht.height,0,Mt,O,ht.data)}else if(E.isDataArrayTexture)if(Ot){if(Xt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,_t,it,nt.width,nt.height,nt.depth),z)if(E.layerUpdates.size>0){const J=Yh(nt.width,nt.height,E.format,E.type);for(const rt of E.layerUpdates){const gt=nt.data.subarray(rt*J/nt.data.BYTES_PER_ELEMENT,(rt+1)*J/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,rt,nt.width,nt.height,1,Mt,O,gt)}E.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,Mt,O,nt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,it,nt.width,nt.height,nt.depth,0,Mt,O,nt.data);else if(E.isData3DTexture)Ot?(Xt&&e.texStorage3D(n.TEXTURE_3D,_t,it,nt.width,nt.height,nt.depth),z&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,Mt,O,nt.data)):e.texImage3D(n.TEXTURE_3D,0,it,nt.width,nt.height,nt.depth,0,Mt,O,nt.data);else if(E.isFramebufferTexture){if(Xt)if(Ot)e.texStorage2D(n.TEXTURE_2D,_t,it,nt.width,nt.height);else{let J=nt.width,rt=nt.height;for(let gt=0;gt<_t;gt++)e.texImage2D(n.TEXTURE_2D,gt,it,J,rt,0,Mt,O,null),J>>=1,rt>>=1}}else if(Nt.length>0){if(Ot&&Xt){const J=Pt(Nt[0]);e.texStorage2D(n.TEXTURE_2D,_t,it,J.width,J.height)}for(let J=0,rt=Nt.length;J<rt;J++)ht=Nt[J],Ot?z&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,Mt,O,ht):e.texImage2D(n.TEXTURE_2D,J,it,Mt,O,ht);E.generateMipmaps=!1}else if(Ot){if(Xt){const J=Pt(nt);e.texStorage2D(n.TEXTURE_2D,_t,it,J.width,J.height)}z&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Mt,O,nt)}else e.texImage2D(n.TEXTURE_2D,0,it,Mt,O,nt);m(E)&&p(st),Ft.__version=at.version,E.onUpdate&&E.onUpdate(E)}I.__version=E.version}function tt(I,E,W){if(E.image.length!==6)return;const st=xt(I,E),ct=E.source;e.bindTexture(n.TEXTURE_CUBE_MAP,I.__webglTexture,n.TEXTURE0+W);const at=i.get(ct);if(ct.version!==at.__version||st===!0){e.activeTexture(n.TEXTURE0+W);const Ft=re.getPrimaries(re.workingColorSpace),Q=E.colorSpace===ai?null:re.getPrimaries(E.colorSpace),pt=E.colorSpace===ai||Ft===Q?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt);const Gt=E.isCompressedTexture||E.image[0].isCompressedTexture,nt=E.image[0]&&E.image[0].isDataTexture,Mt=[];for(let rt=0;rt<6;rt++)!Gt&&!nt?Mt[rt]=v(E.image[rt],!0,s.maxCubemapSize):Mt[rt]=nt?E.image[rt].image:E.image[rt],Mt[rt]=St(E,Mt[rt]);const O=Mt[0],it=a.convert(E.format,E.colorSpace),ht=a.convert(E.type),Nt=_(E.internalFormat,it,ht,E.colorSpace),Ot=E.isVideoTexture!==!0,Xt=at.__version===void 0||st===!0,z=ct.dataReady;let _t=k(E,O);dt(n.TEXTURE_CUBE_MAP,E);let J;if(Gt){Ot&&Xt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,_t,Nt,O.width,O.height);for(let rt=0;rt<6;rt++){J=Mt[rt].mipmaps;for(let gt=0;gt<J.length;gt++){const yt=J[gt];E.format!==Cn?it!==null?Ot?z&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,gt,0,0,yt.width,yt.height,it,yt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,gt,Nt,yt.width,yt.height,0,yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ot?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,gt,0,0,yt.width,yt.height,it,ht,yt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,gt,Nt,yt.width,yt.height,0,it,ht,yt.data)}}}else{if(J=E.mipmaps,Ot&&Xt){J.length>0&&_t++;const rt=Pt(Mt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,_t,Nt,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(nt){Ot?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,Mt[rt].width,Mt[rt].height,it,ht,Mt[rt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Nt,Mt[rt].width,Mt[rt].height,0,it,ht,Mt[rt].data);for(let gt=0;gt<J.length;gt++){const Ht=J[gt].image[rt].image;Ot?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,gt+1,0,0,Ht.width,Ht.height,it,ht,Ht.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,gt+1,Nt,Ht.width,Ht.height,0,it,ht,Ht.data)}}else{Ot?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,it,ht,Mt[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Nt,it,ht,Mt[rt]);for(let gt=0;gt<J.length;gt++){const yt=J[gt];Ot?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,gt+1,0,0,it,ht,yt.image[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,gt+1,Nt,it,ht,yt.image[rt])}}}m(E)&&p(n.TEXTURE_CUBE_MAP),at.__version=ct.version,E.onUpdate&&E.onUpdate(E)}I.__version=E.version}function ut(I,E,W,st,ct,at){const Ft=a.convert(W.format,W.colorSpace),Q=a.convert(W.type),pt=_(W.internalFormat,Ft,Q,W.colorSpace),Gt=i.get(E),nt=i.get(W);if(nt.__renderTarget=E,!Gt.__hasExternalTextures){const Mt=Math.max(1,E.width>>at),O=Math.max(1,E.height>>at);ct===n.TEXTURE_3D||ct===n.TEXTURE_2D_ARRAY?e.texImage3D(ct,at,pt,Mt,O,E.depth,0,Ft,Q,null):e.texImage2D(ct,at,pt,Mt,O,0,Ft,Q,null)}e.bindFramebuffer(n.FRAMEBUFFER,I),Ut(E)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,st,ct,nt.__webglTexture,0,kt(E)):(ct===n.TEXTURE_2D||ct>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ct<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,st,ct,nt.__webglTexture,at),e.bindFramebuffer(n.FRAMEBUFFER,null)}function K(I,E,W){if(n.bindRenderbuffer(n.RENDERBUFFER,I),E.depthBuffer){const st=E.depthTexture,ct=st&&st.isDepthTexture?st.type:null,at=y(E.stencilBuffer,ct),Ft=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Q=kt(E);Ut(E)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Q,at,E.width,E.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,Q,at,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,at,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ft,n.RENDERBUFFER,I)}else{const st=E.textures;for(let ct=0;ct<st.length;ct++){const at=st[ct],Ft=a.convert(at.format,at.colorSpace),Q=a.convert(at.type),pt=_(at.internalFormat,Ft,Q,at.colorSpace),Gt=kt(E);W&&Ut(E)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Gt,pt,E.width,E.height):Ut(E)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Gt,pt,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,pt,E.width,E.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ft(I,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,I),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const st=i.get(E.depthTexture);st.__renderTarget=E,(!st.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),D(E.depthTexture,0);const ct=st.__webglTexture,at=kt(E);if(E.depthTexture.format===hs)Ut(E)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ct,0,at):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ct,0);else if(E.depthTexture.format===xs)Ut(E)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ct,0,at):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ct,0);else throw new Error("Unknown depthTexture format")}function It(I){const E=i.get(I),W=I.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==I.depthTexture){const st=I.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),st){const ct=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,st.removeEventListener("dispose",ct)};st.addEventListener("dispose",ct),E.__depthDisposeCallback=ct}E.__boundDepthTexture=st}if(I.depthTexture&&!E.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");ft(E.__webglFramebuffer,I)}else if(W){E.__webglDepthbuffer=[];for(let st=0;st<6;st++)if(e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[st]),E.__webglDepthbuffer[st]===void 0)E.__webglDepthbuffer[st]=n.createRenderbuffer(),K(E.__webglDepthbuffer[st],I,!1);else{const ct=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,at=E.__webglDepthbuffer[st];n.bindRenderbuffer(n.RENDERBUFFER,at),n.framebufferRenderbuffer(n.FRAMEBUFFER,ct,n.RENDERBUFFER,at)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=n.createRenderbuffer(),K(E.__webglDepthbuffer,I,!1);else{const st=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ct=E.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ct),n.framebufferRenderbuffer(n.FRAMEBUFFER,st,n.RENDERBUFFER,ct)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ct(I,E,W){const st=i.get(I);E!==void 0&&ut(st.__webglFramebuffer,I,I.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&It(I)}function vt(I){const E=I.texture,W=i.get(I),st=i.get(E);I.addEventListener("dispose",A);const ct=I.textures,at=I.isWebGLCubeRenderTarget===!0,Ft=ct.length>1;if(Ft||(st.__webglTexture===void 0&&(st.__webglTexture=n.createTexture()),st.__version=E.version,r.memory.textures++),at){W.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(E.mipmaps&&E.mipmaps.length>0){W.__webglFramebuffer[Q]=[];for(let pt=0;pt<E.mipmaps.length;pt++)W.__webglFramebuffer[Q][pt]=n.createFramebuffer()}else W.__webglFramebuffer[Q]=n.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){W.__webglFramebuffer=[];for(let Q=0;Q<E.mipmaps.length;Q++)W.__webglFramebuffer[Q]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(Ft)for(let Q=0,pt=ct.length;Q<pt;Q++){const Gt=i.get(ct[Q]);Gt.__webglTexture===void 0&&(Gt.__webglTexture=n.createTexture(),r.memory.textures++)}if(I.samples>0&&Ut(I)===!1){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let Q=0;Q<ct.length;Q++){const pt=ct[Q];W.__webglColorRenderbuffer[Q]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[Q]);const Gt=a.convert(pt.format,pt.colorSpace),nt=a.convert(pt.type),Mt=_(pt.internalFormat,Gt,nt,pt.colorSpace,I.isXRRenderTarget===!0),O=kt(I);n.renderbufferStorageMultisample(n.RENDERBUFFER,O,Mt,I.width,I.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Q,n.RENDERBUFFER,W.__webglColorRenderbuffer[Q])}n.bindRenderbuffer(n.RENDERBUFFER,null),I.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),K(W.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(at){e.bindTexture(n.TEXTURE_CUBE_MAP,st.__webglTexture),dt(n.TEXTURE_CUBE_MAP,E);for(let Q=0;Q<6;Q++)if(E.mipmaps&&E.mipmaps.length>0)for(let pt=0;pt<E.mipmaps.length;pt++)ut(W.__webglFramebuffer[Q][pt],I,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pt);else ut(W.__webglFramebuffer[Q],I,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);m(E)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ft){for(let Q=0,pt=ct.length;Q<pt;Q++){const Gt=ct[Q],nt=i.get(Gt);e.bindTexture(n.TEXTURE_2D,nt.__webglTexture),dt(n.TEXTURE_2D,Gt),ut(W.__webglFramebuffer,I,Gt,n.COLOR_ATTACHMENT0+Q,n.TEXTURE_2D,0),m(Gt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let Q=n.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Q=I.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Q,st.__webglTexture),dt(Q,E),E.mipmaps&&E.mipmaps.length>0)for(let pt=0;pt<E.mipmaps.length;pt++)ut(W.__webglFramebuffer[pt],I,E,n.COLOR_ATTACHMENT0,Q,pt);else ut(W.__webglFramebuffer,I,E,n.COLOR_ATTACHMENT0,Q,0);m(E)&&p(Q),e.unbindTexture()}I.depthBuffer&&It(I)}function At(I){const E=I.textures;for(let W=0,st=E.length;W<st;W++){const ct=E[W];if(m(ct)){const at=x(I),Ft=i.get(ct).__webglTexture;e.bindTexture(at,Ft),p(at),e.unbindTexture()}}}const wt=[],G=[];function jt(I){if(I.samples>0){if(Ut(I)===!1){const E=I.textures,W=I.width,st=I.height;let ct=n.COLOR_BUFFER_BIT;const at=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ft=i.get(I),Q=E.length>1;if(Q)for(let pt=0;pt<E.length;pt++)e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer);for(let pt=0;pt<E.length;pt++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(ct|=n.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(ct|=n.STENCIL_BUFFER_BIT)),Q){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ft.__webglColorRenderbuffer[pt]);const Gt=i.get(E[pt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Gt,0)}n.blitFramebuffer(0,0,W,st,0,0,W,st,ct,n.NEAREST),c===!0&&(wt.length=0,G.length=0,wt.push(n.COLOR_ATTACHMENT0+pt),I.depthBuffer&&I.resolveDepthBuffer===!1&&(wt.push(at),G.push(at),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,G)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,wt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Q)for(let pt=0;pt<E.length;pt++){e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.RENDERBUFFER,Ft.__webglColorRenderbuffer[pt]);const Gt=i.get(E[pt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.TEXTURE_2D,Gt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&c){const E=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[E])}}}function kt(I){return Math.min(s.maxSamples,I.samples)}function Ut(I){const E=i.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Tt(I){const E=r.render.frame;h.get(I)!==E&&(h.set(I,E),I.update())}function St(I,E){const W=I.colorSpace,st=I.format,ct=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||W!==_s&&W!==ai&&(re.getTransfer(W)===ge?(st!==Cn||ct!==Kn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),E}function Pt(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(l.width=I.naturalWidth||I.width,l.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(l.width=I.displayWidth,l.height=I.displayHeight):(l.width=I.width,l.height=I.height),l}this.allocateTextureUnit=N,this.resetTextureUnits=F,this.setTexture2D=D,this.setTexture2DArray=L,this.setTexture3D=X,this.setTextureCube=H,this.rebindTextures=Ct,this.setupRenderTarget=vt,this.updateRenderTargetMipmap=At,this.updateMultisampleRenderTarget=jt,this.setupDepthRenderbuffer=It,this.setupFrameBufferTexture=ut,this.useMultisampledRTT=Ut}function zy(n,t){function e(i,s=ai){let a;const r=re.getTransfer(s);if(i===Kn)return n.UNSIGNED_BYTE;if(i===Xc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Wc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Bd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===zd)return n.BYTE;if(i===Od)return n.SHORT;if(i===$s)return n.UNSIGNED_SHORT;if(i===Vc)return n.INT;if(i===Di)return n.UNSIGNED_INT;if(i===Zn)return n.FLOAT;if(i===ta)return n.HALF_FLOAT;if(i===Hd)return n.ALPHA;if(i===Gd)return n.RGB;if(i===Cn)return n.RGBA;if(i===Vd)return n.LUMINANCE;if(i===Xd)return n.LUMINANCE_ALPHA;if(i===hs)return n.DEPTH_COMPONENT;if(i===xs)return n.DEPTH_STENCIL;if(i===Wd)return n.RED;if(i===$c)return n.RED_INTEGER;if(i===$d)return n.RG;if(i===Yc)return n.RG_INTEGER;if(i===Zc)return n.RGBA_INTEGER;if(i===Va||i===Xa||i===Wa||i===$a)if(r===ge)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Va)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Xa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Wa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===$a)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Va)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Xa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Wa)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===$a)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===jo||i===Ko||i===Jo||i===Qo)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===jo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ko)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Jo)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Qo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===tc||i===ec||i===nc)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===tc||i===ec)return r===ge?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===nc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===ic||i===sc||i===ac||i===rc||i===oc||i===cc||i===lc||i===hc||i===dc||i===uc||i===fc||i===pc||i===mc||i===gc)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===ic)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===sc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ac)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===rc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===oc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===cc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===lc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===hc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===dc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===uc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===fc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===pc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===mc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===gc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ya||i===xc||i===vc)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===Ya)return r===ge?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===xc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===vc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Yd||i===_c||i===yc||i===Mc)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===Ya)return a.COMPRESSED_RED_RGTC1_EXT;if(i===_c)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===yc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Mc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===gs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class Oy extends yn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class xe extends Re{constructor(){super(),this.isGroup=!0,this.type="Group"}}const By={type:"move"};class uo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,i),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,g=.005;l.inputState.pinching&&d>u+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=u-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(By)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new xe;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Hy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Gy=`
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

}`;class Vy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const s=new Qe,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new hi({vertexShader:Hy,fragmentShader:Gy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ne(new _n(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Xy extends ys{constructor(t,e){super();const i=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,h=null,f=null,d=null,u=null,g=null;const v=new Vy,m=e.getContextAttributes();let p=null,x=null;const _=[],y=[],k=new zt;let b=null;const A=new yn;A.viewport=new Ae;const T=new yn;T.viewport=new Ae;const w=[A,T],M=new Oy;let P=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let tt=_[Y];return tt===void 0&&(tt=new uo,_[Y]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Y){let tt=_[Y];return tt===void 0&&(tt=new uo,_[Y]=tt),tt.getGripSpace()},this.getHand=function(Y){let tt=_[Y];return tt===void 0&&(tt=new uo,_[Y]=tt),tt.getHandSpace()};function N(Y){const tt=y.indexOf(Y.inputSource);if(tt===-1)return;const ut=_[tt];ut!==void 0&&(ut.update(Y.inputSource,Y.frame,l||r),ut.dispatchEvent({type:Y.type,data:Y.inputSource}))}function B(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",D);for(let Y=0;Y<_.length;Y++){const tt=y[Y];tt!==null&&(y[Y]=null,_[Y].disconnect(tt))}P=null,F=null,v.reset(),t.setRenderTarget(p),u=null,d=null,f=null,s=null,x=null,xt.stop(),i.isPresenting=!1,t.setPixelRatio(b),t.setSize(k.width,k.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){a=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",B),s.addEventListener("inputsourceschange",D),m.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(k),s.renderState.layers===void 0){const tt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,e,tt),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new Ii(u.framebufferWidth,u.framebufferHeight,{format:Cn,type:Kn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let tt=null,ut=null,K=null;m.depth&&(K=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=m.stencil?xs:hs,ut=m.stencil?gs:Di);const ft={colorFormat:e.RGBA8,depthFormat:K,scaleFactor:a};f=new XRWebGLBinding(s,e),d=f.createProjectionLayer(ft),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new Ii(d.textureWidth,d.textureHeight,{format:Cn,type:Kn,depthTexture:new ou(d.textureWidth,d.textureHeight,ut,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),xt.setContext(s),xt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function D(Y){for(let tt=0;tt<Y.removed.length;tt++){const ut=Y.removed[tt],K=y.indexOf(ut);K>=0&&(y[K]=null,_[K].disconnect(ut))}for(let tt=0;tt<Y.added.length;tt++){const ut=Y.added[tt];let K=y.indexOf(ut);if(K===-1){for(let It=0;It<_.length;It++)if(It>=y.length){y.push(ut),K=It;break}else if(y[It]===null){y[It]=ut,K=It;break}if(K===-1)break}const ft=_[K];ft&&ft.connect(ut)}}const L=new V,X=new V;function H(Y,tt,ut){L.setFromMatrixPosition(tt.matrixWorld),X.setFromMatrixPosition(ut.matrixWorld);const K=L.distanceTo(X),ft=tt.projectionMatrix.elements,It=ut.projectionMatrix.elements,Ct=ft[14]/(ft[10]-1),vt=ft[14]/(ft[10]+1),At=(ft[9]+1)/ft[5],wt=(ft[9]-1)/ft[5],G=(ft[8]-1)/ft[0],jt=(It[8]+1)/It[0],kt=Ct*G,Ut=Ct*jt,Tt=K/(-G+jt),St=Tt*-G;if(tt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(St),Y.translateZ(Tt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),ft[10]===-1)Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const Pt=Ct+Tt,I=vt+Tt,E=kt-St,W=Ut+(K-St),st=At*vt/I*Pt,ct=wt*vt/I*Pt;Y.projectionMatrix.makePerspective(E,W,st,ct,Pt,I),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function q(Y,tt){tt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(tt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let tt=Y.near,ut=Y.far;v.texture!==null&&(v.depthNear>0&&(tt=v.depthNear),v.depthFar>0&&(ut=v.depthFar)),M.near=T.near=A.near=tt,M.far=T.far=A.far=ut,(P!==M.near||F!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,F=M.far),A.layers.mask=Y.layers.mask|2,T.layers.mask=Y.layers.mask|4,M.layers.mask=A.layers.mask|T.layers.mask;const K=Y.parent,ft=M.cameras;q(M,K);for(let It=0;It<ft.length;It++)q(ft[It],K);ft.length===2?H(M,A,T):M.projectionMatrix.copy(A.projectionMatrix),j(Y,M,K)};function j(Y,tt,ut){ut===null?Y.matrix.copy(tt.matrixWorld):(Y.matrix.copy(ut.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(tt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Ys*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&u===null))return c},this.setFoveation=function(Y){c=Y,d!==null&&(d.fixedFoveation=Y),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Y)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let ot=null;function dt(Y,tt){if(h=tt.getViewerPose(l||r),g=tt,h!==null){const ut=h.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let K=!1;ut.length!==M.cameras.length&&(M.cameras.length=0,K=!0);for(let It=0;It<ut.length;It++){const Ct=ut[It];let vt=null;if(u!==null)vt=u.getViewport(Ct);else{const wt=f.getViewSubImage(d,Ct);vt=wt.viewport,It===0&&(t.setRenderTargetTextures(x,wt.colorTexture,d.ignoreDepthValues?void 0:wt.depthStencilTexture),t.setRenderTarget(x))}let At=w[It];At===void 0&&(At=new yn,At.layers.enable(It),At.viewport=new Ae,w[It]=At),At.matrix.fromArray(Ct.transform.matrix),At.matrix.decompose(At.position,At.quaternion,At.scale),At.projectionMatrix.fromArray(Ct.projectionMatrix),At.projectionMatrixInverse.copy(At.projectionMatrix).invert(),At.viewport.set(vt.x,vt.y,vt.width,vt.height),It===0&&(M.matrix.copy(At.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),K===!0&&M.cameras.push(At)}const ft=s.enabledFeatures;if(ft&&ft.includes("depth-sensing")){const It=f.getDepthInformation(ut[0]);It&&It.isValid&&It.texture&&v.init(t,It,s.renderState)}}for(let ut=0;ut<_.length;ut++){const K=y[ut],ft=_[ut];K!==null&&ft!==void 0&&ft.update(K,tt,l||r)}ot&&ot(Y,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),g=null}const xt=new au;xt.setAnimationLoop(dt),this.setAnimationLoop=function(Y){ot=Y},this.dispose=function(){}}}const vi=new zn,Wy=new ve;function $y(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,nu(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,_,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),f(m,p)):p.isMeshPhongMaterial?(a(m,p),h(m,p)):p.isMeshStandardMaterial?(a(m,p),d(m,p),p.isMeshPhysicalMaterial&&u(m,p,y)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),v(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,x,_):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===on&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===on&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),_=x.envMap,y=x.envMapRotation;_&&(m.envMap.value=_,vi.copy(y),vi.x*=-1,vi.y*=-1,vi.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),m.envMapRotation.value.setFromMatrix4(Wy.makeRotationFromEuler(vi)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,_){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=_*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===on&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Yy(n,t,e,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,_){const y=_.program;i.uniformBlockBinding(x,y)}function l(x,_){let y=s[x.id];y===void 0&&(g(x),y=h(x),s[x.id]=y,x.addEventListener("dispose",m));const k=_.program;i.updateUBOMapping(x,k);const b=t.render.frame;a[x.id]!==b&&(d(x),a[x.id]=b)}function h(x){const _=f();x.__bindingPointIndex=_;const y=n.createBuffer(),k=x.__size,b=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,k,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,y),y}function f(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const _=s[x.id],y=x.uniforms,k=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let b=0,A=y.length;b<A;b++){const T=Array.isArray(y[b])?y[b]:[y[b]];for(let w=0,M=T.length;w<M;w++){const P=T[w];if(u(P,b,w,k)===!0){const F=P.__offset,N=Array.isArray(P.value)?P.value:[P.value];let B=0;for(let D=0;D<N.length;D++){const L=N[D],X=v(L);typeof L=="number"||typeof L=="boolean"?(P.__data[0]=L,n.bufferSubData(n.UNIFORM_BUFFER,F+B,P.__data)):L.isMatrix3?(P.__data[0]=L.elements[0],P.__data[1]=L.elements[1],P.__data[2]=L.elements[2],P.__data[3]=0,P.__data[4]=L.elements[3],P.__data[5]=L.elements[4],P.__data[6]=L.elements[5],P.__data[7]=0,P.__data[8]=L.elements[6],P.__data[9]=L.elements[7],P.__data[10]=L.elements[8],P.__data[11]=0):(L.toArray(P.__data,B),B+=X.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,_,y,k){const b=x.value,A=_+"_"+y;if(k[A]===void 0)return typeof b=="number"||typeof b=="boolean"?k[A]=b:k[A]=b.clone(),!0;{const T=k[A];if(typeof b=="number"||typeof b=="boolean"){if(T!==b)return k[A]=b,!0}else if(T.equals(b)===!1)return T.copy(b),!0}return!1}function g(x){const _=x.uniforms;let y=0;const k=16;for(let A=0,T=_.length;A<T;A++){const w=Array.isArray(_[A])?_[A]:[_[A]];for(let M=0,P=w.length;M<P;M++){const F=w[M],N=Array.isArray(F.value)?F.value:[F.value];for(let B=0,D=N.length;B<D;B++){const L=N[B],X=v(L),H=y%k,q=H%X.boundary,j=H+q;y+=q,j!==0&&k-j<X.storage&&(y+=k-j),F.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=X.storage}}}const b=y%k;return b>0&&(y+=k-b),x.__size=y,x.__cache={},this}function v(x){const _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function m(x){const _=x.target;_.removeEventListener("dispose",m);const y=r.indexOf(_.__bindingPointIndex);r.splice(y,1),n.deleteBuffer(s[_.id]),delete s[_.id],delete a[_.id]}function p(){for(const x in s)n.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:c,update:l,dispose:p}}class Zy{constructor(t={}){const{canvas:e=F0(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=r;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const x=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ke,this.toneMapping=ci,this.toneMappingExposure=1;const y=this;let k=!1,b=0,A=0,T=null,w=-1,M=null;const P=new Ae,F=new Ae;let N=null;const B=new Yt(0);let D=0,L=e.width,X=e.height,H=1,q=null,j=null;const ot=new Ae(0,0,L,X),dt=new Ae(0,0,L,X);let xt=!1;const Y=new Jc;let tt=!1,ut=!1;const K=new ve,ft=new ve,It=new V,Ct=new Ae,vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let At=!1;function wt(){return T===null?H:1}let G=i;function jt(R,$){return e.getContext(R,$)}try{const R={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Hc}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",gt,!1),e.addEventListener("webglcontextcreationerror",yt,!1),G===null){const $="webgl2";if(G=jt($,R),G===null)throw jt($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let kt,Ut,Tt,St,Pt,I,E,W,st,ct,at,Ft,Q,pt,Gt,nt,Mt,O,it,ht,Nt,Ot,Xt,z;function _t(){kt=new Qv(G),kt.init(),Ot=new zy(G,kt),Ut=new Yv(G,kt,t,Ot),Tt=new Uy(G,kt),Ut.reverseDepthBuffer&&d&&Tt.buffers.depth.setReversed(!0),St=new n_(G),Pt=new yy,I=new Ny(G,kt,Tt,Pt,Ut,Ot,St),E=new qv(y),W=new Jv(y),st=new lg(G),Xt=new Wv(G,st),ct=new t_(G,st,St,Xt),at=new s_(G,ct,st,St),it=new i_(G,Ut,I),nt=new Zv(Pt),Ft=new _y(y,E,W,kt,Ut,Xt,nt),Q=new $y(y,Pt),pt=new Sy,Gt=new Ry(kt),O=new Xv(y,E,W,Tt,at,u,c),Mt=new Iy(y,at,Ut),z=new Yy(G,St,Ut,Tt),ht=new $v(G,kt,St),Nt=new e_(G,kt,St),St.programs=Ft.programs,y.capabilities=Ut,y.extensions=kt,y.properties=Pt,y.renderLists=pt,y.shadowMap=Mt,y.state=Tt,y.info=St}_t();const J=new Xy(y,G);this.xr=J,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const R=kt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=kt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(R){R!==void 0&&(H=R,this.setSize(L,X,!1))},this.getSize=function(R){return R.set(L,X)},this.setSize=function(R,$,S=!0){if(J.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}L=R,X=$,e.width=Math.floor(R*H),e.height=Math.floor($*H),S===!0&&(e.style.width=R+"px",e.style.height=$+"px"),this.setViewport(0,0,R,$)},this.getDrawingBufferSize=function(R){return R.set(L*H,X*H).floor()},this.setDrawingBufferSize=function(R,$,S){L=R,X=$,H=S,e.width=Math.floor(R*S),e.height=Math.floor($*S),this.setViewport(0,0,R,$)},this.getCurrentViewport=function(R){return R.copy(P)},this.getViewport=function(R){return R.copy(ot)},this.setViewport=function(R,$,S,U){R.isVector4?ot.set(R.x,R.y,R.z,R.w):ot.set(R,$,S,U),Tt.viewport(P.copy(ot).multiplyScalar(H).round())},this.getScissor=function(R){return R.copy(dt)},this.setScissor=function(R,$,S,U){R.isVector4?dt.set(R.x,R.y,R.z,R.w):dt.set(R,$,S,U),Tt.scissor(F.copy(dt).multiplyScalar(H).round())},this.getScissorTest=function(){return xt},this.setScissorTest=function(R){Tt.setScissorTest(xt=R)},this.setOpaqueSort=function(R){q=R},this.setTransparentSort=function(R){j=R},this.getClearColor=function(R){return R.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor.apply(O,arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha.apply(O,arguments)},this.clear=function(R=!0,$=!0,S=!0){let U=0;if(R){let C=!1;if(T!==null){const Z=T.texture.format;C=Z===Zc||Z===Yc||Z===$c}if(C){const Z=T.texture.type,et=Z===Kn||Z===Di||Z===$s||Z===gs||Z===Xc||Z===Wc,lt=O.getClearColor(),mt=O.getClearAlpha(),bt=lt.r,Rt=lt.g,Lt=lt.b;et?(g[0]=bt,g[1]=Rt,g[2]=Lt,g[3]=mt,G.clearBufferuiv(G.COLOR,0,g)):(v[0]=bt,v[1]=Rt,v[2]=Lt,v[3]=mt,G.clearBufferiv(G.COLOR,0,v))}else U|=G.COLOR_BUFFER_BIT}$&&(U|=G.DEPTH_BUFFER_BIT),S&&(U|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(U)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",gt,!1),e.removeEventListener("webglcontextcreationerror",yt,!1),pt.dispose(),Gt.dispose(),Pt.dispose(),E.dispose(),W.dispose(),at.dispose(),Xt.dispose(),z.dispose(),Ft.dispose(),J.dispose(),J.removeEventListener("sessionstart",Fe),J.removeEventListener("sessionend",Te),le.stop()};function rt(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),k=!0}function gt(){console.log("THREE.WebGLRenderer: Context Restored."),k=!1;const R=St.autoReset,$=Mt.enabled,S=Mt.autoUpdate,U=Mt.needsUpdate,C=Mt.type;_t(),St.autoReset=R,Mt.enabled=$,Mt.autoUpdate=S,Mt.needsUpdate=U,Mt.type=C}function yt(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Ht(R){const $=R.target;$.removeEventListener("dispose",Ht),Zt($)}function Zt(R){ie(R),Pt.remove(R)}function ie(R){const $=Pt.get(R).programs;$!==void 0&&($.forEach(function(S){Ft.releaseProgram(S)}),R.isShaderMaterial&&Ft.releaseShaderCache(R))}this.renderBufferDirect=function(R,$,S,U,C,Z){$===null&&($=vt);const et=C.isMesh&&C.matrixWorld.determinant()<0,lt=me(R,$,S,U,C);Tt.setMaterial(U,et);let mt=S.index,bt=1;if(U.wireframe===!0){if(mt=ct.getWireframeAttribute(S),mt===void 0)return;bt=2}const Rt=S.drawRange,Lt=S.attributes.position;let Wt=Rt.start*bt,qt=(Rt.start+Rt.count)*bt;Z!==null&&(Wt=Math.max(Wt,Z.start*bt),qt=Math.min(qt,(Z.start+Z.count)*bt)),mt!==null?(Wt=Math.max(Wt,0),qt=Math.min(qt,mt.count)):Lt!=null&&(Wt=Math.max(Wt,0),qt=Math.min(qt,Lt.count));const te=qt-Wt;if(te<0||te===1/0)return;Xt.setup(C,U,lt,S,mt);let _e,Kt=ht;if(mt!==null&&(_e=st.get(mt),Kt=Nt,Kt.setIndex(_e)),C.isMesh)U.wireframe===!0?(Tt.setLineWidth(U.wireframeLinewidth*wt()),Kt.setMode(G.LINES)):Kt.setMode(G.TRIANGLES);else if(C.isLine){let Bt=U.linewidth;Bt===void 0&&(Bt=1),Tt.setLineWidth(Bt*wt()),C.isLineSegments?Kt.setMode(G.LINES):C.isLineLoop?Kt.setMode(G.LINE_LOOP):Kt.setMode(G.LINE_STRIP)}else C.isPoints?Kt.setMode(G.POINTS):C.isSprite&&Kt.setMode(G.TRIANGLES);if(C.isBatchedMesh)if(C._multiDrawInstances!==null)Kt.renderMultiDrawInstances(C._multiDrawStarts,C._multiDrawCounts,C._multiDrawCount,C._multiDrawInstances);else if(kt.get("WEBGL_multi_draw"))Kt.renderMultiDraw(C._multiDrawStarts,C._multiDrawCounts,C._multiDrawCount);else{const Bt=C._multiDrawStarts,Se=C._multiDrawCounts,ee=C._multiDrawCount,Et=mt?st.get(mt).bytesPerElement:1,Vt=Pt.get(U).currentProgram.getUniforms();for(let oe=0;oe<ee;oe++)Vt.setValue(G,"_gl_DrawID",oe),Kt.render(Bt[oe]/Et,Se[oe])}else if(C.isInstancedMesh)Kt.renderInstances(Wt,te,C.count);else if(S.isInstancedBufferGeometry){const Bt=S._maxInstanceCount!==void 0?S._maxInstanceCount:1/0,Se=Math.min(S.instanceCount,Bt);Kt.renderInstances(Wt,te,Se)}else Kt.render(Wt,te)};function $t(R,$,S){R.transparent===!0&&R.side===we&&R.forceSinglePass===!1?(R.side=on,R.needsUpdate=!0,Ne(R,$,S),R.side=li,R.needsUpdate=!0,Ne(R,$,S),R.side=we):Ne(R,$,S)}this.compile=function(R,$,S=null){S===null&&(S=R),p=Gt.get(S),p.init($),_.push(p),S.traverseVisible(function(C){C.isLight&&C.layers.test($.layers)&&(p.pushLight(C),C.castShadow&&p.pushShadow(C))}),R!==S&&R.traverseVisible(function(C){C.isLight&&C.layers.test($.layers)&&(p.pushLight(C),C.castShadow&&p.pushShadow(C))}),p.setupLights();const U=new Set;return R.traverse(function(C){if(!(C.isMesh||C.isPoints||C.isLine||C.isSprite))return;const Z=C.material;if(Z)if(Array.isArray(Z))for(let et=0;et<Z.length;et++){const lt=Z[et];$t(lt,S,C),U.add(lt)}else $t(Z,S,C),U.add(Z)}),_.pop(),p=null,U},this.compileAsync=function(R,$,S=null){const U=this.compile(R,$,S);return new Promise(C=>{function Z(){if(U.forEach(function(et){Pt.get(et).currentProgram.isReady()&&U.delete(et)}),U.size===0){C(R);return}setTimeout(Z,10)}kt.get("KHR_parallel_shader_compile")!==null?Z():setTimeout(Z,10)})};let ce=null;function pe(R){ce&&ce(R)}function Fe(){le.stop()}function Te(){le.start()}const le=new au;le.setAnimationLoop(pe),typeof self<"u"&&le.setContext(self),this.setAnimationLoop=function(R){ce=R,J.setAnimationLoop(R),R===null?le.stop():le.start()},J.addEventListener("sessionstart",Fe),J.addEventListener("sessionend",Te),this.render=function(R,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(k===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(J.cameraAutoUpdate===!0&&J.updateCamera($),$=J.getCamera()),R.isScene===!0&&R.onBeforeRender(y,R,$,T),p=Gt.get(R,_.length),p.init($),_.push(p),ft.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),Y.setFromProjectionMatrix(ft),ut=this.localClippingEnabled,tt=nt.init(this.clippingPlanes,ut),m=pt.get(R,x.length),m.init(),x.push(m),J.enabled===!0&&J.isPresenting===!0){const Z=y.xr.getDepthSensingMesh();Z!==null&&de(Z,$,-1/0,y.sortObjects)}de(R,$,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(q,j),At=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,At&&O.addToRenderList(m,R),this.info.render.frame++,tt===!0&&nt.beginShadows();const S=p.state.shadowsArray;Mt.render(S,R,$),tt===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const U=m.opaque,C=m.transmissive;if(p.setupLights(),$.isArrayCamera){const Z=$.cameras;if(C.length>0)for(let et=0,lt=Z.length;et<lt;et++){const mt=Z[et];en(U,C,R,mt)}At&&O.render(R);for(let et=0,lt=Z.length;et<lt;et++){const mt=Z[et];Me(m,R,mt,mt.viewport)}}else C.length>0&&en(U,C,R,$),At&&O.render(R),Me(m,R,$);T!==null&&(I.updateMultisampleRenderTarget(T),I.updateRenderTargetMipmap(T)),R.isScene===!0&&R.onAfterRender(y,R,$),Xt.resetDefaultState(),w=-1,M=null,_.pop(),_.length>0?(p=_[_.length-1],tt===!0&&nt.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function de(R,$,S,U){if(R.visible===!1)return;if(R.layers.test($.layers)){if(R.isGroup)S=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update($);else if(R.isLight)p.pushLight(R),R.castShadow&&p.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Y.intersectsSprite(R)){U&&Ct.setFromMatrixPosition(R.matrixWorld).applyMatrix4(ft);const et=at.update(R),lt=R.material;lt.visible&&m.push(R,et,lt,S,Ct.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Y.intersectsObject(R))){const et=at.update(R),lt=R.material;if(U&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Ct.copy(R.boundingSphere.center)):(et.boundingSphere===null&&et.computeBoundingSphere(),Ct.copy(et.boundingSphere.center)),Ct.applyMatrix4(R.matrixWorld).applyMatrix4(ft)),Array.isArray(lt)){const mt=et.groups;for(let bt=0,Rt=mt.length;bt<Rt;bt++){const Lt=mt[bt],Wt=lt[Lt.materialIndex];Wt&&Wt.visible&&m.push(R,et,Wt,S,Ct.z,Lt)}}else lt.visible&&m.push(R,et,lt,S,Ct.z,null)}}const Z=R.children;for(let et=0,lt=Z.length;et<lt;et++)de(Z[et],$,S,U)}function Me(R,$,S,U){const C=R.opaque,Z=R.transmissive,et=R.transparent;p.setupLightsView(S),tt===!0&&nt.setGlobalState(y.clippingPlanes,S),U&&Tt.viewport(P.copy(U)),C.length>0&&Ge(C,$,S),Z.length>0&&Ge(Z,$,S),et.length>0&&Ge(et,$,S),Tt.buffers.depth.setTest(!0),Tt.buffers.depth.setMask(!0),Tt.buffers.color.setMask(!0),Tt.setPolygonOffset(!1)}function en(R,$,S,U){if((S.isScene===!0?S.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[U.id]===void 0&&(p.state.transmissionRenderTarget[U.id]=new Ii(1,1,{generateMipmaps:!0,type:kt.has("EXT_color_buffer_half_float")||kt.has("EXT_color_buffer_float")?ta:Kn,minFilter:Ci,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:re.workingColorSpace}));const Z=p.state.transmissionRenderTarget[U.id],et=U.viewport||P;Z.setSize(et.z,et.w);const lt=y.getRenderTarget();y.setRenderTarget(Z),y.getClearColor(B),D=y.getClearAlpha(),D<1&&y.setClearColor(16777215,.5),y.clear(),At&&O.render(S);const mt=y.toneMapping;y.toneMapping=ci;const bt=U.viewport;if(U.viewport!==void 0&&(U.viewport=void 0),p.setupLightsView(U),tt===!0&&nt.setGlobalState(y.clippingPlanes,U),Ge(R,S,U),I.updateMultisampleRenderTarget(Z),I.updateRenderTargetMipmap(Z),kt.has("WEBGL_multisampled_render_to_texture")===!1){let Rt=!1;for(let Lt=0,Wt=$.length;Lt<Wt;Lt++){const qt=$[Lt],te=qt.object,_e=qt.geometry,Kt=qt.material,Bt=qt.group;if(Kt.side===we&&te.layers.test(U.layers)){const Se=Kt.side;Kt.side=on,Kt.needsUpdate=!0,Ze(te,S,U,_e,Kt,Bt),Kt.side=Se,Kt.needsUpdate=!0,Rt=!0}}Rt===!0&&(I.updateMultisampleRenderTarget(Z),I.updateRenderTargetMipmap(Z))}y.setRenderTarget(lt),y.setClearColor(B,D),bt!==void 0&&(U.viewport=bt),y.toneMapping=mt}function Ge(R,$,S){const U=$.isScene===!0?$.overrideMaterial:null;for(let C=0,Z=R.length;C<Z;C++){const et=R[C],lt=et.object,mt=et.geometry,bt=U===null?et.material:U,Rt=et.group;lt.layers.test(S.layers)&&Ze(lt,$,S,mt,bt,Rt)}}function Ze(R,$,S,U,C,Z){R.onBeforeRender(y,$,S,U,C,Z),R.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),C.onBeforeRender(y,$,S,U,R,Z),C.transparent===!0&&C.side===we&&C.forceSinglePass===!1?(C.side=on,C.needsUpdate=!0,y.renderBufferDirect(S,$,U,C,R,Z),C.side=li,C.needsUpdate=!0,y.renderBufferDirect(S,$,U,C,R,Z),C.side=we):y.renderBufferDirect(S,$,U,C,R,Z),R.onAfterRender(y,$,S,U,C,Z)}function Ne(R,$,S){$.isScene!==!0&&($=vt);const U=Pt.get(R),C=p.state.lights,Z=p.state.shadowsArray,et=C.state.version,lt=Ft.getParameters(R,C.state,Z,$,S),mt=Ft.getProgramCacheKey(lt);let bt=U.programs;U.environment=R.isMeshStandardMaterial?$.environment:null,U.fog=$.fog,U.envMap=(R.isMeshStandardMaterial?W:E).get(R.envMap||U.environment),U.envMapRotation=U.environment!==null&&R.envMap===null?$.environmentRotation:R.envMapRotation,bt===void 0&&(R.addEventListener("dispose",Ht),bt=new Map,U.programs=bt);let Rt=bt.get(mt);if(Rt!==void 0){if(U.currentProgram===Rt&&U.lightsStateVersion===et)return ln(R,lt),Rt}else lt.uniforms=Ft.getUniforms(R),R.onBeforeCompile(lt,y),Rt=Ft.acquireProgram(lt,mt),bt.set(mt,Rt),U.uniforms=lt.uniforms;const Lt=U.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Lt.clippingPlanes=nt.uniform),ln(R,lt),U.needsLights=bn(R),U.lightsStateVersion=et,U.needsLights&&(Lt.ambientLightColor.value=C.state.ambient,Lt.lightProbe.value=C.state.probe,Lt.directionalLights.value=C.state.directional,Lt.directionalLightShadows.value=C.state.directionalShadow,Lt.spotLights.value=C.state.spot,Lt.spotLightShadows.value=C.state.spotShadow,Lt.rectAreaLights.value=C.state.rectArea,Lt.ltc_1.value=C.state.rectAreaLTC1,Lt.ltc_2.value=C.state.rectAreaLTC2,Lt.pointLights.value=C.state.point,Lt.pointLightShadows.value=C.state.pointShadow,Lt.hemisphereLights.value=C.state.hemi,Lt.directionalShadowMap.value=C.state.directionalShadowMap,Lt.directionalShadowMatrix.value=C.state.directionalShadowMatrix,Lt.spotShadowMap.value=C.state.spotShadowMap,Lt.spotLightMatrix.value=C.state.spotLightMatrix,Lt.spotLightMap.value=C.state.spotLightMap,Lt.pointShadowMap.value=C.state.pointShadowMap,Lt.pointShadowMatrix.value=C.state.pointShadowMatrix),U.currentProgram=Rt,U.uniformsList=null,Rt}function ze(R){if(R.uniformsList===null){const $=R.currentProgram.getUniforms();R.uniformsList=Za.seqWithValue($.seq,R.uniforms)}return R.uniformsList}function ln(R,$){const S=Pt.get(R);S.outputColorSpace=$.outputColorSpace,S.batching=$.batching,S.batchingColor=$.batchingColor,S.instancing=$.instancing,S.instancingColor=$.instancingColor,S.instancingMorph=$.instancingMorph,S.skinning=$.skinning,S.morphTargets=$.morphTargets,S.morphNormals=$.morphNormals,S.morphColors=$.morphColors,S.morphTargetsCount=$.morphTargetsCount,S.numClippingPlanes=$.numClippingPlanes,S.numIntersection=$.numClipIntersection,S.vertexAlphas=$.vertexAlphas,S.vertexTangents=$.vertexTangents,S.toneMapping=$.toneMapping}function me(R,$,S,U,C){$.isScene!==!0&&($=vt),I.resetTextureUnits();const Z=$.fog,et=U.isMeshStandardMaterial?$.environment:null,lt=T===null?y.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:_s,mt=(U.isMeshStandardMaterial?W:E).get(U.envMap||et),bt=U.vertexColors===!0&&!!S.attributes.color&&S.attributes.color.itemSize===4,Rt=!!S.attributes.tangent&&(!!U.normalMap||U.anisotropy>0),Lt=!!S.morphAttributes.position,Wt=!!S.morphAttributes.normal,qt=!!S.morphAttributes.color;let te=ci;U.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(te=y.toneMapping);const _e=S.morphAttributes.position||S.morphAttributes.normal||S.morphAttributes.color,Kt=_e!==void 0?_e.length:0,Bt=Pt.get(U),Se=p.state.lights;if(tt===!0&&(ut===!0||R!==M)){const Ce=R===M&&U.id===w;nt.setState(U,R,Ce)}let ee=!1;U.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==Se.state.version||Bt.outputColorSpace!==lt||C.isBatchedMesh&&Bt.batching===!1||!C.isBatchedMesh&&Bt.batching===!0||C.isBatchedMesh&&Bt.batchingColor===!0&&C.colorTexture===null||C.isBatchedMesh&&Bt.batchingColor===!1&&C.colorTexture!==null||C.isInstancedMesh&&Bt.instancing===!1||!C.isInstancedMesh&&Bt.instancing===!0||C.isSkinnedMesh&&Bt.skinning===!1||!C.isSkinnedMesh&&Bt.skinning===!0||C.isInstancedMesh&&Bt.instancingColor===!0&&C.instanceColor===null||C.isInstancedMesh&&Bt.instancingColor===!1&&C.instanceColor!==null||C.isInstancedMesh&&Bt.instancingMorph===!0&&C.morphTexture===null||C.isInstancedMesh&&Bt.instancingMorph===!1&&C.morphTexture!==null||Bt.envMap!==mt||U.fog===!0&&Bt.fog!==Z||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==nt.numPlanes||Bt.numIntersection!==nt.numIntersection)||Bt.vertexAlphas!==bt||Bt.vertexTangents!==Rt||Bt.morphTargets!==Lt||Bt.morphNormals!==Wt||Bt.morphColors!==qt||Bt.toneMapping!==te||Bt.morphTargetsCount!==Kt)&&(ee=!0):(ee=!0,Bt.__version=U.version);let Et=Bt.currentProgram;ee===!0&&(Et=Ne(U,$,C));let Vt=!1,oe=!1,hn=!1;const se=Et.getUniforms(),nn=Bt.uniforms;if(Tt.useProgram(Et.program)&&(Vt=!0,oe=!0,hn=!0),U.id!==w&&(w=U.id,oe=!0),Vt||M!==R){Tt.buffers.depth.getReversed()?(K.copy(R.projectionMatrix),z0(K),O0(K),se.setValue(G,"projectionMatrix",K)):se.setValue(G,"projectionMatrix",R.projectionMatrix),se.setValue(G,"viewMatrix",R.matrixWorldInverse);const xn=se.map.cameraPosition;xn!==void 0&&xn.setValue(G,It.setFromMatrixPosition(R.matrixWorld)),Ut.logarithmicDepthBuffer&&se.setValue(G,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(U.isMeshPhongMaterial||U.isMeshToonMaterial||U.isMeshLambertMaterial||U.isMeshBasicMaterial||U.isMeshStandardMaterial||U.isShaderMaterial)&&se.setValue(G,"isOrthographic",R.isOrthographicCamera===!0),M!==R&&(M=R,oe=!0,hn=!0)}if(C.isSkinnedMesh){se.setOptional(G,C,"bindMatrix"),se.setOptional(G,C,"bindMatrixInverse");const Ce=C.skeleton;Ce&&(Ce.boneTexture===null&&Ce.computeBoneTexture(),se.setValue(G,"boneTexture",Ce.boneTexture,I))}C.isBatchedMesh&&(se.setOptional(G,C,"batchingTexture"),se.setValue(G,"batchingTexture",C._matricesTexture,I),se.setOptional(G,C,"batchingIdTexture"),se.setValue(G,"batchingIdTexture",C._indirectTexture,I),se.setOptional(G,C,"batchingColorTexture"),C._colorsTexture!==null&&se.setValue(G,"batchingColorTexture",C._colorsTexture,I));const dn=S.morphAttributes;if((dn.position!==void 0||dn.normal!==void 0||dn.color!==void 0)&&it.update(C,S,Et),(oe||Bt.receiveShadow!==C.receiveShadow)&&(Bt.receiveShadow=C.receiveShadow,se.setValue(G,"receiveShadow",C.receiveShadow)),U.isMeshGouraudMaterial&&U.envMap!==null&&(nn.envMap.value=mt,nn.flipEnvMap.value=mt.isCubeTexture&&mt.isRenderTargetTexture===!1?-1:1),U.isMeshStandardMaterial&&U.envMap===null&&$.environment!==null&&(nn.envMapIntensity.value=$.environmentIntensity),oe&&(se.setValue(G,"toneMappingExposure",y.toneMappingExposure),Bt.needsLights&&Le(nn,hn),Z&&U.fog===!0&&Q.refreshFogUniforms(nn,Z),Q.refreshMaterialUniforms(nn,U,H,X,p.state.transmissionRenderTarget[R.id]),Za.upload(G,ze(Bt),nn,I)),U.isShaderMaterial&&U.uniformsNeedUpdate===!0&&(Za.upload(G,ze(Bt),nn,I),U.uniformsNeedUpdate=!1),U.isSpriteMaterial&&se.setValue(G,"center",C.center),se.setValue(G,"modelViewMatrix",C.modelViewMatrix),se.setValue(G,"normalMatrix",C.normalMatrix),se.setValue(G,"modelMatrix",C.matrixWorld),U.isShaderMaterial||U.isRawShaderMaterial){const Ce=U.uniformsGroups;for(let xn=0,Xe=Ce.length;xn<Xe;xn++){const Jn=Ce[xn];z.update(Jn,Et),z.bind(Jn,Et)}}return Et}function Le(R,$){R.ambientLightColor.needsUpdate=$,R.lightProbe.needsUpdate=$,R.directionalLights.needsUpdate=$,R.directionalLightShadows.needsUpdate=$,R.pointLights.needsUpdate=$,R.pointLightShadows.needsUpdate=$,R.spotLights.needsUpdate=$,R.spotLightShadows.needsUpdate=$,R.rectAreaLights.needsUpdate=$,R.hemisphereLights.needsUpdate=$}function bn(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(R,$,S){Pt.get(R.texture).__webglTexture=$,Pt.get(R.depthTexture).__webglTexture=S;const U=Pt.get(R);U.__hasExternalTextures=!0,U.__autoAllocateDepthBuffer=S===void 0,U.__autoAllocateDepthBuffer||kt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),U.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(R,$){const S=Pt.get(R);S.__webglFramebuffer=$,S.__useDefaultFramebuffer=$===void 0},this.setRenderTarget=function(R,$=0,S=0){T=R,b=$,A=S;let U=!0,C=null,Z=!1,et=!1;if(R){const mt=Pt.get(R);if(mt.__useDefaultFramebuffer!==void 0)Tt.bindFramebuffer(G.FRAMEBUFFER,null),U=!1;else if(mt.__webglFramebuffer===void 0)I.setupRenderTarget(R);else if(mt.__hasExternalTextures)I.rebindTextures(R,Pt.get(R.texture).__webglTexture,Pt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Lt=R.depthTexture;if(mt.__boundDepthTexture!==Lt){if(Lt!==null&&Pt.has(Lt)&&(R.width!==Lt.image.width||R.height!==Lt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");I.setupDepthRenderbuffer(R)}}const bt=R.texture;(bt.isData3DTexture||bt.isDataArrayTexture||bt.isCompressedArrayTexture)&&(et=!0);const Rt=Pt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Rt[$])?C=Rt[$][S]:C=Rt[$],Z=!0):R.samples>0&&I.useMultisampledRTT(R)===!1?C=Pt.get(R).__webglMultisampledFramebuffer:Array.isArray(Rt)?C=Rt[S]:C=Rt,P.copy(R.viewport),F.copy(R.scissor),N=R.scissorTest}else P.copy(ot).multiplyScalar(H).floor(),F.copy(dt).multiplyScalar(H).floor(),N=xt;if(Tt.bindFramebuffer(G.FRAMEBUFFER,C)&&U&&Tt.drawBuffers(R,C),Tt.viewport(P),Tt.scissor(F),Tt.setScissorTest(N),Z){const mt=Pt.get(R.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt.__webglTexture,S)}else if(et){const mt=Pt.get(R.texture),bt=$||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,mt.__webglTexture,S||0,bt)}w=-1},this.readRenderTargetPixels=function(R,$,S,U,C,Z,et){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let lt=Pt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&et!==void 0&&(lt=lt[et]),lt){Tt.bindFramebuffer(G.FRAMEBUFFER,lt);try{const mt=R.texture,bt=mt.format,Rt=mt.type;if(!Ut.textureFormatReadable(bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ut.textureTypeReadable(Rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=R.width-U&&S>=0&&S<=R.height-C&&G.readPixels($,S,U,C,Ot.convert(bt),Ot.convert(Rt),Z)}finally{const mt=T!==null?Pt.get(T).__webglFramebuffer:null;Tt.bindFramebuffer(G.FRAMEBUFFER,mt)}}},this.readRenderTargetPixelsAsync=async function(R,$,S,U,C,Z,et){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let lt=Pt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&et!==void 0&&(lt=lt[et]),lt){const mt=R.texture,bt=mt.format,Rt=mt.type;if(!Ut.textureFormatReadable(bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ut.textureTypeReadable(Rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if($>=0&&$<=R.width-U&&S>=0&&S<=R.height-C){Tt.bindFramebuffer(G.FRAMEBUFFER,lt);const Lt=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,Lt),G.bufferData(G.PIXEL_PACK_BUFFER,Z.byteLength,G.STREAM_READ),G.readPixels($,S,U,C,Ot.convert(bt),Ot.convert(Rt),0);const Wt=T!==null?Pt.get(T).__webglFramebuffer:null;Tt.bindFramebuffer(G.FRAMEBUFFER,Wt);const qt=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await N0(G,qt,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,Lt),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,Z),G.deleteBuffer(Lt),G.deleteSync(qt),Z}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(R,$=null,S=0){R.isTexture!==!0&&(Us("WebGLRenderer: copyFramebufferToTexture function signature has changed."),$=arguments[0]||null,R=arguments[1]);const U=Math.pow(2,-S),C=Math.floor(R.image.width*U),Z=Math.floor(R.image.height*U),et=$!==null?$.x:0,lt=$!==null?$.y:0;I.setTexture2D(R,0),G.copyTexSubImage2D(G.TEXTURE_2D,S,0,0,et,lt,C,Z),Tt.unbindTexture()},this.copyTextureToTexture=function(R,$,S=null,U=null,C=0){R.isTexture!==!0&&(Us("WebGLRenderer: copyTextureToTexture function signature has changed."),U=arguments[0]||null,R=arguments[1],$=arguments[2],C=arguments[3]||0,S=null);let Z,et,lt,mt,bt,Rt,Lt,Wt,qt;const te=R.isCompressedTexture?R.mipmaps[C]:R.image;S!==null?(Z=S.max.x-S.min.x,et=S.max.y-S.min.y,lt=S.isBox3?S.max.z-S.min.z:1,mt=S.min.x,bt=S.min.y,Rt=S.isBox3?S.min.z:0):(Z=te.width,et=te.height,lt=te.depth||1,mt=0,bt=0,Rt=0),U!==null?(Lt=U.x,Wt=U.y,qt=U.z):(Lt=0,Wt=0,qt=0);const _e=Ot.convert($.format),Kt=Ot.convert($.type);let Bt;$.isData3DTexture?(I.setTexture3D($,0),Bt=G.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(I.setTexture2DArray($,0),Bt=G.TEXTURE_2D_ARRAY):(I.setTexture2D($,0),Bt=G.TEXTURE_2D),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,$.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,$.unpackAlignment);const Se=G.getParameter(G.UNPACK_ROW_LENGTH),ee=G.getParameter(G.UNPACK_IMAGE_HEIGHT),Et=G.getParameter(G.UNPACK_SKIP_PIXELS),Vt=G.getParameter(G.UNPACK_SKIP_ROWS),oe=G.getParameter(G.UNPACK_SKIP_IMAGES);G.pixelStorei(G.UNPACK_ROW_LENGTH,te.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,te.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,mt),G.pixelStorei(G.UNPACK_SKIP_ROWS,bt),G.pixelStorei(G.UNPACK_SKIP_IMAGES,Rt);const hn=R.isDataArrayTexture||R.isData3DTexture,se=$.isDataArrayTexture||$.isData3DTexture;if(R.isRenderTargetTexture||R.isDepthTexture){const nn=Pt.get(R),dn=Pt.get($),Ce=Pt.get(nn.__renderTarget),xn=Pt.get(dn.__renderTarget);Tt.bindFramebuffer(G.READ_FRAMEBUFFER,Ce.__webglFramebuffer),Tt.bindFramebuffer(G.DRAW_FRAMEBUFFER,xn.__webglFramebuffer);for(let Xe=0;Xe<lt;Xe++)hn&&G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Pt.get(R).__webglTexture,C,Rt+Xe),R.isDepthTexture?(se&&G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Pt.get($).__webglTexture,C,qt+Xe),G.blitFramebuffer(mt,bt,Z,et,Lt,Wt,Z,et,G.DEPTH_BUFFER_BIT,G.NEAREST)):se?G.copyTexSubImage3D(Bt,C,Lt,Wt,qt+Xe,mt,bt,Z,et):G.copyTexSubImage2D(Bt,C,Lt,Wt,qt+Xe,mt,bt,Z,et);Tt.bindFramebuffer(G.READ_FRAMEBUFFER,null),Tt.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else se?R.isDataTexture||R.isData3DTexture?G.texSubImage3D(Bt,C,Lt,Wt,qt,Z,et,lt,_e,Kt,te.data):$.isCompressedArrayTexture?G.compressedTexSubImage3D(Bt,C,Lt,Wt,qt,Z,et,lt,_e,te.data):G.texSubImage3D(Bt,C,Lt,Wt,qt,Z,et,lt,_e,Kt,te):R.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,C,Lt,Wt,Z,et,_e,Kt,te.data):R.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,C,Lt,Wt,te.width,te.height,_e,te.data):G.texSubImage2D(G.TEXTURE_2D,C,Lt,Wt,Z,et,_e,Kt,te);G.pixelStorei(G.UNPACK_ROW_LENGTH,Se),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,ee),G.pixelStorei(G.UNPACK_SKIP_PIXELS,Et),G.pixelStorei(G.UNPACK_SKIP_ROWS,Vt),G.pixelStorei(G.UNPACK_SKIP_IMAGES,oe),C===0&&$.generateMipmaps&&G.generateMipmap(Bt),Tt.unbindTexture()},this.copyTextureToTexture3D=function(R,$,S=null,U=null,C=0){return R.isTexture!==!0&&(Us("WebGLRenderer: copyTextureToTexture3D function signature has changed."),S=arguments[0]||null,U=arguments[1]||null,R=arguments[2],$=arguments[3],C=arguments[4]||0),Us('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(R,$,S,U,C)},this.initRenderTarget=function(R){Pt.get(R).__webglFramebuffer===void 0&&I.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?I.setTextureCube(R,0):R.isData3DTexture?I.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?I.setTexture2DArray(R,0):I.setTexture2D(R,0),Tt.unbindTexture()},this.resetState=function(){b=0,A=0,T=null,Tt.reset(),Xt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=re._getDrawingBufferColorSpace(t),e.unpackColorSpace=re._getUnpackColorSpace()}}class qy extends Re{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zn,this.environmentIntensity=1,this.environmentRotation=new zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class jy{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Sc,this.updateRanges=[],this.version=0,this.uuid=Nn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Nn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Nn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const qe=new V;class hr{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)qe.fromBufferAttribute(this,e),qe.applyMatrix4(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)qe.fromBufferAttribute(this,e),qe.applyNormalMatrix(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)qe.fromBufferAttribute(this,e),qe.transformDirection(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Rn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=fe(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Rn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Rn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Rn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Rn(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=fe(e,this.array),i=fe(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=fe(e,this.array),i=fe(i,this.array),s=fe(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=fe(e,this.array),i=fe(i,this.array),s=fe(s,this.array),a=fe(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new tn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new hr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ec extends Ui{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Yt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ns;const Ls=new V,is=new V,ss=new V,as=new zt,Ds=new zt,uu=new ve,Pa=new V,Is=new V,La=new V,Zh=new zt,fo=new zt,qh=new zt;class jh extends Re{constructor(t=new Ec){if(super(),this.isSprite=!0,this.type="Sprite",ns===void 0){ns=new Ue;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new jy(e,5);ns.setIndex([0,1,2,0,2,3]),ns.setAttribute("position",new hr(i,3,0,!1)),ns.setAttribute("uv",new hr(i,2,3,!1))}this.geometry=ns,this.material=t,this.center=new zt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),is.setFromMatrixScale(this.matrixWorld),uu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ss.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&is.multiplyScalar(-ss.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const r=this.center;Da(Pa.set(-.5,-.5,0),ss,r,is,s,a),Da(Is.set(.5,-.5,0),ss,r,is,s,a),Da(La.set(.5,.5,0),ss,r,is,s,a),Zh.set(0,0),fo.set(1,0),qh.set(1,1);let o=t.ray.intersectTriangle(Pa,Is,La,!1,Ls);if(o===null&&(Da(Is.set(-.5,.5,0),ss,r,is,s,a),fo.set(0,1),o=t.ray.intersectTriangle(Pa,La,Is,!1,Ls),o===null))return;const c=t.ray.origin.distanceTo(Ls);c<t.near||c>t.far||e.push({distance:c,point:Ls.clone(),uv:gn.getInterpolation(Ls,Pa,Is,La,Zh,fo,qh,new zt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Da(n,t,e,i,s,a){as.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(Ds.x=a*as.x-s*as.y,Ds.y=s*as.x+a*as.y):Ds.copy(as),n.copy(t),n.x+=Ds.x,n.y+=Ds.y,n.applyMatrix4(uu)}class tl extends Ui{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Yt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const dr=new V,ur=new V,Kh=new ve,ks=new jc,Ia=new gr,po=new V,Jh=new V;class Ky extends Re{constructor(t=new Ue,e=new tl){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,a=e.count;s<a;s++)dr.fromBufferAttribute(e,s-1),ur.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=dr.distanceTo(ur);t.setAttribute("lineDistance",new ue(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ia.copy(i.boundingSphere),Ia.applyMatrix4(s),Ia.radius+=a,t.ray.intersectsSphere(Ia)===!1)return;Kh.copy(s).invert(),ks.copy(t.ray).applyMatrix4(Kh);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let v=u,m=g-1;v<m;v+=l){const p=h.getX(v),x=h.getX(v+1),_=ka(this,t,ks,c,p,x);_&&e.push(_)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(u),p=ka(this,t,ks,c,v,m);p&&e.push(p)}}else{const u=Math.max(0,r.start),g=Math.min(d.count,r.start+r.count);for(let v=u,m=g-1;v<m;v+=l){const p=ka(this,t,ks,c,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=ka(this,t,ks,c,g-1,u);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function ka(n,t,e,i,s,a){const r=n.geometry.attributes.position;if(dr.fromBufferAttribute(r,s),ur.fromBufferAttribute(r,a),e.distanceSqToSegment(dr,ur,po,Jh)>i)return;po.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(po);if(!(c<t.near||c>t.far))return{distance:c,point:Jh.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}const Qh=new V,td=new V;class fu extends Ky{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,a=e.count;s<a;s+=2)Qh.fromBufferAttribute(e,s),td.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Qh.distanceTo(td);t.setAttribute("lineDistance",new ue(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class wc extends Qe{constructor(t,e,i,s,a,r,o,c,l){super(t,e,i,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class On{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),a=0;e.push(0);for(let r=1;r<=t;r++)i=this.getPoint(r/t),a+=i.distanceTo(s),e.push(a),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const a=i.length;let r;e?r=e:r=t*i[a-1];let o=0,c=a-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=i[s]-r,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===r)return s/(a-1);const h=i[s],d=i[s+1]-h,u=(r-h)/d;return(s+u)/(a-1)}getTangent(t,e){let s=t-1e-4,a=t+1e-4;s<0&&(s=0),a>1&&(a=1);const r=this.getPoint(s),o=this.getPoint(a),c=e||(r.isVector2?new zt:new V);return c.copy(o).sub(r).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new V,s=[],a=[],r=[],o=new V,c=new ve;for(let u=0;u<=t;u++){const g=u/t;s[u]=this.getTangentAt(g,new V)}a[0]=new V,r[0]=new V;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),f<=l&&(l=f,i.set(0,1,0)),d<=l&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],o),r[0].crossVectors(s[0],a[0]);for(let u=1;u<=t;u++){if(a[u]=a[u-1].clone(),r[u]=r[u-1].clone(),o.crossVectors(s[u-1],s[u]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Ve(s[u-1].dot(s[u]),-1,1));a[u].applyMatrix4(c.makeRotationAxis(o,g))}r[u].crossVectors(s[u],a[u])}if(e===!0){let u=Math.acos(Ve(a[0].dot(a[t]),-1,1));u/=t,s[0].dot(o.crossVectors(a[0],a[t]))>0&&(u=-u);for(let g=1;g<=t;g++)a[g].applyMatrix4(c.makeRotationAxis(s[g],u*g)),r[g].crossVectors(s[g],a[g])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class el extends On{constructor(t=0,e=0,i=1,s=1,a=0,r=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new zt){const i=e,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);const o=this.aStartAngle+t*a;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=c-this.aX,u=l-this.aY;c=d*h-u*f+this.aX,l=d*f+u*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Jy extends el{constructor(t,e,i,s,a,r){super(t,e,i,i,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}}function nl(){let n=0,t=0,e=0,i=0;function s(a,r,o,c){n=a,t=o,e=-3*a+3*r-2*o-c,i=2*a-2*r+o+c}return{initCatmullRom:function(a,r,o,c,l){s(r,o,l*(o-a),l*(c-r))},initNonuniformCatmullRom:function(a,r,o,c,l,h,f){let d=(r-a)/l-(o-a)/(l+h)+(o-r)/h,u=(o-r)/h-(c-r)/(h+f)+(c-o)/f;d*=h,u*=h,s(r,o,d,u)},calc:function(a){const r=a*a,o=r*a;return n+t*a+e*r+i*o}}}const Ua=new V,mo=new nl,go=new nl,xo=new nl;class Qy extends On{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new V){const i=e,s=this.points,a=s.length,r=(a-(this.closed?0:1))*t;let o=Math.floor(r),c=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/a)+1)*a:c===0&&o===a-1&&(o=a-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%a]:(Ua.subVectors(s[0],s[1]).add(s[0]),l=Ua);const f=s[o%a],d=s[(o+1)%a];if(this.closed||o+2<a?h=s[(o+2)%a]:(Ua.subVectors(s[a-1],s[a-2]).add(s[a-1]),h=Ua),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(f),u),v=Math.pow(f.distanceToSquared(d),u),m=Math.pow(d.distanceToSquared(h),u);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),mo.initNonuniformCatmullRom(l.x,f.x,d.x,h.x,g,v,m),go.initNonuniformCatmullRom(l.y,f.y,d.y,h.y,g,v,m),xo.initNonuniformCatmullRom(l.z,f.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(mo.initCatmullRom(l.x,f.x,d.x,h.x,this.tension),go.initCatmullRom(l.y,f.y,d.y,h.y,this.tension),xo.initCatmullRom(l.z,f.z,d.z,h.z,this.tension));return i.set(mo.calc(c),go.calc(c),xo.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new V().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function ed(n,t,e,i,s){const a=(i-t)*.5,r=(s-e)*.5,o=n*n,c=n*o;return(2*e-2*i+a+r)*c+(-3*e+3*i-2*a-r)*o+a*n+e}function tM(n,t){const e=1-n;return e*e*t}function eM(n,t){return 2*(1-n)*n*t}function nM(n,t){return n*n*t}function Os(n,t,e,i){return tM(n,t)+eM(n,e)+nM(n,i)}function iM(n,t){const e=1-n;return e*e*e*t}function sM(n,t){const e=1-n;return 3*e*e*n*t}function aM(n,t){return 3*(1-n)*n*n*t}function rM(n,t){return n*n*n*t}function Bs(n,t,e,i,s){return iM(n,t)+sM(n,e)+aM(n,i)+rM(n,s)}class pu extends On{constructor(t=new zt,e=new zt,i=new zt,s=new zt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new zt){const i=e,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(Bs(t,s.x,a.x,r.x,o.x),Bs(t,s.y,a.y,r.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class oM extends On{constructor(t=new V,e=new V,i=new V,s=new V){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new V){const i=e,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(Bs(t,s.x,a.x,r.x,o.x),Bs(t,s.y,a.y,r.y,o.y),Bs(t,s.z,a.z,r.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class mu extends On{constructor(t=new zt,e=new zt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new zt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new zt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class cM extends On{constructor(t=new V,e=new V){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new V){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new V){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class gu extends On{constructor(t=new zt,e=new zt,i=new zt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new zt){const i=e,s=this.v0,a=this.v1,r=this.v2;return i.set(Os(t,s.x,a.x,r.x),Os(t,s.y,a.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class lM extends On{constructor(t=new V,e=new V,i=new V){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new V){const i=e,s=this.v0,a=this.v1,r=this.v2;return i.set(Os(t,s.x,a.x,r.x),Os(t,s.y,a.y,r.y),Os(t,s.z,a.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class xu extends On{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new zt){const i=e,s=this.points,a=(s.length-1)*t,r=Math.floor(a),o=a-r,c=s[r===0?r:r-1],l=s[r],h=s[r>s.length-2?s.length-1:r+1],f=s[r>s.length-3?s.length-1:r+2];return i.set(ed(o,c.x,l.x,h.x,f.x),ed(o,c.y,l.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new zt().fromArray(s))}return this}}var nd=Object.freeze({__proto__:null,ArcCurve:Jy,CatmullRomCurve3:Qy,CubicBezierCurve:pu,CubicBezierCurve3:oM,EllipseCurve:el,LineCurve:mu,LineCurve3:cM,QuadraticBezierCurve:gu,QuadraticBezierCurve3:lM,SplineCurve:xu});class hM extends On{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new nd[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const r=s[a]-i,o=this.curves[a],c=o.getLength(),l=c===0?0:1-r/c;return o.getPointAt(l,e)}a++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const r=a[s],o=r.isEllipseCurve?t*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?t*r.points.length:t,c=r.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new nd[s.type]().fromJSON(s))}return this}}class id extends hM{constructor(t){super(),this.type="Path",this.currentPoint=new zt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new mu(this.currentPoint.clone(),new zt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const a=new gu(this.currentPoint.clone(),new zt(t,e),new zt(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,a,r){const o=new pu(this.currentPoint.clone(),new zt(t,e),new zt(i,s),new zt(a,r));return this.curves.push(o),this.currentPoint.set(a,r),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new xu(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,a,r){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,i,s,a,r),this}absarc(t,e,i,s,a,r){return this.absellipse(t,e,i,i,s,a,r),this}ellipse(t,e,i,s,a,r,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,a,r,o,c),this}absellipse(t,e,i,s,a,r,o,c){const l=new el(t,e,i,s,a,r,o,c);if(this.curves.length>0){const f=l.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class il extends Ue{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const a=[],r=[],o=[],c=[],l=new V,h=new zt;r.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*s;l.x=t*Math.cos(u),l.y=t*Math.sin(u),r.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(r[d]/t+1)/2,h.y=(r[d+1]/t+1)/2,c.push(h.x,h.y)}for(let f=1;f<=e;f++)a.push(f,f+1,0);this.setIndex(a),this.setAttribute("position",new ue(r,3)),this.setAttribute("normal",new ue(o,3)),this.setAttribute("uv",new ue(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new il(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Zs extends Ue{constructor(t=1,e=1,i=1,s=32,a=1,r=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),a=Math.floor(a);const h=[],f=[],d=[],u=[];let g=0;const v=[],m=i/2;let p=0;x(),r===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new ue(f,3)),this.setAttribute("normal",new ue(d,3)),this.setAttribute("uv",new ue(u,2));function x(){const y=new V,k=new V;let b=0;const A=(e-t)/i;for(let T=0;T<=a;T++){const w=[],M=T/a,P=M*(e-t)+t;for(let F=0;F<=s;F++){const N=F/s,B=N*c+o,D=Math.sin(B),L=Math.cos(B);k.x=P*D,k.y=-M*i+m,k.z=P*L,f.push(k.x,k.y,k.z),y.set(D,A,L).normalize(),d.push(y.x,y.y,y.z),u.push(N,1-M),w.push(g++)}v.push(w)}for(let T=0;T<s;T++)for(let w=0;w<a;w++){const M=v[w][T],P=v[w+1][T],F=v[w+1][T+1],N=v[w][T+1];(t>0||w!==0)&&(h.push(M,P,N),b+=3),(e>0||w!==a-1)&&(h.push(P,F,N),b+=3)}l.addGroup(p,b,0),p+=b}function _(y){const k=g,b=new zt,A=new V;let T=0;const w=y===!0?t:e,M=y===!0?1:-1;for(let F=1;F<=s;F++)f.push(0,m*M,0),d.push(0,M,0),u.push(.5,.5),g++;const P=g;for(let F=0;F<=s;F++){const B=F/s*c+o,D=Math.cos(B),L=Math.sin(B);A.x=w*L,A.y=m*M,A.z=w*D,f.push(A.x,A.y,A.z),d.push(0,M,0),b.x=D*.5+.5,b.y=L*.5*M+.5,u.push(b.x,b.y),g++}for(let F=0;F<s;F++){const N=k+F,B=P+F;y===!0?h.push(B,B+1,N):h.push(B+1,B,N),T+=3}l.addGroup(p,T,y===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zs(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class sl extends Zs{constructor(t=1,e=1,i=32,s=1,a=!1,r=0,o=Math.PI*2){super(0,t,e,i,s,a,r,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(t){return new sl(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class al extends Ue{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const a=[],r=[];o(s),l(i),h(),this.setAttribute("position",new ue(a,3)),this.setAttribute("normal",new ue(a.slice(),3)),this.setAttribute("uv",new ue(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const _=new V,y=new V,k=new V;for(let b=0;b<e.length;b+=3)u(e[b+0],_),u(e[b+1],y),u(e[b+2],k),c(_,y,k,x)}function c(x,_,y,k){const b=k+1,A=[];for(let T=0;T<=b;T++){A[T]=[];const w=x.clone().lerp(y,T/b),M=_.clone().lerp(y,T/b),P=b-T;for(let F=0;F<=P;F++)F===0&&T===b?A[T][F]=w:A[T][F]=w.clone().lerp(M,F/P)}for(let T=0;T<b;T++)for(let w=0;w<2*(b-T)-1;w++){const M=Math.floor(w/2);w%2===0?(d(A[T][M+1]),d(A[T+1][M]),d(A[T][M])):(d(A[T][M+1]),d(A[T+1][M+1]),d(A[T+1][M]))}}function l(x){const _=new V;for(let y=0;y<a.length;y+=3)_.x=a[y+0],_.y=a[y+1],_.z=a[y+2],_.normalize().multiplyScalar(x),a[y+0]=_.x,a[y+1]=_.y,a[y+2]=_.z}function h(){const x=new V;for(let _=0;_<a.length;_+=3){x.x=a[_+0],x.y=a[_+1],x.z=a[_+2];const y=m(x)/2/Math.PI+.5,k=p(x)/Math.PI+.5;r.push(y,1-k)}g(),f()}function f(){for(let x=0;x<r.length;x+=6){const _=r[x+0],y=r[x+2],k=r[x+4],b=Math.max(_,y,k),A=Math.min(_,y,k);b>.9&&A<.1&&(_<.2&&(r[x+0]+=1),y<.2&&(r[x+2]+=1),k<.2&&(r[x+4]+=1))}}function d(x){a.push(x.x,x.y,x.z)}function u(x,_){const y=x*3;_.x=t[y+0],_.y=t[y+1],_.z=t[y+2]}function g(){const x=new V,_=new V,y=new V,k=new V,b=new zt,A=new zt,T=new zt;for(let w=0,M=0;w<a.length;w+=9,M+=6){x.set(a[w+0],a[w+1],a[w+2]),_.set(a[w+3],a[w+4],a[w+5]),y.set(a[w+6],a[w+7],a[w+8]),b.set(r[M+0],r[M+1]),A.set(r[M+2],r[M+3]),T.set(r[M+4],r[M+5]),k.copy(x).add(_).add(y).divideScalar(3);const P=m(k);v(b,M+0,x,P),v(A,M+2,_,P),v(T,M+4,y,P)}}function v(x,_,y,k){k<0&&x.x===1&&(r[_]=x.x-1),y.x===0&&y.z===0&&(r[_]=k/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new al(t.vertices,t.indices,t.radius,t.details)}}const Fa=new V,Na=new V,vo=new V,za=new gn;class dM extends Ue{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(ds*e),r=t.getIndex(),o=t.getAttribute("position"),c=r?r.count:o.count,l=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let g=0;g<c;g+=3){r?(l[0]=r.getX(g),l[1]=r.getX(g+1),l[2]=r.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:v,b:m,c:p}=za;if(v.fromBufferAttribute(o,l[0]),m.fromBufferAttribute(o,l[1]),p.fromBufferAttribute(o,l[2]),za.getNormal(vo),f[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,f[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,f[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const _=(x+1)%3,y=f[x],k=f[_],b=za[h[x]],A=za[h[_]],T=`${y}_${k}`,w=`${k}_${y}`;w in d&&d[w]?(vo.dot(d[w].normal)<=a&&(u.push(b.x,b.y,b.z),u.push(A.x,A.y,A.z)),d[w]=null):T in d||(d[T]={index0:l[x],index1:l[_],normal:vo.clone()})}}for(const g in d)if(d[g]){const{index0:v,index1:m}=d[g];Fa.fromBufferAttribute(o,v),Na.fromBufferAttribute(o,m),u.push(Fa.x,Fa.y,Fa.z),u.push(Na.x,Na.y,Na.z)}this.setAttribute("position",new ue(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class vu extends id{constructor(t){super(t),this.uuid=Nn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new id().fromJSON(s))}return this}}const uM={triangulate:function(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let a=_u(n,0,s,e,!0);const r=[];if(!a||a.next===a.prev)return r;let o,c,l,h,f,d,u;if(i&&(a=xM(n,t,a,e)),n.length>80*e){o=l=n[0],c=h=n[1];for(let g=e;g<s;g+=e)f=n[g],d=n[g+1],f<o&&(o=f),d<c&&(c=d),f>l&&(l=f),d>h&&(h=d);u=Math.max(l-o,h-c),u=u!==0?32767/u:0}return qs(a,r,e,o,c,u,0),r}};function _u(n,t,e,i,s){let a,r;if(s===RM(n,t,e,i)>0)for(a=t;a<e;a+=i)r=sd(a,n[a],n[a+1],r);else for(a=e-i;a>=t;a-=i)r=sd(a,n[a],n[a+1],r);return r&&vr(r,r.next)&&(Ks(r),r=r.next),r}function ki(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(vr(e,e.next)||Ee(e.prev,e,e.next)===0)){if(Ks(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function qs(n,t,e,i,s,a,r){if(!n)return;!r&&a&&SM(n,i,s,a);let o=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,a?pM(n,i,s,a):fM(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),Ks(n),n=l.next,o=l.next;continue}if(n=l,n===o){r?r===1?(n=mM(ki(n),t,e),qs(n,t,e,i,s,a,2)):r===2&&gM(n,t,e,i,s,a):qs(ki(n),t,e,i,s,a,1);break}}}function fM(n){const t=n.prev,e=n,i=n.next;if(Ee(t,e,i)>=0)return!1;const s=t.x,a=e.x,r=i.x,o=t.y,c=e.y,l=i.y,h=s<a?s<r?s:r:a<r?a:r,f=o<c?o<l?o:l:c<l?c:l,d=s>a?s>r?s:r:a>r?a:r,u=o>c?o>l?o:l:c>l?c:l;let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=f&&g.y<=u&&cs(s,o,a,c,r,l,g.x,g.y)&&Ee(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function pM(n,t,e,i){const s=n.prev,a=n,r=n.next;if(Ee(s,a,r)>=0)return!1;const o=s.x,c=a.x,l=r.x,h=s.y,f=a.y,d=r.y,u=o<c?o<l?o:l:c<l?c:l,g=h<f?h<d?h:d:f<d?f:d,v=o>c?o>l?o:l:c>l?c:l,m=h>f?h>d?h:d:f>d?f:d,p=Ac(u,g,t,e,i),x=Ac(v,m,t,e,i);let _=n.prevZ,y=n.nextZ;for(;_&&_.z>=p&&y&&y.z<=x;){if(_.x>=u&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==r&&cs(o,h,c,f,l,d,_.x,_.y)&&Ee(_.prev,_,_.next)>=0||(_=_.prevZ,y.x>=u&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==r&&cs(o,h,c,f,l,d,y.x,y.y)&&Ee(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;_&&_.z>=p;){if(_.x>=u&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==r&&cs(o,h,c,f,l,d,_.x,_.y)&&Ee(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;y&&y.z<=x;){if(y.x>=u&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==r&&cs(o,h,c,f,l,d,y.x,y.y)&&Ee(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function mM(n,t,e){let i=n;do{const s=i.prev,a=i.next.next;!vr(s,a)&&yu(s,i,i.next,a)&&js(s,a)&&js(a,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(a.i/e|0),Ks(i),Ks(i.next),i=n=a),i=i.next}while(i!==n);return ki(i)}function gM(n,t,e,i,s,a){let r=n;do{let o=r.next.next;for(;o!==r.prev;){if(r.i!==o.i&&wM(r,o)){let c=Mu(r,o);r=ki(r,r.next),c=ki(c,c.next),qs(r,t,e,i,s,a,0),qs(c,t,e,i,s,a,0);return}o=o.next}r=r.next}while(r!==n)}function xM(n,t,e,i){const s=[];let a,r,o,c,l;for(a=0,r=t.length;a<r;a++)o=t[a]*i,c=a<r-1?t[a+1]*i:n.length,l=_u(n,o,c,i,!1),l===l.next&&(l.steiner=!0),s.push(EM(l));for(s.sort(vM),a=0;a<s.length;a++)e=_M(s[a],e);return e}function vM(n,t){return n.x-t.x}function _M(n,t){const e=yM(n,t);if(!e)return t;const i=Mu(e,n);return ki(i,i.next),ki(e,e.next)}function yM(n,t){let e=t,i=-1/0,s;const a=n.x,r=n.y;do{if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const d=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=a&&d>i&&(i=d,s=e.x<e.next.x?e:e.next,d===a))return s}e=e.next}while(e!==t);if(!s)return null;const o=s,c=s.x,l=s.y;let h=1/0,f;e=s;do a>=e.x&&e.x>=c&&a!==e.x&&cs(r<l?a:i,r,c,l,r<l?i:a,r,e.x,e.y)&&(f=Math.abs(r-e.y)/(a-e.x),js(e,n)&&(f<h||f===h&&(e.x>s.x||e.x===s.x&&MM(s,e)))&&(s=e,h=f)),e=e.next;while(e!==o);return s}function MM(n,t){return Ee(n.prev,n,t.prev)<0&&Ee(t.next,n,n.next)<0}function SM(n,t,e,i){let s=n;do s.z===0&&(s.z=Ac(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,bM(s)}function bM(n){let t,e,i,s,a,r,o,c,l=1;do{for(e=n,n=null,a=null,r=0;e;){for(r++,i=e,o=0,t=0;t<l&&(o++,i=i.nextZ,!!i);t++);for(c=l;o>0||c>0&&i;)o!==0&&(c===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,o--):(s=i,i=i.nextZ,c--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;e=i}a.nextZ=null,l*=2}while(r>1);return n}function Ac(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function EM(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function cs(n,t,e,i,s,a,r,o){return(s-r)*(t-o)>=(n-r)*(a-o)&&(n-r)*(i-o)>=(e-r)*(t-o)&&(e-r)*(a-o)>=(s-r)*(i-o)}function wM(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!AM(n,t)&&(js(n,t)&&js(t,n)&&TM(n,t)&&(Ee(n.prev,n,t.prev)||Ee(n,t.prev,t))||vr(n,t)&&Ee(n.prev,n,n.next)>0&&Ee(t.prev,t,t.next)>0)}function Ee(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function vr(n,t){return n.x===t.x&&n.y===t.y}function yu(n,t,e,i){const s=Ba(Ee(n,t,e)),a=Ba(Ee(n,t,i)),r=Ba(Ee(e,i,n)),o=Ba(Ee(e,i,t));return!!(s!==a&&r!==o||s===0&&Oa(n,e,t)||a===0&&Oa(n,i,t)||r===0&&Oa(e,n,i)||o===0&&Oa(e,t,i))}function Oa(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Ba(n){return n>0?1:n<0?-1:0}function AM(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&yu(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function js(n,t){return Ee(n.prev,n,n.next)<0?Ee(n,t,n.next)>=0&&Ee(n,n.prev,t)>=0:Ee(n,t,n.prev)<0||Ee(n,n.next,t)<0}function TM(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,a=(n.y+t.y)/2;do e.y>a!=e.next.y>a&&e.next.y!==e.y&&s<(e.next.x-e.x)*(a-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Mu(n,t){const e=new Tc(n.i,n.x,n.y),i=new Tc(t.i,t.x,t.y),s=n.next,a=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,a.next=i,i.prev=a,i}function sd(n,t,e,i){const s=new Tc(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Ks(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Tc(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function RM(n,t,e,i){let s=0;for(let a=t,r=e-i;a<e;a+=i)s+=(n[r]-n[a])*(n[a+1]+n[r+1]),r=a;return s}class Hs{static area(t){const e=t.length;let i=0;for(let s=e-1,a=0;a<e;s=a++)i+=t[s].x*t[a].y-t[a].x*t[s].y;return i*.5}static isClockWise(t){return Hs.area(t)<0}static triangulateShape(t,e){const i=[],s=[],a=[];ad(t),rd(i,t);let r=t.length;e.forEach(ad);for(let c=0;c<e.length;c++)s.push(r),r+=e[c].length,rd(i,e[c]);const o=uM.triangulate(i,s);for(let c=0;c<o.length;c+=3)a.push(o.slice(c,c+3));return a}}function ad(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function rd(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class rl extends al{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new rl(t.radius,t.detail)}}class Js extends Ue{constructor(t=.5,e=1,i=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:r},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let f=t;const d=(e-t)/s,u=new V,g=new zt;for(let v=0;v<=s;v++){for(let m=0;m<=i;m++){const p=a+m/i*r;u.x=f*Math.cos(p),u.y=f*Math.sin(p),c.push(u.x,u.y,u.z),l.push(0,0,1),g.x=(u.x/e+1)/2,g.y=(u.y/e+1)/2,h.push(g.x,g.y)}f+=d}for(let v=0;v<s;v++){const m=v*(i+1);for(let p=0;p<i;p++){const x=p+m,_=x,y=x+i+1,k=x+i+2,b=x+1;o.push(_,y,b),o.push(y,k,b)}}this.setIndex(o),this.setAttribute("position",new ue(c,3)),this.setAttribute("normal",new ue(l,3)),this.setAttribute("uv",new ue(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Js(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ol extends Ue{constructor(t=new vu([new zt(0,.5),new zt(-.5,-.5),new zt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],s=[],a=[],r=[];let o=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(i),this.setAttribute("position",new ue(s,3)),this.setAttribute("normal",new ue(a,3)),this.setAttribute("uv",new ue(r,2));function l(h){const f=s.length/3,d=h.extractPoints(e);let u=d.shape;const g=d.holes;Hs.isClockWise(u)===!1&&(u=u.reverse());for(let m=0,p=g.length;m<p;m++){const x=g[m];Hs.isClockWise(x)===!0&&(g[m]=x.reverse())}const v=Hs.triangulateShape(u,g);for(let m=0,p=g.length;m<p;m++){const x=g[m];u=u.concat(x)}for(let m=0,p=u.length;m<p;m++){const x=u[m];s.push(x.x,x.y,0),a.push(0,0,1),r.push(x.x,x.y)}for(let m=0,p=v.length;m<p;m++){const x=v[m],_=x[0]+f,y=x[1]+f,k=x[2]+f;i.push(_,y,k),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return CM(e,t)}static fromJSON(t,e){const i=[];for(let s=0,a=t.shapes.length;s<a;s++){const r=e[t.shapes[s]];i.push(r)}return new ol(i,t.curveSegments)}}function CM(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const s=n[e];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t}class _r extends Ue{constructor(t=1,e=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],o=[],c=[],l=[],h=new V,f=new V,d=new V;for(let u=0;u<=i;u++)for(let g=0;g<=s;g++){const v=g/s*a,m=u/i*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(v),f.y=(t+e*Math.cos(m))*Math.sin(v),f.z=e*Math.sin(m),o.push(f.x,f.y,f.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(f,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(u/i)}for(let u=1;u<=i;u++)for(let g=1;g<=s;g++){const v=(s+1)*u+g-1,m=(s+1)*(u-1)+g-1,p=(s+1)*(u-1)+g,x=(s+1)*u+g;r.push(v,m,x),r.push(m,p,x)}this.setIndex(r),this.setAttribute("position",new ue(o,3)),this.setAttribute("normal",new ue(c,3)),this.setAttribute("uv",new ue(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _r(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Qs extends Ui{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zd,this.normalScale=new zt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=Gc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Su extends Re{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Yt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class PM extends Su{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Yt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const _o=new ve,od=new V,cd=new V;class LM{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new zt(512,512),this.map=null,this.mapPass=null,this.matrix=new ve,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jc,this._frameExtents=new zt(1,1),this._viewportCount=1,this._viewports=[new Ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;od.setFromMatrixPosition(t.matrixWorld),e.position.copy(od),cd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(cd),e.updateMatrixWorld(),_o.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(_o),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(_o)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class DM extends LM{constructor(){super(new ru(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class IM extends Su{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.shadow=new DM}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const ld=new ve;class kM{constructor(t,e,i=0,s=1/0){this.ray=new jc(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new Kc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return ld.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ld),this}intersectObject(t,e=!0,i=[]){return Rc(t,this,i,e),i.sort(hd),i}intersectObjects(t,e=!0,i=[]){for(let s=0,a=t.length;s<a;s++)Rc(t[s],this,i,e);return i.sort(hd),i}}function hd(n,t){return n.distance-t.distance}function Rc(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,o=a.length;r<o;r++)Rc(a[r],t,e,!0)}}class UM extends fu{constructor(t=10,e=10,i=4473924,s=8947848){i=new Yt(i),s=new Yt(s);const a=e/2,r=t/e,o=t/2,c=[],l=[];for(let d=0,u=0,g=-o;d<=e;d++,g+=r){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);const v=d===a?i:s;v.toArray(l,u),u+=3,v.toArray(l,u),u+=3,v.toArray(l,u),u+=3,v.toArray(l,u),u+=3}const h=new Ue;h.setAttribute("position",new ue(c,3)),h.setAttribute("color",new ue(l,3));const f=new tl({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Hc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Hc);const FM={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function NM(n,t,e,i){const s=new yn(n.fov,i,.1,200),a=new V,r=new V,o=new V;let c=!1,l=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function d(){const u=(n.pitchDeg+h.pitchDelta)*Math.PI/180,g=n.yawDeg*Math.PI/180;o.set(Math.sin(g)*Math.cos(u),Math.sin(u),Math.cos(g)*Math.cos(u)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return d(),{camera:s,update(u,g,v,m,p=FM){const x=g+.6;if(!c)a.set(u,x,v),c=!0;else{const k=1-Math.exp(-Math.max(n.smoothing,.001)*m);a.x+=(u-a.x)*k,a.y+=(x-a.y)*k,a.z+=(v-a.z)*k}const _=1-Math.exp(-Math.max(t.smoothing,.001)*m);h.distanceScale+=(p.distanceScale-h.distanceScale)*_,h.offsetX+=(p.offsetX-h.offsetX)*_,h.offsetZ+=(p.offsetZ-h.offsetZ)*_,h.pitchDelta+=(p.pitchDelta-h.pitchDelta)*_;const y=1-Math.exp(-Math.max(e.smoothing,.001)*m);h.zoom+=(f-h.zoom)*y,d(),(s.fov!==l||s.fov!==n.fov)&&(s.fov=n.fov,l=n.fov,s.updateProjectionMatrix()),r.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},snap(u,g,v){a.set(u,g+.6,v),c=!0,r.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),d(),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},resize(u){s.aspect=u,s.updateProjectionMatrix()},getGroundBasis(){const u=new V().setFromMatrixColumn(s.matrixWorld,0),g=new V().setFromMatrixColumn(s.matrixWorld,2).negate(),v=Math.hypot(u.x,u.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:u.x/v,rightZ:u.z/v,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...h}}}}const Pi=Math.PI*2,Mn=1e-6;function cn(n,t,e){return n<t?t:n>e?e:n}function bu(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function zM(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Eu(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const s=zM(n);return i===1?s:e+(s-e)*i}function dd(n){return(1-Math.sin(n))/2}function cl(n,t,e){const i=Math.PI/180,s=cn(Number.isFinite(t)?t:100,0,180),a=cn(Number.isFinite(e)?e:132,0,180);if(a<=s)return n>=Math.cos(s*i)?1:0;const r=Math.cos(s*i),o=Math.cos(a*i);if(n>=r)return 1;const c=cn((r-n)/(r-o),0,1);return 1-c*c*(3-2*c)}function ll(n,t){if(!n.grounded||n.speed<Mn)return bu();const e=n.speed/Math.max(n.moveSpeed,Mn),i=Math.max(n.legLength,Mn),s=n.stride>Mn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,a=Math.min(t.maxAmp,s/i),r=i*Math.sin(Math.min(t.maxAmp,1.25)),o=Math.abs(n.localForward),c=Math.abs(n.localRight),l=o+c+Mn,h=cl(n.localForward/Math.max(n.speed,Mn),t.backStrafeStartDeg,t.backStrafeFullDeg),f=c/l*h,d=o/l+c/l*(1-h),u=n.localForward>=0?1:-1,g=n.localRight>=0?1:-1,v=s,m=B=>Math.asin(cn(B,-r,r)/i);function p(B,D){const L=Eu(B,t.plantLock),X=dd(B),H=u*d*v*L,q=-m(H),j=D*g>0?1:-1,ot=1+j*t.crossStep*.45,dt=g*j*t.crossStep*v*.4*X,xt=g*f*v*t.sideWeight*ot*L+dt*f,Y=m(xt),tt=t.kneeLift*X*a*(.55+.25*d+(j>0?.2*f:0));return{pitchX:q,rollZ:Y,kneeX:tt}}const x=(n.phase%Pi+Pi)%Pi,_=p(x,-1),y=p((x+Math.PI)%Pi,1),k=Math.cos(x),b=dd(x),A=-t.comSway*a*k*(.6*d+.8*f)-g*t.comSway*a*f*.45,T=t.comBob*b*a,w=g*t.hipLean*a*f*k*.6,M=g*t.hipLean*a*f*(.45+.25*k),P=t.armSwing*a*k*(d*u+.3*f),F=P,N=-P;return{legL:_,legR:y,pelvisX:A,pelvisY:T,pelvisRoll:w,sideLean:M,armL:F,armR:N,strafe:f,backward:u<0?d:0}}function wu(n){const t=(n%Pi+Pi)%Pi,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Au(n,t,e){const i=cn(e.progress,0,1);if(i>=1||n.speed<Mn)return bu();const s=i*i*(3-2*i),a=1-s;return ll({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:n.speed*a,stride:n.stride*a},t)}function Tu(n,t,e,i){const s=cn(n,-1,1),a=Math.abs(s),r=Math.min(1,t*(1+Math.max(0,i)*a*a));return cn(r*s,-1,1)*(e*Math.PI/180)}function Ru(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const a=Math.atan2(t,n)*180/Math.PI;if(Math.abs(a)<=90)return e;const o=(a-Math.sign(a)*180)*Math.PI/180,c=cn(i,0,1),l=c*c;return e*l+o*(1-l)}function Cu(n,t,e,i,s){const a=Math.max(e,Mn),r=Math.max(0,i)*a,o=Math.max(0,s)*a,c=t>Mn?(t-n)/t:0,l=c>.02,h=c<-.015,f=n<=r*.15,d=!h&&n<o&&(l||f);return{enter:n>Mn&&n<=r&&l,resume:!d}}function Pu(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return cn(n*cn(t,0,2),-i,i)}function Lu(n,t,e){const i=Math.sin(n),s=Math.cos(n),a=Math.cos(n),r=-Math.sin(n);return{forward:t*i+e*s,right:t*a+e*r}}function Du(n,t,e){const i=cn(n,0,1),s=i*i*(3-2*i);return e?t==="inStop"?1-s:1:t==="afterStop"?1-s:0}function OM(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const s=cn(n,0,1),a=Math.sin(Math.PI*s),r=a*a;if(r<=1e-9)return i();const o=t>=0,c=o?1:.35,l=o?.35:1,h=Math.max(0,e.turnStepPitch)*r,f=Math.max(0,e.turnStepKnee)*r,d=Math.max(0,e.turnStepPitch)*.35*r,u=o?1:-1;return{legL:{pitchX:-h*c,rollZ:u*d*c,kneeX:f*c},legR:{pitchX:-h*l,rollZ:-u*d*l,kneeX:f*l},pelvisY:-Math.max(0,e.turnStepDip)*r,env:r}}function Iu(n,t,e,i,s){const a=cn(n,0,1),r=cn(s.stopPeakRatio,.05,.95),o=a<=r?a/r:(a-r)/(1-r),c=o*o*(3-2*o),l=a<=r?c:1-c,h=Math.hypot(e,i),f=h>Mn?e/h:1,d=h>Mn?i/h:0,u=Eu(t,1)>0;return{leadPitch:Math.max(0,s.stopStepPitch)*l,trailPitch:Math.max(0,s.stopTrailPitch)*l,leadKnee:Math.max(0,s.stopStepKnee)*l,bodyShift:Math.max(0,s.stopBodyShift)*l,bodyDip:Math.max(0,s.stopBodyDip)*l,chestPitch:Math.max(0,s.stopChestPitch)*l,leadLeft:u,fwdN:f,rightN:d,env:l}}function Je(n){return n<0?0:n>1?1:n}const qa=Math.PI*2;function BM(n){return((n+Math.PI)%qa+qa)%qa-Math.PI}function HM(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function GM(n,t,e,i,s,a=n.phase){const r=Je(i);if(r<=0)return n;const o=Je(t),c=Math.max(1,Math.round(s.cycles)),l=Math.max(0,s.strideSpeed),h=e%2===0?1:-1,f=Je(s.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,s.strideScale??0)*d,g=o<=.5?o*2:(o-.5)*2,v=g*g*(3-2*g),m=o<=.5?v:1-v,p={speed:l,phase:a+qa*c/2*m,localForward:l*f,localRight:l*(1-f)*h},x=BM(p.phase-n.phase),_=r*r*(3-2*r),y=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*r,phase:n.phase+x*_,localForward:n.localForward+(p.localForward-n.localForward)*r,localRight:n.localRight+(p.localRight-n.localRight)*r,stride:y+(u-y)*r*r}}function VM(n,t,e){const i=HM(),s=Je(n),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return i;const r=t%2===0?1:-1,o=r<0,c=r>0,l=e.stepPitch*a,h=e.stepKnee*a,f=e.stepSide*a;return i.legL.pitchX=o?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=o?h:h*.4,i.legR.kneeX=c?h:h*.4,i.legL.rollZ=-f*r,i.legR.rollZ=f*r,i.pelvisX=e.stepSway*a*r,i.pelvisY=-e.stepDip*a,i.pelvisRoll=f*.25*r,i}function ku(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function ud(n,t,e,i,s){if(e<=0||i<=0)return 0;const a=(n-t)/e;return a<0||a>=1?0:i*ku(a,s)}function XM(n,t,e,i){const s=t?1:0,a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),r=n+(s-n)*a;return t&&r>.999?1:!t&&r<.001?0:r}function WM(n,t,e){const i=Je(n);return{gaitScale:1-i*(1-Je(t)),attackLegWeight:Je(e)*i}}function $M(n,t){const e=Je(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function YM(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Je(t.minScale+(1-t.minScale)*e)}function ZM(){return Uu()}function Uu(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function qM(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function jM(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Je(t.forceHitHeight):n.type==="light"?Je(t.hitHeight.light):n.type==="heavy"?Je(t.hitHeight.heavy):n.type==="knock"?Je(t.hitHeight.knock):0}function KM(n,t,e){const i=Je(e),s=(a,r)=>a+(r-a)*i;return{upperPitch:s(n.upperPitch,t.upperPitch),upperRoll:s(n.upperRoll,t.upperRoll),upperYaw:s(n.upperYaw,t.upperYaw),fold:s(n.fold,t.fold),shift:s(n.shift,t.shift),drop:s(n.drop,t.drop),back:s(n.back,t.back),knee:s(n.knee,t.knee),hip:s(n.hip,t.hip),arm:s(n.arm,t.arm)}}function Fu(n,t,e){const i=Uu(),s=qM(n,e);if(i.intensity=s,s<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const a=Je(1-n.timer/n.duration),r=ku(a,e.pulseRatio);i.pulse=r,i.active=r>0,i.hitHeight=jM(n,e);const o=Math.sin(t),c=Math.cos(t),l=Math.cos(t),h=-Math.sin(t),f=n.dirX*o+n.dirZ*c,d=n.dirX*l+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const v=Math.sin(Math.PI*a);return i.upperPitch=s*v*f,i.upperRoll=-s*v*d*.7,i.drop=(s>.5?.09:.04)*v,i.flash=e.flashStrength*v,i.active=v>0,i}const u=s*r,g=KM(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(g.upperPitch*f+g.fold),i.upperRoll=-u*g.upperRoll*d,i.upperYaw=u*g.upperYaw*d,i.upperShift=u*g.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*g.back,i.drop=u*g.drop,i.knee=u*g.knee,i.hip=u*g.hip,i.arm=u*g.arm,i.flash=e.flashStrength*r,i}function Nu(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),s=Number.isFinite(n.leanForward)?n.leanForward:0,a=Number.isFinite(n.leanSide)?n.leanSide:0,r=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*i,pelvisZ:s*i,crouch:Math.max(0,t.moveCrouch)*r}}const _i=1e-6;function Gs(n,t,e){return n<t?t:n>e?e:n}function JM(n,t,e,i=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=_i||a<=_i||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const o=s+a,c=Math.abs(s-a)+_i,l=Math.hypot(n.x,n.y,n.z);if(l<=_i)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),g=Gs(u,c,o),v=u>o+_i||u<c-_i,m=Math.atan2(-d,Math.max(f,_i)),p=Gs((s*s+g*g-a*a)/(2*s*g),-1,1),x=Gs((a*a+g*g-s*s)/(2*a*g),-1,1),_=Math.acos(p),y=Math.acos(x),k=i>=0?1:-1;return{rootPitch:m-k*_,rootRoll:h,jointPitch:k*(_+y),clamped:v,reach:l/o}}function QM(n,t,e,i){const s=Gs(e,0,1),a=Math.max(0,i),r=(o,c)=>{const l=Gs((c-o)*s,-a,a);return o+l};return{rootPitch:r(n.rootPitch,t.rootPitch),rootRoll:r(n.rootRoll,t.rootRoll),jointPitch:r(n.jointPitch,t.jointPitch)}}function zu(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const hl={active:!1,weight:0,clamped:0,maxError:0};function Ou(n){const{root:t,pelvis:e,lower:i,limbs:s,base:a,cfg:r}=n;if(!r.enabled||r.weight<=0||!n.grounded||s.length===0)return{...hl};const o={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,i.position.copy(a.lowerPos),i.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(u=>u.tip.getWorldPosition(new V));e.position.copy(o.pelvisPos),e.rotation.x=o.pelvisRotX,e.rotation.z=o.pelvisRotZ,i.position.copy(o.lowerPos),i.rotation.z=o.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,r.weight))*(n.attacking?Math.max(0,Math.min(1,r.attackScale)):1),h=Math.max(0,r.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<s.length;u++){const g=s[u],v=i.worldToLocal(c[u].clone()),m={x:v.x-g.root.position.x,y:v.y-g.root.position.y,z:v.z-g.root.position.z},p=JM(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(f+=1);const x=QM({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,l,h);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<s.length;u++){const g=s[u].tip.getWorldPosition(new V);d=Math.max(d,g.distanceTo(c[u]))}return{active:!0,weight:l,clamped:f,maxError:d}}function mn(n,t,e){return n<t?t:n>e?e:n}function tS(n,t,e,i,s,a,r,o,c,l){const h=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new xe,d=new xe;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new xe;u.name="lower";const g=new xe;g.name="upper",d.add(u),d.add(g);const v=[],m=(Q,pt,Gt,nt)=>{const Mt=new Qs({color:nt}),O=new ne(new Ln(Q,pt,Gt),Mt);return O.castShadow=!0,O.receiveShadow=!0,v.push(Mt),O},p=n.headSize,x=n.legLength,_=n.armLength,y=n.limbThickness,k=n.bodyHeight,b=n.bodyWidth,A=m(b,k,.28,e);A.position.y=k/2,g.add(A);const T=new xe;T.name="headPivot",T.position.y=k,g.add(T);const w=m(p,p,p,e);w.position.y=p/2,T.add(w);for(const Q of[-1,1]){const pt=m(.06,.07,.02,t.shoe);pt.position.set(Q*.09,p/2+.03,p/2+.011),T.add(pt)}const M=(Q,pt)=>{const Gt=pt?_:x,nt=new xe;nt.name=pt?Q<0?"shoulderL":"shoulderR":Q<0?"hipL":"hipR",pt||(nt.rotation.order="ZYX"),nt.position.set(Q*(pt?b/2+y/2:b/2-y/2),pt?k-.04:0,0),(pt?g:u).add(nt);const Mt=m(y,Gt/2,y,t.limb);Mt.position.y=-Gt/4,nt.add(Mt);const O=new xe;O.name=pt?"elbow":"knee",O.position.y=-Gt/2,nt.add(O);const it=m(y,Gt/2,y,t.limb);if(it.position.y=-Gt/4,O.add(it),!pt){const ht=m(y*1.15,.07,y*1.7,t.shoe);ht.position.set(0,-Gt/2+.035,.045),O.add(ht);const Nt=new Re;return Nt.name="footTip",Nt.position.y=-Gt/2,O.add(Nt),{root:nt,joint:O,tip:Nt}}return{root:nt,joint:O}},P=M(-1,!1),F=M(1,!1),N=M(-1,!0),B=M(1,!0),D=[P,F].map(Q=>({root:Q.root,joint:Q.joint,tip:Q.tip,upperLen:x/2,lowerLen:x/2,bend:1})),L=new He({color:s.attackArcColor,transparent:!0,opacity:0,side:we,depthWrite:!1}),X=new ne(new _r(.62,.042,6,20,Math.PI*1.1),L);X.position.set(0,.78-x,.56),g.add(X);const H=new Yt(e),q=new Yt(o.flashColor),j=new Yt;let ot=null,dt=0,xt=0,Y=0,tt=0,ut=0,K=0,ft=0,It={...hl},Ct=-1,vt=0,At=0,wt=0,G=0,jt=0,kt=0,Ut=0,Tt=1,St=0,Pt=0,I="none",E=0,W=!1,st=-1,ct=!1,at=0,Ft=0;return{group:f,update(Q,pt){f.position.set(Q.position.x,Q.position.y,Q.position.z),f.rotation.y=Q.bodyYaw,T.rotation.y=(Q.headYaw-Q.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,Q.mode!==ot&&(ot=Q.mode,dt=1),dt=Math.max(0,dt-pt*2.2);const Gt=Q.hurt,nt=Fu(Gt,Q.bodyYaw,o),Mt=nt.flash;j.copy(q).multiplyScalar(Mt);for(const bt of v)bt.emissive.copy(H).multiplyScalar(dt*.5),Mt>0&&bt.emissive.add(j);d.position.set(0,x,0),d.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const O=Math.hypot(Q.velocity.x,Q.velocity.z),it=mn(r.knockGaitScale??0,0,1),ht=Q.hurt.knockX*it,Nt=Q.hurt.knockZ*it,Ot=it>0&&Math.hypot(Q.hurt.knockX,Q.hurt.knockZ)>.001,Xt=Q.velocity.x+ht,z=Q.velocity.z+Nt,_t=Math.hypot(Xt,z),J=Math.cos(Q.bodyYaw),rt=-Math.sin(Q.bodyYaw),gt=O>1e-6?mn((Q.velocity.x*J+Q.velocity.z*rt)/O,-1,1):0,yt=O>1e-6?mn((Q.velocity.x*Math.sin(Q.bodyYaw)+Q.velocity.z*Math.cos(Q.bodyYaw))/O,-1,1):1,Ht=cl(yt,r.backStrafeStartDeg,r.backStrafeFullDeg);I==="settled"&&ct&&at>Ft*1.02+1e-4&&(I="none");let Zt=1;I==="blend"?(Zt=Du(W?st:E,r.stopYawBlendMode,W),W||(E=Math.min(1,E+pt/Math.max(.01,r.stopYawAfterSec)),(E>=1||r.stopYawBlendMode==="inStop"||ct)&&(I="settled",Zt=0))):I==="settled"&&(Zt=mn(O/Math.max(1e-6,r.stopEnterRatio*a),0,1));const ie=Tu(gt,r.strafeHipScale,r.strafeHipMaxDeg,r.strafeHipBoost),$t=Ru(yt,gt,ie,Ht)*Zt;St+=($t-St)*(1-Math.exp(-12*Math.max(0,pt))),u.rotation.y=St;const ce=Q.bodyYaw+St,pe=Math.sin(ce),Fe=Math.cos(ce),Te=Math.cos(ce),le=-Math.sin(ce),de=Xt*pe+z*Fe,Me=Xt*Te+z*le,en=Math.max(0,r.stopBlendSec||0),Ge=en>0&&!Ot,Ze=Cu(O,Pt,a,r.stopEnterRatio,r.stopExitRatio);if(!Ge||Ze.resume)Ct=-1;else if(Ct<0&&Ze.enter){Ct=0,vt=Q.gaitPhase,At=wu(Q.gaitPhase),wt=O,G=Math.max(Q.stride,1e-6),jt=de,kt=Me;const bt=1/Math.max(1e-6,O);Ut=Q.velocity.x*bt,Tt=Q.velocity.z*bt}const Ne=Pt;Pt=O;const ze=Ge&&Ct>=0;ze&&(Ct=Math.min(1,Ct+pt/en)),ze&&I!=="blend"&&(I="blend",E=0),W=ze&&Ct<1,st=Ct,ct=Ze.resume,at=O,Ft=Ne;const ln=ze?{phase:vt,speed:wt,moveSpeed:a,localForward:jt,localRight:kt,legLength:n.legLength,stride:G,grounded:!0}:{phase:Q.gaitPhase,speed:_t,moveSpeed:a,localForward:de,localRight:Me,legLength:n.legLength,stride:Q.stride,grounded:!0},me=ze?Au(ln,r,{progress:Ct,phase0:vt,phaseEnd:At}):ll(ln,r);let Le=0,bn=0,R=0,$=0;if(ze){const bt=Lu(Q.bodyYaw,Ut,Tt),Rt=Iu(Ct,vt,bt.forward,bt.right,r);Rt.leadLeft?(me.legL.pitchX-=Rt.leadPitch,me.legL.kneeX+=Rt.leadKnee,me.legR.pitchX+=Rt.trailPitch):(me.legR.pitchX-=Rt.leadPitch,me.legR.kneeX+=Rt.leadKnee,me.legL.pitchX+=Rt.trailPitch),bn=Rt.bodyShift*Rt.fwdN,Le=Rt.bodyShift*Rt.rightN,R=Rt.bodyDip,$=Rt.chestPitch}P.root.rotation.x=me.legL.pitchX,F.root.rotation.x=me.legR.pitchX,P.root.rotation.z=me.legL.rollZ,F.root.rotation.z=me.legR.rollZ,P.joint.rotation.x=me.legL.kneeX,F.joint.rotation.x=me.legR.kneeX,N.root.rotation.x=me.armL,B.root.rotation.x=me.armR,N.joint.rotation.x=-.18,B.joint.rotation.x=-.18,d.position.x=me.pelvisX,d.position.y=x+me.pelvisY,d.position.z=0,d.rotation.z=me.pelvisRoll,g.rotation.z=me.sideLean*(nt.intensity>0?.4:1);const S=zu(d,u),U=ze&&h.enabled?{...h,weight:1}:h,C=U.enabled&&U.weight>0?mn(U.weight,0,1):0;if(d.position.x+=Le,d.position.z+=bn,d.position.y-=R,u.position.y+=R,C<=0&&(u.position.x-=Le,u.position.z-=bn),c){const bt=Math.max(.004166666666666667,Math.min(pt,.1)),Rt=Math.sin(Q.bodyYaw),Lt=Math.cos(Q.bodyYaw),Wt=mn((Q.velocity.x-xt)/bt,-60,60),qt=mn((Q.velocity.z-Y)/bt,-60,60),te=Wt*Rt+qt*Lt,_e=Ye(Q.bodyYaw-tt)/bt,Kt=c.maxForwardDeg*Math.PI/180,Bt=c.maxSideDeg*Math.PI/180,Se=1-Math.exp(-Math.max(0,c.smoothing)*bt);ut+=(mn(te*c.accelGain,-Kt,Kt)-ut)*Se,K+=(mn(-_e*O*c.turnGain,-Bt,Bt)-K)*Se;const ee=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;ft+=(mn(O/Math.max(a,1e-6),0,1)-ft)*(1-Math.exp(-Math.max(0,ee)*bt));const Et=Nu({leanForward:ut,leanSide:K,speedRatio:ft},c);g.rotation.x+=ut+$,g.rotation.z+=K,d.rotation.x+=Et.pelvisPitch,d.rotation.z+=Et.pelvisRoll,d.position.x+=Et.pelvisX,d.position.z+=Et.pelvisZ,d.position.y-=Et.crouch,u.position.y+=Et.crouch*(1-C)}xt=Q.velocity.x,Y=Q.velocity.z,tt=Q.bodyYaw,g.rotation.x+=nt.upperPitch,g.rotation.z+=nt.upperRoll,g.rotation.y+=nt.upperYaw;const Z=mn(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),et=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=mn(nt.upperShiftX*Z,-et,et),g.position.z+=mn(nt.upperShiftZ*Z,-et,et),d.position.x+=nt.comX,d.position.z+=nt.comZ-nt.pelvisBack,d.position.y-=nt.drop;const lt=nt.legacy?0:Math.max(0,Math.min(1,o.lowerScale));if(u.position.z+=nt.pelvisBack*(1-lt),u.position.y+=nt.drop*(1-lt),P.joint.rotation.x+=nt.knee,F.joint.rotation.x+=nt.knee,P.root.rotation.x-=nt.hip,F.root.rotation.x-=nt.hip,N.root.rotation.x+=nt.arm,B.root.rotation.x+=nt.arm*.8,Q.attackPhase!=="idle"&&nt.intensity===0){const bt=Q.attackProgress,Rt=bt<.34?-1:bt<.68?-1+(bt-.34)/.34*2:Math.max(0,1-(bt-.68)/.32),Lt=Math.max(0,-Rt),Wt=Math.max(0,Rt);B.root.rotation.x=-1.7*Lt+1.25*Wt,B.joint.rotation.x=-(.25+Lt*.45),g.rotation.y=-.28*Rt,L.opacity=Q.attackPhase==="active"?.85:0,Q.attackPhase==="active"&&(X.rotation.z=-1.1+bt*3)}else L.opacity=0;const mt=Pu(St,r.chestYawScale,r.chestYawMaxDeg);g.rotation.y+=mt,T.rotation.y=(Q.headYaw-Q.bodyYaw-mt+Math.PI*3)%(Math.PI*2)-Math.PI,It=Ou({root:f,pelvis:d,lower:u,limbs:D,base:S,cfg:U,grounded:!0,attacking:Q.attackPhase!=="idle"})},ik(){return It},dispose(){f.traverse(Q=>{if(Q instanceof ne){Q.geometry.dispose();const pt=Q.material;Array.isArray(pt)?pt.forEach(Gt=>Gt.dispose()):pt.dispose()}})}}}const yi=.012,Mi=.016;function eS(n,t){const e=t.lab,i=new xe;i.name="test-lab";const s=[],a=[],r=[],o=[];function c(x){return r.push(x),x}function l(x){return o.push(x),x}function h(x,_,y,k=yi){const b=c(new He({color:_,transparent:!0,opacity:y,depthWrite:!1,side:we,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),A=new ne(x,b);return A.rotation.x=-Math.PI/2,A.position.y=k,A.renderOrder=2,A}function f(x,_){return l(new Js(Math.max(x,.001),_,72))}function d(x,_,y,k=Mi){const A=document.createElement("canvas"),T=A.getContext("2d");if(!T)return new ne;const w='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';T.font=w,A.width=nh.ceilPowerOfTwo(Math.ceil(T.measureText(x).width)+32),A.height=nh.ceilPowerOfTwo(96*1.4);const M=A.getContext("2d");if(!M)return new ne;M.font=w,M.textAlign="center",M.textBaseline="middle",M.fillStyle=y,M.fillText(x,A.width/2,A.height/2);const P=new wc(A);P.colorSpace=Ke,a.push(P);const F=A.width/A.height,N=l(new _n(_*F,_)),B=c(new He({map:P,transparent:!0,depthWrite:!1,side:we,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),D=new ne(N,B);return D.rotation.x=-Math.PI/2,D.position.y=k,D.renderOrder=3,D}function u(x,_,y,k,b,A){const T=y-_,w=l(new _n(T,k)),M=h(w,b,A,yi);M.position.set(T/2+_,yi,0);const P=new xe;return P.add(M),P.rotation.y=x-Math.PI/2,P}function g(x,_,y,k,b){const A=new vu;A.moveTo(0,_*.5),A.lineTo(-y*.5,_*.5-y*.9),A.lineTo(-y*.18,_*.5-y*.9),A.lineTo(-y*.18,-_*.5),A.lineTo(y*.18,-_*.5),A.lineTo(y*.18,_*.5-y*.9),A.lineTo(y*.5,_*.5-y*.9),A.closePath();const T=l(new ol(A)),w=h(T,k,b,yi+.002),M=new xe;return M.add(w),M.rotation.y=x+Math.PI,M}function v(x){var T;const _=new xe,y=d(`${x.index} · ${x.name}`,t.lab.labelTextHeight,"#eaf4ff"),b=((T=y.geometry.parameters)==null?void 0:T.width)??3;_.add(y);const A=h(l(new _n(b*.98,.08)),x.color,.7,Mi);return A.position.set(0,Mi,t.lab.labelTextHeight*.66),_.add(A),_.position.set(x.labelX,0,x.labelZ),_}const m=new xe;for(const x of n??[]){const _=new xe;if(_.position.set(x.x,0,x.z),x.shape==="square"){const y=x.radius,k=h(l(new _n(y*2,y*2)),x.color,e.padOpacity*.09);_.add(k);const b=.07,A=[[0,y,y*2+b,b],[0,-y,y*2+b,b],[-y,0,b,y*2+b],[y,0,b,y*2+b]];for(const[T,w,M,P]of A){const F=h(l(new _n(M,P)),x.color,e.padOpacity);F.position.x=T,F.position.z=w,_.add(F)}}else _.add(h(l(new il(x.radius,72)),x.color,e.padOpacity*.075)),_.add(h(f(x.radius-.075,x.radius),x.color,e.padOpacity));if(x.id==="hub"){for(let y=0;y<4;y++){const k=y*Math.PI/4,b=y%2===0;for(const A of[0,Math.PI])_.add(u(k+A,x.radius*.12,x.radius*.94,b?.09:.055,x.color,b?.5:.32))}_.add(h(f(.5,.56),x.color,.4))}else if(x.id==="dash"){const y=x.spawnZ-x.z,k=-x.radius+.5,b=y-k,A=h(l(new _n(.06,b)),x.color,.36);A.position.set(0,yi,(y+k)/2),_.add(A);let T=0;for(let M=y;M>=k-.01;M-=1,T++){const P=T%5===0,F=h(l(new _n(P?2.4:1.3,P?.1:.07)),x.color,P?.72:.42);F.position.set(0,yi,M),_.add(F);const N=d(String(T),.52,P?"#eaf4ff":"rgba(200,225,245,0.8)");N.position.set(1.6,Mi,M),_.add(N)}const w=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,P]of w){const F=y-M,N=h(l(new _n(1.9,.09)),"#ffffff",.5);N.position.set(-1.5,yi,F),_.add(N);const B=d(P,.42,"rgba(220, 236, 250, 0.86)");B.position.set(-3,Mi,F),_.add(B)}}else if(x.id==="gait"){_.add(h(f(1.44,1.5),x.color,.5)),_.add(h(f(1.14,1.2),x.color,.22));const y=1.55,k=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[b,A,T]of k){const M=Math.sin(b),P=Math.cos(b),F=g(b,1.7,.34,T,.75);F.position.set(M*1.7*.5,0,y+P*1.7*.5),_.add(F);const N=d(A,.44,T);N.position.set(M*(1.7+.7),Mi,y+P*(1.7+.7)),_.add(N)}}if(m.add(_),e.showLabels){const y=v(x);s.push(y),m.add(y)}}i.add(m);const p=n==null?void 0:n.find(x=>x.id==="hub");if(p&&e.showLabels){const x=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[_,y,k]of x){const b=d(k,.4,"rgba(190, 224, 248, 0.8)");b.position.set(p.x+_*(p.radius+.7),Mi,p.z+y*(p.radius+.7)),i.add(b),s.push(b)}}return i.visible=e.enabled,{group:i,setVisible(x){i.visible=x},setLabelsVisible(x){for(const _ of s)_.visible=x},dispose(){for(const x of o)x.dispose();for(const x of r)x.dispose();for(const x of a)x.dispose();i.clear()}}}const dl=64,Bu=[0,.24,.76,1],nS=[0,1,1,0],Hu=[0,.12,.28,.5,.72,.88,1],iS=[0,.16,.5,1,.5,.16,0];function fd(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function ul(n,t,e,i,s=dl,a="band"){const r=Math.max(.001,n-t*.5),o=Math.max(r+.001,n+t*.5),c=a==="glow"?Hu:Bu,l=a==="glow"?iS:nS,h=c.length,f=s+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),g=[];for(let m=0;m<f;m++){const p=m/s,x=(p-.5)*e,_=fd(p,i)*fd(1-p,i),y=Math.sin(x),k=Math.cos(x);for(let b=0;b<h;b++){const A=r+(o-r)*c[b],T=m*h+b;d[T*3]=y*A,d[T*3+1]=0,d[T*3+2]=k*A;const w=_*l[b];u[T*4]=1,u[T*4+1]=1,u[T*4+2]=1,u[T*4+3]=w}}for(let m=0;m<s;m++)for(let p=0;p<h-1;p++){const x=m*h+p,_=x+h;g.push(x,_,x+1,x+1,_,_+1)}const v=new Ue;return v.setAttribute("position",new tn(d,3)),v.setAttribute("color",new tn(u,4)),v.setIndex(g),v.computeBoundingSphere(),v}function yo(n){const t=new He({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:we,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const s=(c,l)=>{const h=Math.round(c*32)/32,f=Math.max(.05,Math.round(l*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const g=ul(n.radius,n.thickness*f,h,n.edgeFade,dl,n.profile??"band");if(e.set(d,g),e.size>64){for(const[v,m]of e)if(v!==d&&m!==i){m.dispose(),e.delete(v);break}}return g};i=s(n.arcRad,1);const a=new ne(i,t);a.position.y=n.y,a.renderOrder=n.renderOrder??4;let r=n.arcRad,o=1;return{mesh:a,update(c,l,h,f,d,u=1){const g=Math.max(.05,u);(Math.abs(c-r)>.01||Math.abs(g-o)>.01)&&(i=s(c,g),a.geometry=i,r=c,o=g),t.opacity=l,t.color.copy(f),a.scale.set(h,1,h),a.rotation.y=d,a.visible=l>.002},arcRad(){return r},dispose(){for(const c of e.values())c.dispose();e.clear(),t.dispose()}}}function pd(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function sS(n,t,e,i,s){const a=s.arcDeg*Math.PI/180,r=s.playerOpacity;if(!n)return{arcRad:a,opacity:r,scale:1,level:0};const o=Math.min(1,Math.max(0,t)),c=Math.min(1,Math.max(0,e)),l=s.selectedArcDeg*Math.PI/180,h=a+(l-a)*(.35+.65*o),f=4+4*o+6*c,d=.5+.5*Math.sin(i*f),u=Math.min(.95,r+(.2+.1*c)*o+.04*d),g=1+.02*o+.012*d*o;return{arcRad:h,opacity:u,scale:g,level:o}}function aS(n,t,e,i,s){const a=Math.min(1,Math.max(0,s));return a<=.001?n.copy(t):a<.5?n.copy(t).lerp(e,a*2):n.copy(e).lerp(i,(a-.5)*2)}function rS(n=64,t=.06,e=5){const i=n+1,s=e+1,a=new Float32Array(i*s*3),r=new Float32Array(i*s*4),o=[];for(let l=0;l<i;l++){const h=l/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<s;u++){const g=u/e,v=t+(1-t)*g,m=l*s+u;a[m*3]=f*v,a[m*3+1]=0,a[m*3+2]=d*v;const p=Math.pow(1-g,1.8)*.9+(u===0?.1:0);r[m*4]=1,r[m*4+1]=1,r[m*4+2]=1,r[m*4+3]=Math.min(1,p)}}for(let l=0;l<n;l++)for(let h=0;h<e;h++){const f=l*s+h,d=f+s;o.push(f,d,f+1,f+1,d,d+1)}const c=new Ue;return c.setAttribute("position",new tn(a,3)),c.setAttribute("color",new tn(r,4)),c.setIndex(o),c.computeBoundingSphere(),c}function md(n){const t=n.segments??dl,e=n.profile??"band",s=((e==="glow"?Hu.length:Bu.length)-1)*6,a=ul(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),r=new He({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:we,vertexColors:!0,toneMapped:!1}),o=new ne(a,r);o.position.y=n.y,o.renderOrder=n.renderOrder??7,o.visible=!1,a.setDrawRange(0,0);let c=0;return{mesh:o,set(l,h,f,d,u=1){const g=Math.min(1,Math.max(0,l)),v=Math.round(g*t),m=g>.001?Math.max(1,v)*s:0;m!==a.drawRange.count&&a.setDrawRange(0,m),c=v,r.opacity=h,r.color.copy(f),o.scale.set(u,1,u),o.rotation.y=d,o.visible=h>.002&&g>.001},ratio(){return t>0?c/t:0},filledSegments(){return c},dispose(){a.dispose(),r.dispose()}}}function gd(n){const t=new xe,e=rS(48),i=new He({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:we,vertexColors:!0,toneMapped:!1}),s=new ne(e,i);s.renderOrder=n.renderOrder??2,t.add(s);const a=Math.max(.01,n.edgeWidthRatio??.045),r=ul(1-a*.5,a,Math.PI*2,0,64,"band"),o=new He({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:we,vertexColors:!0,toneMapped:!1}),c=new ne(r,o);return c.renderOrder=(n.renderOrder??2)+1,t.add(c),t.position.y=n.y,{group:t,set(l,h,f,d,u,g){const v=Math.min(1,Math.max(0,u));t.position.set(l,f,h),s.scale.set(d,1,d),c.scale.set(d,1,d),i.opacity=v*.26,o.opacity=v*(.72+.18*Math.sin(g*7)),t.visible=v>.004},dispose(){e.dispose(),i.dispose(),r.dispose(),o.dispose()}}}function xd(n,t,e,i){if(i<=1e-4||e<=0)return t;const s=1-Math.exp(-e/i);return n+(t-n)*s}function oS(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),s=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:s,urgency:.35+.65*s}}function cS(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){const t=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/t))}}return n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function lS(n,t,e,i,s,a){return n!=="windup"||s<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*s,z:e+Math.cos(i)*s,radius:Math.max(.3,a)}}function hS(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function dS(n,t,e){return n?t:e}function Gu(n){return{x:0,y:0,z:1}}function uS(n){return Math.asin(Gu().y)}function fS(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}function pS(n,t,e,i,s,a){return{x:n+Math.sin(i)*s,y:t+a,z:e+Math.cos(i)*s}}function mS(n,t,e){return{x:n.x+Math.sin(t)*e,y:n.y,z:n.z+Math.cos(t)*e}}function gS(n,t,e){if(n<0)return 1;const i=t-Math.max(1e-6,e);return n<=i?1:n>=t?0:(t-n)/(t-i)}function Be(n,t,e){return n<t?t:n>e?e:n}const rs=1e-6;function be(n,t,e,i){const s=new ne(new Ln(n,t,e),new Qs({color:i}));return s.castShadow=!0,s.receiveShadow=!0,s}function De(){return new xe}function ja(n,t,e){const i=De(),s=be(t*.7,.12,t*.7,e.wood);s.position.y=.06,i.add(s);const a=be(t*2.4,.045,t*.8,e.metal);a.position.y=.13,i.add(a);const r=be(t*.38,n,t,e.blade);r.position.y=.13+n/2,i.add(r);const o=be(t*.42,n*.96,t*.2,e.bladeEdge);o.position.set(0,.13+n/2,t*.5),i.add(o);const c=be(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function xS(n){const t=ja(.72,.15,n),e=be(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function vS(n){const t=De(),e=be(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=be(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function _S(n){const t=De(),e=be(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=be(.15,.15,.15,n.glow);i.position.y=.92;const s=i.material;return s.emissive=new Yt(n.glow),s.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function yS(n){const t=De();for(let i=0;i<5;i++){const s=(i-2)*.15,a=be(.055,.16,.05,n.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=be(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function MS(n){const t=De(),e=be(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=be(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function SS(n,t,e,i,s,a,r,o,c,l,h){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},d=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},u=De(),g=De();g.name="pelvis",g.position.y=n.legLength,u.add(g);const v=De();v.name="lower";const m=De();m.name="upper",g.add(v),g.add(m);const p=n.headSize,x=n.legLength,_=n.armLength,y=n.limbThickness,k=n.bodyHeight,b=n.bodyWidth,A=be(b,k,.28,t.body);A.position.y=k/2,m.add(A);const T=De();T.name="headPivot",T.position.y=i.headPivotHeight,m.add(T);const w=be(p,p,p,t.head);w.position.y=p/2,T.add(w);const M=new Qs({color:"#1b2733"});for(const S of[-1,1]){const U=new ne(new Ln(.06,.07,.02),M);U.position.set(S*.09,p/2+.03,p/2+.011),T.add(U)}const P=S=>{const U=De();U.name=S<0?"hipL":"hipR",U.rotation.order="ZYX",U.position.set(S*(b/2-y/2),0,0),v.add(U);const C=be(y,x/2,y,t.limb);C.position.y=-x/4,U.add(C);const Z=De();Z.name="knee",Z.position.y=-x/2,U.add(Z);const et=be(y,x/2,y,t.limb);et.position.y=-x/4,Z.add(et);const lt=be(y*1.15,.07,y*1.7,t.shoe);lt.position.set(0,-x/2+.035,.045),Z.add(lt);const mt=new Re;return mt.name="footTip",mt.position.y=-x/2,Z.add(mt),{root:U,joint:Z,hand:De(),tip:mt}},F=S=>{const U=De();U.name=S<0?"shoulderL":"shoulderR",U.position.set(S*(b/2+y/2),k-.04,0),m.add(U);const C=be(y,_/2,y,t.limb);C.position.y=-_/4,U.add(C);const Z=De();Z.name="elbow",Z.position.y=-_/2,U.add(Z);const et=be(y,_/2,y,t.limb);et.position.y=-_/4,Z.add(et);const lt=De();lt.position.y=-_/2,Z.add(lt);const mt=be(y*1.1,.09,y*1.1,t.head);return mt.position.y=.045,lt.add(mt),{root:U,joint:Z,hand:lt}},N=P(-1),B=P(1),D=F(-1),L=F(1),X=[N,B].map(S=>({root:S.root,joint:S.joint,tip:S.tip,upperLen:x/2,lowerLen:x/2,bend:1})),H=De(),q=De();L.hand.add(H),D.hand.add(q);const j=_S(t),ot=yS(t),dt=MS(t),xt={"sword-shield":{right:ja(.42,.075,t),left:vS(t)},"dual-swords":{right:ja(.42,.075,t),left:ja(.42,.075,t)},greatsword:{right:xS(t),left:be(.12,.2,.12,t.wood)},staff:{right:j.g,left:De(),orb:j.orb},bow:{right:dt,left:ot.g,arrow:dt,drawString:ot.drawString}};for(const S of Object.keys(xt))H.add(xt[S].right),q.add(xt[S].left),xt[S].right.visible=!1,xt[S].left.visible=!1;let Y=null,tt=0,ut=0,K=0,ft=0,It=0,Ct=0,vt=ZM(),At={...hl},wt=0,G=0,jt=0,kt=-1,Ut=0,Tt=0,St=0,Pt=0,I=0,E=0,W=0,st=1,ct=0,at=0,Ft=0,Q=!1,pt=0,Gt=0,nt=0,Mt=0,O="none",it=0,ht=1,Nt=!1,Ot=-1,Xt=!1,z=0,_t=0,J=0,rt=0,gt=0,yt=1,Ht={speed:0,phase:0},Zt={lp:0,lr:0,rp:0,rr:0},ie=0,$t=0,ce=!0,pe=0,Fe="none",Te=0,le=0,de=0,Me=.3,en=0;function Ge(S){const U=Math.PI/180,C=a;let Z=0,et=0,lt=0,mt=0;S==="sword-shield"?(Z=C.swordPitchDeg*U,et=-C.swordYawDeg*U,lt=C.shieldPitchDeg*U):S==="dual-swords"?(Z=C.swordPitchDeg*U,et=-C.swordYawDeg*U,lt=C.swordPitchDeg*U,mt=C.swordYawDeg*U):S==="greatsword"?(Z=C.greatswordPitchDeg*U,et=-C.greatswordYawDeg*U,lt=C.greatswordPitchDeg*U,mt=C.greatswordYawDeg*U):S==="staff"?Z=C.staffPitchDeg*U:lt=C.bowPitchDeg*U,H.rotation.set(Z,0,et),q.rotation.set(lt,0,mt)}function Ze(S){if(S!==Y){Y=S;for(const U of Object.keys(xt))xt[U].right.visible=U===S,xt[U].left.visible=U===S;Ge(S),ot.drawString.position.z=-.06,dt.position.z=0,j.orb.scale.setScalar(1),m.rotation.y=0}}Ze("sword-shield");const Ne=[];u.traverse(S=>{S instanceof ne&&S.material instanceof Qs&&Ne.push(S.material)});const ze=new Yt(o.flashColor);function ln(S,U){const C=Fu(S,U,o);vt=C,m.rotation.x+=C.upperPitch,m.rotation.z+=C.upperRoll,m.rotation.y+=C.upperYaw;const Z=Be(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),et=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Be(C.upperShiftX*Z,-et,et),m.position.z+=Be(C.upperShiftZ*Z,-et,et),g.position.x+=C.comX,g.position.z+=C.comZ-C.pelvisBack,g.position.y-=C.drop;const lt=C.legacy?0:Be(o.lowerScale,0,1);v.position.z+=C.pelvisBack*(1-lt),v.position.y+=C.drop*(1-lt),N.joint.rotation.x+=C.knee,B.joint.rotation.x+=C.knee,N.root.rotation.x-=C.hip,B.root.rotation.x-=C.hip,D.root.rotation.x+=C.arm,L.root.rotation.x+=C.arm*.8;for(const mt of Ne)mt.emissive.copy(ze).multiplyScalar(C.flash)}function me(S){return S<.3?-1:S<.62?-1+(S-.3)/.32*2:Math.max(0,1-(S-.62)/.38)}function Le(S){if(S.phase==="idle"||S.charging)return;const U=S.attackProgress,C=me(U),Z=Math.max(0,C),et=S.comboIndex%2===0?1:-1,lt=c.stride,mt=Number.isFinite(lt.stepReach)?lt.stepReach:.17,bt=Number.isFinite(lt.stepSideReach)?lt.stepSideReach:.14,Rt=Number.isFinite(lt.stepDipReach)?lt.stepDipReach:.05,Lt=S.weapon==="greatsword"?Be(Number.isFinite(lt.heavyScale)?lt.heavyScale:1,0,1):1;g.position.z+=mt*Z*Lt,g.position.x+=et*bt*Z*Lt,g.position.y-=Rt*Math.sin(Math.PI*U)*Lt}function bn(S){if(ot.drawString.position.z=-.06,dt.position.z=0,j.orb.scale.setScalar(1),m.rotation.y=0,S.charging&&S.weapon==="bow"){const et=S.charge;D.root.rotation.x=-1.25,D.joint.rotation.x=-.15,L.root.rotation.x=.35+et*.3,L.joint.rotation.x=-1.15,ot.drawString.position.z=-.06-et*.22,dt.position.z=-et*.3,m.rotation.y=-.22;return}if(S.phase==="idle")return;const U=me(S.attackProgress),C=Math.max(0,-U),Z=Math.max(0,U);if(S.weapon==="bow")D.root.rotation.x=-1.2,D.joint.rotation.x=-.15,L.root.rotation.x=.9-Z*.8,L.joint.rotation.x=-.3;else if(S.weapon==="greatsword"){const et=-1.6*C+1.25*Z,lt=Be(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);L.root.rotation.x=et,L.joint.rotation.x=-(.25+C*.4),D.root.rotation.x=et+.06,D.joint.rotation.x=-(.32+C*.4),D.root.rotation.z=.38,m.rotation.y=-.2*U*lt}else{const et=S.comboIndex;if(et===1)L.root.rotation.x=-1.7*C+1.1*Z,L.joint.rotation.x=-(.2+C*.5),D.root.rotation.x=.1,m.rotation.y=-.18*U;else if(et===2)D.root.rotation.x=-1.5*C+1*Z,D.joint.rotation.x=-(.2+C*.5),L.root.rotation.x=.2,m.rotation.y=.45*-U;else{const lt=-1.9*C+1.2*Z;D.root.rotation.x=lt,L.root.rotation.x=lt,D.joint.rotation.x=-(.15+C*.4),L.joint.rotation.x=-(.15+C*.4),m.rotation.y=-.3*U}}Le(S)}function R(S,U){S&&(L.root.rotation.x=-1.05,L.joint.rotation.x=-.35,D.root.rotation.x=-.45,D.joint.rotation.x=-.2,m.rotation.y=-.12,j.orb.scale.setScalar(1.25+.12*Math.sin(U*2)))}function $(S){if(!S||S.phase==="idle")return;const U=S.progress,C=U<.3?-.35+U/.3*1.35:U<.7?1:Math.max(0,1-(U-.7)/.3),Z=Math.PI/180;m.rotation.x+=d.leanDeg*Z*C,D.root.rotation.x-=d.shieldPitchDeg*Z*C,D.joint.rotation.x-=.22*C,L.root.rotation.x-=.3*C,g.position.z+=d.pelvisReach*Math.max(0,C)}return{group:u,update(S,U,C,Z,et=!1,lt,mt,bt){Ze(U.weapon),m.rotation.x=0,m.rotation.z=0,g.position.x=0,g.position.y=x,g.position.z=0,g.rotation.z=0,g.rotation.x=0,m.position.x=0,m.position.y=0,m.position.z=0,v.position.x=0,v.position.y=0,v.position.z=0,v.rotation.z=0;const Rt=Math.max(1/240,Math.min(Z,.1)),Lt=lt===void 0?ie+=Z:lt;$t=Lt;const Wt=c.landing;Wt.enabled?ce&&!S.grounded?(Fe="jump",Te=Lt,le=Wt.anticipationDuration,de=Math.max(0,Wt.jumpAnticipation),Me=.32):!ce&&S.grounded&&(Fe="land",Te=Lt,le=Wt.duration,de=YM(pe,Wt),Me=Wt.compressRatio,en=pe):(Fe="none",de=0),Lt<Te&&(Fe="none",de=0),ce=S.grounded,pe=S.velocity.y;const qt=ud(Lt,Te,le,de,Me),te=U.phase!=="idle",_e=(bt==null?void 0:bt.phase)==="active";rt=XM(rt,te,Rt,c.attack.blendRate);const Kt=WM(rt,c.attack.gaitWeight,c.attack.lowerBodyWeight);gt=Kt.attackLegWeight,yt=Kt.gaitScale;const Bt=Math.sin(S.bodyYaw),Se=Math.cos(S.bodyYaw),ee=(S.velocity.x-tt)/Rt,Et=(S.velocity.z-ut)/Rt,Vt=Be(ee,-60,60),oe=Be(Et,-60,60),hn=Vt*Bt+oe*Se,se=Ye(S.bodyYaw-K)/Rt,nn=Math.hypot(S.velocity.x,S.velocity.z),dn=r.maxForwardDeg*Math.PI/180,Ce=r.maxSideDeg*Math.PI/180,xn=Be(hn*r.accelGain,-dn,dn),Xe=Be(-se*nn*r.turnGain,-Ce,Ce),Jn=1-Math.exp(-r.smoothing*Rt);ft+=(xn-ft)*Jn,It+=(Xe-It)*Jn,tt=S.velocity.x,ut=S.velocity.z,K=S.bodyYaw;const sn=Math.hypot(S.velocity.x,S.velocity.z),Fi=Be(s.knockGaitScale??0,0,1),yr=C.knockX*Fi,Vu=C.knockZ*Fi,Xu=Fi>0&&Math.hypot(C.knockX,C.knockZ)>.001,Mr=S.velocity.x+yr,Sr=S.velocity.z+Vu,fl=Math.hypot(Mr,Sr);Mt=fl;const Wu=Math.cos(S.bodyYaw),$u=-Math.sin(S.bodyYaw),Yu=S.velocity.x*Wu+S.velocity.z*$u,pl=sn>rs?Be(Yu/sn,-1,1):0,ml=sn>rs?Be((S.velocity.x*Bt+S.velocity.z*Se)/sn,-1,1):1,Zu=cl(ml,s.backStrafeStartDeg,s.backStrafeFullDeg);O==="settled"&&Xt&&z>_t*1.02+1e-4&&(O="none");let Ss=1;O==="blend"?(Ss=Du(Nt?Ot:it,s.stopYawBlendMode,Nt),Nt||(it=Math.min(1,it+Rt/Math.max(.01,s.stopYawAfterSec)),(it>=1||s.stopYawBlendMode==="inStop"||Xt)&&(O="settled",Ss=0))):O==="settled"&&(Ss=Be(sn/Math.max(rs,s.stopEnterRatio*e),0,1)),ht=Ss;const qu=Tu(pl,i.legYawScale,i.hipYawMaxDeg,s.strafeHipBoost),ju=Ru(ml,pl,qu,Zu)*Ss;G+=(ju-G)*(1-Math.exp(-i.hipYawSmoothing*Rt));const bs=S.bodyYaw+G;jt=bs;const Ku=Math.sin(bs),Ju=Math.cos(bs),Qu=Math.cos(bs),tf=-Math.sin(bs),ia={speed:fl,phase:S.gaitPhase,localForward:Mr*Ku+Sr*Ju,localRight:Mr*Qu+Sr*tf,stride:S.stride};te&&!Q&&(Ft=S.gaitPhase),Q=te;const Ni=rt>0?GM(ia,U.attackProgress,U.comboIndex,rt,c.stride,Ft):ia;Ht=Ni;const gl=Math.max(0,s.stopBlendSec||0),xl=gl>0&&!te&&!Xu&&S.grounded,br=Cu(sn,ct,e,s.stopEnterRatio,s.stopExitRatio);if(!xl||br.resume)kt=-1;else if(kt<0&&br.enter){kt=0,Ut=S.gaitPhase,Tt=wu(S.gaitPhase),St=sn,Pt=Math.max(S.stride,rs),I=ia.localForward,E=ia.localRight;const ye=1/Math.max(rs,sn);W=S.velocity.x*ye,st=S.velocity.z*ye}const ef=ct;ct=sn;const di=xl&&kt>=0;di&&(kt=Math.min(1,kt+Rt/gl)),di&&O!=="blend"&&(O="blend",it=0),Nt=di&&kt<1,Ot=kt,Xt=br.resume,z=sn,_t=ef;const vl=di?{phase:Ut,speed:St,moveSpeed:e,localForward:I,localRight:E,legLength:n.legLength,stride:Pt,grounded:!0}:{phase:Ni.phase,speed:Ni.speed,moveSpeed:e,localForward:Ni.localForward,localRight:Ni.localRight,legLength:n.legLength,stride:Ni.stride??0,grounded:S.grounded},nf=di?Au(vl,s,{progress:kt,phase0:Ut,phaseEnd:Tt}):ll(vl,s),he=$M(nf,Kt.gaitScale);if(J=0,_e&&bt){const ye=OM(bt.progress,bt.dir,s),ae=Kt.gaitScale;he.legL.pitchX+=ye.legL.pitchX*ae,he.legL.rollZ+=ye.legL.rollZ*ae,he.legL.kneeX+=ye.legL.kneeX*ae,he.legR.pitchX+=ye.legR.pitchX*ae,he.legR.rollZ+=ye.legR.rollZ*ae,he.legR.kneeX+=ye.legR.kneeX*ae,he.pelvisY+=ye.pelvisY*ae,J=ye.env}let Er=0,wr=0,Ar=0,_l=0;if(di){const ye=Lu(S.bodyYaw,W,st),ae=Iu(kt,Ut,ye.forward,ye.right,s);ae.leadLeft?(he.legL.pitchX-=ae.leadPitch,he.legL.kneeX+=ae.leadKnee,he.legR.pitchX+=ae.trailPitch):(he.legR.pitchX-=ae.leadPitch,he.legR.kneeX+=ae.leadKnee,he.legL.pitchX+=ae.trailPitch),wr=ae.bodyShift*ae.fwdN,Er=ae.bodyShift*ae.rightN,Ar=ae.bodyDip,_l=ae.chestPitch,pt=ae.leadPitch,Gt=ae.bodyShift,nt=ae.bodyDip}else pt=0,Gt=0,nt=0;Zt={lp:he.legL.pitchX,lr:he.legL.rollZ,rp:he.legR.pitchX,rr:he.legR.rollZ},S.grounded?(N.root.rotation.x=he.legL.pitchX,B.root.rotation.x=he.legR.pitchX,N.root.rotation.z=he.legL.rollZ,B.root.rotation.z=he.legR.rollZ,N.joint.rotation.x=he.legL.kneeX,B.joint.rotation.x=he.legR.kneeX,D.root.rotation.x=he.armL,L.root.rotation.x=he.armR,D.joint.rotation.x=-(.18+he.armL*.2),L.joint.rotation.x=-(.18+he.armR*.2),D.root.rotation.z=0,L.root.rotation.z=0,g.position.x=he.pelvisX,g.position.y=x+he.pelvisY,g.position.z=0,g.rotation.z=he.pelvisRoll):(N.root.rotation.x=-.55,B.root.rotation.x=-.25,N.joint.rotation.x=.75,B.joint.rotation.x=.55,D.root.rotation.x=-.9,L.root.rotation.x=-.7,D.joint.rotation.x=-.6,L.joint.rotation.x=-.6,N.root.rotation.z=0,B.root.rotation.z=0);const sf=zu(g,v),Es=_e?{...f,weight:0}:di&&f.enabled?{...f,weight:1}:f,yl=Es.enabled&&S.grounded&&Es.weight>0?Be(Es.weight,0,1)*(te?Be(Es.attackScale,0,1):1):0;g.position.x+=Er,g.position.z+=wr,g.position.y-=Ar,v.position.y+=Ar,yl<=0&&(v.position.x-=Er,v.position.z-=wr);const af=sn/Math.max(e,rs),rf=Number.isFinite(r.crouchSmoothing)?r.crouchSmoothing:8,of=1-Math.exp(-Math.max(0,rf)*Rt);wt+=(Be(af,0,1)-wt)*of;const zi=Nu({leanForward:ft,leanSide:It,speedRatio:wt},r);g.rotation.x+=zi.pelvisPitch,g.rotation.z+=zi.pelvisRoll,g.position.x+=zi.pelvisX,g.position.z+=zi.pelvisZ,g.position.y-=zi.crouch,v.position.y+=zi.crouch*(1-Be(yl,0,1)),bn(U),R(et,S.gaitPhase),$(mt);const cf=a.greatswordPitchDeg*Math.PI/180,Ml=U.weapon==="greatsword",Sl=Math.hypot(S.velocity.x,S.velocity.z),lf=Ml&&U.phase==="idle"&&Sl>.5?Math.min(1.15,Sl/Math.max(e,.001)*.9):0;Ct+=(lf-Ct)*(1-Math.exp(-6*Rt)),Ml&&(H.rotation.x=cf+Ct),U.weapon==="bow"&&(ot.g.rotation.x=-(D.root.rotation.x+D.joint.rotation.x),dt.rotation.x=-(L.root.rotation.x+L.joint.rotation.x));const hf=m.rotation.y;ln(C,S.bodyYaw);const bl=C.type==="none"?1:.4;if(m.rotation.x+=ft*bl+_l,m.rotation.z+=(It+he.sideLean)*bl,qt>0&&(N.root.rotation.x-=Wt.hipPitch*qt,B.root.rotation.x-=Wt.hipPitch*qt,N.joint.rotation.x+=Wt.kneeBend*qt,B.joint.rotation.x+=Wt.kneeBend*qt,g.position.y-=Wt.crouchDepth*qt,v.position.y+=Wt.crouchDepth*(1-Wt.lowerScale)*qt,m.rotation.x+=Wt.upperPitch*qt,D.root.rotation.x-=Wt.armTuck*qt,L.root.rotation.x-=Wt.armTuck*qt),gt>0&&S.grounded){const ye=VM(U.attackProgress,U.comboIndex,c.stride),ae=gt;N.root.rotation.x+=ye.legL.pitchX*ae,B.root.rotation.x+=ye.legR.pitchX*ae,N.root.rotation.z+=ye.legL.rollZ*ae,B.root.rotation.z+=ye.legR.rollZ*ae,N.joint.rotation.x+=ye.legL.kneeX*ae,B.joint.rotation.x+=ye.legR.kneeX*ae,g.position.x+=ye.pelvisX*ae,g.position.y+=ye.pelvisY*ae,g.rotation.z+=ye.pelvisRoll*ae}v.rotation.y=G,at=Pu(G,s.chestYawScale,s.chestYawMaxDeg),m.rotation.y+=at;const df=hf;T.rotation.y=Ye(S.headYaw-S.bodyYaw-df-at),At=Ou({root:u,pelvis:g,lower:v,limbs:X,base:sf,cfg:Es,grounded:S.grounded,attacking:te})},lean(){return{forward:ft,side:It}},landing(){const S=ud($t,Te,le,de,Me),U=le>0?Math.max(0,le-Math.max(0,$t-Te)):0;return{pulse:S,remaining:U,kind:S>0?Fe:"none",impactVy:en}},hurt(){return vt},ik(){return At},attackBlend(){return rt},attackWeights(){return{gaitScale:yt,attackLegWeight:gt,driveSpeed:Ht.speed,stridePhase:Ht.phase}},hipYaw(){return G},gaitDebug(){return{stopT:kt,hipYaw:G,chestYaw:at,speed:ct,gaitSpeed:Mt,stopStep:pt,stopShift:Gt,stopDip:nt,stopYawFade:ht,turnStep:J,legLPitch:Zt.lp,legLRoll:Zt.lr,legRPitch:Zt.rp,legRRoll:Zt.rr}},gaitYaw(){return jt},arrowDirection(){dt.updateWorldMatrix(!0,!1);const S=dt.matrixWorld.elements,U=S[8],C=S[9],Z=S[10],et=Math.hypot(U,C,Z)||1;return{x:U/et,y:C/et,z:Z/et}},dispose(){u.traverse(S=>{if(S instanceof ne){S.geometry.dispose();const U=S.material;Array.isArray(U)?U.forEach(C=>C.dispose()):U.dispose()}})}}}function bS(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function ES(n,t,e,i){const s=Math.max(1,n.clientWidth),a=Math.max(1,n.clientHeight),r=new Zy({antialias:!0});r.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),r.shadowMap.enabled=!0,r.shadowMap.type=Fd,r.setSize(s,a,!1),n.appendChild(r.domElement);const o=new qy;o.background=new Yt("#12161d"),o.add(new PM(11061486,2764600,1.15));const c=new IM(16773852,1.5);c.position.set(9,18,11),c.castShadow=!0,c.shadow.mapSize.set(1024,1024);const l=c.shadow.camera;l.left=-20,l.right=20,l.top=20,l.bottom=-20,l.near=1,l.far=60,o.add(c);const h=[],f=new xe;for(const S of t.boxes){const U=S.maxX-S.minX,C=S.maxY-S.minY,Z=S.maxZ-S.minZ;let et=bS(S.kind,e);S.kind==="step"&&(et=new Yt(et).offsetHSL(0,0,S.maxY*.09).getStyle());const lt=new Qs({color:et,transparent:!0,opacity:1}),mt=new ne(new Ln(U,C,Z),lt);mt.position.set((S.minX+S.maxX)/2,(S.minY+S.maxY)/2,(S.minZ+S.maxZ)/2),mt.castShadow=S.kind!=="ground",mt.receiveShadow=!0,mt.add(new fu(new dM(mt.geometry),new tl({color:10467020,transparent:!0,opacity:.32}))),f.add(mt),h.push(lt)}o.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new UM(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,o.add(u);const g=eS(i,e);o.add(g.group);const v=SS(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),m=new xe,p=.9,x=new xe;x.position.y=p,v.group.position.y=-p,x.add(v.group),m.add(x),o.add(m);const _=t.dummies.map((S,U)=>{const C=e.dummies.colors,Z=C[U%C.length]??"#cccccc",et=tS(e.voxel,e.colors,Z,S.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return et.group.traverse(lt=>{lt.userData.dummyId=S.id}),o.add(et.group),et}),y=_.map(S=>S.group),k=new kM,b=e.groundRing,A=e.voxel.bodyWidth,T=pd(A,b.playerRadiusFactor),w=pd(A,b.dummyRadiusFactor),M=A*b.thicknessFactor,P=b.arcDeg*Math.PI/180;let F=0;const N=yo({radius:T,thickness:M,arcRad:P,edgeFade:b.edgeFade,color:b.playerColor,opacity:b.playerOpacity,y:.028,renderOrder:6});N.mesh.name="player-ground-ring",o.add(N.mesh);const B=t.dummies.map(S=>{const U=yo({radius:w,thickness:M,arcRad:P,edgeFade:b.edgeFade,color:b.neutralColor,opacity:b.opacity,y:.022,renderOrder:5});return U.mesh.name=`dummy-ground-ring-${S.id}`,o.add(U.mesh),U}),D=t.dummies.map(S=>{const U=yo({radius:w*b.haloRadiusFactor,thickness:M*b.haloThicknessFactor,arcRad:P,edgeFade:b.edgeFade,color:b.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return U.mesh.name=`dummy-ground-halo-${S.id}`,o.add(U.mesh),U}),L=t.dummies.map(()=>0),X=t.dummies.map(()=>0),H=md({radius:T*b.meterRadiusFactor,thickness:M*b.meterThicknessFactor,arcRad:P,edgeFade:.06,color:b.meterColorCharge,y:.03,renderOrder:8});H.mesh.name="player-ground-meter",o.add(H.mesh);const q=t.dummies.map(S=>{const U=md({radius:w*b.warnRadiusFactor,thickness:M*b.warnThicknessFactor,arcRad:P,edgeFade:.02,color:b.warnColor,y:.031,renderOrder:9});return U.mesh.name=`dummy-ground-warn-${S.id}`,o.add(U.mesh),U}),j=gd({color:b.playerColor,y:.042,renderOrder:3});j.group.name="player-landing-preview",o.add(j.group);const ot=new Yt,dt=new Yt(b.playerColor),xt=new Yt(b.neutralColor),Y=new Yt(b.lowThreatColor),tt=new Yt(b.highThreatColor),ut=new Yt(b.meterColorCharge),K=new Yt(b.meterColorChannel),ft=new Yt(b.meterColorCooldown),It=new Yt(b.warnColor),Ct=new xe;o.add(Ct);const vt=e.projectiles;function At(){const U=document.createElement("canvas");U.width=64,U.height=64;const C=U.getContext("2d");if(C){const et=C.createRadialGradient(32,32,0,32,32,32);et.addColorStop(0,"rgba(255,255,255,1)"),et.addColorStop(.28,"rgba(255,255,255,0.72)"),et.addColorStop(.62,"rgba(255,255,255,0.22)"),et.addColorStop(1,"rgba(255,255,255,0)"),C.fillStyle=et,C.fillRect(0,0,64,64)}const Z=new wc(U);return Z.colorSpace=Ke,Z}function wt(){const C=document.createElement("canvas");C.width=2,C.height=64;const Z=C.getContext("2d");if(Z){const lt=Z.createLinearGradient(0,0,0,64);lt.addColorStop(0,"rgba(255,255,255,0)"),lt.addColorStop(.55,"rgba(255,255,255,0.35)"),lt.addColorStop(1,"rgba(255,255,255,0.95)"),Z.fillStyle=lt,Z.fillRect(0,0,2,64)}const et=new wc(C);return et.colorSpace=Ke,et}const G=At(),jt=wt(),kt=new He({color:12577023,transparent:!0,opacity:0,side:we,depthWrite:!1}),Ut=new He({color:14217983,transparent:!0,opacity:0,side:we,depthWrite:!1,blending:wi}),Tt=new xe;Tt.position.set(0,.95,.72),Ct.add(Tt);const St=new xe;St.rotation.x=uS(e.camera.pitchDeg),Tt.add(St);const Pt=new _r(.78,vt.slashThickness,6,28,Math.PI*1.15),I=new xe,E=new ne(Pt,kt),W=new ne(Pt,Ut);W.scale.setScalar(1.09),W.renderOrder=4,I.add(E,W),St.add(I);const st=new xe;st.visible=!1,st.renderOrder=6,o.add(st);const ct=new He({color:vt.arrowColor,transparent:!0}),at=new He({color:vt.arrowHeadColor,transparent:!0}),Ft=new He({color:vt.arrowTrailColor,map:jt,transparent:!0,opacity:0,blending:wi,depthWrite:!1,side:we}),Q=new Ec({map:G,color:vt.arrowColor,transparent:!0,opacity:.85,blending:wi,depthWrite:!1}),pt=new Ln(vt.arrowWidth,vt.arrowWidth,vt.arrowLength),Gt=new ne(pt,ct),nt=new sl(vt.arrowHeadSize*.42,vt.arrowHeadSize,4);nt.rotateX(Math.PI/2);const Mt=new ne(nt,at);Mt.position.z=vt.arrowLength/2+vt.arrowHeadSize*.42;const O=new Ln(vt.arrowWidth*2.6,vt.arrowWidth*.4,.1),it=new ne(O,ct),ht=new ne(O,ct);it.position.z=-vt.arrowLength/2+.08,ht.position.z=it.position.z,ht.rotation.z=Math.PI/2;const Nt=new jh(Q);Nt.scale.setScalar(vt.arrowGlowSize),Nt.renderOrder=6;const Ot=new Zs(vt.arrowWidth*.45,vt.arrowWidth*1.3,vt.trailLength,6,1,!0);Ot.rotateX(-Math.PI/2),Ot.translate(0,0,-vt.trailLength/2);const Xt=new ne(Ot,Ft);Xt.renderOrder=5,st.add(Gt,Mt,it,ht,Nt,Xt);const z=new rl(1,0),_t=new He({color:vt.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),J=new Ec({map:G,color:vt.boltGlowColor,transparent:!0,opacity:.6,blending:wi,depthWrite:!1}),rt=new He({color:vt.boltGlowColor,map:jt,transparent:!0,opacity:vt.trailOpacity,blending:wi,depthWrite:!1,side:we}),gt=new Zs(.14,.8,vt.boltTrailScale,6,1,!0);gt.rotateX(-Math.PI/2),gt.translate(0,0,-vt.boltTrailScale/2);const yt=Array.from({length:16},()=>{const S=new xe,U=new ne(z,_t),C=new jh(J);C.scale.setScalar(vt.boltGlowScale),C.renderOrder=6;const Z=new ne(gt,rt);return Z.renderOrder=5,S.add(U,C,Z),S.visible=!1,o.add(S),{group:S,core:U}}),Ht=Array.from({length:6},()=>{const S=gd({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return S.group.visible=!1,o.add(S.group),S}),Zt=e.dash,ie=new Js(Zt.ringRadius-.06,Zt.ringRadius,28),$t=Array.from({length:6},()=>{const S=new He({color:16777215,transparent:!0,opacity:0,side:we,depthWrite:!1}),U=new ne(ie,S);return U.rotation.x=-Math.PI/2,U.visible=!1,o.add(U),{mesh:U,mat:S,life:0,base:1}});function ce(S,U,C,Z,et){const lt=$t.find(mt=>mt.life<=0)??$t[0];lt.mat.color.set(Z),lt.mesh.position.set(S,C+.04,U),lt.base=et,lt.mesh.scale.setScalar(et*.6),lt.mesh.visible=!0,lt.mat.opacity=.9,lt.life=Zt.fxDuration}const pe=e.links,Fe=new Js(pe.ringRadius-.07,pe.ringRadius,28),Te=Array.from({length:5},()=>{const S=new He({color:pe.chargeColor,transparent:!0,opacity:0,side:we,depthWrite:!1}),U=new ne(Fe,S);return U.rotation.x=-Math.PI/2,U.visible=!1,o.add(U),{mesh:U,mat:S,life:0,base:1}});function le(S,U,C,Z){const et=Te.find(lt=>lt.life<=0)??Te[0];et.mesh.position.set(S,C+.05,U),et.base=Z,et.mesh.scale.setScalar(Z*.55),et.mesh.visible=!0,et.mat.opacity=.85,et.life=pe.fxDuration}let de=t.playerLink.id,Me=t.playerLink.hitIds.length,en=t.dash.id,Ge="none",Ze=0,Ne=-1,ze=1,ln={x:0,y:1,z:0},me=0;const Le=NM(e.camera,e.smartCamera,e.zoom,s/a),bn=t.character.position;Le.update(bn.x,bn.y,bn.z,1,t.camera);function R(S,U){if(y.length===0)return 0;const C=r.domElement.getBoundingClientRect(),Z=new zt((S-C.left)/C.width*2-1,-((U-C.top)/C.height)*2+1);k.setFromCamera(Z,Le.camera);const et=k.intersectObjects(y,!0);for(const lt of et){const mt=lt.object.userData.dummyId;if(mt&&mt>0)return mt}return 0}function $(S,U,C){const Z=r.domElement.getBoundingClientRect(),et=new V(S,U,C).project(Le.camera);return{x:Z.left+(et.x*.5+.5)*Z.width,y:Z.top+(-et.y*.5+.5)*Z.height}}return{gaitDebug(){return v.gaitDebug()},render(S,U){const C=S.character,Z=S.combat;m.position.set(C.position.x,C.position.y,C.position.z),m.rotation.y=C.bodyYaw;const et=S.dash.phase==="active"&&S.dash.kind==="roll",lt=et&&S.dash.duration>0?Math.min(1,1-S.dash.timer/S.dash.duration):0;x.rotation.x=et?lt*Math.PI*2:0,x.position.y=p-(et?.2*Math.sin(Math.PI*lt):0),v.update(C,Z,S.playerHurt,U,S.abilities.channeling,S.time,S.playerLink,S.turnInPlace);for(let Et=0;Et<_.length;Et++)S.dummies[Et]&&_[Et].update(S.dummies[Et],U);const mt=Le.camera.position,bt=Math.atan2(mt.x-C.position.x,mt.z-C.position.z),Rt=S.config.gaze.hurtHoldSec,Lt=S.time-S.playerHurt.lastAt,Wt=Rt>0&&Lt>=0&&Lt<Rt?1-Lt/Rt:0,qt=sS(S.gaze.active,S.gaze.threat,Wt,S.time,b);aS(ot,dt,Y,tt,qt.level),F=dS(C.grounded,C.position.y,F),N.mesh.position.set(C.position.x,F+.028,C.position.z),N.update(qt.arcRad,qt.opacity,qt.scale,ot,bt);const te=cS({charging:Z.charging,charge:Z.charge,channeling:S.abilities.channeling,fireTimer:S.abilities.fireTimer,fireInterval:S.config.abilities.arcane.fireInterval,dashCooldown:S.dash.cooldown,dashCooldownMax:S.dash.kind==="blink"?S.config.dash.blinkCooldown:S.config.dash.rollCooldown});H.mesh.position.set(C.position.x,C.position.y+.03,C.position.z),H.set(te.ratio,te.source==="none"?0:b.meterOpacity,te.source==="charge"?ut:te.source==="channel"?K:ft,bt);const _e=S.playerLink,Kt=_e.weapon?S.config.links.moves[_e.weapon]:void 0,Bt=lS(_e.phase,C.position.x,C.position.z,_e.facing,_e.travel,(Kt==null?void 0:Kt.hit.radius)??.9);j.set(Bt.x,Bt.z,.042,Bt.radius,Bt.active?b.landingOpacity:0,S.time);for(let Et=0;Et<B.length;Et++){const Vt=S.dummies[Et],oe=B[Et],hn=D[Et],se=q[Et];if(!Vt){oe.mesh.visible=!1,hn.mesh.visible=!1,se.mesh.visible=!1;continue}const nn=S.targeting.hasTarget&&S.targeting.targetId===Vt.id;if(gp(S,Vt)){const yr=xp(S,Vt);ot.copy(Y).lerp(tt,yr)}else ot.copy(xt);const dn=oS(Vt.attackPhase,Vt.attackPhaseTimer,S.config.dummies.attackWindup);dn.active?(ot.lerp(It,.5*dn.urgency),se.mesh.position.set(Vt.position.x,Vt.position.y+.031,Vt.position.z),se.set(dn.ratio,b.warnOpacity*(.65+.35*dn.urgency),It,bt)):se.set(0,0,It,bt);const Ce=nn?1:0,xn=Ce>L[Et]?b.haloFadeInSec:b.haloFadeOutSec;L[Et]=xd(L[Et],Ce,U,xn);const Xe=L[Et],Jn=1+.02*Xe*Math.sin(S.time*2.2+Vt.id),sn=b.arcDeg+(b.selectedArcDeg-b.arcDeg)*Xe;oe.mesh.position.set(Vt.position.x,Vt.position.y+.022,Vt.position.z),oe.update(sn*Math.PI/180,b.opacity+(b.selectedOpacity-b.opacity)*Xe,1+(b.selectedScale-1)*Xe*Jn,ot,bt,1+(b.selectedThicknessScale-1)*Xe),X[Et]=xd(X[Et],Ce,U,Ce>X[Et]?b.haloFadeInSec:b.haloFadeOutSec);const Fi=X[Et];hn.mesh.position.set(Vt.position.x,Vt.position.y+.019,Vt.position.z),hn.update(sn*Math.PI/180,b.haloOpacity*Fi*(.88+.12*Math.sin(S.time*2.2+Vt.id)),b.selectedScale*(.94+.06*Fi)*Jn,ot,bt)}if(Ct.position.set(C.position.x,C.position.y,C.position.z),Ct.rotation.y=Z.phase!=="idle"?Z.attackFacing:C.bodyYaw,S.dash.id!==en){en=S.dash.id;const Et=S.dash;Ge=Et.kind,Et.kind==="blink"?(ce(Et.fromX,Et.fromZ,C.position.y,Zt.blinkColor,.9),ce(Et.toX,Et.toZ,C.position.y,Zt.blinkColor,1.35)):ce(Et.fromX,Et.fromZ,C.position.y,Zt.rollColor,1.1)}for(const Et of $t){if(Et.life<=0)continue;Et.life-=U;const Vt=Math.max(0,Et.life/Zt.fxDuration);Et.mat.opacity=.9*Vt,Et.mesh.scale.setScalar(Et.base*(.6+(1-Vt)*1.2)),Et.life<=0&&(Et.mesh.visible=!1)}const Se=S.playerLink;Se.id!==de&&(de=Se.id,Me=Se.hitIds.length,le(C.position.x,C.position.z,C.position.y,1)),Se.hitIds.length>Me?(Me=Se.hitIds.length,le(C.position.x,C.position.z,C.position.y,1.35)):Se.hitIds.length<Me&&(Me=Se.hitIds.length);for(const Et of Te){if(Et.life<=0)continue;Et.life-=U;const Vt=Math.max(0,Et.life/Math.max(pe.fxDuration,1e-6));Et.mat.opacity=.85*Vt,Et.mesh.scale.setScalar(Et.base*(.55+(1-Vt)*1.1)),Et.life<=0&&(Et.mesh.visible=!1)}Z.attackId!==Ze&&(Ze=Z.attackId,Z.weapon==="bow"&&Z.phase!=="idle"&&(Ne=0,ze=.6+Z.lastCharge*.9,me=Z.attackFacing,ln=pS(C.position.x,C.position.y,C.position.z,me,.6,.95)));const ee=Z.phase==="active"&&Z.comboIndex>0;kt.opacity=ee?.9:0,Ut.opacity=ee?vt.slashGlowOpacity:0,ee&&(I.rotation.z=-1.2+Z.attackProgress*3.2,I.scale.setScalar(.9+Z.comboIndex*.13));for(let Et=0;Et<yt.length;Et++){const Vt=S.abilities.projectiles[Et],oe=yt[Et];oe.group.visible=!!Vt,Vt&&(oe.group.position.set(Vt.x,Vt.y,Vt.z),oe.group.scale.setScalar(Vt.radius),oe.group.rotation.y=Math.atan2(Vt.dirX,Vt.dirZ),oe.core.rotation.y+=U*6)}for(let Et=0;Et<Ht.length;Et++){const Vt=S.abilities.rings[Et],oe=Ht[Et];if(!Vt){oe.group.visible=!1;continue}const hn=Math.max(0,Math.min(1,Vt.life/Math.max(Vt.duration,1e-6))),se=hS(Math.max(0,Vt.duration-Vt.life),b.areaExpandSec);oe.set(Vt.x,Vt.z,.045,Vt.radius*se.scale,b.areaOpacity*(.35+.65*hn)*se.alpha,S.time)}if(Ne>=0){Ne+=U;const Et=Ne*14*ze,Vt=gS(Et,9,1.4);if(Vt<=.02)Ne=-1,st.visible=!1;else{st.visible=!0;const oe=mS(ln,me,Et);st.position.set(oe.x,oe.y,oe.z),st.rotation.y=me,ct.opacity=Vt,at.opacity=Vt,Q.opacity=.85*Vt,Ft.opacity=vt.trailOpacity*Vt}}else st.visible=!1;Le.update(C.position.x,C.position.y,C.position.z,U,S.camera),r.render(o,Le.camera)},resize(){const S=Math.max(1,n.clientWidth),U=Math.max(1,n.clientHeight);r.setSize(S,U,!1),Le.resize(S/U)},getGroundBasis(){return Le.getGroundBasis()},setCollidersVisible(S){for(const U of h)U.opacity=S?.3:1,U.wireframe=S,U.needsUpdate=!0},setGridVisible(S){u.visible=S},setLabVisible(S){g.setVisible(S)},setLabLabelsVisible(S){g.setLabelsVisible(S)},snapCamera(S,U,C){Le.snap(S,U,C)},setZoom(S){Le.setZoom(S)},pickDummy:R,projectToScreen:$,diagnostics(){const S=Gu(e.camera.pitchDeg),U=fS(S,Ct.rotation.y);return{lean:v.lean(),slashNormal:U,arrowForward:v.arrowDirection(),gait:{hipYaw:v.hipYaw(),gaitYaw:v.gaitYaw()},attackBlend:v.attackBlend(),attackWeights:v.attackWeights(),landing:v.landing(),hurt:v.hurt(),ik:v.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:x.rotation.x,activeRings:$t.filter(C=>C.life>0).length,lastKind:Ge},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...Le.smart()}}},dispose(){v.dispose(),g.dispose();for(const S of _)S.dispose();N.dispose();for(const S of B)S.dispose();for(const S of D)S.dispose();H.dispose();for(const S of q)S.dispose();j.dispose(),Pt.dispose(),kt.dispose(),Ut.dispose(),z.dispose(),_t.dispose(),J.dispose(),rt.dispose(),gt.dispose();for(const S of Ht)S.dispose();pt.dispose(),nt.dispose(),O.dispose(),Ot.dispose(),ct.dispose(),at.dispose(),Q.dispose(),Ft.dispose(),G.dispose(),jt.dispose();for(const S of $t)S.mat.dispose();ie.dispose();for(const S of Te)S.mat.dispose();Fe.dispose(),f.traverse(S=>{S instanceof ne&&S.geometry.dispose()}),r.dispose(),r.domElement.remove()}}}async function wS(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function AS(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download=n,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function TS(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),s=i("diag-status"),a=i("diag-text"),r=i("diag-copy"),o=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,g=0;function v(){const x=n.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function m(x){d=x,e.hidden=!x,x?v():a.hidden=!0}function p(x){r.textContent=x,window.clearTimeout(g),g=window.setTimeout(()=>{r.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),m(!d)}),h.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),r.addEventListener("click",()=>{const x=n.summary();wS(x).then(_=>{_?(p("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),p("请长按全选复制"))})}),o.addEventListener("click",()=>{const x=n.dump(),_=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);AS(`harness-${x.meta.version}-${_}.json`,JSON.stringify(x)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),a.hidden=!0,v(),p("已清空")}),l.addEventListener("click",()=>{u=!u,n.setEnabled(u),v()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),d&&v()},isOpen:()=>d,close:()=>m(!1)}}const RS={intents:{...vd},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function CS(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=_p(Qp,ra),i=ES(n,e,un,ra.stations),s=Mp(e),a=Dm(t),r=Im(t),o=document.getElementById("version-badge");o&&(o.textContent="v0.9.37 · 11-07 18:33 · 诊断");const c=F=>String(F).padStart(2,"0"),l=new Date,h=Zp({meta:{version:"v0.9.37",buildTime:"11-07 18:33",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=TS(h,o),d=Cm({deadZone:()=>un.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:un.showColliders,showGrid:un.showGrid,showLab:un.lab.enabled,showLabLabels:un.lab.showLabels};let g=1;const v=Np({maxRadiusPx:()=>un.joystick.maxRadiusPx,deadZone:un.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>un.zoom}),m=Array.from(document.querySelectorAll(".wp[data-weapon]"));let p=e.combat.weapon;function x(F){if(F===p)return;p=F;const N=Li.indexOf(F)+1;for(const B of m)B.classList.toggle("is-active",Number(B.dataset.weapon)===N);b.refreshWeapon()}let _=RS,y=0;const k=()=>{g=1,i.setZoom(1)},b=um(e,un,u,{singleStep:()=>s.singleStep(_.intents),reset:()=>{g=1,s.singleStep({...vd,resetPressed:!0})},resetZoom:k,onToggleColliders:F=>i.setCollidersVisible(F),onToggleGrid:F=>i.setGridVisible(F),onToggleLab:F=>i.setLabVisible(F),onToggleLabLabels:F=>i.setLabLabelsVisible(F)}),A=mm({stations:ra.stations??[],world:e,view:i,onResetZoom:k});r.register({motion:d,debug:b.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:s,input:v,viewConfig:un,debug:u,getUserZoom:()=>g,getGestures:()=>_.gestures,getLastGesture:()=>_.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),lab:{stations:ra.stations??[],goto:F=>A.goto(F),current:()=>A.current(),recall:()=>A.recall()}};let T=performance.now(),w=60,M=0;function P(F){const N=Math.min((F-T)/1e3,.1);T=F,N>0&&(w=w*.9+1/N*.1);const B=v.sample();B.intents.resetPressed&&(g=1),g=Tp(g,B.zoomScale,un.zoom.min,un.zoom.max),i.setZoom(g);let D=B.intents.dummyClickId;if(B.tap){const H=i.pickDummy(B.tap.x,B.tap.y);H>0&&(D=H)}D>0&&(y=D),_={...B,intents:{...B.intents,dummyClickId:y}};const L=s.frame(N,_.intents,u.timeScale,u.paused,()=>{const H=e.events;for(let q=0;q<H.length;q++)h.event(H[q],e.time)});L>0&&(y=0),h.sample(e,_,N*1e3,L);for(const H of _.gestures)h.gesture(H);F-M>250&&(M=F,f.tick()),x(e.combat.weapon),i.render(e,N),A.tick(),d.update(e,_,i.getGroundBasis());const X=i.diagnostics();a.update(e,w,L,_,u,{attackBlend:X.attackBlend,attackWeights:X.attackWeights,landing:X.landing,hurt:X.hurt,ik:X.ik,zoom:X.camera.zoom},r.hudCompact()),requestAnimationFrame(P)}requestAnimationFrame(P)}CS();

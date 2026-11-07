(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const Si=["sword-shield","dual-swords","greatsword","staff","bow"],nr=["wander","follow","keep-distance","attack","idle"],_d={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},Ca=1e-6;function Ps(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Ca?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>Ca?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Jh(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Ca){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>Ca)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const sn=1e-6,$r=Math.PI/180,xd=-1e9;function vd(){return{type:"none",lastAt:xd,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Yr(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Fc(n,t,e,i,s){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=s,n.knockX=0,n.knockZ=0}function tc(n,t,e){const i=e.duration>0?e.duration:nc(n,e.type);if(t.kind==="player"){const a=n.playerHurt;if(Fc(a,e.type,i,e.dirX,e.dirZ),a.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>sn){const r=e.knockback*n.config.hits.knockbackDecay;a.knockX=e.dirX*r,a.knockZ=e.dirZ*r}Yr(n,"player-hurt",e.sourceId??0,n.character.position);return}const s=n.dummies[t.index];if(s){if(Fc(s.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>sn){const a=e.knockback*n.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}n.hitCount+=1,Yr(n,"hit",s.id,s.position)}}function ec(n,t,e){tc(n,{kind:"dummy",index:t},e)}function Qh(n,t){const e=[n.playerHurt];for(const s of n.dummies)e.push(s.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=i,s.knockZ*=i,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function nc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function tu(n){const t=n.combat,e=n.config.hits,i=n.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*$r),r=Math.sin(t.attackFacing),o=Math.cos(t.attackFacing),c=n.config.dummies.radius,l=n.config.targeting.idealRange;for(const d of n.dummies){const f=d.position.x-i.x,h=d.position.z-i.z,u=Math.hypot(f,h);if(u>s+c)continue;const g=u>sn?f/u:r,_=u>sn?h/u:o;if(u>sn&&(f*r+h*o)/u<a)continue;let m="light";t.weapon==="greatsword"?m="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(m="heavy");const p=e.knockback[t.weapon]??0;let x=u;p>0&&(x=Math.max(u+p,l));const v=Math.max(0,x-u);ec(n,n.dummies.indexOf(d),{type:m,duration:nc(n,m),dirX:g,dirZ:_,knockback:v})}}function eu(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const s=i.weapon===""?void 0:e.moves[i.weapon];if(!s||!s.enabled||!n.modules.hits||!n.modules.dummies)return;const a=s.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(a.pulseInterval,0);const r=n.character.position,o=i.fromX,c=i.fromZ,l=r.x,d=r.z,f=l-o,h=d-c,u=f*f+h*h,g=Math.sin(i.facing),_=Math.cos(i.facing),m=Math.cos(Nc(a.arcDeg,0,180)*$r),p=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const v=n.dummies[x];if(i.hitIds.indexOf(v.id)>=0)continue;const S=u>sn?Nc(((v.position.x-o)*f+(v.position.z-c)*h)/u,0,1):0,U=o+f*S,C=c+h*S,A=Math.hypot(v.position.x-U,v.position.z-C);let T=!1;if(a.shape==="circle")T=A<=a.radius+p;else if(a.shape==="capsule")T=A<=Math.max(a.radius,a.width)+p;else{const X=v.position.x-l,P=v.position.z-d,R=Math.hypot(X,P),V=R>sn?(X*g+P*_)/R>=m:!0;T=R<=a.radius+p&&V||A<=a.width+p}if(!T)continue;const b=v.position.x-o,y=v.position.z-c,D=Math.hypot(b,y);if(D>sn&&(b*g+y*_)/D<Math.cos(Math.max(a.arcDeg,90)*$r))continue;const H=D>sn?b/D:g,z=D>sn?y/D:_;tc(n,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:H,dirZ:z,knockback:a.knockback}),i.hitIds.push(v.id),Yr(n,"link-hit",v.id,v.position)}}function nu(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const s=n.dummies[i.value-1];if(!s)continue;const a=e.x-s.position.x,r=e.z-s.position.z,o=Math.hypot(a,r);if(o>t.dummyReach)continue;const c=o>sn?a/o:0,l=o>sn?r/o:1;tc(n,{kind:"player"},{type:"light",duration:nc(n,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function iu(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&tu(n),eu(n,t),nu(n)}function Nc(n,t,e){return n<t?t:n>e?e:n}const xa=1e-6;function Ds(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function su(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function au(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function ru(n){const t=n.abilities,e=n.config.abilities.arcane,i=n.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),r=.55,o={id:++t.nextId,x:i.x+s*r,y:i.y+1,z:i.z+a*r,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(o),t.volleyId+=1,Ds(n,"projectile-fire",t.volleyId,o)}function ou(n,t,e){const i=n.abilities,s=n.config.abilities.arcane,a=n.dash.phase==="active",r=n.playerLink;if(n.combat.weapon==="staff"&&e.attackHeld&&!a&&r.phase==="idle"&&!r.consumedAttack){i.channeling||(i.channeling=!0,i.fireTimer=0,Ds(n,"channel-start",0,n.character.position)),i.channelYaw=Ps(n,e),i.fireTimer-=t;let c=0;for(;i.fireTimer<=0&&c++<8;)i.fireTimer+=Math.max(s.fireInterval,xa),ru(n)}else i.channeling&&(i.channeling=!1,Ds(n,"channel-end",0,n.character.position))}function cu(n,t){const e=n.config.abilities.ring,i=n.dash.phase==="active";if(n.combat.weapon!=="staff"||!t.skill2Pressed||i)return;const s=n.character.position,a={id:++n.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};n.abilities.rings.push(a),Ds(n,"ring-place",a.id,s)}function lu(n,t){const e=n.abilities,i=n.config.abilities.arcane,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,r=[];for(const o of e.projectiles){if(o.x+=o.dirX*o.speed*t,o.z+=o.dirZ*o.speed*t,o.life-=t,o.life<=0)continue;let c=!1;if(a)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],f=d.position.x-o.x,h=d.position.z-o.z,u=o.radius+s;if(!(f*f+h*h>u*u)){ec(n,l,{type:i.hurtType,duration:i.hurtDuration,dirX:o.dirX,dirZ:o.dirZ,knockback:i.knockback}),c=!0;break}}c||r.push(o)}e.projectiles=r}function du(n,t){const e=n.abilities,i=n.config.abilities.ring,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,r=[];for(const o of e.rings){o.life-=t,o.pulseTimer-=t;let c=0;for(;o.pulseTimer<=0&&c++<8;){if(o.pulseTimer+=Math.max(i.pulseInterval,xa),a)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],f=d.position.x-o.x,h=d.position.z-o.z,u=o.radius+s;if(f*f+h*h>u*u)continue;const g=Math.hypot(f,h),_=g>xa?f/g:0,m=g>xa?h/g:1;ec(n,l,{type:"heavy",duration:i.stun,dirX:_,dirZ:m,knockback:i.knockback})}Ds(n,"ring-pulse",o.id,{x:o.x,y:0,z:o.z})}o.life>0&&r.push(o)}e.rings=r}function hu(n,t,e){ou(n,t,e),cu(n,e),lu(n,t),du(n,t)}function ir(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const zc=1e-6;function Oc(n,t,e){return n<t?t:n>e?e:n}function Md(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function yd(n){const t=n.camera,e=Md();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function uu(n){const t=n.camera,e=n.config.camera,i=n.character.position;let s=0,a=0,r=0,o=0;for(const l of n.dummies){const d=l.position.x-i.x,f=l.position.z-i.z,h=Math.hypot(d,f);if(h>e.radius)continue;const u=Oc((e.radius-h)/Math.max(zc,e.radius-e.nearDistance),0,1);let g=u*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(g+=e.attackBoost*u),s+=g,a+=l.position.x*g,r+=l.position.z*g,o+=1}const c=s<=0?0:Oc(s/(s+Math.max(zc,e.saturation)),0,1);if(t.threat=c,t.threatCount=o,s<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,d=r/s;t.centroidX=l,t.centroidZ=d;let f=(l-i.x)*e.framingBias*c,h=(d-i.z)*e.framingBias*c;const u=Math.hypot(f,h);u>e.maxOffset&&(f=f/u*e.maxOffset,h=h/u*e.maxOffset),t.offsetX=f,t.offsetZ=h}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function fu(n){const t=[],e=n.ground.size;t.push(Ci("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Ci(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const s=i.openingWidth/2,a=i.wallThickness;t.push(Ci(`${i.id}-left`,"wall",i.x-s-i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Ci(`${i.id}-right`,"wall",i.x+s+i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Ci(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,a,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Ci(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Ci(n,t,e,i,s,a,r,o){return{id:n,kind:t,minX:e-s/2,maxX:e+s/2,minY:r,maxY:o,minZ:i-a/2,maxZ:i+a/2}}const On=1e-6;function Pa(n,t,e){return n<t?t:n>e?e:n}function Zr(n,t,e,i,s,a,r){const o=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+a+On||l.maxY<i-r-On||t+o<l.minX||t-o>l.maxX||e+o<l.minZ||e-o>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function ic(n,t,e,i,s){let a=!1;const r=t.y+i;for(let o=0;o<2;o++)for(const c of n){if(c.maxY<=t.y+s+On||c.minY>=r-On)continue;const l=Pa(t.x,c.minX,c.maxX),d=Pa(t.z,c.minZ,c.maxZ),f=t.x-l,h=t.z-d,u=f*f+h*h;if(!(u>=e*e))if(a=!0,u>On*On){const g=Math.sqrt(u),_=(e-g)/g;t.x+=f*_,t.z+=h*_}else{const g=t.x-c.minX,_=c.maxX-t.x,m=t.z-c.minZ,p=c.maxZ-t.z,x=Math.min(g,_,m,p);x===g?t.x=c.minX-e:x===_?t.x=c.maxX+e:x===m?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function sc(n,t,e,i,s){const a=t.y+i;for(const r of n){if(r.maxY<=t.y+s+On||r.minY>=a-On)continue;const o=Pa(t.x,r.minX,r.maxX),c=Pa(t.z,r.minZ,r.maxZ),l=t.x-o,d=t.z-c;if(l*l+d*d<e*e-On)return!0}return!1}const qr=Math.PI/180,ac=1e-6;function pu(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function jr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function Sd(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>ac?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function bd(n,t,e){const i=n.character,s=Math.hypot(i.velocity.x,i.velocity.z),a=Math.hypot(t.moveX,t.moveZ),r=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&s<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,ac)&&a<=Math.max(0,e.inputDeadZone)&&!r}function mu(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function gu(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!bd(n,t,e))return!1;const i=Sd(n,t,e.lookRange);if(i===null)return!1;const s=ke(i-n.character.bodyYaw);return Math.abs(s)>Math.max(0,e.triggerDeg)*qr}function _u(n,t,e){const i=n.turnInPlace,s=n.config.turnInPlace;if(!s.enabled||!n.modules.turnInPlace||!bd(n,e,s)){jr(n);return}const a=Sd(n,e,s.lookRange);if(a===null){jr(n);return}const r=n.character,o=ke(a-r.bodyYaw),c=Math.abs(o),l=Math.max(0,s.triggerDeg)*qr,d=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>ac;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,s.armSec))){i.phase="active",i.fromYaw=r.bodyYaw,i.dir=o>=0?1:-1;const f=Math.min(c,Math.max(0,s.settleDeg)*qr);i.targetYaw=ke(r.bodyYaw+i.dir*(c-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(s.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const h=ke(i.targetYaw-i.fromYaw);r.bodyYaw=ke(i.fromYaw+h*mu(i.progress)),d||(r.facing=r.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Kr=1e-6;function ke(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Os(n,t,e,i){const s=ke(t-n);return n+s*(1-Math.exp(-Math.max(e,Kr)*i))}function Bc(n,t,e,i){const s=ke(t-n),a=Math.abs(s);return a<=i||a<=e?t:ke(n+Math.sign(s)*Math.max(e,0))}function xu(n,t,e){const i=n.character,s=n.config.orientation,a=n.combat,r=n.modules.gaze&&n.gaze.active,o=n.abilities.channeling,c=a.phase!=="idle"||a.charging||o||n.dash.phase!=="idle",l=r&&!c,d=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Kr,h=a.charging&&a.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(a.phase!=="idle")i.facing=a.attackFacing;else if(o)i.facing=Ps(n,e);else if(l)i.facing=Os(i.facing,n.gaze.centroidYaw,s.bodyTurnRate,t);else if(f)i.facing=Ps(n,e);else if(h)i.facing=n.targeting.targetYaw;else if(d>Math.max(s.facingDeadZone,Kr)){const U=Math.atan2(e.moveX,e.moveZ),C=s.facingTurnRate*Math.PI/180*t,A=s.facingSnapDeg*Math.PI/180;if(d>=.35)i.facing=Bc(i.facing,U,C,A);else if(d>=s.facingMinMagnitude&&Math.abs(ke(U-i.facing))>s.facingDeadbandDeg*Math.PI/180){const b=Os(i.facing,U,s.facingSmoothRate,t);i.facing=Bc(i.facing,b,C,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const g=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||gu(n,e)||(i.bodyYaw=Os(i.bodyYaw,g,s.bodyTurnRate,t));let m=i.facing;if(r?m=l?n.gaze.mainYaw:i.facing:f?m=Math.atan2(e.aimX,e.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget&&(m=n.targeting.targetYaw),!r){const U=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(ke(m-i.bodyYaw))>U&&(m=i.moveYaw)}const p=l?n.config.gaze.headTurnRate:s.headTurnRate;let x=Os(i.headYaw,m,p,t);const v=s.maxHeadTurnDeg*Math.PI/180,S=ke(x-i.bodyYaw);S>v?x=i.bodyYaw+v:S<-v&&(x=i.bodyYaw-v),i.headYaw=x}const Jr=1e-6,vu=Math.PI/180;function Qr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function rc(n,t,e){return n<t?t:n>e?e:n}function Ga(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function to(n){const t=n.id,e=n.windowId;Object.assign(n,Ga()),n.id=t,n.windowId=e}function Mu(n){to(n)}function yu(n){to(n.playerLink);for(const t of n.dummies)to(t.link)}function Su(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function eo(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(i.linkWindow=Math.max(i.linkWindow,s),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function Da(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Ga()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function bu(n,t){const e=n.config.links.search,i=n.character.position,s=rc(e.maxAngleDeg,0,180)*vu;let a=0,r=t,o=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,d=c.position.z-i.z,f=Math.hypot(l,d);if(f<Jr||f>e.range)continue;const h=Math.atan2(l,d);Math.abs(ke(h-t))>s||f<o&&(o=f,a=c.id,r=h)}return{id:a,yaw:r,dist:a>0?o:0}}function Eu(n,t,e,i){const s=n.config.links,a=n.playerLink,r=n.character.position,o=Ps(n,t),c=bu(n,o),l=c.id>0?c.yaw:o,d=c.id>0?rc(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=i,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=d,a.travelled=0,a.fromX=r.x,a.fromZ=r.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,s.sharedCooldown),Qr(n,"link-start",a.id)}function wu(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){Da(n);return}if(e.weapon!==n.combat.weapon){Da(n);return}e.timer+=t;const s=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Qr(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Qr(n,"link-end",e.id))}const r=i.windup+i.active+i.recovery;let o=0;if(e.phase==="windup"?o=e.timer:e.phase==="active"?o=i.windup+e.timer:e.phase==="recovery"?o=i.windup+i.active+e.timer:o=r,e.progress=r>0?rc(o/r,0,1):1,e.phase==="active"&&i.active>Jr){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Jr,i.active-e.timer),d=c/l;n.impulse.x=Math.sin(e.facing)*d,n.impulse.z=Math.cos(e.facing)*d}}function Tu(n,t,e){const i=n.config.links,s=n.playerLink,a=n.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!i.enabled||!n.modules.links){s.phase!=="idle"&&Da(n);return}const r=n.combat,o=n.character.sprinting;o&&i.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&i.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,i.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!o&&eo(n,"sprint"),s.prevSprinting=o,wu(n,t);const c=i.moves[r.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&r.phase==="idle"&&!r.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&Eu(n,e,c,r.weapon)}const no=1e-6;function Jn(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ed(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function wd(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=Ed()}function Au(n){return{weapon:Si[Math.max(0,n-1)]??Si[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:Ed()}}function Ru(n,t){return Ps(n,t)}function Cu(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+a,s)}function Td(n,t,e,i){const s=n.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=i,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=Ru(n,t),s.attackProgress=0,s.timings=e,s.attackId+=1,Jn(n,"attack-start",i)}function Ad(n){return Math.max(0,n.config.combat.settle)}function io(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Td(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Ad(n),lunge:Cu(n,i.lunge[e-1]??0)},e)}function Pu(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Td(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Ad(n),lunge:i.lunge},0),Jn(n,"charge-release",e)}function Du(n,t,e){const i=n.combat;if(i.phase==="idle")return;const s=i.timings;i.phaseTimer+=t;let a=0;for(;i.phase!=="idle"&&a++<8;){const c=i.phase==="windup"?s.windup:i.phase==="active"?s.active:i.phase==="recovery"?s.recovery:s.settle;if(i.phaseTimer<c)break;if(i.phaseTimer-=c,i.phase==="windup")i.phase="active",Jn(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",Jn(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&io(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const c=i.timings.recovery;if(c>no&&i.phaseTimer>=c*n.config.combat.cancelWindow){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&io(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}const r=s.windup+s.active+s.recovery;let o=0;i.phase==="windup"?o=i.phaseTimer:i.phase==="active"?o=s.windup+i.phaseTimer:i.phase==="recovery"?o=s.windup+s.active+i.phaseTimer:i.phase==="settle"&&(o=r),i.phase!=="idle"&&(i.attackProgress=r>0?Math.min(1,o/r):1)}function Lu(n,t,e){const i=n.combat,s=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=Si.length){const c=Si[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,wd(n),Da(n),Jn(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,Jn(n,"combo-reset",0))),Du(n,t,e);const a=s.weapons[i.weapon],r=n.dash.phase==="active";if(a.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!r&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(i.phase==="idle"){const d=i.comboWindow>0&&i.comboIndex<a.comboCount?i.comboIndex+1:1;io(n,e,d)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&(!r&&!n.playerLink.consumedAttack&&e.attackPressed&&i.phase==="idle"&&!i.charging&&(i.charging=!0,i.charge=0,Jn(n,"charge-start",0)),i.charging&&e.attackHeld&&(i.charge=Math.min(1,i.charge+t/Math.max(s.bow.maxChargeTime,no))),i.charging&&!r&&(e.attackReleased||!e.attackHeld))){i.charging=!1;const c=i.charge;i.charge=0,c>=s.bow.minChargeToFire&&i.phase==="idle"?Pu(n,e,c):Jn(n,"charge-release",0)}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>no)){const c=i.timings.lunge/i.timings.active;n.impulse.x=Math.sin(i.attackFacing)*c,n.impulse.z=Math.cos(i.attackFacing)*c}}const so=1e-6;function sr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Iu(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function ku(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Hc(n,t,e){return n<t?t:n>e?e:n}function Uu(n,t,e){const i=n.config.dash,a=n.character.position,r=n.config.worldBounds,o=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,d=a.x,f=a.z;for(;l<c-so;){const h=Math.min(c,l+o),u=a.x+t*h,g=a.z+e*h,_=Hc(u,r.minX,r.maxX),m=Hc(g,r.minZ,r.maxZ),p={x:_,y:a.y,z:m};if(sc(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(d=_,f=m,l=h,_!==u||m!==g))break}return{x:d,z:f}}function Fu(n,t,e){const i=n.dash,s=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,eo(n,"roll")),i.cooldown>0){const o=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),o>0&&i.cooldown===0&&sr(n,"dash-ready",0)}const a=n.combat;if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&a.phase==="idle"&&!a.charging&&n.playerLink.phase==="idle"){const o=Jh(n,e),c=o.x,l=o.z,d=n.combat.weapon==="staff";if(i.kind=d?"blink":"roll",i.dirX=c,i.dirZ=l,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=d?s.blinkCooldown:s.rollCooldown,d){const f=Uu(n,c,l);n.character.position.x=f.x,n.character.position.z=f.z,i.toX=f.x,i.toZ=f.z,i.duration=0,i.timer=0,i.phase="idle",s.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),eo(n,"blink"),sr(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(so,s.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*s.rollDistance,i.toZ=i.fromZ+l*s.rollDistance,sr(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const o=Math.max(so,i.timer),c=n.character.position.x,l=n.character.position.z;n.impulse.x=(i.toX-c)/o,n.impulse.z=(i.toZ-l)/o}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const an=1e-6,ao=Math.PI*2,Nu=7,zu=18;function Gc(n,t,e){return n<t?t:n>e?e:n}function Ou(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Vc(n,t,e,i){return n+Ou(t-n)*(1-Math.exp(-Math.max(e,an)*i))}function oc(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Bu(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},s=n.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:vd(),link:Ga()})}return t}function Hu(n){const t=nr.indexOf(n);return nr[(t+1)%nr.length]}function Gu(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],s=t.spawn[e]??{x:i.homeX,z:i.homeZ},a=t.initialModes[e]??i.initialMode;i.mode=a,i.initialMode=a,i.homeX=s.x,i.homeZ=s.z,i.position.x=s.x,i.position.y=0,i.position.z=s.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=s.x,i.targetZ=s.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const r=i.hurt;r.type="none",r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,Mu(i.link)}n.dummyAttackCount=0}function Vu(n,t,e){const i=ir(n)*ao,s=Math.sqrt(ir(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*s,t.targetZ=t.homeZ+Math.sin(i)*s,t.wanderTimer=e.wanderInterval*(.6+ir(n)*.8)}function Xu(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function Wu(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const o=Math.max(Xu(t,i),an);if(t.attackPhaseTimer<o)break;t.attackPhaseTimer-=o,t.attackPhase==="windup"?(t.attackPhase="active",oc(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=i.attackWindup+i.attackActive+i.attackRecovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,r/a)}function $u(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,s=i.x-t.position.x,a=i.z-t.position.z,r=Math.hypot(s,a),o=r>an?s/r:0,c=r>an?a/r:0;let l=0,d=0;if(t.mode==="wander"){const h=t.targetX-t.position.x,u=t.targetZ-t.position.z,g=Math.hypot(h,u);(t.wanderTimer<=0||g<.3)&&Vu(n,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(_,m);p>an&&(l=_/p,d=m/p)}else if(t.mode==="follow")r>e.followStopDistance&&(l=o,d=c);else if(t.mode==="keep-distance"){const h=r-e.keepDistance;h>e.keepDeadZone?(l=o,d=c):h<-e.keepDeadZone?(l=-o,d=-c):(l=-c*e.keepStrafe,d=o*e.keepStrafe)}else t.mode==="attack"&&r>e.attackRange&&t.attackPhase==="idle"&&(l=o,d=c);let f=t.facing;return t.mode==="wander"?Math.hypot(l,d)>an&&(f=Math.atan2(l,d)):r>an&&(f=Math.atan2(o,c)),{x:l,z:d,facing:f}}function Yu(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const m=n.character.position;Math.hypot(m.x-e.position.x,m.z-e.position.z)<=i.attackRange+an&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,oc(n,"dummy-attack",e))}Wu(n,e,t,i);const s=$u(n,e,i),a=1-Math.exp(-Math.max(i.acceleration,an)*t);e.velocity.x+=(s.x*i.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*i.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=Vc(e.bodyYaw,e.facing,Nu,t),e.headYaw=Vc(e.headYaw,e.facing,zu,t);const r=e.position.x,o=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;ic(n.boxes,e.position,i.radius,i.height,c)&&sc(n.boxes,e.position,i.radius,i.height,c)&&(e.position.x=r,e.position.z=o,e.velocity.x=0,e.velocity.z=0);const d=n.config.worldBounds;e.position.x=Gc(e.position.x,d.minX,d.maxX),e.position.z=Gc(e.position.z,d.minZ,d.maxZ);const f=Zr(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+c+an&&(e.position.y=f);const h=Math.hypot(e.position.x-r,e.position.z-o);e.distance+=h;const u=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,u/Math.max(n.config.moveSpeed,an)),_=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),an);e.stride=_,e.gaitPhase=(e.gaitPhase+h/_*ao)%ao}function Zu(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const s=n.dummies[e.dummyClickId-1];s.mode=Hu(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,oc(n,"dummy-mode",s)}for(const s of n.dummies)Yu(n,t,s,i)}const Pi=1e-6,Xc=Math.PI*2;function ar(n,t){return Math.sqrt(n*n+t*t)}function Bs(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function qu(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,wd(n)}function ju(n,t,e){const i=n.config,s=n.character,a=s.position,r=s.velocity;let o=e.moveX,c=e.moveZ;const l=ar(o,c);l>1&&(o/=l,c/=l);const d=n.combat.phase!=="idle",f=n.playerLink.phase!=="idle",h=d||n.dash.phase==="active"||f;s.sprinting=!h&&e.sprintHeld&&l>Pi;const u=i.combat.weapons[n.combat.weapon];let g=u?u.moveMultiplier:1;h?g*=n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=i.abilities.arcane.moveScale);const _=i.moveSpeed*(s.sprinting?i.sprintMultiplier:1)*g;if(h)r.x=o*_,r.z=c*_;else{const H=l>Pi?i.acceleration:i.friction,z=1-Math.exp(-H*t);r.x+=(o*_-r.x)*z,r.z+=(c*_-r.z)*z}e.jumpPressed?s.jumpBuffer=i.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?i.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(r.y=i.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,Bs(n,"jumped",i.jumpSpeed)),n.events.some(H=>H.type==="blink"&&H.tick===n.tick)&&(r.x=0,r.z=0,n.impulse.x=0,n.impulse.z=0);const p=a.x,x=a.z;if(a.x+=(r.x+n.impulse.x+n.playerHurt.knockX)*t,a.z+=(r.z+n.impulse.z+n.playerHurt.knockZ)*t,ic(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight)){if(sc(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight))a.x=p,a.z=x,r.x=0,r.z=0;else{const H=a.x-p,z=a.z-x;Math.abs(H)<Math.abs(r.x*t)*.5&&(r.x=0),Math.abs(z)<Math.abs(r.z*t)*.5&&(r.z=0)}Bs(n,"blocked",1)}const S=i.worldBounds;a.x=Wc(a.x,S.minX,S.maxX),a.z=Wc(a.z,S.minZ,S.maxZ);const U=Zr(n.boxes,a.x,a.z,a.y,i.characterRadius,i.stepHeight,i.fallTolerance);s.grounded&&U>a.y+Pi&&U-a.y<=i.stepHeight+Pi&&(a.y=U,r.y=0,Bs(n,"stepUp",U));const C=a.y;r.y-=i.gravity*t,a.y+=r.y*t;const A=Zr(n.boxes,a.x,a.z,C,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);A>Number.NEGATIVE_INFINITY&&a.y<=A&&r.y<=0?(a.y=A,r.y=0,s.grounded||Bs(n,"landed",A),s.grounded=!0):s.grounded=!1;const T=ar(a.x-p,a.z-x);s.distance+=T;const b=ar(r.x,r.z),y=Math.min(i.strideSpeedCap,b/Math.max(i.moveSpeed,Pi)),D=Math.max(i.strideLength*(1+y*i.strideSpeedGain),Pi);s.stride=D,s.gaitPhase=(s.gaitPhase+T/D*Xc)%Xc}function Wc(n,t,e){return n<t?t:n>e?e:n}const ro=1e-6,$c=2.399963229728653;function gi(n,t,e){return n<t?t:n>e?e:n}function Yc(n,t,e,i,s,a,r,o,c){const l=t.x-n.x,d=t.z-n.z,f=Math.hypot(l,d),h=e+i;if(f>=h)return;let u,g,_;f<ro?(u=o,g=c,_=h):(u=l/f,g=d/f,_=h-f);const m=_+r;n.x-=u*m*s,n.z-=g*m*s,t.x+=u*m*a,t.z+=g*m*a}function Ku(n){const t=n.config.separation,e=n.dummies,i=n.character.position,s=n.config.characterRadius,a=n.config.dummies.radius,r=Math.max(1,Math.floor(t.iterations)),o=Math.max(0,t.slop);for(let d=0;d<r;d++){for(let f=0;f<e.length;f++)for(let h=f+1;h<e.length;h++){const u=(f*3+h)*$c;Yc(e[f].position,e[h].position,a,a,.5,.5,o,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const h=(f+1)*$c;Yc(i,e[f].position,s,a,0,1,o,Math.cos(h),Math.sin(h))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const d of e)ic(n.boxes,d.position,a,n.config.dummies.height,c),d.position.x=gi(d.position.x,l.minX,l.maxX),d.position.z=gi(d.position.z,l.minZ,l.maxZ)}function Ju(n,t,e,i,s,a,r,o){const c=Math.hypot(e,i),l=Math.max(0,o.contactBand),d=gi(o.minScale,0,1);if(c<ro||l<=0||d>=1)return 1;const f=s+r,h=gi(o.approachDot,0,.99);let u=0;for(const g of a){const _=g.position.x-n,m=g.position.z-t,p=Math.hypot(_,m);if(p>=f+l)continue;if(p<ro){u=1;continue}const x=(e*_+i*m)/(c*p);if(x<=h)continue;const v=gi(1-(p-f)/l,0,1),S=gi((x-h)/(1-h),0,1);u=Math.max(u,v*S)}return 1-(1-d)*gi(u,0,1)}function Qu(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Ju(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Zc=1e-6,tf=Math.PI/180;function ef(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function nf(n,t,e){return n<t?t:n>e?e:n}function sf(n,t,e){const i=n.config.targeting,s=n.targeting,a=n.character.position;let r=n.character.facing;Math.hypot(e.moveX,e.moveZ)>Zc&&(r=Math.atan2(e.moveX,e.moveZ));const c=nf(i.maxAngleDeg,0,180)*tf;let l=Number.POSITIVE_INFINITY,d=0,f=0,h=0;for(const u of n.dummies){const g=u.position.x-a.x,_=u.position.z-a.z,m=Math.hypot(g,_);if(m<Zc||m>i.range)continue;const p=Math.atan2(g,_),x=Math.abs(ke(p-r));if(x>c)continue;const v=m-i.frontBias*Math.cos(x);v<l&&(l=v,d=u.id,f=p,h=m)}s.targetId=d,s.targetYaw=f,s.targetDist=h,s.hasTarget=d>0}const Di=1e-6;function qc(n,t,e){return n<t?t:n>e?e:n}function jc(n){return Math.atan2(Math.sin(n),Math.cos(n))}function af(n,t,e){const i=n.config.gaze,s=n.gaze;if(!i.enabled||!n.modules.gaze){s.active=!1,s.mainId=0,s.mainYaw=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}const a=n.character.position,r=(y,D)=>{const H=y.position.x-a.x,z=y.position.z-a.z,X=Math.hypot(H,z);if(X<Di||X>D)return 0;const P=qc((D-X)/Math.max(Di,D-i.nearDistance),0,1);let R=P*(i.modeWeight[y.mode]??.5);return y.attackPhase==="active"&&(R+=i.attackBoost*P),R},o=[];let c=0,l=!1,d=!1,f=!1;for(const y of n.dummies){const D=r(y,i.threatRange),H=y.position.x-a.x,z=y.position.z-a.z,X=Math.hypot(H,z);D>0&&(o.push({id:y.id,x:y.position.x,z:y.position.z,dx:H,dz:z,yaw:Math.atan2(H,z),w:D}),c+=D,X<=i.approachDist&&(i.modeWeight[y.mode]??.5)>=i.hostileModeWeight&&(f=!0)),X>Di&&X<=i.recoveryDist&&(l=!0),(y.attackPhase==="windup"||y.attackPhase==="active")&&X<=i.threatRange&&(d=!0)}const h=c<=0?0:qc(c/(c+Math.max(Di,i.saturation)),0,1),u=o.length>0,g=s.active,_=u&&(e.aimActive&&h>=i.enterThreshold||i.reactToAttack&&d&&h>=i.enterThreshold||i.reactToApproach&&f),m=i.hurtHoldSec>Di&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=g&&(l||m);if(s.active=_||p,!s.active){s.mainId=0,s.mainYaw=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}if(o.length===0)return;o.sort((y,D)=>D.w-y.w);const x=o.slice(0,Math.max(1,i.maxThreats)),v=o[0],S=Math.atan2(v.dx,v.dz),U=i.behindAngleDeg*Math.PI/180,C=n.character.bodyYaw;let A=0,T=0,b=0;for(const y of x){const D=Math.abs(jc(y.yaw-S))/Math.PI;let H=y.w/(1+Math.max(i.spreadFalloff,0)*D*D);y!==v&&i.behindFalloff<1&&Math.abs(jc(y.yaw-C))>U&&(H*=Math.max(i.behindFalloff,0)),A+=y.x*H,T+=y.z*H,b+=H}s.mainId=v.id,s.mainYaw=S,s.centroidYaw=b>Di?Math.atan2(A/b-a.x,T/b-a.z):S,s.threatCount=o.length,s.threat=h}function rf(){return{active:!1,mainId:0,mainYaw:0,centroidYaw:0,threatCount:0,threat:0}}function of(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:fu(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Au(1),playerLink:Ga(),abilities:su(),impulse:{x:0,z:0},targeting:ef(),turnInPlace:pu(),playerHurt:vd(),hitCount:0,dash:{...Iu(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Md(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:rf(),dummies:Bu(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function cf(n){qu(n),Gu(n),yu(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=xd,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,au(n),ku(n),yd(n),jr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Kc(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){cf(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?sf(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),Tu(n,t,e),n.modules.combat&&Lu(n,t,e),n.modules.dash&&Fu(n,t,e),n.modules.movement&&ju(n,t,e),n.modules.gaze&&af(n,t,e),n.modules.orientation&&xu(n,t,e),_u(n,t,e),n.modules.dummies&&Zu(n,t,e),Qh(n,t),Su(n,t),n.modules.abilities&&hu(n,t,e),n.modules.dummies&&(iu(n,t),n.modules.separation&&(Ku(n),Qu(n))),n.modules.camera?uu(n):yd(n),n}function lf(n){let t=0;return{frame(e,i,s,a,r){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const o=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=o&&l<c;){const d=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Kc(n,o,d),r&&r(),t-=o,l++}return l>=c&&(t=0),l},singleStep(e){Kc(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Rd={slopPx:12,longPressMs:450,doubleTapMs:280};function df(n,t,e=Rd.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,s=n.dy/n.distance,a=t.rightX*i+t.forwardX*-s,r=t.rightZ*i+t.forwardZ*-s,o=Math.hypot(a,r);return o<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:a/o,worldZ:r/o}}function ri(n,t,e,i,s,a){const r=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:r,angleDeg:r>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function hf(n=Rd){const t=new Map,e=new Map,i=s=>t.get(s);return{begin(s,a,r,o,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:r,startY:o,x:r,y:o,startedAt:c,dragging:!1,longFired:!1}),ri(s,"press",0,0,0,1)},move(s,a,r,o){const c=i(s);if(!c)return null;c.x=a,c.y=r;const l=a-c.startX,d=r-c.startY;return!c.dragging&&Math.hypot(l,d)>=n.slopPx?(c.dragging=!0,ri(c.button,"drag",l,d,o-c.startedAt,1)):null},end(s,a,r,o){const c=i(s);if(!c)return null;t.delete(s),c.x=a,c.y=r;const l=a-c.startX,d=r-c.startY,f=o-c.startedAt,h=Math.hypot(l,d);if(c.dragging||c.longFired||h>=n.slopPx)return ri(c.button,"release",l,d,f,1);const u=e.get(c.button);return u!==void 0&&o-u.at<=n.doubleTapMs&&Math.hypot(a-u.x,r-u.y)<=n.slopPx*2?(e.delete(c.button),ri(c.button,"doubleTap",l,d,f,2)):(e.set(c.button,{at:o,x:a,y:r}),ri(c.button,"tap",l,d,f,1))},cancel(s,a){const r=i(s);return r?(t.delete(s),ri(r.button,"cancel",r.x-r.startX,r.y-r.startY,a-r.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=n.longPressMs)return a.longFired=!0,ri(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const rr=.001,uf=18;function oo(n,t,e){return n<t?t:n>e?e:n}function co(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function ff(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function pf(n,t,e,i,s=uf){const a=ff(t);if(!a)return{state:co(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const r=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),o=s,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,d=c;if(!Number.isFinite(r)||r<rr)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=o<=0;return{state:{active:!0,lastDist:r,armDist:r,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<rr?{state:{active:!0,lastDist:r,armDist:r,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(r-n.armDist)<o?{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<rr)return{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=r/n.lastDist,h=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,h):1;return{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!0},scale:oo(Number.isFinite(u)?u:1,l,d),started:!1,ended:!1,armedNow:!1,pinching:!0}}function mf(n,t,e,i){const s=Math.min(e,i),a=Math.max(e,i),r=Number.isFinite(t)&&t>0?t:1,o=n*r;return Number.isFinite(o)?oo(o,s,a):oo(n,s,a)}function gf(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function _f(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const or=["jump","sprint","reset","attack","skill2"],xf=8,vf=26,cr=16,Jc=20,Qc=140,Mf=18,yf=16,Sf=400,bf=1.0001;function va(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function Ef(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&va(e)}function wf(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:s}=n,a=()=>Math.max(8,t());let r=null,o=0,c=0,l=0,d=0,f=0,h=0,u=-1,g=0,_=null,m=-1,p=0,x=0,v=0,S=0,U=!1,C=0,A=1,T=0,b=null,y=0,D=0,H=!1,z=null,X=null,P=0,R=0,V=0,B=0,Z=!1,J=!0,rt=-1;const ft=hf({slopPx:Jc,longPressMs:450,doubleTapMs:350});let vt=[],$=null;const tt=new Set;function gt(I){I&&vt.push(I)}const j=new Map;let pt=co(),Dt=!1,Ft=1;function Nt(){const I=Array.from(j.values()),Q=s(),st=pf(pt,I,Q.pinchGain,Q.maxStepRatio,Mf);if(pt=st.state,Dt=st.pinching,st.scale!==1&&(Ft*=st.scale),st.started||st.armedNow)b=null,H=!0,z=null;else if(st.ended&&r===null&&I.length===1){const xt=I[0];r=xt.id,o=xt.x,c=xt.y,l=0,d=0,f=xt.x,h=xt.y,U=!1,C=0,A=1,T=0,performance.now(),b=null,H=!0,z=null}}const Et={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Tt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let O=0,Gt=0;const Pt={},It=new Set,q=[];function ct(){for(const I of or)Pt[I]!==void 0&&(Pt[I]=void 0),G(I);ft.reset(),tt.clear(),j.clear(),pt=co(),Dt=!1,r=null,l=0,d=0,f=0,h=0,U=!1,C=0,A=1,T=0,p=0,x=0,v=0,S=0,_=null,m=-1,b=null,H=!1,z=null,X=null,rt=-1,V=0,B=0,Z=!1,J=!0}const dt=()=>{document.hidden&&ct()},w=I=>{if(I.clientX===0&&I.clientY===0){g++;return}if(va(I.target)||Ef(I.clientX,I.clientY)){tt.add(I.pointerId);return}if(tt.delete(I.pointerId),j.set(I.pointerId,{id:I.pointerId,x:I.clientX,y:I.clientY}),r===null&&!Dt){_=null,m=-1,r=I.pointerId,o=I.clientX,c=I.clientY,l=0,d=0,f=I.clientX,h=I.clientY,performance.now();const Q=Number.isFinite(I.screenX)&&Number.isFinite(I.screenY)&&(I.screenX!==0||I.screenY!==0);U=Q,C=0,A=1,T=0,p=Q?I.screenX:0,x=Q?I.screenY:0,v=p,S=x,b=I.pointerId,y=I.clientX,D=I.clientY,H=!1}Nt()},M=I=>{if(I.pointerId===X&&(I.pointerType==="mouse"&&I.buttons===0||I.clientX===0&&I.clientY===0&&(P!==0||R!==0)||(J?(V=I.clientX-P,B=I.clientY-R):(P=I.clientX,R=I.clientY,J=!0,V=0,B=0))),gt(ft.move(I.pointerId,I.clientX,I.clientY,performance.now())),!tt.has(I.pointerId)&&j.has(I.pointerId)&&(j.set(I.pointerId,{id:I.pointerId,x:I.clientX,y:I.clientY}),Nt()),tt.has(I.pointerId)||I.pointerId!==r)return;const Q=performance.now();if(_===I.pointerId&&Q-m<150){g++;return}const st=I.clientX,xt=I.clientY;if(st===0&&xt===0&&(o!==0||c!==0)){g++;return}const Lt=st-f,F=xt-h,yt=Number.isFinite(I.screenX)&&Number.isFinite(I.screenY),K=yt?I.screenX:0,at=yt?I.screenY:0,St=yt&&(K!==0||at!==0),bt=K-v,Ht=at-S;if(U&&St){const se=Math.hypot(bt,Ht),le=Math.hypot(Lt,F);if(se>3){if(C=0,T<30&&le>6&&bt*Lt+Ht*F>.7*se*le){const Re=se/le;Re>.2&&Re<5&&(A+=(Re-A)*.3,T++)}}else le>12&&(C++,C>=2&&(U=!1))}const jt=Math.hypot(Lt,F);if(!U){const se=u<0?Number.POSITIVE_INFINITY:Q-u,le=St?Math.hypot(bt,Ht):1/0;jt>28&&(se<200||le<jt*.4)&&(o+=Lt,c+=F,g++)}f=st,h=xt,v=K,S=at,I.pointerId===b&&Math.hypot(I.clientX-y,I.clientY-D)>xf&&(H=!0);let ne,Vt;U&&St?(ne=(K-p)/A,Vt=(at-x)/A):(ne=st-o,Vt=xt-c);const oe=Math.hypot(ne,Vt),pe=a();oe>pe&&(ne*=pe/oe,Vt*=pe/oe);const we=Math.hypot(l,d),Pe=Math.hypot(ne,Vt);if(we>10&&Pe>10){const se=Math.abs(Math.atan2(l*Vt-d*ne,l*ne+d*Vt)),le=Math.max(we,Pe)*se,Re=Math.max(Math.hypot(Lt,F),Math.hypot(bt,Ht)/Math.max(.2,A));if(se>.6&&Re<Math.max(6,le*.5)){g++;return}}l=ne,d=Vt};function G(I){if(!Et[I])return;Et[I]=!1,I==="attack"&&(Tt.attackReleased=!0);const Q=document.getElementById(`btn-${I}`);Q==null||Q.classList.remove("is-down")}function et(){r!==null&&(_=r,m=performance.now(),r=null,l=0,d=0,f=0,h=0,U=!1,C=0,A=1,T=0,p=0,x=0,v=0,S=0)}const ot=I=>{const Q=j.delete(I.pointerId),st=tt.delete(I.pointerId);Q&&Nt(),I.pointerId===X&&(X=null,Z?rt=performance.now():(V=0,B=0,rt=-1)),gt(ft.end(I.pointerId,I.clientX,I.clientY,performance.now()));for(const Ut of or)Pt[Ut]===I.pointerId&&(Pt[Ut]=void 0,G(Ut));const xt=!Q&&!st&&j.size<=1&&r!==null;(I.pointerId===r||j.size===0||xt)&&et(),!st&&I.pointerId===b&&(!H&&!va(I.target)&&(z={x:I.clientX,y:I.clientY}),b=null)};for(const I of or){const Q=document.getElementById(`btn-${I}`);if(!Q)continue;const st=I==="attack"||I==="skill2",xt=F=>{if(F.preventDefault(),Pt[I]===void 0){Pt[I]=F.pointerId,Et[I]=!0,I==="jump"&&(Tt.jump=!0),I==="reset"&&(Tt.reset=!0),I==="sprint"&&(Tt.sprintPressed=!0),I==="attack"&&(Tt.attackPressed=!0),I==="skill2"&&(Tt.skill2=!0),Q.classList.add("is-down"),gt(ft.begin(I,F.pointerId,F.clientX,F.clientY,performance.now()));try{Q.setPointerCapture(F.pointerId)}catch{}st&&(X=F.pointerId,P=F.clientX,R=F.clientY,J=!(F.clientX===0&&F.clientY===0),V=0,B=0,Z=!1,rt=-1)}},Ut=F=>{Pt[I]===F.pointerId&&(Pt[I]=void 0,G(I),gt(ft.end(F.pointerId,F.clientX,F.clientY,performance.now())))},Lt=F=>{Pt[I]===F.pointerId&&(Pt[I]=void 0,G(I),gt(ft.cancel(F.pointerId,performance.now())))};Q.addEventListener("pointerdown",xt),Q.addEventListener("pointerup",Ut),Q.addEventListener("pointercancel",Lt),q.push(()=>{Q.removeEventListener("pointerdown",xt),Q.removeEventListener("pointerup",Ut),Q.removeEventListener("pointercancel",Lt)})}const nt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const I of nt){const Q=st=>{st.preventDefault(),O=Number(I.dataset.weapon)||0};I.addEventListener("pointerdown",Q),q.push(()=>I.removeEventListener("pointerdown",Q))}const lt=I=>{const Q=I.key.toLowerCase();if((Q===" "||Q.startsWith("arrow"))&&I.preventDefault(),It.has(Q))return;It.add(Q),Q===" "&&(Tt.jump=!0),Q==="r"&&(Tt.reset=!0),Q==="shift"&&(Tt.sprintPressed=!0),Q==="j"&&(Tt.attackPressed=!0),Q==="k"&&(Tt.skill2=!0),Q>="1"&&Q<="5"&&(O=Number(Q)),Q>="6"&&Q<="9"&&(Gt=Number(Q)-5);const st=Math.max(bf,s().keyStep||1.12);(Q==="="||Q==="+")&&(Ft*=st),(Q==="-"||Q==="_")&&(Ft/=st)},ut=I=>{const Q=I.key.toLowerCase();It.has(Q)&&(It.delete(Q),Q==="j"&&(Tt.attackReleased=!0))},wt=I=>{if(va(I.target))return;I.preventDefault();const Q=I.deltaMode===1?I.deltaY*yf:I.deltaMode===2?I.deltaY*Sf:I.deltaY;Ft*=gf(Q,s().wheelStep)},Xt=I=>{I.preventDefault()},mt=()=>{u=performance.now()};window.addEventListener("resize",mt),window.addEventListener("orientationchange",mt);const Rt=typeof window<"u"?window.visualViewport:null;return Rt&&(Rt.addEventListener("resize",mt),Rt.addEventListener("scroll",mt)),window.addEventListener("pointerdown",w),window.addEventListener("pointermove",M),window.addEventListener("pointerup",ot),window.addEventListener("pointercancel",ot),window.addEventListener("blur",ct),document.addEventListener("visibilitychange",dt),window.addEventListener("keydown",lt),window.addEventListener("keyup",ut),window.addEventListener("wheel",wt,{passive:!1}),window.addEventListener("gesturestart",Xt),{peekStick(){return{id:r,held:r!==null,originX:o,originY:c,x:f,y:h,dx:f-o,dy:h-c,radius:a(),badMoves:g,screenOk:U,originSX:p,originSY:x,screenX:v,screenY:S,scale:A}},peekAim(){const I=performance.now(),Q=Math.hypot(V,B),st=X!==null||rt>=0&&I-rt<Qc;if(!(st&&Z&&Q>=cr))return{active:!1,holding:st,x:0,z:0,dx:V,dy:B};const Ut=i(),Lt=V/Q,F=B/Q,yt=Ut.rightX*Lt+Ut.forwardX*-F,K=Ut.rightZ*Lt+Ut.forwardZ*-F,at=Math.hypot(yt,K)||1;return{active:!0,holding:st,x:yt/at,z:K/at,dx:V,dy:B}},sample(){var rn;const I=a();let Q=r!==null?Math.max(-1,Math.min(1,l/I)):0,st=r!==null?Math.max(-1,Math.min(1,d/I)):0,xt=0,Ut=0;(It.has("a")||It.has("arrowleft"))&&(xt-=1),(It.has("d")||It.has("arrowright"))&&(xt+=1),(It.has("w")||It.has("arrowup"))&&(Ut-=1),(It.has("s")||It.has("arrowdown"))&&(Ut+=1),Q+=xt,st+=Ut;let Lt=Math.hypot(Q,st);Lt>1&&(Q/=Lt,st/=Lt,Lt=1);const F=Q,yt=st;Lt<e&&(Q=0,st=0);const K=i();let at=K.rightX*Q+K.forwardX*-st,St=K.rightZ*Q+K.forwardZ*-st;const bt=Math.hypot(at,St);bt>1&&(at/=bt,St/=bt);const Ht=performance.now();gt(ft.poll(Ht));const jt=Math.hypot(V,B);X!==null&&(jt>=vf?Z=!0:jt<cr&&(Z=!1));const ne=X!==null||rt>=0&&Ht-rt<Qc,Vt=ne&&Z&&jt>=cr;let oe=0,pe=0;if(Vt){const He=V/jt,on=B/jt,Ye=K.rightX*He+K.forwardX*-on,cn=K.rightZ*He+K.forwardZ*-on,Dn=Math.hypot(Ye,cn)||1;oe=Ye/Dn,pe=cn/Dn}!ne&&X===null&&(V=0,B=0,rt=-1,Z=!1);const we=z;z=null;const Pe=Ft;Ft=1;const se={moveX:at,moveZ:St,jumpPressed:Tt.jump,sprintHeld:Et.sprint||It.has("shift"),sprintPressed:Tt.sprintPressed,resetPressed:Tt.reset,attackPressed:Tt.attackPressed,attackHeld:Et.attack||It.has("j"),attackReleased:Tt.attackReleased,skill2Pressed:Tt.skill2,weaponSlot:O,dummyClickId:Gt,aimX:oe,aimZ:pe,aimActive:Vt};Tt.jump=!1,Tt.reset=!1,Tt.sprintPressed=!1,Tt.attackPressed=!1,Tt.attackReleased=!1,Tt.skill2=!1,O=0,Gt=0;const le=vt.map(He=>df(He,K,Jc));vt=[],le.length>0&&($=le[le.length-1]);const Re=r!==null?"pointer":It.size>0?"keyboard":"idle";return{intents:se,stickX:Q,stickY:st,stickRawX:F,stickRawY:yt,stickHeld:r!==null,stickId:r,stickOriginX:o,stickOriginY:c,stickPxX:f,stickPxY:h,stickBad:g,stickScreenOk:U,stickOriginSX:p,stickOriginSY:x,stickScreenX:v,stickScreenY:S,stickScale:A,stickVpTop:((rn=_f())==null?void 0:rn.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:V,aimDY:B,source:Re,tap:we,zoomScale:Pe,gestures:le,lastGesture:$}},dispose(){window.removeEventListener("pointerdown",w),window.removeEventListener("pointermove",M),window.removeEventListener("pointerup",ot),window.removeEventListener("pointercancel",ot),window.removeEventListener("blur",ct),document.removeEventListener("visibilitychange",dt),window.removeEventListener("keydown",lt),window.removeEventListener("keyup",ut),window.removeEventListener("wheel",wt),window.removeEventListener("resize",mt),window.removeEventListener("orientationchange",mt),Rt&&(Rt.removeEventListener("resize",mt),Rt.removeEventListener("scroll",mt)),window.removeEventListener("gesturestart",Xt),ft.reset();for(const I of q)I()}}}const La=1,Ia=2,ka=4,Cd=8,Ua=16,Rs=32,Pd=64,Dd=128,Tf=[[La,"atk"],[Ia,"dash"],[ka,"link"],[Cd,"air"],[Ua,"hurt"],[Rs,"aim"],[Pd,"spr"],[Dd,"chan"]];function Li(n){if(n===0)return"-";const t=Tf.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Af=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Rf=0,Cf=15,lr=19,Pf=21,Df=22,Lf=23,If=24,yn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Ve=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,ln=n=>Math.round(n*180/Math.PI*10)/10,dr=Math.PI*2;function ms(n){let t=n%dr;return t>Math.PI&&(t-=dr),t<-Math.PI&&(t+=dr),t}function kf(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=La),n.dash.phase!=="idle"&&(e|=Ia),n.playerLink.phase!=="idle"&&(e|=ka),n.character.grounded||(e|=Cd),n.playerHurt.type!=="none"&&(e|=Ua),t.intents.aimActive&&(e|=Rs),n.character.sprinting&&(e|=Pd),n.abilities.channeling&&(e|=Dd),e}function Uf(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Ff(n){const t={sampleHz:n.sampleHz??yn.sampleHz,sampleCapacity:n.sampleCapacity??yn.sampleCapacity,eventCapacity:n.eventCapacity??yn.eventCapacity,anomalyCapacity:n.anomalyCapacity??yn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??yn.dirJumpDeg,aimDropDeg:n.aimDropDeg??yn.aimDropDeg,freezeMs:n.freezeMs??yn.freezeMs,freezeSpeed:n.freezeSpeed??yn.freezeSpeed,stickLostMs:n.stickLostMs??yn.stickLostMs,spikeMs:n.spikeMs??yn.spikeMs},e=n.meta,i=[],s=[],a=[],r={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let o=!0,c=-1,l=-1e9,d=null,f=0,h=0,u="",g=-1,_=-1,m=-1,p=0,x=-1e9,v=-1,S={},U=null,C=0,A=0,T=0,b=0;function y(P,R){const V=1/t.sampleHz,B=P[Rf];B-l<V-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(P),l=B)}function D(P,R,V,B,Z,J){const rt=S[P]??-1e9;if(R-rt<1.2)return;if(S[P]=R,P==="frameSpike"){let vt=0;for(const $ of a)$.kind==="frameSpike"&&vt++;if(vt>=6)return}a.length>=t.anomalyCapacity&&a.shift();let ft=i.slice(-7);J&&(ft.length===0||ft[ft.length-1]!==J)&&(ft=[...ft.slice(-6),J]),a.push({kind:P,t:Ve(R),tick:V,ms:Math.round(B),detail:Z,ctx:ft}),P==="dirJump"?r.dirJumps++:P==="aimDrop"?r.aimDrops++:P==="moveFreeze"?r.freezes++:P==="stickLost"?r.stickLosts++:P==="stickJump"?r.stickJumps++:P==="stickBad"?r.stickBads++:P==="stickDrift"&&r.stickDrifts++}function H(P,R,V,B){s.length>=t.eventCapacity&&s.shift(),s.push({t:Ve(V),tick:B,k:P,d:R})}function z(P){switch(P.type){case"attack-start":r.attacks++;break;case"hit":r.hits++;break;case"player-hurt":r.hurts++;break;case"link-start":r.links++;break;case"link-hit":r.linkHits++;break;case"roll":r.rolls++;break;case"blink":r.blinks++;break;case"channel-start":r.channels++;break;case"projectile-fire":r.bolts++;break;case"ring-place":r.rings++;break;case"charge-start":r.bowCharges++;break;case"jumped":r.jumps++;break;case"reset":r.resets++;break;case"blocked":x=P.tick;break}}function X(){const P=r,R=P.wallMs/1e3,V=P.gestures,B=ft=>Object.entries(V).filter(([vt])=>vt.endsWith(`.${ft}`)).reduce((vt,[,$])=>vt+$,0),Z=[];if(Z.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),Z.push(`运行 ${R.toFixed(1)}s / ${P.frames} 帧 · ${P.fps.toFixed(1)}fps · 最大 ${P.dtMax.toFixed(0)}ms · 尖峰 ${P.spikes} · 步 ${P.steps}`),Z.push(`摇杆活跃 ${R>0?Math.round(P.stickActiveMs/1e3/R*100):0}% · 手势 按下 ${B("press")}（单击 ${B("tap")} / 双击 ${B("doubleTap")} / 拖拽 ${B("drag")} / 长按 ${B("longPress")} / 打断 ${B("cancel")} / 拖放 ${B("release")}）`),Z.push(`攻击 ${P.attacks}(中${P.hits}) · 受击 ${P.hurts} · 派生 ${P.links}(中${P.linkHits}) · 翻滚 ${P.rolls} 闪现 ${P.blinks} · 跳 ${P.jumps} · 复位 ${P.resets}`),Z.push(`法杖 引导${P.channels} 飞弹${P.bolts} 电环${P.rings} · 弓蓄力${P.bowCharges} · 当前武器 ${u||"-"}`),Z.push(`异常 ${P.dirJumps+P.aimDrops+P.freezes+P.stickLosts+P.stickJumps+P.stickBads+P.stickDrifts}（dir ${P.dirJumps} / aim ${P.aimDrops} / freeze ${P.freezes} / stick ${P.stickLosts} / stickJump ${P.stickJumps} / 坏指针 ${P.stickBads} / 坐标漂移 ${P.stickDrifts}） · 掉帧尖峰 ${P.spikes}`+(P.inTurns>0?` · 输入转向 ${P.inTurns} 次（最大 ${P.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const ft of a.slice(-6)){Z.push(`· ${ft.kind} @t${ft.t.toFixed(2)} tick${ft.tick} ${ft.ms>0?`${ft.ms}ms `:""}${ft.detail}`);const vt=ft.ctx.map(tt=>String(tt[Cf])).join(" "),$=ft.ctx.map(tt=>tt[lr]===""||tt[lr]==null?".":String(tt[lr])).join(" ");if(Z.push(`  yaw ${vt}`),Z.push(`  in  ${$}`),ft.kind==="stickJump"||ft.kind==="stickBad"||ft.kind==="stickLost"){const tt=ft.ctx.map(j=>`${j[Pf]},${j[Df]}`).join(" "),gt=ft.ctx.map(j=>`${j[Lf]},${j[If]}`).join(" ");Z.push(`  o   ${tt}`),Z.push(`  p   ${gt}`)}}if(s.length>0){Z.push("最近事件：");for(const ft of s.slice(-12))Z.push(`  ${ft.t.toFixed(2)} ${ft.k} ${ft.d}`.trimEnd())}const J=r.screenFrames>0?`屏幕 screenX/Y（${r.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",rt=r.screenFrames>0&&r.clientFrames>0?` / client 回退 ${r.clientFrames} 帧`:"";return Z.push(`摇杆坐标源 ${J}${rt}`),Z.push(`UA ${e.ua}`),Z.join(`
`)}return{sample(P,R,V,B=0){r.frames++,R.stickHeld&&(R.stickScreenOk?r.screenFrames++:r.clientFrames++),r.steps+=B,r.wallMs+=V,V>r.dtMax&&(r.dtMax=V),r.fps=r.wallMs>0?r.frames*1e3/r.wallMs:0,r.simS=P.time;const Z=P.time;if(c<0&&(c=Z),T=Z,b=P.tick,!o)return;const J=P.character,rt=Math.hypot(R.stickX,R.stickY),ft=Math.hypot(J.velocity.x,J.velocity.z);u=P.combat.weapon;const vt=kf(P,R),$=J.facing,gt=Math.hypot(R.intents.moveX,R.intents.moveZ)>.05?Math.atan2(R.intents.moveX,R.intents.moveZ):null;rt>.2&&(r.stickActiveMs+=V);const j=[Ve(Z),P.tick,Math.round(V*10)/10,Ve(R.stickX),Ve(R.stickY),Ve(R.stickRawX),Ve(R.stickRawY),R.stickHeld?1:0,R.source.slice(0,8),Ve(R.intents.moveX),Ve(R.intents.moveZ),Ve(J.position.x),Ve(J.position.z),Ve(J.velocity.x),Ve(J.velocity.z),ln($),ln(J.bodyYaw),vt,Ve(J.stride),gt===null?"":ln(gt),R.stickId===null?"":R.stickId,Math.round(R.stickOriginX),Math.round(R.stickOriginY),Math.round(R.stickPxX),Math.round(R.stickPxY),R.stickBad,Math.round(R.stickVpTop),Math.round(R.stickOriginSX),Math.round(R.stickOriginSY),Math.round(R.stickScreenX),Math.round(R.stickScreenY),R.stickScreenOk?1:0,Math.round(R.stickScale*100)/100];y(j);const pt=Z*1e3<v;if(V>t.spikeMs&&!pt&&Z-c>.6&&(r.spikes++,D("frameSpike",Z,P.tick,V,`dt ${V.toFixed(0)}ms fl=${Li(vt)}`,j)),d!==null&&!pt){const ct=Math.abs(ln(ms($-d))),dt=Math.abs(ln(ms(J.moveYaw-f))),w=(h|vt)&(La|Ia|ka|Ua)|vt&Rs,M=gt===null?null:Math.abs(ln(ms($-gt))),G=gt===null||d===null?null:Math.abs(ln(ms(d-gt))),et=M!==null&&G!==null&&M<G-.5,ot=(h&Rs)!==0&&(vt&Rs)===0&&gt===null,nt=M!==null&&(M<=12||et);ct>t.aimDropDeg&&ot?D("aimDrop",Z,P.tick,0,`${ct.toFixed(0)}° @aim→none stick(${R.stickX.toFixed(2)},${R.stickY.toFixed(2)}) aim(${R.aimDX.toFixed(0)},${R.aimDY.toFixed(0)}) fl=${Li(vt)}`,j):ct>t.dirJumpDeg&&w===0&&!ot&&(nt?(r.inTurns++,ct>r.inTurnMax&&(r.inTurnMax=ct)):D("dirJump",Z,P.tick,0,`${ct.toFixed(0)}° res${M===null?" 无输入":`${M.toFixed(0)}°`} yaw ${ln(d)}→${ln($)} in ${gt===null?".":ln(gt)}° mvΔ${dt.toFixed(0)}° aim(${R.aimDX.toFixed(0)},${R.aimDY.toFixed(0)}) fl=${Li(h)}→${Li(vt)}`,j))}const Dt=(vt&(La|Ia|ka|Ua))!==0,Ft=P.tick-x<30;rt>.35&&ft<t.freezeSpeed&&!Dt&&!Ft?(g<0&&(g=Z),Z-g>=t.freezeMs/1e3&&Z>=_&&(D("moveFreeze",Z,P.tick,(Z-g)*1e3,`stick(${R.stickX.toFixed(2)},${R.stickY.toFixed(2)}) v${ft.toFixed(2)} ${R.source} fl=${Li(vt)}`,j),_=Z+1.5,g=-1)):g=-1,R.stickHeld?(rt>p&&(p=rt),p>.35&&rt<.06?(m<0&&(m=Z),Z-m>=t.stickLostMs/1e3&&(D("stickLost",Z,P.tick,(Z-m)*1e3,`raw(${R.stickRawX.toFixed(2)},${R.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Li(vt)}`,j),m=-1,p=0)):m=-1):(p=0,m=-1);const Nt=R.stickScale>.2&&R.stickScale<5?R.stickScale:1,Et=R.stickScreenOk,Tt=Et?R.stickScreenX/Nt:R.stickPxX,O=Et?R.stickScreenY/Nt:R.stickPxY,Gt=Et?R.stickOriginSX/Nt:R.stickOriginX,Pt=Et?R.stickOriginSY/Nt:R.stickOriginY,It=Tt-Gt,q=O-Pt;if(R.stickHeld&&R.stickId!==null){const ct=U;if(ct&&ct.held&&ct.id===R.stickId){const dt=Math.hypot(ct.dx,ct.dy),w=Math.hypot(It,q),M=Math.max(dt,w),G=Math.hypot(Tt-ct.cx,O-ct.cy),et=Math.abs(ln(ms(Math.atan2(q,It)-Math.atan2(ct.dy,ct.dx)))),ot=M*et*Math.PI/180,nt=Math.hypot(Gt-ct.ox,Pt-ct.oy);if(M>18&&et>35&&G<Math.max(5,ot*.35)&&D("stickJump",Z,P.tick,0,`Δ${et.toFixed(0)}° 手指只动${G.toFixed(0)}px(弧长应${ot.toFixed(0)}px) o(${Math.round(ct.ox)},${Math.round(ct.oy)})→(${Math.round(Gt)},${Math.round(Pt)}) 原点位移${nt.toFixed(0)}px p(${Math.round(Tt)},${Math.round(O)}) raw(${Math.round(It)},${Math.round(q)}) id${R.stickId} ${Et?"src=屏幕":"src=client"}`,j),Et&&ct.screenOk){const lt=Math.hypot(R.stickPxX-ct.x,R.stickPxY-ct.y),ut=Math.hypot((R.stickScreenX-ct.sx)/Nt,(R.stickScreenY-ct.sy)/Nt);C+=lt-ut,Math.abs(C)>20&&(D("stickDrift",Z,P.tick,0,`client 相对屏幕漂移 ${C>0?"+":""}${C.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(R.stickPxX)},${Math.round(R.stickPxY)}) screen(${Math.round(R.stickScreenX)},${Math.round(R.stickScreenY)})`,j),C=0)}}U={id:R.stickId,ox:Gt,oy:Pt,cx:Tt,cy:O,x:R.stickPxX,y:R.stickPxY,sx:R.stickScreenX,sy:R.stickScreenY,dx:It,dy:q,held:!0,screenOk:Et}}else U=null,C=0;if(R.stickBad>A){const ct=R.stickBad-A;D("stickBad",Z,P.tick,0,`拦截 ${ct} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${R.stickBad}）o(${Math.round(R.stickOriginX)},${Math.round(R.stickOriginY)}) p(${Math.round(R.stickPxX)},${Math.round(R.stickPxY)}) id${R.stickId??"-"}`,j)}A=R.stickBad,d=$,f=J.moveYaw,h=vt},event(P,R){const V=Uf(P);z(P),o&&(P.type==="dash-ready"||P.type==="combo-reset"||P.type==="stepUp"||H(P.type,V,R,P.tick))},gesture(P){const R=`${P.button}.${P.kind}`;r.gestures[R]=(r.gestures[R]??0)+1,o&&(P.kind==="longPress"||P.kind==="doubleTap"||P.kind==="drag"||P.kind==="cancel")&&H(`g:${P.kind}`,`${P.button} ${P.heldMs.toFixed(0)}ms d${P.distance.toFixed(0)}px ${P.angleDeg.toFixed(0)}°`,T,b)},suspend(P){v=T*1e3+P,g=-1,m=-1},setEnabled(P){o=P,P||(d=null,U=null,g=-1,m=-1)},clear(){i.length=0,s.length=0,a.length=0,S={},l=-1e9,d=null,h=0,g=-1,m=-1,p=0,r.frames=0,r.wallMs=0,r.dtMax=0,r.spikes=0,r.stickActiveMs=0,r.attacks=0,r.hits=0,r.hurts=0,r.links=0,r.linkHits=0,r.rolls=0,r.blinks=0,r.channels=0,r.bolts=0,r.rings=0,r.bowCharges=0,r.jumps=0,r.resets=0,r.dirJumps=0,r.aimDrops=0,r.inTurns=0,r.inTurnMax=0,r.freezes=0,r.stickLosts=0,r.stickJumps=0,r.stickBads=0,r.stickDrifts=0,r.screenFrames=0,r.clientFrames=0,C=0,U=null,A=0;for(const P of Object.keys(r.gestures))delete r.gestures[P]},status(){const P=r.simS,R=a.some(V=>P-V.t<8&&(V.kind==="dirJump"||V.kind==="aimDrop"||V.kind==="moveFreeze"||V.kind==="stickLost"||V.kind==="stickJump"||V.kind==="stickBad"||V.kind==="stickDrift"));return{durationS:r.wallMs/1e3,frames:r.frames,events:s.length,anomalies:a.length,alert:R,enabled:o}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...r,gestures:{...r.gestures}},columns:Af,samples:i.slice(),events:s.slice(),anomalies:a.slice()}},summary:X}}const Nf={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:20,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.82},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:7,headTurnRate:30,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},zf={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},Of={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:56,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},targeting:{ringColor:"#ffd166",ringRadius:.58},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],labelBg:"rgba(12,18,26,0.82)",attackArcColor:"#ff6b5e"}},Bf={core:Nf,scene:zf,view:Of};function cc(n){return JSON.parse(JSON.stringify(n))}const lc=Bf,Hf=cc(lc.core),Gf=cc(lc.scene),dn=cc(lc.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class An{constructor(t,e,i,s,a="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),An.nextNameID=An.nextNameID||0,this.$name.id=`lil-gui-name-${++An.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Vf extends An{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function lo(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Xf={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:lo,toHexString:lo},Ls={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},Wf={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Ls.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Ls.toHexString(s)}},$f={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Ls.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Ls.toHexString(s)}},Yf=[Xf,Ls,Wf,$f];function Zf(n){return Yf.find(t=>t.match(n))}class qf extends An{constructor(t,e,i,s){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Zf(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=lo(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class hr extends An{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class jf extends An{constructor(t,e,i,s,a,r){super(t,e,i,"number"),this._initInput(),this.min(s),this.max(a);const o=r!==void 0;this.step(o?r:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const v=parseFloat(this.$input.value);isNaN(v)||(this._snapClampSetValue(v+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let r=!1,o,c,l,d,f;const h=5,u=x=>{o=x.clientX,c=l=x.clientY,r=!0,d=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=x=>{if(r){const v=x.clientX-o,S=x.clientY-c;Math.abs(S)>h?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(v)>h&&_()}if(!r){const v=x.clientY-l;f-=v*this._step*this._arrowKeyMultiplier(x),d+f>this._max?f=this._max-d:d+f<this._min&&(f=this._min-d),this._snapClampSetValue(d+f)}l=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,v,S,U)=>(p-x)/(v-x)*(U-S)+S,e=p=>{const x=this.$slider.getBoundingClientRect();let v=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(v)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=p=>{e(p.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let r=!1,o,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),r=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(o=p.touches[0].clientX,c=p.touches[0].clientY,r=!0):l(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",h))},f=p=>{if(r){const x=p.touches[0].clientX-o,v=p.touches[0].clientY-c;Math.abs(x)>Math.abs(v)?l(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h))}else p.preventDefault(),e(p.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h)},u=this._callOnFinishChange.bind(this),g=400;let _;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const v=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+v),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(u,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Kf extends An{constructor(t,e,i,s){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Jf extends An{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Qf=`.lil-gui {
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
}`;function tp(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let tl=!1;class Fa{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:a="Controls",closeFolders:r=!1,injectStyles:o=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!tl&&o&&(tp(Qf),tl=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,i,s,a){if(Object(i)===i)return new Kf(this,t,e,i);const r=t[e];switch(typeof r){case"number":return new jf(this,t,e,i,s,a);case"boolean":return new Vf(this,t,e);case"string":return new Jf(this,t,e);case"function":return new hr(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,i=1){return new qf(this,t,e,i)}addFolder(t){const e=new Fa({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof hr||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof hr)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function ep(n,t,e,i){const s=document.getElementById("debug-panel"),a=s?new Fa({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new Fa({title:"实验台 · 调试面板"}),r=n.config,o=[],c=[],l=w=>{const M=a.addFolder(w);return c.push(M),M},d=(w,M)=>{const G=w.addFolder(M);return o.push(G),G},f=l("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid);const h=d(f,"模块开关");h.add(n.modules,"movement").name("movement"),h.add(n.modules,"combat").name("combat"),h.add(n.modules,"links").name("links"),h.add(n.modules,"orientation").name("orientation"),h.add(n.modules,"turnInPlace").name("turnInPlace"),h.add(n.modules,"targeting").name("targeting"),h.add(n.modules,"hits").name("hits"),h.add(n.modules,"separation").name("separation"),h.add(n.modules,"dash").name("dash"),h.add(n.modules,"camera").name("camera"),h.add(n.modules,"dummies").name("dummies"),h.add(n.modules,"abilities").name("abilities");const u=l("移动 / 输入"),g=d(u,"基础移动参数");g.add(r,"moveSpeed",1,10,.1).name("移动速度"),g.add(r,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(r,"acceleration",1,40,.5).name("加速度"),g.add(r,"friction",1,40,.5).name("摩擦"),g.add(r,"gravity",5,60,.5).name("重力"),g.add(r,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(r,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(r,"characterRadius",.1,.8,.01).name("角色半径"),g.add(r,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(r,"strideLength",.3,3,.05).name("基础步幅"),g.add(r,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(r,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=d(u,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=r.dash,p=d(u,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=r.separation,v=d(u,"角色间分离 / 挤压阻力");v.add(x,"iterations",1,8,1).name("迭代次数"),v.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),v.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),v.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),v.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const S=r.dummies,U=d(u,"假人 AI");U.add(S,"moveSpeed",.5,8,.1).name("移动速度"),U.add(S,"wanderRadius",.5,8,.1).name("游走半径"),U.add(S,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),U.add(S,"followStopDistance",.3,5,.1).name("跟随停距"),U.add(S,"keepDistance",1,10,.1).name("保持距离"),U.add(S,"keepDeadZone",.1,2,.05).name("保持死区"),U.add(S,"attackRange",.5,5,.1).name("攻击距离"),U.add(S,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const C=l("步态 / 停步"),A=d(C,"程序化步态");A.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),A.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),A.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),A.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),A.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),A.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),A.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),A.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),A.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),A.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),A.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),A.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),A.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),A.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)");const T=d(C,"停步收相 / 胸朝向");T.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),T.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),T.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),T.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),T.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const b=d(C,"停步惯性");b.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),b.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),b.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),b.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),b.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),b.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),b.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),d(C,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const D=d(C,"足部 IK"),H=t.ik;D.add(H,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),D.add(H,"weight",0,1,.01).name("钉地权重"),D.add(H,"attackScale",0,1,.01).name("攻击时权重倍率"),D.add(H,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const z=d(C,"惯性倾斜 / 盆骨"),X=t.lean;z.add(X,"accelGain",0,.1,.002).name("前后加速度增益"),z.add(X,"turnGain",0,.2,.005).name("绕圈侧倾增益"),z.add(X,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),z.add(X,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),z.add(X,"smoothing",1,30,1).name("倾斜平滑速率"),z.add(X,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),z.add(X,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),z.add(X,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),z.add(X,"crouchSmoothing",1,30,1).name("下沉平滑速率");const P=r.orientation,R=d(C,"朝向 / 下盘带转");R.add(P,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),R.add(P,"headTurnRate",.5,40,.5).name("头部转向速率"),R.add(P,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),R.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),R.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),R.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const V=d(C,"原地转身 / 停步偏差 (v9s)"),B=r.turnInPlace;V.add(B,"enabled").name("启用原地转身 (关=纯插值)"),V.add(B,"triggerDeg",20,180,5).name("触发夹角 (°)"),V.add(B,"settleDeg",0,60,1).name("转身保留余角 (°)"),V.add(B,"durationSec",.1,1.5,.02).name("转身时长 (s)"),V.add(B,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),V.add(B,"inputDeadZone",0,.5,.01).name("起步输入死区"),V.add(B,"armSec",0,.5,.01).name("触发防抖 (s)"),V.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),V.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),V.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),V.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),V.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),V.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const Z=l("战斗 / 受击"),J=r.combat,rt=d(Z,"连击 / 武器"),ft=rt.add(n.combat,"weapon",Si).name("当前武器");rt.add(J,"comboWindow",.1,2,.05).name("连击窗口 (s)"),rt.add(J,"settle",0,.8,.01).name("段间停顿 (s)"),rt.add(J,"attackMoveScale",0,1,.01).name("攻击时移动比例"),rt.add(J,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),rt.add(J,"cancelWindow",0,1,.01).name("取消窗口 (s)"),rt.add(J,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),rt.add(J,"autoCombo").name("按住自动连击"),rt.add(J.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),rt.add(J.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),rt.add(J.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),rt.add(J.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),rt.add(J.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),rt.add(J.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const vt=r.abilities;rt.add(vt.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),rt.add(vt.arcane,"speed",3,24,.5).name("飞弹速度"),rt.add(vt.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),rt.add(vt.ring,"radius",.5,5,.1).name("电环半径"),rt.add(vt.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),rt.add(vt.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const $=d(Z,"攻击动作 / 跨步 / 落地");$.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),$.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),$.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const tt=t.animation.stride;$.add(tt,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),$.add(tt,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),$.add(tt,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),$.add(tt,"cycles",1,3,1).name("每段跨步周期数"),$.add(tt,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),$.add(tt,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),$.add(tt,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),$.add(tt,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),$.add(tt,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),$.add(tt,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),$.add(tt,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),$.add(tt,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),$.add(tt,"heavyScale",0,1,.01).name("大剑重击收敛系数"),$.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),$.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),$.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),$.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),$.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),$.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),$.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),$.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),$.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),$.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),$.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),$.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const gt=d(Z,"武器握持");gt.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),gt.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),gt.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),gt.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const j=r.hits,pt=d(Z,"命中 / 受击 / 击退");pt.add(j,"arcDeg",10,120,5).name("命中扇区半角 (°)"),pt.add(j,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),pt.add(j,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),pt.add(j,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),pt.add(j.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),pt.add(j.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),pt.add(j,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),pt.add(j,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Dt=r.targeting,Ft=d(Z,"目标辅助");Ft.add(Dt,"targetAssist").name("启用目标辅助"),Ft.add(Dt,"range",1,14,.5).name("锁定范围 (m)"),Ft.add(Dt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Ft.add(Dt,"frontBias",0,4,.1).name("朝向加权"),Ft.add(Dt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Ft.add(Dt,"maxLungeScale",1,3,.1).name("前冲最大放大");const Nt=d(Z,"受击分层"),Et=t.hurt;Nt.add(Et,"enabled").name("启用分层受击 (关=旧版对照)"),Nt.add(Et,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Nt.add(Et,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Nt.add(Et,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Nt.add(Et,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Nt.add(Et,"upperShiftScale",0,1,.01).name("上身位移缩放"),Nt.add(Et,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Nt.add(Et.hitHeight,"light",0,1,.01).name("轻击命中部位"),Nt.add(Et.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Nt.add(Et.hitHeight,"knock",0,1,.01).name("击退命中部位"),Nt.add(Et,"leanLight",0,1.5,.01).name("轻击力度"),Nt.add(Et,"leanHeavy",0,1.5,.01).name("重击力度"),Nt.add(Et,"leanKnock",0,1.5,.01).name("击退力度"),Nt.add(Et,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:Et.abdomen},{name:"打肩 (shoulder)",p:Et.shoulder}].map(({name:w,p:M})=>{const G=d(Nt,w);return G.add(M,"upperPitch",0,2,.01).name("上身前后倾斜"),G.add(M,"upperRoll",0,2,.01).name("上身侧倾"),G.add(M,"upperYaw",0,1.5,.01).name("肩部扭转"),G.add(M,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),G.add(M,"shift",0,.8,.01).name("身体反应位移"),G.add(M,"drop",0,.4,.01).name("整体下沉"),G.add(M,"back",0,.4,.01).name("屁股向后"),G.add(M,"knee",0,1.6,.01).name("屈膝"),G.add(M,"hip",0,1,.01).name("髋前倾"),G.add(M,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),G});const Tt=d(Z,"派生招"),O=r.links;Tt.add(O,"enabled").name("总开关 (false=旧连击)"),Tt.add(O.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),Tt.add(O.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),Tt.add(O.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),Tt.add(O,"sharedCooldown",0,3,.05).name("共享 CD (s)"),Tt.add(O,"triggerWhileSprinting").name("长跑中可直接触发"),Tt.add(O.search,"range",1,14,.1).name("索敌距离 (m)"),Tt.add(O.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),Tt.add(O.search,"stopDistance",0,3,.05).name("停住距离 (m)");const Gt=O.moves["sword-shield"];Gt&&(Tt.add(Gt,"enabled").name("剑盾盾击"),Tt.add(Gt,"distance",0,8,.1).name("冲锋极限 (m)"),Tt.add(Gt,"windup",0,.5,.01).name("前摇 (s)"),Tt.add(Gt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),Tt.add(Gt,"recovery",0,.8,.01).name("收势 (s)"),Tt.add(Gt.hit,"radius",0,4,.05).name("命中半径 (m)"),Tt.add(Gt.hit,"width",0,2,.05).name("扫掠半径 (m)"),Tt.add(Gt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),Tt.add(Gt.hit,"duration",0,1.5,.01).name("僵直 (s)")),Tt.add(r.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const Pt=l("相机"),It=d(Pt,"基础");It.add(t.camera,"pitchDeg",20,80,1).name("俯角"),It.add(t.camera,"yawDeg",-180,180,1).name("方位角"),It.add(t.camera,"distance",6,35,.5).name("距离"),It.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),It.add(t.camera,"fov",25,90,1).name("FOV");const q=r.camera,ct=d(Pt,"智能构图");ct.add(q,"radius",2,18,.5).name("威胁评估半径 (m)"),ct.add(q,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),ct.add(q,"saturation",.5,8,.1).name("威胁归一化饱和"),ct.add(q,"pushIn",0,.5,.01).name("无威胁推进比例"),ct.add(q,"maxPullback",0,1,.02).name("最大拉远比例"),ct.add(q,"maxOffset",0,6,.1).name("最大构图平移 (m)"),ct.add(q,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),ct.add(q,"framingBias",0,1,.05).name("威胁质心平移系数"),ct.add(q,"attackBoost",0,2,.05).name("挥砍中额外加权"),ct.add(q.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),ct.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const dt=d(Pt,"缩放");return dt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),dt.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),dt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),dt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),dt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),dt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),dt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),dt.add({reset:i.resetZoom},"reset").name("缩放归 1"),o.forEach(w=>w.close()),c.forEach(w=>w.close()),a.close(),{gui:a,refreshWeapon:()=>ft.updateDisplay()}}const ur=Math.PI*2,Sn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},np=45,ip=50;function sp(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function gs(n,t,e){const i=sp(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function ap(n,t){return Math.atan2(n,-t)*180/Math.PI}function el(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Hs(n){return(n%360+360)%360}const rp={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function op(n,t,e,i=8){const s=n.character,a=t.intents,r=Math.hypot(a.moveX,a.moveZ),o=Math.hypot(t.stickRawX,t.stickRawY),c=s.velocity,l=Math.hypot(c.x,c.z),d=r>.001?gs(a.moveX,a.moveZ,e):null,f=l>.15?gs(c.x,c.z,e):null,h=gs(Math.sin(s.facing),Math.cos(s.facing),e),u=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?gs(a.aimX,a.aimZ,e):null,g=n.targeting,_=g.hasTarget?gs(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=d!==null&&f!==null?el(d,f):null,p=d!==null?el(d,h):null,x=m!==null&&m>np&&r>=.35&&l>=.4;return{inDeg:d,inLen:Math.min(1,r),rawDeg:o>.02?ap(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,o),stickHeld:t.stickHeld,moveDeg:f,speed:l,faceDeg:h,lockDeg:_,lockId:g.targetId,lockDist:g.targetDist,aimDeg:u,gapMove:m,gapFace:p,warnMove:x}}function nl(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>ip&&(n.inLen>=.35||n.speed>=.4)}const il="harness.dirDebug";function cp(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const s=e.querySelector("#dirdbg-canvas"),a=e.querySelector("#dirdbg-toggle"),r={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},o=s.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(il)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),a&&(a.textContent=c?"方向 ⌄":"方向 ▸",a.setAttribute("aria-expanded",String(c)))}l();function d(v){if(c=v,!t)try{window.localStorage.setItem(il,v?"1":"0")}catch{}l()}a==null||a.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),d(!c)}),t||window.addEventListener("keydown",v=>{v.key.toLowerCase()==="v"&&!v.metaKey&&!v.ctrlKey&&d(!c)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;s.width=Math.round(h*f),s.height=Math.round(h*f);let u=rp,g=0,_="",m=8;function p(v){if(!o)return;const S=h,U=h,C=S/2,A=U/2,T=Math.min(S,U)/2-13;o.setTransform(f,0,0,f,0,0),o.clearRect(0,0,S,U),o.beginPath(),o.arc(C,A,T,0,ur),o.fillStyle="rgba(8, 12, 17, 0.5)",o.fill(),o.lineWidth=1,o.strokeStyle=v.warnMove?"rgba(251, 191, 36, 0.85)":Sn.ring,o.stroke(),o.strokeStyle=Sn.grid,o.beginPath(),o.moveTo(C-T,A),o.lineTo(C+T,A),o.moveTo(C,A-T),o.lineTo(C,A+T),o.stroke();for(let H=0;H<8;H++){const z=H*Math.PI/4,X=C+Math.sin(z)*(T-3),P=A-Math.cos(z)*(T-3),R=C+Math.sin(z)*T,V=A-Math.cos(z)*T;o.beginPath(),o.moveTo(X,P),o.lineTo(R,V),o.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(o.save(),o.setLineDash([2,3]),o.strokeStyle=Sn.dead,o.beginPath(),o.arc(C,A,T*b,0,ur),o.stroke(),o.restore());const y=(H,z,X,P,R=!1,V=1)=>{const B=H*Math.PI/180,Z=Math.sin(B),J=-Math.cos(B),rt=T*Math.max(.14,Math.min(1,z)),ft=C+Z*T*.14,vt=A+J*T*.14,$=C+Z*rt,tt=A+J*rt;if(o.save(),o.globalAlpha=V,o.strokeStyle=X,o.fillStyle=X,o.lineWidth=P,o.lineCap="round",R&&o.setLineDash([3,3]),o.beginPath(),o.moveTo(ft,vt),o.lineTo($,tt),o.stroke(),!R&&rt>T*.3){const gt=-J,j=Z,pt=5.2;o.beginPath(),o.moveTo($+Z*1.5,tt+J*1.5),o.lineTo($-Z*pt+gt*pt*.72,tt-J*pt+j*pt*.72),o.lineTo($-Z*pt-gt*pt*.72,tt-J*pt-j*pt*.72),o.closePath(),o.fill()}o.restore()},D=(H,z)=>{const X=H*Math.PI/180,P=Math.sin(X),R=-Math.cos(X),V=-R,B=P,Z=T+1.5,J=Z+6.5;o.save(),o.fillStyle=z,o.strokeStyle=z,o.lineWidth=1,o.beginPath(),o.moveTo(C+P*J,A+R*J),o.lineTo(C+P*Z+V*4,A+R*Z+B*4),o.lineTo(C+P*Z-V*4,A+R*Z-B*4),o.closePath(),o.fill(),o.restore()};v.lockDeg!==null&&y(v.lockDeg,1,Sn.lock,1,!0,.7),v.rawDeg!==null&&v.stickHeld&&y(v.rawDeg,v.rawLen,Sn.raw,1,!0,.9),v.aimDeg!==null&&y(v.aimDeg,1,Sn.aim,1.6,!0,.95),y(v.faceDeg,1,Sn.face,1.1,!0,.55),v.moveDeg!==null&&y(v.moveDeg,v.speed/Math.max(1,m),Sn.move,5.5,!1,.8),v.inDeg!==null&&y(v.inDeg,v.inLen,Sn.input,2.2),D(v.faceDeg,Sn.face),o.beginPath(),o.arc(C,A,2.2,0,ur),o.fillStyle="rgba(220, 235, 248, 0.85)",o.fill()}function x(v,S){const U=T=>T===null?"-":String(Math.round(Hs(T)));r.in.textContent=`入 ${U(v.inDeg)}`,r.mv.textContent=`移 ${U(v.moveDeg)}`,r.fc.textContent=`面 ${U(v.faceDeg)}`;const C=T=>T===null?"-":`${Math.round(T)}°`,A=[`Δ入→移 ${C(v.gapMove)}`,`Δ入→面 ${C(v.gapFace)}`];v.speed>.05&&A.push(`v${v.speed.toFixed(1)}`),v.lockDeg!==null&&A.push(`锁#${v.lockId} ${v.lockDist.toFixed(1)}m`),v.aimDeg!==null&&A.push("拖拽瞄准"),r.gap.textContent=A.join("  "),e.classList.toggle("is-warn",v.warnMove||nl(v,S))}return{update(v,S,U){if(!c)return;m=Math.max(1,v.config.moveSpeed*Math.max(1,v.config.sprintMultiplier));const C=op(v,S,U,m);u=C;const A=v.combat.phase!=="idle";p(C);const T=performance.now(),b=`${C.inDeg}|${C.moveDeg}|${C.faceDeg}|${C.lockId}|${C.aimDeg}|${C.warnMove}|${C.speed.toFixed(1)}`;(T-g>90||b!==_)&&(g=T,_=b,x(C,A),e.dataset.in=C.inDeg===null?"":Hs(C.inDeg).toFixed(1),e.dataset.mv=C.moveDeg===null?"":Hs(C.moveDeg).toFixed(1),e.dataset.fc=Hs(C.faceDeg).toFixed(1),e.dataset.warn=C.warnMove||nl(C,A)?"1":"0")},setEnabled:d,toggle(){return d(!c),c},enabled:()=>c,last:()=>u}}const lp=6,dp=480,sl=240,al=92,hp=18;function up(n,t,e,i){const s=t-n;return{t:i,speed:t,drive:t,raw:t,dv:s,accel:e>1e-4?s/e:0,busy:!1}}function fp(n,t,e,i){const a=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:a,speed:Math.min(a,Math.max(1,i))}}function pp(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function mp(n={}){const t=Math.max(1,n.windowS??lp),e=Math.max(60,n.capacity??dp),i=Math.max(1,n.speedCap??hp),s=!!(n.container&&n.toggle),a=n.container??document.createElement("div");a.id="motiondbg",n.container||(a.setAttribute("data-ui-region",""),document.body.appendChild(a));const r=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");a.innerHTML=s?`<div id="motiondbg-body">${r}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${r}</div>`].join("");const o=n.toggle??a.querySelector("#motiondbg-toggle"),c=a.querySelector("#motiondbg-graph"),l=a.querySelector("#motiondbg-read"),d=a.querySelector("#motiondbg-window"),f=a.querySelector("#motiondbg-dir");d.textContent=`${t.toFixed(1)}s`;const h=c.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(sl*u),c.height=Math.round(al*u);const g=cp({deadZone:n.deadZone,container:f,embedded:!0});let _=!1;function m(T){_=T,a.classList.toggle("is-off",!T),!s&&o&&(o.textContent=T?"手感 ⌄":"手感 ▸",o.setAttribute("aria-expanded",String(T)),o.setAttribute("aria-label",T?"收起手感调试面板":"展开手感调试面板"))}m(!1),s||(o==null||o.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),m(!_)}),window.addEventListener("keydown",T=>{T.key.toLowerCase()==="v"&&!T.metaKey&&!T.ctrlKey&&m(!_)}));const p=[];let x=0,v=null,S=-1,U={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function C(T){const b=T-t;let y=0;for(;y<p.length&&p[y].t<b;)y++;return p.slice(y)}function A(T,b){if(!h)return;const y=sl,D=al;h.setTransform(u,0,0,u,0,0),h.clearRect(0,0,y,D),h.fillStyle="rgba(8, 12, 17, 0.55)",h.fillRect(0,0,y,D);const H=4,z=4,X=y-H-z,P=9,R=46,V=62,B=22,Z=b-t,J=j=>H+Math.max(0,Math.min(1,(j-Z)/t))*X;for(let j=0;j<T.length;j++){if(!T[j].busy)continue;const pt=J(T[j].t),Dt=j+1<T.length?J(T[j+1].t):pt+2;h.fillStyle="rgba(251, 146, 60, 0.13)",h.fillRect(pt,P,Math.max(2,Dt-pt),R)}h.strokeStyle="rgba(150, 190, 220, 0.14)",h.lineWidth=1,h.beginPath();for(const j of[P,P+R/2,P+R])h.moveTo(H,j),h.lineTo(y-z,j);h.moveTo(H,V+B/2),h.lineTo(y-z,V+B/2),h.stroke();const ft=Math.max(1,...T.map(j=>j.speed),...T.map(j=>j.drive))*1.15,vt=j=>P+R-j/ft*R;if(T.length>1){h.beginPath(),h.moveTo(J(T[0].t),vt(T[0].speed));for(let j=1;j<T.length;j++)h.lineTo(J(T[j].t),vt(T[j].speed));h.strokeStyle="#38bdf8",h.lineWidth=1.8,h.lineJoin="round",h.stroke(),h.lineTo(J(T[T.length-1].t),P+R),h.lineTo(J(T[0].t),P+R),h.closePath(),h.fillStyle="rgba(56, 189, 248, 0.14)",h.fill(),h.beginPath(),h.moveTo(J(T[0].t),vt(T[0].drive));for(let j=1;j<T.length;j++)h.lineTo(J(T[j].t),vt(T[j].drive));h.setLineDash([3,3]),h.strokeStyle="rgba(190, 205, 220, 0.6)",h.lineWidth=1.2,h.stroke(),h.setLineDash([])}let $=.02;for(const j of T)$=Math.max($,Math.abs(j.dv));$*=1.1;const tt=V+B/2,gt=B/2;for(const j of T){const pt=Math.min(gt,Math.abs(j.dv)/$*gt);h.fillStyle=j.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",h.fillRect(J(j.t)-.7,j.dv>=0?tt-pt:tt,1.4,Math.max(.5,pt))}h.font="9px ui-monospace, monospace",h.fillStyle="rgba(190, 214, 234, 0.55)",h.textAlign="left",h.fillText(ft.toFixed(1),H+2,P+8),h.fillText("v",H+2,P+R-2),h.fillText("Δv",H+2,V+9),h.textAlign="right",h.fillText("0",y-z-2,P+R-2),h.textAlign="left"}return{dirDebug:g,update(T,b,y){const D=performance.now()/1e3,H=S<0?1/60:Math.max(1e-4,Math.min(.25,D-S));S=D;const z=T.character,X={x:z.position.x,z:z.position.z},P=Math.hypot(z.velocity.x,z.velocity.z),{speed:R,raw:V}=v?fp(v,X,H,i):{speed:0,raw:0},B=up(x,R,H,D);B.drive=P,B.raw=V,B.busy=pp(T),v=X,x=R,p.push(B),p.length>e&&p.shift();const Z=C(D);let J=0;for(const rt of Z)J=Math.max(J,rt.speed);if(U={speed:R,drive:P,raw:V,dv:B.dv,accel:B.accel,peak:J,samples:Z.length,windowS:t,busy:B.busy},g.update(T,b,y),_){A(Z,D);const rt=B.dv>=0?"+":"";l.textContent=`v ${R.toFixed(2)} · 驱 ${P.toFixed(2)} · 峰 ${J.toFixed(2)} · Δv ${rt}${B.dv.toFixed(3)} · ${Z.length} 帧`}},setEnabled:m,toggle(){return m(!_),_},enabled:()=>_,last:()=>({...U}),samples:()=>C(performance.now()/1e3).map(T=>({...T}))}}const gp=["剑盾","双剑","大剑","法杖","弓"],_p={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function xp(n){return{update(t,e,i,s,a,r,o=!1){const c=t.character,l=c.position,d=c.velocity,f=t.combat,h=t.events.length>0?t.events[t.events.length-1]:null,u=Et=>Et.toFixed(2),g=Et=>(Et*180/Math.PI).toFixed(0),_=gp[Si.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),p="|".repeat(m)+".".repeat(10-m),x=t.dash,v=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,S=x.phase==="active"?`${x.kind}@${v.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,U=s.intents.aimActive?`(${u(s.intents.aimX)},${u(s.intents.aimZ)})`:"-",C=d.x*Math.sin(c.bodyYaw)+d.z*Math.cos(c.bodyYaw),A=d.x*Math.cos(c.bodyYaw)-d.z*Math.sin(c.bodyYaw),T=Math.abs(C)+Math.abs(A)+1e-6,b=Math.round(Math.abs(A)/T*100),y=`strafe ${b}%${C<-.05?" back":""}`,D=t.camera,H=`threat ${(D.threat*100).toFixed(0)}%  dist×${u(D.distanceScale)}  off (${u(D.offsetX)},${u(D.offsetZ)})  pitch +${u(D.pitchDelta)}°  n=${D.threatCount}`,z=r?u(r.attackBlend):"-",X=r==null?void 0:r.attackWeights,P=X?`gw ${u(X.gaitScale)}  lw ${u(X.attackLegWeight)}  spd ${u(X.driveSpeed)}`:"-",R=X?`${u(X.gaitScale)}/${u(X.attackLegWeight)}`:"-",V=r?`${r.landing.kind} ${u(r.landing.pulse)} t${u(r.landing.remaining)} vy${u(r.landing.impactVy)}`:"-",B=r?`${r.landing.kind}/${u(r.landing.pulse)}`:"-",Z=(r==null?void 0:r.zoom)!==void 0?`zoom ×${u(r.zoom)}`:"-",J=r==null?void 0:r.hurt,rt=J?`hurt ${t.playerHurt.type}  部位h${u(J.hitHeight)}  脉冲p${u(J.pulse)}  上身${u(J.upperShift)}  重心${u(J.comShift)}  后坐${u(J.pelvisBack)}  屈膝${u(J.knee)}`:"-",ft=J?`${u(J.hitHeight)}/${u(J.pulse)}/${u(J.knee)}`:"-",vt=r==null?void 0:r.ik,$=vt?`${vt.active?"on":"off"} w${u(vt.weight)} e${u(vt.maxError)}`:"-",tt=t.playerLink,gt=`link ${tt.kind||"-"}  ${tt.phase}  prog ${u(tt.progress)}  win ${u(tt.linkWindow)}s  cd ${u(tt.cooldown)}s  hits ${tt.hitIds.length}  travel ${u(tt.travelled)}/${u(tt.travel)}m  id ${tt.id}`,j=`${tt.phase}/${tt.kind||"-"}/w${u(tt.linkWindow)}`,pt=s.lastGesture,Dt=pt?`${pt.button} ${pt.kind} ${pt.heldMs.toFixed(0)}ms d${pt.distance.toFixed(0)}px ${pt.angleDeg.toFixed(0)}° taps${pt.taps}`:"-",Ft=t.dummies.map(Et=>`${Et.id}:${_p[Et.mode]}`).join("  ");if(o){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${tt.phase}${tt.kind?`/${tt.kind}`:""} w${u(tt.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(l.x)},${u(l.y)},${u(l.z)})  vel (${u(d.x)},${u(d.y)},${u(d.z)})`,`face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  st${b}%  stick(${u(s.stickX)},${u(s.stickY)}) ${s.source}  str${u(c.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${S}  ab ${z}  gw/lw ${R}  land ${B}  ik ${$}`,`aim ${U}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ft}`,`dummies ${Ft}  atkCount ${t.dummyAttackCount}  cam ${(D.threat*100).toFixed(0)}% ×${u(D.distanceScale)}  ${Z}  lk ${j}`,`event ${h?`${h.type} ${u(h.value)}`:"-"}  scale ${u(a.timeScale)}${a.paused?" [P]":""}  g ${Dt}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(l.x)}, ${u(l.y)}, ${u(l.z)})`,`vel  (${u(d.x)}, ${u(d.y)}, ${u(d.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${g(c.facing)}deg   atkBlend ${z}   ${P}   land ${V}`,rt,`ik ${$}  clamped ${vt?vt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  (head-body ${g(c.headYaw-c.bodyYaw)})  ${y}`,`move (${u(s.intents.moveX)}, ${u(s.intents.moveZ)})  stick (${u(s.stickX)}, ${u(s.stickY)})  ${s.source}  aim ${U}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${v.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,gt,`camera ${H}  ${Z}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Ft}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${h?`${h.type} ${u(h.value)}`:"-"}   scale ${u(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${Dt}`].join(`
`)}}}const Gs=["hud","motion","debug"],rl={hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}};function vp(n){var c;const t=Object.fromEntries(Gs.map(l=>[l,document.getElementById(`${l==="motion"?"motiondbg":l==="debug"?"debug":"hud"}-toggle`)])),e=Object.fromEntries(Gs.map(l=>[l,document.getElementById(l==="motion"?"motiondbg":l==="debug"?"debug-panel":"hud")]));let i={},s=null;function a(){var l,d,f;for(const h of Gs){const u=s===h,g=t[h],_=e[h];g&&(g.setAttribute("aria-expanded",String(u)),g.textContent=`${rl[h].short} ${u?"▾":"▸"}`,g.setAttribute("aria-label",`${u?"收起":"展开"}${rl[h].full}`)),_&&_.classList.toggle("is-open",u)}n.classList.toggle("is-compact",s!=="hud"),(l=i.motion)==null||l.setEnabled(s==="motion"),s==="debug"?(d=i.debug)==null||d.open():(f=i.debug)==null||f.close()}function r(l){s=s===l?null:l,a()}function o(){s!==null&&(s=null,a())}for(const l of Gs)(c=t[l])==null||c.addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),r(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&r("motion")}),a(),{hudCompact:()=>s!=="hud",register(l){i=l,a()},toggle:r,closeAll:o,isOpen:l=>s===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const dc="170",Mp=0,ol=1,yp=2,Ld=1,Id=2,zn=3,ni=0,We=1,ze=2,Qn=0,Qi=1,cl=2,ll=3,dl=4,Sp=5,_i=100,bp=101,Ep=102,wp=103,Tp=104,Ap=200,Rp=201,Cp=202,Pp=203,ho=204,uo=205,Dp=206,Lp=207,Ip=208,kp=209,Up=210,Fp=211,Np=212,zp=213,Op=214,fo=0,po=1,mo=2,ns=3,go=4,_o=5,xo=6,vo=7,hc=0,Bp=1,Hp=2,ti=0,Gp=1,Vp=2,Xp=3,Wp=4,$p=5,Yp=6,Zp=7,kd=300,is=301,ss=302,Mo=303,yo=304,Va=306,So=1e3,vi=1001,bo=1002,gn=1003,qp=1004,Vs=1005,Tn=1006,fr=1007,Mi=1008,Vn=1009,Ud=1010,Fd=1011,Is=1012,uc=1013,bi=1014,Bn=1015,Us=1016,fc=1017,pc=1018,as=1020,Nd=35902,zd=1021,Od=1022,mn=1023,Bd=1024,Hd=1025,ts=1026,rs=1027,Gd=1028,mc=1029,Vd=1030,gc=1031,_c=1033,Ma=33776,ya=33777,Sa=33778,ba=33779,Eo=35840,wo=35841,To=35842,Ao=35843,Ro=36196,Co=37492,Po=37496,Do=37808,Lo=37809,Io=37810,ko=37811,Uo=37812,Fo=37813,No=37814,zo=37815,Oo=37816,Bo=37817,Ho=37818,Go=37819,Vo=37820,Xo=37821,Ea=36492,Wo=36494,$o=36495,Xd=36283,Yo=36284,Zo=36285,qo=36286,jp=3200,Kp=3201,Wd=0,Jp=1,Kn="",en="srgb",cs="srgb-linear",Xa="linear",ae="srgb",Ii=7680,hl=519,Qp=512,tm=513,em=514,$d=515,nm=516,im=517,sm=518,am=519,jo=35044,ul="300 es",Hn=2e3,Na=2001;class ls{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}}const Le=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],wa=Math.PI/180,Ko=180/Math.PI;function ei(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Le[n&255]+Le[n>>8&255]+Le[n>>16&255]+Le[n>>24&255]+"-"+Le[t&255]+Le[t>>8&255]+"-"+Le[t>>16&15|64]+Le[t>>24&255]+"-"+Le[e&63|128]+Le[e>>8&255]+"-"+Le[e>>16&255]+Le[e>>24&255]+Le[i&255]+Le[i>>8&255]+Le[i>>16&255]+Le[i>>24&255]).toLowerCase()}function Xe(n,t,e){return Math.max(t,Math.min(e,n))}function rm(n,t){return(n%t+t)%t}function pr(n,t,e){return(1-e)*n+e*t}function wn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function re(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class Yt{constructor(t=0,e=0){Yt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Xe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*i-r*s+t.x,this.y=a*s+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Zt{constructor(t,e,i,s,a,r,o,c,l){Zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,r,o,c,l)}set(t,e,i,s,a,r,o,c,l){const d=this.elements;return d[0]=t,d[1]=s,d[2]=o,d[3]=e,d[4]=a,d[5]=c,d[6]=i,d[7]=r,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,r=i[0],o=i[3],c=i[6],l=i[1],d=i[4],f=i[7],h=i[2],u=i[5],g=i[8],_=s[0],m=s[3],p=s[6],x=s[1],v=s[4],S=s[7],U=s[2],C=s[5],A=s[8];return a[0]=r*_+o*x+c*U,a[3]=r*m+o*v+c*C,a[6]=r*p+o*S+c*A,a[1]=l*_+d*x+f*U,a[4]=l*m+d*v+f*C,a[7]=l*p+d*S+f*A,a[2]=h*_+u*x+g*U,a[5]=h*m+u*v+g*C,a[8]=h*p+u*S+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],d=t[8];return e*r*d-e*o*l-i*a*d+i*o*c+s*a*l-s*r*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],d=t[8],f=d*r-o*l,h=o*c-d*a,u=l*a-r*c,g=e*f+i*h+s*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(s*l-d*i)*_,t[2]=(o*i-s*r)*_,t[3]=h*_,t[4]=(d*e-s*c)*_,t[5]=(s*a-o*e)*_,t[6]=u*_,t[7]=(i*c-l*e)*_,t[8]=(r*e-i*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(i*c,i*l,-i*(c*r+l*o)+r+t,-s*l,s*c,-s*(-l*r+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(mr.makeScale(t,e)),this}rotate(t){return this.premultiply(mr.makeRotation(-t)),this}translate(t,e){return this.premultiply(mr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const mr=new Zt;function Yd(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function za(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function om(){const n=za("canvas");return n.style.display="block",n}const fl={};function Ts(n){n in fl||(fl[n]=!0,console.warn(n))}function cm(n,t,e){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:i()}}setTimeout(a,e)})}function lm(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function dm(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ee={enabled:!0,workingColorSpace:cs,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ae&&(n.r=Gn(n.r),n.g=Gn(n.g),n.b=Gn(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ae&&(n.r=es(n.r),n.g=es(n.g),n.b=es(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Kn?Xa:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Gn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function es(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const pl=[.64,.33,.3,.6,.15,.06],ml=[.2126,.7152,.0722],gl=[.3127,.329],_l=new Zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xl=new Zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ee.define({[cs]:{primaries:pl,whitePoint:gl,transfer:Xa,toXYZ:_l,fromXYZ:xl,luminanceCoefficients:ml,workingColorSpaceConfig:{unpackColorSpace:en},outputColorSpaceConfig:{drawingBufferColorSpace:en}},[en]:{primaries:pl,whitePoint:gl,transfer:ae,toXYZ:_l,fromXYZ:xl,luminanceCoefficients:ml,outputColorSpaceConfig:{drawingBufferColorSpace:en}}});let ki;class hm{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ki===void 0&&(ki=za("canvas")),ki.width=t.width,ki.height=t.height;const i=ki.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=ki}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=za("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Gn(a[r]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Gn(e[i]/255)*255):e[i]=Gn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let um=0;class Zd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=ei(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(gr(s[r].image)):a.push(gr(s[r]))}else a=gr(s);i.url=a}return e||(t.images[this.uuid]=i),i}}function gr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?hm.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let fm=0;class Be extends ls{constructor(t=Be.DEFAULT_IMAGE,e=Be.DEFAULT_MAPPING,i=vi,s=vi,a=Tn,r=Mi,o=mn,c=Vn,l=Be.DEFAULT_ANISOTROPY,d=Kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:fm++}),this.uuid=ei(),this.name="",this.source=new Zd(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Yt(0,0),this.repeat=new Yt(1,1),this.center=new Yt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==kd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case So:t.x=t.x-Math.floor(t.x);break;case vi:t.x=t.x<0?0:1;break;case bo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case So:t.y=t.y-Math.floor(t.y);break;case vi:t.y=t.y<0?0:1;break;case bo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Be.DEFAULT_IMAGE=null;Be.DEFAULT_MAPPING=kd;Be.DEFAULT_ANISOTROPY=1;class _e{constructor(t=0,e=0,i=0,s=1){_e.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*i+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,a;const c=t.elements,l=c[0],d=c[4],f=c[8],h=c[1],u=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(d-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(l+1)/2,S=(u+1)/2,U=(p+1)/2,C=(d+h)/4,A=(f+_)/4,T=(g+m)/4;return v>S&&v>U?v<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(v),s=C/i,a=A/i):S>U?S<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(S),i=C/s,a=T/s):U<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(U),i=A/a,s=T/a),this.set(i,s,a,e),this}let x=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(h-d)*(h-d));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(f-_)/x,this.z=(h-d)/x,this.w=Math.acos((l+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class pm extends ls{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new _e(0,0,t,e),this.scissorTest=!1,this.viewport=new _e(0,0,t,e);const s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Tn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new Be(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Zd(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ei extends pm{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class qd extends Be{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=gn,this.minFilter=gn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class mm extends Be{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=gn,this.minFilter=gn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Fs{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,a,r,o){let c=i[s+0],l=i[s+1],d=i[s+2],f=i[s+3];const h=a[r+0],u=a[r+1],g=a[r+2],_=a[r+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=f;return}if(o===1){t[e+0]=h,t[e+1]=u,t[e+2]=g,t[e+3]=_;return}if(f!==_||c!==h||l!==u||d!==g){let m=1-o;const p=c*h+l*u+d*g+f*_,x=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const U=Math.sqrt(v),C=Math.atan2(U,p*x);m=Math.sin(m*C)/U,o=Math.sin(o*C)/U}const S=o*x;if(c=c*m+h*S,l=l*m+u*S,d=d*m+g*S,f=f*m+_*S,m===1-o){const U=1/Math.sqrt(c*c+l*l+d*d+f*f);c*=U,l*=U,d*=U,f*=U}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,a,r){const o=i[s],c=i[s+1],l=i[s+2],d=i[s+3],f=a[r],h=a[r+1],u=a[r+2],g=a[r+3];return t[e]=o*g+d*f+c*u-l*h,t[e+1]=c*g+d*h+l*f-o*u,t[e+2]=l*g+d*u+o*h-c*f,t[e+3]=d*g-o*f-c*h-l*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,c=Math.sin,l=o(i/2),d=o(s/2),f=o(a/2),h=c(i/2),u=c(s/2),g=c(a/2);switch(r){case"XYZ":this._x=h*d*f+l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f-h*u*g;break;case"YXZ":this._x=h*d*f+l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f+h*u*g;break;case"ZXY":this._x=h*d*f-l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f-h*u*g;break;case"ZYX":this._x=h*d*f-l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f+h*u*g;break;case"YZX":this._x=h*d*f+l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f-h*u*g;break;case"XZY":this._x=h*d*f-l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f+h*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],a=e[8],r=e[1],o=e[5],c=e[9],l=e[2],d=e[6],f=e[10],h=i+o+f;if(h>0){const u=.5/Math.sqrt(h+1);this._w=.25/u,this._x=(d-c)*u,this._y=(a-l)*u,this._z=(r-s)*u}else if(i>o&&i>f){const u=2*Math.sqrt(1+i-o-f);this._w=(d-c)/u,this._x=.25*u,this._y=(s+r)/u,this._z=(a+l)/u}else if(o>f){const u=2*Math.sqrt(1+o-i-f);this._w=(a-l)/u,this._x=(s+r)/u,this._y=.25*u,this._z=(c+d)/u}else{const u=2*Math.sqrt(1+f-i-o);this._w=(r-s)/u,this._x=(a+l)/u,this._y=(c+d)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xe(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,a=t._z,r=t._w,o=e._x,c=e._y,l=e._z,d=e._w;return this._x=i*d+r*o+s*l-a*c,this._y=s*d+r*c+a*o-i*l,this._z=a*d+r*l+i*c-s*o,this._w=r*d-i*o-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,a=this._z,r=this._w;let o=r*t._w+i*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=i,this._y=s,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const u=1-e;return this._w=u*r+e*this._w,this._x=u*i+e*this._x,this._y=u*s+e*this._y,this._z=u*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,o),f=Math.sin((1-e)*d)/l,h=Math.sin(e*d)/l;return this._w=r*f+this._w*h,this._x=i*f+this._x*h,this._y=s*f+this._y*h,this._z=a*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Y{constructor(t=0,e=0,i=0){Y.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(vl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(vl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6]*s,this.y=a[1]*e+a[4]*i+a[7]*s,this.z=a[2]*e+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,a=t.x,r=t.y,o=t.z,c=t.w,l=2*(r*s-o*i),d=2*(o*e-a*s),f=2*(a*i-r*e);return this.x=e+c*l+r*f-o*d,this.y=i+c*d+o*l-a*f,this.z=s+c*f+a*d-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s,this.y=a[1]*e+a[5]*i+a[9]*s,this.z=a[2]*e+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,a=t.z,r=e.x,o=e.y,c=e.z;return this.x=s*c-a*o,this.y=a*r-i*c,this.z=i*o-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return _r.copy(this).projectOnVector(t),this.sub(_r)}reflect(t){return this.sub(_r.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Xe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const _r=new Y,vl=new Fs;class Ns{constructor(t=new Y(1/0,1/0,1/0),e=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const a=i.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,hn):hn.fromBufferAttribute(a,r),hn.applyMatrix4(t.matrixWorld),this.expandByPoint(hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Xs.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Xs.copy(i.boundingBox)),Xs.applyMatrix4(t.matrixWorld),this.union(Xs)}const s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,hn),hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(_s),Ws.subVectors(this.max,_s),Ui.subVectors(t.a,_s),Fi.subVectors(t.b,_s),Ni.subVectors(t.c,_s),Wn.subVectors(Fi,Ui),$n.subVectors(Ni,Fi),oi.subVectors(Ui,Ni);let e=[0,-Wn.z,Wn.y,0,-$n.z,$n.y,0,-oi.z,oi.y,Wn.z,0,-Wn.x,$n.z,0,-$n.x,oi.z,0,-oi.x,-Wn.y,Wn.x,0,-$n.y,$n.x,0,-oi.y,oi.x,0];return!xr(e,Ui,Fi,Ni,Ws)||(e=[1,0,0,0,1,0,0,0,1],!xr(e,Ui,Fi,Ni,Ws))?!1:($s.crossVectors(Wn,$n),e=[$s.x,$s.y,$s.z],xr(e,Ui,Fi,Ni,Ws))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(In[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),In[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),In[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),In[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),In[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),In[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),In[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),In[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(In),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const In=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],hn=new Y,Xs=new Ns,Ui=new Y,Fi=new Y,Ni=new Y,Wn=new Y,$n=new Y,oi=new Y,_s=new Y,Ws=new Y,$s=new Y,ci=new Y;function xr(n,t,e,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){ci.fromArray(n,a);const o=s.x*Math.abs(ci.x)+s.y*Math.abs(ci.y)+s.z*Math.abs(ci.z),c=t.dot(ci),l=e.dot(ci),d=i.dot(ci);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const gm=new Ns,xs=new Y,vr=new Y;class Wa{constructor(t=new Y,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):gm.setFromPoints(t).getCenter(i);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;xs.subVectors(t,this.center);const e=xs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(xs,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(vr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(xs.copy(t.center).add(vr)),this.expandByPoint(xs.copy(t.center).sub(vr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const kn=new Y,Mr=new Y,Ys=new Y,Yn=new Y,yr=new Y,Zs=new Y,Sr=new Y;class xc{constructor(t=new Y,e=new Y(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,kn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=kn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(kn.copy(this.origin).addScaledVector(this.direction,e),kn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Mr.copy(t).add(e).multiplyScalar(.5),Ys.copy(e).sub(t).normalize(),Yn.copy(this.origin).sub(Mr);const a=t.distanceTo(e)*.5,r=-this.direction.dot(Ys),o=Yn.dot(this.direction),c=-Yn.dot(Ys),l=Yn.lengthSq(),d=Math.abs(1-r*r);let f,h,u,g;if(d>0)if(f=r*c-o,h=r*o-c,g=a*d,f>=0)if(h>=-g)if(h<=g){const _=1/d;f*=_,h*=_,u=f*(f+r*h+2*o)+h*(r*f+h+2*c)+l}else h=a,f=Math.max(0,-(r*h+o)),u=-f*f+h*(h+2*c)+l;else h=-a,f=Math.max(0,-(r*h+o)),u=-f*f+h*(h+2*c)+l;else h<=-g?(f=Math.max(0,-(-r*a+o)),h=f>0?-a:Math.min(Math.max(-a,-c),a),u=-f*f+h*(h+2*c)+l):h<=g?(f=0,h=Math.min(Math.max(-a,-c),a),u=h*(h+2*c)+l):(f=Math.max(0,-(r*a+o)),h=f>0?a:Math.min(Math.max(-a,-c),a),u=-f*f+h*(h+2*c)+l);else h=r>0?-a:a,f=Math.max(0,-(r*h+o)),u=-f*f+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Mr).addScaledVector(Ys,h),u}intersectSphere(t,e){kn.subVectors(t.center,this.origin);const i=kn.dot(this.direction),s=kn.dot(kn)-i*i,a=t.radius*t.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,c=i+r;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,a,r,o,c;const l=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,s=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,s=(t.min.x-h.x)*l),d>=0?(a=(t.min.y-h.y)*d,r=(t.max.y-h.y)*d):(a=(t.max.y-h.y)*d,r=(t.min.y-h.y)*d),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(t.min.z-h.z)*f,c=(t.max.z-h.z)*f):(o=(t.max.z-h.z)*f,c=(t.min.z-h.z)*f),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,kn)!==null}intersectTriangle(t,e,i,s,a){yr.subVectors(e,t),Zs.subVectors(i,t),Sr.crossVectors(yr,Zs);let r=this.direction.dot(Sr),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Yn.subVectors(this.origin,t);const c=o*this.direction.dot(Zs.crossVectors(Yn,Zs));if(c<0)return null;const l=o*this.direction.dot(yr.cross(Yn));if(l<0||c+l>r)return null;const d=-o*Yn.dot(Sr);return d<0?null:this.at(d/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ue{constructor(t,e,i,s,a,r,o,c,l,d,f,h,u,g,_,m){ue.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,r,o,c,l,d,f,h,u,g,_,m)}set(t,e,i,s,a,r,o,c,l,d,f,h,u,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=c,p[2]=l,p[6]=d,p[10]=f,p[14]=h,p[3]=u,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ue().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/zi.setFromMatrixColumn(t,0).length(),a=1/zi.setFromMatrixColumn(t,1).length(),r=1/zi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*a,e[5]=i[5]*a,e[6]=i[6]*a,e[7]=0,e[8]=i[8]*r,e[9]=i[9]*r,e[10]=i[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,a=t.z,r=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),d=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const h=r*d,u=r*f,g=o*d,_=o*f;e[0]=c*d,e[4]=-c*f,e[8]=l,e[1]=u+g*l,e[5]=h-_*l,e[9]=-o*c,e[2]=_-h*l,e[6]=g+u*l,e[10]=r*c}else if(t.order==="YXZ"){const h=c*d,u=c*f,g=l*d,_=l*f;e[0]=h+_*o,e[4]=g*o-u,e[8]=r*l,e[1]=r*f,e[5]=r*d,e[9]=-o,e[2]=u*o-g,e[6]=_+h*o,e[10]=r*c}else if(t.order==="ZXY"){const h=c*d,u=c*f,g=l*d,_=l*f;e[0]=h-_*o,e[4]=-r*f,e[8]=g+u*o,e[1]=u+g*o,e[5]=r*d,e[9]=_-h*o,e[2]=-r*l,e[6]=o,e[10]=r*c}else if(t.order==="ZYX"){const h=r*d,u=r*f,g=o*d,_=o*f;e[0]=c*d,e[4]=g*l-u,e[8]=h*l+_,e[1]=c*f,e[5]=_*l+h,e[9]=u*l-g,e[2]=-l,e[6]=o*c,e[10]=r*c}else if(t.order==="YZX"){const h=r*c,u=r*l,g=o*c,_=o*l;e[0]=c*d,e[4]=_-h*f,e[8]=g*f+u,e[1]=f,e[5]=r*d,e[9]=-o*d,e[2]=-l*d,e[6]=u*f+g,e[10]=h-_*f}else if(t.order==="XZY"){const h=r*c,u=r*l,g=o*c,_=o*l;e[0]=c*d,e[4]=-f,e[8]=l*d,e[1]=h*f+_,e[5]=r*d,e[9]=u*f-g,e[2]=g*f-u,e[6]=o*d,e[10]=_*f+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(_m,t,xm)}lookAt(t,e,i){const s=this.elements;return Ze.subVectors(t,e),Ze.lengthSq()===0&&(Ze.z=1),Ze.normalize(),Zn.crossVectors(i,Ze),Zn.lengthSq()===0&&(Math.abs(i.z)===1?Ze.x+=1e-4:Ze.z+=1e-4,Ze.normalize(),Zn.crossVectors(i,Ze)),Zn.normalize(),qs.crossVectors(Ze,Zn),s[0]=Zn.x,s[4]=qs.x,s[8]=Ze.x,s[1]=Zn.y,s[5]=qs.y,s[9]=Ze.y,s[2]=Zn.z,s[6]=qs.z,s[10]=Ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,r=i[0],o=i[4],c=i[8],l=i[12],d=i[1],f=i[5],h=i[9],u=i[13],g=i[2],_=i[6],m=i[10],p=i[14],x=i[3],v=i[7],S=i[11],U=i[15],C=s[0],A=s[4],T=s[8],b=s[12],y=s[1],D=s[5],H=s[9],z=s[13],X=s[2],P=s[6],R=s[10],V=s[14],B=s[3],Z=s[7],J=s[11],rt=s[15];return a[0]=r*C+o*y+c*X+l*B,a[4]=r*A+o*D+c*P+l*Z,a[8]=r*T+o*H+c*R+l*J,a[12]=r*b+o*z+c*V+l*rt,a[1]=d*C+f*y+h*X+u*B,a[5]=d*A+f*D+h*P+u*Z,a[9]=d*T+f*H+h*R+u*J,a[13]=d*b+f*z+h*V+u*rt,a[2]=g*C+_*y+m*X+p*B,a[6]=g*A+_*D+m*P+p*Z,a[10]=g*T+_*H+m*R+p*J,a[14]=g*b+_*z+m*V+p*rt,a[3]=x*C+v*y+S*X+U*B,a[7]=x*A+v*D+S*P+U*Z,a[11]=x*T+v*H+S*R+U*J,a[15]=x*b+v*z+S*V+U*rt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],a=t[12],r=t[1],o=t[5],c=t[9],l=t[13],d=t[2],f=t[6],h=t[10],u=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+a*c*f-s*l*f-a*o*h+i*l*h+s*o*u-i*c*u)+_*(+e*c*u-e*l*h+a*r*h-s*r*u+s*l*d-a*c*d)+m*(+e*l*f-e*o*u-a*r*f+i*r*u+a*o*d-i*l*d)+p*(-s*o*d-e*c*f+e*o*h+s*r*f-i*r*h+i*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],d=t[8],f=t[9],h=t[10],u=t[11],g=t[12],_=t[13],m=t[14],p=t[15],x=f*m*l-_*h*l+_*c*u-o*m*u-f*c*p+o*h*p,v=g*h*l-d*m*l-g*c*u+r*m*u+d*c*p-r*h*p,S=d*_*l-g*f*l+g*o*u-r*_*u-d*o*p+r*f*p,U=g*f*c-d*_*c-g*o*h+r*_*h+d*o*m-r*f*m,C=e*x+i*v+s*S+a*U;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/C;return t[0]=x*A,t[1]=(_*h*a-f*m*a-_*s*u+i*m*u+f*s*p-i*h*p)*A,t[2]=(o*m*a-_*c*a+_*s*l-i*m*l-o*s*p+i*c*p)*A,t[3]=(f*c*a-o*h*a-f*s*l+i*h*l+o*s*u-i*c*u)*A,t[4]=v*A,t[5]=(d*m*a-g*h*a+g*s*u-e*m*u-d*s*p+e*h*p)*A,t[6]=(g*c*a-r*m*a-g*s*l+e*m*l+r*s*p-e*c*p)*A,t[7]=(r*h*a-d*c*a+d*s*l-e*h*l-r*s*u+e*c*u)*A,t[8]=S*A,t[9]=(g*f*a-d*_*a-g*i*u+e*_*u+d*i*p-e*f*p)*A,t[10]=(r*_*a-g*o*a+g*i*l-e*_*l-r*i*p+e*o*p)*A,t[11]=(d*o*a-r*f*a-d*i*l+e*f*l+r*i*u-e*o*u)*A,t[12]=U*A,t[13]=(d*_*s-g*f*s+g*i*h-e*_*h-d*i*m+e*f*m)*A,t[14]=(g*o*s-r*_*s-g*i*c+e*_*c+r*i*m-e*o*m)*A,t[15]=(r*f*s-d*o*s+d*i*c-e*f*c-r*i*h+e*o*h)*A,this}scale(t){const e=this.elements,i=t.x,s=t.y,a=t.z;return e[0]*=i,e[4]*=s,e[8]*=a,e[1]*=i,e[5]*=s,e[9]*=a,e[2]*=i,e[6]*=s,e[10]*=a,e[3]*=i,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),a=1-i,r=t.x,o=t.y,c=t.z,l=a*r,d=a*o;return this.set(l*r+i,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+i,d*c-s*r,0,l*c-s*o,d*c+s*r,a*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,a,r){return this.set(1,i,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,a=e._x,r=e._y,o=e._z,c=e._w,l=a+a,d=r+r,f=o+o,h=a*l,u=a*d,g=a*f,_=r*d,m=r*f,p=o*f,x=c*l,v=c*d,S=c*f,U=i.x,C=i.y,A=i.z;return s[0]=(1-(_+p))*U,s[1]=(u+S)*U,s[2]=(g-v)*U,s[3]=0,s[4]=(u-S)*C,s[5]=(1-(h+p))*C,s[6]=(m+x)*C,s[7]=0,s[8]=(g+v)*A,s[9]=(m-x)*A,s[10]=(1-(h+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let a=zi.set(s[0],s[1],s[2]).length();const r=zi.set(s[4],s[5],s[6]).length(),o=zi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],un.copy(this);const l=1/a,d=1/r,f=1/o;return un.elements[0]*=l,un.elements[1]*=l,un.elements[2]*=l,un.elements[4]*=d,un.elements[5]*=d,un.elements[6]*=d,un.elements[8]*=f,un.elements[9]*=f,un.elements[10]*=f,e.setFromRotationMatrix(un),i.x=a,i.y=r,i.z=o,this}makePerspective(t,e,i,s,a,r,o=Hn){const c=this.elements,l=2*a/(e-t),d=2*a/(i-s),f=(e+t)/(e-t),h=(i+s)/(i-s);let u,g;if(o===Hn)u=-(r+a)/(r-a),g=-2*r*a/(r-a);else if(o===Na)u=-r/(r-a),g=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=u,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,a,r,o=Hn){const c=this.elements,l=1/(e-t),d=1/(i-s),f=1/(r-a),h=(e+t)*l,u=(i+s)*d;let g,_;if(o===Hn)g=(r+a)*f,_=-2*f;else if(o===Na)g=a*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-u,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const zi=new Y,un=new ue,_m=new Y(0,0,0),xm=new Y(1,1,1),Zn=new Y,qs=new Y,Ze=new Y,Ml=new ue,yl=new Fs;class Rn{constructor(t=0,e=0,i=0,s=Rn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],d=s[9],f=s[2],h=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(Xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,u),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Xe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(Xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Xe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,u),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Xe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Xe(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Ml.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ml,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return yl.setFromEuler(this),this.setFromQuaternion(yl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Rn.DEFAULT_ORDER="XYZ";class vc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let vm=0;const Sl=new Y,Oi=new Fs,Un=new ue,js=new Y,vs=new Y,Mm=new Y,ym=new Fs,bl=new Y(1,0,0),El=new Y(0,1,0),wl=new Y(0,0,1),Tl={type:"added"},Sm={type:"removed"},Bi={type:"childadded",child:null},br={type:"childremoved",child:null};class xe extends ls{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:vm++}),this.uuid=ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xe.DEFAULT_UP.clone();const t=new Y,e=new Rn,i=new Fs,s=new Y(1,1,1);function a(){i.setFromEuler(e,!1)}function r(){e.setFromQuaternion(i,void 0,!1)}e._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ue},normalMatrix:{value:new Zt}}),this.matrix=new ue,this.matrixWorld=new ue,this.matrixAutoUpdate=xe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Oi.setFromAxisAngle(t,e),this.quaternion.multiply(Oi),this}rotateOnWorldAxis(t,e){return Oi.setFromAxisAngle(t,e),this.quaternion.premultiply(Oi),this}rotateX(t){return this.rotateOnAxis(bl,t)}rotateY(t){return this.rotateOnAxis(El,t)}rotateZ(t){return this.rotateOnAxis(wl,t)}translateOnAxis(t,e){return Sl.copy(t).applyQuaternion(this.quaternion),this.position.add(Sl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(bl,t)}translateY(t){return this.translateOnAxis(El,t)}translateZ(t){return this.translateOnAxis(wl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Un.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?js.copy(t):js.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),vs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Un.lookAt(vs,js,this.up):Un.lookAt(js,vs,this.up),this.quaternion.setFromRotationMatrix(Un),s&&(Un.extractRotation(s.matrixWorld),Oi.setFromRotationMatrix(Un),this.quaternion.premultiply(Oi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Tl),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Sm),br.child=t,this.dispatchEvent(br),br.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Un.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Un.multiply(t.parent.matrixWorld)),t.applyMatrix4(Un),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Tl),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,t,Mm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,ym,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const f=c[l];a(t.shapes,f)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(t.materials,this.material[c]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(t.animations,c))}}if(e){const o=r(t.geometries),c=r(t.materials),l=r(t.textures),d=r(t.images),f=r(t.shapes),h=r(t.skeletons),u=r(t.animations),g=r(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=s,i;function r(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}xe.DEFAULT_UP=new Y(0,1,0);xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const fn=new Y,Fn=new Y,Er=new Y,Nn=new Y,Hi=new Y,Gi=new Y,Al=new Y,wr=new Y,Tr=new Y,Ar=new Y,Rr=new _e,Cr=new _e,Pr=new _e;class je{constructor(t=new Y,e=new Y,i=new Y){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),fn.subVectors(t,e),s.cross(fn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,i,s,a){fn.subVectors(s,e),Fn.subVectors(i,e),Er.subVectors(t,e);const r=fn.dot(fn),o=fn.dot(Fn),c=fn.dot(Er),l=Fn.dot(Fn),d=Fn.dot(Er),f=r*l-o*o;if(f===0)return a.set(0,0,0),null;const h=1/f,u=(l*c-o*d)*h,g=(r*d-o*c)*h;return a.set(1-u-g,g,u)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Nn)===null?!1:Nn.x>=0&&Nn.y>=0&&Nn.x+Nn.y<=1}static getInterpolation(t,e,i,s,a,r,o,c){return this.getBarycoord(t,e,i,s,Nn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Nn.x),c.addScaledVector(r,Nn.y),c.addScaledVector(o,Nn.z),c)}static getInterpolatedAttribute(t,e,i,s,a,r){return Rr.setScalar(0),Cr.setScalar(0),Pr.setScalar(0),Rr.fromBufferAttribute(t,e),Cr.fromBufferAttribute(t,i),Pr.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(Rr,a.x),r.addScaledVector(Cr,a.y),r.addScaledVector(Pr,a.z),r}static isFrontFacing(t,e,i,s){return fn.subVectors(i,e),Fn.subVectors(t,e),fn.cross(Fn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return fn.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),fn.cross(Fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return je.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return je.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,a){return je.getInterpolation(t,this.a,this.b,this.c,e,i,s,a)}containsPoint(t){return je.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return je.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,a=this.c;let r,o;Hi.subVectors(s,i),Gi.subVectors(a,i),wr.subVectors(t,i);const c=Hi.dot(wr),l=Gi.dot(wr);if(c<=0&&l<=0)return e.copy(i);Tr.subVectors(t,s);const d=Hi.dot(Tr),f=Gi.dot(Tr);if(d>=0&&f<=d)return e.copy(s);const h=c*f-d*l;if(h<=0&&c>=0&&d<=0)return r=c/(c-d),e.copy(i).addScaledVector(Hi,r);Ar.subVectors(t,a);const u=Hi.dot(Ar),g=Gi.dot(Ar);if(g>=0&&u<=g)return e.copy(a);const _=u*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(i).addScaledVector(Gi,o);const m=d*g-u*f;if(m<=0&&f-d>=0&&u-g>=0)return Al.subVectors(a,s),o=(f-d)/(f-d+(u-g)),e.copy(s).addScaledVector(Al,o);const p=1/(m+_+h);return r=_*p,o=h*p,e.copy(i).addScaledVector(Hi,r).addScaledVector(Gi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const jd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qn={h:0,s:0,l:0},Ks={h:0,s:0,l:0};function Dr(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Wt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=en){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ee.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=ee.workingColorSpace){return this.r=t,this.g=e,this.b=i,ee.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=ee.workingColorSpace){if(t=rm(t,1),e=Xe(e,0,1),i=Xe(i,0,1),e===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+e):i+e-i*e,r=2*i-a;this.r=Dr(r,a,t+1/3),this.g=Dr(r,a,t),this.b=Dr(r,a,t-1/3)}return ee.toWorkingColorSpace(this,s),this}setStyle(t,e=en){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=en){const i=jd[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Gn(t.r),this.g=Gn(t.g),this.b=Gn(t.b),this}copyLinearToSRGB(t){return this.r=es(t.r),this.g=es(t.g),this.b=es(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=en){return ee.fromWorkingColorSpace(Ie.copy(this),t),Math.round(Xe(Ie.r*255,0,255))*65536+Math.round(Xe(Ie.g*255,0,255))*256+Math.round(Xe(Ie.b*255,0,255))}getHexString(t=en){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ee.workingColorSpace){ee.fromWorkingColorSpace(Ie.copy(this),e);const i=Ie.r,s=Ie.g,a=Ie.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let c,l;const d=(o+r)/2;if(o===r)c=0,l=0;else{const f=r-o;switch(l=d<=.5?f/(r+o):f/(2-r-o),r){case i:c=(s-a)/f+(s<a?6:0);break;case s:c=(a-i)/f+2;break;case a:c=(i-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=ee.workingColorSpace){return ee.fromWorkingColorSpace(Ie.copy(this),e),t.r=Ie.r,t.g=Ie.g,t.b=Ie.b,t}getStyle(t=en){ee.fromWorkingColorSpace(Ie.copy(this),t);const e=Ie.r,i=Ie.g,s=Ie.b;return t!==en?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(qn),this.setHSL(qn.h+t,qn.s+e,qn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(qn),t.getHSL(Ks);const i=pr(qn.h,Ks.h,e),s=pr(qn.s,Ks.s,e),a=pr(qn.l,Ks.l,e);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*i+a[6]*s,this.g=a[1]*e+a[4]*i+a[7]*s,this.b=a[2]*e+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ie=new Wt;Wt.NAMES=jd;let bm=0;class wi extends ls{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:bm++}),this.uuid=ei(),this.name="",this.blending=Qi,this.side=ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ho,this.blendDst=uo,this.blendEquation=_i,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Wt(0,0,0),this.blendAlpha=0,this.depthFunc=ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=hl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ii,this.stencilZFail=Ii,this.stencilZPass=Ii,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Qi&&(i.blending=this.blending),this.side!==ni&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ho&&(i.blendSrc=this.blendSrc),this.blendDst!==uo&&(i.blendDst=this.blendDst),this.blendEquation!==_i&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ns&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==hl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ii&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ii&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ii&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(e){const a=s(t.textures),r=s(t.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=e[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class bn extends wi{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=hc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Me=new Y,Js=new Yt;class _n{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=jo,this.updateRanges=[],this.gpuType=Bn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Js.fromBufferAttribute(this,e),Js.applyMatrix3(t),this.setXY(e,Js.x,Js.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=wn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=re(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=wn(e,this.array)),e}setX(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=wn(e,this.array)),e}setY(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=wn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=wn(e,this.array)),e}setW(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),i=re(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),i=re(i,this.array),s=re(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),i=re(i,this.array),s=re(s,this.array),a=re(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==jo&&(t.usage=this.usage),t}}class Kd extends _n{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Jd extends _n{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class ve extends _n{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Em=0;const Qe=new ue,Lr=new xe,Vi=new Y,qe=new Ns,Ms=new Ns,Te=new Y;class $e extends ls{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Yd(t)?Jd:Kd)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Zt().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Qe.makeRotationFromQuaternion(t),this.applyMatrix4(Qe),this}rotateX(t){return Qe.makeRotationX(t),this.applyMatrix4(Qe),this}rotateY(t){return Qe.makeRotationY(t),this.applyMatrix4(Qe),this}rotateZ(t){return Qe.makeRotationZ(t),this.applyMatrix4(Qe),this}translate(t,e,i){return Qe.makeTranslation(t,e,i),this.applyMatrix4(Qe),this}scale(t,e,i){return Qe.makeScale(t,e,i),this.applyMatrix4(Qe),this}lookAt(t){return Lr.lookAt(t),Lr.updateMatrix(),this.applyMatrix4(Lr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vi).negate(),this.translate(Vi.x,Vi.y,Vi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,a=t.length;s<a;s++){const r=t[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ve(i,3))}else{for(let i=0,s=e.count;i<s;i++){const a=t[i];e.setXYZ(i,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ns);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const a=e[i];qe.setFromBufferAttribute(a),this.morphTargetsRelative?(Te.addVectors(this.boundingBox.min,qe.min),this.boundingBox.expandByPoint(Te),Te.addVectors(this.boundingBox.max,qe.max),this.boundingBox.expandByPoint(Te)):(this.boundingBox.expandByPoint(qe.min),this.boundingBox.expandByPoint(qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Wa);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Y,1/0);return}if(t){const i=this.boundingSphere.center;if(qe.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];Ms.setFromBufferAttribute(o),this.morphTargetsRelative?(Te.addVectors(qe.min,Ms.min),qe.expandByPoint(Te),Te.addVectors(qe.max,Ms.max),qe.expandByPoint(Te)):(qe.expandByPoint(Ms.min),qe.expandByPoint(Ms.max))}qe.getCenter(i);let s=0;for(let a=0,r=t.count;a<r;a++)Te.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(Te));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)Te.fromBufferAttribute(o,l),c&&(Vi.fromBufferAttribute(t,l),Te.add(Vi)),s=Math.max(s,i.distanceToSquared(Te))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new _n(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let T=0;T<i.count;T++)o[T]=new Y,c[T]=new Y;const l=new Y,d=new Y,f=new Y,h=new Yt,u=new Yt,g=new Yt,_=new Y,m=new Y;function p(T,b,y){l.fromBufferAttribute(i,T),d.fromBufferAttribute(i,b),f.fromBufferAttribute(i,y),h.fromBufferAttribute(a,T),u.fromBufferAttribute(a,b),g.fromBufferAttribute(a,y),d.sub(l),f.sub(l),u.sub(h),g.sub(h);const D=1/(u.x*g.y-g.x*u.y);isFinite(D)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(D),m.copy(f).multiplyScalar(u.x).addScaledVector(d,-g.x).multiplyScalar(D),o[T].add(_),o[b].add(_),o[y].add(_),c[T].add(m),c[b].add(m),c[y].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let T=0,b=x.length;T<b;++T){const y=x[T],D=y.start,H=y.count;for(let z=D,X=D+H;z<X;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const v=new Y,S=new Y,U=new Y,C=new Y;function A(T){U.fromBufferAttribute(s,T),C.copy(U);const b=o[T];v.copy(b),v.sub(U.multiplyScalar(U.dot(b))).normalize(),S.crossVectors(C,b);const D=S.dot(c[T])<0?-1:1;r.setXYZW(T,v.x,v.y,v.z,D)}for(let T=0,b=x.length;T<b;++T){const y=x[T],D=y.start,H=y.count;for(let z=D,X=D+H;z<X;z+=3)A(t.getX(z+0)),A(t.getX(z+1)),A(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new _n(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,u=i.count;h<u;h++)i.setXYZ(h,0,0,0);const s=new Y,a=new Y,r=new Y,o=new Y,c=new Y,l=new Y,d=new Y,f=new Y;if(t)for(let h=0,u=t.count;h<u;h+=3){const g=t.getX(h+0),_=t.getX(h+1),m=t.getX(h+2);s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,_),r.fromBufferAttribute(e,m),d.subVectors(r,a),f.subVectors(s,a),d.cross(f),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),o.add(d),c.add(d),l.add(d),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,u=e.count;h<u;h+=3)s.fromBufferAttribute(e,h+0),a.fromBufferAttribute(e,h+1),r.fromBufferAttribute(e,h+2),d.subVectors(r,a),f.subVectors(s,a),d.cross(f),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Te.fromBufferAttribute(t,e),Te.normalize(),t.setXYZ(e,Te.x,Te.y,Te.z)}toNonIndexed(){function t(o,c){const l=o.array,d=o.itemSize,f=o.normalized,h=new l.constructor(c.length*d);let u=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?u=c[_]*o.data.stride+o.offset:u=c[_]*d;for(let p=0;p<d;p++)h[g++]=l[u++]}return new _n(h,d,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new $e,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,i);e.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let d=0,f=l.length;d<f;d++){const h=l[d],u=t(h,i);c.push(u)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let f=0,h=l.length;f<h;f++){const u=l[f];d.push(u.toJSON(t.data))}d.length>0&&(s[c]=d,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(e))}const a=t.morphAttributes;for(const l in a){const d=[],f=a[l];for(let h=0,u=f.length;h<u;h++)d.push(f[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,d=r.length;l<d;l++){const f=r[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Rl=new ue,li=new xc,Qs=new Wa,Cl=new Y,ta=new Y,ea=new Y,na=new Y,Ir=new Y,ia=new Y,Pl=new Y,sa=new Y;class he extends xe{constructor(t=new $e,e=new bn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(a&&o){ia.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const d=o[c],f=a[c];d!==0&&(Ir.fromBufferAttribute(f,t),r?ia.addScaledVector(Ir,d):ia.addScaledVector(Ir.sub(e),d))}e.add(ia)}return e}raycast(t,e){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Qs.copy(i.boundingSphere),Qs.applyMatrix4(a),li.copy(t.ray).recast(t.near),!(Qs.containsPoint(li.origin)===!1&&(li.intersectSphere(Qs,Cl)===null||li.origin.distanceToSquared(Cl)>(t.far-t.near)**2))&&(Rl.copy(a).invert(),li.copy(t.ray).applyMatrix4(Rl),!(i.boundingBox!==null&&li.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,li)))}_computeIntersections(t,e,i){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,d=a.attributes.uv1,f=a.attributes.normal,h=a.groups,u=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=r[m.materialIndex],x=Math.max(m.start,u.start),v=Math.min(o.count,Math.min(m.start+m.count,u.start+u.count));for(let S=x,U=v;S<U;S+=3){const C=o.getX(S),A=o.getX(S+1),T=o.getX(S+2);s=aa(this,p,t,i,l,d,f,C,A,T),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,u.start),_=Math.min(o.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){const x=o.getX(m),v=o.getX(m+1),S=o.getX(m+2);s=aa(this,r,t,i,l,d,f,x,v,S),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=r[m.materialIndex],x=Math.max(m.start,u.start),v=Math.min(c.count,Math.min(m.start+m.count,u.start+u.count));for(let S=x,U=v;S<U;S+=3){const C=S,A=S+1,T=S+2;s=aa(this,p,t,i,l,d,f,C,A,T),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,u.start),_=Math.min(c.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){const x=m,v=m+1,S=m+2;s=aa(this,r,t,i,l,d,f,x,v,S),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function wm(n,t,e,i,s,a,r,o){let c;if(t.side===We?c=i.intersectTriangle(r,a,s,!0,o):c=i.intersectTriangle(s,a,r,t.side===ni,o),c===null)return null;sa.copy(o),sa.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(sa);return l<e.near||l>e.far?null:{distance:l,point:sa.clone(),object:n}}function aa(n,t,e,i,s,a,r,o,c,l){n.getVertexPosition(o,ta),n.getVertexPosition(c,ea),n.getVertexPosition(l,na);const d=wm(n,t,e,i,ta,ea,na,Pl);if(d){const f=new Y;je.getBarycoord(Pl,ta,ea,na,f),s&&(d.uv=je.getInterpolatedAttribute(s,o,c,l,f,new Yt)),a&&(d.uv1=je.getInterpolatedAttribute(a,o,c,l,f,new Yt)),r&&(d.normal=je.getInterpolatedAttribute(r,o,c,l,f,new Y),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:c,c:l,normal:new Y,materialIndex:0};je.getNormal(ta,ea,na,h.normal),d.face=h,d.barycoord=f}return d}class Cn extends $e{constructor(t=1,e=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],d=[],f=[];let h=0,u=0;g("z","y","x",-1,-1,i,e,t,r,a,0),g("z","y","x",1,-1,i,e,-t,r,a,1),g("x","z","y",1,1,t,i,e,s,r,2),g("x","z","y",1,-1,t,i,-e,s,r,3),g("x","y","z",1,-1,t,e,i,s,a,4),g("x","y","z",-1,-1,t,e,-i,s,a,5),this.setIndex(c),this.setAttribute("position",new ve(l,3)),this.setAttribute("normal",new ve(d,3)),this.setAttribute("uv",new ve(f,2));function g(_,m,p,x,v,S,U,C,A,T,b){const y=S/A,D=U/T,H=S/2,z=U/2,X=C/2,P=A+1,R=T+1;let V=0,B=0;const Z=new Y;for(let J=0;J<R;J++){const rt=J*D-z;for(let ft=0;ft<P;ft++){const vt=ft*y-H;Z[_]=vt*x,Z[m]=rt*v,Z[p]=X,l.push(Z.x,Z.y,Z.z),Z[_]=0,Z[m]=0,Z[p]=C>0?1:-1,d.push(Z.x,Z.y,Z.z),f.push(ft/A),f.push(1-J/T),V+=1}}for(let J=0;J<T;J++)for(let rt=0;rt<A;rt++){const ft=h+rt+P*J,vt=h+rt+P*(J+1),$=h+(rt+1)+P*(J+1),tt=h+(rt+1)+P*J;c.push(ft,vt,tt),c.push(vt,$,tt),B+=6}o.addGroup(u,B,b),u+=B,h+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Cn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function os(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Ne(n){const t={};for(let e=0;e<n.length;e++){const i=os(n[e]);for(const s in i)t[s]=i[s]}return t}function Tm(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Qd(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ee.workingColorSpace}const Am={clone:os,merge:Ne};var Rm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Cm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ii extends wi{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Rm,this.fragmentShader=Cm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=os(t.uniforms),this.uniformsGroups=Tm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class th extends xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ue,this.projectionMatrix=new ue,this.projectionMatrixInverse=new ue,this.coordinateSystem=Hn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const jn=new Y,Dl=new Yt,Ll=new Yt;class nn extends th{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ko*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(wa*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ko*2*Math.atan(Math.tan(wa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(jn.x,jn.y).multiplyScalar(-t/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(jn.x,jn.y).multiplyScalar(-t/jn.z)}getViewSize(t,e){return this.getViewBounds(t,Dl,Ll),e.subVectors(Ll,Dl)}setViewOffset(t,e,i,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(wa*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,e-=r.offsetY*i/l,s*=r.width/c,i*=r.height/l}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Xi=-90,Wi=1;class Pm extends xe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new nn(Xi,Wi,t,e);s.layers=this.layers,this.add(s);const a=new nn(Xi,Wi,t,e);a.layers=this.layers,this.add(a);const r=new nn(Xi,Wi,t,e);r.layers=this.layers,this.add(r);const o=new nn(Xi,Wi,t,e);o.layers=this.layers,this.add(o);const c=new nn(Xi,Wi,t,e);c.layers=this.layers,this.add(c);const l=new nn(Xi,Wi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,a,r,o,c]=e;for(const l of e)this.remove(l);if(t===Hn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Na)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,d]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,a),t.setRenderTarget(i,1,s),t.render(e,r),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,d),t.setRenderTarget(f,h,u),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class eh extends Be{constructor(t,e,i,s,a,r,o,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:is,super(t,e,i,s,a,r,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Dm extends Ei{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new eh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Tn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Cn(5,5,5),a=new ii({name:"CubemapFromEquirect",uniforms:os(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:We,blending:Qn});a.uniforms.tEquirect.value=e;const r=new he(s,a),o=e.minFilter;return e.minFilter===Mi&&(e.minFilter=Tn),new Pm(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,i,s){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,i,s);t.setRenderTarget(a)}}const kr=new Y,Lm=new Y,Im=new Zt;class pi{constructor(t=new Y(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=kr.subVectors(i,e).cross(Lm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(kr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Im.getNormalMatrix(t),s=this.coplanarPoint(kr).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const di=new Wa,ra=new Y;class Mc{constructor(t=new pi,e=new pi,i=new pi,s=new pi,a=new pi,r=new pi){this.planes=[t,e,i,s,a,r]}set(t,e,i,s,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Hn){const i=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],c=s[3],l=s[4],d=s[5],f=s[6],h=s[7],u=s[8],g=s[9],_=s[10],m=s[11],p=s[12],x=s[13],v=s[14],S=s[15];if(i[0].setComponents(c-a,h-l,m-u,S-p).normalize(),i[1].setComponents(c+a,h+l,m+u,S+p).normalize(),i[2].setComponents(c+r,h+d,m+g,S+x).normalize(),i[3].setComponents(c-r,h-d,m-g,S-x).normalize(),i[4].setComponents(c-o,h-f,m-_,S-v).normalize(),e===Hn)i[5].setComponents(c+o,h+f,m+_,S+v).normalize();else if(e===Na)i[5].setComponents(o,f,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),di.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),di.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(di)}intersectsSprite(t){return di.center.set(0,0,0),di.radius=.7071067811865476,di.applyMatrix4(t.matrixWorld),this.intersectsSphere(di)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(ra.x=s.normal.x>0?t.max.x:t.min.x,ra.y=s.normal.y>0?t.max.y:t.min.y,ra.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ra)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function nh(){let n=null,t=!1,e=null,i=null;function s(a,r){e(a,r),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){n=a}}}function km(n){const t=new WeakMap;function e(o,c){const l=o.array,d=o.usage,f=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,d),o.onUploadCallback();let u;if(l instanceof Float32Array)u=n.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=n.SHORT;else if(l instanceof Uint32Array)u=n.UNSIGNED_INT;else if(l instanceof Int32Array)u=n.INT;else if(l instanceof Int8Array)u=n.BYTE;else if(l instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,c,l){const d=c.array,f=c.updateRanges;if(n.bindBuffer(l,o),f.length===0)n.bufferSubData(l,0,d);else{f.sort((u,g)=>u.start-g.start);let h=0;for(let u=1;u<f.length;u++){const g=f[h],_=f[u];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,f[h]=_)}f.length=h+1;for(let u=0,g=f.length;u<g;u++){const _=f[u];n.bufferSubData(l,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(n.deleteBuffer(c.buffer),t.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=t.get(o);(!d||d.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}class $a extends $e{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const a=t/2,r=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,d=c+1,f=t/o,h=e/c,u=[],g=[],_=[],m=[];for(let p=0;p<d;p++){const x=p*h-r;for(let v=0;v<l;v++){const S=v*f-a;g.push(S,-x,0),_.push(0,0,1),m.push(v/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<o;x++){const v=x+l*p,S=x+l*(p+1),U=x+1+l*(p+1),C=x+1+l*p;u.push(v,S,C),u.push(S,U,C)}this.setIndex(u),this.setAttribute("position",new ve(g,3)),this.setAttribute("normal",new ve(_,3)),this.setAttribute("uv",new ve(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $a(t.width,t.height,t.widthSegments,t.heightSegments)}}var Um=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Fm=`#ifdef USE_ALPHAHASH
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
#endif`,Nm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Om=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Bm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hm=`#ifdef USE_AOMAP
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
#endif`,Gm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vm=`#ifdef USE_BATCHING
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
#endif`,Xm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Wm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$m=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ym=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Zm=`#ifdef USE_IRIDESCENCE
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
#endif`,qm=`#ifdef USE_BUMPMAP
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
#endif`,jm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Km=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Jm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Qm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,tg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,eg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ng=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ig=`#if defined( USE_COLOR_ALPHA )
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
#endif`,sg=`#define PI 3.141592653589793
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
} // validated`,ag=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,rg=`vec3 transformedNormal = objectNormal;
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
#endif`,og=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,cg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,lg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,dg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,hg="gl_FragColor = linearToOutputTexel( gl_FragColor );",ug=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,fg=`#ifdef USE_ENVMAP
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
#endif`,pg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,mg=`#ifdef USE_ENVMAP
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
#endif`,gg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_g=`#ifdef USE_ENVMAP
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
#endif`,xg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Mg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,yg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sg=`#ifdef USE_GRADIENTMAP
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
}`,bg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Eg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Tg=`uniform bool receiveShadow;
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
#endif`,Ag=`#ifdef USE_ENVMAP
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
#endif`,Rg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Cg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Pg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Dg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Lg=`PhysicalMaterial material;
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
#endif`,Ig=`struct PhysicalMaterial {
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
}`,kg=`
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
#endif`,Ug=`#if defined( RE_IndirectDiffuse )
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
#endif`,Fg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ng=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Og=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Hg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Gg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Xg=`#if defined( USE_POINTS_UV )
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
#endif`,Wg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$g=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Yg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Zg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jg=`#ifdef USE_MORPHTARGETS
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
#endif`,Kg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Qg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,t0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,e0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,n0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,i0=`#ifdef USE_NORMALMAP
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
#endif`,s0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,a0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,r0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,o0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,c0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,l0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,d0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,h0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,u0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,f0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,p0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,m0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,g0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,_0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,x0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,v0=`float getShadowMask() {
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
}`,M0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,y0=`#ifdef USE_SKINNING
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
#endif`,S0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,b0=`#ifdef USE_SKINNING
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
#endif`,E0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,w0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,T0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,A0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,R0=`#ifdef USE_TRANSMISSION
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
#endif`,C0=`#ifdef USE_TRANSMISSION
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
#endif`,P0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,D0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,L0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,I0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const k0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,U0=`uniform sampler2D t2D;
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
}`,F0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,N0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,z0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,O0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,B0=`#include <common>
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
}`,H0=`#if DEPTH_PACKING == 3200
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
}`,G0=`#define DISTANCE
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
}`,V0=`#define DISTANCE
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
}`,X0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,W0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$0=`uniform float scale;
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
}`,Y0=`uniform vec3 diffuse;
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
}`,Z0=`#include <common>
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
}`,q0=`uniform vec3 diffuse;
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
}`,j0=`#define LAMBERT
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
}`,K0=`#define LAMBERT
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
}`,J0=`#define MATCAP
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
}`,Q0=`#define MATCAP
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
}`,t_=`#define NORMAL
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
}`,e_=`#define NORMAL
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
}`,n_=`#define PHONG
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
}`,i_=`#define PHONG
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
}`,s_=`#define STANDARD
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
}`,a_=`#define STANDARD
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
}`,r_=`#define TOON
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
}`,o_=`#define TOON
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
}`,c_=`uniform float size;
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
}`,l_=`uniform vec3 diffuse;
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
}`,d_=`#include <common>
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
}`,h_=`uniform vec3 color;
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
}`,u_=`uniform float rotation;
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
}`,f_=`uniform vec3 diffuse;
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
}`,qt={alphahash_fragment:Um,alphahash_pars_fragment:Fm,alphamap_fragment:Nm,alphamap_pars_fragment:zm,alphatest_fragment:Om,alphatest_pars_fragment:Bm,aomap_fragment:Hm,aomap_pars_fragment:Gm,batching_pars_vertex:Vm,batching_vertex:Xm,begin_vertex:Wm,beginnormal_vertex:$m,bsdfs:Ym,iridescence_fragment:Zm,bumpmap_pars_fragment:qm,clipping_planes_fragment:jm,clipping_planes_pars_fragment:Km,clipping_planes_pars_vertex:Jm,clipping_planes_vertex:Qm,color_fragment:tg,color_pars_fragment:eg,color_pars_vertex:ng,color_vertex:ig,common:sg,cube_uv_reflection_fragment:ag,defaultnormal_vertex:rg,displacementmap_pars_vertex:og,displacementmap_vertex:cg,emissivemap_fragment:lg,emissivemap_pars_fragment:dg,colorspace_fragment:hg,colorspace_pars_fragment:ug,envmap_fragment:fg,envmap_common_pars_fragment:pg,envmap_pars_fragment:mg,envmap_pars_vertex:gg,envmap_physical_pars_fragment:Ag,envmap_vertex:_g,fog_vertex:xg,fog_pars_vertex:vg,fog_fragment:Mg,fog_pars_fragment:yg,gradientmap_pars_fragment:Sg,lightmap_pars_fragment:bg,lights_lambert_fragment:Eg,lights_lambert_pars_fragment:wg,lights_pars_begin:Tg,lights_toon_fragment:Rg,lights_toon_pars_fragment:Cg,lights_phong_fragment:Pg,lights_phong_pars_fragment:Dg,lights_physical_fragment:Lg,lights_physical_pars_fragment:Ig,lights_fragment_begin:kg,lights_fragment_maps:Ug,lights_fragment_end:Fg,logdepthbuf_fragment:Ng,logdepthbuf_pars_fragment:zg,logdepthbuf_pars_vertex:Og,logdepthbuf_vertex:Bg,map_fragment:Hg,map_pars_fragment:Gg,map_particle_fragment:Vg,map_particle_pars_fragment:Xg,metalnessmap_fragment:Wg,metalnessmap_pars_fragment:$g,morphinstance_vertex:Yg,morphcolor_vertex:Zg,morphnormal_vertex:qg,morphtarget_pars_vertex:jg,morphtarget_vertex:Kg,normal_fragment_begin:Jg,normal_fragment_maps:Qg,normal_pars_fragment:t0,normal_pars_vertex:e0,normal_vertex:n0,normalmap_pars_fragment:i0,clearcoat_normal_fragment_begin:s0,clearcoat_normal_fragment_maps:a0,clearcoat_pars_fragment:r0,iridescence_pars_fragment:o0,opaque_fragment:c0,packing:l0,premultiplied_alpha_fragment:d0,project_vertex:h0,dithering_fragment:u0,dithering_pars_fragment:f0,roughnessmap_fragment:p0,roughnessmap_pars_fragment:m0,shadowmap_pars_fragment:g0,shadowmap_pars_vertex:_0,shadowmap_vertex:x0,shadowmask_pars_fragment:v0,skinbase_vertex:M0,skinning_pars_vertex:y0,skinning_vertex:S0,skinnormal_vertex:b0,specularmap_fragment:E0,specularmap_pars_fragment:w0,tonemapping_fragment:T0,tonemapping_pars_fragment:A0,transmission_fragment:R0,transmission_pars_fragment:C0,uv_pars_fragment:P0,uv_pars_vertex:D0,uv_vertex:L0,worldpos_vertex:I0,background_vert:k0,background_frag:U0,backgroundCube_vert:F0,backgroundCube_frag:N0,cube_vert:z0,cube_frag:O0,depth_vert:B0,depth_frag:H0,distanceRGBA_vert:G0,distanceRGBA_frag:V0,equirect_vert:X0,equirect_frag:W0,linedashed_vert:$0,linedashed_frag:Y0,meshbasic_vert:Z0,meshbasic_frag:q0,meshlambert_vert:j0,meshlambert_frag:K0,meshmatcap_vert:J0,meshmatcap_frag:Q0,meshnormal_vert:t_,meshnormal_frag:e_,meshphong_vert:n_,meshphong_frag:i_,meshphysical_vert:s_,meshphysical_frag:a_,meshtoon_vert:r_,meshtoon_frag:o_,points_vert:c_,points_frag:l_,shadow_vert:d_,shadow_frag:h_,sprite_vert:u_,sprite_frag:f_},Ct={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},envMapRotation:{value:new Zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new Yt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new Yt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},En={basic:{uniforms:Ne([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.fog]),vertexShader:qt.meshbasic_vert,fragmentShader:qt.meshbasic_frag},lambert:{uniforms:Ne([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,Ct.lights,{emissive:{value:new Wt(0)}}]),vertexShader:qt.meshlambert_vert,fragmentShader:qt.meshlambert_frag},phong:{uniforms:Ne([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,Ct.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30}}]),vertexShader:qt.meshphong_vert,fragmentShader:qt.meshphong_frag},standard:{uniforms:Ne([Ct.common,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.roughnessmap,Ct.metalnessmap,Ct.fog,Ct.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag},toon:{uniforms:Ne([Ct.common,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.gradientmap,Ct.fog,Ct.lights,{emissive:{value:new Wt(0)}}]),vertexShader:qt.meshtoon_vert,fragmentShader:qt.meshtoon_frag},matcap:{uniforms:Ne([Ct.common,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,{matcap:{value:null}}]),vertexShader:qt.meshmatcap_vert,fragmentShader:qt.meshmatcap_frag},points:{uniforms:Ne([Ct.points,Ct.fog]),vertexShader:qt.points_vert,fragmentShader:qt.points_frag},dashed:{uniforms:Ne([Ct.common,Ct.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qt.linedashed_vert,fragmentShader:qt.linedashed_frag},depth:{uniforms:Ne([Ct.common,Ct.displacementmap]),vertexShader:qt.depth_vert,fragmentShader:qt.depth_frag},normal:{uniforms:Ne([Ct.common,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,{opacity:{value:1}}]),vertexShader:qt.meshnormal_vert,fragmentShader:qt.meshnormal_frag},sprite:{uniforms:Ne([Ct.sprite,Ct.fog]),vertexShader:qt.sprite_vert,fragmentShader:qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qt.background_vert,fragmentShader:qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Zt}},vertexShader:qt.backgroundCube_vert,fragmentShader:qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qt.cube_vert,fragmentShader:qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qt.equirect_vert,fragmentShader:qt.equirect_frag},distanceRGBA:{uniforms:Ne([Ct.common,Ct.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qt.distanceRGBA_vert,fragmentShader:qt.distanceRGBA_frag},shadow:{uniforms:Ne([Ct.lights,Ct.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:qt.shadow_vert,fragmentShader:qt.shadow_frag}};En.physical={uniforms:Ne([En.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new Yt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new Yt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new Yt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag};const oa={r:0,b:0,g:0},hi=new Rn,p_=new ue;function m_(n,t,e,i,s,a,r){const o=new Wt(0);let c=a===!0?0:1,l,d,f=null,h=0,u=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?e:t).get(v)),v}function _(x){let v=!1;const S=g(x);S===null?p(o,c):S&&S.isColor&&(p(S,1),v=!0);const U=n.xr.getEnvironmentBlendMode();U==="additive"?i.buffers.color.setClear(0,0,0,1,r):U==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,v){const S=g(v);S&&(S.isCubeTexture||S.mapping===Va)?(d===void 0&&(d=new he(new Cn(1,1,1),new ii({name:"BackgroundCubeMaterial",uniforms:os(En.backgroundCube.uniforms),vertexShader:En.backgroundCube.vertexShader,fragmentShader:En.backgroundCube.fragmentShader,side:We,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(U,C,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),hi.copy(v.backgroundRotation),hi.x*=-1,hi.y*=-1,hi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),d.material.uniforms.envMap.value=S,d.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(p_.makeRotationFromEuler(hi)),d.material.toneMapped=ee.getTransfer(S.colorSpace)!==ae,(f!==S||h!==S.version||u!==n.toneMapping)&&(d.material.needsUpdate=!0,f=S,h=S.version,u=n.toneMapping),d.layers.enableAll(),x.unshift(d,d.geometry,d.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new he(new $a(2,2),new ii({name:"BackgroundMaterial",uniforms:os(En.background.uniforms),vertexShader:En.background.vertexShader,fragmentShader:En.background.fragmentShader,side:ni,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=ee.getTransfer(S.colorSpace)!==ae,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(f!==S||h!==S.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,f=S,h=S.version,u=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,v){x.getRGB(oa,Qd(n)),i.buffers.color.setClear(oa.r,oa.g,oa.b,v,r)}return{getClearColor:function(){return o},setClearColor:function(x,v=1){o.set(x),c=v,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(o,c)},render:_,addToRenderList:m}}function g_(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let a=s,r=!1;function o(y,D,H,z,X){let P=!1;const R=f(z,H,D);a!==R&&(a=R,l(a.object)),P=u(y,z,H,X),P&&g(y,z,H,X),X!==null&&t.update(X,n.ELEMENT_ARRAY_BUFFER),(P||r)&&(r=!1,S(y,D,H,z),X!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(X).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function d(y){return n.deleteVertexArray(y)}function f(y,D,H){const z=H.wireframe===!0;let X=i[y.id];X===void 0&&(X={},i[y.id]=X);let P=X[D.id];P===void 0&&(P={},X[D.id]=P);let R=P[z];return R===void 0&&(R=h(c()),P[z]=R),R}function h(y){const D=[],H=[],z=[];for(let X=0;X<e;X++)D[X]=0,H[X]=0,z[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:H,attributeDivisors:z,object:y,attributes:{},index:null}}function u(y,D,H,z){const X=a.attributes,P=D.attributes;let R=0;const V=H.getAttributes();for(const B in V)if(V[B].location>=0){const J=X[B];let rt=P[B];if(rt===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(rt=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(rt=y.instanceColor)),J===void 0||J.attribute!==rt||rt&&J.data!==rt.data)return!0;R++}return a.attributesNum!==R||a.index!==z}function g(y,D,H,z){const X={},P=D.attributes;let R=0;const V=H.getAttributes();for(const B in V)if(V[B].location>=0){let J=P[B];J===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(J=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(J=y.instanceColor));const rt={};rt.attribute=J,J&&J.data&&(rt.data=J.data),X[B]=rt,R++}a.attributes=X,a.attributesNum=R,a.index=z}function _(){const y=a.newAttributes;for(let D=0,H=y.length;D<H;D++)y[D]=0}function m(y){p(y,0)}function p(y,D){const H=a.newAttributes,z=a.enabledAttributes,X=a.attributeDivisors;H[y]=1,z[y]===0&&(n.enableVertexAttribArray(y),z[y]=1),X[y]!==D&&(n.vertexAttribDivisor(y,D),X[y]=D)}function x(){const y=a.newAttributes,D=a.enabledAttributes;for(let H=0,z=D.length;H<z;H++)D[H]!==y[H]&&(n.disableVertexAttribArray(H),D[H]=0)}function v(y,D,H,z,X,P,R){R===!0?n.vertexAttribIPointer(y,D,H,X,P):n.vertexAttribPointer(y,D,H,z,X,P)}function S(y,D,H,z){_();const X=z.attributes,P=H.getAttributes(),R=D.defaultAttributeValues;for(const V in P){const B=P[V];if(B.location>=0){let Z=X[V];if(Z===void 0&&(V==="instanceMatrix"&&y.instanceMatrix&&(Z=y.instanceMatrix),V==="instanceColor"&&y.instanceColor&&(Z=y.instanceColor)),Z!==void 0){const J=Z.normalized,rt=Z.itemSize,ft=t.get(Z);if(ft===void 0)continue;const vt=ft.buffer,$=ft.type,tt=ft.bytesPerElement,gt=$===n.INT||$===n.UNSIGNED_INT||Z.gpuType===uc;if(Z.isInterleavedBufferAttribute){const j=Z.data,pt=j.stride,Dt=Z.offset;if(j.isInstancedInterleavedBuffer){for(let Ft=0;Ft<B.locationSize;Ft++)p(B.location+Ft,j.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Ft=0;Ft<B.locationSize;Ft++)m(B.location+Ft);n.bindBuffer(n.ARRAY_BUFFER,vt);for(let Ft=0;Ft<B.locationSize;Ft++)v(B.location+Ft,rt/B.locationSize,$,J,pt*tt,(Dt+rt/B.locationSize*Ft)*tt,gt)}else{if(Z.isInstancedBufferAttribute){for(let j=0;j<B.locationSize;j++)p(B.location+j,Z.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let j=0;j<B.locationSize;j++)m(B.location+j);n.bindBuffer(n.ARRAY_BUFFER,vt);for(let j=0;j<B.locationSize;j++)v(B.location+j,rt/B.locationSize,$,J,rt*tt,rt/B.locationSize*j*tt,gt)}}else if(R!==void 0){const J=R[V];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(B.location,J);break;case 3:n.vertexAttrib3fv(B.location,J);break;case 4:n.vertexAttrib4fv(B.location,J);break;default:n.vertexAttrib1fv(B.location,J)}}}}x()}function U(){T();for(const y in i){const D=i[y];for(const H in D){const z=D[H];for(const X in z)d(z[X].object),delete z[X];delete D[H]}delete i[y]}}function C(y){if(i[y.id]===void 0)return;const D=i[y.id];for(const H in D){const z=D[H];for(const X in z)d(z[X].object),delete z[X];delete D[H]}delete i[y.id]}function A(y){for(const D in i){const H=i[D];if(H[y.id]===void 0)continue;const z=H[y.id];for(const X in z)d(z[X].object),delete z[X];delete H[y.id]}}function T(){b(),r=!0,a!==s&&(a=s,l(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:b,dispose:U,releaseStatesOfGeometry:C,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function __(n,t,e){let i;function s(l){i=l}function a(l,d){n.drawArrays(i,l,d),e.update(d,i,1)}function r(l,d,f){f!==0&&(n.drawArraysInstanced(i,l,d,f),e.update(d,i,f))}function o(l,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,d,0,f);let u=0;for(let g=0;g<f;g++)u+=d[g];e.update(u,i,1)}function c(l,d,f,h){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<l.length;g++)r(l[g],d[g],h[g]);else{u.multiDrawArraysInstancedWEBGL(i,l,0,d,0,h,0,f);let g=0;for(let _=0;_<f;_++)g+=d[_]*h[_];e.update(g,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function x_(n,t,e,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(A){return!(A!==mn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const T=A===Us&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Vn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Bn&&!T)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const f=e.logarithmicDepthBuffer===!0,h=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),U=g>0,C=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:h,maxTextures:u,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:v,maxFragmentUniforms:S,vertexTextures:U,maxSamples:C}}function v_(n){const t=this;let e=null,i=0,s=!1,a=!1;const r=new pi,o=new Zt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const u=f.length!==0||h||i!==0||s;return s=h,i=f.length,u},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,h){e=d(f,h,0)},this.setState=function(f,h,u){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!s||g===null||g.length===0||a&&!m)a?d(null):l();else{const x=a?0:i,v=x*4;let S=p.clippingState||null;c.value=S,S=d(g,h,v,u);for(let U=0;U!==v;++U)S[U]=e[U];p.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function d(f,h,u,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=u+_*4,x=h.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,S=u;v!==_;++v,S+=4)r.copy(f[v]).applyMatrix4(x,o),r.normal.toArray(m,S),m[S+3]=r.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function M_(n){let t=new WeakMap;function e(r,o){return o===Mo?r.mapping=is:o===yo&&(r.mapping=ss),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===Mo||o===yo)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new Dm(c.height);return l.fromEquirectangularTexture(n,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function a(){t=new WeakMap}return{get:i,dispose:a}}class ih extends th{constructor(t=-1,e=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-t,r=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ki=4,Il=[.125,.215,.35,.446,.526,.582],xi=20,Ur=new ih,kl=new Wt;let Fr=null,Nr=0,zr=0,Or=!1;const mi=(1+Math.sqrt(5))/2,$i=1/mi,Ul=[new Y(-mi,$i,0),new Y(mi,$i,0),new Y(-$i,0,mi),new Y($i,0,mi),new Y(0,mi,-$i),new Y(0,mi,$i),new Y(-1,1,-1),new Y(1,1,-1),new Y(-1,1,1),new Y(1,1,1)];class Fl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Fr=this._renderer.getRenderTarget(),Nr=this._renderer.getActiveCubeFace(),zr=this._renderer.getActiveMipmapLevel(),Or=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,i,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ol(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=zl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Fr,Nr,zr),this._renderer.xr.enabled=Or,t.scissorTest=!1,ca(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===is||t.mapping===ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Fr=this._renderer.getRenderTarget(),Nr=this._renderer.getActiveCubeFace(),zr=this._renderer.getActiveMipmapLevel(),Or=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Tn,minFilter:Tn,generateMipmaps:!1,type:Us,format:mn,colorSpace:cs,depthBuffer:!1},s=Nl(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nl(t,e,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=y_(a)),this._blurMaterial=S_(a,t,e)}return s}_compileMaterial(t){const e=new he(this._lodPlanes[0],t);this._renderer.compile(e,Ur)}_sceneToCubeUV(t,e,i,s){const o=new nn(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(kl),d.toneMapping=ti,d.autoClear=!1;const u=new bn({name:"PMREM.Background",side:We,depthWrite:!1,depthTest:!1}),g=new he(new Cn,u);let _=!1;const m=t.background;m?m.isColor&&(u.color.copy(m),t.background=null,_=!0):(u.color.copy(kl),_=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):x===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const v=this._cubeSize;ca(s,x*v,p>2?v:0,v,v),d.setRenderTarget(s),_&&d.render(g,o),d.render(t,o)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=h,d.autoClear=f,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===is||t.mapping===ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ol()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=zl());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new he(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const c=this._cubeSize;ca(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(r,Ur)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=Ul[(s-a-1)%Ul.length];this._blur(t,a-1,a,r,o)}e.autoClear=i}_blur(t,e,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,i,s,"latitudinal",a),this._halfBlur(r,t,i,i,s,"longitudinal",a)}_halfBlur(t,e,i,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,f=new he(this._lodPlanes[s],l),h=l.uniforms,u=this._sizeLods[i]-1,g=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*xi-1),_=a/g,m=isFinite(a)?1+Math.floor(d*_):xi;m>xi&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${xi}`);const p=[];let x=0;for(let A=0;A<xi;++A){const T=A/_,b=Math.exp(-T*T/2);p.push(b),A===0?x+=b:A<m&&(x+=2*b)}for(let A=0;A<p.length;A++)p[A]=p[A]/x;h.envMap.value=t.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=r==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:v}=this;h.dTheta.value=g,h.mipInt.value=v-i;const S=this._sizeLods[s],U=3*S*(s>v-Ki?s-v+Ki:0),C=4*(this._cubeSize-S);ca(e,U,C,3*S,2*S),c.setRenderTarget(e),c.render(f,Ur)}}function y_(n){const t=[],e=[],i=[];let s=n;const a=n-Ki+1+Il.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>n-Ki?c=Il[r-n+Ki-1]:r===0&&(c=0),i.push(c);const l=1/(o-2),d=-l,f=1+l,h=[d,d,f,d,f,f,d,d,f,f,d,f],u=6,g=6,_=3,m=2,p=1,x=new Float32Array(_*g*u),v=new Float32Array(m*g*u),S=new Float32Array(p*g*u);for(let C=0;C<u;C++){const A=C%3*2/3-1,T=C>2?0:-1,b=[A,T,0,A+2/3,T,0,A+2/3,T+1,0,A,T,0,A+2/3,T+1,0,A,T+1,0];x.set(b,_*g*C),v.set(h,m*g*C);const y=[C,C,C,C,C,C];S.set(y,p*g*C)}const U=new $e;U.setAttribute("position",new _n(x,_)),U.setAttribute("uv",new _n(v,m)),U.setAttribute("faceIndex",new _n(S,p)),t.push(U),s>Ki&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Nl(n,t,e){const i=new Ei(n,t,e);return i.texture.mapping=Va,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ca(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function S_(n,t,e){const i=new Float32Array(xi),s=new Y(0,1,0);return new ii({name:"SphericalGaussianBlur",defines:{n:xi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:yc(),fragmentShader:`

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
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function zl(){return new ii({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yc(),fragmentShader:`

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
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function Ol(){return new ii({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function yc(){return`

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
	`}function b_(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===Mo||c===yo,d=c===is||c===ss;if(l||d){let f=t.get(o);const h=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return e===null&&(e=new Fl(n)),f=l?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const u=o.image;return l&&u&&u.height>0||d&&u&&s(u)?(e===null&&(e=new Fl(n)),f=l?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",a),f.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:r}}function E_(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&Ts("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function w_(n,t,e,i){const s={},a=new WeakMap;function r(f){const h=f.target;h.index!==null&&t.remove(h.index);for(const g in h.attributes)t.remove(h.attributes[g]);for(const g in h.morphAttributes){const _=h.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}h.removeEventListener("dispose",r),delete s[h.id];const u=a.get(h);u&&(t.remove(u),a.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function o(f,h){return s[h.id]===!0||(h.addEventListener("dispose",r),s[h.id]=!0,e.memory.geometries++),h}function c(f){const h=f.attributes;for(const g in h)t.update(h[g],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const g in u){const _=u[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],n.ARRAY_BUFFER)}}function l(f){const h=[],u=f.index,g=f.attributes.position;let _=0;if(u!==null){const x=u.array;_=u.version;for(let v=0,S=x.length;v<S;v+=3){const U=x[v+0],C=x[v+1],A=x[v+2];h.push(U,C,C,A,A,U)}}else if(g!==void 0){const x=g.array;_=g.version;for(let v=0,S=x.length/3-1;v<S;v+=3){const U=v+0,C=v+1,A=v+2;h.push(U,C,C,A,A,U)}}else return;const m=new(Yd(h)?Jd:Kd)(h,1);m.version=_;const p=a.get(f);p&&t.remove(p),a.set(f,m)}function d(f){const h=a.get(f);if(h){const u=f.index;u!==null&&h.version<u.version&&l(f)}else l(f);return a.get(f)}return{get:o,update:c,getWireframeAttribute:d}}function T_(n,t,e){let i;function s(h){i=h}let a,r;function o(h){a=h.type,r=h.bytesPerElement}function c(h,u){n.drawElements(i,u,a,h*r),e.update(u,i,1)}function l(h,u,g){g!==0&&(n.drawElementsInstanced(i,u,a,h*r,g),e.update(u,i,g))}function d(h,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,a,h,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,i,1)}function f(h,u,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)l(h[p]/r,u[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,u,0,a,h,0,_,0,g);let p=0;for(let x=0;x<g;x++)p+=u[x]*_[x];e.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=f}function A_(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(e.calls++,r){case n.TRIANGLES:e.triangles+=o*(a/3);break;case n.LINES:e.lines+=o*(a/2);break;case n.LINE_STRIP:e.lines+=o*(a-1);break;case n.LINE_LOOP:e.lines+=o*a;break;case n.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function R_(n,t,e){const i=new WeakMap,s=new _e;function a(r,o,c){const l=r.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=d!==void 0?d.length:0;let h=i.get(o);if(h===void 0||h.count!==f){let y=function(){T.dispose(),i.delete(o),o.removeEventListener("dispose",y)};var u=y;h!==void 0&&h.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let S=0;g===!0&&(S=1),_===!0&&(S=2),m===!0&&(S=3);let U=o.attributes.position.count*S,C=1;U>t.maxTextureSize&&(C=Math.ceil(U/t.maxTextureSize),U=t.maxTextureSize);const A=new Float32Array(U*C*4*f),T=new qd(A,U,C,f);T.type=Bn,T.needsUpdate=!0;const b=S*4;for(let D=0;D<f;D++){const H=p[D],z=x[D],X=v[D],P=U*C*4*D;for(let R=0;R<H.count;R++){const V=R*b;g===!0&&(s.fromBufferAttribute(H,R),A[P+V+0]=s.x,A[P+V+1]=s.y,A[P+V+2]=s.z,A[P+V+3]=0),_===!0&&(s.fromBufferAttribute(z,R),A[P+V+4]=s.x,A[P+V+5]=s.y,A[P+V+6]=s.z,A[P+V+7]=0),m===!0&&(s.fromBufferAttribute(X,R),A[P+V+8]=s.x,A[P+V+9]=s.y,A[P+V+10]=s.z,A[P+V+11]=X.itemSize===4?s.w:1)}}h={count:f,texture:T,size:new Yt(U,C)},i.set(o,h),o.addEventListener("dispose",y)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",r.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:a}}function C_(n,t,e,i){let s=new WeakMap;function a(c){const l=i.render.frame,d=c.geometry,f=t.get(c,d);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;s.get(h)!==l&&(h.update(),s.set(h,l))}return f}function r(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:r}}class sh extends Be{constructor(t,e,i,s,a,r,o,c,l,d=ts){if(d!==ts&&d!==rs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===ts&&(i=bi),i===void 0&&d===rs&&(i=as),super(null,s,a,r,o,c,d,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:gn,this.minFilter=c!==void 0?c:gn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ah=new Be,Bl=new sh(1,1),rh=new qd,oh=new mm,ch=new eh,Hl=[],Gl=[],Vl=new Float32Array(16),Xl=new Float32Array(9),Wl=new Float32Array(4);function ds(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let a=Hl[s];if(a===void 0&&(a=new Float32Array(s),Hl[s]=a),t!==0){i.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,n[r].toArray(a,o)}return a}function be(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ee(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Ya(n,t){let e=Gl[t];e===void 0&&(e=new Int32Array(t),Gl[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function P_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function D_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;n.uniform2fv(this.addr,t),Ee(e,t)}}function L_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(be(e,t))return;n.uniform3fv(this.addr,t),Ee(e,t)}}function I_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;n.uniform4fv(this.addr,t),Ee(e,t)}}function k_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(be(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,i))return;Wl.set(i),n.uniformMatrix2fv(this.addr,!1,Wl),Ee(e,i)}}function U_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(be(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,i))return;Xl.set(i),n.uniformMatrix3fv(this.addr,!1,Xl),Ee(e,i)}}function F_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(be(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,i))return;Vl.set(i),n.uniformMatrix4fv(this.addr,!1,Vl),Ee(e,i)}}function N_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function z_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;n.uniform2iv(this.addr,t),Ee(e,t)}}function O_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;n.uniform3iv(this.addr,t),Ee(e,t)}}function B_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;n.uniform4iv(this.addr,t),Ee(e,t)}}function H_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function G_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;n.uniform2uiv(this.addr,t),Ee(e,t)}}function V_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;n.uniform3uiv(this.addr,t),Ee(e,t)}}function X_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;n.uniform4uiv(this.addr,t),Ee(e,t)}}function W_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Bl.compareFunction=$d,a=Bl):a=ah,e.setTexture2D(t||a,s)}function $_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||oh,s)}function Y_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||ch,s)}function Z_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||rh,s)}function q_(n){switch(n){case 5126:return P_;case 35664:return D_;case 35665:return L_;case 35666:return I_;case 35674:return k_;case 35675:return U_;case 35676:return F_;case 5124:case 35670:return N_;case 35667:case 35671:return z_;case 35668:case 35672:return O_;case 35669:case 35673:return B_;case 5125:return H_;case 36294:return G_;case 36295:return V_;case 36296:return X_;case 35678:case 36198:case 36298:case 36306:case 35682:return W_;case 35679:case 36299:case 36307:return $_;case 35680:case 36300:case 36308:case 36293:return Y_;case 36289:case 36303:case 36311:case 36292:return Z_}}function j_(n,t){n.uniform1fv(this.addr,t)}function K_(n,t){const e=ds(t,this.size,2);n.uniform2fv(this.addr,e)}function J_(n,t){const e=ds(t,this.size,3);n.uniform3fv(this.addr,e)}function Q_(n,t){const e=ds(t,this.size,4);n.uniform4fv(this.addr,e)}function tx(n,t){const e=ds(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function ex(n,t){const e=ds(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function nx(n,t){const e=ds(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function ix(n,t){n.uniform1iv(this.addr,t)}function sx(n,t){n.uniform2iv(this.addr,t)}function ax(n,t){n.uniform3iv(this.addr,t)}function rx(n,t){n.uniform4iv(this.addr,t)}function ox(n,t){n.uniform1uiv(this.addr,t)}function cx(n,t){n.uniform2uiv(this.addr,t)}function lx(n,t){n.uniform3uiv(this.addr,t)}function dx(n,t){n.uniform4uiv(this.addr,t)}function hx(n,t,e){const i=this.cache,s=t.length,a=Ya(e,s);be(i,a)||(n.uniform1iv(this.addr,a),Ee(i,a));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||ah,a[r])}function ux(n,t,e){const i=this.cache,s=t.length,a=Ya(e,s);be(i,a)||(n.uniform1iv(this.addr,a),Ee(i,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||oh,a[r])}function fx(n,t,e){const i=this.cache,s=t.length,a=Ya(e,s);be(i,a)||(n.uniform1iv(this.addr,a),Ee(i,a));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||ch,a[r])}function px(n,t,e){const i=this.cache,s=t.length,a=Ya(e,s);be(i,a)||(n.uniform1iv(this.addr,a),Ee(i,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||rh,a[r])}function mx(n){switch(n){case 5126:return j_;case 35664:return K_;case 35665:return J_;case 35666:return Q_;case 35674:return tx;case 35675:return ex;case 35676:return nx;case 5124:case 35670:return ix;case 35667:case 35671:return sx;case 35668:case 35672:return ax;case 35669:case 35673:return rx;case 5125:return ox;case 36294:return cx;case 36295:return lx;case 36296:return dx;case 35678:case 36198:case 36298:case 36306:case 35682:return hx;case 35679:case 36299:case 36307:return ux;case 35680:case 36300:case 36308:case 36293:return fx;case 36289:case 36303:case 36311:case 36292:return px}}class gx{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=q_(e.type)}}class _x{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=mx(e.type)}}class xx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(t,e[o.id],i)}}}const Br=/(\w+)(\])?(\[|\.)?/g;function $l(n,t){n.seq.push(t),n.map[t.id]=t}function vx(n,t,e){const i=n.name,s=i.length;for(Br.lastIndex=0;;){const a=Br.exec(i),r=Br.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){$l(e,l===void 0?new gx(o,n,t):new _x(o,n,t));break}else{let f=e.map[o];f===void 0&&(f=new xx(o),$l(e,f)),e=f}}}class Ta{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=t.getActiveUniform(e,s),r=t.getUniformLocation(e,a.name);vx(a,r,this)}}setValue(t,e,i,s){const a=this.map[e];a!==void 0&&a.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let a=0,r=e.length;a!==r;++a){const o=e[a],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,a=t.length;s!==a;++s){const r=t[s];r.id in e&&i.push(r)}return i}}function Yl(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Mx=37297;let yx=0;function Sx(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return i.join(`
`)}const Zl=new Zt;function bx(n){ee._getMatrix(Zl,ee.workingColorSpace,n);const t=`mat3( ${Zl.elements.map(e=>e.toFixed(4))} )`;switch(ee.getTransfer(n)){case Xa:return[t,"LinearTransferOETF"];case ae:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function ql(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Sx(n.getShaderSource(t),r)}else return s}function Ex(n,t){const e=bx(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function wx(n,t){let e;switch(t){case Gp:e="Linear";break;case Vp:e="Reinhard";break;case Xp:e="Cineon";break;case Wp:e="ACESFilmic";break;case Yp:e="AgX";break;case Zp:e="Neutral";break;case $p:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const la=new Y;function Tx(){ee.getLuminanceCoefficients(la);const n=la.x.toFixed(4),t=la.y.toFixed(4),e=la.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ax(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(As).join(`
`)}function Rx(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Cx(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(t,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:n.getAttribLocation(t,r),locationSize:o}}return e}function As(n){return n!==""}function jl(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Kl(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Px=/^[ \t]*#include +<([\w\d./]+)>/gm;function Jo(n){return n.replace(Px,Lx)}const Dx=new Map;function Lx(n,t){let e=qt[t];if(e===void 0){const i=Dx.get(t);if(i!==void 0)e=qt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Jo(e)}const Ix=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jl(n){return n.replace(Ix,kx)}function kx(n,t,e,i){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Ql(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function Ux(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Ld?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Id?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===zn&&(t="SHADOWMAP_TYPE_VSM"),t}function Fx(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case is:case ss:t="ENVMAP_TYPE_CUBE";break;case Va:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Nx(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ss:t="ENVMAP_MODE_REFRACTION";break}return t}function zx(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case hc:t="ENVMAP_BLENDING_MULTIPLY";break;case Bp:t="ENVMAP_BLENDING_MIX";break;case Hp:t="ENVMAP_BLENDING_ADD";break}return t}function Ox(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Bx(n,t,e,i){const s=n.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const c=Ux(e),l=Fx(e),d=Nx(e),f=zx(e),h=Ox(e),u=Ax(e),g=Rx(a),_=s.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(As).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(As).join(`
`),p.length>0&&(p+=`
`)):(m=[Ql(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(As).join(`
`),p=[Ql(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ti?"#define TONE_MAPPING":"",e.toneMapping!==ti?qt.tonemapping_pars_fragment:"",e.toneMapping!==ti?wx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",qt.colorspace_pars_fragment,Ex("linearToOutputTexel",e.outputColorSpace),Tx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(As).join(`
`)),r=Jo(r),r=jl(r,e),r=Kl(r,e),o=Jo(o),o=jl(o,e),o=Kl(o,e),r=Jl(r),o=Jl(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===ul?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ul?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=x+m+r,S=x+p+o,U=Yl(s,s.VERTEX_SHADER,v),C=Yl(s,s.FRAGMENT_SHADER,S);s.attachShader(_,U),s.attachShader(_,C),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(D){if(n.debug.checkShaderErrors){const H=s.getProgramInfoLog(_).trim(),z=s.getShaderInfoLog(U).trim(),X=s.getShaderInfoLog(C).trim();let P=!0,R=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(P=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,U,C);else{const V=ql(s,U,"vertex"),B=ql(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+H+`
`+V+`
`+B)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(z===""||X==="")&&(R=!1);R&&(D.diagnostics={runnable:P,programLog:H,vertexShader:{log:z,prefix:m},fragmentShader:{log:X,prefix:p}})}s.deleteShader(U),s.deleteShader(C),T=new Ta(s,_),b=Cx(s,_)}let T;this.getUniforms=function(){return T===void 0&&A(this),T};let b;this.getAttributes=function(){return b===void 0&&A(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,Mx)),y},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=yx++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=U,this.fragmentShader=C,this}let Hx=0;class Gx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Vx(t),e.set(t,i)),i}}class Vx{constructor(t){this.id=Hx++,this.code=t,this.usedTimes=0}}function Xx(n,t,e,i,s,a,r){const o=new vc,c=new Gx,l=new Set,d=[],f=s.logarithmicDepthBuffer,h=s.vertexTextures;let u=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,y,D,H,z){const X=H.fog,P=z.geometry,R=b.isMeshStandardMaterial?H.environment:null,V=(b.isMeshStandardMaterial?e:t).get(b.envMap||R),B=V&&V.mapping===Va?V.image.height:null,Z=g[b.type];b.precision!==null&&(u=s.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const J=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,rt=J!==void 0?J.length:0;let ft=0;P.morphAttributes.position!==void 0&&(ft=1),P.morphAttributes.normal!==void 0&&(ft=2),P.morphAttributes.color!==void 0&&(ft=3);let vt,$,tt,gt;if(Z){const Vt=En[Z];vt=Vt.vertexShader,$=Vt.fragmentShader}else vt=b.vertexShader,$=b.fragmentShader,c.update(b),tt=c.getVertexShaderID(b),gt=c.getFragmentShaderID(b);const j=n.getRenderTarget(),pt=n.state.buffers.depth.getReversed(),Dt=z.isInstancedMesh===!0,Ft=z.isBatchedMesh===!0,Nt=!!b.map,Et=!!b.matcap,Tt=!!V,O=!!b.aoMap,Gt=!!b.lightMap,Pt=!!b.bumpMap,It=!!b.normalMap,q=!!b.displacementMap,ct=!!b.emissiveMap,dt=!!b.metalnessMap,w=!!b.roughnessMap,M=b.anisotropy>0,G=b.clearcoat>0,et=b.dispersion>0,ot=b.iridescence>0,nt=b.sheen>0,lt=b.transmission>0,ut=M&&!!b.anisotropyMap,wt=G&&!!b.clearcoatMap,Xt=G&&!!b.clearcoatNormalMap,mt=G&&!!b.clearcoatRoughnessMap,Rt=ot&&!!b.iridescenceMap,I=ot&&!!b.iridescenceThicknessMap,Q=nt&&!!b.sheenColorMap,st=nt&&!!b.sheenRoughnessMap,xt=!!b.specularMap,Ut=!!b.specularColorMap,Lt=!!b.specularIntensityMap,F=lt&&!!b.transmissionMap,yt=lt&&!!b.thicknessMap,K=!!b.gradientMap,at=!!b.alphaMap,St=b.alphaTest>0,bt=!!b.alphaHash,Ht=!!b.extensions;let jt=ti;b.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(jt=n.toneMapping);const ne={shaderID:Z,shaderType:b.type,shaderName:b.name,vertexShader:vt,fragmentShader:$,defines:b.defines,customVertexShaderID:tt,customFragmentShaderID:gt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:Ft,batchingColor:Ft&&z._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&z.instanceColor!==null,instancingMorph:Dt&&z.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:j===null?n.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:cs,alphaToCoverage:!!b.alphaToCoverage,map:Nt,matcap:Et,envMap:Tt,envMapMode:Tt&&V.mapping,envMapCubeUVHeight:B,aoMap:O,lightMap:Gt,bumpMap:Pt,normalMap:It,displacementMap:h&&q,emissiveMap:ct,normalMapObjectSpace:It&&b.normalMapType===Jp,normalMapTangentSpace:It&&b.normalMapType===Wd,metalnessMap:dt,roughnessMap:w,anisotropy:M,anisotropyMap:ut,clearcoat:G,clearcoatMap:wt,clearcoatNormalMap:Xt,clearcoatRoughnessMap:mt,dispersion:et,iridescence:ot,iridescenceMap:Rt,iridescenceThicknessMap:I,sheen:nt,sheenColorMap:Q,sheenRoughnessMap:st,specularMap:xt,specularColorMap:Ut,specularIntensityMap:Lt,transmission:lt,transmissionMap:F,thicknessMap:yt,gradientMap:K,opaque:b.transparent===!1&&b.blending===Qi&&b.alphaToCoverage===!1,alphaMap:at,alphaTest:St,alphaHash:bt,combine:b.combine,mapUv:Nt&&_(b.map.channel),aoMapUv:O&&_(b.aoMap.channel),lightMapUv:Gt&&_(b.lightMap.channel),bumpMapUv:Pt&&_(b.bumpMap.channel),normalMapUv:It&&_(b.normalMap.channel),displacementMapUv:q&&_(b.displacementMap.channel),emissiveMapUv:ct&&_(b.emissiveMap.channel),metalnessMapUv:dt&&_(b.metalnessMap.channel),roughnessMapUv:w&&_(b.roughnessMap.channel),anisotropyMapUv:ut&&_(b.anisotropyMap.channel),clearcoatMapUv:wt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Xt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:mt&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Rt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:I&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Q&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:st&&_(b.sheenRoughnessMap.channel),specularMapUv:xt&&_(b.specularMap.channel),specularColorMapUv:Ut&&_(b.specularColorMap.channel),specularIntensityMapUv:Lt&&_(b.specularIntensityMap.channel),transmissionMapUv:F&&_(b.transmissionMap.channel),thicknessMapUv:yt&&_(b.thicknessMap.channel),alphaMapUv:at&&_(b.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(It||M),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!P.attributes.uv&&(Nt||at),fog:!!X,useFog:b.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:pt,skinning:z.isSkinnedMesh===!0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:rt,morphTextureStride:ft,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:jt,decodeVideoTexture:Nt&&b.map.isVideoTexture===!0&&ee.getTransfer(b.map.colorSpace)===ae,decodeVideoTextureEmissive:ct&&b.emissiveMap.isVideoTexture===!0&&ee.getTransfer(b.emissiveMap.colorSpace)===ae,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===ze,flipSided:b.side===We,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ht&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ht&&b.extensions.multiDraw===!0||Ft)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ne.vertexUv1s=l.has(1),ne.vertexUv2s=l.has(2),ne.vertexUv3s=l.has(3),l.clear(),ne}function p(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const D in b.defines)y.push(D),y.push(b.defines[D]);return b.isRawShaderMaterial===!1&&(x(y,b),v(y,b),y.push(n.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function x(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function v(b,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),b.push(o.mask)}function S(b){const y=g[b.type];let D;if(y){const H=En[y];D=Am.clone(H.uniforms)}else D=b.uniforms;return D}function U(b,y){let D;for(let H=0,z=d.length;H<z;H++){const X=d[H];if(X.cacheKey===y){D=X,++D.usedTimes;break}}return D===void 0&&(D=new Bx(n,y,b,a),d.push(D)),D}function C(b){if(--b.usedTimes===0){const y=d.indexOf(b);d[y]=d[d.length-1],d.pop(),b.destroy()}}function A(b){c.remove(b)}function T(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:S,acquireProgram:U,releaseProgram:C,releaseShaderCache:A,programs:d,dispose:T}}function Wx(){let n=new WeakMap;function t(r){return n.has(r)}function e(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,c){n.get(r)[o]=c}function a(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:a}}function $x(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function td(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function ed(){const n=[];let t=0;const e=[],i=[],s=[];function a(){t=0,e.length=0,i.length=0,s.length=0}function r(f,h,u,g,_,m){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:h,material:u,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},n[t]=p):(p.id=f.id,p.object=f,p.geometry=h,p.material=u,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=_,p.group=m),t++,p}function o(f,h,u,g,_,m){const p=r(f,h,u,g,_,m);u.transmission>0?i.push(p):u.transparent===!0?s.push(p):e.push(p)}function c(f,h,u,g,_,m){const p=r(f,h,u,g,_,m);u.transmission>0?i.unshift(p):u.transparent===!0?s.unshift(p):e.unshift(p)}function l(f,h){e.length>1&&e.sort(f||$x),i.length>1&&i.sort(h||td),s.length>1&&s.sort(h||td)}function d(){for(let f=t,h=n.length;f<h;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:s,init:a,push:o,unshift:c,finish:d,sort:l}}function Yx(){let n=new WeakMap;function t(i,s){const a=n.get(i);let r;return a===void 0?(r=new ed,n.set(i,[r])):s>=a.length?(r=new ed,a.push(r)):r=a[s],r}function e(){n=new WeakMap}return{get:t,dispose:e}}function Zx(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new Y,color:new Wt};break;case"SpotLight":e={position:new Y,direction:new Y,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new Y,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new Y,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":e={color:new Wt,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return n[t.id]=e,e}}}function qx(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let jx=0;function Kx(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Jx(n){const t=new Zx,e=qx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new Y);const s=new Y,a=new ue,r=new ue;function o(l){let d=0,f=0,h=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let u=0,g=0,_=0,m=0,p=0,x=0,v=0,S=0,U=0,C=0,A=0;l.sort(Kx);for(let b=0,y=l.length;b<y;b++){const D=l[b],H=D.color,z=D.intensity,X=D.distance,P=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=H.r*z,f+=H.g*z,h+=H.b*z;else if(D.isLightProbe){for(let R=0;R<9;R++)i.probe[R].addScaledVector(D.sh.coefficients[R],z);A++}else if(D.isDirectionalLight){const R=t.get(D);if(R.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const V=D.shadow,B=e.get(D);B.shadowIntensity=V.intensity,B.shadowBias=V.bias,B.shadowNormalBias=V.normalBias,B.shadowRadius=V.radius,B.shadowMapSize=V.mapSize,i.directionalShadow[u]=B,i.directionalShadowMap[u]=P,i.directionalShadowMatrix[u]=D.shadow.matrix,x++}i.directional[u]=R,u++}else if(D.isSpotLight){const R=t.get(D);R.position.setFromMatrixPosition(D.matrixWorld),R.color.copy(H).multiplyScalar(z),R.distance=X,R.coneCos=Math.cos(D.angle),R.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),R.decay=D.decay,i.spot[_]=R;const V=D.shadow;if(D.map&&(i.spotLightMap[U]=D.map,U++,V.updateMatrices(D),D.castShadow&&C++),i.spotLightMatrix[_]=V.matrix,D.castShadow){const B=e.get(D);B.shadowIntensity=V.intensity,B.shadowBias=V.bias,B.shadowNormalBias=V.normalBias,B.shadowRadius=V.radius,B.shadowMapSize=V.mapSize,i.spotShadow[_]=B,i.spotShadowMap[_]=P,S++}_++}else if(D.isRectAreaLight){const R=t.get(D);R.color.copy(H).multiplyScalar(z),R.halfWidth.set(D.width*.5,0,0),R.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=R,m++}else if(D.isPointLight){const R=t.get(D);if(R.color.copy(D.color).multiplyScalar(D.intensity),R.distance=D.distance,R.decay=D.decay,D.castShadow){const V=D.shadow,B=e.get(D);B.shadowIntensity=V.intensity,B.shadowBias=V.bias,B.shadowNormalBias=V.normalBias,B.shadowRadius=V.radius,B.shadowMapSize=V.mapSize,B.shadowCameraNear=V.camera.near,B.shadowCameraFar=V.camera.far,i.pointShadow[g]=B,i.pointShadowMap[g]=P,i.pointShadowMatrix[g]=D.shadow.matrix,v++}i.point[g]=R,g++}else if(D.isHemisphereLight){const R=t.get(D);R.skyColor.copy(D.color).multiplyScalar(z),R.groundColor.copy(D.groundColor).multiplyScalar(z),i.hemi[p]=R,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ct.LTC_FLOAT_1,i.rectAreaLTC2=Ct.LTC_FLOAT_2):(i.rectAreaLTC1=Ct.LTC_HALF_1,i.rectAreaLTC2=Ct.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=h;const T=i.hash;(T.directionalLength!==u||T.pointLength!==g||T.spotLength!==_||T.rectAreaLength!==m||T.hemiLength!==p||T.numDirectionalShadows!==x||T.numPointShadows!==v||T.numSpotShadows!==S||T.numSpotMaps!==U||T.numLightProbes!==A)&&(i.directional.length=u,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=S+U-C,i.spotLightMap.length=U,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=A,T.directionalLength=u,T.pointLength=g,T.spotLength=_,T.rectAreaLength=m,T.hemiLength=p,T.numDirectionalShadows=x,T.numPointShadows=v,T.numSpotShadows=S,T.numSpotMaps=U,T.numLightProbes=A,i.version=jx++)}function c(l,d){let f=0,h=0,u=0,g=0,_=0;const m=d.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const v=l[p];if(v.isDirectionalLight){const S=i.directional[f];S.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),f++}else if(v.isSpotLight){const S=i.spot[u];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),u++}else if(v.isRectAreaLight){const S=i.rectArea[g];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(m),r.identity(),a.copy(v.matrixWorld),a.premultiply(m),r.extractRotation(a),S.halfWidth.set(v.width*.5,0,0),S.halfHeight.set(0,v.height*.5,0),S.halfWidth.applyMatrix4(r),S.halfHeight.applyMatrix4(r),g++}else if(v.isPointLight){const S=i.point[h];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(m),h++}else if(v.isHemisphereLight){const S=i.hemi[_];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:i}}function nd(n){const t=new Jx(n),e=[],i=[];function s(d){l.camera=d,e.length=0,i.length=0}function a(d){e.push(d)}function r(d){i.push(d)}function o(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function Qx(n){let t=new WeakMap;function e(s,a=0){const r=t.get(s);let o;return r===void 0?(o=new nd(n),t.set(s,[o])):a>=r.length?(o=new nd(n),r.push(o)):o=r[a],o}function i(){t=new WeakMap}return{get:e,dispose:i}}class tv extends wi{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=jp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ev extends wi{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const nv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,iv=`uniform sampler2D shadow_pass;
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
}`;function sv(n,t,e){let i=new Mc;const s=new Yt,a=new Yt,r=new _e,o=new tv({depthPacking:Kp}),c=new ev,l={},d=e.maxTextureSize,f={[ni]:We,[We]:ni,[ze]:ze},h=new ii({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Yt},radius:{value:4}},vertexShader:nv,fragmentShader:iv}),u=h.clone();u.defines.HORIZONTAL_PASS=1;const g=new $e;g.setAttribute("position",new _n(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new he(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ld;let p=this.type;this.render=function(C,A,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const b=n.getRenderTarget(),y=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),H=n.state;H.setBlending(Qn),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const z=p!==zn&&this.type===zn,X=p===zn&&this.type!==zn;for(let P=0,R=C.length;P<R;P++){const V=C[P],B=V.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",V,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const Z=B.getFrameExtents();if(s.multiply(Z),a.copy(B.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/Z.x),s.x=a.x*Z.x,B.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/Z.y),s.y=a.y*Z.y,B.mapSize.y=a.y)),B.map===null||z===!0||X===!0){const rt=this.type!==zn?{minFilter:gn,magFilter:gn}:{};B.map!==null&&B.map.dispose(),B.map=new Ei(s.x,s.y,rt),B.map.texture.name=V.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const J=B.getViewportCount();for(let rt=0;rt<J;rt++){const ft=B.getViewport(rt);r.set(a.x*ft.x,a.y*ft.y,a.x*ft.z,a.y*ft.w),H.viewport(r),B.updateMatrices(V,rt),i=B.getFrustum(),S(A,T,B.camera,V,this.type)}B.isPointLightShadow!==!0&&this.type===zn&&x(B,T),B.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(b,y,D)};function x(C,A){const T=t.update(_);h.defines.VSM_SAMPLES!==C.blurSamples&&(h.defines.VSM_SAMPLES=C.blurSamples,u.defines.VSM_SAMPLES=C.blurSamples,h.needsUpdate=!0,u.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new Ei(s.x,s.y)),h.uniforms.shadow_pass.value=C.map.texture,h.uniforms.resolution.value=C.mapSize,h.uniforms.radius.value=C.radius,n.setRenderTarget(C.mapPass),n.clear(),n.renderBufferDirect(A,null,T,h,_,null),u.uniforms.shadow_pass.value=C.mapPass.texture,u.uniforms.resolution.value=C.mapSize,u.uniforms.radius.value=C.radius,n.setRenderTarget(C.map),n.clear(),n.renderBufferDirect(A,null,T,u,_,null)}function v(C,A,T,b){let y=null;const D=T.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(D!==void 0)y=D;else if(y=T.isPointLight===!0?c:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const H=y.uuid,z=A.uuid;let X=l[H];X===void 0&&(X={},l[H]=X);let P=X[z];P===void 0&&(P=y.clone(),X[z]=P,A.addEventListener("dispose",U)),y=P}if(y.visible=A.visible,y.wireframe=A.wireframe,b===zn?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:f[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,T.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const H=n.properties.get(y);H.light=T}return y}function S(C,A,T,b,y){if(C.visible===!1)return;if(C.layers.test(A.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&y===zn)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,C.matrixWorld);const z=t.update(C),X=C.material;if(Array.isArray(X)){const P=z.groups;for(let R=0,V=P.length;R<V;R++){const B=P[R],Z=X[B.materialIndex];if(Z&&Z.visible){const J=v(C,Z,b,y);C.onBeforeShadow(n,C,A,T,z,J,B),n.renderBufferDirect(T,null,z,J,C,B),C.onAfterShadow(n,C,A,T,z,J,B)}}}else if(X.visible){const P=v(C,X,b,y);C.onBeforeShadow(n,C,A,T,z,P,null),n.renderBufferDirect(T,null,z,P,C,null),C.onAfterShadow(n,C,A,T,z,P,null)}}const H=C.children;for(let z=0,X=H.length;z<X;z++)S(H[z],A,T,b,y)}function U(C){C.target.removeEventListener("dispose",U);for(const T in l){const b=l[T],y=C.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const av={[fo]:po,[mo]:xo,[go]:vo,[ns]:_o,[po]:fo,[xo]:mo,[vo]:go,[_o]:ns};function rv(n,t){function e(){let F=!1;const yt=new _e;let K=null;const at=new _e(0,0,0,0);return{setMask:function(St){K!==St&&!F&&(n.colorMask(St,St,St,St),K=St)},setLocked:function(St){F=St},setClear:function(St,bt,Ht,jt,ne){ne===!0&&(St*=jt,bt*=jt,Ht*=jt),yt.set(St,bt,Ht,jt),at.equals(yt)===!1&&(n.clearColor(St,bt,Ht,jt),at.copy(yt))},reset:function(){F=!1,K=null,at.set(-1,0,0,0)}}}function i(){let F=!1,yt=!1,K=null,at=null,St=null;return{setReversed:function(bt){if(yt!==bt){const Ht=t.get("EXT_clip_control");yt?Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.ZERO_TO_ONE_EXT):Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.NEGATIVE_ONE_TO_ONE_EXT);const jt=St;St=null,this.setClear(jt)}yt=bt},getReversed:function(){return yt},setTest:function(bt){bt?j(n.DEPTH_TEST):pt(n.DEPTH_TEST)},setMask:function(bt){K!==bt&&!F&&(n.depthMask(bt),K=bt)},setFunc:function(bt){if(yt&&(bt=av[bt]),at!==bt){switch(bt){case fo:n.depthFunc(n.NEVER);break;case po:n.depthFunc(n.ALWAYS);break;case mo:n.depthFunc(n.LESS);break;case ns:n.depthFunc(n.LEQUAL);break;case go:n.depthFunc(n.EQUAL);break;case _o:n.depthFunc(n.GEQUAL);break;case xo:n.depthFunc(n.GREATER);break;case vo:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}at=bt}},setLocked:function(bt){F=bt},setClear:function(bt){St!==bt&&(yt&&(bt=1-bt),n.clearDepth(bt),St=bt)},reset:function(){F=!1,K=null,at=null,St=null,yt=!1}}}function s(){let F=!1,yt=null,K=null,at=null,St=null,bt=null,Ht=null,jt=null,ne=null;return{setTest:function(Vt){F||(Vt?j(n.STENCIL_TEST):pt(n.STENCIL_TEST))},setMask:function(Vt){yt!==Vt&&!F&&(n.stencilMask(Vt),yt=Vt)},setFunc:function(Vt,oe,pe){(K!==Vt||at!==oe||St!==pe)&&(n.stencilFunc(Vt,oe,pe),K=Vt,at=oe,St=pe)},setOp:function(Vt,oe,pe){(bt!==Vt||Ht!==oe||jt!==pe)&&(n.stencilOp(Vt,oe,pe),bt=Vt,Ht=oe,jt=pe)},setLocked:function(Vt){F=Vt},setClear:function(Vt){ne!==Vt&&(n.clearStencil(Vt),ne=Vt)},reset:function(){F=!1,yt=null,K=null,at=null,St=null,bt=null,Ht=null,jt=null,ne=null}}}const a=new e,r=new i,o=new s,c=new WeakMap,l=new WeakMap;let d={},f={},h=new WeakMap,u=[],g=null,_=!1,m=null,p=null,x=null,v=null,S=null,U=null,C=null,A=new Wt(0,0,0),T=0,b=!1,y=null,D=null,H=null,z=null,X=null;const P=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let R=!1,V=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(B)[1]),R=V>=1):B.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),R=V>=2);let Z=null,J={};const rt=n.getParameter(n.SCISSOR_BOX),ft=n.getParameter(n.VIEWPORT),vt=new _e().fromArray(rt),$=new _e().fromArray(ft);function tt(F,yt,K,at){const St=new Uint8Array(4),bt=n.createTexture();n.bindTexture(F,bt),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ht=0;Ht<K;Ht++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(yt,0,n.RGBA,1,1,at,0,n.RGBA,n.UNSIGNED_BYTE,St):n.texImage2D(yt+Ht,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,St);return bt}const gt={};gt[n.TEXTURE_2D]=tt(n.TEXTURE_2D,n.TEXTURE_2D,1),gt[n.TEXTURE_CUBE_MAP]=tt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),gt[n.TEXTURE_2D_ARRAY]=tt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),gt[n.TEXTURE_3D]=tt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),j(n.DEPTH_TEST),r.setFunc(ns),Pt(!1),It(ol),j(n.CULL_FACE),O(Qn);function j(F){d[F]!==!0&&(n.enable(F),d[F]=!0)}function pt(F){d[F]!==!1&&(n.disable(F),d[F]=!1)}function Dt(F,yt){return f[F]!==yt?(n.bindFramebuffer(F,yt),f[F]=yt,F===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=yt),F===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=yt),!0):!1}function Ft(F,yt){let K=u,at=!1;if(F){K=h.get(yt),K===void 0&&(K=[],h.set(yt,K));const St=F.textures;if(K.length!==St.length||K[0]!==n.COLOR_ATTACHMENT0){for(let bt=0,Ht=St.length;bt<Ht;bt++)K[bt]=n.COLOR_ATTACHMENT0+bt;K.length=St.length,at=!0}}else K[0]!==n.BACK&&(K[0]=n.BACK,at=!0);at&&n.drawBuffers(K)}function Nt(F){return g!==F?(n.useProgram(F),g=F,!0):!1}const Et={[_i]:n.FUNC_ADD,[bp]:n.FUNC_SUBTRACT,[Ep]:n.FUNC_REVERSE_SUBTRACT};Et[wp]=n.MIN,Et[Tp]=n.MAX;const Tt={[Ap]:n.ZERO,[Rp]:n.ONE,[Cp]:n.SRC_COLOR,[ho]:n.SRC_ALPHA,[Up]:n.SRC_ALPHA_SATURATE,[Ip]:n.DST_COLOR,[Dp]:n.DST_ALPHA,[Pp]:n.ONE_MINUS_SRC_COLOR,[uo]:n.ONE_MINUS_SRC_ALPHA,[kp]:n.ONE_MINUS_DST_COLOR,[Lp]:n.ONE_MINUS_DST_ALPHA,[Fp]:n.CONSTANT_COLOR,[Np]:n.ONE_MINUS_CONSTANT_COLOR,[zp]:n.CONSTANT_ALPHA,[Op]:n.ONE_MINUS_CONSTANT_ALPHA};function O(F,yt,K,at,St,bt,Ht,jt,ne,Vt){if(F===Qn){_===!0&&(pt(n.BLEND),_=!1);return}if(_===!1&&(j(n.BLEND),_=!0),F!==Sp){if(F!==m||Vt!==b){if((p!==_i||S!==_i)&&(n.blendEquation(n.FUNC_ADD),p=_i,S=_i),Vt)switch(F){case Qi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case cl:n.blendFunc(n.ONE,n.ONE);break;case ll:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case dl:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Qi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case cl:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case ll:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case dl:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}x=null,v=null,U=null,C=null,A.set(0,0,0),T=0,m=F,b=Vt}return}St=St||yt,bt=bt||K,Ht=Ht||at,(yt!==p||St!==S)&&(n.blendEquationSeparate(Et[yt],Et[St]),p=yt,S=St),(K!==x||at!==v||bt!==U||Ht!==C)&&(n.blendFuncSeparate(Tt[K],Tt[at],Tt[bt],Tt[Ht]),x=K,v=at,U=bt,C=Ht),(jt.equals(A)===!1||ne!==T)&&(n.blendColor(jt.r,jt.g,jt.b,ne),A.copy(jt),T=ne),m=F,b=!1}function Gt(F,yt){F.side===ze?pt(n.CULL_FACE):j(n.CULL_FACE);let K=F.side===We;yt&&(K=!K),Pt(K),F.blending===Qi&&F.transparent===!1?O(Qn):O(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),r.setFunc(F.depthFunc),r.setTest(F.depthTest),r.setMask(F.depthWrite),a.setMask(F.colorWrite);const at=F.stencilWrite;o.setTest(at),at&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),ct(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?j(n.SAMPLE_ALPHA_TO_COVERAGE):pt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Pt(F){y!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),y=F)}function It(F){F!==Mp?(j(n.CULL_FACE),F!==D&&(F===ol?n.cullFace(n.BACK):F===yp?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):pt(n.CULL_FACE),D=F}function q(F){F!==H&&(R&&n.lineWidth(F),H=F)}function ct(F,yt,K){F?(j(n.POLYGON_OFFSET_FILL),(z!==yt||X!==K)&&(n.polygonOffset(yt,K),z=yt,X=K)):pt(n.POLYGON_OFFSET_FILL)}function dt(F){F?j(n.SCISSOR_TEST):pt(n.SCISSOR_TEST)}function w(F){F===void 0&&(F=n.TEXTURE0+P-1),Z!==F&&(n.activeTexture(F),Z=F)}function M(F,yt,K){K===void 0&&(Z===null?K=n.TEXTURE0+P-1:K=Z);let at=J[K];at===void 0&&(at={type:void 0,texture:void 0},J[K]=at),(at.type!==F||at.texture!==yt)&&(Z!==K&&(n.activeTexture(K),Z=K),n.bindTexture(F,yt||gt[F]),at.type=F,at.texture=yt)}function G(){const F=J[Z];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function et(){try{n.compressedTexImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ot(){try{n.compressedTexImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function nt(){try{n.texSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function lt(){try{n.texSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ut(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function wt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Xt(){try{n.texStorage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function mt(){try{n.texStorage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Rt(){try{n.texImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function I(){try{n.texImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Q(F){vt.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),vt.copy(F))}function st(F){$.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),$.copy(F))}function xt(F,yt){let K=l.get(yt);K===void 0&&(K=new WeakMap,l.set(yt,K));let at=K.get(F);at===void 0&&(at=n.getUniformBlockIndex(yt,F.name),K.set(F,at))}function Ut(F,yt){const at=l.get(yt).get(F);c.get(yt)!==at&&(n.uniformBlockBinding(yt,at,F.__bindingPointIndex),c.set(yt,at))}function Lt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},Z=null,J={},f={},h=new WeakMap,u=[],g=null,_=!1,m=null,p=null,x=null,v=null,S=null,U=null,C=null,A=new Wt(0,0,0),T=0,b=!1,y=null,D=null,H=null,z=null,X=null,vt.set(0,0,n.canvas.width,n.canvas.height),$.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:j,disable:pt,bindFramebuffer:Dt,drawBuffers:Ft,useProgram:Nt,setBlending:O,setMaterial:Gt,setFlipSided:Pt,setCullFace:It,setLineWidth:q,setPolygonOffset:ct,setScissorTest:dt,activeTexture:w,bindTexture:M,unbindTexture:G,compressedTexImage2D:et,compressedTexImage3D:ot,texImage2D:Rt,texImage3D:I,updateUBOMapping:xt,uniformBlockBinding:Ut,texStorage2D:Xt,texStorage3D:mt,texSubImage2D:nt,texSubImage3D:lt,compressedTexSubImage2D:ut,compressedTexSubImage3D:wt,scissor:Q,viewport:st,reset:Lt}}function id(n,t,e,i){const s=ov(i);switch(e){case zd:return n*t;case Bd:return n*t;case Hd:return n*t*2;case Gd:return n*t/s.components*s.byteLength;case mc:return n*t/s.components*s.byteLength;case Vd:return n*t*2/s.components*s.byteLength;case gc:return n*t*2/s.components*s.byteLength;case Od:return n*t*3/s.components*s.byteLength;case mn:return n*t*4/s.components*s.byteLength;case _c:return n*t*4/s.components*s.byteLength;case Ma:case ya:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Sa:case ba:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case wo:case Ao:return Math.max(n,16)*Math.max(t,8)/4;case Eo:case To:return Math.max(n,8)*Math.max(t,8)/2;case Ro:case Co:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Po:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Do:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Lo:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Io:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case ko:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Uo:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Fo:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case No:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case zo:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Oo:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Bo:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Ho:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Go:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Vo:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Xo:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Ea:case Wo:case $o:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Xd:case Yo:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Zo:case qo:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ov(n){switch(n){case Vn:case Ud:return{byteLength:1,components:1};case Is:case Fd:case Us:return{byteLength:2,components:1};case fc:case pc:return{byteLength:2,components:4};case bi:case uc:case Bn:return{byteLength:4,components:1};case Nd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function cv(n,t,e,i,s,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Yt,d=new WeakMap;let f;const h=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,M){return u?new OffscreenCanvas(w,M):za("canvas")}function _(w,M,G){let et=1;const ot=dt(w);if((ot.width>G||ot.height>G)&&(et=G/Math.max(ot.width,ot.height)),et<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const nt=Math.floor(et*ot.width),lt=Math.floor(et*ot.height);f===void 0&&(f=g(nt,lt));const ut=M?g(nt,lt):f;return ut.width=nt,ut.height=lt,ut.getContext("2d").drawImage(w,0,0,nt,lt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ot.width+"x"+ot.height+") to ("+nt+"x"+lt+")."),ut}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ot.width+"x"+ot.height+")."),w;return w}function m(w){return w.generateMipmaps}function p(w){n.generateMipmap(w)}function x(w){return w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?n.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(w,M,G,et,ot=!1){if(w!==null){if(n[w]!==void 0)return n[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let nt=M;if(M===n.RED&&(G===n.FLOAT&&(nt=n.R32F),G===n.HALF_FLOAT&&(nt=n.R16F),G===n.UNSIGNED_BYTE&&(nt=n.R8)),M===n.RED_INTEGER&&(G===n.UNSIGNED_BYTE&&(nt=n.R8UI),G===n.UNSIGNED_SHORT&&(nt=n.R16UI),G===n.UNSIGNED_INT&&(nt=n.R32UI),G===n.BYTE&&(nt=n.R8I),G===n.SHORT&&(nt=n.R16I),G===n.INT&&(nt=n.R32I)),M===n.RG&&(G===n.FLOAT&&(nt=n.RG32F),G===n.HALF_FLOAT&&(nt=n.RG16F),G===n.UNSIGNED_BYTE&&(nt=n.RG8)),M===n.RG_INTEGER&&(G===n.UNSIGNED_BYTE&&(nt=n.RG8UI),G===n.UNSIGNED_SHORT&&(nt=n.RG16UI),G===n.UNSIGNED_INT&&(nt=n.RG32UI),G===n.BYTE&&(nt=n.RG8I),G===n.SHORT&&(nt=n.RG16I),G===n.INT&&(nt=n.RG32I)),M===n.RGB_INTEGER&&(G===n.UNSIGNED_BYTE&&(nt=n.RGB8UI),G===n.UNSIGNED_SHORT&&(nt=n.RGB16UI),G===n.UNSIGNED_INT&&(nt=n.RGB32UI),G===n.BYTE&&(nt=n.RGB8I),G===n.SHORT&&(nt=n.RGB16I),G===n.INT&&(nt=n.RGB32I)),M===n.RGBA_INTEGER&&(G===n.UNSIGNED_BYTE&&(nt=n.RGBA8UI),G===n.UNSIGNED_SHORT&&(nt=n.RGBA16UI),G===n.UNSIGNED_INT&&(nt=n.RGBA32UI),G===n.BYTE&&(nt=n.RGBA8I),G===n.SHORT&&(nt=n.RGBA16I),G===n.INT&&(nt=n.RGBA32I)),M===n.RGB&&G===n.UNSIGNED_INT_5_9_9_9_REV&&(nt=n.RGB9_E5),M===n.RGBA){const lt=ot?Xa:ee.getTransfer(et);G===n.FLOAT&&(nt=n.RGBA32F),G===n.HALF_FLOAT&&(nt=n.RGBA16F),G===n.UNSIGNED_BYTE&&(nt=lt===ae?n.SRGB8_ALPHA8:n.RGBA8),G===n.UNSIGNED_SHORT_4_4_4_4&&(nt=n.RGBA4),G===n.UNSIGNED_SHORT_5_5_5_1&&(nt=n.RGB5_A1)}return(nt===n.R16F||nt===n.R32F||nt===n.RG16F||nt===n.RG32F||nt===n.RGBA16F||nt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function S(w,M){let G;return w?M===null||M===bi||M===as?G=n.DEPTH24_STENCIL8:M===Bn?G=n.DEPTH32F_STENCIL8:M===Is&&(G=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===bi||M===as?G=n.DEPTH_COMPONENT24:M===Bn?G=n.DEPTH_COMPONENT32F:M===Is&&(G=n.DEPTH_COMPONENT16),G}function U(w,M){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==gn&&w.minFilter!==Tn?Math.log2(Math.max(M.width,M.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?M.mipmaps.length:1}function C(w){const M=w.target;M.removeEventListener("dispose",C),T(M),M.isVideoTexture&&d.delete(M)}function A(w){const M=w.target;M.removeEventListener("dispose",A),y(M)}function T(w){const M=i.get(w);if(M.__webglInit===void 0)return;const G=w.source,et=h.get(G);if(et){const ot=et[M.__cacheKey];ot.usedTimes--,ot.usedTimes===0&&b(w),Object.keys(et).length===0&&h.delete(G)}i.remove(w)}function b(w){const M=i.get(w);n.deleteTexture(M.__webglTexture);const G=w.source,et=h.get(G);delete et[M.__cacheKey],r.memory.textures--}function y(w){const M=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let et=0;et<6;et++){if(Array.isArray(M.__webglFramebuffer[et]))for(let ot=0;ot<M.__webglFramebuffer[et].length;ot++)n.deleteFramebuffer(M.__webglFramebuffer[et][ot]);else n.deleteFramebuffer(M.__webglFramebuffer[et]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[et])}else{if(Array.isArray(M.__webglFramebuffer))for(let et=0;et<M.__webglFramebuffer.length;et++)n.deleteFramebuffer(M.__webglFramebuffer[et]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let et=0;et<M.__webglColorRenderbuffer.length;et++)M.__webglColorRenderbuffer[et]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[et]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const G=w.textures;for(let et=0,ot=G.length;et<ot;et++){const nt=i.get(G[et]);nt.__webglTexture&&(n.deleteTexture(nt.__webglTexture),r.memory.textures--),i.remove(G[et])}i.remove(w)}let D=0;function H(){D=0}function z(){const w=D;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),D+=1,w}function X(w){const M=[];return M.push(w.wrapS),M.push(w.wrapT),M.push(w.wrapR||0),M.push(w.magFilter),M.push(w.minFilter),M.push(w.anisotropy),M.push(w.internalFormat),M.push(w.format),M.push(w.type),M.push(w.generateMipmaps),M.push(w.premultiplyAlpha),M.push(w.flipY),M.push(w.unpackAlignment),M.push(w.colorSpace),M.join()}function P(w,M){const G=i.get(w);if(w.isVideoTexture&&q(w),w.isRenderTargetTexture===!1&&w.version>0&&G.__version!==w.version){const et=w.image;if(et===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(et.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(G,w,M);return}}e.bindTexture(n.TEXTURE_2D,G.__webglTexture,n.TEXTURE0+M)}function R(w,M){const G=i.get(w);if(w.version>0&&G.__version!==w.version){$(G,w,M);return}e.bindTexture(n.TEXTURE_2D_ARRAY,G.__webglTexture,n.TEXTURE0+M)}function V(w,M){const G=i.get(w);if(w.version>0&&G.__version!==w.version){$(G,w,M);return}e.bindTexture(n.TEXTURE_3D,G.__webglTexture,n.TEXTURE0+M)}function B(w,M){const G=i.get(w);if(w.version>0&&G.__version!==w.version){tt(G,w,M);return}e.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture,n.TEXTURE0+M)}const Z={[So]:n.REPEAT,[vi]:n.CLAMP_TO_EDGE,[bo]:n.MIRRORED_REPEAT},J={[gn]:n.NEAREST,[qp]:n.NEAREST_MIPMAP_NEAREST,[Vs]:n.NEAREST_MIPMAP_LINEAR,[Tn]:n.LINEAR,[fr]:n.LINEAR_MIPMAP_NEAREST,[Mi]:n.LINEAR_MIPMAP_LINEAR},rt={[Qp]:n.NEVER,[am]:n.ALWAYS,[tm]:n.LESS,[$d]:n.LEQUAL,[em]:n.EQUAL,[sm]:n.GEQUAL,[nm]:n.GREATER,[im]:n.NOTEQUAL};function ft(w,M){if(M.type===Bn&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===Tn||M.magFilter===fr||M.magFilter===Vs||M.magFilter===Mi||M.minFilter===Tn||M.minFilter===fr||M.minFilter===Vs||M.minFilter===Mi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,Z[M.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,Z[M.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,Z[M.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,J[M.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,J[M.minFilter]),M.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,rt[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===gn||M.minFilter!==Vs&&M.minFilter!==Mi||M.type===Bn&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");n.texParameterf(w,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function vt(w,M){let G=!1;w.__webglInit===void 0&&(w.__webglInit=!0,M.addEventListener("dispose",C));const et=M.source;let ot=h.get(et);ot===void 0&&(ot={},h.set(et,ot));const nt=X(M);if(nt!==w.__cacheKey){ot[nt]===void 0&&(ot[nt]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,G=!0),ot[nt].usedTimes++;const lt=ot[w.__cacheKey];lt!==void 0&&(ot[w.__cacheKey].usedTimes--,lt.usedTimes===0&&b(M)),w.__cacheKey=nt,w.__webglTexture=ot[nt].texture}return G}function $(w,M,G){let et=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(et=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(et=n.TEXTURE_3D);const ot=vt(w,M),nt=M.source;e.bindTexture(et,w.__webglTexture,n.TEXTURE0+G);const lt=i.get(nt);if(nt.version!==lt.__version||ot===!0){e.activeTexture(n.TEXTURE0+G);const ut=ee.getPrimaries(ee.workingColorSpace),wt=M.colorSpace===Kn?null:ee.getPrimaries(M.colorSpace),Xt=M.colorSpace===Kn||ut===wt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);let mt=_(M.image,!1,s.maxTextureSize);mt=ct(M,mt);const Rt=a.convert(M.format,M.colorSpace),I=a.convert(M.type);let Q=v(M.internalFormat,Rt,I,M.colorSpace,M.isVideoTexture);ft(et,M);let st;const xt=M.mipmaps,Ut=M.isVideoTexture!==!0,Lt=lt.__version===void 0||ot===!0,F=nt.dataReady,yt=U(M,mt);if(M.isDepthTexture)Q=S(M.format===rs,M.type),Lt&&(Ut?e.texStorage2D(n.TEXTURE_2D,1,Q,mt.width,mt.height):e.texImage2D(n.TEXTURE_2D,0,Q,mt.width,mt.height,0,Rt,I,null));else if(M.isDataTexture)if(xt.length>0){Ut&&Lt&&e.texStorage2D(n.TEXTURE_2D,yt,Q,xt[0].width,xt[0].height);for(let K=0,at=xt.length;K<at;K++)st=xt[K],Ut?F&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,st.width,st.height,Rt,I,st.data):e.texImage2D(n.TEXTURE_2D,K,Q,st.width,st.height,0,Rt,I,st.data);M.generateMipmaps=!1}else Ut?(Lt&&e.texStorage2D(n.TEXTURE_2D,yt,Q,mt.width,mt.height),F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,mt.width,mt.height,Rt,I,mt.data)):e.texImage2D(n.TEXTURE_2D,0,Q,mt.width,mt.height,0,Rt,I,mt.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ut&&Lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,yt,Q,xt[0].width,xt[0].height,mt.depth);for(let K=0,at=xt.length;K<at;K++)if(st=xt[K],M.format!==mn)if(Rt!==null)if(Ut){if(F)if(M.layerUpdates.size>0){const St=id(st.width,st.height,M.format,M.type);for(const bt of M.layerUpdates){const Ht=st.data.subarray(bt*St/st.data.BYTES_PER_ELEMENT,(bt+1)*St/st.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,bt,st.width,st.height,1,Rt,Ht)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,st.width,st.height,mt.depth,Rt,st.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,K,Q,st.width,st.height,mt.depth,0,st.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ut?F&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,st.width,st.height,mt.depth,Rt,I,st.data):e.texImage3D(n.TEXTURE_2D_ARRAY,K,Q,st.width,st.height,mt.depth,0,Rt,I,st.data)}else{Ut&&Lt&&e.texStorage2D(n.TEXTURE_2D,yt,Q,xt[0].width,xt[0].height);for(let K=0,at=xt.length;K<at;K++)st=xt[K],M.format!==mn?Rt!==null?Ut?F&&e.compressedTexSubImage2D(n.TEXTURE_2D,K,0,0,st.width,st.height,Rt,st.data):e.compressedTexImage2D(n.TEXTURE_2D,K,Q,st.width,st.height,0,st.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ut?F&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,st.width,st.height,Rt,I,st.data):e.texImage2D(n.TEXTURE_2D,K,Q,st.width,st.height,0,Rt,I,st.data)}else if(M.isDataArrayTexture)if(Ut){if(Lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,yt,Q,mt.width,mt.height,mt.depth),F)if(M.layerUpdates.size>0){const K=id(mt.width,mt.height,M.format,M.type);for(const at of M.layerUpdates){const St=mt.data.subarray(at*K/mt.data.BYTES_PER_ELEMENT,(at+1)*K/mt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,at,mt.width,mt.height,1,Rt,I,St)}M.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,mt.width,mt.height,mt.depth,Rt,I,mt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Q,mt.width,mt.height,mt.depth,0,Rt,I,mt.data);else if(M.isData3DTexture)Ut?(Lt&&e.texStorage3D(n.TEXTURE_3D,yt,Q,mt.width,mt.height,mt.depth),F&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,mt.width,mt.height,mt.depth,Rt,I,mt.data)):e.texImage3D(n.TEXTURE_3D,0,Q,mt.width,mt.height,mt.depth,0,Rt,I,mt.data);else if(M.isFramebufferTexture){if(Lt)if(Ut)e.texStorage2D(n.TEXTURE_2D,yt,Q,mt.width,mt.height);else{let K=mt.width,at=mt.height;for(let St=0;St<yt;St++)e.texImage2D(n.TEXTURE_2D,St,Q,K,at,0,Rt,I,null),K>>=1,at>>=1}}else if(xt.length>0){if(Ut&&Lt){const K=dt(xt[0]);e.texStorage2D(n.TEXTURE_2D,yt,Q,K.width,K.height)}for(let K=0,at=xt.length;K<at;K++)st=xt[K],Ut?F&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,Rt,I,st):e.texImage2D(n.TEXTURE_2D,K,Q,Rt,I,st);M.generateMipmaps=!1}else if(Ut){if(Lt){const K=dt(mt);e.texStorage2D(n.TEXTURE_2D,yt,Q,K.width,K.height)}F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Rt,I,mt)}else e.texImage2D(n.TEXTURE_2D,0,Q,Rt,I,mt);m(M)&&p(et),lt.__version=nt.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function tt(w,M,G){if(M.image.length!==6)return;const et=vt(w,M),ot=M.source;e.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+G);const nt=i.get(ot);if(ot.version!==nt.__version||et===!0){e.activeTexture(n.TEXTURE0+G);const lt=ee.getPrimaries(ee.workingColorSpace),ut=M.colorSpace===Kn?null:ee.getPrimaries(M.colorSpace),wt=M.colorSpace===Kn||lt===ut?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);const Xt=M.isCompressedTexture||M.image[0].isCompressedTexture,mt=M.image[0]&&M.image[0].isDataTexture,Rt=[];for(let at=0;at<6;at++)!Xt&&!mt?Rt[at]=_(M.image[at],!0,s.maxCubemapSize):Rt[at]=mt?M.image[at].image:M.image[at],Rt[at]=ct(M,Rt[at]);const I=Rt[0],Q=a.convert(M.format,M.colorSpace),st=a.convert(M.type),xt=v(M.internalFormat,Q,st,M.colorSpace),Ut=M.isVideoTexture!==!0,Lt=nt.__version===void 0||et===!0,F=ot.dataReady;let yt=U(M,I);ft(n.TEXTURE_CUBE_MAP,M);let K;if(Xt){Ut&&Lt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,yt,xt,I.width,I.height);for(let at=0;at<6;at++){K=Rt[at].mipmaps;for(let St=0;St<K.length;St++){const bt=K[St];M.format!==mn?Q!==null?Ut?F&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,St,0,0,bt.width,bt.height,Q,bt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,St,xt,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ut?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,St,0,0,bt.width,bt.height,Q,st,bt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,St,xt,bt.width,bt.height,0,Q,st,bt.data)}}}else{if(K=M.mipmaps,Ut&&Lt){K.length>0&&yt++;const at=dt(Rt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,yt,xt,at.width,at.height)}for(let at=0;at<6;at++)if(mt){Ut?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Rt[at].width,Rt[at].height,Q,st,Rt[at].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,xt,Rt[at].width,Rt[at].height,0,Q,st,Rt[at].data);for(let St=0;St<K.length;St++){const Ht=K[St].image[at].image;Ut?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,St+1,0,0,Ht.width,Ht.height,Q,st,Ht.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,St+1,xt,Ht.width,Ht.height,0,Q,st,Ht.data)}}else{Ut?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Q,st,Rt[at]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,xt,Q,st,Rt[at]);for(let St=0;St<K.length;St++){const bt=K[St];Ut?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,St+1,0,0,Q,st,bt.image[at]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,St+1,xt,Q,st,bt.image[at])}}}m(M)&&p(n.TEXTURE_CUBE_MAP),nt.__version=ot.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function gt(w,M,G,et,ot,nt){const lt=a.convert(G.format,G.colorSpace),ut=a.convert(G.type),wt=v(G.internalFormat,lt,ut,G.colorSpace),Xt=i.get(M),mt=i.get(G);if(mt.__renderTarget=M,!Xt.__hasExternalTextures){const Rt=Math.max(1,M.width>>nt),I=Math.max(1,M.height>>nt);ot===n.TEXTURE_3D||ot===n.TEXTURE_2D_ARRAY?e.texImage3D(ot,nt,wt,Rt,I,M.depth,0,lt,ut,null):e.texImage2D(ot,nt,wt,Rt,I,0,lt,ut,null)}e.bindFramebuffer(n.FRAMEBUFFER,w),It(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,et,ot,mt.__webglTexture,0,Pt(M)):(ot===n.TEXTURE_2D||ot>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ot<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,et,ot,mt.__webglTexture,nt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function j(w,M,G){if(n.bindRenderbuffer(n.RENDERBUFFER,w),M.depthBuffer){const et=M.depthTexture,ot=et&&et.isDepthTexture?et.type:null,nt=S(M.stencilBuffer,ot),lt=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ut=Pt(M);It(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ut,nt,M.width,M.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,ut,nt,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,nt,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,lt,n.RENDERBUFFER,w)}else{const et=M.textures;for(let ot=0;ot<et.length;ot++){const nt=et[ot],lt=a.convert(nt.format,nt.colorSpace),ut=a.convert(nt.type),wt=v(nt.internalFormat,lt,ut,nt.colorSpace),Xt=Pt(M);G&&It(M)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Xt,wt,M.width,M.height):It(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Xt,wt,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,wt,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function pt(w,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,w),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const et=i.get(M.depthTexture);et.__renderTarget=M,(!et.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),P(M.depthTexture,0);const ot=et.__webglTexture,nt=Pt(M);if(M.depthTexture.format===ts)It(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ot,0,nt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ot,0);else if(M.depthTexture.format===rs)It(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ot,0,nt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ot,0);else throw new Error("Unknown depthTexture format")}function Dt(w){const M=i.get(w),G=w.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==w.depthTexture){const et=w.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),et){const ot=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,et.removeEventListener("dispose",ot)};et.addEventListener("dispose",ot),M.__depthDisposeCallback=ot}M.__boundDepthTexture=et}if(w.depthTexture&&!M.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");pt(M.__webglFramebuffer,w)}else if(G){M.__webglDepthbuffer=[];for(let et=0;et<6;et++)if(e.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[et]),M.__webglDepthbuffer[et]===void 0)M.__webglDepthbuffer[et]=n.createRenderbuffer(),j(M.__webglDepthbuffer[et],w,!1);else{const ot=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,nt=M.__webglDepthbuffer[et];n.bindRenderbuffer(n.RENDERBUFFER,nt),n.framebufferRenderbuffer(n.FRAMEBUFFER,ot,n.RENDERBUFFER,nt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),j(M.__webglDepthbuffer,w,!1);else{const et=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ot=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ot),n.framebufferRenderbuffer(n.FRAMEBUFFER,et,n.RENDERBUFFER,ot)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ft(w,M,G){const et=i.get(w);M!==void 0&&gt(et.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),G!==void 0&&Dt(w)}function Nt(w){const M=w.texture,G=i.get(w),et=i.get(M);w.addEventListener("dispose",A);const ot=w.textures,nt=w.isWebGLCubeRenderTarget===!0,lt=ot.length>1;if(lt||(et.__webglTexture===void 0&&(et.__webglTexture=n.createTexture()),et.__version=M.version,r.memory.textures++),nt){G.__webglFramebuffer=[];for(let ut=0;ut<6;ut++)if(M.mipmaps&&M.mipmaps.length>0){G.__webglFramebuffer[ut]=[];for(let wt=0;wt<M.mipmaps.length;wt++)G.__webglFramebuffer[ut][wt]=n.createFramebuffer()}else G.__webglFramebuffer[ut]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){G.__webglFramebuffer=[];for(let ut=0;ut<M.mipmaps.length;ut++)G.__webglFramebuffer[ut]=n.createFramebuffer()}else G.__webglFramebuffer=n.createFramebuffer();if(lt)for(let ut=0,wt=ot.length;ut<wt;ut++){const Xt=i.get(ot[ut]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=n.createTexture(),r.memory.textures++)}if(w.samples>0&&It(w)===!1){G.__webglMultisampledFramebuffer=n.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ut=0;ut<ot.length;ut++){const wt=ot[ut];G.__webglColorRenderbuffer[ut]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,G.__webglColorRenderbuffer[ut]);const Xt=a.convert(wt.format,wt.colorSpace),mt=a.convert(wt.type),Rt=v(wt.internalFormat,Xt,mt,wt.colorSpace,w.isXRRenderTarget===!0),I=Pt(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,I,Rt,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ut,n.RENDERBUFFER,G.__webglColorRenderbuffer[ut])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(G.__webglDepthRenderbuffer=n.createRenderbuffer(),j(G.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(nt){e.bindTexture(n.TEXTURE_CUBE_MAP,et.__webglTexture),ft(n.TEXTURE_CUBE_MAP,M);for(let ut=0;ut<6;ut++)if(M.mipmaps&&M.mipmaps.length>0)for(let wt=0;wt<M.mipmaps.length;wt++)gt(G.__webglFramebuffer[ut][wt],w,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,wt);else gt(G.__webglFramebuffer[ut],w,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0);m(M)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(lt){for(let ut=0,wt=ot.length;ut<wt;ut++){const Xt=ot[ut],mt=i.get(Xt);e.bindTexture(n.TEXTURE_2D,mt.__webglTexture),ft(n.TEXTURE_2D,Xt),gt(G.__webglFramebuffer,w,Xt,n.COLOR_ATTACHMENT0+ut,n.TEXTURE_2D,0),m(Xt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let ut=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ut=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ut,et.__webglTexture),ft(ut,M),M.mipmaps&&M.mipmaps.length>0)for(let wt=0;wt<M.mipmaps.length;wt++)gt(G.__webglFramebuffer[wt],w,M,n.COLOR_ATTACHMENT0,ut,wt);else gt(G.__webglFramebuffer,w,M,n.COLOR_ATTACHMENT0,ut,0);m(M)&&p(ut),e.unbindTexture()}w.depthBuffer&&Dt(w)}function Et(w){const M=w.textures;for(let G=0,et=M.length;G<et;G++){const ot=M[G];if(m(ot)){const nt=x(w),lt=i.get(ot).__webglTexture;e.bindTexture(nt,lt),p(nt),e.unbindTexture()}}}const Tt=[],O=[];function Gt(w){if(w.samples>0){if(It(w)===!1){const M=w.textures,G=w.width,et=w.height;let ot=n.COLOR_BUFFER_BIT;const nt=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,lt=i.get(w),ut=M.length>1;if(ut)for(let wt=0;wt<M.length;wt++)e.bindFramebuffer(n.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,lt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,lt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,lt.__webglFramebuffer);for(let wt=0;wt<M.length;wt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(ot|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(ot|=n.STENCIL_BUFFER_BIT)),ut){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,lt.__webglColorRenderbuffer[wt]);const Xt=i.get(M[wt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Xt,0)}n.blitFramebuffer(0,0,G,et,0,0,G,et,ot,n.NEAREST),c===!0&&(Tt.length=0,O.length=0,Tt.push(n.COLOR_ATTACHMENT0+wt),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Tt.push(nt),O.push(nt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,O)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Tt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ut)for(let wt=0;wt<M.length;wt++){e.bindFramebuffer(n.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.RENDERBUFFER,lt.__webglColorRenderbuffer[wt]);const Xt=i.get(M[wt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,lt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.TEXTURE_2D,Xt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,lt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&c){const M=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function Pt(w){return Math.min(s.maxSamples,w.samples)}function It(w){const M=i.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function q(w){const M=r.render.frame;d.get(w)!==M&&(d.set(w,M),w.update())}function ct(w,M){const G=w.colorSpace,et=w.format,ot=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||G!==cs&&G!==Kn&&(ee.getTransfer(G)===ae?(et!==mn||ot!==Vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),M}function dt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=H,this.setTexture2D=P,this.setTexture2DArray=R,this.setTexture3D=V,this.setTextureCube=B,this.rebindTextures=Ft,this.setupRenderTarget=Nt,this.updateRenderTargetMipmap=Et,this.updateMultisampleRenderTarget=Gt,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=It}function lv(n,t){function e(i,s=Kn){let a;const r=ee.getTransfer(s);if(i===Vn)return n.UNSIGNED_BYTE;if(i===fc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===pc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Nd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ud)return n.BYTE;if(i===Fd)return n.SHORT;if(i===Is)return n.UNSIGNED_SHORT;if(i===uc)return n.INT;if(i===bi)return n.UNSIGNED_INT;if(i===Bn)return n.FLOAT;if(i===Us)return n.HALF_FLOAT;if(i===zd)return n.ALPHA;if(i===Od)return n.RGB;if(i===mn)return n.RGBA;if(i===Bd)return n.LUMINANCE;if(i===Hd)return n.LUMINANCE_ALPHA;if(i===ts)return n.DEPTH_COMPONENT;if(i===rs)return n.DEPTH_STENCIL;if(i===Gd)return n.RED;if(i===mc)return n.RED_INTEGER;if(i===Vd)return n.RG;if(i===gc)return n.RG_INTEGER;if(i===_c)return n.RGBA_INTEGER;if(i===Ma||i===ya||i===Sa||i===ba)if(r===ae)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Ma)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ya)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Sa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ba)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Ma)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ya)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Sa)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ba)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Eo||i===wo||i===To||i===Ao)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Eo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===wo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===To)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ao)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ro||i===Co||i===Po)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===Ro||i===Co)return r===ae?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===Po)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Do||i===Lo||i===Io||i===ko||i===Uo||i===Fo||i===No||i===zo||i===Oo||i===Bo||i===Ho||i===Go||i===Vo||i===Xo)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Do)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Lo)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Io)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ko)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Uo)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Fo)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===No)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===zo)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Oo)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Bo)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ho)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Go)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Vo)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Xo)return r===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ea||i===Wo||i===$o)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===Ea)return r===ae?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Wo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===$o)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Xd||i===Yo||i===Zo||i===qo)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===Ea)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Yo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Zo)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===qo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===as?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class dv extends nn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ae extends xe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const hv={type:"move"};class Hr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ae,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ae,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ae,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const d=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],h=d.position.distanceTo(f.position),u=.02,g=.005;l.inputState.pinching&&h>u+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=u-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(hv)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ae;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const uv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fv=`
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

}`;class pv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const s=new Be,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ii({vertexShader:uv,fragmentShader:fv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new he(new $a(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class mv extends ls{constructor(t,e){super();const i=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,d=null,f=null,h=null,u=null,g=null;const _=new pv,m=e.getContextAttributes();let p=null,x=null;const v=[],S=[],U=new Yt;let C=null;const A=new nn;A.viewport=new _e;const T=new nn;T.viewport=new _e;const b=[A,T],y=new dv;let D=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let tt=v[$];return tt===void 0&&(tt=new Hr,v[$]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function($){let tt=v[$];return tt===void 0&&(tt=new Hr,v[$]=tt),tt.getGripSpace()},this.getHand=function($){let tt=v[$];return tt===void 0&&(tt=new Hr,v[$]=tt),tt.getHandSpace()};function z($){const tt=S.indexOf($.inputSource);if(tt===-1)return;const gt=v[tt];gt!==void 0&&(gt.update($.inputSource,$.frame,l||r),gt.dispatchEvent({type:$.type,data:$.inputSource}))}function X(){s.removeEventListener("select",z),s.removeEventListener("selectstart",z),s.removeEventListener("selectend",z),s.removeEventListener("squeeze",z),s.removeEventListener("squeezestart",z),s.removeEventListener("squeezeend",z),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",P);for(let $=0;$<v.length;$++){const tt=S[$];tt!==null&&(S[$]=null,v[$].disconnect(tt))}D=null,H=null,_.reset(),t.setRenderTarget(p),u=null,h=null,f=null,s=null,x=null,vt.stop(),i.isPresenting=!1,t.setPixelRatio(C),t.setSize(U.width,U.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){a=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return h!==null?h:u},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",z),s.addEventListener("selectstart",z),s.addEventListener("selectend",z),s.addEventListener("squeeze",z),s.addEventListener("squeezestart",z),s.addEventListener("squeezeend",z),s.addEventListener("end",X),s.addEventListener("inputsourceschange",P),m.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(U),s.renderState.layers===void 0){const tt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,e,tt),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new Ei(u.framebufferWidth,u.framebufferHeight,{format:mn,type:Vn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let tt=null,gt=null,j=null;m.depth&&(j=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=m.stencil?rs:ts,gt=m.stencil?as:bi);const pt={colorFormat:e.RGBA8,depthFormat:j,scaleFactor:a};f=new XRWebGLBinding(s,e),h=f.createProjectionLayer(pt),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),x=new Ei(h.textureWidth,h.textureHeight,{format:mn,type:Vn,depthTexture:new sh(h.textureWidth,h.textureHeight,gt,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),vt.setContext(s),vt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function P($){for(let tt=0;tt<$.removed.length;tt++){const gt=$.removed[tt],j=S.indexOf(gt);j>=0&&(S[j]=null,v[j].disconnect(gt))}for(let tt=0;tt<$.added.length;tt++){const gt=$.added[tt];let j=S.indexOf(gt);if(j===-1){for(let Dt=0;Dt<v.length;Dt++)if(Dt>=S.length){S.push(gt),j=Dt;break}else if(S[Dt]===null){S[Dt]=gt,j=Dt;break}if(j===-1)break}const pt=v[j];pt&&pt.connect(gt)}}const R=new Y,V=new Y;function B($,tt,gt){R.setFromMatrixPosition(tt.matrixWorld),V.setFromMatrixPosition(gt.matrixWorld);const j=R.distanceTo(V),pt=tt.projectionMatrix.elements,Dt=gt.projectionMatrix.elements,Ft=pt[14]/(pt[10]-1),Nt=pt[14]/(pt[10]+1),Et=(pt[9]+1)/pt[5],Tt=(pt[9]-1)/pt[5],O=(pt[8]-1)/pt[0],Gt=(Dt[8]+1)/Dt[0],Pt=Ft*O,It=Ft*Gt,q=j/(-O+Gt),ct=q*-O;if(tt.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ct),$.translateZ(q),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),pt[10]===-1)$.projectionMatrix.copy(tt.projectionMatrix),$.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const dt=Ft+q,w=Nt+q,M=Pt-ct,G=It+(j-ct),et=Et*Nt/w*dt,ot=Tt*Nt/w*dt;$.projectionMatrix.makePerspective(M,G,et,ot,dt,w),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Z($,tt){tt===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(tt.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let tt=$.near,gt=$.far;_.texture!==null&&(_.depthNear>0&&(tt=_.depthNear),_.depthFar>0&&(gt=_.depthFar)),y.near=T.near=A.near=tt,y.far=T.far=A.far=gt,(D!==y.near||H!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),D=y.near,H=y.far),A.layers.mask=$.layers.mask|2,T.layers.mask=$.layers.mask|4,y.layers.mask=A.layers.mask|T.layers.mask;const j=$.parent,pt=y.cameras;Z(y,j);for(let Dt=0;Dt<pt.length;Dt++)Z(pt[Dt],j);pt.length===2?B(y,A,T):y.projectionMatrix.copy(A.projectionMatrix),J($,y,j)};function J($,tt,gt){gt===null?$.matrix.copy(tt.matrixWorld):($.matrix.copy(gt.matrixWorld),$.matrix.invert(),$.matrix.multiply(tt.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(tt.projectionMatrix),$.projectionMatrixInverse.copy(tt.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Ko*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&u===null))return c},this.setFoveation=function($){c=$,h!==null&&(h.fixedFoveation=$),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=$)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let rt=null;function ft($,tt){if(d=tt.getViewerPose(l||r),g=tt,d!==null){const gt=d.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let j=!1;gt.length!==y.cameras.length&&(y.cameras.length=0,j=!0);for(let Dt=0;Dt<gt.length;Dt++){const Ft=gt[Dt];let Nt=null;if(u!==null)Nt=u.getViewport(Ft);else{const Tt=f.getViewSubImage(h,Ft);Nt=Tt.viewport,Dt===0&&(t.setRenderTargetTextures(x,Tt.colorTexture,h.ignoreDepthValues?void 0:Tt.depthStencilTexture),t.setRenderTarget(x))}let Et=b[Dt];Et===void 0&&(Et=new nn,Et.layers.enable(Dt),Et.viewport=new _e,b[Dt]=Et),Et.matrix.fromArray(Ft.transform.matrix),Et.matrix.decompose(Et.position,Et.quaternion,Et.scale),Et.projectionMatrix.fromArray(Ft.projectionMatrix),Et.projectionMatrixInverse.copy(Et.projectionMatrix).invert(),Et.viewport.set(Nt.x,Nt.y,Nt.width,Nt.height),Dt===0&&(y.matrix.copy(Et.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),j===!0&&y.cameras.push(Et)}const pt=s.enabledFeatures;if(pt&&pt.includes("depth-sensing")){const Dt=f.getDepthInformation(gt[0]);Dt&&Dt.isValid&&Dt.texture&&_.init(t,Dt,s.renderState)}}for(let gt=0;gt<v.length;gt++){const j=S[gt],pt=v[gt];j!==null&&pt!==void 0&&pt.update(j,tt,l||r)}rt&&rt($,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),g=null}const vt=new nh;vt.setAnimationLoop(ft),this.setAnimationLoop=function($){rt=$},this.dispose=function(){}}}const ui=new Rn,gv=new ue;function _v(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Qd(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,v,S){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),f(m,p)):p.isMeshPhongMaterial?(a(m,p),d(m,p)):p.isMeshStandardMaterial?(a(m,p),h(m,p),p.isMeshPhysicalMaterial&&u(m,p,S)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),_(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,x,v):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===We&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===We&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),v=x.envMap,S=x.envMapRotation;v&&(m.envMap.value=v,ui.copy(S),ui.x*=-1,ui.y*=-1,ui.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ui.y*=-1,ui.z*=-1),m.envMapRotation.value.setFromMatrix4(gv.makeRotationFromEuler(ui)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=v*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===We&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function xv(n,t,e,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,v){const S=v.program;i.uniformBlockBinding(x,S)}function l(x,v){let S=s[x.id];S===void 0&&(g(x),S=d(x),s[x.id]=S,x.addEventListener("dispose",m));const U=v.program;i.updateUBOMapping(x,U);const C=t.render.frame;a[x.id]!==C&&(h(x),a[x.id]=C)}function d(x){const v=f();x.__bindingPointIndex=v;const S=n.createBuffer(),U=x.__size,C=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,S),n.bufferData(n.UNIFORM_BUFFER,U,C),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,S),S}function f(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){const v=s[x.id],S=x.uniforms,U=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let C=0,A=S.length;C<A;C++){const T=Array.isArray(S[C])?S[C]:[S[C]];for(let b=0,y=T.length;b<y;b++){const D=T[b];if(u(D,C,b,U)===!0){const H=D.__offset,z=Array.isArray(D.value)?D.value:[D.value];let X=0;for(let P=0;P<z.length;P++){const R=z[P],V=_(R);typeof R=="number"||typeof R=="boolean"?(D.__data[0]=R,n.bufferSubData(n.UNIFORM_BUFFER,H+X,D.__data)):R.isMatrix3?(D.__data[0]=R.elements[0],D.__data[1]=R.elements[1],D.__data[2]=R.elements[2],D.__data[3]=0,D.__data[4]=R.elements[3],D.__data[5]=R.elements[4],D.__data[6]=R.elements[5],D.__data[7]=0,D.__data[8]=R.elements[6],D.__data[9]=R.elements[7],D.__data[10]=R.elements[8],D.__data[11]=0):(R.toArray(D.__data,X),X+=V.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,H,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,v,S,U){const C=x.value,A=v+"_"+S;if(U[A]===void 0)return typeof C=="number"||typeof C=="boolean"?U[A]=C:U[A]=C.clone(),!0;{const T=U[A];if(typeof C=="number"||typeof C=="boolean"){if(T!==C)return U[A]=C,!0}else if(T.equals(C)===!1)return T.copy(C),!0}return!1}function g(x){const v=x.uniforms;let S=0;const U=16;for(let A=0,T=v.length;A<T;A++){const b=Array.isArray(v[A])?v[A]:[v[A]];for(let y=0,D=b.length;y<D;y++){const H=b[y],z=Array.isArray(H.value)?H.value:[H.value];for(let X=0,P=z.length;X<P;X++){const R=z[X],V=_(R),B=S%U,Z=B%V.boundary,J=B+Z;S+=Z,J!==0&&U-J<V.storage&&(S+=U-J),H.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=S,S+=V.storage}}}const C=S%U;return C>0&&(S+=U-C),x.__size=S,x.__cache={},this}function _(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function m(x){const v=x.target;v.removeEventListener("dispose",m);const S=r.indexOf(v.__bindingPointIndex);r.splice(S,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function p(){for(const x in s)n.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:c,update:l,dispose:p}}class vv{constructor(t={}){const{canvas:e=om(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=r;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const x=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=en,this.toneMapping=ti,this.toneMappingExposure=1;const S=this;let U=!1,C=0,A=0,T=null,b=-1,y=null;const D=new _e,H=new _e;let z=null;const X=new Wt(0);let P=0,R=e.width,V=e.height,B=1,Z=null,J=null;const rt=new _e(0,0,R,V),ft=new _e(0,0,R,V);let vt=!1;const $=new Mc;let tt=!1,gt=!1;const j=new ue,pt=new ue,Dt=new Y,Ft=new _e,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Et=!1;function Tt(){return T===null?B:1}let O=i;function Gt(E,W){return e.getContext(E,W)}try{const E={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${dc}`),e.addEventListener("webglcontextlost",at,!1),e.addEventListener("webglcontextrestored",St,!1),e.addEventListener("webglcontextcreationerror",bt,!1),O===null){const W="webgl2";if(O=Gt(W,E),O===null)throw Gt(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Pt,It,q,ct,dt,w,M,G,et,ot,nt,lt,ut,wt,Xt,mt,Rt,I,Q,st,xt,Ut,Lt,F;function yt(){Pt=new E_(O),Pt.init(),Ut=new lv(O,Pt),It=new x_(O,Pt,t,Ut),q=new rv(O,Pt),It.reverseDepthBuffer&&h&&q.buffers.depth.setReversed(!0),ct=new A_(O),dt=new Wx,w=new cv(O,Pt,q,dt,It,Ut,ct),M=new M_(S),G=new b_(S),et=new km(O),Lt=new g_(O,et),ot=new w_(O,et,ct,Lt),nt=new C_(O,ot,et,ct),Q=new R_(O,It,w),mt=new v_(dt),lt=new Xx(S,M,G,Pt,It,Lt,mt),ut=new _v(S,dt),wt=new Yx,Xt=new Qx(Pt),I=new m_(S,M,G,q,nt,u,c),Rt=new sv(S,nt,It),F=new xv(O,ct,It,q),st=new __(O,Pt,ct),xt=new T_(O,Pt,ct),ct.programs=lt.programs,S.capabilities=It,S.extensions=Pt,S.properties=dt,S.renderLists=wt,S.shadowMap=Rt,S.state=q,S.info=ct}yt();const K=new mv(S,O);this.xr=K,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const E=Pt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Pt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(E){E!==void 0&&(B=E,this.setSize(R,V,!1))},this.getSize=function(E){return E.set(R,V)},this.setSize=function(E,W,L=!0){if(K.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}R=E,V=W,e.width=Math.floor(E*B),e.height=Math.floor(W*B),L===!0&&(e.style.width=E+"px",e.style.height=W+"px"),this.setViewport(0,0,E,W)},this.getDrawingBufferSize=function(E){return E.set(R*B,V*B).floor()},this.setDrawingBufferSize=function(E,W,L){R=E,V=W,B=L,e.width=Math.floor(E*L),e.height=Math.floor(W*L),this.setViewport(0,0,E,W)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(rt)},this.setViewport=function(E,W,L,N){E.isVector4?rt.set(E.x,E.y,E.z,E.w):rt.set(E,W,L,N),q.viewport(D.copy(rt).multiplyScalar(B).round())},this.getScissor=function(E){return E.copy(ft)},this.setScissor=function(E,W,L,N){E.isVector4?ft.set(E.x,E.y,E.z,E.w):ft.set(E,W,L,N),q.scissor(H.copy(ft).multiplyScalar(B).round())},this.getScissorTest=function(){return vt},this.setScissorTest=function(E){q.setScissorTest(vt=E)},this.setOpaqueSort=function(E){Z=E},this.setTransparentSort=function(E){J=E},this.getClearColor=function(E){return E.copy(I.getClearColor())},this.setClearColor=function(){I.setClearColor.apply(I,arguments)},this.getClearAlpha=function(){return I.getClearAlpha()},this.setClearAlpha=function(){I.setClearAlpha.apply(I,arguments)},this.clear=function(E=!0,W=!0,L=!0){let N=0;if(E){let k=!1;if(T!==null){const it=T.texture.format;k=it===_c||it===gc||it===mc}if(k){const it=T.texture.type,ht=it===Vn||it===bi||it===Is||it===as||it===fc||it===pc,_t=I.getClearColor(),At=I.getClearAlpha(),Bt=_t.r,Ot=_t.g,Mt=_t.b;ht?(g[0]=Bt,g[1]=Ot,g[2]=Mt,g[3]=At,O.clearBufferuiv(O.COLOR,0,g)):(_[0]=Bt,_[1]=Ot,_[2]=Mt,_[3]=At,O.clearBufferiv(O.COLOR,0,_))}else N|=O.COLOR_BUFFER_BIT}W&&(N|=O.DEPTH_BUFFER_BIT),L&&(N|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(N)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",at,!1),e.removeEventListener("webglcontextrestored",St,!1),e.removeEventListener("webglcontextcreationerror",bt,!1),wt.dispose(),Xt.dispose(),dt.dispose(),M.dispose(),G.dispose(),nt.dispose(),Lt.dispose(),F.dispose(),lt.dispose(),K.dispose(),K.removeEventListener("sessionstart",we),K.removeEventListener("sessionend",Pe),se.stop()};function at(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),U=!0}function St(){console.log("THREE.WebGLRenderer: Context Restored."),U=!1;const E=ct.autoReset,W=Rt.enabled,L=Rt.autoUpdate,N=Rt.needsUpdate,k=Rt.type;yt(),ct.autoReset=E,Rt.enabled=W,Rt.autoUpdate=L,Rt.needsUpdate=N,Rt.type=k}function bt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Ht(E){const W=E.target;W.removeEventListener("dispose",Ht),jt(W)}function jt(E){ne(E),dt.remove(E)}function ne(E){const W=dt.get(E).programs;W!==void 0&&(W.forEach(function(L){lt.releaseProgram(L)}),E.isShaderMaterial&&lt.releaseShaderCache(E))}this.renderBufferDirect=function(E,W,L,N,k,it){W===null&&(W=Nt);const ht=k.isMesh&&k.matrixWorld.determinant()<0,_t=Ke(E,W,L,N,k);q.setMaterial(N,ht);let At=L.index,Bt=1;if(N.wireframe===!0){if(At=ot.getWireframeAttribute(L),At===void 0)return;Bt=2}const Ot=L.drawRange,Mt=L.attributes.position;let kt=Ot.start*Bt,$t=(Ot.start+Ot.count)*Bt;it!==null&&(kt=Math.max(kt,it.start*Bt),$t=Math.min($t,(it.start+it.count)*Bt)),At!==null?(kt=Math.max(kt,0),$t=Math.min($t,At.count)):Mt!=null&&(kt=Math.max(kt,0),$t=Math.min($t,Mt.count));const Jt=$t-kt;if(Jt<0||Jt===1/0)return;Lt.setup(k,N,_t,L,At);let ye,Kt=st;if(At!==null&&(ye=et.get(At),Kt=xt,Kt.setIndex(ye)),k.isMesh)N.wireframe===!0?(q.setLineWidth(N.wireframeLinewidth*Tt()),Kt.setMode(O.LINES)):Kt.setMode(O.TRIANGLES);else if(k.isLine){let zt=N.linewidth;zt===void 0&&(zt=1),q.setLineWidth(zt*Tt()),k.isLineSegments?Kt.setMode(O.LINES):k.isLineLoop?Kt.setMode(O.LINE_LOOP):Kt.setMode(O.LINE_STRIP)}else k.isPoints?Kt.setMode(O.POINTS):k.isSprite&&Kt.setMode(O.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Kt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Pt.get("WEBGL_multi_draw"))Kt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const zt=k._multiDrawStarts,Ge=k._multiDrawCounts,Qt=k._multiDrawCount,De=At?et.get(At).bytesPerElement:1,xn=dt.get(N).currentProgram.getUniforms();for(let ge=0;ge<Qt;ge++)xn.setValue(O,"_gl_DrawID",ge),Kt.render(zt[ge]/De,Ge[ge])}else if(k.isInstancedMesh)Kt.renderInstances(kt,Jt,k.count);else if(L.isInstancedBufferGeometry){const zt=L._maxInstanceCount!==void 0?L._maxInstanceCount:1/0,Ge=Math.min(L.instanceCount,zt);Kt.renderInstances(kt,Jt,Ge)}else Kt.render(kt,Jt)};function Vt(E,W,L){E.transparent===!0&&E.side===ze&&E.forceSinglePass===!1?(E.side=We,E.needsUpdate=!0,Ye(E,W,L),E.side=ni,E.needsUpdate=!0,Ye(E,W,L),E.side=ze):Ye(E,W,L)}this.compile=function(E,W,L=null){L===null&&(L=E),p=Xt.get(L),p.init(W),v.push(p),L.traverseVisible(function(k){k.isLight&&k.layers.test(W.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),E!==L&&E.traverseVisible(function(k){k.isLight&&k.layers.test(W.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),p.setupLights();const N=new Set;return E.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const it=k.material;if(it)if(Array.isArray(it))for(let ht=0;ht<it.length;ht++){const _t=it[ht];Vt(_t,L,k),N.add(_t)}else Vt(it,L,k),N.add(it)}),v.pop(),p=null,N},this.compileAsync=function(E,W,L=null){const N=this.compile(E,W,L);return new Promise(k=>{function it(){if(N.forEach(function(ht){dt.get(ht).currentProgram.isReady()&&N.delete(ht)}),N.size===0){k(E);return}setTimeout(it,10)}Pt.get("KHR_parallel_shader_compile")!==null?it():setTimeout(it,10)})};let oe=null;function pe(E){oe&&oe(E)}function we(){se.stop()}function Pe(){se.start()}const se=new nh;se.setAnimationLoop(pe),typeof self<"u"&&se.setContext(self),this.setAnimationLoop=function(E){oe=E,K.setAnimationLoop(E),E===null?se.stop():se.start()},K.addEventListener("sessionstart",we),K.addEventListener("sessionend",Pe),this.render=function(E,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(K.cameraAutoUpdate===!0&&K.updateCamera(W),W=K.getCamera()),E.isScene===!0&&E.onBeforeRender(S,E,W,T),p=Xt.get(E,v.length),p.init(W),v.push(p),pt.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),$.setFromProjectionMatrix(pt),gt=this.localClippingEnabled,tt=mt.init(this.clippingPlanes,gt),m=wt.get(E,x.length),m.init(),x.push(m),K.enabled===!0&&K.isPresenting===!0){const it=S.xr.getDepthSensingMesh();it!==null&&le(it,W,-1/0,S.sortObjects)}le(E,W,0,S.sortObjects),m.finish(),S.sortObjects===!0&&m.sort(Z,J),Et=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,Et&&I.addToRenderList(m,E),this.info.render.frame++,tt===!0&&mt.beginShadows();const L=p.state.shadowsArray;Rt.render(L,E,W),tt===!0&&mt.endShadows(),this.info.autoReset===!0&&this.info.reset();const N=m.opaque,k=m.transmissive;if(p.setupLights(),W.isArrayCamera){const it=W.cameras;if(k.length>0)for(let ht=0,_t=it.length;ht<_t;ht++){const At=it[ht];rn(N,k,E,At)}Et&&I.render(E);for(let ht=0,_t=it.length;ht<_t;ht++){const At=it[ht];Re(m,E,At,At.viewport)}}else k.length>0&&rn(N,k,E,W),Et&&I.render(E),Re(m,E,W);T!==null&&(w.updateMultisampleRenderTarget(T),w.updateRenderTargetMipmap(T)),E.isScene===!0&&E.onAfterRender(S,E,W),Lt.resetDefaultState(),b=-1,y=null,v.pop(),v.length>0?(p=v[v.length-1],tt===!0&&mt.setGlobalState(S.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function le(E,W,L,N){if(E.visible===!1)return;if(E.layers.test(W.layers)){if(E.isGroup)L=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(W);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||$.intersectsSprite(E)){N&&Ft.setFromMatrixPosition(E.matrixWorld).applyMatrix4(pt);const ht=nt.update(E),_t=E.material;_t.visible&&m.push(E,ht,_t,L,Ft.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||$.intersectsObject(E))){const ht=nt.update(E),_t=E.material;if(N&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ft.copy(E.boundingSphere.center)):(ht.boundingSphere===null&&ht.computeBoundingSphere(),Ft.copy(ht.boundingSphere.center)),Ft.applyMatrix4(E.matrixWorld).applyMatrix4(pt)),Array.isArray(_t)){const At=ht.groups;for(let Bt=0,Ot=At.length;Bt<Ot;Bt++){const Mt=At[Bt],kt=_t[Mt.materialIndex];kt&&kt.visible&&m.push(E,ht,kt,L,Ft.z,Mt)}}else _t.visible&&m.push(E,ht,_t,L,Ft.z,null)}}const it=E.children;for(let ht=0,_t=it.length;ht<_t;ht++)le(it[ht],W,L,N)}function Re(E,W,L,N){const k=E.opaque,it=E.transmissive,ht=E.transparent;p.setupLightsView(L),tt===!0&&mt.setGlobalState(S.clippingPlanes,L),N&&q.viewport(D.copy(N)),k.length>0&&He(k,W,L),it.length>0&&He(it,W,L),ht.length>0&&He(ht,W,L),q.buffers.depth.setTest(!0),q.buffers.depth.setMask(!0),q.buffers.color.setMask(!0),q.setPolygonOffset(!1)}function rn(E,W,L,N){if((L.isScene===!0?L.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[N.id]===void 0&&(p.state.transmissionRenderTarget[N.id]=new Ei(1,1,{generateMipmaps:!0,type:Pt.has("EXT_color_buffer_half_float")||Pt.has("EXT_color_buffer_float")?Us:Vn,minFilter:Mi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ee.workingColorSpace}));const it=p.state.transmissionRenderTarget[N.id],ht=N.viewport||D;it.setSize(ht.z,ht.w);const _t=S.getRenderTarget();S.setRenderTarget(it),S.getClearColor(X),P=S.getClearAlpha(),P<1&&S.setClearColor(16777215,.5),S.clear(),Et&&I.render(L);const At=S.toneMapping;S.toneMapping=ti;const Bt=N.viewport;if(N.viewport!==void 0&&(N.viewport=void 0),p.setupLightsView(N),tt===!0&&mt.setGlobalState(S.clippingPlanes,N),He(E,L,N),w.updateMultisampleRenderTarget(it),w.updateRenderTargetMipmap(it),Pt.has("WEBGL_multisampled_render_to_texture")===!1){let Ot=!1;for(let Mt=0,kt=W.length;Mt<kt;Mt++){const $t=W[Mt],Jt=$t.object,ye=$t.geometry,Kt=$t.material,zt=$t.group;if(Kt.side===ze&&Jt.layers.test(N.layers)){const Ge=Kt.side;Kt.side=We,Kt.needsUpdate=!0,on(Jt,L,N,ye,Kt,zt),Kt.side=Ge,Kt.needsUpdate=!0,Ot=!0}}Ot===!0&&(w.updateMultisampleRenderTarget(it),w.updateRenderTargetMipmap(it))}S.setRenderTarget(_t),S.setClearColor(X,P),Bt!==void 0&&(N.viewport=Bt),S.toneMapping=At}function He(E,W,L){const N=W.isScene===!0?W.overrideMaterial:null;for(let k=0,it=E.length;k<it;k++){const ht=E[k],_t=ht.object,At=ht.geometry,Bt=N===null?ht.material:N,Ot=ht.group;_t.layers.test(L.layers)&&on(_t,W,L,At,Bt,Ot)}}function on(E,W,L,N,k,it){E.onBeforeRender(S,W,L,N,k,it),E.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),k.onBeforeRender(S,W,L,N,E,it),k.transparent===!0&&k.side===ze&&k.forceSinglePass===!1?(k.side=We,k.needsUpdate=!0,S.renderBufferDirect(L,W,N,k,E,it),k.side=ni,k.needsUpdate=!0,S.renderBufferDirect(L,W,N,k,E,it),k.side=ze):S.renderBufferDirect(L,W,N,k,E,it),E.onAfterRender(S,W,L,N,k,it)}function Ye(E,W,L){W.isScene!==!0&&(W=Nt);const N=dt.get(E),k=p.state.lights,it=p.state.shadowsArray,ht=k.state.version,_t=lt.getParameters(E,k.state,it,W,L),At=lt.getProgramCacheKey(_t);let Bt=N.programs;N.environment=E.isMeshStandardMaterial?W.environment:null,N.fog=W.fog,N.envMap=(E.isMeshStandardMaterial?G:M).get(E.envMap||N.environment),N.envMapRotation=N.environment!==null&&E.envMap===null?W.environmentRotation:E.envMapRotation,Bt===void 0&&(E.addEventListener("dispose",Ht),Bt=new Map,N.programs=Bt);let Ot=Bt.get(At);if(Ot!==void 0){if(N.currentProgram===Ot&&N.lightsStateVersion===ht)return Dn(E,_t),Ot}else _t.uniforms=lt.getUniforms(E),E.onBeforeCompile(_t,S),Ot=lt.acquireProgram(_t,At),Bt.set(At,Ot),N.uniforms=_t.uniforms;const Mt=N.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Mt.clippingPlanes=mt.uniform),Dn(E,_t),N.needsLights=me(E),N.lightsStateVersion=ht,N.needsLights&&(Mt.ambientLightColor.value=k.state.ambient,Mt.lightProbe.value=k.state.probe,Mt.directionalLights.value=k.state.directional,Mt.directionalLightShadows.value=k.state.directionalShadow,Mt.spotLights.value=k.state.spot,Mt.spotLightShadows.value=k.state.spotShadow,Mt.rectAreaLights.value=k.state.rectArea,Mt.ltc_1.value=k.state.rectAreaLTC1,Mt.ltc_2.value=k.state.rectAreaLTC2,Mt.pointLights.value=k.state.point,Mt.pointLightShadows.value=k.state.pointShadow,Mt.hemisphereLights.value=k.state.hemi,Mt.directionalShadowMap.value=k.state.directionalShadowMap,Mt.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Mt.spotShadowMap.value=k.state.spotShadowMap,Mt.spotLightMatrix.value=k.state.spotLightMatrix,Mt.spotLightMap.value=k.state.spotLightMap,Mt.pointShadowMap.value=k.state.pointShadowMap,Mt.pointShadowMatrix.value=k.state.pointShadowMatrix),N.currentProgram=Ot,N.uniformsList=null,Ot}function cn(E){if(E.uniformsList===null){const W=E.currentProgram.getUniforms();E.uniformsList=Ta.seqWithValue(W.seq,E.uniforms)}return E.uniformsList}function Dn(E,W){const L=dt.get(E);L.outputColorSpace=W.outputColorSpace,L.batching=W.batching,L.batchingColor=W.batchingColor,L.instancing=W.instancing,L.instancingColor=W.instancingColor,L.instancingMorph=W.instancingMorph,L.skinning=W.skinning,L.morphTargets=W.morphTargets,L.morphNormals=W.morphNormals,L.morphColors=W.morphColors,L.morphTargetsCount=W.morphTargetsCount,L.numClippingPlanes=W.numClippingPlanes,L.numIntersection=W.numClipIntersection,L.vertexAlphas=W.vertexAlphas,L.vertexTangents=W.vertexTangents,L.toneMapping=W.toneMapping}function Ke(E,W,L,N,k){W.isScene!==!0&&(W=Nt),w.resetTextureUnits();const it=W.fog,ht=N.isMeshStandardMaterial?W.environment:null,_t=T===null?S.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:cs,At=(N.isMeshStandardMaterial?G:M).get(N.envMap||ht),Bt=N.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,Ot=!!L.attributes.tangent&&(!!N.normalMap||N.anisotropy>0),Mt=!!L.morphAttributes.position,kt=!!L.morphAttributes.normal,$t=!!L.morphAttributes.color;let Jt=ti;N.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(Jt=S.toneMapping);const ye=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,Kt=ye!==void 0?ye.length:0,zt=dt.get(N),Ge=p.state.lights;if(tt===!0&&(gt===!0||E!==y)){const Ue=E===y&&N.id===b;mt.setState(N,E,Ue)}let Qt=!1;N.version===zt.__version?(zt.needsLights&&zt.lightsStateVersion!==Ge.state.version||zt.outputColorSpace!==_t||k.isBatchedMesh&&zt.batching===!1||!k.isBatchedMesh&&zt.batching===!0||k.isBatchedMesh&&zt.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&zt.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&zt.instancing===!1||!k.isInstancedMesh&&zt.instancing===!0||k.isSkinnedMesh&&zt.skinning===!1||!k.isSkinnedMesh&&zt.skinning===!0||k.isInstancedMesh&&zt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&zt.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&zt.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&zt.instancingMorph===!1&&k.morphTexture!==null||zt.envMap!==At||N.fog===!0&&zt.fog!==it||zt.numClippingPlanes!==void 0&&(zt.numClippingPlanes!==mt.numPlanes||zt.numIntersection!==mt.numIntersection)||zt.vertexAlphas!==Bt||zt.vertexTangents!==Ot||zt.morphTargets!==Mt||zt.morphNormals!==kt||zt.morphColors!==$t||zt.toneMapping!==Jt||zt.morphTargetsCount!==Kt)&&(Qt=!0):(Qt=!0,zt.__version=N.version);let De=zt.currentProgram;Qt===!0&&(De=Ye(N,W,k));let xn=!1,ge=!1,si=!1;const ce=De.getUniforms(),Je=zt.uniforms;if(q.useProgram(De.program)&&(xn=!0,ge=!0,si=!0),N.id!==b&&(b=N.id,ge=!0),xn||y!==E){q.buffers.depth.getReversed()?(j.copy(E.projectionMatrix),lm(j),dm(j),ce.setValue(O,"projectionMatrix",j)):ce.setValue(O,"projectionMatrix",E.projectionMatrix),ce.setValue(O,"viewMatrix",E.matrixWorldInverse);const vn=ce.map.cameraPosition;vn!==void 0&&vn.setValue(O,Dt.setFromMatrixPosition(E.matrixWorld)),It.logarithmicDepthBuffer&&ce.setValue(O,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(N.isMeshPhongMaterial||N.isMeshToonMaterial||N.isMeshLambertMaterial||N.isMeshBasicMaterial||N.isMeshStandardMaterial||N.isShaderMaterial)&&ce.setValue(O,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,ge=!0,si=!0)}if(k.isSkinnedMesh){ce.setOptional(O,k,"bindMatrix"),ce.setOptional(O,k,"bindMatrixInverse");const Ue=k.skeleton;Ue&&(Ue.boneTexture===null&&Ue.computeBoneTexture(),ce.setValue(O,"boneTexture",Ue.boneTexture,w))}k.isBatchedMesh&&(ce.setOptional(O,k,"batchingTexture"),ce.setValue(O,"batchingTexture",k._matricesTexture,w),ce.setOptional(O,k,"batchingIdTexture"),ce.setValue(O,"batchingIdTexture",k._indirectTexture,w),ce.setOptional(O,k,"batchingColorTexture"),k._colorsTexture!==null&&ce.setValue(O,"batchingColorTexture",k._colorsTexture,w));const Xn=L.morphAttributes;if((Xn.position!==void 0||Xn.normal!==void 0||Xn.color!==void 0)&&Q.update(k,L,De),(ge||zt.receiveShadow!==k.receiveShadow)&&(zt.receiveShadow=k.receiveShadow,ce.setValue(O,"receiveShadow",k.receiveShadow)),N.isMeshGouraudMaterial&&N.envMap!==null&&(Je.envMap.value=At,Je.flipEnvMap.value=At.isCubeTexture&&At.isRenderTargetTexture===!1?-1:1),N.isMeshStandardMaterial&&N.envMap===null&&W.environment!==null&&(Je.envMapIntensity.value=W.environmentIntensity),ge&&(ce.setValue(O,"toneMappingExposure",S.toneMappingExposure),zt.needsLights&&Ti(Je,si),it&&N.fog===!0&&ut.refreshFogUniforms(Je,it),ut.refreshMaterialUniforms(Je,N,B,V,p.state.transmissionRenderTarget[E.id]),Ta.upload(O,cn(zt),Je,w)),N.isShaderMaterial&&N.uniformsNeedUpdate===!0&&(Ta.upload(O,cn(zt),Je,w),N.uniformsNeedUpdate=!1),N.isSpriteMaterial&&ce.setValue(O,"center",k.center),ce.setValue(O,"modelViewMatrix",k.modelViewMatrix),ce.setValue(O,"normalMatrix",k.normalMatrix),ce.setValue(O,"modelMatrix",k.matrixWorld),N.isShaderMaterial||N.isRawShaderMaterial){const Ue=N.uniformsGroups;for(let vn=0,Mn=Ue.length;vn<Mn;vn++){const hs=Ue[vn];F.update(hs,De),F.bind(hs,De)}}return De}function Ti(E,W){E.ambientLightColor.needsUpdate=W,E.lightProbe.needsUpdate=W,E.directionalLights.needsUpdate=W,E.directionalLightShadows.needsUpdate=W,E.pointLights.needsUpdate=W,E.pointLightShadows.needsUpdate=W,E.spotLights.needsUpdate=W,E.spotLightShadows.needsUpdate=W,E.rectAreaLights.needsUpdate=W,E.hemisphereLights.needsUpdate=W}function me(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(E,W,L){dt.get(E.texture).__webglTexture=W,dt.get(E.depthTexture).__webglTexture=L;const N=dt.get(E);N.__hasExternalTextures=!0,N.__autoAllocateDepthBuffer=L===void 0,N.__autoAllocateDepthBuffer||Pt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),N.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,W){const L=dt.get(E);L.__webglFramebuffer=W,L.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(E,W=0,L=0){T=E,C=W,A=L;let N=!0,k=null,it=!1,ht=!1;if(E){const At=dt.get(E);if(At.__useDefaultFramebuffer!==void 0)q.bindFramebuffer(O.FRAMEBUFFER,null),N=!1;else if(At.__webglFramebuffer===void 0)w.setupRenderTarget(E);else if(At.__hasExternalTextures)w.rebindTextures(E,dt.get(E.texture).__webglTexture,dt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Mt=E.depthTexture;if(At.__boundDepthTexture!==Mt){if(Mt!==null&&dt.has(Mt)&&(E.width!==Mt.image.width||E.height!==Mt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(E)}}const Bt=E.texture;(Bt.isData3DTexture||Bt.isDataArrayTexture||Bt.isCompressedArrayTexture)&&(ht=!0);const Ot=dt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ot[W])?k=Ot[W][L]:k=Ot[W],it=!0):E.samples>0&&w.useMultisampledRTT(E)===!1?k=dt.get(E).__webglMultisampledFramebuffer:Array.isArray(Ot)?k=Ot[L]:k=Ot,D.copy(E.viewport),H.copy(E.scissor),z=E.scissorTest}else D.copy(rt).multiplyScalar(B).floor(),H.copy(ft).multiplyScalar(B).floor(),z=vt;if(q.bindFramebuffer(O.FRAMEBUFFER,k)&&N&&q.drawBuffers(E,k),q.viewport(D),q.scissor(H),q.setScissorTest(z),it){const At=dt.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+W,At.__webglTexture,L)}else if(ht){const At=dt.get(E.texture),Bt=W||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,At.__webglTexture,L||0,Bt)}b=-1},this.readRenderTargetPixels=function(E,W,L,N,k,it,ht){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _t=dt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ht!==void 0&&(_t=_t[ht]),_t){q.bindFramebuffer(O.FRAMEBUFFER,_t);try{const At=E.texture,Bt=At.format,Ot=At.type;if(!It.textureFormatReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!It.textureTypeReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=E.width-N&&L>=0&&L<=E.height-k&&O.readPixels(W,L,N,k,Ut.convert(Bt),Ut.convert(Ot),it)}finally{const At=T!==null?dt.get(T).__webglFramebuffer:null;q.bindFramebuffer(O.FRAMEBUFFER,At)}}},this.readRenderTargetPixelsAsync=async function(E,W,L,N,k,it,ht){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _t=dt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ht!==void 0&&(_t=_t[ht]),_t){const At=E.texture,Bt=At.format,Ot=At.type;if(!It.textureFormatReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!It.textureTypeReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(W>=0&&W<=E.width-N&&L>=0&&L<=E.height-k){q.bindFramebuffer(O.FRAMEBUFFER,_t);const Mt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Mt),O.bufferData(O.PIXEL_PACK_BUFFER,it.byteLength,O.STREAM_READ),O.readPixels(W,L,N,k,Ut.convert(Bt),Ut.convert(Ot),0);const kt=T!==null?dt.get(T).__webglFramebuffer:null;q.bindFramebuffer(O.FRAMEBUFFER,kt);const $t=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await cm(O,$t,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Mt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,it),O.deleteBuffer(Mt),O.deleteSync($t),it}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,W=null,L=0){E.isTexture!==!0&&(Ts("WebGLRenderer: copyFramebufferToTexture function signature has changed."),W=arguments[0]||null,E=arguments[1]);const N=Math.pow(2,-L),k=Math.floor(E.image.width*N),it=Math.floor(E.image.height*N),ht=W!==null?W.x:0,_t=W!==null?W.y:0;w.setTexture2D(E,0),O.copyTexSubImage2D(O.TEXTURE_2D,L,0,0,ht,_t,k,it),q.unbindTexture()},this.copyTextureToTexture=function(E,W,L=null,N=null,k=0){E.isTexture!==!0&&(Ts("WebGLRenderer: copyTextureToTexture function signature has changed."),N=arguments[0]||null,E=arguments[1],W=arguments[2],k=arguments[3]||0,L=null);let it,ht,_t,At,Bt,Ot,Mt,kt,$t;const Jt=E.isCompressedTexture?E.mipmaps[k]:E.image;L!==null?(it=L.max.x-L.min.x,ht=L.max.y-L.min.y,_t=L.isBox3?L.max.z-L.min.z:1,At=L.min.x,Bt=L.min.y,Ot=L.isBox3?L.min.z:0):(it=Jt.width,ht=Jt.height,_t=Jt.depth||1,At=0,Bt=0,Ot=0),N!==null?(Mt=N.x,kt=N.y,$t=N.z):(Mt=0,kt=0,$t=0);const ye=Ut.convert(W.format),Kt=Ut.convert(W.type);let zt;W.isData3DTexture?(w.setTexture3D(W,0),zt=O.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(w.setTexture2DArray(W,0),zt=O.TEXTURE_2D_ARRAY):(w.setTexture2D(W,0),zt=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,W.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,W.unpackAlignment);const Ge=O.getParameter(O.UNPACK_ROW_LENGTH),Qt=O.getParameter(O.UNPACK_IMAGE_HEIGHT),De=O.getParameter(O.UNPACK_SKIP_PIXELS),xn=O.getParameter(O.UNPACK_SKIP_ROWS),ge=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,Jt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Jt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,At),O.pixelStorei(O.UNPACK_SKIP_ROWS,Bt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Ot);const si=E.isDataArrayTexture||E.isData3DTexture,ce=W.isDataArrayTexture||W.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const Je=dt.get(E),Xn=dt.get(W),Ue=dt.get(Je.__renderTarget),vn=dt.get(Xn.__renderTarget);q.bindFramebuffer(O.READ_FRAMEBUFFER,Ue.__webglFramebuffer),q.bindFramebuffer(O.DRAW_FRAMEBUFFER,vn.__webglFramebuffer);for(let Mn=0;Mn<_t;Mn++)si&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,dt.get(E).__webglTexture,k,Ot+Mn),E.isDepthTexture?(ce&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,dt.get(W).__webglTexture,k,$t+Mn),O.blitFramebuffer(At,Bt,it,ht,Mt,kt,it,ht,O.DEPTH_BUFFER_BIT,O.NEAREST)):ce?O.copyTexSubImage3D(zt,k,Mt,kt,$t+Mn,At,Bt,it,ht):O.copyTexSubImage2D(zt,k,Mt,kt,$t+Mn,At,Bt,it,ht);q.bindFramebuffer(O.READ_FRAMEBUFFER,null),q.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else ce?E.isDataTexture||E.isData3DTexture?O.texSubImage3D(zt,k,Mt,kt,$t,it,ht,_t,ye,Kt,Jt.data):W.isCompressedArrayTexture?O.compressedTexSubImage3D(zt,k,Mt,kt,$t,it,ht,_t,ye,Jt.data):O.texSubImage3D(zt,k,Mt,kt,$t,it,ht,_t,ye,Kt,Jt):E.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,k,Mt,kt,it,ht,ye,Kt,Jt.data):E.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,k,Mt,kt,Jt.width,Jt.height,ye,Jt.data):O.texSubImage2D(O.TEXTURE_2D,k,Mt,kt,it,ht,ye,Kt,Jt);O.pixelStorei(O.UNPACK_ROW_LENGTH,Ge),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Qt),O.pixelStorei(O.UNPACK_SKIP_PIXELS,De),O.pixelStorei(O.UNPACK_SKIP_ROWS,xn),O.pixelStorei(O.UNPACK_SKIP_IMAGES,ge),k===0&&W.generateMipmaps&&O.generateMipmap(zt),q.unbindTexture()},this.copyTextureToTexture3D=function(E,W,L=null,N=null,k=0){return E.isTexture!==!0&&(Ts("WebGLRenderer: copyTextureToTexture3D function signature has changed."),L=arguments[0]||null,N=arguments[1]||null,E=arguments[2],W=arguments[3],k=arguments[4]||0),Ts('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,W,L,N,k)},this.initRenderTarget=function(E){dt.get(E).__webglFramebuffer===void 0&&w.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?w.setTextureCube(E,0):E.isData3DTexture?w.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?w.setTexture2DArray(E,0):w.setTexture2D(E,0),q.unbindTexture()},this.resetState=function(){C=0,A=0,T=null,q.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Hn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ee._getDrawingBufferColorSpace(t),e.unpackColorSpace=ee._getUnpackColorSpace()}}class Mv extends xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Rn,this.environmentIntensity=1,this.environmentRotation=new Rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class yv{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=jo,this.updateRanges=[],this.version=0,this.uuid=ei()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Fe=new Y;class Oa{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix4(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Fe.fromBufferAttribute(this,e),Fe.applyNormalMatrix(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Fe.fromBufferAttribute(this,e),Fe.transformDirection(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=wn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=re(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=wn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=wn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=wn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=wn(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),i=re(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),i=re(i,this.array),s=re(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),i=re(i,this.array),s=re(s,this.array),a=re(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new _n(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Oa(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class lh extends wi{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Wt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Yi;const ys=new Y,Zi=new Y,qi=new Y,ji=new Yt,Ss=new Yt,dh=new ue,da=new Y,bs=new Y,ha=new Y,sd=new Yt,Gr=new Yt,ad=new Yt;class Sv extends xe{constructor(t=new lh){if(super(),this.isSprite=!0,this.type="Sprite",Yi===void 0){Yi=new $e;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new yv(e,5);Yi.setIndex([0,1,2,0,2,3]),Yi.setAttribute("position",new Oa(i,3,0,!1)),Yi.setAttribute("uv",new Oa(i,2,3,!1))}this.geometry=Yi,this.material=t,this.center=new Yt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Zi.setFromMatrixScale(this.matrixWorld),dh.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),qi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Zi.multiplyScalar(-qi.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const r=this.center;ua(da.set(-.5,-.5,0),qi,r,Zi,s,a),ua(bs.set(.5,-.5,0),qi,r,Zi,s,a),ua(ha.set(.5,.5,0),qi,r,Zi,s,a),sd.set(0,0),Gr.set(1,0),ad.set(1,1);let o=t.ray.intersectTriangle(da,bs,ha,!1,ys);if(o===null&&(ua(bs.set(-.5,.5,0),qi,r,Zi,s,a),Gr.set(0,1),o=t.ray.intersectTriangle(da,ha,bs,!1,ys),o===null))return;const c=t.ray.origin.distanceTo(ys);c<t.near||c>t.far||e.push({distance:c,point:ys.clone(),uv:je.getInterpolation(ys,da,bs,ha,sd,Gr,ad,new Yt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function ua(n,t,e,i,s,a){ji.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(Ss.x=a*ji.x-s*ji.y,Ss.y=s*ji.x+a*ji.y):Ss.copy(ji),n.copy(t),n.x+=Ss.x,n.y+=Ss.y,n.applyMatrix4(dh)}class Sc extends wi{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Wt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ba=new Y,Ha=new Y,rd=new ue,Es=new xc,fa=new Wa,Vr=new Y,od=new Y;class bv extends xe{constructor(t=new $e,e=new Sc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,a=e.count;s<a;s++)Ba.fromBufferAttribute(e,s-1),Ha.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=Ba.distanceTo(Ha);t.setAttribute("lineDistance",new ve(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),fa.copy(i.boundingSphere),fa.applyMatrix4(s),fa.radius+=a,t.ray.intersectsSphere(fa)===!1)return;rd.copy(s).invert(),Es.copy(t.ray).applyMatrix4(rd);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const u=Math.max(0,r.start),g=Math.min(d.count,r.start+r.count);for(let _=u,m=g-1;_<m;_+=l){const p=d.getX(_),x=d.getX(_+1),v=pa(this,t,Es,c,p,x);v&&e.push(v)}if(this.isLineLoop){const _=d.getX(g-1),m=d.getX(u),p=pa(this,t,Es,c,_,m);p&&e.push(p)}}else{const u=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let _=u,m=g-1;_<m;_+=l){const p=pa(this,t,Es,c,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=pa(this,t,Es,c,g-1,u);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function pa(n,t,e,i,s,a){const r=n.geometry.attributes.position;if(Ba.fromBufferAttribute(r,s),Ha.fromBufferAttribute(r,a),e.distanceSqToSegment(Ba,Ha,Vr,od)>i)return;Vr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Vr);if(!(c<t.near||c>t.far))return{distance:c,point:od.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}const cd=new Y,ld=new Y;class hh extends bv{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,a=e.count;s<a;s+=2)cd.fromBufferAttribute(e,s),ld.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+cd.distanceTo(ld);t.setAttribute("lineDistance",new ve(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ev extends Be{constructor(t,e,i,s,a,r,o,c,l){super(t,e,i,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class bc extends $e{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const a=[],r=[];o(s),l(i),d(),this.setAttribute("position",new ve(a,3)),this.setAttribute("normal",new ve(a.slice(),3)),this.setAttribute("uv",new ve(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const v=new Y,S=new Y,U=new Y;for(let C=0;C<e.length;C+=3)u(e[C+0],v),u(e[C+1],S),u(e[C+2],U),c(v,S,U,x)}function c(x,v,S,U){const C=U+1,A=[];for(let T=0;T<=C;T++){A[T]=[];const b=x.clone().lerp(S,T/C),y=v.clone().lerp(S,T/C),D=C-T;for(let H=0;H<=D;H++)H===0&&T===C?A[T][H]=b:A[T][H]=b.clone().lerp(y,H/D)}for(let T=0;T<C;T++)for(let b=0;b<2*(C-T)-1;b++){const y=Math.floor(b/2);b%2===0?(h(A[T][y+1]),h(A[T+1][y]),h(A[T][y])):(h(A[T][y+1]),h(A[T+1][y+1]),h(A[T+1][y]))}}function l(x){const v=new Y;for(let S=0;S<a.length;S+=3)v.x=a[S+0],v.y=a[S+1],v.z=a[S+2],v.normalize().multiplyScalar(x),a[S+0]=v.x,a[S+1]=v.y,a[S+2]=v.z}function d(){const x=new Y;for(let v=0;v<a.length;v+=3){x.x=a[v+0],x.y=a[v+1],x.z=a[v+2];const S=m(x)/2/Math.PI+.5,U=p(x)/Math.PI+.5;r.push(S,1-U)}g(),f()}function f(){for(let x=0;x<r.length;x+=6){const v=r[x+0],S=r[x+2],U=r[x+4],C=Math.max(v,S,U),A=Math.min(v,S,U);C>.9&&A<.1&&(v<.2&&(r[x+0]+=1),S<.2&&(r[x+2]+=1),U<.2&&(r[x+4]+=1))}}function h(x){a.push(x.x,x.y,x.z)}function u(x,v){const S=x*3;v.x=t[S+0],v.y=t[S+1],v.z=t[S+2]}function g(){const x=new Y,v=new Y,S=new Y,U=new Y,C=new Yt,A=new Yt,T=new Yt;for(let b=0,y=0;b<a.length;b+=9,y+=6){x.set(a[b+0],a[b+1],a[b+2]),v.set(a[b+3],a[b+4],a[b+5]),S.set(a[b+6],a[b+7],a[b+8]),C.set(r[y+0],r[y+1]),A.set(r[y+2],r[y+3]),T.set(r[y+4],r[y+5]),U.copy(x).add(v).add(S).divideScalar(3);const D=m(U);_(C,y+0,x,D),_(A,y+2,v,D),_(T,y+4,S,D)}}function _(x,v,S,U){U<0&&x.x===1&&(r[v]=x.x-1),S.x===0&&S.z===0&&(r[v]=U/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bc(t.vertices,t.indices,t.radius,t.details)}}const ma=new Y,ga=new Y,Xr=new Y,_a=new je;class wv extends $e{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(wa*e),r=t.getIndex(),o=t.getAttribute("position"),c=r?r.count:o.count,l=[0,0,0],d=["a","b","c"],f=new Array(3),h={},u=[];for(let g=0;g<c;g+=3){r?(l[0]=r.getX(g),l[1]=r.getX(g+1),l[2]=r.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:p}=_a;if(_.fromBufferAttribute(o,l[0]),m.fromBufferAttribute(o,l[1]),p.fromBufferAttribute(o,l[2]),_a.getNormal(Xr),f[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,f[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,f[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const v=(x+1)%3,S=f[x],U=f[v],C=_a[d[x]],A=_a[d[v]],T=`${S}_${U}`,b=`${U}_${S}`;b in h&&h[b]?(Xr.dot(h[b].normal)<=a&&(u.push(C.x,C.y,C.z),u.push(A.x,A.y,A.z)),h[b]=null):T in h||(h[T]={index0:l[x],index1:l[v],normal:Xr.clone()})}}for(const g in h)if(h[g]){const{index0:_,index1:m}=h[g];ma.fromBufferAttribute(o,_),ga.fromBufferAttribute(o,m),u.push(ma.x,ma.y,ma.z),u.push(ga.x,ga.y,ga.z)}this.setAttribute("position",new ve(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Ec extends bc{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ec(t.radius,t.detail)}}class Ji extends $e{constructor(t=.5,e=1,i=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:r},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],l=[],d=[];let f=t;const h=(e-t)/s,u=new Y,g=new Yt;for(let _=0;_<=s;_++){for(let m=0;m<=i;m++){const p=a+m/i*r;u.x=f*Math.cos(p),u.y=f*Math.sin(p),c.push(u.x,u.y,u.z),l.push(0,0,1),g.x=(u.x/e+1)/2,g.y=(u.y/e+1)/2,d.push(g.x,g.y)}f+=h}for(let _=0;_<s;_++){const m=_*(i+1);for(let p=0;p<i;p++){const x=p+m,v=x,S=x+i+1,U=x+i+2,C=x+1;o.push(v,S,C),o.push(S,U,C)}}this.setIndex(o),this.setAttribute("position",new ve(c,3)),this.setAttribute("normal",new ve(l,3)),this.setAttribute("uv",new ve(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ji(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Za extends $e{constructor(t=1,e=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],o=[],c=[],l=[],d=new Y,f=new Y,h=new Y;for(let u=0;u<=i;u++)for(let g=0;g<=s;g++){const _=g/s*a,m=u/i*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(_),f.y=(t+e*Math.cos(m))*Math.sin(_),f.z=e*Math.sin(m),o.push(f.x,f.y,f.z),d.x=t*Math.cos(_),d.y=t*Math.sin(_),h.subVectors(f,d).normalize(),c.push(h.x,h.y,h.z),l.push(g/s),l.push(u/i)}for(let u=1;u<=i;u++)for(let g=1;g<=s;g++){const _=(s+1)*u+g-1,m=(s+1)*(u-1)+g-1,p=(s+1)*(u-1)+g,x=(s+1)*u+g;r.push(_,m,x),r.push(m,p,x)}this.setIndex(r),this.setAttribute("position",new ve(o,3)),this.setAttribute("normal",new ve(c,3)),this.setAttribute("uv",new ve(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Za(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ks extends wi{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Wd,this.normalScale=new Yt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=hc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class uh extends xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Wt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Tv extends uh{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Wt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Wr=new ue,dd=new Y,hd=new Y;class Av{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Yt(512,512),this.map=null,this.mapPass=null,this.matrix=new ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Mc,this._frameExtents=new Yt(1,1),this._viewportCount=1,this._viewports=[new _e(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;dd.setFromMatrixPosition(t.matrixWorld),e.position.copy(dd),hd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(hd),e.updateMatrixWorld(),Wr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wr),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Wr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Rv extends Av{constructor(){super(new ih(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Cv extends uh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.target=new xe,this.shadow=new Rv}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const ud=new ue;class Pv{constructor(t,e,i=0,s=1/0){this.ray=new xc(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new vc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return ud.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ud),this}intersectObject(t,e=!0,i=[]){return Qo(t,this,i,e),i.sort(fd),i}intersectObjects(t,e=!0,i=[]){for(let s=0,a=t.length;s<a;s++)Qo(t[s],this,i,e);return i.sort(fd),i}}function fd(n,t){return n.distance-t.distance}function Qo(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,o=a.length;r<o;r++)Qo(a[r],t,e,!0)}}class Dv extends hh{constructor(t=10,e=10,i=4473924,s=8947848){i=new Wt(i),s=new Wt(s);const a=e/2,r=t/e,o=t/2,c=[],l=[];for(let h=0,u=0,g=-o;h<=e;h++,g+=r){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);const _=h===a?i:s;_.toArray(l,u),u+=3,_.toArray(l,u),u+=3,_.toArray(l,u),u+=3,_.toArray(l,u),u+=3}const d=new $e;d.setAttribute("position",new ve(c,3)),d.setAttribute("color",new ve(l,3));const f=new Sc({vertexColors:!0,toneMapped:!1});super(d,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:dc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=dc);const Lv={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function Iv(n,t,e,i){const s=new nn(n.fov,i,.1,200),a=new Y,r=new Y,o=new Y;let c=!1,l=n.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function h(){const u=(n.pitchDeg+d.pitchDelta)*Math.PI/180,g=n.yawDeg*Math.PI/180;o.set(Math.sin(g)*Math.cos(u),Math.sin(u),Math.cos(g)*Math.cos(u)).multiplyScalar(n.distance*d.distanceScale*d.zoom)}return h(),{camera:s,update(u,g,_,m,p=Lv){const x=g+.6;if(!c)a.set(u,x,_),c=!0;else{const U=1-Math.exp(-Math.max(n.smoothing,.001)*m);a.x+=(u-a.x)*U,a.y+=(x-a.y)*U,a.z+=(_-a.z)*U}const v=1-Math.exp(-Math.max(t.smoothing,.001)*m);d.distanceScale+=(p.distanceScale-d.distanceScale)*v,d.offsetX+=(p.offsetX-d.offsetX)*v,d.offsetZ+=(p.offsetZ-d.offsetZ)*v,d.pitchDelta+=(p.pitchDelta-d.pitchDelta)*v;const S=1-Math.exp(-Math.max(e.smoothing,.001)*m);d.zoom+=(f-d.zoom)*S,h(),(s.fov!==l||s.fov!==n.fov)&&(s.fov=n.fov,l=n.fov,s.updateProjectionMatrix()),r.set(a.x+d.offsetX,a.y,a.z+d.offsetZ),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},resize(u){s.aspect=u,s.updateProjectionMatrix()},getGroundBasis(){const u=new Y().setFromMatrixColumn(s.matrixWorld,0),g=new Y().setFromMatrixColumn(s.matrixWorld,2).negate(),_=Math.hypot(u.x,u.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:u.x/_,rightZ:u.z/_,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...d}}}}const yi=Math.PI*2,pn=1e-6;function Pn(n,t,e){return n<t?t:n>e?e:n}function fh(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function kv(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function ph(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const s=kv(n);return i===1?s:e+(s-e)*i}function pd(n){return(1-Math.sin(n))/2}function wc(n,t){if(!n.grounded||n.speed<pn)return fh();const e=n.speed/Math.max(n.moveSpeed,pn),i=Math.max(n.legLength,pn),s=n.stride>pn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,a=Math.min(t.maxAmp,s/i),r=i*Math.sin(Math.min(t.maxAmp,1.25)),o=Math.abs(n.localForward),c=Math.abs(n.localRight),l=o+c+pn,d=o/l,f=c/l,h=n.localForward>=0?1:-1,u=n.localRight>=0?1:-1,g=s,_=z=>Math.asin(Pn(z,-r,r)/i);function m(z,X){const P=ph(z,t.plantLock),R=pd(z),V=h*d*g*P,B=-_(V),Z=X*u>0?1:-1,J=1+Z*t.crossStep*.45,rt=u*Z*t.crossStep*g*.4*R,ft=u*f*g*t.sideWeight*J*P+rt*f,vt=_(ft),$=t.kneeLift*R*a*(.55+.25*d+(Z>0?.2*f:0));return{pitchX:B,rollZ:vt,kneeX:$}}const p=(n.phase%yi+yi)%yi,x=m(p,-1),v=m((p+Math.PI)%yi,1),S=Math.cos(p),U=pd(p),C=-t.comSway*a*S*(.6*d+.8*f)-u*t.comSway*a*f*.45,A=t.comBob*U*a,T=u*t.hipLean*a*f*S*.6,b=u*t.hipLean*a*f*(.45+.25*S),y=t.armSwing*a*S*(d*h+.3*f),D=y,H=-y;return{legL:x,legR:v,pelvisX:C,pelvisY:A,pelvisRoll:T,sideLean:b,armL:D,armR:H,strafe:f,backward:h<0?d:0}}function mh(n){const t=(n%yi+yi)%yi,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function gh(n,t,e){const i=Pn(e.progress,0,1);if(i>=1||n.speed<pn)return fh();const s=i*i*(3-2*i),a=1-s;return wc({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:n.speed*a,stride:n.stride*a},t)}function _h(n,t,e,i){const s=Pn(n,-1,1),a=Math.abs(s),r=Math.min(1,t*(1+Math.max(0,i)*a*a));return Pn(r*s,-1,1)*(e*Math.PI/180)}function xh(n,t,e,i,s){const a=Math.max(e,pn),r=Math.max(0,i)*a,o=Math.max(0,s)*a,c=t>pn?(t-n)/t:0,l=c>.02,d=c<-.015,f=n<=r*.15,h=!d&&n<o&&(l||f);return{enter:n>pn&&n<=r&&l,resume:!h}}function vh(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Pn(n*Pn(t,0,2),-i,i)}function Mh(n,t,e){const i=Math.sin(n),s=Math.cos(n),a=Math.cos(n),r=-Math.sin(n);return{forward:t*i+e*s,right:t*a+e*r}}function yh(n,t,e){const i=Pn(n,0,1),s=i*i*(3-2*i);return e?t==="inStop"?1-s:1:t==="afterStop"?1-s:0}function Uv(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const s=Pn(n,0,1),a=Math.sin(Math.PI*s),r=a*a;if(r<=1e-9)return i();const o=t>=0,c=o?1:.35,l=o?.35:1,d=Math.max(0,e.turnStepPitch)*r,f=Math.max(0,e.turnStepKnee)*r,h=Math.max(0,e.turnStepPitch)*.35*r,u=o?1:-1;return{legL:{pitchX:-d*c,rollZ:u*h*c,kneeX:f*c},legR:{pitchX:-d*l,rollZ:-u*h*l,kneeX:f*l},pelvisY:-Math.max(0,e.turnStepDip)*r,env:r}}function Sh(n,t,e,i,s){const a=Pn(n,0,1),r=Pn(s.stopPeakRatio,.05,.95),o=a<=r?a/r:(a-r)/(1-r),c=o*o*(3-2*o),l=a<=r?c:1-c,d=Math.hypot(e,i),f=d>pn?e/d:1,h=d>pn?i/d:0,u=ph(t,1)>0;return{leadPitch:Math.max(0,s.stopStepPitch)*l,trailPitch:Math.max(0,s.stopTrailPitch)*l,leadKnee:Math.max(0,s.stopStepKnee)*l,bodyShift:Math.max(0,s.stopBodyShift)*l,bodyDip:Math.max(0,s.stopBodyDip)*l,chestPitch:Math.max(0,s.stopChestPitch)*l,leadLeft:u,fwdN:f,rightN:h,env:l}}function Oe(n){return n<0?0:n>1?1:n}const Aa=Math.PI*2;function Fv(n){return((n+Math.PI)%Aa+Aa)%Aa-Math.PI}function Nv(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function zv(n,t,e,i,s,a=n.phase){const r=Oe(i);if(r<=0)return n;const o=Oe(t),c=Math.max(1,Math.round(s.cycles)),l=Math.max(0,s.strideSpeed),d=e%2===0?1:-1,f=Oe(s.forwardBias),h=Math.max(0,n.stride??0),u=Math.max(0,s.strideScale??0)*h,g=o<=.5?o*2:(o-.5)*2,_=g*g*(3-2*g),m=o<=.5?_:1-_,p={speed:l,phase:a+Aa*c/2*m,localForward:l*f,localRight:l*(1-f)*d},x=Fv(p.phase-n.phase),v=r*r*(3-2*r);return{speed:n.speed+(p.speed-n.speed)*r,phase:n.phase+x*v,localForward:n.localForward+(p.localForward-n.localForward)*r,localRight:n.localRight+(p.localRight-n.localRight)*r,stride:u*r*r}}function Ov(n,t,e){const i=Nv(),s=Oe(n),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return i;const r=t%2===0?1:-1,o=r<0,c=r>0,l=e.stepPitch*a,d=e.stepKnee*a,f=e.stepSide*a;return i.legL.pitchX=o?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=o?d:d*.4,i.legR.kneeX=c?d:d*.4,i.legL.rollZ=-f*r,i.legR.rollZ=f*r,i.pelvisX=e.stepSway*a*r,i.pelvisY=-e.stepDip*a,i.pelvisRoll=f*.25*r,i}function bh(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function md(n,t,e,i,s){if(e<=0||i<=0)return 0;const a=(n-t)/e;return a<0||a>=1?0:i*bh(a,s)}function Bv(n,t,e,i){const s=t?1:0,a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),r=n+(s-n)*a;return t&&r>.999?1:!t&&r<.001?0:r}function Hv(n,t,e){const i=Oe(n);return{gaitScale:1-i*(1-Oe(t)),attackLegWeight:Oe(e)*i}}function Gv(n,t){const e=Oe(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function Vv(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Oe(t.minScale+(1-t.minScale)*e)}function Xv(){return Eh()}function Eh(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function Wv(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function $v(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Oe(t.forceHitHeight):n.type==="light"?Oe(t.hitHeight.light):n.type==="heavy"?Oe(t.hitHeight.heavy):n.type==="knock"?Oe(t.hitHeight.knock):0}function Yv(n,t,e){const i=Oe(e),s=(a,r)=>a+(r-a)*i;return{upperPitch:s(n.upperPitch,t.upperPitch),upperRoll:s(n.upperRoll,t.upperRoll),upperYaw:s(n.upperYaw,t.upperYaw),fold:s(n.fold,t.fold),shift:s(n.shift,t.shift),drop:s(n.drop,t.drop),back:s(n.back,t.back),knee:s(n.knee,t.knee),hip:s(n.hip,t.hip),arm:s(n.arm,t.arm)}}function wh(n,t,e){const i=Eh(),s=Wv(n,e);if(i.intensity=s,s<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const a=Oe(1-n.timer/n.duration),r=bh(a,e.pulseRatio);i.pulse=r,i.active=r>0,i.hitHeight=$v(n,e);const o=Math.sin(t),c=Math.cos(t),l=Math.cos(t),d=-Math.sin(t),f=n.dirX*o+n.dirZ*c,h=n.dirX*l+n.dirZ*d;if(i.localFwd=f,i.localRight=h,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*a);return i.upperPitch=s*_*f,i.upperRoll=-s*_*h*.7,i.drop=(s>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const u=s*r,g=Yv(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(g.upperPitch*f+g.fold),i.upperRoll=-u*g.upperRoll*h,i.upperYaw=u*g.upperYaw*h,i.upperShift=u*g.shift,i.upperShiftX=i.upperShift*h,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*h,i.comZ=i.comShift*f,i.pelvisBack=u*g.back,i.drop=u*g.drop,i.knee=u*g.knee,i.hip=u*g.hip,i.arm=u*g.arm,i.flash=e.flashStrength*r,i}function Th(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),s=Number.isFinite(n.leanForward)?n.leanForward:0,a=Number.isFinite(n.leanSide)?n.leanSide:0,r=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*i,pelvisZ:s*i,crouch:Math.max(0,t.moveCrouch)*r}}const fi=1e-6;function Cs(n,t,e){return n<t?t:n>e?e:n}function Zv(n,t,e,i=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=fi||a<=fi||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const o=s+a,c=Math.abs(s-a)+fi,l=Math.hypot(n.x,n.y,n.z);if(l<=fi)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),h=n.z,u=Math.hypot(h,f),g=Cs(u,c,o),_=u>o+fi||u<c-fi,m=Math.atan2(-h,Math.max(f,fi)),p=Cs((s*s+g*g-a*a)/(2*s*g),-1,1),x=Cs((a*a+g*g-s*s)/(2*a*g),-1,1),v=Math.acos(p),S=Math.acos(x),U=i>=0?1:-1;return{rootPitch:m-U*v,rootRoll:d,jointPitch:U*(v+S),clamped:_,reach:l/o}}function qv(n,t,e,i){const s=Cs(e,0,1),a=Math.max(0,i),r=(o,c)=>{const l=Cs((c-o)*s,-a,a);return o+l};return{rootPitch:r(n.rootPitch,t.rootPitch),rootRoll:r(n.rootRoll,t.rootRoll),jointPitch:r(n.jointPitch,t.jointPitch)}}function Ah(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Tc={active:!1,weight:0,clamped:0,maxError:0};function Rh(n){const{root:t,pelvis:e,lower:i,limbs:s,base:a,cfg:r}=n;if(!r.enabled||r.weight<=0||!n.grounded||s.length===0)return{...Tc};const o={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,i.position.copy(a.lowerPos),i.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(u=>u.tip.getWorldPosition(new Y));e.position.copy(o.pelvisPos),e.rotation.x=o.pelvisRotX,e.rotation.z=o.pelvisRotZ,i.position.copy(o.lowerPos),i.rotation.z=o.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,r.weight))*(n.attacking?Math.max(0,Math.min(1,r.attackScale)):1),d=Math.max(0,r.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<s.length;u++){const g=s[u],_=i.worldToLocal(c[u].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},p=Zv(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(f+=1);const x=qv({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,l,d);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let h=0;for(let u=0;u<s.length;u++){const g=s[u].tip.getWorldPosition(new Y);h=Math.max(h,g.distanceTo(c[u]))}return{active:!0,weight:l,clamped:f,maxError:h}}function tn(n,t,e){return n<t?t:n>e?e:n}const gd={idle:"IDLE",wander:"WANDER",follow:"FOLLOW","keep-distance":"KEEP DIST",attack:"ATTACK"};function jv(n,t,e,i,s,a,r,o,c,l){const d=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Ae,h=new Ae;h.name="pelvis",h.position.y=n.legLength,f.add(h);const u=new Ae;u.name="lower";const g=new Ae;g.name="upper",h.add(u),h.add(g);const _=[],m=(I,Q,st,xt)=>{const Ut=new ks({color:xt}),Lt=new he(new Cn(I,Q,st),Ut);return Lt.castShadow=!0,Lt.receiveShadow=!0,_.push(Ut),Lt},p=n.headSize,x=n.legLength,v=n.armLength,S=n.limbThickness,U=n.bodyHeight,C=n.bodyWidth,A=m(C,U,.28,e);A.position.y=U/2,g.add(A);const T=new Ae;T.name="headPivot",T.position.y=U,g.add(T);const b=m(p,p,p,e);b.position.y=p/2,T.add(b);for(const I of[-1,1]){const Q=m(.06,.07,.02,t.shoe);Q.position.set(I*.09,p/2+.03,p/2+.011),T.add(Q)}const y=(I,Q)=>{const st=Q?v:x,xt=new Ae;xt.name=Q?I<0?"shoulderL":"shoulderR":I<0?"hipL":"hipR",Q||(xt.rotation.order="ZYX"),xt.position.set(I*(Q?C/2+S/2:C/2-S/2),Q?U-.04:0,0),(Q?g:u).add(xt);const Ut=m(S,st/2,S,t.limb);Ut.position.y=-st/4,xt.add(Ut);const Lt=new Ae;Lt.name=Q?"elbow":"knee",Lt.position.y=-st/2,xt.add(Lt);const F=m(S,st/2,S,t.limb);if(F.position.y=-st/4,Lt.add(F),!Q){const yt=m(S*1.15,.07,S*1.7,t.shoe);yt.position.set(0,-st/2+.035,.045),Lt.add(yt);const K=new xe;return K.name="footTip",K.position.y=-st/2,Lt.add(K),{root:xt,joint:Lt,tip:K}}return{root:xt,joint:Lt}},D=y(-1,!1),H=y(1,!1),z=y(-1,!0),X=y(1,!0),P=[D,H].map(I=>({root:I.root,joint:I.joint,tip:I.tip,upperLen:x/2,lowerLen:x/2,bend:1})),R=new bn({color:s.attackArcColor,transparent:!0,opacity:0,side:ze,depthWrite:!1}),V=new he(new Za(.62,.042,6,20,Math.PI*1.1),R);V.position.set(0,.78-x,.56),g.add(V);const B=new lh({transparent:!0,depthTest:!1,depthWrite:!1}),Z=new Sv(B);Z.scale.set(1.85,.52,1),Z.position.y=1.7-x,Z.renderOrder=20,g.add(Z);function J(I){const Q=document.createElement("canvas");Q.width=256,Q.height=72;const st=Q.getContext("2d");return st&&(st.clearRect(0,0,256,72),st.fillStyle=s.labelBg,st.fillRect(0,0,256,72),st.strokeStyle=e,st.lineWidth=5,st.strokeRect(3,3,250,66),st.fillStyle=e,st.font="bold 29px ui-monospace, Menlo, Consolas, monospace",st.textAlign="center",st.textBaseline="middle",st.fillText(`${i} ${gd[I]}`,128,38)),Q}const rt={};for(const I of Object.keys(gd))rt[I]=new Ev(J(I));const ft=rt.idle;B.map=ft;const vt=new Wt(e),$=new Wt(o.flashColor),tt=new Wt;let gt=null,j=0,pt=0,Dt=0,Ft=0,Nt=0,Et=0,Tt=0,O={...Tc},Gt=-1,Pt=0,It=0,q=0,ct=0,dt=0,w=0,M=0,G=1,et=0,ot=0,nt="none",lt=0,ut=!1,wt=-1,Xt=!1,mt=0,Rt=0;return{group:f,update(I,Q){f.position.set(I.position.x,I.position.y,I.position.z),f.rotation.y=I.bodyYaw,T.rotation.y=(I.headYaw-I.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,I.mode!==gt&&(gt=I.mode,B.map=rt[I.mode],j=1),j=Math.max(0,j-Q*2.2);const st=I.hurt,xt=wh(st,I.bodyYaw,o),Ut=xt.flash;tt.copy($).multiplyScalar(Ut);for(const Mt of _)Mt.emissive.copy(vt).multiplyScalar(j*.5),Ut>0&&Mt.emissive.add(tt);h.position.set(0,x,0),h.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const Lt=Math.hypot(I.velocity.x,I.velocity.z),F=tn(r.knockGaitScale??0,0,1),yt=I.hurt.knockX*F,K=I.hurt.knockZ*F,at=F>0&&Math.hypot(I.hurt.knockX,I.hurt.knockZ)>.001,St=I.velocity.x+yt,bt=I.velocity.z+K,Ht=Math.hypot(St,bt),jt=Math.cos(I.bodyYaw),ne=-Math.sin(I.bodyYaw),Vt=Lt>1e-6?tn((I.velocity.x*jt+I.velocity.z*ne)/Lt,-1,1):0;nt==="settled"&&Xt&&mt>Rt*1.02+1e-4&&(nt="none");let oe=1;nt==="blend"?(oe=yh(ut?wt:lt,r.stopYawBlendMode,ut),ut||(lt=Math.min(1,lt+Q/Math.max(.01,r.stopYawAfterSec)),(lt>=1||r.stopYawBlendMode==="inStop"||Xt)&&(nt="settled",oe=0))):nt==="settled"&&(oe=tn(Lt/Math.max(1e-6,r.stopEnterRatio*a),0,1));const pe=_h(Vt,r.strafeHipScale,r.strafeHipMaxDeg,r.strafeHipBoost)*oe;et+=(pe-et)*(1-Math.exp(-12*Math.max(0,Q))),u.rotation.y=et;const we=I.bodyYaw+et,Pe=Math.sin(we),se=Math.cos(we),le=Math.cos(we),Re=-Math.sin(we),rn=St*Pe+bt*se,He=St*le+bt*Re,on=Math.max(0,r.stopBlendSec||0),Ye=on>0&&!at,cn=xh(Lt,ot,a,r.stopEnterRatio,r.stopExitRatio);if(!Ye||cn.resume)Gt=-1;else if(Gt<0&&cn.enter){Gt=0,Pt=I.gaitPhase,It=mh(I.gaitPhase),q=Lt,ct=Math.max(I.stride,1e-6),dt=rn,w=He;const Mt=1/Math.max(1e-6,Lt);M=I.velocity.x*Mt,G=I.velocity.z*Mt}const Dn=ot;ot=Lt;const Ke=Ye&&Gt>=0;Ke&&(Gt=Math.min(1,Gt+Q/on)),Ke&&nt!=="blend"&&(nt="blend",lt=0),ut=Ke&&Gt<1,wt=Gt,Xt=cn.resume,mt=Lt,Rt=Dn;const Ti=Ke?{phase:Pt,speed:q,moveSpeed:a,localForward:dt,localRight:w,legLength:n.legLength,stride:ct,grounded:!0}:{phase:I.gaitPhase,speed:Ht,moveSpeed:a,localForward:rn,localRight:He,legLength:n.legLength,stride:I.stride,grounded:!0},me=Ke?gh(Ti,r,{progress:Gt,phase0:Pt,phaseEnd:It}):wc(Ti,r);let E=0,W=0,L=0,N=0;if(Ke){const Mt=Mh(I.bodyYaw,M,G),kt=Sh(Gt,Pt,Mt.forward,Mt.right,r);kt.leadLeft?(me.legL.pitchX-=kt.leadPitch,me.legL.kneeX+=kt.leadKnee,me.legR.pitchX+=kt.trailPitch):(me.legR.pitchX-=kt.leadPitch,me.legR.kneeX+=kt.leadKnee,me.legL.pitchX+=kt.trailPitch),W=kt.bodyShift*kt.fwdN,E=kt.bodyShift*kt.rightN,L=kt.bodyDip,N=kt.chestPitch}D.root.rotation.x=me.legL.pitchX,H.root.rotation.x=me.legR.pitchX,D.root.rotation.z=me.legL.rollZ,H.root.rotation.z=me.legR.rollZ,D.joint.rotation.x=me.legL.kneeX,H.joint.rotation.x=me.legR.kneeX,z.root.rotation.x=me.armL,X.root.rotation.x=me.armR,z.joint.rotation.x=-.18,X.joint.rotation.x=-.18,h.position.x=me.pelvisX,h.position.y=x+me.pelvisY,h.position.z=0,h.rotation.z=me.pelvisRoll,g.rotation.z=me.sideLean*(xt.intensity>0?.4:1);const k=Ah(h,u),it=Ke&&d.enabled?{...d,weight:1}:d,ht=it.enabled&&it.weight>0?tn(it.weight,0,1):0;if(h.position.x+=E,h.position.z+=W,h.position.y-=L,u.position.y+=L,ht<=0&&(u.position.x-=E,u.position.z-=W),c){const Mt=Math.max(.004166666666666667,Math.min(Q,.1)),kt=Math.sin(I.bodyYaw),$t=Math.cos(I.bodyYaw),Jt=tn((I.velocity.x-pt)/Mt,-60,60),ye=tn((I.velocity.z-Dt)/Mt,-60,60),Kt=Jt*kt+ye*$t,zt=ke(I.bodyYaw-Ft)/Mt,Ge=c.maxForwardDeg*Math.PI/180,Qt=c.maxSideDeg*Math.PI/180,De=1-Math.exp(-Math.max(0,c.smoothing)*Mt);Nt+=(tn(Kt*c.accelGain,-Ge,Ge)-Nt)*De,Et+=(tn(-zt*Lt*c.turnGain,-Qt,Qt)-Et)*De;const xn=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;Tt+=(tn(Lt/Math.max(a,1e-6),0,1)-Tt)*(1-Math.exp(-Math.max(0,xn)*Mt));const ge=Th({leanForward:Nt,leanSide:Et,speedRatio:Tt},c);g.rotation.x+=Nt+N,g.rotation.z+=Et,h.rotation.x+=ge.pelvisPitch,h.rotation.z+=ge.pelvisRoll,h.position.x+=ge.pelvisX,h.position.z+=ge.pelvisZ,h.position.y-=ge.crouch,u.position.y+=ge.crouch*(1-ht)}pt=I.velocity.x,Dt=I.velocity.z,Ft=I.bodyYaw,g.rotation.x+=xt.upperPitch,g.rotation.z+=xt.upperRoll,g.rotation.y+=xt.upperYaw;const _t=tn(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),At=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=tn(xt.upperShiftX*_t,-At,At),g.position.z+=tn(xt.upperShiftZ*_t,-At,At),h.position.x+=xt.comX,h.position.z+=xt.comZ-xt.pelvisBack,h.position.y-=xt.drop;const Bt=xt.legacy?0:Math.max(0,Math.min(1,o.lowerScale));if(u.position.z+=xt.pelvisBack*(1-Bt),u.position.y+=xt.drop*(1-Bt),D.joint.rotation.x+=xt.knee,H.joint.rotation.x+=xt.knee,D.root.rotation.x-=xt.hip,H.root.rotation.x-=xt.hip,z.root.rotation.x+=xt.arm,X.root.rotation.x+=xt.arm*.8,I.attackPhase!=="idle"&&xt.intensity===0){const Mt=I.attackProgress,kt=Mt<.34?-1:Mt<.68?-1+(Mt-.34)/.34*2:Math.max(0,1-(Mt-.68)/.32),$t=Math.max(0,-kt),Jt=Math.max(0,kt);X.root.rotation.x=-1.7*$t+1.25*Jt,X.joint.rotation.x=-(.25+$t*.45),g.rotation.y=-.28*kt,R.opacity=I.attackPhase==="active"?.85:0,I.attackPhase==="active"&&(V.rotation.z=-1.1+Mt*3)}else R.opacity=0;const Ot=vh(et,r.chestYawScale,r.chestYawMaxDeg);g.rotation.y+=Ot,T.rotation.y=(I.headYaw-I.bodyYaw-Ot+Math.PI*3)%(Math.PI*2)-Math.PI,O=Rh({root:f,pelvis:h,lower:u,limbs:P,base:k,cfg:it,grounded:!0,attacking:I.attackPhase!=="idle"})},ik(){return O},dispose(){f.traverse(I=>{if(I instanceof he){I.geometry.dispose();const Q=I.material;Array.isArray(Q)?Q.forEach(st=>st.dispose()):Q.dispose()}});for(const I of Object.keys(rt))rt[I].dispose();B.dispose()}}}function Ch(n){return{x:0,y:0,z:1}}function Kv(n){return Math.asin(Ch().y)}function Jv(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}function Ce(n,t,e){return n<t?t:n>e?e:n}const ws=1e-6;function fe(n,t,e,i){const s=new he(new Cn(n,t,e),new ks({color:i}));return s.castShadow=!0,s.receiveShadow=!0,s}function Se(){return new Ae}function Ra(n,t,e){const i=Se(),s=fe(t*.7,.12,t*.7,e.wood);s.position.y=.06,i.add(s);const a=fe(t*2.4,.045,t*.8,e.metal);a.position.y=.13,i.add(a);const r=fe(t*.38,n,t,e.blade);r.position.y=.13+n/2,i.add(r);const o=fe(t*.42,n*.96,t*.2,e.bladeEdge);o.position.set(0,.13+n/2,t*.5),i.add(o);const c=fe(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function Qv(n){const t=Ra(.72,.15,n),e=fe(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function tM(n){const t=Se(),e=fe(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=fe(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function eM(n){const t=Se(),e=fe(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=fe(.15,.15,.15,n.glow);i.position.y=.92;const s=i.material;return s.emissive=new Wt(n.glow),s.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function nM(n){const t=Se();for(let i=0;i<5;i++){const s=(i-2)*.15,a=fe(.055,.16,.05,n.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=fe(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function iM(n){const t=Se(),e=fe(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=fe(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function sM(n,t,e,i,s,a,r,o,c,l,d){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},h=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},u=Se(),g=Se();g.name="pelvis",g.position.y=n.legLength,u.add(g);const _=Se();_.name="lower";const m=Se();m.name="upper",g.add(_),g.add(m);const p=n.headSize,x=n.legLength,v=n.armLength,S=n.limbThickness,U=n.bodyHeight,C=n.bodyWidth,A=fe(C,U,.28,t.body);A.position.y=U/2,m.add(A);const T=Se();T.name="headPivot",T.position.y=i.headPivotHeight,m.add(T);const b=fe(p,p,p,t.head);b.position.y=p/2,T.add(b);const y=new ks({color:"#1b2733"});for(const L of[-1,1]){const N=new he(new Cn(.06,.07,.02),y);N.position.set(L*.09,p/2+.03,p/2+.011),T.add(N)}const D=L=>{const N=Se();N.name=L<0?"hipL":"hipR",N.rotation.order="ZYX",N.position.set(L*(C/2-S/2),0,0),_.add(N);const k=fe(S,x/2,S,t.limb);k.position.y=-x/4,N.add(k);const it=Se();it.name="knee",it.position.y=-x/2,N.add(it);const ht=fe(S,x/2,S,t.limb);ht.position.y=-x/4,it.add(ht);const _t=fe(S*1.15,.07,S*1.7,t.shoe);_t.position.set(0,-x/2+.035,.045),it.add(_t);const At=new xe;return At.name="footTip",At.position.y=-x/2,it.add(At),{root:N,joint:it,hand:Se(),tip:At}},H=L=>{const N=Se();N.name=L<0?"shoulderL":"shoulderR",N.position.set(L*(C/2+S/2),U-.04,0),m.add(N);const k=fe(S,v/2,S,t.limb);k.position.y=-v/4,N.add(k);const it=Se();it.name="elbow",it.position.y=-v/2,N.add(it);const ht=fe(S,v/2,S,t.limb);ht.position.y=-v/4,it.add(ht);const _t=Se();_t.position.y=-v/2,it.add(_t);const At=fe(S*1.1,.09,S*1.1,t.head);return At.position.y=.045,_t.add(At),{root:N,joint:it,hand:_t}},z=D(-1),X=D(1),P=H(-1),R=H(1),V=[z,X].map(L=>({root:L.root,joint:L.joint,tip:L.tip,upperLen:x/2,lowerLen:x/2,bend:1})),B=Se(),Z=Se();R.hand.add(B),P.hand.add(Z);const J=eM(t),rt=nM(t),ft=iM(t),vt={"sword-shield":{right:Ra(.42,.075,t),left:tM(t)},"dual-swords":{right:Ra(.42,.075,t),left:Ra(.42,.075,t)},greatsword:{right:Qv(t),left:fe(.12,.2,.12,t.wood)},staff:{right:J.g,left:Se(),orb:J.orb},bow:{right:ft,left:rt.g,arrow:ft,drawString:rt.drawString}};for(const L of Object.keys(vt))B.add(vt[L].right),Z.add(vt[L].left),vt[L].right.visible=!1,vt[L].left.visible=!1;let $=null,tt=0,gt=0,j=0,pt=0,Dt=0,Ft=0,Nt=Xv(),Et={...Tc},Tt=0,O=0,Gt=0,Pt=-1,It=0,q=0,ct=0,dt=0,w=0,M=0,G=0,et=1,ot=0,nt=0,lt=0,ut=!1,wt=0,Xt=0,mt=0,Rt=0,I="none",Q=0,st=1,xt=!1,Ut=-1,Lt=!1,F=0,yt=0,K=0,at=0,St=0,bt=1,Ht={speed:0,phase:0},jt={lp:0,lr:0,rp:0,rr:0},ne=0,Vt=0,oe=!0,pe=0,we="none",Pe=0,se=0,le=0,Re=.3,rn=0;function He(L){const N=Math.PI/180,k=a;let it=0,ht=0,_t=0,At=0;L==="sword-shield"?(it=k.swordPitchDeg*N,ht=-k.swordYawDeg*N,_t=k.shieldPitchDeg*N):L==="dual-swords"?(it=k.swordPitchDeg*N,ht=-k.swordYawDeg*N,_t=k.swordPitchDeg*N,At=k.swordYawDeg*N):L==="greatsword"?(it=k.greatswordPitchDeg*N,ht=-k.greatswordYawDeg*N,_t=k.greatswordPitchDeg*N,At=k.greatswordYawDeg*N):L==="staff"?it=k.staffPitchDeg*N:_t=k.bowPitchDeg*N,B.rotation.set(it,0,ht),Z.rotation.set(_t,0,At)}function on(L){if(L!==$){$=L;for(const N of Object.keys(vt))vt[N].right.visible=N===L,vt[N].left.visible=N===L;He(L),rt.drawString.position.z=-.06,ft.position.z=0,J.orb.scale.setScalar(1),m.rotation.y=0}}on("sword-shield");const Ye=[];u.traverse(L=>{L instanceof he&&L.material instanceof ks&&Ye.push(L.material)});const cn=new Wt(o.flashColor);function Dn(L,N){const k=wh(L,N,o);Nt=k,m.rotation.x+=k.upperPitch,m.rotation.z+=k.upperRoll,m.rotation.y+=k.upperYaw;const it=Ce(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),ht=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Ce(k.upperShiftX*it,-ht,ht),m.position.z+=Ce(k.upperShiftZ*it,-ht,ht),g.position.x+=k.comX,g.position.z+=k.comZ-k.pelvisBack,g.position.y-=k.drop;const _t=k.legacy?0:Ce(o.lowerScale,0,1);_.position.z+=k.pelvisBack*(1-_t),_.position.y+=k.drop*(1-_t),z.joint.rotation.x+=k.knee,X.joint.rotation.x+=k.knee,z.root.rotation.x-=k.hip,X.root.rotation.x-=k.hip,P.root.rotation.x+=k.arm,R.root.rotation.x+=k.arm*.8;for(const At of Ye)At.emissive.copy(cn).multiplyScalar(k.flash)}function Ke(L){return L<.3?-1:L<.62?-1+(L-.3)/.32*2:Math.max(0,1-(L-.62)/.38)}function Ti(L){if(L.phase==="idle"||L.charging)return;const N=L.attackProgress,k=Ke(N),it=Math.max(0,k),ht=L.comboIndex%2===0?1:-1,_t=c.stride,At=Number.isFinite(_t.stepReach)?_t.stepReach:.17,Bt=Number.isFinite(_t.stepSideReach)?_t.stepSideReach:.14,Ot=Number.isFinite(_t.stepDipReach)?_t.stepDipReach:.05,Mt=L.weapon==="greatsword"?Ce(Number.isFinite(_t.heavyScale)?_t.heavyScale:1,0,1):1;g.position.z+=At*it*Mt,g.position.x+=ht*Bt*it*Mt,g.position.y-=Ot*Math.sin(Math.PI*N)*Mt}function me(L){if(rt.drawString.position.z=-.06,ft.position.z=0,J.orb.scale.setScalar(1),m.rotation.y=0,L.charging&&L.weapon==="bow"){const ht=L.charge;P.root.rotation.x=-1.25,P.joint.rotation.x=-.15,R.root.rotation.x=.35+ht*.3,R.joint.rotation.x=-1.15,rt.drawString.position.z=-.06-ht*.22,ft.position.z=-ht*.3,m.rotation.y=-.22;return}if(L.phase==="idle")return;const N=Ke(L.attackProgress),k=Math.max(0,-N),it=Math.max(0,N);if(L.weapon==="bow")P.root.rotation.x=-1.2,P.joint.rotation.x=-.15,R.root.rotation.x=.9-it*.8,R.joint.rotation.x=-.3;else if(L.weapon==="greatsword"){const ht=-1.6*k+1.25*it,_t=Ce(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);R.root.rotation.x=ht,R.joint.rotation.x=-(.25+k*.4),P.root.rotation.x=ht+.06,P.joint.rotation.x=-(.32+k*.4),P.root.rotation.z=.38,m.rotation.y=-.2*N*_t}else{const ht=L.comboIndex;if(ht===1)R.root.rotation.x=-1.7*k+1.1*it,R.joint.rotation.x=-(.2+k*.5),P.root.rotation.x=.1,m.rotation.y=-.18*N;else if(ht===2)P.root.rotation.x=-1.5*k+1*it,P.joint.rotation.x=-(.2+k*.5),R.root.rotation.x=.2,m.rotation.y=.45*-N;else{const _t=-1.9*k+1.2*it;P.root.rotation.x=_t,R.root.rotation.x=_t,P.joint.rotation.x=-(.15+k*.4),R.joint.rotation.x=-(.15+k*.4),m.rotation.y=-.3*N}}Ti(L)}function E(L,N){L&&(R.root.rotation.x=-1.05,R.joint.rotation.x=-.35,P.root.rotation.x=-.45,P.joint.rotation.x=-.2,m.rotation.y=-.12,J.orb.scale.setScalar(1.25+.12*Math.sin(N*2)))}function W(L){if(!L||L.phase==="idle")return;const N=L.progress,k=N<.3?-.35+N/.3*1.35:N<.7?1:Math.max(0,1-(N-.7)/.3),it=Math.PI/180;m.rotation.x+=h.leanDeg*it*k,P.root.rotation.x-=h.shieldPitchDeg*it*k,P.joint.rotation.x-=.22*k,R.root.rotation.x-=.3*k,g.position.z+=h.pelvisReach*Math.max(0,k)}return{group:u,update(L,N,k,it,ht=!1,_t,At,Bt){on(N.weapon),m.rotation.x=0,m.rotation.z=0,g.position.x=0,g.position.y=x,g.position.z=0,g.rotation.z=0,g.rotation.x=0,m.position.x=0,m.position.y=0,m.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const Ot=Math.max(1/240,Math.min(it,.1)),Mt=_t===void 0?ne+=it:_t;Vt=Mt;const kt=c.landing;kt.enabled?oe&&!L.grounded?(we="jump",Pe=Mt,se=kt.anticipationDuration,le=Math.max(0,kt.jumpAnticipation),Re=.32):!oe&&L.grounded&&(we="land",Pe=Mt,se=kt.duration,le=Vv(pe,kt),Re=kt.compressRatio,rn=pe):(we="none",le=0),Mt<Pe&&(we="none",le=0),oe=L.grounded,pe=L.velocity.y;const $t=md(Mt,Pe,se,le,Re),Jt=N.phase!=="idle",ye=(Bt==null?void 0:Bt.phase)==="active";at=Bv(at,Jt,Ot,c.attack.blendRate);const Kt=Hv(at,c.attack.gaitWeight,c.attack.lowerBodyWeight);St=Kt.attackLegWeight,bt=Kt.gaitScale;const zt=Math.sin(L.bodyYaw),Ge=Math.cos(L.bodyYaw),Qt=(L.velocity.x-tt)/Ot,De=(L.velocity.z-gt)/Ot,xn=Ce(Qt,-60,60),ge=Ce(De,-60,60),si=xn*zt+ge*Ge,ce=ke(L.bodyYaw-j)/Ot,Je=Math.hypot(L.velocity.x,L.velocity.z),Xn=r.maxForwardDeg*Math.PI/180,Ue=r.maxSideDeg*Math.PI/180,vn=Ce(si*r.accelGain,-Xn,Xn),Mn=Ce(-ce*Je*r.turnGain,-Ue,Ue),hs=1-Math.exp(-r.smoothing*Ot);pt+=(vn-pt)*hs,Dt+=(Mn-Dt)*hs,tt=L.velocity.x,gt=L.velocity.z,j=L.bodyYaw;const Ln=Math.hypot(L.velocity.x,L.velocity.z),qa=Ce(s.knockGaitScale??0,0,1),Ph=k.knockX*qa,Dh=k.knockZ*qa,Lh=qa>0&&Math.hypot(k.knockX,k.knockZ)>.001,ja=L.velocity.x+Ph,Ka=L.velocity.z+Dh,Ac=Math.hypot(ja,Ka);Rt=Ac;const Ih=Math.cos(L.bodyYaw),kh=-Math.sin(L.bodyYaw),Uh=L.velocity.x*Ih+L.velocity.z*kh,Fh=Ln>ws?Ce(Uh/Ln,-1,1):0;I==="settled"&&Lt&&F>yt*1.02+1e-4&&(I="none");let us=1;I==="blend"?(us=yh(xt?Ut:Q,s.stopYawBlendMode,xt),xt||(Q=Math.min(1,Q+Ot/Math.max(.01,s.stopYawAfterSec)),(Q>=1||s.stopYawBlendMode==="inStop"||Lt)&&(I="settled",us=0))):I==="settled"&&(us=Ce(Ln/Math.max(ws,s.stopEnterRatio*e),0,1)),st=us;const Nh=_h(Fh,i.legYawScale,i.hipYawMaxDeg,s.strafeHipBoost)*us;O+=(Nh-O)*(1-Math.exp(-i.hipYawSmoothing*Ot));const fs=L.bodyYaw+O;Gt=fs;const zh=Math.sin(fs),Oh=Math.cos(fs),Bh=Math.cos(fs),Hh=-Math.sin(fs),zs={speed:Ac,phase:L.gaitPhase,localForward:ja*zh+Ka*Oh,localRight:ja*Bh+Ka*Hh,stride:L.stride};Jt&&!ut&&(lt=L.gaitPhase),ut=Jt;const Ai=at>0?zv(zs,N.attackProgress,N.comboIndex,at,c.stride,lt):zs;Ht=Ai;const Rc=Math.max(0,s.stopBlendSec||0),Cc=Rc>0&&!Jt&&!Lh&&L.grounded,Ja=xh(Ln,ot,e,s.stopEnterRatio,s.stopExitRatio);if(!Cc||Ja.resume)Pt=-1;else if(Pt<0&&Ja.enter){Pt=0,It=L.gaitPhase,q=mh(L.gaitPhase),ct=Ln,dt=Math.max(L.stride,ws),w=zs.localForward,M=zs.localRight;const de=1/Math.max(ws,Ln);G=L.velocity.x*de,et=L.velocity.z*de}const Gh=ot;ot=Ln;const ai=Cc&&Pt>=0;ai&&(Pt=Math.min(1,Pt+Ot/Rc)),ai&&I!=="blend"&&(I="blend",Q=0),xt=ai&&Pt<1,Ut=Pt,Lt=Ja.resume,F=Ln,yt=Gh;const Pc=ai?{phase:It,speed:ct,moveSpeed:e,localForward:w,localRight:M,legLength:n.legLength,stride:dt,grounded:!0}:{phase:Ai.phase,speed:Ai.speed,moveSpeed:e,localForward:Ai.localForward,localRight:Ai.localRight,legLength:n.legLength,stride:Ai.stride??0,grounded:L.grounded},Vh=ai?gh(Pc,s,{progress:Pt,phase0:It,phaseEnd:q}):wc(Pc,s),ie=Gv(Vh,Kt.gaitScale);if(K=0,ye&&Bt){const de=Uv(Bt.progress,Bt.dir,s),te=Kt.gaitScale;ie.legL.pitchX+=de.legL.pitchX*te,ie.legL.rollZ+=de.legL.rollZ*te,ie.legL.kneeX+=de.legL.kneeX*te,ie.legR.pitchX+=de.legR.pitchX*te,ie.legR.rollZ+=de.legR.rollZ*te,ie.legR.kneeX+=de.legR.kneeX*te,ie.pelvisY+=de.pelvisY*te,K=de.env}let Qa=0,tr=0,er=0,Dc=0;if(ai){const de=Mh(L.bodyYaw,G,et),te=Sh(Pt,It,de.forward,de.right,s);te.leadLeft?(ie.legL.pitchX-=te.leadPitch,ie.legL.kneeX+=te.leadKnee,ie.legR.pitchX+=te.trailPitch):(ie.legR.pitchX-=te.leadPitch,ie.legR.kneeX+=te.leadKnee,ie.legL.pitchX+=te.trailPitch),tr=te.bodyShift*te.fwdN,Qa=te.bodyShift*te.rightN,er=te.bodyDip,Dc=te.chestPitch,wt=te.leadPitch,Xt=te.bodyShift,mt=te.bodyDip}else wt=0,Xt=0,mt=0;jt={lp:ie.legL.pitchX,lr:ie.legL.rollZ,rp:ie.legR.pitchX,rr:ie.legR.rollZ},L.grounded?(z.root.rotation.x=ie.legL.pitchX,X.root.rotation.x=ie.legR.pitchX,z.root.rotation.z=ie.legL.rollZ,X.root.rotation.z=ie.legR.rollZ,z.joint.rotation.x=ie.legL.kneeX,X.joint.rotation.x=ie.legR.kneeX,P.root.rotation.x=ie.armL,R.root.rotation.x=ie.armR,P.joint.rotation.x=-(.18+ie.armL*.2),R.joint.rotation.x=-(.18+ie.armR*.2),P.root.rotation.z=0,R.root.rotation.z=0,g.position.x=ie.pelvisX,g.position.y=x+ie.pelvisY,g.position.z=0,g.rotation.z=ie.pelvisRoll):(z.root.rotation.x=-.55,X.root.rotation.x=-.25,z.joint.rotation.x=.75,X.joint.rotation.x=.55,P.root.rotation.x=-.9,R.root.rotation.x=-.7,P.joint.rotation.x=-.6,R.joint.rotation.x=-.6,z.root.rotation.z=0,X.root.rotation.z=0);const Xh=Ah(g,_),ps=ye?{...f,weight:0}:ai&&f.enabled?{...f,weight:1}:f,Lc=ps.enabled&&L.grounded&&ps.weight>0?Ce(ps.weight,0,1)*(Jt?Ce(ps.attackScale,0,1):1):0;g.position.x+=Qa,g.position.z+=tr,g.position.y-=er,_.position.y+=er,Lc<=0&&(_.position.x-=Qa,_.position.z-=tr);const Wh=Ln/Math.max(e,ws),$h=Number.isFinite(r.crouchSmoothing)?r.crouchSmoothing:8,Yh=1-Math.exp(-Math.max(0,$h)*Ot);Tt+=(Ce(Wh,0,1)-Tt)*Yh;const Ri=Th({leanForward:pt,leanSide:Dt,speedRatio:Tt},r);g.rotation.x+=Ri.pelvisPitch,g.rotation.z+=Ri.pelvisRoll,g.position.x+=Ri.pelvisX,g.position.z+=Ri.pelvisZ,g.position.y-=Ri.crouch,_.position.y+=Ri.crouch*(1-Ce(Lc,0,1)),me(N),E(ht,L.gaitPhase),W(At);const Zh=a.greatswordPitchDeg*Math.PI/180,Ic=N.weapon==="greatsword",kc=Math.hypot(L.velocity.x,L.velocity.z),qh=Ic&&N.phase==="idle"&&kc>.5?Math.min(1.15,kc/Math.max(e,.001)*.9):0;Ft+=(qh-Ft)*(1-Math.exp(-6*Ot)),Ic&&(B.rotation.x=Zh+Ft),N.weapon==="bow"&&(rt.g.rotation.x=-(P.root.rotation.x+P.joint.rotation.x),ft.rotation.x=-(R.root.rotation.x+R.joint.rotation.x));const jh=m.rotation.y;Dn(k,L.bodyYaw);const Uc=k.type==="none"?1:.4;if(m.rotation.x+=pt*Uc+Dc,m.rotation.z+=(Dt+ie.sideLean)*Uc,$t>0&&(z.root.rotation.x-=kt.hipPitch*$t,X.root.rotation.x-=kt.hipPitch*$t,z.joint.rotation.x+=kt.kneeBend*$t,X.joint.rotation.x+=kt.kneeBend*$t,g.position.y-=kt.crouchDepth*$t,_.position.y+=kt.crouchDepth*(1-kt.lowerScale)*$t,m.rotation.x+=kt.upperPitch*$t,P.root.rotation.x-=kt.armTuck*$t,R.root.rotation.x-=kt.armTuck*$t),St>0&&L.grounded){const de=Ov(N.attackProgress,N.comboIndex,c.stride),te=St;z.root.rotation.x+=de.legL.pitchX*te,X.root.rotation.x+=de.legR.pitchX*te,z.root.rotation.z+=de.legL.rollZ*te,X.root.rotation.z+=de.legR.rollZ*te,z.joint.rotation.x+=de.legL.kneeX*te,X.joint.rotation.x+=de.legR.kneeX*te,g.position.x+=de.pelvisX*te,g.position.y+=de.pelvisY*te,g.rotation.z+=de.pelvisRoll*te}_.rotation.y=O,nt=vh(O,s.chestYawScale,s.chestYawMaxDeg),m.rotation.y+=nt;const Kh=jh;T.rotation.y=ke(L.headYaw-L.bodyYaw-Kh-nt),Et=Rh({root:u,pelvis:g,lower:_,limbs:V,base:Xh,cfg:ps,grounded:L.grounded,attacking:Jt})},lean(){return{forward:pt,side:Dt}},landing(){const L=md(Vt,Pe,se,le,Re),N=se>0?Math.max(0,se-Math.max(0,Vt-Pe)):0;return{pulse:L,remaining:N,kind:L>0?we:"none",impactVy:rn}},hurt(){return Nt},ik(){return Et},attackBlend(){return at},attackWeights(){return{gaitScale:bt,attackLegWeight:St,driveSpeed:Ht.speed,stridePhase:Ht.phase}},hipYaw(){return O},gaitDebug(){return{stopT:Pt,hipYaw:O,chestYaw:nt,speed:ot,gaitSpeed:Rt,stopStep:wt,stopShift:Xt,stopDip:mt,stopYawFade:st,turnStep:K,legLPitch:jt.lp,legLRoll:jt.lr,legRPitch:jt.rp,legRRoll:jt.rr}},gaitYaw(){return Gt},arrowDirection(){ft.updateWorldMatrix(!0,!1);const L=ft.matrixWorld.elements,N=L[8],k=L[9],it=L[10],ht=Math.hypot(N,k,it)||1;return{x:N/ht,y:k/ht,z:it/ht}},dispose(){u.traverse(L=>{if(L instanceof he){L.geometry.dispose();const N=L.material;Array.isArray(N)?N.forEach(k=>k.dispose()):N.dispose()}})}}}function aM(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function rM(n,t,e){const i=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),a=new vv({antialias:!0});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),a.shadowMap.enabled=!0,a.shadowMap.type=Id,a.setSize(i,s,!1),n.appendChild(a.domElement);const r=new Mv;r.background=new Wt("#12161d"),r.add(new Tv(11061486,2764600,1.15));const o=new Cv(16773852,1.5);o.position.set(9,18,11),o.castShadow=!0,o.shadow.mapSize.set(1024,1024);const c=o.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(o);const l=[],d=new Ae;for(const q of t.boxes){const ct=q.maxX-q.minX,dt=q.maxY-q.minY,w=q.maxZ-q.minZ;let M=aM(q.kind,e);q.kind==="step"&&(M=new Wt(M).offsetHSL(0,0,q.maxY*.09).getStyle());const G=new ks({color:M,transparent:!0,opacity:1}),et=new he(new Cn(ct,dt,w),G);et.position.set((q.minX+q.maxX)/2,(q.minY+q.maxY)/2,(q.minZ+q.maxZ)/2),et.castShadow=q.kind!=="ground",et.receiveShadow=!0,et.add(new hh(new wv(et.geometry),new Sc({color:10467020,transparent:!0,opacity:.32}))),d.add(et),l.push(G)}r.add(d);const f=t.gridMeta.maxX-t.gridMeta.minX,h=new Dv(f,f,4873328,3358797);h.position.y=.002,h.visible=e.showGrid,r.add(h);const u=sM(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=new Ae,_=.9,m=new Ae;m.position.y=_,u.group.position.y=-_,m.add(u.group),g.add(m),r.add(g);const p=t.dummies.map((q,ct)=>{const dt=e.dummies.colors,w=dt[ct%dt.length]??"#cccccc",M=jv(e.voxel,e.colors,w,q.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return M.group.traverse(G=>{G.userData.dummyId=q.id}),r.add(M.group),M}),x=p.map(q=>q.group),v=new Pv,S=e.targeting.ringRadius,U=new bn({color:e.targeting.ringColor,transparent:!0,opacity:.9,side:ze,depthWrite:!1}),C=new he(new Ji(S-.07,S,28),U);C.rotation.x=-Math.PI/2,C.position.y=.03,C.visible=!1,r.add(C);const A=new Ae;r.add(A);const T=new bn({color:12577023,transparent:!0,opacity:0,side:ze,depthWrite:!1}),b=new Ae;b.position.set(0,.95,.72),A.add(b);const y=new Ae;y.rotation.x=Kv(e.camera.pitchDeg),b.add(y);const D=new he(new Za(.78,.045,6,24,Math.PI*1.15),T);y.add(D);const H=new Ec(1,0),z=new bn({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),X=Array.from({length:16},()=>{const q=new he(H,z);return q.visible=!1,r.add(q),q}),P=new Ji(.86,1,40),R=Array.from({length:6},()=>{const q=new bn({color:10146047,transparent:!0,opacity:0,side:ze,depthWrite:!1}),ct=new he(P,q);return ct.rotation.x=-Math.PI/2,ct.visible=!1,r.add(ct),{mesh:ct,mat:q}}),V=new bn({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),B=new he(new Cn(.035,.035,.5),V);A.add(B);const Z=e.dash,J=new Ji(Z.ringRadius-.06,Z.ringRadius,28),rt=Array.from({length:6},()=>{const q=new bn({color:16777215,transparent:!0,opacity:0,side:ze,depthWrite:!1}),ct=new he(J,q);return ct.rotation.x=-Math.PI/2,ct.visible=!1,r.add(ct),{mesh:ct,mat:q,life:0,base:1}});function ft(q,ct,dt,w,M){const G=rt.find(et=>et.life<=0)??rt[0];G.mat.color.set(w),G.mesh.position.set(q,dt+.04,ct),G.base=M,G.mesh.scale.setScalar(M*.6),G.mesh.visible=!0,G.mat.opacity=.9,G.life=Z.fxDuration}const vt=e.links,$=new Ji(vt.ringRadius-.07,vt.ringRadius,28),tt=Array.from({length:5},()=>{const q=new bn({color:vt.chargeColor,transparent:!0,opacity:0,side:ze,depthWrite:!1}),ct=new he($,q);return ct.rotation.x=-Math.PI/2,ct.visible=!1,r.add(ct),{mesh:ct,mat:q,life:0,base:1}});function gt(q,ct,dt,w){const M=tt.find(G=>G.life<=0)??tt[0];M.mesh.position.set(q,dt+.05,ct),M.base=w,M.mesh.scale.setScalar(w*.55),M.mesh.visible=!0,M.mat.opacity=.85,M.life=vt.fxDuration}let j=t.playerLink.id,pt=t.playerLink.hitIds.length,Dt=t.dash.id,Ft="none",Nt=0,Et=-1,Tt=1;const O=Iv(e.camera,e.smartCamera,e.zoom,i/s),Gt=t.character.position;O.update(Gt.x,Gt.y,Gt.z,1,t.camera);function Pt(q,ct){if(x.length===0)return 0;const dt=a.domElement.getBoundingClientRect(),w=new Yt((q-dt.left)/dt.width*2-1,-((ct-dt.top)/dt.height)*2+1);v.setFromCamera(w,O.camera);const M=v.intersectObjects(x,!0);for(const G of M){const et=G.object.userData.dummyId;if(et&&et>0)return et}return 0}function It(q,ct,dt){const w=a.domElement.getBoundingClientRect(),M=new Y(q,ct,dt).project(O.camera);return{x:w.left+(M.x*.5+.5)*w.width,y:w.top+(-M.y*.5+.5)*w.height}}return{gaitDebug(){return u.gaitDebug()},render(q,ct){const dt=q.character,w=q.combat;g.position.set(dt.position.x,dt.position.y,dt.position.z),g.rotation.y=dt.bodyYaw;const M=q.dash.phase==="active"&&q.dash.kind==="roll",G=M&&q.dash.duration>0?Math.min(1,1-q.dash.timer/q.dash.duration):0;m.rotation.x=M?G*Math.PI*2:0,m.position.y=_-(M?.2*Math.sin(Math.PI*G):0),u.update(dt,w,q.playerHurt,ct,q.abilities.channeling,q.time,q.playerLink,q.turnInPlace);for(let lt=0;lt<p.length;lt++)q.dummies[lt]&&p[lt].update(q.dummies[lt],ct);const et=q.targeting.hasTarget?q.dummies[q.targeting.targetId-1]:void 0;if(C.visible=!!et,et&&(C.position.set(et.position.x,et.position.y+.03,et.position.z),C.scale.setScalar(1+.07*Math.sin(q.time*6))),A.position.set(dt.position.x,dt.position.y,dt.position.z),A.rotation.y=w.phase!=="idle"?w.attackFacing:dt.bodyYaw,q.dash.id!==Dt){Dt=q.dash.id;const lt=q.dash;Ft=lt.kind,lt.kind==="blink"?(ft(lt.fromX,lt.fromZ,dt.position.y,Z.blinkColor,.9),ft(lt.toX,lt.toZ,dt.position.y,Z.blinkColor,1.35)):ft(lt.fromX,lt.fromZ,dt.position.y,Z.rollColor,1.1)}for(const lt of rt){if(lt.life<=0)continue;lt.life-=ct;const ut=Math.max(0,lt.life/Z.fxDuration);lt.mat.opacity=.9*ut,lt.mesh.scale.setScalar(lt.base*(.6+(1-ut)*1.2)),lt.life<=0&&(lt.mesh.visible=!1)}const ot=q.playerLink;ot.id!==j&&(j=ot.id,pt=ot.hitIds.length,gt(dt.position.x,dt.position.z,dt.position.y,1)),ot.hitIds.length>pt?(pt=ot.hitIds.length,gt(dt.position.x,dt.position.z,dt.position.y,1.35)):ot.hitIds.length<pt&&(pt=ot.hitIds.length);for(const lt of tt){if(lt.life<=0)continue;lt.life-=ct;const ut=Math.max(0,lt.life/Math.max(vt.fxDuration,1e-6));lt.mat.opacity=.85*ut,lt.mesh.scale.setScalar(lt.base*(.55+(1-ut)*1.1)),lt.life<=0&&(lt.mesh.visible=!1)}w.attackId!==Nt&&(Nt=w.attackId,w.weapon==="bow"&&w.phase!=="idle"&&(Et=0,Tt=.6+w.lastCharge*.9));const nt=w.phase==="active"&&w.comboIndex>0;T.opacity=nt?.78:0,nt&&(D.rotation.z=-1.2+w.attackProgress*3.2,D.scale.setScalar(.9+w.comboIndex*.13));for(let lt=0;lt<X.length;lt++){const ut=q.abilities.projectiles[lt],wt=X[lt];wt.visible=!!ut,ut&&(wt.position.set(ut.x,ut.y,ut.z),wt.scale.setScalar(ut.radius),wt.rotation.y+=ct*6)}for(let lt=0;lt<R.length;lt++){const ut=q.abilities.rings[lt],wt=R[lt];if(wt.mesh.visible=!!ut,ut){const Xt=Math.max(0,Math.min(1,ut.life/Math.max(ut.duration,1e-6)));wt.mesh.position.set(ut.x,.05,ut.z),wt.mesh.scale.setScalar(ut.radius),wt.mat.opacity=.25+.55*Xt}}if(Et>=0){Et+=ct;const lt=Et*14*Tt;B.position.set(0,.85,.6+lt),V.opacity=lt<9?.95:0,lt>=9&&(Et=-1)}else V.opacity=0;O.update(dt.position.x,dt.position.y,dt.position.z,ct,q.camera),a.render(r,O.camera)},resize(){const q=Math.max(1,n.clientWidth),ct=Math.max(1,n.clientHeight);a.setSize(q,ct,!1),O.resize(q/ct)},getGroundBasis(){return O.getGroundBasis()},setCollidersVisible(q){for(const ct of l)ct.opacity=q?.3:1,ct.wireframe=q,ct.needsUpdate=!0},setGridVisible(q){h.visible=q},setZoom(q){O.setZoom(q)},pickDummy:Pt,projectToScreen:It,diagnostics(){const q=Ch(e.camera.pitchDeg),ct=Jv(q,A.rotation.y);return{lean:u.lean(),slashNormal:ct,arrowForward:u.arrowDirection(),gait:{hipYaw:u.hipYaw(),gaitYaw:u.gaitYaw()},attackBlend:u.attackBlend(),attackWeights:u.attackWeights(),landing:u.landing(),hurt:u.hurt(),ik:u.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:m.rotation.x,activeRings:rt.filter(dt=>dt.life>0).length,lastKind:Ft},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...O.smart()}}},dispose(){u.dispose();for(const q of p)q.dispose();C.geometry.dispose(),U.dispose(),D.geometry.dispose(),T.dispose(),H.dispose(),z.dispose(),P.dispose();for(const q of R)q.mat.dispose();B.geometry.dispose(),V.dispose();for(const q of rt)q.mat.dispose();J.dispose();for(const q of tt)q.mat.dispose();$.dispose(),d.traverse(q=>{q instanceof he&&q.geometry.dispose()}),a.dispose(),a.domElement.remove()}}}async function oM(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function cM(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download=n,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function lM(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),s=i("diag-status"),a=i("diag-text"),r=i("diag-copy"),o=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),d=i("diag-close"),f=i("diag-mask");let h=!1,u=!0,g=0;function _(){const x=n.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function m(x){h=x,e.hidden=!x,x?_():a.hidden=!0}function p(x){r.textContent=x,window.clearTimeout(g),g=window.setTimeout(()=>{r.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),m(!h)}),d.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),r.addEventListener("click",()=>{const x=n.summary();oM(x).then(v=>{v?(p("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),p("请长按全选复制"))})}),o.addEventListener("click",()=>{const x=n.dump(),v=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);cM(`harness-${x.meta.version}-${v}.json`,JSON.stringify(x)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),a.hidden=!0,_(),p("已清空")}),l.addEventListener("click",()=>{u=!u,n.setEnabled(u),_()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),h&&_()},isOpen:()=>h,close:()=>m(!1)}}const dM={intents:{..._d},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function hM(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=of(Hf,Gf),i=rM(n,e,dn),s=lf(e),a=xp(t),r=vp(t),o=document.getElementById("version-badge");o&&(o.textContent="v0.9.28 · 11-07 14:13 · 诊断");const c=y=>String(y).padStart(2,"0"),l=new Date,d=Ff({meta:{version:"v0.9.28",buildTime:"11-07 14:13",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=lM(d,o),h=mp({deadZone:()=>dn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&d.suspend(800)});const u={timeScale:1,paused:!1,showColliders:dn.showColliders,showGrid:dn.showGrid};let g=1;const _=wf({maxRadiusPx:()=>dn.joystick.maxRadiusPx,deadZone:dn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>dn.zoom}),m=Array.from(document.querySelectorAll(".wp[data-weapon]"));let p=e.combat.weapon;function x(y){if(y===p)return;p=y;const D=Si.indexOf(y)+1;for(const H of m)H.classList.toggle("is-active",Number(H.dataset.weapon)===D);U.refreshWeapon()}let v=dM,S=0;const U=ep(e,dn,u,{singleStep:()=>s.singleStep(v.intents),reset:()=>{g=1,s.singleStep({..._d,resetPressed:!0})},resetZoom:()=>{g=1,i.setZoom(1)},onToggleColliders:y=>i.setCollidersVisible(y),onToggleGrid:y=>i.setGridVisible(y)});r.register({motion:h,debug:U.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:s,input:_,viewConfig:dn,debug:u,getUserZoom:()=>g,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:d,telemetrySummary:()=>d.summary(),dirDebug:h.dirDebug,dirAngles:()=>h.dirDebug.last(),motionDebug:h,speedDebug:()=>h.last(),speedSamples:()=>h.samples(),gaitDebug:()=>i.gaitDebug()};let C=performance.now(),A=60,T=0;function b(y){const D=Math.min((y-C)/1e3,.1);C=y,D>0&&(A=A*.9+1/D*.1);const H=_.sample();H.intents.resetPressed&&(g=1),g=mf(g,H.zoomScale,dn.zoom.min,dn.zoom.max),i.setZoom(g);let z=H.intents.dummyClickId;if(H.tap){const R=i.pickDummy(H.tap.x,H.tap.y);R>0&&(z=R)}z>0&&(S=z),v={...H,intents:{...H.intents,dummyClickId:S}};const X=s.frame(D,v.intents,u.timeScale,u.paused,()=>{const R=e.events;for(let V=0;V<R.length;V++)d.event(R[V],e.time)});X>0&&(S=0),d.sample(e,v,D*1e3,X);for(const R of v.gestures)d.gesture(R);y-T>250&&(T=y,f.tick()),x(e.combat.weapon),i.render(e,D),h.update(e,v,i.getGroundBasis());const P=i.diagnostics();a.update(e,A,X,v,u,{attackBlend:P.attackBlend,attackWeights:P.attackWeights,landing:P.landing,hurt:P.hurt,ik:P.ik,zoom:P.camera.zoom},r.hudCompact()),requestAnimationFrame(b)}requestAnimationFrame(b)}hM();

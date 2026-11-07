(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const vi=["sword-shield","dual-swords","greatsword","staff","bow"],Wa=["wander","follow","keep-distance","attack","idle"],ad={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},xa=1e-6;function ys(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>xa?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>xa?Math.atan2(t.moveX,t.moveZ):n.character.facing}function zh(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>xa){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>xa)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Je=1e-6,Fo=Math.PI/180,od=-1e9;function rd(){return{type:"none",lastAt:od,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function No(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ec(n,t,e,i,s){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=s,n.knockX=0,n.knockZ=0}function Gr(n,t,e){const i=e.duration>0?e.duration:Xr(n,e.type);if(t.kind==="player"){const a=n.playerHurt;if(Ec(a,e.type,i,e.dirX,e.dirZ),a.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Je){const o=e.knockback*n.config.hits.knockbackDecay;a.knockX=e.dirX*o,a.knockZ=e.dirZ*o}No(n,"player-hurt",e.sourceId??0,n.character.position);return}const s=n.dummies[t.index];if(s){if(Ec(s.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Je){const a=e.knockback*n.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}n.hitCount+=1,No(n,"hit",s.id,s.position)}}function Vr(n,t,e){Gr(n,{kind:"dummy",index:t},e)}function Oh(n,t){const e=[n.playerHurt];for(const s of n.dummies)e.push(s.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=i,s.knockZ*=i,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function Xr(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Bh(n){const t=n.combat,e=n.config.hits,i=n.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Fo),o=Math.sin(t.attackFacing),r=Math.cos(t.attackFacing),c=n.config.dummies.radius,l=n.config.targeting.idealRange;for(const d of n.dummies){const f=d.position.x-i.x,h=d.position.z-i.z,u=Math.hypot(f,h);if(u>s+c)continue;const g=u>Je?f/u:o,_=u>Je?h/u:r;if(u>Je&&(f*o+h*r)/u<a)continue;let m="light";t.weapon==="greatsword"?m="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(m="heavy");const p=e.knockback[t.weapon]??0;let x=u;p>0&&(x=Math.max(u+p,l));const v=Math.max(0,x-u);Vr(n,n.dummies.indexOf(d),{type:m,duration:Xr(n,m),dirX:g,dirZ:_,knockback:v})}}function Hh(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const s=i.weapon===""?void 0:e.moves[i.weapon];if(!s||!s.enabled||!n.modules.hits||!n.modules.dummies)return;const a=s.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(a.pulseInterval,0);const o=n.character.position,r=i.fromX,c=i.fromZ,l=o.x,d=o.z,f=l-r,h=d-c,u=f*f+h*h,g=Math.sin(i.facing),_=Math.cos(i.facing),m=Math.cos(Tc(a.arcDeg,0,180)*Fo),p=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const v=n.dummies[x];if(i.hitIds.indexOf(v.id)>=0)continue;const M=u>Je?Tc(((v.position.x-r)*f+(v.position.z-c)*h)/u,0,1):0,k=r+f*M,R=c+h*M,A=Math.hypot(v.position.x-k,v.position.z-R);let T=!1;if(a.shape==="circle")T=A<=a.radius+p;else if(a.shape==="capsule")T=A<=Math.max(a.radius,a.width)+p;else{const W=v.position.x-l,P=v.position.z-d,w=Math.hypot(W,P),X=w>Je?(W*g+P*_)/w>=m:!0;T=w<=a.radius+p&&X||A<=a.width+p}if(!T)continue;const b=v.position.x-r,y=v.position.z-c,D=Math.hypot(b,y);if(D>Je&&(b*g+y*_)/D<Math.cos(Math.max(a.arcDeg,90)*Fo))continue;const G=D>Je?b/D:g,z=D>Je?y/D:_;Gr(n,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:G,dirZ:z,knockback:a.knockback}),i.hitIds.push(v.id),No(n,"link-hit",v.id,v.position)}}function Gh(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const s=n.dummies[i.value-1];if(!s)continue;const a=e.x-s.position.x,o=e.z-s.position.z,r=Math.hypot(a,o);if(r>t.dummyReach)continue;const c=r>Je?a/r:0,l=r>Je?o/r:1;Gr(n,{kind:"player"},{type:"light",duration:Xr(n,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function Vh(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&Bh(n),Hh(n,t),Gh(n)}function Tc(n,t,e){return n<t?t:n>e?e:n}const ra=1e-6;function Ss(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Xh(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function Wh(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function $h(n){const t=n.abilities,e=n.config.abilities.arcane,i=n.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),o=.55,r={id:++t.nextId,x:i.x+s*o,y:i.y+1,z:i.z+a*o,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(r),t.volleyId+=1,Ss(n,"projectile-fire",t.volleyId,r)}function Yh(n,t,e){const i=n.abilities,s=n.config.abilities.arcane,a=n.dash.phase==="active",o=n.playerLink;if(n.combat.weapon==="staff"&&e.attackHeld&&!a&&o.phase==="idle"&&!o.consumedAttack){i.channeling||(i.channeling=!0,i.fireTimer=0,Ss(n,"channel-start",0,n.character.position)),i.channelYaw=ys(n,e),i.fireTimer-=t;let c=0;for(;i.fireTimer<=0&&c++<8;)i.fireTimer+=Math.max(s.fireInterval,ra),$h(n)}else i.channeling&&(i.channeling=!1,Ss(n,"channel-end",0,n.character.position))}function Zh(n,t){const e=n.config.abilities.ring,i=n.dash.phase==="active";if(n.combat.weapon!=="staff"||!t.skill2Pressed||i)return;const s=n.character.position,a={id:++n.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};n.abilities.rings.push(a),Ss(n,"ring-place",a.id,s)}function qh(n,t){const e=n.abilities,i=n.config.abilities.arcane,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,o=[];for(const r of e.projectiles){if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let c=!1;if(a)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],f=d.position.x-r.x,h=d.position.z-r.z,u=r.radius+s;if(!(f*f+h*h>u*u)){Vr(n,l,{type:i.hurtType,duration:i.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:i.knockback}),c=!0;break}}c||o.push(r)}e.projectiles=o}function jh(n,t){const e=n.abilities,i=n.config.abilities.ring,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,o=[];for(const r of e.rings){r.life-=t,r.pulseTimer-=t;let c=0;for(;r.pulseTimer<=0&&c++<8;){if(r.pulseTimer+=Math.max(i.pulseInterval,ra),a)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],f=d.position.x-r.x,h=d.position.z-r.z,u=r.radius+s;if(f*f+h*h>u*u)continue;const g=Math.hypot(f,h),_=g>ra?f/g:0,m=g>ra?h/g:1;Vr(n,l,{type:"heavy",duration:i.stun,dirX:_,dirZ:m,knockback:i.knockback})}Ss(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}e.rings=o}function Kh(n,t,e){Yh(n,t,e),Zh(n,e),qh(n,t),jh(n,t)}function $a(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Ac=1e-6;function wc(n,t,e){return n<t?t:n>e?e:n}function cd(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function ld(n){const t=n.camera,e=cd();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Jh(n){const t=n.camera,e=n.config.camera,i=n.character.position;let s=0,a=0,o=0,r=0;for(const l of n.dummies){const d=l.position.x-i.x,f=l.position.z-i.z,h=Math.hypot(d,f);if(h>e.radius)continue;const u=wc((e.radius-h)/Math.max(Ac,e.radius-e.nearDistance),0,1);let g=u*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(g+=e.attackBoost*u),s+=g,a+=l.position.x*g,o+=l.position.z*g,r+=1}const c=s<=0?0:wc(s/(s+Math.max(Ac,e.saturation)),0,1);if(t.threat=c,t.threatCount=r,s<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,d=o/s;t.centroidX=l,t.centroidZ=d;let f=(l-i.x)*e.framingBias*c,h=(d-i.z)*e.framingBias*c;const u=Math.hypot(f,h);u>e.maxOffset&&(f=f/u*e.maxOffset,h=h/u*e.maxOffset),t.offsetX=f,t.offsetZ=h}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Qh(n){const t=[],e=n.ground.size;t.push(Ti("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Ti(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const s=i.openingWidth/2,a=i.wallThickness;t.push(Ti(`${i.id}-left`,"wall",i.x-s-i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Ti(`${i.id}-right`,"wall",i.x+s+i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Ti(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,a,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Ti(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Ti(n,t,e,i,s,a,o,r){return{id:n,kind:t,minX:e-s/2,maxX:e+s/2,minY:o,maxY:r,minZ:i-a/2,maxZ:i+a/2}}const Un=1e-6;function va(n,t,e){return n<t?t:n>e?e:n}function zo(n,t,e,i,s,a,o){const r=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+a+Un||l.maxY<i-o-Un||t+r<l.minX||t-r>l.maxX||e+r<l.minZ||e-r>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Wr(n,t,e,i,s){let a=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const c of n){if(c.maxY<=t.y+s+Un||c.minY>=o-Un)continue;const l=va(t.x,c.minX,c.maxX),d=va(t.z,c.minZ,c.maxZ),f=t.x-l,h=t.z-d,u=f*f+h*h;if(!(u>=e*e))if(a=!0,u>Un*Un){const g=Math.sqrt(u),_=(e-g)/g;t.x+=f*_,t.z+=h*_}else{const g=t.x-c.minX,_=c.maxX-t.x,m=t.z-c.minZ,p=c.maxZ-t.z,x=Math.min(g,_,m,p);x===g?t.x=c.minX-e:x===_?t.x=c.maxX+e:x===m?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function $r(n,t,e,i,s){const a=t.y+i;for(const o of n){if(o.maxY<=t.y+s+Un||o.minY>=a-Un)continue;const r=va(t.x,o.minX,o.maxX),c=va(t.z,o.minZ,o.maxZ),l=t.x-r,d=t.z-c;if(l*l+d*d<e*e-Un)return!0}return!1}const Oo=Math.PI/180,Yr=1e-6;function tu(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Bo(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function dd(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Yr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function hd(n,t,e){const i=n.character,s=Math.hypot(i.velocity.x,i.velocity.z),a=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&s<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Yr)&&a<=Math.max(0,e.inputDeadZone)&&!o}function eu(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function nu(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!hd(n,t,e))return!1;const i=dd(n,t,e.lookRange);if(i===null)return!1;const s=Le(i-n.character.bodyYaw);return Math.abs(s)>Math.max(0,e.triggerDeg)*Oo}function iu(n,t,e){const i=n.turnInPlace,s=n.config.turnInPlace;if(!s.enabled||!n.modules.turnInPlace||!hd(n,e,s)){Bo(n);return}const a=dd(n,e,s.lookRange);if(a===null){Bo(n);return}const o=n.character,r=Le(a-o.bodyYaw),c=Math.abs(r),l=Math.max(0,s.triggerDeg)*Oo,d=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Yr;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,s.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(c,Math.max(0,s.settleDeg)*Oo);i.targetYaw=Le(o.bodyYaw+i.dir*(c-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(s.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const h=Le(i.targetYaw-i.fromYaw);o.bodyYaw=Le(i.fromYaw+h*eu(i.progress)),d||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Ho=1e-6;function Le(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ds(n,t,e,i){const s=Le(t-n);return n+s*(1-Math.exp(-Math.max(e,Ho)*i))}function Rc(n,t,e,i){const s=Le(t-n),a=Math.abs(s);return a<=i||a<=e?t:Le(n+Math.sign(s)*Math.max(e,0))}function su(n,t,e){const i=n.character,s=n.config.orientation,a=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,c=a.phase!=="idle"||a.charging||r||n.dash.phase!=="idle",l=o&&!c,d=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Ho,h=a.charging&&a.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(a.phase!=="idle")i.facing=a.attackFacing;else if(r)i.facing=ys(n,e);else if(l)i.facing=Ds(i.facing,n.gaze.centroidYaw,s.bodyTurnRate,t);else if(f)i.facing=ys(n,e);else if(h)i.facing=n.targeting.targetYaw;else if(d>Math.max(s.facingDeadZone,Ho)){const k=Math.atan2(e.moveX,e.moveZ),R=s.facingTurnRate*Math.PI/180*t,A=s.facingSnapDeg*Math.PI/180;if(d>=.35)i.facing=Rc(i.facing,k,R,A);else if(d>=s.facingMinMagnitude&&Math.abs(Le(k-i.facing))>s.facingDeadbandDeg*Math.PI/180){const b=Ds(i.facing,k,s.facingSmoothRate,t);i.facing=Rc(i.facing,b,R,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const g=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||nu(n,e)||(i.bodyYaw=Ds(i.bodyYaw,g,s.bodyTurnRate,t));let m=i.facing;if(o?m=l?n.gaze.mainYaw:i.facing:f?m=Math.atan2(e.aimX,e.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget&&(m=n.targeting.targetYaw),!o){const k=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Le(m-i.bodyYaw))>k&&(m=i.moveYaw)}const p=l?n.config.gaze.headTurnRate:s.headTurnRate;let x=Ds(i.headYaw,m,p,t);const v=s.maxHeadTurnDeg*Math.PI/180,M=Le(x-i.bodyYaw);M>v?x=i.bodyYaw+v:M<-v&&(x=i.bodyYaw-v),i.headYaw=x}const Go=1e-6,au=Math.PI/180;function Vo(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Zr(n,t,e){return n<t?t:n>e?e:n}function Da(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Xo(n){const t=n.id,e=n.windowId;Object.assign(n,Da()),n.id=t,n.windowId=e}function ou(n){Xo(n)}function ru(n){Xo(n.playerLink);for(const t of n.dummies)Xo(t.link)}function cu(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Wo(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(i.linkWindow=Math.max(i.linkWindow,s),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function Ma(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Da()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function lu(n,t){const e=n.config.links.search,i=n.character.position,s=Zr(e.maxAngleDeg,0,180)*au;let a=0,o=t,r=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,d=c.position.z-i.z,f=Math.hypot(l,d);if(f<Go||f>e.range)continue;const h=Math.atan2(l,d);Math.abs(Le(h-t))>s||f<r&&(r=f,a=c.id,o=h)}return{id:a,yaw:o,dist:a>0?r:0}}function du(n,t,e,i){const s=n.config.links,a=n.playerLink,o=n.character.position,r=ys(n,t),c=lu(n,r),l=c.id>0?c.yaw:r,d=c.id>0?Zr(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=i,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=d,a.travelled=0,a.fromX=o.x,a.fromZ=o.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,s.sharedCooldown),Vo(n,"link-start",a.id)}function hu(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){Ma(n);return}if(e.weapon!==n.combat.weapon){Ma(n);return}e.timer+=t;const s=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Vo(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Vo(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?Zr(r/o,0,1):1,e.phase==="active"&&i.active>Go){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Go,i.active-e.timer),d=c/l;n.impulse.x=Math.sin(e.facing)*d,n.impulse.z=Math.cos(e.facing)*d}}function uu(n,t,e){const i=n.config.links,s=n.playerLink,a=n.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!i.enabled||!n.modules.links){s.phase!=="idle"&&Ma(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&i.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,i.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!r&&Wo(n,"sprint"),s.prevSprinting=r,hu(n,t);const c=i.moves[o.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&du(n,e,c,o.weapon)}const $o=1e-6;function jn(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function ud(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function fd(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=ud()}function fu(n){return{weapon:vi[Math.max(0,n-1)]??vi[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:ud()}}function pu(n,t){return ys(n,t)}function mu(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+a,s)}function pd(n,t,e,i){const s=n.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=i,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=pu(n,t),s.attackProgress=0,s.timings=e,s.attackId+=1,jn(n,"attack-start",i)}function md(n){return Math.max(0,n.config.combat.settle)}function Yo(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];pd(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:md(n),lunge:mu(n,i.lunge[e-1]??0)},e)}function gu(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,pd(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:md(n),lunge:i.lunge},0),jn(n,"charge-release",e)}function _u(n,t,e){const i=n.combat;if(i.phase==="idle")return;const s=i.timings;i.phaseTimer+=t;let a=0;for(;i.phase!=="idle"&&a++<8;){const c=i.phase==="windup"?s.windup:i.phase==="active"?s.active:i.phase==="recovery"?s.recovery:s.settle;if(i.phaseTimer<c)break;if(i.phaseTimer-=c,i.phase==="windup")i.phase="active",jn(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",jn(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&Yo(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const c=i.timings.recovery;if(c>$o&&i.phaseTimer>=c*n.config.combat.cancelWindow){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&Yo(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}const o=s.windup+s.active+s.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=s.windup+i.phaseTimer:i.phase==="recovery"?r=s.windup+s.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1)}function xu(n,t,e){const i=n.combat,s=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=vi.length){const c=vi[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,fd(n),Ma(n),jn(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,jn(n,"combo-reset",0))),_u(n,t,e);const a=s.weapons[i.weapon],o=n.dash.phase==="active";if(a.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(i.phase==="idle"){const d=i.comboWindow>0&&i.comboIndex<a.comboCount?i.comboIndex+1:1;Yo(n,e,d)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&(!o&&!n.playerLink.consumedAttack&&e.attackPressed&&i.phase==="idle"&&!i.charging&&(i.charging=!0,i.charge=0,jn(n,"charge-start",0)),i.charging&&e.attackHeld&&(i.charge=Math.min(1,i.charge+t/Math.max(s.bow.maxChargeTime,$o))),i.charging&&!o&&(e.attackReleased||!e.attackHeld))){i.charging=!1;const c=i.charge;i.charge=0,c>=s.bow.minChargeToFire&&i.phase==="idle"?gu(n,e,c):jn(n,"charge-release",0)}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>$o)){const c=i.timings.lunge/i.timings.active;n.impulse.x=Math.sin(i.attackFacing)*c,n.impulse.z=Math.cos(i.attackFacing)*c}}const Zo=1e-6;function Ya(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function vu(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Mu(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Cc(n,t,e){return n<t?t:n>e?e:n}function yu(n,t,e){const i=n.config.dash,a=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,d=a.x,f=a.z;for(;l<c-Zo;){const h=Math.min(c,l+r),u=a.x+t*h,g=a.z+e*h,_=Cc(u,o.minX,o.maxX),m=Cc(g,o.minZ,o.maxZ),p={x:_,y:a.y,z:m};if($r(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(d=_,f=m,l=h,_!==u||m!==g))break}return{x:d,z:f}}function Su(n,t,e){const i=n.dash,s=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Wo(n,"roll")),i.cooldown>0){const r=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),r>0&&i.cooldown===0&&Ya(n,"dash-ready",0)}const a=n.combat;if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&a.phase==="idle"&&!a.charging&&n.playerLink.phase==="idle"){const r=zh(n,e),c=r.x,l=r.z,d=n.combat.weapon==="staff";if(i.kind=d?"blink":"roll",i.dirX=c,i.dirZ=l,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=d?s.blinkCooldown:s.rollCooldown,d){const f=yu(n,c,l);n.character.position.x=f.x,n.character.position.z=f.z,i.toX=f.x,i.toZ=f.z,i.duration=0,i.timer=0,i.phase="idle",s.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Wo(n,"blink"),Ya(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Zo,s.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*s.rollDistance,i.toZ=i.fromZ+l*s.rollDistance,Ya(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const r=Math.max(Zo,i.timer),c=n.character.position.x,l=n.character.position.z;n.impulse.x=(i.toX-c)/r,n.impulse.z=(i.toZ-l)/r}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const Qe=1e-6,qo=Math.PI*2,bu=7,Eu=18;function Pc(n,t,e){return n<t?t:n>e?e:n}function Tu(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Dc(n,t,e,i){return n+Tu(t-n)*(1-Math.exp(-Math.max(e,Qe)*i))}function qr(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Au(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},s=n.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:rd(),link:Da()})}return t}function wu(n){const t=Wa.indexOf(n);return Wa[(t+1)%Wa.length]}function Ru(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],s=t.spawn[e]??{x:i.homeX,z:i.homeZ},a=t.initialModes[e]??i.initialMode;i.mode=a,i.initialMode=a,i.homeX=s.x,i.homeZ=s.z,i.position.x=s.x,i.position.y=0,i.position.z=s.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=s.x,i.targetZ=s.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,ou(i.link)}n.dummyAttackCount=0}function Cu(n,t,e){const i=$a(n)*qo,s=Math.sqrt($a(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*s,t.targetZ=t.homeZ+Math.sin(i)*s,t.wanderTimer=e.wanderInterval*(.6+$a(n)*.8)}function Pu(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function Du(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const r=Math.max(Pu(t,i),Qe);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",qr(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,o/a)}function Lu(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,s=i.x-t.position.x,a=i.z-t.position.z,o=Math.hypot(s,a),r=o>Qe?s/o:0,c=o>Qe?a/o:0;let l=0,d=0;if(t.mode==="wander"){const h=t.targetX-t.position.x,u=t.targetZ-t.position.z,g=Math.hypot(h,u);(t.wanderTimer<=0||g<.3)&&Cu(n,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(_,m);p>Qe&&(l=_/p,d=m/p)}else if(t.mode==="follow")o>e.followStopDistance&&(l=r,d=c);else if(t.mode==="keep-distance"){const h=o-e.keepDistance;h>e.keepDeadZone?(l=r,d=c):h<-e.keepDeadZone?(l=-r,d=-c):(l=-c*e.keepStrafe,d=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(l=r,d=c);let f=t.facing;return t.mode==="wander"?Math.hypot(l,d)>Qe&&(f=Math.atan2(l,d)):o>Qe&&(f=Math.atan2(r,c)),{x:l,z:d,facing:f}}function Iu(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const m=n.character.position;Math.hypot(m.x-e.position.x,m.z-e.position.z)<=i.attackRange+Qe&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,qr(n,"dummy-attack",e))}Du(n,e,t,i);const s=Lu(n,e,i),a=1-Math.exp(-Math.max(i.acceleration,Qe)*t);e.velocity.x+=(s.x*i.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*i.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=Dc(e.bodyYaw,e.facing,bu,t),e.headYaw=Dc(e.headYaw,e.facing,Eu,t);const o=e.position.x,r=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;Wr(n.boxes,e.position,i.radius,i.height,c)&&$r(n.boxes,e.position,i.radius,i.height,c)&&(e.position.x=o,e.position.z=r,e.velocity.x=0,e.velocity.z=0);const d=n.config.worldBounds;e.position.x=Pc(e.position.x,d.minX,d.maxX),e.position.z=Pc(e.position.z,d.minZ,d.maxZ);const f=zo(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+c+Qe&&(e.position.y=f);const h=Math.hypot(e.position.x-o,e.position.z-r);e.distance+=h;const u=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,u/Math.max(n.config.moveSpeed,Qe)),_=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),Qe);e.stride=_,e.gaitPhase=(e.gaitPhase+h/_*qo)%qo}function ku(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const s=n.dummies[e.dummyClickId-1];s.mode=wu(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,qr(n,"dummy-mode",s)}for(const s of n.dummies)Iu(n,t,s,i)}const Ai=1e-6,Lc=Math.PI*2;function Za(n,t){return Math.sqrt(n*n+t*t)}function Ls(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Uu(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,fd(n)}function Fu(n,t,e){const i=n.config,s=n.character,a=s.position,o=s.velocity;let r=e.moveX,c=e.moveZ;const l=Za(r,c);l>1&&(r/=l,c/=l);const d=n.combat.phase!=="idle",f=n.playerLink.phase!=="idle",h=d||n.dash.phase==="active"||f;s.sprinting=!h&&e.sprintHeld&&l>Ai;const u=i.combat.weapons[n.combat.weapon];let g=u?u.moveMultiplier:1;h?g*=n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=i.abilities.arcane.moveScale);const _=i.moveSpeed*(s.sprinting?i.sprintMultiplier:1)*g;if(h)o.x=r*_,o.z=c*_;else{const G=l>Ai?i.acceleration:i.friction,z=1-Math.exp(-G*t);o.x+=(r*_-o.x)*z,o.z+=(c*_-o.z)*z}e.jumpPressed?s.jumpBuffer=i.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?i.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(o.y=i.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,Ls(n,"jumped",i.jumpSpeed)),n.events.some(G=>G.type==="blink"&&G.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const p=a.x,x=a.z;if(a.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,a.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Wr(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight)){if($r(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight))a.x=p,a.z=x,o.x=0,o.z=0;else{const G=a.x-p,z=a.z-x;Math.abs(G)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(z)<Math.abs(o.z*t)*.5&&(o.z=0)}Ls(n,"blocked",1)}const M=i.worldBounds;a.x=Ic(a.x,M.minX,M.maxX),a.z=Ic(a.z,M.minZ,M.maxZ);const k=zo(n.boxes,a.x,a.z,a.y,i.characterRadius,i.stepHeight,i.fallTolerance);s.grounded&&k>a.y+Ai&&k-a.y<=i.stepHeight+Ai&&(a.y=k,o.y=0,Ls(n,"stepUp",k));const R=a.y;o.y-=i.gravity*t,a.y+=o.y*t;const A=zo(n.boxes,a.x,a.z,R,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);A>Number.NEGATIVE_INFINITY&&a.y<=A&&o.y<=0?(a.y=A,o.y=0,s.grounded||Ls(n,"landed",A),s.grounded=!0):s.grounded=!1;const T=Za(a.x-p,a.z-x);s.distance+=T;const b=Za(o.x,o.z),y=Math.min(i.strideSpeedCap,b/Math.max(i.moveSpeed,Ai)),D=Math.max(i.strideLength*(1+y*i.strideSpeedGain),Ai);s.stride=D,s.gaitPhase=(s.gaitPhase+T/D*Lc)%Lc}function Ic(n,t,e){return n<t?t:n>e?e:n}const jo=1e-6,kc=2.399963229728653;function fi(n,t,e){return n<t?t:n>e?e:n}function Uc(n,t,e,i,s,a,o,r,c){const l=t.x-n.x,d=t.z-n.z,f=Math.hypot(l,d),h=e+i;if(f>=h)return;let u,g,_;f<jo?(u=r,g=c,_=h):(u=l/f,g=d/f,_=h-f);const m=_+o;n.x-=u*m*s,n.z-=g*m*s,t.x+=u*m*a,t.z+=g*m*a}function Nu(n){const t=n.config.separation,e=n.dummies,i=n.character.position,s=n.config.characterRadius,a=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let d=0;d<o;d++){for(let f=0;f<e.length;f++)for(let h=f+1;h<e.length;h++){const u=(f*3+h)*kc;Uc(e[f].position,e[h].position,a,a,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const h=(f+1)*kc;Uc(i,e[f].position,s,a,0,1,r,Math.cos(h),Math.sin(h))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const d of e)Wr(n.boxes,d.position,a,n.config.dummies.height,c),d.position.x=fi(d.position.x,l.minX,l.maxX),d.position.z=fi(d.position.z,l.minZ,l.maxZ)}function zu(n,t,e,i,s,a,o,r){const c=Math.hypot(e,i),l=Math.max(0,r.contactBand),d=fi(r.minScale,0,1);if(c<jo||l<=0||d>=1)return 1;const f=s+o,h=fi(r.approachDot,0,.99);let u=0;for(const g of a){const _=g.position.x-n,m=g.position.z-t,p=Math.hypot(_,m);if(p>=f+l)continue;if(p<jo){u=1;continue}const x=(e*_+i*m)/(c*p);if(x<=h)continue;const v=fi(1-(p-f)/l,0,1),M=fi((x-h)/(1-h),0,1);u=Math.max(u,v*M)}return 1-(1-d)*fi(u,0,1)}function Ou(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=zu(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Fc=1e-6,Bu=Math.PI/180;function Hu(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Gu(n,t,e){return n<t?t:n>e?e:n}function Vu(n,t,e){const i=n.config.targeting,s=n.targeting,a=n.character.position;let o=n.character.facing;Math.hypot(e.moveX,e.moveZ)>Fc&&(o=Math.atan2(e.moveX,e.moveZ));const c=Gu(i.maxAngleDeg,0,180)*Bu;let l=Number.POSITIVE_INFINITY,d=0,f=0,h=0;for(const u of n.dummies){const g=u.position.x-a.x,_=u.position.z-a.z,m=Math.hypot(g,_);if(m<Fc||m>i.range)continue;const p=Math.atan2(g,_),x=Math.abs(Le(p-o));if(x>c)continue;const v=m-i.frontBias*Math.cos(x);v<l&&(l=v,d=u.id,f=p,h=m)}s.targetId=d,s.targetYaw=f,s.targetDist=h,s.hasTarget=d>0}const kn=1e-6;function ya(n,t,e){return n<t?t:n>e?e:n}function Nc(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Xu(n,t,e){const i=n.config.gaze,s=n.gaze;if(!i.enabled||!n.modules.gaze){s.active=!1,s.mainId=0,s.mainYaw=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}const a=n.character.position,o=(y,D)=>{const G=y.position.x-a.x,z=y.position.z-a.z,W=Math.hypot(G,z);if(W<kn||W>D)return 0;const P=ya((D-W)/Math.max(kn,D-i.nearDistance),0,1);let w=P*(i.modeWeight[y.mode]??.5);return y.attackPhase==="active"&&(w+=i.attackBoost*P),w},r=[];let c=0,l=!1,d=!1,f=!1;for(const y of n.dummies){const D=o(y,i.threatRange),G=y.position.x-a.x,z=y.position.z-a.z,W=Math.hypot(G,z);D>0&&(r.push({id:y.id,x:y.position.x,z:y.position.z,dx:G,dz:z,yaw:Math.atan2(G,z),w:D}),c+=D,W<=i.approachDist&&(i.modeWeight[y.mode]??.5)>=i.hostileModeWeight&&(f=!0)),W>kn&&W<=i.recoveryDist&&(l=!0),(y.attackPhase==="windup"||y.attackPhase==="active")&&W<=i.threatRange&&(d=!0)}const h=c<=0?0:ya(c/(c+Math.max(kn,i.saturation)),0,1),u=r.length>0,g=s.active,_=u&&(e.aimActive&&h>=i.enterThreshold||i.reactToAttack&&d&&h>=i.enterThreshold||i.reactToApproach&&f),m=i.hurtHoldSec>kn&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=g&&(l||m);if(s.active=_||p,!s.active){s.mainId=0,s.mainYaw=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}if(r.length===0)return;r.sort((y,D)=>D.w-y.w);const x=r.slice(0,Math.max(1,i.maxThreats)),v=r[0],M=Math.atan2(v.dx,v.dz),k=i.behindAngleDeg*Math.PI/180,R=n.character.bodyYaw;let A=0,T=0,b=0;for(const y of x){const D=Math.abs(Nc(y.yaw-M))/Math.PI;let G=y.w/(1+Math.max(i.spreadFalloff,0)*D*D);y!==v&&i.behindFalloff<1&&Math.abs(Nc(y.yaw-R))>k&&(G*=Math.max(i.behindFalloff,0)),A+=y.x*G,T+=y.z*G,b+=G}s.mainId=v.id,s.mainYaw=M,s.centroidYaw=b>kn?Math.atan2(A/b-a.x,T/b-a.z):M,s.threatCount=r.length,s.threat=h}function Wu(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function $u(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,s=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(s<kn||s>e.threatRange)return 0;const a=Math.max(kn,e.threatRange-e.nearDistance),o=ya((e.threatRange-s)/a,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const c=Math.max(kn,e.modeWeight.attack??1.5);return ya(r/c,0,1)}function Yu(){return{active:!1,mainId:0,mainYaw:0,centroidYaw:0,threatCount:0,threat:0}}function Zu(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:Qh(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:fu(1),playerLink:Da(),abilities:Xh(),impulse:{x:0,z:0},targeting:Hu(),turnInPlace:tu(),playerHurt:rd(),hitCount:0,dash:{...vu(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...cd(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Yu(),dummies:Au(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function qu(n){Uu(n),Ru(n),ru(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=od,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Wh(n),Mu(n),ld(n),Bo(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function zc(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){qu(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Vu(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),uu(n,t,e),n.modules.combat&&xu(n,t,e),n.modules.dash&&Su(n,t,e),n.modules.movement&&Fu(n,t,e),n.modules.gaze&&Xu(n,t,e),n.modules.orientation&&su(n,t,e),iu(n,t,e),n.modules.dummies&&ku(n,t,e),Oh(n,t),cu(n,t),n.modules.abilities&&Kh(n,t,e),n.modules.dummies&&(Vh(n,t),n.modules.separation&&(Nu(n),Ou(n))),n.modules.camera?Jh(n):ld(n),n}function ju(n){let t=0;return{frame(e,i,s,a,o){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const r=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=r&&l<c;){const d=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};zc(n,r,d),o&&o(),t-=r,l++}return l>=c&&(t=0),l},singleStep(e){zc(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const gd={slopPx:12,longPressMs:450,doubleTapMs:280};function Ku(n,t,e=gd.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,s=n.dy/n.distance,a=t.rightX*i+t.forwardX*-s,o=t.rightZ*i+t.forwardZ*-s,r=Math.hypot(a,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:a/r,worldZ:o/r}}function ii(n,t,e,i,s,a){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function Ju(n=gd){const t=new Map,e=new Map,i=s=>t.get(s);return{begin(s,a,o,r,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:o,startY:r,x:o,y:r,startedAt:c,dragging:!1,longFired:!1}),ii(s,"press",0,0,0,1)},move(s,a,o,r){const c=i(s);if(!c)return null;c.x=a,c.y=o;const l=a-c.startX,d=o-c.startY;return!c.dragging&&Math.hypot(l,d)>=n.slopPx?(c.dragging=!0,ii(c.button,"drag",l,d,r-c.startedAt,1)):null},end(s,a,o,r){const c=i(s);if(!c)return null;t.delete(s),c.x=a,c.y=o;const l=a-c.startX,d=o-c.startY,f=r-c.startedAt,h=Math.hypot(l,d);if(c.dragging||c.longFired||h>=n.slopPx)return ii(c.button,"release",l,d,f,1);const u=e.get(c.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(a-u.x,o-u.y)<=n.slopPx*2?(e.delete(c.button),ii(c.button,"doubleTap",l,d,f,2)):(e.set(c.button,{at:r,x:a,y:o}),ii(c.button,"tap",l,d,f,1))},cancel(s,a){const o=i(s);return o?(t.delete(s),ii(o.button,"cancel",o.x-o.startX,o.y-o.startY,a-o.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=n.longPressMs)return a.longFired=!0,ii(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const qa=.001,Qu=18;function Ko(n,t,e){return n<t?t:n>e?e:n}function Jo(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function tf(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function ef(n,t,e,i,s=Qu){const a=tf(t);if(!a)return{state:Jo(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),r=s,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,d=c;if(!Number.isFinite(o)||o<qa)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<qa?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<qa)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,h=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,h):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:Ko(Number.isFinite(u)?u:1,l,d),started:!1,ended:!1,armedNow:!1,pinching:!0}}function nf(n,t,e,i){const s=Math.min(e,i),a=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?Ko(r,s,a):Ko(n,s,a)}function sf(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function af(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const ja=["jump","sprint","reset","attack","skill2"],of=8,rf=16,Ka=10,Oc=14,Bc=140,cf=18,lf=16,df=400,hf=1.0001;function ca(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function uf(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&ca(e)}function ff(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:s}=n,a=()=>Math.max(8,t());let o=null,r=0,c=0,l=0,d=0,f=0,h=0,u=-1,g=0,_=null,m=-1,p=0,x=0,v=0,M=0,k=!1,R=0,A=1,T=0,b=null,y=0,D=0,G=!1,z=null,W=null,P=0,w=0,X=0,H=0,j=!1,Q=!0,ht=-1;const mt=Ju({slopPx:Oc,longPressMs:450,doubleTapMs:350});let Mt=[],Y=null;const tt=new Set;function xt(U){U&&Mt.push(U)}const J=new Map;let _t=Jo(),Pt=!1,Tt=1;function zt(){const U=Array.from(J.values()),et=s(),dt=ef(_t,U,et.pinchGain,et.maxStepRatio,cf);if(_t=dt.state,Pt=dt.pinching,dt.scale!==1&&(Tt*=dt.scale),dt.started||dt.armedNow)b=null,G=!0,z=null;else if(dt.ended&&o===null&&U.length===1){const Lt=U[0];o=Lt.id,r=Lt.x,c=Lt.y,l=0,d=0,f=Lt.x,h=Lt.y,k=!1,R=0,A=1,T=0,performance.now(),b=null,G=!0,z=null}}const St={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},bt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let O=0,$t=0;const Ct={},Dt=new Set,At=[];function yt(){for(const U of ja)Ct[U]!==void 0&&(Ct[U]=void 0),V(U);mt.reset(),tt.clear(),J.clear(),_t=Jo(),Pt=!1,o=null,l=0,d=0,f=0,h=0,k=!1,R=0,A=1,T=0,p=0,x=0,v=0,M=0,_=null,m=-1,b=null,G=!1,z=null,W=null,ht=-1,X=0,H=0,j=!1,Q=!0}const wt=()=>{document.hidden&&yt()},C=U=>{if(U.clientX===0&&U.clientY===0){g++;return}if(ca(U.target)||uf(U.clientX,U.clientY)){tt.add(U.pointerId);return}if(tt.delete(U.pointerId),J.set(U.pointerId,{id:U.pointerId,x:U.clientX,y:U.clientY}),o===null&&!Pt){_=null,m=-1,o=U.pointerId,r=U.clientX,c=U.clientY,l=0,d=0,f=U.clientX,h=U.clientY,performance.now();const et=Number.isFinite(U.screenX)&&Number.isFinite(U.screenY)&&(U.screenX!==0||U.screenY!==0);k=et,R=0,A=1,T=0,p=et?U.screenX:0,x=et?U.screenY:0,v=p,M=x,b=U.pointerId,y=U.clientX,D=U.clientY,G=!1}zt()},S=U=>{if(U.pointerId===W&&(U.pointerType==="mouse"&&U.buttons===0||U.clientX===0&&U.clientY===0&&(P!==0||w!==0)||(Q?(X=U.clientX-P,H=U.clientY-w):(P=U.clientX,w=U.clientY,Q=!0,X=0,H=0))),xt(mt.move(U.pointerId,U.clientX,U.clientY,performance.now())),!tt.has(U.pointerId)&&J.has(U.pointerId)&&(J.set(U.pointerId,{id:U.pointerId,x:U.clientX,y:U.clientY}),zt()),tt.has(U.pointerId)||U.pointerId!==o)return;const et=performance.now();if(_===U.pointerId&&et-m<150){g++;return}const dt=U.clientX,Lt=U.clientY;if(dt===0&&Lt===0&&(r!==0||c!==0)){g++;return}const Bt=dt-f,F=Lt-h,vt=Number.isFinite(U.screenX)&&Number.isFinite(U.screenY),K=vt?U.screenX:0,at=vt?U.screenY:0,it=vt&&(K!==0||at!==0),ut=K-v,Ut=at-M;if(k&&it){const se=Math.hypot(ut,Ut),ce=Math.hypot(Bt,F);if(se>3){if(R=0,T<30&&ce>6&&ut*Bt+Ut*F>.7*se*ce){const Me=se/ce;Me>.2&&Me<5&&(A+=(Me-A)*.3,T++)}}else ce>12&&(R++,R>=2&&(k=!1))}const Xt=Math.hypot(Bt,F);if(!k){const se=u<0?Number.POSITIVE_INFINITY:et-u,ce=it?Math.hypot(ut,Ut):1/0;Xt>28&&(se<200||ce<Xt*.4)&&(r+=Bt,c+=F,g++)}f=dt,h=Lt,v=K,M=at,U.pointerId===b&&Math.hypot(U.clientX-y,U.clientY-D)>of&&(G=!0);let Zt,Vt;k&&it?(Zt=(K-p)/A,Vt=(at-x)/A):(Zt=dt-r,Vt=Lt-c);const oe=Math.hypot(Zt,Vt),ue=a();oe>ue&&(Zt*=ue/oe,Vt*=ue/oe);const Ce=Math.hypot(l,d),we=Math.hypot(Zt,Vt);if(Ce>10&&we>10){const se=Math.abs(Math.atan2(l*Vt-d*Zt,l*Zt+d*Vt)),ce=Math.max(Ce,we)*se,Me=Math.max(Math.hypot(Bt,F),Math.hypot(ut,Ut)/Math.max(.2,A));if(se>.6&&Me<Math.max(6,ce*.5)){g++;return}}l=Zt,d=Vt};function V(U){if(!St[U])return;St[U]=!1,U==="attack"&&(bt.attackReleased=!0);const et=document.getElementById(`btn-${U}`);et==null||et.classList.remove("is-down")}function lt(){o!==null&&(_=o,m=performance.now(),o=null,l=0,d=0,f=0,h=0,k=!1,R=0,A=1,T=0,p=0,x=0,v=0,M=0)}const rt=U=>{const et=J.delete(U.pointerId),dt=tt.delete(U.pointerId);et&&zt(),U.pointerId===W&&(W=null,j?ht=performance.now():(X=0,H=0,ht=-1)),xt(mt.end(U.pointerId,U.clientX,U.clientY,performance.now()));for(const Ft of ja)Ct[Ft]===U.pointerId&&(Ct[Ft]=void 0,V(Ft));const Lt=!et&&!dt&&J.size<=1&&o!==null;(U.pointerId===o||J.size===0||Lt)&&lt(),!dt&&U.pointerId===b&&(!G&&!ca(U.target)&&(z={x:U.clientX,y:U.clientY}),b=null)};for(const U of ja){const et=document.getElementById(`btn-${U}`);if(!et)continue;const dt=U==="attack"||U==="skill2",Lt=F=>{if(F.preventDefault(),Ct[U]===void 0){Ct[U]=F.pointerId,St[U]=!0,U==="jump"&&(bt.jump=!0),U==="reset"&&(bt.reset=!0),U==="sprint"&&(bt.sprintPressed=!0),U==="attack"&&(bt.attackPressed=!0),U==="skill2"&&(bt.skill2=!0),et.classList.add("is-down"),xt(mt.begin(U,F.pointerId,F.clientX,F.clientY,performance.now()));try{et.setPointerCapture(F.pointerId)}catch{}dt&&(W=F.pointerId,P=F.clientX,w=F.clientY,Q=!(F.clientX===0&&F.clientY===0),X=0,H=0,j=!1,ht=-1)}},Ft=F=>{Ct[U]===F.pointerId&&(Ct[U]=void 0,V(U),xt(mt.end(F.pointerId,F.clientX,F.clientY,performance.now())))},Bt=F=>{Ct[U]===F.pointerId&&(Ct[U]=void 0,V(U),xt(mt.cancel(F.pointerId,performance.now())))};et.addEventListener("pointerdown",Lt),et.addEventListener("pointerup",Ft),et.addEventListener("pointercancel",Bt),At.push(()=>{et.removeEventListener("pointerdown",Lt),et.removeEventListener("pointerup",Ft),et.removeEventListener("pointercancel",Bt)})}const st=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const U of st){const et=dt=>{dt.preventDefault(),O=Number(U.dataset.weapon)||0};U.addEventListener("pointerdown",et),At.push(()=>U.removeEventListener("pointerdown",et))}const kt=U=>{const et=U.key.toLowerCase();if((et===" "||et.startsWith("arrow"))&&U.preventDefault(),Dt.has(et))return;Dt.add(et),et===" "&&(bt.jump=!0),et==="r"&&(bt.reset=!0),et==="shift"&&(bt.sprintPressed=!0),et==="j"&&(bt.attackPressed=!0),et==="k"&&(bt.skill2=!0),et>="1"&&et<="5"&&(O=Number(et)),et>="6"&&et<="9"&&($t=Number(et)-5);const dt=Math.max(hf,s().keyStep||1.12);(et==="="||et==="+")&&(Tt*=dt),(et==="-"||et==="_")&&(Tt/=dt)},nt=U=>{const et=U.key.toLowerCase();Dt.has(et)&&(Dt.delete(et),et==="j"&&(bt.attackReleased=!0))},B=U=>{if(ca(U.target))return;U.preventDefault();const et=U.deltaMode===1?U.deltaY*lf:U.deltaMode===2?U.deltaY*df:U.deltaY;Tt*=sf(et,s().wheelStep)},gt=U=>{U.preventDefault()},Z=()=>{u=performance.now()};window.addEventListener("resize",Z),window.addEventListener("orientationchange",Z);const pt=typeof window<"u"?window.visualViewport:null;return pt&&(pt.addEventListener("resize",Z),pt.addEventListener("scroll",Z)),window.addEventListener("pointerdown",C),window.addEventListener("pointermove",S),window.addEventListener("pointerup",rt),window.addEventListener("pointercancel",rt),window.addEventListener("blur",yt),document.addEventListener("visibilitychange",wt),window.addEventListener("keydown",kt),window.addEventListener("keyup",nt),window.addEventListener("wheel",B,{passive:!1}),window.addEventListener("gesturestart",gt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:c,x:f,y:h,dx:f-r,dy:h-c,radius:a(),badMoves:g,screenOk:k,originSX:p,originSY:x,screenX:v,screenY:M,scale:A}},peekAim(){const U=performance.now(),et=Math.hypot(X,H),dt=W!==null||ht>=0&&U-ht<Bc;if(!(dt&&j&&et>=Ka))return{active:!1,holding:dt,x:0,z:0,dx:X,dy:H};const Ft=i(),Bt=X/et,F=H/et,vt=Ft.rightX*Bt+Ft.forwardX*-F,K=Ft.rightZ*Bt+Ft.forwardZ*-F,at=Math.hypot(vt,K)||1;return{active:!0,holding:dt,x:vt/at,z:K/at,dx:X,dy:H}},sample(){var mn;const U=a();let et=o!==null?Math.max(-1,Math.min(1,l/U)):0,dt=o!==null?Math.max(-1,Math.min(1,d/U)):0,Lt=0,Ft=0;(Dt.has("a")||Dt.has("arrowleft"))&&(Lt-=1),(Dt.has("d")||Dt.has("arrowright"))&&(Lt+=1),(Dt.has("w")||Dt.has("arrowup"))&&(Ft-=1),(Dt.has("s")||Dt.has("arrowdown"))&&(Ft+=1),et+=Lt,dt+=Ft;let Bt=Math.hypot(et,dt);Bt>1&&(et/=Bt,dt/=Bt,Bt=1);const F=et,vt=dt;Bt<e&&(et=0,dt=0);const K=i();let at=K.rightX*et+K.forwardX*-dt,it=K.rightZ*et+K.forwardZ*-dt;const ut=Math.hypot(at,it);ut>1&&(at/=ut,it/=ut);const Ut=performance.now();xt(mt.poll(Ut));const Xt=Math.hypot(X,H);W!==null&&(Xt>=rf?j=!0:Xt<Ka&&(j=!1));const Zt=W!==null||ht>=0&&Ut-ht<Bc,Vt=Zt&&j&&Xt>=Ka;let oe=0,ue=0;if(Vt){const ye=X/Xt,nn=H/Xt,ae=K.rightX*ye+K.forwardX*-nn,sn=K.rightZ*ye+K.forwardZ*-nn,an=Math.hypot(ae,sn)||1;oe=ae/an,ue=sn/an}!Zt&&W===null&&(X=0,H=0,ht=-1,j=!1);const Ce=z;z=null;const we=Tt;Tt=1;const se={moveX:at,moveZ:it,jumpPressed:bt.jump,sprintHeld:St.sprint||Dt.has("shift"),sprintPressed:bt.sprintPressed,resetPressed:bt.reset,attackPressed:bt.attackPressed,attackHeld:St.attack||Dt.has("j"),attackReleased:bt.attackReleased,skill2Pressed:bt.skill2,weaponSlot:O,dummyClickId:$t,aimX:oe,aimZ:ue,aimActive:Vt};bt.jump=!1,bt.reset=!1,bt.sprintPressed=!1,bt.attackPressed=!1,bt.attackReleased=!1,bt.skill2=!1,O=0,$t=0;const ce=Mt.map(ye=>Ku(ye,K,Oc));Mt=[],ce.length>0&&(Y=ce[ce.length-1]);const Me=o!==null?"pointer":Dt.size>0?"keyboard":"idle";return{intents:se,stickX:et,stickY:dt,stickRawX:F,stickRawY:vt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:c,stickPxX:f,stickPxY:h,stickBad:g,stickScreenOk:k,stickOriginSX:p,stickOriginSY:x,stickScreenX:v,stickScreenY:M,stickScale:A,stickVpTop:((mn=af())==null?void 0:mn.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:X,aimDY:H,source:Me,tap:Ce,zoomScale:we,gestures:ce,lastGesture:Y}},dispose(){window.removeEventListener("pointerdown",C),window.removeEventListener("pointermove",S),window.removeEventListener("pointerup",rt),window.removeEventListener("pointercancel",rt),window.removeEventListener("blur",yt),document.removeEventListener("visibilitychange",wt),window.removeEventListener("keydown",kt),window.removeEventListener("keyup",nt),window.removeEventListener("wheel",B),window.removeEventListener("resize",Z),window.removeEventListener("orientationchange",Z),pt&&(pt.removeEventListener("resize",Z),pt.removeEventListener("scroll",Z)),window.removeEventListener("gesturestart",gt),mt.reset();for(const U of At)U()}}}const Sa=1,ba=2,Ea=4,_d=8,Ta=16,xs=32,xd=64,vd=128,pf=[[Sa,"atk"],[ba,"dash"],[Ea,"link"],[_d,"air"],[Ta,"hurt"],[xs,"aim"],[xd,"spr"],[vd,"chan"]];function wi(n){if(n===0)return"-";const t=pf.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const mf=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],gf=0,_f=15,Ja=19,xf=21,vf=22,Mf=23,yf=24,xn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},ze=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,rn=n=>Math.round(n*180/Math.PI*10)/10,Qa=Math.PI*2;function rs(n){let t=n%Qa;return t>Math.PI&&(t-=Qa),t<-Math.PI&&(t+=Qa),t}function Sf(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Sa),n.dash.phase!=="idle"&&(e|=ba),n.playerLink.phase!=="idle"&&(e|=Ea),n.character.grounded||(e|=_d),n.playerHurt.type!=="none"&&(e|=Ta),t.intents.aimActive&&(e|=xs),n.character.sprinting&&(e|=xd),n.abilities.channeling&&(e|=vd),e}function bf(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Ef(n){const t={sampleHz:n.sampleHz??xn.sampleHz,sampleCapacity:n.sampleCapacity??xn.sampleCapacity,eventCapacity:n.eventCapacity??xn.eventCapacity,anomalyCapacity:n.anomalyCapacity??xn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??xn.dirJumpDeg,aimDropDeg:n.aimDropDeg??xn.aimDropDeg,freezeMs:n.freezeMs??xn.freezeMs,freezeSpeed:n.freezeSpeed??xn.freezeSpeed,stickLostMs:n.stickLostMs??xn.stickLostMs,spikeMs:n.spikeMs??xn.spikeMs},e=n.meta,i=[],s=[],a=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,c=-1,l=-1e9,d=null,f=0,h=0,u="",g=-1,_=-1,m=-1,p=0,x=-1e9,v=-1,M={},k=null,R=0,A=0,T=0,b=0;function y(P,w){const X=1/t.sampleHz,H=P[gf];H-l<X-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(P),l=H)}function D(P,w,X,H,j,Q){const ht=M[P]??-1e9;if(w-ht<1.2)return;if(M[P]=w,P==="frameSpike"){let Mt=0;for(const Y of a)Y.kind==="frameSpike"&&Mt++;if(Mt>=6)return}a.length>=t.anomalyCapacity&&a.shift();let mt=i.slice(-7);Q&&(mt.length===0||mt[mt.length-1]!==Q)&&(mt=[...mt.slice(-6),Q]),a.push({kind:P,t:ze(w),tick:X,ms:Math.round(H),detail:j,ctx:mt}),P==="dirJump"?o.dirJumps++:P==="aimDrop"?o.aimDrops++:P==="moveFreeze"?o.freezes++:P==="stickLost"?o.stickLosts++:P==="stickJump"?o.stickJumps++:P==="stickBad"?o.stickBads++:P==="stickDrift"&&o.stickDrifts++}function G(P,w,X,H){s.length>=t.eventCapacity&&s.shift(),s.push({t:ze(X),tick:H,k:P,d:w})}function z(P){switch(P.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":x=P.tick;break}}function W(){const P=o,w=P.wallMs/1e3,X=P.gestures,H=mt=>Object.entries(X).filter(([Mt])=>Mt.endsWith(`.${mt}`)).reduce((Mt,[,Y])=>Mt+Y,0),j=[];if(j.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),j.push(`运行 ${w.toFixed(1)}s / ${P.frames} 帧 · ${P.fps.toFixed(1)}fps · 最大 ${P.dtMax.toFixed(0)}ms · 尖峰 ${P.spikes} · 步 ${P.steps}`),j.push(`摇杆活跃 ${w>0?Math.round(P.stickActiveMs/1e3/w*100):0}% · 手势 按下 ${H("press")}（单击 ${H("tap")} / 双击 ${H("doubleTap")} / 拖拽 ${H("drag")} / 长按 ${H("longPress")} / 打断 ${H("cancel")} / 拖放 ${H("release")}）`),j.push(`攻击 ${P.attacks}(中${P.hits}) · 受击 ${P.hurts} · 派生 ${P.links}(中${P.linkHits}) · 翻滚 ${P.rolls} 闪现 ${P.blinks} · 跳 ${P.jumps} · 复位 ${P.resets}`),j.push(`法杖 引导${P.channels} 飞弹${P.bolts} 电环${P.rings} · 弓蓄力${P.bowCharges} · 当前武器 ${u||"-"}`),j.push(`异常 ${P.dirJumps+P.aimDrops+P.freezes+P.stickLosts+P.stickJumps+P.stickBads+P.stickDrifts}（dir ${P.dirJumps} / aim ${P.aimDrops} / freeze ${P.freezes} / stick ${P.stickLosts} / stickJump ${P.stickJumps} / 坏指针 ${P.stickBads} / 坐标漂移 ${P.stickDrifts}） · 掉帧尖峰 ${P.spikes}`+(P.inTurns>0?` · 输入转向 ${P.inTurns} 次（最大 ${P.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const mt of a.slice(-6)){j.push(`· ${mt.kind} @t${mt.t.toFixed(2)} tick${mt.tick} ${mt.ms>0?`${mt.ms}ms `:""}${mt.detail}`);const Mt=mt.ctx.map(tt=>String(tt[_f])).join(" "),Y=mt.ctx.map(tt=>tt[Ja]===""||tt[Ja]==null?".":String(tt[Ja])).join(" ");if(j.push(`  yaw ${Mt}`),j.push(`  in  ${Y}`),mt.kind==="stickJump"||mt.kind==="stickBad"||mt.kind==="stickLost"){const tt=mt.ctx.map(J=>`${J[xf]},${J[vf]}`).join(" "),xt=mt.ctx.map(J=>`${J[Mf]},${J[yf]}`).join(" ");j.push(`  o   ${tt}`),j.push(`  p   ${xt}`)}}if(s.length>0){j.push("最近事件：");for(const mt of s.slice(-12))j.push(`  ${mt.t.toFixed(2)} ${mt.k} ${mt.d}`.trimEnd())}const Q=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",ht=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return j.push(`摇杆坐标源 ${Q}${ht}`),j.push(`UA ${e.ua}`),j.join(`
`)}return{sample(P,w,X,H=0){o.frames++,w.stickHeld&&(w.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=H,o.wallMs+=X,X>o.dtMax&&(o.dtMax=X),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=P.time;const j=P.time;if(c<0&&(c=j),T=j,b=P.tick,!r)return;const Q=P.character,ht=Math.hypot(w.stickX,w.stickY),mt=Math.hypot(Q.velocity.x,Q.velocity.z);u=P.combat.weapon;const Mt=Sf(P,w),Y=Q.facing,xt=Math.hypot(w.intents.moveX,w.intents.moveZ)>.05?Math.atan2(w.intents.moveX,w.intents.moveZ):null;ht>.2&&(o.stickActiveMs+=X);const J=[ze(j),P.tick,Math.round(X*10)/10,ze(w.stickX),ze(w.stickY),ze(w.stickRawX),ze(w.stickRawY),w.stickHeld?1:0,w.source.slice(0,8),ze(w.intents.moveX),ze(w.intents.moveZ),ze(Q.position.x),ze(Q.position.z),ze(Q.velocity.x),ze(Q.velocity.z),rn(Y),rn(Q.bodyYaw),Mt,ze(Q.stride),xt===null?"":rn(xt),w.stickId===null?"":w.stickId,Math.round(w.stickOriginX),Math.round(w.stickOriginY),Math.round(w.stickPxX),Math.round(w.stickPxY),w.stickBad,Math.round(w.stickVpTop),Math.round(w.stickOriginSX),Math.round(w.stickOriginSY),Math.round(w.stickScreenX),Math.round(w.stickScreenY),w.stickScreenOk?1:0,Math.round(w.stickScale*100)/100];y(J);const _t=j*1e3<v;if(X>t.spikeMs&&!_t&&j-c>.6&&(o.spikes++,D("frameSpike",j,P.tick,X,`dt ${X.toFixed(0)}ms fl=${wi(Mt)}`,J)),d!==null&&!_t){const yt=Math.abs(rn(rs(Y-d))),wt=Math.abs(rn(rs(Q.moveYaw-f))),C=(h|Mt)&(Sa|ba|Ea|Ta)|Mt&xs,S=xt===null?null:Math.abs(rn(rs(Y-xt))),V=xt===null||d===null?null:Math.abs(rn(rs(d-xt))),lt=S!==null&&V!==null&&S<V-.5,rt=(h&xs)!==0&&(Mt&xs)===0&&xt===null,st=S!==null&&(S<=12||lt);yt>t.aimDropDeg&&rt?D("aimDrop",j,P.tick,0,`${yt.toFixed(0)}° @aim→none stick(${w.stickX.toFixed(2)},${w.stickY.toFixed(2)}) aim(${w.aimDX.toFixed(0)},${w.aimDY.toFixed(0)}) fl=${wi(Mt)}`,J):yt>t.dirJumpDeg&&C===0&&!rt&&(st?(o.inTurns++,yt>o.inTurnMax&&(o.inTurnMax=yt)):D("dirJump",j,P.tick,0,`${yt.toFixed(0)}° res${S===null?" 无输入":`${S.toFixed(0)}°`} yaw ${rn(d)}→${rn(Y)} in ${xt===null?".":rn(xt)}° mvΔ${wt.toFixed(0)}° aim(${w.aimDX.toFixed(0)},${w.aimDY.toFixed(0)}) fl=${wi(h)}→${wi(Mt)}`,J))}const Pt=(Mt&(Sa|ba|Ea|Ta))!==0,Tt=P.tick-x<30;ht>.35&&mt<t.freezeSpeed&&!Pt&&!Tt?(g<0&&(g=j),j-g>=t.freezeMs/1e3&&j>=_&&(D("moveFreeze",j,P.tick,(j-g)*1e3,`stick(${w.stickX.toFixed(2)},${w.stickY.toFixed(2)}) v${mt.toFixed(2)} ${w.source} fl=${wi(Mt)}`,J),_=j+1.5,g=-1)):g=-1,w.stickHeld?(ht>p&&(p=ht),p>.35&&ht<.06?(m<0&&(m=j),j-m>=t.stickLostMs/1e3&&(D("stickLost",j,P.tick,(j-m)*1e3,`raw(${w.stickRawX.toFixed(2)},${w.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${wi(Mt)}`,J),m=-1,p=0)):m=-1):(p=0,m=-1);const zt=w.stickScale>.2&&w.stickScale<5?w.stickScale:1,St=w.stickScreenOk,bt=St?w.stickScreenX/zt:w.stickPxX,O=St?w.stickScreenY/zt:w.stickPxY,$t=St?w.stickOriginSX/zt:w.stickOriginX,Ct=St?w.stickOriginSY/zt:w.stickOriginY,Dt=bt-$t,At=O-Ct;if(w.stickHeld&&w.stickId!==null){const yt=k;if(yt&&yt.held&&yt.id===w.stickId){const wt=Math.hypot(yt.dx,yt.dy),C=Math.hypot(Dt,At),S=Math.max(wt,C),V=Math.hypot(bt-yt.cx,O-yt.cy),lt=Math.abs(rn(rs(Math.atan2(At,Dt)-Math.atan2(yt.dy,yt.dx)))),rt=S*lt*Math.PI/180,st=Math.hypot($t-yt.ox,Ct-yt.oy);if(S>18&&lt>35&&V<Math.max(5,rt*.35)&&D("stickJump",j,P.tick,0,`Δ${lt.toFixed(0)}° 手指只动${V.toFixed(0)}px(弧长应${rt.toFixed(0)}px) o(${Math.round(yt.ox)},${Math.round(yt.oy)})→(${Math.round($t)},${Math.round(Ct)}) 原点位移${st.toFixed(0)}px p(${Math.round(bt)},${Math.round(O)}) raw(${Math.round(Dt)},${Math.round(At)}) id${w.stickId} ${St?"src=屏幕":"src=client"}`,J),St&&yt.screenOk){const kt=Math.hypot(w.stickPxX-yt.x,w.stickPxY-yt.y),nt=Math.hypot((w.stickScreenX-yt.sx)/zt,(w.stickScreenY-yt.sy)/zt);R+=kt-nt,Math.abs(R)>20&&(D("stickDrift",j,P.tick,0,`client 相对屏幕漂移 ${R>0?"+":""}${R.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(w.stickPxX)},${Math.round(w.stickPxY)}) screen(${Math.round(w.stickScreenX)},${Math.round(w.stickScreenY)})`,J),R=0)}}k={id:w.stickId,ox:$t,oy:Ct,cx:bt,cy:O,x:w.stickPxX,y:w.stickPxY,sx:w.stickScreenX,sy:w.stickScreenY,dx:Dt,dy:At,held:!0,screenOk:St}}else k=null,R=0;if(w.stickBad>A){const yt=w.stickBad-A;D("stickBad",j,P.tick,0,`拦截 ${yt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${w.stickBad}）o(${Math.round(w.stickOriginX)},${Math.round(w.stickOriginY)}) p(${Math.round(w.stickPxX)},${Math.round(w.stickPxY)}) id${w.stickId??"-"}`,J)}A=w.stickBad,d=Y,f=Q.moveYaw,h=Mt},event(P,w){const X=bf(P);z(P),r&&(P.type==="dash-ready"||P.type==="combo-reset"||P.type==="stepUp"||G(P.type,X,w,P.tick))},gesture(P){const w=`${P.button}.${P.kind}`;o.gestures[w]=(o.gestures[w]??0)+1,r&&(P.kind==="longPress"||P.kind==="doubleTap"||P.kind==="drag"||P.kind==="cancel")&&G(`g:${P.kind}`,`${P.button} ${P.heldMs.toFixed(0)}ms d${P.distance.toFixed(0)}px ${P.angleDeg.toFixed(0)}°`,T,b)},suspend(P){v=T*1e3+P,g=-1,m=-1},setEnabled(P){r=P,P||(d=null,k=null,g=-1,m=-1)},clear(){i.length=0,s.length=0,a.length=0,M={},l=-1e9,d=null,h=0,g=-1,m=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,R=0,k=null,A=0;for(const P of Object.keys(o.gestures))delete o.gestures[P]},status(){const P=o.simS,w=a.some(X=>P-X.t<8&&(X.kind==="dirJump"||X.kind==="aimDrop"||X.kind==="moveFreeze"||X.kind==="stickLost"||X.kind==="stickJump"||X.kind==="stickBad"||X.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:s.length,anomalies:a.length,alert:w,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:mf,samples:i.slice(),events:s.slice(),anomalies:a.slice()}},summary:W}}const Tf={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.82},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:7,headTurnRate:30,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Af={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},wf={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.3,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},Rf={core:Tf,scene:Af,view:wf};function jr(n){return JSON.parse(JSON.stringify(n))}const Kr=Rf,Cf=jr(Kr.core),Pf=jr(Kr.scene),cn=jr(Kr.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class bn{constructor(t,e,i,s,a="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),bn.nextNameID=bn.nextNameID||0,this.$name.id=`lil-gui-name-${++bn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Df extends bn{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Qo(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Lf={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Qo,toHexString:Qo},bs={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},If={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=bs.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return bs.toHexString(s)}},kf={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=bs.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return bs.toHexString(s)}},Uf=[Lf,bs,If,kf];function Ff(n){return Uf.find(t=>t.match(n))}class Nf extends bn{constructor(t,e,i,s){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Ff(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=Qo(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class to extends bn{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class zf extends bn{constructor(t,e,i,s,a,o){super(t,e,i,"number"),this._initInput(),this.min(s),this.max(a);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const v=parseFloat(this.$input.value);isNaN(v)||(this._snapClampSetValue(v+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let o=!1,r,c,l,d,f;const h=5,u=x=>{r=x.clientX,c=l=x.clientY,o=!0,d=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=x=>{if(o){const v=x.clientX-r,M=x.clientY-c;Math.abs(M)>h?(x.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(v)>h&&_()}if(!o){const v=x.clientY-l;f-=v*this._step*this._arrowKeyMultiplier(x),d+f>this._max?f=this._max-d:d+f<this._min&&(f=this._min-d),this._snapClampSetValue(d+f)}l=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,v,M,k)=>(p-x)/(v-x)*(k-M)+M,e=p=>{const x=this.$slider.getBoundingClientRect();let v=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(v)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=p=>{e(p.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let o=!1,r,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",h))},f=p=>{if(o){const x=p.touches[0].clientX-r,v=p.touches[0].clientY-c;Math.abs(x)>Math.abs(v)?l(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h))}else p.preventDefault(),e(p.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h)},u=this._callOnFinishChange.bind(this),g=400;let _;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const v=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+v),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(u,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Of extends bn{constructor(t,e,i,s){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Bf extends bn{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Hf=`.lil-gui {
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
}`;function Gf(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Hc=!1;class Aa{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:a="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!Hc&&r&&(Gf(Hf),Hc=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=o}add(t,e,i,s,a){if(Object(i)===i)return new Of(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new zf(this,t,e,i,s,a);case"boolean":return new Df(this,t,e);case"string":return new Bf(this,t,e);case"function":return new to(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new Nf(this,t,e,i)}addFolder(t){const e=new Aa({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof to||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof to)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Vf(n,t,e,i){const s=document.getElementById("debug-panel"),a=s?new Aa({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new Aa({title:"实验台 · 调试面板"}),o=n.config,r=[],c=[],l=C=>{const S=a.addFolder(C);return c.push(S),S},d=(C,S)=>{const V=C.addFolder(S);return r.push(V),V},f=l("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid);const h=d(f,"模块开关");h.add(n.modules,"movement").name("movement"),h.add(n.modules,"combat").name("combat"),h.add(n.modules,"links").name("links"),h.add(n.modules,"orientation").name("orientation"),h.add(n.modules,"turnInPlace").name("turnInPlace"),h.add(n.modules,"targeting").name("targeting"),h.add(n.modules,"hits").name("hits"),h.add(n.modules,"separation").name("separation"),h.add(n.modules,"dash").name("dash"),h.add(n.modules,"camera").name("camera"),h.add(n.modules,"dummies").name("dummies"),h.add(n.modules,"abilities").name("abilities");const u=l("移动 / 输入"),g=d(u,"基础移动参数");g.add(o,"moveSpeed",1,10,.1).name("移动速度"),g.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(o,"acceleration",1,40,.5).name("加速度"),g.add(o,"friction",1,40,.5).name("摩擦"),g.add(o,"gravity",5,60,.5).name("重力"),g.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(o,"characterRadius",.1,.8,.01).name("角色半径"),g.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(o,"strideLength",.3,3,.05).name("基础步幅"),g.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=d(u,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=o.dash,p=d(u,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=o.separation,v=d(u,"角色间分离 / 挤压阻力");v.add(x,"iterations",1,8,1).name("迭代次数"),v.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),v.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),v.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),v.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const M=o.dummies,k=d(u,"假人 AI");k.add(M,"moveSpeed",.5,8,.1).name("移动速度"),k.add(M,"wanderRadius",.5,8,.1).name("游走半径"),k.add(M,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),k.add(M,"followStopDistance",.3,5,.1).name("跟随停距"),k.add(M,"keepDistance",1,10,.1).name("保持距离"),k.add(M,"keepDeadZone",.1,2,.05).name("保持死区"),k.add(M,"attackRange",.5,5,.1).name("攻击距离"),k.add(M,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const R=l("步态 / 停步"),A=d(R,"程序化步态");A.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),A.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),A.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),A.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),A.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),A.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),A.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),A.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),A.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),A.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),A.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),A.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),A.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),A.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)");const T=d(R,"停步收相 / 胸朝向");T.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),T.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),T.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),T.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),T.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const b=d(R,"停步惯性");b.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),b.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),b.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),b.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),b.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),b.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),b.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),d(R,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const D=d(R,"足部 IK"),G=t.ik;D.add(G,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),D.add(G,"weight",0,1,.01).name("钉地权重"),D.add(G,"attackScale",0,1,.01).name("攻击时权重倍率"),D.add(G,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const z=d(R,"惯性倾斜 / 盆骨"),W=t.lean;z.add(W,"accelGain",0,.1,.002).name("前后加速度增益"),z.add(W,"turnGain",0,.2,.005).name("绕圈侧倾增益"),z.add(W,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),z.add(W,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),z.add(W,"smoothing",1,30,1).name("倾斜平滑速率"),z.add(W,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),z.add(W,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),z.add(W,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),z.add(W,"crouchSmoothing",1,30,1).name("下沉平滑速率");const P=o.orientation,w=d(R,"朝向 / 下盘带转");w.add(P,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),w.add(P,"headTurnRate",.5,40,.5).name("头部转向速率"),w.add(P,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),w.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),w.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),w.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const X=d(R,"原地转身 / 停步偏差 (v9s)"),H=o.turnInPlace;X.add(H,"enabled").name("启用原地转身 (关=纯插值)"),X.add(H,"triggerDeg",20,180,5).name("触发夹角 (°)"),X.add(H,"settleDeg",0,60,1).name("转身保留余角 (°)"),X.add(H,"durationSec",.1,1.5,.02).name("转身时长 (s)"),X.add(H,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),X.add(H,"inputDeadZone",0,.5,.01).name("起步输入死区"),X.add(H,"armSec",0,.5,.01).name("触发防抖 (s)"),X.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),X.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),X.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),X.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),X.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),X.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const j=l("战斗 / 受击"),Q=o.combat,ht=d(j,"连击 / 武器"),mt=ht.add(n.combat,"weapon",vi).name("当前武器");ht.add(Q,"comboWindow",.1,2,.05).name("连击窗口 (s)"),ht.add(Q,"settle",0,.8,.01).name("段间停顿 (s)"),ht.add(Q,"attackMoveScale",0,1,.01).name("攻击时移动比例"),ht.add(Q,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),ht.add(Q,"cancelWindow",0,1,.01).name("取消窗口 (s)"),ht.add(Q,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),ht.add(Q,"autoCombo").name("按住自动连击"),ht.add(Q.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),ht.add(Q.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),ht.add(Q.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),ht.add(Q.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),ht.add(Q.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),ht.add(Q.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const Mt=o.abilities;ht.add(Mt.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),ht.add(Mt.arcane,"speed",3,24,.5).name("飞弹速度"),ht.add(Mt.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),ht.add(Mt.ring,"radius",.5,5,.1).name("电环半径"),ht.add(Mt.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),ht.add(Mt.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const Y=d(j,"攻击动作 / 跨步 / 落地");Y.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),Y.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),Y.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const tt=t.animation.stride;Y.add(tt,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),Y.add(tt,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),Y.add(tt,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),Y.add(tt,"cycles",1,3,1).name("每段跨步周期数"),Y.add(tt,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),Y.add(tt,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),Y.add(tt,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),Y.add(tt,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),Y.add(tt,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),Y.add(tt,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),Y.add(tt,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),Y.add(tt,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),Y.add(tt,"heavyScale",0,1,.01).name("大剑重击收敛系数"),Y.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),Y.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),Y.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),Y.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),Y.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),Y.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),Y.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),Y.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),Y.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),Y.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),Y.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),Y.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const xt=d(j,"武器握持");xt.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),xt.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),xt.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),xt.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const J=o.hits,_t=d(j,"命中 / 受击 / 击退");_t.add(J,"arcDeg",10,120,5).name("命中扇区半角 (°)"),_t.add(J,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),_t.add(J,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),_t.add(J,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),_t.add(J.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),_t.add(J.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),_t.add(J,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),_t.add(J,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Pt=o.targeting,Tt=d(j,"目标辅助");Tt.add(Pt,"targetAssist").name("启用目标辅助"),Tt.add(Pt,"range",1,14,.5).name("锁定范围 (m)"),Tt.add(Pt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Tt.add(Pt,"frontBias",0,4,.1).name("朝向加权"),Tt.add(Pt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Tt.add(Pt,"maxLungeScale",1,3,.1).name("前冲最大放大");const zt=d(j,"受击分层"),St=t.hurt;zt.add(St,"enabled").name("启用分层受击 (关=旧版对照)"),zt.add(St,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),zt.add(St,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),zt.add(St,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),zt.add(St,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),zt.add(St,"upperShiftScale",0,1,.01).name("上身位移缩放"),zt.add(St,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),zt.add(St.hitHeight,"light",0,1,.01).name("轻击命中部位"),zt.add(St.hitHeight,"heavy",0,1,.01).name("重击命中部位"),zt.add(St.hitHeight,"knock",0,1,.01).name("击退命中部位"),zt.add(St,"leanLight",0,1.5,.01).name("轻击力度"),zt.add(St,"leanHeavy",0,1.5,.01).name("重击力度"),zt.add(St,"leanKnock",0,1.5,.01).name("击退力度"),zt.add(St,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:St.abdomen},{name:"打肩 (shoulder)",p:St.shoulder}].map(({name:C,p:S})=>{const V=d(zt,C);return V.add(S,"upperPitch",0,2,.01).name("上身前后倾斜"),V.add(S,"upperRoll",0,2,.01).name("上身侧倾"),V.add(S,"upperYaw",0,1.5,.01).name("肩部扭转"),V.add(S,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),V.add(S,"shift",0,.8,.01).name("身体反应位移"),V.add(S,"drop",0,.4,.01).name("整体下沉"),V.add(S,"back",0,.4,.01).name("屁股向后"),V.add(S,"knee",0,1.6,.01).name("屈膝"),V.add(S,"hip",0,1,.01).name("髋前倾"),V.add(S,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),V});const bt=d(j,"派生招"),O=o.links;bt.add(O,"enabled").name("总开关 (false=旧连击)"),bt.add(O.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),bt.add(O.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),bt.add(O.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),bt.add(O,"sharedCooldown",0,3,.05).name("共享 CD (s)"),bt.add(O,"triggerWhileSprinting").name("长跑中可直接触发"),bt.add(O.search,"range",1,14,.1).name("索敌距离 (m)"),bt.add(O.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),bt.add(O.search,"stopDistance",0,3,.05).name("停住距离 (m)");const $t=O.moves["sword-shield"];$t&&(bt.add($t,"enabled").name("剑盾盾击"),bt.add($t,"distance",0,8,.1).name("冲锋极限 (m)"),bt.add($t,"windup",0,.5,.01).name("前摇 (s)"),bt.add($t,"active",0,.8,.01).name("冲锋 / 命中 (s)"),bt.add($t,"recovery",0,.8,.01).name("收势 (s)"),bt.add($t.hit,"radius",0,4,.05).name("命中半径 (m)"),bt.add($t.hit,"width",0,2,.05).name("扫掠半径 (m)"),bt.add($t.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),bt.add($t.hit,"duration",0,1.5,.01).name("僵直 (s)")),bt.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const Ct=l("相机"),Dt=d(Ct,"基础");Dt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),Dt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),Dt.add(t.camera,"distance",6,35,.5).name("距离"),Dt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),Dt.add(t.camera,"fov",25,90,1).name("FOV");const At=o.camera,yt=d(Ct,"智能构图");yt.add(At,"radius",2,18,.5).name("威胁评估半径 (m)"),yt.add(At,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),yt.add(At,"saturation",.5,8,.1).name("威胁归一化饱和"),yt.add(At,"pushIn",0,.5,.01).name("无威胁推进比例"),yt.add(At,"maxPullback",0,1,.02).name("最大拉远比例"),yt.add(At,"maxOffset",0,6,.1).name("最大构图平移 (m)"),yt.add(At,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),yt.add(At,"framingBias",0,1,.05).name("威胁质心平移系数"),yt.add(At,"attackBoost",0,2,.05).name("挥砍中额外加权"),yt.add(At.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),yt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const wt=d(Ct,"缩放");return wt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),wt.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),wt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),wt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),wt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),wt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),wt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),wt.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(C=>C.close()),c.forEach(C=>C.close()),a.close(),{gui:a,refreshWeapon:()=>mt.updateDisplay()}}const eo=Math.PI*2,vn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},Xf=45,Wf=50;function $f(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function cs(n,t,e){const i=$f(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function Yf(n,t){return Math.atan2(n,-t)*180/Math.PI}function Gc(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Is(n){return(n%360+360)%360}const Zf={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function qf(n,t,e,i=8){const s=n.character,a=t.intents,o=Math.hypot(a.moveX,a.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),c=s.velocity,l=Math.hypot(c.x,c.z),d=o>.001?cs(a.moveX,a.moveZ,e):null,f=l>.15?cs(c.x,c.z,e):null,h=cs(Math.sin(s.facing),Math.cos(s.facing),e),u=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?cs(a.aimX,a.aimZ,e):null,g=n.targeting,_=g.hasTarget?cs(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=d!==null&&f!==null?Gc(d,f):null,p=d!==null?Gc(d,h):null,x=m!==null&&m>Xf&&o>=.35&&l>=.4;return{inDeg:d,inLen:Math.min(1,o),rawDeg:r>.02?Yf(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:l,faceDeg:h,lockDeg:_,lockId:g.targetId,lockDist:g.targetDist,aimDeg:u,gapMove:m,gapFace:p,warnMove:x}}function Vc(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>Wf&&(n.inLen>=.35||n.speed>=.4)}const Xc="harness.dirDebug";function jf(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const s=e.querySelector("#dirdbg-canvas"),a=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=s.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(Xc)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),a&&(a.textContent=c?"方向 ⌄":"方向 ▸",a.setAttribute("aria-expanded",String(c)))}l();function d(v){if(c=v,!t)try{window.localStorage.setItem(Xc,v?"1":"0")}catch{}l()}a==null||a.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),d(!c)}),t||window.addEventListener("keydown",v=>{v.key.toLowerCase()==="v"&&!v.metaKey&&!v.ctrlKey&&d(!c)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;s.width=Math.round(h*f),s.height=Math.round(h*f);let u=Zf,g=0,_="",m=8;function p(v){if(!r)return;const M=h,k=h,R=M/2,A=k/2,T=Math.min(M,k)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,M,k),r.beginPath(),r.arc(R,A,T,0,eo),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=v.warnMove?"rgba(251, 191, 36, 0.85)":vn.ring,r.stroke(),r.strokeStyle=vn.grid,r.beginPath(),r.moveTo(R-T,A),r.lineTo(R+T,A),r.moveTo(R,A-T),r.lineTo(R,A+T),r.stroke();for(let G=0;G<8;G++){const z=G*Math.PI/4,W=R+Math.sin(z)*(T-3),P=A-Math.cos(z)*(T-3),w=R+Math.sin(z)*T,X=A-Math.cos(z)*T;r.beginPath(),r.moveTo(W,P),r.lineTo(w,X),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=vn.dead,r.beginPath(),r.arc(R,A,T*b,0,eo),r.stroke(),r.restore());const y=(G,z,W,P,w=!1,X=1)=>{const H=G*Math.PI/180,j=Math.sin(H),Q=-Math.cos(H),ht=T*Math.max(.14,Math.min(1,z)),mt=R+j*T*.14,Mt=A+Q*T*.14,Y=R+j*ht,tt=A+Q*ht;if(r.save(),r.globalAlpha=X,r.strokeStyle=W,r.fillStyle=W,r.lineWidth=P,r.lineCap="round",w&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(mt,Mt),r.lineTo(Y,tt),r.stroke(),!w&&ht>T*.3){const xt=-Q,J=j,_t=5.2;r.beginPath(),r.moveTo(Y+j*1.5,tt+Q*1.5),r.lineTo(Y-j*_t+xt*_t*.72,tt-Q*_t+J*_t*.72),r.lineTo(Y-j*_t-xt*_t*.72,tt-Q*_t-J*_t*.72),r.closePath(),r.fill()}r.restore()},D=(G,z)=>{const W=G*Math.PI/180,P=Math.sin(W),w=-Math.cos(W),X=-w,H=P,j=T+1.5,Q=j+6.5;r.save(),r.fillStyle=z,r.strokeStyle=z,r.lineWidth=1,r.beginPath(),r.moveTo(R+P*Q,A+w*Q),r.lineTo(R+P*j+X*4,A+w*j+H*4),r.lineTo(R+P*j-X*4,A+w*j-H*4),r.closePath(),r.fill(),r.restore()};v.lockDeg!==null&&y(v.lockDeg,1,vn.lock,1,!0,.7),v.rawDeg!==null&&v.stickHeld&&y(v.rawDeg,v.rawLen,vn.raw,1,!0,.9),v.aimDeg!==null&&y(v.aimDeg,1,vn.aim,1.6,!0,.95),y(v.faceDeg,1,vn.face,1.1,!0,.55),v.moveDeg!==null&&y(v.moveDeg,v.speed/Math.max(1,m),vn.move,5.5,!1,.8),v.inDeg!==null&&y(v.inDeg,v.inLen,vn.input,2.2),D(v.faceDeg,vn.face),r.beginPath(),r.arc(R,A,2.2,0,eo),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function x(v,M){const k=T=>T===null?"-":String(Math.round(Is(T)));o.in.textContent=`入 ${k(v.inDeg)}`,o.mv.textContent=`移 ${k(v.moveDeg)}`,o.fc.textContent=`面 ${k(v.faceDeg)}`;const R=T=>T===null?"-":`${Math.round(T)}°`,A=[`Δ入→移 ${R(v.gapMove)}`,`Δ入→面 ${R(v.gapFace)}`];v.speed>.05&&A.push(`v${v.speed.toFixed(1)}`),v.lockDeg!==null&&A.push(`锁#${v.lockId} ${v.lockDist.toFixed(1)}m`),v.aimDeg!==null&&A.push("拖拽瞄准"),o.gap.textContent=A.join("  "),e.classList.toggle("is-warn",v.warnMove||Vc(v,M))}return{update(v,M,k){if(!c)return;m=Math.max(1,v.config.moveSpeed*Math.max(1,v.config.sprintMultiplier));const R=qf(v,M,k,m);u=R;const A=v.combat.phase!=="idle";p(R);const T=performance.now(),b=`${R.inDeg}|${R.moveDeg}|${R.faceDeg}|${R.lockId}|${R.aimDeg}|${R.warnMove}|${R.speed.toFixed(1)}`;(T-g>90||b!==_)&&(g=T,_=b,x(R,A),e.dataset.in=R.inDeg===null?"":Is(R.inDeg).toFixed(1),e.dataset.mv=R.moveDeg===null?"":Is(R.moveDeg).toFixed(1),e.dataset.fc=Is(R.faceDeg).toFixed(1),e.dataset.warn=R.warnMove||Vc(R,A)?"1":"0")},setEnabled:d,toggle(){return d(!c),c},enabled:()=>c,last:()=>u}}const Kf=6,Jf=480,Wc=240,$c=92,Qf=18;function tp(n,t,e,i){const s=t-n;return{t:i,speed:t,drive:t,raw:t,dv:s,accel:e>1e-4?s/e:0,busy:!1}}function ep(n,t,e,i){const a=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:a,speed:Math.min(a,Math.max(1,i))}}function np(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function ip(n={}){const t=Math.max(1,n.windowS??Kf),e=Math.max(60,n.capacity??Jf),i=Math.max(1,n.speedCap??Qf),s=!!(n.container&&n.toggle),a=n.container??document.createElement("div");a.id="motiondbg",n.container||(a.setAttribute("data-ui-region",""),document.body.appendChild(a));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");a.innerHTML=s?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??a.querySelector("#motiondbg-toggle"),c=a.querySelector("#motiondbg-graph"),l=a.querySelector("#motiondbg-read"),d=a.querySelector("#motiondbg-window"),f=a.querySelector("#motiondbg-dir");d.textContent=`${t.toFixed(1)}s`;const h=c.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(Wc*u),c.height=Math.round($c*u);const g=jf({deadZone:n.deadZone,container:f,embedded:!0});let _=!1;function m(T){_=T,a.classList.toggle("is-off",!T),!s&&r&&(r.textContent=T?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(T)),r.setAttribute("aria-label",T?"收起手感调试面板":"展开手感调试面板"))}m(!1),s||(r==null||r.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),m(!_)}),window.addEventListener("keydown",T=>{T.key.toLowerCase()==="v"&&!T.metaKey&&!T.ctrlKey&&m(!_)}));const p=[];let x=0,v=null,M=-1,k={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function R(T){const b=T-t;let y=0;for(;y<p.length&&p[y].t<b;)y++;return p.slice(y)}function A(T,b){if(!h)return;const y=Wc,D=$c;h.setTransform(u,0,0,u,0,0),h.clearRect(0,0,y,D),h.fillStyle="rgba(8, 12, 17, 0.55)",h.fillRect(0,0,y,D);const G=4,z=4,W=y-G-z,P=9,w=46,X=62,H=22,j=b-t,Q=J=>G+Math.max(0,Math.min(1,(J-j)/t))*W;for(let J=0;J<T.length;J++){if(!T[J].busy)continue;const _t=Q(T[J].t),Pt=J+1<T.length?Q(T[J+1].t):_t+2;h.fillStyle="rgba(251, 146, 60, 0.13)",h.fillRect(_t,P,Math.max(2,Pt-_t),w)}h.strokeStyle="rgba(150, 190, 220, 0.14)",h.lineWidth=1,h.beginPath();for(const J of[P,P+w/2,P+w])h.moveTo(G,J),h.lineTo(y-z,J);h.moveTo(G,X+H/2),h.lineTo(y-z,X+H/2),h.stroke();const mt=Math.max(1,...T.map(J=>J.speed),...T.map(J=>J.drive))*1.15,Mt=J=>P+w-J/mt*w;if(T.length>1){h.beginPath(),h.moveTo(Q(T[0].t),Mt(T[0].speed));for(let J=1;J<T.length;J++)h.lineTo(Q(T[J].t),Mt(T[J].speed));h.strokeStyle="#38bdf8",h.lineWidth=1.8,h.lineJoin="round",h.stroke(),h.lineTo(Q(T[T.length-1].t),P+w),h.lineTo(Q(T[0].t),P+w),h.closePath(),h.fillStyle="rgba(56, 189, 248, 0.14)",h.fill(),h.beginPath(),h.moveTo(Q(T[0].t),Mt(T[0].drive));for(let J=1;J<T.length;J++)h.lineTo(Q(T[J].t),Mt(T[J].drive));h.setLineDash([3,3]),h.strokeStyle="rgba(190, 205, 220, 0.6)",h.lineWidth=1.2,h.stroke(),h.setLineDash([])}let Y=.02;for(const J of T)Y=Math.max(Y,Math.abs(J.dv));Y*=1.1;const tt=X+H/2,xt=H/2;for(const J of T){const _t=Math.min(xt,Math.abs(J.dv)/Y*xt);h.fillStyle=J.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",h.fillRect(Q(J.t)-.7,J.dv>=0?tt-_t:tt,1.4,Math.max(.5,_t))}h.font="9px ui-monospace, monospace",h.fillStyle="rgba(190, 214, 234, 0.55)",h.textAlign="left",h.fillText(mt.toFixed(1),G+2,P+8),h.fillText("v",G+2,P+w-2),h.fillText("Δv",G+2,X+9),h.textAlign="right",h.fillText("0",y-z-2,P+w-2),h.textAlign="left"}return{dirDebug:g,update(T,b,y){const D=performance.now()/1e3,G=M<0?1/60:Math.max(1e-4,Math.min(.25,D-M));M=D;const z=T.character,W={x:z.position.x,z:z.position.z},P=Math.hypot(z.velocity.x,z.velocity.z),{speed:w,raw:X}=v?ep(v,W,G,i):{speed:0,raw:0},H=tp(x,w,G,D);H.drive=P,H.raw=X,H.busy=np(T),v=W,x=w,p.push(H),p.length>e&&p.shift();const j=R(D);let Q=0;for(const ht of j)Q=Math.max(Q,ht.speed);if(k={speed:w,drive:P,raw:X,dv:H.dv,accel:H.accel,peak:Q,samples:j.length,windowS:t,busy:H.busy},g.update(T,b,y),_){A(j,D);const ht=H.dv>=0?"+":"";l.textContent=`v ${w.toFixed(2)} · 驱 ${P.toFixed(2)} · 峰 ${Q.toFixed(2)} · Δv ${ht}${H.dv.toFixed(3)} · ${j.length} 帧`}},setEnabled:m,toggle(){return m(!_),_},enabled:()=>_,last:()=>({...k}),samples:()=>R(performance.now()/1e3).map(T=>({...T}))}}const sp=["剑盾","双剑","大剑","法杖","弓"],ap={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function op(n){return{update(t,e,i,s,a,o,r=!1){const c=t.character,l=c.position,d=c.velocity,f=t.combat,h=t.events.length>0?t.events[t.events.length-1]:null,u=St=>St.toFixed(2),g=St=>(St*180/Math.PI).toFixed(0),_=sp[vi.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),p="|".repeat(m)+".".repeat(10-m),x=t.dash,v=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,M=x.phase==="active"?`${x.kind}@${v.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,k=s.intents.aimActive?`(${u(s.intents.aimX)},${u(s.intents.aimZ)})`:"-",R=d.x*Math.sin(c.bodyYaw)+d.z*Math.cos(c.bodyYaw),A=d.x*Math.cos(c.bodyYaw)-d.z*Math.sin(c.bodyYaw),T=Math.abs(R)+Math.abs(A)+1e-6,b=Math.round(Math.abs(A)/T*100),y=`strafe ${b}%${R<-.05?" back":""}`,D=t.camera,G=`threat ${(D.threat*100).toFixed(0)}%  dist×${u(D.distanceScale)}  off (${u(D.offsetX)},${u(D.offsetZ)})  pitch +${u(D.pitchDelta)}°  n=${D.threatCount}`,z=o?u(o.attackBlend):"-",W=o==null?void 0:o.attackWeights,P=W?`gw ${u(W.gaitScale)}  lw ${u(W.attackLegWeight)}  spd ${u(W.driveSpeed)}`:"-",w=W?`${u(W.gaitScale)}/${u(W.attackLegWeight)}`:"-",X=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",H=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",j=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",Q=o==null?void 0:o.hurt,ht=Q?`hurt ${t.playerHurt.type}  部位h${u(Q.hitHeight)}  脉冲p${u(Q.pulse)}  上身${u(Q.upperShift)}  重心${u(Q.comShift)}  后坐${u(Q.pelvisBack)}  屈膝${u(Q.knee)}`:"-",mt=Q?`${u(Q.hitHeight)}/${u(Q.pulse)}/${u(Q.knee)}`:"-",Mt=o==null?void 0:o.ik,Y=Mt?`${Mt.active?"on":"off"} w${u(Mt.weight)} e${u(Mt.maxError)}`:"-",tt=t.playerLink,xt=`link ${tt.kind||"-"}  ${tt.phase}  prog ${u(tt.progress)}  win ${u(tt.linkWindow)}s  cd ${u(tt.cooldown)}s  hits ${tt.hitIds.length}  travel ${u(tt.travelled)}/${u(tt.travel)}m  id ${tt.id}`,J=`${tt.phase}/${tt.kind||"-"}/w${u(tt.linkWindow)}`,_t=s.lastGesture,Pt=_t?`${_t.button} ${_t.kind} ${_t.heldMs.toFixed(0)}ms d${_t.distance.toFixed(0)}px ${_t.angleDeg.toFixed(0)}° taps${_t.taps}`:"-",Tt=t.dummies.map(St=>`${St.id}:${ap[St.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${tt.phase}${tt.kind?`/${tt.kind}`:""} w${u(tt.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(l.x)},${u(l.y)},${u(l.z)})  vel (${u(d.x)},${u(d.y)},${u(d.z)})`,`face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  st${b}%  stick(${u(s.stickX)},${u(s.stickY)}) ${s.source}  str${u(c.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${M}  ab ${z}  gw/lw ${w}  land ${H}  ik ${Y}`,`aim ${k}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${mt}`,`dummies ${Tt}  atkCount ${t.dummyAttackCount}  cam ${(D.threat*100).toFixed(0)}% ×${u(D.distanceScale)}  ${j}  lk ${J}`,`event ${h?`${h.type} ${u(h.value)}`:"-"}  scale ${u(a.timeScale)}${a.paused?" [P]":""}  g ${Pt}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(l.x)}, ${u(l.y)}, ${u(l.z)})`,`vel  (${u(d.x)}, ${u(d.y)}, ${u(d.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${g(c.facing)}deg   atkBlend ${z}   ${P}   land ${X}`,ht,`ik ${Y}  clamped ${Mt?Mt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  (head-body ${g(c.headYaw-c.bodyYaw)})  ${y}`,`move (${u(s.intents.moveX)}, ${u(s.intents.moveZ)})  stick (${u(s.stickX)}, ${u(s.stickY)})  ${s.source}  aim ${k}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${v.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,xt,`camera ${G}  ${j}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Tt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${h?`${h.type} ${u(h.value)}`:"-"}   scale ${u(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${Pt}`].join(`
`)}}}const ks=["hud","motion","debug"],Yc={hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}};function rp(n){var c;const t=Object.fromEntries(ks.map(l=>[l,document.getElementById(`${l==="motion"?"motiondbg":l==="debug"?"debug":"hud"}-toggle`)])),e=Object.fromEntries(ks.map(l=>[l,document.getElementById(l==="motion"?"motiondbg":l==="debug"?"debug-panel":"hud")]));let i={},s=null;function a(){var l,d,f;for(const h of ks){const u=s===h,g=t[h],_=e[h];g&&(g.setAttribute("aria-expanded",String(u)),g.textContent=`${Yc[h].short} ${u?"▾":"▸"}`,g.setAttribute("aria-label",`${u?"收起":"展开"}${Yc[h].full}`)),_&&_.classList.toggle("is-open",u)}n.classList.toggle("is-compact",s!=="hud"),(l=i.motion)==null||l.setEnabled(s==="motion"),s==="debug"?(d=i.debug)==null||d.open():(f=i.debug)==null||f.close()}function o(l){s=s===l?null:l,a()}function r(){s!==null&&(s=null,a())}for(const l of ks)(c=t[l])==null||c.addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),o(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&o("motion")}),a(),{hudCompact:()=>s!=="hud",register(l){i=l,a()},toggle:o,closeAll:r,isOpen:l=>s===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Jr="170",cp=0,Zc=1,lp=2,Md=1,yd=2,In=3,Qn=0,He=1,Fe=2,Kn=0,Vi=1,qc=2,jc=3,Kc=4,dp=5,pi=100,hp=101,up=102,fp=103,pp=104,mp=200,gp=201,_p=202,xp=203,tr=204,er=205,vp=206,Mp=207,yp=208,Sp=209,bp=210,Ep=211,Tp=212,Ap=213,wp=214,nr=0,ir=1,sr=2,$i=3,ar=4,or=5,rr=6,cr=7,Qr=0,Rp=1,Cp=2,Jn=0,Pp=1,Dp=2,Lp=3,Ip=4,kp=5,Up=6,Fp=7,Sd=300,Yi=301,Zi=302,lr=303,dr=304,La=306,hr=1e3,gi=1001,ur=1002,pn=1003,Np=1004,Us=1005,Sn=1006,no=1007,_i=1008,On=1009,bd=1010,Ed=1011,Es=1012,tc=1013,Mi=1014,Fn=1015,As=1016,ec=1017,nc=1018,qi=1020,Td=35902,Ad=1021,wd=1022,fn=1023,Rd=1024,Cd=1025,Xi=1026,ji=1027,Pd=1028,ic=1029,Dd=1030,sc=1031,ac=1033,la=33776,da=33777,ha=33778,ua=33779,fr=35840,pr=35841,mr=35842,gr=35843,_r=36196,xr=37492,vr=37496,Mr=37808,yr=37809,Sr=37810,br=37811,Er=37812,Tr=37813,Ar=37814,wr=37815,Rr=37816,Cr=37817,Pr=37818,Dr=37819,Lr=37820,Ir=37821,fa=36492,kr=36494,Ur=36495,Ld=36283,Fr=36284,Nr=36285,zr=36286,zp=3200,Op=3201,Id=0,Bp=1,qn="",je="srgb",Ji="srgb-linear",Ia="linear",re="srgb",Ri=7680,Jc=519,Hp=512,Gp=513,Vp=514,kd=515,Xp=516,Wp=517,$p=518,Yp=519,Qc=35044,tl="300 es",Nn=2e3,wa=2001;class Qi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let a=0,o=s.length;a<o;a++)s[a].call(this,t);t.target=null}}}const Pe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],pa=Math.PI/180,Or=180/Math.PI;function ws(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Pe[n&255]+Pe[n>>8&255]+Pe[n>>16&255]+Pe[n>>24&255]+"-"+Pe[t&255]+Pe[t>>8&255]+"-"+Pe[t>>16&15|64]+Pe[t>>24&255]+"-"+Pe[e&63|128]+Pe[e>>8&255]+"-"+Pe[e>>16&255]+Pe[e>>24&255]+Pe[i&255]+Pe[i>>8&255]+Pe[i>>16&255]+Pe[i>>24&255]).toLowerCase()}function Be(n,t,e){return Math.max(t,Math.min(e,n))}function Zp(n,t){return(n%t+t)%t}function io(n,t,e){return(1-e)*n+e*t}function ls(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Oe(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class te{constructor(t=0,e=0){te.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Be(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),a=this.x-t.x,o=this.y-t.y;return this.x=a*i-o*s+t.x,this.y=a*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yt{constructor(t,e,i,s,a,o,r,c,l){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,o,r,c,l)}set(t,e,i,s,a,o,r,c,l){const d=this.elements;return d[0]=t,d[1]=s,d[2]=r,d[3]=e,d[4]=a,d[5]=c,d[6]=i,d[7]=o,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,o=i[0],r=i[3],c=i[6],l=i[1],d=i[4],f=i[7],h=i[2],u=i[5],g=i[8],_=s[0],m=s[3],p=s[6],x=s[1],v=s[4],M=s[7],k=s[2],R=s[5],A=s[8];return a[0]=o*_+r*x+c*k,a[3]=o*m+r*v+c*R,a[6]=o*p+r*M+c*A,a[1]=l*_+d*x+f*k,a[4]=l*m+d*v+f*R,a[7]=l*p+d*M+f*A,a[2]=h*_+u*x+g*k,a[5]=h*m+u*v+g*R,a[8]=h*p+u*M+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8];return e*o*d-e*r*l-i*a*d+i*r*c+s*a*l-s*o*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],f=d*o-r*l,h=r*c-d*a,u=l*a-o*c,g=e*f+i*h+s*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(s*l-d*i)*_,t[2]=(r*i-s*o)*_,t[3]=h*_,t[4]=(d*e-s*c)*_,t[5]=(s*a-r*e)*_,t[6]=u*_,t[7]=(i*c-l*e)*_,t[8]=(o*e-i*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,a,o,r){const c=Math.cos(a),l=Math.sin(a);return this.set(i*c,i*l,-i*(c*o+l*r)+o+t,-s*l,s*c,-s*(-l*o+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(so.makeScale(t,e)),this}rotate(t){return this.premultiply(so.makeRotation(-t)),this}translate(t,e){return this.premultiply(so.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const so=new Yt;function Ud(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Ra(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function qp(){const n=Ra("canvas");return n.style.display="block",n}const el={};function gs(n){n in el||(el[n]=!0,console.warn(n))}function jp(n,t,e){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:i()}}setTimeout(a,e)})}function Kp(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Jp(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ee={enabled:!0,workingColorSpace:Ji,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===re&&(n.r=zn(n.r),n.g=zn(n.g),n.b=zn(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===re&&(n.r=Wi(n.r),n.g=Wi(n.g),n.b=Wi(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===qn?Ia:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function zn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Wi(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const nl=[.64,.33,.3,.6,.15,.06],il=[.2126,.7152,.0722],sl=[.3127,.329],al=new Yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ol=new Yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ee.define({[Ji]:{primaries:nl,whitePoint:sl,transfer:Ia,toXYZ:al,fromXYZ:ol,luminanceCoefficients:il,workingColorSpaceConfig:{unpackColorSpace:je},outputColorSpaceConfig:{drawingBufferColorSpace:je}},[je]:{primaries:nl,whitePoint:sl,transfer:re,toXYZ:al,fromXYZ:ol,luminanceCoefficients:il,outputColorSpaceConfig:{drawingBufferColorSpace:je}}});let Ci;class Qp{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ci===void 0&&(Ci=Ra("canvas")),Ci.width=t.width,Ci.height=t.height;const i=Ci.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Ci}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ra("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let o=0;o<a.length;o++)a[o]=zn(a[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(zn(e[i]/255)*255):e[i]=zn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let tm=0;class Fd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:tm++}),this.uuid=ws(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let o=0,r=s.length;o<r;o++)s[o].isDataTexture?a.push(ao(s[o].image)):a.push(ao(s[o]))}else a=ao(s);i.url=a}return e||(t.images[this.uuid]=i),i}}function ao(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Qp.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let em=0;class Ge extends Qi{constructor(t=Ge.DEFAULT_IMAGE,e=Ge.DEFAULT_MAPPING,i=gi,s=gi,a=Sn,o=_i,r=fn,c=On,l=Ge.DEFAULT_ANISOTROPY,d=qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:em++}),this.uuid=ws(),this.name="",this.source=new Fd(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new te(0,0),this.repeat=new te(1,1),this.center=new te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Sd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case hr:t.x=t.x-Math.floor(t.x);break;case gi:t.x=t.x<0?0:1;break;case ur:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case hr:t.y=t.y-Math.floor(t.y);break;case gi:t.y=t.y<0?0:1;break;case ur:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ge.DEFAULT_IMAGE=null;Ge.DEFAULT_MAPPING=Sd;Ge.DEFAULT_ANISOTROPY=1;class me{constructor(t=0,e=0,i=0,s=1){me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*a,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*a,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*a,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,a;const c=t.elements,l=c[0],d=c[4],f=c[8],h=c[1],u=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(d-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(l+1)/2,M=(u+1)/2,k=(p+1)/2,R=(d+h)/4,A=(f+_)/4,T=(g+m)/4;return v>M&&v>k?v<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(v),s=R/i,a=A/i):M>k?M<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(M),i=R/s,a=T/s):k<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(k),i=A/a,s=T/a),this.set(i,s,a,e),this}let x=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(h-d)*(h-d));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(f-_)/x,this.z=(h-d)/x,this.w=Math.acos((l+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class nm extends Qi{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new me(0,0,t,e),this.scissorTest=!1,this.viewport=new me(0,0,t,e);const s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new Ge(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=a.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Fd(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class yi extends nm{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Nd extends Ge{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=pn,this.minFilter=pn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class im extends Ge{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=pn,this.minFilter=pn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Rs{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,a,o,r){let c=i[s+0],l=i[s+1],d=i[s+2],f=i[s+3];const h=a[o+0],u=a[o+1],g=a[o+2],_=a[o+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=f;return}if(r===1){t[e+0]=h,t[e+1]=u,t[e+2]=g,t[e+3]=_;return}if(f!==_||c!==h||l!==u||d!==g){let m=1-r;const p=c*h+l*u+d*g+f*_,x=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const k=Math.sqrt(v),R=Math.atan2(k,p*x);m=Math.sin(m*R)/k,r=Math.sin(r*R)/k}const M=r*x;if(c=c*m+h*M,l=l*m+u*M,d=d*m+g*M,f=f*m+_*M,m===1-r){const k=1/Math.sqrt(c*c+l*l+d*d+f*f);c*=k,l*=k,d*=k,f*=k}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,a,o){const r=i[s],c=i[s+1],l=i[s+2],d=i[s+3],f=a[o],h=a[o+1],u=a[o+2],g=a[o+3];return t[e]=r*g+d*f+c*u-l*h,t[e+1]=c*g+d*h+l*f-r*u,t[e+2]=l*g+d*u+r*h-c*f,t[e+3]=d*g-r*f-c*h-l*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,a=t._z,o=t._order,r=Math.cos,c=Math.sin,l=r(i/2),d=r(s/2),f=r(a/2),h=c(i/2),u=c(s/2),g=c(a/2);switch(o){case"XYZ":this._x=h*d*f+l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f-h*u*g;break;case"YXZ":this._x=h*d*f+l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f+h*u*g;break;case"ZXY":this._x=h*d*f-l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f-h*u*g;break;case"ZYX":this._x=h*d*f-l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f+h*u*g;break;case"YZX":this._x=h*d*f+l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f-h*u*g;break;case"XZY":this._x=h*d*f-l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f+h*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],a=e[8],o=e[1],r=e[5],c=e[9],l=e[2],d=e[6],f=e[10],h=i+r+f;if(h>0){const u=.5/Math.sqrt(h+1);this._w=.25/u,this._x=(d-c)*u,this._y=(a-l)*u,this._z=(o-s)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(d-c)/u,this._x=.25*u,this._y=(s+o)/u,this._z=(a+l)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(a-l)/u,this._x=(s+o)/u,this._y=.25*u,this._z=(c+d)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-s)/u,this._x=(a+l)/u,this._y=(c+d)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Be(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,a=t._z,o=t._w,r=e._x,c=e._y,l=e._z,d=e._w;return this._x=i*d+o*r+s*l-a*c,this._y=s*d+o*c+a*r-i*l,this._z=a*d+o*l+i*c-s*r,this._w=o*d-i*r-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,a=this._z,o=this._w;let r=o*t._w+i*t._x+s*t._y+a*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=s,this._z=a,this;const c=1-r*r;if(c<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*s+e*this._y,this._z=u*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,r),f=Math.sin((1-e)*d)/l,h=Math.sin(e*d)/l;return this._w=o*f+this._w*h,this._x=i*f+this._x*h,this._y=s*f+this._y*h,this._z=a*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class q{constructor(t=0,e=0,i=0){q.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(rl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(rl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6]*s,this.y=a[1]*e+a[4]*i+a[7]*s,this.z=a[2]*e+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=t.elements,o=1/(a[3]*e+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*i+a[8]*s+a[12])*o,this.y=(a[1]*e+a[5]*i+a[9]*s+a[13])*o,this.z=(a[2]*e+a[6]*i+a[10]*s+a[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,a=t.x,o=t.y,r=t.z,c=t.w,l=2*(o*s-r*i),d=2*(r*e-a*s),f=2*(a*i-o*e);return this.x=e+c*l+o*f-r*d,this.y=i+c*d+r*l-a*f,this.z=s+c*f+a*d-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s,this.y=a[1]*e+a[5]*i+a[9]*s,this.z=a[2]*e+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,a=t.z,o=e.x,r=e.y,c=e.z;return this.x=s*c-a*r,this.y=a*o-i*c,this.z=i*r-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return oo.copy(this).projectOnVector(t),this.sub(oo)}reflect(t){return this.sub(oo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Be(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const oo=new q,rl=new Rs;class Cs{constructor(t=new q(1/0,1/0,1/0),e=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ln.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ln.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ln.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const a=i.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=a.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ln):ln.fromBufferAttribute(a,o),ln.applyMatrix4(t.matrixWorld),this.expandByPoint(ln);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Fs.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Fs.copy(i.boundingBox)),Fs.applyMatrix4(t.matrixWorld),this.union(Fs)}const s=t.children;for(let a=0,o=s.length;a<o;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ln),ln.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ds),Ns.subVectors(this.max,ds),Pi.subVectors(t.a,ds),Di.subVectors(t.b,ds),Li.subVectors(t.c,ds),Vn.subVectors(Di,Pi),Xn.subVectors(Li,Di),si.subVectors(Pi,Li);let e=[0,-Vn.z,Vn.y,0,-Xn.z,Xn.y,0,-si.z,si.y,Vn.z,0,-Vn.x,Xn.z,0,-Xn.x,si.z,0,-si.x,-Vn.y,Vn.x,0,-Xn.y,Xn.x,0,-si.y,si.x,0];return!ro(e,Pi,Di,Li,Ns)||(e=[1,0,0,0,1,0,0,0,1],!ro(e,Pi,Di,Li,Ns))?!1:(zs.crossVectors(Vn,Xn),e=[zs.x,zs.y,zs.z],ro(e,Pi,Di,Li,Ns))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ln).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ln).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Rn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Rn=[new q,new q,new q,new q,new q,new q,new q,new q],ln=new q,Fs=new Cs,Pi=new q,Di=new q,Li=new q,Vn=new q,Xn=new q,si=new q,ds=new q,Ns=new q,zs=new q,ai=new q;function ro(n,t,e,i,s){for(let a=0,o=n.length-3;a<=o;a+=3){ai.fromArray(n,a);const r=s.x*Math.abs(ai.x)+s.y*Math.abs(ai.y)+s.z*Math.abs(ai.z),c=t.dot(ai),l=e.dot(ai),d=i.dot(ai);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>r)return!1}return!0}const sm=new Cs,hs=new q,co=new q;class ka{constructor(t=new q,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):sm.setFromPoints(t).getCenter(i);let s=0;for(let a=0,o=t.length;a<o;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;hs.subVectors(t,this.center);const e=hs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(hs,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(co.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(hs.copy(t.center).add(co)),this.expandByPoint(hs.copy(t.center).sub(co))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Cn=new q,lo=new q,Os=new q,Wn=new q,ho=new q,Bs=new q,uo=new q;class oc{constructor(t=new q,e=new q(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Cn.copy(this.origin).addScaledVector(this.direction,e),Cn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){lo.copy(t).add(e).multiplyScalar(.5),Os.copy(e).sub(t).normalize(),Wn.copy(this.origin).sub(lo);const a=t.distanceTo(e)*.5,o=-this.direction.dot(Os),r=Wn.dot(this.direction),c=-Wn.dot(Os),l=Wn.lengthSq(),d=Math.abs(1-o*o);let f,h,u,g;if(d>0)if(f=o*c-r,h=o*r-c,g=a*d,f>=0)if(h>=-g)if(h<=g){const _=1/d;f*=_,h*=_,u=f*(f+o*h+2*r)+h*(o*f+h+2*c)+l}else h=a,f=Math.max(0,-(o*h+r)),u=-f*f+h*(h+2*c)+l;else h=-a,f=Math.max(0,-(o*h+r)),u=-f*f+h*(h+2*c)+l;else h<=-g?(f=Math.max(0,-(-o*a+r)),h=f>0?-a:Math.min(Math.max(-a,-c),a),u=-f*f+h*(h+2*c)+l):h<=g?(f=0,h=Math.min(Math.max(-a,-c),a),u=h*(h+2*c)+l):(f=Math.max(0,-(o*a+r)),h=f>0?a:Math.min(Math.max(-a,-c),a),u=-f*f+h*(h+2*c)+l);else h=o>0?-a:a,f=Math.max(0,-(o*h+r)),u=-f*f+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(lo).addScaledVector(Os,h),u}intersectSphere(t,e){Cn.subVectors(t.center,this.origin);const i=Cn.dot(this.direction),s=Cn.dot(Cn)-i*i,a=t.radius*t.radius;if(s>a)return null;const o=Math.sqrt(a-s),r=i-o,c=i+o;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,a,o,r,c;const l=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,s=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,s=(t.min.x-h.x)*l),d>=0?(a=(t.min.y-h.y)*d,o=(t.max.y-h.y)*d):(a=(t.max.y-h.y)*d,o=(t.min.y-h.y)*d),i>o||a>s||((a>i||isNaN(i))&&(i=a),(o<s||isNaN(s))&&(s=o),f>=0?(r=(t.min.z-h.z)*f,c=(t.max.z-h.z)*f):(r=(t.max.z-h.z)*f,c=(t.min.z-h.z)*f),i>c||r>s)||((r>i||i!==i)&&(i=r),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Cn)!==null}intersectTriangle(t,e,i,s,a){ho.subVectors(e,t),Bs.subVectors(i,t),uo.crossVectors(ho,Bs);let o=this.direction.dot(uo),r;if(o>0){if(s)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Wn.subVectors(this.origin,t);const c=r*this.direction.dot(Bs.crossVectors(Wn,Bs));if(c<0)return null;const l=r*this.direction.dot(ho.cross(Wn));if(l<0||c+l>o)return null;const d=-r*Wn.dot(uo);return d<0?null:this.at(d/o,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class fe{constructor(t,e,i,s,a,o,r,c,l,d,f,h,u,g,_,m){fe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,o,r,c,l,d,f,h,u,g,_,m)}set(t,e,i,s,a,o,r,c,l,d,f,h,u,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=a,p[5]=o,p[9]=r,p[13]=c,p[2]=l,p[6]=d,p[10]=f,p[14]=h,p[3]=u,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fe().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Ii.setFromMatrixColumn(t,0).length(),a=1/Ii.setFromMatrixColumn(t,1).length(),o=1/Ii.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*a,e[5]=i[5]*a,e[6]=i[6]*a,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,a=t.z,o=Math.cos(i),r=Math.sin(i),c=Math.cos(s),l=Math.sin(s),d=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const h=o*d,u=o*f,g=r*d,_=r*f;e[0]=c*d,e[4]=-c*f,e[8]=l,e[1]=u+g*l,e[5]=h-_*l,e[9]=-r*c,e[2]=_-h*l,e[6]=g+u*l,e[10]=o*c}else if(t.order==="YXZ"){const h=c*d,u=c*f,g=l*d,_=l*f;e[0]=h+_*r,e[4]=g*r-u,e[8]=o*l,e[1]=o*f,e[5]=o*d,e[9]=-r,e[2]=u*r-g,e[6]=_+h*r,e[10]=o*c}else if(t.order==="ZXY"){const h=c*d,u=c*f,g=l*d,_=l*f;e[0]=h-_*r,e[4]=-o*f,e[8]=g+u*r,e[1]=u+g*r,e[5]=o*d,e[9]=_-h*r,e[2]=-o*l,e[6]=r,e[10]=o*c}else if(t.order==="ZYX"){const h=o*d,u=o*f,g=r*d,_=r*f;e[0]=c*d,e[4]=g*l-u,e[8]=h*l+_,e[1]=c*f,e[5]=_*l+h,e[9]=u*l-g,e[2]=-l,e[6]=r*c,e[10]=o*c}else if(t.order==="YZX"){const h=o*c,u=o*l,g=r*c,_=r*l;e[0]=c*d,e[4]=_-h*f,e[8]=g*f+u,e[1]=f,e[5]=o*d,e[9]=-r*d,e[2]=-l*d,e[6]=u*f+g,e[10]=h-_*f}else if(t.order==="XZY"){const h=o*c,u=o*l,g=r*c,_=r*l;e[0]=c*d,e[4]=-f,e[8]=l*d,e[1]=h*f+_,e[5]=o*d,e[9]=u*f-g,e[2]=g*f-u,e[6]=r*d,e[10]=_*f+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(am,t,om)}lookAt(t,e,i){const s=this.elements;return We.subVectors(t,e),We.lengthSq()===0&&(We.z=1),We.normalize(),$n.crossVectors(i,We),$n.lengthSq()===0&&(Math.abs(i.z)===1?We.x+=1e-4:We.z+=1e-4,We.normalize(),$n.crossVectors(i,We)),$n.normalize(),Hs.crossVectors(We,$n),s[0]=$n.x,s[4]=Hs.x,s[8]=We.x,s[1]=$n.y,s[5]=Hs.y,s[9]=We.y,s[2]=$n.z,s[6]=Hs.z,s[10]=We.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,o=i[0],r=i[4],c=i[8],l=i[12],d=i[1],f=i[5],h=i[9],u=i[13],g=i[2],_=i[6],m=i[10],p=i[14],x=i[3],v=i[7],M=i[11],k=i[15],R=s[0],A=s[4],T=s[8],b=s[12],y=s[1],D=s[5],G=s[9],z=s[13],W=s[2],P=s[6],w=s[10],X=s[14],H=s[3],j=s[7],Q=s[11],ht=s[15];return a[0]=o*R+r*y+c*W+l*H,a[4]=o*A+r*D+c*P+l*j,a[8]=o*T+r*G+c*w+l*Q,a[12]=o*b+r*z+c*X+l*ht,a[1]=d*R+f*y+h*W+u*H,a[5]=d*A+f*D+h*P+u*j,a[9]=d*T+f*G+h*w+u*Q,a[13]=d*b+f*z+h*X+u*ht,a[2]=g*R+_*y+m*W+p*H,a[6]=g*A+_*D+m*P+p*j,a[10]=g*T+_*G+m*w+p*Q,a[14]=g*b+_*z+m*X+p*ht,a[3]=x*R+v*y+M*W+k*H,a[7]=x*A+v*D+M*P+k*j,a[11]=x*T+v*G+M*w+k*Q,a[15]=x*b+v*z+M*X+k*ht,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],a=t[12],o=t[1],r=t[5],c=t[9],l=t[13],d=t[2],f=t[6],h=t[10],u=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+a*c*f-s*l*f-a*r*h+i*l*h+s*r*u-i*c*u)+_*(+e*c*u-e*l*h+a*o*h-s*o*u+s*l*d-a*c*d)+m*(+e*l*f-e*r*u-a*o*f+i*o*u+a*r*d-i*l*d)+p*(-s*r*d-e*c*f+e*r*h+s*o*f-i*o*h+i*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],f=t[9],h=t[10],u=t[11],g=t[12],_=t[13],m=t[14],p=t[15],x=f*m*l-_*h*l+_*c*u-r*m*u-f*c*p+r*h*p,v=g*h*l-d*m*l-g*c*u+o*m*u+d*c*p-o*h*p,M=d*_*l-g*f*l+g*r*u-o*_*u-d*r*p+o*f*p,k=g*f*c-d*_*c-g*r*h+o*_*h+d*r*m-o*f*m,R=e*x+i*v+s*M+a*k;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/R;return t[0]=x*A,t[1]=(_*h*a-f*m*a-_*s*u+i*m*u+f*s*p-i*h*p)*A,t[2]=(r*m*a-_*c*a+_*s*l-i*m*l-r*s*p+i*c*p)*A,t[3]=(f*c*a-r*h*a-f*s*l+i*h*l+r*s*u-i*c*u)*A,t[4]=v*A,t[5]=(d*m*a-g*h*a+g*s*u-e*m*u-d*s*p+e*h*p)*A,t[6]=(g*c*a-o*m*a-g*s*l+e*m*l+o*s*p-e*c*p)*A,t[7]=(o*h*a-d*c*a+d*s*l-e*h*l-o*s*u+e*c*u)*A,t[8]=M*A,t[9]=(g*f*a-d*_*a-g*i*u+e*_*u+d*i*p-e*f*p)*A,t[10]=(o*_*a-g*r*a+g*i*l-e*_*l-o*i*p+e*r*p)*A,t[11]=(d*r*a-o*f*a-d*i*l+e*f*l+o*i*u-e*r*u)*A,t[12]=k*A,t[13]=(d*_*s-g*f*s+g*i*h-e*_*h-d*i*m+e*f*m)*A,t[14]=(g*r*s-o*_*s-g*i*c+e*_*c+o*i*m-e*r*m)*A,t[15]=(o*f*s-d*r*s+d*i*c-e*f*c-o*i*h+e*r*h)*A,this}scale(t){const e=this.elements,i=t.x,s=t.y,a=t.z;return e[0]*=i,e[4]*=s,e[8]*=a,e[1]*=i,e[5]*=s,e[9]*=a,e[2]*=i,e[6]*=s,e[10]*=a,e[3]*=i,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),a=1-i,o=t.x,r=t.y,c=t.z,l=a*o,d=a*r;return this.set(l*o+i,l*r-s*c,l*c+s*r,0,l*r+s*c,d*r+i,d*c-s*o,0,l*c-s*r,d*c+s*o,a*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,a,o){return this.set(1,i,a,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,a=e._x,o=e._y,r=e._z,c=e._w,l=a+a,d=o+o,f=r+r,h=a*l,u=a*d,g=a*f,_=o*d,m=o*f,p=r*f,x=c*l,v=c*d,M=c*f,k=i.x,R=i.y,A=i.z;return s[0]=(1-(_+p))*k,s[1]=(u+M)*k,s[2]=(g-v)*k,s[3]=0,s[4]=(u-M)*R,s[5]=(1-(h+p))*R,s[6]=(m+x)*R,s[7]=0,s[8]=(g+v)*A,s[9]=(m-x)*A,s[10]=(1-(h+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let a=Ii.set(s[0],s[1],s[2]).length();const o=Ii.set(s[4],s[5],s[6]).length(),r=Ii.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],dn.copy(this);const l=1/a,d=1/o,f=1/r;return dn.elements[0]*=l,dn.elements[1]*=l,dn.elements[2]*=l,dn.elements[4]*=d,dn.elements[5]*=d,dn.elements[6]*=d,dn.elements[8]*=f,dn.elements[9]*=f,dn.elements[10]*=f,e.setFromRotationMatrix(dn),i.x=a,i.y=o,i.z=r,this}makePerspective(t,e,i,s,a,o,r=Nn){const c=this.elements,l=2*a/(e-t),d=2*a/(i-s),f=(e+t)/(e-t),h=(i+s)/(i-s);let u,g;if(r===Nn)u=-(o+a)/(o-a),g=-2*o*a/(o-a);else if(r===wa)u=-o/(o-a),g=-o*a/(o-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=u,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,a,o,r=Nn){const c=this.elements,l=1/(e-t),d=1/(i-s),f=1/(o-a),h=(e+t)*l,u=(i+s)*d;let g,_;if(r===Nn)g=(o+a)*f,_=-2*f;else if(r===wa)g=a*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-u,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ii=new q,dn=new fe,am=new q(0,0,0),om=new q(1,1,1),$n=new q,Hs=new q,We=new q,cl=new fe,ll=new Rs;class En{constructor(t=0,e=0,i=0,s=En.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,a=s[0],o=s[4],r=s[8],c=s[1],l=s[5],d=s[9],f=s[2],h=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(Be(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-d,u),this._z=Math.atan2(-o,a)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Be(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(Be(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Be(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,u),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Be(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-Be(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(r,a)):(this._x=Math.atan2(-d,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return cl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(cl,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ll.setFromEuler(this),this.setFromQuaternion(ll,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}En.DEFAULT_ORDER="XYZ";class rc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let rm=0;const dl=new q,ki=new Rs,Pn=new fe,Gs=new q,us=new q,cm=new q,lm=new Rs,hl=new q(1,0,0),ul=new q(0,1,0),fl=new q(0,0,1),pl={type:"added"},dm={type:"removed"},Ui={type:"childadded",child:null},fo={type:"childremoved",child:null};class ve extends Qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rm++}),this.uuid=ws(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ve.DEFAULT_UP.clone();const t=new q,e=new En,i=new Rs,s=new q(1,1,1);function a(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(a),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new fe},normalMatrix:{value:new Yt}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=ve.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ki.setFromAxisAngle(t,e),this.quaternion.multiply(ki),this}rotateOnWorldAxis(t,e){return ki.setFromAxisAngle(t,e),this.quaternion.premultiply(ki),this}rotateX(t){return this.rotateOnAxis(hl,t)}rotateY(t){return this.rotateOnAxis(ul,t)}rotateZ(t){return this.rotateOnAxis(fl,t)}translateOnAxis(t,e){return dl.copy(t).applyQuaternion(this.quaternion),this.position.add(dl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(hl,t)}translateY(t){return this.translateOnAxis(ul,t)}translateZ(t){return this.translateOnAxis(fl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Pn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Gs.copy(t):Gs.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Pn.lookAt(us,Gs,this.up):Pn.lookAt(Gs,us,this.up),this.quaternion.setFromRotationMatrix(Pn),s&&(Pn.extractRotation(s.matrixWorld),ki.setFromRotationMatrix(Pn),this.quaternion.premultiply(ki.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(pl),Ui.child=t,this.dispatchEvent(Ui),Ui.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(dm),fo.child=t,this.dispatchEvent(fo),fo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Pn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Pn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Pn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(pl),Ui.child=t,this.dispatchEvent(Ui),Ui.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,t,cm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,lm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const f=c[l];a(t.shapes,f)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(a(t.materials,this.material[c]));s.material=r}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];s.animations.push(a(t.animations,c))}}if(e){const r=o(t.geometries),c=o(t.materials),l=o(t.textures),d=o(t.images),f=o(t.shapes),h=o(t.skeletons),u=o(t.animations),g=o(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(r){const c=[];for(const l in r){const d=r[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}ve.DEFAULT_UP=new q(0,1,0);ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const hn=new q,Dn=new q,po=new q,Ln=new q,Fi=new q,Ni=new q,ml=new q,mo=new q,go=new q,_o=new q,xo=new me,vo=new me,Mo=new me;class tn{constructor(t=new q,e=new q,i=new q){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),hn.subVectors(t,e),s.cross(hn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,i,s,a){hn.subVectors(s,e),Dn.subVectors(i,e),po.subVectors(t,e);const o=hn.dot(hn),r=hn.dot(Dn),c=hn.dot(po),l=Dn.dot(Dn),d=Dn.dot(po),f=o*l-r*r;if(f===0)return a.set(0,0,0),null;const h=1/f,u=(l*c-r*d)*h,g=(o*d-r*c)*h;return a.set(1-u-g,g,u)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Ln)===null?!1:Ln.x>=0&&Ln.y>=0&&Ln.x+Ln.y<=1}static getInterpolation(t,e,i,s,a,o,r,c){return this.getBarycoord(t,e,i,s,Ln)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Ln.x),c.addScaledVector(o,Ln.y),c.addScaledVector(r,Ln.z),c)}static getInterpolatedAttribute(t,e,i,s,a,o){return xo.setScalar(0),vo.setScalar(0),Mo.setScalar(0),xo.fromBufferAttribute(t,e),vo.fromBufferAttribute(t,i),Mo.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(xo,a.x),o.addScaledVector(vo,a.y),o.addScaledVector(Mo,a.z),o}static isFrontFacing(t,e,i,s){return hn.subVectors(i,e),Dn.subVectors(t,e),hn.cross(Dn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return hn.subVectors(this.c,this.b),Dn.subVectors(this.a,this.b),hn.cross(Dn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return tn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return tn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,a){return tn.getInterpolation(t,this.a,this.b,this.c,e,i,s,a)}containsPoint(t){return tn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return tn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,a=this.c;let o,r;Fi.subVectors(s,i),Ni.subVectors(a,i),mo.subVectors(t,i);const c=Fi.dot(mo),l=Ni.dot(mo);if(c<=0&&l<=0)return e.copy(i);go.subVectors(t,s);const d=Fi.dot(go),f=Ni.dot(go);if(d>=0&&f<=d)return e.copy(s);const h=c*f-d*l;if(h<=0&&c>=0&&d<=0)return o=c/(c-d),e.copy(i).addScaledVector(Fi,o);_o.subVectors(t,a);const u=Fi.dot(_o),g=Ni.dot(_o);if(g>=0&&u<=g)return e.copy(a);const _=u*l-c*g;if(_<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(i).addScaledVector(Ni,r);const m=d*g-u*f;if(m<=0&&f-d>=0&&u-g>=0)return ml.subVectors(a,s),r=(f-d)/(f-d+(u-g)),e.copy(s).addScaledVector(ml,r);const p=1/(m+_+h);return o=_*p,r=h*p,e.copy(i).addScaledVector(Fi,o).addScaledVector(Ni,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const zd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yn={h:0,s:0,l:0},Vs={h:0,s:0,l:0};function yo(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Wt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=je){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ee.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=ee.workingColorSpace){return this.r=t,this.g=e,this.b=i,ee.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=ee.workingColorSpace){if(t=Zp(t,1),e=Be(e,0,1),i=Be(i,0,1),e===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+e):i+e-i*e,o=2*i-a;this.r=yo(o,a,t+1/3),this.g=yo(o,a,t),this.b=yo(o,a,t-1/3)}return ee.toWorkingColorSpace(this,s),this}setStyle(t,e=je){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const o=s[1],r=s[2];switch(o){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],o=a.length;if(o===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=je){const i=zd[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=zn(t.r),this.g=zn(t.g),this.b=zn(t.b),this}copyLinearToSRGB(t){return this.r=Wi(t.r),this.g=Wi(t.g),this.b=Wi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=je){return ee.fromWorkingColorSpace(De.copy(this),t),Math.round(Be(De.r*255,0,255))*65536+Math.round(Be(De.g*255,0,255))*256+Math.round(Be(De.b*255,0,255))}getHexString(t=je){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ee.workingColorSpace){ee.fromWorkingColorSpace(De.copy(this),e);const i=De.r,s=De.g,a=De.b,o=Math.max(i,s,a),r=Math.min(i,s,a);let c,l;const d=(r+o)/2;if(r===o)c=0,l=0;else{const f=o-r;switch(l=d<=.5?f/(o+r):f/(2-o-r),o){case i:c=(s-a)/f+(s<a?6:0);break;case s:c=(a-i)/f+2;break;case a:c=(i-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=ee.workingColorSpace){return ee.fromWorkingColorSpace(De.copy(this),e),t.r=De.r,t.g=De.g,t.b=De.b,t}getStyle(t=je){ee.fromWorkingColorSpace(De.copy(this),t);const e=De.r,i=De.g,s=De.b;return t!==je?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Yn),this.setHSL(Yn.h+t,Yn.s+e,Yn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Yn),t.getHSL(Vs);const i=io(Yn.h,Vs.h,e),s=io(Yn.s,Vs.s,e),a=io(Yn.l,Vs.l,e);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*i+a[6]*s,this.g=a[1]*e+a[4]*i+a[7]*s,this.b=a[2]*e+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const De=new Wt;Wt.NAMES=zd;let hm=0;class ts extends Qi{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hm++}),this.uuid=ws(),this.name="",this.blending=Vi,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tr,this.blendDst=er,this.blendEquation=pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Wt(0,0,0),this.blendAlpha=0,this.depthFunc=$i,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ri,this.stencilZFail=Ri,this.stencilZPass=Ri,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Vi&&(i.blending=this.blending),this.side!==Qn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==tr&&(i.blendSrc=this.blendSrc),this.blendDst!==er&&(i.blendDst=this.blendDst),this.blendEquation!==pi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==$i&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ri&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ri&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ri&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const o=[];for(const r in a){const c=a[r];delete c.metadata,o.push(c)}return o}if(e){const a=s(t.textures),o=s(t.images);a.length>0&&(i.textures=a),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=e[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Mn extends ts{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=Qr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const xe=new q,Xs=new te;class en{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Qc,this.updateRanges=[],this.gpuType=Fn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Xs.fromBufferAttribute(this,e),Xs.applyMatrix3(t),this.setXY(e,Xs.x,Xs.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix3(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix4(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)xe.fromBufferAttribute(this,e),xe.applyNormalMatrix(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)xe.fromBufferAttribute(this,e),xe.transformDirection(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=ls(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Oe(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ls(e,this.array)),e}setX(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ls(e,this.array)),e}setY(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ls(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ls(e,this.array)),e}setW(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),i=Oe(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),i=Oe(i,this.array),s=Oe(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),i=Oe(i,this.array),s=Oe(s,this.array),a=Oe(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Qc&&(t.usage=this.usage),t}}class Od extends en{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Bd extends en{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class ge extends en{constructor(t,e,i){super(new Float32Array(t),e,i)}}let um=0;const Ze=new fe,So=new ve,zi=new q,$e=new Cs,fs=new Cs,Te=new q;class Ve extends Qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=ws(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ud(t)?Bd:Od)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Yt().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ze.makeRotationFromQuaternion(t),this.applyMatrix4(Ze),this}rotateX(t){return Ze.makeRotationX(t),this.applyMatrix4(Ze),this}rotateY(t){return Ze.makeRotationY(t),this.applyMatrix4(Ze),this}rotateZ(t){return Ze.makeRotationZ(t),this.applyMatrix4(Ze),this}translate(t,e,i){return Ze.makeTranslation(t,e,i),this.applyMatrix4(Ze),this}scale(t,e,i){return Ze.makeScale(t,e,i),this.applyMatrix4(Ze),this}lookAt(t){return So.lookAt(t),So.updateMatrix(),this.applyMatrix4(So.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zi).negate(),this.translate(zi.x,zi.y,zi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,a=t.length;s<a;s++){const o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ge(i,3))}else{for(let i=0,s=e.count;i<s;i++){const a=t[i];e.setXYZ(i,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Cs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const a=e[i];$e.setFromBufferAttribute(a),this.morphTargetsRelative?(Te.addVectors(this.boundingBox.min,$e.min),this.boundingBox.expandByPoint(Te),Te.addVectors(this.boundingBox.max,$e.max),this.boundingBox.expandByPoint(Te)):(this.boundingBox.expandByPoint($e.min),this.boundingBox.expandByPoint($e.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ka);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new q,1/0);return}if(t){const i=this.boundingSphere.center;if($e.setFromBufferAttribute(t),e)for(let a=0,o=e.length;a<o;a++){const r=e[a];fs.setFromBufferAttribute(r),this.morphTargetsRelative?(Te.addVectors($e.min,fs.min),$e.expandByPoint(Te),Te.addVectors($e.max,fs.max),$e.expandByPoint(Te)):($e.expandByPoint(fs.min),$e.expandByPoint(fs.max))}$e.getCenter(i);let s=0;for(let a=0,o=t.count;a<o;a++)Te.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(Te));if(e)for(let a=0,o=e.length;a<o;a++){const r=e[a],c=this.morphTargetsRelative;for(let l=0,d=r.count;l<d;l++)Te.fromBufferAttribute(r,l),c&&(zi.fromBufferAttribute(t,l),Te.add(zi)),s=Math.max(s,i.distanceToSquared(Te))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new en(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],c=[];for(let T=0;T<i.count;T++)r[T]=new q,c[T]=new q;const l=new q,d=new q,f=new q,h=new te,u=new te,g=new te,_=new q,m=new q;function p(T,b,y){l.fromBufferAttribute(i,T),d.fromBufferAttribute(i,b),f.fromBufferAttribute(i,y),h.fromBufferAttribute(a,T),u.fromBufferAttribute(a,b),g.fromBufferAttribute(a,y),d.sub(l),f.sub(l),u.sub(h),g.sub(h);const D=1/(u.x*g.y-g.x*u.y);isFinite(D)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(D),m.copy(f).multiplyScalar(u.x).addScaledVector(d,-g.x).multiplyScalar(D),r[T].add(_),r[b].add(_),r[y].add(_),c[T].add(m),c[b].add(m),c[y].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let T=0,b=x.length;T<b;++T){const y=x[T],D=y.start,G=y.count;for(let z=D,W=D+G;z<W;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const v=new q,M=new q,k=new q,R=new q;function A(T){k.fromBufferAttribute(s,T),R.copy(k);const b=r[T];v.copy(b),v.sub(k.multiplyScalar(k.dot(b))).normalize(),M.crossVectors(R,b);const D=M.dot(c[T])<0?-1:1;o.setXYZW(T,v.x,v.y,v.z,D)}for(let T=0,b=x.length;T<b;++T){const y=x[T],D=y.start,G=y.count;for(let z=D,W=D+G;z<W;z+=3)A(t.getX(z+0)),A(t.getX(z+1)),A(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new en(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,u=i.count;h<u;h++)i.setXYZ(h,0,0,0);const s=new q,a=new q,o=new q,r=new q,c=new q,l=new q,d=new q,f=new q;if(t)for(let h=0,u=t.count;h<u;h+=3){const g=t.getX(h+0),_=t.getX(h+1),m=t.getX(h+2);s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),d.subVectors(o,a),f.subVectors(s,a),d.cross(f),r.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),r.add(d),c.add(d),l.add(d),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,u=e.count;h<u;h+=3)s.fromBufferAttribute(e,h+0),a.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),d.subVectors(o,a),f.subVectors(s,a),d.cross(f),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Te.fromBufferAttribute(t,e),Te.normalize(),t.setXYZ(e,Te.x,Te.y,Te.z)}toNonIndexed(){function t(r,c){const l=r.array,d=r.itemSize,f=r.normalized,h=new l.constructor(c.length*d);let u=0,g=0;for(let _=0,m=c.length;_<m;_++){r.isInterleavedBufferAttribute?u=c[_]*r.data.stride+r.offset:u=c[_]*d;for(let p=0;p<d;p++)h[g++]=l[u++]}return new en(h,d,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ve,i=this.index.array,s=this.attributes;for(const r in s){const c=s[r],l=t(c,i);e.setAttribute(r,l)}const a=this.morphAttributes;for(const r in a){const c=[],l=a[r];for(let d=0,f=l.length;d<f;d++){const h=l[d],u=t(h,i);c.push(u)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,c=o.length;r<c;r++){const l=o[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let f=0,h=l.length;f<h;f++){const u=l[f];d.push(u.toJSON(t.data))}d.length>0&&(s[c]=d,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(e))}const a=t.morphAttributes;for(const l in a){const d=[],f=a[l];for(let h=0,u=f.length;h<u;h++)d.push(f[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,d=o.length;l<d;l++){const f=o[l];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const gl=new fe,oi=new oc,Ws=new ka,_l=new q,$s=new q,Ys=new q,Zs=new q,bo=new q,qs=new q,xl=new q,js=new q;class he extends ve{constructor(t=new Ve,e=new Mn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(a&&r){qs.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const d=r[c],f=a[c];d!==0&&(bo.fromBufferAttribute(f,t),o?qs.addScaledVector(bo,d):qs.addScaledVector(bo.sub(e),d))}e.add(qs)}return e}raycast(t,e){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ws.copy(i.boundingSphere),Ws.applyMatrix4(a),oi.copy(t.ray).recast(t.near),!(Ws.containsPoint(oi.origin)===!1&&(oi.intersectSphere(Ws,_l)===null||oi.origin.distanceToSquared(_l)>(t.far-t.near)**2))&&(gl.copy(a).invert(),oi.copy(t.ray).applyMatrix4(gl),!(i.boundingBox!==null&&oi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,oi)))}_computeIntersections(t,e,i){let s;const a=this.geometry,o=this.material,r=a.index,c=a.attributes.position,l=a.attributes.uv,d=a.attributes.uv1,f=a.attributes.normal,h=a.groups,u=a.drawRange;if(r!==null)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=o[m.materialIndex],x=Math.max(m.start,u.start),v=Math.min(r.count,Math.min(m.start+m.count,u.start+u.count));for(let M=x,k=v;M<k;M+=3){const R=r.getX(M),A=r.getX(M+1),T=r.getX(M+2);s=Ks(this,p,t,i,l,d,f,R,A,T),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,u.start),_=Math.min(r.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){const x=r.getX(m),v=r.getX(m+1),M=r.getX(m+2);s=Ks(this,o,t,i,l,d,f,x,v,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=o[m.materialIndex],x=Math.max(m.start,u.start),v=Math.min(c.count,Math.min(m.start+m.count,u.start+u.count));for(let M=x,k=v;M<k;M+=3){const R=M,A=M+1,T=M+2;s=Ks(this,p,t,i,l,d,f,R,A,T),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,u.start),_=Math.min(c.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){const x=m,v=m+1,M=m+2;s=Ks(this,o,t,i,l,d,f,x,v,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function fm(n,t,e,i,s,a,o,r){let c;if(t.side===He?c=i.intersectTriangle(o,a,s,!0,r):c=i.intersectTriangle(s,a,o,t.side===Qn,r),c===null)return null;js.copy(r),js.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(js);return l<e.near||l>e.far?null:{distance:l,point:js.clone(),object:n}}function Ks(n,t,e,i,s,a,o,r,c,l){n.getVertexPosition(r,$s),n.getVertexPosition(c,Ys),n.getVertexPosition(l,Zs);const d=fm(n,t,e,i,$s,Ys,Zs,xl);if(d){const f=new q;tn.getBarycoord(xl,$s,Ys,Zs,f),s&&(d.uv=tn.getInterpolatedAttribute(s,r,c,l,f,new te)),a&&(d.uv1=tn.getInterpolatedAttribute(a,r,c,l,f,new te)),o&&(d.normal=tn.getInterpolatedAttribute(o,r,c,l,f,new q),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:r,b:c,c:l,normal:new q,materialIndex:0};tn.getNormal($s,Ys,Zs,h.normal),d.face=h,d.barycoord=f}return d}class Tn extends Ve{constructor(t=1,e=1,i=1,s=1,a=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:a,depthSegments:o};const r=this;s=Math.floor(s),a=Math.floor(a),o=Math.floor(o);const c=[],l=[],d=[],f=[];let h=0,u=0;g("z","y","x",-1,-1,i,e,t,o,a,0),g("z","y","x",1,-1,i,e,-t,o,a,1),g("x","z","y",1,1,t,i,e,s,o,2),g("x","z","y",1,-1,t,i,-e,s,o,3),g("x","y","z",1,-1,t,e,i,s,a,4),g("x","y","z",-1,-1,t,e,-i,s,a,5),this.setIndex(c),this.setAttribute("position",new ge(l,3)),this.setAttribute("normal",new ge(d,3)),this.setAttribute("uv",new ge(f,2));function g(_,m,p,x,v,M,k,R,A,T,b){const y=M/A,D=k/T,G=M/2,z=k/2,W=R/2,P=A+1,w=T+1;let X=0,H=0;const j=new q;for(let Q=0;Q<w;Q++){const ht=Q*D-z;for(let mt=0;mt<P;mt++){const Mt=mt*y-G;j[_]=Mt*x,j[m]=ht*v,j[p]=W,l.push(j.x,j.y,j.z),j[_]=0,j[m]=0,j[p]=R>0?1:-1,d.push(j.x,j.y,j.z),f.push(mt/A),f.push(1-Q/T),X+=1}}for(let Q=0;Q<T;Q++)for(let ht=0;ht<A;ht++){const mt=h+ht+P*Q,Mt=h+ht+P*(Q+1),Y=h+(ht+1)+P*(Q+1),tt=h+(ht+1)+P*Q;c.push(mt,Mt,tt),c.push(Mt,Y,tt),H+=6}r.addGroup(u,H,b),u+=H,h+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Tn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ki(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Ue(n){const t={};for(let e=0;e<n.length;e++){const i=Ki(n[e]);for(const s in i)t[s]=i[s]}return t}function pm(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Hd(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ee.workingColorSpace}const mm={clone:Ki,merge:Ue};var gm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_m=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ti extends ts{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gm,this.fragmentShader=_m,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ki(t.uniforms),this.uniformsGroups=pm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Gd extends ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=Nn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Zn=new q,vl=new te,Ml=new te;class Ke extends Gd{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Or*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(pa*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Or*2*Math.atan(Math.tan(pa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Zn.x,Zn.y).multiplyScalar(-t/Zn.z),Zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Zn.x,Zn.y).multiplyScalar(-t/Zn.z)}getViewSize(t,e){return this.getViewBounds(t,vl,Ml),e.subVectors(Ml,vl)}setViewOffset(t,e,i,s,a,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(pa*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,a=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;a+=o.offsetX*s/c,e-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}const r=this.filmOffset;r!==0&&(a+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Oi=-90,Bi=1;class xm extends ve{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ke(Oi,Bi,t,e);s.layers=this.layers,this.add(s);const a=new Ke(Oi,Bi,t,e);a.layers=this.layers,this.add(a);const o=new Ke(Oi,Bi,t,e);o.layers=this.layers,this.add(o);const r=new Ke(Oi,Bi,t,e);r.layers=this.layers,this.add(r);const c=new Ke(Oi,Bi,t,e);c.layers=this.layers,this.add(c);const l=new Ke(Oi,Bi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,a,o,r,c]=e;for(const l of e)this.remove(l);if(t===Nn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===wa)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,o,r,c,l,d]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,a),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,r),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,d),t.setRenderTarget(f,h,u),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Vd extends Ge{constructor(t,e,i,s,a,o,r,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:Yi,super(t,e,i,s,a,o,r,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class vm extends yi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Vd(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Sn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Tn(5,5,5),a=new ti({name:"CubemapFromEquirect",uniforms:Ki(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:He,blending:Kn});a.uniforms.tEquirect.value=e;const o=new he(s,a),r=e.minFilter;return e.minFilter===_i&&(e.minFilter=Sn),new xm(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,s){const a=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(a)}}const Eo=new q,Mm=new q,ym=new Yt;class hi{constructor(t=new q(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=Eo.subVectors(i,e).cross(Mm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Eo),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||ym.getNormalMatrix(t),s=this.coplanarPoint(Eo).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ri=new ka,Js=new q;class cc{constructor(t=new hi,e=new hi,i=new hi,s=new hi,a=new hi,o=new hi){this.planes=[t,e,i,s,a,o]}set(t,e,i,s,a,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(s),r[4].copy(a),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Nn){const i=this.planes,s=t.elements,a=s[0],o=s[1],r=s[2],c=s[3],l=s[4],d=s[5],f=s[6],h=s[7],u=s[8],g=s[9],_=s[10],m=s[11],p=s[12],x=s[13],v=s[14],M=s[15];if(i[0].setComponents(c-a,h-l,m-u,M-p).normalize(),i[1].setComponents(c+a,h+l,m+u,M+p).normalize(),i[2].setComponents(c+o,h+d,m+g,M+x).normalize(),i[3].setComponents(c-o,h-d,m-g,M-x).normalize(),i[4].setComponents(c-r,h-f,m-_,M-v).normalize(),e===Nn)i[5].setComponents(c+r,h+f,m+_,M+v).normalize();else if(e===wa)i[5].setComponents(r,f,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ri.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ri.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ri)}intersectsSprite(t){return ri.center.set(0,0,0),ri.radius=.7071067811865476,ri.applyMatrix4(t.matrixWorld),this.intersectsSphere(ri)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Js.x=s.normal.x>0?t.max.x:t.min.x,Js.y=s.normal.y>0?t.max.y:t.min.y,Js.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Js)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Xd(){let n=null,t=!1,e=null,i=null;function s(a,o){e(a,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){n=a}}}function Sm(n){const t=new WeakMap;function e(r,c){const l=r.array,d=r.usage,f=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,d),r.onUploadCallback();let u;if(l instanceof Float32Array)u=n.FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=n.SHORT;else if(l instanceof Uint32Array)u=n.UNSIGNED_INT;else if(l instanceof Int32Array)u=n.INT;else if(l instanceof Int8Array)u=n.BYTE;else if(l instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,c,l){const d=c.array,f=c.updateRanges;if(n.bindBuffer(l,r),f.length===0)n.bufferSubData(l,0,d);else{f.sort((u,g)=>u.start-g.start);let h=0;for(let u=1;u<f.length;u++){const g=f[h],_=f[u];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,f[h]=_)}f.length=h+1;for(let u=0,g=f.length;u<g;u++){const _=f[u];n.bufferSubData(l,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function a(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function o(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const d=t.get(r);(!d||d.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:s,remove:a,update:o}}class Ua extends Ve{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const a=t/2,o=e/2,r=Math.floor(i),c=Math.floor(s),l=r+1,d=c+1,f=t/r,h=e/c,u=[],g=[],_=[],m=[];for(let p=0;p<d;p++){const x=p*h-o;for(let v=0;v<l;v++){const M=v*f-a;g.push(M,-x,0),_.push(0,0,1),m.push(v/r),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<r;x++){const v=x+l*p,M=x+l*(p+1),k=x+1+l*(p+1),R=x+1+l*p;u.push(v,M,R),u.push(M,k,R)}this.setIndex(u),this.setAttribute("position",new ge(g,3)),this.setAttribute("normal",new ge(_,3)),this.setAttribute("uv",new ge(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ua(t.width,t.height,t.widthSegments,t.heightSegments)}}var bm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Em=`#ifdef USE_ALPHAHASH
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
#endif`,Tm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Am=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Rm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Cm=`#ifdef USE_AOMAP
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
#endif`,Pm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Dm=`#ifdef USE_BATCHING
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
#endif`,Lm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Im=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,km=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Um=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Fm=`#ifdef USE_IRIDESCENCE
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
#endif`,Nm=`#ifdef USE_BUMPMAP
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
#endif`,zm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Om=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Hm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Vm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Xm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Wm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,$m=`#define PI 3.141592653589793
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
} // validated`,Ym=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Zm=`vec3 transformedNormal = objectNormal;
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
#endif`,qm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,jm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Km=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Qm="gl_FragColor = linearToOutputTexel( gl_FragColor );",tg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,eg=`#ifdef USE_ENVMAP
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
#endif`,ng=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ig=`#ifdef USE_ENVMAP
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
#endif`,sg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ag=`#ifdef USE_ENVMAP
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
#endif`,og=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,rg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,cg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,lg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,dg=`#ifdef USE_GRADIENTMAP
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
}`,hg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ug=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,fg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,pg=`uniform bool receiveShadow;
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
#endif`,mg=`#ifdef USE_ENVMAP
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
#endif`,gg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_g=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Mg=`PhysicalMaterial material;
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
#endif`,yg=`struct PhysicalMaterial {
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
}`,Sg=`
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
#endif`,bg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Eg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Tg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ag=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wg=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Cg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Pg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Dg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Lg=`#if defined( USE_POINTS_UV )
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
#endif`,Ig=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,kg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ug=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Fg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ng=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zg=`#ifdef USE_MORPHTARGETS
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
#endif`,Og=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Hg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Gg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Wg=`#ifdef USE_NORMALMAP
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
#endif`,$g=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Yg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Zg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,jg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Kg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Jg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Qg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,t0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,e0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,n0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,i0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,s0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,a0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,o0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,r0=`float getShadowMask() {
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
}`,c0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,l0=`#ifdef USE_SKINNING
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
#endif`,d0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,h0=`#ifdef USE_SKINNING
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
#endif`,u0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,f0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,p0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,m0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,g0=`#ifdef USE_TRANSMISSION
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
#endif`,_0=`#ifdef USE_TRANSMISSION
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
#endif`,x0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,v0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,M0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,y0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const S0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,b0=`uniform sampler2D t2D;
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
}`,E0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,T0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,A0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,w0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,R0=`#include <common>
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
}`,C0=`#if DEPTH_PACKING == 3200
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
}`,P0=`#define DISTANCE
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
}`,D0=`#define DISTANCE
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
}`,L0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,I0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,k0=`uniform float scale;
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
}`,U0=`uniform vec3 diffuse;
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
}`,F0=`#include <common>
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
}`,N0=`uniform vec3 diffuse;
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
}`,z0=`#define LAMBERT
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
}`,O0=`#define LAMBERT
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
}`,B0=`#define MATCAP
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
}`,H0=`#define MATCAP
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
}`,G0=`#define NORMAL
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
}`,V0=`#define NORMAL
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
}`,X0=`#define PHONG
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
}`,W0=`#define PHONG
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
}`,$0=`#define STANDARD
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
}`,Y0=`#define STANDARD
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
}`,Z0=`#define TOON
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
}`,q0=`#define TOON
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
}`,j0=`uniform float size;
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
}`,K0=`uniform vec3 diffuse;
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
}`,J0=`#include <common>
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
}`,Q0=`uniform vec3 color;
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
}`,t_=`uniform float rotation;
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
}`,e_=`uniform vec3 diffuse;
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
}`,jt={alphahash_fragment:bm,alphahash_pars_fragment:Em,alphamap_fragment:Tm,alphamap_pars_fragment:Am,alphatest_fragment:wm,alphatest_pars_fragment:Rm,aomap_fragment:Cm,aomap_pars_fragment:Pm,batching_pars_vertex:Dm,batching_vertex:Lm,begin_vertex:Im,beginnormal_vertex:km,bsdfs:Um,iridescence_fragment:Fm,bumpmap_pars_fragment:Nm,clipping_planes_fragment:zm,clipping_planes_pars_fragment:Om,clipping_planes_pars_vertex:Bm,clipping_planes_vertex:Hm,color_fragment:Gm,color_pars_fragment:Vm,color_pars_vertex:Xm,color_vertex:Wm,common:$m,cube_uv_reflection_fragment:Ym,defaultnormal_vertex:Zm,displacementmap_pars_vertex:qm,displacementmap_vertex:jm,emissivemap_fragment:Km,emissivemap_pars_fragment:Jm,colorspace_fragment:Qm,colorspace_pars_fragment:tg,envmap_fragment:eg,envmap_common_pars_fragment:ng,envmap_pars_fragment:ig,envmap_pars_vertex:sg,envmap_physical_pars_fragment:mg,envmap_vertex:ag,fog_vertex:og,fog_pars_vertex:rg,fog_fragment:cg,fog_pars_fragment:lg,gradientmap_pars_fragment:dg,lightmap_pars_fragment:hg,lights_lambert_fragment:ug,lights_lambert_pars_fragment:fg,lights_pars_begin:pg,lights_toon_fragment:gg,lights_toon_pars_fragment:_g,lights_phong_fragment:xg,lights_phong_pars_fragment:vg,lights_physical_fragment:Mg,lights_physical_pars_fragment:yg,lights_fragment_begin:Sg,lights_fragment_maps:bg,lights_fragment_end:Eg,logdepthbuf_fragment:Tg,logdepthbuf_pars_fragment:Ag,logdepthbuf_pars_vertex:wg,logdepthbuf_vertex:Rg,map_fragment:Cg,map_pars_fragment:Pg,map_particle_fragment:Dg,map_particle_pars_fragment:Lg,metalnessmap_fragment:Ig,metalnessmap_pars_fragment:kg,morphinstance_vertex:Ug,morphcolor_vertex:Fg,morphnormal_vertex:Ng,morphtarget_pars_vertex:zg,morphtarget_vertex:Og,normal_fragment_begin:Bg,normal_fragment_maps:Hg,normal_pars_fragment:Gg,normal_pars_vertex:Vg,normal_vertex:Xg,normalmap_pars_fragment:Wg,clearcoat_normal_fragment_begin:$g,clearcoat_normal_fragment_maps:Yg,clearcoat_pars_fragment:Zg,iridescence_pars_fragment:qg,opaque_fragment:jg,packing:Kg,premultiplied_alpha_fragment:Jg,project_vertex:Qg,dithering_fragment:t0,dithering_pars_fragment:e0,roughnessmap_fragment:n0,roughnessmap_pars_fragment:i0,shadowmap_pars_fragment:s0,shadowmap_pars_vertex:a0,shadowmap_vertex:o0,shadowmask_pars_fragment:r0,skinbase_vertex:c0,skinning_pars_vertex:l0,skinning_vertex:d0,skinnormal_vertex:h0,specularmap_fragment:u0,specularmap_pars_fragment:f0,tonemapping_fragment:p0,tonemapping_pars_fragment:m0,transmission_fragment:g0,transmission_pars_fragment:_0,uv_pars_fragment:x0,uv_pars_vertex:v0,uv_vertex:M0,worldpos_vertex:y0,background_vert:S0,background_frag:b0,backgroundCube_vert:E0,backgroundCube_frag:T0,cube_vert:A0,cube_frag:w0,depth_vert:R0,depth_frag:C0,distanceRGBA_vert:P0,distanceRGBA_frag:D0,equirect_vert:L0,equirect_frag:I0,linedashed_vert:k0,linedashed_frag:U0,meshbasic_vert:F0,meshbasic_frag:N0,meshlambert_vert:z0,meshlambert_frag:O0,meshmatcap_vert:B0,meshmatcap_frag:H0,meshnormal_vert:G0,meshnormal_frag:V0,meshphong_vert:X0,meshphong_frag:W0,meshphysical_vert:$0,meshphysical_frag:Y0,meshtoon_vert:Z0,meshtoon_frag:q0,points_vert:j0,points_frag:K0,shadow_vert:J0,shadow_frag:Q0,sprite_vert:t_,sprite_frag:e_},Rt={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},yn={basic:{uniforms:Ue([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:Ue([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,Rt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:Ue([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,Rt.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:Ue([Rt.common,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.roughnessmap,Rt.metalnessmap,Rt.fog,Rt.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:Ue([Rt.common,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.gradientmap,Rt.fog,Rt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:Ue([Rt.common,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:Ue([Rt.points,Rt.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:Ue([Rt.common,Rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:Ue([Rt.common,Rt.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:Ue([Rt.common,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:Ue([Rt.sprite,Rt.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distanceRGBA:{uniforms:Ue([Rt.common,Rt.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distanceRGBA_vert,fragmentShader:jt.distanceRGBA_frag},shadow:{uniforms:Ue([Rt.lights,Rt.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};yn.physical={uniforms:Ue([yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};const Qs={r:0,b:0,g:0},ci=new En,n_=new fe;function i_(n,t,e,i,s,a,o){const r=new Wt(0);let c=a===!0?0:1,l,d,f=null,h=0,u=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?e:t).get(v)),v}function _(x){let v=!1;const M=g(x);M===null?p(r,c):M&&M.isColor&&(p(M,1),v=!0);const k=n.xr.getEnvironmentBlendMode();k==="additive"?i.buffers.color.setClear(0,0,0,1,o):k==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,v){const M=g(v);M&&(M.isCubeTexture||M.mapping===La)?(d===void 0&&(d=new he(new Tn(1,1,1),new ti({name:"BackgroundCubeMaterial",uniforms:Ki(yn.backgroundCube.uniforms),vertexShader:yn.backgroundCube.vertexShader,fragmentShader:yn.backgroundCube.fragmentShader,side:He,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(k,R,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),ci.copy(v.backgroundRotation),ci.x*=-1,ci.y*=-1,ci.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ci.y*=-1,ci.z*=-1),d.material.uniforms.envMap.value=M,d.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(n_.makeRotationFromEuler(ci)),d.material.toneMapped=ee.getTransfer(M.colorSpace)!==re,(f!==M||h!==M.version||u!==n.toneMapping)&&(d.material.needsUpdate=!0,f=M,h=M.version,u=n.toneMapping),d.layers.enableAll(),x.unshift(d,d.geometry,d.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new he(new Ua(2,2),new ti({name:"BackgroundMaterial",uniforms:Ki(yn.background.uniforms),vertexShader:yn.background.vertexShader,fragmentShader:yn.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=ee.getTransfer(M.colorSpace)!==re,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(f!==M||h!==M.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,f=M,h=M.version,u=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,v){x.getRGB(Qs,Hd(n)),i.buffers.color.setClear(Qs.r,Qs.g,Qs.b,v,o)}return{getClearColor:function(){return r},setClearColor:function(x,v=1){r.set(x),c=v,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(r,c)},render:_,addToRenderList:m}}function s_(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let a=s,o=!1;function r(y,D,G,z,W){let P=!1;const w=f(z,G,D);a!==w&&(a=w,l(a.object)),P=u(y,z,G,W),P&&g(y,z,G,W),W!==null&&t.update(W,n.ELEMENT_ARRAY_BUFFER),(P||o)&&(o=!1,M(y,D,G,z),W!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function d(y){return n.deleteVertexArray(y)}function f(y,D,G){const z=G.wireframe===!0;let W=i[y.id];W===void 0&&(W={},i[y.id]=W);let P=W[D.id];P===void 0&&(P={},W[D.id]=P);let w=P[z];return w===void 0&&(w=h(c()),P[z]=w),w}function h(y){const D=[],G=[],z=[];for(let W=0;W<e;W++)D[W]=0,G[W]=0,z[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:G,attributeDivisors:z,object:y,attributes:{},index:null}}function u(y,D,G,z){const W=a.attributes,P=D.attributes;let w=0;const X=G.getAttributes();for(const H in X)if(X[H].location>=0){const Q=W[H];let ht=P[H];if(ht===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(ht=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(ht=y.instanceColor)),Q===void 0||Q.attribute!==ht||ht&&Q.data!==ht.data)return!0;w++}return a.attributesNum!==w||a.index!==z}function g(y,D,G,z){const W={},P=D.attributes;let w=0;const X=G.getAttributes();for(const H in X)if(X[H].location>=0){let Q=P[H];Q===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(Q=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(Q=y.instanceColor));const ht={};ht.attribute=Q,Q&&Q.data&&(ht.data=Q.data),W[H]=ht,w++}a.attributes=W,a.attributesNum=w,a.index=z}function _(){const y=a.newAttributes;for(let D=0,G=y.length;D<G;D++)y[D]=0}function m(y){p(y,0)}function p(y,D){const G=a.newAttributes,z=a.enabledAttributes,W=a.attributeDivisors;G[y]=1,z[y]===0&&(n.enableVertexAttribArray(y),z[y]=1),W[y]!==D&&(n.vertexAttribDivisor(y,D),W[y]=D)}function x(){const y=a.newAttributes,D=a.enabledAttributes;for(let G=0,z=D.length;G<z;G++)D[G]!==y[G]&&(n.disableVertexAttribArray(G),D[G]=0)}function v(y,D,G,z,W,P,w){w===!0?n.vertexAttribIPointer(y,D,G,W,P):n.vertexAttribPointer(y,D,G,z,W,P)}function M(y,D,G,z){_();const W=z.attributes,P=G.getAttributes(),w=D.defaultAttributeValues;for(const X in P){const H=P[X];if(H.location>=0){let j=W[X];if(j===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(j=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(j=y.instanceColor)),j!==void 0){const Q=j.normalized,ht=j.itemSize,mt=t.get(j);if(mt===void 0)continue;const Mt=mt.buffer,Y=mt.type,tt=mt.bytesPerElement,xt=Y===n.INT||Y===n.UNSIGNED_INT||j.gpuType===tc;if(j.isInterleavedBufferAttribute){const J=j.data,_t=J.stride,Pt=j.offset;if(J.isInstancedInterleavedBuffer){for(let Tt=0;Tt<H.locationSize;Tt++)p(H.location+Tt,J.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Tt=0;Tt<H.locationSize;Tt++)m(H.location+Tt);n.bindBuffer(n.ARRAY_BUFFER,Mt);for(let Tt=0;Tt<H.locationSize;Tt++)v(H.location+Tt,ht/H.locationSize,Y,Q,_t*tt,(Pt+ht/H.locationSize*Tt)*tt,xt)}else{if(j.isInstancedBufferAttribute){for(let J=0;J<H.locationSize;J++)p(H.location+J,j.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let J=0;J<H.locationSize;J++)m(H.location+J);n.bindBuffer(n.ARRAY_BUFFER,Mt);for(let J=0;J<H.locationSize;J++)v(H.location+J,ht/H.locationSize,Y,Q,ht*tt,ht/H.locationSize*J*tt,xt)}}else if(w!==void 0){const Q=w[X];if(Q!==void 0)switch(Q.length){case 2:n.vertexAttrib2fv(H.location,Q);break;case 3:n.vertexAttrib3fv(H.location,Q);break;case 4:n.vertexAttrib4fv(H.location,Q);break;default:n.vertexAttrib1fv(H.location,Q)}}}}x()}function k(){T();for(const y in i){const D=i[y];for(const G in D){const z=D[G];for(const W in z)d(z[W].object),delete z[W];delete D[G]}delete i[y]}}function R(y){if(i[y.id]===void 0)return;const D=i[y.id];for(const G in D){const z=D[G];for(const W in z)d(z[W].object),delete z[W];delete D[G]}delete i[y.id]}function A(y){for(const D in i){const G=i[D];if(G[y.id]===void 0)continue;const z=G[y.id];for(const W in z)d(z[W].object),delete z[W];delete G[y.id]}}function T(){b(),o=!0,a!==s&&(a=s,l(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:r,reset:T,resetDefaultState:b,dispose:k,releaseStatesOfGeometry:R,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function a_(n,t,e){let i;function s(l){i=l}function a(l,d){n.drawArrays(i,l,d),e.update(d,i,1)}function o(l,d,f){f!==0&&(n.drawArraysInstanced(i,l,d,f),e.update(d,i,f))}function r(l,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,d,0,f);let u=0;for(let g=0;g<f;g++)u+=d[g];e.update(u,i,1)}function c(l,d,f,h){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<l.length;g++)o(l[g],d[g],h[g]);else{u.multiDrawArraysInstancedWEBGL(i,l,0,d,0,h,0,f);let g=0;for(let _=0;_<f;_++)g+=d[_]*h[_];e.update(g,i,1)}}this.setMode=s,this.render=a,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function o_(n,t,e,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==fn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(A){const T=A===As&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==On&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Fn&&!T)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const f=e.logarithmicDepthBuffer===!0,h=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),k=g>0,R=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:h,maxTextures:u,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:v,maxFragmentUniforms:M,vertexTextures:k,maxSamples:R}}function r_(n){const t=this;let e=null,i=0,s=!1,a=!1;const o=new hi,r=new Yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const u=f.length!==0||h||i!==0||s;return s=h,i=f.length,u},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,h){e=d(f,h,0)},this.setState=function(f,h,u){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!s||g===null||g.length===0||a&&!m)a?d(null):l();else{const x=a?0:i,v=x*4;let M=p.clippingState||null;c.value=M,M=d(g,h,v,u);for(let k=0;k!==v;++k)M[k]=e[k];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function d(f,h,u,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=u+_*4,x=h.matrixWorldInverse;r.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,M=u;v!==_;++v,M+=4)o.copy(f[v]).applyMatrix4(x,r),o.normal.toArray(m,M),m[M+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function c_(n){let t=new WeakMap;function e(o,r){return r===lr?o.mapping=Yi:r===dr&&(o.mapping=Zi),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===lr||r===dr)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new vm(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const r=o.target;r.removeEventListener("dispose",s);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function a(){t=new WeakMap}return{get:i,dispose:a}}class Wd extends Gd{constructor(t=-1,e=1,i=1,s=-1,a=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=a,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,a,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-t,o=i+t,r=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,o=a+l*this.view.width,r-=d*this.view.offsetY,c=r-d*this.view.height}this.projectionMatrix.makeOrthographic(a,o,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Gi=4,yl=[.125,.215,.35,.446,.526,.582],mi=20,To=new Wd,Sl=new Wt;let Ao=null,wo=0,Ro=0,Co=!1;const ui=(1+Math.sqrt(5))/2,Hi=1/ui,bl=[new q(-ui,Hi,0),new q(ui,Hi,0),new q(-Hi,0,ui),new q(Hi,0,ui),new q(0,ui,-Hi),new q(0,ui,Hi),new q(-1,1,-1),new q(1,1,-1),new q(-1,1,1),new q(1,1,1)];class El{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Ao=this._renderer.getRenderTarget(),wo=this._renderer.getActiveCubeFace(),Ro=this._renderer.getActiveMipmapLevel(),Co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,i,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Al(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ao,wo,Ro),this._renderer.xr.enabled=Co,t.scissorTest=!1,ta(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Yi||t.mapping===Zi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ao=this._renderer.getRenderTarget(),wo=this._renderer.getActiveCubeFace(),Ro=this._renderer.getActiveMipmapLevel(),Co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Sn,minFilter:Sn,generateMipmaps:!1,type:As,format:fn,colorSpace:Ji,depthBuffer:!1},s=Tl(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Tl(t,e,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=l_(a)),this._blurMaterial=d_(a,t,e)}return s}_compileMaterial(t){const e=new he(this._lodPlanes[0],t);this._renderer.compile(e,To)}_sceneToCubeUV(t,e,i,s){const r=new Ke(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(Sl),d.toneMapping=Jn,d.autoClear=!1;const u=new Mn({name:"PMREM.Background",side:He,depthWrite:!1,depthTest:!1}),g=new he(new Tn,u);let _=!1;const m=t.background;m?m.isColor&&(u.color.copy(m),t.background=null,_=!0):(u.color.copy(Sl),_=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(r.up.set(0,c[p],0),r.lookAt(l[p],0,0)):x===1?(r.up.set(0,0,c[p]),r.lookAt(0,l[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,l[p]));const v=this._cubeSize;ta(s,x*v,p>2?v:0,v,v),d.setRenderTarget(s),_&&d.render(g,r),d.render(t,r)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=h,d.autoClear=f,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===Yi||t.mapping===Zi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Al());const a=s?this._cubemapMaterial:this._equirectMaterial,o=new he(this._lodPlanes[0],a),r=a.uniforms;r.envMap.value=t;const c=this._cubeSize;ta(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,To)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const o=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),r=bl[(s-a-1)%bl.length];this._blur(t,a-1,a,o,r)}e.autoClear=i}_blur(t,e,i,s,a){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",a),this._halfBlur(o,t,i,i,s,"longitudinal",a)}_halfBlur(t,e,i,s,a,o,r){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,f=new he(this._lodPlanes[s],l),h=l.uniforms,u=this._sizeLods[i]-1,g=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*mi-1),_=a/g,m=isFinite(a)?1+Math.floor(d*_):mi;m>mi&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${mi}`);const p=[];let x=0;for(let A=0;A<mi;++A){const T=A/_,b=Math.exp(-T*T/2);p.push(b),A===0?x+=b:A<m&&(x+=2*b)}for(let A=0;A<p.length;A++)p[A]=p[A]/x;h.envMap.value=t.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=o==="latitudinal",r&&(h.poleAxis.value=r);const{_lodMax:v}=this;h.dTheta.value=g,h.mipInt.value=v-i;const M=this._sizeLods[s],k=3*M*(s>v-Gi?s-v+Gi:0),R=4*(this._cubeSize-M);ta(e,k,R,3*M,2*M),c.setRenderTarget(e),c.render(f,To)}}function l_(n){const t=[],e=[],i=[];let s=n;const a=n-Gi+1+yl.length;for(let o=0;o<a;o++){const r=Math.pow(2,s);e.push(r);let c=1/r;o>n-Gi?c=yl[o-n+Gi-1]:o===0&&(c=0),i.push(c);const l=1/(r-2),d=-l,f=1+l,h=[d,d,f,d,f,f,d,d,f,f,d,f],u=6,g=6,_=3,m=2,p=1,x=new Float32Array(_*g*u),v=new Float32Array(m*g*u),M=new Float32Array(p*g*u);for(let R=0;R<u;R++){const A=R%3*2/3-1,T=R>2?0:-1,b=[A,T,0,A+2/3,T,0,A+2/3,T+1,0,A,T,0,A+2/3,T+1,0,A,T+1,0];x.set(b,_*g*R),v.set(h,m*g*R);const y=[R,R,R,R,R,R];M.set(y,p*g*R)}const k=new Ve;k.setAttribute("position",new en(x,_)),k.setAttribute("uv",new en(v,m)),k.setAttribute("faceIndex",new en(M,p)),t.push(k),s>Gi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Tl(n,t,e){const i=new yi(n,t,e);return i.texture.mapping=La,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ta(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function d_(n,t,e){const i=new Float32Array(mi),s=new q(0,1,0);return new ti({name:"SphericalGaussianBlur",defines:{n:mi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:lc(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Al(){return new ti({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:lc(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function wl(){return new ti({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:lc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function lc(){return`

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
	`}function h_(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===lr||c===dr,d=c===Yi||c===Zi;if(l||d){let f=t.get(r);const h=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==h)return e===null&&(e=new El(n)),f=l?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return l&&u&&u.height>0||d&&u&&s(u)?(e===null&&(e=new El(n)),f=l?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",a),f.texture):null}}}return r}function s(r){let c=0;const l=6;for(let d=0;d<l;d++)r[d]!==void 0&&c++;return c===l}function a(r){const c=r.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function u_(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&gs("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function f_(n,t,e,i){const s={},a=new WeakMap;function o(f){const h=f.target;h.index!==null&&t.remove(h.index);for(const g in h.attributes)t.remove(h.attributes[g]);for(const g in h.morphAttributes){const _=h.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}h.removeEventListener("dispose",o),delete s[h.id];const u=a.get(h);u&&(t.remove(u),a.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function r(f,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,e.memory.geometries++),h}function c(f){const h=f.attributes;for(const g in h)t.update(h[g],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const g in u){const _=u[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],n.ARRAY_BUFFER)}}function l(f){const h=[],u=f.index,g=f.attributes.position;let _=0;if(u!==null){const x=u.array;_=u.version;for(let v=0,M=x.length;v<M;v+=3){const k=x[v+0],R=x[v+1],A=x[v+2];h.push(k,R,R,A,A,k)}}else if(g!==void 0){const x=g.array;_=g.version;for(let v=0,M=x.length/3-1;v<M;v+=3){const k=v+0,R=v+1,A=v+2;h.push(k,R,R,A,A,k)}}else return;const m=new(Ud(h)?Bd:Od)(h,1);m.version=_;const p=a.get(f);p&&t.remove(p),a.set(f,m)}function d(f){const h=a.get(f);if(h){const u=f.index;u!==null&&h.version<u.version&&l(f)}else l(f);return a.get(f)}return{get:r,update:c,getWireframeAttribute:d}}function p_(n,t,e){let i;function s(h){i=h}let a,o;function r(h){a=h.type,o=h.bytesPerElement}function c(h,u){n.drawElements(i,u,a,h*o),e.update(u,i,1)}function l(h,u,g){g!==0&&(n.drawElementsInstanced(i,u,a,h*o,g),e.update(u,i,g))}function d(h,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,a,h,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,i,1)}function f(h,u,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)l(h[p]/o,u[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,u,0,a,h,0,_,0,g);let p=0;for(let x=0;x<g;x++)p+=u[x]*_[x];e.update(p,i,1)}}this.setMode=s,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=f}function m_(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(a/3);break;case n.LINES:e.lines+=r*(a/2);break;case n.LINE_STRIP:e.lines+=r*(a-1);break;case n.LINE_LOOP:e.lines+=r*a;break;case n.POINTS:e.points+=r*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function g_(n,t,e){const i=new WeakMap,s=new me;function a(o,r,c){const l=o.morphTargetInfluences,d=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=d!==void 0?d.length:0;let h=i.get(r);if(h===void 0||h.count!==f){let y=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",y)};var u=y;h!==void 0&&h.texture.dispose();const g=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],x=r.morphAttributes.normal||[],v=r.morphAttributes.color||[];let M=0;g===!0&&(M=1),_===!0&&(M=2),m===!0&&(M=3);let k=r.attributes.position.count*M,R=1;k>t.maxTextureSize&&(R=Math.ceil(k/t.maxTextureSize),k=t.maxTextureSize);const A=new Float32Array(k*R*4*f),T=new Nd(A,k,R,f);T.type=Fn,T.needsUpdate=!0;const b=M*4;for(let D=0;D<f;D++){const G=p[D],z=x[D],W=v[D],P=k*R*4*D;for(let w=0;w<G.count;w++){const X=w*b;g===!0&&(s.fromBufferAttribute(G,w),A[P+X+0]=s.x,A[P+X+1]=s.y,A[P+X+2]=s.z,A[P+X+3]=0),_===!0&&(s.fromBufferAttribute(z,w),A[P+X+4]=s.x,A[P+X+5]=s.y,A[P+X+6]=s.z,A[P+X+7]=0),m===!0&&(s.fromBufferAttribute(W,w),A[P+X+8]=s.x,A[P+X+9]=s.y,A[P+X+10]=s.z,A[P+X+11]=W.itemSize===4?s.w:1)}}h={count:f,texture:T,size:new te(k,R)},i.set(r,h),r.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=r.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:a}}function __(n,t,e,i){let s=new WeakMap;function a(c){const l=i.render.frame,d=c.geometry,f=t.get(c,d);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;s.get(h)!==l&&(h.update(),s.set(h,l))}return f}function o(){s=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:o}}class $d extends Ge{constructor(t,e,i,s,a,o,r,c,l,d=Xi){if(d!==Xi&&d!==ji)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Xi&&(i=Mi),i===void 0&&d===ji&&(i=qi),super(null,s,a,o,r,c,d,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:pn,this.minFilter=c!==void 0?c:pn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Yd=new Ge,Rl=new $d(1,1),Zd=new Nd,qd=new im,jd=new Vd,Cl=[],Pl=[],Dl=new Float32Array(16),Ll=new Float32Array(9),Il=new Float32Array(4);function es(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let a=Cl[s];if(a===void 0&&(a=new Float32Array(s),Cl[s]=a),t!==0){i.toArray(a,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(a,r)}return a}function be(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ee(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Fa(n,t){let e=Pl[t];e===void 0&&(e=new Int32Array(t),Pl[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function x_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function v_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;n.uniform2fv(this.addr,t),Ee(e,t)}}function M_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(be(e,t))return;n.uniform3fv(this.addr,t),Ee(e,t)}}function y_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;n.uniform4fv(this.addr,t),Ee(e,t)}}function S_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(be(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,i))return;Il.set(i),n.uniformMatrix2fv(this.addr,!1,Il),Ee(e,i)}}function b_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(be(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,i))return;Ll.set(i),n.uniformMatrix3fv(this.addr,!1,Ll),Ee(e,i)}}function E_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(be(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,i))return;Dl.set(i),n.uniformMatrix4fv(this.addr,!1,Dl),Ee(e,i)}}function T_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function A_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;n.uniform2iv(this.addr,t),Ee(e,t)}}function w_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;n.uniform3iv(this.addr,t),Ee(e,t)}}function R_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;n.uniform4iv(this.addr,t),Ee(e,t)}}function C_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function P_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;n.uniform2uiv(this.addr,t),Ee(e,t)}}function D_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;n.uniform3uiv(this.addr,t),Ee(e,t)}}function L_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;n.uniform4uiv(this.addr,t),Ee(e,t)}}function I_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Rl.compareFunction=kd,a=Rl):a=Yd,e.setTexture2D(t||a,s)}function k_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||qd,s)}function U_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||jd,s)}function F_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Zd,s)}function N_(n){switch(n){case 5126:return x_;case 35664:return v_;case 35665:return M_;case 35666:return y_;case 35674:return S_;case 35675:return b_;case 35676:return E_;case 5124:case 35670:return T_;case 35667:case 35671:return A_;case 35668:case 35672:return w_;case 35669:case 35673:return R_;case 5125:return C_;case 36294:return P_;case 36295:return D_;case 36296:return L_;case 35678:case 36198:case 36298:case 36306:case 35682:return I_;case 35679:case 36299:case 36307:return k_;case 35680:case 36300:case 36308:case 36293:return U_;case 36289:case 36303:case 36311:case 36292:return F_}}function z_(n,t){n.uniform1fv(this.addr,t)}function O_(n,t){const e=es(t,this.size,2);n.uniform2fv(this.addr,e)}function B_(n,t){const e=es(t,this.size,3);n.uniform3fv(this.addr,e)}function H_(n,t){const e=es(t,this.size,4);n.uniform4fv(this.addr,e)}function G_(n,t){const e=es(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function V_(n,t){const e=es(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function X_(n,t){const e=es(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function W_(n,t){n.uniform1iv(this.addr,t)}function $_(n,t){n.uniform2iv(this.addr,t)}function Y_(n,t){n.uniform3iv(this.addr,t)}function Z_(n,t){n.uniform4iv(this.addr,t)}function q_(n,t){n.uniform1uiv(this.addr,t)}function j_(n,t){n.uniform2uiv(this.addr,t)}function K_(n,t){n.uniform3uiv(this.addr,t)}function J_(n,t){n.uniform4uiv(this.addr,t)}function Q_(n,t,e){const i=this.cache,s=t.length,a=Fa(e,s);be(i,a)||(n.uniform1iv(this.addr,a),Ee(i,a));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Yd,a[o])}function tx(n,t,e){const i=this.cache,s=t.length,a=Fa(e,s);be(i,a)||(n.uniform1iv(this.addr,a),Ee(i,a));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||qd,a[o])}function ex(n,t,e){const i=this.cache,s=t.length,a=Fa(e,s);be(i,a)||(n.uniform1iv(this.addr,a),Ee(i,a));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||jd,a[o])}function nx(n,t,e){const i=this.cache,s=t.length,a=Fa(e,s);be(i,a)||(n.uniform1iv(this.addr,a),Ee(i,a));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Zd,a[o])}function ix(n){switch(n){case 5126:return z_;case 35664:return O_;case 35665:return B_;case 35666:return H_;case 35674:return G_;case 35675:return V_;case 35676:return X_;case 5124:case 35670:return W_;case 35667:case 35671:return $_;case 35668:case 35672:return Y_;case 35669:case 35673:return Z_;case 5125:return q_;case 36294:return j_;case 36295:return K_;case 36296:return J_;case 35678:case 36198:case 36298:case 36306:case 35682:return Q_;case 35679:case 36299:case 36307:return tx;case 35680:case 36300:case 36308:case 36293:return ex;case 36289:case 36303:case 36311:case 36292:return nx}}class sx{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=N_(e.type)}}class ax{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ix(e.type)}}class ox{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let a=0,o=s.length;a!==o;++a){const r=s[a];r.setValue(t,e[r.id],i)}}}const Po=/(\w+)(\])?(\[|\.)?/g;function kl(n,t){n.seq.push(t),n.map[t.id]=t}function rx(n,t,e){const i=n.name,s=i.length;for(Po.lastIndex=0;;){const a=Po.exec(i),o=Po.lastIndex;let r=a[1];const c=a[2]==="]",l=a[3];if(c&&(r=r|0),l===void 0||l==="["&&o+2===s){kl(e,l===void 0?new sx(r,n,t):new ax(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new ox(r),kl(e,f)),e=f}}}class ma{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=t.getActiveUniform(e,s),o=t.getUniformLocation(e,a.name);rx(a,o,this)}}setValue(t,e,i,s){const a=this.map[e];a!==void 0&&a.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let a=0,o=e.length;a!==o;++a){const r=e[a],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,a=t.length;s!==a;++s){const o=t[s];o.id in e&&i.push(o)}return i}}function Ul(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const cx=37297;let lx=0;function dx(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let o=s;o<a;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Fl=new Yt;function hx(n){ee._getMatrix(Fl,ee.workingColorSpace,n);const t=`mat3( ${Fl.elements.map(e=>e.toFixed(4))} )`;switch(ee.getTransfer(n)){case Ia:return[t,"LinearTransferOETF"];case re:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Nl(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+dx(n.getShaderSource(t),o)}else return s}function ux(n,t){const e=hx(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function fx(n,t){let e;switch(t){case Pp:e="Linear";break;case Dp:e="Reinhard";break;case Lp:e="Cineon";break;case Ip:e="ACESFilmic";break;case Up:e="AgX";break;case Fp:e="Neutral";break;case kp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ea=new q;function px(){ee.getLuminanceCoefficients(ea);const n=ea.x.toFixed(4),t=ea.y.toFixed(4),e=ea.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function mx(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(_s).join(`
`)}function gx(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function _x(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(t,s),o=a.name;let r=1;a.type===n.FLOAT_MAT2&&(r=2),a.type===n.FLOAT_MAT3&&(r=3),a.type===n.FLOAT_MAT4&&(r=4),e[o]={type:a.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function _s(n){return n!==""}function zl(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ol(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const xx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Br(n){return n.replace(xx,Mx)}const vx=new Map;function Mx(n,t){let e=jt[t];if(e===void 0){const i=vx.get(t);if(i!==void 0)e=jt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Br(e)}const yx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bl(n){return n.replace(yx,Sx)}function Sx(n,t,e,i){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Hl(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function bx(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Md?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===yd?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===In&&(t="SHADOWMAP_TYPE_VSM"),t}function Ex(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Yi:case Zi:t="ENVMAP_TYPE_CUBE";break;case La:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Tx(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Zi:t="ENVMAP_MODE_REFRACTION";break}return t}function Ax(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Qr:t="ENVMAP_BLENDING_MULTIPLY";break;case Rp:t="ENVMAP_BLENDING_MIX";break;case Cp:t="ENVMAP_BLENDING_ADD";break}return t}function wx(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Rx(n,t,e,i){const s=n.getContext(),a=e.defines;let o=e.vertexShader,r=e.fragmentShader;const c=bx(e),l=Ex(e),d=Tx(e),f=Ax(e),h=wx(e),u=mx(e),g=gx(a),_=s.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(_s).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(_s).join(`
`),p.length>0&&(p+=`
`)):(m=[Hl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_s).join(`
`),p=[Hl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Jn?"#define TONE_MAPPING":"",e.toneMapping!==Jn?jt.tonemapping_pars_fragment:"",e.toneMapping!==Jn?fx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,ux("linearToOutputTexel",e.outputColorSpace),px(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(_s).join(`
`)),o=Br(o),o=zl(o,e),o=Ol(o,e),r=Br(r),r=zl(r,e),r=Ol(r,e),o=Bl(o),r=Bl(r),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===tl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===tl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=x+m+o,M=x+p+r,k=Ul(s,s.VERTEX_SHADER,v),R=Ul(s,s.FRAGMENT_SHADER,M);s.attachShader(_,k),s.attachShader(_,R),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(D){if(n.debug.checkShaderErrors){const G=s.getProgramInfoLog(_).trim(),z=s.getShaderInfoLog(k).trim(),W=s.getShaderInfoLog(R).trim();let P=!0,w=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(P=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,k,R);else{const X=Nl(s,k,"vertex"),H=Nl(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+G+`
`+X+`
`+H)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(z===""||W==="")&&(w=!1);w&&(D.diagnostics={runnable:P,programLog:G,vertexShader:{log:z,prefix:m},fragmentShader:{log:W,prefix:p}})}s.deleteShader(k),s.deleteShader(R),T=new ma(s,_),b=_x(s,_)}let T;this.getUniforms=function(){return T===void 0&&A(this),T};let b;this.getAttributes=function(){return b===void 0&&A(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,cx)),y},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=lx++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=k,this.fragmentShader=R,this}let Cx=0;class Px{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(a)===!1&&(o.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Dx(t),e.set(t,i)),i}}class Dx{constructor(t){this.id=Cx++,this.code=t,this.usedTimes=0}}function Lx(n,t,e,i,s,a,o){const r=new rc,c=new Px,l=new Set,d=[],f=s.logarithmicDepthBuffer,h=s.vertexTextures;let u=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,y,D,G,z){const W=G.fog,P=z.geometry,w=b.isMeshStandardMaterial?G.environment:null,X=(b.isMeshStandardMaterial?e:t).get(b.envMap||w),H=X&&X.mapping===La?X.image.height:null,j=g[b.type];b.precision!==null&&(u=s.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const Q=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,ht=Q!==void 0?Q.length:0;let mt=0;P.morphAttributes.position!==void 0&&(mt=1),P.morphAttributes.normal!==void 0&&(mt=2),P.morphAttributes.color!==void 0&&(mt=3);let Mt,Y,tt,xt;if(j){const Vt=yn[j];Mt=Vt.vertexShader,Y=Vt.fragmentShader}else Mt=b.vertexShader,Y=b.fragmentShader,c.update(b),tt=c.getVertexShaderID(b),xt=c.getFragmentShaderID(b);const J=n.getRenderTarget(),_t=n.state.buffers.depth.getReversed(),Pt=z.isInstancedMesh===!0,Tt=z.isBatchedMesh===!0,zt=!!b.map,St=!!b.matcap,bt=!!X,O=!!b.aoMap,$t=!!b.lightMap,Ct=!!b.bumpMap,Dt=!!b.normalMap,At=!!b.displacementMap,yt=!!b.emissiveMap,wt=!!b.metalnessMap,C=!!b.roughnessMap,S=b.anisotropy>0,V=b.clearcoat>0,lt=b.dispersion>0,rt=b.iridescence>0,st=b.sheen>0,kt=b.transmission>0,nt=S&&!!b.anisotropyMap,B=V&&!!b.clearcoatMap,gt=V&&!!b.clearcoatNormalMap,Z=V&&!!b.clearcoatRoughnessMap,pt=rt&&!!b.iridescenceMap,U=rt&&!!b.iridescenceThicknessMap,et=st&&!!b.sheenColorMap,dt=st&&!!b.sheenRoughnessMap,Lt=!!b.specularMap,Ft=!!b.specularColorMap,Bt=!!b.specularIntensityMap,F=kt&&!!b.transmissionMap,vt=kt&&!!b.thicknessMap,K=!!b.gradientMap,at=!!b.alphaMap,it=b.alphaTest>0,ut=!!b.alphaHash,Ut=!!b.extensions;let Xt=Jn;b.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Xt=n.toneMapping);const Zt={shaderID:j,shaderType:b.type,shaderName:b.name,vertexShader:Mt,fragmentShader:Y,defines:b.defines,customVertexShaderID:tt,customFragmentShaderID:xt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:Tt,batchingColor:Tt&&z._colorsTexture!==null,instancing:Pt,instancingColor:Pt&&z.instanceColor!==null,instancingMorph:Pt&&z.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Ji,alphaToCoverage:!!b.alphaToCoverage,map:zt,matcap:St,envMap:bt,envMapMode:bt&&X.mapping,envMapCubeUVHeight:H,aoMap:O,lightMap:$t,bumpMap:Ct,normalMap:Dt,displacementMap:h&&At,emissiveMap:yt,normalMapObjectSpace:Dt&&b.normalMapType===Bp,normalMapTangentSpace:Dt&&b.normalMapType===Id,metalnessMap:wt,roughnessMap:C,anisotropy:S,anisotropyMap:nt,clearcoat:V,clearcoatMap:B,clearcoatNormalMap:gt,clearcoatRoughnessMap:Z,dispersion:lt,iridescence:rt,iridescenceMap:pt,iridescenceThicknessMap:U,sheen:st,sheenColorMap:et,sheenRoughnessMap:dt,specularMap:Lt,specularColorMap:Ft,specularIntensityMap:Bt,transmission:kt,transmissionMap:F,thicknessMap:vt,gradientMap:K,opaque:b.transparent===!1&&b.blending===Vi&&b.alphaToCoverage===!1,alphaMap:at,alphaTest:it,alphaHash:ut,combine:b.combine,mapUv:zt&&_(b.map.channel),aoMapUv:O&&_(b.aoMap.channel),lightMapUv:$t&&_(b.lightMap.channel),bumpMapUv:Ct&&_(b.bumpMap.channel),normalMapUv:Dt&&_(b.normalMap.channel),displacementMapUv:At&&_(b.displacementMap.channel),emissiveMapUv:yt&&_(b.emissiveMap.channel),metalnessMapUv:wt&&_(b.metalnessMap.channel),roughnessMapUv:C&&_(b.roughnessMap.channel),anisotropyMapUv:nt&&_(b.anisotropyMap.channel),clearcoatMapUv:B&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:gt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:pt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:U&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:et&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:dt&&_(b.sheenRoughnessMap.channel),specularMapUv:Lt&&_(b.specularMap.channel),specularColorMapUv:Ft&&_(b.specularColorMap.channel),specularIntensityMapUv:Bt&&_(b.specularIntensityMap.channel),transmissionMapUv:F&&_(b.transmissionMap.channel),thicknessMapUv:vt&&_(b.thicknessMap.channel),alphaMapUv:at&&_(b.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(Dt||S),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!P.attributes.uv&&(zt||at),fog:!!W,useFog:b.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:_t,skinning:z.isSkinnedMesh===!0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:mt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:Xt,decodeVideoTexture:zt&&b.map.isVideoTexture===!0&&ee.getTransfer(b.map.colorSpace)===re,decodeVideoTextureEmissive:yt&&b.emissiveMap.isVideoTexture===!0&&ee.getTransfer(b.emissiveMap.colorSpace)===re,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Fe,flipSided:b.side===He,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ut&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ut&&b.extensions.multiDraw===!0||Tt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Zt.vertexUv1s=l.has(1),Zt.vertexUv2s=l.has(2),Zt.vertexUv3s=l.has(3),l.clear(),Zt}function p(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const D in b.defines)y.push(D),y.push(b.defines[D]);return b.isRawShaderMaterial===!1&&(x(y,b),v(y,b),y.push(n.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function x(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function v(b,y){r.disableAll(),y.supportsVertexTextures&&r.enable(0),y.instancing&&r.enable(1),y.instancingColor&&r.enable(2),y.instancingMorph&&r.enable(3),y.matcap&&r.enable(4),y.envMap&&r.enable(5),y.normalMapObjectSpace&&r.enable(6),y.normalMapTangentSpace&&r.enable(7),y.clearcoat&&r.enable(8),y.iridescence&&r.enable(9),y.alphaTest&&r.enable(10),y.vertexColors&&r.enable(11),y.vertexAlphas&&r.enable(12),y.vertexUv1s&&r.enable(13),y.vertexUv2s&&r.enable(14),y.vertexUv3s&&r.enable(15),y.vertexTangents&&r.enable(16),y.anisotropy&&r.enable(17),y.alphaHash&&r.enable(18),y.batching&&r.enable(19),y.dispersion&&r.enable(20),y.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),y.fog&&r.enable(0),y.useFog&&r.enable(1),y.flatShading&&r.enable(2),y.logarithmicDepthBuffer&&r.enable(3),y.reverseDepthBuffer&&r.enable(4),y.skinning&&r.enable(5),y.morphTargets&&r.enable(6),y.morphNormals&&r.enable(7),y.morphColors&&r.enable(8),y.premultipliedAlpha&&r.enable(9),y.shadowMapEnabled&&r.enable(10),y.doubleSided&&r.enable(11),y.flipSided&&r.enable(12),y.useDepthPacking&&r.enable(13),y.dithering&&r.enable(14),y.transmission&&r.enable(15),y.sheen&&r.enable(16),y.opaque&&r.enable(17),y.pointsUvs&&r.enable(18),y.decodeVideoTexture&&r.enable(19),y.decodeVideoTextureEmissive&&r.enable(20),y.alphaToCoverage&&r.enable(21),b.push(r.mask)}function M(b){const y=g[b.type];let D;if(y){const G=yn[y];D=mm.clone(G.uniforms)}else D=b.uniforms;return D}function k(b,y){let D;for(let G=0,z=d.length;G<z;G++){const W=d[G];if(W.cacheKey===y){D=W,++D.usedTimes;break}}return D===void 0&&(D=new Rx(n,y,b,a),d.push(D)),D}function R(b){if(--b.usedTimes===0){const y=d.indexOf(b);d[y]=d[d.length-1],d.pop(),b.destroy()}}function A(b){c.remove(b)}function T(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:k,releaseProgram:R,releaseShaderCache:A,programs:d,dispose:T}}function Ix(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function s(o,r,c){n.get(o)[r]=c}function a(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:a}}function kx(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Gl(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Vl(){const n=[];let t=0;const e=[],i=[],s=[];function a(){t=0,e.length=0,i.length=0,s.length=0}function o(f,h,u,g,_,m){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:h,material:u,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},n[t]=p):(p.id=f.id,p.object=f,p.geometry=h,p.material=u,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=_,p.group=m),t++,p}function r(f,h,u,g,_,m){const p=o(f,h,u,g,_,m);u.transmission>0?i.push(p):u.transparent===!0?s.push(p):e.push(p)}function c(f,h,u,g,_,m){const p=o(f,h,u,g,_,m);u.transmission>0?i.unshift(p):u.transparent===!0?s.unshift(p):e.unshift(p)}function l(f,h){e.length>1&&e.sort(f||kx),i.length>1&&i.sort(h||Gl),s.length>1&&s.sort(h||Gl)}function d(){for(let f=t,h=n.length;f<h;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:s,init:a,push:r,unshift:c,finish:d,sort:l}}function Ux(){let n=new WeakMap;function t(i,s){const a=n.get(i);let o;return a===void 0?(o=new Vl,n.set(i,[o])):s>=a.length?(o=new Vl,a.push(o)):o=a[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function Fx(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new q,color:new Wt};break;case"SpotLight":e={position:new q,direction:new q,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new q,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new q,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":e={color:new Wt,position:new q,halfWidth:new q,halfHeight:new q};break}return n[t.id]=e,e}}}function Nx(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let zx=0;function Ox(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Bx(n){const t=new Fx,e=Nx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new q);const s=new q,a=new fe,o=new fe;function r(l){let d=0,f=0,h=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let u=0,g=0,_=0,m=0,p=0,x=0,v=0,M=0,k=0,R=0,A=0;l.sort(Ox);for(let b=0,y=l.length;b<y;b++){const D=l[b],G=D.color,z=D.intensity,W=D.distance,P=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=G.r*z,f+=G.g*z,h+=G.b*z;else if(D.isLightProbe){for(let w=0;w<9;w++)i.probe[w].addScaledVector(D.sh.coefficients[w],z);A++}else if(D.isDirectionalLight){const w=t.get(D);if(w.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const X=D.shadow,H=e.get(D);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,i.directionalShadow[u]=H,i.directionalShadowMap[u]=P,i.directionalShadowMatrix[u]=D.shadow.matrix,x++}i.directional[u]=w,u++}else if(D.isSpotLight){const w=t.get(D);w.position.setFromMatrixPosition(D.matrixWorld),w.color.copy(G).multiplyScalar(z),w.distance=W,w.coneCos=Math.cos(D.angle),w.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),w.decay=D.decay,i.spot[_]=w;const X=D.shadow;if(D.map&&(i.spotLightMap[k]=D.map,k++,X.updateMatrices(D),D.castShadow&&R++),i.spotLightMatrix[_]=X.matrix,D.castShadow){const H=e.get(D);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,i.spotShadow[_]=H,i.spotShadowMap[_]=P,M++}_++}else if(D.isRectAreaLight){const w=t.get(D);w.color.copy(G).multiplyScalar(z),w.halfWidth.set(D.width*.5,0,0),w.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=w,m++}else if(D.isPointLight){const w=t.get(D);if(w.color.copy(D.color).multiplyScalar(D.intensity),w.distance=D.distance,w.decay=D.decay,D.castShadow){const X=D.shadow,H=e.get(D);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,H.shadowCameraNear=X.camera.near,H.shadowCameraFar=X.camera.far,i.pointShadow[g]=H,i.pointShadowMap[g]=P,i.pointShadowMatrix[g]=D.shadow.matrix,v++}i.point[g]=w,g++}else if(D.isHemisphereLight){const w=t.get(D);w.skyColor.copy(D.color).multiplyScalar(z),w.groundColor.copy(D.groundColor).multiplyScalar(z),i.hemi[p]=w,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Rt.LTC_FLOAT_1,i.rectAreaLTC2=Rt.LTC_FLOAT_2):(i.rectAreaLTC1=Rt.LTC_HALF_1,i.rectAreaLTC2=Rt.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=h;const T=i.hash;(T.directionalLength!==u||T.pointLength!==g||T.spotLength!==_||T.rectAreaLength!==m||T.hemiLength!==p||T.numDirectionalShadows!==x||T.numPointShadows!==v||T.numSpotShadows!==M||T.numSpotMaps!==k||T.numLightProbes!==A)&&(i.directional.length=u,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=M+k-R,i.spotLightMap.length=k,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=A,T.directionalLength=u,T.pointLength=g,T.spotLength=_,T.rectAreaLength=m,T.hemiLength=p,T.numDirectionalShadows=x,T.numPointShadows=v,T.numSpotShadows=M,T.numSpotMaps=k,T.numLightProbes=A,i.version=zx++)}function c(l,d){let f=0,h=0,u=0,g=0,_=0;const m=d.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const v=l[p];if(v.isDirectionalLight){const M=i.directional[f];M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),f++}else if(v.isSpotLight){const M=i.spot[u];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),u++}else if(v.isRectAreaLight){const M=i.rectArea[g];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),o.identity(),a.copy(v.matrixWorld),a.premultiply(m),o.extractRotation(a),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){const M=i.point[h];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),h++}else if(v.isHemisphereLight){const M=i.hemi[_];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:r,setupView:c,state:i}}function Xl(n){const t=new Bx(n),e=[],i=[];function s(d){l.camera=d,e.length=0,i.length=0}function a(d){e.push(d)}function o(d){i.push(d)}function r(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:r,setupLightsView:c,pushLight:a,pushShadow:o}}function Hx(n){let t=new WeakMap;function e(s,a=0){const o=t.get(s);let r;return o===void 0?(r=new Xl(n),t.set(s,[r])):a>=o.length?(r=new Xl(n),o.push(r)):r=o[a],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class Gx extends ts{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=zp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Vx extends ts{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Xx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Wx=`uniform sampler2D shadow_pass;
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
}`;function $x(n,t,e){let i=new cc;const s=new te,a=new te,o=new me,r=new Gx({depthPacking:Op}),c=new Vx,l={},d=e.maxTextureSize,f={[Qn]:He,[He]:Qn,[Fe]:Fe},h=new ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new te},radius:{value:4}},vertexShader:Xx,fragmentShader:Wx}),u=h.clone();u.defines.HORIZONTAL_PASS=1;const g=new Ve;g.setAttribute("position",new en(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new he(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Md;let p=this.type;this.render=function(R,A,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const b=n.getRenderTarget(),y=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),G=n.state;G.setBlending(Kn),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const z=p!==In&&this.type===In,W=p===In&&this.type!==In;for(let P=0,w=R.length;P<w;P++){const X=R[P],H=X.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const j=H.getFrameExtents();if(s.multiply(j),a.copy(H.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/j.x),s.x=a.x*j.x,H.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/j.y),s.y=a.y*j.y,H.mapSize.y=a.y)),H.map===null||z===!0||W===!0){const ht=this.type!==In?{minFilter:pn,magFilter:pn}:{};H.map!==null&&H.map.dispose(),H.map=new yi(s.x,s.y,ht),H.map.texture.name=X.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();const Q=H.getViewportCount();for(let ht=0;ht<Q;ht++){const mt=H.getViewport(ht);o.set(a.x*mt.x,a.y*mt.y,a.x*mt.z,a.y*mt.w),G.viewport(o),H.updateMatrices(X,ht),i=H.getFrustum(),M(A,T,H.camera,X,this.type)}H.isPointLightShadow!==!0&&this.type===In&&x(H,T),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(b,y,D)};function x(R,A){const T=t.update(_);h.defines.VSM_SAMPLES!==R.blurSamples&&(h.defines.VSM_SAMPLES=R.blurSamples,u.defines.VSM_SAMPLES=R.blurSamples,h.needsUpdate=!0,u.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new yi(s.x,s.y)),h.uniforms.shadow_pass.value=R.map.texture,h.uniforms.resolution.value=R.mapSize,h.uniforms.radius.value=R.radius,n.setRenderTarget(R.mapPass),n.clear(),n.renderBufferDirect(A,null,T,h,_,null),u.uniforms.shadow_pass.value=R.mapPass.texture,u.uniforms.resolution.value=R.mapSize,u.uniforms.radius.value=R.radius,n.setRenderTarget(R.map),n.clear(),n.renderBufferDirect(A,null,T,u,_,null)}function v(R,A,T,b){let y=null;const D=T.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(D!==void 0)y=D;else if(y=T.isPointLight===!0?c:r,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const G=y.uuid,z=A.uuid;let W=l[G];W===void 0&&(W={},l[G]=W);let P=W[z];P===void 0&&(P=y.clone(),W[z]=P,A.addEventListener("dispose",k)),y=P}if(y.visible=A.visible,y.wireframe=A.wireframe,b===In?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:f[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,T.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const G=n.properties.get(y);G.light=T}return y}function M(R,A,T,b,y){if(R.visible===!1)return;if(R.layers.test(A.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&y===In)&&(!R.frustumCulled||i.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,R.matrixWorld);const z=t.update(R),W=R.material;if(Array.isArray(W)){const P=z.groups;for(let w=0,X=P.length;w<X;w++){const H=P[w],j=W[H.materialIndex];if(j&&j.visible){const Q=v(R,j,b,y);R.onBeforeShadow(n,R,A,T,z,Q,H),n.renderBufferDirect(T,null,z,Q,R,H),R.onAfterShadow(n,R,A,T,z,Q,H)}}}else if(W.visible){const P=v(R,W,b,y);R.onBeforeShadow(n,R,A,T,z,P,null),n.renderBufferDirect(T,null,z,P,R,null),R.onAfterShadow(n,R,A,T,z,P,null)}}const G=R.children;for(let z=0,W=G.length;z<W;z++)M(G[z],A,T,b,y)}function k(R){R.target.removeEventListener("dispose",k);for(const T in l){const b=l[T],y=R.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const Yx={[nr]:ir,[sr]:rr,[ar]:cr,[$i]:or,[ir]:nr,[rr]:sr,[cr]:ar,[or]:$i};function Zx(n,t){function e(){let F=!1;const vt=new me;let K=null;const at=new me(0,0,0,0);return{setMask:function(it){K!==it&&!F&&(n.colorMask(it,it,it,it),K=it)},setLocked:function(it){F=it},setClear:function(it,ut,Ut,Xt,Zt){Zt===!0&&(it*=Xt,ut*=Xt,Ut*=Xt),vt.set(it,ut,Ut,Xt),at.equals(vt)===!1&&(n.clearColor(it,ut,Ut,Xt),at.copy(vt))},reset:function(){F=!1,K=null,at.set(-1,0,0,0)}}}function i(){let F=!1,vt=!1,K=null,at=null,it=null;return{setReversed:function(ut){if(vt!==ut){const Ut=t.get("EXT_clip_control");vt?Ut.clipControlEXT(Ut.LOWER_LEFT_EXT,Ut.ZERO_TO_ONE_EXT):Ut.clipControlEXT(Ut.LOWER_LEFT_EXT,Ut.NEGATIVE_ONE_TO_ONE_EXT);const Xt=it;it=null,this.setClear(Xt)}vt=ut},getReversed:function(){return vt},setTest:function(ut){ut?J(n.DEPTH_TEST):_t(n.DEPTH_TEST)},setMask:function(ut){K!==ut&&!F&&(n.depthMask(ut),K=ut)},setFunc:function(ut){if(vt&&(ut=Yx[ut]),at!==ut){switch(ut){case nr:n.depthFunc(n.NEVER);break;case ir:n.depthFunc(n.ALWAYS);break;case sr:n.depthFunc(n.LESS);break;case $i:n.depthFunc(n.LEQUAL);break;case ar:n.depthFunc(n.EQUAL);break;case or:n.depthFunc(n.GEQUAL);break;case rr:n.depthFunc(n.GREATER);break;case cr:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}at=ut}},setLocked:function(ut){F=ut},setClear:function(ut){it!==ut&&(vt&&(ut=1-ut),n.clearDepth(ut),it=ut)},reset:function(){F=!1,K=null,at=null,it=null,vt=!1}}}function s(){let F=!1,vt=null,K=null,at=null,it=null,ut=null,Ut=null,Xt=null,Zt=null;return{setTest:function(Vt){F||(Vt?J(n.STENCIL_TEST):_t(n.STENCIL_TEST))},setMask:function(Vt){vt!==Vt&&!F&&(n.stencilMask(Vt),vt=Vt)},setFunc:function(Vt,oe,ue){(K!==Vt||at!==oe||it!==ue)&&(n.stencilFunc(Vt,oe,ue),K=Vt,at=oe,it=ue)},setOp:function(Vt,oe,ue){(ut!==Vt||Ut!==oe||Xt!==ue)&&(n.stencilOp(Vt,oe,ue),ut=Vt,Ut=oe,Xt=ue)},setLocked:function(Vt){F=Vt},setClear:function(Vt){Zt!==Vt&&(n.clearStencil(Vt),Zt=Vt)},reset:function(){F=!1,vt=null,K=null,at=null,it=null,ut=null,Ut=null,Xt=null,Zt=null}}}const a=new e,o=new i,r=new s,c=new WeakMap,l=new WeakMap;let d={},f={},h=new WeakMap,u=[],g=null,_=!1,m=null,p=null,x=null,v=null,M=null,k=null,R=null,A=new Wt(0,0,0),T=0,b=!1,y=null,D=null,G=null,z=null,W=null;const P=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let w=!1,X=0;const H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(H)[1]),w=X>=1):H.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),w=X>=2);let j=null,Q={};const ht=n.getParameter(n.SCISSOR_BOX),mt=n.getParameter(n.VIEWPORT),Mt=new me().fromArray(ht),Y=new me().fromArray(mt);function tt(F,vt,K,at){const it=new Uint8Array(4),ut=n.createTexture();n.bindTexture(F,ut),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ut=0;Ut<K;Ut++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(vt,0,n.RGBA,1,1,at,0,n.RGBA,n.UNSIGNED_BYTE,it):n.texImage2D(vt+Ut,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,it);return ut}const xt={};xt[n.TEXTURE_2D]=tt(n.TEXTURE_2D,n.TEXTURE_2D,1),xt[n.TEXTURE_CUBE_MAP]=tt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),xt[n.TEXTURE_2D_ARRAY]=tt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),xt[n.TEXTURE_3D]=tt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),r.setClear(0),J(n.DEPTH_TEST),o.setFunc($i),Ct(!1),Dt(Zc),J(n.CULL_FACE),O(Kn);function J(F){d[F]!==!0&&(n.enable(F),d[F]=!0)}function _t(F){d[F]!==!1&&(n.disable(F),d[F]=!1)}function Pt(F,vt){return f[F]!==vt?(n.bindFramebuffer(F,vt),f[F]=vt,F===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=vt),F===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=vt),!0):!1}function Tt(F,vt){let K=u,at=!1;if(F){K=h.get(vt),K===void 0&&(K=[],h.set(vt,K));const it=F.textures;if(K.length!==it.length||K[0]!==n.COLOR_ATTACHMENT0){for(let ut=0,Ut=it.length;ut<Ut;ut++)K[ut]=n.COLOR_ATTACHMENT0+ut;K.length=it.length,at=!0}}else K[0]!==n.BACK&&(K[0]=n.BACK,at=!0);at&&n.drawBuffers(K)}function zt(F){return g!==F?(n.useProgram(F),g=F,!0):!1}const St={[pi]:n.FUNC_ADD,[hp]:n.FUNC_SUBTRACT,[up]:n.FUNC_REVERSE_SUBTRACT};St[fp]=n.MIN,St[pp]=n.MAX;const bt={[mp]:n.ZERO,[gp]:n.ONE,[_p]:n.SRC_COLOR,[tr]:n.SRC_ALPHA,[bp]:n.SRC_ALPHA_SATURATE,[yp]:n.DST_COLOR,[vp]:n.DST_ALPHA,[xp]:n.ONE_MINUS_SRC_COLOR,[er]:n.ONE_MINUS_SRC_ALPHA,[Sp]:n.ONE_MINUS_DST_COLOR,[Mp]:n.ONE_MINUS_DST_ALPHA,[Ep]:n.CONSTANT_COLOR,[Tp]:n.ONE_MINUS_CONSTANT_COLOR,[Ap]:n.CONSTANT_ALPHA,[wp]:n.ONE_MINUS_CONSTANT_ALPHA};function O(F,vt,K,at,it,ut,Ut,Xt,Zt,Vt){if(F===Kn){_===!0&&(_t(n.BLEND),_=!1);return}if(_===!1&&(J(n.BLEND),_=!0),F!==dp){if(F!==m||Vt!==b){if((p!==pi||M!==pi)&&(n.blendEquation(n.FUNC_ADD),p=pi,M=pi),Vt)switch(F){case Vi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case qc:n.blendFunc(n.ONE,n.ONE);break;case jc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Kc:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Vi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case qc:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case jc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Kc:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}x=null,v=null,k=null,R=null,A.set(0,0,0),T=0,m=F,b=Vt}return}it=it||vt,ut=ut||K,Ut=Ut||at,(vt!==p||it!==M)&&(n.blendEquationSeparate(St[vt],St[it]),p=vt,M=it),(K!==x||at!==v||ut!==k||Ut!==R)&&(n.blendFuncSeparate(bt[K],bt[at],bt[ut],bt[Ut]),x=K,v=at,k=ut,R=Ut),(Xt.equals(A)===!1||Zt!==T)&&(n.blendColor(Xt.r,Xt.g,Xt.b,Zt),A.copy(Xt),T=Zt),m=F,b=!1}function $t(F,vt){F.side===Fe?_t(n.CULL_FACE):J(n.CULL_FACE);let K=F.side===He;vt&&(K=!K),Ct(K),F.blending===Vi&&F.transparent===!1?O(Kn):O(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),a.setMask(F.colorWrite);const at=F.stencilWrite;r.setTest(at),at&&(r.setMask(F.stencilWriteMask),r.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),r.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),yt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?J(n.SAMPLE_ALPHA_TO_COVERAGE):_t(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ct(F){y!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),y=F)}function Dt(F){F!==cp?(J(n.CULL_FACE),F!==D&&(F===Zc?n.cullFace(n.BACK):F===lp?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):_t(n.CULL_FACE),D=F}function At(F){F!==G&&(w&&n.lineWidth(F),G=F)}function yt(F,vt,K){F?(J(n.POLYGON_OFFSET_FILL),(z!==vt||W!==K)&&(n.polygonOffset(vt,K),z=vt,W=K)):_t(n.POLYGON_OFFSET_FILL)}function wt(F){F?J(n.SCISSOR_TEST):_t(n.SCISSOR_TEST)}function C(F){F===void 0&&(F=n.TEXTURE0+P-1),j!==F&&(n.activeTexture(F),j=F)}function S(F,vt,K){K===void 0&&(j===null?K=n.TEXTURE0+P-1:K=j);let at=Q[K];at===void 0&&(at={type:void 0,texture:void 0},Q[K]=at),(at.type!==F||at.texture!==vt)&&(j!==K&&(n.activeTexture(K),j=K),n.bindTexture(F,vt||xt[F]),at.type=F,at.texture=vt)}function V(){const F=Q[j];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function lt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function rt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function st(){try{n.texSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function kt(){try{n.texSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function nt(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function B(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function gt(){try{n.texStorage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Z(){try{n.texStorage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function pt(){try{n.texImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function U(){try{n.texImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function et(F){Mt.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),Mt.copy(F))}function dt(F){Y.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),Y.copy(F))}function Lt(F,vt){let K=l.get(vt);K===void 0&&(K=new WeakMap,l.set(vt,K));let at=K.get(F);at===void 0&&(at=n.getUniformBlockIndex(vt,F.name),K.set(F,at))}function Ft(F,vt){const at=l.get(vt).get(F);c.get(vt)!==at&&(n.uniformBlockBinding(vt,at,F.__bindingPointIndex),c.set(vt,at))}function Bt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},j=null,Q={},f={},h=new WeakMap,u=[],g=null,_=!1,m=null,p=null,x=null,v=null,M=null,k=null,R=null,A=new Wt(0,0,0),T=0,b=!1,y=null,D=null,G=null,z=null,W=null,Mt.set(0,0,n.canvas.width,n.canvas.height),Y.set(0,0,n.canvas.width,n.canvas.height),a.reset(),o.reset(),r.reset()}return{buffers:{color:a,depth:o,stencil:r},enable:J,disable:_t,bindFramebuffer:Pt,drawBuffers:Tt,useProgram:zt,setBlending:O,setMaterial:$t,setFlipSided:Ct,setCullFace:Dt,setLineWidth:At,setPolygonOffset:yt,setScissorTest:wt,activeTexture:C,bindTexture:S,unbindTexture:V,compressedTexImage2D:lt,compressedTexImage3D:rt,texImage2D:pt,texImage3D:U,updateUBOMapping:Lt,uniformBlockBinding:Ft,texStorage2D:gt,texStorage3D:Z,texSubImage2D:st,texSubImage3D:kt,compressedTexSubImage2D:nt,compressedTexSubImage3D:B,scissor:et,viewport:dt,reset:Bt}}function Wl(n,t,e,i){const s=qx(i);switch(e){case Ad:return n*t;case Rd:return n*t;case Cd:return n*t*2;case Pd:return n*t/s.components*s.byteLength;case ic:return n*t/s.components*s.byteLength;case Dd:return n*t*2/s.components*s.byteLength;case sc:return n*t*2/s.components*s.byteLength;case wd:return n*t*3/s.components*s.byteLength;case fn:return n*t*4/s.components*s.byteLength;case ac:return n*t*4/s.components*s.byteLength;case la:case da:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ha:case ua:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case pr:case gr:return Math.max(n,16)*Math.max(t,8)/4;case fr:case mr:return Math.max(n,8)*Math.max(t,8)/2;case _r:case xr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case vr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Mr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case yr:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Sr:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case br:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Er:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Tr:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Ar:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case wr:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Rr:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Cr:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Pr:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Dr:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Lr:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Ir:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case fa:case kr:case Ur:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Ld:case Fr:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Nr:case zr:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function qx(n){switch(n){case On:case bd:return{byteLength:1,components:1};case Es:case Ed:case As:return{byteLength:2,components:1};case ec:case nc:return{byteLength:2,components:4};case Mi:case tc:case Fn:return{byteLength:4,components:1};case Td:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function jx(n,t,e,i,s,a,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new te,d=new WeakMap;let f;const h=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,S){return u?new OffscreenCanvas(C,S):Ra("canvas")}function _(C,S,V){let lt=1;const rt=wt(C);if((rt.width>V||rt.height>V)&&(lt=V/Math.max(rt.width,rt.height)),lt<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const st=Math.floor(lt*rt.width),kt=Math.floor(lt*rt.height);f===void 0&&(f=g(st,kt));const nt=S?g(st,kt):f;return nt.width=st,nt.height=kt,nt.getContext("2d").drawImage(C,0,0,st,kt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+rt.width+"x"+rt.height+") to ("+st+"x"+kt+")."),nt}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+rt.width+"x"+rt.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){n.generateMipmap(C)}function x(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(C,S,V,lt,rt=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let st=S;if(S===n.RED&&(V===n.FLOAT&&(st=n.R32F),V===n.HALF_FLOAT&&(st=n.R16F),V===n.UNSIGNED_BYTE&&(st=n.R8)),S===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(st=n.R8UI),V===n.UNSIGNED_SHORT&&(st=n.R16UI),V===n.UNSIGNED_INT&&(st=n.R32UI),V===n.BYTE&&(st=n.R8I),V===n.SHORT&&(st=n.R16I),V===n.INT&&(st=n.R32I)),S===n.RG&&(V===n.FLOAT&&(st=n.RG32F),V===n.HALF_FLOAT&&(st=n.RG16F),V===n.UNSIGNED_BYTE&&(st=n.RG8)),S===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&(st=n.RG8UI),V===n.UNSIGNED_SHORT&&(st=n.RG16UI),V===n.UNSIGNED_INT&&(st=n.RG32UI),V===n.BYTE&&(st=n.RG8I),V===n.SHORT&&(st=n.RG16I),V===n.INT&&(st=n.RG32I)),S===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&(st=n.RGB8UI),V===n.UNSIGNED_SHORT&&(st=n.RGB16UI),V===n.UNSIGNED_INT&&(st=n.RGB32UI),V===n.BYTE&&(st=n.RGB8I),V===n.SHORT&&(st=n.RGB16I),V===n.INT&&(st=n.RGB32I)),S===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&(st=n.RGBA8UI),V===n.UNSIGNED_SHORT&&(st=n.RGBA16UI),V===n.UNSIGNED_INT&&(st=n.RGBA32UI),V===n.BYTE&&(st=n.RGBA8I),V===n.SHORT&&(st=n.RGBA16I),V===n.INT&&(st=n.RGBA32I)),S===n.RGB&&V===n.UNSIGNED_INT_5_9_9_9_REV&&(st=n.RGB9_E5),S===n.RGBA){const kt=rt?Ia:ee.getTransfer(lt);V===n.FLOAT&&(st=n.RGBA32F),V===n.HALF_FLOAT&&(st=n.RGBA16F),V===n.UNSIGNED_BYTE&&(st=kt===re?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT_4_4_4_4&&(st=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(st=n.RGB5_A1)}return(st===n.R16F||st===n.R32F||st===n.RG16F||st===n.RG32F||st===n.RGBA16F||st===n.RGBA32F)&&t.get("EXT_color_buffer_float"),st}function M(C,S){let V;return C?S===null||S===Mi||S===qi?V=n.DEPTH24_STENCIL8:S===Fn?V=n.DEPTH32F_STENCIL8:S===Es&&(V=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Mi||S===qi?V=n.DEPTH_COMPONENT24:S===Fn?V=n.DEPTH_COMPONENT32F:S===Es&&(V=n.DEPTH_COMPONENT16),V}function k(C,S){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==pn&&C.minFilter!==Sn?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function R(C){const S=C.target;S.removeEventListener("dispose",R),T(S),S.isVideoTexture&&d.delete(S)}function A(C){const S=C.target;S.removeEventListener("dispose",A),y(S)}function T(C){const S=i.get(C);if(S.__webglInit===void 0)return;const V=C.source,lt=h.get(V);if(lt){const rt=lt[S.__cacheKey];rt.usedTimes--,rt.usedTimes===0&&b(C),Object.keys(lt).length===0&&h.delete(V)}i.remove(C)}function b(C){const S=i.get(C);n.deleteTexture(S.__webglTexture);const V=C.source,lt=h.get(V);delete lt[S.__cacheKey],o.memory.textures--}function y(C){const S=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let lt=0;lt<6;lt++){if(Array.isArray(S.__webglFramebuffer[lt]))for(let rt=0;rt<S.__webglFramebuffer[lt].length;rt++)n.deleteFramebuffer(S.__webglFramebuffer[lt][rt]);else n.deleteFramebuffer(S.__webglFramebuffer[lt]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[lt])}else{if(Array.isArray(S.__webglFramebuffer))for(let lt=0;lt<S.__webglFramebuffer.length;lt++)n.deleteFramebuffer(S.__webglFramebuffer[lt]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let lt=0;lt<S.__webglColorRenderbuffer.length;lt++)S.__webglColorRenderbuffer[lt]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[lt]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const V=C.textures;for(let lt=0,rt=V.length;lt<rt;lt++){const st=i.get(V[lt]);st.__webglTexture&&(n.deleteTexture(st.__webglTexture),o.memory.textures--),i.remove(V[lt])}i.remove(C)}let D=0;function G(){D=0}function z(){const C=D;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),D+=1,C}function W(C){const S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function P(C,S){const V=i.get(C);if(C.isVideoTexture&&At(C),C.isRenderTargetTexture===!1&&C.version>0&&V.__version!==C.version){const lt=C.image;if(lt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(lt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(V,C,S);return}}e.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+S)}function w(C,S){const V=i.get(C);if(C.version>0&&V.__version!==C.version){Y(V,C,S);return}e.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+S)}function X(C,S){const V=i.get(C);if(C.version>0&&V.__version!==C.version){Y(V,C,S);return}e.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+S)}function H(C,S){const V=i.get(C);if(C.version>0&&V.__version!==C.version){tt(V,C,S);return}e.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+S)}const j={[hr]:n.REPEAT,[gi]:n.CLAMP_TO_EDGE,[ur]:n.MIRRORED_REPEAT},Q={[pn]:n.NEAREST,[Np]:n.NEAREST_MIPMAP_NEAREST,[Us]:n.NEAREST_MIPMAP_LINEAR,[Sn]:n.LINEAR,[no]:n.LINEAR_MIPMAP_NEAREST,[_i]:n.LINEAR_MIPMAP_LINEAR},ht={[Hp]:n.NEVER,[Yp]:n.ALWAYS,[Gp]:n.LESS,[kd]:n.LEQUAL,[Vp]:n.EQUAL,[$p]:n.GEQUAL,[Xp]:n.GREATER,[Wp]:n.NOTEQUAL};function mt(C,S){if(S.type===Fn&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===Sn||S.magFilter===no||S.magFilter===Us||S.magFilter===_i||S.minFilter===Sn||S.minFilter===no||S.minFilter===Us||S.minFilter===_i)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,j[S.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,j[S.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,j[S.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,Q[S.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,Q[S.minFilter]),S.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,ht[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===pn||S.minFilter!==Us&&S.minFilter!==_i||S.type===Fn&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const V=t.get("EXT_texture_filter_anisotropic");n.texParameterf(C,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Mt(C,S){let V=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",R));const lt=S.source;let rt=h.get(lt);rt===void 0&&(rt={},h.set(lt,rt));const st=W(S);if(st!==C.__cacheKey){rt[st]===void 0&&(rt[st]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,V=!0),rt[st].usedTimes++;const kt=rt[C.__cacheKey];kt!==void 0&&(rt[C.__cacheKey].usedTimes--,kt.usedTimes===0&&b(S)),C.__cacheKey=st,C.__webglTexture=rt[st].texture}return V}function Y(C,S,V){let lt=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(lt=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(lt=n.TEXTURE_3D);const rt=Mt(C,S),st=S.source;e.bindTexture(lt,C.__webglTexture,n.TEXTURE0+V);const kt=i.get(st);if(st.version!==kt.__version||rt===!0){e.activeTexture(n.TEXTURE0+V);const nt=ee.getPrimaries(ee.workingColorSpace),B=S.colorSpace===qn?null:ee.getPrimaries(S.colorSpace),gt=S.colorSpace===qn||nt===B?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);let Z=_(S.image,!1,s.maxTextureSize);Z=yt(S,Z);const pt=a.convert(S.format,S.colorSpace),U=a.convert(S.type);let et=v(S.internalFormat,pt,U,S.colorSpace,S.isVideoTexture);mt(lt,S);let dt;const Lt=S.mipmaps,Ft=S.isVideoTexture!==!0,Bt=kt.__version===void 0||rt===!0,F=st.dataReady,vt=k(S,Z);if(S.isDepthTexture)et=M(S.format===ji,S.type),Bt&&(Ft?e.texStorage2D(n.TEXTURE_2D,1,et,Z.width,Z.height):e.texImage2D(n.TEXTURE_2D,0,et,Z.width,Z.height,0,pt,U,null));else if(S.isDataTexture)if(Lt.length>0){Ft&&Bt&&e.texStorage2D(n.TEXTURE_2D,vt,et,Lt[0].width,Lt[0].height);for(let K=0,at=Lt.length;K<at;K++)dt=Lt[K],Ft?F&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,dt.width,dt.height,pt,U,dt.data):e.texImage2D(n.TEXTURE_2D,K,et,dt.width,dt.height,0,pt,U,dt.data);S.generateMipmaps=!1}else Ft?(Bt&&e.texStorage2D(n.TEXTURE_2D,vt,et,Z.width,Z.height),F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Z.width,Z.height,pt,U,Z.data)):e.texImage2D(n.TEXTURE_2D,0,et,Z.width,Z.height,0,pt,U,Z.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ft&&Bt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,vt,et,Lt[0].width,Lt[0].height,Z.depth);for(let K=0,at=Lt.length;K<at;K++)if(dt=Lt[K],S.format!==fn)if(pt!==null)if(Ft){if(F)if(S.layerUpdates.size>0){const it=Wl(dt.width,dt.height,S.format,S.type);for(const ut of S.layerUpdates){const Ut=dt.data.subarray(ut*it/dt.data.BYTES_PER_ELEMENT,(ut+1)*it/dt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,ut,dt.width,dt.height,1,pt,Ut)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,dt.width,dt.height,Z.depth,pt,dt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,K,et,dt.width,dt.height,Z.depth,0,dt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ft?F&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,dt.width,dt.height,Z.depth,pt,U,dt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,K,et,dt.width,dt.height,Z.depth,0,pt,U,dt.data)}else{Ft&&Bt&&e.texStorage2D(n.TEXTURE_2D,vt,et,Lt[0].width,Lt[0].height);for(let K=0,at=Lt.length;K<at;K++)dt=Lt[K],S.format!==fn?pt!==null?Ft?F&&e.compressedTexSubImage2D(n.TEXTURE_2D,K,0,0,dt.width,dt.height,pt,dt.data):e.compressedTexImage2D(n.TEXTURE_2D,K,et,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ft?F&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,dt.width,dt.height,pt,U,dt.data):e.texImage2D(n.TEXTURE_2D,K,et,dt.width,dt.height,0,pt,U,dt.data)}else if(S.isDataArrayTexture)if(Ft){if(Bt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,vt,et,Z.width,Z.height,Z.depth),F)if(S.layerUpdates.size>0){const K=Wl(Z.width,Z.height,S.format,S.type);for(const at of S.layerUpdates){const it=Z.data.subarray(at*K/Z.data.BYTES_PER_ELEMENT,(at+1)*K/Z.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,at,Z.width,Z.height,1,pt,U,it)}S.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,pt,U,Z.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,et,Z.width,Z.height,Z.depth,0,pt,U,Z.data);else if(S.isData3DTexture)Ft?(Bt&&e.texStorage3D(n.TEXTURE_3D,vt,et,Z.width,Z.height,Z.depth),F&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,pt,U,Z.data)):e.texImage3D(n.TEXTURE_3D,0,et,Z.width,Z.height,Z.depth,0,pt,U,Z.data);else if(S.isFramebufferTexture){if(Bt)if(Ft)e.texStorage2D(n.TEXTURE_2D,vt,et,Z.width,Z.height);else{let K=Z.width,at=Z.height;for(let it=0;it<vt;it++)e.texImage2D(n.TEXTURE_2D,it,et,K,at,0,pt,U,null),K>>=1,at>>=1}}else if(Lt.length>0){if(Ft&&Bt){const K=wt(Lt[0]);e.texStorage2D(n.TEXTURE_2D,vt,et,K.width,K.height)}for(let K=0,at=Lt.length;K<at;K++)dt=Lt[K],Ft?F&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,pt,U,dt):e.texImage2D(n.TEXTURE_2D,K,et,pt,U,dt);S.generateMipmaps=!1}else if(Ft){if(Bt){const K=wt(Z);e.texStorage2D(n.TEXTURE_2D,vt,et,K.width,K.height)}F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,pt,U,Z)}else e.texImage2D(n.TEXTURE_2D,0,et,pt,U,Z);m(S)&&p(lt),kt.__version=st.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function tt(C,S,V){if(S.image.length!==6)return;const lt=Mt(C,S),rt=S.source;e.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+V);const st=i.get(rt);if(rt.version!==st.__version||lt===!0){e.activeTexture(n.TEXTURE0+V);const kt=ee.getPrimaries(ee.workingColorSpace),nt=S.colorSpace===qn?null:ee.getPrimaries(S.colorSpace),B=S.colorSpace===qn||kt===nt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,B);const gt=S.isCompressedTexture||S.image[0].isCompressedTexture,Z=S.image[0]&&S.image[0].isDataTexture,pt=[];for(let at=0;at<6;at++)!gt&&!Z?pt[at]=_(S.image[at],!0,s.maxCubemapSize):pt[at]=Z?S.image[at].image:S.image[at],pt[at]=yt(S,pt[at]);const U=pt[0],et=a.convert(S.format,S.colorSpace),dt=a.convert(S.type),Lt=v(S.internalFormat,et,dt,S.colorSpace),Ft=S.isVideoTexture!==!0,Bt=st.__version===void 0||lt===!0,F=rt.dataReady;let vt=k(S,U);mt(n.TEXTURE_CUBE_MAP,S);let K;if(gt){Ft&&Bt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,vt,Lt,U.width,U.height);for(let at=0;at<6;at++){K=pt[at].mipmaps;for(let it=0;it<K.length;it++){const ut=K[it];S.format!==fn?et!==null?Ft?F&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,it,0,0,ut.width,ut.height,et,ut.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,it,Lt,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ft?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,it,0,0,ut.width,ut.height,et,dt,ut.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,it,Lt,ut.width,ut.height,0,et,dt,ut.data)}}}else{if(K=S.mipmaps,Ft&&Bt){K.length>0&&vt++;const at=wt(pt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,vt,Lt,at.width,at.height)}for(let at=0;at<6;at++)if(Z){Ft?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,pt[at].width,pt[at].height,et,dt,pt[at].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Lt,pt[at].width,pt[at].height,0,et,dt,pt[at].data);for(let it=0;it<K.length;it++){const Ut=K[it].image[at].image;Ft?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,it+1,0,0,Ut.width,Ut.height,et,dt,Ut.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,it+1,Lt,Ut.width,Ut.height,0,et,dt,Ut.data)}}else{Ft?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,et,dt,pt[at]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Lt,et,dt,pt[at]);for(let it=0;it<K.length;it++){const ut=K[it];Ft?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,it+1,0,0,et,dt,ut.image[at]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,it+1,Lt,et,dt,ut.image[at])}}}m(S)&&p(n.TEXTURE_CUBE_MAP),st.__version=rt.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function xt(C,S,V,lt,rt,st){const kt=a.convert(V.format,V.colorSpace),nt=a.convert(V.type),B=v(V.internalFormat,kt,nt,V.colorSpace),gt=i.get(S),Z=i.get(V);if(Z.__renderTarget=S,!gt.__hasExternalTextures){const pt=Math.max(1,S.width>>st),U=Math.max(1,S.height>>st);rt===n.TEXTURE_3D||rt===n.TEXTURE_2D_ARRAY?e.texImage3D(rt,st,B,pt,U,S.depth,0,kt,nt,null):e.texImage2D(rt,st,B,pt,U,0,kt,nt,null)}e.bindFramebuffer(n.FRAMEBUFFER,C),Dt(S)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,lt,rt,Z.__webglTexture,0,Ct(S)):(rt===n.TEXTURE_2D||rt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&rt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,lt,rt,Z.__webglTexture,st),e.bindFramebuffer(n.FRAMEBUFFER,null)}function J(C,S,V){if(n.bindRenderbuffer(n.RENDERBUFFER,C),S.depthBuffer){const lt=S.depthTexture,rt=lt&&lt.isDepthTexture?lt.type:null,st=M(S.stencilBuffer,rt),kt=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,nt=Ct(S);Dt(S)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,nt,st,S.width,S.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,nt,st,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,st,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,kt,n.RENDERBUFFER,C)}else{const lt=S.textures;for(let rt=0;rt<lt.length;rt++){const st=lt[rt],kt=a.convert(st.format,st.colorSpace),nt=a.convert(st.type),B=v(st.internalFormat,kt,nt,st.colorSpace),gt=Ct(S);V&&Dt(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,gt,B,S.width,S.height):Dt(S)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,gt,B,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,B,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function _t(C,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const lt=i.get(S.depthTexture);lt.__renderTarget=S,(!lt.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),P(S.depthTexture,0);const rt=lt.__webglTexture,st=Ct(S);if(S.depthTexture.format===Xi)Dt(S)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,rt,0,st):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,rt,0);else if(S.depthTexture.format===ji)Dt(S)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,rt,0,st):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,rt,0);else throw new Error("Unknown depthTexture format")}function Pt(C){const S=i.get(C),V=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){const lt=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),lt){const rt=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,lt.removeEventListener("dispose",rt)};lt.addEventListener("dispose",rt),S.__depthDisposeCallback=rt}S.__boundDepthTexture=lt}if(C.depthTexture&&!S.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");_t(S.__webglFramebuffer,C)}else if(V){S.__webglDepthbuffer=[];for(let lt=0;lt<6;lt++)if(e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[lt]),S.__webglDepthbuffer[lt]===void 0)S.__webglDepthbuffer[lt]=n.createRenderbuffer(),J(S.__webglDepthbuffer[lt],C,!1);else{const rt=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=S.__webglDepthbuffer[lt];n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,rt,n.RENDERBUFFER,st)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),J(S.__webglDepthbuffer,C,!1);else{const lt=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,rt),n.framebufferRenderbuffer(n.FRAMEBUFFER,lt,n.RENDERBUFFER,rt)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Tt(C,S,V){const lt=i.get(C);S!==void 0&&xt(lt.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&Pt(C)}function zt(C){const S=C.texture,V=i.get(C),lt=i.get(S);C.addEventListener("dispose",A);const rt=C.textures,st=C.isWebGLCubeRenderTarget===!0,kt=rt.length>1;if(kt||(lt.__webglTexture===void 0&&(lt.__webglTexture=n.createTexture()),lt.__version=S.version,o.memory.textures++),st){V.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(S.mipmaps&&S.mipmaps.length>0){V.__webglFramebuffer[nt]=[];for(let B=0;B<S.mipmaps.length;B++)V.__webglFramebuffer[nt][B]=n.createFramebuffer()}else V.__webglFramebuffer[nt]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){V.__webglFramebuffer=[];for(let nt=0;nt<S.mipmaps.length;nt++)V.__webglFramebuffer[nt]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(kt)for(let nt=0,B=rt.length;nt<B;nt++){const gt=i.get(rt[nt]);gt.__webglTexture===void 0&&(gt.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&Dt(C)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let nt=0;nt<rt.length;nt++){const B=rt[nt];V.__webglColorRenderbuffer[nt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[nt]);const gt=a.convert(B.format,B.colorSpace),Z=a.convert(B.type),pt=v(B.internalFormat,gt,Z,B.colorSpace,C.isXRRenderTarget===!0),U=Ct(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,U,pt,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+nt,n.RENDERBUFFER,V.__webglColorRenderbuffer[nt])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),J(V.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(st){e.bindTexture(n.TEXTURE_CUBE_MAP,lt.__webglTexture),mt(n.TEXTURE_CUBE_MAP,S);for(let nt=0;nt<6;nt++)if(S.mipmaps&&S.mipmaps.length>0)for(let B=0;B<S.mipmaps.length;B++)xt(V.__webglFramebuffer[nt][B],C,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,B);else xt(V.__webglFramebuffer[nt],C,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);m(S)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(kt){for(let nt=0,B=rt.length;nt<B;nt++){const gt=rt[nt],Z=i.get(gt);e.bindTexture(n.TEXTURE_2D,Z.__webglTexture),mt(n.TEXTURE_2D,gt),xt(V.__webglFramebuffer,C,gt,n.COLOR_ATTACHMENT0+nt,n.TEXTURE_2D,0),m(gt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let nt=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(nt=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(nt,lt.__webglTexture),mt(nt,S),S.mipmaps&&S.mipmaps.length>0)for(let B=0;B<S.mipmaps.length;B++)xt(V.__webglFramebuffer[B],C,S,n.COLOR_ATTACHMENT0,nt,B);else xt(V.__webglFramebuffer,C,S,n.COLOR_ATTACHMENT0,nt,0);m(S)&&p(nt),e.unbindTexture()}C.depthBuffer&&Pt(C)}function St(C){const S=C.textures;for(let V=0,lt=S.length;V<lt;V++){const rt=S[V];if(m(rt)){const st=x(C),kt=i.get(rt).__webglTexture;e.bindTexture(st,kt),p(st),e.unbindTexture()}}}const bt=[],O=[];function $t(C){if(C.samples>0){if(Dt(C)===!1){const S=C.textures,V=C.width,lt=C.height;let rt=n.COLOR_BUFFER_BIT;const st=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,kt=i.get(C),nt=S.length>1;if(nt)for(let B=0;B<S.length;B++)e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+B,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+B,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,kt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglFramebuffer);for(let B=0;B<S.length;B++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(rt|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(rt|=n.STENCIL_BUFFER_BIT)),nt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,kt.__webglColorRenderbuffer[B]);const gt=i.get(S[B]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,gt,0)}n.blitFramebuffer(0,0,V,lt,0,0,V,lt,rt,n.NEAREST),c===!0&&(bt.length=0,O.length=0,bt.push(n.COLOR_ATTACHMENT0+B),C.depthBuffer&&C.resolveDepthBuffer===!1&&(bt.push(st),O.push(st),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,O)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,bt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),nt)for(let B=0;B<S.length;B++){e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+B,n.RENDERBUFFER,kt.__webglColorRenderbuffer[B]);const gt=i.get(S[B]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+B,n.TEXTURE_2D,gt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const S=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function Ct(C){return Math.min(s.maxSamples,C.samples)}function Dt(C){const S=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function At(C){const S=o.render.frame;d.get(C)!==S&&(d.set(C,S),C.update())}function yt(C,S){const V=C.colorSpace,lt=C.format,rt=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||V!==Ji&&V!==qn&&(ee.getTransfer(V)===re?(lt!==fn||rt!==On)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),S}function wt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=G,this.setTexture2D=P,this.setTexture2DArray=w,this.setTexture3D=X,this.setTextureCube=H,this.rebindTextures=Tt,this.setupRenderTarget=zt,this.updateRenderTargetMipmap=St,this.updateMultisampleRenderTarget=$t,this.setupDepthRenderbuffer=Pt,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=Dt}function Kx(n,t){function e(i,s=qn){let a;const o=ee.getTransfer(s);if(i===On)return n.UNSIGNED_BYTE;if(i===ec)return n.UNSIGNED_SHORT_4_4_4_4;if(i===nc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Td)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===bd)return n.BYTE;if(i===Ed)return n.SHORT;if(i===Es)return n.UNSIGNED_SHORT;if(i===tc)return n.INT;if(i===Mi)return n.UNSIGNED_INT;if(i===Fn)return n.FLOAT;if(i===As)return n.HALF_FLOAT;if(i===Ad)return n.ALPHA;if(i===wd)return n.RGB;if(i===fn)return n.RGBA;if(i===Rd)return n.LUMINANCE;if(i===Cd)return n.LUMINANCE_ALPHA;if(i===Xi)return n.DEPTH_COMPONENT;if(i===ji)return n.DEPTH_STENCIL;if(i===Pd)return n.RED;if(i===ic)return n.RED_INTEGER;if(i===Dd)return n.RG;if(i===sc)return n.RG_INTEGER;if(i===ac)return n.RGBA_INTEGER;if(i===la||i===da||i===ha||i===ua)if(o===re)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===la)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===da)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ha)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ua)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===la)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===da)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ha)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ua)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===fr||i===pr||i===mr||i===gr)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===fr)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===pr)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===mr)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===gr)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===_r||i===xr||i===vr)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===_r||i===xr)return o===re?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===vr)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Mr||i===yr||i===Sr||i===br||i===Er||i===Tr||i===Ar||i===wr||i===Rr||i===Cr||i===Pr||i===Dr||i===Lr||i===Ir)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Mr)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===yr)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Sr)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===br)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Er)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Tr)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ar)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===wr)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Rr)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Cr)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Pr)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Dr)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Lr)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ir)return o===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===fa||i===kr||i===Ur)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===fa)return o===re?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===kr)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ur)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ld||i===Fr||i===Nr||i===zr)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===fa)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Fr)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Nr)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===zr)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===qi?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class Jx extends Ke{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ae extends ve{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Qx={type:"move"};class Do{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ae,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ae,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ae,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,a=null,o=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const d=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],h=d.position.distanceTo(f.position),u=.02,g=.005;l.inputState.pinching&&h>u+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=u-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Qx)))}return r!==null&&(r.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ae;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const tv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ev=`
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

}`;class nv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const s=new Ge,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ti({vertexShader:tv,fragmentShader:ev,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new he(new Ua(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class iv extends Qi{constructor(t,e){super();const i=this;let s=null,a=1,o=null,r="local-floor",c=1,l=null,d=null,f=null,h=null,u=null,g=null;const _=new nv,m=e.getContextAttributes();let p=null,x=null;const v=[],M=[],k=new te;let R=null;const A=new Ke;A.viewport=new me;const T=new Ke;T.viewport=new me;const b=[A,T],y=new Jx;let D=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let tt=v[Y];return tt===void 0&&(tt=new Do,v[Y]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Y){let tt=v[Y];return tt===void 0&&(tt=new Do,v[Y]=tt),tt.getGripSpace()},this.getHand=function(Y){let tt=v[Y];return tt===void 0&&(tt=new Do,v[Y]=tt),tt.getHandSpace()};function z(Y){const tt=M.indexOf(Y.inputSource);if(tt===-1)return;const xt=v[tt];xt!==void 0&&(xt.update(Y.inputSource,Y.frame,l||o),xt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function W(){s.removeEventListener("select",z),s.removeEventListener("selectstart",z),s.removeEventListener("selectend",z),s.removeEventListener("squeeze",z),s.removeEventListener("squeezestart",z),s.removeEventListener("squeezeend",z),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",P);for(let Y=0;Y<v.length;Y++){const tt=M[Y];tt!==null&&(M[Y]=null,v[Y].disconnect(tt))}D=null,G=null,_.reset(),t.setRenderTarget(p),u=null,h=null,f=null,s=null,x=null,Mt.stop(),i.isPresenting=!1,t.setPixelRatio(R),t.setSize(k.width,k.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){a=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){r=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return h!==null?h:u},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",z),s.addEventListener("selectstart",z),s.addEventListener("selectend",z),s.addEventListener("squeeze",z),s.addEventListener("squeezestart",z),s.addEventListener("squeezeend",z),s.addEventListener("end",W),s.addEventListener("inputsourceschange",P),m.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(k),s.renderState.layers===void 0){const tt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,e,tt),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new yi(u.framebufferWidth,u.framebufferHeight,{format:fn,type:On,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let tt=null,xt=null,J=null;m.depth&&(J=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=m.stencil?ji:Xi,xt=m.stencil?qi:Mi);const _t={colorFormat:e.RGBA8,depthFormat:J,scaleFactor:a};f=new XRWebGLBinding(s,e),h=f.createProjectionLayer(_t),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),x=new yi(h.textureWidth,h.textureHeight,{format:fn,type:On,depthTexture:new $d(h.textureWidth,h.textureHeight,xt,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(r),Mt.setContext(s),Mt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function P(Y){for(let tt=0;tt<Y.removed.length;tt++){const xt=Y.removed[tt],J=M.indexOf(xt);J>=0&&(M[J]=null,v[J].disconnect(xt))}for(let tt=0;tt<Y.added.length;tt++){const xt=Y.added[tt];let J=M.indexOf(xt);if(J===-1){for(let Pt=0;Pt<v.length;Pt++)if(Pt>=M.length){M.push(xt),J=Pt;break}else if(M[Pt]===null){M[Pt]=xt,J=Pt;break}if(J===-1)break}const _t=v[J];_t&&_t.connect(xt)}}const w=new q,X=new q;function H(Y,tt,xt){w.setFromMatrixPosition(tt.matrixWorld),X.setFromMatrixPosition(xt.matrixWorld);const J=w.distanceTo(X),_t=tt.projectionMatrix.elements,Pt=xt.projectionMatrix.elements,Tt=_t[14]/(_t[10]-1),zt=_t[14]/(_t[10]+1),St=(_t[9]+1)/_t[5],bt=(_t[9]-1)/_t[5],O=(_t[8]-1)/_t[0],$t=(Pt[8]+1)/Pt[0],Ct=Tt*O,Dt=Tt*$t,At=J/(-O+$t),yt=At*-O;if(tt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(yt),Y.translateZ(At),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),_t[10]===-1)Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const wt=Tt+At,C=zt+At,S=Ct-yt,V=Dt+(J-yt),lt=St*zt/C*wt,rt=bt*zt/C*wt;Y.projectionMatrix.makePerspective(S,V,lt,rt,wt,C),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function j(Y,tt){tt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(tt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let tt=Y.near,xt=Y.far;_.texture!==null&&(_.depthNear>0&&(tt=_.depthNear),_.depthFar>0&&(xt=_.depthFar)),y.near=T.near=A.near=tt,y.far=T.far=A.far=xt,(D!==y.near||G!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),D=y.near,G=y.far),A.layers.mask=Y.layers.mask|2,T.layers.mask=Y.layers.mask|4,y.layers.mask=A.layers.mask|T.layers.mask;const J=Y.parent,_t=y.cameras;j(y,J);for(let Pt=0;Pt<_t.length;Pt++)j(_t[Pt],J);_t.length===2?H(y,A,T):y.projectionMatrix.copy(A.projectionMatrix),Q(Y,y,J)};function Q(Y,tt,xt){xt===null?Y.matrix.copy(tt.matrixWorld):(Y.matrix.copy(xt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(tt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Or*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&u===null))return c},this.setFoveation=function(Y){c=Y,h!==null&&(h.fixedFoveation=Y),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let ht=null;function mt(Y,tt){if(d=tt.getViewerPose(l||o),g=tt,d!==null){const xt=d.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let J=!1;xt.length!==y.cameras.length&&(y.cameras.length=0,J=!0);for(let Pt=0;Pt<xt.length;Pt++){const Tt=xt[Pt];let zt=null;if(u!==null)zt=u.getViewport(Tt);else{const bt=f.getViewSubImage(h,Tt);zt=bt.viewport,Pt===0&&(t.setRenderTargetTextures(x,bt.colorTexture,h.ignoreDepthValues?void 0:bt.depthStencilTexture),t.setRenderTarget(x))}let St=b[Pt];St===void 0&&(St=new Ke,St.layers.enable(Pt),St.viewport=new me,b[Pt]=St),St.matrix.fromArray(Tt.transform.matrix),St.matrix.decompose(St.position,St.quaternion,St.scale),St.projectionMatrix.fromArray(Tt.projectionMatrix),St.projectionMatrixInverse.copy(St.projectionMatrix).invert(),St.viewport.set(zt.x,zt.y,zt.width,zt.height),Pt===0&&(y.matrix.copy(St.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),J===!0&&y.cameras.push(St)}const _t=s.enabledFeatures;if(_t&&_t.includes("depth-sensing")){const Pt=f.getDepthInformation(xt[0]);Pt&&Pt.isValid&&Pt.texture&&_.init(t,Pt,s.renderState)}}for(let xt=0;xt<v.length;xt++){const J=M[xt],_t=v[xt];J!==null&&_t!==void 0&&_t.update(J,tt,l||o)}ht&&ht(Y,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),g=null}const Mt=new Xd;Mt.setAnimationLoop(mt),this.setAnimationLoop=function(Y){ht=Y},this.dispose=function(){}}}const li=new En,sv=new fe;function av(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Hd(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,v,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),f(m,p)):p.isMeshPhongMaterial?(a(m,p),d(m,p)):p.isMeshStandardMaterial?(a(m,p),h(m,p),p.isMeshPhysicalMaterial&&u(m,p,M)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),_(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?c(m,p,x,v):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===He&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===He&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),v=x.envMap,M=x.envMapRotation;v&&(m.envMap.value=v,li.copy(M),li.x*=-1,li.y*=-1,li.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(li.y*=-1,li.z*=-1),m.envMapRotation.value.setFromMatrix4(sv.makeRotationFromEuler(li)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=v*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===He&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function ov(n,t,e,i){let s={},a={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,v){const M=v.program;i.uniformBlockBinding(x,M)}function l(x,v){let M=s[x.id];M===void 0&&(g(x),M=d(x),s[x.id]=M,x.addEventListener("dispose",m));const k=v.program;i.updateUBOMapping(x,k);const R=t.render.frame;a[x.id]!==R&&(h(x),a[x.id]=R)}function d(x){const v=f();x.__bindingPointIndex=v;const M=n.createBuffer(),k=x.__size,R=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,k,R),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,M),M}function f(){for(let x=0;x<r;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){const v=s[x.id],M=x.uniforms,k=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let R=0,A=M.length;R<A;R++){const T=Array.isArray(M[R])?M[R]:[M[R]];for(let b=0,y=T.length;b<y;b++){const D=T[b];if(u(D,R,b,k)===!0){const G=D.__offset,z=Array.isArray(D.value)?D.value:[D.value];let W=0;for(let P=0;P<z.length;P++){const w=z[P],X=_(w);typeof w=="number"||typeof w=="boolean"?(D.__data[0]=w,n.bufferSubData(n.UNIFORM_BUFFER,G+W,D.__data)):w.isMatrix3?(D.__data[0]=w.elements[0],D.__data[1]=w.elements[1],D.__data[2]=w.elements[2],D.__data[3]=0,D.__data[4]=w.elements[3],D.__data[5]=w.elements[4],D.__data[6]=w.elements[5],D.__data[7]=0,D.__data[8]=w.elements[6],D.__data[9]=w.elements[7],D.__data[10]=w.elements[8],D.__data[11]=0):(w.toArray(D.__data,W),W+=X.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,G,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,v,M,k){const R=x.value,A=v+"_"+M;if(k[A]===void 0)return typeof R=="number"||typeof R=="boolean"?k[A]=R:k[A]=R.clone(),!0;{const T=k[A];if(typeof R=="number"||typeof R=="boolean"){if(T!==R)return k[A]=R,!0}else if(T.equals(R)===!1)return T.copy(R),!0}return!1}function g(x){const v=x.uniforms;let M=0;const k=16;for(let A=0,T=v.length;A<T;A++){const b=Array.isArray(v[A])?v[A]:[v[A]];for(let y=0,D=b.length;y<D;y++){const G=b[y],z=Array.isArray(G.value)?G.value:[G.value];for(let W=0,P=z.length;W<P;W++){const w=z[W],X=_(w),H=M%k,j=H%X.boundary,Q=H+j;M+=j,Q!==0&&k-Q<X.storage&&(M+=k-Q),G.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=M,M+=X.storage}}}const R=M%k;return R>0&&(M+=k-R),x.__size=M,x.__cache={},this}function _(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function m(x){const v=x.target;v.removeEventListener("dispose",m);const M=o.indexOf(v.__bindingPointIndex);o.splice(M,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function p(){for(const x in s)n.deleteBuffer(s[x]);o=[],s={},a={}}return{bind:c,update:l,dispose:p}}class rv{constructor(t={}){const{canvas:e=qp(),context:i=null,depth:s=!0,stencil:a=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const x=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=je,this.toneMapping=Jn,this.toneMappingExposure=1;const M=this;let k=!1,R=0,A=0,T=null,b=-1,y=null;const D=new me,G=new me;let z=null;const W=new Wt(0);let P=0,w=e.width,X=e.height,H=1,j=null,Q=null;const ht=new me(0,0,w,X),mt=new me(0,0,w,X);let Mt=!1;const Y=new cc;let tt=!1,xt=!1;const J=new fe,_t=new fe,Pt=new q,Tt=new me,zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let St=!1;function bt(){return T===null?H:1}let O=i;function $t(E,$){return e.getContext(E,$)}try{const E={alpha:!0,depth:s,stencil:a,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Jr}`),e.addEventListener("webglcontextlost",at,!1),e.addEventListener("webglcontextrestored",it,!1),e.addEventListener("webglcontextcreationerror",ut,!1),O===null){const $="webgl2";if(O=$t($,E),O===null)throw $t($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Ct,Dt,At,yt,wt,C,S,V,lt,rt,st,kt,nt,B,gt,Z,pt,U,et,dt,Lt,Ft,Bt,F;function vt(){Ct=new u_(O),Ct.init(),Ft=new Kx(O,Ct),Dt=new o_(O,Ct,t,Ft),At=new Zx(O,Ct),Dt.reverseDepthBuffer&&h&&At.buffers.depth.setReversed(!0),yt=new m_(O),wt=new Ix,C=new jx(O,Ct,At,wt,Dt,Ft,yt),S=new c_(M),V=new h_(M),lt=new Sm(O),Bt=new s_(O,lt),rt=new f_(O,lt,yt,Bt),st=new __(O,rt,lt,yt),et=new g_(O,Dt,C),Z=new r_(wt),kt=new Lx(M,S,V,Ct,Dt,Bt,Z),nt=new av(M,wt),B=new Ux,gt=new Hx(Ct),U=new i_(M,S,V,At,st,u,c),pt=new $x(M,st,Dt),F=new ov(O,yt,Dt,At),dt=new a_(O,Ct,yt),Lt=new p_(O,Ct,yt),yt.programs=kt.programs,M.capabilities=Dt,M.extensions=Ct,M.properties=wt,M.renderLists=B,M.shadowMap=pt,M.state=At,M.info=yt}vt();const K=new iv(M,O);this.xr=K,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const E=Ct.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Ct.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(E){E!==void 0&&(H=E,this.setSize(w,X,!1))},this.getSize=function(E){return E.set(w,X)},this.setSize=function(E,$,L=!0){if(K.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}w=E,X=$,e.width=Math.floor(E*H),e.height=Math.floor($*H),L===!0&&(e.style.width=E+"px",e.style.height=$+"px"),this.setViewport(0,0,E,$)},this.getDrawingBufferSize=function(E){return E.set(w*H,X*H).floor()},this.setDrawingBufferSize=function(E,$,L){w=E,X=$,H=L,e.width=Math.floor(E*L),e.height=Math.floor($*L),this.setViewport(0,0,E,$)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(ht)},this.setViewport=function(E,$,L,N){E.isVector4?ht.set(E.x,E.y,E.z,E.w):ht.set(E,$,L,N),At.viewport(D.copy(ht).multiplyScalar(H).round())},this.getScissor=function(E){return E.copy(mt)},this.setScissor=function(E,$,L,N){E.isVector4?mt.set(E.x,E.y,E.z,E.w):mt.set(E,$,L,N),At.scissor(G.copy(mt).multiplyScalar(H).round())},this.getScissorTest=function(){return Mt},this.setScissorTest=function(E){At.setScissorTest(Mt=E)},this.setOpaqueSort=function(E){j=E},this.setTransparentSort=function(E){Q=E},this.getClearColor=function(E){return E.copy(U.getClearColor())},this.setClearColor=function(){U.setClearColor.apply(U,arguments)},this.getClearAlpha=function(){return U.getClearAlpha()},this.setClearAlpha=function(){U.setClearAlpha.apply(U,arguments)},this.clear=function(E=!0,$=!0,L=!0){let N=0;if(E){let I=!1;if(T!==null){const ot=T.texture.format;I=ot===ac||ot===sc||ot===ic}if(I){const ot=T.texture.type,ct=ot===On||ot===Mi||ot===Es||ot===qi||ot===ec||ot===nc,ft=U.getClearColor(),Et=U.getClearAlpha(),Ot=ft.r,Ht=ft.g,It=ft.b;ct?(g[0]=Ot,g[1]=Ht,g[2]=It,g[3]=Et,O.clearBufferuiv(O.COLOR,0,g)):(_[0]=Ot,_[1]=Ht,_[2]=It,_[3]=Et,O.clearBufferiv(O.COLOR,0,_))}else N|=O.COLOR_BUFFER_BIT}$&&(N|=O.DEPTH_BUFFER_BIT),L&&(N|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(N)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",at,!1),e.removeEventListener("webglcontextrestored",it,!1),e.removeEventListener("webglcontextcreationerror",ut,!1),B.dispose(),gt.dispose(),wt.dispose(),S.dispose(),V.dispose(),st.dispose(),Bt.dispose(),F.dispose(),kt.dispose(),K.dispose(),K.removeEventListener("sessionstart",Ce),K.removeEventListener("sessionend",we),se.stop()};function at(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),k=!0}function it(){console.log("THREE.WebGLRenderer: Context Restored."),k=!1;const E=yt.autoReset,$=pt.enabled,L=pt.autoUpdate,N=pt.needsUpdate,I=pt.type;vt(),yt.autoReset=E,pt.enabled=$,pt.autoUpdate=L,pt.needsUpdate=N,pt.type=I}function ut(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Ut(E){const $=E.target;$.removeEventListener("dispose",Ut),Xt($)}function Xt(E){Zt(E),wt.remove(E)}function Zt(E){const $=wt.get(E).programs;$!==void 0&&($.forEach(function(L){kt.releaseProgram(L)}),E.isShaderMaterial&&kt.releaseShaderCache(E))}this.renderBufferDirect=function(E,$,L,N,I,ot){$===null&&($=zt);const ct=I.isMesh&&I.matrixWorld.determinant()<0,ft=Bn(E,$,L,N,I);At.setMaterial(N,ct);let Et=L.index,Ot=1;if(N.wireframe===!0){if(Et=rt.getWireframeAttribute(L),Et===void 0)return;Ot=2}const Ht=L.drawRange,It=L.attributes.position;let Gt=Ht.start*Ot,qt=(Ht.start+Ht.count)*Ot;ot!==null&&(Gt=Math.max(Gt,ot.start*Ot),qt=Math.min(qt,(ot.start+ot.count)*Ot)),Et!==null?(Gt=Math.max(Gt,0),qt=Math.min(qt,Et.count)):It!=null&&(Gt=Math.max(Gt,0),qt=Math.min(qt,It.count));const Jt=qt-Gt;if(Jt<0||Jt===1/0)return;Bt.setup(I,N,ft,L,Et);let _e,Kt=dt;if(Et!==null&&(_e=lt.get(Et),Kt=Lt,Kt.setIndex(_e)),I.isMesh)N.wireframe===!0?(At.setLineWidth(N.wireframeLinewidth*bt()),Kt.setMode(O.LINES)):Kt.setMode(O.TRIANGLES);else if(I.isLine){let Nt=N.linewidth;Nt===void 0&&(Nt=1),At.setLineWidth(Nt*bt()),I.isLineSegments?Kt.setMode(O.LINES):I.isLineLoop?Kt.setMode(O.LINE_LOOP):Kt.setMode(O.LINE_STRIP)}else I.isPoints?Kt.setMode(O.POINTS):I.isSprite&&Kt.setMode(O.TRIANGLES);if(I.isBatchedMesh)if(I._multiDrawInstances!==null)Kt.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances);else if(Ct.get("WEBGL_multi_draw"))Kt.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else{const Nt=I._multiDrawStarts,on=I._multiDrawCounts,ne=I._multiDrawCount,Xe=Et?lt.get(Et).bytesPerElement:1,Hn=wt.get(N).currentProgram.getUniforms();for(let Ie=0;Ie<ne;Ie++)Hn.setValue(O,"_gl_DrawID",Ie),Kt.render(Nt[Ie]/Xe,on[Ie])}else if(I.isInstancedMesh)Kt.renderInstances(Gt,Jt,I.count);else if(L.isInstancedBufferGeometry){const Nt=L._maxInstanceCount!==void 0?L._maxInstanceCount:1/0,on=Math.min(L.instanceCount,Nt);Kt.renderInstances(Gt,Jt,on)}else Kt.render(Gt,Jt)};function Vt(E,$,L){E.transparent===!0&&E.side===Fe&&E.forceSinglePass===!1?(E.side=He,E.needsUpdate=!0,ae(E,$,L),E.side=Qn,E.needsUpdate=!0,ae(E,$,L),E.side=Fe):ae(E,$,L)}this.compile=function(E,$,L=null){L===null&&(L=E),p=gt.get(L),p.init($),v.push(p),L.traverseVisible(function(I){I.isLight&&I.layers.test($.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),E!==L&&E.traverseVisible(function(I){I.isLight&&I.layers.test($.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),p.setupLights();const N=new Set;return E.traverse(function(I){if(!(I.isMesh||I.isPoints||I.isLine||I.isSprite))return;const ot=I.material;if(ot)if(Array.isArray(ot))for(let ct=0;ct<ot.length;ct++){const ft=ot[ct];Vt(ft,L,I),N.add(ft)}else Vt(ot,L,I),N.add(ot)}),v.pop(),p=null,N},this.compileAsync=function(E,$,L=null){const N=this.compile(E,$,L);return new Promise(I=>{function ot(){if(N.forEach(function(ct){wt.get(ct).currentProgram.isReady()&&N.delete(ct)}),N.size===0){I(E);return}setTimeout(ot,10)}Ct.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let oe=null;function ue(E){oe&&oe(E)}function Ce(){se.stop()}function we(){se.start()}const se=new Xd;se.setAnimationLoop(ue),typeof self<"u"&&se.setContext(self),this.setAnimationLoop=function(E){oe=E,K.setAnimationLoop(E),E===null?se.stop():se.start()},K.addEventListener("sessionstart",Ce),K.addEventListener("sessionend",we),this.render=function(E,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(k===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(K.cameraAutoUpdate===!0&&K.updateCamera($),$=K.getCamera()),E.isScene===!0&&E.onBeforeRender(M,E,$,T),p=gt.get(E,v.length),p.init($),v.push(p),_t.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),Y.setFromProjectionMatrix(_t),xt=this.localClippingEnabled,tt=Z.init(this.clippingPlanes,xt),m=B.get(E,x.length),m.init(),x.push(m),K.enabled===!0&&K.isPresenting===!0){const ot=M.xr.getDepthSensingMesh();ot!==null&&ce(ot,$,-1/0,M.sortObjects)}ce(E,$,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(j,Q),St=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,St&&U.addToRenderList(m,E),this.info.render.frame++,tt===!0&&Z.beginShadows();const L=p.state.shadowsArray;pt.render(L,E,$),tt===!0&&Z.endShadows(),this.info.autoReset===!0&&this.info.reset();const N=m.opaque,I=m.transmissive;if(p.setupLights(),$.isArrayCamera){const ot=$.cameras;if(I.length>0)for(let ct=0,ft=ot.length;ct<ft;ct++){const Et=ot[ct];mn(N,I,E,Et)}St&&U.render(E);for(let ct=0,ft=ot.length;ct<ft;ct++){const Et=ot[ct];Me(m,E,Et,Et.viewport)}}else I.length>0&&mn(N,I,E,$),St&&U.render(E),Me(m,E,$);T!==null&&(C.updateMultisampleRenderTarget(T),C.updateRenderTargetMipmap(T)),E.isScene===!0&&E.onAfterRender(M,E,$),Bt.resetDefaultState(),b=-1,y=null,v.pop(),v.length>0?(p=v[v.length-1],tt===!0&&Z.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function ce(E,$,L,N){if(E.visible===!1)return;if(E.layers.test($.layers)){if(E.isGroup)L=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update($);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Y.intersectsSprite(E)){N&&Tt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(_t);const ct=st.update(E),ft=E.material;ft.visible&&m.push(E,ct,ft,L,Tt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Y.intersectsObject(E))){const ct=st.update(E),ft=E.material;if(N&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Tt.copy(E.boundingSphere.center)):(ct.boundingSphere===null&&ct.computeBoundingSphere(),Tt.copy(ct.boundingSphere.center)),Tt.applyMatrix4(E.matrixWorld).applyMatrix4(_t)),Array.isArray(ft)){const Et=ct.groups;for(let Ot=0,Ht=Et.length;Ot<Ht;Ot++){const It=Et[Ot],Gt=ft[It.materialIndex];Gt&&Gt.visible&&m.push(E,ct,Gt,L,Tt.z,It)}}else ft.visible&&m.push(E,ct,ft,L,Tt.z,null)}}const ot=E.children;for(let ct=0,ft=ot.length;ct<ft;ct++)ce(ot[ct],$,L,N)}function Me(E,$,L,N){const I=E.opaque,ot=E.transmissive,ct=E.transparent;p.setupLightsView(L),tt===!0&&Z.setGlobalState(M.clippingPlanes,L),N&&At.viewport(D.copy(N)),I.length>0&&ye(I,$,L),ot.length>0&&ye(ot,$,L),ct.length>0&&ye(ct,$,L),At.buffers.depth.setTest(!0),At.buffers.depth.setMask(!0),At.buffers.color.setMask(!0),At.setPolygonOffset(!1)}function mn(E,$,L,N){if((L.isScene===!0?L.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[N.id]===void 0&&(p.state.transmissionRenderTarget[N.id]=new yi(1,1,{generateMipmaps:!0,type:Ct.has("EXT_color_buffer_half_float")||Ct.has("EXT_color_buffer_float")?As:On,minFilter:_i,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ee.workingColorSpace}));const ot=p.state.transmissionRenderTarget[N.id],ct=N.viewport||D;ot.setSize(ct.z,ct.w);const ft=M.getRenderTarget();M.setRenderTarget(ot),M.getClearColor(W),P=M.getClearAlpha(),P<1&&M.setClearColor(16777215,.5),M.clear(),St&&U.render(L);const Et=M.toneMapping;M.toneMapping=Jn;const Ot=N.viewport;if(N.viewport!==void 0&&(N.viewport=void 0),p.setupLightsView(N),tt===!0&&Z.setGlobalState(M.clippingPlanes,N),ye(E,L,N),C.updateMultisampleRenderTarget(ot),C.updateRenderTargetMipmap(ot),Ct.has("WEBGL_multisampled_render_to_texture")===!1){let Ht=!1;for(let It=0,Gt=$.length;It<Gt;It++){const qt=$[It],Jt=qt.object,_e=qt.geometry,Kt=qt.material,Nt=qt.group;if(Kt.side===Fe&&Jt.layers.test(N.layers)){const on=Kt.side;Kt.side=He,Kt.needsUpdate=!0,nn(Jt,L,N,_e,Kt,Nt),Kt.side=on,Kt.needsUpdate=!0,Ht=!0}}Ht===!0&&(C.updateMultisampleRenderTarget(ot),C.updateRenderTargetMipmap(ot))}M.setRenderTarget(ft),M.setClearColor(W,P),Ot!==void 0&&(N.viewport=Ot),M.toneMapping=Et}function ye(E,$,L){const N=$.isScene===!0?$.overrideMaterial:null;for(let I=0,ot=E.length;I<ot;I++){const ct=E[I],ft=ct.object,Et=ct.geometry,Ot=N===null?ct.material:N,Ht=ct.group;ft.layers.test(L.layers)&&nn(ft,$,L,Et,Ot,Ht)}}function nn(E,$,L,N,I,ot){E.onBeforeRender(M,$,L,N,I,ot),E.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),I.onBeforeRender(M,$,L,N,E,ot),I.transparent===!0&&I.side===Fe&&I.forceSinglePass===!1?(I.side=He,I.needsUpdate=!0,M.renderBufferDirect(L,$,N,I,E,ot),I.side=Qn,I.needsUpdate=!0,M.renderBufferDirect(L,$,N,I,E,ot),I.side=Fe):M.renderBufferDirect(L,$,N,I,E,ot),E.onAfterRender(M,$,L,N,I,ot)}function ae(E,$,L){$.isScene!==!0&&($=zt);const N=wt.get(E),I=p.state.lights,ot=p.state.shadowsArray,ct=I.state.version,ft=kt.getParameters(E,I.state,ot,$,L),Et=kt.getProgramCacheKey(ft);let Ot=N.programs;N.environment=E.isMeshStandardMaterial?$.environment:null,N.fog=$.fog,N.envMap=(E.isMeshStandardMaterial?V:S).get(E.envMap||N.environment),N.envMapRotation=N.environment!==null&&E.envMap===null?$.environmentRotation:E.envMapRotation,Ot===void 0&&(E.addEventListener("dispose",Ut),Ot=new Map,N.programs=Ot);let Ht=Ot.get(Et);if(Ht!==void 0){if(N.currentProgram===Ht&&N.lightsStateVersion===ct)return an(E,ft),Ht}else ft.uniforms=kt.getUniforms(E),E.onBeforeCompile(ft,M),Ht=kt.acquireProgram(ft,Et),Ot.set(Et,Ht),N.uniforms=ft.uniforms;const It=N.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(It.clippingPlanes=Z.uniform),an(E,ft),N.needsLights=ns(E),N.lightsStateVersion=ct,N.needsLights&&(It.ambientLightColor.value=I.state.ambient,It.lightProbe.value=I.state.probe,It.directionalLights.value=I.state.directional,It.directionalLightShadows.value=I.state.directionalShadow,It.spotLights.value=I.state.spot,It.spotLightShadows.value=I.state.spotShadow,It.rectAreaLights.value=I.state.rectArea,It.ltc_1.value=I.state.rectAreaLTC1,It.ltc_2.value=I.state.rectAreaLTC2,It.pointLights.value=I.state.point,It.pointLightShadows.value=I.state.pointShadow,It.hemisphereLights.value=I.state.hemi,It.directionalShadowMap.value=I.state.directionalShadowMap,It.directionalShadowMatrix.value=I.state.directionalShadowMatrix,It.spotShadowMap.value=I.state.spotShadowMap,It.spotLightMatrix.value=I.state.spotLightMatrix,It.spotLightMap.value=I.state.spotLightMap,It.pointShadowMap.value=I.state.pointShadowMap,It.pointShadowMatrix.value=I.state.pointShadowMatrix),N.currentProgram=Ht,N.uniformsList=null,Ht}function sn(E){if(E.uniformsList===null){const $=E.currentProgram.getUniforms();E.uniformsList=ma.seqWithValue($.seq,E.uniforms)}return E.uniformsList}function an(E,$){const L=wt.get(E);L.outputColorSpace=$.outputColorSpace,L.batching=$.batching,L.batchingColor=$.batchingColor,L.instancing=$.instancing,L.instancingColor=$.instancingColor,L.instancingMorph=$.instancingMorph,L.skinning=$.skinning,L.morphTargets=$.morphTargets,L.morphNormals=$.morphNormals,L.morphColors=$.morphColors,L.morphTargetsCount=$.morphTargetsCount,L.numClippingPlanes=$.numClippingPlanes,L.numIntersection=$.numClipIntersection,L.vertexAlphas=$.vertexAlphas,L.vertexTangents=$.vertexTangents,L.toneMapping=$.toneMapping}function Bn(E,$,L,N,I){$.isScene!==!0&&($=zt),C.resetTextureUnits();const ot=$.fog,ct=N.isMeshStandardMaterial?$.environment:null,ft=T===null?M.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Ji,Et=(N.isMeshStandardMaterial?V:S).get(N.envMap||ct),Ot=N.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,Ht=!!L.attributes.tangent&&(!!N.normalMap||N.anisotropy>0),It=!!L.morphAttributes.position,Gt=!!L.morphAttributes.normal,qt=!!L.morphAttributes.color;let Jt=Jn;N.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(Jt=M.toneMapping);const _e=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,Kt=_e!==void 0?_e.length:0,Nt=wt.get(N),on=p.state.lights;if(tt===!0&&(xt===!0||E!==y)){const ke=E===y&&N.id===b;Z.setState(N,E,ke)}let ne=!1;N.version===Nt.__version?(Nt.needsLights&&Nt.lightsStateVersion!==on.state.version||Nt.outputColorSpace!==ft||I.isBatchedMesh&&Nt.batching===!1||!I.isBatchedMesh&&Nt.batching===!0||I.isBatchedMesh&&Nt.batchingColor===!0&&I.colorTexture===null||I.isBatchedMesh&&Nt.batchingColor===!1&&I.colorTexture!==null||I.isInstancedMesh&&Nt.instancing===!1||!I.isInstancedMesh&&Nt.instancing===!0||I.isSkinnedMesh&&Nt.skinning===!1||!I.isSkinnedMesh&&Nt.skinning===!0||I.isInstancedMesh&&Nt.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&Nt.instancingColor===!1&&I.instanceColor!==null||I.isInstancedMesh&&Nt.instancingMorph===!0&&I.morphTexture===null||I.isInstancedMesh&&Nt.instancingMorph===!1&&I.morphTexture!==null||Nt.envMap!==Et||N.fog===!0&&Nt.fog!==ot||Nt.numClippingPlanes!==void 0&&(Nt.numClippingPlanes!==Z.numPlanes||Nt.numIntersection!==Z.numIntersection)||Nt.vertexAlphas!==Ot||Nt.vertexTangents!==Ht||Nt.morphTargets!==It||Nt.morphNormals!==Gt||Nt.morphColors!==qt||Nt.toneMapping!==Jt||Nt.morphTargetsCount!==Kt)&&(ne=!0):(ne=!0,Nt.__version=N.version);let Xe=Nt.currentProgram;ne===!0&&(Xe=ae(N,$,I));let Hn=!1,Ie=!1,ei=!1;const le=Xe.getUniforms(),Ye=Nt.uniforms;if(At.useProgram(Xe.program)&&(Hn=!0,Ie=!0,ei=!0),N.id!==b&&(b=N.id,Ie=!0),Hn||y!==E){At.buffers.depth.getReversed()?(J.copy(E.projectionMatrix),Kp(J),Jp(J),le.setValue(O,"projectionMatrix",J)):le.setValue(O,"projectionMatrix",E.projectionMatrix),le.setValue(O,"viewMatrix",E.matrixWorldInverse);const gn=le.map.cameraPosition;gn!==void 0&&gn.setValue(O,Pt.setFromMatrixPosition(E.matrixWorld)),Dt.logarithmicDepthBuffer&&le.setValue(O,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(N.isMeshPhongMaterial||N.isMeshToonMaterial||N.isMeshLambertMaterial||N.isMeshBasicMaterial||N.isMeshStandardMaterial||N.isShaderMaterial)&&le.setValue(O,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,Ie=!0,ei=!0)}if(I.isSkinnedMesh){le.setOptional(O,I,"bindMatrix"),le.setOptional(O,I,"bindMatrixInverse");const ke=I.skeleton;ke&&(ke.boneTexture===null&&ke.computeBoneTexture(),le.setValue(O,"boneTexture",ke.boneTexture,C))}I.isBatchedMesh&&(le.setOptional(O,I,"batchingTexture"),le.setValue(O,"batchingTexture",I._matricesTexture,C),le.setOptional(O,I,"batchingIdTexture"),le.setValue(O,"batchingIdTexture",I._indirectTexture,C),le.setOptional(O,I,"batchingColorTexture"),I._colorsTexture!==null&&le.setValue(O,"batchingColorTexture",I._colorsTexture,C));const Gn=L.morphAttributes;if((Gn.position!==void 0||Gn.normal!==void 0||Gn.color!==void 0)&&et.update(I,L,Xe),(Ie||Nt.receiveShadow!==I.receiveShadow)&&(Nt.receiveShadow=I.receiveShadow,le.setValue(O,"receiveShadow",I.receiveShadow)),N.isMeshGouraudMaterial&&N.envMap!==null&&(Ye.envMap.value=Et,Ye.flipEnvMap.value=Et.isCubeTexture&&Et.isRenderTargetTexture===!1?-1:1),N.isMeshStandardMaterial&&N.envMap===null&&$.environment!==null&&(Ye.envMapIntensity.value=$.environmentIntensity),Ie&&(le.setValue(O,"toneMappingExposure",M.toneMappingExposure),Nt.needsLights&&Si(Ye,ei),ot&&N.fog===!0&&nt.refreshFogUniforms(Ye,ot),nt.refreshMaterialUniforms(Ye,N,H,X,p.state.transmissionRenderTarget[E.id]),ma.upload(O,sn(Nt),Ye,C)),N.isShaderMaterial&&N.uniformsNeedUpdate===!0&&(ma.upload(O,sn(Nt),Ye,C),N.uniformsNeedUpdate=!1),N.isSpriteMaterial&&le.setValue(O,"center",I.center),le.setValue(O,"modelViewMatrix",I.modelViewMatrix),le.setValue(O,"normalMatrix",I.normalMatrix),le.setValue(O,"modelMatrix",I.matrixWorld),N.isShaderMaterial||N.isRawShaderMaterial){const ke=N.uniformsGroups;for(let gn=0,_n=ke.length;gn<_n;gn++){const is=ke[gn];F.update(is,Xe),F.bind(is,Xe)}}return Xe}function Si(E,$){E.ambientLightColor.needsUpdate=$,E.lightProbe.needsUpdate=$,E.directionalLights.needsUpdate=$,E.directionalLightShadows.needsUpdate=$,E.pointLights.needsUpdate=$,E.pointLightShadows.needsUpdate=$,E.spotLights.needsUpdate=$,E.spotLightShadows.needsUpdate=$,E.rectAreaLights.needsUpdate=$,E.hemisphereLights.needsUpdate=$}function ns(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(E,$,L){wt.get(E.texture).__webglTexture=$,wt.get(E.depthTexture).__webglTexture=L;const N=wt.get(E);N.__hasExternalTextures=!0,N.__autoAllocateDepthBuffer=L===void 0,N.__autoAllocateDepthBuffer||Ct.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),N.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,$){const L=wt.get(E);L.__webglFramebuffer=$,L.__useDefaultFramebuffer=$===void 0},this.setRenderTarget=function(E,$=0,L=0){T=E,R=$,A=L;let N=!0,I=null,ot=!1,ct=!1;if(E){const Et=wt.get(E);if(Et.__useDefaultFramebuffer!==void 0)At.bindFramebuffer(O.FRAMEBUFFER,null),N=!1;else if(Et.__webglFramebuffer===void 0)C.setupRenderTarget(E);else if(Et.__hasExternalTextures)C.rebindTextures(E,wt.get(E.texture).__webglTexture,wt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const It=E.depthTexture;if(Et.__boundDepthTexture!==It){if(It!==null&&wt.has(It)&&(E.width!==It.image.width||E.height!==It.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(E)}}const Ot=E.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(ct=!0);const Ht=wt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ht[$])?I=Ht[$][L]:I=Ht[$],ot=!0):E.samples>0&&C.useMultisampledRTT(E)===!1?I=wt.get(E).__webglMultisampledFramebuffer:Array.isArray(Ht)?I=Ht[L]:I=Ht,D.copy(E.viewport),G.copy(E.scissor),z=E.scissorTest}else D.copy(ht).multiplyScalar(H).floor(),G.copy(mt).multiplyScalar(H).floor(),z=Mt;if(At.bindFramebuffer(O.FRAMEBUFFER,I)&&N&&At.drawBuffers(E,I),At.viewport(D),At.scissor(G),At.setScissorTest(z),ot){const Et=wt.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+$,Et.__webglTexture,L)}else if(ct){const Et=wt.get(E.texture),Ot=$||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Et.__webglTexture,L||0,Ot)}b=-1},this.readRenderTargetPixels=function(E,$,L,N,I,ot,ct){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ft=wt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ct!==void 0&&(ft=ft[ct]),ft){At.bindFramebuffer(O.FRAMEBUFFER,ft);try{const Et=E.texture,Ot=Et.format,Ht=Et.type;if(!Dt.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Dt.textureTypeReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=E.width-N&&L>=0&&L<=E.height-I&&O.readPixels($,L,N,I,Ft.convert(Ot),Ft.convert(Ht),ot)}finally{const Et=T!==null?wt.get(T).__webglFramebuffer:null;At.bindFramebuffer(O.FRAMEBUFFER,Et)}}},this.readRenderTargetPixelsAsync=async function(E,$,L,N,I,ot,ct){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ft=wt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ct!==void 0&&(ft=ft[ct]),ft){const Et=E.texture,Ot=Et.format,Ht=Et.type;if(!Dt.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Dt.textureTypeReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if($>=0&&$<=E.width-N&&L>=0&&L<=E.height-I){At.bindFramebuffer(O.FRAMEBUFFER,ft);const It=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,It),O.bufferData(O.PIXEL_PACK_BUFFER,ot.byteLength,O.STREAM_READ),O.readPixels($,L,N,I,Ft.convert(Ot),Ft.convert(Ht),0);const Gt=T!==null?wt.get(T).__webglFramebuffer:null;At.bindFramebuffer(O.FRAMEBUFFER,Gt);const qt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await jp(O,qt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,It),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,ot),O.deleteBuffer(It),O.deleteSync(qt),ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,$=null,L=0){E.isTexture!==!0&&(gs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),$=arguments[0]||null,E=arguments[1]);const N=Math.pow(2,-L),I=Math.floor(E.image.width*N),ot=Math.floor(E.image.height*N),ct=$!==null?$.x:0,ft=$!==null?$.y:0;C.setTexture2D(E,0),O.copyTexSubImage2D(O.TEXTURE_2D,L,0,0,ct,ft,I,ot),At.unbindTexture()},this.copyTextureToTexture=function(E,$,L=null,N=null,I=0){E.isTexture!==!0&&(gs("WebGLRenderer: copyTextureToTexture function signature has changed."),N=arguments[0]||null,E=arguments[1],$=arguments[2],I=arguments[3]||0,L=null);let ot,ct,ft,Et,Ot,Ht,It,Gt,qt;const Jt=E.isCompressedTexture?E.mipmaps[I]:E.image;L!==null?(ot=L.max.x-L.min.x,ct=L.max.y-L.min.y,ft=L.isBox3?L.max.z-L.min.z:1,Et=L.min.x,Ot=L.min.y,Ht=L.isBox3?L.min.z:0):(ot=Jt.width,ct=Jt.height,ft=Jt.depth||1,Et=0,Ot=0,Ht=0),N!==null?(It=N.x,Gt=N.y,qt=N.z):(It=0,Gt=0,qt=0);const _e=Ft.convert($.format),Kt=Ft.convert($.type);let Nt;$.isData3DTexture?(C.setTexture3D($,0),Nt=O.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(C.setTexture2DArray($,0),Nt=O.TEXTURE_2D_ARRAY):(C.setTexture2D($,0),Nt=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,$.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,$.unpackAlignment);const on=O.getParameter(O.UNPACK_ROW_LENGTH),ne=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Xe=O.getParameter(O.UNPACK_SKIP_PIXELS),Hn=O.getParameter(O.UNPACK_SKIP_ROWS),Ie=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,Jt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Jt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Et),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ot),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Ht);const ei=E.isDataArrayTexture||E.isData3DTexture,le=$.isDataArrayTexture||$.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const Ye=wt.get(E),Gn=wt.get($),ke=wt.get(Ye.__renderTarget),gn=wt.get(Gn.__renderTarget);At.bindFramebuffer(O.READ_FRAMEBUFFER,ke.__webglFramebuffer),At.bindFramebuffer(O.DRAW_FRAMEBUFFER,gn.__webglFramebuffer);for(let _n=0;_n<ft;_n++)ei&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,wt.get(E).__webglTexture,I,Ht+_n),E.isDepthTexture?(le&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,wt.get($).__webglTexture,I,qt+_n),O.blitFramebuffer(Et,Ot,ot,ct,It,Gt,ot,ct,O.DEPTH_BUFFER_BIT,O.NEAREST)):le?O.copyTexSubImage3D(Nt,I,It,Gt,qt+_n,Et,Ot,ot,ct):O.copyTexSubImage2D(Nt,I,It,Gt,qt+_n,Et,Ot,ot,ct);At.bindFramebuffer(O.READ_FRAMEBUFFER,null),At.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else le?E.isDataTexture||E.isData3DTexture?O.texSubImage3D(Nt,I,It,Gt,qt,ot,ct,ft,_e,Kt,Jt.data):$.isCompressedArrayTexture?O.compressedTexSubImage3D(Nt,I,It,Gt,qt,ot,ct,ft,_e,Jt.data):O.texSubImage3D(Nt,I,It,Gt,qt,ot,ct,ft,_e,Kt,Jt):E.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,I,It,Gt,ot,ct,_e,Kt,Jt.data):E.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,I,It,Gt,Jt.width,Jt.height,_e,Jt.data):O.texSubImage2D(O.TEXTURE_2D,I,It,Gt,ot,ct,_e,Kt,Jt);O.pixelStorei(O.UNPACK_ROW_LENGTH,on),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ne),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Xe),O.pixelStorei(O.UNPACK_SKIP_ROWS,Hn),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Ie),I===0&&$.generateMipmaps&&O.generateMipmap(Nt),At.unbindTexture()},this.copyTextureToTexture3D=function(E,$,L=null,N=null,I=0){return E.isTexture!==!0&&(gs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),L=arguments[0]||null,N=arguments[1]||null,E=arguments[2],$=arguments[3],I=arguments[4]||0),gs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,$,L,N,I)},this.initRenderTarget=function(E){wt.get(E).__webglFramebuffer===void 0&&C.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?C.setTextureCube(E,0):E.isData3DTexture?C.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?C.setTexture2DArray(E,0):C.setTexture2D(E,0),At.unbindTexture()},this.resetState=function(){R=0,A=0,T=null,At.reset(),Bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Nn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ee._getDrawingBufferColorSpace(t),e.unpackColorSpace=ee._getUnpackColorSpace()}}class cv extends ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new En,this.environmentIntensity=1,this.environmentRotation=new En,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class dc extends ts{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Wt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ca=new q,Pa=new q,$l=new fe,ps=new oc,na=new ka,Lo=new q,Yl=new q;class lv extends ve{constructor(t=new Ve,e=new dc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,a=e.count;s<a;s++)Ca.fromBufferAttribute(e,s-1),Pa.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=Ca.distanceTo(Pa);t.setAttribute("lineDistance",new ge(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),na.copy(i.boundingSphere),na.applyMatrix4(s),na.radius+=a,t.ray.intersectsSphere(na)===!1)return;$l.copy(s).invert(),ps.copy(t.ray).applyMatrix4($l);const r=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const u=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=u,m=g-1;_<m;_+=l){const p=d.getX(_),x=d.getX(_+1),v=ia(this,t,ps,c,p,x);v&&e.push(v)}if(this.isLineLoop){const _=d.getX(g-1),m=d.getX(u),p=ia(this,t,ps,c,_,m);p&&e.push(p)}}else{const u=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=u,m=g-1;_<m;_+=l){const p=ia(this,t,ps,c,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=ia(this,t,ps,c,g-1,u);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}}function ia(n,t,e,i,s,a){const o=n.geometry.attributes.position;if(Ca.fromBufferAttribute(o,s),Pa.fromBufferAttribute(o,a),e.distanceSqToSegment(Ca,Pa,Lo,Yl)>i)return;Lo.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Lo);if(!(c<t.near||c>t.far))return{distance:c,point:Yl.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}const Zl=new q,ql=new q;class Kd extends lv{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,a=e.count;s<a;s+=2)Zl.fromBufferAttribute(e,s),ql.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Zl.distanceTo(ql);t.setAttribute("lineDistance",new ge(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class hc extends Ve{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const a=[],o=[];r(s),l(i),d(),this.setAttribute("position",new ge(a,3)),this.setAttribute("normal",new ge(a.slice(),3)),this.setAttribute("uv",new ge(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(x){const v=new q,M=new q,k=new q;for(let R=0;R<e.length;R+=3)u(e[R+0],v),u(e[R+1],M),u(e[R+2],k),c(v,M,k,x)}function c(x,v,M,k){const R=k+1,A=[];for(let T=0;T<=R;T++){A[T]=[];const b=x.clone().lerp(M,T/R),y=v.clone().lerp(M,T/R),D=R-T;for(let G=0;G<=D;G++)G===0&&T===R?A[T][G]=b:A[T][G]=b.clone().lerp(y,G/D)}for(let T=0;T<R;T++)for(let b=0;b<2*(R-T)-1;b++){const y=Math.floor(b/2);b%2===0?(h(A[T][y+1]),h(A[T+1][y]),h(A[T][y])):(h(A[T][y+1]),h(A[T+1][y+1]),h(A[T+1][y]))}}function l(x){const v=new q;for(let M=0;M<a.length;M+=3)v.x=a[M+0],v.y=a[M+1],v.z=a[M+2],v.normalize().multiplyScalar(x),a[M+0]=v.x,a[M+1]=v.y,a[M+2]=v.z}function d(){const x=new q;for(let v=0;v<a.length;v+=3){x.x=a[v+0],x.y=a[v+1],x.z=a[v+2];const M=m(x)/2/Math.PI+.5,k=p(x)/Math.PI+.5;o.push(M,1-k)}g(),f()}function f(){for(let x=0;x<o.length;x+=6){const v=o[x+0],M=o[x+2],k=o[x+4],R=Math.max(v,M,k),A=Math.min(v,M,k);R>.9&&A<.1&&(v<.2&&(o[x+0]+=1),M<.2&&(o[x+2]+=1),k<.2&&(o[x+4]+=1))}}function h(x){a.push(x.x,x.y,x.z)}function u(x,v){const M=x*3;v.x=t[M+0],v.y=t[M+1],v.z=t[M+2]}function g(){const x=new q,v=new q,M=new q,k=new q,R=new te,A=new te,T=new te;for(let b=0,y=0;b<a.length;b+=9,y+=6){x.set(a[b+0],a[b+1],a[b+2]),v.set(a[b+3],a[b+4],a[b+5]),M.set(a[b+6],a[b+7],a[b+8]),R.set(o[y+0],o[y+1]),A.set(o[y+2],o[y+3]),T.set(o[y+4],o[y+5]),k.copy(x).add(v).add(M).divideScalar(3);const D=m(k);_(R,y+0,x,D),_(A,y+2,v,D),_(T,y+4,M,D)}}function _(x,v,M,k){k<0&&x.x===1&&(o[v]=x.x-1),M.x===0&&M.z===0&&(o[v]=k/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hc(t.vertices,t.indices,t.radius,t.details)}}const sa=new q,aa=new q,Io=new q,oa=new tn;class dv extends Ve{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(pa*e),o=t.getIndex(),r=t.getAttribute("position"),c=o?o.count:r.count,l=[0,0,0],d=["a","b","c"],f=new Array(3),h={},u=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:p}=oa;if(_.fromBufferAttribute(r,l[0]),m.fromBufferAttribute(r,l[1]),p.fromBufferAttribute(r,l[2]),oa.getNormal(Io),f[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,f[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,f[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const v=(x+1)%3,M=f[x],k=f[v],R=oa[d[x]],A=oa[d[v]],T=`${M}_${k}`,b=`${k}_${M}`;b in h&&h[b]?(Io.dot(h[b].normal)<=a&&(u.push(R.x,R.y,R.z),u.push(A.x,A.y,A.z)),h[b]=null):T in h||(h[T]={index0:l[x],index1:l[v],normal:Io.clone()})}}for(const g in h)if(h[g]){const{index0:_,index1:m}=h[g];sa.fromBufferAttribute(r,_),aa.fromBufferAttribute(r,m),u.push(sa.x,sa.y,sa.z),u.push(aa.x,aa.y,aa.z)}this.setAttribute("position",new ge(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class uc extends hc{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new uc(t.radius,t.detail)}}class vs extends Ve{constructor(t=.5,e=1,i=32,s=1,a=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);const r=[],c=[],l=[],d=[];let f=t;const h=(e-t)/s,u=new q,g=new te;for(let _=0;_<=s;_++){for(let m=0;m<=i;m++){const p=a+m/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),c.push(u.x,u.y,u.z),l.push(0,0,1),g.x=(u.x/e+1)/2,g.y=(u.y/e+1)/2,d.push(g.x,g.y)}f+=h}for(let _=0;_<s;_++){const m=_*(i+1);for(let p=0;p<i;p++){const x=p+m,v=x,M=x+i+1,k=x+i+2,R=x+1;r.push(v,M,R),r.push(M,k,R)}}this.setIndex(r),this.setAttribute("position",new ge(c,3)),this.setAttribute("normal",new ge(l,3)),this.setAttribute("uv",new ge(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Na extends Ve{constructor(t=1,e=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const o=[],r=[],c=[],l=[],d=new q,f=new q,h=new q;for(let u=0;u<=i;u++)for(let g=0;g<=s;g++){const _=g/s*a,m=u/i*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(_),f.y=(t+e*Math.cos(m))*Math.sin(_),f.z=e*Math.sin(m),r.push(f.x,f.y,f.z),d.x=t*Math.cos(_),d.y=t*Math.sin(_),h.subVectors(f,d).normalize(),c.push(h.x,h.y,h.z),l.push(g/s),l.push(u/i)}for(let u=1;u<=i;u++)for(let g=1;g<=s;g++){const _=(s+1)*u+g-1,m=(s+1)*(u-1)+g-1,p=(s+1)*(u-1)+g,x=(s+1)*u+g;o.push(_,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new ge(r,3)),this.setAttribute("normal",new ge(c,3)),this.setAttribute("uv",new ge(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Na(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ts extends ts{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Id,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=Qr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Jd extends ve{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Wt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class hv extends Jd{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Wt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ko=new fe,jl=new q,Kl=new q;class uv{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new te(512,512),this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cc,this._frameExtents=new te(1,1),this._viewportCount=1,this._viewports=[new me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;jl.setFromMatrixPosition(t.matrixWorld),e.position.copy(jl),Kl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Kl),e.updateMatrixWorld(),ko.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ko),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ko)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class fv extends uv{constructor(){super(new Wd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class pv extends Jd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.target=new ve,this.shadow=new fv}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Jl=new fe;class mv{constructor(t,e,i=0,s=1/0){this.ray=new oc(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new rc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Jl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Jl),this}intersectObject(t,e=!0,i=[]){return Hr(t,this,i,e),i.sort(Ql),i}intersectObjects(t,e=!0,i=[]){for(let s=0,a=t.length;s<a;s++)Hr(t[s],this,i,e);return i.sort(Ql),i}}function Ql(n,t){return n.distance-t.distance}function Hr(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let o=0,r=a.length;o<r;o++)Hr(a[o],t,e,!0)}}class gv extends Kd{constructor(t=10,e=10,i=4473924,s=8947848){i=new Wt(i),s=new Wt(s);const a=e/2,o=t/e,r=t/2,c=[],l=[];for(let h=0,u=0,g=-r;h<=e;h++,g+=o){c.push(-r,0,g,r,0,g),c.push(g,0,-r,g,0,r);const _=h===a?i:s;_.toArray(l,u),u+=3,_.toArray(l,u),u+=3,_.toArray(l,u),u+=3,_.toArray(l,u),u+=3}const d=new Ve;d.setAttribute("position",new ge(c,3)),d.setAttribute("color",new ge(l,3));const f=new dc({vertexColors:!0,toneMapped:!1});super(d,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Jr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Jr);const _v={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function xv(n,t,e,i){const s=new Ke(n.fov,i,.1,200),a=new q,o=new q,r=new q;let c=!1,l=n.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function h(){const u=(n.pitchDeg+d.pitchDelta)*Math.PI/180,g=n.yawDeg*Math.PI/180;r.set(Math.sin(g)*Math.cos(u),Math.sin(u),Math.cos(g)*Math.cos(u)).multiplyScalar(n.distance*d.distanceScale*d.zoom)}return h(),{camera:s,update(u,g,_,m,p=_v){const x=g+.6;if(!c)a.set(u,x,_),c=!0;else{const k=1-Math.exp(-Math.max(n.smoothing,.001)*m);a.x+=(u-a.x)*k,a.y+=(x-a.y)*k,a.z+=(_-a.z)*k}const v=1-Math.exp(-Math.max(t.smoothing,.001)*m);d.distanceScale+=(p.distanceScale-d.distanceScale)*v,d.offsetX+=(p.offsetX-d.offsetX)*v,d.offsetZ+=(p.offsetZ-d.offsetZ)*v,d.pitchDelta+=(p.pitchDelta-d.pitchDelta)*v;const M=1-Math.exp(-Math.max(e.smoothing,.001)*m);d.zoom+=(f-d.zoom)*M,h(),(s.fov!==l||s.fov!==n.fov)&&(s.fov=n.fov,l=n.fov,s.updateProjectionMatrix()),o.set(a.x+d.offsetX,a.y,a.z+d.offsetZ),s.position.copy(o).add(r),s.lookAt(o),s.updateMatrixWorld()},resize(u){s.aspect=u,s.updateProjectionMatrix()},getGroundBasis(){const u=new q().setFromMatrixColumn(s.matrixWorld,0),g=new q().setFromMatrixColumn(s.matrixWorld,2).negate(),_=Math.hypot(u.x,u.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:u.x/_,rightZ:u.z/_,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...d}}}}const xi=Math.PI*2,un=1e-6;function An(n,t,e){return n<t?t:n>e?e:n}function Qd(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function vv(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function th(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const s=vv(n);return i===1?s:e+(s-e)*i}function td(n){return(1-Math.sin(n))/2}function fc(n,t){if(!n.grounded||n.speed<un)return Qd();const e=n.speed/Math.max(n.moveSpeed,un),i=Math.max(n.legLength,un),s=n.stride>un?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,a=Math.min(t.maxAmp,s/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),c=Math.abs(n.localRight),l=r+c+un,d=r/l,f=c/l,h=n.localForward>=0?1:-1,u=n.localRight>=0?1:-1,g=s,_=z=>Math.asin(An(z,-o,o)/i);function m(z,W){const P=th(z,t.plantLock),w=td(z),X=h*d*g*P,H=-_(X),j=W*u>0?1:-1,Q=1+j*t.crossStep*.45,ht=u*j*t.crossStep*g*.4*w,mt=u*f*g*t.sideWeight*Q*P+ht*f,Mt=_(mt),Y=t.kneeLift*w*a*(.55+.25*d+(j>0?.2*f:0));return{pitchX:H,rollZ:Mt,kneeX:Y}}const p=(n.phase%xi+xi)%xi,x=m(p,-1),v=m((p+Math.PI)%xi,1),M=Math.cos(p),k=td(p),R=-t.comSway*a*M*(.6*d+.8*f)-u*t.comSway*a*f*.45,A=t.comBob*k*a,T=u*t.hipLean*a*f*M*.6,b=u*t.hipLean*a*f*(.45+.25*M),y=t.armSwing*a*M*(d*h+.3*f),D=y,G=-y;return{legL:x,legR:v,pelvisX:R,pelvisY:A,pelvisRoll:T,sideLean:b,armL:D,armR:G,strafe:f,backward:h<0?d:0}}function eh(n){const t=(n%xi+xi)%xi,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function nh(n,t,e){const i=An(e.progress,0,1);if(i>=1||n.speed<un)return Qd();const s=i*i*(3-2*i),a=1-s;return fc({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:n.speed*a,stride:n.stride*a},t)}function ih(n,t,e,i){const s=An(n,-1,1),a=Math.abs(s),o=Math.min(1,t*(1+Math.max(0,i)*a*a));return An(o*s,-1,1)*(e*Math.PI/180)}function sh(n,t,e,i,s){const a=Math.max(e,un),o=Math.max(0,i)*a,r=Math.max(0,s)*a,c=t>un?(t-n)/t:0,l=c>.02,d=c<-.015,f=n<=o*.15,h=!d&&n<r&&(l||f);return{enter:n>un&&n<=o&&l,resume:!h}}function ah(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return An(n*An(t,0,2),-i,i)}function oh(n,t,e){const i=Math.sin(n),s=Math.cos(n),a=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*s,right:t*a+e*o}}function rh(n,t,e){const i=An(n,0,1),s=i*i*(3-2*i);return e?t==="inStop"?1-s:1:t==="afterStop"?1-s:0}function Mv(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const s=An(n,0,1),a=Math.sin(Math.PI*s),o=a*a;if(o<=1e-9)return i();const r=t>=0,c=r?1:.35,l=r?.35:1,d=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,h=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-d*c,rollZ:u*h*c,kneeX:f*c},legR:{pitchX:-d*l,rollZ:-u*h*l,kneeX:f*l},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function ch(n,t,e,i,s){const a=An(n,0,1),o=An(s.stopPeakRatio,.05,.95),r=a<=o?a/o:(a-o)/(1-o),c=r*r*(3-2*r),l=a<=o?c:1-c,d=Math.hypot(e,i),f=d>un?e/d:1,h=d>un?i/d:0,u=th(t,1)>0;return{leadPitch:Math.max(0,s.stopStepPitch)*l,trailPitch:Math.max(0,s.stopTrailPitch)*l,leadKnee:Math.max(0,s.stopStepKnee)*l,bodyShift:Math.max(0,s.stopBodyShift)*l,bodyDip:Math.max(0,s.stopBodyDip)*l,chestPitch:Math.max(0,s.stopChestPitch)*l,leadLeft:u,fwdN:f,rightN:h,env:l}}function Ne(n){return n<0?0:n>1?1:n}const ga=Math.PI*2;function yv(n){return((n+Math.PI)%ga+ga)%ga-Math.PI}function Sv(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function bv(n,t,e,i,s,a=n.phase){const o=Ne(i);if(o<=0)return n;const r=Ne(t),c=Math.max(1,Math.round(s.cycles)),l=Math.max(0,s.strideSpeed),d=e%2===0?1:-1,f=Ne(s.forwardBias),h=Math.max(0,n.stride??0),u=Math.max(0,s.strideScale??0)*h,g=r<=.5?r*2:(r-.5)*2,_=g*g*(3-2*g),m=r<=.5?_:1-_,p={speed:l,phase:a+ga*c/2*m,localForward:l*f,localRight:l*(1-f)*d},x=yv(p.phase-n.phase),v=o*o*(3-2*o),M=n.speed>.05?h:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+x*v,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:M+(u-M)*o*o}}function Ev(n,t,e){const i=Sv(),s=Ne(n),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,c=o>0,l=e.stepPitch*a,d=e.stepKnee*a,f=e.stepSide*a;return i.legL.pitchX=r?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=r?d:d*.4,i.legR.kneeX=c?d:d*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*a*o,i.pelvisY=-e.stepDip*a,i.pelvisRoll=f*.25*o,i}function lh(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function ed(n,t,e,i,s){if(e<=0||i<=0)return 0;const a=(n-t)/e;return a<0||a>=1?0:i*lh(a,s)}function Tv(n,t,e,i){const s=t?1:0,a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(s-n)*a;return t&&o>.999?1:!t&&o<.001?0:o}function Av(n,t,e){const i=Ne(n);return{gaitScale:1-i*(1-Ne(t)),attackLegWeight:Ne(e)*i}}function wv(n,t){const e=Ne(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function Rv(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Ne(t.minScale+(1-t.minScale)*e)}function Cv(){return dh()}function dh(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function Pv(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function Dv(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Ne(t.forceHitHeight):n.type==="light"?Ne(t.hitHeight.light):n.type==="heavy"?Ne(t.hitHeight.heavy):n.type==="knock"?Ne(t.hitHeight.knock):0}function Lv(n,t,e){const i=Ne(e),s=(a,o)=>a+(o-a)*i;return{upperPitch:s(n.upperPitch,t.upperPitch),upperRoll:s(n.upperRoll,t.upperRoll),upperYaw:s(n.upperYaw,t.upperYaw),fold:s(n.fold,t.fold),shift:s(n.shift,t.shift),drop:s(n.drop,t.drop),back:s(n.back,t.back),knee:s(n.knee,t.knee),hip:s(n.hip,t.hip),arm:s(n.arm,t.arm)}}function hh(n,t,e){const i=dh(),s=Pv(n,e);if(i.intensity=s,s<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const a=Ne(1-n.timer/n.duration),o=lh(a,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=Dv(n,e);const r=Math.sin(t),c=Math.cos(t),l=Math.cos(t),d=-Math.sin(t),f=n.dirX*r+n.dirZ*c,h=n.dirX*l+n.dirZ*d;if(i.localFwd=f,i.localRight=h,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*a);return i.upperPitch=s*_*f,i.upperRoll=-s*_*h*.7,i.drop=(s>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const u=s*o,g=Lv(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(g.upperPitch*f+g.fold),i.upperRoll=-u*g.upperRoll*h,i.upperYaw=u*g.upperYaw*h,i.upperShift=u*g.shift,i.upperShiftX=i.upperShift*h,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*h,i.comZ=i.comShift*f,i.pelvisBack=u*g.back,i.drop=u*g.drop,i.knee=u*g.knee,i.hip=u*g.hip,i.arm=u*g.arm,i.flash=e.flashStrength*o,i}function uh(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),s=Number.isFinite(n.leanForward)?n.leanForward:0,a=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*i,pelvisZ:s*i,crouch:Math.max(0,t.moveCrouch)*o}}const di=1e-6;function Ms(n,t,e){return n<t?t:n>e?e:n}function Iv(n,t,e,i=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=di||a<=di||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=s+a,c=Math.abs(s-a)+di,l=Math.hypot(n.x,n.y,n.z);if(l<=di)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),h=n.z,u=Math.hypot(h,f),g=Ms(u,c,r),_=u>r+di||u<c-di,m=Math.atan2(-h,Math.max(f,di)),p=Ms((s*s+g*g-a*a)/(2*s*g),-1,1),x=Ms((a*a+g*g-s*s)/(2*a*g),-1,1),v=Math.acos(p),M=Math.acos(x),k=i>=0?1:-1;return{rootPitch:m-k*v,rootRoll:d,jointPitch:k*(v+M),clamped:_,reach:l/r}}function kv(n,t,e,i){const s=Ms(e,0,1),a=Math.max(0,i),o=(r,c)=>{const l=Ms((c-r)*s,-a,a);return r+l};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function fh(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const pc={active:!1,weight:0,clamped:0,maxError:0};function ph(n){const{root:t,pelvis:e,lower:i,limbs:s,base:a,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||s.length===0)return{...pc};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,i.position.copy(a.lowerPos),i.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(u=>u.tip.getWorldPosition(new q));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),d=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<s.length;u++){const g=s[u],_=i.worldToLocal(c[u].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},p=Iv(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(f+=1);const x=kv({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,l,d);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let h=0;for(let u=0;u<s.length;u++){const g=s[u].tip.getWorldPosition(new q);h=Math.max(h,g.distanceTo(c[u]))}return{active:!0,weight:l,clamped:f,maxError:h}}function qe(n,t,e){return n<t?t:n>e?e:n}function Uv(n,t,e,i,s,a,o,r,c,l){const d=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Ae,h=new Ae;h.name="pelvis",h.position.y=n.legLength,f.add(h);const u=new Ae;u.name="lower";const g=new Ae;g.name="upper",h.add(u),h.add(g);const _=[],m=(nt,B,gt,Z)=>{const pt=new Ts({color:Z}),U=new he(new Tn(nt,B,gt),pt);return U.castShadow=!0,U.receiveShadow=!0,_.push(pt),U},p=n.headSize,x=n.legLength,v=n.armLength,M=n.limbThickness,k=n.bodyHeight,R=n.bodyWidth,A=m(R,k,.28,e);A.position.y=k/2,g.add(A);const T=new Ae;T.name="headPivot",T.position.y=k,g.add(T);const b=m(p,p,p,e);b.position.y=p/2,T.add(b);for(const nt of[-1,1]){const B=m(.06,.07,.02,t.shoe);B.position.set(nt*.09,p/2+.03,p/2+.011),T.add(B)}const y=(nt,B)=>{const gt=B?v:x,Z=new Ae;Z.name=B?nt<0?"shoulderL":"shoulderR":nt<0?"hipL":"hipR",B||(Z.rotation.order="ZYX"),Z.position.set(nt*(B?R/2+M/2:R/2-M/2),B?k-.04:0,0),(B?g:u).add(Z);const pt=m(M,gt/2,M,t.limb);pt.position.y=-gt/4,Z.add(pt);const U=new Ae;U.name=B?"elbow":"knee",U.position.y=-gt/2,Z.add(U);const et=m(M,gt/2,M,t.limb);if(et.position.y=-gt/4,U.add(et),!B){const dt=m(M*1.15,.07,M*1.7,t.shoe);dt.position.set(0,-gt/2+.035,.045),U.add(dt);const Lt=new ve;return Lt.name="footTip",Lt.position.y=-gt/2,U.add(Lt),{root:Z,joint:U,tip:Lt}}return{root:Z,joint:U}},D=y(-1,!1),G=y(1,!1),z=y(-1,!0),W=y(1,!0),P=[D,G].map(nt=>({root:nt.root,joint:nt.joint,tip:nt.tip,upperLen:x/2,lowerLen:x/2,bend:1})),w=new Mn({color:s.attackArcColor,transparent:!0,opacity:0,side:Fe,depthWrite:!1}),X=new he(new Na(.62,.042,6,20,Math.PI*1.1),w);X.position.set(0,.78-x,.56),g.add(X);const H=new Wt(e),j=new Wt(r.flashColor),Q=new Wt;let ht=null,mt=0,Mt=0,Y=0,tt=0,xt=0,J=0,_t=0,Pt={...pc},Tt=-1,zt=0,St=0,bt=0,O=0,$t=0,Ct=0,Dt=0,At=1,yt=0,wt=0,C="none",S=0,V=!1,lt=-1,rt=!1,st=0,kt=0;return{group:f,update(nt,B){f.position.set(nt.position.x,nt.position.y,nt.position.z),f.rotation.y=nt.bodyYaw,T.rotation.y=(nt.headYaw-nt.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,nt.mode!==ht&&(ht=nt.mode,mt=1),mt=Math.max(0,mt-B*2.2);const gt=nt.hurt,Z=hh(gt,nt.bodyYaw,r),pt=Z.flash;Q.copy(j).multiplyScalar(pt);for(const ct of _)ct.emissive.copy(H).multiplyScalar(mt*.5),pt>0&&ct.emissive.add(Q);h.position.set(0,x,0),h.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const U=Math.hypot(nt.velocity.x,nt.velocity.z),et=qe(o.knockGaitScale??0,0,1),dt=nt.hurt.knockX*et,Lt=nt.hurt.knockZ*et,Ft=et>0&&Math.hypot(nt.hurt.knockX,nt.hurt.knockZ)>.001,Bt=nt.velocity.x+dt,F=nt.velocity.z+Lt,vt=Math.hypot(Bt,F),K=Math.cos(nt.bodyYaw),at=-Math.sin(nt.bodyYaw),it=U>1e-6?qe((nt.velocity.x*K+nt.velocity.z*at)/U,-1,1):0;C==="settled"&&rt&&st>kt*1.02+1e-4&&(C="none");let ut=1;C==="blend"?(ut=rh(V?lt:S,o.stopYawBlendMode,V),V||(S=Math.min(1,S+B/Math.max(.01,o.stopYawAfterSec)),(S>=1||o.stopYawBlendMode==="inStop"||rt)&&(C="settled",ut=0))):C==="settled"&&(ut=qe(U/Math.max(1e-6,o.stopEnterRatio*a),0,1));const Ut=ih(it,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost)*ut;yt+=(Ut-yt)*(1-Math.exp(-12*Math.max(0,B))),u.rotation.y=yt;const Xt=nt.bodyYaw+yt,Zt=Math.sin(Xt),Vt=Math.cos(Xt),oe=Math.cos(Xt),ue=-Math.sin(Xt),Ce=Bt*Zt+F*Vt,we=Bt*oe+F*ue,se=Math.max(0,o.stopBlendSec||0),ce=se>0&&!Ft,Me=sh(U,wt,a,o.stopEnterRatio,o.stopExitRatio);if(!ce||Me.resume)Tt=-1;else if(Tt<0&&Me.enter){Tt=0,zt=nt.gaitPhase,St=eh(nt.gaitPhase),bt=U,O=Math.max(nt.stride,1e-6),$t=Ce,Ct=we;const ct=1/Math.max(1e-6,U);Dt=nt.velocity.x*ct,At=nt.velocity.z*ct}const mn=wt;wt=U;const ye=ce&&Tt>=0;ye&&(Tt=Math.min(1,Tt+B/se)),ye&&C!=="blend"&&(C="blend",S=0),V=ye&&Tt<1,lt=Tt,rt=Me.resume,st=U,kt=mn;const nn=ye?{phase:zt,speed:bt,moveSpeed:a,localForward:$t,localRight:Ct,legLength:n.legLength,stride:O,grounded:!0}:{phase:nt.gaitPhase,speed:vt,moveSpeed:a,localForward:Ce,localRight:we,legLength:n.legLength,stride:nt.stride,grounded:!0},ae=ye?nh(nn,o,{progress:Tt,phase0:zt,phaseEnd:St}):fc(nn,o);let sn=0,an=0,Bn=0,Si=0;if(ye){const ct=oh(nt.bodyYaw,Dt,At),ft=ch(Tt,zt,ct.forward,ct.right,o);ft.leadLeft?(ae.legL.pitchX-=ft.leadPitch,ae.legL.kneeX+=ft.leadKnee,ae.legR.pitchX+=ft.trailPitch):(ae.legR.pitchX-=ft.leadPitch,ae.legR.kneeX+=ft.leadKnee,ae.legL.pitchX+=ft.trailPitch),an=ft.bodyShift*ft.fwdN,sn=ft.bodyShift*ft.rightN,Bn=ft.bodyDip,Si=ft.chestPitch}D.root.rotation.x=ae.legL.pitchX,G.root.rotation.x=ae.legR.pitchX,D.root.rotation.z=ae.legL.rollZ,G.root.rotation.z=ae.legR.rollZ,D.joint.rotation.x=ae.legL.kneeX,G.joint.rotation.x=ae.legR.kneeX,z.root.rotation.x=ae.armL,W.root.rotation.x=ae.armR,z.joint.rotation.x=-.18,W.joint.rotation.x=-.18,h.position.x=ae.pelvisX,h.position.y=x+ae.pelvisY,h.position.z=0,h.rotation.z=ae.pelvisRoll,g.rotation.z=ae.sideLean*(Z.intensity>0?.4:1);const ns=fh(h,u),E=ye&&d.enabled?{...d,weight:1}:d,$=E.enabled&&E.weight>0?qe(E.weight,0,1):0;if(h.position.x+=sn,h.position.z+=an,h.position.y-=Bn,u.position.y+=Bn,$<=0&&(u.position.x-=sn,u.position.z-=an),c){const ct=Math.max(.004166666666666667,Math.min(B,.1)),ft=Math.sin(nt.bodyYaw),Et=Math.cos(nt.bodyYaw),Ot=qe((nt.velocity.x-Mt)/ct,-60,60),Ht=qe((nt.velocity.z-Y)/ct,-60,60),It=Ot*ft+Ht*Et,Gt=Le(nt.bodyYaw-tt)/ct,qt=c.maxForwardDeg*Math.PI/180,Jt=c.maxSideDeg*Math.PI/180,_e=1-Math.exp(-Math.max(0,c.smoothing)*ct);xt+=(qe(It*c.accelGain,-qt,qt)-xt)*_e,J+=(qe(-Gt*U*c.turnGain,-Jt,Jt)-J)*_e;const Kt=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;_t+=(qe(U/Math.max(a,1e-6),0,1)-_t)*(1-Math.exp(-Math.max(0,Kt)*ct));const Nt=uh({leanForward:xt,leanSide:J,speedRatio:_t},c);g.rotation.x+=xt+Si,g.rotation.z+=J,h.rotation.x+=Nt.pelvisPitch,h.rotation.z+=Nt.pelvisRoll,h.position.x+=Nt.pelvisX,h.position.z+=Nt.pelvisZ,h.position.y-=Nt.crouch,u.position.y+=Nt.crouch*(1-$)}Mt=nt.velocity.x,Y=nt.velocity.z,tt=nt.bodyYaw,g.rotation.x+=Z.upperPitch,g.rotation.z+=Z.upperRoll,g.rotation.y+=Z.upperYaw;const L=qe(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),N=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=qe(Z.upperShiftX*L,-N,N),g.position.z+=qe(Z.upperShiftZ*L,-N,N),h.position.x+=Z.comX,h.position.z+=Z.comZ-Z.pelvisBack,h.position.y-=Z.drop;const I=Z.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=Z.pelvisBack*(1-I),u.position.y+=Z.drop*(1-I),D.joint.rotation.x+=Z.knee,G.joint.rotation.x+=Z.knee,D.root.rotation.x-=Z.hip,G.root.rotation.x-=Z.hip,z.root.rotation.x+=Z.arm,W.root.rotation.x+=Z.arm*.8,nt.attackPhase!=="idle"&&Z.intensity===0){const ct=nt.attackProgress,ft=ct<.34?-1:ct<.68?-1+(ct-.34)/.34*2:Math.max(0,1-(ct-.68)/.32),Et=Math.max(0,-ft),Ot=Math.max(0,ft);W.root.rotation.x=-1.7*Et+1.25*Ot,W.joint.rotation.x=-(.25+Et*.45),g.rotation.y=-.28*ft,w.opacity=nt.attackPhase==="active"?.85:0,nt.attackPhase==="active"&&(X.rotation.z=-1.1+ct*3)}else w.opacity=0;const ot=ah(yt,o.chestYawScale,o.chestYawMaxDeg);g.rotation.y+=ot,T.rotation.y=(nt.headYaw-nt.bodyYaw-ot+Math.PI*3)%(Math.PI*2)-Math.PI,Pt=ph({root:f,pelvis:h,lower:u,limbs:P,base:ns,cfg:E,grounded:!0,attacking:nt.attackPhase!=="idle"})},ik(){return Pt},dispose(){f.traverse(nt=>{if(nt instanceof he){nt.geometry.dispose();const B=nt.material;Array.isArray(B)?B.forEach(gt=>gt.dispose()):B.dispose()}})}}}const Fv=64,nd=[0,.24,.76,1],Nv=[0,1,1,0];function id(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function zv(n,t,e,i,s=Fv){const a=Math.max(.001,n-t*.5),o=Math.max(a+.001,n+t*.5),r=nd.length,c=s+1,l=new Float32Array(c*r*3),d=new Float32Array(c*r*4),f=[];for(let u=0;u<c;u++){const g=u/s,_=(g-.5)*e,m=id(g,i)*id(1-g,i),p=Math.sin(_),x=Math.cos(_);for(let v=0;v<r;v++){const M=a+(o-a)*nd[v],k=u*r+v;l[k*3]=p*M,l[k*3+1]=0,l[k*3+2]=x*M;const R=m*Nv[v];d[k*4]=1,d[k*4+1]=1,d[k*4+2]=1,d[k*4+3]=R}}for(let u=0;u<s;u++)for(let g=0;g<r-1;g++){const _=u*r+g,m=_+r;f.push(_,m,_+1,_+1,m,m+1)}const h=new Ve;return h.setAttribute("position",new en(l,3)),h.setAttribute("color",new en(d,4)),h.setIndex(f),h.computeBoundingSphere(),h}function Uo(n){const t=new Mn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Fe,vertexColors:!0,toneMapped:!1}),e=new Map,i=(r,c)=>{const l=`${Math.round(r*1e3)}|${Math.round(c*100)}`,d=e.get(l);if(d)return d;const f=zv(n.radius,n.thickness*c,r,n.edgeFade);return e.set(l,f),f},s=new he(i(n.arcRad,1),t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let a=n.arcRad,o=1;return{mesh:s,update(r,c,l,d,f,h=1){const u=Math.max(.05,h);(Math.abs(r-a)>.01||Math.abs(u-o)>.01)&&(s.geometry=i(r,u),a=r,o=u),t.opacity=c,t.color.copy(d),s.scale.set(l,1,l),s.rotation.y=f,s.visible=c>.002},arcRad(){return a},dispose(){for(const r of e.values())r.dispose();e.clear(),t.dispose()}}}function sd(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function Ov(n,t,e,i,s){const a=s.arcDeg*Math.PI/180,o=s.playerOpacity;if(!n)return{arcRad:a,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),c=Math.min(1,Math.max(0,e)),l=s.selectedArcDeg*Math.PI/180,d=a+(l-a)*(.35+.65*r),f=4+4*r+6*c,h=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*c)*r+.04*h),g=1+.02*r+.012*h*r;return{arcRad:d,opacity:u,scale:g,level:r}}function Bv(n,t,e,i,s){const a=Math.min(1,Math.max(0,s));return a<=.001?n.copy(t):a<.5?n.copy(t).lerp(e,a*2):n.copy(e).lerp(i,(a-.5)*2)}function mh(n){return{x:0,y:0,z:1}}function Hv(n){return Math.asin(mh().y)}function Gv(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}function Re(n,t,e){return n<t?t:n>e?e:n}const ms=1e-6;function pe(n,t,e,i){const s=new he(new Tn(n,t,e),new Ts({color:i}));return s.castShadow=!0,s.receiveShadow=!0,s}function Se(){return new Ae}function _a(n,t,e){const i=Se(),s=pe(t*.7,.12,t*.7,e.wood);s.position.y=.06,i.add(s);const a=pe(t*2.4,.045,t*.8,e.metal);a.position.y=.13,i.add(a);const o=pe(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=pe(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const c=pe(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function Vv(n){const t=_a(.72,.15,n),e=pe(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function Xv(n){const t=Se(),e=pe(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=pe(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function Wv(n){const t=Se(),e=pe(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=pe(.15,.15,.15,n.glow);i.position.y=.92;const s=i.material;return s.emissive=new Wt(n.glow),s.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function $v(n){const t=Se();for(let i=0;i<5;i++){const s=(i-2)*.15,a=pe(.055,.16,.05,n.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=pe(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function Yv(n){const t=Se(),e=pe(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=pe(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function Zv(n,t,e,i,s,a,o,r,c,l,d){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},h=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},u=Se(),g=Se();g.name="pelvis",g.position.y=n.legLength,u.add(g);const _=Se();_.name="lower";const m=Se();m.name="upper",g.add(_),g.add(m);const p=n.headSize,x=n.legLength,v=n.armLength,M=n.limbThickness,k=n.bodyHeight,R=n.bodyWidth,A=pe(R,k,.28,t.body);A.position.y=k/2,m.add(A);const T=Se();T.name="headPivot",T.position.y=i.headPivotHeight,m.add(T);const b=pe(p,p,p,t.head);b.position.y=p/2,T.add(b);const y=new Ts({color:"#1b2733"});for(const L of[-1,1]){const N=new he(new Tn(.06,.07,.02),y);N.position.set(L*.09,p/2+.03,p/2+.011),T.add(N)}const D=L=>{const N=Se();N.name=L<0?"hipL":"hipR",N.rotation.order="ZYX",N.position.set(L*(R/2-M/2),0,0),_.add(N);const I=pe(M,x/2,M,t.limb);I.position.y=-x/4,N.add(I);const ot=Se();ot.name="knee",ot.position.y=-x/2,N.add(ot);const ct=pe(M,x/2,M,t.limb);ct.position.y=-x/4,ot.add(ct);const ft=pe(M*1.15,.07,M*1.7,t.shoe);ft.position.set(0,-x/2+.035,.045),ot.add(ft);const Et=new ve;return Et.name="footTip",Et.position.y=-x/2,ot.add(Et),{root:N,joint:ot,hand:Se(),tip:Et}},G=L=>{const N=Se();N.name=L<0?"shoulderL":"shoulderR",N.position.set(L*(R/2+M/2),k-.04,0),m.add(N);const I=pe(M,v/2,M,t.limb);I.position.y=-v/4,N.add(I);const ot=Se();ot.name="elbow",ot.position.y=-v/2,N.add(ot);const ct=pe(M,v/2,M,t.limb);ct.position.y=-v/4,ot.add(ct);const ft=Se();ft.position.y=-v/2,ot.add(ft);const Et=pe(M*1.1,.09,M*1.1,t.head);return Et.position.y=.045,ft.add(Et),{root:N,joint:ot,hand:ft}},z=D(-1),W=D(1),P=G(-1),w=G(1),X=[z,W].map(L=>({root:L.root,joint:L.joint,tip:L.tip,upperLen:x/2,lowerLen:x/2,bend:1})),H=Se(),j=Se();w.hand.add(H),P.hand.add(j);const Q=Wv(t),ht=$v(t),mt=Yv(t),Mt={"sword-shield":{right:_a(.42,.075,t),left:Xv(t)},"dual-swords":{right:_a(.42,.075,t),left:_a(.42,.075,t)},greatsword:{right:Vv(t),left:pe(.12,.2,.12,t.wood)},staff:{right:Q.g,left:Se(),orb:Q.orb},bow:{right:mt,left:ht.g,arrow:mt,drawString:ht.drawString}};for(const L of Object.keys(Mt))H.add(Mt[L].right),j.add(Mt[L].left),Mt[L].right.visible=!1,Mt[L].left.visible=!1;let Y=null,tt=0,xt=0,J=0,_t=0,Pt=0,Tt=0,zt=Cv(),St={...pc},bt=0,O=0,$t=0,Ct=-1,Dt=0,At=0,yt=0,wt=0,C=0,S=0,V=0,lt=1,rt=0,st=0,kt=0,nt=!1,B=0,gt=0,Z=0,pt=0,U="none",et=0,dt=1,Lt=!1,Ft=-1,Bt=!1,F=0,vt=0,K=0,at=0,it=0,ut=1,Ut={speed:0,phase:0},Xt={lp:0,lr:0,rp:0,rr:0},Zt=0,Vt=0,oe=!0,ue=0,Ce="none",we=0,se=0,ce=0,Me=.3,mn=0;function ye(L){const N=Math.PI/180,I=a;let ot=0,ct=0,ft=0,Et=0;L==="sword-shield"?(ot=I.swordPitchDeg*N,ct=-I.swordYawDeg*N,ft=I.shieldPitchDeg*N):L==="dual-swords"?(ot=I.swordPitchDeg*N,ct=-I.swordYawDeg*N,ft=I.swordPitchDeg*N,Et=I.swordYawDeg*N):L==="greatsword"?(ot=I.greatswordPitchDeg*N,ct=-I.greatswordYawDeg*N,ft=I.greatswordPitchDeg*N,Et=I.greatswordYawDeg*N):L==="staff"?ot=I.staffPitchDeg*N:ft=I.bowPitchDeg*N,H.rotation.set(ot,0,ct),j.rotation.set(ft,0,Et)}function nn(L){if(L!==Y){Y=L;for(const N of Object.keys(Mt))Mt[N].right.visible=N===L,Mt[N].left.visible=N===L;ye(L),ht.drawString.position.z=-.06,mt.position.z=0,Q.orb.scale.setScalar(1),m.rotation.y=0}}nn("sword-shield");const ae=[];u.traverse(L=>{L instanceof he&&L.material instanceof Ts&&ae.push(L.material)});const sn=new Wt(r.flashColor);function an(L,N){const I=hh(L,N,r);zt=I,m.rotation.x+=I.upperPitch,m.rotation.z+=I.upperRoll,m.rotation.y+=I.upperYaw;const ot=Re(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),ct=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Re(I.upperShiftX*ot,-ct,ct),m.position.z+=Re(I.upperShiftZ*ot,-ct,ct),g.position.x+=I.comX,g.position.z+=I.comZ-I.pelvisBack,g.position.y-=I.drop;const ft=I.legacy?0:Re(r.lowerScale,0,1);_.position.z+=I.pelvisBack*(1-ft),_.position.y+=I.drop*(1-ft),z.joint.rotation.x+=I.knee,W.joint.rotation.x+=I.knee,z.root.rotation.x-=I.hip,W.root.rotation.x-=I.hip,P.root.rotation.x+=I.arm,w.root.rotation.x+=I.arm*.8;for(const Et of ae)Et.emissive.copy(sn).multiplyScalar(I.flash)}function Bn(L){return L<.3?-1:L<.62?-1+(L-.3)/.32*2:Math.max(0,1-(L-.62)/.38)}function Si(L){if(L.phase==="idle"||L.charging)return;const N=L.attackProgress,I=Bn(N),ot=Math.max(0,I),ct=L.comboIndex%2===0?1:-1,ft=c.stride,Et=Number.isFinite(ft.stepReach)?ft.stepReach:.17,Ot=Number.isFinite(ft.stepSideReach)?ft.stepSideReach:.14,Ht=Number.isFinite(ft.stepDipReach)?ft.stepDipReach:.05,It=L.weapon==="greatsword"?Re(Number.isFinite(ft.heavyScale)?ft.heavyScale:1,0,1):1;g.position.z+=Et*ot*It,g.position.x+=ct*Ot*ot*It,g.position.y-=Ht*Math.sin(Math.PI*N)*It}function ns(L){if(ht.drawString.position.z=-.06,mt.position.z=0,Q.orb.scale.setScalar(1),m.rotation.y=0,L.charging&&L.weapon==="bow"){const ct=L.charge;P.root.rotation.x=-1.25,P.joint.rotation.x=-.15,w.root.rotation.x=.35+ct*.3,w.joint.rotation.x=-1.15,ht.drawString.position.z=-.06-ct*.22,mt.position.z=-ct*.3,m.rotation.y=-.22;return}if(L.phase==="idle")return;const N=Bn(L.attackProgress),I=Math.max(0,-N),ot=Math.max(0,N);if(L.weapon==="bow")P.root.rotation.x=-1.2,P.joint.rotation.x=-.15,w.root.rotation.x=.9-ot*.8,w.joint.rotation.x=-.3;else if(L.weapon==="greatsword"){const ct=-1.6*I+1.25*ot,ft=Re(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);w.root.rotation.x=ct,w.joint.rotation.x=-(.25+I*.4),P.root.rotation.x=ct+.06,P.joint.rotation.x=-(.32+I*.4),P.root.rotation.z=.38,m.rotation.y=-.2*N*ft}else{const ct=L.comboIndex;if(ct===1)w.root.rotation.x=-1.7*I+1.1*ot,w.joint.rotation.x=-(.2+I*.5),P.root.rotation.x=.1,m.rotation.y=-.18*N;else if(ct===2)P.root.rotation.x=-1.5*I+1*ot,P.joint.rotation.x=-(.2+I*.5),w.root.rotation.x=.2,m.rotation.y=.45*-N;else{const ft=-1.9*I+1.2*ot;P.root.rotation.x=ft,w.root.rotation.x=ft,P.joint.rotation.x=-(.15+I*.4),w.joint.rotation.x=-(.15+I*.4),m.rotation.y=-.3*N}}Si(L)}function E(L,N){L&&(w.root.rotation.x=-1.05,w.joint.rotation.x=-.35,P.root.rotation.x=-.45,P.joint.rotation.x=-.2,m.rotation.y=-.12,Q.orb.scale.setScalar(1.25+.12*Math.sin(N*2)))}function $(L){if(!L||L.phase==="idle")return;const N=L.progress,I=N<.3?-.35+N/.3*1.35:N<.7?1:Math.max(0,1-(N-.7)/.3),ot=Math.PI/180;m.rotation.x+=h.leanDeg*ot*I,P.root.rotation.x-=h.shieldPitchDeg*ot*I,P.joint.rotation.x-=.22*I,w.root.rotation.x-=.3*I,g.position.z+=h.pelvisReach*Math.max(0,I)}return{group:u,update(L,N,I,ot,ct=!1,ft,Et,Ot){nn(N.weapon),m.rotation.x=0,m.rotation.z=0,g.position.x=0,g.position.y=x,g.position.z=0,g.rotation.z=0,g.rotation.x=0,m.position.x=0,m.position.y=0,m.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const Ht=Math.max(1/240,Math.min(ot,.1)),It=ft===void 0?Zt+=ot:ft;Vt=It;const Gt=c.landing;Gt.enabled?oe&&!L.grounded?(Ce="jump",we=It,se=Gt.anticipationDuration,ce=Math.max(0,Gt.jumpAnticipation),Me=.32):!oe&&L.grounded&&(Ce="land",we=It,se=Gt.duration,ce=Rv(ue,Gt),Me=Gt.compressRatio,mn=ue):(Ce="none",ce=0),It<we&&(Ce="none",ce=0),oe=L.grounded,ue=L.velocity.y;const qt=ed(It,we,se,ce,Me),Jt=N.phase!=="idle",_e=(Ot==null?void 0:Ot.phase)==="active";at=Tv(at,Jt,Ht,c.attack.blendRate);const Kt=Av(at,c.attack.gaitWeight,c.attack.lowerBodyWeight);it=Kt.attackLegWeight,ut=Kt.gaitScale;const Nt=Math.sin(L.bodyYaw),on=Math.cos(L.bodyYaw),ne=(L.velocity.x-tt)/Ht,Xe=(L.velocity.z-xt)/Ht,Hn=Re(ne,-60,60),Ie=Re(Xe,-60,60),ei=Hn*Nt+Ie*on,le=Le(L.bodyYaw-J)/Ht,Ye=Math.hypot(L.velocity.x,L.velocity.z),Gn=o.maxForwardDeg*Math.PI/180,ke=o.maxSideDeg*Math.PI/180,gn=Re(ei*o.accelGain,-Gn,Gn),_n=Re(-le*Ye*o.turnGain,-ke,ke),is=1-Math.exp(-o.smoothing*Ht);_t+=(gn-_t)*is,Pt+=(_n-Pt)*is,tt=L.velocity.x,xt=L.velocity.z,J=L.bodyYaw;const wn=Math.hypot(L.velocity.x,L.velocity.z),za=Re(s.knockGaitScale??0,0,1),gh=I.knockX*za,_h=I.knockZ*za,xh=za>0&&Math.hypot(I.knockX,I.knockZ)>.001,Oa=L.velocity.x+gh,Ba=L.velocity.z+_h,mc=Math.hypot(Oa,Ba);pt=mc;const vh=Math.cos(L.bodyYaw),Mh=-Math.sin(L.bodyYaw),yh=L.velocity.x*vh+L.velocity.z*Mh,Sh=wn>ms?Re(yh/wn,-1,1):0;U==="settled"&&Bt&&F>vt*1.02+1e-4&&(U="none");let ss=1;U==="blend"?(ss=rh(Lt?Ft:et,s.stopYawBlendMode,Lt),Lt||(et=Math.min(1,et+Ht/Math.max(.01,s.stopYawAfterSec)),(et>=1||s.stopYawBlendMode==="inStop"||Bt)&&(U="settled",ss=0))):U==="settled"&&(ss=Re(wn/Math.max(ms,s.stopEnterRatio*e),0,1)),dt=ss;const bh=ih(Sh,i.legYawScale,i.hipYawMaxDeg,s.strafeHipBoost)*ss;O+=(bh-O)*(1-Math.exp(-i.hipYawSmoothing*Ht));const as=L.bodyYaw+O;$t=as;const Eh=Math.sin(as),Th=Math.cos(as),Ah=Math.cos(as),wh=-Math.sin(as),Ps={speed:mc,phase:L.gaitPhase,localForward:Oa*Eh+Ba*Th,localRight:Oa*Ah+Ba*wh,stride:L.stride};Jt&&!nt&&(kt=L.gaitPhase),nt=Jt;const bi=at>0?bv(Ps,N.attackProgress,N.comboIndex,at,c.stride,kt):Ps;Ut=bi;const gc=Math.max(0,s.stopBlendSec||0),_c=gc>0&&!Jt&&!xh&&L.grounded,Ha=sh(wn,rt,e,s.stopEnterRatio,s.stopExitRatio);if(!_c||Ha.resume)Ct=-1;else if(Ct<0&&Ha.enter){Ct=0,Dt=L.gaitPhase,At=eh(L.gaitPhase),yt=wn,wt=Math.max(L.stride,ms),C=Ps.localForward,S=Ps.localRight;const de=1/Math.max(ms,wn);V=L.velocity.x*de,lt=L.velocity.z*de}const Rh=rt;rt=wn;const ni=_c&&Ct>=0;ni&&(Ct=Math.min(1,Ct+Ht/gc)),ni&&U!=="blend"&&(U="blend",et=0),Lt=ni&&Ct<1,Ft=Ct,Bt=Ha.resume,F=wn,vt=Rh;const xc=ni?{phase:Dt,speed:yt,moveSpeed:e,localForward:C,localRight:S,legLength:n.legLength,stride:wt,grounded:!0}:{phase:bi.phase,speed:bi.speed,moveSpeed:e,localForward:bi.localForward,localRight:bi.localRight,legLength:n.legLength,stride:bi.stride??0,grounded:L.grounded},Ch=ni?nh(xc,s,{progress:Ct,phase0:Dt,phaseEnd:At}):fc(xc,s),ie=wv(Ch,Kt.gaitScale);if(K=0,_e&&Ot){const de=Mv(Ot.progress,Ot.dir,s),Qt=Kt.gaitScale;ie.legL.pitchX+=de.legL.pitchX*Qt,ie.legL.rollZ+=de.legL.rollZ*Qt,ie.legL.kneeX+=de.legL.kneeX*Qt,ie.legR.pitchX+=de.legR.pitchX*Qt,ie.legR.rollZ+=de.legR.rollZ*Qt,ie.legR.kneeX+=de.legR.kneeX*Qt,ie.pelvisY+=de.pelvisY*Qt,K=de.env}let Ga=0,Va=0,Xa=0,vc=0;if(ni){const de=oh(L.bodyYaw,V,lt),Qt=ch(Ct,Dt,de.forward,de.right,s);Qt.leadLeft?(ie.legL.pitchX-=Qt.leadPitch,ie.legL.kneeX+=Qt.leadKnee,ie.legR.pitchX+=Qt.trailPitch):(ie.legR.pitchX-=Qt.leadPitch,ie.legR.kneeX+=Qt.leadKnee,ie.legL.pitchX+=Qt.trailPitch),Va=Qt.bodyShift*Qt.fwdN,Ga=Qt.bodyShift*Qt.rightN,Xa=Qt.bodyDip,vc=Qt.chestPitch,B=Qt.leadPitch,gt=Qt.bodyShift,Z=Qt.bodyDip}else B=0,gt=0,Z=0;Xt={lp:ie.legL.pitchX,lr:ie.legL.rollZ,rp:ie.legR.pitchX,rr:ie.legR.rollZ},L.grounded?(z.root.rotation.x=ie.legL.pitchX,W.root.rotation.x=ie.legR.pitchX,z.root.rotation.z=ie.legL.rollZ,W.root.rotation.z=ie.legR.rollZ,z.joint.rotation.x=ie.legL.kneeX,W.joint.rotation.x=ie.legR.kneeX,P.root.rotation.x=ie.armL,w.root.rotation.x=ie.armR,P.joint.rotation.x=-(.18+ie.armL*.2),w.joint.rotation.x=-(.18+ie.armR*.2),P.root.rotation.z=0,w.root.rotation.z=0,g.position.x=ie.pelvisX,g.position.y=x+ie.pelvisY,g.position.z=0,g.rotation.z=ie.pelvisRoll):(z.root.rotation.x=-.55,W.root.rotation.x=-.25,z.joint.rotation.x=.75,W.joint.rotation.x=.55,P.root.rotation.x=-.9,w.root.rotation.x=-.7,P.joint.rotation.x=-.6,w.joint.rotation.x=-.6,z.root.rotation.z=0,W.root.rotation.z=0);const Ph=fh(g,_),os=_e?{...f,weight:0}:ni&&f.enabled?{...f,weight:1}:f,Mc=os.enabled&&L.grounded&&os.weight>0?Re(os.weight,0,1)*(Jt?Re(os.attackScale,0,1):1):0;g.position.x+=Ga,g.position.z+=Va,g.position.y-=Xa,_.position.y+=Xa,Mc<=0&&(_.position.x-=Ga,_.position.z-=Va);const Dh=wn/Math.max(e,ms),Lh=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Ih=1-Math.exp(-Math.max(0,Lh)*Ht);bt+=(Re(Dh,0,1)-bt)*Ih;const Ei=uh({leanForward:_t,leanSide:Pt,speedRatio:bt},o);g.rotation.x+=Ei.pelvisPitch,g.rotation.z+=Ei.pelvisRoll,g.position.x+=Ei.pelvisX,g.position.z+=Ei.pelvisZ,g.position.y-=Ei.crouch,_.position.y+=Ei.crouch*(1-Re(Mc,0,1)),ns(N),E(ct,L.gaitPhase),$(Et);const kh=a.greatswordPitchDeg*Math.PI/180,yc=N.weapon==="greatsword",Sc=Math.hypot(L.velocity.x,L.velocity.z),Uh=yc&&N.phase==="idle"&&Sc>.5?Math.min(1.15,Sc/Math.max(e,.001)*.9):0;Tt+=(Uh-Tt)*(1-Math.exp(-6*Ht)),yc&&(H.rotation.x=kh+Tt),N.weapon==="bow"&&(ht.g.rotation.x=-(P.root.rotation.x+P.joint.rotation.x),mt.rotation.x=-(w.root.rotation.x+w.joint.rotation.x));const Fh=m.rotation.y;an(I,L.bodyYaw);const bc=I.type==="none"?1:.4;if(m.rotation.x+=_t*bc+vc,m.rotation.z+=(Pt+ie.sideLean)*bc,qt>0&&(z.root.rotation.x-=Gt.hipPitch*qt,W.root.rotation.x-=Gt.hipPitch*qt,z.joint.rotation.x+=Gt.kneeBend*qt,W.joint.rotation.x+=Gt.kneeBend*qt,g.position.y-=Gt.crouchDepth*qt,_.position.y+=Gt.crouchDepth*(1-Gt.lowerScale)*qt,m.rotation.x+=Gt.upperPitch*qt,P.root.rotation.x-=Gt.armTuck*qt,w.root.rotation.x-=Gt.armTuck*qt),it>0&&L.grounded){const de=Ev(N.attackProgress,N.comboIndex,c.stride),Qt=it;z.root.rotation.x+=de.legL.pitchX*Qt,W.root.rotation.x+=de.legR.pitchX*Qt,z.root.rotation.z+=de.legL.rollZ*Qt,W.root.rotation.z+=de.legR.rollZ*Qt,z.joint.rotation.x+=de.legL.kneeX*Qt,W.joint.rotation.x+=de.legR.kneeX*Qt,g.position.x+=de.pelvisX*Qt,g.position.y+=de.pelvisY*Qt,g.rotation.z+=de.pelvisRoll*Qt}_.rotation.y=O,st=ah(O,s.chestYawScale,s.chestYawMaxDeg),m.rotation.y+=st;const Nh=Fh;T.rotation.y=Le(L.headYaw-L.bodyYaw-Nh-st),St=ph({root:u,pelvis:g,lower:_,limbs:X,base:Ph,cfg:os,grounded:L.grounded,attacking:Jt})},lean(){return{forward:_t,side:Pt}},landing(){const L=ed(Vt,we,se,ce,Me),N=se>0?Math.max(0,se-Math.max(0,Vt-we)):0;return{pulse:L,remaining:N,kind:L>0?Ce:"none",impactVy:mn}},hurt(){return zt},ik(){return St},attackBlend(){return at},attackWeights(){return{gaitScale:ut,attackLegWeight:it,driveSpeed:Ut.speed,stridePhase:Ut.phase}},hipYaw(){return O},gaitDebug(){return{stopT:Ct,hipYaw:O,chestYaw:st,speed:rt,gaitSpeed:pt,stopStep:B,stopShift:gt,stopDip:Z,stopYawFade:dt,turnStep:K,legLPitch:Xt.lp,legLRoll:Xt.lr,legRPitch:Xt.rp,legRRoll:Xt.rr}},gaitYaw(){return $t},arrowDirection(){mt.updateWorldMatrix(!0,!1);const L=mt.matrixWorld.elements,N=L[8],I=L[9],ot=L[10],ct=Math.hypot(N,I,ot)||1;return{x:N/ct,y:I/ct,z:ot/ct}},dispose(){u.traverse(L=>{if(L instanceof he){L.geometry.dispose();const N=L.material;Array.isArray(N)?N.forEach(I=>I.dispose()):N.dispose()}})}}}function qv(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function jv(n,t,e){const i=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),a=new rv({antialias:!0});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),a.shadowMap.enabled=!0,a.shadowMap.type=yd,a.setSize(i,s,!1),n.appendChild(a.domElement);const o=new cv;o.background=new Wt("#12161d"),o.add(new hv(11061486,2764600,1.15));const r=new pv(16773852,1.5);r.position.set(9,18,11),r.castShadow=!0,r.shadow.mapSize.set(1024,1024);const c=r.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,o.add(r);const l=[],d=new Ae;for(const B of t.boxes){const gt=B.maxX-B.minX,Z=B.maxY-B.minY,pt=B.maxZ-B.minZ;let U=qv(B.kind,e);B.kind==="step"&&(U=new Wt(U).offsetHSL(0,0,B.maxY*.09).getStyle());const et=new Ts({color:U,transparent:!0,opacity:1}),dt=new he(new Tn(gt,Z,pt),et);dt.position.set((B.minX+B.maxX)/2,(B.minY+B.maxY)/2,(B.minZ+B.maxZ)/2),dt.castShadow=B.kind!=="ground",dt.receiveShadow=!0,dt.add(new Kd(new dv(dt.geometry),new dc({color:10467020,transparent:!0,opacity:.32}))),d.add(dt),l.push(et)}o.add(d);const f=t.gridMeta.maxX-t.gridMeta.minX,h=new gv(f,f,4873328,3358797);h.position.y=.002,h.visible=e.showGrid,o.add(h);const u=Zv(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=new Ae,_=.9,m=new Ae;m.position.y=_,u.group.position.y=-_,m.add(u.group),g.add(m),o.add(g);const p=t.dummies.map((B,gt)=>{const Z=e.dummies.colors,pt=Z[gt%Z.length]??"#cccccc",U=Uv(e.voxel,e.colors,pt,B.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return U.group.traverse(et=>{et.userData.dummyId=B.id}),o.add(U.group),U}),x=p.map(B=>B.group),v=new mv,M=e.groundRing,k=e.voxel.bodyWidth,R=sd(k,M.playerRadiusFactor),A=sd(k,M.dummyRadiusFactor),T=k*M.thicknessFactor,b=M.arcDeg*Math.PI/180,y=Uo({radius:R,thickness:T,arcRad:b,edgeFade:M.edgeFade,color:M.playerColor,opacity:M.playerOpacity,y:.028,renderOrder:6});y.mesh.name="player-ground-ring",o.add(y.mesh);const D=t.dummies.map(B=>{const gt=Uo({radius:A,thickness:T,arcRad:b,edgeFade:M.edgeFade,color:M.neutralColor,opacity:M.opacity,y:.022,renderOrder:5});return gt.mesh.name=`dummy-ground-ring-${B.id}`,o.add(gt.mesh),gt}),G=t.dummies.map(B=>{const gt=Uo({radius:A*M.haloRadiusFactor,thickness:T*M.haloThicknessFactor,arcRad:b,edgeFade:M.edgeFade,color:M.neutralColor,opacity:0,y:.019,renderOrder:4});return gt.mesh.name=`dummy-ground-halo-${B.id}`,o.add(gt.mesh),gt}),z=new Wt,W=new Wt(M.playerColor),P=new Wt(M.neutralColor),w=new Wt(M.lowThreatColor),X=new Wt(M.highThreatColor),H=new Ae;o.add(H);const j=new Mn({color:12577023,transparent:!0,opacity:0,side:Fe,depthWrite:!1}),Q=new Ae;Q.position.set(0,.95,.72),H.add(Q);const ht=new Ae;ht.rotation.x=Hv(e.camera.pitchDeg),Q.add(ht);const mt=new he(new Na(.78,.045,6,24,Math.PI*1.15),j);ht.add(mt);const Mt=new uc(1,0),Y=new Mn({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),tt=Array.from({length:16},()=>{const B=new he(Mt,Y);return B.visible=!1,o.add(B),B}),xt=new vs(.86,1,40),J=Array.from({length:6},()=>{const B=new Mn({color:10146047,transparent:!0,opacity:0,side:Fe,depthWrite:!1}),gt=new he(xt,B);return gt.rotation.x=-Math.PI/2,gt.visible=!1,o.add(gt),{mesh:gt,mat:B}}),_t=new Mn({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),Pt=new he(new Tn(.035,.035,.5),_t);H.add(Pt);const Tt=e.dash,zt=new vs(Tt.ringRadius-.06,Tt.ringRadius,28),St=Array.from({length:6},()=>{const B=new Mn({color:16777215,transparent:!0,opacity:0,side:Fe,depthWrite:!1}),gt=new he(zt,B);return gt.rotation.x=-Math.PI/2,gt.visible=!1,o.add(gt),{mesh:gt,mat:B,life:0,base:1}});function bt(B,gt,Z,pt,U){const et=St.find(dt=>dt.life<=0)??St[0];et.mat.color.set(pt),et.mesh.position.set(B,Z+.04,gt),et.base=U,et.mesh.scale.setScalar(U*.6),et.mesh.visible=!0,et.mat.opacity=.9,et.life=Tt.fxDuration}const O=e.links,$t=new vs(O.ringRadius-.07,O.ringRadius,28),Ct=Array.from({length:5},()=>{const B=new Mn({color:O.chargeColor,transparent:!0,opacity:0,side:Fe,depthWrite:!1}),gt=new he($t,B);return gt.rotation.x=-Math.PI/2,gt.visible=!1,o.add(gt),{mesh:gt,mat:B,life:0,base:1}});function Dt(B,gt,Z,pt){const U=Ct.find(et=>et.life<=0)??Ct[0];U.mesh.position.set(B,Z+.05,gt),U.base=pt,U.mesh.scale.setScalar(pt*.55),U.mesh.visible=!0,U.mat.opacity=.85,U.life=O.fxDuration}let At=t.playerLink.id,yt=t.playerLink.hitIds.length,wt=t.dash.id,C="none",S=0,V=-1,lt=1;const rt=xv(e.camera,e.smartCamera,e.zoom,i/s),st=t.character.position;rt.update(st.x,st.y,st.z,1,t.camera);function kt(B,gt){if(x.length===0)return 0;const Z=a.domElement.getBoundingClientRect(),pt=new te((B-Z.left)/Z.width*2-1,-((gt-Z.top)/Z.height)*2+1);v.setFromCamera(pt,rt.camera);const U=v.intersectObjects(x,!0);for(const et of U){const dt=et.object.userData.dummyId;if(dt&&dt>0)return dt}return 0}function nt(B,gt,Z){const pt=a.domElement.getBoundingClientRect(),U=new q(B,gt,Z).project(rt.camera);return{x:pt.left+(U.x*.5+.5)*pt.width,y:pt.top+(-U.y*.5+.5)*pt.height}}return{gaitDebug(){return u.gaitDebug()},render(B,gt){const Z=B.character,pt=B.combat;g.position.set(Z.position.x,Z.position.y,Z.position.z),g.rotation.y=Z.bodyYaw;const U=B.dash.phase==="active"&&B.dash.kind==="roll",et=U&&B.dash.duration>0?Math.min(1,1-B.dash.timer/B.dash.duration):0;m.rotation.x=U?et*Math.PI*2:0,m.position.y=_-(U?.2*Math.sin(Math.PI*et):0),u.update(Z,pt,B.playerHurt,gt,B.abilities.channeling,B.time,B.playerLink,B.turnInPlace);for(let it=0;it<p.length;it++)B.dummies[it]&&p[it].update(B.dummies[it],gt);const dt=rt.camera.position,Lt=Math.atan2(dt.x-Z.position.x,dt.z-Z.position.z),Ft=B.config.gaze.hurtHoldSec,Bt=B.time-B.playerHurt.lastAt,F=Ft>0&&Bt>=0&&Bt<Ft?1-Bt/Ft:0,vt=Ov(B.gaze.active,B.gaze.threat,F,B.time,M);Bv(z,W,w,X,vt.level),y.mesh.position.set(Z.position.x,Z.position.y+.028,Z.position.z),y.update(vt.arcRad,vt.opacity,vt.scale,z,Lt);for(let it=0;it<D.length;it++){const ut=B.dummies[it],Ut=D[it],Xt=G[it];if(!ut){Ut.mesh.visible=!1,Xt.mesh.visible=!1;continue}const Zt=B.targeting.hasTarget&&B.targeting.targetId===ut.id;if(Wu(B,ut)){const ue=$u(B,ut);z.copy(w).lerp(X,ue)}else z.copy(P);const Vt=Zt?M.selectedArcDeg:M.arcDeg,oe=Zt?1+.02*Math.sin(B.time*2.2+ut.id):1;Ut.mesh.position.set(ut.position.x,ut.position.y+.022,ut.position.z),Ut.update(Vt*Math.PI/180,Zt?M.selectedOpacity:M.opacity,Zt?M.selectedScale*oe:1,z,Lt,Zt?M.selectedThicknessScale:1),Xt.mesh.position.set(ut.position.x,ut.position.y+.019,ut.position.z),Xt.update(Vt*Math.PI/180,Zt?M.haloOpacity*(.75+.25*oe):0,Zt?M.selectedScale*oe:1,z,Lt)}if(H.position.set(Z.position.x,Z.position.y,Z.position.z),H.rotation.y=pt.phase!=="idle"?pt.attackFacing:Z.bodyYaw,B.dash.id!==wt){wt=B.dash.id;const it=B.dash;C=it.kind,it.kind==="blink"?(bt(it.fromX,it.fromZ,Z.position.y,Tt.blinkColor,.9),bt(it.toX,it.toZ,Z.position.y,Tt.blinkColor,1.35)):bt(it.fromX,it.fromZ,Z.position.y,Tt.rollColor,1.1)}for(const it of St){if(it.life<=0)continue;it.life-=gt;const ut=Math.max(0,it.life/Tt.fxDuration);it.mat.opacity=.9*ut,it.mesh.scale.setScalar(it.base*(.6+(1-ut)*1.2)),it.life<=0&&(it.mesh.visible=!1)}const K=B.playerLink;K.id!==At&&(At=K.id,yt=K.hitIds.length,Dt(Z.position.x,Z.position.z,Z.position.y,1)),K.hitIds.length>yt?(yt=K.hitIds.length,Dt(Z.position.x,Z.position.z,Z.position.y,1.35)):K.hitIds.length<yt&&(yt=K.hitIds.length);for(const it of Ct){if(it.life<=0)continue;it.life-=gt;const ut=Math.max(0,it.life/Math.max(O.fxDuration,1e-6));it.mat.opacity=.85*ut,it.mesh.scale.setScalar(it.base*(.55+(1-ut)*1.1)),it.life<=0&&(it.mesh.visible=!1)}pt.attackId!==S&&(S=pt.attackId,pt.weapon==="bow"&&pt.phase!=="idle"&&(V=0,lt=.6+pt.lastCharge*.9));const at=pt.phase==="active"&&pt.comboIndex>0;j.opacity=at?.78:0,at&&(mt.rotation.z=-1.2+pt.attackProgress*3.2,mt.scale.setScalar(.9+pt.comboIndex*.13));for(let it=0;it<tt.length;it++){const ut=B.abilities.projectiles[it],Ut=tt[it];Ut.visible=!!ut,ut&&(Ut.position.set(ut.x,ut.y,ut.z),Ut.scale.setScalar(ut.radius),Ut.rotation.y+=gt*6)}for(let it=0;it<J.length;it++){const ut=B.abilities.rings[it],Ut=J[it];if(Ut.mesh.visible=!!ut,ut){const Xt=Math.max(0,Math.min(1,ut.life/Math.max(ut.duration,1e-6)));Ut.mesh.position.set(ut.x,.05,ut.z),Ut.mesh.scale.setScalar(ut.radius),Ut.mat.opacity=.25+.55*Xt}}if(V>=0){V+=gt;const it=V*14*lt;Pt.position.set(0,.85,.6+it),_t.opacity=it<9?.95:0,it>=9&&(V=-1)}else _t.opacity=0;rt.update(Z.position.x,Z.position.y,Z.position.z,gt,B.camera),a.render(o,rt.camera)},resize(){const B=Math.max(1,n.clientWidth),gt=Math.max(1,n.clientHeight);a.setSize(B,gt,!1),rt.resize(B/gt)},getGroundBasis(){return rt.getGroundBasis()},setCollidersVisible(B){for(const gt of l)gt.opacity=B?.3:1,gt.wireframe=B,gt.needsUpdate=!0},setGridVisible(B){h.visible=B},setZoom(B){rt.setZoom(B)},pickDummy:kt,projectToScreen:nt,diagnostics(){const B=mh(e.camera.pitchDeg),gt=Gv(B,H.rotation.y);return{lean:u.lean(),slashNormal:gt,arrowForward:u.arrowDirection(),gait:{hipYaw:u.hipYaw(),gaitYaw:u.gaitYaw()},attackBlend:u.attackBlend(),attackWeights:u.attackWeights(),landing:u.landing(),hurt:u.hurt(),ik:u.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:m.rotation.x,activeRings:St.filter(Z=>Z.life>0).length,lastKind:C},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...rt.smart()}}},dispose(){u.dispose();for(const B of p)B.dispose();y.dispose();for(const B of D)B.dispose();for(const B of G)B.dispose();mt.geometry.dispose(),j.dispose(),Mt.dispose(),Y.dispose(),xt.dispose();for(const B of J)B.mat.dispose();Pt.geometry.dispose(),_t.dispose();for(const B of St)B.mat.dispose();zt.dispose();for(const B of Ct)B.mat.dispose();$t.dispose(),d.traverse(B=>{B instanceof he&&B.geometry.dispose()}),a.dispose(),a.domElement.remove()}}}async function Kv(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function Jv(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download=n,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function Qv(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),s=i("diag-status"),a=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),d=i("diag-close"),f=i("diag-mask");let h=!1,u=!0,g=0;function _(){const x=n.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function m(x){h=x,e.hidden=!x,x?_():a.hidden=!0}function p(x){o.textContent=x,window.clearTimeout(g),g=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),m(!h)}),d.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),o.addEventListener("click",()=>{const x=n.summary();Kv(x).then(v=>{v?(p("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const x=n.dump(),v=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);Jv(`harness-${x.meta.version}-${v}.json`,JSON.stringify(x)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),a.hidden=!0,_(),p("已清空")}),l.addEventListener("click",()=>{u=!u,n.setEnabled(u),_()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),h&&_()},isOpen:()=>h,close:()=>m(!1)}}const tM={intents:{...ad},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function eM(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Zu(Cf,Pf),i=jv(n,e,cn),s=ju(e),a=op(t),o=rp(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.31 · 11-07 15:54 · 诊断");const c=y=>String(y).padStart(2,"0"),l=new Date,d=Ef({meta:{version:"v0.9.31",buildTime:"11-07 15:54",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=Qv(d,r),h=ip({deadZone:()=>cn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&d.suspend(800)});const u={timeScale:1,paused:!1,showColliders:cn.showColliders,showGrid:cn.showGrid};let g=1;const _=ff({maxRadiusPx:()=>cn.joystick.maxRadiusPx,deadZone:cn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>cn.zoom}),m=Array.from(document.querySelectorAll(".wp[data-weapon]"));let p=e.combat.weapon;function x(y){if(y===p)return;p=y;const D=vi.indexOf(y)+1;for(const G of m)G.classList.toggle("is-active",Number(G.dataset.weapon)===D);k.refreshWeapon()}let v=tM,M=0;const k=Vf(e,cn,u,{singleStep:()=>s.singleStep(v.intents),reset:()=>{g=1,s.singleStep({...ad,resetPressed:!0})},resetZoom:()=>{g=1,i.setZoom(1)},onToggleColliders:y=>i.setCollidersVisible(y),onToggleGrid:y=>i.setGridVisible(y)});o.register({motion:h,debug:k.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:s,input:_,viewConfig:cn,debug:u,getUserZoom:()=>g,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:d,telemetrySummary:()=>d.summary(),dirDebug:h.dirDebug,dirAngles:()=>h.dirDebug.last(),motionDebug:h,speedDebug:()=>h.last(),speedSamples:()=>h.samples(),gaitDebug:()=>i.gaitDebug()};let R=performance.now(),A=60,T=0;function b(y){const D=Math.min((y-R)/1e3,.1);R=y,D>0&&(A=A*.9+1/D*.1);const G=_.sample();G.intents.resetPressed&&(g=1),g=nf(g,G.zoomScale,cn.zoom.min,cn.zoom.max),i.setZoom(g);let z=G.intents.dummyClickId;if(G.tap){const w=i.pickDummy(G.tap.x,G.tap.y);w>0&&(z=w)}z>0&&(M=z),v={...G,intents:{...G.intents,dummyClickId:M}};const W=s.frame(D,v.intents,u.timeScale,u.paused,()=>{const w=e.events;for(let X=0;X<w.length;X++)d.event(w[X],e.time)});W>0&&(M=0),d.sample(e,v,D*1e3,W);for(const w of v.gestures)d.gesture(w);y-T>250&&(T=y,f.tick()),x(e.combat.weapon),i.render(e,D),h.update(e,v,i.getGroundBasis());const P=i.diagnostics();a.update(e,A,W,v,u,{attackBlend:P.attackBlend,attackWeights:P.attackWeights,landing:P.landing,hurt:P.hurt,ik:P.ik,zoom:P.camera.zoom},o.hudCompact()),requestAnimationFrame(b)}requestAnimationFrame(b)}eM();

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const yi=["sword-shield","dual-swords","greatsword","staff","bow"],Ws=["wander","follow","keep-distance","attack","idle"],ld={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},_s=1e-6;function Ma(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>_s?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>_s?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Xh(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>_s){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>_s)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const sn=1e-6,Fo=Math.PI/180,dd=-1e9;function hd(){return{type:"none",lastAt:dd,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function No(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Tc(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function Gr(n,t,e){const i=e.duration>0?e.duration:Xr(n,e.type);if(t.kind==="player"){const s=n.playerHurt;if(Tc(s,e.type,i,e.dirX,e.dirZ),s.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>sn){const o=e.knockback*n.config.hits.knockbackDecay;s.knockX=e.dirX*o,s.knockZ=e.dirZ*o}No(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(a){if(Tc(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>sn){const s=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*s,a.hurt.knockZ=e.dirZ*s}n.hitCount+=1,No(n,"hit",a.id,a.position)}}function Vr(n,t,e){Gr(n,{kind:"dummy",index:t},e)}function Wh(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function Xr(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function $h(n){const t=n.combat,e=n.config.hits,i=n.character.position,a=e.reach[t.weapon]??0,s=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Fo),o=Math.sin(t.attackFacing),r=Math.cos(t.attackFacing),c=n.config.dummies.radius,l=n.config.targeting.idealRange;for(const d of n.dummies){const f=d.position.x-i.x,h=d.position.z-i.z,u=Math.hypot(f,h);if(u>a+c)continue;const g=u>sn?f/u:o,_=u>sn?h/u:r;if(u>sn&&(f*o+h*r)/u<s)continue;let m="light";t.weapon==="greatsword"?m="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(m="heavy");const p=e.knockback[t.weapon]??0;let x=u;p>0&&(x=Math.max(u+p,l));const M=Math.max(0,x-u);Vr(n,n.dummies.indexOf(d),{type:m,duration:Xr(n,m),dirX:g,dirZ:_,knockback:M})}}function Yh(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,c=i.fromZ,l=o.x,d=o.z,f=l-r,h=d-c,u=f*f+h*h,g=Math.sin(i.facing),_=Math.cos(i.facing),m=Math.cos(Ac(s.arcDeg,0,180)*Fo),p=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const M=n.dummies[x];if(i.hitIds.indexOf(M.id)>=0)continue;const v=u>sn?Ac(((M.position.x-r)*f+(M.position.z-c)*h)/u,0,1):0,U=r+f*v,R=c+h*v,T=Math.hypot(M.position.x-U,M.position.z-R);let w=!1;if(s.shape==="circle")w=T<=s.radius+p;else if(s.shape==="capsule")w=T<=Math.max(s.radius,s.width)+p;else{const G=M.position.x-l,C=M.position.z-d,A=Math.hypot(G,C),V=A>sn?(G*g+C*_)/A>=m:!0;w=A<=s.radius+p&&V||T<=s.width+p}if(!w)continue;const b=M.position.x-r,y=M.position.z-c,D=Math.hypot(b,y);if(D>sn&&(b*g+y*_)/D<Math.cos(Math.max(s.arcDeg,90)*Fo))continue;const H=D>sn?b/D:g,z=D>sn?y/D:_;Gr(n,{kind:"dummy",index:x},{type:s.type,duration:s.duration,dirX:H,dirZ:z,knockback:s.knockback}),i.hitIds.push(M.id),No(n,"link-hit",M.id,M.position)}}function Zh(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const a=n.dummies[i.value-1];if(!a)continue;const s=e.x-a.position.x,o=e.z-a.position.z,r=Math.hypot(s,o);if(r>t.dummyReach)continue;const c=r>sn?s/r:0,l=r>sn?o/r:1;Gr(n,{kind:"player"},{type:"light",duration:Xr(n,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:a.id})}}function qh(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&$h(n),Yh(n,t),Zh(n)}function Ac(n,t,e){return n<t?t:n>e?e:n}const os=1e-6;function ya(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function jh(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function Kh(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function Jh(n){const t=n.abilities,e=n.config.abilities.arcane,i=n.character.position,a=Math.sin(t.channelYaw),s=Math.cos(t.channelYaw),o=.55,r={id:++t.nextId,x:i.x+a*o,y:i.y+1,z:i.z+s*o,dirX:a,dirZ:s,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(r),t.volleyId+=1,ya(n,"projectile-fire",t.volleyId,r)}function Qh(n,t,e){const i=n.abilities,a=n.config.abilities.arcane,s=n.dash.phase==="active",o=n.playerLink;if(n.combat.weapon==="staff"&&e.attackHeld&&!s&&o.phase==="idle"&&!o.consumedAttack){i.channeling||(i.channeling=!0,i.fireTimer=0,ya(n,"channel-start",0,n.character.position)),i.channelYaw=Ma(n,e),i.fireTimer-=t;let c=0;for(;i.fireTimer<=0&&c++<8;)i.fireTimer+=Math.max(a.fireInterval,os),Jh(n)}else i.channeling&&(i.channeling=!1,ya(n,"channel-end",0,n.character.position))}function tu(n,t){const e=n.config.abilities.ring,i=n.dash.phase==="active";if(n.combat.weapon!=="staff"||!t.skill2Pressed||i)return;const a=n.character.position,s={id:++n.abilities.nextId,x:a.x,z:a.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};n.abilities.rings.push(s),ya(n,"ring-place",s.id,a)}function eu(n,t){const e=n.abilities,i=n.config.abilities.arcane,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of e.projectiles){if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let c=!1;if(s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],f=d.position.x-r.x,h=d.position.z-r.z,u=r.radius+a;if(!(f*f+h*h>u*u)){Vr(n,l,{type:i.hurtType,duration:i.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:i.knockback}),c=!0;break}}c||o.push(r)}e.projectiles=o}function nu(n,t){const e=n.abilities,i=n.config.abilities.ring,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of e.rings){r.life-=t,r.pulseTimer-=t;let c=0;for(;r.pulseTimer<=0&&c++<8;){if(r.pulseTimer+=Math.max(i.pulseInterval,os),s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],f=d.position.x-r.x,h=d.position.z-r.z,u=r.radius+a;if(f*f+h*h>u*u)continue;const g=Math.hypot(f,h),_=g>os?f/g:0,m=g>os?h/g:1;Vr(n,l,{type:"heavy",duration:i.stun,dirX:_,dirZ:m,knockback:i.knockback})}ya(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}e.rings=o}function iu(n,t,e){Qh(n,t,e),tu(n,e),eu(n,t),nu(n,t)}function $s(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Rc=1e-6;function Cc(n,t,e){return n<t?t:n>e?e:n}function ud(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function fd(n){const t=n.camera,e=ud();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function au(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const l of n.dummies){const d=l.position.x-i.x,f=l.position.z-i.z,h=Math.hypot(d,f);if(h>e.radius)continue;const u=Cc((e.radius-h)/Math.max(Rc,e.radius-e.nearDistance),0,1);let g=u*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(g+=e.attackBoost*u),a+=g,s+=l.position.x*g,o+=l.position.z*g,r+=1}const c=a<=0?0:Cc(a/(a+Math.max(Rc,e.saturation)),0,1);if(t.threat=c,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=s/a,d=o/a;t.centroidX=l,t.centroidZ=d;let f=(l-i.x)*e.framingBias*c,h=(d-i.z)*e.framingBias*c;const u=Math.hypot(f,h);u>e.maxOffset&&(f=f/u*e.maxOffset,h=h/u*e.maxOffset),t.offsetX=f,t.offsetZ=h}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function su(n){const t=[],e=n.ground.size;t.push(Ti("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Ti(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(Ti(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Ti(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Ti(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Ti(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Ti(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const Nn=1e-6;function xs(n,t,e){return n<t?t:n>e?e:n}function zo(n,t,e,i,a,s,o){const r=a*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+s+Nn||l.maxY<i-o-Nn||t+r<l.minX||t-r>l.maxX||e+r<l.minZ||e-r>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Wr(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const c of n){if(c.maxY<=t.y+a+Nn||c.minY>=o-Nn)continue;const l=xs(t.x,c.minX,c.maxX),d=xs(t.z,c.minZ,c.maxZ),f=t.x-l,h=t.z-d,u=f*f+h*h;if(!(u>=e*e))if(s=!0,u>Nn*Nn){const g=Math.sqrt(u),_=(e-g)/g;t.x+=f*_,t.z+=h*_}else{const g=t.x-c.minX,_=c.maxX-t.x,m=t.z-c.minZ,p=c.maxZ-t.z,x=Math.min(g,_,m,p);x===g?t.x=c.minX-e:x===_?t.x=c.maxX+e:x===m?t.z=c.minZ-e:t.z=c.maxZ+e}}return s}function $r(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Nn||o.minY>=s-Nn)continue;const r=xs(t.x,o.minX,o.maxX),c=xs(t.z,o.minZ,o.maxZ),l=t.x-r,d=t.z-c;if(l*l+d*d<e*e-Nn)return!0}return!1}const Oo=Math.PI/180,Yr=1e-6;function ou(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Bo(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function pd(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Yr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function md(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Yr)&&s<=Math.max(0,e.inputDeadZone)&&!o}function ru(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function cu(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!md(n,t,e))return!1;const i=pd(n,t,e.lookRange);if(i===null)return!1;const a=Fe(i-n.character.bodyYaw);return Math.abs(a)>Math.max(0,e.triggerDeg)*Oo}function lu(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!md(n,e,a)){Bo(n);return}const s=pd(n,e,a.lookRange);if(s===null){Bo(n);return}const o=n.character,r=Fe(s-o.bodyYaw),c=Math.abs(r),l=Math.max(0,a.triggerDeg)*Oo,d=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Yr;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(c,Math.max(0,a.settleDeg)*Oo);i.targetYaw=Fe(o.bodyYaw+i.dir*(c-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const h=Fe(i.targetYaw-i.fromYaw);o.bodyYaw=Fe(i.fromYaw+h*ru(i.progress)),d||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Ho=1e-6;function Fe(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Pa(n,t,e,i){const a=Fe(t-n);return n+a*(1-Math.exp(-Math.max(e,Ho)*i))}function Pc(n,t,e,i){const a=Fe(t-n),s=Math.abs(a);return s<=i||s<=e?t:Fe(n+Math.sign(a)*Math.max(e,0))}function du(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,c=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",l=o&&!c,d=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Ho,h=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=Ma(n,e);else if(l)i.facing=Pa(i.facing,n.gaze.centroidYaw,a.bodyTurnRate,t);else if(f)i.facing=Ma(n,e);else if(h)i.facing=n.targeting.targetYaw;else if(d>Math.max(a.facingDeadZone,Ho)){const U=Math.atan2(e.moveX,e.moveZ),R=a.facingTurnRate*Math.PI/180*t,T=a.facingSnapDeg*Math.PI/180;if(d>=.35)i.facing=Pc(i.facing,U,R,T);else if(d>=a.facingMinMagnitude&&Math.abs(Fe(U-i.facing))>a.facingDeadbandDeg*Math.PI/180){const b=Pa(i.facing,U,a.facingSmoothRate,t);i.facing=Pc(i.facing,b,R,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const g=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||cu(n,e)||(i.bodyYaw=Pa(i.bodyYaw,g,a.bodyTurnRate,t));let m=i.facing;if(o?m=l?n.gaze.mainYaw:i.facing:f?m=Math.atan2(e.aimX,e.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget&&(m=n.targeting.targetYaw),!o){const U=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Fe(m-i.bodyYaw))>U&&(m=i.moveYaw)}const p=l?n.config.gaze.headTurnRate:a.headTurnRate;let x=Pa(i.headYaw,m,p,t);const M=a.maxHeadTurnDeg*Math.PI/180,v=Fe(x-i.bodyYaw);v>M?x=i.bodyYaw+M:v<-M&&(x=i.bodyYaw-M),i.headYaw=x}const Go=1e-6,hu=Math.PI/180;function Vo(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Zr(n,t,e){return n<t?t:n>e?e:n}function Ds(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Xo(n){const t=n.id,e=n.windowId;Object.assign(n,Ds()),n.id=t,n.windowId=e}function uu(n){Xo(n)}function fu(n){Xo(n.playerLink);for(const t of n.dummies)Xo(t.link)}function pu(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Wo(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function vs(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Ds()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function mu(n,t){const e=n.config.links.search,i=n.character.position,a=Zr(e.maxAngleDeg,0,180)*hu;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,d=c.position.z-i.z,f=Math.hypot(l,d);if(f<Go||f>e.range)continue;const h=Math.atan2(l,d);Math.abs(Fe(h-t))>a||f<r&&(r=f,s=c.id,o=h)}return{id:s,yaw:o,dist:s>0?r:0}}function gu(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=Ma(n,t),c=mu(n,r),l=c.id>0?c.yaw:r,d=c.id>0?Zr(c.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=l,s.targetId=c.id,s.targetDist=c.dist,s.travel=d,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Vo(n,"link-start",s.id)}function _u(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){vs(n);return}if(e.weapon!==n.combat.weapon){vs(n);return}e.timer+=t;const a=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const c=a(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Vo(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Vo(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?Zr(r/o,0,1):1,e.phase==="active"&&i.active>Go){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Go,i.active-e.timer),d=c/l;n.impulse.x=Math.sin(e.facing)*d,n.impulse.z=Math.cos(e.facing)*d}}function xu(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&vs(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&Wo(n,"sprint"),a.prevSprinting=r,_u(n,t);const c=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&gu(n,e,c,o.weapon)}const $o=1e-6;function Jn(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function gd(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function _d(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=gd()}function vu(n){return{weapon:yi[Math.max(0,n-1)]??yi[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:gd()}}function Mu(n,t){return Ma(n,t)}function yu(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function xd(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=Mu(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,Jn(n,"attack-start",i)}function vd(n){return Math.max(0,n.config.combat.settle)}function Yo(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];xd(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:vd(n),lunge:yu(n,i.lunge[e-1]??0)},e)}function Su(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,xd(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:vd(n),lunge:i.lunge},0),Jn(n,"charge-release",e)}function bu(n,t,e){const i=n.combat;if(i.phase==="idle")return;const a=i.timings;i.phaseTimer+=t;let s=0;for(;i.phase!=="idle"&&s++<8;){const c=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<c)break;if(i.phaseTimer-=c,i.phase==="windup")i.phase="active",Jn(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",Jn(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&Yo(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const c=i.timings.recovery;if(c>$o&&i.phaseTimer>=c*n.config.combat.cancelWindow){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&Yo(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}const o=a.windup+a.active+a.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=a.windup+i.phaseTimer:i.phase==="recovery"?r=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1)}function Eu(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=yi.length){const c=yi[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,_d(n),vs(n),Jn(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,Jn(n,"combo-reset",0))),bu(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!c&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const d=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Yo(n,e,d)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&(!o&&!n.playerLink.consumedAttack&&e.attackPressed&&i.phase==="idle"&&!i.charging&&(i.charging=!0,i.charge=0,Jn(n,"charge-start",0)),i.charging&&e.attackHeld&&(i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,$o))),i.charging&&!o&&(e.attackReleased||!e.attackHeld))){i.charging=!1;const c=i.charge;i.charge=0,c>=a.bow.minChargeToFire&&i.phase==="idle"?Su(n,e,c):Jn(n,"charge-release",0)}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>$o)){const c=i.timings.lunge/i.timings.active;n.impulse.x=Math.sin(i.attackFacing)*c,n.impulse.z=Math.cos(i.attackFacing)*c}}const Zo=1e-6;function Ys(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function wu(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Tu(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Dc(n,t,e){return n<t?t:n>e?e:n}function Au(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,d=s.x,f=s.z;for(;l<c-Zo;){const h=Math.min(c,l+r),u=s.x+t*h,g=s.z+e*h,_=Dc(u,o.minX,o.maxX),m=Dc(g,o.minZ,o.maxZ),p={x:_,y:s.y,z:m};if($r(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(d=_,f=m,l=h,_!==u||m!==g))break}return{x:d,z:f}}function Ru(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Wo(n,"roll")),i.cooldown>0){const r=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),r>0&&i.cooldown===0&&Ys(n,"dash-ready",0)}const s=n.combat;if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&s.phase==="idle"&&!s.charging&&n.playerLink.phase==="idle"){const r=Xh(n,e),c=r.x,l=r.z,d=n.combat.weapon==="staff";if(i.kind=d?"blink":"roll",i.dirX=c,i.dirZ=l,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=d?a.blinkCooldown:a.rollCooldown,d){const f=Au(n,c,l);n.character.position.x=f.x,n.character.position.z=f.z,i.toX=f.x,i.toZ=f.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Wo(n,"blink"),Ys(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Zo,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+l*a.rollDistance,Ys(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const r=Math.max(Zo,i.timer),c=n.character.position.x,l=n.character.position.z;n.impulse.x=(i.toX-c)/r,n.impulse.z=(i.toZ-l)/r}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const on=1e-6,qo=Math.PI*2,Cu=7,Pu=18;function Lc(n,t,e){return n<t?t:n>e?e:n}function Du(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ic(n,t,e,i){return n+Du(t-n)*(1-Math.exp(-Math.max(e,on)*i))}function qr(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Lu(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},a=n.initialModes[e]??"idle";t.push({id:e+1,mode:a,initialMode:a,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:hd(),link:Ds()})}return t}function Iu(n){const t=Ws.indexOf(n);return Ws[(t+1)%Ws.length]}function ku(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,uu(i.link)}n.dummyAttackCount=0}function Uu(n,t,e){const i=$s(n)*qo,a=Math.sqrt($s(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+$s(n)*.8)}function Fu(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function Nu(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const r=Math.max(Fu(t,i),on);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",qr(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const s=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||s<=0?0:Math.min(1,o/s)}function zu(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>on?a/o:0,c=o>on?s/o:0;let l=0,d=0;if(t.mode==="wander"){const h=t.targetX-t.position.x,u=t.targetZ-t.position.z,g=Math.hypot(h,u);(t.wanderTimer<=0||g<.3)&&Uu(n,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(_,m);p>on&&(l=_/p,d=m/p)}else if(t.mode==="follow")o>e.followStopDistance&&(l=r,d=c);else if(t.mode==="keep-distance"){const h=o-e.keepDistance;h>e.keepDeadZone?(l=r,d=c):h<-e.keepDeadZone?(l=-r,d=-c):(l=-c*e.keepStrafe,d=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(l=r,d=c);let f=t.facing;return t.mode==="wander"?Math.hypot(l,d)>on&&(f=Math.atan2(l,d)):o>on&&(f=Math.atan2(r,c)),{x:l,z:d,facing:f}}function Ou(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const m=n.character.position;Math.hypot(m.x-e.position.x,m.z-e.position.z)<=i.attackRange+on&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,qr(n,"dummy-attack",e))}Nu(n,e,t,i);const a=zu(n,e,i),s=1-Math.exp(-Math.max(i.acceleration,on)*t);e.velocity.x+=(a.x*i.moveSpeed-e.velocity.x)*s,e.velocity.z+=(a.z*i.moveSpeed-e.velocity.z)*s,e.facing=a.facing,e.bodyYaw=Ic(e.bodyYaw,e.facing,Cu,t),e.headYaw=Ic(e.headYaw,e.facing,Pu,t);const o=e.position.x,r=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;Wr(n.boxes,e.position,i.radius,i.height,c)&&$r(n.boxes,e.position,i.radius,i.height,c)&&(e.position.x=o,e.position.z=r,e.velocity.x=0,e.velocity.z=0);const d=n.config.worldBounds;e.position.x=Lc(e.position.x,d.minX,d.maxX),e.position.z=Lc(e.position.z,d.minZ,d.maxZ);const f=zo(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+c+on&&(e.position.y=f);const h=Math.hypot(e.position.x-o,e.position.z-r);e.distance+=h;const u=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,u/Math.max(n.config.moveSpeed,on)),_=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),on);e.stride=_,e.gaitPhase=(e.gaitPhase+h/_*qo)%qo}function Bu(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=Iu(a.mode),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,qr(n,"dummy-mode",a)}for(const a of n.dummies)Ou(n,t,a,i)}const Ai=1e-6,kc=Math.PI*2;function Zs(n,t){return Math.sqrt(n*n+t*t)}function Da(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Hu(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,_d(n)}function Gu(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=e.moveX,c=e.moveZ;const l=Zs(r,c);l>1&&(r/=l,c/=l);const d=n.combat.phase!=="idle",f=n.playerLink.phase!=="idle",h=d||n.dash.phase==="active"||f;a.sprinting=!h&&e.sprintHeld&&l>Ai;const u=i.combat.weapons[n.combat.weapon];let g=u?u.moveMultiplier:1;h?g*=n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=i.abilities.arcane.moveScale);const _=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;if(h)o.x=r*_,o.z=c*_;else{const H=l>Ai?i.acceleration:i.friction,z=1-Math.exp(-H*t);o.x+=(r*_-o.x)*z,o.z+=(c*_-o.z)*z}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,Da(n,"jumped",i.jumpSpeed)),n.events.some(H=>H.type==="blink"&&H.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const p=s.x,x=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Wr(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if($r(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=p,s.z=x,o.x=0,o.z=0;else{const H=s.x-p,z=s.z-x;Math.abs(H)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(z)<Math.abs(o.z*t)*.5&&(o.z=0)}Da(n,"blocked",1)}const v=i.worldBounds;s.x=Uc(s.x,v.minX,v.maxX),s.z=Uc(s.z,v.minZ,v.maxZ);const U=zo(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&U>s.y+Ai&&U-s.y<=i.stepHeight+Ai&&(s.y=U,o.y=0,Da(n,"stepUp",U));const R=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const T=zo(n.boxes,s.x,s.z,R,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&s.y<=T&&o.y<=0?(s.y=T,o.y=0,a.grounded||Da(n,"landed",T),a.grounded=!0):a.grounded=!1;const w=Zs(s.x-p,s.z-x);a.distance+=w;const b=Zs(o.x,o.z),y=Math.min(i.strideSpeedCap,b/Math.max(i.moveSpeed,Ai)),D=Math.max(i.strideLength*(1+y*i.strideSpeedGain),Ai);a.stride=D,a.gaitPhase=(a.gaitPhase+w/D*kc)%kc}function Uc(n,t,e){return n<t?t:n>e?e:n}const jo=1e-6,Fc=2.399963229728653;function mi(n,t,e){return n<t?t:n>e?e:n}function Nc(n,t,e,i,a,s,o,r,c){const l=t.x-n.x,d=t.z-n.z,f=Math.hypot(l,d),h=e+i;if(f>=h)return;let u,g,_;f<jo?(u=r,g=c,_=h):(u=l/f,g=d/f,_=h-f);const m=_+o;n.x-=u*m*a,n.z-=g*m*a,t.x+=u*m*s,t.z+=g*m*s}function Vu(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let d=0;d<o;d++){for(let f=0;f<e.length;f++)for(let h=f+1;h<e.length;h++){const u=(f*3+h)*Fc;Nc(e[f].position,e[h].position,s,s,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const h=(f+1)*Fc;Nc(i,e[f].position,a,s,0,1,r,Math.cos(h),Math.sin(h))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const d of e)Wr(n.boxes,d.position,s,n.config.dummies.height,c),d.position.x=mi(d.position.x,l.minX,l.maxX),d.position.z=mi(d.position.z,l.minZ,l.maxZ)}function Xu(n,t,e,i,a,s,o,r){const c=Math.hypot(e,i),l=Math.max(0,r.contactBand),d=mi(r.minScale,0,1);if(c<jo||l<=0||d>=1)return 1;const f=a+o,h=mi(r.approachDot,0,.99);let u=0;for(const g of s){const _=g.position.x-n,m=g.position.z-t,p=Math.hypot(_,m);if(p>=f+l)continue;if(p<jo){u=1;continue}const x=(e*_+i*m)/(c*p);if(x<=h)continue;const M=mi(1-(p-f)/l,0,1),v=mi((x-h)/(1-h),0,1);u=Math.max(u,M*v)}return 1-(1-d)*mi(u,0,1)}function Wu(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Xu(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const zc=1e-6,$u=Math.PI/180;function Yu(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Zu(n,t,e){return n<t?t:n>e?e:n}function qu(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;Math.hypot(e.moveX,e.moveZ)>zc&&(o=Math.atan2(e.moveX,e.moveZ));const c=Zu(i.maxAngleDeg,0,180)*$u;let l=Number.POSITIVE_INFINITY,d=0,f=0,h=0;for(const u of n.dummies){const g=u.position.x-s.x,_=u.position.z-s.z,m=Math.hypot(g,_);if(m<zc||m>i.range)continue;const p=Math.atan2(g,_),x=Math.abs(Fe(p-o));if(x>c)continue;const M=m-i.frontBias*Math.cos(x);M<l&&(l=M,d=u.id,f=p,h=m)}a.targetId=d,a.targetYaw=f,a.targetDist=h,a.hasTarget=d>0}const Fn=1e-6;function Ms(n,t,e){return n<t?t:n>e?e:n}function Oc(n){return Math.atan2(Math.sin(n),Math.cos(n))}function ju(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(y,D)=>{const H=y.position.x-s.x,z=y.position.z-s.z,G=Math.hypot(H,z);if(G<Fn||G>D)return 0;const C=Ms((D-G)/Math.max(Fn,D-i.nearDistance),0,1);let A=C*(i.modeWeight[y.mode]??.5);return y.attackPhase==="active"&&(A+=i.attackBoost*C),A},r=[];let c=0,l=!1,d=!1,f=!1;for(const y of n.dummies){const D=o(y,i.threatRange),H=y.position.x-s.x,z=y.position.z-s.z,G=Math.hypot(H,z);D>0&&(r.push({id:y.id,x:y.position.x,z:y.position.z,dx:H,dz:z,yaw:Math.atan2(H,z),w:D}),c+=D,G<=i.approachDist&&(i.modeWeight[y.mode]??.5)>=i.hostileModeWeight&&(f=!0)),G>Fn&&G<=i.recoveryDist&&(l=!0),(y.attackPhase==="windup"||y.attackPhase==="active")&&G<=i.threatRange&&(d=!0)}const h=c<=0?0:Ms(c/(c+Math.max(Fn,i.saturation)),0,1),u=r.length>0,g=a.active,_=u&&(e.aimActive&&h>=i.enterThreshold||i.reactToAttack&&d&&h>=i.enterThreshold||i.reactToApproach&&f),m=i.hurtHoldSec>Fn&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=g&&(l||m);if(a.active=_||p,!a.active){a.mainId=0,a.mainYaw=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((y,D)=>D.w-y.w);const x=r.slice(0,Math.max(1,i.maxThreats)),M=r[0],v=Math.atan2(M.dx,M.dz),U=i.behindAngleDeg*Math.PI/180,R=n.character.bodyYaw;let T=0,w=0,b=0;for(const y of x){const D=Math.abs(Oc(y.yaw-v))/Math.PI;let H=y.w/(1+Math.max(i.spreadFalloff,0)*D*D);y!==M&&i.behindFalloff<1&&Math.abs(Oc(y.yaw-R))>U&&(H*=Math.max(i.behindFalloff,0)),T+=y.x*H,w+=y.z*H,b+=H}a.mainId=M.id,a.mainYaw=v,a.centroidYaw=b>Fn?Math.atan2(T/b-s.x,w/b-s.z):v,a.threatCount=r.length,a.threat=h}function Ku(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function Ju(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<Fn||a>e.threatRange)return 0;const s=Math.max(Fn,e.threatRange-e.nearDistance),o=Ms((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const c=Math.max(Fn,e.modeWeight.attack??1.5);return Ms(r/c,0,1)}function Qu(){return{active:!1,mainId:0,mainYaw:0,centroidYaw:0,threatCount:0,threat:0}}function tf(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:su(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:vu(1),playerLink:Ds(),abilities:jh(),impulse:{x:0,z:0},targeting:Yu(),turnInPlace:ou(),playerHurt:hd(),hitCount:0,dash:{...wu(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...ud(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Qu(),dummies:Lu(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function ef(n){Hu(n),ku(n),fu(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=dd,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Kh(n),Tu(n),fd(n),Bo(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Bc(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){ef(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?qu(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),xu(n,t,e),n.modules.combat&&Eu(n,t,e),n.modules.dash&&Ru(n,t,e),n.modules.movement&&Gu(n,t,e),n.modules.gaze&&ju(n,t,e),n.modules.orientation&&du(n,t,e),lu(n,t,e),n.modules.dummies&&Bu(n,t,e),Wh(n,t),pu(n,t),n.modules.abilities&&iu(n,t,e),n.modules.dummies&&(qh(n,t),n.modules.separation&&(Vu(n),Wu(n))),n.modules.camera?au(n):fd(n),n}function nf(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=r&&l<c;){const d=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Bc(n,r,d),o&&o(),t-=r,l++}return l>=c&&(t=0),l},singleStep(e){Bc(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Md={slopPx:12,longPressMs:450,doubleTapMs:280};function af(n,t,e=Md.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function si(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function sf(n=Md){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,c){if(t.has(s))return null;for(const l of t.values())if(l.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:c,dragging:!1,longFired:!1}),si(a,"press",0,0,0,1)},move(a,s,o,r){const c=i(a);if(!c)return null;c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY;return!c.dragging&&Math.hypot(l,d)>=n.slopPx?(c.dragging=!0,si(c.button,"drag",l,d,r-c.startedAt,1)):null},end(a,s,o,r){const c=i(a);if(!c)return null;t.delete(a),c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY,f=r-c.startedAt,h=Math.hypot(l,d);if(c.dragging||c.longFired||h>=n.slopPx)return si(c.button,"release",l,d,f,1);const u=e.get(c.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(s-u.x,o-u.y)<=n.slopPx*2?(e.delete(c.button),si(c.button,"doubleTap",l,d,f,2)):(e.set(c.button,{at:r,x:s,y:o}),si(c.button,"tap",l,d,f,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),si(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,si(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const qs=.001,of=18;function Ko(n,t,e){return n<t?t:n>e?e:n}function Jo(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function rf(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function cf(n,t,e,i,a=of){const s=rf(t);if(!s)return{state:Jo(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,d=c;if(!Number.isFinite(o)||o<qs)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<qs?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<qs)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,h=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,h):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:Ko(Number.isFinite(u)?u:1,l,d),started:!1,ended:!1,armedNow:!1,pinching:!0}}function lf(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?Ko(r,a,s):Ko(n,a,s)}function df(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function hf(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const js=["jump","sprint","reset","attack","skill2"],uf=8,ff=16,Ks=10,Hc=14,Gc=140,pf=18,mf=16,gf=400,_f=1.0001;function rs(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function xf(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&rs(e)}function vf(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,c=0,l=0,d=0,f=0,h=0,u=-1,g=0,_=null,m=-1,p=0,x=0,M=0,v=0,U=!1,R=0,T=1,w=0,b=null,y=0,D=0,H=!1,z=null,G=null,C=0,A=0,V=0,B=0,j=!1,J=!0,lt=-1;const pt=sf({slopPx:Hc,longPressMs:450,doubleTapMs:350});let Mt=[],Y=null;const tt=new Set;function mt(N){N&&Mt.push(N)}const K=new Map;let gt=Jo(),Lt=!1,Ct=1;function zt(){const N=Array.from(K.values()),it=a(),ut=cf(gt,N,it.pinchGain,it.maxStepRatio,pf);if(gt=ut.state,Lt=ut.pinching,ut.scale!==1&&(Ct*=ut.scale),ut.started||ut.armedNow)b=null,H=!0,z=null;else if(ut.ended&&o===null&&N.length===1){const Ft=N[0];o=Ft.id,r=Ft.x,c=Ft.y,l=0,d=0,f=Ft.x,h=Ft.y,U=!1,R=0,T=1,w=0,performance.now(),b=null,H=!0,z=null}}const At={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},bt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let O=0,Zt=0;const Dt={},It=new Set,St=[];function Et(){for(const N of js)Dt[N]!==void 0&&(Dt[N]=void 0),W(N);pt.reset(),tt.clear(),K.clear(),gt=Jo(),Lt=!1,o=null,l=0,d=0,f=0,h=0,U=!1,R=0,T=1,w=0,p=0,x=0,M=0,v=0,_=null,m=-1,b=null,H=!1,z=null,G=null,lt=-1,V=0,B=0,j=!1,J=!0}const Rt=()=>{document.hidden&&Et()},P=N=>{if(N.clientX===0&&N.clientY===0){g++;return}if(rs(N.target)||xf(N.clientX,N.clientY)){tt.add(N.pointerId);return}if(tt.delete(N.pointerId),K.set(N.pointerId,{id:N.pointerId,x:N.clientX,y:N.clientY}),o===null&&!Lt){_=null,m=-1,o=N.pointerId,r=N.clientX,c=N.clientY,l=0,d=0,f=N.clientX,h=N.clientY,performance.now();const it=Number.isFinite(N.screenX)&&Number.isFinite(N.screenY)&&(N.screenX!==0||N.screenY!==0);U=it,R=0,T=1,w=0,p=it?N.screenX:0,x=it?N.screenY:0,M=p,v=x,b=N.pointerId,y=N.clientX,D=N.clientY,H=!1}zt()},S=N=>{if(N.pointerId===G&&(N.pointerType==="mouse"&&N.buttons===0||N.clientX===0&&N.clientY===0&&(C!==0||A!==0)||(J?(V=N.clientX-C,B=N.clientY-A):(C=N.clientX,A=N.clientY,J=!0,V=0,B=0))),mt(pt.move(N.pointerId,N.clientX,N.clientY,performance.now())),!tt.has(N.pointerId)&&K.has(N.pointerId)&&(K.set(N.pointerId,{id:N.pointerId,x:N.clientX,y:N.clientY}),zt()),tt.has(N.pointerId)||N.pointerId!==o)return;const it=performance.now();if(_===N.pointerId&&it-m<150){g++;return}const ut=N.clientX,Ft=N.clientY;if(ut===0&&Ft===0&&(r!==0||c!==0)){g++;return}const ft=ut-f,L=Ft-h,dt=Number.isFinite(N.screenX)&&Number.isFinite(N.screenY),Z=dt?N.screenX:0,Q=dt?N.screenY:0,_t=dt&&(Z!==0||Q!==0),vt=Z-M,Ot=Q-v;if(U&&_t){const Jt=Math.hypot(vt,Ot),le=Math.hypot(ft,L);if(Jt>3){if(R=0,w<30&&le>6&&vt*ft+Ot*L>.7*Jt*le){const wt=Jt/le;wt>.2&&wt<5&&(T+=(wt-T)*.3,w++)}}else le>12&&(R++,R>=2&&(U=!1))}const Yt=Math.hypot(ft,L);if(!U){const Jt=u<0?Number.POSITIVE_INFINITY:it-u,le=_t?Math.hypot(vt,Ot):1/0;Yt>28&&(Jt<200||le<Yt*.4)&&(r+=ft,c+=L,g++)}f=ut,h=Ft,M=Z,v=Q,N.pointerId===b&&Math.hypot(N.clientX-y,N.clientY-D)>uf&&(H=!0);let ie,Vt;U&&_t?(ie=(Z-p)/T,Vt=(Q-x)/T):(ie=ut-r,Vt=Ft-c);const de=Math.hypot(ie,Vt),he=s();de>he&&(ie*=he/de,Vt*=he/de);const ye=Math.hypot(l,d),xe=Math.hypot(ie,Vt);if(ye>10&&xe>10){const Jt=Math.abs(Math.atan2(l*Vt-d*ie,l*ie+d*Vt)),le=Math.max(ye,xe)*Jt,wt=Math.max(Math.hypot(ft,L),Math.hypot(vt,Ot)/Math.max(.2,T));if(Jt>.6&&wt<Math.max(6,le*.5)){g++;return}}l=ie,d=Vt};function W(N){if(!At[N])return;At[N]=!1,N==="attack"&&(bt.attackReleased=!0);const it=document.getElementById(`btn-${N}`);it==null||it.classList.remove("is-down")}function rt(){o!==null&&(_=o,m=performance.now(),o=null,l=0,d=0,f=0,h=0,U=!1,R=0,T=1,w=0,p=0,x=0,M=0,v=0)}const ct=N=>{const it=K.delete(N.pointerId),ut=tt.delete(N.pointerId);it&&zt(),N.pointerId===G&&(G=null,j?lt=performance.now():(V=0,B=0,lt=-1)),mt(pt.end(N.pointerId,N.clientX,N.clientY,performance.now()));for(const X of js)Dt[X]===N.pointerId&&(Dt[X]=void 0,W(X));const Ft=!it&&!ut&&K.size<=1&&o!==null;(N.pointerId===o||K.size===0||Ft)&&rt(),!ut&&N.pointerId===b&&(!H&&!rs(N.target)&&(z={x:N.clientX,y:N.clientY}),b=null)};for(const N of js){const it=document.getElementById(`btn-${N}`);if(!it)continue;const ut=N==="attack"||N==="skill2",Ft=L=>{if(L.preventDefault(),Dt[N]===void 0){Dt[N]=L.pointerId,At[N]=!0,N==="jump"&&(bt.jump=!0),N==="reset"&&(bt.reset=!0),N==="sprint"&&(bt.sprintPressed=!0),N==="attack"&&(bt.attackPressed=!0),N==="skill2"&&(bt.skill2=!0),it.classList.add("is-down"),mt(pt.begin(N,L.pointerId,L.clientX,L.clientY,performance.now()));try{it.setPointerCapture(L.pointerId)}catch{}ut&&(G=L.pointerId,C=L.clientX,A=L.clientY,J=!(L.clientX===0&&L.clientY===0),V=0,B=0,j=!1,lt=-1)}},X=L=>{Dt[N]===L.pointerId&&(Dt[N]=void 0,W(N),mt(pt.end(L.pointerId,L.clientX,L.clientY,performance.now())))},ft=L=>{Dt[N]===L.pointerId&&(Dt[N]=void 0,W(N),mt(pt.cancel(L.pointerId,performance.now())))};it.addEventListener("pointerdown",Ft),it.addEventListener("pointerup",X),it.addEventListener("pointercancel",ft),St.push(()=>{it.removeEventListener("pointerdown",Ft),it.removeEventListener("pointerup",X),it.removeEventListener("pointercancel",ft)})}const st=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const N of st){const it=ut=>{ut.preventDefault(),O=Number(N.dataset.weapon)||0};N.addEventListener("pointerdown",it),St.push(()=>N.removeEventListener("pointerdown",it))}const kt=N=>{const it=N.key.toLowerCase();if((it===" "||it.startsWith("arrow"))&&N.preventDefault(),It.has(it))return;It.add(it),it===" "&&(bt.jump=!0),it==="r"&&(bt.reset=!0),it==="shift"&&(bt.sprintPressed=!0),it==="j"&&(bt.attackPressed=!0),it==="k"&&(bt.skill2=!0),it>="1"&&it<="5"&&(O=Number(it)),it>="6"&&it<="9"&&(Zt=Number(it)-5);const ut=Math.max(_f,a().keyStep||1.12);(it==="="||it==="+")&&(Ct*=ut),(it==="-"||it==="_")&&(Ct/=ut)},et=N=>{const it=N.key.toLowerCase();It.has(it)&&(It.delete(it),it==="j"&&(bt.attackReleased=!0))},xt=N=>{if(rs(N.target))return;N.preventDefault();const it=N.deltaMode===1?N.deltaY*mf:N.deltaMode===2?N.deltaY*gf:N.deltaY;Ct*=df(it,a().wheelStep)},Bt=N=>{N.preventDefault()},nt=()=>{u=performance.now()};window.addEventListener("resize",nt),window.addEventListener("orientationchange",nt);const yt=typeof window<"u"?window.visualViewport:null;return yt&&(yt.addEventListener("resize",nt),yt.addEventListener("scroll",nt)),window.addEventListener("pointerdown",P),window.addEventListener("pointermove",S),window.addEventListener("pointerup",ct),window.addEventListener("pointercancel",ct),window.addEventListener("blur",Et),document.addEventListener("visibilitychange",Rt),window.addEventListener("keydown",kt),window.addEventListener("keyup",et),window.addEventListener("wheel",xt,{passive:!1}),window.addEventListener("gesturestart",Bt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:c,x:f,y:h,dx:f-r,dy:h-c,radius:s(),badMoves:g,screenOk:U,originSX:p,originSY:x,screenX:M,screenY:v,scale:T}},peekAim(){const N=performance.now(),it=Math.hypot(V,B),ut=G!==null||lt>=0&&N-lt<Gc;if(!(ut&&j&&it>=Ks))return{active:!1,holding:ut,x:0,z:0,dx:V,dy:B};const X=i(),ft=V/it,L=B/it,dt=X.rightX*ft+X.forwardX*-L,Z=X.rightZ*ft+X.forwardZ*-L,Q=Math.hypot(dt,Z)||1;return{active:!0,holding:ut,x:dt/Q,z:Z/Q,dx:V,dy:B}},sample(){var $t;const N=s();let it=o!==null?Math.max(-1,Math.min(1,l/N)):0,ut=o!==null?Math.max(-1,Math.min(1,d/N)):0,Ft=0,X=0;(It.has("a")||It.has("arrowleft"))&&(Ft-=1),(It.has("d")||It.has("arrowright"))&&(Ft+=1),(It.has("w")||It.has("arrowup"))&&(X-=1),(It.has("s")||It.has("arrowdown"))&&(X+=1),it+=Ft,ut+=X;let ft=Math.hypot(it,ut);ft>1&&(it/=ft,ut/=ft,ft=1);const L=it,dt=ut;ft<e&&(it=0,ut=0);const Z=i();let Q=Z.rightX*it+Z.forwardX*-ut,_t=Z.rightZ*it+Z.forwardZ*-ut;const vt=Math.hypot(Q,_t);vt>1&&(Q/=vt,_t/=vt);const Ot=performance.now();mt(pt.poll(Ot));const Yt=Math.hypot(V,B);G!==null&&(Yt>=ff?j=!0:Yt<Ks&&(j=!1));const ie=G!==null||lt>=0&&Ot-lt<Gc,Vt=ie&&j&&Yt>=Ks;let de=0,he=0;if(Vt){const re=V/Yt,Pe=B/Yt,ae=Z.rightX*re+Z.forwardX*-Pe,Ze=Z.rightZ*re+Z.forwardZ*-Pe,Ie=Math.hypot(ae,Ze)||1;de=ae/Ie,he=Ze/Ie}!ie&&G===null&&(V=0,B=0,lt=-1,j=!1);const ye=z;z=null;const xe=Ct;Ct=1;const Jt={moveX:Q,moveZ:_t,jumpPressed:bt.jump,sprintHeld:At.sprint||It.has("shift"),sprintPressed:bt.sprintPressed,resetPressed:bt.reset,attackPressed:bt.attackPressed,attackHeld:At.attack||It.has("j"),attackReleased:bt.attackReleased,skill2Pressed:bt.skill2,weaponSlot:O,dummyClickId:Zt,aimX:de,aimZ:he,aimActive:Vt};bt.jump=!1,bt.reset=!1,bt.sprintPressed=!1,bt.attackPressed=!1,bt.attackReleased=!1,bt.skill2=!1,O=0,Zt=0;const le=Mt.map(re=>af(re,Z,Hc));Mt=[],le.length>0&&(Y=le[le.length-1]);const wt=o!==null?"pointer":It.size>0?"keyboard":"idle";return{intents:Jt,stickX:it,stickY:ut,stickRawX:L,stickRawY:dt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:c,stickPxX:f,stickPxY:h,stickBad:g,stickScreenOk:U,stickOriginSX:p,stickOriginSY:x,stickScreenX:M,stickScreenY:v,stickScale:T,stickVpTop:(($t=hf())==null?void 0:$t.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:V,aimDY:B,source:wt,tap:ye,zoomScale:xe,gestures:le,lastGesture:Y}},dispose(){window.removeEventListener("pointerdown",P),window.removeEventListener("pointermove",S),window.removeEventListener("pointerup",ct),window.removeEventListener("pointercancel",ct),window.removeEventListener("blur",Et),document.removeEventListener("visibilitychange",Rt),window.removeEventListener("keydown",kt),window.removeEventListener("keyup",et),window.removeEventListener("wheel",xt),window.removeEventListener("resize",nt),window.removeEventListener("orientationchange",nt),yt&&(yt.removeEventListener("resize",nt),yt.removeEventListener("scroll",nt)),window.removeEventListener("gesturestart",Bt),pt.reset();for(const N of St)N()}}}const ys=1,Ss=2,bs=4,yd=8,Es=16,xa=32,Sd=64,bd=128,Mf=[[ys,"atk"],[Ss,"dash"],[bs,"link"],[yd,"air"],[Es,"hurt"],[xa,"aim"],[Sd,"spr"],[bd,"chan"]];function Ri(n){if(n===0)return"-";const t=Mf.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const yf=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Sf=0,bf=15,Js=19,Ef=21,wf=22,Tf=23,Af=24,yn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Ge=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,hn=n=>Math.round(n*180/Math.PI*10)/10,Qs=Math.PI*2;function ra(n){let t=n%Qs;return t>Math.PI&&(t-=Qs),t<-Math.PI&&(t+=Qs),t}function Rf(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=ys),n.dash.phase!=="idle"&&(e|=Ss),n.playerLink.phase!=="idle"&&(e|=bs),n.character.grounded||(e|=yd),n.playerHurt.type!=="none"&&(e|=Es),t.intents.aimActive&&(e|=xa),n.character.sprinting&&(e|=Sd),n.abilities.channeling&&(e|=bd),e}function Cf(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Pf(n){const t={sampleHz:n.sampleHz??yn.sampleHz,sampleCapacity:n.sampleCapacity??yn.sampleCapacity,eventCapacity:n.eventCapacity??yn.eventCapacity,anomalyCapacity:n.anomalyCapacity??yn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??yn.dirJumpDeg,aimDropDeg:n.aimDropDeg??yn.aimDropDeg,freezeMs:n.freezeMs??yn.freezeMs,freezeSpeed:n.freezeSpeed??yn.freezeSpeed,stickLostMs:n.stickLostMs??yn.stickLostMs,spikeMs:n.spikeMs??yn.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,c=-1,l=-1e9,d=null,f=0,h=0,u="",g=-1,_=-1,m=-1,p=0,x=-1e9,M=-1,v={},U=null,R=0,T=0,w=0,b=0;function y(C,A){const V=1/t.sampleHz,B=C[Sf];B-l<V-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(C),l=B)}function D(C,A,V,B,j,J){const lt=v[C]??-1e9;if(A-lt<1.2)return;if(v[C]=A,C==="frameSpike"){let Mt=0;for(const Y of s)Y.kind==="frameSpike"&&Mt++;if(Mt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let pt=i.slice(-7);J&&(pt.length===0||pt[pt.length-1]!==J)&&(pt=[...pt.slice(-6),J]),s.push({kind:C,t:Ge(A),tick:V,ms:Math.round(B),detail:j,ctx:pt}),C==="dirJump"?o.dirJumps++:C==="aimDrop"?o.aimDrops++:C==="moveFreeze"?o.freezes++:C==="stickLost"?o.stickLosts++:C==="stickJump"?o.stickJumps++:C==="stickBad"?o.stickBads++:C==="stickDrift"&&o.stickDrifts++}function H(C,A,V,B){a.length>=t.eventCapacity&&a.shift(),a.push({t:Ge(V),tick:B,k:C,d:A})}function z(C){switch(C.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":x=C.tick;break}}function G(){const C=o,A=C.wallMs/1e3,V=C.gestures,B=pt=>Object.entries(V).filter(([Mt])=>Mt.endsWith(`.${pt}`)).reduce((Mt,[,Y])=>Mt+Y,0),j=[];if(j.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),j.push(`运行 ${A.toFixed(1)}s / ${C.frames} 帧 · ${C.fps.toFixed(1)}fps · 最大 ${C.dtMax.toFixed(0)}ms · 尖峰 ${C.spikes} · 步 ${C.steps}`),j.push(`摇杆活跃 ${A>0?Math.round(C.stickActiveMs/1e3/A*100):0}% · 手势 按下 ${B("press")}（单击 ${B("tap")} / 双击 ${B("doubleTap")} / 拖拽 ${B("drag")} / 长按 ${B("longPress")} / 打断 ${B("cancel")} / 拖放 ${B("release")}）`),j.push(`攻击 ${C.attacks}(中${C.hits}) · 受击 ${C.hurts} · 派生 ${C.links}(中${C.linkHits}) · 翻滚 ${C.rolls} 闪现 ${C.blinks} · 跳 ${C.jumps} · 复位 ${C.resets}`),j.push(`法杖 引导${C.channels} 飞弹${C.bolts} 电环${C.rings} · 弓蓄力${C.bowCharges} · 当前武器 ${u||"-"}`),j.push(`异常 ${C.dirJumps+C.aimDrops+C.freezes+C.stickLosts+C.stickJumps+C.stickBads+C.stickDrifts}（dir ${C.dirJumps} / aim ${C.aimDrops} / freeze ${C.freezes} / stick ${C.stickLosts} / stickJump ${C.stickJumps} / 坏指针 ${C.stickBads} / 坐标漂移 ${C.stickDrifts}） · 掉帧尖峰 ${C.spikes}`+(C.inTurns>0?` · 输入转向 ${C.inTurns} 次（最大 ${C.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const pt of s.slice(-6)){j.push(`· ${pt.kind} @t${pt.t.toFixed(2)} tick${pt.tick} ${pt.ms>0?`${pt.ms}ms `:""}${pt.detail}`);const Mt=pt.ctx.map(tt=>String(tt[bf])).join(" "),Y=pt.ctx.map(tt=>tt[Js]===""||tt[Js]==null?".":String(tt[Js])).join(" ");if(j.push(`  yaw ${Mt}`),j.push(`  in  ${Y}`),pt.kind==="stickJump"||pt.kind==="stickBad"||pt.kind==="stickLost"){const tt=pt.ctx.map(K=>`${K[Ef]},${K[wf]}`).join(" "),mt=pt.ctx.map(K=>`${K[Tf]},${K[Af]}`).join(" ");j.push(`  o   ${tt}`),j.push(`  p   ${mt}`)}}if(a.length>0){j.push("最近事件：");for(const pt of a.slice(-12))j.push(`  ${pt.t.toFixed(2)} ${pt.k} ${pt.d}`.trimEnd())}const J=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",lt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return j.push(`摇杆坐标源 ${J}${lt}`),j.push(`UA ${e.ua}`),j.join(`
`)}return{sample(C,A,V,B=0){o.frames++,A.stickHeld&&(A.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=B,o.wallMs+=V,V>o.dtMax&&(o.dtMax=V),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=C.time;const j=C.time;if(c<0&&(c=j),w=j,b=C.tick,!r)return;const J=C.character,lt=Math.hypot(A.stickX,A.stickY),pt=Math.hypot(J.velocity.x,J.velocity.z);u=C.combat.weapon;const Mt=Rf(C,A),Y=J.facing,mt=Math.hypot(A.intents.moveX,A.intents.moveZ)>.05?Math.atan2(A.intents.moveX,A.intents.moveZ):null;lt>.2&&(o.stickActiveMs+=V);const K=[Ge(j),C.tick,Math.round(V*10)/10,Ge(A.stickX),Ge(A.stickY),Ge(A.stickRawX),Ge(A.stickRawY),A.stickHeld?1:0,A.source.slice(0,8),Ge(A.intents.moveX),Ge(A.intents.moveZ),Ge(J.position.x),Ge(J.position.z),Ge(J.velocity.x),Ge(J.velocity.z),hn(Y),hn(J.bodyYaw),Mt,Ge(J.stride),mt===null?"":hn(mt),A.stickId===null?"":A.stickId,Math.round(A.stickOriginX),Math.round(A.stickOriginY),Math.round(A.stickPxX),Math.round(A.stickPxY),A.stickBad,Math.round(A.stickVpTop),Math.round(A.stickOriginSX),Math.round(A.stickOriginSY),Math.round(A.stickScreenX),Math.round(A.stickScreenY),A.stickScreenOk?1:0,Math.round(A.stickScale*100)/100];y(K);const gt=j*1e3<M;if(V>t.spikeMs&&!gt&&j-c>.6&&(o.spikes++,D("frameSpike",j,C.tick,V,`dt ${V.toFixed(0)}ms fl=${Ri(Mt)}`,K)),d!==null&&!gt){const Et=Math.abs(hn(ra(Y-d))),Rt=Math.abs(hn(ra(J.moveYaw-f))),P=(h|Mt)&(ys|Ss|bs|Es)|Mt&xa,S=mt===null?null:Math.abs(hn(ra(Y-mt))),W=mt===null||d===null?null:Math.abs(hn(ra(d-mt))),rt=S!==null&&W!==null&&S<W-.5,ct=(h&xa)!==0&&(Mt&xa)===0&&mt===null,st=S!==null&&(S<=12||rt);Et>t.aimDropDeg&&ct?D("aimDrop",j,C.tick,0,`${Et.toFixed(0)}° @aim→none stick(${A.stickX.toFixed(2)},${A.stickY.toFixed(2)}) aim(${A.aimDX.toFixed(0)},${A.aimDY.toFixed(0)}) fl=${Ri(Mt)}`,K):Et>t.dirJumpDeg&&P===0&&!ct&&(st?(o.inTurns++,Et>o.inTurnMax&&(o.inTurnMax=Et)):D("dirJump",j,C.tick,0,`${Et.toFixed(0)}° res${S===null?" 无输入":`${S.toFixed(0)}°`} yaw ${hn(d)}→${hn(Y)} in ${mt===null?".":hn(mt)}° mvΔ${Rt.toFixed(0)}° aim(${A.aimDX.toFixed(0)},${A.aimDY.toFixed(0)}) fl=${Ri(h)}→${Ri(Mt)}`,K))}const Lt=(Mt&(ys|Ss|bs|Es))!==0,Ct=C.tick-x<30;lt>.35&&pt<t.freezeSpeed&&!Lt&&!Ct?(g<0&&(g=j),j-g>=t.freezeMs/1e3&&j>=_&&(D("moveFreeze",j,C.tick,(j-g)*1e3,`stick(${A.stickX.toFixed(2)},${A.stickY.toFixed(2)}) v${pt.toFixed(2)} ${A.source} fl=${Ri(Mt)}`,K),_=j+1.5,g=-1)):g=-1,A.stickHeld?(lt>p&&(p=lt),p>.35&&lt<.06?(m<0&&(m=j),j-m>=t.stickLostMs/1e3&&(D("stickLost",j,C.tick,(j-m)*1e3,`raw(${A.stickRawX.toFixed(2)},${A.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Ri(Mt)}`,K),m=-1,p=0)):m=-1):(p=0,m=-1);const zt=A.stickScale>.2&&A.stickScale<5?A.stickScale:1,At=A.stickScreenOk,bt=At?A.stickScreenX/zt:A.stickPxX,O=At?A.stickScreenY/zt:A.stickPxY,Zt=At?A.stickOriginSX/zt:A.stickOriginX,Dt=At?A.stickOriginSY/zt:A.stickOriginY,It=bt-Zt,St=O-Dt;if(A.stickHeld&&A.stickId!==null){const Et=U;if(Et&&Et.held&&Et.id===A.stickId){const Rt=Math.hypot(Et.dx,Et.dy),P=Math.hypot(It,St),S=Math.max(Rt,P),W=Math.hypot(bt-Et.cx,O-Et.cy),rt=Math.abs(hn(ra(Math.atan2(St,It)-Math.atan2(Et.dy,Et.dx)))),ct=S*rt*Math.PI/180,st=Math.hypot(Zt-Et.ox,Dt-Et.oy);if(S>18&&rt>35&&W<Math.max(5,ct*.35)&&D("stickJump",j,C.tick,0,`Δ${rt.toFixed(0)}° 手指只动${W.toFixed(0)}px(弧长应${ct.toFixed(0)}px) o(${Math.round(Et.ox)},${Math.round(Et.oy)})→(${Math.round(Zt)},${Math.round(Dt)}) 原点位移${st.toFixed(0)}px p(${Math.round(bt)},${Math.round(O)}) raw(${Math.round(It)},${Math.round(St)}) id${A.stickId} ${At?"src=屏幕":"src=client"}`,K),At&&Et.screenOk){const kt=Math.hypot(A.stickPxX-Et.x,A.stickPxY-Et.y),et=Math.hypot((A.stickScreenX-Et.sx)/zt,(A.stickScreenY-Et.sy)/zt);R+=kt-et,Math.abs(R)>20&&(D("stickDrift",j,C.tick,0,`client 相对屏幕漂移 ${R>0?"+":""}${R.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(A.stickPxX)},${Math.round(A.stickPxY)}) screen(${Math.round(A.stickScreenX)},${Math.round(A.stickScreenY)})`,K),R=0)}}U={id:A.stickId,ox:Zt,oy:Dt,cx:bt,cy:O,x:A.stickPxX,y:A.stickPxY,sx:A.stickScreenX,sy:A.stickScreenY,dx:It,dy:St,held:!0,screenOk:At}}else U=null,R=0;if(A.stickBad>T){const Et=A.stickBad-T;D("stickBad",j,C.tick,0,`拦截 ${Et} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${A.stickBad}）o(${Math.round(A.stickOriginX)},${Math.round(A.stickOriginY)}) p(${Math.round(A.stickPxX)},${Math.round(A.stickPxY)}) id${A.stickId??"-"}`,K)}T=A.stickBad,d=Y,f=J.moveYaw,h=Mt},event(C,A){const V=Cf(C);z(C),r&&(C.type==="dash-ready"||C.type==="combo-reset"||C.type==="stepUp"||H(C.type,V,A,C.tick))},gesture(C){const A=`${C.button}.${C.kind}`;o.gestures[A]=(o.gestures[A]??0)+1,r&&(C.kind==="longPress"||C.kind==="doubleTap"||C.kind==="drag"||C.kind==="cancel")&&H(`g:${C.kind}`,`${C.button} ${C.heldMs.toFixed(0)}ms d${C.distance.toFixed(0)}px ${C.angleDeg.toFixed(0)}°`,w,b)},suspend(C){M=w*1e3+C,g=-1,m=-1},setEnabled(C){r=C,C||(d=null,U=null,g=-1,m=-1)},clear(){i.length=0,a.length=0,s.length=0,v={},l=-1e9,d=null,h=0,g=-1,m=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,R=0,U=null,T=0;for(const C of Object.keys(o.gestures))delete o.gestures[C]},status(){const C=o.simS,A=s.some(V=>C-V.t<8&&(V.kind==="dirJump"||V.kind==="aimDrop"||V.kind==="moveFreeze"||V.kind==="stickLost"||V.kind==="stickJump"||V.kind==="stickBad"||V.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:A,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:yf,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:G}}const Df={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.82},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:7,headTurnRate:30,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Lf={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},If={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.3,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.14,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},kf={core:Df,scene:Lf,view:If};function jr(n){return JSON.parse(JSON.stringify(n))}const Kr=kf,Uf=jr(Kr.core),Ff=jr(Kr.scene),un=jr(Kr.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class wn{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),wn.nextNameID=wn.nextNameID||0,this.$name.id=`lil-gui-name-${++wn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Nf extends wn{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Qo(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const zf={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Qo,toHexString:Qo},Sa={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},Of={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Sa.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Sa.toHexString(a)}},Bf={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Sa.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Sa.toHexString(a)}},Hf=[zf,Sa,Of,Bf];function Gf(n){return Hf.find(t=>t.match(n))}class Vf extends wn{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Gf(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=Qo(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class to extends wn{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Xf extends wn{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const M=parseFloat(this.$input.value);isNaN(M)||(this._snapClampSetValue(M+x),this.$input.value=this.getValue())},a=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},s=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let o=!1,r,c,l,d,f;const h=5,u=x=>{r=x.clientX,c=l=x.clientY,o=!0,d=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=x=>{if(o){const M=x.clientX-r,v=x.clientY-c;Math.abs(v)>h?(x.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(M)>h&&_()}if(!o){const M=x.clientY-l;f-=M*this._step*this._arrowKeyMultiplier(x),d+f>this._max?f=this._max-d:d+f<this._min&&(f=this._min-d),this._snapClampSetValue(d+f)}l=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,M,v,U)=>(p-x)/(M-x)*(U-v)+v,e=p=>{const x=this.$slider.getBoundingClientRect();let M=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(M)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",h))},f=p=>{if(o){const x=p.touches[0].clientX-r,M=p.touches[0].clientY-c;Math.abs(x)>Math.abs(M)?l(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h))}else p.preventDefault(),e(p.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h)},u=this._callOnFinishChange.bind(this),g=400;let _;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const M=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+M),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(u,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Wf extends wn{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class $f extends wn{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Yf=`.lil-gui {
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
}`;function Zf(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Vc=!1;class ws{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!Vc&&r&&(Zf(Yf),Vc=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new Wf(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new Xf(this,t,e,i,a,s);case"boolean":return new Nf(this,t,e);case"string":return new $f(this,t,e);case"function":return new to(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new Vf(this,t,e,i)}addFolder(t){const e=new ws({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof to||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof to)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function qf(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new ws({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new ws({title:"实验台 · 调试面板"}),o=n.config,r=[],c=[],l=P=>{const S=s.addFolder(P);return c.push(S),S},d=(P,S)=>{const W=P.addFolder(S);return r.push(W),W},f=l("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid);const h=d(f,"模块开关");h.add(n.modules,"movement").name("movement"),h.add(n.modules,"combat").name("combat"),h.add(n.modules,"links").name("links"),h.add(n.modules,"orientation").name("orientation"),h.add(n.modules,"turnInPlace").name("turnInPlace"),h.add(n.modules,"targeting").name("targeting"),h.add(n.modules,"hits").name("hits"),h.add(n.modules,"separation").name("separation"),h.add(n.modules,"dash").name("dash"),h.add(n.modules,"camera").name("camera"),h.add(n.modules,"dummies").name("dummies"),h.add(n.modules,"abilities").name("abilities");const u=l("移动 / 输入"),g=d(u,"基础移动参数");g.add(o,"moveSpeed",1,10,.1).name("移动速度"),g.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(o,"acceleration",1,40,.5).name("加速度"),g.add(o,"friction",1,40,.5).name("摩擦"),g.add(o,"gravity",5,60,.5).name("重力"),g.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(o,"characterRadius",.1,.8,.01).name("角色半径"),g.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(o,"strideLength",.3,3,.05).name("基础步幅"),g.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=d(u,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=o.dash,p=d(u,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=o.separation,M=d(u,"角色间分离 / 挤压阻力");M.add(x,"iterations",1,8,1).name("迭代次数"),M.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),M.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),M.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),M.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=o.dummies,U=d(u,"假人 AI");U.add(v,"moveSpeed",.5,8,.1).name("移动速度"),U.add(v,"wanderRadius",.5,8,.1).name("游走半径"),U.add(v,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),U.add(v,"followStopDistance",.3,5,.1).name("跟随停距"),U.add(v,"keepDistance",1,10,.1).name("保持距离"),U.add(v,"keepDeadZone",.1,2,.05).name("保持死区"),U.add(v,"attackRange",.5,5,.1).name("攻击距离"),U.add(v,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const R=l("步态 / 停步"),T=d(R,"程序化步态");T.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),T.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),T.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),T.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),T.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),T.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),T.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),T.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),T.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),T.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),T.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),T.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),T.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),T.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)");const w=d(R,"停步收相 / 胸朝向");w.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),w.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),w.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),w.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),w.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const b=d(R,"停步惯性");b.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),b.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),b.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),b.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),b.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),b.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),b.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),d(R,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const D=d(R,"足部 IK"),H=t.ik;D.add(H,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),D.add(H,"weight",0,1,.01).name("钉地权重"),D.add(H,"attackScale",0,1,.01).name("攻击时权重倍率"),D.add(H,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const z=d(R,"惯性倾斜 / 盆骨"),G=t.lean;z.add(G,"accelGain",0,.1,.002).name("前后加速度增益"),z.add(G,"turnGain",0,.2,.005).name("绕圈侧倾增益"),z.add(G,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),z.add(G,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),z.add(G,"smoothing",1,30,1).name("倾斜平滑速率"),z.add(G,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),z.add(G,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),z.add(G,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),z.add(G,"crouchSmoothing",1,30,1).name("下沉平滑速率");const C=o.orientation,A=d(R,"朝向 / 下盘带转");A.add(C,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),A.add(C,"headTurnRate",.5,40,.5).name("头部转向速率"),A.add(C,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),A.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),A.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),A.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const V=d(R,"原地转身 / 停步偏差 (v9s)"),B=o.turnInPlace;V.add(B,"enabled").name("启用原地转身 (关=纯插值)"),V.add(B,"triggerDeg",20,180,5).name("触发夹角 (°)"),V.add(B,"settleDeg",0,60,1).name("转身保留余角 (°)"),V.add(B,"durationSec",.1,1.5,.02).name("转身时长 (s)"),V.add(B,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),V.add(B,"inputDeadZone",0,.5,.01).name("起步输入死区"),V.add(B,"armSec",0,.5,.01).name("触发防抖 (s)"),V.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),V.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),V.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),V.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),V.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),V.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const j=l("战斗 / 受击"),J=o.combat,lt=d(j,"连击 / 武器"),pt=lt.add(n.combat,"weapon",yi).name("当前武器");lt.add(J,"comboWindow",.1,2,.05).name("连击窗口 (s)"),lt.add(J,"settle",0,.8,.01).name("段间停顿 (s)"),lt.add(J,"attackMoveScale",0,1,.01).name("攻击时移动比例"),lt.add(J,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),lt.add(J,"cancelWindow",0,1,.01).name("取消窗口 (s)"),lt.add(J,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),lt.add(J,"autoCombo").name("按住自动连击"),lt.add(J.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),lt.add(J.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),lt.add(J.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),lt.add(J.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),lt.add(J.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),lt.add(J.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const Mt=o.abilities;lt.add(Mt.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),lt.add(Mt.arcane,"speed",3,24,.5).name("飞弹速度"),lt.add(Mt.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),lt.add(Mt.ring,"radius",.5,5,.1).name("电环半径"),lt.add(Mt.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),lt.add(Mt.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const Y=d(j,"攻击动作 / 跨步 / 落地");Y.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),Y.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),Y.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const tt=t.animation.stride;Y.add(tt,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),Y.add(tt,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),Y.add(tt,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),Y.add(tt,"cycles",1,3,1).name("每段跨步周期数"),Y.add(tt,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),Y.add(tt,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),Y.add(tt,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),Y.add(tt,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),Y.add(tt,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),Y.add(tt,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),Y.add(tt,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),Y.add(tt,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),Y.add(tt,"heavyScale",0,1,.01).name("大剑重击收敛系数"),Y.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),Y.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),Y.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),Y.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),Y.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),Y.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),Y.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),Y.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),Y.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),Y.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),Y.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),Y.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const mt=d(j,"武器握持");mt.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),mt.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),mt.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),mt.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const K=o.hits,gt=d(j,"命中 / 受击 / 击退");gt.add(K,"arcDeg",10,120,5).name("命中扇区半角 (°)"),gt.add(K,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),gt.add(K,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),gt.add(K,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),gt.add(K.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),gt.add(K.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),gt.add(K,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),gt.add(K,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Lt=o.targeting,Ct=d(j,"目标辅助");Ct.add(Lt,"targetAssist").name("启用目标辅助"),Ct.add(Lt,"range",1,14,.5).name("锁定范围 (m)"),Ct.add(Lt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Ct.add(Lt,"frontBias",0,4,.1).name("朝向加权"),Ct.add(Lt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Ct.add(Lt,"maxLungeScale",1,3,.1).name("前冲最大放大");const zt=d(j,"受击分层"),At=t.hurt;zt.add(At,"enabled").name("启用分层受击 (关=旧版对照)"),zt.add(At,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),zt.add(At,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),zt.add(At,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),zt.add(At,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),zt.add(At,"upperShiftScale",0,1,.01).name("上身位移缩放"),zt.add(At,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),zt.add(At.hitHeight,"light",0,1,.01).name("轻击命中部位"),zt.add(At.hitHeight,"heavy",0,1,.01).name("重击命中部位"),zt.add(At.hitHeight,"knock",0,1,.01).name("击退命中部位"),zt.add(At,"leanLight",0,1.5,.01).name("轻击力度"),zt.add(At,"leanHeavy",0,1.5,.01).name("重击力度"),zt.add(At,"leanKnock",0,1.5,.01).name("击退力度"),zt.add(At,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:At.abdomen},{name:"打肩 (shoulder)",p:At.shoulder}].map(({name:P,p:S})=>{const W=d(zt,P);return W.add(S,"upperPitch",0,2,.01).name("上身前后倾斜"),W.add(S,"upperRoll",0,2,.01).name("上身侧倾"),W.add(S,"upperYaw",0,1.5,.01).name("肩部扭转"),W.add(S,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),W.add(S,"shift",0,.8,.01).name("身体反应位移"),W.add(S,"drop",0,.4,.01).name("整体下沉"),W.add(S,"back",0,.4,.01).name("屁股向后"),W.add(S,"knee",0,1.6,.01).name("屈膝"),W.add(S,"hip",0,1,.01).name("髋前倾"),W.add(S,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),W});const bt=d(j,"派生招"),O=o.links;bt.add(O,"enabled").name("总开关 (false=旧连击)"),bt.add(O.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),bt.add(O.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),bt.add(O.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),bt.add(O,"sharedCooldown",0,3,.05).name("共享 CD (s)"),bt.add(O,"triggerWhileSprinting").name("长跑中可直接触发"),bt.add(O.search,"range",1,14,.1).name("索敌距离 (m)"),bt.add(O.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),bt.add(O.search,"stopDistance",0,3,.05).name("停住距离 (m)");const Zt=O.moves["sword-shield"];Zt&&(bt.add(Zt,"enabled").name("剑盾盾击"),bt.add(Zt,"distance",0,8,.1).name("冲锋极限 (m)"),bt.add(Zt,"windup",0,.5,.01).name("前摇 (s)"),bt.add(Zt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),bt.add(Zt,"recovery",0,.8,.01).name("收势 (s)"),bt.add(Zt.hit,"radius",0,4,.05).name("命中半径 (m)"),bt.add(Zt.hit,"width",0,2,.05).name("扫掠半径 (m)"),bt.add(Zt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),bt.add(Zt.hit,"duration",0,1.5,.01).name("僵直 (s)")),bt.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const Dt=l("相机"),It=d(Dt,"基础");It.add(t.camera,"pitchDeg",20,80,1).name("俯角"),It.add(t.camera,"yawDeg",-180,180,1).name("方位角"),It.add(t.camera,"distance",6,35,.5).name("距离"),It.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),It.add(t.camera,"fov",25,90,1).name("FOV");const St=o.camera,Et=d(Dt,"智能构图");Et.add(St,"radius",2,18,.5).name("威胁评估半径 (m)"),Et.add(St,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),Et.add(St,"saturation",.5,8,.1).name("威胁归一化饱和"),Et.add(St,"pushIn",0,.5,.01).name("无威胁推进比例"),Et.add(St,"maxPullback",0,1,.02).name("最大拉远比例"),Et.add(St,"maxOffset",0,6,.1).name("最大构图平移 (m)"),Et.add(St,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),Et.add(St,"framingBias",0,1,.05).name("威胁质心平移系数"),Et.add(St,"attackBoost",0,2,.05).name("挥砍中额外加权"),Et.add(St.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),Et.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Rt=d(Dt,"缩放");return Rt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),Rt.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),Rt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),Rt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),Rt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),Rt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),Rt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),Rt.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(P=>P.close()),c.forEach(P=>P.close()),s.close(),{gui:s,refreshWeapon:()=>pt.updateDisplay()}}const eo=Math.PI*2,Sn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},jf=45,Kf=50;function Jf(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function ca(n,t,e){const i=Jf(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function Qf(n,t){return Math.atan2(n,-t)*180/Math.PI}function Xc(n,t){return Math.abs(((n-t)%360+540)%360-180)}function La(n){return(n%360+360)%360}const tp={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function ep(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),c=a.velocity,l=Math.hypot(c.x,c.z),d=o>.001?ca(s.moveX,s.moveZ,e):null,f=l>.15?ca(c.x,c.z,e):null,h=ca(Math.sin(a.facing),Math.cos(a.facing),e),u=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?ca(s.aimX,s.aimZ,e):null,g=n.targeting,_=g.hasTarget?ca(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=d!==null&&f!==null?Xc(d,f):null,p=d!==null?Xc(d,h):null,x=m!==null&&m>jf&&o>=.35&&l>=.4;return{inDeg:d,inLen:Math.min(1,o),rawDeg:r>.02?Qf(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:l,faceDeg:h,lockDeg:_,lockId:g.targetId,lockDist:g.targetDist,aimDeg:u,gapMove:m,gapFace:p,warnMove:x}}function Wc(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>Kf&&(n.inLen>=.35||n.speed>=.4)}const $c="harness.dirDebug";function np(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem($c)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),s&&(s.textContent=c?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(c)))}l();function d(M){if(c=M,!t)try{window.localStorage.setItem($c,M?"1":"0")}catch{}l()}s==null||s.addEventListener("pointerdown",M=>{M.preventDefault(),M.stopPropagation(),d(!c)}),t||window.addEventListener("keydown",M=>{M.key.toLowerCase()==="v"&&!M.metaKey&&!M.ctrlKey&&d(!c)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;a.width=Math.round(h*f),a.height=Math.round(h*f);let u=tp,g=0,_="",m=8;function p(M){if(!r)return;const v=h,U=h,R=v/2,T=U/2,w=Math.min(v,U)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,v,U),r.beginPath(),r.arc(R,T,w,0,eo),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=M.warnMove?"rgba(251, 191, 36, 0.85)":Sn.ring,r.stroke(),r.strokeStyle=Sn.grid,r.beginPath(),r.moveTo(R-w,T),r.lineTo(R+w,T),r.moveTo(R,T-w),r.lineTo(R,T+w),r.stroke();for(let H=0;H<8;H++){const z=H*Math.PI/4,G=R+Math.sin(z)*(w-3),C=T-Math.cos(z)*(w-3),A=R+Math.sin(z)*w,V=T-Math.cos(z)*w;r.beginPath(),r.moveTo(G,C),r.lineTo(A,V),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=Sn.dead,r.beginPath(),r.arc(R,T,w*b,0,eo),r.stroke(),r.restore());const y=(H,z,G,C,A=!1,V=1)=>{const B=H*Math.PI/180,j=Math.sin(B),J=-Math.cos(B),lt=w*Math.max(.14,Math.min(1,z)),pt=R+j*w*.14,Mt=T+J*w*.14,Y=R+j*lt,tt=T+J*lt;if(r.save(),r.globalAlpha=V,r.strokeStyle=G,r.fillStyle=G,r.lineWidth=C,r.lineCap="round",A&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(pt,Mt),r.lineTo(Y,tt),r.stroke(),!A&&lt>w*.3){const mt=-J,K=j,gt=5.2;r.beginPath(),r.moveTo(Y+j*1.5,tt+J*1.5),r.lineTo(Y-j*gt+mt*gt*.72,tt-J*gt+K*gt*.72),r.lineTo(Y-j*gt-mt*gt*.72,tt-J*gt-K*gt*.72),r.closePath(),r.fill()}r.restore()},D=(H,z)=>{const G=H*Math.PI/180,C=Math.sin(G),A=-Math.cos(G),V=-A,B=C,j=w+1.5,J=j+6.5;r.save(),r.fillStyle=z,r.strokeStyle=z,r.lineWidth=1,r.beginPath(),r.moveTo(R+C*J,T+A*J),r.lineTo(R+C*j+V*4,T+A*j+B*4),r.lineTo(R+C*j-V*4,T+A*j-B*4),r.closePath(),r.fill(),r.restore()};M.lockDeg!==null&&y(M.lockDeg,1,Sn.lock,1,!0,.7),M.rawDeg!==null&&M.stickHeld&&y(M.rawDeg,M.rawLen,Sn.raw,1,!0,.9),M.aimDeg!==null&&y(M.aimDeg,1,Sn.aim,1.6,!0,.95),y(M.faceDeg,1,Sn.face,1.1,!0,.55),M.moveDeg!==null&&y(M.moveDeg,M.speed/Math.max(1,m),Sn.move,5.5,!1,.8),M.inDeg!==null&&y(M.inDeg,M.inLen,Sn.input,2.2),D(M.faceDeg,Sn.face),r.beginPath(),r.arc(R,T,2.2,0,eo),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function x(M,v){const U=w=>w===null?"-":String(Math.round(La(w)));o.in.textContent=`入 ${U(M.inDeg)}`,o.mv.textContent=`移 ${U(M.moveDeg)}`,o.fc.textContent=`面 ${U(M.faceDeg)}`;const R=w=>w===null?"-":`${Math.round(w)}°`,T=[`Δ入→移 ${R(M.gapMove)}`,`Δ入→面 ${R(M.gapFace)}`];M.speed>.05&&T.push(`v${M.speed.toFixed(1)}`),M.lockDeg!==null&&T.push(`锁#${M.lockId} ${M.lockDist.toFixed(1)}m`),M.aimDeg!==null&&T.push("拖拽瞄准"),o.gap.textContent=T.join("  "),e.classList.toggle("is-warn",M.warnMove||Wc(M,v))}return{update(M,v,U){if(!c)return;m=Math.max(1,M.config.moveSpeed*Math.max(1,M.config.sprintMultiplier));const R=ep(M,v,U,m);u=R;const T=M.combat.phase!=="idle";p(R);const w=performance.now(),b=`${R.inDeg}|${R.moveDeg}|${R.faceDeg}|${R.lockId}|${R.aimDeg}|${R.warnMove}|${R.speed.toFixed(1)}`;(w-g>90||b!==_)&&(g=w,_=b,x(R,T),e.dataset.in=R.inDeg===null?"":La(R.inDeg).toFixed(1),e.dataset.mv=R.moveDeg===null?"":La(R.moveDeg).toFixed(1),e.dataset.fc=La(R.faceDeg).toFixed(1),e.dataset.warn=R.warnMove||Wc(R,T)?"1":"0")},setEnabled:d,toggle(){return d(!c),c},enabled:()=>c,last:()=>u}}const ip=6,ap=480,Yc=240,Zc=92,sp=18;function op(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1}}function rp(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function cp(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function lp(n={}){const t=Math.max(1,n.windowS??ip),e=Math.max(60,n.capacity??ap),i=Math.max(1,n.speedCap??sp),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),c=s.querySelector("#motiondbg-graph"),l=s.querySelector("#motiondbg-read"),d=s.querySelector("#motiondbg-window"),f=s.querySelector("#motiondbg-dir");d.textContent=`${t.toFixed(1)}s`;const h=c.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(Yc*u),c.height=Math.round(Zc*u);const g=np({deadZone:n.deadZone,container:f,embedded:!0});let _=!1;function m(w){_=w,s.classList.toggle("is-off",!w),!a&&r&&(r.textContent=w?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(w)),r.setAttribute("aria-label",w?"收起手感调试面板":"展开手感调试面板"))}m(!1),a||(r==null||r.addEventListener("pointerdown",w=>{w.preventDefault(),w.stopPropagation(),m(!_)}),window.addEventListener("keydown",w=>{w.key.toLowerCase()==="v"&&!w.metaKey&&!w.ctrlKey&&m(!_)}));const p=[];let x=0,M=null,v=-1,U={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function R(w){const b=w-t;let y=0;for(;y<p.length&&p[y].t<b;)y++;return p.slice(y)}function T(w,b){if(!h)return;const y=Yc,D=Zc;h.setTransform(u,0,0,u,0,0),h.clearRect(0,0,y,D),h.fillStyle="rgba(8, 12, 17, 0.55)",h.fillRect(0,0,y,D);const H=4,z=4,G=y-H-z,C=9,A=46,V=62,B=22,j=b-t,J=K=>H+Math.max(0,Math.min(1,(K-j)/t))*G;for(let K=0;K<w.length;K++){if(!w[K].busy)continue;const gt=J(w[K].t),Lt=K+1<w.length?J(w[K+1].t):gt+2;h.fillStyle="rgba(251, 146, 60, 0.13)",h.fillRect(gt,C,Math.max(2,Lt-gt),A)}h.strokeStyle="rgba(150, 190, 220, 0.14)",h.lineWidth=1,h.beginPath();for(const K of[C,C+A/2,C+A])h.moveTo(H,K),h.lineTo(y-z,K);h.moveTo(H,V+B/2),h.lineTo(y-z,V+B/2),h.stroke();const pt=Math.max(1,...w.map(K=>K.speed),...w.map(K=>K.drive))*1.15,Mt=K=>C+A-K/pt*A;if(w.length>1){h.beginPath(),h.moveTo(J(w[0].t),Mt(w[0].speed));for(let K=1;K<w.length;K++)h.lineTo(J(w[K].t),Mt(w[K].speed));h.strokeStyle="#38bdf8",h.lineWidth=1.8,h.lineJoin="round",h.stroke(),h.lineTo(J(w[w.length-1].t),C+A),h.lineTo(J(w[0].t),C+A),h.closePath(),h.fillStyle="rgba(56, 189, 248, 0.14)",h.fill(),h.beginPath(),h.moveTo(J(w[0].t),Mt(w[0].drive));for(let K=1;K<w.length;K++)h.lineTo(J(w[K].t),Mt(w[K].drive));h.setLineDash([3,3]),h.strokeStyle="rgba(190, 205, 220, 0.6)",h.lineWidth=1.2,h.stroke(),h.setLineDash([])}let Y=.02;for(const K of w)Y=Math.max(Y,Math.abs(K.dv));Y*=1.1;const tt=V+B/2,mt=B/2;for(const K of w){const gt=Math.min(mt,Math.abs(K.dv)/Y*mt);h.fillStyle=K.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",h.fillRect(J(K.t)-.7,K.dv>=0?tt-gt:tt,1.4,Math.max(.5,gt))}h.font="9px ui-monospace, monospace",h.fillStyle="rgba(190, 214, 234, 0.55)",h.textAlign="left",h.fillText(pt.toFixed(1),H+2,C+8),h.fillText("v",H+2,C+A-2),h.fillText("Δv",H+2,V+9),h.textAlign="right",h.fillText("0",y-z-2,C+A-2),h.textAlign="left"}return{dirDebug:g,update(w,b,y){const D=performance.now()/1e3,H=v<0?1/60:Math.max(1e-4,Math.min(.25,D-v));v=D;const z=w.character,G={x:z.position.x,z:z.position.z},C=Math.hypot(z.velocity.x,z.velocity.z),{speed:A,raw:V}=M?rp(M,G,H,i):{speed:0,raw:0},B=op(x,A,H,D);B.drive=C,B.raw=V,B.busy=cp(w),M=G,x=A,p.push(B),p.length>e&&p.shift();const j=R(D);let J=0;for(const lt of j)J=Math.max(J,lt.speed);if(U={speed:A,drive:C,raw:V,dv:B.dv,accel:B.accel,peak:J,samples:j.length,windowS:t,busy:B.busy},g.update(w,b,y),_){T(j,D);const lt=B.dv>=0?"+":"";l.textContent=`v ${A.toFixed(2)} · 驱 ${C.toFixed(2)} · 峰 ${J.toFixed(2)} · Δv ${lt}${B.dv.toFixed(3)} · ${j.length} 帧`}},setEnabled:m,toggle(){return m(!_),_},enabled:()=>_,last:()=>({...U}),samples:()=>R(performance.now()/1e3).map(w=>({...w}))}}const dp=["剑盾","双剑","大剑","法杖","弓"],hp={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function up(n){return{update(t,e,i,a,s,o,r=!1){const c=t.character,l=c.position,d=c.velocity,f=t.combat,h=t.events.length>0?t.events[t.events.length-1]:null,u=At=>At.toFixed(2),g=At=>(At*180/Math.PI).toFixed(0),_=dp[yi.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),p="|".repeat(m)+".".repeat(10-m),x=t.dash,M=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,v=x.phase==="active"?`${x.kind}@${M.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,U=a.intents.aimActive?`(${u(a.intents.aimX)},${u(a.intents.aimZ)})`:"-",R=d.x*Math.sin(c.bodyYaw)+d.z*Math.cos(c.bodyYaw),T=d.x*Math.cos(c.bodyYaw)-d.z*Math.sin(c.bodyYaw),w=Math.abs(R)+Math.abs(T)+1e-6,b=Math.round(Math.abs(T)/w*100),y=`strafe ${b}%${R<-.05?" back":""}`,D=t.camera,H=`threat ${(D.threat*100).toFixed(0)}%  dist×${u(D.distanceScale)}  off (${u(D.offsetX)},${u(D.offsetZ)})  pitch +${u(D.pitchDelta)}°  n=${D.threatCount}`,z=o?u(o.attackBlend):"-",G=o==null?void 0:o.attackWeights,C=G?`gw ${u(G.gaitScale)}  lw ${u(G.attackLegWeight)}  spd ${u(G.driveSpeed)}`:"-",A=G?`${u(G.gaitScale)}/${u(G.attackLegWeight)}`:"-",V=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",B=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",j=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",J=o==null?void 0:o.hurt,lt=J?`hurt ${t.playerHurt.type}  部位h${u(J.hitHeight)}  脉冲p${u(J.pulse)}  上身${u(J.upperShift)}  重心${u(J.comShift)}  后坐${u(J.pelvisBack)}  屈膝${u(J.knee)}`:"-",pt=J?`${u(J.hitHeight)}/${u(J.pulse)}/${u(J.knee)}`:"-",Mt=o==null?void 0:o.ik,Y=Mt?`${Mt.active?"on":"off"} w${u(Mt.weight)} e${u(Mt.maxError)}`:"-",tt=t.playerLink,mt=`link ${tt.kind||"-"}  ${tt.phase}  prog ${u(tt.progress)}  win ${u(tt.linkWindow)}s  cd ${u(tt.cooldown)}s  hits ${tt.hitIds.length}  travel ${u(tt.travelled)}/${u(tt.travel)}m  id ${tt.id}`,K=`${tt.phase}/${tt.kind||"-"}/w${u(tt.linkWindow)}`,gt=a.lastGesture,Lt=gt?`${gt.button} ${gt.kind} ${gt.heldMs.toFixed(0)}ms d${gt.distance.toFixed(0)}px ${gt.angleDeg.toFixed(0)}° taps${gt.taps}`:"-",Ct=t.dummies.map(At=>`${At.id}:${hp[At.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${tt.phase}${tt.kind?`/${tt.kind}`:""} w${u(tt.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(l.x)},${u(l.y)},${u(l.z)})  vel (${u(d.x)},${u(d.y)},${u(d.z)})`,`face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  st${b}%  stick(${u(a.stickX)},${u(a.stickY)}) ${a.source}  str${u(c.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${v}  ab ${z}  gw/lw ${A}  land ${B}  ik ${Y}`,`aim ${U}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${pt}`,`dummies ${Ct}  atkCount ${t.dummyAttackCount}  cam ${(D.threat*100).toFixed(0)}% ×${u(D.distanceScale)}  ${j}  lk ${K}`,`event ${h?`${h.type} ${u(h.value)}`:"-"}  scale ${u(s.timeScale)}${s.paused?" [P]":""}  g ${Lt}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(l.x)}, ${u(l.y)}, ${u(l.z)})`,`vel  (${u(d.x)}, ${u(d.y)}, ${u(d.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${g(c.facing)}deg   atkBlend ${z}   ${C}   land ${V}`,lt,`ik ${Y}  clamped ${Mt?Mt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  (head-body ${g(c.headYaw-c.bodyYaw)})  ${y}`,`move (${u(a.intents.moveX)}, ${u(a.intents.moveZ)})  stick (${u(a.stickX)}, ${u(a.stickY)})  ${a.source}  aim ${U}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${M.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,mt,`camera ${H}  ${j}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Ct}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${h?`${h.type} ${u(h.value)}`:"-"}   scale ${u(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${Lt}`].join(`
`)}}}const Ia=["hud","motion","debug"],qc={hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}};function fp(n){var c;const t=Object.fromEntries(Ia.map(l=>[l,document.getElementById(`${l==="motion"?"motiondbg":l==="debug"?"debug":"hud"}-toggle`)])),e=Object.fromEntries(Ia.map(l=>[l,document.getElementById(l==="motion"?"motiondbg":l==="debug"?"debug-panel":"hud")]));let i={},a=null;function s(){var l,d,f;for(const h of Ia){const u=a===h,g=t[h],_=e[h];g&&(g.setAttribute("aria-expanded",String(u)),g.textContent=`${qc[h].short} ${u?"▾":"▸"}`,g.setAttribute("aria-label",`${u?"收起":"展开"}${qc[h].full}`)),_&&_.classList.toggle("is-open",u)}n.classList.toggle("is-compact",a!=="hud"),(l=i.motion)==null||l.setEnabled(a==="motion"),a==="debug"?(d=i.debug)==null||d.open():(f=i.debug)==null||f.close()}function o(l){a=a===l?null:l,s()}function r(){a!==null&&(a=null,s())}for(const l of Ia)(c=t[l])==null||c.addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),o(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(l){i=l,s()},toggle:o,closeAll:r,isOpen:l=>a===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Jr="170",pp=0,jc=1,mp=2,Ed=1,wd=2,Un=3,ei=0,We=1,Le=2,Qn=0,Xi=1,Kc=2,Jc=3,Qc=4,gp=5,gi=100,_p=101,xp=102,vp=103,Mp=104,yp=200,Sp=201,bp=202,Ep=203,tr=204,er=205,wp=206,Tp=207,Ap=208,Rp=209,Cp=210,Pp=211,Dp=212,Lp=213,Ip=214,nr=0,ir=1,ar=2,Yi=3,sr=4,or=5,rr=6,cr=7,Qr=0,kp=1,Up=2,ti=0,Fp=1,Np=2,zp=3,Op=4,Bp=5,Hp=6,Gp=7,Td=300,Zi=301,qi=302,lr=303,dr=304,Ls=306,hr=1e3,xi=1001,ur=1002,xn=1003,Vp=1004,ka=1005,En=1006,no=1007,vi=1008,Hn=1009,Ad=1010,Rd=1011,ba=1012,tc=1013,Si=1014,zn=1015,wa=1016,ec=1017,nc=1018,ji=1020,Cd=35902,Pd=1021,Dd=1022,_n=1023,Ld=1024,Id=1025,Wi=1026,Ki=1027,kd=1028,ic=1029,Ud=1030,ac=1031,sc=1033,cs=33776,ls=33777,ds=33778,hs=33779,fr=35840,pr=35841,mr=35842,gr=35843,_r=36196,xr=37492,vr=37496,Mr=37808,yr=37809,Sr=37810,br=37811,Er=37812,wr=37813,Tr=37814,Ar=37815,Rr=37816,Cr=37817,Pr=37818,Dr=37819,Lr=37820,Ir=37821,us=36492,kr=36494,Ur=36495,Fd=36283,Fr=36284,Nr=36285,zr=36286,Xp=3200,Wp=3201,Nd=0,$p=1,Kn="",nn="srgb",Qi="srgb-linear",Is="linear",ue="srgb",Ci=7680,tl=519,Yp=512,Zp=513,qp=514,zd=515,jp=516,Kp=517,Jp=518,Qp=519,el=35044,nl="300 es",On=2e3,Ts=2001;class ta{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fs=Math.PI/180,Or=180/Math.PI;function Ta(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ke[n&255]+ke[n>>8&255]+ke[n>>16&255]+ke[n>>24&255]+"-"+ke[t&255]+ke[t>>8&255]+"-"+ke[t>>16&15|64]+ke[t>>24&255]+"-"+ke[e&63|128]+ke[e>>8&255]+"-"+ke[e>>16&255]+ke[e>>24&255]+ke[i&255]+ke[i>>8&255]+ke[i>>16&255]+ke[i>>24&255]).toLowerCase()}function Xe(n,t,e){return Math.max(t,Math.min(e,n))}function tm(n,t){return(n%t+t)%t}function io(n,t,e){return(1-e)*n+e*t}function la(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ve(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class ne{constructor(t=0,e=0){ne.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Xe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qt{constructor(t,e,i,a,s,o,r,c,l){qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l)}set(t,e,i,a,s,o,r,c,l){const d=this.elements;return d[0]=t,d[1]=a,d[2]=r,d[3]=e,d[4]=s,d[5]=c,d[6]=i,d[7]=o,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],c=i[6],l=i[1],d=i[4],f=i[7],h=i[2],u=i[5],g=i[8],_=a[0],m=a[3],p=a[6],x=a[1],M=a[4],v=a[7],U=a[2],R=a[5],T=a[8];return s[0]=o*_+r*x+c*U,s[3]=o*m+r*M+c*R,s[6]=o*p+r*v+c*T,s[1]=l*_+d*x+f*U,s[4]=l*m+d*M+f*R,s[7]=l*p+d*v+f*T,s[2]=h*_+u*x+g*U,s[5]=h*m+u*M+g*R,s[8]=h*p+u*v+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8];return e*o*d-e*r*l-i*s*d+i*r*c+a*s*l-a*o*c}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],f=d*o-r*l,h=r*c-d*s,u=l*s-o*c,g=e*f+i*h+a*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(a*l-d*i)*_,t[2]=(r*i-a*o)*_,t[3]=h*_,t[4]=(d*e-a*c)*_,t[5]=(a*s-r*e)*_,t[6]=u*_,t[7]=(i*c-l*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*r)+o+t,-a*l,a*c,-a*(-l*o+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(ao.makeScale(t,e)),this}rotate(t){return this.premultiply(ao.makeRotation(-t)),this}translate(t,e){return this.premultiply(ao.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ao=new qt;function Od(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function As(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function em(){const n=As("canvas");return n.style.display="block",n}const il={};function ga(n){n in il||(il[n]=!0,console.warn(n))}function nm(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function im(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function am(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const se={enabled:!0,workingColorSpace:Qi,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ue&&(n.r=Bn(n.r),n.g=Bn(n.g),n.b=Bn(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ue&&(n.r=$i(n.r),n.g=$i(n.g),n.b=$i(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Kn?Is:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Bn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function $i(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const al=[.64,.33,.3,.6,.15,.06],sl=[.2126,.7152,.0722],ol=[.3127,.329],rl=new qt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cl=new qt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);se.define({[Qi]:{primaries:al,whitePoint:ol,transfer:Is,toXYZ:rl,fromXYZ:cl,luminanceCoefficients:sl,workingColorSpaceConfig:{unpackColorSpace:nn},outputColorSpaceConfig:{drawingBufferColorSpace:nn}},[nn]:{primaries:al,whitePoint:ol,transfer:ue,toXYZ:rl,fromXYZ:cl,luminanceCoefficients:sl,outputColorSpaceConfig:{drawingBufferColorSpace:nn}}});let Pi;class sm{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Pi===void 0&&(Pi=As("canvas")),Pi.width=t.width,Pi.height=t.height;const i=Pi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Pi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=As("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=Bn(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Bn(e[i]/255)*255):e[i]=Bn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let om=0;class Bd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:om++}),this.uuid=Ta(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(so(a[o].image)):s.push(so(a[o]))}else s=so(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function so(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?sm.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let rm=0;class $e extends ta{constructor(t=$e.DEFAULT_IMAGE,e=$e.DEFAULT_MAPPING,i=xi,a=xi,s=En,o=vi,r=_n,c=Hn,l=$e.DEFAULT_ANISOTROPY,d=Kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rm++}),this.uuid=Ta(),this.name="",this.source=new Bd(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new ne(0,0),this.repeat=new ne(1,1),this.center=new ne(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Td)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case hr:t.x=t.x-Math.floor(t.x);break;case xi:t.x=t.x<0?0:1;break;case ur:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case hr:t.y=t.y-Math.floor(t.y);break;case xi:t.y=t.y<0?0:1;break;case ur:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}$e.DEFAULT_IMAGE=null;$e.DEFAULT_MAPPING=Td;$e.DEFAULT_ANISOTROPY=1;class ve{constructor(t=0,e=0,i=0,a=1){ve.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const c=t.elements,l=c[0],d=c[4],f=c[8],h=c[1],u=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(d-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,v=(u+1)/2,U=(p+1)/2,R=(d+h)/4,T=(f+_)/4,w=(g+m)/4;return M>v&&M>U?M<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(M),a=R/i,s=T/i):v>U?v<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(v),i=R/a,s=w/a):U<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(U),i=T/s,a=w/s),this.set(i,a,s,e),this}let x=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(h-d)*(h-d));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(f-_)/x,this.z=(h-d)/x,this.w=Math.acos((l+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class cm extends ta{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:En,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new $e(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Bd(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends cm{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Hd extends $e{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=xn,this.minFilter=xn,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class lm extends $e{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=xn,this.minFilter=xn,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Aa{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let c=i[a+0],l=i[a+1],d=i[a+2],f=i[a+3];const h=s[o+0],u=s[o+1],g=s[o+2],_=s[o+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=f;return}if(r===1){t[e+0]=h,t[e+1]=u,t[e+2]=g,t[e+3]=_;return}if(f!==_||c!==h||l!==u||d!==g){let m=1-r;const p=c*h+l*u+d*g+f*_,x=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const U=Math.sqrt(M),R=Math.atan2(U,p*x);m=Math.sin(m*R)/U,r=Math.sin(r*R)/U}const v=r*x;if(c=c*m+h*v,l=l*m+u*v,d=d*m+g*v,f=f*m+_*v,m===1-r){const U=1/Math.sqrt(c*c+l*l+d*d+f*f);c*=U,l*=U,d*=U,f*=U}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],c=i[a+1],l=i[a+2],d=i[a+3],f=s[o],h=s[o+1],u=s[o+2],g=s[o+3];return t[e]=r*g+d*f+c*u-l*h,t[e+1]=c*g+d*h+l*f-r*u,t[e+2]=l*g+d*u+r*h-c*f,t[e+3]=d*g-r*f-c*h-l*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,c=Math.sin,l=r(i/2),d=r(a/2),f=r(s/2),h=c(i/2),u=c(a/2),g=c(s/2);switch(o){case"XYZ":this._x=h*d*f+l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f-h*u*g;break;case"YXZ":this._x=h*d*f+l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f+h*u*g;break;case"ZXY":this._x=h*d*f-l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f-h*u*g;break;case"ZYX":this._x=h*d*f-l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f+h*u*g;break;case"YZX":this._x=h*d*f+l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f-h*u*g;break;case"XZY":this._x=h*d*f-l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f+h*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],c=e[9],l=e[2],d=e[6],f=e[10],h=i+r+f;if(h>0){const u=.5/Math.sqrt(h+1);this._w=.25/u,this._x=(d-c)*u,this._y=(s-l)*u,this._z=(o-a)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(d-c)/u,this._x=.25*u,this._y=(a+o)/u,this._z=(s+l)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(s-l)/u,this._x=(a+o)/u,this._y=.25*u,this._z=(c+d)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-a)/u,this._x=(s+l)/u,this._y=(c+d)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xe(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,c=e._y,l=e._z,d=e._w;return this._x=i*d+o*r+a*l-s*c,this._y=a*d+o*c+s*r-i*l,this._z=s*d+o*l+i*c-a*r,this._w=o*d-i*r-a*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const c=1-r*r;if(c<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*a+e*this._y,this._z=u*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,r),f=Math.sin((1-e)*d)/l,h=Math.sin(e*d)/l;return this._w=o*f+this._w*h,this._x=i*f+this._x*h,this._y=a*f+this._y*h,this._z=s*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class q{constructor(t=0,e=0,i=0){q.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ll.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ll.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,c=t.w,l=2*(o*a-r*i),d=2*(r*e-s*a),f=2*(s*i-o*e);return this.x=e+c*l+o*f-r*d,this.y=i+c*d+r*l-s*f,this.z=a+c*f+s*d-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,c=e.z;return this.x=a*c-s*r,this.y=s*o-i*c,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return oo.copy(this).projectOnVector(t),this.sub(oo)}reflect(t){return this.sub(oo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Xe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const oo=new q,ll=new Aa;class Ra{constructor(t=new q(1/0,1/0,1/0),e=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(fn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(fn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=fn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,fn):fn.fromBufferAttribute(s,o),fn.applyMatrix4(t.matrixWorld),this.expandByPoint(fn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ua.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ua.copy(i.boundingBox)),Ua.applyMatrix4(t.matrixWorld),this.union(Ua)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,fn),fn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(da),Fa.subVectors(this.max,da),Di.subVectors(t.a,da),Li.subVectors(t.b,da),Ii.subVectors(t.c,da),Wn.subVectors(Li,Di),$n.subVectors(Ii,Li),oi.subVectors(Di,Ii);let e=[0,-Wn.z,Wn.y,0,-$n.z,$n.y,0,-oi.z,oi.y,Wn.z,0,-Wn.x,$n.z,0,-$n.x,oi.z,0,-oi.x,-Wn.y,Wn.x,0,-$n.y,$n.x,0,-oi.y,oi.x,0];return!ro(e,Di,Li,Ii,Fa)||(e=[1,0,0,0,1,0,0,0,1],!ro(e,Di,Li,Ii,Fa))?!1:(Na.crossVectors(Wn,$n),e=[Na.x,Na.y,Na.z],ro(e,Di,Li,Ii,Fa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,fn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(fn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Pn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Pn=[new q,new q,new q,new q,new q,new q,new q,new q],fn=new q,Ua=new Ra,Di=new q,Li=new q,Ii=new q,Wn=new q,$n=new q,oi=new q,da=new q,Fa=new q,Na=new q,ri=new q;function ro(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){ri.fromArray(n,s);const r=a.x*Math.abs(ri.x)+a.y*Math.abs(ri.y)+a.z*Math.abs(ri.z),c=t.dot(ri),l=e.dot(ri),d=i.dot(ri);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>r)return!1}return!0}const dm=new Ra,ha=new q,co=new q;class ks{constructor(t=new q,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):dm.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ha.subVectors(t,this.center);const e=ha.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(ha,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(co.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ha.copy(t.center).add(co)),this.expandByPoint(ha.copy(t.center).sub(co))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Dn=new q,lo=new q,za=new q,Yn=new q,ho=new q,Oa=new q,uo=new q;class oc{constructor(t=new q,e=new q(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Dn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Dn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Dn.copy(this.origin).addScaledVector(this.direction,e),Dn.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){lo.copy(t).add(e).multiplyScalar(.5),za.copy(e).sub(t).normalize(),Yn.copy(this.origin).sub(lo);const s=t.distanceTo(e)*.5,o=-this.direction.dot(za),r=Yn.dot(this.direction),c=-Yn.dot(za),l=Yn.lengthSq(),d=Math.abs(1-o*o);let f,h,u,g;if(d>0)if(f=o*c-r,h=o*r-c,g=s*d,f>=0)if(h>=-g)if(h<=g){const _=1/d;f*=_,h*=_,u=f*(f+o*h+2*r)+h*(o*f+h+2*c)+l}else h=s,f=Math.max(0,-(o*h+r)),u=-f*f+h*(h+2*c)+l;else h=-s,f=Math.max(0,-(o*h+r)),u=-f*f+h*(h+2*c)+l;else h<=-g?(f=Math.max(0,-(-o*s+r)),h=f>0?-s:Math.min(Math.max(-s,-c),s),u=-f*f+h*(h+2*c)+l):h<=g?(f=0,h=Math.min(Math.max(-s,-c),s),u=h*(h+2*c)+l):(f=Math.max(0,-(o*s+r)),h=f>0?s:Math.min(Math.max(-s,-c),s),u=-f*f+h*(h+2*c)+l);else h=o>0?-s:s,f=Math.max(0,-(o*h+r)),u=-f*f+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,f),a&&a.copy(lo).addScaledVector(za,h),u}intersectSphere(t,e){Dn.subVectors(t.center,this.origin);const i=Dn.dot(this.direction),a=Dn.dot(Dn)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,c=i+o;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,c;const l=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,a=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,a=(t.min.x-h.x)*l),d>=0?(s=(t.min.y-h.y)*d,o=(t.max.y-h.y)*d):(s=(t.max.y-h.y)*d,o=(t.min.y-h.y)*d),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),f>=0?(r=(t.min.z-h.z)*f,c=(t.max.z-h.z)*f):(r=(t.max.z-h.z)*f,c=(t.min.z-h.z)*f),i>c||r>a)||((r>i||i!==i)&&(i=r),(c<a||a!==a)&&(a=c),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Dn)!==null}intersectTriangle(t,e,i,a,s){ho.subVectors(e,t),Oa.subVectors(i,t),uo.crossVectors(ho,Oa);let o=this.direction.dot(uo),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Yn.subVectors(this.origin,t);const c=r*this.direction.dot(Oa.crossVectors(Yn,Oa));if(c<0)return null;const l=r*this.direction.dot(ho.cross(Yn));if(l<0||c+l>o)return null;const d=-r*Yn.dot(uo);return d<0?null:this.at(d/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ge{constructor(t,e,i,a,s,o,r,c,l,d,f,h,u,g,_,m){ge.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l,d,f,h,u,g,_,m)}set(t,e,i,a,s,o,r,c,l,d,f,h,u,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=c,p[2]=l,p[6]=d,p[10]=f,p[14]=h,p[3]=u,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ge().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/ki.setFromMatrixColumn(t,0).length(),s=1/ki.setFromMatrixColumn(t,1).length(),o=1/ki.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),c=Math.cos(a),l=Math.sin(a),d=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const h=o*d,u=o*f,g=r*d,_=r*f;e[0]=c*d,e[4]=-c*f,e[8]=l,e[1]=u+g*l,e[5]=h-_*l,e[9]=-r*c,e[2]=_-h*l,e[6]=g+u*l,e[10]=o*c}else if(t.order==="YXZ"){const h=c*d,u=c*f,g=l*d,_=l*f;e[0]=h+_*r,e[4]=g*r-u,e[8]=o*l,e[1]=o*f,e[5]=o*d,e[9]=-r,e[2]=u*r-g,e[6]=_+h*r,e[10]=o*c}else if(t.order==="ZXY"){const h=c*d,u=c*f,g=l*d,_=l*f;e[0]=h-_*r,e[4]=-o*f,e[8]=g+u*r,e[1]=u+g*r,e[5]=o*d,e[9]=_-h*r,e[2]=-o*l,e[6]=r,e[10]=o*c}else if(t.order==="ZYX"){const h=o*d,u=o*f,g=r*d,_=r*f;e[0]=c*d,e[4]=g*l-u,e[8]=h*l+_,e[1]=c*f,e[5]=_*l+h,e[9]=u*l-g,e[2]=-l,e[6]=r*c,e[10]=o*c}else if(t.order==="YZX"){const h=o*c,u=o*l,g=r*c,_=r*l;e[0]=c*d,e[4]=_-h*f,e[8]=g*f+u,e[1]=f,e[5]=o*d,e[9]=-r*d,e[2]=-l*d,e[6]=u*f+g,e[10]=h-_*f}else if(t.order==="XZY"){const h=o*c,u=o*l,g=r*c,_=r*l;e[0]=c*d,e[4]=-f,e[8]=l*d,e[1]=h*f+_,e[5]=o*d,e[9]=u*f-g,e[2]=g*f-u,e[6]=r*d,e[10]=_*f+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(hm,t,um)}lookAt(t,e,i){const a=this.elements;return Ke.subVectors(t,e),Ke.lengthSq()===0&&(Ke.z=1),Ke.normalize(),Zn.crossVectors(i,Ke),Zn.lengthSq()===0&&(Math.abs(i.z)===1?Ke.x+=1e-4:Ke.z+=1e-4,Ke.normalize(),Zn.crossVectors(i,Ke)),Zn.normalize(),Ba.crossVectors(Ke,Zn),a[0]=Zn.x,a[4]=Ba.x,a[8]=Ke.x,a[1]=Zn.y,a[5]=Ba.y,a[9]=Ke.y,a[2]=Zn.z,a[6]=Ba.z,a[10]=Ke.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],c=i[8],l=i[12],d=i[1],f=i[5],h=i[9],u=i[13],g=i[2],_=i[6],m=i[10],p=i[14],x=i[3],M=i[7],v=i[11],U=i[15],R=a[0],T=a[4],w=a[8],b=a[12],y=a[1],D=a[5],H=a[9],z=a[13],G=a[2],C=a[6],A=a[10],V=a[14],B=a[3],j=a[7],J=a[11],lt=a[15];return s[0]=o*R+r*y+c*G+l*B,s[4]=o*T+r*D+c*C+l*j,s[8]=o*w+r*H+c*A+l*J,s[12]=o*b+r*z+c*V+l*lt,s[1]=d*R+f*y+h*G+u*B,s[5]=d*T+f*D+h*C+u*j,s[9]=d*w+f*H+h*A+u*J,s[13]=d*b+f*z+h*V+u*lt,s[2]=g*R+_*y+m*G+p*B,s[6]=g*T+_*D+m*C+p*j,s[10]=g*w+_*H+m*A+p*J,s[14]=g*b+_*z+m*V+p*lt,s[3]=x*R+M*y+v*G+U*B,s[7]=x*T+M*D+v*C+U*j,s[11]=x*w+M*H+v*A+U*J,s[15]=x*b+M*z+v*V+U*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],c=t[9],l=t[13],d=t[2],f=t[6],h=t[10],u=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+s*c*f-a*l*f-s*r*h+i*l*h+a*r*u-i*c*u)+_*(+e*c*u-e*l*h+s*o*h-a*o*u+a*l*d-s*c*d)+m*(+e*l*f-e*r*u-s*o*f+i*o*u+s*r*d-i*l*d)+p*(-a*r*d-e*c*f+e*r*h+a*o*f-i*o*h+i*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],f=t[9],h=t[10],u=t[11],g=t[12],_=t[13],m=t[14],p=t[15],x=f*m*l-_*h*l+_*c*u-r*m*u-f*c*p+r*h*p,M=g*h*l-d*m*l-g*c*u+o*m*u+d*c*p-o*h*p,v=d*_*l-g*f*l+g*r*u-o*_*u-d*r*p+o*f*p,U=g*f*c-d*_*c-g*r*h+o*_*h+d*r*m-o*f*m,R=e*x+i*M+a*v+s*U;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/R;return t[0]=x*T,t[1]=(_*h*s-f*m*s-_*a*u+i*m*u+f*a*p-i*h*p)*T,t[2]=(r*m*s-_*c*s+_*a*l-i*m*l-r*a*p+i*c*p)*T,t[3]=(f*c*s-r*h*s-f*a*l+i*h*l+r*a*u-i*c*u)*T,t[4]=M*T,t[5]=(d*m*s-g*h*s+g*a*u-e*m*u-d*a*p+e*h*p)*T,t[6]=(g*c*s-o*m*s-g*a*l+e*m*l+o*a*p-e*c*p)*T,t[7]=(o*h*s-d*c*s+d*a*l-e*h*l-o*a*u+e*c*u)*T,t[8]=v*T,t[9]=(g*f*s-d*_*s-g*i*u+e*_*u+d*i*p-e*f*p)*T,t[10]=(o*_*s-g*r*s+g*i*l-e*_*l-o*i*p+e*r*p)*T,t[11]=(d*r*s-o*f*s-d*i*l+e*f*l+o*i*u-e*r*u)*T,t[12]=U*T,t[13]=(d*_*a-g*f*a+g*i*h-e*_*h-d*i*m+e*f*m)*T,t[14]=(g*r*a-o*_*a-g*i*c+e*_*c+o*i*m-e*r*m)*T,t[15]=(o*f*a-d*r*a+d*i*c-e*f*c-o*i*h+e*r*h)*T,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,c=t.z,l=s*o,d=s*r;return this.set(l*o+i,l*r-a*c,l*c+a*r,0,l*r+a*c,d*r+i,d*c-a*o,0,l*c-a*r,d*c+a*o,s*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,c=e._w,l=s+s,d=o+o,f=r+r,h=s*l,u=s*d,g=s*f,_=o*d,m=o*f,p=r*f,x=c*l,M=c*d,v=c*f,U=i.x,R=i.y,T=i.z;return a[0]=(1-(_+p))*U,a[1]=(u+v)*U,a[2]=(g-M)*U,a[3]=0,a[4]=(u-v)*R,a[5]=(1-(h+p))*R,a[6]=(m+x)*R,a[7]=0,a[8]=(g+M)*T,a[9]=(m-x)*T,a[10]=(1-(h+_))*T,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=ki.set(a[0],a[1],a[2]).length();const o=ki.set(a[4],a[5],a[6]).length(),r=ki.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],pn.copy(this);const l=1/s,d=1/o,f=1/r;return pn.elements[0]*=l,pn.elements[1]*=l,pn.elements[2]*=l,pn.elements[4]*=d,pn.elements[5]*=d,pn.elements[6]*=d,pn.elements[8]*=f,pn.elements[9]*=f,pn.elements[10]*=f,e.setFromRotationMatrix(pn),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=On){const c=this.elements,l=2*s/(e-t),d=2*s/(i-a),f=(e+t)/(e-t),h=(i+a)/(i-a);let u,g;if(r===On)u=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(r===Ts)u=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=u,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=On){const c=this.elements,l=1/(e-t),d=1/(i-a),f=1/(o-s),h=(e+t)*l,u=(i+a)*d;let g,_;if(r===On)g=(o+s)*f,_=-2*f;else if(r===Ts)g=s*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-u,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ki=new q,pn=new ge,hm=new q(0,0,0),um=new q(1,1,1),Zn=new q,Ba=new q,Ke=new q,dl=new ge,hl=new Aa;class Tn{constructor(t=0,e=0,i=0,a=Tn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],c=a[1],l=a[5],d=a[9],f=a[2],h=a[6],u=a[10];switch(e){case"XYZ":this._y=Math.asin(Xe(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-d,u),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Xe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Xe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,u),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Xe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-Xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-d,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return dl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(dl,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return hl.setFromEuler(this),this.setFromQuaternion(hl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tn.DEFAULT_ORDER="XYZ";class rc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let fm=0;const ul=new q,Ui=new Aa,Ln=new ge,Ha=new q,ua=new q,pm=new q,mm=new Aa,fl=new q(1,0,0),pl=new q(0,1,0),ml=new q(0,0,1),gl={type:"added"},gm={type:"removed"},Fi={type:"childadded",child:null},fo={type:"childremoved",child:null};class Ee extends ta{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fm++}),this.uuid=Ta(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ee.DEFAULT_UP.clone();const t=new q,e=new Tn,i=new Aa,a=new q(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new ge},normalMatrix:{value:new qt}}),this.matrix=new ge,this.matrixWorld=new ge,this.matrixAutoUpdate=Ee.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ui.setFromAxisAngle(t,e),this.quaternion.multiply(Ui),this}rotateOnWorldAxis(t,e){return Ui.setFromAxisAngle(t,e),this.quaternion.premultiply(Ui),this}rotateX(t){return this.rotateOnAxis(fl,t)}rotateY(t){return this.rotateOnAxis(pl,t)}rotateZ(t){return this.rotateOnAxis(ml,t)}translateOnAxis(t,e){return ul.copy(t).applyQuaternion(this.quaternion),this.position.add(ul.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(fl,t)}translateY(t){return this.translateOnAxis(pl,t)}translateZ(t){return this.translateOnAxis(ml,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Ha.copy(t):Ha.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),ua.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(ua,Ha,this.up):Ln.lookAt(Ha,ua,this.up),this.quaternion.setFromRotationMatrix(Ln),a&&(Ln.extractRotation(a.matrixWorld),Ui.setFromRotationMatrix(Ln),this.quaternion.premultiply(Ui.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(gl),Fi.child=t,this.dispatchEvent(Fi),Fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(gm),fo.child=t,this.dispatchEvent(fo),fo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ln.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ln),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(gl),Fi.child=t,this.dispatchEvent(Fi),Fi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ua,t,pm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ua,mm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const f=c[l];s(t.shapes,f)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(s(t.materials,this.material[c]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];a.animations.push(s(t.animations,c))}}if(e){const r=o(t.geometries),c=o(t.materials),l=o(t.textures),d=o(t.images),f=o(t.shapes),h=o(t.skeletons),u=o(t.animations),g=o(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=a,i;function o(r){const c=[];for(const l in r){const d=r[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}Ee.DEFAULT_UP=new q(0,1,0);Ee.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const mn=new q,In=new q,po=new q,kn=new q,Ni=new q,zi=new q,_l=new q,mo=new q,go=new q,_o=new q,xo=new ve,vo=new ve,Mo=new ve;class rn{constructor(t=new q,e=new q,i=new q){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),mn.subVectors(t,e),a.cross(mn);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){mn.subVectors(a,e),In.subVectors(i,e),po.subVectors(t,e);const o=mn.dot(mn),r=mn.dot(In),c=mn.dot(po),l=In.dot(In),d=In.dot(po),f=o*l-r*r;if(f===0)return s.set(0,0,0),null;const h=1/f,u=(l*c-r*d)*h,g=(o*d-r*c)*h;return s.set(1-u-g,g,u)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,kn)===null?!1:kn.x>=0&&kn.y>=0&&kn.x+kn.y<=1}static getInterpolation(t,e,i,a,s,o,r,c){return this.getBarycoord(t,e,i,a,kn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,kn.x),c.addScaledVector(o,kn.y),c.addScaledVector(r,kn.z),c)}static getInterpolatedAttribute(t,e,i,a,s,o){return xo.setScalar(0),vo.setScalar(0),Mo.setScalar(0),xo.fromBufferAttribute(t,e),vo.fromBufferAttribute(t,i),Mo.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(xo,s.x),o.addScaledVector(vo,s.y),o.addScaledVector(Mo,s.z),o}static isFrontFacing(t,e,i,a){return mn.subVectors(i,e),In.subVectors(t,e),mn.cross(In).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return mn.subVectors(this.c,this.b),In.subVectors(this.a,this.b),mn.cross(In).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return rn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return rn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return rn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return rn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return rn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;Ni.subVectors(a,i),zi.subVectors(s,i),mo.subVectors(t,i);const c=Ni.dot(mo),l=zi.dot(mo);if(c<=0&&l<=0)return e.copy(i);go.subVectors(t,a);const d=Ni.dot(go),f=zi.dot(go);if(d>=0&&f<=d)return e.copy(a);const h=c*f-d*l;if(h<=0&&c>=0&&d<=0)return o=c/(c-d),e.copy(i).addScaledVector(Ni,o);_o.subVectors(t,s);const u=Ni.dot(_o),g=zi.dot(_o);if(g>=0&&u<=g)return e.copy(s);const _=u*l-c*g;if(_<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(i).addScaledVector(zi,r);const m=d*g-u*f;if(m<=0&&f-d>=0&&u-g>=0)return _l.subVectors(s,a),r=(f-d)/(f-d+(u-g)),e.copy(a).addScaledVector(_l,r);const p=1/(m+_+h);return o=_*p,r=h*p,e.copy(i).addScaledVector(Ni,o).addScaledVector(zi,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Gd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qn={h:0,s:0,l:0},Ga={h:0,s:0,l:0};function yo(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Wt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=nn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=se.workingColorSpace){return this.r=t,this.g=e,this.b=i,se.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=se.workingColorSpace){if(t=tm(t,1),e=Xe(e,0,1),i=Xe(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=yo(o,s,t+1/3),this.g=yo(o,s,t),this.b=yo(o,s,t-1/3)}return se.toWorkingColorSpace(this,a),this}setStyle(t,e=nn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=nn){const i=Gd[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Bn(t.r),this.g=Bn(t.g),this.b=Bn(t.b),this}copyLinearToSRGB(t){return this.r=$i(t.r),this.g=$i(t.g),this.b=$i(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=nn){return se.fromWorkingColorSpace(Ue.copy(this),t),Math.round(Xe(Ue.r*255,0,255))*65536+Math.round(Xe(Ue.g*255,0,255))*256+Math.round(Xe(Ue.b*255,0,255))}getHexString(t=nn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.fromWorkingColorSpace(Ue.copy(this),e);const i=Ue.r,a=Ue.g,s=Ue.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let c,l;const d=(r+o)/2;if(r===o)c=0,l=0;else{const f=o-r;switch(l=d<=.5?f/(o+r):f/(2-o-r),o){case i:c=(a-s)/f+(a<s?6:0);break;case a:c=(s-i)/f+2;break;case s:c=(i-a)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=se.workingColorSpace){return se.fromWorkingColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=nn){se.fromWorkingColorSpace(Ue.copy(this),t);const e=Ue.r,i=Ue.g,a=Ue.b;return t!==nn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(qn),this.setHSL(qn.h+t,qn.s+e,qn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(qn),t.getHSL(Ga);const i=io(qn.h,Ga.h,e),a=io(qn.s,Ga.s,e),s=io(qn.l,Ga.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new Wt;Wt.NAMES=Gd;let _m=0;class ea extends ta{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_m++}),this.uuid=Ta(),this.name="",this.blending=Xi,this.side=ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tr,this.blendDst=er,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Wt(0,0,0),this.blendAlpha=0,this.depthFunc=Yi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ci,this.stencilZFail=Ci,this.stencilZPass=Ci,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Xi&&(i.blending=this.blending),this.side!==ei&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==tr&&(i.blendSrc=this.blendSrc),this.blendDst!==er&&(i.blendDst=this.blendDst),this.blendEquation!==gi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Yi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==tl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ci&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ci&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ci&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const c=s[r];delete c.metadata,o.push(c)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class cn extends ea{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=Qr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const be=new q,Va=new ne;class Ye{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=el,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Va.fromBufferAttribute(this,e),Va.applyMatrix3(t),this.setXY(e,Va.x,Va.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)be.fromBufferAttribute(this,e),be.applyMatrix3(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=la(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ve(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=la(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=la(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=la(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=la(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),i=Ve(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),i=Ve(i,this.array),a=Ve(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),i=Ve(i,this.array),a=Ve(a,this.array),s=Ve(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==el&&(t.usage=this.usage),t}}class Vd extends Ye{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Xd extends Ye{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Me extends Ye{constructor(t,e,i){super(new Float32Array(t),e,i)}}let xm=0;const tn=new ge,So=new Ee,Oi=new q,Je=new Ra,fa=new Ra,Ce=new q;class He extends ta{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=Ta(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Od(t)?Xd:Vd)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new qt().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return tn.makeRotationFromQuaternion(t),this.applyMatrix4(tn),this}rotateX(t){return tn.makeRotationX(t),this.applyMatrix4(tn),this}rotateY(t){return tn.makeRotationY(t),this.applyMatrix4(tn),this}rotateZ(t){return tn.makeRotationZ(t),this.applyMatrix4(tn),this}translate(t,e,i){return tn.makeTranslation(t,e,i),this.applyMatrix4(tn),this}scale(t,e,i){return tn.makeScale(t,e,i),this.applyMatrix4(tn),this}lookAt(t){return So.lookAt(t),So.updateMatrix(),this.applyMatrix4(So.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Oi).negate(),this.translate(Oi.x,Oi.y,Oi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Me(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ra);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];Je.setFromBufferAttribute(s),this.morphTargetsRelative?(Ce.addVectors(this.boundingBox.min,Je.min),this.boundingBox.expandByPoint(Ce),Ce.addVectors(this.boundingBox.max,Je.max),this.boundingBox.expandByPoint(Ce)):(this.boundingBox.expandByPoint(Je.min),this.boundingBox.expandByPoint(Je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ks);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new q,1/0);return}if(t){const i=this.boundingSphere.center;if(Je.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];fa.setFromBufferAttribute(r),this.morphTargetsRelative?(Ce.addVectors(Je.min,fa.min),Je.expandByPoint(Ce),Ce.addVectors(Je.max,fa.max),Je.expandByPoint(Ce)):(Je.expandByPoint(fa.min),Je.expandByPoint(fa.max))}Je.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)Ce.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(Ce));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],c=this.morphTargetsRelative;for(let l=0,d=r.count;l<d;l++)Ce.fromBufferAttribute(r,l),c&&(Oi.fromBufferAttribute(t,l),Ce.add(Oi)),a=Math.max(a,i.distanceToSquared(Ce))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ye(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],c=[];for(let w=0;w<i.count;w++)r[w]=new q,c[w]=new q;const l=new q,d=new q,f=new q,h=new ne,u=new ne,g=new ne,_=new q,m=new q;function p(w,b,y){l.fromBufferAttribute(i,w),d.fromBufferAttribute(i,b),f.fromBufferAttribute(i,y),h.fromBufferAttribute(s,w),u.fromBufferAttribute(s,b),g.fromBufferAttribute(s,y),d.sub(l),f.sub(l),u.sub(h),g.sub(h);const D=1/(u.x*g.y-g.x*u.y);isFinite(D)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(D),m.copy(f).multiplyScalar(u.x).addScaledVector(d,-g.x).multiplyScalar(D),r[w].add(_),r[b].add(_),r[y].add(_),c[w].add(m),c[b].add(m),c[y].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let w=0,b=x.length;w<b;++w){const y=x[w],D=y.start,H=y.count;for(let z=D,G=D+H;z<G;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const M=new q,v=new q,U=new q,R=new q;function T(w){U.fromBufferAttribute(a,w),R.copy(U);const b=r[w];M.copy(b),M.sub(U.multiplyScalar(U.dot(b))).normalize(),v.crossVectors(R,b);const D=v.dot(c[w])<0?-1:1;o.setXYZW(w,M.x,M.y,M.z,D)}for(let w=0,b=x.length;w<b;++w){const y=x[w],D=y.start,H=y.count;for(let z=D,G=D+H;z<G;z+=3)T(t.getX(z+0)),T(t.getX(z+1)),T(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ye(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,u=i.count;h<u;h++)i.setXYZ(h,0,0,0);const a=new q,s=new q,o=new q,r=new q,c=new q,l=new q,d=new q,f=new q;if(t)for(let h=0,u=t.count;h<u;h+=3){const g=t.getX(h+0),_=t.getX(h+1),m=t.getX(h+2);a.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),d.subVectors(o,s),f.subVectors(a,s),d.cross(f),r.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),r.add(d),c.add(d),l.add(d),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,u=e.count;h<u;h+=3)a.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),d.subVectors(o,s),f.subVectors(a,s),d.cross(f),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ce.fromBufferAttribute(t,e),Ce.normalize(),t.setXYZ(e,Ce.x,Ce.y,Ce.z)}toNonIndexed(){function t(r,c){const l=r.array,d=r.itemSize,f=r.normalized,h=new l.constructor(c.length*d);let u=0,g=0;for(let _=0,m=c.length;_<m;_++){r.isInterleavedBufferAttribute?u=c[_]*r.data.stride+r.offset:u=c[_]*d;for(let p=0;p<d;p++)h[g++]=l[u++]}return new Ye(h,d,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new He,i=this.index.array,a=this.attributes;for(const r in a){const c=a[r],l=t(c,i);e.setAttribute(r,l)}const s=this.morphAttributes;for(const r in s){const c=[],l=s[r];for(let d=0,f=l.length;d<f;d++){const h=l[d],u=t(h,i);c.push(u)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,c=o.length;r<c;r++){const l=o[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const a={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let f=0,h=l.length;f<h;f++){const u=l[f];d.push(u.toJSON(t.data))}d.length>0&&(a[c]=d,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const l in a){const d=a[l];this.setAttribute(l,d.clone(e))}const s=t.morphAttributes;for(const l in s){const d=[],f=s[l];for(let h=0,u=f.length;h<u;h++)d.push(f[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,d=o.length;l<d;l++){const f=o[l];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const xl=new ge,ci=new oc,Xa=new ks,vl=new q,Wa=new q,$a=new q,Ya=new q,bo=new q,Za=new q,Ml=new q,qa=new q;class pe extends Ee{constructor(t=new He,e=new cn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){Za.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const d=r[c],f=s[c];d!==0&&(bo.fromBufferAttribute(f,t),o?Za.addScaledVector(bo,d):Za.addScaledVector(bo.sub(e),d))}e.add(Za)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Xa.copy(i.boundingSphere),Xa.applyMatrix4(s),ci.copy(t.ray).recast(t.near),!(Xa.containsPoint(ci.origin)===!1&&(ci.intersectSphere(Xa,vl)===null||ci.origin.distanceToSquared(vl)>(t.far-t.near)**2))&&(xl.copy(s).invert(),ci.copy(t.ray).applyMatrix4(xl),!(i.boundingBox!==null&&ci.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ci)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,c=s.attributes.position,l=s.attributes.uv,d=s.attributes.uv1,f=s.attributes.normal,h=s.groups,u=s.drawRange;if(r!==null)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=o[m.materialIndex],x=Math.max(m.start,u.start),M=Math.min(r.count,Math.min(m.start+m.count,u.start+u.count));for(let v=x,U=M;v<U;v+=3){const R=r.getX(v),T=r.getX(v+1),w=r.getX(v+2);a=ja(this,p,t,i,l,d,f,R,T,w),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,u.start),_=Math.min(r.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){const x=r.getX(m),M=r.getX(m+1),v=r.getX(m+2);a=ja(this,o,t,i,l,d,f,x,M,v),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=o[m.materialIndex],x=Math.max(m.start,u.start),M=Math.min(c.count,Math.min(m.start+m.count,u.start+u.count));for(let v=x,U=M;v<U;v+=3){const R=v,T=v+1,w=v+2;a=ja(this,p,t,i,l,d,f,R,T,w),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,u.start),_=Math.min(c.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){const x=m,M=m+1,v=m+2;a=ja(this,o,t,i,l,d,f,x,M,v),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}}}function vm(n,t,e,i,a,s,o,r){let c;if(t.side===We?c=i.intersectTriangle(o,s,a,!0,r):c=i.intersectTriangle(a,s,o,t.side===ei,r),c===null)return null;qa.copy(r),qa.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(qa);return l<e.near||l>e.far?null:{distance:l,point:qa.clone(),object:n}}function ja(n,t,e,i,a,s,o,r,c,l){n.getVertexPosition(r,Wa),n.getVertexPosition(c,$a),n.getVertexPosition(l,Ya);const d=vm(n,t,e,i,Wa,$a,Ya,Ml);if(d){const f=new q;rn.getBarycoord(Ml,Wa,$a,Ya,f),a&&(d.uv=rn.getInterpolatedAttribute(a,r,c,l,f,new ne)),s&&(d.uv1=rn.getInterpolatedAttribute(s,r,c,l,f,new ne)),o&&(d.normal=rn.getInterpolatedAttribute(o,r,c,l,f,new q),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:r,b:c,c:l,normal:new q,materialIndex:0};rn.getNormal(Wa,$a,Ya,h.normal),d.face=h,d.barycoord=f}return d}class An extends He{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],d=[],f=[];let h=0,u=0;g("z","y","x",-1,-1,i,e,t,o,s,0),g("z","y","x",1,-1,i,e,-t,o,s,1),g("x","z","y",1,1,t,i,e,a,o,2),g("x","z","y",1,-1,t,i,-e,a,o,3),g("x","y","z",1,-1,t,e,i,a,s,4),g("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(c),this.setAttribute("position",new Me(l,3)),this.setAttribute("normal",new Me(d,3)),this.setAttribute("uv",new Me(f,2));function g(_,m,p,x,M,v,U,R,T,w,b){const y=v/T,D=U/w,H=v/2,z=U/2,G=R/2,C=T+1,A=w+1;let V=0,B=0;const j=new q;for(let J=0;J<A;J++){const lt=J*D-z;for(let pt=0;pt<C;pt++){const Mt=pt*y-H;j[_]=Mt*x,j[m]=lt*M,j[p]=G,l.push(j.x,j.y,j.z),j[_]=0,j[m]=0,j[p]=R>0?1:-1,d.push(j.x,j.y,j.z),f.push(pt/T),f.push(1-J/w),V+=1}}for(let J=0;J<w;J++)for(let lt=0;lt<T;lt++){const pt=h+lt+C*J,Mt=h+lt+C*(J+1),Y=h+(lt+1)+C*(J+1),tt=h+(lt+1)+C*J;c.push(pt,Mt,tt),c.push(Mt,Y,tt),B+=6}r.addGroup(u,B,b),u+=B,h+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new An(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ji(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function Oe(n){const t={};for(let e=0;e<n.length;e++){const i=Ji(n[e]);for(const a in i)t[a]=i[a]}return t}function Mm(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Wd(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:se.workingColorSpace}const ym={clone:Ji,merge:Oe};var Sm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,bm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ni extends ea{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Sm,this.fragmentShader=bm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ji(t.uniforms),this.uniformsGroups=Mm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class $d extends Ee{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ge,this.projectionMatrix=new ge,this.projectionMatrixInverse=new ge,this.coordinateSystem=On}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const jn=new q,yl=new ne,Sl=new ne;class an extends $d{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Or*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(fs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Or*2*Math.atan(Math.tan(fs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(jn.x,jn.y).multiplyScalar(-t/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(jn.x,jn.y).multiplyScalar(-t/jn.z)}getViewSize(t,e){return this.getViewBounds(t,yl,Sl),e.subVectors(Sl,yl)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(fs*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*a/c,e-=o.offsetY*i/l,a*=o.width/c,i*=o.height/l}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Bi=-90,Hi=1;class Em extends Ee{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new an(Bi,Hi,t,e);a.layers=this.layers,this.add(a);const s=new an(Bi,Hi,t,e);s.layers=this.layers,this.add(s);const o=new an(Bi,Hi,t,e);o.layers=this.layers,this.add(o);const r=new an(Bi,Hi,t,e);r.layers=this.layers,this.add(r);const c=new an(Bi,Hi,t,e);c.layers=this.layers,this.add(c);const l=new an(Bi,Hi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,c]=e;for(const l of e)this.remove(l);if(t===On)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ts)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,c,l,d]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,c),t.setRenderTarget(i,4,a),t.render(e,l),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,a),t.render(e,d),t.setRenderTarget(f,h,u),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Yd extends $e{constructor(t,e,i,a,s,o,r,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:Zi,super(t,e,i,a,s,o,r,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class wm extends bi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Yd(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:En}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new An(5,5,5),s=new ni({name:"CubemapFromEquirect",uniforms:Ji(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:We,blending:Qn});s.uniforms.tEquirect.value=e;const o=new pe(a,s),r=e.minFilter;return e.minFilter===vi&&(e.minFilter=En),new Em(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const Eo=new q,Tm=new q,Am=new qt;class fi{constructor(t=new q(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=Eo.subVectors(i,e).cross(Tm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Eo),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Am.getNormalMatrix(t),a=this.coplanarPoint(Eo).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const li=new ks,Ka=new q;class cc{constructor(t=new fi,e=new fi,i=new fi,a=new fi,s=new fi,o=new fi){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=On){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],c=a[3],l=a[4],d=a[5],f=a[6],h=a[7],u=a[8],g=a[9],_=a[10],m=a[11],p=a[12],x=a[13],M=a[14],v=a[15];if(i[0].setComponents(c-s,h-l,m-u,v-p).normalize(),i[1].setComponents(c+s,h+l,m+u,v+p).normalize(),i[2].setComponents(c+o,h+d,m+g,v+x).normalize(),i[3].setComponents(c-o,h-d,m-g,v-x).normalize(),i[4].setComponents(c-r,h-f,m-_,v-M).normalize(),e===On)i[5].setComponents(c+r,h+f,m+_,v+M).normalize();else if(e===Ts)i[5].setComponents(r,f,_,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(t){return li.center.set(0,0,0),li.radius=.7071067811865476,li.applyMatrix4(t.matrixWorld),this.intersectsSphere(li)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(Ka.x=a.normal.x>0?t.max.x:t.min.x,Ka.y=a.normal.y>0?t.max.y:t.min.y,Ka.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(Ka)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Zd(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function Rm(n){const t=new WeakMap;function e(r,c){const l=r.array,d=r.usage,f=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,d),r.onUploadCallback();let u;if(l instanceof Float32Array)u=n.FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=n.SHORT;else if(l instanceof Uint32Array)u=n.UNSIGNED_INT;else if(l instanceof Int32Array)u=n.INT;else if(l instanceof Int8Array)u=n.BYTE;else if(l instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,c,l){const d=c.array,f=c.updateRanges;if(n.bindBuffer(l,r),f.length===0)n.bufferSubData(l,0,d);else{f.sort((u,g)=>u.start-g.start);let h=0;for(let u=1;u<f.length;u++){const g=f[h],_=f[u];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,f[h]=_)}f.length=h+1;for(let u=0,g=f.length;u<g;u++){const _=f[u];n.bufferSubData(l,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function o(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const d=t.get(r);(!d||d.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:a,remove:s,update:o}}class Us extends He{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),c=Math.floor(a),l=r+1,d=c+1,f=t/r,h=e/c,u=[],g=[],_=[],m=[];for(let p=0;p<d;p++){const x=p*h-o;for(let M=0;M<l;M++){const v=M*f-s;g.push(v,-x,0),_.push(0,0,1),m.push(M/r),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<r;x++){const M=x+l*p,v=x+l*(p+1),U=x+1+l*(p+1),R=x+1+l*p;u.push(M,v,R),u.push(v,U,R)}this.setIndex(u),this.setAttribute("position",new Me(g,3)),this.setAttribute("normal",new Me(_,3)),this.setAttribute("uv",new Me(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Us(t.width,t.height,t.widthSegments,t.heightSegments)}}var Cm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Pm=`#ifdef USE_ALPHAHASH
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
#endif`,Dm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Lm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Im=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,km=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Um=`#ifdef USE_AOMAP
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
#endif`,Fm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Nm=`#ifdef USE_BATCHING
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
#endif`,zm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Om=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Bm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Gm=`#ifdef USE_IRIDESCENCE
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
#endif`,Vm=`#ifdef USE_BUMPMAP
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
#endif`,Xm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Wm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,$m=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ym=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Zm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,qm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,jm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Km=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Jm=`#define PI 3.141592653589793
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
} // validated`,Qm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,tg=`vec3 transformedNormal = objectNormal;
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
#endif`,eg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ng=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ig=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ag=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,sg="gl_FragColor = linearToOutputTexel( gl_FragColor );",og=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,rg=`#ifdef USE_ENVMAP
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
#endif`,cg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,lg=`#ifdef USE_ENVMAP
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
#endif`,dg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,hg=`#ifdef USE_ENVMAP
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
#endif`,ug=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,pg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,mg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gg=`#ifdef USE_GRADIENTMAP
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
}`,_g=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,xg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,vg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Mg=`uniform bool receiveShadow;
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
#endif`,yg=`#ifdef USE_ENVMAP
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
#endif`,Sg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,bg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Eg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,wg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Tg=`PhysicalMaterial material;
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
#endif`,Ag=`struct PhysicalMaterial {
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
}`,Rg=`
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
#endif`,Cg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Pg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Dg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Lg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ig=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ug=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Fg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ng=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,zg=`#if defined( USE_POINTS_UV )
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
#endif`,Og=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Gg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Vg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xg=`#ifdef USE_MORPHTARGETS
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
#endif`,Wg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$g=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Yg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Zg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Kg=`#ifdef USE_NORMALMAP
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
#endif`,Jg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,t0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,e0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,n0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,i0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,a0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,s0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,o0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,r0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,c0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,l0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,d0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,h0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,u0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,f0=`float getShadowMask() {
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
}`,p0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,m0=`#ifdef USE_SKINNING
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
#endif`,g0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,_0=`#ifdef USE_SKINNING
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
#endif`,x0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,v0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,M0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,y0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,S0=`#ifdef USE_TRANSMISSION
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
#endif`,b0=`#ifdef USE_TRANSMISSION
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
#endif`,E0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,w0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,T0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,A0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const R0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,C0=`uniform sampler2D t2D;
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
}`,P0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,D0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,L0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,I0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,k0=`#include <common>
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
}`,U0=`#if DEPTH_PACKING == 3200
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
}`,F0=`#define DISTANCE
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
}`,N0=`#define DISTANCE
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
}`,z0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,O0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,B0=`uniform float scale;
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
}`,H0=`uniform vec3 diffuse;
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
}`,G0=`#include <common>
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
}`,V0=`uniform vec3 diffuse;
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
}`,X0=`#define LAMBERT
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
}`,W0=`#define LAMBERT
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
}`,$0=`#define MATCAP
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
}`,Y0=`#define MATCAP
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
}`,Z0=`#define NORMAL
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
}`,q0=`#define NORMAL
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
}`,j0=`#define PHONG
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
}`,K0=`#define PHONG
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
}`,J0=`#define STANDARD
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
}`,Q0=`#define STANDARD
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
}`,t_=`#define TOON
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
}`,e_=`#define TOON
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
}`,n_=`uniform float size;
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
}`,i_=`uniform vec3 diffuse;
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
}`,a_=`#include <common>
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
}`,s_=`uniform vec3 color;
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
}`,o_=`uniform float rotation;
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
}`,r_=`uniform vec3 diffuse;
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
}`,Kt={alphahash_fragment:Cm,alphahash_pars_fragment:Pm,alphamap_fragment:Dm,alphamap_pars_fragment:Lm,alphatest_fragment:Im,alphatest_pars_fragment:km,aomap_fragment:Um,aomap_pars_fragment:Fm,batching_pars_vertex:Nm,batching_vertex:zm,begin_vertex:Om,beginnormal_vertex:Bm,bsdfs:Hm,iridescence_fragment:Gm,bumpmap_pars_fragment:Vm,clipping_planes_fragment:Xm,clipping_planes_pars_fragment:Wm,clipping_planes_pars_vertex:$m,clipping_planes_vertex:Ym,color_fragment:Zm,color_pars_fragment:qm,color_pars_vertex:jm,color_vertex:Km,common:Jm,cube_uv_reflection_fragment:Qm,defaultnormal_vertex:tg,displacementmap_pars_vertex:eg,displacementmap_vertex:ng,emissivemap_fragment:ig,emissivemap_pars_fragment:ag,colorspace_fragment:sg,colorspace_pars_fragment:og,envmap_fragment:rg,envmap_common_pars_fragment:cg,envmap_pars_fragment:lg,envmap_pars_vertex:dg,envmap_physical_pars_fragment:yg,envmap_vertex:hg,fog_vertex:ug,fog_pars_vertex:fg,fog_fragment:pg,fog_pars_fragment:mg,gradientmap_pars_fragment:gg,lightmap_pars_fragment:_g,lights_lambert_fragment:xg,lights_lambert_pars_fragment:vg,lights_pars_begin:Mg,lights_toon_fragment:Sg,lights_toon_pars_fragment:bg,lights_phong_fragment:Eg,lights_phong_pars_fragment:wg,lights_physical_fragment:Tg,lights_physical_pars_fragment:Ag,lights_fragment_begin:Rg,lights_fragment_maps:Cg,lights_fragment_end:Pg,logdepthbuf_fragment:Dg,logdepthbuf_pars_fragment:Lg,logdepthbuf_pars_vertex:Ig,logdepthbuf_vertex:kg,map_fragment:Ug,map_pars_fragment:Fg,map_particle_fragment:Ng,map_particle_pars_fragment:zg,metalnessmap_fragment:Og,metalnessmap_pars_fragment:Bg,morphinstance_vertex:Hg,morphcolor_vertex:Gg,morphnormal_vertex:Vg,morphtarget_pars_vertex:Xg,morphtarget_vertex:Wg,normal_fragment_begin:$g,normal_fragment_maps:Yg,normal_pars_fragment:Zg,normal_pars_vertex:qg,normal_vertex:jg,normalmap_pars_fragment:Kg,clearcoat_normal_fragment_begin:Jg,clearcoat_normal_fragment_maps:Qg,clearcoat_pars_fragment:t0,iridescence_pars_fragment:e0,opaque_fragment:n0,packing:i0,premultiplied_alpha_fragment:a0,project_vertex:s0,dithering_fragment:o0,dithering_pars_fragment:r0,roughnessmap_fragment:c0,roughnessmap_pars_fragment:l0,shadowmap_pars_fragment:d0,shadowmap_pars_vertex:h0,shadowmap_vertex:u0,shadowmask_pars_fragment:f0,skinbase_vertex:p0,skinning_pars_vertex:m0,skinning_vertex:g0,skinnormal_vertex:_0,specularmap_fragment:x0,specularmap_pars_fragment:v0,tonemapping_fragment:M0,tonemapping_pars_fragment:y0,transmission_fragment:S0,transmission_pars_fragment:b0,uv_pars_fragment:E0,uv_pars_vertex:w0,uv_vertex:T0,worldpos_vertex:A0,background_vert:R0,background_frag:C0,backgroundCube_vert:P0,backgroundCube_frag:D0,cube_vert:L0,cube_frag:I0,depth_vert:k0,depth_frag:U0,distanceRGBA_vert:F0,distanceRGBA_frag:N0,equirect_vert:z0,equirect_frag:O0,linedashed_vert:B0,linedashed_frag:H0,meshbasic_vert:G0,meshbasic_frag:V0,meshlambert_vert:X0,meshlambert_frag:W0,meshmatcap_vert:$0,meshmatcap_frag:Y0,meshnormal_vert:Z0,meshnormal_frag:q0,meshphong_vert:j0,meshphong_frag:K0,meshphysical_vert:J0,meshphysical_frag:Q0,meshtoon_vert:t_,meshtoon_frag:e_,points_vert:n_,points_frag:i_,shadow_vert:a_,shadow_frag:s_,sprite_vert:o_,sprite_frag:r_},Pt={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qt}},envmap:{envMap:{value:null},envMapRotation:{value:new qt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qt},normalScale:{value:new ne(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0},uvTransform:{value:new qt}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new ne(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}}},bn={basic:{uniforms:Oe([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:Oe([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:Oe([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:Oe([Pt.common,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.roughnessmap,Pt.metalnessmap,Pt.fog,Pt.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:Oe([Pt.common,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.gradientmap,Pt.fog,Pt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:Oe([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:Oe([Pt.points,Pt.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:Oe([Pt.common,Pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:Oe([Pt.common,Pt.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:Oe([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:Oe([Pt.sprite,Pt.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qt}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:Oe([Pt.common,Pt.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:Oe([Pt.lights,Pt.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};bn.physical={uniforms:Oe([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qt},clearcoatNormalScale:{value:new ne(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qt},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qt},transmissionSamplerSize:{value:new ne},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qt},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qt},anisotropyVector:{value:new ne},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const Ja={r:0,b:0,g:0},di=new Tn,c_=new ge;function l_(n,t,e,i,a,s,o){const r=new Wt(0);let c=s===!0?0:1,l,d,f=null,h=0,u=null;function g(x){let M=x.isScene===!0?x.background:null;return M&&M.isTexture&&(M=(x.backgroundBlurriness>0?e:t).get(M)),M}function _(x){let M=!1;const v=g(x);v===null?p(r,c):v&&v.isColor&&(p(v,1),M=!0);const U=n.xr.getEnvironmentBlendMode();U==="additive"?i.buffers.color.setClear(0,0,0,1,o):U==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,M){const v=g(M);v&&(v.isCubeTexture||v.mapping===Ls)?(d===void 0&&(d=new pe(new An(1,1,1),new ni({name:"BackgroundCubeMaterial",uniforms:Ji(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:We,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(U,R,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(d)),di.copy(M.backgroundRotation),di.x*=-1,di.y*=-1,di.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),d.material.uniforms.envMap.value=v,d.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(c_.makeRotationFromEuler(di)),d.material.toneMapped=se.getTransfer(v.colorSpace)!==ue,(f!==v||h!==v.version||u!==n.toneMapping)&&(d.material.needsUpdate=!0,f=v,h=v.version,u=n.toneMapping),d.layers.enableAll(),x.unshift(d,d.geometry,d.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new pe(new Us(2,2),new ni({name:"BackgroundMaterial",uniforms:Ji(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:ei,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=se.getTransfer(v.colorSpace)!==ue,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||h!==v.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,f=v,h=v.version,u=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,M){x.getRGB(Ja,Wd(n)),i.buffers.color.setClear(Ja.r,Ja.g,Ja.b,M,o)}return{getClearColor:function(){return r},setClearColor:function(x,M=1){r.set(x),c=M,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(r,c)},render:_,addToRenderList:m}}function d_(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=h(null);let s=a,o=!1;function r(y,D,H,z,G){let C=!1;const A=f(z,H,D);s!==A&&(s=A,l(s.object)),C=u(y,z,H,G),C&&g(y,z,H,G),G!==null&&t.update(G,n.ELEMENT_ARRAY_BUFFER),(C||o)&&(o=!1,v(y,D,H,z),G!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function d(y){return n.deleteVertexArray(y)}function f(y,D,H){const z=H.wireframe===!0;let G=i[y.id];G===void 0&&(G={},i[y.id]=G);let C=G[D.id];C===void 0&&(C={},G[D.id]=C);let A=C[z];return A===void 0&&(A=h(c()),C[z]=A),A}function h(y){const D=[],H=[],z=[];for(let G=0;G<e;G++)D[G]=0,H[G]=0,z[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:H,attributeDivisors:z,object:y,attributes:{},index:null}}function u(y,D,H,z){const G=s.attributes,C=D.attributes;let A=0;const V=H.getAttributes();for(const B in V)if(V[B].location>=0){const J=G[B];let lt=C[B];if(lt===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(lt=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(lt=y.instanceColor)),J===void 0||J.attribute!==lt||lt&&J.data!==lt.data)return!0;A++}return s.attributesNum!==A||s.index!==z}function g(y,D,H,z){const G={},C=D.attributes;let A=0;const V=H.getAttributes();for(const B in V)if(V[B].location>=0){let J=C[B];J===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(J=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(J=y.instanceColor));const lt={};lt.attribute=J,J&&J.data&&(lt.data=J.data),G[B]=lt,A++}s.attributes=G,s.attributesNum=A,s.index=z}function _(){const y=s.newAttributes;for(let D=0,H=y.length;D<H;D++)y[D]=0}function m(y){p(y,0)}function p(y,D){const H=s.newAttributes,z=s.enabledAttributes,G=s.attributeDivisors;H[y]=1,z[y]===0&&(n.enableVertexAttribArray(y),z[y]=1),G[y]!==D&&(n.vertexAttribDivisor(y,D),G[y]=D)}function x(){const y=s.newAttributes,D=s.enabledAttributes;for(let H=0,z=D.length;H<z;H++)D[H]!==y[H]&&(n.disableVertexAttribArray(H),D[H]=0)}function M(y,D,H,z,G,C,A){A===!0?n.vertexAttribIPointer(y,D,H,G,C):n.vertexAttribPointer(y,D,H,z,G,C)}function v(y,D,H,z){_();const G=z.attributes,C=H.getAttributes(),A=D.defaultAttributeValues;for(const V in C){const B=C[V];if(B.location>=0){let j=G[V];if(j===void 0&&(V==="instanceMatrix"&&y.instanceMatrix&&(j=y.instanceMatrix),V==="instanceColor"&&y.instanceColor&&(j=y.instanceColor)),j!==void 0){const J=j.normalized,lt=j.itemSize,pt=t.get(j);if(pt===void 0)continue;const Mt=pt.buffer,Y=pt.type,tt=pt.bytesPerElement,mt=Y===n.INT||Y===n.UNSIGNED_INT||j.gpuType===tc;if(j.isInterleavedBufferAttribute){const K=j.data,gt=K.stride,Lt=j.offset;if(K.isInstancedInterleavedBuffer){for(let Ct=0;Ct<B.locationSize;Ct++)p(B.location+Ct,K.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Ct=0;Ct<B.locationSize;Ct++)m(B.location+Ct);n.bindBuffer(n.ARRAY_BUFFER,Mt);for(let Ct=0;Ct<B.locationSize;Ct++)M(B.location+Ct,lt/B.locationSize,Y,J,gt*tt,(Lt+lt/B.locationSize*Ct)*tt,mt)}else{if(j.isInstancedBufferAttribute){for(let K=0;K<B.locationSize;K++)p(B.location+K,j.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let K=0;K<B.locationSize;K++)m(B.location+K);n.bindBuffer(n.ARRAY_BUFFER,Mt);for(let K=0;K<B.locationSize;K++)M(B.location+K,lt/B.locationSize,Y,J,lt*tt,lt/B.locationSize*K*tt,mt)}}else if(A!==void 0){const J=A[V];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(B.location,J);break;case 3:n.vertexAttrib3fv(B.location,J);break;case 4:n.vertexAttrib4fv(B.location,J);break;default:n.vertexAttrib1fv(B.location,J)}}}}x()}function U(){w();for(const y in i){const D=i[y];for(const H in D){const z=D[H];for(const G in z)d(z[G].object),delete z[G];delete D[H]}delete i[y]}}function R(y){if(i[y.id]===void 0)return;const D=i[y.id];for(const H in D){const z=D[H];for(const G in z)d(z[G].object),delete z[G];delete D[H]}delete i[y.id]}function T(y){for(const D in i){const H=i[D];if(H[y.id]===void 0)continue;const z=H[y.id];for(const G in z)d(z[G].object),delete z[G];delete H[y.id]}}function w(){b(),o=!0,s!==a&&(s=a,l(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:w,resetDefaultState:b,dispose:U,releaseStatesOfGeometry:R,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function h_(n,t,e){let i;function a(l){i=l}function s(l,d){n.drawArrays(i,l,d),e.update(d,i,1)}function o(l,d,f){f!==0&&(n.drawArraysInstanced(i,l,d,f),e.update(d,i,f))}function r(l,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,d,0,f);let u=0;for(let g=0;g<f;g++)u+=d[g];e.update(u,i,1)}function c(l,d,f,h){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<l.length;g++)o(l[g],d[g],h[g]);else{u.multiDrawArraysInstancedWEBGL(i,l,0,d,0,h,0,f);let g=0;for(let _=0;_<f;_++)g+=d[_]*h[_];e.update(g,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function u_(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(T){return!(T!==_n&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(T){const w=T===wa&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==Hn&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==zn&&!w)}function c(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const f=e.logarithmicDepthBuffer===!0,h=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),M=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),U=g>0,R=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:h,maxTextures:u,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:v,vertexTextures:U,maxSamples:R}}function f_(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new fi,r=new qt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const u=f.length!==0||h||i!==0||a;return a=h,i=f.length,u},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){e=d(f,h,0)},this.setState=function(f,h,u){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!a||g===null||g.length===0||s&&!m)s?d(null):l();else{const x=s?0:i,M=x*4;let v=p.clippingState||null;c.value=v,v=d(g,h,M,u);for(let U=0;U!==M;++U)v[U]=e[U];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function d(f,h,u,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=u+_*4,x=h.matrixWorldInverse;r.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,v=u;M!==_;++M,v+=4)o.copy(f[M]).applyMatrix4(x,r),o.normal.toArray(m,v),m[v+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function p_(n){let t=new WeakMap;function e(o,r){return r===lr?o.mapping=Zi:r===dr&&(o.mapping=qi),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===lr||r===dr)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new wm(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",a),e(l.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class qd extends $d{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,c=a-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,r-=d*this.view.offsetY,c=r-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Vi=4,bl=[.125,.215,.35,.446,.526,.582],_i=20,wo=new qd,El=new Wt;let To=null,Ao=0,Ro=0,Co=!1;const pi=(1+Math.sqrt(5))/2,Gi=1/pi,wl=[new q(-pi,Gi,0),new q(pi,Gi,0),new q(-Gi,0,pi),new q(Gi,0,pi),new q(0,pi,-Gi),new q(0,pi,Gi),new q(-1,1,-1),new q(1,1,-1),new q(-1,1,1),new q(1,1,1)];class Tl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){To=this._renderer.getRenderTarget(),Ao=this._renderer.getActiveCubeFace(),Ro=this._renderer.getActiveMipmapLevel(),Co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Rl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(To,Ao,Ro),this._renderer.xr.enabled=Co,t.scissorTest=!1,Qa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Zi||t.mapping===qi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),To=this._renderer.getRenderTarget(),Ao=this._renderer.getActiveCubeFace(),Ro=this._renderer.getActiveMipmapLevel(),Co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:En,minFilter:En,generateMipmaps:!1,type:wa,format:_n,colorSpace:Qi,depthBuffer:!1},a=Al(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Al(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=m_(s)),this._blurMaterial=g_(s,t,e)}return a}_compileMaterial(t){const e=new pe(this._lodPlanes[0],t);this._renderer.compile(e,wo)}_sceneToCubeUV(t,e,i,a){const r=new an(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(El),d.toneMapping=ti,d.autoClear=!1;const u=new cn({name:"PMREM.Background",side:We,depthWrite:!1,depthTest:!1}),g=new pe(new An,u);let _=!1;const m=t.background;m?m.isColor&&(u.color.copy(m),t.background=null,_=!0):(u.color.copy(El),_=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(r.up.set(0,c[p],0),r.lookAt(l[p],0,0)):x===1?(r.up.set(0,0,c[p]),r.lookAt(0,l[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,l[p]));const M=this._cubeSize;Qa(a,x*M,p>2?M:0,M,M),d.setRenderTarget(a),_&&d.render(g,r),d.render(t,r)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=h,d.autoClear=f,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===Zi||t.mapping===qi;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Rl());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new pe(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const c=this._cubeSize;Qa(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,wo)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=wl[(a-s-1)%wl.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,f=new pe(this._lodPlanes[a],l),h=l.uniforms,u=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*_i-1),_=s/g,m=isFinite(s)?1+Math.floor(d*_):_i;m>_i&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${_i}`);const p=[];let x=0;for(let T=0;T<_i;++T){const w=T/_,b=Math.exp(-w*w/2);p.push(b),T===0?x+=b:T<m&&(x+=2*b)}for(let T=0;T<p.length;T++)p[T]=p[T]/x;h.envMap.value=t.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=o==="latitudinal",r&&(h.poleAxis.value=r);const{_lodMax:M}=this;h.dTheta.value=g,h.mipInt.value=M-i;const v=this._sizeLods[a],U=3*v*(a>M-Vi?a-M+Vi:0),R=4*(this._cubeSize-v);Qa(e,U,R,3*v,2*v),c.setRenderTarget(e),c.render(f,wo)}}function m_(n){const t=[],e=[],i=[];let a=n;const s=n-Vi+1+bl.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let c=1/r;o>n-Vi?c=bl[o-n+Vi-1]:o===0&&(c=0),i.push(c);const l=1/(r-2),d=-l,f=1+l,h=[d,d,f,d,f,f,d,d,f,f,d,f],u=6,g=6,_=3,m=2,p=1,x=new Float32Array(_*g*u),M=new Float32Array(m*g*u),v=new Float32Array(p*g*u);for(let R=0;R<u;R++){const T=R%3*2/3-1,w=R>2?0:-1,b=[T,w,0,T+2/3,w,0,T+2/3,w+1,0,T,w,0,T+2/3,w+1,0,T,w+1,0];x.set(b,_*g*R),M.set(h,m*g*R);const y=[R,R,R,R,R,R];v.set(y,p*g*R)}const U=new He;U.setAttribute("position",new Ye(x,_)),U.setAttribute("uv",new Ye(M,m)),U.setAttribute("faceIndex",new Ye(v,p)),t.push(U),a>Vi&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Al(n,t,e){const i=new bi(n,t,e);return i.texture.mapping=Ls,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Qa(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function g_(n,t,e){const i=new Float32Array(_i),a=new q(0,1,0);return new ni({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:lc(),fragmentShader:`

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
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function Rl(){return new ni({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:lc(),fragmentShader:`

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
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function Cl(){return new ni({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:lc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function lc(){return`

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
	`}function __(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===lr||c===dr,d=c===Zi||c===qi;if(l||d){let f=t.get(r);const h=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==h)return e===null&&(e=new Tl(n)),f=l?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return l&&u&&u.height>0||d&&u&&a(u)?(e===null&&(e=new Tl(n)),f=l?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",s),f.texture):null}}}return r}function a(r){let c=0;const l=6;for(let d=0;d<l;d++)r[d]!==void 0&&c++;return c===l}function s(r){const c=r.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function x_(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&ga("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function v_(n,t,e,i){const a={},s=new WeakMap;function o(f){const h=f.target;h.index!==null&&t.remove(h.index);for(const g in h.attributes)t.remove(h.attributes[g]);for(const g in h.morphAttributes){const _=h.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}h.removeEventListener("dispose",o),delete a[h.id];const u=s.get(h);u&&(t.remove(u),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function r(f,h){return a[h.id]===!0||(h.addEventListener("dispose",o),a[h.id]=!0,e.memory.geometries++),h}function c(f){const h=f.attributes;for(const g in h)t.update(h[g],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const g in u){const _=u[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],n.ARRAY_BUFFER)}}function l(f){const h=[],u=f.index,g=f.attributes.position;let _=0;if(u!==null){const x=u.array;_=u.version;for(let M=0,v=x.length;M<v;M+=3){const U=x[M+0],R=x[M+1],T=x[M+2];h.push(U,R,R,T,T,U)}}else if(g!==void 0){const x=g.array;_=g.version;for(let M=0,v=x.length/3-1;M<v;M+=3){const U=M+0,R=M+1,T=M+2;h.push(U,R,R,T,T,U)}}else return;const m=new(Od(h)?Xd:Vd)(h,1);m.version=_;const p=s.get(f);p&&t.remove(p),s.set(f,m)}function d(f){const h=s.get(f);if(h){const u=f.index;u!==null&&h.version<u.version&&l(f)}else l(f);return s.get(f)}return{get:r,update:c,getWireframeAttribute:d}}function M_(n,t,e){let i;function a(h){i=h}let s,o;function r(h){s=h.type,o=h.bytesPerElement}function c(h,u){n.drawElements(i,u,s,h*o),e.update(u,i,1)}function l(h,u,g){g!==0&&(n.drawElementsInstanced(i,u,s,h*o,g),e.update(u,i,g))}function d(h,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,h,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,i,1)}function f(h,u,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)l(h[p]/o,u[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,u,0,s,h,0,_,0,g);let p=0;for(let x=0;x<g;x++)p+=u[x]*_[x];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=f}function y_(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function S_(n,t,e){const i=new WeakMap,a=new ve;function s(o,r,c){const l=o.morphTargetInfluences,d=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=d!==void 0?d.length:0;let h=i.get(r);if(h===void 0||h.count!==f){let y=function(){w.dispose(),i.delete(r),r.removeEventListener("dispose",y)};var u=y;h!==void 0&&h.texture.dispose();const g=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],x=r.morphAttributes.normal||[],M=r.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let U=r.attributes.position.count*v,R=1;U>t.maxTextureSize&&(R=Math.ceil(U/t.maxTextureSize),U=t.maxTextureSize);const T=new Float32Array(U*R*4*f),w=new Hd(T,U,R,f);w.type=zn,w.needsUpdate=!0;const b=v*4;for(let D=0;D<f;D++){const H=p[D],z=x[D],G=M[D],C=U*R*4*D;for(let A=0;A<H.count;A++){const V=A*b;g===!0&&(a.fromBufferAttribute(H,A),T[C+V+0]=a.x,T[C+V+1]=a.y,T[C+V+2]=a.z,T[C+V+3]=0),_===!0&&(a.fromBufferAttribute(z,A),T[C+V+4]=a.x,T[C+V+5]=a.y,T[C+V+6]=a.z,T[C+V+7]=0),m===!0&&(a.fromBufferAttribute(G,A),T[C+V+8]=a.x,T[C+V+9]=a.y,T[C+V+10]=a.z,T[C+V+11]=G.itemSize===4?a.w:1)}}h={count:f,texture:w,size:new ne(U,R)},i.set(r,h),r.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=r.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function b_(n,t,e,i){let a=new WeakMap;function s(c){const l=i.render.frame,d=c.geometry,f=t.get(c,d);if(a.get(f)!==l&&(t.update(f),a.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),a.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;a.get(h)!==l&&(h.update(),a.set(h,l))}return f}function o(){a=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}class jd extends $e{constructor(t,e,i,a,s,o,r,c,l,d=Wi){if(d!==Wi&&d!==Ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Wi&&(i=Si),i===void 0&&d===Ki&&(i=ji),super(null,a,s,o,r,c,d,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:xn,this.minFilter=c!==void 0?c:xn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Kd=new $e,Pl=new jd(1,1),Jd=new Hd,Qd=new lm,th=new Yd,Dl=[],Ll=[],Il=new Float32Array(16),kl=new Float32Array(9),Ul=new Float32Array(4);function na(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Dl[a];if(s===void 0&&(s=new Float32Array(a),Dl[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function Ae(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Re(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Fs(n,t){let e=Ll[t];e===void 0&&(e=new Int32Array(t),Ll[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function E_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function w_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;n.uniform2fv(this.addr,t),Re(e,t)}}function T_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ae(e,t))return;n.uniform3fv(this.addr,t),Re(e,t)}}function A_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;n.uniform4fv(this.addr,t),Re(e,t)}}function R_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ae(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,i))return;Ul.set(i),n.uniformMatrix2fv(this.addr,!1,Ul),Re(e,i)}}function C_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ae(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,i))return;kl.set(i),n.uniformMatrix3fv(this.addr,!1,kl),Re(e,i)}}function P_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ae(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,i))return;Il.set(i),n.uniformMatrix4fv(this.addr,!1,Il),Re(e,i)}}function D_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function L_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;n.uniform2iv(this.addr,t),Re(e,t)}}function I_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;n.uniform3iv(this.addr,t),Re(e,t)}}function k_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;n.uniform4iv(this.addr,t),Re(e,t)}}function U_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function F_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;n.uniform2uiv(this.addr,t),Re(e,t)}}function N_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;n.uniform3uiv(this.addr,t),Re(e,t)}}function z_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;n.uniform4uiv(this.addr,t),Re(e,t)}}function O_(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Pl.compareFunction=zd,s=Pl):s=Kd,e.setTexture2D(t||s,a)}function B_(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||Qd,a)}function H_(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||th,a)}function G_(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Jd,a)}function V_(n){switch(n){case 5126:return E_;case 35664:return w_;case 35665:return T_;case 35666:return A_;case 35674:return R_;case 35675:return C_;case 35676:return P_;case 5124:case 35670:return D_;case 35667:case 35671:return L_;case 35668:case 35672:return I_;case 35669:case 35673:return k_;case 5125:return U_;case 36294:return F_;case 36295:return N_;case 36296:return z_;case 35678:case 36198:case 36298:case 36306:case 35682:return O_;case 35679:case 36299:case 36307:return B_;case 35680:case 36300:case 36308:case 36293:return H_;case 36289:case 36303:case 36311:case 36292:return G_}}function X_(n,t){n.uniform1fv(this.addr,t)}function W_(n,t){const e=na(t,this.size,2);n.uniform2fv(this.addr,e)}function $_(n,t){const e=na(t,this.size,3);n.uniform3fv(this.addr,e)}function Y_(n,t){const e=na(t,this.size,4);n.uniform4fv(this.addr,e)}function Z_(n,t){const e=na(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function q_(n,t){const e=na(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function j_(n,t){const e=na(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function K_(n,t){n.uniform1iv(this.addr,t)}function J_(n,t){n.uniform2iv(this.addr,t)}function Q_(n,t){n.uniform3iv(this.addr,t)}function tx(n,t){n.uniform4iv(this.addr,t)}function ex(n,t){n.uniform1uiv(this.addr,t)}function nx(n,t){n.uniform2uiv(this.addr,t)}function ix(n,t){n.uniform3uiv(this.addr,t)}function ax(n,t){n.uniform4uiv(this.addr,t)}function sx(n,t,e){const i=this.cache,a=t.length,s=Fs(e,a);Ae(i,s)||(n.uniform1iv(this.addr,s),Re(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||Kd,s[o])}function ox(n,t,e){const i=this.cache,a=t.length,s=Fs(e,a);Ae(i,s)||(n.uniform1iv(this.addr,s),Re(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||Qd,s[o])}function rx(n,t,e){const i=this.cache,a=t.length,s=Fs(e,a);Ae(i,s)||(n.uniform1iv(this.addr,s),Re(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||th,s[o])}function cx(n,t,e){const i=this.cache,a=t.length,s=Fs(e,a);Ae(i,s)||(n.uniform1iv(this.addr,s),Re(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Jd,s[o])}function lx(n){switch(n){case 5126:return X_;case 35664:return W_;case 35665:return $_;case 35666:return Y_;case 35674:return Z_;case 35675:return q_;case 35676:return j_;case 5124:case 35670:return K_;case 35667:case 35671:return J_;case 35668:case 35672:return Q_;case 35669:case 35673:return tx;case 5125:return ex;case 36294:return nx;case 36295:return ix;case 36296:return ax;case 35678:case 36198:case 36298:case 36306:case 35682:return sx;case 35679:case 36299:case 36307:return ox;case 35680:case 36300:case 36308:case 36293:return rx;case 36289:case 36303:case 36311:case 36292:return cx}}class dx{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=V_(e.type)}}class hx{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=lx(e.type)}}class ux{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const Po=/(\w+)(\])?(\[|\.)?/g;function Fl(n,t){n.seq.push(t),n.map[t.id]=t}function fx(n,t,e){const i=n.name,a=i.length;for(Po.lastIndex=0;;){const s=Po.exec(i),o=Po.lastIndex;let r=s[1];const c=s[2]==="]",l=s[3];if(c&&(r=r|0),l===void 0||l==="["&&o+2===a){Fl(e,l===void 0?new dx(r,n,t):new hx(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new ux(r),Fl(e,f)),e=f}}}class ps{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);fx(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Nl(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const px=37297;let mx=0;function gx(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const zl=new qt;function _x(n){se._getMatrix(zl,se.workingColorSpace,n);const t=`mat3( ${zl.elements.map(e=>e.toFixed(4))} )`;switch(se.getTransfer(n)){case Is:return[t,"LinearTransferOETF"];case ue:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Ol(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+gx(n.getShaderSource(t),o)}else return a}function xx(n,t){const e=_x(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function vx(n,t){let e;switch(t){case Fp:e="Linear";break;case Np:e="Reinhard";break;case zp:e="Cineon";break;case Op:e="ACESFilmic";break;case Hp:e="AgX";break;case Gp:e="Neutral";break;case Bp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ts=new q;function Mx(){se.getLuminanceCoefficients(ts);const n=ts.x.toFixed(4),t=ts.y.toFixed(4),e=ts.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function yx(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(_a).join(`
`)}function Sx(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function bx(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function _a(n){return n!==""}function Bl(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Hl(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Ex=/^[ \t]*#include +<([\w\d./]+)>/gm;function Br(n){return n.replace(Ex,Tx)}const wx=new Map;function Tx(n,t){let e=Kt[t];if(e===void 0){const i=wx.get(t);if(i!==void 0)e=Kt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Br(e)}const Ax=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gl(n){return n.replace(Ax,Rx)}function Rx(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Vl(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function Cx(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Ed?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===wd?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Un&&(t="SHADOWMAP_TYPE_VSM"),t}function Px(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Zi:case qi:t="ENVMAP_TYPE_CUBE";break;case Ls:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Dx(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case qi:t="ENVMAP_MODE_REFRACTION";break}return t}function Lx(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Qr:t="ENVMAP_BLENDING_MULTIPLY";break;case kp:t="ENVMAP_BLENDING_MIX";break;case Up:t="ENVMAP_BLENDING_ADD";break}return t}function Ix(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function kx(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const c=Cx(e),l=Px(e),d=Dx(e),f=Lx(e),h=Ix(e),u=yx(e),g=Sx(s),_=a.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(_a).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(_a).join(`
`),p.length>0&&(p+=`
`)):(m=[Vl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_a).join(`
`),p=[Vl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ti?"#define TONE_MAPPING":"",e.toneMapping!==ti?Kt.tonemapping_pars_fragment:"",e.toneMapping!==ti?vx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,xx("linearToOutputTexel",e.outputColorSpace),Mx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(_a).join(`
`)),o=Br(o),o=Bl(o,e),o=Hl(o,e),r=Br(r),r=Bl(r,e),r=Hl(r,e),o=Gl(o),r=Gl(r),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===nl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===nl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=x+m+o,v=x+p+r,U=Nl(a,a.VERTEX_SHADER,M),R=Nl(a,a.FRAGMENT_SHADER,v);a.attachShader(_,U),a.attachShader(_,R),e.index0AttributeName!==void 0?a.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function T(D){if(n.debug.checkShaderErrors){const H=a.getProgramInfoLog(_).trim(),z=a.getShaderInfoLog(U).trim(),G=a.getShaderInfoLog(R).trim();let C=!0,A=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(C=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,_,U,R);else{const V=Ol(a,U,"vertex"),B=Ol(a,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+H+`
`+V+`
`+B)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(z===""||G==="")&&(A=!1);A&&(D.diagnostics={runnable:C,programLog:H,vertexShader:{log:z,prefix:m},fragmentShader:{log:G,prefix:p}})}a.deleteShader(U),a.deleteShader(R),w=new ps(a,_),b=bx(a,_)}let w;this.getUniforms=function(){return w===void 0&&T(this),w};let b;this.getAttributes=function(){return b===void 0&&T(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=a.getProgramParameter(_,px)),y},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=mx++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=U,this.fragmentShader=R,this}let Ux=0;class Fx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Nx(t),e.set(t,i)),i}}class Nx{constructor(t){this.id=Ux++,this.code=t,this.usedTimes=0}}function zx(n,t,e,i,a,s,o){const r=new rc,c=new Fx,l=new Set,d=[],f=a.logarithmicDepthBuffer,h=a.vertexTextures;let u=a.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,y,D,H,z){const G=H.fog,C=z.geometry,A=b.isMeshStandardMaterial?H.environment:null,V=(b.isMeshStandardMaterial?e:t).get(b.envMap||A),B=V&&V.mapping===Ls?V.image.height:null,j=g[b.type];b.precision!==null&&(u=a.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const J=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,lt=J!==void 0?J.length:0;let pt=0;C.morphAttributes.position!==void 0&&(pt=1),C.morphAttributes.normal!==void 0&&(pt=2),C.morphAttributes.color!==void 0&&(pt=3);let Mt,Y,tt,mt;if(j){const Vt=bn[j];Mt=Vt.vertexShader,Y=Vt.fragmentShader}else Mt=b.vertexShader,Y=b.fragmentShader,c.update(b),tt=c.getVertexShaderID(b),mt=c.getFragmentShaderID(b);const K=n.getRenderTarget(),gt=n.state.buffers.depth.getReversed(),Lt=z.isInstancedMesh===!0,Ct=z.isBatchedMesh===!0,zt=!!b.map,At=!!b.matcap,bt=!!V,O=!!b.aoMap,Zt=!!b.lightMap,Dt=!!b.bumpMap,It=!!b.normalMap,St=!!b.displacementMap,Et=!!b.emissiveMap,Rt=!!b.metalnessMap,P=!!b.roughnessMap,S=b.anisotropy>0,W=b.clearcoat>0,rt=b.dispersion>0,ct=b.iridescence>0,st=b.sheen>0,kt=b.transmission>0,et=S&&!!b.anisotropyMap,xt=W&&!!b.clearcoatMap,Bt=W&&!!b.clearcoatNormalMap,nt=W&&!!b.clearcoatRoughnessMap,yt=ct&&!!b.iridescenceMap,N=ct&&!!b.iridescenceThicknessMap,it=st&&!!b.sheenColorMap,ut=st&&!!b.sheenRoughnessMap,Ft=!!b.specularMap,X=!!b.specularColorMap,ft=!!b.specularIntensityMap,L=kt&&!!b.transmissionMap,dt=kt&&!!b.thicknessMap,Z=!!b.gradientMap,Q=!!b.alphaMap,_t=b.alphaTest>0,vt=!!b.alphaHash,Ot=!!b.extensions;let Yt=ti;b.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Yt=n.toneMapping);const ie={shaderID:j,shaderType:b.type,shaderName:b.name,vertexShader:Mt,fragmentShader:Y,defines:b.defines,customVertexShaderID:tt,customFragmentShaderID:mt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:Ct,batchingColor:Ct&&z._colorsTexture!==null,instancing:Lt,instancingColor:Lt&&z.instanceColor!==null,instancingMorph:Lt&&z.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Qi,alphaToCoverage:!!b.alphaToCoverage,map:zt,matcap:At,envMap:bt,envMapMode:bt&&V.mapping,envMapCubeUVHeight:B,aoMap:O,lightMap:Zt,bumpMap:Dt,normalMap:It,displacementMap:h&&St,emissiveMap:Et,normalMapObjectSpace:It&&b.normalMapType===$p,normalMapTangentSpace:It&&b.normalMapType===Nd,metalnessMap:Rt,roughnessMap:P,anisotropy:S,anisotropyMap:et,clearcoat:W,clearcoatMap:xt,clearcoatNormalMap:Bt,clearcoatRoughnessMap:nt,dispersion:rt,iridescence:ct,iridescenceMap:yt,iridescenceThicknessMap:N,sheen:st,sheenColorMap:it,sheenRoughnessMap:ut,specularMap:Ft,specularColorMap:X,specularIntensityMap:ft,transmission:kt,transmissionMap:L,thicknessMap:dt,gradientMap:Z,opaque:b.transparent===!1&&b.blending===Xi&&b.alphaToCoverage===!1,alphaMap:Q,alphaTest:_t,alphaHash:vt,combine:b.combine,mapUv:zt&&_(b.map.channel),aoMapUv:O&&_(b.aoMap.channel),lightMapUv:Zt&&_(b.lightMap.channel),bumpMapUv:Dt&&_(b.bumpMap.channel),normalMapUv:It&&_(b.normalMap.channel),displacementMapUv:St&&_(b.displacementMap.channel),emissiveMapUv:Et&&_(b.emissiveMap.channel),metalnessMapUv:Rt&&_(b.metalnessMap.channel),roughnessMapUv:P&&_(b.roughnessMap.channel),anisotropyMapUv:et&&_(b.anisotropyMap.channel),clearcoatMapUv:xt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Bt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:yt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:N&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:it&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:ut&&_(b.sheenRoughnessMap.channel),specularMapUv:Ft&&_(b.specularMap.channel),specularColorMapUv:X&&_(b.specularColorMap.channel),specularIntensityMapUv:ft&&_(b.specularIntensityMap.channel),transmissionMapUv:L&&_(b.transmissionMap.channel),thicknessMapUv:dt&&_(b.thicknessMap.channel),alphaMapUv:Q&&_(b.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(It||S),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!C.attributes.uv&&(zt||Q),fog:!!G,useFog:b.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:gt,skinning:z.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:lt,morphTextureStride:pt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:Yt,decodeVideoTexture:zt&&b.map.isVideoTexture===!0&&se.getTransfer(b.map.colorSpace)===ue,decodeVideoTextureEmissive:Et&&b.emissiveMap.isVideoTexture===!0&&se.getTransfer(b.emissiveMap.colorSpace)===ue,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Le,flipSided:b.side===We,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ot&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ot&&b.extensions.multiDraw===!0||Ct)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ie.vertexUv1s=l.has(1),ie.vertexUv2s=l.has(2),ie.vertexUv3s=l.has(3),l.clear(),ie}function p(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const D in b.defines)y.push(D),y.push(b.defines[D]);return b.isRawShaderMaterial===!1&&(x(y,b),M(y,b),y.push(n.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function x(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function M(b,y){r.disableAll(),y.supportsVertexTextures&&r.enable(0),y.instancing&&r.enable(1),y.instancingColor&&r.enable(2),y.instancingMorph&&r.enable(3),y.matcap&&r.enable(4),y.envMap&&r.enable(5),y.normalMapObjectSpace&&r.enable(6),y.normalMapTangentSpace&&r.enable(7),y.clearcoat&&r.enable(8),y.iridescence&&r.enable(9),y.alphaTest&&r.enable(10),y.vertexColors&&r.enable(11),y.vertexAlphas&&r.enable(12),y.vertexUv1s&&r.enable(13),y.vertexUv2s&&r.enable(14),y.vertexUv3s&&r.enable(15),y.vertexTangents&&r.enable(16),y.anisotropy&&r.enable(17),y.alphaHash&&r.enable(18),y.batching&&r.enable(19),y.dispersion&&r.enable(20),y.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),y.fog&&r.enable(0),y.useFog&&r.enable(1),y.flatShading&&r.enable(2),y.logarithmicDepthBuffer&&r.enable(3),y.reverseDepthBuffer&&r.enable(4),y.skinning&&r.enable(5),y.morphTargets&&r.enable(6),y.morphNormals&&r.enable(7),y.morphColors&&r.enable(8),y.premultipliedAlpha&&r.enable(9),y.shadowMapEnabled&&r.enable(10),y.doubleSided&&r.enable(11),y.flipSided&&r.enable(12),y.useDepthPacking&&r.enable(13),y.dithering&&r.enable(14),y.transmission&&r.enable(15),y.sheen&&r.enable(16),y.opaque&&r.enable(17),y.pointsUvs&&r.enable(18),y.decodeVideoTexture&&r.enable(19),y.decodeVideoTextureEmissive&&r.enable(20),y.alphaToCoverage&&r.enable(21),b.push(r.mask)}function v(b){const y=g[b.type];let D;if(y){const H=bn[y];D=ym.clone(H.uniforms)}else D=b.uniforms;return D}function U(b,y){let D;for(let H=0,z=d.length;H<z;H++){const G=d[H];if(G.cacheKey===y){D=G,++D.usedTimes;break}}return D===void 0&&(D=new kx(n,y,b,s),d.push(D)),D}function R(b){if(--b.usedTimes===0){const y=d.indexOf(b);d[y]=d[d.length-1],d.pop(),b.destroy()}}function T(b){c.remove(b)}function w(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:U,releaseProgram:R,releaseShaderCache:T,programs:d,dispose:w}}function Ox(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,c){n.get(o)[r]=c}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function Bx(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Xl(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Wl(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(f,h,u,g,_,m){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:h,material:u,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},n[t]=p):(p.id=f.id,p.object=f,p.geometry=h,p.material=u,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=_,p.group=m),t++,p}function r(f,h,u,g,_,m){const p=o(f,h,u,g,_,m);u.transmission>0?i.push(p):u.transparent===!0?a.push(p):e.push(p)}function c(f,h,u,g,_,m){const p=o(f,h,u,g,_,m);u.transmission>0?i.unshift(p):u.transparent===!0?a.unshift(p):e.unshift(p)}function l(f,h){e.length>1&&e.sort(f||Bx),i.length>1&&i.sort(h||Xl),a.length>1&&a.sort(h||Xl)}function d(){for(let f=t,h=n.length;f<h;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:c,finish:d,sort:l}}function Hx(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new Wl,n.set(i,[o])):a>=s.length?(o=new Wl,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function Gx(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new q,color:new Wt};break;case"SpotLight":e={position:new q,direction:new q,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new q,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new q,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":e={color:new Wt,position:new q,halfWidth:new q,halfHeight:new q};break}return n[t.id]=e,e}}}function Vx(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ne};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ne};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ne,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Xx=0;function Wx(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function $x(n){const t=new Gx,e=Vx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new q);const a=new q,s=new ge,o=new ge;function r(l){let d=0,f=0,h=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let u=0,g=0,_=0,m=0,p=0,x=0,M=0,v=0,U=0,R=0,T=0;l.sort(Wx);for(let b=0,y=l.length;b<y;b++){const D=l[b],H=D.color,z=D.intensity,G=D.distance,C=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=H.r*z,f+=H.g*z,h+=H.b*z;else if(D.isLightProbe){for(let A=0;A<9;A++)i.probe[A].addScaledVector(D.sh.coefficients[A],z);T++}else if(D.isDirectionalLight){const A=t.get(D);if(A.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const V=D.shadow,B=e.get(D);B.shadowIntensity=V.intensity,B.shadowBias=V.bias,B.shadowNormalBias=V.normalBias,B.shadowRadius=V.radius,B.shadowMapSize=V.mapSize,i.directionalShadow[u]=B,i.directionalShadowMap[u]=C,i.directionalShadowMatrix[u]=D.shadow.matrix,x++}i.directional[u]=A,u++}else if(D.isSpotLight){const A=t.get(D);A.position.setFromMatrixPosition(D.matrixWorld),A.color.copy(H).multiplyScalar(z),A.distance=G,A.coneCos=Math.cos(D.angle),A.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),A.decay=D.decay,i.spot[_]=A;const V=D.shadow;if(D.map&&(i.spotLightMap[U]=D.map,U++,V.updateMatrices(D),D.castShadow&&R++),i.spotLightMatrix[_]=V.matrix,D.castShadow){const B=e.get(D);B.shadowIntensity=V.intensity,B.shadowBias=V.bias,B.shadowNormalBias=V.normalBias,B.shadowRadius=V.radius,B.shadowMapSize=V.mapSize,i.spotShadow[_]=B,i.spotShadowMap[_]=C,v++}_++}else if(D.isRectAreaLight){const A=t.get(D);A.color.copy(H).multiplyScalar(z),A.halfWidth.set(D.width*.5,0,0),A.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=A,m++}else if(D.isPointLight){const A=t.get(D);if(A.color.copy(D.color).multiplyScalar(D.intensity),A.distance=D.distance,A.decay=D.decay,D.castShadow){const V=D.shadow,B=e.get(D);B.shadowIntensity=V.intensity,B.shadowBias=V.bias,B.shadowNormalBias=V.normalBias,B.shadowRadius=V.radius,B.shadowMapSize=V.mapSize,B.shadowCameraNear=V.camera.near,B.shadowCameraFar=V.camera.far,i.pointShadow[g]=B,i.pointShadowMap[g]=C,i.pointShadowMatrix[g]=D.shadow.matrix,M++}i.point[g]=A,g++}else if(D.isHemisphereLight){const A=t.get(D);A.skyColor.copy(D.color).multiplyScalar(z),A.groundColor.copy(D.groundColor).multiplyScalar(z),i.hemi[p]=A,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Pt.LTC_FLOAT_1,i.rectAreaLTC2=Pt.LTC_FLOAT_2):(i.rectAreaLTC1=Pt.LTC_HALF_1,i.rectAreaLTC2=Pt.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=h;const w=i.hash;(w.directionalLength!==u||w.pointLength!==g||w.spotLength!==_||w.rectAreaLength!==m||w.hemiLength!==p||w.numDirectionalShadows!==x||w.numPointShadows!==M||w.numSpotShadows!==v||w.numSpotMaps!==U||w.numLightProbes!==T)&&(i.directional.length=u,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=v+U-R,i.spotLightMap.length=U,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=T,w.directionalLength=u,w.pointLength=g,w.spotLength=_,w.rectAreaLength=m,w.hemiLength=p,w.numDirectionalShadows=x,w.numPointShadows=M,w.numSpotShadows=v,w.numSpotMaps=U,w.numLightProbes=T,i.version=Xx++)}function c(l,d){let f=0,h=0,u=0,g=0,_=0;const m=d.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const M=l[p];if(M.isDirectionalLight){const v=i.directional[f];v.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(m),f++}else if(M.isSpotLight){const v=i.spot[u];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(m),u++}else if(M.isRectAreaLight){const v=i.rectArea[g];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(m),o.identity(),s.copy(M.matrixWorld),s.premultiply(m),o.extractRotation(s),v.halfWidth.set(M.width*.5,0,0),v.halfHeight.set(0,M.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){const v=i.point[h];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(m),h++}else if(M.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(M.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:r,setupView:c,state:i}}function $l(n){const t=new $x(n),e=[],i=[];function a(d){l.camera=d,e.length=0,i.length=0}function s(d){e.push(d)}function o(d){i.push(d)}function r(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:l,setupLights:r,setupLightsView:c,pushLight:s,pushShadow:o}}function Yx(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new $l(n),t.set(a,[r])):s>=o.length?(r=new $l(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class Zx extends ea{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Xp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class qx extends ea{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const jx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Kx=`uniform sampler2D shadow_pass;
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
}`;function Jx(n,t,e){let i=new cc;const a=new ne,s=new ne,o=new ve,r=new Zx({depthPacking:Wp}),c=new qx,l={},d=e.maxTextureSize,f={[ei]:We,[We]:ei,[Le]:Le},h=new ni({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ne},radius:{value:4}},vertexShader:jx,fragmentShader:Kx}),u=h.clone();u.defines.HORIZONTAL_PASS=1;const g=new He;g.setAttribute("position",new Ye(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new pe(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ed;let p=this.type;this.render=function(R,T,w){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const b=n.getRenderTarget(),y=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),H=n.state;H.setBlending(Qn),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const z=p!==Un&&this.type===Un,G=p===Un&&this.type!==Un;for(let C=0,A=R.length;C<A;C++){const V=R[C],B=V.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",V,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;a.copy(B.mapSize);const j=B.getFrameExtents();if(a.multiply(j),s.copy(B.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(s.x=Math.floor(d/j.x),a.x=s.x*j.x,B.mapSize.x=s.x),a.y>d&&(s.y=Math.floor(d/j.y),a.y=s.y*j.y,B.mapSize.y=s.y)),B.map===null||z===!0||G===!0){const lt=this.type!==Un?{minFilter:xn,magFilter:xn}:{};B.map!==null&&B.map.dispose(),B.map=new bi(a.x,a.y,lt),B.map.texture.name=V.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const J=B.getViewportCount();for(let lt=0;lt<J;lt++){const pt=B.getViewport(lt);o.set(s.x*pt.x,s.y*pt.y,s.x*pt.z,s.y*pt.w),H.viewport(o),B.updateMatrices(V,lt),i=B.getFrustum(),v(T,w,B.camera,V,this.type)}B.isPointLightShadow!==!0&&this.type===Un&&x(B,w),B.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(b,y,D)};function x(R,T){const w=t.update(_);h.defines.VSM_SAMPLES!==R.blurSamples&&(h.defines.VSM_SAMPLES=R.blurSamples,u.defines.VSM_SAMPLES=R.blurSamples,h.needsUpdate=!0,u.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new bi(a.x,a.y)),h.uniforms.shadow_pass.value=R.map.texture,h.uniforms.resolution.value=R.mapSize,h.uniforms.radius.value=R.radius,n.setRenderTarget(R.mapPass),n.clear(),n.renderBufferDirect(T,null,w,h,_,null),u.uniforms.shadow_pass.value=R.mapPass.texture,u.uniforms.resolution.value=R.mapSize,u.uniforms.radius.value=R.radius,n.setRenderTarget(R.map),n.clear(),n.renderBufferDirect(T,null,w,u,_,null)}function M(R,T,w,b){let y=null;const D=w.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(D!==void 0)y=D;else if(y=w.isPointLight===!0?c:r,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const H=y.uuid,z=T.uuid;let G=l[H];G===void 0&&(G={},l[H]=G);let C=G[z];C===void 0&&(C=y.clone(),G[z]=C,T.addEventListener("dispose",U)),y=C}if(y.visible=T.visible,y.wireframe=T.wireframe,b===Un?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:f[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,w.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const H=n.properties.get(y);H.light=w}return y}function v(R,T,w,b,y){if(R.visible===!1)return;if(R.layers.test(T.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&y===Un)&&(!R.frustumCulled||i.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,R.matrixWorld);const z=t.update(R),G=R.material;if(Array.isArray(G)){const C=z.groups;for(let A=0,V=C.length;A<V;A++){const B=C[A],j=G[B.materialIndex];if(j&&j.visible){const J=M(R,j,b,y);R.onBeforeShadow(n,R,T,w,z,J,B),n.renderBufferDirect(w,null,z,J,R,B),R.onAfterShadow(n,R,T,w,z,J,B)}}}else if(G.visible){const C=M(R,G,b,y);R.onBeforeShadow(n,R,T,w,z,C,null),n.renderBufferDirect(w,null,z,C,R,null),R.onAfterShadow(n,R,T,w,z,C,null)}}const H=R.children;for(let z=0,G=H.length;z<G;z++)v(H[z],T,w,b,y)}function U(R){R.target.removeEventListener("dispose",U);for(const w in l){const b=l[w],y=R.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const Qx={[nr]:ir,[ar]:rr,[sr]:cr,[Yi]:or,[ir]:nr,[rr]:ar,[cr]:sr,[or]:Yi};function tv(n,t){function e(){let L=!1;const dt=new ve;let Z=null;const Q=new ve(0,0,0,0);return{setMask:function(_t){Z!==_t&&!L&&(n.colorMask(_t,_t,_t,_t),Z=_t)},setLocked:function(_t){L=_t},setClear:function(_t,vt,Ot,Yt,ie){ie===!0&&(_t*=Yt,vt*=Yt,Ot*=Yt),dt.set(_t,vt,Ot,Yt),Q.equals(dt)===!1&&(n.clearColor(_t,vt,Ot,Yt),Q.copy(dt))},reset:function(){L=!1,Z=null,Q.set(-1,0,0,0)}}}function i(){let L=!1,dt=!1,Z=null,Q=null,_t=null;return{setReversed:function(vt){if(dt!==vt){const Ot=t.get("EXT_clip_control");dt?Ot.clipControlEXT(Ot.LOWER_LEFT_EXT,Ot.ZERO_TO_ONE_EXT):Ot.clipControlEXT(Ot.LOWER_LEFT_EXT,Ot.NEGATIVE_ONE_TO_ONE_EXT);const Yt=_t;_t=null,this.setClear(Yt)}dt=vt},getReversed:function(){return dt},setTest:function(vt){vt?K(n.DEPTH_TEST):gt(n.DEPTH_TEST)},setMask:function(vt){Z!==vt&&!L&&(n.depthMask(vt),Z=vt)},setFunc:function(vt){if(dt&&(vt=Qx[vt]),Q!==vt){switch(vt){case nr:n.depthFunc(n.NEVER);break;case ir:n.depthFunc(n.ALWAYS);break;case ar:n.depthFunc(n.LESS);break;case Yi:n.depthFunc(n.LEQUAL);break;case sr:n.depthFunc(n.EQUAL);break;case or:n.depthFunc(n.GEQUAL);break;case rr:n.depthFunc(n.GREATER);break;case cr:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Q=vt}},setLocked:function(vt){L=vt},setClear:function(vt){_t!==vt&&(dt&&(vt=1-vt),n.clearDepth(vt),_t=vt)},reset:function(){L=!1,Z=null,Q=null,_t=null,dt=!1}}}function a(){let L=!1,dt=null,Z=null,Q=null,_t=null,vt=null,Ot=null,Yt=null,ie=null;return{setTest:function(Vt){L||(Vt?K(n.STENCIL_TEST):gt(n.STENCIL_TEST))},setMask:function(Vt){dt!==Vt&&!L&&(n.stencilMask(Vt),dt=Vt)},setFunc:function(Vt,de,he){(Z!==Vt||Q!==de||_t!==he)&&(n.stencilFunc(Vt,de,he),Z=Vt,Q=de,_t=he)},setOp:function(Vt,de,he){(vt!==Vt||Ot!==de||Yt!==he)&&(n.stencilOp(Vt,de,he),vt=Vt,Ot=de,Yt=he)},setLocked:function(Vt){L=Vt},setClear:function(Vt){ie!==Vt&&(n.clearStencil(Vt),ie=Vt)},reset:function(){L=!1,dt=null,Z=null,Q=null,_t=null,vt=null,Ot=null,Yt=null,ie=null}}}const s=new e,o=new i,r=new a,c=new WeakMap,l=new WeakMap;let d={},f={},h=new WeakMap,u=[],g=null,_=!1,m=null,p=null,x=null,M=null,v=null,U=null,R=null,T=new Wt(0,0,0),w=0,b=!1,y=null,D=null,H=null,z=null,G=null;const C=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let A=!1,V=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(B)[1]),A=V>=1):B.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),A=V>=2);let j=null,J={};const lt=n.getParameter(n.SCISSOR_BOX),pt=n.getParameter(n.VIEWPORT),Mt=new ve().fromArray(lt),Y=new ve().fromArray(pt);function tt(L,dt,Z,Q){const _t=new Uint8Array(4),vt=n.createTexture();n.bindTexture(L,vt),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ot=0;Ot<Z;Ot++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(dt,0,n.RGBA,1,1,Q,0,n.RGBA,n.UNSIGNED_BYTE,_t):n.texImage2D(dt+Ot,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,_t);return vt}const mt={};mt[n.TEXTURE_2D]=tt(n.TEXTURE_2D,n.TEXTURE_2D,1),mt[n.TEXTURE_CUBE_MAP]=tt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),mt[n.TEXTURE_2D_ARRAY]=tt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),mt[n.TEXTURE_3D]=tt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),K(n.DEPTH_TEST),o.setFunc(Yi),Dt(!1),It(jc),K(n.CULL_FACE),O(Qn);function K(L){d[L]!==!0&&(n.enable(L),d[L]=!0)}function gt(L){d[L]!==!1&&(n.disable(L),d[L]=!1)}function Lt(L,dt){return f[L]!==dt?(n.bindFramebuffer(L,dt),f[L]=dt,L===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=dt),L===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=dt),!0):!1}function Ct(L,dt){let Z=u,Q=!1;if(L){Z=h.get(dt),Z===void 0&&(Z=[],h.set(dt,Z));const _t=L.textures;if(Z.length!==_t.length||Z[0]!==n.COLOR_ATTACHMENT0){for(let vt=0,Ot=_t.length;vt<Ot;vt++)Z[vt]=n.COLOR_ATTACHMENT0+vt;Z.length=_t.length,Q=!0}}else Z[0]!==n.BACK&&(Z[0]=n.BACK,Q=!0);Q&&n.drawBuffers(Z)}function zt(L){return g!==L?(n.useProgram(L),g=L,!0):!1}const At={[gi]:n.FUNC_ADD,[_p]:n.FUNC_SUBTRACT,[xp]:n.FUNC_REVERSE_SUBTRACT};At[vp]=n.MIN,At[Mp]=n.MAX;const bt={[yp]:n.ZERO,[Sp]:n.ONE,[bp]:n.SRC_COLOR,[tr]:n.SRC_ALPHA,[Cp]:n.SRC_ALPHA_SATURATE,[Ap]:n.DST_COLOR,[wp]:n.DST_ALPHA,[Ep]:n.ONE_MINUS_SRC_COLOR,[er]:n.ONE_MINUS_SRC_ALPHA,[Rp]:n.ONE_MINUS_DST_COLOR,[Tp]:n.ONE_MINUS_DST_ALPHA,[Pp]:n.CONSTANT_COLOR,[Dp]:n.ONE_MINUS_CONSTANT_COLOR,[Lp]:n.CONSTANT_ALPHA,[Ip]:n.ONE_MINUS_CONSTANT_ALPHA};function O(L,dt,Z,Q,_t,vt,Ot,Yt,ie,Vt){if(L===Qn){_===!0&&(gt(n.BLEND),_=!1);return}if(_===!1&&(K(n.BLEND),_=!0),L!==gp){if(L!==m||Vt!==b){if((p!==gi||v!==gi)&&(n.blendEquation(n.FUNC_ADD),p=gi,v=gi),Vt)switch(L){case Xi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Kc:n.blendFunc(n.ONE,n.ONE);break;case Jc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Qc:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Xi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Kc:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Jc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Qc:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}x=null,M=null,U=null,R=null,T.set(0,0,0),w=0,m=L,b=Vt}return}_t=_t||dt,vt=vt||Z,Ot=Ot||Q,(dt!==p||_t!==v)&&(n.blendEquationSeparate(At[dt],At[_t]),p=dt,v=_t),(Z!==x||Q!==M||vt!==U||Ot!==R)&&(n.blendFuncSeparate(bt[Z],bt[Q],bt[vt],bt[Ot]),x=Z,M=Q,U=vt,R=Ot),(Yt.equals(T)===!1||ie!==w)&&(n.blendColor(Yt.r,Yt.g,Yt.b,ie),T.copy(Yt),w=ie),m=L,b=!1}function Zt(L,dt){L.side===Le?gt(n.CULL_FACE):K(n.CULL_FACE);let Z=L.side===We;dt&&(Z=!Z),Dt(Z),L.blending===Xi&&L.transparent===!1?O(Qn):O(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),s.setMask(L.colorWrite);const Q=L.stencilWrite;r.setTest(Q),Q&&(r.setMask(L.stencilWriteMask),r.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),r.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Et(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):gt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(L){y!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),y=L)}function It(L){L!==pp?(K(n.CULL_FACE),L!==D&&(L===jc?n.cullFace(n.BACK):L===mp?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):gt(n.CULL_FACE),D=L}function St(L){L!==H&&(A&&n.lineWidth(L),H=L)}function Et(L,dt,Z){L?(K(n.POLYGON_OFFSET_FILL),(z!==dt||G!==Z)&&(n.polygonOffset(dt,Z),z=dt,G=Z)):gt(n.POLYGON_OFFSET_FILL)}function Rt(L){L?K(n.SCISSOR_TEST):gt(n.SCISSOR_TEST)}function P(L){L===void 0&&(L=n.TEXTURE0+C-1),j!==L&&(n.activeTexture(L),j=L)}function S(L,dt,Z){Z===void 0&&(j===null?Z=n.TEXTURE0+C-1:Z=j);let Q=J[Z];Q===void 0&&(Q={type:void 0,texture:void 0},J[Z]=Q),(Q.type!==L||Q.texture!==dt)&&(j!==Z&&(n.activeTexture(Z),j=Z),n.bindTexture(L,dt||mt[L]),Q.type=L,Q.texture=dt)}function W(){const L=J[j];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function rt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ct(){try{n.compressedTexImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function st(){try{n.texSubImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function kt(){try{n.texSubImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function et(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Bt(){try{n.texStorage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function nt(){try{n.texStorage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function yt(){try{n.texImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function N(){try{n.texImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function it(L){Mt.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),Mt.copy(L))}function ut(L){Y.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),Y.copy(L))}function Ft(L,dt){let Z=l.get(dt);Z===void 0&&(Z=new WeakMap,l.set(dt,Z));let Q=Z.get(L);Q===void 0&&(Q=n.getUniformBlockIndex(dt,L.name),Z.set(L,Q))}function X(L,dt){const Q=l.get(dt).get(L);c.get(dt)!==Q&&(n.uniformBlockBinding(dt,Q,L.__bindingPointIndex),c.set(dt,Q))}function ft(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},j=null,J={},f={},h=new WeakMap,u=[],g=null,_=!1,m=null,p=null,x=null,M=null,v=null,U=null,R=null,T=new Wt(0,0,0),w=0,b=!1,y=null,D=null,H=null,z=null,G=null,Mt.set(0,0,n.canvas.width,n.canvas.height),Y.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:K,disable:gt,bindFramebuffer:Lt,drawBuffers:Ct,useProgram:zt,setBlending:O,setMaterial:Zt,setFlipSided:Dt,setCullFace:It,setLineWidth:St,setPolygonOffset:Et,setScissorTest:Rt,activeTexture:P,bindTexture:S,unbindTexture:W,compressedTexImage2D:rt,compressedTexImage3D:ct,texImage2D:yt,texImage3D:N,updateUBOMapping:Ft,uniformBlockBinding:X,texStorage2D:Bt,texStorage3D:nt,texSubImage2D:st,texSubImage3D:kt,compressedTexSubImage2D:et,compressedTexSubImage3D:xt,scissor:it,viewport:ut,reset:ft}}function Yl(n,t,e,i){const a=ev(i);switch(e){case Pd:return n*t;case Ld:return n*t;case Id:return n*t*2;case kd:return n*t/a.components*a.byteLength;case ic:return n*t/a.components*a.byteLength;case Ud:return n*t*2/a.components*a.byteLength;case ac:return n*t*2/a.components*a.byteLength;case Dd:return n*t*3/a.components*a.byteLength;case _n:return n*t*4/a.components*a.byteLength;case sc:return n*t*4/a.components*a.byteLength;case cs:case ls:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ds:case hs:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case pr:case gr:return Math.max(n,16)*Math.max(t,8)/4;case fr:case mr:return Math.max(n,8)*Math.max(t,8)/2;case _r:case xr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case vr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Mr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case yr:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Sr:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case br:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Er:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case wr:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Tr:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Ar:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Rr:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Cr:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Pr:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Dr:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Lr:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Ir:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case us:case kr:case Ur:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Fd:case Fr:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Nr:case zr:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ev(n){switch(n){case Hn:case Ad:return{byteLength:1,components:1};case ba:case Rd:case wa:return{byteLength:2,components:1};case ec:case nc:return{byteLength:2,components:4};case Si:case tc:case zn:return{byteLength:4,components:1};case Cd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function nv(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ne,d=new WeakMap;let f;const h=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,S){return u?new OffscreenCanvas(P,S):As("canvas")}function _(P,S,W){let rt=1;const ct=Rt(P);if((ct.width>W||ct.height>W)&&(rt=W/Math.max(ct.width,ct.height)),rt<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const st=Math.floor(rt*ct.width),kt=Math.floor(rt*ct.height);f===void 0&&(f=g(st,kt));const et=S?g(st,kt):f;return et.width=st,et.height=kt,et.getContext("2d").drawImage(P,0,0,st,kt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ct.width+"x"+ct.height+") to ("+st+"x"+kt+")."),et}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ct.width+"x"+ct.height+")."),P;return P}function m(P){return P.generateMipmaps}function p(P){n.generateMipmap(P)}function x(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(P,S,W,rt,ct=!1){if(P!==null){if(n[P]!==void 0)return n[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let st=S;if(S===n.RED&&(W===n.FLOAT&&(st=n.R32F),W===n.HALF_FLOAT&&(st=n.R16F),W===n.UNSIGNED_BYTE&&(st=n.R8)),S===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&(st=n.R8UI),W===n.UNSIGNED_SHORT&&(st=n.R16UI),W===n.UNSIGNED_INT&&(st=n.R32UI),W===n.BYTE&&(st=n.R8I),W===n.SHORT&&(st=n.R16I),W===n.INT&&(st=n.R32I)),S===n.RG&&(W===n.FLOAT&&(st=n.RG32F),W===n.HALF_FLOAT&&(st=n.RG16F),W===n.UNSIGNED_BYTE&&(st=n.RG8)),S===n.RG_INTEGER&&(W===n.UNSIGNED_BYTE&&(st=n.RG8UI),W===n.UNSIGNED_SHORT&&(st=n.RG16UI),W===n.UNSIGNED_INT&&(st=n.RG32UI),W===n.BYTE&&(st=n.RG8I),W===n.SHORT&&(st=n.RG16I),W===n.INT&&(st=n.RG32I)),S===n.RGB_INTEGER&&(W===n.UNSIGNED_BYTE&&(st=n.RGB8UI),W===n.UNSIGNED_SHORT&&(st=n.RGB16UI),W===n.UNSIGNED_INT&&(st=n.RGB32UI),W===n.BYTE&&(st=n.RGB8I),W===n.SHORT&&(st=n.RGB16I),W===n.INT&&(st=n.RGB32I)),S===n.RGBA_INTEGER&&(W===n.UNSIGNED_BYTE&&(st=n.RGBA8UI),W===n.UNSIGNED_SHORT&&(st=n.RGBA16UI),W===n.UNSIGNED_INT&&(st=n.RGBA32UI),W===n.BYTE&&(st=n.RGBA8I),W===n.SHORT&&(st=n.RGBA16I),W===n.INT&&(st=n.RGBA32I)),S===n.RGB&&W===n.UNSIGNED_INT_5_9_9_9_REV&&(st=n.RGB9_E5),S===n.RGBA){const kt=ct?Is:se.getTransfer(rt);W===n.FLOAT&&(st=n.RGBA32F),W===n.HALF_FLOAT&&(st=n.RGBA16F),W===n.UNSIGNED_BYTE&&(st=kt===ue?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT_4_4_4_4&&(st=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(st=n.RGB5_A1)}return(st===n.R16F||st===n.R32F||st===n.RG16F||st===n.RG32F||st===n.RGBA16F||st===n.RGBA32F)&&t.get("EXT_color_buffer_float"),st}function v(P,S){let W;return P?S===null||S===Si||S===ji?W=n.DEPTH24_STENCIL8:S===zn?W=n.DEPTH32F_STENCIL8:S===ba&&(W=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Si||S===ji?W=n.DEPTH_COMPONENT24:S===zn?W=n.DEPTH_COMPONENT32F:S===ba&&(W=n.DEPTH_COMPONENT16),W}function U(P,S){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==xn&&P.minFilter!==En?Math.log2(Math.max(S.width,S.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?S.mipmaps.length:1}function R(P){const S=P.target;S.removeEventListener("dispose",R),w(S),S.isVideoTexture&&d.delete(S)}function T(P){const S=P.target;S.removeEventListener("dispose",T),y(S)}function w(P){const S=i.get(P);if(S.__webglInit===void 0)return;const W=P.source,rt=h.get(W);if(rt){const ct=rt[S.__cacheKey];ct.usedTimes--,ct.usedTimes===0&&b(P),Object.keys(rt).length===0&&h.delete(W)}i.remove(P)}function b(P){const S=i.get(P);n.deleteTexture(S.__webglTexture);const W=P.source,rt=h.get(W);delete rt[S.__cacheKey],o.memory.textures--}function y(P){const S=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(S.__webglFramebuffer[rt]))for(let ct=0;ct<S.__webglFramebuffer[rt].length;ct++)n.deleteFramebuffer(S.__webglFramebuffer[rt][ct]);else n.deleteFramebuffer(S.__webglFramebuffer[rt]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[rt])}else{if(Array.isArray(S.__webglFramebuffer))for(let rt=0;rt<S.__webglFramebuffer.length;rt++)n.deleteFramebuffer(S.__webglFramebuffer[rt]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let rt=0;rt<S.__webglColorRenderbuffer.length;rt++)S.__webglColorRenderbuffer[rt]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[rt]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const W=P.textures;for(let rt=0,ct=W.length;rt<ct;rt++){const st=i.get(W[rt]);st.__webglTexture&&(n.deleteTexture(st.__webglTexture),o.memory.textures--),i.remove(W[rt])}i.remove(P)}let D=0;function H(){D=0}function z(){const P=D;return P>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+a.maxTextures),D+=1,P}function G(P){const S=[];return S.push(P.wrapS),S.push(P.wrapT),S.push(P.wrapR||0),S.push(P.magFilter),S.push(P.minFilter),S.push(P.anisotropy),S.push(P.internalFormat),S.push(P.format),S.push(P.type),S.push(P.generateMipmaps),S.push(P.premultiplyAlpha),S.push(P.flipY),S.push(P.unpackAlignment),S.push(P.colorSpace),S.join()}function C(P,S){const W=i.get(P);if(P.isVideoTexture&&St(P),P.isRenderTargetTexture===!1&&P.version>0&&W.__version!==P.version){const rt=P.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(W,P,S);return}}e.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+S)}function A(P,S){const W=i.get(P);if(P.version>0&&W.__version!==P.version){Y(W,P,S);return}e.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+S)}function V(P,S){const W=i.get(P);if(P.version>0&&W.__version!==P.version){Y(W,P,S);return}e.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+S)}function B(P,S){const W=i.get(P);if(P.version>0&&W.__version!==P.version){tt(W,P,S);return}e.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+S)}const j={[hr]:n.REPEAT,[xi]:n.CLAMP_TO_EDGE,[ur]:n.MIRRORED_REPEAT},J={[xn]:n.NEAREST,[Vp]:n.NEAREST_MIPMAP_NEAREST,[ka]:n.NEAREST_MIPMAP_LINEAR,[En]:n.LINEAR,[no]:n.LINEAR_MIPMAP_NEAREST,[vi]:n.LINEAR_MIPMAP_LINEAR},lt={[Yp]:n.NEVER,[Qp]:n.ALWAYS,[Zp]:n.LESS,[zd]:n.LEQUAL,[qp]:n.EQUAL,[Jp]:n.GEQUAL,[jp]:n.GREATER,[Kp]:n.NOTEQUAL};function pt(P,S){if(S.type===zn&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===En||S.magFilter===no||S.magFilter===ka||S.magFilter===vi||S.minFilter===En||S.minFilter===no||S.minFilter===ka||S.minFilter===vi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,j[S.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,j[S.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,j[S.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,J[S.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,J[S.minFilter]),S.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,lt[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===xn||S.minFilter!==ka&&S.minFilter!==vi||S.type===zn&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");n.texParameterf(P,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,a.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Mt(P,S){let W=!1;P.__webglInit===void 0&&(P.__webglInit=!0,S.addEventListener("dispose",R));const rt=S.source;let ct=h.get(rt);ct===void 0&&(ct={},h.set(rt,ct));const st=G(S);if(st!==P.__cacheKey){ct[st]===void 0&&(ct[st]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,W=!0),ct[st].usedTimes++;const kt=ct[P.__cacheKey];kt!==void 0&&(ct[P.__cacheKey].usedTimes--,kt.usedTimes===0&&b(S)),P.__cacheKey=st,P.__webglTexture=ct[st].texture}return W}function Y(P,S,W){let rt=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(rt=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(rt=n.TEXTURE_3D);const ct=Mt(P,S),st=S.source;e.bindTexture(rt,P.__webglTexture,n.TEXTURE0+W);const kt=i.get(st);if(st.version!==kt.__version||ct===!0){e.activeTexture(n.TEXTURE0+W);const et=se.getPrimaries(se.workingColorSpace),xt=S.colorSpace===Kn?null:se.getPrimaries(S.colorSpace),Bt=S.colorSpace===Kn||et===xt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let nt=_(S.image,!1,a.maxTextureSize);nt=Et(S,nt);const yt=s.convert(S.format,S.colorSpace),N=s.convert(S.type);let it=M(S.internalFormat,yt,N,S.colorSpace,S.isVideoTexture);pt(rt,S);let ut;const Ft=S.mipmaps,X=S.isVideoTexture!==!0,ft=kt.__version===void 0||ct===!0,L=st.dataReady,dt=U(S,nt);if(S.isDepthTexture)it=v(S.format===Ki,S.type),ft&&(X?e.texStorage2D(n.TEXTURE_2D,1,it,nt.width,nt.height):e.texImage2D(n.TEXTURE_2D,0,it,nt.width,nt.height,0,yt,N,null));else if(S.isDataTexture)if(Ft.length>0){X&&ft&&e.texStorage2D(n.TEXTURE_2D,dt,it,Ft[0].width,Ft[0].height);for(let Z=0,Q=Ft.length;Z<Q;Z++)ut=Ft[Z],X?L&&e.texSubImage2D(n.TEXTURE_2D,Z,0,0,ut.width,ut.height,yt,N,ut.data):e.texImage2D(n.TEXTURE_2D,Z,it,ut.width,ut.height,0,yt,N,ut.data);S.generateMipmaps=!1}else X?(ft&&e.texStorage2D(n.TEXTURE_2D,dt,it,nt.width,nt.height),L&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,nt.width,nt.height,yt,N,nt.data)):e.texImage2D(n.TEXTURE_2D,0,it,nt.width,nt.height,0,yt,N,nt.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){X&&ft&&e.texStorage3D(n.TEXTURE_2D_ARRAY,dt,it,Ft[0].width,Ft[0].height,nt.depth);for(let Z=0,Q=Ft.length;Z<Q;Z++)if(ut=Ft[Z],S.format!==_n)if(yt!==null)if(X){if(L)if(S.layerUpdates.size>0){const _t=Yl(ut.width,ut.height,S.format,S.type);for(const vt of S.layerUpdates){const Ot=ut.data.subarray(vt*_t/ut.data.BYTES_PER_ELEMENT,(vt+1)*_t/ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,vt,ut.width,ut.height,1,yt,Ot)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,0,ut.width,ut.height,nt.depth,yt,ut.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Z,it,ut.width,ut.height,nt.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else X?L&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,0,ut.width,ut.height,nt.depth,yt,N,ut.data):e.texImage3D(n.TEXTURE_2D_ARRAY,Z,it,ut.width,ut.height,nt.depth,0,yt,N,ut.data)}else{X&&ft&&e.texStorage2D(n.TEXTURE_2D,dt,it,Ft[0].width,Ft[0].height);for(let Z=0,Q=Ft.length;Z<Q;Z++)ut=Ft[Z],S.format!==_n?yt!==null?X?L&&e.compressedTexSubImage2D(n.TEXTURE_2D,Z,0,0,ut.width,ut.height,yt,ut.data):e.compressedTexImage2D(n.TEXTURE_2D,Z,it,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):X?L&&e.texSubImage2D(n.TEXTURE_2D,Z,0,0,ut.width,ut.height,yt,N,ut.data):e.texImage2D(n.TEXTURE_2D,Z,it,ut.width,ut.height,0,yt,N,ut.data)}else if(S.isDataArrayTexture)if(X){if(ft&&e.texStorage3D(n.TEXTURE_2D_ARRAY,dt,it,nt.width,nt.height,nt.depth),L)if(S.layerUpdates.size>0){const Z=Yl(nt.width,nt.height,S.format,S.type);for(const Q of S.layerUpdates){const _t=nt.data.subarray(Q*Z/nt.data.BYTES_PER_ELEMENT,(Q+1)*Z/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Q,nt.width,nt.height,1,yt,N,_t)}S.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,yt,N,nt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,it,nt.width,nt.height,nt.depth,0,yt,N,nt.data);else if(S.isData3DTexture)X?(ft&&e.texStorage3D(n.TEXTURE_3D,dt,it,nt.width,nt.height,nt.depth),L&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,yt,N,nt.data)):e.texImage3D(n.TEXTURE_3D,0,it,nt.width,nt.height,nt.depth,0,yt,N,nt.data);else if(S.isFramebufferTexture){if(ft)if(X)e.texStorage2D(n.TEXTURE_2D,dt,it,nt.width,nt.height);else{let Z=nt.width,Q=nt.height;for(let _t=0;_t<dt;_t++)e.texImage2D(n.TEXTURE_2D,_t,it,Z,Q,0,yt,N,null),Z>>=1,Q>>=1}}else if(Ft.length>0){if(X&&ft){const Z=Rt(Ft[0]);e.texStorage2D(n.TEXTURE_2D,dt,it,Z.width,Z.height)}for(let Z=0,Q=Ft.length;Z<Q;Z++)ut=Ft[Z],X?L&&e.texSubImage2D(n.TEXTURE_2D,Z,0,0,yt,N,ut):e.texImage2D(n.TEXTURE_2D,Z,it,yt,N,ut);S.generateMipmaps=!1}else if(X){if(ft){const Z=Rt(nt);e.texStorage2D(n.TEXTURE_2D,dt,it,Z.width,Z.height)}L&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,yt,N,nt)}else e.texImage2D(n.TEXTURE_2D,0,it,yt,N,nt);m(S)&&p(rt),kt.__version=st.version,S.onUpdate&&S.onUpdate(S)}P.__version=S.version}function tt(P,S,W){if(S.image.length!==6)return;const rt=Mt(P,S),ct=S.source;e.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+W);const st=i.get(ct);if(ct.version!==st.__version||rt===!0){e.activeTexture(n.TEXTURE0+W);const kt=se.getPrimaries(se.workingColorSpace),et=S.colorSpace===Kn?null:se.getPrimaries(S.colorSpace),xt=S.colorSpace===Kn||kt===et?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const Bt=S.isCompressedTexture||S.image[0].isCompressedTexture,nt=S.image[0]&&S.image[0].isDataTexture,yt=[];for(let Q=0;Q<6;Q++)!Bt&&!nt?yt[Q]=_(S.image[Q],!0,a.maxCubemapSize):yt[Q]=nt?S.image[Q].image:S.image[Q],yt[Q]=Et(S,yt[Q]);const N=yt[0],it=s.convert(S.format,S.colorSpace),ut=s.convert(S.type),Ft=M(S.internalFormat,it,ut,S.colorSpace),X=S.isVideoTexture!==!0,ft=st.__version===void 0||rt===!0,L=ct.dataReady;let dt=U(S,N);pt(n.TEXTURE_CUBE_MAP,S);let Z;if(Bt){X&&ft&&e.texStorage2D(n.TEXTURE_CUBE_MAP,dt,Ft,N.width,N.height);for(let Q=0;Q<6;Q++){Z=yt[Q].mipmaps;for(let _t=0;_t<Z.length;_t++){const vt=Z[_t];S.format!==_n?it!==null?X?L&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_t,0,0,vt.width,vt.height,it,vt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_t,Ft,vt.width,vt.height,0,vt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):X?L&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_t,0,0,vt.width,vt.height,it,ut,vt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_t,Ft,vt.width,vt.height,0,it,ut,vt.data)}}}else{if(Z=S.mipmaps,X&&ft){Z.length>0&&dt++;const Q=Rt(yt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,dt,Ft,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(nt){X?L&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,yt[Q].width,yt[Q].height,it,ut,yt[Q].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ft,yt[Q].width,yt[Q].height,0,it,ut,yt[Q].data);for(let _t=0;_t<Z.length;_t++){const Ot=Z[_t].image[Q].image;X?L&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_t+1,0,0,Ot.width,Ot.height,it,ut,Ot.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_t+1,Ft,Ot.width,Ot.height,0,it,ut,Ot.data)}}else{X?L&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,it,ut,yt[Q]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ft,it,ut,yt[Q]);for(let _t=0;_t<Z.length;_t++){const vt=Z[_t];X?L&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_t+1,0,0,it,ut,vt.image[Q]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_t+1,Ft,it,ut,vt.image[Q])}}}m(S)&&p(n.TEXTURE_CUBE_MAP),st.__version=ct.version,S.onUpdate&&S.onUpdate(S)}P.__version=S.version}function mt(P,S,W,rt,ct,st){const kt=s.convert(W.format,W.colorSpace),et=s.convert(W.type),xt=M(W.internalFormat,kt,et,W.colorSpace),Bt=i.get(S),nt=i.get(W);if(nt.__renderTarget=S,!Bt.__hasExternalTextures){const yt=Math.max(1,S.width>>st),N=Math.max(1,S.height>>st);ct===n.TEXTURE_3D||ct===n.TEXTURE_2D_ARRAY?e.texImage3D(ct,st,xt,yt,N,S.depth,0,kt,et,null):e.texImage2D(ct,st,xt,yt,N,0,kt,et,null)}e.bindFramebuffer(n.FRAMEBUFFER,P),It(S)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,rt,ct,nt.__webglTexture,0,Dt(S)):(ct===n.TEXTURE_2D||ct>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ct<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,rt,ct,nt.__webglTexture,st),e.bindFramebuffer(n.FRAMEBUFFER,null)}function K(P,S,W){if(n.bindRenderbuffer(n.RENDERBUFFER,P),S.depthBuffer){const rt=S.depthTexture,ct=rt&&rt.isDepthTexture?rt.type:null,st=v(S.stencilBuffer,ct),kt=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,et=Dt(S);It(S)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,et,st,S.width,S.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,et,st,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,st,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,kt,n.RENDERBUFFER,P)}else{const rt=S.textures;for(let ct=0;ct<rt.length;ct++){const st=rt[ct],kt=s.convert(st.format,st.colorSpace),et=s.convert(st.type),xt=M(st.internalFormat,kt,et,st.colorSpace),Bt=Dt(S);W&&It(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Bt,xt,S.width,S.height):It(S)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Bt,xt,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,xt,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function gt(P,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,P),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const rt=i.get(S.depthTexture);rt.__renderTarget=S,(!rt.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),C(S.depthTexture,0);const ct=rt.__webglTexture,st=Dt(S);if(S.depthTexture.format===Wi)It(S)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ct,0,st):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ct,0);else if(S.depthTexture.format===Ki)It(S)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ct,0,st):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ct,0);else throw new Error("Unknown depthTexture format")}function Lt(P){const S=i.get(P),W=P.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==P.depthTexture){const rt=P.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),rt){const ct=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,rt.removeEventListener("dispose",ct)};rt.addEventListener("dispose",ct),S.__depthDisposeCallback=ct}S.__boundDepthTexture=rt}if(P.depthTexture&&!S.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");gt(S.__webglFramebuffer,P)}else if(W){S.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)if(e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[rt]),S.__webglDepthbuffer[rt]===void 0)S.__webglDepthbuffer[rt]=n.createRenderbuffer(),K(S.__webglDepthbuffer[rt],P,!1);else{const ct=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=S.__webglDepthbuffer[rt];n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,ct,n.RENDERBUFFER,st)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),K(S.__webglDepthbuffer,P,!1);else{const rt=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ct=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ct),n.framebufferRenderbuffer(n.FRAMEBUFFER,rt,n.RENDERBUFFER,ct)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ct(P,S,W){const rt=i.get(P);S!==void 0&&mt(rt.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&Lt(P)}function zt(P){const S=P.texture,W=i.get(P),rt=i.get(S);P.addEventListener("dispose",T);const ct=P.textures,st=P.isWebGLCubeRenderTarget===!0,kt=ct.length>1;if(kt||(rt.__webglTexture===void 0&&(rt.__webglTexture=n.createTexture()),rt.__version=S.version,o.memory.textures++),st){W.__webglFramebuffer=[];for(let et=0;et<6;et++)if(S.mipmaps&&S.mipmaps.length>0){W.__webglFramebuffer[et]=[];for(let xt=0;xt<S.mipmaps.length;xt++)W.__webglFramebuffer[et][xt]=n.createFramebuffer()}else W.__webglFramebuffer[et]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){W.__webglFramebuffer=[];for(let et=0;et<S.mipmaps.length;et++)W.__webglFramebuffer[et]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(kt)for(let et=0,xt=ct.length;et<xt;et++){const Bt=i.get(ct[et]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=n.createTexture(),o.memory.textures++)}if(P.samples>0&&It(P)===!1){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let et=0;et<ct.length;et++){const xt=ct[et];W.__webglColorRenderbuffer[et]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[et]);const Bt=s.convert(xt.format,xt.colorSpace),nt=s.convert(xt.type),yt=M(xt.internalFormat,Bt,nt,xt.colorSpace,P.isXRRenderTarget===!0),N=Dt(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,N,yt,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+et,n.RENDERBUFFER,W.__webglColorRenderbuffer[et])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),K(W.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(st){e.bindTexture(n.TEXTURE_CUBE_MAP,rt.__webglTexture),pt(n.TEXTURE_CUBE_MAP,S);for(let et=0;et<6;et++)if(S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)mt(W.__webglFramebuffer[et][xt],P,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+et,xt);else mt(W.__webglFramebuffer[et],P,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0);m(S)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(kt){for(let et=0,xt=ct.length;et<xt;et++){const Bt=ct[et],nt=i.get(Bt);e.bindTexture(n.TEXTURE_2D,nt.__webglTexture),pt(n.TEXTURE_2D,Bt),mt(W.__webglFramebuffer,P,Bt,n.COLOR_ATTACHMENT0+et,n.TEXTURE_2D,0),m(Bt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let et=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(et=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(et,rt.__webglTexture),pt(et,S),S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)mt(W.__webglFramebuffer[xt],P,S,n.COLOR_ATTACHMENT0,et,xt);else mt(W.__webglFramebuffer,P,S,n.COLOR_ATTACHMENT0,et,0);m(S)&&p(et),e.unbindTexture()}P.depthBuffer&&Lt(P)}function At(P){const S=P.textures;for(let W=0,rt=S.length;W<rt;W++){const ct=S[W];if(m(ct)){const st=x(P),kt=i.get(ct).__webglTexture;e.bindTexture(st,kt),p(st),e.unbindTexture()}}}const bt=[],O=[];function Zt(P){if(P.samples>0){if(It(P)===!1){const S=P.textures,W=P.width,rt=P.height;let ct=n.COLOR_BUFFER_BIT;const st=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,kt=i.get(P),et=S.length>1;if(et)for(let xt=0;xt<S.length;xt++)e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,kt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglFramebuffer);for(let xt=0;xt<S.length;xt++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ct|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ct|=n.STENCIL_BUFFER_BIT)),et){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,kt.__webglColorRenderbuffer[xt]);const Bt=i.get(S[xt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Bt,0)}n.blitFramebuffer(0,0,W,rt,0,0,W,rt,ct,n.NEAREST),c===!0&&(bt.length=0,O.length=0,bt.push(n.COLOR_ATTACHMENT0+xt),P.depthBuffer&&P.resolveDepthBuffer===!1&&(bt.push(st),O.push(st),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,O)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,bt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),et)for(let xt=0;xt<S.length;xt++){e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.RENDERBUFFER,kt.__webglColorRenderbuffer[xt]);const Bt=i.get(S[xt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.TEXTURE_2D,Bt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&c){const S=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function Dt(P){return Math.min(a.maxSamples,P.samples)}function It(P){const S=i.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function St(P){const S=o.render.frame;d.get(P)!==S&&(d.set(P,S),P.update())}function Et(P,S){const W=P.colorSpace,rt=P.format,ct=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||W!==Qi&&W!==Kn&&(se.getTransfer(W)===ue?(rt!==_n||ct!==Hn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),S}function Rt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(l.width=P.naturalWidth||P.width,l.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(l.width=P.displayWidth,l.height=P.displayHeight):(l.width=P.width,l.height=P.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=H,this.setTexture2D=C,this.setTexture2DArray=A,this.setTexture3D=V,this.setTextureCube=B,this.rebindTextures=Ct,this.setupRenderTarget=zt,this.updateRenderTargetMipmap=At,this.updateMultisampleRenderTarget=Zt,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=mt,this.useMultisampledRTT=It}function iv(n,t){function e(i,a=Kn){let s;const o=se.getTransfer(a);if(i===Hn)return n.UNSIGNED_BYTE;if(i===ec)return n.UNSIGNED_SHORT_4_4_4_4;if(i===nc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Cd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ad)return n.BYTE;if(i===Rd)return n.SHORT;if(i===ba)return n.UNSIGNED_SHORT;if(i===tc)return n.INT;if(i===Si)return n.UNSIGNED_INT;if(i===zn)return n.FLOAT;if(i===wa)return n.HALF_FLOAT;if(i===Pd)return n.ALPHA;if(i===Dd)return n.RGB;if(i===_n)return n.RGBA;if(i===Ld)return n.LUMINANCE;if(i===Id)return n.LUMINANCE_ALPHA;if(i===Wi)return n.DEPTH_COMPONENT;if(i===Ki)return n.DEPTH_STENCIL;if(i===kd)return n.RED;if(i===ic)return n.RED_INTEGER;if(i===Ud)return n.RG;if(i===ac)return n.RG_INTEGER;if(i===sc)return n.RGBA_INTEGER;if(i===cs||i===ls||i===ds||i===hs)if(o===ue)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===cs)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ls)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ds)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===hs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===cs)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ls)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ds)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===hs)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===fr||i===pr||i===mr||i===gr)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===fr)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===pr)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===mr)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===gr)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===_r||i===xr||i===vr)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===_r||i===xr)return o===ue?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===vr)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Mr||i===yr||i===Sr||i===br||i===Er||i===wr||i===Tr||i===Ar||i===Rr||i===Cr||i===Pr||i===Dr||i===Lr||i===Ir)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Mr)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===yr)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Sr)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===br)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Er)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===wr)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Tr)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ar)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Rr)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Cr)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Pr)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Dr)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Lr)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ir)return o===ue?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===us||i===kr||i===Ur)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===us)return o===ue?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===kr)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ur)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Fd||i===Fr||i===Nr||i===zr)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===us)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Fr)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Nr)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===zr)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ji?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class av extends an{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Te extends Ee{constructor(){super(),this.isGroup=!0,this.type="Group"}}const sv={type:"move"};class Do{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Te,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Te,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Te,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const d=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],h=d.position.distanceTo(f.position),u=.02,g=.005;l.inputState.pinching&&h>u+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=u-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(sv)))}return r!==null&&(r.visible=a!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Te;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const ov=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,rv=`
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

}`;class cv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new $e,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ni({vertexShader:ov,fragmentShader:rv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new pe(new Us(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class lv extends ta{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",c=1,l=null,d=null,f=null,h=null,u=null,g=null;const _=new cv,m=e.getContextAttributes();let p=null,x=null;const M=[],v=[],U=new ne;let R=null;const T=new an;T.viewport=new ve;const w=new an;w.viewport=new ve;const b=[T,w],y=new av;let D=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let tt=M[Y];return tt===void 0&&(tt=new Do,M[Y]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Y){let tt=M[Y];return tt===void 0&&(tt=new Do,M[Y]=tt),tt.getGripSpace()},this.getHand=function(Y){let tt=M[Y];return tt===void 0&&(tt=new Do,M[Y]=tt),tt.getHandSpace()};function z(Y){const tt=v.indexOf(Y.inputSource);if(tt===-1)return;const mt=M[tt];mt!==void 0&&(mt.update(Y.inputSource,Y.frame,l||o),mt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function G(){a.removeEventListener("select",z),a.removeEventListener("selectstart",z),a.removeEventListener("selectend",z),a.removeEventListener("squeeze",z),a.removeEventListener("squeezestart",z),a.removeEventListener("squeezeend",z),a.removeEventListener("end",G),a.removeEventListener("inputsourceschange",C);for(let Y=0;Y<M.length;Y++){const tt=v[Y];tt!==null&&(v[Y]=null,M[Y].disconnect(tt))}D=null,H=null,_.reset(),t.setRenderTarget(p),u=null,h=null,f=null,a=null,x=null,Mt.stop(),i.isPresenting=!1,t.setPixelRatio(R),t.setSize(U.width,U.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){r=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return h!==null?h:u},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return a},this.setSession=async function(Y){if(a=Y,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",z),a.addEventListener("selectstart",z),a.addEventListener("selectend",z),a.addEventListener("squeeze",z),a.addEventListener("squeezestart",z),a.addEventListener("squeezeend",z),a.addEventListener("end",G),a.addEventListener("inputsourceschange",C),m.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(U),a.renderState.layers===void 0){const tt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(a,e,tt),a.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new bi(u.framebufferWidth,u.framebufferHeight,{format:_n,type:Hn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let tt=null,mt=null,K=null;m.depth&&(K=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=m.stencil?Ki:Wi,mt=m.stencil?ji:Si);const gt={colorFormat:e.RGBA8,depthFormat:K,scaleFactor:s};f=new XRWebGLBinding(a,e),h=f.createProjectionLayer(gt),a.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),x=new bi(h.textureWidth,h.textureHeight,{format:_n,type:Hn,depthTexture:new jd(h.textureWidth,h.textureHeight,mt,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await a.requestReferenceSpace(r),Mt.setContext(a),Mt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function C(Y){for(let tt=0;tt<Y.removed.length;tt++){const mt=Y.removed[tt],K=v.indexOf(mt);K>=0&&(v[K]=null,M[K].disconnect(mt))}for(let tt=0;tt<Y.added.length;tt++){const mt=Y.added[tt];let K=v.indexOf(mt);if(K===-1){for(let Lt=0;Lt<M.length;Lt++)if(Lt>=v.length){v.push(mt),K=Lt;break}else if(v[Lt]===null){v[Lt]=mt,K=Lt;break}if(K===-1)break}const gt=M[K];gt&&gt.connect(mt)}}const A=new q,V=new q;function B(Y,tt,mt){A.setFromMatrixPosition(tt.matrixWorld),V.setFromMatrixPosition(mt.matrixWorld);const K=A.distanceTo(V),gt=tt.projectionMatrix.elements,Lt=mt.projectionMatrix.elements,Ct=gt[14]/(gt[10]-1),zt=gt[14]/(gt[10]+1),At=(gt[9]+1)/gt[5],bt=(gt[9]-1)/gt[5],O=(gt[8]-1)/gt[0],Zt=(Lt[8]+1)/Lt[0],Dt=Ct*O,It=Ct*Zt,St=K/(-O+Zt),Et=St*-O;if(tt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Et),Y.translateZ(St),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),gt[10]===-1)Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const Rt=Ct+St,P=zt+St,S=Dt-Et,W=It+(K-Et),rt=At*zt/P*Rt,ct=bt*zt/P*Rt;Y.projectionMatrix.makePerspective(S,W,rt,ct,Rt,P),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function j(Y,tt){tt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(tt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(a===null)return;let tt=Y.near,mt=Y.far;_.texture!==null&&(_.depthNear>0&&(tt=_.depthNear),_.depthFar>0&&(mt=_.depthFar)),y.near=w.near=T.near=tt,y.far=w.far=T.far=mt,(D!==y.near||H!==y.far)&&(a.updateRenderState({depthNear:y.near,depthFar:y.far}),D=y.near,H=y.far),T.layers.mask=Y.layers.mask|2,w.layers.mask=Y.layers.mask|4,y.layers.mask=T.layers.mask|w.layers.mask;const K=Y.parent,gt=y.cameras;j(y,K);for(let Lt=0;Lt<gt.length;Lt++)j(gt[Lt],K);gt.length===2?B(y,T,w):y.projectionMatrix.copy(T.projectionMatrix),J(Y,y,K)};function J(Y,tt,mt){mt===null?Y.matrix.copy(tt.matrixWorld):(Y.matrix.copy(mt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(tt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Or*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&u===null))return c},this.setFoveation=function(Y){c=Y,h!==null&&(h.fixedFoveation=Y),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let lt=null;function pt(Y,tt){if(d=tt.getViewerPose(l||o),g=tt,d!==null){const mt=d.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let K=!1;mt.length!==y.cameras.length&&(y.cameras.length=0,K=!0);for(let Lt=0;Lt<mt.length;Lt++){const Ct=mt[Lt];let zt=null;if(u!==null)zt=u.getViewport(Ct);else{const bt=f.getViewSubImage(h,Ct);zt=bt.viewport,Lt===0&&(t.setRenderTargetTextures(x,bt.colorTexture,h.ignoreDepthValues?void 0:bt.depthStencilTexture),t.setRenderTarget(x))}let At=b[Lt];At===void 0&&(At=new an,At.layers.enable(Lt),At.viewport=new ve,b[Lt]=At),At.matrix.fromArray(Ct.transform.matrix),At.matrix.decompose(At.position,At.quaternion,At.scale),At.projectionMatrix.fromArray(Ct.projectionMatrix),At.projectionMatrixInverse.copy(At.projectionMatrix).invert(),At.viewport.set(zt.x,zt.y,zt.width,zt.height),Lt===0&&(y.matrix.copy(At.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),K===!0&&y.cameras.push(At)}const gt=a.enabledFeatures;if(gt&&gt.includes("depth-sensing")){const Lt=f.getDepthInformation(mt[0]);Lt&&Lt.isValid&&Lt.texture&&_.init(t,Lt,a.renderState)}}for(let mt=0;mt<M.length;mt++){const K=v[mt],gt=M[mt];K!==null&&gt!==void 0&&gt.update(K,tt,l||o)}lt&&lt(Y,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),g=null}const Mt=new Zd;Mt.setAnimationLoop(pt),this.setAnimationLoop=function(Y){lt=Y},this.dispose=function(){}}}const hi=new Tn,dv=new ge;function hv(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Wd(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function a(m,p,x,M,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),f(m,p)):p.isMeshPhongMaterial?(s(m,p),d(m,p)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&u(m,p,v)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?c(m,p,x,M):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===We&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===We&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),M=x.envMap,v=x.envMapRotation;M&&(m.envMap.value=M,hi.copy(v),hi.x*=-1,hi.y*=-1,hi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),m.envMapRotation.value.setFromMatrix4(dv.makeRotationFromEuler(hi)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=M*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===We&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function uv(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,M){const v=M.program;i.uniformBlockBinding(x,v)}function l(x,M){let v=a[x.id];v===void 0&&(g(x),v=d(x),a[x.id]=v,x.addEventListener("dispose",m));const U=M.program;i.updateUBOMapping(x,U);const R=t.render.frame;s[x.id]!==R&&(h(x),s[x.id]=R)}function d(x){const M=f();x.__bindingPointIndex=M;const v=n.createBuffer(),U=x.__size,R=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,U,R),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,v),v}function f(){for(let x=0;x<r;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){const M=a[x.id],v=x.uniforms,U=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let R=0,T=v.length;R<T;R++){const w=Array.isArray(v[R])?v[R]:[v[R]];for(let b=0,y=w.length;b<y;b++){const D=w[b];if(u(D,R,b,U)===!0){const H=D.__offset,z=Array.isArray(D.value)?D.value:[D.value];let G=0;for(let C=0;C<z.length;C++){const A=z[C],V=_(A);typeof A=="number"||typeof A=="boolean"?(D.__data[0]=A,n.bufferSubData(n.UNIFORM_BUFFER,H+G,D.__data)):A.isMatrix3?(D.__data[0]=A.elements[0],D.__data[1]=A.elements[1],D.__data[2]=A.elements[2],D.__data[3]=0,D.__data[4]=A.elements[3],D.__data[5]=A.elements[4],D.__data[6]=A.elements[5],D.__data[7]=0,D.__data[8]=A.elements[6],D.__data[9]=A.elements[7],D.__data[10]=A.elements[8],D.__data[11]=0):(A.toArray(D.__data,G),G+=V.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,H,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,M,v,U){const R=x.value,T=M+"_"+v;if(U[T]===void 0)return typeof R=="number"||typeof R=="boolean"?U[T]=R:U[T]=R.clone(),!0;{const w=U[T];if(typeof R=="number"||typeof R=="boolean"){if(w!==R)return U[T]=R,!0}else if(w.equals(R)===!1)return w.copy(R),!0}return!1}function g(x){const M=x.uniforms;let v=0;const U=16;for(let T=0,w=M.length;T<w;T++){const b=Array.isArray(M[T])?M[T]:[M[T]];for(let y=0,D=b.length;y<D;y++){const H=b[y],z=Array.isArray(H.value)?H.value:[H.value];for(let G=0,C=z.length;G<C;G++){const A=z[G],V=_(A),B=v%U,j=B%V.boundary,J=B+j;v+=j,J!==0&&U-J<V.storage&&(v+=U-J),H.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=v,v+=V.storage}}}const R=v%U;return R>0&&(v+=U-R),x.__size=v,x.__cache={},this}function _(x){const M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=48,M.storage=48):x.isMatrix4?(M.boundary=64,M.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),M}function m(x){const M=x.target;M.removeEventListener("dispose",m);const v=o.indexOf(M.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(a[M.id]),delete a[M.id],delete s[M.id]}function p(){for(const x in a)n.deleteBuffer(a[x]);o=[],a={},s={}}return{bind:c,update:l,dispose:p}}class fv{constructor(t={}){const{canvas:e=em(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const x=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=nn,this.toneMapping=ti,this.toneMappingExposure=1;const v=this;let U=!1,R=0,T=0,w=null,b=-1,y=null;const D=new ve,H=new ve;let z=null;const G=new Wt(0);let C=0,A=e.width,V=e.height,B=1,j=null,J=null;const lt=new ve(0,0,A,V),pt=new ve(0,0,A,V);let Mt=!1;const Y=new cc;let tt=!1,mt=!1;const K=new ge,gt=new ge,Lt=new q,Ct=new ve,zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let At=!1;function bt(){return w===null?B:1}let O=i;function Zt(E,$){return e.getContext(E,$)}try{const E={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Jr}`),e.addEventListener("webglcontextlost",Q,!1),e.addEventListener("webglcontextrestored",_t,!1),e.addEventListener("webglcontextcreationerror",vt,!1),O===null){const $="webgl2";if(O=Zt($,E),O===null)throw Zt($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Dt,It,St,Et,Rt,P,S,W,rt,ct,st,kt,et,xt,Bt,nt,yt,N,it,ut,Ft,X,ft,L;function dt(){Dt=new x_(O),Dt.init(),X=new iv(O,Dt),It=new u_(O,Dt,t,X),St=new tv(O,Dt),It.reverseDepthBuffer&&h&&St.buffers.depth.setReversed(!0),Et=new y_(O),Rt=new Ox,P=new nv(O,Dt,St,Rt,It,X,Et),S=new p_(v),W=new __(v),rt=new Rm(O),ft=new d_(O,rt),ct=new v_(O,rt,Et,ft),st=new b_(O,ct,rt,Et),it=new S_(O,It,P),nt=new f_(Rt),kt=new zx(v,S,W,Dt,It,ft,nt),et=new hv(v,Rt),xt=new Hx,Bt=new Yx(Dt),N=new l_(v,S,W,St,st,u,c),yt=new Jx(v,st,It),L=new uv(O,Et,It,St),ut=new h_(O,Dt,Et),Ft=new M_(O,Dt,Et),Et.programs=kt.programs,v.capabilities=It,v.extensions=Dt,v.properties=Rt,v.renderLists=xt,v.shadowMap=yt,v.state=St,v.info=Et}dt();const Z=new lv(v,O);this.xr=Z,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const E=Dt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Dt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(E){E!==void 0&&(B=E,this.setSize(A,V,!1))},this.getSize=function(E){return E.set(A,V)},this.setSize=function(E,$,I=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}A=E,V=$,e.width=Math.floor(E*B),e.height=Math.floor($*B),I===!0&&(e.style.width=E+"px",e.style.height=$+"px"),this.setViewport(0,0,E,$)},this.getDrawingBufferSize=function(E){return E.set(A*B,V*B).floor()},this.setDrawingBufferSize=function(E,$,I){A=E,V=$,B=I,e.width=Math.floor(E*I),e.height=Math.floor($*I),this.setViewport(0,0,E,$)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(lt)},this.setViewport=function(E,$,I,F){E.isVector4?lt.set(E.x,E.y,E.z,E.w):lt.set(E,$,I,F),St.viewport(D.copy(lt).multiplyScalar(B).round())},this.getScissor=function(E){return E.copy(pt)},this.setScissor=function(E,$,I,F){E.isVector4?pt.set(E.x,E.y,E.z,E.w):pt.set(E,$,I,F),St.scissor(H.copy(pt).multiplyScalar(B).round())},this.getScissorTest=function(){return Mt},this.setScissorTest=function(E){St.setScissorTest(Mt=E)},this.setOpaqueSort=function(E){j=E},this.setTransparentSort=function(E){J=E},this.getClearColor=function(E){return E.copy(N.getClearColor())},this.setClearColor=function(){N.setClearColor.apply(N,arguments)},this.getClearAlpha=function(){return N.getClearAlpha()},this.setClearAlpha=function(){N.setClearAlpha.apply(N,arguments)},this.clear=function(E=!0,$=!0,I=!0){let F=0;if(E){let k=!1;if(w!==null){const at=w.texture.format;k=at===sc||at===ac||at===ic}if(k){const at=w.texture.type,ot=at===Hn||at===Si||at===ba||at===ji||at===ec||at===nc,ht=N.getClearColor(),Tt=N.getClearAlpha(),Ht=ht.r,Gt=ht.g,Ut=ht.b;ot?(g[0]=Ht,g[1]=Gt,g[2]=Ut,g[3]=Tt,O.clearBufferuiv(O.COLOR,0,g)):(_[0]=Ht,_[1]=Gt,_[2]=Ut,_[3]=Tt,O.clearBufferiv(O.COLOR,0,_))}else F|=O.COLOR_BUFFER_BIT}$&&(F|=O.DEPTH_BUFFER_BIT),I&&(F|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(F)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Q,!1),e.removeEventListener("webglcontextrestored",_t,!1),e.removeEventListener("webglcontextcreationerror",vt,!1),xt.dispose(),Bt.dispose(),Rt.dispose(),S.dispose(),W.dispose(),st.dispose(),ft.dispose(),L.dispose(),kt.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",ye),Z.removeEventListener("sessionend",xe),Jt.stop()};function Q(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),U=!0}function _t(){console.log("THREE.WebGLRenderer: Context Restored."),U=!1;const E=Et.autoReset,$=yt.enabled,I=yt.autoUpdate,F=yt.needsUpdate,k=yt.type;dt(),Et.autoReset=E,yt.enabled=$,yt.autoUpdate=I,yt.needsUpdate=F,yt.type=k}function vt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Ot(E){const $=E.target;$.removeEventListener("dispose",Ot),Yt($)}function Yt(E){ie(E),Rt.remove(E)}function ie(E){const $=Rt.get(E).programs;$!==void 0&&($.forEach(function(I){kt.releaseProgram(I)}),E.isShaderMaterial&&kt.releaseShaderCache(E))}this.renderBufferDirect=function(E,$,I,F,k,at){$===null&&($=zt);const ot=k.isMesh&&k.matrixWorld.determinant()<0,ht=qe(E,$,I,F,k);St.setMaterial(F,ot);let Tt=I.index,Ht=1;if(F.wireframe===!0){if(Tt=ct.getWireframeAttribute(I),Tt===void 0)return;Ht=2}const Gt=I.drawRange,Ut=I.attributes.position;let Xt=Gt.start*Ht,jt=(Gt.start+Gt.count)*Ht;at!==null&&(Xt=Math.max(Xt,at.start*Ht),jt=Math.min(jt,(at.start+at.count)*Ht)),Tt!==null?(Xt=Math.max(Xt,0),jt=Math.min(jt,Tt.count)):Ut!=null&&(Xt=Math.max(Xt,0),jt=Math.min(jt,Ut.count));const te=jt-Xt;if(te<0||te===1/0)return;ft.setup(k,F,ht,I,Tt);let Se,Qt=ut;if(Tt!==null&&(Se=rt.get(Tt),Qt=Ft,Qt.setIndex(Se)),k.isMesh)F.wireframe===!0?(St.setLineWidth(F.wireframeLinewidth*bt()),Qt.setMode(O.LINES)):Qt.setMode(O.TRIANGLES);else if(k.isLine){let Nt=F.linewidth;Nt===void 0&&(Nt=1),St.setLineWidth(Nt*bt()),k.isLineSegments?Qt.setMode(O.LINES):k.isLineLoop?Qt.setMode(O.LINE_LOOP):Qt.setMode(O.LINE_STRIP)}else k.isPoints?Qt.setMode(O.POINTS):k.isSprite&&Qt.setMode(O.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Qt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Dt.get("WEBGL_multi_draw"))Qt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Nt=k._multiDrawStarts,dn=k._multiDrawCounts,oe=k._multiDrawCount,je=Tt?rt.get(Tt).bytesPerElement:1,Vn=Rt.get(F).currentProgram.getUniforms();for(let Ne=0;Ne<oe;Ne++)Vn.setValue(O,"_gl_DrawID",Ne),Qt.render(Nt[Ne]/je,dn[Ne])}else if(k.isInstancedMesh)Qt.renderInstances(Xt,te,k.count);else if(I.isInstancedBufferGeometry){const Nt=I._maxInstanceCount!==void 0?I._maxInstanceCount:1/0,dn=Math.min(I.instanceCount,Nt);Qt.renderInstances(Xt,te,dn)}else Qt.render(Xt,te)};function Vt(E,$,I){E.transparent===!0&&E.side===Le&&E.forceSinglePass===!1?(E.side=We,E.needsUpdate=!0,ae(E,$,I),E.side=ei,E.needsUpdate=!0,ae(E,$,I),E.side=Le):ae(E,$,I)}this.compile=function(E,$,I=null){I===null&&(I=E),p=Bt.get(I),p.init($),M.push(p),I.traverseVisible(function(k){k.isLight&&k.layers.test($.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),E!==I&&E.traverseVisible(function(k){k.isLight&&k.layers.test($.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),p.setupLights();const F=new Set;return E.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const at=k.material;if(at)if(Array.isArray(at))for(let ot=0;ot<at.length;ot++){const ht=at[ot];Vt(ht,I,k),F.add(ht)}else Vt(at,I,k),F.add(at)}),M.pop(),p=null,F},this.compileAsync=function(E,$,I=null){const F=this.compile(E,$,I);return new Promise(k=>{function at(){if(F.forEach(function(ot){Rt.get(ot).currentProgram.isReady()&&F.delete(ot)}),F.size===0){k(E);return}setTimeout(at,10)}Dt.get("KHR_parallel_shader_compile")!==null?at():setTimeout(at,10)})};let de=null;function he(E){de&&de(E)}function ye(){Jt.stop()}function xe(){Jt.start()}const Jt=new Zd;Jt.setAnimationLoop(he),typeof self<"u"&&Jt.setContext(self),this.setAnimationLoop=function(E){de=E,Z.setAnimationLoop(E),E===null?Jt.stop():Jt.start()},Z.addEventListener("sessionstart",ye),Z.addEventListener("sessionend",xe),this.render=function(E,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera($),$=Z.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,$,w),p=Bt.get(E,M.length),p.init($),M.push(p),gt.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),Y.setFromProjectionMatrix(gt),mt=this.localClippingEnabled,tt=nt.init(this.clippingPlanes,mt),m=xt.get(E,x.length),m.init(),x.push(m),Z.enabled===!0&&Z.isPresenting===!0){const at=v.xr.getDepthSensingMesh();at!==null&&le(at,$,-1/0,v.sortObjects)}le(E,$,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(j,J),At=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,At&&N.addToRenderList(m,E),this.info.render.frame++,tt===!0&&nt.beginShadows();const I=p.state.shadowsArray;yt.render(I,E,$),tt===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const F=m.opaque,k=m.transmissive;if(p.setupLights(),$.isArrayCamera){const at=$.cameras;if(k.length>0)for(let ot=0,ht=at.length;ot<ht;ot++){const Tt=at[ot];$t(F,k,E,Tt)}At&&N.render(E);for(let ot=0,ht=at.length;ot<ht;ot++){const Tt=at[ot];wt(m,E,Tt,Tt.viewport)}}else k.length>0&&$t(F,k,E,$),At&&N.render(E),wt(m,E,$);w!==null&&(P.updateMultisampleRenderTarget(w),P.updateRenderTargetMipmap(w)),E.isScene===!0&&E.onAfterRender(v,E,$),ft.resetDefaultState(),b=-1,y=null,M.pop(),M.length>0?(p=M[M.length-1],tt===!0&&nt.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function le(E,$,I,F){if(E.visible===!1)return;if(E.layers.test($.layers)){if(E.isGroup)I=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update($);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Y.intersectsSprite(E)){F&&Ct.setFromMatrixPosition(E.matrixWorld).applyMatrix4(gt);const ot=st.update(E),ht=E.material;ht.visible&&m.push(E,ot,ht,I,Ct.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Y.intersectsObject(E))){const ot=st.update(E),ht=E.material;if(F&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ct.copy(E.boundingSphere.center)):(ot.boundingSphere===null&&ot.computeBoundingSphere(),Ct.copy(ot.boundingSphere.center)),Ct.applyMatrix4(E.matrixWorld).applyMatrix4(gt)),Array.isArray(ht)){const Tt=ot.groups;for(let Ht=0,Gt=Tt.length;Ht<Gt;Ht++){const Ut=Tt[Ht],Xt=ht[Ut.materialIndex];Xt&&Xt.visible&&m.push(E,ot,Xt,I,Ct.z,Ut)}}else ht.visible&&m.push(E,ot,ht,I,Ct.z,null)}}const at=E.children;for(let ot=0,ht=at.length;ot<ht;ot++)le(at[ot],$,I,F)}function wt(E,$,I,F){const k=E.opaque,at=E.transmissive,ot=E.transparent;p.setupLightsView(I),tt===!0&&nt.setGlobalState(v.clippingPlanes,I),F&&St.viewport(D.copy(F)),k.length>0&&re(k,$,I),at.length>0&&re(at,$,I),ot.length>0&&re(ot,$,I),St.buffers.depth.setTest(!0),St.buffers.depth.setMask(!0),St.buffers.color.setMask(!0),St.setPolygonOffset(!1)}function $t(E,$,I,F){if((I.isScene===!0?I.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[F.id]===void 0&&(p.state.transmissionRenderTarget[F.id]=new bi(1,1,{generateMipmaps:!0,type:Dt.has("EXT_color_buffer_half_float")||Dt.has("EXT_color_buffer_float")?wa:Hn,minFilter:vi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:se.workingColorSpace}));const at=p.state.transmissionRenderTarget[F.id],ot=F.viewport||D;at.setSize(ot.z,ot.w);const ht=v.getRenderTarget();v.setRenderTarget(at),v.getClearColor(G),C=v.getClearAlpha(),C<1&&v.setClearColor(16777215,.5),v.clear(),At&&N.render(I);const Tt=v.toneMapping;v.toneMapping=ti;const Ht=F.viewport;if(F.viewport!==void 0&&(F.viewport=void 0),p.setupLightsView(F),tt===!0&&nt.setGlobalState(v.clippingPlanes,F),re(E,I,F),P.updateMultisampleRenderTarget(at),P.updateRenderTargetMipmap(at),Dt.has("WEBGL_multisampled_render_to_texture")===!1){let Gt=!1;for(let Ut=0,Xt=$.length;Ut<Xt;Ut++){const jt=$[Ut],te=jt.object,Se=jt.geometry,Qt=jt.material,Nt=jt.group;if(Qt.side===Le&&te.layers.test(F.layers)){const dn=Qt.side;Qt.side=We,Qt.needsUpdate=!0,Pe(te,I,F,Se,Qt,Nt),Qt.side=dn,Qt.needsUpdate=!0,Gt=!0}}Gt===!0&&(P.updateMultisampleRenderTarget(at),P.updateRenderTargetMipmap(at))}v.setRenderTarget(ht),v.setClearColor(G,C),Ht!==void 0&&(F.viewport=Ht),v.toneMapping=Tt}function re(E,$,I){const F=$.isScene===!0?$.overrideMaterial:null;for(let k=0,at=E.length;k<at;k++){const ot=E[k],ht=ot.object,Tt=ot.geometry,Ht=F===null?ot.material:F,Gt=ot.group;ht.layers.test(I.layers)&&Pe(ht,$,I,Tt,Ht,Gt)}}function Pe(E,$,I,F,k,at){E.onBeforeRender(v,$,I,F,k,at),E.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),k.onBeforeRender(v,$,I,F,E,at),k.transparent===!0&&k.side===Le&&k.forceSinglePass===!1?(k.side=We,k.needsUpdate=!0,v.renderBufferDirect(I,$,F,k,E,at),k.side=ei,k.needsUpdate=!0,v.renderBufferDirect(I,$,F,k,E,at),k.side=Le):v.renderBufferDirect(I,$,F,k,E,at),E.onAfterRender(v,$,I,F,k,at)}function ae(E,$,I){$.isScene!==!0&&($=zt);const F=Rt.get(E),k=p.state.lights,at=p.state.shadowsArray,ot=k.state.version,ht=kt.getParameters(E,k.state,at,$,I),Tt=kt.getProgramCacheKey(ht);let Ht=F.programs;F.environment=E.isMeshStandardMaterial?$.environment:null,F.fog=$.fog,F.envMap=(E.isMeshStandardMaterial?W:S).get(E.envMap||F.environment),F.envMapRotation=F.environment!==null&&E.envMap===null?$.environmentRotation:E.envMapRotation,Ht===void 0&&(E.addEventListener("dispose",Ot),Ht=new Map,F.programs=Ht);let Gt=Ht.get(Tt);if(Gt!==void 0){if(F.currentProgram===Gt&&F.lightsStateVersion===ot)return Ie(E,ht),Gt}else ht.uniforms=kt.getUniforms(E),E.onBeforeCompile(ht,v),Gt=kt.acquireProgram(ht,Tt),Ht.set(Tt,Gt),F.uniforms=ht.uniforms;const Ut=F.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ut.clippingPlanes=nt.uniform),Ie(E,ht),F.needsLights=ln(E),F.lightsStateVersion=ot,F.needsLights&&(Ut.ambientLightColor.value=k.state.ambient,Ut.lightProbe.value=k.state.probe,Ut.directionalLights.value=k.state.directional,Ut.directionalLightShadows.value=k.state.directionalShadow,Ut.spotLights.value=k.state.spot,Ut.spotLightShadows.value=k.state.spotShadow,Ut.rectAreaLights.value=k.state.rectArea,Ut.ltc_1.value=k.state.rectAreaLTC1,Ut.ltc_2.value=k.state.rectAreaLTC2,Ut.pointLights.value=k.state.point,Ut.pointLightShadows.value=k.state.pointShadow,Ut.hemisphereLights.value=k.state.hemi,Ut.directionalShadowMap.value=k.state.directionalShadowMap,Ut.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ut.spotShadowMap.value=k.state.spotShadowMap,Ut.spotLightMatrix.value=k.state.spotLightMatrix,Ut.spotLightMap.value=k.state.spotLightMap,Ut.pointShadowMap.value=k.state.pointShadowMap,Ut.pointShadowMatrix.value=k.state.pointShadowMatrix),F.currentProgram=Gt,F.uniformsList=null,Gt}function Ze(E){if(E.uniformsList===null){const $=E.currentProgram.getUniforms();E.uniformsList=ps.seqWithValue($.seq,E.uniforms)}return E.uniformsList}function Ie(E,$){const I=Rt.get(E);I.outputColorSpace=$.outputColorSpace,I.batching=$.batching,I.batchingColor=$.batchingColor,I.instancing=$.instancing,I.instancingColor=$.instancingColor,I.instancingMorph=$.instancingMorph,I.skinning=$.skinning,I.morphTargets=$.morphTargets,I.morphNormals=$.morphNormals,I.morphColors=$.morphColors,I.morphTargetsCount=$.morphTargetsCount,I.numClippingPlanes=$.numClippingPlanes,I.numIntersection=$.numClipIntersection,I.vertexAlphas=$.vertexAlphas,I.vertexTangents=$.vertexTangents,I.toneMapping=$.toneMapping}function qe(E,$,I,F,k){$.isScene!==!0&&($=zt),P.resetTextureUnits();const at=$.fog,ot=F.isMeshStandardMaterial?$.environment:null,ht=w===null?v.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:Qi,Tt=(F.isMeshStandardMaterial?W:S).get(F.envMap||ot),Ht=F.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,Gt=!!I.attributes.tangent&&(!!F.normalMap||F.anisotropy>0),Ut=!!I.morphAttributes.position,Xt=!!I.morphAttributes.normal,jt=!!I.morphAttributes.color;let te=ti;F.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(te=v.toneMapping);const Se=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,Qt=Se!==void 0?Se.length:0,Nt=Rt.get(F),dn=p.state.lights;if(tt===!0&&(mt===!0||E!==y)){const ze=E===y&&F.id===b;nt.setState(F,E,ze)}let oe=!1;F.version===Nt.__version?(Nt.needsLights&&Nt.lightsStateVersion!==dn.state.version||Nt.outputColorSpace!==ht||k.isBatchedMesh&&Nt.batching===!1||!k.isBatchedMesh&&Nt.batching===!0||k.isBatchedMesh&&Nt.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Nt.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Nt.instancing===!1||!k.isInstancedMesh&&Nt.instancing===!0||k.isSkinnedMesh&&Nt.skinning===!1||!k.isSkinnedMesh&&Nt.skinning===!0||k.isInstancedMesh&&Nt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Nt.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Nt.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Nt.instancingMorph===!1&&k.morphTexture!==null||Nt.envMap!==Tt||F.fog===!0&&Nt.fog!==at||Nt.numClippingPlanes!==void 0&&(Nt.numClippingPlanes!==nt.numPlanes||Nt.numIntersection!==nt.numIntersection)||Nt.vertexAlphas!==Ht||Nt.vertexTangents!==Gt||Nt.morphTargets!==Ut||Nt.morphNormals!==Xt||Nt.morphColors!==jt||Nt.toneMapping!==te||Nt.morphTargetsCount!==Qt)&&(oe=!0):(oe=!0,Nt.__version=F.version);let je=Nt.currentProgram;oe===!0&&(je=ae(F,$,k));let Vn=!1,Ne=!1,ii=!1;const fe=je.getUniforms(),Qe=Nt.uniforms;if(St.useProgram(je.program)&&(Vn=!0,Ne=!0,ii=!0),F.id!==b&&(b=F.id,Ne=!0),Vn||y!==E){St.buffers.depth.getReversed()?(K.copy(E.projectionMatrix),im(K),am(K),fe.setValue(O,"projectionMatrix",K)):fe.setValue(O,"projectionMatrix",E.projectionMatrix),fe.setValue(O,"viewMatrix",E.matrixWorldInverse);const vn=fe.map.cameraPosition;vn!==void 0&&vn.setValue(O,Lt.setFromMatrixPosition(E.matrixWorld)),It.logarithmicDepthBuffer&&fe.setValue(O,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshLambertMaterial||F.isMeshBasicMaterial||F.isMeshStandardMaterial||F.isShaderMaterial)&&fe.setValue(O,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,Ne=!0,ii=!0)}if(k.isSkinnedMesh){fe.setOptional(O,k,"bindMatrix"),fe.setOptional(O,k,"bindMatrixInverse");const ze=k.skeleton;ze&&(ze.boneTexture===null&&ze.computeBoneTexture(),fe.setValue(O,"boneTexture",ze.boneTexture,P))}k.isBatchedMesh&&(fe.setOptional(O,k,"batchingTexture"),fe.setValue(O,"batchingTexture",k._matricesTexture,P),fe.setOptional(O,k,"batchingIdTexture"),fe.setValue(O,"batchingIdTexture",k._indirectTexture,P),fe.setOptional(O,k,"batchingColorTexture"),k._colorsTexture!==null&&fe.setValue(O,"batchingColorTexture",k._colorsTexture,P));const Xn=I.morphAttributes;if((Xn.position!==void 0||Xn.normal!==void 0||Xn.color!==void 0)&&it.update(k,I,je),(Ne||Nt.receiveShadow!==k.receiveShadow)&&(Nt.receiveShadow=k.receiveShadow,fe.setValue(O,"receiveShadow",k.receiveShadow)),F.isMeshGouraudMaterial&&F.envMap!==null&&(Qe.envMap.value=Tt,Qe.flipEnvMap.value=Tt.isCubeTexture&&Tt.isRenderTargetTexture===!1?-1:1),F.isMeshStandardMaterial&&F.envMap===null&&$.environment!==null&&(Qe.envMapIntensity.value=$.environmentIntensity),Ne&&(fe.setValue(O,"toneMappingExposure",v.toneMappingExposure),Nt.needsLights&&Gn(Qe,ii),at&&F.fog===!0&&et.refreshFogUniforms(Qe,at),et.refreshMaterialUniforms(Qe,F,B,V,p.state.transmissionRenderTarget[E.id]),ps.upload(O,Ze(Nt),Qe,P)),F.isShaderMaterial&&F.uniformsNeedUpdate===!0&&(ps.upload(O,Ze(Nt),Qe,P),F.uniformsNeedUpdate=!1),F.isSpriteMaterial&&fe.setValue(O,"center",k.center),fe.setValue(O,"modelViewMatrix",k.modelViewMatrix),fe.setValue(O,"normalMatrix",k.normalMatrix),fe.setValue(O,"modelMatrix",k.matrixWorld),F.isShaderMaterial||F.isRawShaderMaterial){const ze=F.uniformsGroups;for(let vn=0,Mn=ze.length;vn<Mn;vn++){const ia=ze[vn];L.update(ia,je),L.bind(ia,je)}}return je}function Gn(E,$){E.ambientLightColor.needsUpdate=$,E.lightProbe.needsUpdate=$,E.directionalLights.needsUpdate=$,E.directionalLightShadows.needsUpdate=$,E.pointLights.needsUpdate=$,E.pointLightShadows.needsUpdate=$,E.spotLights.needsUpdate=$,E.spotLightShadows.needsUpdate=$,E.rectAreaLights.needsUpdate=$,E.hemisphereLights.needsUpdate=$}function ln(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(E,$,I){Rt.get(E.texture).__webglTexture=$,Rt.get(E.depthTexture).__webglTexture=I;const F=Rt.get(E);F.__hasExternalTextures=!0,F.__autoAllocateDepthBuffer=I===void 0,F.__autoAllocateDepthBuffer||Dt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),F.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,$){const I=Rt.get(E);I.__webglFramebuffer=$,I.__useDefaultFramebuffer=$===void 0},this.setRenderTarget=function(E,$=0,I=0){w=E,R=$,T=I;let F=!0,k=null,at=!1,ot=!1;if(E){const Tt=Rt.get(E);if(Tt.__useDefaultFramebuffer!==void 0)St.bindFramebuffer(O.FRAMEBUFFER,null),F=!1;else if(Tt.__webglFramebuffer===void 0)P.setupRenderTarget(E);else if(Tt.__hasExternalTextures)P.rebindTextures(E,Rt.get(E.texture).__webglTexture,Rt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ut=E.depthTexture;if(Tt.__boundDepthTexture!==Ut){if(Ut!==null&&Rt.has(Ut)&&(E.width!==Ut.image.width||E.height!==Ut.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(E)}}const Ht=E.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(ot=!0);const Gt=Rt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Gt[$])?k=Gt[$][I]:k=Gt[$],at=!0):E.samples>0&&P.useMultisampledRTT(E)===!1?k=Rt.get(E).__webglMultisampledFramebuffer:Array.isArray(Gt)?k=Gt[I]:k=Gt,D.copy(E.viewport),H.copy(E.scissor),z=E.scissorTest}else D.copy(lt).multiplyScalar(B).floor(),H.copy(pt).multiplyScalar(B).floor(),z=Mt;if(St.bindFramebuffer(O.FRAMEBUFFER,k)&&F&&St.drawBuffers(E,k),St.viewport(D),St.scissor(H),St.setScissorTest(z),at){const Tt=Rt.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+$,Tt.__webglTexture,I)}else if(ot){const Tt=Rt.get(E.texture),Ht=$||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Tt.__webglTexture,I||0,Ht)}b=-1},this.readRenderTargetPixels=function(E,$,I,F,k,at,ot){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ht=Rt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ot!==void 0&&(ht=ht[ot]),ht){St.bindFramebuffer(O.FRAMEBUFFER,ht);try{const Tt=E.texture,Ht=Tt.format,Gt=Tt.type;if(!It.textureFormatReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!It.textureTypeReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=E.width-F&&I>=0&&I<=E.height-k&&O.readPixels($,I,F,k,X.convert(Ht),X.convert(Gt),at)}finally{const Tt=w!==null?Rt.get(w).__webglFramebuffer:null;St.bindFramebuffer(O.FRAMEBUFFER,Tt)}}},this.readRenderTargetPixelsAsync=async function(E,$,I,F,k,at,ot){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ht=Rt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ot!==void 0&&(ht=ht[ot]),ht){const Tt=E.texture,Ht=Tt.format,Gt=Tt.type;if(!It.textureFormatReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!It.textureTypeReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if($>=0&&$<=E.width-F&&I>=0&&I<=E.height-k){St.bindFramebuffer(O.FRAMEBUFFER,ht);const Ut=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Ut),O.bufferData(O.PIXEL_PACK_BUFFER,at.byteLength,O.STREAM_READ),O.readPixels($,I,F,k,X.convert(Ht),X.convert(Gt),0);const Xt=w!==null?Rt.get(w).__webglFramebuffer:null;St.bindFramebuffer(O.FRAMEBUFFER,Xt);const jt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await nm(O,jt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Ut),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,at),O.deleteBuffer(Ut),O.deleteSync(jt),at}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,$=null,I=0){E.isTexture!==!0&&(ga("WebGLRenderer: copyFramebufferToTexture function signature has changed."),$=arguments[0]||null,E=arguments[1]);const F=Math.pow(2,-I),k=Math.floor(E.image.width*F),at=Math.floor(E.image.height*F),ot=$!==null?$.x:0,ht=$!==null?$.y:0;P.setTexture2D(E,0),O.copyTexSubImage2D(O.TEXTURE_2D,I,0,0,ot,ht,k,at),St.unbindTexture()},this.copyTextureToTexture=function(E,$,I=null,F=null,k=0){E.isTexture!==!0&&(ga("WebGLRenderer: copyTextureToTexture function signature has changed."),F=arguments[0]||null,E=arguments[1],$=arguments[2],k=arguments[3]||0,I=null);let at,ot,ht,Tt,Ht,Gt,Ut,Xt,jt;const te=E.isCompressedTexture?E.mipmaps[k]:E.image;I!==null?(at=I.max.x-I.min.x,ot=I.max.y-I.min.y,ht=I.isBox3?I.max.z-I.min.z:1,Tt=I.min.x,Ht=I.min.y,Gt=I.isBox3?I.min.z:0):(at=te.width,ot=te.height,ht=te.depth||1,Tt=0,Ht=0,Gt=0),F!==null?(Ut=F.x,Xt=F.y,jt=F.z):(Ut=0,Xt=0,jt=0);const Se=X.convert($.format),Qt=X.convert($.type);let Nt;$.isData3DTexture?(P.setTexture3D($,0),Nt=O.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(P.setTexture2DArray($,0),Nt=O.TEXTURE_2D_ARRAY):(P.setTexture2D($,0),Nt=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,$.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,$.unpackAlignment);const dn=O.getParameter(O.UNPACK_ROW_LENGTH),oe=O.getParameter(O.UNPACK_IMAGE_HEIGHT),je=O.getParameter(O.UNPACK_SKIP_PIXELS),Vn=O.getParameter(O.UNPACK_SKIP_ROWS),Ne=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,te.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,te.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Tt),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ht),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Gt);const ii=E.isDataArrayTexture||E.isData3DTexture,fe=$.isDataArrayTexture||$.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const Qe=Rt.get(E),Xn=Rt.get($),ze=Rt.get(Qe.__renderTarget),vn=Rt.get(Xn.__renderTarget);St.bindFramebuffer(O.READ_FRAMEBUFFER,ze.__webglFramebuffer),St.bindFramebuffer(O.DRAW_FRAMEBUFFER,vn.__webglFramebuffer);for(let Mn=0;Mn<ht;Mn++)ii&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Rt.get(E).__webglTexture,k,Gt+Mn),E.isDepthTexture?(fe&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Rt.get($).__webglTexture,k,jt+Mn),O.blitFramebuffer(Tt,Ht,at,ot,Ut,Xt,at,ot,O.DEPTH_BUFFER_BIT,O.NEAREST)):fe?O.copyTexSubImage3D(Nt,k,Ut,Xt,jt+Mn,Tt,Ht,at,ot):O.copyTexSubImage2D(Nt,k,Ut,Xt,jt+Mn,Tt,Ht,at,ot);St.bindFramebuffer(O.READ_FRAMEBUFFER,null),St.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else fe?E.isDataTexture||E.isData3DTexture?O.texSubImage3D(Nt,k,Ut,Xt,jt,at,ot,ht,Se,Qt,te.data):$.isCompressedArrayTexture?O.compressedTexSubImage3D(Nt,k,Ut,Xt,jt,at,ot,ht,Se,te.data):O.texSubImage3D(Nt,k,Ut,Xt,jt,at,ot,ht,Se,Qt,te):E.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,k,Ut,Xt,at,ot,Se,Qt,te.data):E.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,k,Ut,Xt,te.width,te.height,Se,te.data):O.texSubImage2D(O.TEXTURE_2D,k,Ut,Xt,at,ot,Se,Qt,te);O.pixelStorei(O.UNPACK_ROW_LENGTH,dn),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,oe),O.pixelStorei(O.UNPACK_SKIP_PIXELS,je),O.pixelStorei(O.UNPACK_SKIP_ROWS,Vn),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Ne),k===0&&$.generateMipmaps&&O.generateMipmap(Nt),St.unbindTexture()},this.copyTextureToTexture3D=function(E,$,I=null,F=null,k=0){return E.isTexture!==!0&&(ga("WebGLRenderer: copyTextureToTexture3D function signature has changed."),I=arguments[0]||null,F=arguments[1]||null,E=arguments[2],$=arguments[3],k=arguments[4]||0),ga('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,$,I,F,k)},this.initRenderTarget=function(E){Rt.get(E).__webglFramebuffer===void 0&&P.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?P.setTextureCube(E,0):E.isData3DTexture?P.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?P.setTexture2DArray(E,0):P.setTexture2D(E,0),St.unbindTexture()},this.resetState=function(){R=0,T=0,w=null,St.reset(),ft.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=se._getDrawingBufferColorSpace(t),e.unpackColorSpace=se._getUnpackColorSpace()}}class pv extends Ee{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class dc extends ea{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Wt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Rs=new q,Cs=new q,Zl=new ge,pa=new oc,es=new ks,Lo=new q,ql=new q;class mv extends Ee{constructor(t=new He,e=new dc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)Rs.fromBufferAttribute(e,a-1),Cs.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=Rs.distanceTo(Cs);t.setAttribute("lineDistance",new Me(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),es.copy(i.boundingSphere),es.applyMatrix4(a),es.radius+=s,t.ray.intersectsSphere(es)===!1)return;Zl.copy(a).invert(),pa.copy(t.ray).applyMatrix4(Zl);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const u=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=u,m=g-1;_<m;_+=l){const p=d.getX(_),x=d.getX(_+1),M=ns(this,t,pa,c,p,x);M&&e.push(M)}if(this.isLineLoop){const _=d.getX(g-1),m=d.getX(u),p=ns(this,t,pa,c,_,m);p&&e.push(p)}}else{const u=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=u,m=g-1;_<m;_+=l){const p=ns(this,t,pa,c,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=ns(this,t,pa,c,g-1,u);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function ns(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(Rs.fromBufferAttribute(o,a),Cs.fromBufferAttribute(o,s),e.distanceSqToSegment(Rs,Cs,Lo,ql)>i)return;Lo.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Lo);if(!(c<t.near||c>t.far))return{distance:c,point:ql.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const jl=new q,Kl=new q;class eh extends mv{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)jl.fromBufferAttribute(e,a),Kl.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+jl.distanceTo(Kl);t.setAttribute("lineDistance",new Me(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class hc extends He{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),l(i),d(),this.setAttribute("position",new Me(s,3)),this.setAttribute("normal",new Me(s.slice(),3)),this.setAttribute("uv",new Me(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(x){const M=new q,v=new q,U=new q;for(let R=0;R<e.length;R+=3)u(e[R+0],M),u(e[R+1],v),u(e[R+2],U),c(M,v,U,x)}function c(x,M,v,U){const R=U+1,T=[];for(let w=0;w<=R;w++){T[w]=[];const b=x.clone().lerp(v,w/R),y=M.clone().lerp(v,w/R),D=R-w;for(let H=0;H<=D;H++)H===0&&w===R?T[w][H]=b:T[w][H]=b.clone().lerp(y,H/D)}for(let w=0;w<R;w++)for(let b=0;b<2*(R-w)-1;b++){const y=Math.floor(b/2);b%2===0?(h(T[w][y+1]),h(T[w+1][y]),h(T[w][y])):(h(T[w][y+1]),h(T[w+1][y+1]),h(T[w+1][y]))}}function l(x){const M=new q;for(let v=0;v<s.length;v+=3)M.x=s[v+0],M.y=s[v+1],M.z=s[v+2],M.normalize().multiplyScalar(x),s[v+0]=M.x,s[v+1]=M.y,s[v+2]=M.z}function d(){const x=new q;for(let M=0;M<s.length;M+=3){x.x=s[M+0],x.y=s[M+1],x.z=s[M+2];const v=m(x)/2/Math.PI+.5,U=p(x)/Math.PI+.5;o.push(v,1-U)}g(),f()}function f(){for(let x=0;x<o.length;x+=6){const M=o[x+0],v=o[x+2],U=o[x+4],R=Math.max(M,v,U),T=Math.min(M,v,U);R>.9&&T<.1&&(M<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),U<.2&&(o[x+4]+=1))}}function h(x){s.push(x.x,x.y,x.z)}function u(x,M){const v=x*3;M.x=t[v+0],M.y=t[v+1],M.z=t[v+2]}function g(){const x=new q,M=new q,v=new q,U=new q,R=new ne,T=new ne,w=new ne;for(let b=0,y=0;b<s.length;b+=9,y+=6){x.set(s[b+0],s[b+1],s[b+2]),M.set(s[b+3],s[b+4],s[b+5]),v.set(s[b+6],s[b+7],s[b+8]),R.set(o[y+0],o[y+1]),T.set(o[y+2],o[y+3]),w.set(o[y+4],o[y+5]),U.copy(x).add(M).add(v).divideScalar(3);const D=m(U);_(R,y+0,x,D),_(T,y+2,M,D),_(w,y+4,v,D)}}function _(x,M,v,U){U<0&&x.x===1&&(o[M]=x.x-1),v.x===0&&v.z===0&&(o[M]=U/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hc(t.vertices,t.indices,t.radius,t.details)}}const is=new q,as=new q,Io=new q,ss=new rn;class gv extends He{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(fs*e),o=t.getIndex(),r=t.getAttribute("position"),c=o?o.count:r.count,l=[0,0,0],d=["a","b","c"],f=new Array(3),h={},u=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:p}=ss;if(_.fromBufferAttribute(r,l[0]),m.fromBufferAttribute(r,l[1]),p.fromBufferAttribute(r,l[2]),ss.getNormal(Io),f[0]=`${Math.round(_.x*a)},${Math.round(_.y*a)},${Math.round(_.z*a)}`,f[1]=`${Math.round(m.x*a)},${Math.round(m.y*a)},${Math.round(m.z*a)}`,f[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const M=(x+1)%3,v=f[x],U=f[M],R=ss[d[x]],T=ss[d[M]],w=`${v}_${U}`,b=`${U}_${v}`;b in h&&h[b]?(Io.dot(h[b].normal)<=s&&(u.push(R.x,R.y,R.z),u.push(T.x,T.y,T.z)),h[b]=null):w in h||(h[w]={index0:l[x],index1:l[M],normal:Io.clone()})}}for(const g in h)if(h[g]){const{index0:_,index1:m}=h[g];is.fromBufferAttribute(r,_),as.fromBufferAttribute(r,m),u.push(is.x,is.y,is.z),u.push(as.x,as.y,as.z)}this.setAttribute("position",new Me(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class uc extends hc{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,a=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(a,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new uc(t.radius,t.detail)}}class Ps extends He{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],c=[],l=[],d=[];let f=t;const h=(e-t)/a,u=new q,g=new ne;for(let _=0;_<=a;_++){for(let m=0;m<=i;m++){const p=s+m/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),c.push(u.x,u.y,u.z),l.push(0,0,1),g.x=(u.x/e+1)/2,g.y=(u.y/e+1)/2,d.push(g.x,g.y)}f+=h}for(let _=0;_<a;_++){const m=_*(i+1);for(let p=0;p<i;p++){const x=p+m,M=x,v=x+i+1,U=x+i+2,R=x+1;r.push(M,v,R),r.push(v,U,R)}}this.setIndex(r),this.setAttribute("position",new Me(c,3)),this.setAttribute("normal",new Me(l,3)),this.setAttribute("uv",new Me(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ps(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ns extends He{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],c=[],l=[],d=new q,f=new q,h=new q;for(let u=0;u<=i;u++)for(let g=0;g<=a;g++){const _=g/a*s,m=u/i*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(_),f.y=(t+e*Math.cos(m))*Math.sin(_),f.z=e*Math.sin(m),r.push(f.x,f.y,f.z),d.x=t*Math.cos(_),d.y=t*Math.sin(_),h.subVectors(f,d).normalize(),c.push(h.x,h.y,h.z),l.push(g/a),l.push(u/i)}for(let u=1;u<=i;u++)for(let g=1;g<=a;g++){const _=(a+1)*u+g-1,m=(a+1)*(u-1)+g-1,p=(a+1)*(u-1)+g,x=(a+1)*u+g;o.push(_,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new Me(r,3)),this.setAttribute("normal",new Me(c,3)),this.setAttribute("uv",new Me(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ns(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ea extends ea{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nd,this.normalScale=new ne(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=Qr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class nh extends Ee{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Wt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class _v extends nh{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Wt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ko=new ge,Jl=new q,Ql=new q;class xv{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ne(512,512),this.map=null,this.mapPass=null,this.matrix=new ge,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cc,this._frameExtents=new ne(1,1),this._viewportCount=1,this._viewports=[new ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Jl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Jl),Ql.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ql),e.updateMatrixWorld(),ko.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ko),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ko)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class vv extends xv{constructor(){super(new qd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Mv extends nh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.target=new Ee,this.shadow=new vv}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const td=new ge;class yv{constructor(t,e,i=0,a=1/0){this.ray=new oc(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new rc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return td.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(td),this}intersectObject(t,e=!0,i=[]){return Hr(t,this,i,e),i.sort(ed),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)Hr(t[a],this,i,e);return i.sort(ed),i}}function ed(n,t){return n.distance-t.distance}function Hr(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)Hr(s[o],t,e,!0)}}class Sv extends eh{constructor(t=10,e=10,i=4473924,a=8947848){i=new Wt(i),a=new Wt(a);const s=e/2,o=t/e,r=t/2,c=[],l=[];for(let h=0,u=0,g=-r;h<=e;h++,g+=o){c.push(-r,0,g,r,0,g),c.push(g,0,-r,g,0,r);const _=h===s?i:a;_.toArray(l,u),u+=3,_.toArray(l,u),u+=3,_.toArray(l,u),u+=3,_.toArray(l,u),u+=3}const d=new He;d.setAttribute("position",new Me(c,3)),d.setAttribute("color",new Me(l,3));const f=new dc({vertexColors:!0,toneMapped:!1});super(d,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Jr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Jr);const bv={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function Ev(n,t,e,i){const a=new an(n.fov,i,.1,200),s=new q,o=new q,r=new q;let c=!1,l=n.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function h(){const u=(n.pitchDeg+d.pitchDelta)*Math.PI/180,g=n.yawDeg*Math.PI/180;r.set(Math.sin(g)*Math.cos(u),Math.sin(u),Math.cos(g)*Math.cos(u)).multiplyScalar(n.distance*d.distanceScale*d.zoom)}return h(),{camera:a,update(u,g,_,m,p=bv){const x=g+.6;if(!c)s.set(u,x,_),c=!0;else{const U=1-Math.exp(-Math.max(n.smoothing,.001)*m);s.x+=(u-s.x)*U,s.y+=(x-s.y)*U,s.z+=(_-s.z)*U}const M=1-Math.exp(-Math.max(t.smoothing,.001)*m);d.distanceScale+=(p.distanceScale-d.distanceScale)*M,d.offsetX+=(p.offsetX-d.offsetX)*M,d.offsetZ+=(p.offsetZ-d.offsetZ)*M,d.pitchDelta+=(p.pitchDelta-d.pitchDelta)*M;const v=1-Math.exp(-Math.max(e.smoothing,.001)*m);d.zoom+=(f-d.zoom)*v,h(),(a.fov!==l||a.fov!==n.fov)&&(a.fov=n.fov,l=n.fov,a.updateProjectionMatrix()),o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(u){a.aspect=u,a.updateProjectionMatrix()},getGroundBasis(){const u=new q().setFromMatrixColumn(a.matrixWorld,0),g=new q().setFromMatrixColumn(a.matrixWorld,2).negate(),_=Math.hypot(u.x,u.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:u.x/_,rightZ:u.z/_,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...d}}}}const Mi=Math.PI*2,gn=1e-6;function Rn(n,t,e){return n<t?t:n>e?e:n}function ih(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function wv(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function ah(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=wv(n);return i===1?a:e+(a-e)*i}function nd(n){return(1-Math.sin(n))/2}function fc(n,t){if(!n.grounded||n.speed<gn)return ih();const e=n.speed/Math.max(n.moveSpeed,gn),i=Math.max(n.legLength,gn),a=n.stride>gn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),c=Math.abs(n.localRight),l=r+c+gn,d=r/l,f=c/l,h=n.localForward>=0?1:-1,u=n.localRight>=0?1:-1,g=a,_=z=>Math.asin(Rn(z,-o,o)/i);function m(z,G){const C=ah(z,t.plantLock),A=nd(z),V=h*d*g*C,B=-_(V),j=G*u>0?1:-1,J=1+j*t.crossStep*.45,lt=u*j*t.crossStep*g*.4*A,pt=u*f*g*t.sideWeight*J*C+lt*f,Mt=_(pt),Y=t.kneeLift*A*s*(.55+.25*d+(j>0?.2*f:0));return{pitchX:B,rollZ:Mt,kneeX:Y}}const p=(n.phase%Mi+Mi)%Mi,x=m(p,-1),M=m((p+Math.PI)%Mi,1),v=Math.cos(p),U=nd(p),R=-t.comSway*s*v*(.6*d+.8*f)-u*t.comSway*s*f*.45,T=t.comBob*U*s,w=u*t.hipLean*s*f*v*.6,b=u*t.hipLean*s*f*(.45+.25*v),y=t.armSwing*s*v*(d*h+.3*f),D=y,H=-y;return{legL:x,legR:M,pelvisX:R,pelvisY:T,pelvisRoll:w,sideLean:b,armL:D,armR:H,strafe:f,backward:h<0?d:0}}function sh(n){const t=(n%Mi+Mi)%Mi,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function oh(n,t,e){const i=Rn(e.progress,0,1);if(i>=1||n.speed<gn)return ih();const a=i*i*(3-2*i),s=1-a;return fc({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function rh(n,t,e,i){const a=Rn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Rn(o*a,-1,1)*(e*Math.PI/180)}function ch(n,t,e,i,a){const s=Math.max(e,gn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,c=t>gn?(t-n)/t:0,l=c>.02,d=c<-.015,f=n<=o*.15,h=!d&&n<r&&(l||f);return{enter:n>gn&&n<=o&&l,resume:!h}}function lh(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Rn(n*Rn(t,0,2),-i,i)}function dh(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function hh(n,t,e){const i=Rn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function Tv(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Rn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,c=r?1:.35,l=r?.35:1,d=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,h=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-d*c,rollZ:u*h*c,kneeX:f*c},legR:{pitchX:-d*l,rollZ:-u*h*l,kneeX:f*l},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function uh(n,t,e,i,a){const s=Rn(n,0,1),o=Rn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),c=r*r*(3-2*r),l=s<=o?c:1-c,d=Math.hypot(e,i),f=d>gn?e/d:1,h=d>gn?i/d:0,u=ah(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*l,trailPitch:Math.max(0,a.stopTrailPitch)*l,leadKnee:Math.max(0,a.stopStepKnee)*l,bodyShift:Math.max(0,a.stopBodyShift)*l,bodyDip:Math.max(0,a.stopBodyDip)*l,chestPitch:Math.max(0,a.stopChestPitch)*l,leadLeft:u,fwdN:f,rightN:h,env:l}}function Be(n){return n<0?0:n>1?1:n}const ms=Math.PI*2;function Av(n){return((n+Math.PI)%ms+ms)%ms-Math.PI}function Rv(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function Cv(n,t,e,i,a,s=n.phase){const o=Be(i);if(o<=0)return n;const r=Be(t),c=Math.max(1,Math.round(a.cycles)),l=Math.max(0,a.strideSpeed),d=e%2===0?1:-1,f=Be(a.forwardBias),h=Math.max(0,n.stride??0),u=Math.max(0,a.strideScale??0)*h,g=r<=.5?r*2:(r-.5)*2,_=g*g*(3-2*g),m=r<=.5?_:1-_,p={speed:l,phase:s+ms*c/2*m,localForward:l*f,localRight:l*(1-f)*d},x=Av(p.phase-n.phase),M=o*o*(3-2*o),v=n.speed>.05?h:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+x*M,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:v+(u-v)*o*o}}function Pv(n,t,e){const i=Rv(),a=Be(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,c=o>0,l=e.stepPitch*s,d=e.stepKnee*s,f=e.stepSide*s;return i.legL.pitchX=r?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=r?d:d*.4,i.legR.kneeX=c?d:d*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=f*.25*o,i}function fh(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function id(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*fh(s,a)}function Dv(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function Lv(n,t,e){const i=Be(n);return{gaitScale:1-i*(1-Be(t)),attackLegWeight:Be(e)*i}}function Iv(n,t){const e=Be(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function kv(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Be(t.minScale+(1-t.minScale)*e)}function Uv(){return ph()}function ph(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function Fv(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function Nv(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Be(t.forceHitHeight):n.type==="light"?Be(t.hitHeight.light):n.type==="heavy"?Be(t.hitHeight.heavy):n.type==="knock"?Be(t.hitHeight.knock):0}function zv(n,t,e){const i=Be(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function mh(n,t,e){const i=ph(),a=Fv(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=Be(1-n.timer/n.duration),o=fh(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=Nv(n,e);const r=Math.sin(t),c=Math.cos(t),l=Math.cos(t),d=-Math.sin(t),f=n.dirX*r+n.dirZ*c,h=n.dirX*l+n.dirZ*d;if(i.localFwd=f,i.localRight=h,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*s);return i.upperPitch=a*_*f,i.upperRoll=-a*_*h*.7,i.drop=(a>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const u=a*o,g=zv(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(g.upperPitch*f+g.fold),i.upperRoll=-u*g.upperRoll*h,i.upperYaw=u*g.upperYaw*h,i.upperShift=u*g.shift,i.upperShiftX=i.upperShift*h,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*h,i.comZ=i.comShift*f,i.pelvisBack=u*g.back,i.drop=u*g.drop,i.knee=u*g.knee,i.hip=u*g.hip,i.arm=u*g.arm,i.flash=e.flashStrength*o,i}function gh(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const ui=1e-6;function va(n,t,e){return n<t?t:n>e?e:n}function Ov(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=ui||s<=ui||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,c=Math.abs(a-s)+ui,l=Math.hypot(n.x,n.y,n.z);if(l<=ui)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),h=n.z,u=Math.hypot(h,f),g=va(u,c,r),_=u>r+ui||u<c-ui,m=Math.atan2(-h,Math.max(f,ui)),p=va((a*a+g*g-s*s)/(2*a*g),-1,1),x=va((s*s+g*g-a*a)/(2*s*g),-1,1),M=Math.acos(p),v=Math.acos(x),U=i>=0?1:-1;return{rootPitch:m-U*M,rootRoll:d,jointPitch:U*(M+v),clamped:_,reach:l/r}}function Bv(n,t,e,i){const a=va(e,0,1),s=Math.max(0,i),o=(r,c)=>{const l=va((c-r)*a,-s,s);return r+l};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function _h(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const pc={active:!1,weight:0,clamped:0,maxError:0};function xh(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...pc};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=a.map(u=>u.tip.getWorldPosition(new q));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),d=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<a.length;u++){const g=a[u],_=i.worldToLocal(c[u].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},p=Ov(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(f+=1);const x=Bv({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,l,d);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let h=0;for(let u=0;u<a.length;u++){const g=a[u].tip.getWorldPosition(new q);h=Math.max(h,g.distanceTo(c[u]))}return{active:!0,weight:l,clamped:f,maxError:h}}function en(n,t,e){return n<t?t:n>e?e:n}function Hv(n,t,e,i,a,s,o,r,c,l){const d=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Te,h=new Te;h.name="pelvis",h.position.y=n.legLength,f.add(h);const u=new Te;u.name="lower";const g=new Te;g.name="upper",h.add(u),h.add(g);const _=[],m=(et,xt,Bt,nt)=>{const yt=new Ea({color:nt}),N=new pe(new An(et,xt,Bt),yt);return N.castShadow=!0,N.receiveShadow=!0,_.push(yt),N},p=n.headSize,x=n.legLength,M=n.armLength,v=n.limbThickness,U=n.bodyHeight,R=n.bodyWidth,T=m(R,U,.28,e);T.position.y=U/2,g.add(T);const w=new Te;w.name="headPivot",w.position.y=U,g.add(w);const b=m(p,p,p,e);b.position.y=p/2,w.add(b);for(const et of[-1,1]){const xt=m(.06,.07,.02,t.shoe);xt.position.set(et*.09,p/2+.03,p/2+.011),w.add(xt)}const y=(et,xt)=>{const Bt=xt?M:x,nt=new Te;nt.name=xt?et<0?"shoulderL":"shoulderR":et<0?"hipL":"hipR",xt||(nt.rotation.order="ZYX"),nt.position.set(et*(xt?R/2+v/2:R/2-v/2),xt?U-.04:0,0),(xt?g:u).add(nt);const yt=m(v,Bt/2,v,t.limb);yt.position.y=-Bt/4,nt.add(yt);const N=new Te;N.name=xt?"elbow":"knee",N.position.y=-Bt/2,nt.add(N);const it=m(v,Bt/2,v,t.limb);if(it.position.y=-Bt/4,N.add(it),!xt){const ut=m(v*1.15,.07,v*1.7,t.shoe);ut.position.set(0,-Bt/2+.035,.045),N.add(ut);const Ft=new Ee;return Ft.name="footTip",Ft.position.y=-Bt/2,N.add(Ft),{root:nt,joint:N,tip:Ft}}return{root:nt,joint:N}},D=y(-1,!1),H=y(1,!1),z=y(-1,!0),G=y(1,!0),C=[D,H].map(et=>({root:et.root,joint:et.joint,tip:et.tip,upperLen:x/2,lowerLen:x/2,bend:1})),A=new cn({color:a.attackArcColor,transparent:!0,opacity:0,side:Le,depthWrite:!1}),V=new pe(new Ns(.62,.042,6,20,Math.PI*1.1),A);V.position.set(0,.78-x,.56),g.add(V);const B=new Wt(e),j=new Wt(r.flashColor),J=new Wt;let lt=null,pt=0,Mt=0,Y=0,tt=0,mt=0,K=0,gt=0,Lt={...pc},Ct=-1,zt=0,At=0,bt=0,O=0,Zt=0,Dt=0,It=0,St=1,Et=0,Rt=0,P="none",S=0,W=!1,rt=-1,ct=!1,st=0,kt=0;return{group:f,update(et,xt){f.position.set(et.position.x,et.position.y,et.position.z),f.rotation.y=et.bodyYaw,w.rotation.y=(et.headYaw-et.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,et.mode!==lt&&(lt=et.mode,pt=1),pt=Math.max(0,pt-xt*2.2);const Bt=et.hurt,nt=mh(Bt,et.bodyYaw,r),yt=nt.flash;J.copy(j).multiplyScalar(yt);for(const ot of _)ot.emissive.copy(B).multiplyScalar(pt*.5),yt>0&&ot.emissive.add(J);h.position.set(0,x,0),h.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const N=Math.hypot(et.velocity.x,et.velocity.z),it=en(o.knockGaitScale??0,0,1),ut=et.hurt.knockX*it,Ft=et.hurt.knockZ*it,X=it>0&&Math.hypot(et.hurt.knockX,et.hurt.knockZ)>.001,ft=et.velocity.x+ut,L=et.velocity.z+Ft,dt=Math.hypot(ft,L),Z=Math.cos(et.bodyYaw),Q=-Math.sin(et.bodyYaw),_t=N>1e-6?en((et.velocity.x*Z+et.velocity.z*Q)/N,-1,1):0;P==="settled"&&ct&&st>kt*1.02+1e-4&&(P="none");let vt=1;P==="blend"?(vt=hh(W?rt:S,o.stopYawBlendMode,W),W||(S=Math.min(1,S+xt/Math.max(.01,o.stopYawAfterSec)),(S>=1||o.stopYawBlendMode==="inStop"||ct)&&(P="settled",vt=0))):P==="settled"&&(vt=en(N/Math.max(1e-6,o.stopEnterRatio*s),0,1));const Ot=rh(_t,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost)*vt;Et+=(Ot-Et)*(1-Math.exp(-12*Math.max(0,xt))),u.rotation.y=Et;const Yt=et.bodyYaw+Et,ie=Math.sin(Yt),Vt=Math.cos(Yt),de=Math.cos(Yt),he=-Math.sin(Yt),ye=ft*ie+L*Vt,xe=ft*de+L*he,Jt=Math.max(0,o.stopBlendSec||0),le=Jt>0&&!X,wt=ch(N,Rt,s,o.stopEnterRatio,o.stopExitRatio);if(!le||wt.resume)Ct=-1;else if(Ct<0&&wt.enter){Ct=0,zt=et.gaitPhase,At=sh(et.gaitPhase),bt=N,O=Math.max(et.stride,1e-6),Zt=ye,Dt=xe;const ot=1/Math.max(1e-6,N);It=et.velocity.x*ot,St=et.velocity.z*ot}const $t=Rt;Rt=N;const re=le&&Ct>=0;re&&(Ct=Math.min(1,Ct+xt/Jt)),re&&P!=="blend"&&(P="blend",S=0),W=re&&Ct<1,rt=Ct,ct=wt.resume,st=N,kt=$t;const Pe=re?{phase:zt,speed:bt,moveSpeed:s,localForward:Zt,localRight:Dt,legLength:n.legLength,stride:O,grounded:!0}:{phase:et.gaitPhase,speed:dt,moveSpeed:s,localForward:ye,localRight:xe,legLength:n.legLength,stride:et.stride,grounded:!0},ae=re?oh(Pe,o,{progress:Ct,phase0:zt,phaseEnd:At}):fc(Pe,o);let Ze=0,Ie=0,qe=0,Gn=0;if(re){const ot=dh(et.bodyYaw,It,St),ht=uh(Ct,zt,ot.forward,ot.right,o);ht.leadLeft?(ae.legL.pitchX-=ht.leadPitch,ae.legL.kneeX+=ht.leadKnee,ae.legR.pitchX+=ht.trailPitch):(ae.legR.pitchX-=ht.leadPitch,ae.legR.kneeX+=ht.leadKnee,ae.legL.pitchX+=ht.trailPitch),Ie=ht.bodyShift*ht.fwdN,Ze=ht.bodyShift*ht.rightN,qe=ht.bodyDip,Gn=ht.chestPitch}D.root.rotation.x=ae.legL.pitchX,H.root.rotation.x=ae.legR.pitchX,D.root.rotation.z=ae.legL.rollZ,H.root.rotation.z=ae.legR.rollZ,D.joint.rotation.x=ae.legL.kneeX,H.joint.rotation.x=ae.legR.kneeX,z.root.rotation.x=ae.armL,G.root.rotation.x=ae.armR,z.joint.rotation.x=-.18,G.joint.rotation.x=-.18,h.position.x=ae.pelvisX,h.position.y=x+ae.pelvisY,h.position.z=0,h.rotation.z=ae.pelvisRoll,g.rotation.z=ae.sideLean*(nt.intensity>0?.4:1);const ln=_h(h,u),E=re&&d.enabled?{...d,weight:1}:d,$=E.enabled&&E.weight>0?en(E.weight,0,1):0;if(h.position.x+=Ze,h.position.z+=Ie,h.position.y-=qe,u.position.y+=qe,$<=0&&(u.position.x-=Ze,u.position.z-=Ie),c){const ot=Math.max(.004166666666666667,Math.min(xt,.1)),ht=Math.sin(et.bodyYaw),Tt=Math.cos(et.bodyYaw),Ht=en((et.velocity.x-Mt)/ot,-60,60),Gt=en((et.velocity.z-Y)/ot,-60,60),Ut=Ht*ht+Gt*Tt,Xt=Fe(et.bodyYaw-tt)/ot,jt=c.maxForwardDeg*Math.PI/180,te=c.maxSideDeg*Math.PI/180,Se=1-Math.exp(-Math.max(0,c.smoothing)*ot);mt+=(en(Ut*c.accelGain,-jt,jt)-mt)*Se,K+=(en(-Xt*N*c.turnGain,-te,te)-K)*Se;const Qt=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;gt+=(en(N/Math.max(s,1e-6),0,1)-gt)*(1-Math.exp(-Math.max(0,Qt)*ot));const Nt=gh({leanForward:mt,leanSide:K,speedRatio:gt},c);g.rotation.x+=mt+Gn,g.rotation.z+=K,h.rotation.x+=Nt.pelvisPitch,h.rotation.z+=Nt.pelvisRoll,h.position.x+=Nt.pelvisX,h.position.z+=Nt.pelvisZ,h.position.y-=Nt.crouch,u.position.y+=Nt.crouch*(1-$)}Mt=et.velocity.x,Y=et.velocity.z,tt=et.bodyYaw,g.rotation.x+=nt.upperPitch,g.rotation.z+=nt.upperRoll,g.rotation.y+=nt.upperYaw;const I=en(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),F=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=en(nt.upperShiftX*I,-F,F),g.position.z+=en(nt.upperShiftZ*I,-F,F),h.position.x+=nt.comX,h.position.z+=nt.comZ-nt.pelvisBack,h.position.y-=nt.drop;const k=nt.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=nt.pelvisBack*(1-k),u.position.y+=nt.drop*(1-k),D.joint.rotation.x+=nt.knee,H.joint.rotation.x+=nt.knee,D.root.rotation.x-=nt.hip,H.root.rotation.x-=nt.hip,z.root.rotation.x+=nt.arm,G.root.rotation.x+=nt.arm*.8,et.attackPhase!=="idle"&&nt.intensity===0){const ot=et.attackProgress,ht=ot<.34?-1:ot<.68?-1+(ot-.34)/.34*2:Math.max(0,1-(ot-.68)/.32),Tt=Math.max(0,-ht),Ht=Math.max(0,ht);G.root.rotation.x=-1.7*Tt+1.25*Ht,G.joint.rotation.x=-(.25+Tt*.45),g.rotation.y=-.28*ht,A.opacity=et.attackPhase==="active"?.85:0,et.attackPhase==="active"&&(V.rotation.z=-1.1+ot*3)}else A.opacity=0;const at=lh(Et,o.chestYawScale,o.chestYawMaxDeg);g.rotation.y+=at,w.rotation.y=(et.headYaw-et.bodyYaw-at+Math.PI*3)%(Math.PI*2)-Math.PI,Lt=xh({root:f,pelvis:h,lower:u,limbs:C,base:ln,cfg:E,grounded:!0,attacking:et.attackPhase!=="idle"})},ik(){return Lt},dispose(){f.traverse(et=>{if(et instanceof pe){et.geometry.dispose();const xt=et.material;Array.isArray(xt)?xt.forEach(Bt=>Bt.dispose()):xt.dispose()}})}}}const mc=64,vh=[0,.24,.76,1],Gv=[0,1,1,0],Mh=[0,.12,.28,.5,.72,.88,1],Vv=[0,.16,.5,1,.5,.16,0];function ad(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function gc(n,t,e,i,a=mc,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),c=s==="glow"?Mh:vh,l=s==="glow"?Vv:Gv,d=c.length,f=a+1,h=new Float32Array(f*d*3),u=new Float32Array(f*d*4),g=[];for(let m=0;m<f;m++){const p=m/a,x=(p-.5)*e,M=ad(p,i)*ad(1-p,i),v=Math.sin(x),U=Math.cos(x);for(let R=0;R<d;R++){const T=o+(r-o)*c[R],w=m*d+R;h[w*3]=v*T,h[w*3+1]=0,h[w*3+2]=U*T;const b=M*l[R];u[w*4]=1,u[w*4+1]=1,u[w*4+2]=1,u[w*4+3]=b}}for(let m=0;m<a;m++)for(let p=0;p<d-1;p++){const x=m*d+p,M=x+d;g.push(x,M,x+1,x+1,M,M+1)}const _=new He;return _.setAttribute("position",new Ye(h,3)),_.setAttribute("color",new Ye(u,4)),_.setIndex(g),_.computeBoundingSphere(),_}function Uo(n){const t=new cn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Le,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(c,l)=>{const d=Math.round(c*32)/32,f=Math.max(.05,Math.round(l*20)/20),h=`${Math.round(d*32)}|${Math.round(f*20)}`,u=e.get(h);if(u)return u;const g=gc(n.radius,n.thickness*f,d,n.edgeFade,mc,n.profile??"band");if(e.set(h,g),e.size>64){for(const[_,m]of e)if(_!==h&&m!==i){m.dispose(),e.delete(_);break}}return g};i=a(n.arcRad,1);const s=new pe(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(c,l,d,f,h,u=1){const g=Math.max(.05,u);(Math.abs(c-o)>.01||Math.abs(g-r)>.01)&&(i=a(c,g),s.geometry=i,o=c,r=g),t.opacity=l,t.color.copy(f),s.scale.set(d,1,d),s.rotation.y=h,s.visible=l>.002},arcRad(){return o},dispose(){for(const c of e.values())c.dispose();e.clear(),t.dispose()}}}function sd(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function Xv(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),c=Math.min(1,Math.max(0,e)),l=a.selectedArcDeg*Math.PI/180,d=s+(l-s)*(.35+.65*r),f=4+4*r+6*c,h=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*c)*r+.04*h),g=1+.02*r+.012*h*r;return{arcRad:d,opacity:u,scale:g,level:r}}function Wv(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function $v(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let l=0;l<i;l++){const d=l/n*Math.PI*2,f=Math.sin(d),h=Math.cos(d);for(let u=0;u<a;u++){const g=u/e,_=t+(1-t)*g,m=l*a+u;s[m*3]=f*_,s[m*3+1]=0,s[m*3+2]=h*_;const p=Math.pow(1-g,1.8)*.9+(u===0?.1:0);o[m*4]=1,o[m*4+1]=1,o[m*4+2]=1,o[m*4+3]=Math.min(1,p)}}for(let l=0;l<n;l++)for(let d=0;d<e;d++){const f=l*a+d,h=f+a;r.push(f,h,f+1,f+1,h,h+1)}const c=new He;return c.setAttribute("position",new Ye(s,3)),c.setAttribute("color",new Ye(o,4)),c.setIndex(r),c.computeBoundingSphere(),c}function od(n){const t=n.segments??mc,e=n.profile??"band",a=((e==="glow"?Mh.length:vh.length)-1)*6,s=gc(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new cn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Le,vertexColors:!0,toneMapped:!1}),r=new pe(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let c=0;return{mesh:r,set(l,d,f,h,u=1){const g=Math.min(1,Math.max(0,l)),_=Math.round(g*t),m=g>.001?Math.max(1,_)*a:0;m!==s.drawRange.count&&s.setDrawRange(0,m),c=_,o.opacity=d,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=h,r.visible=d>.002&&g>.001},ratio(){return t>0?c/t:0},filledSegments(){return c},dispose(){s.dispose(),o.dispose()}}}function rd(n){const t=new Te,e=$v(48),i=new cn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Le,vertexColors:!0,toneMapped:!1}),a=new pe(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=gc(1-s*.5,s,Math.PI*2,0,64,"band"),r=new cn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Le,vertexColors:!0,toneMapped:!1}),c=new pe(o,r);return c.renderOrder=(n.renderOrder??2)+1,t.add(c),t.position.y=n.y,{group:t,set(l,d,f,h,u,g){const _=Math.min(1,Math.max(0,u));t.position.set(l,f,d),a.scale.set(h,1,h),c.scale.set(h,1,h),i.opacity=_*.26,r.opacity=_*(.72+.18*Math.sin(g*7)),t.visible=_>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function cd(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function Yv(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function Zv(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){const t=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/t))}}return n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function qv(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function yh(n){return{x:0,y:0,z:1}}function jv(n){return Math.asin(yh().y)}function Kv(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}function De(n,t,e){return n<t?t:n>e?e:n}const ma=1e-6;function _e(n,t,e,i){const a=new pe(new An(n,t,e),new Ea({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function we(){return new Te}function gs(n,t,e){const i=we(),a=_e(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=_e(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=_e(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=_e(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const c=_e(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function Jv(n){const t=gs(.72,.15,n),e=_e(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function Qv(n){const t=we(),e=_e(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=_e(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function tM(n){const t=we(),e=_e(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=_e(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new Wt(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function eM(n){const t=we();for(let i=0;i<5;i++){const a=(i-2)*.15,s=_e(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=_e(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function nM(n){const t=we(),e=_e(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=_e(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function iM(n,t,e,i,a,s,o,r,c,l,d){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},h=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},u=we(),g=we();g.name="pelvis",g.position.y=n.legLength,u.add(g);const _=we();_.name="lower";const m=we();m.name="upper",g.add(_),g.add(m);const p=n.headSize,x=n.legLength,M=n.armLength,v=n.limbThickness,U=n.bodyHeight,R=n.bodyWidth,T=_e(R,U,.28,t.body);T.position.y=U/2,m.add(T);const w=we();w.name="headPivot",w.position.y=i.headPivotHeight,m.add(w);const b=_e(p,p,p,t.head);b.position.y=p/2,w.add(b);const y=new Ea({color:"#1b2733"});for(const I of[-1,1]){const F=new pe(new An(.06,.07,.02),y);F.position.set(I*.09,p/2+.03,p/2+.011),w.add(F)}const D=I=>{const F=we();F.name=I<0?"hipL":"hipR",F.rotation.order="ZYX",F.position.set(I*(R/2-v/2),0,0),_.add(F);const k=_e(v,x/2,v,t.limb);k.position.y=-x/4,F.add(k);const at=we();at.name="knee",at.position.y=-x/2,F.add(at);const ot=_e(v,x/2,v,t.limb);ot.position.y=-x/4,at.add(ot);const ht=_e(v*1.15,.07,v*1.7,t.shoe);ht.position.set(0,-x/2+.035,.045),at.add(ht);const Tt=new Ee;return Tt.name="footTip",Tt.position.y=-x/2,at.add(Tt),{root:F,joint:at,hand:we(),tip:Tt}},H=I=>{const F=we();F.name=I<0?"shoulderL":"shoulderR",F.position.set(I*(R/2+v/2),U-.04,0),m.add(F);const k=_e(v,M/2,v,t.limb);k.position.y=-M/4,F.add(k);const at=we();at.name="elbow",at.position.y=-M/2,F.add(at);const ot=_e(v,M/2,v,t.limb);ot.position.y=-M/4,at.add(ot);const ht=we();ht.position.y=-M/2,at.add(ht);const Tt=_e(v*1.1,.09,v*1.1,t.head);return Tt.position.y=.045,ht.add(Tt),{root:F,joint:at,hand:ht}},z=D(-1),G=D(1),C=H(-1),A=H(1),V=[z,G].map(I=>({root:I.root,joint:I.joint,tip:I.tip,upperLen:x/2,lowerLen:x/2,bend:1})),B=we(),j=we();A.hand.add(B),C.hand.add(j);const J=tM(t),lt=eM(t),pt=nM(t),Mt={"sword-shield":{right:gs(.42,.075,t),left:Qv(t)},"dual-swords":{right:gs(.42,.075,t),left:gs(.42,.075,t)},greatsword:{right:Jv(t),left:_e(.12,.2,.12,t.wood)},staff:{right:J.g,left:we(),orb:J.orb},bow:{right:pt,left:lt.g,arrow:pt,drawString:lt.drawString}};for(const I of Object.keys(Mt))B.add(Mt[I].right),j.add(Mt[I].left),Mt[I].right.visible=!1,Mt[I].left.visible=!1;let Y=null,tt=0,mt=0,K=0,gt=0,Lt=0,Ct=0,zt=Uv(),At={...pc},bt=0,O=0,Zt=0,Dt=-1,It=0,St=0,Et=0,Rt=0,P=0,S=0,W=0,rt=1,ct=0,st=0,kt=0,et=!1,xt=0,Bt=0,nt=0,yt=0,N="none",it=0,ut=1,Ft=!1,X=-1,ft=!1,L=0,dt=0,Z=0,Q=0,_t=0,vt=1,Ot={speed:0,phase:0},Yt={lp:0,lr:0,rp:0,rr:0},ie=0,Vt=0,de=!0,he=0,ye="none",xe=0,Jt=0,le=0,wt=.3,$t=0;function re(I){const F=Math.PI/180,k=s;let at=0,ot=0,ht=0,Tt=0;I==="sword-shield"?(at=k.swordPitchDeg*F,ot=-k.swordYawDeg*F,ht=k.shieldPitchDeg*F):I==="dual-swords"?(at=k.swordPitchDeg*F,ot=-k.swordYawDeg*F,ht=k.swordPitchDeg*F,Tt=k.swordYawDeg*F):I==="greatsword"?(at=k.greatswordPitchDeg*F,ot=-k.greatswordYawDeg*F,ht=k.greatswordPitchDeg*F,Tt=k.greatswordYawDeg*F):I==="staff"?at=k.staffPitchDeg*F:ht=k.bowPitchDeg*F,B.rotation.set(at,0,ot),j.rotation.set(ht,0,Tt)}function Pe(I){if(I!==Y){Y=I;for(const F of Object.keys(Mt))Mt[F].right.visible=F===I,Mt[F].left.visible=F===I;re(I),lt.drawString.position.z=-.06,pt.position.z=0,J.orb.scale.setScalar(1),m.rotation.y=0}}Pe("sword-shield");const ae=[];u.traverse(I=>{I instanceof pe&&I.material instanceof Ea&&ae.push(I.material)});const Ze=new Wt(r.flashColor);function Ie(I,F){const k=mh(I,F,r);zt=k,m.rotation.x+=k.upperPitch,m.rotation.z+=k.upperRoll,m.rotation.y+=k.upperYaw;const at=De(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),ot=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=De(k.upperShiftX*at,-ot,ot),m.position.z+=De(k.upperShiftZ*at,-ot,ot),g.position.x+=k.comX,g.position.z+=k.comZ-k.pelvisBack,g.position.y-=k.drop;const ht=k.legacy?0:De(r.lowerScale,0,1);_.position.z+=k.pelvisBack*(1-ht),_.position.y+=k.drop*(1-ht),z.joint.rotation.x+=k.knee,G.joint.rotation.x+=k.knee,z.root.rotation.x-=k.hip,G.root.rotation.x-=k.hip,C.root.rotation.x+=k.arm,A.root.rotation.x+=k.arm*.8;for(const Tt of ae)Tt.emissive.copy(Ze).multiplyScalar(k.flash)}function qe(I){return I<.3?-1:I<.62?-1+(I-.3)/.32*2:Math.max(0,1-(I-.62)/.38)}function Gn(I){if(I.phase==="idle"||I.charging)return;const F=I.attackProgress,k=qe(F),at=Math.max(0,k),ot=I.comboIndex%2===0?1:-1,ht=c.stride,Tt=Number.isFinite(ht.stepReach)?ht.stepReach:.17,Ht=Number.isFinite(ht.stepSideReach)?ht.stepSideReach:.14,Gt=Number.isFinite(ht.stepDipReach)?ht.stepDipReach:.05,Ut=I.weapon==="greatsword"?De(Number.isFinite(ht.heavyScale)?ht.heavyScale:1,0,1):1;g.position.z+=Tt*at*Ut,g.position.x+=ot*Ht*at*Ut,g.position.y-=Gt*Math.sin(Math.PI*F)*Ut}function ln(I){if(lt.drawString.position.z=-.06,pt.position.z=0,J.orb.scale.setScalar(1),m.rotation.y=0,I.charging&&I.weapon==="bow"){const ot=I.charge;C.root.rotation.x=-1.25,C.joint.rotation.x=-.15,A.root.rotation.x=.35+ot*.3,A.joint.rotation.x=-1.15,lt.drawString.position.z=-.06-ot*.22,pt.position.z=-ot*.3,m.rotation.y=-.22;return}if(I.phase==="idle")return;const F=qe(I.attackProgress),k=Math.max(0,-F),at=Math.max(0,F);if(I.weapon==="bow")C.root.rotation.x=-1.2,C.joint.rotation.x=-.15,A.root.rotation.x=.9-at*.8,A.joint.rotation.x=-.3;else if(I.weapon==="greatsword"){const ot=-1.6*k+1.25*at,ht=De(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);A.root.rotation.x=ot,A.joint.rotation.x=-(.25+k*.4),C.root.rotation.x=ot+.06,C.joint.rotation.x=-(.32+k*.4),C.root.rotation.z=.38,m.rotation.y=-.2*F*ht}else{const ot=I.comboIndex;if(ot===1)A.root.rotation.x=-1.7*k+1.1*at,A.joint.rotation.x=-(.2+k*.5),C.root.rotation.x=.1,m.rotation.y=-.18*F;else if(ot===2)C.root.rotation.x=-1.5*k+1*at,C.joint.rotation.x=-(.2+k*.5),A.root.rotation.x=.2,m.rotation.y=.45*-F;else{const ht=-1.9*k+1.2*at;C.root.rotation.x=ht,A.root.rotation.x=ht,C.joint.rotation.x=-(.15+k*.4),A.joint.rotation.x=-(.15+k*.4),m.rotation.y=-.3*F}}Gn(I)}function E(I,F){I&&(A.root.rotation.x=-1.05,A.joint.rotation.x=-.35,C.root.rotation.x=-.45,C.joint.rotation.x=-.2,m.rotation.y=-.12,J.orb.scale.setScalar(1.25+.12*Math.sin(F*2)))}function $(I){if(!I||I.phase==="idle")return;const F=I.progress,k=F<.3?-.35+F/.3*1.35:F<.7?1:Math.max(0,1-(F-.7)/.3),at=Math.PI/180;m.rotation.x+=h.leanDeg*at*k,C.root.rotation.x-=h.shieldPitchDeg*at*k,C.joint.rotation.x-=.22*k,A.root.rotation.x-=.3*k,g.position.z+=h.pelvisReach*Math.max(0,k)}return{group:u,update(I,F,k,at,ot=!1,ht,Tt,Ht){Pe(F.weapon),m.rotation.x=0,m.rotation.z=0,g.position.x=0,g.position.y=x,g.position.z=0,g.rotation.z=0,g.rotation.x=0,m.position.x=0,m.position.y=0,m.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const Gt=Math.max(1/240,Math.min(at,.1)),Ut=ht===void 0?ie+=at:ht;Vt=Ut;const Xt=c.landing;Xt.enabled?de&&!I.grounded?(ye="jump",xe=Ut,Jt=Xt.anticipationDuration,le=Math.max(0,Xt.jumpAnticipation),wt=.32):!de&&I.grounded&&(ye="land",xe=Ut,Jt=Xt.duration,le=kv(he,Xt),wt=Xt.compressRatio,$t=he):(ye="none",le=0),Ut<xe&&(ye="none",le=0),de=I.grounded,he=I.velocity.y;const jt=id(Ut,xe,Jt,le,wt),te=F.phase!=="idle",Se=(Ht==null?void 0:Ht.phase)==="active";Q=Dv(Q,te,Gt,c.attack.blendRate);const Qt=Lv(Q,c.attack.gaitWeight,c.attack.lowerBodyWeight);_t=Qt.attackLegWeight,vt=Qt.gaitScale;const Nt=Math.sin(I.bodyYaw),dn=Math.cos(I.bodyYaw),oe=(I.velocity.x-tt)/Gt,je=(I.velocity.z-mt)/Gt,Vn=De(oe,-60,60),Ne=De(je,-60,60),ii=Vn*Nt+Ne*dn,fe=Fe(I.bodyYaw-K)/Gt,Qe=Math.hypot(I.velocity.x,I.velocity.z),Xn=o.maxForwardDeg*Math.PI/180,ze=o.maxSideDeg*Math.PI/180,vn=De(ii*o.accelGain,-Xn,Xn),Mn=De(-fe*Qe*o.turnGain,-ze,ze),ia=1-Math.exp(-o.smoothing*Gt);gt+=(vn-gt)*ia,Lt+=(Mn-Lt)*ia,tt=I.velocity.x,mt=I.velocity.z,K=I.bodyYaw;const Cn=Math.hypot(I.velocity.x,I.velocity.z),zs=De(a.knockGaitScale??0,0,1),Sh=k.knockX*zs,bh=k.knockZ*zs,Eh=zs>0&&Math.hypot(k.knockX,k.knockZ)>.001,Os=I.velocity.x+Sh,Bs=I.velocity.z+bh,_c=Math.hypot(Os,Bs);yt=_c;const wh=Math.cos(I.bodyYaw),Th=-Math.sin(I.bodyYaw),Ah=I.velocity.x*wh+I.velocity.z*Th,Rh=Cn>ma?De(Ah/Cn,-1,1):0;N==="settled"&&ft&&L>dt*1.02+1e-4&&(N="none");let aa=1;N==="blend"?(aa=hh(Ft?X:it,a.stopYawBlendMode,Ft),Ft||(it=Math.min(1,it+Gt/Math.max(.01,a.stopYawAfterSec)),(it>=1||a.stopYawBlendMode==="inStop"||ft)&&(N="settled",aa=0))):N==="settled"&&(aa=De(Cn/Math.max(ma,a.stopEnterRatio*e),0,1)),ut=aa;const Ch=rh(Rh,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost)*aa;O+=(Ch-O)*(1-Math.exp(-i.hipYawSmoothing*Gt));const sa=I.bodyYaw+O;Zt=sa;const Ph=Math.sin(sa),Dh=Math.cos(sa),Lh=Math.cos(sa),Ih=-Math.sin(sa),Ca={speed:_c,phase:I.gaitPhase,localForward:Os*Ph+Bs*Dh,localRight:Os*Lh+Bs*Ih,stride:I.stride};te&&!et&&(kt=I.gaitPhase),et=te;const Ei=Q>0?Cv(Ca,F.attackProgress,F.comboIndex,Q,c.stride,kt):Ca;Ot=Ei;const xc=Math.max(0,a.stopBlendSec||0),vc=xc>0&&!te&&!Eh&&I.grounded,Hs=ch(Cn,ct,e,a.stopEnterRatio,a.stopExitRatio);if(!vc||Hs.resume)Dt=-1;else if(Dt<0&&Hs.enter){Dt=0,It=I.gaitPhase,St=sh(I.gaitPhase),Et=Cn,Rt=Math.max(I.stride,ma),P=Ca.localForward,S=Ca.localRight;const me=1/Math.max(ma,Cn);W=I.velocity.x*me,rt=I.velocity.z*me}const kh=ct;ct=Cn;const ai=vc&&Dt>=0;ai&&(Dt=Math.min(1,Dt+Gt/xc)),ai&&N!=="blend"&&(N="blend",it=0),Ft=ai&&Dt<1,X=Dt,ft=Hs.resume,L=Cn,dt=kh;const Mc=ai?{phase:It,speed:Et,moveSpeed:e,localForward:P,localRight:S,legLength:n.legLength,stride:Rt,grounded:!0}:{phase:Ei.phase,speed:Ei.speed,moveSpeed:e,localForward:Ei.localForward,localRight:Ei.localRight,legLength:n.legLength,stride:Ei.stride??0,grounded:I.grounded},Uh=ai?oh(Mc,a,{progress:Dt,phase0:It,phaseEnd:St}):fc(Mc,a),ce=Iv(Uh,Qt.gaitScale);if(Z=0,Se&&Ht){const me=Tv(Ht.progress,Ht.dir,a),ee=Qt.gaitScale;ce.legL.pitchX+=me.legL.pitchX*ee,ce.legL.rollZ+=me.legL.rollZ*ee,ce.legL.kneeX+=me.legL.kneeX*ee,ce.legR.pitchX+=me.legR.pitchX*ee,ce.legR.rollZ+=me.legR.rollZ*ee,ce.legR.kneeX+=me.legR.kneeX*ee,ce.pelvisY+=me.pelvisY*ee,Z=me.env}let Gs=0,Vs=0,Xs=0,yc=0;if(ai){const me=dh(I.bodyYaw,W,rt),ee=uh(Dt,It,me.forward,me.right,a);ee.leadLeft?(ce.legL.pitchX-=ee.leadPitch,ce.legL.kneeX+=ee.leadKnee,ce.legR.pitchX+=ee.trailPitch):(ce.legR.pitchX-=ee.leadPitch,ce.legR.kneeX+=ee.leadKnee,ce.legL.pitchX+=ee.trailPitch),Vs=ee.bodyShift*ee.fwdN,Gs=ee.bodyShift*ee.rightN,Xs=ee.bodyDip,yc=ee.chestPitch,xt=ee.leadPitch,Bt=ee.bodyShift,nt=ee.bodyDip}else xt=0,Bt=0,nt=0;Yt={lp:ce.legL.pitchX,lr:ce.legL.rollZ,rp:ce.legR.pitchX,rr:ce.legR.rollZ},I.grounded?(z.root.rotation.x=ce.legL.pitchX,G.root.rotation.x=ce.legR.pitchX,z.root.rotation.z=ce.legL.rollZ,G.root.rotation.z=ce.legR.rollZ,z.joint.rotation.x=ce.legL.kneeX,G.joint.rotation.x=ce.legR.kneeX,C.root.rotation.x=ce.armL,A.root.rotation.x=ce.armR,C.joint.rotation.x=-(.18+ce.armL*.2),A.joint.rotation.x=-(.18+ce.armR*.2),C.root.rotation.z=0,A.root.rotation.z=0,g.position.x=ce.pelvisX,g.position.y=x+ce.pelvisY,g.position.z=0,g.rotation.z=ce.pelvisRoll):(z.root.rotation.x=-.55,G.root.rotation.x=-.25,z.joint.rotation.x=.75,G.joint.rotation.x=.55,C.root.rotation.x=-.9,A.root.rotation.x=-.7,C.joint.rotation.x=-.6,A.joint.rotation.x=-.6,z.root.rotation.z=0,G.root.rotation.z=0);const Fh=_h(g,_),oa=Se?{...f,weight:0}:ai&&f.enabled?{...f,weight:1}:f,Sc=oa.enabled&&I.grounded&&oa.weight>0?De(oa.weight,0,1)*(te?De(oa.attackScale,0,1):1):0;g.position.x+=Gs,g.position.z+=Vs,g.position.y-=Xs,_.position.y+=Xs,Sc<=0&&(_.position.x-=Gs,_.position.z-=Vs);const Nh=Cn/Math.max(e,ma),zh=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Oh=1-Math.exp(-Math.max(0,zh)*Gt);bt+=(De(Nh,0,1)-bt)*Oh;const wi=gh({leanForward:gt,leanSide:Lt,speedRatio:bt},o);g.rotation.x+=wi.pelvisPitch,g.rotation.z+=wi.pelvisRoll,g.position.x+=wi.pelvisX,g.position.z+=wi.pelvisZ,g.position.y-=wi.crouch,_.position.y+=wi.crouch*(1-De(Sc,0,1)),ln(F),E(ot,I.gaitPhase),$(Tt);const Bh=s.greatswordPitchDeg*Math.PI/180,bc=F.weapon==="greatsword",Ec=Math.hypot(I.velocity.x,I.velocity.z),Hh=bc&&F.phase==="idle"&&Ec>.5?Math.min(1.15,Ec/Math.max(e,.001)*.9):0;Ct+=(Hh-Ct)*(1-Math.exp(-6*Gt)),bc&&(B.rotation.x=Bh+Ct),F.weapon==="bow"&&(lt.g.rotation.x=-(C.root.rotation.x+C.joint.rotation.x),pt.rotation.x=-(A.root.rotation.x+A.joint.rotation.x));const Gh=m.rotation.y;Ie(k,I.bodyYaw);const wc=k.type==="none"?1:.4;if(m.rotation.x+=gt*wc+yc,m.rotation.z+=(Lt+ce.sideLean)*wc,jt>0&&(z.root.rotation.x-=Xt.hipPitch*jt,G.root.rotation.x-=Xt.hipPitch*jt,z.joint.rotation.x+=Xt.kneeBend*jt,G.joint.rotation.x+=Xt.kneeBend*jt,g.position.y-=Xt.crouchDepth*jt,_.position.y+=Xt.crouchDepth*(1-Xt.lowerScale)*jt,m.rotation.x+=Xt.upperPitch*jt,C.root.rotation.x-=Xt.armTuck*jt,A.root.rotation.x-=Xt.armTuck*jt),_t>0&&I.grounded){const me=Pv(F.attackProgress,F.comboIndex,c.stride),ee=_t;z.root.rotation.x+=me.legL.pitchX*ee,G.root.rotation.x+=me.legR.pitchX*ee,z.root.rotation.z+=me.legL.rollZ*ee,G.root.rotation.z+=me.legR.rollZ*ee,z.joint.rotation.x+=me.legL.kneeX*ee,G.joint.rotation.x+=me.legR.kneeX*ee,g.position.x+=me.pelvisX*ee,g.position.y+=me.pelvisY*ee,g.rotation.z+=me.pelvisRoll*ee}_.rotation.y=O,st=lh(O,a.chestYawScale,a.chestYawMaxDeg),m.rotation.y+=st;const Vh=Gh;w.rotation.y=Fe(I.headYaw-I.bodyYaw-Vh-st),At=xh({root:u,pelvis:g,lower:_,limbs:V,base:Fh,cfg:oa,grounded:I.grounded,attacking:te})},lean(){return{forward:gt,side:Lt}},landing(){const I=id(Vt,xe,Jt,le,wt),F=Jt>0?Math.max(0,Jt-Math.max(0,Vt-xe)):0;return{pulse:I,remaining:F,kind:I>0?ye:"none",impactVy:$t}},hurt(){return zt},ik(){return At},attackBlend(){return Q},attackWeights(){return{gaitScale:vt,attackLegWeight:_t,driveSpeed:Ot.speed,stridePhase:Ot.phase}},hipYaw(){return O},gaitDebug(){return{stopT:Dt,hipYaw:O,chestYaw:st,speed:ct,gaitSpeed:yt,stopStep:xt,stopShift:Bt,stopDip:nt,stopYawFade:ut,turnStep:Z,legLPitch:Yt.lp,legLRoll:Yt.lr,legRPitch:Yt.rp,legRRoll:Yt.rr}},gaitYaw(){return Zt},arrowDirection(){pt.updateWorldMatrix(!0,!1);const I=pt.matrixWorld.elements,F=I[8],k=I[9],at=I[10],ot=Math.hypot(F,k,at)||1;return{x:F/ot,y:k/ot,z:at/ot}},dispose(){u.traverse(I=>{if(I instanceof pe){I.geometry.dispose();const F=I.material;Array.isArray(F)?F.forEach(k=>k.dispose()):F.dispose()}})}}}function aM(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function sM(n,t,e){const i=Math.max(1,n.clientWidth),a=Math.max(1,n.clientHeight),s=new fv({antialias:!0});s.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),s.shadowMap.enabled=!0,s.shadowMap.type=wd,s.setSize(i,a,!1),n.appendChild(s.domElement);const o=new pv;o.background=new Wt("#12161d"),o.add(new _v(11061486,2764600,1.15));const r=new Mv(16773852,1.5);r.position.set(9,18,11),r.castShadow=!0,r.shadow.mapSize.set(1024,1024);const c=r.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,o.add(r);const l=[],d=new Te;for(const X of t.boxes){const ft=X.maxX-X.minX,L=X.maxY-X.minY,dt=X.maxZ-X.minZ;let Z=aM(X.kind,e);X.kind==="step"&&(Z=new Wt(Z).offsetHSL(0,0,X.maxY*.09).getStyle());const Q=new Ea({color:Z,transparent:!0,opacity:1}),_t=new pe(new An(ft,L,dt),Q);_t.position.set((X.minX+X.maxX)/2,(X.minY+X.maxY)/2,(X.minZ+X.maxZ)/2),_t.castShadow=X.kind!=="ground",_t.receiveShadow=!0,_t.add(new eh(new gv(_t.geometry),new dc({color:10467020,transparent:!0,opacity:.32}))),d.add(_t),l.push(Q)}o.add(d);const f=t.gridMeta.maxX-t.gridMeta.minX,h=new Sv(f,f,4873328,3358797);h.position.y=.002,h.visible=e.showGrid,o.add(h);const u=iM(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=new Te,_=.9,m=new Te;m.position.y=_,u.group.position.y=-_,m.add(u.group),g.add(m),o.add(g);const p=t.dummies.map((X,ft)=>{const L=e.dummies.colors,dt=L[ft%L.length]??"#cccccc",Z=Hv(e.voxel,e.colors,dt,X.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return Z.group.traverse(Q=>{Q.userData.dummyId=X.id}),o.add(Z.group),Z}),x=p.map(X=>X.group),M=new yv,v=e.groundRing,U=e.voxel.bodyWidth,R=sd(U,v.playerRadiusFactor),T=sd(U,v.dummyRadiusFactor),w=U*v.thicknessFactor,b=v.arcDeg*Math.PI/180,y=Uo({radius:R,thickness:w,arcRad:b,edgeFade:v.edgeFade,color:v.playerColor,opacity:v.playerOpacity,y:.028,renderOrder:6});y.mesh.name="player-ground-ring",o.add(y.mesh);const D=t.dummies.map(X=>{const ft=Uo({radius:T,thickness:w,arcRad:b,edgeFade:v.edgeFade,color:v.neutralColor,opacity:v.opacity,y:.022,renderOrder:5});return ft.mesh.name=`dummy-ground-ring-${X.id}`,o.add(ft.mesh),ft}),H=t.dummies.map(X=>{const ft=Uo({radius:T*v.haloRadiusFactor,thickness:w*v.haloThicknessFactor,arcRad:b,edgeFade:v.edgeFade,color:v.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return ft.mesh.name=`dummy-ground-halo-${X.id}`,o.add(ft.mesh),ft}),z=t.dummies.map(()=>0),G=t.dummies.map(()=>0),C=od({radius:R*v.meterRadiusFactor,thickness:w*v.meterThicknessFactor,arcRad:b,edgeFade:.06,color:v.meterColorCharge,y:.03,renderOrder:8});C.mesh.name="player-ground-meter",o.add(C.mesh);const A=t.dummies.map(X=>{const ft=od({radius:T*v.warnRadiusFactor,thickness:w*v.warnThicknessFactor,arcRad:b,edgeFade:.02,color:v.warnColor,y:.031,renderOrder:9});return ft.mesh.name=`dummy-ground-warn-${X.id}`,o.add(ft.mesh),ft}),V=rd({color:v.playerColor,y:.042,renderOrder:3});V.group.name="player-landing-preview",o.add(V.group);const B=new Wt,j=new Wt(v.playerColor),J=new Wt(v.neutralColor),lt=new Wt(v.lowThreatColor),pt=new Wt(v.highThreatColor),Mt=new Wt(v.meterColorCharge),Y=new Wt(v.meterColorChannel),tt=new Wt(v.meterColorCooldown),mt=new Wt(v.warnColor),K=new Te;o.add(K);const gt=new cn({color:12577023,transparent:!0,opacity:0,side:Le,depthWrite:!1}),Lt=new Te;Lt.position.set(0,.95,.72),K.add(Lt);const Ct=new Te;Ct.rotation.x=jv(e.camera.pitchDeg),Lt.add(Ct);const zt=new pe(new Ns(.78,.045,6,24,Math.PI*1.15),gt);Ct.add(zt);const At=new uc(1,0),bt=new cn({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),O=Array.from({length:16},()=>{const X=new pe(At,bt);return X.visible=!1,o.add(X),X}),Zt=Array.from({length:6},()=>{const X=rd({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return X.group.visible=!1,o.add(X.group),X}),Dt=new cn({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),It=new pe(new An(.035,.035,.5),Dt);K.add(It);const St=e.dash,Et=new Ps(St.ringRadius-.06,St.ringRadius,28),Rt=Array.from({length:6},()=>{const X=new cn({color:16777215,transparent:!0,opacity:0,side:Le,depthWrite:!1}),ft=new pe(Et,X);return ft.rotation.x=-Math.PI/2,ft.visible=!1,o.add(ft),{mesh:ft,mat:X,life:0,base:1}});function P(X,ft,L,dt,Z){const Q=Rt.find(_t=>_t.life<=0)??Rt[0];Q.mat.color.set(dt),Q.mesh.position.set(X,L+.04,ft),Q.base=Z,Q.mesh.scale.setScalar(Z*.6),Q.mesh.visible=!0,Q.mat.opacity=.9,Q.life=St.fxDuration}const S=e.links,W=new Ps(S.ringRadius-.07,S.ringRadius,28),rt=Array.from({length:5},()=>{const X=new cn({color:S.chargeColor,transparent:!0,opacity:0,side:Le,depthWrite:!1}),ft=new pe(W,X);return ft.rotation.x=-Math.PI/2,ft.visible=!1,o.add(ft),{mesh:ft,mat:X,life:0,base:1}});function ct(X,ft,L,dt){const Z=rt.find(Q=>Q.life<=0)??rt[0];Z.mesh.position.set(X,L+.05,ft),Z.base=dt,Z.mesh.scale.setScalar(dt*.55),Z.mesh.visible=!0,Z.mat.opacity=.85,Z.life=S.fxDuration}let st=t.playerLink.id,kt=t.playerLink.hitIds.length,et=t.dash.id,xt="none",Bt=0,nt=-1,yt=1;const N=Ev(e.camera,e.smartCamera,e.zoom,i/a),it=t.character.position;N.update(it.x,it.y,it.z,1,t.camera);function ut(X,ft){if(x.length===0)return 0;const L=s.domElement.getBoundingClientRect(),dt=new ne((X-L.left)/L.width*2-1,-((ft-L.top)/L.height)*2+1);M.setFromCamera(dt,N.camera);const Z=M.intersectObjects(x,!0);for(const Q of Z){const _t=Q.object.userData.dummyId;if(_t&&_t>0)return _t}return 0}function Ft(X,ft,L){const dt=s.domElement.getBoundingClientRect(),Z=new q(X,ft,L).project(N.camera);return{x:dt.left+(Z.x*.5+.5)*dt.width,y:dt.top+(-Z.y*.5+.5)*dt.height}}return{gaitDebug(){return u.gaitDebug()},render(X,ft){const L=X.character,dt=X.combat;g.position.set(L.position.x,L.position.y,L.position.z),g.rotation.y=L.bodyYaw;const Z=X.dash.phase==="active"&&X.dash.kind==="roll",Q=Z&&X.dash.duration>0?Math.min(1,1-X.dash.timer/X.dash.duration):0;m.rotation.x=Z?Q*Math.PI*2:0,m.position.y=_-(Z?.2*Math.sin(Math.PI*Q):0),u.update(L,dt,X.playerHurt,ft,X.abilities.channeling,X.time,X.playerLink,X.turnInPlace);for(let wt=0;wt<p.length;wt++)X.dummies[wt]&&p[wt].update(X.dummies[wt],ft);const _t=N.camera.position,vt=Math.atan2(_t.x-L.position.x,_t.z-L.position.z),Ot=X.config.gaze.hurtHoldSec,Yt=X.time-X.playerHurt.lastAt,ie=Ot>0&&Yt>=0&&Yt<Ot?1-Yt/Ot:0,Vt=Xv(X.gaze.active,X.gaze.threat,ie,X.time,v);Wv(B,j,lt,pt,Vt.level),y.mesh.position.set(L.position.x,L.position.y+.028,L.position.z),y.update(Vt.arcRad,Vt.opacity,Vt.scale,B,vt);const de=Zv({charging:dt.charging,charge:dt.charge,channeling:X.abilities.channeling,fireTimer:X.abilities.fireTimer,fireInterval:X.config.abilities.arcane.fireInterval,dashCooldown:X.dash.cooldown,dashCooldownMax:X.dash.kind==="blink"?X.config.dash.blinkCooldown:X.config.dash.rollCooldown});C.mesh.position.set(L.position.x,L.position.y+.03,L.position.z),C.set(de.ratio,de.source==="none"?0:v.meterOpacity,de.source==="charge"?Mt:de.source==="channel"?Y:tt,vt);const he=X.playerLink,ye=he.weapon?X.config.links.moves[he.weapon]:void 0,xe=qv(he.phase,L.position.x,L.position.z,he.facing,he.travel,(ye==null?void 0:ye.hit.radius)??.9);V.set(xe.x,xe.z,.042,xe.radius,xe.active?v.landingOpacity:0,X.time);for(let wt=0;wt<D.length;wt++){const $t=X.dummies[wt],re=D[wt],Pe=H[wt],ae=A[wt];if(!$t){re.mesh.visible=!1,Pe.mesh.visible=!1,ae.mesh.visible=!1;continue}const Ze=X.targeting.hasTarget&&X.targeting.targetId===$t.id;if(Ku(X,$t)){const F=Ju(X,$t);B.copy(lt).lerp(pt,F)}else B.copy(J);const Ie=Yv($t.attackPhase,$t.attackPhaseTimer,X.config.dummies.attackWindup);Ie.active?(B.lerp(mt,.5*Ie.urgency),ae.mesh.position.set($t.position.x,$t.position.y+.031,$t.position.z),ae.set(Ie.ratio,v.warnOpacity*(.65+.35*Ie.urgency),mt,vt)):ae.set(0,0,mt,vt);const qe=Ze?1:0,Gn=qe>z[wt]?v.haloFadeInSec:v.haloFadeOutSec;z[wt]=cd(z[wt],qe,ft,Gn);const ln=z[wt],E=1+.02*ln*Math.sin(X.time*2.2+$t.id),$=v.arcDeg+(v.selectedArcDeg-v.arcDeg)*ln;re.mesh.position.set($t.position.x,$t.position.y+.022,$t.position.z),re.update($*Math.PI/180,v.opacity+(v.selectedOpacity-v.opacity)*ln,1+(v.selectedScale-1)*ln*E,B,vt,1+(v.selectedThicknessScale-1)*ln),G[wt]=cd(G[wt],qe,ft,qe>G[wt]?v.haloFadeInSec:v.haloFadeOutSec);const I=G[wt];Pe.mesh.position.set($t.position.x,$t.position.y+.019,$t.position.z),Pe.update($*Math.PI/180,v.haloOpacity*I*(.88+.12*Math.sin(X.time*2.2+$t.id)),v.selectedScale*(.94+.06*I)*E,B,vt)}if(K.position.set(L.position.x,L.position.y,L.position.z),K.rotation.y=dt.phase!=="idle"?dt.attackFacing:L.bodyYaw,X.dash.id!==et){et=X.dash.id;const wt=X.dash;xt=wt.kind,wt.kind==="blink"?(P(wt.fromX,wt.fromZ,L.position.y,St.blinkColor,.9),P(wt.toX,wt.toZ,L.position.y,St.blinkColor,1.35)):P(wt.fromX,wt.fromZ,L.position.y,St.rollColor,1.1)}for(const wt of Rt){if(wt.life<=0)continue;wt.life-=ft;const $t=Math.max(0,wt.life/St.fxDuration);wt.mat.opacity=.9*$t,wt.mesh.scale.setScalar(wt.base*(.6+(1-$t)*1.2)),wt.life<=0&&(wt.mesh.visible=!1)}const Jt=X.playerLink;Jt.id!==st&&(st=Jt.id,kt=Jt.hitIds.length,ct(L.position.x,L.position.z,L.position.y,1)),Jt.hitIds.length>kt?(kt=Jt.hitIds.length,ct(L.position.x,L.position.z,L.position.y,1.35)):Jt.hitIds.length<kt&&(kt=Jt.hitIds.length);for(const wt of rt){if(wt.life<=0)continue;wt.life-=ft;const $t=Math.max(0,wt.life/Math.max(S.fxDuration,1e-6));wt.mat.opacity=.85*$t,wt.mesh.scale.setScalar(wt.base*(.55+(1-$t)*1.1)),wt.life<=0&&(wt.mesh.visible=!1)}dt.attackId!==Bt&&(Bt=dt.attackId,dt.weapon==="bow"&&dt.phase!=="idle"&&(nt=0,yt=.6+dt.lastCharge*.9));const le=dt.phase==="active"&&dt.comboIndex>0;gt.opacity=le?.78:0,le&&(zt.rotation.z=-1.2+dt.attackProgress*3.2,zt.scale.setScalar(.9+dt.comboIndex*.13));for(let wt=0;wt<O.length;wt++){const $t=X.abilities.projectiles[wt],re=O[wt];re.visible=!!$t,$t&&(re.position.set($t.x,$t.y,$t.z),re.scale.setScalar($t.radius),re.rotation.y+=ft*6)}for(let wt=0;wt<Zt.length;wt++){const $t=X.abilities.rings[wt],re=Zt[wt];if(!$t){re.group.visible=!1;continue}const Pe=Math.max(0,Math.min(1,$t.life/Math.max($t.duration,1e-6)));re.set($t.x,$t.z,.045,$t.radius,v.areaOpacity*(.35+.65*Pe),X.time)}if(nt>=0){nt+=ft;const wt=nt*14*yt;It.position.set(0,.85,.6+wt),Dt.opacity=wt<9?.95:0,wt>=9&&(nt=-1)}else Dt.opacity=0;N.update(L.position.x,L.position.y,L.position.z,ft,X.camera),s.render(o,N.camera)},resize(){const X=Math.max(1,n.clientWidth),ft=Math.max(1,n.clientHeight);s.setSize(X,ft,!1),N.resize(X/ft)},getGroundBasis(){return N.getGroundBasis()},setCollidersVisible(X){for(const ft of l)ft.opacity=X?.3:1,ft.wireframe=X,ft.needsUpdate=!0},setGridVisible(X){h.visible=X},setZoom(X){N.setZoom(X)},pickDummy:ut,projectToScreen:Ft,diagnostics(){const X=yh(e.camera.pitchDeg),ft=Kv(X,K.rotation.y);return{lean:u.lean(),slashNormal:ft,arrowForward:u.arrowDirection(),gait:{hipYaw:u.hipYaw(),gaitYaw:u.gaitYaw()},attackBlend:u.attackBlend(),attackWeights:u.attackWeights(),landing:u.landing(),hurt:u.hurt(),ik:u.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:m.rotation.x,activeRings:Rt.filter(L=>L.life>0).length,lastKind:xt},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...N.smart()}}},dispose(){u.dispose();for(const X of p)X.dispose();y.dispose();for(const X of D)X.dispose();for(const X of H)X.dispose();C.dispose();for(const X of A)X.dispose();V.dispose(),zt.geometry.dispose(),gt.dispose(),At.dispose(),bt.dispose();for(const X of Zt)X.dispose();It.geometry.dispose(),Dt.dispose();for(const X of Rt)X.mat.dispose();Et.dispose();for(const X of rt)X.mat.dispose();W.dispose(),d.traverse(X=>{X instanceof pe&&X.geometry.dispose()}),s.dispose(),s.domElement.remove()}}}async function oM(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function rM(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function cM(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),d=i("diag-close"),f=i("diag-mask");let h=!1,u=!0,g=0;function _(){const x=n.status();a.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function m(x){h=x,e.hidden=!x,x?_():s.hidden=!0}function p(x){o.textContent=x,window.clearTimeout(g),g=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),m(!h)}),d.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),o.addEventListener("click",()=>{const x=n.summary();oM(x).then(M=>{M?(p("已复制 ✓"),s.hidden=!0):(s.value=x,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const x=n.dump(),M=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);rM(`harness-${x.meta.version}-${M}.json`,JSON.stringify(x)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),s.hidden=!0,_(),p("已清空")}),l.addEventListener("click",()=>{u=!u,n.setEnabled(u),_()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),h&&_()},isOpen:()=>h,close:()=>m(!1)}}const lM={intents:{...ld},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function dM(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=tf(Uf,Ff),i=sM(n,e,un),a=nf(e),s=up(t),o=fp(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.32 · 11-07 16:22 · 诊断");const c=y=>String(y).padStart(2,"0"),l=new Date,d=Pf({meta:{version:"v0.9.32",buildTime:"11-07 16:22",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=cM(d,r),h=lp({deadZone:()=>un.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&d.suspend(800)});const u={timeScale:1,paused:!1,showColliders:un.showColliders,showGrid:un.showGrid};let g=1;const _=vf({maxRadiusPx:()=>un.joystick.maxRadiusPx,deadZone:un.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>un.zoom}),m=Array.from(document.querySelectorAll(".wp[data-weapon]"));let p=e.combat.weapon;function x(y){if(y===p)return;p=y;const D=yi.indexOf(y)+1;for(const H of m)H.classList.toggle("is-active",Number(H.dataset.weapon)===D);U.refreshWeapon()}let M=lM,v=0;const U=qf(e,un,u,{singleStep:()=>a.singleStep(M.intents),reset:()=>{g=1,a.singleStep({...ld,resetPressed:!0})},resetZoom:()=>{g=1,i.setZoom(1)},onToggleColliders:y=>i.setCollidersVisible(y),onToggleGrid:y=>i.setGridVisible(y)});o.register({motion:h,debug:U.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:a,input:_,viewConfig:un,debug:u,getUserZoom:()=>g,getGestures:()=>M.gestures,getLastGesture:()=>M.lastGesture,telemetry:d,telemetrySummary:()=>d.summary(),dirDebug:h.dirDebug,dirAngles:()=>h.dirDebug.last(),motionDebug:h,speedDebug:()=>h.last(),speedSamples:()=>h.samples(),gaitDebug:()=>i.gaitDebug()};let R=performance.now(),T=60,w=0;function b(y){const D=Math.min((y-R)/1e3,.1);R=y,D>0&&(T=T*.9+1/D*.1);const H=_.sample();H.intents.resetPressed&&(g=1),g=lf(g,H.zoomScale,un.zoom.min,un.zoom.max),i.setZoom(g);let z=H.intents.dummyClickId;if(H.tap){const A=i.pickDummy(H.tap.x,H.tap.y);A>0&&(z=A)}z>0&&(v=z),M={...H,intents:{...H.intents,dummyClickId:v}};const G=a.frame(D,M.intents,u.timeScale,u.paused,()=>{const A=e.events;for(let V=0;V<A.length;V++)d.event(A[V],e.time)});G>0&&(v=0),d.sample(e,M,D*1e3,G);for(const A of M.gestures)d.gesture(A);y-w>250&&(w=y,f.tick()),x(e.combat.weapon),i.render(e,D),h.update(e,M,i.getGroundBasis());const C=i.diagnostics();s.update(e,T,G,M,u,{attackBlend:C.attackBlend,attackWeights:C.attackWeights,landing:C.landing,hurt:C.hurt,ik:C.ik,zoom:C.camera.zoom},o.hudCompact()),requestAnimationFrame(b)}requestAnimationFrame(b)}dM();

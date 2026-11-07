(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const yi=["sword-shield","dual-swords","greatsword","staff","bow"],Ws=["wander","follow","keep-distance","attack","idle"],ld={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},_s=1e-6;function Ma(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>_s?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>_s?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Xh(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>_s){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>_s)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const sn=1e-6,Fo=Math.PI/180,dd=-1e9;function hd(){return{type:"none",lastAt:dd,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function No(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Tc(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function Gr(n,t,e){const i=e.duration>0?e.duration:Xr(n,e.type);if(t.kind==="player"){const s=n.playerHurt;if(Tc(s,e.type,i,e.dirX,e.dirZ),s.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>sn){const o=e.knockback*n.config.hits.knockbackDecay;s.knockX=e.dirX*o,s.knockZ=e.dirZ*o}No(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(a){if(Tc(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>sn){const s=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*s,a.hurt.knockZ=e.dirZ*s}n.hitCount+=1,No(n,"hit",a.id,a.position)}}function Vr(n,t,e){Gr(n,{kind:"dummy",index:t},e)}function Wh(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function Xr(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function $h(n){const t=n.combat,e=n.config.hits,i=n.character.position,a=e.reach[t.weapon]??0,s=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Fo),o=Math.sin(t.attackFacing),r=Math.cos(t.attackFacing),c=n.config.dummies.radius,l=n.config.targeting.idealRange;for(const d of n.dummies){const f=d.position.x-i.x,h=d.position.z-i.z,u=Math.hypot(f,h);if(u>a+c)continue;const g=u>sn?f/u:o,_=u>sn?h/u:r;if(u>sn&&(f*o+h*r)/u<s)continue;let m="light";t.weapon==="greatsword"?m="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(m="heavy");const p=e.knockback[t.weapon]??0;let v=u;p>0&&(v=Math.max(u+p,l));const M=Math.max(0,v-u);Vr(n,n.dummies.indexOf(d),{type:m,duration:Xr(n,m),dirX:g,dirZ:_,knockback:M})}}function Yh(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,c=i.fromZ,l=o.x,d=o.z,f=l-r,h=d-c,u=f*f+h*h,g=Math.sin(i.facing),_=Math.cos(i.facing),m=Math.cos(Ac(s.arcDeg,0,180)*Fo),p=n.config.dummies.radius;for(let v=0;v<n.dummies.length;v++){const M=n.dummies[v];if(i.hitIds.indexOf(M.id)>=0)continue;const x=u>sn?Ac(((M.position.x-r)*f+(M.position.z-c)*h)/u,0,1):0,U=r+f*x,R=c+h*x,T=Math.hypot(M.position.x-U,M.position.z-R);let w=!1;if(s.shape==="circle")w=T<=s.radius+p;else if(s.shape==="capsule")w=T<=Math.max(s.radius,s.width)+p;else{const V=M.position.x-l,P=M.position.z-d,A=Math.hypot(V,P),X=A>sn?(V*g+P*_)/A>=m:!0;w=A<=s.radius+p&&X||T<=s.width+p}if(!w)continue;const b=M.position.x-r,y=M.position.z-c,D=Math.hypot(b,y);if(D>sn&&(b*g+y*_)/D<Math.cos(Math.max(s.arcDeg,90)*Fo))continue;const B=D>sn?b/D:g,N=D>sn?y/D:_;Gr(n,{kind:"dummy",index:v},{type:s.type,duration:s.duration,dirX:B,dirZ:N,knockback:s.knockback}),i.hitIds.push(M.id),No(n,"link-hit",M.id,M.position)}}function Zh(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const a=n.dummies[i.value-1];if(!a)continue;const s=e.x-a.position.x,o=e.z-a.position.z,r=Math.hypot(s,o);if(r>t.dummyReach)continue;const c=r>sn?s/r:0,l=r>sn?o/r:1;Gr(n,{kind:"player"},{type:"light",duration:Xr(n,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:a.id})}}function qh(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&$h(n),Yh(n,t),Zh(n)}function Ac(n,t,e){return n<t?t:n>e?e:n}const os=1e-6;function ya(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function jh(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function Kh(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function Jh(n){const t=n.abilities,e=n.config.abilities.arcane,i=n.character.position,a=Math.sin(t.channelYaw),s=Math.cos(t.channelYaw),o=.55,r={id:++t.nextId,x:i.x+a*o,y:i.y+1,z:i.z+s*o,dirX:a,dirZ:s,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(r),t.volleyId+=1,ya(n,"projectile-fire",t.volleyId,r)}function Qh(n,t,e){const i=n.abilities,a=n.config.abilities.arcane,s=n.dash.phase==="active",o=n.playerLink;if(n.combat.weapon==="staff"&&e.attackHeld&&!s&&o.phase==="idle"&&!o.consumedAttack){i.channeling||(i.channeling=!0,i.fireTimer=0,ya(n,"channel-start",0,n.character.position)),i.channelYaw=Ma(n,e),i.fireTimer-=t;let c=0;for(;i.fireTimer<=0&&c++<8;)i.fireTimer+=Math.max(a.fireInterval,os),Jh(n)}else i.channeling&&(i.channeling=!1,ya(n,"channel-end",0,n.character.position))}function tu(n,t){const e=n.config.abilities.ring,i=n.dash.phase==="active";if(n.combat.weapon!=="staff"||!t.skill2Pressed||i)return;const a=n.character.position,s={id:++n.abilities.nextId,x:a.x,z:a.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};n.abilities.rings.push(s),ya(n,"ring-place",s.id,a)}function eu(n,t){const e=n.abilities,i=n.config.abilities.arcane,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of e.projectiles){if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let c=!1;if(s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],f=d.position.x-r.x,h=d.position.z-r.z,u=r.radius+a;if(!(f*f+h*h>u*u)){Vr(n,l,{type:i.hurtType,duration:i.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:i.knockback}),c=!0;break}}c||o.push(r)}e.projectiles=o}function nu(n,t){const e=n.abilities,i=n.config.abilities.ring,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of e.rings){r.life-=t,r.pulseTimer-=t;let c=0;for(;r.pulseTimer<=0&&c++<8;){if(r.pulseTimer+=Math.max(i.pulseInterval,os),s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],f=d.position.x-r.x,h=d.position.z-r.z,u=r.radius+a;if(f*f+h*h>u*u)continue;const g=Math.hypot(f,h),_=g>os?f/g:0,m=g>os?h/g:1;Vr(n,l,{type:"heavy",duration:i.stun,dirX:_,dirZ:m,knockback:i.knockback})}ya(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}e.rings=o}function iu(n,t,e){Qh(n,t,e),tu(n,e),eu(n,t),nu(n,t)}function $s(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Rc=1e-6;function Cc(n,t,e){return n<t?t:n>e?e:n}function ud(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function fd(n){const t=n.camera,e=ud();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function au(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const l of n.dummies){const d=l.position.x-i.x,f=l.position.z-i.z,h=Math.hypot(d,f);if(h>e.radius)continue;const u=Cc((e.radius-h)/Math.max(Rc,e.radius-e.nearDistance),0,1);let g=u*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(g+=e.attackBoost*u),a+=g,s+=l.position.x*g,o+=l.position.z*g,r+=1}const c=a<=0?0:Cc(a/(a+Math.max(Rc,e.saturation)),0,1);if(t.threat=c,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=s/a,d=o/a;t.centroidX=l,t.centroidZ=d;let f=(l-i.x)*e.framingBias*c,h=(d-i.z)*e.framingBias*c;const u=Math.hypot(f,h);u>e.maxOffset&&(f=f/u*e.maxOffset,h=h/u*e.maxOffset),t.offsetX=f,t.offsetZ=h}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function su(n){const t=[],e=n.ground.size;t.push(Ti("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Ti(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(Ti(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Ti(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Ti(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Ti(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Ti(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const Nn=1e-6;function xs(n,t,e){return n<t?t:n>e?e:n}function zo(n,t,e,i,a,s,o){const r=a*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+s+Nn||l.maxY<i-o-Nn||t+r<l.minX||t-r>l.maxX||e+r<l.minZ||e-r>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Wr(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const c of n){if(c.maxY<=t.y+a+Nn||c.minY>=o-Nn)continue;const l=xs(t.x,c.minX,c.maxX),d=xs(t.z,c.minZ,c.maxZ),f=t.x-l,h=t.z-d,u=f*f+h*h;if(!(u>=e*e))if(s=!0,u>Nn*Nn){const g=Math.sqrt(u),_=(e-g)/g;t.x+=f*_,t.z+=h*_}else{const g=t.x-c.minX,_=c.maxX-t.x,m=t.z-c.minZ,p=c.maxZ-t.z,v=Math.min(g,_,m,p);v===g?t.x=c.minX-e:v===_?t.x=c.maxX+e:v===m?t.z=c.minZ-e:t.z=c.maxZ+e}}return s}function $r(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Nn||o.minY>=s-Nn)continue;const r=xs(t.x,o.minX,o.maxX),c=xs(t.z,o.minZ,o.maxZ),l=t.x-r,d=t.z-c;if(l*l+d*d<e*e-Nn)return!0}return!1}const Oo=Math.PI/180,Yr=1e-6;function ou(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Bo(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function pd(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Yr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function md(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Yr)&&s<=Math.max(0,e.inputDeadZone)&&!o}function ru(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function cu(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!md(n,t,e))return!1;const i=pd(n,t,e.lookRange);if(i===null)return!1;const a=Fe(i-n.character.bodyYaw);return Math.abs(a)>Math.max(0,e.triggerDeg)*Oo}function lu(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!md(n,e,a)){Bo(n);return}const s=pd(n,e,a.lookRange);if(s===null){Bo(n);return}const o=n.character,r=Fe(s-o.bodyYaw),c=Math.abs(r),l=Math.max(0,a.triggerDeg)*Oo,d=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Yr;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(c,Math.max(0,a.settleDeg)*Oo);i.targetYaw=Fe(o.bodyYaw+i.dir*(c-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const h=Fe(i.targetYaw-i.fromYaw);o.bodyYaw=Fe(i.fromYaw+h*ru(i.progress)),d||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Ho=1e-6;function Fe(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Pa(n,t,e,i){const a=Fe(t-n);return n+a*(1-Math.exp(-Math.max(e,Ho)*i))}function Pc(n,t,e,i){const a=Fe(t-n),s=Math.abs(a);return s<=i||s<=e?t:Fe(n+Math.sign(a)*Math.max(e,0))}function du(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,c=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",l=o&&!c,d=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Ho,h=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=Ma(n,e);else if(l)i.facing=Pa(i.facing,n.gaze.centroidYaw,a.bodyTurnRate,t);else if(f)i.facing=Ma(n,e);else if(h)i.facing=n.targeting.targetYaw;else if(d>Math.max(a.facingDeadZone,Ho)){const U=Math.atan2(e.moveX,e.moveZ),R=a.facingTurnRate*Math.PI/180*t,T=a.facingSnapDeg*Math.PI/180;if(d>=.35)i.facing=Pc(i.facing,U,R,T);else if(d>=a.facingMinMagnitude&&Math.abs(Fe(U-i.facing))>a.facingDeadbandDeg*Math.PI/180){const b=Pa(i.facing,U,a.facingSmoothRate,t);i.facing=Pc(i.facing,b,R,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const g=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||cu(n,e)||(i.bodyYaw=Pa(i.bodyYaw,g,a.bodyTurnRate,t));let m=i.facing;if(o?m=l?n.gaze.mainYaw:i.facing:f?m=Math.atan2(e.aimX,e.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget&&(m=n.targeting.targetYaw),!o){const U=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Fe(m-i.bodyYaw))>U&&(m=i.moveYaw)}const p=l?n.config.gaze.headTurnRate:a.headTurnRate;let v=Pa(i.headYaw,m,p,t);const M=a.maxHeadTurnDeg*Math.PI/180,x=Fe(v-i.bodyYaw);x>M?v=i.bodyYaw+M:x<-M&&(v=i.bodyYaw-M),i.headYaw=v}const Go=1e-6,hu=Math.PI/180;function Vo(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Zr(n,t,e){return n<t?t:n>e?e:n}function Ds(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Xo(n){const t=n.id,e=n.windowId;Object.assign(n,Ds()),n.id=t,n.windowId=e}function uu(n){Xo(n)}function fu(n){Xo(n.playerLink);for(const t of n.dummies)Xo(t.link)}function pu(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Wo(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function vs(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Ds()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function mu(n,t){const e=n.config.links.search,i=n.character.position,a=Zr(e.maxAngleDeg,0,180)*hu;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,d=c.position.z-i.z,f=Math.hypot(l,d);if(f<Go||f>e.range)continue;const h=Math.atan2(l,d);Math.abs(Fe(h-t))>a||f<r&&(r=f,s=c.id,o=h)}return{id:s,yaw:o,dist:s>0?r:0}}function gu(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=Ma(n,t),c=mu(n,r),l=c.id>0?c.yaw:r,d=c.id>0?Zr(c.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=l,s.targetId=c.id,s.targetDist=c.dist,s.travel=d,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Vo(n,"link-start",s.id)}function _u(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){vs(n);return}if(e.weapon!==n.combat.weapon){vs(n);return}e.timer+=t;const a=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const c=a(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Vo(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Vo(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?Zr(r/o,0,1):1,e.phase==="active"&&i.active>Go){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Go,i.active-e.timer),d=c/l;n.impulse.x=Math.sin(e.facing)*d,n.impulse.z=Math.cos(e.facing)*d}}function xu(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&vs(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&Wo(n,"sprint"),a.prevSprinting=r,_u(n,t);const c=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&gu(n,e,c,o.weapon)}const $o=1e-6;function Kn(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function gd(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function _d(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=gd()}function vu(n){return{weapon:yi[Math.max(0,n-1)]??yi[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:gd()}}function Mu(n,t){return Ma(n,t)}function yu(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function xd(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=Mu(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,Kn(n,"attack-start",i)}function vd(n){return Math.max(0,n.config.combat.settle)}function Yo(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];xd(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:vd(n),lunge:yu(n,i.lunge[e-1]??0)},e)}function Su(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,xd(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:vd(n),lunge:i.lunge},0),Kn(n,"charge-release",e)}function bu(n,t,e){const i=n.combat;if(i.phase==="idle")return;const a=i.timings;i.phaseTimer+=t;let s=0;for(;i.phase!=="idle"&&s++<8;){const c=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<c)break;if(i.phaseTimer-=c,i.phase==="windup")i.phase="active",Kn(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",Kn(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&Yo(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const c=i.timings.recovery;if(c>$o&&i.phaseTimer>=c*n.config.combat.cancelWindow){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&Yo(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}const o=a.windup+a.active+a.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=a.windup+i.phaseTimer:i.phase==="recovery"?r=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1)}function Eu(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=yi.length){const c=yi[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,_d(n),vs(n),Kn(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,Kn(n,"combo-reset",0))),bu(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!c&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const d=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Yo(n,e,d)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&(!o&&!n.playerLink.consumedAttack&&e.attackPressed&&i.phase==="idle"&&!i.charging&&(i.charging=!0,i.charge=0,Kn(n,"charge-start",0)),i.charging&&e.attackHeld&&(i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,$o))),i.charging&&!o&&(e.attackReleased||!e.attackHeld))){i.charging=!1;const c=i.charge;i.charge=0,c>=a.bow.minChargeToFire&&i.phase==="idle"?Su(n,e,c):Kn(n,"charge-release",0)}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>$o)){const c=i.timings.lunge/i.timings.active;n.impulse.x=Math.sin(i.attackFacing)*c,n.impulse.z=Math.cos(i.attackFacing)*c}}const Zo=1e-6;function Ys(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function wu(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Tu(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Dc(n,t,e){return n<t?t:n>e?e:n}function Au(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,d=s.x,f=s.z;for(;l<c-Zo;){const h=Math.min(c,l+r),u=s.x+t*h,g=s.z+e*h,_=Dc(u,o.minX,o.maxX),m=Dc(g,o.minZ,o.maxZ),p={x:_,y:s.y,z:m};if($r(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(d=_,f=m,l=h,_!==u||m!==g))break}return{x:d,z:f}}function Ru(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Wo(n,"roll")),i.cooldown>0){const r=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),r>0&&i.cooldown===0&&Ys(n,"dash-ready",0)}const s=n.combat;if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&s.phase==="idle"&&!s.charging&&n.playerLink.phase==="idle"){const r=Xh(n,e),c=r.x,l=r.z,d=n.combat.weapon==="staff";if(i.kind=d?"blink":"roll",i.dirX=c,i.dirZ=l,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=d?a.blinkCooldown:a.rollCooldown,d){const f=Au(n,c,l);n.character.position.x=f.x,n.character.position.z=f.z,i.toX=f.x,i.toZ=f.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Wo(n,"blink"),Ys(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Zo,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+l*a.rollDistance,Ys(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const r=Math.max(Zo,i.timer),c=n.character.position.x,l=n.character.position.z;n.impulse.x=(i.toX-c)/r,n.impulse.z=(i.toZ-l)/r}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const on=1e-6,qo=Math.PI*2,Cu=7,Pu=18;function Lc(n,t,e){return n<t?t:n>e?e:n}function Du(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ic(n,t,e,i){return n+Du(t-n)*(1-Math.exp(-Math.max(e,on)*i))}function qr(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Lu(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},a=n.initialModes[e]??"idle";t.push({id:e+1,mode:a,initialMode:a,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:hd(),link:Ds()})}return t}function Iu(n){const t=Ws.indexOf(n);return Ws[(t+1)%Ws.length]}function ku(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,uu(i.link)}n.dummyAttackCount=0}function Uu(n,t,e){const i=$s(n)*qo,a=Math.sqrt($s(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+$s(n)*.8)}function Fu(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function Nu(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const r=Math.max(Fu(t,i),on);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",qr(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const s=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||s<=0?0:Math.min(1,o/s)}function zu(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>on?a/o:0,c=o>on?s/o:0;let l=0,d=0;if(t.mode==="wander"){const h=t.targetX-t.position.x,u=t.targetZ-t.position.z,g=Math.hypot(h,u);(t.wanderTimer<=0||g<.3)&&Uu(n,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(_,m);p>on&&(l=_/p,d=m/p)}else if(t.mode==="follow")o>e.followStopDistance&&(l=r,d=c);else if(t.mode==="keep-distance"){const h=o-e.keepDistance;h>e.keepDeadZone?(l=r,d=c):h<-e.keepDeadZone?(l=-r,d=-c):(l=-c*e.keepStrafe,d=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(l=r,d=c);let f=t.facing;return t.mode==="wander"?Math.hypot(l,d)>on&&(f=Math.atan2(l,d)):o>on&&(f=Math.atan2(r,c)),{x:l,z:d,facing:f}}function Ou(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const m=n.character.position;Math.hypot(m.x-e.position.x,m.z-e.position.z)<=i.attackRange+on&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,qr(n,"dummy-attack",e))}Nu(n,e,t,i);const a=zu(n,e,i),s=1-Math.exp(-Math.max(i.acceleration,on)*t);e.velocity.x+=(a.x*i.moveSpeed-e.velocity.x)*s,e.velocity.z+=(a.z*i.moveSpeed-e.velocity.z)*s,e.facing=a.facing,e.bodyYaw=Ic(e.bodyYaw,e.facing,Cu,t),e.headYaw=Ic(e.headYaw,e.facing,Pu,t);const o=e.position.x,r=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;Wr(n.boxes,e.position,i.radius,i.height,c)&&$r(n.boxes,e.position,i.radius,i.height,c)&&(e.position.x=o,e.position.z=r,e.velocity.x=0,e.velocity.z=0);const d=n.config.worldBounds;e.position.x=Lc(e.position.x,d.minX,d.maxX),e.position.z=Lc(e.position.z,d.minZ,d.maxZ);const f=zo(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+c+on&&(e.position.y=f);const h=Math.hypot(e.position.x-o,e.position.z-r);e.distance+=h;const u=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,u/Math.max(n.config.moveSpeed,on)),_=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),on);e.stride=_,e.gaitPhase=(e.gaitPhase+h/_*qo)%qo}function Bu(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=Iu(a.mode),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,qr(n,"dummy-mode",a)}for(const a of n.dummies)Ou(n,t,a,i)}const Ai=1e-6,kc=Math.PI*2;function Zs(n,t){return Math.sqrt(n*n+t*t)}function Da(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Hu(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,_d(n)}function Gu(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=e.moveX,c=e.moveZ;const l=Zs(r,c);l>1&&(r/=l,c/=l);const d=n.combat.phase!=="idle",f=n.playerLink.phase!=="idle",h=d||n.dash.phase==="active"||f;a.sprinting=!h&&e.sprintHeld&&l>Ai;const u=i.combat.weapons[n.combat.weapon];let g=u?u.moveMultiplier:1;h?g*=n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=i.abilities.arcane.moveScale);const _=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;if(h)o.x=r*_,o.z=c*_;else{const B=l>Ai?i.acceleration:i.friction,N=1-Math.exp(-B*t);o.x+=(r*_-o.x)*N,o.z+=(c*_-o.z)*N}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,Da(n,"jumped",i.jumpSpeed)),n.events.some(B=>B.type==="blink"&&B.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const p=s.x,v=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Wr(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if($r(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=p,s.z=v,o.x=0,o.z=0;else{const B=s.x-p,N=s.z-v;Math.abs(B)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(N)<Math.abs(o.z*t)*.5&&(o.z=0)}Da(n,"blocked",1)}const x=i.worldBounds;s.x=Uc(s.x,x.minX,x.maxX),s.z=Uc(s.z,x.minZ,x.maxZ);const U=zo(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&U>s.y+Ai&&U-s.y<=i.stepHeight+Ai&&(s.y=U,o.y=0,Da(n,"stepUp",U));const R=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const T=zo(n.boxes,s.x,s.z,R,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&s.y<=T&&o.y<=0?(s.y=T,o.y=0,a.grounded||Da(n,"landed",T),a.grounded=!0):a.grounded=!1;const w=Zs(s.x-p,s.z-v);a.distance+=w;const b=Zs(o.x,o.z),y=Math.min(i.strideSpeedCap,b/Math.max(i.moveSpeed,Ai)),D=Math.max(i.strideLength*(1+y*i.strideSpeedGain),Ai);a.stride=D,a.gaitPhase=(a.gaitPhase+w/D*kc)%kc}function Uc(n,t,e){return n<t?t:n>e?e:n}const jo=1e-6,Fc=2.399963229728653;function mi(n,t,e){return n<t?t:n>e?e:n}function Nc(n,t,e,i,a,s,o,r,c){const l=t.x-n.x,d=t.z-n.z,f=Math.hypot(l,d),h=e+i;if(f>=h)return;let u,g,_;f<jo?(u=r,g=c,_=h):(u=l/f,g=d/f,_=h-f);const m=_+o;n.x-=u*m*a,n.z-=g*m*a,t.x+=u*m*s,t.z+=g*m*s}function Vu(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let d=0;d<o;d++){for(let f=0;f<e.length;f++)for(let h=f+1;h<e.length;h++){const u=(f*3+h)*Fc;Nc(e[f].position,e[h].position,s,s,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const h=(f+1)*Fc;Nc(i,e[f].position,a,s,0,1,r,Math.cos(h),Math.sin(h))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const d of e)Wr(n.boxes,d.position,s,n.config.dummies.height,c),d.position.x=mi(d.position.x,l.minX,l.maxX),d.position.z=mi(d.position.z,l.minZ,l.maxZ)}function Xu(n,t,e,i,a,s,o,r){const c=Math.hypot(e,i),l=Math.max(0,r.contactBand),d=mi(r.minScale,0,1);if(c<jo||l<=0||d>=1)return 1;const f=a+o,h=mi(r.approachDot,0,.99);let u=0;for(const g of s){const _=g.position.x-n,m=g.position.z-t,p=Math.hypot(_,m);if(p>=f+l)continue;if(p<jo){u=1;continue}const v=(e*_+i*m)/(c*p);if(v<=h)continue;const M=mi(1-(p-f)/l,0,1),x=mi((v-h)/(1-h),0,1);u=Math.max(u,M*x)}return 1-(1-d)*mi(u,0,1)}function Wu(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Xu(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const zc=1e-6,$u=Math.PI/180;function Yu(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Zu(n,t,e){return n<t?t:n>e?e:n}function qu(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;Math.hypot(e.moveX,e.moveZ)>zc&&(o=Math.atan2(e.moveX,e.moveZ));const c=Zu(i.maxAngleDeg,0,180)*$u;let l=Number.POSITIVE_INFINITY,d=0,f=0,h=0;for(const u of n.dummies){const g=u.position.x-s.x,_=u.position.z-s.z,m=Math.hypot(g,_);if(m<zc||m>i.range)continue;const p=Math.atan2(g,_),v=Math.abs(Fe(p-o));if(v>c)continue;const M=m-i.frontBias*Math.cos(v);M<l&&(l=M,d=u.id,f=p,h=m)}a.targetId=d,a.targetYaw=f,a.targetDist=h,a.hasTarget=d>0}const Fn=1e-6;function Ms(n,t,e){return n<t?t:n>e?e:n}function Oc(n){return Math.atan2(Math.sin(n),Math.cos(n))}function ju(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(y,D)=>{const B=y.position.x-s.x,N=y.position.z-s.z,V=Math.hypot(B,N);if(V<Fn||V>D)return 0;const P=Ms((D-V)/Math.max(Fn,D-i.nearDistance),0,1);let A=P*(i.modeWeight[y.mode]??.5);return y.attackPhase==="active"&&(A+=i.attackBoost*P),A},r=[];let c=0,l=!1,d=!1,f=!1;for(const y of n.dummies){const D=o(y,i.threatRange),B=y.position.x-s.x,N=y.position.z-s.z,V=Math.hypot(B,N);D>0&&(r.push({id:y.id,x:y.position.x,z:y.position.z,dx:B,dz:N,yaw:Math.atan2(B,N),w:D}),c+=D,V<=i.approachDist&&(i.modeWeight[y.mode]??.5)>=i.hostileModeWeight&&(f=!0)),V>Fn&&V<=i.recoveryDist&&(l=!0),(y.attackPhase==="windup"||y.attackPhase==="active")&&V<=i.threatRange&&(d=!0)}const h=c<=0?0:Ms(c/(c+Math.max(Fn,i.saturation)),0,1),u=r.length>0,g=a.active,_=u&&(e.aimActive&&h>=i.enterThreshold||i.reactToAttack&&d&&h>=i.enterThreshold||i.reactToApproach&&f),m=i.hurtHoldSec>Fn&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=g&&(l||m);if(a.active=_||p,!a.active){a.mainId=0,a.mainYaw=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((y,D)=>D.w-y.w);const v=r.slice(0,Math.max(1,i.maxThreats)),M=r[0],x=Math.atan2(M.dx,M.dz),U=i.behindAngleDeg*Math.PI/180,R=n.character.bodyYaw;let T=0,w=0,b=0;for(const y of v){const D=Math.abs(Oc(y.yaw-x))/Math.PI;let B=y.w/(1+Math.max(i.spreadFalloff,0)*D*D);y!==M&&i.behindFalloff<1&&Math.abs(Oc(y.yaw-R))>U&&(B*=Math.max(i.behindFalloff,0)),T+=y.x*B,w+=y.z*B,b+=B}a.mainId=M.id,a.mainYaw=x,a.centroidYaw=b>Fn?Math.atan2(T/b-s.x,w/b-s.z):x,a.threatCount=r.length,a.threat=h}function Ku(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function Ju(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<Fn||a>e.threatRange)return 0;const s=Math.max(Fn,e.threatRange-e.nearDistance),o=Ms((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const c=Math.max(Fn,e.modeWeight.attack??1.5);return Ms(r/c,0,1)}function Qu(){return{active:!1,mainId:0,mainYaw:0,centroidYaw:0,threatCount:0,threat:0}}function tf(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:su(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:vu(1),playerLink:Ds(),abilities:jh(),impulse:{x:0,z:0},targeting:Yu(),turnInPlace:ou(),playerHurt:hd(),hitCount:0,dash:{...wu(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...ud(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Qu(),dummies:Lu(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function ef(n){Hu(n),ku(n),fu(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=dd,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Kh(n),Tu(n),fd(n),Bo(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Bc(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){ef(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?qu(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),xu(n,t,e),n.modules.combat&&Eu(n,t,e),n.modules.dash&&Ru(n,t,e),n.modules.movement&&Gu(n,t,e),n.modules.gaze&&ju(n,t,e),n.modules.orientation&&du(n,t,e),lu(n,t,e),n.modules.dummies&&Bu(n,t,e),Wh(n,t),pu(n,t),n.modules.abilities&&iu(n,t,e),n.modules.dummies&&(qh(n,t),n.modules.separation&&(Vu(n),Wu(n))),n.modules.camera?au(n):fd(n),n}function nf(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=r&&l<c;){const d=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Bc(n,r,d),o&&o(),t-=r,l++}return l>=c&&(t=0),l},singleStep(e){Bc(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Md={slopPx:12,longPressMs:450,doubleTapMs:280};function af(n,t,e=Md.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function si(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function sf(n=Md){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,c){if(t.has(s))return null;for(const l of t.values())if(l.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:c,dragging:!1,longFired:!1}),si(a,"press",0,0,0,1)},move(a,s,o,r){const c=i(a);if(!c)return null;c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY;return!c.dragging&&Math.hypot(l,d)>=n.slopPx?(c.dragging=!0,si(c.button,"drag",l,d,r-c.startedAt,1)):null},end(a,s,o,r){const c=i(a);if(!c)return null;t.delete(a),c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY,f=r-c.startedAt,h=Math.hypot(l,d);if(c.dragging||c.longFired||h>=n.slopPx)return si(c.button,"release",l,d,f,1);const u=e.get(c.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(s-u.x,o-u.y)<=n.slopPx*2?(e.delete(c.button),si(c.button,"doubleTap",l,d,f,2)):(e.set(c.button,{at:r,x:s,y:o}),si(c.button,"tap",l,d,f,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),si(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,si(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const qs=.001,of=18;function Ko(n,t,e){return n<t?t:n>e?e:n}function Jo(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function rf(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function cf(n,t,e,i,a=of){const s=rf(t);if(!s)return{state:Jo(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,d=c;if(!Number.isFinite(o)||o<qs)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<qs?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<qs)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,h=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,h):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:Ko(Number.isFinite(u)?u:1,l,d),started:!1,ended:!1,armedNow:!1,pinching:!0}}function lf(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?Ko(r,a,s):Ko(n,a,s)}function df(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function hf(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const js=["jump","sprint","reset","attack","skill2"],uf=8,ff=16,Ks=10,Hc=14,Gc=140,pf=18,mf=16,gf=400,_f=1.0001;function rs(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function xf(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&rs(e)}function vf(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,c=0,l=0,d=0,f=0,h=0,u=-1,g=0,_=null,m=-1,p=0,v=0,M=0,x=0,U=!1,R=0,T=1,w=0,b=null,y=0,D=0,B=!1,N=null,V=null,P=0,A=0,X=0,H=0,q=!1,Q=!0,dt=-1;const ft=sf({slopPx:Hc,longPressMs:450,doubleTapMs:350});let vt=[],Y=null;const et=new Set;function _t(z){z&&vt.push(z)}const K=new Map;let pt=Jo(),Pt=!1,At=1;function zt(){const z=Array.from(K.values()),nt=a(),ut=cf(pt,z,nt.pinchGain,nt.maxStepRatio,pf);if(pt=ut.state,Pt=ut.pinching,ut.scale!==1&&(At*=ut.scale),ut.started||ut.armedNow)b=null,B=!0,N=null;else if(ut.ended&&o===null&&z.length===1){const Ut=z[0];o=Ut.id,r=Ut.x,c=Ut.y,l=0,d=0,f=Ut.x,h=Ut.y,U=!1,R=0,T=1,w=0,performance.now(),b=null,B=!0,N=null}}const St={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},bt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let O=0,Zt=0;const Dt={},Ct=new Set,wt=[];function yt(){for(const z of js)Dt[z]!==void 0&&(Dt[z]=void 0),G(z);ft.reset(),et.clear(),K.clear(),pt=Jo(),Pt=!1,o=null,l=0,d=0,f=0,h=0,U=!1,R=0,T=1,w=0,p=0,v=0,M=0,x=0,_=null,m=-1,b=null,B=!1,N=null,V=null,dt=-1,X=0,H=0,q=!1,Q=!0}const Tt=()=>{document.hidden&&yt()},C=z=>{if(z.clientX===0&&z.clientY===0){g++;return}if(rs(z.target)||xf(z.clientX,z.clientY)){et.add(z.pointerId);return}if(et.delete(z.pointerId),K.set(z.pointerId,{id:z.pointerId,x:z.clientX,y:z.clientY}),o===null&&!Pt){_=null,m=-1,o=z.pointerId,r=z.clientX,c=z.clientY,l=0,d=0,f=z.clientX,h=z.clientY,performance.now();const nt=Number.isFinite(z.screenX)&&Number.isFinite(z.screenY)&&(z.screenX!==0||z.screenY!==0);U=nt,R=0,T=1,w=0,p=nt?z.screenX:0,v=nt?z.screenY:0,M=p,x=v,b=z.pointerId,y=z.clientX,D=z.clientY,B=!1}zt()},S=z=>{if(z.pointerId===V&&(z.pointerType==="mouse"&&z.buttons===0||z.clientX===0&&z.clientY===0&&(P!==0||A!==0)||(Q?(X=z.clientX-P,H=z.clientY-A):(P=z.clientX,A=z.clientY,Q=!0,X=0,H=0))),_t(ft.move(z.pointerId,z.clientX,z.clientY,performance.now())),!et.has(z.pointerId)&&K.has(z.pointerId)&&(K.set(z.pointerId,{id:z.pointerId,x:z.clientX,y:z.clientY}),zt()),et.has(z.pointerId)||z.pointerId!==o)return;const nt=performance.now();if(_===z.pointerId&&nt-m<150){g++;return}const ut=z.clientX,Ut=z.clientY;if(ut===0&&Ut===0&&(r!==0||c!==0)){g++;return}const Z=ut-f,L=Ut-h,it=Number.isFinite(z.screenX)&&Number.isFinite(z.screenY),$=it?z.screenX:0,J=it?z.screenY:0,mt=it&&($!==0||J!==0),gt=$-M,Ot=J-x;if(U&&mt){const se=Math.hypot(gt,Ot),te=Math.hypot(Z,L);if(se>3){if(R=0,w<30&&te>6&&gt*Z+Ot*L>.7*se*te){const ve=se/te;ve>.2&&ve<5&&(T+=(ve-T)*.3,w++)}}else te>12&&(R++,R>=2&&(U=!1))}const Yt=Math.hypot(Z,L);if(!U){const se=u<0?Number.POSITIVE_INFINITY:nt-u,te=mt?Math.hypot(gt,Ot):1/0;Yt>28&&(se<200||te<Yt*.4)&&(r+=Z,c+=L,g++)}f=ut,h=Ut,M=$,x=J,z.pointerId===b&&Math.hypot(z.clientX-y,z.clientY-D)>uf&&(B=!0);let Qt,$t;U&&mt?(Qt=($-p)/T,$t=(J-v)/T):(Qt=ut-r,$t=Ut-c);const le=Math.hypot(Qt,$t),he=s();le>he&&(Qt*=he/le,$t*=he/le);const xe=Math.hypot(l,d),ye=Math.hypot(Qt,$t);if(xe>10&&ye>10){const se=Math.abs(Math.atan2(l*$t-d*Qt,l*Qt+d*$t)),te=Math.max(xe,ye)*se,ve=Math.max(Math.hypot(Z,L),Math.hypot(gt,Ot)/Math.max(.2,T));if(se>.6&&ve<Math.max(6,te*.5)){g++;return}}l=Qt,d=$t};function G(z){if(!St[z])return;St[z]=!1,z==="attack"&&(bt.attackReleased=!0);const nt=document.getElementById(`btn-${z}`);nt==null||nt.classList.remove("is-down")}function ct(){o!==null&&(_=o,m=performance.now(),o=null,l=0,d=0,f=0,h=0,U=!1,R=0,T=1,w=0,p=0,v=0,M=0,x=0)}const lt=z=>{const nt=K.delete(z.pointerId),ut=et.delete(z.pointerId);nt&&zt(),z.pointerId===V&&(V=null,q?dt=performance.now():(X=0,H=0,dt=-1)),_t(ft.end(z.pointerId,z.clientX,z.clientY,performance.now()));for(const Nt of js)Dt[Nt]===z.pointerId&&(Dt[Nt]=void 0,G(Nt));const Ut=!nt&&!ut&&K.size<=1&&o!==null;(z.pointerId===o||K.size===0||Ut)&&ct(),!ut&&z.pointerId===b&&(!B&&!rs(z.target)&&(N={x:z.clientX,y:z.clientY}),b=null)};for(const z of js){const nt=document.getElementById(`btn-${z}`);if(!nt)continue;const ut=z==="attack"||z==="skill2",Ut=L=>{if(L.preventDefault(),Dt[z]===void 0){Dt[z]=L.pointerId,St[z]=!0,z==="jump"&&(bt.jump=!0),z==="reset"&&(bt.reset=!0),z==="sprint"&&(bt.sprintPressed=!0),z==="attack"&&(bt.attackPressed=!0),z==="skill2"&&(bt.skill2=!0),nt.classList.add("is-down"),_t(ft.begin(z,L.pointerId,L.clientX,L.clientY,performance.now()));try{nt.setPointerCapture(L.pointerId)}catch{}ut&&(V=L.pointerId,P=L.clientX,A=L.clientY,Q=!(L.clientX===0&&L.clientY===0),X=0,H=0,q=!1,dt=-1)}},Nt=L=>{Dt[z]===L.pointerId&&(Dt[z]=void 0,G(z),_t(ft.end(L.pointerId,L.clientX,L.clientY,performance.now())))},Z=L=>{Dt[z]===L.pointerId&&(Dt[z]=void 0,G(z),_t(ft.cancel(L.pointerId,performance.now())))};nt.addEventListener("pointerdown",Ut),nt.addEventListener("pointerup",Nt),nt.addEventListener("pointercancel",Z),wt.push(()=>{nt.removeEventListener("pointerdown",Ut),nt.removeEventListener("pointerup",Nt),nt.removeEventListener("pointercancel",Z)})}const ot=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const z of ot){const nt=ut=>{ut.preventDefault(),O=Number(z.dataset.weapon)||0};z.addEventListener("pointerdown",nt),wt.push(()=>z.removeEventListener("pointerdown",nt))}const It=z=>{const nt=z.key.toLowerCase();if((nt===" "||nt.startsWith("arrow"))&&z.preventDefault(),Ct.has(nt))return;Ct.add(nt),nt===" "&&(bt.jump=!0),nt==="r"&&(bt.reset=!0),nt==="shift"&&(bt.sprintPressed=!0),nt==="j"&&(bt.attackPressed=!0),nt==="k"&&(bt.skill2=!0),nt>="1"&&nt<="5"&&(O=Number(nt)),nt>="6"&&nt<="9"&&(Zt=Number(nt)-5);const ut=Math.max(_f,a().keyStep||1.12);(nt==="="||nt==="+")&&(At*=ut),(nt==="-"||nt==="_")&&(At/=ut)},tt=z=>{const nt=z.key.toLowerCase();Ct.has(nt)&&(Ct.delete(nt),nt==="j"&&(bt.attackReleased=!0))},xt=z=>{if(rs(z.target))return;z.preventDefault();const nt=z.deltaMode===1?z.deltaY*mf:z.deltaMode===2?z.deltaY*gf:z.deltaY;At*=df(nt,a().wheelStep)},Ht=z=>{z.preventDefault()},at=()=>{u=performance.now()};window.addEventListener("resize",at),window.addEventListener("orientationchange",at);const Mt=typeof window<"u"?window.visualViewport:null;return Mt&&(Mt.addEventListener("resize",at),Mt.addEventListener("scroll",at)),window.addEventListener("pointerdown",C),window.addEventListener("pointermove",S),window.addEventListener("pointerup",lt),window.addEventListener("pointercancel",lt),window.addEventListener("blur",yt),document.addEventListener("visibilitychange",Tt),window.addEventListener("keydown",It),window.addEventListener("keyup",tt),window.addEventListener("wheel",xt,{passive:!1}),window.addEventListener("gesturestart",Ht),{peekStick(){return{id:o,held:o!==null,originX:r,originY:c,x:f,y:h,dx:f-r,dy:h-c,radius:s(),badMoves:g,screenOk:U,originSX:p,originSY:v,screenX:M,screenY:x,scale:T}},peekAim(){const z=performance.now(),nt=Math.hypot(X,H),ut=V!==null||dt>=0&&z-dt<Gc;if(!(ut&&q&&nt>=Ks))return{active:!1,holding:ut,x:0,z:0,dx:X,dy:H};const Nt=i(),Z=X/nt,L=H/nt,it=Nt.rightX*Z+Nt.forwardX*-L,$=Nt.rightZ*Z+Nt.forwardZ*-L,J=Math.hypot(it,$)||1;return{active:!0,holding:ut,x:it/J,z:$/J,dx:X,dy:H}},sample(){var Lt;const z=s();let nt=o!==null?Math.max(-1,Math.min(1,l/z)):0,ut=o!==null?Math.max(-1,Math.min(1,d/z)):0,Ut=0,Nt=0;(Ct.has("a")||Ct.has("arrowleft"))&&(Ut-=1),(Ct.has("d")||Ct.has("arrowright"))&&(Ut+=1),(Ct.has("w")||Ct.has("arrowup"))&&(Nt-=1),(Ct.has("s")||Ct.has("arrowdown"))&&(Nt+=1),nt+=Ut,ut+=Nt;let Z=Math.hypot(nt,ut);Z>1&&(nt/=Z,ut/=Z,Z=1);const L=nt,it=ut;Z<e&&(nt=0,ut=0);const $=i();let J=$.rightX*nt+$.forwardX*-ut,mt=$.rightZ*nt+$.forwardZ*-ut;const gt=Math.hypot(J,mt);gt>1&&(J/=gt,mt/=gt);const Ot=performance.now();_t(ft.poll(Ot));const Yt=Math.hypot(X,H);V!==null&&(Yt>=ff?q=!0:Yt<Ks&&(q=!1));const Qt=V!==null||dt>=0&&Ot-dt<Gc,$t=Qt&&q&&Yt>=Ks;let le=0,he=0;if($t){const Bt=X/Yt,ge=H/Yt,ee=$.rightX*Bt+$.forwardX*-ge,Te=$.rightZ*Bt+$.forwardZ*-ge,Ze=Math.hypot(ee,Te)||1;le=ee/Ze,he=Te/Ze}!Qt&&V===null&&(X=0,H=0,dt=-1,q=!1);const xe=N;N=null;const ye=At;At=1;const se={moveX:J,moveZ:mt,jumpPressed:bt.jump,sprintHeld:St.sprint||Ct.has("shift"),sprintPressed:bt.sprintPressed,resetPressed:bt.reset,attackPressed:bt.attackPressed,attackHeld:St.attack||Ct.has("j"),attackReleased:bt.attackReleased,skill2Pressed:bt.skill2,weaponSlot:O,dummyClickId:Zt,aimX:le,aimZ:he,aimActive:$t};bt.jump=!1,bt.reset=!1,bt.sprintPressed=!1,bt.attackPressed=!1,bt.attackReleased=!1,bt.skill2=!1,O=0,Zt=0;const te=vt.map(Bt=>af(Bt,$,Hc));vt=[],te.length>0&&(Y=te[te.length-1]);const ve=o!==null?"pointer":Ct.size>0?"keyboard":"idle";return{intents:se,stickX:nt,stickY:ut,stickRawX:L,stickRawY:it,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:c,stickPxX:f,stickPxY:h,stickBad:g,stickScreenOk:U,stickOriginSX:p,stickOriginSY:v,stickScreenX:M,stickScreenY:x,stickScale:T,stickVpTop:((Lt=hf())==null?void 0:Lt.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:X,aimDY:H,source:ve,tap:xe,zoomScale:ye,gestures:te,lastGesture:Y}},dispose(){window.removeEventListener("pointerdown",C),window.removeEventListener("pointermove",S),window.removeEventListener("pointerup",lt),window.removeEventListener("pointercancel",lt),window.removeEventListener("blur",yt),document.removeEventListener("visibilitychange",Tt),window.removeEventListener("keydown",It),window.removeEventListener("keyup",tt),window.removeEventListener("wheel",xt),window.removeEventListener("resize",at),window.removeEventListener("orientationchange",at),Mt&&(Mt.removeEventListener("resize",at),Mt.removeEventListener("scroll",at)),window.removeEventListener("gesturestart",Ht),ft.reset();for(const z of wt)z()}}}const ys=1,Ss=2,bs=4,yd=8,Es=16,xa=32,Sd=64,bd=128,Mf=[[ys,"atk"],[Ss,"dash"],[bs,"link"],[yd,"air"],[Es,"hurt"],[xa,"aim"],[Sd,"spr"],[bd,"chan"]];function Ri(n){if(n===0)return"-";const t=Mf.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const yf=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Sf=0,bf=15,Js=19,Ef=21,wf=22,Tf=23,Af=24,yn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Ge=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,hn=n=>Math.round(n*180/Math.PI*10)/10,Qs=Math.PI*2;function ra(n){let t=n%Qs;return t>Math.PI&&(t-=Qs),t<-Math.PI&&(t+=Qs),t}function Rf(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=ys),n.dash.phase!=="idle"&&(e|=Ss),n.playerLink.phase!=="idle"&&(e|=bs),n.character.grounded||(e|=yd),n.playerHurt.type!=="none"&&(e|=Es),t.intents.aimActive&&(e|=xa),n.character.sprinting&&(e|=Sd),n.abilities.channeling&&(e|=bd),e}function Cf(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Pf(n){const t={sampleHz:n.sampleHz??yn.sampleHz,sampleCapacity:n.sampleCapacity??yn.sampleCapacity,eventCapacity:n.eventCapacity??yn.eventCapacity,anomalyCapacity:n.anomalyCapacity??yn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??yn.dirJumpDeg,aimDropDeg:n.aimDropDeg??yn.aimDropDeg,freezeMs:n.freezeMs??yn.freezeMs,freezeSpeed:n.freezeSpeed??yn.freezeSpeed,stickLostMs:n.stickLostMs??yn.stickLostMs,spikeMs:n.spikeMs??yn.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,c=-1,l=-1e9,d=null,f=0,h=0,u="",g=-1,_=-1,m=-1,p=0,v=-1e9,M=-1,x={},U=null,R=0,T=0,w=0,b=0;function y(P,A){const X=1/t.sampleHz,H=P[Sf];H-l<X-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(P),l=H)}function D(P,A,X,H,q,Q){const dt=x[P]??-1e9;if(A-dt<1.2)return;if(x[P]=A,P==="frameSpike"){let vt=0;for(const Y of s)Y.kind==="frameSpike"&&vt++;if(vt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let ft=i.slice(-7);Q&&(ft.length===0||ft[ft.length-1]!==Q)&&(ft=[...ft.slice(-6),Q]),s.push({kind:P,t:Ge(A),tick:X,ms:Math.round(H),detail:q,ctx:ft}),P==="dirJump"?o.dirJumps++:P==="aimDrop"?o.aimDrops++:P==="moveFreeze"?o.freezes++:P==="stickLost"?o.stickLosts++:P==="stickJump"?o.stickJumps++:P==="stickBad"?o.stickBads++:P==="stickDrift"&&o.stickDrifts++}function B(P,A,X,H){a.length>=t.eventCapacity&&a.shift(),a.push({t:Ge(X),tick:H,k:P,d:A})}function N(P){switch(P.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":v=P.tick;break}}function V(){const P=o,A=P.wallMs/1e3,X=P.gestures,H=ft=>Object.entries(X).filter(([vt])=>vt.endsWith(`.${ft}`)).reduce((vt,[,Y])=>vt+Y,0),q=[];if(q.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),q.push(`运行 ${A.toFixed(1)}s / ${P.frames} 帧 · ${P.fps.toFixed(1)}fps · 最大 ${P.dtMax.toFixed(0)}ms · 尖峰 ${P.spikes} · 步 ${P.steps}`),q.push(`摇杆活跃 ${A>0?Math.round(P.stickActiveMs/1e3/A*100):0}% · 手势 按下 ${H("press")}（单击 ${H("tap")} / 双击 ${H("doubleTap")} / 拖拽 ${H("drag")} / 长按 ${H("longPress")} / 打断 ${H("cancel")} / 拖放 ${H("release")}）`),q.push(`攻击 ${P.attacks}(中${P.hits}) · 受击 ${P.hurts} · 派生 ${P.links}(中${P.linkHits}) · 翻滚 ${P.rolls} 闪现 ${P.blinks} · 跳 ${P.jumps} · 复位 ${P.resets}`),q.push(`法杖 引导${P.channels} 飞弹${P.bolts} 电环${P.rings} · 弓蓄力${P.bowCharges} · 当前武器 ${u||"-"}`),q.push(`异常 ${P.dirJumps+P.aimDrops+P.freezes+P.stickLosts+P.stickJumps+P.stickBads+P.stickDrifts}（dir ${P.dirJumps} / aim ${P.aimDrops} / freeze ${P.freezes} / stick ${P.stickLosts} / stickJump ${P.stickJumps} / 坏指针 ${P.stickBads} / 坐标漂移 ${P.stickDrifts}） · 掉帧尖峰 ${P.spikes}`+(P.inTurns>0?` · 输入转向 ${P.inTurns} 次（最大 ${P.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const ft of s.slice(-6)){q.push(`· ${ft.kind} @t${ft.t.toFixed(2)} tick${ft.tick} ${ft.ms>0?`${ft.ms}ms `:""}${ft.detail}`);const vt=ft.ctx.map(et=>String(et[bf])).join(" "),Y=ft.ctx.map(et=>et[Js]===""||et[Js]==null?".":String(et[Js])).join(" ");if(q.push(`  yaw ${vt}`),q.push(`  in  ${Y}`),ft.kind==="stickJump"||ft.kind==="stickBad"||ft.kind==="stickLost"){const et=ft.ctx.map(K=>`${K[Ef]},${K[wf]}`).join(" "),_t=ft.ctx.map(K=>`${K[Tf]},${K[Af]}`).join(" ");q.push(`  o   ${et}`),q.push(`  p   ${_t}`)}}if(a.length>0){q.push("最近事件：");for(const ft of a.slice(-12))q.push(`  ${ft.t.toFixed(2)} ${ft.k} ${ft.d}`.trimEnd())}const Q=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",dt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return q.push(`摇杆坐标源 ${Q}${dt}`),q.push(`UA ${e.ua}`),q.join(`
`)}return{sample(P,A,X,H=0){o.frames++,A.stickHeld&&(A.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=H,o.wallMs+=X,X>o.dtMax&&(o.dtMax=X),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=P.time;const q=P.time;if(c<0&&(c=q),w=q,b=P.tick,!r)return;const Q=P.character,dt=Math.hypot(A.stickX,A.stickY),ft=Math.hypot(Q.velocity.x,Q.velocity.z);u=P.combat.weapon;const vt=Rf(P,A),Y=Q.facing,_t=Math.hypot(A.intents.moveX,A.intents.moveZ)>.05?Math.atan2(A.intents.moveX,A.intents.moveZ):null;dt>.2&&(o.stickActiveMs+=X);const K=[Ge(q),P.tick,Math.round(X*10)/10,Ge(A.stickX),Ge(A.stickY),Ge(A.stickRawX),Ge(A.stickRawY),A.stickHeld?1:0,A.source.slice(0,8),Ge(A.intents.moveX),Ge(A.intents.moveZ),Ge(Q.position.x),Ge(Q.position.z),Ge(Q.velocity.x),Ge(Q.velocity.z),hn(Y),hn(Q.bodyYaw),vt,Ge(Q.stride),_t===null?"":hn(_t),A.stickId===null?"":A.stickId,Math.round(A.stickOriginX),Math.round(A.stickOriginY),Math.round(A.stickPxX),Math.round(A.stickPxY),A.stickBad,Math.round(A.stickVpTop),Math.round(A.stickOriginSX),Math.round(A.stickOriginSY),Math.round(A.stickScreenX),Math.round(A.stickScreenY),A.stickScreenOk?1:0,Math.round(A.stickScale*100)/100];y(K);const pt=q*1e3<M;if(X>t.spikeMs&&!pt&&q-c>.6&&(o.spikes++,D("frameSpike",q,P.tick,X,`dt ${X.toFixed(0)}ms fl=${Ri(vt)}`,K)),d!==null&&!pt){const yt=Math.abs(hn(ra(Y-d))),Tt=Math.abs(hn(ra(Q.moveYaw-f))),C=(h|vt)&(ys|Ss|bs|Es)|vt&xa,S=_t===null?null:Math.abs(hn(ra(Y-_t))),G=_t===null||d===null?null:Math.abs(hn(ra(d-_t))),ct=S!==null&&G!==null&&S<G-.5,lt=(h&xa)!==0&&(vt&xa)===0&&_t===null,ot=S!==null&&(S<=12||ct);yt>t.aimDropDeg&&lt?D("aimDrop",q,P.tick,0,`${yt.toFixed(0)}° @aim→none stick(${A.stickX.toFixed(2)},${A.stickY.toFixed(2)}) aim(${A.aimDX.toFixed(0)},${A.aimDY.toFixed(0)}) fl=${Ri(vt)}`,K):yt>t.dirJumpDeg&&C===0&&!lt&&(ot?(o.inTurns++,yt>o.inTurnMax&&(o.inTurnMax=yt)):D("dirJump",q,P.tick,0,`${yt.toFixed(0)}° res${S===null?" 无输入":`${S.toFixed(0)}°`} yaw ${hn(d)}→${hn(Y)} in ${_t===null?".":hn(_t)}° mvΔ${Tt.toFixed(0)}° aim(${A.aimDX.toFixed(0)},${A.aimDY.toFixed(0)}) fl=${Ri(h)}→${Ri(vt)}`,K))}const Pt=(vt&(ys|Ss|bs|Es))!==0,At=P.tick-v<30;dt>.35&&ft<t.freezeSpeed&&!Pt&&!At?(g<0&&(g=q),q-g>=t.freezeMs/1e3&&q>=_&&(D("moveFreeze",q,P.tick,(q-g)*1e3,`stick(${A.stickX.toFixed(2)},${A.stickY.toFixed(2)}) v${ft.toFixed(2)} ${A.source} fl=${Ri(vt)}`,K),_=q+1.5,g=-1)):g=-1,A.stickHeld?(dt>p&&(p=dt),p>.35&&dt<.06?(m<0&&(m=q),q-m>=t.stickLostMs/1e3&&(D("stickLost",q,P.tick,(q-m)*1e3,`raw(${A.stickRawX.toFixed(2)},${A.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Ri(vt)}`,K),m=-1,p=0)):m=-1):(p=0,m=-1);const zt=A.stickScale>.2&&A.stickScale<5?A.stickScale:1,St=A.stickScreenOk,bt=St?A.stickScreenX/zt:A.stickPxX,O=St?A.stickScreenY/zt:A.stickPxY,Zt=St?A.stickOriginSX/zt:A.stickOriginX,Dt=St?A.stickOriginSY/zt:A.stickOriginY,Ct=bt-Zt,wt=O-Dt;if(A.stickHeld&&A.stickId!==null){const yt=U;if(yt&&yt.held&&yt.id===A.stickId){const Tt=Math.hypot(yt.dx,yt.dy),C=Math.hypot(Ct,wt),S=Math.max(Tt,C),G=Math.hypot(bt-yt.cx,O-yt.cy),ct=Math.abs(hn(ra(Math.atan2(wt,Ct)-Math.atan2(yt.dy,yt.dx)))),lt=S*ct*Math.PI/180,ot=Math.hypot(Zt-yt.ox,Dt-yt.oy);if(S>18&&ct>35&&G<Math.max(5,lt*.35)&&D("stickJump",q,P.tick,0,`Δ${ct.toFixed(0)}° 手指只动${G.toFixed(0)}px(弧长应${lt.toFixed(0)}px) o(${Math.round(yt.ox)},${Math.round(yt.oy)})→(${Math.round(Zt)},${Math.round(Dt)}) 原点位移${ot.toFixed(0)}px p(${Math.round(bt)},${Math.round(O)}) raw(${Math.round(Ct)},${Math.round(wt)}) id${A.stickId} ${St?"src=屏幕":"src=client"}`,K),St&&yt.screenOk){const It=Math.hypot(A.stickPxX-yt.x,A.stickPxY-yt.y),tt=Math.hypot((A.stickScreenX-yt.sx)/zt,(A.stickScreenY-yt.sy)/zt);R+=It-tt,Math.abs(R)>20&&(D("stickDrift",q,P.tick,0,`client 相对屏幕漂移 ${R>0?"+":""}${R.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(A.stickPxX)},${Math.round(A.stickPxY)}) screen(${Math.round(A.stickScreenX)},${Math.round(A.stickScreenY)})`,K),R=0)}}U={id:A.stickId,ox:Zt,oy:Dt,cx:bt,cy:O,x:A.stickPxX,y:A.stickPxY,sx:A.stickScreenX,sy:A.stickScreenY,dx:Ct,dy:wt,held:!0,screenOk:St}}else U=null,R=0;if(A.stickBad>T){const yt=A.stickBad-T;D("stickBad",q,P.tick,0,`拦截 ${yt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${A.stickBad}）o(${Math.round(A.stickOriginX)},${Math.round(A.stickOriginY)}) p(${Math.round(A.stickPxX)},${Math.round(A.stickPxY)}) id${A.stickId??"-"}`,K)}T=A.stickBad,d=Y,f=Q.moveYaw,h=vt},event(P,A){const X=Cf(P);N(P),r&&(P.type==="dash-ready"||P.type==="combo-reset"||P.type==="stepUp"||B(P.type,X,A,P.tick))},gesture(P){const A=`${P.button}.${P.kind}`;o.gestures[A]=(o.gestures[A]??0)+1,r&&(P.kind==="longPress"||P.kind==="doubleTap"||P.kind==="drag"||P.kind==="cancel")&&B(`g:${P.kind}`,`${P.button} ${P.heldMs.toFixed(0)}ms d${P.distance.toFixed(0)}px ${P.angleDeg.toFixed(0)}°`,w,b)},suspend(P){M=w*1e3+P,g=-1,m=-1},setEnabled(P){r=P,P||(d=null,U=null,g=-1,m=-1)},clear(){i.length=0,a.length=0,s.length=0,x={},l=-1e9,d=null,h=0,g=-1,m=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,R=0,U=null,T=0;for(const P of Object.keys(o.gestures))delete o.gestures[P]},status(){const P=o.simS,A=s.some(X=>P-X.t<8&&(X.kind==="dirJump"||X.kind==="aimDrop"||X.kind==="moveFreeze"||X.kind==="stickLost"||X.kind==="stickJump"||X.kind==="stickBad"||X.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:A,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:yf,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:V}}const Df={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:7,headTurnRate:30,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Lf={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},If={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},kf={core:Df,scene:Lf,view:If};function jr(n){return JSON.parse(JSON.stringify(n))}const Kr=kf,Uf=jr(Kr.core),Ff=jr(Kr.scene),un=jr(Kr.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class wn{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),wn.nextNameID=wn.nextNameID||0,this.$name.id=`lil-gui-name-${++wn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Nf extends wn{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Qo(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const zf={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Qo,toHexString:Qo},Sa={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},Of={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Sa.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Sa.toHexString(a)}},Bf={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Sa.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Sa.toHexString(a)}},Hf=[zf,Sa,Of,Bf];function Gf(n){return Hf.find(t=>t.match(n))}class Vf extends wn{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Gf(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=Qo(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class to extends wn{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Xf extends wn{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let v=parseFloat(this.$input.value);isNaN(v)||(this._stepExplicit&&(v=this._snap(v)),this.setValue(this._clamp(v)))},i=v=>{const M=parseFloat(this.$input.value);isNaN(M)||(this._snapClampSetValue(M+v),this.$input.value=this.getValue())},a=v=>{v.key==="Enter"&&this.$input.blur(),v.code==="ArrowUp"&&(v.preventDefault(),i(this._step*this._arrowKeyMultiplier(v))),v.code==="ArrowDown"&&(v.preventDefault(),i(this._step*this._arrowKeyMultiplier(v)*-1))},s=v=>{this._inputFocused&&(v.preventDefault(),i(this._step*this._normalizeMouseWheel(v)))};let o=!1,r,c,l,d,f;const h=5,u=v=>{r=v.clientX,c=l=v.clientY,o=!0,d=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=v=>{if(o){const M=v.clientX-r,x=v.clientY-c;Math.abs(x)>h?(v.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(M)>h&&_()}if(!o){const M=v.clientY-l;f-=M*this._step*this._arrowKeyMultiplier(v),d+f>this._max?f=this._max-d:d+f<this._min&&(f=this._min-d),this._snapClampSetValue(d+f)}l=v.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,v,M,x,U)=>(p-v)/(M-v)*(U-x)+x,e=p=>{const v=this.$slider.getBoundingClientRect();let M=t(p,v.left,v.right,this._min,this._max);this._snapClampSetValue(M)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",h))},f=p=>{if(o){const v=p.touches[0].clientX-r,M=p.touches[0].clientY-c;Math.abs(v)>Math.abs(M)?l(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h))}else p.preventDefault(),e(p.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h)},u=this._callOnFinishChange.bind(this),g=400;let _;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const M=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+M),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(u,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Wf extends wn{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class $f extends wn{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Yf=`.lil-gui {
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
	value:`,o)}addColor(t,e,i=1){return new Vf(this,t,e,i)}addFolder(t){const e=new ws({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof to||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof to)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function qf(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new ws({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new ws({title:"实验台 · 调试面板"}),o=n.config,r=[],c=[],l=C=>{const S=s.addFolder(C);return c.push(S),S},d=(C,S)=>{const G=C.addFolder(S);return r.push(G),G},f=l("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid);const h=d(f,"模块开关");h.add(n.modules,"movement").name("movement"),h.add(n.modules,"combat").name("combat"),h.add(n.modules,"links").name("links"),h.add(n.modules,"orientation").name("orientation"),h.add(n.modules,"turnInPlace").name("turnInPlace"),h.add(n.modules,"targeting").name("targeting"),h.add(n.modules,"hits").name("hits"),h.add(n.modules,"separation").name("separation"),h.add(n.modules,"dash").name("dash"),h.add(n.modules,"camera").name("camera"),h.add(n.modules,"dummies").name("dummies"),h.add(n.modules,"abilities").name("abilities");const u=l("移动 / 输入"),g=d(u,"基础移动参数");g.add(o,"moveSpeed",1,10,.1).name("移动速度"),g.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(o,"acceleration",1,40,.5).name("加速度"),g.add(o,"friction",1,40,.5).name("摩擦"),g.add(o,"gravity",5,60,.5).name("重力"),g.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(o,"characterRadius",.1,.8,.01).name("角色半径"),g.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(o,"strideLength",.3,3,.05).name("基础步幅"),g.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=d(u,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=o.dash,p=d(u,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const v=o.separation,M=d(u,"角色间分离 / 挤压阻力");M.add(v,"iterations",1,8,1).name("迭代次数"),M.add(v,"slop",0,.05,.002).name("额外分离量 (m)"),M.add(v.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),M.add(v.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),M.add(v.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const x=o.dummies,U=d(u,"假人 AI");U.add(x,"moveSpeed",.5,8,.1).name("移动速度"),U.add(x,"wanderRadius",.5,8,.1).name("游走半径"),U.add(x,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),U.add(x,"followStopDistance",.3,5,.1).name("跟随停距"),U.add(x,"keepDistance",1,10,.1).name("保持距离"),U.add(x,"keepDeadZone",.1,2,.05).name("保持死区"),U.add(x,"attackRange",.5,5,.1).name("攻击距离"),U.add(x,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const R=l("步态 / 停步"),T=d(R,"程序化步态");T.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),T.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),T.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),T.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),T.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),T.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),T.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),T.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),T.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),T.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),T.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),T.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),T.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),T.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)");const w=d(R,"停步收相 / 胸朝向");w.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),w.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),w.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),w.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),w.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const b=d(R,"停步惯性");b.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),b.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),b.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),b.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),b.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),b.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),b.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),d(R,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const D=d(R,"足部 IK"),B=t.ik;D.add(B,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),D.add(B,"weight",0,1,.01).name("钉地权重"),D.add(B,"attackScale",0,1,.01).name("攻击时权重倍率"),D.add(B,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const N=d(R,"惯性倾斜 / 盆骨"),V=t.lean;N.add(V,"accelGain",0,.1,.002).name("前后加速度增益"),N.add(V,"turnGain",0,.2,.005).name("绕圈侧倾增益"),N.add(V,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),N.add(V,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),N.add(V,"smoothing",1,30,1).name("倾斜平滑速率"),N.add(V,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),N.add(V,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),N.add(V,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),N.add(V,"crouchSmoothing",1,30,1).name("下沉平滑速率");const P=o.orientation,A=d(R,"朝向 / 下盘带转");A.add(P,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),A.add(P,"headTurnRate",.5,40,.5).name("头部转向速率"),A.add(P,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),A.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),A.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),A.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const X=d(R,"原地转身 / 停步偏差 (v9s)"),H=o.turnInPlace;X.add(H,"enabled").name("启用原地转身 (关=纯插值)"),X.add(H,"triggerDeg",20,180,5).name("触发夹角 (°)"),X.add(H,"settleDeg",0,60,1).name("转身保留余角 (°)"),X.add(H,"durationSec",.1,1.5,.02).name("转身时长 (s)"),X.add(H,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),X.add(H,"inputDeadZone",0,.5,.01).name("起步输入死区"),X.add(H,"armSec",0,.5,.01).name("触发防抖 (s)"),X.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),X.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),X.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),X.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),X.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),X.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const q=l("战斗 / 受击"),Q=o.combat,dt=d(q,"连击 / 武器"),ft=dt.add(n.combat,"weapon",yi).name("当前武器");dt.add(Q,"comboWindow",.1,2,.05).name("连击窗口 (s)"),dt.add(Q,"settle",0,.8,.01).name("段间停顿 (s)"),dt.add(Q,"attackMoveScale",0,1,.01).name("攻击时移动比例"),dt.add(Q,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),dt.add(Q,"cancelWindow",0,1,.01).name("取消窗口 (s)"),dt.add(Q,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),dt.add(Q,"autoCombo").name("按住自动连击"),dt.add(Q.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),dt.add(Q.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),dt.add(Q.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),dt.add(Q.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),dt.add(Q.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),dt.add(Q.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const vt=o.abilities;dt.add(vt.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),dt.add(vt.arcane,"speed",3,24,.5).name("飞弹速度"),dt.add(vt.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),dt.add(vt.ring,"radius",.5,5,.1).name("电环半径"),dt.add(vt.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),dt.add(vt.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const Y=d(q,"攻击动作 / 跨步 / 落地");Y.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),Y.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),Y.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const et=t.animation.stride;Y.add(et,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),Y.add(et,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),Y.add(et,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),Y.add(et,"cycles",1,3,1).name("每段跨步周期数"),Y.add(et,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),Y.add(et,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),Y.add(et,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),Y.add(et,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),Y.add(et,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),Y.add(et,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),Y.add(et,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),Y.add(et,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),Y.add(et,"heavyScale",0,1,.01).name("大剑重击收敛系数"),Y.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),Y.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),Y.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),Y.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),Y.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),Y.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),Y.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),Y.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),Y.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),Y.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),Y.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),Y.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const _t=d(q,"武器握持");_t.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),_t.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),_t.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),_t.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const K=o.hits,pt=d(q,"命中 / 受击 / 击退");pt.add(K,"arcDeg",10,120,5).name("命中扇区半角 (°)"),pt.add(K,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),pt.add(K,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),pt.add(K,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),pt.add(K.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),pt.add(K.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),pt.add(K,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),pt.add(K,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Pt=o.targeting,At=d(q,"目标辅助");At.add(Pt,"targetAssist").name("启用目标辅助"),At.add(Pt,"range",1,14,.5).name("锁定范围 (m)"),At.add(Pt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),At.add(Pt,"frontBias",0,4,.1).name("朝向加权"),At.add(Pt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),At.add(Pt,"maxLungeScale",1,3,.1).name("前冲最大放大");const zt=d(q,"受击分层"),St=t.hurt;zt.add(St,"enabled").name("启用分层受击 (关=旧版对照)"),zt.add(St,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),zt.add(St,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),zt.add(St,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),zt.add(St,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),zt.add(St,"upperShiftScale",0,1,.01).name("上身位移缩放"),zt.add(St,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),zt.add(St.hitHeight,"light",0,1,.01).name("轻击命中部位"),zt.add(St.hitHeight,"heavy",0,1,.01).name("重击命中部位"),zt.add(St.hitHeight,"knock",0,1,.01).name("击退命中部位"),zt.add(St,"leanLight",0,1.5,.01).name("轻击力度"),zt.add(St,"leanHeavy",0,1.5,.01).name("重击力度"),zt.add(St,"leanKnock",0,1.5,.01).name("击退力度"),zt.add(St,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:St.abdomen},{name:"打肩 (shoulder)",p:St.shoulder}].map(({name:C,p:S})=>{const G=d(zt,C);return G.add(S,"upperPitch",0,2,.01).name("上身前后倾斜"),G.add(S,"upperRoll",0,2,.01).name("上身侧倾"),G.add(S,"upperYaw",0,1.5,.01).name("肩部扭转"),G.add(S,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),G.add(S,"shift",0,.8,.01).name("身体反应位移"),G.add(S,"drop",0,.4,.01).name("整体下沉"),G.add(S,"back",0,.4,.01).name("屁股向后"),G.add(S,"knee",0,1.6,.01).name("屈膝"),G.add(S,"hip",0,1,.01).name("髋前倾"),G.add(S,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),G});const bt=d(q,"派生招"),O=o.links;bt.add(O,"enabled").name("总开关 (false=旧连击)"),bt.add(O.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),bt.add(O.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),bt.add(O.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),bt.add(O,"sharedCooldown",0,3,.05).name("共享 CD (s)"),bt.add(O,"triggerWhileSprinting").name("长跑中可直接触发"),bt.add(O.search,"range",1,14,.1).name("索敌距离 (m)"),bt.add(O.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),bt.add(O.search,"stopDistance",0,3,.05).name("停住距离 (m)");const Zt=O.moves["sword-shield"];Zt&&(bt.add(Zt,"enabled").name("剑盾盾击"),bt.add(Zt,"distance",0,8,.1).name("冲锋极限 (m)"),bt.add(Zt,"windup",0,.5,.01).name("前摇 (s)"),bt.add(Zt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),bt.add(Zt,"recovery",0,.8,.01).name("收势 (s)"),bt.add(Zt.hit,"radius",0,4,.05).name("命中半径 (m)"),bt.add(Zt.hit,"width",0,2,.05).name("扫掠半径 (m)"),bt.add(Zt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),bt.add(Zt.hit,"duration",0,1.5,.01).name("僵直 (s)")),bt.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const Dt=l("相机"),Ct=d(Dt,"基础");Ct.add(t.camera,"pitchDeg",20,80,1).name("俯角"),Ct.add(t.camera,"yawDeg",-180,180,1).name("方位角"),Ct.add(t.camera,"distance",6,35,.5).name("距离"),Ct.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),Ct.add(t.camera,"fov",25,90,1).name("FOV");const wt=o.camera,yt=d(Dt,"智能构图");yt.add(wt,"radius",2,18,.5).name("威胁评估半径 (m)"),yt.add(wt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),yt.add(wt,"saturation",.5,8,.1).name("威胁归一化饱和"),yt.add(wt,"pushIn",0,.5,.01).name("无威胁推进比例"),yt.add(wt,"maxPullback",0,1,.02).name("最大拉远比例"),yt.add(wt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),yt.add(wt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),yt.add(wt,"framingBias",0,1,.05).name("威胁质心平移系数"),yt.add(wt,"attackBoost",0,2,.05).name("挥砍中额外加权"),yt.add(wt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),yt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Tt=d(Dt,"缩放");return Tt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),Tt.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),Tt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),Tt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),Tt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),Tt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),Tt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),Tt.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(C=>C.close()),c.forEach(C=>C.close()),s.close(),{gui:s,refreshWeapon:()=>ft.updateDisplay()}}const eo=Math.PI*2,Sn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},jf=45,Kf=50;function Jf(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function ca(n,t,e){const i=Jf(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function Qf(n,t){return Math.atan2(n,-t)*180/Math.PI}function Xc(n,t){return Math.abs(((n-t)%360+540)%360-180)}function La(n){return(n%360+360)%360}const tp={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function ep(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),c=a.velocity,l=Math.hypot(c.x,c.z),d=o>.001?ca(s.moveX,s.moveZ,e):null,f=l>.15?ca(c.x,c.z,e):null,h=ca(Math.sin(a.facing),Math.cos(a.facing),e),u=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?ca(s.aimX,s.aimZ,e):null,g=n.targeting,_=g.hasTarget?ca(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=d!==null&&f!==null?Xc(d,f):null,p=d!==null?Xc(d,h):null,v=m!==null&&m>jf&&o>=.35&&l>=.4;return{inDeg:d,inLen:Math.min(1,o),rawDeg:r>.02?Qf(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:l,faceDeg:h,lockDeg:_,lockId:g.targetId,lockDist:g.targetDist,aimDeg:u,gapMove:m,gapFace:p,warnMove:v}}function Wc(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>Kf&&(n.inLen>=.35||n.speed>=.4)}const $c="harness.dirDebug";function np(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem($c)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),s&&(s.textContent=c?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(c)))}l();function d(M){if(c=M,!t)try{window.localStorage.setItem($c,M?"1":"0")}catch{}l()}s==null||s.addEventListener("pointerdown",M=>{M.preventDefault(),M.stopPropagation(),d(!c)}),t||window.addEventListener("keydown",M=>{M.key.toLowerCase()==="v"&&!M.metaKey&&!M.ctrlKey&&d(!c)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;a.width=Math.round(h*f),a.height=Math.round(h*f);let u=tp,g=0,_="",m=8;function p(M){if(!r)return;const x=h,U=h,R=x/2,T=U/2,w=Math.min(x,U)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,x,U),r.beginPath(),r.arc(R,T,w,0,eo),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=M.warnMove?"rgba(251, 191, 36, 0.85)":Sn.ring,r.stroke(),r.strokeStyle=Sn.grid,r.beginPath(),r.moveTo(R-w,T),r.lineTo(R+w,T),r.moveTo(R,T-w),r.lineTo(R,T+w),r.stroke();for(let B=0;B<8;B++){const N=B*Math.PI/4,V=R+Math.sin(N)*(w-3),P=T-Math.cos(N)*(w-3),A=R+Math.sin(N)*w,X=T-Math.cos(N)*w;r.beginPath(),r.moveTo(V,P),r.lineTo(A,X),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=Sn.dead,r.beginPath(),r.arc(R,T,w*b,0,eo),r.stroke(),r.restore());const y=(B,N,V,P,A=!1,X=1)=>{const H=B*Math.PI/180,q=Math.sin(H),Q=-Math.cos(H),dt=w*Math.max(.14,Math.min(1,N)),ft=R+q*w*.14,vt=T+Q*w*.14,Y=R+q*dt,et=T+Q*dt;if(r.save(),r.globalAlpha=X,r.strokeStyle=V,r.fillStyle=V,r.lineWidth=P,r.lineCap="round",A&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(ft,vt),r.lineTo(Y,et),r.stroke(),!A&&dt>w*.3){const _t=-Q,K=q,pt=5.2;r.beginPath(),r.moveTo(Y+q*1.5,et+Q*1.5),r.lineTo(Y-q*pt+_t*pt*.72,et-Q*pt+K*pt*.72),r.lineTo(Y-q*pt-_t*pt*.72,et-Q*pt-K*pt*.72),r.closePath(),r.fill()}r.restore()},D=(B,N)=>{const V=B*Math.PI/180,P=Math.sin(V),A=-Math.cos(V),X=-A,H=P,q=w+1.5,Q=q+6.5;r.save(),r.fillStyle=N,r.strokeStyle=N,r.lineWidth=1,r.beginPath(),r.moveTo(R+P*Q,T+A*Q),r.lineTo(R+P*q+X*4,T+A*q+H*4),r.lineTo(R+P*q-X*4,T+A*q-H*4),r.closePath(),r.fill(),r.restore()};M.lockDeg!==null&&y(M.lockDeg,1,Sn.lock,1,!0,.7),M.rawDeg!==null&&M.stickHeld&&y(M.rawDeg,M.rawLen,Sn.raw,1,!0,.9),M.aimDeg!==null&&y(M.aimDeg,1,Sn.aim,1.6,!0,.95),y(M.faceDeg,1,Sn.face,1.1,!0,.55),M.moveDeg!==null&&y(M.moveDeg,M.speed/Math.max(1,m),Sn.move,5.5,!1,.8),M.inDeg!==null&&y(M.inDeg,M.inLen,Sn.input,2.2),D(M.faceDeg,Sn.face),r.beginPath(),r.arc(R,T,2.2,0,eo),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function v(M,x){const U=w=>w===null?"-":String(Math.round(La(w)));o.in.textContent=`入 ${U(M.inDeg)}`,o.mv.textContent=`移 ${U(M.moveDeg)}`,o.fc.textContent=`面 ${U(M.faceDeg)}`;const R=w=>w===null?"-":`${Math.round(w)}°`,T=[`Δ入→移 ${R(M.gapMove)}`,`Δ入→面 ${R(M.gapFace)}`];M.speed>.05&&T.push(`v${M.speed.toFixed(1)}`),M.lockDeg!==null&&T.push(`锁#${M.lockId} ${M.lockDist.toFixed(1)}m`),M.aimDeg!==null&&T.push("拖拽瞄准"),o.gap.textContent=T.join("  "),e.classList.toggle("is-warn",M.warnMove||Wc(M,x))}return{update(M,x,U){if(!c)return;m=Math.max(1,M.config.moveSpeed*Math.max(1,M.config.sprintMultiplier));const R=ep(M,x,U,m);u=R;const T=M.combat.phase!=="idle";p(R);const w=performance.now(),b=`${R.inDeg}|${R.moveDeg}|${R.faceDeg}|${R.lockId}|${R.aimDeg}|${R.warnMove}|${R.speed.toFixed(1)}`;(w-g>90||b!==_)&&(g=w,_=b,v(R,T),e.dataset.in=R.inDeg===null?"":La(R.inDeg).toFixed(1),e.dataset.mv=R.moveDeg===null?"":La(R.moveDeg).toFixed(1),e.dataset.fc=La(R.faceDeg).toFixed(1),e.dataset.warn=R.warnMove||Wc(R,T)?"1":"0")},setEnabled:d,toggle(){return d(!c),c},enabled:()=>c,last:()=>u}}const ip=6,ap=480,Yc=240,Zc=92,sp=18;function op(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1}}function rp(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function cp(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function lp(n={}){const t=Math.max(1,n.windowS??ip),e=Math.max(60,n.capacity??ap),i=Math.max(1,n.speedCap??sp),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),c=s.querySelector("#motiondbg-graph"),l=s.querySelector("#motiondbg-read"),d=s.querySelector("#motiondbg-window"),f=s.querySelector("#motiondbg-dir");d.textContent=`${t.toFixed(1)}s`;const h=c.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(Yc*u),c.height=Math.round(Zc*u);const g=np({deadZone:n.deadZone,container:f,embedded:!0});let _=!1;function m(w){_=w,s.classList.toggle("is-off",!w),!a&&r&&(r.textContent=w?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(w)),r.setAttribute("aria-label",w?"收起手感调试面板":"展开手感调试面板"))}m(!1),a||(r==null||r.addEventListener("pointerdown",w=>{w.preventDefault(),w.stopPropagation(),m(!_)}),window.addEventListener("keydown",w=>{w.key.toLowerCase()==="v"&&!w.metaKey&&!w.ctrlKey&&m(!_)}));const p=[];let v=0,M=null,x=-1,U={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function R(w){const b=w-t;let y=0;for(;y<p.length&&p[y].t<b;)y++;return p.slice(y)}function T(w,b){if(!h)return;const y=Yc,D=Zc;h.setTransform(u,0,0,u,0,0),h.clearRect(0,0,y,D),h.fillStyle="rgba(8, 12, 17, 0.55)",h.fillRect(0,0,y,D);const B=4,N=4,V=y-B-N,P=9,A=46,X=62,H=22,q=b-t,Q=K=>B+Math.max(0,Math.min(1,(K-q)/t))*V;for(let K=0;K<w.length;K++){if(!w[K].busy)continue;const pt=Q(w[K].t),Pt=K+1<w.length?Q(w[K+1].t):pt+2;h.fillStyle="rgba(251, 146, 60, 0.13)",h.fillRect(pt,P,Math.max(2,Pt-pt),A)}h.strokeStyle="rgba(150, 190, 220, 0.14)",h.lineWidth=1,h.beginPath();for(const K of[P,P+A/2,P+A])h.moveTo(B,K),h.lineTo(y-N,K);h.moveTo(B,X+H/2),h.lineTo(y-N,X+H/2),h.stroke();const ft=Math.max(1,...w.map(K=>K.speed),...w.map(K=>K.drive))*1.15,vt=K=>P+A-K/ft*A;if(w.length>1){h.beginPath(),h.moveTo(Q(w[0].t),vt(w[0].speed));for(let K=1;K<w.length;K++)h.lineTo(Q(w[K].t),vt(w[K].speed));h.strokeStyle="#38bdf8",h.lineWidth=1.8,h.lineJoin="round",h.stroke(),h.lineTo(Q(w[w.length-1].t),P+A),h.lineTo(Q(w[0].t),P+A),h.closePath(),h.fillStyle="rgba(56, 189, 248, 0.14)",h.fill(),h.beginPath(),h.moveTo(Q(w[0].t),vt(w[0].drive));for(let K=1;K<w.length;K++)h.lineTo(Q(w[K].t),vt(w[K].drive));h.setLineDash([3,3]),h.strokeStyle="rgba(190, 205, 220, 0.6)",h.lineWidth=1.2,h.stroke(),h.setLineDash([])}let Y=.02;for(const K of w)Y=Math.max(Y,Math.abs(K.dv));Y*=1.1;const et=X+H/2,_t=H/2;for(const K of w){const pt=Math.min(_t,Math.abs(K.dv)/Y*_t);h.fillStyle=K.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",h.fillRect(Q(K.t)-.7,K.dv>=0?et-pt:et,1.4,Math.max(.5,pt))}h.font="9px ui-monospace, monospace",h.fillStyle="rgba(190, 214, 234, 0.55)",h.textAlign="left",h.fillText(ft.toFixed(1),B+2,P+8),h.fillText("v",B+2,P+A-2),h.fillText("Δv",B+2,X+9),h.textAlign="right",h.fillText("0",y-N-2,P+A-2),h.textAlign="left"}return{dirDebug:g,update(w,b,y){const D=performance.now()/1e3,B=x<0?1/60:Math.max(1e-4,Math.min(.25,D-x));x=D;const N=w.character,V={x:N.position.x,z:N.position.z},P=Math.hypot(N.velocity.x,N.velocity.z),{speed:A,raw:X}=M?rp(M,V,B,i):{speed:0,raw:0},H=op(v,A,B,D);H.drive=P,H.raw=X,H.busy=cp(w),M=V,v=A,p.push(H),p.length>e&&p.shift();const q=R(D);let Q=0;for(const dt of q)Q=Math.max(Q,dt.speed);if(U={speed:A,drive:P,raw:X,dv:H.dv,accel:H.accel,peak:Q,samples:q.length,windowS:t,busy:H.busy},g.update(w,b,y),_){T(q,D);const dt=H.dv>=0?"+":"";l.textContent=`v ${A.toFixed(2)} · 驱 ${P.toFixed(2)} · 峰 ${Q.toFixed(2)} · Δv ${dt}${H.dv.toFixed(3)} · ${q.length} 帧`}},setEnabled:m,toggle(){return m(!_),_},enabled:()=>_,last:()=>({...U}),samples:()=>R(performance.now()/1e3).map(w=>({...w}))}}const dp=["剑盾","双剑","大剑","法杖","弓"],hp={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function up(n){return{update(t,e,i,a,s,o,r=!1){const c=t.character,l=c.position,d=c.velocity,f=t.combat,h=t.events.length>0?t.events[t.events.length-1]:null,u=St=>St.toFixed(2),g=St=>(St*180/Math.PI).toFixed(0),_=dp[yi.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),p="|".repeat(m)+".".repeat(10-m),v=t.dash,M=v.phase==="active"&&v.duration>0?(1-v.timer/v.duration)*100:0,x=v.phase==="active"?`${v.kind}@${M.toFixed(0)}%`:`${v.kind} cd${u(v.cooldown)}`,U=a.intents.aimActive?`(${u(a.intents.aimX)},${u(a.intents.aimZ)})`:"-",R=d.x*Math.sin(c.bodyYaw)+d.z*Math.cos(c.bodyYaw),T=d.x*Math.cos(c.bodyYaw)-d.z*Math.sin(c.bodyYaw),w=Math.abs(R)+Math.abs(T)+1e-6,b=Math.round(Math.abs(T)/w*100),y=`strafe ${b}%${R<-.05?" back":""}`,D=t.camera,B=`threat ${(D.threat*100).toFixed(0)}%  dist×${u(D.distanceScale)}  off (${u(D.offsetX)},${u(D.offsetZ)})  pitch +${u(D.pitchDelta)}°  n=${D.threatCount}`,N=o?u(o.attackBlend):"-",V=o==null?void 0:o.attackWeights,P=V?`gw ${u(V.gaitScale)}  lw ${u(V.attackLegWeight)}  spd ${u(V.driveSpeed)}`:"-",A=V?`${u(V.gaitScale)}/${u(V.attackLegWeight)}`:"-",X=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",H=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",q=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",Q=o==null?void 0:o.hurt,dt=Q?`hurt ${t.playerHurt.type}  部位h${u(Q.hitHeight)}  脉冲p${u(Q.pulse)}  上身${u(Q.upperShift)}  重心${u(Q.comShift)}  后坐${u(Q.pelvisBack)}  屈膝${u(Q.knee)}`:"-",ft=Q?`${u(Q.hitHeight)}/${u(Q.pulse)}/${u(Q.knee)}`:"-",vt=o==null?void 0:o.ik,Y=vt?`${vt.active?"on":"off"} w${u(vt.weight)} e${u(vt.maxError)}`:"-",et=t.playerLink,_t=`link ${et.kind||"-"}  ${et.phase}  prog ${u(et.progress)}  win ${u(et.linkWindow)}s  cd ${u(et.cooldown)}s  hits ${et.hitIds.length}  travel ${u(et.travelled)}/${u(et.travel)}m  id ${et.id}`,K=`${et.phase}/${et.kind||"-"}/w${u(et.linkWindow)}`,pt=a.lastGesture,Pt=pt?`${pt.button} ${pt.kind} ${pt.heldMs.toFixed(0)}ms d${pt.distance.toFixed(0)}px ${pt.angleDeg.toFixed(0)}° taps${pt.taps}`:"-",At=t.dummies.map(St=>`${St.id}:${hp[St.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${et.phase}${et.kind?`/${et.kind}`:""} w${u(et.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(l.x)},${u(l.y)},${u(l.z)})  vel (${u(d.x)},${u(d.y)},${u(d.z)})`,`face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  st${b}%  stick(${u(a.stickX)},${u(a.stickY)}) ${a.source}  str${u(c.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${x}  ab ${N}  gw/lw ${A}  land ${H}  ik ${Y}`,`aim ${U}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ft}`,`dummies ${At}  atkCount ${t.dummyAttackCount}  cam ${(D.threat*100).toFixed(0)}% ×${u(D.distanceScale)}  ${q}  lk ${K}`,`event ${h?`${h.type} ${u(h.value)}`:"-"}  scale ${u(s.timeScale)}${s.paused?" [P]":""}  g ${Pt}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(l.x)}, ${u(l.y)}, ${u(l.z)})`,`vel  (${u(d.x)}, ${u(d.y)}, ${u(d.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${g(c.facing)}deg   atkBlend ${N}   ${P}   land ${X}`,dt,`ik ${Y}  clamped ${vt?vt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  (head-body ${g(c.headYaw-c.bodyYaw)})  ${y}`,`move (${u(a.intents.moveX)}, ${u(a.intents.moveZ)})  stick (${u(a.stickX)}, ${u(a.stickY)})  ${a.source}  aim ${U}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${v.kind}  phase ${v.phase}  prog ${M.toFixed(0)}%  cd ${u(v.cooldown)}s  id ${v.id}  from (${u(v.fromX)},${u(v.fromZ)}) → to (${u(v.toX)},${u(v.toZ)})`,_t,`camera ${B}  ${q}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${At}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${h?`${h.type} ${u(h.value)}`:"-"}   scale ${u(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${Pt}`].join(`
`)}}}const Ia=["hud","motion","debug"],qc={hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}};function fp(n){var c;const t=Object.fromEntries(Ia.map(l=>[l,document.getElementById(`${l==="motion"?"motiondbg":l==="debug"?"debug":"hud"}-toggle`)])),e=Object.fromEntries(Ia.map(l=>[l,document.getElementById(l==="motion"?"motiondbg":l==="debug"?"debug-panel":"hud")]));let i={},a=null;function s(){var l,d,f;for(const h of Ia){const u=a===h,g=t[h],_=e[h];g&&(g.setAttribute("aria-expanded",String(u)),g.textContent=`${qc[h].short} ${u?"▾":"▸"}`,g.setAttribute("aria-label",`${u?"收起":"展开"}${qc[h].full}`)),_&&_.classList.toggle("is-open",u)}n.classList.toggle("is-compact",a!=="hud"),(l=i.motion)==null||l.setEnabled(a==="motion"),a==="debug"?(d=i.debug)==null||d.open():(f=i.debug)==null||f.close()}function o(l){a=a===l?null:l,s()}function r(){a!==null&&(a=null,s())}for(const l of Ia)(c=t[l])==null||c.addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),o(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(l){i=l,s()},toggle:o,closeAll:r,isOpen:l=>a===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Jr="170",pp=0,jc=1,mp=2,Ed=1,wd=2,Un=3,ti=0,We=1,Ie=2,Jn=0,Xi=1,Kc=2,Jc=3,Qc=4,gp=5,gi=100,_p=101,xp=102,vp=103,Mp=104,yp=200,Sp=201,bp=202,Ep=203,tr=204,er=205,wp=206,Tp=207,Ap=208,Rp=209,Cp=210,Pp=211,Dp=212,Lp=213,Ip=214,nr=0,ir=1,ar=2,Yi=3,sr=4,or=5,rr=6,cr=7,Qr=0,kp=1,Up=2,Qn=0,Fp=1,Np=2,zp=3,Op=4,Bp=5,Hp=6,Gp=7,Td=300,Zi=301,qi=302,lr=303,dr=304,Ls=306,hr=1e3,xi=1001,ur=1002,xn=1003,Vp=1004,ka=1005,En=1006,no=1007,vi=1008,Hn=1009,Ad=1010,Rd=1011,ba=1012,tc=1013,Si=1014,zn=1015,wa=1016,ec=1017,nc=1018,ji=1020,Cd=35902,Pd=1021,Dd=1022,_n=1023,Ld=1024,Id=1025,Wi=1026,Ki=1027,kd=1028,ic=1029,Ud=1030,ac=1031,sc=1033,cs=33776,ls=33777,ds=33778,hs=33779,fr=35840,pr=35841,mr=35842,gr=35843,_r=36196,xr=37492,vr=37496,Mr=37808,yr=37809,Sr=37810,br=37811,Er=37812,wr=37813,Tr=37814,Ar=37815,Rr=37816,Cr=37817,Pr=37818,Dr=37819,Lr=37820,Ir=37821,us=36492,kr=36494,Ur=36495,Fd=36283,Fr=36284,Nr=36285,zr=36286,Xp=3200,Wp=3201,Nd=0,$p=1,jn="",nn="srgb",Qi="srgb-linear",Is="linear",de="srgb",Ci=7680,tl=519,Yp=512,Zp=513,qp=514,zd=515,jp=516,Kp=517,Jp=518,Qp=519,el=35044,nl="300 es",On=2e3,Ts=2001;class ta{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fs=Math.PI/180,Or=180/Math.PI;function Ta(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ke[n&255]+ke[n>>8&255]+ke[n>>16&255]+ke[n>>24&255]+"-"+ke[t&255]+ke[t>>8&255]+"-"+ke[t>>16&15|64]+ke[t>>24&255]+"-"+ke[e&63|128]+ke[e>>8&255]+"-"+ke[e>>16&255]+ke[e>>24&255]+ke[i&255]+ke[i>>8&255]+ke[i>>16&255]+ke[i>>24&255]).toLowerCase()}function Xe(n,t,e){return Math.max(t,Math.min(e,n))}function tm(n,t){return(n%t+t)%t}function io(n,t,e){return(1-e)*n+e*t}function la(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ve(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class ae{constructor(t=0,e=0){ae.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Xe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qt{constructor(t,e,i,a,s,o,r,c,l){qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l)}set(t,e,i,a,s,o,r,c,l){const d=this.elements;return d[0]=t,d[1]=a,d[2]=r,d[3]=e,d[4]=s,d[5]=c,d[6]=i,d[7]=o,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],c=i[6],l=i[1],d=i[4],f=i[7],h=i[2],u=i[5],g=i[8],_=a[0],m=a[3],p=a[6],v=a[1],M=a[4],x=a[7],U=a[2],R=a[5],T=a[8];return s[0]=o*_+r*v+c*U,s[3]=o*m+r*M+c*R,s[6]=o*p+r*x+c*T,s[1]=l*_+d*v+f*U,s[4]=l*m+d*M+f*R,s[7]=l*p+d*x+f*T,s[2]=h*_+u*v+g*U,s[5]=h*m+u*M+g*R,s[8]=h*p+u*x+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8];return e*o*d-e*r*l-i*s*d+i*r*c+a*s*l-a*o*c}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],f=d*o-r*l,h=r*c-d*s,u=l*s-o*c,g=e*f+i*h+a*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(a*l-d*i)*_,t[2]=(r*i-a*o)*_,t[3]=h*_,t[4]=(d*e-a*c)*_,t[5]=(a*s-r*e)*_,t[6]=u*_,t[7]=(i*c-l*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*r)+o+t,-a*l,a*c,-a*(-l*o+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(ao.makeScale(t,e)),this}rotate(t){return this.premultiply(ao.makeRotation(-t)),this}translate(t,e){return this.premultiply(ao.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ao=new qt;function Od(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function As(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function em(){const n=As("canvas");return n.style.display="block",n}const il={};function ga(n){n in il||(il[n]=!0,console.warn(n))}function nm(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function im(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function am(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const oe={enabled:!0,workingColorSpace:Qi,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===de&&(n.r=Bn(n.r),n.g=Bn(n.g),n.b=Bn(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===de&&(n.r=$i(n.r),n.g=$i(n.g),n.b=$i(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===jn?Is:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Bn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function $i(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const al=[.64,.33,.3,.6,.15,.06],sl=[.2126,.7152,.0722],ol=[.3127,.329],rl=new qt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cl=new qt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);oe.define({[Qi]:{primaries:al,whitePoint:ol,transfer:Is,toXYZ:rl,fromXYZ:cl,luminanceCoefficients:sl,workingColorSpaceConfig:{unpackColorSpace:nn},outputColorSpaceConfig:{drawingBufferColorSpace:nn}},[nn]:{primaries:al,whitePoint:ol,transfer:de,toXYZ:rl,fromXYZ:cl,luminanceCoefficients:sl,outputColorSpaceConfig:{drawingBufferColorSpace:nn}}});let Pi;class sm{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Pi===void 0&&(Pi=As("canvas")),Pi.width=t.width,Pi.height=t.height;const i=Pi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Pi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=As("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=Bn(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Bn(e[i]/255)*255):e[i]=Bn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let om=0;class Bd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:om++}),this.uuid=Ta(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(so(a[o].image)):s.push(so(a[o]))}else s=so(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function so(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?sm.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let rm=0;class $e extends ta{constructor(t=$e.DEFAULT_IMAGE,e=$e.DEFAULT_MAPPING,i=xi,a=xi,s=En,o=vi,r=_n,c=Hn,l=$e.DEFAULT_ANISOTROPY,d=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rm++}),this.uuid=Ta(),this.name="",this.source=new Bd(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new ae(0,0),this.repeat=new ae(1,1),this.center=new ae(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Td)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case hr:t.x=t.x-Math.floor(t.x);break;case xi:t.x=t.x<0?0:1;break;case ur:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case hr:t.y=t.y-Math.floor(t.y);break;case xi:t.y=t.y<0?0:1;break;case ur:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}$e.DEFAULT_IMAGE=null;$e.DEFAULT_MAPPING=Td;$e.DEFAULT_ANISOTROPY=1;class Me{constructor(t=0,e=0,i=0,a=1){Me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const c=t.elements,l=c[0],d=c[4],f=c[8],h=c[1],u=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(d-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,x=(u+1)/2,U=(p+1)/2,R=(d+h)/4,T=(f+_)/4,w=(g+m)/4;return M>x&&M>U?M<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(M),a=R/i,s=T/i):x>U?x<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(x),i=R/a,s=w/a):U<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(U),i=T/s,a=w/s),this.set(i,a,s,e),this}let v=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(h-d)*(h-d));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(f-_)/v,this.z=(h-d)/v,this.w=Math.acos((l+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class cm extends ta{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Me(0,0,t,e),this.scissorTest=!1,this.viewport=new Me(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:En,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new $e(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Bd(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends cm{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Hd extends $e{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=xn,this.minFilter=xn,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class lm extends $e{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=xn,this.minFilter=xn,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Aa{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let c=i[a+0],l=i[a+1],d=i[a+2],f=i[a+3];const h=s[o+0],u=s[o+1],g=s[o+2],_=s[o+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=f;return}if(r===1){t[e+0]=h,t[e+1]=u,t[e+2]=g,t[e+3]=_;return}if(f!==_||c!==h||l!==u||d!==g){let m=1-r;const p=c*h+l*u+d*g+f*_,v=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const U=Math.sqrt(M),R=Math.atan2(U,p*v);m=Math.sin(m*R)/U,r=Math.sin(r*R)/U}const x=r*v;if(c=c*m+h*x,l=l*m+u*x,d=d*m+g*x,f=f*m+_*x,m===1-r){const U=1/Math.sqrt(c*c+l*l+d*d+f*f);c*=U,l*=U,d*=U,f*=U}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],c=i[a+1],l=i[a+2],d=i[a+3],f=s[o],h=s[o+1],u=s[o+2],g=s[o+3];return t[e]=r*g+d*f+c*u-l*h,t[e+1]=c*g+d*h+l*f-r*u,t[e+2]=l*g+d*u+r*h-c*f,t[e+3]=d*g-r*f-c*h-l*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,c=Math.sin,l=r(i/2),d=r(a/2),f=r(s/2),h=c(i/2),u=c(a/2),g=c(s/2);switch(o){case"XYZ":this._x=h*d*f+l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f-h*u*g;break;case"YXZ":this._x=h*d*f+l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f+h*u*g;break;case"ZXY":this._x=h*d*f-l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f-h*u*g;break;case"ZYX":this._x=h*d*f-l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f+h*u*g;break;case"YZX":this._x=h*d*f+l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f-h*u*g;break;case"XZY":this._x=h*d*f-l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f+h*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],c=e[9],l=e[2],d=e[6],f=e[10],h=i+r+f;if(h>0){const u=.5/Math.sqrt(h+1);this._w=.25/u,this._x=(d-c)*u,this._y=(s-l)*u,this._z=(o-a)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(d-c)/u,this._x=.25*u,this._y=(a+o)/u,this._z=(s+l)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(s-l)/u,this._x=(a+o)/u,this._y=.25*u,this._z=(c+d)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-a)/u,this._x=(s+l)/u,this._y=(c+d)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xe(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,c=e._y,l=e._z,d=e._w;return this._x=i*d+o*r+a*l-s*c,this._y=a*d+o*c+s*r-i*l,this._z=s*d+o*l+i*c-a*r,this._w=o*d-i*r-a*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const c=1-r*r;if(c<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*a+e*this._y,this._z=u*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,r),f=Math.sin((1-e)*d)/l,h=Math.sin(e*d)/l;return this._w=o*f+this._w*h,this._x=i*f+this._x*h,this._y=a*f+this._y*h,this._z=s*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class j{constructor(t=0,e=0,i=0){j.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ll.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ll.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,c=t.w,l=2*(o*a-r*i),d=2*(r*e-s*a),f=2*(s*i-o*e);return this.x=e+c*l+o*f-r*d,this.y=i+c*d+r*l-s*f,this.z=a+c*f+s*d-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,c=e.z;return this.x=a*c-s*r,this.y=s*o-i*c,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return oo.copy(this).projectOnVector(t),this.sub(oo)}reflect(t){return this.sub(oo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Xe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const oo=new j,ll=new Aa;class Ra{constructor(t=new j(1/0,1/0,1/0),e=new j(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(fn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(fn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=fn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,fn):fn.fromBufferAttribute(s,o),fn.applyMatrix4(t.matrixWorld),this.expandByPoint(fn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ua.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ua.copy(i.boundingBox)),Ua.applyMatrix4(t.matrixWorld),this.union(Ua)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,fn),fn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(da),Fa.subVectors(this.max,da),Di.subVectors(t.a,da),Li.subVectors(t.b,da),Ii.subVectors(t.c,da),Xn.subVectors(Li,Di),Wn.subVectors(Ii,Li),oi.subVectors(Di,Ii);let e=[0,-Xn.z,Xn.y,0,-Wn.z,Wn.y,0,-oi.z,oi.y,Xn.z,0,-Xn.x,Wn.z,0,-Wn.x,oi.z,0,-oi.x,-Xn.y,Xn.x,0,-Wn.y,Wn.x,0,-oi.y,oi.x,0];return!ro(e,Di,Li,Ii,Fa)||(e=[1,0,0,0,1,0,0,0,1],!ro(e,Di,Li,Ii,Fa))?!1:(Na.crossVectors(Xn,Wn),e=[Na.x,Na.y,Na.z],ro(e,Di,Li,Ii,Fa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,fn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(fn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Pn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Pn=[new j,new j,new j,new j,new j,new j,new j,new j],fn=new j,Ua=new Ra,Di=new j,Li=new j,Ii=new j,Xn=new j,Wn=new j,oi=new j,da=new j,Fa=new j,Na=new j,ri=new j;function ro(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){ri.fromArray(n,s);const r=a.x*Math.abs(ri.x)+a.y*Math.abs(ri.y)+a.z*Math.abs(ri.z),c=t.dot(ri),l=e.dot(ri),d=i.dot(ri);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>r)return!1}return!0}const dm=new Ra,ha=new j,co=new j;class ks{constructor(t=new j,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):dm.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ha.subVectors(t,this.center);const e=ha.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(ha,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(co.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ha.copy(t.center).add(co)),this.expandByPoint(ha.copy(t.center).sub(co))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Dn=new j,lo=new j,za=new j,$n=new j,ho=new j,Oa=new j,uo=new j;class oc{constructor(t=new j,e=new j(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Dn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Dn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Dn.copy(this.origin).addScaledVector(this.direction,e),Dn.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){lo.copy(t).add(e).multiplyScalar(.5),za.copy(e).sub(t).normalize(),$n.copy(this.origin).sub(lo);const s=t.distanceTo(e)*.5,o=-this.direction.dot(za),r=$n.dot(this.direction),c=-$n.dot(za),l=$n.lengthSq(),d=Math.abs(1-o*o);let f,h,u,g;if(d>0)if(f=o*c-r,h=o*r-c,g=s*d,f>=0)if(h>=-g)if(h<=g){const _=1/d;f*=_,h*=_,u=f*(f+o*h+2*r)+h*(o*f+h+2*c)+l}else h=s,f=Math.max(0,-(o*h+r)),u=-f*f+h*(h+2*c)+l;else h=-s,f=Math.max(0,-(o*h+r)),u=-f*f+h*(h+2*c)+l;else h<=-g?(f=Math.max(0,-(-o*s+r)),h=f>0?-s:Math.min(Math.max(-s,-c),s),u=-f*f+h*(h+2*c)+l):h<=g?(f=0,h=Math.min(Math.max(-s,-c),s),u=h*(h+2*c)+l):(f=Math.max(0,-(o*s+r)),h=f>0?s:Math.min(Math.max(-s,-c),s),u=-f*f+h*(h+2*c)+l);else h=o>0?-s:s,f=Math.max(0,-(o*h+r)),u=-f*f+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,f),a&&a.copy(lo).addScaledVector(za,h),u}intersectSphere(t,e){Dn.subVectors(t.center,this.origin);const i=Dn.dot(this.direction),a=Dn.dot(Dn)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,c=i+o;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,c;const l=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,a=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,a=(t.min.x-h.x)*l),d>=0?(s=(t.min.y-h.y)*d,o=(t.max.y-h.y)*d):(s=(t.max.y-h.y)*d,o=(t.min.y-h.y)*d),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),f>=0?(r=(t.min.z-h.z)*f,c=(t.max.z-h.z)*f):(r=(t.max.z-h.z)*f,c=(t.min.z-h.z)*f),i>c||r>a)||((r>i||i!==i)&&(i=r),(c<a||a!==a)&&(a=c),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Dn)!==null}intersectTriangle(t,e,i,a,s){ho.subVectors(e,t),Oa.subVectors(i,t),uo.crossVectors(ho,Oa);let o=this.direction.dot(uo),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;$n.subVectors(this.origin,t);const c=r*this.direction.dot(Oa.crossVectors($n,Oa));if(c<0)return null;const l=r*this.direction.dot(ho.cross($n));if(l<0||c+l>o)return null;const d=-r*$n.dot(uo);return d<0?null:this.at(d/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class me{constructor(t,e,i,a,s,o,r,c,l,d,f,h,u,g,_,m){me.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l,d,f,h,u,g,_,m)}set(t,e,i,a,s,o,r,c,l,d,f,h,u,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=c,p[2]=l,p[6]=d,p[10]=f,p[14]=h,p[3]=u,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new me().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/ki.setFromMatrixColumn(t,0).length(),s=1/ki.setFromMatrixColumn(t,1).length(),o=1/ki.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),c=Math.cos(a),l=Math.sin(a),d=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const h=o*d,u=o*f,g=r*d,_=r*f;e[0]=c*d,e[4]=-c*f,e[8]=l,e[1]=u+g*l,e[5]=h-_*l,e[9]=-r*c,e[2]=_-h*l,e[6]=g+u*l,e[10]=o*c}else if(t.order==="YXZ"){const h=c*d,u=c*f,g=l*d,_=l*f;e[0]=h+_*r,e[4]=g*r-u,e[8]=o*l,e[1]=o*f,e[5]=o*d,e[9]=-r,e[2]=u*r-g,e[6]=_+h*r,e[10]=o*c}else if(t.order==="ZXY"){const h=c*d,u=c*f,g=l*d,_=l*f;e[0]=h-_*r,e[4]=-o*f,e[8]=g+u*r,e[1]=u+g*r,e[5]=o*d,e[9]=_-h*r,e[2]=-o*l,e[6]=r,e[10]=o*c}else if(t.order==="ZYX"){const h=o*d,u=o*f,g=r*d,_=r*f;e[0]=c*d,e[4]=g*l-u,e[8]=h*l+_,e[1]=c*f,e[5]=_*l+h,e[9]=u*l-g,e[2]=-l,e[6]=r*c,e[10]=o*c}else if(t.order==="YZX"){const h=o*c,u=o*l,g=r*c,_=r*l;e[0]=c*d,e[4]=_-h*f,e[8]=g*f+u,e[1]=f,e[5]=o*d,e[9]=-r*d,e[2]=-l*d,e[6]=u*f+g,e[10]=h-_*f}else if(t.order==="XZY"){const h=o*c,u=o*l,g=r*c,_=r*l;e[0]=c*d,e[4]=-f,e[8]=l*d,e[1]=h*f+_,e[5]=o*d,e[9]=u*f-g,e[2]=g*f-u,e[6]=r*d,e[10]=_*f+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(hm,t,um)}lookAt(t,e,i){const a=this.elements;return Ke.subVectors(t,e),Ke.lengthSq()===0&&(Ke.z=1),Ke.normalize(),Yn.crossVectors(i,Ke),Yn.lengthSq()===0&&(Math.abs(i.z)===1?Ke.x+=1e-4:Ke.z+=1e-4,Ke.normalize(),Yn.crossVectors(i,Ke)),Yn.normalize(),Ba.crossVectors(Ke,Yn),a[0]=Yn.x,a[4]=Ba.x,a[8]=Ke.x,a[1]=Yn.y,a[5]=Ba.y,a[9]=Ke.y,a[2]=Yn.z,a[6]=Ba.z,a[10]=Ke.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],c=i[8],l=i[12],d=i[1],f=i[5],h=i[9],u=i[13],g=i[2],_=i[6],m=i[10],p=i[14],v=i[3],M=i[7],x=i[11],U=i[15],R=a[0],T=a[4],w=a[8],b=a[12],y=a[1],D=a[5],B=a[9],N=a[13],V=a[2],P=a[6],A=a[10],X=a[14],H=a[3],q=a[7],Q=a[11],dt=a[15];return s[0]=o*R+r*y+c*V+l*H,s[4]=o*T+r*D+c*P+l*q,s[8]=o*w+r*B+c*A+l*Q,s[12]=o*b+r*N+c*X+l*dt,s[1]=d*R+f*y+h*V+u*H,s[5]=d*T+f*D+h*P+u*q,s[9]=d*w+f*B+h*A+u*Q,s[13]=d*b+f*N+h*X+u*dt,s[2]=g*R+_*y+m*V+p*H,s[6]=g*T+_*D+m*P+p*q,s[10]=g*w+_*B+m*A+p*Q,s[14]=g*b+_*N+m*X+p*dt,s[3]=v*R+M*y+x*V+U*H,s[7]=v*T+M*D+x*P+U*q,s[11]=v*w+M*B+x*A+U*Q,s[15]=v*b+M*N+x*X+U*dt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],c=t[9],l=t[13],d=t[2],f=t[6],h=t[10],u=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+s*c*f-a*l*f-s*r*h+i*l*h+a*r*u-i*c*u)+_*(+e*c*u-e*l*h+s*o*h-a*o*u+a*l*d-s*c*d)+m*(+e*l*f-e*r*u-s*o*f+i*o*u+s*r*d-i*l*d)+p*(-a*r*d-e*c*f+e*r*h+a*o*f-i*o*h+i*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],f=t[9],h=t[10],u=t[11],g=t[12],_=t[13],m=t[14],p=t[15],v=f*m*l-_*h*l+_*c*u-r*m*u-f*c*p+r*h*p,M=g*h*l-d*m*l-g*c*u+o*m*u+d*c*p-o*h*p,x=d*_*l-g*f*l+g*r*u-o*_*u-d*r*p+o*f*p,U=g*f*c-d*_*c-g*r*h+o*_*h+d*r*m-o*f*m,R=e*v+i*M+a*x+s*U;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/R;return t[0]=v*T,t[1]=(_*h*s-f*m*s-_*a*u+i*m*u+f*a*p-i*h*p)*T,t[2]=(r*m*s-_*c*s+_*a*l-i*m*l-r*a*p+i*c*p)*T,t[3]=(f*c*s-r*h*s-f*a*l+i*h*l+r*a*u-i*c*u)*T,t[4]=M*T,t[5]=(d*m*s-g*h*s+g*a*u-e*m*u-d*a*p+e*h*p)*T,t[6]=(g*c*s-o*m*s-g*a*l+e*m*l+o*a*p-e*c*p)*T,t[7]=(o*h*s-d*c*s+d*a*l-e*h*l-o*a*u+e*c*u)*T,t[8]=x*T,t[9]=(g*f*s-d*_*s-g*i*u+e*_*u+d*i*p-e*f*p)*T,t[10]=(o*_*s-g*r*s+g*i*l-e*_*l-o*i*p+e*r*p)*T,t[11]=(d*r*s-o*f*s-d*i*l+e*f*l+o*i*u-e*r*u)*T,t[12]=U*T,t[13]=(d*_*a-g*f*a+g*i*h-e*_*h-d*i*m+e*f*m)*T,t[14]=(g*r*a-o*_*a-g*i*c+e*_*c+o*i*m-e*r*m)*T,t[15]=(o*f*a-d*r*a+d*i*c-e*f*c-o*i*h+e*r*h)*T,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,c=t.z,l=s*o,d=s*r;return this.set(l*o+i,l*r-a*c,l*c+a*r,0,l*r+a*c,d*r+i,d*c-a*o,0,l*c-a*r,d*c+a*o,s*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,c=e._w,l=s+s,d=o+o,f=r+r,h=s*l,u=s*d,g=s*f,_=o*d,m=o*f,p=r*f,v=c*l,M=c*d,x=c*f,U=i.x,R=i.y,T=i.z;return a[0]=(1-(_+p))*U,a[1]=(u+x)*U,a[2]=(g-M)*U,a[3]=0,a[4]=(u-x)*R,a[5]=(1-(h+p))*R,a[6]=(m+v)*R,a[7]=0,a[8]=(g+M)*T,a[9]=(m-v)*T,a[10]=(1-(h+_))*T,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=ki.set(a[0],a[1],a[2]).length();const o=ki.set(a[4],a[5],a[6]).length(),r=ki.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],pn.copy(this);const l=1/s,d=1/o,f=1/r;return pn.elements[0]*=l,pn.elements[1]*=l,pn.elements[2]*=l,pn.elements[4]*=d,pn.elements[5]*=d,pn.elements[6]*=d,pn.elements[8]*=f,pn.elements[9]*=f,pn.elements[10]*=f,e.setFromRotationMatrix(pn),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=On){const c=this.elements,l=2*s/(e-t),d=2*s/(i-a),f=(e+t)/(e-t),h=(i+a)/(i-a);let u,g;if(r===On)u=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(r===Ts)u=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=u,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=On){const c=this.elements,l=1/(e-t),d=1/(i-a),f=1/(o-s),h=(e+t)*l,u=(i+a)*d;let g,_;if(r===On)g=(o+s)*f,_=-2*f;else if(r===Ts)g=s*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-u,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ki=new j,pn=new me,hm=new j(0,0,0),um=new j(1,1,1),Yn=new j,Ba=new j,Ke=new j,dl=new me,hl=new Aa;class Tn{constructor(t=0,e=0,i=0,a=Tn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],c=a[1],l=a[5],d=a[9],f=a[2],h=a[6],u=a[10];switch(e){case"XYZ":this._y=Math.asin(Xe(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-d,u),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Xe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Xe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,u),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Xe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-Xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-d,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return dl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(dl,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return hl.setFromEuler(this),this.setFromQuaternion(hl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tn.DEFAULT_ORDER="XYZ";class rc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let fm=0;const ul=new j,Ui=new Aa,Ln=new me,Ha=new j,ua=new j,pm=new j,mm=new Aa,fl=new j(1,0,0),pl=new j(0,1,0),ml=new j(0,0,1),gl={type:"added"},gm={type:"removed"},Fi={type:"childadded",child:null},fo={type:"childremoved",child:null};class we extends ta{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fm++}),this.uuid=Ta(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=we.DEFAULT_UP.clone();const t=new j,e=new Tn,i=new Aa,a=new j(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new me},normalMatrix:{value:new qt}}),this.matrix=new me,this.matrixWorld=new me,this.matrixAutoUpdate=we.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ui.setFromAxisAngle(t,e),this.quaternion.multiply(Ui),this}rotateOnWorldAxis(t,e){return Ui.setFromAxisAngle(t,e),this.quaternion.premultiply(Ui),this}rotateX(t){return this.rotateOnAxis(fl,t)}rotateY(t){return this.rotateOnAxis(pl,t)}rotateZ(t){return this.rotateOnAxis(ml,t)}translateOnAxis(t,e){return ul.copy(t).applyQuaternion(this.quaternion),this.position.add(ul.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(fl,t)}translateY(t){return this.translateOnAxis(pl,t)}translateZ(t){return this.translateOnAxis(ml,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Ha.copy(t):Ha.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),ua.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(ua,Ha,this.up):Ln.lookAt(Ha,ua,this.up),this.quaternion.setFromRotationMatrix(Ln),a&&(Ln.extractRotation(a.matrixWorld),Ui.setFromRotationMatrix(Ln),this.quaternion.premultiply(Ui.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(gl),Fi.child=t,this.dispatchEvent(Fi),Fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(gm),fo.child=t,this.dispatchEvent(fo),fo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ln.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ln),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(gl),Fi.child=t,this.dispatchEvent(Fi),Fi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ua,t,pm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ua,mm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const f=c[l];s(t.shapes,f)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(s(t.materials,this.material[c]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];a.animations.push(s(t.animations,c))}}if(e){const r=o(t.geometries),c=o(t.materials),l=o(t.textures),d=o(t.images),f=o(t.shapes),h=o(t.skeletons),u=o(t.animations),g=o(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=a,i;function o(r){const c=[];for(const l in r){const d=r[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}we.DEFAULT_UP=new j(0,1,0);we.DEFAULT_MATRIX_AUTO_UPDATE=!0;we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const mn=new j,In=new j,po=new j,kn=new j,Ni=new j,zi=new j,_l=new j,mo=new j,go=new j,_o=new j,xo=new Me,vo=new Me,Mo=new Me;class rn{constructor(t=new j,e=new j,i=new j){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),mn.subVectors(t,e),a.cross(mn);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){mn.subVectors(a,e),In.subVectors(i,e),po.subVectors(t,e);const o=mn.dot(mn),r=mn.dot(In),c=mn.dot(po),l=In.dot(In),d=In.dot(po),f=o*l-r*r;if(f===0)return s.set(0,0,0),null;const h=1/f,u=(l*c-r*d)*h,g=(o*d-r*c)*h;return s.set(1-u-g,g,u)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,kn)===null?!1:kn.x>=0&&kn.y>=0&&kn.x+kn.y<=1}static getInterpolation(t,e,i,a,s,o,r,c){return this.getBarycoord(t,e,i,a,kn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,kn.x),c.addScaledVector(o,kn.y),c.addScaledVector(r,kn.z),c)}static getInterpolatedAttribute(t,e,i,a,s,o){return xo.setScalar(0),vo.setScalar(0),Mo.setScalar(0),xo.fromBufferAttribute(t,e),vo.fromBufferAttribute(t,i),Mo.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(xo,s.x),o.addScaledVector(vo,s.y),o.addScaledVector(Mo,s.z),o}static isFrontFacing(t,e,i,a){return mn.subVectors(i,e),In.subVectors(t,e),mn.cross(In).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return mn.subVectors(this.c,this.b),In.subVectors(this.a,this.b),mn.cross(In).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return rn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return rn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return rn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return rn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return rn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;Ni.subVectors(a,i),zi.subVectors(s,i),mo.subVectors(t,i);const c=Ni.dot(mo),l=zi.dot(mo);if(c<=0&&l<=0)return e.copy(i);go.subVectors(t,a);const d=Ni.dot(go),f=zi.dot(go);if(d>=0&&f<=d)return e.copy(a);const h=c*f-d*l;if(h<=0&&c>=0&&d<=0)return o=c/(c-d),e.copy(i).addScaledVector(Ni,o);_o.subVectors(t,s);const u=Ni.dot(_o),g=zi.dot(_o);if(g>=0&&u<=g)return e.copy(s);const _=u*l-c*g;if(_<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(i).addScaledVector(zi,r);const m=d*g-u*f;if(m<=0&&f-d>=0&&u-g>=0)return _l.subVectors(s,a),r=(f-d)/(f-d+(u-g)),e.copy(a).addScaledVector(_l,r);const p=1/(m+_+h);return o=_*p,r=h*p,e.copy(i).addScaledVector(Ni,o).addScaledVector(zi,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Gd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zn={h:0,s:0,l:0},Ga={h:0,s:0,l:0};function yo(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Wt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=nn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,oe.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=oe.workingColorSpace){return this.r=t,this.g=e,this.b=i,oe.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=oe.workingColorSpace){if(t=tm(t,1),e=Xe(e,0,1),i=Xe(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=yo(o,s,t+1/3),this.g=yo(o,s,t),this.b=yo(o,s,t-1/3)}return oe.toWorkingColorSpace(this,a),this}setStyle(t,e=nn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=nn){const i=Gd[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Bn(t.r),this.g=Bn(t.g),this.b=Bn(t.b),this}copyLinearToSRGB(t){return this.r=$i(t.r),this.g=$i(t.g),this.b=$i(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=nn){return oe.fromWorkingColorSpace(Ue.copy(this),t),Math.round(Xe(Ue.r*255,0,255))*65536+Math.round(Xe(Ue.g*255,0,255))*256+Math.round(Xe(Ue.b*255,0,255))}getHexString(t=nn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=oe.workingColorSpace){oe.fromWorkingColorSpace(Ue.copy(this),e);const i=Ue.r,a=Ue.g,s=Ue.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let c,l;const d=(r+o)/2;if(r===o)c=0,l=0;else{const f=o-r;switch(l=d<=.5?f/(o+r):f/(2-o-r),o){case i:c=(a-s)/f+(a<s?6:0);break;case a:c=(s-i)/f+2;break;case s:c=(i-a)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=oe.workingColorSpace){return oe.fromWorkingColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=nn){oe.fromWorkingColorSpace(Ue.copy(this),t);const e=Ue.r,i=Ue.g,a=Ue.b;return t!==nn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(Zn),this.setHSL(Zn.h+t,Zn.s+e,Zn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Zn),t.getHSL(Ga);const i=io(Zn.h,Ga.h,e),a=io(Zn.s,Ga.s,e),s=io(Zn.l,Ga.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new Wt;Wt.NAMES=Gd;let _m=0;class ea extends ta{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_m++}),this.uuid=Ta(),this.name="",this.blending=Xi,this.side=ti,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tr,this.blendDst=er,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Wt(0,0,0),this.blendAlpha=0,this.depthFunc=Yi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ci,this.stencilZFail=Ci,this.stencilZPass=Ci,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Xi&&(i.blending=this.blending),this.side!==ti&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==tr&&(i.blendSrc=this.blendSrc),this.blendDst!==er&&(i.blendDst=this.blendDst),this.blendEquation!==gi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Yi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==tl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ci&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ci&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ci&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const c=s[r];delete c.metadata,o.push(c)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class cn extends ea{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=Qr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ee=new j,Va=new ae;class Ye{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=el,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Va.fromBufferAttribute(this,e),Va.applyMatrix3(t),this.setXY(e,Va.x,Va.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=la(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ve(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=la(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=la(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=la(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=la(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),i=Ve(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),i=Ve(i,this.array),a=Ve(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),i=Ve(i,this.array),a=Ve(a,this.array),s=Ve(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==el&&(t.usage=this.usage),t}}class Vd extends Ye{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Xd extends Ye{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Se extends Ye{constructor(t,e,i){super(new Float32Array(t),e,i)}}let xm=0;const tn=new me,So=new we,Oi=new j,Je=new Ra,fa=new Ra,De=new j;class He extends ta{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=Ta(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Od(t)?Xd:Vd)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new qt().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return tn.makeRotationFromQuaternion(t),this.applyMatrix4(tn),this}rotateX(t){return tn.makeRotationX(t),this.applyMatrix4(tn),this}rotateY(t){return tn.makeRotationY(t),this.applyMatrix4(tn),this}rotateZ(t){return tn.makeRotationZ(t),this.applyMatrix4(tn),this}translate(t,e,i){return tn.makeTranslation(t,e,i),this.applyMatrix4(tn),this}scale(t,e,i){return tn.makeScale(t,e,i),this.applyMatrix4(tn),this}lookAt(t){return So.lookAt(t),So.updateMatrix(),this.applyMatrix4(So.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Oi).negate(),this.translate(Oi.x,Oi.y,Oi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Se(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ra);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new j(-1/0,-1/0,-1/0),new j(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];Je.setFromBufferAttribute(s),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,Je.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,Je.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(Je.min),this.boundingBox.expandByPoint(Je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ks);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new j,1/0);return}if(t){const i=this.boundingSphere.center;if(Je.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];fa.setFromBufferAttribute(r),this.morphTargetsRelative?(De.addVectors(Je.min,fa.min),Je.expandByPoint(De),De.addVectors(Je.max,fa.max),Je.expandByPoint(De)):(Je.expandByPoint(fa.min),Je.expandByPoint(fa.max))}Je.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)De.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(De));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],c=this.morphTargetsRelative;for(let l=0,d=r.count;l<d;l++)De.fromBufferAttribute(r,l),c&&(Oi.fromBufferAttribute(t,l),De.add(Oi)),a=Math.max(a,i.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ye(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],c=[];for(let w=0;w<i.count;w++)r[w]=new j,c[w]=new j;const l=new j,d=new j,f=new j,h=new ae,u=new ae,g=new ae,_=new j,m=new j;function p(w,b,y){l.fromBufferAttribute(i,w),d.fromBufferAttribute(i,b),f.fromBufferAttribute(i,y),h.fromBufferAttribute(s,w),u.fromBufferAttribute(s,b),g.fromBufferAttribute(s,y),d.sub(l),f.sub(l),u.sub(h),g.sub(h);const D=1/(u.x*g.y-g.x*u.y);isFinite(D)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(D),m.copy(f).multiplyScalar(u.x).addScaledVector(d,-g.x).multiplyScalar(D),r[w].add(_),r[b].add(_),r[y].add(_),c[w].add(m),c[b].add(m),c[y].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let w=0,b=v.length;w<b;++w){const y=v[w],D=y.start,B=y.count;for(let N=D,V=D+B;N<V;N+=3)p(t.getX(N+0),t.getX(N+1),t.getX(N+2))}const M=new j,x=new j,U=new j,R=new j;function T(w){U.fromBufferAttribute(a,w),R.copy(U);const b=r[w];M.copy(b),M.sub(U.multiplyScalar(U.dot(b))).normalize(),x.crossVectors(R,b);const D=x.dot(c[w])<0?-1:1;o.setXYZW(w,M.x,M.y,M.z,D)}for(let w=0,b=v.length;w<b;++w){const y=v[w],D=y.start,B=y.count;for(let N=D,V=D+B;N<V;N+=3)T(t.getX(N+0)),T(t.getX(N+1)),T(t.getX(N+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ye(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,u=i.count;h<u;h++)i.setXYZ(h,0,0,0);const a=new j,s=new j,o=new j,r=new j,c=new j,l=new j,d=new j,f=new j;if(t)for(let h=0,u=t.count;h<u;h+=3){const g=t.getX(h+0),_=t.getX(h+1),m=t.getX(h+2);a.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),d.subVectors(o,s),f.subVectors(a,s),d.cross(f),r.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),r.add(d),c.add(d),l.add(d),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,u=e.count;h<u;h+=3)a.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),d.subVectors(o,s),f.subVectors(a,s),d.cross(f),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(r,c){const l=r.array,d=r.itemSize,f=r.normalized,h=new l.constructor(c.length*d);let u=0,g=0;for(let _=0,m=c.length;_<m;_++){r.isInterleavedBufferAttribute?u=c[_]*r.data.stride+r.offset:u=c[_]*d;for(let p=0;p<d;p++)h[g++]=l[u++]}return new Ye(h,d,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new He,i=this.index.array,a=this.attributes;for(const r in a){const c=a[r],l=t(c,i);e.setAttribute(r,l)}const s=this.morphAttributes;for(const r in s){const c=[],l=s[r];for(let d=0,f=l.length;d<f;d++){const h=l[d],u=t(h,i);c.push(u)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,c=o.length;r<c;r++){const l=o[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const a={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let f=0,h=l.length;f<h;f++){const u=l[f];d.push(u.toJSON(t.data))}d.length>0&&(a[c]=d,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const l in a){const d=a[l];this.setAttribute(l,d.clone(e))}const s=t.morphAttributes;for(const l in s){const d=[],f=s[l];for(let h=0,u=f.length;h<u;h++)d.push(f[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,d=o.length;l<d;l++){const f=o[l];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const xl=new me,ci=new oc,Xa=new ks,vl=new j,Wa=new j,$a=new j,Ya=new j,bo=new j,Za=new j,Ml=new j,qa=new j;class fe extends we{constructor(t=new He,e=new cn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){Za.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const d=r[c],f=s[c];d!==0&&(bo.fromBufferAttribute(f,t),o?Za.addScaledVector(bo,d):Za.addScaledVector(bo.sub(e),d))}e.add(Za)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Xa.copy(i.boundingSphere),Xa.applyMatrix4(s),ci.copy(t.ray).recast(t.near),!(Xa.containsPoint(ci.origin)===!1&&(ci.intersectSphere(Xa,vl)===null||ci.origin.distanceToSquared(vl)>(t.far-t.near)**2))&&(xl.copy(s).invert(),ci.copy(t.ray).applyMatrix4(xl),!(i.boundingBox!==null&&ci.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ci)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,c=s.attributes.position,l=s.attributes.uv,d=s.attributes.uv1,f=s.attributes.normal,h=s.groups,u=s.drawRange;if(r!==null)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=o[m.materialIndex],v=Math.max(m.start,u.start),M=Math.min(r.count,Math.min(m.start+m.count,u.start+u.count));for(let x=v,U=M;x<U;x+=3){const R=r.getX(x),T=r.getX(x+1),w=r.getX(x+2);a=ja(this,p,t,i,l,d,f,R,T,w),a&&(a.faceIndex=Math.floor(x/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,u.start),_=Math.min(r.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){const v=r.getX(m),M=r.getX(m+1),x=r.getX(m+2);a=ja(this,o,t,i,l,d,f,v,M,x),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=o[m.materialIndex],v=Math.max(m.start,u.start),M=Math.min(c.count,Math.min(m.start+m.count,u.start+u.count));for(let x=v,U=M;x<U;x+=3){const R=x,T=x+1,w=x+2;a=ja(this,p,t,i,l,d,f,R,T,w),a&&(a.faceIndex=Math.floor(x/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,u.start),_=Math.min(c.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){const v=m,M=m+1,x=m+2;a=ja(this,o,t,i,l,d,f,v,M,x),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}}}function vm(n,t,e,i,a,s,o,r){let c;if(t.side===We?c=i.intersectTriangle(o,s,a,!0,r):c=i.intersectTriangle(a,s,o,t.side===ti,r),c===null)return null;qa.copy(r),qa.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(qa);return l<e.near||l>e.far?null:{distance:l,point:qa.clone(),object:n}}function ja(n,t,e,i,a,s,o,r,c,l){n.getVertexPosition(r,Wa),n.getVertexPosition(c,$a),n.getVertexPosition(l,Ya);const d=vm(n,t,e,i,Wa,$a,Ya,Ml);if(d){const f=new j;rn.getBarycoord(Ml,Wa,$a,Ya,f),a&&(d.uv=rn.getInterpolatedAttribute(a,r,c,l,f,new ae)),s&&(d.uv1=rn.getInterpolatedAttribute(s,r,c,l,f,new ae)),o&&(d.normal=rn.getInterpolatedAttribute(o,r,c,l,f,new j),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:r,b:c,c:l,normal:new j,materialIndex:0};rn.getNormal(Wa,$a,Ya,h.normal),d.face=h,d.barycoord=f}return d}class An extends He{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],d=[],f=[];let h=0,u=0;g("z","y","x",-1,-1,i,e,t,o,s,0),g("z","y","x",1,-1,i,e,-t,o,s,1),g("x","z","y",1,1,t,i,e,a,o,2),g("x","z","y",1,-1,t,i,-e,a,o,3),g("x","y","z",1,-1,t,e,i,a,s,4),g("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(c),this.setAttribute("position",new Se(l,3)),this.setAttribute("normal",new Se(d,3)),this.setAttribute("uv",new Se(f,2));function g(_,m,p,v,M,x,U,R,T,w,b){const y=x/T,D=U/w,B=x/2,N=U/2,V=R/2,P=T+1,A=w+1;let X=0,H=0;const q=new j;for(let Q=0;Q<A;Q++){const dt=Q*D-N;for(let ft=0;ft<P;ft++){const vt=ft*y-B;q[_]=vt*v,q[m]=dt*M,q[p]=V,l.push(q.x,q.y,q.z),q[_]=0,q[m]=0,q[p]=R>0?1:-1,d.push(q.x,q.y,q.z),f.push(ft/T),f.push(1-Q/w),X+=1}}for(let Q=0;Q<w;Q++)for(let dt=0;dt<T;dt++){const ft=h+dt+P*Q,vt=h+dt+P*(Q+1),Y=h+(dt+1)+P*(Q+1),et=h+(dt+1)+P*Q;c.push(ft,vt,et),c.push(vt,Y,et),H+=6}r.addGroup(u,H,b),u+=H,h+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new An(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ji(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function Oe(n){const t={};for(let e=0;e<n.length;e++){const i=Ji(n[e]);for(const a in i)t[a]=i[a]}return t}function Mm(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Wd(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:oe.workingColorSpace}const ym={clone:Ji,merge:Oe};var Sm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,bm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ei extends ea{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Sm,this.fragmentShader=bm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ji(t.uniforms),this.uniformsGroups=Mm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class $d extends we{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new me,this.projectionMatrix=new me,this.projectionMatrixInverse=new me,this.coordinateSystem=On}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const qn=new j,yl=new ae,Sl=new ae;class an extends $d{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Or*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(fs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Or*2*Math.atan(Math.tan(fs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(qn.x,qn.y).multiplyScalar(-t/qn.z),qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(qn.x,qn.y).multiplyScalar(-t/qn.z)}getViewSize(t,e){return this.getViewBounds(t,yl,Sl),e.subVectors(Sl,yl)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(fs*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*a/c,e-=o.offsetY*i/l,a*=o.width/c,i*=o.height/l}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Bi=-90,Hi=1;class Em extends we{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new an(Bi,Hi,t,e);a.layers=this.layers,this.add(a);const s=new an(Bi,Hi,t,e);s.layers=this.layers,this.add(s);const o=new an(Bi,Hi,t,e);o.layers=this.layers,this.add(o);const r=new an(Bi,Hi,t,e);r.layers=this.layers,this.add(r);const c=new an(Bi,Hi,t,e);c.layers=this.layers,this.add(c);const l=new an(Bi,Hi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,c]=e;for(const l of e)this.remove(l);if(t===On)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ts)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,c,l,d]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,c),t.setRenderTarget(i,4,a),t.render(e,l),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,a),t.render(e,d),t.setRenderTarget(f,h,u),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Yd extends $e{constructor(t,e,i,a,s,o,r,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:Zi,super(t,e,i,a,s,o,r,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class wm extends bi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Yd(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:En}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new An(5,5,5),s=new ei({name:"CubemapFromEquirect",uniforms:Ji(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:We,blending:Jn});s.uniforms.tEquirect.value=e;const o=new fe(a,s),r=e.minFilter;return e.minFilter===vi&&(e.minFilter=En),new Em(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const Eo=new j,Tm=new j,Am=new qt;class fi{constructor(t=new j(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=Eo.subVectors(i,e).cross(Tm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Eo),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Am.getNormalMatrix(t),a=this.coplanarPoint(Eo).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const li=new ks,Ka=new j;class cc{constructor(t=new fi,e=new fi,i=new fi,a=new fi,s=new fi,o=new fi){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=On){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],c=a[3],l=a[4],d=a[5],f=a[6],h=a[7],u=a[8],g=a[9],_=a[10],m=a[11],p=a[12],v=a[13],M=a[14],x=a[15];if(i[0].setComponents(c-s,h-l,m-u,x-p).normalize(),i[1].setComponents(c+s,h+l,m+u,x+p).normalize(),i[2].setComponents(c+o,h+d,m+g,x+v).normalize(),i[3].setComponents(c-o,h-d,m-g,x-v).normalize(),i[4].setComponents(c-r,h-f,m-_,x-M).normalize(),e===On)i[5].setComponents(c+r,h+f,m+_,x+M).normalize();else if(e===Ts)i[5].setComponents(r,f,_,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(t){return li.center.set(0,0,0),li.radius=.7071067811865476,li.applyMatrix4(t.matrixWorld),this.intersectsSphere(li)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(Ka.x=a.normal.x>0?t.max.x:t.min.x,Ka.y=a.normal.y>0?t.max.y:t.min.y,Ka.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(Ka)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Zd(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function Rm(n){const t=new WeakMap;function e(r,c){const l=r.array,d=r.usage,f=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,d),r.onUploadCallback();let u;if(l instanceof Float32Array)u=n.FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=n.SHORT;else if(l instanceof Uint32Array)u=n.UNSIGNED_INT;else if(l instanceof Int32Array)u=n.INT;else if(l instanceof Int8Array)u=n.BYTE;else if(l instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,c,l){const d=c.array,f=c.updateRanges;if(n.bindBuffer(l,r),f.length===0)n.bufferSubData(l,0,d);else{f.sort((u,g)=>u.start-g.start);let h=0;for(let u=1;u<f.length;u++){const g=f[h],_=f[u];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,f[h]=_)}f.length=h+1;for(let u=0,g=f.length;u<g;u++){const _=f[u];n.bufferSubData(l,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function o(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const d=t.get(r);(!d||d.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:a,remove:s,update:o}}class Us extends He{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),c=Math.floor(a),l=r+1,d=c+1,f=t/r,h=e/c,u=[],g=[],_=[],m=[];for(let p=0;p<d;p++){const v=p*h-o;for(let M=0;M<l;M++){const x=M*f-s;g.push(x,-v,0),_.push(0,0,1),m.push(M/r),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<r;v++){const M=v+l*p,x=v+l*(p+1),U=v+1+l*(p+1),R=v+1+l*p;u.push(M,x,R),u.push(x,U,R)}this.setIndex(u),this.setAttribute("position",new Se(g,3)),this.setAttribute("normal",new Se(_,3)),this.setAttribute("uv",new Se(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Us(t.width,t.height,t.widthSegments,t.heightSegments)}}var Cm=`#ifdef USE_ALPHAHASH
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
}`,Kt={alphahash_fragment:Cm,alphahash_pars_fragment:Pm,alphamap_fragment:Dm,alphamap_pars_fragment:Lm,alphatest_fragment:Im,alphatest_pars_fragment:km,aomap_fragment:Um,aomap_pars_fragment:Fm,batching_pars_vertex:Nm,batching_vertex:zm,begin_vertex:Om,beginnormal_vertex:Bm,bsdfs:Hm,iridescence_fragment:Gm,bumpmap_pars_fragment:Vm,clipping_planes_fragment:Xm,clipping_planes_pars_fragment:Wm,clipping_planes_pars_vertex:$m,clipping_planes_vertex:Ym,color_fragment:Zm,color_pars_fragment:qm,color_pars_vertex:jm,color_vertex:Km,common:Jm,cube_uv_reflection_fragment:Qm,defaultnormal_vertex:tg,displacementmap_pars_vertex:eg,displacementmap_vertex:ng,emissivemap_fragment:ig,emissivemap_pars_fragment:ag,colorspace_fragment:sg,colorspace_pars_fragment:og,envmap_fragment:rg,envmap_common_pars_fragment:cg,envmap_pars_fragment:lg,envmap_pars_vertex:dg,envmap_physical_pars_fragment:yg,envmap_vertex:hg,fog_vertex:ug,fog_pars_vertex:fg,fog_fragment:pg,fog_pars_fragment:mg,gradientmap_pars_fragment:gg,lightmap_pars_fragment:_g,lights_lambert_fragment:xg,lights_lambert_pars_fragment:vg,lights_pars_begin:Mg,lights_toon_fragment:Sg,lights_toon_pars_fragment:bg,lights_phong_fragment:Eg,lights_phong_pars_fragment:wg,lights_physical_fragment:Tg,lights_physical_pars_fragment:Ag,lights_fragment_begin:Rg,lights_fragment_maps:Cg,lights_fragment_end:Pg,logdepthbuf_fragment:Dg,logdepthbuf_pars_fragment:Lg,logdepthbuf_pars_vertex:Ig,logdepthbuf_vertex:kg,map_fragment:Ug,map_pars_fragment:Fg,map_particle_fragment:Ng,map_particle_pars_fragment:zg,metalnessmap_fragment:Og,metalnessmap_pars_fragment:Bg,morphinstance_vertex:Hg,morphcolor_vertex:Gg,morphnormal_vertex:Vg,morphtarget_pars_vertex:Xg,morphtarget_vertex:Wg,normal_fragment_begin:$g,normal_fragment_maps:Yg,normal_pars_fragment:Zg,normal_pars_vertex:qg,normal_vertex:jg,normalmap_pars_fragment:Kg,clearcoat_normal_fragment_begin:Jg,clearcoat_normal_fragment_maps:Qg,clearcoat_pars_fragment:t0,iridescence_pars_fragment:e0,opaque_fragment:n0,packing:i0,premultiplied_alpha_fragment:a0,project_vertex:s0,dithering_fragment:o0,dithering_pars_fragment:r0,roughnessmap_fragment:c0,roughnessmap_pars_fragment:l0,shadowmap_pars_fragment:d0,shadowmap_pars_vertex:h0,shadowmap_vertex:u0,shadowmask_pars_fragment:f0,skinbase_vertex:p0,skinning_pars_vertex:m0,skinning_vertex:g0,skinnormal_vertex:_0,specularmap_fragment:x0,specularmap_pars_fragment:v0,tonemapping_fragment:M0,tonemapping_pars_fragment:y0,transmission_fragment:S0,transmission_pars_fragment:b0,uv_pars_fragment:E0,uv_pars_vertex:w0,uv_vertex:T0,worldpos_vertex:A0,background_vert:R0,background_frag:C0,backgroundCube_vert:P0,backgroundCube_frag:D0,cube_vert:L0,cube_frag:I0,depth_vert:k0,depth_frag:U0,distanceRGBA_vert:F0,distanceRGBA_frag:N0,equirect_vert:z0,equirect_frag:O0,linedashed_vert:B0,linedashed_frag:H0,meshbasic_vert:G0,meshbasic_frag:V0,meshlambert_vert:X0,meshlambert_frag:W0,meshmatcap_vert:$0,meshmatcap_frag:Y0,meshnormal_vert:Z0,meshnormal_frag:q0,meshphong_vert:j0,meshphong_frag:K0,meshphysical_vert:J0,meshphysical_frag:Q0,meshtoon_vert:t_,meshtoon_frag:e_,points_vert:n_,points_frag:i_,shadow_vert:a_,shadow_frag:s_,sprite_vert:o_,sprite_frag:r_},Rt={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qt}},envmap:{envMap:{value:null},envMapRotation:{value:new qt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qt},normalScale:{value:new ae(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0},uvTransform:{value:new qt}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new ae(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}}},bn={basic:{uniforms:Oe([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:Oe([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,Rt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:Oe([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,Rt.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:Oe([Rt.common,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.roughnessmap,Rt.metalnessmap,Rt.fog,Rt.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:Oe([Rt.common,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.gradientmap,Rt.fog,Rt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:Oe([Rt.common,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:Oe([Rt.points,Rt.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:Oe([Rt.common,Rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:Oe([Rt.common,Rt.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:Oe([Rt.common,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:Oe([Rt.sprite,Rt.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qt}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:Oe([Rt.common,Rt.displacementmap,{referencePosition:{value:new j},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:Oe([Rt.lights,Rt.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};bn.physical={uniforms:Oe([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qt},clearcoatNormalScale:{value:new ae(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qt},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qt},transmissionSamplerSize:{value:new ae},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qt},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qt},anisotropyVector:{value:new ae},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const Ja={r:0,b:0,g:0},di=new Tn,c_=new me;function l_(n,t,e,i,a,s,o){const r=new Wt(0);let c=s===!0?0:1,l,d,f=null,h=0,u=null;function g(v){let M=v.isScene===!0?v.background:null;return M&&M.isTexture&&(M=(v.backgroundBlurriness>0?e:t).get(M)),M}function _(v){let M=!1;const x=g(v);x===null?p(r,c):x&&x.isColor&&(p(x,1),M=!0);const U=n.xr.getEnvironmentBlendMode();U==="additive"?i.buffers.color.setClear(0,0,0,1,o):U==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(v,M){const x=g(M);x&&(x.isCubeTexture||x.mapping===Ls)?(d===void 0&&(d=new fe(new An(1,1,1),new ei({name:"BackgroundCubeMaterial",uniforms:Ji(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:We,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(U,R,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(d)),di.copy(M.backgroundRotation),di.x*=-1,di.y*=-1,di.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),d.material.uniforms.envMap.value=x,d.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(c_.makeRotationFromEuler(di)),d.material.toneMapped=oe.getTransfer(x.colorSpace)!==de,(f!==x||h!==x.version||u!==n.toneMapping)&&(d.material.needsUpdate=!0,f=x,h=x.version,u=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new fe(new Us(2,2),new ei({name:"BackgroundMaterial",uniforms:Ji(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:ti,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=oe.getTransfer(x.colorSpace)!==de,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(f!==x||h!==x.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,f=x,h=x.version,u=n.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function p(v,M){v.getRGB(Ja,Wd(n)),i.buffers.color.setClear(Ja.r,Ja.g,Ja.b,M,o)}return{getClearColor:function(){return r},setClearColor:function(v,M=1){r.set(v),c=M,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,p(r,c)},render:_,addToRenderList:m}}function d_(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=h(null);let s=a,o=!1;function r(y,D,B,N,V){let P=!1;const A=f(N,B,D);s!==A&&(s=A,l(s.object)),P=u(y,N,B,V),P&&g(y,N,B,V),V!==null&&t.update(V,n.ELEMENT_ARRAY_BUFFER),(P||o)&&(o=!1,x(y,D,B,N),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function d(y){return n.deleteVertexArray(y)}function f(y,D,B){const N=B.wireframe===!0;let V=i[y.id];V===void 0&&(V={},i[y.id]=V);let P=V[D.id];P===void 0&&(P={},V[D.id]=P);let A=P[N];return A===void 0&&(A=h(c()),P[N]=A),A}function h(y){const D=[],B=[],N=[];for(let V=0;V<e;V++)D[V]=0,B[V]=0,N[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:B,attributeDivisors:N,object:y,attributes:{},index:null}}function u(y,D,B,N){const V=s.attributes,P=D.attributes;let A=0;const X=B.getAttributes();for(const H in X)if(X[H].location>=0){const Q=V[H];let dt=P[H];if(dt===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(dt=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(dt=y.instanceColor)),Q===void 0||Q.attribute!==dt||dt&&Q.data!==dt.data)return!0;A++}return s.attributesNum!==A||s.index!==N}function g(y,D,B,N){const V={},P=D.attributes;let A=0;const X=B.getAttributes();for(const H in X)if(X[H].location>=0){let Q=P[H];Q===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(Q=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(Q=y.instanceColor));const dt={};dt.attribute=Q,Q&&Q.data&&(dt.data=Q.data),V[H]=dt,A++}s.attributes=V,s.attributesNum=A,s.index=N}function _(){const y=s.newAttributes;for(let D=0,B=y.length;D<B;D++)y[D]=0}function m(y){p(y,0)}function p(y,D){const B=s.newAttributes,N=s.enabledAttributes,V=s.attributeDivisors;B[y]=1,N[y]===0&&(n.enableVertexAttribArray(y),N[y]=1),V[y]!==D&&(n.vertexAttribDivisor(y,D),V[y]=D)}function v(){const y=s.newAttributes,D=s.enabledAttributes;for(let B=0,N=D.length;B<N;B++)D[B]!==y[B]&&(n.disableVertexAttribArray(B),D[B]=0)}function M(y,D,B,N,V,P,A){A===!0?n.vertexAttribIPointer(y,D,B,V,P):n.vertexAttribPointer(y,D,B,N,V,P)}function x(y,D,B,N){_();const V=N.attributes,P=B.getAttributes(),A=D.defaultAttributeValues;for(const X in P){const H=P[X];if(H.location>=0){let q=V[X];if(q===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(q=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(q=y.instanceColor)),q!==void 0){const Q=q.normalized,dt=q.itemSize,ft=t.get(q);if(ft===void 0)continue;const vt=ft.buffer,Y=ft.type,et=ft.bytesPerElement,_t=Y===n.INT||Y===n.UNSIGNED_INT||q.gpuType===tc;if(q.isInterleavedBufferAttribute){const K=q.data,pt=K.stride,Pt=q.offset;if(K.isInstancedInterleavedBuffer){for(let At=0;At<H.locationSize;At++)p(H.location+At,K.meshPerAttribute);y.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let At=0;At<H.locationSize;At++)m(H.location+At);n.bindBuffer(n.ARRAY_BUFFER,vt);for(let At=0;At<H.locationSize;At++)M(H.location+At,dt/H.locationSize,Y,Q,pt*et,(Pt+dt/H.locationSize*At)*et,_t)}else{if(q.isInstancedBufferAttribute){for(let K=0;K<H.locationSize;K++)p(H.location+K,q.meshPerAttribute);y.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let K=0;K<H.locationSize;K++)m(H.location+K);n.bindBuffer(n.ARRAY_BUFFER,vt);for(let K=0;K<H.locationSize;K++)M(H.location+K,dt/H.locationSize,Y,Q,dt*et,dt/H.locationSize*K*et,_t)}}else if(A!==void 0){const Q=A[X];if(Q!==void 0)switch(Q.length){case 2:n.vertexAttrib2fv(H.location,Q);break;case 3:n.vertexAttrib3fv(H.location,Q);break;case 4:n.vertexAttrib4fv(H.location,Q);break;default:n.vertexAttrib1fv(H.location,Q)}}}}v()}function U(){w();for(const y in i){const D=i[y];for(const B in D){const N=D[B];for(const V in N)d(N[V].object),delete N[V];delete D[B]}delete i[y]}}function R(y){if(i[y.id]===void 0)return;const D=i[y.id];for(const B in D){const N=D[B];for(const V in N)d(N[V].object),delete N[V];delete D[B]}delete i[y.id]}function T(y){for(const D in i){const B=i[D];if(B[y.id]===void 0)continue;const N=B[y.id];for(const V in N)d(N[V].object),delete N[V];delete B[y.id]}}function w(){b(),o=!0,s!==a&&(s=a,l(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:w,resetDefaultState:b,dispose:U,releaseStatesOfGeometry:R,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function h_(n,t,e){let i;function a(l){i=l}function s(l,d){n.drawArrays(i,l,d),e.update(d,i,1)}function o(l,d,f){f!==0&&(n.drawArraysInstanced(i,l,d,f),e.update(d,i,f))}function r(l,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,d,0,f);let u=0;for(let g=0;g<f;g++)u+=d[g];e.update(u,i,1)}function c(l,d,f,h){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<l.length;g++)o(l[g],d[g],h[g]);else{u.multiDrawArraysInstancedWEBGL(i,l,0,d,0,h,0,f);let g=0;for(let _=0;_<f;_++)g+=d[_]*h[_];e.update(g,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function u_(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(T){return!(T!==_n&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(T){const w=T===wa&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==Hn&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==zn&&!w)}function c(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const f=e.logarithmicDepthBuffer===!0,h=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),M=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),U=g>0,R=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:h,maxTextures:u,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:x,vertexTextures:U,maxSamples:R}}function f_(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new fi,r=new qt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const u=f.length!==0||h||i!==0||a;return a=h,i=f.length,u},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){e=d(f,h,0)},this.setState=function(f,h,u){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!a||g===null||g.length===0||s&&!m)s?d(null):l();else{const v=s?0:i,M=v*4;let x=p.clippingState||null;c.value=x,x=d(g,h,M,u);for(let U=0;U!==M;++U)x[U]=e[U];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function d(f,h,u,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=u+_*4,v=h.matrixWorldInverse;r.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,x=u;M!==_;++M,x+=4)o.copy(f[M]).applyMatrix4(v,r),o.normal.toArray(m,x),m[x+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function p_(n){let t=new WeakMap;function e(o,r){return r===lr?o.mapping=Zi:r===dr&&(o.mapping=qi),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===lr||r===dr)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new wm(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",a),e(l.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class qd extends $d{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,c=a-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,r-=d*this.view.offsetY,c=r-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Vi=4,bl=[.125,.215,.35,.446,.526,.582],_i=20,wo=new qd,El=new Wt;let To=null,Ao=0,Ro=0,Co=!1;const pi=(1+Math.sqrt(5))/2,Gi=1/pi,wl=[new j(-pi,Gi,0),new j(pi,Gi,0),new j(-Gi,0,pi),new j(Gi,0,pi),new j(0,pi,-Gi),new j(0,pi,Gi),new j(-1,1,-1),new j(1,1,-1),new j(-1,1,1),new j(1,1,1)];class Tl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){To=this._renderer.getRenderTarget(),Ao=this._renderer.getActiveCubeFace(),Ro=this._renderer.getActiveMipmapLevel(),Co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Rl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(To,Ao,Ro),this._renderer.xr.enabled=Co,t.scissorTest=!1,Qa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Zi||t.mapping===qi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),To=this._renderer.getRenderTarget(),Ao=this._renderer.getActiveCubeFace(),Ro=this._renderer.getActiveMipmapLevel(),Co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:En,minFilter:En,generateMipmaps:!1,type:wa,format:_n,colorSpace:Qi,depthBuffer:!1},a=Al(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Al(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=m_(s)),this._blurMaterial=g_(s,t,e)}return a}_compileMaterial(t){const e=new fe(this._lodPlanes[0],t);this._renderer.compile(e,wo)}_sceneToCubeUV(t,e,i,a){const r=new an(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(El),d.toneMapping=Qn,d.autoClear=!1;const u=new cn({name:"PMREM.Background",side:We,depthWrite:!1,depthTest:!1}),g=new fe(new An,u);let _=!1;const m=t.background;m?m.isColor&&(u.color.copy(m),t.background=null,_=!0):(u.color.copy(El),_=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(r.up.set(0,c[p],0),r.lookAt(l[p],0,0)):v===1?(r.up.set(0,0,c[p]),r.lookAt(0,l[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,l[p]));const M=this._cubeSize;Qa(a,v*M,p>2?M:0,M,M),d.setRenderTarget(a),_&&d.render(g,r),d.render(t,r)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=h,d.autoClear=f,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===Zi||t.mapping===qi;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Rl());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new fe(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const c=this._cubeSize;Qa(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,wo)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=wl[(a-s-1)%wl.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,f=new fe(this._lodPlanes[a],l),h=l.uniforms,u=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*_i-1),_=s/g,m=isFinite(s)?1+Math.floor(d*_):_i;m>_i&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${_i}`);const p=[];let v=0;for(let T=0;T<_i;++T){const w=T/_,b=Math.exp(-w*w/2);p.push(b),T===0?v+=b:T<m&&(v+=2*b)}for(let T=0;T<p.length;T++)p[T]=p[T]/v;h.envMap.value=t.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=o==="latitudinal",r&&(h.poleAxis.value=r);const{_lodMax:M}=this;h.dTheta.value=g,h.mipInt.value=M-i;const x=this._sizeLods[a],U=3*x*(a>M-Vi?a-M+Vi:0),R=4*(this._cubeSize-x);Qa(e,U,R,3*x,2*x),c.setRenderTarget(e),c.render(f,wo)}}function m_(n){const t=[],e=[],i=[];let a=n;const s=n-Vi+1+bl.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let c=1/r;o>n-Vi?c=bl[o-n+Vi-1]:o===0&&(c=0),i.push(c);const l=1/(r-2),d=-l,f=1+l,h=[d,d,f,d,f,f,d,d,f,f,d,f],u=6,g=6,_=3,m=2,p=1,v=new Float32Array(_*g*u),M=new Float32Array(m*g*u),x=new Float32Array(p*g*u);for(let R=0;R<u;R++){const T=R%3*2/3-1,w=R>2?0:-1,b=[T,w,0,T+2/3,w,0,T+2/3,w+1,0,T,w,0,T+2/3,w+1,0,T,w+1,0];v.set(b,_*g*R),M.set(h,m*g*R);const y=[R,R,R,R,R,R];x.set(y,p*g*R)}const U=new He;U.setAttribute("position",new Ye(v,_)),U.setAttribute("uv",new Ye(M,m)),U.setAttribute("faceIndex",new Ye(x,p)),t.push(U),a>Vi&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Al(n,t,e){const i=new bi(n,t,e);return i.texture.mapping=Ls,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Qa(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function g_(n,t,e){const i=new Float32Array(_i),a=new j(0,1,0);return new ei({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:lc(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function Rl(){return new ei({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:lc(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function Cl(){return new ei({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:lc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function lc(){return`

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
	`}function __(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===lr||c===dr,d=c===Zi||c===qi;if(l||d){let f=t.get(r);const h=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==h)return e===null&&(e=new Tl(n)),f=l?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return l&&u&&u.height>0||d&&u&&a(u)?(e===null&&(e=new Tl(n)),f=l?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",s),f.texture):null}}}return r}function a(r){let c=0;const l=6;for(let d=0;d<l;d++)r[d]!==void 0&&c++;return c===l}function s(r){const c=r.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function x_(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&ga("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function v_(n,t,e,i){const a={},s=new WeakMap;function o(f){const h=f.target;h.index!==null&&t.remove(h.index);for(const g in h.attributes)t.remove(h.attributes[g]);for(const g in h.morphAttributes){const _=h.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}h.removeEventListener("dispose",o),delete a[h.id];const u=s.get(h);u&&(t.remove(u),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function r(f,h){return a[h.id]===!0||(h.addEventListener("dispose",o),a[h.id]=!0,e.memory.geometries++),h}function c(f){const h=f.attributes;for(const g in h)t.update(h[g],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const g in u){const _=u[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],n.ARRAY_BUFFER)}}function l(f){const h=[],u=f.index,g=f.attributes.position;let _=0;if(u!==null){const v=u.array;_=u.version;for(let M=0,x=v.length;M<x;M+=3){const U=v[M+0],R=v[M+1],T=v[M+2];h.push(U,R,R,T,T,U)}}else if(g!==void 0){const v=g.array;_=g.version;for(let M=0,x=v.length/3-1;M<x;M+=3){const U=M+0,R=M+1,T=M+2;h.push(U,R,R,T,T,U)}}else return;const m=new(Od(h)?Xd:Vd)(h,1);m.version=_;const p=s.get(f);p&&t.remove(p),s.set(f,m)}function d(f){const h=s.get(f);if(h){const u=f.index;u!==null&&h.version<u.version&&l(f)}else l(f);return s.get(f)}return{get:r,update:c,getWireframeAttribute:d}}function M_(n,t,e){let i;function a(h){i=h}let s,o;function r(h){s=h.type,o=h.bytesPerElement}function c(h,u){n.drawElements(i,u,s,h*o),e.update(u,i,1)}function l(h,u,g){g!==0&&(n.drawElementsInstanced(i,u,s,h*o,g),e.update(u,i,g))}function d(h,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,h,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,i,1)}function f(h,u,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)l(h[p]/o,u[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,u,0,s,h,0,_,0,g);let p=0;for(let v=0;v<g;v++)p+=u[v]*_[v];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=f}function y_(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function S_(n,t,e){const i=new WeakMap,a=new Me;function s(o,r,c){const l=o.morphTargetInfluences,d=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=d!==void 0?d.length:0;let h=i.get(r);if(h===void 0||h.count!==f){let y=function(){w.dispose(),i.delete(r),r.removeEventListener("dispose",y)};var u=y;h!==void 0&&h.texture.dispose();const g=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],v=r.morphAttributes.normal||[],M=r.morphAttributes.color||[];let x=0;g===!0&&(x=1),_===!0&&(x=2),m===!0&&(x=3);let U=r.attributes.position.count*x,R=1;U>t.maxTextureSize&&(R=Math.ceil(U/t.maxTextureSize),U=t.maxTextureSize);const T=new Float32Array(U*R*4*f),w=new Hd(T,U,R,f);w.type=zn,w.needsUpdate=!0;const b=x*4;for(let D=0;D<f;D++){const B=p[D],N=v[D],V=M[D],P=U*R*4*D;for(let A=0;A<B.count;A++){const X=A*b;g===!0&&(a.fromBufferAttribute(B,A),T[P+X+0]=a.x,T[P+X+1]=a.y,T[P+X+2]=a.z,T[P+X+3]=0),_===!0&&(a.fromBufferAttribute(N,A),T[P+X+4]=a.x,T[P+X+5]=a.y,T[P+X+6]=a.z,T[P+X+7]=0),m===!0&&(a.fromBufferAttribute(V,A),T[P+X+8]=a.x,T[P+X+9]=a.y,T[P+X+10]=a.z,T[P+X+11]=V.itemSize===4?a.w:1)}}h={count:f,texture:w,size:new ae(U,R)},i.set(r,h),r.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=r.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function b_(n,t,e,i){let a=new WeakMap;function s(c){const l=i.render.frame,d=c.geometry,f=t.get(c,d);if(a.get(f)!==l&&(t.update(f),a.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),a.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;a.get(h)!==l&&(h.update(),a.set(h,l))}return f}function o(){a=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}class jd extends $e{constructor(t,e,i,a,s,o,r,c,l,d=Wi){if(d!==Wi&&d!==Ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Wi&&(i=Si),i===void 0&&d===Ki&&(i=ji),super(null,a,s,o,r,c,d,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:xn,this.minFilter=c!==void 0?c:xn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Kd=new $e,Pl=new jd(1,1),Jd=new Hd,Qd=new lm,th=new Yd,Dl=[],Ll=[],Il=new Float32Array(16),kl=new Float32Array(9),Ul=new Float32Array(4);function na(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Dl[a];if(s===void 0&&(s=new Float32Array(a),Dl[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function Ce(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Pe(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Fs(n,t){let e=Ll[t];e===void 0&&(e=new Int32Array(t),Ll[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function E_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function w_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2fv(this.addr,t),Pe(e,t)}}function T_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ce(e,t))return;n.uniform3fv(this.addr,t),Pe(e,t)}}function A_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4fv(this.addr,t),Pe(e,t)}}function R_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,i))return;Ul.set(i),n.uniformMatrix2fv(this.addr,!1,Ul),Pe(e,i)}}function C_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,i))return;kl.set(i),n.uniformMatrix3fv(this.addr,!1,kl),Pe(e,i)}}function P_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,i))return;Il.set(i),n.uniformMatrix4fv(this.addr,!1,Il),Pe(e,i)}}function D_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function L_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2iv(this.addr,t),Pe(e,t)}}function I_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;n.uniform3iv(this.addr,t),Pe(e,t)}}function k_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4iv(this.addr,t),Pe(e,t)}}function U_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function F_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2uiv(this.addr,t),Pe(e,t)}}function N_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;n.uniform3uiv(this.addr,t),Pe(e,t)}}function z_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4uiv(this.addr,t),Pe(e,t)}}function O_(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Pl.compareFunction=zd,s=Pl):s=Kd,e.setTexture2D(t||s,a)}function B_(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||Qd,a)}function H_(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||th,a)}function G_(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Jd,a)}function V_(n){switch(n){case 5126:return E_;case 35664:return w_;case 35665:return T_;case 35666:return A_;case 35674:return R_;case 35675:return C_;case 35676:return P_;case 5124:case 35670:return D_;case 35667:case 35671:return L_;case 35668:case 35672:return I_;case 35669:case 35673:return k_;case 5125:return U_;case 36294:return F_;case 36295:return N_;case 36296:return z_;case 35678:case 36198:case 36298:case 36306:case 35682:return O_;case 35679:case 36299:case 36307:return B_;case 35680:case 36300:case 36308:case 36293:return H_;case 36289:case 36303:case 36311:case 36292:return G_}}function X_(n,t){n.uniform1fv(this.addr,t)}function W_(n,t){const e=na(t,this.size,2);n.uniform2fv(this.addr,e)}function $_(n,t){const e=na(t,this.size,3);n.uniform3fv(this.addr,e)}function Y_(n,t){const e=na(t,this.size,4);n.uniform4fv(this.addr,e)}function Z_(n,t){const e=na(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function q_(n,t){const e=na(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function j_(n,t){const e=na(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function K_(n,t){n.uniform1iv(this.addr,t)}function J_(n,t){n.uniform2iv(this.addr,t)}function Q_(n,t){n.uniform3iv(this.addr,t)}function tx(n,t){n.uniform4iv(this.addr,t)}function ex(n,t){n.uniform1uiv(this.addr,t)}function nx(n,t){n.uniform2uiv(this.addr,t)}function ix(n,t){n.uniform3uiv(this.addr,t)}function ax(n,t){n.uniform4uiv(this.addr,t)}function sx(n,t,e){const i=this.cache,a=t.length,s=Fs(e,a);Ce(i,s)||(n.uniform1iv(this.addr,s),Pe(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||Kd,s[o])}function ox(n,t,e){const i=this.cache,a=t.length,s=Fs(e,a);Ce(i,s)||(n.uniform1iv(this.addr,s),Pe(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||Qd,s[o])}function rx(n,t,e){const i=this.cache,a=t.length,s=Fs(e,a);Ce(i,s)||(n.uniform1iv(this.addr,s),Pe(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||th,s[o])}function cx(n,t,e){const i=this.cache,a=t.length,s=Fs(e,a);Ce(i,s)||(n.uniform1iv(this.addr,s),Pe(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Jd,s[o])}function lx(n){switch(n){case 5126:return X_;case 35664:return W_;case 35665:return $_;case 35666:return Y_;case 35674:return Z_;case 35675:return q_;case 35676:return j_;case 5124:case 35670:return K_;case 35667:case 35671:return J_;case 35668:case 35672:return Q_;case 35669:case 35673:return tx;case 5125:return ex;case 36294:return nx;case 36295:return ix;case 36296:return ax;case 35678:case 36198:case 36298:case 36306:case 35682:return sx;case 35679:case 36299:case 36307:return ox;case 35680:case 36300:case 36308:case 36293:return rx;case 36289:case 36303:case 36311:case 36292:return cx}}class dx{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=V_(e.type)}}class hx{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=lx(e.type)}}class ux{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const Po=/(\w+)(\])?(\[|\.)?/g;function Fl(n,t){n.seq.push(t),n.map[t.id]=t}function fx(n,t,e){const i=n.name,a=i.length;for(Po.lastIndex=0;;){const s=Po.exec(i),o=Po.lastIndex;let r=s[1];const c=s[2]==="]",l=s[3];if(c&&(r=r|0),l===void 0||l==="["&&o+2===a){Fl(e,l===void 0?new dx(r,n,t):new hx(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new ux(r),Fl(e,f)),e=f}}}class ps{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);fx(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Nl(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const px=37297;let mx=0;function gx(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const zl=new qt;function _x(n){oe._getMatrix(zl,oe.workingColorSpace,n);const t=`mat3( ${zl.elements.map(e=>e.toFixed(4))} )`;switch(oe.getTransfer(n)){case Is:return[t,"LinearTransferOETF"];case de:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Ol(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+gx(n.getShaderSource(t),o)}else return a}function xx(n,t){const e=_x(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function vx(n,t){let e;switch(t){case Fp:e="Linear";break;case Np:e="Reinhard";break;case zp:e="Cineon";break;case Op:e="ACESFilmic";break;case Hp:e="AgX";break;case Gp:e="Neutral";break;case Bp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ts=new j;function Mx(){oe.getLuminanceCoefficients(ts);const n=ts.x.toFixed(4),t=ts.y.toFixed(4),e=ts.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
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
#define LOW_PRECISION`),t}function Cx(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Ed?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===wd?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Un&&(t="SHADOWMAP_TYPE_VSM"),t}function Px(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Zi:case qi:t="ENVMAP_TYPE_CUBE";break;case Ls:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Dx(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case qi:t="ENVMAP_MODE_REFRACTION";break}return t}function Lx(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Qr:t="ENVMAP_BLENDING_MULTIPLY";break;case kp:t="ENVMAP_BLENDING_MIX";break;case Up:t="ENVMAP_BLENDING_ADD";break}return t}function Ix(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function kx(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const c=Cx(e),l=Px(e),d=Dx(e),f=Lx(e),h=Ix(e),u=yx(e),g=Sx(s),_=a.createProgram();let m,p,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(_a).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(_a).join(`
`),p.length>0&&(p+=`
`)):(m=[Vl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_a).join(`
`),p=[Vl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Qn?"#define TONE_MAPPING":"",e.toneMapping!==Qn?Kt.tonemapping_pars_fragment:"",e.toneMapping!==Qn?vx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,xx("linearToOutputTexel",e.outputColorSpace),Mx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(_a).join(`
`)),o=Br(o),o=Bl(o,e),o=Hl(o,e),r=Br(r),r=Bl(r,e),r=Hl(r,e),o=Gl(o),r=Gl(r),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===nl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===nl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=v+m+o,x=v+p+r,U=Nl(a,a.VERTEX_SHADER,M),R=Nl(a,a.FRAGMENT_SHADER,x);a.attachShader(_,U),a.attachShader(_,R),e.index0AttributeName!==void 0?a.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function T(D){if(n.debug.checkShaderErrors){const B=a.getProgramInfoLog(_).trim(),N=a.getShaderInfoLog(U).trim(),V=a.getShaderInfoLog(R).trim();let P=!0,A=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(P=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,_,U,R);else{const X=Ol(a,U,"vertex"),H=Ol(a,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+B+`
`+X+`
`+H)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(N===""||V==="")&&(A=!1);A&&(D.diagnostics={runnable:P,programLog:B,vertexShader:{log:N,prefix:m},fragmentShader:{log:V,prefix:p}})}a.deleteShader(U),a.deleteShader(R),w=new ps(a,_),b=bx(a,_)}let w;this.getUniforms=function(){return w===void 0&&T(this),w};let b;this.getAttributes=function(){return b===void 0&&T(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=a.getProgramParameter(_,px)),y},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=mx++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=U,this.fragmentShader=R,this}let Ux=0;class Fx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Nx(t),e.set(t,i)),i}}class Nx{constructor(t){this.id=Ux++,this.code=t,this.usedTimes=0}}function zx(n,t,e,i,a,s,o){const r=new rc,c=new Fx,l=new Set,d=[],f=a.logarithmicDepthBuffer,h=a.vertexTextures;let u=a.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,y,D,B,N){const V=B.fog,P=N.geometry,A=b.isMeshStandardMaterial?B.environment:null,X=(b.isMeshStandardMaterial?e:t).get(b.envMap||A),H=X&&X.mapping===Ls?X.image.height:null,q=g[b.type];b.precision!==null&&(u=a.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const Q=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,dt=Q!==void 0?Q.length:0;let ft=0;P.morphAttributes.position!==void 0&&(ft=1),P.morphAttributes.normal!==void 0&&(ft=2),P.morphAttributes.color!==void 0&&(ft=3);let vt,Y,et,_t;if(q){const $t=bn[q];vt=$t.vertexShader,Y=$t.fragmentShader}else vt=b.vertexShader,Y=b.fragmentShader,c.update(b),et=c.getVertexShaderID(b),_t=c.getFragmentShaderID(b);const K=n.getRenderTarget(),pt=n.state.buffers.depth.getReversed(),Pt=N.isInstancedMesh===!0,At=N.isBatchedMesh===!0,zt=!!b.map,St=!!b.matcap,bt=!!X,O=!!b.aoMap,Zt=!!b.lightMap,Dt=!!b.bumpMap,Ct=!!b.normalMap,wt=!!b.displacementMap,yt=!!b.emissiveMap,Tt=!!b.metalnessMap,C=!!b.roughnessMap,S=b.anisotropy>0,G=b.clearcoat>0,ct=b.dispersion>0,lt=b.iridescence>0,ot=b.sheen>0,It=b.transmission>0,tt=S&&!!b.anisotropyMap,xt=G&&!!b.clearcoatMap,Ht=G&&!!b.clearcoatNormalMap,at=G&&!!b.clearcoatRoughnessMap,Mt=lt&&!!b.iridescenceMap,z=lt&&!!b.iridescenceThicknessMap,nt=ot&&!!b.sheenColorMap,ut=ot&&!!b.sheenRoughnessMap,Ut=!!b.specularMap,Nt=!!b.specularColorMap,Z=!!b.specularIntensityMap,L=It&&!!b.transmissionMap,it=It&&!!b.thicknessMap,$=!!b.gradientMap,J=!!b.alphaMap,mt=b.alphaTest>0,gt=!!b.alphaHash,Ot=!!b.extensions;let Yt=Qn;b.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Yt=n.toneMapping);const Qt={shaderID:q,shaderType:b.type,shaderName:b.name,vertexShader:vt,fragmentShader:Y,defines:b.defines,customVertexShaderID:et,customFragmentShaderID:_t,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:At,batchingColor:At&&N._colorsTexture!==null,instancing:Pt,instancingColor:Pt&&N.instanceColor!==null,instancingMorph:Pt&&N.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Qi,alphaToCoverage:!!b.alphaToCoverage,map:zt,matcap:St,envMap:bt,envMapMode:bt&&X.mapping,envMapCubeUVHeight:H,aoMap:O,lightMap:Zt,bumpMap:Dt,normalMap:Ct,displacementMap:h&&wt,emissiveMap:yt,normalMapObjectSpace:Ct&&b.normalMapType===$p,normalMapTangentSpace:Ct&&b.normalMapType===Nd,metalnessMap:Tt,roughnessMap:C,anisotropy:S,anisotropyMap:tt,clearcoat:G,clearcoatMap:xt,clearcoatNormalMap:Ht,clearcoatRoughnessMap:at,dispersion:ct,iridescence:lt,iridescenceMap:Mt,iridescenceThicknessMap:z,sheen:ot,sheenColorMap:nt,sheenRoughnessMap:ut,specularMap:Ut,specularColorMap:Nt,specularIntensityMap:Z,transmission:It,transmissionMap:L,thicknessMap:it,gradientMap:$,opaque:b.transparent===!1&&b.blending===Xi&&b.alphaToCoverage===!1,alphaMap:J,alphaTest:mt,alphaHash:gt,combine:b.combine,mapUv:zt&&_(b.map.channel),aoMapUv:O&&_(b.aoMap.channel),lightMapUv:Zt&&_(b.lightMap.channel),bumpMapUv:Dt&&_(b.bumpMap.channel),normalMapUv:Ct&&_(b.normalMap.channel),displacementMapUv:wt&&_(b.displacementMap.channel),emissiveMapUv:yt&&_(b.emissiveMap.channel),metalnessMapUv:Tt&&_(b.metalnessMap.channel),roughnessMapUv:C&&_(b.roughnessMap.channel),anisotropyMapUv:tt&&_(b.anisotropyMap.channel),clearcoatMapUv:xt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Ht&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:at&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Mt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:z&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:nt&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:ut&&_(b.sheenRoughnessMap.channel),specularMapUv:Ut&&_(b.specularMap.channel),specularColorMapUv:Nt&&_(b.specularColorMap.channel),specularIntensityMapUv:Z&&_(b.specularIntensityMap.channel),transmissionMapUv:L&&_(b.transmissionMap.channel),thicknessMapUv:it&&_(b.thicknessMap.channel),alphaMapUv:J&&_(b.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(Ct||S),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!P.attributes.uv&&(zt||J),fog:!!V,useFog:b.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:pt,skinning:N.isSkinnedMesh===!0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:dt,morphTextureStride:ft,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:Yt,decodeVideoTexture:zt&&b.map.isVideoTexture===!0&&oe.getTransfer(b.map.colorSpace)===de,decodeVideoTextureEmissive:yt&&b.emissiveMap.isVideoTexture===!0&&oe.getTransfer(b.emissiveMap.colorSpace)===de,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ie,flipSided:b.side===We,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ot&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ot&&b.extensions.multiDraw===!0||At)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Qt.vertexUv1s=l.has(1),Qt.vertexUv2s=l.has(2),Qt.vertexUv3s=l.has(3),l.clear(),Qt}function p(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const D in b.defines)y.push(D),y.push(b.defines[D]);return b.isRawShaderMaterial===!1&&(v(y,b),M(y,b),y.push(n.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function v(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function M(b,y){r.disableAll(),y.supportsVertexTextures&&r.enable(0),y.instancing&&r.enable(1),y.instancingColor&&r.enable(2),y.instancingMorph&&r.enable(3),y.matcap&&r.enable(4),y.envMap&&r.enable(5),y.normalMapObjectSpace&&r.enable(6),y.normalMapTangentSpace&&r.enable(7),y.clearcoat&&r.enable(8),y.iridescence&&r.enable(9),y.alphaTest&&r.enable(10),y.vertexColors&&r.enable(11),y.vertexAlphas&&r.enable(12),y.vertexUv1s&&r.enable(13),y.vertexUv2s&&r.enable(14),y.vertexUv3s&&r.enable(15),y.vertexTangents&&r.enable(16),y.anisotropy&&r.enable(17),y.alphaHash&&r.enable(18),y.batching&&r.enable(19),y.dispersion&&r.enable(20),y.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),y.fog&&r.enable(0),y.useFog&&r.enable(1),y.flatShading&&r.enable(2),y.logarithmicDepthBuffer&&r.enable(3),y.reverseDepthBuffer&&r.enable(4),y.skinning&&r.enable(5),y.morphTargets&&r.enable(6),y.morphNormals&&r.enable(7),y.morphColors&&r.enable(8),y.premultipliedAlpha&&r.enable(9),y.shadowMapEnabled&&r.enable(10),y.doubleSided&&r.enable(11),y.flipSided&&r.enable(12),y.useDepthPacking&&r.enable(13),y.dithering&&r.enable(14),y.transmission&&r.enable(15),y.sheen&&r.enable(16),y.opaque&&r.enable(17),y.pointsUvs&&r.enable(18),y.decodeVideoTexture&&r.enable(19),y.decodeVideoTextureEmissive&&r.enable(20),y.alphaToCoverage&&r.enable(21),b.push(r.mask)}function x(b){const y=g[b.type];let D;if(y){const B=bn[y];D=ym.clone(B.uniforms)}else D=b.uniforms;return D}function U(b,y){let D;for(let B=0,N=d.length;B<N;B++){const V=d[B];if(V.cacheKey===y){D=V,++D.usedTimes;break}}return D===void 0&&(D=new kx(n,y,b,s),d.push(D)),D}function R(b){if(--b.usedTimes===0){const y=d.indexOf(b);d[y]=d[d.length-1],d.pop(),b.destroy()}}function T(b){c.remove(b)}function w(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:U,releaseProgram:R,releaseShaderCache:T,programs:d,dispose:w}}function Ox(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,c){n.get(o)[r]=c}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function Bx(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Xl(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Wl(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(f,h,u,g,_,m){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:h,material:u,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},n[t]=p):(p.id=f.id,p.object=f,p.geometry=h,p.material=u,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=_,p.group=m),t++,p}function r(f,h,u,g,_,m){const p=o(f,h,u,g,_,m);u.transmission>0?i.push(p):u.transparent===!0?a.push(p):e.push(p)}function c(f,h,u,g,_,m){const p=o(f,h,u,g,_,m);u.transmission>0?i.unshift(p):u.transparent===!0?a.unshift(p):e.unshift(p)}function l(f,h){e.length>1&&e.sort(f||Bx),i.length>1&&i.sort(h||Xl),a.length>1&&a.sort(h||Xl)}function d(){for(let f=t,h=n.length;f<h;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:c,finish:d,sort:l}}function Hx(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new Wl,n.set(i,[o])):a>=s.length?(o=new Wl,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function Gx(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new j,color:new Wt};break;case"SpotLight":e={position:new j,direction:new j,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new j,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new j,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":e={color:new Wt,position:new j,halfWidth:new j,halfHeight:new j};break}return n[t.id]=e,e}}}function Vx(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Xx=0;function Wx(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function $x(n){const t=new Gx,e=Vx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new j);const a=new j,s=new me,o=new me;function r(l){let d=0,f=0,h=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let u=0,g=0,_=0,m=0,p=0,v=0,M=0,x=0,U=0,R=0,T=0;l.sort(Wx);for(let b=0,y=l.length;b<y;b++){const D=l[b],B=D.color,N=D.intensity,V=D.distance,P=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=B.r*N,f+=B.g*N,h+=B.b*N;else if(D.isLightProbe){for(let A=0;A<9;A++)i.probe[A].addScaledVector(D.sh.coefficients[A],N);T++}else if(D.isDirectionalLight){const A=t.get(D);if(A.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const X=D.shadow,H=e.get(D);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,i.directionalShadow[u]=H,i.directionalShadowMap[u]=P,i.directionalShadowMatrix[u]=D.shadow.matrix,v++}i.directional[u]=A,u++}else if(D.isSpotLight){const A=t.get(D);A.position.setFromMatrixPosition(D.matrixWorld),A.color.copy(B).multiplyScalar(N),A.distance=V,A.coneCos=Math.cos(D.angle),A.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),A.decay=D.decay,i.spot[_]=A;const X=D.shadow;if(D.map&&(i.spotLightMap[U]=D.map,U++,X.updateMatrices(D),D.castShadow&&R++),i.spotLightMatrix[_]=X.matrix,D.castShadow){const H=e.get(D);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,i.spotShadow[_]=H,i.spotShadowMap[_]=P,x++}_++}else if(D.isRectAreaLight){const A=t.get(D);A.color.copy(B).multiplyScalar(N),A.halfWidth.set(D.width*.5,0,0),A.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=A,m++}else if(D.isPointLight){const A=t.get(D);if(A.color.copy(D.color).multiplyScalar(D.intensity),A.distance=D.distance,A.decay=D.decay,D.castShadow){const X=D.shadow,H=e.get(D);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,H.shadowCameraNear=X.camera.near,H.shadowCameraFar=X.camera.far,i.pointShadow[g]=H,i.pointShadowMap[g]=P,i.pointShadowMatrix[g]=D.shadow.matrix,M++}i.point[g]=A,g++}else if(D.isHemisphereLight){const A=t.get(D);A.skyColor.copy(D.color).multiplyScalar(N),A.groundColor.copy(D.groundColor).multiplyScalar(N),i.hemi[p]=A,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Rt.LTC_FLOAT_1,i.rectAreaLTC2=Rt.LTC_FLOAT_2):(i.rectAreaLTC1=Rt.LTC_HALF_1,i.rectAreaLTC2=Rt.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=h;const w=i.hash;(w.directionalLength!==u||w.pointLength!==g||w.spotLength!==_||w.rectAreaLength!==m||w.hemiLength!==p||w.numDirectionalShadows!==v||w.numPointShadows!==M||w.numSpotShadows!==x||w.numSpotMaps!==U||w.numLightProbes!==T)&&(i.directional.length=u,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=x+U-R,i.spotLightMap.length=U,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=T,w.directionalLength=u,w.pointLength=g,w.spotLength=_,w.rectAreaLength=m,w.hemiLength=p,w.numDirectionalShadows=v,w.numPointShadows=M,w.numSpotShadows=x,w.numSpotMaps=U,w.numLightProbes=T,i.version=Xx++)}function c(l,d){let f=0,h=0,u=0,g=0,_=0;const m=d.matrixWorldInverse;for(let p=0,v=l.length;p<v;p++){const M=l[p];if(M.isDirectionalLight){const x=i.directional[f];x.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),x.direction.sub(a),x.direction.transformDirection(m),f++}else if(M.isSpotLight){const x=i.spot[u];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),x.direction.sub(a),x.direction.transformDirection(m),u++}else if(M.isRectAreaLight){const x=i.rectArea[g];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),o.identity(),s.copy(M.matrixWorld),s.premultiply(m),o.extractRotation(s),x.halfWidth.set(M.width*.5,0,0),x.halfHeight.set(0,M.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){const x=i.point[h];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),h++}else if(M.isHemisphereLight){const x=i.hemi[_];x.direction.setFromMatrixPosition(M.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:r,setupView:c,state:i}}function $l(n){const t=new $x(n),e=[],i=[];function a(d){l.camera=d,e.length=0,i.length=0}function s(d){e.push(d)}function o(d){i.push(d)}function r(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:l,setupLights:r,setupLightsView:c,pushLight:s,pushShadow:o}}function Yx(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new $l(n),t.set(a,[r])):s>=o.length?(r=new $l(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class Zx extends ea{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Xp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class qx extends ea{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const jx=`void main() {
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
}`;function Jx(n,t,e){let i=new cc;const a=new ae,s=new ae,o=new Me,r=new Zx({depthPacking:Wp}),c=new qx,l={},d=e.maxTextureSize,f={[ti]:We,[We]:ti,[Ie]:Ie},h=new ei({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ae},radius:{value:4}},vertexShader:jx,fragmentShader:Kx}),u=h.clone();u.defines.HORIZONTAL_PASS=1;const g=new He;g.setAttribute("position",new Ye(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new fe(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ed;let p=this.type;this.render=function(R,T,w){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const b=n.getRenderTarget(),y=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),B=n.state;B.setBlending(Jn),B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const N=p!==Un&&this.type===Un,V=p===Un&&this.type!==Un;for(let P=0,A=R.length;P<A;P++){const X=R[P],H=X.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;a.copy(H.mapSize);const q=H.getFrameExtents();if(a.multiply(q),s.copy(H.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(s.x=Math.floor(d/q.x),a.x=s.x*q.x,H.mapSize.x=s.x),a.y>d&&(s.y=Math.floor(d/q.y),a.y=s.y*q.y,H.mapSize.y=s.y)),H.map===null||N===!0||V===!0){const dt=this.type!==Un?{minFilter:xn,magFilter:xn}:{};H.map!==null&&H.map.dispose(),H.map=new bi(a.x,a.y,dt),H.map.texture.name=X.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();const Q=H.getViewportCount();for(let dt=0;dt<Q;dt++){const ft=H.getViewport(dt);o.set(s.x*ft.x,s.y*ft.y,s.x*ft.z,s.y*ft.w),B.viewport(o),H.updateMatrices(X,dt),i=H.getFrustum(),x(T,w,H.camera,X,this.type)}H.isPointLightShadow!==!0&&this.type===Un&&v(H,w),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(b,y,D)};function v(R,T){const w=t.update(_);h.defines.VSM_SAMPLES!==R.blurSamples&&(h.defines.VSM_SAMPLES=R.blurSamples,u.defines.VSM_SAMPLES=R.blurSamples,h.needsUpdate=!0,u.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new bi(a.x,a.y)),h.uniforms.shadow_pass.value=R.map.texture,h.uniforms.resolution.value=R.mapSize,h.uniforms.radius.value=R.radius,n.setRenderTarget(R.mapPass),n.clear(),n.renderBufferDirect(T,null,w,h,_,null),u.uniforms.shadow_pass.value=R.mapPass.texture,u.uniforms.resolution.value=R.mapSize,u.uniforms.radius.value=R.radius,n.setRenderTarget(R.map),n.clear(),n.renderBufferDirect(T,null,w,u,_,null)}function M(R,T,w,b){let y=null;const D=w.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(D!==void 0)y=D;else if(y=w.isPointLight===!0?c:r,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const B=y.uuid,N=T.uuid;let V=l[B];V===void 0&&(V={},l[B]=V);let P=V[N];P===void 0&&(P=y.clone(),V[N]=P,T.addEventListener("dispose",U)),y=P}if(y.visible=T.visible,y.wireframe=T.wireframe,b===Un?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:f[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,w.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const B=n.properties.get(y);B.light=w}return y}function x(R,T,w,b,y){if(R.visible===!1)return;if(R.layers.test(T.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&y===Un)&&(!R.frustumCulled||i.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,R.matrixWorld);const N=t.update(R),V=R.material;if(Array.isArray(V)){const P=N.groups;for(let A=0,X=P.length;A<X;A++){const H=P[A],q=V[H.materialIndex];if(q&&q.visible){const Q=M(R,q,b,y);R.onBeforeShadow(n,R,T,w,N,Q,H),n.renderBufferDirect(w,null,N,Q,R,H),R.onAfterShadow(n,R,T,w,N,Q,H)}}}else if(V.visible){const P=M(R,V,b,y);R.onBeforeShadow(n,R,T,w,N,P,null),n.renderBufferDirect(w,null,N,P,R,null),R.onAfterShadow(n,R,T,w,N,P,null)}}const B=R.children;for(let N=0,V=B.length;N<V;N++)x(B[N],T,w,b,y)}function U(R){R.target.removeEventListener("dispose",U);for(const w in l){const b=l[w],y=R.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const Qx={[nr]:ir,[ar]:rr,[sr]:cr,[Yi]:or,[ir]:nr,[rr]:ar,[cr]:sr,[or]:Yi};function tv(n,t){function e(){let L=!1;const it=new Me;let $=null;const J=new Me(0,0,0,0);return{setMask:function(mt){$!==mt&&!L&&(n.colorMask(mt,mt,mt,mt),$=mt)},setLocked:function(mt){L=mt},setClear:function(mt,gt,Ot,Yt,Qt){Qt===!0&&(mt*=Yt,gt*=Yt,Ot*=Yt),it.set(mt,gt,Ot,Yt),J.equals(it)===!1&&(n.clearColor(mt,gt,Ot,Yt),J.copy(it))},reset:function(){L=!1,$=null,J.set(-1,0,0,0)}}}function i(){let L=!1,it=!1,$=null,J=null,mt=null;return{setReversed:function(gt){if(it!==gt){const Ot=t.get("EXT_clip_control");it?Ot.clipControlEXT(Ot.LOWER_LEFT_EXT,Ot.ZERO_TO_ONE_EXT):Ot.clipControlEXT(Ot.LOWER_LEFT_EXT,Ot.NEGATIVE_ONE_TO_ONE_EXT);const Yt=mt;mt=null,this.setClear(Yt)}it=gt},getReversed:function(){return it},setTest:function(gt){gt?K(n.DEPTH_TEST):pt(n.DEPTH_TEST)},setMask:function(gt){$!==gt&&!L&&(n.depthMask(gt),$=gt)},setFunc:function(gt){if(it&&(gt=Qx[gt]),J!==gt){switch(gt){case nr:n.depthFunc(n.NEVER);break;case ir:n.depthFunc(n.ALWAYS);break;case ar:n.depthFunc(n.LESS);break;case Yi:n.depthFunc(n.LEQUAL);break;case sr:n.depthFunc(n.EQUAL);break;case or:n.depthFunc(n.GEQUAL);break;case rr:n.depthFunc(n.GREATER);break;case cr:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}J=gt}},setLocked:function(gt){L=gt},setClear:function(gt){mt!==gt&&(it&&(gt=1-gt),n.clearDepth(gt),mt=gt)},reset:function(){L=!1,$=null,J=null,mt=null,it=!1}}}function a(){let L=!1,it=null,$=null,J=null,mt=null,gt=null,Ot=null,Yt=null,Qt=null;return{setTest:function($t){L||($t?K(n.STENCIL_TEST):pt(n.STENCIL_TEST))},setMask:function($t){it!==$t&&!L&&(n.stencilMask($t),it=$t)},setFunc:function($t,le,he){($!==$t||J!==le||mt!==he)&&(n.stencilFunc($t,le,he),$=$t,J=le,mt=he)},setOp:function($t,le,he){(gt!==$t||Ot!==le||Yt!==he)&&(n.stencilOp($t,le,he),gt=$t,Ot=le,Yt=he)},setLocked:function($t){L=$t},setClear:function($t){Qt!==$t&&(n.clearStencil($t),Qt=$t)},reset:function(){L=!1,it=null,$=null,J=null,mt=null,gt=null,Ot=null,Yt=null,Qt=null}}}const s=new e,o=new i,r=new a,c=new WeakMap,l=new WeakMap;let d={},f={},h=new WeakMap,u=[],g=null,_=!1,m=null,p=null,v=null,M=null,x=null,U=null,R=null,T=new Wt(0,0,0),w=0,b=!1,y=null,D=null,B=null,N=null,V=null;const P=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let A=!1,X=0;const H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(H)[1]),A=X>=1):H.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),A=X>=2);let q=null,Q={};const dt=n.getParameter(n.SCISSOR_BOX),ft=n.getParameter(n.VIEWPORT),vt=new Me().fromArray(dt),Y=new Me().fromArray(ft);function et(L,it,$,J){const mt=new Uint8Array(4),gt=n.createTexture();n.bindTexture(L,gt),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ot=0;Ot<$;Ot++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(it,0,n.RGBA,1,1,J,0,n.RGBA,n.UNSIGNED_BYTE,mt):n.texImage2D(it+Ot,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,mt);return gt}const _t={};_t[n.TEXTURE_2D]=et(n.TEXTURE_2D,n.TEXTURE_2D,1),_t[n.TEXTURE_CUBE_MAP]=et(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),_t[n.TEXTURE_2D_ARRAY]=et(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),_t[n.TEXTURE_3D]=et(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),K(n.DEPTH_TEST),o.setFunc(Yi),Dt(!1),Ct(jc),K(n.CULL_FACE),O(Jn);function K(L){d[L]!==!0&&(n.enable(L),d[L]=!0)}function pt(L){d[L]!==!1&&(n.disable(L),d[L]=!1)}function Pt(L,it){return f[L]!==it?(n.bindFramebuffer(L,it),f[L]=it,L===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=it),L===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=it),!0):!1}function At(L,it){let $=u,J=!1;if(L){$=h.get(it),$===void 0&&($=[],h.set(it,$));const mt=L.textures;if($.length!==mt.length||$[0]!==n.COLOR_ATTACHMENT0){for(let gt=0,Ot=mt.length;gt<Ot;gt++)$[gt]=n.COLOR_ATTACHMENT0+gt;$.length=mt.length,J=!0}}else $[0]!==n.BACK&&($[0]=n.BACK,J=!0);J&&n.drawBuffers($)}function zt(L){return g!==L?(n.useProgram(L),g=L,!0):!1}const St={[gi]:n.FUNC_ADD,[_p]:n.FUNC_SUBTRACT,[xp]:n.FUNC_REVERSE_SUBTRACT};St[vp]=n.MIN,St[Mp]=n.MAX;const bt={[yp]:n.ZERO,[Sp]:n.ONE,[bp]:n.SRC_COLOR,[tr]:n.SRC_ALPHA,[Cp]:n.SRC_ALPHA_SATURATE,[Ap]:n.DST_COLOR,[wp]:n.DST_ALPHA,[Ep]:n.ONE_MINUS_SRC_COLOR,[er]:n.ONE_MINUS_SRC_ALPHA,[Rp]:n.ONE_MINUS_DST_COLOR,[Tp]:n.ONE_MINUS_DST_ALPHA,[Pp]:n.CONSTANT_COLOR,[Dp]:n.ONE_MINUS_CONSTANT_COLOR,[Lp]:n.CONSTANT_ALPHA,[Ip]:n.ONE_MINUS_CONSTANT_ALPHA};function O(L,it,$,J,mt,gt,Ot,Yt,Qt,$t){if(L===Jn){_===!0&&(pt(n.BLEND),_=!1);return}if(_===!1&&(K(n.BLEND),_=!0),L!==gp){if(L!==m||$t!==b){if((p!==gi||x!==gi)&&(n.blendEquation(n.FUNC_ADD),p=gi,x=gi),$t)switch(L){case Xi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Kc:n.blendFunc(n.ONE,n.ONE);break;case Jc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Qc:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Xi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Kc:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Jc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Qc:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}v=null,M=null,U=null,R=null,T.set(0,0,0),w=0,m=L,b=$t}return}mt=mt||it,gt=gt||$,Ot=Ot||J,(it!==p||mt!==x)&&(n.blendEquationSeparate(St[it],St[mt]),p=it,x=mt),($!==v||J!==M||gt!==U||Ot!==R)&&(n.blendFuncSeparate(bt[$],bt[J],bt[gt],bt[Ot]),v=$,M=J,U=gt,R=Ot),(Yt.equals(T)===!1||Qt!==w)&&(n.blendColor(Yt.r,Yt.g,Yt.b,Qt),T.copy(Yt),w=Qt),m=L,b=!1}function Zt(L,it){L.side===Ie?pt(n.CULL_FACE):K(n.CULL_FACE);let $=L.side===We;it&&($=!$),Dt($),L.blending===Xi&&L.transparent===!1?O(Jn):O(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),s.setMask(L.colorWrite);const J=L.stencilWrite;r.setTest(J),J&&(r.setMask(L.stencilWriteMask),r.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),r.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),yt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):pt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(L){y!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),y=L)}function Ct(L){L!==pp?(K(n.CULL_FACE),L!==D&&(L===jc?n.cullFace(n.BACK):L===mp?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):pt(n.CULL_FACE),D=L}function wt(L){L!==B&&(A&&n.lineWidth(L),B=L)}function yt(L,it,$){L?(K(n.POLYGON_OFFSET_FILL),(N!==it||V!==$)&&(n.polygonOffset(it,$),N=it,V=$)):pt(n.POLYGON_OFFSET_FILL)}function Tt(L){L?K(n.SCISSOR_TEST):pt(n.SCISSOR_TEST)}function C(L){L===void 0&&(L=n.TEXTURE0+P-1),q!==L&&(n.activeTexture(L),q=L)}function S(L,it,$){$===void 0&&(q===null?$=n.TEXTURE0+P-1:$=q);let J=Q[$];J===void 0&&(J={type:void 0,texture:void 0},Q[$]=J),(J.type!==L||J.texture!==it)&&(q!==$&&(n.activeTexture($),q=$),n.bindTexture(L,it||_t[L]),J.type=L,J.texture=it)}function G(){const L=Q[q];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function ct(){try{n.compressedTexImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function lt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ot(){try{n.texSubImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function It(){try{n.texSubImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function tt(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ht(){try{n.texStorage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function at(){try{n.texStorage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Mt(){try{n.texImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function z(){try{n.texImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function nt(L){vt.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),vt.copy(L))}function ut(L){Y.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),Y.copy(L))}function Ut(L,it){let $=l.get(it);$===void 0&&($=new WeakMap,l.set(it,$));let J=$.get(L);J===void 0&&(J=n.getUniformBlockIndex(it,L.name),$.set(L,J))}function Nt(L,it){const J=l.get(it).get(L);c.get(it)!==J&&(n.uniformBlockBinding(it,J,L.__bindingPointIndex),c.set(it,J))}function Z(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},q=null,Q={},f={},h=new WeakMap,u=[],g=null,_=!1,m=null,p=null,v=null,M=null,x=null,U=null,R=null,T=new Wt(0,0,0),w=0,b=!1,y=null,D=null,B=null,N=null,V=null,vt.set(0,0,n.canvas.width,n.canvas.height),Y.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:K,disable:pt,bindFramebuffer:Pt,drawBuffers:At,useProgram:zt,setBlending:O,setMaterial:Zt,setFlipSided:Dt,setCullFace:Ct,setLineWidth:wt,setPolygonOffset:yt,setScissorTest:Tt,activeTexture:C,bindTexture:S,unbindTexture:G,compressedTexImage2D:ct,compressedTexImage3D:lt,texImage2D:Mt,texImage3D:z,updateUBOMapping:Ut,uniformBlockBinding:Nt,texStorage2D:Ht,texStorage3D:at,texSubImage2D:ot,texSubImage3D:It,compressedTexSubImage2D:tt,compressedTexSubImage3D:xt,scissor:nt,viewport:ut,reset:Z}}function Yl(n,t,e,i){const a=ev(i);switch(e){case Pd:return n*t;case Ld:return n*t;case Id:return n*t*2;case kd:return n*t/a.components*a.byteLength;case ic:return n*t/a.components*a.byteLength;case Ud:return n*t*2/a.components*a.byteLength;case ac:return n*t*2/a.components*a.byteLength;case Dd:return n*t*3/a.components*a.byteLength;case _n:return n*t*4/a.components*a.byteLength;case sc:return n*t*4/a.components*a.byteLength;case cs:case ls:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ds:case hs:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case pr:case gr:return Math.max(n,16)*Math.max(t,8)/4;case fr:case mr:return Math.max(n,8)*Math.max(t,8)/2;case _r:case xr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case vr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Mr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case yr:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Sr:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case br:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Er:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case wr:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Tr:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Ar:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Rr:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Cr:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Pr:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Dr:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Lr:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Ir:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case us:case kr:case Ur:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Fd:case Fr:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Nr:case zr:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ev(n){switch(n){case Hn:case Ad:return{byteLength:1,components:1};case ba:case Rd:case wa:return{byteLength:2,components:1};case ec:case nc:return{byteLength:2,components:4};case Si:case tc:case zn:return{byteLength:4,components:1};case Cd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function nv(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ae,d=new WeakMap;let f;const h=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,S){return u?new OffscreenCanvas(C,S):As("canvas")}function _(C,S,G){let ct=1;const lt=Tt(C);if((lt.width>G||lt.height>G)&&(ct=G/Math.max(lt.width,lt.height)),ct<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const ot=Math.floor(ct*lt.width),It=Math.floor(ct*lt.height);f===void 0&&(f=g(ot,It));const tt=S?g(ot,It):f;return tt.width=ot,tt.height=It,tt.getContext("2d").drawImage(C,0,0,ot,It),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+lt.width+"x"+lt.height+") to ("+ot+"x"+It+")."),tt}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+lt.width+"x"+lt.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){n.generateMipmap(C)}function v(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(C,S,G,ct,lt=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ot=S;if(S===n.RED&&(G===n.FLOAT&&(ot=n.R32F),G===n.HALF_FLOAT&&(ot=n.R16F),G===n.UNSIGNED_BYTE&&(ot=n.R8)),S===n.RED_INTEGER&&(G===n.UNSIGNED_BYTE&&(ot=n.R8UI),G===n.UNSIGNED_SHORT&&(ot=n.R16UI),G===n.UNSIGNED_INT&&(ot=n.R32UI),G===n.BYTE&&(ot=n.R8I),G===n.SHORT&&(ot=n.R16I),G===n.INT&&(ot=n.R32I)),S===n.RG&&(G===n.FLOAT&&(ot=n.RG32F),G===n.HALF_FLOAT&&(ot=n.RG16F),G===n.UNSIGNED_BYTE&&(ot=n.RG8)),S===n.RG_INTEGER&&(G===n.UNSIGNED_BYTE&&(ot=n.RG8UI),G===n.UNSIGNED_SHORT&&(ot=n.RG16UI),G===n.UNSIGNED_INT&&(ot=n.RG32UI),G===n.BYTE&&(ot=n.RG8I),G===n.SHORT&&(ot=n.RG16I),G===n.INT&&(ot=n.RG32I)),S===n.RGB_INTEGER&&(G===n.UNSIGNED_BYTE&&(ot=n.RGB8UI),G===n.UNSIGNED_SHORT&&(ot=n.RGB16UI),G===n.UNSIGNED_INT&&(ot=n.RGB32UI),G===n.BYTE&&(ot=n.RGB8I),G===n.SHORT&&(ot=n.RGB16I),G===n.INT&&(ot=n.RGB32I)),S===n.RGBA_INTEGER&&(G===n.UNSIGNED_BYTE&&(ot=n.RGBA8UI),G===n.UNSIGNED_SHORT&&(ot=n.RGBA16UI),G===n.UNSIGNED_INT&&(ot=n.RGBA32UI),G===n.BYTE&&(ot=n.RGBA8I),G===n.SHORT&&(ot=n.RGBA16I),G===n.INT&&(ot=n.RGBA32I)),S===n.RGB&&G===n.UNSIGNED_INT_5_9_9_9_REV&&(ot=n.RGB9_E5),S===n.RGBA){const It=lt?Is:oe.getTransfer(ct);G===n.FLOAT&&(ot=n.RGBA32F),G===n.HALF_FLOAT&&(ot=n.RGBA16F),G===n.UNSIGNED_BYTE&&(ot=It===de?n.SRGB8_ALPHA8:n.RGBA8),G===n.UNSIGNED_SHORT_4_4_4_4&&(ot=n.RGBA4),G===n.UNSIGNED_SHORT_5_5_5_1&&(ot=n.RGB5_A1)}return(ot===n.R16F||ot===n.R32F||ot===n.RG16F||ot===n.RG32F||ot===n.RGBA16F||ot===n.RGBA32F)&&t.get("EXT_color_buffer_float"),ot}function x(C,S){let G;return C?S===null||S===Si||S===ji?G=n.DEPTH24_STENCIL8:S===zn?G=n.DEPTH32F_STENCIL8:S===ba&&(G=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Si||S===ji?G=n.DEPTH_COMPONENT24:S===zn?G=n.DEPTH_COMPONENT32F:S===ba&&(G=n.DEPTH_COMPONENT16),G}function U(C,S){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==xn&&C.minFilter!==En?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function R(C){const S=C.target;S.removeEventListener("dispose",R),w(S),S.isVideoTexture&&d.delete(S)}function T(C){const S=C.target;S.removeEventListener("dispose",T),y(S)}function w(C){const S=i.get(C);if(S.__webglInit===void 0)return;const G=C.source,ct=h.get(G);if(ct){const lt=ct[S.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&b(C),Object.keys(ct).length===0&&h.delete(G)}i.remove(C)}function b(C){const S=i.get(C);n.deleteTexture(S.__webglTexture);const G=C.source,ct=h.get(G);delete ct[S.__cacheKey],o.memory.textures--}function y(C){const S=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let ct=0;ct<6;ct++){if(Array.isArray(S.__webglFramebuffer[ct]))for(let lt=0;lt<S.__webglFramebuffer[ct].length;lt++)n.deleteFramebuffer(S.__webglFramebuffer[ct][lt]);else n.deleteFramebuffer(S.__webglFramebuffer[ct]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[ct])}else{if(Array.isArray(S.__webglFramebuffer))for(let ct=0;ct<S.__webglFramebuffer.length;ct++)n.deleteFramebuffer(S.__webglFramebuffer[ct]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let ct=0;ct<S.__webglColorRenderbuffer.length;ct++)S.__webglColorRenderbuffer[ct]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[ct]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const G=C.textures;for(let ct=0,lt=G.length;ct<lt;ct++){const ot=i.get(G[ct]);ot.__webglTexture&&(n.deleteTexture(ot.__webglTexture),o.memory.textures--),i.remove(G[ct])}i.remove(C)}let D=0;function B(){D=0}function N(){const C=D;return C>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+a.maxTextures),D+=1,C}function V(C){const S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function P(C,S){const G=i.get(C);if(C.isVideoTexture&&wt(C),C.isRenderTargetTexture===!1&&C.version>0&&G.__version!==C.version){const ct=C.image;if(ct===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ct.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(G,C,S);return}}e.bindTexture(n.TEXTURE_2D,G.__webglTexture,n.TEXTURE0+S)}function A(C,S){const G=i.get(C);if(C.version>0&&G.__version!==C.version){Y(G,C,S);return}e.bindTexture(n.TEXTURE_2D_ARRAY,G.__webglTexture,n.TEXTURE0+S)}function X(C,S){const G=i.get(C);if(C.version>0&&G.__version!==C.version){Y(G,C,S);return}e.bindTexture(n.TEXTURE_3D,G.__webglTexture,n.TEXTURE0+S)}function H(C,S){const G=i.get(C);if(C.version>0&&G.__version!==C.version){et(G,C,S);return}e.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture,n.TEXTURE0+S)}const q={[hr]:n.REPEAT,[xi]:n.CLAMP_TO_EDGE,[ur]:n.MIRRORED_REPEAT},Q={[xn]:n.NEAREST,[Vp]:n.NEAREST_MIPMAP_NEAREST,[ka]:n.NEAREST_MIPMAP_LINEAR,[En]:n.LINEAR,[no]:n.LINEAR_MIPMAP_NEAREST,[vi]:n.LINEAR_MIPMAP_LINEAR},dt={[Yp]:n.NEVER,[Qp]:n.ALWAYS,[Zp]:n.LESS,[zd]:n.LEQUAL,[qp]:n.EQUAL,[Jp]:n.GEQUAL,[jp]:n.GREATER,[Kp]:n.NOTEQUAL};function ft(C,S){if(S.type===zn&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===En||S.magFilter===no||S.magFilter===ka||S.magFilter===vi||S.minFilter===En||S.minFilter===no||S.minFilter===ka||S.minFilter===vi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,q[S.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,q[S.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,q[S.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,Q[S.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,Q[S.minFilter]),S.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,dt[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===xn||S.minFilter!==ka&&S.minFilter!==vi||S.type===zn&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");n.texParameterf(C,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,a.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function vt(C,S){let G=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",R));const ct=S.source;let lt=h.get(ct);lt===void 0&&(lt={},h.set(ct,lt));const ot=V(S);if(ot!==C.__cacheKey){lt[ot]===void 0&&(lt[ot]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,G=!0),lt[ot].usedTimes++;const It=lt[C.__cacheKey];It!==void 0&&(lt[C.__cacheKey].usedTimes--,It.usedTimes===0&&b(S)),C.__cacheKey=ot,C.__webglTexture=lt[ot].texture}return G}function Y(C,S,G){let ct=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(ct=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(ct=n.TEXTURE_3D);const lt=vt(C,S),ot=S.source;e.bindTexture(ct,C.__webglTexture,n.TEXTURE0+G);const It=i.get(ot);if(ot.version!==It.__version||lt===!0){e.activeTexture(n.TEXTURE0+G);const tt=oe.getPrimaries(oe.workingColorSpace),xt=S.colorSpace===jn?null:oe.getPrimaries(S.colorSpace),Ht=S.colorSpace===jn||tt===xt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ht);let at=_(S.image,!1,a.maxTextureSize);at=yt(S,at);const Mt=s.convert(S.format,S.colorSpace),z=s.convert(S.type);let nt=M(S.internalFormat,Mt,z,S.colorSpace,S.isVideoTexture);ft(ct,S);let ut;const Ut=S.mipmaps,Nt=S.isVideoTexture!==!0,Z=It.__version===void 0||lt===!0,L=ot.dataReady,it=U(S,at);if(S.isDepthTexture)nt=x(S.format===Ki,S.type),Z&&(Nt?e.texStorage2D(n.TEXTURE_2D,1,nt,at.width,at.height):e.texImage2D(n.TEXTURE_2D,0,nt,at.width,at.height,0,Mt,z,null));else if(S.isDataTexture)if(Ut.length>0){Nt&&Z&&e.texStorage2D(n.TEXTURE_2D,it,nt,Ut[0].width,Ut[0].height);for(let $=0,J=Ut.length;$<J;$++)ut=Ut[$],Nt?L&&e.texSubImage2D(n.TEXTURE_2D,$,0,0,ut.width,ut.height,Mt,z,ut.data):e.texImage2D(n.TEXTURE_2D,$,nt,ut.width,ut.height,0,Mt,z,ut.data);S.generateMipmaps=!1}else Nt?(Z&&e.texStorage2D(n.TEXTURE_2D,it,nt,at.width,at.height),L&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,at.width,at.height,Mt,z,at.data)):e.texImage2D(n.TEXTURE_2D,0,nt,at.width,at.height,0,Mt,z,at.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Nt&&Z&&e.texStorage3D(n.TEXTURE_2D_ARRAY,it,nt,Ut[0].width,Ut[0].height,at.depth);for(let $=0,J=Ut.length;$<J;$++)if(ut=Ut[$],S.format!==_n)if(Mt!==null)if(Nt){if(L)if(S.layerUpdates.size>0){const mt=Yl(ut.width,ut.height,S.format,S.type);for(const gt of S.layerUpdates){const Ot=ut.data.subarray(gt*mt/ut.data.BYTES_PER_ELEMENT,(gt+1)*mt/ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,gt,ut.width,ut.height,1,Mt,Ot)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,ut.width,ut.height,at.depth,Mt,ut.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,$,nt,ut.width,ut.height,at.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Nt?L&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,ut.width,ut.height,at.depth,Mt,z,ut.data):e.texImage3D(n.TEXTURE_2D_ARRAY,$,nt,ut.width,ut.height,at.depth,0,Mt,z,ut.data)}else{Nt&&Z&&e.texStorage2D(n.TEXTURE_2D,it,nt,Ut[0].width,Ut[0].height);for(let $=0,J=Ut.length;$<J;$++)ut=Ut[$],S.format!==_n?Mt!==null?Nt?L&&e.compressedTexSubImage2D(n.TEXTURE_2D,$,0,0,ut.width,ut.height,Mt,ut.data):e.compressedTexImage2D(n.TEXTURE_2D,$,nt,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Nt?L&&e.texSubImage2D(n.TEXTURE_2D,$,0,0,ut.width,ut.height,Mt,z,ut.data):e.texImage2D(n.TEXTURE_2D,$,nt,ut.width,ut.height,0,Mt,z,ut.data)}else if(S.isDataArrayTexture)if(Nt){if(Z&&e.texStorage3D(n.TEXTURE_2D_ARRAY,it,nt,at.width,at.height,at.depth),L)if(S.layerUpdates.size>0){const $=Yl(at.width,at.height,S.format,S.type);for(const J of S.layerUpdates){const mt=at.data.subarray(J*$/at.data.BYTES_PER_ELEMENT,(J+1)*$/at.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,J,at.width,at.height,1,Mt,z,mt)}S.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,Mt,z,at.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,nt,at.width,at.height,at.depth,0,Mt,z,at.data);else if(S.isData3DTexture)Nt?(Z&&e.texStorage3D(n.TEXTURE_3D,it,nt,at.width,at.height,at.depth),L&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,Mt,z,at.data)):e.texImage3D(n.TEXTURE_3D,0,nt,at.width,at.height,at.depth,0,Mt,z,at.data);else if(S.isFramebufferTexture){if(Z)if(Nt)e.texStorage2D(n.TEXTURE_2D,it,nt,at.width,at.height);else{let $=at.width,J=at.height;for(let mt=0;mt<it;mt++)e.texImage2D(n.TEXTURE_2D,mt,nt,$,J,0,Mt,z,null),$>>=1,J>>=1}}else if(Ut.length>0){if(Nt&&Z){const $=Tt(Ut[0]);e.texStorage2D(n.TEXTURE_2D,it,nt,$.width,$.height)}for(let $=0,J=Ut.length;$<J;$++)ut=Ut[$],Nt?L&&e.texSubImage2D(n.TEXTURE_2D,$,0,0,Mt,z,ut):e.texImage2D(n.TEXTURE_2D,$,nt,Mt,z,ut);S.generateMipmaps=!1}else if(Nt){if(Z){const $=Tt(at);e.texStorage2D(n.TEXTURE_2D,it,nt,$.width,$.height)}L&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Mt,z,at)}else e.texImage2D(n.TEXTURE_2D,0,nt,Mt,z,at);m(S)&&p(ct),It.__version=ot.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function et(C,S,G){if(S.image.length!==6)return;const ct=vt(C,S),lt=S.source;e.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+G);const ot=i.get(lt);if(lt.version!==ot.__version||ct===!0){e.activeTexture(n.TEXTURE0+G);const It=oe.getPrimaries(oe.workingColorSpace),tt=S.colorSpace===jn?null:oe.getPrimaries(S.colorSpace),xt=S.colorSpace===jn||It===tt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const Ht=S.isCompressedTexture||S.image[0].isCompressedTexture,at=S.image[0]&&S.image[0].isDataTexture,Mt=[];for(let J=0;J<6;J++)!Ht&&!at?Mt[J]=_(S.image[J],!0,a.maxCubemapSize):Mt[J]=at?S.image[J].image:S.image[J],Mt[J]=yt(S,Mt[J]);const z=Mt[0],nt=s.convert(S.format,S.colorSpace),ut=s.convert(S.type),Ut=M(S.internalFormat,nt,ut,S.colorSpace),Nt=S.isVideoTexture!==!0,Z=ot.__version===void 0||ct===!0,L=lt.dataReady;let it=U(S,z);ft(n.TEXTURE_CUBE_MAP,S);let $;if(Ht){Nt&&Z&&e.texStorage2D(n.TEXTURE_CUBE_MAP,it,Ut,z.width,z.height);for(let J=0;J<6;J++){$=Mt[J].mipmaps;for(let mt=0;mt<$.length;mt++){const gt=$[mt];S.format!==_n?nt!==null?Nt?L&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,mt,0,0,gt.width,gt.height,nt,gt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,mt,Ut,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?L&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,mt,0,0,gt.width,gt.height,nt,ut,gt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,mt,Ut,gt.width,gt.height,0,nt,ut,gt.data)}}}else{if($=S.mipmaps,Nt&&Z){$.length>0&&it++;const J=Tt(Mt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,it,Ut,J.width,J.height)}for(let J=0;J<6;J++)if(at){Nt?L&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Mt[J].width,Mt[J].height,nt,ut,Mt[J].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ut,Mt[J].width,Mt[J].height,0,nt,ut,Mt[J].data);for(let mt=0;mt<$.length;mt++){const Ot=$[mt].image[J].image;Nt?L&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,mt+1,0,0,Ot.width,Ot.height,nt,ut,Ot.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,mt+1,Ut,Ot.width,Ot.height,0,nt,ut,Ot.data)}}else{Nt?L&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,nt,ut,Mt[J]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ut,nt,ut,Mt[J]);for(let mt=0;mt<$.length;mt++){const gt=$[mt];Nt?L&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,mt+1,0,0,nt,ut,gt.image[J]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,mt+1,Ut,nt,ut,gt.image[J])}}}m(S)&&p(n.TEXTURE_CUBE_MAP),ot.__version=lt.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function _t(C,S,G,ct,lt,ot){const It=s.convert(G.format,G.colorSpace),tt=s.convert(G.type),xt=M(G.internalFormat,It,tt,G.colorSpace),Ht=i.get(S),at=i.get(G);if(at.__renderTarget=S,!Ht.__hasExternalTextures){const Mt=Math.max(1,S.width>>ot),z=Math.max(1,S.height>>ot);lt===n.TEXTURE_3D||lt===n.TEXTURE_2D_ARRAY?e.texImage3D(lt,ot,xt,Mt,z,S.depth,0,It,tt,null):e.texImage2D(lt,ot,xt,Mt,z,0,It,tt,null)}e.bindFramebuffer(n.FRAMEBUFFER,C),Ct(S)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ct,lt,at.__webglTexture,0,Dt(S)):(lt===n.TEXTURE_2D||lt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ct,lt,at.__webglTexture,ot),e.bindFramebuffer(n.FRAMEBUFFER,null)}function K(C,S,G){if(n.bindRenderbuffer(n.RENDERBUFFER,C),S.depthBuffer){const ct=S.depthTexture,lt=ct&&ct.isDepthTexture?ct.type:null,ot=x(S.stencilBuffer,lt),It=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,tt=Dt(S);Ct(S)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,tt,ot,S.width,S.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,tt,ot,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,ot,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,It,n.RENDERBUFFER,C)}else{const ct=S.textures;for(let lt=0;lt<ct.length;lt++){const ot=ct[lt],It=s.convert(ot.format,ot.colorSpace),tt=s.convert(ot.type),xt=M(ot.internalFormat,It,tt,ot.colorSpace),Ht=Dt(S);G&&Ct(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ht,xt,S.width,S.height):Ct(S)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ht,xt,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,xt,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function pt(C,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ct=i.get(S.depthTexture);ct.__renderTarget=S,(!ct.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),P(S.depthTexture,0);const lt=ct.__webglTexture,ot=Dt(S);if(S.depthTexture.format===Wi)Ct(S)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,lt,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,lt,0);else if(S.depthTexture.format===Ki)Ct(S)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,lt,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function Pt(C){const S=i.get(C),G=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){const ct=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),ct){const lt=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,ct.removeEventListener("dispose",lt)};ct.addEventListener("dispose",lt),S.__depthDisposeCallback=lt}S.__boundDepthTexture=ct}if(C.depthTexture&&!S.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");pt(S.__webglFramebuffer,C)}else if(G){S.__webglDepthbuffer=[];for(let ct=0;ct<6;ct++)if(e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[ct]),S.__webglDepthbuffer[ct]===void 0)S.__webglDepthbuffer[ct]=n.createRenderbuffer(),K(S.__webglDepthbuffer[ct],C,!1);else{const lt=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ot=S.__webglDepthbuffer[ct];n.bindRenderbuffer(n.RENDERBUFFER,ot),n.framebufferRenderbuffer(n.FRAMEBUFFER,lt,n.RENDERBUFFER,ot)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),K(S.__webglDepthbuffer,C,!1);else{const ct=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,lt=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,lt),n.framebufferRenderbuffer(n.FRAMEBUFFER,ct,n.RENDERBUFFER,lt)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function At(C,S,G){const ct=i.get(C);S!==void 0&&_t(ct.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),G!==void 0&&Pt(C)}function zt(C){const S=C.texture,G=i.get(C),ct=i.get(S);C.addEventListener("dispose",T);const lt=C.textures,ot=C.isWebGLCubeRenderTarget===!0,It=lt.length>1;if(It||(ct.__webglTexture===void 0&&(ct.__webglTexture=n.createTexture()),ct.__version=S.version,o.memory.textures++),ot){G.__webglFramebuffer=[];for(let tt=0;tt<6;tt++)if(S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer[tt]=[];for(let xt=0;xt<S.mipmaps.length;xt++)G.__webglFramebuffer[tt][xt]=n.createFramebuffer()}else G.__webglFramebuffer[tt]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer=[];for(let tt=0;tt<S.mipmaps.length;tt++)G.__webglFramebuffer[tt]=n.createFramebuffer()}else G.__webglFramebuffer=n.createFramebuffer();if(It)for(let tt=0,xt=lt.length;tt<xt;tt++){const Ht=i.get(lt[tt]);Ht.__webglTexture===void 0&&(Ht.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&Ct(C)===!1){G.__webglMultisampledFramebuffer=n.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let tt=0;tt<lt.length;tt++){const xt=lt[tt];G.__webglColorRenderbuffer[tt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,G.__webglColorRenderbuffer[tt]);const Ht=s.convert(xt.format,xt.colorSpace),at=s.convert(xt.type),Mt=M(xt.internalFormat,Ht,at,xt.colorSpace,C.isXRRenderTarget===!0),z=Dt(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,z,Mt,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+tt,n.RENDERBUFFER,G.__webglColorRenderbuffer[tt])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(G.__webglDepthRenderbuffer=n.createRenderbuffer(),K(G.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ot){e.bindTexture(n.TEXTURE_CUBE_MAP,ct.__webglTexture),ft(n.TEXTURE_CUBE_MAP,S);for(let tt=0;tt<6;tt++)if(S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)_t(G.__webglFramebuffer[tt][xt],C,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+tt,xt);else _t(G.__webglFramebuffer[tt],C,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0);m(S)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(It){for(let tt=0,xt=lt.length;tt<xt;tt++){const Ht=lt[tt],at=i.get(Ht);e.bindTexture(n.TEXTURE_2D,at.__webglTexture),ft(n.TEXTURE_2D,Ht),_t(G.__webglFramebuffer,C,Ht,n.COLOR_ATTACHMENT0+tt,n.TEXTURE_2D,0),m(Ht)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let tt=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(tt=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(tt,ct.__webglTexture),ft(tt,S),S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)_t(G.__webglFramebuffer[xt],C,S,n.COLOR_ATTACHMENT0,tt,xt);else _t(G.__webglFramebuffer,C,S,n.COLOR_ATTACHMENT0,tt,0);m(S)&&p(tt),e.unbindTexture()}C.depthBuffer&&Pt(C)}function St(C){const S=C.textures;for(let G=0,ct=S.length;G<ct;G++){const lt=S[G];if(m(lt)){const ot=v(C),It=i.get(lt).__webglTexture;e.bindTexture(ot,It),p(ot),e.unbindTexture()}}}const bt=[],O=[];function Zt(C){if(C.samples>0){if(Ct(C)===!1){const S=C.textures,G=C.width,ct=C.height;let lt=n.COLOR_BUFFER_BIT;const ot=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,It=i.get(C),tt=S.length>1;if(tt)for(let xt=0;xt<S.length;xt++)e.bindFramebuffer(n.FRAMEBUFFER,It.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,It.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,It.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,It.__webglFramebuffer);for(let xt=0;xt<S.length;xt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(lt|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(lt|=n.STENCIL_BUFFER_BIT)),tt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,It.__webglColorRenderbuffer[xt]);const Ht=i.get(S[xt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ht,0)}n.blitFramebuffer(0,0,G,ct,0,0,G,ct,lt,n.NEAREST),c===!0&&(bt.length=0,O.length=0,bt.push(n.COLOR_ATTACHMENT0+xt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(bt.push(ot),O.push(ot),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,O)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,bt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),tt)for(let xt=0;xt<S.length;xt++){e.bindFramebuffer(n.FRAMEBUFFER,It.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.RENDERBUFFER,It.__webglColorRenderbuffer[xt]);const Ht=i.get(S[xt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,It.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.TEXTURE_2D,Ht,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,It.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const S=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function Dt(C){return Math.min(a.maxSamples,C.samples)}function Ct(C){const S=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function wt(C){const S=o.render.frame;d.get(C)!==S&&(d.set(C,S),C.update())}function yt(C,S){const G=C.colorSpace,ct=C.format,lt=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||G!==Qi&&G!==jn&&(oe.getTransfer(G)===de?(ct!==_n||lt!==Hn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),S}function Tt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=N,this.resetTextureUnits=B,this.setTexture2D=P,this.setTexture2DArray=A,this.setTexture3D=X,this.setTextureCube=H,this.rebindTextures=At,this.setupRenderTarget=zt,this.updateRenderTargetMipmap=St,this.updateMultisampleRenderTarget=Zt,this.setupDepthRenderbuffer=Pt,this.setupFrameBufferTexture=_t,this.useMultisampledRTT=Ct}function iv(n,t){function e(i,a=jn){let s;const o=oe.getTransfer(a);if(i===Hn)return n.UNSIGNED_BYTE;if(i===ec)return n.UNSIGNED_SHORT_4_4_4_4;if(i===nc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Cd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ad)return n.BYTE;if(i===Rd)return n.SHORT;if(i===ba)return n.UNSIGNED_SHORT;if(i===tc)return n.INT;if(i===Si)return n.UNSIGNED_INT;if(i===zn)return n.FLOAT;if(i===wa)return n.HALF_FLOAT;if(i===Pd)return n.ALPHA;if(i===Dd)return n.RGB;if(i===_n)return n.RGBA;if(i===Ld)return n.LUMINANCE;if(i===Id)return n.LUMINANCE_ALPHA;if(i===Wi)return n.DEPTH_COMPONENT;if(i===Ki)return n.DEPTH_STENCIL;if(i===kd)return n.RED;if(i===ic)return n.RED_INTEGER;if(i===Ud)return n.RG;if(i===ac)return n.RG_INTEGER;if(i===sc)return n.RGBA_INTEGER;if(i===cs||i===ls||i===ds||i===hs)if(o===de)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===cs)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ls)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ds)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===hs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===cs)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ls)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ds)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===hs)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===fr||i===pr||i===mr||i===gr)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===fr)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===pr)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===mr)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===gr)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===_r||i===xr||i===vr)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===_r||i===xr)return o===de?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===vr)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Mr||i===yr||i===Sr||i===br||i===Er||i===wr||i===Tr||i===Ar||i===Rr||i===Cr||i===Pr||i===Dr||i===Lr||i===Ir)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Mr)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===yr)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Sr)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===br)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Er)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===wr)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Tr)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ar)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Rr)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Cr)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Pr)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Dr)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Lr)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ir)return o===de?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===us||i===kr||i===Ur)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===us)return o===de?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===kr)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ur)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Fd||i===Fr||i===Nr||i===zr)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===us)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Fr)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Nr)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===zr)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ji?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class av extends an{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Re extends we{constructor(){super(),this.isGroup=!0,this.type="Group"}}const sv={type:"move"};class Do{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Re,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Re,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new j,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new j),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Re,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new j,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new j),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const d=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],h=d.position.distanceTo(f.position),u=.02,g=.005;l.inputState.pinching&&h>u+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=u-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(sv)))}return r!==null&&(r.visible=a!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Re;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const ov=`
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

}`;class cv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new $e,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ei({vertexShader:ov,fragmentShader:rv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new fe(new Us(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class lv extends ta{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",c=1,l=null,d=null,f=null,h=null,u=null,g=null;const _=new cv,m=e.getContextAttributes();let p=null,v=null;const M=[],x=[],U=new ae;let R=null;const T=new an;T.viewport=new Me;const w=new an;w.viewport=new Me;const b=[T,w],y=new av;let D=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let et=M[Y];return et===void 0&&(et=new Do,M[Y]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Y){let et=M[Y];return et===void 0&&(et=new Do,M[Y]=et),et.getGripSpace()},this.getHand=function(Y){let et=M[Y];return et===void 0&&(et=new Do,M[Y]=et),et.getHandSpace()};function N(Y){const et=x.indexOf(Y.inputSource);if(et===-1)return;const _t=M[et];_t!==void 0&&(_t.update(Y.inputSource,Y.frame,l||o),_t.dispatchEvent({type:Y.type,data:Y.inputSource}))}function V(){a.removeEventListener("select",N),a.removeEventListener("selectstart",N),a.removeEventListener("selectend",N),a.removeEventListener("squeeze",N),a.removeEventListener("squeezestart",N),a.removeEventListener("squeezeend",N),a.removeEventListener("end",V),a.removeEventListener("inputsourceschange",P);for(let Y=0;Y<M.length;Y++){const et=x[Y];et!==null&&(x[Y]=null,M[Y].disconnect(et))}D=null,B=null,_.reset(),t.setRenderTarget(p),u=null,h=null,f=null,a=null,v=null,vt.stop(),i.isPresenting=!1,t.setPixelRatio(R),t.setSize(U.width,U.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){r=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return h!==null?h:u},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return a},this.setSession=async function(Y){if(a=Y,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",N),a.addEventListener("selectstart",N),a.addEventListener("selectend",N),a.addEventListener("squeeze",N),a.addEventListener("squeezestart",N),a.addEventListener("squeezeend",N),a.addEventListener("end",V),a.addEventListener("inputsourceschange",P),m.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(U),a.renderState.layers===void 0){const et={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(a,e,et),a.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),v=new bi(u.framebufferWidth,u.framebufferHeight,{format:_n,type:Hn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let et=null,_t=null,K=null;m.depth&&(K=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=m.stencil?Ki:Wi,_t=m.stencil?ji:Si);const pt={colorFormat:e.RGBA8,depthFormat:K,scaleFactor:s};f=new XRWebGLBinding(a,e),h=f.createProjectionLayer(pt),a.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),v=new bi(h.textureWidth,h.textureHeight,{format:_n,type:Hn,depthTexture:new jd(h.textureWidth,h.textureHeight,_t,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await a.requestReferenceSpace(r),vt.setContext(a),vt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function P(Y){for(let et=0;et<Y.removed.length;et++){const _t=Y.removed[et],K=x.indexOf(_t);K>=0&&(x[K]=null,M[K].disconnect(_t))}for(let et=0;et<Y.added.length;et++){const _t=Y.added[et];let K=x.indexOf(_t);if(K===-1){for(let Pt=0;Pt<M.length;Pt++)if(Pt>=x.length){x.push(_t),K=Pt;break}else if(x[Pt]===null){x[Pt]=_t,K=Pt;break}if(K===-1)break}const pt=M[K];pt&&pt.connect(_t)}}const A=new j,X=new j;function H(Y,et,_t){A.setFromMatrixPosition(et.matrixWorld),X.setFromMatrixPosition(_t.matrixWorld);const K=A.distanceTo(X),pt=et.projectionMatrix.elements,Pt=_t.projectionMatrix.elements,At=pt[14]/(pt[10]-1),zt=pt[14]/(pt[10]+1),St=(pt[9]+1)/pt[5],bt=(pt[9]-1)/pt[5],O=(pt[8]-1)/pt[0],Zt=(Pt[8]+1)/Pt[0],Dt=At*O,Ct=At*Zt,wt=K/(-O+Zt),yt=wt*-O;if(et.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(yt),Y.translateZ(wt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),pt[10]===-1)Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const Tt=At+wt,C=zt+wt,S=Dt-yt,G=Ct+(K-yt),ct=St*zt/C*Tt,lt=bt*zt/C*Tt;Y.projectionMatrix.makePerspective(S,G,ct,lt,Tt,C),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function q(Y,et){et===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(et.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(a===null)return;let et=Y.near,_t=Y.far;_.texture!==null&&(_.depthNear>0&&(et=_.depthNear),_.depthFar>0&&(_t=_.depthFar)),y.near=w.near=T.near=et,y.far=w.far=T.far=_t,(D!==y.near||B!==y.far)&&(a.updateRenderState({depthNear:y.near,depthFar:y.far}),D=y.near,B=y.far),T.layers.mask=Y.layers.mask|2,w.layers.mask=Y.layers.mask|4,y.layers.mask=T.layers.mask|w.layers.mask;const K=Y.parent,pt=y.cameras;q(y,K);for(let Pt=0;Pt<pt.length;Pt++)q(pt[Pt],K);pt.length===2?H(y,T,w):y.projectionMatrix.copy(T.projectionMatrix),Q(Y,y,K)};function Q(Y,et,_t){_t===null?Y.matrix.copy(et.matrixWorld):(Y.matrix.copy(_t.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(et.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Or*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&u===null))return c},this.setFoveation=function(Y){c=Y,h!==null&&(h.fixedFoveation=Y),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let dt=null;function ft(Y,et){if(d=et.getViewerPose(l||o),g=et,d!==null){const _t=d.views;u!==null&&(t.setRenderTargetFramebuffer(v,u.framebuffer),t.setRenderTarget(v));let K=!1;_t.length!==y.cameras.length&&(y.cameras.length=0,K=!0);for(let Pt=0;Pt<_t.length;Pt++){const At=_t[Pt];let zt=null;if(u!==null)zt=u.getViewport(At);else{const bt=f.getViewSubImage(h,At);zt=bt.viewport,Pt===0&&(t.setRenderTargetTextures(v,bt.colorTexture,h.ignoreDepthValues?void 0:bt.depthStencilTexture),t.setRenderTarget(v))}let St=b[Pt];St===void 0&&(St=new an,St.layers.enable(Pt),St.viewport=new Me,b[Pt]=St),St.matrix.fromArray(At.transform.matrix),St.matrix.decompose(St.position,St.quaternion,St.scale),St.projectionMatrix.fromArray(At.projectionMatrix),St.projectionMatrixInverse.copy(St.projectionMatrix).invert(),St.viewport.set(zt.x,zt.y,zt.width,zt.height),Pt===0&&(y.matrix.copy(St.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),K===!0&&y.cameras.push(St)}const pt=a.enabledFeatures;if(pt&&pt.includes("depth-sensing")){const Pt=f.getDepthInformation(_t[0]);Pt&&Pt.isValid&&Pt.texture&&_.init(t,Pt,a.renderState)}}for(let _t=0;_t<M.length;_t++){const K=x[_t],pt=M[_t];K!==null&&pt!==void 0&&pt.update(K,et,l||o)}dt&&dt(Y,et),et.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:et}),g=null}const vt=new Zd;vt.setAnimationLoop(ft),this.setAnimationLoop=function(Y){dt=Y},this.dispose=function(){}}}const hi=new Tn,dv=new me;function hv(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Wd(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function a(m,p,v,M,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),f(m,p)):p.isMeshPhongMaterial?(s(m,p),d(m,p)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&u(m,p,x)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?c(m,p,v,M):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===We&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===We&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=t.get(p),M=v.envMap,x=v.envMapRotation;M&&(m.envMap.value=M,hi.copy(x),hi.x*=-1,hi.y*=-1,hi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),m.envMapRotation.value.setFromMatrix4(dv.makeRotationFromEuler(hi)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,v,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=M*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===We&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const v=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function uv(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,M){const x=M.program;i.uniformBlockBinding(v,x)}function l(v,M){let x=a[v.id];x===void 0&&(g(v),x=d(v),a[v.id]=x,v.addEventListener("dispose",m));const U=M.program;i.updateUBOMapping(v,U);const R=t.render.frame;s[v.id]!==R&&(h(v),s[v.id]=R)}function d(v){const M=f();v.__bindingPointIndex=M;const x=n.createBuffer(),U=v.__size,R=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,U,R),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,x),x}function f(){for(let v=0;v<r;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){const M=a[v.id],x=v.uniforms,U=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let R=0,T=x.length;R<T;R++){const w=Array.isArray(x[R])?x[R]:[x[R]];for(let b=0,y=w.length;b<y;b++){const D=w[b];if(u(D,R,b,U)===!0){const B=D.__offset,N=Array.isArray(D.value)?D.value:[D.value];let V=0;for(let P=0;P<N.length;P++){const A=N[P],X=_(A);typeof A=="number"||typeof A=="boolean"?(D.__data[0]=A,n.bufferSubData(n.UNIFORM_BUFFER,B+V,D.__data)):A.isMatrix3?(D.__data[0]=A.elements[0],D.__data[1]=A.elements[1],D.__data[2]=A.elements[2],D.__data[3]=0,D.__data[4]=A.elements[3],D.__data[5]=A.elements[4],D.__data[6]=A.elements[5],D.__data[7]=0,D.__data[8]=A.elements[6],D.__data[9]=A.elements[7],D.__data[10]=A.elements[8],D.__data[11]=0):(A.toArray(D.__data,V),V+=X.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,B,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(v,M,x,U){const R=v.value,T=M+"_"+x;if(U[T]===void 0)return typeof R=="number"||typeof R=="boolean"?U[T]=R:U[T]=R.clone(),!0;{const w=U[T];if(typeof R=="number"||typeof R=="boolean"){if(w!==R)return U[T]=R,!0}else if(w.equals(R)===!1)return w.copy(R),!0}return!1}function g(v){const M=v.uniforms;let x=0;const U=16;for(let T=0,w=M.length;T<w;T++){const b=Array.isArray(M[T])?M[T]:[M[T]];for(let y=0,D=b.length;y<D;y++){const B=b[y],N=Array.isArray(B.value)?B.value:[B.value];for(let V=0,P=N.length;V<P;V++){const A=N[V],X=_(A),H=x%U,q=H%X.boundary,Q=H+q;x+=q,Q!==0&&U-Q<X.storage&&(x+=U-Q),B.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=x,x+=X.storage}}}const R=x%U;return R>0&&(x+=U-R),v.__size=x,v.__cache={},this}function _(v){const M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),M}function m(v){const M=v.target;M.removeEventListener("dispose",m);const x=o.indexOf(M.__bindingPointIndex);o.splice(x,1),n.deleteBuffer(a[M.id]),delete a[M.id],delete s[M.id]}function p(){for(const v in a)n.deleteBuffer(a[v]);o=[],a={},s={}}return{bind:c,update:l,dispose:p}}class fv{constructor(t={}){const{canvas:e=em(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const v=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=nn,this.toneMapping=Qn,this.toneMappingExposure=1;const x=this;let U=!1,R=0,T=0,w=null,b=-1,y=null;const D=new Me,B=new Me;let N=null;const V=new Wt(0);let P=0,A=e.width,X=e.height,H=1,q=null,Q=null;const dt=new Me(0,0,A,X),ft=new Me(0,0,A,X);let vt=!1;const Y=new cc;let et=!1,_t=!1;const K=new me,pt=new me,Pt=new j,At=new Me,zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let St=!1;function bt(){return w===null?H:1}let O=i;function Zt(E,W){return e.getContext(E,W)}try{const E={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Jr}`),e.addEventListener("webglcontextlost",J,!1),e.addEventListener("webglcontextrestored",mt,!1),e.addEventListener("webglcontextcreationerror",gt,!1),O===null){const W="webgl2";if(O=Zt(W,E),O===null)throw Zt(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Dt,Ct,wt,yt,Tt,C,S,G,ct,lt,ot,It,tt,xt,Ht,at,Mt,z,nt,ut,Ut,Nt,Z,L;function it(){Dt=new x_(O),Dt.init(),Nt=new iv(O,Dt),Ct=new u_(O,Dt,t,Nt),wt=new tv(O,Dt),Ct.reverseDepthBuffer&&h&&wt.buffers.depth.setReversed(!0),yt=new y_(O),Tt=new Ox,C=new nv(O,Dt,wt,Tt,Ct,Nt,yt),S=new p_(x),G=new __(x),ct=new Rm(O),Z=new d_(O,ct),lt=new v_(O,ct,yt,Z),ot=new b_(O,lt,ct,yt),nt=new S_(O,Ct,C),at=new f_(Tt),It=new zx(x,S,G,Dt,Ct,Z,at),tt=new hv(x,Tt),xt=new Hx,Ht=new Yx(Dt),z=new l_(x,S,G,wt,ot,u,c),Mt=new Jx(x,ot,Ct),L=new uv(O,yt,Ct,wt),ut=new h_(O,Dt,yt),Ut=new M_(O,Dt,yt),yt.programs=It.programs,x.capabilities=Ct,x.extensions=Dt,x.properties=Tt,x.renderLists=xt,x.shadowMap=Mt,x.state=wt,x.info=yt}it();const $=new lv(x,O);this.xr=$,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const E=Dt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Dt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(E){E!==void 0&&(H=E,this.setSize(A,X,!1))},this.getSize=function(E){return E.set(A,X)},this.setSize=function(E,W,I=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}A=E,X=W,e.width=Math.floor(E*H),e.height=Math.floor(W*H),I===!0&&(e.style.width=E+"px",e.style.height=W+"px"),this.setViewport(0,0,E,W)},this.getDrawingBufferSize=function(E){return E.set(A*H,X*H).floor()},this.setDrawingBufferSize=function(E,W,I){A=E,X=W,H=I,e.width=Math.floor(E*I),e.height=Math.floor(W*I),this.setViewport(0,0,E,W)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(dt)},this.setViewport=function(E,W,I,F){E.isVector4?dt.set(E.x,E.y,E.z,E.w):dt.set(E,W,I,F),wt.viewport(D.copy(dt).multiplyScalar(H).round())},this.getScissor=function(E){return E.copy(ft)},this.setScissor=function(E,W,I,F){E.isVector4?ft.set(E.x,E.y,E.z,E.w):ft.set(E,W,I,F),wt.scissor(B.copy(ft).multiplyScalar(H).round())},this.getScissorTest=function(){return vt},this.setScissorTest=function(E){wt.setScissorTest(vt=E)},this.setOpaqueSort=function(E){q=E},this.setTransparentSort=function(E){Q=E},this.getClearColor=function(E){return E.copy(z.getClearColor())},this.setClearColor=function(){z.setClearColor.apply(z,arguments)},this.getClearAlpha=function(){return z.getClearAlpha()},this.setClearAlpha=function(){z.setClearAlpha.apply(z,arguments)},this.clear=function(E=!0,W=!0,I=!0){let F=0;if(E){let k=!1;if(w!==null){const st=w.texture.format;k=st===sc||st===ac||st===ic}if(k){const st=w.texture.type,rt=st===Hn||st===Si||st===ba||st===ji||st===ec||st===nc,ht=z.getClearColor(),Et=z.getClearAlpha(),Gt=ht.r,Vt=ht.g,kt=ht.b;rt?(g[0]=Gt,g[1]=Vt,g[2]=kt,g[3]=Et,O.clearBufferuiv(O.COLOR,0,g)):(_[0]=Gt,_[1]=Vt,_[2]=kt,_[3]=Et,O.clearBufferiv(O.COLOR,0,_))}else F|=O.COLOR_BUFFER_BIT}W&&(F|=O.DEPTH_BUFFER_BIT),I&&(F|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(F)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",J,!1),e.removeEventListener("webglcontextrestored",mt,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),xt.dispose(),Ht.dispose(),Tt.dispose(),S.dispose(),G.dispose(),ot.dispose(),Z.dispose(),L.dispose(),It.dispose(),$.dispose(),$.removeEventListener("sessionstart",xe),$.removeEventListener("sessionend",ye),se.stop()};function J(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),U=!0}function mt(){console.log("THREE.WebGLRenderer: Context Restored."),U=!1;const E=yt.autoReset,W=Mt.enabled,I=Mt.autoUpdate,F=Mt.needsUpdate,k=Mt.type;it(),yt.autoReset=E,Mt.enabled=W,Mt.autoUpdate=I,Mt.needsUpdate=F,Mt.type=k}function gt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Ot(E){const W=E.target;W.removeEventListener("dispose",Ot),Yt(W)}function Yt(E){Qt(E),Tt.remove(E)}function Qt(E){const W=Tt.get(E).programs;W!==void 0&&(W.forEach(function(I){It.releaseProgram(I)}),E.isShaderMaterial&&It.releaseShaderCache(E))}this.renderBufferDirect=function(E,W,I,F,k,st){W===null&&(W=zt);const rt=k.isMesh&&k.matrixWorld.determinant()<0,ht=qe(E,W,I,F,k);wt.setMaterial(F,rt);let Et=I.index,Gt=1;if(F.wireframe===!0){if(Et=lt.getWireframeAttribute(I),Et===void 0)return;Gt=2}const Vt=I.drawRange,kt=I.attributes.position;let Xt=Vt.start*Gt,jt=(Vt.start+Vt.count)*Gt;st!==null&&(Xt=Math.max(Xt,st.start*Gt),jt=Math.min(jt,(st.start+st.count)*Gt)),Et!==null?(Xt=Math.max(Xt,0),jt=Math.min(jt,Et.count)):kt!=null&&(Xt=Math.max(Xt,0),jt=Math.min(jt,kt.count));const ne=jt-Xt;if(ne<0||ne===1/0)return;Z.setup(k,F,ht,I,Et);let be,Jt=ut;if(Et!==null&&(be=ct.get(Et),Jt=Ut,Jt.setIndex(be)),k.isMesh)F.wireframe===!0?(wt.setLineWidth(F.wireframeLinewidth*bt()),Jt.setMode(O.LINES)):Jt.setMode(O.TRIANGLES);else if(k.isLine){let Ft=F.linewidth;Ft===void 0&&(Ft=1),wt.setLineWidth(Ft*bt()),k.isLineSegments?Jt.setMode(O.LINES):k.isLineLoop?Jt.setMode(O.LINE_LOOP):Jt.setMode(O.LINE_STRIP)}else k.isPoints?Jt.setMode(O.POINTS):k.isSprite&&Jt.setMode(O.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Jt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Dt.get("WEBGL_multi_draw"))Jt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Ft=k._multiDrawStarts,dn=k._multiDrawCounts,re=k._multiDrawCount,je=Et?ct.get(Et).bytesPerElement:1,Gn=Tt.get(F).currentProgram.getUniforms();for(let Ne=0;Ne<re;Ne++)Gn.setValue(O,"_gl_DrawID",Ne),Jt.render(Ft[Ne]/je,dn[Ne])}else if(k.isInstancedMesh)Jt.renderInstances(Xt,ne,k.count);else if(I.isInstancedBufferGeometry){const Ft=I._maxInstanceCount!==void 0?I._maxInstanceCount:1/0,dn=Math.min(I.instanceCount,Ft);Jt.renderInstances(Xt,ne,dn)}else Jt.render(Xt,ne)};function $t(E,W,I){E.transparent===!0&&E.side===Ie&&E.forceSinglePass===!1?(E.side=We,E.needsUpdate=!0,ee(E,W,I),E.side=ti,E.needsUpdate=!0,ee(E,W,I),E.side=Ie):ee(E,W,I)}this.compile=function(E,W,I=null){I===null&&(I=E),p=Ht.get(I),p.init(W),M.push(p),I.traverseVisible(function(k){k.isLight&&k.layers.test(W.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),E!==I&&E.traverseVisible(function(k){k.isLight&&k.layers.test(W.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),p.setupLights();const F=new Set;return E.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const st=k.material;if(st)if(Array.isArray(st))for(let rt=0;rt<st.length;rt++){const ht=st[rt];$t(ht,I,k),F.add(ht)}else $t(st,I,k),F.add(st)}),M.pop(),p=null,F},this.compileAsync=function(E,W,I=null){const F=this.compile(E,W,I);return new Promise(k=>{function st(){if(F.forEach(function(rt){Tt.get(rt).currentProgram.isReady()&&F.delete(rt)}),F.size===0){k(E);return}setTimeout(st,10)}Dt.get("KHR_parallel_shader_compile")!==null?st():setTimeout(st,10)})};let le=null;function he(E){le&&le(E)}function xe(){se.stop()}function ye(){se.start()}const se=new Zd;se.setAnimationLoop(he),typeof self<"u"&&se.setContext(self),this.setAnimationLoop=function(E){le=E,$.setAnimationLoop(E),E===null?se.stop():se.start()},$.addEventListener("sessionstart",xe),$.addEventListener("sessionend",ye),this.render=function(E,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(W),W=$.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,W,w),p=Ht.get(E,M.length),p.init(W),M.push(p),pt.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),Y.setFromProjectionMatrix(pt),_t=this.localClippingEnabled,et=at.init(this.clippingPlanes,_t),m=xt.get(E,v.length),m.init(),v.push(m),$.enabled===!0&&$.isPresenting===!0){const st=x.xr.getDepthSensingMesh();st!==null&&te(st,W,-1/0,x.sortObjects)}te(E,W,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(q,Q),St=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,St&&z.addToRenderList(m,E),this.info.render.frame++,et===!0&&at.beginShadows();const I=p.state.shadowsArray;Mt.render(I,E,W),et===!0&&at.endShadows(),this.info.autoReset===!0&&this.info.reset();const F=m.opaque,k=m.transmissive;if(p.setupLights(),W.isArrayCamera){const st=W.cameras;if(k.length>0)for(let rt=0,ht=st.length;rt<ht;rt++){const Et=st[rt];Lt(F,k,E,Et)}St&&z.render(E);for(let rt=0,ht=st.length;rt<ht;rt++){const Et=st[rt];ve(m,E,Et,Et.viewport)}}else k.length>0&&Lt(F,k,E,W),St&&z.render(E),ve(m,E,W);w!==null&&(C.updateMultisampleRenderTarget(w),C.updateRenderTargetMipmap(w)),E.isScene===!0&&E.onAfterRender(x,E,W),Z.resetDefaultState(),b=-1,y=null,M.pop(),M.length>0?(p=M[M.length-1],et===!0&&at.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?m=v[v.length-1]:m=null};function te(E,W,I,F){if(E.visible===!1)return;if(E.layers.test(W.layers)){if(E.isGroup)I=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(W);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Y.intersectsSprite(E)){F&&At.setFromMatrixPosition(E.matrixWorld).applyMatrix4(pt);const rt=ot.update(E),ht=E.material;ht.visible&&m.push(E,rt,ht,I,At.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Y.intersectsObject(E))){const rt=ot.update(E),ht=E.material;if(F&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),At.copy(E.boundingSphere.center)):(rt.boundingSphere===null&&rt.computeBoundingSphere(),At.copy(rt.boundingSphere.center)),At.applyMatrix4(E.matrixWorld).applyMatrix4(pt)),Array.isArray(ht)){const Et=rt.groups;for(let Gt=0,Vt=Et.length;Gt<Vt;Gt++){const kt=Et[Gt],Xt=ht[kt.materialIndex];Xt&&Xt.visible&&m.push(E,rt,Xt,I,At.z,kt)}}else ht.visible&&m.push(E,rt,ht,I,At.z,null)}}const st=E.children;for(let rt=0,ht=st.length;rt<ht;rt++)te(st[rt],W,I,F)}function ve(E,W,I,F){const k=E.opaque,st=E.transmissive,rt=E.transparent;p.setupLightsView(I),et===!0&&at.setGlobalState(x.clippingPlanes,I),F&&wt.viewport(D.copy(F)),k.length>0&&Bt(k,W,I),st.length>0&&Bt(st,W,I),rt.length>0&&Bt(rt,W,I),wt.buffers.depth.setTest(!0),wt.buffers.depth.setMask(!0),wt.buffers.color.setMask(!0),wt.setPolygonOffset(!1)}function Lt(E,W,I,F){if((I.isScene===!0?I.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[F.id]===void 0&&(p.state.transmissionRenderTarget[F.id]=new bi(1,1,{generateMipmaps:!0,type:Dt.has("EXT_color_buffer_half_float")||Dt.has("EXT_color_buffer_float")?wa:Hn,minFilter:vi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:oe.workingColorSpace}));const st=p.state.transmissionRenderTarget[F.id],rt=F.viewport||D;st.setSize(rt.z,rt.w);const ht=x.getRenderTarget();x.setRenderTarget(st),x.getClearColor(V),P=x.getClearAlpha(),P<1&&x.setClearColor(16777215,.5),x.clear(),St&&z.render(I);const Et=x.toneMapping;x.toneMapping=Qn;const Gt=F.viewport;if(F.viewport!==void 0&&(F.viewport=void 0),p.setupLightsView(F),et===!0&&at.setGlobalState(x.clippingPlanes,F),Bt(E,I,F),C.updateMultisampleRenderTarget(st),C.updateRenderTargetMipmap(st),Dt.has("WEBGL_multisampled_render_to_texture")===!1){let Vt=!1;for(let kt=0,Xt=W.length;kt<Xt;kt++){const jt=W[kt],ne=jt.object,be=jt.geometry,Jt=jt.material,Ft=jt.group;if(Jt.side===Ie&&ne.layers.test(F.layers)){const dn=Jt.side;Jt.side=We,Jt.needsUpdate=!0,ge(ne,I,F,be,Jt,Ft),Jt.side=dn,Jt.needsUpdate=!0,Vt=!0}}Vt===!0&&(C.updateMultisampleRenderTarget(st),C.updateRenderTargetMipmap(st))}x.setRenderTarget(ht),x.setClearColor(V,P),Gt!==void 0&&(F.viewport=Gt),x.toneMapping=Et}function Bt(E,W,I){const F=W.isScene===!0?W.overrideMaterial:null;for(let k=0,st=E.length;k<st;k++){const rt=E[k],ht=rt.object,Et=rt.geometry,Gt=F===null?rt.material:F,Vt=rt.group;ht.layers.test(I.layers)&&ge(ht,W,I,Et,Gt,Vt)}}function ge(E,W,I,F,k,st){E.onBeforeRender(x,W,I,F,k,st),E.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),k.onBeforeRender(x,W,I,F,E,st),k.transparent===!0&&k.side===Ie&&k.forceSinglePass===!1?(k.side=We,k.needsUpdate=!0,x.renderBufferDirect(I,W,F,k,E,st),k.side=ti,k.needsUpdate=!0,x.renderBufferDirect(I,W,F,k,E,st),k.side=Ie):x.renderBufferDirect(I,W,F,k,E,st),E.onAfterRender(x,W,I,F,k,st)}function ee(E,W,I){W.isScene!==!0&&(W=zt);const F=Tt.get(E),k=p.state.lights,st=p.state.shadowsArray,rt=k.state.version,ht=It.getParameters(E,k.state,st,W,I),Et=It.getProgramCacheKey(ht);let Gt=F.programs;F.environment=E.isMeshStandardMaterial?W.environment:null,F.fog=W.fog,F.envMap=(E.isMeshStandardMaterial?G:S).get(E.envMap||F.environment),F.envMapRotation=F.environment!==null&&E.envMap===null?W.environmentRotation:E.envMapRotation,Gt===void 0&&(E.addEventListener("dispose",Ot),Gt=new Map,F.programs=Gt);let Vt=Gt.get(Et);if(Vt!==void 0){if(F.currentProgram===Vt&&F.lightsStateVersion===rt)return Ze(E,ht),Vt}else ht.uniforms=It.getUniforms(E),E.onBeforeCompile(ht,x),Vt=It.acquireProgram(ht,Et),Gt.set(Et,Vt),F.uniforms=ht.uniforms;const kt=F.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(kt.clippingPlanes=at.uniform),Ze(E,ht),F.needsLights=ni(E),F.lightsStateVersion=rt,F.needsLights&&(kt.ambientLightColor.value=k.state.ambient,kt.lightProbe.value=k.state.probe,kt.directionalLights.value=k.state.directional,kt.directionalLightShadows.value=k.state.directionalShadow,kt.spotLights.value=k.state.spot,kt.spotLightShadows.value=k.state.spotShadow,kt.rectAreaLights.value=k.state.rectArea,kt.ltc_1.value=k.state.rectAreaLTC1,kt.ltc_2.value=k.state.rectAreaLTC2,kt.pointLights.value=k.state.point,kt.pointLightShadows.value=k.state.pointShadow,kt.hemisphereLights.value=k.state.hemi,kt.directionalShadowMap.value=k.state.directionalShadowMap,kt.directionalShadowMatrix.value=k.state.directionalShadowMatrix,kt.spotShadowMap.value=k.state.spotShadowMap,kt.spotLightMatrix.value=k.state.spotLightMatrix,kt.spotLightMap.value=k.state.spotLightMap,kt.pointShadowMap.value=k.state.pointShadowMap,kt.pointShadowMatrix.value=k.state.pointShadowMatrix),F.currentProgram=Vt,F.uniformsList=null,Vt}function Te(E){if(E.uniformsList===null){const W=E.currentProgram.getUniforms();E.uniformsList=ps.seqWithValue(W.seq,E.uniforms)}return E.uniformsList}function Ze(E,W){const I=Tt.get(E);I.outputColorSpace=W.outputColorSpace,I.batching=W.batching,I.batchingColor=W.batchingColor,I.instancing=W.instancing,I.instancingColor=W.instancingColor,I.instancingMorph=W.instancingMorph,I.skinning=W.skinning,I.morphTargets=W.morphTargets,I.morphNormals=W.morphNormals,I.morphColors=W.morphColors,I.morphTargetsCount=W.morphTargetsCount,I.numClippingPlanes=W.numClippingPlanes,I.numIntersection=W.numClipIntersection,I.vertexAlphas=W.vertexAlphas,I.vertexTangents=W.vertexTangents,I.toneMapping=W.toneMapping}function qe(E,W,I,F,k){W.isScene!==!0&&(W=zt),C.resetTextureUnits();const st=W.fog,rt=F.isMeshStandardMaterial?W.environment:null,ht=w===null?x.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:Qi,Et=(F.isMeshStandardMaterial?G:S).get(F.envMap||rt),Gt=F.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,Vt=!!I.attributes.tangent&&(!!F.normalMap||F.anisotropy>0),kt=!!I.morphAttributes.position,Xt=!!I.morphAttributes.normal,jt=!!I.morphAttributes.color;let ne=Qn;F.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(ne=x.toneMapping);const be=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,Jt=be!==void 0?be.length:0,Ft=Tt.get(F),dn=p.state.lights;if(et===!0&&(_t===!0||E!==y)){const ze=E===y&&F.id===b;at.setState(F,E,ze)}let re=!1;F.version===Ft.__version?(Ft.needsLights&&Ft.lightsStateVersion!==dn.state.version||Ft.outputColorSpace!==ht||k.isBatchedMesh&&Ft.batching===!1||!k.isBatchedMesh&&Ft.batching===!0||k.isBatchedMesh&&Ft.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Ft.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Ft.instancing===!1||!k.isInstancedMesh&&Ft.instancing===!0||k.isSkinnedMesh&&Ft.skinning===!1||!k.isSkinnedMesh&&Ft.skinning===!0||k.isInstancedMesh&&Ft.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Ft.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Ft.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Ft.instancingMorph===!1&&k.morphTexture!==null||Ft.envMap!==Et||F.fog===!0&&Ft.fog!==st||Ft.numClippingPlanes!==void 0&&(Ft.numClippingPlanes!==at.numPlanes||Ft.numIntersection!==at.numIntersection)||Ft.vertexAlphas!==Gt||Ft.vertexTangents!==Vt||Ft.morphTargets!==kt||Ft.morphNormals!==Xt||Ft.morphColors!==jt||Ft.toneMapping!==ne||Ft.morphTargetsCount!==Jt)&&(re=!0):(re=!0,Ft.__version=F.version);let je=Ft.currentProgram;re===!0&&(je=ee(F,W,k));let Gn=!1,Ne=!1,ii=!1;const ue=je.getUniforms(),Qe=Ft.uniforms;if(wt.useProgram(je.program)&&(Gn=!0,Ne=!0,ii=!0),F.id!==b&&(b=F.id,Ne=!0),Gn||y!==E){wt.buffers.depth.getReversed()?(K.copy(E.projectionMatrix),im(K),am(K),ue.setValue(O,"projectionMatrix",K)):ue.setValue(O,"projectionMatrix",E.projectionMatrix),ue.setValue(O,"viewMatrix",E.matrixWorldInverse);const vn=ue.map.cameraPosition;vn!==void 0&&vn.setValue(O,Pt.setFromMatrixPosition(E.matrixWorld)),Ct.logarithmicDepthBuffer&&ue.setValue(O,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshLambertMaterial||F.isMeshBasicMaterial||F.isMeshStandardMaterial||F.isShaderMaterial)&&ue.setValue(O,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,Ne=!0,ii=!0)}if(k.isSkinnedMesh){ue.setOptional(O,k,"bindMatrix"),ue.setOptional(O,k,"bindMatrixInverse");const ze=k.skeleton;ze&&(ze.boneTexture===null&&ze.computeBoneTexture(),ue.setValue(O,"boneTexture",ze.boneTexture,C))}k.isBatchedMesh&&(ue.setOptional(O,k,"batchingTexture"),ue.setValue(O,"batchingTexture",k._matricesTexture,C),ue.setOptional(O,k,"batchingIdTexture"),ue.setValue(O,"batchingIdTexture",k._indirectTexture,C),ue.setOptional(O,k,"batchingColorTexture"),k._colorsTexture!==null&&ue.setValue(O,"batchingColorTexture",k._colorsTexture,C));const Vn=I.morphAttributes;if((Vn.position!==void 0||Vn.normal!==void 0||Vn.color!==void 0)&&nt.update(k,I,je),(Ne||Ft.receiveShadow!==k.receiveShadow)&&(Ft.receiveShadow=k.receiveShadow,ue.setValue(O,"receiveShadow",k.receiveShadow)),F.isMeshGouraudMaterial&&F.envMap!==null&&(Qe.envMap.value=Et,Qe.flipEnvMap.value=Et.isCubeTexture&&Et.isRenderTargetTexture===!1?-1:1),F.isMeshStandardMaterial&&F.envMap===null&&W.environment!==null&&(Qe.envMapIntensity.value=W.environmentIntensity),Ne&&(ue.setValue(O,"toneMappingExposure",x.toneMappingExposure),Ft.needsLights&&ln(Qe,ii),st&&F.fog===!0&&tt.refreshFogUniforms(Qe,st),tt.refreshMaterialUniforms(Qe,F,H,X,p.state.transmissionRenderTarget[E.id]),ps.upload(O,Te(Ft),Qe,C)),F.isShaderMaterial&&F.uniformsNeedUpdate===!0&&(ps.upload(O,Te(Ft),Qe,C),F.uniformsNeedUpdate=!1),F.isSpriteMaterial&&ue.setValue(O,"center",k.center),ue.setValue(O,"modelViewMatrix",k.modelViewMatrix),ue.setValue(O,"normalMatrix",k.normalMatrix),ue.setValue(O,"modelMatrix",k.matrixWorld),F.isShaderMaterial||F.isRawShaderMaterial){const ze=F.uniformsGroups;for(let vn=0,Mn=ze.length;vn<Mn;vn++){const ia=ze[vn];L.update(ia,je),L.bind(ia,je)}}return je}function ln(E,W){E.ambientLightColor.needsUpdate=W,E.lightProbe.needsUpdate=W,E.directionalLights.needsUpdate=W,E.directionalLightShadows.needsUpdate=W,E.pointLights.needsUpdate=W,E.pointLightShadows.needsUpdate=W,E.spotLights.needsUpdate=W,E.spotLightShadows.needsUpdate=W,E.rectAreaLights.needsUpdate=W,E.hemisphereLights.needsUpdate=W}function ni(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(E,W,I){Tt.get(E.texture).__webglTexture=W,Tt.get(E.depthTexture).__webglTexture=I;const F=Tt.get(E);F.__hasExternalTextures=!0,F.__autoAllocateDepthBuffer=I===void 0,F.__autoAllocateDepthBuffer||Dt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),F.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,W){const I=Tt.get(E);I.__webglFramebuffer=W,I.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(E,W=0,I=0){w=E,R=W,T=I;let F=!0,k=null,st=!1,rt=!1;if(E){const Et=Tt.get(E);if(Et.__useDefaultFramebuffer!==void 0)wt.bindFramebuffer(O.FRAMEBUFFER,null),F=!1;else if(Et.__webglFramebuffer===void 0)C.setupRenderTarget(E);else if(Et.__hasExternalTextures)C.rebindTextures(E,Tt.get(E.texture).__webglTexture,Tt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const kt=E.depthTexture;if(Et.__boundDepthTexture!==kt){if(kt!==null&&Tt.has(kt)&&(E.width!==kt.image.width||E.height!==kt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(E)}}const Gt=E.texture;(Gt.isData3DTexture||Gt.isDataArrayTexture||Gt.isCompressedArrayTexture)&&(rt=!0);const Vt=Tt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Vt[W])?k=Vt[W][I]:k=Vt[W],st=!0):E.samples>0&&C.useMultisampledRTT(E)===!1?k=Tt.get(E).__webglMultisampledFramebuffer:Array.isArray(Vt)?k=Vt[I]:k=Vt,D.copy(E.viewport),B.copy(E.scissor),N=E.scissorTest}else D.copy(dt).multiplyScalar(H).floor(),B.copy(ft).multiplyScalar(H).floor(),N=vt;if(wt.bindFramebuffer(O.FRAMEBUFFER,k)&&F&&wt.drawBuffers(E,k),wt.viewport(D),wt.scissor(B),wt.setScissorTest(N),st){const Et=Tt.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+W,Et.__webglTexture,I)}else if(rt){const Et=Tt.get(E.texture),Gt=W||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Et.__webglTexture,I||0,Gt)}b=-1},this.readRenderTargetPixels=function(E,W,I,F,k,st,rt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ht=Tt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&rt!==void 0&&(ht=ht[rt]),ht){wt.bindFramebuffer(O.FRAMEBUFFER,ht);try{const Et=E.texture,Gt=Et.format,Vt=Et.type;if(!Ct.textureFormatReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ct.textureTypeReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=E.width-F&&I>=0&&I<=E.height-k&&O.readPixels(W,I,F,k,Nt.convert(Gt),Nt.convert(Vt),st)}finally{const Et=w!==null?Tt.get(w).__webglFramebuffer:null;wt.bindFramebuffer(O.FRAMEBUFFER,Et)}}},this.readRenderTargetPixelsAsync=async function(E,W,I,F,k,st,rt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ht=Tt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&rt!==void 0&&(ht=ht[rt]),ht){const Et=E.texture,Gt=Et.format,Vt=Et.type;if(!Ct.textureFormatReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ct.textureTypeReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(W>=0&&W<=E.width-F&&I>=0&&I<=E.height-k){wt.bindFramebuffer(O.FRAMEBUFFER,ht);const kt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,kt),O.bufferData(O.PIXEL_PACK_BUFFER,st.byteLength,O.STREAM_READ),O.readPixels(W,I,F,k,Nt.convert(Gt),Nt.convert(Vt),0);const Xt=w!==null?Tt.get(w).__webglFramebuffer:null;wt.bindFramebuffer(O.FRAMEBUFFER,Xt);const jt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await nm(O,jt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,kt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,st),O.deleteBuffer(kt),O.deleteSync(jt),st}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,W=null,I=0){E.isTexture!==!0&&(ga("WebGLRenderer: copyFramebufferToTexture function signature has changed."),W=arguments[0]||null,E=arguments[1]);const F=Math.pow(2,-I),k=Math.floor(E.image.width*F),st=Math.floor(E.image.height*F),rt=W!==null?W.x:0,ht=W!==null?W.y:0;C.setTexture2D(E,0),O.copyTexSubImage2D(O.TEXTURE_2D,I,0,0,rt,ht,k,st),wt.unbindTexture()},this.copyTextureToTexture=function(E,W,I=null,F=null,k=0){E.isTexture!==!0&&(ga("WebGLRenderer: copyTextureToTexture function signature has changed."),F=arguments[0]||null,E=arguments[1],W=arguments[2],k=arguments[3]||0,I=null);let st,rt,ht,Et,Gt,Vt,kt,Xt,jt;const ne=E.isCompressedTexture?E.mipmaps[k]:E.image;I!==null?(st=I.max.x-I.min.x,rt=I.max.y-I.min.y,ht=I.isBox3?I.max.z-I.min.z:1,Et=I.min.x,Gt=I.min.y,Vt=I.isBox3?I.min.z:0):(st=ne.width,rt=ne.height,ht=ne.depth||1,Et=0,Gt=0,Vt=0),F!==null?(kt=F.x,Xt=F.y,jt=F.z):(kt=0,Xt=0,jt=0);const be=Nt.convert(W.format),Jt=Nt.convert(W.type);let Ft;W.isData3DTexture?(C.setTexture3D(W,0),Ft=O.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(C.setTexture2DArray(W,0),Ft=O.TEXTURE_2D_ARRAY):(C.setTexture2D(W,0),Ft=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,W.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,W.unpackAlignment);const dn=O.getParameter(O.UNPACK_ROW_LENGTH),re=O.getParameter(O.UNPACK_IMAGE_HEIGHT),je=O.getParameter(O.UNPACK_SKIP_PIXELS),Gn=O.getParameter(O.UNPACK_SKIP_ROWS),Ne=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,ne.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ne.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Et),O.pixelStorei(O.UNPACK_SKIP_ROWS,Gt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Vt);const ii=E.isDataArrayTexture||E.isData3DTexture,ue=W.isDataArrayTexture||W.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const Qe=Tt.get(E),Vn=Tt.get(W),ze=Tt.get(Qe.__renderTarget),vn=Tt.get(Vn.__renderTarget);wt.bindFramebuffer(O.READ_FRAMEBUFFER,ze.__webglFramebuffer),wt.bindFramebuffer(O.DRAW_FRAMEBUFFER,vn.__webglFramebuffer);for(let Mn=0;Mn<ht;Mn++)ii&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Tt.get(E).__webglTexture,k,Vt+Mn),E.isDepthTexture?(ue&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Tt.get(W).__webglTexture,k,jt+Mn),O.blitFramebuffer(Et,Gt,st,rt,kt,Xt,st,rt,O.DEPTH_BUFFER_BIT,O.NEAREST)):ue?O.copyTexSubImage3D(Ft,k,kt,Xt,jt+Mn,Et,Gt,st,rt):O.copyTexSubImage2D(Ft,k,kt,Xt,jt+Mn,Et,Gt,st,rt);wt.bindFramebuffer(O.READ_FRAMEBUFFER,null),wt.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else ue?E.isDataTexture||E.isData3DTexture?O.texSubImage3D(Ft,k,kt,Xt,jt,st,rt,ht,be,Jt,ne.data):W.isCompressedArrayTexture?O.compressedTexSubImage3D(Ft,k,kt,Xt,jt,st,rt,ht,be,ne.data):O.texSubImage3D(Ft,k,kt,Xt,jt,st,rt,ht,be,Jt,ne):E.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,k,kt,Xt,st,rt,be,Jt,ne.data):E.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,k,kt,Xt,ne.width,ne.height,be,ne.data):O.texSubImage2D(O.TEXTURE_2D,k,kt,Xt,st,rt,be,Jt,ne);O.pixelStorei(O.UNPACK_ROW_LENGTH,dn),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,re),O.pixelStorei(O.UNPACK_SKIP_PIXELS,je),O.pixelStorei(O.UNPACK_SKIP_ROWS,Gn),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Ne),k===0&&W.generateMipmaps&&O.generateMipmap(Ft),wt.unbindTexture()},this.copyTextureToTexture3D=function(E,W,I=null,F=null,k=0){return E.isTexture!==!0&&(ga("WebGLRenderer: copyTextureToTexture3D function signature has changed."),I=arguments[0]||null,F=arguments[1]||null,E=arguments[2],W=arguments[3],k=arguments[4]||0),ga('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,W,I,F,k)},this.initRenderTarget=function(E){Tt.get(E).__webglFramebuffer===void 0&&C.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?C.setTextureCube(E,0):E.isData3DTexture?C.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?C.setTexture2DArray(E,0):C.setTexture2D(E,0),wt.unbindTexture()},this.resetState=function(){R=0,T=0,w=null,wt.reset(),Z.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=oe._getDrawingBufferColorSpace(t),e.unpackColorSpace=oe._getUnpackColorSpace()}}class pv extends we{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class dc extends ea{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Wt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Rs=new j,Cs=new j,Zl=new me,pa=new oc,es=new ks,Lo=new j,ql=new j;class mv extends we{constructor(t=new He,e=new dc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)Rs.fromBufferAttribute(e,a-1),Cs.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=Rs.distanceTo(Cs);t.setAttribute("lineDistance",new Se(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),es.copy(i.boundingSphere),es.applyMatrix4(a),es.radius+=s,t.ray.intersectsSphere(es)===!1)return;Zl.copy(a).invert(),pa.copy(t.ray).applyMatrix4(Zl);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const u=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=u,m=g-1;_<m;_+=l){const p=d.getX(_),v=d.getX(_+1),M=ns(this,t,pa,c,p,v);M&&e.push(M)}if(this.isLineLoop){const _=d.getX(g-1),m=d.getX(u),p=ns(this,t,pa,c,_,m);p&&e.push(p)}}else{const u=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=u,m=g-1;_<m;_+=l){const p=ns(this,t,pa,c,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=ns(this,t,pa,c,g-1,u);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function ns(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(Rs.fromBufferAttribute(o,a),Cs.fromBufferAttribute(o,s),e.distanceSqToSegment(Rs,Cs,Lo,ql)>i)return;Lo.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Lo);if(!(c<t.near||c>t.far))return{distance:c,point:ql.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const jl=new j,Kl=new j;class eh extends mv{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)jl.fromBufferAttribute(e,a),Kl.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+jl.distanceTo(Kl);t.setAttribute("lineDistance",new Se(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class hc extends He{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),l(i),d(),this.setAttribute("position",new Se(s,3)),this.setAttribute("normal",new Se(s.slice(),3)),this.setAttribute("uv",new Se(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(v){const M=new j,x=new j,U=new j;for(let R=0;R<e.length;R+=3)u(e[R+0],M),u(e[R+1],x),u(e[R+2],U),c(M,x,U,v)}function c(v,M,x,U){const R=U+1,T=[];for(let w=0;w<=R;w++){T[w]=[];const b=v.clone().lerp(x,w/R),y=M.clone().lerp(x,w/R),D=R-w;for(let B=0;B<=D;B++)B===0&&w===R?T[w][B]=b:T[w][B]=b.clone().lerp(y,B/D)}for(let w=0;w<R;w++)for(let b=0;b<2*(R-w)-1;b++){const y=Math.floor(b/2);b%2===0?(h(T[w][y+1]),h(T[w+1][y]),h(T[w][y])):(h(T[w][y+1]),h(T[w+1][y+1]),h(T[w+1][y]))}}function l(v){const M=new j;for(let x=0;x<s.length;x+=3)M.x=s[x+0],M.y=s[x+1],M.z=s[x+2],M.normalize().multiplyScalar(v),s[x+0]=M.x,s[x+1]=M.y,s[x+2]=M.z}function d(){const v=new j;for(let M=0;M<s.length;M+=3){v.x=s[M+0],v.y=s[M+1],v.z=s[M+2];const x=m(v)/2/Math.PI+.5,U=p(v)/Math.PI+.5;o.push(x,1-U)}g(),f()}function f(){for(let v=0;v<o.length;v+=6){const M=o[v+0],x=o[v+2],U=o[v+4],R=Math.max(M,x,U),T=Math.min(M,x,U);R>.9&&T<.1&&(M<.2&&(o[v+0]+=1),x<.2&&(o[v+2]+=1),U<.2&&(o[v+4]+=1))}}function h(v){s.push(v.x,v.y,v.z)}function u(v,M){const x=v*3;M.x=t[x+0],M.y=t[x+1],M.z=t[x+2]}function g(){const v=new j,M=new j,x=new j,U=new j,R=new ae,T=new ae,w=new ae;for(let b=0,y=0;b<s.length;b+=9,y+=6){v.set(s[b+0],s[b+1],s[b+2]),M.set(s[b+3],s[b+4],s[b+5]),x.set(s[b+6],s[b+7],s[b+8]),R.set(o[y+0],o[y+1]),T.set(o[y+2],o[y+3]),w.set(o[y+4],o[y+5]),U.copy(v).add(M).add(x).divideScalar(3);const D=m(U);_(R,y+0,v,D),_(T,y+2,M,D),_(w,y+4,x,D)}}function _(v,M,x,U){U<0&&v.x===1&&(o[M]=v.x-1),x.x===0&&x.z===0&&(o[M]=U/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hc(t.vertices,t.indices,t.radius,t.details)}}const is=new j,as=new j,Io=new j,ss=new rn;class gv extends He{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(fs*e),o=t.getIndex(),r=t.getAttribute("position"),c=o?o.count:r.count,l=[0,0,0],d=["a","b","c"],f=new Array(3),h={},u=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:p}=ss;if(_.fromBufferAttribute(r,l[0]),m.fromBufferAttribute(r,l[1]),p.fromBufferAttribute(r,l[2]),ss.getNormal(Io),f[0]=`${Math.round(_.x*a)},${Math.round(_.y*a)},${Math.round(_.z*a)}`,f[1]=`${Math.round(m.x*a)},${Math.round(m.y*a)},${Math.round(m.z*a)}`,f[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let v=0;v<3;v++){const M=(v+1)%3,x=f[v],U=f[M],R=ss[d[v]],T=ss[d[M]],w=`${x}_${U}`,b=`${U}_${x}`;b in h&&h[b]?(Io.dot(h[b].normal)<=s&&(u.push(R.x,R.y,R.z),u.push(T.x,T.y,T.z)),h[b]=null):w in h||(h[w]={index0:l[v],index1:l[M],normal:Io.clone()})}}for(const g in h)if(h[g]){const{index0:_,index1:m}=h[g];is.fromBufferAttribute(r,_),as.fromBufferAttribute(r,m),u.push(is.x,is.y,is.z),u.push(as.x,as.y,as.z)}this.setAttribute("position",new Se(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class uc extends hc{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,a=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(a,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new uc(t.radius,t.detail)}}class Ps extends He{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],c=[],l=[],d=[];let f=t;const h=(e-t)/a,u=new j,g=new ae;for(let _=0;_<=a;_++){for(let m=0;m<=i;m++){const p=s+m/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),c.push(u.x,u.y,u.z),l.push(0,0,1),g.x=(u.x/e+1)/2,g.y=(u.y/e+1)/2,d.push(g.x,g.y)}f+=h}for(let _=0;_<a;_++){const m=_*(i+1);for(let p=0;p<i;p++){const v=p+m,M=v,x=v+i+1,U=v+i+2,R=v+1;r.push(M,x,R),r.push(x,U,R)}}this.setIndex(r),this.setAttribute("position",new Se(c,3)),this.setAttribute("normal",new Se(l,3)),this.setAttribute("uv",new Se(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ps(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ns extends He{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],c=[],l=[],d=new j,f=new j,h=new j;for(let u=0;u<=i;u++)for(let g=0;g<=a;g++){const _=g/a*s,m=u/i*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(_),f.y=(t+e*Math.cos(m))*Math.sin(_),f.z=e*Math.sin(m),r.push(f.x,f.y,f.z),d.x=t*Math.cos(_),d.y=t*Math.sin(_),h.subVectors(f,d).normalize(),c.push(h.x,h.y,h.z),l.push(g/a),l.push(u/i)}for(let u=1;u<=i;u++)for(let g=1;g<=a;g++){const _=(a+1)*u+g-1,m=(a+1)*(u-1)+g-1,p=(a+1)*(u-1)+g,v=(a+1)*u+g;o.push(_,m,v),o.push(m,p,v)}this.setIndex(o),this.setAttribute("position",new Se(r,3)),this.setAttribute("normal",new Se(c,3)),this.setAttribute("uv",new Se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ns(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ea extends ea{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nd,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=Qr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class nh extends we{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Wt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class _v extends nh{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Wt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ko=new me,Jl=new j,Ql=new j;class xv{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ae(512,512),this.map=null,this.mapPass=null,this.matrix=new me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cc,this._frameExtents=new ae(1,1),this._viewportCount=1,this._viewports=[new Me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Jl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Jl),Ql.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ql),e.updateMatrixWorld(),ko.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ko),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ko)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class vv extends xv{constructor(){super(new qd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Mv extends nh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.target=new we,this.shadow=new vv}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const td=new me;class yv{constructor(t,e,i=0,a=1/0){this.ray=new oc(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new rc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return td.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(td),this}intersectObject(t,e=!0,i=[]){return Hr(t,this,i,e),i.sort(ed),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)Hr(t[a],this,i,e);return i.sort(ed),i}}function ed(n,t){return n.distance-t.distance}function Hr(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)Hr(s[o],t,e,!0)}}class Sv extends eh{constructor(t=10,e=10,i=4473924,a=8947848){i=new Wt(i),a=new Wt(a);const s=e/2,o=t/e,r=t/2,c=[],l=[];for(let h=0,u=0,g=-r;h<=e;h++,g+=o){c.push(-r,0,g,r,0,g),c.push(g,0,-r,g,0,r);const _=h===s?i:a;_.toArray(l,u),u+=3,_.toArray(l,u),u+=3,_.toArray(l,u),u+=3,_.toArray(l,u),u+=3}const d=new He;d.setAttribute("position",new Se(c,3)),d.setAttribute("color",new Se(l,3));const f=new dc({vertexColors:!0,toneMapped:!1});super(d,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Jr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Jr);const bv={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function Ev(n,t,e,i){const a=new an(n.fov,i,.1,200),s=new j,o=new j,r=new j;let c=!1,l=n.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function h(){const u=(n.pitchDeg+d.pitchDelta)*Math.PI/180,g=n.yawDeg*Math.PI/180;r.set(Math.sin(g)*Math.cos(u),Math.sin(u),Math.cos(g)*Math.cos(u)).multiplyScalar(n.distance*d.distanceScale*d.zoom)}return h(),{camera:a,update(u,g,_,m,p=bv){const v=g+.6;if(!c)s.set(u,v,_),c=!0;else{const U=1-Math.exp(-Math.max(n.smoothing,.001)*m);s.x+=(u-s.x)*U,s.y+=(v-s.y)*U,s.z+=(_-s.z)*U}const M=1-Math.exp(-Math.max(t.smoothing,.001)*m);d.distanceScale+=(p.distanceScale-d.distanceScale)*M,d.offsetX+=(p.offsetX-d.offsetX)*M,d.offsetZ+=(p.offsetZ-d.offsetZ)*M,d.pitchDelta+=(p.pitchDelta-d.pitchDelta)*M;const x=1-Math.exp(-Math.max(e.smoothing,.001)*m);d.zoom+=(f-d.zoom)*x,h(),(a.fov!==l||a.fov!==n.fov)&&(a.fov=n.fov,l=n.fov,a.updateProjectionMatrix()),o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(u){a.aspect=u,a.updateProjectionMatrix()},getGroundBasis(){const u=new j().setFromMatrixColumn(a.matrixWorld,0),g=new j().setFromMatrixColumn(a.matrixWorld,2).negate(),_=Math.hypot(u.x,u.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:u.x/_,rightZ:u.z/_,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...d}}}}const Mi=Math.PI*2,gn=1e-6;function Rn(n,t,e){return n<t?t:n>e?e:n}function ih(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function wv(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function ah(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=wv(n);return i===1?a:e+(a-e)*i}function nd(n){return(1-Math.sin(n))/2}function fc(n,t){if(!n.grounded||n.speed<gn)return ih();const e=n.speed/Math.max(n.moveSpeed,gn),i=Math.max(n.legLength,gn),a=n.stride>gn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),c=Math.abs(n.localRight),l=r+c+gn,d=r/l,f=c/l,h=n.localForward>=0?1:-1,u=n.localRight>=0?1:-1,g=a,_=N=>Math.asin(Rn(N,-o,o)/i);function m(N,V){const P=ah(N,t.plantLock),A=nd(N),X=h*d*g*P,H=-_(X),q=V*u>0?1:-1,Q=1+q*t.crossStep*.45,dt=u*q*t.crossStep*g*.4*A,ft=u*f*g*t.sideWeight*Q*P+dt*f,vt=_(ft),Y=t.kneeLift*A*s*(.55+.25*d+(q>0?.2*f:0));return{pitchX:H,rollZ:vt,kneeX:Y}}const p=(n.phase%Mi+Mi)%Mi,v=m(p,-1),M=m((p+Math.PI)%Mi,1),x=Math.cos(p),U=nd(p),R=-t.comSway*s*x*(.6*d+.8*f)-u*t.comSway*s*f*.45,T=t.comBob*U*s,w=u*t.hipLean*s*f*x*.6,b=u*t.hipLean*s*f*(.45+.25*x),y=t.armSwing*s*x*(d*h+.3*f),D=y,B=-y;return{legL:v,legR:M,pelvisX:R,pelvisY:T,pelvisRoll:w,sideLean:b,armL:D,armR:B,strafe:f,backward:h<0?d:0}}function sh(n){const t=(n%Mi+Mi)%Mi,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function oh(n,t,e){const i=Rn(e.progress,0,1);if(i>=1||n.speed<gn)return ih();const a=i*i*(3-2*i),s=1-a;return fc({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function rh(n,t,e,i){const a=Rn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Rn(o*a,-1,1)*(e*Math.PI/180)}function ch(n,t,e,i,a){const s=Math.max(e,gn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,c=t>gn?(t-n)/t:0,l=c>.02,d=c<-.015,f=n<=o*.15,h=!d&&n<r&&(l||f);return{enter:n>gn&&n<=o&&l,resume:!h}}function lh(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Rn(n*Rn(t,0,2),-i,i)}function dh(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function hh(n,t,e){const i=Rn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function Tv(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Rn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,c=r?1:.35,l=r?.35:1,d=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,h=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-d*c,rollZ:u*h*c,kneeX:f*c},legR:{pitchX:-d*l,rollZ:-u*h*l,kneeX:f*l},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function uh(n,t,e,i,a){const s=Rn(n,0,1),o=Rn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),c=r*r*(3-2*r),l=s<=o?c:1-c,d=Math.hypot(e,i),f=d>gn?e/d:1,h=d>gn?i/d:0,u=ah(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*l,trailPitch:Math.max(0,a.stopTrailPitch)*l,leadKnee:Math.max(0,a.stopStepKnee)*l,bodyShift:Math.max(0,a.stopBodyShift)*l,bodyDip:Math.max(0,a.stopBodyDip)*l,chestPitch:Math.max(0,a.stopChestPitch)*l,leadLeft:u,fwdN:f,rightN:h,env:l}}function Be(n){return n<0?0:n>1?1:n}const ms=Math.PI*2;function Av(n){return((n+Math.PI)%ms+ms)%ms-Math.PI}function Rv(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function Cv(n,t,e,i,a,s=n.phase){const o=Be(i);if(o<=0)return n;const r=Be(t),c=Math.max(1,Math.round(a.cycles)),l=Math.max(0,a.strideSpeed),d=e%2===0?1:-1,f=Be(a.forwardBias),h=Math.max(0,n.stride??0),u=Math.max(0,a.strideScale??0)*h,g=r<=.5?r*2:(r-.5)*2,_=g*g*(3-2*g),m=r<=.5?_:1-_,p={speed:l,phase:s+ms*c/2*m,localForward:l*f,localRight:l*(1-f)*d},v=Av(p.phase-n.phase),M=o*o*(3-2*o),x=n.speed>.05?h:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+v*M,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:x+(u-x)*o*o}}function Pv(n,t,e){const i=Rv(),a=Be(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,c=o>0,l=e.stepPitch*s,d=e.stepKnee*s,f=e.stepSide*s;return i.legL.pitchX=r?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=r?d:d*.4,i.legR.kneeX=c?d:d*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=f*.25*o,i}function fh(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function id(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*fh(s,a)}function Dv(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function Lv(n,t,e){const i=Be(n);return{gaitScale:1-i*(1-Be(t)),attackLegWeight:Be(e)*i}}function Iv(n,t){const e=Be(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function kv(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Be(t.minScale+(1-t.minScale)*e)}function Uv(){return ph()}function ph(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function Fv(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function Nv(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Be(t.forceHitHeight):n.type==="light"?Be(t.hitHeight.light):n.type==="heavy"?Be(t.hitHeight.heavy):n.type==="knock"?Be(t.hitHeight.knock):0}function zv(n,t,e){const i=Be(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function mh(n,t,e){const i=ph(),a=Fv(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=Be(1-n.timer/n.duration),o=fh(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=Nv(n,e);const r=Math.sin(t),c=Math.cos(t),l=Math.cos(t),d=-Math.sin(t),f=n.dirX*r+n.dirZ*c,h=n.dirX*l+n.dirZ*d;if(i.localFwd=f,i.localRight=h,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*s);return i.upperPitch=a*_*f,i.upperRoll=-a*_*h*.7,i.drop=(a>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const u=a*o,g=zv(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(g.upperPitch*f+g.fold),i.upperRoll=-u*g.upperRoll*h,i.upperYaw=u*g.upperYaw*h,i.upperShift=u*g.shift,i.upperShiftX=i.upperShift*h,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*h,i.comZ=i.comShift*f,i.pelvisBack=u*g.back,i.drop=u*g.drop,i.knee=u*g.knee,i.hip=u*g.hip,i.arm=u*g.arm,i.flash=e.flashStrength*o,i}function gh(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const ui=1e-6;function va(n,t,e){return n<t?t:n>e?e:n}function Ov(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=ui||s<=ui||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,c=Math.abs(a-s)+ui,l=Math.hypot(n.x,n.y,n.z);if(l<=ui)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),h=n.z,u=Math.hypot(h,f),g=va(u,c,r),_=u>r+ui||u<c-ui,m=Math.atan2(-h,Math.max(f,ui)),p=va((a*a+g*g-s*s)/(2*a*g),-1,1),v=va((s*s+g*g-a*a)/(2*s*g),-1,1),M=Math.acos(p),x=Math.acos(v),U=i>=0?1:-1;return{rootPitch:m-U*M,rootRoll:d,jointPitch:U*(M+x),clamped:_,reach:l/r}}function Bv(n,t,e,i){const a=va(e,0,1),s=Math.max(0,i),o=(r,c)=>{const l=va((c-r)*a,-s,s);return r+l};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function _h(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const pc={active:!1,weight:0,clamped:0,maxError:0};function xh(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...pc};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=a.map(u=>u.tip.getWorldPosition(new j));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),d=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<a.length;u++){const g=a[u],_=i.worldToLocal(c[u].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},p=Ov(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(f+=1);const v=Bv({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,l,d);g.root.rotation.x=v.rootPitch,g.root.rotation.z=v.rootRoll,g.joint.rotation.x=v.jointPitch}t.updateWorldMatrix(!0,!0);let h=0;for(let u=0;u<a.length;u++){const g=a[u].tip.getWorldPosition(new j);h=Math.max(h,g.distanceTo(c[u]))}return{active:!0,weight:l,clamped:f,maxError:h}}function en(n,t,e){return n<t?t:n>e?e:n}function Hv(n,t,e,i,a,s,o,r,c,l){const d=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Re,h=new Re;h.name="pelvis",h.position.y=n.legLength,f.add(h);const u=new Re;u.name="lower";const g=new Re;g.name="upper",h.add(u),h.add(g);const _=[],m=(tt,xt,Ht,at)=>{const Mt=new Ea({color:at}),z=new fe(new An(tt,xt,Ht),Mt);return z.castShadow=!0,z.receiveShadow=!0,_.push(Mt),z},p=n.headSize,v=n.legLength,M=n.armLength,x=n.limbThickness,U=n.bodyHeight,R=n.bodyWidth,T=m(R,U,.28,e);T.position.y=U/2,g.add(T);const w=new Re;w.name="headPivot",w.position.y=U,g.add(w);const b=m(p,p,p,e);b.position.y=p/2,w.add(b);for(const tt of[-1,1]){const xt=m(.06,.07,.02,t.shoe);xt.position.set(tt*.09,p/2+.03,p/2+.011),w.add(xt)}const y=(tt,xt)=>{const Ht=xt?M:v,at=new Re;at.name=xt?tt<0?"shoulderL":"shoulderR":tt<0?"hipL":"hipR",xt||(at.rotation.order="ZYX"),at.position.set(tt*(xt?R/2+x/2:R/2-x/2),xt?U-.04:0,0),(xt?g:u).add(at);const Mt=m(x,Ht/2,x,t.limb);Mt.position.y=-Ht/4,at.add(Mt);const z=new Re;z.name=xt?"elbow":"knee",z.position.y=-Ht/2,at.add(z);const nt=m(x,Ht/2,x,t.limb);if(nt.position.y=-Ht/4,z.add(nt),!xt){const ut=m(x*1.15,.07,x*1.7,t.shoe);ut.position.set(0,-Ht/2+.035,.045),z.add(ut);const Ut=new we;return Ut.name="footTip",Ut.position.y=-Ht/2,z.add(Ut),{root:at,joint:z,tip:Ut}}return{root:at,joint:z}},D=y(-1,!1),B=y(1,!1),N=y(-1,!0),V=y(1,!0),P=[D,B].map(tt=>({root:tt.root,joint:tt.joint,tip:tt.tip,upperLen:v/2,lowerLen:v/2,bend:1})),A=new cn({color:a.attackArcColor,transparent:!0,opacity:0,side:Ie,depthWrite:!1}),X=new fe(new Ns(.62,.042,6,20,Math.PI*1.1),A);X.position.set(0,.78-v,.56),g.add(X);const H=new Wt(e),q=new Wt(r.flashColor),Q=new Wt;let dt=null,ft=0,vt=0,Y=0,et=0,_t=0,K=0,pt=0,Pt={...pc},At=-1,zt=0,St=0,bt=0,O=0,Zt=0,Dt=0,Ct=0,wt=1,yt=0,Tt=0,C="none",S=0,G=!1,ct=-1,lt=!1,ot=0,It=0;return{group:f,update(tt,xt){f.position.set(tt.position.x,tt.position.y,tt.position.z),f.rotation.y=tt.bodyYaw,w.rotation.y=(tt.headYaw-tt.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,tt.mode!==dt&&(dt=tt.mode,ft=1),ft=Math.max(0,ft-xt*2.2);const Ht=tt.hurt,at=mh(Ht,tt.bodyYaw,r),Mt=at.flash;Q.copy(q).multiplyScalar(Mt);for(const rt of _)rt.emissive.copy(H).multiplyScalar(ft*.5),Mt>0&&rt.emissive.add(Q);h.position.set(0,v,0),h.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const z=Math.hypot(tt.velocity.x,tt.velocity.z),nt=en(o.knockGaitScale??0,0,1),ut=tt.hurt.knockX*nt,Ut=tt.hurt.knockZ*nt,Nt=nt>0&&Math.hypot(tt.hurt.knockX,tt.hurt.knockZ)>.001,Z=tt.velocity.x+ut,L=tt.velocity.z+Ut,it=Math.hypot(Z,L),$=Math.cos(tt.bodyYaw),J=-Math.sin(tt.bodyYaw),mt=z>1e-6?en((tt.velocity.x*$+tt.velocity.z*J)/z,-1,1):0;C==="settled"&&lt&&ot>It*1.02+1e-4&&(C="none");let gt=1;C==="blend"?(gt=hh(G?ct:S,o.stopYawBlendMode,G),G||(S=Math.min(1,S+xt/Math.max(.01,o.stopYawAfterSec)),(S>=1||o.stopYawBlendMode==="inStop"||lt)&&(C="settled",gt=0))):C==="settled"&&(gt=en(z/Math.max(1e-6,o.stopEnterRatio*s),0,1));const Ot=rh(mt,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost)*gt;yt+=(Ot-yt)*(1-Math.exp(-12*Math.max(0,xt))),u.rotation.y=yt;const Yt=tt.bodyYaw+yt,Qt=Math.sin(Yt),$t=Math.cos(Yt),le=Math.cos(Yt),he=-Math.sin(Yt),xe=Z*Qt+L*$t,ye=Z*le+L*he,se=Math.max(0,o.stopBlendSec||0),te=se>0&&!Nt,ve=ch(z,Tt,s,o.stopEnterRatio,o.stopExitRatio);if(!te||ve.resume)At=-1;else if(At<0&&ve.enter){At=0,zt=tt.gaitPhase,St=sh(tt.gaitPhase),bt=z,O=Math.max(tt.stride,1e-6),Zt=xe,Dt=ye;const rt=1/Math.max(1e-6,z);Ct=tt.velocity.x*rt,wt=tt.velocity.z*rt}const Lt=Tt;Tt=z;const Bt=te&&At>=0;Bt&&(At=Math.min(1,At+xt/se)),Bt&&C!=="blend"&&(C="blend",S=0),G=Bt&&At<1,ct=At,lt=ve.resume,ot=z,It=Lt;const ge=Bt?{phase:zt,speed:bt,moveSpeed:s,localForward:Zt,localRight:Dt,legLength:n.legLength,stride:O,grounded:!0}:{phase:tt.gaitPhase,speed:it,moveSpeed:s,localForward:xe,localRight:ye,legLength:n.legLength,stride:tt.stride,grounded:!0},ee=Bt?oh(ge,o,{progress:At,phase0:zt,phaseEnd:St}):fc(ge,o);let Te=0,Ze=0,qe=0,ln=0;if(Bt){const rt=dh(tt.bodyYaw,Ct,wt),ht=uh(At,zt,rt.forward,rt.right,o);ht.leadLeft?(ee.legL.pitchX-=ht.leadPitch,ee.legL.kneeX+=ht.leadKnee,ee.legR.pitchX+=ht.trailPitch):(ee.legR.pitchX-=ht.leadPitch,ee.legR.kneeX+=ht.leadKnee,ee.legL.pitchX+=ht.trailPitch),Ze=ht.bodyShift*ht.fwdN,Te=ht.bodyShift*ht.rightN,qe=ht.bodyDip,ln=ht.chestPitch}D.root.rotation.x=ee.legL.pitchX,B.root.rotation.x=ee.legR.pitchX,D.root.rotation.z=ee.legL.rollZ,B.root.rotation.z=ee.legR.rollZ,D.joint.rotation.x=ee.legL.kneeX,B.joint.rotation.x=ee.legR.kneeX,N.root.rotation.x=ee.armL,V.root.rotation.x=ee.armR,N.joint.rotation.x=-.18,V.joint.rotation.x=-.18,h.position.x=ee.pelvisX,h.position.y=v+ee.pelvisY,h.position.z=0,h.rotation.z=ee.pelvisRoll,g.rotation.z=ee.sideLean*(at.intensity>0?.4:1);const ni=_h(h,u),E=Bt&&d.enabled?{...d,weight:1}:d,W=E.enabled&&E.weight>0?en(E.weight,0,1):0;if(h.position.x+=Te,h.position.z+=Ze,h.position.y-=qe,u.position.y+=qe,W<=0&&(u.position.x-=Te,u.position.z-=Ze),c){const rt=Math.max(.004166666666666667,Math.min(xt,.1)),ht=Math.sin(tt.bodyYaw),Et=Math.cos(tt.bodyYaw),Gt=en((tt.velocity.x-vt)/rt,-60,60),Vt=en((tt.velocity.z-Y)/rt,-60,60),kt=Gt*ht+Vt*Et,Xt=Fe(tt.bodyYaw-et)/rt,jt=c.maxForwardDeg*Math.PI/180,ne=c.maxSideDeg*Math.PI/180,be=1-Math.exp(-Math.max(0,c.smoothing)*rt);_t+=(en(kt*c.accelGain,-jt,jt)-_t)*be,K+=(en(-Xt*z*c.turnGain,-ne,ne)-K)*be;const Jt=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;pt+=(en(z/Math.max(s,1e-6),0,1)-pt)*(1-Math.exp(-Math.max(0,Jt)*rt));const Ft=gh({leanForward:_t,leanSide:K,speedRatio:pt},c);g.rotation.x+=_t+ln,g.rotation.z+=K,h.rotation.x+=Ft.pelvisPitch,h.rotation.z+=Ft.pelvisRoll,h.position.x+=Ft.pelvisX,h.position.z+=Ft.pelvisZ,h.position.y-=Ft.crouch,u.position.y+=Ft.crouch*(1-W)}vt=tt.velocity.x,Y=tt.velocity.z,et=tt.bodyYaw,g.rotation.x+=at.upperPitch,g.rotation.z+=at.upperRoll,g.rotation.y+=at.upperYaw;const I=en(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),F=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=en(at.upperShiftX*I,-F,F),g.position.z+=en(at.upperShiftZ*I,-F,F),h.position.x+=at.comX,h.position.z+=at.comZ-at.pelvisBack,h.position.y-=at.drop;const k=at.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=at.pelvisBack*(1-k),u.position.y+=at.drop*(1-k),D.joint.rotation.x+=at.knee,B.joint.rotation.x+=at.knee,D.root.rotation.x-=at.hip,B.root.rotation.x-=at.hip,N.root.rotation.x+=at.arm,V.root.rotation.x+=at.arm*.8,tt.attackPhase!=="idle"&&at.intensity===0){const rt=tt.attackProgress,ht=rt<.34?-1:rt<.68?-1+(rt-.34)/.34*2:Math.max(0,1-(rt-.68)/.32),Et=Math.max(0,-ht),Gt=Math.max(0,ht);V.root.rotation.x=-1.7*Et+1.25*Gt,V.joint.rotation.x=-(.25+Et*.45),g.rotation.y=-.28*ht,A.opacity=tt.attackPhase==="active"?.85:0,tt.attackPhase==="active"&&(X.rotation.z=-1.1+rt*3)}else A.opacity=0;const st=lh(yt,o.chestYawScale,o.chestYawMaxDeg);g.rotation.y+=st,w.rotation.y=(tt.headYaw-tt.bodyYaw-st+Math.PI*3)%(Math.PI*2)-Math.PI,Pt=xh({root:f,pelvis:h,lower:u,limbs:P,base:ni,cfg:E,grounded:!0,attacking:tt.attackPhase!=="idle"})},ik(){return Pt},dispose(){f.traverse(tt=>{if(tt instanceof fe){tt.geometry.dispose();const xt=tt.material;Array.isArray(xt)?xt.forEach(Ht=>Ht.dispose()):xt.dispose()}})}}}const mc=64,vh=[0,.24,.76,1],Gv=[0,1,1,0],Mh=[0,.12,.28,.5,.72,.88,1],Vv=[0,.16,.5,1,.5,.16,0];function ad(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function gc(n,t,e,i,a=mc,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),c=s==="glow"?Mh:vh,l=s==="glow"?Vv:Gv,d=c.length,f=a+1,h=new Float32Array(f*d*3),u=new Float32Array(f*d*4),g=[];for(let m=0;m<f;m++){const p=m/a,v=(p-.5)*e,M=ad(p,i)*ad(1-p,i),x=Math.sin(v),U=Math.cos(v);for(let R=0;R<d;R++){const T=o+(r-o)*c[R],w=m*d+R;h[w*3]=x*T,h[w*3+1]=0,h[w*3+2]=U*T;const b=M*l[R];u[w*4]=1,u[w*4+1]=1,u[w*4+2]=1,u[w*4+3]=b}}for(let m=0;m<a;m++)for(let p=0;p<d-1;p++){const v=m*d+p,M=v+d;g.push(v,M,v+1,v+1,M,M+1)}const _=new He;return _.setAttribute("position",new Ye(h,3)),_.setAttribute("color",new Ye(u,4)),_.setIndex(g),_.computeBoundingSphere(),_}function Uo(n){const t=new cn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Ie,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(c,l)=>{const d=Math.round(c*32)/32,f=Math.max(.05,Math.round(l*20)/20),h=`${Math.round(d*32)}|${Math.round(f*20)}`,u=e.get(h);if(u)return u;const g=gc(n.radius,n.thickness*f,d,n.edgeFade,mc,n.profile??"band");if(e.set(h,g),e.size>64){for(const[_,m]of e)if(_!==h&&m!==i){m.dispose(),e.delete(_);break}}return g};i=a(n.arcRad,1);const s=new fe(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(c,l,d,f,h,u=1){const g=Math.max(.05,u);(Math.abs(c-o)>.01||Math.abs(g-r)>.01)&&(i=a(c,g),s.geometry=i,o=c,r=g),t.opacity=l,t.color.copy(f),s.scale.set(d,1,d),s.rotation.y=h,s.visible=l>.002},arcRad(){return o},dispose(){for(const c of e.values())c.dispose();e.clear(),t.dispose()}}}function sd(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function Xv(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),c=Math.min(1,Math.max(0,e)),l=a.selectedArcDeg*Math.PI/180,d=s+(l-s)*(.35+.65*r),f=4+4*r+6*c,h=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*c)*r+.04*h),g=1+.02*r+.012*h*r;return{arcRad:d,opacity:u,scale:g,level:r}}function Wv(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function $v(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let l=0;l<i;l++){const d=l/n*Math.PI*2,f=Math.sin(d),h=Math.cos(d);for(let u=0;u<a;u++){const g=u/e,_=t+(1-t)*g,m=l*a+u;s[m*3]=f*_,s[m*3+1]=0,s[m*3+2]=h*_;const p=Math.pow(1-g,1.8)*.9+(u===0?.1:0);o[m*4]=1,o[m*4+1]=1,o[m*4+2]=1,o[m*4+3]=Math.min(1,p)}}for(let l=0;l<n;l++)for(let d=0;d<e;d++){const f=l*a+d,h=f+a;r.push(f,h,f+1,f+1,h,h+1)}const c=new He;return c.setAttribute("position",new Ye(s,3)),c.setAttribute("color",new Ye(o,4)),c.setIndex(r),c.computeBoundingSphere(),c}function od(n){const t=n.segments??mc,e=n.profile??"band",a=((e==="glow"?Mh.length:vh.length)-1)*6,s=gc(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new cn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ie,vertexColors:!0,toneMapped:!1}),r=new fe(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let c=0;return{mesh:r,set(l,d,f,h,u=1){const g=Math.min(1,Math.max(0,l)),_=Math.round(g*t),m=g>.001?Math.max(1,_)*a:0;m!==s.drawRange.count&&s.setDrawRange(0,m),c=_,o.opacity=d,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=h,r.visible=d>.002&&g>.001},ratio(){return t>0?c/t:0},filledSegments(){return c},dispose(){s.dispose(),o.dispose()}}}function rd(n){const t=new Re,e=$v(48),i=new cn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ie,vertexColors:!0,toneMapped:!1}),a=new fe(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=gc(1-s*.5,s,Math.PI*2,0,64,"band"),r=new cn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ie,vertexColors:!0,toneMapped:!1}),c=new fe(o,r);return c.renderOrder=(n.renderOrder??2)+1,t.add(c),t.position.y=n.y,{group:t,set(l,d,f,h,u,g){const _=Math.min(1,Math.max(0,u));t.position.set(l,f,d),a.scale.set(h,1,h),c.scale.set(h,1,h),i.opacity=_*.26,r.opacity=_*(.72+.18*Math.sin(g*7)),t.visible=_>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function cd(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function Yv(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function Zv(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){const t=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/t))}}return n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function qv(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function jv(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function Kv(n,t,e){return n?t:e}function yh(n){return{x:0,y:0,z:1}}function Jv(n){return Math.asin(yh().y)}function Qv(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}function Le(n,t,e){return n<t?t:n>e?e:n}const ma=1e-6;function _e(n,t,e,i){const a=new fe(new An(n,t,e),new Ea({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function Ae(){return new Re}function gs(n,t,e){const i=Ae(),a=_e(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=_e(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=_e(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=_e(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const c=_e(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function tM(n){const t=gs(.72,.15,n),e=_e(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function eM(n){const t=Ae(),e=_e(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=_e(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function nM(n){const t=Ae(),e=_e(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=_e(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new Wt(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function iM(n){const t=Ae();for(let i=0;i<5;i++){const a=(i-2)*.15,s=_e(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=_e(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function aM(n){const t=Ae(),e=_e(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=_e(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function sM(n,t,e,i,a,s,o,r,c,l,d){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},h=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},u=Ae(),g=Ae();g.name="pelvis",g.position.y=n.legLength,u.add(g);const _=Ae();_.name="lower";const m=Ae();m.name="upper",g.add(_),g.add(m);const p=n.headSize,v=n.legLength,M=n.armLength,x=n.limbThickness,U=n.bodyHeight,R=n.bodyWidth,T=_e(R,U,.28,t.body);T.position.y=U/2,m.add(T);const w=Ae();w.name="headPivot",w.position.y=i.headPivotHeight,m.add(w);const b=_e(p,p,p,t.head);b.position.y=p/2,w.add(b);const y=new Ea({color:"#1b2733"});for(const I of[-1,1]){const F=new fe(new An(.06,.07,.02),y);F.position.set(I*.09,p/2+.03,p/2+.011),w.add(F)}const D=I=>{const F=Ae();F.name=I<0?"hipL":"hipR",F.rotation.order="ZYX",F.position.set(I*(R/2-x/2),0,0),_.add(F);const k=_e(x,v/2,x,t.limb);k.position.y=-v/4,F.add(k);const st=Ae();st.name="knee",st.position.y=-v/2,F.add(st);const rt=_e(x,v/2,x,t.limb);rt.position.y=-v/4,st.add(rt);const ht=_e(x*1.15,.07,x*1.7,t.shoe);ht.position.set(0,-v/2+.035,.045),st.add(ht);const Et=new we;return Et.name="footTip",Et.position.y=-v/2,st.add(Et),{root:F,joint:st,hand:Ae(),tip:Et}},B=I=>{const F=Ae();F.name=I<0?"shoulderL":"shoulderR",F.position.set(I*(R/2+x/2),U-.04,0),m.add(F);const k=_e(x,M/2,x,t.limb);k.position.y=-M/4,F.add(k);const st=Ae();st.name="elbow",st.position.y=-M/2,F.add(st);const rt=_e(x,M/2,x,t.limb);rt.position.y=-M/4,st.add(rt);const ht=Ae();ht.position.y=-M/2,st.add(ht);const Et=_e(x*1.1,.09,x*1.1,t.head);return Et.position.y=.045,ht.add(Et),{root:F,joint:st,hand:ht}},N=D(-1),V=D(1),P=B(-1),A=B(1),X=[N,V].map(I=>({root:I.root,joint:I.joint,tip:I.tip,upperLen:v/2,lowerLen:v/2,bend:1})),H=Ae(),q=Ae();A.hand.add(H),P.hand.add(q);const Q=nM(t),dt=iM(t),ft=aM(t),vt={"sword-shield":{right:gs(.42,.075,t),left:eM(t)},"dual-swords":{right:gs(.42,.075,t),left:gs(.42,.075,t)},greatsword:{right:tM(t),left:_e(.12,.2,.12,t.wood)},staff:{right:Q.g,left:Ae(),orb:Q.orb},bow:{right:ft,left:dt.g,arrow:ft,drawString:dt.drawString}};for(const I of Object.keys(vt))H.add(vt[I].right),q.add(vt[I].left),vt[I].right.visible=!1,vt[I].left.visible=!1;let Y=null,et=0,_t=0,K=0,pt=0,Pt=0,At=0,zt=Uv(),St={...pc},bt=0,O=0,Zt=0,Dt=-1,Ct=0,wt=0,yt=0,Tt=0,C=0,S=0,G=0,ct=1,lt=0,ot=0,It=0,tt=!1,xt=0,Ht=0,at=0,Mt=0,z="none",nt=0,ut=1,Ut=!1,Nt=-1,Z=!1,L=0,it=0,$=0,J=0,mt=0,gt=1,Ot={speed:0,phase:0},Yt={lp:0,lr:0,rp:0,rr:0},Qt=0,$t=0,le=!0,he=0,xe="none",ye=0,se=0,te=0,ve=.3,Lt=0;function Bt(I){const F=Math.PI/180,k=s;let st=0,rt=0,ht=0,Et=0;I==="sword-shield"?(st=k.swordPitchDeg*F,rt=-k.swordYawDeg*F,ht=k.shieldPitchDeg*F):I==="dual-swords"?(st=k.swordPitchDeg*F,rt=-k.swordYawDeg*F,ht=k.swordPitchDeg*F,Et=k.swordYawDeg*F):I==="greatsword"?(st=k.greatswordPitchDeg*F,rt=-k.greatswordYawDeg*F,ht=k.greatswordPitchDeg*F,Et=k.greatswordYawDeg*F):I==="staff"?st=k.staffPitchDeg*F:ht=k.bowPitchDeg*F,H.rotation.set(st,0,rt),q.rotation.set(ht,0,Et)}function ge(I){if(I!==Y){Y=I;for(const F of Object.keys(vt))vt[F].right.visible=F===I,vt[F].left.visible=F===I;Bt(I),dt.drawString.position.z=-.06,ft.position.z=0,Q.orb.scale.setScalar(1),m.rotation.y=0}}ge("sword-shield");const ee=[];u.traverse(I=>{I instanceof fe&&I.material instanceof Ea&&ee.push(I.material)});const Te=new Wt(r.flashColor);function Ze(I,F){const k=mh(I,F,r);zt=k,m.rotation.x+=k.upperPitch,m.rotation.z+=k.upperRoll,m.rotation.y+=k.upperYaw;const st=Le(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),rt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Le(k.upperShiftX*st,-rt,rt),m.position.z+=Le(k.upperShiftZ*st,-rt,rt),g.position.x+=k.comX,g.position.z+=k.comZ-k.pelvisBack,g.position.y-=k.drop;const ht=k.legacy?0:Le(r.lowerScale,0,1);_.position.z+=k.pelvisBack*(1-ht),_.position.y+=k.drop*(1-ht),N.joint.rotation.x+=k.knee,V.joint.rotation.x+=k.knee,N.root.rotation.x-=k.hip,V.root.rotation.x-=k.hip,P.root.rotation.x+=k.arm,A.root.rotation.x+=k.arm*.8;for(const Et of ee)Et.emissive.copy(Te).multiplyScalar(k.flash)}function qe(I){return I<.3?-1:I<.62?-1+(I-.3)/.32*2:Math.max(0,1-(I-.62)/.38)}function ln(I){if(I.phase==="idle"||I.charging)return;const F=I.attackProgress,k=qe(F),st=Math.max(0,k),rt=I.comboIndex%2===0?1:-1,ht=c.stride,Et=Number.isFinite(ht.stepReach)?ht.stepReach:.17,Gt=Number.isFinite(ht.stepSideReach)?ht.stepSideReach:.14,Vt=Number.isFinite(ht.stepDipReach)?ht.stepDipReach:.05,kt=I.weapon==="greatsword"?Le(Number.isFinite(ht.heavyScale)?ht.heavyScale:1,0,1):1;g.position.z+=Et*st*kt,g.position.x+=rt*Gt*st*kt,g.position.y-=Vt*Math.sin(Math.PI*F)*kt}function ni(I){if(dt.drawString.position.z=-.06,ft.position.z=0,Q.orb.scale.setScalar(1),m.rotation.y=0,I.charging&&I.weapon==="bow"){const rt=I.charge;P.root.rotation.x=-1.25,P.joint.rotation.x=-.15,A.root.rotation.x=.35+rt*.3,A.joint.rotation.x=-1.15,dt.drawString.position.z=-.06-rt*.22,ft.position.z=-rt*.3,m.rotation.y=-.22;return}if(I.phase==="idle")return;const F=qe(I.attackProgress),k=Math.max(0,-F),st=Math.max(0,F);if(I.weapon==="bow")P.root.rotation.x=-1.2,P.joint.rotation.x=-.15,A.root.rotation.x=.9-st*.8,A.joint.rotation.x=-.3;else if(I.weapon==="greatsword"){const rt=-1.6*k+1.25*st,ht=Le(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);A.root.rotation.x=rt,A.joint.rotation.x=-(.25+k*.4),P.root.rotation.x=rt+.06,P.joint.rotation.x=-(.32+k*.4),P.root.rotation.z=.38,m.rotation.y=-.2*F*ht}else{const rt=I.comboIndex;if(rt===1)A.root.rotation.x=-1.7*k+1.1*st,A.joint.rotation.x=-(.2+k*.5),P.root.rotation.x=.1,m.rotation.y=-.18*F;else if(rt===2)P.root.rotation.x=-1.5*k+1*st,P.joint.rotation.x=-(.2+k*.5),A.root.rotation.x=.2,m.rotation.y=.45*-F;else{const ht=-1.9*k+1.2*st;P.root.rotation.x=ht,A.root.rotation.x=ht,P.joint.rotation.x=-(.15+k*.4),A.joint.rotation.x=-(.15+k*.4),m.rotation.y=-.3*F}}ln(I)}function E(I,F){I&&(A.root.rotation.x=-1.05,A.joint.rotation.x=-.35,P.root.rotation.x=-.45,P.joint.rotation.x=-.2,m.rotation.y=-.12,Q.orb.scale.setScalar(1.25+.12*Math.sin(F*2)))}function W(I){if(!I||I.phase==="idle")return;const F=I.progress,k=F<.3?-.35+F/.3*1.35:F<.7?1:Math.max(0,1-(F-.7)/.3),st=Math.PI/180;m.rotation.x+=h.leanDeg*st*k,P.root.rotation.x-=h.shieldPitchDeg*st*k,P.joint.rotation.x-=.22*k,A.root.rotation.x-=.3*k,g.position.z+=h.pelvisReach*Math.max(0,k)}return{group:u,update(I,F,k,st,rt=!1,ht,Et,Gt){ge(F.weapon),m.rotation.x=0,m.rotation.z=0,g.position.x=0,g.position.y=v,g.position.z=0,g.rotation.z=0,g.rotation.x=0,m.position.x=0,m.position.y=0,m.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const Vt=Math.max(1/240,Math.min(st,.1)),kt=ht===void 0?Qt+=st:ht;$t=kt;const Xt=c.landing;Xt.enabled?le&&!I.grounded?(xe="jump",ye=kt,se=Xt.anticipationDuration,te=Math.max(0,Xt.jumpAnticipation),ve=.32):!le&&I.grounded&&(xe="land",ye=kt,se=Xt.duration,te=kv(he,Xt),ve=Xt.compressRatio,Lt=he):(xe="none",te=0),kt<ye&&(xe="none",te=0),le=I.grounded,he=I.velocity.y;const jt=id(kt,ye,se,te,ve),ne=F.phase!=="idle",be=(Gt==null?void 0:Gt.phase)==="active";J=Dv(J,ne,Vt,c.attack.blendRate);const Jt=Lv(J,c.attack.gaitWeight,c.attack.lowerBodyWeight);mt=Jt.attackLegWeight,gt=Jt.gaitScale;const Ft=Math.sin(I.bodyYaw),dn=Math.cos(I.bodyYaw),re=(I.velocity.x-et)/Vt,je=(I.velocity.z-_t)/Vt,Gn=Le(re,-60,60),Ne=Le(je,-60,60),ii=Gn*Ft+Ne*dn,ue=Fe(I.bodyYaw-K)/Vt,Qe=Math.hypot(I.velocity.x,I.velocity.z),Vn=o.maxForwardDeg*Math.PI/180,ze=o.maxSideDeg*Math.PI/180,vn=Le(ii*o.accelGain,-Vn,Vn),Mn=Le(-ue*Qe*o.turnGain,-ze,ze),ia=1-Math.exp(-o.smoothing*Vt);pt+=(vn-pt)*ia,Pt+=(Mn-Pt)*ia,et=I.velocity.x,_t=I.velocity.z,K=I.bodyYaw;const Cn=Math.hypot(I.velocity.x,I.velocity.z),zs=Le(a.knockGaitScale??0,0,1),Sh=k.knockX*zs,bh=k.knockZ*zs,Eh=zs>0&&Math.hypot(k.knockX,k.knockZ)>.001,Os=I.velocity.x+Sh,Bs=I.velocity.z+bh,_c=Math.hypot(Os,Bs);Mt=_c;const wh=Math.cos(I.bodyYaw),Th=-Math.sin(I.bodyYaw),Ah=I.velocity.x*wh+I.velocity.z*Th,Rh=Cn>ma?Le(Ah/Cn,-1,1):0;z==="settled"&&Z&&L>it*1.02+1e-4&&(z="none");let aa=1;z==="blend"?(aa=hh(Ut?Nt:nt,a.stopYawBlendMode,Ut),Ut||(nt=Math.min(1,nt+Vt/Math.max(.01,a.stopYawAfterSec)),(nt>=1||a.stopYawBlendMode==="inStop"||Z)&&(z="settled",aa=0))):z==="settled"&&(aa=Le(Cn/Math.max(ma,a.stopEnterRatio*e),0,1)),ut=aa;const Ch=rh(Rh,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost)*aa;O+=(Ch-O)*(1-Math.exp(-i.hipYawSmoothing*Vt));const sa=I.bodyYaw+O;Zt=sa;const Ph=Math.sin(sa),Dh=Math.cos(sa),Lh=Math.cos(sa),Ih=-Math.sin(sa),Ca={speed:_c,phase:I.gaitPhase,localForward:Os*Ph+Bs*Dh,localRight:Os*Lh+Bs*Ih,stride:I.stride};ne&&!tt&&(It=I.gaitPhase),tt=ne;const Ei=J>0?Cv(Ca,F.attackProgress,F.comboIndex,J,c.stride,It):Ca;Ot=Ei;const xc=Math.max(0,a.stopBlendSec||0),vc=xc>0&&!ne&&!Eh&&I.grounded,Hs=ch(Cn,lt,e,a.stopEnterRatio,a.stopExitRatio);if(!vc||Hs.resume)Dt=-1;else if(Dt<0&&Hs.enter){Dt=0,Ct=I.gaitPhase,wt=sh(I.gaitPhase),yt=Cn,Tt=Math.max(I.stride,ma),C=Ca.localForward,S=Ca.localRight;const pe=1/Math.max(ma,Cn);G=I.velocity.x*pe,ct=I.velocity.z*pe}const kh=lt;lt=Cn;const ai=vc&&Dt>=0;ai&&(Dt=Math.min(1,Dt+Vt/xc)),ai&&z!=="blend"&&(z="blend",nt=0),Ut=ai&&Dt<1,Nt=Dt,Z=Hs.resume,L=Cn,it=kh;const Mc=ai?{phase:Ct,speed:yt,moveSpeed:e,localForward:C,localRight:S,legLength:n.legLength,stride:Tt,grounded:!0}:{phase:Ei.phase,speed:Ei.speed,moveSpeed:e,localForward:Ei.localForward,localRight:Ei.localRight,legLength:n.legLength,stride:Ei.stride??0,grounded:I.grounded},Uh=ai?oh(Mc,a,{progress:Dt,phase0:Ct,phaseEnd:wt}):fc(Mc,a),ce=Iv(Uh,Jt.gaitScale);if($=0,be&&Gt){const pe=Tv(Gt.progress,Gt.dir,a),ie=Jt.gaitScale;ce.legL.pitchX+=pe.legL.pitchX*ie,ce.legL.rollZ+=pe.legL.rollZ*ie,ce.legL.kneeX+=pe.legL.kneeX*ie,ce.legR.pitchX+=pe.legR.pitchX*ie,ce.legR.rollZ+=pe.legR.rollZ*ie,ce.legR.kneeX+=pe.legR.kneeX*ie,ce.pelvisY+=pe.pelvisY*ie,$=pe.env}let Gs=0,Vs=0,Xs=0,yc=0;if(ai){const pe=dh(I.bodyYaw,G,ct),ie=uh(Dt,Ct,pe.forward,pe.right,a);ie.leadLeft?(ce.legL.pitchX-=ie.leadPitch,ce.legL.kneeX+=ie.leadKnee,ce.legR.pitchX+=ie.trailPitch):(ce.legR.pitchX-=ie.leadPitch,ce.legR.kneeX+=ie.leadKnee,ce.legL.pitchX+=ie.trailPitch),Vs=ie.bodyShift*ie.fwdN,Gs=ie.bodyShift*ie.rightN,Xs=ie.bodyDip,yc=ie.chestPitch,xt=ie.leadPitch,Ht=ie.bodyShift,at=ie.bodyDip}else xt=0,Ht=0,at=0;Yt={lp:ce.legL.pitchX,lr:ce.legL.rollZ,rp:ce.legR.pitchX,rr:ce.legR.rollZ},I.grounded?(N.root.rotation.x=ce.legL.pitchX,V.root.rotation.x=ce.legR.pitchX,N.root.rotation.z=ce.legL.rollZ,V.root.rotation.z=ce.legR.rollZ,N.joint.rotation.x=ce.legL.kneeX,V.joint.rotation.x=ce.legR.kneeX,P.root.rotation.x=ce.armL,A.root.rotation.x=ce.armR,P.joint.rotation.x=-(.18+ce.armL*.2),A.joint.rotation.x=-(.18+ce.armR*.2),P.root.rotation.z=0,A.root.rotation.z=0,g.position.x=ce.pelvisX,g.position.y=v+ce.pelvisY,g.position.z=0,g.rotation.z=ce.pelvisRoll):(N.root.rotation.x=-.55,V.root.rotation.x=-.25,N.joint.rotation.x=.75,V.joint.rotation.x=.55,P.root.rotation.x=-.9,A.root.rotation.x=-.7,P.joint.rotation.x=-.6,A.joint.rotation.x=-.6,N.root.rotation.z=0,V.root.rotation.z=0);const Fh=_h(g,_),oa=be?{...f,weight:0}:ai&&f.enabled?{...f,weight:1}:f,Sc=oa.enabled&&I.grounded&&oa.weight>0?Le(oa.weight,0,1)*(ne?Le(oa.attackScale,0,1):1):0;g.position.x+=Gs,g.position.z+=Vs,g.position.y-=Xs,_.position.y+=Xs,Sc<=0&&(_.position.x-=Gs,_.position.z-=Vs);const Nh=Cn/Math.max(e,ma),zh=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Oh=1-Math.exp(-Math.max(0,zh)*Vt);bt+=(Le(Nh,0,1)-bt)*Oh;const wi=gh({leanForward:pt,leanSide:Pt,speedRatio:bt},o);g.rotation.x+=wi.pelvisPitch,g.rotation.z+=wi.pelvisRoll,g.position.x+=wi.pelvisX,g.position.z+=wi.pelvisZ,g.position.y-=wi.crouch,_.position.y+=wi.crouch*(1-Le(Sc,0,1)),ni(F),E(rt,I.gaitPhase),W(Et);const Bh=s.greatswordPitchDeg*Math.PI/180,bc=F.weapon==="greatsword",Ec=Math.hypot(I.velocity.x,I.velocity.z),Hh=bc&&F.phase==="idle"&&Ec>.5?Math.min(1.15,Ec/Math.max(e,.001)*.9):0;At+=(Hh-At)*(1-Math.exp(-6*Vt)),bc&&(H.rotation.x=Bh+At),F.weapon==="bow"&&(dt.g.rotation.x=-(P.root.rotation.x+P.joint.rotation.x),ft.rotation.x=-(A.root.rotation.x+A.joint.rotation.x));const Gh=m.rotation.y;Ze(k,I.bodyYaw);const wc=k.type==="none"?1:.4;if(m.rotation.x+=pt*wc+yc,m.rotation.z+=(Pt+ce.sideLean)*wc,jt>0&&(N.root.rotation.x-=Xt.hipPitch*jt,V.root.rotation.x-=Xt.hipPitch*jt,N.joint.rotation.x+=Xt.kneeBend*jt,V.joint.rotation.x+=Xt.kneeBend*jt,g.position.y-=Xt.crouchDepth*jt,_.position.y+=Xt.crouchDepth*(1-Xt.lowerScale)*jt,m.rotation.x+=Xt.upperPitch*jt,P.root.rotation.x-=Xt.armTuck*jt,A.root.rotation.x-=Xt.armTuck*jt),mt>0&&I.grounded){const pe=Pv(F.attackProgress,F.comboIndex,c.stride),ie=mt;N.root.rotation.x+=pe.legL.pitchX*ie,V.root.rotation.x+=pe.legR.pitchX*ie,N.root.rotation.z+=pe.legL.rollZ*ie,V.root.rotation.z+=pe.legR.rollZ*ie,N.joint.rotation.x+=pe.legL.kneeX*ie,V.joint.rotation.x+=pe.legR.kneeX*ie,g.position.x+=pe.pelvisX*ie,g.position.y+=pe.pelvisY*ie,g.rotation.z+=pe.pelvisRoll*ie}_.rotation.y=O,ot=lh(O,a.chestYawScale,a.chestYawMaxDeg),m.rotation.y+=ot;const Vh=Gh;w.rotation.y=Fe(I.headYaw-I.bodyYaw-Vh-ot),St=xh({root:u,pelvis:g,lower:_,limbs:X,base:Fh,cfg:oa,grounded:I.grounded,attacking:ne})},lean(){return{forward:pt,side:Pt}},landing(){const I=id($t,ye,se,te,ve),F=se>0?Math.max(0,se-Math.max(0,$t-ye)):0;return{pulse:I,remaining:F,kind:I>0?xe:"none",impactVy:Lt}},hurt(){return zt},ik(){return St},attackBlend(){return J},attackWeights(){return{gaitScale:gt,attackLegWeight:mt,driveSpeed:Ot.speed,stridePhase:Ot.phase}},hipYaw(){return O},gaitDebug(){return{stopT:Dt,hipYaw:O,chestYaw:ot,speed:lt,gaitSpeed:Mt,stopStep:xt,stopShift:Ht,stopDip:at,stopYawFade:ut,turnStep:$,legLPitch:Yt.lp,legLRoll:Yt.lr,legRPitch:Yt.rp,legRRoll:Yt.rr}},gaitYaw(){return Zt},arrowDirection(){ft.updateWorldMatrix(!0,!1);const I=ft.matrixWorld.elements,F=I[8],k=I[9],st=I[10],rt=Math.hypot(F,k,st)||1;return{x:F/rt,y:k/rt,z:st/rt}},dispose(){u.traverse(I=>{if(I instanceof fe){I.geometry.dispose();const F=I.material;Array.isArray(F)?F.forEach(k=>k.dispose()):F.dispose()}})}}}function oM(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function rM(n,t,e){const i=Math.max(1,n.clientWidth),a=Math.max(1,n.clientHeight),s=new fv({antialias:!0});s.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),s.shadowMap.enabled=!0,s.shadowMap.type=wd,s.setSize(i,a,!1),n.appendChild(s.domElement);const o=new pv;o.background=new Wt("#12161d"),o.add(new _v(11061486,2764600,1.15));const r=new Mv(16773852,1.5);r.position.set(9,18,11),r.castShadow=!0,r.shadow.mapSize.set(1024,1024);const c=r.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,o.add(r);const l=[],d=new Re;for(const Z of t.boxes){const L=Z.maxX-Z.minX,it=Z.maxY-Z.minY,$=Z.maxZ-Z.minZ;let J=oM(Z.kind,e);Z.kind==="step"&&(J=new Wt(J).offsetHSL(0,0,Z.maxY*.09).getStyle());const mt=new Ea({color:J,transparent:!0,opacity:1}),gt=new fe(new An(L,it,$),mt);gt.position.set((Z.minX+Z.maxX)/2,(Z.minY+Z.maxY)/2,(Z.minZ+Z.maxZ)/2),gt.castShadow=Z.kind!=="ground",gt.receiveShadow=!0,gt.add(new eh(new gv(gt.geometry),new dc({color:10467020,transparent:!0,opacity:.32}))),d.add(gt),l.push(mt)}o.add(d);const f=t.gridMeta.maxX-t.gridMeta.minX,h=new Sv(f,f,4873328,3358797);h.position.y=.002,h.visible=e.showGrid,o.add(h);const u=sM(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=new Re,_=.9,m=new Re;m.position.y=_,u.group.position.y=-_,m.add(u.group),g.add(m),o.add(g);const p=t.dummies.map((Z,L)=>{const it=e.dummies.colors,$=it[L%it.length]??"#cccccc",J=Hv(e.voxel,e.colors,$,Z.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return J.group.traverse(mt=>{mt.userData.dummyId=Z.id}),o.add(J.group),J}),v=p.map(Z=>Z.group),M=new yv,x=e.groundRing,U=e.voxel.bodyWidth,R=sd(U,x.playerRadiusFactor),T=sd(U,x.dummyRadiusFactor),w=U*x.thicknessFactor,b=x.arcDeg*Math.PI/180;let y=0;const D=Uo({radius:R,thickness:w,arcRad:b,edgeFade:x.edgeFade,color:x.playerColor,opacity:x.playerOpacity,y:.028,renderOrder:6});D.mesh.name="player-ground-ring",o.add(D.mesh);const B=t.dummies.map(Z=>{const L=Uo({radius:T,thickness:w,arcRad:b,edgeFade:x.edgeFade,color:x.neutralColor,opacity:x.opacity,y:.022,renderOrder:5});return L.mesh.name=`dummy-ground-ring-${Z.id}`,o.add(L.mesh),L}),N=t.dummies.map(Z=>{const L=Uo({radius:T*x.haloRadiusFactor,thickness:w*x.haloThicknessFactor,arcRad:b,edgeFade:x.edgeFade,color:x.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return L.mesh.name=`dummy-ground-halo-${Z.id}`,o.add(L.mesh),L}),V=t.dummies.map(()=>0),P=t.dummies.map(()=>0),A=od({radius:R*x.meterRadiusFactor,thickness:w*x.meterThicknessFactor,arcRad:b,edgeFade:.06,color:x.meterColorCharge,y:.03,renderOrder:8});A.mesh.name="player-ground-meter",o.add(A.mesh);const X=t.dummies.map(Z=>{const L=od({radius:T*x.warnRadiusFactor,thickness:w*x.warnThicknessFactor,arcRad:b,edgeFade:.02,color:x.warnColor,y:.031,renderOrder:9});return L.mesh.name=`dummy-ground-warn-${Z.id}`,o.add(L.mesh),L}),H=rd({color:x.playerColor,y:.042,renderOrder:3});H.group.name="player-landing-preview",o.add(H.group);const q=new Wt,Q=new Wt(x.playerColor),dt=new Wt(x.neutralColor),ft=new Wt(x.lowThreatColor),vt=new Wt(x.highThreatColor),Y=new Wt(x.meterColorCharge),et=new Wt(x.meterColorChannel),_t=new Wt(x.meterColorCooldown),K=new Wt(x.warnColor),pt=new Re;o.add(pt);const Pt=new cn({color:12577023,transparent:!0,opacity:0,side:Ie,depthWrite:!1}),At=new Re;At.position.set(0,.95,.72),pt.add(At);const zt=new Re;zt.rotation.x=Jv(e.camera.pitchDeg),At.add(zt);const St=new fe(new Ns(.78,.045,6,24,Math.PI*1.15),Pt);zt.add(St);const bt=new uc(1,0),O=new cn({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),Zt=Array.from({length:16},()=>{const Z=new fe(bt,O);return Z.visible=!1,o.add(Z),Z}),Dt=Array.from({length:6},()=>{const Z=rd({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return Z.group.visible=!1,o.add(Z.group),Z}),Ct=new cn({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),wt=new fe(new An(.035,.035,.5),Ct);pt.add(wt);const yt=e.dash,Tt=new Ps(yt.ringRadius-.06,yt.ringRadius,28),C=Array.from({length:6},()=>{const Z=new cn({color:16777215,transparent:!0,opacity:0,side:Ie,depthWrite:!1}),L=new fe(Tt,Z);return L.rotation.x=-Math.PI/2,L.visible=!1,o.add(L),{mesh:L,mat:Z,life:0,base:1}});function S(Z,L,it,$,J){const mt=C.find(gt=>gt.life<=0)??C[0];mt.mat.color.set($),mt.mesh.position.set(Z,it+.04,L),mt.base=J,mt.mesh.scale.setScalar(J*.6),mt.mesh.visible=!0,mt.mat.opacity=.9,mt.life=yt.fxDuration}const G=e.links,ct=new Ps(G.ringRadius-.07,G.ringRadius,28),lt=Array.from({length:5},()=>{const Z=new cn({color:G.chargeColor,transparent:!0,opacity:0,side:Ie,depthWrite:!1}),L=new fe(ct,Z);return L.rotation.x=-Math.PI/2,L.visible=!1,o.add(L),{mesh:L,mat:Z,life:0,base:1}});function ot(Z,L,it,$){const J=lt.find(mt=>mt.life<=0)??lt[0];J.mesh.position.set(Z,it+.05,L),J.base=$,J.mesh.scale.setScalar($*.55),J.mesh.visible=!0,J.mat.opacity=.85,J.life=G.fxDuration}let It=t.playerLink.id,tt=t.playerLink.hitIds.length,xt=t.dash.id,Ht="none",at=0,Mt=-1,z=1;const nt=Ev(e.camera,e.smartCamera,e.zoom,i/a),ut=t.character.position;nt.update(ut.x,ut.y,ut.z,1,t.camera);function Ut(Z,L){if(v.length===0)return 0;const it=s.domElement.getBoundingClientRect(),$=new ae((Z-it.left)/it.width*2-1,-((L-it.top)/it.height)*2+1);M.setFromCamera($,nt.camera);const J=M.intersectObjects(v,!0);for(const mt of J){const gt=mt.object.userData.dummyId;if(gt&&gt>0)return gt}return 0}function Nt(Z,L,it){const $=s.domElement.getBoundingClientRect(),J=new j(Z,L,it).project(nt.camera);return{x:$.left+(J.x*.5+.5)*$.width,y:$.top+(-J.y*.5+.5)*$.height}}return{gaitDebug(){return u.gaitDebug()},render(Z,L){const it=Z.character,$=Z.combat;g.position.set(it.position.x,it.position.y,it.position.z),g.rotation.y=it.bodyYaw;const J=Z.dash.phase==="active"&&Z.dash.kind==="roll",mt=J&&Z.dash.duration>0?Math.min(1,1-Z.dash.timer/Z.dash.duration):0;m.rotation.x=J?mt*Math.PI*2:0,m.position.y=_-(J?.2*Math.sin(Math.PI*mt):0),u.update(it,$,Z.playerHurt,L,Z.abilities.channeling,Z.time,Z.playerLink,Z.turnInPlace);for(let Lt=0;Lt<p.length;Lt++)Z.dummies[Lt]&&p[Lt].update(Z.dummies[Lt],L);const gt=nt.camera.position,Ot=Math.atan2(gt.x-it.position.x,gt.z-it.position.z),Yt=Z.config.gaze.hurtHoldSec,Qt=Z.time-Z.playerHurt.lastAt,$t=Yt>0&&Qt>=0&&Qt<Yt?1-Qt/Yt:0,le=Xv(Z.gaze.active,Z.gaze.threat,$t,Z.time,x);Wv(q,Q,ft,vt,le.level),y=Kv(it.grounded,it.position.y,y),D.mesh.position.set(it.position.x,y+.028,it.position.z),D.update(le.arcRad,le.opacity,le.scale,q,Ot);const he=Zv({charging:$.charging,charge:$.charge,channeling:Z.abilities.channeling,fireTimer:Z.abilities.fireTimer,fireInterval:Z.config.abilities.arcane.fireInterval,dashCooldown:Z.dash.cooldown,dashCooldownMax:Z.dash.kind==="blink"?Z.config.dash.blinkCooldown:Z.config.dash.rollCooldown});A.mesh.position.set(it.position.x,it.position.y+.03,it.position.z),A.set(he.ratio,he.source==="none"?0:x.meterOpacity,he.source==="charge"?Y:he.source==="channel"?et:_t,Ot);const xe=Z.playerLink,ye=xe.weapon?Z.config.links.moves[xe.weapon]:void 0,se=qv(xe.phase,it.position.x,it.position.z,xe.facing,xe.travel,(ye==null?void 0:ye.hit.radius)??.9);H.set(se.x,se.z,.042,se.radius,se.active?x.landingOpacity:0,Z.time);for(let Lt=0;Lt<B.length;Lt++){const Bt=Z.dummies[Lt],ge=B[Lt],ee=N[Lt],Te=X[Lt];if(!Bt){ge.mesh.visible=!1,ee.mesh.visible=!1,Te.mesh.visible=!1;continue}const Ze=Z.targeting.hasTarget&&Z.targeting.targetId===Bt.id;if(Ku(Z,Bt)){const k=Ju(Z,Bt);q.copy(ft).lerp(vt,k)}else q.copy(dt);const qe=Yv(Bt.attackPhase,Bt.attackPhaseTimer,Z.config.dummies.attackWindup);qe.active?(q.lerp(K,.5*qe.urgency),Te.mesh.position.set(Bt.position.x,Bt.position.y+.031,Bt.position.z),Te.set(qe.ratio,x.warnOpacity*(.65+.35*qe.urgency),K,Ot)):Te.set(0,0,K,Ot);const ln=Ze?1:0,ni=ln>V[Lt]?x.haloFadeInSec:x.haloFadeOutSec;V[Lt]=cd(V[Lt],ln,L,ni);const E=V[Lt],W=1+.02*E*Math.sin(Z.time*2.2+Bt.id),I=x.arcDeg+(x.selectedArcDeg-x.arcDeg)*E;ge.mesh.position.set(Bt.position.x,Bt.position.y+.022,Bt.position.z),ge.update(I*Math.PI/180,x.opacity+(x.selectedOpacity-x.opacity)*E,1+(x.selectedScale-1)*E*W,q,Ot,1+(x.selectedThicknessScale-1)*E),P[Lt]=cd(P[Lt],ln,L,ln>P[Lt]?x.haloFadeInSec:x.haloFadeOutSec);const F=P[Lt];ee.mesh.position.set(Bt.position.x,Bt.position.y+.019,Bt.position.z),ee.update(I*Math.PI/180,x.haloOpacity*F*(.88+.12*Math.sin(Z.time*2.2+Bt.id)),x.selectedScale*(.94+.06*F)*W,q,Ot)}if(pt.position.set(it.position.x,it.position.y,it.position.z),pt.rotation.y=$.phase!=="idle"?$.attackFacing:it.bodyYaw,Z.dash.id!==xt){xt=Z.dash.id;const Lt=Z.dash;Ht=Lt.kind,Lt.kind==="blink"?(S(Lt.fromX,Lt.fromZ,it.position.y,yt.blinkColor,.9),S(Lt.toX,Lt.toZ,it.position.y,yt.blinkColor,1.35)):S(Lt.fromX,Lt.fromZ,it.position.y,yt.rollColor,1.1)}for(const Lt of C){if(Lt.life<=0)continue;Lt.life-=L;const Bt=Math.max(0,Lt.life/yt.fxDuration);Lt.mat.opacity=.9*Bt,Lt.mesh.scale.setScalar(Lt.base*(.6+(1-Bt)*1.2)),Lt.life<=0&&(Lt.mesh.visible=!1)}const te=Z.playerLink;te.id!==It&&(It=te.id,tt=te.hitIds.length,ot(it.position.x,it.position.z,it.position.y,1)),te.hitIds.length>tt?(tt=te.hitIds.length,ot(it.position.x,it.position.z,it.position.y,1.35)):te.hitIds.length<tt&&(tt=te.hitIds.length);for(const Lt of lt){if(Lt.life<=0)continue;Lt.life-=L;const Bt=Math.max(0,Lt.life/Math.max(G.fxDuration,1e-6));Lt.mat.opacity=.85*Bt,Lt.mesh.scale.setScalar(Lt.base*(.55+(1-Bt)*1.1)),Lt.life<=0&&(Lt.mesh.visible=!1)}$.attackId!==at&&(at=$.attackId,$.weapon==="bow"&&$.phase!=="idle"&&(Mt=0,z=.6+$.lastCharge*.9));const ve=$.phase==="active"&&$.comboIndex>0;Pt.opacity=ve?.78:0,ve&&(St.rotation.z=-1.2+$.attackProgress*3.2,St.scale.setScalar(.9+$.comboIndex*.13));for(let Lt=0;Lt<Zt.length;Lt++){const Bt=Z.abilities.projectiles[Lt],ge=Zt[Lt];ge.visible=!!Bt,Bt&&(ge.position.set(Bt.x,Bt.y,Bt.z),ge.scale.setScalar(Bt.radius),ge.rotation.y+=L*6)}for(let Lt=0;Lt<Dt.length;Lt++){const Bt=Z.abilities.rings[Lt],ge=Dt[Lt];if(!Bt){ge.group.visible=!1;continue}const ee=Math.max(0,Math.min(1,Bt.life/Math.max(Bt.duration,1e-6))),Te=jv(Math.max(0,Bt.duration-Bt.life),x.areaExpandSec);ge.set(Bt.x,Bt.z,.045,Bt.radius*Te.scale,x.areaOpacity*(.35+.65*ee)*Te.alpha,Z.time)}if(Mt>=0){Mt+=L;const Lt=Mt*14*z;wt.position.set(0,.85,.6+Lt),Ct.opacity=Lt<9?.95:0,Lt>=9&&(Mt=-1)}else Ct.opacity=0;nt.update(it.position.x,it.position.y,it.position.z,L,Z.camera),s.render(o,nt.camera)},resize(){const Z=Math.max(1,n.clientWidth),L=Math.max(1,n.clientHeight);s.setSize(Z,L,!1),nt.resize(Z/L)},getGroundBasis(){return nt.getGroundBasis()},setCollidersVisible(Z){for(const L of l)L.opacity=Z?.3:1,L.wireframe=Z,L.needsUpdate=!0},setGridVisible(Z){h.visible=Z},setZoom(Z){nt.setZoom(Z)},pickDummy:Ut,projectToScreen:Nt,diagnostics(){const Z=yh(e.camera.pitchDeg),L=Qv(Z,pt.rotation.y);return{lean:u.lean(),slashNormal:L,arrowForward:u.arrowDirection(),gait:{hipYaw:u.hipYaw(),gaitYaw:u.gaitYaw()},attackBlend:u.attackBlend(),attackWeights:u.attackWeights(),landing:u.landing(),hurt:u.hurt(),ik:u.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:m.rotation.x,activeRings:C.filter(it=>it.life>0).length,lastKind:Ht},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...nt.smart()}}},dispose(){u.dispose();for(const Z of p)Z.dispose();D.dispose();for(const Z of B)Z.dispose();for(const Z of N)Z.dispose();A.dispose();for(const Z of X)Z.dispose();H.dispose(),St.geometry.dispose(),Pt.dispose(),bt.dispose(),O.dispose();for(const Z of Dt)Z.dispose();wt.geometry.dispose(),Ct.dispose();for(const Z of C)Z.mat.dispose();Tt.dispose();for(const Z of lt)Z.mat.dispose();ct.dispose(),d.traverse(Z=>{Z instanceof fe&&Z.geometry.dispose()}),s.dispose(),s.domElement.remove()}}}async function cM(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function lM(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function dM(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=v=>e.querySelector(`#${v}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),d=i("diag-close"),f=i("diag-mask");let h=!1,u=!0,g=0;function _(){const v=n.status();a.textContent=v.enabled?`已记录 ${v.durationS.toFixed(1)}s · ${v.frames} 帧 · 事件 ${v.events} · 异常 ${v.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=v.enabled?"暂停记录":"继续记录"}function m(v){h=v,e.hidden=!v,v?_():s.hidden=!0}function p(v){o.textContent=v,window.clearTimeout(g),g=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation(),m(!h)}),d.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),o.addEventListener("click",()=>{const v=n.summary();cM(v).then(M=>{M?(p("已复制 ✓"),s.hidden=!0):(s.value=v,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const v=n.dump(),M=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);lM(`harness-${v.meta.version}-${M}.json`,JSON.stringify(v)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),s.hidden=!0,_(),p("已清空")}),l.addEventListener("click",()=>{u=!u,n.setEnabled(u),_()}),{tick(){const v=n.status();t==null||t.classList.toggle("is-alert",v.alert),h&&_()},isOpen:()=>h,close:()=>m(!1)}}const hM={intents:{...ld},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function uM(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=tf(Uf,Ff),i=rM(n,e,un),a=nf(e),s=up(t),o=fp(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.33 · 11-07 16:40 · 诊断");const c=y=>String(y).padStart(2,"0"),l=new Date,d=Pf({meta:{version:"v0.9.33",buildTime:"11-07 16:40",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=dM(d,r),h=lp({deadZone:()=>un.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&d.suspend(800)});const u={timeScale:1,paused:!1,showColliders:un.showColliders,showGrid:un.showGrid};let g=1;const _=vf({maxRadiusPx:()=>un.joystick.maxRadiusPx,deadZone:un.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>un.zoom}),m=Array.from(document.querySelectorAll(".wp[data-weapon]"));let p=e.combat.weapon;function v(y){if(y===p)return;p=y;const D=yi.indexOf(y)+1;for(const B of m)B.classList.toggle("is-active",Number(B.dataset.weapon)===D);U.refreshWeapon()}let M=hM,x=0;const U=qf(e,un,u,{singleStep:()=>a.singleStep(M.intents),reset:()=>{g=1,a.singleStep({...ld,resetPressed:!0})},resetZoom:()=>{g=1,i.setZoom(1)},onToggleColliders:y=>i.setCollidersVisible(y),onToggleGrid:y=>i.setGridVisible(y)});o.register({motion:h,debug:U.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:a,input:_,viewConfig:un,debug:u,getUserZoom:()=>g,getGestures:()=>M.gestures,getLastGesture:()=>M.lastGesture,telemetry:d,telemetrySummary:()=>d.summary(),dirDebug:h.dirDebug,dirAngles:()=>h.dirDebug.last(),motionDebug:h,speedDebug:()=>h.last(),speedSamples:()=>h.samples(),gaitDebug:()=>i.gaitDebug()};let R=performance.now(),T=60,w=0;function b(y){const D=Math.min((y-R)/1e3,.1);R=y,D>0&&(T=T*.9+1/D*.1);const B=_.sample();B.intents.resetPressed&&(g=1),g=lf(g,B.zoomScale,un.zoom.min,un.zoom.max),i.setZoom(g);let N=B.intents.dummyClickId;if(B.tap){const A=i.pickDummy(B.tap.x,B.tap.y);A>0&&(N=A)}N>0&&(x=N),M={...B,intents:{...B.intents,dummyClickId:x}};const V=a.frame(D,M.intents,u.timeScale,u.paused,()=>{const A=e.events;for(let X=0;X<A.length;X++)d.event(A[X],e.time)});V>0&&(x=0),d.sample(e,M,D*1e3,V);for(const A of M.gestures)d.gesture(A);y-w>250&&(w=y,f.tick()),v(e.combat.weapon),i.render(e,D),h.update(e,M,i.getGroundBasis());const P=i.diagnostics();s.update(e,T,V,M,u,{attackBlend:P.attackBlend,attackWeights:P.attackWeights,landing:P.landing,hurt:P.hurt,ik:P.ik,zoom:P.camera.zoom},o.hudCompact()),requestAnimationFrame(b)}requestAnimationFrame(b)}uM();
